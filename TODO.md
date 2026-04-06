# Chakna Store App - Phase 8+ Implementation Plan

## Current Status
✅ Auth system (mock)
✅ Role-based navigation
✅ UI foundations

## TODO Steps

### 1. Install Dependencies
- [x] `npm add @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore react-native-razorpay expo-dev-client` (running)
- [x] `npx expo prebuild --clean` (running)

### 2. Firebase Initialization
- [ ] Update lib/firebase-config.ts (initialize app/firestore/auth)
- [ ] Test config

### 3. Real Firebase Auth
- [ ] Update lib/auth-context.tsx (Firebase signIn/createUser)
- [ ] Migrate mock to real

### 4. Data Models
- [ ] Add to shared/types.ts: Product, CartItem, Order
- [ ] Firestore collections plan

### 5. Chakna Store Screens
- [ ] Create app/(customer)/chakna/_layout.tsx (stack)
- [ ] app/(customer)/chakna/index.tsx (listing)
- [ ] app/(customer)/chakna/product/[id].tsx
- [ ] app/(customer)/cart.tsx
- [ ] app/(customer)/checkout.tsx

### 6. Cart Context & Hooks
- [ ] lib/cart-context.tsx
- [ ] hooks/use-products.ts, use-cart.ts (React Query)

### 7. Navigation Updates
- [ ] app/(customer)/index.tsx (navigate to chakna)
- [ ] Update tabs if needed

### 8. Admin Features
- [ ] app/(admin)/menu.tsx (CRUD products)

### 9. Testing
- [ ] Seed sample products
- [ ] Test flows: browse -> add cart -> checkout
- [ ] Razorpay sandbox

### 10. Completion
- [ ] Update README
- [ ] attempt_completion

**Progress: Step 1 complete (installs running). Starting Step 2**
