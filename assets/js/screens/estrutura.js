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

        </div>

        <!-- Coluna: wireframe -->
        <div class="estrutura-col-preview">
          <div class="estrutura-section-card estrutura-preview-card">
            <div class="estrutura-section-header">
              <i data-lucide="monitor" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Pré-visualização</span>
              <span class="estrutura-preview-badge">Hero + Seção 2</span>
            </div>

            ${wireframe ? `
            <div class="estrutura-wireframe-wrap">
              <div class="estrutura-browser-bar">
                <span class="preview-dot-r"></span>
                <span class="preview-dot-y"></span>
                <span class="preview-dot-g"></span>
                <span class="estrutura-url-bar">${(B.dominio || 'seusite.com.br').replace(/^https?:\/\//, '')}</span>
              </div>
              <div class="estrutura-wireframe-body">
                ${wireframe}
              </div>
            </div>
            ` : `
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

  gerarWireframeHTML(rascunho) {
    if (!rascunho) return '';

    // Parser de blocos: cada bloco começa com ### BLOCO N:
    const blocoRegex = /###\s*BLOCO\s*\d+:\s*(.+?)(?:\n)([\s\S]*?)(?=###\s*BLOCO|\nSEQUÊNCIA|$)/gi;
    const blocos = [];
    let match;

    while ((match = blocoRegex.exec(rascunho)) !== null && blocos.length < 2) {
      const nome = match[1].trim();
      const corpo = match[2].trim();

      // Extrair titulo, subtitulo e cta do corpo do bloco
      const titulo = (corpo.match(/(?:Título|título|H1|heading):\s*"?(.+?)"?(?:\n|$)/i) || [])[1]?.trim() || nome;
      const subtitulo = (corpo.match(/(?:Subtítulo|subtitulo|Sub):\s*"?(.+?)"?(?:\n|$)/i) || [])[1]?.trim() || '';
      const cta = (corpo.match(/CTA:\s*"?(.+?)"?(?:\n|$)/i) || [])[1]?.trim() || '';
      const objetivo = (corpo.match(/(?:Objetivo|objetivo).*?:\s*(.+?)(?:\n|$)/i) || [])[1]?.trim() || '';

      blocos.push({ nome, titulo, subtitulo, cta, objetivo, raw: corpo });
    }

    if (blocos.length === 0) return '';

    const [hero, secao2] = blocos;
    const dominio = this.B?.dominio?.replace(/^https?:\/\//, '') || 'seusite.com.br';

    return `
    <div style="font-family:'DM Sans',sans-serif;width:100%;overflow:hidden;">

      <!-- HERO -->
      <div style="background:linear-gradient(160deg,#0D0F19 0%,#131624 100%);padding:20px 16px 24px;position:relative;">
        <!-- Nav mock -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="width:20px;height:20px;background:var(--accent,#00E5A0);border-radius:4px;"></div>
            <div style="width:70px;height:7px;background:rgba(255,255,255,0.2);border-radius:4px;"></div>
          </div>
          <div style="background:var(--accent,#00E5A0);border-radius:4px;padding:5px 12px;font-size:8px;font-weight:700;color:#031A10;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;">
            ${hero?.cta || 'Falar no WhatsApp'}
          </div>
        </div>

        <!-- Hero content -->
        <div style="text-align:center;padding:0 4px;">
          <div style="display:inline-block;background:rgba(0,229,160,0.08);border:1px solid rgba(0,229,160,0.2);border-radius:99px;padding:3px 10px;font-size:7px;font-weight:700;color:var(--accent,#00E5A0);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">
            ${this.B?.segmento || 'Especialista'}
          </div>
          <div style="font-size:13px;font-weight:800;color:#ECEEF5;line-height:1.3;margin-bottom:8px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">
            ${hero?.titulo || 'Título principal da página'}
          </div>
          ${hero?.subtitulo ? `
          <div style="font-size:9px;color:#848698;line-height:1.5;margin-bottom:12px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
            ${hero.subtitulo}
          </div>
          ` : ''}
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
            <div style="background:var(--accent,#00E5A0);border-radius:6px;padding:7px 16px;font-size:8px;font-weight:700;color:#031A10;">
              ${hero?.cta || 'CTA Principal'}
            </div>
            <div style="border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:7px 16px;font-size:8px;color:#848698;">
              Saiba mais
            </div>
          </div>
          <!-- Proof strip -->
          <div style="display:flex;justify-content:center;gap:16px;margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.05);">
            ${[['⭐', '4.9'], ['👥', '200+'], ['✅', '100%']].map(([icon, val]) => `
              <div style="text-align:center;">
                <div style="font-size:10px;">${icon}</div>
                <div style="font-size:8px;font-weight:700;color:#ECEEF5;">${val}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      ${secao2 ? `
      <!-- SEÇÃO 2: ${secao2.nome} -->
      <div style="background:#0D0F19;padding:20px 16px;border-top:1px solid rgba(255,255,255,0.06);">
        <div style="text-align:center;margin-bottom:14px;">
          <div style="width:32px;height:2px;background:var(--accent,#00E5A0);border-radius:2px;margin:0 auto 8px;"></div>
          <div style="font-size:10px;font-weight:800;color:#ECEEF5;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
            ${secao2.titulo || secao2.nome}
          </div>
          ${secao2.objetivo ? `
          <div style="font-size:8px;color:#848698;margin-top:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
            ${secao2.objetivo}
          </div>
          ` : ''}
        </div>
        <!-- Content grid mock -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${[1, 2, 3, 4].map(() => `
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:10px;">
              <div style="width:16px;height:16px;background:rgba(0,229,160,0.15);border-radius:4px;margin-bottom:6px;"></div>
              <div style="width:80%;height:5px;background:rgba(255,255,255,0.12);border-radius:3px;margin-bottom:4px;"></div>
              <div style="width:100%;height:4px;background:rgba(255,255,255,0.06);border-radius:3px;"></div>
              <div style="width:60%;height:4px;background:rgba(255,255,255,0.06);border-radius:3px;margin-top:2px;"></div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

    </div>
    `;
  },

  reabrirEstrutura() {
    this.setField('estrutura_aprovada', '');
    this.renderScreen();
    this.showToast('Estrutura reaberta para edição.', 'info');
  },

  async gerarPrototipoVisual() {
    const B = this.B || {};
    const rascunho = B.estrutura_rascunho || '';

    if (!rascunho) {
      this.showToast('Gere a estrutura antes do protótipo visual.', 'warning');
      return;
    }

    const hasGemini = this.state.apiKeys?.gemini?.trim();
    if (!hasGemini) {
      this.showToast('Protótipo visual requer API Key Gemini (gratuita).', 'warning');
      return;
    }

    this.openAILog('Gerando Protótipo Visual', [
      { id: 1, icon: 'layout', label: 'Preparando estrutura...' },
      { id: 2, icon: 'image', label: 'Enviando para Gemini Image...' },
      { id: 3, icon: 'sparkles', label: 'Renderizando protótipo...' },
      { id: 4, icon: 'check-circle', label: 'Concluído!' },
    ]);

    try {
      this.aiLogStep(1);
      const cores = B.cor_primaria || '#1e293b';
      const nomeMarca = B.nome_cliente || B.nome_marca || 'Empresa';
      const segmento = B.segmento || B.nicho || 'serviço';

      const prompt = `
Você é um designer UI especializado em landing pages.
Crie um mockup visual de landing page mobile (320x900px) com fundo branco.

MARCA: ${nomeMarca}
SEGMENTO: ${segmento}
COR PRIMÁRIA: ${cores}

ESTRUTURA DA PÁGINA:
${rascunho.substring(0, 3000)}

INSTRUÇÕES DE DESIGN:
- Estilo clean e moderno
- Use a cor primária nos CTAs e destaques
- Renderize cada seção claramente separada
- Mostre os títulos e textos reais da estrutura
- Inclua elementos visuais de placeholder (formas geométricas para imagens)
- CTAs com botões bem visíveis
- Typography hierárquica clara
- Mobile-first (largura 320px)

Gere apenas a imagem do mockup, sem texto explicativo.
`;

      await this.aiLogDelay(300);
      this.aiLogStep(2);

      const imagemBase64 = await this.callGeminiImage(prompt);

      this.aiLogStep(3);
      this.setField('estrutura_prototipo_img', imagemBase64);
      await this.aiLogDelay(500);

      this.aiLogStep(4);
      await this.aiLogDelay(300);
      this.closeAILog();
      this.renderScreen();
      this.showToast('Protótipo visual gerado!', 'success');
    } catch (err) {
      this.closeAILog();
      // Fallback: mostrar mensagem informativa sobre opções
      this.showModalPrototipoFallback(err.message);
    }
  },

  showModalPrototipoFallback(erroMsg) {
    const opcoes = [
      {
        nome: 'Gemini AI Studio',
        url: 'https://aistudio.google.com',
        gratuito: true,
        descricao: 'Use gemini-2.5-flash-image para geração de imagens. Cole o prompt do wireframe.',
      },
      {
        nome: 'v0.dev (Vercel)',
        url: 'https://v0.dev',
        gratuito: true,
        descricao: 'Gera componentes React/HTML a partir de descrição. Excelente para protótipos.',
      },
      {
        nome: 'Galileo AI',
        url: 'https://www.usegalileo.ai',
        gratuito: false,
        descricao: 'Protótipos de UI de alta qualidade. Plano pago mas free trial disponível.',
      },
      {
        nome: 'Uizard',
        url: 'https://uizard.io',
        gratuito: true,
        descricao: 'Converte wireframe em design. Plano gratuito disponível.',
      },
    ];

    const html = `
      <div class="modal-body">
        <p style="color:var(--text-secondary);font-size:13px;margin-bottom:var(--space-4);">
          ${erroMsg ? `Erro: ${erroMsg}` : ''}
          Use uma das ferramentas abaixo para gerar o protótipo visual:
        </p>
        ${opcoes.map(o => `
          <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:var(--space-2);">
            <div style="flex:1;">
              <div style="font-weight:700;font-size:13px;">${o.nome}
                ${o.gratuito ? '<span style="background:var(--success-bg,#dcfce7);color:#16a34a;font-size:10px;padding:1px 6px;border-radius:10px;font-weight:600;margin-left:4px;">FREE</span>' : ''}
              </div>
              <div style="font-size:12px;color:var(--text-secondary);">${o.descricao}</div>
            </div>
            <a href="${o.url}" target="_blank" class="btn-ghost btn-sm" style="white-space:nowrap;">
              Abrir <i data-lucide="external-link" style="width:11px;height:11px"></i>
            </a>
          </div>
        `).join('')}
      </div>
    `;

    this.openModal('modal-prototipo-fallback');
    document.getElementById('modal-prototipo-fallback-body').innerHTML = html;
    lucide.createIcons();
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
    const wireframeHTML = this.gerarWireframeHTML(template);
    this.setField('estrutura_wireframe', wireframeHTML);
    this.renderScreen();
  },

});

function detectarTipoBloco(nome) {
  const n = nome.toLowerCase();
  if (n.includes('cabeçalho') || n.includes('header') || n.includes('nav')) return 'header';
  if (n.includes('hero')) return 'hero';
  if (n.includes('como funciona') || n.includes('passo')) return 'steps';
  if (n.includes('diferencial')) return 'features';
  if (n.includes('plano') || n.includes('preço')) return 'pricing';
  if (n.includes('depoimento') || n.includes('prova')) return 'testimonials';
  if (n.includes('avaliação') || n.includes('google')) return 'reviews';
  if (n.includes('faq')) return 'faq';
  if (n.includes('contato') || n.includes('formulário')) return 'contact';
  if (n.includes('cta') || n.includes('chamada final')) return 'cta';
  if (n.includes('localização') || n.includes('mapa')) return 'map';
  if (n.includes('instagram') || n.includes('feed')) return 'instagram';
  if (n.includes('rodapé') || n.includes('footer')) return 'footer';
  return 'generic';
}

function renderBlocoWireframe(bloco, index, tipo) {
  const cores = {
    header: { bg: '#1e293b', label: '#94a3b8', accent: '#3b82f6' },
    hero: { bg: '#0f172a', label: '#64748b', accent: '#6366f1' },
    steps: { bg: '#f8fafc', label: '#475569', accent: '#0ea5e9' },
    features: { bg: '#f1f5f9', label: '#475569', accent: '#8b5cf6' },
    pricing: { bg: '#fafafa', label: '#64748b', accent: '#f59e0b' },
    testimonials: { bg: '#f8fafc', label: '#64748b', accent: '#10b981' },
    reviews: { bg: '#ffffff', label: '#64748b', accent: '#f59e0b' },
    faq: { bg: '#f8fafc', label: '#64748b', accent: '#6366f1' },
    contact: { bg: '#f1f5f9', label: '#64748b', accent: '#10b981' },
    cta: { bg: '#0f172a', label: '#94a3b8', accent: '#f59e0b' },
    map: { bg: '#e2e8f0', label: '#475569', accent: '#ef4444' },
    instagram: { bg: '#fdf2f8', label: '#9d4edd', accent: '#ec4899' },
    footer: { bg: '#1e293b', label: '#64748b', accent: '#475569' },
    generic: { bg: '#f8fafc', label: '#475569', accent: '#6366f1' },
  };

  const cor = cores[tipo] || cores.generic;
  const isDark = ['header', 'hero', 'cta', 'footer'].includes(tipo);
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const subColor = isDark ? '#94a3b8' : '#64748b';

  const innerLayouts = {
    header: `
      <div style="display:flex;justify-content:space-between;align-items:center;width:100%;padding:0 12px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <div style="width:18px;height:18px;background:${cor.accent};border-radius:3px;opacity:0.8;"></div>
          <div style="width:60px;height:8px;background:${isDark ? '#475569' : '#cbd5e1'};border-radius:4px;"></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <div style="width:30px;height:6px;background:${isDark ? '#475569' : '#cbd5e1'};border-radius:3px;"></div>
          <div style="width:30px;height:6px;background:${isDark ? '#475569' : '#cbd5e1'};border-radius:3px;"></div>
          <div style="background:${cor.accent};padding:3px 10px;border-radius:3px;font-size:7px;color:#fff;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;">${bloco.cta || 'CTA'}</div>
        </div>
      </div>`,

    hero: `
      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:8px 16px;width:100%;">
        <div style="font-size:11px;font-weight:800;color:${textColor};line-height:1.3;max-width:200px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${bloco.titulo || 'Título Principal'}</div>
        <div style="font-size:8px;color:${subColor};max-width:180px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${bloco.subtitulo || 'Subtítulo de apoio'}</div>
        <div style="background:${cor.accent};padding:6px 16px;border-radius:3px;font-size:8px;font-weight:700;color:#fff;margin-top:4px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${bloco.cta || 'CTA Principal'}</div>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <div style="width:60px;height:40px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:3px;opacity:0.6;"></div>
          <div style="width:60px;height:40px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:3px;opacity:0.4;"></div>
        </div>
      </div>`,

    steps: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:8px;">${bloco.titulo || 'Como Funciona'}</div>
        <div style="display:flex;gap:6px;justify-content:center;">
          ${[1, 2, 3, 4].map(n => `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;">
            <div style="width:20px;height:20px;background:${cor.accent};border-radius:50%;font-size:8px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;">${n}</div>
            <div style="width:100%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;"></div>
            <div style="width:70%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;opacity:0.6;"></div>
          </div>`).join('')}
        </div>
      </div>`,

    features: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:8px;">${bloco.titulo || 'Diferenciais'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
          ${[1, 2, 3, 4].map(() => `<div style="background:${isDark ? '#1e293b' : '#ffffff'};border-radius:4px;padding:5px;display:flex;flex-direction:column;gap:2px;">
            <div style="width:14px;height:14px;background:${cor.accent};border-radius:3px;opacity:0.7;"></div>
            <div style="width:80%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;"></div>
            <div style="width:100%;height:3px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;opacity:0.6;"></div>
          </div>`).join('')}
        </div>
      </div>`,

    pricing: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:8px;">${bloco.titulo || 'Planos'}</div>
        <div style="display:flex;gap:5px;">
          ${[1, 2, 3].map((n, i) => `<div style="flex:1;background:${i === 1 ? cor.accent : '#ffffff'};border:${i === 1 ? 'none' : '1px solid #e2e8f0'};border-radius:4px;padding:5px;display:flex;flex-direction:column;gap:3px;align-items:center;">
            <div style="width:70%;height:4px;background:${i === 1 ? 'rgba(255,255,255,0.4)' : '#e2e8f0'};border-radius:2px;"></div>
            <div style="font-size:9px;font-weight:800;color:${i === 1 ? '#fff' : textColor};">R$${n * 300}</div>
            <div style="width:80%;height:3px;background:${i === 1 ? 'rgba(255,255,255,0.3)' : '#e2e8f0'};border-radius:2px;"></div>
          </div>`).join('')}
        </div>
      </div>`,

    testimonials: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:6px;">${bloco.titulo || 'Depoimentos'}</div>
        <div style="display:flex;gap:5px;">
          ${[1, 2].map(() => `<div style="flex:1;background:#ffffff;border-radius:4px;padding:6px;border:1px solid #e2e8f0;">
            <div style="display:flex;gap:2px;margin-bottom:3px;">${[1, 2, 3, 4, 5].map(() => '<span style="color:#f59e0b;font-size:8px;">★</span>').join('')}</div>
            <div style="width:100%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:2px;"></div>
            <div style="width:80%;height:3px;background:#e2e8f0;border-radius:2px;opacity:0.7;margin-bottom:4px;"></div>
            <div style="display:flex;align-items:center;gap:3px;">
              <div style="width:12px;height:12px;background:#e2e8f0;border-radius:50%;"></div>
              <div style="width:40px;height:3px;background:#e2e8f0;border-radius:2px;"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>`,

    cta: `
      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:8px 16px;width:100%;">
        <div style="font-size:10px;font-weight:800;color:${textColor};line-height:1.3;max-width:200px;">${bloco.titulo || 'CTA Final'}</div>
        <div style="font-size:8px;color:${subColor};max-width:160px;">${bloco.subtitulo || 'Subtítulo'}</div>
        <div style="background:${cor.accent};padding:6px 20px;border-radius:3px;font-size:8px;font-weight:700;color:#fff;margin-top:4px;">${bloco.cta || 'Botão CTA'}</div>
      </div>`,

    faq: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};margin-bottom:6px;">${bloco.titulo || 'FAQ'}</div>
        ${[1, 2, 3].map(() => `<div style="border-bottom:1px solid #e2e8f0;padding:5px 0;display:flex;justify-content:space-between;align-items:center;">
          <div style="width:75%;height:4px;background:#e2e8f0;border-radius:2px;"></div>
          <div style="font-size:10px;color:#94a3b8;">›</div>
        </div>`).join('')}
      </div>`,

    footer: `
      <div style="width:100%;padding:6px 12px;display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;flex-direction:column;gap:3px;">
          <div style="width:50px;height:6px;background:#334155;border-radius:2px;"></div>
          <div style="width:70px;height-4px;height:4px;background:#334155;border-radius:2px;opacity:0.5;"></div>
        </div>
        <div style="display:flex;gap:5px;">
          ${[1, 2, 3].map(() => `<div style="width:16px;height:16px;background:#334155;border-radius:50%;opacity:0.5;"></div>`).join('')}
        </div>
      </div>`,

    generic: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:6px;">${bloco.titulo || bloco.nome}</div>
        <div style="width:100%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;margin-bottom:3px;"></div>
        <div style="width:70%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;opacity:0.6;margin:0 auto;"></div>
      </div>`,
  };

  const innerHTML = innerLayouts[tipo] || innerLayouts.generic;

  return `
      <div class="wf-block-v2" data-index="${index}" data-tipo="${tipo}" style="background:${cor.bg};">
        <div class="wf-block-badge" style="background:${cor.accent};">${index + 1}</div>
        <div class="wf-block-inner">
          ${innerHTML}
        </div>
      </div>`;
}
