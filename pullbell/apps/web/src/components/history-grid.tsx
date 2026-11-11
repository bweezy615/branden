"use client";

import { restockHistory, timeAgo, type FeedItem, type Listing } from "@pullbell/db/shared";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Restock counts per retailer for the last 7 days, bucketed in the viewer's own time zone,
// so it renders only in the browser.
export function HistoryGrid({ listings, events }: { listings: Listing[]; events: FeedItem[] }) {
  const inBrowser = useSyncExternalStore(subscribe, () => true, () => false);
  if (!inBrowser) return <div className="h-32 animate-pulse rounded-2xl bg-line/50" />;

  const now = new Date();
  const grid = restockHistory(listings, events, now);
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-line">
      <table className="w-full min-w-[34rem] text-sm">
        <thead className="bg-card text-xs text-muted">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Retailer</th>
            {grid.days.map((d) => (
              <th key={d} className="px-2 py-2 text-center font-medium">
                {d}
              </th>
            ))}
            <th className="px-3 py-2 text-right font-medium">Last drop</th>
          </tr>
        </thead>
        <tbody>
          {grid.rows.map((row) => (
            <tr key={row.retailer.slug} className="border-t border-line">
              <td className="px-3 py-2 font-medium">{row.retailer.name}</td>
              {row.counts.map((count, i) => (
                <td key={i} className="px-2 py-2 text-center">
                  {count > 0 ? (
                    <span className="inline-grid size-6 place-items-center rounded-full bg-bell text-xs font-bold text-ink">
                      {count}
                    </span>
                  ) : (
                    <span className="text-muted">–</span>
                  )}
                </td>
              ))}
              <td className="px-3 py-2 text-right text-muted">
                {row.lastRestockAt ? timeAgo(row.lastRestockAt, now) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
