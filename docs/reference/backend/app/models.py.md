# backend/app/models.py

Сгенерировано из объявлений кода. [Правила чтения](../../../METHODS.md).

Методов и именованных функций: **7**.

## User.avatar_url

[backend/app/models.py:92](../../../../backend/app/models.py#L92)

```python
def avatar_url(self) -> str | None
```

В теле вызывает `int`, `self.avatar_uploaded_at.timestamp`.

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `int`
- `self.avatar_uploaded_at.timestamp`

</details>

## Invitation.is_expired

[backend/app/models.py:196](../../../../backend/app/models.py#L196)

```python
def is_expired(self) -> bool
```

Приглашение ещё в статусе pending, но срок жизни ссылки истёк.

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `datetime.now`

</details>

## PasswordResetToken.is_usable

[backend/app/models.py:218](../../../../backend/app/models.py#L218)

```python
def is_usable(self) -> bool
```

Ссылку ещё не использовали и она не истекла.

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `datetime.now`

</details>

## AccountReactivationToken.is_usable

[backend/app/models.py:241](../../../../backend/app/models.py#L241)

```python
def is_usable(self) -> bool
```

Ссылку ещё не использовали и она не истекла.

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `datetime.now`

</details>

## ProjectNote.created_by_username

[backend/app/models.py:366](../../../../backend/app/models.py#L366)

```python
def created_by_username(self) -> str | None
```

Имя автора заметки для ProjectNoteOut.

Возвращает: `str \| None`.

## ProjectCredential.created_by_username

[backend/app/models.py:422](../../../../backend/app/models.py#L422)

```python
def created_by_username(self) -> str | None
```

Имя автора креда для ProjectCredentialOut.

Возвращает: `str \| None`.

## Vulnerability.created_by_username

[backend/app/models.py:744](../../../../backend/app/models.py#L744)

```python
def created_by_username(self) -> str | None
```

Имя автора находки для VulnerabilityOut.

Возвращает: `str \| None`.
