import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["customer", "vendor", "admin"]).default("customer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const menu = mysqlTable("menu", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  type: mysqlEnum("type", ["veg", "non-veg"]),
  price: int("price").notNull(), // in paise
  ingredients: text("ingredients"),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id).notNull(),
  vendorId: int("vendor_id").references(() => users.id),
  type: mysqlEnum("type", ["chakna", "tiffin", "catering"]),
  totalPrice: int("total_price").notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("order_id").references(() => orders.id).notNull(),
  menuId: int("menu_id").references(() => menu.id).notNull(),
  quantity: int("quantity").notNull(),
  price: int("price").notNull(),
});

export const tiffinSubscriptions = mysqlTable("tiffin_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  totalPoints: int("total_points").notNull(),
  remainingPoints: int("remaining_points").notNull(),
  status: varchar("status", { length: 50 }).default("active"),
});

export const tiffinSchedule = mysqlTable("tiffin_schedule", {
  id: int("id").autoincrement().primaryKey(),
  subscriptionId: int("subscription_id").references(() => tiffinSubscriptions.id).notNull(),
  date: timestamp("date").notNull(),
  mealType: mysqlEnum("meal_type", ["breakfast", "lunch", "dinner"]),
  menuId: int("menu_id").references(() => menu.id),
  editableUntil: timestamp("editable_until"),
});

export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).unique().notNull(),
  discountType: mysqlEnum("discount_type", ["percentage", "fixed"]),
  value: int("value").notNull(),
  expiry: timestamp("expiry"),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").references(() => users.id).notNull(),
  orderId: int("order_id").references(() => orders.id).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
});

// Update types
// Consolidated types (avoid duplicates)
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type MenuItem = typeof menu.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type TiffinSubscription = typeof tiffinSubscriptions.$inferSelect;
export type TiffinSchedule = typeof tiffinSchedule.$inferSelect;
// Add more as needed
