/* ============================================================
   LandingAI v2 — Screen: Intake
   ============================================================ */

Object.assign(window.App, {
  buildIntakeScreen() {
    const B = this.B;
    return `
    <div class="intake-screen">

      <div class="intake-hero">
        <div class="intake-badge">
          <i data-lucide="zap" style="width:12px;height:12px"></i>
          v3 — Assistente Inteligente
        </div>
        <h2 class="intake-title">Cole o briefing.<br>A IA faz o resto.</h2>
        <p class="intake-subtitle">
          Cole o briefing preenchido pelo cliente, textos de WhatsApp, PDFs ou qualquer material coletado.
          A IA analisa, extrai e preenche todos os steps automaticamente.
          Você só revisa e ajusta.
        </p>
      </div>

      <!-- Box principal: Briefing -->
      <div class="intake-box">
        <div class="intake-box-header">
          <i data-lucide="file-text" class="intake-box-icon" style="width:18px;height:18px"></i>
          <span class="intake-box-title">Material do cliente</span>
          <span class="intake-box-desc">Cole texto, links ou suba arquivos</span>
        </div>
        <div class="intake-box-body">

          <div class="field-group">
            ${this.fieldLabel('briefing_bruto', 'Briefing e materiais do cliente', false)}
            <textarea
              class="field-textarea xtall"
              data-field="briefing_bruto"
              placeholder="Cole aqui tudo que você tem: briefing preenchido pelo cliente, textos de WhatsApp, observações da conversa, links relevantes, qualquer coisa.

A IA lê tudo e preenche os campos automaticamente. Quanto mais contexto, melhor o resultado."
            >${B.briefing_bruto || ''}</textarea>
            <span class="field-hint">Pode colar em formato bruto — não precisa formatar nada.</span>
          </div>

          <div class="intake-or">ou anexe arquivos</div>

          <div id="intake-upload-zone" class="upload-zone">
            <input type="file" id="intake-upload-input" multiple
              accept=".txt,.pdf,.doc,.docx,.md"
              style="display:none">
            <i data-lucide="upload-cloud" class="upload-zone-icon"></i>
            <p class="upload-zone-label">Arraste arquivos ou clique para selecionar</p>
            <p class="upload-zone-hint">PDF, Word, TXT, MD — o texto será extraído e somado ao briefing</p>
          </div>
          <div id="intake-files-list" class="upload-preview-list"></div>

          <div class="intake-actions">
            <div class="field-group" style="flex:1">
              ${this.fieldLabel('', 'Modelo para análise', false)}
              <div class="btn-model" style="width:fit-content;cursor:default">
                <i data-lucide="cpu" style="width:14px;height:14px"></i>
                <span id="intake-model-name">${AI_MODELS[this.state.selectedModel]?.label || 'Selecionar Modelo'}</span>
              </div>
            </div>
            <button class="btn-primary" id="btn-analyze">
              <i data-lucide="sparkles" style="width:15px;height:15px"></i>
              Analisar e Preencher Steps
            </button>
          </div>

        </div>
      </div>

      <!-- Hint SOP -->
      <div class="intake-sop-hint">
        <i data-lucide="info" class="intake-sop-hint-icon" style="width:15px;height:15px"></i>
        <p class="intake-sop-hint-text">
          <strong>Dica do SOP:</strong> Quanto mais contexto você colocar — briefing preenchido, conversa de WhatsApp, observações suas sobre tom de voz —
          mais precisa será a análise. Se quiser preencher manualmente, use a navegação no lado esquerdo para ir direto a qualquer step.
        </p>
      </div>

      <!-- Atalho: ir direto para step 1 -->
      <div style="text-align:center">
        <button class="btn-ghost btn-sm" onclick="App.goToStep(1)">
          <i data-lucide="list" style="width:14px;height:14px"></i>
          Preencher manualmente sem análise
        </button>
      </div>

    </div>
    `;
  }
});
