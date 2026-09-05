const ENDPOINT = "https://ssl.bing.com/webmaster/api.svc/SubmitUrlbatch";

export interface BingResult {
  ok: boolean;
  status: number;
  body?: string;
}

/**
 * Submit a batch of URLs to Bing's URL Submission API.
 * Docs: https://www.bing.com/webmasters/help/url-submission-api
 *
 * No-op if BING_API_KEY or BING_SITE_URL is missing.
 * Quota: ~10k URLs/day per site.
 */
export async function submitUrls(urls: string[]): Promise<BingResult> {
  const key = process.env.BING_API_KEY;
  const site = process.env.BING_SITE_URL;
  if (!key || !site) {
    return { ok: true, status: 0, body: "skipped (missing BING_API_KEY or BING_SITE_URL)" };
  }
  if (urls.length === 0) {
    return { ok: true, status: 0, body: "skipped (no urls)" };
  }
  const url = `${ENDPOINT}?apikey=${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ siteUrl: site, urlList: urls }),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("[bing] non-2xx", res.status, text);
    } else {
      console.log("[bing] submitted", urls.length, "urls");
    }
    return { ok: res.ok, status: res.status, body: text };
  } catch (e) {
    console.error("[bing] request failed", e);
    return { ok: false, status: 0, body: String(e) };
  }
}
