### [index.html]
- **Erro:** O arquivo ainda importa o `app.css` monolítico em vez dos novos arquivos CSS modulares.
- **Solução:** Substituir a importação única de `app.css` pelas 5 importações corretas.

- **Erro:** O HTML para o modal de renomear projeto (`#modal-rename`) não foi adicionado.
- **Solução:** Adicionar o bloco HTML do modal `#modal-rename` antes do elemento `#toast`.

- **Erro:** O card do projeto ativo na sidebar não possui o botão de renomear.
- **Solução:** Atualizar o HTML do `.project-card` para incluir o botão de renomear.

### [assets/app.js]
- **Erro:** O arquivo está vazio. Deveria conter o listener `DOMContentLoaded` que inicializa o aplicativo (`App.init()`).
- **Solução:** Adicionar o código de inicialização do aplicativo.

### [assets/js/00-config.js]
- **Erro:** A constante `STEPS` está desatualizada. Ela contém um objeto `fields` em cada step, o que não está previsto nos documentos de implementação. A versão correta, com 8 steps e sem o campo `fields`, está no `LANDINGAI-V3-DELTA.md`.
- **Solução:** Substituir a constante `STEPS` pela versão correta do `LANDINGAI-V3-DELTA.md`.

### [assets/js/01-state.js]
- **Erro:** O método `autosave()` está incompleto. Ele não contém a lógica de "flash visual" do indicador de salvamento.
- **Solução:** Atualizar o método `autosave()` para incluir a animação do indicador.

- **Erro:** Os métodos `cloneProject()`, `exportProject()` e `importProject()` não estão implementados.
- **Solução:** Adicionar os métodos `cloneProject()`, `exportProject()` e `importProject()` conforme especificado no `LANDINGAI-V3-DELTA.md`.

- **Erro:** A função `calcGlobalScore` não considera os novos campos `estrutura_aprovada` e `arte_ficha_aprovada` em seu cálculo.
- **Solução:** Atualizar `calcGlobalScore()` para incluir os pesos para os novos campos.

### [assets/js/02-api.js]
- **Erro:** O método `_callOpenAICompat` está sendo usado para o OpenRouter, em vez do `_callOpenRouter` dedicado.
- **Solução:** Corrigir o `switch` no método `callAI` para chamar `_callOpenRouter` quando o `provider` for `openrouter`.

- **Erro:** A implementação de `_callClaude` não está usando o mapa de IDs de modelo, passando o ID interno diretamente para a API.
- **Solução:** Implementar o mapa de IDs e usar o ID correto na chamada da API Claude.

- **Erro:** Os endpoints do Gemini estão incorretos, apontando para versões sem `preview`.
- **Solução:** Corrigir os endpoints do Gemini para as versões corretas.

### [assets/js/03-ui.js]
- **Erro:** A função `renderStepsNav` está completamente desatualizada, não criando a seção "Etapas Finais" e usando uma lógica antiga.
- **Solução:** Substituir `renderStepsNav` pela nova implementação do `LANDINGAI-V3-DELTA.md`.

- **Erro:** A implementação do `_renderAILog` é uma versão simplificada e antiga, faltando vários elementos visuais e de metadados.
- **Solução:** Substituir `_renderAILog` pela implementação completa do `LANDINGAI-V3-DELTA.md`.

- **Erro:** Faltam os métodos `cloneProject`, `exportProject` e `importProject` na lista de projetos (`renderProjectsList`).
- **Solução:** Adicionar os botões e chamadas de função correspondentes para clonar, exportar e importar projetos.

### [assets/js/04-handlers.js]
- **Erro:** O método `setupGlobalEvents()` está incompleto. Ele não inclui os atalhos de teclado (Ctrl/Cmd + Setas) para navegação.
- **Solução:** Adicionar os listeners de evento para os atalhos de teclado.

- **Erro:** A lógica de navegação em `goNext()` e `goPrev()` está incorreta, não seguindo o fluxo `intake → step 1–8 → estrutura → art → review`.
- **Solução:** Corrigir a lógica de `goNext()` e `goPrev()` para refletir o fluxo correto.

### [assets/js/screens/structure.js]
- **Erro:** O arquivo está completamente desatualizado e não corresponde à feature descrita no `LANDINGAI-V3-DELTA.md`. A UI está simplista, faltam as chamadas de IA corretas (`runEstruturaAnalysis`), a geração de wireframe (`gerarWireframeHTML`) e a lógica de aprovação.
- **Solução:** Substituir todo o conteúdo de `assets/js/screens/structure.js` pela implementação completa da Seção 3 do `LANDINGAI-V3-DELTA.md`.

### [assets/css/03-screens.css]
- **Erro:** O arquivo não contém os estilos para a tela de revisão (`.review-*`), que foram movidos incorretamente para `04-system.css`.
- **Solução:** Mover os estilos `.review-*` de `04-system.css` para o final de `03-screens.css`.
