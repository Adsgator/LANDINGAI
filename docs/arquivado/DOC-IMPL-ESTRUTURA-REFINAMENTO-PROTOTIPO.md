# DOC-IMPL — Refinamento de Estrutura com IA + Protótipo Visual na Review
## AIGator LandingAI — Documento para o Roo Implementar

**Data:** 07/05/2026  
**Status:** Pronto para implementação  
**Risco:** Baixo — apenas adições cirúrgicas, nenhum arquivo crítico alterado

---

## RESUMO DO QUE SERÁ IMPLEMENTADO

1. **Loop de refinamento na tela Estrutura** — Após gerar a estrutura, o usuário pode dar feedback em linguagem natural ("o tom ficou muito formal, ajusta o CTA") e a IA refina mantendo o briefing original. Funciona como uma conversa.
2. **Wireframe com parser melhorado** — Extrai título, subtítulo e CTA reais do output da IA de forma mais robusta.
3. **Seção de pré-visualização da Estrutura na Review** — Mostra o wireframe aprovado (visual, não editável) com botão para voltar e ajustar.
4. **Protótipo Visual na Review** — Botão que gera uma imagem de protótipo via Pollinations.ai (100% gratuito, sem necessidade de API key). O protótipo ajuda a validar a direção geral antes de gerar o DOC-IMPL.

---

## REGRAS PARA O ROO

- **NÃO alterar** `app.js`, `01-state.js`, `03-ui.js`, `structure.js`, `steps.js`
- **NÃO alterar** a ordem dos `<script>` no `index.html`
- **NÃO remover** nenhum método existente — apenas adicionar
- **SEMPRE** rodar `lucide.createIcons()` após inserir HTML dinâmico
- **SEMPRE** usar `App.setField()` para persistir dados no briefing
- Todos os comentários devem ser em PT-BR

---

## ARQUIVO 1: `assets/js/screens/estrutura.js`

### 1.1 — SUBSTITUIÇÃO: Melhorar o parser do wireframe (linhas 108–128)

**LOCALIZAR exatamente este bloco:**

```javascript
  gerarWireframeHTML(rascunho) {
    if (!rascunho) return '';

    // Parser de blocos: cada bloco começa com ### BLOCO N:
    const blocoRegex = /###\s*BLOCO\s*\d+:\s*(.+?)(?:\n)([\s\S]*?)(?=###\s*BLOCO|\nSEQUÊNCIA|$)/gi;
    const blocos = [];
    let match;

    while ((match = blocoRegex.exec(rascunho)) !== null && blocos.length < 2) {
      const nome = match[1].trim();
      const corpo = match[2].trim();

      // Extrair titulo, subtitulo e cta do corpo do bloco
      const titulo = (corpo.match(/(?:Título|título|H1|heading):\s*"?(.+?)"?(?:\n|$)/i) || [])[1]?.trim() || nome;
      const subtitulo = (corpo.match(/(?:Subtítulo|subtitulo|Sub):\s*"?(.+?)"?(?:\n|$)/i) || [])[1]?.trim() || '';
      const cta = (corpo.match(/CTA:\s*"?(.+?)"?(?:\n|$)/i) || [])[1]?.trim() || '';
      const objetivo = (corpo.match(/(?:Objetivo|objetivo).*?:\s*(.+?)(?:\n|$)/i) || [])[1]?.trim() || '';

      blocos.push({ nome, titulo, subtitulo, cta, objetivo, raw: corpo });
    }

    if (blocos.length === 0) return '';
```

**SUBSTITUIR POR:**

```javascript
  gerarWireframeHTML(rascunho) {
    if (!rascunho) return '';

    // Parser de blocos — suporta ### BLOCO N: e ## BLOCO N:
    const blocoRegex = /(?:###|##)\s*BLOCO\s*\d+[:\-–]?\s*(.+?)(?:\n)([\s\S]*?)(?=(?:###|##)\s*BLOCO|\nSEQUÊNCIA|$)/gi;
    const blocos = [];
    let match;

    while ((match = blocoRegex.exec(rascunho)) !== null && blocos.length < 2) {
      const nome = match[1].trim();
      const corpo = match[2].trim();

      // Extração flexível de campos — aceita com ou sem aspas, múltiplos rótulos
      const extrairCampo = (texto, chaves, fallback = '') => {
        for (const chave of chaves) {
          const regex = new RegExp(`(?:${chave})[:\\s]+[""]?(.+?)[""]?(?:\\n|$)`, 'i');
          const r = texto.match(regex);
          if (r?.[1]?.trim()) return r[1].trim().replace(/[""\[\]]/g, '');
        }
        // Fallback: pegar primeira linha entre aspas se houver
        const quoted = texto.match(/[""](.{10,100})[""]/);
        if (quoted?.[1]) return quoted[1].trim();
        return fallback;
      };

      const titulo    = extrairCampo(corpo, ['Título', 'título', 'H1', 'Heading', 'Manchete', 'Headline'], nome);
      const subtitulo = extrairCampo(corpo, ['Subtítulo', 'subtitulo', 'Sub', 'Subtitulo', 'Descrição curta']);
      const cta       = extrairCampo(corpo, ['CTA', 'Botão', 'Chamada para ação', 'Call to action']);
      const objetivo  = extrairCampo(corpo, ['Objetivo', 'Objetivo narrativo', 'Propósito']);

      blocos.push({ nome, titulo, subtitulo, cta, objetivo, raw: corpo });
    }

    if (blocos.length === 0) return '';
```

---

### 1.2 — ADIÇÃO: Seção de Refinamento na UI do `renderEstrutura()`

**LOCALIZAR exatamente este bloco (fim da coluna de controles, antes de `</div>` da col-controls):**

```javascript
        </div>

        <!-- Coluna: wireframe -->
```

**SUBSTITUIR POR:**

```javascript
          ${rascunho && !aprovada ? `
          <!-- Card de Refinamento com IA -->
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
              class="field-textarea estrutura-textarea"
              id="estrutura-feedback-input"
              rows="4"
              placeholder="Ex: O tom ficou muito formal, quero mais direto e urgente. Também muda o CTA do Hero para algo mais específico ao problema do cliente..."
            ></textarea>
            <button class="btn-primary" id="btn-refinar-estrutura" style="margin-top:10px;width:100%">
              <i data-lucide="refresh-cw" style="width:14px;height:14px"></i>
              Refinar Estrutura com IA
            </button>
          </div>
          ` : ''}

        </div>

        <!-- Coluna: wireframe -->
```

---

### 1.3 — ADIÇÃO: Métodos `refinarEstrutura()` e `buildResumoBriefing()`

**LOCALIZAR exatamente este método:**

```javascript
  reabrirEstrutura() {
```

**INSERIR ANTES DELE (os dois novos métodos completos):**

```javascript
  // ─── Refinamento de Estrutura com IA (loop de feedback) ──────────────────
  async refinarEstrutura() {
    const feedbackInput = document.getElementById('estrutura-feedback-input');
    const feedback = feedbackInput?.value?.trim();

    if (!feedback) {
      this.showToast('Descreva o que deseja ajustar antes de refinar.', 'warning');
      feedbackInput?.focus();
      return;
    }

    const rascunhoAtual = this.B.estrutura_rascunho || '';
    if (!rascunhoAtual) {
      this.showToast('Gere a estrutura primeiro antes de refinar.', 'warning');
      return;
    }

    this.openAILog('Refinando Estrutura', [
      { id: 1, label: 'Analisando seu feedback...' },
      { id: 2, label: 'Ajustando estrutura e copy...' },
      { id: 3, label: 'Atualizando pré-visualização...' },
    ]);

    this.aiLogStep(1);
    await this.aiLogDelay(500);

    const resumoBriefing = this.buildResumoBriefing();

    const prompt = `Você é especialista em copywriting e estrutura de landing pages de alta conversão.

## CONTEXTO
Você gerou anteriormente a seguinte estrutura de landing page para um cliente:

${rascunhoAtual}

## FEEDBACK DO CLIENTE (APLICAR OBRIGATORIAMENTE)
${feedback}

## SUA TAREFA
1. Revise a estrutura acima aplicando EXATAMENTE o que foi pedido no feedback.
2. Mantenha a mesma formatação: ### BLOCO N: NOME DO BLOCO
3. Mantenha todos os blocos existentes — apenas ajuste o conteúdo pedido.
4. Não invente dados que não estão no briefing abaixo.
5. Retorne SOMENTE a estrutura revisada, sem explicações antes ou depois.
6. Se o feedback pedir mudança de tom, ajuste TODA a copy de acordo.

## BRIEFING DO CLIENTE (referência)
${resumoBriefing}`;

    this.aiLogStep(2, 'Isso pode levar alguns segundos...');

    try {
      const res = await this.callAI(prompt);

      this.aiLogStep(3);
      await this.aiLogDelay(400);

      this.setField('estrutura_rascunho', res);
      this.setField('estrutura_wireframe', this.gerarWireframeHTML(res));

      this.aiLogDone();
      await this.aiLogDelay(500);
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura refinada! Confira o resultado.', 'success');
    } catch (err) {
      this.aiLogError(2, err.message || 'Erro ao refinar. Tente novamente.');
    }
  },

  // ─── Resumo compacto do briefing para uso no prompt de refinamento ────────
  buildResumoBriefing() {
    const B = this.B || {};
    return [
      `Cliente: ${B.nome_cliente || '—'}`,
      `Segmento: ${B.segmento || '—'}`,
      `Serviço principal: ${B.servico_principal || '—'}`,
      `Público-alvo: ${B.publico_alvo || '—'}`,
      `Dor principal: ${B.dor_principal || '—'}`,
      `Desejo principal: ${B.desejo_principal || '—'}`,
      `Tom de comunicação: ${B.tom_comunicacao || '—'}`,
      `Diferencial 1: ${B.diferencial1_titulo || '—'} — ${B.diferencial1_descricao || '—'}`,
      `Diferencial 2: ${B.diferencial2_titulo || '—'} — ${B.diferencial2_descricao || '—'}`,
      `Garantia: ${B.garantia || '—'}`,
      `WhatsApp / CTA: ${B.whatsapp || '—'}`,
    ].join('\n');
  },

  reabrirEstrutura() {
```

> ⚠️ **ATENÇÃO ROO:** O método `reabrirEstrutura()` original continua intacto logo abaixo. Você está apenas inserindo os dois novos métodos antes dele.

---

### 1.4 — REMOÇÃO: Mover `gerarPrototipoVisual()` e `showModalPrototipoFallback()` da estrutura.js

O protótipo agora ficará na tela de Review (review.js). Os métodos `gerarPrototipoVisual()` e `showModalPrototipoFallback()` que existem em `estrutura.js` (linhas ~221–347) devem ser **removidos** de `estrutura.js`, pois serão recriados em `review.js` com nova lógica usando Pollinations.ai.

**LOCALIZAR e REMOVER completamente este bloco em estrutura.js:**

```javascript
  async gerarPrototipoVisual() {
    const B = this.B || {};
    const rascunho = B.estrutura_rascunho || '';

    if (!rascunho) {
      this.showToast('Gere a estrutura antes do protótipo visual.', 'warning');
      return;
    }

    const hasGemini = this.state.apiKeys?.gemini?.trim();
    if (!hasGemini) {
      this.showToast('Protótipo visual requer API Key Gemini (gratuita).', 'warning');
      return;
    }
    // ... (todo o método até o final do catch)
  },

  showModalPrototipoFallback(erroMsg) {
    // ... (todo o método)
  },
```

> **Remova ambos os métodos completamente.** Se houver qualquer referência a `btn-gerar-prototipo` na tela de estrutura no HTML, ela também deve ser removida (mas pela arquitetura atual não há — o botão nunca chegou ao HTML da tela).

---

## ARQUIVO 2: `assets/js/screens/review.js`

### 2.1 — ADIÇÃO: Seção de Wireframe + Protótipo em `buildReviewScreen()`

**LOCALIZAR exatamente este bloco na review:**

```javascript
          <div class="review-actions-hero">
            <button id="btn-generate-docimpl" class="btn-primary btn-xl" ${this.state.isGenerating ? 'disabled' : ''}>
              <i data-lucide="sparkles"></i>
              ${this.state.isGenerating ? 'Gerando Ficha de Implementação...' : 'Gerar Ficha de Implementação (DOC-IMPL)'}
            </button>
            <p class="review-action-hint">A IA vai ler o briefing completo e criar todo o código base, design system e copy.</p>
          </div>
```

**SUBSTITUIR POR (adiciona as duas seções novas ANTES do botão de gerar):**

```javascript
          <!-- ═══ SEÇÃO: Pré-visualização da Estrutura ═══ -->
          <div class="review-estrutura-section">
            <div class="review-section-label">
              <i data-lucide="layout" style="width:14px;height:14px;color:var(--accent2)"></i>
              <span>Estrutura da Landing Page</span>
            </div>

            ${B.estrutura_wireframe ? `
            <div class="review-wireframe-wrap">
              <div class="estrutura-browser-bar">
                <span class="preview-dot-r"></span>
                <span class="preview-dot-y"></span>
                <span class="preview-dot-g"></span>
                <span class="estrutura-url-bar">${(B.dominio || 'seusite.com.br').replace(/^https?:\/\//, '')}</span>
              </div>
              <div class="review-wireframe-body">
                ${B.estrutura_wireframe}
              </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:8px;align-items:center;">
              <span style="font-size:11px;color:var(--text-secondary);">
                ${B.estrutura_aprovada ? '✅ Estrutura aprovada' : '⚠️ Estrutura não aprovada'}
              </span>
              <button class="btn-ghost btn-sm" onclick="App.goToScreen('estrutura')" style="margin-left:auto;">
                <i data-lucide="edit-3" style="width:12px;height:12px"></i>
                Ajustar Estrutura
              </button>
            </div>
            ` : `
            <div class="review-pending-alert">
              <i data-lucide="alert-triangle" style="width:15px;height:15px;color:var(--warning)"></i>
              <span>Estrutura ainda não definida.</span>
              <button class="btn-ghost btn-sm" onclick="App.goToScreen('estrutura')">
                Ir para Estrutura →
              </button>
            </div>
            `}
          </div>

          <!-- ═══ SEÇÃO: Protótipo Visual ═══ -->
          <div class="review-prototipo-section">
            <div class="review-section-label">
              <i data-lucide="image" style="width:14px;height:14px;color:var(--accent)"></i>
              <span>Protótipo Visual</span>
              <span class="review-badge-free">Gratuito</span>
            </div>
            <p class="review-prototipo-desc">
              Gere uma prévia visual de como a landing page pode ficar, levando em conta a estrutura, copy e direção de arte definidas.
              Não é o design final — serve para validar a direção antes de implementar.
            </p>

            ${B.prototipo_url ? `
            <div class="prototipo-resultado">
              <img
                src="${B.prototipo_url}"
                class="prototipo-img"
                alt="Protótipo da Landing Page"
                onerror="this.style.display='none';document.getElementById('prototipo-erro').style.display='flex';"
              >
              <div id="prototipo-erro" class="prototipo-erro" style="display:none;">
                <i data-lucide="image-off" style="width:24px;height:24px;color:var(--text-disabled)"></i>
                <span>Imagem não carregou. Tente gerar novamente.</span>
              </div>
              <div class="prototipo-actions">
                <button class="btn-ghost btn-sm" id="btn-gerar-prototipo">
                  <i data-lucide="refresh-cw" style="width:13px;height:13px"></i>
                  Gerar Novo Protótipo
                </button>
                <a href="${B.prototipo_url}" target="_blank" class="btn-ghost btn-sm">
                  <i data-lucide="external-link" style="width:13px;height:13px"></i>
                  Ver em tamanho real
                </a>
                <button class="btn-ghost btn-sm danger-subtle" onclick="App.setField('prototipo_url','');App.renderScreen();">
                  <i data-lucide="trash-2" style="width:13px;height:13px"></i>
                  Remover
                </button>
              </div>
            </div>
            ` : `
            <div class="prototipo-generate-area">
              <button class="btn-secondary" id="btn-gerar-prototipo">
                <i data-lucide="sparkles" style="width:15px;height:15px"></i>
                Gerar Protótipo Visual
              </button>
              <p class="prototipo-hint">
                Powered by Pollinations AI · Gratuito · Sem necessidade de API key
              </p>
            </div>
            `}
          </div>

          <!-- ═══ Botão principal: Gerar DOC-IMPL ═══ -->
          <div class="review-actions-hero">
            <button id="btn-generate-docimpl" class="btn-primary btn-xl" ${this.state.isGenerating ? 'disabled' : ''}>
              <i data-lucide="sparkles"></i>
              ${this.state.isGenerating ? 'Gerando Ficha de Implementação...' : 'Gerar Ficha de Implementação (DOC-IMPL)'}
            </button>
            <p class="review-action-hint">A IA vai ler o briefing completo e criar todo o código base, design system e copy.</p>
          </div>
```

---

### 2.2 — ADIÇÃO: Método `gerarPrototipoVisual()` em review.js

**LOCALIZAR o método `checkReady()` em review.js:**

```javascript
  checkReady() {
```

**INSERIR ANTES DELE o novo método completo:**

```javascript
  // ─── Geração de Protótipo Visual via Pollinations.ai (gratuito, sem API key) ─
  async gerarPrototipoVisual() {
    const B = this.B || {};

    // Validar pré-requisitos
    if (!B.estrutura_rascunho && !B.estrutura_aprovada) {
      this.showToast('Defina a Estrutura da LP antes de gerar o protótipo.', 'warning');
      return;
    }

    // Desabilitar botão durante geração
    const btn = document.getElementById('btn-gerar-prototipo');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader-2" style="width:14px;height:14px;animation:spin 1s linear infinite"></i> Gerando protótipo...`;
      lucide.createIcons();
    }

    try {
      // ── Montar prompt descritivo a partir do briefing ────────────────────
      const temaMap    = { escuro: 'dark background modern dark theme', claro: 'light clean white background', ia: 'modern professional design' };
      const intMap     = { contido: 'minimal subtle clean design', medio: 'modern professional balanced design', alto: 'bold high-impact impressive visual design' };
      const fichaArte  = (() => { try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); } catch { return {}; } })();

      const tema        = temaMap[B.arte_tema] || temaMap[fichaArte?.tema] || 'modern professional design';
      const intensidade = intMap[B.arte_intensidade] || intMap[fichaArte?.intensidade] || 'modern professional balanced design';
      const segmento    = B.segmento || 'professional services';
      const servico     = B.servico_principal || 'professional service';
      const corPrimaria = B.arte_cor_principal || fichaArte?.paleta?.primaria || '#6366f1';
      const nomeMarca   = B.nome_profissional || B.nome_cliente || 'Marca';

      // Extrair título do Hero da estrutura para usar no protótipo
      const estrutura   = B.estrutura_aprovada || B.estrutura_rascunho || '';
      const heroTitulo  = (() => {
        const m = estrutura.match(/(?:Título|título|H1|Heading|Headline)[:\s]+[""]?(.{10,120})[""]?(?:\n|$)/i);
        return m?.[1]?.trim().replace(/[""\[\]]/g, '') || `${servico} profissional`;
      })();

      const prompt = [
        `professional landing page website design mockup screenshot`,
        `brand: ${nomeMarca}`,
        `service: ${segmento} ${servico}`,
        tema,
        intensidade,
        `hero headline: "${heroTitulo}"`,
        `accent color: ${corPrimaria}`,
        `hero section with bold headline and prominent CTA button`,
        `modern typography hierarchy`,
        `conversion optimized layout`,
        `desktop view full width`,
        `high quality UI design`,
        `photorealistic web design screenshot`,
        `no text watermarks`,
      ].join(', ');

      const seed = Math.floor(Math.random() * 99999);
      const url  = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=800&seed=${seed}&nologo=true&enhance=true`;

      // Pré-carregar a imagem para confirmar que gerou corretamente
      await new Promise((resolve, reject) => {
        const img  = new Image();
        img.onload = resolve;
        img.onerror = () => reject(new Error('Falha ao carregar imagem gerada.'));
        img.src = url;
        // Timeout de 90 segundos (geração pode demorar)
        setTimeout(() => reject(new Error('Tempo limite atingido. Tente novamente.')), 90000);
      });

      // Salvar URL e re-renderizar
      this.setField('prototipo_url', url);
      this.renderScreen();
      this.showToast('Protótipo gerado com sucesso!', 'success');

    } catch (err) {
      console.error('[gerarPrototipoVisual]', err);
      this.showToast(`Erro ao gerar protótipo: ${err.message}`, 'error');

      // Restaurar botão
      const btnRestored = document.getElementById('btn-gerar-prototipo');
      if (btnRestored) {
        btnRestored.disabled = false;
        btnRestored.innerHTML = `<i data-lucide="sparkles" style="width:15px;height:15px"></i> Gerar Protótipo Visual`;
        lucide.createIcons();
      }
    }
  },

  checkReady() {
```

> ⚠️ **ATENÇÃO ROO:** O método `checkReady()` original continua intacto logo abaixo. Você está apenas inserindo o novo método antes dele.

---

## ARQUIVO 3: `assets/js/04-handlers.js`

### 3.1 — ADIÇÃO: Listeners para os novos botões

O usuário já corrigiu o listener do `btn-run-estrutura`. Agora adicionar os dois novos listeners seguindo o mesmo padrão utilizado na correção.

**LOCALIZAR o ponto onde o listener do `btn-run-estrutura` foi adicionado.** Logo APÓS ele, inserir:

```javascript
// Refinar estrutura com IA (feedback loop)
if (e.target.id === 'btn-refinar-estrutura' || e.target.closest?.('#btn-refinar-estrutura')) {
  App.refinarEstrutura();
}

// Gerar protótipo visual na Review
if (e.target.id === 'btn-gerar-prototipo' || e.target.closest?.('#btn-gerar-prototipo')) {
  App.gerarPrototipoVisual();
}
```

> Se o padrão usado na correção do `btn-run-estrutura` for diferente (ex: `addEventListener` direto em vez de delegação), adapte os listeners acima para seguir EXATAMENTE o mesmo padrão já utilizado no arquivo.

---

## ARQUIVO 4: `assets/css/03-screens.css`

### 4.1 — ADIÇÃO: Estilos para Refinamento e Protótipo

**ADICIONAR no final do arquivo `assets/css/03-screens.css`:**

```css
/* ═══════════════════════════════════════════════════════════════
   ESTRUTURA — Card de Refinamento com IA
   ═══════════════════════════════════════════════════════════════ */

.estrutura-feedback-card {
  border: 1px solid rgba(var(--accent-rgb, 0, 229, 160), 0.18);
  background: rgba(var(--accent-rgb, 0, 229, 160), 0.03);
  position: relative;
  overflow: hidden;
}

.estrutura-feedback-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(var(--accent-rgb, 0, 229, 160), 0.04) 0%, transparent 60%);
  pointer-events: none;
}

.estrutura-feedback-card .estrutura-section-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 10px;
}

/* ═══════════════════════════════════════════════════════════════
   REVIEW — Seção de Estrutura (wireframe preview)
   ═══════════════════════════════════════════════════════════════ */

.review-estrutura-section {
  background: var(--surface-2, var(--card));
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.review-section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-3);
}

.review-badge-free {
  margin-left: auto;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.review-wireframe-wrap {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  max-height: 420px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.review-wireframe-body {
  transform: scale(0.85);
  transform-origin: top center;
  /* Corrige espaço extra do scale */
  margin-bottom: -15%;
}

.review-pending-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(var(--warning-rgb, 245, 158, 11), 0.08);
  border: 1px solid rgba(var(--warning-rgb, 245, 158, 11), 0.2);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: 13px;
  color: var(--text-secondary);
}

/* ═══════════════════════════════════════════════════════════════
   REVIEW — Seção do Protótipo Visual
   ═══════════════════════════════════════════════════════════════ */

.review-prototipo-section {
  background: var(--surface-2, var(--card));
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.review-prototipo-desc {
  font-size: 12.5px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-3);
}

.prototipo-generate-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.prototipo-hint {
  font-size: 11px;
  color: var(--text-disabled);
  margin: 0;
}

/* Imagem gerada */
.prototipo-resultado {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prototipo-img {
  width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  display: block;
  object-fit: contain;
  max-height: 480px;
  background: var(--surface-3, #0d0f19);
}

.prototipo-erro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: var(--space-6);
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
  color: var(--text-disabled);
  font-size: 13px;
}

.prototipo-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

/* Botão danger sutil (para remover) */
.btn-ghost.danger-subtle {
  color: var(--error, #ef4444);
  opacity: 0.7;
}
.btn-ghost.danger-subtle:hover {
  opacity: 1;
  background: rgba(239, 68, 68, 0.08);
}

/* Animação de spin para ícone de loading */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```

---

## VERIFICAÇÃO FINAL (Checklist para o Roo)

Após implementar tudo, verificar:

- [ ] `estrutura.js` — parser novo com `extrairCampo()` funcional
- [ ] `estrutura.js` — card de refinamento aparece após gerar estrutura (e some após aprovar)
- [ ] `estrutura.js` — `refinarEstrutura()` existe e chama `callAI()` corretamente
- [ ] `estrutura.js` — `buildResumoBriefing()` existe e retorna string
- [ ] `estrutura.js` — `gerarPrototipoVisual()` e `showModalPrototipoFallback()` REMOVIDOS
- [ ] `review.js` — seção de wireframe aparece na review quando `B.estrutura_wireframe` existe
- [ ] `review.js` — botão "Ajustar Estrutura" navega para `goToScreen('estrutura')`
- [ ] `review.js` — seção de protótipo aparece sempre na review
- [ ] `review.js` — `gerarPrototipoVisual()` existe e usa Pollinations.ai
- [ ] `review.js` — após gerar, `B.prototipo_url` é salvo e imagem exibe
- [ ] `04-handlers.js` — `btn-refinar-estrutura` chama `App.refinarEstrutura()`
- [ ] `04-handlers.js` — `btn-gerar-prototipo` chama `App.gerarPrototipoVisual()`
- [ ] `03-screens.css` — todos os novos estilos adicionados ao final
- [ ] `lucide.createIcons()` chamado após toda renderização dinâmica (já é feito pelo `renderScreen()` existente)
- [ ] localStorage não foi alterado — campos novos são apenas `prototipo_url` (salvo via `setField`)

---

## NOTAS TÉCNICAS

### Pollinations.ai — Como funciona
Não requer API key. A URL `https://image.pollinations.ai/prompt/{PROMPT}?width=1280&height=800&seed={N}&nologo=true&enhance=true` retorna diretamente um JPEG. A geração leva entre 10–60 segundos. O seed aleatório garante variação a cada geração. O parâmetro `enhance=true` melhora a qualidade sem custo adicional.

### Por que seed aleatório
Usar `Math.random()` para o seed garante que o usuário sempre obtenha uma variação nova ao clicar "Gerar Novo Protótipo", mesmo com o mesmo prompt.

### Escala do wireframe na Review
O `transform: scale(0.85)` no `.review-wireframe-body` reduz o wireframe para caber na coluna da review sem scroll excessivo. O `margin-bottom: -15%` corrige o espaço em branco gerado pelo scale.

### Por que `extrairCampo()` no parser
A IA pode gerar o output com pequenas variações de formato (aspas tipográficas, maiúsculas, ausência de aspas). A função `extrairCampo()` tenta múltiplos padrões antes de cair no fallback, tornando o parser robusto a essas variações.

### Campo `prototipo_url` no localStorage
É salvo via `App.setField('prototipo_url', url)` como qualquer outro campo do briefing. Persiste entre sessões. O usuário pode removê-lo clicando "Remover" que chama `App.setField('prototipo_url', '')`.

---

*DOC-IMPL gerado pelo Claude · AIGator LandingAI · 07/05/2026*
