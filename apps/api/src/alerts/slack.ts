const WEBHOOK = process.env.SLACK_WEBHOOK_URL;

export async function slackAlert(text: string): Promise<void> {
  if (!WEBHOOK) return;
  try {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    // Fire-and-forget: never throw from an alert.
    console.error("[slack]", err);
  }
}
