
document.addEventListener("DOMContentLoaded", () => {

  const select = document.getElementById("service");

  // читаємо параметр з URL
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");

  // якщо щось передано — ставимо в select
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


// Обмежити календар
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateString = maxDate.toISOString().split("T")[0];
  dateInput.min = minDate;
  dateInput.max = maxDateString;

});

//Показувати доступні години після вибору дати
const availableTimes = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00"
];
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("time");

dateInput.addEventListener("change", () => {

  timeSelect.innerHTML = "";
  timeSelect.disabled = false;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Оберіть час --";

  timeSelect.appendChild(defaultOption);

  availableTimes.forEach(time => {

    const option = document.createElement("option");

    option.value = time;
    option.textContent = time;

    timeSelect.appendChild(option);

  });

});