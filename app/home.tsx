import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { ListingCard } from "@/components/listing-card";
import { MarketplaceScreen } from "@/components/marketplace-screen";
import { StatusBanner } from "@/components/status-banner";
import { useMarketplace } from "@/context/marketplace-context";
import { listingCategories, type Listing } from "@/types/marketplace";

const filters = ["All", ...listingCategories] as const;

export default function HomeScreen() {
  const { authLoading, errorMessage, listings, listingsLoading, user } =
    useMarketplace();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<(typeof filters)[number]>("All");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/" as any);
    }
  }, [authLoading, user]);

  const visibleListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesCategory =
        categoryFilter === "All" || listing.category === categoryFilter;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term.length === 0 ||
        listing.title.toLowerCase().includes(term) ||
        listing.description.toLowerCase().includes(term) ||
        listing.location.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, listings, search]);

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#183a37" />
        <Text style={styles.loadingText}>Loading marketplace...</Text>
      </View>
    );
  }

  return (
    <MarketplaceScreen
      title="Browse campus listings"
      subtitle="Discover school supplies, tech, furniture, clothes, and local deals from other students nearby."
      footer={
        <View style={styles.footerActions}>
          <Pressable
            onPress={() => router.push("/add-item" as any)}
            style={[styles.footerButton, styles.footerPrimary]}
          >
            <Text style={styles.footerPrimaryText}>Add listing</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/my-listings" as any)}
            style={[styles.footerButton, styles.footerSecondary]}
          >
            <Text style={styles.footerSecondaryText}>My listings</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/profile" as any)}
            style={[styles.footerButton, styles.footerSecondary]}
          >
            <Text style={styles.footerSecondaryText}>Profile</Text>
          </Pressable>
        </View>
      }
    >
      <View style={styles.searchCard}>
        <Text style={styles.searchTitle}>Find what you need</Text>
        <TextInput
          onChangeText={setSearch}
          placeholder="Search by keyword or location"
          placeholderTextColor="#83928c"
          style={styles.searchInput}
          value={search}
        />
        <View style={styles.filterRow}>
          {filters.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setCategoryFilter(filter)}
              style={[
                styles.filterChip,
                categoryFilter === filter ? styles.filterChipSelected : null,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  categoryFilter === filter
                    ? styles.filterChipTextSelected
                    : null,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {errorMessage ? (
        <StatusBanner message={errorMessage} tone="error" />
      ) : null}
      <View style={styles.statsRow}>
        <StatPill label="Active listings" value={String(listings.length)} />
        <StatPill label="Results" value={String(visibleListings.length)} />
      </View>
      {listingsLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#183a37" />
          <Text style={styles.emptyTitle}>Syncing listings</Text>
          <Text style={styles.emptyText}>
            Fetching the latest campus postings.
          </Text>
        </View>
      ) : visibleListings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No listings match yet</Text>
          <Text style={styles.emptyText}>
            Try a broader search, or post the first item in this category.
          </Text>
        </View>
      ) : (
        visibleListings.map((listing) => (
          <ListingPreview key={listing.id} listing={listing} />
        ))
      )}
    </MarketplaceScreen>
  );
}

function ListingPreview({ listing }: { listing: Listing }) {
  return (
    <ListingCard
      listing={listing}
      onPress={() =>
        router.push({
          pathname: "/item-details",
          params: { id: listing.id },
        } as any)
      }
    />
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f6f7f4",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#46635d",
    fontSize: 15,
    fontWeight: "600",
  },
  searchCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: "#dde4db",
  },
  searchTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1d2b28",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#cad5cc",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fbfcfa",
    color: "#162522",
    fontSize: 15,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#cad5cc",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fbfcfa",
  },
  filterChipSelected: {
    backgroundColor: "#183a37",
    borderColor: "#183a37",
  },
  filterChipText: {
    color: "#35524b",
    fontWeight: "700",
  },
  filterChipTextSelected: {
    color: "#ffffff",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statPill: {
    flex: 1,
    backgroundColor: "#fffaf0",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f2dfb8",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#6d4d11",
  },
  statLabel: {
    color: "#7e6638",
    fontWeight: "600",
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
  footerPrimary: {
    backgroundColor: "#183a37",
  },
  footerSecondary: {
    backgroundColor: "#eef3ef",
  },
  footerPrimaryText: {
    color: "#ffffff",
    fontWeight: "800",
  },
  footerSecondaryText: {
    color: "#24433d",
    fontWeight: "800",
  },
});
