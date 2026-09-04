import { z } from "zod";

export const SlugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");

export const PriceSchema = z.object({
  mrp: z.number().int().positive(),
  sale: z.number().int().positive(),
  currency: z.literal("INR").default("INR"),
});

export const AddressSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().min(2).max(120),
  phone: z.string().regex(/^\+?\d{10,15}$/),
  line1: z.string().min(2).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  pincode: z.string().regex(/^\d{6}$/),
  country: z.literal("IN").default("IN"),
  isDefault: z.boolean().default(false),
  lat: z.number().optional(),
  lng: z.number().optional(),
});
export type Address = z.infer<typeof AddressSchema>;

export const CartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(99),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const ProductSchema = z.object({
  id: z.string().uuid(),
  slug: SlugSchema,
  title: z.string().min(2).max(200),
  brand: z.string().max(80).optional(),
  description: z.string().min(10).max(5000),
  categorySlug: SlugSchema,
  price: PriceSchema,
  stock: z.number().int().min(0),
  ratingAvg: z.number().min(0).max(5),
  ratingCount: z.number().int().min(0),
  images: z.array(z.string().url()).min(1),
  attributes: z.record(z.string(), z.string()).optional(),
  status: z.enum(["draft", "active", "archived"]).default("active"),
});
export type Product = z.infer<typeof ProductSchema>;

export const OrderStatus = z.enum([
  "created",
  "paid",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);
export type OrderStatus = z.infer<typeof OrderStatus>;

export const PaymentStatus = z.enum([
  "pending",
  "captured",
  "failed",
  "refunded",
]);
export type PaymentStatus = z.infer<typeof PaymentStatus>;

export const CategorySchema = z.object({
  id: z.string().uuid(),
  slug: SlugSchema,
  name: z.string().min(2).max(80),
  icon: z.string(),
  parentId: z.string().uuid().nullable(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ApiError = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiError>;

export const PaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    total: z.number().int().nonnegative(),
  });
