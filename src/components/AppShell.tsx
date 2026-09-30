"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  CalendarCheck2,
  Ticket,
  TrendingUp,
  Mic2,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "My Plan", icon: Map },
  { href: "/today", label: "Today's Sprint", icon: CalendarCheck2 },
  { href: "/tickets", label: "Tickets", icon: Ticket },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/mocks", label: "Mock Interviews", icon: Mic2 },
];

type ProfileBrief = {
  name: string;
  yearsExperience: string;
  targetRole: string;
} | null;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileBrief>(null);

  useEffect(() => {
    void fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setProfile({
            name: d.profile.name,
            yearsExperience: d.profile.yearsExperience,
            targetRole: d.profile.targetRole,
          });
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  const hideShell =
    pathname.startsWith("/onboarding") || pathname.startsWith("/assessment");

  // Settings stays inside the shell
  if (hideShell) {
    return <>{children}</>;
  }

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-5">
        <Link href="/" className="block">
          <div className="text-lg font-bold tracking-tight text-white">
            SprintPrep
          </div>
          <div className="mt-0.5 text-[11px] text-[#8b90a5]">
            Turn prep into sprints
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[#635BFF]/15 text-white"
                  : "text-[#8b90a5] hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn("h-4 w-4", active ? "text-[#635BFF]" : "")}
                strokeWidth={1.75}
              />
              {item.label}
            </Link>
          );
        })}

        <div className="my-4 border-t border-white/10" />

        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            isActive("/settings")
              ? "bg-[#635BFF]/15 text-white"
              : "text-[#8b90a5] hover:bg-white/5 hover:text-white"
          )}
        >
          <Settings className="h-4 w-4" strokeWidth={1.75} />
          Settings
        </Link>
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
        <div className="text-sm font-medium text-white">
          {profile?.name ?? "Guest"}
        </div>
        <div className="mt-0.5 text-[11px] text-[#8b90a5]">
          {profile?.yearsExperience ?? "—"} ·{" "}
          {profile?.targetRole ?? "Set up profile"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] bg-[#111522] lg:block">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-[#111522] shadow-xl">
            <button
              type="button"
              className="absolute top-4 right-3 rounded-md p-1 text-[#8b90a5] hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-[240px]">
        <header className="sticky top-0 z-30 border-b border-[#E6E8EF] bg-white/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-md p-1.5 text-[#6B7280] hover:bg-[#F7F8FC] lg:hidden"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden text-sm text-[#6B7280] sm:block">
                Interview preparation workspace
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <span className="hidden rounded-full border border-[#E6E8EF] bg-[#F7F8FC] px-2.5 py-1 sm:inline">
                Local · Personal
              </span>
              {profile && (
                <span className="rounded-full bg-[#635BFF]/10 px-2.5 py-1 font-medium text-[#5148E8]">
                  {profile.name}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="sticky bottom-0 z-30 flex border-t border-[#E6E8EF] bg-white lg:hidden">
          {NAV.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px]",
                  active ? "text-[#635BFF]" : "text-[#6B7280]"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
