/**
 * Google Ads API Integration
 * Modo 1: Criação | Modo 2: Otimização
 */

/**
 * MODO 1: Gerar Estratégia
 */
async function generateGAStrategy(inputs) {
  try {
    Loader.show('📊 Analisando contexto da LP...', 'Gerando estratégia de campanhas');

    // 1. Puxar contexto
    let contextoCliente = '';
    let urlParaUsar = inputs.lpUrl;
    
    if (inputs.manualBriefing) {
        contextoCliente = `DADOS DO BRIEFING MANUAL (USE ESTAS INFORMAÇÕES PRINCIPALMENTE):\n${inputs.manualBriefing}\n\n`;
    } else {
        const context = pullContextFromLP();
        contextoCliente = `CLIENTE: ${context.cliente_nome}\nSERVIÇO: ${context.servico_descricao}\n`;
        if (!urlParaUsar) urlParaUsar = context.lp_url;
    }

    // 2. Construir prompt
    const prompt = `
    Gerar estratégia completa de Google Ads para:

    ${contextoCliente}
    VERBA MENSAL: R$ ${inputs.budgetTotal}
    GEOLOCALIZAÇÃO: ${inputs.location}
    META PRINCIPAL: ${inputs.mainGoal}

    Considere que ${inputs.budgetTotal < 1000 ? 'o orçamento é baixo, então foque em Rede de Pesquisa' : 'há bom orçamento, considere multi-canal'}.

    Retorne EXCLUSIVAMENTE um JSON válido (sem markdown) com esta estrutura:
    {
      "id": "ga-strategy-${Date.now()}",
      "analise": "Análise da situação",
      "recomendacao": "Recomendação estratégica",
      "justificativa": "Por que esta estratégia",
      "campanhas": [
        {
          "nome": "Nome da Campanha",
          "rede": "search|display|pmax|youtube",
          "orcamento": 500,
          "ad_groups": [
            {
              "nome": "Grupo de Anúncio",
              "keywords_positivas": ["palavra1", "palavra2"],
              "keywords_negativas": ["evitar1", "evitar2"],
              "anuncios": [
                {
                  "headlines": [
                    { "texto": "Headline 1" },
                    { "texto": "Headline 2" },
                    { "texto": "Headline 3" }
                  ],
                  "descriptions": [
                    { "texto": "Description 1" },
                    { "texto": "Description 2" }
                  ],
                  "final_url": "${urlParaUsar}",
                  "call_to_action": "Entre em contato"
                }
              ]
            }
          ]
        }
      ]
    }

    Regras:
    - Headlines: máximo 30 caracteres
    - Descriptions: máximo 90 caracteres
    - Mínimo 3 headlines e 2 descriptions por anúncio
    - Mínimo 5 keywords positivas por grupo
    - Keywords negativas mais relevantes possível
    - Não inventar URLs, usar a fornecida
    - JSON deve ser válido e completo
    `;

    const response = await callAI({
      model: App.state.selectedModel,
      userPrompt: prompt,
      maxTokens: 3000
    });

    Loader.updateMessage('📊 Processando estratégia gerada...', 'Validando dados');

    // 3. Parse JSON
    let strategy;
    try {
      strategy = JSON.parse(response.content);
    } catch (e) {
      // Tentar extrair JSON se houver markdown
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        strategy = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('IA não retornou JSON válido');
      }
    }

    Loader.hide();

    // 4. Validar
    validateGAStrategy(strategy);

    // 5. Salvar em localStorage
    localStorage.setItem('ga_strategy', JSON.stringify(strategy));

    return strategy;

  } catch (error) {
    Loader.hide();
    throw error;
  }
}

/**
 * MODO 2: Otimização de Campanha
 */
async function optimizeGACampaign(reportText) {
  try {
    Loader.show('📈 Analisando relatório...', 'Gerando recomendações de otimização');

    const prompt = `
    Analise este relatório bruto do Google Ads e gere um plano de ação:

    RELATÓRIO:
    ${reportText}

    Retorne EXCLUSIVAMENTE um JSON válido (sem markdown) com:
    {
      "sumario": "Resumo da situação",
      "score_saude": 0-100,
      "acoes": [
        {
          "prioridade": "alta|media|baixa",
          "tipo": "pausar|escalar|testar|ajustar",
          "elemento": "Nome da campanha/grupo/keyword",
          "problema": "Por que agir",
          "acao": "O que fazer",
          "impacto_esperado": "Resultado esperado",
          "urgencia": "dias até agir"
        }
      ]
    }

    Classifique por:
    - ALTA: Palavras com CPC alto mas baixa conversão = pausar
    - MEDIA: Keywords com bom desempenho = escalar orçamento
    - BAIXA: Testar novas variações de anúncio

    JSON deve ser válido e completo.
    `;

    const response = await callAI({
      model: App.state.selectedModel,
      userPrompt: prompt,
      maxTokens: 2000
    });

    Loader.hide();

    // Parse JSON
    let plan;
    try {
      plan = JSON.parse(response.content);
    } catch (e) {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('IA não retornou JSON válido');
      }
    }

    // Salvar
    localStorage.setItem('ga_optimization_plan', JSON.stringify(plan));

    return plan;

  } catch (error) {
    Loader.hide();
    throw error;
  }
}

/**
 * Validar estratégia
 */
function validateGAStrategy(strategy) {
  const errors = [];

  if (!strategy.campanhas || strategy.campanhas.length === 0) {
    errors.push('Nenhuma campanha definida');
  }

  strategy.campanhas?.forEach((camp, idx) => {
    if (!camp.nome) errors.push(`Campanha ${idx}: sem nome`);
    if (!camp.ad_groups || camp.ad_groups.length === 0) {
      errors.push(`Campanha "${camp.nome}": sem ad groups`);
    }

    camp.ad_groups?.forEach((ag, agIdx) => {
      if (!ag.keywords_positivas || ag.keywords_positivas.length === 0) {
        errors.push(`Ad Group "${ag.nome}": sem keywords`);
      }
      if (!ag.anuncios || ag.anuncios.length === 0) {
        errors.push(`Ad Group "${ag.nome}": sem anúncios`);
      }
    });
  });

  if (errors.length > 0) {
    throw new Error(`Validação falhou:\n${errors.join('\n')}`);
  }
}

/**
 * Puxar contexto da LP
 */
function pullContextFromLP() {
  return {
    cliente_nome: JSON.parse(localStorage.getItem('briefing_bruto') || '{}').client_name || 'Cliente',
    servico_descricao: JSON.parse(localStorage.getItem('briefing_bruto') || '{}').service_description || '',
    lp_url: localStorage.getItem('lp_url') || 'https://exemplo.com'
  };
}

// Exportar
window.generateGAStrategy = generateGAStrategy;
window.optimizeGACampaign = optimizeGACampaign;
