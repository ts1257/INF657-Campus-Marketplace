import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type MarketplaceScreenProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  footer?: ReactNode;
}>;

export function MarketplaceScreen({
  children,
  footer,
  subtitle,
  title,
}: MarketplaceScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <View style={styles.backdropTop} />
      <View style={styles.backdropBottom} />
      <ScrollView
        automaticallyAdjustContentInsets={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        scrollIndicatorInsets={{ bottom: insets.bottom + 16 }}
      >
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.kicker}>Campus Marketplace</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.heroHighlights}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>Student-first listings</Text>
            </View>
            <View style={styles.heroPillMuted}>
              <Text style={styles.heroPillMutedText}>Fast campus pickup</Text>
            </View>
          </View>
        </View>
        {children}
      </ScrollView>
      {footer ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f3efe7",
  },
  backdropTop: {
    position: "absolute",
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#dfead6",
    opacity: 0.8,
  },
  backdropBottom: {
    position: "absolute",
    left: -70,
    bottom: 110,
    width: 190,
    height: 190,
    borderRadius: 999,
    backgroundColor: "#f7d9bf",
    opacity: 0.5,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 18,
  },
  hero: {
    backgroundColor: "#173c3a",
    borderRadius: 30,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#0d211f",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(236, 246, 237, 0.14)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(236, 246, 237, 0.18)",
  },
  kicker: {
    color: "#dceddf",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 33,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#d4e6de",
    fontSize: 15,
    lineHeight: 23,
    maxWidth: "92%",
  },
  heroHighlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  heroPill: {
    backgroundColor: "#f4b267",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroPillText: {
    color: "#4f2d07",
    fontSize: 12,
    fontWeight: "800",
  },
  heroPillMuted: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroPillMutedText: {
    color: "#edf6f0",
    fontSize: 12,
    fontWeight: "700",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#d9ddd2",
    backgroundColor: "rgba(255,255,255,0.94)",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#1b2d2b",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -6 },
    elevation: 6,
  },
});
