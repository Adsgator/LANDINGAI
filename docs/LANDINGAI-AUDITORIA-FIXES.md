# LANDINGAI — Documento de Implementação de Fixes
**Gerado por:** Auditoria Final de UI/UX/Design  
**Data:** 2026-05-08  
**Para:** Roo Code — implementar exatamente como descrito, sem criar arquivos novos

---

> **REGRA GERAL:** Você só vai **editar arquivos existentes**. Nenhum arquivo novo deve ser criado. Cada fix indica o arquivo exato, a localização exata e o código exato a inserir ou substituir.

---

## PRIORIDADE 1 — Bugs Críticos (implementar primeiro)

---

### FIX-01 · `assets/js/03-ui.js` — openRenameModal() quebrado

**Problema:** A função `openRenameModal()` chama `input?.focus()` mas a variável `input` não está definida nesse escopo. O modal abre mas o campo nunca recebe foco.

**Localizar:** A função `openRenameModal()` em `assets/js/03-ui.js`. Ela deve estar assim (ou similar):

```javascript
openRenameModal() {
  setTimeout(() => input?.focus(), 100);
},
```

**Substituir por:**

```javascript
openRenameModal() {
  const input = document.getElementById('rename-input');
  if (this.P) input.value = this.P.name || '';
  this.openModal('modal-rename');
  setTimeout(() => input?.focus(), 100);
},
```

---

### FIX-02 · `assets/js/04-handlers.js` — Botão Google Ads sem listener

**Problema:** O botão `#btn-google-ads` existe no HTML mas nunca tem um event listener registrado. `handleGoogleAdsClick()` existe em `app.js` mas nunca é vinculado ao botão.

**Localizar:** A função `setupGlobalEvents()` em `assets/js/04-handlers.js`. Dentro dela, encontre o bloco onde outros botões da sidebar são registrados (próximo de `btn-new-project`, `btn-open-api`, `btn-open-projects`).

**Adicionar** dentro de `setupGlobalEvents()`, junto aos outros bindings de botão:

```javascript
const btnGA = document.getElementById('btn-google-ads');
if (btnGA) btnGA.addEventListener('click', () => this.handleGoogleAdsClick());
```

---

### FIX-03 · `index.html` — modal-rename sem botão de fechar

**Problema:** O `#modal-rename` não tem o botão `×` no header. Todos os outros modais têm. Inconsistência de UX — o usuário não tem como fechar visualmente sem usar Esc ou Cancelar.

**Localizar:** No `index.html`, o bloco do modal de renomear:

```html
<div class="modal-overlay" id="modal-rename">
  <div class="modal modal--sm">
    <div class="modal-header">
      <i data-lucide="edit-3" style="width:18px;height:18px;color:var(--accent2);"></i>
      <span class="modal-title">Nome do Projeto</span>
    </div>
```

**Substituir o `<div class="modal-header">` completo por:**

```html
<div class="modal-header">
  <i data-lucide="edit-3" style="width:18px;height:18px;color:var(--accent2);"></i>
  <span class="modal-title">Nome do Projeto</span>
  <div class="modal-header-actions">
    <button class="modal-close" onclick="App.closeModal('modal-rename')">
      <i data-lucide="x" style="width:18px;height:18px;"></i>
    </button>
  </div>
</div>
```

---

### FIX-04 · `assets/js/04-handlers.js` — generateDocImpl() sem tratamento de erro no modal

**Problema:** Quando uma das 4 partes da geração falha (erro de API, timeout, etc.), o sistema chama `aiLogError()` mas o modal `modal-gen` permanece aberto e `isGenerating` fica `true`. O usuário fica travado sem ação possível.

**Localizar:** O bloco `catch` no final da função `generateDocImpl()` em `assets/js/04-handlers.js`. Ele deve estar assim (ou similar):

```javascript
} catch (err) {
  console.error('[AIGator] Erro na geração:', err);
  this.aiLogError(null, err.message || 'Erro desconhecido');
  // ... possivelmente mais código
}
```

**Substituir o bloco `catch` por** (preservar qualquer código extra que já exista, apenas garantir que as 3 linhas abaixo estejam presentes no catch):

```javascript
} catch (err) {
  console.error('[AIGator] Erro na geração:', err);
  this.aiLogError(null, err.message || 'Erro desconhecido');
  this.state.isGenerating = false;
  setTimeout(() => {
    this.closeModal('modal-gen');
    this.showToast('Falha na geração. Verifique sua API Key e tente novamente.', 'error', 7000);
  }, 1200);
} finally {
  this.state.isGenerating = false;
}
```

> **Nota:** Se já existir um bloco `finally`, apenas garantir que `this.state.isGenerating = false` está nele. Não duplicar o `finally`.

---

## PRIORIDADE 2 — CSS: Tokens Faltantes (implementar segundo)

---

### FIX-05 · `assets/css/00-vars.css` — Tokens `--space-*` não definidos

**Problema:** Os arquivos `05-loader.css`, `06-error-modal.css`, `07-form-validation.css`, `08-empty-states.css`, `09-tooltips.css` e `modules/google-ads/styles/google-ads.css` usam variáveis `--space-1` a `--space-8`, mas essas variáveis não estão declaradas em `00-vars.css`. O browser usa fallback para `0`, quebrando espaçamentos nesses componentes.

**Localizar:** Em `assets/css/00-vars.css`, o bloco `:root { }`. Encontre a seção de Layout (onde estão `--sidebar-w`, `--topbar-h`, `--bottom-h`, `--content-max`).

**Adicionar** dentro do bloco `:root`, logo após a seção de Layout:

```css
/* Espaçamento */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 28px;
--space-8: 32px;
```

---

### FIX-06 · `assets/css/00-vars.css` — Token `--shadow-xl` não definido

**Problema:** O arquivo `06-error-modal.css` usa `var(--shadow-xl)` na classe `.error-modal`, mas essa variável não existe em `00-vars.css`. O error modal fica sem sombra.

**Localizar:** Em `assets/css/00-vars.css`, a seção de Sombras:

```css
/* Sombras */
--shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.45);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.55);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.65);
--shadow-glow: 0 0 28px rgba(0, 229, 160, 0.14);
```

**Substituir** esse bloco por:

```css
/* Sombras */
--shadow-sm: 0 1px 4px rgba(0, 0, 0, 0.45);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.55);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.65);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.75);
--shadow-glow: 0 0 28px rgba(0, 229, 160, 0.14);
```

---

## PRIORIDADE 3 — UX/UI: Problemas de Usabilidade

---

### FIX-07 · `assets/css/01-layout.css` — Classe `.sidebar-btn` vazia

**Problema:** O botão `#btn-google-ads` no HTML tem mais de 12 propriedades CSS inline. A classe `.sidebar-btn` existe referenciada mas está vazia/ausente no CSS, forçando o uso de inline styles.

**Localizar:** Em `assets/css/01-layout.css`, a seção do sidebar footer ou qualquer ponto após `.sidebar-section`. Encontre se `.sidebar-btn` já existe; se não, adicionar.

**Adicionar** em `assets/css/01-layout.css`, após o bloco `.sidebar-section`:

```css
/* Sidebar button (Google Ads, etc.) */
.sidebar-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--r-md);
  transition: all var(--t-base);
}

.sidebar-btn:hover {
  background: var(--bg-overlay);
  color: var(--text-primary);
}

.sidebar-btn.active {
  background: var(--accent2-dim);
  color: var(--accent2);
}

.sidebar-btn i {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
```

**Depois,** no `index.html`, localizar o botão Google Ads:

```html
<button id="btn-google-ads" class="sidebar-btn" data-screen="google-ads" style="width:100%; justify-content: flex-start; gap: var(--space-3); padding: var(--space-3) var(--space-4); background: none; border: none; color: var(--text-secondary); font-family: inherit; font-size: 14px; font-weight: 500; cursor: pointer; border-radius: var(--r-md); transition: all var(--t-base); display: flex; align-items: center;">
```

**Substituir por** (remover todos os inline styles — a classe já cuida disso):

```html
<button id="btn-google-ads" class="sidebar-btn" data-screen="google-ads">
```

---

### FIX-08 · `assets/css/01-layout.css` — Padding excessivo sem breakpoint médio

**Problema:** Em telas de 1024–1280px, o `topbar` e `screen-content` usam padding de 40–48px, deixando pouco espaço para o conteúdo. Não há breakpoint para telas médias.

**Localizar:** Em `assets/css/01-layout.css`, o bloco `@media (max-width: 768px)` já existente.

**Adicionar** um novo bloco de media query **antes** do bloco `@media (max-width: 768px)` existente:

```css
@media (max-width: 1280px) {
  .topbar {
    padding: 0 28px;
  }

  .screen-content {
    padding: 32px 36px;
  }

  .bottombar-inner {
    padding: 0 36px;
  }
}

@media (max-width: 1024px) {
  .topbar {
    padding: 0 20px;
  }

  .screen-content {
    padding: 24px 24px;
  }

  .bottombar-inner {
    padding: 0 24px;
  }
}
```

---

### FIX-09 · `assets/js/08-empty-states.js` — Funções globais inexistentes

**Problema:** Os métodos da classe `EmptyStateManager` geram HTML com `onclick` apontando para funções globais que não existem: `switchScreen('intake')`, `clearSearch()`, `emptyStateRetry()`. Ao clicar qualquer botão de empty state, o app quebra com `ReferenceError`.

**Localizar:** Em `assets/js/08-empty-states.js`, a função `showNoProjects()`. O HTML gerado contém:

```javascript
onclick="switchScreen('intake')"
```

**Substituir** essa ocorrência por:

```javascript
onclick="App.goToScreen('intake')"
```

**Localizar** também a função `showNoResults()`. O HTML contém:

```javascript
onclick="clearSearch()"
```

**Substituir** por:

```javascript
onclick="App.openModal('modal-projects')"
```

**Localizar** também a função `showError()`. O HTML contém:

```javascript
onclick="emptyStateRetry()"
```

**Substituir** por:

```javascript
onclick="window.emptyStateRetry?.()"
```

---

### FIX-10 · `assets/js/11-keyboard-nav.js` — Atalhos apontam para funções inexistentes

**Problema:** Todos os atalhos de teclado documentados no README (`Ctrl+N`, `Ctrl+K`, `Ctrl+S`, `Ctrl+G`) chamam `switchScreen()` e `saveProject()` — funções que não existem globalmente. Os atalhos falham silenciosamente.

**Localizar:** Em `assets/js/11-keyboard-nav.js`, a função `setupShortcuts()`. O objeto `shortcuts` está assim:

```javascript
const shortcuts = {
  'Ctrl+K': () => {
    const search = document.getElementById('search');
    if (search) search.focus();
  },
  'Ctrl+N': () => {
    if (window.switchScreen) switchScreen('intake');
  },
  'Ctrl+S': () => {
    if (window.saveProject) saveProject();
  },
  'Ctrl+G': () => {
    if (window.switchScreen) switchScreen('google-ads');
  }
};
```

**Substituir** o objeto `shortcuts` completo por:

```javascript
const shortcuts = {
  'Ctrl+K': () => {
    if (window.App) {
      App.renderProjectsList();
      App.openModal('modal-projects');
    }
  },
  'Ctrl+N': () => {
    if (window.App) App.createProject();
  },
  'Ctrl+S': () => {
    if (window.App) App.autosave();
  },
  'Ctrl+G': () => {
    if (window.App) App.handleGoogleAdsClick();
  }
};
```

---

### FIX-11 · `assets/js/14-toast.js` — ToastManager conflita com App.showToast()

**Problema:** Existem dois sistemas de toast paralelos: `window.Toast` (ToastManager, cria `#toast-container` dinâmico) e `App.showToast()` (usa `#toast` estático do HTML). O sistema só usa `App.showToast()`. O `window.Toast` existe mas nunca é chamado, podendo aparecer em posição conflitante.

**Localizar:** Em `assets/js/14-toast.js`, a última linha do arquivo:

```javascript
window.Toast = new ToastManager();
```

**Substituir** por (comentar a instanciação automática e adicionar nota):

```javascript
// window.Toast = new ToastManager();
// Sistema de toast principal é App.showToast() que usa #toast no HTML.
// ToastManager disponível para uso futuro via: window.Toast = new ToastManager();
```

---

## PRIORIDADE 4 — CSS: Limpeza de Duplicações

---

### FIX-12 · `assets/css/03-screens.css` — `.ai-log-overlay` e `.ai-log-modal` duplicados

**Problema:** As classes `.ai-log-overlay` e `.ai-log-modal` aparecem definidas duas vezes no arquivo `03-screens.css`. A segunda definição sobrescreve a primeira e cria confusão de manutenção.

**Localizar:** Em `assets/css/03-screens.css`, as duas ocorrências dos blocos:

```css
.ai-log-overlay {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.ai-log-overlay.is-visible {
  opacity: 1;
}

.ai-log-modal {
  transform: scale(0.95) translateY(8px);
  transition: transform 0.25s ease, opacity 0.25s ease;
  opacity: 0;
}

.ai-log-overlay.is-visible .ai-log-modal {
  transform: scale(1) translateY(0);
  opacity: 1;
}
```

**Ação:** Manter apenas a **primeira** ocorrência desses 4 blocos. **Remover completamente** a segunda ocorrência (o conjunto duplicado que aparece depois).

---

### FIX-13 · `assets/css/02-components.css` e `03-screens.css` — `.btn-model-selector` duplicado

**Problema:** A classe `.btn-model-selector` está definida com valores diferentes em dois arquivos: `02-components.css` (padding: 8px 14px, gap: 8px) e `03-screens.css` (padding: 7px 12px, gap: 6px). A segunda sobrescreve a primeira.

**Localizar:** Em `assets/css/02-components.css`, o bloco `.btn-model-selector` (primeira definição com padding 8px 14px).

**Ação em `02-components.css`:** Atualizar os valores para coincidir com a versão final de `03-screens.css`:

Encontrar:
```css
.btn-model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
```

Substituir por:
```css
.btn-model-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
```

**Ação em `03-screens.css`:** Remover o bloco `.btn-model-selector` e `.btn-model-selector:hover` duplicado (deixar apenas em `02-components.css`).

**Localizar em `03-screens.css`:**
```css
/* ── Model Selector Dropdown ──────────────────────────────── */
.model-selector {
  position: relative;
}

.btn-model-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-pill);
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t-base);
  white-space: nowrap;
}

.btn-model-selector:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
```

**Remover** apenas os blocos `.btn-model-selector` e `.btn-model-selector:hover` dessa seção de `03-screens.css`. **Manter** o bloco `.model-selector { position: relative; }` pois provavelmente não está duplicado.

---

## PRIORIDADE 5 — Remoção de Código Problemático

---

### FIX-14 · `assets/js/app.js` — Remover requisição de permissão de notificação

**Problema:** Na função `init()`, o app pede permissão de notificação do browser logo ao abrir, mesmo sem usar notificações em lugar nenhum. Isso gera um popup indesejado para o usuário.

**Localizar:** Em `assets/js/app.js`, na função `init()`:

```javascript
// 5. Permissão de notificação (silencioso)
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}
```

**Substituir** por (comentar, não deletar — pode ser útil no futuro):

```javascript
// Notificações nativas: descomentar se implementado no futuro
// if ('Notification' in window && Notification.permission === 'default') {
//   Notification.requestPermission();
// }
```

---

### FIX-15 · `index.html` — Remover script de MutationObserver comentado desnecessário

**Problema:** No `index.html`, há um comentário explicando por que o MutationObserver foi removido. O comentário é um resquício de debug e não agrega valor ao código de produção.

**Localizar:** Em `index.html`, dentro do bloco `<script>` inline:

```javascript
// Re-renderizar quando conteúdo dinâmico é adicionado
// NOTA: Removido MutationObserver global para evitar loop infinito
// O sistema já chama lucide.createIcons() após renderizar telas.
```

**Substituir** por (limpar comentário de debug):

```javascript
// lucide.createIcons() é chamado explicitamente após cada renderização de tela.
```

---

## VERIFICAÇÃO PÓS-IMPLEMENTAÇÃO

Após todos os fixes, verificar:

1. **FIX-01:** Clicar no ícone de lápis no project-card → modal abre COM o campo já preenchido e com foco.
2. **FIX-02:** Clicar no botão "Google Ads" na sidebar → `handleGoogleAdsClick()` é chamado (sem `ReferenceError` no console).
3. **FIX-03:** Abrir qualquer projeto, clicar no lápis → modal de renomear tem o `×` no canto superior direito.
4. **FIX-04:** Simular erro de API (chave inválida) e clicar em gerar DOC-IMPL → modal fecha após ~1.2s e aparece toast de erro.
5. **FIX-05/06:** Abrir DevTools → Console → verificar ausência de warnings `undefined CSS variable`.
6. **FIX-07:** Botão Google Ads na sidebar renderiza sem inline styles — inspecionar elemento deve mostrar apenas `class="sidebar-btn"`.
7. **FIX-08:** Redimensionar browser para 1024px → padding reduz visivelmente.
8. **FIX-09:** Sem projetos criados → botão "Criar Novo Projeto" no empty state funciona.
9. **FIX-10:** Testar `Ctrl+N` (cria projeto), `Ctrl+S` (salva), `Ctrl+G` (abre GA), `Ctrl+K` (abre modal projetos).
10. **FIX-11:** No console: `window.Toast` existe mas `new ToastManager()` não é instanciado automaticamente.
11. **FIX-12/13:** DevTools → Sources → verificar que `.ai-log-overlay` aparece uma vez só no CSS computado.
12. **FIX-14:** Abrir o app → browser NÃO pede permissão de notificação.

---

## RESUMO DOS ARQUIVOS MODIFICADOS

| Arquivo | Fixes |
|---|---|
| `assets/js/03-ui.js` | FIX-01 |
| `assets/js/04-handlers.js` | FIX-02, FIX-04 |
| `index.html` | FIX-03, FIX-07 (botão GA), FIX-15 |
| `assets/css/00-vars.css` | FIX-05, FIX-06 |
| `assets/css/01-layout.css` | FIX-07 (classe CSS), FIX-08 |
| `assets/js/08-empty-states.js` | FIX-09 |
| `assets/js/11-keyboard-nav.js` | FIX-10 |
| `assets/js/14-toast.js` | FIX-11 |
| `assets/css/03-screens.css` | FIX-12, FIX-13 |
| `assets/css/02-components.css` | FIX-13 |
| `assets/js/app.js` | FIX-14 |

**Total:** 11 arquivos modificados · 15 fixes · 0 arquivos criados
