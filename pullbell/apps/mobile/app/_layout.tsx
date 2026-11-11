import * as Notifications from "expo-notifications";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useEffect } from "react";
import { Linking, useColorScheme } from "react-native";
import "react-native-reanimated";
import { FollowingProvider } from "@/lib/following";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = { anchor: "(tabs)" };

// Tapping a restock alert goes straight to the retailer's product page.
function useOpenAlertLinks() {
  const lastResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    const url = lastResponse?.notification.request.content.data?.url;
    if (typeof url === "string") Linking.openURL(url);
  }, [lastResponse]);
}

export default function RootLayout() {
  const scheme = useColorScheme();
  useOpenAlertLinks();
  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <FollowingProvider>
        <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[slug]" options={{ title: "" }} />
          <Stack.Screen name="brand/[slug]" options={{ title: "" }} />
        </Stack>
      </FollowingProvider>
    </ThemeProvider>
  );
}
