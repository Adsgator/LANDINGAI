# AIGator — Plano de Correção Final
> **Para o Roo Code.**
> Leia tudo antes de executar. Execute em ordem. Declare os arquivos antes de cada correção.
> Foco: deixar 100% funcional do intake ao DOC-IMPL, em todas as variações de modelo e fluxo.

---

## DIAGNÓSTICO — O QUE AINDA ESTÁ ERRADO

| # | Bug | Arquivo | Impacto |
|---|---|---|---|
| 1 | `setupGlobalEvents()` não roda no primeiro load sem projetos | `app.js` | Crítico — botões mortos |
| 2 | Gemini 2.5 Flash Lite usa data futura (`-06-17`) | `00-config.js` | Crítico — chamadas de API falham |
| 3 | `gemini-3-flash-preview` não existe na API | `00-config.js` | Crítico — chamadas falham |
| 4 | `buildDoc1()` faz `JSON.parse` sem try/catch | `screens/review.js` | Crítico — DOC-1 quebra se arte não for JSON |
| 5 | `runIntakeAnalysis` prompt fraco + JSON parse sem fallback | `04-handlers.js` | Grave — análise falha silenciosamente |
| 6 | `runArtAnalysis` não exibe resultado no modal | `04-handlers.js` | Grave — resultado some |
| 7 | `intake.js` upload IDs não confirmados | `screens/intake.js` | Grave — upload não funciona |
| 8 | `structure.js` método pode ter nome errado | `screens/structure.js` | Grave — tela Estrutura quebra |
| 9 | `updateSidebar` só checa gemini/openrouter para status API | `03-ui.js` | Menor |
| 10 | `REQUIRED_FIELDS` — verificar se está definido | `00-config.js` | Grave se ausente |

---

## CORREÇÃO 1 — `app.js`: setupGlobalEvents no primeiro load

**Arquivo:** `assets/js/app.js`

**Problema:** Quando não há projetos no localStorage, `createProject()` é chamado, renderiza e faz `return`. O `setupGlobalEvents()` fica depois do `if` e nunca roda. Resultado: nenhum botão funciona no primeiro acesso.

**Substituir o método `init()` por:**

```javascript
  init() {
    // 1. Carregar dados do localStorage
    this.loadStorage();

    // 2. Registrar eventos globais ANTES de qualquer renderização
    //    (precisa estar aqui para funcionar mesmo no primeiro acesso)
    this.setupGlobalEvents();

    // 3. Garantir projeto ativo válido
    if (!this.state.activeId || !this.state.projects[this.state.activeId]) {
      const ids = Object.keys(this.state.projects);
      if (ids.length > 0) {
        // Pegar o projeto mais recente
        const sorted = ids.sort((a, b) =>
          new Date(this.state.projects[b].updatedAt) - new Date(this.state.projects[a].updatedAt)
        );
        this.state.activeId = sorted[0];
      } else {
        // Criar primeiro projeto sem chamar renderAll (vamos chamar abaixo)
        const id = 'p_' + Date.now();
        this.state.projects[id] = {
          id,
          name: 'Novo Projeto',
          slug: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          visitedSteps: [],
          briefing: {
            integracoes: ['whatsapp'],
            depoimentos_formato: [],
            arte_referencias_pessoais: [],
            arte_referencias_nicho: [],
          },
        };
        this.state.activeId = id;
        this.saveStorage();
      }
    }

    // 4. Renderizar tudo
    this.renderAll();

    // 5. Solicitar permissão de notificação (silencioso)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
```

---

## CORREÇÃO 2 — `00-config.js`: Modelos Gemini corretos

**Arquivo:** `assets/js/00-config.js`

### O que está errado:

| Modelo no config | Status real |
|---|---|
| `gemini-2.5-flash-lite-preview-06-17` | ❌ Data futura (junho 2026) — não existe ainda |
| `gemini-2.5-flash-preview-05-20` | ✅ Existe (lançado maio 2025) |
| `gemini-2.5-pro-preview-06-05` | ✅ Existe (lançado junho 2025) |
| `gemini-3-flash-preview` | ❌ Não existe — o que existe é `gemini-3.1-flash-lite-preview` |
| `gemini-3.1-pro-preview` | ✅ Existe |
| `gemini-2.0-flash-lite` | ⚠️ Existe mas deprecia em 01/06/2026 (25 dias) |

### Substituir APENAS as entradas Gemini no `AI_MODELS` por:

```javascript
  // ── Google Gemini ──────────────────────────────────────────
  'gemini-2.5-flash-lite': {
    label: 'Gemini 2.5 Flash Lite',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
    maxTokens: 16384,
    temp: 0.7,
  },
  'gemini-2.5-flash': {
    label: 'Gemini 2.5 Flash',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent',
    maxTokens: 32768,
    temp: 0.7,
  },
  'gemini-2.5-pro': {
    label: 'Gemini 2.5 Pro',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-06-05:generateContent',
    maxTokens: 65536,
    temp: 0.6,
  },
  'gemini-2.5-flash-image': {
    label: 'Gemini 2.5 Flash (Imagem)',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent',
    maxTokens: 16384,
    temp: 0.7,
    supportsImages: true,
  },
  'gemini-3.1-flash-lite': {
    label: 'Gemini 3.1 Flash Lite',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'free',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent',
    maxTokens: 16384,
    temp: 0.7,
  },
  'gemini-3.1-pro': {
    label: 'Gemini 3.1 Pro',
    provider: 'gemini',
    group: 'Google Gemini',
    tier: 'paid',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent',
    maxTokens: 65536,
    temp: 0.6,
  },
```

> ⚠️ Manter Claude, Grok, Mistral, OpenRouter exatamente como estão.
> Atualizar `this.state.selectedModel` default para `'gemini-2.5-flash'` em `01-state.js`.

### Verificar se `REQUIRED_FIELDS` está definido em `00-config.js`

Procurar no arquivo por `const REQUIRED_FIELDS`. Se NÃO existir, adicionar logo após o bloco `const STEPS`:

```javascript
const REQUIRED_FIELDS = {
  1: ['nome_cliente', 'segmento', 'tipo'],
  2: ['whatsapp', 'objetivo_conversao'],
  3: ['google_business'],
  4: ['modalidade'],
  5: ['servico_principal'],
  6: ['publico_primario', 'publico_dor'],
  7: ['diferencial'],
  8: ['estilo_desejado'],
};
```

---

## CORREÇÃO 3 — `screens/intake.js`: verificar e corrigir IDs de upload

**Arquivo:** `assets/js/screens/intake.js`

Abrir o arquivo e localizar o HTML retornado por `buildIntakeScreen()`.

**Verificar se existem EXATAMENTE estes IDs:**
- `id="intake-upload-zone"` na div da zona de drag & drop
- `id="intake-upload-input"` no `<input type="file">`
- `id="intake-files-list"` no contêiner da lista de arquivos
- `id="btn-analyze"` no botão de analisar

**Se os IDs forem diferentes**, corrigir o HTML para usar exatamente esses nomes.

**O HTML esperado da zona de upload é:**
```html
<div id="intake-upload-zone" class="upload-zone">
  <input type="file" id="intake-upload-input" multiple
    accept=".txt,.pdf,.doc,.docx,.md"
    style="display:none">
  <i data-lucide="upload-cloud" class="upload-zone-icon"></i>
  <p class="upload-zone-label">Arraste arquivos ou clique para selecionar</p>
  <p class="upload-zone-hint">PDF, Word, TXT, MD — o texto será extraído e somado ao briefing</p>
</div>
<div id="intake-files-list" class="upload-preview-list"></div>
```

**O botão de analisar deve ter:**
```html
<button class="btn-primary" id="btn-analyze">
  <i data-lucide="sparkles" style="width:15px;height:15px"></i>
  Analisar e Preencher Steps
</button>
```

---

## CORREÇÃO 4 — `screens/structure.js`: garantir nome do método correto

**Arquivo:** `assets/js/screens/structure.js`

O `renderScreen()` em `03-ui.js` chama `this.buildStructureScreen()` no case `'structure'`.

Abrir `structure.js` e verificar o nome do método principal.

**Se o método se chamar `buildEstruturaHTML()` ou qualquer outro nome**, renomeá-lo para `buildStructureScreen()` ou adicionar um alias:

```javascript
// Alias para compatibilidade com renderScreen()
buildStructureScreen() {
  return this.buildEstruturaHTML(); // chame aqui o método real que existir
},
```

---

## CORREÇÃO 5 — `runIntakeAnalysis`: prompt robusto + parse seguro

**Arquivo:** `assets/js/04-handlers.js`

### 5.1 — Substituir o método `runIntakeAnalysis` por:

```javascript
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

      const prompt = `Você é um especialista em briefing de landing pages da agência Adsgator.
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
```

---

## CORREÇÃO 6 — `runArtAnalysis`: exibir resultado no modal

**Arquivo:** `assets/js/04-handlers.js`

### 6.1 — Substituir o método `runArtAnalysis` por:

```javascript
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
```

---

## CORREÇÃO 7 — `buildDoc1()`: parse seguro do JSON de arte

**Arquivo:** `assets/js/screens/review.js`

Localizar o método `buildDoc1()`. No início do método, substituir a linha:
```javascript
const fichaArte = B.ficha_direcao_arte ? JSON.parse(B.ficha_direcao_arte) : null;
```
Por:
```javascript
let fichaArte = null;
if (B.ficha_direcao_arte) {
  try {
    fichaArte = typeof B.ficha_direcao_arte === 'object'
      ? B.ficha_direcao_arte
      : JSON.parse(B.ficha_direcao_arte);
  } catch (e) {
    console.warn('ficha_direcao_arte não é JSON válido:', e.message);
    fichaArte = null;
  }
}
```

---

## CORREÇÃO 8 — `generateDocImpl()`: prompt completo e robusto

**Arquivo:** `assets/js/04-handlers.js`

Substituir o método `generateDocImpl()` por:

```javascript
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
```

---

## CORREÇÃO 9 — `updateSidebar()`: status API correto

**Arquivo:** `assets/js/03-ui.js`

Localizar no método `updateSidebar()`:
```javascript
const hasKey = this.state.apiKeys['gemini'] || this.state.apiKeys['openrouter'];
```
Substituir por:
```javascript
const hasKey = Object.values(this.state.apiKeys).some(k => k?.trim());
const keyCount = Object.values(this.state.apiKeys).filter(k => k?.trim()).length;
```

E atualizar as linhas do status:
```javascript
if (apiDot) apiDot.className = `status-dot ${hasKey ? 'ok' : ''}`;
if (apiLabel) apiLabel.textContent = hasKey ? `${keyCount} API${keyCount > 1 ? 's' : ''} ativa${keyCount > 1 ? 's' : ''}` : 'Sem API';
```

---

## CORREÇÃO 10 — CSS: classe `.drag-over` para upload zones

**Arquivo:** `assets/css/02-components.css`

Adicionar ao final do arquivo (se não existir):

```css
/* ── Upload Zone: drag state ───────────────────────────────── */
.upload-zone {
  cursor: pointer;
  transition: all var(--t-base);
}

.upload-zone.drag-over {
  border-color: var(--accent);
  background: var(--accent-dim);
  transform: scale(1.01);
}

/* ── Color Picker ──────────────────────────────────────────── */
.color-picker-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker-swatch {
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  overflow: hidden;
  border: 1px solid var(--border-default);
  flex-shrink: 0;
}

.color-picker-swatch input[type="color"] {
  width: 150%;
  height: 150%;
  border: none;
  cursor: pointer;
  transform: translate(-15%, -15%);
}

.color-picker-input {
  flex: 1;
}

/* ── Art Result Modal ──────────────────────────────────────── */
.modal--lg {
  max-width: 720px;
  width: 100%;
}
```

---

## VERIFICAÇÃO FINAL — FLUXO COMPLETO

Executar na ordem e confirmar cada passo antes de avançar:

### ✅ Fluxo 1: Primeiro acesso (sem projetos no localStorage)
1. Limpar localStorage (DevTools → Application → Clear)
2. Abrir index.html
3. App carrega com sidebar mostrando "Novo Projeto"
4. Tela de Intake visível
5. Botão "Próximo" navega para Step 1 ✓
6. Steps 1–8 navegam corretamente ✓
7. Botão "Anterior" funciona ✓

### ✅ Fluxo 2: Salvar e recarregar
1. Preencher campo Nome no Step 1
2. Indicador "Salvando..." pisca → vira "Salvo" ✓
3. Recarregar página
4. Nome ainda preenchido ✓
5. Sidebar mostra nome do projeto ✓

### ✅ Fluxo 3: Projetos
1. Abrir modal Meus Projetos ✓
2. Criar novo projeto ✓
3. Renomear projeto ✓
4. Clicar em projeto existente → modal fecha, projeto carrega ✓
5. Exportar projeto → baixa .json ✓
6. Importar projeto .json ✓
7. Duplicar projeto ✓
8. Excluir projeto ✓
9. Excluir todos → cria novo automaticamente ✓

### ✅ Fluxo 4: Configuração de API
1. Clicar em "Sem API" no footer da sidebar ✓
2. Modal de configuração abre ✓
3. Inserir chave Gemini → clicar Salvar ✓
4. Fechar modal → ponto na sidebar fica verde ✓

### ✅ Fluxo 5: Intake e Análise IA
1. Tela de Intake com textarea visível ✓
2. Upload de arquivo funciona (clique e drag&drop) ✓
3. Colar briefing no textarea → salva automaticamente ✓
4. Clicar "Analisar e Preencher Steps" ✓
5. Modal de log aparece com steps de progresso ✓
6. Após análise → vai para Step 1 com campos preenchidos ✓
7. Toast "X campos preenchidos" ✓

### ✅ Fluxo 6: Steps 1–8
1. Todos os 8 steps renderizam sem erro ✓
2. Inputs salvam ao digitar ✓
3. Chips funcionam (single e multi) ✓
4. Sel-cards funcionam ✓
5. Campos condicionais aparecem/somem conforme escolhas ✓
6. Progress bar da topbar avança ✓
7. Steps com campos preenchidos marcados como "done" na sidebar ✓

### ✅ Fluxo 7: Estrutura da LP
1. Navegar para "Estrutura da LP" (Próximo após Step 8) ✓
2. Tela renderiza sem erro ✓
3. Botão "Gerar Estrutura com IA" funciona ✓
4. Modal de log aparece ✓
5. Wireframe aparece após geração ✓
6. Botão Aprovar salva e mostra banner ✓

### ✅ Fluxo 8: Direção de Arte
1. Navegar para "Direção de Arte" ✓
2. Upload de ativos funciona ✓
3. Chips de tema/intensidade funcionam ✓
4. Adicionar/remover referências funciona ✓
5. "Analisar com IA" → modal de log → modal de resultado ✓
6. Paleta de cores visível no modal ✓
7. Aprovar Direção → banner aparece ✓

### ✅ Fluxo 9: Revisão e Geração
1. Navegar para "Revisão e Geração" ✓
2. Cards dos steps com status correto ✓
3. Sumário do projeto preenchido ✓
4. Baixar DOC-1 funciona (sem API) ✓
5. "Gerar Ficha de Implementação" → modal de log → download do .md ✓

### ✅ Seletor de Modelo
1. Clicar no seletor de modelo na topbar ✓
2. Dropdown mostra grupos Google Gemini, Anthropic, OpenRouter ✓
3. Todos os 6 modelos Gemini aparecem (sem datas no label) ✓
4. Selecionar modelo diferente → label atualiza ✓
5. Fechar clicando fora ✓

---

## ARQUIVOS MODIFICADOS NESTE PLANO

| Arquivo | Correção |
|---|---|
| `assets/js/app.js` | Correção 1 — init() com setupGlobalEvents antes do check |
| `assets/js/00-config.js` | Correção 2 — modelos Gemini corretos + REQUIRED_FIELDS |
| `assets/js/screens/intake.js` | Correção 3 — verificar/corrigir IDs de upload |
| `assets/js/screens/structure.js` | Correção 4 — garantir nome do método |
| `assets/js/04-handlers.js` | Correções 5, 6, 8 — runIntakeAnalysis, runArtAnalysis, generateDocImpl |
| `assets/js/screens/review.js` | Correção 7 — buildDoc1 parse seguro |
| `assets/js/03-ui.js` | Correção 9 — updateSidebar status API |
| `assets/css/02-components.css` | Correção 10 — drag-over + color picker + modal-lg |
