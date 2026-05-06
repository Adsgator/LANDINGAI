/* ============================================================
   LandingAI v2 — Screen: Review and Generation
   ============================================================ */

Object.assign(window.App, {
  buildReviewScreen() {
    const B = this.B;
    const isReady = this.checkReady();
    const fichaArte = B.ficha_direcao_arte ? JSON.parse(B.ficha_direcao_arte) : null;

    return `
    <div class="review-screen">
      <div class="review-header">
        <h2 class="review-title">Revisão e Geração Final</h2>
        <p class="review-subtitle">Confira os dados coletados e gere a documentação técnica para implementação.</p>
      </div>

      <div class="review-grid">
        <!-- Coluna Esquerda: Status e Avisos -->
        <div class="review-main">
          ${isReady.ok ? `
            <div class="review-card ready">
              <div class="review-card-icon"><i data-lucide="check-circle"></i></div>
              <div class="review-card-content">
                <h3>Briefing Pronto</h3>
                <p>Todos os campos obrigatórios foram preenchidos. Você pode gerar a Ficha de Implementação agora.</p>
              </div>
            </div>
          ` : `
            <div class="review-card warning">
              <div class="review-card-icon"><i data-lucide="alert-circle"></i></div>
              <div class="review-card-content">
                <h3>Briefing Incompleto</h3>
                <p>Alguns campos obrigatórios estão vazios. A IA pode ter alucinações se faltar contexto.</p>
                <ul class="review-missing-list">
                  ${isReady.missing.map(m => `<li data-goto-step-warn="${m.step}">${m.label}</li>`).join('')}
                </ul>
              </div>
            </div>
          `}

          <div class="review-actions-big">
            <button id="btn-generate-docimpl" class="btn-primary btn-xl" ${this.state.isGenerating ? 'disabled' : ''}>
              <i data-lucide="sparkles"></i>
              ${this.state.isGenerating ? 'Gerando...' : 'Gerar Ficha de Implementação (DOC-IMPL)'}
            </button>
            <p class="review-action-hint">A IA vai ler o briefing completo e criar todo o código base, design system e copy.</p>
          </div>

          <div class="review-doc1-box">
             <div class="review-doc1-header">
                <i data-lucide="file-text" style="width:18px;height:18px;color:var(--text-secondary)"></i>
                <span>Documento de Briefing (DOC-1)</span>
             </div>
             <div class="review-doc1-body">
                <p>O DOC-1 é a versão textual organizada de tudo que foi coletado. Útil para documentação e aprovação do cliente.</p>
                <button id="btn-download-doc1" class="btn-ghost btn-sm">
                  <i data-lucide="download" style="width:14px;height:14px"></i>
                  Baixar DOC-1 (.md)
                </button>
             </div>
          </div>
        </div>

        <!-- Coluna Direita: Sumário Rápido -->
        <aside class="review-sidebar">
          <div class="review-summary-card">
            <h3>Sumário do Projeto</h3>
            <div class="review-summary-item">
              <span class="label">Cliente:</span>
              <span class="value">${B.nome_cliente || '—'}</span>
            </div>
            <div class="review-summary-item">
              <span class="label">Segmento:</span>
              <span class="value">${B.segmento || '—'}</span>
            </div>
            <div class="review-summary-item">
              <span class="label">Modelo IA:</span>
              <span class="value">${AI_MODELS[this.state.selectedModel]?.label || '—'}</span>
            </div>
            
            <div class="form-divider"></div>
            
            <h3>Direção de Arte</h3>
            ${fichaArte ? `
              <div class="art-badge approved">Aprovada</div>
              <div class="review-summary-item">
                <span class="label">Tema:</span>
                <span class="value">${fichaArte.tema || '—'}</span>
              </div>
            ` : `
              <div class="art-badge pending">Pendente</div>
              <p style="font-size:11px;color:var(--text-tertiary);margin-top:4px">Gere a ficha de arte para melhores resultados visuais.</p>
            `}
          </div>
        </aside>
      </div>

      <div class="review-steps-preview">
        <h3>Preview dos Steps</h3>
        <div class="review-steps-grid">
          ${STEPS.map(s => {
            const missingCount = (REQUIRED_FIELDS[s.id] || []).filter(f => !B[f]).length;
            return `
              <div class="review-step-card ${missingCount > 0 ? 'incomplete' : 'complete'}" data-goto-step="${s.id}">
                <div class="review-step-num">${s.id}</div>
                <div class="review-step-info">
                  <span class="label">${s.label}</span>
                  <span class="status">${missingCount > 0 ? `${missingCount} campo(s) pendente(s)` : 'Completo'}</span>
                </div>
                <i data-lucide="chevron-right" style="width:14px;height:14px;opacity:0.5"></i>
              </div>
            `;
          }).join('')}
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
