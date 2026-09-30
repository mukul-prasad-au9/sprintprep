import type { AiRoadmap } from "@/lib/ai/schemas";
import type { ContentSummary } from "@/lib/ai/provider";
import { DAY_NAMES } from "@/lib/utils";

export const CAPACITY_BUFFER = 0.85;

export function dailyCapacityMinutes(hoursPerDay: number): number {
  return Math.floor(hoursPerDay * 60 * CAPACITY_BUFFER);
}

export interface ScheduledTicket {
  contentId: string;
  estimatedMinutes: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  weekNumber: number;
  dayNumber: number;
}

export interface ScheduleResult {
  tickets: ScheduledTicket[];
  rejectedContentIds: string[];
  overloadedDays: { weekNumber: number; dayNumber: number; planned: number; capacity: number }[];
}

/**
 * Deterministic scheduler: validates AI content IDs, respects capacity & study days,
 * and spills overflow tickets to later available days.
 */
export function scheduleRoadmap(params: {
  plan: AiRoadmap;
  contentById: Map<string, ContentSummary>;
  preferredStudyDays: string[];
  hoursPerDay: number;
}): ScheduleResult {
  const capacity = dailyCapacityMinutes(params.hoursPerDay);
  const studySet = new Set(params.preferredStudyDays);
  const rejectedContentIds: string[] = [];
  const overloadedDays: ScheduleResult["overloadedDays"] = [];

  // Flatten AI tickets, drop invalid IDs
  type Raw = {
    contentId: string;
    estimatedMinutes: number;
    priority: "HIGH" | "MEDIUM" | "LOW";
    weekNumber: number;
    dayNumber: number;
  };

  const queue: Raw[] = [];

  for (const week of params.plan.weeks) {
    for (const day of week.days) {
      const dayName = DAY_NAMES[day.dayNumber - 1];
      for (const t of day.tickets) {
        const content = params.contentById.get(t.contentId);
        if (!content) {
          rejectedContentIds.push(t.contentId);
          continue;
        }
        if (!dayName || !studySet.has(dayName)) {
          // Push to a holding queue for that week on first study day
          queue.push({
            contentId: t.contentId,
            estimatedMinutes: t.estimatedMinutes ?? content.estimatedMinutes,
            priority: t.priority ?? "MEDIUM",
            weekNumber: week.weekNumber,
            dayNumber: findFirstStudyDayNumber(params.preferredStudyDays) ?? 1,
          });
          continue;
        }
        queue.push({
          contentId: t.contentId,
          estimatedMinutes: t.estimatedMinutes ?? content.estimatedMinutes,
          priority: t.priority ?? "MEDIUM",
          weekNumber: week.weekNumber,
          dayNumber: day.dayNumber,
        });
      }
    }
  }

  // Build day slots
  const dayLoad = new Map<string, number>();
  const placed: ScheduledTicket[] = [];
  const spill: Raw[] = [];

  const key = (w: number, d: number) => `${w}-${d}`;

  const maxWeek = Math.max(...params.plan.weeks.map((w) => w.weekNumber), 1);
  const studyDayNumbers = DAY_NAMES.map((name, idx) =>
    studySet.has(name) ? idx + 1 : null
  ).filter((n): n is number => n !== null);

  function tryPlace(ticket: Raw, fromWeek: number, fromDay: number): boolean {
    for (let w = fromWeek; w <= maxWeek; w++) {
      const startDay = w === fromWeek ? fromDay : studyDayNumbers[0] ?? 1;
      for (const d of studyDayNumbers) {
        if (w === fromWeek && d < startDay) continue;
        const k = key(w, d);
        const used = dayLoad.get(k) ?? 0;
        if (used + ticket.estimatedMinutes <= capacity) {
          dayLoad.set(k, used + ticket.estimatedMinutes);
          placed.push({
            contentId: ticket.contentId,
            estimatedMinutes: ticket.estimatedMinutes,
            priority: ticket.priority,
            weekNumber: w,
            dayNumber: d,
          });
          return true;
        }
      }
    }
    return false;
  }

  // Priority sort: HIGH first within same intended day
  const priorityWeight = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  queue.sort((a, b) => {
    if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber;
    if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });

  for (const ticket of queue) {
    const k = key(ticket.weekNumber, ticket.dayNumber);
    const used = dayLoad.get(k) ?? 0;
    if (studyDayNumbers.includes(ticket.dayNumber) && used + ticket.estimatedMinutes <= capacity) {
      dayLoad.set(k, used + ticket.estimatedMinutes);
      placed.push(ticket);
    } else {
      spill.push(ticket);
    }
  }

  for (const ticket of spill) {
    const nextDayIdx = studyDayNumbers.findIndex((d) => d > ticket.dayNumber);
    const startDay =
      nextDayIdx >= 0 ? studyDayNumbers[nextDayIdx]! : studyDayNumbers[0] ?? ticket.dayNumber;
    const startWeek = nextDayIdx >= 0 ? ticket.weekNumber : ticket.weekNumber + 1;
    const ok = tryPlace(ticket, startWeek, startDay);
    if (!ok) {
      overloadedDays.push({
        weekNumber: ticket.weekNumber,
        dayNumber: ticket.dayNumber,
        planned: (dayLoad.get(key(ticket.weekNumber, ticket.dayNumber)) ?? 0) + ticket.estimatedMinutes,
        capacity,
      });
      // Still attach to original day but flag overload tracking
      placed.push(ticket);
      const k = key(ticket.weekNumber, ticket.dayNumber);
      dayLoad.set(k, (dayLoad.get(k) ?? 0) + ticket.estimatedMinutes);
    }
  }

  for (const [k, planned] of dayLoad) {
    if (planned > capacity) {
      const [w, d] = k.split("-").map(Number);
      overloadedDays.push({ weekNumber: w!, dayNumber: d!, planned, capacity });
    }
  }

  return { tickets: placed, rejectedContentIds: [...new Set(rejectedContentIds)], overloadedDays };
}

function findFirstStudyDayNumber(preferredStudyDays: string[]): number | null {
  for (let i = 0; i < DAY_NAMES.length; i++) {
    if (preferredStudyDays.includes(DAY_NAMES[i]!)) return i + 1;
  }
  return null;
}

export interface SpilloverMoveResult {
  success: boolean;
  toSprintDayId?: string;
  reason: string;
  needsReplan?: boolean;
}

/**
 * Find the next sprint day with enough remaining capacity for a ticket.
 */
export function findSpilloverTarget(days: {
  id: string;
  date: Date;
  isStudyDay: boolean;
  capacityMin: number;
  plannedMin: number;
  status: string;
}[], ticketMinutes: number, afterDate: Date): SpilloverMoveResult {
  const candidates = days
    .filter((d) => d.isStudyDay && d.date > afterDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  for (const day of candidates) {
    if (day.plannedMin + ticketMinutes <= day.capacityMin) {
      return {
        success: true,
        toSprintDayId: day.id,
        reason: `Moved to day with ${day.capacityMin - day.plannedMin} min remaining.`,
      };
    }
  }

  return {
    success: false,
    reason: "No remaining capacity in upcoming study days.",
    needsReplan: true,
  };
}
