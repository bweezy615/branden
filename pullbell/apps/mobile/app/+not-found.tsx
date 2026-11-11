import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { useColors } from "@/lib/theme";

export default function NotFoundScreen() {
  const c = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: c.paper }}>
      <Stack.Screen options={{ title: "Not found" }} />
      <Text style={{ color: c.ink, fontSize: 18, fontWeight: "700" }}>This page doesn&apos;t exist.</Text>
      <Link href="/">
        <Text style={{ color: c.pull, fontWeight: "600" }}>Back to live drops</Text>
      </Link>
    </View>
  );
}
