import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MainNavigator from "./navigation/MainNavigator";

// Define a custom theme
const theme = extendTheme({
  colors: {
    primary: {
      50: "#E3F2F9",
      100: "#C5E4F3",
      200: "#A2D4EC",
      300: "#7AC1E4",
      400: "#47A9DA",
      500: "#0088CC", // Main theme color
      600: "#007AB8",
      700: "#006BA1",
      800: "#005885",
      900: "#003F5E",
    },
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
});

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaProvider>
        <MainNavigator />
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
