export const listingCategories = [
  "School Supplies",
  "Electronics",
  "Home & Furniture",
  "Clothing & Accessories",
  "Sports & Recreation",
  "Other",
] as const;

export const listingConditions = ["New", "Like New", "Good", "Fair"] as const;

export type PresetListingCategory = (typeof listingCategories)[number];
export type ListingCategory = PresetListingCategory | string;
export type ListingCondition = (typeof listingConditions)[number];

export type ListingInput = {
  title: string;
  price: string;
  category: ListingCategory;
  condition: ListingCondition;
  location: string;
  description: string;
  imageUrl?: string;
};

export type Listing = ListingInput & {
  id: string;
  ownerId: string;
  sellerEmail: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
};
