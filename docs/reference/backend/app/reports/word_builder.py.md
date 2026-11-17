# backend/app/reports/word_builder.py

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **126**.

## _heading_size_pt_for_level

[backend/app/reports/word_builder.py:73](../../../../../backend/app/reports/word_builder.py#L73)

```python
def _heading_size_pt_for_level(level: int | None) -> float | None
```

Возвращает требуемый размер шрифта (pt) для заголовка указанного уровня.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `level` | `int \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `float \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `max`

</details>

## load_template

[backend/app/reports/word_builder.py:150](../../../../../backend/app/reports/word_builder.py#L150)

```python
def load_template(kind: ReportKind) -> DocxDocument
```

Загружает оригинальный шаблон Word из bundled-файлов.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `kind` | `ReportKind` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `DocxDocument`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Document`
- `str`

</details>

## _set_all_sections_landscape

[backend/app/reports/word_builder.py:156](../../../../../backend/app/reports/word_builder.py#L156)

```python
def _set_all_sections_landscape(doc: DocxDocument) -> None
```

Переводит все секции документа в альбомную ориентацию.

Используется для ПП-отчёта (внутренняя приёмка): все страницы должны быть
горизонтальными. Меняем `orientation` и swap-аем `page_width` <-> `page_height`,
т.к. python-docx не делает это автоматически.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

## parse_cvss_vector

[backend/app/reports/word_builder.py:172](../../../../../backend/app/reports/word_builder.py#L172)

```python
def parse_cvss_vector(vector: str | None) -> dict[str, str]
```

Разбирает CVSS-вектор и возвращает читабельные значения по каждой метрике.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vector` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[str, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `CVSS4_METRIC_LABELS[key].get`
- `key.strip`
- `key.strip().upper`
- `part.partition`
- `value.strip`
- `value.strip().upper`
- `vector.strip`
- `vector.strip().split`

</details>

## severity_label

[backend/app/reports/word_builder.py:188](../../../../../backend/app/reports/word_builder.py#L188)

```python
def severity_label(value: Severity | str | None) -> str
```

Возвращает русскоязычное обозначение уровня риска.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `Severity \| str \| None` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SEVERITY_RU.get`
- `Severity`
- `isinstance`

</details>

## _format_date

[backend/app/reports/word_builder.py:200](../../../../../backend/app/reports/word_builder.py#L200)

```python
def _format_date(value: object) -> str
```

В теле вызывает `str`, `value.strftime`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `object` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `str`
- `value.strftime`

</details>

## _clear_paragraph_inline

[backend/app/reports/word_builder.py:209](../../../../../backend/app/reports/word_builder.py#L209)

```python
def _clear_paragraph_inline(paragraph: Paragraph) -> object | None
```

Удаляет все inline-элементы параграфа (runs, hyperlinks, …), сохраняет только pPr.

Возвращает rPr первого исходного run для повторного использования.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `object \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `child.tag.split`
- `copy.deepcopy`
- `first_run.find`
- `list`
- `paragraph._element.remove`
- `qn`

</details>

## _apply_run_font

[backend/app/reports/word_builder.py:230](../../../../../backend/app/reports/word_builder.py#L230)

```python
def _apply_run_font(run: Run, *, font_size_pt: float | None=REPORT_FONT_SIZE_PT, color: RGBColor | None=None, bold: bool | None=None) -> None
```

Принудительно проставляет SB Sans Display, размер и цвет на run.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `run` | `Run` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `font_size_pt` | `float \| None` | `REPORT_FONT_SIZE_PT` | Определяется именем/типом и контрактом вызывающего кода. |
| `color` | `RGBColor \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `bold` | `bool \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `Pt`
- `qn`
- `rFonts.set`
- `rPr.find`
- `rPr.insert`
- `run._element.get_or_add_rPr`

</details>

## _set_paragraph_text

[backend/app/reports/word_builder.py:253](../../../../../backend/app/reports/word_builder.py#L253)

```python
def _set_paragraph_text(paragraph: Paragraph, text: str, *, font_size_pt: float | None=REPORT_FONT_SIZE_PT, color: RGBColor | None=None, bold: bool | None=None) -> None
```

Полностью заменяет текст параграфа, очищая run/hyperlink-содержимое и сохраняя стиль run.

По умолчанию принудительно проставляет шрифт SB Sans Display 11 пт.

Для заголовков (H1-H9) размер шрифта и bold НЕ форсятся — они должны
наследоваться от paragraph-стиля и сохранённого rPr (иначе H3-заголовок
«Исследование стенда …» сжимается с ~14 пт до 11 пт). Цвет, если задан,
применяется в любом случае.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `font_size_pt` | `float \| None` | `REPORT_FONT_SIZE_PT` | Определяется именем/типом и контрактом вызывающего кода. |
| `color` | `RGBColor \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `bold` | `bool \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_apply_run_font`
- `_clear_paragraph_inline`
- `_force_run_font_size_pt`
- `_heading_level`
- `_heading_size_pt_for_level`
- `paragraph.add_run`
- `qn`
- `run._element.find`
- `run._element.insert`
- `run._element.remove`

</details>

## _force_run_font_size_pt

[backend/app/reports/word_builder.py:291](../../../../../backend/app/reports/word_builder.py#L291)

```python
def _force_run_font_size_pt(run: Run, size_pt: float) -> None
```

Жёстко проставляет на run-элемент `<w:sz>` и `<w:szCs>` указанного размера.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `run` | `Run` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `size_pt` | `float` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `int`
- `qn`
- `round`
- `rpr.append`
- `rpr.find`
- `run._element.get_or_add_rPr`
- `str`
- `sz.set`
- `sz_cs.set`

</details>

## _set_heading_text

[backend/app/reports/word_builder.py:307](../../../../../backend/app/reports/word_builder.py#L307)

```python
def _set_heading_text(paragraph: Paragraph, text: str) -> None
```

Алиас `_set_paragraph_text` для явной семантики «правим заголовок».

Внутри `_set_paragraph_text` уже автоматически распознаёт заголовки и
оставляет размер шрифта/жирность за стилем; этот хелпер существует ради
читаемости вызывающего кода.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_set_paragraph_text`

</details>

## _replace_in_paragraph

[backend/app/reports/word_builder.py:317](../../../../../backend/app/reports/word_builder.py#L317)

```python
def _replace_in_paragraph(paragraph: Paragraph, old: str, new: str) -> bool
```

Заменяет первое вхождение `old` на `new` в тексте параграфа.

Если `old` содержится целиком в одном run, изменяется только этот run.
Иначе весь параграф нормализуется в один run (с потерей mixed-форматирования).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `old` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `new` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_apply_run_font`
- `_set_paragraph_text`
- `paragraph.text.replace`
- `run.text.replace`

</details>

## _set_cell_text

[backend/app/reports/word_builder.py:337](../../../../../backend/app/reports/word_builder.py#L337)

```python
def _set_cell_text(cell: _Cell, text: str, *, font_size_pt: float | None=REPORT_FONT_SIZE_PT, color: RGBColor | None=None, bold: bool | None=None) -> None
```

Заменяет содержимое ячейки, оставляя только один параграф со стилем шаблона.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `cell` | `_Cell` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `font_size_pt` | `float \| None` | `REPORT_FONT_SIZE_PT` | Определяется именем/типом и контрактом вызывающего кода. |
| `color` | `RGBColor \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |
| `bold` | `bool \| None` | `None` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_apply_run_font`
- `_set_paragraph_text`
- `cell.add_paragraph`
- `new_p.add_run`
- `p._element.getparent`
- `p._element.getparent().remove`

</details>

## _heading_level

[backend/app/reports/word_builder.py:357](../../../../../backend/app/reports/word_builder.py#L357)

```python
def _heading_level(paragraph: Paragraph) -> int | None
```

Возвращает уровень заголовка (1-9) для параграфа или None для обычного текста.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(style.name or '').strip`
- `int`
- `match.group`
- `re.match`

</details>

## _iter_body_paragraphs

[backend/app/reports/word_builder.py:369](../../../../../backend/app/reports/word_builder.py#L369)

```python
def _iter_body_paragraphs(doc: DocxDocument) -> list[Paragraph]
```

Возвращает список параграфов верхнего уровня в порядке следования.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Paragraph]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `list`

</details>

## _iter_all_paragraphs

[backend/app/reports/word_builder.py:374](../../../../../backend/app/reports/word_builder.py#L374)

```python
def _iter_all_paragraphs(doc: DocxDocument) -> list[Paragraph]
```

Все `w:p` в документе, включая параграфы внутри текстовых полей (txbxContent).

Используется для обработки обложки/футеров, где надписи живут не в основном
потоке, а внутри `<w:drawing>/<wp:anchor>/.../<w:txbxContent>`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Paragraph]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `body.iter`
- `paragraphs.append`
- `qn`

</details>

## _block_elements_until_heading

[backend/app/reports/word_builder.py:387](../../../../../backend/app/reports/word_builder.py#L387)

```python
def _block_elements_until_heading(start_para: Paragraph, max_stop_level: int=2) -> list
```

Собирает XML-элементы от стартового параграфа до следующего заголовка ≤ max_stop_level.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `start_para` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `max_stop_level` | `int` | `2` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_heading_level`
- `body.iterchildren`
- `children.index`
- `elements.append`
- `list`
- `qn`
- `start_para._element.getparent`

</details>

## _normalize_label

[backend/app/reports/word_builder.py:406](../../../../../backend/app/reports/word_builder.py#L406)

```python
def _normalize_label(text: str) -> str
```

В теле вызывает `re.sub`, `re.sub('\\s+', ' ', text or '').strip`, `re.sub('\\s+', ' ', text or '').strip().lower`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `re.sub`
- `re.sub('\\s+', ' ', text or '').strip`
- `re.sub('\\s+', ' ', text or '').strip().lower`

</details>

## _hosts_text

[backend/app/reports/word_builder.py:410](../../../../../backend/app/reports/word_builder.py#L410)

```python
def _hosts_text(hosts: Iterable[Host]) -> str
```

В теле вызывает `', '.join`, `parts.append`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `hosts` | `Iterable[Host]` | `обязательный` | Набор хостов для обработки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `', '.join`
- `parts.append`

</details>

## _vuln_host_address

[backend/app/reports/word_builder.py:419](../../../../../backend/app/reports/word_builder.py#L419)

```python
def _vuln_host_address(vuln: Vulnerability, indexes: dict) -> str
```

В теле вызывает `host_by_id.get`, `indexes['assets_by_vuln_id'].get`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `host_by_id.get`
- `indexes['assets_by_vuln_id'].get`

</details>

## _vuln_card_label

[backend/app/reports/word_builder.py:429](../../../../../backend/app/reports/word_builder.py#L429)

```python
def _vuln_card_label(value: str, *, kind: ReportKind, vuln: Vulnerability, indexes: dict, project: Project) -> str
```

Возвращает значение ячейки метрик-таблицы по русскому названию строки.

Возвращает пустую строку, если данных нет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |
| `kind` | `ReportKind` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_normalize_label`
- `_vuln_host_address`
- `label.startswith`
- `metrics.get`
- `parse_cvss_vector`
- `severity_label`

</details>

## _set_cell_label_and_score

[backend/app/reports/word_builder.py:478](../../../../../backend/app/reports/word_builder.py#L478)

```python
def _set_cell_label_and_score(cell: _Cell, *, score_text: str, vector_text: str, color: RGBColor | None, font_size_pt: float=VULN_TABLE_FONT_SIZE_PT) -> None
```

Спец-обработчик ячейки CVSS: красит только число, вектор остаётся нейтральным.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `cell` | `_Cell` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `score_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vector_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `color` | `RGBColor \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `font_size_pt` | `float` | `VULN_TABLE_FONT_SIZE_PT` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_apply_run_font`
- `_clear_paragraph_inline`
- `cell.add_paragraph`
- `p._element.getparent`
- `p._element.getparent().remove`
- `target.add_run`

</details>

## _set_cell_shading

[backend/app/reports/word_builder.py:514](../../../../../backend/app/reports/word_builder.py#L514)

```python
def _set_cell_shading(cell: _Cell, fill_hex: str) -> None
```

Заливает фон ячейки цветом fill_hex (например, D9D9D9 — светло-серый).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `cell` | `_Cell` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `fill_hex` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `qn`
- `shd.set`
- `tc.find`
- `tc.insert`
- `tcPr.append`
- `tcPr.find`

</details>

## _set_cell_width_pct

[backend/app/reports/word_builder.py:530](../../../../../backend/app/reports/word_builder.py#L530)

```python
def _set_cell_width_pct(cell: _Cell, pct_w: str) -> None
```

Задаёт ширину ячейки в процентах (значение `w` для tcW type=pct).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `cell` | `_Cell` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `pct_w` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `qn`
- `tc.find`
- `tc.insert`
- `tcPr.append`
- `tcPr.find`
- `tcW.set`

</details>

## _apply_szi_vuln_table_geometry

[backend/app/reports/word_builder.py:545](../../../../../backend/app/reports/word_builder.py#L545)

```python
def _apply_szi_vuln_table_geometry(table: Table) -> None
```

Выставляет на ПП-карточке тот же tblGrid/tcW, что и в СЗИ-шаблоне.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `table` | `Table` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_set_cell_width_pct`
- `cols[0].set`
- `cols[1].set`
- `len`
- `qn`
- `tbl.find`
- `tblGrid.findall`

</details>

## _normalize_vuln_card_table_to_szi

[backend/app/reports/word_builder.py:560](../../../../../backend/app/reports/word_builder.py#L560)

```python
def _normalize_vuln_card_table_to_szi(table: Table) -> None
```

Приводит карточную таблицу уязвимости (любой шаблон) к СЗИ-разметке.

Шаблон ПП использует устаревшую CVSS 3.x-структуру: 13 строк без «Требования
к атаке (AT)», без секций «Показатели воздействия на уязвимую/последующие
системы» и без суффиксов (AV)/(AC)/(VC)/(SC)/.... Шаблон СЗИ — современная
CVSS 4.0-разметка из 18 строк.

Чтобы карточки в обоих отчётах выглядели одинаково (и заполнялись одной
логикой `_fill_card_table`), переразмечаем PP-таблицу на лету:
  • переименовываем существующие строки (добавляем суффиксы метрик),
  • заменяем «Влияние на другие компоненты системы» на заголовок секции
    «Показатели воздействия на уязвимую систему»,
  • вставляем недостающие строки: AT, заголовок «Показатели воздействия на
    последующие системы» и три SC/SI/SA-метрики,
  • выставляем tblGrid/tcW как в СЗИ (узкая колонка значений, широкая
    колонка названий — иначе у ПП они «перевёрнуты»),
  • заливаем серым (D9D9D9) обе строки-заголовки секций воздействия.

Функция идемпотентна: если таблица уже соответствует СЗИ-разметке (18 строк
с правильными названиями), ничего не меняется (заливка/ширины тоже
идемпотентны).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `table` | `Table` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_apply_szi_vuln_table_geometry`
- `_clone_row_at`
- `_find_row_idx`
- `_normalize_label`
- `_rename`
- `_set_cell_shading`
- `any`
- `l.startswith`

</details>

## _normalize_vuln_card_table_to_szi._find_row_idx

[backend/app/reports/word_builder.py:593](../../../../../backend/app/reports/word_builder.py#L593)

```python
def _find_row_idx(predicate) -> int | None
```

В теле вызывает `enumerate`, `predicate`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `predicate` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `enumerate`
- `predicate`

</details>

## _normalize_vuln_card_table_to_szi._rename

[backend/app/reports/word_builder.py:599](../../../../../backend/app/reports/word_builder.py#L599)

```python
def _rename(idx: int, new_label: str) -> None
```

В теле вызывает `_normalize_label`, `_set_cell_text`, `len`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `idx` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `new_label` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_normalize_label`
- `_set_cell_text`
- `len`

</details>

## _normalize_vuln_card_table_to_szi._clone_row_at

[backend/app/reports/word_builder.py:606](../../../../../backend/app/reports/word_builder.py#L606)

```python
def _clone_row_at(template_idx: int, new_label: str, after_idx: int) -> int
```

Клонирует строку `template_idx` и вставляет её после `after_idx`.

Возвращает индекс новой строки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `template_idx` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `new_label` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `after_idx` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_normalize_label`
- `_set_cell_text`
- `anchor_tr.addnext`
- `copy.deepcopy`
- `labels_norm.insert`
- `len`

</details>

## _fill_card_table

[backend/app/reports/word_builder.py:682](../../../../../backend/app/reports/word_builder.py#L682)

```python
def _fill_card_table(table: Table, *, kind: ReportKind, vuln: Vulnerability, indexes: dict, project: Project) -> None
```

В теле вызывает `SEVERITY_COLORS.get`, `_apply_run_font`, `_normalize_label`, `_normalize_vuln_card_table_to_szi`, `_set_cell_label_and_score`, `_set_cell_text`, `_vuln_card_label`, `label_norm.startswith`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `table` | `Table` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `kind` | `ReportKind` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SEVERITY_COLORS.get`
- `_apply_run_font`
- `_normalize_label`
- `_normalize_vuln_card_table_to_szi`
- `_set_cell_label_and_score`
- `_set_cell_text`
- `_vuln_card_label`
- `label_norm.startswith`
- `len`
- `severity_label`
- `value_cell.text.strip`

</details>

## _identify_section

[backend/app/reports/word_builder.py:733](../../../../../backend/app/reports/word_builder.py#L733)

```python
def _identify_section(text: str) -> str | None
```

В теле вызывает `_normalize_label`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_normalize_label`

</details>

## _double_paragraph_left_indent

[backend/app/reports/word_builder.py:750](../../../../../backend/app/reports/word_builder.py#L750)

```python
def _double_paragraph_left_indent(paragraph: Paragraph) -> None
```

Удваивает (или задаёт по умолчанию) левый отступ параграфа.

Используется для контентных абзацев разделов карточек уязвимости/теста:
пользователь попросил, чтобы текст под жирной подписью раздела имел
«отступ от начала строки два раза». Поэтому:

* если в `<w:pPr><w:ind>` уже стоит `w:left="N"` — заменяем на `2*N`;
* если отступа не было — ставим `_SECTION_CONTENT_DOUBLE_INDENT_TWIPS`
  (≈2 см), что визуально соответствует «два уровня отступа» от левого
  края страницы.

Также сбрасываем `w:firstLine`/`w:hanging`, чтобы Word не «съезжал»
при отрисовке.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `ind.get`
- `ind.set`
- `int`
- `max`
- `pPr.append`
- `pPr.find`
- `p_element.find`
- `p_element.insert`
- `qn`
- `str`

</details>

## _fill_card_prose

[backend/app/reports/word_builder.py:786](../../../../../backend/app/reports/word_builder.py#L786)

```python
def _fill_card_prose(card_paragraphs: list[Paragraph], vuln: Vulnerability) -> None
```

Подставляет описание/шаги/влияние/рекомендации в параграфы карточки.

Структура: заголовки разделов из шаблона сохраняются. Внутри каждого раздела
шаблонные параграфы заменяются на:
- данные уязвимости — если поле заполнено;
- единственный «…»-плейсхолдер — если данных нет.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `card_paragraphs` | `list[Paragraph]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_apply_run_font`
- `_double_paragraph_left_indent`
- `_identify_section`
- `_set_paragraph_text`
- `_strip_markdown_formatting`
- `_strip_markdown_formatting(vuln.description).strip`
- `_strip_markdown_formatting(vuln.impact).strip`
- `_strip_markdown_formatting(vuln.recommendations).strip`
- `_strip_paragraph_numbering`
- `_workflow_steps_text`
- `_workflow_steps_text(vuln).strip`
- `anchor.addnext`
- `content_paragraphs.append`
- `copy.deepcopy`
- `line.strip`
- `list`
- `new_p.findall`
- `new_p.remove`
- `qn`
- `section_value.get`
- `sections.items`
- `sections.setdefault`
- `sections[current].append`
- `tail._element.getparent`
- `tail._element.getparent().remove`
- `value.splitlines`
- `wrapper.add_run`

</details>

## _flatten_step_description

[backend/app/reports/word_builder.py:860](../../../../../backend/app/reports/word_builder.py#L860)

```python
def _flatten_step_description(description: str | None) -> str
```

Сворачивает многострочное описание этапа в одну строку.

    Если этап описан в виде «1. сделать А
2. сделать Б», в отчёте мы хотим
    получить «1. сделать А 2. сделать Б» внутри одной строки этапа.
    Markdown-ссылки на картинки (`![alt](/api/v1/files/.../download)`) убираем
    из текста — картинка вставляется отдельно.


| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `description` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `' '.join`
- `_strip_markdown_formatting`
- `cleaned.splitlines`
- `line.strip`

</details>

## _step_one_line

[backend/app/reports/word_builder.py:875](../../../../../backend/app/reports/word_builder.py#L875)

```python
def _step_one_line(index: int, step: dict) -> str
```

Формирует одну строку для этапа.

Заголовок этапа объединяется с описанием (свёрнутым в одну строку):
- title + description → «N. <title>: <description>»;
- только title       → «N. <title>»;
- только description → «N. <description>» (без редундантного «Этап N»);
- пусто              → «N. Этап N» (запасной вариант, обычно не встречается).

Если описание уже начинается с собственной нумерации «N. ...», внешний
префикс «N.» не добавляется, чтобы не получить «1. 1. ...».

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `index` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `step` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_flatten_step_description`
- `_strip_markdown_formatting`
- `_strip_markdown_formatting(step.get('title')).strip`
- `re.match`
- `step.get`

</details>

## _workflow_steps_text

[backend/app/reports/word_builder.py:900](../../../../../backend/app/reports/word_builder.py#L900)

```python
def _workflow_steps_text(vuln: Vulnerability) -> str
```

В теле вызывает `'\n'.join`, `_flatten_step_description`, `_step_one_line`, `enumerate`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `'\n'.join`
- `_flatten_step_description`
- `_step_one_line`
- `enumerate`

</details>

## _find_card_anchor

[backend/app/reports/word_builder.py:907](../../../../../backend/app/reports/word_builder.py#L907)

```python
def _find_card_anchor(doc: DocxDocument, section_h2_text: str) -> Paragraph | None
```

Находит первый параграф-карточку (Heading 3 или Heading 4) после H2 раздела.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `section_h2_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Paragraph \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_heading_level`
- `_iter_body_paragraphs`
- `_normalize_label`
- `norm.startswith`

</details>

## _card_block

[backend/app/reports/word_builder.py:926](../../../../../backend/app/reports/word_builder.py#L926)

```python
def _card_block(start_para: Paragraph) -> list
```

XML-элементы карточки (заголовок + таблица + проза) до следующего H2/H1.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `start_para` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_block_elements_until_heading`

</details>

## _strip_paragraph_numbering

[backend/app/reports/word_builder.py:931](../../../../../backend/app/reports/word_builder.py#L931)

```python
def _strip_paragraph_numbering(paragraph_element) -> None
```

Отключает Word-нумерацию/маркеры для параграфа (через `numId=0`).

Шаблонный стиль шагов (`a6` и т.п.) задаёт сквозную авто-нумерацию, из-за
чего перед каждой нашей строкой Word добавляет «4.», «5.», … Чтобы
оставить только наш собственный префикс «N. <текст>», выставляем на
параграфе `<w:numPr><w:numId w:val="0"/></w:numPr>` — это явная команда
Word'у «не нумеровать этот параграф», перекрывающая стиль.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `list`
- `numId.set`
- `numPr.append`
- `numPr.remove`
- `pPr.append`
- `pPr.find`
- `paragraph_element.find`
- `paragraph_element.insert`
- `qn`

</details>

## _force_center_paragraph

[backend/app/reports/word_builder.py:955](../../../../../backend/app/reports/word_builder.py#L955)

```python
def _force_center_paragraph(paragraph_element) -> None
```

Проставляет `<w:pPr><w:jc w:val="center"/></w:pPr>` напрямую через XML.

Делается так, чтобы гарантированно сработало даже на свежесозданных `<w:p>`
без стиля, где `Paragraph.alignment = ...` иногда может не установить jc.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `jc.set`
- `pPr.append`
- `pPr.find`
- `paragraph_element.find`
- `paragraph_element.insert`
- `qn`

</details>

## _add_picture_after

[backend/app/reports/word_builder.py:972](../../../../../backend/app/reports/word_builder.py#L972)

```python
def _add_picture_after(reference_element, doc: DocxDocument, image_bytes: bytes, width_in: float=5.5) -> не аннотирован
```

Добавляет изображение как параграф сразу после reference_element.

Важно: картинка ДОЛЖНА создаваться внутри целевого документа (`doc`), иначе
связь (relationship id) указывает на временный документ и Word показывает
заглушку «Не удаётся отобразить рисунок». Параграф принудительно выравнивается
по центру, чтобы картинка не «уезжала» к левому краю. Возвращает новый XML-элемент.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `reference_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes` | `bytes` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `width_in` | `float` | `5.5` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `BytesIO`
- `Inches`
- `OxmlElement`
- `Paragraph`
- `_force_center_paragraph`
- `paragraph.add_run`
- `reference_element.addnext`
- `run.add_picture`

</details>

## _apply_run_highlight

[backend/app/reports/word_builder.py:994](../../../../../backend/app/reports/word_builder.py#L994)

```python
def _apply_run_highlight(run: Run, value: str='yellow') -> None
```

Проставляет на run жёлтую/иную заливку (`<w:highlight>`).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `run` | `Run` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `value` | `str` | `'yellow'` | Входное значение преобразования/проверки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `highlight.set`
- `qn`
- `rPr.append`
- `rPr.find`
- `run._element.get_or_add_rPr`

</details>

## _find_caption_style_id

[backend/app/reports/word_builder.py:1012](../../../../../backend/app/reports/word_builder.py#L1012)

```python
def _find_caption_style_id(doc: DocxDocument) -> str | None
```

Возвращает styleId параграф-стиля «Caption»/«Название объекта»/«Подпись».

Это тот самый стиль, который Word применяет к подписи, созданной через
«Ссылки → Вставить название». Если в шаблоне стиля нет — None, и подпись
будет жить без явного pStyle (Word всё равно сможет её распознать как
подпись благодаря полю `SEQ Figure`, но связать «Insert Caption»-форматом
уже не получится автоматически).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(name_el.get(qn('w:val')) or '').strip`
- `(name_el.get(qn('w:val')) or '').strip().lower`
- `getattr`
- `name_el.get`
- `qn`
- `style.find`
- `style.get`
- `styles_root.iter`

</details>

## _apply_paragraph_style

[backend/app/reports/word_builder.py:1039](../../../../../backend/app/reports/word_builder.py#L1039)

```python
def _apply_paragraph_style(p_element, style_id: str) -> None
```

Проставляет `<w:pStyle w:val="<style_id>">` на абзац (создаёт `<w:pPr>` при необходимости).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `p_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `style_id` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `pPr.find`
- `pPr.insert`
- `pStyle.set`
- `p_element.find`
- `p_element.insert`
- `qn`

</details>

## _add_figure_caption_after

[backend/app/reports/word_builder.py:1052](../../../../../backend/app/reports/word_builder.py#L1052)

```python
def _add_figure_caption_after(reference_element, doc: DocxDocument, *, figure_number: int, caption_text: str) -> не аннотирован
```

Вставляет подпись рисунка через стандартную Word-функцию «Вставить название».

Структура полностью повторяет то, что Word создаёт сам через
«Ссылки → Вставить название»:

* абзац оформлен встроенным стилем «Название объекта» / «Caption» (тот же
  `pStyle`, что и при ручной вставке подписи);
* текст «Рисунок », поле `SEQ Figure \* ARABIC`, текст « — <описание>»;
* описание подкрашено жёлтым highlight, как мы и договаривались ранее.

Поле `SEQ Figure` помечено `w:dirty="true"` — Word пересчитает нумерацию
при открытии файла (включён `updateFields`) или вручную (Ctrl+A → F9),
поэтому удаление/добавление подписей автоматически пересортирует номера.

Возвращает только что созданный XML-элемент `<w:p>`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `reference_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `figure_number` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `caption_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `Paragraph`
- `_append_seq_field`
- `_apply_paragraph_style`
- `_apply_run_font`
- `_apply_run_highlight`
- `_find_caption_style_id`
- `_force_caption_run`
- `_force_center_paragraph`
- `paragraph.add_run`
- `reference_element.addnext`

</details>

## _append_seq_field

[backend/app/reports/word_builder.py:1102](../../../../../backend/app/reports/word_builder.py#L1102)

```python
def _append_seq_field(paragraph: Paragraph, *, sequence_name: str, initial_value: int) -> None
```

Добавляет в параграф поле `SEQ <sequence_name> \* ARABIC \* MERGEFORMAT`.

Особенности:

* `\* ARABIC` — арабские цифры в выводе.
* `\* MERGEFORMAT` — Word сохраняет ручное форматирование run'а при
  пересчёте, поэтому подпись остаётся не курсивной/чёрной даже после F9.
* `w:dirty="true"` ставится на каждый `<w:fldChar>` (begin/separate/end);
  благодаря этому Word при открытии (включён `updateFields` в settings.xml)
  и при `Ctrl+A → F9` гарантированно пересобирает значение, что даёт
  корректную сквозную нумерацию даже после ручного удаления/перестановки
  подписей внутри Word.
* Все run'ы дополнительно нормализуются: жёлтый highlight, шрифт SB Sans,
  снятый курсив и чёрный цвет (через `_force_caption_run_appearance`).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `sequence_name` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `initial_value` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `_make_field_rpr`
- `begin_fld.set`
- `begin_run.append`
- `end_fld.set`
- `end_run.append`
- `instr_run.append`
- `instr_text.set`
- `p_element.append`
- `qn`
- `sep_fld.set`
- `sep_run.append`
- `str`
- `value_run.append`

</details>

## _append_seq_field._make_field_rpr

[backend/app/reports/word_builder.py:1120](../../../../../backend/app/reports/word_builder.py#L1120)

```python
def _make_field_rpr() -> OxmlElement
```

В теле вызывает `OxmlElement`, `_apply_run_font_xml`, `_apply_run_highlight_xml`, `_force_caption_run_appearance`.

Возвращает: `OxmlElement`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `_apply_run_font_xml`
- `_apply_run_highlight_xml`
- `_force_caption_run_appearance`

</details>

## _apply_run_highlight_xml

[backend/app/reports/word_builder.py:1167](../../../../../backend/app/reports/word_builder.py#L1167)

```python
def _apply_run_highlight_xml(rpr_element, value: str) -> None
```

Версия `_apply_run_highlight` для прямой работы с уже созданным `<w:rPr>`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `rpr_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `highlight.set`
- `qn`
- `rpr_element.append`
- `rpr_element.find`

</details>

## _force_caption_run_appearance

[backend/app/reports/word_builder.py:1176](../../../../../backend/app/reports/word_builder.py#L1176)

```python
def _force_caption_run_appearance(rpr_element) -> None
```

Снимает курсив и красит run в чёрный — перекрывает наследие `caption`-стиля.

Шаблонный `caption` (styleId=`af7`) задаёт `<w:i/>`, `<w:iCs/>` и тёмно-серый
цвет `44546A`. Нам же нужен обычный (не курсивный) чёрный текст. Поэтому
явно прописываем на каждом run'е подписи `<w:i w:val="false"/>`,
`<w:iCs w:val="false"/>` и `<w:color w:val="000000"/>`. Без этого Word
наследует курсив/цвет из стиля и подписи рисунков выглядят неправильно.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `rpr_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `color.get`
- `color.set`
- `italic.set`
- `italic_cs.set`
- `qn`
- `rpr_element.append`
- `rpr_element.find`

</details>

## _force_caption_run

[backend/app/reports/word_builder.py:1208](../../../../../backend/app/reports/word_builder.py#L1208)

```python
def _force_caption_run(run: Run) -> None
```

То же, что `_force_caption_run_appearance`, но для готового `Run` python-docx.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `run` | `Run` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_force_caption_run_appearance`
- `run._element.get_or_add_rPr`

</details>

## _apply_run_font_xml

[backend/app/reports/word_builder.py:1214](../../../../../backend/app/reports/word_builder.py#L1214)

```python
def _apply_run_font_xml(rpr_element) -> None
```

Применяет шрифт `REPORT_FONT_NAME`/`REPORT_FONT_SIZE_PT` к существующему `<w:rPr>`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `rpr_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `int`
- `qn`
- `rfonts.set`
- `rpr_element.append`
- `rpr_element.find`
- `str`
- `sz.set`
- `sz_cs.set`

</details>

## _extract_file_ids_from_markdown

[backend/app/reports/word_builder.py:1242](../../../../../backend/app/reports/word_builder.py#L1242)

```python
def _extract_file_ids_from_markdown(text: str | None) -> list[int]
```

Возвращает UUID файлов, упомянутых как markdown-картинки в тексте.

Фронт Markdown-редактор при добавлении картинки в шаг вставляет ссылку вида
`![image.png](/api/v1/files/<UUID>/download)`. В отчёте нам нужно вывести
саму картинку, а не ссылку.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[int]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_MARKDOWN_IMAGE_RE.finditer`
- `int`
- `match.group`
- `result.append`
- `seen.add`
- `set`

</details>

## _strip_markdown_images

[backend/app/reports/word_builder.py:1265](../../../../../backend/app/reports/word_builder.py#L1265)

```python
def _strip_markdown_images(text: str | None) -> str
```

Убирает markdown-вставки картинок из текста, оставляя читаемое описание.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_MARKDOWN_IMAGE_RE.sub`

</details>

## _strip_markdown_formatting

[backend/app/reports/word_builder.py:1289](../../../../../backend/app/reports/word_builder.py#L1289)

```python
def _strip_markdown_formatting(text: str | None) -> str
```

Убирает базовую Markdown-разметку, оставляя читаемый текст.

Используется в отчёте: пользователи пишут описания этапов/уязвимостей
в Markdown-редакторе, а в Word-отчёт должен попасть «плоский» текст
без `#`, `**`, ссылок и т.д. Картинки и так удаляются отдельно.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_MARKDOWN_BLOCKQUOTE_RE.sub`
- `_MARKDOWN_BOLD_RE.sub`
- `_MARKDOWN_BULLET_RE.sub`
- `_MARKDOWN_CODE_FENCE_RE.sub`
- `_MARKDOWN_HEADER_RE.sub`
- `_MARKDOWN_HR_RE.sub`
- `_MARKDOWN_INLINE_CODE_RE.sub`
- `_MARKDOWN_ITALIC_RE.sub`
- `_MARKDOWN_LINK_RE.sub`
- `_MARKDOWN_STRIKE_RE.sub`
- `_strip_markdown_images`

</details>

## _step_image_file_ids

[backend/app/reports/word_builder.py:1312](../../../../../backend/app/reports/word_builder.py#L1312)

```python
def _step_image_file_ids(step: dict) -> list[int]
```

Все file_id этапа: из `image_file_ids` и из markdown в title/description.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `step` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[int]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_extract_file_ids_from_markdown`
- `ids.append`
- `int`
- `seen.add`
- `set`
- `step.get`

</details>

## _collect_step_image_ids

[backend/app/reports/word_builder.py:1337](../../../../../backend/app/reports/word_builder.py#L1337)

```python
def _collect_step_image_ids(steps: list[dict] | None) -> set[int]
```

Собирает множество file_id этапов (`image_file_ids` + markdown-вставки).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `steps` | `list[dict] \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `set[int]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_step_image_file_ids`
- `ids.update`
- `set`

</details>

## _next_figure_number

[backend/app/reports/word_builder.py:1345](../../../../../backend/app/reports/word_builder.py#L1345)

```python
def _next_figure_number(image_state: dict) -> int
```

Берёт следующее число «Рисунок N» из общего счётчика построения отчёта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `image_state` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `int`.

<details>
<summary>Прямые вызовы в теле</summary>

- `image_state.get`

</details>

## _figure_caption_text

[backend/app/reports/word_builder.py:1352](../../../../../backend/app/reports/word_builder.py#L1352)

```python
def _figure_caption_text(*, step: dict | None, file_name: str | None, fallback_index: int) -> str
```

Возвращает «описание картинки» для подписи.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `step` | `dict \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `file_name` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `fallback_index` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_flatten_step_description`
- `_strip_markdown_formatting`
- `_strip_markdown_formatting(step.get('title')).strip`
- `re.sub`
- `re.sub('\\.[A-Za-z0-9]{1,8}$', '', file_name).strip`
- `step.get`

</details>

## _insert_image_with_caption

[backend/app/reports/word_builder.py:1369](../../../../../backend/app/reports/word_builder.py#L1369)

```python
def _insert_image_with_caption(*, anchor_element, doc: DocxDocument, image_bytes: bytes, caption_text: str, image_state: dict) -> не аннотирован
```

Вставляет картинку и подпись «Рисунок N — <caption>» (жёлтый highlight) после anchor.

Сам номер N оформлен как Word-поле `SEQ Figure`, поэтому Word автоматически
пересчитывает нумерацию при удалении/добавлении подписей (см. `_add_figure_caption_after`).
Возвращает элемент-подпись (последний вставленный), который должен стать новым anchor.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `anchor_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes` | `bytes` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `caption_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_state` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_add_figure_caption_after`
- `_add_picture_after`
- `_next_figure_number`

</details>

## _fill_card

[backend/app/reports/word_builder.py:1393](../../../../../backend/app/reports/word_builder.py#L1393)

```python
def _fill_card(block_elements: list, *, kind: ReportKind, doc: DocxDocument, vuln: Vulnerability, sequence: int, indexes: dict, project: Project, image_bytes_by_id: dict[int, bytes], image_state: dict) -> None
```

Заполняет одну карточку уязвимости/слабости данными `vuln`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `block_elements` | `list` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `kind` | `ReportKind` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `sequence` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_state` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(vuln.title or '').strip`
- `Paragraph`
- `_attach_workflow_images`
- `_fill_card_prose`
- `_fill_card_table`
- `_set_heading_text`
- `after_table_paragraphs.append`
- `indexes.get`
- `paragraphs.append`
- `qn`

</details>

## _attach_workflow_images

[backend/app/reports/word_builder.py:1454](../../../../../backend/app/reports/word_builder.py#L1454)

```python
def _attach_workflow_images(card_paragraphs: list[Paragraph], vuln: Vulnerability, *, image_bytes_by_id: dict[int, bytes], files_by_id: dict[int, File], files_by_vuln_id: dict[int, list[File]], image_state: dict, doc: DocxDocument) -> None
```

Вставляет картинки в секцию «Шаги для воспроизведения» с подписями «Рисунок N — …».

В отчёт идут ТОЛЬКО картинки, явно привязанные к этапам уязвимости
(через `image_file_ids` или markdown в описании этапа). «Свободные»
файлы-доказательства, оставшиеся в БД после удалений, в отчёт не попадают.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `card_paragraphs` | `list[Paragraph]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_id` | `dict[int, File]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_vuln_id` | `dict[int, list[File]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_state` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `_collect_step_image_ids`
- `_figure_caption_text`
- `_identify_section`
- `_insert_image_with_caption`
- `_step_image_file_ids`
- `bool`
- `cursor.getnext`
- `cursor.iter`
- `enumerate`
- `files_by_id.get`
- `image_bytes_by_id.get`
- `len`
- `qn`
- `set`
- `step_paragraph_elements.append`
- `steps_header_para._element.getnext`

</details>

## _replicate_card

[backend/app/reports/word_builder.py:1532](../../../../../backend/app/reports/word_builder.py#L1532)

```python
def _replicate_card(template_block: list, count: int) -> list[list]
```

Создаёт `count` копий карточки. Первая копия — оригинал; остальные клонируются и вставляются после.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `template_block` | `list` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `count` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[list]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `blocks.append`
- `cloned.append`
- `copy.deepcopy`
- `last_element.addnext`
- `range`

</details>

## _remove_block

[backend/app/reports/word_builder.py:1549](../../../../../backend/app/reports/word_builder.py#L1549)

```python
def _remove_block(elements: list) -> None
```

В теле вызывает `element.getparent`, `parent.remove`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `elements` | `list` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `element.getparent`
- `parent.remove`

</details>

## _split_vulnerabilities

[backend/app/reports/word_builder.py:1556](../../../../../backend/app/reports/word_builder.py#L1556)

```python
def _split_vulnerabilities(vulnerabilities: list[Vulnerability]) -> tuple[list[Vulnerability], list[Vulnerability], list[Vulnerability]]
```

Делит находки на три корзины: уязвимости (реализуемые), слабости (info) и
«проверки» (unrealized). Последние идут ТОЛЬКО в раздел «Тесты».

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vulnerabilities` | `list[Vulnerability]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[list[Vulnerability], list[Vulnerability], list[Vulnerability]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `unrealized.append`
- `vulns.append`
- `weaknesses.append`

</details>

## _sort_vulns_by_host_and_severity

[backend/app/reports/word_builder.py:1574](../../../../../backend/app/reports/word_builder.py#L1574)

```python
def _sort_vulns_by_host_and_severity(vulnerabilities: list[Vulnerability], *, indexes: dict, hosts: list[Host]) -> list[Vulnerability]
```

Сортирует находки по хосту (в порядке списка хостов проекта), а внутри
каждого хоста — по убыванию критичности (critical→…→info→unrealized).

Находки без привязки к хосту относятся к первому хосту проекта — так же, как
при группировке по стендам в отчёте (`_group_items_by_host`). Сортировка
стабильна: при равных ключах сохраняется исходный порядок.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vulnerabilities` | `list[Vulnerability]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hosts` | `list[Host]` | `обязательный` | Набор хостов для обработки. |

Возвращает: `list[Vulnerability]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `enumerate`
- `sorted`

</details>

## _sort_vulns_by_host_and_severity.sort_key

[backend/app/reports/word_builder.py:1593](../../../../../backend/app/reports/word_builder.py#L1593)

```python
def sort_key(vuln: Vulnerability) -> tuple[int, int]
```

В теле вызывает `_SEVERITY_ORDER.get`, `_vuln_host_address`, `host_index.get`, `len`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `tuple[int, int]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_SEVERITY_ORDER.get`
- `_vuln_host_address`
- `host_index.get`
- `len`

</details>

## _strip_run_highlight

[backend/app/reports/word_builder.py:1602](../../../../../backend/app/reports/word_builder.py#L1602)

```python
def _strip_run_highlight(run: Run) -> None
```

Снимает `<w:highlight>` с run'а (нужно для шаблонных «жёлтых» ячеек).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `run` | `Run` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `qn`
- `rPr.findall`
- `rPr.remove`
- `run._element.find`

</details>

## _strip_cell_highlight

[backend/app/reports/word_builder.py:1611](../../../../../backend/app/reports/word_builder.py#L1611)

```python
def _strip_cell_highlight(cell: _Cell) -> None
```

Снимает желтую (и любую) подсветку со всех run'ов внутри ячейки.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `cell` | `_Cell` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_strip_run_highlight`

</details>

## _update_severity_summary_table

[backend/app/reports/word_builder.py:1618](../../../../../backend/app/reports/word_builder.py#L1618)

```python
def _update_severity_summary_table(doc: DocxDocument, severity_counts: dict[Severity, int]) -> None
```

Обновляет колонку «Количество» в сводной таблице уязвимостей/недостатков.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `severity_counts` | `dict[Severity, int]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `SUMMARY_ROW_LABEL_TO_SEVERITY.get`
- `_normalize_label`
- `_set_cell_text`
- `_strip_cell_highlight`
- `len`
- `severity_counts.get`
- `str`

</details>

## _update_project_intro

[backend/app/reports/word_builder.py:1642](../../../../../backend/app/reports/word_builder.py#L1642)

```python
def _update_project_intro(doc: DocxDocument, project: Project) -> None
```

Заменяет «Программного Продукта XXX» и интервал работ в «Информация о проекте».

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(project.name or '').strip`
- `_format_date`
- `_iter_body_paragraphs`
- `_replace_in_paragraph`
- `_set_paragraph_text`
- `pattern_dates_with_dots.search`
- `pattern_dates_with_dots.sub`
- `re.compile`

</details>

## _update_task_link

[backend/app/reports/word_builder.py:1671](../../../../../backend/app/reports/word_builder.py#L1671)

```python
def _update_task_link(doc: DocxDocument, project: Project) -> None
```

Подставляет ссылку на связанный AppSec-тикет после «по задаче …».

В PP-шаблоне стоит плейсхолдер «по задаче XXX», в SZI — пример-URL. Заменяем
токен после «по задаче » на URL; при отсутствии ссылки — жёлтая инструкция.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(getattr(project, 'appsec_ticket_url', None) or '').strip`
- `_TASK_LINK_RE.search`
- `_apply_run_highlight`
- `_iter_all_paragraphs`
- `_replace_in_paragraph`
- `getattr`
- `match.group`

</details>

## _fill_credentials_table

[backend/app/reports/word_builder.py:1695](../../../../../backend/app/reports/word_builder.py#L1695)

```python
def _fill_credentials_table(doc: DocxDocument, credentials: list[dict]) -> None
```

Заполняет таблицу «Учётные данные» (шапка Логин/Пароль) из кредов проекта.

Шаблонная строка под шапкой содержит плейсхолдеры XXX(логин)/XXXX(пароль).
Первую запись кладём в неё, для каждой следующей клонируем строку. Если
кредов нет — проставляем «—», чтобы в отчёте не осталось XXX/XXXX.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `credentials` | `list[dict]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_fill_row`
- `_normalize_label`
- `copy.deepcopy`
- `header.index`
- `len`
- `target.rows[prev_idx]._tr.addnext`

</details>

## _fill_credentials_table._fill_row

[backend/app/reports/word_builder.py:1717](../../../../../backend/app/reports/word_builder.py#L1717)

```python
def _fill_row(row, cred: dict) -> None
```

В теле вызывает `_set_cell_text`, `_strip_cell_highlight`, `cred.get`, `len`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `row` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `cred` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_set_cell_text`
- `_strip_cell_highlight`
- `cred.get`
- `len`

</details>

## _report_version

[backend/app/reports/word_builder.py:1738](../../../../../backend/app/reports/word_builder.py#L1738)

```python
def _report_version(name: str) -> str
```

Remove the product prefix only; preserve the entire original version suffix.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `name` | `str` | `обязательный` | Имя/название обрабатываемого объекта. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `match.start`
- `name[match.start():].strip`
- `re.search`

</details>

## _distrib_version

[backend/app/reports/word_builder.py:1746](../../../../../backend/app/reports/word_builder.py#L1746)

```python
def _distrib_version(project: Project) -> str
```

Версии дистрибутива из массива appsec_versions (старое поле — fallback).

Из «Platform V Stack 1.0.2-beta.2» берём целиком «1.0.2-beta.2».
Название продукта убирается только в отчёте; исходные значения не меняются.
Версии перечисляем через запятую. Нет данных → "" (не трогаем плейсхолдер).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `', '.join`
- `(getattr(project, 'appsec_version_name', None) or '').strip`
- `_report_version`
- `dict.fromkeys`
- `getattr`
- `isinstance`
- `item.get`
- `str`
- `str(item.get('name') or item.get('code') or '').strip`

</details>

## _update_cover_distrib_version

[backend/app/reports/word_builder.py:1760](../../../../../backend/app/reports/word_builder.py#L1760)

```python
def _update_cover_distrib_version(doc: DocxDocument, project: Project) -> None
```

Подставляет версию дистрибутива в «distribVersion: XXX» на обложке (СЗИ).

Строка лежит в текстовом фрейме (`txbxContent`): «distribVersion», «:», « »,
«XXX» — отдельными run-ами. Находим фрейм с «distribVersion» и заменяем «XXX»
в первом run-е после слова «distribVersion». Нет версии — не трогаем.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `_distrib_version`
- `body.iter`
- `qn`
- `run_element.iter`
- `text_element.text.replace`
- `txbx.iter`

</details>

## _update_cover_page

[backend/app/reports/word_builder.py:1793](../../../../../backend/app/reports/word_builder.py#L1793)

```python
def _update_cover_page(doc: DocxDocument, project: Project) -> None
```

Подставляет название проекта на обложку отчёта.

Текст обложки лежит внутри `<w:txbxContent>` (текстовых фреймов) и часто
разнесён по нескольким соседним `<w:p>`-параграфам, причём «XXX» обычно
лежит в отдельном параграфе. Поэтому ищем каждый `txbxContent`, и если в
его суммарном тексте присутствует «Программного» или «Продукта», заменяем
все «XXX» в любых run-ах внутри этого фрейма на имя проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `(project.name or '').strip`
- `body.iter`
- `prev_text.rstrip`
- `qn`
- `run_element.iter`
- `stripped_prev.endswith`
- `text_element.text.replace`
- `txbx.iter`

</details>

## _update_cover_date

[backend/app/reports/word_builder.py:1831](../../../../../backend/app/reports/word_builder.py#L1831)

```python
def _update_cover_date(doc: DocxDocument, project: Project) -> None
```

Заменяет «Москва, MM.YYYY» на обложке отчёта актуальной датой проекта.

Дата выбирается по приоритету: `project.end_date` → `project.start_date` →
текущая дата. Формат — `MM.YYYY` (две цифры месяца, точка, четыре цифры
года). Текст обложки лежит внутри `<w:txbxContent>` и часто разнесён по
нескольким `<w:t>` в одном параграфе, поэтому работаем на уровне параграфа:
склеиваем все его текст-элементы, делаем замену на полной строке и пишем
результат в первый `<w:t>`, очищая остальные.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `_COVER_DATE_RE.search`
- `_COVER_DATE_RE.sub`
- `_date.today`
- `body.iter`
- `list`
- `paragraph_element.iter`
- `qn`
- `target_date.strftime`
- `txbx.iter`

</details>

## _enable_auto_field_update

[backend/app/reports/word_builder.py:1868](../../../../../backend/app/reports/word_builder.py#L1868)

```python
def _enable_auto_field_update(doc: DocxDocument) -> None
```

Добавляет `<w:updateFields w:val="true"/>` в `word/settings.xml`.

Это стандартная директива OOXML, которая просит Word при открытии документа
автоматически обновить все поля — TOC, перекрёстные ссылки, PAGEREF и т.д.
Word покажет предупреждение «Update fields» (Yes по-умолчанию у части
локалей), но даже если пользователь нажимает Cancel, оглавление перестроится
на основе фактических заголовков. Без этой директивы оглавление остаётся
«застывшим» — таким, каким было сохранено в шаблоне.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `existing.set`
- `getattr`
- `qn`
- `settings_element.find`
- `settings_element.insert`
- `update_fields.set`

</details>

## _find_outer_toc_field

[backend/app/reports/word_builder.py:1897](../../../../../backend/app/reports/word_builder.py#L1897)

```python
def _find_outer_toc_field(doc: DocxDocument) -> не аннотирован
```

Возвращает (begin, separate, end) узлы внешнего TOC-поля или `None`.

Идёт плоским потоком `fldChar`/`instrText` по всему телу документа,
учитывая вложенные поля (PAGEREF внутри TOC и т.п.).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `''.join(frame['instr']).strip`
- `''.join(frame['instr']).strip().upper`
- `body.iter`
- `instr_full.startswith`
- `n.get`
- `qn`
- `stack.append`
- `stack.pop`
- `stack[-1]['instr'].append`

</details>

## _find_toc_style_ids_by_name

[backend/app/reports/word_builder.py:1927](../../../../../backend/app/reports/word_builder.py#L1927)

```python
def _find_toc_style_ids_by_name(doc: DocxDocument) -> dict[int, str]
```

Ищет в `word/styles.xml` стили с `<w:name>toc N</w:name>` и возвращает их styleId.

Это надёжнее, чем угадывать по pStyle первой попавшейся кэш-записи: в
шаблонах рядом могут лежать кастомные стили вроде «ЛЕТА_Заголовок 3»,
у которых w:name НЕ начинается с «toc» — но именно их pStyle Word
использовал в шаблонной TOC. Если их вытянуть, sub-item'ы оглавления
выглядят как обычные жирные заголовки, без отступов и с гигантским sz.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[int, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(name_el.get(qn('w:val')) or '').strip`
- `(name_el.get(qn('w:val')) or '').strip().lower`
- `getattr`
- `int`
- `match.group`
- `name_el.get`
- `qn`
- `re.match`
- `style.find`
- `style.get`
- `styles_root.iter`

</details>

## _detect_toc_pstyles

[backend/app/reports/word_builder.py:1957](../../../../../backend/app/reports/word_builder.py#L1957)

```python
def _detect_toc_pstyles(cached_entries: list) -> dict[int, str]
```

Fallback: вытаскивает pStyle из существующих записей оглавления.

Используется только если в `styles.xml` нет именованных «toc N» (что в наших
шаблонах не встречается, но на всякий случай есть деградация).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `cached_entries` | `list` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `dict[int, str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `enumerate`
- `len`
- `p.find`
- `pPr.find`
- `pStyle.get`
- `qn`
- `seen.append`

</details>

## _detect_hyperlink_rstyle

[backend/app/reports/word_builder.py:1979](../../../../../backend/app/reports/word_builder.py#L1979)

```python
def _detect_hyperlink_rstyle(cached_entries: list) -> str | None
```

Находит rStyle гиперссылок в кэше TOC (обычно «ae» или «Hyperlink»).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `cached_entries` | `list` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `hyper.iter`
- `p.iter`
- `qn`
- `rPr.find`
- `rStyle.get`

</details>

## _xml_escape

[backend/app/reports/word_builder.py:1992](../../../../../backend/app/reports/word_builder.py#L1992)

```python
def _xml_escape(text: str) -> str
```

В теле вызывает `text.replace`, `text.replace('&', '&amp;').replace`, `text.replace('&', '&amp;').replace('<', '&lt;').replace`, `text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `text.replace`
- `text.replace('&', '&amp;').replace`
- `text.replace('&', '&amp;').replace('<', '&lt;').replace`
- `text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace`

</details>

## _build_toc_entry_p

[backend/app/reports/word_builder.py:2001](../../../../../backend/app/reports/word_builder.py#L2001)

```python
def _build_toc_entry_p(toc_style: str, bookmark: str, text: str, hyperlink_style: str | None) -> не аннотирован
```

Собирает XML-параграф одной записи оглавления.

Структура совпадает с тем, что генерирует Word: гиперссылка на бук-марку
заголовка, текст заголовка, табуляция, вложенное поле PAGEREF, плейсхолдер
«1» (Word заменит его на реальный номер при открытии). Шрифт — SB Sans
Display, чтобы оглавление выглядело как остальной текст.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `toc_style` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `bookmark` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hyperlink_style` | `str \| None` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_xml_escape`
- `parse_xml`

</details>

## _assign_unique_heading_bookmarks

[backend/app/reports/word_builder.py:2034](../../../../../backend/app/reports/word_builder.py#L2034)

```python
def _assign_unique_heading_bookmarks(doc: DocxDocument) -> list[tuple[int, str, str]]
```

Каждому H1/H2/H3 в теле документа присваивает уникальную бук-марку.

Возвращает список `(level, bookmark_name, heading_text)` в порядке
следования. Полученные имена бук-марок гарантированно уникальны (с префиксом
`_TocAuto_`) — это важно, потому что после клонирования по-host-секций в
документе остаются десятки заголовков с одинаковыми `_TocXXXXX`, и PAGEREF
в кэше TOC резолвится по первому совпадению, давая «все страницы = 4».

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[tuple[int, str, str]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `OxmlElement`
- `_heading_level`
- `be.set`
- `bm.get`
- `body.iter`
- `bs.set`
- `entries.append`
- `int`
- `max`
- `pPr.addnext`
- `paragraph._element.append`
- `paragraph._element.find`
- `paragraph._element.insert`
- `paragraph.text.strip`
- `qn`
- `str`

</details>

## _rebuild_toc

[backend/app/reports/word_builder.py:2083](../../../../../backend/app/reports/word_builder.py#L2083)

```python
def _rebuild_toc(doc: DocxDocument) -> None
```

Заново собирает «закэшированное» содержимое TOC-поля.

Решает две UX-проблемы реального открытия отчёта в Word:

1. **Пустое оглавление при открытии.** Раньше мы вычищали body TOC-поля
   полностью; Word при `<w:updateFields w:val="true"/>` не всегда
   инициирует обновление пустого поля, и пользователь видит чистую
   страницу. Сейчас мы предзаполняем поле полным набором записей —
   один абзац на каждый H1/H2/H3 — поэтому даже без обновления видны
   заголовки и гиперссылки.

2. **Все номера страниц = 1 после первого F9.** Когда Word обновляет
   PAGEREF за один проход, он берёт позиции бук-марок из ТЕКУЩЕЙ вёрстки.
   Если поле было пустым, добавление записей толкает страницы вниз —
   получаем «всё на странице 1». Если же кэш уже содержит финальное
   количество абзацев (наш случай), вёрстка стабильна и первый же
   перерасчёт даёт правильные номера.

Дополнительно: каждый заголовок получает уникальную бук-марку
`_TocAuto_<n>` (после клонирования по-host-секций оригинальные `_Toc...`
дублируются и PAGEREF указывает не туда).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(fld_simple.get(qn('w:instr')) or '').upper`
- `_ancestor_paragraph`
- `_assign_unique_heading_bookmarks`
- `_build_toc_entry_p`
- `_detect_hyperlink_rstyle`
- `_detect_toc_pstyles`
- `_find_outer_toc_field`
- `_find_toc_style_ids_by_name`
- `_remove_field_result`
- `begin_node.set`
- `doc.element.body.iter`
- `end_p.getparent`
- `fld_simple.get`
- `fld_simple.set`
- `list`
- `parent.index`
- `parent.insert`
- `pstyle_for_level.get`
- `qn`
- `sep_p.getparent`

</details>

## _remove_field_result

[backend/app/reports/word_builder.py:2152](../../../../../backend/app/reports/word_builder.py#L2152)

```python
def _remove_field_result(separate_node, end_node) -> None
```

Удаляет всё, что лежит между `separate` и `end` одного и того же поля.

Поле может пересекать границы параграфов: сами `separate`/`end` fldChar'ы
лежат в `<w:r>`, который — в `<w:p>`. «Результат» поля состоит из:
  • остатка параграфа, в котором лежит `separate` (всё после `separate`-run'а)
  • всех ПОЛНОСТЬЮ промежуточных параграфов (между параграфом separate и
    параграфом end)
  • начала параграфа end (всё до `end`-run'а)
Параграфы separate и end не удаляем целиком, чтобы не сломать структуру
самого поля.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `separate_node` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `end_node` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_ancestor_paragraph`
- `_ancestor_run`
- `end_p.getparent`
- `end_p.remove`
- `end_p_kids.index`
- `kids.index`
- `list`
- `parent.remove`
- `parent_kids.index`
- `qn`
- `sep_p.getparent`
- `sep_p.remove`
- `sep_p_kids.index`

</details>

## _ancestor_paragraph

[backend/app/reports/word_builder.py:2227](../../../../../backend/app/reports/word_builder.py#L2227)

```python
def _ancestor_paragraph(node) -> не аннотирован
```

В теле вызывает `cur.getparent`, `node.getparent`, `qn`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `node` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cur.getparent`
- `node.getparent`
- `qn`

</details>

## _ancestor_run

[backend/app/reports/word_builder.py:2235](../../../../../backend/app/reports/word_builder.py#L2235)

```python
def _ancestor_run(node) -> не аннотирован
```

В теле вызывает `cur.getparent`, `node.getparent`, `qn`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `node` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `не аннотирован`.

<details>
<summary>Прямые вызовы в теле</summary>

- `cur.getparent`
- `node.getparent`
- `qn`

</details>

## _normalize_heading_sizes

[backend/app/reports/word_builder.py:2243](../../../../../backend/app/reports/word_builder.py#L2243)

```python
def _normalize_heading_sizes(doc: DocxDocument) -> None
```

Принудительно проставляет размеры шрифта заголовкам по уровням.

H1-H3 → 14 pt, H4 → 13.5 pt (см. `HEADING_FONT_SIZE_PT`). Размер выставляется
на каждом run'е заголовка, чтобы перекрыть «застывшие» `<w:sz>` шаблона.
Бежит по всем параграфам тела документа после полной сборки отчёта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_force_run_font_size_pt`
- `_heading_level`
- `_heading_size_pt_for_level`
- `_iter_body_paragraphs`

</details>

## _force_h3_non_bold

[backend/app/reports/word_builder.py:2259](../../../../../backend/app/reports/word_builder.py#L2259)

```python
def _force_h3_non_bold(doc: DocxDocument) -> None
```

Снимает явный `<w:b/>` со всех H3-параграфов документа.

Заголовки H3 в шаблоне имеют bold-runs, и Word при обновлении оглавления
с дефолтным `TOC`-полем наследует это форматирование (т.е. подпункты вида
«4.4.1 …» отображаются жирным). Сбрасываем bold на уровне run'ов: это
влияет и на сам H3-текст в теле, и на соответствующую запись в оглавлении
после автообновления Word'ом.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_heading_level`
- `_iter_body_paragraphs`
- `b.set`
- `qn`
- `rPr.findall`
- `run._element.find`

</details>

## _update_test_stand_paragraphs

[backend/app/reports/word_builder.py:2281](../../../../../backend/app/reports/word_builder.py#L2281)

```python
def _update_test_stand_paragraphs(doc: DocxDocument, hosts: list[Host]) -> None
```

Заменяет «Исследование стенда http://XXX» актуальным списком стендов.

H3-заголовки «Исследование стенда …» в разделах 4.4/4.5/4.6 пропускаем —
их клонирует под каждый стенд `_replicate_h3_with_cards` (по одному
H3-разделу на хост). Здесь обрабатываем только обычные параграфы
(например, лид-абзац списка тестов в 4.1).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hosts` | `list[Host]` | `обязательный` | Набор хостов для обработки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_heading_level`
- `_hosts_text`
- `_iter_body_paragraphs`
- `_normalize_label`
- `_set_paragraph_text`
- `norm.startswith`
- `paragraph.text.replace`

</details>

## _update_findings_summary_text

[backend/app/reports/word_builder.py:2304](../../../../../backend/app/reports/word_builder.py#L2304)

```python
def _update_findings_summary_text(doc: DocxDocument, *, vulnerability_count: int, weakness_count: int) -> None
```

Подставляет количество уязвимостей в абзац-итог «В ходе исследования было выявлено …».

PP: «выявлено XXX уязвимостей …» — XXX → vulnerability_count.
СЗИ: «выявлено X уязвимостей и X недостатков …» — оба X → счётчики.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vulnerability_count` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `weakness_count` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_iter_body_paragraphs`
- `_set_paragraph_text`
- `intro_pattern.search`
- `pp_pattern.search`
- `pp_pattern.sub`
- `re.compile`
- `szi_pattern.search`
- `szi_pattern.sub`

</details>

## _replace_pp_xxx_in_text

[backend/app/reports/word_builder.py:2351](../../../../../backend/app/reports/word_builder.py#L2351)

```python
def _replace_pp_xxx_in_text(text: str, name: str) -> str
```

Применяет шаблоны замены «ПП XXX» / «ПП «XXX»» / «ПА «XXX»» → имя проекта.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `name` | `str` | `обязательный` | Имя/название обрабатываемого объекта. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `pattern.sub`
- `replacement.format`

</details>

## _update_pp_headings

[backend/app/reports/word_builder.py:2359](../../../../../backend/app/reports/word_builder.py#L2359)

```python
def _update_pp_headings(doc: DocxDocument, project: Project) -> None
```

Заменяет XXX на название проекта в любых параграфах/ячейках вида «ПП XXX» / «ПП «XXX»».

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(project.name or '').strip`
- `_iter_body_paragraphs`
- `_maybe_update`

</details>

## _update_pp_headings._maybe_update

[backend/app/reports/word_builder.py:2365](../../../../../backend/app/reports/word_builder.py#L2365)

```python
def _maybe_update(paragraph: Paragraph) -> None
```

В теле вызывает `_replace_pp_xxx_in_text`, `_set_paragraph_text`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_replace_pp_xxx_in_text`
- `_set_paragraph_text`

</details>

## _direct_text_elements

[backend/app/reports/word_builder.py:2380](../../../../../backend/app/reports/word_builder.py#L2380)

```python
def _direct_text_elements(paragraph_element) -> list
```

Возвращает `<w:t>`, которые принадлежат именно этому параграфу.

`Element.iter(...)` в lxml идёт вглубь всего поддерева, поэтому для внешнего
`<w:p>`, внутри которого лежат `<w:txbxContent>` с собственными `<w:p>`,
обычный обход подтянет тексты из вложенных параграфов. Здесь фильтруем только
те `<w:t>`, у которых ближайший предок-`<w:p>` совпадает с текущим.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph_element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ancestor.getparent`
- `paragraph_element.iter`
- `qn`
- `result.append`
- `t.getparent`

</details>

## _replace_xxx_in_xml_subtree

[backend/app/reports/word_builder.py:2399](../../../../../backend/app/reports/word_builder.py#L2399)

```python
def _replace_xxx_in_xml_subtree(element, name: str) -> None
```

Заменяет XXX → name в `<w:t>` подходящих параграфов (футеры/хедеры).

«Анализ защищенности «XXX»» часто разнесено по нескольким `<w:t>` элементам
(например `«` и `XXX` и `»` лежат в разных runs). Поэтому работаем на уровне
параграфа: склеиваем тексты, применяем подстановки на полной строке и
переписываем результат в первый `<w:t>`, очищая остальные.

ВАЖНО: учитываем только `<w:t>`, принадлежащие конкретному `<w:p>` (не
вложенным параграфам внутри `<w:txbxContent>`). Иначе тексты из соседних
текстовых полей (например «КОНФИДЕНЦИАЛЬНО», номер страницы) сольются в
первый `<w:t>` и будут обрезаны узким текстовым полем.

Применяется только к параграфам с маркерами «защищенности»/«ПП»/«ПА», чтобы
случайные XXX в коде/значениях не затронуть.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `name` | `str` | `обязательный` | Имя/название обрабатываемого объекта. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `''.join`
- `_direct_text_elements`
- `_replace_pp_xxx_in_text`
- `any`
- `element.iter`
- `qn`
- `re.sub`

</details>

## _flatten_alternate_content

[backend/app/reports/word_builder.py:2438](../../../../../backend/app/reports/word_builder.py#L2438)

```python
def _flatten_alternate_content(element) -> None
```

Разворачивает все `<mc:AlternateContent>` в поддереве, оставляя только Choice.

В шаблоне ПП футер построен через `<mc:AlternateContent>` с двумя ветками:
`<mc:Choice Requires="wps">` (современный `<w:drawing>`) и `<mc:Fallback>`
(легаси VML `<w:pict>`). MS Word/совместимые рендеры обязаны выбирать ровно
одну ветку, но некоторые просмотрщики (LibreOffice, превьюшки) выводят обе —
и пользователь видит дубль текста «Анализ защищенности «…»Анализ защищенности
«…»» и «КОНФИДЕНЦИАЛЬНОКОНФИДЕНЦИАЛЬНО».

Чтобы исключить дубль во всех рендерерах, схлопываем `AlternateContent`:
оставляем содержимое первого подходящего `<mc:Choice>` (или `<mc:Fallback>`,
если Choice пуст), а сам контейнер удаляем — Word и LibreOffice просто
увидят обычный `<w:drawing>`/`<w:pict>` без альтернатив.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `element` | `не аннотирован` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `ac.getparent`
- `element.iter`
- `len`
- `list`
- `list(parent).index`
- `parent.insert`
- `parent.remove`

</details>

## _update_footers_and_headers

[backend/app/reports/word_builder.py:2481](../../../../../backend/app/reports/word_builder.py#L2481)

```python
def _update_footers_and_headers(doc: DocxDocument, project: Project) -> None
```

Подставляет название проекта в футеры/хедеры всех секций.

Текст футера лежит внутри `<w:txbxContent>` (текстовые поля), поэтому
обходим XML-дерево соответствующих parts напрямую. Дополнительно схлопываем
`<mc:AlternateContent>` (см. `_flatten_alternate_content`) — без этого в
некоторых просмотрщиках текст футера дублируется (Choice + Fallback ветки
отрисовываются обе).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(project.name or '').strip`
- `_flatten_alternate_content`
- `_replace_xxx_in_xml_subtree`
- `getattr`

</details>

## _update_object_under_test

[backend/app/reports/word_builder.py:2511](../../../../../backend/app/reports/word_builder.py#L2511)

```python
def _update_object_under_test(doc: DocxDocument, project: Project, hosts: list[Host]) -> None
```

Подставляет имя продукта и список стендов в раздел «Объект оценки» (СЗИ).

В шаблоне строка выглядит как «Стенды тестирования:» с неразрывным пробелом,
а плейсхолдер «XXX» может быть как в СЛЕДУЮЩЕМ параграфе, так и прямо в той же
строке после двоеточия/таба. Поэтому нормализуем пробелы перед сравнением и
обрабатываем оба варианта.

Стенды выводим как маркированный список (по одному хосту в строке): берём
параграф-плейсхолдер «XXX» (он уже под bullet-стилем `af5`) и клонируем его
под каждый дополнительный хост.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hosts` | `list[Host]` | `обязательный` | Набор хостов для обработки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(next_para.text or '').strip`
- `(project.name or '').strip`
- `Paragraph`
- `_append_bullets`
- `_apply_run_font`
- `_distrib_version`
- `_iter_body_paragraphs`
- `_normalize_ws`
- `_set_paragraph_text`
- `anchor.addnext`
- `copy.deepcopy`
- `enumerate`
- `host_labels.append`
- `len`
- `list`
- `new_p.findall`
- `new_p.remove`
- `normalized.lower`
- `normalized.lower().startswith`
- `normalized.startswith`
- `qn`
- `raw_text.replace`
- `re.sub`
- `wrapper.add_run`

</details>

## _update_object_under_test._normalize_ws

[backend/app/reports/word_builder.py:2531](../../../../../backend/app/reports/word_builder.py#L2531)

```python
def _normalize_ws(value: str) -> str
```

В теле вызывает `(value or '').replace`, `re.sub`, `re.sub('\\s+', ' ', (value or '').replace('\xa0', ' ')).strip`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `str`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(value or '').replace`
- `re.sub`
- `re.sub('\\s+', ' ', (value or '').replace('\xa0', ' ')).strip`

</details>

## _update_object_under_test._append_bullets

[backend/app/reports/word_builder.py:2534](../../../../../backend/app/reports/word_builder.py#L2534)

```python
def _append_bullets(template_para: Paragraph, labels: list[str]) -> None
```

Заменяет содержимое template_para на labels[0] и клонирует его под labels[1:].

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `template_para` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `labels` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_apply_run_font`
- `_set_paragraph_text`
- `anchor.addnext`
- `copy.deepcopy`
- `list`
- `new_p.findall`
- `new_p.remove`
- `qn`
- `wrapper.add_run`

</details>

## _find_research_h3

[backend/app/reports/word_builder.py:2594](../../../../../backend/app/reports/word_builder.py#L2594)

```python
def _find_research_h3(start_para: Paragraph) -> Paragraph | None
```

Ищет первый H3 «Исследование стенда …» после start_para до следующего H2.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `start_para` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Paragraph \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_heading_level`
- `_normalize_label`
- `_normalize_label(wrapper.text).startswith`
- `body.iterchildren`
- `children.index`
- `list`
- `qn`
- `start_para._element.getparent`

</details>

## _block_until_heading_lt

[backend/app/reports/word_builder.py:2611](../../../../../backend/app/reports/word_builder.py#L2611)

```python
def _block_until_heading_lt(start_para: Paragraph, max_level_exclusive: int) -> list
```

Собирает элементы от start_para до первого заголовка с уровнем < max_level_exclusive.

Например, при `max_level_exclusive=4` останавливаемся на H1/H2/H3.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `start_para` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `max_level_exclusive` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_heading_level`
- `body.iterchildren`
- `children.index`
- `elements.append`
- `list`
- `qn`
- `start_para._element.getparent`

</details>

## _group_items_by_host

[backend/app/reports/word_builder.py:2631](../../../../../backend/app/reports/word_builder.py#L2631)

```python
def _group_items_by_host(items: list[Vulnerability], *, indexes: dict, hosts: list[Host]) -> list[tuple[str, list[Vulnerability]]]
```

Группирует уязвимости по хосту в порядке списка `hosts` проекта.

Если у уязвимости нет привязки к хосту, относим её в группу первого хоста
проекта (fallback). Хосты, у которых нет ни одной уязвимости, в результат
не попадают.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `items` | `list[Vulnerability]` | `обязательный` | Набор элементов для обработки. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hosts` | `list[Host]` | `обязательный` | Набор хостов для обработки. |

Возвращает: `list[tuple[str, list[Vulnerability]]]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_vuln_host_address`
- `groups.setdefault`
- `groups.setdefault(host, []).append`
- `host_order.append`
- `seen.add`
- `set`

</details>

## _replicate_h3_with_cards

[backend/app/reports/word_builder.py:2668](../../../../../backend/app/reports/word_builder.py#L2668)

```python
def _replicate_h3_with_cards(doc: DocxDocument, *, h2: Paragraph, items: list[Vulnerability], indexes: dict, hosts: list[Host]) -> list[tuple[Vulnerability, list]] | None
```

Клонирует H3 «Исследование стенда» и блок-карточку под каждый стенд.

Возвращает список (vuln, cloned_card_block_elements) в порядке следования
в документе. Если шаблон H3/карточки не найден — `None` (вызывающий должен
использовать legacy-fallback). Оригинальные шаблонные элементы (H3 + одна
карточка) удаляются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `h2` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `items` | `list[Vulnerability]` | `обязательный` | Набор элементов для обработки. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hosts` | `list[Host]` | `обязательный` | Набор хостов для обработки. |

Возвращает: `list[tuple[Vulnerability, list]] \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_block_until_heading_lt`
- `_find_first_h4_after`
- `_find_research_h3`
- `_group_items_by_host`
- `_set_heading_text`
- `cloned.append`
- `copy.deepcopy`
- `el.getparent`
- `last.addnext`
- `parent.remove`
- `result.append`

</details>

## _remove_section

[backend/app/reports/word_builder.py:2725](../../../../../backend/app/reports/word_builder.py#L2725)

```python
def _remove_section(doc: DocxDocument, h2: Paragraph) -> None
```

Удаляет весь H2-раздел (заголовок + содержимое до следующего H1/H2).

Трейлинговый `<w:sectPr>` в конце body НЕ трогаем — иначе документ ломается
(это свойства секции, а не контент раздела).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `h2` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_block_elements_until_heading`
- `element.getparent`
- `parent.remove`
- `qn`

</details>

## _build_section

[backend/app/reports/word_builder.py:2739](../../../../../backend/app/reports/word_builder.py#L2739)

```python
def _build_section(doc: DocxDocument, *, section_h2_text: str, items: list[Vulnerability], kind: ReportKind, indexes: dict, project: Project, hosts: list[Host], image_bytes_by_id: dict[int, bytes], image_state: dict, remove_section_if_empty: bool=False) -> None
```

Клонирует пример карточки в указанном H2-разделе под каждый элемент `items`.

Если в разделе есть H3 «Исследование стенда …», клонируем его под каждый
стенд (хост) и под каждым размещаем карточки уязвимостей, привязанных к
этому стенду. Если элементов нет, пример карточки удаляется; а при
`remove_section_if_empty` — удаляется весь раздел целиком (заголовок тоже),
чтобы в отчёте не оставалось пустых разделов (напр. «слабости», когда ни
low-уязвимостей, ни info-находок нет).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `section_h2_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `items` | `list[Vulnerability]` | `обязательный` | Набор элементов для обработки. |
| `kind` | `ReportKind` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `project` | `Project` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hosts` | `list[Host]` | `обязательный` | Набор хостов для обработки. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_state` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `remove_section_if_empty` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_card_block`
- `_fill_card`
- `_find_card_anchor`
- `_find_h2_paragraph`
- `_remove_block`
- `_remove_section`
- `_replicate_card`
- `_replicate_h3_with_cards`
- `enumerate`
- `len`
- `zip`

</details>

## _find_h2_paragraph

[backend/app/reports/word_builder.py:2807](../../../../../backend/app/reports/word_builder.py#L2807)

```python
def _find_h2_paragraph(doc: DocxDocument, section_h2_text: str) -> Paragraph | None
```

Возвращает H2-параграф с указанным текстом или None.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `section_h2_text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Paragraph \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_heading_level`
- `_iter_body_paragraphs`
- `_normalize_label`

</details>

## _is_test_list_item

[backend/app/reports/word_builder.py:2816](../../../../../backend/app/reports/word_builder.py#L2816)

```python
def _is_test_list_item(paragraph: Paragraph) -> bool
```

Параграф вида «Test–N «Наименование теста»» в разделе 4.1.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraph` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bool`.

<details>
<summary>Прямые вызовы в теле</summary>

- `bool`
- `paragraph.text.strip`
- `re.match`

</details>

## _build_test_procedures_list

[backend/app/reports/word_builder.py:2822](../../../../../backend/app/reports/word_builder.py#L2822)

```python
def _build_test_procedures_list(doc: DocxDocument, items: list[Vulnerability]) -> None
```

Раздел 4.1 «Перечень тестовых процедур» — список тестов = названия items.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `items` | `list[Vulnerability]` | `обязательный` | Набор элементов для обработки. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(vuln.title or '').strip`
- `Paragraph`
- `_find_h2_paragraph`
- `_heading_level`
- `_is_test_list_item`
- `_set_paragraph_text`
- `body.iterchildren`
- `children.index`
- `copy.deepcopy`
- `ellipsis_paragraph._element.getparent`
- `ellipsis_paragraph._element.getparent().remove`
- `enumerate`
- `last_element.addnext`
- `len`
- `list`
- `para._element.getparent`
- `para._element.getparent().remove`
- `parent.remove`
- `qn`
- `range`
- `rendered.append`
- `section._element.getparent`
- `tail._element.getparent`
- `test_paragraphs.append`
- `wrapper.text.strip`
- `zip`

</details>

## _fill_analysis_result_placeholders

[backend/app/reports/word_builder.py:2885](../../../../../backend/app/reports/word_builder.py#L2885)

```python
def _fill_analysis_result_placeholders(doc: DocxDocument) -> None
```

Заменяет многоточия в 4.3.1/4.3.3 жёлтыми подсказками для заполнения.

Заполненный текст и соседний раздел анализа поверхности атаки не меняются.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_apply_run_highlight`
- `_block_elements_until_heading`
- `_heading_level`
- `_normalize_label`
- `_set_paragraph_text`
- `label.startswith`
- `next`
- `paragraph.text.strip`
- `prompts.items`
- `qn`

</details>

## _identify_test_header

[backend/app/reports/word_builder.py:2929](../../../../../backend/app/reports/word_builder.py#L2929)

```python
def _identify_test_header(text: str) -> str | None
```

В теле вызывает `_normalize_label`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `text` | `str` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `str \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_normalize_label`

</details>

## _find_first_h4_after

[backend/app/reports/word_builder.py:2937](../../../../../backend/app/reports/word_builder.py#L2937)

```python
def _find_first_h4_after(start_para: Paragraph, max_stop_level: int=2) -> Paragraph | None
```

Возвращает первый H4-параграф после start_para до заголовка ≤ max_stop_level.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `start_para` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `max_stop_level` | `int` | `2` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `Paragraph \| None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_heading_level`
- `body.iterchildren`
- `children.index`
- `list`
- `qn`
- `start_para._element.getparent`

</details>

## _block_until_heading_lte

[backend/app/reports/word_builder.py:2954](../../../../../backend/app/reports/word_builder.py#L2954)

```python
def _block_until_heading_lte(start_para: Paragraph, max_stop_level: int) -> list
```

Собирает XML-элементы от стартового параграфа до заголовка ≤ max_stop_level (не включая).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `start_para` | `Paragraph` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `max_stop_level` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_heading_level`
- `body.iterchildren`
- `children.index`
- `elements.append`
- `list`
- `qn`
- `start_para._element.getparent`

</details>

## _filter_paragraph_elements

[backend/app/reports/word_builder.py:2971](../../../../../backend/app/reports/word_builder.py#L2971)

```python
def _filter_paragraph_elements(elements: list, doc: DocxDocument) -> list[Paragraph]
```

В теле вызывает `Paragraph`, `qn`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `elements` | `list` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Paragraph]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `qn`

</details>

## _fill_test_card

[backend/app/reports/word_builder.py:2975](../../../../../backend/app/reports/word_builder.py#L2975)

```python
def _fill_test_card(block_elements: list, *, doc: DocxDocument, vuln: Vulnerability, sequence: int, image_bytes_by_id: dict[int, bytes], files_by_id: dict[int, File], files_by_vuln_id: dict[int, list[File]], image_state: dict) -> None
```

Заполняет один блок-карточку теста в разделе 4.4.

H4 → «Тест на проникновение Test-N «<title>»».
«Описание теста:» → vuln.impact (описание воздействия/уязвимости).
«Шаги при проведении теста:» → этапы без картинок.
«Ожидаемый результат:» → жёлтая подсказка «Заполните ожидаемый результат».
«Фактический результат:» → этапы с картинками.
«Вывод:» → краткий шаблонный итог.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `block_elements` | `list` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `sequence` | `int` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_id` | `dict[int, File]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_vuln_id` | `dict[int, list[File]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_state` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(vuln.title or '').strip`
- `_apply_run_font`
- `_apply_run_highlight`
- `_double_paragraph_left_indent`
- `_fill_actual_result_section`
- `_filter_paragraph_elements`
- `_identify_test_header`
- `_replace_section_with_lines`
- `_set_heading_text`
- `_split_to_lines`
- `_step_one_line`
- `_strip_markdown_formatting`
- `_strip_markdown_formatting(vuln.description).strip`
- `_strip_markdown_formatting(vuln.impact).strip`
- `conclusion_header.add_run`
- `enumerate`
- `list`
- `parent.remove`
- `section_headers.get`
- `sections.get`
- `sections.setdefault`
- `sections[current].append`
- `tail._element.getparent`

</details>

## _split_to_lines

[backend/app/reports/word_builder.py:3082](../../../../../backend/app/reports/word_builder.py#L3082)

```python
def _split_to_lines(value: str) -> list[str]
```

Разбивает текст на непустые строки (без обрезки внутри строк).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `value` | `str` | `обязательный` | Входное значение преобразования/проверки. |

Возвращает: `list[str]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `(value or '').splitlines`
- `line.strip`
- `value.strip`

</details>

## _replace_section_with_lines

[backend/app/reports/word_builder.py:3087](../../../../../backend/app/reports/word_builder.py#L3087)

```python
def _replace_section_with_lines(*, paragraphs: list[Paragraph], lines: list[str], strip_numbering: bool=False) -> list[Paragraph]
```

Заменяет содержимое раздела (после подписи) на список строк.

Если данных нет — ставим единственное многоточие «…».
Лишние шаблонные параграфы удаляем. Опция `strip_numbering=True`
отключает Word'овскую авто-нумерацию (для шагов/этапов теста).

Возвращает список фактически использованных контентных параграфов —
чтобы вызывающий код мог, например, удвоить им левый отступ.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraphs` | `list[Paragraph]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `lines` | `list[str]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `strip_numbering` | `bool` | `False` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Paragraph]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_apply_run_font`
- `_set_paragraph_text`
- `_strip_paragraph_numbering`
- `anchor.addnext`
- `copy.deepcopy`
- `list`
- `new_p.findall`
- `new_p.remove`
- `parent.remove`
- `qn`
- `tail._element.getparent`
- `tail._element.getparent().remove`
- `used.append`
- `wrapper.add_run`

</details>

## _fill_actual_result_section

[backend/app/reports/word_builder.py:3134](../../../../../backend/app/reports/word_builder.py#L3134)

```python
def _fill_actual_result_section(*, paragraphs: list[Paragraph], steps: list[dict], vuln: Vulnerability, image_bytes_by_id: dict[int, bytes], files_by_id: dict[int, File], files_by_vuln_id: dict[int, list[File]], image_state: dict, doc: DocxDocument) -> list[Paragraph]
```

«Фактический результат:» — для каждого этапа сначала строка-описание, затем его картинки.

В отчёт идут только картинки, явно привязанные к этапам уязвимости через
`image_file_ids` или markdown в описании этапа. «Свободные» файлы-доказательства
в отчёт не попадают. Возвращает список контентных строк-описаний этапов
(без параграфов с картинками/подписями), чтобы вызывающий код мог удвоить
им левый отступ.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `paragraphs` | `list[Paragraph]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `steps` | `list[dict]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `vuln` | `Vulnerability` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_id` | `dict[int, File]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_vuln_id` | `dict[int, list[File]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_state` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `list[Paragraph]`.

<details>
<summary>Прямые вызовы в теле</summary>

- `Paragraph`
- `_apply_run_font`
- `_figure_caption_text`
- `_insert_image_with_caption`
- `_replace_section_with_lines`
- `_set_paragraph_text`
- `_step_image_file_ids`
- `_step_one_line`
- `_strip_paragraph_numbering`
- `anchor_element.addnext`
- `bool`
- `copy.deepcopy`
- `enumerate`
- `files_by_id.get`
- `image_bytes_by_id.get`
- `list`
- `new_p.findall`
- `new_p.remove`
- `parent.remove`
- `qn`
- `tail._element.getparent`
- `text_paragraphs.append`
- `wrapper.add_run`

</details>

## _build_test_executions

[backend/app/reports/word_builder.py:3209](../../../../../backend/app/reports/word_builder.py#L3209)

```python
def _build_test_executions(doc: DocxDocument, items: list[Vulnerability], image_bytes_by_id: dict[int, bytes], *, files_by_id: dict[int, File], files_by_vuln_id: dict[int, list[File]], indexes: dict, hosts: list[Host], image_state: dict) -> None
```

Раздел 4.4 «Выполнение тестов» — клонирует карточку H4 на каждый item.

Если в шаблоне присутствует H3 «Исследование стенда …», клонируем его под
каждый стенд и под каждым размещаем карточки тестов соответствующих
уязвимостей.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `doc` | `DocxDocument` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `items` | `list[Vulnerability]` | `обязательный` | Набор элементов для обработки. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_id` | `dict[int, File]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `files_by_vuln_id` | `dict[int, list[File]]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `hosts` | `list[Host]` | `обязательный` | Набор хостов для обработки. |
| `image_state` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `None`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_block_until_heading_lte`
- `_fill_test_card`
- `_find_first_h4_after`
- `_find_h2_paragraph`
- `_replicate_card`
- `_replicate_h3_with_cards`
- `element.getparent`
- `enumerate`
- `len`
- `parent.remove`
- `zip`

</details>

## _build_common

[backend/app/reports/word_builder.py:3273](../../../../../backend/app/reports/word_builder.py#L3273)

```python
def _build_common(kind: ReportKind, data: dict, indexes: dict, image_bytes_by_id: dict[int, bytes]) -> bytes
```

В теле вызывает `BytesIO`, `_build_section`, `_build_test_executions`, `_build_test_procedures_list`, `_enable_auto_field_update`, `_fill_analysis_result_placeholders`, `_fill_credentials_table`, `_force_h3_non_bold`; полный список ниже.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `kind` | `ReportKind` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `data` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bytes`.

<details>
<summary>Прямые вызовы в теле</summary>

- `BytesIO`
- `_build_section`
- `_build_test_executions`
- `_build_test_procedures_list`
- `_enable_auto_field_update`
- `_fill_analysis_result_placeholders`
- `_fill_credentials_table`
- `_force_h3_non_bold`
- `_normalize_heading_sizes`
- `_rebuild_toc`
- `_set_all_sections_landscape`
- `_sort_vulns_by_host_and_severity`
- `_split_vulnerabilities`
- `_update_cover_date`
- `_update_cover_distrib_version`
- `_update_cover_page`
- `_update_findings_summary_text`
- `_update_footers_and_headers`
- `_update_object_under_test`
- `_update_pp_headings`
- `_update_project_intro`
- `_update_severity_summary_table`
- `_update_task_link`
- `_update_test_stand_paragraphs`
- `buffer.getvalue`
- `data.get`
- `doc.save`
- `indexes.get`
- `len`
- `load_template`
- `severity_counts.get`

</details>

## build_szi

[backend/app/reports/word_builder.py:3375](../../../../../backend/app/reports/word_builder.py#L3375)

```python
def build_szi(data: dict, indexes: dict, image_bytes_by_id: dict[int, bytes]) -> bytes
```

Собирает СЗИ-отчёт (сертификация).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `data` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bytes`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_build_common`

</details>

## build_pp

[backend/app/reports/word_builder.py:3380](../../../../../backend/app/reports/word_builder.py#L3380)

```python
def build_pp(data: dict, indexes: dict, image_bytes_by_id: dict[int, bytes]) -> bytes
```

Собирает ПП-отчёт (внутренняя приёмка).

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `data` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `indexes` | `dict` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |
| `image_bytes_by_id` | `dict[int, bytes]` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `bytes`.

<details>
<summary>Прямые вызовы в теле</summary>

- `_build_common`

</details>
