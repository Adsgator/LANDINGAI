# LANDINGAI v3 — Lista de Tarefas de Implementação

Este documento detalha as tarefas a serem implementadas com base na análise do `docs/LANDINGAI-V3-DELTA.md`.

```markdown
- [ ] **1. Correções de Bug Imediatas**
  - [ ] **1.1 Remover `buildStep8()` duplicado**
    - [ ] Localizar e deletar o bloco de código de `buildStep8()` entre as linhas ~809 e ~866 em [`assets/app.js`](assets/app.js).
  - [ ] **1.2 Bug do `buildStep7()` — div não fechada**
    - [ ] Substituir o conteúdo completo da função `buildStep7()` pelo código fornecido no `docs/LANDINGAI-V3-DELTA.md` em [`assets/app.js`](assets/app.js).
  - [ ] **1.3 `buildStepHTML` mapeamento incorreto**
    - [ ] Atualizar o objeto `builders` dentro de `buildStepHTML` com o mapeamento correto dos steps em [`assets/app.js`](assets/app.js).
    - [ ] Atualizar a constante `STEPS` no topo do arquivo para corresponder ao novo fluxo de 8 steps em [`assets/app.js`](assets/app.js).

- [ ] **2. Nomear Projeto — Card e Estado**
  - [ ] **2.1 Campo de nome no topo da sidebar**
    - [ ] Modificar o método `createProject()` para incluir o `setTimeout(() => this.openRenameModal(), 100);` em [`assets/app.js`](assets/app.js).
    - [ ] Adicionar os métodos `openRenameModal()` e `saveProjectName()` em [`assets/app.js`](assets/app.js).
    - [ ] Adicionar o HTML do modal `#modal-rename` no [`index.html`](index.html), antes do `<!-- Toast -->`.
    - [ ] Adicionar o botão de renomear ao card do projeto ativo na sidebar no [`index.html`](index.html).
    - [ ] Adicionar o botão de renomear em cada item da lista de projetos dentro de `renderProjectsList()` em [`assets/app.js`](assets/app.js).

- [ ] **3. Nova Tela: Estrutura da LP**
  - [ ] **3.1 Visão geral** (sem ação de codificação, apenas compreensão)
  - [ ] **3.2 Atualizar fluxo de navegação**
    - [ ] Modificar `goNext()` para direcionar para a tela `estrutura` após o último step em [`assets/app.js`](assets/app.js).
    - [ ] Modificar `goPrev()` para navegar corretamente para a tela `estrutura` e para o último step em [`assets/app.js`](assets/app.js).
    - [ ] Adicionar o `case 'estrutura':` em `renderScreen()` para chamar `this.buildEstruturaHTML()` em [`assets/app.js`](assets/app.js).
    - [ ] Adicionar o `case 'estrutura':` em `updateTopbar()` para definir título e subtítulo da tela em [`assets/app.js`](assets/app.js).
  - [ ] **3.3 Adicionar 'estrutura' ao nav da sidebar**
    - [ ] Inserir o item de navegação para 'Estrutura da LP' em `renderStepsNav()` após os 8 steps e antes de 'art' em [`assets/app.js`](assets/app.js).
  - [ ] **3.4 `buildEstruturaHTML()` — implementação completa**
    - [ ] Adicionar o método `buildEstruturaHTML()` completo em [`assets/app.js`](assets/app.js).
  - [ ] **3.5 `runEstruturaAnalysis()` — lógica de chamada**
    - [ ] Adicionar os métodos `runEstruturaAnalysis()`, `buildEstruturaPrompt()`, `aprovarEstrutura()`, `abrirEstruturaManual()` em [`assets/app.js`](assets/app.js).
  - [ ] **3.6 `gerarWireframeHTML()` — wireframe SVG inline**
    - [ ] Adicionar o método `gerarWireframeHTML()` em [`assets/app.js`](assets/app.js).

- [ ] **4. Sistema de Log de IA — Redesign Completo**
  - [ ] **4.1 Visão geral** (sem ação de codificação, apenas compreensão)
  - [ ] **4.2 Estado global de log**
    - [ ] Adicionar o objeto `aiLog` ao `this.state` em [`assets/app.js`](assets/app.js).
  - [ ] **4.3 Métodos do sistema de log**
    - [ ] Adicionar os métodos `openAILog()`, `aiLogStep()`, `aiLogError()`, `aiLogDone()`, `aiLogDelay()`, `closeAILog()`, `_renderAILog()` em [`assets/app.js`](assets/app.js).
  - [ ] **4.4 Atualizar `generateDocImpl()` para usar o novo sistema**
    - [ ] Substituir a lógica de log existente em `generateDocImpl()` pelo novo sistema de log de IA em [`assets/app.js`](assets/app.js).
  - [ ] **4.5 Atualizar `runIntakeAnalysis()` para usar o novo sistema**
    - [ ] Substituir a lógica de progresso existente em `runIntakeAnalysis()` pelo novo sistema de log de IA em [`assets/app.js`](assets/app.js).
  - [ ] **4.6 Atualizar `runArtAnalysis()` para usar o novo sistema**
    - [ ] Substituir a lógica de progresso existente em `runArtAnalysis()` pelo novo sistema de log de IA em [`assets/app.js`](assets/app.js).

- [ ] **5. OpenRouter — Novo Provider**
  - [ ] **5.1 Adicionar ao `AI_MODELS`**
    - [ ] Adicionar os quatro modelos OpenRouter (`openrouter-sonnet`, `openrouter-gemini-pro`, `openrouter-deepseek`, `openrouter-llama`) ao objeto `AI_MODELS` em [`assets/app.js`](assets/app.js).
  - [ ] **5.2 Adicionar `_callOpenRouter()` ao `callAI()`**
    - [ ] Adicionar o `case 'openrouter':` no `switch` dentro de `callAI()` em [`assets/app.js`](assets/app.js).
    - [ ] Adicionar o novo método `_callOpenRouter()` em [`assets/app.js`](assets/app.js).
  - [ ] **5.3 Campo de API Key para OpenRouter no modal de API**
    - [ ] Adicionar o HTML para o campo "OpenRouter API Key" no `renderApiModal()` em [`assets/app.js`](assets/app.js).
    - [ ] Adicionar `this.state.apiKeys.openrouter = ...` em `saveApiConfig()` em [`assets/app.js`](assets/app.js).

- [ ] **6. Correções nos Providers Existentes**
  - [ ] **6.1 Claude: model ID correto**
    - [ ] Adicionar o `MODEL_IDS` e usar `realModelId` no método `_callClaude()` em [`assets/app.js`](assets/app.js).
  - [ ] **6.2 Gemini: endpoint e API key validation**
    - [ ] Atualizar os endpoints dos modelos Gemini 2.5 no objeto `AI_MODELS` em [`assets/app.js`](assets/app.js).
    - [ ] Adicionar a validação de `apiKey` no início do método `callAI()` em [`assets/app.js`](assets/app.js).
  - [ ] **6.3 `ERROR_MAP` expandido**
    - [ ] Adicionar a constante `ERROR_MAP` antes do objeto `App` em [`assets/app.js`](assets/app.js).

- [ ] **7. `FIELD_TOOLTIPS` Completo**
  - [ ] Substituir o objeto `FIELD_TOOLTIPS` completo pelo conteúdo fornecido em [`assets/app.js`](assets/app.js).

- [ ] **8. `REGRAS_FIXAS_ADSGATOR` Expandido**
  - [ ] Substituir a constante `REGRAS_FIXAS_ADSGATOR` completa pelo conteúdo fornecido em [`assets/app.js`](assets/app.js).

- [ ] **9. `PROMPT_AUDITORIA` Expandido**
  - [ ] Substituir a constante `PROMPT_AUDITORIA` completa pelo conteúdo fornecido em [`assets/app.js`](assets/app.js).

- [ ] **10. Fluxo de Navegação Atualizado**
  - [ ] **Sidebar nav — itens especiais**
    - [ ] Adicionar a lógica para renderizar os itens especiais de navegação (`estrutura`, `art`, `review`) em `renderStepsNav()` após o loop dos 8 steps em [`assets/app.js`](assets/app.js).

- [ ] **11. Melhorias de UX e Polimento**
  - [ ] **11.1 Autosave indicator animado**
    - [ ] Modificar o método `autosave()` para incluir a animação do indicador de salvamento em [`assets/app.js`](assets/app.js).
  - [ ] **11.2 `cloneProject()` no modal de projetos**
    - [ ] Adicionar o método `cloneProject(id)` em [`assets/app.js`](assets/app.js).
    - [ ] Adicionar o botão de clonar em cada item da lista de projetos no `renderProjectsList()` em [`assets/app.js`](assets/app.js`).
  - [ ] **11.3 Importar/exportar JSON**
    - [ ] Adicionar os métodos `exportProject(id)` e `importProject(input)` em [`assets/app.js`](assets/app.js).
    - [ ] Conectar `importProject` ao `<input type="file" id="import-file-input">` existente no [`index.html`](index.html).
  - [ ] **11.4 Keyboard shortcut para salvar e navegar**
    - [ ] Modificar o método `setupGlobalEvents()` para incluir os atalhos de teclado (Ctrl/Cmd + ArrowRight/Left e Escape para fechar modais) e fechar modal ao clicar no overlay em [`assets/app.js`](assets/app.js).
  - [ ] **11.5 Score ponderado: incluir 'estrutura_aprovada' e 'arte_ficha_aprovada'**
    - [ ] Adicionar os pesos `estrutura_aprovada: 4` e `arte_ficha_aprovada: 3` ao objeto `weights` em `calcGlobalScore()` em [`assets/app.js`](assets/app.js).

- [ ] **12. CSS Adicional Necessário**
  - [ ] Adicionar todos os blocos CSS fornecidos na seção 12 ao final do arquivo [`assets/app.css`](assets/app.css).