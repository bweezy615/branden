import { useCallback, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { Chip, FeedCard, Loading, Message } from "@/components/ui";
import { api } from "@/lib/api";
import { useData } from "@/lib/use-data";

export default function DropsScreen() {
  const [brand, setBrand] = useState<string | undefined>(undefined);
  const brands = useData(api.brands);
  const loadFeed = useCallback(() => api.feed({ brand }), [brand]);
  const feed = useData(loadFeed, { pollSeconds: 30 });
  const now = new Date();

  const chip = (label: string, slug: string | undefined) => (
    <Chip key={label} label={label} active={slug === brand} onPress={() => setBrand(slug)} />
  );

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
