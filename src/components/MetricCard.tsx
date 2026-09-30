import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E6E8EF] bg-white p-4 shadow-[0_1px_2px_rgba(17,21,34,0.04)]",
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B90A5]">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#171B2D]">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[#6B7280]">{hint}</p>}
    </div>
  );
}
