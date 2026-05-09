# LANDINGAI — DOC-1 Quality 100/100
**Objetivo:** Fazer o DOC-1 exportar com todos os campos preenchidos, incluindo identidade visual completa, mesmo sem usar a IA na tela de arte.  
**Data:** 2026-05-09  
**Para:** Roo Code — implementar exatamente como descrito, sem criar arquivos novos

---

> **REGRA GERAL:** Apenas editar arquivos existentes. Nenhum arquivo novo. Cada fix indica o arquivo, a localização e o código exato.

---

## CONTEXTO — Por que o DOC-1 sai com campos zerados

O fluxo atual tem uma falha de arquitetura:

1. A tela de arte tem campos manuais (color pickers, inputs de fonte) **mas só salva `arte_ficha_aprovada` se a IA for usada e o usuário clicar em "Aprovar Direção"**
2. Quem pula a IA → `arte_ficha_aprovada` fica `null` → DOC-1 exporta toda a seção IDENTIDADE VISUAL como `—`
3. A tela de Revisão não bloqueia exportação mesmo com identidade visual zerada
4. Steps 1 e 6 não capturam dados de autoridade (formação, experiência) e o avatar está com label confuso

---

## FIX-A01 · `assets/js/screens/art.js` — Aprovação manual sem IA

**Problema:** O botão "Aprovar Direção" só aparece após a IA gerar a ficha. Quem preenche os campos manuais (cores + fontes) não tem como aprovar e salvar.

**Localizar** a função `buildArtScreen()` em `assets/js/screens/art.js`. No final da tela, antes de fechar a `div.art-screen`, existe a `div.art-actions` com o botão de gerar IA:

```javascript
<div class="art-actions">
  <button id="btn-analyze-art" class="btn-primary">
    <i data-lucide="palette" style="width:16px;height:16px"></i>
    Gerar Ficha de Direção de Arte
  </button>
</div>
```

**Substituir** esse bloco `div.art-actions` por:

```javascript
<div class="art-actions">
  <button id="btn-analyze-art" class="btn-primary">
    <i data-lucide="sparkles" style="width:16px;height:16px"></i>
    Gerar com IA
  </button>
  <button id="btn-approve-art-manual" class="btn-secondary"
    style="display:${(B.arte_cor_principal && B.arte_fonte_principal) ? '' : 'none'}">
    <i data-lucide="check" style="width:16px;height:16px"></i>
    Aprovar Direção Manualmente
  </button>
</div>
<p class="art-manual-hint" style="font-size:11.5px;color:var(--text-tertiary);margin-top:8px;text-align:center;">
  ${!(B.arte_cor_principal && B.arte_fonte_principal) ? 'Preencha Cor Principal e Fonte Título para aprovar sem IA.' : 'Campos preenchidos — você pode aprovar sem usar a IA.'}
</p>
```

---

**Ainda em `assets/js/screens/art.js`** — adicionar a função `aprovarArteManual()` no final do `Object.assign(window.App, { ... })`:

**Localizar** o final do bloco `Object.assign(window.App, {` nesse arquivo. Após a última função (provavelmente `applyFontPreset`), **adicionar** antes do `});` de fechamento:

```javascript
aprovarArteManual() {
  const B = this.B;
  if (!B.arte_cor_principal || !B.arte_fonte_principal) {
    this.showToast('Preencha ao menos Cor Principal e Fonte Título para aprovar.', 'warning');
    return;
  }

  // Montar ficha de arte com dados manuais no mesmo formato da ficha gerada por IA
  const fichaManual = {
    tema: B.arte_tema || 'claro',
    intensidade: B.arte_intensidade || 'contido',
    paleta: {
      primaria: B.arte_cor_principal || '',
      secundaria: B.arte_cor_secundaria || '',
      acento: B.arte_cor_acento || '',
      fundo: B.arte_cor_fundo || '#ffffff',
      texto: B.arte_cor_texto || '#1a1a1a',
      suporte: B.arte_cor_suporte || '',
    },
    tipografia: {
      display: B.arte_fonte_principal || '',
      body: B.arte_fonte_secundaria || 'Inter',
      escala: 'Definida manualmente',
    },
    tom_visual: `${B.estilo_desejado || ''} · ${B.sensacao_visitante || ''}`.trim().replace(/^·\s*|·\s*$/, '') || 'Definido manualmente',
    elementos_visuais: '',
    fotografia: B.arte_fotos === 'boa' ? 'Fotos de boa qualidade disponíveis.' : B.arte_fotos === 'media' ? 'Fotos de qualidade média disponíveis.' : 'Sem fotos disponíveis.',
    decisoes_criativas: [
      B.arte_logo !== 'nao' ? `Logo disponível (${B.arte_logo?.toUpperCase() || 'arquivo fornecido'}).` : 'Sem logo — usar tipografia como identidade.',
      B.arte_menu_mobile ? `Menu mobile: ${B.arte_menu_mobile}.` : '',
    ].filter(Boolean),
    fonte_manual: true,
  };

  this.setField('arte_ficha_aprovada', JSON.stringify(fichaManual));
  this.autosave();
  this.showToast('Direção de Arte aprovada!', 'success');
  this.renderAll();
},
```

---

**Ainda em `assets/js/screens/art.js`** — vincular o botão ao handler via event delegation.

**Localizar** a função ou o bloco onde os handlers da tela de arte são registrados. Pode estar em `04-handlers.js` via event delegation ou direto em `art.js`. Procurar por `btn-analyze-art` no arquivo de handlers.

**Em `assets/js/04-handlers.js`**, localizar o listener de `btn-analyze-art`:

```javascript
// algo como:
if (e.target.closest('#btn-analyze-art')) { ... App.analisarArte() ... }
```

**Adicionar logo abaixo** dessa linha:

```javascript
if (e.target.closest('#btn-approve-art-manual')) App.aprovarArteManual();
```

---

## FIX-A02 · `assets/js/screens/step.js` — Step 1: campos de autoridade

**Problema:** "Anos de Experiência" e "Formação" saem como `—` no DOC-1. Estão no template do DOC-1 mas não são capturados em nenhum step.

**Localizar** a função `buildStep1()` em `assets/js/screens/step.js`. Ela começa algo assim:

```javascript
buildStep1() {
  const B = this.B;
  return `
    <p class="form-section-title">Identificação</p>
    ...
```

**Localizar** o final do conteúdo de `buildStep1()`, antes do `return` fechar com a crase final. Após o último campo existente (provavelmente `segmento` ou `tipo`), **adicionar**:

```javascript
<div class="form-divider"></div>
<p class="form-section-title">Autoridade Profissional</p>
<p class="form-section-title" style="font-size:12px;font-family:var(--font-body);font-weight:400;color:var(--text-secondary);border:none;padding:0;margin-top:-16px">
  Esses dados aparecem no schema JSON-LD e podem ser usados no copy de autoridade.
</p>

<div class="form-row">
  <div class="field-group">
    ${this.fieldLabel('anos_experiencia', 'Anos de experiência', false, true)}
    <input type="text" class="field-input" data-field="anos_experiencia"
      placeholder="Ex: 8 anos" value="${B.anos_experiencia || ''}">
  </div>
  <div class="field-group">
    ${this.fieldLabel('formacao', 'Formação', false, true)}
    <input type="text" class="field-input" data-field="formacao"
      placeholder="Ex: Nutricionista — CRN-3 12345" value="${B.formacao || ''}">
  </div>
</div>

<div class="field-group">
  ${this.fieldLabel('certificacoes', 'Certificações e especializações', false, true)}
  <input type="text" class="field-input" data-field="certificacoes"
    placeholder="Ex: Especialização em Nutrição Esportiva, Mestra em Nutrição Clínica"
    value="${B.certificacoes || ''}">
  <span class="field-hint">Separe por vírgula. Opcional — mas aumenta autoridade no copy.</span>
</div>
```

---

## FIX-A03 · `assets/js/screens/step.js` — Step 6: avatar com label corrigido

**Problema:** O campo "Profissão" do avatar não deixa claro que é a profissão do **cliente ideal**, não do prestador de serviço. No DOC-1 gerado veio "Nutricionista" — que é a profissão da Ana Ester, não do paciente.

**Localizar** a função `buildStep6()` em `assets/js/screens/step.js`. Dentro dela, encontrar o label/field do avatar relacionado a profissão. Deve ter algo como:

```javascript
${this.fieldLabel('publico_profissao', 'Profissão', ...)}
```

ou o campo de texto com `data-field="publico_profissao"` (ou nome similar).

**Localizar o placeholder e hint desse campo** e substituir para deixar claro:

Encontrar a linha com o input de profissão do avatar (procurar por `publico_profissao` ou campo de texto próximo a faixa etária/gênero no step 6). Substituir o `placeholder` e adicionar `hint`:

```javascript
placeholder="Ex: Professora, Advogada, Dona de casa, Empreendedora"
```

E adicionar após o input, se não houver hint:

```javascript
<span class="field-hint">Profissão do seu cliente ideal — não a sua.</span>
```

**Também no Step 6**, localizar os campos de faixa etária e gênero do avatar. Se estiverem faltando ou não estiverem no `REQUIRED_FIELDS`, **verificar** se existem os campos `publico_faixa_etaria` e `publico_genero`. Se existirem mas estiverem sem hint, adicionar:

Para faixa etária:
```javascript
<span class="field-hint">Ex: 28–45 anos. Ajuda a calibrar o tom do copy.</span>
```

Para gênero:
```javascript
<span class="field-hint">Ex: Majoritariamente feminino. Usado para pronomes no copy.</span>
```

---

## FIX-A04 · `assets/js/screens/step.js` — Step 7: depoimentos com validação e label correto

**Problema 1:** O campo de texto do depoimento não deixa claro que deve ser a voz do paciente. No DOC-1 veio um texto escrito em 1ª pessoa da nutricionista ("Todos os meus pacientes...").

**Problema 2:** Depoimento sem nome não é avisado — o usuário não sabe que será omitido na LP.

**Localizar** a função `buildStep7()` (ou o step de Diferenciais/Prova Social) em `assets/js/screens/step.js`. Encontrar os campos de depoimentos — devem ter inputs para nome e texto de 3 depoimentos.

**Para cada bloco de depoimento** (depoimento 1, 2 e 3), localizar o input de texto do depoimento:

```javascript
placeholder="..."  // placeholder atual do campo de texto do depoimento
```

**Substituir o placeholder** do campo de texto por:

```javascript
placeholder="Escreva na voz do paciente. Ex: Finalmente encontrei alguém que me escuta de verdade. Perdi 8kg sem passar fome. — Mariana, 34 anos"
```

**E adicionar** um hint abaixo do campo de texto de cada depoimento (se não houver):

```javascript
<span class="field-hint">Escreva o que o paciente diria, não o que você diria sobre ele. Depoimento sem nome não será incluído na página.</span>
```

**Para o campo de nome** de cada depoimento, adicionar hint se não houver:

```javascript
<span class="field-hint">Nome real ou primeiro nome + idade. Ex: Mariana R., 34 anos</span>
```

---

## FIX-A05 · `assets/js/screens/art.js` — Campo de descrição textual da logo

**Problema:** O sistema captura o status da logo (SVG/PNG/sem logo) mas não uma descrição textual. O DOC-1 exporta "—" em Logo. O gerador precisa saber o que renderizar no Header.

**Localizar** a seção "Ativos da Marca" em `buildArtScreen()` (em `assets/js/screens/art.js`). O bloco dos chips de status da logo:

```javascript
${this.fieldLabel('arte_logo', 'Status da logo', true)}
<div class="chip-group">
  ${[{ v: 'svg', l: 'SVG disponível' }, { v: 'png', l: 'PNG disponível' }, { v: 'nao', l: 'Sem logo' }].map(...
```

**Após o chip-group do status da logo** (depois do `</div>` que fecha o chip-group), **adicionar**:

```javascript
${B.arte_logo && B.arte_logo !== 'nao' ? `
<div class="field-group" style="margin-top:12px;">
  ${this.fieldLabel('arte_logo_descricao', 'Descrição da logo', false, true)}
  <input type="text" class="field-input" data-field="arte_logo_descricao"
    placeholder="Ex: Nome em fonte serifada + ícone de folha verde à esquerda"
    value="${B.arte_logo_descricao || ''}">
  <span class="field-hint">Descreva em palavras para o gerador saber como representar.</span>
</div>
` : ''}
```

---

## FIX-B01 · `assets/js/screens/review.js` — Bloquear exportação DOC-1 sem identidade visual

**Problema:** O botão de baixar DOC-1 fica habilitado mesmo com identidade visual zerada.

**Localizar** em `assets/js/screens/review.js` (ou em `04-handlers.js`) a função que renderiza ou controla o botão de download do DOC-1. Procurar por `btn-download-doc1`, `downloadDoc1`, `doc1` ou similar.

**Localizar a condição de disabled** do botão DOC-1 (deve ser similar ao botão de gerar DOC-IMPL).

**Adicionar** a seguinte verificação de identidade visual — criar a função helper `hasArteMinima()` no `Object.assign` de `review.js` ou `04-handlers.js` (onde estiver mais próximo da lógica de validação):

```javascript
hasArteMinima() {
  const B = this.B || {};
  // Aprovada via IA
  if (B.arte_ficha_aprovada) return true;
  // Aprovada manualmente (campos mínimos preenchidos)
  if (B.arte_cor_principal && B.arte_fonte_principal) return true;
  return false;
},
```

**No botão de download DOC-1** (localizar pelo ID ou texto no review.js), adicionar a condição:

```javascript
${!this.hasArteMinima() ? 'disabled' : ''}
```

**E adicionar um alerta visual** na tela de revisão quando identidade visual estiver zerada. Localizar em `buildReviewScreen()` (ou nome similar) o bloco de alertas/warnings. **Adicionar** junto aos outros alertas condicionais:

```javascript
${!this.hasArteMinima() ? `
<div class="review-pending-alert" style="border-color:var(--accent2-border);background:var(--accent2-dim);">
  <i data-lucide="palette" style="width:15px;height:15px;color:var(--accent2)"></i>
  <span style="color:var(--accent2)">Identidade visual não definida. Preencha cores e fonte na <strong>Direção de Arte</strong> para exportar o DOC-1.</span>
  <button class="btn-ghost btn-sm" onclick="App.goToScreen('art')">
    Ir para Arte →
  </button>
</div>
` : ''}
```

---

## FIX-B02 · `assets/js/screens/review.js` — Score detalhado por categoria

**Problema:** O score atual é um percentual geral. O usuário não sabe quais categorias estão incompletas.

**Localizar** em `assets/js/screens/review.js` a função que calcula o score de completude (procurar por `score`, `calcScore`, `completude` ou similar). Ela provavelmente itera sobre `REQUIRED_FIELDS`.

**Localizar** onde o score é exibido na tela de revisão — o bloco `review-score-banner`. Deve ter algo como:

```javascript
<div class="review-score-circle">${score}%</div>
```

**Após o bloco do score circle e barra**, adicionar o breakdown por categoria. **Localizar o fechamento do `review-score-banner`** e adicionar depois:

```javascript
<div class="review-score-breakdown" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
  ${[
    {
      label: 'Identidade Visual',
      fields: ['arte_cor_principal', 'arte_fonte_principal', 'arte_tema', 'arte_intensidade'],
      icon: 'palette',
    },
    {
      label: 'Autoridade',
      fields: ['anos_experiencia', 'formacao'],
      icon: 'award',
    },
    {
      label: 'Prova Social',
      fields: ['depoimento_1_nome', 'depoimento_1_texto', 'instagram'],
      icon: 'star',
    },
    {
      label: 'Rastreamento',
      fields: ['gtm_id'],
      icon: 'bar-chart-2',
    },
  ].map(cat => {
    const filled = cat.fields.filter(f => !!(this.B || {})[f]).length;
    const total = cat.fields.length;
    const pct = Math.round((filled / total) * 100);
    const color = pct === 100 ? 'var(--accent)' : pct === 0 ? 'var(--danger)' : 'var(--warning)';
    return `
      <div style="display:flex;align-items:center;gap:6px;font-size:11px;padding:4px 10px;border-radius:var(--r-pill);border:1px solid var(--border-default);background:var(--bg-raised);">
        <i data-lucide="${cat.icon}" style="width:12px;height:12px;color:${color}"></i>
        <span style="color:var(--text-secondary)">${cat.label}</span>
        <span style="font-family:var(--font-mono);font-size:10px;color:${color};font-weight:600">${filled}/${total}</span>
      </div>
    `;
  }).join('')}
</div>
```

**Após o innerHTML**, chamar `lucide.createIcons()` no bloco onde essa tela é renderizada (se já não estiver sendo chamado).

---

## FIX-B03 · `assets/js/screens/art.js` — Separar Modo Manual de Modo IA visualmente

**Problema:** A tela de arte mistura campos manuais e o botão de IA sem hierarquia clara. Quem quer preencher manualmente não entende o fluxo.

**Localizar** em `buildArtScreen()` o bloco `art-section` da seção "Direção Geral" (onde estão os campos de tema, intensidade, menu mobile e o botão de gerar IA).

**Substituir o título dessa seção** de:

```javascript
<span class="art-section-title">Direção Geral</span>
```

Para:

```javascript
<span class="art-section-title">Direção Geral</span>
```

*(mantém o título)*

**Localizar** o botão `btn-analyze-art` e o bloco `art-actions`. **Antes** desse bloco, adicionar um divisor com instrução clara:

```javascript
<div style="margin:16px 0;padding:12px 16px;background:var(--bg-raised);border-radius:var(--r-md);border:1px solid var(--border-default);">
  <p style="font-size:12px;color:var(--text-secondary);line-height:1.6;margin:0;">
    <strong style="color:var(--text-primary);">Dois caminhos:</strong>
    Preencha os campos acima (cores + fontes) e clique em <strong>Aprovar Manualmente</strong> — rápido e sem IA.
    Ou adicione referências de sites e clique em <strong>Gerar com IA</strong> para uma ficha completa com paleta e tipografia automáticas.
  </p>
</div>
```

---

## FIX-B04 · `assets/js/04-handlers.js` — Exportação DOC-1 incluir dados manuais de arte

**Problema:** A função que monta o DOC-1 lê `arte_ficha_aprovada` para a seção de Identidade Visual, mas se o campo for `null` (usuário não usou IA), exporta "—" mesmo que `arte_cor_principal` e `arte_fonte_principal` estejam preenchidos.

**Localizar** em `assets/js/04-handlers.js` a função que gera/monta o texto do DOC-1 — procurar por `buildDoc1`, `generateDoc1`, `IDENTIDADE VISUAL` ou `arte_ficha_aprovada`. Deve ter um bloco que monta a seção de identidade visual do markdown.

**Localizar** o trecho que exporta as cores e fontes para o DOC-1. Deve estar algo como:

```javascript
const fichaArte = B.arte_ficha_aprovada ? JSON.parse(B.arte_ficha_aprovada) : null;
// ...
`- **Cor Primária:** ${fichaArte?.paleta?.primaria || '—'}`
```

**Substituir** a lógica de fallback para puxar dos campos manuais quando não há ficha aprovada:

Encontrar o início da construção da ficha de arte para o DOC-1 e substituir por:

```javascript
let fichaArte = null;
try {
  fichaArte = B.arte_ficha_aprovada ? JSON.parse(B.arte_ficha_aprovada) : null;
} catch(e) { fichaArte = null; }

// Fallback para campos manuais se ficha não foi gerada por IA
const corPrimaria   = fichaArte?.paleta?.primaria   || B.arte_cor_principal  || '—';
const corSecundaria = fichaArte?.paleta?.secundaria  || B.arte_cor_secundaria || '—';
const corAcento     = fichaArte?.paleta?.acento      || B.arte_cor_acento     || '—';
const corFundo      = fichaArte?.paleta?.fundo       || B.arte_cor_fundo      || '—';
const fonteTitulo   = fichaArte?.tipografia?.display || B.arte_fonte_principal || '—';
const fonteCorpo    = fichaArte?.tipografia?.body    || B.arte_fonte_secundaria || '—';
const tomVisual     = fichaArte?.tom_visual          || [B.estilo_desejado, B.sensacao_visitante].filter(Boolean).join(', ') || '—';
const estiloVisual  = [B.estilo_desejado].filter(Boolean).join(', ') || '—';
```

**E substituir** as linhas do DOC-1 que usavam `fichaArte?.paleta?.primaria || '—'` por usar as variáveis acima:

```javascript
`- **Cor Primária:** ${corPrimaria}`,
`- **Cor Secundária:** ${corSecundaria}`,
`- **Cor de Acento:** ${corAcento}`,
`- **Cor de Fundo:** ${corFundo}`,
`- **Estilo Visual:** ${estiloVisual}`,
`- **Fonte Título:** ${fonteTitulo}`,
`- **Fonte Corpo:** ${fonteCorpo}`,
`- **Tom de Comunicação:** ${tomVisual}`,
```

---

## FIX-B05 · `assets/js/04-handlers.js` — Exportar novos campos do DOC-1

**Problema:** Os novos campos `anos_experiencia`, `formacao`, `certificacoes` e `arte_logo_descricao` não estão mapeados na exportação do DOC-1.

**Localizar** na função de geração do DOC-1 a seção `## IDENTIDADE E POSICIONAMENTO`. Deve ter:

```javascript
`- **Anos de Experiência:** ${B.anos_experiencia || '—'}`,
`- **Formação:** ${B.formacao || '—'}`,
`- **Certificações:** ${B.certificacoes || '—'}`,
```

Se essas linhas **já existem** no template do DOC-1 mas saem como `—`, é porque os campos não eram capturados — agora são (via FIX-A02). Verificar apenas que os nomes dos campos (`anos_experiencia`, `formacao`, `certificacoes`) batem com os `data-field` adicionados no FIX-A02.

**Localizar** também a seção `## IDENTIDADE VISUAL` e adicionar a linha de logo se não existir:

```javascript
`- **Logo (descrição):** ${B.arte_logo_descricao || (B.arte_logo === 'nao' ? 'Sem logo' : B.arte_logo ? `Arquivo ${B.arte_logo?.toUpperCase()} disponível` : '—')}`,
```

---

## VERIFICAÇÃO PÓS-IMPLEMENTAÇÃO

1. **FIX-A01:** Abrir tela de Arte → preencher "Cor Principal" e "Fonte Título" → botão "Aprovar Manualmente" aparece → clicar → `arte_ficha_aprovada` salvo → sidebar mostra check verde na Arte.

2. **FIX-A01 + B04:** Exportar DOC-1 após aprovação manual → seção IDENTIDADE VISUAL do arquivo deve ter as cores e fontes, não `—`.

3. **FIX-A02:** Step 1 → campos "Anos de experiência", "Formação" e "Certificações" visíveis → preencher → exportar DOC-1 → aparecem preenchidos.

4. **FIX-A03:** Step 6 → campo profissão do avatar tem hint "Profissão do seu cliente ideal — não a sua".

5. **FIX-A04:** Step 7 → campo de texto do depoimento tem placeholder com exemplo de voz do paciente e hint de aviso.

6. **FIX-B01:** Na tela de Revisão, sem identidade visual → botão DOC-1 aparece desabilitado + alerta azul com link para tela de Arte.

7. **FIX-B02:** Tela de Revisão → exibe mini-cards de score por categoria (Identidade Visual, Autoridade, Prova Social, Rastreamento).

8. **FIX-B03:** Tela de Arte → divisor entre campos manuais e botão IA com explicação dos dois caminhos.

9. **FIX-A05:** Na seção Ativos da Marca → quando logo está como SVG ou PNG, campo "Descrição da logo" aparece.

10. **Score final:** Preencher todos os campos → exportar DOC-1 → `grep "—"` no arquivo gerado deve retornar apenas GTM_ID (que é placeholder intencional).

---

## RESUMO DOS ARQUIVOS MODIFICADOS

| Arquivo | Fixes |
|---|---|
| `assets/js/screens/art.js` | FIX-A01, FIX-A05, FIX-B03 |
| `assets/js/screens/step.js` | FIX-A02, FIX-A03, FIX-A04 |
| `assets/js/screens/review.js` | FIX-B01, FIX-B02 |
| `assets/js/04-handlers.js` | FIX-A01 (bind botão), FIX-B04, FIX-B05 |

**Total:** 4 arquivos modificados · 9 fixes · 0 arquivos criados
