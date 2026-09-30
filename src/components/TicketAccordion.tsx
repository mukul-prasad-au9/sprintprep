"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ToastProvider";
import {
  categoryTone,
  formatMinutes,
  statusLabel,
  ticketCode,
  cn,
} from "@/lib/utils";

export type TicketItemData = {
  id: string;
  title: string;
  leetcodeUrl: string | null;
  gfgUrl: string | null;
  isCompleted: boolean;
};

export type TicketAccordionData = {
  id: string;
  contentId?: string;
  title: string;
  category: string;
  topic: string;
  difficulty: string;
  estimatedMinutes: number;
  status: string;
  items?: TicketItemData[];
  itemCount?: number;
};

export function TicketAccordion({
  ticket,
  defaultOpen = false,
  compact = false,
  onChanged,
}: {
  ticket: TicketAccordionData;
  defaultOpen?: boolean;
  compact?: boolean;
  onChanged?: () => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(defaultOpen);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<TicketItemData[]>(ticket.items ?? []);
  const [status, setStatus] = useState(ticket.status);
  const [loaded, setLoaded] = useState(Boolean(ticket.items?.length));

  useEffect(() => {
    setItems(ticket.items ?? []);
    setStatus(ticket.status);
    if (ticket.items?.length) setLoaded(true);
  }, [ticket.id, ticket.status, ticket.items]);

  const ensureItems = useCallback(async () => {
    if (loaded && items.length) return;
    const res = await fetch(`/api/tickets/${ticket.id}`);
    const data = await res.json();
    if (res.ok && data.ticket?.items) {
      setItems(data.ticket.items);
      setStatus(data.ticket.status);
      setLoaded(true);
    }
  }, [loaded, items.length, ticket.id]);

  const handleToggleOpen = useCallback(async () => {
    const next = !open;
    setOpen(next);
    if (next) await ensureItems();
  }, [open, ensureItems]);

  const toggleItem = useCallback(
    async (itemId: string, isCompleted: boolean) => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId ? { ...i, isCompleted: !isCompleted } : i
        )
      );
      await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemCompleted: !isCompleted }),
      });
      if (status === "TODO") setStatus("IN_PROGRESS");
      onChanged?.();
    },
    [ticket.id, status, onChanged]
  );

  const complete = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/complete`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setStatus("DONE");
      setItems((prev) =>
        prev.map((i) => ({ ...i, isCompleted: true }))
      );
      toast("Day ticket completed", "success");
      onChanged?.();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    } finally {
      setBusy(false);
    }
  }, [ticket.id, toast, onChanged]);

  const spill = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/spillover`, {
        method: "POST",
      });
      const data = await res.json();
      toast(
        data.success ? `Spilled. ${data.reason ?? ""}` : data.reason ?? "Failed",
        data.success ? "warning" : "error"
      );
      if (data.success) {
        setStatus("SPILLED");
        onChanged?.();
      }
    } finally {
      setBusy(false);
    }
  }, [ticket.id, toast, onChanged]);

  const code = ticketCode(ticket.category, ticket.contentId ?? ticket.id);
  const done = status === "DONE";
  const spilled = status === "SPILLED";
  const completedCount = items.filter((i) => i.isCompleted).length;
  const count = items.length || ticket.itemCount || 1;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E6E8EF] bg-white transition-all",
        open && "border-[#635BFF]/30 shadow-[0_8px_24px_rgba(99,91,255,0.08)]",
        done && "opacity-75",
        spilled && "border-[#E59A22]/35 bg-[#FFFBF3]"
      )}
    >
      <button
        type="button"
        onClick={() => void handleToggleOpen()}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-semibold tracking-wide text-[#6B7280]">
              {code}
            </span>
            <Badge variant={categoryTone(ticket.category)}>{ticket.category}</Badge>
            <Badge
              variant={
                done
                  ? "success"
                  : spilled
                    ? "warning"
                    : status === "IN_PROGRESS"
                      ? "default"
                      : "outline"
              }
            >
              {statusLabel(status)}
            </Badge>
          </div>
          <h3
            className={cn(
              "mt-2 font-semibold text-[#171B2D]",
              compact ? "text-sm" : "text-base"
            )}
          >
            {ticket.title}
          </h3>
          <p className="mt-1.5 text-xs text-[#6B7280]">
            {loaded ? `${completedCount}/` : ""}
            {count} question{count === 1 ? "" : "s"} · {ticket.difficulty} ·{" "}
            {formatMinutes(ticket.estimatedMinutes)}
          </p>
          <p className="mt-1 text-xs text-[#8B90A5]">{ticket.topic}</p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-[#8B90A5] transition-transform",
            open && "rotate-180 text-[#635BFF]"
          )}
        />
      </button>

      {open && (
        <div className="border-t border-[#E6E8EF] px-4 pb-4 pt-3">
          {!loaded && items.length === 0 ? (
            <div className="skeleton h-16 rounded-xl" />
          ) : (
            <div className="space-y-2">
              {items.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-start gap-3 rounded-xl border border-[#E6E8EF] px-3 py-2.5"
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#635BFF]"
                    checked={p.isCompleted}
                    disabled={done}
                    onChange={() => void toggleItem(p.id, p.isCompleted)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-mono text-[#8B90A5]">
                      Q{String(idx + 1).padStart(2, "0")}
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        p.isCompleted && "text-[#16A36A] line-through"
                      )}
                    >
                      {p.title}
                    </div>
                    <div className="mt-1">
                      {p.leetcodeUrl ? (
                        <a
                          href={p.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-[#635BFF] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          LeetCode ↗
                        </a>
                      ) : p.gfgUrl ? (
                        <a
                          href={p.gfgUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-[#16A36A] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          GFG ↗
                        </a>
                      ) : (
                        <span className="text-xs text-[#8B90A5]">No public link</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!items.length && (
                <p className="text-sm text-[#6B7280]">No questions in this ticket.</p>
              )}
            </div>
          )}

          {!done && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" disabled={busy} onClick={() => void complete()}>
                Mark day done
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void spill()}
              >
                Spill over
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** @deprecated use TicketAccordion */
export const TicketCard = TicketAccordion;
