/* ============================================================
   AIGator — LandingAI Module — Entry Point
   ============================================================ */

// Declarar o objeto global ANTES de qualquer outro arquivo usar Object.assign
// Este arquivo é o último a ser carregado — mas App precisa existir primeiro.
// A ordem de carregamento no HTML garante isso.

window.App = window.App || {};

Object.assign(window.App, {
  init() {
    // 1. Carregar dados do localStorage
    this.loadStorage();

    // 2. Se não houver projeto ativo válido, criar um novo
    if (!this.state.activeId || !this.state.projects[this.state.activeId]) {
      const ids = Object.keys(this.state.projects);
      if (ids.length > 0) {
        this.state.activeId = ids[ids.length - 1]; // pegar o mais recente
      } else {
        this.createProject('Novo Projeto'); // cria e já salva
        return; // createProject chama renderAll internamente
      }
    }

    // 3. Registrar eventos globais
    this.setupGlobalEvents();

    // 4. Renderizar tudo
    this.renderAll();

    // 5. Solicitar permissão de notificação (silencioso)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
});

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
