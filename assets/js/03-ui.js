/* ============================================================
   LandingAI v2 — UI e Renderização
   ============================================================ */

Object.assign(window.App, {
  renderAll() {
    this.renderScreen();
    this.renderStepsNav();
    this.updateTopbar();
    this.updateSidebar();
    this.renderBottombar();
  },

  renderScreen() {
    const container = document.getElementById('screen-content');
    if (!this.state.screen || !container) return;

    switch (this.state.screen) {
      case 'intake': container.innerHTML = this.buildIntakeScreen(); break;
      case 'step': container.innerHTML = this.buildStepScreen(this.state.currentStep); break;
      case 'art': container.innerHTML = this.buildArtScreen(); break;
      case 'structure': container.innerHTML = this.buildStructureScreen(); break;
      case 'review': container.innerHTML = this.buildReviewScreen(); break;
    }

    lucide.createIcons({ nodes: [container] });
    this.bindScreenEvents(container);
    this.renderBottombar();
    container.scrollTo(0, 0);
  },

  updateTopbar() {
    const title = document.getElementById('topbar-title');
    const subtitle = document.getElementById('topbar-subtitle');
    const fill = document.getElementById('topbar-progress-fill');
    
    if (!title) return;

    if (this.state.screen === 'intake') {
      title.textContent = 'Intake Inteligente';
      subtitle.textContent = 'Análise de material bruto';
    } else if (this.state.screen === 'step') {
      const s = STEPS.find(s => s.id === this.state.currentStep);
      title.textContent = s ? `Step ${s.id}: ${s.label}` : 'Briefing';
      subtitle.textContent = s ? s.sub : '';
    } else if (this.state.screen === 'art') {
      title.textContent = 'Direção de Arte';
      subtitle.textContent = 'Identidade visual e referências';
    } else if (this.state.screen === 'review') {
      title.textContent = 'Revisão Final';
      subtitle.textContent = 'Pronto para gerar documentação';
    }

    // Update progress bar
    const total = STEPS.length + 3; // intake + steps + art + review
    let current = 0;
    if (this.state.screen === 'intake') current = 1;
    else if (this.state.screen === 'step') current = 1 + this.state.currentStep;
    else if (this.state.screen === 'art') current = total - 1;
    else if (this.state.screen === 'review') current = total;
    
    const pct = Math.round((current / total) * 100);
    if (fill) fill.style.width = `${pct}%`;

    // Model label
    const modelLabel = document.getElementById('btn-model-label');
    if (modelLabel) modelLabel.textContent = AI_MODELS[this.state.selectedModel]?.label || 'Selecionar Modelo';
  },

  updateSidebar() {
    const nameEl = document.getElementById('project-name');
    const segmentEl = document.getElementById('project-segment');
    const scoreFill = document.getElementById('project-score-fill');
    const scorePct = document.getElementById('project-score-pct');
    const apiDot = document.getElementById('sidebar-api-dot');
    const apiLabel = document.getElementById('sidebar-api-label');

    if (nameEl) nameEl.textContent = this.P ? (this.P.name || 'Sem nome') : 'Nenhum projeto';
    if (segmentEl) segmentEl.textContent = this.B ? (this.B.segmento || '—') : '—';

    // Calc score
    const score = this.calcGlobalScore();
    if (scoreFill) scoreFill.style.width = `${score}%`;
    if (scorePct) scorePct.textContent = `${score}%`;

    // API status
    const hasKey = this.state.apiKeys['gemini'] || this.state.apiKeys['openrouter'];
    if (apiDot) apiDot.className = `status-dot ${hasKey ? 'online' : ''}`;
    if (apiLabel) apiLabel.textContent = hasKey ? 'API Conectada' : 'Sem API';
  },

  calcGlobalScore() {
    if (!this.B) return 0;
    const fields = Object.values(REQUIRED_FIELDS).flat();
    const filled = fields.filter(f => !!this.B[f]).length;
    return Math.round((filled / fields.length) * 100);
  },

  renderStepsNav() {
    const nav = document.getElementById('steps-nav');
    if (!nav) return;

    nav.innerHTML = `
      <div class="nav-item ${this.state.screen === 'intake' ? 'active' : ''}" onclick="App.goToScreen('intake')">
        <i data-lucide="zap" class="nav-icon"></i>
        <span>Intake IA</span>
      </div>
      ${STEPS.map(s => {
        const isActive = this.state.screen === 'step' && this.state.currentStep === s.id;
        const isDone = (REQUIRED_FIELDS[s.id] || []).every(f => !!this.B[f]);
        return `
          <div class="nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" onclick="App.goToStep(${s.id})">
            <i data-lucide="${s.icon}" class="nav-icon"></i>
            <span>${s.label}</span>
            ${isDone ? '<i data-lucide="check" class="nav-done-icon"></i>' : ''}
          </div>
        `;
      }).join('')}
      <div class="nav-item ${this.state.screen === 'art' ? 'active' : ''}" onclick="App.goToScreen('art')">
        <i data-lucide="palette" class="nav-icon"></i>
        <span>Direção de Arte</span>
      </div>
      <div class="nav-item ${this.state.screen === 'structure' ? 'active' : ''}" onclick="App.goToScreen('structure')">
        <i data-lucide="layout" class="nav-icon"></i>
        <span>Estrutura LP</span>
      </div>
      <div class="nav-item ${this.state.screen === 'review' ? 'active' : ''}" onclick="App.goToScreen('review')">
        <i data-lucide="file-check" class="nav-icon"></i>
        <span>Revisão Final</span>
      </div>
    `;
    lucide.createIcons({ nodes: [nav] });
  },

  renderBottombar() {
    const bar = document.getElementById('bottombar');
    if (!bar) return;

    const isFirst = this.state.screen === 'intake';
    const isLast = this.state.screen === 'review';

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (btnPrev) btnPrev.style.visibility = isFirst ? 'hidden' : 'visible';
    if (btnNext) {
        btnNext.innerHTML = isLast ? 'Concluir <i data-lucide="check" style="width:16px;height:16px"></i>' : 'Próximo <i data-lucide="arrow-right" style="width:16px;height:16px"></i>';
        lucide.createIcons({ nodes: [btnNext] });
    }
  },

  openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('open');
  },

  closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('open');
  },

  showToast(msg, type = 'info') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.classList.remove('show'), 3000);
  },

  renderApiModal() {
    const body = document.getElementById('api-modal-body');
    if (!body) return;

    const providers = [
      { id: 'gemini', label: 'Google Gemini', icon: 'zap', hint: 'Recomendado (Flash é grátis)' },
      { id: 'openrouter', label: 'OpenRouter', icon: 'globe', hint: 'Acesso a Claude, DeepSeek, Llama' },
      { id: 'claude', label: 'Anthropic Claude', icon: 'cpu', hint: 'Direto (requer proxy ou tier pago)' },
    ];

    body.innerHTML = `
      <div class="api-modal-list">
        ${providers.map(p => `
          <div class="api-field-group">
            <div class="api-field-label">
              <i data-lucide="${p.icon}" style="width:14px;height:14px"></i>
              <span>${p.label}</span>
              <span class="api-field-hint">${p.hint}</span>
            </div>
            <div class="api-input-wrap">
              <input type="password" class="field-input" id="api-key-${p.id}" 
                value="${this.state.apiKeys[p.id] || ''}" placeholder="Cole sua chave aqui...">
              <button class="btn-icon" onclick="App.toggleKeyVisibility('api-key-${p.id}')">
                <i data-lucide="eye" style="width:16px;height:16px"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="modal-footer" style="margin-top:20px;padding:0">
        <button class="btn-primary" onclick="App.saveAllApiKeys()" style="width:100%">
          Salvar Configurações
        </button>
      </div>
    `;
    lucide.createIcons({ nodes: [body] });
  },

  saveAllApiKeys() {
    ['gemini', 'openrouter', 'claude'].forEach(p => {
      const val = document.getElementById(`api-key-${p}`)?.value;
      if (val !== undefined) this.saveApiKey(p, val);
    });
    this.showToast('Configurações salvas!', 'success');
    this.closeModal('modal-api');
    this.updateSidebar();
  },

  toggleKeyVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  renderModelDropdown() {
    const wrap = document.getElementById('model-dropdown');
    if (!wrap) return;

    const groups = {};
    Object.entries(AI_MODELS).forEach(([key, model]) => {
      if (!groups[model.group]) groups[model.group] = [];
      groups[model.group].push({ key, ...model });
    });

    wrap.innerHTML = Object.entries(groups).map(([group, models]) => `
      <div class="model-group-label">${group}</div>
      ${models.map(m => `
        <button class="model-option ${this.state.selectedModel === m.key ? 'active' : ''}"
          onclick="App.selectModel('${m.key}')">
          <span class="model-option-name">${m.label}</span>
          <span class="model-tier model-tier--${m.tier}">${m.tier === 'free' ? 'Grátis' : 'Pago'}</span>
        </button>
      `).join('')}
      <div class="model-divider"></div>
    `).join('');
  },

  selectModel(key) {
    this.state.selectedModel = key;
    this.saveStorage();
    const btn = document.getElementById('btn-model-label');
    if (btn) btn.textContent = AI_MODELS[key]?.label || key;
    const dd = document.getElementById('model-dropdown');
    if (dd) dd.style.display = 'none';
    this.showToast(`Modelo: ${AI_MODELS[key]?.label}`, 'success');
    this.updateTopbar();
  },

  renderProjectsList() {
    const list = document.getElementById('projects-list');
    if (!list) return;

    const projects = Object.values(this.state.projects).sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    if (projects.length === 0) {
      list.innerHTML = `<p style="font-size:13px;color:var(--text-tertiary);text-align:center;padding:20px">Nenhum projeto ainda</p>`;
      return;
    }

    list.innerHTML = projects.map(p => {
      const date = new Date(p.updatedAt).toLocaleDateString('pt-BR');
      const isActive = p.id === this.state.activeId;
      return `
        <div class="project-list-item ${isActive ? 'active-project' : ''}"
          onclick="App.loadProject('${p.id}')">
          <div class="project-list-info">
            <div class="project-list-name">${p.name || 'Sem nome'}</div>
            <div class="project-list-meta">${p.briefing?.segmento || '—'} · ${date}</div>
          </div>
          <div class="project-list-actions" onclick="event.stopPropagation()">
            <button class="project-list-action" onclick="App.cloneProject('${p.id}')" title="Duplicar">
              <i data-lucide="copy" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-action danger" onclick="App.deleteProject('${p.id}')" title="Excluir">
              <i data-lucide="trash-2" style="width:13px;height:13px"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ nodes: [list] });
  },

  /* ── AI Log System (V3 Delta) ────────────────────────────────── */
  openAILog(title, steps) {
    this.state.aiLog = {
      title,
      steps,
      active: null,
      done: [],
      errors: [],
      startedAt: Date.now(),
      stepTimes: {},
      liveMsg: '',
    };
    this._renderAILog();
    this.openModal('modal-gen');
  },

  aiLogStep(id, liveMsg = '') {
    const log = this.state.aiLog;
    if (log.active !== null) {
      log.done.push(log.active);
      log.stepTimes[log.active + '_end'] = Date.now();
    }
    log.active = id;
    log.liveMsg = liveMsg;
    log.stepTimes[id + '_start'] = Date.now();
    this._renderAILog();
  },

  aiLogError(id, msg = '') {
    const log = this.state.aiLog;
    log.errors.push(id);
    log.active = null;
    log.liveMsg = msg;
    this._renderAILog();
  },

  aiLogDone() {
    const log = this.state.aiLog;
    if (log.active !== null) log.done.push(log.active);
    log.active = null;
    this._renderAILog();
  },

  _renderAILog() {
    const log = this.state.aiLog;
    const total = log.steps.length;
    const done = log.done.length;
    const pct = Math.round((done / total) * 100);
    const elapsed = log.startedAt ? ((Date.now() - log.startedAt) / 1000).toFixed(1) : '0.0';

    const stepRows = log.steps.map(s => {
      const isActive = log.active === s.id;
      const isDone = log.done.includes(s.id);
      const isError = log.errors.includes(s.id);
      
      const iconName = isActive ? 'loader-2' : isDone ? 'check-circle' : isError ? 'x-circle' : 'circle';
      const stateClass = isActive ? 'log-step--active' : isDone ? 'log-step--done' : isError ? 'log-step--error' : 'log-step--wait';

      return `
        <div class="log-step ${stateClass}">
          <i data-lucide="${iconName}" class="log-step-icon ${isActive ? 'spin' : ''}"></i>
          <span class="log-step-label">${s.label}</span>
        </div>`;
    }).join('');

    const modal = document.getElementById('modal-gen');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal modal--sm ai-log-modal">
        <div class="modal-header">
          <span class="modal-title">${log.title}</span>
        </div>
        <div class="modal-body">
          <div class="log-progress-wrap">
             <div class="log-progress-bar"><div class="log-progress-fill" style="width:${pct}%"></div></div>
             <span class="log-progress-pct">${pct}%</span>
          </div>
          <div class="log-steps-list">${stepRows}</div>
          ${log.liveMsg ? `<div class="log-live"><span class="log-live-msg">${log.liveMsg}</span></div>` : ''}
          <div class="log-footer-meta">Tempo decorrido: ${elapsed}s</div>
        </div>
      </div>
    `;
    lucide.createIcons({ nodes: [modal] });
  }
});
