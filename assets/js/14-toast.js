/**
 * Sistema de Toast Notifications Melhorado
 * Notificações não-bloqueantes
 */

class ToastManager {
  constructor() {
    this.toastId = 0;
    this.createContainer();
  }

  createContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }

  /**
   * Mostrar toast
   */
  show(message, type = 'info', duration = 3000) {
    const id = this.toastId++;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${id}`;

    // Ícone
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || ''}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="document.getElementById('toast-${id}').remove()">×</button>
    `;

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    // Adicionar classe para animação
    setTimeout(() => toast.classList.add('visible'), 10);

    // Auto-remover
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
        }, 300);
      }, duration);
    }

    return id;
  }

  /**
   * Atalhos
   */
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }

  /**
   * Remover toast específico
   */
  remove(id) {
    const toast = document.getElementById(`toast-${id}`);
    if (toast) {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }
  }
}

// Instância global
// window.Toast = new ToastManager();
// Sistema de toast principal é App.showToast() que usa #toast no HTML.
// ToastManager disponível para uso futuro via: window.Toast = new ToastManager();
