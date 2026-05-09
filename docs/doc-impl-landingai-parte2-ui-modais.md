# 📋 Ficha de Implementação — LandingAI
## PARTE 2: Correções de UI, Visualização de Direção de Arte e Modal de Alertas

**Status:** Pronto para Implementação  
**Versão:** 1.0  
**Data:** 09/05/2026

---

## 📌 CONTEXTO

Identificadas 4 problemas críticos de UX/UI:

1. **Direção de Arte:** Arquivo adicionado não aparece visualmente (sem feedback)
2. **Cor da Marca:** Square color picker não atualiza quando digita HEX direto
3. **Modal de Direção de Arte:** Conteúdo cortado, sem scroll
4. **Modal de Alertas (Revisão):** Design ruim, botões não funcionam, modal fora da área principal

---

## 1. PROBLEMA 1: Visualizar Arquivo Adicionado em Direção de Arte

### Contexto
Quando user adiciona arquivo (referência visual, etc), aparece apenas um toast. Não há confirmação visual de que o arquivo foi realmente adicionado.

### Solução

Modificar `assets/js/screens/art.js` para:
1. Exibir nome do arquivo
2. Mostrar preview se for imagem
3. Botão para remover
4. Listar todos os arquivos adicionados

### Implementação

#### 1.1 Novo HTML em `index.html`

```html
<!-- Seção Referências Visuais -->
<div class="form-group">
  <label>Referências Visuais — Links + Descrição</label>
  
  <div class="referencia-upload-area">
    <input 
      type="file" 
      id="upload-referencia-visual"
      accept="image/*,.pdf"
      class="file-input-hidden"
      onchange="window.LandingAI.art.adicionarReferenciaVisual(event)">
    
    <button 
      class="btn btn-outline btn-block"
      type="button"
      onclick="document.getElementById('upload-referencia-visual').click()">
      📁 + Adicionar Arquivo (Imagem/PDF)
    </button>
  </div>

  <!-- Lista de arquivos adicionados -->
  <div id="referencia-visual-list" class="referencia-list">
    <div class="placeholder">
      <p>Nenhum arquivo adicionado ainda</p>
    </div>
  </div>

  <!-- Inputs de link + descrição -->
  <div class="referencia-manual">
    <input 
      type="text"
      id="referencia-link"
      placeholder="Ou cole aqui um link (ex: https://exemplo.com)"
      class="input-field">
    
    <textarea 
      id="referencia-descricao"
      placeholder="O que me atraiu nesta referência? (tipografia, cores, layout, movimento)"
      rows="3"
      class="input-field"></textarea>
    
    <button 
      class="btn btn-secondary"
      type="button"
      onclick="window.LandingAI.art.adicionarReferenciaManual()">
      ➕ Adicionar Link + Descrição
    </button>
  </div>
</div>
```

#### 1.2 Modificar `assets/js/screens/art.js`

```javascript
// assets/js/screens/art.js (SEÇÃO: Gerenciamento de Referências)

import { showToast } from '../14-toast.js';
import { appState } from '../01-state.js';

// ============================================================
// REFERÊNCIAS VISUAIS
// ============================================================

/**
 * Adiciona arquivo de referência visual
 */
function adicionarReferenciaVisual(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  
  // Validar tipo
  if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) {
    showToast('❌ Arquivo deve ser imagem ou PDF', 'error');
    return;
  }

  // Validar tamanho (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast('❌ Arquivo deve ter menos de 5MB', 'error');
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const referencia = {
      id: Date.now().toString(),
      tipo: 'arquivo',
      nome: file.name,
      tamanho: (file.size / 1024).toFixed(2) + 'KB',
      mimetype: file.type,
      conteudo: e.target.result, // Base64
      descricao: '',
      dataAdicao: new Date().toISOString()
    };

    // Salvar no state
    if (!appState.artDirection) {
      appState.artDirection = {};
    }
    if (!appState.artDirection.referenciasVisuais) {
      appState.artDirection.referenciasVisuais = [];
    }

    appState.artDirection.referenciasVisuais.push(referencia);

    // Renderizar lista
    renderizarReferenciasList();

    showToast(`✅ Arquivo "${file.name}" adicionado!`, 'success');
  };

  reader.readAsDataURL(file);

  // Limpar input
  event.target.value = '';
}

/**
 * Adiciona referência manual (link + descrição)
 */
function adicionarReferenciaManual() {
  const link = document.getElementById('referencia-link')?.value || '';
  const descricao = document.getElementById('referencia-descricao')?.value || '';

  if (!link && !descricao) {
    showToast('⚠️ Preencha pelo menos um campo', 'warning');
    return;
  }

  const referencia = {
    id: Date.now().toString(),
    tipo: 'link',
    link: link,
    descricao: descricao,
    dataAdicao: new Date().toISOString()
  };

  // Salvar no state
  if (!appState.artDirection) {
    appState.artDirection = {};
  }
  if (!appState.artDirection.referenciasVisuais) {
    appState.artDirection.referenciasVisuais = [];
  }

  appState.artDirection.referenciasVisuais.push(referencia);

  // Limpar inputs
  document.getElementById('referencia-link').value = '';
  document.getElementById('referencia-descricao').value = '';

  // Renderizar lista
  renderizarReferenciasList();

  showToast('✅ Referência adicionada!', 'success');
}

/**
 * Remove uma referência
 */
function removerReferencia(id) {
  appState.artDirection.referenciasVisuais = 
    appState.artDirection.referenciasVisuais.filter(r => r.id !== id);

  renderizarReferenciasList();

  showToast('✅ Referência removida', 'success');
}

/**
 * Renderiza lista de referências adicionadas
 */
function renderizarReferenciasList() {
  const container = document.getElementById('referencia-visual-list');
  const refs = appState.artDirection?.referenciasVisuais || [];

  if (refs.length === 0) {
    container.innerHTML = `
      <div class="placeholder">
        <p>Nenhum arquivo adicionado ainda</p>
      </div>
    `;
    return;
  }

  container.innerHTML = refs.map(ref => `
    <div class="referencia-item">
      ${ref.tipo === 'arquivo' ? `
        <!-- Arquivo -->
        <div class="referencia-header">
          <div class="referencia-icon">
            ${ref.mimetype.includes('image') ? '🖼️' : '📄'}
          </div>
          <div class="referencia-info">
            <div class="referencia-nome">${ref.nome}</div>
            <div class="referencia-meta">${ref.tamanho}</div>
          </div>
        </div>

        <!-- Preview se for imagem -->
        ${ref.mimetype.includes('image') ? `
          <div class="referencia-preview">
            <img src="${ref.conteudo}" alt="${ref.nome}">
          </div>
        ` : ''}
      ` : `
        <!-- Link -->
        <div class="referencia-header">
          <div class="referencia-icon">🔗</div>
          <div class="referencia-info">
            <div class="referencia-nome">${ref.link}</div>
            <div class="referencia-desc">${ref.descricao}</div>
          </div>
        </div>
      `}

      <div class="referencia-actions">
        <button 
          class="btn btn-small btn-outline"
          onclick="window.LandingAI.art.removerReferencia('${ref.id}')">
          ❌ Remover
        </button>
      </div>
    </div>
  `).join('');
}

export {
  adicionarReferenciaVisual,
  adicionarReferenciaManual,
  removerReferencia,
  renderizarReferenciasList
};
```

#### 1.3 CSS para Referências

```css
/* Em assets/css/03-screens.css */

.referencia-upload-area {
  margin-bottom: 1.5rem;
}

.referencia-list {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.referencia-list .placeholder {
  text-align: center;
  padding: 2rem 1rem;
  background: var(--bg-default);
  border-radius: var(--r-md);
  color: var(--text-secondary);
  font-size: 13px;
}

.referencia-item {
  background: var(--bg-default);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.referencia-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.referencia-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.referencia-info {
  flex: 1;
}

.referencia-nome {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  word-break: break-word;
}

.referencia-meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.referencia-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 0.5rem;
  line-height: 1.4;
}

.referencia-preview {
  width: 100%;
  max-height: 200px;
  border-radius: var(--r-sm);
  overflow: hidden;
}

.referencia-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.referencia-actions {
  display: flex;
  gap: 0.5rem;
}

.referencia-manual {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-default);
}
```

---

## 2. PROBLEMA 2: Color Picker não atualiza com HEX direto

### Contexto
User digita HEX direto no input (ex: #FF5733), mas o square color picker não muda visualmente.

### Solução

Adicionar event listener no input HEX para:
1. Validar formato
2. Atualizar square color
3. Salvar no state

### Implementação

#### 2.1 Modificar HTML do color picker

```html
<!-- Em "Cores da Marca" no form de Direção de Arte -->
<div class="form-group">
  <label>Cores da Marca</label>

  <div class="color-picker-group">
    <div class="color-input-row">
      <label>Cor Principal</label>
      <div class="color-input-wrapper">
        <input 
          type="color" 
          id="cor-principal-picker"
          class="color-picker-square"
          value="#000000"
          onchange="window.LandingAI.art.atualizarCorPrincipal()">
        
        <input 
          type="text" 
          id="cor-principal-hex"
          class="color-hex-input"
          placeholder="#000000"
          maxlength="7"
          oninput="window.LandingAI.art.validarEAtualizarHex('principal', this.value)">
      </div>
    </div>

    <div class="color-input-row">
      <label>Cor Secundária (opcional)</label>
      <div class="color-input-wrapper">
        <input 
          type="color" 
          id="cor-secundaria-picker"
          class="color-picker-square"
          value="#FFFFFF"
          onchange="window.LandingAI.art.atualizarCorSecundaria()">
        
        <input 
          type="text" 
          id="cor-secundaria-hex"
          class="color-hex-input"
          placeholder="#FFFFFF"
          maxlength="7"
          oninput="window.LandingAI.art.validarEAtualizarHex('secundaria', this.value)">
      </div>
    </div>
  </div>
</div>
```

#### 2.2 Adicionar funções em `assets/js/screens/art.js`

```javascript
// Adicionar ao arquivo art.js

/**
 * Valida e atualiza HEX quando user digita direto
 */
function validarEAtualizarHex(tipo, valor) {
  // Validar formato HEX
  const regexHex = /^#[0-9A-F]{6}$/i;

  if (!regexHex.test(valor)) {
    // Se não for válido, apenas salvar temporariamente
    return;
  }

  // Atualizar o color picker correspondente
  const pickerId = tipo === 'principal' 
    ? 'cor-principal-picker' 
    : 'cor-secundaria-picker';

  const picker = document.getElementById(pickerId);
  if (picker) {
    picker.value = valor;
  }

  // Salvar no state
  if (!appState.artDirection) {
    appState.artDirection = {};
  }

  if (tipo === 'principal') {
    appState.artDirection.corPrincipal = valor;
  } else if (tipo === 'secundaria') {
    appState.artDirection.corSecundaria = valor;
  }

  showToast(`✅ Cor ${tipo} atualizada para ${valor}`, 'success');
}

/**
 * Atualiza cor principal quando usa color picker
 */
function atualizarCorPrincipal() {
  const picker = document.getElementById('cor-principal-picker');
  const hexInput = document.getElementById('cor-principal-hex');

  if (picker && hexInput) {
    hexInput.value = picker.value;
    validarEAtualizarHex('principal', picker.value);
  }
}

/**
 * Atualiza cor secundária quando usa color picker
 */
function atualizarCorSecundaria() {
  const picker = document.getElementById('cor-secundaria-picker');
  const hexInput = document.getElementById('cor-secundaria-hex');

  if (picker && hexInput) {
    hexInput.value = picker.value;
    validarEAtualizarHex('secundaria', picker.value);
  }
}

export {
  validarEAtualizarHex,
  atualizarCorPrincipal,
  atualizarCorSecundaria
};
```

#### 2.3 CSS para Color Picker

```css
/* Em assets/css/03-screens.css */

.color-picker-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.color-input-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-input-row > label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.color-input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.color-picker-square {
  width: 50px;
  height: 50px;
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  cursor: pointer;
  flex-shrink: 0;
}

.color-hex-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  font-family: 'Courier New', monospace;
  font-size: 13px;
  text-transform: uppercase;
}

.color-hex-input::placeholder {
  color: var(--text-secondary);
}

.color-hex-input:focus {
  outline: none;
  border-color: var(--accent);
}
```

---

## 3. PROBLEMA 3: Modal Direção de Arte com Conteúdo Cortado

### Contexto
Modal abre mostrando apenas até "Direção de Fotografia", resto fica cortado sem scroll.

### Solução
Refatorar modal para:
1. Usar max-height com overflow-y
2. Dividir conteúdo em abas (se muito grande)
3. Permitir scroll interno

### Implementação

#### 3.1 Novo Modal Structure

```html
<!-- Modal: Visualizar Direção de Arte (CORRIGIDO) -->
<div id="modal-direcao-arte" class="modal oculto">
  <div class="modal-overlay" onclick="fecharModalDirecaoArte()"></div>
  
  <div class="modal-content modal-lg">
    <header class="modal-header">
      <h3>Direção de Arte — Preview</h3>
      <button 
        class="btn-close" 
        onclick="fecharModalDirecaoArte()">
        ×
      </button>
    </header>

    <!-- Abas de navegação -->
    <div class="modal-tabs">
      <button class="tab-btn active" onclick="selecionarAbaModal('direacao')">
        🎨 Direção Geral
      </button>
      <button class="tab-btn" onclick="selecionarAbaModal('referencias')">
        📸 Referências
      </button>
      <button class="tab-btn" onclick="selecionarAbaModal('cores')">
        🎯 Cores e Elementos
      </button>
      <button class="tab-btn" onclick="selecionarAbaModal('detalhes')">
        ⚙️ Detalhes
      </button>
    </div>

    <!-- Conteúdo com scroll -->
    <div class="modal-body scrollable">
      <!-- Aba 1: Direção Geral -->
      <div id="aba-direacao" class="aba-modal visible">
        <h4>Direção Geral</h4>
        <div id="content-direcao-geral" class="modal-content-area">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>

      <!-- Aba 2: Referências -->
      <div id="aba-referencias" class="aba-modal">
        <h4>Referências Visuais</h4>
        <div id="content-referencias" class="modal-content-area">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>

      <!-- Aba 3: Cores -->
      <div id="aba-cores" class="aba-modal">
        <h4>Cores e Identidade</h4>
        <div id="content-cores" class="modal-content-area">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>

      <!-- Aba 4: Detalhes -->
      <div id="aba-detalhes" class="aba-modal">
        <h4>Detalhes Técnicos</h4>
        <div id="content-detalhes" class="modal-content-area">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>
    </div>

    <footer class="modal-footer">
      <button 
        class="btn btn-primary"
        onclick="aprovarDirecaoArte()">
        ✅ Aprovar
      </button>
      <button 
        class="btn btn-outline"
        onclick="fecharModalDirecaoArte()">
        ← Voltar
      </button>
    </footer>
  </div>
</div>
```

#### 3.2 CSS para Modal Corrigido

```css
/* Em assets/css/06-error-modal.css OU novo arquivo */

#modal-direcao-arte {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all var(--t-normal);
}

#modal-direcao-arte.visible {
  opacity: 1;
  visibility: visible;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.modal-content {
  position: relative;
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  width: 90vw;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1001;
}

.modal-content.modal-lg {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-default);
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  transition: color var(--t-fast);
}

.btn-close:hover {
  color: var(--text-primary);
}

/* ABAS DO MODAL */
.modal-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-default);
  overflow-x: auto;
  flex-shrink: 0;
}

.tab-btn {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--t-fast);
  white-space: nowrap;
}

.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.tab-btn:hover {
  color: var(--text-primary);
}

/* CONTEÚDO COM SCROLL */
.modal-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal-body.scrollable {
  /* Smooth scrolling */
  scroll-behavior: smooth;
}

/* Estilizar scrollbar */
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--bg-default);
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--border-default);
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.aba-modal {
  padding: 1.5rem;
  display: none;
}

.aba-modal.visible {
  display: block;
}

.aba-modal h4 {
  margin: 0 0 1rem 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-content-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content-area > div {
  padding: 1rem;
  background: var(--bg-default);
  border-radius: var(--r-sm);
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
}

.modal-content-area .section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

/* FOOTER */
.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-default);
  flex-shrink: 0;
}

.modal-footer .btn {
  flex: 1;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .modal-content,
  .modal-content.modal-lg {
    max-width: 95vw;
    max-height: 90vh;
  }

  .modal-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    font-size: 12px;
    padding: 0.4rem 0.8rem;
  }
}
```

#### 3.3 Funções JavaScript para Abas

```javascript
// Adicionar em assets/js/screens/art.js

function selecionarAbaModal(abaId) {
  // Remover classe 'active' de todas as abas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.querySelectorAll('.aba-modal').forEach(aba => {
    aba.classList.remove('visible');
  });

  // Ativar aba selecionada
  event.target?.classList.add('active');
  const abaElement = document.getElementById(`aba-${abaId}`);
  if (abaElement) {
    abaElement.classList.add('visible');
  }
}

function fecharModalDirecaoArte() {
  const modal = document.getElementById('modal-direcao-arte');
  if (modal) {
    modal.classList.remove('visible');
  }
}

function aprovarDirecaoArte() {
  appState.direcaoArteAprovada = true;
  appState.direcaoArteTimestamp = new Date().toISOString();

  showToast('✅ Direção de Arte aprovada!', 'success');
  fecharModalDirecaoArte();
}

export {
  selecionarAbaModal,
  fecharModalDirecaoArte,
  aprovarDirecaoArte
};
```

---

## 4. PROBLEMA 4: Modal de Alertas (Revisão) — Completo

### Contexto
Modal de alertas/validação na tela de Revisão tem:
- Design não alinhado
- Botões não funcionam
- Modal abre fora da área principal
- Sem fechar ao clicar "Entendido"

### Solução
Refatorar modal para padrão Adsgator com funcionalidade completa.

### Implementação

#### 4.1 Novo Modal de Alertas

```html
<!-- Modal: Alertas da Geração (CORRIGIDO) -->
<div id="modal-alertas-geracao" class="modal-alertas oculto">
  <div class="modal-alertas-overlay" onclick="fecharAlertas()"></div>
  
  <div class="modal-alertas-content">
    <header class="modal-alertas-header">
      <h3>⚠️ Pontos de Atenção</h3>
      <button 
        class="btn-close"
        onclick="fecharAlertas()">
        ×
      </button>
    </header>

    <div class="modal-alertas-body">
      <div id="alertas-container" class="alertas-list">
        <!-- Preenchido dinamicamente -->
      </div>
    </div>

    <footer class="modal-alertas-footer">
      <button 
        class="btn btn-primary"
        onclick="fecharAlertas()">
        ✅ Entendido
      </button>
      <button 
        class="btn btn-outline"
        onclick="abrirEditor()">
        ✏️ Editar Agora
      </button>
    </footer>
  </div>
</div>
```

#### 4.2 Função para Gerar Alertas

```javascript
// Em assets/js/screens/review.js

/**
 * Valida conteúdo e gera lista de alertas
 */
function gerarAlertas() {
  const alertas = [];

  // Validações
  if (!appState.estruturaCopy || appState.estruturaCopy.trim().length < 100) {
    alertas.push({
      tipo: 'warning',
      titulo: 'Copy muito curta',
      mensagem: 'A copy total tem menos de 100 caracteres. Considere expandir.',
      acao: 'editar-estrutura'
    });
  }

  if (appState.estruturaCopyBlocos?.some(b => !b.copy)) {
    alertas.push({
      tipo: 'warning',
      titulo: 'Bloco sem copy',
      mensagem: 'Um ou mais blocos não têm copy definida. Verifique antes de gerar.',
      acao: 'editar-estrutura'
    });
  }

  if (!appState.artDirection?.corPrincipal) {
    alertas.push({
      tipo: 'info',
      titulo: 'Cor principal não definida',
      mensagem: 'A direção de arte não tem cor principal. Será usado preto por padrão.',
      acao: 'editar-arte'
    });
  }

  if (!appState.artDirection?.referenciasVisuais || appState.artDirection.referenciasVisuais.length < 2) {
    alertas.push({
      tipo: 'info',
      titulo: 'Poucas referências',
      mensagem: 'Recomendamos pelo menos 2-3 referências visuais para melhor alinhamento.',
      acao: 'editar-arte'
    });
  }

  return alertas;
}

/**
 * Abre modal com alertas
 */
function mostrarAlertas() {
  const alertas = gerarAlertas();

  if (alertas.length === 0) {
    showToast('✅ Nenhum problema detectado!', 'success');
    return;
  }

  // Preencher modal
  const container = document.getElementById('alertas-container');
  container.innerHTML = alertas.map((alerta, idx) => `
    <div class="alerta-item alerta-${alerta.tipo}">
      <div class="alerta-icon">
        ${alerta.tipo === 'error' ? '❌' : alerta.tipo === 'warning' ? '⚠️' : 'ℹ️'}
      </div>
      <div class="alerta-content">
        <h4 class="alerta-titulo">${alerta.titulo}</h4>
        <p class="alerta-mensagem">${alerta.mensagem}</p>
      </div>
    </div>
  `).join('');

  // Salvar ações para botão "Editar"
  appState.alertasGeracaoAtivas = alertas;

  // Abrir modal
  const modal = document.getElementById('modal-alertas-geracao');
  if (modal) {
    modal.classList.add('visible');
  }
}

function fecharAlertas() {
  const modal = document.getElementById('modal-alertas-geracao');
  if (modal) {
    modal.classList.remove('visible');
  }
}

function abrirEditor() {
  // Ir para tela de edição apropriada
  const primeiroAlerta = appState.alertasGeracaoAtivas?.[0];
  
  if (primeiroAlerta?.acao === 'editar-estrutura') {
    window.LandingAI.irParaTela('estrutura-copy');
  } else if (primeiroAlerta?.acao === 'editar-arte') {
    window.LandingAI.irParaTela('arte');
  }

  fecharAlertas();
}

export {
  gerarAlertas,
  mostrarAlertas,
  fecharAlertas,
  abrirEditor
};
```

#### 4.3 CSS para Modal de Alertas

```css
/* Em assets/css/06-error-modal.css */

.modal-alertas {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all var(--t-normal);
}

.modal-alertas.visible {
  opacity: 1;
  visibility: visible;
}

.modal-alertas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.modal-alertas-content {
  position: relative;
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  width: 90vw;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.modal-alertas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-default);
  flex-shrink: 0;
}

.modal-alertas-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.modal-alertas-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.alertas-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alerta-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--r-md);
  border-left: 4px solid;
}

.alerta-error {
  background: #fee;
  border-left-color: #f44;
}

.alerta-warning {
  background: #ffe;
  border-left-color: #fa0;
}

.alerta-info {
  background: #eef;
  border-left-color: #4af;
}

.alerta-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.alerta-content {
  flex: 1;
}

.alerta-titulo {
  margin: 0 0 0.25rem 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.alerta-mensagem {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.modal-alertas-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-default);
  flex-shrink: 0;
}

.modal-alertas-footer .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .modal-alertas-content {
    max-width: 95vw;
    max-height: 90vh;
  }

  .modal-alertas-footer {
    flex-direction: column;
  }
}
```

---

## 5. CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Adicionar funcionalidades de Referências Visuais em `art.js`
- [ ] Adicionar HTML para exibição de referências
- [ ] Adicionar CSS para referências
- [ ] Implementar color picker bidirecional (HEX ↔ color picker)
- [ ] Refatorar modal de Direção de Arte com abas
- [ ] Implementar scrolling interno no modal
- [ ] Refatorar modal de Alertas com novo design
- [ ] Implementar funcionalidade de botões (Entendido, Editar)
- [ ] Testar todos os modais em mobile
- [ ] Testar navegação entre abas

---

## 6. TESTES

### Teste 1: Upload de Referência
- Clicar "+ Adicionar Arquivo"
- Selecionar imagem
- Verificar que aparece na lista com preview
- Testar remover

### Teste 2: Color Picker
- Digitar HEX #FF5733
- Verificar que square picker muda cor
- Usar color picker
- Verificar que input HEX atualiza

### Teste 3: Modal Direção de Arte
- Abrir modal
- Clicar em cada aba
- Verificar que conteúdo é visível
- Rolar para baixo (verificar scroll)
- Clicar "Aprovar"

### Teste 4: Modal Alertas
- Na revisão, clicar para gerar
- Verificar que alertas aparecem
- Clicar "Editar Agora"
- Verificar que leva para tela certa
- Clicar "Entendido"
- Verificar que modal fecha

