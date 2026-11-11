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
        name="search"
        options={{ title: "Search", tabBarIcon: icon({ ios: "magnifyingglass", android: "search", web: "search" }) }}
      />
      <Tabs.Screen
        name="brands"
        options={{ title: "Brands", tabBarIcon: icon({ ios: "square.grid.2x2", android: "grid_view", web: "grid_view" }) }}
      />
      <Tabs.Screen
        name="following"
        options={{ title: "Following", tabBarIcon: icon({ ios: "bell", android: "notifications", web: "notifications" }) }}
      />
    </Tabs>
  );
}
