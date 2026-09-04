CREATE TYPE "public"."order_status" AS ENUM('created', 'paid', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'captured', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"line1" varchar(200) NOT NULL,
	"line2" varchar(200),
	"city" varchar(80) NOT NULL,
	"state" varchar(80) NOT NULL,
	"pincode" varchar(6) NOT NULL,
	"country" varchar(2) DEFAULT 'IN' NOT NULL,
	"lat" real,
	"lng" real,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"role" varchar(16) NOT NULL,
	"content" text NOT NULL,
	"model" varchar(60),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"handoff_to_human" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor" varchar(80),
	"action" varchar(80) NOT NULL,
	"target" varchar(200),
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cart_items" (
	"cart_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "cart_items_cart_id_product_id_pk" PRIMARY KEY("cart_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(80) NOT NULL,
	"icon" varchar(80) NOT NULL,
	"parent_id" uuid,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupons" (
	"code" varchar(40) PRIMARY KEY NOT NULL,
	"description" varchar(200),
	"percent_off" integer,
	"flat_off" integer,
	"min_subtotal" integer DEFAULT 0 NOT NULL,
	"max_redemptions" integer,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"warehouse_id" varchar(40) DEFAULT 'WH-1' NOT NULL,
	"on_hand" integer DEFAULT 0 NOT NULL,
	"reserved" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs_audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"queue" varchar(40) NOT NULL,
	"job_id" varchar(80) NOT NULL,
	"status" varchar(20) NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(200) NOT NULL,
	"source" varchar(80) DEFAULT 'footer',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"unit_price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"address_id" uuid NOT NULL,
	"status" "order_status" DEFAULT 'created' NOT NULL,
	"subtotal" integer NOT NULL,
	"shipping" integer DEFAULT 0 NOT NULL,
	"tax" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"razorpay_order_id" varchar(60) NOT NULL,
	"razorpay_payment_id" varchar(60),
	"razorpay_signature" varchar(256),
	"amount" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"method" varchar(40),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"url" varchar(500) NOT NULL,
	"alt" varchar(200),
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"brand" varchar(80),
	"description" text NOT NULL,
	"category_id" uuid NOT NULL,
	"price_mrp" integer NOT NULL,
	"price_sale" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"rating_avg" real DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"attributes" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "product_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(200),
	"body" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" varchar(200) NOT NULL,
	"result_count" integer DEFAULT 0 NOT NULL,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"courier" varchar(40) NOT NULL,
	"tracking" varchar(80) NOT NULL,
	"status" "shipment_status" DEFAULT 'pending' NOT NULL,
	"current_lat" real,
	"current_lng" real,
	"eta_minutes" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" varchar(80) NOT NULL,
	"email" varchar(200) NOT NULL,
	"name" varchar(200),
	"phone" varchar(20),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlists" (
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wishlists_user_id_product_id_pk" PRIMARY KEY("user_id","product_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_session_id_ai_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."ai_chat_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_chat_sessions" ADD CONSTRAINT "ai_chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_email_idx" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_user_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_cat_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_product_idx" ON "reviews" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_clerk_idx" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");