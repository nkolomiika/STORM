import { describe, expect, it } from "vitest";
import { missingStsProjectFields } from "./projectExport";
import type { Project } from "../types";

const complete = { end_date: '2026-11-20', appsec_component_code: 'component-id', appsec_product_code: 'product', appsec_ticket_key: "APPSEC-1", appsec_assignee: "analyst", appsec_versions: [{ code: "v1", name: "Platform 1.0" }] } as Project;
describe("STS project requirements", () => {
  it("accepts complete project metadata and legacy single versions", () => {
    expect(missingStsProjectFields(complete)).toEqual([]);
    expect(missingStsProjectFields({ ...complete, appsec_ticket_key: null, appsec_ticket_url: "https://tracker/APPSEC-1", appsec_versions: [], appsec_version_code: "v1" })).toEqual([]);
  });
  it.each([
    [{ appsec_ticket_key: null }, ["AppSec ticket"]],
    [{ appsec_assignee: "   " }, ["Assignee"]],
    [{ appsec_versions: [] }, ["Affected versions"]],
    [{ appsec_product_code: '   ' }, ['Product code']],
    [{ appsec_component_code: null }, ['Component']],
    [{ end_date: null }, ['End date']],
    [{ appsec_ticket_key: null, appsec_assignee: null, appsec_versions: [] }, ["AppSec ticket", "Assignee", "Affected versions"]],
  ])("identifies missing fields %j", (patch, missing) => {
    expect(missingStsProjectFields({ ...complete, ...patch })).toEqual(missing);
  });
});
