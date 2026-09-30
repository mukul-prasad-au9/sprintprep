import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type TimelineDay = {
  id: string;
  dayName: string;
  date: string;
  isStudyDay: boolean;
  tickets: { status: string }[];
};

export function SprintTimeline({
  days,
  sprintId,
}: {
  days: TimelineDay[];
  sprintId?: string;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {days.map((d) => {
        const date = new Date(d.date);
        date.setHours(0, 0, 0, 0);
        const isToday = date.getTime() === today.getTime();
        const doneCount = d.tickets.filter((t) => t.status === "DONE").length;
        const total = d.tickets.length;
        const allDone = total > 0 && doneCount === total;
        const hasWork = total > 0;
        const isPast = date < today;

        let mark = "○";
        let tone = "text-[#8B90A5]";
        if (!d.isStudyDay) {
          mark = "—";
          tone = "text-[#C5C9D6]";
        } else if (allDone) {
          mark = "✓";
          tone = "text-[#16A36A]";
        } else if (isToday) {
          mark = "●";
          tone = "text-[#635BFF]";
        } else if (isPast && hasWork) {
          mark = "●";
          tone = "text-[#E59A22]";
        }

        const inner = (
          <div
            className={cn(
              "min-w-[72px] rounded-xl border px-2.5 py-2.5 text-center transition-colors",
              isToday
                ? "border-[#635BFF]/40 bg-[#635BFF]/5"
                : "border-[#E6E8EF] bg-white hover:border-[#635BFF]/25"
            )}
          >
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#8B90A5]">
              {d.dayName.slice(0, 3)}
            </div>
            <div className={cn("my-1 text-lg font-semibold", tone)}>{mark}</div>
            <div className="text-[11px] text-[#6B7280]">
              {format(date, "d")}
            </div>
          </div>
        );

        if (sprintId) {
          return (
            <Link key={d.id} href={`/sprints/${sprintId}#day-${d.id}`}>
              {inner}
            </Link>
          );
        }
        return <div key={d.id}>{inner}</div>;
      })}
    </div>
  );
}
