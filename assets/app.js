const REGRAS_FIXAS_ADSGATOR = `
> A PARTE 11 contém as Regras Fixas da Adsgator. Não altere ou resumo.
> Utilize integralmente ao gerar a Ficha de Implementação.

1. O layout deve ser mobile-first, pensado para 375px e expandido para desktop.
2. A tipografia deve seguir uma hierarquia clara e funcional (H1, H2, H3, P).
3. Todo formulário deve ter validação inline visual.
4. Animações devem focar no UX e conversão, sem excessos gratuitos.
5. Cores devem respeitar contraste de acessibilidade (WCAG AA).
`;

const AI_MODELS = {
  'gemini-3-flash': { name: 'Gemini 3.0 Flash', provider: 'gemini', endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', maxTokens: 65536, temp: 0.65 },
  'gemini-3-pro': { name: 'Gemini 3.0 Pro', provider: 'gemini', endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent', maxTokens: 65536, temp: 0.65 },
  'claude-sonnet': { name: 'Claude Sonnet 3.5', provider: 'claude', endpoint: 'https://api.anthropic.com/v1/messages', maxTokens: 8192, temp: 0.7 },
  'grok-3': { name: 'Grok 3', provider: 'grok', endpoint: 'https://api.x.ai/v1/chat/completions', maxTokens: 32000, temp: 0.7 },
  'mistral-large': { name: 'Mistral Large', provider: 'mistral', endpoint: 'https://api.mistral.ai/v1/chat/completions', maxTokens: 32000, temp: 0.6 }
};

const defaultBriefing = {
  nome_cliente: '', nome_marca: '', slug: '', segmento: '', tipo: '',
  whatsapp: '', email: '', horarios: '', gtm_id: '',
  instagram: '', tiktok: '', youtube: '', outras_redes: '',
  modalidade: '', endereco: '', exibir_localizacao: '', cidades_atendimento: '', plataforma_online: '',
  servicos_lista: '', servicos_descricao: '', servico_principal: '', objetivo_conversao: '', objetivo_outro: '', preco_exibir: '', preco_valor: '', preco_condicao: '', oferta_especial: '',
  publico_primario: '', publico_dor: '', publico_resultado: '', publico_secundario: '', faq: '',
  diferencial: '', historia: '', frase_impacto: '', depoimentos: '', depoimentos_formato: [], depoimentos_qtd: '', google_business: '', google_nota: '', google_qtd: '', casos_resultados: '',
  estilo_desejado: '', sensacao_visitante: '', referencias_pessoais: '', referencias_nicho: '', cor_principal: '', cor_secundaria: '', logo_disponivel: '', tema: '', intensidade_visual: '', footer_tom: '', footer_elemento: '', footer_sensacao: '', menu_mobile_estilo: '', menu_mobile_especial: '', o_que_nao_quero: '', referencia_marca: '',
  foto_profissional: '', assets_outros: '', dominio: '', cnpj: '', aviso_legal: '', restricoes: '', integracoes: [], instrucoes_adicionais: '', briefing_bruto: ''
};

const criticalFields = {
  1: ['nome_cliente', 'tipo', 'segmento'],
  2: ['whatsapp', 'objetivo_conversao'],
  4: ['modalidade'],
  5: ['servico_principal', 'servicos_descricao'],
  6: ['publico_primario', 'publico_dor', 'publico_resultado'],
  7: ['diferencial', 'frase_impacto'],
  8: ['estilo_desejado', 'tema', 'intensidade_visual'],
  9: ['dominio']
};

const STEP_TITLES = {
  1: "Identificação", 2: "Contato", 3: "Redes Sociais", 4: "Localização", 5: "Serviços",
  6: "Público", 7: "Diferenciais", 8: "Direção Visual", 9: "Revisão e Assets"
};

const App = {
  state: {
    currentStep: 1, totalSteps: 9, projects: {}, activeProjectId: null,
    visitedSteps: new Set(),
    apiKeys: { gemini: '', claude: '', grok: '', mistral: '' },
    selectedModel: 'gemini-3-flash', isGenerating: false
  },
  briefing: { ...defaultBriefing },
  _saveTimeout: null, _toastTimeout: null,

  init() {
    this.checkDraft();
    const storedKeys = localStorage.getItem('landingai_keys');
    if (storedKeys) this.state.apiKeys = JSON.parse(storedKeys);
    const storedModel = localStorage.getItem('landingai_model');
    if (storedModel) this.state.selectedModel = storedModel;
    
    this.requestNotificationPermission();
    this.renderApp();
    this.setupEvents();
    
    // Create first project if empty
    if (!this.state.activeProjectId) this.createProject();
  },

  createProject() {
    const id = crypto.randomUUID();
    this.state.projects[id] = {
      id, name: 'Novo Projeto', slug: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      status: 'rascunho', briefing: { ...defaultBriefing }, visitedSteps: [], versions: []
    };
    this.state.activeProjectId = id;
    this.briefing = { ...defaultBriefing };
    this.state.visitedSteps = new Set();
    this.state.currentStep = 1;
    this.autosave();
    this.renderApp();
  },

  loadProject(id) {
    if (this.state.projects[id]) {
      this.state.activeProjectId = id;
      this.briefing = { ...this.state.projects[id].briefing };
      this.state.visitedSteps = new Set(this.state.projects[id].visitedSteps);
      this.state.currentStep = 1;
      this.renderApp();
      this.closeModal('modal-projects');
    }
  },

  autosave() {
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => {
      const p = this.state.projects[this.state.activeProjectId];
      if (!p) return;
      p.briefing = { ...this.briefing };
      p.name = this.briefing.nome_cliente || 'Novo Projeto';
      p.slug = this.briefing.slug;
      p.visitedSteps = Array.from(this.state.visitedSteps);
      p.updatedAt = new Date().toISOString();
      localStorage.setItem('landingai_projects', JSON.stringify(this.state.projects));
      localStorage.setItem('landingai_active', this.state.activeProjectId);
      this.renderSidebar(); // update name
    }, 1500);
  },

  checkDraft() {
    const raw = localStorage.getItem('landingai_projects');
    const activeId = localStorage.getItem('landingai_active');
    if (raw) {
      this.state.projects = JSON.parse(raw);
      if (activeId && this.state.projects[activeId]) {
        this.state.activeProjectId = activeId;
        this.briefing = { ...this.state.projects[activeId].briefing };
        this.state.visitedSteps = new Set(this.state.projects[activeId].visitedSteps || []);
      }
    }
  },

  setField(field, val) {
    this.briefing[field] = val;
    if (field === 'nome_cliente' && !this.briefing.slug) {
      this.briefing.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      document.getElementById('field_slug').value = this.briefing.slug;
    }
    this.autosave();
    if (this.state.currentStep === 9) this.renderStep9();
  },

  toggleArrayField(field, val) {
    if (!this.briefing[field]) this.briefing[field] = [];
    if (!Array.isArray(this.briefing[field])) this.briefing[field] = [this.briefing[field]];
    const idx = this.briefing[field].indexOf(val);
    if (idx > -1) this.briefing[field].splice(idx, 1);
    else this.briefing[field].push(val);
    this.autosave();
    this.renderStepContent();
  },

  goToStep(n) {
    this.state.visitedSteps.add(this.state.currentStep);
    this.state.currentStep = n;
    this.renderApp();
    document.getElementById('step-content').scrollTop = 0;
  },

  renderApp() {
    this.renderSidebar();
    this.renderTopbar();
    this.renderBottombar();
    this.renderStepContent();
    lucide.createIcons();
  },

  renderSidebar() {
    const sb = document.getElementById('sidebar');
    const p = this.state.projects[this.state.activeProjectId];
    const name = p ? p.name : 'Novo Projeto';
    const hasKeys = Object.values(this.state.apiKeys).some(k => k.length > 0);
    
    let stepsHtml = '';
    for(let i=1; i<=9; i++) {
      const active = i === this.state.currentStep ? 'active' : '';
      const visited = this.state.visitedSteps.has(i) ? 'visited' : '';
      let icon = 'circle';
      if (i === this.state.currentStep) icon = 'circle-dot';
      else if (visited) icon = 'check-circle';
      
      stepsHtml += `
        <div class="nav-item ${active} ${visited}" onclick="App.goToStep(${i})">
          <i data-lucide="${icon}" class="icon"></i> ${i}. ${STEP_TITLES[i]}
        </div>
      `;
    }

    sb.innerHTML = `
      <div class="logo">
        <h2 class="syne text-accent">LandingAI</h2>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Projeto Ativo</div>
        <div class="project-active-card" onclick="App.openModal('modal-projects')">
          <div class="project-active-title">${name}</div>
          <div class="project-active-meta">Clique para trocar</div>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-section-title">Briefing</div>
        ${stepsHtml}
      </div>
      <div style="margin-top: auto; padding: 24px;">
        <button class="btn btn-ghost" style="width: 100%; margin-bottom: 12px;" onclick="App.openModal('modal-api')">
          <i data-lucide="key" class="icon"></i> Config. API
        </button>
        <div class="api-status">
          <span class="status-dot ${hasKeys ? 'active' : ''}"></span>
          ${hasKeys ? 'API Configurada' : 'Sem API'}
        </div>
      </div>
    `;
  },

  renderTopbar() {
    const tb = document.getElementById('topbar');
    tb.innerHTML = `
      <div>
        <h2 class="syne">${STEP_TITLES[this.state.currentStep]}</h2>
        <div style="font-size: 12px; color: var(--text-secondary)">Step ${this.state.currentStep} de 9</div>
      </div>
    `;
    const pct = ((this.state.currentStep - 1) / 8) * 100;
    document.getElementById('progress-fill').style.width = `${pct}%`;
  },

  renderBottombar() {
    const bb = document.getElementById('bottombar');
    let html = '';
    if (this.state.currentStep > 1) {
      html += `<button class="btn btn-ghost" onclick="App.goToStep(${this.state.currentStep - 1})">Anterior</button>`;
    } else {
      html += `<div></div>`;
    }
    if (this.state.currentStep < 9) {
      html += `<button class="btn btn-primary" onclick="App.goToStep(${this.state.currentStep + 1})">Próximo</button>`;
    } else {
      html += `<div></div>`;
    }
    bb.innerHTML = html;
  },

  renderStepContent() {
    const sc = document.getElementById('step-content');
    const b = this.briefing;
    let html = '<div class="content-inner">';

    const input = (id, label, ph, req=false) => `
      <div class="field-group">
        <label class="field-label">${label} ${req?'<span class="required">*</span>':''}</label>
        <input class="field-input" id="field_${id}" value="${b[id]||''}" placeholder="${ph}" oninput="App.setField('${id}', this.value)">
      </div>
    `;
    const textarea = (id, label, ph, req=false) => `
      <div class="field-group">
        <label class="field-label">${label} ${req?'<span class="required">*</span>':''}</label>
        <textarea class="field-textarea" id="field_${id}" placeholder="${ph}" oninput="App.setField('${id}', this.value)">${b[id]||''}</textarea>
      </div>
    `;
    const selcard = (id, label, opts, req=false) => {
      let c = `<div class="field-group"><label class="field-label">${label} ${req?'<span class="required">*</span>':''}</label><div class="sel-cards">`;
      opts.forEach(o => {
        const on = b[id] === o.val ? 'on' : '';
        c += `<div class="sel-card ${on}" onclick="App.setField('${id}', '${o.val}'); App.renderStepContent();">
          <div class="card-title">${o.title}</div><div class="card-desc">${o.desc}</div>
        </div>`;
      });
      return c + `</div></div>`;
    };
    const chips = (id, label, opts, isArray=false, req=false) => {
      let c = `<div class="field-group"><label class="field-label">${label} ${req?'<span class="required">*</span>':''}</label><div class="chip-group">`;
      opts.forEach(o => {
        const isOn = isArray ? (b[id] && b[id].includes(o)) : b[id] === o;
        const action = isArray ? `App.toggleArrayField('${id}', '${o}')` : `App.setField('${id}', '${o}'); App.renderStepContent();`;
        c += `<div class="chip ${isOn?'on':''}" onclick="${action}">${o}</div>`;
      });
      return c + `</div></div>`;
    };

    switch(this.state.currentStep) {
      case 1:
        html += input('nome_cliente', 'Nome do Cliente', 'ex: Adsgator', true);
        html += input('nome_marca', 'Nome da Marca', 'ex: Adsgator LLC', true);
        html += input('slug', 'Slug', 'ex: adsgator', true);
        html += input('segmento', 'Segmento', 'ex: Marketing', true);
        html += selcard('tipo', 'Tipo de Projeto', [
          {val:'Serviço', title:'Serviço', desc:'Prestação de serviço'},
          {val:'Produto', title:'Produto', desc:'Produto físico ou digital'},
          {val:'Mentoria', title:'Mentoria', desc:'Mentoria ou programa'}
        ], true);
        break;
      case 2:
        html += input('whatsapp', 'WhatsApp', '5511999999999', true);
        html += selcard('objetivo_conversao', 'Objetivo de Conversão', [
          {val:'whatsapp', title:'WhatsApp', desc:''},
          {val:'formulario', title:'Formulário', desc:''},
          {val:'agendamento', title:'Agendamento', desc:''}
        ], true);
        html += input('email', 'E-mail', 'contato@email.com');
        html += input('gtm_id', 'GTM ID', 'GTM-XXXXXX');
        break;
      case 3:
        html += input('instagram', 'Instagram', '@perfil');
        html += input('tiktok', 'TikTok', '@perfil');
        html += input('youtube', 'YouTube', 'URL do canal');
        break;
      case 4:
        html += chips('modalidade', 'Modalidade', ['Presencial', 'Online', 'Híbrido'], false, true);
        if (b.modalidade === 'Presencial' || b.modalidade === 'Híbrido') {
          html += textarea('endereco', 'Endereço', 'Rua X...');
        }
        break;
      case 5:
        html += input('servico_principal', 'Serviço Principal', '', true);
        html += textarea('servicos_descricao', 'Descrição', '', true);
        html += textarea('servicos_lista', 'Lista', '');
        break;
      case 6:
        html += textarea('publico_primario', 'Público Primário', '', true);
        html += textarea('publico_dor', 'Dor do Público', '', true);
        html += textarea('publico_resultado', 'Resultado Esperado', '', true);
        break;
      case 7:
        html += textarea('diferencial', 'Diferencial', '', true);
        html += input('frase_impacto', 'Frase de Impacto', '', true);
        html += chips('depoimentos', 'Depoimentos', ['Sim', 'Não']);
        html += chips('google_business', 'Google Business', ['Sim', 'Não']);
        break;
      case 8:
        html += textarea('estilo_desejado', 'Estilo', '', true);
        html += chips('tema', 'Tema', ['Claro', 'Escuro', 'IA Decide'], false, true);
        html += selcard('intensidade_visual', 'Intensidade Visual', [
          {val:'Contido', title:'Contido', desc:''},
          {val:'Médio', title:'Médio', desc:''},
          {val:'Alto', title:'Alto', desc:''}
        ], true);
        break;
      case 9:
        html += input('dominio', 'Domínio', 'ex: adsgator.com', true);
        html += chips('integracoes', 'Integrações', ['Google Maps embed', 'Formulário de Contato', 'WhatsApp flutuante'], true);
        html += `<div style="margin-top: 40px; padding: 24px; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--r-md);">
          <h3 class="syne" style="margin-bottom: 16px;">Finalizar e Gerar</h3>
          <div style="display: flex; gap: 16px;">
            <button class="btn btn-ghost" onclick="App.downloadDoc1()"><i data-lucide="download" class="icon"></i> Baixar DOC-1</button>
            <button class="btn btn-primary" onclick="App.generateDocImpl()"><i data-lucide="zap" class="icon"></i> Gerar DOC-IMPL via IA</button>
          </div>
        </div>`;
        break;
    }
    html += '</div>';
    sc.innerHTML = html;
    lucide.createIcons();
  },

  buildDoc1() {
    const b = this.briefing;
    const modelUsed = this.state.apiKeys[AI_MODELS[this.state.selectedModel].provider] ? AI_MODELS[this.state.selectedModel].name : 'manual';
    
    return `---
title: ${b.nome_cliente || 'Projeto'} — Brainstorm Visual
date: ${new Date().toISOString()}
tags: [adsgator, design, doc-2]
status: pronto-para-ia
gerado_por: LandingAI v2
modelo_ia: ${modelUsed}
---

# ${b.nome_cliente || 'Projeto'} — Brainstorm Visual

> **Documento 1 de 2 — Adsgator (gerado pelo LandingAI v2)**
> Preencha este documento e envie para a IA gerar a Ficha de Implementação.

---

## INSTRUÇÃO MESTRE PARA A IA

Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este documento inteiro e gerar como output a **Ficha de Implementação**, completa, específica e pronta para ser enviada diretamente ao Claude, Roo Code ou outro agente implementador construir a landing page.

**O que isso significa na prática:**
- Você toma todas as decisões de design que não estão explicitadas — tipografia, escala, tokens, animações, layout de cada seção.
- Você preenche cada campo da Ficha de Implementação com valores concretos. Sem placeholders. Sem [definir depois]. Sem [a combinar].
- Você transforma a direção criativa e a copy abaixo em especificações técnicas de implementação.
- O output que você entrega deve poder ser copiado e enviado para outra IA sem nenhuma edição adicional.

**Padrão de qualidade esperado:**
O documento gerado deve orquestrar uma landing page com design editorial de alto padrão — atípico, com personalidade visual forte, fora do visual genérico de IA. Pense Raycast, Linear, Family.co. Layouts com intenção. Tipografia com personalidade. Animações que têm razão de existir. Cada decisão de tipografia, espaçamento, cor e animação deve ser intencional e coesa.

**Sobre o viewport:**
O site não fica preso em um container central. Seções que se beneficiam de ocupar o viewport completo devem fazê-lo — backgrounds que sangram até as bordas, tipografia que respira, imagens que não ficam comprimidas. O container é uma ferramenta de legibilidade, não uma prisão de layout.

**Sobre o mobile:**
Mobile não é adaptação — é o ponto de partida. O design começa em 375px. Cada decisão de tipografia, espaçamento, hierarquia e layout é tomada primeiro para mobile e expandida para desktop.

**Sobre o footer:**
O footer não é um afterthought — é a última impressão. Deve ter identidade visual clara, conectada ao tom da landing page. Hierarquia tipográfica real. Personalidade.

**DNA ADSGATOR — REGRAS INEGOCIÁVEIS DE COPY:**
- Intenção de Busca em Primeiro Lugar — a H1 justifica o clique no anúncio nos primeiros 3 segundos
- Primeira Pessoa Sempre — "eu", "meu", "com você" — nunca terceira pessoa
- Zero Institucional — proibido: "inovador", "excelência", "missão", "visão"
- Comunicação Direta e Realista — sem promessas milagrosas
- Tom Conversacional com Autoridade
- Foco na Ação — cada palavra tem função persuasiva

**STACK TÉCNICA FIXA:**
Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis + Web3Forms
Deploy: Vercel (output: 'static')

---

## PARTE 1 — IDENTIDADE DO PROJETO

### Resumo do Projeto

| Campo | Valor |
|---|---|
| **Cliente** | ${b.nome_cliente || '—'} |
| **Marca** | ${b.nome_marca || '—'} |
| **Slug** | ${b.slug || '—'} |
| **Segmento** | ${b.segmento || '—'} |
| **Tipo** | ${b.tipo || '—'} |
| **Objetivo de conversão** | ${b.objetivo_conversao || '—'} |
| **WhatsApp** | ${b.whatsapp || '—'} |
| **E-mail** | ${b.email || '—'} |
| **Horários** | ${b.horarios || '—'} |
| **GTM ID** | ${b.gtm_id || '—'} |
| **Domínio** | ${b.dominio || '—'} |
| **Modalidade** | ${b.modalidade || '—'} |
| **CNPJ** | ${b.cnpj || '—'} |
| **Aviso legal** | ${b.aviso_legal || '—'} |

---

## PARTE 2 — SERVIÇOS E PRODUTO

### Serviço Principal
${b.servico_principal || '—'}

### Todos os Serviços
${b.servicos_lista || '—'}

### Descrição Detalhada
${b.servicos_descricao || '—'}

### Preço
${b.preco_exibir === 'Sim' ? `Exibir preço: ${b.preco_valor || ''} — ${b.preco_condicao || ''}` : 'Não exibir preço'}

### Oferta Especial
${b.oferta_especial || 'Não há'}

---

## PARTE 3 — PÚBLICO-ALVO

### Público Primário
${b.publico_primario || '—'}

### Dor Principal
${b.publico_dor || '—'}

### Resultado Desejado
${b.publico_resultado || '—'}

### Público Secundário
${b.publico_secundario || 'Não definido'}

---

## PARTE 4 — COPY E PERSUASÃO

### Diferencial Real
${b.diferencial || '—'}

### Frase de Impacto
${b.frase_impacto || '—'}

### História / Origem
${b.historia || 'Não fornecida'}

### FAQ — Principais Dúvidas
${b.faq || 'Não fornecido — IA decide baseado no nicho'}

---

## PARTE 5 — PRESENÇA DIGITAL

### Redes Sociais
| Rede | Handle/Link |
|---|---|
| Instagram | ${b.instagram || '—'} |
| TikTok | ${b.tiktok || '—'} |
| YouTube | ${b.youtube || '—'} |
| Outras | ${b.outras_redes || '—'} |

### Google Business
${b.google_business === 'Sim' ? `Sim — Nota: ${b.google_nota || '?'} ★ com ${b.google_qtd || '?'} avaliações` : 'Não possui'}

### Depoimentos
${b.depoimentos === 'Sim' ? `Sim — Formato: ${(b.depoimentos_formato || []).join(', ')} — Quantidade: ${b.depoimentos_qtd || '?'}` : 'Não há depoimentos disponíveis'}

### Cases / Resultados Concretos
${b.casos_resultados || 'Não fornecidos'}

---

## PARTE 6 — LOCALIZAÇÃO

### Modalidade de Atendimento
${b.modalidade || '—'}

${b.modalidade === 'Presencial' || b.modalidade === 'Híbrido' ? `### Endereço\n${b.endereco || '—'}\n\n### Exibir Localização\n${b.exibir_localizacao || '—'}\n\n### Cidades de Atendimento\n${b.cidades_atendimento || '—'}` : ''}

${b.modalidade === 'Online' || b.modalidade === 'Híbrido' ? `### Plataforma Online\n${b.plataforma_online || '—'}` : ''}

---

## PARTE 7 — DIREÇÃO DE DESIGN

### Como o site deve ser percebido
${b.estilo_desejado || '—'}

### Sensação do visitante
${b.sensacao_visitante || '—'}

### Referências Pessoais
${b.referencias_pessoais || '—'}

### Referências do Nicho
${b.referencias_nicho || 'Não fornecidas'}

### Cores da Marca
| Cor | Valor |
|---|---|
| Principal | ${b.cor_principal || 'Não definida'} |
| Secundária | ${b.cor_secundaria || 'Não definida'} |

### Direção Geral
| Parâmetro | Valor |
|---|---|
| Tema | ${b.tema || '—'} |
| Intensidade Visual | ${b.intensidade_visual || '—'} |
| Referência de marca | ${b.referencia_marca || 'Não definida'} |
| O que NÃO quero | ${b.o_que_nao_quero || 'Não especificado'} |

### Footer
| Parâmetro | Valor |
|---|---|
| Tom visual | ${b.footer_tom || 'IA decide'} |
| Elemento âncora | ${b.footer_elemento || 'IA decide'} |
| Sensação | ${b.footer_sensacao || 'IA decide'} |

### Menu Mobile
${b.menu_mobile_estilo || 'IA decide'} — ${b.menu_mobile_especial || 'Padrão'}

---

## PARTE 8 — ASSETS E INTEGRAÇÕES

### Assets Disponíveis
| Asset | Status |
|---|---|
| Logo | ${b.logo_disponivel || '—'} |
| Foto do profissional/produto | ${b.foto_profissional || '—'} |
| Outros | ${b.assets_outros || '—'} |

### Integrações Ativas
${(b.integracoes || []).map(i => `[x] ${i}`).join('\n')}

---

## PARTE 9 — BRIEFING BRUTO DO CLIENTE

> Cole abaixo o briefing exatamente como veio do cliente. A IA usa como fonte primária.

${b.briefing_bruto || 'Não fornecido — usar dados dos campos acima'}

---

## PARTE 10 — INSTRUÇÕES ADICIONAIS

${b.instrucoes_adicionais || 'Nenhuma instrução adicional'}

---

## PARTE 11 — REGRAS FIXAS ADSGATOR

${REGRAS_FIXAS_ADSGATOR}
`;
  },

  downloadDoc1() {
    const content = this.buildDoc1();
    this.downloadFile(content, `doc1-${this.briefing.slug||'projeto'}.md`);
  },

  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Download concluído', 'success');
  },

  async generateDocImpl() {
    if (!this.state.apiKeys.gemini && !this.state.apiKeys.claude && !this.state.apiKeys.grok && !this.state.apiKeys.mistral) {
      this.showToast('Configure uma API Key primeiro', 'error');
      this.openModal('modal-api');
      return;
    }
    
    // Check critical fields
    const missing = [];
    for (const step in criticalFields) {
      criticalFields[step].forEach(f => {
        if (!this.briefing[f] || String(this.briefing[f]).trim() === '') missing.push(f);
      });
    }
    if (missing.length > 0) {
      this.showToast('Preencha os campos obrigatórios', 'warning');
      return;
    }

    this.state.isGenerating = true;
    this.openModal('modal-gen');
    const statusBox = document.getElementById('modal-gen');
    statusBox.innerHTML = `<div class="modal"><div class="modal-body">
      <h3 class="syne" style="margin-bottom:20px"><i data-lucide="zap" class="icon icon--accent"></i> Gerando DOC-IMPL...</h3>
      <div id="gen-logs" style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary);"></div>
    </div></div>`;
    lucide.createIcons();
    const log = (msg) => { document.getElementById('gen-logs').innerHTML += `<div>> ${msg}</div>`; };

    try {
      log('Compilando DOC-1...');
      const doc1 = this.buildDoc1();
      
      const prompt = `Você é um Diretor de Arte e UI Designer da Adsgator.
Baseado neste documento, crie a Ficha de Implementação completa (DOC-IMPL).
Documento:
${doc1}`;

      log(`Chamando modelo: ${AI_MODELS[this.state.selectedModel].name}...`);
      
      const modelInfo = AI_MODELS[this.state.selectedModel];
      const apiKey = this.state.apiKeys[modelInfo.provider];
      
      if (!apiKey) throw new Error(`Chave de API ausente para ${modelInfo.provider}`);
      
      let docImpl = '';
      if (modelInfo.provider === 'gemini') {
        const resp = await fetch(`${modelInfo.endpoint}?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!resp.ok) throw new Error('Erro na API Gemini: ' + resp.status);
        const data = await resp.json();
        docImpl = data.candidates[0].content.parts[0].text;
      } else if (modelInfo.provider === 'claude') {
        const resp = await fetch(modelInfo.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: modelInfo.maxTokens,
            messages: [{ role: 'user', content: prompt }]
          })
        });
        if (!resp.ok) throw new Error('Erro na API Claude: ' + resp.status);
        const data = await resp.json();
        docImpl = data.content[0].text;
      } else if (modelInfo.provider === 'grok') {
        const resp = await fetch(modelInfo.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'grok-3',
            max_tokens: modelInfo.maxTokens,
            temperature: modelInfo.temp,
            messages: [{ role: 'user', content: prompt }]
          })
        });
        if (!resp.ok) throw new Error('Erro na API Grok: ' + resp.status);
        const data = await resp.json();
        docImpl = data.choices[0].message.content;
      } else if (modelInfo.provider === 'mistral') {
        const resp = await fetch(modelInfo.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'mistral-large-latest',
            max_tokens: modelInfo.maxTokens,
            temperature: modelInfo.temp,
            messages: [{ role: 'user', content: prompt }]
          })
        });
        if (!resp.ok) throw new Error('Erro na API Mistral: ' + resp.status);
        const data = await resp.json();
        docImpl = data.choices[0].message.content;
      } else {
        throw new Error('Provedor não implementado');
      }

      log('Concluído! Baixando arquivo...');
      this.downloadFile(docImpl, `doc-impl-${this.briefing.slug||'projeto'}.md`);
      this.showNotification('LandingAI', 'DOC-IMPL gerado com sucesso!');
      setTimeout(() => this.closeModal('modal-gen'), 2000);

    } catch (e) {
      log(`<span style="color:var(--danger)">ERRO: ${e.message}</span>`);
      this.showToast('Falha na geração', 'error');
    } finally {
      this.state.isGenerating = false;
    }
  },

  openModal(id) {
    if (id === 'modal-api') this.renderApiModal();
    if (id === 'modal-projects') this.renderProjectsModal();
    document.getElementById(id).classList.remove('hidden');
  },
  
  closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  },

  renderApiModal() {
    const m = document.getElementById('modal-api');
    m.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="syne">Configuração de APIs</h3>
          <button class="btn btn-ghost" style="padding:4px" onclick="App.closeModal('modal-api')"><i data-lucide="x" class="icon"></i></button>
        </div>
        <div class="modal-body">
          <div class="field-group">
            <label class="field-label">Modelo Padrão para Geração</label>
            <select class="field-select" id="sel-model">
              ${Object.entries(AI_MODELS).map(([k,v]) => `<option value="${k}" ${this.state.selectedModel===k?'selected':''}>${v.name}</option>`).join('')}
            </select>
          </div>
          <hr style="border:0; border-top:1px solid var(--border-default); margin: 24px 0;">
          <div class="field-group">
            <label class="field-label">Gemini API Key</label>
            <input type="password" class="field-input" id="key-gemini" value="${this.state.apiKeys.gemini}">
            <div class="field-hint">Obter em: aistudio.google.com</div>
          </div>
          <div class="field-group">
            <label class="field-label">Claude API Key</label>
            <input type="password" class="field-input" id="key-claude" value="${this.state.apiKeys.claude}">
            <div class="field-hint">Obter em: console.anthropic.com</div>
          </div>
          <div class="field-group">
            <label class="field-label">Grok API Key</label>
            <input type="password" class="field-input" id="key-grok" value="${this.state.apiKeys.grok}">
            <div class="field-hint">Obter em: console.x.ai</div>
          </div>
          <div class="field-group">
            <label class="field-label">Mistral API Key</label>
            <input type="password" class="field-input" id="key-mistral" value="${this.state.apiKeys.mistral}">
            <div class="field-hint">Obter em: console.mistral.ai</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="App.saveApiKeys()">Salvar</button>
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  saveApiKeys() {
    this.state.apiKeys.gemini = document.getElementById('key-gemini').value;
    this.state.apiKeys.claude = document.getElementById('key-claude').value;
    this.state.apiKeys.grok = document.getElementById('key-grok').value;
    this.state.apiKeys.mistral = document.getElementById('key-mistral').value;
    this.state.selectedModel = document.getElementById('sel-model').value;
    localStorage.setItem('landingai_keys', JSON.stringify(this.state.apiKeys));
    localStorage.setItem('landingai_model', this.state.selectedModel);
    this.closeModal('modal-api');
    this.showToast('Configurações salvas', 'success');
    this.renderSidebar();
  },

  renderProjectsModal() {
    const m = document.getElementById('modal-projects');
    const list = Object.values(this.state.projects).map(p => `
      <div class="project-list-item">
        <div class="project-list-info">
          <div class="project-list-name">${p.name}</div>
          <div class="project-list-meta">${new Date(p.updatedAt).toLocaleString()}</div>
        </div>
        <div class="project-list-actions">
          <button class="btn btn-ghost" onclick="App.loadProject('${p.id}')">Abrir</button>
          <button class="btn btn-danger" onclick="App.deleteProject('${p.id}')">Excluir</button>
        </div>
      </div>
    `).join('');

    m.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="syne">Meus Projetos</h3>
          <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="App.createProject(); App.closeModal('modal-projects')">+ Novo</button>
          <button class="btn btn-ghost" style="padding:4px" onclick="App.closeModal('modal-projects')"><i data-lucide="x" class="icon"></i></button>
        </div>
        <div class="modal-body">
          ${list || '<p style="color:var(--text-secondary)">Nenhum projeto salvo.</p>'}
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  deleteProject(id) {
    if (confirm('Excluir este projeto?')) {
      delete this.state.projects[id];
      if (this.state.activeProjectId === id) {
        this.state.activeProjectId = null;
        localStorage.removeItem('landingai_active');
      }
      localStorage.setItem('landingai_projects', JSON.stringify(this.state.projects));
      if (!this.state.activeProjectId) this.createProject();
      else this.renderProjectsModal();
    }
  },

  showToast(msg, type='default') {
    const t = document.getElementById('toast');
    const icons = { success: 'check-circle', error: 'alert-circle', warning: 'alert-triangle', default: 'info' };
    t.innerHTML = `<i data-lucide="${icons[type]}" class="icon icon--${type}"></i> <span>${msg}</span>`;
    t.className = `toast toast--${type} toast--visible`;
    lucide.createIcons();
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => t.classList.remove('toast--visible'), 3000);
  },

  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  },

  showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  },

  setupEvents() {
    // any global events here
  }
};

window.App = App;
