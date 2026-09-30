import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/sprints", label: "Sprints" },
  { href: "/onboarding", label: "Profile" },
];

export function AppNav({ active }: { active?: string }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-indigo-700">
              SprintPrep
            </span>
            <span className="text-[11px] text-slate-500">
              Interview Preparation
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  active === l.href && "bg-indigo-50 font-medium text-indigo-700"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="text-xs text-slate-400">Local · Personal use</div>
      </div>
    </header>
  );
}
