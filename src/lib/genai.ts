import { GoogleGenAI } from "@google/genai";
import { loadApiKey } from "./storage";
import type { SessionSummary } from "./types";

const SYSTEM_PROMPT = `Jsi Amelia AI, nestranná terapeutka pro páry. Tvým klientem je vztah, nikoliv jeden z partnerů.
Používej principy Gottmanova institutu: detekuj 4 jezdce apokalypsy (kritika, pohrdání, obrannost, stažení),
parafrázuj, validuj emoce a navrhuj deeskalační kroky. V krizových situacích (násilí, sebevražedné myšlenky,
sebepoškozování) poskytni bezpečnostní instrukce a nasměruj na krizové linky v ČR: 116 123 (Linka první psychické pomoci),
116 111 (Linka bezpečí), 112 (tísňová linka).`;

const responseSchema = {
  type: "object",
  properties: {
    topic: { type: "string" },
    summary: { type: "string" },
    insights: { type: "array", items: { type: "string" } },
    homework: { type: "string" },
    sentiment: { type: "string", enum: ["positive", "neutral", "critical"] }
  },
  required: ["topic", "summary", "insights", "homework", "sentiment"],
  additionalProperties: false
};

const getClient = () => {
  const apiKey =
    (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? loadApiKey() ?? undefined;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTranscript = async (transcript: string): Promise<SessionSummary | null> => {
  const client = getClient();
  if (!client) {
    return null;
  }

  const result = await client.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: transcript }] }],
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema
    }
  });

  const text = result.text ?? "";
  try {
    const parsed = JSON.parse(text) as Omit<SessionSummary, "id" | "date">;
    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...parsed
    };
  } catch {
    return null;
  }
};

export const getSystemPrompt = (): string => SYSTEM_PROMPT;
