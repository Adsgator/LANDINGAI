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
    if (modelLabel) modelLabel.textContent = App.config.models[this.state.selectedModel]?.name || 'Selecionar Modelo';
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

    // Agrupa por provedor (novo padrão)
    const groups = {};
    Object.keys(this.config.models).forEach(id => {
      const m = this.config.models[id];
      const provider = this.config.providers.find(p => p.id === m.provider);
      const groupName = provider ? provider.label : m.provider;
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push({ id, ...m });
    });

    dropdown.innerHTML = Object.entries(groups).map(([groupName, models]) => `
      <div class="model-group">
        <div class="model-group-label">${groupName}</div>
        ${models.map(m => {
          const hasKey = !!(localStorage.getItem(`api_key_${m.id}`) || this.state.apiKeys[m.provider]);
          return `
          <button class="model-option ${this.state.selectedModel === m.id ? 'active' : ''}"
                  data-model="${m.id}">
            <span class="model-option-label">
              ${m.name}
              ${hasKey ? '<span class="model-badge-ok">✓</span>' : ''}
            </span>
            <span class="model-option-tier ${m.freeModel ? 'tier-free' : 'tier-paid'}">${m.freeModel ? 'Grátis' : 'Pago'}</span>
          </button>
        `;}).join('')}
      </div>
    `).join('');

    dropdown.querySelectorAll('[data-model]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.saveSelectedModel(btn.dataset.model);
        this.updateTopbar();
        dropdown.style.display = 'none';
        this.showToast(`Modelo: ${this.config.models[btn.dataset.model]?.name}`, 'success');
      });
    });
  },

  /* ----------------------------------------------------------
     Modal de Config API — renderiza providers do AI_PROVIDERS
  ---------------------------------------------------------- */
  renderApiModal() {
    const body = document.getElementById('api-modal-body');
    if (!body) return;

    body.innerHTML = `
      <div class="api-modal-intro" style="margin-bottom:20px; font-size:13px; color:var(--text-secondary);">
        Configure as chaves de API abaixo. Você pode configurar uma chave para cada provedor ou 
        clicar em um modelo específico no seletor para configurar uma chave dedicada.
      </div>
      ${this.config.providers.map(p => {
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
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button class="btn-primary btn-sm" onclick="App.saveApiKeyFromInput('${p.id}')">
                Salvar
              </button>
            </div>
          </div>
        `;
      }).join('<hr style="border-color:var(--border-subtle);margin:16px 0">')}
    `;

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
    if (badgeEl) badgeEl.textContent = App.config.models[this.state.selectedModel]?.name || '';

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
    setTimeout(() => input?.focus(), 100);
  },

  /* ----------------------------------------------------------
     VALIDAÇÃO DE RESTRIÇÕES
  ---------------------------------------------------------- */

  /**
   * Extrair todos os valores string de um objeto (JSON da ficha)
   */
  extrairTextoJson(obj) {
    const texts = [];
    function walk(item) {
      if (typeof item === 'string') {
        texts.push(item);
      } else if (Array.isArray(item)) {
        item.forEach(walk);
      } else if (typeof item === 'object' && item !== null) {
        Object.values(item).forEach(walk);
      }
    }
    walk(obj);
    return texts.join(' ');
  },

  /**
   * Validar se a copy respeita as restrições normalizadas
   */
  validateCopyComRestricoes(copy, restricoes) {
    const violacoes = [];
    const copyLower = copy.toLowerCase();

    // 1. Verificar palavras proibidas
    restricoes.palavras_proibidas.forEach(palavra => {
      const regex = new RegExp(`\\b${palavra}\\b`, 'gi');
      const matches = copy.match(regex);
      if (matches) {
        violacoes.push({
          tipo: 'palavra_proibida',
          palavra: palavra,
          ocorrencias: matches.length
        });
      }
    });

    // 2. Verificar tons proibidos (detecção por padrão)
    if (restricoes.tons_proibidos.includes('agressivo')) {
      const palavrasAgressivas = ['destruir', 'acabar', 'eliminar', 'matar', '!!!'];
      palavrasAgressivas.forEach(palavra => {
        if (copyLower.includes(palavra)) {
          violacoes.push({
            tipo: 'tom_proibido',
            tom: 'agressivo',
            marcador: palavra
          });
        }
      });
    }

    if (restricoes.tons_proibidos.includes('narrativo')) {
      const narrativeMarkers = ['era uma vez', 'o cliente nos procurou', 'começou'];
      narrativeMarkers.forEach(marker => {
        if (copyLower.includes(marker)) {
          violacoes.push({
            tipo: 'tom_proibido',
            tom: 'narrativo',
            marcador: marker
          });
        }
      });
    }

    // 3. Verificar tópicos proibidos
    restricoes.topicos_proibidos.forEach(topico => {
      const regex = new RegExp(`\\b${topico}\\b`, 'gi');
      if (copy.match(regex)) {
        violacoes.push({
          tipo: 'topico_proibido',
          topico: topico
        });
      }
    });

    return {
      valido: violacoes.length === 0,
      violacoes: violacoes,
      score: 100 - (violacoes.length * 10)
    };
  },

  /**
   * Validar se HTML/copy segue as 10 regras
   * @param {string} html - HTML gerado
   * @param {object} config - Configurações de validação
   * @returns {object} { valido: boolean, erros: array, avisos: array }
   */
  validateBlindedOutput(html, config = {}) {
    const erros = [];
    const avisos = [];

    if (!html || typeof html !== 'string') {
      return { valido: false, erros: [{ msg: 'HTML vazio ou inválido' }], avisos: [], score: 0 };
    }

    // 1. Verificar px em Tailwind (procurando por p-, m-, w-, h-, text- seguidos de número e px)
    // Ajustado para capturar mais casos como gap-10px, top-5px, etc
    const pxMatches = html.match(/(?:p-|m-|w-|h-|text-|gap-|top-|left-|right-|bottom-|rounded-).+?\d+px/g);
    if (pxMatches) {
      erros.push({
        tipo: 'tailwind_px',
        encontrado: pxMatches.slice(0, 3),
        msg: `❌ Encontrado ${pxMatches.length}x "px" em Tailwind. Use rem ou Tailwind nativo.`
      });
    }

    // 2. Verificar placeholders
    const placeholderMatches = html.match(/\[.+?\]|\{\{.+?\}\}|_INSERIR|_COPY|_IMAGEM/g);
    if (placeholderMatches) {
      erros.push({
        tipo: 'placeholders',
        encontrado: placeholderMatches.slice(0, 3),
        msg: `❌ Encontrado ${placeholderMatches.length}x placeholder. Conteúdo deve ser real.`
      });
    }

    // 3. Verificar imagens sem alt
    const imgSemAlt = html.match(/<img(?!.*alt=)[^>]*>/g);
    if (imgSemAlt) {
      erros.push({
        tipo: 'img_sem_alt',
        qtd: imgSemAlt.length,
        msg: `❌ ${imgSemAlt.length} imagem(ns) sem atributo alt`
      });
    }

    // 4. Verificar links vazios
    const linksVazios = html.match(/href=""\s/g);
    if (linksVazios) {
      erros.push({
        tipo: 'links_vazios',
        qtd: linksVazios.length,
        msg: `❌ ${linksVazios.length} link(s) com href vazio`
      });
    }

    // 5. Verificar h1
    const h1Count = (html.match(/<h1[^>]*>/g) || []).length;
    if (h1Count === 0) {
      avisos.push('⚠️ Nenhum <h1> encontrado. Recomenda-se um.');
    } else if (h1Count > 1) {
      erros.push({
        tipo: 'multiplos_h1',
        qtd: h1Count,
        msg: `❌ ${h1Count}x <h1> encontrado. Deve ter exatamente 1.`
      });
    }

    // 6. Verificar CTAs genéricas
    const ctasGenericas = ['clique aqui', 'saiba mais', 'enviar', 'ok'];
    const htmlLower = html.toLowerCase();
    ctasGenericas.forEach(cta => {
      if (htmlLower.includes(cta)) {
        avisos.push(`⚠️ CTA genérica detectada: "${cta}". Prefira "Agendar", "Baixar", etc.`);
      }
    });

    // 7. Verificar estrutura semântica
    if (!html.includes('<header>') && !html.includes('<Header')) {
      avisos.push('⚠️ Sem <header> semântico');
    }
    if (!html.includes('<main>') && !html.includes('<Main')) {
      avisos.push('⚠️ Sem <main> semântico');
    }
    if (!html.includes('<footer>') && !html.includes('<Footer')) {
      avisos.push('⚠️ Sem <footer> semântico');
    }

    // 8. Verificar responsividade
    const classesMobileFirst = html.match(/class="[^"]*(?:sm:|md:|lg:|xl:)[^"]*"/g) || [];
    if (classesMobileFirst.length === 0) {
      avisos.push('⚠️ Nenhuma classe responsiva (sm:, md:, etc) detectada');
    }

    // 9. Verificar título da página
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (!titleMatch) {
      avisos.push('⚠️ <title> não encontrado');
    } else if (titleMatch[1].length > 60) {
      avisos.push(`⚠️ <title> muito longo (${titleMatch[1].length} chars). Máximo 60.`);
    }

    // 10. Verificar meta description
    const metaDescMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (!metaDescMatch) {
      avisos.push('⚠️ <meta description> não encontrada');
    } else if (metaDescMatch[1].length > 160) {
      avisos.push(`⚠️ Meta description muito longa (${metaDescMatch[1].length} chars). Máximo 160.`);
    }

    // Retornar resultado
    return {
      valido: erros.length === 0,
      erros: erros,
      avisos: avisos,
      score: Math.max(0, 100 - (erros.length * 10 + avisos.length * 5)),
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Mostrar modal com resultados da validação
   */
  mostrarModalValidacao(data) {
    const { titulo, erros, avisos, acoes } = data;
    
    // Tenta encontrar ou cria o modal de validação
    let modal = document.getElementById('modal-validation');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-validation';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content" style="max-width:500px">
          <div class="modal-header">
            <h3 id="modal-validation-title">Validação de Output</h3>
            <button class="btn-icon" onclick="App.closeModal('modal-validation')">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="modal-body" id="modal-validation-body"></div>
          <div class="modal-footer" id="modal-validation-footer"></div>
        </div>
      `;
      document.body.appendChild(modal);
      lucide.createIcons({ nodes: [modal] });
    }

    const body = document.getElementById('modal-validation-body');
    const footer = document.getElementById('modal-validation-footer');
    const titleEl = document.getElementById('modal-validation-title');

    if (titleEl) titleEl.textContent = titulo;

    if (body) {
      body.innerHTML = `
        <div class="validation-summary">
          ${erros.length > 0 ? `
            <div class="validation-group validation-group--error" style="margin-bottom:20px">
              <div style="display:flex; gap:8px; align-items:center; color:var(--danger); font-weight:600; margin-bottom:10px">
                <i data-lucide="x-circle" style="width:18px;height:18px"></i>
                <span>Erros Críticos (${erros.length})</span>
              </div>
              <ul style="font-size:13px; color:var(--text-primary); padding-left:20px">
                ${erros.map(e => `<li style="margin-bottom:6px">${e.msg}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${avisos.length > 0 ? `
            <div class="validation-group validation-group--warning">
              <div style="display:flex; gap:8px; align-items:center; color:var(--warning); font-weight:600; margin-bottom:10px">
                <i data-lucide="alert-triangle" style="width:18px;height:18px"></i>
                <span>Avisos (${avisos.length})</span>
              </div>
              <ul style="font-size:13px; color:var(--text-secondary); padding-left:20px">
                ${avisos.map(a => `<li style="margin-bottom:6px">${a}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
      lucide.createIcons({ nodes: [body] });
    }

    if (footer) {
      footer.innerHTML = '';
      acoes.forEach(acao => {
        const btn = document.createElement('button');
        btn.className = acao.primary ? 'btn-primary' : 'btn-ghost';
        btn.textContent = acao.label;
        btn.onclick = () => {
          this.closeModal('modal-validation');
          if (acao.onclick) acao.onclick();
        };
        footer.appendChild(btn);
      });
    }

    this.openModal('modal-validation');
  }
});