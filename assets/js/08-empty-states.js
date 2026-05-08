/**
 * Sistema de Empty States
 * Mostra mensagens úteis quando não há dados
 */

class EmptyStateManager {
  /**
   * Mostrar empty state para lista vazia
   */
  static showNoProjects(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const emptyHTML = `
      <div class="empty-state no-projects">
        <div class="empty-icon">📋</div>
        <h3>Nenhum projeto ainda</h3>
        <p>Comece criando uma nova landing page para seu cliente. Preencha as informações e deixe a IA gerar a página.</p>
        <button class="btn btn-primary" onclick="switchScreen('intake')">
          Criar Novo Projeto
        </button>
      </div>
    `;

    container.innerHTML = emptyHTML;
  }

  /**
   * Empty state para busca sem resultados
   */
  static showNoResults(containerId, searchTerm) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const emptyHTML = `
      <div class="empty-state no-results">
        <div class="empty-icon">🔍</div>
        <h3>Nenhum resultado encontrado</h3>
        <p>Não encontramos nada para "<strong>${searchTerm}</strong>". Tente outro termo de busca.</p>
        <button class="btn btn-secondary" onclick="clearSearch()">
          Limpar Busca
        </button>
      </div>
    `;

    container.innerHTML = emptyHTML;
  }

  /**
   * Empty state para erro
   */
  static showError(containerId, title, message, retryCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const emptyHTML = `
      <div class="empty-state error">
        <div class="empty-icon">❌</div>
        <h3>${title}</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="emptyStateRetry()">
          Tentar Novamente
        </button>
      </div>
    `;

    container.innerHTML = emptyHTML;
    window.emptyStateRetry = retryCallback;
  }

  /**
   * Empty state para nenhum item selecionado
   */
  static showNoSelection(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const emptyHTML = `
      <div class="empty-state">
        <div class="empty-icon">👈</div>
        <h3>Selecione um item</h3>
        <p>Clique em um item da lista para ver os detalhes.</p>
      </div>
    `;

    container.innerHTML = emptyHTML;
  }

  /**
   * Clear empty state e mostrar conteúdo
   */
  static clear(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
    }
  }
}

// Exportar para uso global
window.EmptyStateManager = EmptyStateManager;
