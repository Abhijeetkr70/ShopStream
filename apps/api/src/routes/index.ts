import { Router } from "express";
import { productsRouter } from "./products";
import { categoriesRouter } from "./categories";
import { cartRouter } from "./cart";
import { ordersRouter } from "./orders";
import { authRouter } from "./auth";
import { searchRouter } from "./search";
import { wishlistRouter } from "./wishlist";
import { aiRouter } from "./ai";
import { clerkWebhook } from "../webhooks/clerk";
import { razorpayWebhook } from "../webhooks/razorpay";

export const router = Router();

router.get("/", (_req, res) =>
  res.json({ name: "ShopStream API", version: "v1", ok: true }),
);

router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/auth", authRouter);
router.use("/search", searchRouter);
router.use("/wishlist", wishlistRouter);
router.use("/ai", aiRouter);

// Webhooks mounted under /api/v1/webhooks (signature-verified).
router.post("/webhooks/clerk", clerkWebhook);
router.post("/webhooks/razorpay", razorpayWebhook);
