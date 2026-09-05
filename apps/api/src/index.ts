import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { createServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import { env, origins } from "./config";
import { errorHandler } from "./middleware/error";
import { csrfProtection } from "./middleware/csrf";
import { attachUser } from "./middleware/auth";
import { router as apiRouter } from "./routes/index";
import { initQueues } from "./queues/index";
import { registerSocketHandlers } from "./sockets/index";
import { redis } from "./redis";
import { mountBackblaze } from "./storage/backblaze";
import { mountBrevo } from "./email/brevo";
import { mountRazorpay } from "./payments/razorpay";
import { mountCloudinary } from "./uploads/cloudinary";
import { healthz } from "./health";

const app = express();
const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: { origin: origins(), credentials: true },
});
registerSocketHandlers(io);

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false, // web app sets its own; API is JSON-only
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (origins().includes(origin)) return cb(null, true);
      cb(new Error("CORS blocked"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Rate limit (per-IP token bucket, Redis-backed via Upstash if you swap impl).
const limiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => req.ip ?? "unknown",
});
app.use("/api/", limiter);

app.get("/healthz", healthz);
app.get("/readyz", async (_req, res) => {
  try {
    await redis().ping();
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.use(attachUser);
app.use(csrfProtection);

mountBackblaze(app);
mountBrevo(app);
mountRazorpay(app);
mountCloudinary(app);

app.use("/api/v1", apiRouter);

app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
httpServer.listen(port, () => {
  console.log(`[api] listening on :${port}`);
  initQueues().catch((e) => console.error("queue init failed", e));
});
