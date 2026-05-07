# AIGator — Plano de Correção de Bugs v1.0
> **Para o Roo Code.**
> Leia este documento completo antes de executar qualquer ação.
> Execute as correções na ordem exata. Não pule etapas.
> Declare quais arquivos vai editar antes de começar cada correção.

---

## DIAGNÓSTICO RESUMIDO

O app não funciona porque:
1. `assets/js/app.js` está vazio — o `App` nunca inicializa
2. `window.App = {}` nunca é declarado — todos os `Object.assign` falham
3. `index.html` carrega o arquivo errado (`assets/app.js` em vez de `assets/js/app.js`)
4. Upload de arquivos não tem handlers registrados
5. Modelos Gemini desatualizados e incompletos

Tudo que "não funciona" é consequência direta dos itens 1, 2 e 3.

---

## CORREÇÃO 1 — Entry Point e Inicialização

**Arquivos:** `assets/js/app.js` (reescrever), `assets/js/01-state.js` (adicionar método)

### 1.1 — Reescrever `assets/js/app.js`

Substituir o conteúdo atual (vazio) por:

```javascript
/* ============================================================
   AIGator — LandingAI Module — Entry Point
   ============================================================ */

// Declarar o objeto global ANTES de qualquer outro arquivo usar Object.assign
// Este arquivo é o último a ser carregado — mas App precisa existir primeiro.
// A ordem de carregamento no HTML garante isso.

window.App = window.App || {};

Object.assign(window.App, {
  init() {
    // 1. Carregar dados do localStorage
    this.loadStorage();

    // 2. Se não houver projeto ativo válido, criar um novo
    if (!this.state.activeId || !this.state.projects[this.state.activeId]) {
      const ids = Object.keys(this.state.projects);
      if (ids.length > 0) {
        this.state.activeId = ids[ids.length - 1]; // pegar o mais recente
      } else {
        this.createProject('Novo Projeto'); // cria e já salva
        return; // createProject chama renderAll internamente
      }
    }

    // 3. Registrar eventos globais
    this.setupGlobalEvents();

    // 4. Renderizar tudo
    this.renderAll();

    // 5. Solicitar permissão de notificação (silencioso)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
});

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
```

> ⚠️ IMPORTANTE: O `window.App = window.App || {}` deve ser a primeira linha executada.
> Verifique que o `index.html` carrega `assets/js/app.js` como ÚLTIMO script.

### 1.2 — Verificar `assets/js/01-state.js`

O método `createProject` já existe e chama `this.renderAll()` — verificar se existe. Se não existir, adicionar ao final do `Object.assign`:

```javascript
  renderAll() {
    if (this.renderScreen) this.renderScreen();
    if (this.renderStepsNav) this.renderStepsNav();
    if (this.updateTopbar) this.updateTopbar();
    if (this.updateSidebar) this.updateSidebar();
    if (this.renderBottombar) this.renderBottombar();
    if (this.setupGlobalEvents) {
      // setupGlobalEvents só deve rodar uma vez
      // já é chamado no init, não chamar de novo aqui
    }
  },
```

> `renderAll` já existe em `03-ui.js` — não duplicar. Apenas verificar que `createProject` chama `this.renderAll()` ou `if (this.renderAll) this.renderAll()`.

---

## CORREÇÃO 2 — index.html

**Arquivo:** `index.html`

### 2.1 — Corrigir ordem e destino dos scripts

Localizar o bloco de scripts no final do `index.html`:
```html
<script src="assets/app.js"></script>
```

Substituir TODA a seção de scripts por:
```html
<!-- AIGator — LandingAI Module -->
<script src="https://unpkg.com/lucide@0.344.0/dist/umd/lucide.js"></script>
<script>
  // Declarar App globalmente ANTES de qualquer módulo
  window.App = {};
</script>
<script src="assets/js/00-config.js"></script>
<script src="assets/js/01-state.js"></script>
<script src="assets/js/02-api.js"></script>
<script src="assets/js/screens/intake.js"></script>
<script src="assets/js/screens/step.js"></script>
<script src="assets/js/screens/art.js"></script>
<script src="assets/js/screens/structure.js"></script>
<script src="assets/js/screens/review.js"></script>
<script src="assets/js/03-ui.js"></script>
<script src="assets/js/04-handlers.js"></script>
<script src="assets/js/app.js"></script>
```

> ATENÇÃO: Verificar o nome exato do script do Lucide que já está no HTML. Manter o mesmo. Não duplicar.

### 2.2 — Remover import do CSS monolítico antigo (se existir)

Verificar se há alguma linha:
```html
<link rel="stylesheet" href="assets/app.css">
```
Se existir, remover. Os 5 arquivos CSS modulares já estão importados corretamente.

---

## CORREÇÃO 3 — Upload de Arquivos (Intake e Arte)

**Arquivo:** `assets/js/04-handlers.js`

O método `bindScreenEvents` precisa de handlers para upload. Adicionar ao FINAL do método `bindScreenEvents`, antes do `}` de fechamento:

```javascript
    // ── Upload de arquivos (Intake) ──────────────────────────
    const intakeZone = container.querySelector('#intake-upload-zone');
    const intakeInput = container.querySelector('#intake-upload-input');
    if (intakeZone && intakeInput) {
      // Clique na zona abre o file picker
      intakeZone.addEventListener('click', () => intakeInput.click());

      // Drag & Drop
      intakeZone.addEventListener('dragover', e => {
        e.preventDefault();
        intakeZone.classList.add('drag-over');
      });
      intakeZone.addEventListener('dragleave', () => {
        intakeZone.classList.remove('drag-over');
      });
      intakeZone.addEventListener('drop', e => {
        e.preventDefault();
        intakeZone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.handleIntakeFiles(files);
      });

      // Seleção via input
      intakeInput.addEventListener('change', () => {
        const files = Array.from(intakeInput.files);
        this.handleIntakeFiles(files);
        intakeInput.value = '';
      });
    }

    // ── Upload de arquivos (Arte) ────────────────────────────
    const artZone = container.querySelector('#art-upload-zone');
    const artInput = artZone?.querySelector('input[type="file"]');
    if (artZone && artInput) {
      artZone.addEventListener('click', (e) => {
        if (e.target !== artInput) artInput.click();
      });
      artZone.addEventListener('dragover', e => {
        e.preventDefault();
        artZone.classList.add('drag-over');
      });
      artZone.addEventListener('dragleave', () => {
        artZone.classList.remove('drag-over');
      });
      artZone.addEventListener('drop', e => {
        e.preventDefault();
        artZone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.handleArtFiles(files);
      });
      artInput.addEventListener('change', () => {
        const files = Array.from(artInput.files);
        this.handleArtFiles(files);
        artInput.value = '';
      });
    }

    // ── Referências de Arte (add/remove) ────────────────────
    container.querySelectorAll('[data-add-ref]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.addRef; // 'pessoais' ou 'nicho'
        this.addArtRef(type);
      });
    });
    container.querySelectorAll('[data-remove-ref]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.removeRef;
        const idx = parseInt(btn.dataset.refIdx);
        this.removeArtRef(type, idx);
      });
    });

    // ── Color picker sync ────────────────────────────────────
    container.querySelectorAll('input[type="color"][data-field]').forEach(picker => {
      picker.addEventListener('input', () => {
        const field = picker.dataset.field;
        // Sincronizar com o input de texto ao lado
        const textInput = container.querySelector(`input[type="text"][data-field="${field}"]`);
        if (textInput) textInput.value = picker.value;
        this.setField(field, picker.value);
      });
    });

    // ── Aprovar Arte ─────────────────────────────────────────
    const approveArtBtn = container.querySelector('#btn-approve-art');
    if (approveArtBtn) approveArtBtn.addEventListener('click', () => this.aprovarArte());

    // ── Aprovar Estrutura ────────────────────────────────────
    const approveEstruturaBtn = container.querySelector('#btn-approve-estrutura');
    if (approveEstruturaBtn) approveEstruturaBtn.addEventListener('click', () => this.aprovarEstrutura());
```

### 3.1 — Adicionar métodos de upload em `assets/js/04-handlers.js`

Adicionar ao `Object.assign` do arquivo:

```javascript
  handleIntakeFiles(files) {
    if (!files.length) return;
    this.state.intakeFiles = [...(this.state.intakeFiles || []), ...files];
    
    const list = document.getElementById('intake-files-list');
    if (!list) return;
    
    list.innerHTML = this.state.intakeFiles.map((f, i) => `
      <div class="upload-preview-item">
        <i data-lucide="file-text" style="width:14px;height:14px"></i>
        <span>${f.name}</span>
        <button onclick="App.removeIntakeFile(${i})" title="Remover">
          <i data-lucide="x" style="width:12px;height:12px"></i>
        </button>
      </div>
    `).join('');
    lucide.createIcons({ nodes: [list] });
    this.showToast(`${files.length} arquivo(s) adicionado(s)`, 'success');
  },

  removeIntakeFile(index) {
    this.state.intakeFiles.splice(index, 1);
    const list = document.getElementById('intake-files-list');
    if (list) {
      list.innerHTML = this.state.intakeFiles.map((f, i) => `
        <div class="upload-preview-item">
          <i data-lucide="file-text" style="width:14px;height:14px"></i>
          <span>${f.name}</span>
          <button onclick="App.removeIntakeFile(${i})" title="Remover">
            <i data-lucide="x" style="width:12px;height:12px"></i>
          </button>
        </div>
      `).join('');
      lucide.createIcons({ nodes: [list] });
    }
  },

  handleArtFiles(files) {
    if (!files.length) return;
    if (!this.P) return;
    
    const existing = this.B.arte_arquivos || [];
    const novos = files.map(f => ({ name: f.name, size: f.size, type: f.type }));
    this.setField('arte_arquivos', [...existing, ...novos]);
    
    const list = document.getElementById('art-files-list');
    if (list) {
      const all = this.B.arte_arquivos || [];
      list.innerHTML = all.map((f, i) => `
        <div class="upload-preview-item">
          <i data-lucide="file" style="width:14px;height:14px"></i>
          <span>${f.name}</span>
          <button onclick="App.removeArtFile(${i})" title="Remover">
            <i data-lucide="x" style="width:12px;height:12px"></i>
          </button>
        </div>
      `).join('');
      lucide.createIcons({ nodes: [list] });
    }
    this.showToast(`${files.length} arquivo(s) adicionado(s)`, 'success');
  },

  removeArtFile(index) {
    const all = [...(this.B.arte_arquivos || [])];
    all.splice(index, 1);
    this.setField('arte_arquivos', all);
    this.renderScreen();
  },

  addArtRef(type) {
    const field = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    const arr = [...(this.B[field] || [])];
    arr.push({ url: '', notas: '' });
    this.setField(field, arr);
    this.renderScreen();
  },

  removeArtRef(type, index) {
    const field = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    const arr = [...(this.B[field] || [])];
    arr.splice(index, 1);
    this.setField(field, arr);
    this.renderScreen();
  },
```

---

## CORREÇÃO 4 — Modelos Gemini

**Arquivo:** `assets/js/00-config.js`

### 4.1 — Corrigir e atualizar AI_MODELS

Localizar o objeto `AI_MODELS` e substituir APENAS as entradas do Gemini pelo seguinte:

```javascript
const AI_MODELS = {
  // ── Google Gemini ──────────────────────────────────────────
  'gemini-2.0-flash-lite': {
    label: 'Gemini 2.0 Flash Lite',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent',
    maxTokens: 8192,
    temp: 0.7,
  },
  'gemini-2.5-flash-lite': {
    label: 'Gemini 2.5 Flash Lite',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent',
    maxTokens: 16384,
    temp: 0.7,
  },
  'gemini-2.5-flash': {
    label: 'Gemini 2.5 Flash',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent',
    maxTokens: 32768,
    temp: 0.7,
  },
  'gemini-2.5-pro': {
    label: 'Gemini 2.5 Pro',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:generateContent',
    maxTokens: 65536,
    temp: 0.6,
  },
  'gemini-2.5-flash-image': {
    label: 'Gemini 2.5 Flash Image',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent',
    maxTokens: 16384,
    temp: 0.7,
    supportsImages: true,
  },
  'gemini-3-flash-preview': {
    label: 'Gemini 3 Flash Preview',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
    maxTokens: 32768,
    temp: 0.7,
  },
  'gemini-3.1-pro-preview': {
    label: 'Gemini 3.1 Pro Preview',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent',
    maxTokens: 65536,
    temp: 0.6,
  },

  // ── Manter os outros providers exatamente como estão ──────
  // (Claude, Grok, Mistral, OpenRouter — não alterar)
};
```

> ⚠️ Manter as entradas dos outros providers (Claude, Grok, Mistral, OpenRouter) exatamente como estão.
> Atualizar também `this.state.selectedModel` no `01-state.js` para `'gemini-2.5-flash'` como padrão.

---

## CORREÇÃO 5 — Modal de Projetos

**Arquivo:** `assets/js/03-ui.js`

### 5.1 — Corrigir `loadProject` para fechar modal

Localizar o método `loadProject` em `01-state.js` e adicionar fechamento do modal:

```javascript
  loadProject(id) {
    if (!this.state.projects[id]) return;
    this.state.activeId = id;
    this.state.screen = 'intake';
    this.autosave(); // salvar o activeId
    this.closeModal('modal-projects');
    if (this.renderAll) this.renderAll();
  },
```

### 5.2 — Adicionar botão "Excluir Tudo" no modal de projetos

Em `03-ui.js`, localizar o método `renderProjectsList()`.

Substituir o `list.innerHTML = ...` atual por:

```javascript
  renderProjectsList() {
    const list = document.getElementById('projects-list');
    if (!list) return;

    const projects = Object.values(this.state.projects).sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // Cabeçalho com contagem e botão excluir tudo
    const header = document.getElementById('projects-list-header');
    if (header) {
      header.innerHTML = projects.length > 0 ? `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:12px;color:var(--text-tertiary)">${projects.length} projeto(s)</span>
          <button class="btn-ghost btn-sm" style="color:var(--danger);font-size:11px"
            onclick="App.confirmDeleteAll()">
            <i data-lucide="trash-2" style="width:12px;height:12px"></i>
            Excluir todos
          </button>
        </div>
      ` : '';
      lucide.createIcons({ nodes: [header] });
    }

    if (projects.length === 0) {
      list.innerHTML = `<p style="font-size:13px;color:var(--text-tertiary);text-align:center;padding:20px 0">Nenhum projeto ainda</p>`;
      return;
    }

    list.innerHTML = projects.map(p => {
      const date = new Date(p.updatedAt).toLocaleDateString('pt-BR');
      const isActive = p.id === this.state.activeId;
      return `
        <div class="project-list-item ${isActive ? 'active' : ''}"
          onclick="App.loadProject('${p.id}')">
          <i data-lucide="folder" class="project-list-icon" style="width:16px;height:16px;flex-shrink:0"></i>
          <div class="project-list-info">
            <div class="project-list-name">${p.name || 'Sem nome'}</div>
            <div class="project-list-meta">${p.briefing?.segmento || '—'} · ${date}</div>
          </div>
          <div class="project-list-actions" onclick="event.stopPropagation()">
            <button class="project-list-btn" onclick="App.state.activeId='${p.id}'; App.openRenameModal();" title="Renomear">
              <i data-lucide="edit-3" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-btn" onclick="App.cloneProject('${p.id}')" title="Duplicar">
              <i data-lucide="copy" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-btn" onclick="App.exportProject('${p.id}')" title="Exportar JSON">
              <i data-lucide="download" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-btn danger" onclick="App.deleteProject('${p.id}')" title="Excluir">
              <i data-lucide="trash-2" style="width:13px;height:13px"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ nodes: [list] });
  },

  confirmDeleteAll() {
    const count = Object.keys(this.state.projects).length;
    if (!count) return;
    if (confirm(`Excluir todos os ${count} projeto(s)? Esta ação não pode ser desfeita.`)) {
      this.state.projects = {};
      this.state.activeId = null;
      this.autosave();
      this.createProject('Novo Projeto');
      this.closeModal('modal-projects');
      this.showToast('Todos os projetos foram excluídos.', 'success');
    }
  },
```

### 5.3 — Adicionar `id="projects-list-header"` no `index.html`

Dentro do `#modal-projects`, logo antes de `<div class="projects-list" id="projects-list">`, adicionar:
```html
<div id="projects-list-header"></div>
```

---

## CORREÇÃO 6 — Status dot API (mismatch de classe CSS)

**Arquivo:** `assets/js/03-ui.js`

Localizar no método `updateSidebar()`:
```javascript
if (apiDot) apiDot.className = `status-dot ${hasKey ? 'online' : ''}`;
```
Substituir por:
```javascript
if (apiDot) apiDot.className = `status-dot ${hasKey ? 'ok' : ''}`;
```

---

## CORREÇÃO 7 — Campo Google Analytics ID

**Arquivo:** `assets/js/screens/step.js`

Localizar o método `buildStep1()` (Identificação do projeto).

Após o campo de `slug` (ou após todos os campos de identidade do projeto), adicionar o campo de Analytics:

```javascript
// Campo: Google Analytics ID
<div class="field-group">
  ${this.fieldLabel('google_analytics_id', 'ID do Google Analytics', false)}
  <input type="text" class="field-input" data-field="google_analytics_id"
    placeholder="G-XXXXXXXXXX" value="${B.google_analytics_id || ''}">
  <span class="field-hint">ID da propriedade GA4. Formato: G-XXXXXXXXXX</span>
</div>
```

Inserir na linha imediatamente após o campo do `slug` ou após `google_tag_manager_id` se existir.

---

## CORREÇÃO 8 — Tooltips: estilo e CSS

**Arquivo:** `assets/css/02-components.css`

Localizar os estilos de `.field-tooltip` e substituir por:

```css
/* ── Tooltips ──────────────────────────────────────────────── */
.field-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
  color: var(--text-disabled);
  transition: color var(--t-fast);
}

.field-tooltip:hover {
  color: var(--accent2);
}

.field-tooltip svg {
  width: 13px;
  height: 13px;
}

.field-tooltip-content {
  display: none;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 10px 13px;
  font-size: 12px;
  font-family: var(--font-body);
  color: var(--text-secondary);
  line-height: 1.55;
  white-space: normal;
  width: 240px;
  box-shadow: var(--shadow-md);
  z-index: 200;
  pointer-events: none;
}

/* Seta do tooltip */
.field-tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--border-default);
}

.field-tooltip-content::before {
  content: '';
  position: absolute;
  top: calc(100% - 1px);
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--bg-overlay);
  z-index: 1;
}

.field-tooltip:hover .field-tooltip-content {
  display: block;
}

/* Tooltip que abre para baixo quando está no topo da tela */
.field-tooltip.tooltip-down .field-tooltip-content {
  bottom: auto;
  top: calc(100% + 8px);
}
.field-tooltip.tooltip-down .field-tooltip-content::after {
  top: auto;
  bottom: 100%;
  border-top-color: transparent;
  border-bottom-color: var(--border-default);
}
.field-tooltip.tooltip-down .field-tooltip-content::before {
  top: auto;
  bottom: calc(100% - 1px);
  border-top-color: transparent;
  border-bottom-color: var(--bg-overlay);
}
```

**Arquivo:** `assets/js/03-ui.js`

Localizar o método `fieldLabel` e substituir por:

```javascript
  fieldLabel(field, text, required = false, optional = false) {
    const tip = FIELD_TOOLTIPS?.[field];
    return `
      <label class="field-label">
        ${text}
        ${required ? '<span class="field-required">*</span>' : ''}
        ${optional ? '<span class="field-optional">opcional</span>' : ''}
        ${tip ? `
          <span class="field-tooltip">
            <i data-lucide="info" style="width:13px;height:13px"></i>
            <span class="field-tooltip-content">${tip}</span>
          </span>
        ` : ''}
      </label>
    `;
  },
```

---

## CORREÇÃO 9 — Intake: verificar IDs de elementos HTML

**Arquivo:** `assets/js/screens/intake.js`

Verificar se o HTML gerado por `buildIntakeScreen()` contém os seguintes IDs exatos:
- `id="intake-upload-zone"` — a zona de drag & drop
- `id="intake-upload-input"` — o `<input type="file">`
- `id="intake-files-list"` — onde os arquivos aparecem listados
- `id="btn-analyze"` — o botão de analisar

Se os IDs forem diferentes, atualizar o `buildIntakeScreen()` para usar esses IDs ou atualizar os handlers em `04-handlers.js` para usar os IDs corretos que já existem.

> Esta etapa é de verificação — não altere se os IDs já estiverem corretos.

---

## CORREÇÃO 10 — Garantir que `setupGlobalEvents` não duplica listeners

**Arquivo:** `assets/js/app.js` (já corrigido na CORREÇÃO 1)

O `setupGlobalEvents` deve ser chamado apenas uma vez no `init()`. Verificar que não está sendo chamado também dentro de `renderAll()` ou `renderScreen()`. Se estiver, remover de lá.

---

## VERIFICAÇÃO FINAL (executar depois de todas as correções)

Abrir `index.html` no Chrome e verificar no console (F12):

### ✅ Sem erros de console
- Não deve aparecer: `Cannot read properties of undefined`
- Não deve aparecer: `App is not defined`
- Não deve aparecer: `Object.assign` erros

### ✅ Fluxo básico
1. Página carrega → sidebar mostra "Novo Projeto"
2. Tela de Intake aparece com o textarea e a zona de upload
3. Arrastar um arquivo para a zona → aparece na lista
4. Escrever no textarea → indicador "Salvando..." pisca → vira "Salvo"
5. Abrir modal de Projetos → projeto aparece na lista
6. Criar outro projeto → aparece na lista
7. Clicar no projeto → modal fecha, projeto é carregado
8. Navegar pelos Steps via botão Próximo → Steps 1–8 aparecem
9. Selecionar modelo Gemini 2.5 Flash no dropdown → funciona
10. Configurar API Key → toast "salva!" aparece, ponto verde na sidebar

### ✅ O que NÃO testar agora (requer API Key real)
- Analisar material no Intake
- Gerar Direção de Arte
- Gerar Estrutura
- Gerar DOC-IMPL

---

## ARQUIVOS MODIFICADOS NESTE PLANO

| Arquivo | Tipo de mudança |
|---|---|
| `assets/js/app.js` | Reescrita completa (era vazio) |
| `index.html` | Corrigir import do `app.js` + `projects-list-header` |
| `assets/js/04-handlers.js` | Adicionar handlers de upload + métodos de arquivo |
| `assets/js/00-config.js` | Atualizar entradas Gemini no `AI_MODELS` |
| `assets/js/01-state.js` | Corrigir `loadProject` (fechar modal) |
| `assets/js/03-ui.js` | Corrigir `updateSidebar` (classe CSS), reescrever `renderProjectsList`, adicionar `confirmDeleteAll`, atualizar `fieldLabel` |
| `assets/js/screens/step.js` | Adicionar campo `google_analytics_id` no Step 1 |
| `assets/css/02-components.css` | Substituir estilos de tooltip |
