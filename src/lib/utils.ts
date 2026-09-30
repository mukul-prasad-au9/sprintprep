import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function parseJsonObject<T extends Record<string, unknown>>(
  value: string | null | undefined,
  fallback: T
): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type DayName = (typeof DAY_NAMES)[number];

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatHoursMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function skillBar(score: number): string {
  const filled = Math.round(score / 10);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function ticketCode(category: string, contentId: string): string {
  if (contentId.startsWith("day-")) {
    const parts = contentId.match(/w(\d+)-d(\d+)/);
    if (parts) {
      return `DAY-W${parts[1]!.padStart(2, "0")}D${parts[2]}`;
    }
    return "DAY";
  }
  const prefix =
    category === "DSA"
      ? "DSA"
      : category === "LLD"
        ? "LLD"
        : category === "HLD"
          ? "HLD"
          : category === "REVISION"
            ? "REV"
            : category === "MOCK"
              ? "MOCK"
              : category === "MIXED"
                ? "DAY"
                : "TKT";
  const num = contentId.replace(/\D/g, "").padStart(3, "0") || "000";
  return `${prefix}-${num}`;
}

export function categoryTone(
  category: string
): "dsa" | "lld" | "hld" | "rev" | "mock" | "outline" | "default" {
  if (category === "DSA") return "dsa";
  if (category === "LLD") return "lld";
  if (category === "HLD") return "hld";
  if (category === "REVISION") return "rev";
  if (category === "MOCK") return "mock";
  if (category === "MIXED") return "default";
  return "outline";
}

export function statusLabel(status: string): string {
  switch (status) {
    case "DONE":
      return "COMPLETED";
    case "IN_PROGRESS":
      return "IN PROGRESS";
    case "SPILLED":
      return "SPILLOVER";
    case "SKIPPED":
      return "SKIPPED";
    default:
      return "TODO";
  }
}
