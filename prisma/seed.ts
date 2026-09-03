import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Copies the current .data/ JSON documents into the Postgres KeyValue table,
// so any CMS edits made during local testing carry over to production.
// Usage: DATABASE_URL="..." npx tsx prisma/seed.ts

const DATA_DIR = join(process.cwd(), ".data");

async function main() {
  const prisma = new PrismaClient();
  if (!existsSync(DATA_DIR)) {
    console.log("No .data/ folder found — nothing to seed.");
    await prisma.$disconnect();
    return;
  }
  const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  let count = 0;
  for (const file of files) {
    const raw = readFileSync(join(DATA_DIR, file), "utf8");
    const value = JSON.parse(raw);
    await prisma.keyValue.upsert({
      where: { key: file },
      create: { key: file, value },
      update: { value },
    });
    count++;
  }
  console.log(`Seeded ${count} documents into KeyValue table.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});