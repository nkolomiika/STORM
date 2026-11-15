import { afterEach, describe, expect, it, vi } from "vitest";
import { activityVerb, activityNoun, formatRelativeTime, t, useLangStore } from "./i18n";

afterEach(() => {
  useLangStore.getState().setLang("en");
  vi.useRealTimers();
});

describe("interface localization", () => {
  it("supports a fixed Russian section without changing the user's language", () => {
    useLangStore.getState().setLang("en");
    expect(t("Docs", undefined, "ru")).toBe("Docs");
    expect(t("Docs")).toBe("Docs");
    expect(useLangStore.getState().lang).toBe("en");
  });
  it("changes language, persists it and preserves unknown user content", () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    const storage = { setItem: vi.fn() };
    Object.defineProperty(window, "localStorage", { configurable: true, value: storage });
    try {
      useLangStore.getState().setLang("ru");
      expect(storage.setItem).toHaveBeenCalledWith("storm.lang", "ru");
    } finally {
      if (descriptor) Object.defineProperty(window, "localStorage", descriptor);
    }
    expect(t("Sign in")).toBe("Войти");
    expect(t("Clipboard unavailable")).toBe("Буфер обмена недоступен");
    expect(t("Customer-defined host")).toBe("Customer-defined host");
    expect(activityVerb("added")).toBe("добавил");
    expect(t("added")).toBe("добавлено");
    useLangStore.getState().setLang("en");
    expect(t("Sign in")).toBe("Sign in");
  });

  it("interpolates values literally without translating data or resolving inherited keys", () => {
    useLangStore.getState().setLang("ru");
    const payload = 'a$&{token}<script>@example.com';
    expect(t("Host “{host}” not found", { host: payload })).toBe(`Хост «${payload}» не найден`);
    expect(t("{count} {missing} {constructor}", { count: 0 })).toBe("0 {missing} {constructor}");
  });

  it.each([
    [1, "хост"], [2, "хоста"], [5, "хостов"], [11, "хостов"],
    [21, "хост"], [22, "хоста"], [25, "хостов"],
  ])("uses the correct Russian count form for %i hosts", (count, noun) => {
    useLangStore.getState().setLang("ru");
    expect(activityNoun("host", "hosts", count)).toBe(noun);
  });

  it("formats loaded timestamps using the current language and handles invalid dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-14T12:00:00Z"));
    const timestamp = "2026-11-14T11:58:00Z";
    expect(formatRelativeTime(timestamp)).toBe("2 min ago");
    useLangStore.getState().setLang("ru");
    expect(formatRelativeTime(timestamp)).toBe("2 мин. назад");
    expect(formatRelativeTime("2026-11-13T12:00:00Z")).toBe("вчера");
    expect(formatRelativeTime("invalid")).toBe("");
    expect(formatRelativeTime(null)).toBe("");
    expect(formatRelativeTime("2026-11-15T12:00:00Z")).toBe("только что");
  });
});
