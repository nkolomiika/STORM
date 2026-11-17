import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StormDatePicker } from "./StormDatePicker";
import { StormDocs } from "./StormDocs";
import { StormLogin } from "./StormLogin";
import { useLangStore } from "./i18n";
import { chaptersForRole } from "./docs";

vi.mock("../api", async (importOriginal) => ({
  ...await importOriginal<typeof import("../api")>(),
  getSsoConfig: vi.fn(async () => ({ enabled: false, button_label: "", start_url: "" })),
}));

afterEach(() => useLangStore.getState().setLang("en"));

describe("localized surfaces", () => {
  it("switches an open calendar without changing its date value", () => {
    useLangStore.getState().setLang("ru");
    const onChange = vi.fn();
    render(<StormDatePicker value="2026-11-14" onChange={onChange} />);
    fireEvent.click(screen.getByText("14.11.2026"));
    expect(screen.getByText("ноябрь 2026")).toBeInTheDocument();
    expect(screen.getByText("Пн")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Сегодня" })).toBeInTheDocument();
    act(() => useLangStore.getState().setLang("en"));
    expect(screen.getByText("November 2026")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear date" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "15" }));
    expect(onChange).toHaveBeenCalledWith("2026-11-15");
  });

  it("localizes documentation controls while keeping admin chapters private", () => {
    useLangStore.getState().setLang("en");
    render(<StormDocs isAdmin={false} />);
    expect(screen.getByPlaceholderText("Search Docs…")).toBeInTheDocument();
    expect(screen.getByText("API reference (Swagger)")).toBeInTheDocument();
    expect(screen.getByText("10 pages")).toBeInTheDocument();
    expect(screen.getByText("3 pages")).toBeInTheDocument();
    expect(screen.queryByText("User management")).not.toBeInTheDocument();
    expect(screen.queryByText("Управление пользователями")).not.toBeInTheDocument();
    expect(useLangStore.getState().lang).toBe("en");
    act(() => useLangStore.getState().setLang("ru"));
    expect(screen.getByPlaceholderText("Поиск по документации…")).toBeInTheDocument();
    expect(screen.getByText("Справочник API (Swagger)")).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Поиск по документации…"), { target: { value: "несуществующаяглава" } });
    expect(screen.getByText("Ничего не найдено.")).toBeInTheDocument();
  });

  it("keeps an open article in Russian when the interface language changes", () => {
    useLangStore.getState().setLang("en");
    render(<StormDocs isAdmin={false} />);
    fireEvent.click(screen.getByText("Getting started"));
    expect(screen.getByRole("heading", { name: "Вход в систему" })).toBeInTheDocument();
    act(() => useLangStore.getState().setLang("ru"));
    act(() => useLangStore.getState().setLang("en"));
    expect(screen.getByRole("heading", { name: "Начало работы" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Вход в систему" })).toBeInTheDocument();
    expect(useLangStore.getState().lang).toBe("en");
  });

  it("serves all active articles in Russian regardless of interface language", () => {
    useLangStore.getState().setLang("en");
    const chapters = chaptersForRole(true);
    expect(chapters).toHaveLength(16);
    for (const chapter of chapters) {
      expect(chapter.body, chapter.id).toMatch(/^# /);
      expect(chapter.body, chapter.id).toMatch(/[а-яё]/i);
    }
  });

  it("uses the saved language on sign-in and password recovery screens", async () => {
    useLangStore.getState().setLang("ru");
    render(<StormLogin />);
    expect(await screen.findByRole("heading", { name: "Войти" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Показать пароль" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Забыли пароль?" }));
    expect(screen.getByRole("heading", { name: "Сброс пароля" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Отправить ссылку" })).toBeDisabled();
  });
});
