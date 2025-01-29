// Настройки
const config = {
  musicVolume: 0.3, // Громкость музыки (0-1)
  soundEnabled: true, // Звуки кнопок включены
};

// Элементы
let music; // Фоновая музыка
let musicToggleButton; // Кнопка управления музыкой

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Динамическая загрузка контента
  const initialPage = window.location.pathname.includes('index') ? 'index' : 'news';
  loadContent(initialPage);

  // Музыка
  music = document.getElementById('background-music');
  music.volume = config.musicVolume;

  // Кнопка переключения музыки
  createMusicToggleButton();

  // Обработчики кнопок меню
  document.querySelectorAll('.minecraft-button[data-page]').forEach(button => {
    button.addEventListener('click', handleButtonClick);
    button.addEventListener('mouseenter', playButtonSound);
  });
});

// Загрузка контента (SPA-подход)
async function loadContent(page) {
  try {
    const response = await fetch(`content/${page}.html`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    document.querySelector('.container').innerHTML = `
      <h1 class="logo">${page === 'index' ? 'Minecraft Fan Site' : page}</h1>
      ${doc.querySelector('.content').innerHTML}
      ${page !== 'index' ? '<button class="minecraft-button" data-page="index">На главную</button>' : ''}
    `;

    // Обновляем обработчики после загрузки
    document.querySelectorAll('.minecraft-button[data-page]').forEach(btn => {
      btn.addEventListener('click', handleButtonClick);
      btn.addEventListener('mouseenter', playButtonSound);
    });

    // Плавное появление
    document.querySelector('.content').style.animation = 'slideIn 0.5s ease-out';
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
}

// Обработка кликов
function handleButtonClick(e) {
  e.preventDefault();
  const page = e.target.getAttribute('data-page');
  history.pushState({}, '', `${page}.html`);
  loadContent(page);
}

// Звук кнопок
function playButtonSound() {
  if (!config.soundEnabled) return;
  const sound = new Audio('sounds/click.mp3');
  sound.volume = 0.3;
  sound.play();
}

// Управление музыкой
function createMusicToggleButton() {
  musicToggleButton = document.createElement('button');
  musicToggleButton.id = 'music-toggle';
  musicToggleButton.className = 'minecraft-button';
  musicToggleButton.innerHTML = '♫ Вкл/Выкл';
  musicToggleButton.style.position = 'fixed';
  musicToggleButton.style.bottom = '20px';
  musicToggleButton.style.right = '20px';

  musicToggleButton.addEventListener('click', () => {
    music.paused ? music.play() : music.pause();
    musicToggleButton.textContent = music.paused ? '♫ Вкл музыку' : '♫ Выкл музыку';
  });

  document.body.appendChild(musicToggleButton);
}