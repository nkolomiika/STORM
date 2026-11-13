import { render } from "@testing-library/react";
import { mergeAttributes } from "@tiptap/core";
import ReactMarkdown from "react-markdown";
import { describe, expect, it } from "vitest";
import { markdownUrlTransform } from "./markdownUrlTransform";

describe("untrusted Markdown and editor attributes", () => {
  it("does not turn __proto__ into inherited executable DOM attributes", () => {
    const poisoned = JSON.parse('{"__proto__":{"onclick":"alert(1)"},"class":"safe"}');
    const result = mergeAttributes({}, poisoned);
    expect((result as Record<string, unknown>).onclick).toBeUndefined();
    expect(({} as Record<string, unknown>).onclick).toBeUndefined();
    expect(result.class).toBe("safe");
  });

  it.each([
    '<img src="x" onerror="alert(1)"><script>alert(1)</script>',
    '[click](javascript:alert(1))',
    '![image](data:image/svg+xml;base64,PHN2Zz4=)',
    '[click](data:text/html;base64,PHNjcmlwdD4=)',
  ])("renders hostile content without executable nodes or URLs: %s", (content) => {
    const { container } = render(<ReactMarkdown urlTransform={markdownUrlTransform}>{content}</ReactMarkdown>);
    expect(container.querySelector("script,iframe,object,embed,[onerror],[onclick]")).toBeNull();
    for (const node of Array.from(container.querySelectorAll("[href],[src]"))) {
      const url = node.getAttribute("href") ?? node.getAttribute("src") ?? "";
      expect(url).not.toMatch(/^(?:javascript:|data:(?!image\/(?:png|jpe?g|gif|webp|avif|bmp);base64,))/i);
    }
  });
});
