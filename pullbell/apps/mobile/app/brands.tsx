import { CATEGORIES } from "@pullbell/db/shared";
import { Link } from "expo-router";
import { FlatList, Pressable, RefreshControl, Text } from "react-native";
import { Loading } from "@/components/ui";
import { api } from "@/lib/api";
import { useColors } from "@/lib/theme";
import { useData } from "@/lib/use-data";

export default function BrandsScreen() {
  const c = useColors();
  const brands = useData(api.brands);
  return (
    <FlatList
      data={brands.data ?? []}
      numColumns={2}
      keyExtractor={(b) => b.slug}
      style={{ backgroundColor: c.paper }}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={<RefreshControl refreshing={brands.refreshing} onRefresh={brands.refresh} />}
      renderItem={({ item }) => (
        <Link href={`/brand/${item.slug}`} asChild>
          <Pressable style={{ flex: 1, padding: 16, gap: 4, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.card }}>
            <Text style={{ color: c.pull, fontSize: 11, fontWeight: "700", textTransform: "uppercase" }}>
              {CATEGORIES.find((cat) => cat.slug === item.category)?.name}
            </Text>
            <Text style={{ color: c.ink, fontSize: 17, fontWeight: "800" }}>{item.name}</Text>
            <Text style={{ color: c.muted }}>
              {item.productCount} {item.productCount === 1 ? "product" : "products"}
            </Text>
          </Pressable>
        </Link>
      )}
      ListEmptyComponent={<Loading error={brands.error} />}
    />
  );
}
