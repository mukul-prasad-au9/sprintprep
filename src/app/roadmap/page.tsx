"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Sprint = {
  id: string;
  weekNumber: number;
  title: string;
  objective: string | null;
  status: string;
  counts: { total: number; done: number };
};

export default function RoadmapPage() {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [profileMeta, setProfileMeta] = useState("");

  const load = useCallback(async () => {
    const [s, p] = await Promise.all([
      fetch("/api/sprints").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ]);
    setSprints(s.sprints ?? []);
    if (p.profile) {
      const companies = JSON.parse(p.profile.targetCompanies || "[]").join(" + ");
      setProfileMeta(
        `${companies} · ${p.profile.targetRole} · ${p.profile.hoursPerDay}h/day · ${p.profile.daysPerWeek} days/week`
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const mark = (s: Sprint) => {
    if (s.status === "COMPLETED" || (s.counts.done === s.counts.total && s.counts.total > 0))
      return "✓";
    if (s.status === "ACTIVE") return "●";
    if (s.status === "NEEDS_REPLAN") return "!";
    return "○";
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-[#171B2D]">
          Your {sprints.length || "—"} Week Interview Plan
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Planly syllabus · {profileMeta || "complete profile in Settings"}
        </p>
      </div>

      <div className="relative space-y-2 pl-2">
        <div className="absolute top-3 bottom-3 left-[27px] w-px bg-[#E6E8EF]" />
        {sprints.map((s) => {
          const active = s.status === "ACTIVE";
          const done =
            s.status === "COMPLETED" ||
            (s.counts.done === s.counts.total && s.counts.total > 0);
          return (
            <Link key={s.id} href={`/sprints/${s.id}`} className="relative block">
              <div
                className={cn(
                  "flex items-center gap-4 rounded-2xl border bg-white px-4 py-3.5 transition-all",
                  active
                    ? "border-[#635BFF]/40 shadow-[0_8px_24px_rgba(99,91,255,0.1)]"
                    : done
                      ? "border-[#E6E8EF] opacity-60"
                      : "border-[#E6E8EF] hover:border-[#635BFF]/25"
                )}
              >
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    active
                      ? "border-[#635BFF] bg-[#635BFF] text-white"
                      : done
                        ? "border-[#16A36A] bg-[#16A36A]/10 text-[#16A36A]"
                        : "border-[#E6E8EF] bg-white text-[#8B90A5]"
                  )}
                >
                  {mark(s)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#8B90A5]">
                      {String(s.weekNumber).padStart(2, "0")}
                    </span>
                    <span className="truncate font-medium text-[#171B2D]">
                      {s.title}
                    </span>
                  </div>
                  {s.objective && (
                    <p className="truncate text-xs text-[#6B7280]">{s.objective}</p>
                  )}
                </div>
                <Badge variant={active ? "default" : done ? "success" : "outline"}>
                  {s.counts.done}/{s.counts.total}
                </Badge>
              </div>
            </Link>
          );
        })}

        {!sprints.length && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-[#6B7280]">
              No roadmap yet. Save your profile in{" "}
              <Link href="/settings" className="text-[#635BFF] underline">
                Settings
              </Link>{" "}
              to build the Planly syllabus plan.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
