import type { Express } from "express";
import type { Router } from "express";
import { Router as makeRouter } from "express";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config";

let s3: S3Client | null = null;
function client() {
  if (s3) return s3;
  s3 = new S3Client({
    endpoint: env.B2_ENDPOINT,
    region: "us-west-004",
    credentials: { accessKeyId: env.B2_KEY_ID, secretAccessKey: env.B2_APP_KEY },
    forcePathStyle: true,
  });
  return s3;
}

export function mountBackblaze(app: Express) {
  const r: Router = makeRouter();
  r.put("/storage/b2/:key", async (req, res) => {
    const key = decodeURIComponent(req.params.key);
    const body = req.body as Buffer;
    await client().send(
      new PutObjectCommand({
        Bucket: env.B2_BUCKET,
        Key: key,
        Body: body,
        ContentType: req.header("content-type") ?? "application/octet-stream",
      }),
    );
    res.json({ ok: true, key });
  });
  r.get("/storage/b2/:key", async (req, res) => {
    const out = await client().send(
      new GetObjectCommand({ Bucket: env.B2_BUCKET, Key: decodeURIComponent(req.params.key) }),
    );
    res.setHeader("content-type", out.ContentType ?? "application/octet-stream");
    (out.Body as unknown as { transformToByteArray: () => Promise<Uint8Array> })
      .transformToByteArray()
      .then((buf) => res.end(Buffer.from(buf)));
  });
  app.use("/api/v1", r);
}
