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

    // 2. Registrar eventos globais ANTES de qualquer renderização
    this.setupGlobalEvents();

    // 3. Garantir projeto ativo válido
    const hasValidActive = this.state.activeId && this.state.projects[this.state.activeId];

    if (!hasValidActive) {
      const ids = Object.keys(this.state.projects);
      if (ids.length > 0) {
        // Selecionar o projeto mais recente
        const sorted = ids.sort((a, b) =>
          new Date(this.state.projects[b].updatedAt || 0) -
          new Date(this.state.projects[a].updatedAt || 0)
        );
        this.state.activeId = sorted[0];
        console.log('[AIGator] Recuperando projeto existente:', this.state.activeId);
      } else {
        // Criar o primeiro projeto
        const id = 'p_' + Date.now();
        this.state.projects[id] = {
          id,
          name: 'Novo Projeto',
          slug: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          visitedSteps: [],
          briefing: {
            integracoes: ['whatsapp'],
            depoimentos_formato: [],
            arte_referencias_pessoais: [],
            arte_referencias_nicho: [],
          },
        };
        this.state.activeId = id;
        console.log('[AIGator] Primeiro acesso — projeto criado:', id);
      }
      this.saveStorage();
    } else {
      console.log('[AIGator] Projeto ativo carregado:', this.state.activeId, this.P?.name);
    }

    // 4. Renderizar tudo
    this.renderAll();

    // 5. Permissão de notificação (silencioso)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
});

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
