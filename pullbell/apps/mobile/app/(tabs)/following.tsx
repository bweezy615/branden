import { Link } from "expo-router";
import { useCallback } from "react";
import { Linking, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { FeedCard, Message, ProductTile, SectionTitle } from "@/components/ui";
import { api } from "@/lib/api";
import { useFollowing } from "@/lib/following";
import { useColors } from "@/lib/theme";
import { useData } from "@/lib/use-data";

export default function FollowingScreen() {
  const c = useColors();
  const { following, push, turnOnPush } = useFollowing();
  // Reload the personal feed whenever the follow list changes.
  const loadFeed = useCallback(() => api.feed({ following: true }), [following]);
  const feed = useData(loadFeed, { pollSeconds: 30 });
  const now = new Date();

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, gap: 14 }}
      refreshControl={<RefreshControl refreshing={feed.refreshing} onRefresh={feed.refresh} />}
    >
      {push !== null && push !== "on" && (
        <View style={{ padding: 14, gap: 10, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.card }}>
          <Text style={{ color: c.ink }}>
            {push === "denied"
              ? "Notifications are off for Pullbell. Turn them on in Settings to get restock alerts."
              : "Turn on alerts to get a notification the second something you follow restocks."}
          </Text>
          <Pressable
            onPress={push === "denied" ? () => Linking.openSettings() : turnOnPush}
            style={{ alignSelf: "flex-start", backgroundColor: c.bell, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 99 }}
          >
            <Text style={{ color: "#17142a", fontWeight: "700" }}>{push === "denied" ? "Open Settings" : "Turn on alerts"}</Text>
          </Pressable>
        </View>
      )}

      <SectionTitle>Brands</SectionTitle>
      {following && following.brands.length === 0 && <Text style={{ color: c.muted }}>No brands yet.</Text>}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {following?.brands.map((b) => (
          <Link key={b.slug} href={`/brand/${b.slug}`} asChild>
            <Pressable style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, borderWidth: 1, borderColor: c.line, backgroundColor: c.card }}>
              <Text style={{ color: c.ink, fontWeight: "600" }}>{b.name}</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <SectionTitle>Products</SectionTitle>
      {following && following.products.length === 0 && (
        <Text style={{ color: c.muted }}>Nothing yet. Find a product in Search and tap “Notify me”.</Text>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {following?.products.map((p) => (
          <View key={p.slug} style={{ width: "47%" }}>
            <ProductTile product={p} />
          </View>
        ))}
      </View>

      <SectionTitle>Your drops</SectionTitle>
      {feed.data?.length === 0 && <Message>No restocks for what you follow yet.</Message>}
      {feed.data?.map((item) => (
        <FeedCard key={item.id} item={item} now={now} />
      ))}
    </ScrollView>
  );
}
