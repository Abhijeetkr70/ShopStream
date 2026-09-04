import { z } from "zod";

const Schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32),
  CSRF_SECRET: z.string().min(32),
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_FROM_EMAIL: z.string().default("orders@shopstream.app"),
  BREVO_FROM_NAME: z.string().default("ShopStream"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  B2_ENDPOINT: z.string().optional(),
  B2_KEY_ID: z.string().optional(),
  B2_APP_KEY: z.string().optional(),
  B2_BUCKET: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  NVIDIA_NIM_API_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().default(""),
});

export const env = Schema.parse(process.env);
export const origins = () =>
  env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
