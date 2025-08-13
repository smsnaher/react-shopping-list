# Firebase Google Authentication Setup

This application now includes Firebase Google Authentication. Follow these steps to set up authentication:

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" or "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In your Firebase project, go to "Authentication" in the left sidebar
   - Click on "Get started"
   - Go to the "Sign-in method" tab
   - Enable "Google" as a sign-in provider
   - Add your domain to authorized domains (for local development, `localhost` should already be included)

3. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click on the web app icon (`</>`) to create a web app
   - Register your app with a nickname
   - Copy the Firebase configuration object

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env` in your project root
   - Replace the placeholder values with your actual Firebase configuration:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
   VITE_FIREBASE_APP_ID=your-actual-app-id
   ```

## GitHub Pages Deployment Configuration

For GitHub Pages deployment, you'll need to add your Firebase configuration as GitHub Secrets:

1. Go to your GitHub repository
2. Go to Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

4. Update your GitHub Actions workflow to use these secrets during the build process.

## Features

- **Google Authentication**: Users can sign in with their Google accounts
- **User-specific Data**: Each user's shopping lists are stored separately
- **Persistent Login**: Users remain logged in across browser sessions
- **Secure Logout**: Users can safely sign out
- **Protected Routes**: All shopping list features require authentication

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env` file with Firebase configuration

3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

The app is configured to work with GitHub Pages. Make sure to:

1. Add Firebase configuration as GitHub Secrets
2. Update your Firebase project's authorized domains to include your GitHub Pages URL
3. Push your changes to trigger the deployment

Your app will be available at: `https://yourusername.github.io/react-shopping-list/`
