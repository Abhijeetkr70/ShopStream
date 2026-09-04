import { env } from "../config";

const SYSTEM =
  "You are ShopStream's assistant. Be concise (≤80 words). Recommend from the catalog when relevant. Never invent prices or stock levels.";

async function callGroq(message: string): Promise<string> {
  if (!env.GROQ_API_KEY) return "";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM },
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
  if (!env.NVIDIA_NIM_API_KEY) return "";
  const base = "https://integrate.api.nvidia.com/v1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.NVIDIA_NIM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: SYSTEM },
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

export async function chat(message: string): Promise<{ reply: string; model: string }> {
  let reply = await callGroq(message);
  if (reply) return { reply, model: "groq" };
  reply = await callNvidiaNim(message);
  if (reply) return { reply, model: "nvidia-nim" };
  return {
    reply: `I'm offline right now (no AI keys configured). You asked: "${message}". Try the search bar or browse categories.`,
    model: "fallback",
  };
}
