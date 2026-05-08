# 06 - GOOGLE ADS PROJECT: DESIGN E ARQUITETURA

## 📋 Versão
**v1.0** | Data: 2026-05-08 | Status: Pronto para Implementação pelo Roo Code

---

## 🎯 OBJETIVO
Criar um módulo dentro do LANDINGAI que gera estratégias de Google Ads automaticamente, puxando contexto da Landing Page criada, e oferece otimização baseada em relatórios reais.

---

## 📐 ARQUITETURA GERAL

### Estrutura de Pastas
```
modules/
├── google-ads/
│   ├── index.html (novo arquivo - integração)
│   ├── google-ads.js (controller principal)
│   ├── 01-ga-handlers.js (event listeners)
│   ├── 02-ga-api.js (chamadas IA)
│   ├── 03-ga-ui.js (renderização)
│   ├── 04-ga-export.js (CSV export)
│   ├── styles/
│   │   └── google-ads.css (estilo do módulo)
│   └── README.md (documentação)
```

### Fluxo Geral
```
Landing Page → Google Ads Project
     ↓
   [Modo 1: Criação]  ou  [Modo 2: Otimização]
     ↓                           ↓
   JSON Strategy          JSON Action Plan
     ↓                           ↓
  Frontend Render         Frontend Dashboard
     ↓                           ↓
  Copy-Paste Cards      Copy-Paste Actions
     ↓                           ↓
  CSV Export            Apply Manual
```

---

## 🏗️ MODO 1: CRIAÇÃO DE ESTRATÉGIA (Setup)

### 1.1 Interface de Input

**Campos Obrigatórios:**
```html
<div class="ga-input-section">
  <button id="btn-pull-context">
    📥 Puxar Contexto da Landing Page
  </button>
  
  <div class="ga-form-group">
    <label>Verba Mensal Total (R$)</label>
    <input type="number" id="budget-total" min="100" step="100" placeholder="1000">
  </div>
  
  <div class="ga-form-group">
    <label>Geolocalização</label>
    <select id="location">
      <option>Brasil Inteiro</option>
      <option>Região específica</option>
      <option>Cidade específica</option>
    </select>
    <input type="text" id="location-value" placeholder="Ex: São Paulo, SP">
  </div>
  
  <div class="ga-form-group">
    <label>Meta Principal</label>
    <select id="main-goal">
      <option value="leads">Gerar Leads</option>
      <option value="calls">Receber Chamadas</option>
      <option value="bookings">Agendar Consultas</option>
      <option value="sales">Vender Produto</option>
    </select>
  </div>
  
  <div class="ga-form-group">
    <label>URL da Landing Page (ou Print/Screenshot)</label>
    <input type="text" id="lp-url" placeholder="https://exemplo.com">
    <input type="file" id="lp-screenshot" accept="image/*">
    <small>Cole a URL OU faça upload de um print da página</small>
  </div>
  
  <button id="btn-generate-strategy" class="btn-primary">
    ⚙️ Gerar Estratégia com IA
  </button>
</div>
```

### 1.2 Lógica de Puxar Contexto

**Função: `pullContextFromLP()`**

```javascript
// Em 02-ga-api.js

function pullContextFromLP() {
  // 1. Puxa do localStorage
  const briefing = JSON.parse(localStorage.getItem('briefing_bruto')) || {};
  const lpUrl = localStorage.getItem('lp_url') || '';
  
  // 2. Retorna objeto
  return {
    cliente_nome: briefing.client_name || 'Cliente',
    servico_descricao: briefing.service_description || '',
    proposta_valor: briefing.value_proposition || '',
    publico_alvo: briefing.target_audience || '',
    restricoes: briefing.restrictions || '',
    tom_identidade: briefing.tone_identity || '',
    lp_url: lpUrl,
    estrutura_blocos: JSON.parse(localStorage.getItem('generated_structure')) || []
  };
}
```

### 1.3 JSON de Saída da IA (Strategy)

```json
{
  "id": "ga-strategy-20250508-001",
  "timestamp": "2025-05-08T14:30:00Z",
  "analise_inicial": {
    "budget_mensal": 1500,
    "recomendacao_rede": "Pesquisa (80%) + YouTube (20%)",
    "justificativa_