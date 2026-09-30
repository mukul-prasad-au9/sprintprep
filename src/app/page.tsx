"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MetricCard } from "@/components/MetricCard";
import { TicketAccordion } from "@/components/TicketAccordion";
import { SprintTimeline } from "@/components/SprintTimeline";
import { SpilloverPanel } from "@/components/SpilloverPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ToastProvider";
import {
  formatHoursMinutes,
  formatMinutes,
  greetingForHour,
  parseJsonArray,
} from "@/lib/utils";

type TodayResponse = {
  needsOnboarding?: boolean;
  profile?: {
    id: string;
    name: string;
    yearsExperience: string;
    targetRole: string;
    targetCompanies: string;
    hoursPerDay: number;
  };
  sprint?: {
    id: string;
    weekNumber: number;
    title: string;
    status: string;
  } | null;
  day?: {
    id: string;
    dayName: string;
    date: string;
    capacityMin: number;
    plannedMin: number;
    tickets: {
      id: string;
      contentId?: string;
      title: string;
      category: string;
      topic: string;
      difficulty: string;
      estimatedMinutes: number;
      status: string;
      items: {
        id: string;
        title?: string;
        leetcodeUrl?: string | null;
        gfgUrl?: string | null;
        isCompleted?: boolean;
      }[];
    }[];
  } | null;
  summary?: { completed: number; total: number; incompleteCount: number };
};

type ProgressResponse = {
  stats?: {
    overall: number;
    sprintCompletion: number;
    ticketsCompleted: number;
    currentStreak: number;
    problemsSolved: number;
    studyMinutes: number;
    weakAreas: string[];
  };
};

type SprintItem = {
  id: string;
  weekNumber: number;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  counts: { total: number; done: number };
  days: {
    id: string;
    dayName: string;
    date: string;
    isStudyDay: boolean;
    tickets: { status: string }[];
  }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [today, setToday] = useState<TodayResponse | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [sprints, setSprints] = useState<SprintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, p, s] = await Promise.all([
        fetch("/api/today").then((r) => r.json()),
        fetch("/api/progress").then((r) => r.json()),
        fetch("/api/sprints").then((r) => r.json()),
      ]);
      setToday(t);
      setProgress(p);
      setSprints(s.sprints ?? []);
      if (t.needsOnboarding) router.replace("/settings");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const incomplete = useMemo(
    () => today?.day?.tickets.filter((t) => t.status !== "DONE") ?? [],
    [today]
  );

  const handleSpill = useCallback(async () => {
    setBusy(true);
    try {
      let count = 0;
      for (const t of incomplete) {
        const res = await fetch(`/api/tickets/${t.id}/spillover`, {
          method: "POST",
        });
        if (res.ok) count += 1;
      }
      toast(
        count
          ? `${count} ticket${count === 1 ? "" : "s"} spilled over.`
          : "Nothing to spill.",
        count ? "warning" : "info"
      );
      await load();
    } finally {
      setBusy(false);
    }
  }, [incomplete, load, toast]);

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-up">
        <div className="skeleton h-8 w-64 rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  const profile = today?.profile;
  const stats = progress?.stats;
  const active =
    sprints.find((s) => s.status === "ACTIVE") ??
    sprints.find((s) => s.weekNumber === today?.sprint?.weekNumber) ??
    sprints[0];
  const companies = parseJsonArray(profile?.targetCompanies);
  const dayPct =
    today?.summary && today.summary.total
      ? Math.round((today.summary.completed / today.summary.total) * 100)
      : 0;
  const sprintPct = active?.counts.total
    ? Math.round((active.counts.done / active.counts.total) * 100)
    : (stats?.sprintCompletion ?? 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171B2D] sm:text-3xl">
            {greetingForHour()}, {profile?.name ?? "there"}
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7280]">
            {active
              ? `You're on Sprint ${String(active.weekNumber).padStart(2, "0")} of your ${sprints.length}-week plan.`
              : "Save your profile in Settings to load the Planly syllabus."}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#6B7280]">
            <span className="rounded-full border border-[#E6E8EF] bg-white px-2.5 py-1">
              {companies.slice(0, 3).join(" + ") || "Set targets"}
            </span>
            <span className="rounded-full border border-[#E6E8EF] bg-white px-2.5 py-1">
              {profile?.targetRole ?? "Role"}
            </span>
          </div>
        </div>
        <Link href="/today">
          <Button variant="outline">Open today</Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Overall Progress" value={`${stats?.overall ?? 0}%`} />
        <MetricCard label="Sprint Progress" value={`${sprintPct}%`} />
        <MetricCard
          label="Current Streak"
          value={`${stats?.currentStreak ?? 0} days`}
        />
        <MetricCard
          label="Tickets Completed"
          value={`${stats?.ticketsCompleted ?? 0}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          {active && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#635BFF]">
                      Sprint {String(active.weekNumber).padStart(2, "0")}
                    </p>
                    <CardTitle className="mt-1 text-lg">{active.title}</CardTitle>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      {format(new Date(active.startDate), "MMM d")} —{" "}
                      {format(new Date(active.endDate), "MMM d")}
                    </p>
                  </div>
                  <Link href={`/sprints/${active.id}`}>
                    <Button size="sm" variant="outline">
                      Open sprint
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1.5 flex justify-between text-xs text-[#6B7280]">
                    <span>
                      {active.counts.done} / {active.counts.total} tickets
                      completed
                    </span>
                    <span className="font-medium text-[#5148E8]">
                      {sprintPct}%
                    </span>
                  </div>
                  <Progress value={sprintPct} size="lg" />
                </div>
                <SprintTimeline days={active.days ?? []} sprintId={active.id} />
              </CardContent>
            </Card>
          )}

          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#171B2D]">
                  Today&apos;s Sprint
                </h2>
                <p className="text-sm text-[#6B7280]">
                  {today?.day
                    ? `${today.day.dayName} · ${format(new Date(today.day.date), "MMM d")} · ${formatMinutes(today.day.plannedMin)} planned · ${dayPct}% completed`
                    : "No study day scheduled"}
                </p>
              </div>
              {incomplete.length > 0 && (
                <Button
                  size="sm"
                  variant="warning"
                  disabled={busy}
                  onClick={handleSpill}
                >
                  End day · spill incomplete
                </Button>
              )}
            </div>

            {today?.day && (
              <Progress value={dayPct} className="mb-1" size="md" />
            )}

            {!sprints.length && (
              <Card>
                <CardContent className="space-y-3 py-10 text-center">
                  <p className="text-sm text-[#6B7280]">
                    No plan yet. Open Settings, save your profile, and the Planly
                    syllabus will be scheduled automatically.
                  </p>
                  <Link href="/settings">
                    <Button>Open Settings</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {sprints.length > 0 && !today?.day?.tickets.length && (
              <Card>
                <CardContent className="py-8 text-center text-sm text-[#6B7280]">
                  Rest day or nothing assigned. Check{" "}
                  <Link href="/roadmap" className="text-[#635BFF] underline">
                    My Plan
                  </Link>
                  .
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {today?.day?.tickets.map((t) => (
                <TicketAccordion
                  key={t.id}
                  ticket={{
                    ...t,
                    contentId: t.contentId,
                    itemCount: t.items?.length || 1,
                    items: t.items?.map((i) => ({
                      id: i.id,
                      title: i.title ?? "",
                      leetcodeUrl: i.leetcodeUrl ?? null,
                      gfgUrl: i.gfgUrl ?? null,
                      isCompleted: Boolean(i.isCompleted),
                    })),
                  }}
                  defaultOpen
                  onChanged={load}
                />
              ))}
            </div>

            {incomplete.length > 0 && (
              <SpilloverPanel
                tickets={incomplete.map((t) => ({
                  id: t.id,
                  contentId: t.contentId,
                  title: t.title,
                  category: t.category,
                  estimatedMinutes: t.estimatedMinutes,
                }))}
                capacityMin={today?.day?.capacityMin ?? 153}
                availableMin={Math.max(
                  0,
                  (today?.day?.capacityMin ?? 153) -
                    (today?.day?.tickets
                      .filter((t) => t.status === "DONE")
                      .reduce((s, t) => s + t.estimatedMinutes, 0) ?? 0)
                )}
              />
            )}
          </section>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Study load</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#6B7280]">
              <div className="flex justify-between">
                <span>Daily capacity</span>
                <span className="font-medium text-[#171B2D]">
                  {formatMinutes(today?.day?.capacityMin ?? 153)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Planned today</span>
                <span className="font-medium text-[#171B2D]">
                  {formatMinutes(today?.day?.plannedMin ?? 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Study logged</span>
                <span className="font-medium text-[#171B2D]">
                  {formatHoursMinutes(stats?.studyMinutes ?? 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming sprints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sprints
                .filter((s) => s.weekNumber > (active?.weekNumber ?? 0))
                .slice(0, 3)
                .map((s) => (
                  <Link
                    key={s.id}
                    href={`/sprints/${s.id}`}
                    className="block rounded-xl border border-[#E6E8EF] px-3 py-2.5 transition hover:border-[#635BFF]/30 hover:bg-[#635BFF]/5"
                  >
                    <div className="text-[11px] font-medium text-[#8B90A5]">
                      Sprint {String(s.weekNumber).padStart(2, "0")}
                    </div>
                    <div className="text-sm font-medium text-[#171B2D]">
                      {s.title}
                    </div>
                  </Link>
                ))}
              {!sprints.length && (
                <p className="text-xs text-[#6B7280]">
                  Save profile in Settings to load your plan.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
