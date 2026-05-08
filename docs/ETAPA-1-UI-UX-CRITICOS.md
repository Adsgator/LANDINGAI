# 🎨 LANDINGAI — UI/UX/DESIGN FINALIZAÇÃO ETAPA 1

**Versão:** 1.0.0  
**Data:** 2026-05-08  
**Escopo:** Implementar todos os componentes críticos (Loading, Error Modal, GA Visual, Integração)  
**Tempo Estimado:** 2-3 horas  
**Status:** Pronto para Roo Code implementar

---

## 📋 RESUMO ETAPA 1

Implementar **5 componentes críticos** que são essenciais para o projeto rodar:

1. ✅ Sistema de Loading Global (Spinner)
2. ✅ Modal de Erro Padrão (Feedback Visual)
3. ✅ Google Ads: CSS e Layout Completo
4. ✅ Integração GA ao Menu Principal
5. ✅ Validação Visual em Campos de Input

**Resultado:** Sistema pronto para usar, com feedback visual claro em todas as ações.

---

## 🔧 COMPONENTE 1: SISTEMA DE LOADING GLOBAL

### **Arquivo:** `assets/css/05-loader.css` (NOVO)

```css
/* ================================================
   LANDINGAI — Loading States & Spinners
   ================================================ */

/* Global Loader Overlay */
#global-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.2s ease;
}

#global-loader.visible {
  display: flex;
}

#global-loader.hidden {
  display: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Spinner Animation */
.loader-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.25);
  border-top: 4px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--space-4);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Loader Text */
.loader-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  max-width: 300px;
  line-height: 1.6;
  margin: var(--space-2) 0 0 0;
}

.loader-subtext {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin-top: var(--space-1);
}

/* Inline Loading (dentro de containers) */
.loading-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  color: var(--text-secondary);
  font-size: 13px;
}

.loading-inline .spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-default);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Skeleton Loading (para placeholders) */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-overlay) 0%,
    var(--bg-surface) 50%,
    var(--bg-overlay) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: var(--r-md);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-text {
  height: 16px;
  margin-bottom: var(--space-2);
}

.skeleton-heading {
  height: 24px;
  margin-bottom: var(--space-3);
}

.skeleton-button {
  height: 36px;
  width: 120px;
}

/* Pulse Animation */
.pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

/* Loading States for Buttons */
.btn.loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}

/* Container Loading */
.container-loading {
  position: relative;
  pointer-events: none;
  opacity: 0.6;
}

.container-loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  z-index: 10;
  border-radius: inherit;
}
```

### **Arquivo:** `assets/js/05-loader.js` (NOVO)

```javascript
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

// Exemplo de uso:
// await Loader.withLoader(
//   callAI({...}),
//   '🤖 Gerando estrutura com IA...'
// );
```

### **Integração em `index.html`:**

```html
<!-- Adicionar no <head> antes de </head> -->
<link rel="stylesheet" href="assets/css/05-loader.css">

<!-- Adicionar no <body> antes de </body>, após outros scripts -->
<script src="assets/js/05-loader.js"></script>
```

### **Como usar em todo código:**

```javascript
// Exemplo 1: Gerar estrutura
async function generateEstrutura() {
  try {
    await Loader.withLoader(
      callAI({
        model: App.state.selectedModel,
        userPrompt: 'Gerar estrutura...'
      }),
      '🏗️ Gerando estrutura da landing page...'
    );
    showToast('success', 'Estrutura gerada com sucesso!');
  } catch (error) {
    showErrorModal('Erro na Geração', error.message);
  }
}

// Exemplo 2: Com update de mensagem
async function generateStrategy() {
  Loader.show('📊 Analisando briefing...');
  
  setTimeout(() => {
    Loader.updateMessage('📊 Analisando briefing...', 'Gerando estratégia de campanhas');
  }, 2000);

  try {
    const result = await callAI({...});
    Loader.hide();
    return result;
  } catch (error) {
    Loader.hide();
    throw error;
  }
}
```

---

## 🔧 COMPONENTE 2: MODAL DE ERRO PADRÃO

### **Arquivo:** `assets/css/06-error-modal.css` (NOVO)

```css
/* ================================================
   LANDINGAI — Error Modal & Validation
   ================================================ */

/* Error Modal Overlay */
.error-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
  animation: overlayFadeIn 0.2s ease;
}

.error-modal-overlay.visible {
  display: flex;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Error Modal */
.error-modal {
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  padding: var(--space-6);
  max-width: 520px;
  width: 90%;
  box-shadow: var(--shadow-xl);
  position: relative;
  border: 1px solid var(--danger);
  border-left: 4px solid var(--danger);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Close Button */
.error-modal .btn-close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-tertiary);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  transition: all var(--t-fast);
}

.error-modal .btn-close:hover {
  background: var(--bg-overlay);
  color: var(--text-primary);
}

/* Error Icon */
.error-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: var(--space-3);
  animation: errorBounce 0.5s ease;
}

@keyframes errorBounce {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Modal Title */
.error-modal h2 {
  color: var(--danger);
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 var(--space-2) 0;
}

/* Modal Message */
.error-modal > p {
  color: var(--text-secondary);
  margin: 0 0 var(--space-3) 0;
  line-height: 1.6;
  font-size: 14px;
}

/* Error Details */
.error-details {
  background: var(--bg-overlay);
  border-left: 3px solid var(--danger);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--r-sm);
  margin-bottom: var(--space-4);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  max-height: 240px;
  overflow-y: auto;
  line-height: 1.6;
}

.error-details-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.error-detail-item {
  color: var(--danger);
  margin-bottom: var(--space-2);
}

.error-detail-item::before {
  content: '❌ ';
  margin-right: var(--space-1);
}

/* Warning Details */
.warning-details {
  background: var(--bg-overlay);
  border-left: 3px solid var(--warning);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--r-sm);
  margin-bottom: var(--space-4);
}

.warning-details-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.warning-detail-item {
  color: var(--warning);
  font-size: 13px;
  margin-bottom: var(--space-1);
  line-height: 1.5;
}

.warning-detail-item::before {
  content: '⚠️ ';
  margin-right: var(--space-1);
}

/* Modal Actions */
.error-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

.error-actions .btn {
  min-width: 120px;
}

/* Success Modal (variant) */
.success-modal {
  border-color: var(--success);
  border-left-color: var(--success);
}

.success-modal h2 {
  color: var(--success);
}

.success-modal .error-icon {
  font-size: 56px;
}

/* Input Validation States */
.field-error {
  border-color: var(--danger) !important;
  background: var(--danger-dim) !important;
}

.field-error::placeholder {
  color: var(--danger);
}

.field-error-message {
  font-size: 12px;
  color: var(--danger);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.field-error-message::before {
  content: '⚠️';
}

.field-success {
  border-color: var(--success) !important;
  background: var(--success-dim) !important;
}

.field-success-message {
  font-size: 12px;
  color: var(--success);
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.field-success-message::before {
  content: '✅';
}
```

### **Arquivo:** `assets/js/06-error-modal.js` (NOVO)

```javascript
/**
 * Sistema de Modal de Erro Padrão
 * Feedback visual claro para erros e validações
 */

class ErrorModalSystem {
  constructor() {
    this.initModal();
  }

  initModal() {
    if (!document.querySelector('.error-modal-overlay')) {
      const modalHTML = `
        <div class="error-modal-overlay" id="error-modal-overlay">
          <div class="error-modal">
            <button class="btn-close" onclick="ErrorModal.close()">&times;</button>
            <div class="error-icon" id="error-icon">⚠️</div>
            <h2 id="error-title">Algo deu errado</h2>
            <p id="error-message"></p>
            <div id="error-details-container"></div>
            <div id="warning-details-container"></div>
            <div class="error-actions">
              <button class="btn btn-secondary" onclick="ErrorModal.close()">Fechar</button>
              <button class="btn btn-primary" id="btn-retry" style="display: none;" onclick="ErrorModal.retry()">
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
  }

  /**
   * Mostrar modal de erro
   * @param {string} title - Título do erro
   * @param {string} message - Mensagem principal
   * @param {array} errors - Array de erros
   * @param {array} warnings - Array de avisos
   * @param {function} retryCallback - Callback para retry
   */
  show(title, message, errors = null, warnings = null, retryCallback = null) {
    const overlay = document.getElementById('error-modal-overlay');
    const modal = overlay.querySelector('.error-modal');

    // Configurar título
    document.getElementById('error-title').textContent = title;
    document.getElementById('error-message').textContent = message;

    // Limpar containers
    document.getElementById('error-details-container').innerHTML = '';
    document.getElementById('warning-details-container').innerHTML = '';

    // Adicionar erros
    if (errors && errors.length > 0) {
      const detailsHTML = `
        <div class="error-details">
          <div class="error-details-title">Erros encontrados:</div>
          ${errors.map(err => `
            <div class="error-detail-item">${err}</div>
          `).join('')}
        </div>
      `;
      document.getElementById('error-details-container').innerHTML = detailsHTML;
    }

    // Adicionar avisos
    if (warnings && warnings.length > 0) {
      const warningHTML = `
        <div class="warning-details">
          <div class="warning-details-title">Avisos:</div>
          ${warnings.map(warn => `
            <div class="warning-detail-item">${warn}</div>
          `).join('')}
        </div>
      `;
      document.getElementById('warning-details-container').innerHTML = warningHTML;
    }

    // Configurar retry button
    const retryBtn = document.getElementById('btn-retry');
    if (retryCallback) {
      this.retryCallback = retryCallback;
      retryBtn.style.display = 'block';
    } else {
      retryBtn.style.display = 'none';
    }

    // Mostrar modal
    overlay.classList.add('visible');

    // Trap focus
    this.trapFocus(modal);
  }

  /**
   * Mostrar modal de sucesso
   */
  showSuccess(title, message) {
    const overlay = document.getElementById('error-modal-overlay');
    const modal = overlay.querySelector('.error-modal');
    
    modal.classList.add('success-modal');
    document.getElementById('error-icon').textContent = '✅';
    document.getElementById('error-title').textContent = title;
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-details-container').innerHTML = '';
    document.getElementById('warning-details-container').innerHTML = '';
    document.getElementById('btn-retry').style.display = 'none';

    overlay.classList.add('visible');
  }

  /**
   * Fechar modal
   */
  close() {
    const overlay = document.getElementById('error-modal-overlay');
    const modal = overlay.querySelector('.error-modal');
    
    overlay.classList.remove('visible');
    modal.classList.remove('success-modal');
    document.getElementById('error-icon').textContent = '⚠️';
    
    this.releaseFocus();
  }

  /**
   * Retry action
   */
  retry() {
    this.close();
    if (this.retryCallback) {
      this.retryCallback();
    }
  }

  /**
   * Trap focus dentro do modal
   */
  trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  releaseFocus() {
    document.removeEventListener('keydown', this.trapFocus);
  }

  /**
   * Validar campos do formulário
   * @param {object} fields - { fieldName: { value, required, minLength, etc } }
   * @returns {object} { valid, errors, warnings }
   */
  validateForm(fields) {
    const errors = [];
    const warnings = [];

    Object.entries(fields).forEach(([name, config]) => {
      const value = config.value || '';

      // Required
      if (config.required && !value.trim()) {
        errors.push(`${config.label || name} é obrigatório`);
      }

      // Min Length
      if (config.minLength && value.length < config.minLength) {
        errors.push(
          `${config.label || name} deve ter no mínimo ${config.minLength} caracteres`
        );
      }

      // Max Length
      if (config.maxLength && value.length > config.maxLength) {
        warnings.push(
          `${config.label || name} tem ${value.length} caracteres (máx: ${config.maxLength})`
        );
      }

      // Pattern (regex)
      if (config.pattern && !config.pattern.test(value)) {
        errors.push(
          `${config.label || name} está em formato inválido`
        );
      }

      // Custom validator
      if (config.validator) {
        const result = config.validator(value);
        if (result.error) {
          errors.push(`${config.label || name}: ${result.error}`);
        }
        if (result.warning) {
          warnings.push(`${config.label || name}: ${result.warning}`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Marcar campo com erro
   */
  markFieldError(fieldElement, message) {
    fieldElement.classList.add('field-error');
    
    // Remover mensagem anterior
    const oldMessage = fieldElement.parentElement.querySelector('.field-error-message');
    if (oldMessage) oldMessage.remove();

    // Adicionar nova mensagem
    const msgEl = document.createElement('div');
    msgEl.className = 'field-error-message';
    msgEl.textContent = message;
    fieldElement.parentElement.appendChild(msgEl);
  }

  /**
   * Marcar campo com sucesso
   */
  markFieldSuccess(fieldElement, message = null) {
    fieldElement.classList.remove('field-error');
    fieldElement.classList.add('field-success');

    // Remover mensagem anterior
    const oldMessage = fieldElement.parentElement.querySelector('.field-error-message');
    if (oldMessage) oldMessage.remove();

    if (message) {
      const msgEl = document.createElement('div');
      msgEl.className = 'field-success-message';
      msgEl.textContent = message;
      fieldElement.parentElement.appendChild(msgEl);
    }
  }

  /**
   * Limpar marcação de campo
   */
  clearFieldMarking(fieldElement) {
    fieldElement.classList.remove('field-error', 'field-success');
    
    const message = fieldElement.parentElement.querySelector(
      '.field-error-message, .field-success-message'
    );
    if (message) message.remove();
  }
}

// Instância global
window.ErrorModal = new ErrorModalSystem();

// Exemplo de uso:
/*
ErrorModal.show(
  'Erro na Geração',
  'Não foi possível gerar a landing page.',
  [
    'Campo "Serviço" é obrigatório',
    'API Key inválida para Claude'
  ],
  [
    'Estrutura pode levar mais tempo com este modelo'
  ],
  () => generateEstrutura() // retry callback
);

// Validação de formulário
const validation = ErrorModal.validateForm({
  cliente: {
    value: document.getElementById('cliente').value,
    label: 'Cliente',
    required: true,
    minLength: 3
  },
  email: {
    value: document.getElementById('email').value,
    label: 'Email',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
});

if (!validation.valid) {
  ErrorModal.show(
    'Validação Falhou',
    'Por favor, corrija os erros abaixo.',
    validation.errors,
    validation.warnings
  );
}
*/
```

### **Integração em `index.html`:**

```html
<!-- Adicionar no <head> -->
<link rel="stylesheet" href="assets/css/06-error-modal.css">

<!-- Adicionar no <body> após 05-loader.js -->
<script src="assets/js/06-error-modal.js"></script>
```

---

## 🔧 COMPONENTE 3: GOOGLE ADS — CSS COMPLETO

### **Arquivo:** `modules/google-ads/styles/google-ads.css` (COMPLETO)

```css
/* ================================================
   LANDINGAI — Google Ads Module Styles
   ================================================ */

/* ── Container Principal ────────────────────── */
.ga-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6);
  background: var(--bg-default);
  min-height: 100vh;
}

/* ── Header ────────────────────────────────── */
.ga-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 2px solid var(--border-default);
}

.ga-header-content {
  flex: 1;
}

.ga-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
}

.ga-header-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.ga-header-icon {
  font-size: 48px;
}

/* ── Tabs System ────────────────────────────── */
.ga-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-default);
  padding-bottom: 0;
}

.ga-tab {
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-base);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.ga-tab:hover {
  color: var(--text-primary);
}

.ga-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* ── Tab Content ────────────────────────────── */
.ga-tab-content {
  display: none;
}

.ga-tab-content.active {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ── Form Section ────────────────────────────── */
.ga-form-section {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  padding: var(--space-6);
  margin-bottom: var(--space-6);
}

.ga-form-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* ── Form Grid ──────────────────────────────── */
.ga-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.ga-form-grid.full {
  grid-template-columns: 1fr;
}

/* ── Form Group ────────────────────────────── */
.ga-form-group {
  display: flex;
  flex-direction: column;
}

.ga-form-group label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  font-size: 14px;
}

.ga-form-group label .required {
  color: var(--danger);
}

.ga-form-group input,
.ga-form-group select,
.ga-form-group textarea {
  width: 100%;
  padding: var(--space-3) var(--space-3);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-overlay);
  transition: all var(--t-fast);
}

.ga-form-group input::placeholder,
.ga-form-group textarea::placeholder {
  color: var(--text-tertiary);
}

.ga-form-group input:hover,
.ga-form-group select:hover,
.ga-form-group textarea:hover {
  border-color: var(--border-strong);
  background: var(--bg-surface);
}

.ga-form-group input:focus,
.ga-form-group select:focus,
.ga-form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-surface);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

.ga-form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* ── Form Hint ──────────────────────────────── */
.ga-form-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: var(--space-1);
  line-height: 1.5;
}

.ga-form-hint.warning {
  color: var(--warning);
  background: var(--warning-dim);
  padding: var(--space-2);
  border-radius: var(--r-sm);
  border-left: 2px solid var(--warning);
  margin-top: var(--space-2);
}

/* ── Buttons ────────────────────────────────── */
.ga-button-group {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-6);
  justify-content: flex-end;
}

.btn-ga-primary {
  padding: var(--space-3) var(--space-6);
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-base);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-ga-primary:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
}

.btn-ga-primary:active {
  transform: translateY(0);
}

.btn-ga-secondary {
  padding: var(--space-3) var(--space-6);
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-base);
}

.btn-ga-secondary:hover {
  background: var(--accent-dim);
}

/* ── Output Section ────────────────────────– */
.ga-output-section {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  padding: var(--space-6);
  margin-top: var(--space-6);
}

.ga-output-header {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-default);
}

.ga-output-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
}

/* ── Stats Grid ────────────────────────────── */
.ga-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.ga-stat {
  background: var(--accent-dim);
  padding: var(--space-3);
  border-radius: var(--r-md);
  border-left: 3px solid var(--accent);
}

.ga-stat.warning {
  background: var(--warning-dim);
  border-left-color: var(--warning);
}

.ga-stat.success {
  background: var(--success-dim);
  border-left-color: var(--success);
}

.ga-stat-label {
  font-size: 11px;
  color: var(--text-tertiary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-1);
}

.ga-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
}

.ga-stat.warning .ga-stat-value {
  color: var(--warning);
}

.ga-stat.success .ga-stat-value {
  color: var(--success);
}

/* ── Campaign Cards ────────────────────────– */
.ga-campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4);
}

.ga-campaign-card {
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: var(--space-4);
  transition: all var(--t-base);
}

.ga-campaign-card:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ga-campaign-card-header {
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-default);
}

.ga-campaign-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
}

.ga-campaign-budget {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
}

/* ── Tags ────────────────────────────────── */
.ga-tags {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
}

.ga-tag {
  display: inline-block;
  background: var(--accent-dim);
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--r-pill);
}

.ga-tag.network-search {
  background: #e0e7ff;
  color: #4338ca;
}

.ga-tag.network-display {
  background: #fef2f2;
  color: #dc2626;
}

.ga-tag.network-youtube {
  background: #fef3c7;
  color: #d97706;
}

.ga-tag.network-pmax {
  background: #dcfce7;
  color: #15803d;
}

/* ── Content Items ──────────────────────── */
.ga-content-item {
  padding: var(--space-3);
  background: var(--bg-surface);
  border-radius: var(--r-sm);
  margin-bottom: var(--space-2);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.ga-content-item strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
  font-weight: 600;
}

/* ── Action Buttons ────────────────────── */
.ga-action-buttons {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.btn-copy {
  flex: 1;
  padding: var(--space-2) var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
}

.btn-copy:hover {
  background: var(--accent-dim);
  color: var(--accent);
  border-color: var(--accent);
}

.btn-copy.copied {
  background: var(--success-dim);
  color: var(--success);
  border-color: var(--success);
}

/* ── Empty State ────────────────────────── */
.ga-empty-state {
  text-align: center;
  padding: var(--space-8);
  color: var(--text-secondary);
}

.ga-empty-icon {
  font-size: 64px;
  margin-bottom: var(--space-3);
  opacity: 0.5;
}

.ga-empty-state h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.ga-empty-state p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 var(--space-4) 0;
  line-height: 1.6;
}

/* ── Responsive ────────────────────────── */
@media (max-width: 768px) {
  .ga-container {
    padding: var(--space-3);
  }

  .ga-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .ga-form-grid {
    grid-template-columns: 1fr;
  }

  .ga-campaigns-grid {
    grid-template-columns: 1fr;
  }

  .ga-button-group {
    flex-direction: column-reverse;
  }

  .btn-ga-primary,
  .btn-ga-secondary {
    width: 100%;
  }

  .ga-tabs {
    flex-wrap: wrap;
  }
}
```

---

## 🔧 COMPONENTE 4: INTEGRAÇÃO GA AO MENU PRINCIPAL

### **Arquivo:** `index.html` (MODIFICAÇÃO)

```html
<!-- No sidebar, adicionar novo botão ANTES de </div> final do sidebar -->

<button id="btn-google-ads" class="sidebar-btn" data-screen="google-ads">
  <i data-lucide="trending-up"></i>
  <span>Google Ads</span>
</button>
```

### **Arquivo:** `assets/js/app.js` (ADICIONAR)

```javascript
/**
 * Integração do módulo Google Ads
 */

// Adicionar listener no botão GA
document.addEventListener('DOMContentLoaded', () => {
  const gaBtn = document.getElementById('btn-google-ads');
  
  if (gaBtn) {
    gaBtn.addEventListener('click', () => {
      handleGoogleAdsClick();
    });
  }
});

/**
 * Navegar para Google Ads
 */
function handleGoogleAdsClick() {
  // Verificar se tem LP gerada
  const hasGeneratedLP = localStorage.getItem('generated_structure');
  
  if (!hasGeneratedLP) {
    ErrorModal.show(
      '❌ Nenhuma Landing Page Criada',
      'Crie uma landing page primeiro antes de usar o módulo Google Ads.',
      [
        'Vá para "Intake" e preencha as informações do cliente',
        'Complete todos os 8 passos do briefing',
        'Gere a landing page',
        'Então use o Google Ads'
      ],
      null,
      () => switchScreen('intake')
    );
    return;
  }

  // Navegar para Google Ads
  Loader.show('🚀 Carregando módulo Google Ads...');
  
  setTimeout(() => {
    window.location.href = './modules/google-ads/index.html?lp=current';
  }, 500);
}

/**
 * Passar contexto da LP para GA via localStorage
 */
function prepareGAContext() {
  const context = {
    briefing: JSON.parse(localStorage.getItem('briefing_bruto') || '{}'),
    structure: JSON.parse(localStorage.getItem('generated_structure') || '{}'),
    lpUrl: localStorage.getItem('lp_url') || '',
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('ga_context', JSON.stringify(context));
}
```

---

## 🔧 COMPONENTE 5: VALIDAÇÃO VISUAL EM CAMPOS

### **Arquivo:** `assets/css/07-form-validation.css` (NOVO)

```css
/* ================================================
   LANDINGAI — Form Validation Styles
   ================================================ */

/* ── Input States ────────────────────────────– */
input.valid,
textarea.valid,
select.valid {
  border-color: var(--success) !important;
  background: var(--success-dim) !important;
}

input.valid:focus,
textarea.valid:focus,
select.valid:focus {
  border-color: var(--success) !important;
  box-shadow: 0 0 0 3px var(--success-dim) !important;
}

input.invalid,
textarea.invalid,
select.invalid {
  border-color: var(--danger) !important;
  background: var(--danger-dim) !important;
}

input.invalid:focus,
textarea.invalid:focus,
select.invalid:focus {
  border-color: var(--danger) !important;
  box-shadow: 0 0 0 3px var(--danger-dim) !important;
}

input.warning,
textarea.warning,
select.warning {
  border-color: var(--warning) !important;
  background: var(--warning-dim) !important;
}

/* ── Field Messages ────────────────────────– */
.field-message {
  font-size: 12px;
  margin-top: var(--space-1);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  line-height: 1.4;
}

.field-message.success {
  color: var(--success);
}

.field-message.error {
  color: var(--danger);
}

.field-message.warning {
  color: var(--warning);
}

.field-message.info {
  color: var(--accent);
}

/* ── Required Indicator ────────────────────– */
.field-required {
  color: var(--danger);
  font-weight: 600;
}

/* ── Form Group with Validation ────────── */
.form-group.has-error {
  position: relative;
}

.form-group.has-error input,
.form-group.has-error textarea,
.form-group.has-error select {
  border-color: var(--danger) !important;
}

.form-group.has-success input,
.form-group.has-success textarea,
.form-group.has-success select {
  border-color: var(--success) !important;
}

/* ── Character Counter ──────────────────── */
.char-counter {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-top: var(--space-1);
}

.char-counter.warning {
  color: var(--warning);
}

.char-counter.error {
  color: var(--danger);
}
```

### **Arquivo:** `assets/js/07-form-validation.js` (NOVO)

```javascript
/**
 * Sistema de Validação de Formulários
 * Feedback visual em tempo real
 */

class FormValidator {
  constructor() {
    this.validators = {};
    this.setupDefaultValidators();
  }

  /**
   * Validadores padrão
   */
  setupDefaultValidators() {
    this.validators = {
      email: (value) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value)
          ? { valid: true }
          : { error: 'Email inválido' };
      },

      url: (value) => {
        try {
          new URL(value);
          return { valid: true };
        } catch {
          return { error: 'URL inválida' };
        }
      },

      phone: (value) => {
        const pattern = /^[\d\s\-\+\(\)]{10,}$/;
        return pattern.test(value)
          ? { valid: true }
          : { error: 'Telefone inválido' };
      },

      number: (value) => {
        return !isNaN(value) && value !== ''
          ? { valid: true }
          : { error: 'Deve ser um número' };
      },

      currency: (value) => {
        const pattern = /^\d+(\.\d{2})?$/;
        return pattern.test(value)
          ? { valid: true }
          : { error: 'Formato de moeda inválido' };
      }
    };
  }

  /**
   * Validar campo individual
   */
  validateField(input, rules = {}) {
    const value = input.value.trim();
    const errors = [];
    const warnings = [];

    // Required
    if (rules.required && !value) {
      errors.push('Este campo é obrigatório');
    }

    // Min length
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Mínimo ${rules.minLength} caracteres`);
    }

    // Max length
    if (rules.maxLength && value.length > rules.maxLength) {
      warnings.push(`Máximo ${rules.maxLength} caracteres`);
    }

    // Pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push('Formato inválido');
    }

    // Custom validator
    if (rules.validator) {
      const result = rules.validator(value);
      if (result.error) errors.push(result.error);
      if (result.warning) warnings.push(result.warning);
    }

    // Built-in validators
    if (rules.type && this.validators[rules.type] && value) {
      const result = this.validators[rules.type](value);
      if (result.error) errors.push(result.error);
    }

    // Aplicar visual feedback
    this.applyFieldState(input, errors, warnings);

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Aplicar estado visual ao campo
   */
  applyFieldState(input, errors, warnings) {
    // Remover classes anteriores
    input.classList.remove('valid', 'invalid', 'warning');

    // Remover mensagens antigas
    const oldMessages = input.parentElement.querySelectorAll('.field-message');
    oldMessages.forEach(msg => msg.remove());

    // Aplicar nova classe
    if (errors.length > 0) {
      input.classList.add('invalid');
      errors.forEach(error => {
        this.showFieldMessage(input, error, 'error');
      });
    } else if (warnings.length > 0) {
      input.classList.add('warning');
      warnings.forEach(warning => {
        this.showFieldMessage(input, warning, 'warning');
      });
    } else if (input.value.trim()) {
      input.classList.add('valid');
      this.showFieldMessage(input, '✓ Válido', 'success');
    }
  }

  /**
   * Mostrar mensagem de validação
   */
  showFieldMessage(input, message, type) {
    const msgEl = document.createElement('div');
    msgEl.className = `field-message ${type}`;
    msgEl.textContent = message;
    input.parentElement.appendChild(msgEl);
  }

  /**
   * Validar todo formulário
   */
  validateForm(form, rules = {}) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    const results = {};

    inputs.forEach(input => {
      if (rules[input.name] || input.hasAttribute('required')) {
        const fieldRules = rules[input.name] || { required: input.hasAttribute('required') };
        const result = this.validateField(input, fieldRules);
        results[input.name] = result;
        if (!result.valid) isValid = false;
      }
    });

    return { valid: isValid, results };
  }

  /**
   * Setup validação em tempo real
   */
  setupRealTimeValidation(input, rules = {}) {
    // On blur
    input.addEventListener('blur', () => {
      this.validateField(input, rules);
    });

    // On input (debounced)
    let timeout;
    input.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (input.value.trim()) {
          this.validateField(input, rules);
        }
      }, 300);
    });

    // Character counter
    if (rules.maxLength) {
      this.setupCharCounter(input, rules.maxLength);
    }
  }

  /**
   * Contador de caracteres
   */
  setupCharCounter(input, maxLength) {
    let counterEl = input.parentElement.querySelector('.char-counter');
    if (!counterEl) {
      counterEl = document.createElement('div');
      counterEl.className = 'char-counter';
      input.parentElement.appendChild(counterEl);
    }

    input.addEventListener('input', () => {
      const current = input.value.length;
      const remaining = maxLength - current;
      const percent = (current / maxLength) * 100;

      counterEl.innerHTML = `
        <span>${current} / ${maxLength}</span>
        <span class="${remaining < 20 ? 'warning' : remaining < 0 ? 'error' : ''}">
          ${remaining > 0 ? `${remaining} restantes` : 'Limite excedido'}
        </span>
      `;
    });
  }

  /**
   * Clear validação de um campo
   */
  clearField(input) {
    input.classList.remove('valid', 'invalid', 'warning');
    const messages = input.parentElement.querySelectorAll('.field-message');
    messages.forEach(msg => msg.remove());
  }

  /**
   * Clear validação de todo formulário
   */
  clearForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => this.clearField(input));
  }
}

// Instância global
window.FormValidator = new FormValidator();

// Exemplo de uso:
/*
// Setup validação em tempo real para campo específico
FormValidator.setupRealTimeValidation(
  document.getElementById('email'),
  {
    required: true,
    type: 'email'
  }
);

// Validar formulário inteiro
const form = document.getElementById('myForm');
const validation = FormValidator.validateForm(form, {
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'phone' },
  message: { required: true, minLength: 10, maxLength: 500 }
});

if (!validation.valid) {
  console.log('Formulário inválido');
}
*/
```

### **Integração em `index.html`:**

```html
<!-- Adicionar no <head> -->
<link rel="stylesheet" href="assets/css/07-form-validation.css">

<!-- Adicionar no <body> após 06-error-modal.js -->
<script src="assets/js/07-form-validation.js"></script>
```

---

## 📋 CHECKLIST ETAPA 1

### Implementação:
- [ ] CSS Loader criado (`05-loader.css`)
- [ ] JS Loader implementado (`05-loader.js`)
- [ ] CSS Error Modal criado (`06-error-modal.css`)
- [ ] JS Error Modal implementado (`06-error-modal.js`)
- [ ] GA CSS completo (`modules/google-ads/styles/google-ads.css`)
- [ ] GA integrado ao menu (`index.html` + `app.js`)
- [ ] Validação visual CSS (`07-form-validation.css`)
- [ ] Validação visual JS (`07-form-validation.js`)
- [ ] Todos os scripts linkados em `index.html`

### Testes:
- [ ] Loading spinner aparece ao gerar estrutura
- [ ] Error modal mostra corretamente
- [ ] GA abre a partir do botão no menu
- [ ] Campos mostram validação visual
- [ ] Todos os componentes funcionam sem erros no console

---

## 🚀 PRÓXIMO PASSO

Após implementar ETAPA 1, vamos para **ETAPA 2** que inclui:
- Empty States
- Tooltips
- Animações avançadas
- Keyboard Navigation
- Dark Mode Toggle
- Integração final e testes completos

**Quer que eu crie o documento da ETAPA 2?** Ou quer validar ETAPA 1 primeiro?

---

**FIM DO DOCUMENTO ETAPA 1**
