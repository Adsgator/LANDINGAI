/* ============================================================
   LandingAI v2 — Screen: Review and Generation
   ============================================================ */

Object.assign(window.App, {
  buildReviewScreen() {
    const B = this.B;
    const isReady = this.checkReady();
    const fichaArte = B.ficha_direcao_arte ? JSON.parse(B.ficha_direcao_arte) : null;

    const score = this.calcGlobalScore();

    return `
    <div class="review-screen">
      <div class="review-header">
        <h2 class="review-title">Revisão e Geração Final</h2>
        <p class="review-subtitle">Confira os dados coletados e gere a documentação técnica para implementação.</p>
      </div>

      <!-- Barra de Progresso (Termômetro) -->
      <div class="review-score-banner">
        <div class="review-score-circle">${score}%</div>
        <div class="review-score-info">
          <div class="review-score-label">Completude do Briefing</div>
          <div class="review-score-bar-wrap">
            <div class="review-score-bar-fill" style="width:${score}%"></div>
          </div>
          <div class="review-score-sub">${score < 100 ? 'Preencha os campos obrigatórios para atingir 100%.' : 'Briefing completo e pronto para geração!'}</div>
        </div>
      </div>

      <!-- Progresso dos Steps (Agora no topo) -->
      <div class="review-steps-preview">
        <div class="review-steps-grid">
          ${STEPS.map(s => {
            const missingCount = (REQUIRED_FIELDS[s.id] || []).filter(f => !B[f]).length;
            const isDone = missingCount === 0;
            return `
              <div class="review-step-card ${isDone ? 'done' : 'incomplete'}" onclick="App.goToStep(${s.id})">
                <div class="step-card-header">
                  <span class="step-card-num">${s.id}</span>
                  <i data-lucide="${isDone ? 'check-circle' : 'circle'}" class="step-card-status"></i>
                </div>
                <div class="step-card-body">
                  <span class="step-card-label">${s.label}</span>
                  <span class="step-card-sub">${isDone ? 'Completo' : `${missingCount} pendente(s)`}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="review-grid">
        <!-- Coluna Esquerda: Status, Sumário e Ações -->
        <div class="review-main">
          ${isReady.ok ? `
            <div class="review-card-status ready">
              <i data-lucide="check-circle" class="status-icon"></i>
              <div class="status-content">
                <h3>Briefing Completo</h3>
                <p>Todos os campos obrigatórios foram preenchidos. Você pode gerar a Ficha de Implementação agora.</p>
              </div>
            </div>
          ` : `
            <div class="review-card-status warning">
              <i data-lucide="alert-circle" class="status-icon"></i>
              <div class="status-content">
                <h3>Briefing Incompleto</h3>
                <p>Alguns campos obrigatórios estão vazios. A IA pode ter alucinações se faltar contexto.</p>
                <div class="review-missing-list">
                  ${isReady.missing.map(m => `
                    <div class="review-missing-item" onclick="App.goToStep(${m.step})" style="cursor:pointer;">
                      <i data-lucide="arrow-right-circle" style="width:14px;height:14px"></i>
                      <span>${m.label}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `}

          <!-- Sumário do Projeto (Movido para cima do botão) -->
          <div class="review-summary-box">
            <div class="summary-header">Sumário do Projeto</div>
            <div class="summary-grid-compact">
              <div class="summary-item">
                <span class="label">Cliente</span>
                <span class="value">${B.nome_cliente || '—'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Segmento</span>
                <span class="value">${B.segmento || '—'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Modelo IA</span>
                <span class="value">${AI_MODELS[this.state.selectedModel]?.label || '—'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Direção de Arte</span>
                <span class="value">${fichaArte ? `<span class="val-approved">Aprovada (${fichaArte.tema})</span>` : '<span class="val-pending">Pendente</span>'}</span>
              </div>
            </div>
          </div>

          <div class="review-actions-hero">
            <button id="btn-generate-docimpl" class="btn-primary btn-xl" ${this.state.isGenerating ? 'disabled' : ''}>
              <i data-lucide="sparkles"></i>
              ${this.state.isGenerating ? 'Gerando Ficha de Implementação...' : 'Gerar Ficha de Implementação (DOC-IMPL)'}
            </button>
            <p class="review-action-hint">A IA vai ler o briefing completo e criar todo o código base, design system e copy.</p>
          </div>

          <div class="review-doc1-box">
             <div class="doc1-header">
                <i data-lucide="file-text"></i>
                <span>Documento de Briefing (DOC-1)</span>
             </div>
             <div class="doc1-body">
                <p>O DOC-1 é a versão textual organizada de tudo que foi coletado. Útil para documentação e aprovação do cliente.</p>
                <button id="btn-download-doc1" class="btn-ghost btn-sm">
                  <i data-lucide="download"></i>
                  Baixar DOC-1 (.md)
                </button>
             </div>
          </div>

          <!-- Dicas da Adsgator (Movido para o final da lista principal) -->
          <div class="review-tips-box">
            <div class="summary-header">Dicas da Adsgator</div>
            <ul class="tips-list">
              <li>Use <b>Gemini 2.5 Pro</b> ou <b>Claude</b> para projetos mais complexos.</li>
              <li>Aprovar a <b>Direção de Arte</b> ajuda a IA a ser mais precisa no design.</li>
              <li>Revise o <b>DOC-1</b> antes de enviar o link de preview para o cliente.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    `;
  },

  checkReady() {
    const missing = [];
    Object.entries(REQUIRED_FIELDS).forEach(([step, fields]) => {
      fields.forEach(f => {
        if (!this.B[f]) {
          const stepObj = STEPS.find(s => s.id == step);
          missing.push({ step, field: f, label: stepObj ? `${stepObj.label} > ${f}` : f });
        }
      });
    });
    return { ok: missing.length === 0, missing };
  },

  buildDoc1() {
    const B = this.B;
    const fichaArte = B.ficha_direcao_arte ? JSON.parse(B.ficha_direcao_arte) : null;
    
    let paleta = '';
    if (fichaArte?.paleta) {
        paleta = fichaArte.paleta.map(c => `| ${c.nome} | ${c.hex} | ${c.uso} |`).join('\n');
    }

    const integracoesList = (B.integracoes || []).map(i => `- [x] ${i}`).join('\n');

    return `
# DOC-1: BRIEFING TÉCNICO E ESTRATÉGICO
**Projeto:** ${B.nome_cliente || 'Sem Nome'}
**Data:** ${new Date().toLocaleDateString('pt-BR')}
**Agência:** Adsgator

---

## PARTE 1 — IDENTIFICAÇÃO E CONTATO

| Parâmetro | Valor |
|---|---|
| **Cliente** | ${B.nome_cliente || '—'} |
| **Marca** | ${B.nome_marca || '—'} |
| **Segmento** | ${B.segmento || '—'} |
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
${B.faq || 'Não fornecido'}

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
| **Estilo desejado** | ${B.estilo_desejado || '—'} |
| **Sensação do visitante** | ${B.sensacao_visitante || '—'} |
| **Restrições de conteúdo** | ${B.restricoes || '—'} |

---

## PARTE 6 — DIREÇÃO DE ARTE
${fichaArte ? `
### Paleta de Cores Aprovada
| Nome | HEX | Uso |
|---|---|---|
${paleta}

### Tom Visual
${fichaArte.tom_visual}

### Decisões Criativas
${(fichaArte.decisoes || []).map((d, i) => `${i + 1}. ${d}`).join('\n')}
` : `
> ⚠ Ficha de direção de arte não foi aprovada.
`}

---

## PARTE 7 — INTEGRAÇÕES ATIVAS
${integracoesList || '- [x] WhatsApp Flutuante (padrão Adsgator)'}

---

## PARTE 8 — REGRAS FIXAS ADSGATOR
${REGRAS_FIXAS_ADSGATOR}

---

## PROMPT DE AUDITORIA
${PROMPT_AUDITORIA}
`;
  }
});
