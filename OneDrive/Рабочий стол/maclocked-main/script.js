const scheduleData = {
    "9A": {
        monday: {
            date: "15 апреля",
            notes: "Повторите формулы площади треугольника к проверочной работе.",
            lessons: [
                { number: 1, subject: "Математика", teacher: "Иванова", time: "8:30 – 9:15", room: "302" },
                { number: 2, subject: "Русский язык", teacher: "Петров", time: "9:25 – 10:10", room: "205" },
                { number: 3, subject: "История", teacher: "Смирнова", time: "10:30 – 11:15", room: "411" },
                { number: 4, subject: "Физика", teacher: "Кузнецов", time: "11:25 – 12:10", room: "503" },
                { number: 5, subject: "Английский язык", teacher: "Ким", time: "12:30 – 13:15", room: "210" }
            ]
        },
        tuesday: {
            date: "16 апреля",
            notes: "Подготовьте вопросы по проекту по информатике для обсуждения.",
            lessons: [
                { number: 1, subject: "Информатика", teacher: "Волкова", time: "8:30 – 9:15", room: "IT-1" },
                { number: 2, subject: "Химия", teacher: "Андреева", time: "9:25 – 10:10", room: "Lab-2" },
                { number: 3, subject: "Алгебра", teacher: "Иванова", time: "10:30 – 11:15", room: "302" },
                { number: 4, subject: "Физкультура", teacher: "Соколова", time: "11:25 – 12:10", room: "Спортзал" }
            ]
        },
        wednesday: {
            date: "17 апреля",
            notes: "Сдача конспектов по обществознанию после занятий.",
            lessons: [
                { number: 1, subject: "Литература", teacher: "Петров", time: "8:30 – 9:15", room: "205" },
                { number: 2, subject: "Биология", teacher: "Морозова", time: "9:25 – 10:10", room: "408" },
                { number: 3, subject: "География", teacher: "Новикова", time: "10:30 – 11:15", room: "406" },
                { number: 4, subject: "Обществознание", teacher: "Борисов", time: "11:25 – 12:10", room: "407" },
                { number: 5, subject: "Классный час", teacher: "Иванова", time: "12:30 – 13:15", room: "302" }
            ]
        },
        thursday: {
            date: "18 апреля",
            notes: "Возьмите лабораторные журналы на урок химии.",
            lessons: [
                { number: 1, subject: "Алгебра", teacher: "Иванова", time: "8:30 – 9:15", room: "302" },
                { number: 2, subject: "Физика", teacher: "Кузнецов", time: "9:25 – 10:10", room: "503" },
                { number: 3, subject: "Химия", teacher: "Андреева", time: "10:30 – 11:15", room: "Lab-2" },
                { number: 4, subject: "Английский язык", teacher: "Ким", time: "11:25 – 12:10", room: "210" }
            ]
        },
        friday: {
            date: "19 апреля",
            notes: "Спортивная форма обязательна для занятия на стадионе.",
            lessons: [
                { number: 1, subject: "Информатика", teacher: "Волкова", time: "8:30 – 9:15", room: "IT-1" },
                { number: 2, subject: "Геометрия", teacher: "Иванова", time: "9:25 – 10:10", room: "302" },
                { number: 3, subject: "Музыка", teacher: "Орлова", time: "10:30 – 11:15", room: "Актовый зал" },
                { number: 4, subject: "Физкультура", teacher: "Соколова", time: "11:25 – 12:10", room: "Стадион" }
            ]
        }
    },
    "10B": {
        monday: {
            date: "15 апреля",
            notes: "Готовимся к обсуждению проектов по истории.",
            lessons: [
                { number: 1, subject: "Геометрия", teacher: "Семенов", time: "8:30 – 9:15", room: "305" },
                { number: 2, subject: "Физика", teacher: "Никитин", time: "9:25 – 10:10", room: "506" },
                { number: 3, subject: "Русский язык", teacher: "Зайцева", time: "10:30 – 11:15", room: "204" },
                { number: 4, subject: "История", teacher: "Громова", time: "11:25 – 12:10", room: "410" }
            ]
        },
        tuesday: {
            date: "16 апреля",
            notes: "Не забудьте спортивную форму для второй половины дня.",
            lessons: [
                { number: 1, subject: "Информатика", teacher: "Федоров", time: "8:30 – 9:15", room: "IT-2" },
                { number: 2, subject: "Английский язык", teacher: "Кириллова", time: "9:25 – 10:10", room: "214" },
                { number: 3, subject: "Обществознание", teacher: "Громова", time: "10:30 – 11:15", room: "410" },
                { number: 4, subject: "Физкультура", teacher: "Егорова", time: "11:25 – 12:10", room: "Спортзал" }
            ]
        },
        wednesday: {
            date: "17 апреля",
            notes: "Проверьте лабораторные журналы перед уроком химии.",
            lessons: [
                { number: 1, subject: "Алгебра", teacher: "Семенов", time: "8:30 – 9:15", room: "305" },
                { number: 2, subject: "Литература", teacher: "Зайцева", time: "9:25 – 10:10", room: "204" },
                { number: 3, subject: "Биология", teacher: "Елисеева", time: "10:30 – 11:15", room: "409" },
                { number: 4, subject: "Химия", teacher: "Филиппова", time: "11:25 – 12:10", room: "Lab-3" }
            ]
        },
        thursday: {
            date: "18 апреля",
            notes: "Повторите географические термины к мини-викторине.",
            lessons: [
                { number: 1, subject: "Физика", teacher: "Никитин", time: "8:30 – 9:15", room: "506" },
                { number: 2, subject: "География", teacher: "Беляева", time: "9:25 – 10:10", room: "407" },
                { number: 3, subject: "Английский язык", teacher: "Кириллова", time: "10:30 – 11:15", room: "214" }
            ]
        },
        friday: {
            date: "19 апреля",
            notes: "На математике будет самостоятельная работа по логарифмам.",
            lessons: [
                { number: 1, subject: "Математика", teacher: "Семенов", time: "8:30 – 9:15", room: "305" },
                { number: 2, subject: "Информатика", teacher: "Федоров", time: "9:25 – 10:10", room: "IT-2" },
                { number: 3, subject: "Физкультура", teacher: "Егорова", time: "10:30 – 11:15", room: "Стадион" }
            ]
        }
    },
    "11G": {
        monday: {
            date: "15 апреля",
            notes: "Проверьте готовность к зачету по профильной математике.",
            lessons: [
                { number: 1, subject: "Профильная математика", teacher: "Власова", time: "8:30 – 9:15", room: "307" },
                { number: 2, subject: "Физика", teacher: "Кабанов", time: "9:25 – 10:10", room: "508" },
                { number: 3, subject: "Информатика", teacher: "Лебедев", time: "10:30 – 11:15", room: "IT-3" },
                { number: 4, subject: "Русский язык", teacher: "Руднева", time: "11:25 – 12:10", room: "203" }
            ]
        },
        tuesday: {
            date: "16 апреля",
            notes: "Подготовьте вопросы по обществознанию к дискуссии.",
            lessons: [
                { number: 1, subject: "Английский язык", teacher: "Максимова", time: "8:30 – 9:15", room: "216" },
                { number: 2, subject: "Обществознание", teacher: "Гончаров", time: "9:25 – 10:10", room: "412" },
                { number: 3, subject: "Физкультура", teacher: "Рязанцев", time: "10:30 – 11:15", room: "Спортзал" }
            ]
        },
        wednesday: {
            date: "17 апреля",
            notes: "Возьмите тетради по химии для лабораторной.",
            lessons: [
                { number: 1, subject: "Химия", teacher: "Яковлева", time: "8:30 – 9:15", room: "Lab-4" },
                { number: 2, subject: "Биология", teacher: "Сафонова", time: "9:25 – 10:10", room: "410" },
                { number: 3, subject: "Литература", teacher: "Руднева", time: "10:30 – 11:15", room: "203" },
                { number: 4, subject: "История", teacher: "Гончаров", time: "11:25 – 12:10", room: "412" }
            ]
        },
        thursday: {
            date: "18 апреля",
            notes: "Будет консультация по проектной деятельности после урока.",
            lessons: [
                { number: 1, subject: "Физика", teacher: "Кабанов", time: "8:30 – 9:15", room: "508" },
                { number: 2, subject: "Профильная математика", teacher: "Власова", time: "9:25 – 10:10", room: "307" },
                { number: 3, subject: "Проектная деятельность", teacher: "Лебедев", time: "10:30 – 11:15", room: "IT-3" }
            ]
        },
        friday: {
            date: "19 апреля",
            notes: "На ЕГЭ-подготовке повторяем сложные задания части С.",
            lessons: [
                { number: 1, subject: "Информатика", teacher: "Лебедев", time: "8:30 – 9:15", room: "IT-3" },
                { number: 2, subject: "Подготовка к ЕГЭ", teacher: "Власова", time: "9:25 – 10:10", room: "307" },
                { number: 3, subject: "Физкультура", teacher: "Рязанцев", time: "10:30 – 11:15", room: "Стадион" }
            ]
        }
    }
};

const dayLabels = {
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
};

const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const weekDayMap = {
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
};

const scheduleContainer = document.querySelector(".schedule");
const dayButtons = Array.from(document.querySelectorAll(".chip"));
const classSelect = document.getElementById("classSelect");
const searchInput = document.getElementById("searchInput");
const insightTotal = document.getElementById("insight-total");
const insightNext = document.getElementById("insight-next");
const insightNextMeta = document.getElementById("insight-next-meta");
const insightPreference = document.getElementById("insight-preference");

const STORAGE_KEYS = {
    classId: "schedule:selectedClass",
    day: "schedule:selectedDay",
};

const state = {
    selectedDay: "all",
    searchQuery: "",
};

function formatLessonsCount(count) {
    const remainder10 = count % 10;
    const remainder100 = count % 100;

    if (count === 0) {
        return "0 уроков";
    }

    if (remainder10 === 1 && remainder100 !== 11) {
        return `${count} урок`;
    }

    if (remainder10 >= 2 && remainder10 <= 4 && (remainder100 < 12 || remainder100 > 14)) {
        return `${count} урока`;
    }

    return `${count} уроков`;
}

function createLessonItem(lesson) {
    const li = document.createElement("li");
    li.className = "lesson";
    li.innerHTML = `
        <div class="lesson__number">${lesson.number}-й урок</div>
        <div class="lesson__subject">${lesson.subject}</div>
        <div class="lesson__details">
            <span aria-label="Время урока">🕒 ${lesson.time}</span>
            <span aria-label="Кабинет">🚪 ${lesson.room}</span>
            <span aria-label="Учитель">👩‍🏫 ${lesson.teacher}</span>
        </div>
    `;
    return li;
}

function createScheduleCard(dayKey, dayData, lessons) {
    const card = document.createElement("article");
    card.className = "schedule-card";
    card.dataset.day = dayKey;
    card.innerHTML = `
        <header class="schedule-card__header">
            <div class="schedule-card__meta">
                <span class="schedule-card__day">${dayLabels[dayKey]}</span>
                <span class="schedule-card__date">${dayData.date}</span>
            </div>
            <span class="schedule-card__badge">${formatLessonsCount(lessons.length)}</span>
        </header>
        <ul class="schedule-card__list"></ul>
    `;

    const list = card.querySelector(".schedule-card__list");
    lessons.forEach((lesson) => {
        list.appendChild(createLessonItem(lesson));
    });

    if (dayData.notes) {
        const note = document.createElement("p");
        note.className = "schedule-card__note";
        note.textContent = dayData.notes;
        card.appendChild(note);
    }

    return card;
}

function renderEmptyState(message, { showReset = false } = {}) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const text = document.createElement("p");
    text.textContent = message;
    emptyState.appendChild(text);

    if (showReset) {
        const resetButton = document.createElement("button");
        resetButton.type = "button";
        resetButton.className = "empty-state__action";
        resetButton.textContent = "Сбросить поиск";
        resetButton.addEventListener("click", () => {
            searchInput.value = "";
            state.searchQuery = "";
            renderSchedule();
            searchInput.focus();
        });
        emptyState.appendChild(resetButton);
    }

    scheduleContainer.appendChild(emptyState);
}

function sortByDayOrder(a, b) {
    return dayOrder.indexOf(a.dayKey) - dayOrder.indexOf(b.dayKey);
}

function getCurrentDayKey() {
    const todayIndex = new Date().getDay();
    return weekDayMap[todayIndex] ?? null;
}

function findPreferredEntry(entries) {
    if (!entries.length) {
        return null;
    }

    const sorted = [...entries].sort(sortByDayOrder);

    if (state.selectedDay !== "all") {
        const match = sorted.find((entry) => entry.dayKey === state.selectedDay);
        if (match) {
            return match;
        }
    }

    const currentDayKey = getCurrentDayKey();

    if (currentDayKey) {
        const currentIndex = sorted.findIndex((entry) => entry.dayKey === currentDayKey);
        if (currentIndex !== -1) {
            return sorted[currentIndex];
        }

        const nextIndex = sorted.findIndex(
            (entry) => dayOrder.indexOf(entry.dayKey) > dayOrder.indexOf(currentDayKey)
        );

        if (nextIndex !== -1) {
            return sorted[nextIndex];
        }
    }

    return sorted[0];
}

function updateInsights(entries) {
    const totalLessons = entries.reduce((sum, entry) => sum + entry.lessons.length, 0);
    insightTotal.textContent = formatLessonsCount(totalLessons);

    const preferenceDayLabel =
        state.selectedDay === "all" ? "Вся неделя" : dayLabels[state.selectedDay];
    insightPreference.textContent = `${classSelect.value} • ${preferenceDayLabel}`;

    const preferredEntry = findPreferredEntry(entries);

    if (!preferredEntry) {
        insightNext.textContent = "Нет занятий";
        insightNextMeta.textContent = state.searchQuery
            ? "Попробуйте изменить условия поиска."
            : "Выберите другой день или класс.";
        return;
    }

    const [nextLesson] = preferredEntry.lessons;
    insightNext.textContent = nextLesson.subject;
    insightNextMeta.textContent = `${dayLabels[preferredEntry.dayKey]}, ${nextLesson.time} • каб. ${nextLesson.room}`;
}

function updateActiveChip(activeButton) {
    dayButtons.forEach((button) => {
        const isActive = button === activeButton;
        button.classList.toggle("chip--active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
        button.setAttribute("tabindex", isActive ? "0" : "-1");
    });
}

function persistPreferences() {
    try {
        localStorage.setItem(STORAGE_KEYS.classId, classSelect.value);
        localStorage.setItem(STORAGE_KEYS.day, state.selectedDay);
    } catch (error) {
        console.warn("Не удалось сохранить настройки расписания", error);
    }
}

function loadPreferences() {
    try {
        return {
            classId: localStorage.getItem(STORAGE_KEYS.classId),
            day: localStorage.getItem(STORAGE_KEYS.day),
        };
    } catch (error) {
        console.warn("Не удалось прочитать сохранённые настройки расписания", error);
        return {};
    }
}

function renderSchedule(selectedDayParam) {
    const selectedClass = classSelect.value;
    const classSchedule = scheduleData[selectedClass];
    const selectedDay = selectedDayParam ?? state.selectedDay;
    state.selectedDay = selectedDay;

    scheduleContainer.innerHTML = "";

    const searchQuery = state.searchQuery.toLowerCase();
    const entries = [];

    Object.entries(classSchedule).forEach(([dayKey, dayData]) => {
        if (selectedDay !== "all" && dayKey !== selectedDay) {
            return;
        }

        const lessons = dayData.lessons.filter((lesson) => {
            if (!searchQuery) {
                return true;
            }

            const haystack = `${lesson.subject} ${lesson.teacher}`.toLowerCase();
            return haystack.includes(searchQuery);
        });

        if (!lessons.length) {
            return;
        }

        const card = createScheduleCard(dayKey, dayData, lessons);
        entries.push({ dayKey, dayData, lessons });
        scheduleContainer.appendChild(card);
    });

    if (!entries.length) {
        const message = searchQuery.length
            ? `По запросу «${searchInput.value}» занятий не найдено.`
            : "Нет занятий в выбранный день.";
        renderEmptyState(message, { showReset: Boolean(searchQuery.length) });
    }

    updateInsights(entries);
}

function initializeControls() {
    const savedPreferences = loadPreferences();

    if (savedPreferences.classId && scheduleData[savedPreferences.classId]) {
        classSelect.value = savedPreferences.classId;
    }

    if (
        savedPreferences.day &&
        (savedPreferences.day === "all" || scheduleData[classSelect.value][savedPreferences.day])
    ) {
        state.selectedDay = savedPreferences.day;
    }

    if (state.selectedDay === "all") {
        const todayKey = getCurrentDayKey();
        if (todayKey && scheduleData[classSelect.value][todayKey]) {
            state.selectedDay = todayKey;
        }
    }

    const initialButton =
        dayButtons.find((button) => button.dataset.day === state.selectedDay) ||
        dayButtons.find((button) => button.dataset.day === "all");

    if (initialButton) {
        updateActiveChip(initialButton);
        state.selectedDay = initialButton.dataset.day;
    }

    renderSchedule();
    persistPreferences();

    dayButtons.forEach((button) => {
        button.addEventListener("click", () => {
            state.selectedDay = button.dataset.day;
            updateActiveChip(button);
            renderSchedule();
            persistPreferences();
        });
    });

    classSelect.addEventListener("change", () => {
        if (
            state.selectedDay !== "all" &&
            !Object.prototype.hasOwnProperty.call(scheduleData[classSelect.value], state.selectedDay)
        ) {
            const fallbackButton = dayButtons.find((button) => button.dataset.day === "all");
            if (fallbackButton) {
                state.selectedDay = fallbackButton.dataset.day;
                updateActiveChip(fallbackButton);
            }
        }

        renderSchedule();
        persistPreferences();
    });

    searchInput.addEventListener("input", () => {
        state.searchQuery = searchInput.value.trim();
        renderSchedule();
    });
}

initializeControls();
