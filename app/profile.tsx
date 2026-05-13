import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { MarketplaceScreen } from "@/components/marketplace-screen";
import { StatusBanner } from "@/components/status-banner";
import { useMarketplace } from "@/context/marketplace-context";

export default function ProfileScreen() {
  const { authLoading, myListings, signOut, user } = useMarketplace();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/" as any);
    }
  }, [authLoading, user]);

  const uniqueCategories = new Set(
    myListings.map((listing) => listing.category),
  ).size;

  return (
    <MarketplaceScreen
      title="Your profile"
      subtitle="Keep an eye on your account, posting activity, and seller identity."
      footer={
        <Pressable
          onPress={async () => {
            await signOut();
            router.replace("/" as any);
          }}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Sign out</Text>
        </Pressable>
      }
    >
      <View style={styles.heroCard}>
        <Text style={styles.name}>{user?.displayName || "Campus Seller"}</Text>
        <Text style={styles.email}>{user?.email || "No email available"}</Text>
      </View>
      <View style={styles.metricsRow}>
        <MetricCard label="Active listings" value={String(myListings.length)} />
        <MetricCard label="Categories used" value={String(uniqueCategories)} />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account overview</Text>
        <DetailRow
          label="Display name"
          value={user?.displayName || "Campus Seller"}
        />
        <DetailRow label="Email" value={user?.email || "Unknown"} />
        <DetailRow label="Member status" value="Verified Firebase account" />
      </View>
      <StatusBanner
        message="Use My Listings to keep sold items updated or remove anything no longer available."
        tone="info"
      />
      <View style={styles.actionsCard}>
        <Pressable
          onPress={() => router.push("/my-listings" as any)}
          style={[styles.actionButton, styles.primaryButton]}
        >
          <Text style={styles.primaryButtonText}>View my listings</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/home" as any)}
          style={[styles.actionButton, styles.secondaryButton]}
        >
          <Text style={styles.secondaryButtonText}>Back to marketplace</Text>
        </Pressable>
      </View>
    </MarketplaceScreen>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
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
  heroCard: {
    backgroundColor: "#183a37",
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  name: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  email: {
    color: "#d6e7df",
    fontSize: 15,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#fffaf0",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f2dfb8",
  },
  metricValue: {
    color: "#6d4d11",
    fontSize: 30,
    fontWeight: "800",
  },
  metricLabel: {
    color: "#7e6638",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "#dde4db",
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
  actionsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: "#dde4db",
  },
  actionButton: {
    borderRadius: 14,
    paddingVertical: 14,
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
  logoutButton: {
    backgroundColor: "#8a2431",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "800",
  },
});
