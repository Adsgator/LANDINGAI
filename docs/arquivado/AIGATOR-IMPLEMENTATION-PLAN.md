# AIGator — Plano de Implementação v1.0
> **Para o Roo Code.**
> Leia este documento na íntegra antes de executar qualquer ação.
> Execute as Fases em ordem. Confirme o término de cada Fase antes de começar a próxima.
> Nunca reescreva um arquivo inteiro sem necessidade — prefira mover blocos cirúrgicos.

---

## CONTEXTO DO PROJETO

- **Nome do produto:** AIGator
- **Módulo atual:** `landingai` — Gerador de Fichas de Implementação para Landing Pages
- **Módulo futuro (não implementar agora):** `google-ads` — Gerador de Campanhas Google Ads
- **Stack:** HTML + CSS + JS vanilla, sem bundler, sem build step, abre direto no browser
- **Raiz atual:** `C:\PROJETOS\ADSGATOR\LANDINGAI`

### Situação atual dos arquivos
| Arquivo | Tamanho | Problema |
|---|---|---|
| `assets/app.js` | ~170KB | Monolítico. Tudo numa função. Inviável de editar. |
| `assets/app.css` | ~61KB | Monolítico. Sem separação de responsabilidades. |
| `index.html` | ~12KB | Carrega os dois arquivos acima. |

### Objetivo desta implementação
1. Quebrar `app.js` em 7 módulos menores (máx. ~25KB cada)
2. Quebrar `app.css` em 5 arquivos temáticos
3. Atualizar `index.html` com os novos imports
4. Aplicar todas as mudanças do `LANDINGAI-V3-DELTA.md` já na nova estrutura
5. Criar pasta `modules/` preparada para o futuro módulo `google-ads`
6. Atualizar `.clinerules` com regras da nova arquitetura

---

## ESTRUTURA FINAL DE ARQUIVOS (estado desejado após implementação)

```
C:\PROJETOS\ADSGATOR\LANDINGAI\
│
├── index.html                          ← atualizado (imports novos)
├── .clinerules                         ← atualizado (regras de arquitetura)
├── .gitignore                          ← sem alteração
├── .rooignore                          ← sem alteração
├── README.md                           ← atualizar nome para AIGator
│
├── assets/
│   ├── css/
│   │   ├── 00-vars.css                 ← NOVO
│   │   ├── 01-layout.css               ← NOVO
│   │   ├── 02-components.css           ← NOVO
│   │   ├── 03-screens.css              ← NOVO
│   │   └── 04-system.css               ← NOVO
│   │
│   └── js/
│       ├── 00-config.js                ← NOVO
│       ├── 01-state.js                 ← NOVO
│       ├── 02-api.js                   ← NOVO
│       ├── 03-ui.js                    ← NOVO
│       ├── 04-handlers.js              ← NOVO
│       ├── screens/
│       │   ├── intake.js               ← NOVO
│       │   ├── steps.js                ← NOVO
│       │   ├── art.js                  ← NOVO
│       │   ├── estrutura.js            ← NOVO (feature do Delta v3)
│       │   └── review.js               ← NOVO
│       └── app.js                      ← NOVO (entry point, substitui o atual)
│
├── modules/
│   ├── README.md                       ← NOVO (documentação de como criar módulos)
│   └── google-ads/                     ← NOVO (pasta vazia com estrutura preparada)
│       ├── README.md
│       └── .gitkeep
│
├── docs/
├── output/
│   └── .gitkeep
└── scratch/
    ├── debug_html.js
    └── list_ids.js
```

---

## FASE 0 — PREPARAÇÃO (antes de mover qualquer código)

### 0.1 — Fazer backup do estado atual
```bash
# Na raiz do projeto
cp assets/app.js assets/app.BACKUP.js
cp assets/app.css assets/app.BACKUP.css
```
> ⚠️ Não commitar esses backups. Eles são só referência local durante a migração.

### 0.2 — Criar toda a estrutura de pastas e arquivos vazios
Criar os seguintes arquivos **vazios** (só o arquivo, sem conteúdo ainda):
```
assets/css/00-vars.css
assets/css/01-layout.css
assets/css/02-components.css
assets/css/03-screens.css
assets/css/04-system.css
assets/js/00-config.js
assets/js/01-state.js
assets/js/02-api.js
assets/js/03-ui.js
assets/js/04-handlers.js
assets/js/screens/intake.js
assets/js/screens/steps.js
assets/js/screens/art.js
assets/js/screens/estrutura.js
assets/js/screens/review.js
assets/js/app.js
modules/README.md
modules/google-ads/README.md
modules/google-ads/.gitkeep
```
> Confirme a criação de todos os arquivos antes de prosseguir para a Fase 1.

---

## FASE 1 — DIVISÃO DO CSS

Mover blocos do `assets/app.css` atual para os novos arquivos de CSS.
**Regra:** não alterar o CSS em si — apenas mover. Alterações só nas Fases seguintes.

### 1.1 → `assets/css/00-vars.css`
Mover do `app.css`:
- Bloco `/* ── Tokens / variáveis CSS ── */` (`:root { ... }`)
- Bloco `/* ── Reset e base ── */` (estilos de `*`, `html`, `body`)
- Bloco de fontes e tipografia base (`font-family`, definições globais)

### 1.2 → `assets/css/01-layout.css`
Mover do `app.css`:
- Bloco `/* ── App shell ── */` (`#app`, `.sidebar`, `.main`, `.content`)
- Bloco `/* ── Sidebar ── */` (`.sidebar-*`, `.project-card`, `.steps-nav`, `.steps-nav-*`)
- Bloco `/* ── Header ── */` (`.main-header`, `.screen-title`, `.header-actions`)
- Bloco `/* ── Footer / navigation buttons ── */` (`.nav-bar`, `.nav-btn`)

### 1.3 → `assets/css/02-components.css`
Mover do `app.css`:
- Bloco de botões (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-sm`, `.btn-icon`)
- Bloco de inputs e forms (`.field-group`, `.field-input`, `.field-textarea`, `.field-label`, `.field-hint`, `.field-required`, `.field-optional`, `.field-tooltip`, `.field-preview`)
- Bloco de chips (`.chip`, `.chip-group`, `.sel-card`, `.sel-cards`)
- Bloco de cards genéricos (`.card`, `.card-header`, `.card-body`)
- Bloco de modais (`.modal-overlay`, `.modal`, `.modal-header`, `.modal-body`, `.modal-footer`)
- Bloco de badges e tags (`.badge`, `.tag`)
- Bloco de upload zone (`.upload-zone`, `.upload-preview-list`)
- Bloco do toast (`.toast`, `.toast-*`)
- Bloco de separadores (`.form-divider`, `.form-row`, `.form-section-title`)
- Bloco de scrollbar customizada

### 1.4 → `assets/css/03-screens.css`
Mover do `app.css`:
- Bloco da tela de Intake (`.intake-*`)
- Bloco dos Steps (`.step-inner`, `.step-*`)
- Bloco da Direção de Arte (`.art-*`, `.ref-*`, `.ref-card`, `.palette-*`)
- Bloco de Revisão (`.review-*`, `.doc-*`, `.preview-*`)
- Bloco do Score (`.score-*`, `.project-score-*`)
- Bloco de Projetos (`.projects-*`, `.project-item`)

### 1.5 → `assets/css/04-system.css`
Mover do `app.css`:
- Bloco do AI Log (`.log-*`, `.log-step`, `.log-live`, `.log-hint`, `.log-progress-*`)
- Bloco da Estrutura (`.estrutura-*`, `.wireframe-*`, `.wf-*`, `.aprovado-banner`)
- Bloco de Steps Nav Special (`.steps-nav-special`)
- Bloco do modal de Config API (`.config-api-*`, `.api-key-row`)
- Qualquer bloco de animações e keyframes (`.pulse`, `@keyframes`)
- **Adicionar ao final** todo o CSS novo do `LANDINGAI-V3-DELTA.md` Seção 12

> Ao terminar a Fase 1: o arquivo `assets/app.css` deve estar vazio (ou pode ser deletado).
> **Não deletar ainda** — manter como backup até a Fase 5 de verificação.

---

## FASE 2 — DIVISÃO DO JS — CONSTANTES E CONFIGURAÇÃO

### 2.1 → `assets/js/00-config.js`

Mover do `app.js` atual os seguintes blocos, **na ordem**:

**1. Constante `STEPS`** — array com os 8 steps de navegação
- Substituir pelo array corrigido do `LANDINGAI-V3-DELTA.md` Seção 1.3:
```javascript
const STEPS = [
  { id: 1, label: 'Identificação',      sub: 'Nome, nicho e tipo de projeto',   icon: 'user' },
  { id: 2, label: 'Contato e CTA',      sub: 'WhatsApp, e-mail e conversão',    icon: 'phone' },
  { id: 3, label: 'Presença Digital',   sub: 'Redes sociais e plataformas',     icon: 'globe' },
  { id: 4, label: 'Atendimento',        sub: 'Modalidade, endereço, cidades',   icon: 'map-pin' },
  { id: 5, label: 'Serviço / Produto',  sub: 'O que é vendido e como funciona', icon: 'briefcase' },
  { id: 6, label: 'Público-Alvo',       sub: 'Perfil, dores e resultado',       icon: 'target' },
  { id: 7, label: 'Autoridade',         sub: 'Diferenciais e prova social',     icon: 'star' },
  { id: 8, label: 'Tom e Identidade',   sub: 'Estilo, vocabulário e restrições',icon: 'palette' },
];
```

**2. Constante `AI_MODELS`** — objeto com todos os modelos de IA
- Mover o objeto existente
- **Adicionar** os 4 modelos OpenRouter do `LANDINGAI-V3-DELTA.md` Seção 5

**3. Constante `FIELD_TOOLTIPS`** (também chamada `TOOLTIPS` no código atual)
- Substituir a versão atual pela versão completa de 48 campos do `LANDINGAI-V3-DELTA.md` Seção 7

**4. Constante `REGRAS_FIXAS_ADSGATOR`**
- Substituir a versão atual pela versão expandida do `LANDINGAI-V3-DELTA.md` Seção 8

**5. Constante `PROMPT_AUDITORIA`**
- Substituir a versão atual pela versão com checklist de 40 itens do `LANDINGAI-V3-DELTA.md` Seção 9

**6. Constante `ERROR_MAP`** — **NOVO**
- Adicionar o objeto `ERROR_MAP` do `LANDINGAI-V3-DELTA.md` Seção 1 (antes das correções de bug)

> Nenhuma função vai para este arquivo — só constantes e objetos de configuração.

---

## FASE 3 — DIVISÃO DO JS — MÓDULOS DE LÓGICA

### 3.1 → `assets/js/01-state.js`

Extrair do objeto `App` no `app.js` atual:

- Propriedade `state` (objeto com todos os campos de estado)
- Método `init()` — inicialização do app
- Método `loadState()` — carrega do localStorage
- Método `saveState()` — salva no localStorage
- Método `autosave()` — **novo do Delta v3** (flash visual do indicador)
- Método `resetProject()` — zera projeto atual
- Método `calcGlobalScore()` — **atualizar** com pesos de estrutura e arte (Delta v3 Seção 11)
- Métodos de projeto: `newProject()`, `loadProject()`, `deleteProject()`, `listProjects()`
- Métodos novos do Delta v3: `openRenameModal()`, `saveProjectName()`, `cloneProject()`, `exportProject()`, `importProject()`

> Expor como objeto global: `const State = { ... }` ou manter como parte do `App` — manter o padrão atual do código para não quebrar referências.

### 3.2 → `assets/js/02-api.js`

Extrair do `app.js` atual:

- Método `callAI(prompt, context)` — dispatcher principal
  - **Atualizar** com validação e case `openrouter` do Delta v3 Seção 5 e 6
- Método `_callGemini(prompt, model)` — **corrigir** endpoints Gemini 2.5 (Delta v3 Seção 6)
- Método `_callClaude(prompt, model)` — **corrigir** com mapa de IDs reais (Delta v3 Seção 6)
- Método `_callGrok(prompt, model)`
- Método `_callMistral(prompt, model)`
- Método `_callOpenRouter(prompt, model)` — **NOVO** (Delta v3 Seção 5)
- Método `parseAIResponse(response)` — parse genérico de resposta

### 3.3 → `assets/js/03-ui.js`

Extrair do `app.js` atual:

- Método `renderScreen(screen)` — **atualizar** com case `'estrutura'` (Delta v3 Seção 10)
- Método `renderStepsNav()` — **atualizar** com itens especiais de navegação (Delta v3 Seção 10)
- Método `goToStep(n)` / `goNext()` / `goPrev()` — **atualizar** com tela `'estrutura'` (Delta v3 Seção 10)
- Método `openModal(id)` / `closeModal(id)`
- Método `showToast(msg, type)`
- Método `renderProjectsList()`
- Método `fieldLabel(field, text, required, optional)`
- Método `updateSidebarProject()`
- Método `_renderAILog()` — **NOVO** (Delta v3 Seção 4)

### 3.4 → `assets/js/04-handlers.js`

Extrair do `app.js` atual:

- Método `setupEvents()` — todos os event listeners
- Método `setupGlobalEvents()` — **NOVO** keyboard shortcuts (Delta v3 Seção 11)
- Todos os handlers de campo: `handleFieldChange()`, `handleChipClick()`, `handleSelCardClick()`
- Handler de upload de arquivos
- Handler do WhatsApp preview
- Handler do modal de API keys

---

## FASE 4 — DIVISÃO DO JS — SCREENS

Cada arquivo de screen deve conter os métodos de build e análise daquela tela específica. Todos esses métodos atualmente existem dentro do objeto `App` — manter no mesmo objeto (não criar objetos separados ainda, pra não quebrar referências).

### 4.1 → `assets/js/screens/intake.js`
- Método `buildIntakeHTML()` ou `buildIntake()`
- Método `runIntakeAnalysis()` — **atualizar** para usar novo sistema de log (Delta v3 Seção 4)
- Método `buildIntakePrompt()` (se existir separado)

### 4.2 → `assets/js/screens/steps.js`
- Método `buildStepScreen(step)` (dispatcher)
- Método `buildStep1()` — Identificação
- Método `buildStep2()` — Contato e CTA
- Método `buildStep3()` — Presença Digital
- Método `buildStep4()` — Atendimento
- Método `buildStep5()` — Serviço / Produto
- Método `buildStep6()` — Público-Alvo
- Método `buildStep7()` — Autoridade / Diferenciais
  - **Substituir** pela versão corrigida do Delta v3 Seção 1.2 (bug de div não fechada)
- Método `buildStep8()` — Tom e Identidade
  - **Remover** o duplicado (Delta v3 Seção 1.1) — manter apenas o segundo, mais completo
- Atualizar `buildStepScreen()` com o mapeamento correto (Delta v3 Seção 1.3)

### 4.3 → `assets/js/screens/art.js`
- Método `buildArtHTML()` ou `buildArtDirection()`
- Método `runArtAnalysis()` — **atualizar** para usar novo sistema de log (Delta v3 Seção 4)
- Método `approveArt()` / `aprovarArte()`
- Método `addReference()` / `removeReference()`

### 4.4 → `assets/js/screens/estrutura.js` ← **TOTALMENTE NOVO** (Delta v3 Seção 3)
- Método `buildEstruturaHTML()` — UI da tela
- Método `runEstruturaAnalysis()` — chamada à IA
- Método `buildEstruturaPrompt()` — monta o prompt
- Método `aprovarEstrutura()` — aprova e avança
- Método `abrirEstruturaManual()` — abre editor sem análise
- Método `gerarWireframeHTML()` — gera o wireframe visual

### 4.5 → `assets/js/screens/review.js`
- Método `buildReviewHTML()` ou `buildRevision()`
- Método `generateDoc1()` — gera DOC-1
- Método `generateDocImpl()` — **atualizar** para usar novo sistema de log (Delta v3 Seção 4)
- Método `generatePreview()` — gera preview HTML
- Método `downloadFile(content, filename)`

---

## FASE 5 — AI LOG SYSTEM (Delta v3 Seção 4)

Este é um sistema transversal que deve estar em `assets/js/03-ui.js`.

Adicionar os seguintes métodos ao objeto `App` dentro de `03-ui.js`:

```javascript
// Todos os métodos abaixo são NOVOS — adicionar conforme spec do Delta v3 Seção 4
openAILog(title, steps)   // abre o modal de log com os steps definidos
aiLogStep(index, status)  // atualiza status de um step: 'active'|'done'|'error'|'wait'
aiLogError(index, msg)    // marca step como erro com mensagem
aiLogDone(summary)        // fecha o log com estado de sucesso
aiLogDelay(ms)            // utilitário: retorna Promise de delay
closeAILog()              // fecha o modal de log
_renderAILog()            // re-renderiza o conteúdo do modal de log
```

> O estado do log fica em `App.state.aiLog` — adicionar ao objeto `state` em `01-state.js`:
```javascript
aiLog: {
  open: false,
  title: '',
  steps: [],    // [{label, status, time}]
  liveText: '',
}
```

---

## FASE 6 — ATUALIZAR `index.html`

### 6.1 — Substituir o `<link>` do CSS atual
Remover:
```html
<link rel="stylesheet" href="assets/app.css">
```
Adicionar (nessa ordem exata):
```html
<link rel="stylesheet" href="assets/css/00-vars.css">
<link rel="stylesheet" href="assets/css/01-layout.css">
<link rel="stylesheet" href="assets/css/02-components.css">
<link rel="stylesheet" href="assets/css/03-screens.css">
<link rel="stylesheet" href="assets/css/04-system.css">
```

### 6.2 — Substituir o `<script>` do JS atual
Remover o `<script src="assets/app.js">` atual (ou qualquer script inline).
Adicionar antes do `</body>`, **nessa ordem exata**:
```html
<!-- AIGator — LandingAI Module -->
<script src="assets/js/00-config.js"></script>
<script src="assets/js/01-state.js"></script>
<script src="assets/js/02-api.js"></script>
<script src="assets/js/screens/intake.js"></script>
<script src="assets/js/screens/steps.js"></script>
<script src="assets/js/screens/art.js"></script>
<script src="assets/js/screens/estrutura.js"></script>
<script src="assets/js/screens/review.js"></script>
<script src="assets/js/03-ui.js"></script>
<script src="assets/js/04-handlers.js"></script>
<script src="assets/js/app.js"></script>
```

### 6.3 — Adicionar modal `#modal-rename` (Delta v3 Seção 2)
Inserir o HTML do modal de renomear projeto (conforme Delta v3 Seção 2) antes do elemento `#toast`.

### 6.4 — Atualizar card do projeto ativo na sidebar (Delta v3 Seção 2)
Adicionar botão de renomear conforme spec do Delta v3 Seção 2.

---

## FASE 7 — ENTRY POINT `assets/js/app.js`

O novo `app.js` deve conter **apenas**:

```javascript
// AIGator — LandingAI Module
// Entry point — inicialização

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
```

Mover qualquer código de inicialização que esteja no `app.js` atual para cá.

---

## FASE 8 — ARQUIVOS DE SUPORTE

### 8.1 — Atualizar `.clinerules`
Substituir o conteúdo atual por:

```
# AIGator — Regras para o Roo Code

## Arquitetura
- Este projeto tem arquivos divididos por responsabilidade. Nunca consolide em monolítico.
- Máximo de 1 arquivo de screen por tela do sistema.
- Constantes e configurações: sempre em assets/js/00-config.js.
- Chamadas de API: sempre em assets/js/02-api.js.

## Regras de edição
- Declare os arquivos que serão modificados antes de começar qualquer tarefa.
- Edite no máximo 2 arquivos por tarefa. Se precisar de mais, quebre em subtarefas.
- Nunca reescreva um arquivo inteiro — edite cirurgicamente.
- Ao adicionar nova tela: criar arquivo em assets/js/screens/novatela.js + adicionar <script> em index.html.
- Ao adicionar novo provider de IA: adicionar em assets/js/02-api.js e modelo em assets/js/00-config.js.

## Módulos futuros
- Cada módulo novo vai em modules/nome-do-modulo/
- Não misturar código de módulos diferentes.
- O módulo google-ads está reservado — não criar arquivos nele sem instrução explícita.

## Testes
- Depois de qualquer edição de JS, verificar se o app abre sem erros de console.
- Depois de qualquer edição de CSS, verificar se a tela afetada está correta visualmente.
```

### 8.2 — Criar `modules/README.md`

```markdown
# AIGator — Módulos

O sistema AIGator é composto por módulos independentes.
Cada módulo tem sua própria pasta, CSS, JS e telas.

## Módulos disponíveis

| Módulo | Status | Descrição |
|---|---|---|
| `landingai` | ✅ Ativo | Gerador de Fichas de Implementação para Landing Pages |
| `google-ads` | 🔜 Planejado | Gerador de Campanhas Google Ads completas |

## Como criar um novo módulo

1. Criar pasta `modules/nome-do-modulo/`
2. Criar `modules/nome-do-modulo/README.md`
3. Seguir estrutura do módulo `landingai` como referência
4. Registrar o módulo no `index.html` principal
```

### 8.3 — Criar `modules/google-ads/README.md`

```markdown
# AIGator — Módulo Google Ads (planejado)

## Funcionalidades previstas

### Fase 1 — Geração de Campanha
- Intake: briefing do negócio + objetivo da campanha
- Análise de IA: geração de estrutura completa da campanha
- Dashboard de saída com:
  - Palavras-chave (match types separados)
  - Grupos de anúncios
  - Anúncios RSA (títulos + descrições)
  - Extensões (sitelinks, callouts, snippets)
  - Configurações de campanha (rede, localização, lance)
  - Divisão de verba sugerida
  - Estratégia de lances recomendada
- Export em formato copy-paste direto para o Google Ads Editor

### Fase 2 — Análise e Otimização
- Input: dados de performance (CTR, CPC, conversões por ad group)
- Análise de IA: diagnóstico + recomendações de otimização
- Dashboard de otimização:
  - Palavras negativas sugeridas
  - Anúncios para pausar/criar
  - Ajustes de lance por dispositivo/horário/região
  - Score de qualidade estimado

## Dependências
- Sistema de log de IA (compartilhado com landingai)
- Sistema de API call (compartilhado com landingai)
```

### 8.4 — Atualizar `README.md` raiz
- Substituir título `LandingAI v2` por `AIGator`
- Adicionar seção sobre arquitetura modular
- Manter todo o resto

---

## FASE 9 — VERIFICAÇÃO FINAL

Após completar todas as Fases:

### 9.1 — Checklist de JS
- [ ] Abrir `index.html` no browser sem erros de console
- [ ] Criar novo projeto — funciona?
- [ ] Renomear projeto — funciona?
- [ ] Preencher Step 1 — salva no localStorage?
- [ ] Navegar entre Steps 1–8 — todos renderizam corretamente?
- [ ] Tela de Intake — análise de IA funciona?
- [ ] Tela de Estrutura — renderiza? análise funciona?
- [ ] Tela de Arte — renderiza? análise funciona?
- [ ] Tela de Revisão — DOC-1 gera? DOC-IMPL gera?
- [ ] Modal de API config — abre? salva chaves?
- [ ] Sistema de Log de IA — aparece durante análises?

### 9.2 — Checklist de CSS
- [ ] Sidebar aparece corretamente
- [ ] Steps nav com itens especiais (Estrutura)
- [ ] Tela de Estrutura com wireframe
- [ ] Modal de rename de projeto
- [ ] AI Log modal com steps e progress bar
- [ ] Responsivo (sidebar colapsa em telas menores)

### 9.3 — Limpeza
- Deletar `assets/app.BACKUP.js`
- Deletar `assets/app.BACKUP.css`
- Deletar `assets/app.js` original (o novo está em `assets/js/app.js`)
- Deletar `assets/app.css` original (o novo está em `assets/css/`)

---

## MAPA DE DEPENDÊNCIAS (ordem de carregamento)

```
00-config.js          ← sem dependências
    ↓
01-state.js           ← depende de 00-config
    ↓
02-api.js             ← depende de 00-config, 01-state
    ↓
screens/intake.js     ← depende de 00-config, 02-api
screens/steps.js      ← depende de 00-config
screens/art.js        ← depende de 00-config, 02-api
screens/estrutura.js  ← depende de 00-config, 02-api
screens/review.js     ← depende de 00-config, 01-state, 02-api
    ↓
03-ui.js              ← depende de tudo acima
    ↓
04-handlers.js        ← depende de tudo acima
    ↓
app.js                ← entry point, depende de tudo
```

---

## REFERÊNCIAS

- **Delta v3:** `LANDINGAI-V3-DELTA.md` — todas as mudanças a aplicar durante a migração
- **Snapshot atual:** `project_snapshot.md` — estado atual do projeto antes da migração
- **CSS novo:** Delta v3 Seção 12 — vai inteiro para `assets/css/04-system.css`
- **Modais novos:** Delta v3 Seção 2 — vai no `index.html`
- **Métodos novos de projeto:** Delta v3 Seção 2 — vão em `assets/js/01-state.js`
- **Tela Estrutura completa:** Delta v3 Seção 3 — vai em `assets/js/screens/estrutura.js`
- **AI Log System:** Delta v3 Seção 4 — vão em `assets/js/03-ui.js`
- **OpenRouter:** Delta v3 Seção 5 — vai em `assets/js/02-api.js`
