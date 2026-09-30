import { prisma } from "@/lib/db";
import { loadPlanlyTopics } from "./load";
import { resolveProblemUrls } from "./urls";
import { subjectToCategory } from "./types";

/** Upsert all Planly topics into ContentItem (idempotent). */
export async function syncPlanlyContent(): Promise<number> {
  const topics = loadPlanlyTopics();
  let count = 0;

  // Batch in chunks to avoid huge transactions
  const chunkSize = 50;
  for (let i = 0; i < topics.length; i += chunkSize) {
    const chunk = topics.slice(i, i + chunkSize);
    await prisma.$transaction(
      chunk.map((t) => {
        const { leetcodeUrl, gfgUrl } = resolveProblemUrls(t.slug);
        const difficulty =
          t.estimatedMinutes >= 40
            ? "HARD"
            : t.estimatedMinutes >= 20
              ? "MEDIUM"
              : "EASY";
        const category = subjectToCategory(t.subjectSlug);
        return prisma.contentItem.upsert({
          where: { id: t.contentId },
          create: {
            id: t.contentId,
            title: t.title,
            category,
            topic: t.categoryName,
            subtopic: t.subcategoryName ?? null,
            difficulty,
            estimatedMinutes: t.estimatedMinutes,
            leetcodeUrl,
            gfgUrl,
            tags: JSON.stringify([
              t.subjectSlug,
              t.contentType,
              t.slug,
              ...(t.subcategorySlug ? [t.subcategorySlug] : []),
            ]),
            description: `${t.subjectName} › ${t.categoryName}${
              t.subcategoryName ? ` › ${t.subcategoryName}` : ""
            }`,
          },
          update: {
            title: t.title,
            category,
            topic: t.categoryName,
            subtopic: t.subcategoryName ?? null,
            difficulty,
            estimatedMinutes: t.estimatedMinutes,
            leetcodeUrl,
            gfgUrl,
            tags: JSON.stringify([
              t.subjectSlug,
              t.contentType,
              t.slug,
              ...(t.subcategorySlug ? [t.subcategorySlug] : []),
            ]),
            description: `${t.subjectName} › ${t.categoryName}${
              t.subcategoryName ? ` › ${t.subcategoryName}` : ""
            }`,
          },
        });
      })
    );
    count += chunk.length;
  }

  return count;
}
