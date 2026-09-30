#!/usr/bin/env node
/**
 * On Vercel/Neon: push schema + seed during build.
 * Local sqlite: skip here (use npm run db:setup).
 */
const { spawnSync } = require("child_process");
const url = process.env.DATABASE_URL || "";

if (!/^postgres(ql)?:/i.test(url)) {
  console.log("[migrate-if-postgres] Skipping db push (not postgres)");
  process.exit(0);
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

run("npx", ["prisma", "db", "push"]);
run("npx", ["tsx", "prisma/seed.ts"]);
