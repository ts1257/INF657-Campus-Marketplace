import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { MarketplaceScreen } from "@/components/marketplace-screen";
import { StatusBanner } from "@/components/status-banner";
import { useMarketplace } from "@/context/marketplace-context";

export default function SignupScreen() {
  const { authLoading, clearError, errorMessage, signUp, user } =
    useMarketplace();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/home" as any);
    }
  }, [authLoading, user]);

  const handleSignup = async () => {
    clearError();

    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setLocalError("Complete all fields to create your account.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError(null);
    setSubmitting(true);

    try {
      await signUp({ displayName, email, password });
      router.replace("/" as any);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Unable to create account.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MarketplaceScreen
      title="Create your seller account"
      subtitle="Join the campus community to list items, find nearby deals, and manage your own storefront."
      footer={
        <Pressable onPress={() => router.replace("/" as any)}>
          <Text style={styles.footerText}>
            Already have an account? Sign in.
          </Text>
        </Pressable>
      }
    >
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Set up your profile</Text>
        <Text style={styles.sectionText}>
          Your name and email will appear on your listings.
        </Text>
        {localError || errorMessage ? (
          <StatusBanner
            message={localError || errorMessage || ""}
            tone="error"
          />
        ) : null}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Display name</Text>
          <TextInput
            onChangeText={setDisplayName}
            placeholder="Alex Carter"
            placeholderTextColor="#83928c"
            style={styles.input}
            value={displayName}
          />
        </View>
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
            placeholder="At least 6 characters"
            placeholderTextColor="#83928c"
            secureTextEntry
            style={styles.input}
            value={password}
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
            placeholderTextColor="#83928c"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
          />
        </View>
        <Pressable
          disabled={submitting}
          onPress={handleSignup}
          style={[
            styles.primaryButton,
            submitting ? styles.buttonDisabled : null,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Creating account..." : "Create account"}
          </Text>
        </Pressable>
      </View>
    </MarketplaceScreen>
  );
}

const styles = StyleSheet.create({
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
