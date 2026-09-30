import type { FlatTopic, SyllabusSubject } from "./types";
import { subjectToCategory } from "./types";

/** Flatten Planly syllabus subjects into ordered study items. */
export function flattenSyllabus(subjects: SyllabusSubject[]): FlatTopic[] {
  const ordered = [...subjects].sort(
    (a, b) => (a.priority_rank ?? 99) - (b.priority_rank ?? 99)
  );
  const out: FlatTopic[] = [];

  for (const subject of ordered) {
    for (const cat of subject.categories ?? []) {
      const direct = [...(cat.topics ?? [])].sort((a, b) => a.rank - b.rank);
      for (const t of direct) {
        out.push({
          contentId: `planly-${t.content_id}`,
          sourceContentId: t.content_id,
          title: t.content_name.trim(),
          slug: t.content_slug,
          contentType: t.content_type,
          estimatedMinutes: Math.max(1, t.est_minutes || 15),
          subjectSlug: subject.subject_slug,
          subjectName: subject.subject_name,
          categoryName: cat.name,
          categorySlug: cat.slug,
          rank: t.rank,
        });
      }

      for (const sub of cat.subcategories ?? []) {
        const topics = [...(sub.topics ?? [])].sort((a, b) => a.rank - b.rank);
        for (const t of topics) {
          out.push({
            contentId: `planly-${t.content_id}`,
            sourceContentId: t.content_id,
            title: t.content_name.trim(),
            slug: t.content_slug,
            contentType: t.content_type,
            estimatedMinutes: Math.max(1, t.est_minutes || 15),
            subjectSlug: subject.subject_slug,
            subjectName: subject.subject_name,
            categoryName: cat.name,
            categorySlug: cat.slug,
            subcategoryName: sub.name,
            subcategorySlug: sub.slug,
            rank: t.rank,
          });
        }
      }
    }
  }

  return out;
}

export { subjectToCategory };
