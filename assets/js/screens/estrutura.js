/* ============================================================
   LandingAI v2 — Lógica da Tela de Estrutura
   ============================================================ */

Object.assign(window.App, {

  renderEstrutura() {
    const B = this.B || {};
    const rascunho = B.estrutura_rascunho || '';
    const aprovada = B.estrutura_aprovada;
    const wireframe = B.estrutura_wireframe || '';

    return `
    <div class="estrutura-screen">

      ${aprovada ? `
      <div class="aprovado-banner">
        <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--accent)"></i>
        <span>Estrutura aprovada</span>
        <button class="btn-ghost btn-sm" onclick="App.setField('estrutura_aprovada', ''); App.renderScreen();">
          Reeditar
        </button>
      </div>
      ` : ''}

      <div class="estrutura-layout">

        <!-- Coluna: controles -->
        <div class="estrutura-col-controls">

          <div class="estrutura-section-card">
            <div class="estrutura-section-header">
              <i data-lucide="sparkles" style="width:15px;height:15px;color:var(--accent2)"></i>
              <span class="estrutura-section-title">Gerar com IA</span>
            </div>
            <p class="estrutura-section-desc">
              A IA lê o briefing completo e define a sequência de blocos, copy de cada seção e ordem narrativa.
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

          ${rascunho ? `
          <div class="estrutura-section-card">
            <div class="estrutura-section-header">
              <i data-lucide="file-text" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Rascunho</span>
            </div>
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

          ${rascunho && !aprovada ? `
          <!-- Card de Refinamento com IA -->
          <div class="estrutura-section-card estrutura-feedback-card">
            <div class="estrutura-section-header">
              <i data-lucide="message-square" style="width:15px;height:15px;color:var(--accent)"></i>
              <span class="estrutura-section-title">Refinar com IA</span>
            </div>
            <p class="estrutura-section-desc">
              Não gostou de algum ponto? Descreva o ajuste e a IA refina mantendo o briefing original.
              Funciona como uma conversa — você pode pedir várias vezes.
            </p>
            <textarea
              class="field-textarea estrutura-textarea"
              id="estrutura-feedback-input"
              rows="4"
              placeholder="Ex: O tom ficou muito formal, quero mais direto e urgente. Também muda o CTA do Hero para algo mais específico ao problema do cliente..."
            ></textarea>
            <button class="btn-primary" id="btn-refinar-estrutura" style="margin-top:10px;width:100%">
              <i data-lucide="refresh-cw" style="width:14px;height:14px"></i>
              Refinar Estrutura com IA
            </button>
          </div>
          ` : ''}

        </div>

        <!-- Coluna: wireframe -->
        <div class="estrutura-col-preview">
          <div class="estrutura-section-card estrutura-preview-card">
            <div class="estrutura-section-header">
              <i data-lucide="monitor" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Pré-visualização</span>
              <span class="estrutura-preview-badge">Hero + Seção 2</span>
            </div>

            ${rascunho ? this.renderVisualBlocks(rascunho) : `
            <div class="estrutura-preview-empty">
              <i data-lucide="layout" style="width:32px;height:32px;color:var(--text-disabled)"></i>
              <p>A pré-visualização aparece após gerar a estrutura</p>
            </div>
            `}
          </div>
        </div>

      </div>

    </div>
    `;
  },

  renderVisualBlocks(rascunho) {
    if (!rascunho) return '';

    // Regex para capturar blocos: ### BLOCO N: Nome do Bloco
    const blocoRegex = /###\s*BLOCO\s*(\d+)[:\-]?\s*([^\n]+)/gi;
    const blocos = [];
    let match;

    while ((match = blocoRegex.exec(rascunho)) !== null) {
      const index = match[1];
      const nome = match[2].trim();
      
      // Capturar o conteúdo até o próximo bloco ou fim da sequência
      const startIdx = match.index + match[0].length;
      let endIdx = rascunho.indexOf('### BLOCO', startIdx);
      if (endIdx === -1) endIdx = rascunho.indexOf('### SEQUÊNCIA', startIdx);
      if (endIdx === -1) endIdx = rascunho.length;
      
      const corpo = rascunho.substring(startIdx, endIdx).trim();

      // Extrair campos chave
      const extrair = (chave) => {
        const r = new RegExp(`[\\*\\-]?\\s*${chave}[:\\s]+[""]?(.+?)[""]?(?:\\n|$)`, 'i');
        return corpo.match(r)?.[1]?.trim() || '';
      };

      blocos.push({
        num: index,
        nome: nome,
        objetivo: extrair('Objetivo'),
        titulo: extrair('Título') || extrair('H1') || extrair('Heading'),
        copy: extrair('Copy') || extrair('Texto'),
        cta: extrair('CTA') || extrair('Botão'),
        condicional: extrair('Condicional') || extrair('Regra')
      });
    }

    if (blocos.length === 0) return `<div class="estrutura-preview-empty">Formato de rascunho inválido.</div>`;

    return `
      <div class="estrutura-visual-preview">
        ${blocos.map(b => `
          <div class="block-card">
            <div class="block-header">
              <span class="block-name">Bloco ${b.num}: ${b.nome}</span>
              ${b.condicional ? `<span class="block-badge">Condicional</span>` : ''}
            </div>
            <div class="block-content">
              ${b.objetivo ? `<div class="block-row"><span class="block-label">Objetivo:</span><span class="block-value">${b.objetivo}</span></div>` : ''}
              ${b.titulo ? `<div class="block-row"><span class="block-label">Título:</span><span class="block-value"><strong>${b.titulo}</strong></span></div>` : ''}
              ${b.copy ? `<div class="block-row"><span class="block-label">Copy:</span><span class="block-value block-copy">"${b.copy}"</span></div>` : ''}
              ${b.cta ? `<div class="block-cta">${b.cta}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ─── Refinamento de Estrutura com IA (loop de feedback) ──────────────────
  async refinarEstrutura() {
    const feedbackInput = document.getElementById('estrutura-feedback-input');
    const feedback = feedbackInput?.value?.trim();

    if (!feedback) {
      this.showToast('Descreva o que deseja ajustar antes de refinar.', 'warning');
      feedbackInput?.focus();
      return;
    }

    const rascunhoAtual = this.B.estrutura_rascunho || '';
    if (!rascunhoAtual) {
      this.showToast('Gere a estrutura primeiro antes de refinar.', 'warning');
      return;
    }

    this.openAILog('Refinando Estrutura', [
      { id: 1, label: 'Analisando seu feedback...' },
      { id: 2, label: 'Ajustando estrutura e copy...' },
      { id: 3, label: 'Atualizando pré-visualização...' },
    ]);

    this.aiLogStep(1);
    await this.aiLogDelay(500);

    const resumoBriefing = this.buildResumoBriefing();

    const prompt = `Você é especialista em copywriting e estrutura de landing pages de alta conversão.

## CONTEXTO
Você gerou anteriormente a seguinte estrutura de landing page para um cliente:

${rascunhoAtual}

## FEEDBACK DO CLIENTE (APLICAR OBRIGATORIAMENTE)
${feedback}

## SUA TAREFA
1. Revise a estrutura acima aplicando EXATAMENTE o que foi pedido no feedback.
2. Mantenha a mesma formatação: ### BLOCO N: NOME DO BLOCO
3. Mantenha todos os blocos existentes — apenas ajuste o conteúdo pedido.
4. Não invente dados que não estão no briefing abaixo.
5. Retorne SOMENTE a estrutura revisada, sem explicações antes ou depois.
6. Se o feedback pedir mudança de tom, ajuste TODA a copy de acordo.

## BRIEFING DO CLIENTE (referência)
${resumoBriefing}`;

    this.aiLogStep(2, 'Isso pode levar alguns segundos...');

    try {
      const res = await this.callAI(prompt);

      this.aiLogStep(3);
      await this.aiLogDelay(400);

      this.setField('estrutura_rascunho', res);

      this.aiLogDone();
      await this.aiLogDelay(500);
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura refinada! Confira o resultado.', 'success');
    } catch (err) {
      this.aiLogError(2, err.message || 'Erro ao refinar. Tente novamente.');
    }
  },

  // ─── Resumo compacto do briefing para uso no prompt de refinamento ────────
  buildResumoBriefing() {
    const B = this.B || {};
    return [
      `Cliente: ${B.nome_cliente || '—'}`,
      `Segmento: ${B.segmento || '—'}`,
      `Serviço principal: ${B.servico_principal || '—'}`,
      `Público-alvo: ${B.publico_alvo || '—'}`,
      `Dor principal: ${B.dor_principal || '—'}`,
      `Desejo principal: ${B.desejo_principal || '—'}`,
      `Tom de comunicação: ${B.tom_comunicacao || '—'}`,
      `Diferencial 1: ${B.diferencial1_titulo || '—'} — ${B.diferencial1_descricao || '—'}`,
      `Diferencial 2: ${B.diferencial2_titulo || '—'} — ${B.diferencial2_descricao || '—'}`,
      `Garantia: ${B.garantia || '—'}`,
      `WhatsApp / CTA: ${B.whatsapp || '—'}`,
    ].join('\n');
  },

  reabrirEstrutura() {
    this.setField('estrutura_aprovada', '');
    this.renderScreen();
    this.showToast('Estrutura reaberta para edição.', 'info');
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

});


