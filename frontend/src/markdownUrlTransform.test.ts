import { describe, expect, it } from "vitest";
import { markdownUrlTransform, normalizeMarkdownForRender } from "./markdownUrlTransform";

describe("Markdown URL safety", () => {
  it.each(["png", "jpeg", "jpg", "gif", "webp", "avif", "bmp"])("allows pasted base64 %s screenshots", (type) => {
    const url = `data:image/${type};base64,aGVsbG8=`;
    expect(markdownUrlTransform(` ${url} `)).toBe(url);
  });
  it.each(["data:text/html;base64,PHNjcmlwdD4=", "data:image/svg+xml;base64,PHN2Zz4=", "data:image/png,abc", "data:image/png;base64,<>!", "javascript:alert(1)"])("rejects unsafe URL %s", (url) => {
    expect(markdownUrlTransform(url)).toBe("");
  });
  it.each(["https://example.test/a.png", "/api/v1/image/1", "mailto:dev@example.test"])("keeps a regular safe URL %s", (url) => {
    expect(markdownUrlTransform(url)).toBe(url);
  });
});

it("normalizes legacy image paragraphs without losing width metadata", () => {
  expect(normalizeMarkdownForRender(null)).toBe("");
  expect(normalizeMarkdownForRender(undefined)).toBe("");
  expect(normalizeMarkdownForRender('before\r\n![shot](/image "{width=320}")\r\nafter'))
    .toBe('before\n\n![shot](/image "{width=320}")\n\nafter');
  const normalized = "before\n\n![shot](/image)\n\nafter";
  expect(normalizeMarkdownForRender(normalized)).toBe(normalized);
});
