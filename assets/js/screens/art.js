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
              ${B.arte_logo && B.arte_logo !== 'nao' ? `
              <div class="field-group" style="margin-top:12px;">
                ${this.fieldLabel('arte_logo_descricao', 'Descrição da logo', false, true)}
                <input type="text" class="field-input" data-field="arte_logo_descricao"
                  placeholder="Ex: Nome em fonte serifada + ícone de folha verde à esquerda"
                  value="${B.arte_logo_descricao || ''}">
                <span class="field-hint">Descreva em palavras para o gerador saber como representar.</span>
              </div>
              ` : ''}
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

          <!-- Grupo: Cores da Marca -->
          <div class="form-section-title" style="margin-top: 16px;">Cores da Marca</div>
          <div class="form-row-3">
            <div class="field-group">
              ${this.fieldLabel('arte_cor_principal', 'Cor Principal', false)}
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_principal" value="${B.arte_cor_principal || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_principal"
                  placeholder="#HEX" value="${B.arte_cor_principal || ''}">
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_cor_secundaria', 'Cor Secundária', false)}
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_secundaria" value="${B.arte_cor_secundaria || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_secundaria"
                  placeholder="#HEX" value="${B.arte_cor_secundaria || ''}">
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_cor_complementar', 'Cor Auxiliar/Complementar', false)}
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" data-field="arte_cor_complementar" value="${B.arte_cor_complementar || '#000000'}">
                </div>
                <input type="text" class="field-input color-picker-input" data-field="arte_cor_complementar"
                  placeholder="#HEX" value="${B.arte_cor_complementar || ''}">
              </div>
            </div>
          </div>

          <!-- Grupo: Cores de Base / Layout -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 24px; margin-bottom: 8px;">
            <div class="form-section-title" style="margin: 0; padding: 0; border: none;">Cores de Base / Layout</div>
            
            <div class="field-group" style="flex-direction: row; align-items: center; gap: 8px;">
              <span style="font-size: 11px; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase;">Preset:</span>
              <select class="field-select" style="padding: 4px 8px; width: 140px; font-size: 12px;" onchange="App.applyColorPreset(this.value)">
                <option value="">Personalizado...</option>
                <option value="neutro">Neutro/Quente</option>
                <option value="tech">Tech/Frio</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
          </div>

          <div class="form-row-3">
            <div class="field-group">
              ${this.fieldLabel('arte_cor_fundo', 'Fundo (Branco)', false)}
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" id="input-color-fundo" data-field="arte_cor_fundo" value="${B.arte_cor_fundo || '#ffffff'}">
                </div>
                <input type="text" id="text-color-fundo" class="field-input color-picker-input" data-field="arte_cor_fundo"
                  placeholder="#HEX" value="${B.arte_cor_fundo || '#ffffff'}">
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_cor_texto', 'Texto Principal (Preto)', false)}
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" id="input-color-texto" data-field="arte_cor_texto" value="${B.arte_cor_texto || '#1d1d1c'}">
                </div>
                <input type="text" id="text-color-texto" class="field-input color-picker-input" data-field="arte_cor_texto"
                  placeholder="#HEX" value="${B.arte_cor_texto || '#1d1d1c'}">
              </div>
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_cor_suporte', 'Texto Suporte (Cinza)', false)}
              <div class="color-picker-wrap">
                <div class="color-picker-swatch">
                  <input type="color" id="input-color-suporte" data-field="arte_cor_suporte" value="${B.arte_cor_suporte || '#535353'}">
                </div>
                <input type="text" id="text-color-suporte" class="field-input color-picker-input" data-field="arte_cor_suporte"
                  placeholder="#HEX" value="${B.arte_cor_suporte || '#535353'}">
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Tipografia -->
      <div class="art-section">
        <div class="art-section-header">
          <i data-lucide="type" class="art-section-icon" style="color:var(--accent)"></i>
          <span class="art-section-title">Tipografia</span>
        </div>
        <div class="art-section-body">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <p style="font-size:12.5px;color:var(--text-secondary);line-height:1.6;margin:0;">
              Defina as famílias de fontes que guiarão o layout.
            </p>
            <div class="field-group" style="flex-direction: row; align-items: center; gap: 8px;">
              <span style="font-size: 11px; color: var(--text-tertiary); font-weight: 600; text-transform: uppercase;">Preset:</span>
              <select class="field-select" style="padding: 4px 8px; width: 170px; font-size: 12px;" onchange="App.applyFontPreset(this.value)">
                <option value="">Personalizado...</option>
                <option value="tech">Tech / Clean (Inter/Inter)</option>
                <option value="moderno">Moderno / Startup (Poppins/Open Sans)</option>
                <option value="elegante">Elegante / Premium (Playfair/Lato)</option>
                <option value="editorial">Editorial / Clássico (Merriweather/Source Sans)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              ${this.fieldLabel('arte_fonte_principal', 'Fonte Principal (Títulos)', false)}
              <input type="text" id="input-fonte-principal" class="field-input" data-field="arte_fonte_principal"
                placeholder="Ex: Inter" value="${B.arte_fonte_principal || 'Inter'}">
            </div>
            <div class="field-group">
              ${this.fieldLabel('arte_fonte_secundaria', 'Fonte Secundária (Textos de Apoio)', false)}
              <input type="text" id="input-fonte-secundaria" class="field-input" data-field="arte_fonte_secundaria"
                placeholder="Ex: Inter" value="${B.arte_fonte_secundaria || 'Inter'}">
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

          <div style="margin:16px 0;padding:12px 16px;background:var(--bg-raised);border-radius:var(--r-md);border:1px solid var(--border-default);">
            <p style="font-size:12px;color:var(--text-secondary);line-height:1.6;margin:0;">
              <strong style="color:var(--text-primary);">Dois caminhos:</strong>
              Preencha os campos acima (cores + fontes) e clique em <strong>Aprovar Manualmente</strong> — rápido e sem IA.
              Ou adicione referências de sites e clique em <strong>Gerar com IA</strong> para uma ficha completa com paleta e tipografia automáticas.
            </p>
          </div>

          <div class="art-actions">
            <button id="btn-analyze-art" class="btn-primary">
              <i data-lucide="sparkles" style="width:16px;height:16px"></i>
              Gerar com IA
            </button>
            <button id="btn-approve-art-manual" class="btn-secondary"
              style="display:${(B.arte_cor_principal || B.arte_fonte_principal) ? '' : 'none'}">
              <i data-lucide="check" style="width:16px;height:16px"></i>
              Aprovar Direção Manualmente
            </button>
          </div>
          <p class="art-manual-hint" style="font-size:11.5px;color:var(--text-tertiary);margin-top:8px;text-align:center;">
            ${!(B.arte_cor_principal || B.arte_fonte_principal) ? 'Preencha Cor Principal ou Fonte Título para aprovar sem IA.' : 'Campos detectados — você pode aprovar sem usar a IA.'}
          </p>

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
  },

  applyColorPreset(preset) {
    if (!preset) return;

    const presets = {
      neutro: { fundo: '#ffffff', texto: '#1d1d1c', suporte: '#535353' },
      tech: { fundo: '#f8fafc', texto: '#0f172a', suporte: '#475569' },
      dark: { fundo: '#18181b', texto: '#f4f4f5', suporte: '#a1a1aa' }
    };

    const colors = presets[preset];
    if (colors) {
      // Atualizar os inputs DOM
      document.getElementById('input-color-fundo').value = colors.fundo;
      document.getElementById('text-color-fundo').value = colors.fundo;
      document.getElementById('input-color-texto').value = colors.texto;
      document.getElementById('text-color-texto').value = colors.texto;
      document.getElementById('input-color-suporte').value = colors.suporte;
      document.getElementById('text-color-suporte').value = colors.suporte;

      // Atualizar o estado App.B
      this.setField('arte_cor_fundo', colors.fundo);
      this.setField('arte_cor_texto', colors.texto);
      this.setField('arte_cor_suporte', colors.suporte);
      
      this.showToast('Cores de Base atualizadas com sucesso.', 'success');
    }
  },

  applyFontPreset(preset) {
    if (!preset) return;

    const presets = {
      tech: { principal: 'Inter', secundaria: 'Inter' },
      moderno: { principal: 'Poppins', secundaria: 'Open Sans' },
      elegante: { principal: 'Playfair Display', secundaria: 'Lato' },
      editorial: { principal: 'Merriweather', secundaria: 'Source Sans Pro' }
    };

    const fonts = presets[preset];
    if (fonts) {
      // Atualizar os inputs DOM
      const inputPrincipal = document.getElementById('input-fonte-principal');
      const inputSecundaria = document.getElementById('input-fonte-secundaria');
      
      if (inputPrincipal) inputPrincipal.value = fonts.principal;
      if (inputSecundaria) inputSecundaria.value = fonts.secundaria;

      // Atualizar o estado App.B
      this.setField('arte_fonte_principal', fonts.principal);
      this.setField('arte_fonte_secundaria', fonts.secundaria);
      
      this.showToast('Combinação de fontes aplicada com sucesso.', 'success');
    }
  },

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
  }
});
