# 🏗️ LANDINGAI — Gerador Inteligente de Estrutura da LP

**Versão:** 2.0.2  
**Data:** 2026-05-08  
**Escopo:** Refatorar geração de estrutura para ser determinística e personalizada

---

## 🎯 **Resumo Executivo**

**Problema Atual:**
- IA gera estrutura genérica/template
- Não analisa o briefing para decidir melhor sequência
- Não respeita quando INCLUIR ou EXCLUIR blocos
- Usa estrutura padrão em vez de otimizada para cada caso

**Solução:**
- Criar lógica determinística baseada em tabela de "quando usar cada bloco"
- Mapear regras de prerequisitos (ex: só incluir Preço se autorizado)
- Treinar a IA para analisar o briefing e decidir estrutura ideal
- Validar que blocos necesários estão presentes

**Tempo estimado:** 4-5 horas  
**Risco:** Médio (afeta core de geração, precisa testes)

---

## 📊 **Tabela de Blocos — Quando Usar Cada Um**

| # | Bloco | Sempre? | Condições | Prerequisitos |
|---|-------|---------|-----------|---------------|
| 1 | **Cabeçalho** | ✅ SIM | — | — |
| 2 | **Hero — Impacto Inicial** | ✅ SIM | — | H1 focada na Dor #1 |
| 3 | **O Serviço** | ✅ SIM | — | O que é, como funciona (sem jargão) |
| 4 | **Diferenciais** | ✅ SIM | — | Benefícios reais + credibilidade |
| 5 | **Como Funciona** | ❌ NÃO | Se o processo reduz objeção "como é isso?" | 3+ passos claros |
| 6 | **Planos e Preços** | ❌ NÃO | Se valores foram fornecidos E autorizados | `preco_exibir === 'sim'` |
| 7 | **Prova Social — Depoimentos** | ❌ NÃO | Se há depoimentos reais | `depoimentos === 'sim'` |
| 8 | **Avaliações Google** | ❌ NÃO | Se Google Business com ≥10 avaliações | `google_nota >= 4.5` AND `google_qtd >= 10` |
| 9 | **Feed Instagram** | ❌ NÃO | Se perfil ativo e relevante | `instagram_url` preenchido + público relevante |
| 10 | **FAQ** | ❌ NÃO | Se há objeções fortes no briefing | Mínimo 3 perguntas relevantes |
| 11 | **Logística / Localização + Mapa** | ❌ NÃO | Só se atendimento presencial com endereço | `atendimento === 'presencial'` + endereço autorizado |
| 12 | **CTA Final** | ✅ SIM | — | — |
| 13 | **Rodapé** | ✅ SIM | — | Dados de contato básicos |

---

## 🔄 **Fluxo de Decisão da IA**

```
┌─────────────────────────────────────┐
│ 1. Ler Briefing Completo            │
│    (todos os 8 steps preenchidos)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. Mapear Campos Disponíveis        │
│    ├─ preco_exibir?                 │
│    ├─ depoimentos?                  │
│    ├─ google_business?              │
│    ├─ instagram_url?                │
│    ├─ principais_objecoes?          │
│    └─ atendimento presencial?       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. Aplicar Lógica de Inclusão       │
│    (tabela acima)                   │
│                                     │
│    Sempre incluir:                  │
│    ✅ Cabeçalho                     │
│    ✅ Hero                          │
│    ✅ O Serviço                     │
│    ✅ Diferenciais                  │
│    ✅ CTA Final                     │
│    ✅ Rodapé                        │
│                                     │
│    Incluir SE:                      │
│    ❓ Como Funciona (se relevante)  │
│    ❓ Preços (se autorizado)        │
│    ❓ Depoimentos (se existem)      │
│    ❓ Google (se ≥4.5 stars)        │
│    ❓ Instagram (se ativo)          │
│    ❓ FAQ (se tem objeções)         │
│    ❓ Mapa (se presencial)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 4. Decidir Sequência IDEAL          │
│    (não usar template fixo)         │
│                                     │
│    Exemplo 1: Fisioterapeuta       │
│    → Hero → O Que é → Como Funciona│
│    → Diferenciais → Depoimentos     │
│    → FAQ → CTA → Rodapé             │
│                                     │
│    Exemplo 2: Advogado              │
│    → Hero → Especialidades          │
│    → Diferenciais → Cases           │
│    → Google Reviews → CTA → Rodapé  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 5. Gerar JSON com Estrutura         │
│    + Análise de cada bloco          │
└─────────────────────────────────────┘
```

---

## 💾 **Formato do JSON de Saída (Estrutura)**

```json
{
  "estrutura_lp": {
    "analise": {
      "tipo_negocio": "Prestador de Serviço — Psicólogo",
      "dor_principal": "Pacientes que querem psicoterapia de qualidade",
      "solucao": "Terapia especializada com experiência 10+ anos",
      "justificativa_blocos": "Como é processo terapêutico desconhecido, incluir 'Como Funciona' para reduzir objeção. Depoimentos existem, incluir. FAQ para sanar dúvidas comuns sobre confidencialidade."
    },
    "blocos": [
      {
        "ordem": 1,
        "id": "header",
        "nome": "Cabeçalho",
        "tipo": "estrutural",
        "incluir": true,
        "razao": "Sempre incluído",
        "componentes": {
          "logo": true,
          "menu_navegacao": true,
          "cta_flutuante": false
        }
      },
      {
        "ordem": 2,
        "id": "hero",
        "nome": "Hero — Impacto Inicial",
        "tipo": "estrutural",
        "incluir": true,
        "razao": "Sempre incluído",
        "h1": "Recupere seu bem-estar com terapia que realmente funciona",
        "subtitulo": "10+ anos de prática em psicoterapia de adultos e adolescentes",
        "cta_primaria": "Agendar Sessão",
        "cta_url": "#contato"
      },
      {
        "ordem": 3,
        "id": "o-servico",
        "nome": "O Serviço",
        "tipo": "estrutural",
        "incluir": true,
        "razao": "Sempre incluído",
        "titulo": "O que é Psicoterapia e como funciona",
        "descricao": "Psicoterapia é...",
        "pontos_chave": [
          "Confidencialidade garantida",
          "Sem jargão técnico",
          "Foco em resultados práticos"
        ]
      },
      {
        "ordem": 4,
        "id": "diferenciais",
        "nome": "Diferenciais e Autoridade",
        "tipo": "estrutural",
        "incluir": true,
        "razao": "Sempre incluído",
        "titulo": "Por que escolher meu consultório?",
        "diferenciais": [
          {
            "icone": "check",
            "titulo": "Especialista em Ansiedade",
            "descricao": "Certificação específica em terapia cognitivo-comportamental"
          }
        ]
      },
      {
        "ordem": 5,
        "id": "como-funciona",
        "nome": "Como Funciona",
        "tipo": "opcional",
        "incluir": true,
        "razao": "Processo terapêutico é desconhecido para maioria. Reduz objeção 'como é isso?'",
        "titulo": "Processo de Terapia — Passo a Passo",
        "passos": [
          {
            "numero": 1,
            "titulo": "Primeira Consulta Gratuita",
            "descricao": "Conversa de 30 min para entender sua situação"
          },
          {
            "numero": 2,
            "titulo": "Planejamento do Tratamento",
            "descricao": "Definir objetivos e frequência de sessões"
          },
          {
            "numero": 3,
            "titulo": "Sessões Regulares",
            "descricao": "1 ou 2x por semana, 50 minutos cada"
          },
          {
            "numero": 4,
            "titulo": "Revisão e Ajustes",
            "descricao": "A cada mês, revisar progresso e ajustar abordagem"
          }
        ]
      },
      {
        "ordem": 6,
        "id": "depoimentos",
        "nome": "Prova Social — Depoimentos",
        "tipo": "opcional",
        "incluir": true,
        "razao": "Cliente forneceu 5 depoimentos reais de pacientes satisfeitos",
        "titulo": "O que meus pacientes dizem",
        "subtitulo": "Histórias reais de transformação",
        "quantidade": 5,
        "layout": "cards"
      },
      {
        "ordem": 7,
        "id": "google-reviews",
        "nome": "Avaliações Google",
        "tipo": "opcional",
        "incluir": false,
        "razao": "Google Business não fornecido ou menos de 10 avaliações"
      },
      {
        "ordem": 8,
        "id": "faq",
        "nome": "FAQ",
        "tipo": "opcional",
        "incluir": true,
        "razao": "Objeções fortes sobre confidencialidade, custo, duração. FAQ reduz fricção",
        "titulo": "Dúvidas Frequentes",
        "perguntas": [
          {
            "pergunta": "É tudo confidencial?",
            "resposta": "Sim, com exceção de risco de vida..."
          }
        ]
      },
      {
        "ordem": 9,
        "id": "cta-final",
        "nome": "CTA Final",
        "tipo": "estrutural",
        "incluir": true,
        "razao": "Sempre incluído",
        "titulo": "Pronto para começar?",
        "subtitulo": "Sua primeira sessão é uma conversa sem compromisso",
        "cta_primaria": "Agendar Consulta Gratuita",
        "cta_url": "https://calendly.com/..."
      },
      {
        "ordem": 10,
        "id": "footer",
        "nome": "Rodapé",
        "tipo": "estrutural",
        "incluir": true,
        "razao": "Sempre incluído",
        "componentes": {
          "contato": true,
          "redes_sociais": true,
          "politica_privacidade": true
        }
      }
    ],
    "resumo": {
      "total_blocos": 10,
      "blocos_sempre": 6,
      "blocos_opcionais_inclusos": 4,
      "blocos_excluidos": 2,
      "pagina_tipo": "Serviço — Processo Longo (terapia precisa de contexto)"
    }
  }
}
```

---

## 🧠 **System Prompt para Geração de Estrutura**

Este prompt será usado quando o usuário clica em "Analisar e Preencher" → sistema monta a estrutura.

```markdown
# SYSTEM PROMPT: Gerador Inteligente de Estrutura de Landing Page

Você é um especialista em criar landing pages para prestadores de serviço regional.

## CONTEXTO

O usuário passou um briefing sobre seu negócio. Você precisa:
1. Analisar o briefing
2. Decidir qual é a melhor sequência de blocos para ESSE caso específico
3. Retornar EXCLUSIVAMENTE um JSON com a estrutura (sem explicações)

## TABELA DE BLOCOS E REGRAS

Blocos SEMPRE inclusos:
- Cabeçalho
- Hero (com H1 focada na Dor #1)
- O Serviço
- Diferenciais
- CTA Final
- Rodapé

Blocos CONDICIONAIS (incluir SE):
- "Como Funciona" → Se o processo é desconhecido (EX: terapia, coaching, treinamento de cães)
- "Planos e Preços" → Se `preco_exibir === 'sim'` AND valores foram fornecidos
- "Depoimentos" → Se `depoimentos === 'sim'` AND há pelo menos 2 depoimentos
- "Avaliações Google" → Se `google_nota >= 4.5` AND `google_qtd >= 10`
- "Feed Instagram" → Se `instagram_url` preenchido AND público relevante
- "FAQ" → Se há objeções claramente expressas no briefing
- "Mapa + Localização" → Se `atendimento === 'presencial'` AND endereço foi autorizado

## ANÁLISE REQUERIDA

Para cada bloco opcional, você DEVE:
1. Verificar se os prerequisites foram atendidos
2. Decidir se INCLUIR ou EXCLUIR
3. Explicar a razão em `razao`

## ORDEM DOS BLOCOS

Não use ordem fixa. Adapte conforme o tipo de negócio:

EXEMPLO 1: Psicólogo (processo desconhecido)
→ Hero → O Serviço → Como Funciona → Diferenciais → Depoimentos → FAQ → CTA → Rodapé

EXEMPLO 2: Advogado (precisa de autoridade)
→ Hero → Especialidades → Diferenciais → Cases/Resultados → Google Reviews → CTA → Rodapé

EXEMPLO 3: Personal Trainer (precisa de transformação visual)
→ Hero → O Que Você Recebe → Como Funciona → Antes/Depois (cases) → Depoimentos → Preços → CTA → Rodapé

## REGRAS CRÍTICAS

❌ NUNCA copie a seção "Restrições (o que evitar)" para a página
❌ NUNCA inclua blocos sem conteúdo suficiente
❌ NUNCA crie objeções falsas para incluir FAQ
❌ NUNCA ignore regras de prerequisitos

✅ SEMPRE valide cada bloco opcional contra a tabela
✅ SEMPRE ofereça justificativa clara para cada decisão
✅ SEMPRE adapte a ordem conforme o tipo de negócio
✅ SEMPRE deixe espaço para conteúdo real

## FORMATO DE SAÍDA

Retorne EXCLUSIVAMENTE um JSON válido (sem markdown backticks, sem texto antes/depois).

Estrutura esperada:
{
  "estrutura_lp": {
    "analise": { ... },
    "blocos": [ ... ],
    "resumo": { ... }
  }
}

JSON COMPLETO ESPERADO: [veja template acima]
```

---

## 🔧 **Implementação no Código**

### **Arquivo:** `assets/js/screens/estrutura.js`

Este arquivo é onde a IA gera a estrutura. Ele precisa ser refatorado para:

1. **Coletar dados do briefing**
2. **Enviar para IA com novo system prompt**
3. **Validar JSON retornado**
4. **Renderizar estrutura no UI**

#### **Passo 1: Coletar dados do briefing**

```javascript
function coletarDadosParaEstrutura() {
  const briefing = JSON.parse(localStorage.getItem('briefing_bruto') || '{}');
  
  // Extrair campos relevantes para decisão de blocos
  const dados = {
    // Sempre necessários
    dor_principal: briefing.publico_dor || '',
    solucao_principal: briefing.o_que_oferece || '',
    diferencial: briefing.diferencial || '',
    
    // Condicionais
    preco_exibir: briefing.preco_exibir === 'sim',
    preco_valor: briefing.preco_valor || '',
    
    depoimentos: briefing.depoimentos === 'sim',
    depoimentos_qtd: parseInt(briefing.depoimentos_qtd || 0),
    
    google_business: briefing.google_business === 'sim',
    google_nota: parseFloat(briefing.google_nota || 0),
    google_qtd: parseInt(briefing.google_qtd || 0),
    
    instagram_url: briefing.instagram_url || '',
    
    processo_desconhecido: briefing.como_funciona_detalhado ? true : false,
    
    objecoes_principais: briefing.publico_dor || '', // usar para FAQ
    
    atendimento_presencial: briefing.atendimento === 'presencial',
    endereco_autorizado: briefing.endereco && briefing.endereco.trim().length > 0,
    
    restricoes: briefing.restricoes || '', // NÃO USAR PARA CONTEÚDO
  };
  
  return dados;
}
```

#### **Passo 2: Montar prompt com dados**

```javascript
function montarPromptEstrutura(dadosBriefing) {
  const systemPrompt = `[copiar do template acima]`;
  
  const userPrompt = `
Analise este briefing e retorne a estrutura ideal da landing page.

DADOS DO NEGÓCIO:
- Dor Principal: ${dadosBriefing.dor_principal}
- Solução: ${dadosBriefing.solucao_principal}
- Diferencial: ${dadosBriefing.diferencial}

DADOS CONDICIONAIS:
- Preço deve ser exibido: ${dadosBriefing.preco_exibir ? 'SIM' : 'NÃO'}
- Depoimentos disponíveis: ${dadosBriefing.depoimentos ? `SIM (${dadosBriefing.depoimentos_qtd})` : 'NÃO'}
- Google Business: ${dadosBriefing.google_business ? `SIM (${dadosBriefing.google_nota} stars, ${dadosBriefing.google_qtd} reviews)` : 'NÃO'}
- Instagram: ${dadosBriefing.instagram_url ? 'Sim' : 'Não'}
- Processo desconhecido para cliente (precisa de "Como Funciona"): ${dadosBriefing.processo_desconhecido ? 'SIM' : 'NÃO'}
- Atendimento presencial com endereço: ${dadosBriefing.atendimento_presencial && dadosBriefing.endereco_autorizado ? 'SIM' : 'NÃO'}

RESTRIÇÕES (o que NÃO incluir na copy):
${dadosBriefing.restricoes || 'Nenhuma restrição especificada'}

Retorne EXCLUSIVAMENTE um JSON válido com a estrutura otimizada.
  `;
  
  return { systemPrompt, userPrompt };
}
```

#### **Passo 3: Chamar IA e validar**

```javascript
async function gerarEstrutura() {
  try {
    // 1. Coletar dados
    const dados = coletarDadosParaEstrutura();
    
    // 2. Montar prompts
    const { systemPrompt, userPrompt } = montarPromptEstrutura(dados);
    
    // 3. Chamar IA
    const response = await App.callAPI(systemPrompt, userPrompt);
    
    // 4. Extrair JSON (remover markdown backticks se houver)
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    // 5. Validar JSON
    const estrutura = JSON.parse(jsonText);
    
    // 6. Validar estrutura obrigatória
    validarEstrutura(estrutura);
    
    // 7. Salvar em localStorage
    localStorage.setItem('estrutura_lp', JSON.stringify(estrutura));
    
    // 8. Renderizar no UI
    renderizarEstrutura(estrutura);
    
    showSuccess('Estrutura da LP gerada com sucesso!');
    
  } catch (error) {
    console.error('Erro ao gerar estrutura:', error);
    showError('Erro ao gerar estrutura. Verifique o console.');
  }
}

function validarEstrutura(estrutura) {
  if (!estrutura.estrutura_lp || !Array.isArray(estrutura.estrutura_lp.blocos)) {
    throw new Error('JSON inválido: falta campo estrutura_lp.blocos');
  }
  
  const blocos = estrutura.estrutura_lp.blocos;
  
  // Validar blocos sempre obrigatórios
  const obrigatorios = ['header', 'hero', 'o-servico', 'diferenciais', 'cta-final', 'footer'];
  const inclusos = blocos.filter(b => b.incluir === true).map(b => b.id);
  
  for (let obrigatorio of obrigatorios) {
    if (!inclusos.includes(obrigatorio)) {
      throw new Error(`Bloco obrigatório '${obrigatorio}' não foi incluído`);
    }
  }
  
  return true;
}
```

#### **Passo 4: Renderizar no UI**

```javascript
function renderizarEstrutura(estrutura) {
  const container = document.getElementById('estrutura-blocos');
  
  const blocos = estrutura.estrutura_lp.blocos;
  
  const html = `
    <div class="estrutura-analise">
      <div class="analise-card">
        <h3>Análise da Estrutura</h3>
        <p><strong>Tipo de Negócio:</strong> ${estrutura.estrutura_lp.analise.tipo_negocio}</p>
        <p><strong>Justificativa:</strong> ${estrutura.estrutura_lp.analise.justificativa_blocos}</p>
      </div>
    </div>
    
    <div class="estrutura-blocos-list">
      ${blocos.map((bloco, idx) => `
        <div class="bloco-card ${bloco.incluir ? 'incluir' : 'excluir'}">
          <div class="bloco-header">
            <span class="bloco-ordem">${bloco.ordem}</span>
            <h4>${bloco.nome}</h4>
            <span class="bloco-status">${bloco.incluir ? '✅ INCLUIR' : '❌ EXCLUIR'}</span>
          </div>
          <p class="bloco-razao"><strong>Razão:</strong> ${bloco.razao}</p>
          <div class="bloco-tipo">${bloco.tipo}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="estrutura-resumo">
      <p><strong>Total de blocos:</strong> ${estrutura.estrutura_lp.resumo.total_blocos}</p>
      <p><strong>Sempre inclusos:</strong> ${estrutura.estrutura_lp.resumo.blocos_sempre}</p>
      <p><strong>Opcionais inclusos:</strong> ${estrutura.estrutura_lp.resumo.blocos_opcionais_inclusos}</p>
      <p><strong>Excluídos:</strong> ${estrutura.estrutura_lp.resumo.blocos_excluidos}</p>
    </div>
  `;
  
  container.innerHTML = html;
}
```

---

## 🧪 **Testes de Validação**

### **Teste 1: Estrutura Básica**
```
Input: Psicólogo com depoimentos + Google 4.8 stars
Output esperado:
✅ Hero
✅ O Serviço
✅ Como Funciona (porque terapia é desconhecida)
✅ Diferenciais
✅ Depoimentos
✅ Google Reviews
✅ CTA
✅ Rodapé

❌ Preços (não fornecidos)
❌ FAQ (nenhuma objeção clara)
```

### **Teste 2: Blocos Condicionais**
```
Input: Advogado SEM Google, SEM depoimentos, COM preço
Output esperado:
✅ Incluir Preços
❌ Excluir Google
❌ Excluir Depoimentos
```

### **Teste 3: Não Copiar Restrições**
```
Input: Cliente marca "Restrições: não falar de trauma, não usar palavras técnicas"
Output esperado:
❌ A copy NÃO contém "trauma"
❌ A copy NÃO contém jargão técnico
✅ As restrições aparecem apenas na análise como "o que evitar"
```

### **Teste 4: Ordem Adaptada**
```
Input: Personal Trainer (visual) vs Psicólogo (processo)
Output esperado:
Personal Trainer: Hero → Transformações → Depoimentos → Preços → CTA
Psicólogo: Hero → O Que É → Como Funciona → Depoimentos → FAQ → CTA

(ordem diferente conforme tipo de negócio)
```

---

## 📋 **Checklist de Implementação**

- [ ] `estrutura.js` refatorado com novos functions
- [ ] System prompt atualizado e testado
- [ ] Função `coletarDadosParaEstrutura()` implementada
- [ ] Função `montarPromptEstrutura()` implementada
- [ ] Função `gerarEstrutura()` funciona end-to-end
- [ ] Validação de JSON robusta
- [ ] Validação de blocos obrigatórios
- [ ] Renderização do UI clara e testada
- [ ] localStorage salva estrutura corretamente
- [ ] Testes 1-4 acima passam
- [ ] Nenhuma restrição vaza para conteúdo
- [ ] Ícones e estilos CSS funcionam

---

## 🚀 **Próximo Passo**

Depois que este documento for implementado, passar para:
- **Documento 3:** Respeitar campo "Restrições" em toda a geração

---

**FIM DO DOCUMENTO 2**
