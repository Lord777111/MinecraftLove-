const config = {
  musicVolume: 0.3,
  soundEnabled: true,
};

let music;
let musicToggleButton;

document.addEventListener('DOMContentLoaded', () => {
  // Определение стартовой страницы
  const pathParts = window.location.pathname.split('/');
  const currentPage = pathParts[pathParts.length - 1];
  const initialPage = currentPage === 'index.html' || currentPage === '' ? 'index' : currentPage.replace('.html', '');
  
  loadContent(initialPage);

  // Инициализация музыки
  music = document.getElementById('background-music');
  if (music) {
    music.volume = config.musicVolume;
    music.play().catch(() => {
      console.log('Автовоспроизведение заблокировано');
    });
  }

  createMusicToggleButton();
});

async function loadContent(page) {
  try {
    const response = await fetch(`content/${page}.html`);
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const container = document.querySelector('.container');
    container.innerHTML = `
      <h1 class="logo">${getPageTitle(page)}</h1>
      ${doc.querySelector('.content')?.innerHTML || ''}
      ${page !== 'index' ? '<button class="minecraft-button" data-page="index">На главную</button>' : ''}
    `;

    // Обновление обработчиков
    document.querySelectorAll('.minecraft-button[data-page]').forEach(btn => {
      btn.addEventListener('click', handleButtonClick);
      btn.addEventListener('mouseenter', () => playButtonSound('sounds/click.mp3'));
    });

    // Анимация
    if (document.querySelector('.content')) {
      document.querySelector('.content').style.animation = 'slideIn 0.5s ease-out';
    }

    // Обновление URL
    window.history.replaceState({}, '', page === 'index' ? '/' : `${page}.html`);

  } catch (error) {
    console.error('Ошибка загрузки:', error);
    loadContent('index');
  }
}

function handleButtonClick(e) {
  e.preventDefault();
  const page = e.target.getAttribute('data-page');
  window.history.pushState({}, '', page === 'index' ? '/' : `${page}.html`);
  loadContent(page);
}

function playButtonSound(soundPath) {
  if (!config.soundEnabled) return;
  const sound = new Audio(soundPath);
  sound.volume = 0.3;
  sound.play();
}

function createMusicToggleButton() {
  musicToggleButton = document.createElement('button');
  musicToggleButton.id = 'music-toggle';
  musicToggleButton.className = 'minecraft-button';
  musicToggleButton.innerHTML = '♫ Вкл музыку';
  musicToggleButton.style.position = 'fixed';
  musicToggleButton.style.bottom = '20px';
  musicToggleButton.style.right = '20px';

  musicToggleButton.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      musicToggleButton.innerHTML = '♫ Выкл музыку';
    } else {
      music.pause();
      musicToggleButton.innerHTML = '♫ Вкл музыку';
    }
  });

  document.body.appendChild(musicToggleButton);
}

function getPageTitle(page) {
  const titles = {
    'index': 'Minecraft Fan Site',
    'news': 'Новости',
    'guides': 'Гайды',
    'mods': 'Моды',
    'servers': 'Серверы',
    'forum': 'Форум',
    'about': 'О нас'
  };
  return titles[page] || 'Minecraft Fan Site';
}
