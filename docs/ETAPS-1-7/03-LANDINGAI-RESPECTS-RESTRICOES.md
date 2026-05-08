# 🚫 LANDINGAI — Respeitar Campo "Restrições (O Que Evitar)"

**Versão:** 2.0.3  
**Data:** 2026-05-08  
**Escopo:** Implementar filtro negativo para excluir restrições da copy gerada

---

## 🎯 **Resumo Executivo**

**Problema Atual:**
- Campo "Restrições (o que evitar)" está sendo INCLUÍDO na copy da landing page
- Deveria ser um filtro negativo (blacklist de palavras/estilos/abordagens)
- Exemplo: Cliente coloca "Evitar tons agressivos" → IA ignora e usa tom agressivo

**Solução:**
- Extrair restrições do briefing em etapa separada
- Criar sistema de validação pós-geração (filtro)
- Garantir que restrições NUNCA aparecem na copy final
- Adicionar validação automática antes de exibir ficha

**Tempo estimado:** 2-3 horas  
**Risco:** Baixo (validação apenas, não altera fluxo core)

---

## 📋 **Como o Campo Funciona Atualmente**

**Localização:** `estrutura.js` → Tela "Tom e Identidade"

**Campo no formulário:**
```html
<textarea 
  id="restricoes" 
  placeholder="Ex: Evitar tom agressivo, não mencionar concorrentes, sem palavras em inglês..."
/>
```

**Armazenagem em estado:**
```javascript
App.state.briefing.restricoes = "Evitar tom agressivo, não mencionar preços baixos, sem jargão"
```

**Problema:** Quando a IA gera a copy, esse campo é passado como **contexto** mas não é respeitado como **regra obrigatória**.

---

## 🔧 **Solução: Sistema de Filtro Negativo**

### **Passo 1: Extrair e Normalizar Restrições**

**Arquivo:** `assets/js/02-api.js`

Adicionar função para processar restrições:

```javascript
/**
 * Normalizar restrições do briefing
 * Transforma em lista de palavras-chave a evitar
 * @param {string} restricoes - Campo texto do briefing
 * @returns {object} Estrutura de restrições normalizada
 */
function normalizeRestricoes(restricoes) {
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
}
```

---

### **Passo 2: Passar Restrições para o Prompt da IA**

**Arquivo:** `assets/js/02-api.js`

Modificar função que chama a IA para estrutura/copy:

```javascript
/**
 * Gerar estrutura da LP com restrições respeitadas
 */
async function generateEstruturaComRestricoes(briefing) {
  // 1. Normalizar restrições
  const restricoes = normalizeRestricoes(briefing.restricoes);
  
  // 2. Construir system prompt com regras
  const systemPrompt = `
Você é um especialista em landing pages para prestadores de serviço.

## RESTRIÇÕES OBRIGATÓRIAS (Respeite 100%)

### Palavras Proibidas (NUNCA use estas):
${restricoes.palavras_proibidas.map(p => `- "${p}"`).join('\n')}

### Tons Proibidos (EVITE estes estilos):
${restricoes.tons_proibidos.map(t => `- ${t}`).join('\n')}

### Tópicos Proibidos (NÃO mencione):
${restricoes.topicos_proibidos.map(t => `- ${t}`).join('\n')}

### Restrições Customizadas:
${restricoes.raw}

## VALIDAÇÃO FINAL

Antes de devolver o JSON, faça uma checklist:
- [ ] Nenhuma palavra proibida aparece
- [ ] Tom está dentro dos permitidos
- [ ] Nenhum tópico proibido foi mencionado
- [ ] Se falhar em qualquer item, REESCREVA a seção

`;

  // 3. Chamar API normalmente, mas com system prompt aprimorado
  const response = await callAI({
    systemPrompt: systemPrompt,
    userPrompt: `Gerar estrutura baseada neste briefing: ${JSON.stringify(briefing)}`,
    // ... resto dos parâmetros
  });

  return response;
}
```

---

### **Passo 3: Validar Copy ANTES de Exibir**

**Arquivo:** `assets/js/03-ui.js`

Adicionar função de validação:

```javascript
/**
 * Validar se copy respeita as restrições
 * @param {string} copy - Conteúdo gerado
 * @param {array} restricoes - Lista de restrições
 * @returns {object} { valido: boolean, violacoes: array }
 */
function validateCopyComRestricoes(copy, restricoes) {
  const violacoes = [];
  const copyLower = copy.toLowerCase();

  // 1. Verificar palavras proibidas
  restricoes.palavras_proibidas.forEach(palavra => {
    const regex = new RegExp(`\\b${palavra}\\b`, 'gi');
    const matches = copy.match(regex);
    if (matches) {
      violacoes.push({
        tipo: 'palavra_proibida',
        palavra: palavra,
        ocorrencias: matches.length
      });
    }
  });

  // 2. Verificar tons proibidos (detecção por padrão)
  if (restricoes.tons_proibidos.includes('agressivo')) {
    const palavrasAgressivas = ['destruir', 'acabar', 'eliminar', 'matar', '!!!'];
    palavrasAgressivas.forEach(palavra => {
      if (copyLower.includes(palavra)) {
        violacoes.push({
          tipo: 'tom_proibido',
          tom: 'agressivo',
          marcador: palavra
        });
      }
    });
  }

  if (restricoes.tons_proibidos.includes('narrativo')) {
    // Detectar se há storytelling
    const narrativeMarkers = ['era uma vez', 'o cliente nos procurou', 'começou'];
    narrativeMarkers.forEach(marker => {
      if (copyLower.includes(marker)) {
        violacoes.push({
          tipo: 'tom_proibido',
          tom: 'narrativo',
          marcador: marker
        });
      }
    });
  }

  // 3. Verificar tópicos proibidos
  restricoes.topicos_proibidos.forEach(topico => {
    const regex = new RegExp(`\\b${topico}\\b`, 'gi');
    if (copy.match(regex)) {
      violacoes.push({
        tipo: 'topico_proibido',
        topico: topico
      });
    }
  });

  return {
    valido: violacoes.length === 0,
    violacoes: violacoes,
    score: 100 - (violacoes.length * 10) // score de compliance
  };
}
```

---

### **Passo 4: Exibir Avisos se Houver Violações**

**Arquivo:** `assets/js/04-handlers.js`

Modificar função que exibe a ficha gerada:

```javascript
// Quando a IA termina de gerar e exibe o resultado:
async function exibirFichaGerada(ficha) {
  // 1. Normalizar restrições do state
  const restricoes = normalizeRestricoes(App.state.briefing.restricoes);
  
  // 2. Extrair todo o texto da ficha
  const textoCompleto = extrairTextoJson(ficha); // função que junta todo conteúdo
  
  // 3. Validar
  const validacao = validateCopyComRestricoes(textoCompleto, restricoes);
  
  // 4. Se houver violações, mostrar aviso
  if (!validacao.valido) {
    const aviso = document.createElement('div');
    aviso.className = 'alert alert-warning';
    aviso.innerHTML = `
      <strong>⚠️ Atenção: Restrições não foram totalmente respeitadas</strong>
      <p>A IA incluiu conteúdo que viola as restrições:</p>
      <ul>
        ${validacao.violacoes.map(v => `
          <li>
            <strong>${v.tipo}:</strong> 
            ${v.palavra || v.topico || v.marcador}
            ${v.ocorrencias ? `(${v.ocorrencias}x)` : ''}
          </li>
        `).join('')}
      </ul>
      <p><strong>Ação recomendada:</strong> 
        <button onclick="regenerarComRestricoes()">Regenerar respeitando restrições</button>
        ou 
        <button onclick="editarManualmente()">Editar manualmente</button>
      </p>
    `;
    
    // Inserir aviso no topo da ficha
    document.getElementById('ficha-container').insertBefore(
      aviso, 
      document.getElementById('ficha-container').firstChild
    );
  } else {
    // Mostrar sucesso
    console.log(`✅ Copy validada! Score de compliance: ${validacao.score}%`);
  }
  
  // 5. Exibir ficha normalmente
  renderizarFicha(ficha);
}

function extrairTextoJson(obj) {
  // Extrair todos os valores string do JSON
  const texts = [];
  
  function walk(item) {
    if (typeof item === 'string') {
      texts.push(item);
    } else if (Array.isArray(item)) {
      item.forEach(walk);
    } else if (typeof item === 'object' && item !== null) {
      Object.values(item).forEach(walk);
    }
  }
  
  walk(obj);
  return texts.join(' ');
}
```

---

### **Passo 5: Auto-Correção (Opcional mas Recomendado)**

**Arquivo:** `assets/js/02-api.js`

Adicionar lógica de retry automático:

```javascript
/**
 * Gerar estrutura com retry automático se restrições forem violadas
 */
async function generateEstruturaComRetry(briefing, maxRetries = 2) {
  let tentativa = 0;
  let resultado;
  let validacao;
  let restricoes = normalizeRestricoes(briefing.restricoes);

  while (tentativa < maxRetries) {
    tentativa++;
    console.log(`📝 Gerando estrutura (tentativa ${tentativa}/${maxRetries})...`);

    // Gerar
    resultado = await generateEstruturaComRestricoes(briefing);
    
    // Validar
    const textoCompleto = extrairTextoJson(resultado);
    validacao = validateCopyComRestricoes(textoCompleto, restricoes);

    if (validacao.valido) {
      console.log(`✅ Validado na tentativa ${tentativa}`);
      return { resultado, validacao, tentativas: tentativa };
    }

    if (tentativa < maxRetries) {
      console.log(`⚠️ Restrições violadas. Regenerando...`);
      // Adicionar ao prompt da próxima tentativa:
      briefing._retry_violations = validacao.violacoes;
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
}
```

---

## 📋 **Checklist de Implementação**

### Fase 1: Funções Base
- [ ] `normalizeRestricoes()` implementada em `02-api.js`
- [ ] `validateCopyComRestricoes()` implementada em `03-ui.js`
- [ ] `extrairTextoJson()` implementada em `04-handlers.js`

### Fase 2: Integração com IA
- [ ] System prompt aprimorado com regras de restrição
- [ ] `generateEstruturaComRestricoes()` chamada no fluxo correto
- [ ] Função `exibirFichaGerada()` modificada para validar

### Fase 3: UX/Avisos
- [ ] Aviso visual quando há violações
- [ ] Botão "Regenerar" funciona
- [ ] Botão "Editar manualmente" permite correção manual

### Fase 4: Retry Automático (Opcional)
- [ ] `generateEstruturaComRetry()` implementada
- [ ] Retry automático testado com briefings contendo restrições

---

## 🧪 **Testes de Validação**

### Teste 1: Palavra Proibida
```
Briefing:
- restricoes: "Evitar a palavra 'premium'"
- resultado: IA gera copy mencionando "premium"

Esperado: ⚠️ Aviso exibido, marcando violação
```

### Teste 2: Tom Proibido
```
Briefing:
- restricoes: "Evitar tom agressivo"
- resultado: IA gera "Destrua seus problemas!!!"

Esperado: ⚠️ Aviso exibido, sugerindo regeneração
```

### Teste 3: Tópico Proibido
```
Briefing:
- restricoes: "Não mencionar preços"
- resultado: IA menciona "A partir de R$ 299"

Esperado: ⚠️ Aviso exibido
```

### Teste 4: Sem Violações
```
Briefing:
- restricoes: "Evitar jargão técnico"
- resultado: IA gera copy clara e simples

Esperado: ✅ Nenhum aviso, mensagem de sucesso
```

### Teste 5: Restrições Vazias
```
Briefing:
- restricoes: "" (vazio)
- resultado: IA gera normalmente

Esperado: ✅ Fluxo normal, sem validação
```

---

## 🔗 **Integração com Outros Documentos**

- **Doc 1 (Audit):** Corrigir scroll ao adicionar referências
- **Doc 2 (Estrutura):** Usar restrições na lógica de blocos
- **Doc 4 (API Unificada):** Passar restrições para qualquer modelo
- **Doc 5 (Prompt Blindagem):** Incluir restrições no System Prompt base

---

## 📝 **Exemplo Prático**

**Cliente Input:**
```
Briefing.restricoes = "Evitar tom agressivo, não mencionar concorrentes, sem promessas vagas"
```

**Antes (Problema):**
```
Copy gerada: "Somos os MELHORES! Destroi seus problemas com nossa solução REVOLUCIONÁRIA!"
```

**Depois (Corrigido):**
```
Copy gerada: "Oferecemos uma solução clara e eficaz para seus desafios. 
Com nossa experiência, você terá resultados comprovados."
```

**Validação:**
```
✅ Nenhuma palavra proibida
✅ Tom respeitoso, não agressivo
✅ Sem comparação com concorrentes
✅ Promessas específicas (resultados comprovados)
```

---

**FIM DO DOCUMENTO 3**
