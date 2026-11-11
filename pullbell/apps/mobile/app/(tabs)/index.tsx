import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { FeedCard, Loading, Message } from "@/components/ui";
import { api } from "@/lib/api";
import { useColors } from "@/lib/theme";
import { useData } from "@/lib/use-data";

export default function DropsScreen() {
  const c = useColors();
  const [brand, setBrand] = useState<string | undefined>(undefined);
  const brands = useData(api.brands);
  const loadFeed = useCallback(() => api.feed({ brand }), [brand]);
  const feed = useData(loadFeed, { pollSeconds: 30 });
  const now = new Date();

  const chip = (label: string, slug: string | undefined) => {
    const active = slug === brand;
    return (
      <Pressable
        key={label}
        onPress={() => setBrand(slug)}
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
  };

  return (
    <FlatList
      data={feed.data ?? []}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <FeedCard item={item} now={now} />}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      refreshControl={<RefreshControl refreshing={feed.refreshing} onRefresh={feed.refresh} />}
      ListHeaderComponent={
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 6 }}>
          {chip("All", undefined)}
          {brands.data?.map((b) => chip(b.name, b.slug))}
        </ScrollView>
      }
      ListEmptyComponent={
        feed.data ? (
          <View>
            <Message>No restocks detected yet. Follow a product and we&apos;ll ring the bell when it&apos;s back.</Message>
          </View>
        ) : (
          <Loading error={feed.error} />
        )
      }
    />
  );
}
