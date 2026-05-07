/* ============================================================
   LandingAI v2 — Configurações e Constantes
   ============================================================ */

// window.App é declarado no index.html inline script (antes dos módulos)
// Não redeclarar aqui para evitar sobrescrever propriedades já atribuídas

const VERSION = '2.0.0';

const STORAGE_KEYS = {
  PROJECTS: 'landingai_v2_projects',
  ACTIVE: 'landingai_v2_active',
  API_KEYS: 'landingai_v2_apikeys',
  SETTINGS: 'landingai_v2_settings',
};

const STORAGE_LIMIT_BYTES = 4 * 1024 * 1024; // 4MB

const AI_MODELS = {
  // ── Google Gemini ──────────────────────────────────────────
  'gemini-2.0-flash-lite': { // Mantive caso você ainda tenha projetos rodando nele
    label: 'Gemini 2.0 Flash Lite',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-25:generateContent',
    maxTokens: 16384,
    temp: 0.7,
  },
  'gemini-2.5-flash-lite': {
    label: 'Gemini 2.5 Flash Lite',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
    maxTokens: 16384,
    temp: 0.7,
  },
  'gemini-2.5-flash': {
    label: 'Gemini 2.5 Flash',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    maxTokens: 32768,
    temp: 0.7,
  },
  'gemini-2.5-pro': {
    label: 'Gemini 2.5 Pro',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
    maxTokens: 65536,
    temp: 0.6,
  },
  'gemini-2.5-flash-image': {
    label: 'Gemini 2.5 Flash Image (Nano Banana)',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
    maxTokens: 4096,
    temp: 0.7,
    supportsImages: true,
  },
  'gemini-3-flash-preview': {
    label: 'Gemini 3 Flash',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent',
    maxTokens: 32768,
    temp: 0.7,
  },
  'gemini-3.1-pro-preview': {
    label: 'Gemini 3.1 Pro Preview',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent',
    maxTokens: 65536,
    temp: 0.6,
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
  'mistral-large': {
    id: 'mistral-large', label: 'Mistral Large 2',
    provider: 'mistral', group: 'Mistral AI', tier: 'paid',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-large-latest',
    maxTokens: 16000, temp: 0.7,
  },
  'mistral-small': {
    id: 'mistral-small', label: 'Mistral Small',
    provider: 'mistral', group: 'Mistral AI', tier: 'paid',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-small-latest',
    maxTokens: 12000, temp: 0.7,
  },
};

const STEPS = [
  {
    id: 'step1',
    title: 'Identificação',
    sub: 'Nome, nicho e tipo de projeto',
    icon: 'user',
    fields: [
      { key: 'nome_cliente', label: 'Nome do cliente', type: 'text' },
      { key: 'nome_marca', label: 'Nome da marca', type: 'text' },
      { key: 'segmento', label: 'Segmento / profissão', type: 'text' },
      { key: 'tipo', label: 'Tipo de negócio', type: 'text' },
      { key: 'dominio', label: 'Domínio desejado', type: 'text' },
      { key: 'cnpj', label: 'CNPJ', type: 'text' },
      { key: 'aviso_legal', label: 'Aviso legal / registro profissional', type: 'text' },
    ]
  },
  {
    id: 'step2',
    title: 'Contato e CTA',
    sub: 'WhatsApp, e-mail e conversão',
    icon: 'phone',
    fields: [
      { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
      { key: 'email', label: 'E-mail de contato', type: 'email' },
      { key: 'horarios', label: 'Dias e horários de atendimento', type: 'text' },
      { key: 'gtm_id', label: 'ID do Google Tag Manager', type: 'text' },
      { key: 'objetivo_conversao', label: 'Como o lead entra em contato?', type: 'text' },
    ]
  },
  {
    id: 'step3',
    title: 'Presença Digital',
    sub: 'Redes sociais e plataformas',
    icon: 'globe',
    fields: [
      { key: 'instagram', label: 'Instagram', type: 'text' },
      { key: 'tiktok', label: 'TikTok', type: 'text' },
      { key: 'youtube', label: 'YouTube', type: 'text' },
      { key: 'outras_redes', label: 'Outras redes', type: 'text' },
      { key: 'integracoes', label: 'Integrações no Site', type: 'text' },
    ]
  },
  {
    id: 'step4',
    title: 'Atendimento',
    sub: 'Modalidade, endereço, cidades',
    icon: 'map-pin',
    fields: [
      { key: 'modalidade', label: 'Como o cliente atende?', type: 'text' },
      { key: 'endereco', label: 'Endereço completo', type: 'textarea' },
      { key: 'maps_link', label: 'Link do Google Maps', type: 'text' },
      { key: 'exibir_localizacao', label: 'Exibição no site', type: 'text' },
      { key: 'cidades_atendimento', label: 'Raio / Cidades de atendimento', type: 'text' },
      { key: 'plataforma_online', label: 'Plataforma de atendimento', type: 'text' },
      { key: 'faq', label: 'Perguntas Frequentes (FAQ)', type: 'textarea' },
      { key: 'objecoes_atendimento', label: 'Principais objeções / medos', type: 'textarea' },
    ]
  },
  {
    id: 'step5',
    title: 'Serviço / Produto',
    sub: 'O que é vendido e como funciona',
    icon: 'briefcase',
    fields: [
      { key: 'servico_principal', label: 'Serviço principal — foco da campanha', type: 'text' },
      { key: 'servicos_descricao', label: 'Descrição detalhada', type: 'textarea' },
      { key: 'preco_exibir', label: 'Exibir preço?', type: 'text' },
      { key: 'preco_valor', label: 'Valor', type: 'text' },
      { key: 'preco_condicao', label: 'Condição', type: 'text' },
    ]
  },
  {
    id: 'step6',
    title: 'Público-Alvo',
    sub: 'Perfil, dores e resultado',
    icon: 'target',
    fields: [
      { key: 'publico_primario', label: 'Perfil do cliente ideal', type: 'textarea' },
      { key: 'publico_dor', label: 'Principal dor / problema', type: 'textarea' },
      { key: 'publico_resultado', label: 'Resultado esperado', type: 'textarea' },
    ]
  },
  {
    id: 'step7',
    title: 'Autoridade',
    sub: 'Diferenciais e prova social',
    icon: 'star',
    fields: [
      { key: 'diferencial', label: 'O que diferencia o profissional?', type: 'textarea' },
      { key: 'frase_impacto', label: 'Frase de impacto — possível H1 da página', type: 'text' },
      { key: 'historia', label: 'História ou origem do negócio', type: 'textarea' },
      { key: 'casos_resultados', label: 'Cases e resultados concretos', type: 'textarea' },
      { key: 'depoimentos', label: 'Tem depoimentos reais?', type: 'text' },
      { key: 'depoimentos_qtd', label: 'Quantidade disponível', type: 'number' },
      { key: 'depoimentos_formato', label: 'Formato', type: 'text' },
      { key: 'google_business', label: 'Tem perfil no Google Meu Negócio?', type: 'text' },
      { key: 'google_nota', label: 'Nota média', type: 'number' },
      { key: 'google_qtd', label: 'Número de avaliações', type: 'number' },
    ]
  },
  {
    id: 'step8',
    title: 'Tom e Identidade',
    sub: 'Estilo, vocabulário e restrições',
    icon: 'palette',
    fields: [
      { key: 'estilo_desejado', label: 'Estilo visual desejado', type: 'textarea' },
      { key: 'sensacao_visitante', label: 'O que o visitante deve sentir?', type: 'textarea' },
      { key: 'restricoes', label: 'Restrições (o que evitar)', type: 'textarea' },
    ]
  },
];

const REQUIRED_FIELDS = {
  1: ['nome_cliente', 'segmento', 'tipo'],
  2: ['whatsapp', 'objetivo_conversao'],
  3: ['google_business'],
  4: ['modalidade'],
  5: ['servico_principal'],
  6: ['publico_primario', 'publico_dor'],
  7: ['diferencial'],
  8: ['estilo_desejado'],
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
  endereco: 'Endereço completo com ponto de referência. Só incluir se autorizado pelo cliente.',
  exibir_localizacao: 'Como exibir o endereço: completo, só o bairro, ou apenas a cidade.',
  maps_link: 'URL do Google Maps (compartilhar → copiar link). Usado para criar o link de rotas no site.',
  cidades_atendimento: 'Cidades ou bairros onde o cliente atua. Ajuda no SEO local e na autoridade da região.',
  faq: 'Perguntas frequentes. Economizam tempo do suporte e aumentam a taxa de conversão.',
  objecoes_atendimento: 'Dores de cabeça comuns do cliente antes de fechar. A IA usará isso para criar argumentos de venda.',
  plataforma_online: 'Plataforma usada para atendimento online. Ex: Google Meet, Zoom, WhatsApp Vídeo.',

  // Step 5
  servico_principal: 'O serviço ou produto mais importante — foco da campanha. Vai definir a H1 e o Hero da página.',
  servicos_descricao: 'Como funciona o processo, o que está incluso, quanto tempo dura, qual resultado esperado. Quanto mais detalhe, mais rica a copy do bloco "Como Funciona".',
  preco_exibir: 'Exibir preço reduz volume de leads mas aumenta qualidade. Bom para serviços premium ou com preço fixo.',
  preco_valor: 'Valor e forma de cobrança. Ex: R$ 350/sessão, A partir de R$ 1.200/mês.',
  preco_condicao: 'Condição especial ou parcelamento. Ex: 3x sem juros no cartão.',

  // Step 6
  publico_primario: 'Perfil do cliente ideal: gênero, faixa etária, situação de vida, localização. Fale sobre uma pessoa real, não uma demografia genérica.',
  publico_dor: 'O problema real que faz o cliente buscar esse serviço. Use a linguagem do cliente — como ele pesquisa no Google, não o termo técnico.',
  publico_resultado: 'O que o cliente imagina conquistar após contratar. Deve aparecer no Hero e no CTA Final da página.',

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
  restricoes: 'Tudo que NÃO quer de forma alguma — cores, estilos, elementos, referências negativas. Ex: Sem rosa. Sem visual de infoproduto. Sem fontes cursivas.',
};
