# Документация STORM

Для знакомства с действующим кодом начните с [руководства разработчика](DEVELOPER_GUIDE.md).

| Документ | Содержимое |
| --- | --- |
| [SECURITY_AUDIT.md](SECURITY_AUDIT.md) | Проверки плохих данных, исправления безопасности, аудит зависимостей и остаточные риски |
| [TEST_COVERAGE.md](TEST_COVERAGE.md) | Измеренное покрытие, оставшиеся пробелы, проверка командных инъекций и условие push |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | Запуск, карта модулей, правила API/ORM/UI, основные процессы, обновление документации |
| [METHODS.md](METHODS.md) | Каталог каждого объявленного Python-метода и каждой именованной TypeScript-функции, ссылки на код |
| [API_REFERENCE.md](API_REFERENCE.md) | Все 165 HTTP-операций: параметры, тело, ответы |
| [API_SCHEMAS.md](API_SCHEMAS.md) | Поля request/response, nullable, required и ограничения |
| [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md) | Найденные узкие места, исправленные дефекты и ограничения масштабирования |
| [PERFORMANCE.md](PERFORMANCE.md) | Методика нагрузки, данные до/после, SQL-планы, команды повторения |
| [QA_AUDIT.md](QA_AUDIT.md) | Исправленные HTTP 500, проверки доступа и функциональные тесты |
| [DB_SCHEMA.md](DB_SCHEMA.md) | Модель хранения данных |
| [ARCH.md](ARCH.md), [ARCH_DIAGRAMS.md](ARCH_DIAGRAMS.md) | Более широкое описание архитектуры и диаграммы; исторические детали сверяйте с кодом и руководством |
| [DEVOPS.md](DEVOPS.md), [DEV_RULES.md](DEV_RULES.md) | Эксплуатация и правила разработки |
| [USE_CASES.md](USE_CASES.md), [TEST_CASES.md](TEST_CASES.md) | Пользовательские сценарии и тест-кейсы |

Статические спецификации [openapi-v1.json](openapi-v1.json) и [openapi-v2.json](openapi-v2.json) подходят для offline-чтения, сравнения изменений и импорта в API-клиент. v1 содержит 113 путей и 153 операции; v2 — 10 путей и 12 операций. Число URL не равно числу HTTP-методов.

Swagger запущенного приложения доступен после авторизации по `/api/v1/docs` и `/api/v2/docs`. Точная процедура пересоздания спецификаций и каталога методов приведена в [руководстве](DEVELOPER_GUIDE.md).
