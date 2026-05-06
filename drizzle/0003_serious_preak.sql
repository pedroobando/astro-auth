PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`context` text NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "user_id", "name", "context", "is_active", "created_at") SELECT "id", "user_id", "name", "context", "is_active", "created_at" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;