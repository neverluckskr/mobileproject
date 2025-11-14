const TIME_ZONE = "Europe/Kyiv";
const LOCALE = "uk-UA";

const tzFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour12: false,
  timeZoneName: "shortOffset",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  weekday: "long",
});

const weekdayMap = {
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
  sunday: "sunday",
};

export function getOffsetMinutes(date) {
  const parts = Object.fromEntries(
    tzFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  const tzName = parts.timeZoneName || "GMT+00:00";
  const match = tzName.match(/GMT([+-]\d{1,2})(?::(\d{2}))?/i);
  if (!match) return 0;
  const sign = match[1].startsWith("-") ? -1 : 1;
  const hours = Math.abs(Number(match[1]));
  const minutes = Number(match[2] || "0");
  const total = hours * 60 + minutes;
  return -sign * total;
}

export function zonedDateFromParts({ year, month, day, hour = 0, minute = 0 }) {
  const approx = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offsetMinutes = getOffsetMinutes(approx);
  return new Date(approx.getTime() + offsetMinutes * 60 * 1000);
}

export function getZonedNow() {
  const now = new Date();
  const diffMinutes = now.getTimezoneOffset() - getOffsetMinutes(now);
  return new Date(now.getTime() + diffMinutes * 60 * 1000);
}

export function formatDate(date, options = {}) {
  const formatter = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "long",
    timeZone: TIME_ZONE,
    ...options,
  });
  return formatter.format(date);
}

export function formatTime(date, options = {}) {
  const formatter = new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
    ...options,
  });
  return formatter.format(date);
}

export function getStartOfWeek(date) {
  const base = zonedDateFromParts({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: 12,
  });
  const weekday = getDayKey(date);
  const order = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const diff = (order.indexOf(weekday) + 7) % 7;
  return new Date(base.getTime() - diff * 24 * 60 * 60 * 1000);
}

export function isBaseWeek(date, anchor) {
  const start = getStartOfWeek(date);
  const baseStart = getStartOfWeek(anchor);
  const diffMs = start.getTime() - baseStart.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return ((diffWeeks % 2) + 2) % 2 === 0;
}

export function humanizeDiff(ms) {
  const totalMinutes = Math.max(1, Math.round(ms / 60000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const chunks = [];
  if (days) chunks.push(`${days} д`);
  if (hours) chunks.push(`${hours} год`);
  if (minutes || (!days && !hours)) chunks.push(`${minutes} хв`);
  return chunks.join(" ");
}

export function getDayKey(date) {
  const raw = weekdayFormatter.format(date).toLowerCase();
  return weekdayMap[raw] || "monday";
}

export function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export const TIME_CONSTANTS = { TIME_ZONE, LOCALE };
