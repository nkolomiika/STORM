import { describe, expect, it } from "vitest";
import { buildHostIndex } from "./hostIndex";

describe("host hierarchy index", () => {
  it("matches previous search for mixed names, duplicate names, IPs and all descendant levels", () => {
    const hosts = [
      { id: 1, host: "EXAMPLE.test" }, { id: 2, host: "api.example.test" },
      { id: 3, host: "v2.api.example.test" }, { id: 4, host: "example.test" },
      { id: 5, host: "192.0.2.1", origin: "ip" }, { id: 6, host: "alias.192.0.2.1" },
      { id: 7, host: "unrelated.test" }, { id: 8, host: "" }, { id: 9, host: "trailing." },
    ];
    const index = buildHostIndex(hosts);
    for (const host of hosts) {
      expect(index.descendants.get(host.id) ?? []).toEqual(hosts.filter((h) => h.id !== host.id && h.host.toLowerCase().endsWith(`.${host.host.toLowerCase()}`)));
      expect(index.nestedIds.has(host.id)).toBe(hosts.some((p) => p.id !== host.id && p.origin !== "ip" && host.host.toLowerCase().endsWith(`.${p.host.toLowerCase()}`)));
    }
  });

  it("preserves descendant order on a large project", () => {
    const hosts = Array.from({ length: 5000 }, (_, id) => ({ id, host: id % 5 === 0 ? `group${Math.floor(id / 5)}.test` : `api${id}.group${Math.floor(id / 5)}.test` }));
    const index = buildHostIndex(hosts);
    expect(index.nestedIds.size).toBe(4000);
    expect(index.descendants.get(0)?.map((host) => host.id)).toEqual([1, 2, 3, 4]);
    expect(index.descendants.get(4995)?.map((host) => host.id)).toEqual([4996, 4997, 4998, 4999]);
  });
});
