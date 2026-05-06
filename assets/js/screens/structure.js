/* ============================================================
   LandingAI v2 — Screen: Structure (V3 Delta)
   ============================================================ */

Object.assign(window.App, {
  buildStructureScreen() {
    const B = this.B;
    const structure = B.estrutura_lp || '';

    return `
    <div class="structure-screen">
      <div class="structure-header">
        <h2 class="structure-title">Estrutura da Landing Page</h2>
        <p class="structure-desc">
          Aqui a IA define a ordem dos blocos, as seções e a hierarquia de informações.
          Você pode ajustar a estrutura antes de gerar o código final.
        </p>
      </div>

      ${B.estrutura_lp ? `
        <div class="structure-editor-wrap">
          <div class="structure-editor-header">
            <span>Editor de Estrutura</span>
            <button class="btn-ghost btn-sm" onclick="App.runStructureAnalysis()">
              <i data-lucide="refresh-cw" style="width:14px;height:14px"></i>
              Regerar
            </button>
          </div>
          <div class="structure-hint">
            <i data-lucide="info" style="width:12px;height:12px"></i>
            Dica: A IA usa este campo para saber quais seções criar no código final.
          </div>
          <textarea class="field-textarea estrutura-textarea" data-field="estrutura_lp" 
            placeholder="A IA vai preencher este campo automaticamente...">${structure}</textarea>
        </div>
      ` : `
        <div class="structure-empty">
          <i data-lucide="layout" style="width:48px;height:48px;color:var(--text-disabled)"></i>
          <p>Nenhuma estrutura definida ainda.</p>
          <button class="btn-primary" onclick="App.runStructureAnalysis()">
            <i data-lucide="sparkles" style="width:16px;height:16px"></i>
            Gerar Estrutura Recomendada
          </button>
        </div>
      `}

      <div class="structure-actions" style="margin-top:20px">
        <button class="btn-ghost" onclick="App.goToScreen('art')">Voltar para Arte</button>
        <button class="btn-primary" onclick="App.goToScreen('review')">Ir para Revisão</button>
      </div>
    </div>
    `;
  },

  async runStructureAnalysis() {
    this.openAILog('Definindo Estrutura da LP', [
      { id: 1, label: 'Analisando briefing e copy...' },
      { id: 2, label: 'Cruzando com Direção de Arte...' },
      { id: 3, label: 'Definindo blocos e seções...' },
      { id: 4, label: 'Gerando wireframe textual...' }
    ]);

    try {
      this.aiLogStep(1, 'Lendo DOC-1...');
      const doc1 = this.buildDoc1();
      
      this.aiLogStep(2, 'Verificando ficha de arte...');
      const prompt = `Baseado no briefing: ${doc1}, defina a estrutura de blocos ideal para esta landing page.
      Liste as seções (Hero, Prova Social, Benefícios, etc) e o que deve conter em cada uma.
      Responda em texto estruturado.`;
      
      this.aiLogStep(3, 'IA processando estrutura...');
      const res = await this.callAI(prompt);
      
      this.aiLogStep(4, 'Finalizando...');
      this.P.briefing.estrutura_lp = res;
      this.autosave();
      this.aiLogDone();
      
      setTimeout(() => {
        this.closeModal('modal-gen');
        this.renderScreen();
      }, 800);

    } catch (e) {
      this.aiLogError(this.state.aiLog.active, e.message);
    }
  }
});
