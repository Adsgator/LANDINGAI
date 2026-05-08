# 🔌 LANDINGAI — API Unificada (OpenAI/OpenRouter Pattern)

**Versão:** 2.0.4  
**Data:** 2026-05-08  
**Escopo:** Refatorar 02-api.js para usar padrão único, agnóstico de provedor

---

## 🎯 **Resumo Executivo**

**Problema Atual:**
- Lógicas específicas para cada IA (Gemini, Claude, Grok, Mistral)
- Código duplicado e difícil de manter
- Adicionar novo modelo = reescrever múltiplas funções
- Incompatível com novos provedores (OpenRouter, Hugging Face, etc)

**Solução:**
- Criar abstração única baseada em padrão OpenAI/OpenRouter
- Todos os modelos usam mesmo código, só mudam: `baseURL`, `apiKey`, `modelId`
- Adicionar novo modelo = 1 linha de config em `00-config.js`
- Suportar: Claude, Gemini, Grok, Mistral, OpenAI, OpenRouter, etc

**Tempo estimado:** 3-4 horas  
**Risco:** Médio (refatoração) mas com testes cobrindo regressão

---

## 📊 **Padrão OpenAI/OpenRouter**

Todos os provedores modernos implementam o padrão OpenAI (ou via OpenRouter):

```javascript
// Estrutura universal
const payload = {
  model: "claude-sonnet-4-20250514", // ID do modelo
  max_tokens: 1000,
  messages: [
    { role: "system", content: "..." },
    { role: "user", content: "..." }
  ]
};

const response = await fetch(`${baseURL}/v1/messages`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});
```

---

## 🔧 **Refatoração de 02-api.js**

### **Antes: Código Duplicado (Problema)**

```javascript
// Antiga abordagem — múltiplas funções
async function callGemini(prompt, apiKey) { /* ... */ }
async function callClaude(prompt, apiKey) { /* ... */ }
async function callGrok(prompt, apiKey) { /* ... */ }
async function callMistral(prompt, apiKey) { /* ... */ }
```

**Problemas:**
- 4x o código
- Lógica de error handling repetida
- Se muda endpoint do Gemini, precisa atualizar 1 função
- Novo modelo = novo função + testes

---

### **Depois: Função Universal (Solução)**

**Arquivo:** `assets/js/02-api.js`

Reescrever completamente com este padrão:

```javascript
/**
 * CONFIGURAÇÃO DE MODELOS
 * Centralizada em 00-config.js, mas usada aqui
 * Formato: { baseURL, apiKey, model }
 */

/**
 * Fazer requisição genérica para qualquer modelo
 * @param {object} options - Configurações
 * @returns {Promise<object>} Resposta da API
 */
async function callAI(options) {
  const {
    model = null,           // Ex: 'claude-sonnet-4', 'gemini-pro', etc
    messages = [],          // Array de { role, content }
    systemPrompt = '',      // Será convertido em primeira mensagem
    userPrompt = '',        // Será convertido em última mensagem
    temperature = 0.7,
    maxTokens = 2000,
    onProgress = null       // callback para streaming (opcional)
  } = options;

  // 1. Validar modelo selecionado
  if (!model) {
    throw new Error('Modelo não especificado. Configure em Settings > API');
  }

  const modelConfig = getModelConfig(model);
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
  if (systemPrompt && systemPrompt.trim()) {
    finalMessages.push({
      role: 'user',
      content: `INSTRUÇÕES: ${systemPrompt}`
    });
    finalMessages.push({
      role: 'assistant',
      content: 'Entendido. Vou seguir essas instruções.'
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

  // 5. Headers universais
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${modelConfig.apiKey}`
  };

  // 6. Headers adicionais por provedor (se necessário)
  if (modelConfig.provider === 'google') {
    // Gemini não usa Authorization, usa chave como parâmetro
    // Será tratado no baseURL
  }
  if (modelConfig.headers) {
    Object.assign(headers, modelConfig.headers);
  }

  // 7. Construir URL final
  let url = `${modelConfig.baseURL}/v1/messages`;

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
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      throw new Error(`Erro da API ${modelConfig.provider}: ${errorMessage}`);
    }

    const data = await response.json();

    // 10. Extrair conteúdo (padrão OpenAI/OpenRouter)
    const content = data.content?.[0]?.text || data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Resposta vazia da IA');
    }

    console.log(`✅ Resposta recebida de ${modelConfig.provider}`);

    return {
      model: modelConfig.model,
      provider: modelConfig.provider,
      content: content,
      raw: data
    };

  } catch (error) {
    console.error(`❌ Erro ao chamar ${modelConfig.provider}:`, error);
    throw error;
  }
}

/**
 * Obter configuração do modelo (baseURL, apiKey, etc)
 * @param {string} modelId - Ex: 'claude-sonnet-4'
 * @returns {object} Configuração completa
 */
function getModelConfig(modelId) {
  // Todos os modelos definidos em 00-config.js
  const modelMap = App.config.models;

  if (!modelMap[modelId]) {
    return null;
  }

  const config = modelMap[modelId];

  return {
    model: config.model || modelId,
    provider: config.provider,
    baseURL: config.baseURL,
    apiKey: localStorage.getItem(`api_key_${modelId}`) || config.apiKey || '',
    headers: config.headers || {}
  };
}

/**
 * Listar todos os modelos disponíveis
 * @returns {array} Lista de modelos com status
 */
function getAvailableModels() {
  return Object.keys(App.config.models).map(modelId => {
    const config = App.config.models[modelId];
    const hasKey = !!localStorage.getItem(`api_key_${modelId}`);

    return {
      id: modelId,
      name: config.name,
      provider: config.provider,
      configured: hasKey,
      freeModel: config.freeModel || false
    };
  });
}

/**
 * Testar conexão com modelo (verifica se API key é válida)
 * @param {string} modelId
 * @returns {Promise<object>} { ok: boolean, message: string }
 */
async function testModelConnection(modelId) {
  try {
    const response = await callAI({
      model: modelId,
      systemPrompt: 'Você é um assistente. Responda com a palavra "OK".',
      userPrompt: 'Teste',
      maxTokens: 10
    });

    return {
      ok: true,
      message: `✅ ${modelId} funcionando`,
      provider: response.provider
    };
  } catch (error) {
    return {
      ok: false,
      message: `❌ Erro com ${modelId}: ${error.message}`,
      error: error
    };
  }
}
```

---

## ⚙️ **Atualizar 00-config.js**

**Arquivo:** `assets/js/00-config.js`

Reformular configuração de modelos:

```javascript
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

  /**
   * Atualizar lista de modelos facilmente
   * Novo modelo = adicionar 1 objeto aqui
   */
  addModel: function(modelId, config) {
    this.models[modelId] = config;
  }
};
```

---

## 🔄 **Migração de Funções Antigas**

### Substituições

Se o código antigo usava:

```javascript
// ANTES
const result = await callGemini(prompt, apiKey);
const result = await callClaude(prompt, apiKey);
const result = await callGrok(prompt, apiKey);
```

**Trocar por:**

```javascript
// DEPOIS
const result = await callAI({
  model: 'gemini-2-flash',
  userPrompt: prompt
});

const result = await callAI({
  model: 'claude-sonnet-4',
  userPrompt: prompt
});

const result = await callAI({
  model: 'openrouter-grok-3',
  userPrompt: prompt
});
```

---

### Exemplo Prático: Geração de Estrutura

**Arquivo:** Onde a estrutura é gerada (estrutura.js ou handlers)

**ANTES:**
```javascript
async function generateEstructuraComIA(briefing) {
  const model = App.state.selectedModel; // Ex: 'claude'
  
  let response;
  if (model === 'claude') {
    response = await callClaude(prompt, apiKey);
  } else if (model === 'gemini') {
    response = await callGemini(prompt, apiKey);
  } else if (model === 'grok') {
    response = await callGrok(prompt, apiKey);
  }
  
  return response;
}
```

**DEPOIS:**
```javascript
async function generateEstructuraComIA(briefing) {
  const selectedModelId = App.state.selectedModel; // Ex: 'claude-sonnet-4'
  
  const response = await callAI({
    model: selectedModelId,
    systemPrompt: SYSTEM_PROMPT_ESTRUTURA,
    userPrompt: `Gerar estrutura: ${JSON.stringify(briefing)}`
  });
  
  return response.content;
}
```

---

## 📋 **Checklist de Implementação**

### Fase 1: Nova Função Universal
- [ ] `callAI()` implementada em `02-api.js`
- [ ] `getModelConfig()` implementada
- [ ] `getAvailableModels()` implementada
- [ ] `testModelConnection()` implementada

### Fase 2: Atualizar Configuração
- [ ] `00-config.js` reformulado com novo padrão
- [ ] Todos os 6 modelos listados com configurações corretas
- [ ] `addModel()` helper implementado

### Fase 3: Migração de Código
- [ ] Buscar todas as chamadas antigas (`callClaude`, `callGemini`, etc)
- [ ] Substituir por `callAI()`
- [ ] Deletar funções antigas (depois de verificar uso)
- [ ] Arquivos afetados:
  - [ ] `estrutura.js`
  - [ ] `review.js`
  - [ ] `step.js`
  - [ ] Qualquer outro que chame IA

### Fase 4: Testes
- [ ] Testar com cada modelo (6 testes)
- [ ] Testar error handling (API key inválida, modelo não existe, etc)
- [ ] Testar sistema prompt + user prompt
- [ ] Testar maxTokens variável

### Fase 5: Cleanup
- [ ] Deletar `callGemini()`, `callClaude()`, etc
- [ ] Remover imports/referencias antigas
- [ ] Verificar console para warnings

---

## 🧪 **Testes de Validação**

### Teste 1: Chamar Claude
```javascript
const response = await callAI({
  model: 'claude-sonnet-4',
  userPrompt: 'Qual é 2+2?'
});

// Esperado: resposta com content = "4"
console.assert(response.content.includes('4'));
```

### Teste 2: Chamar Gemini
```javascript
const response = await callAI({
  model: 'gemini-2-flash',
  userPrompt: 'Qual é 2+2?'
});

// Esperado: resposta com content = "4"
console.assert(response.content.includes('4'));
```

### Teste 3: Validar Model ID
```javascript
try {
  await callAI({
    model: 'modelo-inexistente',
    userPrompt: 'teste'
  });
  // Deve lançar erro
  console.assert(false, 'Deveria ter lançado erro');
} catch (e) {
  console.assert(e.message.includes('não configurado'));
}
```

### Teste 4: API Key Inválida
```javascript
localStorage.setItem('api_key_claude-sonnet-4', 'chave-falsa');

try {
  await callAI({
    model: 'claude-sonnet-4',
    userPrompt: 'teste'
  });
  // Deve falhar com erro da API
} catch (e) {
  console.assert(e.message.includes('Erro da API'));
}
```

### Teste 5: System + User Prompt
```javascript
const response = await callAI({
  model: 'claude-sonnet-4',
  systemPrompt: 'Você é um poeta. Responda em verso.',
  userPrompt: 'Escreva sobre JS'
});

// Esperado: resposta em formato poético
console.assert(response.content.length > 50);
```

---

## 🔗 **Integração com Outros Documentos**

- **Doc 2 (Estrutura):** Usar `callAI()` unificada em todos os prompts
- **Doc 3 (Restrições):** Passar restrições como systemPrompt
- **Doc 5 (Blindagem):** System Prompt blindado passa por `callAI()`
- **Doc 6 (Google Ads):** Usar mesmo padrão para gerar estratégias

---

## 📝 **Benefícios Imediatos**

✅ **Código mais limpo:** -300+ linhas de duplicação  
✅ **Fácil manutenção:** Mudança em um lugar afeta todos modelos  
✅ **Novo modelo = 1 linha:** Adicionar em `00-config.js`  
✅ **Suporta OpenRouter:** Acesso a 100+ modelos com 1 config  
✅ **Error handling unificado:** Mesmo tratamento para todos  
✅ **Testing simplificado:** Mock único para testar  

---

**FIM DO DOCUMENTO 4**
