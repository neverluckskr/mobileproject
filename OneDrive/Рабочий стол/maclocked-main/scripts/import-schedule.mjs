import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultOutput = join(__dirname, '..', 'data', 'schedule.json');

const [, , inputPath, outputPath = defaultOutput] = process.argv;

if (!inputPath) {
  console.error('Usage: npm run import:schedule <input.csv> [output.json]');
  process.exit(1);
}

const csv = await readFile(inputPath, 'utf8');
const rows = parseCSV(csv);

const baseData = await loadExisting(outputPath);
const groupMap = new Map();

rows.forEach((row) => {
  const classId = row.class || row.classId;
  const day = (row.day || '').toLowerCase();
  const slot = Number(row.slot);
  if (!classId || !day || !slot) return;

  const group = getOrCreateGroup(classId);
  group.days[day] = group.days[day] || [];

  group.days[day].push({
    slot,
    subject: toField(row.subjectBase, row.subjectAlt),
    teacher: toField(row.teacherBase, row.teacherAlt),
    room: toField(row.roomBase, row.roomAlt),
  });
});

const result = {
  meta: baseData.meta,
  slots: baseData.slots,
  groups: Array.from(groupMap.values()).map((group) => ({
    ...group,
    days: Object.fromEntries(
      Object.entries(group.days).map(([day, lessons]) => [
        day,
        lessons.sort((a, b) => a.slot - b.slot),
      ]),
    ),
  })),
};

await writeFile(outputPath, JSON.stringify(result, null, 2));
await syncPublicCopy(outputPath);
console.log(`Schedule exported to ${outputPath}`);

function parseCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return [];
  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(delimiter).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(delimiter);
    return headers.reduce((acc, header, index) => {
      acc[header.trim()] = cells[index]?.trim() ?? '';
      return acc;
    }, {});
  });
}

async function loadExisting(path) {
  try {
    const data = await readFile(path, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      meta: {
        cycleAnchor: '2024-05-13',
        timeZone: 'Europe/Kyiv',
        defaultClass: '10A',
        classes: [],
      },
      slots: [],
      groups: [],
    };
  }
}

function getOrCreateGroup(id) {
  if (!groupMap.has(id)) {
    groupMap.set(id, { id, days: {} });
  }
  return groupMap.get(id);
}

function toField(base, alternate) {
  const normalizedBase = base?.trim();
  const normalizedAlt = alternate?.trim();
  if (!normalizedAlt && normalizedBase) return normalizedBase;
  if (!normalizedBase && !normalizedAlt) return null;
  return {
    base: normalizedBase || null,
    alternate: normalizedAlt || null,
  };
}

async function syncPublicCopy(source) {
  const publicDir = join(__dirname, '..', 'public', 'data');
  await mkdir(publicDir, { recursive: true });
  const target = join(publicDir, 'schedule.json');
  await copyFile(source, target);
}
