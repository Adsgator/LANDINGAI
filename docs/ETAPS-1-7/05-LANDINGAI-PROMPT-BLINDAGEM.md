# 🛡️ LANDINGAI — Blindagem de Prompt (Tailwind + Placeholders)

**Versão:** 2.0.5  
**Data:** 2026-05-08  
**Escopo:** Garantir qualidade de output com regras rígidas no System Prompt

---

## 🎯 **Resumo Executivo**

**Problemas Atuais:**
1. IA gera Tailwind com `px` em vez de `rem` → quebra responsividade
2. HTML final tem placeholders tipo `[INSERIR COPY]` → não está pronto para uso
3. System Prompt é genérico → IA "acha" que pode gerar o que quiser
4. Sem validação pós-geração → documento inválido é exibido ao usuário

**Solução:**
- Blindar System Prompt com 10+ regras rígidas
- Validação automática de output (Tailwind rem, sem placeholders)
- Retry automático se não passar na validação
- Documento 100% pronto para usar (ou vai direto pro Roo Code)

**Tempo estimado:** 2-3 horas  
**Risco:** Baixo (validação apenas)

---

## 🛡️ **System Prompt Blindado**

### **Sistema de Regras (Universal)**

Este é o System Prompt base que TODA geração deve incluir:

```
# LANDINGAI — Sistema de Prompts Rígidos

## 📋 REGRAS OBRIGATÓRIAS

### 1️⃣ TAILWIND CSS — APENAS REM, PROIBIDO PX

❌ PROIBIDO:
<div class="p-4 mt-12 w-200px">

✅ PERMITIDO:
<div class="p-1rem mt-3rem w-12.5rem">

Ou usar Tailwind nativo:
<div class="p-4 mt-12 max-w-3xl">

Regra: 
- Se usar valores absolutos, SEMPRE use rem
- Se não sabe o valor em rem, use Tailwind nativo (p-4, mt-12, etc)
- NUNCA use px absoluto, height/width em px, ou margin/padding em px

Conversão:
- 1rem = 16px (padrão)
- Usar: 0.25rem (4px), 0.5rem (8px), 1rem (16px), 1.5rem (24px), 2rem (32px), etc

### 2️⃣ SEM PLACEHOLDERS NO HTML

❌ PROIBIDO:
<h1>[INSERIR TÍTULO]</h1>
<p>{{copy_aqui}}</p>
<img src="[IMAGEM]">

✅ PERMITIDO:
<h1>Serviços Especializados de Psicologia Clínica</h1>
<p>Com 15 anos de experiência, oferecemos atendimento personalizado.</p>
<img src="/img/hero.jpg" alt="Psicóloga em sessão">

Regra:
- TODO conteúdo deve ser REAL e COMPLETO
- Se há informação no briefing, INSIRA na copy
- Se não há informação (ex: imagem), use valor padrão ou deixe vazio
- NUNCA deixe [TAGS], {{variáveis}}, ou placeholder

### 3️⃣ ESTRUTURA OBRIGATÓRIA DE COPY

Toda copy DEVE incluir:

Seção 1: PROBLEMA (reconhecer a dor do cliente)
Seção 2: SOLUÇÃO (como você resolve)
Seção 3: BENEFÍCIOS (resultados reais)
Seção 4: PROVA SOCIAL (depoimentos, números, credibilidade)
Seção 5: CALL-TO-ACTION (próximo passo claro)

❌ Não é narrativa (contar história)
✅ É informativa (apresentar fatos + benefícios)

### 4️⃣ CTAs DEVEM SER ESPECÍFICAS

❌ PROIBIDO:
"Clique aqui"
"Saiba mais"
"Envie uma mensagem"

✅ PERMITIDO:
"Agendar Consulta Gratuita"
"Baixar Guia de Psicologia"
"Falar com Especialista"
"Solicitar Orçamento"

Regra: Toda CTA deve indicar claramente o PRÓXIMO PASSO para o cliente

### 5️⃣ RESPEITAR NÚMERO MÁXIMO DE CARACTERES

Headlines (h1, h2): Máximo 70 caracteres
Descrições (p): Máximo 160 caracteres  
Buttons: Máximo 30 caracteres
Meta descriptions: Máximo 160 caracteres

Se precisar de mais, quebrar em múltiplas linhas ou sub-elementos

### 6️⃣ IMAGENS E ASSETS

Se briefing não especifica imagem:
- Use placeholder: <img src="/img/placeholder-16-9.jpg" alt="[descrição]">
- Ou deixe como null no JSON
- NUNCA invente URLs tipo "/img/hero-1234.png"

Se briefing especifica marca/cores:
- Usar nas classes Tailwind
- Documentar que cor/fonte usada

### 7️⃣ VALIDAÇÃO DE LINKS

- Todos os links devem ter href="#" ou URL real
- NUNCA deixar href="" ou href="[link]"
- Se não sabe o link, usar "#"
- Adicionar comentário se for placeholder

### 8️⃣ ACESSIBILIDADE (alt, labels, etc)

- TODA imagem deve ter atributo alt descritivo
- TODA form deve ter <label> associadas
- TODA iframe deve ter title
- Usar semantic HTML (header, main, footer, section)

### 9️⃣ RESPONSIVIDADE

- Usar Tailwind classes: sm:, md:, lg:, xl:
- Mobile-first approach (classes básicas = mobile)
- Testar visualmente em 3 breakpoints: 320px, 768px, 1024px

### 🔟 MÉTADATA E SEMAÂNTICA

- <title> deve ser único e descritivo
- <meta name="description"> deve ser até 160 chars
- <h1> deve aparecer exatamente UMA VEZ por página
- Usar <h2>, <h3> em ordem hierárquica

---

## 🔧 **Implementação no Código**

### **Arquivo:** `assets/js/02-api.js`

Adicionar função para construir System Prompt blindado:

```javascript
/**
 * Construir System Prompt com todas as regras rígidas
 * @param {object} briefing - Dados do cliente
 * @param {string} tipoGerada - 'estrutura', 'copy_hero', 'copy_completa', etc
 * @returns {string} System Prompt completo
 */
function buildBlindedSystemPrompt(briefing, tipoGerada = 'estrutura') {
  
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

Cliente: ${briefing.nome_cliente}
Serviço: ${briefing.servico}
Persona: ${briefing.persona_principal}
Tom: ${briefing.tom_marca || 'Profissional + acessível'}
Restrições: ${briefing.restricoes || 'Nenhuma'}

---

## ⚠️ ANTES DE DEVOLVER, FAÇA CHECKLIST:

- [ ] Procurei a resposta por "px" — NENHUM encontrado
- [ ] Procurei por "[", "{{", "]" — NENHUM encontrado
- [ ] Toda imagem tem alt descritivo
- [ ] Todo CTA é específica e clara
- [ ] Copy tem 5 seções: Problema, Solução, Benefícios, Prova, CTA
- [ ] Tailwind classes seguem convenção (p-4, not p-1rem)
- [ ] <h1> aparece exatamente 1 vez
- [ ] Não há links vazios (href="")
- [ ] Sem jargão técnico não explicado
- [ ] Estrutura semântica (header, main, footer)

Se NÃO passou em TODOS os itens, REESCREVA antes de responder.

---

## 📝 TIPO DE GERAÇÃO: ${tipoGerada.toUpperCase()}

${getTipoeGeracaoEspecifica(tipoGerada)}

---`;

  return basePrompt;
}

/**
 * Regras específicas por tipo de geração
 */
function getTipoeGeracaoEspecifica(tipo) {
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
```

---

## ✅ **Validação Pós-Geração**

### **Arquivo:** `assets/js/03-ui.js`

Adicionar função que valida output:

```javascript
/**
 * Validar se HTML/copy segue as 10 regras
 * @param {string} html - HTML gerado
 * @param {object} config - Configurações de validação
 * @returns {object} { valido: boolean, erros: array, avisos: array }
 */
function validateBlindedOutput(html, config = {}) {
  const erros = [];
  const avisos = [];

  // 1. Verificar px em Tailwind
  const pxMatches = html.match(/(?:p-|m-|w-|h-|text-).+?px/g);
  if (pxMatches) {
    erros.push({
      tipo: 'tailwind_px',
      encontrado: pxMatches.slice(0, 3),
      msg: `❌ Encontrado ${pxMatches.length}x "px" em Tailwind. Use rem ou Tailwind nativo.`
    });
  }

  // 2. Verificar placeholders
  const placeholderMatches = html.match(/\[.+?\]|\{\{.+?\}\}|_INSERIR|_COPY|_IMAGEM/g);
  if (placeholderMatches) {
    erros.push({
      tipo: 'placeholders',
      encontrado: placeholderMatches.slice(0, 3),
      msg: `❌ Encontrado ${placeholderMatches.length}x placeholder. Conteúdo deve ser real.`
    });
  }

  // 3. Verificar imagens sem alt
  const imgSemAlt = html.match(/<img(?!.*alt=)[^>]*>/g);
  if (imgSemAlt) {
    erros.push({
      tipo: 'img_sem_alt',
      qtd: imgSemAlt.length,
      msg: `❌ ${imgSemAlt.length} imagem(ns) sem atributo alt`
    });
  }

  // 4. Verificar links vazios
  const linksVazios = html.match(/href=""\s/g);
  if (linksVazios) {
    erros.push({
      tipo: 'links_vazios',
      qtd: linksVazios.length,
      msg: `❌ ${linksVazios.length} link(s) com href vazio`
    });
  }

  // 5. Verificar h1
  const h1Count = (html.match(/<h1[^>]*>/g) || []).length;
  if (h1Count === 0) {
    avisos.push('⚠️ Nenhum <h1> encontrado. Recomenda-se um.');
  } else if (h1Count > 1) {
    erros.push({
      tipo: 'multiplos_h1',
      qtd: h1Count,
      msg: `❌ ${h1Count}x <h1> encontrado. Deve ter exatamente 1.`
    });
  }

  // 6. Verificar CTAs genéricas
  const ctasGenericas = ['clique aqui', 'saiba mais', 'enviar', 'ok'];
  const htmlLower = html.toLowerCase();
  ctasGenericas.forEach(cta => {
    if (htmlLower.includes(cta)) {
      avisos.push(`⚠️ CTA genérica detectada: "${cta}". Prefira "Agendar", "Baixar", etc.`);
    }
  });

  // 7. Verificar estrutura semântica
  if (!html.includes('<header>') && !html.includes('<Header')) {
    avisos.push('⚠️ Sem <header> semântico');
  }
  if (!html.includes('<main>') && !html.includes('<Main')) {
    avisos.push('⚠️ Sem <main> semântico');
  }
  if (!html.includes('<footer>') && !html.includes('<Footer')) {
    avisos.push('⚠️ Sem <footer> semântico');
  }

  // 8. Verificar responsividade
  const classesMobileFirst = html.match(/class="[^"]*(?:sm:|md:|lg:|xl:)[^"]*"/g) || [];
  if (classesMobileFirst.length === 0) {
    avisos.push('⚠️ Nenhuma classe responsiva (sm:, md:, etc) detectada');
  }

  // 9. Verificar título da página
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    avisos.push('⚠️ <title> não encontrado');
  } else if (titleMatch[1].length > 60) {
    avisos.push(`⚠️ <title> muito longo (${titleMatch[1].length} chars). Máximo 60.`);
  }

  // 10. Verificar meta description
  const metaDescMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (!metaDescMatch) {
    avisos.push('⚠️ <meta description> não encontrada');
  } else if (metaDescMatch[1].length > 160) {
    avisos.push(`⚠️ Meta description muito longa (${metaDescMatch[1].length} chars). Máximo 160.`);
  }

  // Retornar resultado
  return {
    valido: erros.length === 0,
    erros: erros,
    avisos: avisos,
    score: Math.max(0, 100 - (erros.length * 10 + avisos.length * 5)),
    timestamp: new Date().toISOString()
  };
}
```

---

## 🔄 **Fluxo: Gerar → Validar → Exibir/Regenerar**

### **Arquivo:** `assets/js/04-handlers.js`

Integrar validação no fluxo de geração:

```javascript
async function gerarEExibirFicha() {
  try {
    // 1. Gerar com prompt blindado
    const systemPrompt = buildBlindedSystemPrompt(App.state.briefing, 'copy_completa');
    
    const response = await callAI({
      model: App.state.selectedModel,
      systemPrompt: systemPrompt,
      userPrompt: `Gerar landing completa: ${JSON.stringify(App.state.briefing)}`
    });

    const fichaHTML = response.content;

    // 2. Validar output
    const validacao = validateBlindedOutput(fichaHTML);

    // 3. Se passou na validação
    if (validacao.valido) {
      console.log(`✅ Output validado! Score: ${validacao.score}%`);
      renderizarFichaComSucesso(fichaHTML);
    } 
    // 4. Se tem erros críticos
    else if (validacao.erros.length > 0) {
      console.warn(`❌ Erros críticos encontrados:`, validacao.erros);
      
      // Mostrar modal
      mostrarModalValidacao({
        titulo: '❌ Erros na Geração',
        erros: validacao.erros,
        avisos: validacao.avisos,
        acoes: [
          {
            label: 'Regenerar',
            onclick: () => gerarEExibirFicha() // Retry
          },
          {
            label: 'Editar Manualmente',
            onclick: () => editarFichaManual(fichaHTML)
          },
          {
            label: 'Descartar',
            onclick: () => fecharModal()
          }
        ]
      });
    }
    // 5. Se só tem avisos
    else {
      console.log(`⚠️ ${validacao.avisos.length} avisos (não-críticos)`);
      
      renderizarFichaComAvisos(fichaHTML, validacao.avisos);
    }

  } catch (error) {
    console.error('Erro ao gerar:', error);
    mostrarErro(`Falha na geração: ${error.message}`);
  }
}
```

---

## 📋 **Checklist de Implementação**

- [ ] `buildBlindedSystemPrompt()` em `02-api.js`
- [ ] `getTipoeGeracaoEspecifica()` em `02-api.js`
- [ ] `validateBlindedOutput()` em `03-ui.js`
- [ ] `gerarEExibirFicha()` integrada com validação em `04-handlers.js`
- [ ] Modal de validação criado/atualizado
- [ ] Teste com 5 briefings diferentes
- [ ] Documentação de regras visível ao usuário (opcional: help text)

---

## 🧪 **Testes de Validação**

### Teste 1: Output com px (DEVE FALHAR)
```
Input: HTML com "p-4px" (inválido)
Esperado: ❌ Erro detectado, sugerir regeneração
```

### Teste 2: Output com placeholder (DEVE FALHAR)
```
Input: HTML com "[INSERIR TÍTULO]"
Esperado: ❌ Erro detectado
```

### Teste 3: Output limpo (DEVE PASSAR)
```
Input: HTML válido, sem px, sem placeholders
Esperado: ✅ Validado, exibir normalmente
```

### Teste 4: Múltiplos h1 (DEVE FALHAR)
```
Input: HTML com 2x <h1>
Esperado: ❌ Erro crítico
```

### Teste 5: Sem h1 (DEVE AVISAR)
```
Input: HTML sem <h1>
Esperado: ⚠️ Aviso (não é erro crítico)
```

---

## 🔗 **Integração com Outros Documentos**

- **Doc 2 (Estrutura):** Usar `buildBlindedSystemPrompt()` no prompt
- **Doc 3 (Restrições):** Adicionar restrições ao system prompt blindado
- **Doc 4 (API):** `callAI()` passa o system prompt para a IA
- **Doc 6 (Google Ads):** Usar validação similar para JSON de campanhas

---

## 📝 **Exemplo Prático**

**Input (Briefing):**
```json
{
  "nome_cliente": "Psicóloga Maria",
  "servico": "Psicoterapia Clínica",
  "tom_marca": "Acessível e profissional"
}
```

**System Prompt Gerado:**
```
# LANDINGAI — Sistema de Geração Blindado

Cliente: Psicóloga Maria
Serviço: Psicoterapia Clínica
Tom: Acessível e profissional

[... 10 regras ...]
```

**Output IA (Válido):**
```html
<h1>Psicoterapia Clínica para Você</h1>
<p class="p-4 text-lg">Atendimento personalizado...</p>
<!-- ✅ Sem px, sem placeholders, com alt em imgs, etc -->
```

**Validação:**
```
✅ valido: true
✅ erros: []
✅ avisos: []
✅ score: 100%
```

---

**FIM DO DOCUMENTO 5**
