import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { ListingCard } from "@/components/listing-card";
import { MarketplaceScreen } from "@/components/marketplace-screen";
import { StatusBanner } from "@/components/status-banner";
import { useMarketplace } from "@/context/marketplace-context";

export default function MyListingsScreen() {
  const { authLoading, deleteListing, errorMessage, myListings, user } =
    useMarketplace();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/" as any);
    }
  }, [authLoading, user]);

  const requestDelete = (id: string) => {
    setLocalError(null);
    setPendingDeleteId(id);
  };

  const cancelDelete = () => {
    if (deletingId) {
      return;
    }

    setPendingDeleteId(null);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    setLocalError(null);
    setDeletingId(pendingDeleteId);

    try {
      await deleteListing(pendingDeleteId);
      setPendingDeleteId(null);
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "Unable to delete this listing right now.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MarketplaceScreen
      title="Manage your listings"
      subtitle="Review what you have for sale, update old posts, or remove items that are no longer available."
      footer={
        <View style={styles.footerActions}>
          <Pressable
            onPress={() => router.push("/add-item" as any)}
            style={[styles.footerButton, styles.primaryButton]}
          >
            <Text style={styles.primaryButtonText}>New listing</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/home" as any)}
            style={[styles.footerButton, styles.secondaryButton]}
          >
            <Text style={styles.secondaryButtonText}>Back to browse</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{myListings.length}</Text>
        <Text style={styles.summaryLabel}>Active posts</Text>
      </View>
      <Modal
        animationType="fade"
        onRequestClose={cancelDelete}
        transparent
        visible={!!pendingDeleteId}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalDismissArea} onPress={cancelDelete} />
          <View style={styles.modalCard}>
            <Text style={styles.confirmTitle}>Delete this listing?</Text>
            <Text style={styles.confirmText}>
              This action removes the item from the marketplace. Please confirm
              before continuing.
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                disabled={!!deletingId}
                onPress={cancelDelete}
                style={[styles.confirmButton, styles.confirmSecondary]}
              >
                <Text style={styles.confirmSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                disabled={!!deletingId}
                onPress={() => {
                  void confirmDelete();
                }}
                style={[styles.confirmButton, styles.confirmDelete]}
              >
                <Text style={styles.confirmDeleteText}>
                  {deletingId ? "Deleting..." : "Confirm delete"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {localError ? <StatusBanner message={localError} tone="error" /> : null}
      {errorMessage ? (
        <StatusBanner message={errorMessage} tone="error" />
      ) : null}
      {myListings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No listings yet</Text>
          <Text style={styles.emptyText}>
            Publish your first item to start selling across campus.
          </Text>
        </View>
      ) : (
        myListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onDelete={() => requestDelete(listing.id)}
            onEdit={() =>
              router.push({
                pathname: "/edit-item",
                params: { id: listing.id },
              } as any)
            }
            onPress={() =>
              router.push({
                pathname: "/item-details",
                params: { id: listing.id },
              } as any)
            }
            showOwnerActions
          />
        ))
      )}
    </MarketplaceScreen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#fffaf0",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f2dfb8",
    alignItems: "center",
    gap: 4,
  },
  summaryValue: {
    color: "#6d4d11",
    fontSize: 34,
    fontWeight: "800",
  },
  summaryLabel: {
    color: "#7e6638",
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(20, 24, 23, 0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalDismissArea: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: "#fff4f2",
    borderRadius: 22,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#f1c7cb",
    elevation: 6,
  },
  confirmTitle: {
    color: "#7c1f2f",
    fontSize: 20,
    fontWeight: "800",
  },
  confirmText: {
    color: "#6f4a51",
    lineHeight: 21,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  confirmSecondary: {
    backgroundColor: "#ffffff",
  },
  confirmDelete: {
    backgroundColor: "#8a2431",
  },
  confirmSecondaryText: {
    color: "#24433d",
    fontWeight: "800",
  },
  confirmDeleteText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dde4db",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1d2b28",
  },
  emptyText: {
    color: "#5d6f69",
    lineHeight: 21,
    textAlign: "center",
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
