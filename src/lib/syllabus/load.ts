import { readFileSync } from "fs";
import { join } from "path";
import type { SyllabusSubject } from "./types";
import { flattenSyllabus } from "./flatten";
import type { FlatTopic } from "./types";

type PlanlyFile = {
  data?: {
    syllabus_snapshot?: {
      syllabus_snapshot?: {
        subjects?: SyllabusSubject[];
        total_est_minutes?: number;
      };
    };
    role?: string;
    experience?: string;
    prefered_coding_language?: string;
    interview_target?: string;
  };
  syllabus_snapshot?: {
    subjects?: SyllabusSubject[];
  };
  subjects?: SyllabusSubject[];
};

let cached: FlatTopic[] | null = null;
let cachedSubjects: SyllabusSubject[] | null = null;

export function loadPlanlySubjects(): SyllabusSubject[] {
  if (cachedSubjects) return cachedSubjects;

  const path = join(process.cwd(), "data", "planly-syllabus.json");
  const raw = JSON.parse(readFileSync(path, "utf8")) as PlanlyFile;

  const subjects =
    raw.data?.syllabus_snapshot?.syllabus_snapshot?.subjects ??
    raw.syllabus_snapshot?.subjects ??
    raw.subjects ??
    [];

  if (!subjects.length) {
    throw new Error("Planly syllabus has no subjects");
  }

  cachedSubjects = subjects;
  return subjects;
}

export function loadPlanlyTopics(): FlatTopic[] {
  if (cached) return cached;
  cached = flattenSyllabus(loadPlanlySubjects());
  return cached;
}

export function planlyMeta() {
  const path = join(process.cwd(), "data", "planly-syllabus.json");
  const raw = JSON.parse(readFileSync(path, "utf8")) as PlanlyFile;
  const snap = raw.data?.syllabus_snapshot?.syllabus_snapshot;
  return {
    role: raw.data?.role ?? "Software Engineer",
    experience: raw.data?.experience ?? "5+",
    language: raw.data?.prefered_coding_language ?? "cpp",
    interviewTarget: raw.data?.interview_target ?? "FAANG",
    totalEstMinutes: snap?.total_est_minutes ?? 0,
    subjectCount: snap?.subjects?.length ?? 0,
  };
}
