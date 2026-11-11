import { Tabs } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ColorValue } from "react-native";
import { useColors } from "@/lib/theme";

function icon(name: SymbolViewProps["name"]) {
  return function TabIcon({ color }: { color: ColorValue }) {
    return <SymbolView name={name} tintColor={color} size={24} />;
  };
}

export default function TabLayout() {
  const c = useColors();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.ink,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: c.paper, borderTopColor: c.line },
        headerStyle: { backgroundColor: c.paper },
        headerTitleStyle: { color: c.ink, fontWeight: "800" },
        sceneStyle: { backgroundColor: c.paper },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Live drops", tabBarLabel: "Drops", tabBarIcon: icon({ ios: "bolt.fill", android: "bolt", web: "bolt" }) }}
      />
      <Tabs.Screen
        name="trending"
        options={{
          title: "Trending this week",
          tabBarLabel: "Trending",
          tabBarIcon: icon({ ios: "chart.line.uptrend.xyaxis", android: "trending_up", web: "trending_up" }),
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{ title: "Deals", tabBarIcon: icon({ ios: "tag", android: "sell", web: "sell" }) }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Search", tabBarIcon: icon({ ios: "magnifyingglass", android: "search", web: "search" }) }}
      />

      <Tabs.Screen
        name="following"
        options={{ title: "Following", tabBarIcon: icon({ ios: "bell", android: "notifications", web: "notifications" }) }}
      />
    </Tabs>
  );
}
