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

    // 4. Construir payload
    const payload = {
      model: modelConfig.model,
      messages: finalMessages,
      max_tokens: maxTokens,
      temperature: temperature
    };

    // Para Claude (Anthropic), o system prompt é um campo separado no root
    if (modelConfig.provider === 'anthropic' && systemPrompt) {
      payload.system = systemPrompt;
      // Remove do array de mensagens se for Anthropic
      payload.messages = payload.messages.filter(m => m.role !== 'system');
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

    // 7. Construir URL final
    let url = `${modelConfig.baseURL}/v1/messages`;
    
    // Ajuste de endpoint para OpenAI/OpenRouter/Grok/Mistral
    if (['openai', 'openrouter', 'grok', 'mistral', 'github'].includes(modelConfig.provider)) {
      url = `${modelConfig.baseURL}/v1/chat/completions`;
    }

    // Ajuste para Gemini (Google) - usa ?key= na URL
    if (modelConfig.provider === 'google') {
      // O endpoint v1beta/openai suporta o formato OpenAI
      url = `${modelConfig.baseURL}/v1beta/openai/chat/completions?key=${modelConfig.apiKey}`;
      delete headers['Authorization'];
    }

    // 8. Fazer requisição
    console.log(`📤 Chamando ${modelConfig.provider} (${modelConfig.model})...`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      // 9. Tratar resposta
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        throw new Error(`Erro da API ${modelConfig.provider}: ${errorMessage}`);
      }

      const data = await response.json();

      // 10. Extrair conteúdo (padrão OpenAI/OpenRouter/Anthropic)
      const content = data.content?.[0]?.text || data.choices?.[0]?.message?.content;

      if (!content) {
        console.error('Resposta da API:', data);
        throw new Error('Resposta vazia da IA');
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
        userPrompt: userPrompt
      });

      // Extrair JSON do response
      let jsonText = response.trim();
      const match = jsonText.match(/\{[\s\S]*\}/);
      if (match) jsonText = match[0];
      resultado = JSON.parse(jsonText);
      
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
  }
});