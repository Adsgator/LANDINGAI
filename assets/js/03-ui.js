/* ============================================================
   LandingAI v2 — UI e Renderização
   ============================================================ */

Object.assign(window.App, {

  /* ----------------------------------------------------------
     Render principal
  ---------------------------------------------------------- */
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

  renderScreen(preserveScroll = false) {
    // Scroll reset — ID correto é screen-content
    const content = document.getElementById('screen-content');
    if (!content) return;
    
    const scrollPos = content.scrollTop;
    if (!preserveScroll) content.scrollTop = 0;

    if (!this.state.screen) return;

    switch (this.state.screen) {
      case 'intake': content.innerHTML = this.buildIntakeScreen(); break;
      case 'step': content.innerHTML = this.buildStepScreen(this.state.currentStep); break;
      case 'art': content.innerHTML = this.buildArtScreen(); break;
      case 'structure': content.innerHTML = this.buildStructureScreen(); break;
      case 'review': content.innerHTML = this.buildReviewScreen(); break;
      default: content.innerHTML = ''; break;
    }

    lucide.createIcons({ nodes: [content] });
    this.bindScreenEvents(content);
    this.renderBottombar();
    this.updateTopbar();

    if (preserveScroll) {
      content.scrollTop = scrollPos;
    }
  },

  /* ----------------------------------------------------------
     Topbar
  ---------------------------------------------------------- */
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
      title.textContent = s ? `Step ${s.id}: ${s.title}` : 'Briefing';
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

    // Barra de progresso
    const total = STEPS.length + 3; // intake + 8 steps + structure + art + review = 12
    let current = 0;
    if (this.state.screen === 'intake') current = 1;
    else if (this.state.screen === 'step') current = 1 + this.state.currentStep;
    else if (this.state.screen === 'structure') current = total - 2;
    else if (this.state.screen === 'art') current = total - 1;
    else if (this.state.screen === 'review') current = total;

    const pct = Math.round((current / total) * 100);
    if (fill) fill.style.width = `${pct}%`;

    // Label do modelo
    const modelLabel = document.getElementById('btn-model-label');
    if (modelLabel) modelLabel.textContent = AI_MODELS[this.state.selectedModel]?.label || 'Selecionar Modelo';
  },

  /* ----------------------------------------------------------
     Sidebar
  ---------------------------------------------------------- */
  updateSidebar() {
    const nameEl = document.getElementById('project-name');
    const segEl = document.getElementById('project-segment');
    const scoreFill = document.getElementById('project-score-fill');
    const scorePct = document.getElementById('project-score-pct');
    const apiDot = document.getElementById('sidebar-api-dot');
    const apiLabel = document.getElementById('sidebar-api-label');

    if (nameEl) nameEl.textContent = this.P ? (this.P.name || 'Sem nome') : 'Nenhum projeto';
    if (segEl) segEl.textContent = this.B?.segmento || '—';

    const score = this.calcGlobalScore();
    if (scoreFill) scoreFill.style.width = `${score}%`;
    if (scorePct) scorePct.textContent = `${score}%`;

    const keys = Object.values(this.state.apiKeys).filter(k => k?.trim());
    const hasKey = keys.length > 0;
    if (apiDot) apiDot.className = `status-dot ${hasKey ? 'ok' : ''}`;
    if (apiLabel) apiLabel.textContent = hasKey
      ? `${keys.length} API${keys.length > 1 ? 's' : ''} ativa${keys.length > 1 ? 's' : ''}`
      : 'Sem API';
  },

  calcGlobalScore() {
    if (!this.B) return 0;
    const weights = {
      ...Object.fromEntries(Object.values(REQUIRED_FIELDS).flat().map(f => [f, 1])),
      estrutura_aprovada: 4,
      arte_ficha_aprovada: 3,
    };
    const fields = Object.keys(weights);
    let total = 0, score = 0;
    fields.forEach(f => {
      total += weights[f];
      if (this.B[f]) score += weights[f];
    });
    return total > 0 ? Math.round((score / total) * 100) : 0;
  },

  updateProgressBar() {
    const score = this.calcGlobalScore();
    const fill = document.getElementById('project-score-fill');
    const pct = document.getElementById('project-score-pct');
    if (fill) fill.style.width = `${score}%`;
    if (pct) pct.textContent = `${score}%`;
  },

  /* ----------------------------------------------------------
     Nav lateral de steps
     CORRIGIDO: btn.onclick passa s.id como número inteiro,
     não como string. Isso corrige o bug onde clicar no step
     na sidebar não renderizava o conteúdo.
  ---------------------------------------------------------- */
  renderStepsNav() {
    const nav = document.getElementById('steps-nav');
    if (!nav) return;
    nav.innerHTML = '';

    // Intake IA
    const intakeBtn = document.createElement('button');
    intakeBtn.className = `steps-nav-item ${this.state.screen === 'intake' ? 'active' : ''} ${this.B?.briefing_bruto ? 'visited' : ''}`;
    intakeBtn.innerHTML = `
      <i data-lucide="zap" class="steps-nav-icon"></i>
      <span class="steps-nav-label">Intake IA</span>
    `;
    intakeBtn.addEventListener('click', () => this.goToScreen('intake'));
    nav.appendChild(intakeBtn);

    // Steps 1-8 (IDs são números)
    STEPS.forEach(s => {
      const isActive = this.state.screen === 'step' && this.state.currentStep === s.id;
      const isDone = (REQUIRED_FIELDS[s.id] || []).every(f => !!this.B[f]);
      const btn = document.createElement('button');
      btn.className = `steps-nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`;
      btn.innerHTML = `
        <i data-lucide="${isDone && !isActive ? 'check-circle' : s.icon}"
           class="steps-nav-icon ${isDone && !isActive ? 'done' : ''}"></i>
        <span class="steps-nav-label">${s.title}</span>
      `;
      // CRÍTICO: s.id é número inteiro → goToStep recebe número → aritmética funciona
      btn.addEventListener('click', () => this.goToStep(s.id));
      nav.appendChild(btn);
    });

    // Etapas Finais
    const divider = document.createElement('div');
    divider.className = 'sidebar-label';
    divider.style.marginTop = '8px';
    divider.textContent = 'Etapas Finais';
    nav.appendChild(divider);

    const specials = [
      {
        key: 'structure', icon: 'layout', label: 'Estrutura da LP',
        done: !!this.B?.estrutura_aprovada,
        active: this.state.screen === 'structure',
      },
      {
        key: 'art', icon: 'palette', label: 'Direção de Arte',
        done: !!this.B?.arte_ficha_aprovada,
        active: this.state.screen === 'art',
      },
      {
        key: 'review', icon: 'check-square', label: 'Revisão Final',
        done: false,
        active: this.state.screen === 'review',
      },
    ];

    specials.forEach(item => {
      const btn = document.createElement('button');
      btn.className = `steps-nav-item ${item.active ? 'active' : ''} ${item.done ? 'done' : ''}`;
      btn.innerHTML = `
        <i data-lucide="${item.done && !item.active ? 'check-circle' : item.icon}"
           class="steps-nav-icon ${item.done && !item.active ? 'done' : ''}"></i>
        <span class="steps-nav-label">${item.label}</span>
      `;
      btn.addEventListener('click', () => this.goToScreen(item.key));
      nav.appendChild(btn);
    });

    lucide.createIcons({ nodes: [nav] });
  },

  updateStepsNavBadges() {
    // Atualização leve sem re-render completo
    this.renderStepsNav();
  },

  /* ----------------------------------------------------------
     Bottombar
  ---------------------------------------------------------- */
  renderBottombar() {
    const prev = document.getElementById('btn-prev');
    const next = document.getElementById('btn-next');
    const center = document.getElementById('bottombar-center');
    const { screen, currentStep } = this.state;

    if (prev) {
      prev.style.visibility = screen === 'intake' ? 'hidden' : 'visible';
      prev.onclick = () => this.goPrev();
    }
    if (next) {
      if (screen === 'review') {
        next.style.display = 'none';
      } else {
        next.style.display = '';
        next.onclick = () => this.goNext();
        next.innerHTML = screen === 'art'
          ? '<i data-lucide="check-square" style="width:16px;height:16px"></i> Revisar'
          : 'Próximo <i data-lucide="arrow-right" style="width:16px;height:16px"></i>';
        lucide.createIcons({ nodes: [next] });
      }
    }
    if (center) {
      if (screen === 'step') {
        center.innerHTML = `<span style="font-size:12px;color:var(--text-tertiary);font-family:var(--font-mono)">
          ${currentStep} / ${STEPS.length}
        </span>`;
      } else {
        center.innerHTML = '';
      }
    }
  },

  /* ----------------------------------------------------------
     Navegação
  ---------------------------------------------------------- */
  goToScreen(screen) {
    this.state.screen = screen;
    this.renderAll();
  },

  goToStep(n) {
    const num = parseInt(n, 10); // garante que é número
    if (isNaN(num) || num < 1 || num > STEPS.length) return;
    this.state.screen = 'step';
    this.state.currentStep = num;
    if (this.P && !this.P.visitedSteps.includes(num)) {
      this.P.visitedSteps.push(num);
    }
    this.renderAll();
  },

  goNext() {
    const { screen, currentStep } = this.state;
    if (screen === 'intake') { this.goToStep(1); }
    else if (screen === 'step') {
      if (currentStep < STEPS.length) this.goToStep(currentStep + 1);
      else this.goToScreen('structure');
    }
    else if (screen === 'structure') { this.goToScreen('art'); }
    else if (screen === 'art') { this.goToScreen('review'); }
    else if (screen === 'review') { this.showToast('Briefing pronto para geração!', 'success'); }
  },

  goPrev() {
    const { screen, currentStep } = this.state;
    if (screen === 'review') { this.goToScreen('art'); }
    else if (screen === 'art') { this.goToScreen('structure'); }
    else if (screen === 'structure') { this.goToStep(STEPS.length); }
    else if (screen === 'step') {
      if (currentStep > 1) this.goToStep(currentStep - 1);
      else this.goToScreen('intake');
    }
  },

  /* ----------------------------------------------------------
     Modal selector de modelo — agrupado por provider
  ---------------------------------------------------------- */
  renderModelDropdown() {
    const dropdown = document.getElementById('model-dropdown');
    if (!dropdown) return;

    // Agrupa por group
    const groups = {};
    Object.entries(AI_MODELS).forEach(([id, m]) => {
      if (!groups[m.group]) groups[m.group] = [];
      groups[m.group].push({ id, ...m });
    });

    dropdown.innerHTML = Object.entries(groups).map(([groupName, models]) => `
      <div class="model-group">
        <div class="model-group-label">${groupName}</div>
        ${models.map(m => `
          <button class="model-option ${this.state.selectedModel === m.id ? 'active' : ''}"
                  data-model="${m.id}">
            <span class="model-option-label">${m.label}</span>
            <span class="model-option-tier tier-${m.tier}">${m.tier === 'free' ? 'Free' : 'Paid'}</span>
          </button>
        `).join('')}
      </div>
    `).join('');

    dropdown.querySelectorAll('[data-model]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.saveSelectedModel(btn.dataset.model);
        this.updateTopbar();
        dropdown.style.display = 'none';
        dropdown.classList.remove('open');
        this.showToast(`Modelo: ${AI_MODELS[btn.dataset.model]?.label}`, 'success');
      });
    });
  },

  /* ----------------------------------------------------------
     Modal de Config API — renderiza providers do AI_PROVIDERS
  ---------------------------------------------------------- */
  renderApiModal() {
    const body = document.getElementById('api-modal-body');
    if (!body) return;

    body.innerHTML = API_PROVIDERS.map(p => {
      const val = this.state.apiKeys[p.id] || '';
      const hasVal = !!val;
      return `
        <div class="api-provider-row">
          <div class="api-provider-header">
            <span class="api-provider-label">
              ${p.label}
              ${hasVal ? '<span class="api-badge-ok">✓</span>' : ''}
            </span>
            <a href="${p.url}" target="_blank" rel="noopener" class="api-link">
              ${p.urlLabel} <i data-lucide="external-link" style="width:11px;height:11px"></i>
            </a>
          </div>
          <p class="api-provider-hint">${p.hint}</p>
          <div class="api-input-wrap">
            <input type="password" class="field-input" id="apikey-${p.id}"
              placeholder="Cole sua API Key aqui"
              value="${val}"
              autocomplete="off"
            >
            <button class="btn-icon" onclick="App.toggleApiKeyVisibility('${p.id}')" title="Mostrar/ocultar">
              <i data-lucide="eye" style="width:14px;height:14px"></i>
            </button>
          </div>
          <button class="btn-primary btn-sm" style="margin-top:8px"
            onclick="App.saveApiKeyFromInput('${p.id}')">
            Salvar
          </button>
        </div>
      `;
    }).join('<hr style="border-color:var(--border-subtle);margin:16px 0">');

    lucide.createIcons({ nodes: [body] });
  },

  saveApiKeyFromInput(provider) {
    const input = document.getElementById(`apikey-${provider}`);
    if (!input) return;
    const success = this.saveApiKey(provider, input.value);
    if (success) {
      this.updateSidebar();
    }
  },

  toggleApiKeyVisibility(provider) {
    const input = document.getElementById(`apikey-${provider}`);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
  },

  /* ----------------------------------------------------------
     Modais (abertura/fechamento)
  ---------------------------------------------------------- */
  openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    // Para modais que usam display:none ao invés de classe
    if (el.style.display === 'none') el.style.display = '';
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('open');
  },

  /* ----------------------------------------------------------
     Toast
  ---------------------------------------------------------- */
  showToast(msg, type = 'info', duration = 3500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast toast--${type} show`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  },

  /* ----------------------------------------------------------
     AI Log modal (progresso das operações de IA)
  ---------------------------------------------------------- */
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
    const msgLog = document.getElementById('ai-log-messages');
    if (msgLog) msgLog.innerHTML = '';
    this.openModal('modal-gen');
  },

  _renderAILog() {
    const titleEl = document.getElementById('modal-gen-title');
    const listEl = document.getElementById('gen-steps-list');
    const fillEl = document.getElementById('gen-progress-fill');
    const pctEl = document.getElementById('gen-progress-pct');
    const badgeEl = document.getElementById('gen-model-badge');

    if (titleEl) titleEl.textContent = this.state.aiLog.title;
    if (badgeEl) badgeEl.textContent = AI_MODELS[this.state.selectedModel]?.label || '';

    const { steps, active, done, errors } = this.state.aiLog;
    const completedCount = done.length + errors.length;
    const pct = steps.length ? Math.round((completedCount / steps.length) * 100) : 0;

    if (fillEl) fillEl.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;

    if (listEl) {
      listEl.innerHTML = steps.map(s => {
        let cls = 'log-step--wait';
        let icon = 'clock';
        if (errors.includes(s.id)) { cls = 'log-step--error'; icon = 'alert-circle'; }
        else if (done.includes(s.id)) { cls = 'log-step--done'; icon = 'check-circle'; }
        else if (active === s.id) { cls = 'log-step--active'; icon = s.icon || 'loader'; }
        return `
          <div class="log-step ${cls}">
            <i data-lucide="${icon}" class="log-step-icon"></i>
            <span class="log-step-label">${s.label}</span>
          </div>
        `;
      }).join('');
      lucide.createIcons({ nodes: [listEl] });
    }
  },

  aiLogStep(stepId, liveMsg = '') {
    const log = this.state.aiLog;
    if (log.active !== null && !log.done.includes(log.active)) {
      log.done.push(log.active);
    }
    log.active = stepId;
    log.liveMsg = liveMsg;
    log.stepTimes[stepId] = Date.now();
    this._renderAILog();
  },

  aiLogDone() {
    const log = this.state.aiLog;
    if (log.active !== null) log.done.push(log.active);
    log.active = null;
    this._renderAILog();
  },

  aiLogError(stepId, msg) {
    const log = this.state.aiLog;
    log.errors.push(stepId || log.active);
    log.active = null;
    this._renderAILog();
  },

  closeAILog() {
    this.closeModal('modal-gen');
  },

  aiLogDelay(ms) {
    return new Promise(r => setTimeout(r, ms));
  },

  /* ----------------------------------------------------------
     Lista de projetos no modal
  ---------------------------------------------------------- */
  renderProjectsList() {
    const list = document.getElementById('projects-list');
    const header = document.getElementById('projects-list-header');
    if (!list) return;

    const projects = Object.values(this.state.projects)
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    if (header) {
      header.innerHTML = `<p style="font-size:12px;color:var(--text-tertiary);margin-bottom:12px">${projects.length} projeto(s)</p>`;
    }

    if (!projects.length) {
      list.innerHTML = '<p style="font-size:13px;color:var(--text-tertiary);text-align:center;padding:24px">Nenhum projeto ainda.</p>';
      return;
    }

    list.innerHTML = projects.map(p => {
      const isActive = p.id === this.state.activeId;
      const date = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('pt-BR') : '—';
      return `
        <div class="project-list-item ${isActive ? 'active' : ''}">
          <div class="project-list-info" onclick="App.loadProject('${p.id}')">
            <span class="project-list-name">${p.name || 'Sem nome'}</span>
            <span class="project-list-meta">${p.briefing?.segmento || '—'} · ${date}</span>
          </div>
          <div class="project-list-actions">
            <button class="btn-icon" title="Duplicar" onclick="App.cloneProject('${p.id}')">
              <i data-lucide="copy" style="width:14px;height:14px"></i>
            </button>
            <button class="btn-icon" title="Exportar" onclick="App.exportProject('${p.id}')">
              <i data-lucide="download" style="width:14px;height:14px"></i>
            </button>
            <button class="btn-icon btn-icon--danger" title="Excluir"
              onclick="if(confirm('Tem certeza que deseja excluir este projeto?')) App.deleteProject('${p.id}')">
              <i data-lucide="trash-2" style="width:14px;height:14px"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    lucide.createIcons({ nodes: [list] });
  },

  /* ----------------------------------------------------------
     Modal de renomear projeto
  ---------------------------------------------------------- */
  openRenameModal() {
    const input = document.getElementById('rename-input');
    if (input) input.value = this.P?.name || '';
    this.openModal('modal-rename');
    setTimeout(() => input?.focus(), 100);
  },
});