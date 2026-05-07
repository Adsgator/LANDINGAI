/* ============================================================
   LandingAI v2 — Lógica da Tela de Estrutura
   ============================================================ */

Object.assign(window.App, {
    renderEstrutura() {
        const B = this.B || {};
        const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
        const rascunho = B.estrutura_rascunho || '';
        const aprovada = B.estrutura_aprovada || '';

        // Parseia blocos para o painel de copy
        const blocos = [];
        const blocoRegex = /### BLOCO \d+: (.+?)\n([\s\S]*?)(?=### BLOCO \d+:|### SEQUÊNCIA|$)/g;
        let m;
        while ((m = blocoRegex.exec(rascunho)) !== null) {
            const nome = m[1].trim();
            const corpo = m[2];
            const objetivoMatch = corpo.match(/\*\*Objetivo narrativo:\*\*\s*(.+?)(?=\n\*\*|$)/s);
            const tituloMatch = corpo.match(/[-•]\s*Título:\s*"?(.+?)"?\n/);
            const subMatch = corpo.match(/[-•]\s*Subtítulo:\s*"?(.+?)"?\n/);
            const ctaMatch = corpo.match(/[-•]\s*CTA[^:]*:\s*"?(.+?)"?\n/);
            blocos.push({
                nome,
                objetivo: objetivoMatch?.[1]?.trim() || '',
                titulo: tituloMatch?.[1]?.trim() || '',
                subtitulo: subMatch?.[1]?.trim() || '',
                cta: ctaMatch?.[1]?.trim() || '',
            });
        }

        const copyPanel = rascunho ? blocos.map((b, i) => `
      <div class="copy-bloco-card" data-index="${i}" onclick="document.querySelector('.wf-block-v2[data-index=\\'${i}\\']')?.scrollIntoView({behavior:'smooth'})">
        <div class="copy-bloco-card-header">
          <div class="copy-bloco-numero">${i + 1}</div>
          <div class="copy-bloco-nome">${b.nome}</div>
        </div>
        ${b.objetivo ? `<div class="copy-bloco-objetivo" style="background:var(--bg);padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);margin-bottom:var(--space-4);border-left:3px solid var(--accent);">${b.objetivo}</div>` : ''}
        
        <div style="display:grid;gap:var(--space-4);">
          ${b.titulo ? `
            <div class="copy-field">
              <span class="copy-field-label">Título Principal (H1/H2)</span>
              <span class="copy-field-value" style="font-size:15px;font-weight:700;">${b.titulo}</span>
            </div>` : ''}
          ${b.subtitulo ? `
            <div class="copy-field">
              <span class="copy-field-label">Subtítulo / Apoio Narrativo</span>
              <span class="copy-field-value">${b.subtitulo}</span>
            </div>` : ''}
          ${b.cta ? `
            <div class="copy-field">
              <span class="copy-field-label">Chamada para Ação (CTA)</span>
              <span class="copy-field-value" style="color:var(--accent);font-weight:700;border-color:var(--accent-dim);background:var(--accent-dim);">${b.cta}</span>
            </div>` : ''}
        </div>
      </div>
    `).join('') : '';

        return `
      <div class="estrutura-wrap">
        ${aprovada ? `
          <div class="status-banner status-success" style="margin-bottom:var(--space-6);">
            <i data-lucide="check-circle" style="width:16px;height:16px"></i>
            Estrutura aprovada — Pronta para implementação.
          </div>
        ` : ''}

        ${!rascunho ? `
          <div class="estrutura-empty">
            <i data-lucide="layout" style="width:48px;height:48px;color:var(--text-disabled);margin-bottom:var(--space-4);"></i>
            <h2 style="font-size:18px;font-weight:700;margin-bottom:var(--space-2);">Sua Landing Page Começa Aqui</h2>
            <p style="color:var(--text-secondary);max-width:400px;margin:0 auto var(--space-6);">Deixe a IA analisar seu briefing e propor a melhor estrutura narrativa e copy para conversão.</p>
            <div class="estrutura-actions" style="display:flex;justify-content:center;gap:var(--space-4);">
              <button class="btn-primary" onclick="App.runEstruturaAnalysis()" ${!hasKey ? 'disabled' : ''}>
                <i data-lucide="sparkles" style="width:16px;height:16px"></i>
                Gerar Estrutura com IA
              </button>
              <button class="btn-ghost" onclick="App.abrirEstruturaManual()">
                <i data-lucide="edit" style="width:16px;height:16px"></i>
                Definir manualmente
              </button>
            </div>
          </div>
        ` : `
          <div class="estrutura-layout">

            <!-- Painel de copy (50%) -->
            <div class="estrutura-copy-panel">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);background:var(--surface);padding:var(--space-3);border-radius:var(--radius-md);border:1px solid var(--border);position:sticky;top:0;z-index:10;">
                <div>
                    <h3 style="font-size:14px;font-weight:800;color:var(--text-primary);">REVISÃO DE COPY</h3>
                    <p style="font-size:11px;color:var(--text-secondary);">${blocos.length} blocos estratégicos</p>
                </div>
                <div style="display:flex;gap:var(--space-2);">
                  ${!aprovada ? `
                    <button class="btn-ghost btn-sm" onclick="App.runEstruturaAnalysis()" title="Regerar toda a estrutura">
                      <i data-lucide="refresh-cw" style="width:12px;height:12px"></i> Regerar
                    </button>
                    <button class="btn-primary btn-sm" onclick="App.aprovarEstrutura()">
                      <i data-lucide="check" style="width:12px;height:12px"></i> Aprovar Estrutura
                    </button>
                  ` : `
                    <button class="btn-ghost btn-sm" onclick="App.reabrirEstrutura()">
                      <i data-lucide="edit-2" style="width:12px;height:12px"></i> Reabrir para Edição
                    </button>
                  `}
                </div>
              </div>
              
              ${copyPanel}

              <!-- Editor Bruto -->
              <div style="margin-top:var(--space-8);padding-top:var(--space-6);border-top:1px solid var(--border);">
                <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);">
                    <i data-lucide="code" style="width:14px;height:14px;color:var(--text-disabled);"></i>
                    <label class="field-label" style="margin-bottom:0;">ESTRUTURA BRUTA (MARKDOWN)</label>
                </div>
                <textarea
                  class="field-input"
                  style="min-height:300px;font-size:12px;font-family:'Fira Code', monospace;background:var(--bg);line-height:1.6;"
                  placeholder="A estrutura gerada aparece aqui para edição livre..."
                  oninput="App.setField('estrutura_rascunho', this.value); App.renderScreen();"
                >${rascunho}</textarea>
              </div>
            </div>

            <!-- Wireframe visual (50%) -->
            <div class="wireframe-sticky-wrap">
              <div style="background:var(--surface);padding:var(--space-4);border-radius:var(--radius-lg);border:1px solid var(--border);width:100%;box-shadow:var(--shadow-sm);">
                  <div style="font-size:12px;font-weight:800;color:var(--text-primary);text-align:center;margin-bottom:var(--space-4);display:flex;align-items:center;justify-content:center;gap:var(--space-2);">
                    <i data-lucide="smartphone" style="width:14px;height:14px"></i> PREVIEW DO WIREFRAME
                  </div>
                  
                  <div style="max-height:65vh;overflow-y:auto;padding-right:var(--space-2);scrollbar-width:thin;">
                    ${B.estrutura_wireframe || '<div class="wireframe-placeholder">Gerando wireframe...</div>'}
                  </div>

                  ${hasKey ? `
                    <button class="btn-primary" style="width:100%;margin-top:var(--space-4);background:linear-gradient(135deg, var(--accent), #4f46e5);border:none;height:44px;"
                      onclick="App.gerarPrototipoVisual()">
                      <i data-lucide="sparkles" style="width:16px;height:16px"></i>
                      Gerar Protótipo Visual com IA
                    </button>
                    <p style="font-size:10px;color:var(--text-disabled);text-align:center;margin-top:var(--space-2);">
                        Usa Gemini 2.5 Flash Image para criar um mockup de alta fidelidade
                    </p>
                  ` : ''}
              </div>
              
              ${B.estrutura_prototipo_img ? `
                <div style="width:100%;background:var(--surface);padding:var(--space-4);border-radius:var(--radius-lg);border:1px solid var(--border);margin-top:var(--space-4);">
                    <div style="font-size:11px;font-weight:700;margin-bottom:var(--space-3);text-transform:uppercase;color:var(--text-secondary);">Protótipo Visual Gerado</div>
                    <img src="${B.estrutura_prototipo_img}" style="width:100%;border-radius:var(--radius-md);box-shadow:var(--shadow-md);cursor:pointer;" onclick="window.open(this.src)">
                </div>
              ` : ''}
            </div>

          </div>
        `}
      </div>
    `;

        ${!hasKey ? `<span class="no-key-warn">
          <i data-lucide="alert-triangle" style="width:13px;height:13px"></i>
          Configure uma API Key para usar a geração automática
        </span>` : ''}
      </div>
    `;
    },

    gerarWireframeHTML(estruturaText) {
        // Parseia os blocos da estrutura
        const blocoRegex = /### BLOCO \d+: (.+?)\n([\s\S]*?)(?=### BLOCO \d+:|### SEQUÊNCIA|$)/g;
        const blocos = [];
        let match;

        while ((match = blocoRegex.exec(estruturaText)) !== null) {
            const nome = match[1].trim();
            const corpo = match[2];

            const objetivoMatch = corpo.match(/\*\*Objetivo narrativo:\*\*\s*(.+?)(?=\n\*\*|$)/s);
            const tituloMatch = corpo.match(/[-•]\s*Título:\s*"?(.+?)"?\n/);
            const subMatch = corpo.match(/[-•]\s*Subtítulo:\s*"?(.+?)"?\n/);
            const ctaMatch = corpo.match(/[-•]\s*CTA[^:]*:\s*"?(.+?)"?\n/);

            blocos.push({
                nome,
                objetivo: objetivoMatch?.[1]?.trim() || '',
                titulo: tituloMatch?.[1]?.trim() || '',
                subtitulo: subMatch?.[1]?.trim() || '',
                cta: ctaMatch?.[1]?.trim() || '',
            });
        }

        if (blocos.length === 0) return '<div class="wireframe-placeholder">Estrutura não reconhecida. Verifique o formato gerado.</div>';

        const blocosHTML = blocos.map((bloco, i) => {
            const tipo = detectarTipoBloco(bloco.nome);
            return renderBlocoWireframe(bloco, i, tipo);
        }).join('');

        return `<div class="wireframe-device">${blocosHTML}</div>`;
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
                descricao: 'Use gemini-2.0-flash-exp para geração de imagens. Cole o prompt do wireframe.',
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
});
