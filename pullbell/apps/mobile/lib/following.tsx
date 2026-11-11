import type { Following } from "@pullbell/db/shared";
import { createContext, use, useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { enablePush, pushStatus, type PushStatus } from "./push";

type Kind = "products" | "brands";

type FollowingContext = {
  following: Following | null;
  isFollowing: (kind: Kind, slug: string) => boolean;
  toggle: (kind: Kind, slug: string) => Promise<void>;
  push: PushStatus | null;
  turnOnPush: () => Promise<void>;
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
    // Re-register the token on every launch: Expo tokens can rotate.
    pushStatus().then((status) => (status === "on" ? enablePush() : status)).then(setPush);
  }, []);

  const isFollowing = useCallback(
    (kind: Kind, slug: string) => (following?.[kind] ?? []).some((item) => item.slug === slug),
    [following],
  );

  const toggle = useCallback(
    async (kind: Kind, slug: string) => {
      const follow = !isFollowing(kind, slug);
      if (follow && push === "off") setPush(await enablePush());
      await api.setFollow(kind, slug, follow);
      setFollowing(await api.following());
    },
    [isFollowing, push],
  );

  const turnOnPush = useCallback(async () => setPush(await enablePush()), []);

  return <Context value={{ following, isFollowing, toggle, push, turnOnPush }}>{children}</Context>;
}
