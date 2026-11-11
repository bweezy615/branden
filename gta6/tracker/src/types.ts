export interface ChecklistItem {
  id: string;
  name: string;
  note?: string;
}

export interface ChecklistGroup {
  title: string;
  items: ChecklistItem[];
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  groups: ChecklistGroup[];
}

export interface Vehicle {
  id: string;
  name: string;
  class: string;
  source: string;
  note?: string;
}

export interface Progress {
  version: 1;
  done: Record<string, string[]>;
  owned: string[];
}
