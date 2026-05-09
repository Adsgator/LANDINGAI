/**
 * Sistema de Keyboard Navigation
 * Tab, Enter, Escape para melhor UX
 */

class KeyboardNav {
  static init() {
    this.setupTabNavigation();
    this.setupEnterSubmit();
    this.setupEscapeClose();
    this.setupArrowKeys();
  }

  /**
   * Tab navigation em modais
   */
  static setupTabNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // Permitir tab natural
        // Focus management é feito em cada modal
      }
    });
  }

  /**
   * Enter para enviar formulários
   */
  static setupEnterSubmit() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        // Ctrl/Cmd + Enter = Submit
        const form = e.target.closest('form');
        if (form) {
          const submitBtn = form.querySelector('[type="submit"]');
          if (submitBtn) submitBtn.click();
        }
      }
    });
  }

  /**
   * Escape para fechar modais
   */
  static setupEscapeClose() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Fechar modal de erro
        const errorModal = document.getElementById('error-modal-overlay');
        if (errorModal && errorModal.classList.contains('visible')) {
          if (window.ErrorModal) ErrorModal.close();
          return;
        }

        // Fechar loader
        if (window.Loader && Loader.isVisible) {
          Loader.hide();
          return;
        }

        // Fechar dropdowns
        document.querySelectorAll('.dropdown.open').forEach((dropdown) => {
          dropdown.classList.remove('open');
        });
      }
    });
  }

  /**
   * Arrow keys para navegação em listas
   */
  static setupArrowKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const focusedElement = document.activeElement;
        const parent = focusedElement.closest('.list, .menu, .tabs');

        if (parent) {
          const items = Array.from(parent.querySelectorAll('[tabindex="0"], button, a'));
          const currentIndex = items.indexOf(focusedElement);

          if (currentIndex === -1) return;

          let nextIndex;
          if (e.key === 'ArrowUp') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          } else {
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          }

          items[nextIndex].focus();
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Atalhos customizados
   */
  static setupShortcuts() {
    const shortcuts = {
      'Ctrl+K': () => {
        if (window.App) {
          App.renderProjectsList();
          App.openModal('modal-projects');
        }
      },
      'Ctrl+N': () => {
        if (window.App) App.createProject();
      },
      'Ctrl+S': () => {
        if (window.App) App.autosave();
      },
      'Ctrl+G': () => {
        if (window.App) App.handleGoogleAdsClick();
      }
    };

    document.addEventListener('keydown', (e) => {
      const key = `${e.ctrlKey || e.metaKey ? 'Ctrl+' : ''}${e.key.toUpperCase()}`;

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    });
  }
}

// Init ao carregar
document.addEventListener('DOMContentLoaded', () => {
  KeyboardNav.init();
  KeyboardNav.setupShortcuts();
});

// Exportar global
window.KeyboardNav = KeyboardNav;
