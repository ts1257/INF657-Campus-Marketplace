import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { auth, db } from "@/config/firebase";
import {
  type Listing,
  type ListingInput,
  listingConditions,
} from "@/types/marketplace";

type AuthFormInput = {
  email: string;
  password: string;
  displayName?: string;
};

type MarketplaceContextValue = {
  user: User | null;
  authLoading: boolean;
  listingsLoading: boolean;
  listings: Listing[];
  myListings: Listing[];
  errorMessage: string | null;
  signIn: (input: AuthFormInput) => Promise<void>;
  signUp: (input: AuthFormInput) => Promise<void>;
  signOut: () => Promise<void>;
  addListing: (input: ListingInput) => Promise<void>;
  updateListing: (id: string, input: ListingInput) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  getListingById: (id: string) => Listing | undefined;
  clearError: () => void;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

const itemsCollection = collection(db, "items");

type FirestoreListingDocument = {
  itemName?: string;
  description?: string;
  price?: number | string;
  category?: string;
  condition?: string;
  location?: string;
  imageUrl?: string;
  sellerId?: string;
  sellerEmail?: string;
  sellerName?: string;
  createdAt?: string | Date | Timestamp;
  updatedAt?: string | Date | Timestamp;
};

function normalizeError(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function sanitizeListingInput(input: ListingInput): ListingInput {
  const trimmedCategory = input.category.trim();

  return {
    title: input.title.trim(),
    price: input.price.trim(),
    category: trimmedCategory || "Other",
    condition: listingConditions.includes(input.condition)
      ? input.condition
      : "Good",
    location: input.location.trim(),
    description: input.description.trim(),
    imageUrl: input.imageUrl?.trim() || "",
  };
}

function normalizeDate(value: FirestoreListingDocument["createdAt"]) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return new Date(0).toISOString();
}

function mapListingDocument(
  id: string,
  data: FirestoreListingDocument,
): Listing {
  return {
    id,
    title: data.itemName?.trim() || "Untitled listing",
    price:
      typeof data.price === "number"
        ? data.price.toFixed(2)
        : String(data.price ?? "0.00"),
    category: data.category?.trim() || "Other",
    condition: listingConditions.includes(data.condition as any)
      ? (data.condition as Listing["condition"])
      : "Good",
    location: data.location?.trim() || "Campus meetup",
    description: data.description?.trim() || "No description provided.",
    imageUrl: data.imageUrl?.trim() || "",
    ownerId: data.sellerId?.trim() || "",
    sellerEmail: data.sellerEmail?.trim() || "",
    sellerName: data.sellerName?.trim() || "Campus Seller",
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt ?? data.createdAt),
  };
}

export function MarketplaceProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const itemsQuery = query(itemsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      itemsQuery,
      (snapshot) => {
        const nextListings = snapshot.docs.map((listingDocument) =>
          mapListingDocument(
            listingDocument.id,
            listingDocument.data() as FirestoreListingDocument,
          ),
        );

        setListings(nextListings);
        setListingsLoading(false);
      },
      (error) => {
        setErrorMessage(normalizeError(error));
        setListingsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const clearError = () => {
    setErrorMessage(null);
  };

  const signIn = async ({ email, password }: AuthFormInput) => {
    clearError();
    await signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const signUp = async ({ email, password, displayName }: AuthFormInput) => {
    clearError();
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    if (displayName?.trim()) {
      await updateProfile(credentials.user, {
        displayName: displayName.trim(),
      });
    }

    await firebaseSignOut(auth);
  };

  const signOut = async () => {
    clearError();
    await firebaseSignOut(auth);
  };

  const addListing = async (input: ListingInput) => {
    clearError();

    if (!user) {
      throw new Error("You must be signed in to add a listing.");
    }

    const nextListing = sanitizeListingInput(input);
    const timestamp = new Date().toISOString();

    await addDoc(itemsCollection, {
      itemName: nextListing.title,
      description: nextListing.description,
      price: Number(nextListing.price),
      category: nextListing.category,
      condition: nextListing.condition,
      location: nextListing.location,
      imageUrl: nextListing.imageUrl || "",
      sellerId: user.uid,
      sellerEmail: user.email ?? "",
      sellerName: user.displayName?.trim() || "Campus Seller",
      createdAt: new Date(timestamp),
      updatedAt: new Date(timestamp),
    });
  };

  const updateListing = async (id: string, input: ListingInput) => {
    clearError();

    if (!user) {
      throw new Error("You must be signed in to edit a listing.");
    }

    const currentListing = listings.find((listing) => listing.id === id);

    if (!currentListing) {
      throw new Error("Listing not found.");
    }

    if (currentListing.ownerId !== user.uid) {
      throw new Error("You can only edit your own listings.");
    }

    const nextListing = sanitizeListingInput(input);

    await updateDoc(doc(db, "items", id), {
      itemName: nextListing.title,
      description: nextListing.description,
      price: Number(nextListing.price),
      category: nextListing.category,
      condition: nextListing.condition,
      location: nextListing.location,
      imageUrl: nextListing.imageUrl || "",
      sellerId: currentListing.ownerId,
      updatedAt: new Date(),
    });
  };

  const deleteListing = async (id: string) => {
    clearError();

    if (!user) {
      throw new Error("You must be signed in to delete a listing.");
    }

    const currentListing = listings.find((listing) => listing.id === id);

    if (!currentListing) {
      throw new Error("Listing not found.");
    }

    if (currentListing.ownerId !== user.uid) {
      throw new Error("You can only delete your own listings.");
    }

    await deleteDoc(doc(db, "items", id));
  };

  const getListingById = (id: string) =>
    listings.find((listing) => listing.id === id);

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      user,
      authLoading,
      listingsLoading,
      listings,
      myListings: user
        ? listings.filter((listing) => listing.ownerId === user.uid)
        : [],
      errorMessage,
      signIn,
      signUp,
      signOut,
      addListing,
      updateListing,
      deleteListing,
      getListingById,
      clearError,
    }),
    [authLoading, errorMessage, listings, listingsLoading, user],
  );

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);

  if (!context) {
    throw new Error("useMarketplace must be used inside MarketplaceProvider.");
  }

  return context;
}
