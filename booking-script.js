
document.addEventListener("DOMContentLoaded", () => {

  const select = document.getElementById("service");

  // читаємо параметр з URL
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");

  // якщо щось передано — ставимо в select послуги → тривалість
  if (service) {
    select.value = service;
  }
});

document.addEventListener("DOMContentLoaded", () => {

  const servicesData = {
    allbody: ["60", "90", "120"],
    lymph: ["60"],
    cellulite: ["60", "90"],
    "cellulite-applied": ["60", "90"],
    sports: ["60"],
    face: ["60"],
    "face-applied": ["60"],
    neck: ["40", "60"],
    honey: ["30", "60"],
    bottle: ["60"]
  };

  const serviceSelect = document.getElementById("service");
  const durationSelect = document.getElementById("duration");

  const params = new URLSearchParams(window.location.search);
  const initialService = params.get("service");

  function renderDurations(service) {

    // ❗ повністю очищаємо select (ВАЖЛИВО)
    durationSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Оберіть тривалість --";
    durationSelect.appendChild(defaultOption);

    // якщо є дані
    const list = servicesData[service];

    if (list && list.length > 0) {

      list.forEach(time => {
        const option = document.createElement("option");
        option.value = time;
        option.textContent = `${time} хв`;
        durationSelect.appendChild(option);
      });

    }
  }

  // 🔹 стартове значення
  if (initialService) {
    serviceSelect.value = initialService;
  }

  renderDurations(serviceSelect.value);

  // 🔹 ВАЖЛИВО: реакція на зміну
  serviceSelect.addEventListener("change", () => {

    renderDurations(serviceSelect.value);

    // ❗ скидаємо вибір тривалості
    durationSelect.value = "";

  });

});



document.addEventListener("DOMContentLoaded", () => {

const WORK_START = 9 * 60; // початок робочого дня / work start
const WORK_END = 19 * 60; // кінець робочого дня / work end
const SLOT_INTERVAL = 30; // інтервал між слотами / slot interval
const bookings = [{
    master: "master1",
    date: "2026-06-06",
    start: "12:00",
    end: "12:40"
  }, {master: "master1",
    date: "2026-06-06",
    start: "13:30",
    end: "14:00"}]; // база записів ЗАГЛУШКА ДЛЯ КОДУ для посилання на таблицю / bookings database CODE PLACEHOLDER for reference to spreadsheet

const serviceSelect = document.getElementById("service");
const durationSelect = document.getElementById("duration");
const masterSelect = document.getElementById("master");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");

const today = new Date();
const maxDate = new Date();
maxDate.setDate(today.getDate() + 15);

// обмеження дат / date limits (15 days)
dateInput.min = today.toISOString().split("T")[0];
dateInput.max = maxDate.toISOString().split("T")[0];

// перевод часу в хвилини / convert time to minutes
function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// перевод назад у формат HH:MM / convert back to HH:MM
function toTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// отримання "якорних" слотів / get anchor slots
function getAnchorSlots(master, date) {
  return bookings
    .filter(b => b.master === master && b.date === date)
    .map(b => toMinutes(b.end))
    .filter(end => end % SLOT_INTERVAL !== 0);
}

// зайняті інтервали / busy intervals
function getBusyIntervals(master, date) {
  return bookings
    .filter(b => b.master === master && b.date === date)
    .map(b => ({
      start: toMinutes(b.start),
      end: toMinutes(b.end)
    }))
    .sort((a, b) => a.start - b.start);
}

// генерація сітки часу / generate time grid
function generateGrid(duration) {
  const slots = [];

  for (let t = WORK_START; t + duration <= WORK_END; t += SLOT_INTERVAL) {
    slots.push(t);
  }

  return slots;
}
// перевірка пертинутину / check for overlap
function isBusy(master, date, start, duration) {
  const end = start + duration;

  return bookings.some(b => {
    if (b.master !== master || b.date !== date) return false;

    const bStart = toMinutes(b.start);
    const bEnd = toMinutes(b.end);

    return start < bEnd && end > bStart;
  });
}

// фільтр мінімум 4 години наперед / 4 hour advance rule
function filterByAdvanceTime(slots) {
  const now = new Date();

  return slots.filter(slot => {
    const [h, m] = slot.start.split(":").map(Number);

    const slotDate = new Date(
      dateInput.value + "T" +
      String(h).padStart(2, "0") + ":" +
      String(m).padStart(2, "0") + ":00"
    );

    const diffHours = (slotDate - now) / (1000 * 60 * 60);

    return diffHours >= 4;
  });
}

// головна функція генерації слотів / main function for generating slots
function generateSlots(master, date, duration) {
  const result = [];
  const used = new Set();

  // звичайна сітка
  for (const t of generateGrid(duration)) {

    if (!isBusy(master, date, t, duration)) {

      result.push({
        start: toTime(t),
        end: toTime(t + duration)
      });

      used.add(t);
    }
  }

  // плаваючі слоти після нестандартних завершень
  const anchors = getAnchorSlots(master, date);

  for (const anchor of anchors) {

    if (
      anchor + duration <= WORK_END &&
      !used.has(anchor) &&
      !isBusy(master, date, anchor, duration)
    ) {

      result.push({
        start: toTime(anchor),
        end: toTime(anchor + duration)
      });
    }
  }

  // сортування по часу
  result.sort((a, b) =>
    toMinutes(a.start) - toMinutes(b.start)
  );

  return result;
}

// рендер часу / render time options
function renderTimeSlots() {
  const master = masterSelect.value;
  const date = dateInput.value;
  const duration = parseInt(durationSelect.value);

  timeSelect.innerHTML = "";
  timeSelect.disabled = true;

  if (!master || !date || !duration) return;

  const slots = generateSlots(master, date, duration);
  const filtered = filterByAdvanceTime(slots);

  timeSelect.disabled = false;

  if (filtered.length === 0) {
    timeSelect.innerHTML = `<option>Немає доступного часу>`;
    return;
  }

  timeSelect.innerHTML = `<option value="">Оберіть час>`;

  filtered.forEach(slot => {
    const opt = document.createElement("option");
    opt.value = slot.start;
    opt.textContent = `${slot.start} - ${slot.end}`;
    timeSelect.appendChild(opt);
  });
}
  serviceSelect.addEventListener("change", renderTimeSlots);
durationSelect.addEventListener("change", renderTimeSlots);
masterSelect.addEventListener("change", renderTimeSlots);
dateInput.addEventListener("change", renderTimeSlots);
});