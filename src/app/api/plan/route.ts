import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const profile = await prisma.userProfile.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!profile) {
    return NextResponse.json({ roadmap: null });
  }

  const roadmap = await prisma.roadmap.findFirst({
    where: { profileId: profile.id, status: "ACTIVE" },
    include: {
      sprints: {
        orderBy: { weekNumber: "asc" },
        include: {
          days: {
            orderBy: { dayNumber: "asc" },
            include: {
              tickets: {
                orderBy: { sortOrder: "asc" },
                select: {
                  id: true,
                  title: true,
                  category: true,
                  status: true,
                  estimatedMinutes: true,
                  priority: true,
                },
              },
            },
          },
          review: true,
        },
      },
    },
  });

  return NextResponse.json({ roadmap });
}
