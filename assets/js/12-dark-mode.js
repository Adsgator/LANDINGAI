/**
 * Sistema de Dark Mode
 * Controle de tema e persistência
 */

class DarkModeManager {
  constructor() {
    this.isDarkMode = this.loadPreference();
    this.init();
  }

  init() {
    // Aplicar tema salvo
    this.setDarkMode(this.isDarkMode);

    // Criar toggle button
    this.createToggleButton();

    // Detectar preferência do sistema
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          this.setDarkMode(e.matches);
        });
    }
  }

  /**
   * Carregar preferência salva
   */
  loadPreference() {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }

    // Se não tiver salvo, usar preferência do sistema
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Definir dark mode
   */
  setDarkMode(enabled) {
    this.isDarkMode = enabled;

    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    localStorage.setItem('darkMode', enabled);
    this.updateToggleButton();
  }

  /**
   * Toggle dark mode
   */
  toggle() {
    this.setDarkMode(!this.isDarkMode);
  }

  /**
   * Criar botão de toggle
   */
  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.setAttribute('data-tooltip', this.isDarkMode ? 'Light mode' : 'Dark mode');
    button.innerHTML = `<span class="dark-mode-toggle-icon">${this.isDarkMode ? '☀️' : '🌙'}</span>`;
    button.onclick = () => this.toggle();

    // Inserir no header ao lado de Config
    const header = document.querySelector('.header-controls');
    if (header) {
      header.insertBefore(button, header.firstChild);
    }
  }

  /**
   * Atualizar visual do botão
   */
  updateToggleButton() {
    const button = document.querySelector('.dark-mode-toggle');
    if (button) {
      button.innerHTML = `<span class="dark-mode-toggle-icon">${this.isDarkMode ? '☀️' : '🌙'}</span>`;
      button.setAttribute('data-tooltip', this.isDarkMode ? 'Light mode' : 'Dark mode');
    }
  }
}

// Instância global
window.DarkMode = new DarkModeManager();
