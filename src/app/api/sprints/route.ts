import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const profile = await prisma.userProfile.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!profile) return NextResponse.json({ sprints: [] });

  const roadmap = await prisma.roadmap.findFirst({
    where: { profileId: profile.id, status: "ACTIVE" },
  });
  if (!roadmap) return NextResponse.json({ sprints: [] });

  const sprints = await prisma.sprint.findMany({
    where: { roadmapId: roadmap.id },
    orderBy: { weekNumber: "asc" },
    include: {
      days: {
        orderBy: { dayNumber: "asc" },
        include: {
          _count: { select: { tickets: true } },
          tickets: { select: { category: true, status: true } },
        },
      },
      review: true,
    },
  });

  const enriched = sprints.map((s) => {
    const tickets = s.days.flatMap((d) => d.tickets);
    const counts = {
      DSA: tickets.filter((t) => t.category === "DSA").length,
      LLD: tickets.filter((t) => t.category === "LLD").length,
      HLD: tickets.filter((t) => t.category === "HLD").length,
      REVISION: tickets.filter((t) => t.category === "REVISION").length,
      MOCK: tickets.filter((t) => t.category === "MOCK").length,
      done: tickets.filter((t) => t.status === "DONE").length,
      total: tickets.length,
    };
    return { ...s, counts };
  });

  return NextResponse.json({ sprints: enriched });
}
