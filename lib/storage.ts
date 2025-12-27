import type { Feedback } from "./types";

const STORAGE_KEY = "p2p_feedback_v1";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getAllFeedback(): Feedback[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<Feedback[]>(localStorage.getItem(STORAGE_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

export function saveFeedback(item: Feedback) {
  if (typeof window === "undefined") return;
  const existing = getAllFeedback();
  existing.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function clearAllFeedback() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getFeedbackForUser(toUserId: string): Feedback[] {
  return getAllFeedback().filter((f) => f.toUserId === toUserId);
}

export function uid(prefix = "fb") {
  // quick unique id for demo
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
