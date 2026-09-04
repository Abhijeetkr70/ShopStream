const API_KEY = process.env.BING_API_KEY;
const SITE_URL = process.env.BING_SITE_URL ?? "https://shopstream.app";

export async function submitUrls(urls: string[]): Promise<{ ok: boolean; status?: number; body?: string }> {
  if (!API_KEY) {
    console.warn("[bing] BING_API_KEY not set, skipping submit");
    return { ok: false };
  }
  if (urls.length === 0) return { ok: true };
  const fullUrls = urls.map((u) => (u.startsWith("http") ? u : `${SITE_URL.replace(/\/$/, "")}${u.startsWith("/") ? "" : "/"}${u}`));
  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/SubmitUrlbatch?apikey=${encodeURIComponent(API_KEY)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ siteUrl: SITE_URL, urlList: fullUrls }),
      },
    );
    const body = await res.text();
    if (!res.ok) {
      console.error("[bing]", res.status, body);
      return { ok: false, status: res.status, body };
    }
    console.log(`[bing] submitted ${fullUrls.length} url(s)`);
    return { ok: true, status: res.status, body };
  } catch (err) {
    console.error("[bing] network error", err);
    return { ok: false };
  }
}
