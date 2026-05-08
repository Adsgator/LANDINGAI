# 🔍 GOOGLE ADS — JSON Schema Completo + Prompts IA

**Versão:** 1.0.1  
**Data:** 2026-05-08  
**Status:** Completar onde o Doc 6 foi cortado

---

## 📋 **JSON Schema Completo (Para Referência)**

Este é o JSON EXATO que a IA deve retornar quando gera uma estratégia:

```json
{
  "id": "ga-strategy-20250508-001",
  "timestamp": "2025-05-08T14:30:00Z",
  "versao_formato": "1.0",
  
  "analise_inicial": {
    "budget_mensal": 1500,
    "meta_principal": "leads",
    "localizacao": "São Paulo, SP",
    "recomendacao_redes": "Pesquisa (70%) + Performance Max (30%)",
    "justificativa_estrategica": "Orçamento baixo (<R$2000) recomenda focar em Search. Testamos PMax com 30% para escalabilidade.",
    "duracao_recomendada_dias": 30,
    "cpc_estimado": 2.50,
    "conversoes_projetadas": 45
  },
  
  "perfil_de_compra": {
    "personas": [
      {
        "nome": "Maria (Decisor)",
        "idade_faixa": "30-45",
        "dor_principal": "Falta de tempo",
        "jornada": "Busca → Website → Contato"
      },
      {
        "nome": "João (Influenciador)",
        "idade_faixa": "45-60",
        "dor_principal": "Risco financeiro",
        "jornada": "Busca → Review → Website"
      }
    ],
    "momento_ideal_compra": "Terça a quinta (8h-17h)",
    "dispositivos_alvo": ["mobile", "desktop"],
    "excludentes_demograficos": {
      "regioes_excluidas": ["Norte"],
      "renda_minima": "classe_media_alta"
    }
  },
  
  "metas_conversao": {
    "meta_leads_mes": 45,
    "meta_cpa": 33.33,
    "meta_roas": 3.0,
    "meta_ctr": 5.5,
    "meta_impressoes": 8000,
    "calculo": "Budget R$1500 ÷ CPA R$33.33 = ~45 leads"
  },
  
  "divisao_orcamento": {
    "total_mensal": 1500,
    "campanha_1": {
      "nome": "Search - Serviço Principal",
      "tipo": "Search Campaign",
      "orcamento": 1050,
      "percentual": "70%",
      "meta": "35 leads"
    },
    "campanha_2": {
      "nome": "Performance Max - Escala",
      "tipo": "Performance Max",
      "orcamento": 450,
      "percentual": "30%",
      "meta": "10 leads"
    }
  },
  
  "campanhas": [
    {
      "id": "camp_001",
      "nome": "Search - Serviço Principal",
      "tipo": "Search Campaign",
      "status": "DRAFT",
      "budget_diario": 35.00,
      "orcamento_total": 1050,
      "idioma": "pt-BR",
      "localizacao": "São Paulo",
      "device_bid_modifiers": {
        "mobile": 1.0,
        "desktop": 1.15,
        "tablet": 0.9
      },
      
      "ad_groups": [
        {
          "id": "ag_001",
          "nome": "Serviço - Alto Intento",
          "tipo": "Search",
          "estrategia_lances": "Target CPA",
          "target_cpa": 33.33,
          "budget": 600,
          
          "keywords_positivas": [
            {
              "keyword": "psicólogo sp",
              "match_type": "broad",
              "bid": 3.00
            },
            {
              "keyword": "terapia online são paulo",
              "match_type": "phrase",
              "bid": 2.80
            },
            {
              "keyword": "psicologia clínica sp",
              "match_type": "exact",
              "bid": 2.50
            },
            {
              "keyword": "consulta psicólogo presencial sp",
              "match_type": "phrase",
              "bid": 2.70
            },
            {
              "keyword": "psicólogo para ansiedade são paulo",
              "match_type": "phrase",
              "bid": 2.90
            }
          ],
          
          "keywords_negativas": [
            "grátis",
            "curso psicologia",
            "psicologia educacional",
            "emprego psicólogo",
            "faculdade",
            "universidade"
          ],
          
          "anuncios": [
            {
              "id": "ad_001",
              "tipo": "Responsive Search Ads",
              "status": "DRAFT",
              "headlines": [
                {
                  "texto": "Psicólogo em SP - Atendimento Online",
                  "pinned_position": 1
                },
                {
                  "texto": "Terapia Personalizada para Seu Bem-Estar"
                },
                {
                  "texto": "Agende Sua Consulta Hoje"
                },
                {
                  "texto": "Especialista em Ansiedade e Depressão"
                }
              ],
              "descriptions": [
                {
                  "texto": "Atendimento presencial e online. Especialista em ansiedade, depressão e relacionamento."
                },
                {
                  "texto": "Primeira consulta com desconto. Metodologia comprovada e credenciado CFP."
                },
                {
                  "texto": "Mais de 15 anos ajudando pessoas a transformar suas vidas."
                }
              ],
              "final_url": "https://exemplo.com/psicologia",
              "display_url": "exemplo.com/psicologia",
              "call_to_action": "Agende Agora",
              "snippets": [
                "✅ Credenciado CFP",
                "✅ +15 anos de experiência",
                "✅ 98% de satisfação"
              ]
            }
          ]
        },
        {
          "id": "ag_002",
          "nome": "Marca",
          "tipo": "Search",
          "estrategia_lances": "Target CPA",
          "target_cpa": 20.0,
          "budget": 300,
          
          "keywords_positivas": [
            {
              "keyword": "[Dr. Silva Psicólogo]",
              "match_type": "exact",
              "bid": 1.50
            },
            {
              "keyword": "[Silva Psicologia SP]",
              "match_type": "exact",
              "bid": 1.40
            }
          ],
          
          "keywords_negativas": [],
          
          "anuncios": [
            {
              "id": "ad_002",
              "tipo": "Responsive Search Ads",
              "headlines": [
                {
                  "texto": "Dr. Silva - Psicólogo em São Paulo"
                },
                {
                  "texto": "Terapia com Especialista Credenciado"
                }
              ],
              "descriptions": [
                {
                  "texto": "Atendimento presencial e online. Agende sua consulta agora."
                }
              ],
              "final_url": "https://exemplo.com",
              "display_url": "exemplo.com"
            }
          ]
        }
      ]
    },
    {
      "id": "camp_002",
      "nome": "Performance Max - Escala",
      "tipo": "Performance Max Campaign",
      "status": "DRAFT",
      "orcamento": 450,
      "budget_diario": 15.00,
      "estrategia_lances": "Maximize Conversions",
      "target_cpa": 45.00,
      "idioma": "pt-BR",
      "localizacao": "São Paulo",
      "descricao_campanha": "Expandir alcance com assets diversos. Rede Google automatizada (Search, Display, YouTube, Gmail).",
      
      "assets_requeridos": {
        "imagens": [
          "Logo consultório/profissional",
          "Foto do profissional em atendimento",
          "Ambiente de atendimento (consultório)",
          "Certificações/diplomas visíveis",
          "Depoimento visual (cliente satisfeito)"
        ],
        "videos": "Vídeo de apresentação (30-60s) ou depoimento de cliente (opcional mas recomendado)",
        "textos": [
          "Headline: Psicólogo Online - São Paulo - Atendimento Presencial",
          "Description: Especialista em ansiedade e depressão. Credenciado CFP. Primeira consulta com desconto.",
          "CTA: Agende Agora"
        ]
      },
      
      "copy_pmax": {
        "headlines_longos": [
          "Psicólogo especialista em ansiedade e depressão em São Paulo",
          "Atendimento presencial e online com profissional credenciado",
          "Transforme sua vida com terapia personalizada agora"
        ],
        "descriptions": [
          "Mais de 15 anos de experiência. Primeira consulta com desconto especial para novos pacientes.",
          "Metodologia comprovada e resultados reais. Credenciado pelo Conselho Federal de Psicologia."
        ],
        "final_url": "https://exemplo.com/psicologia",
        "call_to_action": "Agende Consulta"
      }
    }
  ],
  
  "keywords_estrategia": {
    "pesquisa_comercial_alta_intencao": [
      "psicólogo sp",
      "psicólogo são paulo",
      "terapia são paulo",
      "psicólogo online",
      "consulta psicólogo",
      "psicólogo para ansiedade",
      "psicólogo para depressão"
    ],
    "pesquisa_informacional": [
      "como encontrar bom psicólogo",
      "diferença psicólogo vs psiquiatra",
      "como é a terapia",
      "quando procurar psicólogo"
    ],
    "palavras_chave_negativas_obrigatorias": [
      "grátis",
      "curso",
      "faculdade",
      "educação",
      "emprego",
      "universidade",
      "psicologia educacional"
    ]
  },
  
  "validacoes": {
    "palavras_chave_cobertura": "✅ 100% alinhadas com proposta de valor",
    "anuncios_compliance": "✅ Sem claims vagas, sem garantias falsas",
    "landing_relevancia": "✅ URL relevante ao anúncio e keyword",
    "budget_viavel": "✅ R$1500 é viável para 45 leads (CPA R$33)",
    "device_targeting": "✅ Desktop biddable, mobile otimizado"
  },
  
  "observacoes": [
    "Performance Max requer assets de boa qualidade. Se não tiver imagens, pode pausar essa campanha e focar em Search.",
    "Keywords marca (Dr. Silva, Silva Psicologia) são muito importantes para conversão. Aumentar bid se houver competição.",
    "Testar device modifier (mobile 1.0, desktop 1.15) em 1-2 semanas. Se mobile converte mais, inverter.",
    "FAQ e depoimentos aumentam CTR. Adicionar ao landing page se possível."
  ]
}
```

---

## 🎤 **System Prompt para a IA (Completo)**

```
# LANDINGAI × GOOGLE ADS — Gerador de Estratégia

Você é um especialista em Google Ads com 10+ anos criando campanhas para prestadores de serviço regional.

## TAREFA
Gerar uma estratégia Google Ads completa em formato JSON baseada no contexto da Landing Page do cliente.

## CONTEXTO FORNECIDO
- Briefing completo do cliente
- Estrutura da landing page criada
- URL da página
- Materiais de marca
- Orçamento mensal
- Meta principal (leads, calls, bookings, sales)
- Localização geográfica

## REGRAS OBRIGATÓRIAS

### 1️⃣ DIVISÃO DE ORÇAMENTO
- Se budget < R$1000: APENAS Search Campaign (100%)
  └─ Justificativa: Budget pequeno requer máxima eficiência
  
- Se budget R$1000-3000: Search (70-80%) + Performance Max (20-30%)
  └─ Justificativa: Search captura demanda imediata, PMax testa escalabilidade
  
- Se budget > R$3000: Search (60%) + Performance Max (40%)
  └─ Justificativa: Escala com ambas as redes simultaneamente

SEMPRE explicar a divisão em "justificativa_estrategica".

### 2️⃣ KEYWORDS

BUSCA COMERCIAL (Alto Intento) - Máxima Prioridade:
- Incluir: [serviço + localização] (Ex: "psicólogo sp", "psicólogo são paulo")
- Incluir: [problema + localização] (Ex: "ansiedade sp", "depressão são paulo")
- Incluir: [serviço + formato] (Ex: "psicólogo online", "terapia presencial")
- Match types:
  * Broad: "psicólogo sp" → mais impressões
  * Phrase: "psicólogo em são paulo" → média precisão
  * Exact: "[psicólogo são paulo]" → alta conversão

BUSCA INFORMACIONAL (Awareness) - Secundária:
- "como encontrar bom psicólogo"
- "diferença psicólogo vs psiquiatra"
- "quando procurar psicólogo"

PALAVRAS NEGATIVAS OBRIGATÓRIAS (sempre incluir):
- "grátis", "curso", "faculdade", "educação", "emprego", "universidade"
- Palavras da categoria "Restrições" do briefing

### 3️⃣ ANÚNCIOS (Search)

HEADLINES:
- Máximo 30 caracteres (Google Ads limite)
- Deve incluir: [Serviço + Diferencial] no primeiro headline
- Exemplos bons:
  ✅ "Psicólogo em SP - Atendimento Online"
  ✅ "Terapia com Especialista Credenciado"
  
- Exemplos ruins:
  ❌ "O Melhor Psicólogo do Brasil"
  ❌ "Psicologia Revolucionária"

DESCRIPTIONS:
- Máximo 90 caracteres cada
- Incluir: Credencial (CFP), Experiência (anos), Garantia (satisfação %)
- Exemplo:
  ✅ "Credenciado CFP. +15 anos ajudando pacientes. 98% satisfeito."
  
CALL-TO-ACTION:
- Obrigatório: "Agende Agora", "Marque Consulta", "Fale Conosco"
- Não usar: "Compre Agora", "Baixe Aqui" (para serviço, não produto)

### 4️⃣ METAS DE CONVERSÃO

Calcular ANTES de retornar:
```
CPA Target = Budget Total ÷ Meta de Leads
Exemplo: R$1500 ÷ 45 leads = R$33.33 CPA
```

Projeção de ROAS:
- Mínimo: 2:1 (gasta R$1 para ganhar R$2)
- Alvo: 3:1 ou superior
- Cálculo: (Valor do Lead × Meta de Leads) ÷ Budget

### 5️⃣ PERFORMANCE MAX (Se aplicável)

Requer ASSETS de qualidade:
- Imagens: Logo, profissional, ambiente, certificações (mínimo 3)
- Vídeo: Apresentação ou depoimento (opcional mas recomendado)
- Copy: Headlines longos (até 90 chars) + descriptions + CTA

### 6️⃣ VALIDAÇÕES OBRIGATÓRIAS

Antes de retornar, fazer CHECKLIST:

- [ ] Keywords 100% alinhadas com proposta de valor
- [ ] Anúncios SEM claims vagas ("melhor", "único", "revolucionário")
- [ ] Anúncios COM credenciais específicas ("CFP", "+10 anos", "98%")
- [ ] URL final é relevante ao anúncio e keyword
- [ ] Budget é viável para atingir a meta
- [ ] Nenhuma keyword negativa foi incluída como positiva
- [ ] Personas estão definidas (idades, dores, jornada)
- [ ] Observações finais adicionadas para o usuário

### 7️⃣ OUTPUT

✅ Retornar APENAS JSON válido
✅ Nenhum markdown, nenhuma explicação
✅ Nenhum placeholder ou [INSERIR AQUI]
✅ Todos os campos obrigatórios preenchidos
✅ JSON deve ser parseável sem erros

## CAMPOS OBRIGATÓRIOS NO JSON

```
{
  "id": "ga-strategy-[data]-[número]",
  "timestamp": "ISO 8601",
  "versao_formato": "1.0",
  
  "analise_inicial": {
    "budget_mensal": número,
    "meta_principal": string,
    "localizacao": string,
    "recomendacao_redes": string,
    "justificativa_estrategica": string,
    "duracao_recomendada_dias": número,
    "cpc_estimado": número,
    "conversoes_projetadas": número
  },
  
  "perfil_de_compra": {
    "personas": array,
    "momento_ideal_compra": string,
    "dispositivos_alvo": array,
    "excludentes_demograficos": object
  },
  
  "metas_conversao": {
    "meta_leads_mes": número,
    "meta_cpa": número,
    "meta_roas": número,
    "meta_ctr": número,
    "meta_impressoes": número,
    "calculo": string
  },
  
  "divisao_orcamento": object,
  
  "campanhas": [
    {
      "id": string,
      "nome": string,
      "tipo": "Search Campaign" ou "Performance Max Campaign",
      "status": "DRAFT",
      "orcamento_total": número,
      "budget_diario": número,
      "ad_groups": [...]
    }
  ],
  
  "keywords_estrategia": object,
  "validacoes": object,
  "observacoes": array
}
```

## EXEMPLO REAL

Cliente: Psicólogo em SP
Budget: R$1500/mês
Meta: 45 leads

Output esperado:
- 2 campanhas (Search 70% + PMax 30%)
- Search: 2 ad groups (Serviço Alto Intento + Marca)
- 10+ keywords positivas + 6 negativas por grupo
- 2+ anúncios por grupo
- Metas: CPA R$33, ROAS 3:1, CTR 5%+
- Observações sobre assets para PMax
```

---

## 📝 **Função generateGAStrategy() — Código Final**

Adicione isto em `modules/google-ads/02-ga-api.js`:

```javascript
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
    
    const response = await callAI({
      model: App.state.selectedModel || 'claude-haiku-4',
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
    App.ga = App.ga || {};
    App.ga.lastStrategy = strategy;
    App.ga.lastContext = context;
    App.ga.lastParameters = parameters;
    
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
  App.state = App.state || {};
  App.state.selectedModel = modelId;
  console.log(`📍 Modelo selecionado: ${modelId}`);
}
```

---

## 🔗 **Integração em 01-ga-handlers.js**

Adicione o handler do botão "Gerar Estratégia":

```javascript
/**
 * Event listener: Botão "Gerar Estratégia"
 */
document.getElementById('btn-generate-strategy')?.addEventListener('click', async function() {
  try {
    // 1. Validar inputs
    const budget = parseFloat(document.getElementById('budget-total').value);
    const goal = document.getElementById('main-goal').value;
    const location = document.getElementById('location-value').value || 'Brasil';
    const lpUrl = document.getElementById('lp-url').value;
    
    if (!budget || !goal || !lpUrl) {
      showError('❌ Preencha todos os campos obrigatórios');
      return;
    }
    
    // 2. Mostrar loading
    showLoading('⚙️ Gerando estratégia com IA...');
    
    // 3. Puxar contexto
    const context = pullContextFromLandingPage();
    
    // 4. Construir parâmetros
    const parameters = {
      budget: budget,
      goal: goal,
      location: location,
      lp_url: lpUrl
    };
    
    // 5. Gerar estratégia
    const strategy = await generateGAStrategy(context, parameters);
    
    // 6. Renderizar resultado
    renderGAStrategy(strategy);
    
    // 7. Adicionar botão de export
    addExportButton(strategy);
    
    // 8. Feedback
    showSuccess('✅ Estratégia gerada com sucesso!');
    
  } catch (error) {
    console.error('Erro:', error);
    showError(`❌ Erro: ${error.message}`);
  }
});

/**
 * Função auxiliar: mostrar loading
 */
function showLoading(message) {
  const loader = document.createElement('div');
  loader.id = 'ga-loader';
  loader.className = 'ga-loading';
  loader.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(loader);
}

/**
 * Função auxiliar: mostrar erro
 */
function showError(message) {
  console.error(message);
  alert(message);
  const loader = document.getElementById('ga-loader');
  if (loader) loader.remove();
}

/**
 * Função auxiliar: mostrar sucesso
 */
function showSuccess(message) {
  console.log(message);
  const loader = document.getElementById('ga-loader');
  if (loader) {
    loader.innerHTML = `<p>${message}</p>`;
    setTimeout(() => loader.remove(), 2000);
  }
}
```

---

## ✅ **Checklist Final**

- [ ] `generateGAStrategy()` implementada em `02-ga-api.js`
- [ ] System prompt cópia/colada corretamente
- [ ] `setSelectedGAModel()` funciona
- [ ] Handler do botão "Gerar Estratégia" em `01-ga-handlers.js`
- [ ] Função `renderGAStrategy()` já existe em `03-ga-ui.js`
- [ ] `addExportButton()` já existe em `03-ga-ui.js`
- [ ] `exportFullStrategyToCSV()` já existe em `04-ga-export.js`
- [ ] Testar fluxo completo: Input → IA → JSON → UI → CSV

---

**FIM DO DOCUMENTO COMPLEMENTAR**

Agora você tem TUDO para completar a implementação! 🚀
