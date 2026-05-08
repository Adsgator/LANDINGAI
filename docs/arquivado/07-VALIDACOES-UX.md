# IMPLEMENTAÇÃO 07 — Validações Mínimas + Checklist Final
## Garantir estrutura viável antes de gerar DOC-IMPL

**Arquivo alvo:** `assets/js/04-handlers.js`  
**Arquivo alvo:** `assets/js/screens/review.js`  
**Risco:** BAIXO  
**Depende de:** ETAPA 1-5

---

## O QUE MUDA

1. `validateStructure()` — novo método que valida estrutura mínima
2. `generateDocImpl()` — chama validação antes de gerar
3. `renderReviewScreen()` — mostra checklist visual de pronto

---

## PARTE A — Adicionar `validateStructure()` em `04-handlers.js`

Procure por um bom lugar para adicionar (após `buildDoc1()` ou antes de `generateDocImpl()`):

```javascript
validateStructure() {
  const B = this.B || {};
  const errors = [];
  const warnings = [];

  // ===== VALIDAÇÕES CRÍTICAS (Erros) =====

  // 1. Verificar estrutura aprovada
  if (!B.estrutura_aprovada || !B.estrutura_aprovada.trim()) {
    errors.push('Estrutura não foi aprovada. Vá para "Estrutura LP" e aprove antes de gerar.');
  }

  // 2. Verificar rascunho existe
  if (!B.estrutura_rascunho || !B.estrutura_rascunho.trim()) {
    errors.push('Nenhuma estrutura foi gerada. Clique em "Gerar Estrutura" primeiro.');
  }

  // 3. Contar blocos
  const rascunho = B.estrutura_rascunho || '';
  const blocos = (rascunho.match(/###\s+BLOCO\s+\d+:/gi) || []).length;
  
  if (blocos < 5) {
    errors.push(\`Estrutura incompleta: apenas \${blocos} blocos encontrados. Mínimo 5 obrigatório.\`);
  }

  if (blocos > 12) {
    warnings.push(\`Estrutura grande demais: \${blocos} blocos. Considere consolidar (máximo recomendado: 9).\`);
  }

  // 4. Verificar Hero está no começo
  if (!rascunho.match(/###\s+BLOCO\s+2:.*HERO/i)) {
    warnings.push('Bloco 2 não parece ser o Hero. Verifique a ordem dos blocos.');
  }

  // 5. Verificar CTA Final e Rodapé
  const ultimoBloco = rascunho.match(/###\s+BLOCO\s+(\d+):/gi);
  const numUltimo = ultimoBloco ? ultimoBloco.length : 0;
  
  if (numUltimo > 0) {
    const temCTAFinal = rascunho.match(/###\s+BLOCO\s+\d+:.*CTA|AÇÃO FINAL/i);
    const temRodape = rascunho.match(/###\s+BLOCO\s+\d+:.*RODAPÉ|FOOTER/i);
    
    if (!temCTAFinal) {
      warnings.push('Não encontrado bloco de CTA Final. Considere adicionar.');
    }
    
    if (!temRodape) {
      warnings.push('Não encontrado bloco de Rodapé. Considere adicionar.');
    }
  }

  // ===== VALIDAÇÕES DE ENTRADA (Steps) =====

  // 6. Verificar que dados obrigatórios existem
  const nomeCliente = B.nome_cliente?.trim();
  if (!nomeCliente) {
    errors.push('Nome do cliente não foi preenchido (Step 1).');
  }

  const segmento = B.segmento?.trim();
  if (!segmento) {
    errors.push('Segmento de mercado não foi preenchido (Step 2).');
  }

  const atorPrincipal = B.ator_principal?.trim();
  if (!atorPrincipal) {
    errors.push('Cliente ideal não foi definido (Step 3).');
  }

  const diferenciais = B.diferenciais?.trim();
  if (!diferenciais) {
    warnings.push('Diferenciais não foram preenchidos (Step 5) — recomendado para melhor copy.');
  }

  const dirArteAprovada = B.direcao_arte_aprovada?.trim();
  if (!dirArteAprovada) {
    warnings.push('Direção de arte não foi aprovada (Step 8) — recomendado para consistência visual.');
  }

  // ===== VALIDAÇÕES DE API =====

  // 7. Verificar API Key
  const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
  if (!hasKey) {
    errors.push('Nenhuma API Key foi configurada. Vá em Config. API e adicione uma chave.');
  }

  // ===== RETORNAR RESULTADO =====

  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    stats: {
      blocos: blocos,
      nomeCliente: nomeCliente || '—',
      segmento: segmento || '—',
      apiConfigured: hasKey,
    }
  };
},
```

---

## PARTE B — Atualizar `generateDocImpl()` para usar validação

Procure por `generateDocImpl()`:

```javascript
async generateDocImpl() {
  // Adicionar no INÍCIO:
  
  // Validar estrutura
  const validation = this.validateStructure();
  
  if (!validation.valid) {
    // Mostrar primeiro erro
    this.showToast(\`❌ \${validation.errors[0]}\`, 'error');
    return;
  }

  // Avisar sobre warnings (se houver)
  if (validation.warnings.length > 0) {
    console.warn('[AIGator] Warnings de validação:', validation.warnings);
  }

  // Se passou na validação, continuar normalmente...
  const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
  if (!hasKey) { 
    this.showToast('Configure uma API Key primeiro.', 'warning'); 
    return; 
  }

  // ... resto do código de generateDocImpl() continua igual
}
```

---

## PARTE C — Adicionar Checklist Visual na tela Review

### C1 — Criar componente de checklist

No arquivo `assets/js/screens/review.js`, procure por onde a screen é renderizada e adicione:

```javascript
// Método auxiliar para renderizar checklist
buildReadinessChecklist() {
  const B = this.B || {};
  const validation = this.validateStructure();

  const checks = [
    {
      label: 'Nome do cliente',
      done: !!B.nome_cliente?.trim(),
      step: 'Step 1'
    },
    {
      label: 'Segmento de mercado',
      done: !!B.segmento?.trim(),
      step: 'Step 2'
    },
    {
      label: 'Cliente ideal (ator)',
      done: !!B.ator_principal?.trim(),
      step: 'Step 3'
    },
    {
      label: 'Problemas e desejos',
      done: !!B.problemas?.trim(),
      step: 'Step 4'
    },
    {
      label: 'Diferenciais da marca',
      done: !!B.diferenciais?.trim(),
      step: 'Step 5'
    },
    {
      label: 'Estrutura da LP gerada',
      done: !!B.estrutura_rascunho?.trim(),
      step: 'Estrutura'
    },
    {
      label: 'Estrutura aprovada',
      done: !!B.estrutura_aprovada?.trim(),
      step: 'Estrutura'
    },
    {
      label: 'Direção de arte aprovada',
      done: !!B.direcao_arte_aprovada?.trim(),
      step: 'Direção de Arte'
    },
    {
      label: 'API Key configurada',
      done: Object.values(this.state.apiKeys).some(k => k?.trim()),
      step: 'Config. API'
    }
  ];

  const completedCount = checks.filter(c => c.done).length;
  const totalCount = checks.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  const checklistHTML = \`
    <div class="readiness-card">
      <div class="readiness-header">
        <h3 class="readiness-title">Prontidão para Gerar DOC-IMPL</h3>
        <div class="readiness-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: \${percentComplete}%"></div>
          </div>
          <span class="progress-text">\${percentComplete}% pronto</span>
        </div>
      </div>

      <div class="readiness-checks">
        \${checks.map(check => \`
          <div class="check-item \${check.done ? 'check-done' : 'check-pending'}">
            <div class="check-icon">
              <i data-lucide="\${check.done ? 'check-circle-2' : 'circle'}" style="width:16px;height:16px;"></i>
            </div>
            <div class="check-content">
              <span class="check-label">\${check.label}</span>
              <span class="check-step">\${check.step}</span>
            </div>
          </div>
        \`).join('')}
      </div>

      \${validation.errors.length > 0 ? \`
        <div class="readiness-errors">
          <div class="error-header">
            <i data-lucide="alert-triangle" style="width:16px;height:16px;color:var(--error);"></i>
            <span>Problemas encontrados:</span>
          </div>
          <ul class="error-list">
            \${validation.errors.map(err => \`<li>\${err}</li>\`).join('')}
          </ul>
        </div>
      \` : ''}

      \${validation.warnings.length > 0 ? \`
        <div class="readiness-warnings">
          <div class="warning-header">
            <i data-lucide="alert-circle" style="width:16px;height:16px;color:var(--warning);"></i>
            <span>Recomendações:</span>
          </div>
          <ul class="warning-list">
            \${validation.warnings.map(warn => \`<li>\${warn}</li>\`).join('')}
          </ul>
        </div>
      \` : ''}
    </div>
  \`;

  return checklistHTML;
},
```

### C2 — Adicionar checklist ao HTML da review

Na renderização da tela de review, adicione o checklist **antes** dos botões de ação:

```javascript
// Em buildReviewScreen() ou renderReviewScreen():

const checklist = this.buildReadinessChecklist();

// Inserir no HTML antes de "Gerar DOC-IMPL"
return \`
  \${alertaHTML}
  
  \${checklist}
  
  <!-- resto da review -->
\`;
```

---

## PARTE D — Adicionar CSS para Checklist

Em `assets/css/03-screens.css`, adicione:

```css
/* ============================================================
   Review Screen — Readiness Checklist
   ============================================================ */

.readiness-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  margin-bottom: 2rem;
}

.readiness-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.readiness-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.readiness-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
  min-width: 150px;
}

.progress-bar {
  width: 150px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.3s ease;
  border-radius: 99px;
}

.progress-text {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
}

.readiness-checks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.check-item.check-done {
  background: rgba(16, 185, 129, 0.08);
}

.check-item.check-pending {
  background: rgba(255, 255, 255, 0.02);
}

.check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text-secondary);
}

.check-item.check-done .check-icon {
  color: var(--accent);
}

.check-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.check-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.check-item.check-pending .check-label {
  color: var(--text-secondary);
}

.check-step {
  font-size: 11px;
  color: var(--text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

/* Errors */
.readiness-errors {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.error-header,
.warning-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  font-weight: 600;
  color: var(--error);
}

.warning-header {
  color: var(--warning);
}

.error-list,
.warning-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.error-list li,
.warning-list li {
  font-size: 12.5px;
  color: var(--text-secondary);
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.4;
}

.error-list li::before,
.warning-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--text-disabled);
  font-weight: 700;
}

/* Warnings */
.readiness-warnings {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
}
```

---

## PARTE E — Adicionar método auxiliar para ir ao step específico

Se não existir, adicionar em `04-handlers.js`:

```javascript
goToStep(stepNum) {
  this.B.current_step = stepNum;
  this.setField('current_step', stepNum);
  this.renderScreen();
},

goToScreen(screenName) {
  this.B.current_screen = screenName;
  this.setField('current_screen', screenName);
  this.renderScreen();
},
```

---

## CHECKLIST DE VALIDAÇÃO

Após implementar:

- [ ] `validateStructure()` existe e funciona
- [ ] Retorna errors array e warnings array
- [ ] `generateDocImpl()` chama validação antes de gerar
- [ ] Se houver erros, toast com primeiro erro aparece
- [ ] Checklist visual aparece na review
- [ ] Checklist mostra progresso em %
- [ ] Checklist marca itens como ✓ quando completo
- [ ] Erros aparecem em caixa vermelha
- [ ] Warnings aparecem em caixa laranja
- [ ] Clicando em "Ir para Step X", vai para esse step
- [ ] Clicando em "Ir para Estrutura", vai para estrutura

---

## TESTE PRÁTICO

1. Preencha todos os 8 steps
2. Vá para Review
3. Checklist deve estar ~70% completo (faltando direção de arte)
4. Vá para "Direção de Arte" e aprove
5. Volta para Review
6. Checklist deve estar 100%
7. Clique "Gerar DOC-IMPL"
8. Deve funcionar normalmente

**Teste com dados incompletos:**

1. Não preencha o segmento (Step 2)
2. Vá para Review
3. Checklist deve mostrar "Segmento não preenchido"
4. Tentar gerar DOC-IMPL
5. Toast deve dizer "Segmento de mercado não foi preenchido (Step 2)"

Se passar, validações estão ok! ✅

---

## RESULTADO

✅ Validação previne erros antes de gerar  
✅ Checklist visual orienta usuário  
✅ Erros são claros e acionáveis  
✅ Sistema é robusto e à prova de falhas

Próxima etapa: **ETAPA 7 — UX Improvements (FINAL)**
