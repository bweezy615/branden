import { CATEGORIES, isCategory, type Category } from "@pullbell/db/shared";
import Link from "next/link";

// Reads ?category= from page search params; anything unknown means "all".
export function categoryFrom(value: string | string[] | undefined): Category | undefined {
  return isCategory(value) ? value : undefined;
}

export function chipClass(active: boolean): string {
  return `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ${
    active ? "bg-ink text-paper ring-ink" : "bg-card ring-line hover:ring-ink/40"
  }`;
}

export function CategoryChips({ basePath, active }: { basePath: string; active: Category | undefined }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <Link href={basePath} className={chipClass(!active)}>
        All
      </Link>
      {CATEGORIES.map((c) => (
        <Link key={c.slug} href={`${basePath}?category=${c.slug}`} className={chipClass(c.slug === active)}>
          {c.name}
        </Link>
      ))}
    </div>
  );
}
