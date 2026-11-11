import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { FollowingProvider } from "@/components/following-provider";
import { BellFilledIcon } from "@/components/icons";
import { BottomNav, TopNav } from "@/components/nav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Pullbell · Restock alerts", template: "%s · Pullbell" },
  description: "Instant restock alerts for Pokémon TCG, NeeDoh, Pop Mart and more. Follow a drop, hear the bell.",
  appleWebApp: { capable: true, title: "Pullbell", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#110f1c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <FollowingProvider>
          <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
                <span className="grid size-8 place-items-center rounded-xl bg-bell text-ink">
                  <BellFilledIcon className="size-5" />
                </span>
                Pullbell
              </Link>
              <TopNav />
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 sm:pb-12">{children}</main>
          <BottomNav />
        </FollowingProvider>
      </body>
    </html>
  );
}
