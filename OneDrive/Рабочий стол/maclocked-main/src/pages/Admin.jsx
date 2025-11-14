import { useEffect, useMemo, useState } from "react";
import { DAY_LABELS, DAY_ORDER, getClassesWithLabels, resolveField } from "../lib/schedule.js";

function Admin() {
  const [schedule, setSchedule] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDay, setSelectedDay] = useState("monday");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    reloadData();
  }, []);

  const classesWithLabels = useMemo(() => getClassesWithLabels(schedule), [schedule]);

  const currentGroup = useMemo(() => {
    return classesWithLabels.find((group) => group.id === selectedClass) || null;
  }, [classesWithLabels, selectedClass]);

  const dayPlan = currentGroup?.days?.[selectedDay] ?? [];

  async function reloadData() {
    try {
      const response = await fetch(`/data/schedule.json?t=${Date.now()}`);
      const payload = await response.json();
      setSchedule(payload);
      setSelectedClass(payload.meta.defaultClass || payload.groups[0]?.id || "");
      showToast("Дані оновлено");
    } catch (error) {
      showToast(error.message || "Не вдалося завантажити JSON", "error");
    }
  }

  function showToast(message, tone = "success") {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2600);
  }

  function handleCellChange(slot, type, value) {
    setSchedule((prev) => {
      if (!prev) return prev;
      const copy = structuredClone(prev);
      const group = copy.groups.find((item) => item.id === selectedClass);
      if (!group) return prev;
      const plan = group.days[selectedDay] || [];
      const lesson = plan.find((entry) => entry.slot === slot);
      if (!lesson) return prev;

      if (type.startsWith("subject")) {
        const [_, key] = type.split(".");
        lesson.subject =
          typeof lesson.subject === "string"
            ? { base: lesson.subject, alternate: "" }
            : lesson.subject || { base: "", alternate: "" };
        lesson.subject[key] = value || "";
      } else {
        lesson[type] =
          typeof lesson[type] === "object"
            ? { ...lesson[type], base: value || "" }
            : value || "";
      }
      group.days[selectedDay] = plan;
      return copy;
    });
  }

  function exportJson() {
    if (!schedule) return;
    const blob = new Blob([JSON.stringify(schedule, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "schedule.json";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("JSON експортовано");
  }

  return (
    <div className="min-h-screen bg-base-50">
      <header className="border-b border-base-200 bg-white">
        <div className="container py-10">
          <p className="text-xs uppercase tracking-[0.2em] text-base-500">Спринт 4</p>
          <h1 className="mt-3 text-3xl font-semibold text-base-900">
            Адмін-панель розкладу
          </h1>
          <p className="mt-3 max-w-3xl text-base text-base-600">
            Внесіть правки у предмети, викладачів чи кабінети. Після редагування натисніть
            «Зберегти JSON» й замініть файл у каталозі data/. Поля підтримують чергування
            (base / alternate) для тижневих циклів.
          </p>
        </div>
      </header>

      <main className="container py-12">
        <div className="grid content-grid gap-6">
          <div className="col-span-12 space-y-6 lg:col-span-4">
            <nav className="rounded-2xl border border-base-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-base-600">Класи</p>
              <div className="mt-4 space-y-2">
                {classesWithLabels.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedClass(group.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                      selectedClass === group.id
                        ? "border-accent-500 bg-accent-500/10 text-accent-600"
                        : "border-base-200 text-base-600 hover:border-accent-500"
                    }`}
                  >
                    <span>{group.label}</span>
                    <span className="text-xs text-base-500">{group.id}</span>
                  </button>
                ))}
              </div>
            </nav>

            <nav className="rounded-2xl border border-base-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-base-600">Дні</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {DAY_ORDER.slice(0, 5).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDay(key)}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      selectedDay === key
                        ? "border-accent-500 bg-accent-500/10 text-accent-600"
                        : "border-base-200 text-base-600 hover:border-accent-500"
                    }`}
                  >
                    {DAY_LABELS[key]}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div className="col-span-12 space-y-6 lg:col-span-8">
            <div className="rounded-2xl border border-base-200 bg-white p-6 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-100 pb-4">
                <div>
                  <p className="text-sm text-base-500">Редагуємо</p>
                  <h2 className="text-2xl font-semibold text-base-900">
                    {currentGroup?.label} · {DAY_LABELS[selectedDay]}
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={exportJson}
                    className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
                  >
                    Зберегти JSON
                  </button>
                  <button
                    type="button"
                    onClick={reloadData}
                    className="rounded-xl border border-base-200 px-4 py-2 text-sm font-semibold text-base-600 hover:border-accent-500"
                  >
                    Скинути
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-base-500">
                      <th className="py-3 pr-3 font-medium">№</th>
                      <th className="py-3 pr-3 font-medium">Subject (base)</th>
                      <th className="py-3 pr-3 font-medium">Subject (alternate)</th>
                      <th className="py-3 pr-3 font-medium">Teacher</th>
                      <th className="py-3 font-medium">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayPlan.map((lesson, index) => (
                      <tr
                        key={`${lesson.slot}-${index}`}
                        className={index % 2 ? "bg-base-50/60" : "bg-white"}
                      >
                        <td className="py-3 pr-3 font-semibold text-base-600">
                          {lesson.slot}
                        </td>
                        <td className="py-3 pr-3">
                          <Input
                            value={resolveField(lesson.subject, true) || ""}
                            placeholder="Географія"
                            onChange={(value) => handleCellChange(lesson.slot, "subject.base", value)}
                          />
                        </td>
                        <td className="py-3 pr-3">
                          <Input
                            value={resolveField(lesson.subject, false) || ""}
                            placeholder="Хімія"
                            onChange={(value) =>
                              handleCellChange(lesson.slot, "subject.alternate", value)
                            }
                          />
                        </td>
                        <td className="py-3 pr-3">
                          <Input
                            value={resolveField(lesson.teacher, true) || ""}
                            placeholder="О. Коваль"
                            onChange={(value) => handleCellChange(lesson.slot, "teacher", value)}
                          />
                        </td>
                        <td className="py-3">
                          <Input
                            value={resolveField(lesson.room, true) || ""}
                            placeholder="210"
                            onChange={(value) => handleCellChange(lesson.slot, "room", value)}
                          />
                        </td>
                      </tr>
                    ))}
                    {!dayPlan.length && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-base-500">
                          Для цього дня ще немає розкладу
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-xl border border-base-200 bg-white px-4 py-3 text-sm text-base-700 shadow-card">
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-lg border border-base-200 bg-base-50 px-3 text-sm text-base-900 focus:border-accent-500 focus:outline-none"
    />
  );
}

export default Admin;
