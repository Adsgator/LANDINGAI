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
   ============================================================ */
const AI_MODELS = {
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
    provider: 'gemini', group: 'Google Gemini', tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent',
    maxTokens: 16384, temp: 0.7,
  },
  'gemini-3.1-pro': {
    label: 'Gemini 3.1 Pro',
    provider: 'gemini', group: 'Google Gemini', tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent',
    maxTokens: 65536, temp: 0.6,
  },
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
    maxTokens: 8000, temp: 1,
  },
  'openrouter-sonnet': {
    id: 'openrouter-sonnet', label: 'Claude Sonnet (OpenRouter)',
    provider: 'openrouter', group: 'OpenRouter', tier: 'paid',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'anthropic/claude-sonnet-4-5',
    maxTokens: 16000, temp: 0.65,
  },
};

const API_PROVIDERS = [
  { id: 'gemini', label: 'Google Gemini', hint: 'Gratuito com limites generosos.', url: 'https://aistudio.google.com/app/apikey', urlLabel: 'Obter no AI Studio' },
  { id: 'claude', label: 'Anthropic Claude', hint: 'Pago por uso.', url: 'https://console.anthropic.com', urlLabel: 'Obter no Console' },
  { id: 'grok', label: 'xAI Grok', hint: 'Pago por uso.', url: 'https://console.x.ai', urlLabel: 'Obter no Console' },
  { id: 'mistral', label: 'Mistral AI', hint: 'Pago por uso.', url: 'https://console.mistral.ai', urlLabel: 'Obter no Console' },
  { id: 'github', label: 'GitHub Models', hint: 'Gratuito com conta GitHub.', url: 'https://github.com/settings/tokens', urlLabel: 'Gerar token' },
  { id: 'openrouter', label: 'OpenRouter', hint: 'Acesso multi-provider.', url: 'https://openrouter.ai/keys', urlLabel: 'Obter no OpenRouter' },
];

const STEPS = [
  { id: 1, title: 'Identificação', sub: 'Nome, nicho e tipo de projeto', icon: 'user' },
  { id: 2, title: 'Contato e Conversão', sub: 'WhatsApp, e-mail, objetivo de conversão', icon: 'phone' },
  { id: 3, title: 'Presença Digital', sub: 'Redes sociais e localização', icon: 'globe' },
  { id: 4, title: 'Atendimento', sub: 'Modalidade, endereço e FAQ', icon: 'map-pin' },
  { id: 5, title: 'Serviços e Preço', sub: 'Serviço principal, valor, condições', icon: 'briefcase' },
  { id: 6, title: 'Público-Alvo', sub: 'Avatar, dores, resultado esperado', icon: 'target' },
  { id: 7, title: 'Diferenciais e Prova', sub: 'Autoridade, depoimentos, Google Business', icon: 'star' },
  { id: 8, title: 'Tom e Identidade', sub: 'Estilo visual, sensação, restrições', icon: 'palette' },
];

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

const FIELD_VALIDATIONS = {
  diferencial: { min: 60, msg: 'Seja mais específico.' },
  servicos_descricao: { min: 80, msg: 'Descreva melhor o serviço.' },
};

const FIELD_TOOLTIPS = {
  nome_cliente: 'Nome do profissional como aparecerá no site.',
  segmento: 'Área específica (ex: fisioterapia pélvica).',
  tipo: 'Define a estrutura da página.',
  whatsapp: 'Só dígitos com DDI e DDD.',
  instagram: 'Usuário com @.',
  modalidade: 'Presencial, Online ou Híbrido.',
  servico_principal: 'Serviço foco da campanha.',
  preco_exibir: 'Exibir preço reduz volume mas aumenta qualidade.',
  publico_primario: 'Perfil do cliente ideal.',
  diferencial: 'O que te diferencia concretamente.',
  frase_impacto: 'Como descreveria em uma frase.',
  depoimentos: 'Bloco de Prova Social.',
  estilo_desejado: 'Como o site deve ser percebido.',
  sensacao_visitante: 'Segurança, urgência, etc.',
};

const REGRAS_FIXAS_ADSGATOR = `
# REGRAS FIXAS — ADSGATOR
- Astro + Tailwind CSS + GSAP ScrollTrigger + Lenis
- PROIBIDO usar px. Use rem em 100% do código.
- Sem placeholders (TODO, // add here, etc).
`.trim();

const PROMPT_AUDITORIA = `
Auditoria Final:
1. Há px? Corrija para rem.
2. Há placeholders? Remova.
`.trim();

function validateApiKey(provider, apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return { valid: false, message: 'Vazio' };
  const t = apiKey.trim();
  if (provider === 'gemini' && t.length < 20) return { valid: false, message: 'Curta' };
  if (provider === 'claude' && !t.startsWith('sk-')) return { valid: false, message: 'sk-' };
  if (provider === 'mistral' && !t.startsWith('sk-')) return { valid: false, message: 'sk-' };
  if (provider === 'openrouter' && !t.startsWith('sk-or-')) return { valid: false, message: 'sk-or-' };
  return { valid: true, message: 'OK' };
}