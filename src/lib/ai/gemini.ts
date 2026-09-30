import { GoogleGenerativeAI } from "@google/generative-ai";
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

export class GeminiProvider implements AiProvider {
  readonly name = "gemini";
  private model;
  private fallback = new MockAiProvider();

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
    });
  }

  private async generate(prompt: string): Promise<string> {
    const result = await this.model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt },
    ]);
    return result.response.text();
  }

  private async generateWithRepair<T>(
    prompt: string,
    parse: (data: unknown) => T
  ): Promise<T> {
    const first = await this.generate(prompt);
    try {
      return parse(extractJson(first));
    } catch (err) {
      const repairPrompt = `${prompt}

Previous response was invalid. Error: ${err instanceof Error ? err.message : String(err)}
Return corrected JSON only.`;
      const second = await this.generate(repairPrompt);
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

Profile:
${JSON.stringify(input.profile, null, 2)}

Daily capacity ~${Math.floor(input.profile.hoursPerDay * 60 * 0.85)} minutes on study days: ${input.profile.preferredStudyDays.join(", ")}.

Content database (USE ONLY THESE IDs):
${JSON.stringify(contentIds)}

Return JSON: { "weeks": [ { "weekNumber": 1, "title": "...", "objective": "...", "days": [ { "dayNumber": 1, "tickets": [ { "contentId": "...", "estimatedMinutes": 40, "priority": "HIGH" } ] } ] } ] }

Only include tickets on study days. dayNumber 1=Monday ... 7=Sunday. Empty tickets array for off days.`;

    try {
      return await this.generateWithRepair(prompt, (data) => AiRoadmapSchema.parse(data));
    } catch {
      return this.fallback.generateRoadmap(input);
    }
  }

  async replan(input: ReplanInput): Promise<ReplanResponse> {
    const prompt = `Replan FUTURE interview prep weeks only. Do not rewrite completed history.

Profile: ${JSON.stringify(input.profile)}
Completed ticket ids: ${JSON.stringify(input.completedTicketIds)}
Missed content ids: ${JSON.stringify(input.missedContentIds)}
Spilled content ids: ${JSON.stringify(input.spilledContentIds)}
Study minutes: ${input.studyMinutes}
Remaining weeks: ${input.remainingWeeks}
Future week numbers: ${JSON.stringify(input.futureWeekNumbers)}
Original summary: ${input.originalRoadmapSummary}
Valid content ids: ${JSON.stringify(input.content.map((c) => c.id))}

Return JSON matching: { "summary": "...", "adjustments": [...], "suggestedSprintTitles": [...] }`;

    try {
      return await this.generateWithRepair(prompt, (data) => ReplanResponseSchema.parse(data));
    } catch {
      return this.fallback.replan(input);
    }
  }

  async generateSprintReview(input: SprintReviewInput): Promise<SprintReviewAi> {
    const prompt = `Write an interview-prep sprint review. Label insights as observations, not objective facts.

Input: ${JSON.stringify(input)}

Return JSON: { "insights": string[], "suggestions": string[] }`;

    try {
      return await this.generateWithRepair(prompt, (data) => SprintReviewAiSchema.parse(data));
    } catch {
      return this.fallback.generateSprintReview(input);
    }
  }

  async analyzeSkills(profile: PlannerProfile): Promise<SkillAnalysis> {
    const prompt = `Estimate interview prep skill scores (0-100) from self-reported profile. Be conservative.
Profile: ${JSON.stringify(profile)}
Return JSON: { "dsaScore": number, "lldScore": number, "hldScore": number, "communication": number, "weakAreas": string[], "notes": string }`;

    try {
      return await this.generateWithRepair(prompt, (data) => SkillAnalysisSchema.parse(data));
    } catch {
      return this.fallback.analyzeSkills(profile);
    }
  }
}
