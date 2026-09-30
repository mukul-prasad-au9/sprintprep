import { addDays, startOfDay } from "date-fns";
import { DAY_NAMES } from "@/lib/utils";
import { dailyCapacityMinutes } from "@/lib/scheduler";
import type { FlatTopic } from "./types";
import { subjectToCategory } from "./types";

export type DayPack = {
  weekNumber: number;
  dayNumber: number;
  dayName: string;
  date: Date;
  isStudyDay: boolean;
  items: FlatTopic[];
  plannedMin: number;
  title: string;
  category: string;
  topic: string;
  difficulty: string;
};

export type WeekPack = {
  weekNumber: number;
  title: string;
  objective: string;
  startDate: Date;
  endDate: Date;
  days: DayPack[];
};

/**
 * Pack flat syllabus topics into weeks/days using capacity.
 * One study day → one ticket worth of items.
 */
export function scheduleSyllabus(params: {
  topics: FlatTopic[];
  hoursPerDay: number;
  preferredStudyDays: string[];
  startDate?: Date;
}): WeekPack[] {
  const capacity = dailyCapacityMinutes(params.hoursPerDay);
  const studySet = new Set(params.preferredStudyDays);
  const start = startOfDay(params.startDate ?? new Date());

  // Build chronological study-day slots and fill greedily
  type Slot = {
    weekNumber: number;
    dayNumber: number;
    dayName: string;
    date: Date;
    items: FlatTopic[];
    plannedMin: number;
  };

  const studySlots: Slot[] = [];
  // Pre-create enough weeks (topics / rough capacity)
  const totalMin = params.topics.reduce((s, t) => s + t.estimatedMinutes, 0);
  const studyDaysPerWeek = Math.max(1, params.preferredStudyDays.length);
  const minPerWeek = capacity * studyDaysPerWeek;
  const weeksNeeded = Math.max(1, Math.ceil(totalMin / Math.max(minPerWeek, 1)) + 1);

  for (let w = 1; w <= weeksNeeded; w++) {
    for (let d = 1; d <= 7; d++) {
      const dayName = DAY_NAMES[d - 1]!;
      if (!studySet.has(dayName)) continue;
      const offset = (w - 1) * 7 + (d - 1);
      studySlots.push({
        weekNumber: w,
        dayNumber: d,
        dayName,
        date: addDays(start, offset),
        items: [],
        plannedMin: 0,
      });
    }
  }

  const extendWeek = () => {
    const lastWeek = studySlots[studySlots.length - 1]?.weekNumber ?? 0;
    const w = lastWeek + 1;
    for (let d = 1; d <= 7; d++) {
      const dayName = DAY_NAMES[d - 1]!;
      if (!studySet.has(dayName)) continue;
      const offset = (w - 1) * 7 + (d - 1);
      studySlots.push({
        weekNumber: w,
        dayNumber: d,
        dayName,
        date: addDays(start, offset),
        items: [],
        plannedMin: 0,
      });
    }
  };

  if (!studySlots.length) {
    throw new Error("No study days selected — cannot schedule syllabus.");
  }

  let slotIdx = 0;
  for (const topic of params.topics) {
    // Find a slot that fits (empty slots always accept)
    for (;;) {
      while (slotIdx >= studySlots.length) {
        extendWeek();
      }
      const slot = studySlots[slotIdx]!;
      const fits =
        slot.plannedMin === 0 ||
        slot.plannedMin + topic.estimatedMinutes <= capacity;
      if (fits) {
        slot.items.push(topic);
        slot.plannedMin += topic.estimatedMinutes;
        if (slot.plannedMin >= capacity) slotIdx += 1;
        break;
      }
      slotIdx += 1;
    }
  }

  const maxWeek = Math.max(...studySlots.map((s) => s.weekNumber), 1);
  const weeks: WeekPack[] = [];

  for (let w = 1; w <= maxWeek; w++) {
    const weekSlots = studySlots.filter((s) => s.weekNumber === w);
    const filled = weekSlots.filter((s) => s.items.length > 0);
    if (!filled.length && w > 1) continue;

    const topicNames = [
      ...new Set(filled.flatMap((s) => s.items.map((i) => i.categoryName))),
    ];
    const title =
      topicNames.length === 0
        ? `Week ${w}`
        : topicNames.length <= 2
          ? topicNames.join(" + ")
          : `${topicNames.slice(0, 2).join(" + ")} + more`;

    const days: DayPack[] = [];
    for (let d = 1; d <= 7; d++) {
      const dayName = DAY_NAMES[d - 1]!;
      const offset = (w - 1) * 7 + (d - 1);
      const date = addDays(start, offset);
      const isStudyDay = studySet.has(dayName);
      const slot = weekSlots.find((s) => s.dayNumber === d);
      const items = slot?.items ?? [];
      const cats = [...new Set(items.map((i) => subjectToCategory(i.subjectSlug)))];
      const topics = [...new Set(items.map((i) => i.categoryName))];
      days.push({
        weekNumber: w,
        dayNumber: d,
        dayName,
        date,
        isStudyDay,
        items,
        plannedMin: slot?.plannedMin ?? 0,
        title:
          topics.length === 0
            ? dayName
            : topics.length <= 2
              ? topics.join(" + ")
              : `${topics.slice(0, 2).join(" + ")} + more`,
        category: cats.length === 1 ? cats[0]! : cats.length ? "MIXED" : "MIXED",
        topic: topics.join(", "),
        difficulty: items.some((i) => i.estimatedMinutes >= 40)
          ? "HARD"
          : items.some((i) => i.estimatedMinutes >= 20)
            ? "MEDIUM"
            : "EASY",
      });
    }

    weeks.push({
      weekNumber: w,
      title,
      objective: `Cover ${title} from your Planly syllabus.`,
      startDate: addDays(start, (w - 1) * 7),
      endDate: addDays(start, (w - 1) * 7 + 6),
      days,
    });
  }

  return weeks;
}
