export type SyllabusTopic = {
  content_id: number;
  content_name: string;
  content_slug: string;
  content_type: string;
  est_minutes: number;
  rank: number;
};

export type SyllabusCategory = {
  id: number;
  name: string;
  slug: string;
  est_minutes: number;
  topics: SyllabusTopic[];
  subcategories: {
    id: number;
    name: string;
    slug: string;
    type?: string;
    est_minutes: number;
    topics: SyllabusTopic[];
  }[];
};

export type SyllabusSubject = {
  subject_slug: string;
  subject_name: string;
  importance?: string;
  priority_rank?: number;
  selected_level?: string;
  est_minutes?: number;
  categories: SyllabusCategory[];
};

export type FlatTopic = {
  contentId: string; // planly-{id}
  sourceContentId: number;
  title: string;
  slug: string;
  contentType: string; // Practice | Theory
  estimatedMinutes: number;
  subjectSlug: string;
  subjectName: string;
  categoryName: string;
  categorySlug: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  rank: number;
};

export function subjectToCategory(subjectSlug: string): string {
  if (subjectSlug === "dsa") return "DSA";
  if (subjectSlug === "lld") return "LLD";
  if (subjectSlug === "oops") return "LLD"; // OOP fundamentals sit with LLD track
  if (subjectSlug === "hld") return "HLD";
  return "MIXED";
}
