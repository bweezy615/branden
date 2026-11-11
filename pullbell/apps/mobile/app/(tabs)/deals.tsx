import { formatPrice, type Category } from "@pullbell/db/shared";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Linking, Pressable, RefreshControl, Text, View } from "react-native";
import { CategoryChips, Loading, Message, ProductImage } from "@/components/ui";
import { api } from "@/lib/api";
import { useColors } from "@/lib/theme";
import { useData } from "@/lib/use-data";

export default function DealsScreen() {
  const c = useColors();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const load = useCallback(() => api.deals(category), [category]);
  const deals = useData(load, { pollSeconds: 60 });

  return (
    <FlatList
      data={deals.data ?? []}
      keyExtractor={(deal) => deal.url}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      refreshControl={<RefreshControl refreshing={deals.refreshing} onRefresh={deals.refresh} />}
      ListHeaderComponent={<CategoryChips value={category} onChange={setCategory} />}
      renderItem={({ item: deal }) => (
        <View style={{ flexDirection: "row", gap: 12, padding: 10, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.card }}>
          <Link href={`/product/${deal.product.slug}`} asChild>
            <Pressable>
              <ProductImage uri={deal.product.imageUrl} size={84} />
              <Text
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  backgroundColor: c.live,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: "800",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                −{deal.percentOff}%
              </Text>
            </Pressable>
          </Link>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: c.pull, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>{deal.product.brand.name}</Text>
            <Text numberOfLines={2} style={{ color: c.ink, fontWeight: "700" }}>
              {deal.product.name}
            </Text>
            <Text style={{ fontSize: 13 }}>
              <Text style={{ color: c.live, fontWeight: "800" }}>{formatPrice(deal.priceCents)} </Text>
              <Text style={{ color: c.muted, textDecorationLine: "line-through" }}>{formatPrice(deal.product.msrpCents)}</Text>
              <Text style={{ color: c.muted }}> at {deal.retailer.name}</Text>
            </Text>
            <Pressable
              onPress={() => Linking.openURL(deal.url)}
              style={{ alignSelf: "flex-start", backgroundColor: c.ink, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99 }}
            >
              <Text style={{ color: c.onInk, fontWeight: "700" }}>Buy</Text>
            </Pressable>
          </View>
        </View>
      )}
      ListEmptyComponent={deals.data ? <Message>No deals right now.</Message> : <Loading error={deals.error} />}
    />
  );
}
