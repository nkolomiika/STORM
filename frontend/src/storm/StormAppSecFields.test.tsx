import { render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { vi } from "vitest";

import { StormAppSecFields, type AppSecFieldsValue } from "./StormAppSecFields";

/* The AppSec fields drive the Works export: Component/Version are typeaheads that
   resolve a name to a Works UUID, Assignee is a typeahead over STORM users whose
   username is the IAM login. We mock the api layer and assert the picks flow back
   through onChange with the right code/name. */
vi.mock("../api", () => ({
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
  findWorksVersions: vi.fn(async () => [{ code: "v-uuid", name: "Platform V Stack 1.0.2" }]),
  getTasks: vi.fn(async () => ({
    items: [
      {
        key: "STS-100",
        url: "https://works.example/STS-100",
        summary: "Fix SQL injection",
        status: "Open",
        status_category: "todo",
        issue_type: "Bug",
        priority: "High",
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
  appsec_component_code: null,
  appsec_component_name: null,
  appsec_version_code: null,
  appsec_version_name: null,
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
    expect(onChange).toHaveBeenCalledWith({ appsec_assignee: "alice" });
  });

  it("component typeahead resolves a name to its Works code", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    const component = screen.getByPlaceholderText("Start typing a component…");
    await type(component, "seg");

    const option = await screen.findByText("SEGR");
    const { default: userEvent } = await import("@testing-library/user-event");
    await userEvent.setup().click(option);

    expect(onChange).toHaveBeenCalledWith({ appsec_component_code: "c-uuid", appsec_component_name: "SEGR" });
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
    expect(onChange).toHaveBeenCalledWith({ appsec_ticket_url: "https://tracker.example/ABC-7", appsec_ticket_key: null });
  });

  it("ticket field: typing a name shows Tasks and picking stores url + key", async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const ticket = screen.getByPlaceholderText("Paste a URL or start typing a ticket…");
    await type(ticket, "STS");
    const option = await screen.findByText("Fix SQL injection");
    const { default: userEvent } = await import("@testing-library/user-event");
    await userEvent.setup().click(option);
    expect(onChange).toHaveBeenCalledWith({ appsec_ticket_url: "https://works.example/STS-100", appsec_ticket_key: "STS-100" });
  });
});
