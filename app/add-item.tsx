import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { ListingForm } from "@/components/listing-form";
import { MarketplaceScreen } from "@/components/marketplace-screen";
import { useMarketplace } from "@/context/marketplace-context";
import type { ListingInput } from "@/types/marketplace";

const initialListing: ListingInput = {
  title: "",
  price: "",
  category: "School Supplies",
  condition: "Good",
  location: "",
  description: "",
  imageUrl: "",
};

export default function AddItemScreen() {
  const { addListing, authLoading, user } = useMarketplace();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/" as any);
    }
  }, [authLoading, user]);

  return (
    <MarketplaceScreen
      title="Create a new listing"
      subtitle="Post an item with clear pricing and pickup details so other students can act quickly."
      footer={
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </Pressable>
      }
    >
      <ListingForm
        initialValue={initialListing}
        onSubmit={async (value) => {
          await addListing(value);
          router.replace("/my-listings" as any);
        }}
        submitLabel="Publish listing"
        submittingLabel="Publishing..."
      />
    </MarketplaceScreen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#eef3ef",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  backButtonText: {
    color: "#24433d",
    fontWeight: "800",
  },
});
