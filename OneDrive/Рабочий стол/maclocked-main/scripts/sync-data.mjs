import { mkdir, copyFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const source = join(root, "data", "schedule.json");
const targetDir = join(root, "public", "data");
const target = join(targetDir, "schedule.json");

async function main() {
  await mkdir(targetDir, { recursive: true });
  await copyFile(source, target);
  console.log(`Synced ${source} -> ${target}`);
}

main().catch((error) => {
  console.error("Failed to sync schedule.json", error);
  process.exitCode = 1;
});
