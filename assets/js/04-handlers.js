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

    // Shortcuts
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 's') { 
          e.preventDefault(); 
          this.saveStorage(); 
          this.showToast('Salvo manualmente', 'success'); 
      }
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
      });
    });

    // Sel-cards
    container.querySelectorAll('[data-selcard]').forEach(card => {
      card.addEventListener('click', () => {
        const field = card.dataset.field;
        const value = card.dataset.selcard;
        container.querySelectorAll(`[data-field-group="${field}"] [data-selcard]`).forEach(c => c.classList.remove('on'));
        this.setField(field, value);
        card.classList.add('on');
        
        // Conditional re-renders
        if (['objetivo_conversao', 'modalidade', 'preco_exibir', 'depoimentos', 'google_business'].includes(field)) {
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
    if (screen === 'intake') this.goToStep(1);
    else if (screen === 'step') {
      if (currentStep < STEPS.length) this.goToStep(currentStep + 1);
      else this.goToScreen('art');
    } else if (screen === 'art') this.goToScreen('structure');
    else if (screen === 'structure') this.goToScreen('review');
    else if (screen === 'review') this.showToast('Briefing concluído!', 'success');
  },

  goPrev() {
    const { screen, currentStep } = this.state;
    if (screen === 'review') this.goToScreen('structure');
    else if (screen === 'structure') this.goToScreen('art');
    else if (screen === 'art') this.goToStep(STEPS.length);
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
  }
});
