/* ============================================================
   LandingAI v3 — Screen: Structure
   ============================================================ */

Object.assign(window.App, {
  buildStructureScreen() {
    return this.buildEstruturaHTML();
  },

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

  async runEstruturaAnalysis() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    this.openAILog('Gerando Estrutura da Landing Page', [
      { id: 1, icon: 'file-text', label: 'Lendo briefing completo...' },
      { id: 2, icon: 'layout', label: 'Definindo blocos e ordem narrativa...' },
      { id: 3, icon: 'sparkles', label: 'Gerando copy de cada bloco...' },
      { id: 4, icon: 'monitor', label: 'Gerando wireframe visual...' },
      { id: 5, icon: 'check-circle', label: 'Finalizando estrutura...' },
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
      this.showToast('Erro ao gerar estrutura: ' + err.message, 'error');
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
    const rascunho = this.state.briefing.estrutura_rascunho;
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

  gerarWireframeHTML(estruturaText) {
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
      const isCTA = nome.includes('CTA');
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
  }
});
