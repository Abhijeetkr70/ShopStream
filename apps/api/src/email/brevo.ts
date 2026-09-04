import { env } from "../config";

const TEMPLATES: Record<string, { subject: string; html: (data: Record<string, unknown>) => string }> = {
  "order-created": {
    subject: "Your ShopStream order is confirmed",
    html: (d) => `<h1>Order ${d.orderId}</h1><p>We&apos;ve received your order and it&apos;s being prepared.</p>`,
  },
  "order-paid": {
    subject: "Payment received — your order is on the way",
    html: (d) => `<h1>Order ${d.orderId}</h1><p>Payment received. Packing has started.</p>`,
  },
  "order-shipped": {
    subject: "Your order has shipped",
    html: (d) => `<h1>Order ${d.orderId}</h1><p>Track your shipment from the Orders page.</p>`,
  },
  "order-delivered": {
    subject: "Delivered! How did we do?",
    html: (d) => `<h1>Order ${d.orderId}</h1><p>Thanks for shopping with ShopStream.</p>`,
  },
};

const isLive = !!env.BREVO_API_KEY && env.BREVO_API_KEY.startsWith("xkeysib-");

export async function sendBrevoEmail(
  template: keyof typeof TEMPLATES,
  to: string,
  data: Record<string, unknown>,
) {
  const t = TEMPLATES[template];
  if (!t || !to) return;

  if (!isLive) {
    console.warn(
      `[brevo:mock] -> to=${to} template=${template} subject="${t.subject}" data=${JSON.stringify(data)}`,
    );
    return;
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY as string,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: env.BREVO_FROM_NAME, email: env.BREVO_FROM_EMAIL },
        to: [{ email: to }],
        subject: t.subject,
        htmlContent: t.html(data),
      }),
    });
    if (!res.ok) console.error("[brevo]", res.status, await res.text());
  } catch (err) {
    console.error("[brevo] network error", err);
  }
}

export function mountBrevo(_app: unknown) {
  /* Brevo is invoked from the email queue worker; mount hook left for future webhook endpoints. */
}
