"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SprintTimeline } from "@/components/SprintTimeline";
import { TicketAccordion } from "@/components/TicketAccordion";
import { formatMinutes } from "@/lib/utils";

type TicketItem = {
  id: string;
  title: string;
  leetcodeUrl: string | null;
  gfgUrl: string | null;
  isCompleted: boolean;
};

type Ticket = {
  id: string;
  contentId: string;
  title: string;
  category: string;
  topic: string;
  difficulty: string;
  estimatedMinutes: number;
  status: string;
  items: TicketItem[];
};

type Day = {
  id: string;
  dayName: string;
  dayNumber: number;
  date: string;
  isStudyDay: boolean;
  capacityMin: number;
  plannedMin: number;
  status: string;
  tickets: Ticket[];
};

type Sprint = {
  id: string;
  weekNumber: number;
  title: string;
  objective: string | null;
  status: string;
  startDate: string;
  endDate: string;
  days: Day[];
};

export default function SprintDetailPage() {
  const params = useParams<{ id: string }>();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/sprints/${params.id}`);
    const data = await res.json();
    setSprint(data.sprint);
    if (data.sprint?.days?.length) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayDay =
        data.sprint.days.find((d: Day) => {
          const dt = new Date(d.date);
          dt.setHours(0, 0, 0, 0);
          return dt.getTime() === today.getTime();
        }) ?? data.sprint.days.find((d: Day) => d.isStudyDay && d.tickets.length);
      setSelectedDayId((prev) => prev ?? todayDay?.id ?? data.sprint.days[0].id);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!sprint) {
    return (
      <div className="mx-auto max-w-6xl space-y-3">
        <div className="skeleton h-10 w-64 rounded-lg" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  const tickets = sprint.days.flatMap((d) => d.tickets);
  const done = tickets.filter((t) => t.status === "DONE").length;
  const pct = tickets.length ? Math.round((done / tickets.length) * 100) : 0;
  const selected =
    sprint.days.find((d) => d.id === selectedDayId) ?? sprint.days[0];

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#635BFF]">
            Sprint {String(sprint.weekNumber).padStart(2, "0")}
          </p>
          <h1 className="text-2xl font-bold text-[#171B2D]">{sprint.title}</h1>
          <p className="text-sm text-[#6B7280]">
            {format(new Date(sprint.startDate), "MMM d")} —{" "}
            {format(new Date(sprint.endDate), "MMM d")} · {done} /{" "}
            {tickets.length} tickets
          </p>
          {sprint.objective && (
            <p className="mt-1 text-sm text-[#171B2D]">{sprint.objective}</p>
          )}
        </div>
        <Link href="/today">
          <Button size="sm" variant="outline">
            Today view
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-5">
          <div className="flex justify-between text-xs text-[#6B7280]">
            <span>
              {done} / {tickets.length} completed
            </span>
            <span className="font-medium text-[#5148E8]">{pct}%</span>
          </div>
          <Progress value={pct} size="lg" />
          <SprintTimeline days={sprint.days} />
          <div className="flex flex-wrap gap-2">
            {sprint.days.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDayId(d.id)}
                className={`rounded-lg border px-2.5 py-1 text-xs ${
                  selectedDayId === d.id
                    ? "border-[#635BFF] bg-[#635BFF]/10 text-[#5148E8]"
                    : "border-[#E6E8EF] text-[#6B7280]"
                }`}
              >
                {d.dayName.slice(0, 3)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selected && (
        <section className="space-y-3" id={`day-${selected.id}`}>
          <div>
            <h2 className="text-lg font-semibold">
              {selected.dayName}
              {!selected.isStudyDay && (
                <Badge variant="outline" className="ml-2">
                  Rest
                </Badge>
              )}
              {selected.status === "OVERLOADED" && (
                <Badge variant="warning" className="ml-2">
                  OVERLOAD
                </Badge>
              )}
            </h2>
            <p className="text-xs text-[#6B7280]">
              {format(new Date(selected.date), "MMM d")} ·{" "}
              {formatMinutes(selected.plannedMin)} /{" "}
              {formatMinutes(selected.capacityMin)}
            </p>
          </div>
          <div className="space-y-3">
            {selected.tickets.map((t) => (
              <TicketAccordion
                key={t.id}
                ticket={{ ...t, itemCount: t.items?.length || 1 }}
                defaultOpen={selected.tickets.length === 1}
                onChanged={load}
              />
            ))}
            {!selected.tickets.length && (
              <div className="rounded-2xl border border-dashed border-[#E6E8EF] py-8 text-center text-sm text-[#6B7280]">
                No tickets this day.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
