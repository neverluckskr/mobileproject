import { useEffect, useMemo, useRef, useState } from "react";
import {
  DAY_LABELS,
  DAY_ORDER,
  findActiveLesson,
  findNextLesson,
  getClassesWithLabels,
  getDateForDay,
  getLessonsForDay,
  getScheduleMeta,
} from "./lib/schedule.js";
import { formatDate, getDayKey, getZonedNow } from "./lib/time.js";

const MODE_OPTIONS = [
  { value: "full", label: "Повний день" },
  { value: "short", label: "Скорочений" },
];

const NOTES = [
  {
    title: "Офлайн та PWA",
    body: "Додайте застосунок на головний екран — manifest і service worker кешують сторінки й останній JSON із розкладом.",
    icon: "📱",
    accent: "from-indigo-500/15 via-indigo-500/5 to-transparent",
  },
  {
    title: "Admin / імпорт",
    body: "Редактор на /admin дозволяє змінити предмети, а скрипт npm run import:schedule конвертує таблицю в потрібну структуру.",
    icon: "🛠️",
    accent: "from-emerald-400/15 via-emerald-400/5 to-transparent",
  },
  {
    title: "Нагадування",
    body: "Увімкніть push-повідомлення і задайте заздалегідь, за скільки хвилин отримувати попередження перед уроком.",
    icon: "🔔",
    accent: "from-amber-400/20 via-amber-400/5 to-transparent",
  },
];

function App() {
  const [schedule, setSchedule] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const [classId, setClassId] = useState("");
  const [day, setDay] = useState("monday");
  const [mode, setMode] = useState("full");
  const [reminderLead, setReminderLead] = useState(() => {
    const saved = Number(localStorage.getItem("schedule:reminderLead"));
    return Number.isNaN(saved) ? 10 : saved;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => localStorage.getItem("schedule:notifications") === "on",
  );

  const hydratedRef = useRef(false);
  const notificationTimerRef = useRef(null);
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 60000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const response = await fetch(`/data/schedule.json?t=${Date.now()}`);
        if (!response.ok) throw new Error("Не вдалося отримати дані");
        const payload = await response.json();
        setSchedule(payload);
        setStatus("ready");
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    }
    loadSchedule();
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((err) => console.error("SW registration failed", err));
  }, []);

  useEffect(() => {
    if (!schedule || hydratedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const defaultClass =
      params.get("class") && schedule.groups.some((g) => g.id === params.get("class"))
        ? params.get("class")
        : schedule.meta.defaultClass || schedule.groups[0]?.id;
    const dayParam = params.get("day");
    const modeParam = params.get("mode");
    setClassId(defaultClass);
    setDay(DAY_LABELS[dayParam] ? dayParam : getInitialDay());
    setMode(modeParam === "short" ? "short" : "full");
    hydratedRef.current = true;
  }, [schedule]);

  useEffect(() => {
    if (!classId || !day || !mode) return;
    const params = new URLSearchParams(window.location.search);
    params.set("class", classId);
    params.set("day", day);
    params.set("mode", mode);
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", next);
  }, [classId, day, mode]);

  useEffect(() => {
    localStorage.setItem("schedule:reminderLead", String(reminderLead));
  }, [reminderLead]);

  useEffect(() => {
    localStorage.setItem("schedule:notifications", notificationsEnabled ? "on" : "off");
  }, [notificationsEnabled]);

  const nowKyiv = getZonedNow();
  const activeDate = useMemo(
    () => getDateForDay(day, nowKyiv),
    [day, nowKyiv.getTime()],
  );

  const lessons = useMemo(() => {
    if (!schedule || !classId) return [];
    return getLessonsForDay(schedule, classId, day, mode, activeDate);
  }, [schedule, classId, day, mode, activeDate]);

  const activeLesson = useMemo(
    () => findActiveLesson(lessons, new Date()),
    [lessons, tick],
  );

  const nextLesson = useMemo(() => {
    if (!schedule || !classId) return null;
    return findNextLesson(schedule, classId, mode);
  }, [schedule, classId, mode, tick]);

  const scheduleMeta = useMemo(() => {
    if (!schedule) return null;
    return getScheduleMeta(schedule);
  }, [schedule, tick]);

  const classes = useMemo(() => getClassesWithLabels(schedule), [schedule]);

  useEffect(() => {
    if (notificationTimerRef.current) {
      window.clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
    if (!notificationsEnabled || !nextLesson?.lesson) return;
    if (Notification.permission !== "granted") return;
    const leadMs = reminderLead * 60 * 1000;
    const diff = nextLesson.lesson.startDate.getTime() - Date.now() - leadMs;
    if (diff <= 0) return;
    notificationTimerRef.current = window.setTimeout(() => {
      const body = [
        nextLesson.lesson.subject,
        `${nextLesson.lesson.start} — ${nextLesson.lesson.end}`,
        `Кабінет: ${nextLesson.lesson.room}`,
      ].join("\n");
      navigator.serviceWorker.ready
        .then((registration) =>
          registration.showNotification("Урок скоро почнеться", {
            body,
            tag: "schedule-reminder",
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
          }),
        )
        .catch(() => new Notification("Урок скоро почнеться", { body }));
    }, diff);
    return () => {
      if (notificationTimerRef.current) {
        window.clearTimeout(notificationTimerRef.current);
      }
    };
  }, [notificationsEnabled, reminderLead, nextLesson]);

  const handleToggleNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Браузер не підтримує web notifications");
      return;
    }
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setNotificationsEnabled(false);
        return;
      }
    } else if (Notification.permission === "denied") {
      alert("Увімкніть дозволи на сповіщення в налаштуваннях браузера.");
      return;
    }
    setNotificationsEnabled((prev) => !prev);
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-50">
        <div className="text-base-600">Завантажуємо розклад…</div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-50">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-800">
          {error}
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-base-50 text-base-900">
      <section className="relative overflow-hidden border-b border-white/10 py-14 sm:py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%)]" />
          <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="absolute inset-x-12 top-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="relative container px-4">
          <div className="grid content-grid gap-8">
            <div className="col-span-12 space-y-6 lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-100">
                Спринт 1-3
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                Розклад уроків із нагадуваннями та офлайн-доступом
              </h1>
              <p className="text-base text-accent-100 sm:text-lg">
                Дані синхронізуються з JSON, тижневі цикли обчислюються автоматично, а
                push-нагадування допомагають бути завжди вчасно. Стани фільтрів зберігаються
                в URL — зручно ділитися будь-яким виглядом.
              </p>
              <div className="flex flex-wrap gap-3 text-white">
                <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                  <span aria-hidden="true">⚡</span>
                  {scheduleMeta?.label}
                </span>
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 ring-1 ring-white/20">
                  <span aria-hidden="true">🕒</span>
                  Оновлено {scheduleMeta?.updatedAt}
                </span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="rounded-3xl border border-white/30 bg-white/95 p-5 shadow-2xl shadow-slate-900/20 backdrop-blur-md md:p-6">
                <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-slate-900 sm:mb-6">
                  <span aria-hidden="true">🎛️</span> Налаштування
                </h2>
                <Filters
                  classes={classes}
                  classId={classId}
                  day={day}
                  mode={mode}
                  reminderLead={reminderLead}
                  notificationsEnabled={notificationsEnabled}
                  onClassChange={setClassId}
                  onDayChange={setDay}
                  onModeChange={setMode}
                  onReminderChange={setReminderLead}
                  onToggleNotifications={handleToggleNotifications}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-50 via-white to-base-50 py-14 sm:py-16 lg:py-24">
        <div className="container space-y-10 px-4">
          <div className="grid content-grid gap-6">
            <div className="col-span-12 lg:col-span-5">
              <NextLessonCard nextLesson={nextLesson} />
            </div>
            <div className="col-span-12 lg:col-span-7">
              <ScheduleBoard
                classId={classId}
                lessons={lessons}
                dayLabel={DAY_LABELS[day]}
                activeDate={activeDate}
                activeSlot={activeLesson?.slot}
                classLabel={
                  classes.find((item) => item.id === classId)?.label || classId
                }
              />
            </div>
          </div>
          <Notes />
        </div>
      </section>

      <footer className="border-t border-white/30 bg-white/90 py-8 backdrop-blur md:py-10">
        <div className="container flex flex-wrap items-center justify-between gap-4 px-4 text-[14px] text-base-700">
          <p>Контакти: ⚡ #antisocial | @deapathy1337 150+ rep</p>
          <p>
            Адмін-панель{" "}
            <a className="text-accent-600 underline-offset-4 hover:underline" href="/admin">
              /admin
            </a>
          </p>
          <p>Прод: neverluckskr.github.io/maclocked</p>
        </div>
      </footer>
    </div>
  );
}

function Filters({
  classes,
  classId,
  day,
  mode,
  reminderLead,
  notificationsEnabled,
  onClassChange,
  onDayChange,
  onModeChange,
  onReminderChange,
  onToggleNotifications,
}) {
  return (
    <div className="space-y-5">
      <label className="space-y-2">
        <span className="text-sm font-medium text-base-600">Клас</span>
        <select
          id="classFilter"
          value={classId}
          onChange={(event) => onClassChange(event.target.value)}
          className="w-full rounded-xl border border-accent-100 bg-white px-4 py-2 text-base text-base-900 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
        >
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-base-600">День</span>
        <select
          id="dayFilter"
          value={day}
          onChange={(event) => onDayChange(event.target.value)}
          className="w-full rounded-xl border border-accent-100 bg-white px-4 py-2 text-base text-base-900 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
        >
          {DAY_ORDER.slice(0, 5).map((key) => (
            <option key={key} value={key}>
              {DAY_LABELS[key]}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-3 rounded-2xl border border-accent-100 bg-gradient-to-r from-sky-50/70 via-white to-sky-50/60 p-4">
        <legend className="text-sm font-medium text-base-600">Формат дня</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {MODE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                mode === option.value
                  ? "border-accent-500 bg-accent-500/15 text-accent-600 shadow-sm"
                  : "border-accent-100 text-base-600 hover:border-accent-300"
              }`}
            >
              <span>{option.label}</span>
              <input
                id={`mode-${option.value}`}
                type="radio"
                className="accent-accent-500"
                name="mode"
                value={option.value}
                checked={mode === option.value}
                onChange={(event) => onModeChange(event.target.value)}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-base-600">
            Нагадування (хв до початку)
          </span>
          <input
            id="reminderLead"
            type="number"
            min="1"
            max="60"
            value={reminderLead}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value >= 1 && value <= 60) onReminderChange(value);
            }}
            className="w-full rounded-xl border border-accent-100 bg-white px-4 py-2 text-base text-base-900 shadow-sm focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-base-600">Web Push</span>
          <button
            id="notificationToggle"
            type="button"
            onClick={onToggleNotifications}
            className={`w-full rounded-xl border px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              notificationsEnabled
                ? "border-accent-500 bg-accent-500 text-white shadow-md hover:border-indigo-600 hover:bg-indigo-600"
                : "border-accent-100 bg-white text-base-600 hover:border-accent-300 hover:bg-base-50 hover:text-base-700 hover:opacity-90"
            }`}
          >
            {notificationsEnabled ? "Нагадування активні" : "Увімкнути"}
          </button>
        </label>
      </div>
    </div>
  );
}

function NextLessonCard({ nextLesson }) {
  if (!nextLesson?.lesson) {
    return (
      <div className="h-full rounded-2xl border border-accent-100 bg-gradient-to-br from-white via-sky-50/50 to-white p-5 shadow-card sm:p-6">
        <p className="text-sm text-base-600">Найближчий урок</p>
        <h3 className="mt-4 text-2xl font-semibold text-base-900">
          У пари наразі перерва
        </h3>
        <p className="mt-2 text-base text-base-600">Перевірь розклад пізніше, щоб не пропустити зміни.</p>
      </div>
    );
  }

  const { lesson } = nextLesson;
  const now = Date.now();
  const duration = Math.max(1, lesson.endDate.getTime() - lesson.startDate.getTime());
  const elapsed = Math.max(0, now - lesson.startDate.getTime());
  const progress = Math.min(100, Math.max(0, (elapsed / duration) * 100));

  return (
    <div
      className="h-full rounded-2xl border border-accent-100 bg-gradient-to-br from-white via-sky-50/60 to-white p-5 shadow-card sm:p-6"
      aria-live="polite"
    >
      <div className="flex items-center justify-between text-sm text-base-600">
        <span>Найближчий урок</span>
        <span className="rounded-full border border-base-200 px-3 py-1 text-xs" data-next-day>
          {DAY_LABELS[nextLesson.dayKey]}
        </span>
      </div>
      <h3 className="mt-4 text-3xl font-semibold text-base-900" data-next-subject>
        {lesson.subject}
      </h3>
      <dl className="mt-6 space-y-3 text-base text-base-600">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-sm text-base-500">
            <span aria-hidden="true">⏰</span> Час
          </dt>
          <dd className="font-medium text-base-900" data-next-time>
            {lesson.start} — {lesson.end}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-sm text-base-500">
            <span aria-hidden="true">🏫</span> Кабінет
          </dt>
          <dd className="font-medium text-base-900" data-next-room>
            {lesson.room}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-sm text-base-500">
            <span aria-hidden="true">👤</span> Викладач
          </dt>
          <dd className="font-medium text-base-900" data-next-teacher>
            {lesson.teacher}
          </dd>
        </div>
      </dl>
      <div className="mt-6 space-y-2">
        <p className="text-sm font-medium text-success" data-next-countdown>
          {nextLesson.countdownText}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-base-500">
            <span>Хід уроку</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100" data-next-progress>
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
function ScheduleBoard({ classId, lessons, dayLabel, activeDate, activeSlot, classLabel }) {
  return (
    <div className="rounded-[28px] border border-base-100/80 bg-white/95 p-5 shadow-2xl shadow-slate-900/10 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-base-100 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-base-400">{classLabel}</p>
          <h3 className="mt-1 text-2xl font-semibold text-base-900" data-active-day={dayLabel}>
            {dayLabel}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase text-base-400">Дата</p>
          <p className="text-base font-semibold text-accent-600">{formatDate(activeDate)}</p>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.2em] text-base-400">
                  <th className="w-12 py-2 pr-3 font-medium">№</th>
                  <th className="w-28 py-2 pr-3 font-medium">Час</th>
                  <th className="py-2 pr-3 font-medium">Предмет</th>
                  <th className="hidden md:table-cell w-40 py-2 pr-3 font-medium">Викладач</th>
                  <th className="w-24 py-2 font-medium text-right">Кабінет</th>
                </tr>
              </thead>
          <tbody className="divide-y divide-base-100/70">
            {lessons.map((lesson, index) => (
              <tr
                key={`${classId}-${lesson.slot}-${lesson.subject}-${index}`}
                className={`border-base-100/80 text-base transition-all duration-150 ${
                  lesson.slot === activeSlot
                    ? 'bg-accent-500/10 shadow-sm ring-1 ring-accent-200/70'
                    : index % 2
                      ? 'bg-base-50'
                      : 'bg-white'
                } hover:-translate-y-0.5 hover:shadow-sm`}
              >
                <td className="py-3 pr-3 font-semibold text-base-500">{lesson.slot}</td>
                <td className="py-3 pr-3 text-base-600">
                  {lesson.start} — {lesson.end}
                </td>
                <td className="py-3 pr-3 text-base-900">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold whitespace-normal">{lesson.subject}</span>
                    <span className="text-xs font-medium text-base-500 md:hidden">{lesson.teacher}</span>
                  </div>
                </td>
                <td className="hidden md:table-cell py-3 pr-3 text-base-600">{lesson.teacher}</td>
                <td className="py-3 pl-3 text-right text-base-600">{lesson.room}</td>
              </tr>
            ))}
            {!lessons.length && (
              <tr>
                <td className="py-6 text-center text-base-500" colSpan={5}>
                  На цей день пари відсутні
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Notes() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {NOTES.map((note) => (
        <article
          key={note.title}
          className="rounded-2xl border border-accent-100 bg-white/95 p-5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
        >
          <div className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r ${note.accent} px-3 py-1 text-base`}>
            <span aria-hidden="true">{note.icon}</span>
          </div>
          <h4 className="mt-4 text-lg font-semibold text-base-900">{note.title}</h4>
          <p className="mt-3 text-base text-base-600">{note.body}</p>
        </article>
      ))}
    </div>
  );
}

function getInitialDay() {
  const key = getDayKey(getZonedNow());
  return DAY_LABELS[key] ? key : "monday";
}

export default App;
