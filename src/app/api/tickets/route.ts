import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 200);

  const profile = await prisma.userProfile.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!profile) return NextResponse.json({ tickets: [] });

  const roadmap = await prisma.roadmap.findFirst({
    where: { profileId: profile.id, status: "ACTIVE" },
  });
  if (!roadmap) return NextResponse.json({ tickets: [] });

  const tickets = await prisma.ticket.findMany({
    where: {
      sprintDay: { sprint: { roadmapId: roadmap.id } },
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
    },
    include: { items: true },
    orderBy: [{ status: "asc" }, { sortOrder: "asc" }],
    take: limit,
  });

  return NextResponse.json({ tickets });
}
