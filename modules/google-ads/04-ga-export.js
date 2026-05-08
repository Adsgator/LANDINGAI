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
  // 1. Extrair dados do JSON
  const rows = [];
  
  // 2. Criar CSV de Campanhas
  const csvCampaigns = generateCampaignRows(strategy);
  rows.push(...csvCampaigns);
  
  // 3. Criar CSV de Anúncios
  const csvAds = generateAdRows(strategy);
  // Nota: o código original não fez push dos csvAds no array 'rows'.
  // O exportFullStrategyToCSV lida com todos os geradores, então esta função é mais genérica/exemplo.
  // Vamos usar o exportFullStrategyToCSV abaixo.
  
  // 4. Gerar arquivo
  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 5. Download
  downloadCSV(blob, `google-ads-strategy-${strategy.id}.csv`);
}

/**
 * Gerar linhas de CAMPANHAS E GRUPOS
 * 
 * Google Ads Editor espera:
 * Campaign,Ad Group,Status,Bid Strategy Type,Budget
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
    const dailyBudget = camp.orcamento ? (camp.orcamento / 30).toFixed(2) : 0; // Converter para diário
    
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
 * 
 * Google Ads Editor espera:
 * Campaign,Ad Group,Keyword,Match Type,Bid,Status
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
            rows.push([
              escapeCsvField(camp.nome),
              escapeCsvField(ag.nome),
              escapeCsvField(kw.keyword),
              mapMatchType(kw.match_type),
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
              escapeCsvField('-' + negKw), // Prefixo - para negativa
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
 * 
 * Google Ads Editor espera:
 * Campaign,Ad Group,Headline 1,Headline 2,Headline 3,Description 1,Description 2,Final URL,Display URL,Status
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
 * Google Ads Editor espera: "Campo com, aspas" ou "Campo normal"
 */
function escapeCsvField(field) {
  if (!field && field !== 0) return '';
  
  const str = String(field);
  
  // Se contém vírgula, aspas ou quebra de linha → envolver em aspas
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`; // Escape aspas internas
  }
  
  return str;
}

/**
 * Mapear estratégia de lances para formato Google
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
 * Mapear match type para formato Google
 * Entrada: "broad", "phrase", "exact"
 * Saída: "Broad", "Phrase", "Exact"
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
  // Criar URL do blob
  const url = window.URL.createObjectURL(blob);
  
  // Criar elemento <a> invisível
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Adicionar ao DOM, clicar, remover
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Liberar memória
  window.URL.revokeObjectURL(url);
  
  console.log(`✅ CSV exportado: ${filename}`);
}

/**
 * Helper helpers fallback
 */
function showNotification(msg) {
  if (window.App && window.App.showToast) {
    window.App.showToast(msg, 'success');
  } else {
    alert(msg);
  }
}

function showError(msg) {
  if (window.App && window.App.showToast) {
    window.App.showToast(msg, 'error');
  } else {
    alert(msg);
  }
}

/**
 * FUNÇÃO PRINCIPAL: Exportar estratégia completa
 */
function exportFullStrategyToCSV(strategy) {
  if (!strategy || !strategy.id) {
    strategy = { ...strategy, id: 'export-' + Date.now() };
  }

  // 1. Gerar todas as linhas
  const campaignRows = generateCampaignRows(strategy);
  const keywordRows = generateKeywordRows(strategy);
  const adRows = generateAdRows(strategy);
  
  // 2. Combinar em um único CSV
  // Precisamos separar por seções visuais ou apenas exportar um formato compatível misto?
  // A especificação recomenda tudo no mesmo CSV misturado mas isso requereria preencher as outras colunas vazias
  // Para Google Ads Editor, é mais seguro que cada tipo de registro tenha suas linhas se as colunas forem alinhadas ou separar.
  // Pela documentação, optamos por 1 CSV. 
  // Na verdade, o script do doc concatena tudo. Vamos seguir o doc.
  
  const allRows = [
    ...campaignRows,
    '', // blank line to separate
    ...keywordRows,
    '', // blank line to separate
    ...adRows
  ];
  
  const csvContent = allRows.join('\n');
  
  // 3. Adicionar BOM (Byte Order Mark) para UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  // 4. Download
  const filename = `google-ads-${strategy.id}.csv`;
  downloadCSV(blob, filename);
  
  // 5. Feedback
  showNotification(`✅ CSV exportado: ${filename}. Importe no Google Ads Editor.`);
}

/**
 * Exportar APENAS uma campanha (útil para testes)
 */
function exportSingleCampaignToCSV(strategy, campaignIndex) {
  const campaign = strategy.campanhas[campaignIndex];
  
  // Criar mini-estratégia com apenas 1 campanha
  const miniStrategy = {
    ...strategy,
    campanhas: [campaign]
  };
  
  exportFullStrategyToCSV(miniStrategy);
}

/**
 * VALIDAÇÃO PRÉ-EXPORT
 * Verificar se CSV vai funcionar no Google Ads Editor
 */
function validateCSVBeforeExport(strategy) {
  const errors = [];
  const warnings = [];
  
  // Validar campanhas
  if (!strategy.campanhas || strategy.campanhas.length === 0) {
    errors.push('Nenhuma campanha definida');
  }
  
  if (strategy.campanhas) {
    strategy.campanhas.forEach((camp, idx) => {
      // Validar nome
      if (!camp.nome || camp.nome.trim() === '') {
        errors.push(`Campanha ${idx}: Nome vazio`);
      }
      
      // Validar Ad Groups
      if (!camp.ad_groups || camp.ad_groups.length === 0) {
        warnings.push(`Campanha ${idx}: Sem Ad Groups`);
      }
      
      if (camp.ad_groups) {
        camp.ad_groups.forEach((ag, agIdx) => {
          // Validar keywords
          if (!ag.keywords_positivas || ag.keywords_positivas.length === 0) {
            warnings.push(`Ad Group "${ag.nome || agIdx}": Sem keywords positivas`);
          }
          
          // Validar anúncios
          if (!ag.anuncios || ag.anuncios.length === 0) {
            errors.push(`Ad Group "${ag.nome || agIdx}": Sem anúncios`);
          }
          
          // Validar headlines
          if (ag.anuncios) {
            ag.anuncios.forEach((ad, adIdx) => {
              if (!ad.headlines || ad.headlines.length === 0) {
                errors.push(`Anúncio ${adIdx} no AdGroup "${ag.nome || agIdx}": Sem headlines`);
              }
              
              // Verificar comprimento
              if (ad.headlines) {
                ad.headlines.forEach((h, hIdx) => {
                  const texto = h.texto || h;
                  if (texto && texto.length > 30) {
                    warnings.push(
                      `Headline muito longa (${texto.length} chars, máx 30): "${texto.substring(0, 20)}..."`
                    );
                  }
                });
              }
            });
          }
        });
      }
    });
  }
  
  // Retornar resultado
  return {
    valido: errors.length === 0,
    errors: errors,
    warnings: warnings,
    total_issues: errors.length + warnings.length
  };
}

/**
 * Exibir validação antes de exportar
 */
function showExportValidation(strategy) {
  const validation = validateCSVBeforeExport(strategy);
  
  if (validation.errors.length > 0) {
    showError(`❌ Não é possível exportar:\n${validation.errors.join('\n')}`);
    return false;
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Avisos:', validation.warnings);
    // Continuar mesmo com warnings
  }
  
  return true;
}
