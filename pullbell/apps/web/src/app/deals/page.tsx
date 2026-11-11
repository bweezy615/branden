import { formatPrice, getDeals } from "@pullbell/db";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { AutoRefresh } from "@/components/auto-refresh";
import { ProductImage } from "@/components/cards";
import { CategoryChips, categoryFrom } from "@/components/category-chips";
import { ExternalIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Deals" };

export default function DealsPage(props: PageProps<"/deals">) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Deals</h1>
        <p className="text-muted">In stock right now for less than the listed price.</p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-line/50" />}>
        <Deals searchParams={props.searchParams} />
      </Suspense>
      <AutoRefresh seconds={60} />
    </div>
  );
}

async function Deals({ searchParams }: { searchParams: PageProps<"/deals">["searchParams"] }) {
  await connection();
  const category = categoryFrom((await searchParams).category);
  const deals = await getDeals({ category });
  return (
    <>
      <CategoryChips basePath="/deals" active={category} />
      {deals.length === 0 ? (
        <p className="py-10 text-center text-muted">No deals right now. We check prices on every pass of the monitor.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {deals.map((deal) => (
            <article key={deal.url} className="flex gap-3 rounded-2xl bg-card p-3 ring-1 ring-line">
              <Link href={`/products/${deal.product.slug}`} className="relative shrink-0">
                <ProductImage src={deal.product.imageUrl} alt={deal.product.name} className="size-24" />
                <span className="absolute top-1 left-1 rounded-full bg-live px-2 py-0.5 text-xs font-bold text-white">
                  −{deal.percentOff}%
                </span>
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-pull">{deal.product.brand.name}</span>
                <Link href={`/products/${deal.product.slug}`} className="line-clamp-2 font-semibold leading-snug hover:underline">
                  {deal.product.name}
                </Link>
                <span className="text-sm">
                  <span className="font-bold text-live">{formatPrice(deal.priceCents)}</span>{" "}
                  <span className="text-muted line-through">{formatPrice(deal.product.msrpCents)}</span>
                  <span className="text-muted"> at {deal.retailer.name}</span>
                </span>
                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 self-start rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-paper hover:opacity-90"
                >
                  Buy <ExternalIcon className="size-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
