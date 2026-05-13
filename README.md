# Campus Marketplace

Campus Marketplace is a React Native marketplace app built with Expo for the CSCI INF657 final project. Students can create accounts, browse listings, view item details, add items for sale, edit or delete their own posts, and manage their seller profile.

## Technologies Used

- React Native
- Expo
- Expo Router
- Firebase Authentication
- Firebase Firestore
- AsyncStorage for persisted Firebase auth sessions
- TypeScript

## Main Features

- Email/password signup, login, session tracking, and logout with Firebase Authentication
- Browse marketplace listings from Firestore
- View full item details with seller information and item image
- Add new listings with price, category, condition, location, description, and image URL
- Edit or delete only the logged-in user's listings
- Search listings by keyword/location and filter by category
- Profile screen with seller information and listing stats

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npx expo start
```

3. Open the app in Expo Go, Android Studio emulator, iOS simulator, or a web browser from the Expo prompt.

## Firebase Services Used

### Firebase Authentication

- Creates new user accounts with email and password
- Signs users in with email and password
- Persists the current user session across app restarts
- Signs users out and protects add/edit/delete actions unless authenticated

### Cloud Firestore

- Stores marketplace item documents
- Streams live updates to the browse and my listings screens
- Supports create, read, update, and delete operations for item records

## Firestore Collection Structure

Primary collection used by the app:

```text
items
```

Example document:

```json
{
  "itemName": "TI-84 Calculator",
  "description": "Graphing calculator in good condition.",
  "price": 45,
  "category": "School Supplies",
  "condition": "Good",
  "location": "Student Union",
  "imageUrl": "https://example.com/calculator.jpg",
  "sellerId": "firebase-user-uid",
  "sellerEmail": "student@example.com",
  "sellerName": "Alex Carter",
  "createdAt": "Firestore Timestamp",
  "updatedAt": "Firestore Timestamp"
}
```

## Project Structure

- `app/`: Expo Router screens
- `components/`: Reusable UI components such as the listing form and listing card
- `context/`: Marketplace context for Firebase auth state and Firestore CRUD logic
- `config/`: Firebase app configuration
- `types/`: Shared TypeScript types for marketplace data

## How To Run

- `npm run start`: Start the Expo dev server
- `npm run android`: Launch Expo for Android
- `npm run ios`: Launch Expo for iOS
- `npm run web`: Launch Expo for web
- `npm run lint`: Run Expo lint

## Known Issues

- Firebase configuration is currently committed in the project config and should be moved to environment variables for production use.
- Remote image URLs depend on the availability and validity of external image hosts.
