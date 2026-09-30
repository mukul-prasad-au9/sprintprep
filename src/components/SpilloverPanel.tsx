"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMinutes, ticketCode } from "@/lib/utils";

type SpillTicket = {
  id: string;
  contentId?: string;
  title: string;
  category: string;
  estimatedMinutes: number;
};

export function SpilloverPanel({
  tickets,
  capacityMin,
  availableMin,
}: {
  tickets: SpillTicket[];
  capacityMin: number;
  availableMin: number;
  onApply?: () => void;
  onReview?: () => void;
  busy?: boolean;
}) {
  if (!tickets.length) return null;

  const total = tickets.reduce((s, t) => s + t.estimatedMinutes, 0);
  const fits = total <= availableMin;

  return (
    <Card className="border-[#E59A22]/30 bg-[#FFFBF3]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#b87710]">
          <AlertTriangle className="h-4 w-4" />
          {tickets.length} incomplete ticket{tickets.length === 1 ? "" : "s"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-lg border border-[#E59A22]/20 bg-white px-3 py-2 text-sm"
            >
              <div>
                <div className="font-mono text-[11px] text-[#8B90A5]">
                  {ticketCode(t.category, t.contentId ?? t.id)}
                </div>
                <div className="font-medium text-[#171B2D]">{t.title}</div>
              </div>
              <div className="text-xs text-[#6B7280]">
                {formatMinutes(t.estimatedMinutes)}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#E6E8EF] bg-white p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8B90A5]">
            Capacity check
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[#6B7280]">
            <div>
              Day capacity:{" "}
              <span className="font-medium text-[#171B2D]">
                {formatMinutes(capacityMin)}
              </span>
            </div>
            <div>
              Available:{" "}
              <span className="font-medium text-[#171B2D]">
                {formatMinutes(availableMin)}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-[#171B2D]">
            {fits
              ? "These can fit into upcoming capacity if spilled."
              : "Use Spill on each ticket to move unfinished work forward."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
