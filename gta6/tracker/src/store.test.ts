import { describe, expect, it } from "vitest";
import { checklists, vehicles } from "./data";
import { emptyProgress, fromCode, parseProgress, toCode, toggleDone, toggleOwned } from "./store";

describe("progress", () => {
  it("toggles checklist items and vehicles on and off", () => {
    let p = toggleDone(emptyProgress(), "launch-prep", "preload");
    expect(p.done["launch-prep"]).toEqual(["preload"]);
    p = toggleDone(p, "launch-prep", "preload");
    expect(p.done["launch-prep"]).toEqual([]);
    p = toggleOwned(p, "95-grotti-cheetah");
    expect(p.owned).toEqual(["95-grotti-cheetah"]);
  });

  it("round-trips through an export code", () => {
    const p = toggleOwned(toggleDone(emptyProgress(), "ultimate-edition", "ptt-youngins"), "shitzu-squalo");
    expect(fromCode(toCode(p))).toEqual(p);
  });

  it("rejects malformed progress", () => {
    expect(() => parseProgress('{"version":2,"done":{},"owned":[]}')).toThrow("Unsupported progress version");
    expect(() => parseProgress('{"version":1,"done":{"a":[1]},"owned":[]}')).toThrow("Progress.done.a");
    expect(() => fromCode("not base64!")).toThrow();
  });
});

describe("data", () => {
  it("has unique checklist ids and unique item ids per checklist", () => {
    const listIds = checklists.map((l) => l.id);
    expect(new Set(listIds).size).toBe(listIds.length);
    for (const list of checklists) {
      const ids = list.groups.flatMap((g) => g.items.map((i) => i.id));
      expect(new Set(ids).size, list.id).toBe(ids.length);
    }
  });

  it("has unique vehicle ids", () => {
    const ids = vehicles.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
