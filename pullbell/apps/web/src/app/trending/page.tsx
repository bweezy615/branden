import { formatPrice, getTrending } from "@pullbell/db";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ProductImage, StockBadge } from "@/components/cards";
import { CategoryChips, categoryFrom } from "@/components/category-chips";
import { FollowButton } from "@/components/follow-button";

export const metadata: Metadata = { title: "Trending" };

export default function TrendingPage(props: PageProps<"/trending">) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Trending this week</h1>
        <p className="text-muted">What collectors are following and what keeps restocking, over the last 7 days.</p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-line/50" />}>
        <Trending searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

async function Trending({ searchParams }: { searchParams: PageProps<"/trending">["searchParams"] }) {
  await connection();
  const category = categoryFrom((await searchParams).category);
  const items = await getTrending({ category });
  return (
    <>
      <CategoryChips basePath="/trending" active={category} />
      {items.length === 0 ? (
        <p className="py-10 text-center text-muted">Nothing trending yet this week.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map(({ product, newFollowers, restocks }, i) => (
            <li key={product.slug} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-line">
              <span className="w-6 shrink-0 text-center text-lg font-extrabold text-muted">{i + 1}</span>
              <Link href={`/products/${product.slug}`} className="shrink-0">
                <ProductImage src={product.imageUrl} alt={product.name} className="size-16" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-pull">{product.brand.name}</span>
                <Link href={`/products/${product.slug}`} className="line-clamp-2 font-semibold leading-snug hover:underline">
                  {product.name}
                </Link>
                <span className="flex flex-wrap items-center gap-2 text-sm text-muted">
                  {plural(newFollowers, "new follower")} · {plural(restocks, "restock")} · {formatPrice(product.msrpCents)}
                  {product.inStockAt.length > 0 && <StockBadge inStock />}
                </span>
              </div>
              <div className="hidden sm:block">
                <FollowButton kind="products" slug={product.slug} label="Notify me" />
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
