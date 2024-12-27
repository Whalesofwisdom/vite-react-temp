CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`release_type` text,
	`release_date` integer,
	`release_contact_email` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`profile_name` text,
	`theme_preference` text DEFAULT 'light',
	`email_notifications` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`last_login` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);