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
    'claude-sonnet-4': {
      name: 'Claude Sonnet 4',
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514',
      baseURL: 'https://api.anthropic.com',
      freeModel: false,
      info: 'Modelo mais avançado, ideal para tasks complexas'
    },
    'claude-haiku-4': {
      name: 'Claude Haiku 4 (Grátis)',
      provider: 'anthropic',
      model: 'claude-haiku-4-20251022',
      baseURL: 'https://api.anthropic.com',
      freeModel: true,
      info: 'Rápido e gratuito, bom para resumos e análises'
    },

    // ========== GOOGLE GEMINI ==========
    'gemini-2-flash': {
      name: 'Gemini 2.0 Flash',
      provider: 'google',
      model: 'gemini-2.0-flash',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: true,
      info: 'Modelo gratuito do Google, muito rápido'
    },
    'gemini-2-pro': {
      name: 'Gemini 2.0 Pro',
      provider: 'google',
      model: 'gemini-2-pro',
      baseURL: 'https://generativelanguage.googleapis.com',
      freeModel: false,
      info: 'Mais potente que Flash'
    },

    // ========== OPENROUTER (Multi-provider) ==========
    'openrouter-grok-3': {
      name: 'Grok 3 (via OpenRouter)',
      provider: 'openrouter',
      model: 'xai/grok-3',
      baseURL: 'https://openrouter.ai/api',
      freeModel: false,
      info: 'Modelo Grok via OpenRouter'
    },
    'openrouter-mistral': {
      name: 'Mistral Large (via OpenRouter)',
      provider: 'openrouter',
      model: 'mistralai/mistral-large-2407',
      baseURL: 'https://openrouter.ai/api',
      freeModel: false,
      info: 'Modelo Mistral via OpenRouter'
    },

    // ========== OPENAI ==========
    'openai-gpt4': {
      name: 'GPT-4 Turbo',
      provider: 'openai',
      model: 'gpt-4-turbo',
      baseURL: 'https://api.openai.com',
      freeModel: false,
      info: 'Modelo mais avançado do OpenAI'
    },
    'openai-gpt35': {
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      baseURL: 'https://api.openai.com',
      freeModel: false,
      info: 'Modelo econômico do OpenAI'
    }
  },

  providers: [
    { id: 'google', label: 'Google Gemini', hint: 'Gratuito com limites generosos.', url: 'https://aistudio.google.com/app/apikey', urlLabel: 'Obter no AI Studio' },
    { id: 'anthropic', label: 'Anthropic Claude', hint: 'Pago por uso.', url: 'https://console.anthropic.com', urlLabel: 'Obter no Console' },
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