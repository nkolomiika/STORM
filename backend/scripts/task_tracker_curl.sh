#!/usr/bin/env bash
# Прямые curl-проверки TT, в обход STORM. См. docs/TASK_TRACKER_CURL.md.
set -euo pipefail
umask 077
MODE="${1:-read}"
case "$MODE" in read|create|upload|link) ;; *) echo 'Режимы: read | create | upload | link'; exit 2 ;; esac
: "${WORKS_API_TOKEN:?Задайте WORKS_API_TOKEN через защищённое окружение}"
export WORKS_BASE_URL="${WORKS_BASE_URL:-https://portal.works.prod.sbt/swtr}"
export APPSEC_KEY="${APPSEC_KEY:-APPSEC-3291}" STS_KEY="${STS_KEY:-STS-217322}"
export TT_QUERY="${TT_QUERY:-}" WORKS_TENANT="${WORKS_TENANT:-default}"
OUTPUT="$(mktemp -d "${TMPDIR:-/tmp}/storm-tt-check.XXXXXXXX")"
AUTH="$OUTPUT/auth.headers"
trap 'rm -f "$AUTH"' EXIT
# Секрет не попадает в argv curl, в вывод или файл результатов.
python3 - "$AUTH" <<'PY'
import os, sys
from urllib.parse import urlsplit
token = os.environ['WORKS_API_TOKEN'].strip()
if token.lower().startswith('bearer '): token = token[7:].strip()
cookies = os.environ.get('WORKS_COOKIES', '')
if not token or any(ch in token+cookies for ch in '\r\n'):
    raise SystemExit('Недопустимый токен/cookie')
url = urlsplit(os.environ['WORKS_BASE_URL'])
if url.scheme != 'https' or not url.hostname or url.username or url.password or url.query or url.fragment:
    raise SystemExit('WORKS_BASE_URL должен быть HTTPS URL без секретов/query')
headers = ['Authorization: Bearer '+token, 'Accept: application/json, text/plain, */*', 'Origin: '+url.scheme+'://'+url.netloc]
if cookies: headers.append('Cookie: '+cookies)
with open(sys.argv[1], 'w') as f: f.write('\n'.join(headers)+'\n')
PY
BASE="${WORKS_BASE_URL%/}"
TLS=()
[[ -z "${TT_CA_BUNDLE:-}" ]] || TLS=(--cacert "$TT_CA_BUNDLE")
FAILURES=0
request() {
  local name="$1" method="$2" path="$3"; shift 3
  local status rc=0
  status=$(curl --silent --show-error --connect-timeout 10 --max-time 60 --max-filesize 10485760 \
    --proto '=https' "${TLS[@]}" --header "@$AUTH" --request "$method" \
    --output "$OUTPUT/$name.response" --write-out '%{http_code}' \
    "$BASE$path" "$@") || rc=$?
  # Не сохраняем Set-Cookie и другие заголовки авторизации. Редиректы не следуем.
  printf '%s\t%s\t%s\tcurl_exit=%s\n' "$name" "$method" "$status" "$rc" | tee -a "$OUTPUT/status.tsv"
  if [[ "$rc" != 0 || ! "$status" =~ ^2[0-9][0-9]$ ]]; then
    FAILURES=$((FAILURES+1))
  elif ! python3 "$(dirname "${BASH_SOURCE[0]}")/validate_tt_response.py" "$name" "$OUTPUT/$name.response"; then
    FAILURES=$((FAILURES+1))
  fi
}
json_request() {
  request "$1" POST "$2" --header 'Content-Type: application/json' --data-binary "@$3"
}
if [[ "$MODE" == read ]]; then
  python3 - "$OUTPUT" <<'PY'
import json, os, pathlib, re, sys
p=pathlib.Path(sys.argv[1])
if not re.fullmatch(r'APPSEC-[1-9][0-9]*', os.environ['APPSEC_KEY']) or not re.fullmatch(r'STS-[1-9][0-9]*', os.environ['STS_KEY']):
    raise SystemExit('Укажите корректные APPSEC_KEY и STS_KEY')
bodies={
 'tasks': {'attributes':['workflow_status','priority','assigned_to','affects_version_s'], 'calculatedAttributes':[], 'query':'space = "APPSEC" and suit = "security_assessment_appsec"', 'page':{'size':20,'page':0}, 'timeZone':'Europe/Moscow'},
 'references': {'space':'STS','withArchived':False,'withDeleted':False,'query':os.environ['TT_QUERY'],'page':{'page':0,'size':100}},
 'status': {'filters':{'units':[os.environ['STS_KEY']]},'attributes':['workflow_status'],'page':{'page':0,'size':1}},
}
for name,body in bodies.items(): (p/(name+'.json')).write_text(json.dumps(body,ensure_ascii=False))
PY
  json_request tasks "${WORKS_TASKS_SEARCH_PATH:-/rest/api/unit/v3/find/tql}" "$OUTPUT/tasks.json"
  request task-detail GET "/rest/api/unit/v2/$APPSEC_KEY?validatorEnabled=true"
  json_request components "${WORKS_COMPONENT_FIND_PATH:-/extension/plugin/v2/rest/api/sber_components_plugin/v1/component/find}" "$OUTPUT/references.json"
  json_request versions "${WORKS_VERSION_FIND_PATH:-/extension/plugin/v2/rest/api/swtr_task_tracker_plugin/v1/version/find}" "$OUTPUT/references.json"
  request products GET "${WORKS_PRODUCT_CODES_PATH:-/rest/api/suit/v1/bug_appsec}?validatorEnabled=true"
  json_request status "${WORKS_UNIT_FIND_PATH:-/rest/api/unit/v3/find}" "$OUTPUT/status.json"
elif [[ "$MODE" == create ]]; then
  : "${TT_CREATE_JSON:?Укажите путь к проверенному JSON создания STS}"
  json_request create "${WORKS_CREATE_PATH:-/rest/api/unit/v2/bug_appsec/create}" "$TT_CREATE_JSON"
elif [[ "$MODE" == upload ]]; then
  : "${TT_UPLOAD_FILE:?Укажите файл вложения}" "${TT_DRAFT_ID:?Укажите UUID черновика}" "${TT_FILE_ID:?Укажите UUID файла}"
  request upload POST "${WORKS_UPLOAD_PATH:-/rest/api/draft/files/v1/upload}" \
    --form "file=@$TT_UPLOAD_FILE" --form-string "fileName=$(basename "$TT_UPLOAD_FILE")" \
    --form-string "draftId=$TT_DRAFT_ID" --form-string "fileId=$TT_FILE_ID" \
    --form-string "relativePathPart=${TT_RELATIVE_PATH:-evidence}"
else
  export WORKS_LINK_TYPE="${WORKS_LINK_TYPE:-plain_connection}"
  python3 - "$OUTPUT/link.json" <<'PY'
import json, os, sys, re
for name,prefix in [('APPSEC_KEY','APPSEC'),('STS_KEY','STS')]:
    if not re.fullmatch(prefix+r'-[1-9][0-9]*', os.environ[name]): raise SystemExit('Некорректный ключ тикета')
with open(sys.argv[1], 'w') as f:
    json.dump({'source':os.environ['APPSEC_KEY'],'destination':os.environ['STS_KEY'],'type':os.environ['WORKS_LINK_TYPE']},f)
PY
  json_request link "${WORKS_LINK_PATH:-/rest/api/unit/v1/link}" "$OUTPUT/link.json"
fi
echo "Результаты: $OUTPUT (могут содержать данные тикетов; не публикуйте их целиком)."
echo '401: токен; 403: права/gateway; 404: путь или тикет; 422: тело; 5xx: TT/gateway; 000: сеть/TLS.'
[[ "$FAILURES" == 0 ]]
