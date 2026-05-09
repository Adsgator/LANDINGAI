/* ============================================================
   AIGator — Screen: Google Ads (Integrado ao Sistema Principal)
   ============================================================ */

Object.assign(window.App, {

  // Estado do módulo Google Ads
  gaState: {
    step: 'input', // 'input' | 'generating' | 'result'
    strategy: null,
    inputs: {
      budgetTotal: '',
      mainGoal: 'leads',
      location: 'Brasil Inteiro',
      locationValue: '',
      lpUrl: '',
      manualBriefing: null,
    },
    isManualMode: false,
  },

  /* ----------------------------------------------------------
     STEPS do Google Ads (para sidebar)
  ---------------------------------------------------------- */
  GA_STEPS: [
    { id: 'ga-input', icon: 'settings', label: 'Configuração', screen: 'ga-input' },
    { id: 'ga-strategy', icon: 'bar-chart-2', label: 'Estratégia', screen: 'ga-strategy' },
    { id: 'ga-campaigns', icon: 'megaphone', label: 'Campanhas', screen: 'ga-campaigns' },
    { id: 'ga-export', icon: 'download', label: 'Exportar CSV', screen: 'ga-export' },
  ],

  /* ----------------------------------------------------------
     RENDER PRINCIPAL — Tela do Google Ads
  ---------------------------------------------------------- */
  buildGoogleAdsScreen() {
    const ga = this.gaState;
    const B = this.B || {};
    const hasLP = !!B.estrutura_lp;

    // Verificar se tem contexto da LP
    const contextStatus = hasLP 
      ? `<div class="ga-context-badge ga-context-ok">
           <i data-lucide="check-circle" style="width:14px;height:14px;"></i>
           <span>LP conectada: ${B.nome_cliente || 'Projeto atual'}</span>
         </div>`
      : `<div class="ga-context-badge ga-context-pending">
           <i data-lucide="alert-circle" style="width:14px;height:14px;"></i>
           <span>Sem LP — Modo Manual</span>
         </div>`;

    if (ga.step === 'result' && ga.strategy) {
      return this._buildGAResultScreen();
    }

    return `
    <div class="ga-screen">
      <div class="ga-screen-header">
        <button class="btn-ghost btn-back-lp" onclick="App.goToScreen('intake');">
          <i data-lucide="arrow-left" style="width:14px;height:14px;"></i>
          Voltar para LandingAI
        </button>
        <h2 class="ga-screen-title">
          <i data-lucide="trending-up" style="width:24px;height:24px;color:var(--accent2);"></i>
          Google Ads — Gerador de Campanhas
        </h2>
        <p class="ga-screen-desc">
          Configure sua estratégia, defina orçamento e meta. A IA gera campanhas prontas para o Google Ads Editor.
        </p>
        ${contextStatus}
      </div>

      <!-- Modo Manual Banner -->
      ${ga.isManualMode ? `
      <div class="ga-manual-banner">
        <div class="ga-manual-banner-header">
          <i data-lucide="upload" style="width:16px;height:16px;color:var(--accent2);"></i>
          <span>Modo Manual — Upload de Briefing</span>
        </div>
        <div class="field-group" style="margin-top:12px;">
          <label class="field-label">Selecione o arquivo DOC-1 ou Briefing (.md)</label>
          <input type="file" id="ga-manual-file" accept=".md" class="field-input"
            style="cursor:pointer;">
        </div>
      </div>
      ` : ''}

      <div class="ga-form-sections">
        <!-- Seção 1: Orçamento -->
        <div class="ga-form-card">
          <div class="ga-form-card-header">
            <i data-lucide="dollar-sign" style="width:16px;height:16px;color:var(--accent);"></i>
            <span>Orçamento</span>
          </div>
          <div class="ga-form-card-body">
            <div class="field-group">
              <label class="field-label">Verba Mensal Total (R$) <span class="field-required">*</span></label>
              <input type="number" id="ga-budget" class="field-input" min="100" step="100"
                placeholder="Ex: 1500" value="${ga.inputs.budgetTotal}">
              <span class="field-hint">Mínimo R$100. Recomendado R$1.500+ para resultados consistentes.</span>
            </div>
          </div>
        </div>

        <!-- Seção 2: Geolocalização -->
        <div class="ga-form-card">
          <div class="ga-form-card-header">
            <i data-lucide="map-pin" style="width:16px;height:16px;color:var(--warning);"></i>
            <span>Geolocalização</span>
          </div>
          <div class="ga-form-card-body">
            <div class="field-group">
              <label class="field-label">Abrangência</label>
              <div class="chip-group">
                ${['Brasil Inteiro', 'Região específica', 'Cidade específica'].map(opt => `
                  <button class="chip ${ga.inputs.location === opt ? 'on' : ''}"
                    onclick="App.gaState.inputs.location='${opt}'; App.renderScreen(true);">${opt}</button>
                `).join('')}
              </div>
            </div>
            ${ga.inputs.location !== 'Brasil Inteiro' ? `
            <div class="field-group" style="margin-top:12px;">
              <label class="field-label">Localização</label>
              <input type="text" id="ga-location-value" class="field-input"
                placeholder="Ex: São Paulo, SP" value="${ga.inputs.locationValue}">
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Seção 3: Objetivo -->
        <div class="ga-form-card">
          <div class="ga-form-card-header">
            <i data-lucide="target" style="width:16px;height:16px;color:var(--accent2);"></i>
            <span>Meta Principal</span>
          </div>
          <div class="ga-form-card-body">
            <div class="sel-cards">
              ${[
                { v: 'leads', icon: 'users', title: 'Gerar Leads', desc: 'Captura de contatos qualificados via formulário ou WhatsApp' },
                { v: 'calls', icon: 'phone', title: 'Receber Chamadas', desc: 'Ligações diretas de clientes interessados' },
                { v: 'bookings', icon: 'calendar', title: 'Agendar Consultas', desc: 'Agendamento online ou via link de calendário' },
                { v: 'sales', icon: 'shopping-cart', title: 'Vender Produto', desc: 'Vendas diretas com foco em conversão' },
              ].map(opt => `
                <div class="sel-card ${ga.inputs.mainGoal === opt.v ? 'on' : ''}"
                  onclick="App.gaState.inputs.mainGoal='${opt.v}'; App.renderScreen(true);" tabindex="0">
                  <i data-lucide="${opt.icon}" class="sel-card-icon" style="width:18px;height:18px;"></i>
                  <div>
                    <div class="sel-card-title">${opt.title}</div>
                    <div class="sel-card-desc">${opt.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Seção 4: URL da LP -->
        <div class="ga-form-card">
          <div class="ga-form-card-header">
            <i data-lucide="link" style="width:16px;height:16px;color:var(--accent);"></i>
            <span>Landing Page</span>
          </div>
          <div class="ga-form-card-body">
            <div class="field-group">
              <label class="field-label">URL da Landing Page ${ga.isManualMode ? '<span class="field-optional">opcional</span>' : '<span class="field-required">*</span>'}</label>
              <input type="text" id="ga-lp-url" class="field-input"
                placeholder="https://exemplo.com" value="${ga.inputs.lpUrl || B.slug ? `https://lp.adsgator.com.br/${B.slug || ''}` : ''}">
              <span class="field-hint">A URL final onde os anúncios vão direcionar o tráfego.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Ação Principal -->
      <div class="ga-generate-section">
        <button id="btn-ga-generate" class="btn-primary btn-xl">
          <i data-lucide="sparkles"></i>
          Gerar Estratégia com IA
        </button>
        <p class="ga-action-hint">A IA vai analisar o briefing do cliente e criar campanhas otimizadas para Google Ads.</p>
      </div>
    </div>
    `;
  },

  /* ----------------------------------------------------------
     RENDER RESULTADO
  ---------------------------------------------------------- */
  _buildGAResultScreen() {
    const strategy = this.gaState.strategy;
    if (!strategy) return '<p>Nenhuma estratégia gerada.</p>';

    // Análise
    let analysisHTML = '';
    if (strategy.analise || strategy.recomendacao || strategy.justificativa) {
      analysisHTML = `
      <div class="ga-analysis-card">
        <div class="ga-analysis-header">
          <i data-lucide="brain" style="width:18px;height:18px;color:var(--accent);"></i>
          <h3>Análise Estratégica</h3>
        </div>
        <div class="ga-analysis-body">
          ${strategy.analise ? `<div class="ga-analysis-item">
            <span class="ga-analysis-label">Análise da Situação</span>
            <p>${strategy.analise}</p>
          </div>` : ''}
          ${strategy.recomendacao ? `<div class="ga-analysis-item">
            <span class="ga-analysis-label">Recomendação</span>
            <p>${strategy.recomendacao}</p>
          </div>` : ''}
          ${strategy.justificativa ? `<div class="ga-analysis-item">
            <span class="ga-analysis-label">Justificativa</span>
            <p>${strategy.justificativa}</p>
          </div>` : ''}
        </div>
      </div>
      `;
    }

    // Campanhas
    let campanhasHTML = '';
    if (strategy.campanhas && strategy.campanhas.length > 0) {
      campanhasHTML = strategy.campanhas.map(camp => {
        let adGroupsHTML = '';
        if (camp.ad_groups) {
          adGroupsHTML = camp.ad_groups.map(ag => {
            // Keywords
            let kwHTML = '';
            if (ag.keywords_positivas) {
              kwHTML += ag.keywords_positivas.map(kw =>
                `<span class="ga-kw-chip ga-kw-pos">${typeof kw === 'string' ? kw : kw.keyword || kw}</span>`
              ).join('');
            }
            if (ag.keywords_negativas) {
              kwHTML += ag.keywords_negativas.map(kw =>
                `<span class="ga-kw-chip ga-kw-neg">-${kw}</span>`
              ).join('');
            }

            // Anúncios
            let adsHTML = '';
            if (ag.anuncios) {
              adsHTML = ag.anuncios.map(ad => {
                const headlines = (ad.headlines || []).map(h => h.texto || h).join(' | ');
                const descriptions = (ad.descriptions || []).map(d => d.texto || d).join(' ');
                return `
                <div class="ga-ad-preview">
                  <div class="ga-ad-label">Patrocinado</div>
                  <div class="ga-ad-url">${ad.final_url || 'sua-lp.com'}</div>
                  <div class="ga-ad-headline">${headlines}</div>
                  <div class="ga-ad-description">${descriptions}</div>
                  ${ad.call_to_action ? `<div class="ga-ad-cta">${ad.call_to_action}</div>` : ''}
                </div>
                `;
              }).join('');
            }

            return `
            <div class="ga-adgroup-card">
              <div class="ga-adgroup-header">
                <i data-lucide="folder" style="width:14px;height:14px;color:var(--accent2);"></i>
                <span>${ag.nome}</span>
              </div>
              <div class="ga-adgroup-body">
                <div class="ga-kw-section">
                  <span class="ga-kw-title">Keywords</span>
                  <div class="ga-kw-list">${kwHTML}</div>
                </div>
                <div class="ga-ads-section">
                  <span class="ga-ads-title">Anúncios</span>
                  ${adsHTML}
                </div>
              </div>
            </div>
            `;
          }).join('');
        }

        return `
        <div class="ga-campaign-card">
          <div class="ga-campaign-header">
            <div class="ga-campaign-info">
              <h3>${camp.nome}</h3>
              <span class="ga-badge">${camp.rede || 'search'}</span>
            </div>
            <div class="ga-campaign-budget">
              R$ ${camp.orcamento || 0}<span>/mês</span>
            </div>
          </div>
          <div class="ga-campaign-body">
            ${adGroupsHTML}
          </div>
        </div>
        `;
      }).join('');
    }

    return `
    <div class="ga-screen">
      <div class="ga-screen-header">
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:4px;">
          <button class="btn-ghost btn-back-lp" onclick="App.goToScreen('intake');">
            <i data-lucide="arrow-left" style="width:14px;height:14px;"></i>
            Voltar para LandingAI
          </button>
        </div>
        <h2 class="ga-screen-title">
          <i data-lucide="trending-up" style="width:24px;height:24px;color:var(--accent2);"></i>
          Estratégia Google Ads
        </h2>
        <div class="ga-result-actions">
          <button class="btn-ghost" onclick="App.gaState.step='input'; App.renderScreen();">
            <i data-lucide="settings" style="width:14px;height:14px;"></i>
            Voltar à Configuração
          </button>
          <button class="btn-primary" id="btn-ga-export-csv">
            <i data-lucide="download" style="width:14px;height:14px;"></i>
            Exportar para Google Ads Editor
          </button>
          <button class="btn-ghost" id="btn-ga-regenerate">
            <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i>
            Regenerar
          </button>
        </div>
      </div>

      ${analysisHTML}

      <div class="ga-campaigns-section">
        <div class="ga-campaigns-header">
          <i data-lucide="megaphone" style="width:16px;height:16px;color:var(--accent);"></i>
          <span>Campanhas e Anúncios</span>
          <span class="ga-campaigns-count">${strategy.campanhas?.length || 0} campanha(s)</span>
        </div>
        ${campanhasHTML}
      </div>
    </div>
    `;
  },

  /* ----------------------------------------------------------
     GERAR ESTRATÉGIA
  ---------------------------------------------------------- */
  async generateGAStrategy() {
    const ga = this.gaState;
    const B = this.B || {};

    // Validação
    const budget = document.getElementById('ga-budget')?.value;
    const lpUrl = document.getElementById('ga-lp-url')?.value;
    const locationValue = document.getElementById('ga-location-value')?.value || '';

    if (!budget || parseInt(budget) < 100) {
      this.showToast('Informe a verba mensal (mínimo R$100).', 'warning');
      return;
    }

    // Atualizar estado
    ga.inputs.budgetTotal = budget;
    ga.inputs.lpUrl = lpUrl;
    ga.inputs.locationValue = locationValue;

    // Verificar manual mode file
    let manualBriefing = null;
    if (ga.isManualMode) {
      const fileInput = document.getElementById('ga-manual-file');
      if (fileInput && fileInput.files.length > 0) {
        manualBriefing = await fileInput.files[0].text();
      }
      if (!lpUrl && !manualBriefing) {
        this.showToast('No modo manual, selecione um arquivo .md ou informe a URL.', 'warning');
        return;
      }
    }

    // Verificar API Key
    const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
    if (!hasKey) {
      this.showToast('Configure uma API Key primeiro.', 'warning');
      return;
    }

    // Montar contexto
    let contextoCliente = '';
    let urlFinal = lpUrl || '';

    if (manualBriefing) {
      contextoCliente = `DADOS DO BRIEFING MANUAL:\n${manualBriefing}\n\n`;
    } else if (B.nome_cliente) {
      contextoCliente = `
CLIENTE: ${B.nome_cliente || '—'}
SEGMENTO: ${B.segmento || '—'}
SERVIÇO: ${B.servico_principal || '—'}
PÚBLICO-ALVO: ${B.publico_primario || '—'}
DIFERENCIAL: ${B.diferencial || '—'}
WHATSAPP: ${B.whatsapp || '—'}
OBJETIVO: ${B.objetivo_conversao || '—'}
MODALIDADE: ${B.modalidade || '—'}
DEPOIMENTOS: ${B.depoimentos || 'não'}
FRASE DE IMPACTO: ${B.frase_impacto || '—'}
      `.trim();
      if (!urlFinal && B.slug) {
        urlFinal = `https://lp.adsgator.com.br/${B.slug}`;
      }
    }

    const locationStr = ga.inputs.location === 'Brasil Inteiro' 
      ? 'Brasil Inteiro' 
      : locationValue || ga.inputs.location;

    // AI Log
    this.openAILog('Gerando Estratégia Google Ads', [
      { id: 1, icon: 'file-text', label: 'Analisando contexto do cliente...' },
      { id: 2, icon: 'cpu', label: 'Gerando campanhas e keywords...' },
      { id: 3, icon: 'bar-chart-2', label: 'Criando anúncios otimizados...' },
      { id: 4, icon: 'check-circle', label: 'Validando e finalizando...' },
    ]);

    try {
      this.aiLogStep(1);
      await this.aiLogDelay(300);

      this.aiLogStep(2);
      const prompt = `
Gerar estratégia completa de Google Ads para:

${contextoCliente}

VERBA MENSAL: R$ ${budget}
GEOLOCALIZAÇÃO: ${locationStr}
META PRINCIPAL: ${ga.inputs.mainGoal}
URL DA LANDING PAGE: ${urlFinal || 'A definir'}

Considere que ${parseInt(budget) < 1000 ? 'o orçamento é baixo, então foque em Rede de Pesquisa com keywords de alta intenção' : 'há bom orçamento, considere multi-canal (Pesquisa + Display ou Performance Max)'}.

Retorne EXCLUSIVAMENTE um JSON válido (sem markdown, sem backticks) com esta estrutura:
{
  "analise": "Análise da situação do cliente e mercado",
  "recomendacao": "Recomendação estratégica principal",
  "justificativa": "Por que esta estratégia é a melhor",
  "campanhas": [
    {
      "nome": "Nome da Campanha",
      "rede": "search|display|pmax|youtube",
      "orcamento": 500,
      "ad_groups": [
        {
          "nome": "Grupo de Anúncio",
          "keywords_positivas": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"],
          "keywords_negativas": ["evitar1", "evitar2"],
          "anuncios": [
            {
              "headlines": [
                { "texto": "Headline 1 (máx 30 chars)" },
                { "texto": "Headline 2 (máx 30 chars)" },
                { "texto": "Headline 3 (máx 30 chars)" }
              ],
              "descriptions": [
                { "texto": "Description 1 (máx 90 chars)" },
                { "texto": "Description 2 (máx 90 chars)" }
              ],
              "final_url": "${urlFinal || 'https://exemplo.com'}",
              "call_to_action": "CTA específica"
            }
          ]
        }
      ]
    }
  ]
}

Regras:
- Headlines: máximo 30 caracteres cada
- Descriptions: máximo 90 caracteres cada
- Mínimo 3 headlines e 2 descriptions por anúncio
- Mínimo 5 keywords positivas por grupo
- Keywords devem ser relevantes para o serviço do cliente
- CTAs específicas (nunca "Saiba mais" ou "Clique aqui")
- Mínimo 2 campanhas se orçamento > R$1000
- JSON deve ser válido e completo
      `.trim();

      const response = await this.callAI({
        userPrompt: prompt,
        maxTokens: 4000
      });

      this.aiLogStep(3);
      await this.aiLogDelay(300);

      // Parse JSON
      let strategy;
      try {
        let clean = response.replace(/```json|```/g, '').trim();
        const firstBrace = clean.indexOf('{');
        const lastBrace = clean.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          clean = clean.substring(firstBrace, lastBrace + 1);
        }
        strategy = JSON.parse(clean);
      } catch (e) {
        throw new Error('A IA não retornou JSON válido. Tente novamente.');
      }

      // Validação básica
      if (!strategy.campanhas || strategy.campanhas.length === 0) {
        throw new Error('Nenhuma campanha foi gerada. Tente novamente.');
      }

      this.aiLogStep(4);
      await this.aiLogDelay(300);

      // Salvar resultado
      ga.strategy = strategy;
      ga.step = 'result';

      this.aiLogDone();
      setTimeout(() => {
        this.closeAILog();
        this.renderScreen();
        this.showToast('Estratégia Google Ads gerada com sucesso!', 'success');
      }, 600);

    } catch (err) {
      console.error('[GA] Erro:', err);
      this.aiLogError(this.state.aiLog.active, err.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar estratégia: ' + err.message, 'error');
      }, 1200);
    }
  },

  /* ----------------------------------------------------------
     EXPORTAR CSV
  ---------------------------------------------------------- */
  exportGAtoCSV() {
    const strategy = this.gaState.strategy;
    if (!strategy) {
      this.showToast('Gere a estratégia primeiro.', 'warning');
      return;
    }

    const rows = [];

    // === Campanhas e Grupos ===
    rows.push(['Campaign', 'Ad Group', 'Status', 'Bid Strategy Type', 'Daily Budget'].join(','));
    (strategy.campanhas || []).forEach(camp => {
      const dailyBudget = camp.orcamento ? (camp.orcamento / 30).toFixed(2) : 0;
      (camp.ad_groups || []).forEach(ag => {
        rows.push([
          this._csvEscape(camp.nome),
          this._csvEscape(ag.nome),
          'Enabled',
          'Maximize Conversions',
          dailyBudget
        ].join(','));
      });
    });

    rows.push('');

    // === Keywords ===
    rows.push(['Campaign', 'Ad Group', 'Keyword', 'Match Type', 'Status'].join(','));
    (strategy.campanhas || []).forEach(camp => {
      (camp.ad_groups || []).forEach(ag => {
        (ag.keywords_positivas || []).forEach(kw => {
          const kwText = typeof kw === 'string' ? kw : (kw.keyword || kw);
          rows.push([
            this._csvEscape(camp.nome),
            this._csvEscape(ag.nome),
            this._csvEscape(kwText),
            'Broad',
            'Enabled'
          ].join(','));
        });
        (ag.keywords_negativas || []).forEach(kw => {
          rows.push([
            this._csvEscape(camp.nome),
            this._csvEscape(ag.nome),
            this._csvEscape('-' + kw),
            'Broad',
            'Enabled'
          ].join(','));
        });
      });
    });

    rows.push('');

    // === Anúncios ===
    rows.push(['Campaign', 'Ad Group', 'Headline 1', 'Headline 2', 'Headline 3', 'Description 1', 'Description 2', 'Final URL', 'Status'].join(','));
    (strategy.campanhas || []).forEach(camp => {
      (camp.ad_groups || []).forEach(ag => {
        (ag.anuncios || []).forEach(ad => {
          const h = ad.headlines || [];
          const d = ad.descriptions || [];
          rows.push([
            this._csvEscape(camp.nome),
            this._csvEscape(ag.nome),
            this._csvEscape(h[0]?.texto || h[0] || ''),
            this._csvEscape(h[1]?.texto || h[1] || ''),
            this._csvEscape(h[2]?.texto || h[2] || ''),
            this._csvEscape(d[0]?.texto || d[0] || ''),
            this._csvEscape(d[1]?.texto || d[1] || ''),
            ad.final_url || '',
            'Enabled'
          ].join(','));
        });
      });
    });

    const csvContent = rows.join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `google-ads-${this.P?.name?.replace(/\s+/g, '-') || 'strategy'}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('CSV exportado para Google Ads Editor!', 'success');
  },

  _csvEscape(field) {
    if (!field && field !== 0) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  },

  /* ----------------------------------------------------------
     BIND EVENTS para Google Ads
  ---------------------------------------------------------- */
  bindGAEvents(container) {
    const genBtn = container.querySelector('#btn-ga-generate');
    if (genBtn) genBtn.addEventListener('click', () => this.generateGAStrategy());

    const exportBtn = container.querySelector('#btn-ga-export-csv');
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportGAtoCSV());

    const regenBtn = container.querySelector('#btn-ga-regenerate');
    if (regenBtn) regenBtn.addEventListener('click', () => {
      this.gaState.step = 'input';
      this.renderScreen();
    });
  }
});
