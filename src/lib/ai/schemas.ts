import { z } from "zod";

export const PlanTicketSchema = z.object({
  contentId: z.string().min(1),
  estimatedMinutes: z.number().int().positive().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
});

export const PlanDaySchema = z.object({
  dayNumber: z.number().int().min(1).max(7),
  tickets: z.array(PlanTicketSchema),
});

export const PlanWeekSchema = z.object({
  weekNumber: z.number().int().positive(),
  title: z.string().min(1),
  objective: z.string().optional(),
  days: z.array(PlanDaySchema),
});

export const AiRoadmapSchema = z.object({
  weeks: z.array(PlanWeekSchema).min(1),
});

export type AiRoadmap = z.infer<typeof AiRoadmapSchema>;
export type PlanWeek = z.infer<typeof PlanWeekSchema>;
export type PlanDay = z.infer<typeof PlanDaySchema>;
export type PlanTicket = z.infer<typeof PlanTicketSchema>;

export const ReplanResponseSchema = z.object({
  summary: z.string(),
  adjustments: z.array(
    z.object({
      weekNumber: z.number().int().positive(),
      action: z.enum(["ADD", "REMOVE", "REPLACE", "INCREASE_FOCUS"]),
      contentIds: z.array(z.string()).optional(),
      topic: z.string().optional(),
      reason: z.string(),
    })
  ),
  suggestedSprintTitles: z
    .array(
      z.object({
        weekNumber: z.number().int().positive(),
        title: z.string(),
        objective: z.string().optional(),
      })
    )
    .optional(),
});

export type ReplanResponse = z.infer<typeof ReplanResponseSchema>;

export const SprintReviewAiSchema = z.object({
  insights: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export type SprintReviewAi = z.infer<typeof SprintReviewAiSchema>;

export const SkillAnalysisSchema = z.object({
  dsaScore: z.number().int().min(0).max(100),
  lldScore: z.number().int().min(0).max(100),
  hldScore: z.number().int().min(0).max(100),
  communication: z.number().int().min(0).max(100),
  weakAreas: z.array(z.string()),
  notes: z.string().optional(),
});

export type SkillAnalysis = z.infer<typeof SkillAnalysisSchema>;

export const ProfileInputSchema = z.object({
  name: z.string().min(1),
  yearsExperience: z.string().min(1),
  targetRole: z.string().min(1),
  targetCompanies: z.array(z.string()).min(1),
  durationWeeks: z.number().int().positive(),
  hoursPerDay: z.number().positive(),
  daysPerWeek: z.number().int().min(1).max(7),
  preferredStudyDays: z.array(z.string()).min(1),
  dsaLanguage: z.string().min(1),
  dsaLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  lldLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  hldLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  problemsSolved: z.number().int().min(0),
  topicsCompleted: z.array(z.string()),
  topicsWeak: z.array(z.string()),
  topicsNotStarted: z.array(z.string()),
  revisionIntervals: z.array(z.number().int().positive()).optional(),
});

export type ProfileInput = z.infer<typeof ProfileInputSchema>;
