import { listBrands } from "@pullbell/db";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Brands" };

export default function BrandsPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold tracking-tight">Brands we track</h1>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-line/50" />}>
        <Brands />
      </Suspense>
    </div>
  );
}

async function Brands() {
  await connection();
  const brands = await listBrands();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {brands.map((b) => (
        <Link
          key={b.slug}
          href={`/brands/${b.slug}`}
          className="flex flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-line transition hover:ring-ink/40"
        >
          <span className="text-lg font-bold">{b.name}</span>
          <span className="text-sm text-muted">
            {b.productCount} {b.productCount === 1 ? "product" : "products"}
          </span>
        </Link>
      ))}
    </div>
  );
}
