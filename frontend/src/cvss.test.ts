import { describe, expect, it } from "vitest";
import { calculateCvssScore, normalizeCvssVector, severityFromCvssScore } from "./cvss";

describe("CVSS normalization and severity", () => {
  it.each([null, undefined, "", "  "])("treats an empty vector as missing (%s)", (vector) => {
    expect(calculateCvssScore("4.0", vector)).toEqual({ normalizedVector: null, score: null });
  });
  it("requires a version and replaces an old vector prefix", () => {
    expect(normalizeCvssVector(null, "AV:N")).toBeNull();
    expect(normalizeCvssVector("4.0", " CVSS:3.0/AV:N ")).toBe("CVSS:4.0/AV:N");
    expect(normalizeCvssVector("4.0", "/AV:N")).toBe("CVSS:4.0/AV:N");
  });
  it("calculates the CVSS 4.0 maximum-impact vector", () => {
    const vector = "CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:H/SI:H/SA:H";
    expect(calculateCvssScore("4.0", vector)).toEqual({ normalizedVector: vector, score: 10 });
  });
  it("keeps an invalid vector editable without throwing", () => {
    expect(calculateCvssScore("4.0", "invalid")).toEqual({ normalizedVector: "CVSS:4.0/invalid", score: null });
  });
  it.each([
    [null, "medium"], [undefined, "medium"], [NaN, "medium"],
    [0, "info"], [0.1, "low"], [3.9, "low"], [4, "medium"],
    [6.9, "medium"], [7, "high"], [8.9, "high"], [9, "critical"], [10, "critical"],
  ] as const)("maps score %s to %s at severity boundaries", (score, expected) => {
    expect(severityFromCvssScore(score, "medium")).toBe(expected);
  });
  it("defaults missing severity to info", () => {
    expect(severityFromCvssScore(null)).toBe("info");
  });
});
