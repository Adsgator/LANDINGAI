const REGRAS_FIXAS_ADSGATOR = `
> A PARTE 11 contém as Regras Fixas da Adsgator. Você não precisa alterar ou pensar sobre elas.
> Utilize estas regras integralmente ao gerar o Doc 3. Não resuma e não invente regras novas.
> Estas regras são aplicadas em 100% dos projetos.

### Stack Técnica

NÚCLEO IMUTÁVEL
───────────────
Astro          → Framework base. Saída estática por padrão. Zero JS desnecessário.
                 astro.config.mjs: output: 'static', site: 'https://[dominio].com.br'
                 @astrojs/sitemap instalado e configurado.
                 Exclui do sitemap: /links, /politica-de-privacidade, /termos-de-uso, /404

Tailwind CSS   → Toda estilização. Tokens em tailwind.config.js.
                 Sem style="" onde Tailwind resolve.
                 Sem HEX hardcoded no código — sempre via token.

Node.js        → Ambiente de build.

Lenis          → Smooth scroll global.
                 npm install @studio-freight/lenis
                 Inicializado em <script is:inline> no Layout.astro.
                 duration: 1.2 | easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                 Integrado ao GSAP: lenis.on('scroll', ScrollTrigger.update)
                 gsap.ticker.add((time) => { lenis.raf(time * 1000) })
                 gsap.ticker.lagSmoothing(0)

ANALYTICS E MONITORAMENTO
──────────────────────────
Vercel Analytics   → npm install @vercel/analytics
                     Import em Layout.astro: import { Analytics } from '@vercel/analytics/astro'
                     Inserir <Analytics /> no Layout.astro após o conteúdo.
                     Coleta pageviews e eventos automaticamente sem configuração extra.

Vercel Speed Insights → npm install @vercel/speed-insights
                     Import em Layout.astro: import { SpeedInsights } from '@vercel/speed-insights/astro'
                     Inserir <SpeedInsights /> no Layout.astro.
                     Monitora Web Vitals reais (LCP, CLS, FID) em produção.

EXTENSÕES (apenas onde necessário)
───────────────────────────────────
React          → Somente para componentes com estado dinâmico real:
                 MobileMenu.tsx, InstagramFeed.tsx (se ativo), ContactForm.tsx, CookieBanner.tsx
                 Sempre com client:visible ou client:idle (nunca client:load sem justificativa)

GSAP + ScrollTrigger → Animações de scroll e timelines.
                 Direto em <script> dentro dos .astro — nunca via import em bundle React.
                 gsap.registerPlugin(ScrollTrigger) obrigatório antes de qualquer uso.

Framer Motion  → Dentro de islands React.
                 Menu mobile fullscreen (AnimatePresence), hover em cards, CTA spring.

Web3Forms        → Backend do formulário de contato (se formulário ativo).
                 npm install web3forms
                 Variável: FORMS_ACCESS_KEY no .env

DEPLOY E INFRAESTRUTURA
────────────────────────
Target: Vercel — output: 'static' em astro.config.mjs
Alternativa aceita: Netlify — mesma configuração

GIT — OBRIGATÓRIO ANTES DE QUALQUER CÓDIGO
────────────────────────────────────────────
git init                           → inicializar repositório no primeiro passo do projeto
.gitignore padrão Astro:           → node_modules/, dist/, .env
Commit inicial:                    → "init: projeto Astro base" antes de qualquer código
Repositório remoto:                → conectar ao GitHub ou GitLab antes do primeiro deploy
CI/CD:                             → Vercel conecta ao repositório para deploy automático a cada push
Convenção de branches:
  main   → produção (deploy automático na Vercel)
  dev    → desenvolvimento local

ARQUIVOS OBRIGATÓRIOS
──────────────────────
public/robots.txt    → Permite: / | Proíbe: /links | Sitemap: https://[dominio]/sitemap-index.xml
public/manifest.json → name, short_name, start_url "/", display "standalone",
                       background_color e theme_color via tokens do projeto
.env.example         → entregar com o projeto — todas as variáveis documentadas, sem valores reais
                       Variáveis padrão:
                         GTM_ID=GTM-XXXXXXX
                         WHATSAPP_NUMBER=
                         FORMS_ACCESS_KEY= (se formulário ativo)
                         INSTAGRAM_TOKEN= (se feed ativo)
                         GOOGLE_MAPS_API_KEY= (se mapa avançado ativo)

### Componentes Globais (criar isolados, sem repetição)

Componentes Astro obrigatórios:
  Layout.astro          → Shell global. Contém: <head> com SEO, GTM snippet (is:inline),
                          Consent Mode v2, Lenis init, GSAP, Vercel Analytics, Speed Insights,
                          componente de menu, botão WhatsApp flutuante, rodapé.
  Button.astro          → Props: label, href, variant (primary | secondary | ghost), tracking-id.
                          Nunca escrever botão inline nas seções.
  SectionHeader.astro   → Props: label (pequeno texto acima), title, subtitle.
                          Usado em todas as seções que têm título + subtítulo.
  FeatureCard.astro     → Props: icon, title, description. Usado em Diferenciais e Como Funciona.
  TestimonialCard.astro → Props: name, role, text, avatar (opcional). Prova social.
  ReviewCard.astro      → Props: name, rating, text, date. Avaliações Google.

Componentes React (islands):
  MobileMenu.tsx        → Fullscreen overlay com Framer Motion AnimatePresence.
                          Props: links[], ctaLabel, ctaHref.
  InstagramFeed.tsx     → Grid de posts. Props: username, token (env var).
                          Sempre com ErrorBoundary — se API falhar, exibe placeholder neutro.
  ContactForm.tsx       → Multi-step se aplicável. Props: whatsappFallback.
                          ErrorBoundary: se falhar, exibe link direto para WhatsApp.
  CookieBanner.tsx      → Banner LGPD + Google Consent Mode v2.
                          Props: gtmId. client:idle. Estado via localStorage.

### Padrão de Assets

Localização: src/assets/images/[nome-do-arquivo].webp
Convenção:
  hero-principal.webp       → foto principal do profissional ou serviço
  profissional-retrato.webp → foto para seção de diferenciais
  servico-[numero].webp     → fotos de serviços específicos
  depoimento-[nome].webp    → avatares de depoimentos
  og-image.webp             → 1200x630px — compartilhamento social
  favicon.svg               → SVG nativo, nunca PNG
  avatar-links.webp         → 192x192px — foto para /links

Componente de imagem: sempre <Image /> nativo do Astro
  loading="eager"           → apenas hero-principal.webp
  loading="lazy"            → todo o resto
  width e height            → sempre definidos (evita layout shift)
  format="webp"             → explícito

Placeholders (quando asset não disponível):
  Fundo: token bg-surface
  Label descritivo: ex: "[Foto do profissional — 800x1000px]"
  Nunca cor sólida genérica sem label

### Design de Viewport — Regra Adsgator

Filosofia:
  O site não fica preso em um container central. Usar o viewport completo é uma decisão
  de design, não um descuido. Containers são ferramentas de legibilidade — não prisões.

Aplicação por tipo de bloco:
  Hero:            full-bleed. Fundo vai de borda a borda. Texto e imagem no container interno.
  Seções de fundo alternado: full-bleed com cor/textura própria — cria ritmo visual sem depender
                   só de espaçamento entre seções.
  Seções de texto: container centralizado (max-w-prose ou max-w-2xl) para legibilidade.
  Seções de grid:  container mais largo (max-w-7xl) com padding lateral.
  CTA Final:       full-bleed com cor de destaque — contraste máximo com o restante da página.
  Footer:          full-bleed — nunca container estreito no footer.
  Imagens heroicas: podem sangrar para fora do grid em desktop — quebrar o ritmo é intencional.

Ritmo visual entre seções:
  Alternar backgrounds (claro → levemente diferente → claro) cria profundidade sem divisórias.
  Mínimo 3 variações de fundo ao longo da página: background, surface, e um tom de destaque.
  Espaçamento vertical generoso: py-24 como mínimo em mobile, py-32 a py-40 em desktop.

### Performance e SEO Técnico

Preload de assets críticos (no <head> via Layout.astro):
  <link rel="preconnect"> para domínio da fonte
  <link rel="preload"> do woff2 da fonte principal com crossorigin="anonymous"
  <link rel="preload"> da hero-principal.webp com fetchpriority="high" as="image"
  Impacto direto no LCP — esses três itens sozinhos movem 0.5s–1.5s.

Font loading — evitar FOIT:
  font-display: swap obrigatório em toda @font-face.
  Fontsource já inclui swap por padrão — confirmar que não está sendo sobrescrito.
  Fallback stack explícito no tailwind.config.js:
    fontFamily: { sans: ['NomeDaFonte', 'ui-sans-serif', 'system-ui', 'sans-serif'] }

Canonical URL:
  <link rel="canonical" href="https://[domínio]/[path]" />
  Cada página recebe seu canonical absoluto via prop canonicalUrl no Layout.

### Sistema de Rastreamento

Google Tag Manager:
  Snippet head: dentro do <head>, imediatamente após <meta charset>
  Snippet body: imediatamente após abertura do <body>
  Diretiva Astro: <script is:inline> — obrigatório. Nunca processar com bundler.
  Componente: GTM.astro → recebe ID via prop. Usado dentro do Layout.astro.

Conversões Google Ads — padrão Adsgator:
  contato_wpp   → cliques em links WhatsApp
  view_content  → pageview da landing page principal
  view_links    → pageview da /links

Data attributes obrigatórios em todos os CTAs:
  id="btn-[local]"
  data-tracking="[ação]-[destino]"
  data-section="[nome-da-seção]"

### UX Obrigatório

Header Inteligente:
  Sticky top-0 z-50
  Esconde ao scrollar para baixo (GSAP translateY -100%, 0.3s ease-in-out)
  Reaparece ao scrollar para cima
  Fundo opaco ou backdrop-blur após 80px de scroll (transition 0.2s)
  Sempre contém logo + CTA principal rastreado
  Logo: link para #top, SVG nativo

Menu Mobile — Padrão Alto Padrão Adsgator:
  Acionado por botão hambúrguer com morphing animado (3 linhas → X, Framer Motion)
  Fullscreen overlay com AnimatePresence
  Fundo: cor da marca com opacidade alta ou dark overlay
  Links: stagger 0.05s de delay, slide de baixo para cima
  Tipografia: grande, impactante — não uma lista discreta
  Elemento de destaque: número de telefone OU CTA em destaque no fundo do overlay
  Fechar: clique fora, Escape ou botão X
  Scroll do body bloqueado enquanto aberto (overflow-hidden no html)

Botão WhatsApp flutuante:
  Oculto no carregamento
  Aparece após o Hero sair do viewport (IntersectionObserver)
  Desaparece quando o footer entra no viewport
  fixed bottom-6 right-6 (mobile) / bottom-8 right-8 (desktop)
  Mínimo 56x56px, touch target 64x64px
  Entrada: scale 0→1 + opacity 0→1, 0.3s ease-out
  SVG nativo do WhatsApp (cor #25D366), sem biblioteca externa
  data-tracking="click-whatsapp" data-section="floating-button"

Smooth Scroll (Lenis):
  Inicializar no Layout.astro via <script is:inline>
  duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  Integrado ao GSAP: lenis.on('scroll', ScrollTrigger.update)
  requestAnimationFrame loop padrão do Lenis

Mobile First — Padrão Absoluto:
  Design começa em 375px — não adapta para mobile, começa no mobile
  Base para mobile, sobrescrever com sm: md: lg: xl:
  Breakpoint principal para 2 colunas: xl: (1280px)
  Texto nunca menor que 16px no mobile
  Touch targets mínimo 44x44px
  Padding lateral mobile mínimo px-5
  Tap highlight removido: -webkit-tap-highlight-color: transparent
  Hero: 100svh em mobile (usa svh, não vh — evita barra de endereço cortando)
  Nenhuma seção com overflow horizontal — testar sempre em 375px

Rodapé — Padrão de Excelência Adsgator:
  O footer é a última impressão do site — tratado com o mesmo cuidado do Hero.

  Estrutura obrigatória:
    Logo da marca — mesma proporção do header, com respiro vertical
    Tagline curta ou frase de encerramento — opcional mas poderosa quando usada
    Links essenciais: Política de Privacidade + Termos de Uso (se houver) + redes sociais confirmadas
    CNPJ do cliente (se fornecido no briefing)
    Copyright: © {new Date().getFullYear()} [Nome do Cliente]. Todos os direitos reservados.
    Logo da Adsgator: SVG com currentColor, discreto, com link para adsgator.com.br
      Texto: "Desenvolvido por Adsgator" ou apenas o logo — IA decide com base no espaço

  Design:
    Não use o mesmo fundo da última seção — crie separação visual clara
    Opções de fundo: cor primária escurecida / off-black / tom de destaque da paleta
    Tipografia: hierarquia visual real — não uma lista plana de links
    Espaçamento interno generoso: py-16 no mínimo
    Links com hover sutil — opacity ou cor, não sublinhado óbvio
    Ícones de redes sociais: tamanho mínimo 20px, monocromáticos, com aria-label

  Mobile:
    Coluna única, texto centralizado ou alinhado à esquerda (IA decide com base no tom)
    Logo acima, links abaixo, Adsgator no final
    Nenhum elemento cortado ou comprimido

Card CTA Final (bloco antes do footer):
  Posicionado imediatamente antes do footer, sempre
  Maior contraste visual da página
  Headline diferente do Hero — segundo ângulo de persuasão
  Botão com id="btn-cta-final" e data-tracking rastreado

### Banner de Consentimento (LGPD + Google Consent Mode v2)

Componente: CookieBanner.tsx (island React, client:idle)
Posição: fixed bottom-0 left-0 right-0, z-[9999]
Aparece: apenas se não houver consentimento no localStorage
  Chave: 'adsgator-consent' | Valor: 'granted' | 'denied'

Comportamento:
  Não bloqueia conteúdo — página carrega normalmente
  Banner aparece após idle (client:idle) — não compete com LCP
  Dois botões: "Aceitar" (primary) e "Recusar" (ghost)
  Clicar em qualquer um fecha e registra a escolha

Design:
  Barra horizontal discreta — não modal, não fullscreen
  Fundo: token bg-surface com backdrop-blur leve
  Borda superior sutil: border-t border-border
  Texto pequeno (text-sm), direto — sem juridiquês
  Link para /politica-de-privacidade (target _blank)
  Entrada: slide de baixo para cima, opacity 0→1, 0.3s ease-out (Framer Motion)
  Saída: slide para baixo + opacity 0, 0.25s ease-in (AnimatePresence)

Google Consent Mode v2 — integração com GTM:
  Antes do snippet do GTM (via <script is:inline>):
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'wait_for_update': 500
  })
  Ao aceitar: gtag('consent', 'update', { todos: 'granted' })
  Ao recusar: manter 'denied' — não disparar update

### Sistema de Animação — Padrão Adsgator

Filosofia:
  Animação tem função: revelar, guiar, confirmar. Nunca decorativa.
  prefers-reduced-motion: todas as animações GSAP encapsuladas em
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {}

Tokens GSAP:
  Duração padrão entrada:   0.7s
  Duração rápida (micro):   0.3s
  Duração lenta (hero):     1.0s–1.4s
  Easing entrada:           power2.out
  Easing saída:             power2.in

Triggers de entrada:
  Hero:             timeline imediata (sem ScrollTrigger)
                    stagger: H1 → subtítulo → CTA → imagem
                    opacity: 0→1, y: 30→0, duração 1.0s, stagger 0.15s
  Seções internas:  ScrollTrigger start="top 80%"
                    opacity: 0→1, y: 40→0, duração 0.7s
  Cards em grid:    ScrollTrigger + stagger 0.1s por card
  CTA Final:        ScrollTrigger start="top 75%"
                    scale: 0.96→1 + opacity: 0→1, duração 0.8s, power3.out

Tokens Framer Motion (islands React):
  Hambúrguer → X:   rotate + scale, 0.3s, spring stiffness 300 damping 20
  Menu overlay:     opacity 0→1, 0.25s ease-out
  Links do menu:    stagger 0.05s, y: 20→0 + opacity: 0→1
  Hover em cards:   y: -4px, scale: 1.01, 0.2s ease-out
  Hover em botões:  scale: 1.03, 0.15s spring

### Acessibilidade Mínima Obrigatória

Filosofia: acessibilidade é critério de Quality Score no Google Ads.
Páginas com baixa acessibilidade têm CPC mais alto.

Contraste: WCAG AA mínimo — ratio 4.5:1 para texto normal, 3:1 para texto grande
Imagens: alt descritivo e específico. alt="" só em imagens puramente decorativas.
Botões icon-only: aria-label obrigatório (WhatsApp flutuante, hambúrguer, fechar)
Links externos: rel="noopener noreferrer"
Focus: focus-visible em todos os elementos interativos — nunca outline:none sem substituto
  Classes Tailwind: focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
Menu mobile: focus trap enquanto aberto. Escape fecha.
Semântica: <h1> única por página (no Hero). Hierarquia h1→h2→h3 — nunca pular nível.
  <main>, <header>, <footer>, <nav>, <section> com roles corretos.
Formulários: <label> associado via htmlFor/id. Mensagens de erro acessíveis via aria-describedby.

### Comportamento Responsivo por Tipo de Seção

Hero:
  mobile:   coluna única, texto em cima, imagem embaixo ou background full-bleed
  desktop:  2 colunas — texto (55%) | imagem (45%)

Diferenciais / Features:
  mobile:   1 coluna, cards empilhados
  tablet:   2 colunas
  desktop:  3 ou 4 colunas

Como Funciona:
  mobile:   vertical, numerado, com linha conectora
  desktop:  horizontal com seta entre etapas, ou alternado esquerda/direita

Prova Social:
  mobile:   slider/carousel 1 item (Framer Motion drag)
  desktop:  grid 2 ou 3 colunas

Avaliações Google:
  mobile:   horizontal scroll (overflow-x-auto, snap-mandatory)
  desktop:  grid 3 colunas

Feed Instagram:
  mobile:   grid 2x3
  desktop:  grid 3x2

FAQ:
  accordion, sempre 1 coluna, max-w-2xl centralizado

Mapa:
  mobile:   embed full width, 300px de altura
  desktop:  60% width + info de endereço ao lado, 400px

CTA Final:
  mobile:   coluna única, headline grande, botão full width
  desktop:  centralizado, max-w-3xl, botão não full width

### Integrações Técnicas

Google Maps:
  Embed API (iframe) — sem chave para embed básico
  Parâmetros: q=[endereço URL-encoded]&output=embed&z=16&language=pt-BR
  Sempre incluir bloco de endereço textual ao lado ou abaixo

Google Reviews:
  Places API (chave fornecida pelo gestor) ou widget Elfsight
  Exibir: foto, nome, nota em estrelas (SVG), texto, data relativa
  Máximo: 6 desktop, 3 mobile. Nota geral + total de avaliações acima dos cards.

Instagram Feed:
  Island React (client:visible) — não bloqueia carregamento
  Token: INSTAGRAM_TOKEN no .env — nunca hardcoded
  ErrorBoundary: se falhar, exibe "Ver no Instagram →" linkado ao perfil

Formulário de Contato:
  Simples: Astro nativo com Resend
  Multi-step: island React com Framer Motion AnimatePresence
  Honeypot: campo oculto via CSS (position absolute left -9999px)
  Submit: feedback inline — sem redirecionamento externo
  ErrorBoundary: fallback para WhatsApp se submit falhar

Links WhatsApp — formato canônico:
  https://wa.me/[DDI+DDD+NÚMERO]?text=[MENSAGEM_URL_ENCODED]
  Nunca api.whatsapp.com/send — sempre wa.me

### Schema.org — Dados Estruturados

Obrigatório em 100% dos projetos.
Tipo base: LocalBusiness (ou subtipo específico do nicho).

Subtipos por nicho:
  Dentista: Dentist | Nutricionista: Nutritionist | Fisioterapeuta: MedicalBusiness
  Advogado: LegalService | Psicólogo: MedicalBusiness | Salão/Estética: HealthAndBeautyBusiness
  Outros: LocalBusiness como fallback

Campos obrigatórios (JSON-LD no <head> via Layout.astro):
  @context, @type, name, description, url, telephone, image, openingHours, sameAs
  address e geo: apenas se atendimento presencial confirmado com endereço autorizado
  aggregateRating: apenas se avaliações reais confirmadas no briefing — nunca inventar
  priceRange: se valor fornecido no briefing

Nunca inventar dados. Se o campo não foi fornecido, omiti-lo.
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
    if (this.state.currentStep === 9) {
      this.renderStep9();
      return;
    }
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
    }
    
    // Add Score calculation
    this.calculateScore();
    
    html += '</div>';
    sc.innerHTML = html;
    lucide.createIcons();
  },

  calculateScore() {
    let filled = 0;
    let total = 0;
    const b = this.briefing;
    
    for (const step in criticalFields) {
      criticalFields[step].forEach(f => {
        total++;
        if (b[f] && String(b[f]).trim() !== '') filled++;
      });
    }
    
    this.state.score = total > 0 ? Math.round((filled / total) * 100) : 0;
  },

  renderStep9() {
    const sc = document.getElementById('step-content');
    this.calculateScore();
    
    let scoreClass = 'low';
    if (this.state.score > 80) scoreClass = 'high';
    else if (this.state.score > 50) scoreClass = 'medium';
    
    const missing = [];
    for (const step in criticalFields) {
      criticalFields[step].forEach(f => {
        if (!this.briefing[f] || String(this.briefing[f]).trim() === '') {
          missing.push({ step, field: f });
        }
      });
    }

    let cardsHtml = '';
    for(let i=1; i<=8; i++) {
      let stepTotal = 0;
      let stepFilled = 0;
      if (criticalFields[i]) {
        criticalFields[i].forEach(f => {
          stepTotal++;
          if (this.briefing[f] && String(this.briefing[f]).trim() !== '') stepFilled++;
        });
      } else {
        stepTotal = 1;
        stepFilled = 1; // if no critical fields, consider it 100%
      }
      const pct = Math.round((stepFilled/stepTotal)*100);
      
      cardsHtml += `
        <div class="dashboard-card">
          <div class="dashboard-card-title">${i}. ${STEP_TITLES[i]}</div>
          <div class="dashboard-card-score" style="color: var(--${pct===100?'success':pct>50?'warning':'danger'})">
            <i data-lucide="${pct===100?'check':'circle'}" class="icon" style="width:12px;height:12px;display:inline-block"></i> ${pct}% completo
          </div>
          <button class="btn btn-ghost" style="margin-top:8px; padding:6px 12px; font-size:11px;" onclick="App.goToStep(${i})">Editar</button>
        </div>
      `;
    }

    let missingHtml = '';
    if (missing.length > 0) {
      missingHtml = `
        <div class="val-card mt-32">
          <h4><i data-lucide="alert-triangle" class="icon"></i> Campos Críticos Faltando</h4>
          <ul>
            ${missing.map(m => `<li>${m.field} (Step ${m.step})</li>`).join('')}
          </ul>
        </div>
      `;
    }

    sc.innerHTML = `
      <div class="content-inner">
        <div style="background:var(--bg-raised); border:1px solid var(--border-default); padding:24px; border-radius:var(--r-md); margin-bottom:32px;">
          <h3 class="syne" style="margin-bottom:12px;">REVISÃO GERAL</h3>
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="flex:1; height:8px; background:var(--bg-surface); border-radius:4px; overflow:hidden;">
              <div style="width:${this.state.score}%; height:100%; background:var(--${scoreClass=== 'high' ? 'success' : scoreClass === 'medium' ? 'warning' : 'danger'}); transition:width 0.3s"></div>
            </div>
            <div class="score-badge ${scoreClass}">${this.state.score}% — ${scoreClass === 'high' ? 'Pronto para gerar' : 'Incompleto'}</div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          ${cardsHtml}
        </div>
        
        ${missingHtml}
        
        <div style="margin-top: 40px; padding: 24px; background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--r-md);">
          <h3 class="syne" style="margin-bottom: 16px;">Ações Finais</h3>
          <div style="display: flex; gap: 16px;">
            <button class="btn btn-ghost" onclick="App.downloadDoc1()"><i data-lucide="download" class="icon"></i> Baixar DOC-1</button>
            <button class="btn btn-primary" onclick="App.generateDocImpl()" ${this.state.score < 60 ? 'disabled' : ''}><i data-lucide="zap" class="icon"></i> Gerar DOC-IMPL via IA</button>
          </div>
        </div>
      </div>
    `;
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

  buildMasterPrompt(doc1) {
    return `Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

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
Abaixo está o Brainstorm Visual (DOC-1) para gerar a Ficha de Implementação:

${doc1}
`;
  },

  updateGenProgress(data) {
    const genLogs = document.getElementById('gen-status-list');
    if (!genLogs) return;
    
    // Calcula a porcentagem
    const pct = Math.round((data.step / 6) * 100);
    document.getElementById('gen-progress-bar').style.width = pct + '%';
    document.getElementById('gen-pct').innerText = pct + '%';
    
    let html = '';
    for (let i = 1; i <= 6; i++) {
      if (i < data.step) {
        html += `<div class="gen-status-item done"><i data-lucide="check-circle" class="icon icon--success"></i> Passo ${i} concluído</div>`;
      } else if (i === data.step) {
        html += `<div class="gen-status-item active"><i data-lucide="${data.icon}" class="icon ${data.spinning ? 'icon--spin' : ''}"></i> ${data.label}</div>`;
      } else {
        html += `<div class="gen-status-item"><i data-lucide="circle" class="icon icon--muted"></i> Aguardando...</div>`;
      }
    }
    genLogs.innerHTML = html;
    lucide.createIcons();
  },

  async generateDocImpl() {
    if (!this.state.apiKeys.gemini && !this.state.apiKeys.claude && !this.state.apiKeys.grok && !this.state.apiKeys.mistral) {
      this.showToast('Configure uma API Key primeiro', 'error');
      this.openModal('modal-api');
      return;
    }
    
    this.calculateScore();
    if (this.state.score < 60) {
      this.showToast('Score insuficiente para gerar DOC-IMPL. Preencha mais campos.', 'warning');
      return;
    }

    this.state.isGenerating = true;
    this.openModal('modal-gen');
    const statusBox = document.getElementById('modal-gen');
    const modelInfo = AI_MODELS[this.state.selectedModel];
    
    statusBox.innerHTML = `
      <div class="modal">
        <div class="modal-body">
          <h3 class="syne" style="margin-bottom:12px"><i data-lucide="zap" class="icon icon--accent"></i> Gerando Ficha de Implementação</h3>
          <p style="color:var(--text-secondary); margin-bottom:24px; font-size:14px;">Modelo: ${modelInfo.name}</p>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:12px;">
            <span>Progresso</span>
            <span id="gen-pct">0%</span>
          </div>
          <div class="gen-progress">
            <div class="gen-progress-inner" id="gen-progress-bar"></div>
          </div>
          
          <div class="gen-status-list" id="gen-status-list"></div>
        </div>
      </div>
    `;
    lucide.createIcons();

    try {
      this.updateGenProgress({ icon: 'loader-2', label: 'Compilando DOC-1...', step: 1, spinning: true });
      const doc1 = this.buildDoc1();
      await new Promise(r => setTimeout(r, 400));
      
      this.updateGenProgress({ icon: 'brain', label: 'Preparando prompt mestre...', step: 2, spinning: true });
      const prompt = this.buildMasterPrompt(doc1);
      await new Promise(r => setTimeout(r, 300));
      
      const apiKey = this.state.apiKeys[modelInfo.provider];
      if (!apiKey) throw new Error(`Chave de API ausente para ${modelInfo.provider}`);
      
      this.updateGenProgress({ icon: 'zap', label: `Chamando ${modelInfo.name}...`, step: 3, spinning: true });
      
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

      this.updateGenProgress({ icon: 'file-text', label: 'Processando resposta...', step: 4, spinning: true });
      if (!docImpl || docImpl.trim().length < 100) {
        throw new Error('A IA retornou uma resposta muito curta ou vazia.');
      }
      
      this.updateGenProgress({ icon: 'eye', label: 'Gerando preview...', step: 5, spinning: true });
      await this.generatePreview(docImpl);

      this.updateGenProgress({ icon: 'check-circle', label: 'Concluído!', step: 6, spinning: false });
      this.saveVersion(doc1, docImpl);
      
      this.showNotification('LandingAI', 'DOC-IMPL gerado com sucesso!');
      this.downloadFile(docImpl, `doc-impl-${this.briefing.slug||'projeto'}.md`);
      setTimeout(() => this.closeModal('modal-gen'), 3000);

    } catch (err) {
      this.showGenError(err, modelInfo);
    } finally {
      this.state.isGenerating = false;
    }
  },

  async generatePreview(docImpl) {
    const previewPrompt = `Você recebeu uma Ficha de Implementação de landing page.
Gere um HTML MOCKUP simplificado — não o código final, apenas um preview visual rápido.
REGRAS:
- HTML em único arquivo, inline CSS, zero dependências externas
- Representa apenas Hero + 3 seções principais + Footer
- Use as cores, fontes e copy EXATAS do documento
- Visual FIEL ao que será implementado (não genérico)
- Máximo 200 linhas de HTML
- Não inclua JavaScript
- Mobile-first (viewport 375px base)
- Output APENAS o HTML, sem marcação markdown no inicio ou fim
FICHA:
${docImpl.substring(0, 8000)}`;

    try {
      const modelInfo = AI_MODELS[this.state.selectedModel];
      const apiKey = this.state.apiKeys[modelInfo.provider];
      
      let html = '';
      if (modelInfo.provider === 'gemini') {
        const resp = await fetch(`${modelInfo.endpoint}?key=${apiKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: previewPrompt }] }] })
        });
        const data = await resp.json();
        html = data.candidates[0].content.parts[0].text;
      }
      
      html = html.replace(/```html/g, '').replace(/```/g, '');
      
      if (html) {
        const modal = document.getElementById('modal-preview');
        modal.innerHTML = `
          <div class="modal">
            <div class="modal-header">
              <h3 class="syne">👁 Preview — ${this.briefing.nome_cliente || 'Projeto'}</h3>
              <button class="btn btn-ghost" style="padding:4px" onclick="App.closeModal('modal-preview')"><i data-lucide="x" class="icon"></i></button>
            </div>
            <div class="modal-body" style="padding:0">
              <iframe style="width:100%; height:600px; border:none;"></iframe>
            </div>
          </div>
        `;
        const iframe = modal.querySelector('iframe');
        const blob = new Blob([html], { type: 'text/html' });
        iframe.src = URL.createObjectURL(blob);
        document.getElementById('modal-preview').classList.remove('hidden');
        lucide.createIcons();
      }
    } catch (e) {
      this.showToast('Preview não gerado — DOC-IMPL disponível normalmente', 'warning');
    }
  },

  showGenError(err, modelInfo) {
    const modal = document.getElementById('modal-error');
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="syne" style="color:var(--danger)">✗ Erro na Geração</h3>
          <button class="btn btn-ghost" style="padding:4px" onclick="App.closeModal('modal-error'); App.closeModal('modal-gen')"><i data-lucide="x" class="icon"></i></button>
        </div>
        <div class="modal-body">
          <p style="color:var(--text-secondary); margin-bottom:12px;">Modelo: ${modelInfo?.name}</p>
          <div style="background:var(--bg-raised); border:1px solid var(--border-default); padding:16px; border-radius:var(--r-md); margin-bottom:24px; font-family:var(--font-mono); font-size:12px; color:var(--danger);">
            ${err.message || err}
          </div>
          <p style="color:var(--text-secondary); font-size:14px; margin-bottom:8px;">Possíveis causas:</p>
          <ul style="font-size:14px; color:var(--text-primary); margin-left:20px; margin-bottom:24px;">
            <li>Chave de API inválida ou expirada</li>
            <li>Limite de uso da API atingido (Quota Exceeded)</li>
            <li>Conexão com a internet interrompida</li>
          </ul>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <button class="btn btn-primary" onclick="App.generateDocImpl()"><i data-lucide="refresh-cw" class="icon"></i> Tentar Novamente</button>
            <button class="btn btn-ghost" onclick="App.openModal('modal-api')"><i data-lucide="settings" class="icon"></i> Trocar Modelo</button>
            <button class="btn btn-ghost" onclick="App.downloadDoc1()"><i data-lucide="download" class="icon"></i> Baixar DOC-1 Manualmente</button>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
    this.openModal('modal-error');
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
          <button class="btn btn-ghost" style="padding: 6px" title="Abrir" onclick="App.loadProject('${p.id}')"><i data-lucide="folder-open" class="icon"></i></button>
          <button class="btn btn-ghost" style="padding: 6px" title="Clonar" onclick="App.cloneProject('${p.id}')"><i data-lucide="copy" class="icon"></i></button>
          <button class="btn btn-ghost" style="padding: 6px" title="Exportar" onclick="App.exportProject('${p.id}')"><i data-lucide="download" class="icon"></i></button>
          <button class="btn btn-danger" style="padding: 6px" title="Excluir" onclick="App.deleteProject('${p.id}')"><i data-lucide="trash" class="icon"></i></button>
        </div>
      </div>
    `).join('');

    m.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="syne">Meus Projetos</h3>
          <div style="display: flex; gap: 8px;">
            <label class="btn btn-ghost" style="padding: 6px 12px; font-size: 12px; cursor: pointer;">
              <i data-lucide="upload" class="icon"></i> Importar
              <input type="file" accept=".json" style="display:none" onchange="App.importProject(event)">
            </label>
            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="App.createProject(); App.closeModal('modal-projects')">+ Novo</button>
            <button class="btn btn-ghost" style="padding:4px" onclick="App.closeModal('modal-projects')"><i data-lucide="x" class="icon"></i></button>
          </div>
        </div>
        <div class="modal-body">
          ${list || '<p style="color:var(--text-secondary)">Nenhum projeto salvo.</p>'}
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  cloneProject(id) {
    const p = this.state.projects[id];
    if (!p) return;
    const newId = crypto.randomUUID();
    this.state.projects[newId] = JSON.parse(JSON.stringify(p));
    this.state.projects[newId].id = newId;
    this.state.projects[newId].name = p.name + ' (cópia)';
    this.state.projects[newId].createdAt = new Date().toISOString();
    this.state.projects[newId].updatedAt = new Date().toISOString();
    localStorage.setItem('landingai_projects', JSON.stringify(this.state.projects));
    this.renderProjectsModal();
    this.showToast('Projeto clonado', 'success');
  },

  exportProject(id) {
    const p = this.state.projects[id];
    if (!p) return;
    const dataStr = JSON.stringify(p, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projeto-${p.slug || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Projeto exportado', 'success');
  },

  importProject(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const p = JSON.parse(e.target.result);
        if (!p.id || !p.briefing) throw new Error('Formato inválido');
        const newId = crypto.randomUUID();
        p.id = newId;
        p.name = p.name + ' (importado)';
        this.state.projects[newId] = p;
        localStorage.setItem('landingai_projects', JSON.stringify(this.state.projects));
        this.renderProjectsModal();
        this.showToast('Projeto importado', 'success');
      } catch (err) {
        this.showToast('Erro ao importar JSON', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },

  saveVersion(doc1, docImpl) {
    const p = this.state.projects[this.state.activeProjectId];
    if (!p) return;
    if (!p.versions) p.versions = [];
    p.versions.push({
      date: new Date().toISOString(),
      doc1,
      docImpl,
      model: AI_MODELS[this.state.selectedModel]?.name || 'unknown'
    });
    localStorage.setItem('landingai_projects', JSON.stringify(this.state.projects));
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
