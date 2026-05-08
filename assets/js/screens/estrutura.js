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
