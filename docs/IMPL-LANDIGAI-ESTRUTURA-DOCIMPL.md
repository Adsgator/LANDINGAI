# Blueprint de Implementação — LandingAI v2
## Sistema de Estrutura Melhorado + Geração de DOC-IMPL em 4 Arquivos

> **Documento para o Roo Code.**
> Implementação cirúrgica — não altera arquivos protegidos.
> Siga a ordem exata. Não pule etapas.
> Arquivos alterados: `04-handlers.js`, `assets/js/screens/estrutura.js`, `assets/css/03-screens.css`
> Arquivo NÃO alterado: `review.js` (exceto adição de métodos no final)

---

## ⚠️ LEIA ANTES DE COMEÇAR

### O que este documento faz

1. **Melhora a geração de estrutura** — prompt com dados reais, 1ª pessoa obrigatória
2. **Remove o wireframe** — substitui por visualização de blocos com copy real e legível
3. **Implementa sistema de refino iterativo** — usuário descreve ajuste, IA regenera
4. **Divide a geração de DOC-IMPL em 4 chamadas separadas** — cada uma gera 1 arquivo .md para download
5. **Remove o protótipo visual (Pollinations)** — seção e lógica removidas da Review

### O que NÃO muda

- `app.js`, `01-state.js`, `03-ui.js`, `structure.js`, `steps.js` — INTOCADOS
- `index.html` — INTOCADO (nenhum ID novo adicionado)
- `00-config.js` — INTOCADO
- Fluxo de navegação, localStorage, autosave — INTOCADOS
- Telas intake, steps 1-8, art — INTOCADAS

---

## ORDEM DE IMPLEMENTAÇÃO

```
ETAPA 1 → Alterar 04-handlers.js
ETAPA 2 → Substituir assets/js/screens/estrutura.js (arquivo inteiro)
ETAPA 3 → Adicionar métodos no final de assets/js/screens/review.js
ETAPA 4 → Adicionar CSS em assets/css/03-screens.css
ETAPA 5 → Validação e testes
```

---

## ETAPA 1 — ALTERAR `assets/js/04-handlers.js`

### 1.1 — Substituir o método `runEstruturaAnalysis()`

**Localizar** (linhas 665–709 aproximadamente):
```javascript
async runEstruturaAnalysis() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    this.openAILog('Gerando Estrutura da Landing Page', [
      { id: 1, icon: 'file-text', label: 'Lendo briefing completo...' },
      { id: 2, icon: 'layout', label: 'Definindo blocos e ordem narrativa...' },
      { id: 3, icon: 'sparkles', label: 'Gerando copy de cada bloco...' },
      { id: 4, icon: 'monitor', label: 'Gerando wireframe visual...' },
      { id: 5, icon: 'check-circle', label: 'Finalizando estrutura...' },
    ]);

    try {
      this.aiLogStep(1);
      const doc1 = this.buildDoc1();
      await this.aiLogDelay(300);

      this.aiLogStep(2);
      const prompt = this.buildEstruturaPrompt(doc1);
      await this.aiLogDelay(200);

      this.aiLogStep(3);
      const resultado = await this.callAI(prompt);

      this.aiLogStep(4);
      const wireframeHTML = this.gerarWireframeHTML(resultado);
      await this.aiLogDelay(200);

      this.aiLogStep(5);
      this.setField('estrutura_rascunho', resultado);
      this.setField('estrutura_wireframe', wireframeHTML);
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura gerada! Revise e aprove.', 'success');
    } catch (err) {
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar estrutura: ' + err.message, 'error');
      }, 1200);
    }
  },
```

**Substituir por:**
```javascript
async runEstruturaAnalysis() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    this.openAILog('Gerando Estrutura da Landing Page', [
      { id: 1, icon: 'file-text', label: 'Lendo briefing completo...' },
      { id: 2, icon: 'layout', label: 'Definindo blocos e ordem narrativa...' },
      { id: 3, icon: 'sparkles', label: 'Gerando copy de cada bloco...' },
      { id: 4, icon: 'check-circle', label: 'Finalizando estrutura...' },
    ]);

    try {
      this.aiLogStep(1);
      const doc1 = this.buildDoc1();
      await this.aiLogDelay(300);

      this.aiLogStep(2);
      const prompt = this.buildEstruturaPrompt(doc1);
      await this.aiLogDelay(200);

      this.aiLogStep(3);
      const resultado = await this.callAI(prompt);

      this.aiLogStep(4);
      this.setField('estrutura_rascunho', resultado);
      this.setField('estrutura_wireframe', ''); // Limpar wireframe antigo se existir
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura gerada! Revise os blocos e refine se necessário.', 'success');
    } catch (err) {
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar estrutura: ' + err.message, 'error');
      }, 1200);
    }
  },
```

---

### 1.2 — Substituir o método `buildEstruturaPrompt()`

**Localizar** (linhas 711–749 aproximadamente):
```javascript
buildEstruturaPrompt(doc1) {
    return `
Você é um Copywriter Sênior e Arquiteto de Conversão especializado em landing pages para prestadores de serviço.
...
    `.trim();
  },
```

**Substituir por:**
```javascript
buildEstruturaPrompt(doc1) {
    return `
Você é um Copywriter Sênior e Arquiteto de Conversão especializado em landing pages de alta conversão para prestadores de serviço.

## DADOS DO CLIENTE — USE EXATAMENTE ESTES, NÃO INVENTE NADA

${doc1.substring(0, 10000)}

---

## SUA TAREFA

Leia os dados acima e gere a estrutura narrativa completa da landing page.

---

## REGRAS OBRIGATÓRIAS

1. **PRIMEIRA PESSOA DO SINGULAR EM TODA A COPY** — "Eu ajudo...", "Meu método...", "Atendo...", nunca "Ela atende...", "O profissional oferece..."
2. **H1 DO HERO = DOR DE BUSCA** — Não use o nome do serviço como H1. Use a dor ou o desejo do cliente.
3. **CTAs ESPECÍFICOS** — Nunca "Saiba mais" ou "Entre em contato". Use "Agendar minha consulta", "Quero começar agora", etc.
4. **APENAS BLOCOS COM DADOS REAIS** — Se não há depoimentos no briefing, não inclua bloco de depoimentos. Se não há endereço, não inclua mapa.
5. **NARRATIVA CONECTADA** — Cada bloco prepara psicologicamente o próximo.
6. **MÁXIMO 9 BLOCOS** incluindo cabeçalho e rodapé.

---

## BLOCOS DISPONÍVEIS

Use apenas os que fazem sentido com os dados disponíveis:

- Cabeçalho (sempre inclua)
- Hero
- Serviço Principal
- Como Funciona
- Diferenciais
- Planos e Preços
- Prova Social — Depoimentos (só se há depoimentos reais)
- Avaliações Google (só se há perfil Google confirmado)
- Feed Instagram (só se há @ confirmado)
- FAQ
- Localização + Mapa (só se há endereço autorizado)
- CTA Final (sempre inclua antes do rodapé)
- Rodapé (sempre inclua)

---

## FORMATO DE SAÍDA — SIGA EXATAMENTE

Responda APENAS com os blocos no formato abaixo. Nenhum texto antes ou depois.

---
### BLOCO 1: [Nome do Bloco]
**Objetivo narrativo:** [O que este bloco faz psicologicamente e como prepara o próximo]
**Copy sugerida:**
- Título: "[texto exato em 1ª pessoa ou focado na dor]"
- Subtítulo: "[texto de apoio, máx 2 linhas]"
- CTA: "[texto do botão — específico e com verbo de ação]"
- Body (se houver): "[copy adicional, sempre 1ª pessoa]"
**Layout sugerido:** [o que fica à esquerda, à direita, full-width, onde vai imagem]
**Condicional:** [qual dado do briefing justifica este bloco]

---
### BLOCO 2: [Nome do Bloco]
...

---
### SEQUÊNCIA FINAL
1. [Bloco 1]
2. [Bloco 2]
...

    `.trim();
  },
```

---

### 1.3 — Adicionar método `refinarEstrutura()` APÓS `aprovarEstrutura()`

**Localizar** (após linha 758 aproximadamente):
```javascript
  aprovarEstrutura() {
    const rascunho = this.B?.estrutura_rascunho;
    if (!rascunho?.trim()) { this.showToast('Gere a estrutura antes de aprovar.', 'warning'); return; }
    this.setField('estrutura_aprovada', rascunho);
    this.showToast('Estrutura aprovada! Avance para Direção de Arte.', 'success');
    this.renderScreen();
    this.renderStepsNav();
  },
```

**Inserir DEPOIS deste método (antes do comentário `/* Geração do DOC-IMPL */`):**
```javascript
  async refinarEstrutura() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    const feedbackInput = document.getElementById('estrutura-feedback-input');
    const feedback = feedbackInput?.value?.trim();

    if (!feedback) {
      this.showToast('Descreva o que deseja ajustar antes de refinar.', 'warning');
      return;
    }

    const rascunhoAtual = this.B?.estrutura_rascunho;
    if (!rascunhoAtual?.trim()) {
      this.showToast('Gere a estrutura antes de refinar.', 'warning');
      return;
    }

    this.openAILog('Refinando Estrutura com IA', [
      { id: 1, icon: 'message-square', label: 'Analisando seu feedback...' },
      { id: 2, icon: 'refresh-cw', label: 'Aplicando ajustes na copy...' },
      { id: 3, icon: 'check-circle', label: 'Estrutura refinada!' },
    ]);

    try {
      this.aiLogStep(1);
      await this.aiLogDelay(300);

      const prompt = `
Você é um Copywriter Sênior especializado em landing pages de alta conversão.

## ESTRUTURA ATUAL DA LANDING PAGE

${rascunhoAtual}

---

## FEEDBACK DO CLIENTE

"${feedback}"

---

## SUA TAREFA

Analise o feedback acima e refine a estrutura.

REGRAS:
1. Aplique APENAS as mudanças que o feedback pede
2. Mantenha os blocos não mencionados EXATAMENTE como estão
3. SEMPRE use 1ª pessoa do singular em toda a copy
4. Mantenha o mesmo formato de saída (### BLOCO N: Nome)
5. Não adicione nem remova blocos a menos que o feedback peça explicitamente
6. CTAs sempre específicos, nunca genéricos

Retorne a estrutura COMPLETA com os ajustes aplicados, no mesmo formato.
      `.trim();

      this.aiLogStep(2);
      const resultado = await this.callAI(prompt);

      this.setField('estrutura_rascunho', resultado);
      this.setField('estrutura_wireframe', ''); // Limpar wireframe legado

      if (feedbackInput) feedbackInput.value = '';

      this.aiLogStep(3);
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura refinada! Revise novamente.', 'success');
    } catch (err) {
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao refinar: ' + err.message, 'error');
      }, 1200);
    }
  },
```

---

### 1.4 — Substituir o método `generateDocImpl()`

**Localizar** (linhas 763–814 aproximadamente):
```javascript
  async generateDocImpl() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }
    if (!this.P) { this.showToast('Nenhum projeto ativo.', 'warning'); return; }

    this.state.isGenerating = true;

    this.openAILog('Gerando Ficha de Implementação', [
      { id: 1, icon: 'file-text', label: 'Consolidando briefing completo...' },
      { id: 2, icon: 'code', label: 'Preparando prompt de implementação...' },
      { id: 3, icon: 'sparkles', label: 'IA gerando ficha técnica (60–120s)...' },
      { id: 4, icon: 'download', label: 'Validando e baixando...' },
    ]);

    try {
      this.aiLogStep(1);
      const doc1 = this.buildDoc1();
      await this.aiLogDelay(300);

      this.aiLogStep(2);
      const prompt = this.buildImplPrompt();

      this.aiLogStep(3, 'Isso pode levar 60–120 segundos...');
      const res = await this.callAI(prompt);

      this.aiLogStep(4);
      this.state.lastDocImpl = res;
      const slug = (this.B.slug || this.B.nome_cliente?.toLowerCase().replace(/\s+/g, '-') || 'projeto')
        .replace(/[^a-z0-9-]/g, '');
      this.downloadText(res, `doc-impl-${slug}.md`, 'text/markdown');
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.state.isGenerating = false;
      this.showNotification('AIGator', 'Ficha de Implementação gerada!');

      setTimeout(() => {
        this.closeAILog();
        this.showToast('DOC-IMPL gerado e baixado com sucesso!', 'success');
        this.renderScreen();
      }, 600);

    } catch (e) {
      console.error('[AIGator] generateDocImpl:', e);
      this.state.isGenerating = false;
      this.aiLogError(this.state.aiLog.active, e.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar: ' + e.message, 'error');
      }, 1200);
    }
  },
```

**Substituir por:**
```javascript
  async generateDocImpl() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }
    if (!this.P) { this.showToast('Nenhum projeto ativo.', 'warning'); return; }

    this.state.isGenerating = true;

    const slug = (this.B.slug || this.B.nome_cliente?.toLowerCase().replace(/\s+/g, '-') || 'projeto')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '');

    this.openAILog('Gerando Ficha de Implementação em 4 Partes', [
      { id: 1, icon: 'package',    label: 'PARTE 1 — Fundação & Design System (30–60s)...' },
      { id: 2, icon: 'image',      label: 'PARTE 2 — Assets & Componentes Globais (30–60s)...' },
      { id: 3, icon: 'layers',     label: 'PARTE 3 — Seções da Landing Page (30–60s)...' },
      { id: 4, icon: 'file-code',  label: 'PARTE 4 — Página Final & Deploy (30–60s)...' },
      { id: 5, icon: 'download',   label: 'Baixando os 4 arquivos...' },
    ]);

    try {
      // ── PARTE 1: Fundação ─────────────────────────────────────
      this.aiLogStep(1, 'Gerando configuração base e design system...');
      const parte1 = await this.callAI(this.buildImplPromptParte1());
      await this.aiLogDelay(300);

      // ── PARTE 2: Assets & Componentes Globais ────────────────
      this.aiLogStep(2, 'Gerando componentes de layout...');
      const parte2 = await this.callAI(this.buildImplPromptParte2());
      await this.aiLogDelay(300);

      // ── PARTE 3: Seções ───────────────────────────────────────
      this.aiLogStep(3, 'Gerando seções específicas do projeto...');
      const parte3 = await this.callAI(this.buildImplPromptParte3());
      await this.aiLogDelay(300);

      // ── PARTE 4: Página Final ─────────────────────────────────
      this.aiLogStep(4, 'Gerando página final e configurações de deploy...');
      const parte4 = await this.callAI(this.buildImplPromptParte4());
      await this.aiLogDelay(300);

      // ── Download dos 4 arquivos ───────────────────────────────
      this.aiLogStep(5);
      await this.aiLogDelay(400);

      this.downloadText(parte1, `doc-impl-${slug}-parte1-fundacao.md`,   'text/markdown');
      await this.aiLogDelay(600);
      this.downloadText(parte2, `doc-impl-${slug}-parte2-componentes.md`, 'text/markdown');
      await this.aiLogDelay(600);
      this.downloadText(parte3, `doc-impl-${slug}-parte3-secoes.md`,      'text/markdown');
      await this.aiLogDelay(600);
      this.downloadText(parte4, `doc-impl-${slug}-parte4-pagina.md`,      'text/markdown');

      this.aiLogDone();
      this.state.isGenerating = false;
      this.showNotification('AIGator', '4 arquivos de implementação gerados!');

      setTimeout(() => {
        this.closeAILog();
        this.showToast('4 arquivos baixados! Implemente na ordem: Parte 1 → 2 → 3 → 4', 'success', 6000);
        this.renderScreen();
      }, 600);

    } catch (e) {
      console.error('[AIGator] generateDocImpl:', e);
      this.state.isGenerating = false;
      this.aiLogError(this.state.aiLog.active, e.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar: ' + e.message, 'error');
      }, 1200);
    }
  },
```

---

### 1.5 — Remover `buildImplPrompt()` e substituir pelos 4 prompts separados

**Localizar em `04-handlers.js`** o método `buildImplPrompt()` que chama `handleGenerateDocImpl()` — **REMOVER COMPLETAMENTE** e substituir pelos 4 métodos abaixo.

> ⚠️ Se `buildImplPrompt()` existir em `review.js` também, removê-lo de lá igualmente. Estes 4 novos métodos vão em `04-handlers.js`, ANTES do comentário `/* Downloads */`.

```javascript
  /* ----------------------------------------------------------
     Prompts de Implementação — 4 Partes Separadas
     Cada parte gera 1 arquivo .md independente para download.
     O Roo implementa na ordem: Parte 1 → 2 → 3 → 4.
  ---------------------------------------------------------- */

  buildImplPromptParte1() {
    const B = this.B || {};
    const fichaArte = (() => {
      try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); }
      catch { return {}; }
    })();

    const corPrimaria   = B.arte_cor_principal || fichaArte?.paleta?.primaria   || '#6366f1';
    const corSecundaria = B.arte_cor_secundaria || fichaArte?.paleta?.secundaria || '#8b5cf6';
    const corTexto      = fichaArte?.paleta?.texto     || '#1e293b';
    const corFundo      = fichaArte?.paleta?.fundo     || '#ffffff';
    const fonteDisplay  = fichaArte?.tipografia?.display || 'Inter';
    const fonteBody     = fichaArte?.tipografia?.body    || 'Inter';
    const nomeSlug      = (B.nome_cliente || 'projeto').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return `
Você é um engenheiro front-end sênior especializado em Astro 4.x e Tailwind CSS 3.x.

## SUA TAREFA — PARTE 1 DE 4: FUNDAÇÃO & DESIGN SYSTEM

Gere APENAS os arquivos de fundação do projeto. Código COMPLETO, sem placeholders, sem comentários do tipo "adicione aqui".

## DADOS DO PROJETO

- **Nome do projeto (slug):** ${nomeSlug}
- **Nome do cliente:** ${B.nome_cliente || 'Projeto'}
- **Domínio:** ${B.dominio || '[DOMINIO]'}
- **Segmento:** ${B.segmento || ''}
- **Cor primária:** ${corPrimaria}
- **Cor secundária:** ${corSecundaria}
- **Cor do texto:** ${corTexto}
- **Cor do fundo:** ${corFundo}
- **Fonte display (títulos):** ${fonteDisplay}
- **Fonte body (corpo):** ${fonteBody}
- **Tom visual:** ${fichaArte?.tom_visual || 'moderno e profissional'}

## STACK OBRIGATÓRIA

- Astro 4.x (output: hybrid)
- Tailwind CSS 3.x
- GSAP 3.x + ScrollTrigger
- Lenis (smooth scroll)
- Lucide React
- Deploy: Vercel

## REGRAS DE CÓDIGO — DESIGN SYSTEM

1. **PROIBIDO usar px** para tipografia, espaçamento ou layout — use APENAS rem
2. Tailwind theme estende variáveis CSS — nunca hardcode valores de cor
3. globals.css define TODAS as variáveis CSS com os valores reais acima
4. Button.astro já usa as variáveis — nenhuma cor hardcoded
5. Layout.astro inclui preconnect para as Google Fonts definidas
6. Todo código deve passar em \`astro check\` sem erros

## ARQUIVOS A GERAR (nesta ordem)

### \`package.json\`
### \`astro.config.mjs\`
### \`tailwind.config.js\`
### \`.env.example\`
### \`src/styles/globals.css\`
(Variáveis CSS com valores reais acima + reset + utilitários base)
### \`src/layouts/Layout.astro\`
(Head completo: meta charset, viewport, title, favicon, Google Fonts preconnect, globals.css import, slot)
### \`src/components/ui/Button.astro\`
(Props: href, variant: 'primary'|'secondary'|'ghost'|'outline', size: 'sm'|'md'|'lg', ariaLabel — usa variáveis CSS)

---

Gere APENAS estes 7 arquivos, com código 100% completo e funcional.
Formato de resposta: título \`### \\\`caminho/arquivo\\\`\` seguido do bloco de código.
    `.trim();
  },

  buildImplPromptParte2() {
    const B = this.B || {};
    const fichaArte = (() => {
      try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); }
      catch { return {}; }
    })();

    // Extrair imagens necessárias da estrutura aprovada
    const estrutura = B.estrutura_aprovada || B.estrutura_rascunho || '';
    const temHero      = /hero/i.test(estrutura);
    const temServico   = /servi[cç]/i.test(estrutura);
    const temResultado = /resultado|transforma/i.test(estrutura);

    const imagensNecessarias = [
      temHero      && `- \`src/assets/images/hero-principal.webp\` — Foto principal do profissional ou imagem de impacto do Hero. Dimensões ideais: 1200×900px.`,
      temServico   && `- \`src/assets/images/servico-principal.webp\` — Imagem do serviço ou ambiente profissional. Dimensões ideais: 800×600px.`,
      temResultado && `- \`src/assets/images/resultado-transformacao.webp\` — Imagem inspiradora de resultado/transformação. Dimensões ideais: 1200×800px.`,
      `- \`public/og-image.jpg\` — Imagem Open Graph para redes sociais. Dimensões: 1200×630px.`,
      `- \`public/favicon.svg\` — Ícone do site. Pode ser uma versão simplificada do logo.`,
    ].filter(Boolean).join('\n');

    return `
Você é um engenheiro front-end sênior especializado em Astro 4.x.

## SUA TAREFA — PARTE 2 DE 4: ASSETS & COMPONENTES GLOBAIS

Esta parte assume que a PARTE 1 já foi implementada.
Os arquivos \`globals.css\`, \`Layout.astro\` e \`Button.astro\` já existem.

## DADOS DO CLIENTE

- **Nome:** ${B.nome_cliente || 'Profissional'}
- **Segmento:** ${B.segmento || ''}
- **WhatsApp:** ${B.whatsapp || ''}
- **E-mail:** ${B.email || ''}
- **Instagram:** ${B.instagram || ''}
- **Domínio:** ${B.dominio || '[DOMINIO]'}
- **Cor primária:** ${B.arte_cor_principal || fichaArte?.paleta?.primaria || '#6366f1'}
- **Tom visual:** ${fichaArte?.tom_visual || 'moderno e profissional'}
- **Logo disponível:** ${B.arte_logo === 'svg' ? 'SVG' : B.arte_logo === 'png' ? 'PNG' : 'Sem logo — usar texto'}

## PRÉ-REQUISITO: ESTRUTURA DE PASTAS E IMAGENS PLACEHOLDER

Antes de gerar qualquer componente, o Roo deve:
1. Criar a pasta \`src/assets/images/\`
2. Criar um arquivo SVG placeholder para cada imagem necessária (para o build não quebrar)

### Imagens necessárias neste projeto:
${imagensNecessarias}

**Instrução para o Roo:** Para cada imagem .webp listada, criar um SVG placeholder temporário com o mesmo nome (ex: \`hero-principal.webp\` → criar \`hero-principal.svg\` na mesma pasta como placeholder). As imagens reais devem ser inseridas pelo cliente antes do go-live.

## ARQUIVOS A GERAR (nesta ordem)

### \`src/assets/images/.gitkeep\`
(Arquivo vazio para manter a pasta no git)

### \`src/components/SEO.astro\`
(Props: title, description, image?, canonicalURL? — gera todas as meta tags OG, Twitter Card, canonical)

### \`src/components/Header.astro\`
(Logo ou nome em texto, navegação interna com smooth scroll para IDs das seções, CTA WhatsApp, menu mobile hamburger funcional com Tailwind)

### \`src/components/Footer.astro\`
(Nome da empresa, links de navegação, WhatsApp, e-mail, Instagram se disponível, copyright, texto de rodapé)

### \`src/components/WhatsAppFloat.astro\`
(Botão flutuante WhatsApp fixo no canto inferior direito — link \`wa.me/${B.whatsapp || '[WHATSAPP]'}\`)

### \`src/scripts/animations.ts\`
(Inicialização GSAP + ScrollTrigger + Lenis — exporta função \`initAnimations()\` que o index.astro chama)

---

REGRAS:
1. Código 100% completo, sem placeholders de lógica
2. PROIBIDO px — use rem
3. Responsive (mobile-first)
4. ARIA labels em todos os elementos interativos
5. WhatsApp link com mensagem pré-preenchida: "${B.whatsapp_mensagem_padrao || 'Olá! Quero saber mais.'}"

Formato: título \`### \\\`caminho/arquivo\\\`\` seguido do bloco de código.
    `.trim();
  },

  buildImplPromptParte3() {
    const B = this.B || {};
    const fichaArte = (() => {
      try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); }
      catch { return {}; }
    })();

    const estrutura = B.estrutura_aprovada || B.estrutura_rascunho || '';

    return `
Você é um Copywriter Sênior e engenheiro front-end especializado em landing pages de alta conversão em Astro 4.x.

## SUA TAREFA — PARTE 3 DE 4: SEÇÕES DA LANDING PAGE

Esta parte assume que as PARTES 1 e 2 já foram implementadas.
\`Button.astro\`, \`Header.astro\`, \`Footer.astro\`, \`globals.css\` já existem e funcionam.

## DADOS DO CLIENTE

- **Nome:** ${B.nome_cliente || 'Profissional'}
- **Segmento:** ${B.segmento || ''}
- **Nicho:** ${B.nicho || ''}
- **WhatsApp:** ${B.whatsapp || ''}
- **Mensagem WhatsApp:** ${B.whatsapp_mensagem_padrao || 'Olá! Quero saber mais.'}
- **Cor primária:** ${B.arte_cor_principal || fichaArte?.paleta?.primaria || '#6366f1'}
- **Tom visual:** ${fichaArte?.tom_visual || 'moderno e profissional'}
- **Intensidade visual:** ${B.arte_intensidade || fichaArte?.intensidade || 'medio'}
- **Elementos visuais:** ${fichaArte?.elementos_visuais || ''}
- **Tipografia display:** ${fichaArte?.tipografia?.display || 'Inter'}

## ESTRUTURA DA PÁGINA APROVADA (COPY REAL — USE EXATAMENTE ESTA)

${estrutura.substring(0, 6000)}

---

## INSTRUÇÕES DE GERAÇÃO

Para CADA bloco da estrutura acima, gere 1 componente .astro em \`src/components/sections/\`.

REGRAS CRÍTICAS:
1. **USE A COPY REAL DA ESTRUTURA** — não invente títulos, subtítulos ou CTAs diferentes
2. **PRIMEIRA PESSOA DO SINGULAR** em toda a copy — "Eu ajudo...", nunca "Ela atende..."
3. **CTAs com links reais** — WhatsApp \`wa.me/${B.whatsapp || '[WHATSAPP]'}\` com mensagem encodada
4. **PROIBIDO px** — use rem para tudo
5. **Animações GSAP** — cada seção tem entrada com ScrollTrigger
6. **Imagens** — use \`<img src="../../assets/images/[nome].webp"\` com \`loading="lazy"\` e \`alt\` descritivo
7. **Componente isolado** — cada seção é auto-contida, importa Button se precisar de CTA

## FORMATO DE RESPOSTA

Para cada bloco da estrutura aprovada, gere:

### \`src/components/sections/[NomeDoBloco].astro\`
\`\`\`astro
---
import Button from '../ui/Button.astro';
---
<section id="[id-da-secao]" class="...">
  ...
</section>
<script>
  // Animação GSAP
</script>
\`\`\`

Gere TODOS os componentes de seção baseados na estrutura aprovada acima.
    `.trim();
  },

  buildImplPromptParte4() {
    const B = this.B || {};
    const fichaArte = (() => {
      try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); }
      catch { return {}; }
    })();

    // Extrair nomes das seções da estrutura para montar o index
    const estrutura = B.estrutura_aprovada || B.estrutura_rascunho || '';
    const blocos = [];
    const blocoRegex = /### BLOCO\s*\d+[:\-–]?\s*(.+?)(?:\n|$)/gi;
    let m;
    while ((m = blocoRegex.exec(estrutura)) !== null) {
      const nome = m[1].trim();
      // Ignorar cabeçalho e rodapé (já são Header/Footer)
      if (!/cabeçalho|header|rodapé|footer/i.test(nome)) {
        blocos.push(nome);
      }
    }

    return `
Você é um engenheiro front-end sênior especializado em Astro 4.x, SEO e performance web.

## SUA TAREFA — PARTE 4 DE 4: PÁGINA FINAL, SEO & DEPLOY

Esta parte assume que as PARTES 1, 2 e 3 já foram implementadas.
Todos os componentes de seção já existem em \`src/components/sections/\`.

## DADOS DO PROJETO

- **Nome:** ${B.nome_cliente || 'Projeto'}
- **Domínio:** ${B.dominio || '[DOMINIO]'}
- **Título SEO:** ${B.titulo_seo || B.nome_cliente || 'Landing Page'}
- **Descrição SEO:** ${B.descricao_seo || ''}
- **Palavra-chave principal:** ${B.palavra_chave_principal || ''}
- **Palavras-chave secundárias:** ${B.palavras_chave_secundarias || ''}
- **Segmento:** ${B.segmento || ''}
- **Cidade/Estado:** ${[B.cidade, B.estado].filter(Boolean).join(', ') || ''}
- **Schema tipo:** ${B.schema_tipo || 'LocalBusiness'}
- **GTM ID:** [GTM_ID] (o cliente deve preencher)
- **Cor primária:** ${B.arte_cor_principal || fichaArte?.paleta?.primaria || '#6366f1'}

## SEÇÕES DA LANDING PAGE (na ordem da estrutura aprovada)

${blocos.length > 0 ? blocos.map((b, i) => `${i + 1}. ${b}`).join('\n') : estrutura.substring(0, 800)}

## ARQUIVOS A GERAR

### \`src/pages/index.astro\`
(Importa e monta todos os componentes na ordem da estrutura aprovada — Header, seções, WhatsAppFloat, Footer)
(Passa props de SEO via componente SEO.astro)
(Chama initAnimations() no script client:load)

### \`src/pages/obrigado.astro\`
(Página de agradecimento simples — pós-conversão WhatsApp/formulário — com botão voltar para home)

### \`public/robots.txt\`
(Allow: / para todos os bots, Sitemap: https://${B.dominio || '[DOMINIO]'}/sitemap-index.xml)

### \`public/manifest.json\`
(PWA manifest básico com nome, cores e ícones)

### \`vercel.json\`
(Configuração de headers de cache e redirect de www para apex)

## INSTRUÇÕES FINAIS PARA O ROO

Após implementar todos os arquivos das 4 partes, execute:

\`\`\`bash
npm install
npx astro check
npm run build
\`\`\`

Se \`astro check\` retornar erros de tipo, corrija antes de continuar.
Se \`npm run build\` falhar por imagem ausente, verifique se os placeholders da PARTE 2 foram criados.

## CAMPOS QUE O CLIENTE DEVE PREENCHER ANTES DO GO-LIVE

- \`[DOMINIO]\` → Domínio real (ex: anaesternutricionista.com.br)
- \`[GTM_ID]\` → ID do Google Tag Manager (ex: GTM-XXXXXXX)
- Imagens em \`src/assets/images/\` → Substituir placeholders pelas fotos reais

Formato: título \`### \\\`caminho/arquivo\\\`\` seguido do bloco de código.
    `.trim();
  },
```

---

## ETAPA 2 — SUBSTITUIR `assets/js/screens/estrutura.js`

Substituir o arquivo inteiro pelo código abaixo.

> ⚠️ Este arquivo remove `gerarWireframeHTML()` e toda a lógica de wireframe. Substitui por visualização de blocos de copy.

```javascript
/* ============================================================
   LandingAI v2 — Screen: Estrutura da LP
   ============================================================ */

Object.assign(window.App, {

  renderEstrutura() {
    const B = this.B || {};
    const rascunho  = B.estrutura_rascunho || '';
    const aprovada  = B.estrutura_aprovada || '';

    return `
    <div class="estrutura-screen">

      ${aprovada ? `
      <div class="aprovado-banner">
        <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--accent)"></i>
        <span>Estrutura aprovada</span>
        <button class="btn-ghost btn-sm" onclick="App.setField('estrutura_aprovada', ''); App.renderScreen();">
          Reeditar
        </button>
      </div>
      ` : ''}

      <div class="estrutura-layout">

        <!-- ── COLUNA ESQUERDA: controles ─────────────────────── -->
        <div class="estrutura-col-controls">

          <!-- Card: Gerar com IA -->
          <div class="estrutura-section-card">
            <div class="estrutura-section-header">
              <i data-lucide="sparkles" style="width:15px;height:15px;color:var(--accent2)"></i>
              <span class="estrutura-section-title">Gerar com IA</span>
            </div>
            <p class="estrutura-section-desc">
              A IA lê o briefing completo e define a sequência de blocos, copy de cada seção e ordem narrativa.
            </p>
            <button class="btn-primary" id="btn-run-estrutura" ${aprovada ? 'disabled' : ''}>
              <i data-lucide="cpu" style="width:15px;height:15px"></i>
              ${rascunho && !aprovada ? 'Gerar Novamente' : 'Gerar Estrutura'}
            </button>
            <button class="btn-ghost btn-sm" style="margin-top:8px" onclick="App.abrirEstruturaManual()" ${aprovada ? 'disabled' : ''}>
              <i data-lucide="edit-3" style="width:13px;height:13px"></i>
              Preencher manualmente
            </button>
          </div>

          <!-- Card: Rascunho em texto -->
          ${rascunho ? `
          <div class="estrutura-section-card">
            <div class="estrutura-section-header">
              <i data-lucide="file-text" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Rascunho</span>
            </div>
            <p class="estrutura-section-desc">
              Edite diretamente o texto se quiser ajustar algo pontualmente, ou use o campo de Refinamento abaixo para pedir ajuda à IA.
            </p>
            <textarea
              class="field-textarea estrutura-textarea"
              data-field="estrutura_rascunho"
              rows="14"
              ${aprovada ? 'disabled' : ''}
            >${rascunho}</textarea>
            ${!aprovada ? `
            <button class="btn-primary" style="margin-top:12px;width:100%" id="btn-approve-estrutura">
              <i data-lucide="check" style="width:15px;height:15px"></i>
              Aprovar Estrutura
            </button>
            ` : ''}
          </div>
          ` : ''}

          <!-- Card: Refinar com IA -->
          ${rascunho && !aprovada ? `
          <div class="estrutura-section-card estrutura-feedback-card">
            <div class="estrutura-section-header">
              <i data-lucide="message-square" style="width:15px;height:15px;color:var(--accent)"></i>
              <span class="estrutura-section-title">Refinar com IA</span>
            </div>
            <p class="estrutura-section-desc">
              Não gostou de algum ponto? Descreva o ajuste e a IA refina mantendo o briefing original.
              Funciona como uma conversa — você pode pedir várias vezes.
            </p>
            <textarea
              class="field-textarea"
              id="estrutura-feedback-input"
              rows="4"
              placeholder="Ex: O Hero ficou muito técnico, quero mais direto e urgente. O CTA deve mencionar o WhatsApp..."
            ></textarea>
            <button class="btn-primary" id="btn-refinar-estrutura" style="margin-top:10px;width:100%">
              <i data-lucide="refresh-cw" style="width:14px;height:14px"></i>
              Refinar com IA
            </button>
          </div>
          ` : ''}

        </div>

        <!-- ── COLUNA DIREITA: visualização dos blocos ─────────── -->
        <div class="estrutura-col-preview">
          <div class="estrutura-section-card estrutura-preview-card">
            <div class="estrutura-section-header">
              <i data-lucide="layout-template" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Visualização dos Blocos</span>
            </div>

            ${rascunho ? `
            <div class="estrutura-blocos-container">
              ${this.renderBlocosVisuais(rascunho)}
            </div>
            ` : `
            <div class="estrutura-preview-empty">
              <i data-lucide="layout" style="width:32px;height:32px;color:var(--text-disabled)"></i>
              <p>A visualização dos blocos aparece após gerar a estrutura</p>
            </div>
            `}
          </div>
        </div>

      </div>
    </div>
    `;
  },

  /* ----------------------------------------------------------
     renderBlocosVisuais — converte o rascunho markdown em
     cards visuais com a copy real de cada bloco.
  ---------------------------------------------------------- */
  renderBlocosVisuais(rascunho) {
    if (!rascunho) return '';

    // Parser: extrai blocos no formato ### BLOCO N: Nome
    const blocoRegex = /###\s*BLOCO\s*\d+[:\-–]?\s*(.+?)[\r\n]+([\s\S]*?)(?=###\s*BLOCO|\n#{1,3}\s*SEQUÊNCIA|$)/gi;
    const blocos = [];
    let match;

    while ((match = blocoRegex.exec(rascunho)) !== null) {
      const nome  = match[1].trim();
      const corpo = match[2].trim();
      blocos.push({ nome, corpo });
    }

    // Se não encontrou blocos formatados, renderiza o texto bruto
    if (blocos.length === 0) {
      return `
        <div class="bloco-visual bloco-raw">
          <p style="font-size:13px;color:var(--text-secondary);white-space:pre-wrap;line-height:1.6;">${rascunho.substring(0, 2000)}</p>
        </div>
      `;
    }

    return blocos.map((b, i) => {
      // Extrair campos do corpo
      const extrair = (chaves, fallback = '') => {
        for (const chave of chaves) {
          const rx = new RegExp(`(?:${chave})[:\\s]+[""]?(.+?)[""]?(?:[\\r\\n]|$)`, 'i');
          const r  = b.corpo.match(rx);
          if (r?.[1]?.trim()) return r[1].trim();
        }
        return fallback;
      };

      // Extrair copy multi-linha (body)
      const extrairMultilinha = (chaves) => {
        for (const chave of chaves) {
          const rx = new RegExp(`(?:${chave})[:\\s]+([\\s\\S]+?)(?=\\n\\*\\*|\\n###|$)`, 'i');
          const r  = b.corpo.match(rx);
          if (r?.[1]?.trim()) {
            // Limpar markdown básico (bullets, negrito)
            return r[1].trim()
              .replace(/^[-*]\s+/gm, '')
              .replace(/\*\*/g, '')
              .replace(/\n+/g, ' ')
              .substring(0, 300);
          }
        }
        return '';
      };

      const objetivo  = extrair(['Objetivo narrativo', 'Objetivo', 'Propósito']);
      const titulo    = extrair(['Título', 'H1', 'Headline', 'Heading']);
      const subtitulo = extrair(['Subtítulo', 'Subtitle', 'Sub-título']);
      const cta       = extrair(['CTA', 'Botão', 'Call to action', 'Ação']);
      const body      = extrairMultilinha(['Body', 'Corpo', 'Copy adicional', 'Copy sugerida']);
      const condicional = extrair(['Condicional', 'Justificativa', 'Por que']);

      // Tipo para estilo do badge
      const tipoBloco = this.detectarTipoBloco(b.nome);
      const badgeClass = `bloco-badge-${tipoBloco}`;

      return `
        <div class="bloco-visual">
          <div class="bloco-visual-header">
            <span class="bloco-visual-num">${i + 1}</span>
            <span class="bloco-visual-nome ${badgeClass}">${b.nome}</span>
          </div>

          ${objetivo ? `
          <div class="bloco-visual-row bloco-objetivo">
            <span class="bloco-label">Objetivo</span>
            <span class="bloco-value">${objetivo}</span>
          </div>` : ''}

          ${titulo ? `
          <div class="bloco-visual-row bloco-titulo-row">
            <span class="bloco-label">Título</span>
            <strong class="bloco-titulo-text">${titulo}</strong>
          </div>` : ''}

          ${subtitulo ? `
          <div class="bloco-visual-row">
            <span class="bloco-label">Subtítulo</span>
            <span class="bloco-value">${subtitulo}</span>
          </div>` : ''}

          ${body && !subtitulo ? `
          <div class="bloco-visual-row">
            <span class="bloco-label">Copy</span>
            <span class="bloco-value">${body}</span>
          </div>` : ''}

          ${cta ? `
          <div class="bloco-visual-row bloco-cta-row">
            <span class="bloco-label">CTA</span>
            <span class="bloco-cta-pill">${cta}</span>
          </div>` : ''}

          ${condicional ? `
          <div class="bloco-visual-row bloco-condicional">
            <span class="bloco-label">Por quê</span>
            <span class="bloco-value">${condicional}</span>
          </div>` : ''}
        </div>
      `;
    }).join('');
  },

  detectarTipoBloco(nome) {
    const n = nome.toLowerCase();
    if (n.includes('cabeçalho') || n.includes('header') || n.includes('nav')) return 'header';
    if (n.includes('hero'))                                                     return 'hero';
    if (n.includes('como funciona') || n.includes('passo'))                    return 'steps';
    if (n.includes('diferencial') || n.includes('benefício'))                  return 'features';
    if (n.includes('plano') || n.includes('preço'))                            return 'pricing';
    if (n.includes('depoimento') || n.includes('prova'))                       return 'testimonial';
    if (n.includes('avaliação') || n.includes('google'))                       return 'reviews';
    if (n.includes('faq'))                                                      return 'faq';
    if (n.includes('contato') || n.includes('formulário'))                     return 'contact';
    if (n.includes('cta') || n.includes('chamada final'))                      return 'cta';
    if (n.includes('localização') || n.includes('mapa'))                       return 'map';
    if (n.includes('instagram') || n.includes('feed'))                         return 'instagram';
    if (n.includes('rodapé') || n.includes('footer'))                          return 'footer';
    return 'generic';
  },

  reabrirEstrutura() {
    this.setField('estrutura_aprovada', '');
    this.renderScreen();
    this.showToast('Estrutura reaberta para edição.', 'info');
  },

  abrirEstruturaManual() {
    const template = `### BLOCO 1: Cabeçalho
**Objetivo narrativo:** Âncora de marca e CTA sempre visível
**Copy sugerida:**
- Título: "[Nome da marca]"
- CTA: "[Falar no WhatsApp]"
**Layout sugerido:** Logo à esquerda, nav central, CTA à direita
**Condicional:** Sempre presente

---
### BLOCO 2: Hero — Impacto Inicial
**Objetivo narrativo:** Capturar atenção e justificar o clique do anúncio em 3 segundos
**Copy sugerida:**
- Título: "[H1 focada na dor de busca]"
- Subtítulo: "[Ampliar o benefício em 1 linha]"
- CTA: "[Quero resolver isso agora]"
**Layout sugerido:** Texto à esquerda, imagem à direita. Full-width em mobile.
**Condicional:** Sempre presente

---
### SEQUÊNCIA FINAL
1. Cabeçalho
2. Hero
`;
    this.setField('estrutura_rascunho', template);
    this.renderScreen();
  },

});
```

---

## ETAPA 3 — ADICIONAR MÉTODOS NO FINAL DE `assets/js/screens/review.js`

> ⚠️ Estes métodos são adicionados ao `review.js` pois fazem parte da lógica de montagem do DOC-1 e podem precisar acessar `buildDoc1()`. NÃO altere nenhum método existente.

**Localizar o final do arquivo**, antes do `});` final, e adicionar:

```javascript
  /* ----------------------------------------------------------
     Seção de Protótipo Visual — REMOVIDA
     (gerarPrototipoVisual e showModalPrototipoFallback
      foram descontinuados nesta versão)
  ---------------------------------------------------------- */

  // Mantido apenas para compatibilidade — não faz nada
  gerarPrototipoVisual() {
    this.showToast('Geração de protótipo visual não disponível nesta versão.', 'info');
  },
```

> **NOTA:** Se `gerarPrototipoVisual()` já existir no arquivo, substitua o corpo pelo acima. Não duplique o método.

---

## ETAPA 4 — ADICIONAR CSS EM `assets/css/03-screens.css`

Adicionar ao **final** do arquivo:

```css
/* ============================================================
   Visualização de Blocos — Tela de Estrutura
   ============================================================ */

.estrutura-blocos-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 70vh;
  overflow-y: auto;
  padding: 0.25rem 0.125rem;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.estrutura-blocos-container::-webkit-scrollbar { width: 4px; }
.estrutura-blocos-container::-webkit-scrollbar-track { background: transparent; }
.estrutura-blocos-container::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* Card individual de bloco */
.bloco-visual {
  background: var(--bg-secondary, #0d0f1a);
  border: 1px solid var(--border, rgba(255,255,255,0.08));
  border-radius: 10px;
  padding: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.bloco-visual:hover {
  border-color: var(--accent, #00e5a0);
  box-shadow: 0 0 0 1px rgba(0, 229, 160, 0.1);
}

/* Header do bloco */
.bloco-visual-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid var(--border, rgba(255,255,255,0.06));
}

.bloco-visual-num {
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent, #00e5a0);
  color: #031a10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.bloco-visual-nome {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary, #eceef5);
  line-height: 1.3;
}

/* Badge colorido por tipo de bloco */
.bloco-badge-hero        { color: var(--accent2, #a78bfa); }
.bloco-badge-header      { color: var(--text-secondary, #848698); }
.bloco-badge-cta         { color: var(--accent, #00e5a0); }
.bloco-badge-testimonial { color: #f59e0b; }
.bloco-badge-pricing     { color: #10b981; }
.bloco-badge-steps       { color: #3b82f6; }
.bloco-badge-features    { color: #8b5cf6; }
.bloco-badge-faq         { color: #6366f1; }
.bloco-badge-footer      { color: var(--text-disabled, #4a4d5e); }
.bloco-badge-generic     { color: var(--text-primary, #eceef5); }

/* Rows de conteúdo */
.bloco-visual-row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: baseline;
}

.bloco-visual-row:last-child { margin-bottom: 0; }

.bloco-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-disabled, #4a4d5e);
  padding-top: 2px;
  flex-shrink: 0;
}

.bloco-value {
  font-size: 12.5px;
  color: var(--text-secondary, #848698);
  line-height: 1.55;
}

/* Título em destaque */
.bloco-titulo-row .bloco-titulo-text {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary, #eceef5);
  line-height: 1.35;
}

/* Objetivo em itálico */
.bloco-objetivo .bloco-value {
  font-style: italic;
  font-size: 12px;
  color: var(--text-disabled, #4a4d5e);
}

/* CTA pill */
.bloco-cta-row { align-items: center; }

.bloco-cta-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: rgba(0, 229, 160, 0.1);
  border: 1px solid rgba(0, 229, 160, 0.25);
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--accent, #00e5a0);
}

/* Condicional discreto */
.bloco-condicional .bloco-value {
  font-size: 11.5px;
  color: var(--text-disabled, #4a4d5e);
}

/* Bloco com texto bruto (quando parsing falhar) */
.bloco-raw {
  border-style: dashed;
}

/* Empty state */
.estrutura-preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-disabled, #4a4d5e);
  font-size: 13px;
}
```

---

## ETAPA 5 — VALIDAÇÃO

Após implementar todas as etapas, verificar:

### Tela de Estrutura
- [ ] Botão "Gerar Estrutura" chama a IA e retorna texto com blocos
- [ ] Copy está em 1ª pessoa (ex: "Eu ajudo...", "Meu método...")
- [ ] Visualização dos blocos aparece na coluna direita após geração
- [ ] Cada bloco mostra: número, nome, objetivo, título, subtítulo, CTA
- [ ] Textarea do rascunho permite edição direta
- [ ] Botão "Refinar com IA" abre o campo de feedback
- [ ] Após feedback, IA regenera e visualização atualiza
- [ ] Botão "Aprovar Estrutura" bloqueia edição e mostra banner de aprovado
- [ ] Botão "Reeditar" reabre para edição

### Review — Geração do DOC-IMPL
- [ ] Botão "Gerar Ficha de Implementação" inicia o AI Log com 5 steps
- [ ] 4 chamadas de IA ocorrem sequencialmente (aguardar cada uma)
- [ ] Ao final, 4 arquivos .md são baixados automaticamente
- [ ] Nomes dos arquivos: `doc-impl-[slug]-parte1-fundacao.md`, `...-parte2-componentes.md`, `...-parte3-secoes.md`, `...-parte4-pagina.md`
- [ ] Toast final indica "Implemente na ordem: Parte 1 → 2 → 3 → 4"

### Não deve estar presente
- [ ] Seção de "Protótipo Visual" na Review não deve ser clicável (ou não aparece)
- [ ] Wireframe antigo não aparece mais na tela de estrutura

---

## NOTAS PARA O ROO

1. **Não alterar** `app.js`, `01-state.js`, `03-ui.js`, `structure.js`, `steps.js`
2. **Não alterar** a ordem dos `<script>` no `index.html`
3. **Não alterar** nenhum ID listado como crítico na arquitetura
4. Se encontrar `buildImplPrompt()` em `review.js` → pode deixar, pois o novo `generateDocImpl()` em `04-handlers.js` não o chama mais
5. Se `handleGenerateDocImpl()` existir em `review.js` → pode deixar também, não é chamado pelo novo fluxo
6. O `downloadText()` já existe em `04-handlers.js` — não duplicar
7. Após implementar, testar o fluxo completo: Intake → Steps → Arte → Estrutura → Refinar → Aprovar → Review → Gerar DOC-IMPL

---

*Blueprint gerado pelo AIGator — LandingAI v2*
