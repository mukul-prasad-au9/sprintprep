#!/usr/bin/env node
/**
 * Adapts Prisma provider for the active DATABASE_URL.
 * - file: / sqlite → sqlite (local)
 * - postgres / postgresql → postgresql (Neon / Vercel)
 */
const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
const url = process.env.DATABASE_URL || "";
const isPostgres = /^postgres(ql)?:/i.test(url);

let schema = fs.readFileSync(schemaPath, "utf8");
const provider = isPostgres ? "postgresql" : "sqlite";

schema = schema.replace(
  /datasource db \{[\s\S]*?\n\}/,
  `datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}`
);

fs.writeFileSync(schemaPath, schema);
console.log(`[prepare-db] Using Prisma provider: ${provider}`);
