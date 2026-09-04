import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@shopstream/db";
import { products } from "@shopstream/db/schema";
import { eq, sql } from "drizzle-orm";

const Body = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().uuid().optional(),
});

async function callGroq(message: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return "";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are ShopStream's assistant. Be concise (≤80 words). If asked about products, recommend from the catalog when relevant. Never invent prices.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 240,
    }),
  });
  if (!res.ok) return "";
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callNvidiaNim(message: string): Promise<string> {
  const key = process.env.NVIDIA_NIM_API_KEY;
  const base = process.env.NVIDIA_NIM_BASE_URL ?? "https://integrate.api.nvidia.com/v1";
  if (!key) return "";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are ShopStream's assistant. Be concise (≤80 words). Recommend from the catalog if relevant.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 240,
    }),
  });
  if (!res.ok) return "";
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

const FALLBACK = (q: string) =>
  `Hi! I'm ShopStream's assistant (Groq/NVIDIA NIM offline right now). You asked: "${q}". Try searching the catalog or browse categories — I'll be back online in a moment.`;

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const { message } = parsed.data;

  // Optional: record the message in ai_chat_messages table.
  try {
    await db.execute(
      sql`INSERT INTO ai_chat_messages (session_id, role, content, model) VALUES ((SELECT id FROM ai_chat_sessions ORDER BY started_at DESC LIMIT 1), 'user', ${message}, NULL)`,
    );
  } catch {
    /* sessions table may be empty; ignore for v1 */
  }

  let reply = "";
  let model = "groq";
  reply = await callGroq(message);
  if (!reply) {
    model = "nvidia-nim";
    reply = await callNvidiaNim(message);
  }
  if (!reply) {
    model = "fallback";
    reply = FALLBACK(message);
  }

  return NextResponse.json({ reply, model });
}
