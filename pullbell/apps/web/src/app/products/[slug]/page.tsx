import { formatPrice, getProduct, resaleLinks } from "@pullbell/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { AutoRefresh } from "@/components/auto-refresh";
import { FeedList, ProductGrid, ProductImage, StockBadge } from "@/components/cards";
import { FollowButton } from "@/components/follow-button";
import { HistoryGrid } from "@/components/history-grid";
import { ExternalIcon } from "@/components/icons";

export default function ProductPage(props: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-line/50" />}>
      <Product params={props.params} />
      <AutoRefresh seconds={30} />
    </Suspense>
  );
}

async function Product({ params }: { params: PageProps<"/products/[slug]">["params"] }) {
  await connection();
  const { slug } = await params;
  const detail = await getProduct(slug);
  if (!detail) notFound();
  const { product, listings, recentEvents, related } = detail;

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 sm:grid-cols-[minmax(0,20rem)_1fr]">
        <ProductImage src={product.imageUrl} alt={product.name} className="mx-auto aspect-square w-full max-w-64 sm:max-w-none" />
        <div className="flex flex-col gap-3">
          <Link href={`/brands/${product.brand.slug}`} className="text-sm font-semibold uppercase tracking-wide text-pull">
            {product.brand.name}
          </Link>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{product.name}</h1>
          <p className="text-lg text-muted">Listed at {formatPrice(product.msrpCents)}</p>
          <div className="flex flex-wrap items-center gap-3">
            <FollowButton kind="products" slug={product.slug} label="Notify me" />
            <span className="text-sm text-muted">
              Alerts from {listings.length} {listings.length === 1 ? "retailer" : "retailers"}
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Where to buy</h2>
        <ul className="flex flex-col divide-y divide-line rounded-2xl bg-card ring-1 ring-line">
          {listings.map((l) => (
            <li key={l.url} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-1 flex-col">
                <span className="font-semibold">{l.retailer.name}</span>
                <span className="text-sm text-muted">{formatPrice(l.priceCents)}</span>
              </div>
              <StockBadge inStock={l.inStock} />
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-paper hover:opacity-90"
              >
                Open <ExternalIcon className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          Secondary market:{" "}
          {resaleLinks(product.name).map((r, i) => (
            <span key={r.name}>
              {i > 0 && " · "}
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline">
                {r.name}
              </a>
            </span>
          ))}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-bold">Restock history</h2>
          <p className="text-sm text-muted">
            {recentEvents.length} {recentEvents.length === 1 ? "restock" : "restocks"} detected in the last 7 days. Counts
            are restock events, not units.
          </p>
        </div>
        <HistoryGrid listings={listings} events={recentEvents} />
      </section>

      {recentEvents.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">Latest restocks</h2>
          <FeedList items={recentEvents.slice(0, 10)} now={new Date()} empty={null} />
        </section>
      )}

      {related.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">More from {product.brand.name}</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
