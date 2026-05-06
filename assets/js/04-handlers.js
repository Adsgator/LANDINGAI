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

    // ── Importar projeto (input file no modal de projetos) ────
    const importInput = document.getElementById('import-file-input');
    if (importInput) {
      importInput.addEventListener('change', () => this.importProject(importInput));
    }

    // ── Sidebar API button ────────────────────────────────────
    document.getElementById('btn-open-api')?.addEventListener('click', () => {
      this.renderApiModal();
      this.openModal('modal-api');
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
    const text = this.B?.briefing_bruto;
    if (!text || text.length < 50) {
      this.showToast('Cole um material mais longo para análise (mínimo 50 caracteres).', 'warning');
      return;
    }

    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) {
      this.showToast('Configure uma API Key primeiro.', 'warning');
      return;
    }

    this.openAILog('Analisando Material Bruto', [
      { id: 1, label: 'Lendo material...' },
      { id: 2, label: 'Extraindo dados do projeto...' },
      { id: 3, label: 'Preenchendo informações...' },
      { id: 4, label: 'Salvando no briefing...' },
    ]);

    try {
      this.aiLogStep(1, 'Processando texto...');
      await this.aiLogDelay(200);

      this.aiLogStep(2, 'Enviando para a IA...');

      const prompt = `Você é um specialist em briefing de landing pages da agência Adsgator.
Analise o material bruto abaixo e extraia o máximo de informações.

MATERIAL DO CLIENTE:
${text}

Responda APENAS com um objeto JSON válido (sem markdown, sem explicações, sem \`\`\`json), com os seguintes campos (use string vazia "" para campos desconhecidos):

{
  "nome_cliente": "nome do profissional/responsável",
  "nome_marca": "nome comercial/marca se diferente",
  "segmento": "segmento específico do negócio (não genérico)",
  "tipo": "servico|mentoria|consultoria|produto|saas",
  "whatsapp": "apenas dígitos com DDI ex: 5511999999999",
  "email": "email de contato",
  "horarios": "dias e horários de atendimento",
  "objetivo_conversao": "whatsapp|formulario|ligacao|email",
  "instagram": "@usuario",
  "youtube": "link do canal",
  "google_business": "sim|nao",
  "google_nota": "nota ex: 4.8",
  "google_qtd": "número de avaliações",
  "modalidade": "presencial|online|hibrido",
  "endereco": "endereço completo se presencial",
  "cidades_atendimento": "cidades ou regiões",
  "servico_principal": "serviço principal foco da campanha",
  "servicos_lista": "lista de serviços um por linha",
  "servicos_descricao": "como funciona o serviço",
  "preco_exibir": "sim|nao",
  "preco_valor": "valor e forma de cobrança",
  "publico_primario": "perfil detalhado do cliente ideal",
  "publico_dor": "dor principal na voz do cliente",
  "publico_resultado": "resultado desejado após contratar",
  "diferencial": "o que diferencia concretamente",
  "frase_impacto": "frase que captura o que faz",
  "historia": "por que faz o que faz",
  "casos_resultados": "números e resultados concretos",
  "depoimentos": "sim|nao",
  "estilo_desejado": "como o site deve ser percebido",
  "sensacao_visitante": "emoção desejada ao navegar",
  "restricoes": "o que NÃO quer de forma alguma",
  "dominio": "domínio do site",
  "gtm_id": "ID do GTM ex: GTM-XXXXXXX"
}`;

      const res = await this.callAI(prompt);

      this.aiLogStep(3, 'Processando resposta...');

      // Parse robusto: tenta JSON direto, depois com limpeza, depois extração via regex
      let data = null;
      const cleanRes = res.replace(/```json|```/g, '').trim();

      try {
        data = JSON.parse(cleanRes);
      } catch (e1) {
        // Tentar encontrar o JSON dentro da resposta
        const match = cleanRes.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            data = JSON.parse(match[0]);
          } catch (e2) {
            throw new Error('A IA não retornou um JSON válido. Tente novamente ou use um modelo diferente.');
          }
        } else {
          throw new Error('Não foi possível extrair dados da resposta da IA.');
        }
      }

      this.aiLogStep(4, 'Salvando...');

      // Filtrar campos vazios antes de mesclar
      const filtered = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v && v !== '' && v !== '""')
      );

      Object.assign(this.P.briefing, filtered);
      this.autosave();
      await this.aiLogDelay(300);

      this.aiLogDone();

      setTimeout(() => {
        this.closeModal('modal-gen');
        this.goToStep(1);
        this.showToast(`Análise concluída! ${Object.keys(filtered).length} campos preenchidos.`, 'success');
      }, 800);

    } catch (e) {
      console.error('runIntakeAnalysis error:', e);
      this.aiLogError(this.state.aiLog.active, e.message);
      setTimeout(() => {
        this.closeModal('modal-gen');
        this.showToast('Erro na análise: ' + e.message, 'error');
      }, 1500);
    }
  },

  async runArtAnalysis() {
    const B = this.B;
    if (!B) return;

    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) {
      this.showToast('Configure uma API Key primeiro.', 'warning');
      return;
    }

    this.openAILog('Gerando Direção de Arte', [
      { id: 1, label: 'Compilando referências e dados...' },
      { id: 2, label: 'Definindo paleta de cores...' },
      { id: 3, label: 'Criando ficha de tipografia...' },
      { id: 4, label: 'Definindo tom visual...' },
      { id: 5, label: 'Finalizando ficha...' },
    ]);

    try {
      this.aiLogStep(1, 'Lendo briefing e referências...');

      const refs = [
        ...(B.arte_referencias_pessoais || []).map(r => r.url).filter(Boolean),
        ...(B.arte_referencias_nicho || []).map(r => r.url).filter(Boolean),
      ];

      await this.aiLogDelay(200);
      this.aiLogStep(2, 'IA analisando identidade visual...');

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
    {"nome": "Nome da cor", "hex": "#HEXCODE", "uso": "Para que serve esta cor"},
    {"nome": "Nome da cor", "hex": "#HEXCODE", "uso": "Para que serve esta cor"},
    {"nome": "Nome da cor", "hex": "#HEXCODE", "uso": "Para que serve esta cor"}
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
  "elementos_visuais": "Descrição de elementos gráficos, padrões, texturas recomendados",
  "fotografia": "Orientações para escolha e edição de fotos"
}`;

      this.aiLogStep(3, 'Aguardando resposta da IA...');
      const res = await this.callAI(prompt);

      this.aiLogStep(4, 'Processando ficha...');

      // Parse robusto
      let ficha = null;
      const cleanRes = res.replace(/```json|```/g, '').trim();
      try {
        ficha = JSON.parse(cleanRes);
      } catch (e1) {
        const match = cleanRes.match(/\{[\s\S]*\}/);
        if (match) {
          try { ficha = JSON.parse(match[0]); }
          catch (e2) { throw new Error('Resposta da IA inválida. Tente novamente.'); }
        } else {
          throw new Error('Não foi possível extrair a ficha de arte da resposta.');
        }
      }

      this.aiLogStep(5, 'Salvando ficha...');
      this.setField('ficha_direcao_arte', JSON.stringify(ficha));
      this.state.artAnalyzed = true;
      await this.aiLogDelay(300);

      this.aiLogDone();

      setTimeout(() => {
        this.closeModal('modal-gen');

        // Exibir no modal de resultado
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
        }

        this.openModal('modal-art-result');
        this.showToast('Direção de Arte gerada! Revise e aprove.', 'success');
      }, 800);

    } catch (e) {
      console.error('runArtAnalysis error:', e);
      this.aiLogError(this.state.aiLog.active, e.message);
      setTimeout(() => {
        this.closeModal('modal-gen');
        this.showToast('Erro ao gerar arte: ' + e.message, 'error');
      }, 1500);
    }
  },

  async generateDocImpl() {
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) {
      this.showToast('Configure uma API Key primeiro.', 'warning');
      return;
    }

    if (!this.P) {
      this.showToast('Nenhum projeto ativo.', 'warning');
      return;
    }

    this.state.isGenerating = true;

    this.openAILog('Gerando Ficha de Implementação', [
      { id: 1, label: 'Consolidando briefing completo...' },
      { id: 2, label: 'Preparando prompt de implementação...' },
      { id: 3, label: 'IA gerando ficha técnica...' },
      { id: 4, label: 'Validando e baixando...' },
    ]);

    try {
      this.aiLogStep(1, 'Montando DOC-1...');
      const doc1 = this.buildDoc1();
      await this.aiLogDelay(300);

      this.aiLogStep(2, 'Preparando prompt...');
      const prompt = `${REGRAS_FIXAS_ADSGATOR}

---

Com base no briefing abaixo, gere a Ficha de Implementação Técnica completa para o Roo Code implementar a landing page.

A ficha deve incluir:
1. Estrutura de arquivos do projeto Astro
2. Design System completo (tokens Tailwind, cores, tipografia)
3. Componentes necessários com props
4. Copy de cada seção (H1, subtítulo, CTAs, textos dos blocos)
5. Configurações do .env
6. Integrações ativas e como configurar
7. Instruções de deploy na Vercel
8. ${PROMPT_AUDITORIA}

BRIEFING COMPLETO (DOC-1):
${doc1}`;

      this.aiLogStep(3, 'Isso pode levar 60–120 segundos...');
      const res = await this.callAI(prompt);

      this.aiLogStep(4, 'Salvando e baixando...');
      this.state.lastDocImpl = res;
      const slug = this.B.slug || this.B.nome_cliente?.toLowerCase().replace(/\s+/g, '-') || 'projeto';
      this.downloadText(res, `doc-impl-${slug}.md`, 'text/markdown');

      await this.aiLogDelay(400);
      this.aiLogDone();
      this.state.isGenerating = false;
      this.showNotification('AIGator', 'Ficha de Implementação gerada!');

      setTimeout(() => {
        this.closeModal('modal-gen');
        this.showToast('DOC-IMPL gerado e baixado com sucesso!', 'success');
        this.renderScreen();
      }, 800);

    } catch (e) {
      console.error('generateDocImpl error:', e);
      this.state.isGenerating = false;
      this.aiLogError(this.state.aiLog.active, e.message);
      setTimeout(() => {
        this.closeModal('modal-gen');
        this.showToast('Erro ao gerar: ' + e.message, 'error');
      }, 1500);
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
