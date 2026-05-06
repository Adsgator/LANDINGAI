# LandingAI v3 — Documento de Implementação Delta

> **Para o Roo Code.**
> Este documento descreve APENAS o que muda, adiciona ou corrige em relação ao estado atual do projeto.
> Leia na íntegra antes de tocar em qualquer arquivo.
> O projeto já existe — não recriar do zero.

---

## ÍNDICE DE MUDANÇAS

1. [Correções de Bug Imediatas](#1-correções-de-bug-imediatas)
2. [Nomear Projeto — Card e Estado](#2-nomear-projeto--card-e-estado)
3. [Nova Tela: Estrutura da LP](#3-nova-tela-estrutura-da-lp)
4. [Sistema de Log de IA — Redesign Completo](#4-sistema-de-log-de-ia--redesign-completo)
5. [OpenRouter — Novo Provider](#5-openrouter--novo-provider)
6. [Correções nos Providers Existentes](#6-correções-nos-providers-existentes)
7. [FIELD_TOOLTIPS Completo](#7-field_tooltips-completo)
8. [REGRAS_FIXAS_ADSGATOR Expandido](#8-regras_fixas_adsgator-expandido)
9. [PROMPT_AUDITORIA Expandido](#9-prompt_auditoria-expandido)
10. [Fluxo de Navegação Atualizado](#10-fluxo-de-navegação-atualizado)
11. [Melhorias de UX e Polimento](#11-melhorias-de-ux-e-polimento)
12. [CSS Adicional Necessário](#12-css-adicional-necessário)

---

## 1. CORREÇÕES DE BUG IMEDIATAS

### 1.1 — Remover `buildStep8()` duplicado

**Problema:** existe um `buildStep8()` na linha ~809 e outro na linha ~2206. O segundo é o definitivo (mais completo). O primeiro deve ser completamente removido.

**Ação:** deletar o bloco entre as linhas ~809 e ~866 (do `buildStep8()` simplificado que termina antes do divider "Tom de Voz").

O `buildStep8()` correto começa com:
```javascript
buildStep8() {
    const B = this.B;
    return `
      <p class="form-section-title">Tom de Voz</p>
      <p class="form-section-title" style="font-size:12px;...
```

### 1.2 — Bug do `buildStep7()` — div não fechada

**Problema:** o bloco do Google Business dentro de `buildStep7()` está abrindo um `form-row` dentro da div do campo de depoimentos sem fechar o pai. O HTML gerado quebra o layout quando `google_business === 'sim'`.

**Substituir** o `buildStep7()` inteiro por:

```javascript
buildStep7() {
  const B = this.B;
  return `
    <p class="form-section-title">Diferenciais e Autoridade</p>
    <div class="field-group">
      ${this.fieldLabel('diferencial', 'O que diferencia o profissional?', true)}
      <textarea class="field-textarea tall" data-field="diferencial"
        placeholder="Método, experiência, certificações, resultados concretos. Seja específico — não 'atendimento humanizado', mas o que concretamente faz diferente.">${B.diferencial || ''}</textarea>
      <span class="field-hint">Este campo é a base do bloco de Diferenciais. Quanto mais específico, mais persuasivo.</span>
    </div>

    <div class="field-group">
      ${this.fieldLabel('frase_impacto', 'Frase de impacto — possível H1 da página', true)}
      <input type="text" class="field-input" data-field="frase_impacto"
        value="${B.frase_impacto || ''}"
        placeholder="Ex: Adestramento que resolve o problema, não esconde.">
      <span class="field-hint">Deve espelhar a dor de busca do público, não o nome técnico do serviço.</span>
    </div>

    <div class="field-group">
      ${this.fieldLabel('historia', 'História ou origem do negócio', false, true)}
      <textarea class="field-textarea" data-field="historia"
        placeholder="Por que esse profissional faz o que faz. Se for genuína e diferente do padrão do nicho, a IA inclui um bloco de história.">${B.historia || ''}</textarea>
    </div>

    <div class="field-group">
      ${this.fieldLabel('casos_resultados', 'Cases e resultados concretos', false, true)}
      <textarea class="field-textarea" data-field="casos_resultados"
        placeholder="Números, comparações antes/depois, projetos específicos.
Ex: 120 cães atendidos nos últimos 2 anos. 97% dos tutores relataram melhora em 30 dias.">${B.casos_resultados || ''}</textarea>
    </div>

    <div class="form-divider"></div>
    <p class="form-section-title">Prova Social</p>

    <div class="field-group">
      ${this.fieldLabel('depoimentos', 'Tem depoimentos reais?', true)}
      <div class="chip-group">
        <button class="chip ${B.depoimentos === 'sim' ? 'on' : ''}" data-field="depoimentos" data-chip="sim">Sim</button>
        <button class="chip ${B.depoimentos === 'nao' ? 'on' : ''}" data-field="depoimentos" data-chip="nao">Não</button>
      </div>
      <span class="field-hint">Nunca inventamos depoimentos. Se "Não", o bloco de prova social não é incluído.</span>
    </div>

    ${B.depoimentos === 'sim' ? `
      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('depoimentos_qtd', 'Quantidade disponível', false)}
          <input type="number" class="field-input" data-field="depoimentos_qtd"
            placeholder="Ex: 6" value="${B.depoimentos_qtd || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('depoimentos_formato', 'Formato', false)}
          <div class="chip-group">
            ${['Texto', 'Print WhatsApp', 'Print Google', 'Vídeo'].map(f => `
              <button class="chip ${(B.depoimentos_formato || []).includes(f) ? 'on' : ''}"
                data-field="depoimentos_formato" data-chip="${f}" data-multi="true">${f}</button>
            `).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    <div class="form-divider"></div>
    <p class="form-section-title">Google Business</p>

    <div class="field-group">
      ${this.fieldLabel('google_business', 'Tem perfil no Google Meu Negócio?', false)}
      <div class="chip-group">
        <button class="chip ${B.google_business === 'sim' ? 'on' : ''}" data-field="google_business" data-chip="sim">Sim</button>
        <button class="chip ${B.google_business === 'nao' ? 'on' : ''}" data-field="google_business" data-chip="nao">Não</button>
      </div>
    </div>

    ${B.google_business === 'sim' ? `
      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('google_nota', 'Nota média', false)}
          <input type="number" step="0.1" min="1" max="5" class="field-input"
            data-field="google_nota" placeholder="Ex: 4.9" value="${B.google_nota || ''}">
          <span class="field-hint">Mínimo 4.5 para incluir o bloco de reviews.</span>
        </div>
        <div class="field-group">
          ${this.fieldLabel('google_qtd', 'Número de avaliações', false)}
          <input type="number" class="field-input"
            data-field="google_qtd" placeholder="Ex: 127" value="${B.google_qtd || ''}">
          <span class="field-hint">Mínimo 10 para incluir o bloco.</span>
        </div>
      </div>
    ` : ''}
  `;
},
```

### 1.3 — `buildStepHTML` mapeamento incorreto

**Problema:** na linha ~3007 o mapeamento está errado. Step 2 chama `buildStep3()`, step 3 chama `buildStep4()`, step 4 e 5 chamam `buildStep5()`. Isso significa que `buildStep2()` (WhatsApp e redes) nunca é chamado.

**Substituir** o objeto `builders` dentro de `buildStepHTML` por:

```javascript
const builders = {
  1: () => this.buildStep1(),   // Identificação
  2: () => this.buildStep2(),   // Contato e conversão
  3: () => this.buildStep3(),   // Redes sociais e presença
  4: () => this.buildStep4(),   // Localização e modalidade
  5: () => this.buildStep5(),   // Serviços e preço
  6: () => this.buildStep6(),   // Público-alvo
  7: () => this.buildStep7(),   // Diferenciais e prova social
  8: () => this.buildStep8(),   // Tom de voz
};
```

E atualizar `STEPS` no topo para corresponder:

```javascript
const STEPS = [
  { id: 1, label: 'Identificação',      sub: 'Nome, nicho e tipo de projeto',   icon: 'user' },
  { id: 2, label: 'Contato e CTA',      sub: 'WhatsApp, e-mail e conversão',    icon: 'phone' },
  { id: 3, label: 'Presença Digital',   sub: 'Redes sociais e plataformas',     icon: 'globe' },
  { id: 4, label: 'Atendimento',        sub: 'Modalidade, endereço, cidades',   icon: 'map-pin' },
  { id: 5, label: 'Serviço / Produto',  sub: 'O que é vendido e como funciona', icon: 'briefcase' },
  { id: 6, label: 'Público-Alvo',       sub: 'Perfil, dores e resultado',       icon: 'target' },
  { id: 7, label: 'Autoridade',         sub: 'Diferenciais e prova social',     icon: 'star' },
  { id: 8, label: 'Tom e Identidade',   sub: 'Estilo, vocabulário e restrições',icon: 'palette' },
];
```

---

## 2. NOMEAR PROJETO — CARD E ESTADO

### 2.1 — Campo de nome no topo da sidebar

Quando o card do projeto ativo é clicado no modal de projetos, o nome deve ser editável. Além disso, ao criar novo projeto, exibir um input inline para o nome antes de navegar.

**No `createProject()`** — adicionar parâmetro e exibir modal de nome:

```javascript
createProject() {
  const id = 'p_' + Date.now();
  this.state.projects[id] = {
    id,
    name: 'Novo Projeto',
    slug: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    visitedSteps: [],
    briefing: {
      integracoes: ['whatsapp'],
      depoimentos_formato: [],
      arte_referencias_pessoais: [],
      arte_referencias_nicho: [],
    },
  };
  this.state.activeId = id;
  this.state.screen = 'intake';
  this.autosave();
  this.renderAll();
  // Abrir modal de nome imediatamente após criar
  setTimeout(() => this.openRenameModal(), 100);
},
```

**Adicionar método `openRenameModal()`:**

```javascript
openRenameModal() {
  const p = this.P;
  if (!p) return;
  const overlay = document.getElementById('modal-rename');
  document.getElementById('rename-input').value = p.name || '';
  this.openModal('modal-rename');
  setTimeout(() => document.getElementById('rename-input')?.select(), 100);
},

saveProjectName() {
  const val = document.getElementById('rename-input')?.value?.trim();
  if (!val) return;
  this.P.name = val;
  // Derivar slug do nome se ainda não tiver slug no briefing
  if (!this.B.slug) {
    this.P.briefing.slug = val
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  this.P.updatedAt = new Date().toISOString();
  this.autosave();
  this.updateSidebar();
  this.closeModal('modal-rename');
  this.showToast(`Projeto "${val}" salvo.`, 'success');
},
```

**Adicionar HTML do modal** no `index.html`, antes do `<!-- Toast -->`:

```html
<!-- Modal Renomear Projeto -->
<div class="modal-overlay" id="modal-rename">
  <div class="modal modal--sm">
    <div class="modal-header">
      <i data-lucide="edit-3" style="width:18px;height:18px;color:var(--accent2);"></i>
      <span class="modal-title">Nome do Projeto</span>
    </div>
    <div class="modal-body" style="padding-top:8px">
      <div class="field-group">
        <label class="field-label">Nome do cliente ou projeto</label>
        <input type="text" class="field-input" id="rename-input"
          placeholder="Ex: Beatriz Mattos — Adestramento"
          onkeydown="if(event.key==='Enter') App.saveProjectName()">
        <span class="field-hint">Aparece no card da sidebar e no nome dos arquivos gerados.</span>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="App.closeModal('modal-rename')">Cancelar</button>
      <button class="btn-primary" onclick="App.saveProjectName()">
        <i data-lucide="check" style="width:15px;height:15px"></i> Salvar
      </button>
    </div>
  </div>
</div>
```

**No card do projeto ativo na sidebar** (HTML estático no `index.html`), adicionar botão de renomear ao lado do nome:

```html
<button class="project-card" id="btn-open-projects"
  onclick="App.renderProjectsList(); App.openModal('modal-projects');" style="width:100%;">
  <i data-lucide="folder" class="project-card-icon"></i>
  <div class="project-card-info">
    <span class="project-card-name" id="project-name">Novo Projeto</span>
    <span class="project-card-segment" id="project-segment">—</span>
  </div>
  <button class="project-rename-btn" title="Renomear"
    onclick="event.stopPropagation(); App.openRenameModal();"
    style="margin-left:auto;background:none;border:none;cursor:pointer;color:var(--text-tertiary);padding:4px;border-radius:4px;line-height:0">
    <i data-lucide="edit-3" style="width:13px;height:13px"></i>
  </button>
</button>
```

**No `renderProjectsList()`** — cada item da lista deve mostrar botão de renomear:

Dentro de cada `.project-list-item`, adicionar:
```html
<button title="Renomear" onclick="App.state.activeId='${p.id}'; App.openRenameModal();"
  style="background:none;border:none;cursor:pointer;color:var(--text-tertiary);padding:6px">
  <i data-lucide="edit-3" style="width:14px;height:14px"></i>
</button>
```

---

## 3. NOVA TELA: ESTRUTURA DA LP

### 3.1 — Visão geral

Nova tela chamada `'estrutura'` inserida **entre os steps (screen='step') e a direção de arte (screen='art')**. 

Fluxo atualizado:
```
intake → step 1–8 → [ESTRUTURA] → art → review
```

Nessa tela:
- A IA gera a **estrutura narrativa da landing page**: quais blocos aparecem, em que ordem, com que objetivo, e um wireframe ASCII/textual de cada bloco
- O usuário pode **editar a estrutura** antes de aprovar
- Ao aprovar, o resultado fica em `B.estrutura_aprovada` e alimenta o DOC-1

### 3.2 — Atualizar fluxo de navegação

**Em `goNext()`:**
```javascript
goNext() {
  const { screen, currentStep } = this.state;
  if (screen === 'intake')     { this.goToStep(1); }
  else if (screen === 'step')  {
    if (currentStep < STEPS.length) this.goToStep(currentStep + 1);
    else this.goToScreen('estrutura'); // ← MUDANÇA: vai para estrutura antes da arte
  }
  else if (screen === 'estrutura') { this.goToScreen('art'); }
  else if (screen === 'art')       { this.goToScreen('review'); }
},
```

**Em `goPrev()`:**
```javascript
goPrev() {
  const { screen, currentStep } = this.state;
  if (screen === 'review')     { this.goToScreen('art'); }
  else if (screen === 'art')   { this.goToScreen('estrutura'); } // ← MUDANÇA
  else if (screen === 'estrutura') { this.goToStep(STEPS.length); }
  else if (screen === 'step')  {
    if (currentStep > 1) this.goToStep(currentStep - 1);
    else this.goToScreen('intake');
  }
},
```

**Em `renderScreen()`** — adicionar case:
```javascript
case 'estrutura':
  html = this.buildEstruturaHTML();
  break;
```

**Em `updateTopbar()`** — adicionar case para título:
```javascript
case 'estrutura':
  title = 'Estrutura da Landing Page';
  sub   = 'Blocos, ordem e narrativa — aprovado antes do design';
  pct   = 88;
  break;
```

### 3.3 — Adicionar 'estrutura' ao nav da sidebar

Em `renderStepsNav()`, após o step 8 e antes de 'art', adicionar um item de nav especial:

```javascript
// Após os 8 steps no nav
const screenItems = [
  {
    id: 'estrutura',
    label: 'Estrutura da LP',
    icon: 'layout',
    special: true,
    done: !!this.B.estrutura_aprovada,
    screen: 'estrutura',
  },
  {
    id: 'art',
    label: 'Direção de Arte',
    icon: 'palette',
    special: true,
    done: !!this.B.arte_ficha_aprovada,
    screen: 'art',
  },
  {
    id: 'review',
    label: 'Revisão e Geração',
    icon: 'zap',
    special: true,
    screen: 'review',
  },
];
```

### 3.4 — `buildEstruturaHTML()` — implementação completa

```javascript
buildEstruturaHTML() {
  const B = this.B;
  const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
  const aprovada = B.estrutura_aprovada;
  const rascunho = B.estrutura_rascunho || '';

  return `
    <div class="estrutura-screen animate-in">

      <div class="estrutura-header">
        <div class="estrutura-title">Estrutura da Landing Page</div>
        <div class="estrutura-desc">
          A IA analisa o briefing preenchido e propõe quais blocos compõem a página,
          em que ordem e com que objetivo narrativo. Você edita, ajusta e aprova antes
          de qualquer decisão de design.
        </div>
      </div>

      ${aprovada ? `
        <div class="aprovado-banner">
          <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--accent)"></i>
          <span>Estrutura aprovada — alimentando o DOC-1 e a direção de arte.</span>
          <button class="btn-ghost btn-sm" style="margin-left:auto"
            onclick="App.setField('estrutura_aprovada',''); App.setField('estrutura_rascunho',''); App.renderScreen();">
            Refazer
          </button>
        </div>
      ` : ''}

      <!-- Wireframe / Editor -->
      <div class="estrutura-editor-wrap">
        <div class="estrutura-editor-header">
          <span style="font-family:var(--font-display);font-size:13px;font-weight:700">
            ${rascunho ? 'Estrutura Proposta' : 'Nenhuma estrutura gerada ainda'}
          </span>
          <div style="display:flex;gap:8px">
            ${rascunho ? `
              <button class="btn-ghost btn-sm" onclick="App.runEstruturaAnalysis()">
                <i data-lucide="refresh-cw" style="width:13px;height:13px"></i> Regerar
              </button>
              ${!aprovada ? `
                <button class="btn-primary btn-sm" onclick="App.aprovarEstrutura()">
                  <i data-lucide="check" style="width:13px;height:13px"></i> Aprovar Estrutura
                </button>
              ` : ''}
            ` : ''}
          </div>
        </div>

        ${rascunho ? `
          <div class="estrutura-editor">
            <div class="estrutura-hint">
              <i data-lucide="info" style="width:13px;height:13px"></i>
              Edite livremente antes de aprovar. Cada bloco tem objetivo, copy sugerida e wireframe.
            </div>
            <textarea class="field-textarea estrutura-textarea" id="estrutura-editor-area"
              oninput="App.setField('estrutura_rascunho', this.value)">${rascunho}</textarea>
          </div>
        ` : `
          <div class="estrutura-empty">
            <i data-lucide="layout" style="width:32px;height:32px;color:var(--text-disabled)"></i>
            <p>Clique em "Gerar Estrutura" para a IA propor os blocos da página.</p>
          </div>
        `}
      </div>

      <!-- Wireframe Visual -->
      ${rascunho ? `
        <div class="wireframe-wrap">
          <div class="wireframe-title">
            <i data-lucide="monitor" style="width:14px;height:14px"></i>
            Wireframe Simplificado
          </div>
          <div class="wireframe-frame" id="wireframe-frame">
            <!-- Gerado por renderWireframe() após análise -->
            ${B.estrutura_wireframe || '<div class="wireframe-placeholder">Gere a estrutura para ver o wireframe</div>'}
          </div>
        </div>
      ` : ''}

      <!-- Ações -->
      <div class="estrutura-actions">
        ${!rascunho ? `
          <button class="btn-primary" onclick="App.runEstruturaAnalysis()" ${!hasKey ? 'disabled' : ''}>
            <i data-lucide="sparkles" style="width:15px;height:15px"></i>
            Gerar Estrutura com IA
          </button>
          <button class="btn-ghost" onclick="App.abrirEstruturaManual()">
            <i data-lucide="edit" style="width:14px;height:14px"></i>
            Definir manualmente
          </button>
        ` : ''}
        ${!hasKey ? `<span class="no-key-warn">
          <i data-lucide="alert-triangle" style="width:13px;height:13px"></i>
          Configure uma API Key para usar a geração automática
        </span>` : ''}
      </div>

    </div>
  `;
},
```

### 3.5 — `runEstruturaAnalysis()` — lógica de chamada

```javascript
async runEstruturaAnalysis() {
  const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
  if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

  this.openAILog('Gerando Estrutura da Landing Page', [
    { id: 1, icon: 'file-text',   label: 'Lendo briefing completo...' },
    { id: 2, icon: 'layout',      label: 'Definindo blocos e ordem narrativa...' },
    { id: 3, icon: 'sparkles',    label: 'Gerando copy de cada bloco...' },
    { id: 4, icon: 'monitor',     label: 'Gerando wireframe visual...' },
    { id: 5, icon: 'check-circle',label: 'Finalizando estrutura...' },
  ]);

  try {
    this.aiLogStep(1);
    const doc1 = this.buildDoc1();
    await this.aiLogDelay(300);

    this.aiLogStep(2);
    const prompt = this.buildEstruturaPrompt(doc1);
    await this.aiLogDelay(200);

    this.aiLogStep(3);
    const resultado = await this.callAI(prompt);

    this.aiLogStep(4);
    // Gerar wireframe HTML a partir da estrutura
    const wireframeHTML = this.gerarWireframeHTML(resultado);
    await this.aiLogDelay(200);

    this.aiLogStep(5);
    this.setField('estrutura_rascunho', resultado);
    this.setField('estrutura_wireframe', wireframeHTML);
    await this.aiLogDelay(400);

    this.closeAILog();
    this.renderScreen();
    this.showToast('Estrutura gerada! Revise e aprove.', 'success');
  } catch (err) {
    this.closeAILog();
    this.showGenError(err, []);
  }
},

buildEstruturaPrompt(doc1) {
  return `
Você é um Copywriter Sênior e Arquiteto de Conversão especializado em landing pages para prestadores de serviço locais.

Leia o briefing abaixo e defina a estrutura narrativa completa da landing page.

REGRAS:
- Só inclua blocos com dados reais disponíveis no briefing. Nunca inclua bloco de depoimentos sem depoimentos reais, avaliações Google sem perfil confirmado, mapa sem endereço autorizado.
- A estrutura deve seguir uma narrativa: cada bloco prepara o próximo.
- A H1 do Hero deve espelhar a dor de busca — não o nome do serviço.
- Copy sempre em primeira pessoa ("Eu atendo...", nunca "Maria atende...").
- CTAs específicos — nunca "Saiba mais" ou "Entre em contato".

BLOCOS DISPONÍVEIS (use apenas os que fazem sentido):
Hero | Serviço Principal | Como Funciona | Diferenciais | Planos e Preços | Prova Social — Depoimentos | Avaliações Google | Feed Instagram | FAQ | Localização + Mapa | CTA Final | Rodapé | Cabeçalho

Para cada bloco selecionado, entregue EXATAMENTE neste formato:

---
### BLOCO N: [Nome do Bloco]
**Objetivo narrativo:** [O que este bloco faz psicologicamente e como se conecta com o anterior]
**Copy sugerida:**
- Título: "[texto]"
- Subtítulo: "[texto]"
- CTA (se aplicável): "[texto do botão]"
**Wireframe:**
[Descreva o layout em texto/ASCII: o que fica à esquerda, à direita, o que ocupa full-width, onde vai a foto]
**Condicional:** [Por que este bloco foi incluído — qual dado do briefing justifica]
---

Termine com:
### SEQUÊNCIA FINAL
[Lista numerada dos blocos na ordem]

BRIEFING:
${doc1.substring(0, 8000)}
`;
},

aprovarEstrutura() {
  const rascunho = this.B.estrutura_rascunho;
  if (!rascunho?.trim()) {
    this.showToast('Gere a estrutura antes de aprovar.', 'warning');
    return;
  }
  this.setField('estrutura_aprovada', rascunho);
  this.showToast('Estrutura aprovada! Avance para Direção de Arte.', 'success');
  this.renderScreen();
},

abrirEstruturaManual() {
  const template = `### BLOCO 1: Cabeçalho
**Objetivo narrativo:** Âncora de marca e CTA sempre visível
**Copy sugerida:**
- Logo: [Nome da marca]
- CTA: "[Falar no WhatsApp]"

---
### BLOCO 2: Hero — Impacto Inicial
**Objetivo narrativo:** Capturar atenção e justificar o clique do anúncio em 3 segundos
**Copy sugerida:**
- Título: "[H1 focada na dor de busca]"
- Subtítulo: "[Ampliar o benefício]"
- CTA: "[Quero resolver isso agora]"

---
### BLOCO 3: O Serviço
...

### SEQUÊNCIA FINAL
1. Cabeçalho
2. Hero
3. O Serviço
`;
  this.setField('estrutura_rascunho', template);
  this.renderScreen();
},
```

### 3.6 — `gerarWireframeHTML()` — wireframe SVG inline

Este método recebe o texto da estrutura e gera um wireframe HTML visual simples, estilo lofi/cinza, com caixas representando cada bloco.

```javascript
gerarWireframeHTML(estruturaText) {
  // Extrair nomes dos blocos
  const blocos = [];
  const regex = /### BLOCO \d+: (.+)/g;
  let match;
  while ((match = regex.exec(estruturaText)) !== null) {
    blocos.push(match[1].trim());
  }
  if (blocos.length === 0) return '<div class="wireframe-placeholder">Estrutura não reconhecida</div>';

  const alturas = {
    'Cabeçalho': 48, 'Hero': 200, 'Como Funciona': 160,
    'Diferenciais': 140, 'Planos e Preços': 180, 'Prova Social': 140,
    'Avaliações Google': 100, 'Feed Instagram': 120, 'FAQ': 140,
    'Localização': 160, 'CTA Final': 100, 'Rodapé': 80,
  };

  const blocoHTMLs = blocos.map((nome, i) => {
    const h = Object.entries(alturas).find(([k]) => nome.includes(k))?.[1] || 120;
    const isHero = nome.includes('Hero');
    const isCTA  = nome.includes('CTA');
    return `
      <div class="wf-block ${isHero ? 'wf-block--hero' : ''} ${isCTA ? 'wf-block--cta' : ''}"
           style="height:${h}px">
        <div class="wf-block-label">${i + 1}. ${nome}</div>
        ${isHero ? `
          <div class="wf-hero-inner">
            <div class="wf-text-lines"><div class="wf-line wf-line--h1"></div><div class="wf-line wf-line--sub"></div></div>
            <div class="wf-btn-placeholder"></div>
          </div>` : ''}
      </div>`;
  }).join('');

  return `<div class="wireframe-mobile">${blocoHTMLs}</div>`;
},
```

---

## 4. SISTEMA DE LOG DE IA — REDESIGN COMPLETO

### 4.1 — Visão geral

Todos os momentos em que a IA está trabalhando devem usar um **log unificado e detalhado** com ícones, labels, timestamps por etapa, e mensagens de contexto em tempo real. Atualmente existe uma implementação no modal `modal-gen` mas está limitada ao `generateDocImpl()`. 

Criar um sistema centralizado que qualquer operação de IA usa.

### 4.2 — Estado global de log

```javascript
// Adicionar ao state:
aiLog: {
  title:   '',
  steps:   [],        // [{ id, icon, label }]
  active:  null,      // id do step atual
  done:    [],        // ids concluídos
  errors:  [],        // ids com erro
  startedAt: null,
  stepTimes: {},      // { stepId: timestamp }
  liveMsg: '',        // mensagem em tempo real (streaming fake)
},
```

### 4.3 — Métodos do sistema de log

```javascript
openAILog(title, steps) {
  this.state.aiLog = {
    title,
    steps,
    active:    null,
    done:      [],
    errors:    [],
    startedAt: Date.now(),
    stepTimes: {},
    liveMsg:   '',
  };
  this._renderAILog();
  this.openModal('modal-gen');
},

aiLogStep(id, liveMsg = '') {
  const log = this.state.aiLog;
  // Marcar anterior como done
  if (log.active !== null) {
    log.done.push(log.active);
    log.stepTimes[log.active + '_end'] = Date.now();
  }
  log.active  = id;
  log.liveMsg = liveMsg;
  log.stepTimes[id + '_start'] = Date.now();
  this._renderAILog();
},

aiLogError(id, msg = '') {
  const log = this.state.aiLog;
  log.errors.push(id);
  log.active = null;
  log.liveMsg = msg;
  this._renderAILog();
},

aiLogDone() {
  const log = this.state.aiLog;
  if (log.active !== null) log.done.push(log.active);
  log.active = null;
  this._renderAILog();
},

aiLogDelay(ms) {
  return new Promise(r => setTimeout(r, ms));
},

closeAILog() {
  this.closeModal('modal-gen');
},

_renderAILog() {
  const log = this.state.aiLog;
  const total = log.steps.length;
  const done  = log.done.length;
  const pct   = Math.round((done / total) * 100);
  const elapsed = log.startedAt ? ((Date.now() - log.startedAt) / 1000).toFixed(1) : '0.0';

  const stepRows = log.steps.map(s => {
    const isActive = log.active === s.id;
    const isDone   = log.done.includes(s.id);
    const isError  = log.errors.includes(s.id);

    let stepElapsed = '';
    if (isDone && log.stepTimes[s.id + '_start'] && log.stepTimes[s.id + '_end']) {
      const ms = log.stepTimes[s.id + '_end'] - log.stepTimes[s.id + '_start'];
      stepElapsed = `<span class="log-step-time">${(ms/1000).toFixed(1)}s</span>`;
    }

    const iconName = isActive ? 'loader-2'
                   : isDone   ? 'check-circle'
                   : isError  ? 'x-circle'
                   : 'circle';

    const stateClass = isActive ? 'log-step--active'
                     : isDone   ? 'log-step--done'
                     : isError  ? 'log-step--error'
                     : 'log-step--wait';

    return `
      <div class="log-step ${stateClass}">
        <i data-lucide="${iconName}" class="log-step-icon ${isActive ? 'spin' : ''}"></i>
        <span class="log-step-label">${s.label}</span>
        ${stepElapsed}
      </div>`;
  }).join('');

  const liveSection = log.liveMsg ? `
    <div class="log-live">
      <span class="log-live-dot"></span>
      <span class="log-live-msg">${log.liveMsg}</span>
    </div>` : '';

  const model = AI_MODELS[this.state.selectedModel];

  document.getElementById('modal-gen').innerHTML = `
    <div class="modal modal--sm ai-log-modal">
      <div class="modal-header" style="border-bottom:none;padding-bottom:8px">
        <div class="ai-log-header">
          <div class="ai-log-title">
            <i data-lucide="cpu" style="width:16px;height:16px;color:var(--accent2)"></i>
            ${log.title}
          </div>
          <div class="ai-log-meta">
            <span class="ai-log-model">${model?.label || '—'}</span>
            <span class="ai-log-elapsed">${elapsed}s</span>
          </div>
        </div>
      </div>
      <div class="modal-body ai-log-body">
        <div class="log-progress-wrap">
          <div class="log-progress-bar">
            <div class="log-progress-fill" style="width:${pct}%"></div>
          </div>
          <span class="log-progress-pct">${pct}%</span>
        </div>
        <div class="log-steps-list">
          ${stepRows}
        </div>
        ${liveSection}
        <p class="log-hint">
          <i data-lucide="info" style="width:12px;height:12px"></i>
          Isso pode levar 30–90 segundos dependendo do modelo.
        </p>
      </div>
    </div>
  `;
  lucide.createIcons({ nodes: [document.getElementById('modal-gen')] });
},
```

### 4.4 — Atualizar `generateDocImpl()` para usar o novo sistema

**Substituir** o trecho do `renderSteps` / `const done = []` / try-catch por:

```javascript
async generateDocImpl() {
  if (this.state.isGenerating) return;
  this.state.isGenerating = true;
  this.state.lastError = null;

  this.openAILog('Gerando Ficha de Implementação', [
    { id: 1, icon: 'file-text',    label: 'Compilando DOC-1 e estrutura...' },
    { id: 2, icon: 'code',         label: 'Montando prompt de implementação...' },
    { id: 3, icon: 'zap',          label: `Chamando ${AI_MODELS[this.state.selectedModel]?.label}...` },
    { id: 4, icon: 'file-check',   label: 'Validando resposta...' },
    { id: 5, icon: 'eye',          label: 'Gerando preview visual...' },
    { id: 6, icon: 'download',     label: 'Preparando download...' },
    { id: 7, icon: 'check-circle', label: 'Concluído!' },
  ]);

  const done = [];
  try {
    this.aiLogStep(1, 'Lendo briefing e estrutura aprovada...');
    const doc1 = this.buildDoc1();
    this.state.lastDoc1 = doc1;
    await this.aiLogDelay(350);
    done.push(1);

    this.aiLogStep(2, 'Aplicando regras Adsgator e prompt de auditoria...');
    const prompt = this.buildDocImplPrompt(doc1);
    await this.aiLogDelay(250);
    done.push(2);

    this.aiLogStep(3, 'Aguardando resposta da IA — pode demorar 30–90s...');
    const t0 = Date.now();
    const docImpl = await this.callAI(prompt);
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    done.push(3);

    this.aiLogStep(4, `Resposta recebida em ${elapsed}s — verificando qualidade...`);
    if (!docImpl || docImpl.trim().length < 200)
      throw new Error('Resposta muito curta — tente um modelo com mais tokens.');
    this.state.lastDocImpl = docImpl;
    await this.aiLogDelay(200);
    done.push(4);

    this.aiLogStep(5, 'Gerando mockup HTML do Hero e seções principais...');
    await this.generatePreview(docImpl);
    done.push(5);

    this.aiLogStep(6, 'Salvando versão e preparando download...');
    this.saveVersion(doc1, docImpl, this.state.selectedModel);
    const slug = this.B.slug || 'projeto';
    this.downloadText(docImpl, `doc-impl-${slug}.md`, 'text/markdown');
    await this.aiLogDelay(300);
    done.push(6);

    this.aiLogStep(7);
    this.aiLogDone();
    this.showNotification('LandingAI', `Ficha gerada! ${this.B.nome_cliente || 'Projeto'}`);

    setTimeout(() => {
      this.closeAILog();
      document.getElementById('preview-project-name').textContent = this.B.nome_cliente || '';
      document.getElementById('btn-download-docimpl').onclick = () => {
        this.downloadText(this.state.lastDocImpl, `doc-impl-${slug}.md`, 'text/markdown');
      };
      this.openModal('modal-preview');
    }, 900);

  } catch (err) {
    this.aiLogError(done.length + 1, err.message);
    await this.aiLogDelay(800);
    this.closeAILog();
    this.showGenError(err, done);
    console.error('[LandingAI] generateDocImpl erro:', err);
  } finally {
    this.state.isGenerating = false;
  }
},
```

### 4.5 — Atualizar `runIntakeAnalysis()` para usar o novo sistema

**Substituir** a lógica do modal de progresso por:

```javascript
async runIntakeAnalysis() {
  const text  = this.B.briefing_bruto;
  const files = this.state.intakeFiles || [];
  if (!text?.trim() && files.length === 0) {
    this.showToast('Cole o briefing ou anexe arquivos antes de analisar.', 'warning');
    return;
  }

  this.openAILog('Análise Inteligente do Briefing', [
    { id: 1, icon: 'file-text',    label: 'Lendo material do cliente...' },
    { id: 2, icon: 'brain',        label: 'Extraindo dados do briefing...' },
    { id: 3, icon: 'user',         label: 'Identificando cliente e negócio...' },
    { id: 4, icon: 'target',       label: 'Mapeando público e dores...' },
    { id: 5, icon: 'check-circle', label: 'Preenchendo steps automaticamente...' },
  ]);

  try {
    this.aiLogStep(1, 'Processando texto e arquivos...');
    await this.aiLogDelay(300);

    this.aiLogStep(2, 'Enviando para ' + AI_MODELS[this.state.selectedModel]?.label + '...');
    const prompt = this.buildExtractionPrompt(text || '');
    const resultado = await this.callAI(prompt);

    this.aiLogStep(3, 'Interpretando identidade do negócio...');
    let extracted = {};
    try {
      const clean = resultado.replace(/```json|```/g, '').trim();
      extracted = JSON.parse(clean);
    } catch {
      // Se não for JSON, tentar extração simples por linha
      extracted = this.parseExtractionText(resultado);
    }
    await this.aiLogDelay(200);

    this.aiLogStep(4, 'Identificando público-alvo e dores principais...');
    await this.aiLogDelay(300);

    this.aiLogStep(5, 'Populando ' + Object.keys(extracted).length + ' campos...');
    // Aplicar campos extraídos ao briefing sem sobrescrever os que já existem
    for (const [k, v] of Object.entries(extracted)) {
      if (v && !this.B[k]) this.setField(k, v);
    }
    await this.aiLogDelay(400);

    this.aiLogDone();
    await this.aiLogDelay(500);
    this.closeAILog();
    this.showToast('Steps preenchidos! Revise campo a campo.', 'success');
    this.goToStep(1);

  } catch (err) {
    this.closeAILog();
    this.showToast('Erro na análise: ' + err.message, 'error');
  }
},
```

### 4.6 — Atualizar `runArtAnalysis()` para usar o novo sistema

```javascript
async runArtAnalysis() {
  this.openAILog('Analisando Direção de Arte', [
    { id: 1, icon: 'image',        label: 'Lendo ativos e referências da marca...' },
    { id: 2, icon: 'palette',      label: 'Interpretando referências visuais...' },
    { id: 3, icon: 'type',         label: 'Definindo tipografia e paleta...' },
    { id: 4, icon: 'layout',       label: 'Estruturando diretrizes de layout...' },
    { id: 5, icon: 'check-circle', label: 'Finalizando ficha de arte...' },
  ]);

  try {
    this.aiLogStep(1, 'Processando referências pessoais e do nicho...');
    await this.aiLogDelay(300);

    this.aiLogStep(2, 'Analisando com ' + AI_MODELS[this.state.selectedModel]?.label + '...');
    const prompt = this.buildArtPrompt();
    const resultado = await this.callAI(prompt);

    this.aiLogStep(3, 'Processando paleta de cores e tipografia...');
    let ficha = {};
    try {
      const clean = resultado.replace(/```json|```/g, '').trim();
      ficha = JSON.parse(clean);
    } catch {
      ficha = { raw: resultado };
    }
    await this.aiLogDelay(300);

    this.aiLogStep(4, 'Compilando diretrizes de layout e animação...');
    await this.aiLogDelay(200);

    this.aiLogStep(5, 'Ficha de arte pronta para revisão...');
    this.setField('arte_ficha_json', JSON.stringify(ficha));
    await this.aiLogDelay(400);

    this.aiLogDone();
    await this.aiLogDelay(500);
    this.closeAILog();

    // Abrir modal de resultado da arte
    this.renderArtResultModal(ficha);
    this.openModal('modal-art-result');

  } catch (err) {
    this.closeAILog();
    this.showToast('Erro na análise de arte: ' + err.message, 'error');
  }
},
```

---

## 5. OPENROUTER — NOVO PROVIDER

### 5.1 — Adicionar ao `AI_MODELS`

```javascript
// Adicionar ao objeto AI_MODELS:
'openrouter-sonnet': {
  id: 'openrouter-sonnet', label: 'Claude Sonnet (OpenRouter)',
  provider: 'openrouter', group: 'OpenRouter', tier: 'paid',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'anthropic/claude-sonnet-4-5',
  maxTokens: 16000, temp: 0.65,
},
'openrouter-gemini-pro': {
  id: 'openrouter-gemini-pro', label: 'Gemini 2.5 Pro (OpenRouter)',
  provider: 'openrouter', group: 'OpenRouter', tier: 'paid',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'google/gemini-2.5-pro',
  maxTokens: 16000, temp: 0.65,
},
'openrouter-deepseek': {
  id: 'openrouter-deepseek', label: 'DeepSeek R2 (OpenRouter)',
  provider: 'openrouter', group: 'OpenRouter', tier: 'paid',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'deepseek/deepseek-r2',
  maxTokens: 16000, temp: 0.65,
},
'openrouter-llama': {
  id: 'openrouter-llama', label: 'Llama 4 Maverick (OpenRouter)',
  provider: 'openrouter', group: 'OpenRouter', tier: 'free',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'meta-llama/llama-4-maverick',
  maxTokens: 12000, temp: 0.65,
},
```

### 5.2 — Adicionar `_callOpenRouter()` ao `callAI()`

**Em `callAI()`**, adicionar case:
```javascript
case 'openrouter': return this._callOpenRouter(prompt, model, apiKey);
```

**Novo método:**
```javascript
async _callOpenRouter(prompt, model, apiKey) {
  const response = await fetch(model.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/json',
      'Authorization':  `Bearer ${apiKey}`,
      'HTTP-Referer':   'https://adsgator.com.br',
      'X-Title':        'LandingAI — Adsgator',
    },
    body: JSON.stringify({
      model:       model.model,
      max_tokens:  model.maxTokens,
      temperature: model.temp,
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err.error?.message || `HTTP ${response.status}`;
    throw new Error(`OpenRouter: ${msg}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Resposta vazia do OpenRouter.');
  return text;
},
```

### 5.3 — Campo de API Key para OpenRouter no modal de API

No `renderApiModal()`, adicionar campo:

```javascript
// Dentro do HTML do modal de API, após o campo Mistral:
<div class="field-group" style="margin-top:16px">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
    <label class="field-label" style="margin:0">OpenRouter API Key</label>
    <span class="badge-new">Gateway Universal</span>
  </div>
  <input type="password" class="field-input" id="key-openrouter"
    value="${this.state.apiKeys.openrouter || ''}"
    placeholder="sk-or-...">
  <span class="field-hint">
    Acessa qualquer modelo via uma única key.
    <a href="https://openrouter.ai/keys" target="_blank" rel="noopener"
       style="color:var(--accent2)">openrouter.ai/keys</a>
  </span>
</div>
```

Em `saveApiConfig()`:
```javascript
this.state.apiKeys.openrouter = document.getElementById('key-openrouter')?.value?.trim() || '';
```

---

## 6. CORREÇÕES NOS PROVIDERS EXISTENTES

### 6.1 — Claude: model ID correto

**Problema:** `this.state.selectedModel` é passado direto como `model` no body do Claude, mas os IDs do `AI_MODELS` são aliases internos (`'claude-sonnet-4'`), não o ID real da API (`'claude-sonnet-4-5-20251001'`).

**Correção em `_callClaude()`:**

```javascript
async _callClaude(prompt, model, apiKey) {
  // Mapa de IDs internos → IDs reais da API Anthropic
  const MODEL_IDS = {
    'claude-sonnet-4': 'claude-sonnet-4-5-20251001',
    'claude-opus-4':   'claude-opus-4-6',
    'claude-haiku-4':  'claude-haiku-4-5-20251001',
  };
  const realModelId = MODEL_IDS[this.state.selectedModel] || this.state.selectedModel;

  const response = await fetch(model.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model:       realModelId,
      max_tokens:  model.maxTokens,
      temperature: model.temp,
      system: 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  // ... resto igual
},
```

### 6.2 — Gemini: endpoint e API key validation

**Adicionar** ao `AI_MODELS` Gemini o campo `modelId` para o endpoint dinâmico:

```javascript
'gemini-2.5-flash': {
  ...
  // Endpoints corrigidos com versão estável
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent',
},
'gemini-2.5-pro': {
  ...
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-05-06:generateContent',
},
```

**Adicionar** validação de key antes de qualquer chamada:

```javascript
async callAI(prompt, images = []) {
  const model  = AI_MODELS[this.state.selectedModel];
  if (!model) throw new Error(`Modelo "${this.state.selectedModel}" não encontrado.`);

  const apiKey = this.state.apiKeys[model.provider];
  if (!apiKey?.trim()) throw new Error(
    `Chave de API para ${model.group} não configurada. Vá em Config. APIs na sidebar.`
  );

  // Sanitize prompt
  if (!prompt?.trim()) throw new Error('Prompt vazio — reporte este bug.');

  switch (model.provider) {
    case 'gemini':      return this._callGemini(prompt, model, apiKey, images);
    case 'claude':      return this._callClaude(prompt, model, apiKey, images);
    case 'grok':        return this._callOpenAICompat(prompt, model, apiKey);
    case 'mistral':     return this._callOpenAICompat(prompt, model, apiKey);
    case 'openrouter':  return this._callOpenRouter(prompt, model, apiKey);
    default: throw new Error(`Provider "${model.provider}" não implementado.`);
  }
},
```

### 6.3 — `ERROR_MAP` expandido

Adicionar antes do objeto `App`:

```javascript
const ERROR_MAP = {
  'api key':          { cause: 'API Key inválida ou sem permissão.', tip: 'Verifique se a key está correta e sem espaços extras.' },
  'quota':            { cause: 'Cota da API atingida.', tip: 'Aguarde algumas horas ou troque para outro modelo.' },
  'rate limit':       { cause: 'Muitas requisições em pouco tempo.', tip: 'Aguarde 30 segundos e tente novamente.' },
  'too short':        { cause: 'Resposta muito curta — provavelmente contexto cortado.', tip: 'Tente Gemini 2.5 Pro ou Claude Opus que têm janela maior.' },
  'context length':   { cause: 'Briefing muito longo para este modelo.', tip: 'Reduza o briefing bruto ou troque para um modelo com janela maior.' },
  'unauthorized':     { cause: 'API Key sem autorização para este modelo.', tip: 'Verifique os planos ativos na conta do provider.' },
  'network':          { cause: 'Falha de conexão com a API.', tip: 'Verifique sua internet e tente novamente.' },
  'timeout':          { cause: 'A requisição demorou demais e foi cancelada.', tip: 'Tente um modelo mais rápido (Gemini Flash) ou reduza o briefing.' },
  'overloaded':       { cause: 'O servidor do modelo está sobrecarregado.', tip: 'Aguarde 1–2 minutos e tente novamente.' },
  'openrouter':       { cause: 'Erro no gateway OpenRouter.', tip: 'Verifique os créditos em openrouter.ai/credits.' },
};
```

---

## 7. FIELD_TOOLTIPS COMPLETO

**Substituir** o objeto `FIELD_TOOLTIPS` inteiro por:

```javascript
const FIELD_TOOLTIPS = {
  // Step 1
  nome_cliente:          'Nome do profissional como aparecerá no site. Ex: "Dra. Ana Lima" ou "Beatriz Mattos".',
  nome_marca:            'Nome comercial ou da marca, se diferente do nome do profissional. Ex: "BM Adestramento", "Clínica Bem-Estar".',
  segmento:              'Área de atuação específica — não "saúde" mas "fisioterapia pélvica" ou "psicologia clínica com foco em ansiedade". Quanto mais específico, mais precisa a copy.',
  tipo:                  'Define a estrutura do site: Serviço = agendamento/contratação; Mentoria = programa com acompanhamento; Produto = item físico ou digital.',
  dominio:               'Domínio do site. Ex: beatrizmattos.com.br. Confirmar disponibilidade antes do go-live.',
  cnpj:                  'CNPJ para exibir no rodapé — obrigatório para algumas categorias regulamentadas.',
  aviso_legal:           'Registro profissional para o rodapé. Ex: CRM 12345-SP, CRP 06/12345, OAB/SP 123456.',

  // Step 2
  whatsapp:              'Apenas dígitos com DDI e DDD. Ex: 5511999999999 (55=Brasil, 11=SP). Vai em todos os CTAs da página.',
  email:                 'E-mail de contato exibido na página. Deixar vazio se o cliente preferir contato só por WhatsApp.',
  horarios:              'Dias e horários de atendimento. Ex: Seg–Sex: 8h–18h, Sáb: 8h–12h. Aumenta credibilidade.',
  gtm_id:                'ID do Google Tag Manager. Ex: GTM-XXXXXXX. Fornecido pelo gestor de tráfego. Vai no .env — nunca hardcoded.',
  objetivo_conversao:    'A ação principal que o visitante deve fazer. WhatsApp é padrão para serviços locais. Formulário serve para triagem.',

  // Step 3
  instagram:             'Usuário do Instagram com @. Ex: @beatrizmattos. Aparece no footer e, se ativo, pode incluir Feed.',
  tiktok:                'Usuário do TikTok. Deixar vazio se não tiver ou não for relevante para o negócio.',
  youtube:               'Link completo do canal. Ex: youtube.com/@beatrizmattos',
  google_business:       'Perfil Google Meu Negócio. Se Sim e tiver 10+ avaliações reais com nota ≥ 4.5, inclui o bloco de reviews.',
  google_nota:           'Nota exata do perfil Google. Mínimo 4.5 para incluir o bloco na página.',
  google_qtd:            'Número de avaliações. Mínimo 10 para incluir. Nunca inventamos notas.',

  // Step 4
  modalidade:            'Define quais blocos aparecem: Presencial → inclui endereço + mapa. Online → sem mapa. Híbrido → ambos.',
  endereco:              'Endereço completo com ponto de referência. Só incluir se autorizado pelo cliente. Ex: Rua das Flores, 123 – Jardins, SP – Próximo ao Shopping X.',
  exibir_localizacao:    'Como exibir o endereço: completo, só o bairro, ou apenas a cidade.',
  cidades_atendimento:   'Regiões atendidas — importante para SEO local. Ex: São Paulo e Grande ABC.',
  plataforma_online:     'Plataforma usada para atendimento online. Ex: Google Meet, Zoom, WhatsApp Vídeo.',

  // Step 5
  servico_principal:     'O serviço ou produto mais importante — foco da campanha. Vai definir a H1 e o Hero da página.',
  servicos_lista:        'Lista de todos os serviços ou planos, um por linha. A IA decide se cria grade de serviços ou tabela de planos.',
  servicos_descricao:    'Como funciona o processo, o que está incluso, quanto tempo dura, qual resultado esperado. Quanto mais detalhe, mais rica a copy do bloco "Como Funciona".',
  preco_exibir:          'Exibir preço reduz volume de leads mas aumenta qualidade. Bom para serviços premium ou com preço fixo.',
  preco_valor:           'Valor e forma de cobrança. Ex: R$ 350/sessão, A partir de R$ 1.200/mês.',
  preco_condicao:        'Condição especial ou parcelamento. Ex: 3x sem juros no cartão.',
  oferta_especial:       'Promoção ativa com prazo real. A IA cria um bloco de urgência com base nisso. Deixar vazio se não houver.',

  // Step 6
  publico_primario:      'Perfil do cliente ideal: gênero, faixa etária, situação de vida, localização. Fale sobre uma pessoa real, não uma demografia genérica.',
  publico_dor:           'O problema real que faz o cliente buscar esse serviço. Use a linguagem do cliente — como ele pesquisa no Google, não o termo técnico.',
  publico_resultado:     'O que o cliente imagina conquistar após contratar. Deve aparecer no Hero e no CTA Final da página.',
  publico_secundario:    'Se houver um segundo perfil de cliente relevante. A IA pode criar variações de copy.',
  faq:                   'Perguntas frequentes reais que os clientes fazem. A IA inclui o bloco FAQ se houver objeções documentadas aqui.',

  // Step 7
  diferencial:           'O que concretamente diferencia esse profissional. Não "atendimento humanizado" — mas o que ele faz diferente: método, certificação, resultado concreto, garantia.',
  frase_impacto:         'Como o profissional descreveria o que faz em uma frase. Vem da conversa — não invente. Pode virar a H1 da página.',
  historia:              'Por que esse profissional faz o que faz. Se for genuína e diferente do padrão do nicho, a IA inclui um bloco de história.',
  casos_resultados:      'Números e resultados concretos. Ex: 120 cães atendidos, 97% relataram melhora em 30 dias.',
  depoimentos:           'Nunca inventamos depoimentos. Se Sim, o bloco de Prova Social é incluído na página.',
  depoimentos_qtd:       'Quantidade de depoimentos disponíveis. Ideal: 3 a 6. Mais de 6 pode virar slider.',
  depoimentos_formato:   'Formato dos depoimentos disponíveis. Influencia como o bloco será montado.',

  // Step 8
  estilo_desejado:       'Descreva como o site deve ser percebido. Não "moderno" ou "clean" isolados — diga o quê. Ex: Sóbrio e técnico como Linear.app, mas mais quente por ser nicho de saúde.',
  sensacao_visitante:    'Emoção desejada ao navegar. É diferente do estilo visual — é o sentimento. Ex: Segurança imediata. Que essa é a pessoa certa.',
  frase_tom:             'Uma frase curta que captura a personalidade da marca. Guia o tom de voz da IA. Ex: Especialista que já viu tudo e fala sem rodeios.',
  vocabulario_usa:       'Termos técnicos ou expressões do cliente que devem aparecer na copy. Vêm da conversa — não do formulário.',
  vocabulario_nunca:     'Expressões que quebram a autenticidade. Tão importante quanto o vocabulário correto. Ex: "pet", "fofo", "jornada", "transformação".',
  restricoes:            'Tudo que NÃO quer de forma alguma — cores, estilos, elementos, referências negativas. Ex: Sem rosa. Sem visual de infoproduto. Sem fontes cursivas.',
};
```

---

## 8. REGRAS_FIXAS_ADSGATOR EXPANDIDO

**Substituir** a constante `REGRAS_FIXAS_ADSGATOR` por:

```javascript
const REGRAS_FIXAS_ADSGATOR = `
## STACK TÉCNICA IMUTÁVEL

- Framework: Astro (output: 'hybrid' para suportar endpoint /api/contato)
- CSS: Tailwind CSS — todos os tokens em tailwind.config.js. Zero HEX hardcoded. Zero style="" onde Tailwind resolve.
- Animações de scroll: GSAP + ScrollTrigger em <script> dentro dos .astro — NUNCA em bundle React
- Animações de UI: Framer Motion apenas em islands React (MobileMenu, ContactForm, CookieBanner)
- Scroll suave: Lenis (@studio-freight/lenis) integrado ao GSAP ticker
- Formulários: Web3Forms (FORMS_ACCESS_KEY no .env)
- Analytics: Vercel Analytics (@vercel/analytics) + Vercel Speed Insights (@vercel/speed-insights)
- Deploy: Vercel

## GIT — OBRIGATÓRIO ANTES DE QUALQUER CÓDIGO

git init → git add . → git commit -m "init: projeto Astro base"
.gitignore: node_modules/, dist/, .env
Conectar ao repositório remoto antes do primeiro deploy.

## ARQUIVOS OBRIGATÓRIOS

- public/robots.txt → Allow: / | Disallow: /links, /politica-de-privacidade, /404
- public/manifest.json → name, start_url, display: "standalone", theme_color via token
- .env.example → GTM_ID= | WHATSAPP_NUMBER= | FORMS_ACCESS_KEY= | INSTAGRAM_TOKEN= (se ativo)
- src/pages/404.astro → personalizada com botão voltar + botão WhatsApp
- src/pages/politica-de-privacidade.astro → LGPD completa
- src/pages/links.astro → página de links (excluída do sitemap)

## COMPONENTES GLOBAIS OBRIGATÓRIOS

Layout.astro → SEO, GTM (is:inline), Consent Mode v2, Lenis, GSAP, Analytics, SpeedInsights
Button.astro → props: label, href, variant, trackingId, section | nunca botão inline
SectionHeader.astro → props: label, title, subtitle, align
FeatureCard.astro → props: icon, title, description
TestimonialCard.astro → props: name, role, text, avatar (se depoimentos existirem)

## COMPONENTES REACT (ISLANDS)

MobileMenu.tsx → fullscreen overlay AnimatePresence | focus trap | Escape fecha | overflow:hidden no body
ContactForm.tsx → honeypot | validação inline | ErrorBoundary com fallback WhatsApp | client:visible
CookieBanner.tsx → LGPD + Consent Mode v2 | client:idle | localStorage 'adsgator-consent'

## UX OBRIGATÓRIO

Header → sticky z-50 | esconde ao scroll down (GSAP) | reaparece ao scroll up | backdrop-blur após 80px
WhatsApp flutuante → IntersectionObserver | aparece após Hero sair | some quando footer entra | SVG nativo #25D366 | 56×56px | aria-label="Falar no WhatsApp"
Mobile First → começa em 375px | Hero usa 100svh | texto mínimo 16px | touch targets 44px
Footer → fundo diferente da última seção | logo da marca | logo Adsgator com link adsgator.com.br | ano dinâmico {new Date().getFullYear()}

## COPY — DNA ADSGATOR INEGOCIÁVEL

- H1 espelha a dor real de busca — nunca o nome técnico do serviço
- Copy em primeira pessoa: "Eu atendo...", "Meu método..." — NUNCA "Maria atende..."
- Zero institucional: proibido "inovador", "excelência", "missão", "visão", "comprometidos com", "resultados extraordinários"
- CTAs específicos: nunca "Saiba mais", "Clique aqui", "Entre em contato", "Solicite um orçamento"
- Nunca inventar depoimentos, avaliações ou notas Google

## BLOCOS CONDICIONAIS — REGRAS RÍGIDAS

- Mapa: APENAS se modalidade presencial/híbrida com endereço explicitamente autorizado
- Avaliações Google: APENAS se google_business=sim E nota≥4.5 E avaliações≥10
- Feed Instagram: APENAS se perfil ativo e relevante para o serviço
- Depoimentos: APENAS se depoimentos=sim. Nunca inventar.
- Preços: APENAS se preco_exibir=sim e valores fornecidos

## PERFORMANCE E SEO

- <link rel="preload"> na imagem hero com fetchpriority="high"
- font-display: swap em toda @font-face
- Canonical URL em cada página via prop canonicalUrl
- Schema.org JSON-LD no Layout.astro (LocalBusiness ou Person conforme o nicho)
- Lighthouse Performance ≥ 90 mobile | Accessibility ≥ 90
- og-image 1200×630 presente

## ACESSIBILIDADE MÍNIMA

- WCAG AA em todo texto sobre fundo
- focus-visible em todos os elementos interativos
- Links externos com rel="noopener noreferrer"
- Todas as imagens com alt descritivo, width e height definidos
- prefers-reduced-motion check em todas as animações GSAP
- <h1> único por página
`;
```

---

## 9. PROMPT_AUDITORIA EXPANDIDO

**Substituir** a constante `PROMPT_AUDITORIA` por:

```javascript
const PROMPT_AUDITORIA = `
## AUDITORIA PÓS-IMPLEMENTAÇÃO

Faça uma auditoria completa do projeto que você acabou de construir.
Para cada item responda: ✅ implementado | ⚠ parcial (explique) | ❌ não implementado.

### HEADER INTELIGENTE
[ ] Header some suavemente ao scrollar para baixo e reaparece ao scrollar para cima
[ ] Fundo com backdrop-blur ou opacidade após 80px de scroll
[ ] Logo linkada para / (raiz)
[ ] CTA visível no header em desktop
[ ] Versão mobile testada em 375px

### BOTÃO WHATSAPP FLUTUANTE
[ ] Presente em todas as páginas
[ ] Oculto no carregamento — aparece após o Hero sair do viewport (IntersectionObserver)
[ ] Some quando o footer entra no viewport
[ ] Tem aria-label="Falar no WhatsApp"
[ ] Rastreado com data-tracking="click-whatsapp" data-section="floating-button"

### BANNER DE CONSENTIMENTO (LGPD)
[ ] CookieBanner presente e funcional
[ ] Aparece apenas se não houver consentimento registrado
[ ] Botões "Aceitar" e "Recusar" funcionando e registrando escolha
[ ] Google Consent Mode v2 configurado — GTM em modo restrito antes do consentimento
[ ] Não bloqueia o carregamento da página

### ANALYTICS E PERFORMANCE
[ ] Vercel Analytics instalado e ativo
[ ] Vercel Speed Insights instalado e ativo
[ ] Google Tag Manager snippet no <head> E no <body> (via is:inline)
[ ] GTM ID via variável de ambiente — não hardcoded

### GIT E DEPLOY
[ ] Repositório Git inicializado e com pelo menos um commit
[ ] .gitignore cobrindo node_modules, dist, .env
[ ] Variáveis sensíveis em .env — nunca no código
[ ] .env.example entregue com todas as variáveis documentadas
[ ] Deploy configurado na Vercel com CI/CD automático

### DESIGN RESPONSIVO
[ ] Mobile testado em 375px sem overflow horizontal
[ ] Hero ocupa 100svh em mobile
[ ] Touch targets mínimo 44px em todos os elementos clicáveis
[ ] Fonte mínima 16px em mobile
[ ] Backgrounds distintos por seção criam ritmo visual

### FOOTER
[ ] Footer tem identidade visual coerente com a landing page
[ ] Logo da marca presente
[ ] Logo da agência Adsgator com link para adsgator.com.br
[ ] Links: Política de Privacidade + redes sociais confirmadas
[ ] Ano dinâmico: {new Date().getFullYear()}

### ACESSIBILIDADE
[ ] Contraste WCAG AA em todo texto sobre fundo
[ ] focus-visible em todos os elementos interativos
[ ] Links externos com rel="noopener noreferrer"
[ ] Todas as imagens com alt descritivo, width e height
[ ] prefers-reduced-motion check em todas as animações GSAP

### PÁGINAS SECUNDÁRIAS
[ ] /links funcionando
[ ] /politica-de-privacidade acessível via footer
[ ] /404 personalizada com botão voltar e botão WhatsApp
[ ] Sitemap excluindo /links, /politica-de-privacidade, /404
[ ] robots.txt criado

### QUALIDADE TÉCNICA
[ ] Build sem erros (npm run build)
[ ] Zero console.log em produção
[ ] Zero HEX hardcoded — todos via token Tailwind
[ ] Lighthouse Performance ≥ 90 mobile
[ ] Lighthouse Accessibility ≥ 90
[ ] Link do WhatsApp testado com mensagem pré-preenchida
[ ] Schema.org JSON-LD válido
[ ] og-image 1200×630 presente

Para cada ❌ ou ⚠, descreva exatamente o que precisa ser corrigido.
`;
```

---

## 10. FLUXO DE NAVEGAÇÃO ATUALIZADO

### Sidebar nav — itens especiais

O sidebar deve mostrar, após os 8 steps de briefing, três itens especiais em seção separada:

```
─────────────────────
  TELAS ESPECIAIS
─────────────────────
  [layout]   Estrutura da LP    [status]
  [palette]  Direção de Arte    [status]
  [zap]      Revisão e Geração
```

Em `renderStepsNav()`, adicionar após o loop dos 8 steps:

```javascript
// Seção especial
const specialItems = [
  {
    key: 'estrutura',
    icon: 'layout',
    label: 'Estrutura da LP',
    done: !!this.B.estrutura_aprovada,
    active: this.state.screen === 'estrutura',
  },
  {
    key: 'art',
    icon: 'palette',
    label: 'Direção de Arte',
    done: !!this.B.arte_ficha_aprovada,
    active: this.state.screen === 'art',
  },
  {
    key: 'review',
    icon: 'zap',
    label: 'Revisão e Geração',
    done: false,
    active: this.state.screen === 'review',
  },
];

const specialLabel = document.createElement('div');
specialLabel.className = 'sidebar-label';
specialLabel.style.marginTop = '8px';
specialLabel.textContent = 'Etapas Finais';
nav.appendChild(specialLabel);

specialItems.forEach(item => {
  const el = document.createElement('button');
  el.className = `steps-nav-item steps-nav-special ${item.active ? 'active' : ''} ${item.done ? 'visited' : ''}`;
  el.setAttribute('role', 'listitem');
  el.innerHTML = `
    <i data-lucide="${item.done && !item.active ? 'check-circle' : item.icon}"
       class="steps-nav-icon ${item.done && !item.active ? 'done' : ''}"></i>
    <span class="steps-nav-label">${item.label}</span>
    ${item.done && !item.active ? '<i data-lucide="check" class="steps-nav-done" style="width:11px;height:11px;margin-left:auto;color:var(--accent)"></i>' : ''}
  `;
  el.onclick = () => this.goToScreen(item.key);
  nav.appendChild(el);
});
```

---

## 11. MELHORIAS DE UX E POLIMENTO

### 11.1 — Autosave indicator animado

Atualmente o `save-indicator` é estático. Deve piscar brevemente ao salvar:

```javascript
autosave() {
  this.saveStorage();
  this.updateSidebar();
  // Flash visual do indicador de save
  const el = document.getElementById('sidebar-save-indicator');
  if (el) {
    el.classList.remove('saved');
    el.classList.add('saving');
    setTimeout(() => {
      el.classList.remove('saving');
      el.classList.add('saved');
    }, 600);
  }
},
```

### 11.2 — `cloneProject()` no modal de projetos

```javascript
cloneProject(id) {
  const src = this.state.projects[id];
  if (!src) return;
  const newId  = 'p_' + Date.now();
  const clone  = JSON.parse(JSON.stringify(src));
  clone.id     = newId;
  clone.name   = (src.name || 'Projeto') + ' — Cópia';
  clone.createdAt = new Date().toISOString();
  clone.updatedAt = new Date().toISOString();
  // Limpar aprovações para o clone começar limpo
  delete clone.briefing.estrutura_aprovada;
  delete clone.briefing.arte_ficha_aprovada;
  this.state.projects[newId] = clone;
  this.autosave();
  this.renderProjectsList();
  this.showToast(`"${clone.name}" criado.`, 'success');
},
```

Adicionar botão de clone em cada item da lista de projetos (ao lado do de excluir).

### 11.3 — Importar/exportar JSON

```javascript
exportProject(id) {
  const p   = this.state.projects[id];
  if (!p) return;
  const json = JSON.stringify(p, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `projeto-${p.name?.replace(/\s+/g,'-') || id}.json`; a.click();
  URL.revokeObjectURL(url);
},

importProject(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const p  = JSON.parse(e.target.result);
      if (!p.briefing) throw new Error('JSON inválido — sem campo briefing.');
      const newId = 'p_' + Date.now();
      p.id = newId;
      p.name = (p.name || 'Projeto') + ' (importado)';
      this.state.projects[newId] = p;
      this.autosave();
      this.renderProjectsList();
      this.showToast('Projeto importado com sucesso.', 'success');
    } catch (err) {
      this.showToast('Erro ao importar: ' + err.message, 'error');
    }
    input.value = '';
  };
  reader.readAsText(file);
},
```

Conectar ao `<input type="file" id="import-file-input">` que já existe no HTML.

### 11.4 — Keyboard shortcut para salvar e navegar

```javascript
setupGlobalEvents() {
  // Fechar modais com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      ['modal-api','modal-gen','modal-preview','modal-projects',
       'modal-error','modal-rename','modal-art-result'].forEach(id => {
        if (id !== 'modal-gen') this.closeModal(id); // gen não fecha com Esc
      });
    }
    // Ctrl/Cmd + → próximo step | ← anterior
    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') { e.preventDefault(); this.goNext(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft')  { e.preventDefault(); this.goPrev(); }
  });

  // Fechar modal clicando no overlay (não no modal em si)
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay && overlay.id !== 'modal-gen') {
        overlay.classList.remove('open');
      }
    });
  });
},
```

### 11.5 — Score ponderado: incluir 'estrutura_aprovada' e 'arte_ficha_aprovada'

Em `calcGlobalScore()`, adicionar ao objeto `weights`:

```javascript
estrutura_aprovada: 4,
arte_ficha_aprovada: 3,
```

---

## 12. CSS ADICIONAL NECESSÁRIO

Adicionar ao final do `app.css`:

```css
/* ── Modal Rename ──────────────────────────────── */
.badge-new {
  font-size: 10px; font-weight: 600; padding: 2px 8px;
  border-radius: var(--r-pill); background: var(--accent2-dim);
  color: var(--accent2); border: 1px solid var(--accent2-border);
}

/* ── AI Log Modal ──────────────────────────────── */
.ai-log-modal { min-width: 380px; }

.ai-log-header {
  display: flex; flex-direction: column; gap: 6px; width: 100%;
}
.ai-log-title {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-display); font-size: 15px; font-weight: 700;
}
.ai-log-meta {
  display: flex; align-items: center; gap: 10px;
  font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono);
}
.ai-log-model { color: var(--accent2); }
.ai-log-elapsed { color: var(--text-disabled); }
.ai-log-body { display: flex; flex-direction: column; gap: 16px; }

.log-progress-wrap { display: flex; align-items: center; gap: 10px; }
.log-progress-bar { flex: 1; height: 5px; background: var(--bg-raised); border-radius: 3px; overflow: hidden; }
.log-progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent2), var(--accent)); transition: width 0.4s ease; }
.log-progress-pct { font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); min-width: 32px; text-align: right; }

.log-steps-list { display: flex; flex-direction: column; gap: 7px; }
.log-step {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; color: var(--text-tertiary);
  padding: 6px 10px; border-radius: var(--r-sm);
  transition: all var(--t-base);
}
.log-step--active { color: var(--text-primary); background: var(--bg-raised); }
.log-step--done   { color: var(--text-secondary); }
.log-step--error  { color: var(--danger); background: var(--danger-dim); }
.log-step--wait   { color: var(--text-disabled); }
.log-step-icon { width: 16px; height: 16px; flex-shrink: 0; }
.log-step--active .log-step-icon { color: var(--accent2); }
.log-step--done   .log-step-icon { color: var(--accent); }
.log-step--error  .log-step-icon { color: var(--danger); }
.log-step-label { flex: 1; }
.log-step-time { font-family: var(--font-mono); font-size: 10px; color: var(--text-disabled); }
.log-live {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; background: var(--bg-raised);
  border: 1px solid var(--border-subtle); border-radius: var(--r-sm);
  font-size: 12px; color: var(--text-secondary);
}
.log-live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent); flex-shrink: 0;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
.log-hint { font-size: 11px; color: var(--text-disabled); display: flex; align-items: center; gap: 6px; }

/* ── Estrutura Screen ──────────────────────────── */
.estrutura-screen { display: flex; flex-direction: column; gap: 24px; }
.estrutura-header { }
.estrutura-title { font-family: var(--font-display); font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 6px; }
.estrutura-desc  { font-size: 13px; color: var(--text-secondary); max-width: 560px; line-height: 1.6; }

.aprovado-banner {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; background: var(--accent-dim);
  border: 1px solid var(--accent-border); border-radius: var(--r-md);
  font-size: 13px; color: var(--accent);
}

.estrutura-editor-wrap {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  overflow: hidden;
}
.estrutura-editor-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-raised);
}
.estrutura-editor { padding: 0; }
.estrutura-hint {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 16px; background: var(--info-dim);
  border-bottom: 1px solid var(--info-border);
  font-size: 11px; color: var(--info);
}
.estrutura-textarea {
  min-height: 480px; border-radius: 0; border: none;
  border-top: 1px solid var(--border-subtle);
  resize: vertical; font-family: var(--font-mono); font-size: 12px; line-height: 1.7;
  background: var(--bg-base);
}
.estrutura-empty {
  padding: 48px; text-align: center; color: var(--text-tertiary);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  font-size: 13px;
}
.estrutura-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.no-key-warn {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: var(--warning);
}

/* Wireframe */
.wireframe-wrap {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  overflow: hidden;
}
.wireframe-title {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; border-bottom: 1px solid var(--border-subtle);
  font-size: 12px; font-weight: 600; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.06em;
}
.wireframe-frame { padding: 24px; display: flex; justify-content: center; }
.wireframe-mobile {
  width: 280px;
  border: 2px solid var(--border-default);
  border-radius: 12px; overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-md);
}
.wf-block {
  width: 100%; border-bottom: 1px dashed var(--border-muted);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--bg-surface); gap: 8px; padding: 12px;
  position: relative;
}
.wf-block--hero   { background: var(--bg-overlay); }
.wf-block--cta    { background: var(--accent-dim); }
.wf-block-label   { font-size: 10px; color: var(--text-tertiary); font-family: var(--font-mono); text-align: center; }
.wf-hero-inner    { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
.wf-text-lines    { display: flex; flex-direction: column; gap: 4px; width: 100%; }
.wf-line { height: 8px; background: var(--border-default); border-radius: 4px; }
.wf-line--h1  { width: 85%; }
.wf-line--sub { width: 65%; opacity: 0.5; }
.wf-btn-placeholder { width: 80px; height: 28px; background: var(--accent-border); border-radius: 14px; }
.wireframe-placeholder { font-size: 12px; color: var(--text-disabled); padding: 24px; text-align: center; }

/* ── Steps Nav Special ─────────────────────────── */
.steps-nav-special {
  color: var(--text-secondary);
  border-right-color: transparent;
}
.steps-nav-special.active {
  color: var(--accent2);
  background: var(--accent2-dim);
  border-right-color: var(--accent2);
}
.steps-nav-special.active .steps-nav-icon { color: var(--accent2); }
.steps-nav-special.visited:not(.active) .steps-nav-icon { color: var(--accent); }
```

---

## RESUMO DE MUDANÇAS POR ARQUIVO

### `index.html`
- Adicionar modal `#modal-rename` antes do toast
- Atualizar card do projeto ativo com botão de renomear

### `assets/app.js`
- Remover `buildStep8()` duplicado (linha ~809–866)
- Corrigir `buildStep7()` (bug de div não fechada)
- Corrigir `buildStepHTML()` mapeamento de builders
- Atualizar `STEPS` com 8 steps corretos
- Substituir `FIELD_TOOLTIPS` com versão completa (48 campos)
- Substituir `REGRAS_FIXAS_ADSGATOR` com versão expandida
- Substituir `PROMPT_AUDITORIA` com checklist de 40 itens
- Adicionar `ERROR_MAP` antes do objeto `App`
- Adicionar ao `state`: `aiLog`
- Adicionar métodos: `openAILog`, `aiLogStep`, `aiLogError`, `aiLogDone`, `aiLogDelay`, `closeAILog`, `_renderAILog`
- Adicionar ao `AI_MODELS`: 4 modelos OpenRouter
- Adicionar `_callOpenRouter()` ao switch de providers
- Adicionar campo OpenRouter no modal de API
- Corrigir `_callClaude()` com mapa de IDs reais
- Corrigir endpoints Gemini 2.5
- Atualizar `callAI()` com validação e case openrouter
- Adicionar métodos de projeto: `openRenameModal`, `saveProjectName`, `cloneProject`, `exportProject`, `importProject`
- Adicionar método `buildEstruturaHTML()`
- Adicionar método `runEstruturaAnalysis()`
- Adicionar método `buildEstruturaPrompt()`
- Adicionar método `aprovarEstrutura()`
- Adicionar método `abrirEstruturaManual()`
- Adicionar método `gerarWireframeHTML()`
- Atualizar `goNext()` e `goPrev()` com tela 'estrutura'
- Atualizar `renderScreen()` com case 'estrutura'
- Atualizar `renderStepsNav()` com itens especiais
- Atualizar `generateDocImpl()` para usar novo sistema de log
- Atualizar `runIntakeAnalysis()` para usar novo sistema de log
- Atualizar `runArtAnalysis()` para usar novo sistema de log
- Adicionar `setupGlobalEvents()` com keyboard shortcuts
- Atualizar `calcGlobalScore()` com pesos de estrutura e arte
- Adicionar método `autosave()` com flash visual do indicador

### `assets/app.css`
- Adicionar todos os blocos da seção 12 ao final do arquivo
