/* ============================================================
   LandingAI v2 — Integração com APIs de IA
   ============================================================ */

Object.assign(window.App, {
  async callAI(prompt) {
    const model = AI_MODELS[this.state.selectedModel];
    if (!model) throw new Error(`Modelo ${this.state.selectedModel} não encontrado.`);

    const apiKey = this.state.apiKeys[model.provider];
    if (!apiKey?.trim()) throw new Error(`Chave de API para ${model.provider} não configurada.`);

    switch (model.provider) {
      case 'gemini':      return this._callGemini(prompt, model, apiKey);
      case 'claude':      return this._callClaude(prompt, model, apiKey);
      case 'grok':        return this._callOpenAICompat(prompt, model, apiKey);
      case 'mistral':     return this._callMistral(prompt, model, apiKey);
      case 'openrouter':  return this._callOpenRouter(prompt, model, apiKey);
      default: throw new Error(`Provider "${model.provider}" não implementado.`);
    }
  },

  async _callGemini(prompt, model, apiKey) {
    const response = await fetch(`${model.endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Resposta vazia do Gemini.');
    return text;
  },

  async _callClaude(prompt, model, apiKey) {
    // Mapa de IDs internos → IDs reais da API Anthropic
    const MODEL_IDS = {
      'claude-sonnet-4': 'claude-sonnet-4-5-20251001',
      'claude-opus-4':   'claude-opus-4-6',
      'claude-haiku-4':  'claude-haiku-4-5-20251001',
    };
    const realModelId = MODEL_IDS[this.state.selectedModel] || this.state.selectedModel;

    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model:       realModelId,
        max_tokens:  model.maxTokens,
        temperature: model.temp,
        system: 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) throw new Error('Resposta vazia do Claude.');
    return text;
  },

  async _callMistral(prompt, model, apiKey) {
    const key = apiKey || this.state.apiKeys['mistral'];
    if (!key) throw new Error('API Key Mistral não configurada.');

    const resp = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: model.temp || 0.7
      })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || `Erro Mistral: ${resp.status}`);
    }

    const data = await resp.json();
    return data.choices[0].message.content;
  },

  async _callOpenRouter(prompt, model, apiKey) {
    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  `Bearer ${apiKey}`,
        'HTTP-Referer':   'https://adsgator.com.br',
        'X-Title':        'LandingAI — Adsgator',
      },
      body: JSON.stringify({
        model:       model.model,
        max_tokens:  model.maxTokens,
        temperature: model.temp,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${response.status}`;
      throw new Error(`OpenRouter: ${msg}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Resposta vazia do OpenRouter.');
    return text;
  },

  async _callOpenAICompat(prompt, model, apiKey) {
    const isOpenRouter = model.provider === 'openrouter';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    if (isOpenRouter) {
      headers['HTTP-Referer'] = window.location.origin;
      headers['X-Title'] = 'LandingAI v2';
    }

    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: model.model || model.id,
        max_tokens: model.maxTokens,
        temperature: model.temp,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || `HTTP ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error(`Resposta vazia de ${model.label}.`);
    return text;
  }
});
