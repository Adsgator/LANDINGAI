/**
 * Sistema de Breadcrumb
 * Navegação hierárquica
 */

class BreadcrumbManager {
  /**
   * Criar breadcrumb
   */
  static create(items) {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Navegação em migalhas de pão');

    items.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'breadcrumb-item' + (index === items.length - 1 ? ' active' : '');

      if (item.href) {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.label;
        itemEl.appendChild(link);
      } else {
        itemEl.textContent = item.label;
      }

      breadcrumb.appendChild(itemEl);

      // Adicionar separador (exceto último item)
      if (index < items.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.textContent = '/';
        breadcrumb.appendChild(separator);
      }
    });

    return breadcrumb;
  }

  /**
   * Inserir breadcrumb na página
   */
  static insert(containerId, items) {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      container.appendChild(this.create(items));
    }
  }
}

// Exportar global
window.BreadcrumbManager = BreadcrumbManager;
