import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJsonArray, parseJsonObject } from "@/lib/utils";

export async function GET() {
  const profile = await prisma.userProfile.findFirst({
    orderBy: { createdAt: "desc" },
    include: { skills: true, progress: true },
  });

  if (!profile) {
    return NextResponse.json({ progress: null });
  }

  const roadmap = await prisma.roadmap.findFirst({
    where: { profileId: profile.id, status: "ACTIVE" },
    include: {
      sprints: {
        include: {
          days: { include: { tickets: true } },
        },
      },
    },
  });

  const tickets =
    roadmap?.sprints.flatMap((s) => s.days.flatMap((d) => d.tickets)) ?? [];
  const done = tickets.filter((t) => t.status === "DONE");
  const byCat = (cat: string) => {
    const all = tickets.filter((t) => t.category === cat);
    const completed = all.filter((t) => t.status === "DONE");
    return {
      total: all.length,
      completed: completed.length,
      percent: all.length ? Math.round((completed.length / all.length) * 100) : 0,
    };
  };

  const dsa = byCat("DSA");
  const lld = byCat("LLD");
  const hld = byCat("HLD");
  const overall = tickets.length
    ? Math.round((done.length / tickets.length) * 100)
    : 0;

  const activeSprint = roadmap?.sprints.find((s) => s.status === "ACTIVE");
  const sprintTickets =
    activeSprint?.days.flatMap((d) => d.tickets) ?? [];
  const sprintCompletion = sprintTickets.length
    ? Math.round(
        (sprintTickets.filter((t) => t.status === "DONE").length /
          sprintTickets.length) *
          100
      )
    : 0;

  return NextResponse.json({
    progress: profile.progress,
    skills: profile.skills,
    stats: {
      overall,
      dsa: dsa.percent,
      lld: lld.percent,
      hld: hld.percent,
      sprintCompletion,
      ticketsCompleted: profile.progress?.ticketsCompleted ?? done.length,
      ticketsMissed: profile.progress?.ticketsMissed ?? 0,
      ticketsSpilled: profile.progress?.ticketsSpilled ?? 0,
      problemsSolved: profile.progress?.problemsSolved ?? 0,
      studyMinutes: profile.progress?.studyMinutes ?? 0,
      currentStreak: profile.progress?.currentStreak ?? 0,
      topicPerformance: parseJsonObject(
        profile.progress?.topicPerformance,
        {}
      ),
      weakAreas: parseJsonArray(profile.skills?.weakAreas),
      byCategory: { dsa, lld, hld },
    },
  });
}
