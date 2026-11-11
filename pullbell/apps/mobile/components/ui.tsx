import {
  CATEGORIES,
  formatPrice,
  restockHistory,
  timeAgo,
  type Category,
  type FeedItem,
  type Listing,
  type ProductCard as Card,
} from "@pullbell/db/shared";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFollowing } from "@/lib/following";
import { useColors } from "@/lib/theme";

export function ProductImage({ uri, size }: { uri: string | null; size: number | "100%" }) {
  const c = useColors();
  return (
    <View style={[styles.imageBox, { width: size, aspectRatio: 1, backgroundColor: "#fff", borderColor: c.line }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} contentFit="contain" transition={150} />
      ) : (
        <Text style={{ color: c.muted, fontSize: 12 }}>No image</Text>
      )}
    </View>
  );
}

export function StockBadge({ inStock }: { inStock: boolean | null }) {
  const c = useColors();
  const label = inStock === null ? "Checking" : inStock ? "In stock" : "Sold out";
  return (
    <Text
      style={[
        styles.badge,
        inStock ? { backgroundColor: c.live + "26", color: c.live, fontWeight: "700" } : { backgroundColor: c.line, color: c.muted },
      ]}
    >
      {label}
    </Text>
  );
}

export function FeedCard({ item, now }: { item: FeedItem; now: Date }) {
  const c = useColors();
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.line }]}>
      <Link href={`/product/${item.product.slug}`} asChild>
        <Pressable style={{ flexDirection: "row", gap: 12, flex: 1 }}>
          <ProductImage uri={item.product.imageUrl} size={72} />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={[styles.restock, { backgroundColor: c.bell }]}>⚡ RESTOCK</Text>
              <Text style={{ color: c.muted, fontSize: 12 }}>{timeAgo(item.detectedAt, now)}</Text>
            </View>
            <Text numberOfLines={2} style={[styles.title, { color: c.ink }]}>
              {item.product.name}
            </Text>
            <Text style={{ color: c.muted, fontSize: 13 }}>
              {item.brand.name} · {item.retailer.name} · {formatPrice(item.priceCents)}
            </Text>
          </View>
        </Pressable>
      </Link>
      <Pressable onPress={() => Linking.openURL(item.url)} style={[styles.buy, { backgroundColor: c.ink }]}>
        <Text style={{ color: c.onInk, fontWeight: "700" }}>Buy</Text>
      </Pressable>
    </View>
  );
}

export function ProductTile({ product }: { product: Card }) {
  const c = useColors();
  return (
    <Link href={`/product/${product.slug}`} asChild>
      <Pressable style={{ flex: 1, gap: 6 }}>
        <ProductImage uri={product.imageUrl} size="100%" />
        <Text style={{ color: c.pull, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>{product.brand.name}</Text>
        <Text numberOfLines={2} style={{ color: c.ink, fontSize: 14, fontWeight: "500" }}>
          {product.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ color: c.muted, fontSize: 13 }}>{formatPrice(product.msrpCents)}</Text>
          {product.inStockAt.length > 0 && <StockBadge inStock />}
        </View>
      </Pressable>
    </Link>
  );
}

export function FollowButton({ kind, slug, label }: { kind: "products" | "brands"; slug: string; label: string }) {
  const c = useColors();
  const { following, isFollowing, toggle } = useFollowing();
  const [busy, setBusy] = useState(false);
  const active = isFollowing(kind, slug);
  return (
    <Pressable
      disabled={following === null || busy}
      onPress={async () => {
        setBusy(true);
        try {
          await toggle(kind, slug);
        } finally {
          setBusy(false);
        }
      }}
      style={[styles.follow, { backgroundColor: active ? c.ink : c.bell, opacity: busy ? 0.6 : 1 }]}
    >
      <SymbolView
        name={{ ios: active ? "bell.fill" : "bell", android: "notifications", web: "notifications" }}
        tintColor={active ? c.onInk : "#17142a"}
        size={16}
      />
      <Text style={{ color: active ? c.onInk : "#17142a", fontWeight: "700" }}>{active ? "Alerts on" : label}</Text>
    </Pressable>
  );
}

export function HistoryGrid({ listings, events }: { listings: Listing[]; events: FeedItem[] }) {
  const c = useColors();
  const now = new Date();
  const grid = restockHistory(listings, events, now);
  return (
    <View style={[styles.table, { borderColor: c.line, backgroundColor: c.card }]}>
      <View style={styles.row}>
        <Text style={[styles.cellName, { color: c.muted }]}>Retailer</Text>
        {grid.days.map((d) => (
          <Text key={d} style={[styles.cell, { color: c.muted, fontSize: 10 }]}>
            {d === "Today" ? "Now" : d.slice(0, 2)}
          </Text>
        ))}
      </View>
      {grid.rows.map((row) => (
        <View key={row.retailer.slug} style={[styles.row, { borderTopWidth: 1, borderColor: c.line }]}>
          <Text numberOfLines={1} style={[styles.cellName, { color: c.ink, fontWeight: "600" }]}>
            {row.retailer.name}
          </Text>
          {row.counts.map((n, i) => (
            <Text key={i} style={[styles.cell, n > 0 ? { color: "#17142a", backgroundColor: c.bell, fontWeight: "700" } : { color: c.muted }]}>
              {n > 0 ? n : "–"}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: active ? c.ink : c.line,
        backgroundColor: active ? c.ink : c.card,
      }}
    >
      <Text style={{ color: active ? c.onInk : c.ink, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}

export function CategoryChips({ value, onChange }: { value: Category | undefined; onChange: (c: Category | undefined) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 6 }}>
      <Chip label="All" active={value === undefined} onPress={() => onChange(undefined)} />
      {CATEGORIES.map((cat) => (
        <Chip key={cat.slug} label={cat.name} active={value === cat.slug} onPress={() => onChange(cat.slug)} />
      ))}
    </ScrollView>
  );
}

export function Message({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text style={{ color: c.muted, textAlign: "center", padding: 32 }}>{children}</Text>;
}

export function Loading({ error }: { error: Error | null }) {
  return error ? <Message>Couldn&apos;t load: {error.message}</Message> : <ActivityIndicator style={{ padding: 32 }} />;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text style={{ color: c.ink, fontSize: 18, fontWeight: "800", marginTop: 8 }}>{children}</Text>;
}

const styles = StyleSheet.create({
  imageBox: { borderRadius: 14, borderWidth: 1, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  badge: { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, fontSize: 11, overflow: "hidden" },
  card: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 16, borderWidth: 1 },
  restock: { color: "#17142a", fontSize: 11, fontWeight: "800", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99, overflow: "hidden" },
  title: { fontSize: 15, fontWeight: "700" },
  buy: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99 },
  follow: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99 },
  table: { borderWidth: 1, borderRadius: 14, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8 },
  cellName: { flex: 1, fontSize: 13 },
  cell: { width: 26, textAlign: "center", fontSize: 12, borderRadius: 13, overflow: "hidden", marginHorizontal: 1, paddingVertical: 3 },
});
