import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { Listing } from "@/types/marketplace";

type ListingCardProps = {
  listing: Listing;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showOwnerActions?: boolean;
};

export function ListingCard({
  listing,
  onDelete,
  onEdit,
  onPress,
  showOwnerActions = false,
}: ListingCardProps) {
  const hasImage = !!listing.imageUrl;
  const content = (
    <>
      {hasImage ? (
        <Image source={{ uri: listing.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No image provided</Text>
        </View>
      )}
      <View style={styles.topRow}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${listing.price}</Text>
        </View>
        <Text style={styles.category}>{listing.category}</Text>
      </View>
      <Text style={styles.title}>{listing.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {listing.description}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{listing.condition}</Text>
        <Text style={styles.meta}>{listing.location}</Text>
      </View>
      <Text style={styles.seller}>
        Listed by {listing.sellerName || listing.sellerEmail}
      </Text>
    </>
  );

  return (
    <View style={styles.card}>
      {onPress ? (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.contentPressable,
            pressed ? styles.cardPressed : null,
          ]}
        >
          {content}
        </Pressable>
      ) : (
        content
      )}
      {showOwnerActions ? (
        <View style={styles.actions}>
          <Pressable
            onPress={onEdit}
            style={[styles.actionButton, styles.editButton]}
          >
            <Text style={[styles.actionText, styles.editText]}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#dde4db",
  },
  contentPressable: {
    gap: 10,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceBadge: {
    backgroundColor: "#183a37",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  category: {
    color: "#57766f",
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d2b28",
  },
  description: {
    color: "#4f5f59",
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  meta: {
    color: "#46635d",
    backgroundColor: "#edf2ee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontWeight: "600",
  },
  seller: {
    color: "#697872",
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionText: {
    fontWeight: "700",
  },
  editButton: {
    backgroundColor: "#eef5f2",
  },
  deleteButton: {
    backgroundColor: "#fff0f0",
  },
  editText: {
    color: "#1c5446",
  },
  deleteText: {
    color: "#a22739",
  },
});
