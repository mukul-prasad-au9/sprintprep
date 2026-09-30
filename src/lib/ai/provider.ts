import type { AiRoadmap, ReplanResponse, SprintReviewAi, SkillAnalysis } from "./schemas";

export interface ContentSummary {
  id: string;
  title: string;
  category: string;
  topic: string;
  difficulty: string;
  estimatedMinutes: number;
  prerequisites: string[];
  tags: string[];
}

export interface PlannerProfile {
  name: string;
  yearsExperience: string;
  targetRole: string;
  targetCompanies: string[];
  durationWeeks: number;
  hoursPerDay: number;
  daysPerWeek: number;
  preferredStudyDays: string[];
  dsaLanguage: string;
  dsaLevel: string;
  lldLevel: string;
  hldLevel: string;
  problemsSolved: number;
  topicsCompleted: string[];
  topicsWeak: string[];
  topicsNotStarted: string[];
  skills?: {
    dsaScore: number;
    lldScore: number;
    hldScore: number;
    weakAreas: string[];
  };
}

export interface GeneratePlanInput {
  profile: PlannerProfile;
  content: ContentSummary[];
}

export interface ReplanInput {
  profile: PlannerProfile;
  originalRoadmapSummary: string;
  completedTicketIds: string[];
  missedContentIds: string[];
  spilledContentIds: string[];
  studyMinutes: number;
  remainingWeeks: number;
  content: ContentSummary[];
  futureWeekNumbers: number[];
}

export interface SprintReviewInput {
  weekNumber: number;
  title: string;
  completed: number;
  total: number;
  byCategory: Record<string, { completed: number; total: number }>;
  spilledCount: number;
  avgEstimatedVsActual?: string;
  weakTopics: string[];
}

export interface AiProvider {
  readonly name: string;
  generateRoadmap(input: GeneratePlanInput): Promise<AiRoadmap>;
  replan(input: ReplanInput): Promise<ReplanResponse>;
  generateSprintReview(input: SprintReviewInput): Promise<SprintReviewAi>;
  analyzeSkills(profile: PlannerProfile): Promise<SkillAnalysis>;
}

export const SYSTEM_PROMPT = `You are an interview preparation planning engine.

Create a realistic preparation roadmap for software engineering interviews.

You are given:
* user profile
* preparation duration
* available study time
* current skills
* weak areas
* interview content database

Rules:
1. Use only supplied content IDs.
2. Never invent content IDs.
3. Respect prerequisites.
4. Do not overload the user's daily capacity.
5. Balance DSA, LLD and HLD according to the user's profile.
6. Give additional attention to weak areas.
7. Progress from fundamentals to advanced topics.
8. Include revision.
9. Avoid unnecessary duplicate problems.
10. Use practical interview problems.
11. Include DSA problem links stored in the database.
12. Return valid JSON matching the requested schema.
13. Do not create URLs.
14. Never fabricate a LeetCode or GeeksforGeeks URL.
15. Do not claim that a company asks a problem unless that information is explicitly provided by the application.
16. Return ONLY valid JSON with no markdown fences.`;
