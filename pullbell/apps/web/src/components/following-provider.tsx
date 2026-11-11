"use client";

import type { Following } from "@pullbell/db/shared";
import { createContext, use, useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";
import { disablePush, enablePush, pushStatus, type PushStatus } from "@/lib/push";

type Kind = "products" | "brands";

type FollowingContext = {
  following: Following | null;
  isFollowing: (kind: Kind, slug: string) => boolean;
  toggle: (kind: Kind, slug: string) => Promise<void>;
  push: PushStatus | null;
  setPushEnabled: (enabled: boolean) => Promise<void>;
};

const Context = createContext<FollowingContext | null>(null);

export function useFollowing(): FollowingContext {
  const value = use(Context);
  if (!value) throw new Error("useFollowing must be used inside <FollowingProvider>");
  return value;
}

export function FollowingProvider({ children }: { children: React.ReactNode }) {
  const [following, setFollowing] = useState<Following | null>(null);
  const [push, setPush] = useState<PushStatus | null>(null);

  useEffect(() => {
    api.following().then(setFollowing);
    pushStatus().then(setPush);
  }, []);

  const isFollowing = useCallback(
    (kind: Kind, slug: string) => (following?.[kind] ?? []).some((item) => item.slug === slug),
    [following],
  );

  const toggle = useCallback(
    async (kind: Kind, slug: string) => {
      const follow = !isFollowing(kind, slug);
      // Following is the moment alerts matter: ask for permission inside this click.
      if (follow && push === "off") setPush(await enablePush());
      await api.setFollow(kind, slug, follow);
      setFollowing(await api.following());
    },
    [isFollowing, push],
  );

  const setPushEnabled = useCallback(async (enabled: boolean) => {
    setPush(await (enabled ? enablePush() : disablePush()));
  }, []);

  return <Context value={{ following, isFollowing, toggle, push, setPushEnabled }}>{children}</Context>;
}
