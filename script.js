document.addEventListener('DOMContentLoaded', () => {
  const pages = {
    index: {
      title: "Главная",
      content: `
        <div class="menu">
          <button class="minecraft-button" data-page="news">Новости</button>
          <button class="minecraft-button" data-page="guides">Гайды</button>
          <button class="minecraft-button" data-page="mods">Моды</button>
          <button class="minecraft-button" data-page="servers">Серверы</button>
          <button class="minecraft-button" data-page="about">О нас</button>
        </div>
      `
    },
    news: {
      title: "Новости",
      content: "<p>Последние обновления игры...</p>"
    },
    guides: {
      title: "Гайды",
      content: "<p>Полезные руководства...</p>"
    },
    mods: {
      title: "Моды",
      content: "<p>Коллекция модов...</p>"
    },
    servers: {
      title: "Серверы",
      content: "<p>Список серверов...</p>"
    },
    about: {
      title: "О нас",
      content: "<p>Информация о проекте...</p>"
    }
  };

  function loadPage(page) {
    const container = document.querySelector('.container');
    container.innerHTML = `
      <h1 class="logo">${pages[page].title}</h1>
      <div class="content">
        ${pages[page].content}
        ${page !== 'index' ? '<button class="minecraft-button" data-page="index">На главную</button>' : ''}
      </div>
    `;
    
    // Обновляем обработчики
    document.querySelectorAll('.minecraft-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        loadPage(e.target.dataset.page);
      });
    });
  }

  // Стартовая загрузка
  const initialPage = window.location.hash.replace('#', '') || 'index';
  loadPage(initialPage);

  // Обработка кнопки "Назад"
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.replace('#', '') || 'index';
    loadPage(page);
  });
});
