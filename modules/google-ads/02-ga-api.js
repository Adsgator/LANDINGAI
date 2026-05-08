/**
 * Puxa o contexto do projeto da Landing Page armazenado no localStorage.
 * @returns {Object} Objeto com os dados do projeto
 */
function pullContextFromLP() {
  // 1. Puxa do localStorage
  const briefing = JSON.parse(localStorage.getItem('briefing_bruto')) || {};
  const lpUrl = localStorage.getItem('lp_url') || '';
  
  // 2. Retorna objeto
  return {
    cliente_nome: briefing.client_name || 'Cliente',
    servico_descricao: briefing.service_description || '',
    proposta_valor: briefing.value_proposition || '',
    publico_alvo: briefing.target_audience || '',
    restricoes: briefing.restrictions || '',
    tom_identidade: briefing.tone_identity || '',
    lp_url: lpUrl,
    estrutura_blocos: JSON.parse(localStorage.getItem('generated_structure')) || []
  };
}

// TODO: Implementar chamadas da IA para gerar a estratégia

/**
 * SYSTEM PROMPT PARA GERAÇÃO DE ESTRATÉGIA
 */
const SYSTEM_PROMPT_GA_STRATEGY = `
# LANDINGAI × GOOGLE ADS — Gerador de Estratégia

Você é um especialista em Google Ads com 10+ anos criando campanhas para prestadores de serviço regional.

## TAREFA
Gerar uma estratégia Google Ads completa em formato JSON baseada no contexto da Landing Page.

## REGRAS CRÍTICAS

### Divisão de Orçamento
- < R$1000: Search 100%
- R$1000-3000: Search 70-80%, PMax 20-30%
- > R$3000: Search 60%, PMax 40%
SEMPRE justificar em "justificativa_estrategica"

### Keywords
✅ Comercial Alto Intento: "serviço + localização" (broad, phrase, exact)
✅ Informacional: "como/quando/diferença" (awareness)
❌ Negativas Obrigatórias: grátis, curso, faculdade, educação, emprego

### Anúncios
- Headlines: máx 30 chars, incluir serviço + diferencial
- Descriptions: máx 90 chars, incluir credencial + experiência + garantia
- CTA: "Agende Agora", "Marque Consulta", "Fale Conosco"
- ❌ Evitar: claims vagas ("melhor", "único"), garantias falsas

### Metas
- CPA = Budget Total ÷ Meta Leads
- ROAS mínimo 2:1 (ideal 3:1+)
- CTR esperado: 3-8% para Search

### Validação
- [ ] Keywords alinhadas com proposta
- [ ] Anúncios SEM claims vagas
- [ ] Anúncios COM credenciais específicas
- [ ] URL relevante
- [ ] Budget viável
- [ ] Personas definidas
- [ ] Observações úteis

## OUTPUT
✅ APENAS JSON válido (sem markdown, sem explicação)
✅ Nenhum placeholder
✅ Todos os campos obrigatórios
✅ Parseável sem erros
`;

/**
 * Gerar estratégia Google Ads com IA
 * @param {object} context - Contexto da LP
 * @param {object} parameters - Parâmetros da campanha (budget, goal, location, url)
 * @returns {Promise<object>} Estratégia em JSON
 */
async function generateGAStrategy(context, parameters) {
  // Validar inputs
  if (!context || !parameters) {
    throw new Error('Contexto ou parâmetros faltando');
  }
  
  if (!parameters.budget || parameters.budget < 100) {
    throw new Error('Budget deve ser mínimo R$100');
  }
  
  // Construir prompt do usuário
  const userPrompt = `
GERAR ESTRATÉGIA GOOGLE ADS

CLIENTE:
- Nome: ${context.cliente_nome || 'Cliente'}
- Serviço: ${context.servico_nome || ''}
- Descrição: ${context.servico_descricao || ''}
- Público-alvo: ${context.publico_alvo || ''}
- Diferencial: ${context.proposta_valor || ''}

PARÂMETROS DA CAMPANHA:
- Budget Mensal: R$ ${parameters.budget}
- Meta: ${parameters.goal} (${mapGoalToPortuguese(parameters.goal)})
- Localização: ${parameters.location}
- URL Landing Page: ${context.lp_url || parameters.lp_url}

RESTRIÇÕES DO CLIENTE:
${context.restricoes || 'Nenhuma restrição específica'}

TOM E IDENTIDADE:
${context.ton_identidade || 'Tom profissional e empático'}

Gere a estratégia completa em JSON.
RESPONDA APENAS COM JSON, SEM EXPLICAÇÕES.
`;

  try {
    console.log('📤 Chamando IA para gerar estratégia...');
    
    // Check if callAI exists (from main app), otherwise this will throw
    if (typeof callAI === 'undefined') {
      // Mock for now or we wait to use App's callAI if integrated
      console.warn('callAI not found globally, please ensure App is loaded or mock it');
    }
    
    const selectedModel = (window.App && window.App.state && window.App.state.selectedModel) || 'claude-haiku-4';

    const response = await window.callAI({
      model: selectedModel,
      systemPrompt: SYSTEM_PROMPT_GA_STRATEGY,
      userPrompt: userPrompt,
      maxTokens: 5000,
      temperature: 0.7
    });

    console.log('✅ Resposta recebida da IA');
    
    // Extrair JSON da resposta
    let jsonStr = response.content || response;
    
    // Limpar markdown se houver
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON
    let strategy;
    try {
      strategy = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON:', e);
      console.error('String recebida:', jsonStr.substring(0, 500));
      throw new Error(`Resposta da IA não é JSON válido: ${e.message}`);
    }
    
    // Validações básicas
    if (!strategy.id) strategy.id = `ga-strategy-${Date.now()}`;
    if (!strategy.timestamp) strategy.timestamp = new Date().toISOString();
    if (!strategy.versao_formato) strategy.versao_formato = '1.0';
    
    // Garantir que campanhas é array
    if (!Array.isArray(strategy.campanhas)) {
      throw new Error('JSON inválido: "campanhas" deve ser array');
    }
    
    if (strategy.campanhas.length === 0) {
      throw new Error('Nenhuma campanha foi gerada');
    }
    
    console.log(`✅ Estratégia gerada com ${strategy.campanhas.length} campanha(s)`);
    
    // Salvar no estado
    if (!window.App) window.App = {};
    window.App.ga = window.App.ga || {};
    window.App.ga.lastStrategy = strategy;
    window.App.ga.lastContext = context;
    window.App.ga.lastParameters = parameters;
    
    return strategy;
    
  } catch (error) {
    console.error('❌ Erro ao gerar estratégia:', error);
    throw error;
  }
}

/**
 * Mapear goal em PT-BR
 */
function mapGoalToPortuguese(goal) {
  const map = {
    'leads': 'Gerar Leads',
    'calls': 'Receber Chamadas',
    'bookings': 'Agendar Consultas',
    'sales': 'Vender Produtos/Serviços'
  };
  return map[goal] || goal;
}

/**
 * Atualizar App.state.selectedModel com modelo selecionado
 * (chamar isso no form antes de generateGAStrategy)
 */
function setSelectedGAModel(modelId) {
  if (!window.App) window.App = {};
  window.App.state = window.App.state || {};
  window.App.state.selectedModel = modelId;
  console.log(`📍 Modelo selecionado: ${modelId}`);
}
