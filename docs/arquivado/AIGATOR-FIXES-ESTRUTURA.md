# AIGator — Correções Cirúrgicas + Redesign Estrutura
> **Para o Roo Code.**
> Leia este documento completo antes de agir.
> Execute as correções na ordem. Declare os arquivos antes de cada bloco.
> Regra: não toque em nenhum arquivo que não esteja listado aqui.

---

## CONTEXTO — O QUE FOI VERIFICADO NO CÓDIGO REAL

Antes de qualquer mudança, confirmei o que está certo e o que está errado:

**✅ Funcionando corretamente (NÃO TOCAR):**
- `app.js` — init correto, setupGlobalEvents antes de renderAll ✓
- `02-api.js` — callAI, _callGemini, _callClaude, _callOpenAICompat ✓
- `03-ui.js` — renderAll, renderScreen, renderStepsNav, goNext, goPrev ✓
- `04-handlers.js` — bindScreenEvents completo, upload handlers, chip handlers ✓
- `01-state.js` — setField, autosave, loadProject, createProject ✓
- `aiLogStep(stepId)` — a assinatura REAL é `aiLogStep(stepId, liveMsg = '')` — o segundo param é opcional, as chamadas com 1 arg estão corretas

**❌ Bugs confirmados para corrigir:**
1. `00-config.js` linha 6430: `window.App = {}` sobrescreve o objeto global
2. `00-config.js`: `STEPS` usa `title` mas o código usa `s.title` — confirmar qual existe
3. `00-config.js`: `gemini-2.5-flash-lite` endpoint com data futura (`-06-17`)
4. `screens/intake.js` e `screens/art.js` — arquivos aparecem vazios no snapshot
5. `00-config.js`: `REQUIRED_FIELDS` referencia `s.title` no review mas pode ser `s.label`

---

## CORREÇÃO 1 — `00-config.js`: remover `window.App = {}` duplicado

**Arquivo:** `assets/js/00-config.js`

Localizar e remover a linha:
```javascript
window.App = {};
```

Esta linha existe no `index.html` como script inline antes do primeiro `<script src="">`. Ter ela também no `00-config.js` sobrescreve o objeto toda vez que o arquivo carrega. Remover apenas essa linha — não tocar em mais nada do arquivo.

---

## CORREÇÃO 2 — `00-config.js`: corrigir STEPS com `title` e `label`

**Arquivo:** `assets/js/00-config.js`

Localizar o array `const STEPS`. Verificar se cada objeto tem `title` ou `label`.

O `03-ui.js` referencia `s.title` (linha `title.textContent = s ? \`Step ${s.id}: ${s.title}\` : 'Briefing'`).
O `renderStepsNav()` referencia `s.title` (linha `<span class="steps-nav-label">${s.title}</span>`).
O `review.js` referencia `stepObj.title`.

**Portanto, o campo DEVE se chamar `title`.** Se o array atual usar `label`, renomear para `title` em cada objeto do array. Exemplo do array correto:

```javascript
const STEPS = [
  { id: 1, title: 'Identificação',     sub: 'Nome, nicho e tipo de projeto',    icon: 'user' },
  { id: 2, title: 'Contato e CTA',     sub: 'WhatsApp, e-mail e conversão',     icon: 'phone' },
  { id: 3, title: 'Presença Digital',  sub: 'Redes sociais e plataformas',      icon: 'globe' },
  { id: 4, title: 'Atendimento',       sub: 'Modalidade, endereço, cidades',    icon: 'map-pin' },
  { id: 5, title: 'Serviço / Produto', sub: 'O que é vendido e como funciona',  icon: 'briefcase' },
  { id: 6, title: 'Público-Alvo',      sub: 'Perfil, dores e resultado',        icon: 'target' },
  { id: 7, title: 'Autoridade',        sub: 'Diferenciais e prova social',      icon: 'star' },
  { id: 8, title: 'Tom e Identidade',  sub: 'Estilo, vocabulário e restrições', icon: 'palette' },
];
```

> Se o array já usar `title`, confirmar e não alterar nada.

---

## CORREÇÃO 3 — `00-config.js`: corrigir endpoints Gemini

**Arquivo:** `assets/js/00-config.js`

Localizar o objeto `AI_MODELS`. Fazer APENAS estas substituições cirúrgicas:

**3.1 — `gemini-2.5-flash-lite`: endpoint com data futura**

Substituir:
```javascript
endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent',
```
Por:
```javascript
endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
```

**3.2 — `gemini-3-flash-preview`: não existe na API**

Remover a entrada `'gemini-3-flash-preview'` inteira e substituir por:
```javascript
'gemini-3.1-flash-lite': {
  label: 'Gemini 3.1 Flash Lite',
  provider: 'gemini',
  group: 'Google Gemini',
  tier: 'free',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent',
  maxTokens: 16384,
  temp: 0.7,
},
```

> Não alterar nenhuma outra entrada do AI_MODELS. Gemini 2.5 Flash, 2.5 Pro, 3.1 Pro — estão corretos.

---

## CORREÇÃO 4 — `screens/intake.js`: garantir que não está vazio

**Arquivo:** `assets/js/screens/intake.js`

Abrir o arquivo. Se estiver vazio ou com menos de 50 linhas, criar o conteúdo abaixo. Se já tiver conteúdo com `buildIntakeScreen()`, não alterar nada.

```javascript
/* ============================================================
   AIGator — LandingAI — Screen: Intake
   ============================================================ */

Object.assign(window.App, {

  buildIntakeScreen() {
    const B = this.B || {};
    const files = this.state.intakeFiles || [];

    return `
    <div class="intake-screen">

      <div class="intake-header">
        <h2 class="intake-title">Intake Inteligente</h2>
        <p class="intake-desc">
          Cole o material bruto do cliente — conversa de WhatsApp, e-mail, PDF, qualquer texto.
          A IA lê tudo e preenche os 8 steps automaticamente.
        </p>
      </div>

      <div class="intake-body">

        <!-- Briefing bruto -->
        <div class="field-group">
          ${this.fieldLabel('briefing_bruto', 'Material do Cliente')}
          <textarea
            class="field-textarea intake-textarea"
            data-field="briefing_bruto"
            placeholder="Cole aqui o briefing do cliente: conversa de WhatsApp, e-mail, anotações de reunião, formulário respondido...

Quanto mais contexto, mais preciso o preenchimento automático dos steps."
            rows="12"
          >${B.briefing_bruto || ''}</textarea>
        </div>

        <!-- Upload de arquivos -->
        <div class="field-group">
          <label class="field-label">Arquivos de apoio <span class="field-optional">opcional</span></label>
          <div id="intake-upload-zone" class="upload-zone">
            <input type="file" id="intake-upload-input" multiple
              accept=".txt,.pdf,.doc,.docx,.md"
              style="display:none">
            <i data-lucide="upload-cloud" style="width:28px;height:28px;color:var(--text-tertiary);margin-bottom:8px"></i>
            <p style="font-size:13px;color:var(--text-secondary);font-weight:500">Arraste arquivos ou clique para selecionar</p>
            <p style="font-size:11px;color:var(--text-tertiary);margin-top:4px">PDF, Word, TXT, MD</p>
          </div>
          <div id="intake-files-list" class="upload-preview-list">
            ${files.map((f, i) => `
              <div class="upload-preview-item">
                <i data-lucide="file-text" style="width:14px;height:14px"></i>
                <span>${f.name}</span>
                <button onclick="App.removeIntakeFile(${i})" title="Remover">
                  <i data-lucide="x" style="width:12px;height:12px"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Ações -->
        <div class="intake-actions">
          <button class="btn-primary btn-lg" id="btn-analyze">
            <i data-lucide="sparkles" style="width:16px;height:16px"></i>
            Analisar e Preencher Steps
          </button>
          <p class="intake-hint">
            Sem API Key? Pule esta etapa e preencha os steps manualmente.
          </p>
        </div>

      </div>

    </div>
    `;
  },

});
```

---

## CORREÇÃO 5 — `screens/art.js`: garantir que não está vazio

**Arquivo:** `assets/js/screens/art.js`

Abrir o arquivo. Se estiver vazio ou com menos de 50 linhas, o código da tela de Arte está em `04-handlers.js` (métodos `buildArtScreen`, `runArtAnalysis`, `_showArtResultModal`, `aprovarArte`).

Nesse caso, criar o arquivo com apenas:
```javascript
/* ============================================================
   AIGator — LandingAI — Screen: Art Direction
   ============================================================ */
// Implementação em 04-handlers.js — buildArtScreen(), runArtAnalysis()
// Este arquivo é reservado para futuras refatorações.
```

> Se o arquivo já tiver conteúdo com `buildArtScreen()`, não alterar nada.

---

## CORREÇÃO 6 — REDESIGN da tela Estrutura da LP

**Arquivo:** `assets/js/screens/estrutura.js`

**Objetivo:** redesenhar a UI da tela para ficar mais clean, profissional e integrada ao design system. O wireframe deve mostrar APENAS Hero + Seção 2 (primeira seção após o hero), não todos os blocos.

### 6.1 — Localizar o método `renderEstrutura()`

Este método retorna o HTML da tela completa. Substituir o HTML retornado por ele por:

```javascript
  renderEstrutura() {
    const B = this.B || {};
    const rascunho = B.estrutura_rascunho || '';
    const aprovada = B.estrutura_aprovada;
    const wireframe = B.estrutura_wireframe || '';

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

        <!-- Coluna: controles -->
        <div class="estrutura-col-controls">

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

          ${rascunho ? `
          <div class="estrutura-section-card">
            <div class="estrutura-section-header">
              <i data-lucide="file-text" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Rascunho</span>
            </div>
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

        </div>

        <!-- Coluna: wireframe -->
        <div class="estrutura-col-preview">
          <div class="estrutura-section-card estrutura-preview-card">
            <div class="estrutura-section-header">
              <i data-lucide="monitor" style="width:15px;height:15px;color:var(--text-secondary)"></i>
              <span class="estrutura-section-title">Pré-visualização</span>
              <span class="estrutura-preview-badge">Hero + Seção 2</span>
            </div>

            ${wireframe ? `
            <div class="estrutura-wireframe-wrap">
              <div class="estrutura-browser-bar">
                <span class="preview-dot-r"></span>
                <span class="preview-dot-y"></span>
                <span class="preview-dot-g"></span>
                <span class="estrutura-url-bar">${(B.dominio || 'seusite.com.br').replace(/^https?:\/\//, '')}</span>
              </div>
              <div class="estrutura-wireframe-body">
                ${wireframe}
              </div>
            </div>
            ` : `
            <div class="estrutura-preview-empty">
              <i data-lucide="layout" style="width:32px;height:32px;color:var(--text-disabled)"></i>
              <p>A pré-visualização aparece após gerar a estrutura</p>
            </div>
            `}
          </div>
        </div>

      </div>

    </div>
    `;
  },
```

### 6.2 — Localizar o método `gerarWireframeHTML(rascunho)` em `estrutura.js`

Este método atualmente gera wireframes para TODOS os blocos. Substituir o método completo por esta versão que gera apenas Hero + Seção 2:

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

    const [hero, secao2] = blocos;
    const dominio = this.B?.dominio?.replace(/^https?:\/\//, '') || 'seusite.com.br';

    return `
    <div style="font-family:'DM Sans',sans-serif;width:100%;overflow:hidden;">

      <!-- HERO -->
      <div style="background:linear-gradient(160deg,#0D0F19 0%,#131624 100%);padding:20px 16px 24px;position:relative;">
        <!-- Nav mock -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="width:20px;height:20px;background:var(--accent,#00E5A0);border-radius:4px;"></div>
            <div style="width:70px;height:7px;background:rgba(255,255,255,0.2);border-radius:4px;"></div>
          </div>
          <div style="background:var(--accent,#00E5A0);border-radius:4px;padding:5px 12px;font-size:8px;font-weight:700;color:#031A10;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;">
            ${hero?.cta || 'Falar no WhatsApp'}
          </div>
        </div>

        <!-- Hero content -->
        <div style="text-align:center;padding:0 4px;">
          <div style="display:inline-block;background:rgba(0,229,160,0.08);border:1px solid rgba(0,229,160,0.2);border-radius:99px;padding:3px 10px;font-size:7px;font-weight:700;color:var(--accent,#00E5A0);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">
            ${this.B?.segmento || 'Especialista'}
          </div>
          <div style="font-size:13px;font-weight:800;color:#ECEEF5;line-height:1.3;margin-bottom:8px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">
            ${hero?.titulo || 'Título principal da página'}
          </div>
          ${hero?.subtitulo ? `
          <div style="font-size:9px;color:#848698;line-height:1.5;margin-bottom:12px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
            ${hero.subtitulo}
          </div>
          ` : ''}
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
            <div style="background:var(--accent,#00E5A0);border-radius:6px;padding:7px 16px;font-size:8px;font-weight:700;color:#031A10;">
              ${hero?.cta || 'CTA Principal'}
            </div>
            <div style="border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:7px 16px;font-size:8px;color:#848698;">
              Saiba mais
            </div>
          </div>
          <!-- Proof strip -->
          <div style="display:flex;justify-content:center;gap:16px;margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.05);">
            ${[['⭐', '4.9'], ['👥', '200+'], ['✅', '100%']].map(([icon, val]) => `
              <div style="text-align:center;">
                <div style="font-size:10px;">${icon}</div>
                <div style="font-size:8px;font-weight:700;color:#ECEEF5;">${val}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      ${secao2 ? `
      <!-- SEÇÃO 2: ${secao2.nome} -->
      <div style="background:#0D0F19;padding:20px 16px;border-top:1px solid rgba(255,255,255,0.06);">
        <div style="text-align:center;margin-bottom:14px;">
          <div style="width:32px;height:2px;background:var(--accent,#00E5A0);border-radius:2px;margin:0 auto 8px;"></div>
          <div style="font-size:10px;font-weight:800;color:#ECEEF5;line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
            ${secao2.titulo || secao2.nome}
          </div>
          ${secao2.objetivo ? `
          <div style="font-size:8px;color:#848698;margin-top:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">
            ${secao2.objetivo}
          </div>
          ` : ''}
        </div>
        <!-- Content grid mock -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${[1,2,3,4].map(() => `
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;padding:10px;">
              <div style="width:16px;height:16px;background:rgba(0,229,160,0.15);border-radius:4px;margin-bottom:6px;"></div>
              <div style="width:80%;height:5px;background:rgba(255,255,255,0.12);border-radius:3px;margin-bottom:4px;"></div>
              <div style="width:100%;height:4px;background:rgba(255,255,255,0.06);border-radius:3px;"></div>
              <div style="width:60%;height:4px;background:rgba(255,255,255,0.06);border-radius:3px;margin-top:2px;"></div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

    </div>
    `;
  },
```

---

## CORREÇÃO 7 — CSS da tela Estrutura

**Arquivo:** `assets/css/03-screens.css`

Localizar os estilos `.estrutura-*` existentes. Substituir o bloco inteiro por:

```css
/* ============================================================
   Tela: Estrutura da LP
   ============================================================ */

.estrutura-screen {
  padding: 24px 32px;
  max-width: var(--content-max);
  margin: 0 auto;
}

.aprovado-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  border-radius: var(--r-md);
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 20px;
}
.aprovado-banner .btn-ghost {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-secondary);
}

/* Layout de 2 colunas */
.estrutura-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 860px) {
  .estrutura-layout { grid-template-columns: 1fr; }
  .estrutura-screen { padding: 20px; }
}

/* Cards de seção */
.estrutura-section-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  padding: 18px;
  margin-bottom: 16px;
}

.estrutura-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.estrutura-section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-display);
}

.estrutura-section-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 14px;
}

/* Coluna de controles */
.estrutura-col-controls { display: flex; flex-direction: column; }

/* Textarea do rascunho */
.estrutura-textarea {
  width: 100%;
  min-height: 280px;
  font-size: 11px;
  font-family: var(--font-mono);
  line-height: 1.6;
  resize: vertical;
}

/* Coluna de preview */
.estrutura-col-preview { position: sticky; top: 20px; }

.estrutura-preview-card { padding: 14px; }

.estrutura-preview-badge {
  margin-left: auto;
  font-size: 9px;
  font-weight: 700;
  color: var(--accent2);
  background: var(--accent2-dim);
  border: 1px solid var(--accent2-border);
  border-radius: var(--r-pill);
  padding: 2px 8px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Browser bar do wireframe */
.estrutura-browser-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-raised);
  border-bottom: 1px solid var(--border-default);
  padding: 8px 12px;
  border-radius: var(--r-md) var(--r-md) 0 0;
}

.estrutura-url-bar {
  flex: 1;
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Wireframe body */
.estrutura-wireframe-wrap {
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  overflow: hidden;
  margin-top: 12px;
}

.estrutura-wireframe-body {
  overflow: hidden;
  max-height: 560px;
  overflow-y: auto;
  scrollbar-width: none;
}
.estrutura-wireframe-body::-webkit-scrollbar { display: none; }

/* Empty state do preview */
.estrutura-preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--text-tertiary);
  font-size: 12px;
  text-align: center;
  border: 1px dashed var(--border-muted);
  border-radius: var(--r-md);
  margin-top: 12px;
}
```

---

## VERIFICAÇÃO FINAL

Após executar todas as correções, testar:

1. Abrir no browser → sem erros de console ✓
2. `STEPS[0].title` existe (não `label`) → sidebar e topbar mostram nomes ✓
3. Seletor de modelo → `gemini-2.5-flash-lite` aparece sem data no label ✓
4. `gemini-3-flash-preview` não aparece mais → substituído por `gemini-3.1-flash-lite` ✓
5. Tela de Intake abre com zona de upload e textarea ✓
6. Tela de Estrutura → layout em 2 colunas: controles à esq, preview à dir ✓
7. Wireframe → mostra apenas Hero + uma seção abaixo ✓
8. Demais telas (Steps, Arte, Revisão) não foram alteradas ✓

---

## ARQUIVOS MODIFICADOS

| Arquivo | Mudança |
|---|---|
| `assets/js/00-config.js` | Remover `window.App = {}` duplicado, corrigir `STEPS` campo `title`, corrigir endpoints Gemini |
| `assets/js/screens/intake.js` | Criar `buildIntakeScreen()` se arquivo estiver vazio |
| `assets/js/screens/art.js` | Criar comentário placeholder se arquivo estiver vazio |
| `assets/js/screens/estrutura.js` | Substituir `renderEstrutura()` e `gerarWireframeHTML()` |
| `assets/css/03-screens.css` | Substituir bloco `.estrutura-*` |
