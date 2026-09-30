"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { useToast } from "@/components/ToastProvider";

const COMPANIES = [
  "Atlassian",
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Uber",
  "Flipkart",
  "Other",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("Mukul");
  const [yearsExperience, setYearsExperience] = useState("5+");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [companies, setCompanies] = useState(["Google", "Amazon", "Meta", "Microsoft"]);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [daysPerWeek, setDaysPerWeek] = useState(6);
  const [preferredStudyDays, setPreferredStudyDays] = useState(
    DAYS.filter((d) => d !== "Sunday")
  );
  const [dsaLanguage, setDsaLanguage] = useState("C++");
  const [dsaLevel, setDsaLevel] = useState("Basic");
  const [lldLevel, setLldLevel] = useState("New to this");
  const [hldLevel, setHldLevel] = useState("Beginner");
  const [problemsSolved, setProblemsSolved] = useState(0);

  useEffect(() => {
    void fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.profile) return;
        const p = data.profile;
        setName(p.name);
        setYearsExperience(p.yearsExperience);
        setTargetRole(p.targetRole);
        try {
          setCompanies(JSON.parse(p.targetCompanies));
          setPreferredStudyDays(JSON.parse(p.preferredStudyDays));
        } catch {
          /* ignore */
        }
        setHoursPerDay(p.hoursPerDay);
        setDaysPerWeek(p.daysPerWeek);
        setDsaLanguage(p.dsaLanguage);
        setDsaLevel(p.dsaLevel);
        setLldLevel(p.lldLevel);
        setHldLevel(p.hldLevel);
        setProblemsSolved(p.problemsSolved);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCompany = useCallback(
    (value: string) => {
      setCompanies((list) =>
        list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
      );
    },
    []
  );

  const toggleDay = useCallback((value: string) => {
    setPreferredStudyDays((list) =>
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!companies.length || !preferredStudyDays.length) {
      toast("Pick at least one company and study day.", "error");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          yearsExperience,
          targetRole,
          targetCompanies: companies,
          durationWeeks: 24,
          hoursPerDay,
          daysPerWeek: preferredStudyDays.length,
          preferredStudyDays,
          dsaLanguage,
          dsaLevel,
          lldLevel,
          hldLevel,
          problemsSolved,
          topicsCompleted: [],
          topicsWeak: [],
          topicsNotStarted: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      toast(
        data.roadmapCreated
          ? "Profile saved · Planly syllabus scheduled."
          : "Profile saved.",
        "success"
      );
      router.push("/");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to save", "error");
    } finally {
      setBusy(false);
    }
  }, [
    name,
    yearsExperience,
    targetRole,
    companies,
    hoursPerDay,
    preferredStudyDays,
    dsaLanguage,
    dsaLevel,
    lldLevel,
    hldLevel,
    problemsSolved,
    toast,
    router,
  ]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-3">
        <div className="skeleton h-8 w-40 rounded-lg" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-[#171B2D]">Settings</h1>
        <p className="text-sm text-[#6B7280]">
          Profile and study schedule only. Saving creates the Planly plan if you
          don&apos;t have one yet.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Experience</Label>
              <Select
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
              >
                {["0-1", "1-3", "3-5", "5+", "10+"].map((y) => (
                  <option key={y} value={y}>
                    {y} years
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Target role</Label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Target companies</Label>
            <div className="flex flex-wrap gap-2">
              {COMPANIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCompany(c)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    companies.includes(c)
                      ? "border-[#635BFF] bg-[#635BFF]/10 text-[#5148E8]"
                      : "border-[#E6E8EF] text-[#6B7280]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Hours / day</Label>
              <Input
                type="number"
                min={1}
                max={8}
                step={0.5}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>DSA language</Label>
              <Select
                value={dsaLanguage}
                onChange={(e) => setDsaLanguage(e.target.value)}
              >
                {["Python", "JavaScript", "TypeScript", "Java", "C++"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>DSA level</Label>
              <Select value={dsaLevel} onChange={(e) => setDsaLevel(e.target.value)}>
                {["New to this", "Basic", "Intermediate", "Advanced"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>LLD level</Label>
              <Select value={lldLevel} onChange={(e) => setLldLevel(e.target.value)}>
                {["New to this", "Basic", "Intermediate", "Advanced"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>HLD level</Label>
              <Select value={hldLevel} onChange={(e) => setHldLevel(e.target.value)}>
                {["New to this", "Basic", "Intermediate", "Advanced"].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Problems solved (approx)</Label>
              <Input
                type="number"
                min={0}
                value={problemsSolved}
                onChange={(e) => setProblemsSolved(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Study days ({daysPerWeek} / week)</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    toggleDay(d);
                    setDaysPerWeek((n) => {
                      const next = preferredStudyDays.includes(d) ? n - 1 : n + 1;
                      return Math.max(1, next);
                    });
                  }}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    preferredStudyDays.includes(d)
                      ? "border-[#635BFF] bg-[#635BFF]/10 text-[#5148E8]"
                      : "border-[#E6E8EF] text-[#6B7280]"
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full" size="lg" disabled={busy} onClick={handleSave}>
            {busy ? "Saving…" : "Save profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
