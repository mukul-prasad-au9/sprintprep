import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const due = await prisma.revision.findMany({
    where: {
      status: "PENDING",
      nextDueAt: { lte: new Date() },
    },
    include: { content: true },
    orderBy: { nextDueAt: "asc" },
    take: 50,
  });

  const upcoming = await prisma.revision.findMany({
    where: {
      status: "PENDING",
      nextDueAt: { gt: new Date() },
    },
    include: { content: true },
    orderBy: { nextDueAt: "asc" },
    take: 20,
  });

  return NextResponse.json({ due, upcoming });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const rev = await prisma.revision.findUnique({ where: { id: body.id } });
  if (!rev) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let nextDueAt = rev.nextDueAt;
  let revision1Done = rev.revision1Done;
  let revision2Done = rev.revision2Done;
  let revision3Done = rev.revision3Done;
  let status = rev.status;

  if (!revision1Done) {
    revision1Done = true;
    nextDueAt = rev.revision2At;
  } else if (!revision2Done) {
    revision2Done = true;
    nextDueAt = rev.revision3At;
  } else {
    revision3Done = true;
    status = "DONE";
    nextDueAt = null;
  }

  const updated = await prisma.revision.update({
    where: { id: body.id },
    data: { revision1Done, revision2Done, revision3Done, nextDueAt, status },
  });

  return NextResponse.json({ revision: updated });
}
