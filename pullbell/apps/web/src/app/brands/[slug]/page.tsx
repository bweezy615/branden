import { getBrand } from "@pullbell/db";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { FeedList, ProductGrid } from "@/components/cards";
import { FollowButton } from "@/components/follow-button";

export default function BrandPage(props: PageProps<"/brands/[slug]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-line/50" />}>
      <Brand params={props.params} />
    </Suspense>
  );
}

async function Brand({ params }: { params: PageProps<"/brands/[slug]">["params"] }) {
  await connection();
  const { slug } = await params;
  const detail = await getBrand(slug);
  if (!detail) notFound();
  const { brand, products, recentEvents } = detail;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3 rounded-3xl bg-ink p-6 text-paper">
        <span className="text-sm font-semibold uppercase tracking-wide text-bell">Restock tracker</span>
        <h1 className="text-3xl font-extrabold tracking-tight">{brand.name}</h1>
        <p className="opacity-80">
          Follow {brand.name} to get an alert for every product we track from this brand, including new ones we add.
        </p>
        <div>
          <FollowButton kind="brands" slug={brand.slug} label={`Follow ${brand.name}`} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">Recent {brand.name} drops</h2>
        <FeedList items={recentEvents} now={new Date()} empty={`No ${brand.name} restocks detected yet.`} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">All {brand.name} products</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
