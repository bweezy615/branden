import { formatPrice, resaleLinks } from "@pullbell/db/shared";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Linking, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import {
  FeedCard,
  FollowButton,
  HistoryGrid,
  Loading,
  ProductImage,
  ProductTile,
  SectionTitle,
  StockBadge,
} from "@/components/ui";
import { api } from "@/lib/api";
import { useColors } from "@/lib/theme";
import { useData } from "@/lib/use-data";

export default function ProductScreen() {
  const c = useColors();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const load = useCallback(() => api.product(slug), [slug]);
  const { data, error, refreshing, refresh } = useData(load, { pollSeconds: 30 });
  if (!data) return <Loading error={error} />;
  const { product, listings, recentEvents, related } = data;
  const now = new Date();

  return (
    <ScrollView
      style={{ backgroundColor: c.paper }}
      contentContainerStyle={{ padding: 16, gap: 14 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <Stack.Screen options={{ title: product.brand.name }} />
      <View style={{ alignItems: "center" }}>
        <ProductImage uri={product.imageUrl} size={240} />
      </View>
      <Link href={`/brand/${product.brand.slug}`}>
        <Text style={{ color: c.pull, fontWeight: "700", textTransform: "uppercase" }}>{product.brand.name}</Text>
      </Link>
      <Text style={{ color: c.ink, fontSize: 24, fontWeight: "800" }}>{product.name}</Text>
      <Text style={{ color: c.muted, fontSize: 16 }}>Listed at {formatPrice(product.msrpCents)}</Text>
      <FollowButton kind="products" slug={product.slug} label="Notify me" />

      <SectionTitle>Where to buy</SectionTitle>
      <View style={{ borderWidth: 1, borderColor: c.line, borderRadius: 16, backgroundColor: c.card }}>
        {listings.map((l, i) => (
          <View
            key={l.url}
            style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderTopWidth: i ? 1 : 0, borderColor: c.line }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.ink, fontWeight: "700" }}>{l.retailer.name}</Text>
              <Text style={{ color: c.muted }}>{formatPrice(l.priceCents)}</Text>
            </View>
            <StockBadge inStock={l.inStock} />
            <Pressable onPress={() => Linking.openURL(l.url)} style={{ backgroundColor: c.ink, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99 }}>
              <Text style={{ color: c.onInk, fontWeight: "700" }}>Open</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Text style={{ color: c.muted }}>
        Secondary market:{" "}
        {resaleLinks(product.name).map((r, i) => (
          <Text key={r.name} onPress={() => Linking.openURL(r.url)} style={{ color: c.ink, textDecorationLine: "underline" }}>
            {i > 0 ? " · " : ""}
            {r.name}
          </Text>
        ))}
      </Text>

      <SectionTitle>Restock history</SectionTitle>
      <Text style={{ color: c.muted }}>
        {recentEvents.length} {recentEvents.length === 1 ? "restock" : "restocks"} in the last 7 days.
      </Text>
      <HistoryGrid listings={listings} events={recentEvents} />

      {recentEvents.length > 0 && <SectionTitle>Latest restocks</SectionTitle>}
      {recentEvents.slice(0, 10).map((item) => (
        <FeedCard key={item.id} item={item} now={now} />
      ))}

      {related.length > 0 && <SectionTitle>More from {product.brand.name}</SectionTitle>}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {related.map((p) => (
          <View key={p.slug} style={{ width: "47%" }}>
            <ProductTile product={p} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
