import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#635BFF] text-white shadow-sm hover:bg-[#5148E8]",
        secondary: "bg-[#F7F8FC] text-[#171B2D] hover:bg-[#EEF0F6]",
        outline:
          "border border-[#E6E8EF] bg-white text-[#171B2D] hover:bg-[#F7F8FC]",
        ghost: "text-[#6B7280] hover:bg-[#F7F8FC] hover:text-[#171B2D]",
        success: "bg-[#16A36A] text-white hover:bg-[#128a59]",
        warning: "bg-[#E59A22] text-white hover:bg-[#cc881c]",
        danger: "bg-[#DD5365] text-white hover:bg-[#c94758]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
