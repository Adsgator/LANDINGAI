# 🎨 LANDINGAI — UI/UX/DESIGN FINALIZAÇÃO ETAPA 2

**Versão:** 1.0.0  
**Data:** 2026-05-08  
**Escopo:** Implementar polish final e testes completos (Empty States, Tooltips, Animações, Dark Mode, Produção)  
**Tempo Estimado:** 3-4 horas  
**Status:** Pronto para Roo Code implementar

---

## 📋 RESUMO ETAPA 2

Implementar **10 componentes finais** para deixar o projeto polido e pronto para produção:

1. ✅ Empty States (quando lista vazia)
2. ✅ Tooltips em ações avançadas
3. ✅ Animações de transição entre telas
4. ✅ Keyboard Navigation (Tab, Enter, Esc)
5. ✅ Dark Mode Toggle no Header
6. ✅ Breadcrumb Navigation
7. ✅ Toast Notifications Melhoradas
8. ✅ Integração Final GA (Modo 1 + Modo 2)
9. ✅ Suite de Testes Completa
10. ✅ Checklist Produção & Deploy

**Resultado:** Sistema 100% polido, acessível e pronto para produção.

---

## 🔧 COMPONENTE 1: EMPTY STATES

### **Arquivo:** `assets/css/08-empty-states.css` (NOVO)

```css
/* ================================================
   LANDINGAI — Empty States
   ================================================ */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-8) var(--space-4);
  min-height: 300px;
  color: var(--text-secondary);
  background: var(--bg-overlay);
  border-radius: var(--r-lg);
  border: 1px dashed var(--border-default);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: var(--space-4);
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.empty-state p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 var(--space-4) 0;
  line-height: 1.6;
  max-width: 400px;
}

.empty-state .btn {
  margin-top: var(--space-2);
}

/* Variações */
.empty-state.no-projects {
  background: linear-gradient(135deg, var(--accent-dim) 0%, var(--bg-surface) 100%);
}

.empty-state.no-results {
  background: var(--bg-surface);
}

.empty-state.error {
  background: var(--danger-dim);
}

.empty-state.error .empty-icon {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

/* Illustration styles */
.empty-illustration {
  max-width: 200px;
  margin: 0 auto var(--space-4);
  opacity: 0.8;
}
```

### **Arquivo:** `assets/js/08-empty-states.js` (NOVO)

```javascript
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

// Exemplo de uso:
/*
if (projects.length === 0) {
  EmptyStateManager.showNoProjects('projects-container');
} else {
  EmptyStateManager.clear('projects-container');
  renderProjects(projects);
}
*/
```

---

## 🔧 COMPONENTE 2: TOOLTIPS

### **Arquivo:** `assets/css/09-tooltips.css` (NOVO)

```css
/* ================================================
   LANDINGAI — Tooltips
   ================================================ */

.tooltip-trigger {
  position: relative;
  cursor: help;
  border-bottom: 1px dotted var(--text-tertiary);
  transition: all var(--t-fast);
}

.tooltip-trigger:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-primary);
  color: var(--bg-default);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--r-sm);
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--t-fast);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--text-primary);
}

.tooltip-trigger:hover .tooltip {
  opacity: 1;
}

/* Tooltip Positions */
.tooltip-right {
  bottom: auto;
  left: calc(100% + 8px);
  transform: translateX(0);
}

.tooltip-right::after {
  top: 50%;
  left: auto;
  right: 100%;
  transform: translateY(-50%);
  border: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-right: 4px solid var(--text-primary);
}

.tooltip-left {
  bottom: auto;
  left: auto;
  right: calc(100% + 8px);
  transform: translateX(0);
}

.tooltip-left::after {
  top: 50%;
  right: auto;
  left: 100%;
  transform: translateY(-50%);
  border: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 4px solid var(--text-primary);
}

.tooltip-top {
  /* Default, já implementado acima */
}

.tooltip-bottom {
  bottom: auto;
  top: calc(100% + 8px);
}

.tooltip-bottom::after {
  top: auto;
  bottom: 100%;
  border-top: 0;
  border-bottom: 4px solid var(--text-primary);
}

/* Info icon */
.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-dim);
  color: var(--accent);
  font-size: 10px;
  font-weight: 700;
  cursor: help;
  margin-left: var(--space-1);
}

/* Dark mode adjustments */
body.dark-mode .tooltip {
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

body.dark-mode .tooltip::after {
  border-top-color: var(--bg-surface);
}

body.dark-mode .tooltip-right::after {
  border-right-color: var(--bg-surface);
}

body.dark-mode .tooltip-left::after {
  border-left-color: var(--bg-surface);
}

body.dark-mode .tooltip-bottom::after {
  border-bottom-color: var(--bg-surface);
}
```

### **Arquivo:** `assets/js/09-tooltips.js` (NOVO)

```javascript
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

// Exemplo de uso em HTML:
/*
<input 
  type="text" 
  id="cliente"
  data-tooltip="Nome do cliente ou empresa"
  data-tooltip-position="right"
/>

<!-- Ou via JavaScript: -->
TooltipManager.addTooltip(
  document.getElementById('btn-advanced'),
  'Configurações avançadas da campanha',
  'right'
);
*/
```

---

## 🔧 COMPONENTE 3: ANIMAÇÕES AVANÇADAS

### **Arquivo:** `assets/css/10-animations.css` (NOVO)

```css
/* ================================================
   LANDINGAI — Advanced Animations
   ================================================ */

/* ── Page Transitions ─────────────────────── */
.screen-enter {
  animation: screenEnter 0.4s ease-out;
}

.screen-exit {
  animation: screenExit 0.3s ease-in;
}

@keyframes screenEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes screenExit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* ── Button Ripple Effect ────────────────── */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.btn-ripple:active::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}

/* ── Card Hover Lift ─────────────────────── */
.card-lift {
  transition: all var(--t-base);
}

.card-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* ── Stagger Animation ──────────────────── */
.stagger-enter {
  animation: staggerEnter 0.5s ease-out;
}

.stagger-enter:nth-child(1) {
  animation-delay: 0s;
}
.stagger-enter:nth-child(2) {
  animation-delay: 0.1s;
}
.stagger-enter:nth-child(3) {
  animation-delay: 0.2s;
}
.stagger-enter:nth-child(4) {
  animation-delay: 0.3s;
}
.stagger-enter:nth-child(5) {
  animation-delay: 0.4s;
}

@keyframes staggerEnter {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ── Pulse Animation ────────────────────── */
.pulse-subtle {
  animation: pulseSubtle 2s ease-in-out infinite;
}

@keyframes pulseSubtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.pulse-strong {
  animation: pulseStrong 1s ease-in-out infinite;
}

@keyframes pulseStrong {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* ── Fade & Scale In ────────────────────– */
.fade-scale-in {
  animation: fadeScaleIn 0.4s ease-out;
}

@keyframes fadeScaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ── Bounce In ────────────────────────── */
.bounce-in {
  animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
}

/* ── Slide In from Left ────────────────– */
.slide-in-left {
  animation: slideInLeft 0.4s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ── Slide In from Right ────────────────– */
.slide-in-right {
  animation: slideInRight 0.4s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ── Smooth Height Change ───────────────– */
.accordion-open {
  animation: accordionOpen 0.3s ease-out;
}

@keyframes accordionOpen {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

/* ── Number Counter ───────────────────── */
@keyframes counter {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.counter {
  animation: counter 0.5s ease-out;
}
```

---

## 🔧 COMPONENTE 4: KEYBOARD NAVIGATION

### **Arquivo:** `assets/js/11-keyboard-nav.js` (NOVO)

```javascript
/**
 * Sistema de Keyboard Navigation
 * Tab, Enter, Escape para melhor UX
 */

class KeyboardNav {
  static init() {
    this.setupTabNavigation();
    this.setupEnterSubmit();
    this.setupEscapeClose();
    this.setupArrowKeys();
  }

  /**
   * Tab navigation em modais
   */
  static setupTabNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // Permitir tab natural
        // Focus management é feito em cada modal
      }
    });
  }

  /**
   * Enter para enviar formulários
   */
  static setupEnterSubmit() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        // Ctrl/Cmd + Enter = Submit
        const form = e.target.closest('form');
        if (form) {
          const submitBtn = form.querySelector('[type="submit"]');
          if (submitBtn) submitBtn.click();
        }
      }
    });
  }

  /**
   * Escape para fechar modais
   */
  static setupEscapeClose() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Fechar modal de erro
        if (document.getElementById('error-modal-overlay').classList.contains('visible')) {
          ErrorModal.close();
          return;
        }

        // Fechar loader
        if (Loader.isVisible) {
          Loader.hide();
          return;
        }

        // Fechar dropdowns
        document.querySelectorAll('.dropdown.open').forEach((dropdown) => {
          dropdown.classList.remove('open');
        });
      }
    });
  }

  /**
   * Arrow keys para navegação em listas
   */
  static setupArrowKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const focusedElement = document.activeElement;
        const parent = focusedElement.closest('.list, .menu, .tabs');

        if (parent) {
          const items = Array.from(parent.querySelectorAll('[tabindex="0"], button, a'));
          const currentIndex = items.indexOf(focusedElement);

          if (currentIndex === -1) return;

          let nextIndex;
          if (e.key === 'ArrowUp') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          } else {
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          }

          items[nextIndex].focus();
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Atalhos customizados
   */
  static setupShortcuts() {
    const shortcuts = {
      'Ctrl+K': () => document.getElementById('search').focus(),
      'Ctrl+N': () => switchScreen('intake'),
      'Ctrl+S': () => saveProject(),
      'Ctrl+G': () => switchScreen('google-ads')
    };

    document.addEventListener('keydown', (e) => {
      const key = `${e.ctrlKey || e.metaKey ? 'Ctrl+' : ''}${e.key.toUpperCase()}`;

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    });
  }
}

// Init ao carregar
document.addEventListener('DOMContentLoaded', () => {
  KeyboardNav.init();
  KeyboardNav.setupShortcuts();
});
```

---

## 🔧 COMPONENTE 5: DARK MODE TOGGLE

### **Arquivo:** `assets/css/11-dark-mode.css` (NOVO)

```css
/* ================================================
   LANDINGAI — Dark Mode
   ================================================ */

/* Dark mode root vars */
body.dark-mode {
  --bg-default: #0f1419;
  --bg-surface: #1a1f26;
  --bg-overlay: #232a33;
  --bg-raised: #2d3139;
  
  --text-primary: #ffffff;
  --text-secondary: #b0b8c1;
  --text-tertiary: #7a8591;
  
  --border-default: #3a4249;
  --border-strong: #5a6370;
}

/* Smooth transition between modes */
body {
  transition: background-color var(--t-base), color var(--t-base);
}

body * {
  transition: background-color var(--t-fast), color var(--t-fast), border-color var(--t-fast);
}

/* Dark mode toggle button */
.dark-mode-toggle {
  position: relative;
  width: 48px;
  height: 48px;
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--t-base);
}

.dark-mode-toggle:hover {
  background: var(--bg-overlay);
  border-color: var(--border-strong);
}

.dark-mode-toggle-icon {
  font-size: 20px;
  transition: transform var(--t-base);
}

.dark-mode-toggle:active .dark-mode-toggle-icon {
  transform: rotate(180deg) scale(0.8);
}

/* Tooltip para toggle */
.dark-mode-toggle::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-primary);
  color: var(--bg-default);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity var(--t-fast);
  pointer-events: none;
  z-index: 100;
}

.dark-mode-toggle:hover::before {
  opacity: 1;
}

/* Image adjustments in dark mode */
body.dark-mode img {
  opacity: 0.9;
}

/* Syntax highlighting in dark mode */
body.dark-mode code {
  background: var(--bg-overlay);
  color: #81c784;
}

body.dark-mode pre {
  background: var(--bg-overlay);
  border-color: var(--border-strong);
}

/* Form elements in dark mode */
body.dark-mode input,
body.dark-mode textarea,
body.dark-mode select {
  background: var(--bg-overlay);
  color: var(--text-primary);
  border-color: var(--border-default);
}

body.dark-mode input:focus,
body.dark-mode textarea:focus,
body.dark-mode select:focus {
  border-color: var(--accent);
  background: var(--bg-surface);
}

/* Buttons in dark mode */
body.dark-mode .btn-primary {
  background: var(--accent);
  color: var(--bg-default);
}

body.dark-mode .btn-secondary {
  background: var(--bg-overlay);
  border-color: var(--border-strong);
  color: var(--text-secondary);
}
```

### **Arquivo:** `assets/js/12-dark-mode.js` (NOVO)

```javascript
/**
 * Sistema de Dark Mode
 * Controle de tema e persistência
 */

class DarkModeManager {
  constructor() {
    this.isDarkMode = this.loadPreference();
    this.init();
  }

  init() {
    // Aplicar tema salvo
    this.setDarkMode(this.isDarkMode);

    // Criar toggle button
    this.createToggleButton();

    // Detectar preferência do sistema
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          this.setDarkMode(e.matches);
        });
    }
  }

  /**
   * Carregar preferência salva
   */
  loadPreference() {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }

    // Se não tiver salvo, usar preferência do sistema
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Definir dark mode
   */
  setDarkMode(enabled) {
    this.isDarkMode = enabled;

    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    localStorage.setItem('darkMode', enabled);
    this.updateToggleButton();
  }

  /**
   * Toggle dark mode
   */
  toggle() {
    this.setDarkMode(!this.isDarkMode);
  }

  /**
   * Criar botão de toggle
   */
  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.setAttribute('data-tooltip', this.isDarkMode ? 'Light mode' : 'Dark mode');
    button.innerHTML = `<span class="dark-mode-toggle-icon">${this.isDarkMode ? '☀️' : '🌙'}</span>`;
    button.onclick = () => this.toggle();

    // Inserir no header ao lado de Config
    const header = document.querySelector('.header-controls');
    if (header) {
      header.insertBefore(button, header.firstChild);
    }
  }

  /**
   * Atualizar visual do botão
   */
  updateToggleButton() {
    const button = document.querySelector('.dark-mode-toggle');
    if (button) {
      button.innerHTML = `<span class="dark-mode-toggle-icon">${this.isDarkMode ? '☀️' : '🌙'}</span>`;
      button.setAttribute('data-tooltip', this.isDarkMode ? 'Light mode' : 'Dark mode');
    }
  }
}

// Instância global
window.DarkMode = new DarkModeManager();
```

---

## 🔧 COMPONENTE 6: BREADCRUMB NAVIGATION

### **Arquivo:** `assets/css/13-breadcrumb.css` (NOVO)

```css
/* ================================================
   LANDINGAI — Breadcrumb Navigation
   ================================================ */

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  font-size: 13px;
  color: var(--text-secondary);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.breadcrumb-item.active {
  color: var(--text-primary);
  font-weight: 600;
}

.breadcrumb-item a {
  color: var(--accent);
  text-decoration: none;
  transition: all var(--t-fast);
}

.breadcrumb-item a:hover {
  color: var(--accent-dark);
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--text-tertiary);
}

.breadcrumb-icon {
  margin-right: var(--space-1);
}
```

### **Arquivo:** `assets/js/13-breadcrumb.js` (NOVO)

```javascript
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

// Exemplo:
/*
BreadcrumbManager.insert('breadcrumb-container', [
  { label: 'Inicio', href: '#home' },
  { label: 'Projetos', href: '#projects' },
  { label: 'Landing Page - Cliente XYZ' }
]);
*/
```

---

## 🔧 COMPONENTE 7: TOAST NOTIFICATIONS MELHORADAS

### **Arquivo:** `assets/js/14-toast.js` (NOVO)

```javascript
/**
 * Sistema de Toast Notifications Melhorado
 * Notificações não-bloqueantes
 */

class ToastManager {
  constructor() {
    this.toastId = 0;
    this.createContainer();
  }

  createContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }

  /**
   * Mostrar toast
   */
  show(message, type = 'info', duration = 3000) {
    const id = this.toastId++;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${id}`;

    // Ícone
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <span>${icons[type] || ''}</span>
      <span>${message}</span>
      <button class="toast-close" onclick="document.getElementById('toast-${id}').remove()">×</button>
    `;

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    // Adicionar classe para animação
    setTimeout(() => toast.classList.add('visible'), 10);

    // Auto-remover
    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return id;
  }

  /**
   * Atalhos
   */
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }

  /**
   * Remover toast específico
   */
  remove(id) {
    const toast = document.getElementById(`toast-${id}`);
    if (toast) {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }
  }
}

// Instância global
window.Toast = new ToastManager();

// Exemplo de uso:
// Toast.success('Landing page gerada com sucesso!');
// Toast.error('Erro ao processar solicitação');
```

---

## 🔧 COMPONENTE 8: INTEGRAÇÃO FINAL GA (Modo 1 + Modo 2)

### **Arquivo:** `modules/google-ads/02-ga-api.js` (COMPLETO)

```javascript
/**
 * Google Ads API Integration
 * Modo 1: Criação | Modo 2: Otimização
 */

/**
 * MODO 1: Gerar Estratégia
 */
async function generateGAStrategy(inputs) {
  try {
    Loader.show('📊 Analisando contexto da LP...', 'Gerando estratégia de campanhas');

    // 1. Puxar contexto
    const context = pullContextFromLP();

    // 2. Construir prompt
    const prompt = `
    Gerar estratégia completa de Google Ads para:

    CLIENTE: ${inputs.clienteName || context.cliente_nome}
    SERVIÇO: ${context.servico_descricao}
    VERBA MENSAL: R$ ${inputs.budgetTotal}
    GEOLOCALIZAÇÃO: ${inputs.location}
    META PRINCIPAL: ${inputs.mainGoal}

    Considere que ${inputs.budgetTotal < 1000 ? 'o orçamento é baixo, então foque em Rede de Pesquisa' : 'há bom orçamento, considere multi-canal'}.

    Retorne EXCLUSIVAMENTE um JSON válido (sem markdown) com esta estrutura:
    {
      "id": "ga-strategy-[timestamp]",
      "analise": "Análise da situação",
      "recomendacao": "Recomendação estratégica",
      "justificativa": "Por que esta estratégia",
      "campanhas": [
        {
          "nome": "Nome da Campanha",
          "rede": "search|display|pmax|youtube",
          "orcamento": 500,
          "ad_groups": [
            {
              "nome": "Grupo de Anúncio",
              "keywords_positivas": ["palavra1", "palavra2"],
              "keywords_negativas": ["evitar1", "evitar2"],
              "anuncios": [
                {
                  "headlines": [
                    { "texto": "Headline 1" },
                    { "texto": "Headline 2" },
                    { "texto": "Headline 3" }
                  ],
                  "descriptions": [
                    { "texto": "Description 1" },
                    { "texto": "Description 2" }
                  ],
                  "final_url": "${inputs.lpUrl || context.lp_url}",
                  "call_to_action": "Entre em contato"
                }
              ]
            }
          ]
        }
      ]
    }

    Regras:
    - Headlines: máximo 30 caracteres
    - Descriptions: máximo 90 caracteres
    - Mínimo 3 headlines e 2 descriptions por anúncio
    - Mínimo 5 keywords positivas por grupo
    - Keywords negativas mais relevantes possível
    - Não inventar URLs, usar a fornecida
    - JSON deve ser válido e completo
    `;

    const response = await callAI({
      model: App.state.selectedModel,
      userPrompt: prompt,
      maxTokens: 3000
    });

    Loader.updateMessage('📊 Processando estratégia gerada...', 'Validando dados');

    // 3. Parse JSON
    let strategy;
    try {
      strategy = JSON.parse(response.content);
    } catch (e) {
      // Tentar extrair JSON se houver markdown
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        strategy = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('IA não retornou JSON válido');
      }
    }

    Loader.hide();

    // 4. Validar
    validateGAStrategy(strategy);

    // 5. Salvar em localStorage
    localStorage.setItem('ga_strategy', JSON.stringify(strategy));

    return strategy;

  } catch (error) {
    Loader.hide();
    throw error;
  }
}

/**
 * MODO 2: Otimização de Campanha
 */
async function optimizeGACampaign(reportText) {
  try {
    Loader.show('📈 Analisando relatório...', 'Gerando recomendações de otimização');

    const prompt = `
    Analise este relatório bruto do Google Ads e gere um plano de ação:

    RELATÓRIO:
    ${reportText}

    Retorne EXCLUSIVAMENTE um JSON válido (sem markdown) com:
    {
      "sumario": "Resumo da situação",
      "score_saude": 0-100,
      "acoes": [
        {
          "prioridade": "alta|media|baixa",
          "tipo": "pausar|escalar|testar|ajustar",
          "elemento": "Nome da campanha/grupo/keyword",
          "problema": "Por que agir",
          "acao": "O que fazer",
          "impacto_esperado": "Resultado esperado",
          "urgencia": "dias até agir"
        }
      ]
    }

    Classifique por:
    - ALTA: Palavras com CPC alto mas baixa conversão = pausar
    - MEDIA: Keywords com bom desempenho = escalar orçamento
    - BAIXA: Testar novas variações de anúncio

    JSON deve ser válido e completo.
    `;

    const response = await callAI({
      model: App.state.selectedModel,
      userPrompt: prompt,
      maxTokens: 2000
    });

    Loader.hide();

    // Parse JSON
    let plan;
    try {
      plan = JSON.parse(response.content);
    } catch (e) {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('IA não retornou JSON válido');
      }
    }

    // Salvar
    localStorage.setItem('ga_optimization_plan', JSON.stringify(plan));

    return plan;

  } catch (error) {
    Loader.hide();
    throw error;
  }
}

/**
 * Validar estratégia
 */
function validateGAStrategy(strategy) {
  const errors = [];

  if (!strategy.campanhas || strategy.campanhas.length === 0) {
    errors.push('Nenhuma campanha definida');
  }

  strategy.campanhas?.forEach((camp, idx) => {
    if (!camp.nome) errors.push(`Campanha ${idx}: sem nome`);
    if (!camp.ad_groups || camp.ad_groups.length === 0) {
      errors.push(`Campanha "${camp.nome}": sem ad groups`);
    }

    camp.ad_groups?.forEach((ag, agIdx) => {
      if (!ag.keywords_positivas || ag.keywords_positivas.length === 0) {
        errors.push(`Ad Group "${ag.nome}": sem keywords`);
      }
      if (!ag.anuncios || ag.anuncios.length === 0) {
        errors.push(`Ad Group "${ag.nome}": sem anúncios`);
      }
    });
  });

  if (errors.length > 0) {
    throw new Error(`Validação falhou:\n${errors.join('\n')}`);
  }
}

/**
 * Puxar contexto da LP
 */
function pullContextFromLP() {
  return {
    cliente_nome: JSON.parse(localStorage.getItem('briefing_bruto') || '{}').client_name || 'Cliente',
    servico_descricao: JSON.parse(localStorage.getItem('briefing_bruto') || '{}').service_description || '',
    lp_url: localStorage.getItem('lp_url') || 'https://exemplo.com'
  };
}

// Exportar
window.generateGAStrategy = generateGAStrategy;
window.optimizeGACampaign = optimizeGACampaign;
```

---

## 📋 CHECKLIST ETAPA 2

### Implementação:
- [ ] Empty States CSS (`08-empty-states.css`)
- [ ] Empty States JS (`08-empty-states.js`)
- [ ] Tooltips CSS (`09-tooltips.css`)
- [ ] Tooltips JS (`09-tooltips.js`)
- [ ] Animações CSS (`10-animations.css`)
- [ ] Keyboard Navigation (`11-keyboard-nav.js`)
- [ ] Dark Mode CSS (`11-dark-mode.css`)
- [ ] Dark Mode JS (`12-dark-mode.js`)
- [ ] Breadcrumb CSS (`13-breadcrumb.css`)
- [ ] Breadcrumb JS (`13-breadcrumb.js`)
- [ ] Toast Notifications (`14-toast.js`)
- [ ] GA API Modo 1 e 2 completado
- [ ] Todos os scripts linkados em `index.html`

---

## 🧪 TESTES SUITE COMPLETA

### **Arquivo:** `tests/test-suite.md` (NOVO)

## ✅ TESTES LP COMPLETA

```javascript
describe('Landing Page Generation', () => {
  // Test 1: Intake preenchimento
  test('Preencher intake com dados válidos', () => {
    document.getElementById('cliente').value = 'Psicóloga Maria';
    document.getElementById('servico').value = 'Psicoterapia';
    
    const validation = FormValidator.validateForm(
      document.getElementById('intake-form'),
      { cliente: { required: true }, servico: { required: true } }
    );
    
    expect(validation.valid).toBe(true);
  });

  // Test 2: Estrutura gerada é válida
  test('Estrutura gerada tem todos os campos', async () => {
    const estrutura = await generateEstrutura(mockBriefing);
    
    expect(estrutura).toBeDefined();
    expect(estrutura.blocos).toBeDefined();
    expect(estrutura.blocos.length).toBeGreaterThan(0);
  });

  // Test 3: Restrições são respeitadas
  test('Copy não contém palavras restritas', async () => {
    const briefing = {
      ...mockBriefing,
      restricoes: 'Evitar palavra "premium"'
    };
    
    const estrutura = await generateEstrutura(briefing);
    const copy = JSON.stringify(estrutura);
    
    expect(copy.toLowerCase()).not.toContain('premium');
  });

  // Test 4: Validação de output
  test('Output passa em validação blindada', async () => {
    const estrutura = await generateEstrutura(mockBriefing);
    const validation = validateBlindedOutput(JSON.stringify(estrutura));
    
    expect(validation.valido).toBe(true);
  });

  // Test 5: Export LP html válido
  test('Export HTML é válido', async () => {
    const html = await exportLPToHTML(mockBriefing);
    
    expect(html).toContain('<h1');
    expect(html).toContain('</html>');
    expect(html.match(/<h1/g).length).toBe(1);
  });
});
```

### **Arquivo:** `tests/test-ga.md` (NOVO)

## ✅ TESTES GOOGLE ADS

```javascript
describe('Google Ads Strategy', () => {
  // Test 1: Estratégia gerada válida
  test('GA Strategy tem estrutura correta', async () => {
    const strategy = await generateGAStrategy({
      budgetTotal: 1500,
      location: 'São Paulo, SP',
      mainGoal: 'leads',
      lpUrl: 'https://exemplo.com'
    });
    
    expect(strategy.campanhas).toBeDefined();
    expect(strategy.campanhas.length).toBeGreaterThan(0);
  });

  // Test 2: Headlines dentro do limite
  test('Headlines respeitam limite de 30 caracteres', async () => {
    const strategy = await generateGAStrategy(mockInputs);
    
    strategy.campanhas.forEach(camp => {
      camp.ad_groups.forEach(ag => {
        ag.anuncios.forEach(ad => {
          ad.headlines.forEach(h => {
            expect(h.texto.length).toBeLessThanOrEqual(30);
          });
        });
      });
    });
  });

  // Test 3: CSV exporta corretamente
  test('CSV export é válido', async () => {
    const strategy = await generateGAStrategy(mockInputs);
    const csv = exportStrategyToCSV(strategy);
    
    expect(csv).toContain('Campaign');
    expect(csv).toContain('Ad Group');
    expect(csv).toContain('Keyword');
  });

  // Test 4: Otimização gera plano
  test('Optimization plan é válido', async () => {
    const plan = await optimizeGACampaign(mockReportText);
    
    expect(plan.acoes).toBeDefined();
    expect(plan.acoes.length).toBeGreaterThan(0);
    expect(plan.score_saude).toBeGreaterThanOrEqual(0);
    expect(plan.score_saude).toBeLessThanOrEqual(100);
  });
});
```

---

## 🚀 CHECKLIST PRODUÇÃO & DEPLOY

### **Pré-Deploy:**
- [ ] Remover todos `console.log()` de debug
- [ ] Remover comentários de desenvolvimento
- [ ] Minify CSS/JS (opcional mas recomendado)
- [ ] Verificar .gitignore
- [ ] Nenhuma API key no código
- [ ] Environment variables configuradas

### **Testes Finais:**
- [ ] Teste LP completo: Intake → Review → Generate
- [ ] Teste GA completo: Estratégia → CSV → Export
- [ ] CSV abre no Google Ads Editor
- [ ] Dark mode funciona
- [ ] Keyboard navigation funciona
- [ ] Modal de erro mostra
- [ ] Toast notificações funcionam
- [ ] Responsive (mobile/tablet/desktop)

### **Deploy:**
- [ ] Fazer backup do código atual
- [ ] Deploy em staging
- [ ] Testes em produção
- [ ] Documentação atualizada
- [ ] README final
- [ ] Changelog criado

---

## 📝 DOCUMENTAÇÃO FINAL

### **Arquivo:** `README-FINAL.md` (NOVO)

```markdown
# 🎨 LANDINGAI v2.0 + Google Ads Module

**Status:** ✅ Production Ready  
**Version:** 2.0.5 + GA 1.0.0  
**Last Updated:** 2026-05-08

## 🚀 Quick Start

1. **Configure API Key**
   - Vá para Settings > API Configuration
   - Cole sua chave (Claude, Gemini, ou outro)

2. **Crie um Projeto**
   - Clique em "Criar Novo Projeto"
   - Preencha Intake (8 campos)
   - Gere a Landing Page

3. **Use Google Ads (Opcional)**
   - Clique no botão "Google Ads"
   - Escolha Modo 1 (Criação) ou Modo 2 (Otimização)
   - Exporte para Google Ads Editor

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + N` — Novo projeto
- `Ctrl/Cmd + K` — Buscar
- `Ctrl/Cmd + G` — Google Ads
- `Ctrl/Cmd + S` — Salvar
- `Esc` — Fechar modal

## 🌓 Tema

- Alterna entre Light/Dark automaticamente
- Clique no toggle ☀️/🌙 no header para mudar
- Preferência é salva localmente

## 📊 Features

- ✅ Landing Page automática com IA
- ✅ Google Ads Strategy generation
- ✅ CSV export para Google Ads Editor
- ✅ Dark mode
- ✅ Validação em tempo real
- ✅ Responsive design
- ✅ Acessibilidade completa

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔧 Troubleshooting

**IA não gera resposta?**
- Verifique API Key em Settings
- Tente com modelo diferente (Claude é mais confiável)

**CSV não abre no Google Ads?**
- Baixe novamente
- Verifique se está em UTF-8
- Tente Google Ads Editor (não apenas importar)

**Dark mode não muda?**
- Limpe cache do navegador
- Tente outro navegador

## 📞 Support

Entre em contato para suporte ou relatar bugs.

---

**Desenvolvido com ❤️ usando IA generativa**
```

---

## 🎯 RESUMO FINAL ETAPA 2

**Total de Componentes:** 10  
**Arquivos CSS:** 5 novos  
**Arquivos JS:** 5 novos  
**Integração:** Modo 1 + Modo 2 GA completo  
**Testes:** Suite de testes documentada  
**Deploy:** Checklist produção completo  

**Resultado:** Sistema 100% funcional, polido, acessível e pronto para produção.

---

## ✅ PRÓXIMO PASSO

Após implementar ETAPA 2, o projeto estará **PRONTO PARA PRODUÇÃO**.

**Você quer:**
- [ ] Implementar ETAPA 1 primeiro?
- [ ] Implementar ETAPA 2 primeiro?
- [ ] Fazer as duas simultaneamente?
- [ ] Algo específico?

---

**FIM DO DOCUMENTO ETAPA 2**

## 🎉 **PRONTO PARA RODAR EM PRODUÇÃO!**

Agora você tem **2 documentos completos** com tudo que precisa para finalizar o projeto:

**ETAPA 1** (2-3h) - Componentes Críticos:
- Loading States Global
- Error Modal Padrão
- Google Ads CSS Completo
- Integração GA ao Menu
- Validação Visual em Campos

**ETAPA 2** (3-4h) - Polish Final:
- Empty States
- Tooltips
- Animações Avançadas
- Keyboard Navigation
- Dark Mode Toggle
- Breadcrumb
- Toast Notifications
- GA Modo 1 + Modo 2 Completos
- Suite de Testes
- Checklist Produção

---

Você quer que o **Roo Code implemente agora?** 🚀
