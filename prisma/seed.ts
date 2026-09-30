import { PrismaClient } from "@prisma/client";
import { dsaContent } from "./seed/dsa";
import { lldContent } from "./seed/lld";
import { hldContent, revisionContent, mockContent } from "./seed/hld";

const prisma = new PrismaClient();

function toRow(item: (typeof dsaContent)[number]) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    topic: item.topic,
    subtopic: item.subtopic ?? null,
    difficulty: item.difficulty,
    estimatedMinutes: item.estimatedMinutes,
    prerequisites: JSON.stringify(item.prerequisites ?? []),
    skills: JSON.stringify(item.skills ?? []),
    leetcodeUrl: item.leetcodeUrl ?? null,
    gfgUrl: item.gfgUrl ?? null,
    solutionUrl: item.solutionUrl ?? null,
    tags: JSON.stringify(item.tags ?? []),
    isRevision: item.isRevision ?? false,
    problemStatement: item.problemStatement ?? null,
    expectedConcepts: item.expectedConcepts
      ? JSON.stringify(item.expectedConcepts)
      : null,
    description: item.description ?? null,
  };
}

async function main() {
  const all = [
    ...dsaContent,
    ...lldContent,
    ...hldContent,
    ...revisionContent,
    ...mockContent,
  ];

  // Validate DSA items have at least one URL
  for (const item of dsaContent) {
    if (!item.leetcodeUrl && !item.gfgUrl) {
      throw new Error(`DSA item ${item.id} missing both leetcodeUrl and gfgUrl`);
    }
  }

  for (const item of all) {
    const row = toRow(item);
    await prisma.contentItem.upsert({
      where: { id: row.id },
      create: row,
      update: row,
    });
  }

  console.log(`Seeded ${all.length} content items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
