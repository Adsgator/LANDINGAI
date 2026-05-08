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
   MODELOS DE IA (Configuração Unificada)
   ============================================================ */
App.config = {
  models: {
    // ========== ANTHROPIC CLAUDE ==========
    'claude-sonnet': {
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20240620',
      baseURL: 'https://api.anthropic.com',
      freeModel: false,
      info: 'Modelo mais avançado da Anthropic (3.5 Sonnet)'
    },
    'claude-opus': {
      name: 'Claude 3 Opus',
      provider: 'anthropic',
      model: 'claude-3-opus-20240229',
      baseURL: 'https://api.anthropic.com',
      freeModel: false,
      info: 'Modelo mais inteligente (3 Opus)'
    },
    'claude-haiku': {
      name: 'Claude 3 Haiku',
      provider: 'anthropic',
      model: 'claude-3-haiku-20240307',
      baseURL: 'https://api.anthropic.com',
      freeModel: true,
      info: 'Rápido e econômico (3 Haiku)'
    },

    // ========== GOOGLE GEMINI ==========
    'gemini-2.0-flash-lite': {
      name: 'Gemini 2.0 Flash Lite',
      provider: 'google',
      model: 'gemini-2.0-flash-lite',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: true,
      info: 'Versão leve e otimizada do Gemini 2.0'
    },
    'gemini-2.5-flash-lite': {
      name: 'Gemini 2.5 Flash Lite',
      provider: 'google',
      model: 'gemini-2.5-flash-lite-preview-06-17',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: true,
      info: 'Preview do Flash Lite 2.5'
    },
    'gemini-2.5-flash': {
      name: 'Gemini 2.5 Flash',
      provider: 'google',
      model: 'gemini-2.5-flash-preview-05-20',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: true,
      info: 'Versão estável e rápida'
    },
    'gemini-2.5-pro': {
      name: 'Gemini 2.5 Pro',
      provider: 'google',
      model: 'gemini-2.5-pro-preview-06-05',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: false,
      info: 'Versão pro de alta precisão'
    },
    'gemini-2.5-flash-image': {
      name: 'Gemini 2.5 Flash Image',
      provider: 'google',
      model: 'gemini-2.5-flash-preview-05-20',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: false,
      info: 'Geração de Imagens',
      supportsImages: true
    },
    'gemini-3-flash-preview': {
      name: 'Gemini 3 Flash Preview',
      provider: 'google',
      model: 'gemini-3.1-flash-lite-preview',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: false,
      info: 'Geração 3 Experimental'
    },
    'gemini-3.1-pro-preview': {
      name: 'Gemini 3.1 Pro Preview',
      provider: 'google',
      model: 'gemini-3.1-pro-preview',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: false,
      info: 'Geração 3.1 Experimental'
    },

    // ========== xAI GROK ==========
    'grok-3': {
      name: 'Grok 3',
      provider: 'grok',
      model: 'grok-3',
      baseURL: 'https://api.x.ai',
      freeModel: false,
      info: 'Modelo Grok 3 nativo'
    },
    'grok-3-mini': {
      name: 'Grok 3 Mini',
      provider: 'grok',
      model: 'grok-3-mini',
      baseURL: 'https://api.x.ai',
      freeModel: true,
      info: 'Grok rápido e eficiente'
    },

    // ========== MISTRAL ==========
    'mistral-large': {
      name: 'Mistral Large 2',
      provider: 'mistral',
      model: 'mistral-large-2407',
      baseURL: 'https://api.mistral.ai',
      freeModel: false,
      info: 'Modelo mais potente da Mistral'
    },
    'mistral-medium': {
      name: 'Mistral Medium 3',
      provider: 'mistral',
      model: 'mistral-medium-latest',
      baseURL: 'https://api.mistral.ai',
      freeModel: false,
      info: 'Equilíbrio entre velocidade e qualidade'
    },

    // ========== OPENAI ==========
    'openai-gpt4o': {
      name: 'GPT-4o',
      provider: 'openai',
      model: 'gpt-4o',
      baseURL: 'https://api.openai.com',
      freeModel: false,
      info: 'Modelo omni mais rápido e inteligente da OpenAI'
    },
    'openai-gpt4-turbo': {
      name: 'GPT-4 Turbo',
      provider: 'openai',
      model: 'gpt-4-turbo',
      baseURL: 'https://api.openai.com',
      freeModel: false,
      info: 'Versão otimizada do GPT-4'
    },

    // ========== OPENROUTER ==========
    'openrouter-grok-3': {
      name: 'Grok 3 (OpenRouter)',
      provider: 'openrouter',
      model: 'xai/grok-3',
      baseURL: 'https://openrouter.ai/api',
      freeModel: false,
      info: 'Grok 3 via OpenRouter'
    },
    'openrouter-mistral-large': {
      name: 'Mistral Large (OpenRouter)',
      provider: 'openrouter',
      model: 'mistralai/mistral-large-2407',
      baseURL: 'https://openrouter.ai/api',
      freeModel: false,
      info: 'Mistral via OpenRouter'
    }
  },

  providers: [
    { id: 'google', label: 'Google Gemini', hint: 'Gratuito com limites generosos.', url: 'https://aistudio.google.com/app/apikey', urlLabel: 'Obter no AI Studio' },
    { id: 'anthropic', label: 'Anthropic Claude', hint: 'Pago por uso.', url: 'https://console.anthropic.com', urlLabel: 'Obter no Console' },
    { id: 'grok', label: 'xAI Grok', hint: 'Acesso direto via x.ai.', url: 'https://console.x.ai', urlLabel: 'Obter no Console' },
    { id: 'mistral', label: 'Mistral AI', hint: 'Acesso direto via Mistral.', url: 'https://console.mistral.ai', urlLabel: 'Obter no Console' },
    { id: 'openrouter', label: 'OpenRouter', hint: 'Acesso multi-provider.', url: 'https://openrouter.ai/keys', urlLabel: 'Obter no OpenRouter' },
    { id: 'openai', label: 'OpenAI', hint: 'Pago por uso.', url: 'https://platform.openai.com/api-keys', urlLabel: 'Obter no Console' },
  ],

  /**
   * Atualizar lista de modelos facilmente
   */
  addModel: function(modelId, config) {
    this.models[modelId] = config;
  }
};

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
  if (provider === 'google' && t.length < 20) return { valid: false, message: 'Curta' };
  if (provider === 'anthropic' && !t.startsWith('sk-ant-')) return { valid: false, message: 'sk-ant-' };
  if (provider === 'mistral' && !t.startsWith('sk-')) return { valid: false, message: 'sk-' };
  if (provider === 'openrouter' && !t.startsWith('sk-or-')) return { valid: false, message: 'sk-or-' };
  if (provider === 'openai' && !t.startsWith('sk-')) return { valid: false, message: 'sk-' };
  return { valid: true, message: 'OK' };
}