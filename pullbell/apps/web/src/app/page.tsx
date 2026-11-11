import { getFeed, listBrands } from "@pullbell/db";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { AutoRefresh } from "@/components/auto-refresh";
import { FeedList } from "@/components/cards";

export default function DropsPage(props: PageProps<"/">) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Live drops</h1>
        <p className="text-muted">Every restock we detect, the moment it happens.</p>
      </div>
      <Suspense fallback={<FeedSkeleton />}>
        <Feed searchParams={props.searchParams} />
      </Suspense>
      <AutoRefresh seconds={30} />
    </div>
  );
}

async function Feed({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  await connection();
  const { brand } = await searchParams;
  const brandSlug = typeof brand === "string" ? brand : undefined;
  const [brands, items] = await Promise.all([listBrands(), getFeed({ brandSlug, limit: 50 })]);
  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ${
      active ? "bg-ink text-paper ring-ink" : "bg-card ring-line hover:ring-ink/40"
    }`;
  return (
    <>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link href="/" className={chip(!brandSlug)}>
          All
        </Link>
        {brands.map((b) => (
          <Link key={b.slug} href={`/?brand=${b.slug}`} className={chip(b.slug === brandSlug)}>
            {b.name}
          </Link>
        ))}
      </div>
      <FeedList
        items={items}
        now={new Date()}
        empty={
          <>
            No restocks detected yet. The monitor checks every listing around the clock;{" "}
            <Link href="/products" className="font-semibold text-ink underline">
              follow a product
            </Link>{" "}
            to get the alert.
          </>
        }
      />
    </>
  );
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-26 animate-pulse rounded-2xl bg-line/50" />
      ))}
    </div>
  );
}
