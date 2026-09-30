import { NextResponse } from "next/server";
import { getTodayData } from "@/lib/services/ticketService";

export async function GET() {
  const data = await getTodayData();
  if (!data?.profile) {
    return NextResponse.json({ needsOnboarding: true });
  }

  const tickets = data.day?.tickets ?? [];
  const completed = tickets.filter((t) => t.status === "DONE").length;
  const incomplete = tickets.filter((t) => t.status !== "DONE");

  return NextResponse.json({
    needsOnboarding: false,
    profile: data.profile,
    sprint: data.sprint
      ? {
          id: data.sprint.id,
          weekNumber: data.sprint.weekNumber,
          title: data.sprint.title,
          status: data.sprint.status,
        }
      : null,
    day: data.day,
    summary: {
      completed,
      total: tickets.length,
      incompleteCount: incomplete.length,
      plannedMin: data.day?.plannedMin ?? 0,
      capacityMin: data.day?.capacityMin ?? 0,
    },
  });
}
