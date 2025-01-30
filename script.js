class MinecraftSite {
  constructor() {
    this.config = {
      musicVolume: 0.3,
      soundEnabled: true
    };
    
    this.init();
  }

  init() {
    this.loadInitialPage();
    this.setupEventListeners();
    this.initMusic();
  }

  loadInitialPage() {
    const path = window.location.pathname.split('/').pop();
    const page = path === 'index.html' || path === '' ? 'index' : path.replace('.html', '');
    this.loadContent(page);
  }

  async loadContent(page) {
    try {
      const response = await fetch(`./content/${page}.html`);
      if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      document.querySelector('.container').innerHTML = `
        <h1 class="logo">${this.getPageTitle(page)}</h1>
        ${doc.querySelector('.content').innerHTML}
        ${page !== 'index' ? '<button class="minecraft-button" data-page="index">На главную</button>' : ''}
      `;

      window.history.pushState({}, '', page === 'index' ? '/' : `${page}.html`);
      this.setupDynamicElements();

    } catch (error) {
      console.error(error);
      this.loadContent('index');
    }
  }

  setupEventListeners() {
    document.body.addEventListener('click', (e) => {
      if (e.target.dataset.page) {
        this.loadContent(e.target.dataset.page);
      }
      if (e.target.dataset.action === 'home') {
        this.loadContent('index');
      }
    });
  }

  initMusic() {
    this.music = new Audio('music.mp3');
    this.music.volume = this.config.musicVolume;
    this.music.loop = true;
    
    const musicControl = document.createElement('button');
    musicControl.className = 'minecraft-button';
    musicControl.textContent = '♫ Вкл музыку';
    musicControl.id = 'music-toggle';
    
    musicControl.addEventListener('click', () => {
      this.music.paused ? this.music.play() : this.music.pause();
      musicControl.textContent = this.music.paused ? '♫ Вкл музыку' : '♫ Выкл музыку';
    });
    
    document.body.appendChild(musicControl);
  }

  getPageTitle(page) {
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
}

// Запуск приложения
new MinecraftSite();
