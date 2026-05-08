# IMPLEMENTAÇÃO 05 — Fluxo de Estrutura (Limpeza Final)
## Remover Wireframe Antigo + Finalizar Refino

**Arquivo alvo:** `assets/js/screens/estrutura.js`  
**Arquivo alvo:** `assets/js/04-handlers.js`  
**Risco:** BAIXO  
**Depende de:** ETAPA 1

---

## O QUE MUDA

1. `estrutura.js` — remover função `gerarWireframeHTML()` completamente
2. `renderEstrutura()` — remover qualquer referência a wireframe
3. `04-handlers.js` — remover campo `estrutura_wireframe` do state
4. HTML da screen — limpar qualquer elemento de wireframe antigo

---

## PARTE A — Limpar `estrutura.js`

### A1 — Procurar e DELETAR `gerarWireframeHTML()`

**Localizar** a função (é gigante, linha ~132-540):

```javascript
gerarWireframeHTML(rascunho) {
  // Centenas de linhas de código...
  return `<div class="wireframe-preview">...</div>`;
}
```

**Ação:** Deletar TUDO — desde `gerarWireframeHTML() {` até o fechamento `}` (inclusive a vírgula ou ponto-e-vírgula depois).

### A2 — Procurar por `estrutura_wireframe` em todo o arquivo

**Buscar por:** `estrutura_wireframe`

Deve encontrar:
- `this.setField('estrutura_wireframe', ...)`
- `this.B.estrutura_wireframe`
- etc

**Para cada ocorrência:** deletar a linha inteira ou a referência.

Se aparecer em um método que salva dados, remover apenas a linha que referencia wireframe:

**Exemplo:**
```javascript
// ANTES
this.setField('estrutura_rascunho', resultado);
this.setField('estrutura_wireframe', html);

// DEPOIS
this.setField('estrutura_rascunho', resultado);
```

### A3 — Limpar `renderEstrutura()`

Procure por `renderEstrutura()` em `estrutura.js`:

```javascript
renderEstrutura() {
  // Renderiza a coluna direita da tela de estrutura
}
```

Dentro deste método, se houver referência a wireframe, remova. 

A renderização agora deve ser apenas:
1. Seção de geração (botão "Gerar Estrutura")
2. Coluna de visualização (cards de blocos via `renderBlocosVisuais()`)
3. Seção de aprovação (botão "Aprovar")

Se houver código como:

```javascript
if (this.B.estrutura_wireframe) {
  // mostrar wireframe
} else if (this.B.estrutura_rascunho) {
  // mostrar blocos
}
```

**Remover** o bloco de `if (this.B.estrutura_wireframe)` completamente. Deixar apenas:

```javascript
if (this.B.estrutura_rascunho) {
  // mostrar blocos via renderBlocosVisuais()
}
```

---

## PARTE B — Limpar `04-handlers.js`

### B1 — Procurar por todas as referências a `estrutura_wireframe`

**Buscar por:** `estrutura_wireframe`

Encontrará em:
- `runEstruturaAnalysis()` — já foi atualizado na ETAPA 1
- `refinarEstrutura()` — já foi atualizado na ETAPA 1
- Possível initialização de state

### B2 — Remover do state initial (se existir)

Procure por onde o state inicial é definido (busque por `B: {`):

```javascript
this.B = {
  // ...
  estrutura_rascunho: '',
  estrutura_wireframe: '',  // ← DELETAR ESTA LINHA
  estrutura_aprovada: '',
  // ...
};
```

Remover `estrutura_wireframe: '',` completamente.

### B3 — Verificar `buildImplPromptParte1()`

Na função `buildImplPromptParte1()`, verificar se há referência a wireframe.

Não deve haver nenhuma. Se houver algo tipo `${B.estrutura_wireframe}`, remover.

---

## PARTE C — Limpar HTML da Screen

### C1 — Em `assets/js/screens/estrutura.js` (na renderização HTML)

Procure por elementos tipo:

```javascript
<div class="estrutura-wireframe-section">
  <h3>Pré-visualização</h3>
  <div id="wireframe-preview"></div>
</div>
```

**Deletar** completamente.

### C2 — Remover CSS não utilizado

Em `assets/css/03-screens.css`, procure por CSS de wireframe:

```css
.wireframe-preview {
  ...
}

.wireframe-section {
  ...
}

/* etc */
```

**Deletar** todos os estilos de wireframe.

---

## PARTE D — Verificar que `refinarEstrutura()` está perfeito

O método já foi implementado na ETAPA 1. Apenas confirme:

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
    { id: 2, icon: 'refresh-cw', label: 'Aplicando ajustes...' },
    { id: 3, icon: 'check-circle', label: 'Estrutura refinada!' },
  ]);

  try {
    this.aiLogStep(1);
    await this.aiLogDelay(300);

    const prompt = \`
Você é um Copywriter Sênior especializado em landing pages de alta conversão.

## ESTRUTURA ATUAL DA LANDING PAGE

\${rascunhoAtual}

---

## FEEDBACK DO CLIENTE

"\${feedback}"

---

## SUA TAREFA

Analise o feedback e refine a estrutura mantendo o formato original.

REGRAS:
1. Aplique EXATAMENTE as mudanças pedidas no feedback
2. Mantenha os blocos não mencionados IDÊNTICOS ao original
3. SEMPRE use 1ª pessoa do singular em toda a copy
4. Mantenha o mesmo formato de saída (### BLOCO N: Nome)
5. Retorne a estrutura COMPLETA — todos os blocos, não só os alterados
6. CTAs sempre específicos, nunca genéricos
    \`.trim();

    this.aiLogStep(2);
    const resultado = await this.callAI(prompt);

    this.setField('estrutura_rascunho', resultado);

    if (feedbackInput) feedbackInput.value = '';

    this.aiLogStep(3);
    await this.aiLogDelay(400);

    this.aiLogDone();
    this.closeAILog();
    this.renderScreen();
    this.showToast('✓ Estrutura refinada com sucesso!', 'success');
  } catch (err) {
    this.aiLogError(this.state.aiLog.active, err.message);
    setTimeout(() => {
      this.closeAILog();
      this.showToast('Erro ao refinar: ' + err.message, 'error');
    }, 1200);
  }
}
```

Se está assim, perfeito! ✅

---

## PARTE E — Atualizar UI da tela de Estrutura

Na renderização da tela, certifique-se de que o fluxo é:

1. **Seção 1: Gerar**
   - Botão "Gerar Estrutura"
   - Descrição: "Clique para gerar estrutura com 6-9 blocos"

2. **Seção 2: Visualizar + Refinar**
   - Cards de blocos (via `renderBlocosVisuais()`)
   - Campo de feedback: "Descreva ajustes desejados"
   - Botão "Refinar com IA"

3. **Seção 3: Aprovar**
   - Botão "Aprovar Estrutura"
   - Banner de sucesso se aprovado

**Não deve haver** nenhuma seção de wireframe.

---

## PARTE F — Atualizar listeners de botões

No método onde os listeners são registrados (busque por `addEventListener`), certifique-se de:

```javascript
// Botão de gerar
document.getElementById('btn-gerar-estrutura')?.addEventListener('click', () => {
  this.runEstruturaAnalysis();
});

// Botão de refinar
document.getElementById('btn-refinar-estrutura')?.addEventListener('click', () => {
  this.refinarEstrutura();
});

// Botão de aprovar
document.getElementById('btn-aprovar-estrutura')?.addEventListener('click', () => {
  this.aprovarEstrutura();
});

// Botão de reeditar
document.getElementById('btn-reeditar-estrutura')?.addEventListener('click', () => {
  this.B.estrutura_aprovada = '';
  this.renderScreen();
});
```

Se faltar algum, adicione.

---

## PARTE G — Remover qualquer inicialização de wireframe

Procure por:
- `this.B.estrutura_wireframe = ''`
- `estrutura_wireframe: ''`
- `localStorage.getItem('estrutura_wireframe')`

**Deletar todas as ocorrências.**

---

## CHECKLIST DE LIMPEZA

- [ ] Função `gerarWireframeHTML()` foi deletada
- [ ] Nenhuma referência a `estrutura_wireframe` no código
- [ ] HTML não tem elemento `.estrutura-wireframe-section`
- [ ] CSS não tem `.wireframe-preview`, `.wireframe-section`, etc
- [ ] `renderEstrutura()` mostra apenas blocos (cards)
- [ ] `refinarEstrutura()` funciona e salva corretamente
- [ ] Botões de refinar e aprovar estão funcionando
- [ ] Nada quebrou — build passa sem erros

---

## TESTE PRÁTICO

1. Abra a tela de Estrutura
2. Clique "Gerar Estrutura" — deve aparecer cards de blocos
3. Veja os blocos aparecerem (5-9 cards coloridos)
4. Digite feedback no campo
5. Clique "Refinar com IA"
6. Blocos devem atualizar com feedback aplicado
7. Clique "Aprovar Estrutura"
8. Banner verde deve aparecer
9. Clique "Reeditar" para voltar
10. Fluxo todo funciona sem travamentos

Se tudo isso passar, limpeza está 100% ok! ✅

---

## RESULTADO

✅ Código limpo — sem código legado  
✅ Nenhuma referência a wireframe antigo  
✅ Refino iterativo funciona perfeitamente  
✅ Performance melhorada (menos DOM rendering)  
✅ Estrutura pronta para passar adiante

Próxima etapa: **ETAPA 5 — Consistência entre Partes**
