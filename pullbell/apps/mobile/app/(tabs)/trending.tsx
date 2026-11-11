import { formatPrice, type Category } from "@pullbell/db/shared";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { CategoryChips, Loading, Message, ProductImage, StockBadge } from "@/components/ui";
import { api } from "@/lib/api";
import { useColors } from "@/lib/theme";
import { useData } from "@/lib/use-data";

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export default function TrendingScreen() {
  const c = useColors();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const load = useCallback(() => api.trending(category), [category]);
  const trending = useData(load);

  return (
    <FlatList
      data={trending.data ?? []}
      keyExtractor={(item) => item.product.slug}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      refreshControl={<RefreshControl refreshing={trending.refreshing} onRefresh={trending.refresh} />}
      ListHeaderComponent={<CategoryChips value={category} onChange={setCategory} />}
      renderItem={({ item: { product, newFollowers, restocks }, index }) => (
        <Link href={`/product/${product.slug}`} asChild>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.card }}
          >
            <Text style={{ width: 22, textAlign: "center", color: c.muted, fontSize: 17, fontWeight: "800" }}>{index + 1}</Text>
            <ProductImage uri={product.imageUrl} size={60} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{ color: c.pull, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>{product.brand.name}</Text>
              <Text numberOfLines={2} style={{ color: c.ink, fontWeight: "700" }}>
                {product.name}
              </Text>
              <Text style={{ color: c.muted, fontSize: 12 }}>
                {plural(newFollowers, "new follower")} · {plural(restocks, "restock")} · {formatPrice(product.msrpCents)}
              </Text>
              {product.inStockAt.length > 0 && (
                <View style={{ flexDirection: "row" }}>
                  <StockBadge inStock />
                </View>
              )}
            </View>
          </Pressable>
        </Link>
      )}
      ListEmptyComponent={trending.data ? <Message>Nothing trending yet this week.</Message> : <Loading error={trending.error} />}
    />
  );
}
