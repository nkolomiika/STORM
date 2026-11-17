/** Проверяемые ошибки пользовательского ввода, которые можно показать без технических деталей. */
export class UserInputError extends Error {}

const technical = /traceback|sqlalchemy|asyncpg|psycopg|pydantic|\b\w+Error\b|Exception:|ECONN\w+|ENOTFOUND|CERTIFICATE_VERIFY_FAILED|\[Errno|connection refused|SELECT .+ FROM |INSERT INTO |Bearer |access_token|client_secret|password=|<html|<!doctype|Request failed with status code/i;

/** Отбрасывает HTML, диагностику библиотек, трассировки и слишком длинные ответы. */
export function safeErrorDetail(value: string | null): string | null {
  return value && value.length <= 1200 && !technical.test(value) ? value : null;
}

/** Сообщения по стабильному коду сервера; внутренние detail при 5xx не отображаются. */
export const ERROR_MESSAGES: Record<string, string> = {
  storage_unavailable: "File storage is temporarily unavailable. Try again later.",
  mail_not_configured: "Email delivery is not configured. Contact an administrator.",
  mail_unavailable: "Email could not be sent. The mail service is unavailable. Try again later.",
  mail_auth_failed: "Email could not be sent. Ask an administrator to check the mail settings.",
  task_tracker_not_configured: "Task Tracker is not configured. Contact an administrator.",
  task_tracker_unavailable: "Task Tracker is temporarily unavailable. Try again later.",
  task_tracker_auth_failed: "Task Tracker rejected authentication. Ask an administrator to check the integration token.",
  task_tracker_forbidden: "The integration account does not have permission in Task Tracker. Contact an administrator.",
  secret_decryption_failed: "Saved secrets could not be decrypted. Ask an administrator to restore the encryption key.",
  internal_error: "Something went wrong. Try again later.",
};

/** Разрешает только собственные коды справочника, исключая prototype-поля и произвольные ответы. */
export function errorMessageForCode(code: unknown): string | null {
  return typeof code === "string" && Object.hasOwn(ERROR_MESSAGES, code) ? ERROR_MESSAGES[code] : null;
}
