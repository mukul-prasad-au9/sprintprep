import { prisma } from "@/lib/db";
import { findSpilloverTarget } from "@/lib/scheduler";
import { parseJsonArray } from "@/lib/utils";
import { addDays } from "date-fns";

export async function completeTicket(ticketId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      items: true,
      sprintDay: { include: { sprint: { include: { roadmap: true } } } },
    },
  });
  if (!ticket) throw new Error("Ticket not found");

  const now = new Date();
  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "DONE",
      completedAt: now,
    },
  });

  await prisma.ticketItem.updateMany({
    where: { ticketId, isCompleted: false },
    data: { isCompleted: true, completedAt: now },
  });

  // Update progress
  const profileId = ticket.sprintDay.sprint.roadmap.profileId;
  const progress = await prisma.progress.findUnique({ where: { profileId } });
  const problemsSolved = ticket.items.length || 1;

  if (progress) {
    const last = progress.lastStudyDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = progress.currentStreak;
    if (last) {
      const lastDay = new Date(last);
      lastDay.setHours(0, 0, 0, 0);
      const diff = (today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak += 1;
      else if (diff > 1) streak = 1;
    } else {
      streak = 1;
    }

    await prisma.progress.update({
      where: { profileId },
      data: {
        ticketsCompleted: { increment: 1 },
        problemsSolved: { increment: problemsSolved },
        studyMinutes: { increment: ticket.estimatedMinutes },
        currentStreak: streak,
        longestStreak: Math.max(progress.longestStreak, streak),
        lastStudyDate: now,
      },
    });
  }

  // Schedule revisions for each DSA problem in the ticket
  const profile = await prisma.userProfile.findUnique({ where: { id: profileId } });
  const intervals = profile
    ? parseJsonArray(profile.revisionIntervals).map(Number)
    : [1, 7, 21, 45];
  const [i1, i2, i3] = [intervals[0] ?? 1, intervals[1] ?? 7, intervals[2] ?? 21];

  const itemContentIds = ticket.items
    .map((i) => i.contentId)
    .filter((id): id is string => Boolean(id));

  if (itemContentIds.length) {
    const dsaItems = await prisma.contentItem.findMany({
      where: { id: { in: itemContentIds }, category: "DSA" },
      select: { id: true },
    });
    for (const dsa of dsaItems) {
      await prisma.revision.create({
        data: {
          contentId: dsa.id,
          ticketId: ticket.id,
          solvedAt: now,
          revision1At: addDays(now, i1),
          revision2At: addDays(now, i2),
          revision3At: addDays(now, i3),
          nextDueAt: addDays(now, i1),
          status: "PENDING",
        },
      });
    }
  }

  // Recalc day planned minutes for remaining todos
  await recalcDayPlanned(ticket.sprintDayId);

  return prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { items: true },
  });
}

export async function spilloverTicket(ticketId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      sprintDay: {
        include: {
          sprint: {
            include: {
              roadmap: true,
              days: true,
            },
          },
        },
      },
    },
  });
  if (!ticket) throw new Error("Ticket not found");
  if (ticket.status === "DONE") throw new Error("Cannot spill completed ticket");

  const roadmapId = ticket.sprintDay.sprint.roadmapId;
  const allDays = await prisma.sprintDay.findMany({
    where: { sprint: { roadmapId } },
    orderBy: { date: "asc" },
  });

  const result = findSpilloverTarget(
    allDays.map((d) => ({
      id: d.id,
      date: d.date,
      isStudyDay: d.isStudyDay,
      capacityMin: d.capacityMin,
      plannedMin: d.plannedMin,
      status: d.status,
    })),
    ticket.estimatedMinutes,
    ticket.sprintDay.date
  );

  await prisma.spillover.create({
    data: {
      ticketId: ticket.id,
      fromSprintDayId: ticket.sprintDayId,
      toSprintDayId: result.toSprintDayId ?? null,
      reason: result.reason,
      status: result.success ? "RESCHEDULED" : "FAILED",
      resolvedAt: result.success ? new Date() : null,
    },
  });

  const profileId = ticket.sprintDay.sprint.roadmap.profileId;
  await prisma.progress.updateMany({
    where: { profileId },
    data: {
      ticketsSpilled: { increment: 1 },
      ticketsMissed: { increment: 1 },
    },
  });

  if (result.success && result.toSprintDayId) {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        sprintDayId: result.toSprintDayId,
        status: "SPILLED",
        spilledFromId: ticket.sprintDayId,
      },
    });

    await recalcDayPlanned(ticket.sprintDayId);
    await recalcDayPlanned(result.toSprintDayId);

    return {
      success: true,
      message: "2 tickets spilled over logic applied.",
      reason: result.reason,
      toSprintDayId: result.toSprintDayId,
    };
  }

  // Mark sprint needs replan
  await prisma.sprint.update({
    where: { id: ticket.sprintDay.sprintId },
    data: { status: "NEEDS_REPLAN" },
  });

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status: "SPILLED" },
  });

  return {
    success: false,
    message: "Sprint overloaded — replan recommended.",
    reason: result.reason,
    needsReplan: true,
  };
}

async function recalcDayPlanned(sprintDayId: string) {
  const tickets = await prisma.ticket.findMany({
    where: {
      sprintDayId,
      status: { in: ["TODO", "IN_PROGRESS", "SPILLED"] },
    },
  });
  const plannedMin = tickets.reduce((s, t) => s + t.estimatedMinutes, 0);
  const day = await prisma.sprintDay.findUnique({ where: { id: sprintDayId } });
  if (!day) return;
  await prisma.sprintDay.update({
    where: { id: sprintDayId },
    data: {
      plannedMin,
      status: plannedMin > day.capacityMin ? "OVERLOADED" : day.status === "OVERLOADED" ? "PLANNED" : day.status,
    },
  });
}

export async function getTodayData(profileId?: string) {
  const profile =
    (profileId
      ? await prisma.userProfile.findUnique({ where: { id: profileId } })
      : await prisma.userProfile.findFirst({ orderBy: { createdAt: "desc" } }));

  if (!profile) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = addDays(today, 1);

  const roadmap = await prisma.roadmap.findFirst({
    where: { profileId: profile.id, status: "ACTIVE" },
    include: {
      sprints: {
        include: {
          days: {
            where: { date: { gte: today, lt: tomorrow } },
            include: {
              tickets: {
                orderBy: { sortOrder: "asc" },
                include: { items: true },
              },
            },
          },
        },
      },
    },
  });

  const day = roadmap?.sprints.flatMap((s) => s.days)[0] ?? null;
  const sprint = roadmap?.sprints.find((s) => s.days.some((d) => d.id === day?.id)) ?? null;

  return { profile, roadmap, sprint, day };
}
