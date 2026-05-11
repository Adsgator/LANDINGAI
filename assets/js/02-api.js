/* ============================================================
   LandingAI v2 — API Unificada (OpenAI/OpenRouter Pattern)
   ============================================================ */

Object.assign(window.App, {

  /**
   * Fazer requisição genérica para qualquer modelo
   * @param {object} options - Configurações
   * @returns {Promise<string>} Conteúdo da resposta (para compatibilidade com chamadas existentes)
   */
  async callAI(options) {
    // Se for string, converter para o novo formato
    if (typeof options === 'string') {
      options = { userPrompt: options };
    }

    const {
      model = this.state.selectedModel, // Pega do estado se não for passado
      messages = [],
      systemPrompt = '',
      userPrompt = '',
      temperature = 0.7,
      maxTokens = 2000,
    } = options;

    // 1. Validar modelo
    if (!model) {
      throw new Error('Modelo não especificado. Configure em Settings > API');
    }

    const modelConfig = this.getModelConfig(model);
    if (!modelConfig) {
      throw new Error(`Modelo "${model}" não configurado em 00-config.js`);
    }

    // 2. Validar API Key
    if (!modelConfig.apiKey || modelConfig.apiKey === '') {
      throw new Error(`API Key não configurada para ${model}. Configure em Settings > API`);
    }

    // 3. Construir array de mensagens
    let finalMessages = [];

    // Se passou systemPrompt, converter em primeira mensagem
    // Nota: O padrão Anthropic usa campo 'system' separado, mas o padrão OpenAI/OpenRouter 
    // aceita role: 'system'. Aqui seguimos o padrão de compatibilidade do doc.
    if (systemPrompt && systemPrompt.trim()) {
      finalMessages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Adicionar mensagens passadas
    finalMessages = finalMessages.concat(messages);

    // Se passou userPrompt, adicionar como última
    if (userPrompt && userPrompt.trim()) {
      finalMessages.push({
        role: 'user',
        content: userPrompt
      });
    }

    // Sanidade: precisa ter pelo menos 1 mensagem
    if (finalMessages.length === 0) {
      throw new Error('Nenhuma mensagem fornecida');
    }

    // 5. Headers universais
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${modelConfig.apiKey}`
    };

    // 6. Headers adicionais por provedor
    if (modelConfig.provider === 'anthropic') {
      headers['x-api-key'] = modelConfig.apiKey;
      headers['anthropic-version'] = '2023-06-01';
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
      delete headers['Authorization']; // Anthropic não usa Bearer
    }

    if (modelConfig.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://adsgator.com.br';
      headers['X-Title'] = 'LandingAI — Adsgator';
    }

    if (modelConfig.headers) {
      Object.assign(headers, modelConfig.headers);
    }

    // 7. Construir URL e Payload final
    let url = `${modelConfig.baseURL}/v1/messages`;
    let finalPayload = {
      model: modelConfig.model,
      messages: finalMessages,
      max_tokens: maxTokens,
      temperature: temperature
    };

    // Ajuste de endpoint para OpenAI/OpenRouter/Grok/Mistral
    if (['openai', 'openrouter', 'grok', 'mistral', 'github'].includes(modelConfig.provider)) {
      url = `${modelConfig.baseURL}/v1/chat/completions`;
    }

    // Para Claude (Anthropic), o system prompt é um campo separado no root
    if (modelConfig.provider === 'anthropic' && systemPrompt) {
      finalPayload.system = systemPrompt;
      // Remove do array de mensagens se for Anthropic
      finalPayload.messages = finalPayload.messages.filter(m => m.role !== 'system');
    }

    // Ajuste para Gemini (Google) - usar o endpoint NATIVO, não o wrapper OpenAI
    if (modelConfig.provider === 'google') {
      url = `${modelConfig.baseURL}/v1beta/models/${modelConfig.model}:generateContent?key=${modelConfig.apiKey}`;
      delete headers['Authorization'];
      
      // Construir payload no formato nativo do Gemini
      let systemInstruction;
      let contents = [];
      
      for (const m of finalMessages) {
        if (m.role === 'system') {
          systemInstruction = { parts: [{ text: m.content }] };
        } else {
          contents.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          });
        }
      }

      finalPayload = {
        contents: contents,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
          // Força JSON se o prompt pedir (ajuda na estabilidade)
          responseMimeType: (userPrompt.toLowerCase().includes('json') || systemPrompt.toLowerCase().includes('json')) 
                             ? "application/json" : "text/plain"
        }
      };
      
      if (systemInstruction) {
        finalPayload.systemInstruction = systemInstruction;
      }
    }

    // 8. Fazer requisição
    console.log(`📤 Chamando ${modelConfig.provider} (${modelConfig.model})...`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(finalPayload)
      });

      // 9. Tratar resposta
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        throw new Error(`Erro da API ${modelConfig.provider}: ${errorMessage}`);
      }

      const data = await response.json();

      // 10. Extrair conteúdo
      let content;
      if (modelConfig.provider === 'google') {
        // Extração do formato nativo Gemini
        content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } else {
        // Extração do formato OpenAI/Anthropic
        content = data.content?.[0]?.text || data.choices?.[0]?.message?.content;
      }

      if (!content) {
        console.error('Resposta da API sem texto:', data);
        
        // Verificar se houve bloqueio por segurança
        const safety = data.candidates?.[0]?.safetyRatings;
        if (safety) {
          console.warn('Filtro de segurança do Gemini:', safety);
        }

        const finishReason = data.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
          throw new Error(`A IA interrompeu a resposta prematuramente (Motivo: ${finishReason}). Tente um modelo mais potente ou reduza o briefing.`);
        }

        throw new Error('Resposta vazia da IA (conteúdo não encontrado no JSON da API)');
      }

      console.log(`✅ Resposta recebida de ${modelConfig.provider}`);

      // Retorna apenas o conteúdo para manter compatibilidade com o resto do app
      return content;

    } catch (error) {
      console.error(`❌ Erro ao chamar ${modelConfig.provider}:`, error);
      throw error;
    }
  },

  /**
   * Obter configuração do modelo (baseURL, apiKey, etc)
   * @param {string} modelId - Ex: 'claude-sonnet-4'
   * @returns {object} Configuração completa
   */
  getModelConfig(modelId) {
    const modelMap = this.config.models;

    if (!modelMap[modelId]) {
      return null;
    }

    const config = modelMap[modelId];

    // Tenta pegar a chave específica do modelo ou a chave geral do provedor (legado)
    let apiKey = localStorage.getItem(`api_key_${modelId}`) || 
                 this.state.apiKeys[config.provider] || 
                 config.apiKey || '';

    return {
      model: config.model || modelId,
      provider: config.provider,
      baseURL: config.baseURL,
      apiKey: apiKey,
      headers: config.headers || {}
    };
  },

  /**
   * Listar todos os modelos disponíveis
   * @returns {array} Lista de modelos com status
   */
  getAvailableModels() {
    return Object.keys(this.config.models).map(modelId => {
      const config = this.config.models[modelId];
      const hasKey = !!(localStorage.getItem(`api_key_${modelId}`) || this.state.apiKeys[config.provider]);

      return {
        id: modelId,
        name: config.name,
        provider: config.provider,
        configured: hasKey,
        freeModel: config.freeModel || false,
        info: config.info
      };
    });
  },

  /**
   * Testar conexão com modelo
   */
  async testModelConnection(modelId) {
    try {
      const response = await this.callAI({
        model: modelId,
        systemPrompt: 'Você é um assistente. Responda com a palavra "OK".',
        userPrompt: 'Teste',
        maxTokens: 10
      });

      return {
        ok: true,
        message: `✅ ${modelId} funcionando`,
        content: response
      };
    } catch (error) {
      return {
        ok: false,
        message: `❌ Erro com ${modelId}: ${error.message}`,
        error: error
      };
    }
  },

  /* ----------------------------------------------------------
     Gemini Image (geração de protótipos visuais)
  ---------------------------------------------------------- */
  async callGeminiImage(prompt) {
    const key = this.state.apiKeys?.gemini?.trim();
    if (!key) throw new Error('API Key Gemini não configurada.');

    // Usa flash-exp que suporta responseModalities IMAGE
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            temperature: 1,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Erro Gemini Image');
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error('Gemini não retornou imagem. Verifique se sua chave suporta geração de imagens (precisa de faturamento ativo no Google AI Studio).');
  },

  /**
   * Gerar estrutura com retry automático se restrições forem violadas
   */
  async generateEstruturaComRetry(briefing, systemPrompt, userPrompt, maxRetries = 2) {
    let tentativa = 0;
    let resultado;
    let validacao;
    let restricoes = this.normalizeRestricoes(briefing.restricoes);

    while (tentativa < maxRetries) {
      tentativa++;
      console.log(`📝 Gerando estrutura (tentativa ${tentativa}/${maxRetries})...`);

      // Gerar
      const response = await this.callAI({
        systemPrompt: systemPrompt + (tentativa > 1 ? `\n\n⚠️ REGENERAÇÃO: Na tentativa anterior, você violou as restrições. POR FAVOR, seja extremamente rigoroso agora.` : ''),
        userPrompt: userPrompt,
        maxTokens: 8192
      });

      // Extrair JSON do response
      let jsonText = response.trim();
      const match = jsonText.match(/\{[\s\S]*\}/);
      if (match) jsonText = match[0];
      
      try {
        resultado = this.robustParseJSON ? this.robustParseJSON(jsonText) : JSON.parse(jsonText);
      } catch (e) {
        console.error('Erro no parse do JSON da estrutura:', e);
        throw e;
      }
      
      // Validar
      const textoCompleto = this.extrairTextoJson(resultado);
      validacao = this.validateCopyComRestricoes(textoCompleto, restricoes);

      if (validacao.valido) {
        console.log(`✅ Validado na tentativa ${tentativa}`);
        return { resultado, validacao, tentativas: tentativa };
      }

      if (tentativa < maxRetries) {
        console.log(`⚠️ Restrições violadas. Regenerando...`);
      }
    }

    // Se chegou aqui, falhou em todas as tentativas
    console.warn(`❌ Não conseguiu gerar respeitando restrições após ${maxRetries} tentativas`);
    return { 
      resultado, 
      validacao, 
      tentativas: tentativa,
      aviso: 'Restrições não foram 100% respeitadas. Por favor, revise manualmente.'
    };
  },

  /* ----------------------------------------------------------
     SISTEMA DE RESTRIÇÕES (Filtro Negativo)
  ---------------------------------------------------------- */

  /**
   * Normalizar restrições do briefing
   * Transforma em lista de palavras-chave a evitar
   */
  normalizeRestricoes(restricoes) {
    if (!restricoes || restricoes.trim() === '') {
      return {
        palavras_proibidas: [],
        tons_proibidos: [],
        topicos_proibidos: [],
        estilos_proibidos: [],
        raw: ''
      };
    }

    const text = restricoes.toLowerCase().trim();
    
    // Mapear padrões conhecidos
    const tonsProibidos = [];
    const palavrasProibidas = [];
    const topicosProibidos = [];
    const estilosProibidos = [];

    // Detectar tons
    if (text.includes('agressivo')) tonsProibidos.push('agressivo');
    if (text.includes('emocional') || text.includes('storytelling')) tonsProibidos.push('narrativo');
    if (text.includes('técnico') || text.includes('jargão')) tonsProibidos.push('técnico');
    if (text.includes('casual') || text.includes('descontraído')) tonsProibidos.push('casual');
    if (text.includes('formal') || text.includes('corporativo')) tonsProibidos.push('formal');

    // Extrair palavras entre "evitar", "não", "proibido"
    const frases = text.split(/,|;|\n/);
    frases.forEach(frase => {
      const trimmed = frase.trim();
      
      // Padrão: "evitar [palavra]" ou "não [palavra]" ou "sem [palavra]"
      const matchEvitar = trimmed.match(/evitar\s+(.+?)$/);
      const matchNao = trimmed.match(/não\s+(.+?)$/);
      const matchSem = trimmed.match(/sem\s+(.+?)$/);
      
      if (matchEvitar) palavrasProibidas.push(matchEvitar[1].trim());
      if (matchNao) palavrasProibidas.push(matchNao[1].trim());
      if (matchSem) palavrasProibidas.push(matchSem[1].trim());
    });

    // Detectar tópicos proibidos
    if (text.includes('concorrente')) topicosProibidos.push('concorrentes');
    if (text.includes('preço') || text.includes('custo')) topicosProibidos.push('preços');
    if (text.includes('política')) topicosProibidos.push('política');
    if (text.includes('religião')) topicosProibidos.push('religião');

    return {
      palavras_proibidas: [...new Set(palavrasProibidas)], // remover duplicatas
      tons_proibidos: tonsProibidos,
      topicos_proibidos: topicosProibidos,
      estilos_proibidos: estilosProibidos,
      raw: restricoes
    };
  },

  /**
   * Constrói bloco de prompt de restrições para injetar no System Prompt
   */
  buildRestricoesPrompt(restricoesRaw) {
    const restricoes = this.normalizeRestricoes(restricoesRaw);
    if (!restricoesRaw) return '';

    return `
## RESTRIÇÕES OBRIGATÓRIAS (Respeite 100%)

### Palavras Proibidas (NUNCA use estas):
${restricoes.palavras_proibidas.length > 0 ? restricoes.palavras_proibidas.map(p => `- "${p}"`).join('\n') : '- Nenhuma específica'}

### Tons Proibidos (EVITE estes estilos):
${restricoes.tons_proibidos.length > 0 ? restricoes.tons_proibidos.map(t => `- ${t}`).join('\n') : '- Nenhum específico'}

### Tópicos Proibidos (NÃO mencione):
${restricoes.topicos_proibidos.length > 0 ? restricoes.topicos_proibidos.map(t => `- ${t}`).join('\n') : '- Nenhum específico'}

### Restrições Customizadas:
${restricoes.raw}

## VALIDAÇÃO FINAL
Antes de devolver a resposta, faça uma checklist:
- [ ] Nenhuma palavra proibida aparece
- [ ] Tom está dentro dos permitidos
- [ ] Nenhum tópico proibido foi mencionado
- [ ] Se falhar em qualquer item, REESCREVA a seção afetada.
`;
  },

  /**
   * Construir System Prompt com todas as regras rígidas
   * @param {object} briefing - Dados do cliente
   * @param {string} tipoGerada - 'estrutura', 'copy_hero', 'copy_completa', etc
   * @returns {string} System Prompt completo
   */
  buildBlindedSystemPrompt(briefing, tipoGerada = 'estrutura') {
    const basePrompt = `# LANDINGAI — Sistema de Geração Blindado

Você é um especialista em landing pages para prestadores de serviço. 
Sua resposta DEVE seguir EXATAMENTE estas 10 regras.

## ⚠️ REGRAS OBRIGATÓRIAS

1. **TAILWIND CSS — APENAS REM, NUNCA PX**
   - Se usar valores absolutos: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem
   - Prefira Tailwind nativo: p-4 (= 1rem), mt-12 (= 3rem), etc
   - VALIDAÇÃO: Procurar em sua resposta por "px" — se encontrar, é FALHA

2. **SEM PLACEHOLDERS NO HTML**
   - Nada de [INSERIR], {{variável}}, [IMAGEM], [COPY]
   - TODO conteúdo deve ser REAL
   - Se não tem info, usar valor padrão ou deixar vazio
   - VALIDAÇÃO: Se há [, {{, ou ]], é FALHA

3. **COPY DEVE TER ESTRUTURA: Problema → Solução → Benefícios → Prova → CTA**
   - Não é narrativa, é venda consciente
   - Informativo + empático
   - VALIDAÇÃO: Cada seção deve existir e ser clara

4. **CTAs ESPECÍFICAS, NÃO GENÉRICAS**
   - "Agendar Consulta" ≠ "Clique aqui"
   - "Baixar Guia" ≠ "Saiba mais"
   - VALIDAÇÃO: CTA deve ter verbo + objeto

5. **RESPEITAR LIMITE DE CARACTERES**
   - H1/H2: ≤70 chars
   - Descrição: ≤160 chars
   - Button: ≤30 chars
   - VALIDAÇÃO: Contar caracteres antes de devolver

6. **IMAGENS COM PLACEHOLDER CORRETO**
   - Se não há imagem real: /img/placeholder-16-9.jpg
   - Sempre ter atributo alt descritivo
   - NUNCA inventar URLs
   - VALIDAÇÃO: Toda tag <img> deve ter alt e src válido

7. **LINKS VÁLIDOS**
   - href="#" ou URL real
   - Nunca href="" ou href="[link]"
   - VALIDAÇÃO: Todo href deve ter valor

8. **ACESSIBILIDADE IMPLEMENTADA**
   - Toda <img> com alt
   - Toda <form> com <label>
   - Usar <header>, <main>, <footer>, <section>
   - VALIDAÇÃO: Conferir presença de elementos semânticos

9. **RESPONSIVE TAILWIND**
   - Mobile-first
   - Usar sm:, md:, lg:, xl:
   - VALIDAÇÃO: Deve ter classes responsivas

10. **METATAGS CORRETAS**
    - <title> ≤60 chars e único
    - <meta description> ≤160 chars
    - <h1> apareça exatamente 1x
    - VALIDAÇÃO: Estrutura HTML válida

---

## 📋 CONTEXTO DO CLIENTE

Cliente: ${briefing.nome_cliente || briefing.cliente || '—'}
Serviço: ${briefing.servico || briefing.segmento || '—'}
Persona: ${briefing.persona_principal || briefing.publico_primario || '—'}
Tom: ${briefing.tom_marca || briefing.estilo_desejado || 'Profissional + acessível'}
Restrições: ${briefing.restricoes || 'Nenhuma'}

---

## ⚠️ ANTES DE DEVOLVER, FAÇA CHECKLIST:

- [ ] Procurei a resposta por "px" — NENHUM encontrado
- [ ] Procurei por "[", "{{", "]" — NENHUM encontrado
- [ ] Procurei por travessão (—) — NENHUM encontrado na copy
- [ ] Toda imagem tem alt descritivo
- [ ] Todo CTA é específica e clara
- [ ] Copy tem 5 seções: Problema, Solução, Benefícios, Prova, CTA
- [ ] Tailwind classes seguem convenção (p-4, not p-1rem)
- [ ] <h1> aparece exatamente 1 vez
- [ ] Não há links vazios (href="")
- [ ] Sem jargão técnico não explicado
- [ ] Estrutura semântica (header, main, footer)
- [ ] Copy é natural e conversacional, sem artificialismos

Se NÃO passou em TODOS os itens, REESCREVA antes de responder.

---

## 📝 TIPO DE GERAÇÃO: ${tipoGerada.toUpperCase()}

${this.getTipoeGeracaoEspecifica(tipoGerada)}

---`;

    return basePrompt;
  },

  /**
   * Regras específicas por tipo de geração
   */
  getTipoeGeracaoEspecifica(tipo) {
    const regras = {
      'estrutura': `
### Para ESTRUTURA da LP:
- Usar a tabela de blocos fornecida
- Gerar JSON com array de blocos
- Cada bloco ter: id, nome, tipo, copy, estrutura HTML
- Validar TODAS as 10 regras acima para cada bloco`,

      'copy_hero': `
### Para COPY DO HERO:
- H1 ≤70 chars focada na DOR #1
- Subheading até 160 chars com benefício
- 1 CTA clara e específica
- Imagem responsiva com alt
- Fundo com Tailwind (gradiente ou cor)`,

      'copy_completa': `
### Para COPY COMPLETA DE SEÇÃO:
- Seguir estrutura: Problema → Solução → Benefícios → Prova → CTA
- Cada subsection com heading (h2/h3)
- Mínimo 3 benefícios listados
- Incluir prova social (número, depoimento, ou credencial)
- CTA no final com botão específico`,

      'json_estrutura': `
### Para JSON DE ESTRUTURA:
- Formato: { blocos: [ { id, nome, tipo, copy, html, regras } ] }
- Cada bloco DEVE cumprir as 10 regras
- Incluir campo "validacao" com checklist`,

      'default': `
### Aplicar as 10 regras universalmente`
    };

    return regras[tipo] || regras['default'];
  }
});