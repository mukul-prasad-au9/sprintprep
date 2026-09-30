import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  indicatorClassName,
  size = "md",
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
  size?: "sm" | "md" | "lg";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-2.5" };
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-[#EEF0F6]",
        heights[size],
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[#635BFF] transition-all duration-500 ease-out",
          indicatorClassName
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
