markdown

# LandingAI v3 — Ficha de Implementação
> **Documento para o Roo Code.**
> Sistema interno da Adsgator. Roda 100% no browser — sem backend, sem servidor, sem npm.
> Leia o documento inteiro antes de criar qualquer arquivo.
> Não invente nada além do que está aqui.

---

## O QUE É O LANDINGAI v3

O LandingAI v3 é um assistente de briefing inteligente. A diferença fundamental da v2:

- **v2:** Você preenche os campos → IA gera o doc
- **v3:** Você cola o material bruto do cliente → IA lê e preenche tudo → você revisa e ajusta → IA gera o doc

O processo de coleta sai da sua cabeça e vai para a IA. Você entra como curador e diretor, não como digitador.

---

## ORDEM DE CRIAÇÃO

### FASE 1 — Estrutura
1. `index.html`

### FASE 2 — Estilos
2. `assets/app.css`

### FASE 3 — Aplicação
3. `assets/app.js`

### FASE 4 — Utilitários
4. `assets/icon.png` *(ícone 128×128 para Windows Notification — criar manualmente ou usar placeholder)*
5. `output/.gitkeep`
6. `README.md`

---

## STACK DO SISTEMA

```
HTML5 — index.html (estrutura)
CSS externo — assets/app.css (design system completo)
JS externo — assets/app.js (lógica completa, App object)
Fontes: Syne 600/700/800 + DM Sans 300/400/500/600 + DM Mono 400/500 (Google Fonts CDN)
Ícones: Lucide Icons (CDN unpkg)
Armazenamento: localStorage (projetos + API keys + settings)
APIs: Gemini (padrão) + Claude + Grok + Mistral (fetch nativo)
Sem frameworks, sem bundlers, sem node_modules
Abre com duplo clique no index.html
```

---

## FLUXO COMPLETO DO SISTEMA

```
TELA 0 — INTAKE INTELIGENTE
  Cola briefing bruto + upload PDF/imagem opcional
  Seleciona modelo de IA
  IA analisa e preenche automaticamente Steps 1–8
        ↓
STEPS 1–8 — REVISÃO
  Campos chegam pré-preenchidos pela IA
  Você percorre, ajusta, complementa
  Tooltips em todos os campos com sugestões
  Validação em tempo real + score por step
        ↓
TELA DE DIREÇÃO DE ARTE
  Upload de ativos da marca (logo, fotos)
  Referências pessoais com contexto
  Referências do nicho com contexto
  Links que a IA acessa
  IA devolve ficha estruturada:
    → Paleta proposta (HEX)
    → Tipografia proposta
    → Tom visual interpretado
    → Referências analisadas
  Você aprova ou ajusta
        ↓
STEP 9 — REVISÃO FINAL + GERAÇÃO
  Dashboard de completude (score global)
  Cards de cada step com warnings
  SAÍDA A: Baixar DOC-1 (.md) → usar manualmente em qualquer IA
  SAÍDA B: Gerar DOC-IMPL via API → IA entrega ficha de implementação completa
    → Preview visual via iframe
    → Download doc-impl-[slug].md
    → Windows Notification ao concluir
```

---

## FASE 1 — ESTRUTURA

---

### `index.html`

```html



  
  
  LandingAI — Adsgator
  

  
  
  
  

  
  



  
  

    
    

      
      
        
          
        
        
          LandingAI
          by Adsgator
        
      

      
      
        PROJETO ATIVO
        
          
          
            Novo Projeto
            —
          
          
        
        
          
            
          
          0%
        
      

      
      
        BRIEFING
        
          
        
        
          
            
          
          Direção de Arte
        
        
          
            
          
          Revisão e Geração
        
      

      
      
        
          
          Config. API
        
        
          
          Sem API
        
        
          
          Salvo
        
      

    

    
    

      
      
        
          Bem-vindo
          
        
        
          
            —
          
          
            
              
              Gemini Flash
              
            
            
              
            
          
        
      

      
      
        
      

      
      
        
      

      
      
        
          
            
            Anterior
          
          
          
            
          
        
      

    
  

  <!-- ===== MODAIS ===== -->

  
  
    
      
        Meus Projetos
        
          
        
      
      
        
          
            
            Novo Projeto
          
          
            
            Importar
            
          
        
        
          
        
      
    
  

  
  
    
      
        Configurar APIs
        
          
        
      
      
        
      
    
  

  
  
    
      
        Gerando Ficha de Implementação
      
      
        
        
          
            
          
          0%
        
        
          
        
        O processo pode levar 30–90 segundos dependendo do modelo e do briefing.
      
    
  

  
  
    
      
        
          
        
        Erro na Geração
        
          
        
      
      
        
        
        
        
          
            
            Tentar Novamente
          
          
            
            Trocar Modelo
          
          
            
            Baixar DOC-1 Manual
          
        
      
    
  

  
  
    
      
        
          
          Preview — 
        
        
          
            
            Baixar Preview
          
          
            
          
        
      
      
        
        
          
          Preview simplificado — representa Hero + 3 seções + Footer. A implementação final será mais rica.
        
        
          
            
            Baixar DOC-IMPL
          
          Fechar
        
      
    
  

  
  
    
      
        
          
          Ficha de Direção de Arte
        
        
          
        
      
      
        
      
      
        
          
          Aprovar Direção
        
        Revisar
      
    
  

  
  

  
  

  
  
  
    document.addEventListener('DOMContentLoaded', () => App.init());
  



```

---

## FASE 2 — ESTILOS

---

### `assets/app.css`

```css
/* ============================================================
   LandingAI v3 — Design System
   Adsgator · Sistema Interno
   ============================================================ */

/* ── Reset ─────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-font-smoothing: antialiased; }
body { font-family: var(--font-body); background: var(--bg-base); color: var(--text-primary); line-height: 1.6; }
button { font-family: inherit; cursor: pointer; border: none; background: none; }
input, textarea, select { font-family: inherit; }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }

/* ── Design Tokens ─────────────────────────────────────────── */
:root {
  /* Backgrounds */
  --bg-base:        #07080D;
  --bg-surface:     #0D0F19;
  --bg-raised:      #131624;
  --bg-overlay:     #191C2E;
  --bg-hover:       #1E2238;

  /* Bordas */
  --border-subtle:  rgba(255,255,255,0.03);
  --border-muted:   rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-strong:  rgba(255,255,255,0.18);

  /* Texto */
  --text-primary:   #ECEEF5;
  --text-secondary: #848698;
  --text-tertiary:  #484B62;
  --text-disabled:  #2C2F45;

  /* Accent principal — verde Adsgator */
  --accent:         #00E5A0;
  --accent-hover:   #00FFAF;
  --accent-dim:     rgba(0, 229, 160, 0.08);
  --accent-glow:    rgba(0, 229, 160, 0.18);
  --accent-border:  rgba(0, 229, 160, 0.25);
  --accent-text:    #031A10;

  /* Accent secundário — azul índigo */
  --accent2:        #7B8CFF;
  --accent2-hover:  #919FFF;
  --accent2-dim:    rgba(123, 140, 255, 0.08);
  --accent2-border: rgba(123, 140, 255, 0.25);

  /* Semântico */
  --danger:         #FF5656;
  --danger-dim:     rgba(255, 86, 86, 0.08);
  --danger-border:  rgba(255, 86, 86, 0.22);
  --warning:        #FFB347;
  --warning-dim:    rgba(255, 179, 71, 0.08);
  --warning-border: rgba(255, 179, 71, 0.22);
  --success:        #00E5A0;
  --success-dim:    rgba(0, 229, 160, 0.08);

  /* Raios */
  --r-xs:   2px;
  --r-sm:   6px;
  --r-md:   10px;
  --r-lg:   16px;
  --r-xl:   22px;
  --r-pill: 999px;

  /* Sombras */
  --shadow-sm:   0 1px 4px rgba(0,0,0,0.45);
  --shadow-md:   0 4px 16px rgba(0,0,0,0.55);
  --shadow-lg:   0 8px 32px rgba(0,0,0,0.65);
  --shadow-glow: 0 0 28px rgba(0,229,160,0.14);

  /* Transições */
  --t-fast:   0.10s ease;
  --t-base:   0.18s ease;
  --t-slow:   0.32s ease;
  --t-spring: 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Tipografia */
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'DM Mono', monospace;

  /* Layout */
  --sidebar-w: 252px;
  --topbar-h:  58px;
  --bottom-h:  68px;
  --content-max: 860px;
}

/* ── Layout Principal ──────────────────────────────────────── */
#app {
  display: flex;
  height: 100dvh;
  overflow: hidden;
}

/* ── Sidebar ───────────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  position: relative;
  z-index: 10;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.logo-mark {
  width: 32px;
  height: 32px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon { width: 16px; height: 16px; color: var(--accent); }

.logo-text { display: flex; flex-direction: column; gap: 1px; }
.logo-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.logo-sub {
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.sidebar-section {
  padding: 16px 14px 0;
  flex-shrink: 0;
}

.sidebar-label {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-disabled);
  padding: 0 6px;
  margin-bottom: 8px;
}

.project-card {
  width: 100%;
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  transition: border-color var(--t-base), background var(--t-base);
}
.project-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }

.project-card-icon { width: 16px; height: 16px; color: var(--accent); flex-shrink: 0; }
.project-card-info { flex: 1; min-width: 0; }
.project-card-name {
  display: block;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-card-segment {
  display: block;
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-card-chevron { width: 14px; height: 14px; color: var(--text-tertiary); flex-shrink: 0; }

.project-score-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 6px 4px;
}
.project-score-bar {
  flex: 1;
  height: 2px;
  background: var(--bg-overlay);
  border-radius: var(--r-pill);
  overflow: hidden;
}
.project-score-fill {
  height: 100%;
  background: var(--accent);
  border-radius: var(--r-pill);
  transition: width 0.5s ease;
}
.project-score-pct { font-family: var(--font-mono); font-size: 10px; color: var(--text-tertiary); }

.sidebar-steps { flex: 1; overflow-y: auto; padding-bottom: 8px; }
.sidebar-steps::-webkit-scrollbar { width: 3px; }
.sidebar-steps::-webkit-scrollbar-thumb { background: var(--border-muted); border-radius: var(--r-pill); }

.steps-nav { display: flex; flex-direction: column; gap: 2px; }

.step-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--r-sm);
  font-size: 13px;
  color: var(--text-secondary);
  transition: background var(--t-fast), color var(--t-fast);
  text-align: left;
}
.step-nav-item:hover { background: var(--bg-overlay); color: var(--text-primary); }
.step-nav-item.active { background: var(--accent2-dim); color: var(--text-primary); }
.step-nav-item.active .step-dot { background: var(--accent2); border-color: var(--accent2); }
.step-nav-item.done .step-dot { background: var(--accent); border-color: var(--accent); }
.step-nav-item.done .step-dot i { display: none; }
.step-nav-item.has-error .step-dot { background: var(--danger-dim); border-color: var(--danger); }
.step-nav-item.has-error .step-dot-inner { color: var(--danger); }

.step-dot {
  width: 18px;
  height: 18px;
  border-radius: var(--r-pill);
  border: 1.5px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--t-base);
}
.step-dot-inner { font-family: var(--font-mono); font-size: 9px; color: var(--text-tertiary); }

.step-dot--art { border-color: rgba(255,179,71,0.35); background: rgba(255,179,71,0.08); color: var(--warning); }
.step-dot--review { border-color: var(--accent-border); background: var(--accent-dim); color: var(--accent); }

.step-label { font-size: 12.5px; }

.step-art, .step-review {
  margin-top: 6px;
  border-top: 1px solid var(--border-subtle);
  padding-top: 10px;
}

/* Sidebar footer */
.sidebar-footer {
  padding: 12px 14px 16px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.sidebar-footer-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-default);
  background: transparent;
  color: var(--text-secondary);
  font-size: 12.5px;
  transition: all var(--t-base);
}
.sidebar-footer-btn:hover { border-color: var(--border-strong); color: var(--text-primary); background: var(--bg-overlay); }

.sidebar-status { display: flex; align-items: center; gap: 6px; padding: 0 4px; }
.status-dot { width: 6px; height: 6px; border-radius: var(--r-pill); background: var(--text-disabled); }
.status-dot.ok { background: var(--accent); box-shadow: 0 0 6px var(--accent); }
.status-dot.partial { background: var(--warning); }
.status-label { font-size: 11px; color: var(--text-tertiary); }

.save-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--text-disabled);
  padding: 0 4px;
  transition: color var(--t-base);
}
.save-indicator.saving { color: var(--accent); animation: pulse 1s infinite; }
.save-indicator.saved { color: var(--text-tertiary); }

/* ── Main ──────────────────────────────────────────────────── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  min-width: 0;
}

/* Topbar */
.topbar {
  height: var(--topbar-h);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  flex-shrink: 0;
  gap: 16px;
  background: var(--bg-base);
  position: relative;
  z-index: 5;
}

.topbar-left { min-width: 0; flex: 1; }
.topbar-title {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.topbar-subtitle {
  font-size: 11.5px;
  color: var(--text-secondary);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

/* Progress */
.progress-bar-wrap {
  height: 2px;
  background: var(--border-subtle);
  flex-shrink: 0;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: 0 var(--r-pill) var(--r-pill) 0;
  transition: width 0.5s ease;
}

/* Content */
.screen-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px 48px;
}
.screen-content::-webkit-scrollbar { width: 4px; }
.screen-content::-webkit-scrollbar-thumb { background: var(--border-muted); border-radius: var(--r-pill); }

.step-inner {
  max-width: var(--content-max);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Bottombar */
.bottombar {
  height: var(--bottom-h);
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.bottombar-inner {
  max-width: calc(var(--content-max) + 96px);
  width: 100%;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.bottombar-center { flex: 1; display: flex; justify-content: center; }
.bottombar-actions { display: flex; align-items: center; gap: 10px; }

/* Model Selector */
.model-selector-wrap { position: relative; }
.btn-model {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid var(--border-default);
  border-radius: var(--r-pill);
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: var(--font-body);
  transition: all var(--t-base);
}
.btn-model:hover { border-color: var(--border-strong); color: var(--text-primary); }

.model-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-lg);
  min-width: 240px;
  z-index: 100;
  overflow: hidden;
}

.model-group-label {
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-disabled);
  padding: 10px 14px 4px;
}

.model-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  text-align: left;
  font-size: 13px;
  color: var(--text-secondary);
  transition: background var(--t-fast);
}
.model-option:hover { background: var(--bg-overlay); color: var(--text-primary); }
.model-option.active { background: var(--accent2-dim); color: var(--text-primary); }

.model-option-name { flex: 1; }
.model-tier {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: var(--r-pill);
  font-weight: 500;
}
.model-tier--free { background: var(--success-dim); color: var(--success); }
.model-tier--paid { background: var(--accent2-dim); color: var(--accent2); }

.model-divider { height: 1px; background: var(--border-subtle); margin: 4px 0; }

/* Score badge */
.score-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: var(--r-pill);
  font-size: 11px;
  font-weight: 600;
  font-family: var(--font-mono);
}
.score-badge.high   { background: var(--success-dim); color: var(--success); }
.score-badge.medium { background: var(--warning-dim); color: var(--warning); }
.score-badge.low    { background: var(--danger-dim);  color: var(--danger); }

/* ── Botões ────────────────────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  background: var(--accent);
  color: var(--accent-text);
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity var(--t-base), transform var(--t-spring), box-shadow var(--t-base);
  white-space: nowrap;
}
.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: var(--shadow-glow); }
.btn-primary:active { transform: translateY(0); opacity: 1; }
.btn-primary:disabled { opacity: 0.28; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  background: var(--accent2-dim);
  color: var(--accent2);
  border: 1px solid var(--accent2-border);
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t-base);
  white-space: nowrap;
}
.btn-secondary:hover { background: rgba(123,140,255,0.14); }
.btn-secondary:disabled { opacity: 0.28; cursor: not-allowed; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t-base);
  white-space: nowrap;
}
.btn-ghost:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-overlay); }
.btn-ghost:disabled { opacity: 0.3; cursor: not-allowed; }

.btn-danger-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--danger-dim);
  color: var(--danger);
  border: 1px solid var(--danger-border);
  border-radius: var(--r-pill);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t-base);
}
.btn-danger-ghost:hover { background: rgba(255,86,86,0.14); }

.btn-sm { padding: 7px 14px; font-size: 12px; }

/* ── Formulário ───────────────────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}
.field-required { color: var(--danger); font-size: 12px; }
.field-optional {
  font-size: 9.5px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  color: var(--text-disabled);
}

/* Tooltip */
.field-tooltip {
  position: relative;
  display: inline-flex;
}
.field-tooltip-icon {
  width: 14px;
  height: 14px;
  color: var(--text-disabled);
  cursor: help;
  transition: color var(--t-fast);
}
.field-tooltip:hover .field-tooltip-icon { color: var(--text-tertiary); }
.field-tooltip-bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  padding: 8px 12px;
  font-size: 11.5px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  color: var(--text-secondary);
  white-space: nowrap;
  max-width: 260px;
  white-space: normal;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--t-fast);
  z-index: 50;
  box-shadow: var(--shadow-md);
  line-height: 1.5;
}
.field-tooltip:hover .field-tooltip-bubble { opacity: 1; }

.field-input,
.field-textarea,
.field-select {
  width: 100%;
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 13.5px;
  padding: 11px 14px;
  outline: none;
  transition: border-color var(--t-base), box-shadow var(--t-base);
  -webkit-appearance: none;
}
.field-input::placeholder,
.field-textarea::placeholder { color: var(--text-disabled); }
.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  border-color: var(--accent2);
  box-shadow: 0 0 0 3px var(--accent2-dim);
}
.field-input.warn { border-color: var(--warning); }
.field-input.warn:focus { box-shadow: 0 0 0 3px var(--warning-dim); }
.field-input.error { border-color: var(--danger); }
.field-input.error:focus { box-shadow: 0 0 0 3px var(--danger-dim); }

.field-textarea { resize: vertical; min-height: 96px; line-height: 1.65; }
.field-textarea.tall { min-height: 160px; }
.field-textarea.xtall { min-height: 240px; }

.field-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  line-height: 1.5;
}
.field-warning {
  font-size: 11px;
  color: var(--warning);
  display: flex;
  align-items: flex-start;
  gap: 5px;
  line-height: 1.5;
}
.field-error-msg {
  font-size: 11px;
  color: var(--danger);
  display: flex;
  align-items: flex-start;
  gap: 5px;
}

.field-preview {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  border-radius: var(--r-sm);
  padding: 6px 10px;
  margin-top: 2px;
}

/* Chips */
.chip-group { display: flex; flex-wrap: wrap; gap: 8px; }

.chip {
  padding: 7px 14px;
  border: 1px solid var(--border-default);
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-size: 12.5px;
  cursor: pointer;
  background: transparent;
  color: var(--text-secondary);
  transition: all var(--t-base);
  user-select: none;
}
.chip:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-overlay); }
.chip.on { background: var(--accent2-dim); border-color: var(--accent2-border); color: var(--accent2); }
.chip.on-accent { background: var(--accent-dim); border-color: var(--accent-border); color: var(--accent); }

/* Sel-cards */
.sel-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }

.sel-card {
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 14px 16px;
  cursor: pointer;
  background: var(--bg-surface);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all var(--t-base);
  text-align: left;
}
.sel-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }
.sel-card.on { border-color: var(--accent-border); background: var(--accent-dim); box-shadow: 0 0 0 1px var(--accent-border); }

.sel-card-icon { color: var(--text-tertiary); flex-shrink: 0; margin-top: 1px; }
.sel-card.on .sel-card-icon { color: var(--accent); }
.sel-card-title {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
  letter-spacing: -0.01em;
}
.sel-card-desc { font-size: 11.5px; color: var(--text-secondary); line-height: 1.5; }

/* Color Picker */
.color-picker-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.color-picker-swatch {
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border-default);
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
}
.color-picker-swatch input[type="color"] {
  width: 160%;
  height: 160%;
  margin: -30%;
  cursor: pointer;
  border: none;
  padding: 0;
}
.color-picker-input { flex: 1; }

/* Upload Zone */
.upload-zone {
  border: 1.5px dashed var(--border-default);
  border-radius: var(--r-md);
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all var(--t-base);
  background: var(--bg-raised);
}
.upload-zone:hover, .upload-zone.drag-over { border-color: var(--accent2); background: var(--accent2-dim); }
.upload-zone input[type="file"] { display: none; }
.upload-zone-icon { color: var(--text-tertiary); margin: 0 auto 8px; width: 28px; height: 28px; }
.upload-zone-label { font-size: 13px; color: var(--text-secondary); }
.upload-zone-hint { font-size: 11px; color: var(--text-tertiary); margin-top: 3px; }
.upload-zone.has-file { border-color: var(--accent); border-style: solid; }
.upload-zone.has-file .upload-zone-icon { color: var(--accent); }

.upload-preview-list { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.upload-preview-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: var(--bg-overlay);
  border-radius: var(--r-sm);
  font-size: 12px;
  color: var(--text-secondary);
}
.upload-preview-item i { color: var(--accent); flex-shrink: 0; }
.upload-preview-item span { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.upload-preview-item button { color: var(--text-tertiary); padding: 2px; }
.upload-preview-item button:hover { color: var(--danger); }

/* Divider */
.form-divider {
  height: 1px;
  background: var(--border-subtle);
  margin: 4px 0;
}

.form-section-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-subtle);
  letter-spacing: -0.01em;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

/* ── Intake Screen ─────────────────────────────────────────── */
.intake-screen {
  max-width: 780px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.intake-hero {
  text-align: center;
  padding-bottom: 8px;
}

.intake-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-border);
  border-radius: var(--r-pill);
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 16px;
}

.intake-title {
  font-family: var(--font-display);
  font-size: clamp(24px, 3.5vw, 34px);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 12px;
}

.intake-subtitle {
  font-size: 14.5px;
  color: var(--text-secondary);
  line-height: 1.65;
  max-width: 520px;
  margin: 0 auto;
}

.intake-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.intake-box-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.intake-box-icon { color: var(--accent2); }
.intake-box-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-primary); }
.intake-box-desc { font-size: 11.5px; color: var(--text-secondary); margin-left: auto; }

.intake-box-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

.intake-or {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-disabled);
  font-size: 11px;
}
.intake-or::before, .intake-or::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
}

.intake-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
}

.intake-sop-hint {
  background: var(--bg-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-md);
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.intake-sop-hint-icon { color: var(--warning); flex-shrink: 0; margin-top: 1px; }
.intake-sop-hint-text { font-size: 12px; color: var(--text-secondary); line-height: 1.6; }
.intake-sop-hint-text strong { color: var(--text-primary); }

/* Loading overlay IA preenchendo steps */
.intake-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
  text-align: center;
}
.intake-loading-icon { color: var(--accent); animation: spin 1.5s linear infinite; }
.intake-loading-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text-primary); }
.intake-loading-sub { font-size: 13px; color: var(--text-secondary); }

/* ── Art Direction Screen ──────────────────────────────────── */
.art-screen {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.art-screen-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.art-screen-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.art-screen-desc { font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; }

.art-section {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.art-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.art-section-icon { width: 18px; height: 18px; }
.art-section-title { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-primary); }

.art-section-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reference-item {
  background: var(--bg-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-md);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.reference-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.reference-index {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-disabled);
}

.art-result-card {
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  overflow: hidden;
}

.art-result-section {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
}
.art-result-section:last-child { border-bottom: none; }

.art-result-section-title {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 12px;
}

.palette-swatches { display: flex; gap: 8px; flex-wrap: wrap; }
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
  border: 1px solid var(--border-subtle);
}
.palette-swatch-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-secondary);
}

.art-result-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.65;
}
.art-result-tag {
  display: inline-block;
  padding: 3px 9px;
  border-radius: var(--r-pill);
  font-size: 11px;
  background: var(--bg-overlay);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  margin: 2px;
}

/* ── Review Screen ─────────────────────────────────────────── */
.review-screen {
  max-width: var(--content-max);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.review-global-score {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.review-score-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}
.review-score-number {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.04em;
  line-height: 1;
}
.review-score-label { font-size: 12px; color: var(--text-secondary); }

.review-score-bar-wrap { flex: 1; }
.review-score-bar-bg {
  height: 6px;
  background: var(--bg-overlay);
  border-radius: var(--r-pill);
  overflow: hidden;
  margin-bottom: 8px;
}
.review-score-bar-fill {
  height: 100%;
  border-radius: var(--r-pill);
  transition: width 0.8s ease;
}
.review-score-status { font-size: 13px; color: var(--text-secondary); }

.review-steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.review-step-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 14px 16px;
  cursor: pointer;
  transition: all var(--t-base);
}
.review-step-card:hover { border-color: var(--border-strong); background: var(--bg-overlay); }

.review-step-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.review-step-card-name { font-size: 12.5px; font-weight: 600; color: var(--text-primary); }
.review-step-card-score {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
}
.review-step-card-score.high { color: var(--success); }
.review-step-card-score.medium { color: var(--warning); }
.review-step-card-score.low { color: var(--danger); }

.review-step-card-bar {
  height: 2px;
  background: var(--bg-overlay);
  border-radius: var(--r-pill);
  overflow: hidden;
  margin-bottom: 8px;
}
.review-step-card-fill { height: 100%; border-radius: var(--r-pill); }

.review-step-card-btn {
  font-size: 11px;
  color: var(--accent2);
  display: flex;
  align-items: center;
  gap: 4px;
}

.review-warnings {
  background: var(--bg-surface);
  border: 1px solid var(--warning-border);
  border-radius: var(--r-md);
  overflow: hidden;
}

.review-warnings-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--warning-border);
  background: var(--warning-dim);
  font-size: 12px;
  font-weight: 600;
  color: var(--warning);
}

.review-warning-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--border-subtle);
  font-size: 12.5px;
  color: var(--text-secondary);
}
.review-warning-item:last-child { border-bottom: none; }
.review-warning-goto {
  margin-left: auto;
  flex-shrink: 0;
  font-size: 11px;
  color: var(--accent2);
  cursor: pointer;
}
.review-warning-goto:hover { color: var(--accent2-hover); }

.review-critical-missing {
  background: var(--danger-dim);
  border: 1px solid var(--danger-border);
  border-radius: var(--r-md);
  padding: 14px 16px;
}

.review-actions-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-lg);
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-actions-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.review-action-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

.review-action-card {
  flex: 1;
  min-width: 240px;
  background: var(--bg-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.review-action-card-icon { color: var(--text-secondary); }
.review-action-card-title { font-weight: 600; font-size: 13.5px; color: var(--text-primary); }
.review-action-card-desc { font-size: 11.5px; color: var(--text-secondary); line-height: 1.5; }
.review-action-card-btn { margin-top: 8px; }

/* ── Modais ────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(7, 8, 13, 0.82);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 0.15s ease;
}
.modal-backdrop[hidden] { display: none; }

.modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  max-height: 90dvh;
  overflow: hidden;
  animation: slideUp 0.2s ease;
}

.modal--sm  { width: 100%; max-width: 480px; }
.modal--md  { width: 100%; max-width: 580px; }
.modal--lg  { width: 100%; max-width: 720px; }
.modal--preview { width: 100%; max-width: 900px; }

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}
.modal-header--danger { background: var(--danger-dim); border-color: var(--danger-border); }
.modal-header-icon { color: var(--danger); }
.modal-header-actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }

.modal-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  flex: 1;
}

.modal-close {
  color: var(--text-tertiary);
  padding: 4px;
  border-radius: var(--r-sm);
  transition: color var(--t-fast), background var(--t-fast);
  flex-shrink: 0;
}
.modal-close:hover { color: var(--text-primary); background: var(--bg-overlay); }

.modal-body {
  padding: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-body--preview { padding: 0; gap: 0; }

.modal-footer {
  padding: 14px 22px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.modal-actions-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Projects list */
.projects-list { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }

.project-list-item {
  background: var(--bg-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-md);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color var(--t-base);
}
.project-list-item:hover { border-color: var(--border-default); }
.project-list-item.active { border-color: var(--accent-border); background: var(--accent-dim); }

.project-list-icon { color: var(--text-tertiary); flex-shrink: 0; }
.project-list-item.active .project-list-icon { color: var(--accent); }
.project-list-info { flex: 1; min-width: 0; }
.project-list-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-list-meta { font-size: 11px; color: var(--text-tertiary); }
.project-list-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.project-list-btn { color: var(--text-tertiary); padding: 5px; border-radius: var(--r-xs); transition: color var(--t-fast), background var(--t-fast); }
.project-list-btn:hover { color: var(--text-primary); background: var(--bg-overlay); }
.project-list-btn.danger:hover { color: var(--danger); }

/* API Config modal */
.api-provider-block {
  background: var(--bg-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-md);
  overflow: hidden;
}
.api-provider-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-subtle);
}
.api-provider-name { font-size: 13px; font-weight: 600; color: var(--text-primary); flex: 1; }
.api-provider-status { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: var(--r-pill); }
.api-provider-status.ok { background: var(--success-dim); color: var(--success); }
.api-provider-status.empty { background: var(--bg-overlay); color: var(--text-tertiary); }
.api-provider-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.api-provider-models { font-size: 11px; color: var(--text-tertiary); }
.api-provider-link { font-size: 11px; color: var(--accent2); }
.api-key-row { display: flex; gap: 8px; }
.api-key-row .field-input { font-family: var(--font-mono); font-size: 12px; }

/* Gen Modal */
.gen-model-badge {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.gen-progress-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.gen-progress-bar {
  flex: 1;
  height: 4px;
  background: var(--bg-overlay);
  border-radius: var(--r-pill);
  overflow: hidden;
}
.gen-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-radius: var(--r-pill);
  transition: width 0.4s ease;
}
.gen-progress-pct { font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); }

.gen-steps-list { display: flex; flex-direction: column; gap: 8px; }
.gen-step-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--r-sm);
  background: var(--bg-raised);
}
.gen-step-icon { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
.gen-step-icon.spin { animation: spin 1s linear infinite; color: var(--accent); }
.gen-step-icon.done { color: var(--success); }
.gen-step-icon.wait { color: var(--text-disabled); }
.gen-step-icon.err  { color: var(--danger); }
.gen-step-label { font-size: 12.5px; color: var(--text-secondary); flex: 1; }
.gen-step-item.active .gen-step-label { color: var(--text-primary); }
.gen-step-time { font-family: var(--font-mono); font-size: 10px; color: var(--text-disabled); }
.gen-hint {
  font-size: 11px;
  color: var(--text-tertiary);
  text-align: center;
  margin-top: 16px;
}

/* Error Modal */
.error-meta { font-size: 11.5px; color: var(--text-tertiary); }
.error-message {
  background: rgba(255,86,86,0.05);
  border: 1px solid var(--danger-border);
  border-radius: var(--r-sm);
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--danger);
  line-height: 1.55;
  word-break: break-word;
}
.error-cause { font-size: 12.5px; color: var(--text-secondary); line-height: 1.6; }
.error-actions { display: flex; gap: 8px; flex-wrap: wrap; }

/* Preview */
.preview-iframe {
  width: 100%;
  height: 600px;
  border: none;
  display: block;
  background: #fff;
}
.preview-disclaimer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  font-size: 11.5px;
  color: var(--text-tertiary);
  border-top: 1px solid var(--border-subtle);
}
.preview-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--border-subtle);
}

/* Art Result Modal */
#art-result-body { gap: 0; padding: 0; }

/* ── Toast ─────────────────────────────────────────────────── */
.toast {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: var(--bg-overlay);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-pill);
  padding: 10px 18px;
  font-size: 13px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-md);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--t-base), transform var(--t-base);
  z-index: 2000;
  white-space: nowrap;
}
.toast.visible { opacity: 1; transform: translateX(-50%) translateY(0); }
.toast.success { border-color: var(--accent-border); }
.toast.success i { color: var(--accent); }
.toast.error { border-color: var(--danger-border); }
.toast.error i { color: var(--danger); }
.toast.warning { border-color: var(--warning-border); }
.toast.warning i { color: var(--warning); }

/* ── Animações ─────────────────────────────────────────────── */
@keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin     { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse    { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes shimmer  {
  from { background-position: -400px 0; }
  to   { background-position: 400px 0; }
}

.shimmer {
  background: linear-gradient(90deg, var(--bg-raised) 25%, var(--bg-overlay) 50%, var(--bg-raised) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite;
}

/* ── Utilitários ───────────────────────────────────────────── */
.text-accent  { color: var(--accent); }
.text-accent2 { color: var(--accent2); }
.text-muted   { color: var(--text-secondary); }
.text-dim     { color: var(--text-tertiary); }
.text-mono    { font-family: var(--font-mono); }
.text-display { font-family: var(--font-display); }
.flex         { display: flex; }
.flex-col     { flex-direction: column; }
.items-center { align-items: center; }
.gap-8        { gap: 8px; }
.gap-12       { gap: 12px; }
.w-full       { width: 100%; }
.mt-4         { margin-top: 4px; }
.mt-8         { margin-top: 8px; }
.mt-16        { margin-top: 16px; }
.hidden       { display: none !important; }
```

---

## FASE 3 — APLICAÇÃO

---

### `assets/app.js`

```javascript
/* ============================================================
   LandingAI v3 — Aplicação Completa
   Adsgator · Sistema Interno
   ============================================================ */

'use strict';

/* ── Constantes ─────────────────────────────────────────────── */

const STORAGE_KEYS = {
  PROJECTS: 'landingai_v3_projects',
  ACTIVE:   'landingai_v3_active',
  API_KEYS: 'landingai_v3_apikeys',
  SETTINGS: 'landingai_v3_settings',
};

const STORAGE_LIMIT_BYTES = 4 * 1024 * 1024; // 4MB — alerta antes de 5MB

const AI_MODELS = {
  /* ── GEMINI ── */
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash',
    provider: 'gemini', tier: 'free', speed: 'fast',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent',
    maxTokens: 65536, temp: 0.65,
  },
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro',
    provider: 'gemini', tier: 'paid', speed: 'medium',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-05-06:generateContent',
    maxTokens: 65536, temp: 0.65,
  },
  /* ── CLAUDE ── */
  'claude-sonnet': {
    id: 'claude-sonnet', label: 'Claude Sonnet 4',
    provider: 'claude', tier: 'paid', speed: 'medium',
    modelId: 'claude-sonnet-4-6',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 16000, temp: 0.7,
  },
  'claude-opus': {
    id: 'claude-opus', label: 'Claude Opus 4',
    provider: 'claude', tier: 'paid', speed: 'slow',
    modelId: 'claude-opus-4-6',
    endpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 32000, temp: 0.65,
  },
  /* ── GROK ── */
  'grok-3': {
    id: 'grok-3', label: 'Grok 3',
    provider: 'grok', tier: 'free', speed: 'fast',
    modelId: 'grok-3',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    maxTokens: 32000, temp: 0.7,
  },
  'grok-3-mini': {
    id: 'grok-3-mini', label: 'Grok 3 Mini',
    provider: 'grok', tier: 'free', speed: 'fast',
    modelId: 'grok-3-mini',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    maxTokens: 16000, temp: 0.7,
  },
  /* ── MISTRAL ── */
  'mistral-medium': {
    id: 'mistral-medium', label: 'Mistral Medium 3',
    provider: 'mistral', tier: 'free', speed: 'fast',
    modelId: 'mistral-medium-3',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    maxTokens: 32000, temp: 0.65,
  },
  'mistral-large': {
    id: 'mistral-large', label: 'Mistral Large 2',
    provider: 'mistral', tier: 'paid', speed: 'medium',
    modelId: 'mistral-large-2407',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    maxTokens: 32000, temp: 0.6,
  },
};

const MODEL_GROUPS = [
  { label: 'GEMINI (Google)', ids: ['gemini-2.5-flash', 'gemini-2.5-pro'] },
  { label: 'CLAUDE (Anthropic)', ids: ['claude-sonnet', 'claude-opus'] },
  { label: 'GROK (xAI)', ids: ['grok-3', 'grok-3-mini'] },
  { label: 'MISTRAL', ids: ['mistral-medium', 'mistral-large'] },
];

const API_PROVIDERS = [
  {
    id: 'gemini', label: 'Gemini (Google)',
    models: 'Flash (grátis), Pro (pago)',
    link: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'claude', label: 'Claude (Anthropic)',
    models: 'Sonnet (pago), Opus (pago)',
    link: 'https://console.anthropic.com',
  },
  {
    id: 'grok', label: 'Grok (xAI)',
    models: 'Grok 3 (grátis), Grok 3 Mini (grátis)',
    link: 'https://console.x.ai',
  },
  {
    id: 'mistral', label: 'Mistral',
    models: 'Medium 3 (grátis), Large 2 (pago)',
    link: 'https://console.mistral.ai',
  },
];

const ERROR_MAP = {
  'API key not valid':       { cause: 'Chave de API inválida ou expirada.', tip: 'Verifique sua chave em Configurações > Config. API.' },
  'QUOTA_EXCEEDED':          { cause: 'Limite de uso da API atingido.', tip: 'Aguarde ou use outro modelo.' },
  'fetch failed':            { cause: 'Sem conexão ou servidor offline.', tip: 'Verifique sua conexão e tente novamente.' },
  'Failed to fetch':         { cause: 'Sem conexão ou bloqueio de CORS.', tip: 'Verifique sua conexão e tente novamente.' },
  'NetworkError':            { cause: 'Erro de rede.', tip: 'Verifique sua conexão e tente novamente.' },
  'timeout':                 { cause: 'A requisição demorou mais de 120s.', tip: 'Use um modelo mais rápido (Flash) ou tente novamente.' },
  'response too short':      { cause: 'A IA retornou uma resposta incompleta.', tip: 'Tente novamente — pode ser instabilidade momentânea.' },
  'invalid_api_key':         { cause: 'Chave de API inválida.', tip: 'Verifique sua chave em Configurações > Config. API.' },
  'overloaded':              { cause: 'Servidor da IA sobrecarregado.', tip: 'Aguarde alguns segundos e tente novamente.' },
  'rate_limit':              { cause: 'Muitas requisições em pouco tempo.', tip: 'Aguarde 1 minuto e tente novamente.' },
};

const STEPS = [
  { id: 1, name: 'Identificação',    sub: 'Nome, nicho e tipo de projeto' },
  { id: 2, name: 'Contato',          sub: 'WhatsApp, e-mail, horários, GTM' },
  { id: 3, name: 'Redes Sociais',    sub: 'Instagram, TikTok, YouTube' },
  { id: 4, name: 'Localização',      sub: 'Modalidade, endereço, região' },
  { id: 5, name: 'Serviços',         sub: 'O que é vendido e como é contratado' },
  { id: 6, name: 'Público',          sub: 'Para quem é e qual é a dor' },
  { id: 7, name: 'Diferenciais',     sub: 'O que torna único + prova social' },
  { id: 8, name: 'Direção Textual',  sub: 'Copy, tone of voice, restrições' },
];

const CRITICAL_FIELDS = {
  1: ['nome_cliente', 'tipo'],
  2: ['whatsapp'],
  4: ['modalidade'],
  5: ['servico_principal', 'servicos_descricao'],
  6: ['publico_primario', 'publico_dor'],
  7: ['diferencial'],
  8: ['estilo_desejado'],
};

const GENERIC_CHECKS = [
  {
    field: 'publico_primario', minLen: 35,
    terms: ['homens', 'mulheres', 'pessoas', 'todos', 'qualquer', 'adultos'],
    msg: 'Público muito genérico. Especifique: idade, profissão, contexto de vida ou situação específica.',
  },
  {
    field: 'diferencial',
    terms: ['qualidade', 'excelência', 'comprometimento', 'dedicação', 'atendimento personalizado', 'inovador'],
    msg: 'Diferencial genérico. Diga o que concretamente te diferencia — não o que qualquer profissional diria.',
  },
  {
    field: 'frase_impacto',
    terms: ['transforme', 'revolucionário', 'definitivo', 'solução completa', 'do seu jeito'],
    msg: 'Frase usa clichês de marketing. Reescreva com uma dor real ou um resultado concreto.',
  },
];

const TOOLTIPS = {
  nome_cliente:         'Nome completo como aparecerá no site. Ex: "Beatriz Mattos" ou "Clínica Vida Plena".',
  nome_marca:           'Nome comercial ou da marca, se diferente do nome pessoal. Pode ser igual ao nome do cliente.',
  segmento:             'Área de atuação detalhada. Ex: "Adestramento comportamental canino" — não apenas "pet".',
  tipo:                 'Classifica o tipo de negócio. Impacta a estrutura da landing page gerada.',
  whatsapp:             'Somente dígitos, com DDI e DDD. Ex: 5511999999999. Gerado automaticamente no link wa.me.',
  email:                'E-mail de contato exibido no site ou formulário. Pode ser diferente do e-mail de trabalho.',
  horarios:             'Quando o cliente pode ser contactado. Ex: "Segunda a sexta, 9h às 18h".',
  gtm_id:               'ID do Google Tag Manager no formato GTM-XXXXXXX. Fornecido pelo gestor de tráfego.',
  instagram:            'Handle sem @. Ex: beatrizmattos.adestradora — será linkado diretamente no site.',
  modalidade:           'Define se o site terá seção de mapa/endereço (presencial) ou plataforma online.',
  endereco:             'Endereço completo com bairro, cidade e CEP. Inclua ponto de referência se útil.',
  exibir_localizacao:   'Nível de detalhe da localização exibida. "Só cidade" é mais seguro para clientes que atendem em casa.',
  servico_principal:    'O foco principal da campanha de tráfego. Uma linha. É o que a H1 vai espelhar.',
  servicos_descricao:   'Descreva cada serviço: o que é, como funciona, para quem é. Quanto mais detalhe, melhor a copy.',
  objetivo_conversao:   'Como o lead entra em contato. Define o CTA principal e o fluxo de conversão.',
  preco_exibir:         'Se exibir preço, a IA inclui a seção de planos. Só inclua se o cliente autorizou.',
  publico_primario:     'Perfil detalhado do cliente ideal: idade, profissão, situação de vida, contexto. Não genérico.',
  publico_dor:          'O problema real que faz o cliente pesquisar. Escreva como ele falaria — não em termos técnicos.',
  publico_resultado:    'O que ele imagina conquistar ao contratar. O "depois" que ele quer viver.',
  diferencial:          'O que concretamente diferencia esse profissional. Evite qualidade/excelência — diga fatos reais.',
  frase_impacto:        'Uma frase poderosa, direta, que captura a essência do serviço. Será usada na copy do hero.',
  google_nota:          'Nota atual no Google Business. Só inclui o bloco de reviews se ≥ 4.5 com ≥ 10 avaliações.',
  google_qtd:           'Número de avaliações reais. Mínimo de 10 para incluir o bloco de reviews no site.',
  estilo_desejado:      'Como o site deve ser percebido. Ex: "Sóbrio, técnico e confiante — próximo de Linear ou Stripe".',
  sensacao_visitante:   'O que o visitante deve sentir ao entrar no site. Ex: "Segurança imediata, que é a pessoa certa".',
  dominio:              'Domínio desejado para o site. Ex: beatrizmattos.com.br — confirmar disponibilidade.',
  cnpj:                 'CNPJ para exibir no rodapé. Obrigatório para algumas categorias regulamentadas (CRM, OAB etc.).',
  aviso_legal:          'Número de registro profissional ou aviso legal obrigatório. Ex: CRM 12345-SP.',
  restricoes:           'Termos, abordagens ou elementos que o cliente NÃO quer de forma alguma no site.',
  instrucoes_adicionais:'Qualquer informação extra que não coube nos campos anteriores. Campo livre.',
  briefing_bruto:       'Cole aqui o briefing exatamente como veio do cliente. A IA usa como fonte primária.',
  faq:                  'Perguntas frequentes reais. Se não tiver, a IA vai inferir baseado no nicho — mas é melhor fornecer.',
  historia:             'Opcional, mas poderosa. Uma história real que explica por que esse profissional faz o que faz.',
  oferta_especial:      'Qualquer condição especial: desconto, bônus, período de carência. Só inclua se autorizado.',
};

const REGRAS_FIXAS_ADSGATOR = `
## REGRAS FIXAS ADSGATOR

**DNA ADSGATOR — INEGOCIÁVEL EM COPY:**
- Intenção de Busca em Primeiro Lugar: a H1 justifica o clique no anúncio nos primeiros 3 segundos
- Primeira Pessoa Sempre: copy do profissional para o visitante — "eu", "meu", "com você" — nunca terceira pessoa
- Zero Institucional: proibido "inovador", "excelência", "missão", "visão", "somos apaixonados por"
- Comunicação Direta e Realista: sem promessas milagrosas, sem adjetivar o óbvio
- Tom Conversacional com Autoridade: especialista olho no olho, firmeza sem arrogância
- Foco na Ação: cada título, subtítulo e botão guia para o CTA — nenhum texto decorativo

**DNA ADSGATOR — INEGOCIÁVEL EM DESIGN:**
- Mobile First: começa em 375px — cada decisão de tipografia, espaçamento e hierarquia é tomada primeiro para mobile
- Full Viewport: seções que se beneficiam de ocupar o viewport completo devem fazê-lo — container é ferramenta, não prisão
- Footer com Identidade: não é afterthought — hierarquia tipográfica real, conexão visual com a landing, personalidade
- Logo Adsgator: sempre presente no footer com link para adsgator.com.br
- Ano dinâmico no footer: {new Date().getFullYear()}

**DNA ADSGATOR — INEGOCIÁVEL TÉCNICO:**
- Stack fixa: Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis + Web3Forms
- Deploy: Vercel (output: 'hybrid' se tiver API, 'static' se não tiver)
- Analytics: Vercel Analytics + Vercel Speed Insights (ambos obrigatórios)
- GTM: snippet no <head> E no <body> via is:inline
- LGPD: CookieBanner com Google Consent Mode v2
- WA Button: flutuante, oculto no hero, some no footer, rastreado
- Tokens: zero HEX hardcoded — todos via tokens Tailwind
- Animações: prefers-reduced-motion em todo GSAP
- Schema.org JSON-LD: LocalBusiness ou Person conforme nicho
- og-image: 1200×630px obrigatória

**CHECKLIST DE BLOCOS:**
- Cabeçalho: sempre
- Hero: sempre — H1 espelha Dor #1 do público primário
- O Serviço: sempre
- Diferenciais: sempre
- Como Funciona: se o processo reduz objeção de "como é isso?"
- Planos e Preços: somente se valores fornecidos e autorizados
- Depoimentos: somente se há depoimentos reais fornecidos
- Avaliações Google: somente se Google Business com ≥ 10 avaliações reais — nunca inventar nota
- Feed Instagram: somente se perfil ativo e relevante
- FAQ: somente se há objeções reais documentadas
- Localização + Mapa: somente se presencial com endereço autorizado
- CTA Final: sempre — antes do footer
- Rodapé: sempre

**PROMPTS PROIBIDOS:**
- "Saiba mais" / "Clique aqui" / "Entre em contato" / "Solicite um orçamento"
- CTAs que não dizem o que acontece ao clicar
- Qualquer H1 que não espelhe uma dor real de busca
- Copy na terceira pessoa
- Blocos de integração sem ativo confirmado
`;

const PROMPT_AUDITORIA = `
## PROMPT DE AUDITORIA PÓS-IMPLEMENTAÇÃO

Após o build, envie este prompt para a IA implementadora:

\`\`\`
Faça uma auditoria completa do projeto.
Para cada item: ✅ implementado | ⚠️ parcial (explique) | ❌ não implementado.

HEADER [ ] Some/reaparece com scroll [ ] Backdrop-blur após 80px [ ] Logo → raiz [ ] CTA no header desktop [ ] Testado 375px
WA FLUTUANTE [ ] Em todas as páginas [ ] Oculto no hero (IntersectionObserver) [ ] Some no footer [ ] aria-label [ ] data-tracking
LGPD [ ] CookieBanner funcional [ ] Google Consent Mode v2 [ ] Não bloqueia carregamento
ANALYTICS [ ] Vercel Analytics [ ] Speed Insights [ ] GTM head+body [ ] GTM via variável de ambiente
GIT/DEPLOY [ ] git init [ ] .gitignore [ ] .env.example [ ] Vercel CI/CD
RESPONSIVO [ ] Full-bleed onde deve [ ] 375px sem overflow [ ] Touch targets ≥44px [ ] Fonte mínima 16px mobile [ ] Hero 100svh mobile
FOOTER [ ] Identidade visual coerente [ ] Logo da marca [ ] Logo Adsgator [ ] Ano dinâmico [ ] Política de Privacidade
ACESSIBILIDADE [ ] Contraste WCAG AA [ ] focus-visible [ ] alt em imagens [ ] prefers-reduced-motion
PÁGINAS [ ] /links [ ] /politica-de-privacidade [ ] /404 [ ] sitemap.xml [ ] robots.txt
QUALIDADE [ ] Build sem erros [ ] Zero console.log prod [ ] Zero HEX hardcoded [ ] Lighthouse ≥90 mobile [ ] WA link testado [ ] Schema.org [ ] og-image 1200×630

Para cada ❌ ou ⚠️, descreva o que precisa ser corrigido.
\`\`\`
`;

/* ── Estado Default ─────────────────────────────────────────── */

function defaultBriefing() {
  return {
    nome_cliente: '', nome_marca: '', slug: '', segmento: '', tipo: '',
    whatsapp: '', email: '', horarios: '', gtm_id: '',
    instagram: '', tiktok: '', youtube: '', outras_redes: '',
    modalidade: '', endereco: '', exibir_localizacao: '', cidades_atendimento: '', plataforma_online: '',
    servicos_lista: '', servicos_descricao: '', servico_principal: '', objetivo_conversao: '', objetivo_outro: '',
    preco_exibir: '', preco_valor: '', preco_condicao: '', oferta_especial: '',
    publico_primario: '', publico_dor: '', publico_resultado: '', publico_secundario: '', faq: '',
    diferencial: '', historia: '', frase_impacto: '',
    depoimentos: '', depoimentos_formato: [], depoimentos_qtd: '',
    google_business: '', google_nota: '', google_qtd: '', casos_resultados: '',
    estilo_desejado: '', sensacao_visitante: '', restricoes: '', frase_tom: '',
    vocabulario_usa: '', vocabulario_nunca: '', briefing_bruto: '',
    instrucoes_adicionais: '',
    // Preenchidos na tela de arte (não nos steps)
    arte_referencias_pessoais: [], // [{link, gostei, adaptar}]
    arte_referencias_nicho: [],    // [{link, gostei, adaptar}]
    arte_cor_principal: '', arte_cor_secundaria: '',
    arte_logo: '', arte_fotos: '', arte_outros_assets: '',
    arte_tema: '', arte_intensidade: '', arte_menu_mobile: '',
    arte_footer_tom: '', arte_o_que_nao_quero: '', arte_referencia_marca: '',
    arte_ficha_aprovada: '', // JSON string da ficha aprovada
    // Meta
    dominio: '', cnpj: '', aviso_legal: '',
    integracoes: [], // ['maps','reviews','instagram','formulario','whatsapp','ligacao']
  };
}

function defaultProject(name) {
  return {
    id: crypto.randomUUID(),
    name: name || 'Novo Projeto',
    slug: '',
    status: 'rascunho',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    visitedSteps: [],
    briefing: defaultBriefing(),
    versions: [],
  };
}

/* ── App Object ─────────────────────────────────────────────── */

const App = {

  /* ── Estado ──────────────────────────────────────────── */
  state: {
    screen: 'intake',       // 'intake' | 'step' | 'art' | 'review'
    currentStep: 1,
    projects: {},
    activeId: null,
    apiKeys: { gemini: '', claude: '', grok: '', mistral: '' },
    selectedModel: 'gemini-2.5-flash',
    isGenerating: false,
    lastError: null,
    lastDocImpl: '',
    lastDoc1: '',
    artAnalyzed: false,
    intakeFiles: [],         // File[] de upload no intake
    artFiles: [],            // File[] de upload na arte
    notifPermission: 'default',
  },

  /* ── Alias ───────────────────────────────────────────── */
  get B() { return this.state.projects[this.state.activeId]?.briefing || defaultBriefing(); },
  get P() { return this.state.projects[this.state.activeId] || null; },

  /* ─────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────── */
  init() {
    this.loadStorage();
    this.requestNotificationPermission();
    this.renderApp();
    this.setupGlobalEvents();
    lucide.createIcons();
    this.updateSidebar();
    this.updateTopbar();
    this.renderScreen();
    this.checkStorageUsage();
  },

  renderApp() {
    // Render estático do HTML já está no index.html
    // Apenas monta as partes dinâmicas
    this.renderStepsNav();
    this.renderModelDropdown();
    this.renderApiModal();
  },

  /* ─────────────────────────────────────────────────────
     STORAGE
  ───────────────────────────────────────────────────── */
  loadStorage() {
    try {
      const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '{}');
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE);
      const apiKeys  = JSON.parse(localStorage.getItem(STORAGE_KEYS.API_KEYS) || '{}');
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');

      this.state.projects = projects;
      this.state.apiKeys = { gemini: '', claude: '', grok: '', mistral: '', ...apiKeys };
      this.state.selectedModel = settings.selectedModel || 'gemini-2.5-flash';

      // Verifica se activeId existe
      if (activeId && projects[activeId]) {
        this.state.activeId = activeId;
      } else {
        // Cria projeto padrão
        const p = defaultProject('Novo Projeto');
        this.state.projects[p.id] = p;
        this.state.activeId = p.id;
        this.saveStorage();
      }
    } catch (e) {
      console.error('[LandingAI] loadStorage erro:', e);
      const p = defaultProject('Novo Projeto');
      this.state.projects = { [p.id]: p };
      this.state.activeId = p.id;
    }
  },

  saveStorage() {
    try {
      if (this.P) {
        this.P.updatedAt = new Date().toISOString();
      }
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.state.projects));
      localStorage.setItem(STORAGE_KEYS.ACTIVE, this.state.activeId);
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(this.state.apiKeys));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ selectedModel: this.state.selectedModel }));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        this.showToast('⚠ Armazenamento cheio — delete versões antigas para continuar.', 'warning');
      } else {
        console.error('[LandingAI] saveStorage erro:', e);
      }
    }
  },

  checkStorageUsage() {
    let total = 0;
    for (const k of Object.values(STORAGE_KEYS)) {
      const v = localStorage.getItem(k) || '';
      total += new Blob([v]).size;
    }
    if (total > STORAGE_LIMIT_BYTES) {
      this.showToast(`⚠ Armazenamento em ${Math.round(total/1024)}KB — próximo do limite.`, 'warning');
    }
  },

  autosave() {
    clearTimeout(this._saveTimer);
    this.showSaving();
    this._saveTimer = setTimeout(() => {
      this.saveStorage();
      this.showSaved();
      this.updateSidebar();
    }, 1500);
  },

  showSaving() {
    const el = document.getElementById('sidebar-save-indicator');
    if (!el) return;
    el.className = 'save-indicator saving';
    el.querySelector('span').textContent = 'Salvando...';
  },

  showSaved() {
    const el = document.getElementById('sidebar-save-indicator');
    if (!el) return;
    el.className = 'save-indicator saved';
    el.querySelector('span').textContent = 'Salvo';
  },

  /* ─────────────────────────────────────────────────────
     PROJETOS
  ───────────────────────────────────────────────────── */
  createProject() {
    const p = defaultProject('Novo Projeto');
    this.state.projects[p.id] = p;
    this.state.activeId = p.id;
    this.state.screen = 'intake';
    this.state.currentStep = 1;
    this.saveStorage();
    this.closeModal('modal-projects');
    this.updateSidebar();
    this.renderScreen();
    this.showToast('Projeto criado', 'success');
  },

  loadProject(id) {
    if (!this.state.projects[id]) return;
    this.state.activeId = id;
    this.state.screen = 'intake';
    this.state.currentStep = 1;
    this.saveStorage();
    this.closeModal('modal-projects');
    this.updateSidebar();
    this.renderScreen();
  },

  cloneProject(id) {
    const src = this.state.projects[id];
    if (!src) return;
    const clone = JSON.parse(JSON.stringify(src));
    clone.id = crypto.randomUUID();
    clone.name = src.name + ' (cópia)';
    clone.status = 'rascunho';
    clone.createdAt = new Date().toISOString();
    clone.updatedAt = new Date().toISOString();
    clone.versions = [];
    this.state.projects[clone.id] = clone;
    this.saveStorage();
    this.renderProjectsList();
    this.showToast('Projeto clonado', 'success');
  },

  deleteProject(id) {
    if (!this.state.projects[id]) return;
    if (!confirm(`Excluir "${this.state.projects[id].name}"? Esta ação não pode ser desfeita.`)) return;
    delete this.state.projects[id];

    // Se era o ativo, seleciona outro
    if (this.state.activeId === id) {
      const ids = Object.keys(this.state.projects);
      if (ids.length === 0) {
        const p = defaultProject('Novo Projeto');
        this.state.projects[p.id] = p;
        this.state.activeId = p.id;
      } else {
        this.state.activeId = ids[0];
      }
    }
    this.saveStorage();
    this.renderProjectsList();
    this.updateSidebar();
  },

  renameProject(id, name) {
    if (!this.state.projects[id]) return;
    this.state.projects[id].name = name;
    this.saveStorage();
    this.updateSidebar();
  },

  exportProject() {
    if (!this.P) return;
    const data = JSON.stringify(this.P, null, 2);
    this.downloadText(data, `projeto-${this.P.slug || 'landingai'}.json`, 'application/json');
    this.showToast('Projeto exportado', 'success');
  },

  importProject(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const p = JSON.parse(e.target.result);
        if (!p.id || !p.briefing) throw new Error('Arquivo inválido');
        p.id = crypto.randomUUID(); // Novo ID para evitar conflito
        p.name = p.name + ' (importado)';
        this.state.projects[p.id] = p;
        this.saveStorage();
        this.renderProjectsList();
        this.showToast('Projeto importado', 'success');
      } catch (err) {
        this.showToast('Erro ao importar: arquivo inválido', 'error');
      }
    };
    reader.readAsText(file);
  },

  saveVersion(doc1, docImpl, model) {
    if (!this.P) return;
    const versions = this.P.versions || [];
    versions.push({
      v: versions.length + 1,
      savedAt: new Date().toISOString(),
      model,
      // Salva apenas os primeiros 50KB de cada doc para não estourar localStorage
      doc1: doc1.substring(0, 50000),
      docImpl: docImpl ? docImpl.substring(0, 50000) : '',
    });
    // Mantém apenas as últimas 5 versões
    if (versions.length > 5) versions.splice(0, versions.length - 5);
    this.P.versions = versions;
    this.saveStorage();
  },

  /* ─────────────────────────────────────────────────────
     BRIEFING FIELDS
  ───────────────────────────────────────────────────── */
  setField(field, value) {
    if (!this.P) return;
    this.P.briefing[field] = value;

    // Efeitos especiais por campo
    if (field === 'nome_cliente') {
      const slug = value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      this.P.briefing.slug = slug;
      this.P.name = value || 'Novo Projeto';
      this.updateSidebar();
    }

    if (field === 'segmento') this.updateSidebar();
    if (field === 'whatsapp') this.P.briefing.whatsapp = value.replace(/\D/g, '');

    this.autosave();
    this.updateTopbarScore();
  },

  toggleArray(field, value) {
    if (!this.P) return;
    const arr = this.P.briefing[field] || [];
    const idx = arr.indexOf(value);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(value);
    this.P.briefing[field] = arr;
    this.autosave();
  },

  /* ─────────────────────────────────────────────────────
     VALIDAÇÃO
  ───────────────────────────────────────────────────── */
  getStepScore(step) {
    const B = this.B;
    const fields = this.getStepFields(step);
    if (!fields.length) return 100;
    const filled = fields.filter(f => {
      const v = B[f];
      return v && v.toString().trim().length > 0;
    });
    let score = (filled.length / fields.length) * 100;
    // Penalidade por campos genéricos
    const warns = this.getStepWarnings(step);
    score = Math.max(0, score - warns.length * 8);
    return Math.round(score);
  },

  getStepFields(step) {
    const maps = {
      1: ['nome_cliente', 'nome_marca', 'segmento', 'tipo'],
      2: ['whatsapp', 'email', 'horarios', 'gtm_id'],
      3: ['instagram', 'tiktok', 'youtube'],
      4: ['modalidade', 'endereco', 'cidades_atendimento'],
      5: ['servicos_lista', 'servicos_descricao', 'servico_principal', 'objetivo_conversao'],
      6: ['publico_primario', 'publico_dor', 'publico_resultado', 'faq'],
      7: ['diferencial', 'historia', 'frase_impacto', 'depoimentos', 'google_business'],
      8: ['estilo_desejado', 'sensacao_visitante', 'vocabulario_usa', 'restricoes', 'briefing_bruto'],
    };
    return maps[step] || [];
  },

  getStepWarnings(step) {
    const B = this.B;
    const warns = [];
    GENERIC_CHECKS.forEach(check => {
      const v = (B[check.field] || '').toLowerCase().trim();
      if (!v) return;
      const tooShort = check.minLen && v.length < check.minLen;
      const hasGenericTerm = check.terms && check.terms.some(t => v.includes(t));
      if (tooShort || hasGenericTerm) {
        warns.push({ field: check.field, msg: check.msg });
      }
    });
    return warns.filter(w => this.getStepFields(step).includes(w.field));
  },

  getAllWarnings() {
    const warns = [];
    for (let s = 1; s <= 8; s++) warns.push(...this.getStepWarnings(s));
    return warns;
  },

  getMissingCritical() {
    const B = this.B;
    const missing = [];
    for (const [step, fields] of Object.entries(CRITICAL_FIELDS)) {
      fields.forEach(f => {
        const v = B[f];
        if (!v || !v.toString().trim()) {
          missing.push({ field: f, step: parseInt(step) });
        }
      });
    }
    return missing;
  },

  getGlobalScore() {
    let total = 0;
    for (let s = 1; s <= 8; s++) total += this.getStepScore(s);
    return Math.round(total / 8);
  },

  getScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  },

  getScoreColor(score) {
    if (score >= 80) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  },

  canGenerate() {
    const missing = this.getMissingCritical();
    const hasKey = Object.values(this.state.apiKeys).some(k => k.trim().length > 10);
    const score = this.getGlobalScore();
    return missing.length === 0 && hasKey && score >= 55;
  },

  /* ─────────────────────────────────────────────────────
     SIDEBAR E TOPBAR
  ───────────────────────────────────────────────────── */
  updateSidebar() {
    const B = this.B;
    const P = this.P;
    if (!P) return;

    // Projeto ativo
    document.getElementById('sidebar-project-name').textContent = P.name || 'Sem nome';
    document.getElementById('sidebar-project-segment').textContent = B.segmento || '—';

    // Score
    const score = this.getGlobalScore();
    document.getElementById('sidebar-score-fill').style.width = score + '%';
    document.getElementById('sidebar-score-label').textContent = score + '%';

    // API status
    const configured = API_PROVIDERS.filter(p => this.state.apiKeys[p.id]?.trim().length > 10);
    const dot = document.getElementById('sidebar-api-dot');
    const label = document.getElementById('sidebar-api-label');
    if (configured.length === 0) {
      dot.className = 'status-dot';
      label.textContent = 'Sem API';
    } else if (configured.length === API_PROVIDERS.length) {
      dot.className = 'status-dot ok';
      label.textContent = 'Todas configuradas';
    } else {
      dot.className = 'status-dot partial';
      label.textContent = `${configured.length}/${API_PROVIDERS.length} APIs`;
    }

    // Steps nav
    this.renderStepsNav();
  },

  updateTopbar() {
    const screen = this.state.screen;
    const step = this.state.currentStep;
    let title, sub;

    if (screen === 'intake') {
      title = 'Intake Inteligente';
      sub = 'Cole o briefing do cliente — a IA preenche tudo para você revisar';
    } else if (screen === 'art') {
      title = 'Direção de Arte';
      sub = 'Defina referências visuais e ativos — a IA monta a ficha de direção';
    } else if (screen === 'review') {
      title = 'Revisão e Geração';
      sub = 'Revise o score e gere o documento final';
    } else if (screen === 'step') {
      const s = STEPS.find(x => x.id === step);
      title = s ? s.name : '';
      sub = s ? s.sub : '';
    }

    document.getElementById('topbar-title').textContent = title;
    document.getElementById('topbar-subtitle').textContent = sub;
    this.updateTopbarScore();
    this.updateProgress();
  },

  updateTopbarScore() {
    const wrap = document.getElementById('topbar-score');
    const label = document.getElementById('topbar-score-label');
    if (this.state.screen === 'step') {
      const score = this.getStepScore(this.state.currentStep);
      const cls = this.getScoreClass(score);
      wrap.style.display = '';
      label.className = `score-badge ${cls}`;
      label.textContent = score + '%';
    } else {
      wrap.style.display = 'none';
    }
  },

  updateProgress() {
    const fill = document.getElementById('progress-fill');
    let pct = 0;
    if (this.state.screen === 'intake') pct = 0;
    else if (this.state.screen === 'step') pct = ((this.state.currentStep - 1) / 10) * 100;
    else if (this.state.screen === 'art') pct = 85;
    else if (this.state.screen === 'review') pct = 100;
    fill.style.width = pct + '%';
    fill.parentElement.setAttribute('aria-valuenow', pct);
  },

  renderStepsNav() {
    const nav = document.getElementById('steps-nav');
    if (!nav) return;
    nav.innerHTML = STEPS.map(s => {
      const score = this.getStepScore(s.id);
      const visited = this.P?.visitedSteps?.includes(s.id);
      const isActive = this.state.screen === 'step' && this.state.currentStep === s.id;
      const isDone = visited && score >= 80;
      const hasErr = visited && score < 50;
      let cls = 'step-nav-item';
      if (isActive) cls += ' active';
      if (isDone) cls += ' done';
      if (hasErr) cls += ' has-error';

      let dotContent = `<span class="step-dot-inner">${s.id}</span>`;
      if (isDone) dotContent = `<i data-lucide="check" style="width:10px;height:10px;color:var(--accent-text)"></i>`;
      if (hasErr) dotContent = `<i data-lucide="x" style="width:10px;height:10px"></i>`;

      return `
        <button class="${cls}" role="listitem" data-step="${s.id}" aria-label="${s.name}" aria-current="${isActive ? 'step' : 'false'}">
          <span class="step-dot">${dotContent}</span>
          <span class="step-label">${s.name}</span>
        </button>
      `;
    }).join('');
    lucide.createIcons({ nodes: [nav] });

    // Events
    nav.querySelectorAll('[data-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.goToStep(parseInt(btn.dataset.step));
      });
    });

    // Art & Review
    const artBtn = document.getElementById('btn-goto-art');
    const revBtn = document.getElementById('btn-goto-review');
    if (artBtn) {
      artBtn.className = 'step-nav-item step-art' + (this.state.screen === 'art' ? ' active' : '');
      artBtn.onclick = () => this.goToScreen('art');
    }
    if (revBtn) {
      revBtn.className = 'step-nav-item step-review' + (this.state.screen === 'review' ? ' active' : '');
      revBtn.onclick = () => this.goToScreen('review');
    }
  },

  /* ─────────────────────────────────────────────────────
     NAVEGAÇÃO
  ───────────────────────────────────────────────────── */
  goToStep(n) {
    this.state.screen = 'step';
    this.state.currentStep = n;
    if (this.P && !this.P.visitedSteps.includes(n)) {
      this.P.visitedSteps.push(n);
    }
    this.updateTopbar();
    this.renderStepsNav();
    this.renderScreen();
    this.renderBottombar();
  },

  goToScreen(s) {
    this.state.screen = s;
    this.updateTopbar();
    this.renderStepsNav();
    this.renderScreen();
    this.renderBottombar();
  },

  goNext() {
    if (this.state.screen === 'intake') { this.goToStep(1); return; }
    if (this.state.screen === 'step') {
      if (this.state.currentStep < 8) { this.goToStep(this.state.currentStep + 1); return; }
      this.goToScreen('art'); return;
    }
    if (this.state.screen === 'art') { this.goToScreen('review'); return; }
  },

  goPrev() {
    if (this.state.screen === 'step') {
      if (this.state.currentStep > 1) { this.goToStep(this.state.currentStep - 1); return; }
      this.goToScreen('intake'); return;
    }
    if (this.state.screen === 'art') { this.goToStep(8); return; }
    if (this.state.screen === 'review') { this.goToScreen('art'); return; }
  },

  /* ─────────────────────────────────────────────────────
     RENDER SCREENS
  ───────────────────────────────────────────────────── */
  renderScreen() {
    const container = document.getElementById('screen-content');
    if (!this.state.screen) return;

    switch (this.state.screen) {
      case 'intake': container.innerHTML = this.buildIntakeScreen(); break;
      case 'step':   container.innerHTML = this.buildStepScreen(this.state.currentStep); break;
      case 'art':    container.innerHTML = this.buildArtScreen(); break;
      case 'review': container.innerHTML = this.buildReviewScreen(); break;
    }

    lucide.createIcons({ nodes: [container] });
    this.bindScreenEvents(container);
    this.renderBottombar();
    // Scroll to top
    container.scrollTo(0, 0);
  },

  bindScreenEvents(container) {
    // Inputs text/textarea
    container.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', e => this.setField(el.dataset.field, el.value));
      el.addEventListener('change', e => this.setField(el.dataset.field, el.value));
      // Restaura valor salvo
      const saved = this.B[el.dataset.field];
      if (saved !== undefined && saved !== null && el.value === '') {
        if (el.type === 'color') el.value = saved || '#000000';
        else el.value = saved;
      }
    });

    // Chips
    container.querySelectorAll('[data-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const field = chip.dataset.field;
        const value = chip.dataset.chip;
        const multi = chip.dataset.multi === 'true';
        if (multi) {
          this.toggleArray(field, value);
          chip.classList.toggle('on');
        } else {
          // Radio-style
          container.querySelectorAll(`[data-field="${field}"][data-chip]`).forEach(c => c.classList.remove('on', 'on-accent'));
          this.setField(field, value);
          chip.classList.add('on');
        }
      });
      // Marca estado atual
      const B = this.B;
      const field = chip.dataset.field;
      const value = chip.dataset.chip;
      const multi = chip.dataset.multi === 'true';
      if (multi) {
        const arr = B[field] || [];
        if (arr.includes(value)) chip.classList.add('on');
      } else {
        if (B[field] === value) chip.classList.add('on');
      }
    });

    // Sel-cards
    container.querySelectorAll('[data-selcard]').forEach(card => {
      card.addEventListener('click', () => {
        const field = card.dataset.field;
        const value = card.dataset.selcard;
        container.querySelectorAll(`[data-field-group="${field}"] [data-selcard]`).forEach(c => c.classList.remove('on'));
        this.setField(field, value);
        card.classList.add('on');
      });
      if (this.B[card.dataset.field] === card.dataset.selcard) card.classList.add('on');
    });

    // WA preview
    const wInput = container.querySelector('[data-field="whatsapp"]');
    const wPreview = container.querySelector('#wa-preview');
    if (wInput && wPreview) {
      const update = () => {
        const v = (this.B.whatsapp || '').replace(/\D/g, '');
        wPreview.textContent = v ? `wa.me/${v}` : '—';
      };
      update();
      wInput.addEventListener('input', update);
    }

    // Upload intake
    const intakeUpload = container.querySelector('#intake-upload-zone');
    if (intakeUpload) this.setupUploadZone(intakeUpload, 'intake');

    // Analyze btn
    const analyzeBtn = container.querySelector('#btn-analyze');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.runIntakeAnalysis());
    }

    // Art uploads
    const artUpload = container.querySelector('#art-upload-zone');
    if (artUpload) this.setupUploadZone(artUpload, 'art');

    // Add reference btn
    container.querySelectorAll('[data-add-ref]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.addRef;
        this.addArtReference(type);
        this.renderScreen();
      });
    });

    // Analyze art btn
    const artAnalyzeBtn = container.querySelector('#btn-analyze-art');
    if (artAnalyzeBtn) {
      artAnalyzeBtn.addEventListener('click', () => this.runArtAnalysis());
    }

    // Review actions
    const doc1Btn = container.querySelector('#btn-download-doc1');
    if (doc1Btn) doc1Btn.addEventListener('click', () => this.downloadDoc1());

    const genBtn = container.querySelector('#btn-generate-docimpl');
    if (genBtn) genBtn.addEventListener('click', () => this.generateDocImpl());

    // Review step cards
    container.querySelectorAll('[data-goto-step]').forEach(card => {
      card.addEventListener('click', () => this.goToStep(parseInt(card.dataset.gotoStep)));
    });

    // Warning goto
    container.querySelectorAll('[data-goto-step-warn]').forEach(el => {
      el.addEventListener('click', () => this.goToStep(parseInt(el.dataset.gotoStepWarn)));
    });
  },

  /* ─────────────────────────────────────────────────────
     BUILD: INTAKE SCREEN
  ───────────────────────────────────────────────────── */
  buildIntakeScreen() {
    const B = this.B;
    return `
    <div class="intake-screen">

      <div class="intake-hero">
        <div class="intake-badge">
          <i data-lucide="zap" style="width:12px;height:12px"></i>
          v3 — Assistente Inteligente
        </div>
        <h2 class="intake-title">Cole o briefing.<br>A IA faz o resto.</h2>
        <p class="intake-subtitle">
          Cole o briefing preenchido pelo cliente, textos de WhatsApp, PDFs ou qualquer material coletado.
          A IA analisa, extrai e preenche todos os steps automaticamente.
          Você só revisa e ajusta.
        </p>
      </div>

      <!-- Box principal: Briefing -->
      <div class="intake-box">
        <div class="intake-box-header">
          <i data-lucide="file-text" class="intake-box-icon" style="width:18px;height:18px"></i>
          <span class="intake-box-title">Material do cliente</span>
          <span class="intake-box-desc">Cole texto, links ou suba arquivos</span>
        </div>
        <div class="intake-box-body">

          <div class="field-group">
            ${this.fieldLabel('briefing_bruto', 'Briefing e materiais do cliente', false)}
            <textarea
              class="field-textarea xtall"
              data-field="briefing_bruto"
              placeholder="Cole aqui tudo que você tem: briefing preenchido pelo cliente, textos de WhatsApp, observações da conversa, links relevantes, qualquer coisa.

A IA lê tudo e preenche os campos automaticamente. Quanto mais contexto, melhor o resultado."
            >${B.briefing_bruto || ''}</textarea>
            <span class="field-hint">Pode colar em formato bruto — não precisa formatar nada.</span>
          </div>

          <div class="intake-or">ou anexe arquivos</div>

          <div id="intake-upload-zone" class="upload-zone">
            <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.md,.txt">
            <i data-lucide="upload-cloud" class="upload-zone-icon"></i>
            <p class="upload-zone-label">Arraste ou clique para enviar</p>
            <p class="upload-zone-hint">PDF, imagens, .md, .txt — até 10MB por arquivo</p>
          </div>
          <div id="intake-files-list" class="upload-preview-list"></div>

          <div class="intake-actions">
            <div class="field-group" style="flex:1">
              ${this.fieldLabel('', 'Modelo para análise', false)}
              <div class="btn-model" style="width:fit-content;cursor:default">
                <i data-lucide="cpu" style="width:14px;height:14px"></i>
                <span id="intake-model-name">${AI_MODELS[this.state.selectedModel]?.label}</span>
              </div>
            </div>
            <button id="btn-analyze" class="btn-primary" style="align-self:flex-end">
              <i data-lucide="zap" style="width:16px;height:16px"></i>
              Analisar e Preencher Steps
            </button>
          </div>

        </div>
      </div>

      <!-- Hint SOP -->
      <div class="intake-sop-hint">
        <i data-lucide="info" class="intake-sop-hint-icon" style="width:15px;height:15px"></i>
        <p class="intake-sop-hint-text">
          <strong>Dica do SOP:</strong> Quanto mais contexto você colocar — briefing preenchido, conversa de WhatsApp, observações suas sobre tom de voz —
          mais precisa será a análise. Se quiser preencher manualmente, use a navegação no lado esquerdo para ir direto a qualquer step.
        </p>
      </div>

      <!-- Atalho: ir direto para step 1 -->
      <div style="text-align:center">
        <button class="btn-ghost btn-sm" onclick="App.goToStep(1)">
          <i data-lucide="list" style="width:14px;height:14px"></i>
          Preencher manualmente sem análise
        </button>
      </div>

    </div>
    `;
  },

  /* ─────────────────────────────────────────────────────
     BUILD: STEP SCREENS
  ───────────────────────────────────────────────────── */
  buildStepScreen(step) {
    const builders = {
      1: () => this.buildStep1(),
      2: () => this.buildStep2(),
      3: () => this.buildStep3(),
      4: () => this.buildStep4(),
      5: () => this.buildStep5(),
      6: () => this.buildStep6(),
      7: () => this.buildStep7(),
      8: () => this.buildStep8(),
    };
    return builders[step] ? `<div class="step-inner">${builders[step]()}</div>` : '';
  },

  fieldLabel(field, text, required = false, optional = false) {
    const req = required ? '<span class="field-required">*</span>' : '';
    const opt = optional ? '<span class="field-optional">(opcional)</span>' : '';
    const tip = TOOLTIPS[field] ? `
      <span class="field-tooltip">
        <i data-lucide="help-circle" class="field-tooltip-icon"></i>
        <span class="field-tooltip-bubble">${TOOLTIPS[field]}</span>
      </span>` : '';
    return `<label class="field-label">${text}${req}${opt}${tip}</label>`;
  },

  buildStep1() {
    const B = this.B;
    return `
      <p class="form-section-title">Identidade do Projeto</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('nome_cliente', 'Nome do cliente', true)}
          <input type="text" class="field-input" data-field="nome_cliente" placeholder="Ex: Beatriz Mattos" value="${B.nome_cliente || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('nome_marca', 'Nome da marca', false, true)}
          <input type="text" class="field-input" data-field="nome_marca" placeholder="Ex: BM Adestramento" value="${B.nome_marca || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('segmento', 'Segmento / profissão', true)}
        <input type="text" class="field-input" data-field="segmento" placeholder="Ex: Adestramento comportamental canino online" value="${B.segmento || ''}">
        <span class="field-hint">Seja específico — não "pet" mas "adestramento comportamental canino". Impacta toda a copy.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('tipo', 'Tipo de negócio', true)}
        <div class="sel-cards" data-field-group="tipo">
          ${[
            { v: 'servico', icon: 'briefcase', title: 'Serviço', desc: 'Adestramento, fisioterapia, advocacia, consultórios' },
            { v: 'mentoria', icon: 'graduation-cap', title: 'Mentoria', desc: 'Mentoria individual, em grupo, programa online' },
            { v: 'consultoria', icon: 'bar-chart', title: 'Consultoria', desc: 'B2B, consultoria especializada, assessoria' },
            { v: 'produto', icon: 'package', title: 'Produto', desc: 'Venda física, produto digital, ecommerce' },
            { v: 'saas', icon: 'monitor', title: 'SaaS / Digital', desc: 'Software, app, ferramenta, plataforma' },
          ].map(o => `
            <div class="sel-card" data-field="tipo" data-selcard="${o.v}" tabindex="0" role="option" aria-selected="${B.tipo === o.v}">
              <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
              <div>
                <div class="sel-card-title">${o.title}</div>
                <div class="sel-card-desc">${o.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Domínio e Legalização</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('dominio', 'Domínio desejado', true)}
          <input type="text" class="field-input" data-field="dominio" placeholder="Ex: beatrizmattos.com.br" value="${B.dominio || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('cnpj', 'CNPJ', false, true)}
          <input type="text" class="field-input" data-field="cnpj" placeholder="00.000.000/0000-00" value="${B.cnpj || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('aviso_legal', 'Aviso legal / registro profissional', false, true)}
        <input type="text" class="field-input" data-field="aviso_legal" placeholder="Ex: CRM 12345-SP · CRP 06/12345 · OAB/SP 123456" value="${B.aviso_legal || ''}">
      </div>
    `;
  },

  buildStep2() {
    const B = this.B;
    return `
      <p class="form-section-title">Contato e Conversão</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('whatsapp', 'WhatsApp', true)}
          <input type="text" class="field-input" data-field="whatsapp"
            placeholder="Ex: 5511999999999"
            value="${B.whatsapp || ''}"
            inputmode="numeric"
          >
          <div id="wa-preview" class="field-preview" style="display:${B.whatsapp ? '' : 'none'}">
            ${B.whatsapp ? `wa.me/${B.whatsapp}` : ''}
          </div>
          <span class="field-hint">Somente dígitos: DDI + DDD + número. O link wa.me é gerado automaticamente.</span>
        </div>
        <div class="field-group">
          ${this.fieldLabel('email', 'E-mail de contato', false, true)}
          <input type="email" class="field-input" data-field="email" placeholder="contato@email.com.br" value="${B.email || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('horarios', 'Dias e horários de atendimento', false, true)}
        <input type="text" class="field-input" data-field="horarios" placeholder="Ex: Segunda a sexta, 9h às 18h. Sábados mediante agendamento." value="${B.horarios || ''}">
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Rastreamento e Analytics</p>

      <div class="field-group">
        ${this.fieldLabel('gtm_id', 'ID do Google Tag Manager', false, true)}
        <input type="text" class="field-input" data-field="gtm_id" placeholder="Ex: GTM-XXXXXXX" value="${B.gtm_id || ''}">
        <span class="field-hint">Fornecido pelo gestor de tráfego. Formato: GTM- seguido de 7 caracteres.</span>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Objetivo de Conversão</p>

      <div class="field-group">
        ${this.fieldLabel('objetivo_conversao', 'Como o lead entra em contato?', true)}
        <div class="sel-cards" data-field-group="objetivo_conversao">
          ${[
            { v: 'whatsapp',   icon: 'message-circle', title: 'WhatsApp',          desc: 'Botão direto para conversa no WA. Mais rápido.' },
            { v: 'formulario', icon: 'mail',            title: 'Formulário',         desc: 'Formulário no site. Bom para triagem inicial.' },
            { v: 'agendamento',icon: 'calendar',        title: 'Agendamento Online', desc: 'Link para Calendly, Cal.com ou similar.' },
            { v: 'outro',      icon: 'link',            title: 'Outro',              desc: 'Especifique abaixo.' },
          ].map(o => `
            <div class="sel-card" data-field="objetivo_conversao" data-selcard="${o.v}" tabindex="0">
              <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
              <div>
                <div class="sel-card-title">${o.title}</div>
                <div class="sel-card-desc">${o.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${B.objetivo_conversao === 'outro' ? `
        <div class="field-group">
          ${this.fieldLabel('objetivo_outro', 'Descreva o objetivo de conversão', true)}
          <input type="text" class="field-input" data-field="objetivo_outro" placeholder="Ex: Link para checkout do Hotmart" value="${B.objetivo_outro || ''}">
        </div>
      ` : ''}
    `;
  },

  buildStep3() {
    const B = this.B;
    return `
      <p class="form-section-title">Redes Sociais e Presença Digital</p>
      <p class="form-section-title" style="font-size:12px;font-family:var(--font-body);font-weight:400;color:var(--text-secondary);border:none;padding:0;margin-top:-16px">
        Preencha apenas o que existe e está ativo. Cada rede ativada aqui pode virar um bloco ou integração no site.
      </p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('instagram', 'Instagram', false, true)}
          <input type="text" class="field-input" data-field="instagram" placeholder="@handle ou URL" value="${B.instagram || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('tiktok', 'TikTok', false, true)}
          <input type="text" class="field-input" data-field="tiktok" placeholder="@handle" value="${B.tiktok || ''}">
        </div>
      </div>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('youtube', 'YouTube', false, true)}
          <input type="text" class="field-input" data-field="youtube" placeholder="URL do canal" value="${B.youtube || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('outras_redes', 'Outras redes', false, true)}
          <input type="text" class="field-input" data-field="outras_redes" placeholder="LinkedIn, Pinterest, etc" value="${B.outras_redes || ''}">
        </div>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Integrações no Site</p>
      <p class="form-section-title" style="font-size:12px;font-family:var(--font-body);font-weight:400;color:var(--text-secondary);border:none;padding:0;margin-top:-16px">
        Marque somente o que foi confirmado. Ativo não confirmado = não inclui.
      </p>

      <div class="chip-group">
        ${[
          { v: 'maps',       label: 'Google Maps Embed' },
          { v: 'reviews',    label: 'Google Reviews Widget' },
          { v: 'instagram',  label: 'Feed do Instagram' },
          { v: 'formulario', label: 'Formulário de Contato' },
          { v: 'whatsapp',   label: 'WhatsApp Flutuante' },
          { v: 'ligacao',    label: 'Botão de Ligação' },
        ].map(o => `
          <button class="chip ${(B.integracoes || []).includes(o.v) ? 'on' : ''}"
            data-field="integracoes" data-chip="${o.v}" data-multi="true">
            ${o.label}
          </button>
        `).join('')}
      </div>
    `;
  },

  buildStep4() {
    const B = this.B;
    return `
      <p class="form-section-title">Localização e Modalidade</p>

      <div class="field-group">
        ${this.fieldLabel('modalidade', 'Como o cliente atende?', true)}
        <div class="chip-group">
          ${[
            { v: 'presencial', label: 'Presencial' },
            { v: 'online',     label: 'Online' },
            { v: 'hibrido',    label: 'Híbrido (presencial + online)' },
          ].map(o => `
            <button class="chip ${B.modalidade === o.v ? 'on' : ''}" data-field="modalidade" data-chip="${o.v}">
              ${o.label}
            </button>
          `).join('')}
        </div>
        <span class="field-hint">Define se o site terá seção de mapa (presencial) ou plataforma online.</span>
      </div>

      ${(B.modalidade === 'presencial' || B.modalidade === 'hibrido') ? `
        <div class="field-group">
          ${this.fieldLabel('endereco', 'Endereço completo', true)}
          <textarea class="field-textarea" data-field="endereco" placeholder="Rua, número, bairro, cidade, estado, CEP. Ponto de referência se útil.">${B.endereco || ''}</textarea>
        </div>

        <div class="field-group">
          ${this.fieldLabel('exibir_localizacao', 'Como exibir a localização no site?', true)}
          <div class="chip-group">
            ${[
              { v: 'completo', label: 'Endereço completo' },
              { v: 'cidade',   label: 'Só cidade / região' },
              { v: 'nao',      label: 'Não exibir' },
            ].map(o => `
              <button class="chip ${B.exibir_localizacao === o.v ? 'on' : ''}" data-field="exibir_localizacao" data-chip="${o.v}">
                ${o.label}
              </button>
            `).join('')}
          </div>
          <span class="field-hint">"Só cidade" é mais seguro para quem atende em casa.</span>
        </div>

        <div class="field-group">
          ${this.fieldLabel('cidades_atendimento', 'Cidades de atendimento presencial', false, true)}
          <input type="text" class="field-input" data-field="cidades_atendimento" placeholder="Ex: São Paulo, Guarulhos, Santo André" value="${B.cidades_atendimento || ''}">
        </div>
      ` : ''}

      ${(B.modalidade === 'online' || B.modalidade === 'hibrido') ? `
        <div class="field-group">
          ${this.fieldLabel('plataforma_online', 'Plataforma de atendimento online', false, true)}
          <input type="text" class="field-input" data-field="plataforma_online" placeholder="Ex: Google Meet, Zoom, Calendly" value="${B.plataforma_online || ''}">
        </div>
      ` : ''}
    `;
  },

  buildStep5() {
    const B = this.B;
    return `
      <p class="form-section-title">Serviços e Produto</p>

      <div class="field-group">
        ${this.fieldLabel('servico_principal', 'Serviço principal — foco da campanha', true)}
        <input type="text" class="field-input" data-field="servico_principal" placeholder="Ex: Mentoria de adestramento comportamental canino online" value="${B.servico_principal || ''}">
        <span class="field-hint">Em uma linha. É o que a H1 da landing page vai espelhar.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('servicos_lista', 'Lista de serviços / produtos', false, true)}
        <textarea class="field-textarea" data-field="servicos_lista" placeholder="Um por linha:
Mentoria individual semanal
Mentoria intensiva (2x por semana)
Consultoria pontual de diagnóstico">${B.servicos_lista || ''}</textarea>
      </div>

      <div class="field-group">
        ${this.fieldLabel('servicos_descricao', 'Descrição detalhada de cada serviço', true)}
        <textarea class="field-textarea tall" data-field="servicos_descricao"
          placeholder="Descreva cada serviço: o que é, como funciona, para quem é, o que inclui, duração.
Quanto mais detalhe aqui, mais precisa e autêntica será a copy gerada.

Não precisa ser bonito — escreva como falaria para um colega.">${B.servicos_descricao || ''}</textarea>
        <span class="field-hint">Mínimo recomendado: 100 caracteres por serviço. Sem detalhe, a copy fica genérica.</span>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Preço</p>

      <div class="field-group">
        ${this.fieldLabel('preco_exibir', 'Exibir preço no site?', true)}
        <div class="chip-group">
          <button class="chip ${B.preco_exibir === 'sim' ? 'on' : ''}" data-field="preco_exibir" data-chip="sim">Sim</button>
          <button class="chip ${B.preco_exibir === 'nao' ? 'on' : ''}" data-field="preco_exibir" data-chip="nao">Não</button>
        </div>
      </div>

      ${B.preco_exibir === 'sim' ? `
        <div class="form-row">
          <div class="field-group">
            ${this.fieldLabel('preco_valor', 'Valor e forma de cobrança', true)}
            <input type="text" class="field-input" data-field="preco_valor" placeholder="Ex: R$ 697/mês | R$ 350/sessão | R$ 1.200 pacote 4 sessões" value="${B.preco_valor || ''}">
          </div>
          <div class="field-group">
            ${this.fieldLabel('preco_condicao', 'Condição especial ou oferta', false, true)}
            <input type="text" class="field-input" data-field="preco_condicao" placeholder="Ex: 5% off no 1º mês via Pix" value="${B.preco_condicao || ''}">
          </div>
        </div>
        <div class="field-group">
          ${this.fieldLabel('oferta_especial', 'Oferta especial para destacar no site', false, true)}
          <input type="text" class="field-input" data-field="oferta_especial" placeholder="Ex: Vagas limitadas para o mês de maio" value="${B.oferta_especial || ''}">
        </div>
      ` : ''}
    `;
  },

  buildStep6() {
    const B = this.B;
    const warns = this.getStepWarnings(6);
    const pubWarn = warns.find(w => w.field === 'publico_primario');
    return `
      <p class="form-section-title">Público-Alvo</p>

      <div class="field-group">
        ${this.fieldLabel('publico_primario', 'Público primário — perfil do cliente ideal', true)}
        <textarea class="field-textarea" data-field="publico_primario"
          placeholder="Seja específico: idade, profissão, situação de vida, contexto, o que tem em comum.
Ex: Donos de cães com comportamentos agressivos ou destrutivos, 28–45 anos, que já tentaram adestramento tradicional sem resultado e buscam uma abordagem gentil e efetiva.">${B.publico_primario || ''}</textarea>
        ${pubWarn ? `<div class="field-warning"><i data-lucide="alert-triangle" style="width:13px;height:13px"></i>${pubWarn.msg}</div>` : ''}
        <span class="field-hint">Evite "homens", "mulheres", "pessoas". Seja específico — a H1 vai falar diretamente com essa pessoa.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('publico_dor', 'Principal dor / problema antes de contratar', true)}
        <textarea class="field-textarea" data-field="publico_dor"
          placeholder="O problema real que fez ele pesquisar no Google. Escreva como ele falaria — não em termos técnicos.
Ex: Meu cachorro pula em todo mundo, late sem parar e eu não consigo corrigir. Já tentei de tudo e não funciona.">${B.publico_dor || ''}</textarea>
        <span class="field-hint">Escreva na voz do cliente — não na voz do profissional. É isso que vai na H1.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('publico_resultado', 'O que ele quer alcançar — o "depois"', true)}
        <textarea class="field-textarea" data-field="publico_resultado"
          placeholder="O que ele imagina conquistar ao contratar. O resultado desejado em termos concretos.
Ex: Ter um cão equilibrado que não envergonhe em público, poder receber visitas e passear sem estresse.">${B.publico_resultado || ''}</textarea>
      </div>

      <div class="field-group">
        ${this.fieldLabel('publico_secundario', 'Público secundário', false, true)}
        <textarea class="field-textarea" data-field="publico_secundario"
          placeholder="Ex: Adestradores iniciantes buscando mentoria técnica para atender com mais segurança.">${B.publico_secundario || ''}</textarea>
      </div>

      <div class="form-divider"></div>

      <div class="field-group">
        ${this.fieldLabel('faq', 'Perguntas frequentes dos clientes', false, true)}
        <textarea class="field-textarea tall" data-field="faq"
          placeholder="Liste as dúvidas reais que seus clientes têm. Formato:
P: Funciona para cachorro adulto?
R: Sim, funciona em qualquer idade — o processo é adaptado ao histórico do animal.

P: É realmente possível fazer online?
R: Sim — o que mais importa é você aprender a conduzir, e isso acontece onde você está.">${B.faq || ''}</textarea>
        <span class="field-hint">Se não tiver, a IA vai inferir baseado no nicho — mas fornecendo aqui o resultado é muito mais preciso.</span>
      </div>
    `;
  },

  buildStep7() {
    const B = this.B;
    const warns = this.getStepWarnings(7);
    const diffWarn = warns.find(w => w.field === 'diferencial');
    return `
      <p class="form-section-title">Diferenciais e Autoridade</p>

      <div class="field-group">
        ${this.fieldLabel('diferencial', 'O que concretamente diferencia esse profissional?', true)}
        <textarea class="field-textarea tall" data-field="diferencial"
          placeholder="Evite qualidade/excelência/comprometimento. Diga fatos reais:
- Anos de experiência com casos específicos
- Método proprietário ou técnica diferenciada
- Resultados concretos: X clientes atendidos, Y% de resolução
- Especialização específica que poucos têm
- História que explica por que faz diferente">${B.diferencial || ''}</textarea>
        ${diffWarn ? `<div class="field-warning"><i data-lucide="alert-triangle" style="width:13px;height:13px"></i>${diffWarn.msg}</div>` : ''}
      </div>

      <div class="field-group">
        ${this.fieldLabel('frase_impacto', 'Frase de impacto', true)}
        <input type="text" class="field-input" data-field="frase_impacto" placeholder="Ex: Eu não treino cachorros — eu ensino donos a se comunicar." value="${B.frase_impacto || ''}">
        <span class="field-hint">Uma frase poderosa e direta que captura a essência. Será usada na copy do hero.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('historia', 'História / origem (opcional mas poderosa)', false, true)}
        <textarea class="field-textarea" data-field="historia"
          placeholder="Uma história real que explica por que esse profissional faz o que faz. Por que escolheu esse caminho? O que o fez especializar nisso?
Histórias genuínas criam conexão. Não precisa ser dramática — precisa ser verdadeira.">${B.historia || ''}</textarea>
      </div>

      <div class="field-group">
        ${this.fieldLabel('casos_resultados', 'Cases e resultados concretos', false, true)}
        <textarea class="field-textarea" data-field="casos_resultados"
          placeholder="Números, transformações, resultados documentados.
Ex: Mais de 200 cães atendidos | Taxa de sucesso em 94% dos casos | Atendimento em 8 estados">${B.casos_resultados || ''}</textarea>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Prova Social</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('depoimentos', 'Tem depoimentos de clientes?', true)}
          <div class="chip-group">
            <button class="chip ${B.depoimentos === 'sim' ? 'on' : ''}" data-field="depoimentos" data-chip="sim">Sim</button>
            <button class="chip ${B.depoimentos === 'nao' ? 'on' : ''}" data-field="depoimentos" data-chip="nao">Não</button>
          </div>
        </div>
        <div class="field-group">
          ${this.fieldLabel('google_business', 'Tem perfil no Google Business?', true)}
          <div class="chip-group">
            <button class="chip ${B.google_business === 'sim' ? 'on' : ''}" data-field="google_business" data-chip="sim">Sim</button>
            <button class="chip ${B.google_business === 'nao' ? 'on' : ''}" data-field="google_business" data-chip="nao">Não</button>
          </div>
        </div>
      </div>

      ${B.depoimentos === 'sim' ? `
        <div class="form-row-3">
          <div class="field-group">
            ${this.fieldLabel('depoimentos_qtd', 'Quantidade de depoimentos', true)}
            <input type="number" class="field-input" data-field="depoimentos_qtd" placeholder="Ex: 12" value="${B.depoimentos_qtd || ''}">
          </div>
          <div class="field-group" style="grid-column: span 2">
            ${this.fieldLabel('depoimentos_formato', 'Formato disponível', true)}
            <div class="chip-group">
              ${['Print', 'Texto', 'Vídeo'].map(f => `
                <button class="chip ${(B.depoimentos_formato || []).includes(f.toLowerCase()) ? 'on' : ''}"
                  data-field="depoimentos_formato" data-chip="${f.toLowerCase()}" data-multi="true">${f}</button>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      ${B.google_business === 'sim' ? `
        <div class="form-row">
          <div class="field-group">
            ${this.fieldLabel('google_nota', 'Nota média no Google', true)}
            <input type="number" step="0.1" min="1" max="5" class="field-input" data-field="google_nota" placeholder="Ex: 4.9" value="${B.google_nota || ''}">
            <span class="field-hint">Mínimo 4.5 para incluir o bloco de reviews.</span>
          </div>
          <div class="field-group">
            ${this.fieldLabel('google_qtd', 'Número de avaliações', true)}
            <input type="number" class="field-input" data-field="google_qtd" placeholder="Ex: 127" value="${B.google_qtd || ''}">
            <span class="field-hint">Mínimo 10 para incluir o bloco de reviews.</span>
          </div>
        </div>
      ` : ''}
    `;
  },

  buildStep8() {
    const B = this.B;
    return `
      <p class="form-section-title">Tom de Voz e Copy</p>

      <div class="field-group">
        ${this.fieldLabel('estilo_desejado', 'Como o site deve ser percebido?', true)}
        <textarea class="field-textarea" data-field="estilo_desejado"
          placeholder="Descreva com precisão. Não apenas 'moderno' ou 'clean' — diga o quê.
Ex: Sóbrio, técnico e confiante. Próximo de Linear ou Stripe. Autoridade sem frieza.">${B.estilo_desejado || ''}</textarea>
        <span class="field-hint">Evite 'profissional', 'moderno', 'clean' sem contexto. Esses termos significam coisas diferentes para pessoas diferentes.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('sensacao_visitante', 'O que o visitante deve sentir ao entrar?', true)}
        <input type="text" class="field-input" data-field="sensacao_visitante"
          placeholder="Ex: Segurança imediata — essa é a pessoa certa, entende o meu problema."
          value="${B.sensacao_visitante || ''}">
      </div>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('vocabulario_usa', 'Vocabulário que o cliente usa', false, true)}
          <textarea class="field-textarea" data-field="vocabulario_usa"
            placeholder="Termos técnicos ou expressões do cliente que devem aparecer na copy.
Ex: 'manejo', 'vínculo', 'marcadores', 'cão'.">${B.vocabulario_usa || ''}</textarea>
        </div>
        <div class="field-group">
          ${this.fieldLabel('vocabulario_nunca', 'Vocabulário que o cliente NUNCA usaria', false, true)}
          <textarea class="field-textarea" data-field="vocabulario_nunca"
            placeholder="Expressões que quebram a autenticidade da marca.
Ex: 'pet', 'fofo', 'amiguinho', 'tutor consciente'.">${B.vocabulario_nunca || ''}</textarea>
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('frase_tom', 'Uma frase que resume o tom de voz', false, true)}
        <input type="text" class="field-input" data-field="frase_tom"
          placeholder="Ex: Especialista que já viu tudo e fala sem rodeios."
          value="${B.frase_tom || ''}">
      </div>

      <div class="field-group">
        ${this.fieldLabel('restricoes', 'O que NÃO quer de forma alguma no site', false, true)}
        <textarea class="field-textarea" data-field="restricoes"
          placeholder="Termos, abordagens, elementos visuais ou textuais que o cliente quer evitar.">${B.restricoes || ''}</textarea>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Instruções Adicionais</p>

      <div class="field-group">
        ${this.fieldLabel('instrucoes_adicionais', 'Informações extras', false, true)}
        <textarea class="field-textarea" data-field="instrucoes_adicionais"
          placeholder="Qualquer coisa que não coube nos campos anteriores — nuances da conversa, contexto extra, observações suas.">${B.instrucoes_adicionais || ''}</textarea>
      </div>
    `;
  },

  /* ─────────────────────────────────────────────────────
     BUILD: ART DIRECTION SCREEN
  ───────────────────────────────────────────────────── */
  buildArtScreen() {
    const B = this.B;
    const pessoais = B.arte_referencias_pessoais || [];
    const nicho    = B.arte_referencias_nicho    || [];

    return `
    <div class="art-screen">

      <div class="art-screen-header">
        <h2 class="art-screen-title">Direção de Arte</h2>
        <p class="art-screen-desc">
          Cole referências pessoais e do nicho, suba ativos da marca e links.
          A IA analisa tudo e devolve uma ficha estruturada com paleta, tipografia e tom visual.
          Você aprova antes de qualquer geração.
        </p>
      </div>

      <!-- Ativos da Marca -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="image" class="art-section-icon" style="color:var(--accent2)"></i>
          <span class="art-section-title">Ativos da Marca</span>
        </div>
        <div class="art-section-body">
          <div id="art-upload-zone" class="upload-zone">
            <input type="file" multiple accept=".svg,.png,.jpg,.jpeg,.webp,.pdf">
            <i data-lucide="upload-cloud" class="upload-zone-icon"></i>
            <p class="upload-zone-label">Logo, fotos do profissional, materiais de marca</p>
            <p class="upload-zone-hint">SVG, PNG, JPG, WEBP, PDF — até 10MB por arquivo</p>
          </div>
          <div id="art-files-list" class="upload-preview-list"></div>

          <div class="form-row">
            <div class="field-group">
              ${this.fieldLabel('arte_logo', 'Status da logo', true)}
              <div class="chip-group">
                ${[{v:'svg', l:'SVG disponível'},{v:'png', l:'PNG disponível'},{v:'nao', l:'Sem logo'}].map(o =>
                  `<button class="chip ${B.arte_logo === o.v ? 'on' : ''}" data-field="arte_logo" data-chip="${o.v}">${o.l}</button>`
                ).join('')}
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_fotos', 'Fotos do profissional/produto', true)}
              <div class="chip-group">
                ${[{v:'boa', l:'Boa qualidade'},{v:'media', l:'Qualidade média'},{v:'nao', l:'Sem fotos'}].map(o =>
                  `<button class="chip ${B.arte_fotos === o.v ? 'on' : ''}" data-field="arte_fotos" data-chip="${o.v}">${o.l}</button>`
                ).join('')}
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                ${this.fieldLabel('arte_cor_principal', 'Cor principal da marca', false)}
              </div>
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_principal" value="${B.arte_cor_principal || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_principal"
                  placeholder="#HEX ou 'não definida'" value="${B.arte_cor_principal || ''}">
              </div>
            </div>
            <div class="field-group">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                ${this.fieldLabel('arte_cor_secundaria', 'Cor secundária', false)}
              </div>
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_secundaria" value="${B.arte_cor_secundaria || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_secundaria"
                  placeholder="#HEX ou 'não definida'" value="${B.arte_cor_secundaria || ''}">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Referências Pessoais -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="heart" class="art-section-icon" style="color:var(--warning)"></i>
          <span class="art-section-title">Referências Pessoais</span>
        </div>
        <div class="art-section-body">
          <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin-bottom:4px">
            Sites, marcas ou projetos que você admira visualmente. A IA vai acessar os links e "ver" o que te atraiu neles.
            Coloque o que te inspirou <em>e</em> o que adaptar para o nicho do cliente.
          </p>
          ${pessoais.map((ref, i) => this.buildRefItem('pessoais', i, ref)).join('')}
          <button class="btn-ghost btn-sm" data-add-ref="pessoais">
            <i data-lucide="plus" style="width:14px;height:14px"></i>
            Adicionar referência pessoal
          </button>
        </div>
      </div>

      <!-- Referências do Nicho -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="search" class="art-section-icon" style="color:var(--accent)"></i>
          <span class="art-section-title">Referências do Nicho</span>
        </div>
        <div class="art-section-body">
          <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin-bottom:4px">
            Sites de concorrentes ou do mesmo segmento. Ajuda a IA a entender o que o público espera ver
            — e o que evitar para se diferenciar.
          </p>
          ${nicho.map((ref, i) => this.buildRefItem('nicho', i, ref)).join('')}
          <button class="btn-ghost btn-sm" data-add-ref="nicho">
            <i data-lucide="plus" style="width:14px;height:14px"></i>
            Adicionar referência do nicho
          </button>
        </div>
      </div>

      <!-- Direção Geral -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="sliders" class="art-section-icon" style="color:var(--accent2)"></i>
          <span class="art-section-title">Direção Geral</span>
        </div>
        <div class="art-section-body">

          <div class="field-group">
            ${this.fieldLabel('arte_tema', 'Tema visual', true)}
            <div class="chip-group">
              ${[
                { v: 'escuro', l: 'Escuro (dark)' },
                { v: 'claro',  l: 'Claro (light)' },
                { v: 'ia',     l: 'IA decide baseado na marca' },
              ].map(o => `
                <button class="chip ${B.arte_tema === o.v ? 'on' : ''}" data-field="arte_tema" data-chip="${o.v}">${o.l}</button>
              `).join('')}
            </div>
          </div>

          <div class="field-group">
            ${this.fieldLabel('arte_intensidade', 'Intensidade visual', true)}
            <div class="sel-cards" data-field-group="arte_intensidade">
              ${[
                { v: 'contido', icon: 'minus-circle', title: 'Contido', desc: 'Animações sutis, foco no conteúdo. Consultórios, clínicas, B2B.' },
                { v: 'medio',   icon: 'circle',       title: 'Médio',   desc: 'Presença notável. Profissionais criativos, mentores, premium.' },
                { v: 'alto',    icon: 'zap-off',      title: 'Alto',    desc: 'Efeito uau total. Imersivo, editorial. Diferença imediata.' },
              ].map(o => `
                <div class="sel-card" data-field="arte_intensidade" data-selcard="${o.v}" tabindex="0">
                  <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
                  <div>
                    <div class="sel-card-title">${o.title}</div>
                    <div class="sel-card-desc">${o.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              ${this.fieldLabel('arte_menu_mobile', 'Menu mobile', false, true)}
              <div class="chip-group">
                ${[
                  { v: 'fullscreen', l: 'Fullscreen' },
                  { v: 'drawer',     l: 'Drawer lateral' },
                  { v: 'bottom',     l: 'Bottom sheet' },
                  { v: 'ia',         l: 'IA decide' },
                ].map(o => `
                  <button class="chip ${B.arte_menu_mobile === o.v ? 'on' : ''}" data-field="arte_menu_mobile" data-chip="${o.v}">${o.l}</button>
                `).join('')}
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_referencia_marca', 'Referência de marca', false, true)}
              <input type="text" class="field-input" data-field="arte_referencia_marca"
                placeholder="Ex: Próximo de Notion, Linear ou Stripe"
                value="${B.arte_referencia_marca || ''}">
            </div>
          </div>

          <div class="field-group">
            ${this.fieldLabel('arte_footer_tom', 'Como deve ser o footer?', false, true)}
            <textarea class="field-textarea" data-field="arte_footer_tom"
              placeholder="Tom visual, elementos que deve ter, sensação que deve causar.
Ex: Footer escuro com destaque em verde — último empurrão de conversão. Logo, WA, redes e registro profissional.">${B.arte_footer_tom || ''}</textarea>
          </div>

          <div class="field-group">
            ${this.fieldLabel('arte_o_que_nao_quero', 'O que NÃO quero visualmente', false, true)}
            <textarea class="field-textarea" data-field="arte_o_que_nao_quero"
              placeholder="Elementos visuais, estilos, cores ou abordagens que você quer evitar.
Ex: Sem gradiente roxo. Sem ilustrações infantis. Sem ícones estilo flaticon genérico.">${B.arte_o_que_nao_quero || ''}</textarea>
          </div>

        </div>
      </div>

      <!-- Ação: Analisar -->
      <div style="display:flex;justify-content:flex-end;gap:12px;padding-bottom:40px">
        ${this.state.artAnalyzed ? `
          <div style="display:flex;align-items:center;gap:8px;color:var(--success);font-size:13px">
            <i data-lucide="check-circle" style="width:16px;height:16px"></i>
            Direção aprovada
          </div>
        ` : ''}
        <button id="btn-analyze-art" class="btn-secondary">
          <i data-lucide="sparkles" style="width:16px;height:16px"></i>
          Analisar e gerar ficha de direção
        </button>
      </div>

    </div>
    `;
  },

  buildRefItem(type, index, ref) {
    const key = `arte_referencias_${type}`;
    return `
      <div class="reference-item">
        <div class="reference-item-header">
          <span class="reference-index">#${index + 1}</span>
          <button onclick="App.removeArtReference('${type}', ${index}); App.renderScreen();" style="color:var(--text-tertiary);padding:2px" title="Remover">
            <i data-lucide="x" style="width:14px;height:14px"></i>
          </button>
        </div>
        <div class="field-group">
          <label class="field-label">Link</label>
          <input type="url" class="field-input" placeholder="https://exemplo.com"
            value="${ref.link || ''}"
            onchange="App.updateArtRef('${type}', ${index}, 'link', this.value)">
        </div>
        <div class="field-group">
          <label class="field-label">O que me atraiu nesse site</label>
          <textarea class="field-textarea" placeholder="Seja específico: tipografia, cor, movimento, layout, hierarquia."
            onchange="App.updateArtRef('${type}', ${index}, 'gostei', this.value)">${ref.gostei || ''}</textarea>
        </div>
        <div class="field-group">
          <label class="field-label">O que adaptar para este nicho</label>
          <textarea class="field-textarea" placeholder="O que funciona aqui e o que não se transfere para o nicho do cliente."
            onchange="App.updateArtRef('${type}', ${index}, 'adaptar', this.value)">${ref.adaptar || ''}</textarea>
        </div>
      </div>
    `;
  },

  addArtReference(type) {
    const key = `arte_referencias_${type}`;
    if (!this.P) return;
    if (!this.P.briefing[key]) this.P.briefing[key] = [];
    this.P.briefing[key].push({ link: '', gostei: '', adaptar: '' });
    this.autosave();
  },

  removeArtReference(type, index) {
    const key = `arte_referencias_${type}`;
    if (!this.P || !this.P.briefing[key]) return;
    this.P.briefing[key].splice(index, 1);
    this.autosave();
  },

  updateArtRef(type, index, prop, value) {
    const key = `arte_referencias_${type}`;
    if (!this.P || !this.P.briefing[key]?.[index]) return;
    this.P.briefing[key][index][prop] = value;
    this.autosave();
  },

  /* ─────────────────────────────────────────────────────
     BUILD: REVIEW SCREEN
  ───────────────────────────────────────────────────── */
  buildReviewScreen() {
    const score = this.getGlobalScore();
    const cls = this.getScoreClass(score);
    const color = this.getScoreColor(score);
    const missing = this.getMissingCritical();
    const warns = this.getAllWarnings();
    const canGen = this.canGenerate();

    const statusMsg = score >= 80 ? 'Briefing sólido — pronto para gerar' :
                      score >= 55 ? 'Briefing razoável — revise os avisos antes de gerar' :
                      'Briefing incompleto — preencha os campos críticos';

    return `
    <div class="review-screen">

      <!-- Score Global -->
      <div class="review-global-score">
        <div class="review-score-main">
          <span class="review-score-number" style="color:${color}">${score}%</span>
          <span class="review-score-label">Completude geral</span>
        </div>
        <div class="review-score-bar-wrap">
          <div class="review-score-bar-bg">
            <div class="review-score-bar-fill" style="width:${score}%;background:${color}"></div>
          </div>
          <span class="review-score-status">${statusMsg}</span>
        </div>
      </div>

      <!-- Steps Grid -->
      <div class="review-steps-grid">
        ${STEPS.map(s => {
          const ss = this.getStepScore(s.id);
          const sc = this.getScoreClass(ss);
          return `
            <div class="review-step-card" data-goto-step="${s.id}">
              <div class="review-step-card-header">
                <span class="review-step-card-name">${s.name}</span>
                <span class="review-step-card-score ${sc}">${ss}%</span>
              </div>
              <div class="review-step-card-bar">
                <div class="review-step-card-fill" style="width:${ss}%;background:${this.getScoreColor(ss)}"></div>
              </div>
              <span class="review-step-card-btn">
                <i data-lucide="pencil" style="width:11px;height:11px"></i>
                Editar
              </span>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Campos críticos faltando -->
      ${missing.length > 0 ? `
        <div class="review-critical-missing">
          <div style="display:flex;align-items:center;gap:8px;color:var(--danger);font-weight:600;font-size:13px;margin-bottom:10px">
            <i data-lucide="alert-circle" style="width:16px;height:16px"></i>
            ${missing.length} campo${missing.length > 1 ? 's' : ''} crítico${missing.length > 1 ? 's' : ''} faltando
          </div>
          ${missing.map(m => `
            <div style="display:flex;align-items:center;justify-content:space-between;font-size:12.5px;color:var(--text-secondary);padding:6px 0">
              <span>✗ ${m.field.replace(/_/g,' ')}</span>
              <span class="review-step-card-btn" data-goto-step="${m.step}" style="cursor:pointer;color:var(--accent2)">
                Step ${m.step} →
              </span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Warnings -->
      ${warns.length > 0 ? `
        <div class="review-warnings">
          <div class="review-warnings-header">
            <i data-lucide="alert-triangle" style="width:15px;height:15px"></i>
            ${warns.length} aviso${warns.length > 1 ? 's' : ''} de qualidade
          </div>
          ${warns.map(w => `
            <div class="review-warning-item">
              <i data-lucide="alert-triangle" style="width:13px;height:13px;color:var(--warning);flex-shrink:0"></i>
              <span>${w.msg}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Ações de Geração -->
      <div class="review-actions-box">
        <h3 class="review-actions-title">Gerar Documentação</h3>

        <div class="review-action-row">
          <!-- Saída A: Manual -->
          <div class="review-action-card">
            <i data-lucide="download" class="review-action-card-icon" style="width:20px;height:20px"></i>
            <div class="review-action-card-title">Baixar DOC-1</div>
            <div class="review-action-card-desc">
              Briefing estruturado completo em .md, com instrução mestre e regras Adsgator.
              Use em qualquer IA manualmente para gerar a ficha de implementação.
            </div>
            <div class="review-action-card-btn">
              <button id="btn-download-doc1" class="btn-ghost">
                <i data-lucide="download" style="width:15px;height:15px"></i>
                Baixar DOC-1 (.md)
              </button>
            </div>
          </div>

          <!-- Saída B: Automático -->
          <div class="review-action-card" style="border-color:${canGen ? 'var(--accent-border)' : 'var(--border-default)'}">
            <i data-lucide="zap" class="review-action-card-icon" style="width:20px;height:20px;color:${canGen ? 'var(--accent)' : 'var(--text-tertiary)'}"></i>
            <div class="review-action-card-title">Gerar DOC-IMPL via IA</div>
            <div class="review-action-card-desc">
              A IA recebe o DOC-1 e gera a Ficha de Implementação completa — código Astro, design system, copy, tudo.
              Pronto para o Roo Code implementar.
            </div>
            ${!canGen && missing.length > 0 ? `
              <div style="font-size:11px;color:var(--danger);display:flex;gap:5px;align-items:center">
                <i data-lucide="lock" style="width:12px;height:12px"></i>
                Preencha os campos críticos primeiro
              </div>
            ` : !canGen ? `
              <div style="font-size:11px;color:var(--warning);display:flex;gap:5px;align-items:center">
                <i data-lucide="key" style="width:12px;height:12px"></i>
                Configure uma API Key em Config. API
              </div>
            ` : ''}
            <div class="review-action-card-btn">
              <button id="btn-generate-docimpl" class="btn-primary" ${!canGen ? 'disabled' : ''}>
                <i data-lucide="zap" style="width:15px;height:15px"></i>
                Gerar Ficha de Implementação
              </button>
            </div>
          </div>
        </div>

        <div style="font-size:11.5px;color:var(--text-tertiary);display:flex;align-items:center;gap:6px">
          <i data-lucide="cpu" style="width:13px;height:13px"></i>
          Modelo selecionado: <strong style="color:var(--text-secondary)">${AI_MODELS[this.state.selectedModel]?.label}</strong>
        </div>

      </div>
    </div>
    `;
  },

  /* ─────────────────────────────────────────────────────
     BOTTOMBAR
  ───────────────────────────────────────────────────── */
  renderBottombar() {
    const prev = document.getElementById('btn-prev');
    const actions = document.getElementById('bottombar-actions');
    const center = document.getElementById('bottombar-center');
    if (!prev || !actions) return;

    // Prev
    const showPrev = this.state.screen !== 'intake';
    prev.style.display = showPrev ? '' : 'none';
    prev.onclick = () => this.goPrev();

    // Center: step indicator
    if (this.state.screen === 'step') {
      center.innerHTML = `<span style="font-size:12px;color:var(--text-tertiary);font-family:var(--font-mono)">
        Step ${this.state.currentStep} de ${STEPS.length}
      </span>`;
    } else {
      center.innerHTML = '';
    }

    // Actions
    if (this.state.screen === 'review') {
      actions.innerHTML = ''; // Os botões são na própria review screen
    } else if (this.state.screen === 'art') {
      const artLabel = this.state.artAnalyzed ? 'Continuar para Revisão →' : 'Ir para Revisão →';
      actions.innerHTML = `
        <button class="btn-ghost" onclick="App.goToScreen('review')">
          ${artLabel}
        </button>
      `;
    } else {
      const isLastStep = this.state.screen === 'step' && this.state.currentStep === 8;
      const nextLabel = isLastStep ? 'Direção de Arte →' :
                        this.state.screen === 'intake' ? 'Ir para Step 1 →' : 'Próximo →';
      actions.innerHTML = `
        <button class="btn-primary" onclick="App.goNext()">
          ${nextLabel}
          <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
        </button>
      `;
      lucide.createIcons({ nodes: [actions] });
    }
  },

  /* ─────────────────────────────────────────────────────
     INTAKE ANALYSIS
  ───────────────────────────────────────────────────── */
  async runIntakeAnalysis() {
    const B = this.B;
    const text = B.briefing_bruto || '';
    const files = this.state.intakeFiles || [];

    if (!text.trim() && files.length === 0) {
      this.showToast('Cole o briefing ou anexe arquivos antes de analisar.', 'warning');
      return;
    }

    const model = AI_MODELS[this.state.selectedModel];
    const apiKey = this.state.apiKeys[model.provider];
    if (!apiKey?.trim()) {
      this.showToast('Configure uma API Key primeiro (Config. API).', 'warning');
      this.openModal('modal-api');
      return;
    }

    // Loading state
    document.getElementById('screen-content').innerHTML = `
      <div class="intake-screen">
        <div class="intake-loading">
          <i data-lucide="loader-2" class="intake-loading-icon" style="width:40px;height:40px"></i>
          <div class="intake-loading-title">Analisando briefing...</div>
          <div class="intake-loading-sub">A IA está lendo o material e preenchendo os steps. Aguarde.</div>
        </div>
      </div>
    `;
    lucide.createIcons({ nodes: [document.getElementById('screen-content')] });

    try {
      const prompt = this.buildIntakePrompt(text);
      const response = await this.callAI(prompt);
      this.parseIntakeResponse(response);
      this.showToast('Steps preenchidos! Revise os dados.', 'success');
      this.goToStep(1);
    } catch (err) {
      this.state.screen = 'intake';
      this.renderScreen();
      this.showToast(`Erro na análise: ${err.message}`, 'error');
      console.error('[LandingAI] Intake analysis error:', err);
    }
  },

  buildIntakePrompt(text) {
    return `Você é um estrategista de marketing digital especializado em landing pages de conversão para prestadores de serviços locais e profissionais liberais.

Leia o material abaixo e extraia as informações para preencher os campos.
Responda APENAS com JSON válido no formato exato indicado — sem markdown, sem comentários, sem texto adicional.
Se uma informação não estiver disponível, use string vazia "".

CAMPOS PARA EXTRAIR:
{
  "nome_cliente": "Nome completo do profissional/empresa",
  "nome_marca": "Nome comercial/marca se diferente",
  "segmento": "Segmento específico de atuação",
  "tipo": "servico | mentoria | consultoria | produto | saas",
  "whatsapp": "Somente dígitos com DDI+DDD",
  "email": "E-mail de contato",
  "horarios": "Dias e horários de atendimento",
  "instagram": "Handle ou URL do Instagram",
  "tiktok": "Handle do TikTok",
  "youtube": "URL do YouTube",
  "modalidade": "presencial | online | hibrido",
  "endereco": "Endereço completo se presencial",
  "cidades_atendimento": "Cidades atendidas",
  "servico_principal": "Serviço principal em uma linha",
  "servicos_lista": "Lista de serviços, um por linha",
  "servicos_descricao": "Descrição detalhada de cada serviço",
  "objetivo_conversao": "whatsapp | formulario | agendamento | outro",
  "preco_exibir": "sim | nao",
  "preco_valor": "Valor e forma de cobrança",
  "preco_condicao": "Condição especial se houver",
  "publico_primario": "Perfil detalhado do cliente ideal",
  "publico_dor": "Principal problema/dor antes de contratar",
  "publico_resultado": "O que o cliente quer alcançar",
  "publico_secundario": "Público secundário se houver",
  "diferencial": "O que concretamente diferencia esse profissional",
  "frase_impacto": "Frase de impacto do profissional",
  "historia": "História/origem do profissional",
  "depoimentos": "sim | nao",
  "google_business": "sim | nao",
  "google_nota": "Nota no Google se houver",
  "google_qtd": "Número de avaliações",
  "estilo_desejado": "Como o site deve ser percebido",
  "sensacao_visitante": "O que o visitante deve sentir",
  "vocabulario_usa": "Termos que o cliente usa",
  "vocabulario_nunca": "Termos que o cliente nunca usaria",
  "frase_tom": "Frase que resume o tom de voz",
  "restricoes": "O que não quer de forma alguma",
  "dominio": "Domínio desejado",
  "cnpj": "CNPJ se fornecido",
  "aviso_legal": "Registro profissional CRM/CRP/OAB etc"
}

MATERIAL DO CLIENTE:
${text}`;
  },

  parseIntakeResponse(response) {
    try {
      // Remove markdown fences se houver
      const clean = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(clean);
      if (!this.P) return;
      Object.keys(data).forEach(key => {
        if (key in this.P.briefing && data[key] !== undefined) {
          this.P.briefing[key] = data[key];
        }
      });
      this.autosave();
    } catch (err) {
      console.error('[LandingAI] parseIntakeResponse erro:', err);
      throw new Error('A IA retornou um formato inválido. Tente novamente.');
    }
  },

  /* ─────────────────────────────────────────────────────
     ART ANALYSIS
  ───────────────────────────────────────────────────── */
  async runArtAnalysis() {
    const B = this.B;
    const model = AI_MODELS[this.state.selectedModel];
    const apiKey = this.state.apiKeys[model.provider];

    if (!apiKey?.trim()) {
      this.showToast('Configure uma API Key primeiro.', 'warning');
      this.openModal('modal-api');
      return;
    }

    const btn = document.getElementById('btn-analyze-art');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader-2" style="width:16px;height:16px;animation:spin 1s linear infinite"></i> Analisando...`;
      lucide.createIcons({ nodes: [btn] });
    }

    try {
      const prompt = this.buildArtPrompt();
      const response = await this.callAI(prompt);
      this.renderArtResult(response);
    } catch (err) {
      this.showToast(`Erro na análise de arte: ${err.message}`, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="sparkles" style="width:16px;height:16px"></i> Analisar e gerar ficha de direção`;
        lucide.createIcons({ nodes: [btn] });
      }
    }
  },

  buildArtPrompt() {
    const B = this.B;
    const pessoais = (B.arte_referencias_pessoais || []).map((r, i) =>
      `Referência pessoal ${i+1}: ${r.link}\nO que gostei: ${r.gostei}\nO que adaptar: ${r.adaptar}`
    ).join('\n\n');

    const nicho = (B.arte_referencias_nicho || []).map((r, i) =>
      `Referência do nicho ${i+1}: ${r.link}\nO que gostei: ${r.gostei}\nO que adaptar: ${r.adaptar}`
    ).join('\n\n');

    return `Você é um Diretor de Arte e UI Designer de elite especializado em landing pages de conversão.

Analise o briefing de direção de arte abaixo e gere uma FICHA ESTRUTURADA de direção criativa.

CLIENTE: ${B.nome_cliente} | NICHO: ${B.segmento} | TIPO: ${B.tipo}

ATIVOS DA MARCA:
- Logo: ${B.arte_logo || 'não definida'}
- Fotos: ${B.arte_fotos || 'não definidas'}
- Cor principal: ${B.arte_cor_principal || 'não definida'}
- Cor secundária: ${B.arte_cor_secundaria || 'não definida'}

DIREÇÃO:
- Tema: ${B.arte_tema || 'não definido'}
- Intensidade: ${B.arte_intensidade || 'não definida'}
- Referência de marca: ${B.arte_referencia_marca || 'não definida'}
- O que NÃO quer: ${B.arte_o_que_nao_quero || 'não especificado'}
- Menu mobile: ${B.arte_menu_mobile || 'não definido'}
- Footer: ${B.arte_footer_tom || 'não definido'}

ESTILO DESEJADO: ${B.estilo_desejado}
SENSAÇÃO VISITANTE: ${B.sensacao_visitante}

REFERÊNCIAS PESSOAIS:
${pessoais || 'Não fornecidas'}

REFERÊNCIAS DO NICHO:
${nicho || 'Não fornecidas'}

Gere a ficha em JSON com este formato exato:
{
  "paleta": [
    { "nome": "Principal", "hex": "#XXXXXX", "uso": "CTAs, destaques, botões primários" },
    { "nome": "Fundo", "hex": "#XXXXXX", "uso": "Background geral das páginas" },
    { "nome": "Superfície", "hex": "#XXXXXX", "uso": "Cards, seções alternadas" },
    { "nome": "Texto", "hex": "#XXXXXX", "uso": "Corpo do texto, parágrafos" },
    { "nome": "Acento", "hex": "#XXXXXX", "uso": "Hover states, links, secundário" }
  ],
  "tipografia": {
    "display": { "fonte": "Nome da fonte", "peso": "700", "uso": "Títulos H1, hero", "google": "URL Google Fonts" },
    "corpo": { "fonte": "Nome da fonte", "peso": "400/500", "uso": "Parágrafos, labels, UI", "google": "URL Google Fonts" },
    "mono": { "fonte": "Nome da fonte", "peso": "400", "uso": "Destaque técnico, badges", "google": "URL Google Fonts" }
  },
  "tom_visual": "Descrição detalhada do tom visual — estilo, linguagem visual, referências sintetizadas",
  "referencias_interpretadas": [
    { "fonte": "URL ou nome", "tipo": "pessoal|nicho", "o_que_usar": "O que será incorporado ao design" }
  ],
  "animacoes": "Diretriz de animações — tipo, velocidade, gatilhos, prefers-reduced-motion",
  "layout": "Diretriz de layout — grid, espaçamento, uso de viewport, assimetria",
  "mobile_first": "Decisões específicas de mobile: tipografia, espaçamento, hero, menu",
  "footer": "Especificação do footer: fundo, tipografia, elementos, tom final",
  "decisoes": ["Decisão criativa 1 com justificativa", "Decisão criativa 2", "Decisão criativa 3"]
}

Responda APENAS com JSON válido. Sem markdown, sem comentários.`;
  },

  renderArtResult(response) {
    try {
      const clean = response.replace(/```json|```/g, '').trim();
      const data = JSON.parse(clean);
      if (this.P) {
        this.P.briefing.arte_ficha_aprovada = '';
      }

      const body = document.getElementById('art-result-body');
      if (!body) { this.openModal('modal-art-result'); return; }

      const modal = document.getElementById('modal-art-result');
      modal.querySelector('#art-result-body').innerHTML = this.buildArtResultHTML(data);
      lucide.createIcons({ nodes: [modal] });

      // Store para aprovação
      this._pendingArtFicha = JSON.stringify(data);

      document.getElementById('btn-art-approve').onclick = () => {
        if (this.P) this.P.briefing.arte_ficha_aprovada = this._pendingArtFicha;
        this.state.artAnalyzed = true;
        this.autosave();
        this.closeModal('modal-art-result');
        this.showToast('Direção de arte aprovada!', 'success');
        this.renderStepsNav();
      };

      this.openModal('modal-art-result');
    } catch (err) {
      this.showToast('Erro ao processar ficha de arte. Tente novamente.', 'error');
      console.error('[LandingAI] renderArtResult erro:', err);
    }
  },

  buildArtResultHTML(data) {
    const paleta = (data.paleta || []).map(p => `
      <div class="palette-swatch">
        <div class="palette-swatch-color" style="background:${p.hex}"></div>
        <span class="palette-swatch-label">${p.hex}</span>
        <span style="font-size:10px;color:var(--text-tertiary);max-width:60px;text-align:center">${p.nome}</span>
      </div>
    `).join('');

    const refs = (data.referencias_interpretadas || []).map(r => `
      <div class="review-warning-item">
        <span class="art-result-tag">${r.tipo}</span>
        <span style="font-size:12.5px;color:var(--text-secondary)"><strong style="color:var(--text-primary)">${r.fonte}</strong> — ${r.o_que_usar}</span>
      </div>
    `).join('');

    const decisoes = (data.decisoes || []).map(d => `
      <div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-bottom:1px solid var(--border-subtle)">
        <i data-lucide="check" style="width:13px;height:13px;color:var(--accent);flex-shrink:0;margin-top:3px"></i>
        <span class="art-result-text" style="font-size:12.5px">${d}</span>
      </div>
    `).join('');

    return `
      <div class="art-result-card">
        <div class="art-result-section">
          <div class="art-result-section-title">Paleta de Cores</div>
          <div class="palette-swatches">${paleta}</div>
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title">Tipografia</div>
          ${data.tipografia ? `
            <div style="display:flex;flex-direction:column;gap:6px">
              <div class="art-result-text"><strong>Display:</strong> ${data.tipografia.display?.fonte} ${data.tipografia.display?.peso} — ${data.tipografia.display?.uso}</div>
              <div class="art-result-text"><strong>Corpo:</strong> ${data.tipografia.corpo?.fonte} ${data.tipografia.corpo?.peso} — ${data.tipografia.corpo?.uso}</div>
              ${data.tipografia.mono ? `<div class="art-result-text"><strong>Mono:</strong> ${data.tipografia.mono?.fonte} — ${data.tipografia.mono?.uso}</div>` : ''}
            </div>
          ` : ''}
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title">Tom Visual</div>
          <p class="art-result-text">${data.tom_visual || ''}</p>
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title">Layout e Animações</div>
          <p class="art-result-text">${data.layout || ''}</p>
          <p class="art-result-text" style="margin-top:8px">${data.animacoes || ''}</p>
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title">Mobile e Footer</div>
          <p class="art-result-text"><strong>Mobile:</strong> ${data.mobile_first || ''}</p>
          <p class="art-result-text" style="margin-top:8px"><strong>Footer:</strong> ${data.footer || ''}</p>
        </div>
        ${refs ? `
          <div class="art-result-section">
            <div class="art-result-section-title">Referências Interpretadas</div>
            ${refs}
          </div>
        ` : ''}
        ${decisoes ? `
          <div class="art-result-section">
            <div class="art-result-section-title">Decisões Criativas</div>
            ${decisoes}
          </div>
        ` : ''}
      </div>
    `;
  },

  /* ─────────────────────────────────────────────────────
     DOC GENERATION
  ───────────────────────────────────────────────────── */
  buildDoc1() {
    const B = this.B;
    const P = this.P;
    const now = new Date().toISOString();
    const fichaArte = B.arte_ficha_aprovada ? JSON.parse(B.arte_ficha_aprovada) : null;

    const integracoesList = (B.integracoes || []).map(i => {
      const labels = {
        maps: 'Google Maps Embed',
        reviews: 'Google Reviews Widget',
        instagram: 'Feed do Instagram',
        formulario: 'Formulário de Contato',
        whatsapp: 'WhatsApp Flutuante',
        ligacao: 'Botão de Ligação Mobile',
      };
      const checks = {
        maps: B.modalidade?.includes('presencial') && B.exibir_localizacao !== 'nao',
        reviews: B.google_business === 'sim' && parseInt(B.google_qtd) >= 10,
        instagram: !!B.instagram,
        formulario: true,
        whatsapp: true,
        ligacao: true,
      };
      return `- [${checks[i] ? 'x' : ' '}] ${labels[i] || i}`;
    }).join('\n');

    const paleta = fichaArte?.paleta?.map(p =>
      `| ${p.nome} | \`${p.hex}\` | ${p.uso} |`
    ).join('\n') || '| — | — | — |';

    return `---
title: ${B.nome_cliente} — Briefing e Direção
date: ${now}
tags: [adsgator, briefing, doc-1]
status: pronto-para-ia
gerado_por: LandingAI v3
modelo_ia: ${AI_MODELS[this.state.selectedModel]?.label || 'manual'}
projeto: ${P?.slug || B.slug || ''}
---

# ${B.nome_cliente} — Briefing e Direção

> **Documento 1 — Adsgator (gerado pelo LandingAI v3)**
> Envie este documento para a IA gerar a Ficha de Implementação completa.
> Não edite — envie como está.

---

## INSTRUÇÃO MESTRE PARA A IA

Você é um Diretor de Arte, UI Designer de elite, Copywriter Sênior e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão é ler este documento inteiro e gerar como output a **Ficha de Implementação completa** — com código real, design system completo, copy palavra por palavra e ordem de criação de arquivos.

**O que isso significa:**
- Você toma todas as decisões de design que não estão explicitadas — tipografia, escala, tokens, animações, layout de cada seção.
- Você preenche cada campo com valores concretos. Sem placeholders. Sem [definir depois]. Sem [a combinar].
- O output deve poder ser copiado e enviado ao Roo Code sem nenhuma edição adicional.

**Padrão de qualidade:**
Design editorial de alto padrão — atípico, com personalidade visual forte, fora do visual genérico de IA.
Pense Raycast, Linear, Family.co. Layouts com intenção. Tipografia com personalidade. Animações que têm razão de existir.

**Sobre mobile:** Mobile não é adaptação — é o ponto de partida. Começa em 375px.

**Sobre o viewport:** Seções que se beneficiam de ocupar o viewport completo devem fazê-lo. Container é ferramenta, não prisão.

**Sobre o footer:** Última impressão — identidade visual real, conectada ao tom da página.

---

## PARTE 1 — IDENTIDADE DO PROJETO

| Campo | Valor |
|---|---|
| **Cliente** | ${B.nome_cliente || '—'} |
| **Marca** | ${B.nome_marca || B.nome_cliente || '—'} |
| **Slug** | ${B.slug || '—'} |
| **Segmento** | ${B.segmento || '—'} |
| **Tipo** | ${B.tipo || '—'} |
| **WhatsApp** | ${B.whatsapp || '—'} |
| **Link WA** | ${B.whatsapp ? `https://wa.me/${B.whatsapp}` : '—'} |
| **E-mail** | ${B.email || '—'} |
| **Horários** | ${B.horarios || '—'} |
| **GTM ID** | ${B.gtm_id || '—'} |
| **Domínio** | ${B.dominio || '—'} |
| **CNPJ** | ${B.cnpj || '—'} |
| **Aviso legal** | ${B.aviso_legal || '—'} |
| **Modalidade** | ${B.modalidade || '—'} |
| **Objetivo de conversão** | ${B.objetivo_conversao || '—'} |

---

## PARTE 2 — SERVIÇOS E PRODUTO

### Serviço Principal (foco da campanha)
${B.servico_principal || '—'}

### Lista de Serviços
${B.servicos_lista || '—'}

### Descrição Detalhada
${B.servicos_descricao || '—'}

### Preço
${B.preco_exibir === 'sim' ? `**Exibir preço:** Sim
**Valor:** ${B.preco_valor || '—'}
**Condição especial:** ${B.preco_condicao || '—'}
**Oferta especial:** ${B.oferta_especial || '—'}` : 'Não exibir preço no site.'}

---

## PARTE 3 — PÚBLICO-ALVO

### Público Primário — perfil detalhado
${B.publico_primario || '—'}

### Dor Principal — na voz do cliente
${B.publico_dor || '—'}

### Resultado Desejado — o "depois"
${B.publico_resultado || '—'}

### Público Secundário
${B.publico_secundario || 'Não definido'}

### FAQ — Perguntas Frequentes Reais
${B.faq || 'Não fornecido — IA deve inferir baseado no nicho e nas objeções mais comuns do segmento.'}

---

## PARTE 4 — COPY E PERSUASÃO

### Diferencial Real
${B.diferencial || '—'}

### Frase de Impacto
${B.frase_impacto || '—'}

### História / Origem
${B.historia || 'Não fornecida.'}

### Casos e Resultados Concretos
${B.casos_resultados || 'Não fornecidos.'}

---

## PARTE 5 — TOM DE VOZ

| Parâmetro | Valor |
|---|---|
| **Frase que resume o tom** | ${B.frase_tom || '—'} |
| **Vocabulário que deve aparecer** | ${B.vocabulario_usa || '—'} |
| **Vocabulário proibido** | ${B.vocabulario_nunca || '—'} |
| **Estilo desejado** | ${B.estilo_desejado || '—'} |
| **Sensação do visitante** | ${B.sensacao_visitante || '—'} |
| **Restrições de conteúdo** | ${B.restricoes || '—'} |

---

## PARTE 6 — PRESENÇA DIGITAL E PROVA SOCIAL

### Redes Sociais
| Rede | Handle/Link |
|---|---|
| Instagram | ${B.instagram || '—'} |
| TikTok | ${B.tiktok || '—'} |
| YouTube | ${B.youtube || '—'} |
| Outras | ${B.outras_redes || '—'} |

### Google Business
${B.google_business === 'sim'
  ? `Sim — Nota: **${B.google_nota} ★** com **${B.google_qtd} avaliações**
${parseInt(B.google_qtd) >= 10 && parseFloat(B.google_nota) >= 4.5 ? '✅ Incluir bloco de Google Reviews' : '⚠ Avaliações insuficientes ou nota baixa — NÃO incluir bloco de reviews'}`
  : 'Não possui perfil Google Business.'}

### Depoimentos
${B.depoimentos === 'sim'
  ? `Sim — Formato: ${(B.depoimentos_formato || []).join(', ')} — Quantidade: ${B.depoimentos_qtd || '—'}
✅ Incluir bloco de depoimentos`
  : 'Não há depoimentos disponíveis — NÃO incluir bloco de depoimentos.'}

---

## PARTE 7 — LOCALIZAÇÃO

### Modalidade
${B.modalidade || '—'}

${(B.modalidade === 'presencial' || B.modalidade === 'hibrido') ? `
### Endereço
${B.endereco || '—'}

### Como exibir
${B.exibir_localizacao || '—'}

### Cidades
${B.cidades_atendimento || '—'}
` : ''}

${(B.modalidade === 'online' || B.modalidade === 'hibrido') ? `
### Plataforma Online
${B.plataforma_online || 'Não especificada'}
` : ''}

---

## PARTE 8 — DIREÇÃO DE ARTE

${fichaArte ? `
### Paleta de Cores Aprovada
| Nome | HEX | Uso |
|---|---|---|
${paleta}

### Tipografia Aprovada
- **Display:** ${fichaArte.tipografia?.display?.fonte} ${fichaArte.tipografia?.display?.peso} — ${fichaArte.tipografia?.display?.uso}
- **Corpo:** ${fichaArte.tipografia?.corpo?.fonte} ${fichaArte.tipografia?.corpo?.peso} — ${fichaArte.tipografia?.corpo?.uso}
${fichaArte.tipografia?.mono ? `- **Mono:** ${fichaArte.tipografia?.mono?.fonte} — ${fichaArte.tipografia?.mono?.uso}` : ''}

### Tom Visual
${fichaArte.tom_visual}

### Layout
${fichaArte.layout}

### Animações
${fichaArte.animacoes}

### Mobile First
${fichaArte.mobile_first}

### Footer
${fichaArte.footer}

### Decisões Criativas
${(fichaArte.decisoes || []).map((d, i) => `${i+1}. ${d}`).join('\n')}
` : `
### Ativos da Marca
- Logo: ${B.arte_logo || '—'}
- Fotos: ${B.arte_fotos || '—'}
- Cor principal: ${B.arte_cor_principal || 'não definida'}
- Cor secundária: ${B.arte_cor_secundaria || 'não definida'}

### Direção Geral
- Tema: ${B.arte_tema || '—'}
- Intensidade visual: ${B.arte_intensidade || '—'}
- Referência de marca: ${B.arte_referencia_marca || '—'}
- Menu mobile: ${B.arte_menu_mobile || '—'}
- O que NÃO quero: ${B.arte_o_que_nao_quero || '—'}
- Footer: ${B.arte_footer_tom || '—'}

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

## PARTE 9 — INTEGRAÇÕES ATIVAS

${integracoesList || '- [x] WhatsApp Flutuante (padrão Adsgator)'}

---

## PARTE 10 — BRIEFING BRUTO DO CLIENTE

> Material original fornecido pelo cliente. Use como fonte primária para enriquecer a copy.

${B.briefing_bruto || 'Não fornecido — use os campos acima como fonte de dados.'}

---

## PARTE 11 — INSTRUÇÕES ADICIONAIS

${B.instrucoes_adicionais || 'Nenhuma instrução adicional.'}

---

## PARTE 12 — REGRAS FIXAS ADSGATOR

${REGRAS_FIXAS_ADSGATOR}

---

## PARTE 13 — PROMPT DE AUDITORIA PÓS-IMPLEMENTAÇÃO

${PROMPT_AUDITORIA}
`;
  },

  downloadDoc1() {
    const doc1 = this.buildDoc1();
    const slug = this.B.slug || 'briefing';
    this.state.lastDoc1 = doc1;
    this.downloadText(doc1, `doc1-${slug}.md`, 'text/markdown');
    this.showToast('DOC-1 baixado!', 'success');
  },

  /* ─────────────────────────────────────────────────────
     GENERATE DOCIMPL
  ───────────────────────────────────────────────────── */
  async generateDocImpl() {
    if (this.state.isGenerating) return;
    this.state.isGenerating = true;
    this.state.lastError = null;

    this.openModal('modal-gen');
    document.getElementById('modal-gen-title').textContent = 'Gerando Ficha de Implementação';
    document.getElementById('gen-model-badge').innerHTML = `
      <i data-lucide="cpu" style="width:14px;height:14px"></i>
      Modelo: ${AI_MODELS[this.state.selectedModel]?.label}
    `;
    lucide.createIcons({ nodes: [document.getElementById('gen-model-badge')] });

    const genSteps = [
      { id: 1, icon: 'file-text',   label: 'Compilando DOC-1...' },
      { id: 2, icon: 'code',        label: 'Preparando prompt de implementação...' },
      { id: 3, icon: 'zap',         label: `Chamando ${AI_MODELS[this.state.selectedModel]?.label}...` },
      { id: 4, icon: 'check-circle',label: 'Processando resposta...' },
      { id: 5, icon: 'eye',         label: 'Gerando preview...' },
      { id: 6, icon: 'sparkles',    label: 'Concluído!' },
    ];

    const renderSteps = (activeId, successIds = [], errorId = null) => {
      const total = genSteps.length;
      const done = successIds.length;
      const pct = Math.round((done / total) * 100);
      document.getElementById('gen-progress-fill').style.width = pct + '%';
      document.getElementById('gen-progress-pct').textContent = pct + '%';
      document.getElementById('gen-progress-fill').parentElement.parentElement
        .setAttribute('aria-valuenow', pct);

      document.getElementById('gen-steps-list').innerHTML = genSteps.map(s => {
        const isActive = s.id === activeId;
        const isDone = successIds.includes(s.id);
        const isError = s.id === errorId;
        const iconCls = isActive ? 'gen-step-icon spin' :
                        isDone   ? 'gen-step-icon done' :
                        isError  ? 'gen-step-icon err'  : 'gen-step-icon wait';
        const icon = isActive ? 'loader-2' : isDone ? 'check' : isError ? 'x' : 'circle';
        return `
          <div class="gen-step-item ${isActive ? 'active' : ''}">
            <i data-lucide="${icon}" class="${iconCls}" style="width:16px;height:16px"></i>
            <span class="gen-step-label">${s.label}</span>
          </div>
        `;
      }).join('');
      lucide.createIcons({ nodes: [document.getElementById('gen-steps-list')] });
    };

    const done = [];

    try {
      renderSteps(1);
      const doc1 = this.buildDoc1();
      this.state.lastDoc1 = doc1;
      await new Promise(r => setTimeout(r, 400));
      done.push(1);

      renderSteps(2, done);
      const prompt = this.buildDocImplPrompt(doc1);
      await new Promise(r => setTimeout(r, 300));
      done.push(2);

      renderSteps(3, done);
      const t0 = Date.now();
      const docImpl = await this.callAI(prompt);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      done.push(3);

      renderSteps(4, done);
      if (!docImpl || docImpl.trim().length < 200) {
        throw new Error('response too short — a IA retornou uma resposta muito curta ou vazia.');
      }
      this.state.lastDocImpl = docImpl;
      await new Promise(r => setTimeout(r, 300));
      done.push(4);

      renderSteps(5, done);
      await this.generatePreview(docImpl);
      done.push(5);

      done.push(6);
      renderSteps(null, done);

      // Salva versão
      this.saveVersion(doc1, docImpl, this.state.selectedModel);

      // Download automático
      const slug = this.B.slug || 'projeto';
      this.downloadText(docImpl, `doc-impl-${slug}.md`, 'text/markdown');

      // Notificação Windows
      this.showNotification('LandingAI', `Ficha de Implementação gerada! Projeto: ${this.B.nome_cliente}`);

      // Preview
      setTimeout(() => {
        this.closeModal('modal-gen');
        document.getElementById('preview-project-name').textContent = this.B.nome_cliente;
        document.getElementById('btn-download-docimpl').onclick = () => {
          this.downloadText(this.state.lastDocImpl, `doc-impl-${slug}.md`, 'text/markdown');
        };
        this.openModal('modal-preview');
      }, 800);

    } catch (err) {
      this.state.lastError = err.message;
      this.closeModal('modal-gen');
      this.showGenError(err, done);
      console.error('[LandingAI] generateDocImpl erro:', err);
    } finally {
      this.state.isGenerating = false;
    }
  },

  buildDocImplPrompt(doc1) {
    return `${doc1}

---

## COMANDO DE EXECUÇÃO

Leia o documento acima inteiro.

Gere a **Ficha de Implementação Completa** seguindo EXATAMENTE este formato:

1. Ordem de criação dos arquivos (FASE 1 a N)
2. Código completo de cada arquivo — sem omissões, sem "..." no meio do código
3. Design system completo: tokens Tailwind com HEX reais, escala tipográfica com clamp() reais
4. Copy palavra por palavra em cada seção — não resumir
5. Instruções de instalação e deploy
6. .env.example com todas as variáveis
7. Checklist de ação humana (o que você precisa providenciar antes do go-live)
8. Prompt de auditoria pós-implementação

O documento gerado deve ser auto-suficiente: outra IA deve conseguir construir o projeto completo lendo apenas este documento, sem fazer perguntas.

Formato da resposta: Markdown com blocos de código completos para cada arquivo.
`;
  },

  /* ─────────────────────────────────────────────────────
     PREVIEW
  ───────────────────────────────────────────────────── */
  async generatePreview(docImpl) {
    try {
      const model = AI_MODELS[this.state.selectedModel];
      const apiKey = this.state.apiKeys[model.provider];
      if (!apiKey?.trim()) throw new Error('no key');

      const previewPrompt = `Você recebeu uma Ficha de Implementação de landing page.
Gere um HTML MOCKUP simplificado — apenas Hero + 3 seções principais + Footer.

REGRAS:
- HTML em único arquivo, inline CSS, zero dependências externas
- Use as cores, fontes e copy EXATAS da ficha — não genérico
- Visual fiel ao que será implementado
- Máximo 180 linhas de HTML
- Sem JavaScript
- Mobile-first (viewport 375px)
- Output APENAS o HTML bruto, sem explicações, sem markdown

FICHA (trecho):
${docImpl.substring(0, 6000)}`;

      const html = await this.callAI(previewPrompt);
      const clean = html.replace(/```html|```/g, '').trim();

      const iframe = document.getElementById('preview-iframe');
      if (iframe) {
        const blob = new Blob([clean], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframe.src = url;

        // Botão de download do preview
        document.getElementById('btn-download-preview').onclick = () => {
          this.downloadText(clean, `preview-${this.B.slug || 'landing'}.html`, 'text/html');
        };
      }
    } catch (err) {
      // Preview falhou silenciosamente — DOC-IMPL está disponível normalmente
      const iframe = document.getElementById('preview-iframe');
      if (iframe) {
        iframe.src = 'data:text/html,<p style="font-family:sans-serif;padding:20px;color:#666">Preview não disponível — DOC-IMPL gerado com sucesso.</p>';
      }
    }
  },

  /* ─────────────────────────────────────────────────────
     ERROR MODAL
  ───────────────────────────────────────────────────── */
  showGenError(err, completedSteps = []) {
    const msg = err.message || 'Erro desconhecido';
    const errorInfo = Object.entries(ERROR_MAP).find(([key]) => msg.toLowerCase().includes(key.toLowerCase()));
    const cause = errorInfo?.[1]?.cause || 'Erro inesperado.';
    const tip   = errorInfo?.[1]?.tip   || 'Tente novamente ou use outro modelo.';

    document.getElementById('error-meta').innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;font-size:12px;color:var(--text-tertiary)">
        <i data-lucide="cpu" style="width:13px;height:13px"></i>
        Modelo: ${AI_MODELS[this.state.selectedModel]?.label}
        <span style="color:var(--border-strong)">·</span>
        Steps concluídos: ${completedSteps.length}/6
      </div>
    `;
    document.getElementById('error-message').textContent = msg;
    document.getElementById('error-cause').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:4px">
        <strong style="font-size:12px;color:var(--text-primary)">Causa provável:</strong>
        <span>${cause}</span>
        <span style="color:var(--accent2)">${tip}</span>
      </div>
    `;

    document.getElementById('btn-retry').onclick = () => {
      this.closeModal('modal-error');
      this.generateDocImpl();
    };
    document.getElementById('btn-change-model').onclick = () => {
      this.closeModal('modal-error');
      document.getElementById('btn-model-selector').click();
    };
    document.getElementById('btn-download-doc1-fallback').onclick = () => {
      this.closeModal('modal-error');
      this.downloadDoc1();
    };

    lucide.createIcons({ nodes: [document.getElementById('modal-error')] });
    this.openModal('modal-error');
  },

  /* ─────────────────────────────────────────────────────
     AI API CALLS
  ───────────────────────────────────────────────────── */
  async callAI(prompt) {
    const model = AI_MODELS[this.state.selectedModel];
    if (!model) throw new Error(`Modelo ${this.state.selectedModel} não encontrado.`);

    const apiKey = this.state.apiKeys[model.provider];
    if (!apiKey?.trim()) throw new Error(`Chave de API para