import type { Express } from "express";
import type { Router } from "express";
import { Router as makeRouter } from "express";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../config";

const hasB2 =
  !!env.B2_ENDPOINT && !!env.B2_KEY_ID && !!env.B2_APP_KEY && !!env.B2_BUCKET;

let s3: S3Client | null = null;
function client(): S3Client {
  if (s3) return s3;
  s3 = new S3Client({
    endpoint: env.B2_ENDPOINT as string,
    region: "us-west-004",
    credentials: {
      accessKeyId: env.B2_KEY_ID as string,
      secretAccessKey: env.B2_APP_KEY as string,
    },
    forcePathStyle: true,
  });
  return s3;
}

export function mountBackblaze(app: Express) {
  const r: Router = makeRouter();

  r.put("/storage/b2/:key", async (req, res) => {
    if (!hasB2) return res.status(503).json({ error: "Backblaze B2 not configured (mock mode)" });
    const key = decodeURIComponent(req.params.key);
    const body = req.body as Buffer;
    await client().send(
      new PutObjectCommand({
        Bucket: env.B2_BUCKET as string,
        Key: key,
        Body: body,
        ContentType: req.header("content-type") ?? "application/octet-stream",
      }),
    );
    res.json({ ok: true, key });
  });

  r.get("/storage/b2/:key", async (req, res) => {
    if (!hasB2) return res.status(503).json({ error: "Backblaze B2 not configured (mock mode)" });
    const out = await client().send(
      new GetObjectCommand({ Bucket: env.B2_BUCKET as string, Key: decodeURIComponent(req.params.key) }),
    );
    res.setHeader("content-type", out.ContentType ?? "application/octet-stream");
    (out.Body as unknown as { transformToByteArray: () => Promise<Uint8Array> })
      .transformToByteArray()
      .then((buf) => res.end(Buffer.from(buf)));
  });

  app.use("/api/v1", r);
}
