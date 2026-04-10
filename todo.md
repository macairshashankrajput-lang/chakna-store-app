# Chakna Store App - Production Build Checklist

## Phase 1: Production Auth (Remove Demo Logins)
- [ ] Remove customer@test.com demo account
- [ ] Remove vendor@test.com demo account
- [ ] Keep only admin default (xyz@gmail.com / asdfghjkl)
- [ ] Update signup to customer-only registration
- [ ] Add phone number validation on signup
- [ ] Add referral code input field on signup
- [ ] Implement production-ready auth flow
- [ ] Test login/signup end-to-end

## Phase 2: Modern UI Redesign
- [ ] Update theme to professional white/orange scheme
- [ ] Add modern icons (Material Design 3)
- [ ] Redesign login screen with modern layout
- [ ] Redesign register screen
- [ ] Update navigation bar with better styling
- [ ] Improve card layouts and spacing
- [ ] Add loading states and animations
- [ ] Update all screens with consistent design

## Phase 3: Chakna Store (Food Delivery)
- [ ] Create menu listing screen with categories
- [ ] Add menu item cards with images and prices
- [ ] Build product detail screen
- [ ] Implement add to cart functionality
- [ ] Create cart screen with quantity controls
- [ ] Build checkout screen with address selection
- [ ] Integrate payment method selector
- [ ] Add order confirmation screen
- [ ] Implement order history view
- [ ] Add order tracking

## Phase 4: Catering Service
- [ ] Create catering form with customer details
- [ ] Add event details fields (date, guest count, etc.)
- [ ] Add menu type selection (Veg/Non-Veg/Both/Alcohol)
- [ ] Add default menu suggestions
- [ ] Add notes/special requests field
- [ ] Implement form submission to Firestore
- [ ] Add catering request status tracking
- [ ] Build request confirmation screen

## Phase 5: Tiffin Service
- [ ] Create menu selection screen
- [ ] Add daily menu options (Breakfast/Lunch/Dinner)
- [ ] Build calendar UI for month view
- [ ] Implement points wallet system
- [ ] Add subscription plans
- [ ] Build order editing (2-day prior condition)
- [ ] Implement complimentary date change feature
- [ ] Add delivery time selection
- [ ] Build calendar view for upcoming orders
- [ ] Implement add-ons and menu customization

## Phase 6: Vendor Interface
- [ ] Create vendor dashboard with KPI cards
- [ ] Build orders list with filters (Chakna/Catering/Tiffin)
- [ ] Add order status update functionality
- [ ] Build Tiffin calendar view for vendors
- [ ] Implement order acceptance/rejection
- [ ] Add order sharing (WhatsApp/SMS)
- [ ] Build vendor profile management
- [ ] Add payment tracking for vendors

## Phase 7: Admin Dashboard
- [ ] Create admin dashboard overview
- [ ] Build menu management (Add/Edit/Delete)
- [ ] Add image upload for menu items
- [ ] Build coupon/discount management
- [ ] Add referral system management
- [ ] Create reminder system for past catering clients
- [ ] Build data export (Excel/CSV)
- [ ] Add customer management view
- [ ] Build order management with filters
- [ ] Implement Tiffin order assignment to vendors
- [ ] Add notifications management

## Phase 8: Payment & Wallet System
- [ ] Create Razorpay payment gateway structure
- [ ] Implement points wallet system
- [ ] Add wallet top-up functionality
- [ ] Build referral discount application
- [ ] Implement coupon code validation
- [ ] Add payment history tracking
- [ ] Build receipt generation
- [ ] Implement points calculation based on order amount

## Phase 9: Real-time Features
- [ ] Implement real-time order status updates
- [ ] Add push notifications for orders
- [ ] Build order tracking with live updates
- [ ] Add vendor notification system
- [ ] Implement customer notifications
- [ ] Add admin alerts for new orders
- [ ] Implement Tiffin reminder notifications

## Phase 10: Additional Features
- [ ] Map integration for delivery location
- [ ] Review and rating system
- [ ] Address management
- [ ] Vendor location map view
- [ ] Social media sharing
- [ ] Order history with filters
- [ ] Favorites/saved items
- [ ] Search functionality across all services

## Phase 11: Firebase Integration
- [ ] Set up Firestore database schema
- [ ] Implement real-time order updates
- [ ] Set up Firebase Cloud Messaging
- [ ] Implement user profile storage
- [ ] Create order history storage
- [ ] Implement review storage
- [ ] Set up catering request storage
- [ ] Create tiffin subscription tracking

## Phase 12: Testing & Deployment
- [ ] End-to-end testing of all flows
- [ ] Test payment gateway integration
- [ ] Verify Firebase connectivity
- [ ] Test all user roles (Admin, Customer, Vendor)
- [ ] Performance optimization
- [ ] Bug fixes and polish
- [ ] Production deployment preparation
- [ ] Create app logo and branding
- [ ] Generate APK/IPA builds
- [ ] Test on physical devices

## CRITICAL FEATURES FROM MASTER PLAN

### Authentication
- [x] Default admin account (xyz@gmail.com)
- [ ] Customer signup with phone number
- [ ] Referral code on signup
- [ ] Production-ready (no demo accounts)

### Customer Services
- [ ] Chakna Store - Food delivery like Swiggy/Zomato
- [ ] Catering - Event booking with form
- [ ] Tiffin - Subscription with calendar UI and points wallet

### Vendor Features
- [ ] 12 vendors available by default
- [ ] Order management with status updates
- [ ] Tiffin calendar management
- [ ] Order sharing capability

### Admin Features
- [ ] Menu management with image upload
- [ ] Coupon and discount management
- [ ] Referral system management
- [ ] Customer reminder system
- [ ] Data export (Excel/CSV)
- [ ] Tiffin order assignment to vendors

### Payment System
- [ ] Razorpay integration
- [ ] Points wallet system
- [ ] Referral discounts
- [ ] Coupon application

### Tiffin Special Features
- [ ] Points-based payment (add 5000 rupee = 5000 points)
- [ ] Calendar UI for order management
- [ ] 3 delivery times per day
- [ ] 2-day prior editing allowed
- [ ] 1 complimentary date change per order
- [ ] Add-ons and menu customization
