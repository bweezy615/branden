import "./style.css";
import { config } from "./config";
import { checklists, itemCount, vehicles } from "./data";
import { emptyProgress, fromCode, parseProgress, toCode, toggleDone, toggleOwned } from "./store";
import type { Checklist, Progress } from "./types";

const STORAGE_KEY = "glovebox.progress.v1";

function loadProgress(): Progress {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === null ? emptyProgress() : parseProgress(saved);
}

let progress = loadProgress();

function save(next: Progress): void {
  progress = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  render();
}

function esc(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function bar(done: number, total: number): string {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return `<div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
    <p class="count">${done} / ${total} · ${pct}%</p>`;
}

function doneCount(list: Checklist): number {
  return (progress.done[list.id] ?? []).length;
}

function homeView(): string {
  const cards = checklists
    .map(
      (l) => `<a class="card" href="#/list/${l.id}">
        <h2>${esc(l.title)}</h2>
        <p>${esc(l.description)}</p>
        ${bar(doneCount(l), itemCount(l))}
      </a>`,
    )
    .join("");
  return `<section class="stack">${cards}
    <a class="card" href="#/vehicles"><h2>Garage</h2><p>Mark the vehicles you own.</p>${bar(progress.owned.length, vehicles.length)}</a>
  </section>
  <p class="hint">More checklists (collectibles, side activities, 100% completion) go live after launch on Nov 19.</p>`;
}

function listView(listId: string): string {
  const list = checklists.find((l) => l.id === listId);
  if (list === undefined) return `<p>Checklist not found. <a href="#/">Back</a></p>`;
  const done = new Set(progress.done[list.id] ?? []);
  const groups = list.groups
    .map(
      (g) => `<h3>${esc(g.title)}</h3><ul class="items">${g.items
        .map(
          (i) => `<li><label class="${done.has(i.id) ? "done" : ""}">
            <input type="checkbox" data-list="${list.id}" data-item="${i.id}" ${done.has(i.id) ? "checked" : ""}>
            <span><strong>${esc(i.name)}</strong>${i.note === undefined ? "" : `<small>${esc(i.note)}</small>`}</span>
          </label></li>`,
        )
        .join("")}</ul>`,
    )
    .join("");
  return `<a class="back" href="#/">← All checklists</a><h2>${esc(list.title)}</h2><p>${esc(list.description)}</p>
    ${bar(doneCount(list), itemCount(list))}${groups}`;
}

let vehicleQuery = "";
let vehicleClass = "";
let ownedOnly = false;

function vehiclesView(): string {
  const classes = [...new Set(vehicles.map((v) => v.class))].sort();
  const owned = new Set(progress.owned);
  const q = vehicleQuery.toLowerCase();
  const rows = vehicles
    .filter((v) => (q === "" || v.name.toLowerCase().includes(q)) && (vehicleClass === "" || v.class === vehicleClass) && (!ownedOnly || owned.has(v.id)))
    .map(
      (v) => `<li><label class="${owned.has(v.id) ? "done" : ""}">
        <input type="checkbox" data-vehicle="${v.id}" ${owned.has(v.id) ? "checked" : ""}>
        <span><strong>${esc(v.name)}</strong><small>${esc(v.class)} · ${esc(v.source)}${v.note === undefined ? "" : ` · ${esc(v.note)}`}</small></span>
      </label></li>`,
    )
    .join("");
  return `<a class="back" href="#/">← All checklists</a><h2>Garage</h2>
    ${bar(owned.size, vehicles.length)}
    <div class="filters">
      <input type="search" id="vq" placeholder="Search vehicles" value="${esc(vehicleQuery)}">
      <select id="vc"><option value="">All classes</option>${classes.map((c) => `<option ${c === vehicleClass ? "selected" : ""}>${esc(c)}</option>`).join("")}</select>
      <label class="inline"><input type="checkbox" id="vo" ${ownedOnly ? "checked" : ""}> Owned only</label>
    </div>
    <ul class="items">${rows || "<li><p>No vehicles match.</p></li>"}</ul>
    <p class="hint">The full vehicle list fills in after launch.</p>`;
}

function dataView(): string {
  return `<a class="back" href="#/">← All checklists</a><h2>My data</h2>
    <p>Your progress is saved on this device only. Copy this code to move it to another phone or browser.</p>
    <textarea readonly id="export" rows="4">${toCode(progress)}</textarea>
    <button id="copy">Copy code</button>
    <h3>Restore from a code</h3>
    <textarea id="import" rows="4" placeholder="Paste a code here"></textarea>
    <button id="restore">Restore</button>
    <p id="msg" class="hint"></p>
    <h3>Start over</h3>
    <button id="reset" class="danger">Erase all progress</button>`;
}

function footer(): string {
  const links = [
    config.supportUrl && `<a href="${config.supportUrl}" rel="noopener">Support the project</a>`,
    config.discordUrl && `<a href="${config.discordUrl}" rel="noopener">Discord</a>`,
    config.youtubeUrl && `<a href="${config.youtubeUrl}" rel="noopener">YouTube</a>`,
  ].filter(Boolean);
  return `${links.length ? `<p class="links">${links.join(" · ")}</p>` : ""}
    <p>${esc(config.brand)} is an unofficial fan project. It is not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive. Game names and item names belong to their owners.</p>`;
}

function route(): string {
  const hash = location.hash.replace(/^#/, "") || "/";
  const [, page, id] = hash.split("/");
  if (page === "list" && id !== undefined) return listView(id);
  if (page === "vehicles") return vehiclesView();
  if (page === "data") return dataView();
  return homeView();
}

const app = document.querySelector<HTMLElement>("#app");
if (app === null) throw new Error("#app element missing");

function render(): void {
  app!.innerHTML = `<header><a href="#/" class="brand">${esc(config.brand)}</a><span class="tag">${esc(config.tagline)}</span>
      <nav><a href="#/">Checklists</a><a href="#/vehicles">Garage</a><a href="#/data">My data</a></nav></header>
    <main>${route()}</main><footer>${footer()}</footer>`;
}

app.addEventListener("change", (e) => {
  const el = e.target as HTMLInputElement;
  if (el.dataset.list !== undefined && el.dataset.item !== undefined) return save(toggleDone(progress, el.dataset.list, el.dataset.item));
  if (el.dataset.vehicle !== undefined) return save(toggleOwned(progress, el.dataset.vehicle));
  if (el.id === "vc") { vehicleClass = el.value; render(); }
  if (el.id === "vo") { ownedOnly = el.checked; render(); }
});

app.addEventListener("input", (e) => {
  const el = e.target as HTMLInputElement;
  if (el.id !== "vq") return;
  vehicleQuery = el.value;
  render();
  const input = document.querySelector<HTMLInputElement>("#vq")!;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
});

app.addEventListener("click", (e) => {
  const el = e.target as HTMLElement;
  const msg = () => document.querySelector<HTMLElement>("#msg")!;
  if (el.id === "copy") {
    void navigator.clipboard.writeText(toCode(progress)).then(() => (el.textContent = "Copied"));
  }
  if (el.id === "restore") {
    const code = document.querySelector<HTMLTextAreaElement>("#import")!.value;
    try {
      save(fromCode(code));
      msg().textContent = "Progress restored.";
    } catch (err) {
      msg().textContent = `That code didn't work: ${(err as Error).message}`;
    }
  }
  if (el.id === "reset" && confirm("Erase all progress on this device?")) save(emptyProgress());
});

window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
});

render();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  void navigator.serviceWorker.register("/sw.js");
}
