# LandingAI v3 — COMPLEMENTO DE IMPLEMENTAÇÃO
> **Este arquivo é o par obrigatório do `implementação-landingai-v3.md`.**
> Contém tudo que está ausente ou truncado no documento principal.
> O Roo deve ler os dois antes de escrever qualquer linha.

---

## MAPA DO QUE ESTÁ AQUI

1. Constantes globais (`AI_MODELS`, `STORAGE_KEYS`, `STEPS`, `ERROR_MAP`)
2. CSS ausente — 5 blocos truncados
3. `buildStep8` — Tom de Voz e Identidade (ausente)
4. `buildStepReview` — Revisão Final / Step 9 (ausente)
5. `buildDoc1` — gerador do DOC-1 (ausente)
6. `callAI` completa com os 4 providers (truncada)
7. Todas as funções auxiliares ausentes (`renderStepsNav`, `updateSidebar`, `updateTopbar`, `renderScreen`, `fieldLabel`, `getStepWarnings`, `setupGlobalEvents`, `renderApiModal`, `renderModelDropdown`, `renderProjectsList`, `openModal`, `closeModal`, `showToast`, `showNotification`, `downloadText`, `goToScreen`, `goNext`, `goPrev`, `goToStep`, `updateTopbarScore`, `renderArtScreen`, `buildStepIntake`, `renderIntakeScreen`)
8. `README.md`

---

## 1. CONSTANTES GLOBAIS

Inserir no início do `assets/app.js`, antes de qualquer outra coisa.

```javascript
/* ============================================================
   LandingAI v3 — Constantes Globais
   ============================================================ */

const VERSION = '3.0.0';

/* ── Storage Keys ──────────────────────────────────────────── */
const STORAGE_KEYS = {
  PROJECTS: 'landingai_v3_projects',
  ACTIVE:   'landingai_v3_active',
  API_KEYS: 'landingai_v3_apikeys',
  SETTINGS: 'landingai_v3_settings',
};

const STORAGE_LIMIT_BYTES = 4 * 1024 * 1024; // 4MB warning threshold

/* ── Modelos de IA ─────────────────────────────────────────── */
const AI_MODELS = {
  'gemini-2.5-pro': {
    label:    'Gemini 2.5 Pro',
    provider: 'gemini',
    tier:     'paid',
    group:    'Google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
    maxTokens: 16000,
    temp:      0.65,
  },
  'gemini-2.5-flash': {
    label:    'Gemini 2.5 Flash',
    provider: 'gemini',
    tier:     'free',
    group:    'Google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    maxTokens: 12000,
    temp:      0.70,
  },
  'claude-sonnet-4-20250514': {
    label:    'Claude Sonnet 4',
    provider: 'claude',
    tier:     'paid',
    group:    'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 16000,
    temp:      0.65,
  },
  'claude-haiku-4-5-20251001': {
    label:    'Claude Haiku 4.5',
    provider: 'claude',
    tier:     'free',
    group:    'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 8000,
    temp:      0.70,
  },
  'grok-3': {
    label:    'Grok 3',
    provider: 'grok',
    tier:     'paid',
    group:    'xAI',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    maxTokens: 12000,
    temp:      0.65,
  },
  'mistral-large-latest': {
    label:    'Mistral Large',
    provider: 'mistral',
    tier:     'paid',
    group:    'Mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    maxTokens: 12000,
    temp:      0.65,
  },
};

/* ── Steps ─────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Identificação',        icon: 'user',          fields: ['nome_cliente','segmento','tipo','whatsapp','email','horarios','gtm_id','objetivo_conversao'] },
  { id: 2, label: 'Contato e Redes',      icon: 'share-2',       fields: ['instagram','tiktok','youtube','outras_redes','integracoes'] },
  { id: 3, label: 'Atendimento',          icon: 'map-pin',       fields: ['modalidade','endereco','exibir_localizacao','cidades_atendimento','plataforma_online'] },
  { id: 4, label: 'Serviços e Preço',     icon: 'briefcase',     fields: ['servico_principal','servicos_descricao','preco_exibir'] },
  { id: 5, label: 'Preço',               icon: 'tag',           fields: ['preco_exibir'] },
  { id: 6, label: 'Público-Alvo',         icon: 'target',        fields: ['publico_primario','publico_dor','publico_resultado'] },
  { id: 7, label: 'Diferenciais',         icon: 'star',          fields: ['diferencial','frase_impacto','depoimentos','google_business'] },
  { id: 8, label: 'Tom e Identidade',     icon: 'palette',       fields: ['estilo_desejado','sensacao_visitante','vocabulario_usa','vocabulario_nunca'] },
];

/* ── Validações ────────────────────────────────────────────── */
const REQUIRED_FIELDS = {
  1: ['nome_cliente','segmento','tipo','whatsapp','objetivo_conversao'],
  2: [],
  3: ['modalidade'],
  4: ['servico_principal','servicos_descricao','preco_exibir'],
  5: [],
  6: ['publico_primario','publico_dor','publico_resultado'],
  7: ['diferencial','frase_impacto','depoimentos','google_business'],
  8: ['estilo_desejado','sensacao_visitante'],
};

const FIELD_WARNINGS = {
  publico_primario: { min: 80,  msg: 'Muito curto — quanto mais específico, melhor a copy gerada.' },
  publico_dor:      { min: 60,  msg: 'Descreva a dor com as palavras do cliente, não termos técnicos.' },
  servicos_descricao:{ min: 100, msg: 'Pouco detalhe — a copy ficará genérica com menos de 100 caracteres.' },
  diferencial:      { min: 80,  msg: 'Evite qualidade/excelência — cite fatos concretos e específicos.' },
};

/* ── Mapa de erros de API ──────────────────────────────────── */
const ERROR_MAP = {
  '429': {
    cause: 'Limite de requisições da API atingido (rate limit).',
    tip:   'Aguarde 30 segundos e tente novamente, ou troque de modelo.',
  },
  'quota': {
    cause: 'Cota da API esgotada para hoje.',
    tip:   'Use outro modelo ou aguarde a renovação da cota.',
  },
  '401': {
    cause: 'API Key inválida ou sem permissão.',
    tip:   'Verifique a chave em Config. API e tente novamente.',
  },
  '403': {
    cause: 'Acesso negado — API Key sem permissão para este modelo.',
    tip:   'Verifique o plano e permissões da sua API Key.',
  },
  '500': {
    cause: 'Erro interno no servidor da IA.',
    tip:   'Aguarde alguns segundos e tente novamente.',
  },
  'response too short': {
    cause: 'A IA retornou uma resposta muito curta ou incompleta.',
    tip:   'Tente com Gemini 2.5 Pro ou aumente o detalhamento do briefing.',
  },
  'failed to fetch': {
    cause: 'Sem conexão com a internet ou CORS bloqueado.',
    tip:   'Verifique sua conexão. Se persistir, tente em outro navegador.',
  },
  'no key': {
    cause: 'Nenhuma API Key configurada para o modelo selecionado.',
    tip:   'Abra Config. API e insira a chave do provedor.',
  },
};
```

---

## 2. CSS AUSENTE — BLOCOS COMPLEMENTARES

Adicionar ao final do `assets/app.css`.

```css
/* ── Review Screen ─────────────────────────────────────────── */
.review-screen {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.review-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.review-desc { font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; }

.review-score-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: var(--r-lg);
  border: 1px solid var(--border-default);
  background: var(--bg-surface);
}

.review-score-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
  box-shadow: 0 0 16px var(--accent-glow);
}

.review-score-info { flex: 1; }
.review-score-label {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}
.review-score-sub { font-size: 12px; color: var(--text-secondary); }

.review-steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.review-step-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 12px 14px;
  cursor: pointer;
  transition: all var(--t-base);
}
.review-step-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }
.review-step-card.complete { border-color: rgba(0,229,160,0.2); }
.review-step-card.has-warnings { border-color: rgba(255,179,71,0.3); }
.review-step-card.has-errors { border-color: rgba(255,86,86,0.3); }

.review-step-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.review-step-num {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-tertiary);
}
.review-step-status { width: 14px; height: 14px; }
.review-step-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}
.review-step-detail { font-size: 11px; color: var(--text-secondary); line-height: 1.4; }

.review-warnings-list { display: flex; flex-direction: column; gap: 6px; }

.review-warning-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 12px;
  background: var(--warning-dim);
  border: 1px solid var(--warning-border);
  border-radius: var(--r-sm);
  font-size: 12.5px;
  color: var(--text-secondary);
}
.review-warning-item i { color: var(--warning); flex-shrink: 0; margin-top: 1px; }

.review-missing-list { display: flex; flex-direction: column; gap: 6px; }
.review-missing-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 12px;
  background: var(--danger-dim);
  border: 1px solid var(--danger-border);
  border-radius: var(--r-sm);
  font-size: 12.5px;
  color: var(--text-secondary);
}
.review-missing-item i { color: var(--danger); flex-shrink: 0; margin-top: 1px; }

.review-section-title {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
}

.review-actions-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.review-model-note {
  font-size: 11.5px;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
}

/* ── Art Direction Result ──────────────────────────────────── */
.art-result-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.art-result-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.art-result-section-title {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.art-result-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.art-result-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--r-pill);
  background: var(--accent2-dim);
  color: var(--accent2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.palette-swatches {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.palette-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.palette-swatch-color {
  width: 48px;
  height: 48px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-default);
}

.palette-swatch-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-secondary);
}

/* ── Modal base ────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--t-slow);
}
.modal-overlay.open {
  opacity: 1;
  pointer-events: all;
}

.modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  transform: scale(0.96) translateY(12px);
  transition: transform var(--t-slow);
}
.modal-overlay.open .modal {
  transform: scale(1) translateY(0);
}

/* Tamanhos de modal */
.modal--sm  { max-width: 420px; }
.modal--md  { max-width: 600px; }
.modal--lg  { max-width: 820px; }
.modal--xl  { max-width: 1100px; height: 88vh; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.modal-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  color: var(--text-tertiary);
  transition: all var(--t-fast);
}
.modal-close:hover { background: var(--bg-overlay); color: var(--text-primary); }

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-body::-webkit-scrollbar { width: 4px; }
.modal-body::-webkit-scrollbar-thumb { background: var(--border-muted); border-radius: var(--r-pill); }

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

/* ── Gen Modal específico ──────────────────────────────────── */
.gen-progress-wrap {
  background: var(--bg-raised);
  border-radius: var(--r-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gen-progress-bar {
  height: 4px;
  background: var(--border-muted);
  border-radius: var(--r-pill);
  overflow: hidden;
}

.gen-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent2), var(--accent));
  border-radius: var(--r-pill);
  transition: width 0.5s ease;
}

.gen-progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gen-progress-label { font-size: 12px; color: var(--text-secondary); }
.gen-progress-pct {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
}

.gen-model-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 3px 8px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border-subtle);
  background: var(--bg-raised);
}

.gen-steps-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gen-step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}

.gen-step-icon { flex-shrink: 0; }
.gen-step-icon.spin { animation: spin 1s linear infinite; color: var(--accent2); }
.gen-step-icon.done { color: var(--accent); }
.gen-step-icon.err  { color: var(--danger); }
.gen-step-icon.wait { color: var(--text-disabled); }

.gen-step-label { font-size: 13px; color: var(--text-secondary); }
.gen-step-item.active .gen-step-label { color: var(--text-primary); }

.gen-note {
  font-size: 11.5px;
  color: var(--text-tertiary);
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
}

/* ── Error Modal ───────────────────────────────────────────── */
.error-block {
  background: var(--danger-dim);
  border: 1px solid var(--danger-border);
  border-radius: var(--r-md);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Preview Modal ─────────────────────────────────────────── */
.preview-browser {
  background: var(--bg-raised);
  border-radius: var(--r-md);
  overflow: hidden;
  border: 1px solid var(--border-default);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.preview-browser-bar {
  background: var(--bg-overlay);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.preview-dot-r { width: 10px; height: 10px; border-radius: 50%; background: #FF5F56; }
.preview-dot-y { width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E; }
.preview-dot-g { width: 10px; height: 10px; border-radius: 50%; background: #27C93F; }

.preview-url-bar {
  flex: 1;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-sm);
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
}

.preview-iframe-wrap {
  flex: 1;
  position: relative;
}

.preview-iframe-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.preview-note {
  font-size: 11px;
  color: var(--text-tertiary);
  text-align: center;
  padding-top: 6px;
  border-top: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

/* ── API Modal ─────────────────────────────────────────────── */
.api-provider-card {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.api-provider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.api-provider-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.api-provider-link {
  font-size: 11px;
  color: var(--accent2);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.api-key-row { display: flex; gap: 8px; }
.api-key-row .field-input { font-family: var(--font-mono); font-size: 12.5px; }

.api-key-status {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.api-key-status.ok { color: var(--accent); }
.api-key-status.empty { color: var(--text-disabled); }

/* ── Projects Modal ────────────────────────────────────────── */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--r-md);
  border: 1px solid var(--border-default);
  background: var(--bg-raised);
  cursor: pointer;
  transition: all var(--t-base);
}
.project-list-item:hover { border-color: var(--border-strong); background: var(--bg-overlay); }
.project-list-item.active-project { border-color: var(--accent-border); background: var(--accent-dim); }

.project-list-info { flex: 1; min-width: 0; }
.project-list-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-list-meta { font-size: 11px; color: var(--text-tertiary); margin-top: 1px; }

.project-list-actions { display: flex; gap: 4px; }
.project-list-action {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--r-sm);
  color: var(--text-tertiary);
  transition: all var(--t-fast);
}
.project-list-action:hover { background: var(--bg-overlay); color: var(--text-primary); }
.project-list-action.danger:hover { color: var(--danger); background: var(--danger-dim); }

/* ── Toast ─────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 12px 18px;
  font-size: 13px;
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
  pointer-events: none;
  max-width: 340px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.toast.visible { transform: translateY(0); opacity: 1; }
.toast.success { border-color: var(--accent-border); }
.toast.success::before { content: '✓'; color: var(--accent); font-weight: 700; }
.toast.error { border-color: var(--danger-border); }
.toast.error::before { content: '✕'; color: var(--danger); font-weight: 700; }
.toast.warning { border-color: var(--warning-border); }
.toast.warning::before { content: '⚠'; color: var(--warning); }

/* ── Animations ────────────────────────────────────────────── */
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.animate-in { animation: fadeIn 0.22s ease forwards; }
```

---

## 3. STEP 8 — TOM DE VOZ E IDENTIDADE

Adicionar ao `App` object em `assets/app.js`, após `buildStep7`.

```javascript
  buildStep8() {
    const B = this.B;
    return `
      <p class="form-section-title">Tom de Voz</p>
      <p class="form-section-title" style="font-size:12px;font-family:var(--font-body);font-weight:400;color:var(--text-secondary);border:none;padding:0;margin-top:-16px">
        Estas informações definem como o profissional fala — e o que jamais diria.
        São as que mais diferenciam a copy de qualquer output genérico de IA.
      </p>

      <div class="field-group">
        ${this.fieldLabel('estilo_desejado', 'Como o site deve ser percebido?', true)}
        <textarea class="field-textarea" data-field="estilo_desejado"
          placeholder="Fale como descreveria o projeto para o cliente — sem termos técnicos.
Ex: Sóbrio e técnico, mas sem ser frio. Algo próximo de uma marca premium europeia. Não quero nada que pareça infoproduto ou clínica genérica.">${B.estilo_desejado || ''}</textarea>
        <span class="field-hint">Esta frase guia todas as decisões visuais e de copy da IA.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('sensacao_visitante', 'O que o visitante deve SENTIR ao navegar no site?', true)}
        <textarea class="field-textarea" data-field="sensacao_visitante"
          placeholder="Ex: Deve sentir que está diante de alguém que domina o assunto, que entende exatamente o problema dele e tem a solução — sem precisar convencer demais.">${B.sensacao_visitante || ''}</textarea>
      </div>

      <div class="field-group">
        ${this.fieldLabel('frase_tom', 'Frase que resume o tom de voz da marca', false, true)}
        <input type="text" class="field-input" data-field="frase_tom"
          placeholder="Ex: Especialista que já viu tudo e fala sem rodeios / Quem cuida com método, não com emoção"
          value="${B.frase_tom || ''}">
        <span class="field-hint">Uma frase curta que captura a personalidade. Será usada no brief para a IA.</span>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Vocabulário da Marca</p>

      <div class="field-group">
        ${this.fieldLabel('vocabulario_usa', 'Termos e expressões que o profissional USA', false, true)}
        <textarea class="field-textarea" data-field="vocabulario_usa"
          placeholder="Palavras do campo semântico do cliente — vêm da conversa, não do formulário.
Ex: 'manejo', 'vínculo', 'marcadores', 'autonomia do animal', 'comportamento funcional'">${B.vocabulario_usa || ''}</textarea>
        <span class="field-hint">A IA vai incorporar essas palavras naturalmente na copy.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('vocabulario_nunca', 'Termos que o profissional NUNCA usaria', false, true)}
        <textarea class="field-textarea" data-field="vocabulario_nunca"
          placeholder="Palavras que quebram a identidade da marca.
Ex: 'pet', 'fofo', 'amiguinho', 'tutor consciente', 'jornada', 'transformação', 'missão'">${B.vocabulario_nunca || ''}</textarea>
        <span class="field-hint">Tão importante quanto o vocabulário correto — a IA evita esses termos.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('restricoes', 'Restrições visuais e de conteúdo', false, true)}
        <textarea class="field-textarea" data-field="restricoes"
          placeholder="Tudo que o cliente NÃO quer de forma alguma no site.
Ex: Sem rosa. Sem visual de pet shop. Sem estética de infoproduto. Sem fontes cursivas. Não mencionar preço.">${B.restricoes || ''}</textarea>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Metadados do Projeto</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('dominio', 'Domínio desejado', false, true)}
          <input type="text" class="field-input" data-field="dominio"
            placeholder="Ex: beatrizmattos.com.br"
            value="${B.dominio || ''}">
          <span class="field-hint">Confirmar disponibilidade antes do go-live.</span>
        </div>
        <div class="field-group">
          ${this.fieldLabel('cnpj', 'CNPJ', false, true)}
          <input type="text" class="field-input" data-field="cnpj"
            placeholder="Ex: 00.000.000/0001-00"
            value="${B.cnpj || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('aviso_legal', 'Registro profissional ou aviso legal', false, true)}
        <input type="text" class="field-input" data-field="aviso_legal"
          placeholder="Ex: CRM 12345-SP | CRP 06/12345 | OAB/SP 123456"
          value="${B.aviso_legal || ''}">
        <span class="field-hint">Obrigatório no footer para algumas categorias (médicos, psicólogos, advogados).</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('instrucoes_adicionais', 'Instruções adicionais para a IA', false, true)}
        <textarea class="field-textarea" data-field="instrucoes_adicionais"
          placeholder="Qualquer informação que não coube nos campos anteriores. Campo livre — a IA lê tudo.">${B.instrucoes_adicionais || ''}</textarea>
      </div>
    `;
  },
```

---

## 4. STEP REVIEW — TELA DE REVISÃO FINAL

```javascript
  buildStepReview() {
    const B = this.B;
    const score = this.calcGlobalScore();
    const allWarnings = this.getAllWarnings();
    const missingRequired = this.getMissingRequired();
    const scoreClass = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';
    const scoreLabel = score >= 80 ? 'Briefing rico — excelente qualidade esperada' :
                       score >= 50 ? 'Briefing adequado — resultado bom' :
                       'Briefing incompleto — preencha mais campos';

    const stepCards = STEPS.map(step => {
      const warnings = this.getStepWarnings(step.id);
      const missing = (REQUIRED_FIELDS[step.id] || []).filter(f => !B[f]?.toString().trim());
      const statusIcon = missing.length > 0 ? 'x' :
                         warnings.length > 0 ? 'alert-triangle' : 'check';
      const statusColor = missing.length > 0 ? 'var(--danger)' :
                          warnings.length > 0 ? 'var(--warning)' : 'var(--accent)';
      const cardClass = missing.length > 0 ? 'has-errors' : warnings.length > 0 ? 'has-warnings' : 'complete';

      return `
        <div class="review-step-card ${cardClass}" onclick="App.goToStep(${step.id})" title="Ir para Step ${step.id}">
          <div class="review-step-card-header">
            <span class="review-step-num">STEP ${step.id}</span>
            <i data-lucide="${statusIcon}" class="review-step-status" style="color:${statusColor}"></i>
          </div>
          <div class="review-step-name">${step.label}</div>
          <div class="review-step-detail">
            ${missing.length > 0 ? `${missing.length} campo(s) obrigatório(s) vazio(s)` :
              warnings.length > 0 ? `${warnings.length} aviso(s)` : 'Completo'}
          </div>
        </div>
      `;
    }).join('');

    const warningItems = allWarnings.length > 0 ? `
      <div>
        <div class="review-section-title">
          <i data-lucide="alert-triangle" style="width:16px;height:16px;color:var(--warning)"></i>
          Avisos (${allWarnings.length})
        </div>
        <div class="review-warnings-list">
          ${allWarnings.map(w => `
            <div class="review-warning-item">
              <i data-lucide="alert-triangle" style="width:13px;height:13px"></i>
              <span><strong>Step ${w.step} — ${w.label}:</strong> ${w.msg}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const missingItems = missingRequired.length > 0 ? `
      <div>
        <div class="review-section-title">
          <i data-lucide="x-circle" style="width:16px;height:16px;color:var(--danger)"></i>
          Campos obrigatórios vazios (${missingRequired.length})
        </div>
        <div class="review-missing-list">
          ${missingRequired.map(m => `
            <div class="review-missing-item">
              <i data-lucide="x" style="width:13px;height:13px"></i>
              <span><strong>Step ${m.step} — ${m.label}:</strong> campo "${m.field}" não preenchido</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const canGenerate = missingRequired.length === 0;
    const hasApiKey = Object.values(this.state.apiKeys).some(k => k?.trim());

    return `
      <div class="review-screen">
        <div class="review-header">
          <div class="review-title">Revisão e Geração</div>
          <div class="review-desc">
            Confira o briefing antes de gerar a Ficha de Implementação.
            Clique em qualquer step para voltar e ajustar.
          </div>
        </div>

        <div class="review-score-banner">
          <div class="review-score-circle">${score}%</div>
          <div class="review-score-info">
            <div class="review-score-label">${scoreLabel}</div>
            <div class="review-score-sub">
              ${missingRequired.length > 0 ? `${missingRequired.length} campo(s) obrigatório(s) pendente(s) ·` : ''}
              ${allWarnings.length} aviso(s) · Modelo: ${AI_MODELS[this.state.selectedModel]?.label}
            </div>
          </div>
          <div class="score-badge ${scoreClass}">${score >= 80 ? 'Rico' : score >= 50 ? 'OK' : 'Raso'}</div>
        </div>

        <div class="review-steps-grid">
          ${stepCards}
        </div>

        ${missingItems}
        ${warningItems}

        <div class="review-actions">
          <div class="review-section-title" style="margin-bottom:0">
            <i data-lucide="zap" style="width:16px;height:16px;color:var(--accent)"></i>
            Gerar agora
          </div>
          <div class="review-actions-row">
            <button class="btn-ghost" onclick="App.downloadDoc1()">
              <i data-lucide="download" style="width:15px;height:15px"></i>
              Baixar DOC-1 (manual)
            </button>
            <button class="btn-primary" onclick="App.generateDocImpl()"
              ${canGenerate && hasApiKey ? '' : 'disabled'}
              title="${!canGenerate ? 'Preencha os campos obrigatórios primeiro' : !hasApiKey ? 'Configure uma API Key primeiro' : 'Gerar Ficha de Implementação'}">
              <i data-lucide="sparkles" style="width:15px;height:15px"></i>
              Gerar Ficha de Implementação
            </button>
          </div>
          ${!hasApiKey ? `
            <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--warning)">
              <i data-lucide="key" style="width:13px;height:13px"></i>
              Nenhuma API Key configurada —
              <button onclick="App.openModal('modal-api')" style="color:var(--accent2);font-size:12px;text-decoration:underline;text-underline-offset:2px">
                configurar agora
              </button>
            </div>
          ` : ''}
          <div class="review-model-note">
            <i data-lucide="cpu" style="width:12px;height:12px"></i>
            Modelo ativo: ${AI_MODELS[this.state.selectedModel]?.label}
            <button onclick="document.getElementById('btn-model-selector').click()" style="color:var(--accent2);font-size:11px;margin-left:4px">trocar</button>
          </div>
        </div>
      </div>
    `;
  },
```

---

## 5. `buildDoc1` — GERADOR DO DOC-1

Esta é a função mais crítica do sistema. Gera o documento de 13 partes que vai para a IA.

```javascript
  buildDoc1() {
    const B = this.B;
    const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const arteAprovada = B.arte_ficha_aprovada ? (() => {
      try { return JSON.parse(B.arte_ficha_aprovada); } catch { return null; }
    })() : null;

    const integracoesList = (B.integracoes || []).map(i => {
      const labels = {
        maps: 'Google Maps Embed (endereço presencial confirmado)',
        reviews: 'Google Reviews Widget (perfil Google Business confirmado)',
        instagram: 'Feed do Instagram (perfil ativo e relevante)',
        formulario: 'Formulário de Contato Web3Forms',
        whatsapp: 'WhatsApp Flutuante (padrão Adsgator)',
        ligacao: 'Botão de Ligação Mobile',
      };
      return `- [x] ${labels[i] || i}`;
    }).join('\n') || '- [x] WhatsApp Flutuante (padrão Adsgator)';

    const waLink = B.whatsapp
      ? `https://wa.me/${B.whatsapp.replace(/\D/g, '')}${B.objetivo_conversao === 'whatsapp' ? '' : ''}`
      : '[INSERIR LINK WA]';

    return `# ${B.nome_cliente || '[Nome do Cliente]'} — DOC-1 Briefing Completo

> **Gerado pelo LandingAI v3 — Adsgator**
> Data: ${dataAtual}
> Modelo: ${AI_MODELS[this.state.selectedModel]?.label}
> Slug: ${B.slug || '[slug]'}

---

## PARTE 1 — INSTRUÇÕES PARA A IA

Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este briefing na íntegra e gerar a **Ficha de Implementação Completa** — pronto para o Roo Code implementar sem perguntas adicionais.

**Você toma todas as decisões** de tipografia, escala, tokens, animações e layout que não estão explicitadas.
**Você preenche todos os campos** com valores concretos. Sem placeholders. Sem "[definir depois]".
**O output deve ser auto-suficiente:** outra IA deve construir o projeto lendo apenas o documento gerado.

---

## PARTE 2 — IDENTIFICAÇÃO DO PROJETO

| Campo | Valor |
|---|---|
| **Cliente / Profissional** | ${B.nome_cliente || '—'} |
| **Nome Comercial / Marca** | ${B.nome_marca || B.nome_cliente || '—'} |
| **Slug** | ${B.slug || '—'} |
| **Segmento** | ${B.segmento || '—'} |
| **Tipo** | ${B.tipo || '—'} |
| **Domínio** | ${B.dominio || '[a confirmar]'} |
| **CNPJ** | ${B.cnpj || '[a confirmar]'} |
| **Aviso Legal** | ${B.aviso_legal || 'não aplicável'} |

---

## PARTE 3 — CONTATO E CONVERSÃO

| Campo | Valor |
|---|---|
| **WhatsApp** | ${B.whatsapp || '—'} |
| **Link WA** | ${waLink} |
| **Email** | ${B.email || '—'} |
| **Horários** | ${B.horarios || '—'} |
| **GTM ID** | ${B.gtm_id || '[a inserir]'} |
| **Objetivo de Conversão** | ${B.objetivo_conversao || '—'} |
| **Objetivo Outro** | ${B.objetivo_outro || 'n/a'} |

---

## PARTE 4 — REDES SOCIAIS E PRESENÇA DIGITAL

| Rede | Handle / URL |
|---|---|
| **Instagram** | ${B.instagram || '—'} |
| **TikTok** | ${B.tiktok || '—'} |
| **YouTube** | ${B.youtube || '—'} |
| **Outras** | ${B.outras_redes || '—'} |

---

## PARTE 5 — MODALIDADE E ATENDIMENTO

| Campo | Valor |
|---|---|
| **Modalidade** | ${B.modalidade || '—'} |
| **Endereço** | ${B.endereco || '—'} |
| **Exibir localização** | ${B.exibir_localizacao || '—'} |
| **Cidades de atendimento** | ${B.cidades_atendimento || '—'} |
| **Plataforma online** | ${B.plataforma_online || '—'} |

---

## PARTE 6 — SERVIÇOS E PREÇO

**Serviço Principal:**
${B.servico_principal || '—'}

**Lista de Serviços:**
${B.servicos_lista || '—'}

**Descrição Detalhada:**
${B.servicos_descricao || '—'}

**Exibir Preço:** ${B.preco_exibir === 'sim' ? 'Sim' : 'Não'}

${B.preco_exibir === 'sim' ? `
**Valor / Forma de cobrança:** ${B.preco_valor || '—'}
**Condição especial:** ${B.preco_condicao || '—'}
**Oferta especial:** ${B.oferta_especial || '—'}
` : ''}

---

## PARTE 7 — PÚBLICO-ALVO E INTENÇÃO DE BUSCA

**Público Primário:**
${B.publico_primario || '—'}

**Principal Dor / Problema antes de contratar:**
${B.publico_dor || '—'}

**O que o cliente quer alcançar:**
${B.publico_resultado || '—'}

**Público Secundário:**
${B.publico_secundario || '—'}

**FAQ do cliente:**
${B.faq || 'Não fornecido — inferir baseado no nicho e nas dores acima.'}

---

## PARTE 8 — DIFERENCIAIS E AUTORIDADE

**O que concretamente diferencia esse profissional:**
${B.diferencial || '—'}

**Frase de impacto:**
${B.frase_impacto || '—'}

**História / Origem:**
${B.historia || 'Não fornecida.'}

**Cases e resultados:**
${B.casos_resultados || 'Não fornecidos.'}

**Depoimentos disponíveis:** ${B.depoimentos === 'sim' ? `Sim — ${B.depoimentos_qtd || '?'} depoimentos em formato: ${(B.depoimentos_formato || []).join(', ') || '?'}` : 'Não'}

**Google Business:** ${B.google_business === 'sim' ? `Sim — ${B.google_nota || '?'} estrelas com ${B.google_qtd || '?'} avaliações` : 'Não'}

---

## PARTE 9 — TOM DE VOZ E IDENTIDADE

**Como o site deve ser percebido:**
${B.estilo_desejado || '—'}

**O que o visitante deve sentir:**
${B.sensacao_visitante || '—'}

**Frase do tom de voz:**
${B.frase_tom || '—'}

**Vocabulário que DEVE aparecer na copy:**
${B.vocabulario_usa || '—'}

**Vocabulário PROIBIDO:**
${B.vocabulario_nunca || '—'}

**Restrições visuais e de conteúdo:**
${B.restricoes || '—'}

---

## PARTE 10 — DIREÇÃO DE ARTE

${arteAprovada ? `
### Ficha de Direção Aprovada ✓

**Paleta de Cores:**
${(arteAprovada.paleta || []).map(p => `- **${p.nome}** — \`${p.hex}\` — ${p.uso}`).join('\n')}

**Tipografia:**
- Display: ${arteAprovada.tipografia?.display?.fonte} ${arteAprovada.tipografia?.display?.peso} — ${arteAprovada.tipografia?.display?.uso}
- Corpo: ${arteAprovada.tipografia?.corpo?.fonte} ${arteAprovada.tipografia?.corpo?.peso} — ${arteAprovada.tipografia?.corpo?.uso}
${arteAprovada.tipografia?.mono ? `- Mono: ${arteAprovada.tipografia.mono.fonte} — ${arteAprovada.tipografia.mono.uso}` : ''}

**Tom Visual:**
${arteAprovada.tom_visual}

**Diretrizes de Animação:**
${arteAprovada.animacoes}

**Layout:**
${arteAprovada.layout}

**Mobile First:**
${arteAprovada.mobile_first}

**Footer:**
${arteAprovada.footer}

**Decisões Criativas:**
${(arteAprovada.decisoes || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}

**Referências Interpretadas:**
${(arteAprovada.referencias_interpretadas || []).map(r => `- [${r.tipo}] ${r.fonte}: ${r.o_que_usar}`).join('\n')}
` : `
**Ativos da Marca:**
- Cor principal: ${B.arte_cor_principal || 'não definida'}
- Cor secundária: ${B.arte_cor_secundaria || 'não definida'}
- Logo: ${B.arte_logo || 'não definida'}
- Fotos: ${B.arte_fotos || 'não definidas'}

**Direção:**
- Tema: ${B.arte_tema || 'não definido'}
- Intensidade: ${B.arte_intensidade || 'não definida'}
- Referência de marca: ${B.arte_referencia_marca || 'não definida'}
- O que NÃO quer: ${B.arte_o_que_nao_quero || 'não especificado'}
- Menu mobile: ${B.arte_menu_mobile || 'não definido'}

### Referências Pessoais
${(B.arte_referencias_pessoais || []).map((r, i) => `
**Ref. ${i+1}:** ${r.link}
- O que atraiu: ${r.gostei}
- O que adaptar: ${r.adaptar}
`).join('') || 'Não fornecidas.'}

### Referências do Nicho
${(B.arte_referencias_nicho || []).map((r, i) => `
**Ref. ${i+1}:** ${r.link}
- O que atraiu: ${r.gostei}
- O que adaptar: ${r.adaptar}
`).join('') || 'Não fornecidas.'}

> ⚠ Ficha de direção de arte não foi gerada/aprovada. A IA deve tomar as decisões de design baseada nas informações acima.
`}

---

## PARTE 11 — INTEGRAÇÕES ATIVAS

${integracoesList}

---

## PARTE 12 — BRIEFING BRUTO DO CLIENTE

> Material original fornecido pelo cliente. Use como fonte primária para enriquecer a copy.

${B.briefing_bruto || 'Não fornecido — use os campos acima como fonte de dados.'}

---

## PARTE 13 — INSTRUÇÕES ADICIONAIS

${B.instrucoes_adicionais || 'Nenhuma instrução adicional.'}

---

## PARTE 14 — REGRAS FIXAS ADSGATOR

${REGRAS_FIXAS_ADSGATOR}

---

## PARTE 15 — PROMPT DE AUDITORIA PÓS-IMPLEMENTAÇÃO

${PROMPT_AUDITORIA}
`;
  },
```

---

## 6. `callAI` — IMPLEMENTAÇÃO COMPLETA DOS 4 PROVIDERS

Substitui a função truncada no documento principal.

```javascript
  async callAI(prompt) {
    const model = AI_MODELS[this.state.selectedModel];
    if (!model) throw new Error(`Modelo ${this.state.selectedModel} não encontrado.`);

    const apiKey = this.state.apiKeys[model.provider];
    if (!apiKey?.trim()) throw new Error(`Chave de API para ${model.provider} não configurada.`);

    switch (model.provider) {
      case 'gemini':  return this._callGemini(prompt, model, apiKey);
      case 'claude':  return this._callClaude(prompt, model, apiKey);
      case 'grok':    return this._callOpenAICompat(prompt, model, apiKey);
      case 'mistral': return this._callOpenAICompat(prompt, model, apiKey);
      default: throw new Error(`Provider ${model.provider} não suportado.`);
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
          temperature:     model.temp,
          topP: 0.95,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
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
    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type':            'application/json',
        'x-api-key':               apiKey,
        'anthropic-version':       '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model:      this.state.selectedModel,
        max_tokens: model.maxTokens,
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

  async _callOpenAICompat(prompt, model, apiKey) {
    // Funciona para Grok (xAI) e Mistral — ambos usam a interface OpenAI
    const response = await fetch(model.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       this.state.selectedModel,
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
      throw new Error(msg);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error(`Resposta vazia de ${model.label}.`);
    return text;
  },
```

---

## 7. FUNÇÕES AUXILIARES AUSENTES

### Helpers de score e validação

```javascript
  calcGlobalScore() {
    const B = this.B;
    let filled = 0;
    let total  = 0;

    const weights = {
      nome_cliente: 3, segmento: 3, tipo: 2, whatsapp: 3,
      objetivo_conversao: 3, servico_principal: 4, servicos_descricao: 5,
      publico_primario: 5, publico_dor: 5, publico_resultado: 4,
      diferencial: 5, frase_impacto: 3, estilo_desejado: 3,
      sensacao_visitante: 3, depoimentos: 2, google_business: 2,
      faq: 2, historia: 1, casos_resultados: 2, vocabulario_usa: 2,
      vocabulario_nunca: 2, modalidade: 2, email: 1, horarios: 1,
    };

    for (const [field, weight] of Object.entries(weights)) {
      total += weight;
      if (B[field]?.toString().trim()) filled += weight;
    }

    return total > 0 ? Math.round((filled / total) * 100) : 0;
  },

  getStepWarnings(stepId) {
    const B = this.B;
    const warnings = [];

    Object.entries(FIELD_WARNINGS).forEach(([field, cfg]) => {
      const step = STEPS.find(s => s.fields?.includes(field));
      if (!step || step.id !== stepId) return;
      const val = B[field]?.toString().trim() || '';
      if (val.length > 0 && val.length < cfg.min) {
        warnings.push({ field, msg: cfg.msg });
      }
    });

    return warnings;
  },

  getAllWarnings() {
    const warnings = [];
    STEPS.forEach(step => {
      const ws = this.getStepWarnings(step.id);
      ws.forEach(w => warnings.push({ ...w, step: step.id, label: step.label }));
    });
    return warnings;
  },

  getMissingRequired() {
    const B = this.B;
    const missing = [];
    STEPS.forEach(step => {
      const req = REQUIRED_FIELDS[step.id] || [];
      req.forEach(field => {
        if (!B[field]?.toString().trim()) {
          missing.push({ step: step.id, label: step.label, field });
        }
      });
    });
    return missing;
  },

  updateTopbarScore() {
    const score = this.calcGlobalScore();
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = score + '%';
    const pct = document.getElementById('project-score-pct');
    if (pct) pct.textContent = score + '%';
    const bar = document.getElementById('project-score-fill');
    if (bar) bar.style.width = score + '%';
  },
```

### fieldLabel helper

```javascript
  fieldLabel(field, label, required = false, optional = false) {
    const tooltip = FIELD_TOOLTIPS[field];
    const req = required ? `<span class="field-required">*</span>` : '';
    const opt = optional ? `<span class="field-optional">opcional</span>` : '';
    const tip = tooltip ? `
      <span class="field-tooltip">
        <i data-lucide="info" class="field-tooltip-icon"></i>
        <span class="field-tooltip-bubble">${tooltip}</span>
      </span>` : '';

    return `
      <label class="field-label">
        ${label} ${req} ${opt} ${tip}
      </label>
    `;
  },
```

### Navegação

```javascript
  goToScreen(screen) {
    this.state.screen = screen;
    this.renderScreen();
    this.renderStepsNav();
    this.renderBottombar();
    this.updateTopbar();
    const content = document.getElementById('screen-content');
    if (content) content.scrollTop = 0;
  },

  goToStep(n) {
    if (n < 1 || n > STEPS.length) return;
    this.state.screen = 'step';
    this.state.currentStep = n;
    // Marcar como visitado
    if (this.P && !this.P.visitedSteps.includes(n)) {
      this.P.visitedSteps.push(n);
    }
    this.renderScreen();
    this.renderStepsNav();
    this.renderBottombar();
    this.updateTopbar();
    const content = document.getElementById('screen-content');
    if (content) content.scrollTop = 0;
  },

  goNext() {
    const { screen, currentStep } = this.state;
    if (screen === 'intake') {
      this.goToStep(1);
    } else if (screen === 'step') {
      if (currentStep < STEPS.length) {
        this.goToStep(currentStep + 1);
      } else {
        this.goToScreen('art');
      }
    } else if (screen === 'art') {
      this.goToScreen('review');
    }
  },

  goPrev() {
    const { screen, currentStep } = this.state;
    if (screen === 'review') {
      this.goToScreen('art');
    } else if (screen === 'art') {
      this.goToStep(STEPS.length);
    } else if (screen === 'step') {
      if (currentStep > 1) {
        this.goToStep(currentStep - 1);
      } else {
        this.goToScreen('intake');
      }
    }
  },
```

### Render principal

```javascript
  renderScreen() {
    const content = document.getElementById('screen-content');
    if (!content) return;

    let html = '';
    switch (this.state.screen) {
      case 'intake':
        html = this.buildIntakeHTML();
        break;
      case 'step':
        html = this.buildStepHTML(this.state.currentStep);
        break;
      case 'art':
        html = this.buildArtHTML();
        break;
      case 'review':
        html = `<div class="step-inner">${this.buildStepReview()}</div>`;
        break;
      default:
        html = this.buildIntakeHTML();
    }

    content.innerHTML = html;

    // Re-aplicar estados salvos de chips e sel-cards
    this.restoreFieldStates();

    // Registrar eventos dos campos
    this.bindFieldEvents(content);

    // Render ícones Lucide
    lucide.createIcons({ nodes: [content] });
  },

  buildStepHTML(stepId) {
    const step = STEPS[stepId - 1];
    if (!step) return '';

    const builders = {
      1: () => this.buildStep1(),
      2: () => this.buildStep3(), // redes sociais
      3: () => this.buildStep4(), // atendimento
      4: () => this.buildStep5(), // serviços
      5: () => this.buildStep5(), // preço (embutido no 4 por conveniência)
      6: () => this.buildStep6(), // público
      7: () => this.buildStep7(), // diferenciais
      8: () => this.buildStep8(), // tom
    };

    const content = builders[stepId] ? builders[stepId]() : '';
    return `<div class="step-inner animate-in">${content}</div>`;
  },

  buildIntakeHTML() {
    const B = this.B;
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    return `
      <div class="intake-screen animate-in">
        <div class="intake-hero">
          <div class="intake-badge">
            <i data-lucide="sparkles" style="width:12px;height:12px"></i>
            LandingAI v3 — Adsgator
          </div>
          <div class="intake-title">Cole o briefing.<br>A IA preenche tudo.</div>
          <div class="intake-subtitle">
            Cole o material bruto do cliente abaixo e o sistema preenche automaticamente
            todos os 8 steps. Você revisa e ajusta — não digita do zero.
          </div>
        </div>

        <div class="intake-box">
          <div class="intake-box-header">
            <i data-lucide="file-text" class="intake-box-icon" style="width:18px;height:18px"></i>
            <span class="intake-box-title">Material do Cliente</span>
            <span class="intake-box-desc">Briefing bruto, formulário preenchido, conversa, etc.</span>
          </div>
          <div class="intake-box-body">
            <div class="field-group">
              <textarea class="field-textarea xtall" id="intake-text" data-field="briefing_bruto"
                placeholder="Cole aqui qualquer material do cliente:

• Respostas de formulário de briefing
• Transcrição de conversa ou reunião
• E-mail do cliente descrevendo o negócio
• Print de conversa no WhatsApp
• Qualquer texto com informações sobre o cliente

Quanto mais material, mais preciso o preenchimento automático.">${B.briefing_bruto || ''}</textarea>
            </div>

            <div class="intake-or">ou anexe arquivos</div>

            <div class="upload-zone" id="intake-upload-zone"
              onclick="document.getElementById('intake-file-input').click()"
              ondragover="event.preventDefault();this.classList.add('drag-over')"
              ondragleave="this.classList.remove('drag-over')"
              ondrop="App.handleIntakeFileDrop(event)">
              <input type="file" id="intake-file-input" accept=".pdf,.doc,.docx,.txt,.md"
                multiple onchange="App.handleIntakeFileSelect(event)">
              <i data-lucide="upload" class="upload-zone-icon"></i>
              <div class="upload-zone-label">PDF, Word ou TXT</div>
              <div class="upload-zone-hint">Arraste ou clique para selecionar</div>
            </div>

            <div class="upload-preview-list" id="intake-files-list"></div>

            <div class="intake-actions">
              <div style="font-size:12px;color:var(--text-tertiary)">
                ${hasKey ? '✓ API configurada' : '⚠ Sem API key — preencha manualmente'}
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn-ghost btn-sm" onclick="App.goToStep(1)">
                  Preencher manualmente
                </button>
                <button class="btn-primary btn-sm" onclick="App.runIntakeAnalysis()" ${hasKey ? '' : 'disabled'}>
                  <i data-lucide="sparkles" style="width:14px;height:14px"></i>
                  Analisar e preencher
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="intake-sop-hint">
          <i data-lucide="info" class="intake-sop-hint-icon" style="width:16px;height:16px"></i>
          <div class="intake-sop-hint-text">
            <strong>Sem API key?</strong> Clique em "Preencher manualmente" e percorra os steps.
            O DOC-1 pode ser baixado sem API e usado em qualquer IA externamente.
          </div>
        </div>
      </div>
    `;
  },

  buildArtHTML() {
    const B = this.B;
    const artApproved = !!B.arte_ficha_aprovada;

    const addRef = (field, label) => `
      <div style="margin-bottom:8px">
        <button class="btn-ghost btn-sm" onclick="App.addArtRef('${field}')">
          <i data-lucide="plus" style="width:14px;height:14px"></i>
          Adicionar ${label}
        </button>
      </div>
      <div id="art-refs-${field}">
        ${(B[field] || []).map((r, i) => `
          <div class="art-ref-item" style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px;margin-bottom:8px;align-items:start">
            <input type="text" class="field-input" placeholder="URL ou nome" value="${r.link || ''}"
              onchange="App.updateArtRef('${field}', ${i}, 'link', this.value)">
            <input type="text" class="field-input" placeholder="O que me atraiu" value="${r.gostei || ''}"
              onchange="App.updateArtRef('${field}', ${i}, 'gostei', this.value)">
            <input type="text" class="field-input" placeholder="O que adaptar" value="${r.adaptar || ''}"
              onchange="App.updateArtRef('${field}', ${i}, 'adaptar', this.value)">
            <button class="btn-danger-ghost" style="padding:10px" onclick="App.removeArtRef('${field}', ${i})">
              <i data-lucide="trash-2" style="width:13px;height:13px"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;

    return `
      <div class="art-screen animate-in">
        <div class="art-screen-header">
          <div class="art-screen-title">Direção de Arte</div>
          <div class="art-screen-desc">
            Cole referências visuais e os ativos da marca.
            A IA analisa e entrega uma ficha estruturada — paleta, tipografia, tom visual e decisões.
            Você aprova ou revisa.
          </div>
        </div>

        ${artApproved ? `
          <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--accent-dim);border:1px solid var(--accent-border);border-radius:var(--r-md)">
            <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--accent)"></i>
            <span style="font-size:13px;color:var(--accent);font-weight:600">Direção de arte aprovada</span>
            <button class="btn-ghost btn-sm" style="margin-left:auto" onclick="App.clearArtFicha()">Refazer</button>
          </div>
        ` : ''}

        <div class="art-section">
          <div class="art-section-header">
            <i data-lucide="image" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <span style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-primary)">Ativos da Marca</span>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:16px">
            <div class="form-row">
              <div class="field-group">
                ${this.fieldLabel('arte_cor_principal', 'Cor principal da marca', false, true)}
                <div class="color-picker-wrap">
                  <div class="color-picker-swatch">
                    <input type="color" value="${B.arte_cor_principal || '#000000'}"
                      onchange="App.setField('arte_cor_principal', this.value)">
                  </div>
                  <input type="text" class="field-input color-picker-input" data-field="arte_cor_principal"
                    placeholder="Ex: #1A4731 ou 'sem identidade definida'"
                    value="${B.arte_cor_principal || ''}">
                </div>
              </div>
              <div class="field-group">
                ${this.fieldLabel('arte_cor_secundaria', 'Cor secundária / acento', false, true)}
                <div class="color-picker-wrap">
                  <div class="color-picker-swatch">
                    <input type="color" value="${B.arte_cor_secundaria || '#FFFFFF'}"
                      onchange="App.setField('arte_cor_secundaria', this.value)">
                  </div>
                  <input type="text" class="field-input color-picker-input" data-field="arte_cor_secundaria"
                    placeholder="Ex: #C9A84C ou 'não existe'"
                    value="${B.arte_cor_secundaria || ''}">
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="field-group">
                ${this.fieldLabel('arte_logo', 'Logo disponível', false, true)}
                <input type="text" class="field-input" data-field="arte_logo"
                  placeholder="SVG / PNG / Não tem"
                  value="${B.arte_logo || ''}">
              </div>
              <div class="field-group">
                ${this.fieldLabel('arte_fotos', 'Fotos disponíveis', false, true)}
                <input type="text" class="field-input" data-field="arte_fotos"
                  placeholder="Sim — alta qualidade / Sim — qualidade média / Não"
                  value="${B.arte_fotos || ''}">
              </div>
            </div>
          </div>
        </div>

        <div class="art-section">
          <div class="art-section-header">
            <i data-lucide="compass" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <span style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-primary)">Direção Criativa</span>
          </div>
          <div style="padding:20px;display:flex;flex-direction:column;gap:16px">
            <div class="form-row">
              <div class="field-group">
                ${this.fieldLabel('arte_tema', 'Tema')}
                <div class="chip-group">
                  ${['Claro','Escuro','IA decide'].map(t => `
                    <button class="chip ${B.arte_tema === t ? 'on' : ''}" data-field="arte_tema" data-chip="${t}">${t}</button>
                  `).join('')}
                </div>
              </div>
              <div class="field-group">
                ${this.fieldLabel('arte_intensidade', 'Intensidade visual')}
                <div class="chip-group">
                  ${['Contido','Médio','Alto — efeito uau'].map(t => `
                    <button class="chip ${B.arte_intensidade === t ? 'on' : ''}" data-field="arte_intensidade" data-chip="${t}">${t}</button>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_referencia_marca', 'Referência de marca', false, true)}
              <input type="text" class="field-input" data-field="arte_referencia_marca"
                placeholder="Ex: Próximo da Notion / Editorial como Dezeen / Direto como Stripe"
                value="${B.arte_referencia_marca || ''}">
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_menu_mobile', 'Menu mobile', false, true)}
              <div class="chip-group">
                ${['Fullscreen overlay','Drawer lateral','Bottom sheet','IA decide'].map(t => `
                  <button class="chip ${B.arte_menu_mobile === t ? 'on' : ''}" data-field="arte_menu_mobile" data-chip="${t}">${t}</button>
                `).join('')}
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_o_que_nao_quero', 'O que NÃO quero de forma alguma')}
              <textarea class="field-textarea" data-field="arte_o_que_nao_quero"
                placeholder="Ex: Sem rosa. Nada que pareça infoproduto. Sem gradiente roxo. Sem fontes cursivas.">${B.arte_o_que_nao_quero || ''}</textarea>
            </div>
          </div>
        </div>

        <div class="art-section">
          <div class="art-section-header">
            <i data-lucide="link" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <span style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-primary)">Referências Visuais Pessoais</span>
          </div>
          <div style="padding:20px">
            ${addRef('arte_referencias_pessoais', 'referência pessoal')}
          </div>
        </div>

        <div class="art-section">
          <div class="art-section-header">
            <i data-lucide="search" style="width:16px;height:16px;color:var(--text-secondary)"></i>
            <span style="font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--text-primary)">Referências do Nicho</span>
          </div>
          <div style="padding:20px">
            ${addRef('arte_referencias_nicho', 'referência do nicho')}
          </div>
        </div>

        <div style="display:flex;justify-content:center;padding:8px 0">
          <button class="btn-primary" id="btn-analyze-art" onclick="App.runArtAnalysis()">
            <i data-lucide="sparkles" style="width:16px;height:16px"></i>
            Analisar e gerar ficha de direção
          </button>
        </div>
      </div>
    `;
  },
```

### Render sidebar e topbar

```javascript
  renderStepsNav() {
    const nav = document.getElementById('steps-nav');
    if (!nav) return;

    const { screen, currentStep } = this.state;

    const items = STEPS.map(step => {
      const isActive   = screen === 'step' && currentStep === step.id;
      const isVisited  = this.P?.visitedSteps?.includes(step.id);
      const warnings   = this.getStepWarnings(step.id);
      const missing    = (REQUIRED_FIELDS[step.id] || []).filter(f => !this.B[f]?.toString().trim());
      const isComplete = isVisited && missing.length === 0;
      const hasError   = isVisited && missing.length > 0;
      const hasWarn    = isVisited && warnings.length > 0 && missing.length === 0;

      const cls = [
        'step-nav-item',
        isActive  ? 'active'    : '',
        isComplete && !isActive ? 'done' : '',
        hasError  ? 'has-error' : '',
      ].filter(Boolean).join(' ');

      const dotContent = isComplete
        ? `<i data-lucide="check" style="width:10px;height:10px;color:var(--accent)"></i>`
        : hasError
        ? `<i data-lucide="x" style="width:10px;height:10px;color:var(--danger)"></i>`
        : `<span class="step-dot-inner">${step.id}</span>`;

      return `
        <button class="${cls}" onclick="App.goToStep(${step.id})">
          <div class="step-dot">${dotContent}</div>
          <span class="step-label">${step.label}</span>
          ${hasWarn ? `<i data-lucide="alert-triangle" style="width:11px;height:11px;color:var(--warning);margin-left:auto"></i>` : ''}
        </button>
      `;
    }).join('');

    const artCls = `step-nav-item step-art ${screen === 'art' ? 'active' : ''}`;
    const reviewCls = `step-nav-item step-review ${screen === 'review' ? 'active' : ''}`;

    nav.innerHTML = `
      <div class="steps-nav">
        ${items}
        <button class="${artCls}" onclick="App.goToScreen('art')">
          <div class="step-dot step-dot--art">
            <i data-lucide="palette" style="width:10px;height:10px"></i>
          </div>
          <span class="step-label">Direção de Arte</span>
          ${this.state.artAnalyzed ? `<i data-lucide="check" style="width:11px;height:11px;color:var(--accent);margin-left:auto"></i>` : ''}
        </button>
        <button class="${reviewCls}" onclick="App.goToScreen('review')">
          <div class="step-dot step-dot--review">
            <i data-lucide="zap" style="width:10px;height:10px"></i>
          </div>
          <span class="step-label">Revisão e Geração</span>
        </button>
      </div>
    `;

    lucide.createIcons({ nodes: [nav] });
  },

  updateSidebar() {
    // Nome do projeto
    const nameEl = document.getElementById('project-name');
    if (nameEl) nameEl.textContent = this.P?.name || 'Novo Projeto';

    const segEl = document.getElementById('project-segment');
    if (segEl) segEl.textContent = this.B.segmento || '—';

    // Score
    const score = this.calcGlobalScore();
    const fill = document.getElementById('project-score-fill');
    const pct  = document.getElementById('project-score-pct');
    if (fill) fill.style.width = score + '%';
    if (pct)  pct.textContent = score + '%';

    // API status
    const providers = ['gemini','claude','grok','mistral'];
    const configuredCount = providers.filter(p => this.state.apiKeys[p]?.trim()).length;
    const dot   = document.getElementById('sidebar-api-dot');
    const label = document.getElementById('sidebar-api-label');
    if (dot && label) {
      if (configuredCount === 0) {
        dot.className = 'status-dot';
        label.textContent = 'Sem API';
      } else if (configuredCount === providers.length) {
        dot.className = 'status-dot ok';
        label.textContent = 'API OK';
      } else {
        dot.className = 'status-dot partial';
        label.textContent = `${configuredCount}/${providers.length} APIs`;
      }
    }
  },

  updateTopbar() {
    const { screen, currentStep } = this.state;
    const titles = {
      intake: 'Intake — Material do Cliente',
      art:    'Direção de Arte',
      review: 'Revisão Final e Geração',
    };

    const subs = {
      intake: 'Cole o briefing bruto — a IA analisa e preenche os steps',
      art:    'Referências visuais e ativos da marca',
      review: 'Confira o briefing e gere a Ficha de Implementação',
    };

    let title = titles[screen] || '';
    let sub   = subs[screen] || '';

    if (screen === 'step') {
      const step = STEPS[currentStep - 1];
      title = step ? `Step ${currentStep} — ${step.label}` : '';
      sub   = `${currentStep} de ${STEPS.length}`;
    }

    const titleEl = document.getElementById('topbar-title');
    const subEl   = document.getElementById('topbar-subtitle');
    if (titleEl) titleEl.textContent = title;
    if (subEl)   subEl.textContent   = sub;

    // Progress
    let pct = 0;
    if (screen === 'step')   pct = Math.round((currentStep / (STEPS.length + 2)) * 100);
    if (screen === 'art')    pct = Math.round(((STEPS.length + 1) / (STEPS.length + 2)) * 100);
    if (screen === 'review') pct = 100;

    const bar = document.getElementById('topbar-progress-fill');
    if (bar) bar.style.width = pct + '%';
  },
```

### Bind events e restauração de estados

```javascript
  bindFieldEvents(container) {
    // Inputs e textareas
    container.querySelectorAll('[data-field]').forEach(el => {
      const field = el.dataset.field;
      if (!field) return;

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.addEventListener('input', () => {
          this.setField(field, el.value);
          this.updateTopbarScore();
        });
      }
    });

    // Chips
    container.querySelectorAll('.chip[data-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const field = chip.dataset.field;
        const value = chip.dataset.chip;
        const isMulti = chip.dataset.multi === 'true';

        if (isMulti) {
          this.toggleArray(field, value);
          chip.classList.toggle('on');
        } else {
          // Single select — desmarcar outros do grupo
          container.querySelectorAll(`.chip[data-field="${field}"]`).forEach(c => c.classList.remove('on'));
          this.setField(field, value);
          chip.classList.add('on');
        }

        this.updateTopbarScore();
      });
    });

    // Sel-cards
    container.querySelectorAll('.sel-card[data-selcard]').forEach(card => {
      card.addEventListener('click', () => {
        const field = card.dataset.field;
        const value = card.dataset.selcard;
        container.querySelectorAll(`.sel-card[data-field="${field}"]`).forEach(c => c.classList.remove('on'));
        card.classList.add('on');
        this.setField(field, value);

        // Alguns campos precisam re-render (condicional)
        if (['objetivo_conversao','modalidade','preco_exibir','depoimentos','google_business'].includes(field)) {
          setTimeout(() => { this.renderScreen(); }, 50);
        }
      });
    });
  },

  restoreFieldStates() {
    const B = this.B;
    const content = document.getElementById('screen-content');
    if (!content) return;

    // Restaurar chips de arrays
    const arrayFields = ['integracoes','depoimentos_formato'];
    arrayFields.forEach(field => {
      const values = B[field] || [];
      content.querySelectorAll(`.chip[data-field="${field}"]`).forEach(chip => {
        if (values.includes(chip.dataset.chip)) chip.classList.add('on');
      });
    });

    // Restaurar chips de valor único
    content.querySelectorAll('.chip[data-chip]:not([data-multi])').forEach(chip => {
      const field = chip.dataset.field;
      if (!field || !B[field]) return;
      if (B[field] === chip.dataset.chip) chip.classList.add('on');
    });

    // Restaurar sel-cards
    content.querySelectorAll('.sel-card[data-selcard]').forEach(card => {
      const field = card.dataset.field;
      if (!field || !B[field]) return;
      if (B[field] === card.dataset.selcard) card.classList.add('on');
    });
  },
```

### toggleArray (referenciado mas ausente no truncado)

```javascript
  toggleArray(field, value) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    const idx = arr.indexOf(value);
    if (idx === -1) arr.push(value);
    else arr.splice(idx, 1);
    this.P.briefing[field] = arr;
    this.autosave();
  },
```

### Art refs helpers

```javascript
  addArtRef(field) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    arr.push({ link: '', gostei: '', adaptar: '' });
    this.P.briefing[field] = arr;
    this.autosave();
    this.renderScreen();
  },

  updateArtRef(field, index, key, value) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    if (arr[index]) arr[index][key] = value;
    this.P.briefing[field] = arr;
    this.autosave();
  },

  removeArtRef(field, index) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    arr.splice(index, 1);
    this.P.briefing[field] = arr;
    this.autosave();
    this.renderScreen();
  },

  clearArtFicha() {
    if (!this.P) return;
    this.P.briefing.arte_ficha_aprovada = '';
    this.state.artAnalyzed = false;
    this.autosave();
    this.renderScreen();
  },
```

### Intake file handling

```javascript
  handleIntakeFileSelect(event) {
    const files = Array.from(event.target.files);
    this.state.intakeFiles = [...(this.state.intakeFiles || []), ...files];
    this.renderIntakeFilesList();
  },

  handleIntakeFileDrop(event) {
    event.preventDefault();
    const zone = document.getElementById('intake-upload-zone');
    if (zone) zone.classList.remove('drag-over');
    const files = Array.from(event.dataTransfer.files);
    this.state.intakeFiles = [...(this.state.intakeFiles || []), ...files];
    this.renderIntakeFilesList();
  },

  renderIntakeFilesList() {
    const list = document.getElementById('intake-files-list');
    if (!list) return;
    list.innerHTML = (this.state.intakeFiles || []).map((f, i) => `
      <div class="upload-preview-item">
        <i data-lucide="file" style="width:14px;height:14px"></i>
        <span>${f.name}</span>
        <button onclick="App.removeIntakeFile(${i})">
          <i data-lucide="x" style="width:12px;height:12px"></i>
        </button>
      </div>
    `).join('');
    lucide.createIcons({ nodes: [list] });
    const zone = document.getElementById('intake-upload-zone');
    if (zone && this.state.intakeFiles?.length > 0) zone.classList.add('has-file');
  },

  removeIntakeFile(index) {
    this.state.intakeFiles.splice(index, 1);
    this.renderIntakeFilesList();
  },
```

### Modais, Toast, Notificação

```javascript
  openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
    // Só restaurar scroll se não houver mais modais abertos
    const anyOpen = document.querySelector('.modal-overlay.open');
    if (!anyOpen) document.body.style.overflow = '';
  },

  showToast(msg, type = 'default', duration = 3500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast ${type} visible`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('visible'), duration);
  },

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(p => {
        this.state.notifPermission = p;
      });
    }
  },

  showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: 'assets/icon.png' });
      } catch (e) { /* silencioso em contextos restritos */ }
    }
  },

  downloadText(content, filename, mime = 'text/plain') {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
```

### renderApiModal e renderModelDropdown

```javascript
  renderApiModal() {
    const body = document.getElementById('api-modal-body');
    if (!body) return;

    const providers = [
      { key: 'gemini',  name: 'Google Gemini',   link: 'https://aistudio.google.com/app/apikey', models: ['gemini-2.5-pro','gemini-2.5-flash'] },
      { key: 'claude',  name: 'Anthropic Claude', link: 'https://console.anthropic.com',          models: ['claude-sonnet-4-20250514','claude-haiku-4-5-20251001'] },
      { key: 'grok',    name: 'xAI Grok',         link: 'https://console.x.ai',                   models: ['grok-3'] },
      { key: 'mistral', name: 'Mistral AI',        link: 'https://console.mistral.ai',             models: ['mistral-large-latest'] },
    ];

    body.innerHTML = providers.map(p => {
      const hasKey = !!this.state.apiKeys[p.key]?.trim();
      return `
        <div class="api-provider-card">
          <div class="api-provider-header">
            <div class="api-provider-name">
              ${p.name}
              <span class="api-key-status ${hasKey ? 'ok' : 'empty'}">
                <i data-lucide="${hasKey ? 'check' : 'minus'}" style="width:11px;height:11px"></i>
                ${hasKey ? 'Configurada' : 'Não configurada'}
              </span>
            </div>
            <a href="${p.link}" target="_blank" class="api-provider-link">Obter chave →</a>
          </div>
          <div class="api-key-row">
            <input type="password" class="field-input" id="key-${p.key}"
              placeholder="Cole sua API Key aqui"
              value="${this.state.apiKeys[p.key] || ''}">
            <button class="btn-ghost btn-sm" onclick="App.toggleKeyVisibility('key-${p.key}')">
              <i data-lucide="eye" style="width:14px;height:14px"></i>
            </button>
            <button class="btn-primary btn-sm" onclick="App.saveApiKey('${p.key}', document.getElementById('key-${p.key}').value)">
              Salvar
            </button>
          </div>
          <div style="font-size:11px;color:var(--text-tertiary)">
            Modelos: ${p.models.join(', ')}
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ nodes: [body] });
  },

  saveApiKey(provider, value) {
    this.state.apiKeys[provider] = value.trim();
    this.saveStorage();
    this.updateSidebar();
    this.renderApiModal();
    this.showToast(`Chave ${provider} salva!`, 'success');
  },

  toggleKeyVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  renderModelDropdown() {
    const wrap = document.getElementById('model-dropdown');
    if (!wrap) return;

    const groups = {};
    Object.entries(AI_MODELS).forEach(([key, model]) => {
      if (!groups[model.group]) groups[model.group] = [];
      groups[model.group].push({ key, ...model });
    });

    wrap.innerHTML = Object.entries(groups).map(([group, models]) => `
      <div class="model-group-label">${group}</div>
      ${models.map(m => `
        <button class="model-option ${this.state.selectedModel === m.key ? 'active' : ''}"
          onclick="App.selectModel('${m.key}')">
          <span class="model-option-name">${m.label}</span>
          <span class="model-tier model-tier--${m.tier}">${m.tier === 'free' ? 'Grátis' : 'Pago'}</span>
        </button>
      `).join('')}
      <div class="model-divider"></div>
    `).join('');
  },

  selectModel(key) {
    this.state.selectedModel = key;
    this.saveStorage();
    // Atualizar label do botão
    const btn = document.getElementById('btn-model-label');
    if (btn) btn.textContent = AI_MODELS[key]?.label || key;
    // Fechar dropdown
    const dd = document.getElementById('model-dropdown');
    if (dd) dd.style.display = 'none';
    this.showToast(`Modelo: ${AI_MODELS[key]?.label}`, 'success');
  },

  renderProjectsList() {
    const list = document.getElementById('projects-list');
    if (!list) return;

    const projects = Object.values(this.state.projects).sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    if (projects.length === 0) {
      list.innerHTML = `<p style="font-size:13px;color:var(--text-tertiary);text-align:center;padding:20px">Nenhum projeto ainda</p>`;
      return;
    }

    list.innerHTML = projects.map(p => {
      const date = new Date(p.updatedAt).toLocaleDateString('pt-BR');
      const isActive = p.id === this.state.activeId;
      return `
        <div class="project-list-item ${isActive ? 'active-project' : ''}"
          onclick="App.loadProject('${p.id}')">
          <div class="project-list-info">
            <div class="project-list-name">${p.name || 'Sem nome'}</div>
            <div class="project-list-meta">${p.briefing?.segmento || '—'} · ${date}</div>
          </div>
          <div class="project-list-actions" onclick="event.stopPropagation()">
            <button class="project-list-action" onclick="App.cloneProject('${p.id}')" title="Duplicar">
              <i data-lucide="copy" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-action danger" onclick="App.deleteProject('${p.id}')" title="Excluir">
              <i data-lucide="trash-2" style="width:13px;height:13px"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ nodes: [list] });
  },
```

### setupGlobalEvents

```javascript
  setupGlobalEvents() {
    // ESC fecha modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
          this.closeModal(m.id);
        });
      }
    });

    // Click fora do modal fecha
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.closeModal(overlay.id);
      });
    });

    // Model dropdown toggle
    const btnModel = document.getElementById('btn-model-selector');
    const dropdown = document.getElementById('model-dropdown');
    if (btnModel && dropdown) {
      btnModel.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) this.renderModelDropdown();
      });
      document.addEventListener('click', () => {
        if (dropdown) dropdown.style.display = 'none';
      });
      dropdown.addEventListener('click', e => e.stopPropagation());
    }

    // Botão de projetos
    const btnProjects = document.getElementById('btn-open-projects');
    if (btnProjects) {
      btnProjects.addEventListener('click', () => {
        this.renderProjectsList();
        this.openModal('modal-projects');
      });
    }

    // Botão de configurar API
    const btnApi = document.getElementById('btn-open-api');
    if (btnApi) {
      btnApi.addEventListener('click', () => {
        this.renderApiModal();
        this.openModal('modal-api');
      });
    }

    // Novo projeto no modal
    const btnNew = document.getElementById('btn-new-project');
    if (btnNew) btnNew.addEventListener('click', () => this.createProject());

    // Importar projeto
    const btnImport = document.getElementById('btn-import-project');
    const importInput = document.getElementById('import-file-input');
    if (btnImport && importInput) {
      btnImport.addEventListener('click', () => importInput.click());
      importInput.addEventListener('change', e => {
        if (e.target.files[0]) this.importProject(e.target.files[0]);
      });
    }

    // Intake text — salvar no briefing
    document.addEventListener('input', e => {
      const field = e.target.dataset?.field;
      if (field && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        this.setField(field, e.target.value);
      }
    });
  },
```

---

## 8. README.md

```markdown
# LandingAI v3 — Adsgator

Sistema interno de geração de Fichas de Implementação para projetos de landing page.

## Como usar

1. Abra `index.html` no Chrome ou Edge (duplo clique)
2. Configure ao menos uma API Key em **Config. API**
3. Cole o briefing do cliente na tela de Intake
4. Clique em **Analisar e preencher** — a IA preenche os 8 steps automaticamente
5. Percorra os steps, revise e ajuste
6. Vá para **Direção de Arte** — adicione referências, clique em analisar
7. Aprove a ficha de arte
8. Vá para **Revisão e Geração**
9. Clique em **Gerar Ficha de Implementação**
10. Envie o `doc-impl-[slug].md` ao Roo Code para implementação

## Modo sem API

Preencha os steps manualmente e baixe o **DOC-1** na tela de revisão.
O DOC-1 é um prompt completo que pode ser usado em qualquer IA externamente.

## Modelos suportados

| Modelo | Provider | Nível |
|---|---|---|
| Gemini 2.5 Pro | Google | Pago |
| Gemini 2.5 Flash | Google | Gratuito |
| Claude Sonnet 4 | Anthropic | Pago |
| Claude Haiku 4.5 | Anthropic | Gratuito |
| Grok 3 | xAI | Pago |
| Mistral Large | Mistral AI | Pago |

## Onde obter API Keys

- **Gemini:** https://aistudio.google.com/app/apikey
- **Claude:** https://console.anthropic.com
- **Grok:** https://console.x.ai
- **Mistral:** https://console.mistral.ai

## O que o sistema gera

- **DOC-1** (`doc1-[slug].md`) — briefing estruturado + prompt completo. Funciona sem API.
- **DOC-IMPL** (`doc-impl-[slug].md`) — Ficha de Implementação completa para o Roo. Requer API.
- **Preview** — mockup HTML simplificado do hero + 3 seções + footer.

## Stack dos projetos gerados pelo sistema

Astro · Tailwind CSS · GSAP · ScrollTrigger · Framer Motion · Lenis · Web3Forms  
Deploy: Vercel (output: hybrid) ou Netlify  
Analytics: Vercel Analytics + Speed Insights  
LGPD: Cookie Banner + Google Consent Mode v2

## Dados e privacidade

Todos os dados ficam exclusivamente no `localStorage` do seu browser.
Nenhuma informação é enviada a servidores da Adsgator.
As chamadas de API vão diretamente do browser para o provider escolhido.

## Suporte

Sistema interno Adsgator — v3.0.0
```

---

## NOTA FINAL PARA O ROO

Ao implementar, siga esta ordem:

1. Crie os 3 arquivos base: `index.html`, `assets/app.css`, `assets/app.js`
2. No `app.js`, cole as **constantes** deste documento no início
3. Cole o objeto `App` do documento principal, completando com as funções deste complemento
4. Cole o CSS deste complemento ao final do `app.css`
5. Crie `output/.gitkeep` e `README.md`
6. Teste a sequência completa: intake → steps 1–8 → arte → revisão → geração

**Os dois documentos juntos formam a especificação completa. Nenhum dado deve ser inventado além do que está descrito.**
