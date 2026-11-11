/* eslint-disable @next/next/no-img-element -- product images come from many retailer CDNs */
import { formatPrice, timeAgo, type FeedItem, type ProductCard as Card } from "@pullbell/db/shared";
import Link from "next/link";
import { BoltIcon, ExternalIcon } from "./icons";

export function ProductImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-white ring-1 ring-line ${className ?? ""}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="size-full object-contain p-2" />
      ) : (
        <div className="grid size-full place-items-center text-xs text-muted">No image</div>
      )}
    </div>
  );
}

export function StockBadge({ inStock }: { inStock: boolean | null }) {
  if (inStock === null) return <span className="rounded-full bg-line px-2 py-0.5 text-xs text-muted">Checking</span>;
  return inStock ? (
    <span className="rounded-full bg-live/15 px-2 py-0.5 text-xs font-semibold text-live">In stock</span>
  ) : (
    <span className="rounded-full bg-line px-2 py-0.5 text-xs text-muted">Sold out</span>
  );
}

export function ProductCard({ product }: { product: Card }) {
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-2">
      <ProductImage src={product.imageUrl} alt={product.name} className="aspect-square transition group-hover:ring-ink/30" />
      <div className="flex flex-col gap-0.5 px-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-pull">{product.brand.name}</span>
        <span className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</span>
        <span className="flex items-center gap-2 text-sm text-muted">
          {formatPrice(product.msrpCents)}
          {product.inStockAt.length > 0 && <StockBadge inStock />}
        </span>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Card[] }) {
  if (products.length === 0) return <p className="py-8 text-center text-muted">No products found.</p>;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}

export function FeedCard({ item, now }: { item: FeedItem; now: Date }) {
  return (
    <article className="flex gap-3 rounded-2xl bg-card p-3 ring-1 ring-line">
      <Link href={`/products/${item.product.slug}`} className="shrink-0">
        <ProductImage src={item.product.imageUrl} alt={item.product.name} className="size-20" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-bell px-2 py-0.5 font-bold text-ink">
            <BoltIcon className="size-3" /> RESTOCK
          </span>
          <span className="text-muted">{timeAgo(item.detectedAt, now)}</span>
        </div>
        <Link href={`/products/${item.product.slug}`} className="line-clamp-2 font-semibold leading-snug hover:underline">
          {item.product.name}
        </Link>
        <span className="text-sm text-muted">
          {item.brand.name} · {item.retailer.name} · {formatPrice(item.priceCents)}
        </span>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 self-center rounded-full bg-ink px-3 py-2 text-sm font-semibold text-paper hover:opacity-90"
      >
        Buy <ExternalIcon className="size-3.5" />
      </a>
    </article>
  );
}

export function FeedList({ items, now, empty }: { items: FeedItem[]; now: Date; empty: React.ReactNode }) {
  if (items.length === 0) return <div className="py-10 text-center text-muted">{empty}</div>;
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <FeedCard key={item.id} item={item} now={now} />
      ))}
    </div>
  );
}
