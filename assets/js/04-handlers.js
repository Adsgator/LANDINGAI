/* ============================================================
   LandingAI v2 — Handlers e Eventos
   ============================================================ */

Object.assign(window.App, {
  setupGlobalEvents() {
    // Topbar events
    document.getElementById('btn-projects')?.addEventListener('click', () => {
      this.renderProjectsList();
      this.openModal('modal-projects');
    });

    document.getElementById('btn-api-config')?.addEventListener('click', () => {
      this.renderApiModal();
      this.openModal('modal-api');
    });

    document.getElementById('btn-model-selector')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = document.getElementById('model-dropdown');
      if (dd) {
        this.renderModelDropdown();
        dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      const dd = document.getElementById('model-dropdown');
      if (dd) dd.style.display = 'none';
    });

    // Bottombar
    document.getElementById('btn-prev')?.addEventListener('click', () => this.goPrev());
    document.getElementById('btn-next')?.addEventListener('click', () => this.goNext());

    // Sidebar footer
    document.getElementById('btn-new-project')?.addEventListener('click', () => {
      this.createProject();
      this.showToast('Novo projeto criado', 'success');
    });

    // Shortcuts and Global Keys
    document.addEventListener('keydown', e => {
      // Fechar modais com Escape
      if (e.key === 'Escape') {
        ['modal-projects', 'modal-api', 'modal-gen', 'modal-error', 'modal-preview', 'modal-rename', 'modal-art-result'].forEach(id => {
          if (id !== 'modal-gen') this.closeModal(id); // gen não fecha com Esc
        });
      }

      // Ctrl/Cmd + S — Salvar manual
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveStorage();
        this.showToast('Salvo manualmente', 'success');
      }

      // Ctrl/Cmd + → próximo step | ← anterior
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        this.goNext();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goPrev();
      }
    });

    // Fechar modal clicando no overlay
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay && overlay.id !== 'modal-gen') {
          this.closeModal(overlay.id);
        }
      });
    });
  },

  bindScreenEvents(container) {
    // Inputs text/textarea
    container.querySelectorAll('[data-field]').forEach(el => {
      const field = el.dataset.field;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.addEventListener('input', () => this.setField(field, el.value));
      }
    });

    // Chips
    container.querySelectorAll('[data-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const field = chip.dataset.field;
        const value = chip.dataset.chip;
        const multi = chip.dataset.multi === 'true';
        if (multi) {
          this.toggleArray(field, value);
          chip.classList.toggle('on');
        } else {
          container.querySelectorAll(`[data-field="${field}"][data-chip]`).forEach(c => c.classList.remove('on'));
          this.setField(field, value);
          chip.classList.add('on');
        }
        
        // Re-renderiza para campos que mudam o layout
        const structural = ['modalidade', 'exibir_localizacao', 'objetivo_conversao', 'preco_exibir', 'depoimentos', 'google_business'];
        if (structural.includes(field)) {
          this.renderScreen();
        }
      });
    });

    // Sel-cards
    container.querySelectorAll('[data-selcard]').forEach(card => {
      card.addEventListener('click', () => {
        const field = card.dataset.field;
        const value = card.dataset.selcard;
        
        // Remove 'on' de todos os cards do mesmo grupo
        container.querySelectorAll(`[data-field="${field}"][data-selcard]`).forEach(c => {
          c.classList.remove('on');
          c.setAttribute('aria-selected', 'false');
        });

        this.setField(field, value);
        card.classList.add('on');
        card.setAttribute('aria-selected', 'true');
        
        // Sempre re-renderiza se for um campo estrutural
        const structural = ['tipo', 'objetivo_conversao', 'modalidade', 'preco_exibir', 'depoimentos', 'google_business'];
        if (structural.includes(field)) {
          this.renderScreen();
        }
      });
    });

    // Analyze btn
    const analyzeBtn = container.querySelector('#btn-analyze');
    if (analyzeBtn) analyzeBtn.addEventListener('click', () => this.runIntakeAnalysis());

    // Analyze art btn
    const artAnalyzeBtn = container.querySelector('#btn-analyze-art');
    if (artAnalyzeBtn) artAnalyzeBtn.addEventListener('click', () => this.runArtAnalysis());

    // Review actions
    const doc1Btn = container.querySelector('#btn-download-doc1');
    if (doc1Btn) doc1Btn.addEventListener('click', () => this.downloadDoc1());

    const genBtn = container.querySelector('#btn-generate-docimpl');
    if (genBtn) genBtn.addEventListener('click', () => this.generateDocImpl());

    // Review step cards and warnings
    container.querySelectorAll('[data-goto-step], [data-goto-step-warn]').forEach(el => {
      el.addEventListener('click', () => {
        const step = el.dataset.gotoStep || el.dataset.gotoStepWarn;
        this.goToStep(parseInt(step));
      });
    });

    // ── Upload de arquivos (Intake) ──────────────────────────
    const intakeZone = container.querySelector('#intake-upload-zone');
    const intakeInput = container.querySelector('#intake-upload-input');
    if (intakeZone && intakeInput) {
      // Clique na zona abre o file picker
      intakeZone.addEventListener('click', () => intakeInput.click());

      // Drag & Drop
      intakeZone.addEventListener('dragover', e => {
        e.preventDefault();
        intakeZone.classList.add('drag-over');
      });
      intakeZone.addEventListener('dragleave', () => {
        intakeZone.classList.remove('drag-over');
      });
      intakeZone.addEventListener('drop', e => {
        e.preventDefault();
        intakeZone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.handleIntakeFiles(files);
      });

      // Seleção via input
      intakeInput.addEventListener('change', () => {
        const files = Array.from(intakeInput.files);
        this.handleIntakeFiles(files);
        intakeInput.value = '';
      });
    }

    // ── Upload de arquivos (Arte) ────────────────────────────
    const artZone = container.querySelector('#art-upload-zone');
    const artInput = artZone?.querySelector('input[type="file"]');
    if (artZone && artInput) {
      artZone.addEventListener('click', (e) => {
        if (e.target !== artInput) artInput.click();
      });
      artZone.addEventListener('dragover', e => {
        e.preventDefault();
        artZone.classList.add('drag-over');
      });
      artZone.addEventListener('dragleave', () => {
        artZone.classList.remove('drag-over');
      });
      artZone.addEventListener('drop', e => {
        e.preventDefault();
        artZone.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.handleArtFiles(files);
      });
      artInput.addEventListener('change', () => {
        const files = Array.from(artInput.files);
        this.handleArtFiles(files);
        artInput.value = '';
      });
    }

    // ── Referências de Arte (add/remove) ────────────────────
    container.querySelectorAll('[data-add-ref]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.addRef; // 'pessoais' ou 'nicho'
        this.addArtRef(type);
      });
    });
    container.querySelectorAll('[data-remove-ref]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.removeRef;
        const idx = parseInt(btn.dataset.refIdx);
        this.removeArtRef(type, idx);
      });
    });

    // ── Color picker sync ────────────────────────────────────
    container.querySelectorAll('input[type="color"][data-field]').forEach(picker => {
      picker.addEventListener('input', () => {
        const field = picker.dataset.field;
        // Sincronizar com o input de texto ao lado
        const textInput = container.querySelector(`input[type="text"][data-field="${field}"]`);
        if (textInput) textInput.value = picker.value;
        this.setField(field, picker.value);
      });
    });

    // ── Aprovar Arte ─────────────────────────────────────────
    const approveArtBtn = container.querySelector('#btn-approve-art');
    if (approveArtBtn) approveArtBtn.addEventListener('click', () => this.aprovarArte());

    // ── Aprovar Estrutura ────────────────────────────────────
    const approveEstruturaBtn = container.querySelector('#btn-approve-estrutura');
    if (approveEstruturaBtn) approveEstruturaBtn.addEventListener('click', () => this.aprovarEstrutura());
  },

  aprovarArte() {
    if (!this.B) return;
    this.setField('arte_ficha_aprovada', this.B.ficha_direcao_arte || '');
    this.closeModal('modal-art-result');
    this.showToast('Direção de Arte aprovada!', 'success');
    this.renderScreen();
  },

  goToScreen(screen) {
    this.state.screen = screen;
    this.renderAll();
  },

  goToStep(n) {
    if (n < 1 || n > STEPS.length) return;
    this.state.screen = 'step';
    this.state.currentStep = n;
    if (this.P && !this.P.visitedSteps.includes(n)) {
      this.P.visitedSteps.push(n);
    }
    this.renderAll();
  },

  goNext() {
    const { screen, currentStep } = this.state;
    if (screen === 'intake') { this.goToStep(1); }
    else if (screen === 'step') {
      if (currentStep < STEPS.length) this.goToStep(currentStep + 1);
      else this.goToScreen('structure'); // Vai para estrutura antes da arte
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

  async runIntakeAnalysis() {
    const text = this.B.briefing_bruto;
    if (!text || text.length < 50) {
      this.showToast('Cole um material mais longo para análise.', 'warning');
      return;
    }

    this.openAILog('Analisando Material Bruto', [
      { id: 1, label: 'Lendo material e arquivos...' },
      { id: 2, label: 'Identificando dados do projeto...' },
      { id: 3, label: 'Extraindo serviços e público...' },
      { id: 4, label: 'Definindo tom e estilo...' },
      { id: 5, label: 'Preenchendo steps...' }
    ]);

    try {
      this.aiLogStep(1, 'Lendo texto fornecido...');
      const prompt = `Analise este material bruto de briefing e extraia o máximo de informações para preencher um formulário estruturado.
      Material: ${text}
      Responda APENAS com um JSON seguindo os campos: ${Object.values(REQUIRED_FIELDS).flat().join(', ')}.`;
      
      this.aiLogStep(2, 'Chamando IA para extração...');
      const res = await this.callAI(prompt);
      
      this.aiLogStep(3, 'Processando JSON da IA...');
      const data = JSON.parse(res.replace(/```json|```/g, '').trim());
      
      this.aiLogStep(4, 'Salvando dados no projeto...');
      Object.assign(this.P.briefing, data);
      
      this.aiLogStep(5, 'Atualizando interface...');
      this.autosave();
      this.aiLogDone();
      
      setTimeout(() => {
        this.closeModal('modal-gen');
        this.goToStep(1);
        this.showToast('Análise concluída com sucesso!', 'success');
      }, 800);

    } catch (e) {
      console.error(e);
      this.aiLogError(this.state.aiLog.active, e.message);
      this.showToast('Erro na análise. Verifique o console.', 'danger');
    }
  },

  async runArtAnalysis() {
    const B = this.B;
    this.openAILog('Gerando Direção de Arte', [
      { id: 1, label: 'Compilando referências...' },
      { id: 2, label: 'Definindo paleta e tipos...' },
      { id: 3, label: 'Criando tom visual...' },
      { id: 4, label: 'Finalizando ficha...' }
    ]);

    try {
      this.aiLogStep(1, 'Agrupando links e notas...');
      const prompt = `Crie uma ficha de direção de arte baseada nestas referências: 
      Cores: ${B.arte_cor_principal}, ${B.arte_cor_secundaria}
      Referências: ${JSON.stringify(B.arte_referencias_pessoais)}
      Responda em JSON com: paleta (array), tipografia (obj), tom_visual (string), decisoes (array).`;
      
      this.aiLogStep(2, 'IA criando design system...');
      const res = await this.callAI(prompt);
      
      this.aiLogStep(3, 'Formatando ficha técnica...');
      const ficha = res.replace(/```json|```/g, '').trim();
      
      this.aiLogStep(4, 'Salvando ficha no briefing...');
      this.P.briefing.ficha_direcao_arte = ficha;
      this.state.artAnalyzed = true;
      
      this.autosave();
      this.aiLogDone();
      
      setTimeout(() => {
        this.closeModal('modal-gen');
        this.showToast('Direção de Arte gerada!', 'success');
        this.renderScreen();
      }, 800);

    } catch (e) {
      console.error(e);
      this.aiLogError(this.state.aiLog.active, e.message);
    }
  },

  async generateDocImpl() {
    this.openAILog('Gerando Documentação Técnica', [
      { id: 1, label: 'Consolidando briefing (DOC-1)...' },
      { id: 2, label: 'IA escrevendo código e copy...' },
      { id: 3, label: 'Validando especificações...' },
      { id: 4, label: 'Gerando arquivo MD...' }
    ]);

    try {
      this.aiLogStep(1);
      const doc1 = this.buildDoc1();
      
      this.aiLogStep(2, 'Isso pode levar até 60 segundos...');
      const prompt = `Baseado neste briefing: ${doc1}, gere a Ficha de Implementação Completa para o Roo Code.`;
      const res = await this.callAI(prompt);
      
      this.aiLogStep(3, 'Verificando integridade...');
      this.state.lastDocImpl = res;
      
      this.aiLogStep(4, 'Preparando download...');
      const slug = this.B.slug || 'projeto';
      this.downloadText(res, `doc-impl-${slug}.md`, 'text/markdown');
      
      this.aiLogDone();
      this.showNotification('LandingAI', 'Documentação gerada com sucesso!');
      
      setTimeout(() => {
        this.closeModal('modal-gen');
        this.showToast('Documento gerado e baixado!', 'success');
      }, 800);

    } catch (e) {
      console.error(e);
      this.aiLogError(this.state.aiLog.active, e.message);
    }
  },

  downloadDoc1() {
    const doc1 = this.buildDoc1();
    const slug = this.B.slug || 'briefing';
    this.downloadText(doc1, `doc1-${slug}.md`, 'text/markdown');
    this.showToast('DOC-1 baixado!', 'success');
  },

  downloadText(content, filename, mime = 'text/plain') {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  },

  handleIntakeFiles(files) {
    if (!files.length) return;
    this.state.intakeFiles = [...(this.state.intakeFiles || []), ...files];
    
    const list = document.getElementById('intake-files-list');
    if (!list) return;
    
    list.innerHTML = this.state.intakeFiles.map((f, i) => `
      <div class="upload-preview-item">
        <i data-lucide="file-text" style="width:14px;height:14px"></i>
        <span>${f.name}</span>
        <button onclick="App.removeIntakeFile(${i})" title="Remover">
          <i data-lucide="x" style="width:12px;height:12px"></i>
        </button>
      </div>
    `).join('');
    lucide.createIcons({ nodes: [list] });
    this.showToast(`${files.length} arquivo(s) adicionado(s)`, 'success');
  },

  removeIntakeFile(index) {
    this.state.intakeFiles.splice(index, 1);
    const list = document.getElementById('intake-files-list');
    if (list) {
      list.innerHTML = this.state.intakeFiles.map((f, i) => `
        <div class="upload-preview-item">
          <i data-lucide="file-text" style="width:14px;height:14px"></i>
          <span>${f.name}</span>
          <button onclick="App.removeIntakeFile(${i})" title="Remover">
            <i data-lucide="x" style="width:12px;height:12px"></i>
          </button>
        </div>
      `).join('');
      lucide.createIcons({ nodes: [list] });
    }
  },

  handleArtFiles(files) {
    if (!files.length) return;
    if (!this.P) return;
    
    const existing = this.B.arte_arquivos || [];
    const novos = files.map(f => ({ name: f.name, size: f.size, type: f.type }));
    this.setField('arte_arquivos', [...existing, ...novos]);
    
    const list = document.getElementById('art-files-list');
    if (list) {
      const all = this.B.arte_arquivos || [];
      list.innerHTML = all.map((f, i) => `
        <div class="upload-preview-item">
          <i data-lucide="file" style="width:14px;height:14px"></i>
          <span>${f.name}</span>
          <button onclick="App.removeArtFile(${i})" title="Remover">
            <i data-lucide="x" style="width:12px;height:12px"></i>
          </button>
        </div>
      `).join('');
      lucide.createIcons({ nodes: [list] });
    }
    this.showToast(`${files.length} arquivo(s) adicionado(s)`, 'success');
  },

  removeArtFile(index) {
    const all = [...(this.B.arte_arquivos || [])];
    all.splice(index, 1);
    this.setField('arte_arquivos', all);
    this.renderScreen();
  },

  addArtRef(type) {
    const field = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    const arr = [...(this.B[field] || [])];
    arr.push({ url: '', notas: '' });
    this.setField(field, arr);
    this.renderScreen();
  },

  removeArtRef(type, index) {
    const field = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    const arr = [...(this.B[field] || [])];
    arr.splice(index, 1);
    this.setField(field, arr);
    this.renderScreen();
  }
});
