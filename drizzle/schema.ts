import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json, datetime } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core schema for Chakna Store App
 * MySQL tables matching types.ts
 */

// Users table - extended from basic
export const users = mysqlTable("users", {
  id: varchar("id", { length: 128 }).primaryKey(), // Firebase UID
  openId: varchar("openId", { length: 64 }),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", ["customer", "vendor", "admin"]).default("customer").notNull(),
  deliveryLocation: json("deliveryLocation"), // {lat, lng, address}
  referralCode: varchar("referralCode", { length: 32 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Products
export const products = mysqlTable("products", {
  id: varchar("id", { length: 128 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }),
  category: varchar("category", { length: 64 }),
  available: int("available").notNull().default(1),
  vendorId: varchar("vendorId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Orders (Chakna)
export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("userId", { length: 128 }).notNull(),
  vendorId: varchar("vendorId", { length: 128 }),
  items: json("items").notNull(), // CartItem[]
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "preparing", "cooking", "out-for-delivery", "delivered", "cancelled"]).default("pending"),
  deliveryAddress: text("deliveryAddress"),
  paymentId: varchar("paymentId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Reviews
export const reviews = mysqlTable("reviews", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("userId", { length: 128 }).notNull(),
  productId: varchar("productId", { length: 128 }),
  orderId: varchar("orderId", { length: 128 }),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Tiffin Orders
export const tiffinOrders = mysqlTable("tiffin_orders", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("userId", { length: 128 }).notNull(),
  vendorId: varchar("vendorId", { length: 128 }).notNull(),
  date: date("date").notNull(),
  menu: json("menu"),
  status: mysqlEnum("status", ["pending", "cancelled", "delivered", "updated", "not-received"]).default("pending"),
  pointsUsed: int("pointsUsed").notNull().default(0),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Catering Requests
export const cateringRequests = mysqlTable("catering_requests", {
  id: varchar("id", { length: 128 }).primaryKey(),
  userId: varchar("userId", { length: 128 }).notNull(),
  eventDate: date("eventDate").notNull(),
  guestCount: int("guestCount").notNull(),
  menuType: mysqlEnum("menuType", ["veg", "non-veg", "both", "alcohol"]),
  notes: text("notes"),
  status: mysqlEnum("status", ["confirmed", "cancelled", "in-progress", "completed"]).default("confirmed"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Relations (optional for queries)
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  tiffinOrders: many(tiffinOrders),
  cateringRequests: many(cateringRequests),
}));

export const productsRelations = relations(products, ({ many }) => ({
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));

