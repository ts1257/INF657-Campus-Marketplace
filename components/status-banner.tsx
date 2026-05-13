import { StyleSheet, Text, View } from "react-native";

type StatusBannerProps = {
  message: string;
  tone?: "error" | "info" | "success";
};

export function StatusBanner({ message, tone = "info" }: StatusBannerProps) {
  return (
    <View
      style={[
        styles.container,
        tone === "error"
          ? styles.error
          : tone === "success"
            ? styles.success
            : styles.info,
      ]}
    >
      <Text
        style={[
          styles.text,
          tone === "error"
            ? styles.errorText
            : tone === "success"
              ? styles.successText
              : styles.infoText,
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  info: {
    backgroundColor: "#ebf4ff",
  },
  success: {
    backgroundColor: "#e8f7ec",
  },
  error: {
    backgroundColor: "#fdecec",
  },
  infoText: {
    color: "#214c78",
  },
  successText: {
    color: "#1f5c34",
  },
  errorText: {
    color: "#8a2431",
  },
});
