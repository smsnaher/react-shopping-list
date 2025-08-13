# Firestore Setup Guide

## 🔥 Firebase Firestore Configuration

Your shopping list app now uses Firestore instead of localStorage for better data persistence and synchronization across devices.

## Setup Steps

### 1. Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ratna-shopping-list`
3. In the left sidebar, click on "Firestore Database"
4. Click "Create database"
5. Choose "Start in test mode" (for now) - we'll add security rules later
6. Select a location (choose the closest to your users)

### 2. Configure Security Rules

Once Firestore is enabled, update the security rules to ensure users can only access their own data:

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own shopping items
    match /shopping-items/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

### 3. GitHub Secrets (Required)

Add these secrets to your GitHub repository at:
`https://github.com/smsnaher/react-shopping-list/settings/secrets/actions`

```
VITE_FIREBASE_API_KEY = AIzaSyBuNxnQqG8DDApF2K95vMM-Z9_3-ASWcL4
VITE_FIREBASE_AUTH_DOMAIN = ratna-shopping-list.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = ratna-shopping-list
VITE_FIREBASE_STORAGE_BUCKET = ratna-shopping-list.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 488182871191
VITE_FIREBASE_APP_ID = 1:488182871191:web:51e44ef6182dd3908f25d2
VITE_FIREBASE_MEASUREMENT_ID = G-PHLKP96YPD
```

### 4. Authorized Domains

Make sure these domains are authorized in Firebase Authentication:
- `localhost` (for development)
- `smsnaher.github.io` (for GitHub Pages)

### 5. Data Migration

If users had data in localStorage, it will still be there for reference, but new data will be stored in Firestore. The old localStorage data won't be automatically migrated.

## Features

### ✅ What's New with Firestore:

- **Real-time Sync**: Data synchronizes across all user devices
- **Offline Support**: Works offline and syncs when back online
- **Better Performance**: Optimized queries and caching
- **Scalability**: Handles growing data without performance issues
- **Security**: Server-side security rules protect user data
- **Backup**: Automatic backups and point-in-time recovery

### 🔧 Technical Changes:

- **Database**: localStorage → Firestore
- **Data Structure**: Added timestamps and user associations
- **Query System**: Efficient filtering by user ID
- **Error Handling**: Better error messages and recovery
- **Loading States**: Proper loading indicators

## Data Structure

Each shopping list item in Firestore has this structure:

```typescript
{
  id: string (auto-generated)
  name: string
  quantity: number
  description?: string
  childItems: ChildItem[]
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Testing

1. **Local Development**:
   ```bash
   npm run dev
   ```

2. **Production Build**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   git add .
   git commit -m "Add Firestore database integration"
   git push origin main
   ```

## Troubleshooting

### Common Issues:

1. **"Missing or insufficient permissions"**
   - Check Firestore security rules
   - Ensure user is authenticated

2. **"The query requires an index"**
   - Click the provided link to create the index
   - Or use simpler queries (already implemented)

3. **Build failures**
   - Ensure all GitHub secrets are set correctly
   - Check that Firebase project is properly configured

### Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify Firebase project settings
3. Test with a fresh browser session (clear cache)

Your shopping list app is now powered by Firestore! 🎉
