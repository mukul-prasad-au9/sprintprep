import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAndPersistRoadmap } from "@/lib/services/planService";

export async function POST() {
  try {
    const profile = await prisma.userProfile.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!profile) {
      return NextResponse.json(
        { error: "Complete onboarding first." },
        { status: 400 }
      );
    }

    const roadmap = await generateAndPersistRoadmap(profile.id);
    const sprintCount = roadmap?.sprints?.length ?? 0;
    const ticketCount =
      roadmap?.sprints?.reduce(
        (sum, s) =>
          sum + s.days.reduce((dSum, d) => dSum + d.tickets.length, 0),
        0
      ) ?? 0;

    return NextResponse.json({
      roadmap,
      message: `Planly syllabus scheduled into ${sprintCount} sprints (${ticketCount} day tickets).`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Could not build plan from syllabus. Your existing plan is safe.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
}
