/* ============================================================
   LandingAI v2 — Screen: Review and Generation
   ============================================================ */

Object.assign(window.App, {
  // Método auxiliar para renderizar checklist
  buildReadinessChecklist() {
    const B = this.B || {};
    const validation = this.validateStructure();

    const checks = [
      { label: 'Nome do cliente', done: !!B.nome_cliente?.trim(), step: 1 },
      { label: 'Segmento de mercado', done: !!B.segmento?.trim(), step: 1 },
      { label: 'WhatsApp', done: !!B.whatsapp?.trim(), step: 2 },
      { label: 'Objetivo de conversão', done: !!B.objetivo_conversao?.trim(), step: 2 },
      { label: 'Modalidade de atendimento', done: !!B.modalidade?.trim(), step: 4 },
      { label: 'Serviço principal', done: !!B.servico_principal?.trim(), step: 5 },
      { label: 'Público-alvo definido', done: !!B.publico_primario?.trim(), step: 6 },
      { label: 'Estrutura da LP gerada', done: !!B.estrutura_lp?.trim(), step: 'Estrutura' },
      { label: 'Estrutura aprovada', done: !!B.estrutura_aprovada?.trim(), step: 'Estrutura' },
      { label: 'Direção de arte aprovada', done: !!B.arte_ficha_aprovada?.trim(), step: 'Direção de Arte' },
      { label: 'API Key configurada', done: Object.values(this.state.apiKeys).some(k => k?.trim()), step: 'Config. API' }
    ];

    const completedCount = checks.filter(c => c.done).length;
    const totalCount = checks.length;
    const percentComplete = Math.round((completedCount / totalCount) * 100);

    return `
      <div class="readiness-card">
        <div class="readiness-header">
          <h3 class="readiness-title">Prontidão para Gerar DOC-IMPL</h3>
          <div class="readiness-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percentComplete}%"></div>
            </div>
            <span class="progress-text">${percentComplete}% pronto</span>
          </div>
        </div>

        <div class="readiness-checks">
          ${checks.map(check => `
            <div class="check-item ${check.done ? 'check-done' : 'check-pending'}" 
                 onclick="${typeof check.step === 'number' ? `App.goToStep(${check.step})` : (check.step === 'Estrutura' ? "App.goToScreen('structure')" : (check.step === 'Direção de Arte' ? "App.goToScreen('art')" : "App.renderApiModal()"))}"
                 style="cursor:pointer">
              <div class="check-icon">
                <i data-lucide="${check.done ? 'check-circle' : 'circle'}" style="width:16px;height:16px;"></i>
              </div>
              <div class="check-content">
                <span class="check-label">${check.label}</span>
                <span class="check-step">${typeof check.step === 'number' ? `Step ${check.step}` : check.step}</span>
              </div>
            </div>
          `).join('')}
        </div>

        ${validation.errors.length > 0 ? `
          <div class="readiness-errors">
            <div class="error-header">
              <i data-lucide="alert-triangle" style="width:16px;height:16px;"></i>
              <span>Impedimentos:</span>
            </div>
            <ul class="error-list">
              ${validation.errors.map(err => `<li>${err}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${validation.warnings.length > 0 ? `
          <div class="readiness-warnings">
            <div class="warning-header">
              <i data-lucide="info" style="width:16px;height:16px;"></i>
              <span>Sugestões:</span>
            </div>
            <ul class="warning-list">
              ${validation.warnings.map(warn => `<li>${warn}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  },

  buildReviewScreen() {
    const B = this.B;
    const isReady = this.checkReady();
    let fichaArte = null;
    if (B.ficha_direcao_arte) {
      try {
        fichaArte = typeof B.ficha_direcao_arte === 'object'
          ? B.ficha_direcao_arte
          : JSON.parse(B.ficha_direcao_arte);
      } catch (e) {
        console.warn('ficha_direcao_arte não é JSON válido:', e.message);
        fichaArte = null;
      }
    }

    const score = this.calcGlobalScore();
    const checklist = this.buildReadinessChecklist();

    // Banner de validação de estrutura
    const estruturaAprovada = this.B?.estrutura_aprovada?.trim();
    const estruturaRascunho = this.B?.estrutura_lp?.trim();

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
            <button class="btn-primary btn-sm" onclick="App.goToScreen('structure')">
              <i data-lucide="layout" style="width:14px;height:14px;"></i> Ir para Estrutura
            </button>
          </div>
        </div>
      `;
    }

    if (!this.hasArteMinima()) {
      alertaHTML += `
        <div class="review-pending-alert" style="border-color:var(--accent2-border);background:var(--accent2-dim);margin-top:12px;">
          <i data-lucide="palette" style="width:15px;height:15px;color:var(--accent2)"></i>
          <span style="color:var(--accent2)">Identidade visual não definida. Preencha cores e fonte na <strong>Direção de Arte</strong> para exportar o DOC-1.</span>
          <button class="btn-ghost btn-sm" onclick="App.goToScreen('art')">
            Ir para Arte →
          </button>
        </div>
      `;
    }

    return `
    ${alertaHTML}
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

      <div class="review-score-breakdown" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
        ${[
          {
            label: 'Identidade Visual',
            fields: ['arte_cor_principal', 'arte_fonte_principal', 'arte_tema', 'arte_intensidade'],
            icon: 'palette',
          },
          {
            label: 'Autoridade',
            fields: ['anos_experiencia', 'formacao'],
            icon: 'award',
          },
          {
            label: 'Prova Social',
            fields: ['depoimento_1_nome', 'depoimento_1_texto', 'instagram'],
            icon: 'star',
          },
          {
            label: 'Rastreamento',
            fields: ['gtm_id'],
            icon: 'bar-chart-2',
          },
        ].map(cat => {
          const filled = cat.fields.filter(f => !!(this.B || {})[f]).length;
          const total = cat.fields.length;
          const pct = Math.round((filled / total) * 100);
          const color = pct === 100 ? 'var(--accent)' : pct === 0 ? 'var(--danger)' : 'var(--warning)';
          return `
            <div style="display:flex;align-items:center;gap:6px;font-size:11px;padding:4px 10px;border-radius:var(--r-pill);border:1px solid var(--border-default);background:var(--bg-raised);">
              <i data-lucide="${cat.icon}" style="width:12px;height:12px;color:${color}"></i>
              <span style="color:var(--text-secondary)">${cat.label}</span>
              <span style="font-family:var(--font-mono);font-size:10px;color:${color};font-weight:600">${filled}/${total}</span>
            </div>
          `;
        }).join('')}
      </div>

      ${checklist}

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
                  <span class="step-card-label">${s.title}</span>
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
                <span class="value">${App.config.models[this.state.selectedModel]?.name || '—'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Direção de Arte</span>
                <span class="value">${fichaArte ? `<span class="val-approved">Aprovada (${fichaArte.tema})</span>` : '<span class="val-pending">Pendente</span>'}</span>
              </div>
            </div>
          </div>

                    <!-- ═══ SEÇÃO: Pré-visualização da Estrutura ═══ -->
          <div class="review-estrutura-section">
            <div class="review-section-label">
              <i data-lucide="layout" style="width:14px;height:14px;color:var(--accent2)"></i>
              <span>Estrutura da Landing Page</span>
            </div>

            ${B.estrutura_lp ? `
            <div class="review-estrutura-summary-card">
               <div class="estrutura-summary-info">
                  <i data-lucide="layout-template" style="width:24px;height:24px;color:var(--accent2);opacity:0.8"></i>
                  <div>
                    <strong>${this.contarBlocos(B.estrutura_lp)} blocos gerados</strong>
                    <p style="font-size:12px;color:var(--text-tertiary)">Narrativa em 1ª pessoa configurada</p>
                  </div>
                  <button class="btn-ghost btn-sm" onclick="App.goToScreen('structure')" style="margin-left:auto;">
                    <i data-lucide="edit-3" style="width:12px;height:12px"></i>
                    Ver Blocos
                  </button>
               </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:10px;align-items:center;">
              <span class="status-badge ${B.estrutura_aprovada ? 'on' : ''}" style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;">
                ${B.estrutura_aprovada ? '✅ Estrutura Aprovada' : '⚠️ Pendente de Aprovação'}
              </span>
            </div>
            ` : `
            <div class="review-pending-alert">
              <i data-lucide="alert-triangle" style="width:15px;height:15px;color:var(--warning)"></i>
              <span>Estrutura ainda não definida.</span>
              <button class="btn-ghost btn-sm" onclick="App.goToScreen('structure')">
                Gerar Estrutura →
              </button>
            </div>
            `}
          </div>

          <div class="review-actions-hero">
            <button id="btn-generate-docimpl" class="btn-primary btn-xl" ${this.state.isGenerating || !estruturaAprovada ? 'disabled' : ''}>
              <i data-lucide="sparkles"></i>
              ${this.state.isGenerating ? 'Gerando Ficha de Implementação...' : 'Gerar Ficha de Implementação (DOC-IMPL)'}
            </button>
            <p class="review-action-hint">A IA vai ler o briefing completo e criar todo o código base, design system e copy.</p>
          </div>

          <div class="doc-info-card">
            <div class="info-header">
              <i data-lucide="info" style="width:18px;height:18px;color:var(--accent2);"></i>
              <span>O que é DOC-1?</span>
            </div>
            <p class="info-text">
              DOC-1 é um arquivo Markdown com todo o briefing estruturado. Você pode copiar este documento 
              e passar para Claude, Gemini, Grok ou qualquer IA para gerar a implementação em 4 partes.
            </p>
            <p class="info-text info-subtext">
              Não precisa de API Key. Funciona 100% externamente.
            </p>
          </div>

          <!-- Seção: Exportar DOC-1 -->
          <div class="revisao-exportar">
            <div class="doc1-header">
               <i data-lucide="file-text" style="color:var(--accent2)"></i>
               <span>Exportar DOC-1 Rico</span>
            </div>
            <div class="doc1-body">
              <p>
                Este arquivo contém todo o briefing, análise de intenção, copy e as <strong>regras técnicas da Adsgator</strong> para que uma IA externa gere o código perfeito.
              </p>
              <div class="exportar-buttons" style="display:flex; gap:12px; margin-top:12px;">
                <button
                  class="btn-primary"
                  onclick="App.baixarDoc1()"
                  title="Baixe este documento e envie para Claude ou Gemini"
                  ${!this.hasArteMinima() ? 'disabled' : ''}>
                  📥 Baixar DOC-1 (.md)
                </button>
                <button
                  class="btn-secondary"
                  onclick="App.copiarDoc1()"
                  ${!this.hasArteMinima() ? 'disabled' : ''}>
                  📋 Copiar para Clipboard
                </button>
              </div>
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

  /* ----------------------------------------------------------
     Seção de Protótipo Visual — REMOVIDA
     (gerarPrototipoVisual e showModalPrototipoFallback
      foram descontinuados nesta versão)
  ---------------------------------------------------------- */

  // Mantido apenas para compatibilidade — não faz nada
  gerarPrototipoVisual() {
    this.showToast('Geração de protótipo visual não disponível nesta versão.', 'info');
  },

  contarBlocos(estruturaRaw) {
    if (!estruturaRaw) return 0;
    try {
      const data = typeof estruturaRaw === 'string' ? JSON.parse(estruturaRaw) : estruturaRaw;
      const blocos = data?.estrutura_lp?.blocos || data?.blocos || [];
      return blocos.filter(b => b.incluir).length;
    } catch (e) {
      console.error('Erro ao contar blocos:', e);
      return 0;
    }
  },

  checkReady() {
    const missing = [];
    Object.entries(REQUIRED_FIELDS).forEach(([step, fields]) => {
      fields.forEach(f => {
        if (!this.B[f]) {
          const stepObj = STEPS.find(s => s.id == step);
          missing.push({ step, field: f, label: stepObj ? `${stepObj.title} > ${f}` : f });
        }
      });
    });
    return { ok: missing.length === 0, missing };
  },

  hasArteMinima() {
    const B = this.B || {};
    // Aprovada via IA
    if (B.arte_ficha_aprovada) return true;
    // Aprovada manualmente (campos mínimos preenchidos)
    if (B.arte_cor_principal && B.arte_fonte_principal) return true;
    return false;
  },

  // ============================================================
  // MODAL DE ALERTAS (REVISÃO)
  // ============================================================

  gerarAlertas() {
    const alertas = [];
    const B = this.B || {};

    // Validações
    if (!B.estrutura_copy || B.estrutura_copy.trim().length < 100) {
      alertas.push({
        tipo: 'warning',
        titulo: 'Copy muito curta',
        mensagem: 'A copy total tem menos de 100 caracteres. Considere expandir.',
        acao: 'editar-estrutura'
      });
    }

    if (B.estrutura_lp_blocos && B.estrutura_lp_blocos.some(b => !b.copy)) {
      alertas.push({
        tipo: 'warning',
        titulo: 'Bloco sem copy',
        mensagem: 'Um ou mais blocos não têm copy definida. Verifique antes de gerar.',
        acao: 'editar-estrutura'
      });
    }

    if (!B.arte_cor_principal) {
      alertas.push({
        tipo: 'info',
        titulo: 'Cor principal não definida',
        mensagem: 'A direção de arte não tem cor principal. Será usado preto por padrão.',
        acao: 'editar-arte'
      });
    }

    if (!B.referenciasVisuais || B.referenciasVisuais.length < 2) {
      alertas.push({
        tipo: 'info',
        titulo: 'Poucas referências',
        mensagem: 'Recomendamos pelo menos 2-3 referências visuais para melhor alinhamento.',
        acao: 'editar-arte'
      });
    }

    return alertas;
  },

  mostrarAlertas() {
    const alertas = this.gerarAlertas();

    if (alertas.length === 0) {
      this.showToast('✅ Nenhum problema detectado!', 'success');
      return;
    }

    // Preencher modal
    const container = document.getElementById('alertas-container');
    if (container) {
      container.innerHTML = alertas.map((alerta, idx) => `
        <div class="alerta-item alerta-${alerta.tipo}">
          <div class="alerta-icon">
            ${alerta.tipo === 'error' ? '❌' : alerta.tipo === 'warning' ? '⚠️' : 'ℹ️'}
          </div>
          <div class="alerta-content">
            <h4 class="alerta-titulo">${alerta.titulo}</h4>
            <p class="alerta-mensagem">${alerta.mensagem}</p>
          </div>
        </div>
      `).join('');
    }

    // Salvar ações para botão "Editar"
    this.alertasGeracaoAtivas = alertas;

    // Abrir modal
    const modal = document.getElementById('modal-alertas-geracao');
    if (modal) {
      modal.style.display = 'flex';
      // Permite o display = flex ter efeito antes da transição de opacidade
      setTimeout(() => {
        modal.classList.add('visible');
      }, 10);
    }
  },

  fecharAlertas() {
    this.alertasIgnorados = true;
    const modal = document.getElementById('modal-alertas-geracao');
    if (modal) {
      modal.classList.remove('visible');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  },

  abrirEditor() {
    // Ir para tela de edição apropriada
    const primeiroAlerta = this.alertasGeracaoAtivas?.[0];
    
    if (primeiroAlerta?.acao === 'editar-estrutura') {
      this.goToScreen('structure');
    } else if (primeiroAlerta?.acao === 'editar-arte') {
      this.goToScreen('art');
    }

    this.fecharAlertas();
  }
});
