CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`discount_type` enum('percentage','fixed'),
	`value` int NOT NULL,
	`expiry` timestamp,
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `menu` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(100),
	`type` enum('veg','non-veg'),
	`price` int NOT NULL,
	`ingredients` text,
	`is_active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `menu_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`menu_id` int NOT NULL,
	`quantity` int NOT NULL,
	`price` int NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`vendor_id` int,
	`type` enum('chakna','tiffin','catering'),
	`total_price` int NOT NULL,
	`status` varchar(50) DEFAULT 'pending',
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`order_id` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tiffin_schedule` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscription_id` int NOT NULL,
	`date` timestamp NOT NULL,
	`meal_type` enum('breakfast','lunch','dinner'),
	`menu_id` int,
	`editable_until` timestamp,
	CONSTRAINT `tiffin_schedule_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tiffin_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`total_points` int NOT NULL,
	`remaining_points` int NOT NULL,
	`status` varchar(50) DEFAULT 'active',
	CONSTRAINT `tiffin_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('customer','vendor','admin') NOT NULL DEFAULT 'customer';--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_menu_id_menu_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_vendor_id_users_id_fk` FOREIGN KEY (`vendor_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tiffin_schedule` ADD CONSTRAINT `tiffin_schedule_subscription_id_tiffin_subscriptions_id_fk` FOREIGN KEY (`subscription_id`) REFERENCES `tiffin_subscriptions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tiffin_schedule` ADD CONSTRAINT `tiffin_schedule_menu_id_menu_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menu`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tiffin_subscriptions` ADD CONSTRAINT `tiffin_subscriptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;