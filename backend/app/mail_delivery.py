"""Публичные состояния доставки писем без SMTP-диагностики и содержимого письма."""
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Invitation, MailJob

MAIL_ERRORS = {
    'mail_unavailable': 'Письмо не отправлено: почтовый сервис недоступен. Попробуйте позже.',
    'mail_auth_failed': 'Письмо не отправлено. Администратору нужно проверить настройки почтового сервиса.',
}


def mail_error_code(error: Exception) -> str:
    """Классифицирует сбой SMTP/OAuth; технический текст не возвращается пользователю."""
    text = (type(error).__name__ + ' ' + str(error)).lower()
    return 'mail_auth_failed' if any(word in text for word in ('authentication', 'oauth', '535', 'credentials')) else 'mail_unavailable'


async def invitation_delivery(db: AsyncSession, invitations: list[Invitation]) -> dict[int, dict]:
    """Возвращает последние состояния писем одним запросом, не загружая их payload/секреты."""
    if not invitations:
        return {}
    identifier = MailJob.payload['invitation_id'].as_integer()
    ranked = select(identifier.label('invitation_id'), MailJob.status,
                    MailJob.payload['delivery_error_code'].as_string().label('code'),
                    MailJob.last_error.is_not(None).label('has_error'),
                    func.row_number().over(partition_by=identifier, order_by=MailJob.id.desc()).label('position')).where(
                        MailJob.template == 'invitation', MailJob.recipient_email.in_([item.email for item in invitations]), identifier.in_([item.id for item in invitations])).subquery()
    rows = (await db.execute(select(ranked).where(ranked.c.position == 1))).mappings().all()
    result = {}
    for row in rows:
        code = row['code'] if row['code'] in MAIL_ERRORS else ('mail_unavailable' if row['has_error'] else None)
        if row['status'] == 'sent':
            code = None
        result[row['invitation_id']] = {'email_status': row['status'], 'email_error': MAIL_ERRORS.get(code), 'email_error_code': code}
    return result
