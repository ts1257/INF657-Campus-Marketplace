import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { MarketplaceScreen } from "@/components/marketplace-screen";
import { StatusBanner } from "@/components/status-banner";
import { useMarketplace } from "@/context/marketplace-context";

export default function ItemDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { authLoading, getListingById, user } = useMarketplace();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/" as any);
    }
  }, [authLoading, user]);

  const listing = params.id ? getListingById(params.id) : undefined;
  const isOwner = !!listing && !!user && listing.ownerId === user.uid;

  return (
    <MarketplaceScreen
      title="Listing details"
      subtitle="Review the seller details, pickup spot, and condition before you reach out."
      footer={
        <View style={styles.footerActions}>
          <Pressable
            onPress={() => router.push("/home" as any)}
            style={[styles.footerButton, styles.secondaryButton]}
          >
            <Text style={styles.secondaryButtonText}>Back to browse</Text>
          </Pressable>
          {isOwner ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/edit-item",
                  params: { id: listing.id },
                } as any)
              }
              style={[styles.footerButton, styles.primaryButton]}
            >
              <Text style={styles.primaryButtonText}>Edit listing</Text>
            </Pressable>
          ) : null}
        </View>
      }
    >
      {!listing ? (
        <StatusBanner
          message="This listing could not be found. It may have been removed or the link is incomplete."
          tone="error"
        />
      ) : (
        <>
          {listing.imageUrl ? (
            <Image source={{ uri: listing.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>No image available</Text>
            </View>
          )}
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>${listing.price}</Text>
            <Text style={styles.priceMeta}>
              {listing.category} • {listing.condition}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.itemName}>{listing.title}</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pickup and seller</Text>
            <DetailRow label="Location" value={listing.location} />
            <DetailRow
              label="Seller"
              value={listing.sellerName || listing.sellerEmail}
            />
            <DetailRow label="Email" value={listing.sellerEmail} />
            <DetailRow
              label="Last updated"
              value={new Date(listing.updatedAt).toLocaleString()}
            />
          </View>
          <StatusBanner
            message={
              isOwner
                ? "This is your listing. Use edit to update details or pricing."
                : "Reach out to the seller using the listed email to arrange pickup."
            }
            tone={isOwner ? "info" : "success"}
          />
        </>
      )}
    </MarketplaceScreen>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  priceCard: {
    backgroundColor: "#183a37",
    borderRadius: 24,
    padding: 22,
    gap: 8,
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 24,
    backgroundColor: "#edf2ee",
  },
  placeholderImage: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d5ddd8",
  },
  placeholderText: {
    color: "#6f8079",
    fontWeight: "700",
  },
  priceLabel: {
    color: "#d7efe0",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: "700",
  },
  priceValue: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: "800",
  },
  priceMeta: {
    color: "#d6e7df",
    fontSize: 15,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "#dde4db",
  },
  itemName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1d2b28",
  },
  description: {
    color: "#536760",
    lineHeight: 22,
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d2b28",
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    color: "#677770",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  detailValue: {
    color: "#20312d",
    fontSize: 16,
  },
  footerActions: {
    flexDirection: "row",
    gap: 10,
  },
  footerButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#183a37",
  },
  secondaryButton: {
    backgroundColor: "#eef3ef",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  secondaryButtonText: {
    color: "#24433d",
    fontWeight: "800",
  },
});
