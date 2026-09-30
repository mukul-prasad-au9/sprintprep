"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatHoursMinutes, skillBar } from "@/lib/utils";

type ProgressData = {
  stats?: {
    overall: number;
    dsa: number;
    lld: number;
    hld: number;
    ticketsCompleted: number;
    ticketsMissed: number;
    ticketsSpilled: number;
    problemsSolved: number;
    studyMinutes: number;
    currentStreak: number;
    weakAreas: string[];
    byCategory: {
      dsa: { total: number; completed: number };
      lld: { total: number; completed: number };
      hld: { total: number; completed: number };
    };
  };
  skills?: {
    dsaScore: number;
    lldScore: number;
    hldScore: number;
    communication: number;
  };
};

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/progress");
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="skeleton h-8 w-56 rounded-lg" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  const stats = data?.stats;
  const skills = data?.skills;
  const remaining =
    (stats?.byCategory.dsa.total ?? 0) +
    (stats?.byCategory.lld.total ?? 0) +
    (stats?.byCategory.hld.total ?? 0) -
    (stats?.ticketsCompleted ?? 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-[#171B2D]">Progress</h1>
        <p className="text-sm text-[#6B7280]">
          Overall preparation across DSA, LLD, and HLD
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Preparation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-[#635BFF]">
              {stats?.overall ?? 0}%
            </span>
            <span className="text-xs text-[#6B7280]">of roadmap tickets</span>
          </div>
          <Progress value={stats?.overall ?? 0} size="lg" />

          {(
            [
              ["DSA", stats?.dsa ?? 0, "bg-sky-500"],
              ["LLD", stats?.lld ?? 0, "bg-violet-500"],
              ["HLD", stats?.hld ?? 0, "bg-amber-500"],
            ] as const
          ).map(([label, value, color]) => (
            <div key={label} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="font-mono text-[#6B7280]">{value}%</span>
              </div>
              <Progress value={value} indicatorClassName={color} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Tickets completed"
          value={`${stats?.ticketsCompleted ?? 0}`}
          hint={`${Math.max(0, remaining)} remaining`}
        />
        <MetricCard
          label="Spillovers"
          value={`${stats?.ticketsSpilled ?? 0}`}
          hint={`${stats?.ticketsMissed ?? 0} missed marks`}
        />
        <MetricCard
          label="Problems in SprintPrep"
          value={`${stats?.problemsSolved ?? 0}`}
        />
        <MetricCard
          label="Study time"
          value={formatHoursMinutes(stats?.studyMinutes ?? 0)}
          hint={`${stats?.currentStreak ?? 0}-day streak`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill health</CardTitle>
            <p className="text-xs text-[#6B7280]">
              Self-reported / estimated — not a formal assessment
            </p>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-sm">
            {[
              ["DSA", skills?.dsaScore ?? 0],
              ["LLD", skills?.lldScore ?? 0],
              ["HLD", skills?.hldScore ?? 0],
              ["Comm", skills?.communication ?? 0],
            ].map(([label, score]) => (
              <div key={label as string} className="flex items-center gap-3">
                <span className="w-12 text-xs text-[#8B90A5]">{label as string}</span>
                <span className="flex-1 text-[#635BFF]">
                  {skillBar(score as number)}
                </span>
                <span className="w-10 text-right text-xs">{score as number}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weak areas</CardTitle>
          </CardHeader>
          <CardContent>
            {(stats?.weakAreas?.length ?? 0) === 0 ? (
              <p className="text-sm text-[#6B7280]">None flagged yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {stats!.weakAreas.map((w) => (
                  <li
                    key={w}
                    className="rounded-lg border border-[#E6E8EF] bg-[#F7F8FC] px-3 py-2"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/settings"
              className="mt-4 inline-block text-xs text-[#635BFF] hover:underline"
            >
              Edit in settings →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
