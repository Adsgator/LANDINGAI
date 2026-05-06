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

  fieldLabel(field, text, required = false, optional = false) {
    const tip = FIELD_TOOLTIPS?.[field];
    return `
      <label class="field-label">
        ${text}
        ${required ? '<span class="field-required">*</span>' : ''}
        ${optional ? '<span class="field-optional">opcional</span>' : ''}
        ${tip ? `
          <span class="field-tooltip">
            <i data-lucide="info" style="width:13px;height:13px"></i>
            <span class="field-tooltip-content">${tip}</span>
          </span>
        ` : ''}
      </label>
    `;
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
    } else if (this.state.screen === 'structure') {
      title.textContent = 'Estrutura da LP';
      subtitle.textContent = 'Organização das seções e blocos';
    } else if (this.state.screen === 'review') {
      title.textContent = 'Revisão Final';
      subtitle.textContent = 'Pronto para gerar documentação';
    }

    // Update progress bar
    const total = STEPS.length + 3; // intake + steps + art + review
    let current = 0;
    if (this.state.screen === 'intake') current = 1;
    else if (this.state.screen === 'step') current = 1 + this.state.currentStep;
    else if (this.state.screen === 'structure') current = total - 2;
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
    if (apiDot) apiDot.className = `status-dot ${hasKey ? 'ok' : ''}`;
    if (apiLabel) apiLabel.textContent = hasKey ? 'API Conectada' : 'Sem API';
  },

  calcGlobalScore() {
    if (!this.B) return 0;
    const weights = {
      // Campos obrigatórios do briefing têm peso 1
      ...Object.fromEntries(Object.values(REQUIRED_FIELDS).flat().map(f => [f, 1])),
      // Novas aprovações têm peso maior
      estrutura_aprovada: 4,
      arte_ficha_aprovada: 3,
    };
    
    const fields = Object.keys(weights);
    let totalWeight = 0;
    let currentScore = 0;
    
    fields.forEach(f => {
      const weight = weights[f];
      totalWeight += weight;
      if (this.B[f]) currentScore += weight;
    });
    
    return totalWeight > 0 ? Math.round((currentScore / totalWeight) * 100) : 0;
  },

  renderStepsNav() {
    const nav = document.getElementById('steps-nav');
    if (!nav) return;

    nav.innerHTML = '';

    // Intake IA
    const intakeBtn = document.createElement('button');
    intakeBtn.className = `steps-nav-item ${this.state.screen === 'intake' ? 'active' : ''} ${this.B.briefing_bruto ? 'visited' : ''}`;
    intakeBtn.innerHTML = `
      <i data-lucide="zap" class="steps-nav-icon"></i>
      <span class="steps-nav-label">Intake IA</span>
    `;
    intakeBtn.onclick = () => this.goToScreen('intake');
    nav.appendChild(intakeBtn);

    // Steps 1-8
    STEPS.forEach(s => {
      const isActive = this.state.screen === 'step' && this.state.currentStep === s.id;
      const isDone = (REQUIRED_FIELDS[s.id] || []).every(f => !!this.B[f]);
      const btn = document.createElement('button');
      btn.className = `steps-nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`;
      btn.innerHTML = `
        <i data-lucide="${isDone && !isActive ? 'check-circle' : s.icon}" class="steps-nav-icon ${isDone && !isActive ? 'done' : ''}"></i>
        <span class="steps-nav-label">${s.label}</span>
      `;
      btn.onclick = () => this.goToStep(s.id);
      nav.appendChild(btn);
    });

    // Seção especial: Etapas Finais
    const specialLabel = document.createElement('div');
    specialLabel.className = 'sidebar-label';
    specialLabel.style.marginTop = '8px';
    specialLabel.textContent = 'Etapas Finais';
    nav.appendChild(specialLabel);

    const specialItems = [
      {
        key: 'structure',
        icon: 'layout',
        label: 'Estrutura da LP',
        done: !!this.B.estrutura_aprovada,
        active: this.state.screen === 'structure',
      },
      {
        key: 'art',
        icon: 'palette',
        label: 'Direção de Arte',
        done: !!this.B.arte_ficha_aprovada,
        active: this.state.screen === 'art',
      },
      {
        key: 'review',
        icon: 'zap',
        label: 'Revisão e Geração',
        done: false,
        active: this.state.screen === 'review',
      },
    ];

    specialItems.forEach(item => {
      const el = document.createElement('button');
      el.className = `steps-nav-item steps-nav-special ${item.active ? 'active' : ''} ${item.done ? 'visited' : ''}`;
      el.setAttribute('role', 'listitem');
      el.innerHTML = `
        <i data-lucide="${item.done && !item.active ? 'check-circle' : item.icon}"
           class="steps-nav-icon ${item.done && !item.active ? 'done' : ''}"></i>
        <span class="steps-nav-label">${item.label}</span>
        ${item.done && !item.active ? '<i data-lucide="check" class="steps-nav-done" style="width:11px;height:11px;margin-left:auto;color:var(--accent)"></i>' : ''}
      `;
      el.onclick = () => this.goToScreen(item.key);
      nav.appendChild(el);
    });

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
      { id: 'gemini', label: 'Google Gemini', icon: 'zap', hint: 'Recomendado (Flash é grátis)', link: 'https://aistudio.google.com/app/apikey' },
      { id: 'openrouter', label: 'OpenRouter', icon: 'globe', hint: 'Acesso a Claude, DeepSeek, Llama', link: 'https://openrouter.ai/keys' },
      { id: 'claude', label: 'Anthropic Claude', icon: 'cpu', hint: 'Direto (requer proxy ou tier pago)', link: 'https://console.anthropic.com/' },
      { id: 'xai', label: 'xAI (Grok)', icon: 'terminal', hint: 'Acesso direto ao Grok', link: 'https://console.x.ai/' },
      { id: 'mistral', label: 'Mistral AI', icon: 'wind', hint: 'Acesso direto à Mistral', link: 'https://console.mistral.ai/api-keys/' },
    ];

    body.innerHTML = `
      <div class="api-modal-list">
        ${providers.map(p => `
          <div class="api-field-group">
            <div class="api-field-label">
              <i data-lucide="${p.icon}" style="width:14px;height:14px"></i>
              <span>${p.label}</span>
              <a href="${p.link}" target="_blank" class="api-link" title="Obter Chave">
                <i data-lucide="external-link" style="width:12px;height:12px"></i>
              </a>
              <span class="api-field-hint">${p.hint}</span>
            </div>
            <div class="api-input-row">
              <div class="api-input-wrap" style="flex:1">
                <input type="password" class="field-input" id="api-key-${p.id}" 
                  value="${this.state.apiKeys[p.id] || ''}" placeholder="Cole sua chave aqui...">
                <button class="btn-icon" onclick="App.toggleKeyVisibility('api-key-${p.id}')">
                  <i data-lucide="eye" style="width:16px;height:16px"></i>
                </button>
              </div>
              <button class="btn-primary btn-sm" onclick="App.saveIndividualApiKey('${p.id}')">
                Salvar
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle); display:flex; justify-content:center;">
        <button class="btn-ghost btn-sm" onclick="App.closeModal('modal-api')">Fechar Configurações</button>
      </div>
    `;
    lucide.createIcons({ nodes: [body] });
  },

  saveIndividualApiKey(provider) {
    const val = document.getElementById(`api-key-${provider}`)?.value;
    if (val !== undefined) {
      this.saveApiKey(provider, val);
      this.showToast(`${provider.toUpperCase()} salva!`, 'success');
      this.updateSidebar();
    }
  },

  saveAllApiKeys() {
    ['gemini', 'openrouter', 'claude', 'xai', 'mistral'].forEach(p => {
      const val = document.getElementById(`api-key-${p}`)?.value;
      if (val !== undefined) this.saveApiKey(p, val);
    });
    this.showToast('Todas as chaves salvas!', 'success');
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

    // Cabeçalho com contagem e botão excluir tudo
    const header = document.getElementById('projects-list-header');
    if (header) {
      header.innerHTML = projects.length > 0 ? `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:12px;color:var(--text-tertiary)">${projects.length} projeto(s)</span>
          <button class="btn-ghost btn-sm" style="color:var(--danger);font-size:11px"
            onclick="App.confirmDeleteAll()">
            <i data-lucide="trash-2" style="width:12px;height:12px"></i>
            Excluir todos
          </button>
        </div>
      ` : '';
      lucide.createIcons({ nodes: [header] });
    }

    if (projects.length === 0) {
      list.innerHTML = `<p style="font-size:13px;color:var(--text-tertiary);text-align:center;padding:20px 0">Nenhum projeto ainda</p>`;
      return;
    }

    list.innerHTML = projects.map(p => {
      const date = new Date(p.updatedAt).toLocaleDateString('pt-BR');
      const isActive = p.id === this.state.activeId;
      return `
        <div class="project-list-item ${isActive ? 'active' : ''}"
          onclick="App.loadProject('${p.id}')">
          <i data-lucide="folder" class="project-list-icon" style="width:16px;height:16px;flex-shrink:0"></i>
          <div class="project-list-info">
            <div class="project-list-name">${p.name || 'Sem nome'}</div>
            <div class="project-list-meta">${p.briefing?.segmento || '—'} · ${date}</div>
          </div>
          <div class="project-list-actions" onclick="event.stopPropagation()">
            <button class="project-list-btn" onclick="App.state.activeId='${p.id}'; App.openRenameModal();" title="Renomear">
              <i data-lucide="edit-3" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-btn" onclick="App.cloneProject('${p.id}')" title="Duplicar">
              <i data-lucide="copy" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-btn" onclick="App.exportProject('${p.id}')" title="Exportar JSON">
              <i data-lucide="download" style="width:13px;height:13px"></i>
            </button>
            <button class="project-list-btn danger" onclick="App.deleteProject('${p.id}')" title="Excluir">
              <i data-lucide="trash-2" style="width:13px;height:13px"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ nodes: [list] });
  },

  confirmDeleteAll() {
    const count = Object.keys(this.state.projects).length;
    if (!count) return;
    if (confirm(`Excluir todos os ${count} projeto(s)? Esta ação não pode ser desfeita.`)) {
      this.state.projects = {};
      this.state.activeId = null;
      this.autosave();
      this.createProject('Novo Projeto');
      this.closeModal('modal-projects');
      this.showToast('Todos os projetos foram excluídos.', 'success');
    }
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
    if (log.active !== null) {
      log.done.push(log.active);
      log.stepTimes[log.active + '_end'] = Date.now();
    }
    log.active = null;
    this._renderAILog();
  },

  aiLogDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  closeAILog() {
    this.aiLogDone();
    setTimeout(() => this.closeModal('modal-gen'), 800);
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

      let stepElapsed = '';
      if (isDone && log.stepTimes[s.id + '_start'] && log.stepTimes[s.id + '_end']) {
        const ms = log.stepTimes[s.id + '_end'] - log.stepTimes[s.id + '_start'];
        stepElapsed = `<span class="log-step-time">${(ms / 1000).toFixed(1)}s</span>`;
      }

      const iconName = isActive ? 'loader-2'
        : isDone ? 'check-circle'
          : isError ? 'x-circle'
            : 'circle';

      const stateClass = isActive ? 'log-step--active'
        : isDone ? 'log-step--done'
          : isError ? 'log-step--error'
            : 'log-step--wait';

      return `
        <div class="log-step ${stateClass}">
          <i data-lucide="${iconName}" class="log-step-icon ${isActive ? 'spin' : ''}"></i>
          <span class="log-step-label">${s.label}</span>
          ${stepElapsed}
        </div>`;
    }).join('');

    const liveSection = log.liveMsg ? `
      <div class="log-live">
        <span class="log-live-dot"></span>
        <span class="log-live-msg">${log.liveMsg}</span>
      </div>` : '';

    const model = AI_MODELS[this.state.selectedModel];

    const modal = document.getElementById('modal-gen');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal modal--sm ai-log-modal">
        <div class="modal-header" style="border-bottom:none;padding-bottom:8px">
          <div class="ai-log-header">
            <div class="ai-log-title">
              <i data-lucide="cpu" style="width:16px;height:16px;color:var(--accent2)"></i>
              ${log.title}
            </div>
            <div class="ai-log-meta">
              <span class="ai-log-model">${model?.label || '—'}</span>
              <span class="ai-log-elapsed">${elapsed}s</span>
            </div>
          </div>
        </div>
        <div class="modal-body ai-log-body">
          <div class="log-progress-wrap">
            <div class="log-progress-bar">
              <div class="log-progress-fill" style="width:${pct}%"></div>
            </div>
            <span class="log-progress-pct">${pct}%</span>
          </div>
          <div class="log-steps-list">
            ${stepRows}
          </div>
          ${liveSection}
          <p class="log-hint">
            <i data-lucide="info" style="width:12px;height:12px"></i>
            Isso pode levar 30–90 segundos dependendo do modelo.
          </p>
        </div>
      </div>
    `;
    lucide.createIcons({ nodes: [modal] });
  },

  /* ── Projeto: Renomear ───────────────────────────────────────── */
  openRenameModal() {
    const p = this.P;
    if (!p) return;
    const input = document.getElementById('rename-input');
    if (input) input.value = p.name || '';
    this.openModal('modal-rename');
    if (input) setTimeout(() => input.focus(), 100);
  },

  saveProjectName() {
    const input = document.getElementById('rename-input');
    if (!input || !this.P) return;
    const newName = input.value.trim();
    if (newName) {
      this.P.name = newName;
      this.autosave();
      this.renderProjectsList();
      this.closeModal('modal-rename');
      this.showToast('Projeto renomeado', 'success');
    }
  }
});
