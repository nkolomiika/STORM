# Прямые проверки Task Tracker через curl

Готовый файл: [task_tracker_curl.sh](../backend/scripts/task_tracker_curl.sh).
Требуются Bash, curl и Python 3. Запускайте с того же VPS/из того же контейнера,
где работает STORM: сетевые маршруты, DNS, корпоративный CA и права сервисной
учётки должны совпадать. Скрипт обращается непосредственно к TT, минуя API STORM.
Это диагностика соединения, а не гарантия исправности всех операций TT.

## Проверки чтения

Задайте `WORKS_API_TOKEN` через менеджер секретов либо скрытый ввод:

```bash
read -rs -p 'Токен сервисной учётки TT: ' WORKS_API_TOKEN; echo
export WORKS_API_TOKEN
export WORKS_BASE_URL=https://portal.works.prod.sbt/swtr
export APPSEC_KEY=APPSEC-3291 STS_KEY=STS-217322
# Если требуется внутренний CA:
# export TT_CA_BUNDLE=/path/to/corporate-ca.pem
# Необязательная статическая cookie, как в WORKS_COOKIES приложения:
# export WORKS_COOKIES=api_swtr_as21=true
export TT_QUERY='Platform V'
bash backend/scripts/task_tracker_curl.sh read
unset WORKS_API_TOKEN WORKS_COOKIES
```

Замените ключи примера на существующие тикеты, доступные сервисной учётке.
Не используйте браузерный токен другой учётки для сравнения. В контейнере скрипт
можно запускать как `bash scripts/task_tracker_curl.sh read`: переменные
`WORKS_*` уже поступают из окружения. Если пути менялись, задайте те же
`WORKS_*_PATH`. Тело TQL в скрипте — подтверждённый нативный запрос; если DevOps
переопределил `WORKS_TASKS_SEARCH_BODY`, сравните сохранённый `tasks.json` с ним.

| Проверка | Прямой запрос curl | Ожидаемый ответ |
|---|---|---|
| Tasks | POST `/rest/api/unit/v3/find/tql` | 200, `content[]` с `unit` и `attributes` |
| Карточка APPSEC | GET `/rest/api/unit/v2/{APPSEC_KEY}?validatorEnabled=true` | 200, `code`, `summary`, `attributes[]` |
| Компоненты | POST `/extension/plugin/v2/rest/api/sber_components_plugin/v1/component/find` | 200, `content[].code/name` |
| Версии | POST `/extension/plugin/v2/rest/api/swtr_task_tracker_plugin/v1/version/find` | 200, `content[].code/name` |
| Продукты STS | GET `/rest/api/suit/v1/bug_appsec?validatorEnabled=true` | 200, `attributes[code=product_code_list_sts].directoryValues` |
| Статус STS | POST `/rest/api/unit/v3/find` | 200, выбранный STS и `workflow_status` |

Все curl-команды видны в скрипте, тела сохраняются отдельно. Скрипт проверяет
сетевой exit code и HTTP 2xx, сохраняет `status.tsv` и файлы `.response` в новом
закрытом временном каталоге. Тело проверяйте по таблице: 200 с HTML-страницей
логина означает, что API-запрос перехвачен системой авторизации. Пустой
`content` при корректном JSON может означать отсутствие совпадений или прав.
Токен передаётся через временный файл заголовков (удаляется при завершении),
не через аргументы процесса; Set-Cookie и полные заголовки ответа не сохраняются.
Не запускайте скрипт с `bash -x`, не добавляйте `curl -v`/`-k` и не публикуйте
файлы ответов без очистки персональных данных. TLS-проверка включена.

## Операции записи — отдельные явные режимы

Эти режимы действительно создают объекты в TT. Для проверки используйте
согласованные тестовые тикеты. Они не запускаются в режиме `read`.

```bash
# Создание STS: подготовьте полный JSON по docs/diagnostics/sts-create.example.json,
# заменив продукт, компонент, версию, исполнителя и постановщика реальными кодами.
export TT_CREATE_JSON=/path/to/sts-create.json
bash backend/scripts/task_tracker_curl.sh create
# Ожидается 200/201 и {"id":"STS-..."}.

# Предзагрузка вложения: UUID должны совпадать с draftsInfo создаваемого STS.
export TT_UPLOAD_FILE=/path/to/evidence.txt
export TT_DRAFT_ID="$(python3 -c 'import uuid; print(uuid.uuid4())')"
export TT_FILE_ID="$(python3 -c 'import uuid; print(uuid.uuid4())')"
bash backend/scripts/task_tracker_curl.sh upload
# curl сам устанавливает multipart/form-data с boundary; JSON Content-Type здесь нет.

# Связь APPSEC -> STS: source=APPSEC_KEY, destination=STS_KEY.
export APPSEC_KEY=APPSEC-3291 STS_KEY=STS-NEW_ID
bash backend/scripts/task_tracker_curl.sh link
# Укажите реальный числовой STS_KEY; ожидается 2xx.
```

`create` отправляет POST `/rest/api/unit/v2/bug_appsec/create`, `upload` —
POST `/rest/api/draft/files/v1/upload`, `link` — POST `/rest/api/unit/v1/link`.
Поле `description` использует ProseMirror-объект либо null. Для INFO приоритет
`trivial`, `initial_criticality_cvss=null`; для остальных уровней указывается
ровно одна критичность. Вектор CVSS передаётся без префикса `CVSS:4.0/`.

## Как локализовать отказ

- `000`, curl exit 6/7/28/60: DNS, подключение, таймаут или CA. Это ещё не ответ TT.
- `301/302/307/308`: gateway/SSO-редирект; скрипт его намеренно не следует.
- `401`: TT/gateway отклонил токен. `403`: права учётки либо политика gateway.
- `404`: проверьте путь, ключ тикета и видимость для той же учётки.
- `422`: API получил запрос, но отклонил его форму/поля; смотрите `.response`.
- `5xx`: отказ TT или промежуточного gateway; проверьте тело и время запроса.
- Прямой curl работает, STORM нет: сопоставьте путь, тело, токен, CA и сетевое
  окружение. Найдите `task_tracker_request_started`, `task_tracker_response` и
  `task_tracker_request_failed` по `request_id` ошибки STORM.

Для разбора достаточно имени проверки, времени, HTTP-статуса, `curl_exit`,
`request_id` STORM и обезличенной ошибки TT. Секреты пересылать не нужно.
