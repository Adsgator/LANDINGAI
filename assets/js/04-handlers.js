/* ============================================================
   LandingAI v2 — Handlers de Eventos e Operações de IA
   ============================================================ */

Object.assign(window.App, {

  /* ----------------------------------------------------------
     Binding de eventos da tela renderizada
  ---------------------------------------------------------- */
  bindScreenEvents(container) {
    if (!container) return;

    // ── Inputs de texto e textarea ──────────────────────────
    container.querySelectorAll('input[data-field], textarea[data-field]').forEach(el => {
      el.addEventListener('input', () => {
        this.setField(el.dataset.field, el.value);
        // Atualiza preview do WhatsApp em tempo real
        if (el.dataset.field === 'whatsapp') {
          const preview = container.querySelector('#wa-preview');
          if (preview) {
            preview.style.display = el.value ? '' : 'none';
            preview.textContent = el.value ? `wa.me/${el.value}` : '';
          }
        }
      });
    });

    // ── Chips (seleção única) ───────────────────────────────
    container.querySelectorAll('[data-chip]').forEach(chip => {
      chip.addEventListener('click', () => {
        const field = chip.dataset.field;
        const value = chip.dataset.chip;
        const isMulti = chip.dataset.multi === 'true';

        if (isMulti) {
          this.toggleArray(field, value);
          chip.classList.toggle('on');
        } else {
          container.querySelectorAll(`[data-field="${field}"][data-chip]`).forEach(c => c.classList.remove('on'));
          this.setField(field, value);
          chip.classList.add('on');
        }

        // Campos estruturais que exigem re-render
        const structural = ['tipo', 'objetivo_conversao', 'modalidade', 'preco_exibir', 'depoimentos', 'google_business'];
        if (structural.includes(field)) this.renderScreen();
      });
    });

    // ── Sel-cards ───────────────────────────────────────────
    container.querySelectorAll('[data-selcard]').forEach(card => {
      card.addEventListener('click', () => {
        const field = card.dataset.field;
        const value = card.dataset.selcard;
        container.querySelectorAll(`[data-field="${field}"][data-selcard]`).forEach(c => {
          c.classList.remove('on');
          c.setAttribute('aria-selected', 'false');
        });
        this.setField(field, value);
        card.classList.add('on');
        card.setAttribute('aria-selected', 'true');
        const structural = ['tipo', 'objetivo_conversao', 'modalidade', 'preco_exibir', 'depoimentos', 'google_business'];
        if (structural.includes(field)) this.renderScreen();
      });
    });

    // ── Botão de análise do Intake ──────────────────────────
    const analyzeBtn = container.querySelector('#btn-analyze');
    if (analyzeBtn) analyzeBtn.addEventListener('click', () => this.runIntakeAnalysis());

    // Gerar protótipo visual na Review
    const btnPrototipo = container.querySelector('#btn-gerar-prototipo');
    if (btnPrototipo) btnPrototipo.addEventListener('click', () => this.gerarPrototipoVisual());

    // ── Botão de análise de Arte ────────────────────────────
    const artBtn = container.querySelector('#btn-analyze-art');
    if (artBtn) artBtn.addEventListener('click', () => this.runArtAnalysis());

    // ── Botões da Review ────────────────────────────────────
    const doc1Btn = container.querySelector('#btn-download-doc1');
    if (doc1Btn) doc1Btn.addEventListener('click', () => this.downloadDoc1());

    const genBtn = container.querySelector('#btn-generate-docimpl');
    if (genBtn) genBtn.addEventListener('click', () => this.generateDocImpl());

    // ── Atalhos de navegação nos cards da Review ────────────
    container.querySelectorAll('[data-goto-step], [data-goto-step-warn]').forEach(el => {
      el.addEventListener('click', () => {
        const step = parseInt(el.dataset.gotoStep || el.dataset.gotoStepWarn, 10);
        if (!isNaN(step)) this.goToStep(step);
      });
    });

    // ── Upload Intake ───────────────────────────────────────
    const intakeZone = container.querySelector('#intake-upload-zone');
    const intakeInput = container.querySelector('#intake-upload-input');
    if (intakeZone && intakeInput) {
      intakeZone.addEventListener('click', () => intakeInput.click());
      intakeZone.addEventListener('dragover', e => { e.preventDefault(); intakeZone.classList.add('drag-over'); });
      intakeZone.addEventListener('dragleave', () => intakeZone.classList.remove('drag-over'));
      intakeZone.addEventListener('drop', e => {
        e.preventDefault();
        intakeZone.classList.remove('drag-over');
        this.handleIntakeFiles(Array.from(e.dataTransfer.files));
      });
      intakeInput.addEventListener('change', () => {
        this.handleIntakeFiles(Array.from(intakeInput.files));
        intakeInput.value = '';
      });
    }

    // ── Upload Arte ─────────────────────────────────────────
    const artZone = container.querySelector('#art-upload-zone');
    const artInput = artZone?.querySelector('input[type="file"]');
    if (artZone && artInput) {
      artZone.addEventListener('click', e => { if (e.target !== artInput) artInput.click(); });
      artZone.addEventListener('dragover', e => { e.preventDefault(); artZone.classList.add('drag-over'); });
      artZone.addEventListener('dragleave', () => artZone.classList.remove('drag-over'));
      artZone.addEventListener('drop', e => {
        e.preventDefault();
        artZone.classList.remove('drag-over');
        this.handleArtFiles(Array.from(e.dataTransfer.files));
      });
      artInput.addEventListener('change', () => {
        this.handleArtFiles(Array.from(artInput.files));
        artInput.value = '';
      });
    }

    // ── Referências de Arte (add/remove) ────────────────────
    container.querySelectorAll('[data-add-ref]').forEach(btn => {
      btn.addEventListener('click', () => this.addArtRef(btn.dataset.addRef));
    });
    container.querySelectorAll('[data-remove-ref]').forEach(btn => {
      btn.addEventListener('click', () => this.removeArtRef(btn.dataset.removeRef, parseInt(btn.dataset.refIdx, 10)));
    });

    // ── Color pickers ────────────────────────────────────────
    container.querySelectorAll('input[type="color"][data-field]').forEach(picker => {
      picker.addEventListener('input', () => {
        const textInput = container.querySelector(`input[type="text"][data-field="${picker.dataset.field}"]`);
        if (textInput) textInput.value = picker.value;
        this.setField(picker.dataset.field, picker.value);
      });
    });

    // ── Aprovar Arte ─────────────────────────────────────────
    const approveArtBtn = container.querySelector('#btn-approve-art') ||
      document.getElementById('btn-approve-art');
    if (approveArtBtn) approveArtBtn.addEventListener('click', () => this.aprovarArte());

    // ── Estrutura: Gerar ─────────────────────────────────────────
    const runEstruturaBtn = container.querySelector('#btn-run-estrutura');
    if (runEstruturaBtn) runEstruturaBtn.addEventListener('click', () => this.runEstruturaAnalysis());

    // ── Estrutura: Aprovar ────────────────────────────────────────
    const approveEstruturaBtn = container.querySelector('#btn-approve-estrutura');
    if (approveEstruturaBtn) approveEstruturaBtn.addEventListener('click', () => this.aprovarEstrutura());

    // ── Estrutura: Refinar ────────────────────────────────────────
    const refinarEstruturaBtn = container.querySelector('#btn-refinar-estrutura');
    if (refinarEstruturaBtn) refinarEstruturaBtn.addEventListener('click', () => this.refinarEstrutura());
  },

  /* ----------------------------------------------------------
     Eventos globais (sidebar, model dropdown, etc.)
  ---------------------------------------------------------- */
  setupGlobalEvents() {
    // Botão novo projeto no modal
    const btnNew = document.getElementById('btn-new-project');
    if (btnNew) btnNew.addEventListener('click', () => {
      this.createProject();
      this.closeModal('modal-projects');
    });

    // Import arquivo .json
    const importInput = document.getElementById('import-file-input');
    if (importInput) importInput.addEventListener('change', () => this.importProject(importInput));

    // Model selector dropdown
    const modelBtn = document.getElementById('btn-model-selector');
    const modelDropdown = document.getElementById('model-dropdown');
    if (modelBtn && modelDropdown) {
      modelBtn.addEventListener('click', () => {
        const isOpen = modelDropdown.style.display !== 'none';
        modelDropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) this.renderModelDropdown();
      });
      document.addEventListener('click', e => {
        if (!modelBtn.contains(e.target) && !modelDropdown.contains(e.target)) {
          modelDropdown.style.display = 'none';
        }
      });
    }

    // Salvar nome ao pressionar Enter no modal de rename
    const renameInput = document.getElementById('rename-input');
    if (renameInput) {
      renameInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') this.saveProjectNameFromModal();
      });
    }

    // Fechar modais clicando no overlay (exceto modal-gen que é bloqueante)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      if (overlay.id === 'modal-gen') return;
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.closeModal(overlay.id);
      });
    });
  },

  saveProjectNameFromModal() {
    const input = document.getElementById('rename-input');
    if (input) {
      this.saveProjectName(input.value);
      this.closeModal('modal-rename');
      this.updateSidebar();
      this.showToast('Nome salvo!', 'success');
    }
  },

  /* ----------------------------------------------------------
     Intake — Análise com IA
     CORRIGIDO: campo é 'briefing_bruto', não 'intake_raw'
  ---------------------------------------------------------- */
  async runIntakeAnalysis() {
    const briefing = this.B?.briefing_bruto || '';
    if (!briefing.trim()) {
      this.showToast('Cole o briefing do cliente antes de analisar.', 'warning');
      return;
    }
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) {
      this.showToast('Configure uma API Key primeiro.', 'warning');
      return;
    }

    this.openAILog('Analisando Briefing Completo', [
      { id: 1, icon: 'file-text', label: 'Lendo briefing...' },
      { id: 2, icon: 'cpu', label: 'Extraindo todos os dados...' },
      { id: 3, icon: 'layers', label: 'Mapeando campos dos steps...' },
      { id: 4, icon: 'check-circle', label: 'Aplicando informações...' },
    ]);

    try {
      this.aiLogStep(1);
      const prompt = this.buildIntakePrompt(briefing);
      await this.aiLogDelay(300);

      this.aiLogStep(2);
      const resultado = await this.callAI(prompt);
      await this.aiLogDelay(300);

      this.aiLogStep(3);
      await this.aiLogDelay(400);

      this.aiLogStep(4);
      await this.applyIntakeJSON(resultado);
      await this.aiLogDelay(500);

      this.aiLogDone();
      this.closeAILog();
      this.renderScreen();
      this.showToast(`✓ Briefing analisado — ${this.countFilledFields()} campos preenchidos!`, 'success');
    } catch (err) {
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro na análise: ' + err.message, 'error');
      }, 1200);
    }
  },

  buildIntakePrompt(briefing) {
    return `
Você é um estrategista sênior de marketing digital especializado em landing pages de conversão.

Leia o briefing abaixo e extraia TODAS as informações disponíveis.
Retorne um JSON válido com EXATAMENTE esta estrutura.
Para campos sem informação no briefing: retorne string vazia "".
NUNCA invente informações que não estejam no briefing.
Responda APENAS com o JSON, sem markdown, sem explicação.

{
  "step1": {
    "nome_profissional": "",
    "nome_cliente": "",
    "nome_marca": "",
    "nicho": "",
    "segmento": "",
    "cidade": "",
    "estado": "",
    "proposta_valor": "",
    "missao": "",
    "anos_experiencia": "",
    "formacao": "",
    "certificacoes": "",
    "tipo": "",
    "dominio": "",
    "cnpj": "",
    "aviso_legal": ""
  },
  "step2": {
    "avatar_nome": "",
    "avatar_idade": "",
    "avatar_genero": "",
    "avatar_profissao": "",
    "avatar_renda": "",
    "dor_principal": "",
    "dores_secundarias": "",
    "desejo_principal": "",
    "objecao_preco": "",
    "objecao_tempo": "",
    "objecao_confianca": "",
    "objecao_resultado": "",
    "gatilhos_mentais": "",
    "whatsapp": "",
    "email": "",
    "horarios": "",
    "gtm_id": "",
    "objetivo_conversao": ""
  },
  "step3": {
    "servico_principal": "",
    "servico_descricao": "",
    "servicos_descricao": "",
    "como_funciona_passo1": "",
    "como_funciona_passo2": "",
    "como_funciona_passo3": "",
    "como_funciona_passo4": "",
    "modalidade": "",
    "duracao_sessao": "",
    "frequencia": "",
    "formato": "",
    "resultado_esperado": "",
    "prazo_resultado": "",
    "servicos_adicionais": "",
    "instagram": "",
    "tiktok": "",
    "youtube": "",
    "google_business": "",
    "google_nota": "",
    "google_qtd": ""
  },
  "step4": {
    "depoimento1_nome": "",
    "depoimento1_texto": "",
    "depoimento1_resultado": "",
    "depoimento2_nome": "",
    "depoimento2_texto": "",
    "depoimento2_resultado": "",
    "depoimento3_nome": "",
    "depoimento3_texto": "",
    "depoimento3_resultado": "",
    "casos_de_sucesso": "",
    "perfil_google": "",
    "nota_google": "",
    "quantidade_avaliacoes": "",
    "instagram": "",
    "seguidores": "",
    "midia_aparicoes": "",
    "endereco": "",
    "exibir_localizacao": "",
    "maps_link": "",
    "cidades_atendimento": "",
    "faq": "",
    "objecoes_atendimento": "",
    "plataforma_online": ""
  },
  "step5": {
    "diferencial1_titulo": "",
    "diferencial1_descricao": "",
    "diferencial2_titulo": "",
    "diferencial2_descricao": "",
    "diferencial3_titulo": "",
    "diferencial3_descricao": "",
    "diferencial4_titulo": "",
    "diferencial4_descricao": "",
    "metodologia_propria": "",
    "garantia": "",
    "atendimento_diferenciado": "",
    "diferencial": "",
    "frase_impacto": "",
    "historia": "",
    "casos_resultados": "",
    "depoimentos": "",
    "depoimentos_qtd": "",
    "depoimentos_formato": []
  },
  "step6": {
    "whatsapp": "",
    "whatsapp_mensagem_padrao": "",
    "email": "",
    "preco_plano1_nome": "",
    "preco_plano1_valor": "",
    "preco_plano1_descricao": "",
    "preco_plano2_nome": "",
    "preco_plano2_valor": "",
    "preco_plano2_descricao": "",
    "preco_plano3_nome": "",
    "preco_plano3_valor": "",
    "preco_plano3_descricao": "",
    "forma_pagamento": "",
    "desconto_pix": "",
    "parcelas": "",
    "trial_gratuito": "",
    "horario_atendimento": "",
    "publico_primario": "",
    "publico_dor": "",
    "publico_resultado": ""
  },
  "step7": {
    "cor_primaria": "",
    "cor_secundaria": "",
    "cor_acento": "",
    "cor_fundo": "",
    "estilo_visual": "",
    "fonte_titulo": "",
    "fonte_corpo": "",
    "tom_comunicacao": "",
    "referencias_visuais": "",
    "logo_descricao": "",
    "imagens_disponiveis": "",
    "video_disponivel": "",
    "estilo_desejado": "",
    "sensacao_visitante": "",
    "restricoes": ""
  },
  "step8": {
    "titulo_seo": "",
    "descricao_seo": "",
    "palavra_chave_principal": "",
    "palavras_chave_secundarias": "",
    "dominio_sugerido": "",
    "schema_tipo": "",
    "og_titulo": "",
    "og_descricao": ""
  }
}

BRIEFING DO CLIENTE:
${briefing}
    `.trim();
  },

  async applyIntakeJSON(jsonString) {
    let data;
    try {
      const clean = jsonString.replace(/```json|```/g, '').trim();
      // Extrai o JSON se vier com texto antes/depois
      const match = clean.match(/\{[\s\S]*\}/);
      data = JSON.parse(match ? match[0] : clean);
    } catch (e) {
      throw new Error('Resposta da IA inválida — não foi possível interpretar o JSON.');
    }

    const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8'];
    steps.forEach(step => {
      if (!data[step]) return;
      Object.entries(data[step]).forEach(([campo, valor]) => {
        if (valor !== '' && valor !== null && valor !== undefined) {
          this.setField(campo, valor);
        }
      });
    });

    // Atualiza segmento na sidebar imediatamente
    const segEl = document.getElementById('project-segment');
    if (segEl && data.step1?.segmento) segEl.textContent = data.step1.segmento;

    this.updateProgressBar();
    this.renderStepsNav();
  },

  countFilledFields() {
    return Object.values(this.B || {}).filter(v => v && String(v).trim()).length;
  },

  /* ----------------------------------------------------------
     Arte — Análise com IA
  ---------------------------------------------------------- */
  async runArtAnalysis() {
    const B = this.B;
    if (!B) return;

    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    this.openAILog('Gerando Direção de Arte', [
      { id: 1, icon: 'file-text', label: 'Compilando referências e dados...' },
      { id: 2, icon: 'palette', label: 'Definindo paleta de cores...' },
      { id: 3, icon: 'cpu', label: 'Aguardando resposta da IA...' },
      { id: 4, icon: 'type', label: 'Processando ficha...' },
      { id: 5, icon: 'save', label: 'Salvando ficha...' },
    ]);

    try {
      this.aiLogStep(1);
      const refs = [
        ...(B.arte_referencias_pessoais || []).map(r => r.url).filter(Boolean),
        ...(B.arte_referencias_nicho || []).map(r => r.url).filter(Boolean),
      ];
      await this.aiLogDelay(200);

      this.aiLogStep(2);
      const prompt = `Você é um Art Director especialista em landing pages de alta conversão da agência Adsgator.

Com base nas informações abaixo, crie uma Ficha de Direção de Arte completa para a landing page.

DADOS DO PROJETO:
- Cliente: ${B.nome_cliente || '—'}
- Segmento: ${B.segmento || '—'}
- Tipo: ${B.tipo || '—'}
- Público-alvo: ${B.publico_primario || '—'}
- Tom desejado: ${B.estilo_desejado || '—'}
- Sensação desejada: ${B.sensacao_visitante || '—'}
- Restrições: ${B.restricoes || 'Nenhuma'}
- Cor principal da marca: ${B.arte_cor_principal || 'Não definida'}
- Cor secundária: ${B.arte_cor_secundaria || 'Não definida'}
- Status da logo: ${B.arte_logo || 'Desconhecido'}
- Fotos disponíveis: ${B.arte_fotos || 'Desconhecido'}
- Tema preferido: ${B.arte_tema || 'IA decide'}
- Intensidade visual: ${B.arte_intensidade || 'moderado'}
- URLs de referência: ${refs.length > 0 ? refs.join(', ') : 'Nenhuma fornecida'}

Responda APENAS com um objeto JSON válido (sem markdown, sem \`\`\`json):

{
  "tema": "escuro|claro",
  "paleta": [
    {"nome": "Nome da cor", "hex": "#HEXCODE", "uso": "Para que serve"},
    {"nome": "Nome da cor", "hex": "#HEXCODE", "uso": "Para que serve"},
    {"nome": "Nome da cor", "hex": "#HEXCODE", "uso": "Para que serve"}
  ],
  "tipografia": {
    "display": "Nome da fonte para títulos (Google Fonts)",
    "body": "Nome da fonte para corpo (Google Fonts)",
    "mono": "Nome da fonte mono se necessário ou null",
    "escala": "Descrição da escala tipográfica"
  },
  "tom_visual": "Descrição detalhada do tom visual (2-3 frases)",
  "referencias_inspiracao": "O que extrair das referências fornecidas",
  "decisoes": [
    "Decisão criativa específica 1",
    "Decisão criativa específica 2",
    "Decisão criativa específica 3",
    "Decisão criativa específica 4"
  ],
  "elementos_visuais": "Elementos gráficos, padrões, texturas recomendados",
  "fotografia": "Orientações para escolha e edição de fotos"
}`;

      this.aiLogStep(3);
      const res = await this.callAI(prompt);

      this.aiLogStep(4);
      let ficha = null;
      const cleanRes = res.replace(/```json|```/g, '').trim();
      try {
        ficha = JSON.parse(cleanRes);
      } catch {
        const match = cleanRes.match(/\{[\s\S]*\}/);
        if (match) ficha = JSON.parse(match[0]);
        else throw new Error('Resposta da IA inválida. Tente novamente.');
      }

      this.aiLogStep(5);
      this.setField('ficha_direcao_arte', JSON.stringify(ficha));
      this.state.artAnalyzed = true;
      await this.aiLogDelay(300);

      this.aiLogDone();

      setTimeout(() => {
        this.closeAILog();
        this._showArtResultModal(ficha);
      }, 600);

    } catch (e) {
      console.error('[AIGator] runArtAnalysis:', e);
      this.aiLogError(this.state.aiLog.active, e.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar arte: ' + e.message, 'error');
      }, 1200);
    }
  },

  _showArtResultModal(ficha) {
    const body = document.getElementById('art-result-body');
    if (body) {
      const swatches = (ficha.paleta || []).map(c => `
        <div class="palette-swatch">
          <div class="palette-swatch-color" style="background:${c.hex}"></div>
          <span class="palette-swatch-label">${c.hex}</span>
          <span style="font-size:10px;color:var(--text-tertiary)">${c.nome}</span>
        </div>
      `).join('');

      const decisoes = (ficha.decisoes || []).map(d => `
        <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:8px">
          <i data-lucide="check" style="width:14px;height:14px;color:var(--accent);flex-shrink:0;margin-top:2px"></i>
          <span style="font-size:13px;color:var(--text-primary);line-height:1.5">${d}</span>
        </div>
      `).join('');

      body.innerHTML = `
        <div class="art-result-card">
          <div class="art-result-section">
            <div class="art-result-section-title">Paleta de Cores</div>
            <div class="palette-swatches">${swatches}</div>
          </div>
          <div class="art-result-section">
            <div class="art-result-section-title">Tipografia</div>
            <div class="art-result-text">
              <strong>Display:</strong> ${ficha.tipografia?.display || '—'}<br>
              <strong>Corpo:</strong> ${ficha.tipografia?.body || '—'}<br>
              ${ficha.tipografia?.mono ? `<strong>Mono:</strong> ${ficha.tipografia.mono}<br>` : ''}
              <em style="color:var(--text-secondary)">${ficha.tipografia?.escala || ''}</em>
            </div>
          </div>
          <div class="art-result-section">
            <div class="art-result-section-title">Tom Visual</div>
            <div class="art-result-text">${ficha.tom_visual || '—'}</div>
          </div>
          ${ficha.elementos_visuais ? `
          <div class="art-result-section">
            <div class="art-result-section-title">Elementos Visuais</div>
            <div class="art-result-text">${ficha.elementos_visuais}</div>
          </div>` : ''}
          ${ficha.fotografia ? `
          <div class="art-result-section">
            <div class="art-result-section-title">Direção de Fotografia</div>
            <div class="art-result-text">${ficha.fotografia}</div>
          </div>` : ''}
          <div class="art-result-section">
            <div class="art-result-section-title">Decisões Criativas</div>
            ${decisoes}
          </div>
        </div>
      `;
      lucide.createIcons({ nodes: [body] });

      // Bind do botão de aprovar no modal
      const approveBtn = document.getElementById('btn-approve-art');
      if (approveBtn) approveBtn.onclick = () => this.aprovarArte();
    }
    this.openModal('modal-art-result');
    this.showToast('Direção de Arte gerada! Revise e aprove.', 'success');
  },

  aprovarArte() {
    if (!this.B) return;
    this.setField('arte_ficha_aprovada', this.B.ficha_direcao_arte || '');
    this.closeModal('modal-art-result');
    this.showToast('Direção de Arte aprovada!', 'success');
    this.renderScreen();
    this.renderStepsNav();
  },

  /* ----------------------------------------------------------
     Estrutura — Análise com IA
  ---------------------------------------------------------- */
  async runEstruturaAnalysis() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    this.openAILog('Gerando Estrutura da Landing Page', [
      { id: 1, icon: 'file-text', label: 'Lendo briefing completo...' },
      { id: 2, icon: 'layout', label: 'Definindo blocos e ordem narrativa...' },
      { id: 3, icon: 'sparkles', label: 'Gerando copy de cada bloco...' },
      { id: 4, icon: 'check-circle', label: 'Estrutura pronta!' },
    ]);

    try {
      this.aiLogStep(1);
      const doc1 = this.buildDoc1();
      await this.aiLogDelay(300);

      this.aiLogStep(2);
      const prompt = this.buildEstruturaPrompt(doc1);
      await this.aiLogDelay(200);

      this.aiLogStep(3);
      const resultado = await this.callAI(prompt);

      this.aiLogStep(4);
      this.setField('estrutura_rascunho', resultado);
      this.setField('estrutura_wireframe', '');
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura gerada! Revise os blocos e refine se necessário.', 'success');
    } catch (err) {
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar estrutura: ' + err.message, 'error');
      }, 1200);
    }
  },

  buildEstruturaPrompt(doc1) {
    const B = this.B || {};

    return `
Você é um Copywriter Sênior e Estrategista de Conversão especializado em landing pages para prestadores de serviço no Brasil.

## DADOS DO CLIENTE — USE APENAS ESTES, NUNCA INVENTE

${doc1.substring(0, 10000)}

---

## SUA TAREFA

Gere a estrutura narrativa COMPLETA da landing page com entre 6 e 9 blocos.

---

## REGRAS ABSOLUTAS — VIOLAÇÃO = RESPOSTA INVÁLIDA

1. **PRIMEIRA PESSOA DO SINGULAR EM TODA A COPY** — sem exceção
   - ✅ "Eu ajudo...", "Meu método...", "Atendo...", "Transformei..."
   - ❌ "Ela atende...", "O profissional oferece...", "Nossa equipe..."

2. **H1 DO HERO = DOR DE BUSCA** — não o nome do serviço
   - ✅ "Cansada de dietas que não funcionam?"
   - ❌ "Consulta Nutricional Personalizada"

3. **CTAs ESPECÍFICOS** — nunca genéricos
   - ✅ "Quero agendar minha avaliação", "Falar com a nutricionista"
   - ❌ "Saiba mais", "Clique aqui", "Entre em contato"

4. **SÓ INCLUA BLOCOS COM DADOS REAIS**
   - Sem depoimentos no briefing → não inclua bloco de depoimentos
   - Sem endereço → não inclua mapa
   - Sem Instagram confirmado → não inclua feed

5. **MÍNIMO 6 BLOCOS, MÁXIMO 9** — sempre incluir:
   - Bloco 1: Cabeçalho (sempre)
   - Bloco 2: Hero (sempre)
   - Último bloco antes do rodapé: CTA Final (sempre)
   - Último bloco: Rodapé (sempre)

6. **NARRATIVA CONECTADA** — cada bloco prepara o próximo psicologicamente

---

## FORMATO DE SAÍDA — SIGA EXATAMENTE, SEM DESVIOS

Responda APENAS com os blocos no formato abaixo. Nada antes, nada depois.

---
### BLOCO 1: Cabeçalho
**Objetivo narrativo:** Âncora de marca + CTA sempre visível
**Copy sugerida:**
- Logo/Nome: "[nome da marca]"
- Menu: [itens de navegação baseados nos blocos]
- CTA Header: "[texto do botão]"
**Layout sugerido:** Logo à esquerda, nav central, CTA à direita. Sticky no topo.
**Condicional:** Sempre presente

---
### BLOCO 2: Hero — [subtítulo descritivo]
**Objetivo narrativo:** Capturar atenção em 3 segundos e justificar o clique do anúncio
**Copy sugerida:**
- Título (H1): "[FRASE QUE ESPELHA A DOR DE BUSCA DO CLIENTE IDEAL]"
- Subtítulo: "[ampliar o benefício em 1-2 linhas, 1ª pessoa]"
- CTA Principal: "[ação específica com verbo forte]"
- CTA Secundário (opcional): "[alternativa mais suave]"
**Layout sugerido:** [texto à esquerda ou centralizado, onde vai a imagem]
**Condicional:** Sempre presente

---
### BLOCO [N]: [Nome do Bloco]
**Objetivo narrativo:** [o que este bloco alcança psicologicamente]
**Copy sugerida:**
- Título: "[texto]"
- Subtítulo: "[texto, se houver]"
- Body: "[copy principal em 1ª pessoa]"
- CTA (se aplicável): "[texto específico]"
**Layout sugerido:** [descrição do layout]
**Condicional:** [por que este bloco foi incluído — qual dado do briefing justifica]

---
[CONTINUAR ATÉ O CTA FINAL E RODAPÉ]

---
### SEQUÊNCIA FINAL
1. Cabeçalho
2. Hero
3. [próximos blocos em ordem]
...
[último]: Rodapé
    `.trim();
  },

  aprovarEstrutura() {
    const rascunho = this.B?.estrutura_rascunho;
    if (!rascunho?.trim()) { this.showToast('Gere a estrutura antes de aprovar.', 'warning'); return; }
    this.setField('estrutura_aprovada', rascunho);
    this.showToast('Estrutura aprovada! Avance para Direção de Arte.', 'success');
    this.renderScreen();
    this.renderStepsNav();
  },

  async refinarEstrutura() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }

    const feedbackInput = document.getElementById('estrutura-feedback-input');
    const feedback = feedbackInput?.value?.trim();

    if (!feedback) {
      this.showToast('Descreva o que deseja ajustar antes de refinar.', 'warning');
      return;
    }

    const rascunhoAtual = this.B?.estrutura_rascunho;
    if (!rascunhoAtual?.trim()) {
      this.showToast('Gere a estrutura antes de refinar.', 'warning');
      return;
    }

    this.openAILog('Refinando Estrutura com IA', [
      { id: 1, icon: 'message-square', label: 'Analisando seu feedback...' },
      { id: 2, icon: 'refresh-cw', label: 'Aplicando ajustes...' },
      { id: 3, icon: 'check-circle', label: 'Estrutura refinada!' },
    ]);

    try {
      this.aiLogStep(1);
      await this.aiLogDelay(300);

      const prompt = `
Você é um Copywriter Sênior especializado em landing pages de alta conversão.

## ESTRUTURA ATUAL DA LANDING PAGE

${rascunhoAtual}

---

## FEEDBACK DO CLIENTE

"${feedback}"

---

## SUA TAREFA

Analise o feedback e refine a estrutura mantendo o formato original.

REGRAS:
1. Aplique EXATAMENTE as mudanças pedidas no feedback
2. Mantenha os blocos não mencionados IDÊNTICOS al original
3. SEMPRE use 1ª pessoa do singular em toda a copy
4. Mantenha o mesmo formato de saída (### BLOCO N: Nome)
5. Retorne a estrutura COMPLETA — todos os blocos, não só os alterados
6. CTAs sempre específicos, nunca genéricos
      `.trim();

      this.aiLogStep(2);
      const resultado = await this.callAI(prompt);

      this.setField('estrutura_rascunho', resultado);
      this.setField('estrutura_wireframe', '');

      if (feedbackInput) feedbackInput.value = '';

      this.aiLogStep(3);
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.closeAILog();
      this.renderScreen();
      this.showToast('Estrutura refinada! Revise novamente.', 'success');
    } catch (err) {
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao refinar: ' + err.message, 'error');
      }, 1200);
    }
  },

  /* ----------------------------------------------------------
     Geração do DOC-IMPL
  ---------------------------------------------------------- */
  async generateDocImpl() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }
    if (!this.P) { this.showToast('Nenhum projeto ativo.', 'warning'); return; }

    this.state.isGenerating = true;

    const slug = (this.B.slug || this.B.nome_cliente?.toLowerCase().replace(/\s+/g, '-') || 'projeto')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '');

    this.openAILog('Gerando Ficha de Implementação em 4 Partes', [
      { id: 1, icon: 'package',    label: 'PARTE 1 — Fundação & Design System (30–60s)...' },
      { id: 2, icon: 'image',      label: 'PARTE 2 — Assets & Componentes Globais (30–60s)...' },
      { id: 3, icon: 'layers',     label: 'PARTE 3 — Seções da Landing Page (30–60s)...' },
      { id: 4, icon: 'file-code',  label: 'PARTE 4 — Página Final & Deploy (30–60s)...' },
      { id: 5, icon: 'download',   label: 'Baixando os 4 arquivos...' },
    ]);

    try {
      // ── PARTE 1: Fundação ─────────────────────────────────────
      this.aiLogStep(1, 'Gerando configuração base e design system...');
      const parte1 = await this.callAI(this.buildImplPromptParte1());
      await this.aiLogDelay(300);

      // ── PARTE 2: Assets & Componentes Globais ────────────────
      this.aiLogStep(2, 'Gerando componentes de layout...');
      const parte2 = await this.callAI(this.buildImplPromptParte2());
      await this.aiLogDelay(300);

      // ── PARTE 3: Seções ───────────────────────────────────────
      this.aiLogStep(3, 'Gerando seções específicas do projeto...');
      const parte3 = await this.callAI(this.buildImplPromptParte3());
      await this.aiLogDelay(300);

      // ── PARTE 4: Página Final ─────────────────────────────────
      this.aiLogStep(4, 'Gerando página final e configurações de deploy...');
      const parte4 = await this.callAI(this.buildImplPromptParte4());
      await this.aiLogDelay(300);

      // ── Download dos 4 arquivos ───────────────────────────────
      this.aiLogStep(5);
      await this.aiLogDelay(400);

      this.downloadText(parte1, `doc-impl-${slug}-parte1-fundacao.md`,   'text/markdown');
      await this.aiLogDelay(600);
      this.downloadText(parte2, `doc-impl-${slug}-parte2-componentes.md`, 'text/markdown');
      await this.aiLogDelay(600);
      this.downloadText(parte3, `doc-impl-${slug}-parte3-secoes.md`,      'text/markdown');
      await this.aiLogDelay(600);
      this.downloadText(parte4, `doc-impl-${slug}-parte4-pagina.md`,      'text/markdown');

      this.aiLogDone();
      this.state.isGenerating = false;
      this.showNotification('AIGator', '4 arquivos de implementação gerados!');

      setTimeout(() => {
        this.closeAILog();
        this.showToast('4 arquivos baixados! Implemente na ordem: Parte 1 → 2 → 3 → 4', 'success', 6000);
        this.renderScreen();
      }, 600);

    } catch (e) {
      console.error('[AIGator] generateDocImpl:', e);
      this.state.isGenerating = false;
      this.aiLogError(this.state.aiLog.active, e.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar: ' + e.message, 'error');
      }, 1200);
    }
  },

  /* ----------------------------------------------------------
     Prompts de Implementação — 4 Partes Separadas
     Cada parte gera 1 arquivo .md independente para download.
     O Roo implementa na ordem: Parte 1 → 2 → 3 → 4.
  ---------------------------------------------------------- */

  buildImplPromptParte1() {
    const B = this.B || {};
    const fichaArte = (() => {
      try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); }
      catch { return {}; }
    })();

    const corPrimaria   = B.arte_cor_principal || fichaArte?.paleta?.primaria   || '#6366f1';
    const corSecundaria = B.arte_cor_secundaria || fichaArte?.paleta?.secundaria || '#8b5cf6';
    const corTexto      = fichaArte?.paleta?.texto     || '#1e293b';
    const corFundo      = fichaArte?.paleta?.fundo     || '#ffffff';
    const fonteDisplay  = fichaArte?.tipografia?.display || 'Inter';
    const fonteBody     = fichaArte?.tipografia?.body    || 'Inter';
    const nomeSlug      = (B.nome_cliente || 'projeto').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return `
Você é um engenheiro front-end sênior especializado em Astro 4.x e Tailwind CSS 3.x.

## SUA TAREFA — PARTE 1 DE 4: FUNDAÇÃO & DESIGN SYSTEM

Gere APENAS os arquivos de fundação do projeto. Código COMPLETO, sem placeholders, sem comentários do tipo "adicione aqui".

## DADOS DO PROJETO

- **Nome do projeto (slug):** ${nomeSlug}
- **Nome do cliente:** ${B.nome_cliente || 'Projeto'}
- **Domínio:** ${B.dominio || '[DOMINIO]'}
- **Segmento:** ${B.segmento || ''}
- **Cor primária:** ${corPrimaria}
- **Cor secundária:** ${corSecundaria}
- **Cor do texto:** ${corTexto}
- **Cor do fundo:** ${corFundo}
- **Fonte display (títulos):** ${fonteDisplay}
- **Fonte body (corpo):** ${fonteBody}
- **Tom visual:** ${fichaArte?.tom_visual || 'moderno e profissional'}

## STACK OBRIGATÓRIA

- Astro 4.x (output: hybrid)
- Tailwind CSS 3.x
- GSAP 3.x + ScrollTrigger
- Lenis (smooth scroll)
- Lucide React
- Deploy: Vercel

## REGRAS DE CÓDIGO — DESIGN SYSTEM

1. **PROIBIDO usar px** para tipografia, espaçamento ou layout — use APENAS rem
2. Tailwind theme estende variáveis CSS — nunca hardcode valores de cor
3. globals.css define TODAS as variáveis CSS com os valores reais acima
4. Button.astro já usa as variáveis — nenhuma cor hardcoded
5. Layout.astro includes preconnect para as Google Fonts definidas
6. Todo código deve passar em \`astro check\` sem erros

## ARQUIVOS A GERAR (nesta ordem)

### \`package.json\`
### \`astro.config.mjs\`
### \`tailwind.config.js\`
### \`.env.example\`
### \`src/styles/globals.css\`
(Variáveis CSS com valores reais acima + reset + utilitários base)
### \`src/layouts/Layout.astro\`
(Head completo: meta charset, viewport, title, favicon, Google Fonts preconnect, globals.css import, slot)
### \`src/components/ui/Button.astro\`
(Props: href, variant: 'primary'|'secondary'|'ghost'|'outline', size: 'sm'|'md'|'lg', ariaLabel — usa variáveis CSS)

---

Gere APENAS estes 7 arquivos, com código 100% completo e funcional.
Formato de resposta: título \`### \\\`caminho/arquivo\\\`\` seguido do bloco de código.
    `.trim();
  },

  buildImplPromptParte2() {
    const B = this.B || {};
    const fichaArte = (() => {
      try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); }
      catch { return {}; }
    })();

    // Extrair imagens necessárias da estrutura aprovada
    const estrutura = B.estrutura_aprovada || B.estrutura_rascunho || '';
    const temHero      = /hero/i.test(estrutura);
    const temServico   = /servi[cç]/i.test(estrutura);
    const temResultado = /resultado|transforma/i.test(estrutura);

    const imagensNecessarias = [
      temHero      && `- \`src/assets/images/hero-principal.webp\` — Foto principal do profissional ou imagem de impacto do Hero. Dimensões ideais: 1200×900px.`,
      temServico   && `- \`src/assets/images/servico-principal.webp\` — Imagem do serviço ou ambiente profissional. Dimensões ideais: 800×600px.`,
      temResultado && `- \`src/assets/images/resultado-transformacao.webp\` — Imagem inspiradora de resultado/transformação. Dimensões ideais: 1200×800px.`,
      `- \`public/og-image.jpg\` — Imagem Open Graph para redes sociais. Dimensões: 1200×630px.`,
      `- \`public/favicon.svg\` — Ícone do site. Pode ser uma versão simplificada do logo.`,
    ].filter(Boolean).join('\n');

    return `
Você é um engenheiro front-end sênior especializado em Astro 4.x.

## SUA TAREFA — PARTE 2 DE 4: ASSETS & COMPONENTES GLOBAIS

Esta parte assume que a PARTE 1 já foi implementada.
Os arquivos \`globals.css\`, \`Layout.astro\` e \`Button.astro\` já existem.

## DADOS DO CLIENTE

- **Nome:** ${B.nome_cliente || 'Profissional'}
- **Segmento:** ${B.segmento || ''}
- **WhatsApp:** ${B.whatsapp || ''}
- **E-mail:** ${B.email || ''}
- **Instagram:** ${B.instagram || ''}
- **Domínio:** ${B.dominio || '[DOMINIO]'}
- **Cor primária:** ${B.arte_cor_principal || fichaArte?.paleta?.primaria || '#6366f1'}
- **Tom visual:** ${fichaArte?.tom_visual || 'moderno e profissional'}
- **Logo disponível:** ${B.arte_logo === 'svg' ? 'SVG' : B.arte_logo === 'png' ? 'PNG' : 'Sem logo — usar texto'}

## PRÉ-REQUISITO: ESTRUTURA DE PASTAS E IMAGENS PLACEHOLDER

Antes de gerar qualquer componente, o Roo deve:
1. Criar a pasta \`src/assets/images/\`
2. Criar um arquivo SVG placeholder para cada imagem necessária (para o build não quebrar)

### Imagens necessárias neste projeto:
${imagensNecessarias}

**Instrução para o Roo:** Para cada imagem .webp listada, criar um SVG placeholder temporário com o mesmo nome (ex: \`hero-principal.webp\` → criar \`hero-principal.svg\` na mesma pasta como placeholder). As imagens reais devem ser inseridas pelo cliente antes do go-live.

## ARQUIVOS A GERAR (nesta ordem)

### \`src/assets/images/.gitkeep\`
(Arquivo vazio para manter a pasta no git)

### \`src/components/SEO.astro\`
(Props: title, description, image?, canonicalURL? — gera todas as meta tags OG, Twitter Card, canonical)

### \`src/components/Header.astro\`
(Logo ou nome em texto, navegação interna com smooth scroll para IDs das seções, CTA WhatsApp, menu mobile hamburger funcional com Tailwind)

### \`src/components/Footer.astro\`
(Nome da empresa, links de navegação, WhatsApp, e-mail, Instagram se disponível, copyright, texto de rodapé)

### \`src/components/WhatsAppFloat.astro\`
(Botão flutuante WhatsApp fixo no canto inferior direito — link \`wa.me/${B.whatsapp || '[WHATSAPP]'}\`)

### \`src/scripts/animations.ts\`
(Inicialização GSAP + ScrollTrigger + Lenis — exporta função \`initAnimations()\` que o index.astro chama)

---

REGRAS:
1. Código 100% completo, sem placeholders de lógica
2. PROIBIDO px — use rem
3. Responsive (mobile-first)
4. ARIA labels em todos os elementos interativos
5. WhatsApp link com mensagem pré-preenchida: "${B.whatsapp_mensagem_padrao || 'Olá! Quero saber mais.'}"

Formato: título \`### \\\`caminho/arquivo\\\`\` seguido do bloco de código.
    `.trim();
  },

  buildImplPromptParte3() {
    const B = this.B || {};
    const fichaArte = (() => {
      try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); }
      catch { return {}; }
    })();

    const estrutura = B.estrutura_aprovada || B.estrutura_rascunho || '';

    return `
Você é um Copywriter Sênior e engenheiro front-end especializado em landing pages de alta conversão em Astro 4.x.

## SUA TAREFA — PARTE 3 DE 4: SEÇÕES DA LANDING PAGE

Esta parte assume que as PARTES 1 e 2 já foram implementadas.
\`Button.astro\`, \`Header.astro\`, \`Footer.astro\`, \`globals.css\` já existem e funcionam.

## DADOS DO CLIENTE

- **Nome:** ${B.nome_cliente || 'Profissional'}
- **Segmento:** ${B.segmento || ''}
- **Nicho:** ${B.nicho || ''}
- **WhatsApp:** ${B.whatsapp || ''}
- **Mensagem WhatsApp:** ${B.whatsapp_mensagem_padrao || 'Olá! Quero saber mais.'}
- **Cor primária:** ${B.arte_cor_principal || fichaArte?.paleta?.primaria || '#6366f1'}
- **Tom visual:** ${fichaArte?.tom_visual || 'moderno e profissional'}
- **Intensidade visual:** ${B.arte_intensidade || fichaArte?.intensidade || 'medio'}
- **Elementos visuais:** ${fichaArte?.elementos_visuais || ''}
- **Tipografia display:** ${fichaArte?.tipografia?.display || 'Inter'}

## ESTRUTURA DA PÁGINA APROVADA (COPY REAL — USE EXATAMENTE ESTA)

${estrutura.substring(0, 6000)}

---

## INSTRUÇÕES DE GERAÇÃO

Para CADA bloco da estrutura acima, gere 1 componente .astro em \`src/components/sections/\`.

REGRAS CRÍTICAS:
1. **USE A COPY REAL DA ESTRUTURA** — não invente títulos, subtítulos ou CTAs diferentes
2. **PRIMEIRA PESSOA DO SINGULAR** em toda a copy — "Eu ajudo...", nunca "Ela atende..."
3. **CTAs com links reais** — WhatsApp \`wa.me/${B.whatsapp || '[WHATSAPP]'}\` com mensagem encodada
4. **PROIBIDO px** — use rem para tudo
5. **Animações GSAP** — cada seção tem entrada com ScrollTrigger
6. **Imagens** — use \`<img src="../../assets/images/[nome].webp"\` com \`loading="lazy"\` e \`alt\` descritivo
7. **Componente isolado** — cada seção é auto-contida, importa Button se precisar de CTA

## FORMATO DE RESPOSTA

Para cada bloco da estrutura aprovada, gere:

### \`src/components/sections/[NomeDoBloco].astro\`
\`\`\`astro
---
import Button from '../ui/Button.astro';
---
<section id="[id-da-secao]" class="...">
  ...
</section>
<script>
  // Animação GSAP
</script>
\`\`\`

Gere TODOS os componentes de seção baseados na estrutura aprovada acima.
    `.trim();
  },

  buildImplPromptParte4() {
    const B = this.B || {};
    const fichaArte = (() => {
      try { return typeof B.ficha_direcao_arte === 'object' ? B.ficha_direcao_arte : JSON.parse(B.ficha_direcao_arte || '{}'); }
      catch { return {}; }
    })();

    // Extrair nomes das seções da estrutura para montar o index
    const estrutura = B.estrutura_aprovada || B.estrutura_rascunho || '';
    const blocos = [];
    const blocoRegex = /### BLOCO\s*\d+[:\-–]?\s*(.+?)(?:\n|$)/gi;
    let m;
    while ((m = blocoRegex.exec(estrutura)) !== null) {
      const nome = m[1].trim();
      // Ignorar cabeçalho e rodapé (já são Header/Footer)
      if (!/cabeçalho|header|rodapé|footer/i.test(nome)) {
        blocos.push(nome);
      }
    }

    return `
Você é um engenheiro front-end sênior especializado em Astro 4.x, SEO e performance web.

## SUA TAREFA — PARTE 4 DE 4: PÁGINA FINAL, SEO & DEPLOY

Esta parte assume que as PARTES 1, 2 e 3 já foram implementadas.
Todos os componentes de seção já existem em \`src/components/sections/\`.

## DADOS DO PROJETO

- **Nome:** ${B.nome_cliente || 'Projeto'}
- **Domínio:** ${B.dominio || '[DOMINIO]'}
- **Título SEO:** ${B.titulo_seo || B.nome_cliente || 'Landing Page'}
- **Descrição SEO:** ${B.descricao_seo || ''}
- **Palavra-chave principal:** ${B.palavra_chave_principal || ''}
- **Palavras-chave secundárias:** ${B.palavras_chave_secundarias || ''}
- **Segmento:** ${B.segmento || ''}
- **Cidade/Estado:** ${[B.cidade, B.estado].filter(Boolean).join(', ') || ''}
- **Schema tipo:** ${B.schema_tipo || 'LocalBusiness'}
- **GTM ID:** [GTM_ID] (o cliente deve preencher)
- **Cor primária:** ${B.arte_cor_principal || fichaArte?.paleta?.primaria || '#6366f1'}

## SEÇÕES DA LANDING PAGE (na ordem da estrutura aprovada)

${blocos.length > 0 ? blocos.map((b, i) => `${i + 1}. ${b}`).join('\n') : estrutura.substring(0, 800)}

## ARQUIVOS A GERAR

### \`src/pages/index.astro\`
(Importa e monta todos os componentes na ordem da estrutura aprovada — Header, seções, WhatsAppFloat, Footer)
(Passa props de SEO via componente SEO.astro)
(Chama initAnimations() no script client:load)

### \`src/pages/obrigado.astro\`
(Página de agradecimento simples — pós-conversão WhatsApp/formulário — com botão voltar para home)

### \`public/robots.txt\`
(Allow: / para todos os bots, Sitemap: https://${B.dominio || '[DOMINIO]'}/sitemap-index.xml)

### \`public/manifest.json\`
(PWA manifest básico com nome, cores e ícones)

### \`vercel.json\`
(Configuração de headers de cache e redirect de www para apex)

## INSTRUÇÕES FINAIS PARA O ROO

Após implementar todos os arquivos das 4 partes, execute:

\`\`\`bash
npm install
npx astro check
npm run build
\`\`\`

Se \`astro check\` retornar erros de tipo, corrija antes de continuar.
Se \`npm run build\` falhar por imagem ausente, verifique se os placeholders da PARTE 2 foram criados.

## CAMPOS QUE O CLIENTE DEVE PREENCHER ANTES DO GO-LIVE

- \`[DOMINIO]\` → Domínio real (ex: anaesternutricionista.com.br)
- \`[GTM_ID]\` → ID do Google Tag Manager (ex: GTM-XXXXXXX)
- Imagens em \`src/assets/images/\` → Substituir placeholders pelas fotos reais

Formato: título \`### \\\`caminho/arquivo\\\`\` seguido do bloco de código.
    `.trim();
  },

  /* ----------------------------------------------------------
     Downloads
  ---------------------------------------------------------- */
  async downloadDoc1() {
    const btn = document.getElementById('btn-download-doc1');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader" style="width:14px;height:14px;animation:spin 1s linear infinite;"></i> Gerando...';
      lucide.createIcons({ nodes: [btn] });
    }
    try {
      const doc1 = this.buildDoc1();
      const slug = (this.B.slug || 'projeto').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      this.downloadText(doc1, `doc1-${slug}.md`, 'text/markdown');
      this.showToast('DOC-1 baixado com sucesso!', 'success');
    } catch (err) {
      this.showToast('Erro ao gerar DOC-1: ' + err.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="download" style="width:14px;height:14px"></i> Baixar DOC-1';
        lucide.createIcons({ nodes: [btn] });
      }
    }
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

  /* ----------------------------------------------------------
     Arquivos
  ---------------------------------------------------------- */
  handleIntakeFiles(files) {
    if (!files.length) return;
    this.state.intakeFiles = [...(this.state.intakeFiles || []), ...files];
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
    this.showToast(`${files.length} arquivo(s) adicionado(s)`, 'success');
  },

  removeIntakeFile(index) {
    this.state.intakeFiles.splice(index, 1);
    this.handleIntakeFiles([]);
  },

  handleArtFiles(files) {
    if (!files.length || !this.P) return;
    const existing = this.B.arte_arquivos || [];
    const novos = files.map(f => ({ name: f.name, size: f.size, type: f.type }));
    this.setField('arte_arquivos', [...existing, ...novos]);
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
    arr.push({ url: '', nota: '' });
    this.setField(field, arr);
    this.renderScreen();
  },

  removeArtRef(type, index) {
    const field = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    const arr = [...(this.B[field] || [])];
    arr.splice(index, 1);
    this.setField(field, arr);
    this.renderScreen();
  },

  updateArtRef(type, index, key, value) {
    const field = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    const arr = [...(this.B[field] || [])];
    if (arr[index]) arr[index][key] = value;
    this.setField(field, arr);
  },

  /* ----------------------------------------------------------
     Sidebar e notificações
  ---------------------------------------------------------- */
  closeSidebar() {
    document.querySelector('.sidebar')?.classList.remove('is-open');
  },

  showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  },

  openSidebar() {
    document.querySelector('.sidebar')?.classList.add('is-open');
  },
});