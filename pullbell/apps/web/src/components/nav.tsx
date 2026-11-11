"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { BellIcon, BoltIcon, GridIcon, SearchIcon, TagIcon, TrendIcon } from "./icons";

// Brands lives in the top nav only; on phones it is reached from Search.
const ITEMS = [
  { href: "/", label: "Drops", Icon: BoltIcon, phone: true },
  { href: "/trending", label: "Trending", Icon: TrendIcon, phone: true },
  { href: "/deals", label: "Deals", Icon: TagIcon, phone: true },
  { href: "/products", label: "Search", Icon: SearchIcon, phone: true },
  { href: "/brands", label: "Brands", Icon: GridIcon, phone: false },
  { href: "/following", label: "Following", Icon: BellIcon, phone: true },
];

function isActive(pathname: string | null, href: string) {
  if (pathname === null) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// The pathname is request data: the static shell renders the nav without a highlighted tab.
function WithPathname({ render }: { render: (pathname: string | null) => React.ReactNode }) {
  return <Suspense fallback={render(null)}><CurrentPath render={render} /></Suspense>;
}

function CurrentPath({ render }: { render: (pathname: string | null) => React.ReactNode }) {
  return render(usePathname());
}

export function TopNav() {
  return <WithPathname render={(pathname) => <TopNavLinks pathname={pathname} />} />;
}

export function BottomNav() {
  return <WithPathname render={(pathname) => <BottomNavLinks pathname={pathname} />} />;
}

function TopNavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav className="hidden gap-1 sm:flex">
      {ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            isActive(pathname, href) ? "bg-ink text-paper" : "text-muted hover:text-ink"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

function BottomNavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
      {ITEMS.filter((item) => item.phone).map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
            isActive(pathname, href) ? "text-ink" : "text-muted"
          }`}
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
