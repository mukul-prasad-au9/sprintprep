import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "outline"
    | "dsa"
    | "lld"
    | "hld"
    | "rev"
    | "mock";
}) {
  const variants: Record<string, string> = {
    default: "bg-[#635BFF]/10 text-[#5148E8] border-[#635BFF]/15",
    success: "bg-[#16A36A]/10 text-[#16A36A] border-[#16A36A]/20",
    warning: "bg-[#E59A22]/10 text-[#b87710] border-[#E59A22]/20",
    danger: "bg-[#DD5365]/10 text-[#DD5365] border-[#DD5365]/20",
    outline: "bg-white text-[#6B7280] border-[#E6E8EF]",
    dsa: "bg-sky-50 text-sky-700 border-sky-100",
    lld: "bg-violet-50 text-violet-700 border-violet-100",
    hld: "bg-amber-50 text-amber-800 border-amber-100",
    rev: "bg-emerald-50 text-emerald-700 border-emerald-100",
    mock: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
