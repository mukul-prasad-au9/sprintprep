import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProfileInputSchema } from "@/lib/ai/schemas";
import { generateAndPersistRoadmap } from "@/lib/services/planService";

function levelScore(level: string): number {
  const l = level.toLowerCase();
  if (l.includes("advanced") || l.includes("expert")) return 85;
  if (l.includes("intermediate") || l.includes("basic")) return 60;
  if (l.includes("beginner") || l.includes("new")) return 35;
  return 50;
}

function analyzeSkills(data: {
  dsaLevel: string;
  lldLevel: string;
  hldLevel: string;
  topicsWeak: string[];
  problemsSolved: number;
}) {
  const dsaScore = Math.min(
    95,
    levelScore(data.dsaLevel) + Math.floor(data.problemsSolved / 20)
  );
  return {
    dsaScore,
    lldScore: levelScore(data.lldLevel),
    hldScore: levelScore(data.hldLevel),
    communication: 55,
    weakAreas: data.topicsWeak.slice(0, 6),
    notes: "Scores derived from your self-reported levels (no AI).",
  };
}

export async function GET() {
  const profile = await prisma.userProfile.findFirst({
    orderBy: { createdAt: "desc" },
    include: { skills: true, progress: true },
  });
  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = ProfileInputSchema.parse(body);

    const existing = await prisma.userProfile.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const payload = {
      name: data.name,
      yearsExperience: data.yearsExperience,
      targetRole: data.targetRole,
      targetCompanies: JSON.stringify(data.targetCompanies),
      durationWeeks: data.durationWeeks,
      hoursPerDay: data.hoursPerDay,
      daysPerWeek: data.daysPerWeek,
      preferredStudyDays: JSON.stringify(data.preferredStudyDays),
      dsaLanguage: data.dsaLanguage,
      dsaLevel: data.dsaLevel,
      lldLevel: data.lldLevel,
      hldLevel: data.hldLevel,
      problemsSolved: data.problemsSolved,
      topicsCompleted: JSON.stringify(data.topicsCompleted),
      topicsWeak: JSON.stringify(data.topicsWeak),
      topicsNotStarted: JSON.stringify(data.topicsNotStarted),
      revisionIntervals: JSON.stringify(data.revisionIntervals ?? [1, 7, 21, 45]),
    };

    let profile;
    if (existing) {
      profile = await prisma.userProfile.update({
        where: { id: existing.id },
        data: payload,
        include: { skills: true },
      });
    } else {
      profile = await prisma.userProfile.create({
        data: payload,
        include: { skills: true },
      });
      await prisma.progress.create({
        data: { profileId: profile.id },
      });
    }

    const analysis = analyzeSkills({
      dsaLevel: data.dsaLevel,
      lldLevel: data.lldLevel,
      hldLevel: data.hldLevel,
      topicsWeak: data.topicsWeak,
      problemsSolved: data.problemsSolved,
    });

    const skillData = {
      dsaScore: analysis.dsaScore,
      lldScore: analysis.lldScore,
      hldScore: analysis.hldScore,
      communication: analysis.communication,
      weakAreas: JSON.stringify(analysis.weakAreas),
    };

    const skills = await prisma.skill.upsert({
      where: { profileId: profile.id },
      create: { profileId: profile.id, ...skillData },
      update: skillData,
    });

    // Ensure a syllabus plan exists once — no separate generate UI
    const active = await prisma.roadmap.findFirst({
      where: { profileId: profile.id, status: "ACTIVE" },
    });
    let roadmapCreated = false;
    if (!active) {
      await generateAndPersistRoadmap(profile.id);
      roadmapCreated = true;
    }

    return NextResponse.json({
      profile: { ...profile, skills },
      skillAnalysis: analysis,
      roadmapCreated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save profile" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const profile = await prisma.userProfile.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!profile) {
      return NextResponse.json({ error: "No profile" }, { status: 404 });
    }

    if (body.skills) {
      const skills = await prisma.skill.upsert({
        where: { profileId: profile.id },
        create: {
          profileId: profile.id,
          dsaScore: body.skills.dsaScore ?? 50,
          lldScore: body.skills.lldScore ?? 40,
          hldScore: body.skills.hldScore ?? 30,
          communication: body.skills.communication ?? 50,
          weakAreas: JSON.stringify(body.skills.weakAreas ?? []),
        },
        update: {
          dsaScore: body.skills.dsaScore,
          lldScore: body.skills.lldScore,
          hldScore: body.skills.hldScore,
          communication: body.skills.communication,
          weakAreas: body.skills.weakAreas
            ? JSON.stringify(body.skills.weakAreas)
            : undefined,
        },
      });
      return NextResponse.json({ skills });
    }

    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 400 }
    );
  }
}
