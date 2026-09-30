"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Sprint = {
  id: string;
  weekNumber: number;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  counts: {
    total: number;
    done: number;
    DSA: number;
    LLD: number;
    HLD: number;
    REVISION: number;
  };
};

export default function SprintsIndexPage() {
  const [sprints, setSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    void fetch("/api/sprints")
      .then((r) => r.json())
      .then((d) => setSprints(d.sprints ?? []));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-[#171B2D]">Sprints</h1>
        <p className="text-sm text-[#6B7280]">Weekly execution boards</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sprints.map((s) => (
          <Link key={s.id} href={`/sprints/${s.id}`}>
            <Card className="h-full">
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[#635BFF]">
                    Sprint {String(s.weekNumber).padStart(2, "0")}
                  </span>
                  <Badge
                    variant={
                      s.status === "ACTIVE"
                        ? "default"
                        : s.status === "COMPLETED"
                          ? "success"
                          : "outline"
                    }
                  >
                    {s.status}
                  </Badge>
                </div>
                <h2 className="font-semibold text-[#171B2D]">{s.title}</h2>
                <p className="text-xs text-[#6B7280]">
                  {format(new Date(s.startDate), "MMM d")} –{" "}
                  {format(new Date(s.endDate), "MMM d")} · {s.counts.total}{" "}
                  tickets · {s.counts.done} done
                </p>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  {[
                    ["DSA", s.counts.DSA],
                    ["LLD", s.counts.LLD],
                    ["HLD", s.counts.HLD],
                    ["Rev", s.counts.REVISION],
                  ].map(([k, v]) => (
                    <div key={k as string} className="rounded-lg bg-[#F7F8FC] py-1.5">
                      <div className="font-semibold text-[#171B2D]">{v as number}</div>
                      <div className="text-[#8B90A5]">{k as string}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
