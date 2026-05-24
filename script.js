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