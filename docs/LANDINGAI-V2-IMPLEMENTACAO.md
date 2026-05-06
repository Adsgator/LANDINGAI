# LandingAI v2 — Documentação de Implementação
> Adsgator · Sistema Interno · Uso Solo  
> Stack: HTML + CSS + Vanilla JS (zero build, zero npm, abre com duplo clique)  
> Output: DOC-1 formatado + DOC-IMPL (se API ativa)  
> Leia tudo antes de escrever uma linha de código.

---

## 1. VISÃO GERAL

### O que é o LandingAI v2

Sistema web interno da Adsgator para criação de landing pages premium. Substitui o processo manual de preenchimento de documentos, centralizando tudo em uma interface visual guiada, com validação inteligente e geração de documentação via IA.

### Fluxo de Trabalho

```
ANTES (manual):
  Briefing bruto → Doc 1 (IA gera copy) → Doc 2 (você preenche direção) → IA gera Doc Impl → Roo implementa

COM LANDINGAI v2:
  Formulário multi-step → Validação → DOC-1 formatado
    ↓ Rota Manual:    Baixa DOC-1 → Claude gera DOC-IMPL → IDE implementa
    ↓ Rota Auto:      API chama IA → IA gera DOC-IMPL → Download + Preview
```

### O que o sistema entrega

| Arquivo | Quando | Descrição |
|---|---|---|
| `doc1-[slug].md` | Sempre (ambas as rotas) | Briefing estruturado + direção visual completa — pronto para IA |
| `doc-impl-[slug].md` | Rota automática (API) | Ficha de Implementação completa para IDE |

### Dois modos de operação

**Modo Manual (sem API):**
- Preenche → Valida → Baixa `doc1-[slug].md` → Você envia para Claude → Claude gera DOC-IMPL

**Modo Automático (com API):**
- Preenche → Valida → Clica "Gerar DOC-IMPL" → IA processa → Download `doc-impl-[slug].md` + Preview

---

## 2. ARQUITETURA TÉCNICA

### Stack

```
Sistema 100% browser — zero build, zero npm, zero backend
Abre com duplo clique no index.html
```

| Camada | Tecnologia | Justificativa |
|---|---|---|
| HTML | Único arquivo `index.html` | Portabilidade total |
| CSS | `assets/app.css` | Design system proprietário |
| JS | `assets/app.js` | Lógica completa do app |
| Armazenamento | `localStorage` | Persistência local sem servidor |
| APIs | Fetch nativo | Gemini, Claude, Grok, Mistral |
| Ícones | Lucide Icons (CDN) | Modernos, SVG-based, consistentes |
| Fontes | Google Fonts (CDN) | Syne + DM Sans + DM Mono |

### Estrutura de Arquivos

```
landingai/
├── index.html              ← App principal
├── assets/
│   ├── app.css             ← Design system + estilos
│   └── app.js              ← Lógica completa (App object)
├── output/
│   └── .gitkeep            ← Arquivos .md gerados aqui
└── README.md
```

### Estrutura do App Object (JavaScript)

```javascript
const App = {
  // Estado global
  state: {
    currentStep: 1,
    totalSteps: 9,
    projects: {},          // Todos os projetos salvos
    activeProjectId: null, // Projeto ativo
    visitedSteps: new Set(),
    apiKeys: {
      gemini: '',
      claude: '',
      grok: '',
      mistral: ''
    },
    selectedModel: 'gemini-2.5-flash',
    isGenerating: false,
    generationLog: [],
    lastError: null
  },

  // Briefing ativo (projeto em edição)
  briefing: { /* campos — ver Seção 5 */ },

  // Métodos de ciclo de vida
  init(),
  render(),
  destroy(),

  // Navegação
  goToStep(n),
  goToProject(id),

  // Projetos
  createProject(),
  saveProject(),
  loadProject(id),
  cloneProject(id),
  deleteProject(id),
  listProjects(),

  // Formulário
  setField(field, val),
  toggleArrayField(field, val),
  updateName(val),
  sanitizeSlug(val),

  // Validação
  validateStep(n),
  validateAll(),
  getFieldScore(field),
  getStepScore(n),
  getTotalScore(),
  getWarnings(),
  getCriticalMissing(),

  // Geração de documento
  buildDoc1(),           // Compila o DOC-1 em markdown
  buildMasterPrompt(),   // Prompt para IA gerar DOC-IMPL
  downloadDoc1(),        // Rota manual

  // APIs de IA
  generateDocImpl(),     // Orquestra geração
  callGemini(prompt),
  callClaude(prompt),
  callGrok(prompt),
  callMistral(prompt),
  updateGenProgress(step, icon, label),
  showGenError(err),

  // Preview
  generatePreview(docImpl), // Gera mockup HTML a partir do DOC-IMPL

  // Persistência
  autosave(),
  checkDraft(),
  exportProject(),
  importProject(),

  // UI helpers
  renderSidebar(),
  renderTopbar(),
  renderStepContent(),
  syncFieldValues(container),
  showToast(msg, type),
  showNotification(title, msg),  // Windows Notification API
  openModal(id),
  closeModal(id)
}
```

---

## 3. DESIGN SYSTEM

### Paleta de Cores

```css
:root {
  /* Backgrounds */
  --bg-base:       #08090E;   /* Fundo global — quase preto */
  --bg-surface:    #0F1118;   /* Cards, sidebar */
  --bg-raised:     #161922;   /* Inputs, campos */
  --bg-overlay:    #1E2130;   /* Hover states, tooltips */

  /* Bordas */
  --border-subtle: rgba(255,255,255,0.04);
  --border-muted:  rgba(255,255,255,0.08);
  --border-default:rgba(255,255,255,0.13);
  --border-strong: rgba(255,255,255,0.22);

  /* Textos */
  --text-primary:  #EEEEF2;
  --text-secondary:#8A8C9E;
  --text-tertiary: #4A4C5E;
  --text-disabled: #2E3040;

  /* Accent Verde — Adsgator */
  --accent:        #00E5A0;
  --accent-hover:  #00FFAF;
  --accent-dim:    rgba(0,229,160,0.10);
  --accent-glow:   rgba(0,229,160,0.20);
  --accent-border: rgba(0,229,160,0.28);

  /* Accent Azul — Elementos secundários */
  --accent2:        #7B8CFF;
  --accent2-hover:  #8F9FFF;
  --accent2-dim:    rgba(123,140,255,0.10);
  --accent2-border: rgba(123,140,255,0.28);

  /* Semântico */
  --danger:        #FF5C5C;
  --danger-dim:    rgba(255,92,92,0.10);
  --danger-border: rgba(255,92,92,0.25);
  --warning:       #FFB547;
  --warning-dim:   rgba(255,181,71,0.10);
  --warning-border:rgba(255,181,71,0.25);
  --success:       #00E5A0;
  --success-dim:   rgba(0,229,160,0.10);

  /* Raios de borda */
  --r-xs:  3px;
  --r-sm:  7px;
  --r-md:  12px;
  --r-lg:  18px;
  --r-xl:  24px;
  --r-pill:999px;

  /* Sombras */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.4);
  --shadow-md:  0 4px 12px rgba(0,0,0,0.5);
  --shadow-lg:  0 8px 24px rgba(0,0,0,0.6);
  --shadow-glow:0 0 24px rgba(0,229,160,0.15);

  /* Transições */
  --ease-fast:  0.12s ease;
  --ease-base:  0.20s ease;
  --ease-slow:  0.35s ease;
  --ease-spring:0.25s cubic-bezier(0.34,1.56,0.64,1);
}
```

### Tipografia

```css
/* Import CDN */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

/* Aplicação */
:root {
  --font-display: 'Syne', sans-serif;     /* Títulos, logo, stepNames */
  --font-body:    'DM Sans', sans-serif;  /* Labels, inputs, texto geral */
  --font-mono:    'DM Mono', monospace;   /* Código, slugs, IDs */
}
```

### Ícones — Lucide Icons

```html
<!-- CDN no <head> -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Uso no HTML -->
<i data-lucide="zap" class="icon"></i>
<i data-lucide="check-circle" class="icon icon--success"></i>

<!-- Inicializar após render -->
<script>lucide.createIcons();</script>
```

**Ícones utilizados por contexto:**

| Contexto | Ícone Lucide | Classe |
|---|---|---|
| Novo projeto | `plus-circle` | `.icon` |
| Salvar | `save` | `.icon` |
| Download | `download` | `.icon` |
| Gerar (IA) | `zap` | `.icon--accent` |
| Sucesso | `check-circle` | `.icon--success` |
| Erro | `alert-circle` | `.icon--danger` |
| Aviso | `alert-triangle` | `.icon--warning` |
| Carregando | `loader-2` (spin) | `.icon--spin` |
| Projeto | `layout-template` | `.icon` |
| Configurações | `settings` | `.icon` |
| API Key | `key` | `.icon` |
| Modelos IA | `cpu` | `.icon` |
| Preview | `eye` | `.icon` |
| Versão | `git-branch` | `.icon` |
| Clonar | `copy` | `.icon` |
| Deletar | `trash-2` | `.icon--danger` |
| Steps completados | `check` | `.icon--success` |
| Steps com erro | `x` | `.icon--danger` |
| Steps em progresso | `circle` | `.icon--muted` |

### Componentes Base

```css
/* === INPUTS === */
.field-input,
.field-textarea,
.field-select {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 14px;
  padding: 11px 14px;
  width: 100%;
  outline: none;
  transition: border-color var(--ease-base), box-shadow var(--ease-base);
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  border-color: var(--accent2);
  box-shadow: 0 0 0 3px var(--accent2-dim);
}

.field-input.has-error {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px var(--danger-dim);
}

.field-input.has-warning {
  border-color: var(--warning);
  box-shadow: 0 0 0 3px var(--warning-dim);
}

.field-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

/* === LABEL === */
.field-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.field-label .required { color: var(--danger); }
.field-label .optional { color: var(--text-disabled); font-weight: 400; text-transform: none; letter-spacing: 0; font-size: 10px; }

/* === CHIPS (seleção múltipla) === */
.chip-group { display: flex; flex-wrap: wrap; gap: 8px; }

.chip {
  padding: 7px 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  background: transparent;
  color: var(--text-secondary);
  transition: all var(--ease-base);
  user-select: none;
}

.chip:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-overlay); }

.chip.on {
  background: var(--accent2-dim);
  border-color: var(--accent2-border);
  color: var(--accent2);
}

/* === SEL-CARDS (seleção única) === */
.sel-card {
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 16px 18px;
  cursor: pointer;
  transition: all var(--ease-base);
  background: var(--bg-surface);
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.sel-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }

.sel-card.on {
  border-color: var(--accent-border);
  background: var(--accent-dim);
  box-shadow: 0 0 0 1px var(--accent-border);
}

.sel-card .card-icon { flex-shrink: 0; color: var(--text-tertiary); }
.sel-card.on .card-icon { color: var(--accent); }
.sel-card .card-title { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--text-primary); margin-bottom: 3px; }
.sel-card .card-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }

/* === BOTÃO PRIMÁRIO === */
.btn-primary {
  background: var(--accent);
  color: #031a10;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: var(--r-pill);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity var(--ease-base), transform var(--ease-spring), box-shadow var(--ease-base);
}

.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: var(--shadow-glow); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

/* === BOTÃO GHOST === */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  padding: 11px 20px;
  border-radius: var(--r-pill);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--ease-base);
}

.btn-ghost:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-overlay); }

/* === BOTÃO DANGER === */
.btn-danger {
  background: var(--danger-dim);
  color: var(--danger);
  border: 1px solid var(--danger-border);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 14px;
  padding: 11px 20px;
  border-radius: var(--r-pill);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all var(--ease-base);
}

.btn-danger:hover { background: rgba(255,92,92,0.18); }

/* === SCORE BADGE === */
.score-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.score-badge.high   { background: var(--success-dim); color: var(--success); }
.score-badge.medium { background: var(--warning-dim); color: var(--warning); }
.score-badge.low    { background: var(--danger-dim);  color: var(--danger);  }
```

---

## 4. LAYOUT DO APP

```
┌────────────────────────────────────────────────────────────────┐
│ SIDEBAR (260px fixo, sticky, 100vh)  │  MAIN (flex:1)          │
│ ─────────────────────────────────── │ ──────────────────────── │
│ LOGO                                 │ TOPBAR (60px sticky)     │
│ ─────────────────────────────────── │   Título step + subtítulo│
│ PROJETOS                             │   Score badge global     │
│  ● Projeto Ativo                     │   Btn ações rápidas      │
│  ○ Projeto B                         │ ──────────────────────── │
│  ○ Projeto C                         │ PROGRESS LINE (3px)      │
│  [+ Novo Projeto]                    │ ──────────────────────── │
│ ─────────────────────────────────── │ STEP CONTENT (scrollável)│
│ STEPS                                │   max-width: 820px       │
│  ✓ 1. Identificação                  │   padding: 40px 48px     │
│  ✓ 2. Contato                        │                          │
│  ✓ 3. Redes Sociais                  │                          │
│  ✓ 4. Localização                    │ ──────────────────────── │
│  ● 5. Serviços                       │ BOTTOMBAR (64px sticky)  │
│  ○ 6. Público                        │  [Anterior]  [Próximo →] │
│  ○ 7. Direção Visual                 │                          │
│  ○ 8. Assets & Integrações           │                          │
│  ○ 9. Revisão                        │                          │
│ ─────────────────────────────────── │                          │
│ API CONFIG                           │                          │
│ [key icon] Configurar chaves         │                          │
│ ─────────────────────────────────── │                          │
│ [dot] Status do sistema              │                          │
└────────────────────────────────────────────────────────────────┘
```

### HTML Base — index.html

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LandingAI — Adsgator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/app.css">
</head>
<body>

  <div id="app">
    <!-- SIDEBAR -->
    <aside id="sidebar" class="sidebar"></aside>

    <!-- MAIN -->
    <main id="main" class="main">
      <header id="topbar" class="topbar"></header>
      <div id="progress-line" class="progress-line">
        <div id="progress-fill" class="progress-fill"></div>
      </div>
      <section id="step-content" class="step-content"></section>
      <footer id="bottombar" class="bottombar"></footer>
    </main>
  </div>

  <!-- MODAIS -->
  <div id="modal-api"       class="modal-backdrop"></div>
  <div id="modal-gen"       class="modal-backdrop"></div>
  <div id="modal-preview"   class="modal-backdrop"></div>
  <div id="modal-projects"  class="modal-backdrop"></div>
  <div id="modal-error"     class="modal-backdrop"></div>

  <!-- TOAST -->
  <div id="toast" class="toast"></div>

  <!-- ICONS -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- APP -->
  <script src="assets/app.js"></script>
  <script>App.init();</script>

</body>
</html>
```

---

## 5. STEPS DO FORMULÁRIO — ESPECIFICAÇÃO COMPLETA

### Mapeamento de Campos (briefing object)

```javascript
// Estado inicial do briefing
const defaultBriefing = {
  // STEP 1 — Identificação
  nome_cliente: '',
  nome_marca: '',
  slug: '',
  segmento: '',
  tipo: '',             // servico | produto | mentoria | consultoria | saas

  // STEP 2 — Contato
  whatsapp: '',
  email: '',
  horarios: '',
  gtm_id: '',

  // STEP 3 — Redes Sociais
  instagram: '',
  tiktok: '',
  youtube: '',
  outras_redes: '',

  // STEP 4 — Localização
  modalidade: '',       // presencial | online | hibrido
  endereco: '',
  exibir_localizacao: '',// completo | cidade | nao
  cidades_atendimento: '',
  plataforma_online: '',

  // STEP 5 — Serviços
  servicos_lista: '',
  servicos_descricao: '',
  servico_principal: '',
  objetivo_conversao: '',// whatsapp | formulario | agendamento | outro
  objetivo_outro: '',

  // STEP 6 — Público
  publico_primario: '',
  publico_dor: '',
  publico_resultado: '',
  publico_secundario: '',

  // STEP 7 — Diferenciais, Copy e Prova Social
  diferencial: '',
  historia: '',
  frase_impacto: '',
  preco_exibir: '',     // sim | nao
  preco_valor: '',
  preco_condicao: '',
  depoimentos: '',      // sim | nao
  depoimentos_formato: [],  // print | texto | video
  depoimentos_qtd: '',
  google_business: '',  // sim | nao
  google_nota: '',
  google_qtd: '',
  casos_resultados: '',
  faq: '',
  oferta_especial: '',

  // STEP 8 — Direção Visual
  estilo_desejado: '',
  sensacao_visitante: '',
  referencias_pessoais: '',     // campo livre
  referencias_nicho: '',        // campo livre
  cor_principal: '',
  cor_secundaria: '',
  logo_disponivel: '',          // svg | png | nao
  tema: '',                     // claro | escuro | ia-decide
  intensidade_visual: '',       // contido | medio | alto
  footer_tom: '',
  footer_elemento: '',
  footer_sensacao: '',
  menu_mobile_estilo: '',       // fullscreen | drawer | bottom | ia-decide
  menu_mobile_especial: '',
  o_que_nao_quero: '',
  referencia_marca: '',

  // STEP 9 — Assets & Integrações
  foto_profissional: '',        // boa | media | nao
  assets_outros: '',
  dominio: '',
  cnpj: '',
  aviso_legal: '',
  restricoes: '',
  integracoes: [],              // maps | reviews | instagram | formulario | whatsapp | ligacao
  instrucoes_adicionais: ''
}
```

---

### STEP 1 — Identificação

**Objetivo:** Definir a identidade do projeto.  
**Score:** obrigatório: `nome_cliente`, `tipo`, `segmento`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Nome do cliente | text | ✅ | Min 2 caracteres |
| Nome da marca | text | ✅ | Min 2 caracteres |
| Slug | text (auto) | ✅ | Auto-gerado de nome_cliente, editável |
| Segmento / profissão | text | ✅ | Min 5 caracteres |
| Tipo de projeto | sel-cards (5 opções) | ✅ | Uma seleção obrigatória |

**Sel-cards tipo de projeto:**
```
● Serviço         — Adestramento, fisioterapia, advocacia, etc
● Produto         — Ecommerce, venda física, produto digital
● Mentoria        — Mentoria individual, grupo, programa
● Consultoria     — B2B, consultoria especializada
● SaaS / Digital  — Software, app, ferramenta online
```

---

### STEP 2 — Contato

**Objetivo:** Dados de contato e rastreamento.  
**Score:** obrigatório: `whatsapp`, `objetivo_conversao`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| WhatsApp | text | ✅ | Auto-formata para `5511999999999` — valida comprimento |
| E-mail de contato | email | ❌ | Formato válido |
| Horários de atendimento | text | ❌ | Min 5 caracteres |
| ID do GTM | text | ❌ | Regex `GTM-[A-Z0-9]+` |

**Nota:** WhatsApp deve mostrar preview da URL formatada conforme usuário digita:
```
Input: 11 99999-9999
Preview: 5511999999999 ✓
Link: https://wa.me/5511999999999
```

---

### STEP 3 — Redes Sociais

**Objetivo:** Ativos digitais do cliente para integrações.  
**Score:** nenhum obrigatório — mas aviso se tudo vazio  

**Campos:**

| Campo | Tipo | Obrigatório | Formato |
|---|---|---|---|
| Instagram | text | ❌ | Auto-remove `@` |
| TikTok | text | ❌ | Auto-remove `@` |
| YouTube | text | ❌ | URL ou @canal |
| Outras redes | textarea | ❌ | Campo livre |

---

### STEP 4 — Localização e Modalidade

**Objetivo:** Definir onde e como o profissional atende (impacta diretamente quais blocos o DOC-1 inclui).  
**Score:** obrigatório: `modalidade`  

**Campos:**

| Campo | Tipo | Obrigatório | Condicional |
|---|---|---|---|
| Modalidade | chips (3 opções) | ✅ | — |
| Endereço completo | textarea | Se presencial | Aparece se `modalidade` inclui presencial |
| Exibir localização | chips (3 opções) | Se presencial | Aparece se `modalidade` inclui presencial |
| Cidades de atendimento | text | Se presencial | Aparece se `modalidade` inclui presencial |
| Plataforma online | text | Se online | Aparece se `modalidade` é online/híbrido |

---

### STEP 5 — Serviços e Produto

**Objetivo:** Core da landing page — o que é vendido, como funciona, por qual canal.  
**Score:** obrigatório: `servico_principal`, `objetivo_conversao`, `servicos_descricao`  
**Validação:** aviso se `servicos_descricao` < 80 caracteres  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Lista de serviços | textarea | ✅ | Min 1 item |
| Descrição dos serviços | textarea | ✅ | Min 80 chars (aviso se < 150) |
| Serviço principal | text | ✅ | — |
| Objetivo de conversão | sel-cards (4 opções) | ✅ | Uma seleção obrigatória |
| Exibir preço? | chips (Sim/Não) | ✅ | — |
| Valor + forma de cobrança | text | Se sim | Aparece se `preco_exibir` = sim |
| Oferta especial | text | ❌ | — |

---

### STEP 6 — Público-Alvo

**Objetivo:** Definir PARA QUEM a landing page fala (crítico para copy e headlines).  
**Score:** obrigatório: `publico_primario`, `publico_dor`, `publico_resultado`  
**Validação especial:** Aviso se `publico_primario` for muito genérico (< 20 chars ou apenas "homens", "mulheres", "pessoas")  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Público primário | textarea | ✅ | Min 20 chars + check genérico |
| Problema principal antes de contratar | textarea | ✅ | Min 30 chars |
| O que ele quer alcançar | textarea | ✅ | Min 30 chars |
| Público secundário | textarea | ❌ | — |
| FAQ — principais dúvidas | textarea | ❌ | — |

**Lógica de aviso de público genérico:**
```javascript
const genericTerms = ['homens', 'mulheres', 'pessoas', 'todos', 'qualquer', 'adultos']
if (genericTerms.some(t => publico_primario.toLowerCase().includes(t)) && publico_primario.length < 40) {
  showWarning('Público muito genérico. Especifique idade, contexto, profissão ou situação de vida.')
}
```

---

### STEP 7 — Diferenciais, Copy e Prova Social

**Objetivo:** Material para copy de persuasão — o que torna o cliente único + provas.  
**Score:** obrigatório: `diferencial`, `frase_impacto`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Diferencial | textarea | ✅ | Aviso se inclui "qualidade" ou "excelência" |
| História / origem | textarea | ❌ | Opcional mas recomendado |
| Frase de impacto | text | ✅ | 1 linha, max 120 chars |
| Depoimentos? | chips (Sim/Não) | ✅ | — |
| Formato dos depoimentos | chips (múltiplos) | Se sim | Aparece se `depoimentos` = sim |
| Quantidade de depoimentos | number | Se sim | Min 1 |
| Google Business? | chips (Sim/Não) | ✅ | — |
| Nota Google | number | Se sim | 1.0–5.0 |
| Qtd. avaliações Google | number | Se sim | Aviso se < 10 (não inclui bloco Reviews) |
| Cases / resultados | textarea | ❌ | — |

**Lógica especial — Google Reviews:**
```javascript
// Só inclui bloco Google Reviews no DOC-1 se:
if (google_business === 'sim' && parseInt(google_qtd) >= 10) {
  incluir_bloco_google_reviews = true
}
```

**Lógica especial — Proibições de diferencial:**
```javascript
const genericDiff = ['qualidade', 'excelência', 'comprometimento', 'dedicação', 'atendimento personalizado']
if (genericDiff.some(t => diferencial.toLowerCase().includes(t))) {
  showWarning('Seu diferencial usa termos genéricos. O que especificamente te diferencia na prática?')
}
```

---

### STEP 8 — Direção Visual

**Objetivo:** Toda a direção de arte que alimenta o DOC-1 para a IA gerar design premium.  
**Score:** obrigatório: `estilo_desejado`, `tema`, `intensidade_visual`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Como o site deve ser percebido | textarea | ✅ | Min 20 chars |
| Sensação do visitante | textarea | ✅ | Min 15 chars |
| Referências pessoais | textarea | ✅ | Campo livre com helper text |
| Referências do nicho | textarea | ❌ | Recomendado |
| Cor principal | color picker + text | ❌ | HEX automático |
| Cor secundária | color picker + text | ❌ | HEX automático |
| Logo disponível | chips (SVG/PNG/Não) | ✅ | — |
| Tema | chips (3 opções) | ✅ | — |
| Intensidade visual | sel-cards (3 opções) | ✅ | — |
| Estilo do footer | textarea | ❌ | Com helper text |
| Menu mobile | chips (4 opções) | ❌ | — |
| O que NÃO quero | textarea | ❌ | Recomendado — previne outputs ruins |
| Referência de marca | text | ❌ | Ex: "próximo de Notion/Linear/Stripe" |

**Sel-cards Intensidade Visual:**
```
● Contido     — Animações sutis, foco no conteúdo. Clínicas, consultórios, B2B.
● Médio       — Presença notável. Profissionais criativos, mentores, serviços premium.
● Alto        — Efeito uau total. Imersivo, editorial, tecnologia. Diferença imediata.
```

---

### STEP 9 — Assets, Integrações e Finalizações

**Objetivo:** Confirmar ativos disponíveis e integrações ativas. Define o checklist final do DOC-1.  
**Score:** obrigatório: `dominio`  

**Campos:**

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| Foto do profissional/produto | chips (3 qualidades) | ✅ | — |
| Outros assets | textarea | ❌ | — |
| Domínio desejado | text | ✅ | Placeholder: seunome.com.br |
| CNPJ | text | ❌ | Auto-formata |
| Aviso legal (CRM, OAB, etc) | text | ❌ | — |
| Restrições de conteúdo | textarea | ❌ | — |
| Integrações ativas | checkboxes | ❌ | Lógica condicional |
| Instruções adicionais | textarea | ❌ | — |
| Briefing bruto do cliente | textarea | ❌ | Campo livre para colar o briefing cru |

**Integrações — checkboxes com lógica condicional:**
```
☐ Google Maps embed           — aparece se modalidade é presencial
☐ Google Reviews widget       — aparece se google_qtd >= 10
☐ Instagram Feed              — aparece se instagram preenchido
☐ Formulário de Contato       — sempre disponível
☐ WhatsApp flutuante          — sempre ativo (padrão Adsgator, pré-marcado)
☐ Botão de ligação mobile     — disponível se objetivo inclui ligação
```

---

## 6. VALIDAÇÃO INTELIGENTE

### Regras por Categoria

#### 6.1 Campos Críticos (bloqueia geração)

```javascript
const criticalFields = {
  1: ['nome_cliente', 'tipo', 'segmento'],
  2: ['whatsapp', 'objetivo_conversao'],
  4: ['modalidade'],
  5: ['servico_principal', 'servicos_descricao'],
  6: ['publico_primario', 'publico_dor', 'publico_resultado'],
  7: ['diferencial', 'frase_impacto'],
  8: ['estilo_desejado', 'tema', 'intensidade_visual'],
  9: ['dominio']
}
```

#### 6.2 Campos Genéricos (warning visual — não bloqueia)

```javascript
const genericChecks = [
  {
    field: 'publico_primario',
    terms: ['homens', 'mulheres', 'pessoas', 'todos', 'qualquer'],
    minLength: 40,
    msg: 'Público muito genérico. Especifique idade, contexto, profissão ou situação de vida do cliente ideal.'
  },
  {
    field: 'diferencial',
    terms: ['qualidade', 'excelência', 'comprometimento', 'dedicação', 'atendimento personalizado', 'inovador'],
    msg: 'Diferencial genérico detectado. O que na prática te diferencia? Seja específico e real.'
  },
  {
    field: 'frase_impacto',
    terms: ['transforme', 'revolucionar', 'definitiva', 'solução completa', 'do seu jeito'],
    msg: 'Frase usa clichês de marketing. Reescreva com uma dor real ou resultado concreto.'
  },
  {
    field: 'estilo_desejado',
    terms: ['moderno', 'profissional', 'clean', 'simples'],
    minLength: 30,
    msg: 'Muito vago. Descreva o estilo com mais precisão — ex: "sóbrio e técnico, quase editorial".'
  },
  {
    field: 'servicos_descricao',
    minLength: 80,
    msg: 'Descrição muito curta. Quanto mais detalhe aqui, melhor a IA consegue montar a copy.'
  }
]
```

#### 6.3 Consistência Visual (warning)

```javascript
const consistencyChecks = [
  // Tema escuro + intensidade alta + nicho delicado → aviso
  {
    condition: () => tema === 'escuro' && intensidade_visual === 'alto' && 
                     ['psicologia', 'saúde', 'infantil'].includes(segmento.toLowerCase()),
    msg: 'Tema escuro + intensidade alta pode conflitar com nichos de saúde. Confirmar direção?'
  },
  // "Premium sóbrio" + referências muito agitadas → aviso
  {
    condition: () => estilo_desejado.includes('sóbrio') && 
                     referencias_pessoais.toLowerCase().includes('vibrant'),
    msg: 'Direção visual contraditória detectada: estilo sóbrio + referências vibrantes. Esclareça qual prevalece.'
  }
]
```

### Score por Step (sidebar)

```javascript
function getStepScore(step) {
  const fields = stepFields[step]
  const filled = fields.filter(f => briefing[f] && briefing[f].toString().trim().length > 0)
  const warnings = fields.filter(f => hasWarning(f))
  
  const base = filled.length / fields.length * 100
  const penalty = warnings.length * 5
  return Math.max(0, Math.round(base - penalty))
}

// Ícone na sidebar por score:
// >= 90%  → check-circle (verde)
// 50–89%  → alert-circle (amarelo)
// < 50%   → circle (cinza) se não visitado, x-circle (vermelho) se visitado
```

---

## 7. SISTEMA DE PROJETOS

### Estrutura de Armazenamento

```javascript
// localStorage keys:
// 'landingai_projects'  → objeto com todos os projetos
// 'landingai_active'    → ID do projeto ativo

const projectSchema = {
  id: 'uuid-v4',
  name: '',              // Ex: "B.MATTOS - Mentoria"
  slug: '',
  createdAt: '',         // ISO string
  updatedAt: '',
  status: 'rascunho',    // rascunho | revisando | gerado | entregue
  briefing: { /* ... */ },
  visitedSteps: [],
  versions: [
    {
      v: 1,
      savedAt: '',
      doc1: '',          // Conteúdo do DOC-1 em markdown
      docImpl: '',       // Conteúdo do DOC-IMPL (se gerado)
      model: ''          // Qual modelo de IA usou
    }
  ]
}
```

### Ações de Projeto

| Ação | Gatilho | Comportamento |
|---|---|---|
| Criar novo | Btn "Novo Projeto" na sidebar | Cria projeto, reseta briefing, vai para step 1 |
| Salvar | Auto (2s debounce) + Cmd/Ctrl+S | Salva no localStorage |
| Clonar | Btn no card de projeto | Copia briefing completo, sufixo " (cópia)" no nome |
| Deletar | Btn trash com confirm | Remove do localStorage |
| Exportar | Btn no modal de projeto | Baixa `projeto-[slug].json` |
| Importar | Input no modal de projetos | Carrega de arquivo JSON |
| Versionar | Automático ao gerar DOC-1/IMPL | Salva snapshot na array `versions` |

### Modal de Projetos

```
┌─────────────────────────────────────────┐
│ MEUS PROJETOS              [+ Novo]      │
│ ─────────────────────────────────────── │
│ 🔵 PROJETO ATIVO                        │
│ ────────────────────────                │
│ B.MATTOS - Mentoria         Editando... │
│ Atualizado agora            [✓][⊕][🗑] │
│ ────────────────────────                │
│ OUTROS PROJETOS                         │
│ ────────────────────────                │
│ Silva Adestramento          Gerado ✓    │
│ Atualizado 2 dias atrás     [✓][⊕][🗑] │
│ ────────────────────────                │
│ [↑ Importar Projeto]                    │
└─────────────────────────────────────────┘
```

---

## 8. STEP 9 — REVISÃO GERAL (Dashboard de Completude)

O Step 9 não é um formulário — é um **dashboard visual** de revisão completa antes de gerar.

### Layout do Step 9

```
┌──────────────────────────────────────────────────────────────┐
│ REVISÃO GERAL                                                │
│ Score global: ████████████████░░░ 84%  — "Pronto para gerar" │
│ ──────────────────────────────────────────────────────────── │
│ CARDS DE STEPS (grid 3 colunas)                              │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐                   │
│ │ 1. Ident. │ │ 2. Contato│ │ 3. Redes  │                   │
│ │ ✓ 100%    │ │ ✓ 100%    │ │ ○ 40%     │                   │
│ │ [Editar]  │ │ [Editar]  │ │ [Editar]  │                   │
│ └───────────┘ └───────────┘ └───────────┘                   │
│ ──────────────────────────────────────────────────────────── │
│ WARNINGS (se houver)                                         │
│ ⚠ Público muito genérico → Step 6   [Ir lá]                 │
│ ⚠ Diferencial usa clichê → Step 7   [Ir lá]                 │
│ ──────────────────────────────────────────────────────────── │
│ CAMPOS CRÍTICOS FALTANDO (se houver)                         │
│ ✗ Domínio não preenchido — Step 9                            │
│ ──────────────────────────────────────────────────────────── │
│ AÇÕES FINAIS                                                 │
│ [↓ Baixar DOC-1]    [⚡ Gerar DOC-IMPL via IA]              │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. GERAÇÃO DO DOC-1

### Formato Exato de Saída

O DOC-1 gerado pelo LandingAI segue exatamente o padrão do DOC-2 Adsgator existente.

```markdown
---
title: [Nome Cliente] — Brainstorm Visual
date: [DATA GERADA]
tags: [adsgator, design, doc-2]
status: pronto-para-ia
gerado_por: LandingAI v2
modelo_ia: [modelo utilizado ou "manual"]
---

# [Nome Cliente] — Brainstorm Visual

> **Documento 1 de 2 — Adsgator (gerado pelo LandingAI v2)**
> Preencha este documento e envie para a IA gerar a Ficha de Implementação.

---

## INSTRUÇÃO MESTRE PARA A IA

Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este documento inteiro e gerar como output a **Ficha de Implementação**, completa, específica e pronta para ser enviada diretamente ao Claude, Roo ou outro agente implementador construir a landing page.

[INSTRUÇÃO MESTRE COMPLETA — VER SEÇÃO 10 DESTE DOC]

---

## PARTE 1 — IDENTIDADE DO PROJETO

### Resumo do Projeto

| Campo | Valor |
|---|---|
| **Cliente** | [nome_cliente] |
| **Marca** | [nome_marca] |
| **Slug** | [slug] |
| **Segmento** | [segmento] |
| **Tipo** | [tipo] |
| **Objetivo de conversão** | [objetivo_conversao] |
| **WhatsApp** | [whatsapp] |
| **E-mail** | [email] |
| **Horários** | [horarios] |
| **GTM ID** | [gtm_id] |
| **Domínio** | [dominio] |
| **Modalidade** | [modalidade] |
| **CNPJ** | [cnpj] |
| **Aviso legal** | [aviso_legal] |

---

## PARTE 2 — SERVIÇOS E PRODUTO

### Serviço Principal
[servico_principal]

### Todos os Serviços
[servicos_lista]

### Descrição Detalhada
[servicos_descricao]

### Preço
[Se preco_exibir = sim]: Exibir preço: [preco_valor] — [preco_condicao]
[Se preco_exibir = nao]: Não exibir preço

### Oferta Especial
[oferta_especial ou "Não há"]

---

## PARTE 3 — PÚBLICO-ALVO

### Público Primário
[publico_primario]

### Dor Principal
[publico_dor]

### Resultado Desejado
[publico_resultado]

### Público Secundário
[publico_secundario ou "Não definido"]

---

## PARTE 4 — COPY E PERSUASÃO

### Diferencial Real
[diferencial]

### Frase de Impacto
[frase_impacto]

### História / Origem
[historia ou "Não fornecida"]

### FAQ — Principais Dúvidas
[faq ou "Não fornecido — IA decide baseado no nicho"]

---

## PARTE 5 — PRESENÇA DIGITAL

### Redes Sociais
| Rede | Handle/Link |
|---|---|
| Instagram | [instagram ou "—"] |
| TikTok | [tiktok ou "—"] |
| YouTube | [youtube ou "—"] |
| Outras | [outras_redes ou "—"] |

### Google Business
[Se google_business = sim]: Sim — Nota: [google_nota] ★ com [google_qtd] avaliações
[Se google_business = nao]: Não possui

### Depoimentos
[Se depoimentos = sim]: Sim — Formato: [depoimentos_formato] — Quantidade: [depoimentos_qtd]
[Se depoimentos = nao]: Não há depoimentos disponíveis

### Cases / Resultados Concretos
[casos_resultados ou "Não fornecidos"]

---

## PARTE 6 — LOCALIZAÇÃO

### Modalidade de Atendimento
[modalidade]

[Se presencial ou híbrido]:
### Endereço
[endereco]

### Exibir Localização
[exibir_localizacao]

### Cidades de Atendimento
[cidades_atendimento]

[Se online ou híbrido]:
### Plataforma Online
[plataforma_online]

---

## PARTE 7 — DIREÇÃO DE DESIGN

### Como o site deve ser percebido
[estilo_desejado]

### Sensação do visitante
[sensacao_visitante]

### Referências Pessoais
[referencias_pessoais]

### Referências do Nicho
[referencias_nicho ou "Não fornecidas"]

### Cores da Marca
| Cor | Valor |
|---|---|
| Principal | [cor_principal ou "Não definida"] |
| Secundária | [cor_secundaria ou "Não definida"] |

### Direção Geral
| Parâmetro | Valor |
|---|---|
| Tema | [tema] |
| Intensidade Visual | [intensidade_visual] |
| Referência de marca | [referencia_marca ou "Não definida"] |
| O que NÃO quero | [o_que_nao_quero ou "Não especificado"] |

### Footer
| Parâmetro | Valor |
|---|---|
| Tom visual | [footer_tom ou "IA decide"] |
| Elemento âncora | [footer_elemento ou "IA decide"] |
| Sensação | [footer_sensacao ou "IA decide"] |

### Menu Mobile
[menu_mobile_estilo ou "IA decide"] — [menu_mobile_especial ou "Padrão"]

---

## PARTE 8 — ASSETS E INTEGRAÇÕES

### Assets Disponíveis
| Asset | Status |
|---|---|
| Logo | [logo_disponivel] |
| Foto do profissional/produto | [foto_profissional] |
| Outros | [assets_outros ou "—"] |

### Integrações Ativas
[Lista das integracoes marcadas com checkbox]
[ ] Google Maps embed
[ ] Google Reviews widget
[ ] Instagram Feed
[ ] Formulário de Contato
[x] WhatsApp flutuante — padrão Adsgator
[ ] Botão de ligação mobile

---

## PARTE 9 — BRIEFING BRUTO DO CLIENTE

> Cole abaixo o briefing exatamente como veio do cliente. A IA usa como fonte primária.

[briefing_bruto ou "Não fornecido — usar dados dos campos acima"]

---

## PARTE 10 — INSTRUÇÕES ADICIONAIS

[instrucoes_adicionais ou "Nenhuma instrução adicional"]

---

## PARTE 11 — REGRAS FIXAS ADSGATOR

> A PARTE 11 contém as Regras Fixas da Adsgator. Não altere ou resumo.
> Utilize integralmente ao gerar a Ficha de Implementação.

[REGRAS FIXAS ADSGATOR — INSERIDAS AUTOMATICAMENTE — VER SEÇÃO 11 DESTE DOC]
```

---

## 10. INSTRUÇÃO MESTRE (Prompt Base para IA)

Este bloco é inserido automaticamente em todo DOC-1 gerado:

```markdown
## INSTRUÇÃO MESTRE PARA A IA

Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este documento inteiro e gerar como output a **Ficha de Implementação**, completa, específica e pronta para ser enviada diretamente ao Claude, Roo Code ou outro agente implementador construir a landing page.

**O que isso significa na prática:**
- Você toma todas as decisões de design que não estão explicitadas — tipografia, escala, tokens, animações, layout de cada seção.
- Você preenche cada campo da Ficha de Implementação com valores concretos. Sem placeholders. Sem [definir depois]. Sem [a combinar].
- Você transforma a direção criativa e a copy abaixo em especificações técnicas de implementação.
- O output que você entrega deve poder ser copiado e enviado para outra IA sem nenhuma edição adicional.

**Padrão de qualidade esperado:**
O documento gerado deve orquestrar uma landing page com design editorial de alto padrão — atípico, com personalidade visual forte, fora do visual genérico de IA. Pense Raycast, Linear, Family.co. Layouts com intenção. Tipografia com personalidade. Animações que têm razão de existir. Cada decisão de tipografia, espaçamento, cor e animação deve ser intencional e coesa.

**Sobre o viewport:**
O site não fica preso em um container central. Seções que se beneficiam de ocupar o viewport completo devem fazê-lo — backgrounds que sangram até as bordas, tipografia que respira, imagens que não ficam comprimidas. O container é uma ferramenta de legibilidade, não uma prisão de layout.

**Sobre o mobile:**
Mobile não é adaptação — é o ponto de partida. O design começa em 375px. Cada decisão de tipografia, espaçamento, hierarquia e layout é tomada primeiro para mobile e expandida para desktop.

**Sobre o footer:**
O footer não é um afterthought — é a última impressão. Deve ter identidade visual clara, conectada ao tom da landing page. Hierarquia tipográfica real. Personalidade.

**DNA ADSGATOR — REGRAS INEGOCIÁVEIS DE COPY:**
- Intenção de Busca em Primeiro Lugar — a H1 justifica o clique no anúncio nos primeiros 3 segundos
- Primeira Pessoa Sempre — "eu", "meu", "com você" — nunca terceira pessoa
- Zero Institucional — proibido: "inovador", "excelência", "missão", "visão"
- Comunicação Direta e Realista — sem promessas milagrosas
- Tom Conversacional com Autoridade
- Foco na Ação — cada palavra tem função persuasiva

**STACK TÉCNICA FIXA:**
Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis + Web3Forms
Deploy: Vercel (output: 'static')
```

---

## 11. REGRAS FIXAS ADSGATOR (inseridas automaticamente)

Este bloco é appendado no final de todo DOC-1. É uma cópia do template DOC-2, seção PARTE 3 — REGRAS FIXAS ADSGATOR. Não resumir, não alterar.

> **Implementação:** Armazenar como string constante em `app.js`:
> ```javascript
> const REGRAS_FIXAS_ADSGATOR = `[conteúdo completo da PARTE 3 do DOC-2]`
> ```
> Sempre appendar ao final do DOC-1 gerado.

---

## 12. APIS DE IA — ESPECIFICAÇÃO TÉCNICA

### Modelos Disponíveis

```javascript
const AI_MODELS = {
  // GEMINI (Google)
  'gemini-3-flash': {
    name: 'Gemini 3.0 Flash',
    provider: 'gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent',
    maxTokens: 65536,
    temp: 0.65,
    tier: 'free',
    speed: 'fast',
    icon: 'zap',
    color: '#4285F4'
  },
  'gemini-3-pro': {
    name: 'Gemini 3.0 Pro',
    provider: 'gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-05-06:generateContent',
    maxTokens: 65536,
    temp: 0.65,
    tier: 'paid',
    speed: 'medium',
    icon: 'gem',
    color: '#4285F4'
  },

  // CLAUDE (Anthropic)
  'claude-sonnet': {
    name: 'Claude Sonnet 4',
    provider: 'claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 16000,
    temp: 0.7,
    tier: 'paid',
    speed: 'medium',
    icon: 'brain',
    color: '#CC785C'
  },
  'claude-opus': {
    name: 'Claude Opus 4',
    provider: 'claude',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 32000,
    temp: 0.65,
    tier: 'paid',
    speed: 'slow',
    icon: 'crown',
    color: '#CC785C'
  },

  // GROK (xAI)
  'grok-3': {
    name: 'Grok 3',
    provider: 'grok',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    maxTokens: 32000,
    temp: 0.7,
    tier: 'free',
    speed: 'fast',
    icon: 'sparkles',
    color: '#1DA1F2'
  },
  'grok-3-mini': {
    name: 'Grok 3 Mini',
    provider: 'grok',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    maxTokens: 16000,
    temp: 0.7,
    tier: 'free',
    speed: 'fast',
    icon: 'sparkles',
    color: '#1DA1F2'
  },

  // MISTRAL (4ª opção premium)
  'mistral-medium': {
    name: 'Mistral Medium 3',
    provider: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    maxTokens: 32000,
    temp: 0.65,
    tier: 'free',
    speed: 'fast',
    icon: 'wind',
    color: '#FF7000'
  },
  'mistral-large': {
    name: 'Mistral Large 2',
    provider: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    maxTokens: 32000,
    temp: 0.6,
    tier: 'paid',
    speed: 'medium',
    icon: 'wind',
    color: '#FF7000'
  }
}
```

> **Nota sobre endpoints:** Confirmar endpoints atuais na documentação oficial de cada provedor antes de implementar. Os modelos Gemini 2.5 Flash/Pro são os equivalentes mais próximos ao que será "Gemini 3" no momento da implementação.

### Chamadas de API

#### Gemini

```javascript
async callGemini(apiKey, prompt, model) {
  const endpoint = `${AI_MODELS[model].endpoint}?key=${apiKey}`
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: AI_MODELS[model].maxTokens,
        temperature: AI_MODELS[model].temp
      }
    })
  })

  if (!response.ok) {
    const err = await response.json()
    const errMsg = err.error?.message || `HTTP ${response.status}`
    throw new Error(`[Gemini] ${errMsg}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}
```

#### Claude

```javascript
async callClaude(apiKey, prompt, model) {
  const modelId = model === 'claude-opus' ? 'claude-opus-4-6' : 'claude-sonnet-4-6'
  
  const response = await fetch(AI_MODELS[model].endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: AI_MODELS[model].maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!response.ok) {
    const err = await response.json()
    const errMsg = err.error?.message || `HTTP ${response.status}`
    throw new Error(`[Claude] ${errMsg}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}
```

#### Grok

```javascript
async callGrok(apiKey, prompt, model) {
  const modelId = model === 'grok-3-mini' ? 'grok-3-mini' : 'grok-3'
  
  const response = await fetch(AI_MODELS[model].endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: AI_MODELS[model].maxTokens,
      temperature: AI_MODELS[model].temp,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!response.ok) {
    const err = await response.json()
    const errMsg = err.error?.message || `HTTP ${response.status}`
    throw new Error(`[Grok] ${errMsg}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}
```

#### Mistral

```javascript
async callMistral(apiKey, prompt, model) {
  const modelId = model === 'mistral-large' ? 'mistral-large-2407' : 'mistral-medium-3'
  
  const response = await fetch(AI_MODELS[model].endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: AI_MODELS[model].maxTokens,
      temperature: AI_MODELS[model].temp,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!response.ok) {
    const err = await response.json()
    const errMsg = err.error?.message || `HTTP ${response.status}`
    throw new Error(`[Mistral] ${errMsg}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}
```

### Roteador de API

```javascript
async callAI(prompt) {
  const model = this.state.selectedModel
  const provider = AI_MODELS[model].provider
  const apiKey = this.state.apiKeys[provider]

  if (!apiKey) {
    throw new Error(`Chave de API para ${provider} não configurada. Vá em Configurações > API Keys.`)
  }

  switch (provider) {
    case 'gemini':  return await this.callGemini(apiKey, prompt, model)
    case 'claude':  return await this.callClaude(apiKey, prompt, model)
    case 'grok':    return await this.callGrok(apiKey, prompt, model)
    case 'mistral': return await this.callMistral(apiKey, prompt, model)
    default: throw new Error(`Provedor desconhecido: ${provider}`)
  }
}
```

### Tratamento de Erros (SEM fallback automático)

```javascript
async generateDocImpl() {
  this.state.isGenerating = true
  this.openModal('modal-gen')

  try {
    // Passo 1
    this.updateGenProgress({ icon: 'loader-2', label: 'Compilando DOC-1...', step: 1, spinning: true })
    const doc1 = this.buildDoc1()
    await delay(400)

    // Passo 2
    this.updateGenProgress({ icon: 'brain', label: 'Preparando prompt mestre...', step: 2, spinning: true })
    const prompt = this.buildMasterPrompt(doc1)
    await delay(300)

    // Passo 3
    const modelName = AI_MODELS[this.state.selectedModel].name
    this.updateGenProgress({ icon: 'zap', label: `Chamando ${modelName}...`, step: 3, spinning: true })
    const docImpl = await this.callAI(prompt)

    // Passo 4
    this.updateGenProgress({ icon: 'file-text', label: 'Processando resposta...', step: 4, spinning: true })
    if (!docImpl || docImpl.trim().length < 100) {
      throw new Error('A IA retornou uma resposta muito curta ou vazia. Tente novamente ou use outro modelo.')
    }

    // Passo 5
    this.updateGenProgress({ icon: 'eye', label: 'Gerando preview...', step: 5, spinning: true })
    await this.generatePreview(docImpl)

    // Sucesso
    this.updateGenProgress({ icon: 'check-circle', label: 'Concluído!', step: 6, spinning: false, success: true })
    this.state.lastDocImpl = docImpl
    this.saveVersion(doc1, docImpl)
    this.showNotification('LandingAI', `DOC-IMPL gerado com sucesso! Projeto: ${this.briefing.nome_cliente}`)
    this.downloadFile(docImpl, `doc-impl-${this.briefing.slug}.md`)

  } catch (err) {
    // SEMPRE mostra o erro exato — sem silenciar, sem fallback automático
    this.showGenError(err)
    console.error('[LandingAI] Erro na geração:', err)
  } finally {
    this.state.isGenerating = false
  }
}

showGenError(err) {
  const modal = document.getElementById('modal-error')
  // Preenche o modal com a mensagem de erro exata
  // Inclui: tipo do erro, mensagem, modelo usado, sugestões de resolução
  // Botões: "Tentar novamente", "Usar outro modelo", "Baixar DOC-1 manualmente"
}
```

---

## 13. MODAL DE GERAÇÃO — ESPECIFICAÇÃO

```
┌──────────────────────────────────────────┐
│ ⚡ Gerando Ficha de Implementação        │
│ ──────────────────────────────────────── │
│  Modelo: Gemini 3.0 Flash                │
│                                          │
│  ████████████████████░░░ 75%             │
│                                          │
│  ✓  Compilando DOC-1...         0.4s    │
│  ✓  Preparando prompt...        0.3s    │
│  ⟳  Chamando Gemini 3 Flash...  (...)   │
│  ○  Processando resposta...              │
│  ○  Gerando preview...                   │
│  ○  Concluído!                           │
│                                          │
│  ──────────────────────────────────────  │
│  ⚠ O processo pode levar 30–90 segundos  │
│   dependendo do modelo e do briefing.    │
└──────────────────────────────────────────┘
```

**Estados do ícone por passo:**
- Aguardando: `circle` (cinza)
- Em progresso: `loader-2` (spin) (accent)
- Concluído: `check` (verde)
- Erro: `x` (vermelho)

---

## 14. MODAL DE ERRO — ESPECIFICAÇÃO

```
┌──────────────────────────────────────────┐
│ ✗ Erro na Geração                        │
│ ──────────────────────────────────────── │
│  Modelo: Gemini 3.0 Flash                │
│  Ocorrido em: Passo 3 de 6               │
│                                          │
│  ERRO:                                   │
│  ┌──────────────────────────────────┐    │
│  │ [Gemini] API key not valid.      │    │
│  │ Please pass a valid API key.     │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Possíveis causas:                       │
│  · Chave de API inválida ou expirada     │
│  · Verifique em: aistudio.google.com     │
│                                          │
│  [↻ Tentar Novamente]                    │
│  [⚙ Trocar Modelo]                       │
│  [↓ Baixar DOC-1 Manualmente]            │
│  [✕ Fechar]                              │
└──────────────────────────────────────────┘
```

**Mapeamento de erros → causas + sugestões:**

```javascript
const ERROR_MAP = {
  'API key not valid': {
    cause: 'Chave de API inválida ou expirada',
    suggest: 'Verifique sua chave em Configurações > API Keys',
    link: { gemini: 'aistudio.google.com', claude: 'console.anthropic.com', grok: 'console.x.ai', mistral: 'console.mistral.ai' }
  },
  'QUOTA_EXCEEDED': {
    cause: 'Limite de uso da API atingido',
    suggest: 'Aguarde ou use outro modelo',
  },
  'fetch failed': {
    cause: 'Sem conexão com a internet ou servidor offline',
    suggest: 'Verifique sua conexão e tente novamente'
  },
  'timeout': {
    cause: 'A requisição demorou muito (>120s)',
    suggest: 'Use um modelo mais rápido (Flash) ou tente novamente'
  },
  'response too short': {
    cause: 'A IA retornou resposta incompleta',
    suggest: 'Tente novamente — pode ser instabilidade momentânea'
  }
}
```

---

## 15. CONFIGURAÇÃO DE API KEYS

### Modal de Configuração

```
┌──────────────────────────────────────────────────────┐
│ ⚙ Configurar APIs                                    │
│ ──────────────────────────────────────────────────── │
│                                                      │
│  GEMINI (Google)                    [● Configurado]  │
│  ┌──────────────────────────────────────┐ [Salvar]  │
│  │ AIza•••••••••••••••••••••••••••••    │           │
│  └──────────────────────────────────────┘           │
│  Modelos: Flash (grátis), Pro (pago)                 │
│  Obter chave: aistudio.google.com                   │
│  ────────────────────────────────────────────────── │
│  CLAUDE (Anthropic)                 [○ Não config.] │
│  ┌──────────────────────────────────────┐ [Salvar]  │
│  │ Coloque sua chave aqui...            │           │
│  └──────────────────────────────────────┘           │
│  Modelos: Sonnet (pago), Opus (pago)                 │
│  Obter chave: console.anthropic.com                 │
│  ────────────────────────────────────────────────── │
│  GROK (xAI)                         [○ Não config.] │
│  ┌──────────────────────────────────────┐ [Salvar]  │
│  │ Coloque sua chave aqui...            │           │
│  └──────────────────────────────────────┘           │
│  Modelos: Grok 3 (grátis), Grok 3 Mini (grátis)     │
│  Obter chave: console.x.ai                          │
│  ────────────────────────────────────────────────── │
│  MISTRAL                            [○ Não config.] │
│  ┌──────────────────────────────────────┐ [Salvar]  │
│  │ Coloque sua chave aqui...            │           │
│  └──────────────────────────────────────┘           │
│  Modelos: Medium 3 (grátis), Large 2 (pago)         │
│  Obter chave: console.mistral.ai                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Seletor de Modelo

Dropdown no topbar ou no modal de geração:

```
┌──────────────────────────────────────────────┐
│ Modelo Ativo: Gemini 3.0 Flash   [⚡ Rápido] │
│ ──────────────────────────────────────────── │
│ GEMINI (Google)                              │
│  ● Gemini 3.0 Flash   [Grátis] [⚡ Rápido]  │
│  ○ Gemini 3.0 Pro     [Pago]   [◎ Médio]    │
│ ──────────────────────────────────────────── │
│ CLAUDE (Anthropic)                           │
│  ○ Claude Sonnet 4    [Pago]   [◎ Médio]    │
│  ○ Claude Opus 4      [Pago]   [◎ Detalhado]│
│ ──────────────────────────────────────────── │
│ GROK (xAI)                                   │
│  ○ Grok 3             [Grátis] [⚡ Rápido]  │
│  ○ Grok 3 Mini        [Grátis] [⚡ Rápido]  │
│ ──────────────────────────────────────────── │
│ MISTRAL                                      │
│  ○ Mistral Medium 3   [Grátis] [⚡ Rápido]  │
│  ○ Mistral Large 2    [Pago]   [◎ Médio]    │
└──────────────────────────────────────────────┘
```

---

## 16. WINDOWS NOTIFICATION API

```javascript
async requestNotificationPermission() {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

showNotification(title, body, icon = '⚡') {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return
  
  new Notification(title, {
    body,
    icon: 'assets/icon.png',  // Ícone do app (criar um PNG 128x128)
    silent: false,
    requireInteraction: false
  })
}

// Uso:
// this.showNotification('LandingAI', `DOC-IMPL gerado! Projeto: ${nome}`)
// this.showNotification('LandingAI', `Erro na geração: ${err.message}`)
```

**Solicitar permissão:** Na primeira vez que o usuário abre o app, mostrar um banner solicitando permissão de notificação.

---

## 17. AUTO-SAVE E PERSISTÊNCIA

### Estratégia

```javascript
autosave() {
  clearTimeout(this._saveTimeout)
  this._saveTimeout = setTimeout(() => {
    const project = this.state.projects[this.state.activeProjectId]
    if (!project) return
    
    project.briefing = { ...this.briefing }
    project.visitedSteps = Array.from(this.state.visitedSteps)
    project.updatedAt = new Date().toISOString()

    localStorage.setItem('landingai_projects', JSON.stringify(this.state.projects))
    localStorage.setItem('landingai_active', this.state.activeProjectId)

    // Indicador visual de save (pulso no indicador da sidebar)
    this.showSaveIndicator()
  }, 1500) // 1.5s debounce
}

checkDraft() {
  const raw = localStorage.getItem('landingai_projects')
  const activeId = localStorage.getItem('landingai_active')

  if (raw) {
    this.state.projects = JSON.parse(raw)
    if (activeId && this.state.projects[activeId]) {
      this.state.activeProjectId = activeId
      this.briefing = { ...this.state.projects[activeId].briefing }
      this.state.visitedSteps = new Set(this.state.projects[activeId].visitedSteps || [])
      this.showToast('Projeto restaurado', 'default')
    }
  }
}
```

---

## 18. SIDEBAR — ESPECIFICAÇÃO VISUAL

```
┌──────────────────────┐
│  ⚡ LandingAI        │
│  by Adsgator         │
│ ──────────────────── │
│  PROJETO ATIVO       │
│  [LayoutTemplate]    │
│  B.Mattos Mentoria   │  ← nome_cliente
│  Adestramento        │  ← segmento
│  ████████░░ 83%      │  ← score global
│  [⊕ Projetos]        │  ← abre modal-projects
│ ──────────────────── │
│  BRIEFING            │
│  ✓  1. Identificação │  ← check verde
│  ✓  2. Contato       │
│  ✓  3. Redes Sociais │
│  ✓  4. Localização   │
│  ●  5. Serviços      │  ← bullet accent (step ativo)
│  ○  6. Público       │  ← circle cinza
│  ○  7. Diferenciais  │
│  ○  8. Direção Visual│
│  ○  9. Assets        │
│  ─  Revisão Final    │
│ ──────────────────── │
│  [Key] API Keys      │  ← abre modal-api
│  [Cpu] Modelo Ativo  │
│       Gemini Flash   │  ← nome curto do modelo
│ ──────────────────── │
│  [dot] Auto-saved    │  ← pulso verde após save
│  agora mesmo         │
└──────────────────────┘
```

---

## 19. TOPBAR — ESPECIFICAÇÃO

```
┌──────────────────────────────────────────────────────────┐
│ Serviços e Produto             Score: ████░ 78% [Médio]  │
│ Step 5 de 9 — O núcleo da landing page                   │
└──────────────────────────────────────────────────────────┘
```

Componentes da topbar:
- Título do step atual (Syne 700)
- Subtítulo/hint do step (DM Sans regular, text-secondary)
- Score badge do step atual

---

## 20. BOTTOMBAR (Navegação)

```
┌──────────────────────────────────────────────────────────┐
│ [← Anterior]                    [Próximo: Público →]     │
│                                                          │
│ (step 9): [↓ Baixar DOC-1]  [⚡ Gerar DOC-IMPL via IA] │
└──────────────────────────────────────────────────────────┘
```

**Lógica dos botões no step 9 (Revisão):**
- "Baixar DOC-1" — sempre habilitado (mesmo com campos faltando)
- "Gerar DOC-IMPL via IA" — habilitado se:
  - Todos os campos críticos preenchidos
  - Pelo menos uma API Key configurada
  - Score global >= 60%

---

## 21. PREVIEW VISUAL

### Estratégia de Preview

Após a IA gerar o DOC-IMPL, o LandingAI gera um preview visual usando a própria API para criar um HTML mockup simplificado baseado na especificação.

```javascript
async generatePreview(docImpl) {
  const previewPrompt = `
Você recebeu uma Ficha de Implementação de landing page.
Gere um HTML MOCKUP simplificado — não o código final, apenas um preview visual rápido.

REGRAS:
- HTML em único arquivo, inline CSS, zero dependências externas
- Representa apenas Hero + 3 seções principais + Footer
- Use as cores, fontes e copy EXATAS do documento
- Visual FIEL ao que será implementado (não genérico)
- Máximo 200 linhas de HTML
- Não inclua JavaScript
- Mobile-first (viewport 375px base)
- Output APENAS o HTML, sem explicações

FICHA DE IMPLEMENTAÇÃO:
${docImpl.substring(0, 8000)} [...]
`

  try {
    const html = await this.callAI(previewPrompt)
    this.renderPreview(html)
  } catch (err) {
    // Preview falhou — mostra aviso mas não interrompe geração
    this.showToast('Preview não gerado — DOC-IMPL disponível normalmente', 'warning')
  }
}

renderPreview(html) {
  const modal = document.getElementById('modal-preview')
  const iframe = modal.querySelector('iframe')
  const blob = new Blob([html], { type: 'text/html' })
  iframe.src = URL.createObjectURL(blob)
  modal.classList.add('active')
}
```

### Modal de Preview

```
┌─────────────────────────────────────────────────────────┐
│ 👁 Preview — B.MATTOS Mentoria        [Baixar Preview]  │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │     [IFRAME com o preview HTML]                  │   │
│  │     600px × 800px                                │   │
│  │                                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ⚠ Preview simplificado — representa apenas Hero +      │
│  3 seções + Footer. Implementação final será mais rica. │
│                                                         │
│  [↓ Baixar DOC-IMPL]     [✕ Fechar]                    │
└─────────────────────────────────────────────────────────┘
```

---

## 22. TOAST SYSTEM

```javascript
showToast(msg, type = 'default', duration = 3500) {
  const t = document.getElementById('toast')
  const icons = {
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert-triangle',
    default: 'info'
  }
  
  t.innerHTML = `
    <i data-lucide="${icons[type]}" class="icon icon--${type}"></i>
    <span>${msg}</span>
  `
  t.className = `toast toast--${type} toast--visible`
  lucide.createIcons({ nodes: [t] })
  
  clearTimeout(this._toastTimeout)
  this._toastTimeout = setTimeout(() => {
    t.classList.remove('toast--visible')
  }, duration)
}
```

**Tipos de Toast:**
- `success` — verde, ícone check — "DOC-1 salvo!", "API Key salva!"
- `error` — vermelho, ícone alert-circle — "Erro: chave inválida"
- `warning` — amarelo, ícone alert-triangle — "Briefing incompleto"
- `default` — neutro, ícone info — "Projeto restaurado", "Copiado!"

---

## 23. CHECKLIST DE IMPLEMENTAÇÃO

### Antes de Codificar
- [ ] Ler este documento inteiro
- [ ] Confirmar estrutura de arquivos (`landingai/`, `assets/`, `output/`)
- [ ] Copiar template de REGRAS FIXAS ADSGATOR para string em `app.js`
- [ ] Criar `assets/icon.png` (128×128 — para Windows Notification)
- [ ] Confirmar endpoints de API mais atuais para cada provedor

### Durante a Implementação

#### HTML
- [ ] `index.html` com estrutura correta de regiões
- [ ] Lucide Icons CDN no `<head>`
- [ ] Google Fonts CDN no `<head>`
- [ ] Todos os modais criados (api, gen, preview, projects, error)
- [ ] Toast `<div>` presente

#### CSS (app.css)
- [ ] Todas as CSS variables definidas
- [ ] Reset básico (box-sizing: border-box, margin: 0, padding: 0)
- [ ] Layout flexbox sidebar + main
- [ ] Todos os componentes base (inputs, buttons, chips, sel-cards, badges)
- [ ] Sidebar com scroll próprio
- [ ] Main com scroll próprio
- [ ] Progress bar animada
- [ ] Modais com backdrop blur
- [ ] Toast com animação slide-in
- [ ] `.icon--spin` com `animation: spin 1s linear infinite`
- [ ] Responsivo: sidebar colapsa em tela pequena (se necessário)

#### JS (app.js)
- [ ] App object com todos os métodos listados na Seção 2
- [ ] `init()` chama: checkDraft → renderSidebar → renderTopbar → renderStepContent → setupEvents → requestNotificationPermission
- [ ] Auto-save 1.5s debounce
- [ ] Todos os 9 steps renderizados com campos corretos
- [ ] Validação em tempo real por campo
- [ ] Score calculado por step
- [ ] Step 9 renderiza dashboard (não form)
- [ ] buildDoc1() gera markdown completo e correto
- [ ] buildMasterPrompt() inclui instrução mestre + DOC-1
- [ ] Todas as 4 chamadas de API implementadas
- [ ] Modal de erro com mensagem exata
- [ ] Modal de geração com 6 passos animados
- [ ] Preview via iframe com blob URL
- [ ] Windows Notification solicitando permissão no init
- [ ] Sistema de projetos (criar/salvar/clonar/deletar)
- [ ] Versionamento automático no saveVersion()
- [ ] Exportar/importar projeto (JSON)
- [ ] lucide.createIcons() chamado após cada render

### Antes de Entregar
- [ ] Abrir com duplo clique no Chrome/Edge — funciona sem servidor
- [ ] Criar projeto novo — fluxo completo sem erros de console
- [ ] Preencher todos os 9 steps — auto-save funcionando
- [ ] Step 9 (revisão) — score e warnings corretos
- [ ] Baixar DOC-1 — arquivo correto, formatação perfeita
- [ ] Configurar API Key Gemini — salva, status muda para "Configurado"
- [ ] Gerar DOC-IMPL — modal aparece, progresso avança, arquivo baixa
- [ ] Testar erro de API (chave errada) — modal de erro exibe mensagem exata
- [ ] Criar segundo projeto — sem interferir no primeiro
- [ ] Clonar projeto — dados copiados corretamente
- [ ] Fechar e reabrir — draft restaurado

---

## 24. NOTAS DE DECISÃO TÉCNICA

### Por que zero build?
- Portabilidade total — abre em qualquer máquina com duplo clique
- Zero configuração — sem Node.js, npm, Vite
- Velocidade de iteração — salva e recarrega direto

### Por que Lucide Icons via CDN?
- SVG-based (nítido em qualquer resolução)
- Consistente e moderno
- Zero download necessário

### Por que localStorage (não IndexedDB)?
- Simplicidade — API síncrona fácil de usar
- Suficiente para projetos em texto (~ alguns KB cada)
- Se necessário no futuro, migrar para IndexedDB com wrapper

### Por que sem fallback automático de modelo?
- Controle total do usuário — você sempre sabe o que aconteceu
- Evita custos inesperados (trocar de Gemini grátis para Claude pago automaticamente)
- Diagnóstico mais claro do problema real

---

## 25. ITENS QUE EXIGEM ATENÇÃO NA IMPLEMENTAÇÃO

1. **CORS das APIs** — Todas as APIs listadas suportam chamadas direto do browser (sem servidor proxy necessário), exceto em ambientes com restrições. Se aparecer erro de CORS, o campo `anthropic-dangerous-direct-browser-access: true` no header do Claude é necessário.

2. **Endpoints Gemini** — O Google frequentemente atualiza os slugs dos modelos. Verificar endpoint exato na documentação antes de implementar: https://ai.google.dev/api/generate-content

3. **Grok API Status** — Confirmar se free tier do Grok 3 está disponível publicamente em https://console.x.ai no momento de implementar.

4. **Preview via API** — O preview consome uma chamada de API adicional. Se o usuário não quiser isso, adicionar toggle "Gerar preview" nas configurações.

5. **Download de arquivo** — Usar `URL.createObjectURL(new Blob([content], {type: 'text/markdown'}))` para download de `.md`. Funciona sem servidor.

6. **Windows Notification** — Só funciona em HTTPS ou localhost. Em file:// (duplo clique) pode não funcionar em todos os browsers. Fallback: toast no sistema.

7. **Tamanho do prompt** — O DOC-1 completo pode ter 3000–8000 tokens. Verificar se os modelos free tier suportam isso (geralmente sim, mas confirmar max_tokens de input).

---

*Documento gerado em 2026-05-05 · LandingAI v2 · Adsgator*
*Versão: 1.0.0*
