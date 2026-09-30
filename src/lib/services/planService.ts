import { startOfDay } from "date-fns";
import { prisma } from "@/lib/db";
import { dailyCapacityMinutes } from "@/lib/scheduler";
import { parseJsonArray } from "@/lib/utils";
import { loadPlanlyTopics, planlyMeta } from "@/lib/syllabus/load";
import { scheduleSyllabus } from "@/lib/syllabus/schedule";
import { syncPlanlyContent } from "@/lib/syllabus/syncContent";
import { resolveProblemUrls } from "@/lib/syllabus/urls";
import type { UserProfile } from "@prisma/client";

export function profileToPlanner(profile: UserProfile) {
  return {
    preferredStudyDays: parseJsonArray(profile.preferredStudyDays),
    hoursPerDay: profile.hoursPerDay,
    durationWeeks: profile.durationWeeks,
  };
}

/**
 * Build roadmap from the fixed Planly syllabus — no AI.
 * One ticket per study day; each question is a TicketItem (checkbox).
 */
export async function generateAndPersistRoadmap(profileId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { id: profileId },
  });
  if (!profile) throw new Error("Profile not found");

  // Ensure ContentItems exist with LC/GFG links where known
  await syncPlanlyContent();

  const topics = loadPlanlyTopics();
  const meta = planlyMeta();
  const preferredStudyDays = parseJsonArray(profile.preferredStudyDays);
  if (!preferredStudyDays.length) {
    throw new Error("Select at least one study day in onboarding.");
  }

  const startDate = startOfDay(new Date());
  const weeks = scheduleSyllabus({
    topics,
    hoursPerDay: profile.hoursPerDay,
    preferredStudyDays,
    startDate,
  });

  // Duration follows syllabus packing (not fixed profile weeks)
  const durationWeeks = weeks.length;

  await prisma.roadmap.updateMany({
    where: { profileId, status: "ACTIVE" },
    data: { status: "ARCHIVED" },
  });

  // Keep profile duration in sync with generated weeks
  if (profile.durationWeeks !== durationWeeks) {
    await prisma.userProfile.update({
      where: { id: profileId },
      data: { durationWeeks },
    });
  }

  const capacity = dailyCapacityMinutes(profile.hoursPerDay);

  const roadmap = await prisma.roadmap.create({
    data: {
      profileId,
      title: `Planly syllabus · ${meta.role} · ${meta.interviewTarget}`,
      durationWeeks,
      startDate,
      status: "ACTIVE",
      aiProvider: "planly-syllabus",
      rawPlanJson: JSON.stringify({
        source: "planly",
        plan_id: 64967,
        total_est_minutes: meta.totalEstMinutes,
        topic_count: topics.length,
        weeks: durationWeeks,
      }),
    },
  });

  // Nested creates — one transaction per sprint for reliability with large plans
  for (const week of weeks) {
    const hasWork = week.days.some((d) => d.items.length > 0);
    if (!hasWork) continue;

    await prisma.sprint.create({
      data: {
        roadmapId: roadmap.id,
        weekNumber: week.weekNumber,
        title: week.title,
        objective: week.objective,
        startDate: week.startDate,
        endDate: week.endDate,
        status: week.weekNumber === 1 ? "ACTIVE" : "PLANNED",
        days: {
          create: week.days.map((day) => ({
            dayNumber: day.dayNumber,
            date: day.date,
            dayName: day.dayName,
            isStudyDay: day.isStudyDay,
            capacityMin: capacity,
            plannedMin: day.plannedMin,
            status:
              day.plannedMin > capacity
                ? "OVERLOADED"
                : day.items.length
                  ? "PLANNED"
                  : "PLANNED",
            tickets: {
              create: day.items.length
                ? [
                    {
                      contentId: `day-w${day.weekNumber}-d${day.dayNumber}`,
                      title: day.title,
                      category: day.category,
                      topic: day.topic,
                      difficulty: day.difficulty,
                      estimatedMinutes: day.plannedMin,
                      priority: "HIGH",
                      status: "TODO",
                      sortOrder: 0,
                      items: {
                        create: day.items.map((item, order) => {
                          const urls = resolveProblemUrls(item.slug);
                          return {
                            contentId: item.contentId,
                            title: item.title,
                            leetcodeUrl: urls.leetcodeUrl,
                            gfgUrl: urls.gfgUrl,
                            sortOrder: order,
                          };
                        }),
                      },
                    },
                  ]
                : [],
            },
          })),
        },
      },
    });
  }

  return prisma.roadmap.findUnique({
    where: { id: roadmap.id },
    include: {
      sprints: {
        orderBy: { weekNumber: "asc" },
        include: {
          days: {
            orderBy: { dayNumber: "asc" },
            include: {
              tickets: {
                orderBy: { sortOrder: "asc" },
                include: { items: { orderBy: { sortOrder: "asc" } } },
              },
            },
          },
        },
      },
    },
  });
}
