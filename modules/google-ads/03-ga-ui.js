/**
 * Google Ads UI Rendering
 * Renderiza os dados da estratégia e plano de otimização
 */

/**
 * Renderizar Estratégia na UI
 */
function renderGAStrategy(strategy) {
  const container = document.getElementById('ga-output-section');
  if (!container) return;

  // Limpar container
  container.innerHTML = '';

  // 1. Resumo e Análise
  const resumoHTML = `
    <div class="ga-card ga-summary-card">
      <h2>📊 Estratégia Recomendada</h2>
      <div class="ga-analysis-content">
        <div class="ga-analysis-section">
          <h3>🔍 Análise da Situação</h3>
          <p>${strategy.analise || ''}</p>
        </div>
        <div class="ga-analysis-section">
          <h3>💡 Recomendação Principal</h3>
          <p>${strategy.recomendacao || ''}</p>
        </div>
        <div class="ga-analysis-section">
          <h3>⚖️ Justificativa</h3>
          <p>${strategy.justificativa || ''}</p>
        </div>
      </div>
    </div>
  `;

  // 2. Campanhas
  let campanhasHTML = `<h2>📈 Campanhas e Anúncios</h2>`;
  
  if (strategy.campanhas && strategy.campanhas.length > 0) {
    strategy.campanhas.forEach(camp => {
      let adGroupsHTML = '';
      if (camp.ad_groups) {
        camp.ad_groups.forEach(ag => {
          
          let kwHTML = '';
          if (ag.keywords_positivas) {
            kwHTML = ag.keywords_positivas.map(kw => `<span class="ga-kw-chip ga-kw-pos">${kw}</span>`).join(' ');
          }
          if (ag.keywords_negativas) {
             kwHTML += ' ' + ag.keywords_negativas.map(kw => `<span class="ga-kw-chip ga-kw-neg">-${kw}</span>`).join(' ');
          }

          let adsHTML = '';
          if (ag.anuncios) {
            ag.anuncios.forEach((ad, i) => {
              const headlines = ad.headlines || [];
              const descriptions = ad.descriptions || [];
              
              const hText = headlines.map(h => h.texto || h).join(' | ');
              const dText = descriptions.map(d => d.texto || d).join(' ');
              
              adsHTML += `
                <div class="ga-ad-preview">
                  <div class="ga-ad-url">Patrocinado • ${ad.final_url || 'sua-lp.com'}</div>
                  <div class="ga-ad-headline">${hText}</div>
                  <div class="ga-ad-description">${dText}</div>
                  <div class="ga-ad-cta"><strong>CTA:</strong> ${ad.call_to_action || ''}</div>
                </div>
              `;
            });
          }

          adGroupsHTML += `
            <div class="ga-adgroup">
              <h4>Grupo: ${ag.nome}</h4>
              <div class="ga-kw-list">${kwHTML}</div>
              <div class="ga-ads-list">${adsHTML}</div>
            </div>
          `;
        });
      }

      campanhasHTML += `
        <div class="ga-card ga-campaign-card">
          <h3>${camp.nome} <span class="ga-badge ga-badge-primary">${camp.rede || camp.tipo || ''}</span></h3>
          <p><strong>Orçamento Sugerido:</strong> R$ ${camp.orcamento || 0}</p>
          <div class="ga-adgroups-container">
            ${adGroupsHTML}
          </div>
        </div>
      `;
    });
  }

  // Juntar tudo
  container.innerHTML = resumoHTML + campanhasHTML;

  // 3. Adicionar botão de export
  addExportButton(strategy);
}

/**
 * Renderizar Plano de Otimização
 */
function renderGAOptimization(plan) {
    const container = document.getElementById('ga-optimization-output') || document.getElementById('ga-output-section');
    if (!container) return;

    container.innerHTML = `
        <div class="ga-card ga-optimization-card">
            <div class="ga-opt-header">
                <h2>📈 Plano de Otimização</h2>
                <div class="ga-health-score">
                    <span class="ga-health-label">Score de Saúde:</span>
                    <span class="ga-health-value ${plan.score_saude > 70 ? 'high' : plan.score_saude > 40 ? 'med' : 'low'}">${plan.score_saude}%</span>
                </div>
            </div>
            <p class="ga-opt-summary">${plan.sumario}</p>
            
            <div class="ga-actions-list">
                ${plan.acoes.map(acao => `
                    <div class="ga-action-item ga-priority-${acao.prioridade}">
                        <div class="ga-action-type">${acao.tipo.toUpperCase()}</div>
                        <div class="ga-action-element">${acao.elemento}</div>
                        <div class="ga-action-problem"><strong>Problema:</strong> ${acao.problema}</div>
                        <div class="ga-action-solution"><strong>Ação:</strong> ${acao.acao}</div>
                        <div class="ga-action-impact"><strong>Impacto:</strong> ${acao.impacto_esperado}</div>
                        <div class="ga-action-urgency">Agir em: ${acao.urgencia}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * Adicionar botão de export na renderização
 */
function addExportButton(strategy) {
  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn btn-primary btn-large';
  exportBtn.style.marginTop = '20px';
  exportBtn.style.width = '100%';
  exportBtn.style.backgroundColor = '#0f9d58'; 
  exportBtn.innerHTML = '<i data-lucide="download"></i> Exportar para Google Ads Editor';
  
  exportBtn.onclick = () => {
    if (typeof exportStrategyToCSV === 'function') {
        exportStrategyToCSV(strategy);
    } else {
        console.error('Função exportStrategyToCSV não encontrada');
    }
  };
  
  let targetContainer = document.getElementById('ga-output-section');
  if (targetContainer) {
    targetContainer.appendChild(exportBtn);
    if (window.lucide) lucide.createIcons();
  }
}

// Exportar global
window.renderGAStrategy = renderGAStrategy;
window.renderGAOptimization = renderGAOptimization;
window.addExportButton = addExportButton;
