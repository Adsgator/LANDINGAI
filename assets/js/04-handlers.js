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
        const field = el.dataset.field;
        this.setField(field, el.value);

        // Atualiza preview do WhatsApp em tempo real
        if (field === 'whatsapp') {
          const preview = container.querySelector('#wa-preview');
          if (preview) {
            preview.style.display = el.value ? '' : 'none';
            preview.textContent = el.value ? `wa.me/${el.value}` : '';
          }
        }

        // Se for campo de arte, forçar re-render para mostrar botão de aprovação manual
        if (['arte_cor_principal', 'arte_fonte_principal'].includes(field)) {
          this.renderScreen(true);
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
        if (structural.includes(field)) this.renderScreen(true);
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
        if (structural.includes(field)) this.renderScreen(true);
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

    if (this.renderizarReferenciasList && container.querySelector('#referencia-visual-list')) {
      this.renderizarReferenciasList();
    }

    // ── Color pickers ────────────────────────────────────────
    container.querySelectorAll('input[type="color"][data-field]').forEach(picker => {
      picker.addEventListener('input', () => {
        const field = picker.dataset.field;
        const textInput = container.querySelector(`input[type="text"][data-field="${field}"]`);
        if (textInput) textInput.value = picker.value;
        this.setField(field, picker.value);

        // Se for cor principal, forçar re-render para o botão manual aparecer
        if (field === 'arte_cor_principal') {
          this.renderScreen(true);
        }
      });
    });

    // ── Aprovar Arte ─────────────────────────────────────────
    const approveArtBtn = container.querySelector('#btn-approve-art') ||
      document.getElementById('btn-approve-art');
    if (approveArtBtn) approveArtBtn.addEventListener('click', () => this.aprovarArte());

    const approveArtManualBtn = container.querySelector('#btn-approve-art-manual') ||
      document.getElementById('btn-approve-art-manual');
    if (approveArtManualBtn) approveArtManualBtn.addEventListener('click', () => this.aprovarArteManual());

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

    // Botão Google Ads na Sidebar
    const gaBtn = document.getElementById('btn-google-ads');
    if (gaBtn) {
      gaBtn.addEventListener('click', () => this.handleGoogleAdsClick());
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
      const resultado = await this.callAI({
        userPrompt: prompt,
        maxTokens: 8192 // Aumentado para garantir que o JSON longo caiba
      });
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
Você é um estrategista sênior de marketing digital. Extraia TODAS as informações do briefing abaixo para preencher o JSON.

REGRAS:
1. Retorne APENAS o JSON.
2. NUNCA invente informações. Se não houver info, use "".
3. Garanta que o JSON seja VÁLIDO e bem formatado.
4. Responda APENAS com o objeto JSON, sem textos extras ou markdown.

ESTRUTURA DO JSON:
{
  "step1": { "nome_profissional": "", "nome_cliente": "", "nome_marca": "", "nicho": "", "segmento": "", "cidade": "", "estado": "", "proposta_valor": "", "missao": "", "anos_experiencia": "", "formacao": "", "certificacoes": "", "tipo": "", "dominio": "", "cnpj": "", "aviso_legal": "" },
  "step2": { "avatar_nome": "", "avatar_idade": "", "avatar_genero": "", "avatar_profissao": "", "avatar_renda": "", "dor_principal": "", "dores_secundarias": "", "desejo_principal": "", "objecao_preco": "", "objecao_tempo": "", "objecao_confianca": "", "objecao_resultado": "", "gatilhos_mentais": "", "whatsapp": "", "email": "", "horarios": "", "gtm_id": "", "objetivo_conversao": "" },
  "step3": { "servico_principal": "", "servico_descricao": "", "servicos_descricao": "", "como_funciona_passo1": "", "como_funciona_passo2": "", "como_funciona_passo3": "", "como_funciona_passo4": "", "modalidade": "", "duracao_sessao": "", "frequencia": "", "formato": "", "resultado_esperado": "", "prazo_resultado": "", "servicos_adicionais": "", "instagram": "", "tiktok": "", "youtube": "", "google_business": "", "google_nota": "", "google_qtd": "" },
  "step4": { "depoimento1_nome": "", "depoimento1_texto": "", "depoimento1_resultado": "", "depoimento2_nome": "", "depoimento2_texto": "", "depoimento2_resultado": "", "depoimento3_nome": "", "depoimento3_texto": "", "depoimento3_resultado": "", "casos_de_sucesso": "", "perfil_google": "", "nota_google": "", "quantidade_avaliacoes": "", "instagram": "", "seguidores": "", "midia_aparicoes": "", "endereco": "", "exibir_localizacao": "", "maps_link": "", "cidades_atendimento": "", "faq": "", "objecoes_atendimento": "", "plataforma_online": "" },
  "step5": { "diferencial1_titulo": "", "diferencial1_descricao": "", "diferencial2_titulo": "", "diferencial2_descricao": "", "diferencial3_titulo": "", "diferencial3_descricao": "", "diferencial4_titulo": "", "diferencial4_descricao": "", "metodologia_propria": "", "garantia": "", "atendimento_diferenciado": "", "diferencial": "", "frase_impacto": "", "historia": "", "casos_resultados": "", "depoimentos": "", "depoimentos_qtd": "", "depoimentos_formato": [] },
  "step6": { "whatsapp": "", "whatsapp_mensagem_padrao": "", "email": "", "preco_plano1_nome": "", "preco_plano1_valor": "", "preco_plano1_descricao": "", "preco_plano2_nome": "", "preco_plano2_valor": "", "preco_plano2_descricao": "", "preco_plano3_nome": "", "preco_plano3_valor": "", "preco_plano3_descricao": "", "forma_pagamento": "", "desconto_pix": "", "parcelas": "", "trial_gratuito": "", "horario_atendimento": "", "publico_primario": "", "publico_dor": "", "publico_resultado": "" },
  "step7": { "cor_primaria": "", "cor_secundaria": "", "cor_acento": "", "cor_fundo": "", "estilo_visual": "", "fonte_titulo": "", "fonte_corpo": "", "tom_comunicacao": "", "referencias_visuais": "", "logo_descricao": "", "imagens_disponiveis": "", "video_disponivel": "", "estilo_desejado": "", "sensacao_visitante": "", "restricoes": "" },
  "step8": { "titulo_seo": "", "descricao_seo": "", "palavra_chave_principal": "", "palavras_chave_secundarias": "", "dominio_sugerido": "", "schema_tipo": "", "og_titulo": "", "og_descricao": "" }
}

BRIEFING:
${briefing}
    `.trim();
  },

  async applyIntakeJSON(jsonString) {
    let data;
    try {
      data = this.robustParseJSON(jsonString);
    } catch (e) {
      console.error('[Intake] Erro fatal ao parsear JSON da IA:', e);
      console.log('[Intake] Conteúdo bruto recebido:', jsonString);
      throw new Error('Resposta da IA inválida — o formato retornado não é um JSON válido. Verifique o console para detalhes.');
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
      const systemPrompt = this.buildBlindedSystemPrompt(B, 'copy_completa');
      const prompt = `Com base nas informações abaixo, crie uma Ficha de Direção de Arte completa para a landing page.

DADOS DO PROJETO:
- Cliente: ${B.nome_cliente || '—'}
- Segmento: ${B.segmento || '—'}
- Tipo: ${B.tipo || '—'}
- Público-alvo: ${B.publico_primario || '—'}
- Tom desejado: ${B.estilo_desejado || '—'}
- Sensação desejada: ${B.sensacao_visitante || '—'}
- Restrições: ${B.restricoes || 'Nenhuma'}
- Cor principal (Marca): ${B.arte_cor_principal || 'Não definida'}
- Cor secundária (Marca): ${B.arte_cor_secundaria || 'Não definida'}
- Cor complementar (Marca): ${B.arte_cor_complementar || 'Não definida'}
- Cor de fundo base: ${B.arte_cor_fundo || 'Não definida'}
- Cor texto principal: ${B.arte_cor_texto || 'Não definida'}
- Cor texto de suporte: ${B.arte_cor_suporte || 'Não definida'}
- Fonte Principal (Títulos): ${B.arte_fonte_principal || 'A IA decide'}
- Fonte Secundária (Textos/Apoio): ${B.arte_fonte_secundaria || 'A IA decide'}
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
      const res = await this.callAI({
        systemPrompt: systemPrompt,
        userPrompt: prompt
      });

      this.aiLogStep(4);
      let ficha = null;
      try {
        ficha = this.robustParseJSON(res);
      } catch (e) {
        throw new Error('Resposta da IA inválida. O formato de Direção de Arte não é um JSON válido.');
      }

      // Validação do output (Regras Blindadas)
      const textoValidar = JSON.stringify(ficha);
      const validacao = this.validateBlindedOutput(textoValidar);

      if (!validacao.valido) {
        console.warn('Output da arte falhou na validação blindada:', validacao.erros);
        // Aqui poderíamos forçar um retry, mas vamos apenas mostrar o aviso no modal de resultado
      }

      this.aiLogStep(5);
      this.setField('ficha_direcao_arte', JSON.stringify(ficha));
      this.state.artAnalyzed = true;
      await this.aiLogDelay(300);

      this.aiLogDone();

      setTimeout(() => {
        this.closeAILog();
        this.exibirFichaGerada(ficha, 'art');
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

  /**
   * Exibe a ficha gerada (Arte ou Estrutura) validando restrições
   */
  async exibirFichaGerada(ficha, tipo = 'art') {
    // 1. Normalizar restrições do state
    const restricoesRaw = this.B?.restricoes || '';
    const restricoes = this.normalizeRestricoes(restricoesRaw);

    // 2. Extrair todo o texto da ficha
    const textoCompleto = this.extrairTextoJson(ficha);

    // 3. Validar
    const validacao = this.validateCopyComRestricoes(textoCompleto, restricoes);

    // 4. Se houver violações, preparar aviso
    let avisoHTML = '';
    if (!validacao.valido) {
      avisoHTML = `
        <div class="alert alert-warning" style="margin-bottom:16px; border-left:4px solid var(--warning); background:rgba(255,193,7,0.1); padding:12px; border-radius:4px;">
          <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px; color:var(--warning); font-weight:600;">
            <i data-lucide="alert-triangle" style="width:18px;height:18px;"></i>
            <span>Atenção: Restrições não foram totalmente respeitadas</span>
          </div>
          <p style="font-size:13px; margin:0 0 8px 0; color:var(--text-secondary);">A IA incluiu conteúdo que viola as restrições configuradas:</p>
          <ul style="font-size:12px; margin:0 0 12px 20px; padding:0; color:var(--text-primary);">
            ${validacao.violacoes.map(v => `
              <li>
                <strong>${v.tipo === 'palavra_proibida' ? 'Palavra' : (v.tipo === 'tom_proibido' ? 'Tom' : 'Tópico')}:</strong> 
                ${v.palavra || v.topico || v.marcador}
                ${v.ocorrencias ? ` (${v.ocorrencias}x)` : ''}
              </li>
            `).join('')}
          </ul>
          <div style="display:flex; gap:8px;">
            <button class="btn-primary btn-sm" onclick="App.${tipo === 'art' ? 'runArtAnalysis()' : 'runEstruturaAnalysis()'}">
              Regenerar
            </button>
            <button class="btn-ghost btn-sm" onclick="App.showToast('Você pode editar os campos manualmente para corrigir.', 'info')">
              Editar Manualmente
            </button>
          </div>
        </div>
      `;
    }

    // 5. Exibir o modal correspondente
    if (tipo === 'art') {
      this._showArtResultModal(ficha, avisoHTML);
    } else {
      // Para estrutura, o aviso é injetado na tela se necessário
      this.renderScreen();
      if (!validacao.valido) {
        this.showToast('Restrições violadas na estrutura. Revise os alertas.', 'warning');
      }
    }
  },

  _showArtResultModal(ficha, avisoHTML = '') {
    const modal = document.getElementById('modal-direcao-arte');
    if (!modal) {
      this.showToast('Erro: modal-direcao-arte não encontrado', 'error');
      return;
    }

    // Aba 1: Direção Geral
    const contentDirecao = document.getElementById('content-direcao-geral');
    if (contentDirecao) {
      const decisoes = (ficha.decisoes || []).map(d => `
        <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;padding:8px;background:var(--bg-default);border-radius:var(--r-sm);">
          <i data-lucide="check" style="width:14px;height:14px;color:var(--accent);flex-shrink:0;margin-top:2px"></i>
          <span style="font-size:13px;color:var(--text-primary);line-height:1.5">${d}</span>
        </div>
      `).join('');

      contentDirecao.innerHTML = `
        ${avisoHTML}
        <div class="art-result-section" style="margin-bottom:20px;">
          <div class="art-result-section-title" style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Tema e Tom</div>
          <div class="art-result-text" style="font-size:14px;background:var(--bg-raised);padding:12px;border-radius:var(--r-md);border:1px solid var(--border-subtle);">
            <div style="margin-bottom:8px;"><strong>Tema:</strong> ${ficha.tema === 'escuro' ? '🌙 Escuro (Dark Mode)' : '☀️ Claro (Light Mode)'}</div>
            <div><strong>Tom Visual:</strong> ${ficha.tom_visual || '—'}</div>
          </div>
        </div>
        <div class="art-result-section">
          <div class="art-result-section-title" style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Decisões Criativas</div>
          <div class="art-result-text" style="background:var(--bg-raised);padding:12px;border-radius:var(--r-md);border:1px solid var(--border-subtle);">
            ${decisoes || '<p>Nenhuma decisão específica listada.</p>'}
          </div>
        </div>
      `;
    }

    // Aba 2: Referências
    const contentReferencias = document.getElementById('content-referencias');
    if (contentReferencias) {
      contentReferencias.innerHTML = `
        <div class="art-result-section">
          <div class="art-result-section-title" style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Inspiração Extraída</div>
          <div class="art-result-text" style="font-size:13px;line-height:1.6;background:var(--bg-raised);padding:12px;border-radius:var(--r-md);border:1px solid var(--border-subtle);">
            ${ficha.referencias_inspiracao || 'Nenhuma nota de inspiração extraída das referências.'}
          </div>
        </div>
      `;
    }

    // Aba 3: Cores
    const contentCores = document.getElementById('content-cores');
    if (contentCores) {
      const swatches = (ficha.paleta || []).map(c => `
        <div class="palette-swatch" style="display:flex;flex-direction:column;align-items:center;gap:8px;background:var(--bg-default);padding:12px;border-radius:var(--r-md);border:1px solid var(--border-subtle);flex:1;min-width:100px;">
          <div class="palette-swatch-color" style="background:${c.hex};width:50px;height:50px;border-radius:50%;border:2px solid var(--border-subtle);box-shadow:var(--shadow-sm);"></div>
          <div style="text-align:center;">
            <span class="palette-swatch-label" style="display:block;font-weight:700;font-family:monospace;font-size:13px;color:var(--text-primary);">${c.hex}</span>
            <span style="font-size:11px;font-weight:600;color:var(--text-secondary);display:block;margin-top:2px;">${c.nome}</span>
            <span style="font-size:10px;color:var(--text-tertiary);display:block;margin-top:4px;line-height:1.2;">${c.uso || ''}</span>
          </div>
        </div>
      `).join('');

      contentCores.innerHTML = `
        <div class="art-result-section" style="margin-bottom:20px;">
          <div class="art-result-section-title" style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Paleta de Cores Recomendada</div>
          <div class="palette-swatches" style="display:flex;gap:12px;flex-wrap:wrap;background:var(--bg-raised);padding:16px;border-radius:var(--r-md);border:1px solid var(--border-subtle);">
            ${swatches}
          </div>
        </div>
        ${ficha.elementos_visuais ? `
        <div class="art-result-section">
          <div class="art-result-section-title" style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Elementos Gráficos e Texturas</div>
          <div class="art-result-text" style="font-size:13px;line-height:1.6;background:var(--bg-raised);padding:12px;border-radius:var(--r-md);border:1px solid var(--border-subtle);">
            ${ficha.elementos_visuais}
          </div>
        </div>` : ''}
      `;
    }

    // Aba 4: Detalhes
    const contentDetalhes = document.getElementById('content-detalhes');
    if (contentDetalhes) {
      contentDetalhes.innerHTML = `
        <div class="art-result-section" style="margin-bottom:20px;">
          <div class="art-result-section-title" style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Tipografia</div>
          <div class="art-result-text" style="background:var(--bg-raised);padding:16px;border-radius:var(--r-md);border:1px solid var(--border-subtle);font-size:14px;display:flex;flex-direction:column;gap:8px;">
            <div><strong>Títulos (Display):</strong> <span style="color:var(--accent2);">${ficha.tipografia?.display || '—'}</span></div>
            <div><strong>Textos (Body):</strong> <span style="color:var(--accent2);">${ficha.tipografia?.body || '—'}</span></div>
            ${ficha.tipografia?.mono ? `<div><strong>Detalhes (Mono):</strong> <span style="color:var(--accent2);">${ficha.tipografia.mono}</span></div>` : ''}
            <div style="font-size:12px;color:var(--text-secondary);margin-top:8px;padding-top:8px;border-top:1px dashed var(--border-default);"><em>${ficha.tipografia?.escala || ''}</em></div>
          </div>
        </div>
        ${ficha.fotografia ? `
        <div class="art-result-section">
          <div class="art-result-section-title" style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text-tertiary);margin-bottom:8px;">Direção de Fotografia</div>
          <div class="art-result-text" style="font-size:13px;line-height:1.6;background:var(--bg-raised);padding:12px;border-radius:var(--r-md);border:1px solid var(--border-subtle);">
            ${ficha.fotografia}
          </div>
        </div>` : ''}
      `;
    }

    // Atualizar ícones Lucide
    if (window.lucide) {
      lucide.createIcons({ nodes: [modal] });
    }

    // Exibir modal (usando lógica direta para evitar falhas)
    modal.classList.add('visible');
    modal.style.display = 'block';
    
    // Garantir que a primeira aba está ativa
    if (this.selecionarAbaModal) {
      this.selecionarAbaModal('direacao');
    } else if (window.App && window.App.selecionarAbaModal) {
      window.App.selecionarAbaModal('direacao');
    }

    this.showToast('Direção de Arte gerada! Revise e aprove.', 'success');
  },

  aprovarArte() {
    const B = this.B || {};
    if (!B.ficha_direcao_arte) {
      this.showToast('Gere a direção de arte primeiro.', 'warning');
      return;
    }
    this.setField('arte_ficha_aprovada', B.ficha_direcao_arte);
    this.showToast('Direção de Arte aprovada!', 'success');
    this.closeModal('modal-art-result');
    this.renderScreen();
  },

  async runEstruturaAnalysis() {
    return this.gerarEstrutura();
  },


  // aprovarEstrutura() agora é gerenciado em estrutura.js


  async refinarEstrutura() {
    this.showToast('O refinamento está sendo atualizado para o novo sistema.', 'info');
  },


  /* ----------------------------------------------------------
     Geração do DOC-IMPL
  ---------------------------------------------------------- */
  formatarDocImpl(parte1) {
    // Parse PARTE 1 — extrair .clinerules, .gitignore, .rooignore
    const files = {};

    // Regex para extrair cada seção
    const patterns = {
      clinerules: /---ARQUIVO-1-CLINERULES---([\s\S]*?)(?=---ARQUIVO-|---$|$)/i,
      gitignore: /---ARQUIVO-2-GITIGNORE---([\s\S]*?)(?=---ARQUIVO-|---$|$)/i,
      rooignore: /---ARQUIVO-3-ROOIGNORE---([\s\S]*?)(?=---ARQUIVO-|---$|$)/i,
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = parte1.match(pattern);
      if (match && match[1]) {
        files[key] = match[1].trim();
      }
    });

    // Verificar que os 3 arquivos foram extraídos
    if (!files.clinerules || !files.gitignore || !files.rooignore) {
      console.warn('[AIGator] Aviso: Um ou mais arquivos de config não foram extraídos corretamente');
    }

    return {
      clinerules: files.clinerules || '# .clinerules não foi gerado',
      gitignore: files.gitignore || '# .gitignore não foi gerado',
      rooignore: files.rooignore || '# .rooignore não foi gerado',
      parte1Clean: parte1.replace(/---ARQUIVO-\d-(CLINERULES|GITIGNORE|ROOIGNORE)---[\s\S]*?(?=---|$)/g, '').trim(),
    };
  },

  validateStructure() {
    const B = this.B || {};
    const errors = [];
    const warnings = [];

    // ===== VALIDAÇÕES CRÍTICAS (Erros) =====

    // 1. Verificar estrutura inteligente
    if (!B.estrutura_lp) {
      errors.push('Nenhuma estrutura estratégica foi gerada. Vá para "Estrutura LP" primeiro.');
    }

    // 2. Verificar aprovação
    if (!B.estrutura_aprovada) {
      errors.push('A estrutura não foi aprovada. Revise e aprove para prosseguir.');
    }

    // 3. Contar blocos no JSON
    let blocos = 0;
    try {
      const est = typeof B.estrutura_lp === 'string' ? JSON.parse(B.estrutura_lp) : B.estrutura_lp;
      const listaBlocos = est?.estrutura_lp?.blocos || [];
      blocos = listaBlocos.filter(b => b.incluir).length;

      if (blocos < 5) {
        errors.push(`Estrutura incompleta: apenas ${blocos} blocos inclusos. Mínimo 5 obrigatório.`);
      }

      // 4. Verificar Hero e outros blocos críticos
      const IDs = listaBlocos.filter(b => b.incluir).map(b => b.id);
      if (!IDs.includes('hero')) warnings.push('Não foi detectado um bloco de Hero (#hero).');
      if (!IDs.includes('cta-final')) warnings.push('Não foi detectado um bloco de CTA Final (#cta-final).');
    } catch (e) {
      errors.push('Erro ao validar formato da estrutura (JSON corrompido).');
    }


    // ===== VALIDAÇÕES DE ENTRADA (Steps) =====

    // 6. Verificar que dados obrigatórios existem (baseado em REQUIRED_FIELDS)
    if (!B.nome_cliente?.trim()) errors.push('Nome do cliente não preenchido (Step 1).');
    if (!B.segmento?.trim()) errors.push('Segmento não preenchido (Step 1).');
    if (!B.whatsapp?.trim()) errors.push('WhatsApp não preenchido (Step 2).');
    if (!B.publico_primario?.trim()) errors.push('Público-alvo não definido (Step 6).');
    if (!B.diferencial?.trim()) warnings.push('Diferenciais não preenchidos (Step 7).');

    const dirArteAprovada = B.arte_ficha_aprovada?.trim();
    if (!dirArteAprovada) {
      warnings.push('Direção de arte não foi aprovada. Recomendado para consistência visual.');
    }

    // ===== VALIDAÇÕES DE API =====
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) {
      errors.push('Nenhuma API Key configurada. Vá em Config. API.');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      warnings: warnings,
      stats: {
        blocos: blocos,
        nomeCliente: B.nome_cliente || '—',
        segmento: B.segmento || '—',
        apiConfigured: hasKey,
      }
    };
  },

  async generateDocImpl() {
    // Verificar alertas primeiro (se não ignorados)
    if (!this.alertasIgnorados) {
      const alertas = this.gerarAlertas ? this.gerarAlertas() : [];
      if (alertas.length > 0) {
        if (this.mostrarAlertas) {
          this.mostrarAlertas();
        }
        return;
      }
    }

    // Validar estrutura
    const validation = this.validateStructure();

    if (!validation.valid) {
      // Mostrar primeiro erro
      this.showToast(`❌ ${validation.errors[0]}`, 'error');
      return;
    }

    // Avisar sobre warnings (se houver)
    if (validation.warnings.length > 0) {
      console.warn('[AIGator] Warnings de validação:', validation.warnings);
    }

    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) { this.showToast('Configure uma API Key primeiro.', 'warning'); return; }
    if (!this.P) { this.showToast('Nenhum projeto ativo.', 'warning'); return; }

    this.state.isGenerating = true;

    const slug = (this.B.slug || this.B.nome_cliente?.toLowerCase().replace(/\s+/g, '-') || 'projeto')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '');

    this.openAILog('Gerando Ficha de Implementação (DOC-IMPL)', [
      { id: 1, icon: 'file-text', label: 'Iniciando geração (30-60s)...' },
      { id: 2, icon: 'layout', label: 'PARTE 1: Config + Estrutura (30-60s)...' },
      { id: 3, icon: 'box', label: 'PARTE 2: Layout + Componentes (20-40s)...' },
      { id: 4, icon: 'grid', label: 'PARTE 3: Seções da LP (40-60s)...' },
      { id: 5, icon: 'zap', label: 'PARTE 4: Deploy + Integrações (15-30s)...' },
      { id: 6, icon: 'check-circle', label: 'Finalizando e salvando (10-20s)...' },
    ]);

    // Toast informativo
    this.showToast('⏳ Gerando 4 partes (pode levar 2-5 minutos). Não feche esta aba!', 'info');

    try {
      // ===== INICIO =====
      this.aiLogStep(1);
      this.aiLogMessage('Lendo briefing e preparando prompts...');
      await this.aiLogDelay(400);

      // ===== PARTE 1 =====
      this.aiLogStep(2);
      this.aiLogMessage('Solicitando PARTE 1 (Fundação)...');
      const startP1 = Date.now();

      const restricoesPrompt = this.buildRestricoesPrompt(this.B?.restricoes);
      const systemPromptBase = this.buildBlindedSystemPrompt(this.B, 'copy_completa');

      const parte1 = await this.callAI({
        systemPrompt: systemPromptBase + '\n\n' + restricoesPrompt,
        userPrompt: this.buildImplPromptParte1()
      });

      // Validar PARTE 1
      const val1 = this.validateBlindedOutput(parte1);
      if (!val1.valido) {
        this.aiLogMessage('⚠️ Parte 1 com avisos de blindagem...');
        console.warn('Parte 1 falhou na blindagem:', val1.erros);
      }

      const durP1 = Math.round((Date.now() - startP1) / 1000);
      this.aiLogMessage(`✓ PARTE 1 pronta em ${durP1}s`);
      await this.aiLogDelay(300);

      // ===== PARTE 2 =====
      this.aiLogStep(3);
      this.aiLogMessage('Solicitando PARTE 2 (Componentes)...');
      const startP2 = Date.now();
      const parte2 = await this.callAI({
        systemPrompt: systemPromptBase + '\n\n' + restricoesPrompt,
        userPrompt: this.buildImplPromptParte2()
      });

      // Validar PARTE 2
      const val2 = this.validateBlindedOutput(parte2);
      if (!val2.valido) {
        this.aiLogMessage('⚠️ Parte 2 com avisos de blindagem...');
      }

      const durP2 = Math.round((Date.now() - startP2) / 1000);
      this.aiLogMessage(`✓ PARTE 2 pronta em ${durP2}s`);
      await this.aiLogDelay(300);

      // ===== PARTE 3 =====
      this.aiLogStep(4);
      this.aiLogMessage('Solicitando PARTE 3 (Seções)...');
      const startP3 = Date.now();
      const parte3 = await this.callAI({
        systemPrompt: systemPromptBase + '\n\n' + restricoesPrompt,
        userPrompt: this.buildImplPromptParte3()
      });

      // Validar PARTE 3
      const val3 = this.validateBlindedOutput(parte3);
      if (!val3.valido) {
        this.aiLogMessage('⚠️ Parte 3 com avisos de blindagem...');
      }

      const durP3 = Math.round((Date.now() - startP3) / 1000);
      this.aiLogMessage(`✓ PARTE 3 pronta em ${durP3}s`);
      await this.aiLogDelay(300);

      // ===== PARTE 4 =====
      this.aiLogStep(5);
      this.aiLogMessage('Solicitando PARTE 4 (Deploy)...');
      const startP4 = Date.now();
      const parte4 = await this.callAI({
        systemPrompt: systemPromptBase + '\n\n' + restricoesPrompt,
        userPrompt: this.buildImplPromptParte4()
      });

      // Validar PARTE 4
      const val4 = this.validateBlindedOutput(parte4);
      if (!val4.valido) {
        this.aiLogMessage('⚠️ Parte 4 com avisos de blindagem...');
      }

      const durP4 = Math.round((Date.now() - startP4) / 1000);
      this.aiLogMessage(`✓ PARTE 4 pronta em ${durP4}s`);

      const totalDur = durP1 + durP2 + durP3 + durP4;
      this.aiLogMessage(`⏱️ Tempo total de IA: ${totalDur}s`);
      await this.aiLogDelay(300);

      // ===== SALVAR E DOWNLOAD =====
      this.aiLogStep(6);
      this.aiLogMessage('Formatando e baixando arquivos...');

      // Processamento de Configurações & Limpeza
      const { clinerules, gitignore, rooignore, parte1Clean } = this.formatarDocImpl(parte1);

      // Salvar as 4 partes
      this.setField('doc_impl_parte1', parte1Clean);
      this.setField('doc_impl_parte2', parte2);
      this.setField('doc_impl_parte3', parte3);
      this.setField('doc_impl_parte4', parte4);

      // Download
      this.downloadText(clinerules, '.clinerules', 'text/plain');
      await this.aiLogDelay(200);
      this.downloadText(gitignore, '.gitignore', 'text/plain');
      await this.aiLogDelay(200);
      this.downloadText(rooignore, '.rooignore', 'text/plain');
      await this.aiLogDelay(400);

      this.downloadText(parte1Clean, `doc-impl-${slug}-parte1-fundacao.md`, 'text/markdown');
      await this.aiLogDelay(400);
      this.downloadText(parte2, `doc-impl-${slug}-parte2-componentes.md`, 'text/markdown');
      await this.aiLogDelay(400);
      this.downloadText(parte3, `doc-impl-${slug}-parte3-secoes.md`, 'text/markdown');
      await this.aiLogDelay(400);
      this.downloadText(parte4, `doc-impl-${slug}-parte4-pagina.md`, 'text/markdown');

      this.aiLogMessage('✓ Todos os arquivos baixados.');
      await this.aiLogDelay(400);

      this.aiLogDone();
      this.state.isGenerating = false;
      this.showNotification('AIGator', 'DOC-IMPL gerado com sucesso!');

      // Se houve muitos erros de validação, avisar o usuário
      const totalErros = val1.erros.length + val2.erros.length + val3.erros.length + val4.erros.length;
      if (totalErros > 0) {
        setTimeout(() => {
          this.mostrarModalValidacao({
            titulo: '⚠️ Alertas na Geração',
            erros: [...val1.erros, ...val2.erros, ...val3.erros, ...val4.erros],
            avisos: [...val1.avisos, ...val2.avisos, ...val3.avisos, ...val4.avisos],
            acoes: [
              { label: 'Entendido', primary: true, onclick: () => { } }
            ]
          });
        }, 800);
      }

      setTimeout(() => {
        this.closeAILog();
        this.showToast(`✓ DOC-IMPL pronto em ${totalDur}s! Implemente na ordem: P1 → P2 → P3 → P4`, 'success', 8000);
        this.renderScreen();
      }, 600);

    } catch (err) {
      console.error('[AIGator] Erro na geração:', err);
      const errorMsg = err.message || 'Erro desconhecido';
      this.aiLogError(null, errorMsg);
      this.state.isGenerating = false;

      setTimeout(() => {
        this.closeModal('modal-gen');
        this.showToast('Falha na geração. Verifique sua API Key e tente novamente.', 'error', 7000);

        // Mostrar modal de erro com opções e dicas
        this.openModal('modal-error');
        document.getElementById('error-meta').textContent = `Falha durante a geração do DOC-IMPL`;
        document.getElementById('error-message').textContent = errorMsg;
        document.getElementById('error-cause').innerHTML = `
          <strong>O que fazer:</strong>
          <ul style="margin-top: 0.5rem; padding-left: 1.5rem; font-size: 13px; line-height: 1.5;">
            <li>Verificar se a API Key está correta e tem saldo/quota</li>
            <li>Tentar novamente com um modelo diferente (ex: Gemini Flash)</li>
            <li>Verificar conexão com internet</li>
            <li>Se persistir, baixe o <strong>DOC-1</strong> e use em uma IA externa (Claude/Gemini)</li>
          </ul>
        `;
      }, 1200);
    } finally {
      this.state.isGenerating = false;
    }
  },

  /* ----------------------------------------------------------
     Prompts de Implementação — 4 Partes Separadas
     Cada parte gera 1 arquivo .md independente para download.
     O Roo implementa na ordem: Parte 1 → 2 → 3 → 4.
  ---------------------------------------------------------- */

  buildImplPromptParte1() {
    const B = this.B || {};
    const estruturaRaw = B.estrutura_aprovada || B.estrutura_lp || '';
    // Tenta formatar se for JSON para facilitar leitura da IA
    let estruturaAprovada = estruturaRaw;
    try {
      const parsed = typeof estruturaRaw === 'string' ? JSON.parse(estruturaRaw) : estruturaRaw;
      estruturaAprovada = JSON.stringify(parsed, null, 2);
    } catch (e) { }

    return `
Você é um Full-Stack Developer Senior especializado em Astro + Tailwind CSS.

## CONTEXTO

Você está recebendo a Estrutura da Landing Page aprovada para implementação.
Esta é a PARTE 1 de 4 — você está gerando arquivos de configuração e estrutura.

---

## ESTRUTURA APROVADA

${estruturaAprovada}

---

## TAREFA — GERAR 4 ARQUIVOS

Você vai gerar exatamente os 4 arquivos abaixo. Responda APENAS com esses 4 arquivos, nada mais.

---

## ARQUIVO 1: \`.clinerules\`

Este arquivo contém as regras de desenvolvimento que devem ser seguidas em toda a implementação.

\`\`\`clinerules
# ============================================================
# .clinerules — LandingAI Project Rules
# ============================================================
# Versão: 1.0
# Última atualização: 2026-05-07
# ============================================================

## 1. ESTRUTURA DE PASTAS — OBRIGATÓRIA

src/
├── layouts/
│   └── Layout.astro           # Layout base (header, footer, scripts globais)
├── components/
│   ├── sections/              # Seções da LP (Hero, Features, Pricing, etc)
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── Pricing.astro
│   │   ├── Testimonials.astro
│   │   ├── FAQ.astro
│   │   ├── CTA.astro
│   │   └── [outros blocos conforme estrutura]
│   └── ui/                    # Componentes reutilizáveis
│       ├── Button.astro
│       ├── Card.astro
│       ├── Modal.astro
│       └── [outros]
├── pages/
│   └── index.astro            # Homepage (importa Layout + sections)
├── styles/
│   ├── globals.css            # Reset + variables CSS
│   ├── animations.css         # GSAP animations
│   └── components.css         # Estilos dos componentes
└── scripts/
    ├── gsap.ts               # GSAP + ScrollTrigger setup
    ├── animations.ts         # Funções de animação
    └── utils.ts              # Helpers

public/
├── fonts/                     # Web fonts
├── images/                    # Imagens estáticas
└── videos/                    # Videos (se houver)

## 2. ARQUIVOS PROTEGIDOS — NÃO ALTERAR

- tsconfig.json               # Não mudar compilação TypeScript
- package.json                # Não adicionar dependências não autorizadas
- astro.config.mjs           # Config do Astro — apenas ajustes de env vars se necessário
- public/               # Apenas adicionar assets, não remover existentes
- .env.example          # Exemplo de variáveis — não alterar nomes

## 3. IMPORTS OBRIGATÓRIOS EM ASTRO

Toda seção deve seguir este padrão:

\`\`\`astro
---
// src/components/sections/Hero.astro
import Layout from '../../layouts/Layout.astro';
import Button from '../ui/Button.astro';

interface Props {
  title: string;
  subtitle: string;
  cta_text: string;
  image?: string;
}

const { title, subtitle, cta_text, image } = Astro.props;
---

<section class="hero">
  <div class="hero-content">
    <h1>{title}</h1>
    <p>{subtitle}</p>
    <Button text={cta_text} href="#contato" />
  </div>
  {image && <img src={image} alt="Hero" />}
</section>

<style>
  .hero {
    /* estilos aqui */
  }
</style>
\`\`\`

## 4. VARIÁVEIS CSS GLOBAIS — OBRIGATÓRIAS

Em \`src/styles/globals.css\`, definir:

\`\`\`css
:root {
  /* Cores */
  --color-primary: #00e5a0;
  --color-secondary: #a78bfa;
  --color-accent: #f59e0b;
  --color-bg: #0f172a;
  --color-bg-light: #1e293b;
  --color-text: #f1f5f9;
  --color-text-dim: #94a3b8;
  --color-border: #334155;

  /* Tipografia */
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', monospace;
  --font-serif: 'Syne', serif;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 4rem;

  /* Breakpoints */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}
\`\`\`

## 5. GSAP + ANIMAÇÕES

- Importar GSAP em \`src/scripts/gsap.ts\`
- Usar \`gsap.registerPlugin(ScrollTrigger)\`
- NUNCA importar inline — sempre centralizar em \`gsap.ts\`
- ScrollTrigger debe ser usado para scroll-triggered animations

## 6. TAILWIND CSS — OBRIGATÓRIO

- Usar Tailwind core utilities (ex: \`flex, gap-4, text-xl\`)
- NÃO usar \`@apply\` — usar classes direto no HTML
- Breakpoints: \`sm:, md:, lg:, xl:\`
- Dark mode: prefixar com \`dark:\`
- Exemplo: \`<div class="flex gap-4 md:gap-8 dark:bg-slate-800">\`

## 7. PERFORMANCE — OBRIGATÓRIO

- Usar \`<Image />\` do Astro para imagens (lazy loading automático)
- Comprimir imagens antes de commitar (ImageOptim, TinyPNG)
- Remover CSS não utilizado
- Usar code-splitting: componentes dinâmicos com \`client:lazy\`
- PageSpeed Insights alvo: > 90

## 8. ACESSIBILIDADE — OBRIGATÓRIO

- Semântica HTML: \`<header>, <main>, <section>, <footer>\`
- \`alt\` em todas as imagens
- \`aria-labels\` em botões sem texto
- Contraste de cores: mínimo AA (WCAG)
- Teste com screen readers (NVDA, JAWS)

## 9. SEO — OBRIGATÓRIO

- \`<title>\` e \`<meta description>\` em cada página
- \`<meta og:*>\` para redes sociais
- \`<meta robots>\` para indexação
- Estrutura de headings: 1 H1 por página
${estruturaAprovada}

---

## REGRAS GERAIS DE IMPLEMENTAÇÃO

Você DEVE seguir estas diretrizes em TODAS as partes:

1. **Stack**: Astro 4.x, Tailwind CSS, GSAP (animações).
2. **Design**: Moderno, premium, dark mode por padrão.
3. **Responsividade**: Mobile-first obrigatório.
4. **Sem placeholders**: Código 100% funcional.
5. **Acessibilidade**: ARIA labels, contraste adequado, semântica HTML.

---

## O QUE GERAR NESTA PARTE 1

### Arquivo 1: \`.clinerules\`

Regras de arquitetura para o Roo (AI):
- [ ] Definir estrutura de pastas: \`src/layouts/\`, \`src/components/ui/\`, \`src/components/sections/\`, \`src/styles/\`, \`src/scripts/\`.
- [ ] Regras de nomenclatura: PascalCase para componentes, kebab-case para assets.
- [ ] Proibir o uso de \`px\` (usar \`rem\`).
- [ ] Exigir GSAP para todas as animações de scroll.
- [ ] Obrigar o uso de variáveis CSS para o design system.

### Arquivo 2: \`.gitignore\`

Padrão para projetos Astro/Node:
- [ ] \`node_modules/\`, \`dist/\`, \`.astro/\`, \`.env\`, \`.DS_Store\`.

### Arquivo 3: \`.rooignore\`

- [ ] \`node_modules/\`, \`dist/\`, \`.git/\`.

---

## RESPONDA COM

Apenas os 3 arquivos acima. Nada mais. Sem explicação.
`.trim();
  },

  buildImplPromptParte2() {
    const B = this.B || {};
    const estruturaRaw = B.estrutura_aprovada || B.estrutura_lp || '';
    let estruturaAprovada = estruturaRaw;
    try {
      const parsed = typeof estruturaRaw === 'string' ? JSON.parse(estruturaRaw) : estruturaRaw;
      estruturaAprovada = JSON.stringify(parsed, null, 2);
    } catch (e) { }

    return `
Você é um Full-Stack Developer Senior especializado em Astro + Tailwind CSS.

## CONTEXTO

Esta é a PARTE 2 de 4 — você está gerando o Layout Base e componentes de UI reutilizáveis.

VOCÊ JÁ TEM:
- PARTE 1 foi gerada com .clinerules, .gitignore, .rooignore
- Estrutura de pastas definida em PARTE 1

SUA TAREFA AGORA:
Gerar Layout base e componentes UI que serão usados pelas seções (PARTE 3).

---

## ESTRUTURA APROVADA (REFERÊNCIA)

${estruturaAprovada}

---

## REGRA DE CONSISTÊNCIA — CRÍTICA

Você DEVE importar exatamente estas estruturas definidas na PARTE 1:

✓ Pasta \`src/layouts/\` contém \`Layout.astro\`
✓ Pasta \`src/components/ui/\` contém componentes reutilizáveis
✓ Pasta \`src/components/sections/\` será usada na PARTE 3
✓ Pasta \`src/pages/\` contém \`index.astro\` que vai importar sections
✓ Pasta \`src/styles/\` contém globals.css, animations.css, components.css
✓ Pasta \`src/scripts/\` contém gsap.ts, animations.ts, utils.ts

---

## O QUE GERAR

### Arquivo 1: src/layouts/Layout.astro

Layout base que:
- [ ] Importa Layout como componente Astro
- [ ] Contém \`<header>\`, \`<main>\`, \`<footer>\`
- [ ] Define variáveis CSS globais (:root)
- [ ] Importa fontes do Google (DM Sans, DM Mono, Syne)
- [ ] Importa estilos globais
- [ ] Renderiza \`<slot />\` no main
- [ ] Inclui scripts de GSAP e analytics

Exemplo estrutura:

\`\`\`astro
---
// src/layouts/Layout.astro
import Header from '../components/ui/Header.astro';
import Footer from '../components/ui/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content={description}>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@400;500&family=Syne:wght@400..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles/globals.css">
</head>
<body>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
  <script src="/scripts/gsap.ts"></script>
</body>
</html>

<style>
  /* Estilos globais */
</style>
\`\`\`

### Arquivo 2: src/components/ui/Button.astro

Botão reutilizável que:
- [ ] Aceita props: text, href, variant (primary/secondary), size (sm/md/lg)
- [ ] Usa classes Tailwind CSS
- [ ] Suporta <a> e <button>
- [ ] Acessível (aria-labels, focus states)

\`\`\`astro
---
// src/components/ui/Button.astro
interface Props {
  text: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const { text, href, variant = 'primary', size = 'md', class: className } = Astro.props;

const baseClass = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200';
const variants = {
  primary: 'bg-emerald-500 text-white hover:bg-emerald-600',
  secondary: 'bg-slate-700 text-white hover:bg-slate-800',
  ghost: 'bg-transparent text-white border border-slate-600 hover:border-slate-400',
};
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

const classes = \`\${baseClass} \${variants[variant]} \${sizes[size]} \${className || ''}\`;
---

{href ? (
  <a href={href} class={classes}>{text}</a>
) : (
  <button class={classes}>{text}</button>
)}
\`\`\`

### Arquivo 3: src/components/ui/Card.astro

Card reutilizável:
- [ ] Aceita props: title, description, image, icon, cta
- [ ] Flexível para seções, testimonials, pricing, etc
- [ ] Responsive design

### Arquivo 4: src/components/ui/Header.astro

Header/Nav que:
- [ ] Logo + navegação + CTA
- [ ] Sticky no topo
- [ ] Menu mobile responsivo
- [ ] Links internos para cada seção

### Arquivo 5: src/components/ui/Footer.astro

Footer que:
- [ ] Links de navegação
- [ ] Social links
- [ ] Copyright
- [ ] Newsletter signup (opcional)

### Arquivo 6: src/styles/globals.css

CSS global que:
- [ ] Define \`:root\` com variáveis CSS
- [ ] Reset CSS padrão
- [ ] Tipografia base
- [ ] Dark mode padrão

### Arquivo 7: src/styles/components.css

Estilos dos componentes UI:
- [ ] .button, .card, .header, .footer
- [ ] Estados hover, active, focus
- [ ] Responsive design

### Arquivo 8: src/scripts/gsap.ts

Setup GSAP que:
- [ ] Importa GSAP e ScrollTrigger
- [ ] Registra o plugin
- [ ] Define easing defaults
- [ ] Pronto para ser usado nas seções

---

## CHECKLIST — Antes de responder

Quando gerar estes arquivos:

1. [ ] Cada arquivo tem \`.astro\` ou \`.ts\` ou \`.css\` correto
2. [ ] Imports estão corretos (paths relativos funcionam)
3. [ ] Nomes de componentes são PascalCase (Button, Card, Header)
4. [ ] Classes Tailwind CSS usadas (não inline styles)
5. [ ] Props bem definidas (interfaces TypeScript)
6. [ ] Sem código duplicado
7. [ ] Pronto para PARTE 3 importar estes componentes

---

## RESPONDA COM

Por favor, responda com APENAS os 8 arquivos acima:

- src/layouts/Layout.astro
- src/components/ui/Button.astro
- src/components/ui/Card.astro
- src/components/ui/Header.astro
- src/components/ui/Footer.astro
- src/styles/globals.css
- src/styles/components.css
- src/scripts/gsap.ts

Cada arquivo deve ser completo e pronto para usar.
Nada de placeholders ou TODO.
`.trim();
  },

  buildImplPromptParte3() {
    const B = this.B || {};
    const estruturaRaw = B.estrutura_aprovada || B.estrutura_lp || '';
    let estruturaAprovada = estruturaRaw;
    try {
      const parsed = typeof estruturaRaw === 'string' ? JSON.parse(estruturaRaw) : estruturaRaw;
      estruturaAprovada = JSON.stringify(parsed, null, 2);
    } catch (e) { }

    return `
Você é um Frontend Developer Senior especializado em Astro + Tailwind CSS + GSAP.

## CONTEXTO

Esta é a PARTE 3 de 4 — você está gerando as SEÇÕES da landing page.

VOCÊ JÁ TEM:
- PARTE 1: Config + estrutura de pastas + .clinerules
- PARTE 2: Layout base + componentes UI (Button, Card, Header, Footer)

AGORA:
Você vai gerar as seções específicas da landing page baseado na estrutura aprovada.

---

## ESTRUTURA APROVADA

${estruturaAprovada}

---

## REGRA DE CONSISTÊNCIA — CRÍTICA

Você DEVE:

1. [ ] Importar \`Layout\` de \`../../layouts/Layout.astro\`
2. [ ] Importar componentes UI de \`../ui/\` (Button, Card, etc)
3. [ ] Usar APENAS classes Tailwind CSS (não inline styles)
4. [ ] Importar GSAP animations de \`../../scripts/animations.ts\`
5. [ ] Cada seção é um componente .astro independente
6. [ ] Props bem tipadas (interface Props)
7. [ ] ScrollTrigger para animations ao scroll

---

## LISTA DE SEÇÕES A GERAR

Baseado na estrutura aprovada acima, gere EXATAMENTE:

1. **Hero** — Impacto inicial (SEMPRE primeira seção não-header)
   - Título (H1)
   - Subtítulo
   - CTA primário
   - Background image/video (opcional)

2. **[Seções da Estrutura]** — Conforme blocos 3-N da estrutura aprovada
   - Cada bloco = 1 seção
   - Nome do arquivo: PascalCase (Hero.astro, Features.astro, Pricing.astro, etc)
   - Cada seção é independente e reutilizável

3. **CTA Final** — Chamada à ação antes do footer (SEMPRE antes do footer)
   - Texto
   - Botão principal
   - Fundo com contraste

---

## ESTRUTURA DE CADA SEÇÃO

Todas devem seguir este padrão:

\`\`\`astro
---
// src/components/sections/[Nome].astro
import Button from '../ui/Button.astro';

interface Props {
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_href?: string;
  image?: string;
  variant?: 'light' | 'dark';
}

const { 
  title, 
  subtitle, 
  cta_text, 
  cta_href = '#contato',
  image,
  variant = 'dark'
} = Astro.props;
---

<section class="py-20 bg-slate-900 text-white overflow-hidden">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row items-center gap-12">
      <div class="flex-1 section-content opacity-0 translate-y-10">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
        {subtitle && <p class="text-xl text-slate-400 mb-8">{subtitle}</p>}
        {cta_text && <Button text={cta_text} href={cta_href} variant="primary" size="lg" />}
      </div>
      {image && (
        <div class="flex-1 opacity-0 translate-x-10 section-image">
          <img src={image} alt={title} class="rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  </div>
</section>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  // Animação ao entrar na viewport
  gsap.to('.section-content', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.section-content',
      start: 'top 80%',
    }
  });
</script>
\`\`\`

---

## RESPONSIVIDADE — OBRIGATÓRIA

Cada seção deve:
- [ ] Funcionar em 375px (mobile)
- [ ] Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- [ ] Typography scales: title maior em desktop, menor em mobile
- [ ] Grid/flex muda conforme breakpoint

---

## RESPONDA COM

Gere TODAS as seções baseado na estrutura aprovada:

1. src/components/sections/Hero.astro
2. src/components/sections/[Bloco2].astro
3. src/components/sections/[Bloco3].astro
4. ... (conforme estrutura)
5. src/components/sections/CTA.astro

Cada arquivo completo, sem placeholders.
`.trim();
  },

  buildImplPromptParte4() {
    const B = this.B || {};
    const stack = B.tech_stack || 'Astro, Tailwind CSS, GSAP, Vercel';

    return `
Você é um Full-Stack Developer Senior especializado em Astro + Deploy.

## CONTEXTO

Esta é a PARTE 4 de 4 — FINAL — você está gerando:
1. Integração da homepage (index.astro)
2. Configurações finais
3. Deploy setup

VOCÊ JÁ TEM:
- PARTE 1: Config + pastas + .clinerules
- PARTE 2: Layout + componentes UI
- PARTE 3: Todas as seções (Hero, Features, Pricing, etc)

AGORA:
Você vai gerar a homepage que importa TUDO e define o setup final.

---

## STACK CONFIRMADO

${stack}

---

## REGRA DE CONSISTÊNCIA — CRÍTICA

Você DEVE:

1. [ ] Importar \`Layout\` de \`../layouts/Layout.astro\`
2. [ ] Importar TODAS as seções de \`../components/sections/\`
3. [ ] Ordem das seções: Header → Hero → [seções] → CTA → Footer
4. [ ] Props passadas para cada seção com dados reais
5. [ ] Nenhuma seção pode quebrar imports
6. [ ] astro.config.mjs bate com PARTE 1

---

## O QUE GERAR

### Arquivo 1: src/pages/index.astro

Homepage principal que:
- [ ] Importa Layout de layouts/
- [ ] Importa TODAS as seções de components/sections/
- [ ] Renderiza em ordem: Header → Hero → seções → CTA → Footer
- [ ] Props são passadas corretamente
- [ ] Sem erros de import

Exemplo estrutura:

\`\`\`astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Hero from '../components/sections/Hero.astro';
import Features from '../components/sections/Features.astro';
import Pricing from '../components/sections/Pricing.astro';
import CTA from '../components/sections/CTA.astro';

const pageTitle = 'Landing Page - Astro';
const pageDescription = 'Descrição da página';
---

<Layout title={pageTitle} description={pageDescription}>
  <Hero 
    title="Título principal"
    subtitle="Subtítulo explicativo"
    cta_text="Começar agora"
    cta_href="#contato"
    image="/images/hero.jpg"
  />
  
  <Features 
    title="Nossos diferenciais"
    items={[
      { icon: 'zap', text: 'Diferencial 1' },
      { icon: 'shield', text: 'Diferencial 2' },
      { icon: 'star', text: 'Diferencial 3' },
    ]}
  />
  
  <Pricing 
    title="Nossos planos"
    plans={[
      { name: 'Básico', price: '99', features: [...] },
      { name: 'Pro', price: '199', features: [...] },
      { name: 'Premium', price: '299', features: [...] },
    ]}
  />
  
  <CTA 
    title="Pronto para começar?"
    subtitle="Junte-se a centenas de clientes satisfeitos"
    cta_text="Agendar demo"
    cta_href="#contato"
  />
</Layout>
\`\`\`

### Arquivo 2: astro.config.mjs

Configuração Astro que:
- [ ] Output: 'hybrid' para SSR
- [ ] Integrations: Tailwind, React (se necessário)
- [ ] Deploy target: Vercel
- [ ] compressHTML: true
- [ ] Sem erros de sintaxe

\`\`\`javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'hybrid',
  integrations: [
    tailwind(),
  ],
  vite: {
    ssr: {
      external: ['gsap']
    }
  },
  compressHTML: true,
  image: {
    domains: ['images.unsplash.com'],
  },
});
\`\`\`

### Arquivo 3: package.json

Package.json que:
- [ ] Scripts: dev, build, preview
- [ ] Dependências: astro, @astrojs/tailwind, gsap, etc
- [ ] DevDependencies: typescript, tailwindcss, etc
- [ ] Node version: >=18

\`\`\`json
{
  "name": "landing-page",
  "version": "1.0.0",
  "description": "Landing page gerada com Astro",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/tailwind": "^0.4.0",
    "gsap": "^3.12.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
\`\`\`

### Arquivo 4: tsconfig.json

TypeScript config que:
- [ ] Target: ES2020
- [ ] Strict mode: true
- [ ] Paths configurados

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
\`\`\`

### Arquivo 5: public/.gitkeep

Arquivo vazio para manter a pasta public no git.

### Arquivo 6: README.md

Documentação que:
- [ ] Instruções de instalação
- [ ] Como rodar dev
- [ ] Como fazer build
- [ ] Deploy instructions
- [ ] Estrutura de pastas
- [ ] Stack usado

---

## VERIFICAÇÃO FINAL

Antes de responder, garantir:

1. [ ] Arquivo index.astro importa TODAS as seções de PARTE 3
2. [ ] Nenhum import quebrado
3. [ ] astro.config.mjs está correto
4. [ ] package.json lista todas as dependências
5. [ ] tsconfig.json está configurado
6. [ ] Build passaria sem erros: \`npm run build\`
7. [ ] Dev server rodaria: \`npm run dev\`

---

## RESPONDA COM

Apenas os 6 arquivos:

1. src/pages/index.astro (completo, com todas as seções)
2. astro.config.mjs (configuração final)
3. package.json (com todas as deps)
4. tsconfig.json (config TypeScript)
5. public/.gitkeep
6. README.md (documentação completa)

Sem placeholders, pronto para npm install + npm run dev.

`.trim();
  },

  /* ----------------------------------------------------------
     Downloads
  ---------------------------------------------------------- */


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
    this.renderScreen(true);
  },

  addArtRef(type) {
    const field = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    const arr = [...(this.B[field] || [])];
    arr.push({ url: '', nota: '' });
    this.setField(field, arr);
    this.renderScreen(true);
  },

  removeArtRef(type, index) {
    const field = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    const arr = [...(this.B[field] || [])];
    arr.splice(index, 1);
    this.setField(field, arr);
    this.renderScreen(true);
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

  aiLogMessage(msg) {
    const log = document.getElementById('ai-log-messages');
    if (!log) return;

    const msgEl = document.createElement('div');
    msgEl.className = 'ai-log-msg ai-log-msg--info';
    msgEl.innerHTML = `
      <span class="msg-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      <span class="msg-text">${msg}</span>
    `;

    log.appendChild(msgEl);
    log.parentElement?.scrollTo({ top: log.parentElement.scrollHeight, behavior: 'smooth' });
  },

  robustParseJSON(jsonString) {
    // Primeira tentativa: parsear diretamente
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      // Ignorar, tentar abordagens mais robustas
    }

    // Tenta extrair de bloco de código markdown
    const markdownMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      try {
        return JSON.parse(markdownMatch[1]);
      } catch (e2) {
        // Ignorar, tentar a próxima abordagem
      }
    }

    // Função para reparar JSON truncado
    const fixTruncatedJSON = (str) => {
      let inString = false;
      let escape = false;
      let stack = [];
      for (let i = 0; i < str.length; i++) {
        let c = str[i];
        if (escape) { escape = false; continue; }
        if (c === '\\') { escape = true; continue; }
        if (c === '"') { inString = !inString; continue; }
        if (!inString) {
          if (c === '{' || c === '[') stack.push(c);
          else if (c === '}') {
            if (stack[stack.length - 1] === '{') stack.pop();
          } else if (c === ']') {
            if (stack[stack.length - 1] === '[') stack.pop();
          }
        }
      }
      let fixed = str;
      if (inString) fixed += '"';
      while (stack.length > 0) {
        let c = stack.pop();
        if (c === '{') fixed += '}';
        else if (c === '[') fixed += ']';
      }
      return fixed;
    };

    // Extrair apenas a parte que parece ser JSON
    const jsonMatch = jsonString.match(/\{[\s\S]*/);
    let cleanedString = jsonMatch ? jsonMatch[0] : jsonString;

    // Tenta remover comentários
    cleanedString = cleanedString.replace(/\/\/[^\n\r]*/g, '');
    cleanedString = cleanedString.replace(/\/\*[\s\S]*?\*\//g, '');

    // Aplica o fix de truncamento
    let fixedString = fixTruncatedJSON(cleanedString);

    // Tenta remover trailing commas (vírgulas antes de chaves ou colchetes)
    fixedString = fixedString.replace(/,(\s*[}\]])/g, '$1');

    try {
      return JSON.parse(fixedString);
    } catch (e3) {
      // Fallback final: tenta a string limpa original caso o fix tenha quebrado algo
    }

    try {
      return JSON.parse(cleanedString);
    } catch (e4) {
      throw new Error('Não foi possível parsear JSON. Formato inválido. Conteúdo: ' + jsonString.substring(0, 500) + '...');
    }
  },

  /* ----------------------------------------------------------
     Handlers para Estrutura e Copy
  ---------------------------------------------------------- */
  abrirModalImportarOutput() {
    this.openModal('modal-importar-output');
    setTimeout(() => document.getElementById('textarea-output-ia')?.focus(), 100);
  },

  confirmarImportarOutput() {
    const texto = document.getElementById('textarea-output-ia')?.value || '';
    const ok = this.processarOutputColado(texto);
    if (ok) {
      this.closeModal('modal-importar-output');
      document.getElementById('textarea-output-ia').value = '';
      this.renderScreen();
    }
  }
});

