import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { FeedCard, FollowButton, Loading, Message, ProductTile, SectionTitle } from "@/components/ui";
import { api } from "@/lib/api";
import { useColors } from "@/lib/theme";
import { useData } from "@/lib/use-data";

export default function BrandScreen() {
  const c = useColors();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const load = useCallback(() => api.brand(slug), [slug]);
  const { data, error, refreshing, refresh } = useData(load);
  if (!data) return <Loading error={error} />;
  const { brand, products, recentEvents } = data;
  const now = new Date();

  return (
    <ScrollView
      style={{ backgroundColor: c.paper }}
      contentContainerStyle={{ padding: 16, gap: 14 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <Stack.Screen options={{ title: brand.name }} />
      <View style={{ backgroundColor: "#17142a", borderRadius: 20, padding: 20, gap: 10 }}>
        <Text style={{ color: "#ffc233", fontWeight: "700", textTransform: "uppercase" }}>Restock tracker</Text>
        <Text style={{ color: "#faf7f2", fontSize: 28, fontWeight: "800" }}>{brand.name}</Text>
        <Text style={{ color: "#faf7f2", opacity: 0.8 }}>
          Follow {brand.name} to get an alert for every product we track from this brand.
        </Text>
        <FollowButton kind="brands" slug={brand.slug} label={`Follow ${brand.name}`} />
      </View>

      <SectionTitle>Recent drops</SectionTitle>
      {recentEvents.length === 0 && <Message>No {brand.name} restocks detected yet.</Message>}
      {recentEvents.map((item) => (
        <FeedCard key={item.id} item={item} now={now} />
      ))}

      <SectionTitle>All products</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {products.map((p) => (
          <View key={p.slug} style={{ width: "47%" }}>
            <ProductTile product={p} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
