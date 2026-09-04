import { Queue, Worker, type JobsOptions } from "bullmq";
import { redis } from "../redis";
import { sendBrevoEmail } from "../email/brevo";

let emailQueue: Queue | null = null;
let imageQueue: Queue | null = null;
let indexQueue: Queue | null = null;
let shipmentQueue: Queue | null = null;

export async function initQueues() {
  emailQueue = new Queue("email", { connection: redis() });
  imageQueue = new Queue("image-process", { connection: redis() });
  indexQueue = new Queue("index-product", { connection: redis() });
  shipmentQueue = new Queue("shipment-track", { connection: redis() });

  new Worker(
    "email",
    async (job) => {
      const { template, to, data } = job.data as {
        template: string;
        to: string;
        data: Record<string, unknown>;
      };
      await sendBrevoEmail(template, to, data);
    },
    { connection: redis() },
  );

  new Worker(
    "image-process",
    async (job) => {
      const { publicId } = job.data as { publicId: string };
      // Cloudinary eager transforms are best done at upload-time; this is
      // a hook for re-deriving thumbnails / generating AVIF.
      console.log("[image-process] processed", publicId);
    },
    { connection: redis() },
  );

  new Worker(
    "index-product",
    async (job) => {
      const { productId } = job.data as { productId: string };
      console.log("[index-product] re-indexed", productId);
    },
    { connection: redis() },
  );

  new Worker(
    "shipment-track",
    async (job) => {
      const { shipmentId } = job.data as { shipmentId: string };
      console.log("[shipment-track] tick", shipmentId);
    },
    { connection: redis(), concurrency: 4 },
  );

  console.log("[queues] workers ready");
}

const defaultOpts: JobsOptions = {
  removeOnComplete: 500,
  removeOnFail: 1000,
  attempts: 5,
  backoff: { type: "exponential", delay: 2_000 },
};

export async function enqueueEmail(
  template: "order-created" | "order-paid" | "order-shipped" | "order-delivered",
  data: Record<string, unknown>,
) {
  if (!emailQueue) throw new Error("Queues not initialised");
  const to = (data.email as string) ?? "";
  await emailQueue.add(template, { template, to, data }, defaultOpts);
}
