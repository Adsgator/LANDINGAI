# 📥 GOOGLE ADS — CSV Export Engine

**Versão:** 1.0.0  
**Data:** 2026-05-08  
**Status:** Pronto para Implementação pelo Roo Code

---

## 🎯 **Objetivo**

Converter o JSON gerado pela IA em arquivo CSV **100% compatível** com Google Ads Editor, permitindo import direto sem ajustes manuais.

---

## ⚠️ **Por que não exportar JSON direto?**

Google Ads Editor espera formato CSV muito específico com:
- Colunas em inglês exato (Campaign, Ad Group, Keyword, etc)
- Valores em formato específico (Match Types, Bid Amounts, etc)
- Linhas sem erros de encoding
- Headers em ordem exata

Se a IA gerasse CSV direto → risco alto de erros de formatação → import falha

**Solução:** IA gera JSON limpo → JavaScript converte → CSV perfeito

---

## 📊 **Mapeamento: JSON → CSV**

### **Estrutura Google Ads Editor CSV**

O CSV de campanhas tem esta estrutura:

```csv
Campaign,Ad Group,Keyword,Match Type,Bid,Landing Page
Campanha 1,Grupo 1,palavra-chave,Exact,2.50,https://url.com
Campanha 1,Grupo 1,outra-palavra,Phrase,2.30,https://url.com
```

### **Headlines e Descriptions (em colunas separadas)**

```csv
Campaign,Ad Group,Headline 1,Headline 2,Headline 3,Description 1,Description 2
Campanha 1,Grupo 1,Texto 1,Texto 2,Texto 3,Desc 1,Desc 2
```

---

## 🔧 **IMPLEMENTAÇÃO**

### **Arquivo:** `modules/google-ads/04-ga-export.js`

```javascript
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
  
  // Dados
  strategy.campanhas.forEach(camp => {
    const dailyBudget = (camp.orcamento / 30).toFixed(2); // Converter para diário
    
    camp.ad_groups.forEach(ag => {
      rows.push([
        escapeCsvField(camp.nome),
        escapeCsvField(ag.nome),
        'Enabled',
        escapeStrategy(ag.estrategia_lances),
        dailyBudget
      ].join(','));
    });
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
  
  // Dados
  strategy.campanhas.forEach(camp => {
    camp.ad_groups.forEach(ag => {
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
      
      // Palavras negativas
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
    });
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
  
  // Dados
  strategy.campanhas.forEach(camp => {
    camp.ad_groups.forEach(ag => {
      if (ag.anuncios && ag.anuncios.length > 0) {
        ag.anuncios.forEach(ad => {
          // Headlines (máx 3)
          const h1 = ad.headlines[0]?.texto || '';
          const h2 = ad.headlines[1]?.texto || '';
          const h3 = ad.headlines[2]?.texto || '';
          
          // Descriptions (máx 2)
          const d1 = ad.descriptions[0]?.texto || '';
          const d2 = ad.descriptions[1]?.texto || '';
          
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
  });
  
  return rows;
}

/**
 * Escapar aspas e caracteres especiais em campo CSV
 * Google Ads Editor espera: "Campo com, aspas" ou "Campo normal"
 */
function escapeCsvField(field) {
  if (!field) return '';
  
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
  const map = {
    'broad': 'Broad',
    'phrase': 'Phrase',
    'exact': 'Exact',
    'broad_modified': 'Broad Match Modifier'
  };
  
  return map[type] || 'Broad';
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
 * FUNÇÃO PRINCIPAL: Exportar estratégia completa
 */
function exportFullStrategyToCSV(strategy) {
  // 1. Gerar todas as linhas
  const campaignRows = generateCampaignRows(strategy);
  const keywordRows = generateKeywordRows(strategy);
  const adRows = generateAdRows(strategy);
  
  // 2. Combinar em um único CSV
  const allRows = [
    ...campaignRows,
    ...keywordRows,
    ...adRows
  ];
  
  const csvContent = allRows.join('\n');
  
  // 3. Adicionar BOM (Byte Order Mark) para UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  // 4. Download
  const filename = `google-ads-${strategy.id.split('-')[2]}.csv`;
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
  
  strategy.campanhas.forEach((camp, idx) => {
    // Validar nome
    if (!camp.nome || camp.nome.trim() === '') {
      errors.push(`Campanha ${idx}: Nome vazio`);
    }
    
    // Validar Ad Groups
    if (!camp.ad_groups || camp.ad_groups.length === 0) {
      warnings.push(`Campanha ${idx}: Sem Ad Groups`);
    }
    
    camp.ad_groups.forEach((ag, agIdx) => {
      // Validar keywords
      if (!ag.keywords_positivas || ag.keywords_positivas.length === 0) {
        warnings.push(`Ad Group "${ag.nome}": Sem keywords positivas`);
      }
      
      // Validar anúncios
      if (!ag.anuncios || ag.anuncios.length === 0) {
        errors.push(`Ad Group "${ag.nome}": Sem anúncios`);
      }
      
      // Validar headlines
      ag.anuncios?.forEach((ad, adIdx) => {
        if (!ad.headlines || ad.headlines.length === 0) {
          errors.push(`Anúncio ${adIdx}: Sem headlines`);
        }
        
        // Verificar comprimento
        ad.headlines?.forEach((h, hIdx) => {
          if (h.texto && h.texto.length > 30) {
            warnings.push(
              `Headline muito longa (${h.texto.length} chars, máx 30): "${h.texto.substring(0, 20)}..."`
            );
          }
        });
      });
    });
  });
  
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
```

---

## 🧪 **EXEMPLOS DE OUTPUT**

### **CSV Input (o que Google Ads Editor espera)**

```csv
Campaign,Ad Group,Keyword,Match Type,Bid,Status
Search - Serviço Principal,Serviço - Alto Intento,psicólogo sp,Broad,3.00,Enabled
Search - Serviço Principal,Serviço - Alto Intento,terapia online são paulo,Phrase,2.80,Enabled
Search - Serviço Principal,Serviço - Alto Intento,psicologia clínica sp,Exact,2.50,Enabled
Search - Serviço Principal,Serviço - Alto Intento,-grátis,Broad,,Enabled
Search - Serviço Principal,Serviço - Alto Intento,-curso,Broad,,Enabled
Search - Serviço Principal,Marca,[Dr. Silva Psicólogo],Exact,1.50,Enabled
```

### **Anúncios CSV**

```csv
Campaign,Ad Group,Headline 1,Headline 2,Headline 3,Description 1,Description 2,Final URL,Status
Search - Serviço Principal,Serviço - Alto Intento,Psicólogo em SP - Atendimento Online,Terapia Personalizada para Seu Bem-Estar,Agende Sua Consulta Hoje,Atendimento presencial e online. Especialista em ansiedade e depressão.,Primeira consulta com desconto. Metodologia comprovada.,https://exemplo.com/psicologia,Enabled
```

---

## 🔗 **Integração no Fluxo**

### **Arquivo:** `modules/google-ads/03-ga-ui.js`

Adicionar botão de export:

```javascript
/**
 * Adicionar botão de export na renderização
 */
function addExportButton(strategy) {
  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn btn-primary btn-large';
  exportBtn.innerHTML = '📥 Exportar para CSV (Google Ads Editor)';
  
  exportBtn.onclick = () => {
    // Validar antes
    if (showExportValidation(strategy)) {
      exportFullStrategyToCSV(strategy);
    }
  };
  
  document.getElementById('ga-strategy-output').appendChild(exportBtn);
}
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### Fase 1: Funções Base
- [ ] `escapeCsvField()` implementada
- [ ] `mapMatchType()` implementada
- [ ] `downloadCSV()` funcional

### Fase 2: Geradores
- [ ] `generateCampaignRows()` funciona
- [ ] `generateKeywordRows()` funciona
- [ ] `generateAdRows()` funciona

### Fase 3: Export Completo
- [ ] `exportFullStrategyToCSV()` gera arquivo
- [ ] BOM UTF-8 adicionado
- [ ] Filename é único

### Fase 4: Validação
- [ ] `validateCSVBeforeExport()` testa todos os campos
- [ ] `showExportValidation()` exibe erros
- [ ] Avisos são mostrados mas não bloqueiam

### Fase 5: Testes
- [ ] Exportar CSV de teste
- [ ] Abrir em editor de texto → verificar formatação
- [ ] Importar no Google Ads Editor → deve aceitar sem erros
- [ ] 3 testes com briefings diferentes

---

## 🚨 **Casos de Erro Comuns**

| Problema | Causa | Solução |
|----------|-------|---------|
| CSV não abre | Encoding errado | Adicionar BOM UTF-8 |
| Caracteres estranhos | Aspas não escapadas | Usar `escapeCsvField()` |
| Import falha | Headers em ordem errada | Validar ordem das colunas |
| Valores vazios | Campos opcionais não preenchidos | Validação pré-export |
| Acentos quebrados | CSV com encoding latin1 | Forçar UTF-8 |

---

## 📊 **Estrutura Completa do CSV**

Google Ads Editor importa através de 3 CSVs separados (ou 1 único):

### **Opção 1: Arquivo Único (Recomendado)**
```
Campaign,Ad Group,Keyword,Match Type,Bid,Headline 1,Description 1,...
[Todos os dados em um só CSV]
```

### **Opção 2: 3 Arquivos Separados (Se preferir)**
1. **campaigns.csv** → Campanhas + Budget
2. **ad_groups.csv** → Grupos + Estratégia
3. **ads_keywords.csv** → Anúncios + Keywords

**Nossa implementação:** Opção 1 (mais simples)

---

## 🎯 **Validação Final**

Quando usuário clicar "Exportar para CSV":

1. ✅ Validar se estrutura está completa
2. ✅ Gerar CSV com formatação correta
3. ✅ Adicionar BOM UTF-8
4. ✅ Download automático
5. ✅ Mostrar mensagem de sucesso
6. ✅ Instruções: "Cole o arquivo no Google Ads Editor"

---

**FIM DO DOCUMENTO 7**

## 🎉 **TODOS OS 7 DOCUMENTOS COMPLETOS!**

Você agora tem uma série completa de documentação pronta para implementação:

1. ✅ **01-LANDINGAI-AUDIT-E-MELHORIAS.md** — Bugs e melhorias operacionais
2. ✅ **02-LANDINGAI-GENERATOR-ESTRUTURA.md** — Gerador inteligente de estrutura
3. ✅ **03-LANDINGAI-RESPECTS-RESTRICOES.md** — Validação de restrições
4. ✅ **04-LANDINGAI-UNIFIED-API.md** — API unificada OpenAI/OpenRouter
5. ✅ **05-LANDINGAI-PROMPT-BLINDAGEM.md** — System Prompt blindado
6. ✅ **06-GOOGLEADS-PROJECT-DESIGN.md** — Arquitetura GA completa
7. ✅ **07-GOOGLEADS-CSV-EXPORT-ENGINE.md** — CSV export engine

**Próximo passo:** Passar tudo para o Roo Code implementar! 🚀
