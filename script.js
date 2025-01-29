const config = {
  musicVolume: 0.3,
  soundEnabled: true
};

let music;
let musicToggleButton;

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMusic();
});

function initNavigation() {
  const path = window.location.pathname.split('/').pop();
  const initialPage = path === 'index.html' || path === '' ? 'index' : path.replace('.html', '');
  loadContent(initialPage);
}

async function loadContent(page) {
  try {
    const response = await fetch(`content/${page}.html`);
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const container = document.querySelector('.container');
    container.innerHTML = `
      <h1 class="logo">${getPageTitle(page)}</h1>
      ${doc.querySelector('.content').innerHTML}
      ${page !== 'index' ? '<button class="minecraft-button" data-page="index">На главную</button>' : ''}
    `;

    window.history.pushState({}, '', page === 'index' ? '/' : `${page}.html`);
    addButtonListeners();

  } catch (error) {
    console.error(error);
    loadContent('index');
  }
}

function addButtonListeners() {
  document.querySelectorAll('.minecraft-button').forEach(button => {
    button.addEventListener('click', handleNavigation);
    button.addEventListener('mouseenter', playHoverSound);
  });
}

function handleNavigation(e) {
  e.preventDefault();
  const page = e.target.dataset.page;
  if (page) loadContent(page);
}

function playHoverSound() {
  if (!config.soundEnabled) return;
  const sound = new Audio('sounds/click.mp3');
  sound.volume = 0.3;
  sound.play();
}

function initMusic() {
  music = document.getElementById('background-music');
  music.volume = config.musicVolume;
  
  musicToggleButton = document.createElement('button');
  musicToggleButton.className = 'minecraft-button';
  musicToggleButton.textContent = '♫ Музыка Вкл';
  musicToggleButton.id = 'music-toggle';
  
  musicToggleButton.addEventListener('click', () => {
    music.paused ? music.play() : music.pause();
    musicToggleButton.textContent = music.paused ? '♫ Музыка Выкл' : '♫ Музыка Вкл';
  });
  
  document.body.appendChild(musicToggleButton);
}

function getPageTitle(page) {
  const titles = {
    index: 'Minecraft Fan Site',
    news: 'Новости',
    guides: 'Гайды',
    mods: 'Моды',
    servers: 'Серверы',
    forum: 'Форум',
    about: 'О нас'
  };
  return titles[page] || 'Minecraft Fan Site';
}
