/* ============================================================
   LandingAI v2 — Configurações e Constantes
   ============================================================ */

window.App = {};

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
  { id: 1, label: 'Identificação', sub: 'Nome, nicho e tipo de projeto', icon: 'user', fields: ['nome_cliente', 'nome_marca', 'segmento', 'tipo', 'dominio', 'cnpj', 'aviso_legal'] },
  { id: 2, label: 'Contato e CTA', sub: 'WhatsApp, e-mail e conversão', icon: 'phone', fields: ['whatsapp', 'email', 'horarios', 'gtm_id', 'objetivo_conversao', 'objetivo_outro'] },
  { id: 3, label: 'Presença Digital', sub: 'Redes sociais e plataformas', icon: 'globe', fields: ['instagram', 'tiktok', 'youtube', 'outras_redes', 'integracoes'] },
  { id: 4, label: 'Atendimento', sub: 'Modalidade, endereço, cidades', icon: 'map-pin', fields: ['modalidade', 'endereco', 'exibir_localizacao', 'cidades_atendimento', 'plataforma_online'] },
  { id: 5, label: 'Serviço / Produto', sub: 'O que é vendido e como funciona', icon: 'briefcase', fields: ['servico_principal', 'servicos_lista', 'servicos_descricao', 'preco_exibir', 'preco_valor', 'preco_condicao', 'oferta_especial'] },
  { id: 6, label: 'Público-Alvo', sub: 'Perfil, dores e resultado', icon: 'target', fields: ['publico_primario', 'publico_dor', 'publico_resultado', 'publico_secundario', 'faq'] },
  { id: 7, label: 'Autoridade', sub: 'Diferenciais e prova social', icon: 'star', fields: ['diferencial', 'frase_impacto', 'historia', 'casos_resultados', 'depoimentos', 'depoimentos_qtd', 'depoimentos_formato', 'google_business', 'google_nota', 'google_qtd'] },
  { id: 8, label: 'Tom e Identidade', sub: 'Estilo, vocabulário e restrições', icon: 'palette', fields: ['estilo_desejado', 'sensacao_visitante', 'frase_tom', 'vocabulario_usa', 'vocabulario_nunca', 'restricoes'] },
];

const REQUIRED_FIELDS = {
  1: ['nome_cliente', 'segmento', 'tipo'],
  2: ['whatsapp'],
  3: [],
  4: ['modalidade'],
  5: ['servico_principal'],
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
