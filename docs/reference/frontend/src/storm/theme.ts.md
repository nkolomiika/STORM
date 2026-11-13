# frontend/src/storm/theme.ts

Сгенерировано из объявлений кода. [Правила чтения](../../../../METHODS.md).

Методов и именованных функций: **5**.

## readStored

[frontend/src/storm/theme.ts:17](../../../../../frontend/src/storm/theme.ts#L17)

```typescript
readStored() => Theme
```

Read the persisted preference; default to light.

Возвращает: `Theme`.

<details>
<summary>Прямые вызовы в теле</summary>

- `window.localStorage.getItem`

</details>

## reflect

[frontend/src/storm/theme.ts:27](../../../../../frontend/src/storm/theme.ts#L27)

```typescript
reflect(theme: Theme) => void
```

Mirror the theme onto <html data-theme> so storm.css can style/invert.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `theme` | `Theme` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `document.documentElement.setAttribute`

</details>

## setTheme

[frontend/src/storm/theme.ts:41](../../../../../frontend/src/storm/theme.ts#L41)

```typescript
setTheme(theme) => void
```

В теле вызывает `reflect`, `set`, `window.localStorage.setItem`.

| Параметр | Тип | По умолчанию | Назначение |
| --- | --- | --- | --- |
| `theme` | `Theme` | `обязательный` | Определяется именем/типом и контрактом вызывающего кода. |

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `reflect`
- `set`
- `window.localStorage.setItem`

</details>

## toggleTheme

[frontend/src/storm/theme.ts:50](../../../../../frontend/src/storm/theme.ts#L50)

```typescript
toggleTheme() => void
```

В теле вызывает `get`, `get().setTheme`.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `get`
- `get().setTheme`

</details>

## initTheme

[frontend/src/storm/theme.ts:54](../../../../../frontend/src/storm/theme.ts#L54)

```typescript
initTheme() => void
```

Apply the persisted theme before the app paints. Called once from main.tsx.

Возвращает: `void`.

<details>
<summary>Прямые вызовы в теле</summary>

- `readStored`
- `reflect`

</details>
