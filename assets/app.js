/* ============================================================
   LandingAI v2 — Entry Point
   ============================================================ */

Object.assign(window.App, {
  init() {
    console.log('LandingAI v2 modularizado inicializando...');
    
    // 1. Carregar dados do localStorage
    this.loadStorage();
    
    // 2. Garantir que exista um projeto ativo
    if (!this.state.activeId || !this.P) {
      this.createProject('Meu Primeiro Projeto');
    }
    
    // 3. Setup de Eventos Globais
    this.setupGlobalEvents();
    
    // 4. Render Inicial
    this.renderAll();
    
    // 5. Solicitar permissões (opcional)
    if ('Notification' in window && Notification.permission === 'default') {
      // Notification.requestPermission();
    }
    
    console.log('LandingAI v2 pronto.');
  }
});

// Inicialização Automática após carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
