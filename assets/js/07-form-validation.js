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

    const updateCounter = () => {
      const current = input.value.length;
      const remaining = maxLength - current;
      
      counterEl.innerHTML = `
        <span>${current} / ${maxLength}</span>
        <span class="${remaining < 20 ? 'warning' : remaining < 0 ? 'error' : ''}">
          ${remaining >= 0 ? `${remaining} restantes` : 'Limite excedido'}
        </span>
      `;
    };

    input.addEventListener('input', updateCounter);
    updateCounter();
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
