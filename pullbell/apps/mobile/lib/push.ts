// Native push alerts through the Expo push service.
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { api } from "./api";

export type PushStatus = "on" | "off" | "denied";

// Show alerts as banners even while the app is open: a restock is always urgent.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function projectId(): string {
  const id = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!id) throw new Error("No EAS projectId: run `npx eas-cli@latest init` in apps/mobile");
  return id;
}

export async function pushStatus(): Promise<PushStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted" ? "on" : status === "denied" ? "denied" : "off";
}

// Asks for permission (if needed), gets this phone's Expo push token and registers it.
export async function enablePush(): Promise<PushStatus> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("restocks", {
      name: "Restock alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return status === "denied" ? "denied" : "off";
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId: projectId() });
  await api.savePushToken(token);
  return "on";
}
