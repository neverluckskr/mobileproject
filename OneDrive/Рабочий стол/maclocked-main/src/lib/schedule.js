import {
  addDays,
  formatDate,
  getDayKey,
  getStartOfWeek,
  getZonedNow,
  humanizeDiff,
  isBaseWeek,
  zonedDateFromParts,
} from "./time.js";

export const DAY_LABELS = {
  monday: "Понеділок",
  tuesday: "Вівторок",
  wednesday: "Середа",
  thursday: "Четвер",
  friday: "Пʼятниця",
  saturday: "Субота",
  sunday: "Неділя",
};

export const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function resolveField(field, baseWeek) {
  if (field == null) return null;
  if (typeof field === "string") return field;
  return baseWeek ? field.base ?? null : field.alternate ?? null;
}

export function getDateForDay(dayKey, referenceDate) {
  const monday = getStartOfWeek(referenceDate);
  const offset = DAY_ORDER.indexOf(dayKey);
  if (offset === -1) return monday;
  return addDays(monday, offset);
}

export function getLessonsForDay(schedule, classId, dayKey, mode, dayDate) {
  if (!schedule?.groups?.length) return [];
  const group = schedule.groups.find((item) => item.id === classId);
  if (!group) return [];
  const plan = group.days?.[dayKey] ?? [];
  const baseWeek = isBaseWeek(dayDate, getAnchor(schedule));
  const isShort = mode === "short";
  const year = dayDate.getFullYear();
  const month = dayDate.getMonth() + 1;
  const day = dayDate.getDate();

  return plan
    .map((entry) => {
      const slot = schedule.slots.find((s) => s.number === entry.slot);
      if (!slot) return null;
      if (isShort && slot.number > 6) return null;
      const subject = resolveField(entry.subject, baseWeek);
      if (!subject) return null;
      const teacher = resolveField(entry.teacher, baseWeek) || "—";
      const room = resolveField(entry.room, baseWeek) || "—";
      const [startHour, startMinute] = slot.start.split(":").map(Number);
      const [endHour, endMinute] = slot.end.split(":").map(Number);
      const startDate = zonedDateFromParts({
        year,
        month,
        day,
        hour: startHour,
        minute: startMinute,
      });
      const endDate = zonedDateFromParts({
        year,
        month,
        day,
        hour: endHour,
        minute: endMinute,
      });
      return {
        slot: slot.number,
        start: slot.start,
        end: slot.end,
        subject,
        teacher,
        room,
        startDate,
        endDate,
      };
    })
    .filter(Boolean);
}

export function findActiveLesson(lessons, now = new Date()) {
  return lessons.find((lesson) => lesson.endDate >= now) ?? null;
}

export function findNextLesson(schedule, classId, mode) {
  if (!schedule) return null;
  const now = new Date();
  const kyivNow = getZonedNow();

  for (let offset = 0; offset < 14; offset += 1) {
    const dayDate = addDays(kyivNow, offset);
    const dayKey = getDayKey(dayDate);
    if (!DAY_LABELS[dayKey]) continue;

    const lessons = getLessonsForDay(schedule, classId, dayKey, mode, dayDate);
    if (!lessons.length) continue;

    const candidate =
      offset === 0
        ? lessons.find((lesson) => lesson.endDate >= now)
        : lessons[0];

    if (!candidate) continue;

    let countdownText = "";
    if (candidate.startDate > now) {
      countdownText = `Старт через ${humanizeDiff(candidate.startDate - now)}`;
    } else if (candidate.endDate >= now) {
      countdownText = "Урок триває";
    } else {
      countdownText = "Урок завершено";
    }

    return { lesson: candidate, dayKey, countdownText, dayDate };
  }

  return null;
}

export function getScheduleMeta(schedule) {
  if (!schedule?.meta) return null;
  const now = getZonedNow();
  const anchor = getAnchor(schedule);
  const base = isBaseWeek(now, anchor);
  return {
    anchor,
    isBaseWeek: base,
    label: base ? "Чітний тиждень" : "Нечітний тиждень",
    updatedAt: formatDate(now, { hour: "2-digit", minute: "2-digit" }),
  };
}

function getAnchor(schedule) {
  const [year, month, day] = schedule.meta.cycleAnchor.split("-").map(Number);
  return zonedDateFromParts({ year, month, day, hour: 12 });
}

export function getClassesWithLabels(schedule) {
  if (!schedule?.groups?.length) return [];
  const labelMap = new Map(
    (schedule?.meta?.classes ?? []).map((item) => [item.id, item.label]),
  );
  return schedule.groups.map((group) => ({
    ...group,
    label: group.label || labelMap.get(group.id) || group.id,
  }));
}
