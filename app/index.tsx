import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { MarketplaceScreen } from "@/components/marketplace-screen";
import { StatusBanner } from "@/components/status-banner";
import { useMarketplace } from "@/context/marketplace-context";

export default function LoginScreen() {
  const { authLoading, clearError, errorMessage, signIn, user } =
    useMarketplace();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/home" as any);
    }
  }, [authLoading, user]);

  const handleSignIn = async () => {
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalError("Enter your campus email and password.");
      return;
    }

    setLocalError(null);
    setSubmitting(true);

    try {
      await signIn({ email, password });
      router.replace("/home" as any);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#183a37" />
        <Text style={styles.loadingText}>Checking your session...</Text>
      </View>
    );
  }

  return (
    <MarketplaceScreen
      title="Buy and sell around campus"
      subtitle="Sign in to browse local listings, post items, and manage your marketplace profile."
      footer={
        <Pressable onPress={() => router.push("/signup" as any)}>
          <Text style={styles.footerText}>New here? Create an account.</Text>
        </Pressable>
      }
    >
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Welcome back</Text>
        <Text style={styles.sectionText}>
          Use your email and password to access your listings.
        </Text>
        {localError || errorMessage ? (
          <StatusBanner
            message={localError || errorMessage || ""}
            tone="error"
          />
        ) : null}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="student@campus.edu"
            placeholderTextColor="#83928c"
            style={styles.input}
            value={email}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#83928c"
            secureTextEntry
            style={styles.input}
            value={password}
          />
        </View>
        <Pressable
          disabled={submitting}
          onPress={handleSignIn}
          style={[
            styles.primaryButton,
            submitting ? styles.buttonDisabled : null,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Signing in..." : "Sign in"}
          </Text>
        </Pressable>
      </View>
    </MarketplaceScreen>
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "#dde4db",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1d2b28",
  },
  sectionText: {
    color: "#5d6f69",
    lineHeight: 21,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#27413b",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cad5cc",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fbfcfa",
    color: "#162522",
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#183a37",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  footerText: {
    color: "#183a37",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
  },
});
