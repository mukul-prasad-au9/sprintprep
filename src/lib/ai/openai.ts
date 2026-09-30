import OpenAI from "openai";
import { MockAiProvider } from "./mock";
import {
  SYSTEM_PROMPT,
  type AiProvider,
  type GeneratePlanInput,
  type ReplanInput,
  type SprintReviewInput,
  type PlannerProfile,
} from "./provider";
import {
  AiRoadmapSchema,
  ReplanResponseSchema,
  SkillAnalysisSchema,
  SprintReviewAiSchema,
  type AiRoadmap,
  type ReplanResponse,
  type SkillAnalysis,
  type SprintReviewAi,
} from "./schemas";

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1].trim() : trimmed;
  return JSON.parse(raw) as unknown;
}

export class OpenAIProvider implements AiProvider {
  readonly name = "openai";
  private client: OpenAI;
  private fallback = new MockAiProvider();

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  private async chat(prompt: string): Promise<string> {
    const res = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });
    return res.choices[0]?.message?.content ?? "{}";
  }

  private async withRepair<T>(prompt: string, parse: (data: unknown) => T): Promise<T> {
    const first = await this.chat(prompt);
    try {
      return parse(extractJson(first));
    } catch (err) {
      const repair = `${prompt}\n\nPrevious response invalid: ${err instanceof Error ? err.message : String(err)}\nReturn corrected JSON only.`;
      const second = await this.chat(repair);
      return parse(extractJson(second));
    }
  }

  async generateRoadmap(input: GeneratePlanInput): Promise<AiRoadmap> {
    const contentIds = input.content.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
      topic: c.topic,
      difficulty: c.difficulty,
      estimatedMinutes: c.estimatedMinutes,
      prerequisites: c.prerequisites,
    }));

    const prompt = `Generate a ${input.profile.durationWeeks}-week interview prep roadmap.
Profile: ${JSON.stringify(input.profile)}
Daily capacity ~${Math.floor(input.profile.hoursPerDay * 60 * 0.85)} minutes on: ${input.profile.preferredStudyDays.join(", ")}.
Content (USE ONLY THESE IDs): ${JSON.stringify(contentIds)}
Return JSON with weeks[].days[].tickets[] using only valid contentIds. dayNumber 1=Monday..7=Sunday.`;

    try {
      return await this.withRepair(prompt, (data) => AiRoadmapSchema.parse(data));
    } catch {
      return this.fallback.generateRoadmap(input);
    }
  }

  async replan(input: ReplanInput): Promise<ReplanResponse> {
    const prompt = `Replan FUTURE weeks only.
${JSON.stringify({
      profile: input.profile,
      completedTicketIds: input.completedTicketIds,
      missedContentIds: input.missedContentIds,
      spilledContentIds: input.spilledContentIds,
      studyMinutes: input.studyMinutes,
      remainingWeeks: input.remainingWeeks,
      futureWeekNumbers: input.futureWeekNumbers,
      validIds: input.content.map((c) => c.id),
    })}
Return { summary, adjustments, suggestedSprintTitles }.`;

    try {
      return await this.withRepair(prompt, (data) => ReplanResponseSchema.parse(data));
    } catch {
      return this.fallback.replan(input);
    }
  }

  async generateSprintReview(input: SprintReviewInput): Promise<SprintReviewAi> {
    const prompt = `Sprint review observations (not objective facts): ${JSON.stringify(input)}
Return { insights: string[], suggestions: string[] }.`;

    try {
      return await this.withRepair(prompt, (data) => SprintReviewAiSchema.parse(data));
    } catch {
      return this.fallback.generateSprintReview(input);
    }
  }

  async analyzeSkills(profile: PlannerProfile): Promise<SkillAnalysis> {
    const prompt = `Estimate skill scores 0-100 from profile (conservative): ${JSON.stringify(profile)}
Return { dsaScore, lldScore, hldScore, communication, weakAreas, notes }.`;

    try {
      return await this.withRepair(prompt, (data) => SkillAnalysisSchema.parse(data));
    } catch {
      return this.fallback.analyzeSkills(profile);
    }
  }
}
