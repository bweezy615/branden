import { listProducts } from "@pullbell/db";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ProductGrid } from "@/components/cards";
import { SearchIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage(props: PageProps<"/products">) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold tracking-tight">Find something to track</h1>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-line/50" />}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/products">["searchParams"] }) {
  await connection();
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const products = await listProducts({ query: query || undefined, sort: "newest" });
  return (
    <>
      <form action="/products" className="flex items-center gap-2 rounded-full bg-card px-4 py-2.5 ring-1 ring-line focus-within:ring-ink/50">
        <SearchIcon className="size-5 text-muted" />
        <input
          name="q"
          defaultValue={query}
          placeholder="Pokémon ETB, NeeDoh, Labubu…"
          className="w-full bg-transparent outline-none placeholder:text-muted"
        />
      </form>
      <h2 className="text-sm font-semibold text-muted">{query ? `Results for “${query}”` : "Newly added"}</h2>
      <ProductGrid products={products} />
    </>
  );
}
