/* ============================================================
   LandingAI v2 — Integração com APIs de IA
   Padrão unificado OpenAI-compatible. Adicionar um provider novo
   = adicionar uma entrada em AI_MODELS com endpoint + auth corretos.
   ============================================================ */

Object.assign(window.App, {

  /* ----------------------------------------------------------
     Dispatcher principal — escolhe o adapter pelo provider
  ---------------------------------------------------------- */
  async callAI(payload) {
    let systemPrompt = '';
    let userPrompt = '';

    if (typeof payload === 'string') {
      userPrompt = payload;
    } else {
      systemPrompt = payload.systemPrompt || '';
      userPrompt = payload.userPrompt || '';
    }

    const model = AI_MODELS[this.state.selectedModel];
    if (!model) throw new Error(`Modelo "${this.state.selectedModel}" não encontrado.`);

    const apiKey = this.state.apiKeys[model.provider];
    if (!apiKey?.trim()) throw new Error(`Chave de API para ${model.provider} não configurada.`);

    // Gemini tem schema próprio — mantém adapter dedicado
    if (model.provider === 'gemini') return this._callGemini(userPrompt, systemPrompt, model, apiKey.trim());

    // Claude tem schema próprio (messages + system separado)
    if (model.provider === 'claude') return this._callClaude(userPrompt, systemPrompt, model, apiKey.trim());

    // Todos os outros (grok, openrouter, mistral, github) são OpenAI-compat
    return this._callOpenAICompat(userPrompt, systemPrompt, model, apiKey.trim());
  },

  /* ----------------------------------------------------------
     Gemini (Google GenerativeLanguage API)
  ---------------------------------------------------------- */
  async _callGemini(userPrompt, systemPrompt, model, apiKey) {
    const url = `${model.endpoint}?key=${apiKey}`;
    
    // Concatena system + user para Gemini se não houver campo system dedicado no endpoint v1/models
    const fullText = systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt;

    const body = {
      contents: [{ parts: [{ text: fullText }] }],
      generationConfig: {
        maxOutputTokens: model.maxTokens,
        temperature: model.temp,
        topP: 0.95,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Resposta vazia do Gemini.');
    return text;
  },

  /* ----------------------------------------------------------
     Claude / Anthropic Messages API
  ---------------------------------------------------------- */
  async _callClaude(userPrompt, systemPrompt, model, apiKey) {
    // Mapa de IDs internos → IDs reais da API Anthropic
    const MODEL_IDS = {
      'claude-sonnet-4': 'claude-sonnet-4-5',
      'claude-opus-4': 'claude-opus-4-5',
      'claude-haiku-4': 'claude-haiku-4-5',
    };
    const realModelId = MODEL_IDS[this.state.selectedModel] || model.model || this.state.selectedModel;

    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: realModelId,
        max_tokens: model.maxTokens,
        temperature: model.temp,
        system: systemPrompt || 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Claude HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error('Resposta vazia do Claude.');
    return text;
  },

  /* ----------------------------------------------------------
     OpenAI-compatible (Grok, OpenRouter, Mistral, GitHub Models)
     Um único adapter para todos — só muda endpoint + auth header.
  ---------------------------------------------------------- */
  async _callOpenAICompat(userPrompt, systemPrompt, model, apiKey) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // Headers extras específicos do OpenRouter
    if (model.provider === 'openrouter') {
      headers['HTTP-Referer'] = 'https://adsgator.com.br';
      headers['X-Title'] = 'LandingAI — Adsgator';
    }

    const body = {
      model: model.model || model.id,
      max_tokens: model.maxTokens,
      temperature: model.temp,
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
        },
        { role: 'user', content: userPrompt },
      ],
    };

    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${response.status}`;
      throw new Error(`[${model.label}] ${msg}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error(`Resposta vazia de ${model.label}.`);
    return text;
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