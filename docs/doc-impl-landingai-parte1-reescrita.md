# 📋 Ficha de Implementação — LandingAI
## PARTE 1 (REESCRITA): Tela "Estrutura e Copy" — Download, Upload e Geração Interna

**Status:** Pronto para Implementação
**Versão:** 2.0
**Data:** 09/05/2026

---

## 📌 CONTEXTO E LÓGICA COMPLETA

A tela "Estrutura e Copy" tem **três caminhos possíveis**:

```
CAMINHO 1 — Geração Interna (IA do sistema)
  → Usuário clica "Gerar Estrutura e Copy"
  → Sistema chama a API com briefing + instruções
  → IA responde com os blocos no formato padrão
  → Sistema parseia e popula os cards
  → Usuário revisa e aprova

CAMINHO 2 — Download → IA Externa → Upload
  → Usuário clica "Baixar para IA Externa"
  → Sistema gera arquivo .md com briefing + instrução completa
  → Usuário leva para Claude, Gemini, Grok, etc
  → IA externa gera os blocos no formato padrão
  → Usuário copia o output e cola no sistema (textarea)
  → Sistema parseia e popula os cards
  → Usuário revisa e aprova

CAMINHO 3 — Edição Manual
  → Usuário edita card por card diretamente
```

**O ponto crítico:** o output da IA externa precisa chegar no sistema já no formato
correto para ser parseado. Por isso o arquivo de download precisa instruir a IA
sobre o formato exato de entrega — que é o mesmo formato que o sistema parseia.

---

## 1. ARQUIVO DE DOWNLOAD — "Estrutura e Copy para IA Externa"

### O que este arquivo precisa conter

Quando o usuário clica em "Baixar para IA Externa", o sistema gera um `.md` com:

1. **Instrução completa** para a IA (papel, regras, DNA Adsgator, o que não fazer)
2. **Briefing preenchido** com dados reais do projeto
3. **Formato obrigatório de entrega** — exato, com exemplos, para o output ser parseável

### 1.1 Template do arquivo gerado

Este é o template que a função `gerarArquivoEstruturaCopy()` monta:

```markdown
---
projeto: [nome_cliente]
data: [data_geracao]
tipo: estrutura-copy-para-ia-externa
versao: 2.0
---

# [nome_cliente] — Estrutura e Copy da Landing Page

Gerado pelo **LandingAI** · Adsgator · [data]

---

## INSTRUÇÃO PARA A IA

Você é um Copywriter Sênior especializado em Landing Pages de Alta Conversão
para tráfego direto do Google Ads, trabalhando para a agência Adsgator.

Leia o briefing abaixo na íntegra. Execute os três passos na ordem. Não pule etapas.

---

## DNA ADSGATOR — REGRAS INEGOCIÁVEIS

**Intenção de Busca em Primeiro Lugar**
O texto espelha a dor exata que levou o usuário a pesquisar. A H1 justifica o
clique no anúncio nos primeiros 3 segundos. Venda o alívio da dor, não o nome
técnico do serviço.

**Primeira Pessoa Sempre**
A copy fala do profissional para o visitante. Use "eu", "meu", "com você" — nunca
terceira pessoa. Se o profissional é Maria, a copy diz "Eu atendo..." — nunca
"Maria atende...".

**Zero Institucional**
Proibido: "inovador", "excelência", "missão", "visão", "somos apaixonados por",
"comprometidos com", "resultados extraordinários", "transforme sua vida".
Se parece site corporativo genérico, está errado.

**Comunicação Direta e Realista**
Sem promessas milagrosas. Sem adjetivar o óbvio. A copy entrega o que o serviço
realmente faz — nem mais, nem menos.

**Tom Conversacional com Autoridade**
Especialista conversando olho no olho. Firmeza sem arrogância. Proximidade sem
informalidade excessiva.

**Foco na Ação**
Cada título, subtítulo e botão guia o usuário para o CTA principal. Não há texto
decorativo — cada palavra tem função persuasiva.

---

## BRIEFING DO PROJETO

### Identidade

| Campo | Valor |
|-------|-------|
| **Cliente** | [nome_cliente] |
| **Nicho** | [nicho] |
| **Serviço principal** | [servico_principal] |
| **Proposta de valor** | [proposta_valor] |
| **Objetivo de conversão** | [objetivo_conversao] |
| **Público primário** | [publico_primario] |
| **Público secundário** | [publico_secundario] |
| **Cidade / Região** | [cidade] |
| **Modalidade** | [modalidade] |
| **WhatsApp** | [whatsapp] |
| **Mensagem pré-preenchida WA** | [mensagem_wa] |
| **GTM ID** | [gtm_id] |

### Tom de Voz

**Personalidade da marca:** [tom_personalidade]

**Vocabulário que o cliente usa (deve aparecer na copy):**
[tom_vocabulario_usa]

**Vocabulário que o cliente NUNCA usaria:**
[tom_vocabulario_nao]

**Uma frase que resume o tom:** [tom_frase_resumo]

### Briefing Completo do Cliente

[briefing_completo — cole aqui o que veio do formulário do cliente, sem editar]

### Informações Adicionais

[informacoes_adicionais — nuances da conversa, contexto extra]

### Presença Digital

| Ativo Digital | Status | Detalhe |
|---------------|--------|---------|
| **Perfil Google Business** | [google_business_status] | [google_business_detalhe] |
| **Instagram** | [instagram_status] | [instagram_handle] |
| **Endereço físico** | [endereco_status] | [endereco_completo] |
| **Depoimentos coletados** | [depoimentos_status] | [depoimentos_detalhe] |

---

## PASSOS DE EXECUÇÃO

### PASSO A — Análise de Intenção *(não aparece na página)*

Mapeie as **3 dores principais** do usuário que pesquisa por este serviço.

Para cada dor, entregue:
- **Dor real:** o que ele sente / o problema concreto
- **Palavra da busca:** como digita no Google (não o termo técnico)
- **Resultado desejado:** o que imagina conquistar ao clicar

Antes de passar para o PASSO B, confirme internamente: a H1 que você vai escrever
espelha diretamente a Dor #1?

### PASSO B — Metadados de SEO *(não aparece na página — vai no `<head>`)*

**Landing Page principal:**
- `<title>`: máximo 60 caracteres. Palavra-chave + cidade/região se local.
- `<meta description>`: máximo 160 caracteres. Tom conversacional. Dor + benefício + CTA implícito.
- `<meta keywords>`: 5 a 8 termos de busca relevantes.
- `<og:title>` e `<og:description>`: para compartilhamento social.

**Página /links:**
- `<title>`: máximo 60 caracteres.
- `<meta description>`: máximo 100 caracteres. Foco em conversão direta.

### PASSO C — Construção do Fluxo da Página

Monte a página como uma narrativa contínua. Cada bloco conduz o usuário um passo
adiante — não informa, conduz.

**Regras de seleção de blocos:**
- Localização + Mapa: só se presencial com endereço autorizado
- Avaliações Google: só se ≥ 10 avaliações reais. Nunca invente nota.
- Feed Instagram: só se perfil ativo e relevante
- FAQ: só se há objeções reais no briefing
- Planos e Preços: só se valores fornecidos e autorizados
- Prova Social: só se há depoimentos reais. Nunca invente.
- Nunca repita a mesma dor em blocos diferentes sem evolução narrativa

**Blocos disponíveis:**

| Bloco | Quando usar |
|-------|-------------|
| Cabeçalho | Sempre |
| Hero — Impacto Inicial | Sempre. H1 focada na Dor #1. |
| O Serviço | Sempre. O que é, como funciona, sem jargão. |
| Diferenciais | Sempre. Benefícios reais + credibilidade. |
| Como Funciona | Se o processo reduz objeção de "como é isso?" |
| Planos e Preços | Se valores fornecidos e autorizados |
| Prova Social — Depoimentos | Se há depoimentos reais |
| Avaliações Google | Se Google Business com ≥ 10 avaliações reais |
| Feed Instagram | Se perfil ativo e relevante |
| FAQ | Se há objeções fortes no briefing |
| Logística / Localização + Mapa | Se presencial confirmado com endereço autorizado |
| CTA Final | Sempre |
| Rodapé | Sempre |

---

## ❌ O QUE NÃO FAZER

**Títulos e textos:**
- ❌ H1 que não espelhe uma dor real de busca
- ❌ "Transforme a vida do seu X" / "A solução definitiva" / "Método revolucionário"
- ❌ Qualquer frase com "missão", "visão", "valores", "anos de experiência no mercado"
- ❌ "Cada caso é único" / "Estamos aqui para te ajudar em cada etapa da jornada"
- ❌ Copy na terceira pessoa — nunca "O profissional atende", sempre "Eu atendo"

**CTAs:**
- ❌ "Saiba mais" / "Clique aqui" / "Entre em contato" / "Solicite um orçamento"
- ❌ CTA que não diz o que vai acontecer ao clicar

**Estruturalmente:**
- ❌ Inventar depoimentos, avaliações ou notas do Google
- ❌ Incluir blocos de integração sem confirmar o ativo digital existe
- ❌ Finalizar sem CTA claro antes do footer
- ❌ Metadados genéricos

---

## FORMATO OBRIGATÓRIO DE ENTREGA

**IMPORTANTE:** O output que você gera será importado diretamente por um sistema.
Siga o formato abaixo com precisão — qualquer desvio impede o parse automático.

O output completo deve começar com a linha `===INICIO-OUTPUT===` e terminar com
`===FIM-OUTPUT===`. Tudo fora desses delimitadores é ignorado.

Dentro, entregue nesta ordem exata:

```
===INICIO-OUTPUT===

## RESUMO DO PROJETO

| Campo | Valor |
|-------|-------|
| **Objetivo da página** | [uma frase] |
| **Público-alvo principal** | [uma frase] |
| **Tom de voz** | [uma frase] |
| **Nicho** | [uma frase] |
| **Objetivo de conversão** | [uma frase] |
| **Número WhatsApp** | [DDI+DDD+número, só dígitos, ex: 5535999999999] |
| **Mensagem pré-preenchida** | [texto da mensagem] |
| **Link do CTA principal** | [deixar em branco] |
| **ID do GTM** | [GTM-XXXXXXX ou "a confirmar"] |

---

## 1. ANÁLISE DE INTENÇÃO

### Dor #1
- **Dor real:** [o que ele sente]
- **Palavra da busca:** [como digita no Google]
- **Resultado desejado:** [o que quer conquistar]
- **Confirmação H1:** A H1 do Hero espelha esta dor? [Sim — "[trecho da H1]"]

### Dor #2
- **Dor real:** [o que ele sente]
- **Palavra da busca:** [como digita no Google]
- **Resultado desejado:** [o que quer conquistar]

### Dor #3
- **Dor real:** [o que ele sente]
- **Palavra da busca:** [como digita no Google]
- **Resultado desejado:** [o que quer conquistar]

---

## 2. METADADOS DE SEO

### Landing Page Principal
- **`<title>`:** [máx 60 chars]
- **`<meta description>`:** [máx 160 chars]
- **`<meta keywords>`:** [5-8 termos separados por vírgula]
- **`<og:title>`:** [texto]
- **`<og:description>`:** [texto]

### Página /links
- **`<title>`:** [máx 60 chars]
- **`<meta description>`:** [máx 100 chars]

---

## 3. FLUXO SELECIONADO

1. [Nome do Bloco] — [justificativa em 1 linha]
2. [Nome do Bloco] — [justificativa em 1 linha]
3. [Nome do Bloco] — [justificativa em 1 linha]
...

---

## 4. COPY COMPLETA

### BLOCO: [Nome Exato do Bloco]

**Objetivo persuasivo:**
[O que este bloco faz psicologicamente. Como se conecta com o anterior e prepara o próximo.]

**Copy completa:**
- LABEL (se aplicável): "[texto]"
- TÍTULO PRINCIPAL: "[texto]"
- SUBTÍTULO / TEXTO DE APOIO: "[texto]"
- ITENS (se aplicável):
  - "[item 1]"
  - "[item 2]"
  - "[item 3]"
- CTA / BOTÃO (se aplicável): "[texto]"

**Nota de integração (se aplicável):**
[Instrução técnica — ex: Google Reviews API, Feed Instagram]

**Nota visual:**
[Para o designer — ex: "Foto do profissional ao lado." / "Fundo escuro para contraste."]

---

[Repetir o bloco acima para cada seção da página, na ordem do fluxo]

===FIM-OUTPUT===
```

---

## NOTAS FINAIS PARA A IA

- Não resuma a copy. Cada bloco deve ter o texto real e completo.
- Não invente dados. Tudo baseado no briefing acima.
- Não use placeholders no output — valores reais em todos os campos.
- O sistema vai importar seu output automaticamente. Respeite o formato.
```

---

## 2. IMPLEMENTAÇÃO JAVASCRIPT

### 2.1 Criar `assets/js/screens/estrutura-copy.js`

```javascript
// assets/js/screens/estrutura-copy.js
// ============================================================
// Tela: Estrutura e Copy da Landing Page
// ============================================================

import { appState } from '../01-state.js';
import { showToast } from '../14-toast.js';
import { showLoader, hideLoader } from '../05-loader.js';
import { callLLM } from '../02-api.js';

// ============================================================
// GERADOR DO ARQUIVO PARA IA EXTERNA
// ============================================================

/**
 * Monta o arquivo .md completo para download e envio à IA externa
 */
function gerarArquivoEstruturaCopy() {
  const { briefing, artDirection } = appState;
  const data = new Date().toLocaleDateString('pt-BR');

  // Presença digital formatada
  const gbStatus = briefing.google_business
    ? `Sim | ${briefing.google_business_nota || 'detalhe não informado'}`
    : 'Não';
  const igStatus = briefing.instagram
    ? `Sim | ${briefing.instagram_handle || 'handle não informado'}`
    : 'Não';
  const endStatus = briefing.endereco_autorizado
    ? `Sim — autorizado | ${briefing.endereco_completo || 'endereço não informado'}`
    : 'Não / Não autorizado';
  const depStatus = briefing.depoimentos
    ? `Sim | ${briefing.depoimentos_qtd || '?'} depoimentos — ${briefing.depoimentos_formato || 'formato não informado'}`
    : 'Não';

  return `---
projeto: ${briefing.nome_cliente || 'projeto'}
data: ${data}
tipo: estrutura-copy-para-ia-externa
versao: 2.0
---

# ${briefing.nome_cliente || 'Projeto'} — Estrutura e Copy da Landing Page

Gerado pelo **LandingAI** · Adsgator · ${data}

---

## INSTRUÇÃO PARA A IA

Você é um Copywriter Sênior especializado em Landing Pages de Alta Conversão
para tráfego direto do Google Ads, trabalhando para a agência Adsgator.

Leia o briefing abaixo na íntegra. Execute os três passos na ordem. Não pule etapas.

---

## DNA ADSGATOR — REGRAS INEGOCIÁVEIS

**Intenção de Busca em Primeiro Lugar**
O texto espelha a dor exata que levou o usuário a pesquisar. A H1 justifica o clique no anúncio nos primeiros 3 segundos. Venda o alívio da dor, não o nome técnico do serviço.

**Primeira Pessoa Sempre**
A copy fala do profissional para o visitante. Use "eu", "meu", "com você" — nunca terceira pessoa. Se o profissional é Maria, a copy diz "Eu atendo..." — nunca "Maria atende...".

**Zero Institucional**
Proibido: "inovador", "excelência", "missão", "visão", "somos apaixonados por", "comprometidos com", "resultados extraordinários", "transforme sua vida". Se parece site corporativo genérico, está errado.

**Comunicação Direta e Realista**
Sem promessas milagrosas. Sem adjetivar o óbvio. A copy entrega o que o serviço realmente faz — nem mais, nem menos.

**Tom Conversacional com Autoridade**
Especialista conversando olho no olho. Firmeza sem arrogância. Proximidade sem informalidade excessiva.

**Foco na Ação**
Cada título, subtítulo e botão guia o usuário para o CTA principal. Não há texto decorativo — cada palavra tem função persuasiva.

---

## BRIEFING DO PROJETO

### Identidade

| Campo | Valor |
|-------|-------|
| **Cliente** | ${briefing.nome_cliente || '—'} |
| **Nicho** | ${briefing.nicho || '—'} |
| **Serviço principal** | ${briefing.servico_principal || '—'} |
| **Proposta de valor** | ${briefing.proposta_valor || '—'} |
| **Objetivo de conversão** | ${briefing.objetivo_conversao || '—'} |
| **Público primário** | ${briefing.publico_primario || '—'} |
| **Público secundário** | ${briefing.publico_secundario || '—'} |
| **Cidade / Região** | ${briefing.cidade || '—'} |
| **Modalidade** | ${briefing.modalidade || '—'} |
| **WhatsApp** | ${briefing.whatsapp || '—'} |
| **Mensagem pré-preenchida WA** | ${briefing.mensagem_wa || 'Olá! Vi o site e quero saber mais.'} |
| **GTM ID** | ${briefing.gtm_id || 'a confirmar'} |

### Tom de Voz

**Personalidade da marca:** ${briefing.tom_personalidade || '—'}

**Vocabulário que o cliente usa (deve aparecer na copy):**
${briefing.tom_vocabulario_usa || '—'}

**Vocabulário que o cliente NUNCA usaria:**
${briefing.tom_vocabulario_nao || '—'}

**Uma frase que resume o tom:** ${briefing.tom_frase_resumo || '—'}

### Briefing Completo do Cliente

${briefing.briefing_completo || '(não preenchido)'}

### Informações Adicionais

${briefing.informacoes_adicionais || '(não preenchido)'}

### Presença Digital

| Ativo Digital | Status e Detalhe |
|---------------|-----------------|
| **Perfil Google Business** | ${gbStatus} |
| **Instagram** | ${igStatus} |
| **Endereço físico** | ${endStatus} |
| **Depoimentos coletados** | ${depStatus} |

---

## PASSOS DE EXECUÇÃO

### PASSO A — Análise de Intenção *(não aparece na página)*

Mapeie as **3 dores principais** do usuário que pesquisa por este serviço.

Para cada dor, entregue:
- **Dor real:** o que ele sente / o problema concreto
- **Palavra da busca:** como digita no Google (não o termo técnico)
- **Resultado desejado:** o que imagina conquistar ao clicar

Antes de passar para o PASSO B, confirme: a H1 que você vai escrever espelha diretamente a Dor #1?

### PASSO B — Metadados de SEO *(não aparece na página — vai no \`<head>\`)*

**Landing Page principal:**
- \`<title>\`: máximo 60 caracteres. Palavra-chave + cidade/região se local.
- \`<meta description>\`: máximo 160 caracteres. Tom conversacional. Dor + benefício + CTA implícito.
- \`<meta keywords>\`: 5 a 8 termos de busca relevantes.
- \`<og:title>\` e \`<og:description>\`: para compartilhamento social.

**Página /links:**
- \`<title>\`: máximo 60 caracteres.
- \`<meta description>\`: máximo 100 caracteres. Foco em conversão direta.

### PASSO C — Construção do Fluxo da Página

Monte a página como uma narrativa contínua. Cada bloco conduz o usuário um passo adiante.

**Regras de seleção de blocos:**
- Localização + Mapa: só se presencial com endereço autorizado
- Avaliações Google: só se ≥ 10 avaliações reais. Nunca invente nota.
- Feed Instagram: só se perfil ativo e relevante
- FAQ: só se há objeções reais no briefing
- Planos e Preços: só se valores fornecidos e autorizados
- Prova Social: só se há depoimentos reais. Nunca invente.
- Nunca repita a mesma dor em blocos diferentes sem evolução narrativa

**Blocos disponíveis:**

| Bloco | Quando usar |
|-------|-------------|
| Cabeçalho | Sempre |
| Hero — Impacto Inicial | Sempre. H1 focada na Dor #1. |
| O Serviço | Sempre. O que é, como funciona, sem jargão. |
| Diferenciais | Sempre. Benefícios reais + credibilidade. |
| Como Funciona | Se o processo reduz objeção de "como é isso?" |
| Planos e Preços | Se valores fornecidos e autorizados |
| Prova Social — Depoimentos | Se há depoimentos reais |
| Avaliações Google | Se Google Business com ≥ 10 avaliações reais |
| Feed Instagram | Se perfil ativo e relevante |
| FAQ | Se há objeções fortes no briefing |
| Logística / Localização + Mapa | Se presencial confirmado com endereço autorizado |
| CTA Final | Sempre |
| Rodapé | Sempre |

---

## ❌ O QUE NÃO FAZER

**Títulos e textos:**
- ❌ H1 que não espelhe uma dor real de busca
- ❌ "Transforme a vida do seu X" / "A solução definitiva" / "Método revolucionário"
- ❌ Qualquer frase com "missão", "visão", "valores", "anos de experiência no mercado"
- ❌ "Cada caso é único" / "Estamos aqui para te ajudar em cada etapa da jornada"
- ❌ Copy na terceira pessoa — nunca "O profissional atende", sempre "Eu atendo"

**CTAs:**
- ❌ "Saiba mais" / "Clique aqui" / "Entre em contato" / "Solicite um orçamento"
- ❌ CTA que não diz o que vai acontecer ao clicar

**Estruturalmente:**
- ❌ Inventar depoimentos, avaliações ou notas do Google
- ❌ Incluir blocos de integração sem confirmar o ativo digital existe
- ❌ Finalizar sem CTA claro antes do footer
- ❌ Metadados genéricos

---

## FORMATO OBRIGATÓRIO DE ENTREGA

**IMPORTANTE:** O output que você gera será importado diretamente por um sistema.
Siga o formato abaixo com precisão. Qualquer desvio impede o parse automático.

Comece com \`===INICIO-OUTPUT===\` e termine com \`===FIM-OUTPUT===\`.
Tudo fora desses delimitadores é ignorado pelo sistema.

\`\`\`
===INICIO-OUTPUT===

## RESUMO DO PROJETO

| Campo | Valor |
|-------|-------|
| **Objetivo da página** | [uma frase] |
| **Público-alvo principal** | [uma frase] |
| **Tom de voz** | [uma frase] |
| **Nicho** | [uma frase] |
| **Objetivo de conversão** | [uma frase] |
| **Número WhatsApp** | [DDI+DDD+número, só dígitos] |
| **Mensagem pré-preenchida** | [texto da mensagem] |
| **Link do CTA principal** | [deixar em branco] |
| **ID do GTM** | [GTM-XXXXXXX ou "a confirmar"] |

---

## 1. ANÁLISE DE INTENÇÃO

### Dor #1
- **Dor real:** [texto]
- **Palavra da busca:** [texto]
- **Resultado desejado:** [texto]
- **Confirmação H1:** Sim — "[trecho da H1]"

### Dor #2
- **Dor real:** [texto]
- **Palavra da busca:** [texto]
- **Resultado desejado:** [texto]

### Dor #3
- **Dor real:** [texto]
- **Palavra da busca:** [texto]
- **Resultado desejado:** [texto]

---

## 2. METADADOS DE SEO

### Landing Page Principal
- **title:** [máx 60 chars]
- **meta description:** [máx 160 chars]
- **meta keywords:** [5-8 termos separados por vírgula]
- **og:title:** [texto]
- **og:description:** [texto]

### Página /links
- **title:** [máx 60 chars]
- **meta description:** [máx 100 chars]

---

## 3. FLUXO SELECIONADO

1. [Nome do Bloco] — [justificativa em 1 linha]
2. [Nome do Bloco] — [justificativa em 1 linha]
...

---

## 4. COPY COMPLETA

### BLOCO: [Nome Exato]

**Objetivo persuasivo:**
[texto]

**Copy completa:**
- LABEL (se aplicável): "[texto]"
- TÍTULO PRINCIPAL: "[texto]"
- SUBTÍTULO / TEXTO DE APOIO: "[texto]"
- ITENS (se aplicável):
  - "[item 1]"
  - "[item 2]"
- CTA / BOTÃO (se aplicável): "[texto]"

**Nota de integração (se aplicável):**
[texto]

**Nota visual:**
[texto]

---

[Repetir para cada bloco]

===FIM-OUTPUT===
\`\`\`

Não resuma a copy. Não invente dados. Não use placeholders.
`;
}

// ============================================================
// DOWNLOAD DO ARQUIVO
// ============================================================

function baixarArquivoEstruturaCopy() {
  const { briefing } = appState;

  if (!briefing?.nome_cliente) {
    showToast('⚠️ Preencha o briefing antes de baixar', 'warning');
    return;
  }

  const conteudo = gerarArquivoEstruturaCopy();
  const slug = (briefing.nome_cliente || 'projeto')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const blob = new Blob([conteudo], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `estrutura-copy-${slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('✅ Arquivo baixado! Leve para a IA e cole o output de volta.', 'success');
}

// ============================================================
// PARSER DO OUTPUT DA IA EXTERNA
// ============================================================

/**
 * Recebe o texto colado pelo usuário (output da IA externa)
 * Extrai apenas o conteúdo entre ===INICIO-OUTPUT=== e ===FIM-OUTPUT===
 * Parseia em seções e popula o appState
 */
function parsearOutputIA(textoCompleto) {
  // 1. Extrair bloco entre delimitadores
  const regexDelimitador = /===INICIO-OUTPUT===([\s\S]*?)===FIM-OUTPUT===/;
  const match = regexDelimitador.exec(textoCompleto);

  if (!match) {
    throw new Error(
      'Formato inválido: não encontrei ===INICIO-OUTPUT=== e ===FIM-OUTPUT===.\n' +
      'Certifique-se de colar o output completo da IA, incluindo os delimitadores.'
    );
  }

  const conteudo = match[1].trim();

  // 2. Parsear RESUMO DO PROJETO
  const resumo = parsearResumo(conteudo);

  // 3. Parsear ANÁLISE DE INTENÇÃO
  const intencao = parsearIntencao(conteudo);

  // 4. Parsear METADADOS DE SEO
  const seo = parsearSEO(conteudo);

  // 5. Parsear FLUXO SELECIONADO
  const fluxo = parsearFluxo(conteudo);

  // 6. Parsear COPY COMPLETA (blocos)
  const blocos = parsearBlocos(conteudo);

  return { resumo, intencao, seo, fluxo, blocos };
}

function parsearResumo(conteudo) {
  const resumo = {};
  const secao = extrairSecao(conteudo, 'RESUMO DO PROJETO', '1. ANÁLISE');
  if (!secao) return resumo;

  const linhas = secao.split('\n');
  linhas.forEach(linha => {
    const match = /\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|/.exec(linha);
    if (match) {
      const chave = match[1].trim().toLowerCase().replace(/\s+/g, '_');
      const valor = match[2].trim();
      if (valor && valor !== '[deixar em branco]') {
        resumo[chave] = valor;
      }
    }
  });

  return resumo;
}

function parsearIntencao(conteudo) {
  const secao = extrairSecao(conteudo, '1. ANÁLISE DE INTENÇÃO', '2. METADADOS');
  if (!secao) return {};

  const dores = {};
  [1, 2, 3].forEach(n => {
    const regexDor = new RegExp(`### Dor #${n}([\\s\\S]*?)(?=### Dor #${n + 1}|---|\$)`);
    const match = regexDor.exec(secao);
    if (match) {
      const bloco = match[1];
      dores[`dor${n}_real`] = extrairCampoLista(bloco, 'Dor real');
      dores[`dor${n}_busca`] = extrairCampoLista(bloco, 'Palavra da busca');
      dores[`dor${n}_resultado`] = extrairCampoLista(bloco, 'Resultado desejado');
    }
  });

  return dores;
}

function parsearSEO(conteudo) {
  const secao = extrairSecao(conteudo, '2. METADADOS DE SEO', '3. FLUXO');
  if (!secao) return {};

  return {
    title: extrairCampoLista(secao, 'title'),
    description: extrairCampoLista(secao, 'meta description'),
    keywords: extrairCampoLista(secao, 'meta keywords'),
    og_title: extrairCampoLista(secao, 'og:title'),
    og_description: extrairCampoLista(secao, 'og:description'),
    links_title: extrairCampoLista(secao, 'title', 1), // segunda ocorrência
    links_description: extrairCampoLista(secao, 'meta description', 1)
  };
}

function parsearFluxo(conteudo) {
  const secao = extrairSecao(conteudo, '3. FLUXO SELECIONADO', '4. COPY');
  if (!secao) return [];

  const linhas = secao.split('\n');
  const itens = [];
  linhas.forEach(linha => {
    const match = /^\d+\.\s+(.+?)\s*—\s*(.+)$/.exec(linha.trim());
    if (match) {
      itens.push({
        bloco: match[1].trim(),
        justificativa: match[2].trim()
      });
    }
  });

  return itens;
}

function parsearBlocos(conteudo) {
  const secao = extrairSecao(conteudo, '4. COPY COMPLETA', null);
  if (!secao) return [];

  // Cada bloco começa com "### BLOCO: [Nome]"
  const regexBloco = /### BLOCO:\s*(.+?)\n([\s\S]*?)(?=### BLOCO:|$)/g;
  const blocos = [];
  let match;

  while ((match = regexBloco.exec(secao)) !== null) {
    const nome = match[1].trim();
    const corpo = match[2].trim();

    blocos.push({
      id: nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
      nome,
      objetivo: extrairSubsecao(corpo, 'Objetivo persuasivo'),
      copy: extrairSubsecao(corpo, 'Copy completa'),
      integracao: extrairSubsecao(corpo, 'Nota de integração'),
      visual: extrairSubsecao(corpo, 'Nota visual')
    });
  }

  return blocos;
}

// Helpers de parsing
function extrairSecao(texto, inicio, fim) {
  const regexInicio = new RegExp(`##\\s+${inicio.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  const posInicio = texto.search(regexInicio);
  if (posInicio === -1) return null;

  let posFim = texto.length;
  if (fim) {
    const regexFim = new RegExp(`##\\s+${fim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    const matchFim = texto.slice(posInicio).search(regexFim);
    if (matchFim !== -1) posFim = posInicio + matchFim;
  }

  return texto.slice(posInicio, posFim);
}

function extrairSubsecao(texto, titulo) {
  const regex = new RegExp(
    `\\*\\*${titulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^:]*:\\*\\*\\n([\\s\\S]*?)(?=\\n\\*\\*|$)`
  );
  const match = regex.exec(texto);
  return match ? match[1].trim() : '';
}

function extrairCampoLista(texto, campo, ocorrencia = 0) {
  const regex = new RegExp(
    `\\*\\*${campo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^:]*:\\*\\*\\s*(.+)`,
    'gi'
  );
  let count = 0;
  let match;
  while ((match = regex.exec(texto)) !== null) {
    if (count === ocorrencia) return match[1].trim();
    count++;
  }
  return '';
}

// ============================================================
// PROCESSAR IMPORT — Cola e Parseia
// ============================================================

/**
 * Chamada quando o usuário cola o output e confirma
 */
function processarOutputColado(textoColado) {
  if (!textoColado || textoColado.trim().length < 100) {
    showToast('⚠️ Cole o output completo da IA antes de importar', 'warning');
    return false;
  }

  try {
    const parsed = parsearOutputIA(textoColado);

    if (!parsed.blocos || parsed.blocos.length === 0) {
      showToast('⚠️ Nenhum bloco encontrado. Verifique o formato do output.', 'warning');
      return false;
    }

    // Salvar no state
    appState.estruturaCopyBlocos = parsed.blocos;
    appState.intencao = { ...appState.intencao, ...parsed.intencao };
    appState.seo = parsed.seo;
    appState.estruturaCopyFluxo = parsed.fluxo;
    appState.estruturaCopyResumo = parsed.resumo;
    appState.estruturaCopyTimestamp = new Date().toISOString();
    appState.estruturaCopyFonte = 'ia-externa';

    showToast(`✅ ${parsed.blocos.length} blocos importados com sucesso!`, 'success');
    return true;
  } catch (error) {
    showToast(`❌ ${error.message}`, 'error');
    console.error('Erro no parse:', error);
    return false;
  }
}

// ============================================================
// GERAÇÃO INTERNA (IA DO SISTEMA)
// ============================================================

/**
 * Gera estrutura e copy direto pela API do sistema
 */
async function gerarEstruturaCopyInterno() {
  const { briefing } = appState;

  if (!briefing?.nome_cliente) {
    showToast('⚠️ Preencha o briefing antes de gerar', 'warning');
    return;
  }

  showLoader('Analisando briefing e gerando copy...');

  try {
    // Monta o prompt usando o mesmo conteúdo do arquivo de download
    // mas pedindo o output já formatado com os delimitadores
    const conteudoArquivo = gerarArquivoEstruturaCopy();
    const prompt = conteudoArquivo + `

---

INSTRUÇÃO ADICIONAL: Gere agora o output completo seguindo exatamente o FORMATO OBRIGATÓRIO DE ENTREGA acima. Inclua os delimitadores ===INICIO-OUTPUT=== e ===FIM-OUTPUT===.
`;

    const resposta = await callLLM(prompt);

    hideLoader();

    // Parsear o output
    const ok = processarOutputColado(resposta);
    if (ok) {
      renderizarBlocos(appState.estruturaCopyBlocos);
    }
  } catch (error) {
    hideLoader();
    showToast(`❌ Erro ao gerar: ${error.message}`, 'error');
    console.error(error);
  }
}

// ============================================================
// RENDERIZAÇÃO DOS CARDS
// ============================================================

function renderizarBlocos(blocos) {
  const container = document.getElementById('estrutura-blocos-container');
  if (!container) return;

  if (!blocos || blocos.length === 0) {
    container.innerHTML = `
      <div class="placeholder-estado">
        <p>Nenhum bloco para exibir.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = blocos.map((bloco, idx) => `
    <div class="bloco-card" id="bloco-card-${bloco.id}">
      <div class="bloco-card-header">
        <span class="bloco-numero">${idx + 1}</span>
        <h3 class="bloco-nome">${bloco.nome}</h3>
        <div class="bloco-actions">
          <button class="btn-icon" onclick="editarBloco('${bloco.id}')" title="Editar">✏️</button>
          <button class="btn-icon" onclick="copiarBloco('${bloco.id}')" title="Copiar">📋</button>
        </div>
      </div>

      <div class="bloco-card-body">
        ${bloco.objetivo ? `
          <div class="bloco-secao">
            <span class="bloco-secao-label">Objetivo Persuasivo</span>
            <p class="bloco-secao-conteudo">${bloco.objetivo}</p>
          </div>
        ` : ''}

        ${bloco.copy ? `
          <div class="bloco-secao">
            <span class="bloco-secao-label">Copy Completa</span>
            <pre class="bloco-secao-copy">${bloco.copy}</pre>
          </div>
        ` : ''}

        ${bloco.integracao ? `
          <div class="bloco-secao bloco-secao-integracao">
            <span class="bloco-secao-label">Nota de Integração</span>
            <p class="bloco-secao-conteudo">${bloco.integracao}</p>
          </div>
        ` : ''}

        ${bloco.visual ? `
          <div class="bloco-secao bloco-secao-visual">
            <span class="bloco-secao-label">Nota Visual</span>
            <p class="bloco-secao-conteudo">${bloco.visual}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  // Salvar referência para edição inline
  window._blocosEditaveis = blocos;
}

function editarBloco(blocoId) {
  const bloco = (appState.estruturaCopyBlocos || []).find(b => b.id === blocoId);
  if (!bloco) return;

  // Preencher modal de edição
  document.getElementById('edit-bloco-nome').textContent = bloco.nome;
  document.getElementById('edit-bloco-objetivo').value = bloco.objetivo || '';
  document.getElementById('edit-bloco-copy').value = bloco.copy || '';
  document.getElementById('edit-bloco-integracao').value = bloco.integracao || '';
  document.getElementById('edit-bloco-visual').value = bloco.visual || '';

  appState._blocoemEdicao = blocoId;

  document.getElementById('modal-editar-bloco').classList.add('visible');
}

function salvarEdicaoBloco() {
  const blocoId = appState._blocoemEdicao;
  const bloco = (appState.estruturaCopyBlocos || []).find(b => b.id === blocoId);
  if (!bloco) return;

  bloco.objetivo = document.getElementById('edit-bloco-objetivo').value;
  bloco.copy = document.getElementById('edit-bloco-copy').value;
  bloco.integracao = document.getElementById('edit-bloco-integracao').value;
  bloco.visual = document.getElementById('edit-bloco-visual').value;

  document.getElementById('modal-editar-bloco').classList.remove('visible');
  renderizarBlocos(appState.estruturaCopyBlocos);
  showToast('✅ Bloco salvo!', 'success');
}

async function copiarBloco(blocoId) {
  const bloco = (appState.estruturaCopyBlocos || []).find(b => b.id === blocoId);
  if (!bloco) return;

  const texto = `### BLOCO: ${bloco.nome}\n\n**Objetivo persuasivo:**\n${bloco.objetivo}\n\n**Copy completa:**\n${bloco.copy}${bloco.integracao ? '\n\n**Nota de integração:**\n' + bloco.integracao : ''}${bloco.visual ? '\n\n**Nota visual:**\n' + bloco.visual : ''}`;

  await navigator.clipboard.writeText(texto);
  showToast('✅ Bloco copiado!', 'success');
}

// ============================================================
// EXPORTS
// ============================================================

export {
  gerarArquivoEstruturaCopy,
  baixarArquivoEstruturaCopy,
  processarOutputColado,
  gerarEstruturaCopyInterno,
  renderizarBlocos,
  editarBloco,
  salvarEdicaoBloco,
  copiarBloco
};
```

---

## 3. HTML DA TELA

Adicionar em `index.html`:

```html
<!-- TELA: Estrutura e Copy -->
<div id="tela-estrutura-copy" class="tela oculta">
  <div class="tela-inner">

    <header class="tela-header">
      <h2>Estrutura e Copy</h2>
      <p>Defina os blocos da página e a copy completa de cada um</p>
    </header>

    <!-- Botões de ação principais -->
    <div class="acao-grupo">

      <button class="btn btn-primary btn-lg"
        onclick="window.LandingAI.estruturaCopy.gerarEstruturaCopyInterno()">
        🚀 Gerar Estrutura e Copy
      </button>

      <div class="acao-grupo-secundario">
        <button class="btn btn-outline"
          onclick="window.LandingAI.estruturaCopy.baixarArquivoEstruturaCopy()">
          ⬇️ Baixar para IA Externa
        </button>

        <button class="btn btn-outline"
          onclick="abrirModalImportarOutput()">
          ⬆️ Importar Output da IA
        </button>
      </div>

    </div>

    <!-- Container dos blocos gerados -->
    <div id="estrutura-blocos-container" class="blocos-container">
      <div class="placeholder-estado">
        <p>Clique em "Gerar Estrutura e Copy" ou importe o output de uma IA externa.</p>
      </div>
    </div>

  </div>

  <!-- Navegação -->
  <div class="tela-nav">
    <button class="btn btn-outline" onclick="window.LandingAI.voltar()">← Voltar</button>
    <button class="btn btn-primary" onclick="window.LandingAI.avancar()">Próximo: Direção de Arte →</button>
  </div>
</div>

<!-- Modal: Importar Output da IA Externa -->
<div id="modal-importar-output" class="modal oculto">
  <div class="modal-overlay" onclick="fecharModalImportarOutput()"></div>
  <div class="modal-content">
    <header class="modal-header">
      <h3>Importar Output da IA</h3>
      <button class="btn-close" onclick="fecharModalImportarOutput()">×</button>
    </header>
    <div class="modal-body">
      <p class="modal-instrucao">
        Cole abaixo o output completo da IA, incluindo os delimitadores
        <code>===INICIO-OUTPUT===</code> e <code>===FIM-OUTPUT===</code>.
      </p>
      <textarea
        id="textarea-output-ia"
        class="textarea-output"
        placeholder="Cole aqui o output completo da IA...
        
===INICIO-OUTPUT===
...
===FIM-OUTPUT===" rows="16"></textarea>
    </div>
    <footer class="modal-footer">
      <button class="btn btn-primary"
        onclick="confirmarImportarOutput()">
        ✅ Importar e Criar Blocos
      </button>
      <button class="btn btn-outline"
        onclick="fecharModalImportarOutput()">
        Cancelar
      </button>
    </footer>
  </div>
</div>

<!-- Modal: Editar Bloco -->
<div id="modal-editar-bloco" class="modal oculto">
  <div class="modal-overlay" onclick="document.getElementById('modal-editar-bloco').classList.remove('visible')"></div>
  <div class="modal-content">
    <header class="modal-header">
      <h3 id="edit-bloco-nome">Editar Bloco</h3>
      <button class="btn-close"
        onclick="document.getElementById('modal-editar-bloco').classList.remove('visible')">×</button>
    </header>
    <div class="modal-body">
      <div class="form-group">
        <label>Objetivo Persuasivo</label>
        <textarea id="edit-bloco-objetivo" rows="3"
          placeholder="O que este bloco faz psicologicamente?"></textarea>
      </div>
      <div class="form-group">
        <label>Copy Completa</label>
        <textarea id="edit-bloco-copy" rows="8"
          placeholder="- TÍTULO PRINCIPAL: ...&#10;- SUBTÍTULO: ...&#10;- CTA: ..."></textarea>
      </div>
      <div class="form-group">
        <label>Nota de Integração <span class="label-opcional">(opcional)</span></label>
        <textarea id="edit-bloco-integracao" rows="2"
          placeholder="Ex: Google Reviews API, Feed Instagram..."></textarea>
      </div>
      <div class="form-group">
        <label>Nota Visual <span class="label-opcional">(opcional)</span></label>
        <textarea id="edit-bloco-visual" rows="2"
          placeholder="Para o designer..."></textarea>
      </div>
    </div>
    <footer class="modal-footer">
      <button class="btn btn-primary"
        onclick="window.LandingAI.estruturaCopy.salvarEdicaoBloco()">
        ✅ Salvar
      </button>
      <button class="btn btn-outline"
        onclick="document.getElementById('modal-editar-bloco').classList.remove('visible')">
        Cancelar
      </button>
    </footer>
  </div>
</div>
```

---

## 4. FUNÇÕES AUXILIARES DOS MODAIS (adicionar em `04-handlers.js`)

```javascript
function abrirModalImportarOutput() {
  document.getElementById('modal-importar-output').classList.add('visible');
  setTimeout(() => document.getElementById('textarea-output-ia')?.focus(), 100);
}

function fecharModalImportarOutput() {
  document.getElementById('modal-importar-output').classList.remove('visible');
}

function confirmarImportarOutput() {
  const texto = document.getElementById('textarea-output-ia')?.value || '';
  const ok = window.LandingAI.estruturaCopy.processarOutputColado(texto);
  if (ok) {
    fecharModalImportarOutput();
    document.getElementById('textarea-output-ia').value = '';
    window.LandingAI.estruturaCopy.renderizarBlocos(appState.estruturaCopyBlocos);
  }
}
```

---

## 5. CSS (adicionar em `assets/css/03-screens.css`)

```css
/* ============================================================ */
/* TELA: Estrutura e Copy */
/* ============================================================ */

.acao-grupo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.acao-grupo-secundario {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .acao-grupo-secundario {
    flex-direction: column;
  }
  .acao-grupo-secundario .btn {
    width: 100%;
  }
}

/* ============================================================ */
/* CARDS DE BLOCOS */
/* ============================================================ */

.blocos-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.placeholder-estado {
  text-align: center;
  padding: 3rem 1rem;
  background: var(--bg-default);
  border-radius: var(--r-md);
  border: 1px dashed var(--border-default);
  color: var(--text-secondary);
}

.bloco-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  overflow: hidden;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}

.bloco-card:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.bloco-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--bg-default);
  border-bottom: 1px solid var(--border-default);
}

.bloco-numero {
  width: 28px;
  height: 28px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.bloco-nome {
  flex: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.bloco-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-size: 14px;
  transition: background var(--t-fast);
}

.btn-icon:hover {
  background: var(--bg-default);
}

.bloco-card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.bloco-secao {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.bloco-secao-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-secondary);
}

.bloco-secao-conteudo {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
}

.bloco-secao-copy {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-primary);
  background: var(--bg-default);
  padding: 1rem;
  border-radius: var(--r-sm);
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 220px;
  overflow-y: auto;
}

.bloco-secao-integracao .bloco-secao-label { color: #4a90d9; }
.bloco-secao-visual .bloco-secao-label { color: #7b68ee; }

/* ============================================================ */
/* MODAL: Importar Output */
/* ============================================================ */

.modal-instrucao {
  margin: 0 0 1rem 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.modal-instrucao code {
  background: var(--bg-default);
  padding: 0.1em 0.4em;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.textarea-output {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  resize: vertical;
  background: var(--bg-default);
  color: var(--text-primary);
  box-sizing: border-box;
}

.textarea-output:focus {
  outline: none;
  border-color: var(--accent);
}

/* ============================================================ */
/* MODAL: Editar Bloco */
/* ============================================================ */

.label-opcional {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: normal;
  text-transform: lowercase;
}
```

---

## 6. REGISTRAR NO OBJETO GLOBAL

Em `assets/js/app.js`:

```javascript
import * as estruturaCopyModule from './screens/estrutura-copy.js';

window.LandingAI = {
  // ... outros módulos existentes
  estruturaCopy: estruturaCopyModule,
};
```

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar `assets/js/screens/estrutura-copy.js` com todo o código acima
- [ ] Adicionar HTML das 3 seções em `index.html` (tela + 2 modais)
- [ ] Adicionar funções auxiliares dos modais em `04-handlers.js`
- [ ] Adicionar CSS em `assets/css/03-screens.css`
- [ ] Registrar módulo em `app.js`
- [ ] Testar: baixar arquivo e verificar que briefing está preenchido
- [ ] Testar: colar output com delimitadores e verificar que blocos aparecem
- [ ] Testar: colar output sem delimitadores e verificar mensagem de erro
- [ ] Testar: geração interna pela IA do sistema
- [ ] Testar: editar um bloco e salvar
- [ ] Testar: copiar bloco para clipboard

---

## 8. COMO O FLUXO FUNCIONA NA PRÁTICA

```
DOWNLOAD:
1. Usuário clica "Baixar para IA Externa"
2. Sistema chama gerarArquivoEstruturaCopy() → monta .md com briefing real
3. Arquivo baixado: "estrutura-copy-nome-cliente.md"
4. Usuário abre Claude.ai, cola o arquivo, pede para gerar
5. IA gera output entre ===INICIO-OUTPUT=== e ===FIM-OUTPUT===

IMPORTAR:
6. Usuário copia o output completo (incluindo os delimitadores)
7. Clica "Importar Output da IA" → modal abre
8. Cola o texto → clica "Importar e Criar Blocos"
9. Sistema chama processarOutputColado()
   → valida delimitadores
   → parseia seções (resumo, intenção, SEO, fluxo, blocos)
   → salva no appState
   → renderiza os cards
10. Usuário vê os blocos com copy completa, revisa, edita se necessário
11. Clica "Próximo" → vai para Direção de Arte

GERAÇÃO INTERNA:
1. Usuário clica "Gerar Estrutura e Copy"
2. Sistema usa o mesmo template do arquivo de download como prompt
3. Chama callLLM() com o prompt completo
4. Recebe o output com os delimitadores
5. Reutiliza parsearOutputIA() → mesmo caminho do import
6. Renderiza os cards
```
