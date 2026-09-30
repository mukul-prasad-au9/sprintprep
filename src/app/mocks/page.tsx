"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMinutes, ticketCode } from "@/lib/utils";

type Ticket = {
  id: string;
  contentId: string;
  title: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
  status: string;
  topic: string;
};

export default function MocksPage() {
  const [mocks, setMocks] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const sprints = await fetch("/api/sprints").then((r) => r.json());
      const found: Ticket[] = [];
      for (const s of (sprints.sprints ?? []).slice(-4)) {
        const detail = await fetch(`/api/sprints/${s.id}`).then((r) => r.json());
        for (const day of detail.sprint?.days ?? []) {
          for (const t of day.tickets ?? []) {
            if (t.category === "MOCK") found.push(t);
          }
        }
      }
      // Also surface content-level mocks if none scheduled yet
      if (!found.length) {
        // show placeholder from known seed IDs via a lightweight message
      }
      setMocks(found);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-[#171B2D]">Mock Interviews</h1>
        <p className="text-sm text-[#6B7280]">
          Timed DSA, LLD, and HLD simulations scheduled in later sprints
        </p>
      </div>

      {loading ? (
        <div className="skeleton h-40 rounded-2xl" />
      ) : mocks.length ? (
        <div className="space-y-3">
          {mocks.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex items-center justify-between gap-4 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#8B90A5]">
                      {ticketCode(m.category, m.contentId)}
                    </span>
                    <Badge variant="mock">MOCK</Badge>
                    <Badge variant="outline">{m.difficulty}</Badge>
                  </div>
                  <h3 className="mt-1 font-semibold">{m.title}</h3>
                  <p className="text-xs text-[#6B7280]">
                    {m.topic} · {formatMinutes(m.estimatedMinutes)}
                  </p>
                </div>
                <Button size="sm" onClick={() => void load()}>
                  Refresh
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mocks unlock later in the plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#6B7280]">
            <p>
              Full-loop, DSA timed, LLD, and HLD mocks are seeded in the content
              library and appear in the final weeks of your roadmap.
            </p>
            <ul className="space-y-1 text-[#171B2D]">
              <li>• Timed DSA Mock (Easy/Medium) — 60 min</li>
              <li>• Timed DSA Mock (Medium/Hard) — 75 min</li>
              <li>• LLD Mock Interview — 60 min</li>
              <li>• HLD Mock Interview — 60 min</li>
              <li>• Full Loop Simulation — 90 min</li>
            </ul>
            <Link href="/roadmap">
              <Button variant="outline" size="sm">
                View roadmap
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
