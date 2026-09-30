import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
      sprintDay: {
        include: { sprint: true },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const content = await prisma.contentItem.findUnique({
    where: { id: ticket.contentId },
  });

  // For single-content tickets, optionally show sibling problems.
  // Day tickets already bundle all questions in items — skip related.
  const isDayTicket = ticket.contentId.startsWith("day-");
  const related =
    content && !isDayTicket
      ? await prisma.contentItem.findMany({
          where: {
            category: content.category,
            topic: content.topic,
            id: { not: content.id },
          },
          take: 2,
          orderBy: { id: "asc" },
        })
      : [];

  return NextResponse.json({ ticket, content, related });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const body = await req.json();

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      notes: body.notes ?? undefined,
      solutionApproach: body.solutionApproach ?? undefined,
      timeComplexity: body.timeComplexity ?? undefined,
      spaceComplexity: body.spaceComplexity ?? undefined,
      status: body.status ?? undefined,
      startedAt:
        body.status === "IN_PROGRESS"
          ? new Date()
          : undefined,
    },
    include: { items: true },
  });

  if (body.itemId !== undefined && body.itemCompleted !== undefined) {
    await prisma.ticketItem.update({
      where: { id: body.itemId },
      data: {
        isCompleted: Boolean(body.itemCompleted),
        completedAt: body.itemCompleted ? new Date() : null,
      },
    });
  }

  const fresh = await prisma.ticket.findUnique({
    where: { id },
    include: { items: true },
  });

  if (fresh && fresh.status !== "DONE" && fresh.items.length > 0) {
    const allDone = fresh.items.every((i) => i.isCompleted);
    const anyDone = fresh.items.some((i) => i.isCompleted);
    if (anyDone && !allDone && fresh.status === "TODO") {
      await prisma.ticket.update({
        where: { id },
        data: { status: "IN_PROGRESS", startedAt: new Date() },
      });
    }
  }

  const latest = await prisma.ticket.findUnique({
    where: { id },
    include: { items: true },
  });

  return NextResponse.json({ ticket: latest ?? fresh ?? ticket });
}
