import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MarketplaceProvider } from "@/context/marketplace-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MarketplaceProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#183a37",
            },
            headerTintColor: "#ffffff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            contentStyle: {
              backgroundColor: "#f6f7f4",
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{ title: "Login", headerShown: false }}
          />
          <Stack.Screen
            name="signup"
            options={{ title: "Create account", headerShown: false }}
          />
          <Stack.Screen
            name="home"
            options={{ title: "Marketplace", headerBackVisible: false }}
          />
          <Stack.Screen
            name="item-details"
            options={{ title: "Item Details" }}
          />
          <Stack.Screen name="add-item" options={{ title: "Add Listing" }} />
          <Stack.Screen name="my-listings" options={{ title: "My Listings" }} />
          <Stack.Screen name="edit-item" options={{ title: "Edit Listing" }} />
          <Stack.Screen name="profile" options={{ title: "Profile" }} />
        </Stack>
      </MarketplaceProvider>
    </SafeAreaProvider>
  );
}
