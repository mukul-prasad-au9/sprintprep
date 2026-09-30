import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAndPersistRoadmap } from "@/lib/services/planService";

/**
 * Replan = rebuild from Planly syllabus (archives current active roadmap).
 * Spillover of unfinished work is handled by regenerating a fresh schedule.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      apply?: boolean;
    };

    const profile = await prisma.userProfile.findFirst({
      orderBy: { createdAt: "desc" },
    });
    if (!profile) {
      return NextResponse.json({ error: "No profile" }, { status: 400 });
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: { profileId: profile.id, status: "ACTIVE" },
      include: {
        sprints: {
          include: { days: { include: { tickets: true } } },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "No active roadmap" }, { status: 400 });
    }

    const allTickets = roadmap.sprints.flatMap((s) =>
      s.days.flatMap((d) => d.tickets)
    );
    const completed = allTickets.filter((t) => t.status === "DONE").length;
    const spilled = allTickets.filter((t) => t.status === "SPILLED").length;
    const total = allTickets.length;

    const proposal = {
      summary: `Rebuild from Planly syllabus. Currently ${completed}/${total} day tickets done, ${spilled} spilled.`,
      adjustments: [] as {
        weekNumber: number;
        action: "ADD" | "REMOVE" | "REPLACE" | "INCREASE_FOCUS";
        reason: string;
      }[],
      suggestedSprintTitles: roadmap.sprints.map((s) => ({
        weekNumber: s.weekNumber,
        title: s.title,
        objective: s.objective ?? undefined,
      })),
    };

    if (body.apply) {
      const fresh = await generateAndPersistRoadmap(profile.id);
      return NextResponse.json({
        proposal,
        applied: true,
        roadmap: fresh,
        note: "Rebuilt from Planly syllabus (no AI).",
      });
    }

    return NextResponse.json({
      proposal,
      applied: false,
      note: "Set apply:true to rebuild from Planly syllabus.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Could not replan. Your existing plan is safe.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
}
