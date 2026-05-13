import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { ListingInput } from "@/types/marketplace";
import { listingCategories, listingConditions } from "@/types/marketplace";

type ListingFormProps = {
  initialValue: ListingInput;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (value: ListingInput) => Promise<void>;
};

export function ListingForm({
  initialValue,
  onSubmit,
  submitLabel,
  submittingLabel,
}: ListingFormProps) {
  const [form, setForm] = useState<ListingInput>(initialValue);
  const [customCategory, setCustomCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialValue);
    setCustomCategory(
      listingCategories.includes(initialValue.category)
        ? ""
        : initialValue.category,
    );
  }, [initialValue]);

  const setField = <Key extends keyof ListingInput>(
    key: Key,
    value: ListingInput[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const nextCategory = customCategory.trim() || form.category.trim();
    const nextImageUrl = form.imageUrl?.trim() || "";

    if (
      !form.title.trim() ||
      !form.price.trim() ||
      !nextCategory ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      setError("Complete the required fields before saving this listing.");
      return;
    }

    if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError("Price must be a valid number greater than zero.");
      return;
    }

    if (nextImageUrl && !/^https?:\/\//i.test(nextImageUrl)) {
      setError("Image URL must start with http:// or https://.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        ...form,
        category: nextCategory,
        title: form.title.trim(),
        price: Number(form.price).toFixed(2),
        location: form.location.trim(),
        description: form.description.trim(),
        imageUrl: nextImageUrl,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save listing.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Listing details</Text>
      <Text style={styles.sectionText}>
        Add enough detail for another student to decide quickly.
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          onChangeText={(value) => setField("title", value)}
          placeholder="TI-84 calculator"
          placeholderTextColor="#83928c"
          style={styles.input}
          value={form.title}
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Price</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={(value) => setField("price", value)}
          placeholder="45.00"
          placeholderTextColor="#83928c"
          style={styles.input}
          value={form.price}
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.chipRow}>
          {listingCategories.map((category) => (
            <Pressable
              key={category}
              onPress={() => {
                setField("category", category);
                setCustomCategory("");
              }}
              style={[
                styles.chip,
                form.category === category && !customCategory
                  ? styles.chipSelected
                  : null,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  form.category === category && !customCategory
                    ? styles.chipTextSelected
                    : null,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          autoCapitalize="words"
          onChangeText={(value) => {
            setCustomCategory(value);
            setField("category", value || "Other");
          }}
          placeholder="Or enter a custom category, like Stationery"
          placeholderTextColor="#83928c"
          style={styles.input}
          value={customCategory}
        />
        <Text style={styles.helperText}>
          Choose a preset or type a category that fits your item better.
        </Text>
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Condition</Text>
        <View style={styles.chipRow}>
          {listingConditions.map((condition) => (
            <Pressable
              key={condition}
              onPress={() => setField("condition", condition)}
              style={[
                styles.chip,
                form.condition === condition ? styles.chipSelected : null,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  form.condition === condition ? styles.chipTextSelected : null,
                ]}
              >
                {condition}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Pickup location</Text>
        <TextInput
          onChangeText={(value) => setField("location", value)}
          placeholder="Student Union"
          placeholderTextColor="#83928c"
          style={styles.input}
          value={form.location}
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          multiline
          numberOfLines={5}
          onChangeText={(value) => setField("description", value)}
          placeholder="Include brand, condition notes, and pickup availability."
          placeholderTextColor="#83928c"
          style={[styles.input, styles.multilineInput]}
          textAlignVertical="top"
          value={form.description}
        />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="url"
          onChangeText={(value) => setField("imageUrl", value)}
          placeholder="https://example.com/item-photo.jpg"
          placeholderTextColor="#83928c"
          style={styles.input}
          value={form.imageUrl || ""}
        />
        <Text style={styles.helperText}>
          Optional. Leave blank to show a marketplace placeholder image.
        </Text>
      </View>
      <Pressable
        disabled={submitting}
        onPress={handleSubmit}
        style={[styles.submitButton, submitting ? styles.buttonDisabled : null]}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? submittingLabel : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 28,
    padding: 22,
    gap: 18,
    borderWidth: 1,
    borderColor: "#ddd8cf",
    shadowColor: "#172a28",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1d2b28",
    letterSpacing: -0.3,
  },
  sectionText: {
    color: "#61726d",
    lineHeight: 22,
  },
  error: {
    color: "#8a2431",
    backgroundColor: "#fff0f1",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontWeight: "600",
  },
  fieldGroup: {
    gap: 9,
  },
  label: {
    color: "#23413d",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  helperText: {
    color: "#6b7c76",
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d4d8cf",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fcfbf8",
    color: "#162522",
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 132,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#d4d8cf",
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: "#fbf9f5",
  },
  chipSelected: {
    backgroundColor: "#173c3a",
    borderColor: "#173c3a",
  },
  chipText: {
    color: "#35534d",
    fontWeight: "700",
  },
  chipTextSelected: {
    color: "#ffffff",
  },
  submitButton: {
    backgroundColor: "#173c3a",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#173c3a",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    letterSpacing: 0.3,
    fontWeight: "800",
  },
});
