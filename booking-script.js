
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