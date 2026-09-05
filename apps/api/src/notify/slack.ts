/**
 * Fire-and-forget Slack alert via Incoming Webhook.
 * No-op if SLACK_WEBHOOK_URL is missing.
 * Never throws — alerts must not block the request that triggered them.
 */
export async function slackAlert(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      console.error("[slack] non-2xx", res.status, await res.text());
    }
  } catch (e) {
    console.error("[slack] post failed", e);
  }
}
