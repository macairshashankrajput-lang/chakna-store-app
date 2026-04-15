Build a scalable cross-platform mobile application using Flutter (Dart) for Android & iOS.

Project Name: The Chakna Co Super App

Architecture Style:
- Clean Architecture + MVVM
- Feature-based modular structure
- State management: Riverpod / Bloc
- Backend:  (Supabase)
- for menu use menu,json file
- for logo use applogo.png file
-----------------------------------
CORE MODULES
-----------------------------------

AUTHENTICATION
- applogo.png application logo
- Login using Phone Number / Email + Password
- Signup:
  - Name
  - Phone Number
  - Email
  - Password
  - Address (Auto Geo Capture)
- Forgot/Reset Password
- Fix auth flow so role-based access is enforced before admin/customer/vendor routes load

NO OTP / NO Google Maps API

-----------------------------------
USER ROLES
-----------------------------------
1. Admin
2. Customer
3. Vendor

Role-based routing after login
- Customer → customer app flow
- Vendor → vendor app flow
- Admin → admin dashboard only after valid login
- Enforce admin auth guard on admin routes
- Use local menu.json for menu data in customer and admin interfaces
- Use application logo(applogo.png) in auth and menu screens
also upload this logo into the supabase storage bucket so that it is accessable everywhere Use application logo(applogo.png) where it is needed
-----------------------------------
ADMIN PANEL FEATURES
-----------------------------------
- Vendor Management
  - Create / Update / Delete vendors
  - Assign credentials

- Menu Management
  - CRUD menu categories & items

- Order Management
  - The Chakna orders
  - Catering orders
  - Tiffin subscriptions

- Tiffin Control
  - Pricing logic
  - Points system configuration

- Reminder System
  - Past orders alerts

- Analytics Dashboard
  - Orders
  - Revenue
  - Customers

- Reviews Management

- Coupons / Referral System
  - Create discount rules
  - Referral rewards

- Export Data
  - CSV / Excel

- Real-time sync enabled

-----------------------------------
CUSTOMER APP FEATURES
-----------------------------------

3 MAIN SECTIONS:

1. THE CHAKNA (Food Ordering)
- Browse menu
- Add to cart
- Place order
- Order tracking

2. CATERING
- Submit request:
  - Event details
  - Budget
  - Location
  - Menu preference

3. TIFFIN SYSTEM (CORE LOGIC)

- Monthly subscription model
- Wallet system (Points-based)
  - ₹1 = 1 Point
- Add money → Convert to points

- Calendar UI:
  - Select meals per day (Breakfast/Lunch/Dinner)
  - Bulk monthly planning

- Editable Rules:
  - Can modify order ONLY 2 days before delivery

- Menu selection per day
- Auto deduction of points

-----------------------------------
VENDOR PANEL FEATURES
-----------------------------------
- Real-time incoming orders
- Accept / Reject / Update status
- Order history
- Customer details per order

-----------------------------------
TECH REQUIREMENTS
-----------------------------------
- Clean Architecture layers:
  - Presentation
  - Domain
  - Data

- Offline-first support (optional caching)
- Real-time updates
- Scalable APIs

