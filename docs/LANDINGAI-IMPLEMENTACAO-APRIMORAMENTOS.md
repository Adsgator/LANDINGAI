# LandingAI — Documento de Implementação Completo
> **Para o Roo Code.**
> Implemente tudo nesta ordem. Cada seção é auto-suficiente.
> Não invente nada além do que está aqui.

---

## ORDEM DE EXECUÇÃO

1. Mapeamento de campos — `00-config.js`
2. Wireframe visual melhorado — `screens/estrutura.js`
3. Integração Gemini Image — `02-api.js`
4. DOC-1 auto-suficiente — `00-config.js` (buildDoc1)
5. Prompt DOC-IMPL auto-suficiente — `00-config.js` (buildImplPrompt)
6. Correções UI/UX — `03-ui.js` + CSS
7. Exclusão de arquivos obsoletos

---

## 1. MAPEAMENTO DE CAMPOS — AI PREENCHE TUDO

### 1.1 Onde implementar
`assets/js/00-config.js` — função `runIntakeAnalysis()` (ou equivalente que processa o intake)

### 1.2 Problema atual
A IA analisa o intake e preenche campos parcialmente. Precisa mapear TODOS os campos de TODOS os steps de uma vez.

### 1.3 Substituir o prompt de análise de intake por este

```javascript
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
    "nome_marca": "",
    "nicho": "",
    "segmento": "",
    "cidade": "",
    "estado": "",
    "proposta_valor": "",
    "missao": "",
    "anos_experiencia": "",
    "formacao": "",
    "certificacoes": ""
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
    "gatilhos_mentais": ""
  },
  "step3": {
    "servico_principal": "",
    "servico_descricao": "",
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
    "servicos_adicionais": ""
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
    "midia_aparicoes": ""
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
    "atendimento_diferenciado": ""
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
    "horario_atendimento": ""
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
    "video_disponivel": ""
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
`;
},
```

### 1.4 Função para aplicar o JSON retornado em todos os steps

```javascript
async applyIntakeJSON(jsonString) {
  let data;
  try {
    const clean = jsonString.replace(/```json|```/g, '').trim();
    data = JSON.parse(clean);
  } catch (e) {
    this.showToast('Erro ao interpretar resposta da IA. Tente novamente.', 'error');
    return;
  }

  // Mapeia cada campo do JSON para o state
  const B = this.state.briefing;
  const steps = ['step1','step2','step3','step4','step5','step6','step7','step8'];

  steps.forEach(step => {
    if (!data[step]) return;
    Object.entries(data[step]).forEach(([campo, valor]) => {
      if (valor !== '' && valor !== null && valor !== undefined) {
        B[campo] = valor;
      }
    });
  });

  // Atualiza segmento do projeto na sidebar
  if (data.step1?.nicho) {
    this.state.projeto_segmento = data.step1.nicho;
    document.getElementById('project-segment').textContent = data.step1.nicho;
  }

  this.saveState();
  this.updateProgressBar();
  this.renderStepsNav();
  this.showToast('IA preencheu todos os campos disponíveis!', 'success');
},
```

### 1.5 Fluxo de chamada — substituir o runIntakeAnalysis atual

```javascript
async runIntakeAnalysis() {
  const briefing = this.state.briefing?.intake_raw || '';
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
    { id: 1, icon: 'file-text',    label: 'Lendo briefing...' },
    { id: 2, icon: 'cpu',          label: 'Extraindo todos os dados...' },
    { id: 3, icon: 'layers',       label: 'Mapeando campos dos steps...' },
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

    this.closeAILog();
    this.renderScreen();
    this.showToast('✓ Briefing analisado — ' + this.countFilledFields() + ' campos preenchidos!', 'success');
  } catch (err) {
    this.closeAILog();
    this.showToast('Erro na análise: ' + err.message, 'error');
  }
},

countFilledFields() {
  const B = this.state.briefing || {};
  return Object.values(B).filter(v => v && String(v).trim()).length;
},
```

---

## 2. WIREFRAME VISUAL — ESTRUTURA + COPY COMPLETA

### 2.1 O que precisa mudar

O wireframe atual é minimalista demais — só mostra os nomes dos blocos. Precisa mostrar:
- Layout visual de cada bloco (hero, 2 colunas, grid, etc)
- A copy gerada pela IA dentro de cada bloco
- Indicadores visuais por tipo de bloco
- Painel de revisão lateral com a copy completa de cada bloco

### 2.2 Substituir `gerarWireframeHTML()` em `screens/estrutura.js`

```javascript
gerarWireframeHTML(estruturaText) {
  // Parseia os blocos da estrutura
  const blocoRegex = /### BLOCO \d+: (.+?)\n([\s\S]*?)(?=### BLOCO \d+:|### SEQUÊNCIA|$)/g;
  const blocos = [];
  let match;

  while ((match = blocoRegex.exec(estruturaText)) !== null) {
    const nome = match[1].trim();
    const corpo = match[2];

    const objetivoMatch = corpo.match(/\*\*Objetivo narrativo:\*\*\s*(.+?)(?=\n\*\*|$)/s);
    const tituloMatch   = corpo.match(/[-•]\s*Título:\s*"?(.+?)"?\n/);
    const subMatch      = corpo.match(/[-•]\s*Subtítulo:\s*"?(.+?)"?\n/);
    const ctaMatch      = corpo.match(/[-•]\s*CTA[^:]*:\s*"?(.+?)"?\n/);

    blocos.push({
      nome,
      objetivo: objetivoMatch?.[1]?.trim() || '',
      titulo:   tituloMatch?.[1]?.trim()   || '',
      subtitulo: subMatch?.[1]?.trim()     || '',
      cta:      ctaMatch?.[1]?.trim()      || '',
    });
  }

  if (blocos.length === 0) return '<div class="wireframe-placeholder">Estrutura não reconhecida. Verifique o formato gerado.</div>';

  const blocosHTML = blocos.map((bloco, i) => {
    const tipo = detectarTipoBloco(bloco.nome);
    return renderBlocoWireframe(bloco, i, tipo);
  }).join('');

  return `<div class="wireframe-device">${blocosHTML}</div>`;
},
```

### 2.3 Adicionar funções auxiliares de wireframe (mesmo arquivo)

```javascript
function detectarTipoBloco(nome) {
  const n = nome.toLowerCase();
  if (n.includes('cabeçalho') || n.includes('header') || n.includes('nav')) return 'header';
  if (n.includes('hero'))       return 'hero';
  if (n.includes('como funciona') || n.includes('passo')) return 'steps';
  if (n.includes('diferencial')) return 'features';
  if (n.includes('plano') || n.includes('preço')) return 'pricing';
  if (n.includes('depoimento') || n.includes('prova')) return 'testimonials';
  if (n.includes('avaliação') || n.includes('google')) return 'reviews';
  if (n.includes('faq')) return 'faq';
  if (n.includes('contato') || n.includes('formulário')) return 'contact';
  if (n.includes('cta') || n.includes('chamada final')) return 'cta';
  if (n.includes('localização') || n.includes('mapa')) return 'map';
  if (n.includes('instagram') || n.includes('feed')) return 'instagram';
  if (n.includes('rodapé') || n.includes('footer')) return 'footer';
  return 'generic';
}

function renderBlocoWireframe(bloco, index, tipo) {
  const cores = {
    header:       { bg: '#1e293b', label: '#94a3b8', accent: '#3b82f6' },
    hero:         { bg: '#0f172a', label: '#64748b', accent: '#6366f1' },
    steps:        { bg: '#f8fafc', label: '#475569', accent: '#0ea5e9' },
    features:     { bg: '#f1f5f9', label: '#475569', accent: '#8b5cf6' },
    pricing:      { bg: '#fafafa', label: '#64748b', accent: '#f59e0b' },
    testimonials: { bg: '#f8fafc', label: '#64748b', accent: '#10b981' },
    reviews:      { bg: '#ffffff', label: '#64748b', accent: '#f59e0b' },
    faq:          { bg: '#f8fafc', label: '#64748b', accent: '#6366f1' },
    contact:      { bg: '#f1f5f9', label: '#64748b', accent: '#10b981' },
    cta:          { bg: '#0f172a', label: '#94a3b8', accent: '#f59e0b' },
    map:          { bg: '#e2e8f0', label: '#475569', accent: '#ef4444' },
    instagram:    { bg: '#fdf2f8', label: '#9d4edd', accent: '#ec4899' },
    footer:       { bg: '#1e293b', label: '#64748b', accent: '#475569' },
    generic:      { bg: '#f8fafc', label: '#475569', accent: '#6366f1' },
  };

  const cor = cores[tipo] || cores.generic;
  const isDark = ['header','hero','cta','footer'].includes(tipo);
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const subColor  = isDark ? '#94a3b8' : '#64748b';

  const innerLayouts = {
    header: `
      <div style="display:flex;justify-content:space-between;align-items:center;width:100%;padding:0 12px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <div style="width:18px;height:18px;background:${cor.accent};border-radius:3px;opacity:0.8;"></div>
          <div style="width:60px;height:8px;background:${isDark ? '#475569' : '#cbd5e1'};border-radius:4px;"></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <div style="width:30px;height:6px;background:${isDark ? '#475569' : '#cbd5e1'};border-radius:3px;"></div>
          <div style="width:30px;height:6px;background:${isDark ? '#475569' : '#cbd5e1'};border-radius:3px;"></div>
          <div style="background:${cor.accent};padding:3px 10px;border-radius:3px;font-size:7px;color:#fff;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;">${bloco.cta || 'CTA'}</div>
        </div>
      </div>`,

    hero: `
      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:8px 16px;width:100%;">
        <div style="font-size:11px;font-weight:800;color:${textColor};line-height:1.3;max-width:200px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${bloco.titulo || 'Título Principal'}</div>
        <div style="font-size:8px;color:${subColor};max-width:180px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${bloco.subtitulo || 'Subtítulo de apoio'}</div>
        <div style="background:${cor.accent};padding:6px 16px;border-radius:3px;font-size:8px;font-weight:700;color:#fff;margin-top:4px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${bloco.cta || 'CTA Principal'}</div>
        <div style="display:flex;gap:6px;margin-top:4px;">
          <div style="width:60px;height:40px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:3px;opacity:0.6;"></div>
          <div style="width:60px;height:40px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:3px;opacity:0.4;"></div>
        </div>
      </div>`,

    steps: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:8px;">${bloco.titulo || 'Como Funciona'}</div>
        <div style="display:flex;gap:6px;justify-content:center;">
          ${[1,2,3,4].map(n => `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;">
            <div style="width:20px;height:20px;background:${cor.accent};border-radius:50%;font-size:8px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;">${n}</div>
            <div style="width:100%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;"></div>
            <div style="width:70%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;opacity:0.6;"></div>
          </div>`).join('')}
        </div>
      </div>`,

    features: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:8px;">${bloco.titulo || 'Diferenciais'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
          ${[1,2,3,4].map(() => `<div style="background:${isDark ? '#1e293b' : '#ffffff'};border-radius:4px;padding:5px;display:flex;flex-direction:column;gap:2px;">
            <div style="width:14px;height:14px;background:${cor.accent};border-radius:3px;opacity:0.7;"></div>
            <div style="width:80%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;"></div>
            <div style="width:100%;height:3px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;opacity:0.6;"></div>
          </div>`).join('')}
        </div>
      </div>`,

    pricing: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:8px;">${bloco.titulo || 'Planos'}</div>
        <div style="display:flex;gap:5px;">
          ${[1,2,3].map((n, i) => `<div style="flex:1;background:${i===1 ? cor.accent : '#ffffff'};border:${i===1 ? 'none' : '1px solid #e2e8f0'};border-radius:4px;padding:5px;display:flex;flex-direction:column;gap:3px;align-items:center;">
            <div style="width:70%;height:4px;background:${i===1 ? 'rgba(255,255,255,0.4)' : '#e2e8f0'};border-radius:2px;"></div>
            <div style="font-size:9px;font-weight:800;color:${i===1 ? '#fff' : textColor};">R$${n*300}</div>
            <div style="width:80%;height:3px;background:${i===1 ? 'rgba(255,255,255,0.3)' : '#e2e8f0'};border-radius:2px;"></div>
          </div>`).join('')}
        </div>
      </div>`,

    testimonials: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:6px;">${bloco.titulo || 'Depoimentos'}</div>
        <div style="display:flex;gap:5px;">
          ${[1,2].map(() => `<div style="flex:1;background:#ffffff;border-radius:4px;padding:6px;border:1px solid #e2e8f0;">
            <div style="display:flex;gap:2px;margin-bottom:3px;">${[1,2,3,4,5].map(() => '<span style="color:#f59e0b;font-size:8px;">★</span>').join('')}</div>
            <div style="width:100%;height:3px;background:#e2e8f0;border-radius:2px;margin-bottom:2px;"></div>
            <div style="width:80%;height:3px;background:#e2e8f0;border-radius:2px;opacity:0.7;margin-bottom:4px;"></div>
            <div style="display:flex;align-items:center;gap:3px;">
              <div style="width:12px;height:12px;background:#e2e8f0;border-radius:50%;"></div>
              <div style="width:40px;height:3px;background:#e2e8f0;border-radius:2px;"></div>
            </div>
          </div>`).join('')}
        </div>
      </div>`,

    cta: `
      <div style="display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:8px 16px;width:100%;">
        <div style="font-size:10px;font-weight:800;color:${textColor};line-height:1.3;max-width:200px;">${bloco.titulo || 'CTA Final'}</div>
        <div style="font-size:8px;color:${subColor};max-width:160px;">${bloco.subtitulo || 'Subtítulo'}</div>
        <div style="background:${cor.accent};padding:6px 20px;border-radius:3px;font-size:8px;font-weight:700;color:#fff;margin-top:4px;">${bloco.cta || 'Botão CTA'}</div>
      </div>`,

    faq: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};margin-bottom:6px;">${bloco.titulo || 'FAQ'}</div>
        ${[1,2,3].map(() => `<div style="border-bottom:1px solid #e2e8f0;padding:5px 0;display:flex;justify-content:space-between;align-items:center;">
          <div style="width:75%;height:4px;background:#e2e8f0;border-radius:2px;"></div>
          <div style="font-size:10px;color:#94a3b8;">›</div>
        </div>`).join('')}
      </div>`,

    footer: `
      <div style="width:100%;padding:6px 12px;display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;flex-direction:column;gap:3px;">
          <div style="width:50px;height:6px;background:#334155;border-radius:2px;"></div>
          <div style="width:70px;height-4px;height:4px;background:#334155;border-radius:2px;opacity:0.5;"></div>
        </div>
        <div style="display:flex;gap:5px;">
          ${[1,2,3].map(() => `<div style="width:16px;height:16px;background:#334155;border-radius:50%;opacity:0.5;"></div>`).join('')}
        </div>
      </div>`,

    generic: `
      <div style="width:100%;padding:4px 12px;">
        <div style="font-size:9px;font-weight:700;color:${textColor};text-align:center;margin-bottom:6px;">${bloco.titulo || bloco.nome}</div>
        <div style="width:100%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;margin-bottom:3px;"></div>
        <div style="width:70%;height:4px;background:${isDark ? '#334155' : '#e2e8f0'};border-radius:2px;opacity:0.6;margin:0 auto;"></div>
      </div>`,
  };

  const innerHTML = innerLayouts[tipo] || innerLayouts.generic;

  return `
    <div class="wf-block-v2" data-index="${index}" data-tipo="${tipo}" style="background:${cor.bg};">
      <div class="wf-block-badge" style="background:${cor.accent};">${index + 1}</div>
      <div class="wf-block-inner">
        ${innerHTML}
      </div>
    </div>`;
}
```

### 2.4 CSS para o wireframe v2 — adicionar em `04-system.css`

```css
/* ── Wireframe V2 ─────────────────────────────────────────── */
.wireframe-device {
  width: 260px;
  margin: 0 auto;
  border: 3px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  background: #0f172a;
  position: relative;
}

.wireframe-device::before {
  content: '';
  display: block;
  width: 60px;
  height: 6px;
  background: #334155;
  border-radius: 3px;
  margin: 10px auto;
}

.wf-block-v2 {
  position: relative;
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  transition: outline 0.15s;
  cursor: pointer;
}

.wf-block-v2:hover {
  outline: 2px solid rgba(99,102,241,0.6);
  outline-offset: -2px;
  z-index: 1;
}

.wf-block-badge {
  position: absolute;
  left: 6px;
  top: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 8px;
  font-weight: 800;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.wf-block-inner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 24px;
}

/* Layout do painel de estrutura */
.estrutura-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: var(--space-6);
  align-items: start;
}

.estrutura-copy-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-height: 70vh;
  overflow-y: auto;
}

.copy-bloco-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  transition: border-color 0.2s;
}

.copy-bloco-card.is-active {
  border-color: var(--accent);
}

.copy-bloco-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.copy-bloco-numero {
  width: 20px;
  height: 20px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.copy-bloco-nome {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.copy-bloco-objetivo {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  font-style: italic;
}

.copy-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: var(--space-2);
}

.copy-field-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.copy-field-value {
  font-size: 12px;
  color: var(--text-primary);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  line-height: 1.4;
}

.copy-field-empty {
  font-size: 12px;
  color: var(--text-disabled);
  font-style: italic;
}

@media (max-width: 900px) {
  .estrutura-layout {
    grid-template-columns: 1fr;
  }
  .wireframe-device {
    width: 200px;
    order: -1;
    margin: 0 auto;
  }
}
```

### 2.5 Atualizar `renderEstrutura()` para usar o novo layout

```javascript
renderEstrutura() {
  const B = this.state.briefing || {};
  const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
  const rascunho = B.estrutura_rascunho || '';
  const aprovada = B.estrutura_aprovada || '';

  // Parseia blocos para o painel de copy
  const blocos = [];
  const blocoRegex = /### BLOCO \d+: (.+?)\n([\s\S]*?)(?=### BLOCO \d+:|### SEQUÊNCIA|$)/g;
  let m;
  while ((m = blocoRegex.exec(rascunho)) !== null) {
    const nome = m[1].trim();
    const corpo = m[2];
    const objetivoMatch = corpo.match(/\*\*Objetivo narrativo:\*\*\s*(.+?)(?=\n\*\*|$)/s);
    const tituloMatch   = corpo.match(/[-•]\s*Título:\s*"?(.+?)"?\n/);
    const subMatch      = corpo.match(/[-•]\s*Subtítulo:\s*"?(.+?)"?\n/);
    const ctaMatch      = corpo.match(/[-•]\s*CTA[^:]*:\s*"?(.+?)"?\n/);
    blocos.push({
      nome,
      objetivo:  objetivoMatch?.[1]?.trim() || '',
      titulo:    tituloMatch?.[1]?.trim()   || '',
      subtitulo: subMatch?.[1]?.trim()      || '',
      cta:       ctaMatch?.[1]?.trim()      || '',
    });
  }

  const copyPanel = rascunho ? blocos.map((b, i) => `
    <div class="copy-bloco-card" data-index="${i}" onclick="document.querySelector('.wf-block-v2[data-index=\\'${i}\\']')?.scrollIntoView({behavior:'smooth'})">
      <div class="copy-bloco-card-header">
        <div class="copy-bloco-numero">${i+1}</div>
        <div class="copy-bloco-nome">${b.nome}</div>
      </div>
      ${b.objetivo ? `<div class="copy-bloco-objetivo">${b.objetivo}</div>` : ''}
      ${b.titulo ? `
        <div class="copy-field">
          <span class="copy-field-label">Título</span>
          <span class="copy-field-value">${b.titulo}</span>
        </div>` : ''}
      ${b.subtitulo ? `
        <div class="copy-field">
          <span class="copy-field-label">Subtítulo</span>
          <span class="copy-field-value">${b.subtitulo}</span>
        </div>` : ''}
      ${b.cta ? `
        <div class="copy-field">
          <span class="copy-field-label">CTA</span>
          <span class="copy-field-value" style="color:var(--accent);font-weight:600;">${b.cta}</span>
        </div>` : ''}
    </div>
  `).join('') : '';

  return `
    <div class="estrutura-wrap">
      ${aprovada ? `
        <div class="status-banner status-success">
          <i data-lucide="check-circle" style="width:14px;height:14px"></i>
          Estrutura aprovada — ${blocos.length} blocos confirmados
        </div>
      ` : ''}

      ${!rascunho ? `
        <div class="estrutura-empty">
          <i data-lucide="layout" style="width:40px;height:40px;color:var(--text-disabled)"></i>
          <p>Clique em "Gerar Estrutura" para a IA propor os blocos e copy da página.</p>
          <div class="estrutura-actions" style="margin-top:var(--space-4)">
            <button class="btn-primary" onclick="App.runEstruturaAnalysis()" ${!hasKey ? 'disabled' : ''}>
              <i data-lucide="sparkles" style="width:15px;height:15px"></i>
              Gerar Estrutura com IA
            </button>
            <button class="btn-ghost" onclick="App.abrirEstruturaManual()">
              <i data-lucide="edit" style="width:14px;height:14px"></i>
              Definir manualmente
            </button>
          </div>
        </div>
      ` : `
        <div class="estrutura-layout">

          <!-- Painel de copy -->
          <div class="estrutura-copy-panel">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);">
              <h3 style="font-size:14px;font-weight:700;">Revisão de Copy — ${blocos.length} blocos</h3>
              <div style="display:flex;gap:var(--space-2);">
                ${!aprovada ? `
                  <button class="btn-ghost btn-sm" onclick="App.runEstruturaAnalysis()">
                    <i data-lucide="refresh-cw" style="width:12px;height:12px"></i> Regerar
                  </button>
                  <button class="btn-primary btn-sm" onclick="App.aprovarEstrutura()">
                    <i data-lucide="check" style="width:12px;height:12px"></i> Aprovar
                  </button>
                ` : `
                  <button class="btn-ghost btn-sm" onclick="App.reabrirEstrutura()">
                    <i data-lucide="edit-2" style="width:12px;height:12px"></i> Reeditar
                  </button>
                `}
              </div>
            </div>
            ${copyPanel}

            <!-- Textarea de edição -->
            <div style="margin-top:var(--space-4);">
              <label class="field-label">Editar estrutura bruta</label>
              <textarea
                class="field-input"
                style="min-height:180px;font-size:11px;font-family:monospace;"
                placeholder="A estrutura gerada aparece aqui para edição livre..."
                oninput="App.setField('estrutura_rascunho', this.value); App.renderScreen();"
              >${rascunho}</textarea>
            </div>
          </div>

          <!-- Wireframe visual -->
          <div style="position:sticky;top:var(--space-4);">
            <div style="font-size:11px;font-weight:600;color:var(--text-secondary);text-align:center;margin-bottom:var(--space-2);text-transform:uppercase;letter-spacing:0.05em;">
              <i data-lucide="monitor" style="width:12px;height:12px"></i> Wireframe
            </div>
            ${B.estrutura_wireframe || '<div class="wireframe-placeholder">Gerando wireframe...</div>'}

            ${hasKey ? `
              <button class="btn-ghost btn-sm" style="width:100%;margin-top:var(--space-3);"
                onclick="App.gerarPrototipoVisual()">
                <i data-lucide="image" style="width:12px;height:12px"></i>
                Gerar protótipo visual com IA
              </button>
            ` : ''}
          </div>

        </div>
      `}

      ${!hasKey ? `<span class="no-key-warn">
        <i data-lucide="alert-triangle" style="width:13px;height:13px"></i>
        Configure uma API Key para usar a geração automática
      </span>` : ''}
    </div>
  `;
},

reabrirEstrutura() {
  this.setField('estrutura_aprovada', '');
  this.renderScreen();
  this.showToast('Estrutura reaberta para edição.', 'info');
},
```

---

## 3. INTEGRAÇÃO GEMINI IMAGE — PROTÓTIPO VISUAL

### 3.1 Contexto

O modelo `gemini-2.5-flash-preview-05-20` suporta geração de imagens via API quando configurado com `responseModalities: ["TEXT", "IMAGE"]`. É gratuito no tier free do Google AI Studio. Usar isso para gerar um protótipo visual real da landing page.

**Nota:** O modelo correto para geração de imagens no Gemini é configurado via `generationConfig.responseModalities`. Verificar disponibilidade na chave do usuário.

### 3.2 Adicionar em `02-api.js`

```javascript
async callGeminiImage(prompt) {
  const key = this.state.apiKeys?.gemini?.trim();
  if (!key) throw new Error('API Key Gemini não configurada.');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: 1,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Erro Gemini Image');
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error('Gemini não retornou imagem. Verifique se sua chave suporta geração de imagens.');
},
```

### 3.3 Função de geração do protótipo — adicionar em `screens/estrutura.js`

```javascript
async gerarPrototipoVisual() {
  const B = this.state.briefing || {};
  const rascunho = B.estrutura_rascunho || '';

  if (!rascunho) {
    this.showToast('Gere a estrutura antes do protótipo visual.', 'warning');
    return;
  }

  const hasGemini = this.state.apiKeys?.gemini?.trim();
  if (!hasGemini) {
    this.showToast('Protótipo visual requer API Key Gemini (gratuita).', 'warning');
    return;
  }

  this.openAILog('Gerando Protótipo Visual', [
    { id: 1, icon: 'layout',  label: 'Preparando estrutura...' },
    { id: 2, icon: 'image',   label: 'Enviando para Gemini Image...' },
    { id: 3, icon: 'sparkles',label: 'Renderizando protótipo...' },
    { id: 4, icon: 'check-circle', label: 'Concluído!' },
  ]);

  try {
    this.aiLogStep(1);
    const cores = B.cor_primaria || '#1e293b';
    const nomeMarca = B.nome_marca || 'Empresa';
    const segmento = B.nicho || 'serviço';

    const prompt = `
Você é um designer UI especializado em landing pages.
Crie um mockup visual de landing page mobile (320x900px) com fundo branco.

MARCA: ${nomeMarca}
SEGMENTO: ${segmento}
COR PRIMÁRIA: ${cores}

ESTRUTURA DA PÁGINA:
${rascunho.substring(0, 3000)}

INSTRUÇÕES DE DESIGN:
- Estilo clean e moderno
- Use a cor primária nos CTAs e destaques
- Renderize cada seção claramente separada
- Mostre os títulos e textos reais da estrutura
- Inclua elementos visuais de placeholder (formas geométricas para imagens)
- CTAs com botões bem visíveis
- Typography hierárquica clara
- Mobile-first (largura 320px)

Gere apenas a imagem do mockup, sem texto explicativo.
`;

    await this.aiLogDelay(300);
    this.aiLogStep(2);

    const imagemBase64 = await this.callGeminiImage(prompt);

    this.aiLogStep(3);
    this.setField('estrutura_prototipo_img', imagemBase64);
    await this.aiLogDelay(500);

    this.aiLogStep(4);
    await this.aiLogDelay(300);
    this.closeAILog();
    this.renderScreen();
    this.showToast('Protótipo visual gerado!', 'success');
  } catch (err) {
    this.closeAILog();
    // Fallback: mostrar mensagem informativa sobre opções
    this.showModalPrototipoFallback(err.message);
  }
},

showModalPrototipoFallback(erroMsg) {
  const opcoes = [
    {
      nome: 'Gemini AI Studio',
      url: 'https://aistudio.google.com',
      gratuito: true,
      descricao: 'Use gemini-2.0-flash-exp para geração de imagens. Cole o prompt do wireframe.',
    },
    {
      nome: 'v0.dev (Vercel)',
      url: 'https://v0.dev',
      gratuito: true,
      descricao: 'Gera componentes React/HTML a partir de descrição. Excelente para protótipos.',
    },
    {
      nome: 'Galileo AI',
      url: 'https://www.usegalileo.ai',
      gratuito: false,
      descricao: 'Protótipos de UI de alta qualidade. Plano pago mas free trial disponível.',
    },
    {
      nome: 'Uizard',
      url: 'https://uizard.io',
      gratuito: true,
      descricao: 'Converte wireframe em design. Plano gratuito disponível.',
    },
  ];

  const html = `
    <div class="modal-body">
      <p style="color:var(--text-secondary);font-size:13px;margin-bottom:var(--space-4);">
        ${erroMsg ? `Erro: ${erroMsg}` : ''}
        Use uma das ferramentas abaixo para gerar o protótipo visual:
      </p>
      ${opcoes.map(o => `
        <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:var(--space-2);">
          <div style="flex:1;">
            <div style="font-weight:700;font-size:13px;">${o.nome}
              ${o.gratuito ? '<span style="background:var(--success-bg,#dcfce7);color:#16a34a;font-size:10px;padding:1px 6px;border-radius:10px;font-weight:600;margin-left:4px;">FREE</span>' : ''}
            </div>
            <div style="font-size:12px;color:var(--text-secondary);">${o.descricao}</div>
          </div>
          <a href="${o.url}" target="_blank" class="btn-ghost btn-sm" style="white-space:nowrap;">
            Abrir <i data-lucide="external-link" style="width:11px;height:11px"></i>
          </a>
        </div>
      `).join('')}
    </div>
  `;

  this.openModal('modal-prototipo-fallback');
  document.getElementById('modal-prototipo-fallback-body').innerHTML = html;
  lucide.createIcons();
},
```

### 3.4 Adicionar modal no `index.html`

```html
<!-- Modal: Protótipo Fallback -->
<div class="modal-overlay" id="modal-prototipo-fallback" style="display:none">
  <div class="modal" style="max-width:480px;">
    <div class="modal-header">
      <h3 class="modal-title">Ferramentas para Protótipo Visual</h3>
      <button class="modal-close" onclick="App.closeModal('modal-prototipo-fallback')">
        <i data-lucide="x" style="width:16px;height:16px"></i>
      </button>
    </div>
    <div id="modal-prototipo-fallback-body"></div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="App.closeModal('modal-prototipo-fallback')">Fechar</button>
    </div>
  </div>
</div>
```

---

## 4. DOCUMENTOS AUTO-SUFICIENTES

### 4.1 Regra fundamental

**Todo documento exportado DEVE ser 100% autossuficiente.**

Isso significa: a IA que recebe o documento nunca precisa de referência externa para saber o que gerar. O formato de saída, o stack, os padrões de código — tudo está dentro do próprio arquivo.

### 4.2 Novo `buildDoc1()` — Modo sem API

O DOC-1 exportado para uso manual deve conter um prompt completo na parte superior que instrui o Claude a gerar a implementação sem nenhuma referência externa.

Substituir a função `buildDoc1()` em `00-config.js`:

```javascript
buildDoc1() {
  const B = this.state.briefing || {};
  const projeto = this.state.projeto_nome || 'Projeto';

  // ── Calcula campos preenchidos por step ──────────────────────
  const steps = this.STEPS || [];
  const stepsInfo = steps.map((s, i) => ({
    num: i + 1,
    titulo: s.title || s.titulo || `Step ${i+1}`,
    campos: (s.fields || []).filter(f => B[f.key] && String(B[f.key]).trim()).length,
    total: (s.fields || []).length,
  }));

  const stepsResumo = stepsInfo
    .map(s => `Step ${s.num} (${s.titulo}): ${s.campos}/${s.total} campos`)
    .join('\n');

  return `
# DOC-1 — ${projeto}
# Gerado pelo LandingAI · Adsgator
# Data: ${new Date().toLocaleDateString('pt-BR')}
#
# ═══════════════════════════════════════════════════════════════
# COMO USAR ESTE ARQUIVO
# ═══════════════════════════════════════════════════════════════
#
# OPÇÃO 1 — Claude Web (claude.ai):
#   1. Abra uma conversa nova
#   2. Cole TODO o conteúdo deste arquivo
#   3. A IA vai gerar o Blueprint de Implementação completo
#
# OPÇÃO 2 — Claude API / sistema externo:
#   Use o bloco entre === INICIO DO PROMPT === e === FIM DO PROMPT ===
#   como system prompt, e o BRIEFING ESTRUTURADO como user message.
#
# ═══════════════════════════════════════════════════════════════

=== INICIO DO PROMPT ===
Você é um desenvolvedor Astro especializado em landing pages de alta conversão.

Sua tarefa é gerar um Blueprint de Implementação completo para o projeto descrito abaixo.

## O QUE VOCÊ DEVE GERAR

Um documento Markdown com o título "# Blueprint de Implementação — [Nome do Projeto]" contendo:

### SEÇÃO 1 — ORDEM DE CRIAÇÃO
Liste todos os arquivos em ordem de criação, agrupados por fase:
- FASE 1: Fundação (package.json, astro.config.mjs, tailwind.config.js, .env.example)
- FASE 2: Assets estáticos (public/robots.txt, public/manifest.json, public/favicon.svg, src/assets/logo.svg)
- FASE 3: Pré-requisito de Assets de Imagem (liste todas as imagens necessárias com dimensões exatas)
- FASE 4: Componentes Globais
- FASE 5: Layout
- FASE 6: Seções (uma por bloco da estrutura aprovada)
- FASE 7: Páginas

### SEÇÃO 2 — INSTALAÇÃO DE DEPENDÊNCIAS
Bloco de código bash com todos os npm install necessários.

### SEÇÃO 3 — BUILD E DEPLOY
Comandos de desenvolvimento, build e deploy.

### SEÇÃO 4 em diante — UM ARQUIVO POR SEÇÃO
Para cada arquivo na ordem acima, gere:
- Um título \`### \`caminho/do/arquivo\`\`
- Um bloco de código com a extensão correta
- O código COMPLETO e funcional (nunca use "// ... resto do código" ou similar)
- Todo o conteúdo real do briefing aplicado (nomes reais, copies reais, cores reais, dados reais)
- NUNCA deixe placeholders genéricos como "[SEU NOME]" ou "[COR]" — use os dados do briefing

## STACK OBRIGATÓRIA

\`\`\`
Framework:    Astro 4.x (output: hybrid)
CSS:          Tailwind CSS 3.x
Animações:    GSAP 3.x + ScrollTrigger
Smooth scroll: Lenis (@studio-freight/lenis)
Animações UI: Framer Motion (apenas em componentes React)
Ícones:       Lucide React
Formulário:   Web3Forms (action URL via env)
Deploy:       Vercel (@astrojs/vercel adapter)
Analytics:    Vercel Analytics + Speed Insights
LGPD:         Cookie Banner + Google Consent Mode v2
\`\`\`

## PADRÕES OBRIGATÓRIOS DE CÓDIGO

### package.json — sempre incluir estas dependências exatas:
\`\`\`json
{
  "dependencies": {
    "@astrojs/react": "^3.6.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/tailwind": "^5.1.0",
    "@astrojs/vercel": "^7.8.0",
    "@studio-freight/lenis": "^1.0.42",
    "astro": "^4.16.0",
    "framer-motion": "^11.11.0",
    "gsap": "^3.12.5",
    "lucide-react": "^0.414.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "resend": "^4.0.0",
    "tailwindcss": "^3.4.14"
  }
}
\`\`\`

### astro.config.mjs — sempre usar:
\`\`\`js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'hybrid',
  site: 'https://[dominio-do-briefing].com.br',
  adapter: vercel(),
  integrations: [tailwind(), react(), sitemap()],
});
\`\`\`

### Padrão de seção Astro:
- Props definidos no frontmatter (---)
- Dados inline no componente (sem imports externos de dados)
- Script GSAP no final com ScrollTrigger
- Verificação de prefers-reduced-motion antes das animações
- Acessibilidade: aria-labels, roles, focus-visible
- WhatsApp links com texto pré-preenchido via encoding

### Padrão de animação GSAP:
\`\`\`js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.elemento', {
    opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.elemento', start: 'top 85%' }
  });
}
\`\`\`

### CookieBanner.tsx — sempre incluir Google Consent Mode v2:
\`\`\`ts
window.gtag('consent', 'update', {
  analytics_storage: aceito ? 'granted' : 'denied',
  ad_storage: aceito ? 'granted' : 'denied',
});
\`\`\`

### Layout.astro — sempre incluir:
- GTM snippet no <head> e <body>
- Lenis smooth scroll inicializado
- Vercel Analytics e Speed Insights
- Meta tags Open Graph completas
- Schema.org JSON-LD para LocalBusiness ou ProfessionalService
- Fonte carregada via @fontsource (não Google Fonts CDN)

## CAMPOS QUE PRECISAM DE AÇÃO HUMANA
Use exatamente estas strings como placeholder (o Roo Code vai saber procurar por elas):
- \`[DOMINIO]\` — domínio final do projeto
- \`[GTM_ID]\` — ID do Google Tag Manager
- \`[WEB3FORMS_KEY]\` — chave do Web3Forms para formulário de contato
- \`[GA_ID]\` — ID do Google Analytics (opcional)

## REGRAS ABSOLUTAS
1. Nunca gere código incompleto. Se um arquivo tem 200 linhas, escreva 200 linhas.
2. Nunca use comentários como "// adicionar aqui" ou "// resto igual".
3. Toda copy deve vir do briefing abaixo. Nunca invente copy.
4. Nunca inclua blocos de depoimentos sem depoimentos reais no briefing.
5. Nunca inclua mapa sem endereço no briefing.
6. Nunca inclua feed Instagram sem @ confirmado no briefing.
7. Nunca inclua avaliações Google sem perfil confirmado no briefing.
8. H1 do Hero deve ser a dor de busca do cliente, não o nome do serviço.
9. Copy sempre em 1ª pessoa: "Eu atendo...", nunca "Maria atende...".
10. CTAs específicos. Nunca "Saiba mais" ou "Entre em contato".
=== FIM DO PROMPT ===

---

# BRIEFING ESTRUTURADO — ${projeto}

## Progresso de preenchimento
${stepsResumo}

---

## IDENTIDADE E POSICIONAMENTO

- **Nome do Profissional:** ${B.nome_profissional || '—'}
- **Nome da Marca:** ${B.nome_marca || '—'}
- **Nicho/Segmento:** ${B.nicho || '—'}
- **Cidade/Estado:** ${[B.cidade, B.estado].filter(Boolean).join(', ') || '—'}
- **Proposta de Valor:** ${B.proposta_valor || '—'}
- **Missão:** ${B.missao || '—'}
- **Anos de Experiência:** ${B.anos_experiencia || '—'}
- **Formação:** ${B.formacao || '—'}
- **Certificações:** ${B.certificacoes || '—'}

---

## AVATAR E DOR

- **Nome do Avatar:** ${B.avatar_nome || '—'}
- **Faixa Etária:** ${B.avatar_idade || '—'}
- **Gênero:** ${B.avatar_genero || '—'}
- **Profissão:** ${B.avatar_profissao || '—'}
- **Renda:** ${B.avatar_renda || '—'}
- **Dor Principal:** ${B.dor_principal || '—'}
- **Dores Secundárias:** ${B.dores_secundarias || '—'}
- **Desejo Principal:** ${B.desejo_principal || '—'}
- **Objeção — Preço:** ${B.objecao_preco || '—'}
- **Objeção — Tempo:** ${B.objecao_tempo || '—'}
- **Objeção — Confiança:** ${B.objecao_confianca || '—'}
- **Objeção — Resultado:** ${B.objecao_resultado || '—'}
- **Gatilhos Mentais:** ${B.gatilhos_mentais || '—'}

---

## SERVIÇO

- **Serviço Principal:** ${B.servico_principal || '—'}
- **Descrição:** ${B.servico_descricao || '—'}
- **Como Funciona — Passo 1:** ${B.como_funciona_passo1 || '—'}
- **Como Funciona — Passo 2:** ${B.como_funciona_passo2 || '—'}
- **Como Funciona — Passo 3:** ${B.como_funciona_passo3 || '—'}
- **Como Funciona — Passo 4:** ${B.como_funciona_passo4 || '—'}
- **Modalidade:** ${B.modalidade || '—'}
- **Duração da Sessão:** ${B.duracao_sessao || '—'}
- **Frequência:** ${B.frequencia || '—'}
- **Formato:** ${B.formato || '—'}
- **Resultado Esperado:** ${B.resultado_esperado || '—'}
- **Prazo para Resultado:** ${B.prazo_resultado || '—'}
- **Serviços Adicionais:** ${B.servicos_adicionais || '—'}

---

## PROVA SOCIAL

- **Depoimento 1 — Nome:** ${B.depoimento1_nome || '—'}
- **Depoimento 1 — Texto:** ${B.depoimento1_texto || '—'}
- **Depoimento 1 — Resultado:** ${B.depoimento1_resultado || '—'}
- **Depoimento 2 — Nome:** ${B.depoimento2_nome || '—'}
- **Depoimento 2 — Texto:** ${B.depoimento2_texto || '—'}
- **Depoimento 2 — Resultado:** ${B.depoimento2_resultado || '—'}
- **Depoimento 3 — Nome:** ${B.depoimento3_nome || '—'}
- **Depoimento 3 — Texto:** ${B.depoimento3_texto || '—'}
- **Depoimento 3 — Resultado:** ${B.depoimento3_resultado || '—'}
- **Casos de Sucesso:** ${B.casos_de_sucesso || '—'}
- **Perfil Google:** ${B.perfil_google || '—'}
- **Nota Google:** ${B.nota_google || '—'}
- **Qtd. Avaliações:** ${B.quantidade_avaliacoes || '—'}
- **Instagram:** ${B.instagram || '—'}
- **Seguidores:** ${B.seguidores || '—'}
- **Mídia / Aparições:** ${B.midia_aparicoes || '—'}

---

## DIFERENCIAIS

- **Diferencial 1:** ${B.diferencial1_titulo || '—'} — ${B.diferencial1_descricao || '—'}
- **Diferencial 2:** ${B.diferencial2_titulo || '—'} — ${B.diferencial2_descricao || '—'}
- **Diferencial 3:** ${B.diferencial3_titulo || '—'} — ${B.diferencial3_descricao || '—'}
- **Diferencial 4:** ${B.diferencial4_titulo || '—'} — ${B.diferencial4_descricao || '—'}
- **Metodologia Própria:** ${B.metodologia_propria || '—'}
- **Garantia:** ${B.garantia || '—'}
- **Atendimento Diferenciado:** ${B.atendimento_diferenciado || '—'}

---

## PREÇOS E CONTATO

- **WhatsApp:** ${B.whatsapp || '—'}
- **Mensagem padrão WhatsApp:** ${B.whatsapp_mensagem_padrao || '—'}
- **E-mail:** ${B.email || '—'}
- **Plano 1:** ${B.preco_plano1_nome || '—'} — ${B.preco_plano1_valor || '—'} — ${B.preco_plano1_descricao || '—'}
- **Plano 2:** ${B.preco_plano2_nome || '—'} — ${B.preco_plano2_valor || '—'} — ${B.preco_plano2_descricao || '—'}
- **Plano 3:** ${B.preco_plano3_nome || '—'} — ${B.preco_plano3_valor || '—'} — ${B.preco_plano3_descricao || '—'}
- **Formas de Pagamento:** ${B.forma_pagamento || '—'}
- **Desconto PIX:** ${B.desconto_pix || '—'}
- **Parcelamento:** ${B.parcelas || '—'}
- **Trial Gratuito:** ${B.trial_gratuito || '—'}
- **Horário de Atendimento:** ${B.horario_atendimento || '—'}

---

## IDENTIDADE VISUAL

- **Cor Primária:** ${B.cor_primaria || '—'}
- **Cor Secundária:** ${B.cor_secundaria || '—'}
- **Cor de Acento:** ${B.cor_acento || '—'}
- **Cor de Fundo:** ${B.cor_fundo || '—'}
- **Estilo Visual:** ${B.estilo_visual || '—'}
- **Fonte Título:** ${B.fonte_titulo || '—'}
- **Fonte Corpo:** ${B.fonte_corpo || '—'}
- **Tom de Comunicação:** ${B.tom_comunicacao || '—'}
- **Referências Visuais:** ${B.referencias_visuais || '—'}
- **Logo (descrição):** ${B.logo_descricao || '—'}
- **Imagens Disponíveis:** ${B.imagens_disponiveis || '—'}
- **Vídeo Disponível:** ${B.video_disponivel || '—'}

---

## SEO

- **Título SEO:** ${B.titulo_seo || '—'}
- **Descrição SEO:** ${B.descricao_seo || '—'}
- **Palavra-chave Principal:** ${B.palavra_chave_principal || '—'}
- **Palavras-chave Secundárias:** ${B.palavras_chave_secundarias || '—'}
- **Domínio Sugerido:** ${B.dominio_sugerido || '—'}
- **Schema Tipo:** ${B.schema_tipo || '—'}
- **OG Título:** ${B.og_titulo || '—'}
- **OG Descrição:** ${B.og_descricao || '—'}

---

## ESTRUTURA DA PÁGINA (Aprovada)

${B.estrutura_aprovada || B.estrutura_rascunho || '> Estrutura ainda não definida.'}

---

## DIREÇÃO DE ARTE

- **Referências visuais:** ${B.arte_referencias || '—'}
- **Análise de arte:** ${B.arte_analise || '—'}
- **Decisões aprovadas:** ${B.arte_aprovada || '—'}

---

*DOC-1 gerado pelo LandingAI v2 · Adsgator · ${new Date().toLocaleString('pt-BR')}*
`.trim();
},
```

### 4.3 Novo prompt DOC-IMPL (com API) — auto-suficiente

Substituir `buildImplPrompt()` em `00-config.js`:

```javascript
buildImplPrompt() {
  const doc1 = this.buildDoc1();

  // Remove o bloco de instruções manuais do DOC-1
  // para o prompt da API ser mais limpo
  const briefingOnly = doc1.replace(/=== INICIO DO PROMPT ===([\s\S]*?)=== FIM DO PROMPT ===/,'').trim();

  return `
Você é um desenvolvedor Astro especializado em landing pages de alta conversão.

## SUA TAREFA

Gerar um Blueprint de Implementação completo e 100% funcional para o projeto abaixo.

## FORMATO DE SAÍDA OBRIGATÓRIO

O documento que você vai gerar deve seguir EXATAMENTE esta estrutura:

\`\`\`
# Blueprint de Implementação — [Nome do Projeto]
> **Documento para o Roo Code.**
> Contém todos os arquivos do projeto na ordem correta de criação.
> Não invente nada além do que está aqui.
> Campos que exigem ação humana antes do go-live: \`[DOMINIO]\`, \`[GTM_ID]\`, \`[WEB3FORMS_KEY]\`.

---

## ORDEM DE CRIAÇÃO

### FASE 1 — Fundação
1. \`package.json\`
2. \`astro.config.mjs\`
3. \`tailwind.config.js\`
4. \`.env.example\` → criar \`.env\` com valores reais

### FASE 2 — Arquivos Estáticos
5. \`public/robots.txt\`
6. \`public/manifest.json\`
7. \`public/favicon.svg\`
8. \`src/assets/logo.svg\`

### FASE 3 — Pré-requisito de Assets de Imagem
[lista de imagens necessárias com dimensões]

### FASE 4 — Componentes Globais
[lista dos componentes]

### FASE 5 — Layout
[Layout.astro]

### FASE 6 — Seções
[uma seção por bloco da estrutura aprovada]

### FASE 7 — Páginas
[páginas]

---

## INSTALAÇÃO DE DEPENDÊNCIAS
[bloco bash com npm install]

---

## BUILD E DEPLOY
[comandos]

---

[A partir daqui: um título ### por arquivo, seguido do código completo em bloco de código]
\`\`\`

## STACK OBRIGATÓRIA

- Framework: Astro 4.x (output: hybrid)
- CSS: Tailwind CSS 3.x (config com design system completo do briefing)
- Animações: GSAP 3.x + ScrollTrigger (em toda seção com scroll)
- Smooth scroll: Lenis (@studio-freight/lenis) — inicializado no Layout
- UI dinâmica: Framer Motion — apenas em componentes React (.tsx)
- Ícones: Lucide React
- Formulário: Web3Forms (endpoint via variável de ambiente)
- Deploy: Vercel — adapter @astrojs/vercel — output hybrid
- Analytics: Vercel Analytics + Speed Insights — importados no Layout
- LGPD: CookieBanner.tsx com Google Consent Mode v2
- Fontes: via @fontsource (não CDN externo)

## DEPENDÊNCIAS EXATAS (package.json)

\`\`\`json
{
  "dependencies": {
    "@astrojs/react": "^3.6.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/tailwind": "^5.1.0",
    "@astrojs/vercel": "^7.8.0",
    "@studio-freight/lenis": "^1.0.42",
    "astro": "^4.16.0",
    "framer-motion": "^11.11.0",
    "gsap": "^3.12.5",
    "lucide-react": "^0.414.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "resend": "^4.0.0",
    "tailwindcss": "^3.4.14"
  }
}
\`\`\`

## PADRÕES DE CÓDIGO

### Seções Astro:
- Todos os dados (textos, preços, depoimentos) ficam inline no frontmatter (---)
- Nenhum import de arquivo de dados externo
- Script GSAP no <script> ao final com prefers-reduced-motion
- Acessibilidade: aria-labelledby, role, focus-visible em todos os interativos

### Animações GSAP (obrigatório em toda seção):
\`\`\`js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.classe', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.classe', start: 'top 85%' } });
}
\`\`\`

### WhatsApp links:
- Sempre com texto pré-preenchido via encodeURIComponent
- Usar o número e a mensagem padrão do briefing

### Layout.astro deve incluir:
- GTM no <head> (gtag) e <body> (noscript iframe)
- Lenis inicializado com lerp: 0.1, duration: 1.2
- Import de Vercel Analytics e Speed Insights
- Meta tags: title, description, canonical, og:*, twitter:*
- JSON-LD Schema.org baseado no schema_tipo do briefing

## REGRAS ABSOLUTAS

1. Todo arquivo deve ter o código COMPLETO. Zero atalhos como "// resto igual".
2. Nunca use placeholders como "[TEXTO]" no código — use os dados reais do briefing.
3. Exceção: use \`[DOMINIO]\`, \`[GTM_ID]\`, \`[WEB3FORMS_KEY]\` para dados que o cliente ainda não tem.
4. Se o briefing não tem depoimentos reais: não gere a seção de depoimentos.
5. Se o briefing não tem endereço: não gere a seção de mapa/localização.
6. Se o briefing não tem @ do Instagram confirmado: não gere feed Instagram.
7. H1 do Hero = a dor de busca, nunca o nome do serviço.
8. Copy em 1ª pessoa do singular: "Eu atendo...", "Meu método...".
9. CTAs específicos: nunca "Saiba mais" ou "Entre em contato".
10. O tailwind.config.js deve ter os tokens exatos de cores, fontes e espaçamentos do briefing.

---

${briefingOnly}
`.trim();
},
```

---

## 5. CORREÇÕES DE UI/UX

### 5.1 Lista de correções necessárias

1. **Progress bar não atualiza** ao navegar entre steps
2. **Steps nav** não reflete campos preenchidos em tempo real
3. **Toast** sumindo antes do usuário ler (aumentar para 4s)
4. **AI Log modal** sem animação de entrada/saída
5. **Campos de texto** sem feedback de foco consistente
6. **Scroll** não reseta ao trocar de screen
7. **Botão de download** não tem feedback de carregamento
8. **Modal de API** fecha sem confirmar salvamento
9. **Step com erro** não destaca o campo problemático
10. **Sidebar em mobile** sobrepõe o conteúdo sem overlay

### 5.2 Fix — Progress bar e steps nav em tempo real

Em `03-ui.js`, garantir que `updateProgressBar()` e `renderStepsNav()` sejam chamados sempre que um campo é alterado:

```javascript
// Substituir setField para incluir update automático
setField(key, value) {
  if (!this.state.briefing) this.state.briefing = {};
  this.state.briefing[key] = value;
  this.saveState();
  this.updateProgressBar();    // ← adicionar
  this.updateStepsNavBadges(); // ← adicionar (ver abaixo)
},

// Novo método: atualiza apenas os badges do nav sem rerenderizar tudo
updateStepsNavBadges() {
  const steps = this.STEPS || [];
  const B = this.state.briefing || {};

  steps.forEach((step, i) => {
    const filled = (step.fields || []).filter(f => B[f.key] && String(B[f.key]).trim()).length;
    const total  = (step.fields || []).length;
    const badge  = document.querySelector(`.step-nav-item[data-step="${i}"] .step-nav-badge`);
    if (badge) {
      badge.textContent = `${filled}/${total}`;
      badge.className = `step-nav-badge ${filled === total ? 'badge-complete' : filled > 0 ? 'badge-partial' : 'badge-empty'}`;
    }
  });
},
```

### 5.3 Fix — Toast com duração configurável

```javascript
showToast(message, type = 'info', duration = 4000) {
  const existing = document.getElementById('toast-container');
  const container = existing || (() => {
    const el = document.createElement('div');
    el.id = 'toast-container';
    document.body.appendChild(el);
    return el;
  })();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : type === 'warning' ? 'alert-triangle' : 'info'}" style="width:15px;height:15px;flex-shrink:0;"></i>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;padding:0;color:inherit;opacity:0.6;">
      <i data-lucide="x" style="width:13px;height:13px;"></i>
    </button>
  `;

  container.appendChild(toast);
  lucide.createIcons({ nodes: [toast] });

  // Entrada
  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  // Saída após duration
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
},
```

### 5.4 CSS para toast melhorado — adicionar em `04-system.css`

```css
/* ── Toast System ────────────────────────────────────────── */
#toast-container {
  position: fixed;
  bottom: var(--space-5);
  right: var(--space-5);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 360px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  opacity: 0;
  transform: translateY(8px) scale(0.97);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: all;
  border: 1px solid transparent;
}

.toast-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.toast-success { background: #dcfce7; color: #15803d; border-color: #bbf7d0; }
.toast-error   { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }
.toast-warning { background: #fef9c3; color: #854d0e; border-color: #fef08a; }
.toast-info    { background: var(--surface); color: var(--text-primary); border-color: var(--border); }
```

### 5.5 Fix — Scroll reset ao trocar de screen

```javascript
// Em navigate() ou sempre que renderScreen() é chamado
renderScreen() {
  // reset scroll
  const content = document.getElementById('content') || document.querySelector('.main-content');
  if (content) content.scrollTop = 0;

  // ... resto do render
},
```

### 5.6 Fix — AI Log com animação de entrada/saída

```css
/* Em 04-system.css */
.ai-log-overlay {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.ai-log-overlay.is-visible {
  opacity: 1;
}
.ai-log-modal {
  transform: scale(0.95) translateY(8px);
  transition: transform 0.25s ease, opacity 0.25s ease;
  opacity: 0;
}
.ai-log-overlay.is-visible .ai-log-modal {
  transform: scale(1) translateY(0);
  opacity: 1;
}
```

```javascript
// Em openAILog()
openAILog(titulo, steps) {
  // ... código atual de criar o modal ...
  requestAnimationFrame(() => {
    document.getElementById('ai-log-overlay').classList.add('is-visible');
  });
},

// Em closeAILog()
closeAILog() {
  const overlay = document.getElementById('ai-log-overlay');
  if (overlay) {
    overlay.classList.remove('is-visible');
    setTimeout(() => overlay.remove(), 250);
  }
},
```

### 5.7 Fix — Sidebar overlay em mobile

```css
/* Em 01-layout.css */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100vh;
    z-index: 200;
    transition: left 0.25s ease;
  }

  .sidebar.is-open {
    left: 0;
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 199;
    backdrop-filter: blur(2px);
  }

  .sidebar.is-open ~ .sidebar-overlay {
    display: block;
  }
}
```

Adicionar no `index.html` após a sidebar:
```html
<div class="sidebar-overlay" onclick="App.closeSidebar()"></div>
```

### 5.8 Fix — Feedback de carregamento no botão de download

```javascript
async downloadDoc1() {
  const btn = document.getElementById('btn-download-doc1');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader" style="width:14px;height:14px;animation:spin 1s linear infinite;"></i> Gerando...';
    lucide.createIcons({ nodes: [btn] });
  }

  try {
    const doc1 = this.buildDoc1();
    const slug = (this.state.projeto_nome || 'projeto').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const blob = new Blob([doc1], { type: 'text/markdown;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `doc1-${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
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
```

---

## 6. ARQUIVOS A EXCLUIR

Já foram excluídos pelo usuário:
- `assets/app.BACKUP.js` ✓
- `assets/app.BACKUP.css` ✓

Confirmar que `assets/app.js` e `assets/app.css` são arquivos de entrypoint que importam os módulos (não contêm lógica duplicada).

Verificar e limpar:
```bash
# Se app.js não importa os módulos e apenas tem código legado, substituir por:
cat assets/js/app.js
# Deve conter apenas os imports e a inicialização do App
```

`assets/app.js` deve ser apenas:
```javascript
// assets/app.js — entrypoint legado (manter para compatibilidade com index.html se necessário)
// Este arquivo pode ser removido se index.html já aponta para assets/js/app.js
```

---

## 7. CONFIGURAÇÃO DOS STEPS — CAMPOS MAPEADOS

Para garantir que o mapeamento de campos funcione, cada step em `00-config.js` deve ter `fields` com `key` correspondendo aos campos do JSON do intake.

Exemplo de estrutura esperada em `STEPS`:

```javascript
STEPS: [
  {
    id: 'step1',
    title: 'Identidade',
    icon: 'user',
    fields: [
      { key: 'nome_profissional', label: 'Nome do Profissional', type: 'text' },
      { key: 'nome_marca',        label: 'Nome da Marca',        type: 'text' },
      { key: 'nicho',             label: 'Nicho / Segmento',     type: 'text' },
      { key: 'segmento',          label: 'Segmento detalhado',   type: 'text' },
      { key: 'cidade',            label: 'Cidade',               type: 'text' },
      { key: 'estado',            label: 'Estado',               type: 'text' },
      { key: 'proposta_valor',    label: 'Proposta de Valor',    type: 'textarea' },
      { key: 'missao',            label: 'Missão',               type: 'textarea' },
      { key: 'anos_experiencia',  label: 'Anos de Experiência',  type: 'text' },
      { key: 'formacao',          label: 'Formação',             type: 'text' },
      { key: 'certificacoes',     label: 'Certificações',        type: 'textarea' },
    ],
  },
  {
    id: 'step2',
    title: 'Avatar e Dor',
    icon: 'target',
    fields: [
      { key: 'avatar_nome',         label: 'Nome do Avatar',         type: 'text' },
      { key: 'avatar_idade',        label: 'Faixa Etária',           type: 'text' },
      { key: 'avatar_genero',       label: 'Gênero',                 type: 'text' },
      { key: 'avatar_profissao',    label: 'Profissão',              type: 'text' },
      { key: 'avatar_renda',        label: 'Renda',                  type: 'text' },
      { key: 'dor_principal',       label: 'Dor Principal',          type: 'textarea' },
      { key: 'dores_secundarias',   label: 'Dores Secundárias',      type: 'textarea' },
      { key: 'desejo_principal',    label: 'Desejo Principal',       type: 'textarea' },
      { key: 'objecao_preco',       label: 'Objeção — Preço',        type: 'textarea' },
      { key: 'objecao_tempo',       label: 'Objeção — Tempo',        type: 'textarea' },
      { key: 'objecao_confianca',   label: 'Objeção — Confiança',    type: 'textarea' },
      { key: 'objecao_resultado',   label: 'Objeção — Resultado',    type: 'textarea' },
      { key: 'gatilhos_mentais',    label: 'Gatilhos Mentais',       type: 'textarea' },
    ],
  },
  // step3 ... step8 com os campos correspondentes ao JSON do intake
],
```

Os `key` nos STEPS devem ser IDÊNTICOS aos usados no JSON de resposta do `buildIntakePrompt()`.

---

## 8. CHECKLIST FINAL DE VALIDAÇÃO

Após implementar tudo, verificar:

- [ ] Intake analysis preenche campos em todos os 8 steps
- [ ] Progress bar sobe ao digitar em qualquer campo
- [ ] Steps nav atualiza badges em tempo real
- [ ] Wireframe mostra copy real dentro de cada bloco
- [ ] Botão "Gerar protótipo visual" aparece com API Gemini configurada
- [ ] Modal de fallback de protótipo lista as 4 ferramentas com links
- [ ] DOC-1 exportado contém o prompt completo no topo
- [ ] DOC-1 inclui toda a estrutura aprovada
- [ ] Toast fica visível por 4 segundos
- [ ] AI Log abre e fecha com animação
- [ ] Scroll reseta ao trocar de tela
- [ ] Sidebar tem overlay em mobile
- [ ] Download do DOC-1 tem feedback de carregamento
- [ ] `assets/app.BACKUP.js` e `app.BACKUP.css` não existem mais

---

*Documento gerado para o LandingAI v2 · Adsgator*
*Implementar com Roo Code — não alterar a ordem das seções*
