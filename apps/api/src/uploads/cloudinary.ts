import type { Express } from "express";
import type { Router } from "express";
import { Router as makeRouter } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(png|jpe?g|webp|avif)$/.test(file.mimetype)) {
      cb(new Error("Unsupported image type"));
      return;
    }
    cb(null, true);
  },
});

export function mountCloudinary(app: Express) {
  const r: Router = makeRouter();

  r.post("/uploads/sign", async (req, res) => {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: "shopstream" },
      env.CLOUDINARY_API_SECRET,
    );
    res.json({
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder: "shopstream",
    });
  });

  r.post("/uploads", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "shopstream", resource_type: "image" },
          (err, r) => (err ? reject(err) : resolve(r as unknown as { secure_url: string; public_id: string })),
        );
        stream.end(req.file!.buffer);
      },
    );
    res.json({ url: result.secure_url, publicId: result.public_id });
  });

  app.use("/api/v1", r);
}
