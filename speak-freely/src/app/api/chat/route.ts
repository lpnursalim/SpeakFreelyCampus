import OpenAI from "openai";
import SYSTEM_PROMPT_RAW from "@/lib/prompt";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

const MOCK = process.env.MOCK_AI === "1";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const incoming = Array.isArray(body?.messages) ? body.messages : [];

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/New_York",
    });
    const SYSTEM_PROMPT = SYSTEM_PROMPT_RAW.replace("{{today}}", today);

    const sanitized = incoming.filter(
      (m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
    );

    const LAST_TURNS = 8;
    const trimmed = sanitized.slice(-LAST_TURNS);

    // Final message array with our system prompt at the top
    const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed] as const;

    if (MOCK) {
      return new Response(
        JSON.stringify({
          role: "assistant",
          content:
            "👋 (Mock reply) Ask me about UGA's Freedom of Expression policy. This is a local test.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [...messages],
    });
    

    const msg =
      completion.choices?.[0]?.message ?? {
        role: "assistant",
        content: "Thanks! I’m thinking…",
      };

    return new Response(JSON.stringify(msg), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const code = err?.code || err?.error?.code || err?.type || "unknown_error";
    const message =
      err?.error?.message || err?.message || "Unexpected server error.";

    console.error("Chat route error:", {
      status,
      code,
      message,
      requestID: err?.requestID,
    });

    if (code === "insufficient_quota") {
      return new Response(
        JSON.stringify({
          ok: false,
          code,
          message:
            "The AI service is temporarily unavailable for this project (quota exceeded). Please try again later or use the external assistant.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    if (code === "rate_limit_exceeded") {
      const retryAfter = err?.headers?.get?.("retry-after") ?? "3";
      return new Response(
        JSON.stringify({
          ok: false,
          code,
          message: "We’re getting a lot of requests right now. Please try again in a few seconds.",
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", "Retry-After": retryAfter },
        }
      );
    }

    if (code === "model_not_found" || code?.includes("access")) {
      return new Response(
        JSON.stringify({
          ok: false,
          code,
          message:
            "This model isn’t enabled for the current project. Ask the admin to allow gpt-4o-mini (or switch models).",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ ok: false, code, message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
