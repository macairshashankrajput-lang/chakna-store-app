# Firebase Setup for Chakna Store (REQUIRED for Auth)

## 🚨 Current Issue
`No Firebase App '[DEFAULT]'` error = **missing native config files**

## React Native Firebase Requirements
React Native Firebase (@react-native-firebase/app) needs:
```
✅ google-services.json → android/app/google-services.json
✅ GoogleService-Info.plist → ios/Chakna Store/GoogleService-Info.plist
```

## Expo Managed Workflow Fix (No android/ios folders)
```
1. Install Expo config plugin:
pnpm add -D expo-build-properties

2. Update app.config.ts (add plugin):
plugins: [
  // ... existing plugins
  '@react-native-firebase/app',
]

3. Download config files from Firebase Console:
   - Android: projectId:thechaknastore → google-services.json
   - iOS: AppID 1:274624443566:ios:14d5a7cb44f49aace1293f

4. Prebuild:
npx expo prebuild --clean
```

## Quick Dev Fix (Skip native builds)
```
1. Use email/password in Firebase Console:
   - Email: xyz@gmail.com (admin role)
   - Any customer email for testing

2. Test web preview:
   npx expo start --web
```

## Test Commands
```
pnpm dev:metro     # Dev server
npx expo start --web  # Web preview (admin protected)
```

**Admin Login:** `xyz@gmail.com` (auto admin role)

