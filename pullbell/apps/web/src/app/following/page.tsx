"use client";

import type { FeedItem } from "@pullbell/db/shared";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FeedList, ProductGrid } from "@/components/cards";
import { useFollowing } from "@/components/following-provider";
import { api } from "@/lib/client";

export default function FollowingPage() {
  const { following } = useFollowing();
  const [feed, setFeed] = useState<{ items: FeedItem[]; at: Date } | null>(null);

  useEffect(() => {
    if (following === null) return;
    api.feed(true).then((items) => setFeed({ items, at: new Date() }));
  }, [following]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Following</h1>
      <AlertsCard />

      {following && (
        <>
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Brands</h2>
            {following.brands.length === 0 ? (
              <p className="text-muted">
                No brands yet. <Link href="/brands" className="font-semibold text-ink underline">Browse brands</Link>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {following.brands.map((b) => (
                  <Link key={b.slug} href={`/brands/${b.slug}`} className="rounded-full bg-card px-3 py-1.5 font-medium ring-1 ring-line">
                    {b.name}
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Products</h2>
            {following.products.length === 0 ? (
              <p className="text-muted">
                Nothing yet. <Link href="/products" className="font-semibold text-ink underline">Find a product</Link> and
                tap “Notify me”.
              </p>
            ) : (
              <ProductGrid products={following.products} />
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Your drops</h2>
            {feed && <FeedList items={feed.items} now={feed.at} empty="No restocks for what you follow yet." />}
          </section>
        </>
      )}
    </div>
  );
}

function AlertsCard() {
  const { push, setPushEnabled } = useFollowing();
  const [busy, setBusy] = useState(false);

  const message = {
    on: "Alerts are on for this browser.",
    off: "Turn on alerts to get a notification the second something you follow restocks.",
    denied: "Notifications are blocked. Allow them for this site in your browser settings.",
    unsupported: "This browser can't receive push alerts. Get the Pullbell app instead.",
    "needs-install": "On iPhone, tap Share → Add to Home Screen, then open Pullbell from your Home Screen to turn on alerts.",
  };

  if (push === null) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card p-4 ring-1 ring-line">
      <p className="max-w-prose">{message[push]}</p>
      {(push === "on" || push === "off") && (
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await setPushEnabled(push === "off");
            } finally {
              setBusy(false);
            }
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60 ${
            push === "on" ? "bg-line text-ink" : "bg-bell text-ink"
          }`}
        >
          {push === "on" ? "Turn off" : "Turn on alerts"}
        </button>
      )}
    </div>
  );
}
