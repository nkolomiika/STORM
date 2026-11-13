# backend/app/storage/minio_client.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **7**.

## MinioStorage.__init__

[backend/app/storage/minio_client.py:14](../../../../../backend/app/storage/minio_client.py#L14)

```python
def __init__(self) -> None
```

Создаёт экземпляр и сохраняет его зависимости; параметры перечислены ниже.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Minio`

</details>

## MinioStorage.ensure_bucket

[backend/app/storage/minio_client.py:23](../../../../../backend/app/storage/minio_client.py#L23)

```python
def ensure_bucket(self) -> None
```

Создаёт бакет, если он отсутствует.

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.client.bucket_exists`
- `self.client.make_bucket`

</details>

## MinioStorage.upload_bytes

[backend/app/storage/minio_client.py:28](../../../../../backend/app/storage/minio_client.py#L28)

```python
def upload_bytes(self, content: bytes, content_type: str, original_name: str) -> str
```

Загружает файл в MinIO и возвращает ключ объекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `content` | `bytes` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `content_type` | `str` | `обязательный` | MIME-тип содержимого. |
| `original_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `BytesIO`
- `len`
- `self.client.put_object`
- `uuid4`

</details>

## MinioStorage.download_bytes

[backend/app/storage/minio_client.py:40](../../../../../backend/app/storage/minio_client.py#L40)

```python
def download_bytes(self, object_key: str) -> bytes
```

Скачивает файл по ключу объекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `object_key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bytes`.

<details>
<summary>Прямые вызовы в теле</summary>

- `response.close`
- `response.read`
- `response.release_conn`
- `self.client.get_object`

</details>

## MinioStorage.upload_bytes_with_key

[backend/app/storage/minio_client.py:49](../../../../../backend/app/storage/minio_client.py#L49)

```python
def upload_bytes_with_key(self, key: str, content: bytes, content_type: str) -> str
```

Загружает объект под явным ключом (без генерации uuid).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `content` | `bytes` | `обязательный` | Текст содержимого; формат определяется вызывающим сервисом. |
| `content_type` | `str` | `обязательный` | MIME-тип содержимого. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `BytesIO`
- `len`
- `self.client.put_object`

</details>

## MinioStorage.download_with_content_type

[backend/app/storage/minio_client.py:60](../../../../../backend/app/storage/minio_client.py#L60)

```python
def download_with_content_type(self, object_key: str) -> tuple[bytes, str]
```

Скачивает объект вместе с его content-type.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `object_key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[bytes, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.client.stat_object`
- `self.download_bytes`

</details>

## MinioStorage.delete

[backend/app/storage/minio_client.py:66](../../../../../backend/app/storage/minio_client.py#L66)

```python
def delete(self, object_key: str) -> None
```

Удаляет объект из MinIO.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `object_key` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `self.client.remove_object`

</details>
