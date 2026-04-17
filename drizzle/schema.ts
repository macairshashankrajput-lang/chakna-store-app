import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean, doublePrecision, jsonb } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Columns use camelCase to match both database fields and generated types.
 */
export const userRoleEnum = pgEnum("user_role", ["customer", "vendor", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "pending"]);

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Supabase Auth ID (UUID string)
  openId: varchar("open_id", { length: 255 }).unique(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").default("customer").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  referralCode: varchar("referral_code", { length: 50 }).unique(),
  pointsBalance: integer("points_balance").default(0).notNull(),
  deliveryLocation: jsonb("delivery_location"), // { address: string, latitude: number, longitude: number }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export const foodTypeEnum = pgEnum("food_type", ["veg", "non-veg"]);

export const menu = pgTable("menu", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  type: foodTypeEnum("type").default("veg"),
  price: integer("price").notNull(), // in paise/cents
  image: text("image"),
  ingredients: text("ingredients"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderTypeEnum = pgEnum("order_type", ["chakna", "tiffin", "catering"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "cooking", "out_for_delivery", "delivered", "cancelled"]);

export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  vendorId: varchar("vendor_id", { length: 255 }).references(() => users.id),
  type: orderTypeEnum("type").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  receiptImage: text("receipt_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  menuId: integer("menu_id").references(() => menu.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

export const cateringRequests = pgTable("catering_requests", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  eventDate: timestamp("event_date").notNull(),
  guestCount: integer("guest_count").notNull(),
  location: text("location").notNull(),
  budget: integer("budget"),
  menuPreferences: text("menu_preferences"),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tiffinSubscriptions = pgTable("tiffin_subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPoints: integer("total_points").notNull(),
  remainingPoints: integer("remaining_points").notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
});

export const mealTypeEnum = pgEnum("meal_type", ["breakfast", "lunch", "dinner"]);

export const tiffinSchedule = pgTable("tiffin_schedule", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  subscriptionId: integer("subscription_id").references(() => tiffinSubscriptions.id).notNull(),
  date: timestamp("date").notNull(),
  mealType: mealTypeEnum("meal_type").notNull(),
  menuId: integer("menu_id").references(() => menu.id),
  editableUntil: timestamp("editable_until"),
  isChanged: boolean("is_changed").default(false), // tracking the 1 complimentary date change if needed
});

export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Consolidated types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type MenuItem = typeof menu.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type TiffinSubscription = typeof tiffinSubscriptions.$inferSelect;
export type TiffinSchedule = typeof tiffinSchedule.$inferSelect;
export type CateringRequest = typeof cateringRequests.$inferSelect;
