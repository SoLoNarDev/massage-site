document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('selectstart', function (e) {
    e.preventDefault();
  });
});

// Додаємо обробник подій для кожної картки масажу
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.massage-card').forEach(card => {
    
    card.addEventListener('click', (e) => {

      if (e.target.closest('.btn')) return;

      // закриваємо інші
      document.querySelectorAll('.massage-card').forEach(c => {
        if (c !== card) c.classList.remove('active');
      });

      // перемикаємо цю
      card.classList.toggle('active');


    });

  });

});


// Додаємо обробник подій для кнопок "Записатися"
// Чекаємо, поки завантажиться вся сторінка
document.addEventListener('DOMContentLoaded', () => {
  
  // Знаходимо всі кнопки "Записатися" на сторінці
  const bookingButtons = document.querySelectorAll('.btn[data-service]');

  bookingButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      // Отримуємо унікальний ідентифікатор масажу з атрибута data-service
      const serviceType = event.target.getAttribute('data-service');
      
      // Перенаправляємо користувача на сторінку анкети і передаємо тип послуги в URL
      window.location.href = `booking.html?service=${serviceType}`;


      window.addEventListener('load', () => {
  // 1. Зчитуємо текст з адресного рядка (наприклад, ?service=body)
  const urlParams = new URLSearchParams(window.location.search);
  const selectedService = urlParams.get('service');
  
  // Виведемо в консоль браузера, що саме знайшов скрипт (для перевірки)
  console.log("Знайдено сервіс в URL:", selectedService);

  // 2. Знаходимо елемент списку на сторінці
  const serviceSelect = document.getElementById('service');

  // 3. Якщо сервіс знайдено в URL — примусово обираємо його в списку
  if (selectedService && serviceSelect) {
    serviceSelect.value = selectedService;
    console.log("Успішно встановлено значення форми:", serviceSelect.value);
  } else {
    console.log("Помилка: не знайдено параметр в URL або селект на сторінці!");
  }
});
    });
  });
});
