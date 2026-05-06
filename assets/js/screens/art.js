/* ============================================================
   LandingAI v2 — Screen: Art Direction
   ============================================================ */

Object.assign(window.App, {
  buildArtScreen() {
    const B = this.B;
    const pessoais = B.arte_referencias_pessoais || [];
    const nicho = B.arte_referencias_nicho || [];

    return `
    <div class="art-screen">

      <div class="art-screen-header">
        <h2 class="art-screen-title">Direção de Arte</h2>
        <p class="art-screen-desc">
          Cole referências pessoais e do nicho, suba ativos da marca e links.
          A IA analisa tudo e devolve uma ficha estruturada com paleta, tipografia e tom visual.
          Você aprova antes de qualquer geração.
        </p>
      </div>

      <!-- Ativos da Marca -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="image" class="art-section-icon" style="color:var(--accent2)"></i>
          <span class="art-section-title">Ativos da Marca</span>
        </div>
        <div class="art-section-body">
          <div id="art-upload-zone" class="upload-zone">
            <input type="file" multiple accept=".svg,.png,.jpg,.jpeg,.webp,.pdf">
            <i data-lucide="upload-cloud" class="upload-zone-icon"></i>
            <p class="upload-zone-label">Logo, fotos do profissional, materiais de marca</p>
            <p class="upload-zone-hint">SVG, PNG, JPG, WEBP, PDF — até 10MB por arquivo</p>
          </div>
          <div id="art-files-list" class="upload-preview-list"></div>

          <div class="form-row">
            <div class="field-group">
              ${this.fieldLabel('arte_logo', 'Status da logo', true)}
              <div class="chip-group">
                ${[{ v: 'svg', l: 'SVG disponível' }, { v: 'png', l: 'PNG disponível' }, { v: 'nao', l: 'Sem logo' }].map(o =>
      `<button class="chip ${B.arte_logo === o.v ? 'on' : ''}" data-field="arte_logo" data-chip="${o.v}">${o.l}</button>`
    ).join('')}
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_fotos', 'Fotos do profissional/produto', true)}
              <div class="chip-group">
                ${[{ v: 'boa', l: 'Boa qualidade' }, { v: 'media', l: 'Qualidade média' }, { v: 'nao', l: 'Sem fotos' }].map(o =>
      `<button class="chip ${B.arte_fotos === o.v ? 'on' : ''}" data-field="arte_fotos" data-chip="${o.v}">${o.l}</button>`
    ).join('')}
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                ${this.fieldLabel('arte_cor_principal', 'Cor principal da marca', false)}
              </div>
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_principal" value="${B.arte_cor_principal || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_principal"
                  placeholder="#HEX ou 'não definida'" value="${B.arte_cor_principal || ''}">
              </div>
            </div>
            <div class="field-group">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                ${this.fieldLabel('arte_cor_secundaria', 'Cor secundária', false)}
              </div>
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_secundaria" value="${B.arte_cor_secundaria || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_secundaria"
                  placeholder="#HEX ou 'não definida'" value="${B.arte_cor_secundaria || ''}">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Referências Pessoais -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="heart" class="art-section-icon" style="color:var(--warning)"></i>
          <span class="art-section-title">Referências Pessoais</span>
        </div>
        <div class="art-section-body">
          <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin-bottom:4px">
            Sites, marcas ou projetos que você admira visualmente. A IA vai acessar os links e "ver" o que te atraiu neles.
            Coloque o que te inspirou <em>e</em> o que adaptar para o nicho do cliente.
          </p>
          ${pessoais.map((ref, i) => this.buildRefItem('pessoais', i, ref)).join('')}
          <button class="btn-ghost btn-sm" data-add-ref="pessoais">
            <i data-lucide="plus" style="width:14px;height:14px"></i>
            Adicionar referência pessoal
          </button>
        </div>
      </div>

      <!-- Referências do Nicho -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="search" class="art-section-icon" style="color:var(--accent)"></i>
          <span class="art-section-title">Referências do Nicho</span>
        </div>
        <div class="art-section-body">
          <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin-bottom:4px">
            Sites de concorrentes ou do mesmo segmento. Ajuda a IA a entender o que o público espera ver
            — e o que evitar para se diferenciar.
          </p>
          ${nicho.map((ref, i) => this.buildRefItem('nicho', i, ref)).join('')}
          <button class="btn-ghost btn-sm" data-add-ref="nicho">
            <i data-lucide="plus" style="width:14px;height:14px"></i>
            Adicionar referência do nicho
          </button>
        </div>
      </div>

      <!-- Direção Geral -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="sliders" class="art-section-icon" style="color:var(--accent2)"></i>
          <span class="art-section-title">Direção Geral</span>
        </div>
        <div class="art-section-body">

          <div class="field-group">
            ${this.fieldLabel('arte_tema', 'Tema visual', true)}
            <div class="chip-group">
              ${[
        { v: 'escuro', l: 'Escuro (dark)' },
        { v: 'claro', l: 'Claro (light)' },
        { v: 'ia', l: 'IA decide baseado na marca' },
      ].map(o => `
                <button class="chip ${B.arte_tema === o.v ? 'on' : ''}" data-field="arte_tema" data-chip="${o.v}">${o.l}</button>
              `).join('')}
            </div>
          </div>

          <div class="field-group">
            ${this.fieldLabel('arte_intensidade', 'Intensidade visual', true)}
            <div class="sel-cards" data-field-group="arte_intensidade">
              ${[
        { v: 'contido', icon: 'minus-circle', title: 'Contido', desc: 'Animações sutis, foco no conteúdo. Consultórios, clínicas, B2B.' },
        { v: 'medio', icon: 'circle', title: 'Médio', desc: 'Presença notável. Profissionais criativos, mentores, premium.' },
        { v: 'alto', icon: 'zap-off', title: 'Alto', desc: 'Efeito uau total. Imersivo, editorial. Diferença imediata.' },
      ].map(o => `
                <div class="sel-card ${B.arte_intensidade === o.v ? 'on' : ''}" data-field="arte_intensidade" data-selcard="${o.v}" tabindex="0">
                  <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
                  <div>
                    <div class="sel-card-title">${o.title}</div>
                    <div class="sel-card-desc">${o.desc}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              ${this.fieldLabel('arte_menu_mobile', 'Menu mobile', false, true)}
              <div class="chip-group">
                ${['IA Decide', 'Fullscreen Overlay', 'Drawer Lateral', 'Simple Accordion'].map(l => `
                  <button class="chip ${B.arte_menu_mobile === l ? 'on' : ''}" data-field="arte_menu_mobile" data-chip="${l}">${l}</button>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="art-actions">
            <button id="btn-analyze-art" class="btn-primary">
              <i data-lucide="palette" style="width:16px;height:16px"></i>
              Gerar Ficha de Direção de Arte
            </button>
          </div>

        </div>
      </div>

    </div>
    `;
  },

  buildRefItem(type, i, ref) {
    const fieldPrefix = type === 'pessoais' ? 'arte_referencias_pessoais' : 'arte_referencias_nicho';
    return `
    <div class="art-ref-item">
      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('', 'URL do site / referência', false)}
          <input type="text" class="field-input" value="${ref.url || ''}"
            onchange="App.updateArtRef('${type}', ${i}, 'url', this.value)"
            placeholder="Ex: linear.app">
        </div>
        <div class="field-group">
          ${this.fieldLabel('', 'O que te atraiu?', false)}
          <input type="text" class="field-input" value="${ref.nota || ''}"
            onchange="App.updateArtRef('${type}', ${i}, 'nota', this.value)"
            placeholder="Ex: Tipografia forte e grid minimalista">
        </div>
        <button class="btn-icon danger" onclick="App.removeArtRef('${type}', ${i})" style="margin-top:24px">
          <i data-lucide="trash-2" style="width:16px;height:16px"></i>
        </button>
      </div>
    </div>
    `;
  }
});
