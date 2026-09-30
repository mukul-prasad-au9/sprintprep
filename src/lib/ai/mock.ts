import type {
  AiProvider,
  ContentSummary,
  GeneratePlanInput,
  PlannerProfile,
  ReplanInput,
  SprintReviewInput,
} from "./provider";
import type { AiRoadmap, ReplanResponse, SkillAnalysis, SprintReviewAi } from "./schemas";

const LEVEL_SCORE: Record<string, number> = {
  Beginner: 35,
  Intermediate: 65,
  Advanced: 85,
};

function byCategory(content: ContentSummary[], category: string) {
  return content.filter((c) => c.category === category);
}

function byTopic(items: ContentSummary[], topics: string[]) {
  const set = new Set(topics.map((t) => t.toLowerCase()));
  return items.filter((i) => set.has(i.topic.toLowerCase()));
}

function excludeTopics(items: ContentSummary[], topics: string[]) {
  const set = new Set(topics.map((t) => t.toLowerCase()));
  return items.filter((i) => !set.has(i.topic.toLowerCase()));
}

function pick(items: ContentSummary[], n: number, used: Set<string>): ContentSummary[] {
  const result: ContentSummary[] = [];
  for (const item of items) {
    if (result.length >= n) break;
    if (used.has(item.id)) continue;
    used.add(item.id);
    result.push(item);
  }
  return result;
}

function difficultyOrder(d: string): number {
  if (d === "EASY") return 0;
  if (d === "MEDIUM") return 1;
  return 2;
}

function sortForProgression(items: ContentSummary[]): ContentSummary[] {
  return [...items].sort((a, b) => {
    const d = difficultyOrder(a.difficulty) - difficultyOrder(b.difficulty);
    if (d !== 0) return d;
    return a.title.localeCompare(b.title);
  });
}

const WEEK_THEMES: { title: string; dsaTopics: string[]; lld: boolean; hld: boolean; focus?: string }[] = [
  { title: "Arrays + Hashing + OOP", dsaTopics: ["Arrays", "Hashing"], lld: true, hld: false, focus: "OOP" },
  { title: "Strings + Two Pointers + SOLID", dsaTopics: ["Strings", "Two Pointers"], lld: true, hld: false, focus: "SOLID" },
  { title: "Sliding Window + Stack + Patterns", dsaTopics: ["Sliding Window", "Stack", "Queue"], lld: true, hld: false },
  { title: "Linked List + Binary Search", dsaTopics: ["Linked List", "Binary Search"], lld: true, hld: false },
  { title: "Trees + BST + Class Design", dsaTopics: ["Trees", "BST"], lld: true, hld: false },
  { title: "Heap + Greedy + Patterns", dsaTopics: ["Heap", "Priority Queue", "Greedy"], lld: true, hld: false },
  { title: "Graphs Foundations", dsaTopics: ["Graphs"], lld: true, hld: false, focus: "Graphs" },
  { title: "Advanced Graphs + LLD Systems", dsaTopics: ["Graphs"], lld: true, hld: false, focus: "Graphs" },
  { title: "DP Foundations + LLD", dsaTopics: ["Dynamic Programming", "Recursion"], lld: true, hld: false, focus: "DP" },
  { title: "Advanced DP + Design Patterns", dsaTopics: ["Dynamic Programming"], lld: true, hld: false, focus: "DP" },
  { title: "Trie + Intervals + HLD Intro", dsaTopics: ["Trie", "Intervals", "Bit Manipulation"], lld: false, hld: true },
  { title: "HLD Foundations", dsaTopics: ["Backtracking"], lld: false, hld: true },
  { title: "Distributed Systems + Caching", dsaTopics: ["Graphs", "Dynamic Programming"], lld: false, hld: true },
  { title: "System Design Deep Dive", dsaTopics: ["Trees", "Graphs"], lld: true, hld: true },
  { title: "Mocks + Weak Area Drill", dsaTopics: ["Graphs", "Dynamic Programming"], lld: true, hld: true },
  { title: "Final Revision + Mock Interviews", dsaTopics: ["Arrays", "Trees", "Graphs", "Dynamic Programming"], lld: true, hld: true },
];

function ticketsPerStudyDay(hoursPerDay: number): number {
  const capacity = Math.floor(hoursPerDay * 60 * 0.85);
  // aim ~40 min average ticket
  return Math.max(2, Math.min(5, Math.floor(capacity / 40)));
}

export class MockAiProvider implements AiProvider {
  readonly name = "mock";

  async generateRoadmap(input: GeneratePlanInput): Promise<AiRoadmap> {
    const { profile, content } = input;
    const used = new Set<string>();
    const weeksCount = profile.durationWeeks;
    const studyDays = profile.preferredStudyDays;
    const perDay = ticketsPerStudyDay(profile.hoursPerDay);

    const dsaAll = sortForProgression(byCategory(content, "DSA"));
    const lldConcepts = sortForProgression(
      byCategory(content, "LLD").filter((c) => c.tags.includes("concept") || !c.tags.includes("practical"))
    );
    const lldPractical = sortForProgression(
      byCategory(content, "LLD").filter((c) => c.tags.includes("practical"))
    );
    const hldConcepts = sortForProgression(
      byCategory(content, "HLD").filter((c) => c.tags.includes("concept") || !c.tags.includes("practical"))
    );
    const hldPractical = sortForProgression(
      byCategory(content, "HLD").filter((c) => c.tags.includes("practical"))
    );
    const mocks = byCategory(content, "MOCK");
    const revisions = byCategory(content, "REVISION");

    // Prioritize weak topics
    const weakDsa = sortForProgression(byTopic(dsaAll, profile.topicsWeak));
    const completedSkip = new Set(profile.topicsCompleted.map((t) => t.toLowerCase()));

    const weeks = [];
    for (let w = 1; w <= weeksCount; w++) {
      const theme = WEEK_THEMES[(w - 1) % WEEK_THEMES.length];
      const days = [];

      for (let d = 1; d <= 7; d++) {
        const dayName = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ][d - 1];

        if (!studyDays.includes(dayName)) {
          days.push({ dayNumber: d, tickets: [] });
          continue;
        }

        const dayTickets: { contentId: string; estimatedMinutes?: number; priority: "HIGH" | "MEDIUM" | "LOW" }[] = [];
        const target = perDay;

        // DSA focus
        const topicPool = sortForProgression([
          ...byTopic(dsaAll, theme.dsaTopics),
          ...weakDsa,
          ...excludeTopics(dsaAll, [...profile.topicsCompleted]),
        ]);

        const dsaPickCount = theme.hld && !theme.lld ? Math.ceil(target * 0.4) : Math.ceil(target * 0.55);
        const dsaPicks = pick(
          topicPool.filter((p) => !completedSkip.has(p.topic.toLowerCase()) || profile.topicsWeak.includes(p.topic)),
          dsaPickCount,
          used
        );

        for (const p of dsaPicks) {
          dayTickets.push({
            contentId: p.id,
            estimatedMinutes: p.estimatedMinutes,
            priority: profile.topicsWeak.some((t) => t.toLowerCase() === p.topic.toLowerCase())
              ? "HIGH"
              : "MEDIUM",
          });
        }

        if (theme.lld && dayTickets.length < target) {
          const pool = w <= 4 ? lldConcepts : [...lldConcepts, ...lldPractical];
          const picks = pick(pool, 1, used);
          for (const p of picks) {
            dayTickets.push({
              contentId: p.id,
              estimatedMinutes: p.estimatedMinutes,
              priority: profile.lldLevel === "Beginner" ? "HIGH" : "MEDIUM",
            });
          }
        }

        if (theme.hld && dayTickets.length < target) {
          const pool = w < 12 ? hldConcepts : [...hldConcepts, ...hldPractical];
          const picks = pick(pool, 1, used);
          for (const p of picks) {
            dayTickets.push({
              contentId: p.id,
              estimatedMinutes: p.estimatedMinutes,
              priority: profile.hldLevel === "Beginner" ? "HIGH" : "MEDIUM",
            });
          }
        }

        // Revision every few days
        if (d % 3 === 0 && revisions.length > 0 && dayTickets.length < target) {
          const rev = pick(revisions, 1, used);
          for (const p of rev) {
            dayTickets.push({
              contentId: p.id,
              estimatedMinutes: p.estimatedMinutes,
              priority: "LOW",
            });
          }
        }

        // Final weeks: mocks
        if (w >= weeksCount - 1 && mocks.length > 0 && d === studyDays.indexOf(studyDays[0]) + 1) {
          const m = pick(mocks, 1, used);
          for (const p of m) {
            dayTickets.push({
              contentId: p.id,
              estimatedMinutes: p.estimatedMinutes,
              priority: "HIGH",
            });
          }
        }

        // Fill remaining with DSA
        if (dayTickets.length < target) {
          const fillers = pick(dsaAll, target - dayTickets.length, used);
          for (const p of fillers) {
            dayTickets.push({
              contentId: p.id,
              estimatedMinutes: p.estimatedMinutes,
              priority: "LOW",
            });
          }
        }

        days.push({ dayNumber: d, tickets: dayTickets });
      }

      weeks.push({
        weekNumber: w,
        title: theme.title,
        objective: `Build confidence in ${theme.dsaTopics.join(", ")}${theme.focus ? ` with focus on ${theme.focus}` : ""}.`,
        days,
      });
    }

    return { weeks };
  }

  async replan(input: ReplanInput): Promise<ReplanResponse> {
    const weak = input.profile.topicsWeak;
    return {
      summary:
        "Deterministic replan: reinforce weak topics from spillover and reduce lower-priority breadth next week.",
      adjustments: input.futureWeekNumbers.slice(0, 2).map((weekNumber, idx) => ({
        weekNumber,
        action: "INCREASE_FOCUS" as const,
        topic: weak[idx % Math.max(weak.length, 1)] ?? "Graphs",
        contentIds: input.spilledContentIds.slice(0, 3),
        reason: "Spillover and incomplete tickets indicate need for more practice on this topic.",
      })),
      suggestedSprintTitles: input.futureWeekNumbers.slice(0, 2).map((weekNumber) => ({
        weekNumber,
        title: `Reinforcement · ${weak[0] ?? "Core DSA"}`,
        objective: "Recover spilled work and deepen weak areas without overloading capacity.",
      })),
    };
  }

  async generateSprintReview(input: SprintReviewInput): Promise<SprintReviewAi> {
    const rate = input.total === 0 ? 0 : input.completed / input.total;
    const insights: string[] = [
      rate >= 0.8
        ? "Strong sprint completion rate — pacing looks sustainable."
        : "Completion dipped below target; expect spillover into the next sprint.",
    ];
    if (input.spilledCount > 0) {
      insights.push(`${input.spilledCount} tickets spilled — consider trimming daily volume slightly.`);
    }
    if (input.weakTopics.length) {
      insights.push(`Weak topics needing attention: ${input.weakTopics.join(", ")}.`);
    }
    const suggestions = [
      "Increase practice on incomplete categories next sprint.",
      "Keep LLD volume stable if those tickets finished near estimate.",
      "Add one timed DSA session if medium problems ran long.",
    ];
    return { insights, suggestions };
  }

  async analyzeSkills(profile: PlannerProfile): Promise<SkillAnalysis> {
    const baseDsa = LEVEL_SCORE[profile.dsaLevel] ?? 50;
    const solvedBonus = Math.min(20, Math.floor(profile.problemsSolved / 20));
    const weakPenalty = Math.min(15, profile.topicsWeak.length * 5);
    const dsaScore = Math.max(10, Math.min(95, baseDsa + solvedBonus - weakPenalty));
    const lldScore = LEVEL_SCORE[profile.lldLevel] ?? 40;
    const hldScore = LEVEL_SCORE[profile.hldLevel] ?? 30;
    const weakAreas = [
      ...profile.topicsWeak,
      ...(lldScore < 50 ? ["LLD class design"] : []),
      ...(hldScore < 50 ? ["Distributed systems"] : []),
    ];
    return {
      dsaScore,
      lldScore,
      hldScore,
      communication: 55,
      weakAreas: [...new Set(weakAreas)],
      notes: "Scores are estimated from your self-reported levels and history, not a formal assessment.",
    };
  }
}
