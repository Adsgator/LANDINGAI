# IMPLEMENTAÇÃO 02 — Conclusão da Tela de Estrutura LP
## Validação + Banner de Alerta

**Arquivo alvo:** `assets/js/04-handlers.js`  
**Arquivo alvo:** `assets/js/screens/review.js`  
**Risco:** BAIXO  
**Depende de:** ETAPA 1 (já implementada)

---

## O QUE MUDA

1. `generateDocImpl()` — adiciona validação de estrutura aprovada
2. `buildReviewScreen()` — mostra banner de alerta se estrutura não está aprovada
3. Botão de gerar DOC-IMPL fica desabilitado sem estrutura válida

---

## PARTE A — `assets/js/04-handlers.js`

### A1 — Encontrar `generateDocImpl()` e adicionar validação no início

**Localizar** (linha ~6338):

```javascript
async generateDocImpl() {
  const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
  if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }
```

**Substituir por:**

```javascript
async generateDocImpl() {
  // Validar estrutura aprovada
  const estruturaAprovada = this.B?.estrutura_aprovada?.trim();
  if (!estruturaAprovada) {
    this.showToast('⚠️ Aprove a Estrutura antes de gerar o DOC-IMPL.', 'warning');
    return;
  }

  // Validar estrutura tem blocos
  const rascunho = this.B?.estrutura_rascunho?.trim();
  if (!rascunho) {
    this.showToast('⚠️ Gere uma Estrutura antes de continuar.', 'warning');
    return;
  }

  // Contar blocos (procura por "### BLOCO")
  const blocoCount = (rascunho.match(/###\s+BLOCO\s+\d+:/gi) || []).length;
  if (blocoCount < 5) {
    this.showToast(`⚠️ Estrutura incompleta (${blocoCount} blocos). Mínimo 5 blocos obrigatório.`, 'warning');
    return;
  }

  const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
  if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }
```

---

## PARTE B — `assets/js/screens/review.js`

### B1 — Encontrar `buildReviewScreen()` e adicionar banner de alerta

Procure por onde a tela de review é renderizada (busque por `buildReviewScreen`). 

No começo do retorno/renderização da screen, adicione:

```javascript
// Banner de validação de estrutura
const estruturaAprovada = this.B?.estrutura_aprovada?.trim();
const estruturaRascunho = this.B?.estrutura_rascunho?.trim();

let alertaHTML = '';
if (!estruturaAprovada || !estruturaRascunho) {
  alertaHTML = `
    <div class="review-alert review-alert--warning">
      <div class="alert-header">
        <i data-lucide="alert-circle" style="width:20px;height:20px;color:var(--warning);"></i>
        <span class="alert-title">Estrutura Pendente</span>
      </div>
      <p class="alert-message">
        Você precisa ${!estruturaRascunho ? 'gerar' : 'aprovar'} a Estrutura da Landing Page antes de gerar o DOC-IMPL.
      </p>
      <div class="alert-actions">
        <button class="btn-primary btn-sm" onclick="App.goToScreen('estrutura')">
          <i data-lucide="layout" style="width:14px;height:14px;"></i> Ir para Estrutura
        </button>
      </div>
    </div>
  `;
}
```

Depois, encontre onde o HTML da screen é construído (procure por algo como `html += ...` ou `return html + ...`) e coloque `alertaHTML` **logo no início**, antes de qualquer outro conteúdo.

Se a screen usa template literal, fica assim:

```javascript
return `
${alertaHTML}

<!-- resto do conteúdo da review -->
<div class="review-container">
  ...
</div>
`;
```

---

### B2 — Desabilitar botão de gerar DOC-IMPL se estrutura não está aprovada

Procure por onde o botão `#btn-generate-impl` é renderizado. Adicione um atributo `disabled`:

**Encontrar:**

```javascript
<button class="btn-primary btn-lg" id="btn-generate-impl">
  <i data-lucide="zap" style="width:16px;height:16px;"></i> Gerar DOC-IMPL
</button>
```

**Substituir por:**

```javascript
<button class="btn-primary btn-lg" id="btn-generate-impl" ${estruturaAprovada ? '' : 'disabled'}>
  <i data-lucide="zap" style="width:16px;height:16px;"></i> Gerar DOC-IMPL
</button>
```

**Nota:** Se o botão está desabilitado, seu texto pode ficar opaco. Isso é normal — o CSS já trata disso com `button:disabled { opacity: 0.5; cursor: not-allowed; }`.

---

## PARTE C — CSS — `assets/css/03-screens.css`

Adicione ao final do arquivo:

```css
/* ============================================================
   Review Screen — Alert Banner
   ============================================================ */

.review-alert {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
  background: rgba(245, 158, 11, 0.08);
  border-color: var(--warning);
  margin-bottom: 1.5rem;
}

.review-alert--warning {
  background: rgba(245, 158, 11, 0.08);
  border-color: var(--warning);
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--warning);
}

.alert-message {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Desabilitar botão */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

button:disabled:hover {
  background: var(--bg-secondary);
}
```

---

## CHECKLIST DE VALIDAÇÃO

Após implementar, testar:

- [ ] Na tela de Revisão, se estrutura não foi aprovada, mostra banner laranja
- [ ] Banner diz "Estrutura Pendente" e tem botão "Ir para Estrutura"
- [ ] Botão "Gerar DOC-IMPL" fica desabilitado (cinzento) sem estrutura aprovada
- [ ] Ao clicar em "Ir para Estrutura", vai para a tela de estrutura
- [ ] Após gerar e aprovar estrutura, banner desaparece
- [ ] Botão "Gerar DOC-IMPL" fica habilitado (verde)
- [ ] Clicando no botão agora funciona normalmente

---

## RESULTADO

✅ Impossível gerar DOC-IMPL sem estrutura válida  
✅ Usuário vê claramente o que falta fazer  
✅ UX melhorada com avisos visuais  

Próxima etapa: **ETAPA 2 — Arquivos de Configuração**
