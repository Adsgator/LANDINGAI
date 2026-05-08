/**
 * Sistema de Tooltips
 * Dicas contextuais em ações e campos
 */

class TooltipManager {
  /**
   * Adicionar tooltip a um elemento
   */
  static addTooltip(element, text, position = 'top') {
    if (!element) return;

    // Criar elemento tooltip
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position}`;
    tooltip.textContent = text;

    element.classList.add('tooltip-trigger');
    element.appendChild(tooltip);

    // Prevent hiding on click
    element.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Adicionar tooltip com info icon
   */
  static addInfoTooltip(element, text) {
    const icon = document.createElement('span');
    icon.className = 'info-icon';
    icon.textContent = '?';
    icon.title = text;

    const wrapper = document.createElement('span');
    wrapper.className = 'tooltip-trigger';
    wrapper.appendChild(icon);

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;

    wrapper.appendChild(tooltip);

    return wrapper;
  }

  /**
   * Remover tooltip
   */
  static removeTooltip(element) {
    const tooltip = element.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
      element.classList.remove('tooltip-trigger');
    }
  }

  /**
   * Auto-setup tooltips com data-tooltip
   */
  static setupAutoTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach((element) => {
      const text = element.getAttribute('data-tooltip');
      const position = element.getAttribute('data-tooltip-position') || 'top';
      this.addTooltip(element, text, position);
    });
  }

  /**
   * Tooltips para campos de formulário
   */
  static addFieldTooltips() {
    const tooltips = {
      '#cliente': 'Nome do cliente ou empresa',
      '#servico': 'Tipo de serviço prestado',
      '#persona': 'Quem é seu cliente ideal?',
      '#restricoes': 'O que evitar na página',
      '#budget-total': 'Orçamento mensal para campanhas Google Ads',
      '#location': 'Onde seus clientes estão?',
      '#main-goal': 'Objetivo principal da campanha'
    };

    Object.entries(tooltips).forEach(([selector, text]) => {
      const element = document.querySelector(selector);
      if (element && element.parentElement) {
        const wrapper = this.addInfoTooltip(element, text);
        element.parentElement.insertBefore(wrapper, element.nextSibling);
      }
    });
  }
}

// Setup automático ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  TooltipManager.setupAutoTooltips();
  TooltipManager.addFieldTooltips();
});

// Exportar para uso global
window.TooltipManager = TooltipManager;
