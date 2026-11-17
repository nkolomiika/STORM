import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { vi } from "vitest";

import { StormAppSecFields, type AppSecFieldsValue } from "./StormAppSecFields";
import { getTask, findWorksVersions, findWorksProductCodes } from '../api';
import { useToastStore } from '../store';

/* The AppSec fields drive the Works export: Component/Version are typeaheads that
   resolve a name to a Works UUID, Assignee is a typeahead over STORM users whose
   username is the IAM login. We mock the api layer and assert the picks flow back
   through onChange with the right code/name. */
vi.mock("../api", () => ({
  findWorksProductCodes: vi.fn(async () => [{ code: 'dbc', name: 'DBC' }, { code: '_am', name: '#AM' }, { code: 'AIS', name: 'AIS' }, { code: '285902', name: 'OST' }]),
  getTask: vi.fn(async (key: string) => ({ key, url: `https://works.example/${key}`,
    summary: 'Full assessment', status: 'Open', status_category: 'todo', issue_type: 'Assessment',
    priority: 'Major', assignee: null, assignee_username: null, reporter: null,
    created: '', updated: '', description: '', labels: [], product_code: 'product',
    component: { code: 'component-id', name: 'Component' },
    components: [{ code: 'component-id', name: 'Component' }], affected_versions: [],
  })),
  getApiErrorMessage: vi.fn((_error: unknown, fallback: string) => fallback),
  searchUsers: vi.fn(async (q: string) => {
    const all = [
      { username: "alice", full_name: "Alice Anderson", is_sso: false },
      { username: "bob", full_name: null, is_sso: false },
    ];
    const ql = (q || "").toLowerCase();
    return all.filter((u) => !ql || u.username.toLowerCase().includes(ql) || (u.full_name ?? "").toLowerCase().includes(ql));
  }),
  findWorksComponents: vi.fn(async (q: string) =>
    q.toLowerCase().includes("seg") ? [{ code: "c-uuid", name: "SEGR" }] : [{ code: "c-uuid", name: "SEGR" }]
  ),
  findWorksVersions: vi.fn(async () => [{ code: "v-uuid", name: "Platform V Stack 1.0.2" }, { code: "v-uuid-2", name: "Platform V Stack 2.0" }]),
  getTasks: vi.fn(async () => ({
    items: [
      {
        key: "APPSEC-100",
        url: "https://works.example/APPSEC-100",
        summary: "Security assessment",
        status: "Open",
        status_category: "todo",
        issue_type: "Bug",
        priority: "High",
        product_code: 'product', component: { code: 'component-id', name: 'Component' },
        assignee: null,
        updated: "",
        created: "",
      },
    ],
    next_page_token: null,
    is_last: true,
  })),
}));

const EMPTY: AppSecFieldsValue = {
  appsec_components: [],
  appsec_component_code: null,
  appsec_product_code: null,
  appsec_component_name: null,
  appsec_versions: [],
  appsec_assignee_name: null,
  appsec_assignee: null,
  appsec_ticket_url: null,
  appsec_ticket_key: null,
};

const Harness = ({ onChange }: { onChange: (p: Partial<AppSecFieldsValue>) => void }) => {
  const [value, setValue] = useState<AppSecFieldsValue>(EMPTY);
  return (
    <div className="storm">
      <StormAppSecFields
        value={value}
        onChange={(p) => {
          setValue((v) => ({ ...v, ...p }));
          onChange(p);
        }}
        works
        t={(s) => s}
      />
    </div>
  );
};

const type = async (el: HTMLElement, text: string) => {
  const { default: userEvent } = await import("@testing-library/user-event");
  const user = userEvent.setup();
  await user.click(el);
  await user.keyboard(text);
};

describe("StormAppSecFields", () => {
  it("assignee typeahead searches by name and picks the username (assigned_to)", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    const assignee = screen.getByPlaceholderText("Start typing a name…");
    await type(assignee, "al");

    // Dropdown shows ФИ only (first two words of the full name), not the username.
    const option = await screen.findByText("Alice Anderson");
    const { default: userEvent } = await import("@testing-library/user-event");
    await userEvent.setup().click(option);

    // onChange carries the username, not the display name.
    expect(onChange).toHaveBeenCalledWith({ appsec_assignee: "alice", appsec_assignee_name: "Alice Anderson" });
  });

  it("component typeahead resolves a name to its Works code", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    const component = screen.getByPlaceholderText("Start typing a component…");
    await type(component, "seg");

    const option = await screen.findByText("SEGR");
    const { default: userEvent } = await import("@testing-library/user-event");
    await userEvent.setup().click(option);

    expect(onChange).toHaveBeenCalledWith({ appsec_component_code: "c-uuid", appsec_component_name: "SEGR", appsec_components: [{ code: 'c-uuid', name: 'SEGR' }] });
  });

  it("falls back to the bare username when a user has no full name", async () => {
    render(<Harness onChange={vi.fn()} />);
    const assignee = screen.getByPlaceholderText("Start typing a name…");
    await type(assignee, "bob");
    // No full_name → option is just the username.
    await waitFor(() => expect(screen.getByText("bob")).toBeInTheDocument());
  });

  it("ticket field: pasting a URL stores it as the ticket url (no task key)", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const ticket = screen.getByPlaceholderText("Paste a URL or start typing a ticket…");
    const { default: userEvent } = await import("@testing-library/user-event");
    await userEvent.setup().click(ticket);
    await userEvent.setup().paste("https://tracker.example/ABC-7");
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ appsec_ticket_url: "https://tracker.example/ABC-7", appsec_ticket_key: null }));
  });

  it("ticket field: typing a name shows Tasks and picking stores url + key", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const ticket = screen.getByPlaceholderText("Paste a URL or start typing a ticket…");
    await type(ticket, "APPSEC");
    const option = await screen.findByText("Security assessment");
    const { default: userEvent } = await import("@testing-library/user-event");
    await userEvent.setup().click(option);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ appsec_ticket_url: "https://works.example/APPSEC-100", appsec_ticket_key: "APPSEC-100", appsec_product_code: 'product', appsec_component_code: 'component-id', appsec_component_name: 'Component' })));
  });

  it("allows saving a project with no ticket", () => {
    render(<StormAppSecFields value={EMPTY} onChange={vi.fn()} works={false} t={(s) => s} />);
    const input = screen.getByRole("textbox", { name: "AppSec ticket" });
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  it("invalidates a selected ticket when its text is edited without erasing the draft", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const input = screen.getByPlaceholderText("Paste a URL or start typing a ticket…");
    await type(input, "APPSEC");
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    await user.click(await screen.findByText("Security assessment"));
    await user.click(input);
    await user.keyboard("x");
    expect(input).toHaveValue("APPSEC-100x");
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ appsec_ticket_url: null, appsec_ticket_key: null, appsec_product_code: null, appsec_component_code: null }));
  });

  it('ignores old ticket metadata after the user changes the input', async () => {
    const response = await getTask('APPSEC-100');
    let resolve!: (value: typeof response) => void;
    vi.mocked(getTask).mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const input = screen.getByPlaceholderText('Paste a URL or start typing a ticket…');
    await type(input, 'APPSEC');
    const { default: userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    await user.click(await screen.findByText('Security assessment'));
    await user.clear(input);
    await user.type(input, 'different');
    await act(async () => { resolve(response); });
    expect(input).toHaveValue('different');
    expect(onChange).not.toHaveBeenCalledWith(expect.objectContaining({ appsec_product_code: 'product' }));
  });

  it('keeps a failed ticket lookup out of the project and displays a safe notification', async () => {
    vi.mocked(getTask).mockRejectedValueOnce(new Error('private upstream diagnostic'));
    useToastStore.setState({ toasts: [] });
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await type(screen.getByPlaceholderText('Paste a URL or start typing a ticket…'), 'APPSEC');
    const { default: userEvent } = await import('@testing-library/user-event');
    await userEvent.setup().click(await screen.findByText('Security assessment'));
    await waitFor(() => expect(useToastStore.getState().toasts.some((toast) => toast.message === "Couldn't load this task")).toBe(true));
    expect(onChange).not.toHaveBeenCalledWith(expect.objectContaining({ appsec_ticket_key: 'APPSEC-100' }));
  });

  it('shows a safe lookup failure once and allows retrying after the input changes', async () => {
    vi.mocked(findWorksVersions).mockRejectedValueOnce(new Error('private diagnostic'));
    useToastStore.setState({ toasts: [] });
    render(<Harness onChange={vi.fn()} />);
    expect(screen.queryByText('AppSec export (Works)')).not.toBeInTheDocument();
    const input = screen.getByPlaceholderText('Start typing a version…');
    await type(input, 'bad');
    await waitFor(() => expect(useToastStore.getState().toasts.some((toast) => toast.message === "Couldn't load options")).toBe(true));
    expect(useToastStore.getState().toasts.every((toast) => !toast.message.includes('private'))).toBe(true);
    const { default: userEvent } = await import('@testing-library/user-event');
    await userEvent.setup().type(input, 'x');
    expect(await screen.findByText('Platform V Stack 1.0.2')).toBeInTheDocument();
  });

  it("keeps multiple selected versions, prevents duplicates and removes only one item", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("Start typing a version…");
    await user.click(input);
    await user.click(await screen.findByText("Platform V Stack 1.0.2"));
    await user.click(input);
    await user.click(await screen.findByText("Platform V Stack 2.0"));
    expect(onChange).toHaveBeenLastCalledWith({ appsec_versions: [{ code: "v-uuid", name: "Platform V Stack 1.0.2" }, { code: "v-uuid-2", name: "Platform V Stack 2.0" }] });
    const calls = onChange.mock.calls.length;
    await user.click(input);
    const duplicates = await screen.findAllByText("Platform V Stack 1.0.2");
    await user.click(duplicates.find((item) => item.classList.contains("prow"))!);
    expect(onChange).toHaveBeenCalledTimes(calls);
    await user.click(screen.getByRole("button", { name: "Remove version: Platform V Stack 1.0.2" }));
    expect(onChange).toHaveBeenLastCalledWith({ appsec_versions: [{ code: "v-uuid-2", name: "Platform V Stack 2.0" }] });
  });
});

it.each([['DBC', 'dbc'], ['#AM', '_am'], ['AIS', 'AIS'], ['OST', '285902']])('stores exact native product code for %s', async (name, code) => {
  const onChange = vi.fn();
  render(<Harness onChange={onChange} />);
  const input = screen.getByRole('textbox', { name: 'Product code' });
  await type(input, name);
  const option = await screen.findByText(name);
  await act(async () => { option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); });
  expect(onChange).toHaveBeenLastCalledWith({ appsec_product_code: code });
  expect(input).toHaveValue(code);
  // Manual edits replace the previously chosen code, including clearing it.
  fireEvent.change(input, { target: { value: 'manual-code' } });
  expect(onChange).toHaveBeenLastCalledWith({ appsec_product_code: 'manual-code' });
  fireEvent.change(input, { target: { value: '' } });
  expect(onChange).toHaveBeenLastCalledWith({ appsec_product_code: null });
});

it('keeps product input usable and shows a toast when the catalog is unavailable', async () => {
  vi.mocked(findWorksProductCodes).mockRejectedValueOnce(new Error('private diagnostic'));
  useToastStore.setState({ toasts: [] });
  const onChange = vi.fn();
  render(<Harness onChange={onChange} />);
  await type(screen.getByRole('textbox', { name: 'Product code' }), 'dbc');
  await waitFor(() => expect(useToastStore.getState().toasts.length).toBe(1));
  expect(useToastStore.getState().toasts[0].message).toBe("Couldn't load options");
  expect(onChange).toHaveBeenLastCalledWith({ appsec_product_code: 'dbc' });
});
