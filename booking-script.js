
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
const SLOT_INTERVAL = 15; // інтервал між слотами / slot interval
const MIN_GAP = 30; // мінімальний інтервал між записами / minimum gap between bookings
const bookings = [{
    master: "master1",
    date: "2026-06-06",
    start: "12:00",
    end: "12:40"
  },
  {
    master: "master1",
    date: "2026-06-06",
    start: "14:00",
    end: "15:00"
  }]; // база записів ЗАГЛУШКА ДЛЯ КОДУ для посилання на таблицю / bookings database CODE PLACEHOLDER for reference to spreadsheet

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

// вільні інтервали / free intervals
function getFreeIntervals(busy) {
  let current = WORK_START;
  const free = [];

  for (const b of busy) {
    if (b.start > current) {
      free.push({ start: current, end: b.start });
    }
    current = Math.max(current, b.end);
  }

  if (current < WORK_END) {
    free.push({ start: current, end: WORK_END });
  }

  return free;
}

// генерація можливих слотів / generate available slots
function findAvailableSlots(freeIntervals, duration) {
  const result = [];

  for (const interval of freeIntervals) {
    let start = interval.start;

    while (start + duration <= interval.end) {

      const remaining = interval.end - (start + duration);

      if (remaining > 0 && remaining < MIN_GAP) {
        start += 60; 
        continue;
      }

      result.push({
        start: toTime(start),
        end: toTime(start + duration)
      });

      start += 30; 
    }
  }

  return result;
}
// перевірка на маленькі проміжки / check for small gaps
function checkGaps(freeIntervals) {
  for (const interval of freeIntervals) {
    const size = interval.end - interval.start;
    if (size < 60) {
      console.log("SMALL GAP:", interval);
    }
  }
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

// головна функція / main function
function generateSlots(master, date, duration) {
  const busy = getBusyIntervals(master, date);
  const free = getFreeIntervals(busy);
  return findAvailableSlots(free, duration);
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
    timeSelect.innerHTML = `<option>Немає доступного часу / No available time</option>`;
    return;
  }

  timeSelect.innerHTML = `<option value="">Оберіть час / Select time</option>`;

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