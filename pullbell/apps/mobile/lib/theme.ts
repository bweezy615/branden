import { useColorScheme } from "react-native";

// Pullbell palette, matching the web app.
const light = {
  paper: "#faf7f2",
  card: "#ffffff",
  ink: "#17142a",
  onInk: "#faf7f2",
  muted: "#6e6a7c",
  line: "#e8e3da",
  bell: "#ffc233",
  pull: "#6b4cf6",
  live: "#11a36a",
};

const dark: typeof light = {
  paper: "#110f1c",
  card: "#1b1829",
  ink: "#f5f2ea",
  onInk: "#110f1c",
  muted: "#9d98ad",
  line: "#2c2840",
  bell: "#ffc233",
  pull: "#a48dff",
  live: "#3ccf91",
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === "dark" ? dark : light;
}
