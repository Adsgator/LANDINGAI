// 03-ga-ui.js (renderização)

/**
 * Renderizar Estratégia na UI
 */
function renderGAStrategy(strategy) {
  const container = document.getElementById('ga-output-section');
  if (!container) return;

  // Limpar container
  container.innerHTML = '';

  // 1. Resumo
  const resumoHTML = `
    <div class="ga-card ga-summary-card">
      <h2>📊 Resumo da Estratégia</h2>
      <div class="ga-summary-grid">
        <div class="ga-metric">
          <span class="ga-metric-label">Budget Mensal</span>
          <span class="ga-metric-value">R$ ${strategy.analise_inicial?.budget_mensal || 0}</span>
        </div>
        <div class="ga-metric">
          <span class="ga-metric-label">CPC Estimado</span>
          <span class="ga-metric-value">R$ ${strategy.analise_inicial?.cpc_estimado || 0}</span>
        </div>
        <div class="ga-metric">
          <span class="ga-metric-label">Meta de Leads</span>
          <span class="ga-metric-value">${strategy.metas_conversao?.meta_leads_mes || 0}</span>
        </div>
        <div class="ga-metric">
          <span class="ga-metric-label">CPA Alvo</span>
          <span class="ga-metric-value">R$ ${strategy.metas_conversao?.meta_cpa || 0}</span>
        </div>
      </div>
      <p class="ga-justification">${strategy.analise_inicial?.justificativa_estrategica || ''}</p>
    </div>
  `;

  // 2. Campanhas
  let campanhasHTML = \`<h2>📈 Campanhas Recomendadas</h2>\`;
  
  if (strategy.campanhas && strategy.campanhas.length > 0) {
    strategy.campanhas.forEach(camp => {
      let adGroupsHTML = '';
      if (camp.ad_groups) {
        camp.ad_groups.forEach(ag => {
          
          let kwHTML = '';
          if (ag.keywords_positivas) {
            kwHTML = ag.keywords_positivas.map(kw => \`<span class="ga-kw-chip ga-kw-pos">\${kw.keyword || kw}</span>\`).join(' ');
          }
          if (ag.keywords_negativas) {
             kwHTML += ' ' + ag.keywords_negativas.map(kw => \`<span class="ga-kw-chip ga-kw-neg">-\${kw}</span>\`).join(' ');
          }

          let adsHTML = '';
          if (ag.anuncios) {
            ag.anuncios.forEach((ad, i) => {
              const h1 = (ad.headlines && ad.headlines[0]) ? (ad.headlines[0].texto || ad.headlines[0]) : '';
              const h2 = (ad.headlines && ad.headlines[1]) ? (ad.headlines[1].texto || ad.headlines[1]) : '';
              const d1 = (ad.descriptions && ad.descriptions[0]) ? (ad.descriptions[0].texto || ad.descriptions[0]) : '';
              
              adsHTML += \`
                <div class="ga-ad-preview">
                  <div class="ga-ad-url">Patrocinado • \${ad.final_url || 'exemplo.com'}</div>
                  <div class="ga-ad-headline">\${h1} | \${h2}</div>
                  <div class="ga-ad-description">\${d1}</div>
                </div>
              \`;
            });
          }

          adGroupsHTML += \`
            <div class="ga-adgroup">
              <h4>Ad Group: \${ag.nome} <span class="ga-badge">\${ag.estrategia_lances}</span></h4>
              <div class="ga-kw-list">\${kwHTML}</div>
              <div class="ga-ads-list">\${adsHTML}</div>
            </div>
          \`;
        });
      }

      const orcamentoDiario = camp.budget_diario || (camp.orcamento ? (camp.orcamento/30).toFixed(2) : 0);
      campanhasHTML += \`
        <div class="ga-card ga-campaign-card">
          <h3>\${camp.nome} <span class="ga-badge ga-badge-primary">\${camp.tipo}</span></h3>
          <p><strong>Orçamento Diário:</strong> R$ \${orcamentoDiario}</p>
          <div class="ga-adgroups-container">
            \${adGroupsHTML}
          </div>
        </div>
      \`;
    });
  }

  // Juntar tudo
  container.innerHTML = resumoHTML + campanhasHTML;
}

// Funções para renderizar a UI do Google Ads (Strategy Dashboard)


/**
 * Adicionar botão de export na renderização
 */
function addExportButton(strategy) {
  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn btn-primary btn-large';
  exportBtn.style.marginTop = '20px';
  exportBtn.style.backgroundColor = '#0f9d58'; // Google Ads green feel
  exportBtn.innerHTML = '📥 Exportar para CSV (Google Ads Editor)';
  
  exportBtn.onclick = () => {
    // Validar antes
    if (showExportValidation(strategy)) {
      exportFullStrategyToCSV(strategy);
    }
  };
  
  let targetContainer = document.getElementById('ga-strategy-output') || document.getElementById('ga-output-section');
  if (targetContainer) {
    targetContainer.appendChild(exportBtn);
  } else {
    console.warn('Container de output não encontrado para o botão de exportar');
  }
}
