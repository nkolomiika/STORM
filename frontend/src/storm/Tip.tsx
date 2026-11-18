import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** Общая подсказка для кнопок действий, включая недоступные. */
export function Tip({ label, children }: { label: string; children: ReactNode }) {
  const titles = useRef<Map<Element, string>>(new Map());
  const restoreTitles = () => {
    titles.current.forEach((title, node) => { if (!node.hasAttribute('title')) node.setAttribute('title', title); });
    titles.current.clear();
  };
  useEffect(() => () => restoreTitles(), []);
  const hide = () => { restoreTitles(); setBox(null); };
  const [box, setBox] = useState<DOMRect | null>(null);
  return (
    <span
      data-storm-tooltip={label}
      style={{ display: "inline-flex" }}
      onMouseEnter={(e) => {
        e.currentTarget.querySelectorAll('[title]').forEach((node) => {
          titles.current.set(node, node.getAttribute('title') || ''); node.removeAttribute('title');
        });
        setBox(e.currentTarget.getBoundingClientRect());
      }}
      onFocus={(e) => setBox(e.currentTarget.getBoundingClientRect())}
      onBlur={hide}
      onMouseLeave={hide}
      onClickCapture={hide}
    >
      {children}
      {box != null &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              left: box.left + box.width / 2,
              top: box.top - 9,
              transform: "translate(-50%, -100%)",
              padding: "5px 9px",
              borderRadius: 7,
              background: "var(--st-text)",
              color: "var(--st-surface)",
              font: "600 11.5px Inter, sans-serif",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: "0 8px 24px rgba(15,27,45,.22)",
              zIndex: 200,
            }}
          >
            {label}
          </div>,
          document.body,
        )}
    </span>
  );
}
