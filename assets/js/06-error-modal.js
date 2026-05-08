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

    this.keydownHandler = (e) => {
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
    };

    document.addEventListener('keydown', this.keydownHandler);
  }

  releaseFocus() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
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
