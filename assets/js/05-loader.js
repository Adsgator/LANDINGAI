/**
 * Sistema global de loading states
 * Gerencia todos os spinners e feedback visual durante processamento
 */

class LoaderSystem {
  constructor() {
    this.isVisible = false;
    this.loaderElement = null;
    this.initLoader();
  }

  /**
   * Inicializar elemento de loader
   */
  initLoader() {
    // Criar elemento se não existir
    if (!document.getElementById('global-loader')) {
      const loaderHTML = `
        <div id="global-loader">
          <div class="loader-spinner"></div>
          <p class="loader-text" id="loader-text">Processando...</p>
          <p class="loader-subtext" id="loader-subtext"></p>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', loaderHTML);
    }
    this.loaderElement = document.getElementById('global-loader');
  }

  /**
   * Mostrar loader com mensagem customizada
   * @param {string} text - Texto principal
   * @param {string} subtext - Texto secundário
   */
  show(text = 'Processando...', subtext = '') {
    if (!this.loaderElement) this.initLoader();

    document.getElementById('loader-text').textContent = text;
    
    const subtextEl = document.getElementById('loader-subtext');
    if (subtext) {
      subtextEl.textContent = subtext;
      subtextEl.style.display = 'block';
    } else {
      subtextEl.style.display = 'none';
    }

    this.loaderElement.classList.remove('hidden');
    this.loaderElement.classList.add('visible');
    this.isVisible = true;

    // Prevent scrolling
    document.body.style.overflow = 'hidden';
  }

  /**
   * Esconder loader
   */
  hide() {
    if (!this.loaderElement) return;

    this.loaderElement.classList.remove('visible');
    this.loaderElement.classList.add('hidden');
    this.isVisible = false;

    // Restore scrolling
    document.body.style.overflow = 'auto';
  }

  /**
   * Update mensagem sem fechar loader
   */
  updateMessage(text, subtext = '') {
    if (!this.isVisible) return;

    document.getElementById('loader-text').textContent = text;
    
    const subtextEl = document.getElementById('loader-subtext');
    if (subtext) {
      subtextEl.textContent = subtext;
      subtextEl.style.display = 'block';
    } else {
      subtextEl.style.display = 'none';
    }
  }

  /**
   * Wrapper para operações assíncronas
   * @param {Promise} promise - Promise a executar
   * @param {string} loadingText - Texto durante loading
   * @returns {Promise}
   */
  async withLoader(promise, loadingText = 'Processando...') {
    this.show(loadingText);
    try {
      const result = await promise;
      this.hide();
      return result;
    } catch (error) {
      this.hide();
      throw error;
    }
  }
}

// Instância global
window.Loader = new LoaderSystem();
