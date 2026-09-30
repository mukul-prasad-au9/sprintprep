"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TicketAccordion } from "@/components/TicketAccordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Ticket = {
  id: string;
  contentId: string;
  title: string;
  category: string;
  topic: string;
  difficulty: string;
  estimatedMinutes: number;
  status: string;
  items?: {
    id: string;
    title: string;
    leetcodeUrl: string | null;
    gfgUrl: string | null;
    isCompleted: boolean;
  }[];
};

const FILTERS = ["ALL", "TODO", "IN_PROGRESS", "DONE", "SPILLED", "DSA", "LLD", "HLD"] as const;

function TicketsList() {
  const searchParams = useSearchParams();
  const openId = searchParams.get("open");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets?limit=120");
      const data = await res.json();
      setTickets(data.tickets ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (filter === "ALL") return true;
      if (["DSA", "LLD", "HLD"].includes(filter)) return t.category === filter;
      return t.status === filter;
    });
  }, [tickets, filter]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-[#171B2D]">Tickets</h1>
        <p className="text-sm text-[#6B7280]">
          Expand a day ticket to check off questions
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className={cn(filter === f && "shadow-sm")}
          >
            {f.replace("_", " ")}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.slice(0, 80).map((t) => (
            <TicketAccordion
              key={t.id}
              ticket={{ ...t, itemCount: t.items?.length || 1 }}
              defaultOpen={openId === t.id}
              onChanged={load}
            />
          ))}
          {!filtered.length && (
            <div className="rounded-2xl border border-dashed border-[#E6E8EF] py-12 text-center text-sm text-[#6B7280]">
              No tickets match this filter.
            </div>
          )}
          {filtered.length > 80 && (
            <p className="text-center text-xs text-[#6B7280]">
              Showing first 80 of {filtered.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl space-y-3">
          <div className="skeleton h-8 w-40 rounded-lg" />
          <div className="skeleton h-24 rounded-2xl" />
        </div>
      }
    >
      <TicketsList />
    </Suspense>
  );
}
