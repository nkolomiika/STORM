/** Размер хранится в title Markdown-картинки, не превращая заметку в HTML. */
export function imageTitleSize(raw: unknown) {
  const value = typeof raw === "string" ? raw : "";
  const match = /(?:^|\s)\{width=(\d+)\}$/.exec(value);
  const width = match ? Math.max(64, Math.min(2400, Number(match[1]))) : null;
  return { width, title: match ? value.slice(0, match.index).trimEnd() : value };
}

export function sizedImageTitle(title: unknown, width: unknown) {
  const plain = imageTitleSize(title).title;
  return typeof width === "number" && Number.isFinite(width)
    ? `${plain}${plain ? " " : ""}{width=${Math.round(Math.max(64, Math.min(2400, width)))}}`
    : plain;
}
