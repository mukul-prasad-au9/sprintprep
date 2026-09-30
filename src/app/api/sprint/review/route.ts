import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { sprintId: string };
    if (!body.sprintId) {
      return NextResponse.json({ error: "sprintId required" }, { status: 400 });
    }

    const sprint = await prisma.sprint.findUnique({
      where: { id: body.sprintId },
      include: {
        days: { include: { tickets: true } },
        roadmap: { include: { profile: { include: { skills: true } } } },
        review: true,
      },
    });

    if (!sprint) {
      return NextResponse.json({ error: "Sprint not found" }, { status: 404 });
    }

    const tickets = sprint.days.flatMap((d) => d.tickets);
    const completed = tickets.filter((t) => t.status === "DONE");
    const spilled = tickets.filter((t) => t.status === "SPILLED");
    const rate =
      tickets.length === 0
        ? 0
        : Math.round((completed.length / tickets.length) * 100);

    const byCategory: Record<string, { completed: number; total: number }> = {};
    for (const cat of ["DSA", "LLD", "HLD", "MIXED", "REVISION", "MOCK"]) {
      const all = tickets.filter((t) => t.category === cat);
      byCategory[cat] = {
        total: all.length,
        completed: all.filter((t) => t.status === "DONE").length,
      };
    }

    const insights: string[] = [
      `Week ${sprint.weekNumber} (“${sprint.title}”): ${completed.length}/${tickets.length} day tickets done (${rate}%).`,
    ];
    if (spilled.length) {
      insights.push(
        `${spilled.length} ticket(s) spilled — rebuild from syllabus if you need a fresh schedule.`
      );
    }
    if (rate >= 80) {
      insights.push("Strong completion — keep the same daily capacity.");
    } else if (rate < 50 && tickets.length) {
      insights.push(
        "Completion under 50% — consider fewer hours/day or fewer study days when regenerating."
      );
    }

    const suggestions: string[] = [];
    if (byCategory.DSA && byCategory.DSA.total > byCategory.DSA.completed) {
      suggestions.push("Finish remaining DSA day tickets before moving ahead.");
    }
    if (byCategory.LLD && byCategory.LLD.completed < byCategory.LLD.total) {
      suggestions.push("Carve focused LLD/OOPS blocks on lighter DSA days.");
    }
    if (!suggestions.length) {
      suggestions.push("Continue the next sprint in syllabus order.");
    }

    const review = await prisma.sprintReview.upsert({
      where: { sprintId: sprint.id },
      create: {
        sprintId: sprint.id,
        completedCount: completed.length,
        totalCount: tickets.length,
        dsaCompleted: byCategory.DSA?.completed ?? 0,
        dsaTotal: byCategory.DSA?.total ?? 0,
        lldCompleted: byCategory.LLD?.completed ?? 0,
        lldTotal: byCategory.LLD?.total ?? 0,
        hldCompleted: byCategory.HLD?.completed ?? 0,
        hldTotal: byCategory.HLD?.total ?? 0,
        insights: JSON.stringify(insights),
        suggestions: JSON.stringify(suggestions),
        isAiGenerated: false,
      },
      update: {
        completedCount: completed.length,
        totalCount: tickets.length,
        dsaCompleted: byCategory.DSA?.completed ?? 0,
        dsaTotal: byCategory.DSA?.total ?? 0,
        lldCompleted: byCategory.LLD?.completed ?? 0,
        lldTotal: byCategory.LLD?.total ?? 0,
        hldCompleted: byCategory.HLD?.completed ?? 0,
        hldTotal: byCategory.HLD?.total ?? 0,
        insights: JSON.stringify(insights),
        suggestions: JSON.stringify(suggestions),
        isAiGenerated: false,
      },
    });

    await prisma.sprint.update({
      where: { id: sprint.id },
      data: { status: "COMPLETED" },
    });

    const next = await prisma.sprint.findFirst({
      where: {
        roadmapId: sprint.roadmapId,
        weekNumber: sprint.weekNumber + 1,
      },
    });
    if (next && next.status === "PLANNED") {
      await prisma.sprint.update({
        where: { id: next.id },
        data: { status: "ACTIVE" },
      });
    }

    return NextResponse.json({ review, insights, suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Could not create sprint review.",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
