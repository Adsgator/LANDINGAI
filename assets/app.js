/* ============================================================
   LandingAI v2 — Aplicação Completa (Consolidada)
   Adsgator · Sistema Interno
   ============================================================ */

'use strict';

/* ── Constantes ─────────────────────────────────────────────── */

const VERSION = '2.0.0';

const STORAGE_KEYS = {
  PROJECTS: 'landingai_v2_projects',
  ACTIVE: 'landingai_v2_active',
  API_KEYS: 'landingai_v2_apikeys',
  SETTINGS: 'landingai_v2_settings',
};

const STORAGE_LIMIT_BYTES = 4 * 1024 * 1024; // 4MB

const AI_MODELS = {
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash',
    provider: 'gemini', group: 'Google', tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    maxTokens: 12000, temp: 0.7,
  },
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro',
    provider: 'gemini', group: 'Google', tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
    maxTokens: 16000, temp: 0.65,
  },
  'claude-sonnet-4': {
    id: 'claude-sonnet-4', label: 'Claude Sonnet 4',
    provider: 'claude', group: 'Anthropic', tier: 'paid',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 16000, temp: 0.65,
  },
  'claude-opus-4': {
    id: 'claude-opus-4', label: 'Claude Opus 4',
    provider: 'claude', group: 'Anthropic', tier: 'paid',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 16000, temp: 0.65,
  },
  'grok-3': {
    id: 'grok-3', label: 'Grok 3',
    provider: 'grok', group: 'xAI', tier: 'paid',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    maxTokens: 12000, temp: 0.65,
  },
  maxTokens: 12000, temp: 0.65,
},
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
};

const STEPS = [
  { id: 1, label: 'Identificação', sub: 'Nome, nicho e tipo de projeto', icon: 'user' },
  { id: 2, label: 'Contato e CTA', sub: 'WhatsApp, e-mail e conversão', icon: 'phone' },
  { id: 3, label: 'Presença Digital', sub: 'Redes sociais e plataformas', icon: 'globe' },
  { id: 4, label: 'Atendimento', sub: 'Modalidade, endereço, cidades', icon: 'map-pin' },
  { id: 5, label: 'Serviço / Produto', sub: 'O que é vendido e como funciona', icon: 'briefcase' },
  { id: 6, label: 'Público-Alvo', sub: 'Perfil, dores e resultado', icon: 'target' },
  { id: 7, label: 'Autoridade', sub: 'Diferenciais e prova social', icon: 'star' },
  { id: 8, label: 'Tom e Identidade', sub: 'Estilo, vocabulário e restrições', icon: 'palette' },
];

const REQUIRED_FIELDS = {
  1: ['nome_cliente', 'segmento', 'tipo'],
  2: ['whatsapp'],
  3: ['modalidade'],
  4: ['servico_principal'],
  5: ['servicos_descricao'],
  6: ['publico_primario', 'publico_dor'],
  7: ['diferencial', 'frase_impacto'],
  8: ['estilo_desejado', 'sensacao_visitante'],
};

const FIELD_WARNINGS = {
  publico_primario: { min: 60, msg: 'Muito curto — detalhe melhor o perfil do cliente ideal.' },
  publico_dor: { min: 50, msg: 'Pouco detalhe sobre a dor — use as palavras do cliente.' },
  servicos_descricao: { min: 80, msg: 'Descreva melhor os serviços para uma copy mais rica.' },
  diferencial: { min: 60, msg: 'Seja mais específico sobre o que te diferencia.' },
};

const FIELD_TOOLTIPS = {
  // Step 1
  nome_cliente: 'Nome do profissional como aparecerá no site. Ex: "Dra. Ana Lima" ou "Beatriz Mattos".',
  nome_marca: 'Nome comercial ou da marca, se diferente do nome do profissional. Ex: "BM Adestramento", "Clínica Bem-Estar".',
  segmento: 'Área de atuação específica — não "saúde" mas "fisioterapia pélvica" ou "psicologia clínica com foco em ansiedade". Quanto mais específico, mais precisa a copy.',
  tipo: 'Define a estrutura do site: Serviço = agendamento/contratação; Mentoria = programa com acompanhamento; Produto = item físico ou digital.',
  dominio: 'Domínio do site. Ex: beatrizmattos.com.br. Confirmar disponibilidade antes do go-live.',
  cnpj: 'CNPJ para exibir no rodapé — obrigatório para algumas categorias regulamentadas.',
  aviso_legal: 'Registro profissional para o rodapé. Ex: CRM 12345-SP, CRP 06/12345, OAB/SP 123456.',

  // Step 2
  whatsapp: 'Apenas dígitos com DDI e DDD. Ex: 5511999999999 (55=Brasil, 11=SP). Vai em todos os CTAs da página.',
  email: 'E-mail de contato exibido na página. Deixar vazio se o cliente preferir contato só por WhatsApp.',
  horarios: 'Dias e horários de atendimento. Ex: Seg–Sex: 8h–18h, Sáb: 8h–12h. Aumenta credibilidade.',
  gtm_id: 'ID do Google Tag Manager. Ex: GTM-XXXXXXX. Fornecido pelo gestor de tráfego. Vai no .env — nunca hardcoded.',
  objetivo_conversao: 'A ação principal que o visitante deve fazer. WhatsApp é padrão para serviços locais. Formulário serve para triagem.',

  // Step 3
  instagram: 'Usuário do Instagram com @. Ex: @beatrizmattos. Aparece no footer e, se ativo, pode incluir Feed.',
  tiktok: 'Usuário do TikTok. Deixar vazio se não tiver ou não for relevante para o negócio.',
  youtube: 'Link completo do canal. Ex: youtube.com/@beatrizmattos',
  google_business: 'Perfil Google Meu Negócio. Se Sim e tiver 10+ avaliações reais com nota ≥ 4.5, inclui o bloco de reviews.',
  google_nota: 'Nota exata do perfil Google. Mínimo 4.5 para incluir o bloco na página.',
  google_qtd: 'Número de avaliações. Mínimo 10 para incluir. Nunca inventamos notas.',

  // Step 4
  modalidade: 'Define quais blocos aparecem: Presencial → inclui endereço + mapa. Online → sem mapa. Híbrido → ambos.',
  endereco: 'Endereço completo com ponto de referência. Só incluir se autorizado pelo cliente. Ex: Rua das Flores, 123 – Jardins, SP – Próximo ao Shopping X.',
  exibir_localizacao: 'Como exibir o endereço: completo, só o bairro, ou apenas a cidade.',
  cidades_atendimento: 'Regiões atendidas — importante para SEO local. Ex: São Paulo e Grande ABC.',
  plataforma_online: 'Plataforma usada para atendimento online. Ex: Google Meet, Zoom, WhatsApp Vídeo.',

  // Step 5
  servico_principal: 'O serviço ou produto mais importante — foco da campanha. Vai definir a H1 e o Hero da página.',
  servicos_lista: 'Lista de todos os serviços ou planos, um por linha. A IA decide se cria grade de serviços ou tabela de planos.',
  servicos_descricao: 'Como funciona o processo, o que está incluso, quanto tempo dura, qual resultado esperado. Quanto mais detalhe, mais rica a copy do bloco "Como Funciona".',
  preco_exibir: 'Exibir preço reduz volume de leads mas aumenta qualidade. Bom para serviços premium ou com preço fixo.',
  preco_valor: 'Valor e forma de cobrança. Ex: R$ 350/sessão, A partir de R$ 1.200/mês.',
  preco_condicao: 'Condição especial ou parcelamento. Ex: 3x sem juros no cartão.',
  oferta_especial: 'Promoção ativa com prazo real. A IA cria um bloco de urgência com base nisso. Deixar vazio se não houver.',

  // Step 6
  publico_primario: 'Perfil do cliente ideal: gênero, faixa etária, situação de vida, localização. Fale sobre uma pessoa real, não uma demografia genérica.',
  publico_dor: 'O problema real que faz o cliente buscar esse serviço. Use a linguagem do cliente — como ele pesquisa no Google, não o termo técnico.',
  publico_resultado: 'O que o cliente imagina conquistar após contratar. Deve aparecer no Hero e no CTA Final da página.',
  publico_secundario: 'Se houver um segundo perfil de cliente relevante. A IA pode criar variações de copy.',
  faq: 'Perguntas frequentes reais que os clientes fazem. A IA inclui o bloco FAQ se houver objeções documentadas aqui.',

  // Step 7
  diferencial: 'O que concretamente diferencia esse profissional. Não "atendimento humanizado" — mas o que ele faz diferente: método, certificação, resultado concreto, garantia.',
  frase_impacto: 'Como o profissional descreveria o que faz em uma frase. Vem da conversa — não invente. Pode virar a H1 da página.',
  historia: 'Por que esse profissional faz o que faz. Se for genuína e diferente do padrão do nicho, a IA inclui um bloco de história.',
  casos_resultados: 'Números e resultados concretos. Ex: 120 cães atendidos, 97% relataram melhora em 30 dias.',
  depoimentos: 'Nunca inventamos depoimentos. Se Sim, o bloco de Prova Social é incluído na página.',
  depoimentos_qtd: 'Quantidade de depoimentos disponíveis. Ideal: 3 a 6. Mais de 6 pode virar slider.',
  depoimentos_formato: 'Formato dos depoimentos disponíveis. Influencia como o bloco será montado.',

  // Step 8
  estilo_desejado: 'Descreva como o site deve ser percebido. Não "moderno" ou "clean" isolados — diga o quê. Ex: Sóbrio e técnico como Linear.app, mas mais quente por ser nicho de saúde.',
  sensacao_visitante: 'Emoção desejada ao navegar. É diferente do estilo visual — é o sentimento. Ex: Segurança imediata. Que essa é a pessoa certa.',
  frase_tom: 'Uma frase curta que captura a personalidade da marca. Guia o tom de voz da IA. Ex: Especialista que já viu tudo e fala sem rodeios.',
  vocabulario_usa: 'Termos técnicos ou expressões do cliente que devem aparecer na copy. Vêm da conversa — não do formulário.',
  vocabulario_nunca: 'Expressões que quebram a autenticidade. Tão importante quanto o vocabulário correto. Ex: "pet", "fofo", "jornada", "transformação".',
  restricoes: 'Tudo que NÃO quer de forma alguma — cores, estilos, elementos, referências negativas. Ex: Sem rosa. Sem visual de infoproduto. Sem fontes cursivas.',
};

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

const ERROR_MAP = {
  'api key': { cause: 'API Key inválida ou sem permissão.', tip: 'Verifique se a key está correta e sem espaços extras.' },
  'quota': { cause: 'Cota da API atingida.', tip: 'Aguarde algumas horas ou troque para outro modelo.' },
  'rate limit': { cause: 'Muitas requisições em pouco tempo.', tip: 'Aguarde 30 segundos e tente novamente.' },
  'too short': { cause: 'Resposta muito curta — provavelmente contexto cortado.', tip: 'Tente Gemini 2.5 Pro ou Claude Opus que têm janela maior.' },
  'context length': { cause: 'Briefing muito longo para este modelo.', tip: 'Reduza o briefing bruto ou troque para um modelo com janela maior.' },
  'unauthorized': { cause: 'API Key sem autorização para este modelo.', tip: 'Verifique os planos ativos na conta do provider.' },
  'network': { cause: 'Falha de conexão com a API.', tip: 'Verifique sua internet e tente novamente.' },
  'timeout': { cause: 'A requisição demorou demais e foi cancelada.', tip: 'Tente um modelo mais rápido (Gemini Flash) ou reduza o briefing.' },
  'overloaded': { cause: 'O servidor do modelo está sobrecarregado.', tip: 'Aguarde 1–2 minutos e tente novamente.' },
  'openrouter': { cause: 'Erro no gateway OpenRouter.', tip: 'Verifique os créditos em openrouter.ai/credits.' },
};

const App = {
  state: {
    projects: {},
    activeId: null,
    screen: 'intake',
    currentStep: 1,
    selectedModel: 'gemini-2.5-flash',
    apiKeys: {},
    intakeFiles: [],
    isGenerating: false,
    artAnalyzed: false,
    aiLog: {
      title: '',
      steps: [],
      active: null,
      done: [],
      errors: [],
      startedAt: null,
      stepTimes: {},
      liveMsg: '',
    },
  },

  get P() { return this.state.projects[this.state.activeId]; },
  get B() { return this.P ? this.P.briefing : {}; },

  init() {
    this.loadStorage();
    if (!this.state.activeId || !this.P) this.createProject('Projeto Inicial');
    this.setupGlobalEvents();
    this.renderAll();
  },

  openAILog(title, steps) {
    this.state.aiLog = {
      title,
      steps,
      active: null,
      done: [],
      errors: [],
      startedAt: Date.now(),
      stepTimes: {},
      liveMsg: '',
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
    log.active = id;
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
    const done = log.done.length;
    const pct = Math.round((done / total) * 100);
    const elapsed = log.startedAt ? ((Date.now() - log.startedAt) / 1000).toFixed(1) : '0.0';

    const stepRows = log.steps.map(s => {
      const isActive = log.active === s.id;
      const isDone = log.done.includes(s.id);
      const isError = log.errors.includes(s.id);

      let stepElapsed = '';
      if (isDone && log.stepTimes[s.id + '_start'] && log.stepTimes[s.id + '_end']) {
        const ms = log.stepTimes[s.id + '_end'] - log.stepTimes[s.id + '_start'];
        stepElapsed = `<span class="log-step-time">${(ms / 1000).toFixed(1)}s</span>`;
      }

      const iconName = isActive ? 'loader-2'
        : isDone ? 'check-circle'
          : isError ? 'x-circle'
            : 'circle';

      const stateClass = isActive ? 'log-step--active'
        : isDone ? 'log-step--done'
          : isError ? 'log-step--error'
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

  loadStorage() {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const a = localStorage.getItem(STORAGE_KEYS.ACTIVE);
      const k = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      if (p) this.state.projects = JSON.parse(p);
      if (a) this.state.activeId = a;
      if (k) this.state.apiKeys = JSON.parse(k);
    } catch (e) { }
  },

  saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.state.projects));
      localStorage.setItem(STORAGE_KEYS.ACTIVE, this.state.activeId || '');
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(this.state.apiKeys));
    } catch (e) { }
  },

  autosave() { this.saveStorage(); this.updateSidebar(); },

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

  loadProject(id) {
    if (!this.state.projects[id]) return;
    this.state.activeId = id;
    this.state.screen = 'intake';
    this.renderAll();
    this.closeModal('modal-projects');
  },

  deleteProject(id) {
    if (!confirm('Excluir projeto?')) return;
    delete this.state.projects[id];
    if (this.state.activeId === id) {
      const remaining = Object.keys(this.state.projects);
      if (remaining.length > 0) this.loadProject(remaining[0]);
      else this.createProject();
    }
    this.autosave();
    this.renderProjectsList();
  },

  setField(field, value) {
    if (!this.P) return;
    this.P.briefing[field] = value;
    this.P.updatedAt = new Date().toISOString();
    this.autosave();
  },

  toggleArray(field, value) {
    if (!this.P) return;
    const arr = this.B[field] || [];
    const idx = arr.indexOf(value);
    if (idx === -1) arr.push(value); else arr.splice(idx, 1);
    this.P.briefing[field] = arr;
    this.autosave();
  },

  goToStep(n) { this.state.screen = 'step'; this.state.currentStep = n; this.renderAll(); },
  goToScreen(s) { this.state.screen = s; this.renderAll(); },
  goNext() {
    if (this.state.screen === 'intake') this.goToStep(1);
    else if (this.state.screen === 'step') this.state.currentStep < 8 ? this.goToStep(this.state.currentStep + 1) : this.goToScreen('art');
    else if (this.state.screen === 'art') this.goToScreen('review');
  },
  goPrev() {
    if (this.state.screen === 'review') this.goToScreen('art');
    else if (this.state.screen === 'art') this.goToStep(8);
    else if (this.state.screen === 'step') this.state.currentStep > 1 ? this.goToStep(this.state.currentStep - 1) : this.goToScreen('intake');
  },

  renderAll() {
    this.renderScreen();
    this.renderStepsNav();
    this.updateTopbar();
    this.updateSidebar();
    this.renderBottombar();
  },

  /* ─────────────────────────────────────────────────────
     RENDER SCREENS
  ───────────────────────────────────────────────────── */
  renderScreen() {
    const container = document.getElementById('screen-content');
    if (!this.state.screen) return;

    switch (this.state.screen) {
      case 'intake': container.innerHTML = this.buildIntakeScreen(); break;
      case 'step': container.innerHTML = this.buildStepScreen(this.state.currentStep); break;
      case 'art': container.innerHTML = this.buildArtScreen(); break;
      case 'review': container.innerHTML = this.buildReviewScreen(); break;
    }

    lucide.createIcons({ nodes: [container] });
    this.bindScreenEvents(container);
    this.renderBottombar();
    // Scroll to top
    container.scrollTo(0, 0);
  },

  bindScreenEvents(container) {
    // Inputs text/textarea
    container.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', e => this.setField(el.dataset.field, el.value));
      el.addEventListener('change', e => this.setField(el.dataset.field, el.value));
      // Restaura valor salvo
      const saved = this.B[el.dataset.field];
      if (saved !== undefined && saved !== null && el.value === '') {
        if (el.type === 'color') el.value = saved || '#000000';
        else el.value = saved;
      }
    });

    // Chips
    container.querySelectorAll('[data-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const field = chip.dataset.field;
        const value = chip.dataset.chip;
        const multi = chip.dataset.multi === 'true';
        if (multi) {
          this.toggleArray(field, value);
          chip.classList.toggle('on');
        } else {
          // Radio-style
          container.querySelectorAll(`[data-field="${field}"][data-chip]`).forEach(c => c.classList.remove('on', 'on-accent'));
          this.setField(field, value);
          chip.classList.add('on');
        }
      });
      // Marca estado atual
      const B = this.B;
      const field = chip.dataset.field;
      const value = chip.dataset.chip;
      const multi = chip.dataset.multi === 'true';
      if (multi) {
        const arr = B[field] || [];
        if (arr.includes(value)) chip.classList.add('on');
      } else {
        if (B[field] === value) chip.classList.add('on');
      }
    });

    // Sel-cards
    container.querySelectorAll('[data-selcard]').forEach(card => {
      card.addEventListener('click', () => {
        const field = card.dataset.field;
        const value = card.dataset.selcard;
        container.querySelectorAll(`[data-field-group="${field}"] [data-selcard]`).forEach(c => c.classList.remove('on'));
        this.setField(field, value);
        card.classList.add('on');
      });
      if (this.B[card.dataset.field] === card.dataset.selcard) card.classList.add('on');
    });

    // WA preview
    const wInput = container.querySelector('[data-field="whatsapp"]');
    const wPreview = container.querySelector('#wa-preview');
    if (wInput && wPreview) {
      const update = () => {
        const v = (this.B.whatsapp || '').replace(/\D/g, '');
        wPreview.textContent = v ? `wa.me/${v}` : '—';
      };
      update();
      wInput.addEventListener('input', update);
    }

    // Upload intake
    const intakeUpload = container.querySelector('#intake-upload-zone');
    if (intakeUpload) this.setupUploadZone(intakeUpload, 'intake');

    // Analyze btn
    const analyzeBtn = container.querySelector('#btn-analyze');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.runIntakeAnalysis());
    }

    // Art uploads
    const artUpload = container.querySelector('#art-upload-zone');
    if (artUpload) this.setupUploadZone(artUpload, 'art');

    // Add reference btn
    container.querySelectorAll('[data-add-ref]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.addRef;
        this.addArtReference(type);
        this.renderScreen();
      });
    });

    // Analyze art btn
    const artAnalyzeBtn = container.querySelector('#btn-analyze-art');
    if (artAnalyzeBtn) {
      artAnalyzeBtn.addEventListener('click', () => this.runArtAnalysis());
    }

    // Review actions
    const doc1Btn = container.querySelector('#btn-download-doc1');
    if (doc1Btn) doc1Btn.addEventListener('click', () => this.downloadDoc1());

    const genBtn = container.querySelector('#btn-generate-docimpl');
    if (genBtn) genBtn.addEventListener('click', () => this.generateDocImpl());

    // Review step cards
    container.querySelectorAll('[data-goto-step]').forEach(card => {
      card.addEventListener('click', () => this.goToStep(parseInt(card.dataset.gotoStep)));
    });

    // Warning goto
    container.querySelectorAll('[data-goto-step-warn]').forEach(el => {
      el.addEventListener('click', () => this.goToStep(parseInt(el.dataset.gotoStepWarn)));
    });
  },

  /* ─────────────────────────────────────────────────────
     BUILD: INTAKE SCREEN
  ───────────────────────────────────────────────────── */
  buildIntakeScreen() {
    const B = this.B;
    return `
    <div class="intake-screen">

      <div class="intake-hero">
        <div class="intake-badge">
          <i data-lucide="zap" style="width:12px;height:12px"></i>
          v3 — Assistente Inteligente
        </div>
        <h2 class="intake-title">Cole o briefing.<br>A IA faz o resto.</h2>
        <p class="intake-subtitle">
          Cole o briefing preenchido pelo cliente, textos de WhatsApp, PDFs ou qualquer material coletado.
          A IA analisa, extrai e preenche todos os steps automaticamente.
          Você só revisa e ajusta.
        </p>
      </div>

      <!-- Box principal: Briefing -->
      <div class="intake-box">
        <div class="intake-box-header">
          <i data-lucide="file-text" class="intake-box-icon" style="width:18px;height:18px"></i>
          <span class="intake-box-title">Material do cliente</span>
          <span class="intake-box-desc">Cole texto, links ou suba arquivos</span>
        </div>
        <div class="intake-box-body">

          <div class="field-group">
            ${this.fieldLabel('briefing_bruto', 'Briefing e materiais do cliente', false)}
            <textarea
              class="field-textarea xtall"
              data-field="briefing_bruto"
              placeholder="Cole aqui tudo que você tem: briefing preenchido pelo cliente, textos de WhatsApp, observações da conversa, links relevantes, qualquer coisa.

A IA lê tudo e preenche os campos automaticamente. Quanto mais contexto, melhor o resultado."
            >${B.briefing_bruto || ''}</textarea>
            <span class="field-hint">Pode colar em formato bruto — não precisa formatar nada.</span>
          </div>

          <div class="intake-or">ou anexe arquivos</div>

          <div id="intake-upload-zone" class="upload-zone">
            <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.md,.txt">
            <i data-lucide="upload-cloud" class="upload-zone-icon"></i>
            <p class="upload-zone-label">Arraste ou clique para enviar</p>
            <p class="upload-zone-hint">PDF, imagens, .md, .txt — até 10MB por arquivo</p>
          </div>
          <div id="intake-files-list" class="upload-preview-list"></div>

          <div class="intake-actions">
            <div class="field-group" style="flex:1">
              ${this.fieldLabel('', 'Modelo para análise', false)}
              <div class="btn-model" style="width:fit-content;cursor:default">
                <i data-lucide="cpu" style="width:14px;height:14px"></i>
                <span id="intake-model-name">${AI_MODELS[this.state.selectedModel]?.label}</span>
              </div>
            </div>
            <button id="btn-analyze" class="btn-primary" style="align-self:flex-end">
              <i data-lucide="zap" style="width:16px;height:16px"></i>
              Analisar e Preencher Steps
            </button>
          </div>

        </div>
      </div>

      <!-- Hint SOP -->
      <div class="intake-sop-hint">
        <i data-lucide="info" class="intake-sop-hint-icon" style="width:15px;height:15px"></i>
        <p class="intake-sop-hint-text">
          <strong>Dica do SOP:</strong> Quanto mais contexto você colocar — briefing preenchido, conversa de WhatsApp, observações suas sobre tom de voz —
          mais precisa será a análise. Se quiser preencher manualmente, use a navegação no lado esquerdo para ir direto a qualquer step.
        </p>
      </div>

      <!-- Atalho: ir direto para step 1 -->
      <div style="text-align:center">
        <button class="btn-ghost btn-sm" onclick="App.goToStep(1)">
          <i data-lucide="list" style="width:14px;height:14px"></i>
          Preencher manualmente sem análise
        </button>
      </div>

    </div>
    `;
  },

  /* ─────────────────────────────────────────────────────
     BUILD: STEP SCREENS
  ───────────────────────────────────────────────────── */
  buildStepScreen(step) {
    const builders = {
      1: () => this.buildStep1(),
      2: () => this.buildStep2(),
      3: () => this.buildStep3(),
      4: () => this.buildStep4(),
      5: () => this.buildStep5(),
      6: () => this.buildStep6(),
      7: () => this.buildStep7(),
      8: () => this.buildStep8(),
    };
    return builders[step] ? `<div class="step-inner">${builders[step]()}</div>` : '';
  },

  fieldLabel(field, text, required = false, optional = false) {
    const req = required ? '<span class="field-required">*</span>' : '';
    const opt = optional ? '<span class="field-optional">(opcional)</span>' : '';
    const tip = TOOLTIPS[field] ? `
      <span class="field-tooltip">
        <i data-lucide="help-circle" class="field-tooltip-icon"></i>
        <span class="field-tooltip-bubble">${TOOLTIPS[field]}</span>
      </span>` : '';
    return `<label class="field-label">${text}${req}${opt}${tip}</label>`;
  },

  buildStep1() {
    const B = this.B;
    return `
      <p class="form-section-title">Identidade do Projeto</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('nome_cliente', 'Nome do cliente', true)}
          <input type="text" class="field-input" data-field="nome_cliente" placeholder="Ex: Beatriz Mattos" value="${B.nome_cliente || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('nome_marca', 'Nome da marca', false, true)}
          <input type="text" class="field-input" data-field="nome_marca" placeholder="Ex: BM Adestramento" value="${B.nome_marca || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('segmento', 'Segmento / profissão', true)}
        <input type="text" class="field-input" data-field="segmento" placeholder="Ex: Adestramento comportamental canino online" value="${B.segmento || ''}">
        <span class="field-hint">Seja específico — não "pet" mas "adestramento comportamental canino". Impacta toda a copy.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('tipo', 'Tipo de negócio', true)}
        <div class="sel-cards" data-field-group="tipo">
          ${[
        { v: 'servico', icon: 'briefcase', title: 'Serviço', desc: 'Adestramento, fisioterapia, advocacia, consultórios' },
        { v: 'mentoria', icon: 'graduation-cap', title: 'Mentoria', desc: 'Mentoria individual, em grupo, programa online' },
        { v: 'consultoria', icon: 'bar-chart', title: 'Consultoria', desc: 'B2B, consultoria especializada, assessoria' },
        { v: 'produto', icon: 'package', title: 'Produto', desc: 'Venda física, produto digital, ecommerce' },
        { v: 'saas', icon: 'monitor', title: 'SaaS / Digital', desc: 'Software, app, ferramenta, plataforma' },
      ].map(o => `
            <div class="sel-card" data-field="tipo" data-selcard="${o.v}" tabindex="0" role="option" aria-selected="${B.tipo === o.v}">
              <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
              <div>
                <div class="sel-card-title">${o.title}</div>
                <div class="sel-card-desc">${o.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Domínio e Legalização</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('dominio', 'Domínio desejado', true)}
          <input type="text" class="field-input" data-field="dominio" placeholder="Ex: beatrizmattos.com.br" value="${B.dominio || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('cnpj', 'CNPJ', false, true)}
          <input type="text" class="field-input" data-field="cnpj" placeholder="00.000.000/0000-00" value="${B.cnpj || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('aviso_legal', 'Aviso legal / registro profissional', false, true)}
        <input type="text" class="field-input" data-field="aviso_legal" placeholder="Ex: CRM 12345-SP · CRP 06/12345 · OAB/SP 123456" value="${B.aviso_legal || ''}">
      </div>
    `;
  },

  buildStep2() {
    const B = this.B;
    return `
      <p class="form-section-title">Contato e Conversão</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('whatsapp', 'WhatsApp', true)}
          <input type="text" class="field-input" data-field="whatsapp"
            placeholder="Ex: 5511999999999"
            value="${B.whatsapp || ''}"
            inputmode="numeric"
          >
          <div id="wa-preview" class="field-preview" style="display:${B.whatsapp ? '' : 'none'}">
            ${B.whatsapp ? `wa.me/${B.whatsapp}` : ''}
          </div>
          <span class="field-hint">Somente dígitos: DDI + DDD + número. O link wa.me é gerado automaticamente.</span>
        </div>
        <div class="field-group">
          ${this.fieldLabel('email', 'E-mail de contato', false, true)}
          <input type="email" class="field-input" data-field="email" placeholder="contato@email.com.br" value="${B.email || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('horarios', 'Dias e horários de atendimento', false, true)}
        <input type="text" class="field-input" data-field="horarios" placeholder="Ex: Segunda a sexta, 9h às 18h. Sábados mediante agendamento." value="${B.horarios || ''}">
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Rastreamento e Analytics</p>

      <div class="field-group">
        ${this.fieldLabel('gtm_id', 'ID do Google Tag Manager', false, true)}
        <input type="text" class="field-input" data-field="gtm_id" placeholder="Ex: GTM-XXXXXXX" value="${B.gtm_id || ''}">
        <span class="field-hint">Fornecido pelo gestor de tráfego. Formato: GTM- seguido de 7 caracteres.</span>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Objetivo de Conversão</p>

      <div class="field-group">
        ${this.fieldLabel('objetivo_conversao', 'Como o lead entra em contato?', true)}
        <div class="sel-cards" data-field-group="objetivo_conversao">
          ${[
        { v: 'whatsapp', icon: 'message-circle', title: 'WhatsApp', desc: 'Botão direto para conversa no WA. Mais rápido.' },
        { v: 'formulario', icon: 'mail', title: 'Formulário', desc: 'Formulário no site. Bom para triagem inicial.' },
        { v: 'agendamento', icon: 'calendar', title: 'Agendamento Online', desc: 'Link para Calendly, Cal.com ou similar.' },
        { v: 'outro', icon: 'link', title: 'Outro', desc: 'Especifique abaixo.' },
      ].map(o => `
            <div class="sel-card" data-field="objetivo_conversao" data-selcard="${o.v}" tabindex="0">
              <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
              <div>
                <div class="sel-card-title">${o.title}</div>
                <div class="sel-card-desc">${o.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${B.objetivo_conversao === 'outro' ? `
        <div class="field-group">
          ${this.fieldLabel('objetivo_outro', 'Descreva o objetivo de conversão', true)}
          <input type="text" class="field-input" data-field="objetivo_outro" placeholder="Ex: Link para checkout do Hotmart" value="${B.objetivo_outro || ''}">
        </div>
      ` : ''}
    `;
  },

  buildStep3() {
    const B = this.B;
    return `
      <p class="form-section-title">Redes Sociais e Presença Digital</p>
      <p class="form-section-title" style="font-size:12px;font-family:var(--font-body);font-weight:400;color:var(--text-secondary);border:none;padding:0;margin-top:-16px">
        Preencha apenas o que existe e está ativo. Cada rede ativada aqui pode virar um bloco ou integração no site.
      </p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('instagram', 'Instagram', false, true)}
          <input type="text" class="field-input" data-field="instagram" placeholder="@handle ou URL" value="${B.instagram || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('tiktok', 'TikTok', false, true)}
          <input type="text" class="field-input" data-field="tiktok" placeholder="@handle" value="${B.tiktok || ''}">
        </div>
      </div>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('youtube', 'YouTube', false, true)}
          <input type="text" class="field-input" data-field="youtube" placeholder="URL do canal" value="${B.youtube || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('outras_redes', 'Outras redes', false, true)}
          <input type="text" class="field-input" data-field="outras_redes" placeholder="LinkedIn, Pinterest, etc" value="${B.outras_redes || ''}">
        </div>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Integrações no Site</p>
      <p class="form-section-title" style="font-size:12px;font-family:var(--font-body);font-weight:400;color:var(--text-secondary);border:none;padding:0;margin-top:-16px">
        Marque somente o que foi confirmado. Ativo não confirmado = não inclui.
      </p>

      <div class="chip-group">
        ${[
        { v: 'maps', label: 'Google Maps Embed' },
        { v: 'reviews', label: 'Google Reviews Widget' },
        { v: 'instagram', label: 'Feed do Instagram' },
        { v: 'formulario', label: 'Formulário de Contato' },
        { v: 'whatsapp', label: 'WhatsApp Flutuante' },
        { v: 'ligacao', label: 'Botão de Ligação' },
      ].map(o => `
          <button class="chip ${(B.integracoes || []).includes(o.v) ? 'on' : ''}"
            data-field="integracoes" data-chip="${o.v}" data-multi="true">
            ${o.label}
          </button>
        `).join('')}
      </div>
    `;
  },

  buildStep4() {
    const B = this.B;
    return `
      <p class="form-section-title">Localização e Modalidade</p>

      <div class="field-group">
        ${this.fieldLabel('modalidade', 'Como o cliente atende?', true)}
        <div class="chip-group">
          ${[
        { v: 'presencial', label: 'Presencial' },
        { v: 'online', label: 'Online' },
        { v: 'hibrido', label: 'Híbrido (presencial + online)' },
      ].map(o => `
            <button class="chip ${B.modalidade === o.v ? 'on' : ''}" data-field="modalidade" data-chip="${o.v}">
              ${o.label}
            </button>
          `).join('')}
        </div>
        <span class="field-hint">Define se o site terá seção de mapa (presencial) ou plataforma online.</span>
      </div>

      ${(B.modalidade === 'presencial' || B.modalidade === 'hibrido') ? `
        <div class="field-group">
          ${this.fieldLabel('endereco', 'Endereço completo', true)}
          <textarea class="field-textarea" data-field="endereco" placeholder="Rua, número, bairro, cidade, estado, CEP. Ponto de referência se útil.">${B.endereco || ''}</textarea>
        </div>

        <div class="field-group">
          ${this.fieldLabel('exibir_localizacao', 'Como exibir a localização no site?', true)}
          <div class="chip-group">
            ${[
          { v: 'completo', label: 'Endereço completo' },
          { v: 'cidade', label: 'Só cidade / região' },
          { v: 'nao', label: 'Não exibir' },
        ].map(o => `
              <button class="chip ${B.exibir_localizacao === o.v ? 'on' : ''}" data-field="exibir_localizacao" data-chip="${o.v}">
                ${o.label}
              </button>
            `).join('')}
          </div>
          <span class="field-hint">"Só cidade" é mais seguro para quem atende em casa.</span>
        </div>

        <div class="field-group">
          ${this.fieldLabel('cidades_atendimento', 'Cidades de atendimento presencial', false, true)}
          <input type="text" class="field-input" data-field="cidades_atendimento" placeholder="Ex: São Paulo, Guarulhos, Santo André" value="${B.cidades_atendimento || ''}">
        </div>
      ` : ''}

      ${(B.modalidade === 'online' || B.modalidade === 'hibrido') ? `
        <div class="field-group">
          ${this.fieldLabel('plataforma_online', 'Plataforma de atendimento online', false, true)}
          <input type="text" class="field-input" data-field="plataforma_online" placeholder="Ex: Google Meet, Zoom, Calendly" value="${B.plataforma_online || ''}">
        </div>
      ` : ''}
    `;
  },

  buildStep5() {
    const B = this.B;
    return `
      <p class="form-section-title">Serviços e Preço</p>
      <div class="field-group">
        ${this.fieldLabel('servico_principal', 'Serviço principal — foco da campanha', true)}
        <input type="text" class="field-input" data-field="servico_principal" placeholder="Ex: Mentoria de adestramento canino" value="${B.servico_principal || ''}">
      </div>
      <div class="field-group">
        ${this.fieldLabel('servicos_descricao', 'Descrição detalhada', true)}
        <textarea class="field-textarea tall" data-field="servicos_descricao" placeholder="O que inclui, como funciona...">${B.servicos_descricao || ''}</textarea>
      </div>
      <div class="field-group">
        ${this.fieldLabel('preco_exibir', 'Exibir preço?', true)}
        <div class="chip-group">
          <button class="chip ${B.preco_exibir === 'sim' ? 'on' : ''}" data-field="preco_exibir" data-chip="sim">Sim</button>
          <button class="chip ${B.preco_exibir === 'nao' ? 'on' : ''}" data-field="preco_exibir" data-chip="nao">Não</button>
        </div>
      </div>
    `;
  },

  buildStep6() {
    const B = this.B;
    return `
      <p class="form-section-title">Público-Alvo</p>
      <div class="field-group">
        ${this.fieldLabel('publico_primario', 'Perfil do cliente ideal', true)}
        <textarea class="field-textarea" data-field="publico_primario" placeholder="Idade, dores, desejos...">${B.publico_primario || ''}</textarea>
      </div>
      <div class="field-group">
        ${this.fieldLabel('publico_dor', 'Principal dor / problema', true)}
        <textarea class="field-textarea" data-field="publico_dor" placeholder="O problema que ele quer resolver AGORA.">${B.publico_dor || ''}</textarea>
      </div>
      <div class="field-group">
        ${this.fieldLabel('publico_resultado', 'Resultado esperado', true)}
        <textarea class="field-textarea" data-field="publico_resultado" placeholder="Como ele se sente após contratar?">${B.publico_resultado || ''}</textarea>
      </div>
    `;
  },

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
        <span class="field-hint">Nunca inventamos depoimentos. Se \"Não\", o bloco de prova social não é incluído.</span>
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



  /* ─────────────────────────────────────────────────────
     BUILD: ART DIRECTION SCREEN
  ───────────────────────────────────────────────────── */
  buildArtScreen() {
    const B = this.B;
    const pessoais = B.arte_referencias_pessoais || [];
    const nicho = B.arte_referencias_nicho || [];

    return `
    <div class="art-screen">

      <div class="art-screen-header">
        <h2 class="art-screen-title">Direção de Arte</h2>
        <p class="art-screen-desc">
          Cole referências pessoais e do nicho, suba ativos da marca e links.
          A IA analisa tudo e devolve uma ficha estruturada com paleta, tipografia e tom visual.
          Você aprova antes de qualquer geração.
        </p>
      </div>

      <!-- Ativos da Marca -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="image" class="art-section-icon" style="color:var(--accent2)"></i>
          <span class="art-section-title">Ativos da Marca</span>
        </div>
        <div class="art-section-body">
          <div id="art-upload-zone" class="upload-zone">
            <input type="file" multiple accept=".svg,.png,.jpg,.jpeg,.webp,.pdf">
            <i data-lucide="upload-cloud" class="upload-zone-icon"></i>
            <p class="upload-zone-label">Logo, fotos do profissional, materiais de marca</p>
            <p class="upload-zone-hint">SVG, PNG, JPG, WEBP, PDF — até 10MB por arquivo</p>
          </div>
          <div id="art-files-list" class="upload-preview-list"></div>

          <div class="form-row">
            <div class="field-group">
              ${this.fieldLabel('arte_logo', 'Status da logo', true)}
              <div class="chip-group">
                ${[{ v: 'svg', l: 'SVG disponível' }, { v: 'png', l: 'PNG disponível' }, { v: 'nao', l: 'Sem logo' }].map(o =>
      `<button class="chip ${B.arte_logo === o.v ? 'on' : ''}" data-field="arte_logo" data-chip="${o.v}">${o.l}</button>`
    ).join('')}
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_fotos', 'Fotos do profissional/produto', true)}
              <div class="chip-group">
                ${[{ v: 'boa', l: 'Boa qualidade' }, { v: 'media', l: 'Qualidade média' }, { v: 'nao', l: 'Sem fotos' }].map(o =>
      `<button class="chip ${B.arte_fotos === o.v ? 'on' : ''}" data-field="arte_fotos" data-chip="${o.v}">${o.l}</button>`
    ).join('')}
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                ${this.fieldLabel('arte_cor_principal', 'Cor principal da marca', false)}
              </div>
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_principal" value="${B.arte_cor_principal || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_principal"
                  placeholder="#HEX ou 'não definida'" value="${B.arte_cor_principal || ''}">
              </div>
            </div>
            <div class="field-group">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                ${this.fieldLabel('arte_cor_secundaria', 'Cor secundária', false)}
              </div>
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_secundaria" value="${B.arte_cor_secundaria || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_secundaria"
                  placeholder="#HEX ou 'não definida'" value="${B.arte_cor_secundaria || ''}">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Referências Pessoais -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="heart" class="art-section-icon" style="color:var(--warning)"></i>
          <span class="art-section-title">Referências Pessoais</span>
        </div>
        <div class="art-section-body">
          <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin-bottom:4px">
            Sites, marcas ou projetos que você admira visualmente. A IA vai acessar os links e "ver" o que te atraiu neles.
            Coloque o que te inspirou <em>e</em> o que adaptar para o nicho do cliente.
          </p>
          ${pessoais.map((ref, i) => this.buildRefItem('pessoais', i, ref)).join('')}
          <button class="btn-ghost btn-sm" data-add-ref="pessoais">
            <i data-lucide="plus" style="width:14px;height:14px"></i>
            Adicionar referência pessoal
          </button>
        </div>
      </div>

      <!-- Referências do Nicho -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="search" class="art-section-icon" style="color:var(--accent)"></i>
          <span class="art-section-title">Referências do Nicho</span>
        </div>
        <div class="art-section-body">
          <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin-bottom:4px">
            Sites de concorrentes ou do mesmo segmento. Ajuda a IA a entender o que o público espera ver
            — e o que evitar para se diferenciar.
          </p>
          ${nicho.map((ref, i) => this.buildRefItem('nicho', i, ref)).join('')}
          <button class="btn-ghost btn-sm" data-add-ref="nicho">
            <i data-lucide="plus" style="width:14px;height:14px"></i>
            Adicionar referência do nicho
          </button>
        </div>
      </div>

      <!-- Direção Geral -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="sliders" class="art-section-icon" style="color:var(--accent2)"></i>
          <span class="art-section-title">Direção Geral</span>
        </div>
        <div class="art-section-body">

          <div class="field-group">
            ${this.fieldLabel('arte_tema', 'Tema visual', true)}
            <div class="chip-group">
              ${[
        { v: 'escuro', l: 'Escuro (dark)' },
        { v: 'claro', l: 'Claro (light)' },
        { v: 'ia', l: 'IA decide baseado na marca' },
      ].map(o => `
                <button class="chip ${B.arte_tema === o.v ? 'on' : ''}" data-field="arte_tema" data-chip="${o.v}">${o.l}</button>
              `).join('')}
            </div>
          </div>

          <div class="field-group">
            ${this.fieldLabel('arte_intensidade', 'Intensidade visual', true)}
            <div class="sel-cards" data-field-group="arte_intensidade">
              ${[
        { v: 'contido', icon: 'minus-circle', title: 'Contido', desc: 'Animações sutis, foco no conteúdo. Consultórios, clínicas, B2B.' },
        { v: 'medio', icon: 'circle', title: 'Médio', desc: 'Presença notável. Profissionais criativos, mentores, premium.' },
        { v: 'alto', icon: 'zap-off', title: 'Alto', desc: 'Efeito uau total. Imersivo, editorial. Diferença imediata.' },
      ].map(o => `
                <div class="sel-card" data-field="arte_intensidade" data-selcard="${o.v}" tabindex="0">
                  <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
                  <div>
                    <div class="sel-card-title">${o.title}</div>
                    <div class="sel-card-desc">${o.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              ${this.fieldLabel('arte_menu_mobile', 'Menu mobile', false, true)}
              <div class="chip-group">
                ${[
        { v: 'fullscreen', l: 'Fullscreen' },
        { v: 'drawer', l: 'Drawer lateral' },
        { v: 'bottom', l: 'Bottom sheet' },
        { v: 'ia', l: 'IA decide' },
      ].map(o => `
                  <button class="chip ${B.arte_menu_mobile === o.v ? 'on' : ''}" data-field="arte_menu_mobile" data-chip="${o.v}">${o.l}</button>
                `).join('')}
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_referencia_marca', 'Referência de marca', false, true)}
              <input type="text" class="field-input" data-field="arte_referencia_marca"
                placeholder="Ex: Próximo de Notion, Linear ou Stripe"
                value="${B.arte_referencia_marca || ''}">
            </div>
          </div>

          <div class="field-group">
            ${this.fieldLabel('arte_footer_tom', 'Como deve ser o footer?', false, true)}
            <textarea class="field-textarea" data-field="arte_footer_tom"
              placeholder="Tom visual, elementos que deve ter, sensação que deve causar.
Ex: Footer escuro com destaque em verde — último empurrão de conversão. Logo, WA, redes e registro profissional.">${B.arte_footer_tom || ''}</textarea>
          </div>

          <div class="field-group">
            ${this.fieldLabel('arte_o_que_nao_quero', 'O que NÃO quero visualmente', false, true)}
            <textarea class="field-textarea" data-field="arte_o_que_nao_quero"
              placeholder="Elementos visuais, estilos, cores ou abordagens que você quer evitar.
Ex: Sem gradiente roxo. Sem ilustrações infantis. Sem ícones estilo flaticon genérico.">${B.arte_o_que_nao_quero || ''}</textarea>
          </div>

        </div>
      </div>

      <!-- Ação: Analisar -->
      <div style="display:flex;justify-content:flex-end;gap:12px;padding-bottom:40px">
        ${this.state.artAnalyzed ? `
          <div style="display:flex;align-items:center;gap:8px;color:var(--success);font-size:13px">
            <i data-lucide="check-circle" style="width:16px;height:16px"></i>
            Direção aprovada
          </div>
        ` : ''}
        <button id="btn-analyze-art" class="btn-secondary">
          <i data-lucide="sparkles" style="width:16px;height:16px"></i>
          Analisar e gerar ficha de direção
        </button>
      </div>

    </div>
    `;
  },

  buildRefItem(type, index, ref) {
    const key = `arte_referencias_${type}`;
    return `
      <div class="reference-item">
        <div class="reference-item-header">
          <span class="reference-index">#${index + 1}</span>
          <button onclick="App.removeArtReference('${type}', ${index}); App.renderScreen();" style="color:var(--text-tertiary);padding:2px" title="Remover">
            <i data-lucide="x" style="width:14px;height:14px"></i>
          </button>
        </div>
        <div class="field-group">
          <label class="field-label">Link</label>
          <input type="url" class="field-input" placeholder="https://exemplo.com"
            value="${ref.link || ''}"
            onchange="App.updateArtRef('${type}', ${index}, 'link', this.value)">
        </div>
        <div class="field-group">
          <label class="field-label">O que me atraiu nesse site</label>
          <textarea class="field-textarea" placeholder="Seja específico: tipografia, cor, movimento, layout, hierarquia."
            onchange="App.updateArtRef('${type}', ${index}, 'gostei', this.value)">${ref.gostei || ''}</textarea>
        </div>
        <div class="field-group">
          <label class="field-label">O que adaptar para este nicho</label>
          <textarea class="field-textarea" placeholder="O que funciona aqui e o que não se transfere para o nicho do cliente."
            onchange="App.updateArtRef('${type}', ${index}, 'adaptar', this.value)">${ref.adaptar || ''}</textarea>
        </div>
      </div>
    `;
  },

  addArtReference(type) {
    const key = `arte_referencias_${type}`;
    if (!this.P) return;
    if (!this.P.briefing[key]) this.P.briefing[key] = [];
    this.P.briefing[key].push({ link: '', gostei: '', adaptar: '' });
    this.autosave();
  },

  removeArtReference(type, index) {
    const key = `arte_referencias_${type}`;
    if (!this.P || !this.P.briefing[key]) return;
    this.P.briefing[key].splice(index, 1);
    this.autosave();
  },

  updateArtRef(type, index, prop, value) {
    const key = `arte_referencias_${type}`;
    if (!this.P || !this.P.briefing[key]?.[index]) return;
    this.P.briefing[key][index][prop] = value;
    this.autosave();
  },

  /* ─────────────────────────────────────────────────────
     BUILD: REVIEW SCREEN
  ───────────────────────────────────────────────────── */
  buildReviewScreen() {
    const score = this.getGlobalScore();
    const cls = this.getScoreClass(score);
    const color = this.getScoreColor(score);
    const missing = this.getMissingCritical();
    const warns = this.getAllWarnings();
    const canGen = this.canGenerate();

    const statusMsg = score >= 80 ? 'Briefing sólido — pronto para gerar' :
      score >= 55 ? 'Briefing razoável — revise os avisos antes de gerar' :
        'Briefing incompleto — preencha os campos críticos';

    return `
    <div class="review-screen">

      <!-- Score Global -->
      <div class="review-global-score">
        <div class="review-score-main">
          <span class="review-score-number" style="color:${color}">${score}%</span>
          <span class="review-score-label">Completude geral</span>
        </div>
        <div class="review-score-bar-wrap">
          <div class="review-score-bar-bg">
            <div class="review-score-bar-fill" style="width:${score}%;background:${color}"></div>
          </div>
          <span class="review-score-status">${statusMsg}</span>
        </div>
      </div>

      <!-- Steps Grid -->
      <div class="review-steps-grid">
        ${STEPS.map(s => {
      const ss = this.getStepScore(s.id);
      const sc = this.getScoreClass(ss);
      return `
            <div class="review-step-card" data-goto-step="${s.id}">
              <div class="review-step-card-header">
                <span class="review-step-card-name">${s.name}</span>
                <span class="review-step-card-score ${sc}">${ss}%</span>
              </div>
              <div class="review-step-card-bar">
                <div class="review-step-card-fill" style="width:${ss}%;background:${this.getScoreColor(ss)}"></div>
              </div>
              <span class="review-step-card-btn">
                <i data-lucide="pencil" style="width:11px;height:11px"></i>
                Editar
              </span>
            </div>
          `;
    }).join('')}
      </div>

      <!-- Campos críticos faltando -->
      ${missing.length > 0 ? `
        <div class="review-critical-missing">
          <div style="display:flex;align-items:center;gap:8px;color:var(--danger);font-weight:600;font-size:13px;margin-bottom:10px">
            <i data-lucide="alert-circle" style="width:16px;height:16px"></i>
            ${missing.length} campo${missing.length > 1 ? 's' : ''} crítico${missing.length > 1 ? 's' : ''} faltando
          </div>
          ${missing.map(m => `
            <div style="display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:var(--text-secondary);padding:6px 0">
              <span>✗ ${m.field.replace(/_/g, ' ')}</span>
              <span class="review-step-card-btn" data-goto-step="${m.step}" style="cursor:pointer;color:var(--accent2)">
                Step ${m.step} →
              </span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Warnings -->
      ${warns.length > 0 ? `
        <div class="review-warnings">
          <div class="review-warnings-header">
            <i data-lucide="alert-triangle" style="width:15px;height:15px"></i>
            ${warns.length} aviso${warns.length > 1 ? 's' : ''} de qualidade
          </div>
          ${warns.map(w => `
            <div class="review-warning-item">
              <i data-lucide="alert-triangle" style="width:13px;height:13px;color:var(--warning);flex-shrink:0"></i>
              <span>${w.msg}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Ações de Geração -->
      <div class="review-actions-box">
        <h3 class="review-actions-title">Gerar Documentação</h3>

        <div class="review-action-row">
          <!-- Saída A: Manual -->
          <div class="review-action-card">
            <i data-lucide="download" class="review-action-card-icon" style="width:20px;height:20px"></i>
            <div class="review-action-card-title">Baixar DOC-1</div>
            <div class="review-action-card-desc">
              Briefing estruturado completo em .md, com instrução mestre e regras Adsgator.
              Use em qualquer IA manualmente para gerar a ficha de implementação.
            </div>
            <div class="review-action-card-btn">
              <button id="btn-download-doc1" class="btn-ghost">
                <i data-lucide="download" style="width:15px;height:15px"></i>
                Baixar DOC-1 (.md)
              </button>
            </div>
          </div>

          <!-- Saída B: Automático -->
          <div class="review-action-card" style="border-color:${canGen ? 'var(--accent-border)' : 'var(--border-default)'}">
            <i data-lucide="zap" class="review-action-card-icon" style="width:20px;height:20px;color:${canGen ? 'var(--accent)' : 'var(--text-tertiary)'}"></i>
            <div class="review-action-card-title">Gerar DOC-IMPL via IA</div>
            <div class="review-action-card-desc">
              A IA recebe o DOC-1 e gera a Ficha de Implementação completa — código Astro, design system, copy, tudo.
              Pronto para o Roo Code implementar.
            </div>
            ${!canGen && missing.length > 0 ? `
              <div style="font-size:11px;color:var(--danger);display:flex;gap:5px;align-items:center">
                <i data-lucide="lock" style="width:12px;height:12px"></i>
                Preencha os campos críticos primeiro
              </div>
            ` : !canGen ? `
              <div style="font-size:11px;color:var(--warning);display:flex;gap:5px;align-items:center">
                <i data-lucide="key" style="width:12px;height:12px"></i>
                Configure uma API Key em Config. API
              </div>
            ` : ''}
            <div class="review-action-card-btn">
              <button id="btn-generate-docimpl" class="btn-primary" ${!canGen ? 'disabled' : ''}>
                <i data-lucide="zap" style="width:15px;height:15px"></i>
                Gerar Ficha de Implementação
              </button>
            </div>
          </div>
        </div>

        <div style="font-size:11.5px;color:var(--text-tertiary);display:flex;align-items:center;gap:6px">
          <i data-lucide="cpu" style="width:13px;height:13px"></i>
          Modelo selecionado: <strong style="color:var(--text-secondary)">${AI_MODELS[this.state.selectedModel]?.label}</strong>
        </div>

      </div>
    </div>
    `;
  },

  /* ─────────────────────────────────────────────────────
     BOTTOMBAR
  ───────────────────────────────────────────────────── */
  renderBottombar() {
    const prev = document.getElementById('btn-prev');
    const actions = document.getElementById('bottombar-actions');
    const center = document.getElementById('bottombar-center');
    if (!prev || !actions) return;

    // Prev
    const showPrev = this.state.screen !== 'intake';
    prev.style.display = showPrev ? '' : 'none';
    prev.onclick = () => this.goPrev();

    // Center: step indicator
    if (this.state.screen === 'step') {
      center.innerHTML = `<span style="font-size:12px;color:var(--text-tertiary);font-family:var(--font-mono)">
        Step ${this.state.currentStep} de ${STEPS.length}
      </span>`;
    } else {
      center.innerHTML = '';
    }

    // Actions
    if (this.state.screen === 'review') {
      actions.innerHTML = ''; // Os botões são na própria review screen
    } else if (this.state.screen === 'art') {
      const artLabel = this.state.artAnalyzed ? 'Continuar para Revisão →' : 'Ir para Revisão →';
      actions.innerHTML = `
        <button class="btn-ghost" onclick="App.goToScreen('review')">
          ${artLabel}
        </button>
      `;
    } else {
      const isLastStep = this.state.screen === 'step' && this.state.currentStep === 8;
      const nextLabel = isLastStep ? 'Direção de Arte →' :
        this.state.screen === 'intake' ? 'Ir para Step 1 →' : 'Próximo →';
      actions.innerHTML = `
        <button class="btn-primary" onclick="App.goNext()">
          ${nextLabel}
          <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
        </button>
      `;
      lucide.createIcons({ nodes: [actions] });
    }
  },

  /* ─────────────────────────────────────────────────────
     INTAKE ANALYSIS
  ───────────────────────────────────────────────────── */
  async runIntakeAnalysis() {
    const B = this.B;
    const text = B.briefing_bruto || '';
    const files = this.state.intakeFiles || [];

    if (!text.trim() && files.length === 0) {
      this.showToast('Cole o briefing ou anexe arquivos antes de analisar.', 'warning');
      return;
    }

    const model = AI_MODELS[this.state.selectedModel];
    const apiKey = this.state.apiKeys[model.provider];
    if (!apiKey?.trim()) {
      this.showToast('Configure uma API Key primeiro (Config. API).', 'warning');
      this.openModal('modal-api');
      return;
    }

    // Loading state
    document.getElementById('screen-content').innerHTML = `
      <div class="intake-screen">
        <div class="intake-loading">
          <i data-lucide="loader-2" class="intake-loading-icon" style="width:40px;height:40px"></i>
          <div class="intake-loading-title">Analisando briefing...</div>
          <div class="intake-loading-sub">A IA está lendo o material e preenchendo os steps. Aguarde.</div>
        </div>
      </div>
    `;
    lucide.createIcons({ nodes: [document.getElementById('screen-content')] });

    try {
      const prompt = this.buildIntakePrompt(text);
      const response = await this.callAI(prompt);
      this.parseIntakeResponse(response);
      this.showToast('Steps preenchidos! Revise os dados.', 'success');
      this.goToStep(1);
    } catch (err) {
      this.state.screen = 'intake';
      this.renderScreen();
      this.showToast(`Erro na análise: ${err.message}`, 'error');
      console.error('[LandingAI] Intake analysis error:', err);
    }
  },

  buildIntakePrompt(text) {
    return `Você é um estrategista de marketing digital especializado em landing pages de conversão para prestadores de serviços locais e profissionais liberais.

Leia o material abaixo e extraia as informações para preencher os campos.
Responda APENAS com JSON válido no formato exato indicado — sem markdown, sem comentários, sem texto adicional.
Se uma informação não estiver disponível, use string vazia "".

CAMPOS PARA EXTRAIR:
{
  "nome_cliente": "Nome completo do profissional/empresa",
  "nome_marca": "Nome comercial/marca se diferente",
  "segmento": "Segmento específico de atuação",
  "tipo": "servico | mentoria | consultoria | produto | saas",
  "whatsapp": "Somente dígitos com DDI+DDD",
  "email": "E-mail de contato",
  "horarios": "Dias e horários de atendimento",
  "instagram": "Handle ou URL do Instagram",
  "tiktok": "Handle do TikTok",
  "youtube": "URL do YouTube",
  "modalidade": "presencial | online | hibrido",
  "endereco": "Endereço completo se presencial",
  "cidades_atendimento": "Cidades atendidas",
  "servico_principal": "Serviço principal em uma linha",
  "servicos_lista": "Lista de serviços, um por linha",
  "servicos_descricao": "Descrição detalhada de cada serviço",
  "objetivo_conversao": "whatsapp | formulario | agendamento | outro",
  "preco_exibir": "sim | nao",
  "preco_valor": "Valor e forma de cobrança",
  "preco_condicao": "Condição especial se houver",
  "publico_primario": "Perfil detalhado do cliente ideal",
  "publico_dor": "Principal problema/dor antes de contratar",
  "publico_resultado": "O que o cliente quer alcançar",
  "publico_secundario": "Público secundário se houver",
  "diferencial": "O que concretamente diferencia esse profissional",
  "frase_impacto": "Frase de impacto do profissional",
  "historia": "História/origem do profissional",
  "depoimentos": "sim | nao",
  "google_business": "sim | nao",
  "google_nota": "Nota no Google se houver",
  "google_qtd": "Número de avaliações",
  "estilo_desejado": "Como o site deve ser percebido",
  "sensacao_visitante": "O que o visitante deve sentir",
  "vocabulario_usa": "Termos que o cliente usa",
  "vocabulario_nunca": "Termos que o cliente nunca usaria",
  "frase_tom": "Frase que resume o tom de voz",
  "restricoes": "O que não quer de forma alguma",
  "dominio": "Domínio desejado",
  "cnpj": "CNPJ se fornecido",
  "aviso_legal": "Registro profissional CRM/CRP/OAB etc"
}

MATERIAL DO CLIENTE:
${text}`;
  },

  parseIntakeResponse(response) {
    try {
      // Remove markdown fences se houver
      const clean = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(clean);
      if (!this.P) return;
      Object.keys(data).forEach(key => {
        if (key in this.P.briefing && data[key] !== undefined) {
          this.P.briefing[key] = data[key];
        }
      });
      this.autosave();
    } catch (err) {
      console.error('[LandingAI] parseIntakeResponse erro:', err);
      throw new Error('A IA retornou um formato inválido. Tente novamente.');
    }
  },

  /* ─────────────────────────────────────────────────────
     ART ANALYSIS
  ───────────────────────────────────────────────────── */
  async runArtAnalysis() {
    const B = this.B;
    const model = AI_MODELS[this.state.selectedModel];
    const apiKey = this.state.apiKeys[model.provider];

    if (!apiKey?.trim()) {
      this.showToast('Configure uma API Key primeiro.', 'warning');
      this.openModal('modal-api');
      return;
    }

    const btn = document.getElementById('btn-analyze-art');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite"></i> Analisando...`;
      lucide.createIcons({ nodes: [btn] });
    }

    try {
      const prompt = this.buildArtPrompt();
      const response = await this.callAI(prompt);
      this.renderArtResult(response);
    } catch (err) {
      this.showToast(`Erro na análise de arte: ${err.message}`, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="sparkles" style="width:16px;height:16px"></i> Analisar e gerar ficha de direção`;
        lucide.createIcons({ nodes: [btn] });
      }
    }
  },

  buildArtPrompt() {
    const B = this.B;
    const pessoais = (B.arte_referencias_pessoais || []).map((r, i) =>
      `Referência pessoal ${i + 1}: ${r.link}\nO que gostei: ${r.gostei}\nO que adaptar: ${r.adaptar}`
    ).join('\n\n');

    const nicho = (B.arte_referencias_nicho || []).map((r, i) =>
      `Referência do nicho ${i + 1}: ${r.link}\nO que gostei: ${r.gostei}\nO que adaptar: ${r.adaptar}`
    ).join('\n\n');

    return `Você é um Diretor de Arte e UI Designer de elite especializado em landing pages de conversão.

Analise o briefing de direção de arte abaixo e gere uma FICHA ESTRUTURADA de direção criativa.

CLIENTE: ${B.nome_cliente} | NICHO: ${B.segmento} | TIPO: ${B.tipo}

ATIVOS DA MARCA:
- Logo: ${B.arte_logo || 'não definida'}
- Fotos: ${B.arte_fotos || 'não definidas'}
- Cor principal: ${B.arte_cor_principal || 'não definida'}
- Cor secundária: ${B.arte_cor_secundaria || 'não definida'}

DIREÇÃO:
- Tema: ${B.arte_tema || 'não definido'}
- Intensidade: ${B.arte_intensidade || 'não definida'}
- Referência de marca: ${B.arte_referencia_marca || 'não definida'}
- O que NÃO quer: ${B.arte_o_que_nao_quero || 'não especificado'}
- Menu mobile: ${B.arte_menu_mobile || 'não definido'}
- Footer: ${B.arte_footer_tom || 'não definido'}

ESTILO DESEJADO: ${B.estilo_desejado}
SENSAÇÃO VISITANTE: ${B.sensacao_visitante}

REFERÊNCIAS PESSOAIS:
${pessoais || 'Não fornecidas'}

REFERÊNCIAS DO NICHO:
${nicho || 'Não fornecidas'}

Gere a ficha em JSON com este formato exato:
{
  "paleta": [
    { "nome": "Principal", "hex": "#XXXXXX", "uso": "CTAs, destaques, botões primários" },
    { "nome": "Fundo", "hex": "#XXXXXX", "uso": "Background geral das páginas" },
    { "nome": "Superfície", "hex": "#XXXXXX", "uso": "Cards, seções alternadas" },
    { "nome": "Texto", "hex": "#XXXXXX", "uso": "Corpo do texto, parágrafos" },
    { "nome": "Acento", "hex": "#XXXXXX", "uso": "Hover states, links, secundário" }
  ],
  "tipografia": {
    "display": { "fonte": "Nome da fonte", "peso": "700", "uso": "Títulos H1, hero", "google": "URL Google Fonts" },
    "corpo": { "fonte": "Nome da fonte", "peso": "400/500", "uso": "Parágrafos, labels, UI", "google": "URL Google Fonts" },
    "mono": { "fonte": "Nome da fonte", "peso": "400", "uso": "Destaque técnico, badges", "google": "URL Google Fonts" }
  },
  "tom_visual": "Descrição detalhada do tom visual — estilo, linguagem visual, referências sintetizadas",
  "referencias_interpretadas": [
    { "fonte": "URL ou nome", "tipo": "pessoal|nicho", "o_que_usar": "O que será incorporado ao design" }
  ],
  "animacoes": "Diretriz de animações — tipo, velocidade, gatilhos, prefers-reduced-motion",
  "layout": "Diretriz de layout — grid, espaçamento, uso de viewport, assimetria",
  "mobile_first": "Decisões específicas de mobile: tipografia, espaçamento, hero, menu",
  "footer": "Especificação do footer: fundo, tipografia, elementos, tom final",
  "decisoes": ["Decisão criativa 1 com justificativa", "Decisão criativa 2", "Decisão criativa 3"]
}

Responda APENAS com JSON válido. Sem markdown, sem comentários.`;
  },

  renderArtResult(response) {
    try {
      const clean = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(clean);
      if (this.P) {
        this.P.briefing.arte_ficha_aprovada = '';
      }

      const body = document.getElementById('art-result-body');
      if (!body) { this.openModal('modal-art-result'); return; }

      const modal = document.getElementById('modal-art-result');
      modal.querySelector('#art-result-body').innerHTML = this.buildArtResultHTML(data);
      lucide.createIcons({ nodes: [modal] });

      // Store para aprovação
      this._pendingArtFicha = JSON.stringify(data);

      document.getElementById('btn-art-approve').onclick = () => {
        if (this.P) this.P.briefing.arte_ficha_aprovada = this._pendingArtFicha;
        this.state.artAnalyzed = true;
        this.autosave();
        this.closeModal('modal-art-result');
        this.showToast('Direção de arte aprovada!', 'success');
        this.renderStepsNav();
      };

      this.openModal('modal-art-result');
    } catch (err) {
      this.showToast('Erro ao processar ficha de arte. Tente novamente.', 'error');
      console.error('[LandingAI] renderArtResult erro:', err);
    }
  },

  buildArtResultHTML(data) {
    const paleta = (data.paleta || []).map(p => `
      <div class="palette-swatch">
        <div class="palette-swatch-color" style="background:${p.hex}"></div>
        <span class="palette-swatch-label">${p.hex}</span>
        <span style="font-size:10px;color:var(--text-tertiary);max-width:60px;text-align:center">${p.nome}</span>
      </div>
    `).join('');

    const refs = (data.referencias_interpretadas || []).map(r => `
      <div class="review-warning-item">
        <span class="art-result-tag">${r.tipo}</span>
        <span style="font-size:12.5px;color:var(--text-secondary)"><strong style="color:var(--text-primary)">${r.fonte}</strong> — ${r.o_que_usar}</span>
      </div>
    `).join('');

    const decisoes = (data.decisoes || []).map(d => `
      <div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-bottom:1px solid var(--border-subtle)">
        <i data-lucide="check" style="width:13px;height:13px;color:var(--accent);flex-shrink:0;margin-top:3px"></i>
        <span class="art-result-text" style="font-size:12.5px">${d}</span>
      </div>
    `).join('');

    return `
      <div class="art-result-card">
        <div class="art-result-section">
          <div class="art-result-section-title">Paleta de Cores</div>
          <div class="palette-swatches">${paleta}</div>
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title">Tipografia</div>
          ${data.tipografia ? `
            <div style="display:flex;flex-direction:column;gap:6px">
              <div class="art-result-text"><strong>Display:</strong> ${data.tipografia.display?.fonte} ${data.tipografia.display?.peso} — ${data.tipografia.display?.uso}</div>
              <div class="art-result-text"><strong>Corpo:</strong> ${data.tipografia.corpo?.fonte} ${data.tipografia.corpo?.peso} — ${data.tipografia.corpo?.uso}</div>
              ${data.tipografia.mono ? `<div class="art-result-text"><strong>Mono:</strong> ${data.tipografia.mono?.fonte} — ${data.tipografia.mono?.uso}</div>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title">Tom Visual</div>
          <p class="art-result-text">${data.tom_visual || ''}</p>
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title">Layout e Animações</div>
          <p class="art-result-text">${data.layout || ''}</p>
          <p class="art-result-text" style="margin-top:8px">${data.animacoes || ''}</p>
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title">Mobile e Footer</div>
          <p class="art-result-text"><strong>Mobile:</strong> ${data.mobile_first || ''}</p>
          <p class="art-result-text" style="margin-top:8px"><strong>Footer:</strong> ${data.footer || ''}</p>
        </div>
        ${refs ? `
          <div class="art-result-section">
            <div class="art-result-section-title">Referências Interpretadas</div>
            ${refs}
          </div>
        ` : ''}
        ${decisoes ? `
          <div class="art-result-section">
            <div class="art-result-section-title">Decisões Criativas</div>
            ${decisoes}
          </div>
        ` : ''}
      </div>
    `;
  },

  /* ─────────────────────────────────────────────────────
     DOC GENERATION
  ───────────────────────────────────────────────────── */
  buildDoc1() {
    const B = this.B;
    const P = this.P;
    const now = new Date().toISOString();
    const fichaArte = B.arte_ficha_aprovada ? JSON.parse(B.arte_ficha_aprovada) : null;

    const integracoesList = (B.integracoes || []).map(i => {
      const labels = {
        maps: 'Google Maps Embed',
        reviews: 'Google Reviews Widget',
        instagram: 'Feed do Instagram',
        formulario: 'Formulário de Contato',
        whatsapp: 'WhatsApp Flutuante',
        ligacao: 'Botão de Ligação Mobile',
      };
      const checks = {
        maps: B.modalidade?.includes('presencial') && B.exibir_localizacao !== 'nao',
        reviews: B.google_business === 'sim' && parseInt(B.google_qtd) >= 10,
        instagram: !!B.instagram,
        formulario: true,
        whatsapp: true,
        ligacao: true,
      };
      return `- [${checks[i] ? 'x' : ' '}] ${labels[i] || i}`;
    }).join('\n');

    const paleta = fichaArte?.paleta?.map(p =>
      `| ${p.nome} | \`${p.hex}\` | ${p.uso} |`
    ).join('\n') || '| — | — | — |';

    return `---
title: ${B.nome_cliente} — Briefing e Direção
date: ${now}
tags: [adsgator, briefing, doc-1]
status: pronto-para-ia
gerado_por: LandingAI v2
modelo_ia: ${AI_MODELS[this.state.selectedModel]?.label || 'manual'}
projeto: ${P?.slug || B.slug || ''}
---

# ${B.nome_cliente} — Briefing e Direção

> **Documento 1 — Adsgator (gerado pelo LandingAI v2)**
> Envie este documento para a IA gerar a Ficha de Implementação completa.
> Não edite — envie como está.

---

## INSTRUÇÃO MESTRE PARA A IA

Você é um Diretor de Arte, UI Designer de elite, Copywriter Sênior e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este documento inteiro e gerar como output a **Ficha de Implementação completa** — com código real, design system completo, copy palavra por palavra e ordem de criação de arquivos.

**O que isso significa:**
- Você toma todas as decisões de design que não estão explicitadas — tipografia, escala, tokens, animações, layout de cada seção.
- Você preenche cada campo com valores concretos. Sem placeholders. Sem [definir depois]. Sem [a combinar].
- O output deve poder ser copiado e enviado ao Roo Code sem nenhuma edição adicional.

**Padrão de qualidade:**
Design editorial de alto padrão — atípico, com personalidade visual forte, fora do visual genérico de IA.
Pense Raycast, Linear, Family.co. Layouts com intenção. Tipografia com personalidade. Animações que têm razão de existir.

**Sobre mobile:** Mobile não é adaptação — é o ponto de partida. Começa em 375px.

**Sobre o viewport:** Seções que se beneficiam de ocupar o viewport completo devem fazê-lo. Container é ferramenta, não prisão.

**Sobre o footer:** Última impressão — identidade visual real, conectada ao tom da página.

---

## PARTE 1 — IDENTIDADE DO PROJETO

| Campo | Valor |
|---|---|
| **Cliente** | ${B.nome_cliente || '—'} |
| **Marca** | ${B.nome_marca || B.nome_cliente || '—'} |
| **Slug** | ${B.slug || '—'} |
| **Segmento** | ${B.segmento || '—'} |
| **Tipo** | ${B.tipo || '—'} |
| **WhatsApp** | ${B.whatsapp || '—'} |
| **Link WA** | ${B.whatsapp ? `https://wa.me/${B.whatsapp}` : '—'} |
| **E-mail** | ${B.email || '—'} |
| **Horários** | ${B.horarios || '—'} |
| **GTM ID** | ${B.gtm_id || '—'} |
| **Domínio** | ${B.dominio || '—'} |
| **CNPJ** | ${B.cnpj || '—'} |
| **Aviso legal** | ${B.aviso_legal || '—'} |
| **Modalidade** | ${B.modalidade || '—'} |
| **Objetivo de conversão** | ${B.objetivo_conversao || '—'} |

---

## PARTE 2 — SERVIÇOS E PRODUTO

### Serviço Principal (foco da campanha)
${B.servico_principal || '—'}

### Lista de Serviços
${B.servicos_lista || '—'}

### Descrição Detalhada
${B.servicos_descricao || '—'}

### Preço
${B.preco_exibir === 'sim' ? `**Exibir preço:** Sim
**Valor:** ${B.preco_valor || '—'}
**Condição especial:** ${B.preco_condicao || '—'}
**Oferta especial:** ${B.oferta_especial || '—'}` : 'Não exibir preço no site.'}

---

## PARTE 3 — PÚBLICO-ALVO

### Público Primário — perfil detalhado
${B.publico_primario || '—'}

### Dor Principal — na voz do cliente
${B.publico_dor || '—'}

### Resultado Desejado — o "depois"
${B.publico_resultado || '—'}

### Público Secundário
${B.publico_secundario || 'Não definido'}

### FAQ — Perguntas Frequentes Reais
${B.faq || 'Não fornecido — IA deve inferir baseado no nicho e nas objeções mais comuns do segmento.'}

---

## PARTE 4 — COPY E PERSUASÃO

### Diferencial Real
${B.diferencial || '—'}

### Frase de Impacto
${B.frase_impacto || '—'}

### História / Origem
${B.historia || 'Não fornecida.'}

### Casos e Resultados Concretos
${B.casos_resultados || 'Não fornecidos.'}

---

## PARTE 5 — TOM DE VOZ

| Parâmetro | Valor |
|---|---|
| **Frase que resume o tom** | ${B.frase_tom || '—'} |
| **Vocabulário que deve aparecer** | ${B.vocabulario_usa || '—'} |
| **Vocabulário proibido** | ${B.vocabulario_nunca || '—'} |
| **Estilo desejado** | ${B.estilo_desejado || '—'} |
| **Sensação do visitante** | ${B.sensacao_visitante || '—'} |
| **Restrições de conteúdo** | ${B.restricoes || '—'} |

---

## PARTE 6 — PRESENÇA DIGITAL E PROVA SOCIAL

### Redes Sociais
| Rede | Handle/Link |
|---|---|
| Instagram | ${B.instagram || '—'} |
| TikTok | ${B.tiktok || '—'} |
| YouTube | ${B.youtube || '—'} |
| Outras | ${B.outras_redes || '—'} |

### Google Business
${B.google_business === 'sim'
        ? `Sim — Nota: **${B.google_nota} ★** com **${B.google_qtd} avaliações**
${parseInt(B.google_qtd) >= 10 && parseFloat(B.google_nota) >= 4.5 ? '✅ Incluir bloco de Google Reviews' : '⚠ Avaliações insuficientes ou nota baixa — NÃO incluir bloco de reviews'}`
        : 'Não possui perfil Google Business.'}

### Depoimentos
${B.depoimentos === 'sim'
        ? `Sim — Formato: ${(B.depoimentos_formato || []).join(', ')} — Quantidade: ${B.depoimentos_qtd || '—'}
✅ Incluir bloco de depoimentos`
        : 'Não há depoimentos disponíveis — NÃO incluir bloco de depoimentos.'}

---

## PARTE 7 — LOCALIZAÇÃO

### Modalidade
${B.modalidade || '—'}

${(B.modalidade === 'presencial' || B.modalidade === 'hibrido') ? `
### Endereço
${B.endereco || '—'}

### Como exibir
${B.exibir_localizacao || '—'}

### Cidades
${B.cidades_atendimento || '—'}
` : ''}

${(B.modalidade === 'online' || B.modalidade === 'hibrido') ? `
### Plataforma Online
${B.plataforma_online || 'Não especificada'}
` : ''}

---

## PARTE 8 — DIREÇÃO DE ARTE

${fichaArte ? `
### Paleta de Cores Aprovada
| Nome | HEX | Uso |
|---|---|---|
${paleta}

### Tipografia Aprovada
- **Display:** ${fichaArte.tipografia?.display?.fonte} ${fichaArte.tipografia?.display?.peso} — ${fichaArte.tipografia?.display?.uso}
- **Corpo:** ${fichaArte.tipografia?.corpo?.fonte} ${fichaArte.tipografia?.corpo?.peso} — ${fichaArte.tipografia?.corpo?.uso}
${fichaArte.tipografia?.mono ? `- **Mono:** ${fichaArte.tipografia?.mono?.fonte} — ${fichaArte.tipografia?.mono?.uso}` : ''}

### Tom Visual
${fichaArte.tom_visual}

### Layout
${fichaArte.layout}

### Animações
${fichaArte.animacoes}

### Mobile First
${fichaArte.mobile_first}

### Footer
${fichaArte.footer}

### Decisões Criativas
${(fichaArte.decisoes || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}
` : `
### Ativos da Marca
- Logo: ${B.arte_logo || '—'}
- Fotos: ${B.arte_fotos || '—'}
- Cor principal: ${B.arte_cor_principal || 'não definida'}
- Cor secundária: ${B.arte_cor_secundaria || 'não definida'}

### Direção Geral
- Tema: ${B.arte_tema || '—'}
- Intensidade visual: ${B.arte_intensidade || '—'}
- Referência de marca: ${B.arte_referencia_marca || '—'}
- Menu mobile: ${B.arte_menu_mobile || '—'}
- O que NÃO quero: ${B.arte_o_que_nao_quero || '—'}
- Footer: ${B.arte_footer_tom || '—'}

### Referências Pessoais
${(B.arte_referencias_pessoais || []).map((r, i) => `
**Ref. ${i + 1}:** ${r.link}
- O que atraiu: ${r.gostei}
- O que adaptar: ${r.adaptar}
`).join('') || 'Não fornecidas.'}

### Referências do Nicho
${(B.arte_referencias_nicho || []).map((r, i) => `
**Ref. ${i + 1}:** ${r.link}
- O que atraiu: ${r.gostei}
- O que adaptar: ${r.adaptar}
`).join('') || 'Não fornecidas.'}

> ⚠ Ficha de direção de arte não foi gerada/aprovada. A IA deve tomar as decisões de design baseada nas informações acima.
`}

---

## PARTE 9 — INTEGRAÇÕES ATIVAS

${integracoesList || '- [x] WhatsApp Flutuante (padrão Adsgator)'}

---

## PARTE 10 — BRIEFING BRUTO DO CLIENTE

> Material original fornecido pelo cliente. Use como fonte primária para enriquecer a copy.

${B.briefing_bruto || 'Não fornecido — use os campos acima como fonte de dados.'}

---

## PARTE 11 — INSTRUÇÕES ADICIONAIS

${B.instrucoes_adicionais || 'Nenhuma instrução adicional.'}

---

## PARTE 12 — REGRAS FIXAS ADSGATOR

${REGRAS_FIXAS_ADSGATOR}

---

## PARTE 13 — PROMPT DE AUDITORIA PÓS-IMPLEMENTAÇÃO

${PROMPT_AUDITORIA}
`;
  },

  downloadDoc1() {
    const doc1 = this.buildDoc1();
    const slug = this.B.slug || 'briefing';
    this.state.lastDoc1 = doc1;
    this.downloadText(doc1, `doc1-${slug}.md`, 'text/markdown');
    this.showToast('DOC-1 baixado!', 'success');
  },

  /* ─────────────────────────────────────────────────────
     GENERATE DOCIMPL
  ───────────────────────────────────────────────────── */
  async generateDocImpl() {
    if (this.state.isGenerating) return;
    this.state.isGenerating = true;
    this.state.lastError = null;

    this.openModal('modal-gen');
    document.getElementById('modal-gen-title').textContent = 'Gerando Ficha de Implementação';
    document.getElementById('gen-model-badge').innerHTML = `
      <i data-lucide="cpu" style="width:14px;height:14px"></i>
      Modelo: ${AI_MODELS[this.state.selectedModel]?.label}
    `;
    lucide.createIcons({ nodes: [document.getElementById('gen-model-badge')] });

    const genSteps = [
      { id: 1, icon: 'file-text', label: 'Compilando DOC-1...' },
      { id: 2, icon: 'code', label: 'Preparando prompt de implementação...' },
      { id: 3, icon: 'zap', label: `Chamando ${AI_MODELS[this.state.selectedModel]?.label}...` },
      { id: 4, icon: 'check-circle', label: 'Processando resposta...' },
      { id: 5, icon: 'eye', label: 'Gerando preview...' },
      { id: 6, icon: 'sparkles', label: 'Concluído!' },
    ];

    const renderSteps = (activeId, successIds = [], errorId = null) => {
      const total = genSteps.length;
      const done = successIds.length;
      const pct = Math.round((done / total) * 100);
      document.getElementById('gen-progress-fill').style.width = pct + '%';
      document.getElementById('gen-progress-pct').textContent = pct + '%';
      document.getElementById('gen-progress-fill').parentElement.parentElement
        .setAttribute('aria-valuenow', pct);

      document.getElementById('gen-steps-list').innerHTML = genSteps.map(s => {
        const isActive = s.id === activeId;
        const isDone = successIds.includes(s.id);
        const isError = s.id === errorId;
        const iconCls = isActive ? 'gen-step-icon spin' :
          isDone ? 'gen-step-icon done' :
            isError ? 'gen-step-icon err' : 'gen-step-icon wait';
        const icon = isActive ? 'loader-2' : isDone ? 'check' : isError ? 'x' : 'circle';
        return `
          <div class="gen-step-item ${isActive ? 'active' : ''}">
            <i data-lucide="${icon}" class="${iconCls}" style="width:16px;height:16px"></i>
            <span class="gen-step-label">${s.label}</span>
          </div>
        `;
      }).join('');
      lucide.createIcons({ nodes: [document.getElementById('gen-steps-list')] });
    };

    const done = [];

    try {
      renderSteps(1);
      const doc1 = this.buildDoc1();
      this.state.lastDoc1 = doc1;
      await new Promise(r => setTimeout(r, 400));
      done.push(1);

      renderSteps(2, done);
      const prompt = this.buildDocImplPrompt(doc1);
      await new Promise(r => setTimeout(r, 300));
      done.push(2);

      renderSteps(3, done);
      const t0 = Date.now();
      const docImpl = await this.callAI(prompt);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      done.push(3);

      renderSteps(4, done);
      if (!docImpl || docImpl.trim().length < 200) {
        throw new Error('response too short — a IA retornou uma resposta muito curta ou vazia.');
      }
      this.state.lastDocImpl = docImpl;
      await new Promise(r => setTimeout(r, 300));
      done.push(4);

      renderSteps(5, done);
      await this.generatePreview(docImpl);
      done.push(5);

      done.push(6);
      renderSteps(null, done);

      // Salva versão
      this.saveVersion(doc1, docImpl, this.state.selectedModel);

      // Download automático
      const slug = this.B.slug || 'projeto';
      this.downloadText(docImpl, `doc-impl-${slug}.md`, 'text/markdown');

      // Notificação Windows
      this.showNotification('LandingAI', `Ficha de Implementação gerada! Projeto: ${this.B.nome_cliente}`);

      // Preview
      setTimeout(() => {
        this.closeModal('modal-gen');
        document.getElementById('preview-project-name').textContent = this.B.nome_cliente;
        document.getElementById('btn-download-docimpl').onclick = () => {
          this.downloadText(this.state.lastDocImpl, `doc-impl-${slug}.md`, 'text/markdown');
        };
        this.openModal('modal-preview');
      }, 800);

    } catch (err) {
      this.state.lastError = err.message;
      this.closeModal('modal-gen');
      this.showGenError(err, done);
      console.error('[LandingAI] generateDocImpl erro:', err);
    } finally {
      this.state.isGenerating = false;
    }
  },

  buildDocImplPrompt(doc1) {
    return `${doc1}

---

## COMANDO DE EXECUÇÃO

Leia o documento acima inteiro.

Gere a **Ficha de Implementação Completa** seguindo EXATAMENTE este formato:

1. Ordem de criação dos arquivos (FASE 1 a N)
2. Código completo de cada arquivo — sem omissões, sem "..." no meio do código
3. Design system completo: tokens Tailwind com HEX reais, escala tipográfica com clamp() reais
4. Copy palavra por palavra em cada seção — não resumir
5. Instruções de instalação e deploy
6. .env.example com todas as variáveis
7. Checklist de ação humana (o que você precisa providenciar antes do go-live)
8. Prompt de auditoria pós-implementação

O documento gerado deve ser auto-suficiente: outra IA deve conseguir construir o projeto completo lendo apenas este documento, sem fazer perguntas.

Formato da resposta: Markdown com blocos de código completos para cada arquivo.
`;
  },

  /* ─────────────────────────────────────────────────────
     PREVIEW
  ───────────────────────────────────────────────────── */
  async generatePreview(docImpl) {
    try {
      const model = AI_MODELS[this.state.selectedModel];
      const apiKey = this.state.apiKeys[model.provider];
      if (!apiKey?.trim()) throw new Error('no key');

      const previewPrompt = `Você recebeu uma Ficha de Implementação de landing page.
Gere um HTML MOCKUP simplificado — apenas Hero + 3 seções principais + Footer.

REGRAS:
- HTML em único arquivo, inline CSS, zero dependências externas
- Use as cores, fontes e copy EXATAS da ficha — não genérico
- Visual fiel ao que será implementado
- Máximo 180 linhas de HTML
- Sem JavaScript
- Mobile-first (viewport 375px)
- Output APENAS o HTML bruto, sem explicações, sem markdown

FICHA (trecho):
${docImpl.substring(0, 6000)}`;

      const html = await this.callAI(previewPrompt);
      const clean = html.replace(/```html|```/g, '').trim();

      const iframe = document.getElementById('preview-iframe');
      if (iframe) {
        const blob = new Blob([clean], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframe.src = url;

        // Botão de download do preview
        document.getElementById('btn-download-preview').onclick = () => {
          this.downloadText(clean, `preview-${this.B.slug || 'landing'}.html`, 'text/html');
        };
      }
    } catch (err) {
      // Preview falhou silenciosamente — DOC-IMPL está disponível normalmente
      const iframe = document.getElementById('preview-iframe');
      if (iframe) {
        iframe.src = 'data:text/html,<p style="font-family:sans-serif;padding:20px;color:#666">Preview não disponível — DOC-IMPL gerado com sucesso.</p>';
      }
    }
  },

  /* ─────────────────────────────────────────────────────
     ERROR MODAL
  ───────────────────────────────────────────────────── */
  showGenError(err, completedSteps = []) {
    const msg = err.message || 'Erro desconhecido';
    const errorInfo = Object.entries(ERROR_MAP).find(([key]) => msg.toLowerCase().includes(key.toLowerCase()));
    const cause = errorInfo?.[1]?.cause || 'Erro inesperado.';
    const tip = errorInfo?.[1]?.tip || 'Tente novamente ou use outro modelo.';

    document.getElementById('error-meta').innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--text-tertiary)">
        <i data-lucide="cpu" style="width:13px;height:13px"></i>
        Modelo: ${AI_MODELS[this.state.selectedModel]?.label}
        <span style="color:var(--border-strong)">·</span>
        Steps concluídos: ${completedSteps.length}/6
      </div>
    `;
    document.getElementById('error-message').textContent = msg;
    document.getElementById('error-cause').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:4px">
        <strong style="font-size:12px;color:var(--text-primary)">Causa provável:</strong>
        <span>${cause}</span>
        <span style="color:var(--accent2)">${tip}</span>
      </div>
    `;

    document.getElementById('btn-retry').onclick = () => {
      this.closeModal('modal-error');
      this.generateDocImpl();
    };
    document.getElementById('btn-change-model').onclick = () => {
      this.closeModal('modal-error');
      document.getElementById('btn-model-selector').click();
    };
    document.getElementById('btn-download-doc1-fallback').onclick = () => {
      this.closeModal('modal-error');
      this.downloadDoc1();
    };

    lucide.createIcons({ nodes: [document.getElementById('modal-error')] });
    this.openModal('modal-error');
  },



  buildStepReview() {
    const B = this.B;
    const score = this.calcGlobalScore();
    const allWarnings = this.getAllWarnings();
    const missingRequired = this.getMissingRequired();
    const scoreClass = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';
    const scoreLabel = score >= 80 ? 'Briefing rico — excelente qualidade esperada' :
      score >= 50 ? 'Briefing adequado — resultado bom' :
        'Briefing incompleto — preencha mais campos';

    const stepCards = STEPS.map(step => {
      const warnings = this.getStepWarnings(step.id);
      const missing = (REQUIRED_FIELDS[step.id] || []).filter(f => !B[f]?.toString().trim());
      const statusIcon = missing.length > 0 ? 'x' :
        warnings.length > 0 ? 'alert-triangle' : 'check';
      const statusColor = missing.length > 0 ? 'var(--danger)' :
        warnings.length > 0 ? 'var(--warning)' : 'var(--accent)';
      const cardClass = missing.length > 0 ? 'has-errors' : warnings.length > 0 ? 'has-warnings' : 'complete';

      return `
        <div class="review-step-card ${cardClass}" onclick="App.goToStep(${step.id})" title="Ir para Step ${step.id}">
          <div class="review-step-card-header">
            <span class="review-step-num">STEP ${step.id}</span>
            <i data-lucide="${statusIcon}" class="review-step-status" style="color:${statusColor}"></i>
          </div>
          <div class="review-step-name">${step.label}</div>
          <div class="review-step-detail">
            ${missing.length > 0 ? `${missing.length} campo(s) obrigatório(s) vazio(s)` :
          warnings.length > 0 ? `${warnings.length} aviso(s)` : 'Completo'}
          </div>
        </div>
      `;
    }).join('');

    const warningItems = allWarnings.length > 0 ? `
      <div>
        <div class="review-section-title">
          <i data-lucide="alert-triangle" style="width:16px;height:16px;color:var(--warning)"></i>
          Avisos (${allWarnings.length})
        </div>
        <div class="review-warnings-list">
          ${allWarnings.map(w => `
            <div class="review-warning-item">
              <i data-lucide="alert-triangle" style="width:13px;height:13px"></i>
              <span><strong>Step ${w.step} — ${w.label}:</strong> ${w.msg}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const missingItems = missingRequired.length > 0 ? `
      <div>
        <div class="review-section-title">
          <i data-lucide="x-circle" style="width:16px;height:16px;color:var(--danger)"></i>
          Campos obrigatórios vazios (${missingRequired.length})
        </div>
        <div class="review-missing-list">
          ${missingRequired.map(m => `
            <div class="review-missing-item">
              <i data-lucide="x" style="width:13px;height:13px"></i>
              <span><strong>Step ${m.step} — ${m.label}:</strong> campo "${m.field}" não preenchido</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const canGenerate = missingRequired.length === 0;
    const hasApiKey = Object.values(this.state.apiKeys).some(k => k?.trim());

    return `
      <div class="review-screen">
        <div class="review-header">
          <div class="review-title">Revisão e Geração</div>
          <div class="review-desc">
            Confira o briefing antes de gerar a Ficha de Implementação.
            Clique em qualquer step para voltar e ajustar.
          </div>
        </div>

        <div class="review-score-banner">
          <div class="review-score-circle">${score}%</div>
          <div class="review-score-info">
            <div class="review-score-label">${scoreLabel}</div>
            <div class="review-score-sub">
              ${missingRequired.length > 0 ? `${missingRequired.length} campo(s) obrigatório(s) pendente(s) ·` : ''}
              ${allWarnings.length} aviso(s) · Modelo: ${AI_MODELS[this.state.selectedModel]?.label}
            </div>
          </div>
          <div class="score-badge ${scoreClass}">${score >= 80 ? 'Rico' : score >= 50 ? 'OK' : 'Raso'}</div>
        </div>

        <div class="review-steps-grid">
          ${stepCards}
        </div>

        ${missingItems}
        ${warningItems}

        <div class="review-actions">
          <div class="review-section-title" style="margin-bottom:0">
            <i data-lucide="zap" style="width:16px;height:16px;color:var(--accent)"></i>
            Gerar agora
          </div>
          <div class="review-actions-row">
            <button class="btn-ghost" onclick="App.downloadDoc1()">
              <i data-lucide="download" style="width:15px;height:15px"></i>
              Baixar DOC-1 (manual)
            </button>
            <button class="btn-primary" onclick="App.generateDocImpl()"
              ${canGenerate && hasApiKey ? '' : 'disabled'}
              title="${!canGenerate ? 'Preencha os campos obrigatórios primeiro' : !hasApiKey ? 'Configure uma API Key primeiro' : 'Gerar Ficha de Implementação'}">
              <i data-lucide="sparkles" style="width:15px;height:15px"></i>
              Gerar Ficha de Implementação
            </button>
          </div>
          ${!hasApiKey ? `
            <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--warning)">
              <i data-lucide="key" style="width:13px;height:13px"></i>
              Nenhuma API Key configurada —
              <button onclick="App.openModal('modal-api')" style="color:var(--accent2);font-size:12px;text-decoration:underline;text-underline-offset:2px">
                configurar agora
              </button>
            </div>
          ` : ''}
          <div class="review-model-note">
            <i data-lucide="cpu" style="width:12px;height:12px"></i>
            Modelo ativo: ${AI_MODELS[this.state.selectedModel]?.label}
            <button onclick="document.getElementById('btn-model-selector').click()" style="color:var(--accent2);font-size:11px;margin-left:4px">trocar</button>
          </div>
        </div>
      </div>
    `;
  },

  buildDoc1() {
    const B = this.B;
    const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const arteAprovada = B.arte_ficha_aprovada ? (() => {
      try { return JSON.parse(B.arte_ficha_aprovada); } catch { return null; }
    })() : null;

    const integracoesList = (B.integracoes || []).map(i => {
      const labels = {
        maps: 'Google Maps Embed (endereço presencial confirmado)',
        reviews: 'Google Reviews Widget (perfil Google Business confirmado)',
        instagram: 'Feed do Instagram (perfil ativo e relevante)',
        formulario: 'Formulário de Contato Web3Forms',
        whatsapp: 'WhatsApp Flutuante (padrão Adsgator)',
        ligacao: 'Botão de Ligação Mobile',
      };
      return `- [x] ${labels[i] || i}`;
    }).join('\n') || '- [x] WhatsApp Flutuante (padrão Adsgator)';

    const waLink = B.whatsapp
      ? `https://wa.me/${B.whatsapp.replace(/\D/g, '')}${B.objetivo_conversao === 'whatsapp' ? '' : ''}`
      : '[INSERIR LINK WA]';

    return `# ${B.nome_cliente || '[Nome do Cliente]'} — DOC-1 Briefing Completo

> **Gerado pelo LandingAI v2 — Adsgator**
> Data: ${dataAtual}
> Modelo: ${AI_MODELS[this.state.selectedModel]?.label}
> Slug: ${B.slug || '[slug]'}

---

## PARTE 1 — INSTRUÇÕES PARA A IA

Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este briefing na íntegra e gerar a **Ficha de Implementação Completa** — pronto para o Roo Code implementar sem perguntas adicionais.

**Você toma todas as decisões** de tipografia, escala, tokens, animações e layout que não estão explicitadas.
**Você preenche todos os campos** com valores concretos. Sem placeholders. Sem "[definir depois]".
**O output deve ser auto-suficiente:** outra IA deve construir o projeto lendo apenas o documento gerado.

---

## PARTE 2 — IDENTIFICAÇÃO DO PROJETO

| Campo | Valor |
|---|---|
| **Cliente / Profissional** | ${B.nome_cliente || '—'} |
| **Nome Comercial / Marca** | ${B.nome_marca || B.nome_cliente || '—'} |
| **Slug** | ${B.slug || '—'} |
| **Segmento** | ${B.segmento || '—'} |
| **Tipo** | ${B.tipo || '—'} |
| **Domínio** | ${B.dominio || '[a confirmar]'} |
| **CNPJ** | ${B.cnpj || '[a confirmar]'} |
| **Aviso Legal** | ${B.aviso_legal || 'não aplicável'} |

---

## PARTE 3 — CONTATO E CONVERSÃO

| Campo | Valor |
|---|---|
| **WhatsApp** | ${B.whatsapp || '—'} |
| **Link WA** | ${waLink} |
| **Email** | ${B.email || '—'} |
| **Horários** | ${B.horarios || '—'} |
| **GTM ID** | ${B.gtm_id || '[a inserir]'} |
| **Objetivo de Conversão** | ${B.objetivo_conversao || '—'} |
| **Objetivo Outro** | ${B.objetivo_outro || 'n/a'} |

---

## PARTE 4 — REDES SOCIAIS E PRESENÇA DIGITAL

| Rede | Handle / URL |
|---|---|
| **Instagram** | ${B.instagram || '—'} |
| **TikTok** | ${B.tiktok || '—'} |
| **YouTube** | ${B.youtube || '—'} |
| **Outras** | ${B.outras_redes || '—'} |

---

## PARTE 5 — MODALIDADE E ATENDIMENTO

| Campo | Valor |
|---|---|
| **Modalidade** | ${B.modalidade || '—'} |
| **Endereço** | ${B.endereco || '—'} |
| **Exibir localização** | ${B.exibir_localizacao || '—'} |
| **Cidades de atendimento** | ${B.cidades_atendimento || '—'} |
| **Plataforma online** | ${B.plataforma_online || '—'} |

---

## PARTE 6 — SERVIÇOS E PREÇO

**Serviço Principal:**
${B.servico_principal || '—'}

**Lista de Serviços:**
${B.servicos_lista || '—'}

**Descrição Detalhada:**
${B.servicos_descricao || '—'}

**Exibir Preço:** ${B.preco_exibir === 'sim' ? 'Sim' : 'Não'}

${B.preco_exibir === 'sim' ? `
**Valor / Forma de cobrança:** ${B.preco_valor || '—'}
**Condição especial:** ${B.preco_condicao || '—'}
**Oferta especial:** ${B.oferta_especial || '—'}
` : ''}

---

## PARTE 7 — PÚBLICO-ALVO E INTENÇÃO DE BUSCA

**Público Primário:**
${B.publico_primario || '—'}

**Principal Dor / Problema antes de contratar:**
${B.publico_dor || '—'}

**O que o cliente quer alcançar:**
${B.publico_resultado || '—'}

**Público Secundário:**
${B.publico_secundario || '—'}

**FAQ do cliente:**
${B.faq || 'Não fornecido — inferir baseado no nicho e nas dores acima.'}

---

## PARTE 8 — DIFERENCIAIS E AUTORIDADE

**O que concretamente diferencia esse profissional:**
${B.diferencial || '—'}

**Frase de impacto:**
${B.frase_impacto || '—'}

**História / Origem:**
${B.historia || 'Não fornecida.'}

**Cases e resultados:**
${B.casos_resultados || 'Não fornecidos.'}

**Depoimentos disponíveis:** ${B.depoimentos === 'sim' ? `Sim — ${B.depoimentos_qtd || '?'} depoimentos em formato: ${(B.depoimentos_formato || []).join(', ') || '?'}` : 'Não'}

**Google Business:** ${B.google_business === 'sim' ? `Sim — ${B.google_nota || '?'} estrelas com ${B.google_qtd || '?'} avaliações` : 'Não'}

---

## PARTE 9 — TOM DE VOZ E IDENTIDADE

**Como o site deve ser percebido:**
${B.estilo_desejado || '—'}

**O que o visitante deve sentir:**
${B.sensacao_visitante || '—'}

**Frase do tom de voz:**
${B.frase_tom || '—'}

**Vocabulário que DEVE aparecer na copy:**
${B.vocabulario_usa || '—'}

**Vocabulário PROIBIDO:**
${B.vocabulario_nunca || '—'}

**Restrições visuais e de conteúdo:**
${B.restricoes || '—'}

---

## PARTE 10 — DIREÇÃO DE ARTE

${arteAprovada ? `
### Ficha de Direção Aprovada ✓

**Paleta de Cores:**
${(arteAprovada.paleta || []).map(p => `- **${p.nome}** — \`${p.hex}\` — ${p.uso}`).join('\n')}

**Tipografia:**
- Display: ${arteAprovada.tipografia?.display?.fonte} ${arteAprovada.tipografia?.display?.peso} — ${arteAprovada.tipografia?.display?.uso}
- Corpo: ${arteAprovada.tipografia?.corpo?.fonte} ${arteAprovada.tipografia?.corpo?.peso} — ${arteAprovada.tipografia?.corpo?.uso}
${arteAprovada.tipografia?.mono ? `- Mono: ${arteAprovada.tipografia.mono.fonte} — ${arteAprovada.tipografia.mono.uso}` : ''}

**Tom Visual:**
${arteAprovada.tom_visual}

**Diretrizes de Animação:**
${arteAprovada.animacoes}

**Layout:**
${arteAprovada.layout}

**Mobile First:**
${arteAprovada.mobile_first}

**Footer:**
${arteAprovada.footer}

**Decisões Criativas:**
${(arteAprovada.decisoes || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}

**Referências Interpretadas:**
${(arteAprovada.referencias_interpretadas || []).map(r => `- [${r.tipo}] ${r.fonte}: ${r.o_que_usar}`).join('\n')}
` : `
**Ativos da Marca:**
- Cor principal: ${B.arte_cor_principal || 'não definida'}
- Cor secundária: ${B.arte_cor_secundaria || 'não definida'}
- Logo: ${B.arte_logo || 'não definida'}
- Fotos: ${B.arte_fotos || 'não definidas'}

**Direção:**
- Tema: ${B.arte_tema || 'não definido'}
- Intensidade: ${B.arte_intensidade || 'não definida'}
- Referência de marca: ${B.arte_referencia_marca || 'não definida'}
- O que NÃO quer: ${B.arte_o_que_nao_quero || 'não especificado'}
- Menu mobile: ${B.arte_menu_mobile || 'não definido'}

### Referências Pessoais
${(B.arte_referencias_pessoais || []).map((r, i) => `
**Ref. ${i + 1}:** ${r.link}
- O que atraiu: ${r.gostei}
- O que adaptar: ${r.adaptar}
`).join('') || 'Não fornecidas.'}

### Referências do Nicho
${(B.arte_referencias_nicho || []).map((r, i) => `
**Ref. ${i + 1}:** ${r.link}
- O que atraiu: ${r.gostei}
- O que adaptar: ${r.adaptar}
`).join('') || 'Não fornecidas.'}

> ⚠ Ficha de direção de arte não foi gerada/aprovada. A IA deve tomar as decisões de design baseada nas informações acima.
`}

---

## PARTE 11 — INTEGRAÇÕES ATIVAS

${integracoesList}

---

## PARTE 12 — BRIEFING BRUTO DO CLIENTE

> Material original fornecido pelo cliente. Use como fonte primária para enriquecer a copy.

${B.briefing_bruto || 'Não fornecido — use os campos acima como fonte de dados.'}

---

## PARTE 13 — INSTRUÇÕES ADICIONAIS

${B.instrucoes_adicionais || 'Nenhuma instrução adicional.'}

---

## PARTE 14 — REGRAS FIXAS ADSGATOR

${REGRAS_FIXAS_ADSGATOR}

---

## PARTE 15 — PROMPT DE AUDITORIA PÓS-IMPLEMENTAÇÃO

${PROMPT_AUDITORIA}
`;
  },

  async callAI(prompt) {
    const model = AI_MODELS[this.state.selectedModel];
    if (!model) throw new Error(`Modelo ${this.state.selectedModel} não encontrado.`);

    const apiKey = this.state.apiKeys[model.provider];
    if (!apiKey?.trim()) throw new Error(`Chave de API para ${model.provider} não configurada.`);

    switch (model.provider) {
      case 'gemini': return this._callGemini(prompt, model, apiKey);
      case 'claude': return this._callClaude(prompt, model, apiKey);
      case 'grok': return this._callOpenAICompat(prompt, model, apiKey);
      case 'mistral': return this._callOpenAICompat(prompt, model, apiKey);
      default: throw new Error(`Provider ${model.provider} não suportado.`);
    }
  },

  async _callGemini(prompt, model, apiKey) {
    const response = await fetch(`${model.endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: model.maxTokens,
          temperature: model.temp,
          topP: 0.95,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Resposta vazia do Gemini.');
    return text;
  },

  async _callClaude(prompt, model, apiKey) {
    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: this.state.selectedModel,
        max_tokens: model.maxTokens,
        temperature: model.temp,
        system: 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error('Resposta vazia do Claude.');
    return text;
  },

  async _callOpenAICompat(prompt, model, apiKey) {
    // Funciona para Grok (xAI) e Mistral — ambos usam a interface OpenAI
    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.state.selectedModel,
        max_tokens: model.maxTokens,
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
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error(`Resposta vazia de ${model.label}.`);
    return text;
  },

  calcGlobalScore() {
    const B = this.B;
    let filled = 0;
    let total = 0;

    const weights = {
      nome_cliente: 3, segmento: 3, tipo: 2, whatsapp: 3,
      objetivo_conversao: 3, servico_principal: 4, servicos_descricao: 5,
      publico_primario: 5, publico_dor: 5, publico_resultado: 4,
      diferencial: 5, frase_impacto: 3, estilo_desejado: 3,
      sensacao_visitante: 3, depoimentos: 2, google_business: 2,
      faq: 2, historia: 1, casos_resultados: 2, vocabulario_usa: 2,
      vocabulario_nunca: 2, modalidade: 2, email: 1, horarios: 1,
    };

    for (const [field, weight] of Object.entries(weights)) {
      total += weight;
      if (B[field]?.toString().trim()) filled += weight;
    }

    return total > 0 ? Math.round((filled / total) * 100) : 0;
  },

  getStepWarnings(stepId) {
    const B = this.B;
    const warnings = [];

    Object.entries(FIELD_WARNINGS).forEach(([field, cfg]) => {
      const step = STEPS.find(s => s.fields?.includes(field));
      if (!step || step.id !== stepId) return;
      const val = B[field]?.toString().trim() || '';
      if (val.length > 0 && val.length < cfg.min) {
        warnings.push({ field, msg: cfg.msg });
      }
    });

    return warnings;
  },

  getAllWarnings() {
    const warnings = [];
    STEPS.forEach(step => {
      const ws = this.getStepWarnings(step.id);
      ws.forEach(w => warnings.push({ ...w, step: step.id, label: step.label }));
    });
    return warnings;
  },

  getMissingRequired() {
    const B = this.B;
    const missing = [];
    STEPS.forEach(step => {
      const req = REQUIRED_FIELDS[step.id] || [];
      req.forEach(field => {
        if (!B[field]?.toString().trim()) {
          missing.push({ step: step.id, label: step.label, field });
        }
      });
    });
    return missing;
  },

  updateTopbarScore() {
    const score = this.calcGlobalScore();
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = score + '%';
    const pct = document.getElementById('project-score-pct');
    if (pct) pct.textContent = score + '%';
    const bar = document.getElementById('project-score-fill');
    if (bar) bar.style.width = score + '%';
  },

  fieldLabel(field, label, required = false, optional = false) {
    const tooltip = FIELD_TOOLTIPS[field];
    const req = required ? `<span class="field-required">*</span>` : '';
    const opt = optional ? `<span class="field-optional">opcional</span>` : '';
    const tip = tooltip ? `
      <span class="field-tooltip">
        <i data-lucide="info" class="field-tooltip-icon"></i>
        <span class="field-tooltip-bubble">${tooltip}</span>
      </span>` : '';

    return `
      <label class="field-label">
        ${label} ${req} ${opt} ${tip}
      </label>
    `;
  },

  goToScreen(screen) {
    this.state.screen = screen;
    this.renderScreen();
    this.renderStepsNav();
    this.renderBottombar();
    this.updateTopbar();
    const content = document.getElementById('screen-content');
    if (content) content.scrollTop = 0;
  },

  goToStep(n) {
    if (n < 1 || n > STEPS.length) return;
    this.state.screen = 'step';
    this.state.currentStep = n;
    // Marcar como visitado
    if (this.P && !this.P.visitedSteps.includes(n)) {
      this.P.visitedSteps.push(n);
    }
    this.renderScreen();
    this.renderStepsNav();
    this.renderBottombar();
    this.updateTopbar();
    const content = document.getElementById('screen-content');
    if (content) content.scrollTop = 0;
  },

  goNext() {
    const { screen, currentStep } = this.state;
    if (screen === 'intake') {
      this.goToStep(1);
    } else if (screen === 'step') {
      if (currentStep < STEPS.length) {
        this.goToStep(currentStep + 1);
      } else {
        this.goToScreen('art');
      }
    } else if (screen === 'art') {
      this.goToScreen('review');
    }
  },

  goPrev() {
    const { screen, currentStep } = this.state;
    if (screen === 'review') {
      this.goToScreen('art');
    } else if (screen === 'art') {
      this.goToStep(STEPS.length);
    } else if (screen === 'step') {
      if (currentStep > 1) {
        this.goToStep(currentStep - 1);
      } else {
        this.goToScreen('intake');
      }
    }
  },

  renderScreen() {
    const content = document.getElementById('screen-content');
    if (!content) return;

    let html = '';
    switch (this.state.screen) {
      case 'intake':
        html = this.buildIntakeHTML();
        break;
      case 'step':
        html = this.buildStepHTML(this.state.currentStep);
        break;
      case 'art':
        html = this.buildArtHTML();
        break;
      case 'review':
        html = `<div class="step-inner">${this.buildStepReview()}</div>`;
        break;
      default:
        html = this.buildIntakeHTML();
    }

    content.innerHTML = html;

    // Re-aplicar estados salvos de chips e sel-cards
    this.restoreFieldStates();

    // Registrar eventos dos campos
    this.bindFieldEvents(content);

    // Render ícones Lucide
    lucide.createIcons({ nodes: [content] });
  },

  buildStepHTML(stepId) {
    const step = STEPS[stepId - 1];
    if (!step) return '';

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

    const content = builders[stepId] ? builders[stepId]() : '';
    return `<div class="step-inner animate-in">${content}</div>`;
  },

  buildIntakeHTML() {
    const B = this.B;
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    return `
      <div class="intake-screen animate-in">
        <div class="intake-hero">
          <div class="intake-badge">
            <i data-lucide="sparkles" style="width:12px;height:12px"></i>
            LandingAI v2 — Adsgator
          </div>
          <div class="intake-title">Cole o briefing.<br>A IA preenche tudo.</div>

        </div>

        <div class="intake-box">
          <div class="intake-box-header">
            <i data-lucide="file-text" class="intake-box-icon" style="width:18px;height:18px"></i>
            <span class="intake-box-title">Material do Cliente</span>
            <span class="intake-box-desc">Briefing bruto, formulário preenchido, conversa, etc.</span>
          </div>
          <div class="intake-box-body">
            <div class="field-group">
              <textarea class="field-textarea xtall" id="intake-text" data-field="briefing_bruto"
                placeholder="Cole aqui qualquer material do cliente:

• Respostas de formulário de briefing
• Transcrição de conversa ou reunião
• E-mail do cliente descrevendo o negócio
• Print de conversa no WhatsApp
• Qualquer texto com informações sobre o cliente

Quanto mais material, mais preciso o preenchimento automático.">${B.briefing_bruto || ''}</textarea>
            </div>

            <div class="intake-or">ou anexe arquivos</div>

            <div class="upload-zone" id="intake-upload-zone"
              onclick="document.getElementById('intake-file-input').click()"
              ondragover="event.preventDefault();this.classList.add('drag-over')"
              ondragleave="this.classList.remove('drag-over')"
              ondrop="App.handleIntakeFileDrop(event)">
              <input type="file" id="intake-file-input" accept=".pdf,.doc,.docx,.txt,.md"
                multiple onchange="App.handleIntakeFileSelect(event)">
              <i data-lucide="upload" class="upload-zone-icon"></i>
              <div class="upload-zone-label">PDF, Word ou TXT</div>
              <div class="upload-zone-hint">Arraste ou clique para selecionar</div>
            </div>

            <div class="upload-preview-list" id="intake-files-list"></div>

            <div class="intake-actions">
              <div style="font-size:12px;color:var(--text-tertiary)">
                ${hasKey ? '✓ API configurada' : '⚠ Sem API key — preencha manualmente'}
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn-ghost btn-sm" onclick="App.goToStep(1)">
                  Preencher manualmente
                </button>
                <button class="btn-primary btn-sm" onclick="App.runIntakeAnalysis()" ${hasKey ? '' : 'disabled'}>
                  <i data-lucide="sparkles" style="width:14px;height:14px"></i>
                  Analisar e preencher
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="intake-sop-hint">
          <i data-lucide="info" class="intake-sop-hint-icon" style="width:16px;height:16px"></i>
          <div class="intake-sop-hint-text">
            <strong>Sem API key?</strong> Clique em "Preencher manualmente" e percorra os steps.
            O DOC-1 pode ser baixado sem API e usado em qualquer IA externamente.
          </div>
        </div>
      </div>
    `;
  },

  buildArtHTML() {
    const B = this.B;
    const artApproved = !!B.arte_ficha_aprovada;

    const addRef = (field, label) => `
      <div style="margin-bottom:8px">
        <button class="btn-ghost btn-sm" onclick="App.addArtRef('${field}')">
          <i data-lucide="plus" style="width:14px;height:14px"></i>
          Adicionar ${label}
        </button>
      </div>
      <div id="art-refs-${field}">
        ${(B[field] || []).map((r, i) => `
          <div class="art-ref-item" style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;margin-bottom:8px;align-items:start">
            <input type="text" class="field-input" placeholder="URL ou nome" value="${r.link || ''}"
              onchange="App.updateArtRef('${field}', ${i}, 'link', this.value)">
            <input type="text" class="field-input" placeholder="O que me atraiu" value="${r.gostei || ''}"
              onchange="App.updateArtRef('${field}', ${i}, 'gostei', this.value)">
            <input type="text" class="field-input" placeholder="O que adaptar" value="${r.adaptar || ''}"
              onchange="App.updateArtRef('${field}', ${i}, 'adaptar', this.value)">
            <button class="btn-danger-ghost" style="padding:10px" onclick="App.removeArtRef('${field}', ${i})">
              <i data-lucide="trash-2" style="width:13px;height:13px"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;

    return `
      <div class="art-screen animate-in">
        <div class="art-screen-header">
          <div class="art-screen-title">Direção de Arte</div>
          <div class="art-screen-desc">
            Cole referências visuais e os ativos da marca.
            A IA analisa e entrega uma ficha estruturada — paleta, tipografia, tom visual e decisões.
            Você aprova ou revisa.
          </div>
        </div>

        ${artApproved ? `
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--accent-dim);border:1px solid var(--accent-border);border-radius:var(--r-md)">
            <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--accent)"></i>
            <span style="font-size:13px;color:var(--accent);font-weight:600">Direção de arte aprovada</span>
            <button class="btn-ghost btn-sm" style="margin-left:auto" onclick="App.clearArtFicha()">Refazer</button>
          </div>
        ` : ''}

        <div class="art-section">
          <div class="art-section-header">
            <i data-lucide="image" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <span style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-primary)">Ativos da Marca</span>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:16px">
            <div class="form-row">
              <div class="field-group">
                ${this.fieldLabel('arte_cor_principal', 'Cor principal da marca', false, true)}
                <div class="color-picker-wrap">
                  <div class="color-picker-swatch">
                    <input type="color" value="${B.arte_cor_principal || '#000000'}"
                      onchange="App.setField('arte_cor_principal', this.value)">
                  </div>
                  <input type="text" class="field-input color-picker-input" data-field="arte_cor_principal"
                    placeholder="Ex: #1A4731 ou 'sem identidade definida'"
                    value="${B.arte_cor_principal || ''}">
                </div>
              </div>
              <div class="field-group">
                ${this.fieldLabel('arte_cor_secundaria', 'Cor secundária / acento', false, true)}
                <div class="color-picker-wrap">
                  <div class="color-picker-swatch">
                    <input type="color" value="${B.arte_cor_secundaria || '#FFFFFF'}"
                      onchange="App.setField('arte_cor_secundaria', this.value)">
                  </div>
                  <input type="text" class="field-input color-picker-input" data-field="arte_cor_secundaria"
                    placeholder="Ex: #C9A84C ou 'não existe'"
                    value="${B.arte_cor_secundaria || ''}">
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="field-group">
                ${this.fieldLabel('arte_logo', 'Logo disponível', false, true)}
                <input type="text" class="field-input" data-field="arte_logo"
                  placeholder="SVG / PNG / Não tem"
                  value="${B.arte_logo || ''}">
              </div>
              <div class="field-group">
                ${this.fieldLabel('arte_fotos', 'Fotos disponíveis', false, true)}
                <input type="text" class="field-input" data-field="arte_fotos"
                  placeholder="Sim — alta qualidade / Sim — qualidade média / Não"
                  value="${B.arte_fotos || ''}">
              </div>
            </div>
          </div>
        </div>

        <div class="art-section">
          <div class="art-section-header">
            <i data-lucide="compass" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <span style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-primary)">Direção Criativa</span>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:16px">
            <div class="form-row">
              <div class="field-group">
                ${this.fieldLabel('arte_tema', 'Tema')}
                <div class="chip-group">
                  ${['Claro', 'Escuro', 'IA decide'].map(t => `
                    <button class="chip ${B.arte_tema === t ? 'on' : ''}" data-field="arte_tema" data-chip="${t}">${t}</button>
                  `).join('')}
                </div>
              </div>
              <div class="field-group">
                ${this.fieldLabel('arte_intensidade', 'Intensidade visual')}
                <div class="chip-group">
                  ${['Contido', 'Médio', 'Alto — efeito uau'].map(t => `
                    <button class="chip ${B.arte_intensidade === t ? 'on' : ''}" data-field="arte_intensidade" data-chip="${t}">${t}</button>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_referencia_marca', 'Referência de marca', false, true)}
              <input type="text" class="field-input" data-field="arte_referencia_marca"
                placeholder="Ex: Próximo da Notion / Editorial como Dezeen / Direto como Stripe"
                value="${B.arte_referencia_marca || ''}">
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_menu_mobile', 'Menu mobile', false, true)}
              <div class="chip-group">
                ${['Fullscreen overlay', 'Drawer lateral', 'Bottom sheet', 'IA decide'].map(t => `
                  <button class="chip ${B.arte_menu_mobile === t ? 'on' : ''}" data-field="arte_menu_mobile" data-chip="${t}">${t}</button>
                `).join('')}
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_o_que_nao_quero', 'O que NÃO quero de forma alguma')}
              <textarea class="field-textarea" data-field="arte_o_que_nao_quero"
                placeholder="Ex: Sem rosa. Nada que pareça infoproduto. Sem gradiente roxo. Sem fontes cursivas.">${B.arte_o_que_nao_quero || ''}</textarea>
            </div>
          </div>
        </div>

        <div class="art-section">
          <div class="art-section-header">
            <i data-lucide="link" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <span style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-primary)">Referências Visuais Pessoais</span>
          </div>
          <div style="padding:20px">
            ${addRef('arte_referencias_pessoais', 'referência pessoal')}
          </div>
        </div>

        <div class="art-section">
          <div class="art-section-header">
            <i data-lucide="search" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <span style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-primary)">Referências do Nicho</span>
          </div>
          <div style="padding:20px">
            ${addRef('arte_referencias_nicho', 'referência do nicho')}
          </div>
        </div>

        <div style="display:flex;justify-content:center;padding:8px 0">
          <button class="btn-primary" id="btn-analyze-art" onclick="App.runArtAnalysis()">
            <i data-lucide="sparkles" style="width:16px;height:16px"></i>
            Analisar e gerar ficha de direção
          </button>
        </div>
      </div>
    `;
  },

  renderStepsNav() {
    const nav = document.getElementById('steps-nav');
    if (!nav) return;

    const { screen, currentStep } = this.state;

    const items = STEPS.map(step => {
      const isActive = screen === 'step' && currentStep === step.id;
      const isVisited = this.P?.visitedSteps?.includes(step.id);
      const warnings = this.getStepWarnings(step.id);
      const missing = (REQUIRED_FIELDS[step.id] || []).filter(f => !this.B[f]?.toString().trim());
      const isComplete = isVisited && missing.length === 0;
      const hasError = isVisited && missing.length > 0;
      const hasWarn = isVisited && warnings.length > 0 && missing.length === 0;

      const cls = [
        'step-nav-item',
        isActive ? 'active' : '',
        isComplete && !isActive ? 'done' : '',
        hasError ? 'has-error' : '',
      ].filter(Boolean).join(' ');

      const dotContent = isComplete
        ? `<i data-lucide="check" style="width:10px;height:10px;color:var(--accent)"></i>`
        : hasError
          ? `<i data-lucide="x" style="width:10px;height:10px;color:var(--danger)"></i>`
          : `<span class="step-dot-inner">${step.id}</span>`;

      return `
        <button class="${cls}" onclick="App.goToStep(${step.id})">
          <div class="step-dot">${dotContent}</div>
          <span class="step-label">${step.label}</span>
          ${hasWarn ? `<i data-lucide="alert-triangle" style="width:11px;height:11px;color:var(--warning);margin-left:auto"></i>` : ''}
        </button>
      `;
    }).join('');

    const artCls = `step-nav-item step-art ${screen === 'art' ? 'active' : ''}`;
    const reviewCls = `step-nav-item step-review ${screen === 'review' ? 'active' : ''}`;

    nav.innerHTML = `
      <div class="steps-nav">
        ${items}
        <button class="${artCls}" onclick="App.goToScreen('art')">
          <div class="step-dot step-dot--art">
            <i data-lucide="palette" style="width:10px;height:10px"></i>
          </div>
          <span class="step-label">Direção de Arte</span>
          ${this.state.artAnalyzed ? `<i data-lucide="check" style="width:11px;height:11px;color:var(--accent);margin-left:auto"></i>` : ''}
        </button>
        <button class="${reviewCls}" onclick="App.goToScreen('review')">
          <div class="step-dot step-dot--review">
            <i data-lucide="zap" style="width:10px;height:10px"></i>
          </div>
          <span class="step-label">Revisão e Geração</span>
        </button>
      </div>
    `;

    lucide.createIcons({ nodes: [nav] });
  },

  updateSidebar() {
    // Nome do projeto
    const nameEl = document.getElementById('project-name');
    if (nameEl) nameEl.textContent = this.P?.name || 'Novo Projeto';

    const segEl = document.getElementById('project-segment');
    if (segEl) segEl.textContent = this.B.segmento || '—';

    // Score
    const score = this.calcGlobalScore();
    const fill = document.getElementById('project-score-fill');
    const pct = document.getElementById('project-score-pct');
    if (fill) fill.style.width = score + '%';
    if (pct) pct.textContent = score + '%';

    // API status
    const providers = ['gemini', 'claude', 'grok', 'mistral'];
    const configuredCount = providers.filter(p => this.state.apiKeys[p]?.trim()).length;
    const dot = document.getElementById('sidebar-api-dot');
    const label = document.getElementById('sidebar-api-label');
    if (dot && label) {
      if (configuredCount === 0) {
        dot.className = 'status-dot';
        label.textContent = 'Sem API';
      } else if (configuredCount === providers.length) {
        dot.className = 'status-dot ok';
        label.textContent = 'API OK';
      } else {
        dot.className = 'status-dot partial';
        label.textContent = `${configuredCount}/${providers.length} APIs`;
      }
    }
  },

  updateTopbar() {
    const { screen, currentStep } = this.state;
    const titles = {
      intake: 'Intake — Material do Cliente',
      art: 'Direção de Arte',
      review: 'Revisão Final e Geração',
    };

    const subs = {
      intake: 'Cole o briefing bruto — a IA analisa e preenche os steps',
      art: 'Referências visuais e ativos da marca',
      review: 'Confira o briefing e gere a Ficha de Implementação',
    };

    let title = titles[screen] || '';
    let sub = subs[screen] || '';

    if (screen === 'step') {
      const step = STEPS[currentStep - 1];
      title = step ? `Step ${currentStep} — ${step.label}` : '';
      sub = `${currentStep} de ${STEPS.length}`;
    }

    const titleEl = document.getElementById('topbar-title');
    const subEl = document.getElementById('topbar-subtitle');
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = sub;

    // Progress
    let pct = 0;
    if (screen === 'step') pct = Math.round((currentStep / (STEPS.length + 2)) * 100);
    if (screen === 'art') pct = Math.round(((STEPS.length + 1) / (STEPS.length + 2)) * 100);
    if (screen === 'review') pct = 100;

    const bar = document.getElementById('topbar-progress-fill');
    if (bar) bar.style.width = pct + '%';
  },

  bindFieldEvents(container) {
    // Inputs e textareas
    container.querySelectorAll('[data-field]').forEach(el => {
      const field = el.dataset.field;
      if (!field) return;

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.addEventListener('input', () => {
          this.setField(field, el.value);
          this.updateTopbarScore();
        });
      }
    });

    // Chips
    container.querySelectorAll('.chip[data-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const field = chip.dataset.field;
        const value = chip.dataset.chip;
        const isMulti = chip.dataset.multi === 'true';

        if (isMulti) {
          this.toggleArray(field, value);
          chip.classList.toggle('on');
        } else {
          // Single select — desmarcar outros do grupo
          container.querySelectorAll(`.chip[data-field="${field}"]`).forEach(c => c.classList.remove('on'));
          this.setField(field, value);
          chip.classList.add('on');
        }

        this.updateTopbarScore();
      });
    });

    // Sel-cards
    container.querySelectorAll('.sel-card[data-selcard]').forEach(card => {
      card.addEventListener('click', () => {
        const field = card.dataset.field;
        const value = card.dataset.selcard;
        container.querySelectorAll(`.sel-card[data-field="${field}"]`).forEach(c => c.classList.remove('on'));
        card.classList.add('on');
        this.setField(field, value);

        // Alguns campos precisam re-render (condicional)
        if (['objetivo_conversao', 'modalidade', 'preco_exibir', 'depoimentos', 'google_business'].includes(field)) {
          setTimeout(() => { this.renderScreen(); }, 50);
        }
      });
    });
  },

  restoreFieldStates() {
    const B = this.B;
    const content = document.getElementById('screen-content');
    if (!content) return;

    // Restaurar chips de arrays
    const arrayFields = ['integracoes', 'depoimentos_formato'];
    arrayFields.forEach(field => {
      const values = B[field] || [];
      content.querySelectorAll(`.chip[data-field="${field}"]`).forEach(chip => {
        if (values.includes(chip.dataset.chip)) chip.classList.add('on');
      });
    });

    // Restaurar chips de valor único
    content.querySelectorAll('.chip[data-chip]:not([data-multi])').forEach(chip => {
      const field = chip.dataset.field;
      if (!field || !B[field]) return;
      if (B[field] === chip.dataset.chip) chip.classList.add('on');
    });

    // Restaurar sel-cards
    content.querySelectorAll('.sel-card[data-selcard]').forEach(card => {
      const field = card.dataset.field;
      if (!field || !B[field]) return;
      if (B[field] === card.dataset.selcard) card.classList.add('on');
    });
  },

  toggleArray(field, value) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    const idx = arr.indexOf(value);
    if (idx === -1) arr.push(value);
    else arr.splice(idx, 1);
    this.P.briefing[field] = arr;
    this.autosave();
  },

  addArtRef(field) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    arr.push({ link: '', gostei: '', adaptar: '' });
    this.P.briefing[field] = arr;
    this.autosave();
    this.renderScreen();
  },

  updateArtRef(field, index, key, value) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    if (arr[index]) arr[index][key] = value;
    this.P.briefing[field] = arr;
    this.autosave();
  },

  removeArtRef(field, index) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    arr.splice(index, 1);
    this.P.briefing[field] = arr;
    this.autosave();
    this.renderScreen();
  },

  clearArtFicha() {
    if (!this.P) return;
    this.P.briefing.arte_ficha_aprovada = '';
    this.state.artAnalyzed = false;
    this.autosave();
    this.renderScreen();
  },

  handleIntakeFileSelect(event) {
    const files = Array.from(event.target.files);
    this.state.intakeFiles = [...(this.state.intakeFiles || []), ...files];
    this.renderIntakeFilesList();
  },

  handleIntakeFileDrop(event) {
    event.preventDefault();
    const zone = document.getElementById('intake-upload-zone');
    if (zone) zone.classList.remove('drag-over');
    const files = Array.from(event.dataTransfer.files);
    this.state.intakeFiles = [...(this.state.intakeFiles || []), ...files];
    this.renderIntakeFilesList();
  },

  renderIntakeFilesList() {
    const list = document.getElementById('intake-files-list');
    if (!list) return;
    list.innerHTML = (this.state.intakeFiles || []).map((f, i) => `
      <div class="upload-preview-item">
        <i data-lucide="file" style="width:14px;height:14px"></i>
        <span>${f.name}</span>
        <button onclick="App.removeIntakeFile(${i})">
          <i data-lucide="x" style="width:12px;height:12px"></i>
        </button>
      </div>
    `).join('');
    lucide.createIcons({ nodes: [list] });
    const zone = document.getElementById('intake-upload-zone');
    if (zone && this.state.intakeFiles?.length > 0) zone.classList.add('has-file');
  },

  removeIntakeFile(index) {
    this.state.intakeFiles.splice(index, 1);
    this.renderIntakeFilesList();
  },

  openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    // Só restaurar scroll se não houver mais modais abertos
    const anyOpen = document.querySelector('.modal-overlay.open');
    if (!anyOpen) document.body.style.overflow = '';
  },

  showToast(msg, type = 'default', duration = 3500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast ${type} visible`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), duration);
  },

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => {
        this.state.notifPermission = p;
      });
    }
  },

  showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: 'assets/icon.png' });
      } catch (e) { /* silencioso em contextos restritos */ }
    }
  },

  downloadText(content, filename, mime = 'text/plain') {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  renderApiModal() {
    const body = document.getElementById('api-modal-body');
    if (!body) return;

    const providers = [
      { key: 'gemini', name: 'Google Gemini', link: 'https://aistudio.google.com/app/apikey', models: ['gemini-2.5-pro', 'gemini-2.5-flash'] },
      { key: 'claude', name: 'Anthropic Claude', link: 'https://console.anthropic.com', models: ['claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001'] },
      { key: 'grok', name: 'xAI Grok', link: 'https://console.x.ai', models: ['grok-3'] },
      { key: 'mistral', name: 'Mistral AI', link: 'https://console.mistral.ai', models: ['mistral-large-latest'] },
    ];

    body.innerHTML = providers.map(p => {
      const hasKey = !!this.state.apiKeys[p.key]?.trim();
      return `
        <div class="api-provider-card">
          <div class="api-provider-header">
            <div class="api-provider-name">
              ${p.name}
              <span class="api-key-status ${hasKey ? 'ok' : 'empty'}">
                <i data-lucide="${hasKey ? 'check' : 'minus'}" style="width:11px;height:11px"></i>
                ${hasKey ? 'Configurada' : 'Não configurada'}
              </span>
            </div>
            <a href="${p.link}" target="_blank" class="api-provider-link">Obter chave →</a>
          </div>
          <div class="api-key-row">
            <input type="password" class="field-input" id="key-${p.key}"
              placeholder="Cole sua API Key aqui"
              value="${this.state.apiKeys[p.key] || ''}">
            <button class="btn-ghost btn-sm" onclick="App.toggleKeyVisibility('key-${p.key}')">
              <i data-lucide="eye" style="width:14px;height:14px"></i>
            </button>
            <button class="btn-primary btn-sm" onclick="App.saveApiKey('${p.key}', document.getElementById('key-${p.key}').value)">
              Salvar
            </button>
          </div>
          <div style="font-size:11px;color:var(--text-tertiary)">
            Modelos: ${p.models.join(', ')}
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ nodes: [body] });
  },

  saveApiKey(provider, value) {
    this.state.apiKeys[provider] = value.trim();
    this.saveStorage();
    this.updateSidebar();
    this.renderApiModal();
    this.showToast(`Chave ${provider} salva!`, 'success');
  },

  toggleKeyVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  renderModelDropdown() {
    const wrap = document.getElementById('model-dropdown');
    if (!wrap) return;

    const groups = {};
    Object.entries(AI_MODELS).forEach(([key, model]) => {
      if (!groups[model.group]) groups[model.group] = [];
      groups[model.group].push({ key, ...model });
    });

    wrap.innerHTML = Object.entries(groups).map(([group, models]) => `
      <div class="model-group-label">${group}</div>
      ${models.map(m => `
        <button class="model-option ${this.state.selectedModel === m.key ? 'active' : ''}"
          onclick="App.selectModel('${m.key}')">
          <span class="model-option-name">${m.label}</span>
          <span class="model-tier model-tier--${m.tier}">${m.tier === 'free' ? 'Grátis' : 'Pago'}</span>
        </button>
      `).join('')}
      <div class="model-divider"></div>
    `).join('');
  },

  selectModel(key) {
    this.state.selectedModel = key;
    this.saveStorage();
    // Atualizar label do botão
    const btn = document.getElementById('btn-model-label');
    if (btn) btn.textContent = AI_MODELS[key]?.label || key;
    // Fechar dropdown
    const dd = document.getElementById('model-dropdown');
    if (dd) dd.style.display = 'none';
    this.showToast(`Modelo: ${AI_MODELS[key]?.label}`, 'success');
  },

  renderProjectsList() {
    const list = document.getElementById('projects-list');
    if (!list) return;

    const projects = Object.values(this.state.projects).sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    if (projects.length === 0) {
      list.innerHTML = `<p style="font-size:13px;color:var(--text-tertiary);text-align:center;padding:20px">Nenhum projeto ainda</p>`;
      return;
    }

    list.innerHTML = projects.map(p => {
      const date = new Date(p.updatedAt).toLocaleDateString('pt-BR');
      const isActive = p.id === this.state.activeId;
      return `
        <div class="project-list-item ${isActive ? 'active-project' : ''}"
          onclick="App.loadProject('${p.id}')">
          <div class="project-list-info">
            <div class="project-list-name">${p.name || 'Sem nome'}</div>
            <div class="project-list-meta">${p.briefing?.segmento || '—'} · ${date}</div>
          </div>
          <div class="project-list-actions" onclick="event.stopPropagation()">
            <button class="project-list-action" onclick="App.cloneProject('${p.id}')" title="Duplicar">
              <i data-lucide="copy" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-action danger" onclick="App.deleteProject('${p.id}')" title="Excluir">
              <i data-lucide="trash-2" style="width:13px;height:13px"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ nodes: [list] });
  },

  setupGlobalEvents() {
    // ESC fecha modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
          this.closeModal(m.id);
        });
      }
    });

    // Click fora do modal fecha
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.closeModal(overlay.id);
      });
    });

    // Model dropdown toggle
    const btnModel = document.getElementById('btn-model-selector');
    const dropdown = document.getElementById('model-dropdown');
    if (btnModel && dropdown) {
      btnModel.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) this.renderModelDropdown();
      });
      document.addEventListener('click', () => {
        if (dropdown) dropdown.style.display = 'none';
      });
      dropdown.addEventListener('click', e => e.stopPropagation());
    }

    // Botão de projetos
    const btnProjects = document.getElementById('btn-open-projects');
    if (btnProjects) {
      btnProjects.addEventListener('click', () => {
        this.renderProjectsList();
        this.openModal('modal-projects');
      });
    }

    // Botão de configurar API
    const btnApi = document.getElementById('btn-open-api');
    if (btnApi) {
      btnApi.addEventListener('click', () => {
        this.renderApiModal();
        this.openModal('modal-api');
      });
    }

    // Novo projeto no modal
    const btnNew = document.getElementById('btn-new-project');
    if (btnNew) btnNew.addEventListener('click', () => this.createProject());

    // Importar projeto
    const btnImport = document.getElementById('btn-import-project');
    const importInput = document.getElementById('import-file-input');
    if (btnImport && importInput) {
      btnImport.addEventListener('click', () => importInput.click());
      importInput.addEventListener('change', e => {
        if (e.target.files[0]) this.importProject(e.target.files[0]);
      });
    }

    // Intake text — salvar no briefing
    document.addEventListener('input', e => {
      const field = e.target.dataset?.field;
      if (field && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        this.setField(field, e.target.value);
      }
    });
  },
};

// Start app
document.addEventListener('DOMContentLoaded', () => App.init());
