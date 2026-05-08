/**
 * MÓDULO DE EXPORTAÇÃO PARA CSV
 * Converte JSON da IA em CSV compatível com Google Ads Editor
 */

/**
 * Exportar estratégia para CSV (Google Ads Editor)
 * @param {object} strategy - JSON da estratégia
 * @returns {blob} Arquivo CSV pronto para download
 */
function exportStrategyToCSV(strategy) {
  // Chamada para a função principal que exporta tudo
  exportFullStrategyToCSV(strategy);
}

/**
 * Gerar linhas de CAMPANHAS E GRUPOS
 */
function generateCampaignRows(strategy) {
  const rows = [];
  
  // Header
  rows.push([
    'Campaign',
    'Ad Group',
    'Status',
    'Bid Strategy Type',
    'Daily Budget'
  ].join(','));
  
  if (!strategy.campanhas) return rows;

  // Dados
  strategy.campanhas.forEach(camp => {
    const dailyBudget = camp.orcamento ? (camp.orcamento / 30).toFixed(2) : 0;
    
    if (camp.ad_groups) {
      camp.ad_groups.forEach(ag => {
        rows.push([
          escapeCsvField(camp.nome),
          escapeCsvField(ag.nome),
          'Enabled',
          escapeStrategy(ag.estrategia_lances),
          dailyBudget
        ].join(','));
      });
    }
  });
  
  return rows;
}

/**
 * Gerar linhas de KEYWORDS
 */
function generateKeywordRows(strategy) {
  const rows = [];
  
  // Header
  rows.push([
    'Campaign',
    'Ad Group',
    'Keyword',
    'Match Type',
    'Bid',
    'Status'
  ].join(','));
  
  if (!strategy.campanhas) return rows;

  // Dados
  strategy.campanhas.forEach(camp => {
    if (camp.ad_groups) {
      camp.ad_groups.forEach(ag => {
        if (ag.keywords_positivas) {
          ag.keywords_positivas.forEach(kw => {
            // Suporte para string ou objeto {keyword, match_type}
            const kwText = kw.keyword || kw;
            const mType = kw.match_type || 'broad';
            
            rows.push([
              escapeCsvField(camp.nome),
              escapeCsvField(ag.nome),
              escapeCsvField(kwText),
              mapMatchType(mType),
              kw.bid || 0,
              'Enabled'
            ].join(','));
          });
        }
        
        // Palavras negativas
        if (ag.keywords_negativas) {
          ag.keywords_negativas.forEach(negKw => {
            rows.push([
              escapeCsvField(camp.nome),
              escapeCsvField(ag.nome),
              escapeCsvField('-' + negKw),
              'Broad',
              '',
              'Enabled'
            ].join(','));
          });
        }
      });
    }
  });
  
  return rows;
}

/**
 * Gerar linhas de ANÚNCIOS
 */
function generateAdRows(strategy) {
  const rows = [];
  
  // Header
  rows.push([
    'Campaign',
    'Ad Group',
    'Headline 1',
    'Headline 2',
    'Headline 3',
    'Description 1',
    'Description 2',
    'Final URL',
    'Display URL',
    'Call To Action',
    'Status'
  ].join(','));
  
  if (!strategy.campanhas) return rows;

  // Dados
  strategy.campanhas.forEach(camp => {
    if (camp.ad_groups) {
      camp.ad_groups.forEach(ag => {
        if (ag.anuncios && ag.anuncios.length > 0) {
          ag.anuncios.forEach(ad => {
            // Headlines (máx 3)
            const h1 = (ad.headlines && ad.headlines[0]) ? ad.headlines[0].texto || ad.headlines[0] : '';
            const h2 = (ad.headlines && ad.headlines[1]) ? ad.headlines[1].texto || ad.headlines[1] : '';
            const h3 = (ad.headlines && ad.headlines[2]) ? ad.headlines[2].texto || ad.headlines[2] : '';
            
            // Descriptions (máx 2)
            const d1 = (ad.descriptions && ad.descriptions[0]) ? ad.descriptions[0].texto || ad.descriptions[0] : '';
            const d2 = (ad.descriptions && ad.descriptions[1]) ? ad.descriptions[1].texto || ad.descriptions[1] : '';
            
            rows.push([
              escapeCsvField(camp.nome),
              escapeCsvField(ag.nome),
              escapeCsvField(h1),
              escapeCsvField(h2),
              escapeCsvField(h3),
              escapeCsvField(d1),
              escapeCsvField(d2),
              ad.final_url || '',
              ad.display_url || '',
              ad.call_to_action || 'Learn More',
              'Enabled'
            ].join(','));
          });
        }
      });
    }
  });
  
  return rows;
}

/**
 * Escapar aspas e caracteres especiais em campo CSV
 */
function escapeCsvField(field) {
  if (!field && field !== 0) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Mapear estratégia de lances
 */
function escapeStrategy(strategy) {
  if (!strategy) return 'Maximize Conversions';
  const map = {
    'Target CPA': 'Target CPA',
    'Maximize Conversions': 'Maximize Conversions',
    'Target ROAS': 'Target ROAS',
    'Maximize Clicks': 'Maximize Clicks',
    'Target Impression Share': 'Target Impression Share'
  };
  return map[strategy] || strategy;
}

/**
 * Mapear match type
 */
function mapMatchType(type) {
  if (!type) return 'Broad';
  const map = {
    'broad': 'Broad',
    'phrase': 'Phrase',
    'exact': 'Exact',
    'broad_modified': 'Broad Match Modifier'
  };
  return map[type.toLowerCase()] || 'Broad';
}

/**
 * Download do arquivo CSV
 */
function downloadCSV(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * FUNÇÃO PRINCIPAL: Exportar estratégia completa
 */
function exportFullStrategyToCSV(strategy) {
  if (!strategy) return;
  const id = strategy.id || Date.now();

  const campaignRows = generateCampaignRows(strategy);
  const keywordRows = generateKeywordRows(strategy);
  const adRows = generateAdRows(strategy);
  
  const allRows = [
    ...campaignRows,
    '', 
    ...keywordRows,
    '', 
    ...adRows
  ];
  
  const csvContent = allRows.join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const filename = `google-ads-${id}.csv`;
  downloadCSV(blob, filename);
  
  if (window.Toast) {
    Toast.success(`CSV exportado: ${filename}`);
  } else {
    alert(`CSV exportado: ${filename}`);
  }
}

// Exportar global
window.exportStrategyToCSV = exportStrategyToCSV;
window.exportFullStrategyToCSV = exportFullStrategyToCSV;
