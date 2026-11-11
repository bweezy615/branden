"use client";

import { useState } from "react";
import { BellFilledIcon, BellIcon } from "./icons";
import { useFollowing } from "./following-provider";

export function FollowButton({ kind, slug, label }: { kind: "products" | "brands"; slug: string; label: string }) {
  const { following, isFollowing, toggle } = useFollowing();
  const [busy, setBusy] = useState(false);
  const active = isFollowing(kind, slug);

  return (
    <button
      type="button"
      disabled={following === null || busy}
      aria-pressed={active}
      onClick={async () => {
        setBusy(true);
        try {
          await toggle(kind, slug);
        } finally {
          setBusy(false);
        }
      }}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        active ? "bg-ink text-paper" : "bg-bell text-ink hover:brightness-95"
      }`}
    >
      {active ? <BellFilledIcon className="size-4" /> : <BellIcon className="size-4" />}
      {active ? "Alerts on" : label}
    </button>
  );
}
