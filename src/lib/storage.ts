import type { SessionSummary, UserProfile } from "./types";

const PROFILE_KEY = "amelia.profile";
const HISTORY_KEY = "amelia.history";
const API_KEY_KEY = "amelia.apiKey";

export const loadProfile = (): UserProfile | null => {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const loadHistory = (): SessionSummary[] => {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as SessionSummary[]) : [];
};

export const saveHistory = (items: SessionSummary[]): void => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
};

export const loadApiKey = (): string | null => localStorage.getItem(API_KEY_KEY);

export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_KEY, apiKey);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_KEY);
};
