import checklistsJson from "./data/checklists.json";
import vehiclesJson from "./data/vehicles.json";
import type { Checklist, Vehicle } from "./types";

export const checklists: Checklist[] = checklistsJson;
export const vehicles: Vehicle[] = vehiclesJson;

export function itemCount(list: Checklist): number {
  return list.groups.reduce((n, g) => n + g.items.length, 0);
}
