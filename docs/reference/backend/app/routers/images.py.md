# backend/app/routers/images.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **2**.

## upload_project_image

[backend/app/routers/images.py:30](../../../../../backend/app/routers/images.py#L30)

```python
async def upload_project_image(project_id: int, file: UploadFile=UploadApiFile(...), _: None=Depends(enforce_csrf), _user: User=Depends(get_current_user), _project=Depends(require_project_access)) -> dict
```

Загружает картинку проекта и возвращает URL для вставки в markdown.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `file` | `UploadFile` | `UploadApiFile(...)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_` | `None` | `Depends(enforce_csrf)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict`.

Dependencies: `enforce_csrf`, `get_current_user`, `require_project_access`.

Маршруты:

```python
router.post('/projects/{project_id}/images', status_code=201)
```

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
ValidationError('Изображение больше 10 МБ')
ValidationError('Поддерживаются только изображения PNG, JPEG, GIF или WEBP')
ValidationError('Пустой файл')
ValidationError('Файл не является корректным изображением')
ValueError('Unsupported image')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `(file.content_type or '').lower`
- `BytesIO`
- `Image.MIME.get`
- `Image.open`
- `MinioStorage`
- `ValidationError`
- `ValueError`
- `_ALLOWED_EXT.get`
- `asyncio.to_thread`
- `image.verify`
- `len`
- `read_upload`
- `uuid4`

</details>

## download_project_image

[backend/app/routers/images.py:64](../../../../../backend/app/routers/images.py#L64)

```python
async def download_project_image(project_id: int, image_name: str, _user: User=Depends(get_current_user), _project=Depends(require_project_access)) -> Response
```

Отдаёт картинку проекта (доступ — только участникам проекта).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project_id` | `int` | `обязательный` | ID проекта; доступ проверяет dependency маршрута, принадлежность ресурса — сервис. |
| `image_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `_user` | `User` | `Depends(get_current_user)` | Определяется именем/типом и контрактом вызывающего кода. |
| `_project` | `не аннотирован` | `Depends(require_project_access)` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Response`.

Dependencies: `get_current_user`, `require_project_access`.

Маршруты:

```python
router.get('/projects/{project_id}/images/{image_name}/download')
```

Явные raise в теле (исключения вызываемых методов могут добавляться):

```python
NotFoundError('Изображение не найдено')
```

<details>
<summary>Прямые вызовы в теле</summary>

- `MinioStorage`
- `NotFoundError`
- `Response`
- `_IMAGE_NAME_RE.match`
- `asyncio.to_thread`

</details>
