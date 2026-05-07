/* ============================================================
   LandingAI v2 — Configurações e Constantes
   ============================================================ */

const VERSION = '2.0.1';

const STORAGE_KEYS = {
  PROJECTS: 'landingai_v2_projects',
  ACTIVE: 'landingai_v2_active',
  API_KEYS: 'landingai_v2_apikeys',
  SETTINGS: 'landingai_v2_settings',
};

const STORAGE_LIMIT_BYTES = 4 * 1024 * 1024; // 4MB

/* ============================================================
   MODELOS DE IA
   Para adicionar um novo: inclua a entrada abaixo.
   provider 'gemini' → adapter Gemini
   provider 'claude' → adapter Anthropic Messages
   qualquer outro    → adapter OpenAI-compat (só mudar endpoint + model)
   ============================================================ */
const AI_MODELS = {

  // ── Google Gemini ──────────────────────────────────────────
  'gemini-2.5-flash-lite': {
    label: 'Gemini 2.5 Flash Lite',
    provider: 'gemini', group: 'Google Gemini', tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
    maxTokens: 16384, temp: 0.7,
  },
  'gemini-2.5-flash': {
    label: 'Gemini 2.5 Flash',
    provider: 'gemini', group: 'Google Gemini', tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    maxTokens: 32768, temp: 0.7,
  },
  'gemini-2.5-pro': {
    label: 'Gemini 2.5 Pro',
    provider: 'gemini', group: 'Google Gemini', tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
    maxTokens: 65536, temp: 0.6,
  },
  'gemini-3.1-flash-lite': {
    label: 'Gemini 3.1 Flash Lite',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent',
    maxTokens: 16384,
    temp: 0.7,
  },
  'gemini-3.1-pro': {
    label: 'Gemini 3.1 Pro',
    provider: 'gemini', group: 'Google Gemini', tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent',
    maxTokens: 65536, temp: 0.6,
  },

  // ── Anthropic Claude ──────────────────────────────────────
  'claude-haiku-4': {
    id: 'claude-haiku-4', label: 'Claude Haiku 4.5',
    provider: 'claude', group: 'Anthropic', tier: 'free',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-haiku-4-5',
    maxTokens: 8192, temp: 0.65,
  },
  'claude-sonnet-4': {
    id: 'claude-sonnet-4', label: 'Claude Sonnet 4.5',
    provider: 'claude', group: 'Anthropic', tier: 'paid',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-5',
    maxTokens: 16000, temp: 0.65,
  },
  'claude-opus-4': {
    id: 'claude-opus-4', label: 'Claude Opus 4.5',
    provider: 'claude', group: 'Anthropic', tier: 'paid',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-opus-4-5',
    maxTokens: 16000, temp: 0.65,
  },

  // ── xAI Grok ──────────────────────────────────────────────
  'grok-3': {
    id: 'grok-3', label: 'Grok 3',
    provider: 'grok', group: 'xAI', tier: 'paid',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3',
    maxTokens: 12000, temp: 0.65,
  },
  'grok-3-mini': {
    id: 'grok-3-mini', label: 'Grok 3 Mini',
    provider: 'grok', group: 'xAI', tier: 'free',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3-mini',
    maxTokens: 8000, temp: 0.65,
  },

  // ── Mistral ───────────────────────────────────────────────
  'mistral-large': {
    id: 'mistral-large', label: 'Mistral Large 2',
    provider: 'mistral', group: 'Mistral AI', tier: 'paid',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-large-latest',
    maxTokens: 16000, temp: 0.7,
  },
  'mistral-small': {
    id: 'mistral-small', label: 'Mistral Small',
    provider: 'mistral', group: 'Mistral AI', tier: 'free',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-small-latest',
    maxTokens: 12000, temp: 0.7,
  },

  // ── GitHub Models (gratuito com conta GitHub) ─────────────
  // Docs: https://docs.github.com/en/github-models
  // API Key: github.com/settings/tokens → "Fine-grained tokens" → Models (read)
  'github-gpt4o': {
    id: 'github-gpt4o', label: 'GPT-4o (GitHub)',
    provider: 'github', group: 'GitHub Models', tier: 'free',
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    model: 'gpt-4o',
    maxTokens: 16000, temp: 0.7,
  },
  'github-gpt4o-mini': {
    id: 'github-gpt4o-mini', label: 'GPT-4o Mini (GitHub)',
    provider: 'github', group: 'GitHub Models', tier: 'free',
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    model: 'gpt-4o-mini',
    maxTokens: 8000, temp: 0.7,
  },
  'github-o1-mini': {
    id: 'github-o1-mini', label: 'o1 Mini (GitHub)',
    provider: 'github', group: 'GitHub Models', tier: 'free',
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    model: 'o1-mini',
    maxTokens: 8000, temp: 1, // o1 não aceita temp < 1
  },
  'github-llama-3.3-70b': {
    id: 'github-llama-3.3-70b', label: 'Llama 3.3 70B (GitHub)',
    provider: 'github', group: 'GitHub Models', tier: 'free',
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    model: 'Meta-Llama-3.3-70B-Instruct',
    maxTokens: 8000, temp: 0.7,
  },
  'github-phi-4': {
    id: 'github-phi-4', label: 'Phi-4 (GitHub)',
    provider: 'github', group: 'GitHub Models', tier: 'free',
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    model: 'Phi-4',
    maxTokens: 8000, temp: 0.7,
  },
  'github-deepseek-r1': {
    id: 'github-deepseek-r1', label: 'DeepSeek R1 (GitHub)',
    provider: 'github', group: 'GitHub Models', tier: 'free',
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    model: 'DeepSeek-R1',
    maxTokens: 8000, temp: 0.7,
  },

  // ── OpenRouter (acesso multi-provider) ────────────────────
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
};

/* ============================================================
   PROVIDERS — usado pelo modal de Config API
   Adicionar um provider novo aqui para aparecer na tela
   ============================================================ */
const API_PROVIDERS = [
  {
    id: 'gemini',
    label: 'Google Gemini',
    hint: 'Gratuito com limites generosos.',
    url: 'https://aistudio.google.com/app/apikey',
    urlLabel: 'Obter no AI Studio',
  },
  {
    id: 'claude',
    label: 'Anthropic Claude',
    hint: 'Pago por uso. Qualidade de copy excelente.',
    url: 'https://console.anthropic.com',
    urlLabel: 'Obter no Console',
  },
  {
    id: 'grok',
    label: 'xAI Grok',
    hint: 'Pago por uso.',
    url: 'https://console.x.ai',
    urlLabel: 'Obter no Console',
  },
  {
    id: 'mistral',
    label: 'Mistral AI',
    hint: 'Pago por uso. Bom custo-benefício.',
    url: 'https://console.mistral.ai',
    urlLabel: 'Obter no Console',
  },
  {
    id: 'github',
    label: 'GitHub Models',
    hint: 'Gratuito com conta GitHub. GPT-4o, Llama, Phi, DeepSeek.',
    url: 'https://github.com/settings/tokens',
    urlLabel: 'Gerar token (Fine-grained → Models)',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    hint: 'Acesso multi-provider por uma única chave.',
    url: 'https://openrouter.ai/keys',
    urlLabel: 'Obter no OpenRouter',
  },
];

/* ============================================================
   STEPS — IDs como números inteiros (1-8)
   CRÍTICO: manter como número — goToStep() e buildStepScreen()
   dependem de aritmética (currentStep + 1, etc.)
   ============================================================ */
const STEPS = [
  {
    id: 1,
    title: 'Identificação',
    sub: 'Nome, nicho e tipo de projeto',
    icon: 'user',
  },
  {
    id: 2,
    title: 'Contato e Conversão',
    sub: 'WhatsApp, e-mail, objetivo de conversão',
    icon: 'phone',
  },
  {
    id: 3,
    title: 'Presença Digital',
    sub: 'Redes sociais e localização',
    icon: 'globe',
  },
  {
    id: 4,
    title: 'Atendimento',
    sub: 'Modalidade, endereço e FAQ',
    icon: 'map-pin',
  },
  {
    id: 5,
    title: 'Serviços e Preço',
    sub: 'Serviço principal, valor, condições',
    icon: 'briefcase',
  },
  {
    id: 6,
    title: 'Público-Alvo',
    sub: 'Avatar, dores, resultado esperado',
    icon: 'target',
  },
  {
    id: 7,
    title: 'Diferenciais e Prova',
    sub: 'Autoridade, depoimentos, Google Business',
    icon: 'star',
  },
  {
    id: 8,
    title: 'Tom e Identidade',
    sub: 'Estilo visual, sensação, restrições',
    icon: 'palette',
  },
];

/* ============================================================
   CAMPOS OBRIGATÓRIOS POR STEP (para calcular progresso)
   ============================================================ */
const REQUIRED_FIELDS = {
  1: ['nome_cliente', 'segmento', 'tipo'],
  2: ['whatsapp', 'objetivo_conversao'],
  3: ['instagram'],
  4: ['modalidade'],
  5: ['servico_principal', 'servicos_descricao', 'preco_exibir'],
  6: ['publico_primario', 'publico_dor', 'publico_resultado'],
  7: ['diferencial', 'frase_impacto', 'depoimentos'],
  8: ['estilo_desejado', 'sensacao_visitante'],
};

/* ============================================================
   VALIDAÇÕES DE CAMPOS (min chars para considerar preenchido)
   ============================================================ */
const FIELD_VALIDATIONS = {
  diferencial: { min: 60, msg: 'Seja mais específico sobre o que te diferencia.' },
  servicos_descricao: { min: 80, msg: 'Descreva melhor o serviço e como funciona.' },
};

/* ============================================================
   TOOLTIPS DOS CAMPOS
   ============================================================ */
const FIELD_TOOLTIPS = {
  // Step 1
  nome_cliente: 'Nome do profissional como aparecerá no site. Ex: "Dra. Ana Lima".',
  nome_marca: 'Nome comercial, se diferente. Ex: "BM Adestramento".',
  segmento: 'Área específica — não "saúde" mas "fisioterapia pélvica". Quanto mais específico, mais precisa a copy.',
  tipo: 'Define estrutura: Serviço = agendamento; Mentoria = programa; Produto = item físico/digital.',
  dominio: 'Domínio do site. Ex: beatrizmattos.com.br.',
  cnpj: 'CNPJ para o rodapé — obrigatório em algumas categorias regulamentadas.',
  aviso_legal: 'Registro profissional para o rodapé. Ex: CRM 12345-SP, OAB/SP 123456.',
  // Step 2
  whatsapp: 'Só dígitos com DDI e DDD. Ex: 5511999999999.',
  email: 'E-mail de contato visível na página.',
  horarios: 'Dias e horários de atendimento — aumenta credibilidade.',
  gtm_id: 'ID do Google Tag Manager. Formato: GTM-XXXXXXX.',
  objetivo_conversao: 'A ação principal do visitante. WhatsApp é padrão para serviços locais.',
  // Step 3
  instagram: 'Usuário com @. Ex: @beatrizmattos.',
  google_business: 'Perfil Google Meu Negócio — habilita bloco de reviews se nota ≥ 4.5 e ≥ 10 avaliações.',
  google_nota: 'Nota exata. Mínimo 4.5 para incluir o bloco.',
  google_qtd: 'Número de avaliações. Mínimo 10.',
  // Step 4
  modalidade: 'Define blocos: Presencial → mapa. Online → sem mapa. Híbrido → ambos.',
  endereco: 'Endereço completo com ponto de referência. Só se autorizado.',
  exibir_localizacao: 'Como exibir: completo, só bairro, ou não exibir.',
  maps_link: 'URL do Google Maps (compartilhar → copiar link).',
  cidades_atendimento: 'Cidades onde atua. Ajuda no SEO local.',
  faq: 'Perguntas frequentes. Economizam atendimento e aumentam conversão.',
  objecoes_atendimento: 'Dores antes de fechar. A IA usará para criar argumentos de venda.',
  // Step 5
  servico_principal: 'Serviço foco da campanha — define H1 e Hero.',
  servicos_descricao: 'Como funciona, o que inclui, duração, resultado. Quanto mais detalhe, mais rica a copy.',
  preco_exibir: 'Exibir preço reduz volume mas aumenta qualidade dos leads.',
  // Step 6
  publico_primario: 'Perfil do cliente ideal: gênero, faixa etária, situação. Fale de uma pessoa real.',
  publico_dor: 'O problema real que faz o cliente buscar esse serviço.',
  publico_resultado: 'O que o cliente imagina conquistar após contratar.',
  // Step 7
  diferencial: 'O que concretamente diferencia. Não "humanizado" — mas método, certificação, resultado concreto.',
  frase_impacto: 'Como descreveria em uma frase. Pode virar a H1.',
  historia: 'Por que faz o que faz. Se genuína, a IA inclui bloco de história.',
  casos_resultados: 'Números e resultados concretos. Ex: 120 cães, 97% melhora em 30 dias.',
  depoimentos: 'Nunca inventamos depoimentos. Se Sim, o bloco de Prova Social é incluído.',
  // Step 8
  estilo_desejado: 'Como o site deve ser percebido. Ex: Sóbrio como Linear.app, mas mais quente para saúde.',
  sensacao_visitante: 'Emoção desejada ao navegar. Ex: Segurança imediata.',
  restricoes: 'O que NÃO quer de forma alguma — cores, estilos, elementos.',
};

/* ============================================================
   REGRAS FIXAS — injetadas no prompt de geração do DOC-IMPL
   Regra de rem obrigatório: zero px no Tailwind gerado
   ============================================================ */
const REGRAS_FIXAS_ADSGATOR = `
# REGRAS FIXAS — ADSGATOR (não negociáveis, aplicar em 100% do código gerado)

## Stack obrigatório
- Astro + Tailwind CSS + GSAP ScrollTrigger + Lenis (smooth scroll)
- Deploy: Vercel (output: hybrid)
- Analytics: Vercel Analytics + Speed Insights
- LGPD: Cookie Banner + Google Consent Mode v2
- Formulários: Web3Forms (sem backend)

## CSS e unidades
- PROIBIDO usar \`px\` como unidade em qualquer propriedade CSS ou classe Tailwind.
  Use exclusivamente \`rem\`, \`em\`, \`%\`, \`vw\`, \`vh\`, \`dvh\` ou valores semânticos do Tailwind (p-4, text-lg, etc.).
- As variáveis CSS da marca DEVEM ser declaradas em \`:root\` e referenciadas no tailwind.config.js.
  Exemplo correto: \`--color-brand: oklch(65% 0.2 150); color: var(--color-brand)\`
- \`font-size\` SEMPRE em \`rem\`. \`border-radius\` SEMPRE em \`rem\` ou \`%\`.
- Nenhum valor hardcoded de cor — sempre via variável CSS ou token Tailwind.

## Código sem placeholders
- PROIBIDO deixar qualquer placeholder no código gerado:
  "TODO", "// add here", "/* ... */", "your-value-here", "INSERT_HERE",
  "[preencher]", "[definir depois]", ou qualquer comentário de intenção sem código.
- Se um dado não existir no briefing, usar string vazia \`""\` ou condicional \`{data && <Componente />}\`.
- Todos os imports devem existir e ser válidos na stack.

## Acessibilidade mínima
- Todos os \`<img>\` com \`alt\` descritivo.
- Botões com \`aria-label\` quando não tiverem texto visível.
- Contraste mínimo WCAG AA para texto sobre fundo.

## Responsividade
- Mobile-first obrigatório. Breakpoints: sm(640), md(768), lg(1024), xl(1280).
- Nenhum elemento com largura fixa em px.
`.trim();

const PROMPT_AUDITORIA = `
Antes de finalizar, faça uma auditoria interna:
1. Há algum \`px\` em unidades CSS? Se sim, substitua por \`rem\`.
2. Há algum placeholder ("TODO", "[definir]", "add here")? Se sim, remova ou complete.
3. Todos os imports estão corretos para Astro + Tailwind?
4. As variáveis CSS da marca estão declaradas no \`:root\` e usadas nos tokens Tailwind?
Corrija antes de entregar.
`.trim();