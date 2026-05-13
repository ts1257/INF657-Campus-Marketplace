import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { ListingForm } from "@/components/listing-form";
import { MarketplaceScreen } from "@/components/marketplace-screen";
import { StatusBanner } from "@/components/status-banner";
import { useMarketplace } from "@/context/marketplace-context";

export default function EditItemScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { authLoading, getListingById, updateListing, user } = useMarketplace();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/" as any);
    }
  }, [authLoading, user]);

  const listing = params.id ? getListingById(params.id) : undefined;

  const blocked =
    !listing || !user || listing.ownerId !== user.uid
      ? "You can only edit one of your own active listings."
      : null;

  return (
    <MarketplaceScreen
      title="Update your listing"
      subtitle="Refresh the item details, price, or pickup instructions to keep the post accurate."
      footer={
        <Pressable
          onPress={() => router.replace("/my-listings" as any)}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back to my listings</Text>
        </Pressable>
      }
    >
      {blocked || !listing ? (
        <StatusBanner message={blocked || "Listing not found."} tone="error" />
      ) : (
        <ListingForm
          initialValue={{
            title: listing.title,
            price: listing.price,
            category: listing.category,
            condition: listing.condition,
            location: listing.location,
            description: listing.description,
            imageUrl: listing.imageUrl || "",
          }}
          onSubmit={async (value) => {
            await updateListing(listing.id, value);
            router.replace({
              pathname: "/item-details",
              params: { id: listing.id },
            } as any);
          }}
          submitLabel="Save changes"
          submittingLabel="Saving..."
        />
      )}
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
