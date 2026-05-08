# IMPLEMENTAÇÃO 01 — Tela de Estrutura da LP
## Melhorias: Prompt + Visualização de Blocos + Validação

**Arquivo alvo:** `assets/js/screens/estrutura.js`  
**Arquivo alvo:** `assets/js/04-handlers.js`  
**Risco:** BAIXO  
**Depende de:** nada (pode implementar isolado)

---

## O QUE MUDA

1. `buildEstruturaPrompt()` — prompt melhorado que garante blocos completos em 1ª pessoa
2. `renderBlocosVisuais()` — parser mais robusto + cards visuais por tipo de bloco
3. `renderEstrutura()` — remove wireframe antigo, usa visualização de blocos
4. `runEstruturaAnalysis()` — AI Log atualizado (sem step de wireframe)

---

## PARTE A — `assets/js/04-handlers.js`

### A1 — Substituir `buildEstruturaPrompt()`

**Localizar** o método (buscar por `buildEstruturaPrompt`):

```javascript
  buildEstruturaPrompt(doc1) {
    return `...`.trim();
  },
```

**Substituir por:**

```javascript
  buildEstruturaPrompt(doc1) {
    const B = this.B || {};

    return `
Você é um Copywriter Sênior e Estrategista de Conversão especializado em landing pages para prestadores de serviço no Brasil.

## DADOS DO CLIENTE — USE APENAS ESTES, NUNCA INVENTE

${doc1.substring(0, 10000)}

---

## SUA TAREFA

Gere a estrutura narrativa COMPLETA da landing page com entre 6 e 9 blocos.

---

## REGRAS ABSOLUTAS — VIOLAÇÃO = RESPOSTA INVÁLIDA

1. **PRIMEIRA PESSOA DO SINGULAR EM TODA A COPY** — sem exceção
   - ✅ "Eu ajudo...", "Meu método...", "Atendo...", "Transformei..."
   - ❌ "Ela atende...", "O profissional oferece...", "Nossa equipe..."

2. **H1 DO HERO = DOR DE BUSCA** — não o nome do serviço
   - ✅ "Cansada de dietas que não funcionam?"
   - ❌ "Consulta Nutricional Personalizada"

3. **CTAs ESPECÍFICOS** — nunca genéricos
   - ✅ "Quero agendar minha avaliação", "Falar com a nutricionista"
   - ❌ "Saiba mais", "Clique aqui", "Entre em contato"

4. **SÓ INCLUA BLOCOS COM DADOS REAIS**
   - Sem depoimentos no briefing → não inclua bloco de depoimentos
   - Sem endereço → não inclua mapa
   - Sem Instagram confirmado → não inclua feed

5. **MÍNIMO 6 BLOCOS, MÁXIMO 9** — sempre incluir:
   - Bloco 1: Cabeçalho (sempre)
   - Bloco 2: Hero (sempre)
   - Último bloco antes do rodapé: CTA Final (sempre)
   - Último bloco: Rodapé (sempre)

6. **NARRATIVA CONECTADA** — cada bloco prepara o próximo psicologicamente

---

## FORMATO DE SAÍDA — SIGA EXATAMENTE, SEM DESVIOS

Responda APENAS com os blocos no formato abaixo. Nada antes, nada depois.

---
### BLOCO 1: Cabeçalho
**Objetivo narrativo:** Âncora de marca + CTA sempre visível
**Copy sugerida:**
- Logo/Nome: "[nome da marca]"
- Menu: [itens de navegação baseados nos blocos]
- CTA Header: "[texto do botão]"
**Layout sugerido:** Logo à esquerda, nav central, CTA à direita. Sticky no topo.
**Condicional:** Sempre presente

---
### BLOCO 2: Hero — [subtítulo descritivo]
**Objetivo narrativo:** Capturar atenção em 3 segundos e justificar o clique do anúncio
**Copy sugerida:**
- Título (H1): "[FRASE QUE ESPELHA A DOR DE BUSCA DO CLIENTE IDEAL]"
- Subtítulo: "[ampliar o benefício em 1-2 linhas, 1ª pessoa]"
- CTA Principal: "[ação específica com verbo forte]"
- CTA Secundário (opcional): "[alternativa mais suave]"
**Layout sugerido:** [texto à esquerda ou centralizado, onde vai a imagem]
**Condicional:** Sempre presente

---
### BLOCO [N]: [Nome do Bloco]
**Objetivo narrativo:** [o que este bloco alcança psicologicamente]
**Copy sugerida:**
- Título: "[texto]"
- Subtítulo: "[texto, se houver]"
- Body: "[copy principal em 1ª pessoa]"
- CTA (se aplicável): "[texto específico]"
**Layout sugerido:** [descrição do layout]
**Condicional:** [por que este bloco foi incluído — qual dado do briefing justifica]

---
[CONTINUAR ATÉ O CTA FINAL E RODAPÉ]

---
### SEQUÊNCIA FINAL
1. Cabeçalho
2. Hero
3. [próximos blocos em ordem]
...
[último]: Rodapé
    `.trim();
  },
```

---

### A2 — Substituir `runEstruturaAnalysis()`

**Localizar:**

```javascript
  async runEstruturaAnalysis() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    ...
    { id: 4, icon: 'monitor', label: 'Gerando wireframe visual...' },
    { id: 5, icon: 'check-circle', label: 'Finalizando estrutura...' },
    ...
    this.aiLogStep(4);
    const wireframeHTML = this.gerarWireframeHTML(resultado);
    ...
    this.setField('estrutura_wireframe', wireframeHTML);
```

**Substituir por:**

```javascript
  async runEstruturaAnalysis() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    this.openAILog('Gerando Estrutura da Landing Page', [
      { id: 1, icon: 'file-text', label: 'Lendo briefing completo...' },
      { id: 2, icon: 'layout', label: 'Definindo blocos e ordem narrativa...' },
      { id: 3, icon: 'sparkles', label: 'Gerando copy de cada bloco...' },
      { id: 4, icon: 'check-circle', label: 'Estrutura pronta!' },
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
      this.setField('estrutura_rascunho', resultado);
      this.setField('estrutura_wireframe', '');
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura gerada! Revise os blocos e refine se necessário.', 'success');
    } catch (err) {
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar estrutura: ' + err.message, 'error');
      }, 1200);
    }
  },
```

---

### A3 — Adicionar `refinarEstrutura()` em `04-handlers.js`

**Localizar** o método `aprovarEstrutura()` (buscar por `aprovarEstrutura`):

```javascript
  aprovarEstrutura() {
    ...
  },
```

**Inserir DEPOIS dele** (antes do comentário `/* Geração do DOC-IMPL */`):

```javascript
  async refinarEstrutura() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    const feedbackInput = document.getElementById('estrutura-feedback-input');
    const feedback = feedbackInput?.value?.trim();

    if (!feedback) {
      this.showToast('Descreva o que deseja ajustar antes de refinar.', 'warning');
      return;
    }

    const rascunhoAtual = this.B?.estrutura_rascunho;
    if (!rascunhoAtual?.trim()) {
      this.showToast('Gere a estrutura antes de refinar.', 'warning');
      return;
    }

    this.openAILog('Refinando Estrutura com IA', [
      { id: 1, icon: 'message-square', label: 'Analisando seu feedback...' },
      { id: 2, icon: 'refresh-cw', label: 'Aplicando ajustes...' },
      { id: 3, icon: 'check-circle', label: 'Estrutura refinada!' },
    ]);

    try {
      this.aiLogStep(1);
      await this.aiLogDelay(300);

      const prompt = `
Você é um Copywriter Sênior especializado em landing pages de alta conversão.

## ESTRUTURA ATUAL DA LANDING PAGE

${rascunhoAtual}

---

## FEEDBACK DO CLIENTE

"${feedback}"

---

## SUA TAREFA

Analise o feedback e refine a estrutura mantendo o formato original.

REGRAS:
1. Aplique EXATAMENTE as mudanças pedidas no feedback
2. Mantenha os blocos não mencionados IDÊNTICOS ao original
3. SEMPRE use 1ª pessoa do singular em toda a copy
4. Mantenha o mesmo formato de saída (### BLOCO N: Nome)
5. Retorne a estrutura COMPLETA — todos os blocos, não só os alterados
6. CTAs sempre específicos, nunca genéricos
      `.trim();

      this.aiLogStep(2);
      const resultado = await this.callAI(prompt);

      this.setField('estrutura_rascunho', resultado);
      this.setField('estrutura_wireframe', '');

      if (feedbackInput) feedbackInput.value = '';

      this.aiLogStep(3);
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura refinada! Revise novamente.', 'success');
    } catch (err) {
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao refinar: ' + err.message, 'error');
      }, 1200);
    }
  },
```

---

### A4 — Registrar listeners de `refinarEstrutura` e `btn-run-estrutura`

**Localizar** em `bindScreenEvents()` a seção de Estrutura (buscar por `btn-approve-estrutura`):

```javascript
    // ── Aprovar Estrutura ────────────────────────────────────────
    const approveEstruturaBtn = container.querySelector('#btn-approve-estrutura');
    if (approveEstruturaBtn) approveEstruturaBtn.addEventListener('click', () => this.aprovarEstrutura());
```

**Substituir por:**

```javascript
    // ── Estrutura: Gerar ─────────────────────────────────────────
    const runEstruturaBtn = container.querySelector('#btn-run-estrutura');
    if (runEstruturaBtn) runEstruturaBtn.addEventListener('click', () => this.runEstruturaAnalysis());

    // ── Estrutura: Aprovar ────────────────────────────────────────
    const approveEstruturaBtn = container.querySelector('#btn-approve-estrutura');
    if (approveEstruturaBtn) approveEstruturaBtn.addEventListener('click', () => this.aprovarEstrutura());

    // ── Estrutura: Refinar ────────────────────────────────────────
    const refinarEstruturaBtn = container.querySelector('#btn-refinar-estrutura');
    if (refinarEstruturaBtn) refinarEstruturaBtn.addEventListener('click', () => this.refinarEstrutura());
```

---

## PARTE B — `assets/js/screens/estrutura.js` (ARQUIVO COMPLETO)

Substituir o arquivo INTEIRO pelo conteúdo abaixo:

```javascript
/* ============================================================
   LandingAI v2 — Screen: Estrutura da LP
   ============================================================ */

Object.assign(window.App, {

  renderEstrutura() {
    const B = this.B || {};
    const rascunho = B.estrutura_rascunho || '';
    const aprovada = B.estrutura_aprovada || '';

    return `
    <div class="estrutura-screen">

      ${aprovada ? `
      <div class="aprovado-banner">
        <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--accent)"></i>
        <span>Estrutura aprovada</span>
        <button class="btn-ghost btn-sm" onclick="App.setField('estrutura_aprovada','');App.renderScreen();">
          Reeditar
        </button>
      </div>
      ` : ''}

      <div class="estrutura-layout">

        <!-- ── COLUNA ESQUERDA: controles ─────────────────────── -->
        <div class="estrutura-col-controls">

          <!-- Card: Gerar com IA -->
          <div class="estrutura-section-card">
            <div class="estrutura-section-header">
              <i data-lucide="sparkles" style="width:15px;height:15px;color:var(--accent2)"></i>
              <span class="estrutura-section-title">Gerar com IA</span>
            </div>
            <p class="estrutura-section-desc">
              A IA lê o briefing completo e define blocos, copy em 1ª pessoa e ordem narrativa.
            </p>
            <button class="btn-primary" id="btn-run-estrutura" ${aprovada ? 'disabled' : ''}>
              <i data-lucide="cpu" style="width:15px;height:15px"></i>
              ${rascunho && !aprovada ? 'Gerar Novamente' : 'Gerar Estrutura'}
            </button>
            <button class="btn-ghost btn-sm" style="margin-top:8px" onclick="App.abrirEstruturaManual()" ${aprovada ? 'disabled' : ''}>
              <i data-lucide="edit-3" style="width:13px;height:13px"></i>
              Preencher manualmente
            </button>
          </div>

          <!-- Card: Rascunho em Markdown -->
          ${rascunho ? `
          <div class="estrutura-section-card">
            <div class="estrutura-section-header">
              <i data-lucide="file-text" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Rascunho</span>
            </div>
            <p class="estrutura-section-desc">
              Edite diretamente se quiser ajustar algo pontual, ou use o campo de refinamento abaixo.
            </p>
            <textarea
              class="field-textarea estrutura-textarea"
              data-field="estrutura_rascunho"
              rows="14"
              ${aprovada ? 'disabled' : ''}
            >${rascunho}</textarea>
            ${!aprovada ? `
            <button class="btn-primary" style="margin-top:12px;width:100%" id="btn-approve-estrutura">
              <i data-lucide="check" style="width:15px;height:15px"></i>
              Aprovar Estrutura
            </button>
            ` : ''}
          </div>
          ` : ''}

          <!-- Card: Refinar com IA -->
          ${rascunho && !aprovada ? `
          <div class="estrutura-section-card estrutura-feedback-card">
            <div class="estrutura-section-header">
              <i data-lucide="message-square" style="width:15px;height:15px;color:var(--accent)"></i>
              <span class="estrutura-section-title">Refinar com IA</span>
            </div>
            <p class="estrutura-section-desc">
              Não gostou de algo? Descreva e a IA ajusta mantendo o briefing. Pode pedir várias vezes.
            </p>
            <textarea
              class="field-textarea"
              id="estrutura-feedback-input"
              rows="4"
              placeholder="Ex: O Hero ficou muito técnico, quero mais direto e urgente. O CTA deve citar o WhatsApp..."
            ></textarea>
            <button class="btn-primary" id="btn-refinar-estrutura" style="margin-top:10px;width:100%">
              <i data-lucide="refresh-cw" style="width:14px;height:14px"></i>
              Refinar com IA
            </button>
          </div>
          ` : ''}

        </div>

        <!-- ── COLUNA DIREITA: visualização dos blocos ─────────── -->
        <div class="estrutura-col-preview">
          <div class="estrutura-section-card estrutura-preview-card">
            <div class="estrutura-section-header">
              <i data-lucide="layout-template" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Visualização dos Blocos</span>
              ${rascunho ? `<span class="estrutura-preview-badge">${this.contarBlocos(rascunho)} blocos</span>` : ''}
            </div>

            ${rascunho ? `
            <div class="estrutura-blocos-container">
              ${this.renderBlocosVisuais(rascunho)}
            </div>
            ` : `
            <div class="estrutura-preview-empty">
              <i data-lucide="layout" style="width:32px;height:32px;color:var(--text-disabled)"></i>
              <p>A visualização aparece após gerar a estrutura</p>
            </div>
            `}
          </div>
        </div>

      </div>
    </div>
    `;
  },

  /* ----------------------------------------------------------
     contarBlocos — conta quantos blocos foram gerados
  ---------------------------------------------------------- */
  contarBlocos(rascunho) {
    const matches = rascunho.match(/###\s*BLOCO\s*\d+/gi);
    return matches ? matches.length : 0;
  },

  /* ----------------------------------------------------------
     renderBlocosVisuais — converte markdown em cards visuais
  ---------------------------------------------------------- */
  renderBlocosVisuais(rascunho) {
    if (!rascunho) return '';

    const blocoRegex = /###\s*BLOCO\s*(\d+)[:\-–]?\s*(.+?)[\r\n]+([\s\S]*?)(?=###\s*BLOCO\s*\d+|###\s*SEQUÊNCIA|$)/gi;
    const blocos = [];
    let match;

    while ((match = blocoRegex.exec(rascunho)) !== null) {
      blocos.push({
        num:   parseInt(match[1]),
        nome:  match[2].trim(),
        corpo: match[3].trim(),
      });
    }

    if (blocos.length === 0) {
      // Fallback: exibir texto bruto em card único
      return `
        <div class="bloco-visual bloco-raw">
          <p class="bloco-raw-hint">⚠️ Formato inesperado — exibindo texto bruto</p>
          <pre style="font-size:12px;color:var(--text-secondary);white-space:pre-wrap;line-height:1.6;">${rascunho.substring(0, 3000)}</pre>
        </div>
      `;
    }

    return blocos.map(b => {
      const extrair = (chaves, fallback = '') => {
        for (const chave of chaves) {
          const rx = new RegExp(`(?:${chave})\\s*[:\\-]\\s*[""]?(.+?)[""]?(?:[\\r\\n]|$)`, 'i');
          const r  = b.corpo.match(rx);
          if (r?.[1]?.trim()) return r[1].replace(/\*\*/g, '').trim();
        }
        return fallback;
      };

      const extrairBody = (chaves) => {
        for (const chave of chaves) {
          const rx = new RegExp(`(?:${chave})\\s*[:\\-]\\s*([\\s\\S]+?)(?=\\n\\s*-\\s*\\*\\*|\\n\\*\\*|\\n###|$)`, 'i');
          const r  = b.corpo.match(rx);
          if (r?.[1]?.trim()) {
            return r[1].trim()
              .replace(/^[-*]\s+/gm, '')
              .replace(/\*\*/g, '')
              .replace(/\n+/g, ' ')
              .substring(0, 280);
          }
        }
        return '';
      };

      const objetivo    = extrair(['Objetivo narrativo', 'Objetivo', 'Propósito']);
      const titulo      = extrair(['- Título \\(H1\\)', '- Título', 'Título', 'H1', 'Headline']);
      const subtitulo   = extrair(['- Subtítulo', 'Subtítulo', 'Subtitle']);
      const ctaPrinc    = extrair(['- CTA Principal', '- CTA', 'CTA Principal', 'CTA']);
      const condicional = extrair(['Condicional', 'Justificativa']);
      const layout      = extrair(['Layout sugerido', 'Layout']);
      const body        = extrairBody(['- Body', 'Body', '- Copy principal', 'Copy sugerida']);

      const tipo = this.detectarTipoBloco(b.nome);

      return `
        <div class="bloco-visual bloco-tipo-${tipo}">
          <div class="bloco-visual-header">
            <span class="bloco-visual-num">${b.num}</span>
            <span class="bloco-visual-nome">${b.nome}</span>
            <span class="bloco-tipo-badge bloco-badge-${tipo}">${this.labelTipoBloco(tipo)}</span>
          </div>
          <div class="bloco-visual-body">
            ${objetivo ? `
            <div class="bloco-row bloco-objetivo">
              <span class="bloco-label">Objetivo</span>
              <span class="bloco-value">${objetivo}</span>
            </div>` : ''}
            ${titulo ? `
            <div class="bloco-row bloco-titulo-row">
              <span class="bloco-label">Título</span>
              <strong class="bloco-titulo-text">${titulo}</strong>
            </div>` : ''}
            ${subtitulo ? `
            <div class="bloco-row">
              <span class="bloco-label">Subtítulo</span>
              <span class="bloco-value">${subtitulo}</span>
            </div>` : ''}
            ${body && !subtitulo ? `
            <div class="bloco-row">
              <span class="bloco-label">Copy</span>
              <span class="bloco-value">${body}</span>
            </div>` : ''}
            ${ctaPrinc ? `
            <div class="bloco-row bloco-cta-row">
              <span class="bloco-label">CTA</span>
              <span class="bloco-cta-pill">${ctaPrinc}</span>
            </div>` : ''}
            ${layout ? `
            <div class="bloco-row bloco-layout-row">
              <span class="bloco-label">Layout</span>
              <span class="bloco-value bloco-layout-text">${layout}</span>
            </div>` : ''}
            ${condicional ? `
            <div class="bloco-row bloco-condicional">
              <span class="bloco-label">Por quê</span>
              <span class="bloco-value">${condicional}</span>
            </div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  detectarTipoBloco(nome) {
    const n = nome.toLowerCase();
    if (/cabeçalho|header|nav/.test(n))             return 'header';
    if (/hero|destaque|capa/.test(n))               return 'hero';
    if (/como funciona|passo|etapa|processo/.test(n)) return 'steps';
    if (/diferencial|benefício|vantagem/.test(n))   return 'features';
    if (/plano|preço|investimento|pacote/.test(n))  return 'pricing';
    if (/depoimento|prova|testimon/.test(n))        return 'testimonial';
    if (/avaliação|google|review/.test(n))          return 'reviews';
    if (/faq|pergunta|dúvida/.test(n))              return 'faq';
    if (/localização|mapa|endereço/.test(n))        return 'map';
    if (/instagram|feed|social/.test(n))            return 'instagram';
    if (/contato|formulário|form/.test(n))          return 'contact';
    if (/cta|chamada|ação final|whatsapp/.test(n))  return 'cta';
    if (/rodapé|footer/.test(n))                    return 'footer';
    if (/sobre|about|história/.test(n))             return 'about';
    return 'generic';
  },

  labelTipoBloco(tipo) {
    const labels = {
      header:      'Nav',
      hero:        'Hero',
      steps:       'Processo',
      features:    'Diferenciais',
      pricing:     'Preços',
      testimonial: 'Prova Social',
      reviews:     'Avaliações',
      faq:         'FAQ',
      map:         'Localização',
      instagram:   'Instagram',
      contact:     'Contato',
      cta:         'CTA',
      footer:      'Rodapé',
      about:       'Sobre',
      generic:     'Seção',
    };
    return labels[tipo] || 'Seção';
  },

  abrirEstruturaManual() {
    const template = `### BLOCO 1: Cabeçalho
**Objetivo narrativo:** Âncora de marca e CTA sempre visível no scroll
**Copy sugerida:**
- Logo/Nome: "[Nome da marca]"
- Menu: Serviço | Como Funciona | Depoimentos | Contato
- CTA Header: "Agendar consulta"
**Layout sugerido:** Logo à esquerda, nav central, CTA à direita. Sticky.
**Condicional:** Sempre presente

---
### BLOCO 2: Hero — Impacto Inicial
**Objetivo narrativo:** Capturar atenção e justificar o clique do anúncio em 3 segundos
**Copy sugerida:**
- Título (H1): "[FRASE QUE ESPELHA A DOR DE BUSCA]"
- Subtítulo: "[Ampliar o benefício em 1-2 linhas, 1ª pessoa]"
- CTA Principal: "[Ação específica com verbo forte]"
**Layout sugerido:** Texto à esquerda, imagem à direita. Full-width em mobile.
**Condicional:** Sempre presente

---
### BLOCO 3: [Nome do Bloco]
**Objetivo narrativo:** [objetivo]
**Copy sugerida:**
- Título: "[texto]"
- Body: "[copy em 1ª pessoa]"
- CTA: "[texto do botão]"
**Layout sugerido:** [layout]
**Condicional:** [justificativa]

---
### SEQUÊNCIA FINAL
1. Cabeçalho
2. Hero
3. [próximos blocos]
`;
    this.setField('estrutura_rascunho', template);
    this.renderScreen();
  },

});
```

---

## PARTE C — CSS — `assets/css/03-screens.css`

Adicionar ao **final** do arquivo:

```css
/* ============================================================
   Visualização de Blocos — Estrutura LP
   ============================================================ */

.estrutura-blocos-container {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  max-height: 68vh;
  overflow-y: auto;
  padding: 0.125rem 0.25rem 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}
.estrutura-blocos-container::-webkit-scrollbar { width: 4px; }
.estrutura-blocos-container::-webkit-scrollbar-track { background: transparent; }
.estrutura-blocos-container::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* Card de bloco */
.bloco-visual {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-left: 3px solid var(--border);
  border-radius: 8px;
  padding: 0.875rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.bloco-visual:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(0,229,160,0.08);
}

/* Cores por tipo */
.bloco-tipo-hero        { border-left-color: var(--accent2, #a78bfa); }
.bloco-tipo-cta         { border-left-color: var(--accent, #00e5a0); }
.bloco-tipo-testimonial { border-left-color: #f59e0b; }
.bloco-tipo-pricing     { border-left-color: #10b981; }
.bloco-tipo-steps       { border-left-color: #3b82f6; }
.bloco-tipo-features    { border-left-color: #8b5cf6; }
.bloco-tipo-faq         { border-left-color: #6366f1; }
.bloco-tipo-header,
.bloco-tipo-footer      { border-left-color: var(--text-disabled); }

/* Header do bloco */
.bloco-visual-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}
.bloco-visual-num {
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent);
  color: #031a10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}
.bloco-visual-nome {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
  line-height: 1.3;
}
.bloco-tipo-badge {
  font-size: 9.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 99px;
  background: rgba(255,255,255,0.05);
  color: var(--text-disabled);
  border: 1px solid var(--border);
  flex-shrink: 0;
}
.bloco-badge-hero        { color: var(--accent2); border-color: var(--accent2); background: rgba(167,139,250,0.08); }
.bloco-badge-cta         { color: var(--accent);  border-color: var(--accent);  background: rgba(0,229,160,0.08); }
.bloco-badge-testimonial { color: #f59e0b; border-color: #f59e0b; background: rgba(245,158,11,0.08); }
.bloco-badge-pricing     { color: #10b981; border-color: #10b981; background: rgba(16,185,129,0.08); }
.bloco-badge-steps       { color: #3b82f6; border-color: #3b82f6; background: rgba(59,130,246,0.08); }
.bloco-badge-features    { color: #8b5cf6; border-color: #8b5cf6; background: rgba(139,92,246,0.08); }

/* Body do bloco */
.bloco-visual-body {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.bloco-row {
  display: grid;
  grid-template-columns: 68px 1fr;
  gap: 0.5rem;
  align-items: baseline;
}
.bloco-label {
  font-size: 9.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-disabled);
  padding-top: 2px;
  flex-shrink: 0;
}
.bloco-value {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.5;
}
.bloco-objetivo .bloco-value {
  font-style: italic;
  font-size: 12px;
  color: var(--text-disabled);
}
.bloco-titulo-text {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.35;
}
.bloco-cta-row { align-items: center; }
.bloco-cta-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  background: rgba(0,229,160,0.1);
  border: 1px solid rgba(0,229,160,0.25);
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--accent);
}
.bloco-layout-text {
  font-size: 11.5px;
  font-style: italic;
}
.bloco-condicional .bloco-value { font-size: 11.5px; color: var(--text-disabled); }

/* Fallback raw */
.bloco-raw { border-style: dashed; }
.bloco-raw-hint {
  font-size: 11px;
  color: var(--warning);
  margin-bottom: 0.5rem;
}

/* Preview empty */
.estrutura-preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-disabled);
  font-size: 13px;
}

/* Badge de contagem de blocos */
.estrutura-preview-badge {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  background: rgba(0,229,160,0.1);
  color: var(--accent);
  border: 1px solid rgba(0,229,160,0.2);
}
```

---

## CHECKLIST DE VALIDAÇÃO

Após implementar, testar:

- [ ] Botão "Gerar Estrutura" gera estrutura com 6-9 blocos
- [ ] Copy está em 1ª pessoa ("Eu ajudo...", "Meu método...")
- [ ] Coluna direita exibe cards numerados com tipo colorido
- [ ] Cada card mostra: número, nome, badge, objetivo, título, subtítulo, CTA, layout
- [ ] Botão "Refinar com IA" aceita texto e regenera
- [ ] Após refino, visualização atualiza automaticamente
- [ ] Botão "Aprovar Estrutura" salva e exibe banner verde
- [ ] Botão "Reeditar" reabre para edição
- [ ] Não há mais nenhuma referência ao wireframe visual antigo
