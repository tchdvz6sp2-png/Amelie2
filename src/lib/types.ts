export interface UserProfile {
  partnerA: string;
  partnerB: string;
  relationshipLength: string;
  goals: string;
}

export interface SessionSummary {
  id: string;
  date: string;
  topic: string;
  summary: string;
  insights: string[];
  homework: string;
  sentiment: "positive" | "neutral" | "critical";
}

export interface TranscriptLine {
  speaker: "partner" | "amelia";
  text: string;
}
