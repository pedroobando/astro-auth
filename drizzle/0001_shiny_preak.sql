CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`context` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer
);
