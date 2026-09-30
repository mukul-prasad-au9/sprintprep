"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { TicketAccordion } from "@/components/TicketAccordion";
import { SpilloverPanel } from "@/components/SpilloverPanel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ToastProvider";
import { formatMinutes } from "@/lib/utils";
import { useRouter } from "next/navigation";

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

export default function TodayPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [day, setDay] = useState<{
    dayName: string;
    date: string;
    capacityMin: number;
    plannedMin: number;
    tickets: Ticket[];
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/today");
      const data = await res.json();
      if (data.needsOnboarding) {
        router.replace("/settings");
        return;
      }
      setDay(data.day);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const dayTicket = day?.tickets[0] ?? null;
  const items = dayTicket?.items ?? [];
  const completedItems = items.filter((i) => i.isCompleted).length;
  const itemPct = items.length
    ? Math.round((completedItems / items.length) * 100)
    : dayTicket?.status === "DONE"
      ? 100
      : 0;

  const incomplete = useMemo(
    () => day?.tickets.filter((t) => t.status !== "DONE") ?? [],
    [day]
  );

  const spillAll = useCallback(async () => {
    setBusy(true);
    try {
      for (const t of incomplete) {
        await fetch(`/api/tickets/${t.id}/spillover`, { method: "POST" });
      }
      toast(
        incomplete.length
          ? `${incomplete.length} day ticket spilled over.`
          : "Nothing to spill.",
        incomplete.length ? "warning" : "info"
      );
      await load();
    } finally {
      setBusy(false);
    }
  }, [incomplete, load, toast]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="skeleton h-10 w-40 rounded-lg" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-28 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#635BFF]">
            Today
          </p>
          <h1 className="text-2xl font-bold text-[#171B2D]">
            {day
              ? format(new Date(day.date), "EEEE, MMMM d")
              : "No sprint today"}
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            {day
              ? `${formatMinutes(day.plannedMin)} / ${formatMinutes(day.capacityMin)} planned · 1 ticket`
              : "Rest day — nothing scheduled."}
          </p>
        </div>
        {incomplete.length > 0 && (
          <Button variant="warning" size="sm" disabled={busy} onClick={spillAll}>
            Spill incomplete
          </Button>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex justify-between text-xs text-[#6B7280]">
          <span>
            {completedItems} / {items.length || (dayTicket ? 1 : 0)} questions
          </span>
          <span className="font-medium text-[#5148E8]">{itemPct}%</span>
        </div>
        <Progress value={itemPct} size="lg" />
      </div>

      {dayTicket ? (
        <TicketAccordion
          ticket={{
            ...dayTicket,
            itemCount: dayTicket.items?.length || 1,
          }}
          defaultOpen
          onChanged={load}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-[#E6E8EF] bg-white py-12 text-center text-sm text-[#6B7280]">
          Nothing scheduled for today.
        </div>
      )}

      {incomplete.length > 0 && (
        <SpilloverPanel
          tickets={incomplete}
          capacityMin={day?.capacityMin ?? 153}
          availableMin={Math.max(
            0,
            (day?.capacityMin ?? 153) -
              (day?.tickets
                .filter((t) => t.status === "DONE")
                .reduce((s, t) => s + t.estimatedMinutes, 0) ?? 0)
          )}
        />
      )}
    </div>
  );
}
