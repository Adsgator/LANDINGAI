/* ============================================================
   LandingAI v2 — Integração com APIs de IA
   Padrão unificado OpenAI-compatible. Adicionar um provider novo
   = adicionar uma entrada em AI_MODELS com endpoint + auth corretos.
   ============================================================ */

Object.assign(window.App, {

  /* ----------------------------------------------------------
     Dispatcher principal — escolhe o adapter pelo provider
  ---------------------------------------------------------- */
  async callAI(prompt) {
    const model = AI_MODELS[this.state.selectedModel];
    if (!model) throw new Error(`Modelo "${this.state.selectedModel}" não encontrado.`);

    const apiKey = this.state.apiKeys[model.provider];
    if (!apiKey?.trim()) throw new Error(`Chave de API para ${model.provider} não configurada.`);

    // Gemini tem schema próprio — mantém adapter dedicado
    if (model.provider === 'gemini') return this._callGemini(prompt, model, apiKey.trim());

    // Claude tem schema próprio (messages + system separado)
    if (model.provider === 'claude') return this._callClaude(prompt, model, apiKey.trim());

    // Todos os outros (grok, openrouter, mistral, github) são OpenAI-compat
    return this._callOpenAICompat(prompt, model, apiKey.trim());
  },

  /* ----------------------------------------------------------
     Gemini (Google GenerativeLanguage API)
  ---------------------------------------------------------- */
  async _callGemini(prompt, model, apiKey) {
    const url = `${model.endpoint}?key=${apiKey}`;
    const body = {
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
  async _callClaude(prompt, model, apiKey) {
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
        system: 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
        messages: [{ role: 'user', content: prompt }],
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
  async _callOpenAICompat(prompt, model, apiKey) {
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
          content: 'Você é um especialista em landing pages de alta conversão para a agência Adsgator. Responda sempre em português brasileiro. Siga as instruções exatamente como especificadas.',
        },
        { role: 'user', content: prompt },
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
    const response = await fetch(\n      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`,
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
});