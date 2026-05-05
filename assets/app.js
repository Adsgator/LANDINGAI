/**
 * LandingAI - Logic Core
 */

const App = {
  currentStep: 1,
  totalSteps: 9,
  apiKey: localStorage.getItem('landingai_gemini_key') || '',
  mode: 'prompt', // 'api' | 'prompt'
  generatedDoc3: '',
  
  // Briefing state
  briefing: {
    // Etapa 1
    tipo: '', nome_cliente: '', slug: '', dominio: '', data: new Date().toISOString().split('T')[0],
    
    // Etapa 2
    nicho: '', servico_produto: '', objetivo_conversao: '',
    cidade: '', modalidade: '', incluso: '', duracao: '',
    garantia: '', apresentacao: '', contexto_extra: '',
    
    // Etapa 3
    publico_primario: '', publico_secundario: '',
    faixa_etaria: '', perfil_socioeconomico: '', maturidade: '',
    dores: '', palavras_busca: '', resultado_desejado: '', objecoes: '',
    
    // Etapa 4
    tipo_cta: '', whatsapp: '', mensagem_whatsapp: '',
    email_formulario: '', web3forms_key: '', campos_formulario: [],
    gtm_id: '', telefone: '', texto_botao: '',
    micro_garantias: '', ctas_rastreamento: [], link_agendamento: '', agendamento_tipo: '',
    
    // Etapa 5
    personalidade: '', vocab_usa: '', vocab_proibido: '', frase_tom: '',
    
    // Etapa 6
    intensidade: '', tema: '', referencias: '', cor_principal: '',
    cor_secundaria: '', logo_status: '', estilo_geral: '',
    o_que_nao_quero: '', menu_mobile: '', elemento_menu: '',
    
    // Etapa 7
    foto: '', logo_arquivo: '', depoimentos: '',
    google_business: '', nota_google: '', instagram: '',
    instagram_handle: '', endereco: '', endereco_completo: '',
    outros_assets: '',
    
    // Etapa 8
    integracoes: [], info_precos: '', obs_tecnicas: '',
  },

  visitedSteps: new Set([1]),

  init() {
    this.renderSidebar();
    this.goToStep(1);
    this.setupEventListeners();
    this.checkAPIStatus();
    this.checkDraft();
  },

  renderSidebar() {
    const navSteps = document.getElementById('nav-steps');
    navSteps.innerHTML = '';
    
    const steps = [
      'Identificação', 'Negócio', 'Público', 'Conversão',
      'Tom de Voz', 'Direção Visual', 'Assets', 'Integrações'
    ];

    steps.forEach((name, i) => {
      const stepNum = i + 1;
      const item = document.createElement('a');
      item.href = '#';
      item.className = `nav-item ${this.currentStep === stepNum ? 'active' : ''} ${this.visitedSteps.has(stepNum) ? 'visited' : ''}`;
      item.dataset.step = stepNum;
      item.innerHTML = `
        <div class="step-num">${this.visitedSteps.has(stepNum) && this.currentStep !== stepNum ? '✓' : stepNum}</div>
        <span>${name}</span>
      `;
      item.onclick = (e) => {
        e.preventDefault();
        if (this.visitedSteps.has(stepNum)) this.goToStep(stepNum);
      };
      navSteps.appendChild(item);
    });

    // Update Step 9 separately
    const step9 = document.getElementById('nav-step-9');
    step9.className = `nav-item ${this.currentStep === 9 ? 'active' : ''} ${this.visitedSteps.has(9) ? 'visited' : ''}`;
    step9.querySelector('.step-num').textContent = this.visitedSteps.has(9) && this.currentStep !== 9 ? '✓' : '9';
    step9.onclick = (e) => {
      e.preventDefault();
      if (this.visitedSteps.has(9)) this.goToStep(9);
    };
  },

  goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;
    
    this.currentStep = step;
    this.visitedSteps.add(step);
    
    this.renderSidebar();
    this.renderStepContent();
    this.updateTopbar();
    this.updateNavigationButtons();
    
    // Scroll to top
    document.querySelector('.scroll-area').scrollTop = 0;
  },

  updateTopbar() {
    const titles = {
      1: ['Identificação do Projeto', 'Defina a identidade base e os nomes do projeto'],
      2: ['Negócio & Serviço', 'Contextualize o que é oferecido e o posicionamento'],
      3: ['Público & Intenção', 'Mapeie quem compra e como pensa antes de pesquisar'],
      4: ['Conversão & Rastreamento', 'Defina os dados técnicos de conversão e eventos'],
      5: ['Tom de Voz', 'Capture a voz da marca e diretrizes de copy'],
      6: ['Direção Visual & Design', 'Defina a identidade visual e experiência do usuário'],
      7: ['Assets Disponíveis', 'Informe os materiais existentes para o projeto'],
      8: ['Integrações', 'Confirme os blocos técnicos que entram no projeto'],
      9: ['Revisar & Gerar', 'Valide os dados e acione a geração do Doc 3']
    };

    const [title, subtitle] = titles[this.currentStep];
    document.getElementById('current-step-title').textContent = title;
    document.getElementById('current-step-subtitle').textContent = subtitle;
    
    const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    document.getElementById('main-progress-bar').style.width = `${progress}%`;
  },

  updateNavigationButtons() {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    btnPrev.disabled = this.currentStep === 1;
    
    if (this.currentStep === this.totalSteps) {
      btnNext.style.display = 'none';
    } else {
      btnNext.style.display = 'flex';
      btnNext.textContent = 'Próximo →';
    }
  },

  renderStepContent() {
    const container = document.getElementById('step-content');
    
    // Se mudou o passo, resetamos o scroll e limpamos o container
    if (this._lastRenderedStep !== this.currentStep) {
      container.innerHTML = '';
      this._lastRenderedStep = this.currentStep;
      
      switch(this.currentStep) {
        case 1: this.renderStep1(container); break;
        case 2: this.renderStep2(container); break;
        case 3: this.renderStep3(container); break;
        case 4: this.renderStep4(container); break;
        case 5: this.renderStep5(container); break;
        case 6: this.renderStep6(container); break;
        case 7: this.renderStep7(container); break;
        case 8: this.renderStep8(container); break;
        case 9: this.renderStep9(container); break;
      }
      document.querySelector('.scroll-area').scrollTop = 0;
    }

    this.syncFieldValues(container);
  },

  syncFieldValues(container) {
    if (!container) return;

    // PROTEÇÃO CRÍTICA DE FOCO: Nunca alteramos o valor do campo que o usuário está digitando agora
    const activeEl = document.activeElement;

    container.querySelectorAll('input[data-field], textarea[data-field], select[data-field]').forEach(el => {
      if (el === activeEl) return; // Pula o campo focado
      
      const val = this.briefing[el.dataset.field] || '';
      if (el.value !== val) el.value = val;
    });
    
    // Atualiza estados visuais de chips e cards sem re-renderizar
    container.querySelectorAll('.chip, .sel-card').forEach(el => {
      const onclick = el.getAttribute('onclick') || '';
      const match = onclick.match(/setField\('([^']*)', '([^']*)'/) || 
                    onclick.match(/toggleArrayField\('([^']*)', '([^']*)'/);
      
      if (match) {
        const [_, field, value] = match;
        const state = this.briefing[field];
        const isActive = Array.isArray(state) ? state.includes(value) : state === value;
        el.classList.toggle('on', isActive);
      }
    });

    // Atualiza labels dinâmicas (ex: Step 2 Serviço/Produto)
    container.querySelectorAll('.dynamic-label-tipo').forEach(label => {
      label.textContent = this.briefing.tipo === 'Serviço' ? 'Serviço' : 'Produto';
    });
  },

  // --- Step Renders ---

  renderStep1(container) {
    container.innerHTML = `
      <div class="field-group full" style="margin-bottom:32px;">
        <label>Tipo de Projeto</label>
        <div class="selection-grid">
          <div class="sel-card" onclick="App.setField('tipo', 'Serviço', true)">
            <div class="card-title">SERVIÇO</div>
            <div class="card-desc">Prestação de serviço ou resultado. Ex: clínica, coach, advocacia, adestramento.</div>
          </div>
          <div class="sel-card" onclick="App.setField('tipo', 'Produto', true)">
            <div class="card-title">PRODUTO</div>
            <div class="card-desc">Venda de produto físico ou digital. Ex: curso online, software, e-book.</div>
          </div>
        </div>
      </div>

      <div class="form-grid">
        <div class="field-group">
          <label>Nome do Cliente / Projeto *</label>
          <input type="text" data-field="nome_cliente" placeholder="ex: Beatriz Mattos, Clínica Vita">
        </div>
        <div class="field-group">
          <label>Slug do Projeto *</label>
          <input type="text" id="field-slug" data-field="slug" placeholder="ex: beatriz-mattos">
        </div>
        <div class="field-group">
          <label>Agência Responsável</label>
          <input type="text" data-field="agencia">
        </div>
        <div class="field-group">
          <label>Data do Briefing</label>
          <input type="date" data-field="data">
        </div>
        <div class="field-group full">
          <label>Domínio Final</label>
          <input type="text" data-field="dominio" placeholder="ex: beatrizmattos.com.br">
        </div>
      </div>
    `;
  },

  renderStep2(container) {
    container.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label>Nicho / Segmento *</label>
          <input type="text" data-field="nicho" placeholder="ex: Adestramento comportamental">
        </div>
        <div class="field-group">
          <label><span class="dynamic-label-tipo">Serviço</span> Principal *</label>
          <input type="text" data-field="servico_produto" placeholder="ex: Mentoria online">
        </div>
        <div class="field-group">
          <label>Objetivo de Conversão *</label>
          <input type="text" data-field="objetivo_conversao" placeholder="ex: Mensagem no WhatsApp">
        </div>
        <div class="field-group">
          <label>Cidade / Região *</label>
          <input type="text" data-field="cidade" placeholder="ex: São Paulo SP, Online Brasil">
        </div>
        <div class="field-group full">
          <label>Modalidade *</label>
          <div class="chips-container">
            ${['Presencial', 'Online', 'Híbrido', 'Domiciliar'].map(m => `
              <div class="chip" onclick="App.setField('modalidade', '${m}', true)">${m}</div>
            `).join('')}
          </div>
        </div>

        <div class="field-group">
          <label>O que está incluso *</label>
          <input type="text" data-field="incluso" placeholder="ex: 4 sessões, relatório...">
        </div>
        <div class="field-group">
          <label><span class="dynamic-label-tipo">Duração / Formato</span> *</label>
          <input type="text" data-field="duracao" placeholder="ex: 8 semanas, 3 dias úteis">
        </div>
        <div class="field-group">
          <label>Garantia</label>
          <input type="text" data-field="garantia" placeholder="ex: 7 dias incondicional">
        </div>
        <div class="field-group">
          <label>Extra / Contexto</label>
          <input type="text" data-field="extra_negocio" placeholder="ex: Cão > 6 meses, Hotmart">
        </div>

        <div class="field-group full">
          <label>Apresentação do Negócio *</label>
          <textarea data-field="apresentacao" placeholder="Descreva o negócio com suas próprias palavras..."></textarea>
        </div>
        <div class="field-group full">
          <label>Contexto Extra / Observações</label>
          <textarea data-field="contexto_extra" placeholder="Nuances, detalhes do cliente, prints..."></textarea>
        </div>
      </div>
    `;
  },

  renderStep3(container) {
    container.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label>Público Primário *</label>
          <input type="text" data-field="publico_primario">
        </div>
        <div class="field-group">
          <label>Público Secundário</label>
          <input type="text" data-field="publico_secundario">
        </div>
        <div class="field-group">
          <label>Faixa Etária *</label>
          <input type="text" data-field="faixa_etaria">
        </div>
        <div class="field-group">
          <label>Perfil Socioeconômico *</label>
          <input type="text" data-field="perfil_socioeconomico">
        </div>
        <div class="field-group full">
          <label>Maturidade do Público</label>
          <div class="selection-grid">
            ${['FRIO', 'MORNO', 'QUENTE', 'MUITO QUENTE'].map(m => `
              <div class="sel-card" onclick="App.setField('maturidade', '${m}', true)">
                <div class="card-title">${m}</div>
                <div class="card-desc">${this.getMaturityDesc(m)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="field-group full">
          <label>Dores Principais *</label>
          <textarea data-field="dores" placeholder="Liste as principais dores..."></textarea>
        </div>
        <div class="field-group full">
          <label>Palavras de Busca *</label>
          <textarea data-field="palavras_busca" placeholder="ex: 'adestrador de cão online'..."></textarea>
        </div>
        <div class="field-group full">
          <label>Resultado Desejado *</label>
          <textarea data-field="resultado_desejado" placeholder="O que o cliente imagina conquistar..."></textarea>
        </div>
        <div class="field-group full">
          <label>Objeções Principais *</label>
          <textarea data-field="objecoes" placeholder="Por que ainda não comprou?"></textarea>
        </div>
      </div>
    `;
  },

  getMaturityDesc(m) {
    const descs = {
      'FRIO': 'Não sabe que tem o problema. Precisa ser educado.',
      'MORNO': 'Sabe do problema, não conhece a solução.',
      'QUENTE': 'Conhece a solução, compara opções.',
      'MUITO QUENTE': 'Pronto para comprar — precisa do gatilho.'
    };
    return descs[m] || '';
  },

  renderStep4(container) {
    container.innerHTML = `
      <div class="field-group full" style="margin-bottom:32px;">
        <label>Tipo de CTA Principal *</label>
        <div class="selection-grid">
          <div class="sel-card" onclick="App.setField('tipo_cta', 'WHATSAPP', true)">
            <div class="card-title">WHATSAPP</div>
            <div class="card-desc">Link wa.me com mensagem pré-preenchida.</div>
          </div>
          <div class="sel-card" onclick="App.setField('tipo_cta', 'FORMULÁRIO', true)">
            <div class="card-title">FORMULÁRIO</div>
            <div class="card-desc">Web3Forms com email de destino.</div>
          </div>
          <div class="sel-card" onclick="App.setField('tipo_cta', 'AGENDAMENTO', true)">
            <div class="card-title">AGENDAMENTO</div>
            <div class="card-desc">Link externo Calendly ou embed.</div>
          </div>
        </div>
      </div>

      <div id="cta-dynamic-fields">
        ${this.renderCTAFelds()}
      </div>

      <div class="form-grid">
        <div class="field-group">
          <label>ID do Google Tag Manager</label>
          <input type="text" data-field="gtm_id" placeholder="ex: GTM-XXXXXXX">
        </div>
        <div class="field-group">
          <label>Telefone para ligação</label>
          <input type="text" data-field="telefone" placeholder="ex: (11) 99999-0000">
        </div>
        <div class="field-group full">
          <label>CTAs de Rastreamento</label>
          <div class="chips-container">
            ${['contato_wpp', 'view_content', 'view_links', 'agendamento_iniciado', 'formulario_enviado', 'ligacao_mobile', 'download'].map(c => `
              <div class="chip" onclick="App.toggleArrayField('ctas_rastreamento', '${c}')">${c}</div>
            `).join('')}
          </div>
        </div>
        <div class="field-group">
          <label>Texto do Botão Principal *</label>
          <input type="text" data-field="texto_botao" placeholder="ex: Quero Iniciar a Mentoria">
        </div>
        <div class="field-group">
          <label>Micro-garantias do CTA</label>
          <input type="text" data-field="micro_garantias" placeholder="ex: ✓ Resposta em até 1h">
        </div>
      </div>
    `;
  },

  renderCTAFelds() {
    const b = this.briefing;
    if (b.tipo_cta === 'WHATSAPP') {
      return `
        <div class="form-grid">
          <div class="field-group">
            <label>Número WhatsApp *</label>
            <input type="text" data-field="whatsapp" placeholder="5511918952921">
          </div>
          <div class="field-group">
            <label>Mensagem Pré-preenchida *</label>
            <input type="text" data-field="mensagem_whatsapp">
          </div>
        </div>
      `;
    }
    if (b.tipo_cta === 'FORMULÁRIO') {
      return `
        <div class="form-grid">
          <div class="field-group">
            <label>Email de Destino *</label>
            <input type="email" data-field="email_formulario">
          </div>
          <div class="field-group">
            <label>Access Key Web3Forms</label>
            <input type="text" data-field="web3forms_key">
          </div>
        </div>
      `;
    }
    if (b.tipo_cta === 'AGENDAMENTO') {
      return `
        <div class="form-grid">
          <div class="field-group">
            <label>Link de Agendamento *</label>
            <input type="url" data-field="link_agendamento">
          </div>
          <div class="field-group">
            <label>Abrir em</label>
            <div class="chips-container">
              <div class="chip" onclick="App.setField('agendamento_tipo', 'Nova aba', true)">Nova aba</div>
              <div class="chip" onclick="App.setField('agendamento_tipo', 'Embed', true)">Embed na página</div>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  },

  renderStep5(container) {
    container.innerHTML = `
      <div class="form-grid">
        <div class="field-group full">
          <label>Personalidade da Marca *</label>
          <input type="text" data-field="personalidade" placeholder="ex: Técnico e direto / Acolhedor...">
        </div>
        <div class="field-group full">
          <label>Vocabulário que DEVE aparecer na copy</label>
          <textarea data-field="vocab_usa" placeholder="Palavras e expressões que o cliente usa..."></textarea>
        </div>
        <div class="field-group full">
          <label>Vocabulário PROIBIDO</label>
          <textarea data-field="vocab_proibido" placeholder="O que o cliente jamais diria..."></textarea>
        </div>
        <div class="field-group full">
          <label>Frase que resume o tom</label>
          <input type="text" data-field="frase_tom">
        </div>
      </div>
      <!-- DNA Blocks remained as static -->
      <div class="dna-block">
        <div class="dna-header"><span class="pulse">●</span> DNA ADSGATOR — SEMPRE APLICADO</div>
        <div class="dna-grid">
          <div class="dna-column">
            <h4>PROIBIDO</h4>
            <ul class="dna-list">
              <li class="proibido">✗ "inovador", "excelência", "missão"</li>
              <li class="proibido">✗ "saiba mais", "clique aqui"</li>
            </ul>
          </div>
          <div class="dna-column">
            <h4>OBRIGATÓRIO</h4>
            <ul class="dna-list">
              <li class="permitido">✓ H1 espelha a dor da busca</li>
              <li class="permitido">✓ Vender alívio, não técnica</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },

  renderStep6(container) {
    container.innerHTML = `
      <div class="field-group full" style="margin-bottom:32px;">
        <label>Intensidade Visual *</label>
        <div class="selection-grid">
          ${['CONTIDO', 'MÉDIO', 'ALTO'].map(v => `
            <div class="sel-card" onclick="App.setField('intensidade', '${v}', true)">
              <div class="card-title">${v}</div>
              <div class="card-desc">${this.getIntensityDesc(v)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="form-grid">
        <div class="field-group full">
          <label>Tema</label>
          <div class="chips-container">
            ${['Claro', 'Escuro', 'IA decide'].map(t => `
              <div class="chip" onclick="App.setField('tema', '${t}', true)">${t}</div>
            `).join('')}
          </div>
        </div>
        <div class="field-group full">
          <label>Referências Visuais *</label>
          <textarea data-field="referencias" placeholder="Link ou descrição + o que atraiu..."></textarea>
        </div>
        <div class="field-group">
          <label>Cor Principal</label>
          <input type="text" data-field="cor_principal" placeholder="ex: #1A4731">
        </div>
        <div class="field-group">
          <label>Cor Secundária</label>
          <input type="text" data-field="cor_secundaria">
        </div>
        <div class="field-group">
          <label>Logo Disponível</label>
          <div class="chips-container">
            ${['SVG', 'PNG', 'Não tem'].map(l => `
              <div class="chip" onclick="App.setField('logo_status', '${l}', true)">${l}</div>
            `).join('')}
          </div>
        </div>
        <div class="field-group full">
          <label>Estilo Geral *</label>
          <input type="text" data-field="estilo_geral" placeholder="ex: Sóbrio e técnico, premium europeu...">
        </div>
        <div class="field-group full">
          <label>O que NÃO quero *</label>
          <input type="text" data-field="o_que_nao_quero" placeholder="ex: Nada que pareça clínica genérica...">
        </div>
        <div class="field-group full">
          <label>Menu Mobile</label>
          <div class="selection-grid">
            ${['FULLSCREEN', 'DRAWER', 'BOTTOM SHEET', 'IA DECIDE'].map(m => `
              <div class="sel-card" onclick="App.setField('menu_mobile', '${m}', true)">
                <div class="card-title">${m}</div>
                <div class="card-desc">${this.getMenuDesc(m)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  getIntensityDesc(v) {
    const d = {
      'CONTIDO': 'Animações sutis. Foco na copy.',
      'MÉDIO': 'Presença notável. Personalidade clara.',
      'ALTO': 'Efeito uau total. Scroll experience.'
    };
    return d[v] || '';
  },

  getMenuDesc(m) {
    const d = {
      'FULLSCREEN': 'Impacto máximo em tela cheia.',
      'DRAWER': 'Desliza da lateral. Mais familiar.',
      'BOTTOM SHEET': 'Sobe do rodapé. Mobile-first.',
      'IA DECIDE': 'Baseado nas referências.'
    };
    return d[m] || '';
  },

  renderStep7(container) {
    container.innerHTML = `
      <div class="form-grid">
        <div class="field-group">
          <label>Foto Profissional/Produto</label>
          <select data-field="foto">
            <option value="">Selecione...</option>
            <option value="Sim — Alta qualidade">Sim — Alta qualidade</option>
            <option value="Sim — Média qualidade">Sim — Média qualidade</option>
            <option value="Não tem">Não tem</option>
          </select>
        </div>
        <div class="field-group">
          <label>Depoimentos</label>
          <select data-field="depoimentos">
            <option value="">Selecione...</option>
            <option value="Texto">Texto</option>
            <option value="Print">Print</option>
            <option value="Vídeo">Vídeo</option>
            <option value="Não tem">Não tem</option>
          </select>
        </div>
        <div class="field-group">
          <label>Google Business</label>
          <select data-field="google_business">
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div class="field-group">
          <label>Nota / Nº Avaliações</label>
          <input type="text" data-field="nota_google" placeholder="ex: 4.8 (127 avaliações)">
        </div>
        <div class="field-group">
          <label>Instagram</label>
          <select data-field="instagram">
            <option value="Ativo">Ativo e relevante</option>
            <option value="Pouco ativo">Pouco ativo</option>
            <option value="Não tem">Não tem</option>
          </select>
        </div>
        <div class="field-group">
          <label>@ Instagram</label>
          <input type="text" data-field="instagram_handle">
        </div>
        <div class="field-group">
          <label>Endereço Físico</label>
          <select data-field="endereco">
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div class="field-group">
          <label>Endereço Completo</label>
          <input type="text" data-field="endereco_completo">
        </div>
        <div class="field-group full">
          <label>Outros Assets</label>
          <textarea data-field="outros_assets"></textarea>
        </div>
      </div>
    `;
    
    // Sincroniza selects manualmente
    container.querySelectorAll('select[data-field]').forEach(el => {
      el.value = this.briefing[el.dataset.field] || '';
    });
  },

  renderStep8(container) {
    const options = [
      ['Google Maps', 'endereco', 'Sim'],
      ['Google Reviews', 'google_business', 'Sim'],
      ['Feed Instagram', 'instagram', 'Ativo'],
      ['Formulário', 'tipo_cta', 'FORMULÁRIO'],
      ['WhatsApp Flutuante', 'default', true],
      ['Botão Ligação', 'telefone', 'val'],
      ['Planos e Preços', 'check', true],
      ['Seção FAQ', 'check', true],
      ['Contador Regressivo', 'check', true],
      ['Como Funciona', 'check', true]
    ];

    container.innerHTML = `
      <div class="field-group full" style="margin-bottom:24px;">
        <label>Integrações Confirmadas</label>
        <div class="chips-container">
          ${options.map(([label, ref, val]) => {
            return `<div class="chip" onclick="App.toggleArrayField('integracoes', '${label}')">${label}</div>`;
          }).join('')}
        </div>
      </div>

      <div id="integracao-precos-container">
        ${this.briefing.integracoes.includes('Planos e Preços') ? `
          <div class="field-group full" style="margin-bottom:24px;">
            <label>Informações de Preço / Planos</label>
            <textarea data-field="info_precos" placeholder="Descreva os planos com valores..."></textarea>
          </div>
        ` : ''}
      </div>

      <div class="field-group full">
        <label>Observações Técnicas Finais</label>
        <textarea data-field="obs_tecnicas" placeholder="Redirecionamentos, subdomínios, etc..."></textarea>
      </div>
    `;
  },

  renderStep9(container) {
    const missing = this.getMissingFields();
    
    container.innerHTML = `
      ${missing.length > 0 ? `
        <div style="background:var(--danger-dim); border:1px solid var(--danger); padding:20px; border-radius:var(--r-md); margin-bottom:32px;">
          <h4 style="color:var(--danger); margin-bottom:12px;">Campos Obrigatórios Pendentes</h4>
          <ul style="font-size:13px; color:var(--text-secondary); padding-left:20px;">
            ${missing.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="margin-bottom:40px;">
        <label>Resumo do Briefing</label>
        <div class="form-grid" style="grid-template-columns: repeat(3, 1fr); gap:12px;">
          <div class="sel-card" onclick="App.goToStep(1)">
            <div class="card-desc">Cliente</div>
            <div class="card-title">${this.briefing.nome_cliente || '---'}</div>
          </div>
          <div class="sel-card" onclick="App.goToStep(2)">
            <div class="card-desc">Nicho</div>
            <div class="card-title">${this.briefing.nicho || '---'}</div>
          </div>
          <div class="sel-card" onclick="App.goToStep(4)">
            <div class="card-desc">CTA</div>
            <div class="card-title">${this.briefing.tipo_cta || '---'}</div>
          </div>
        </div>
      </div>

      <div style="background:var(--bg-raised); padding:32px; border-radius:var(--r-lg); border:1px solid var(--border-muted);">
        <h3 style="margin-bottom:24px;">Configuração da API</h3>
        
        <div class="field-group" style="margin-bottom:20px;">
          <label>Gemini API Key</label>
          <div style="display:flex; gap:10px;">
            <input type="password" id="api-key-input" value="${this.apiKey}" placeholder="Coloque sua chave aqui...">
            <button class="btn btn-primary" onclick="App.saveAPIKey()">Salvar</button>
          </div>
          <p style="font-size:11px; color:var(--text-tertiary); margin-top:8px;">
            Obter chave em: <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--accent2)">aistudio.google.com</a>
          </p>
        </div>

        <div style="display:flex; gap:16px;">
          <button class="btn btn-ghost" style="flex:1" onclick="App.downloadBriefing()">⬇ Baixar Briefing.md</button>
          <button class="btn btn-primary" style="flex:1" id="btn-generate-doc3" ${!this.apiKey ? 'disabled' : ''} onclick="App.generateDoc3()">⚡ Gerar Doc 3</button>
        </div>
      </div>
    `;
  },

  // --- Logic Functions ---

  setField(field, val, shouldUpdateUI = false) {
    this.briefing[field] = val;
    this.autosave();
    if (shouldUpdateUI) {
       // Se o campo mudar drasticamente a estrutura (tipo ou tipo_cta), forçamos re-render
       if (field === 'tipo' || field === 'tipo_cta') {
          this._lastRenderedStep = null;
          this.renderStepContent();
       } else {
          this.syncFieldValues(document.getElementById('step-content'));
       }
    }
  },

  toggleArrayField(field, val) {
    const arr = this.briefing[field];
    const idx = arr.indexOf(val);
    if (idx > -1) arr.splice(idx, 1);
    else arr.push(val);
    this.autosave();
    
    // Especial para o Step 8 que mostra/esconde campos baseados em integracoes
    if (field === 'integracoes') {
       this._lastRenderedStep = null;
       this.renderStepContent();
    } else {
       this.syncFieldValues(document.getElementById('step-content'));
    }
  },

  updateName(val) {
    this.briefing.nome_cliente = val;
    this.briefing.slug = this.sanitizeSlug(val);
    const slugInput = document.getElementById('field-slug');
    // Só atualiza o slugInput se ele não for o elemento ativo
    if (slugInput && slugInput !== document.activeElement) {
       slugInput.value = this.briefing.slug;
    }
    this.autosave();
  },

  sanitizeSlug(val) {
    return val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  },

  saveAPIKey() {
    const val = document.getElementById('api-key-input').value;
    this.apiKey = val;
    localStorage.setItem('landingai_gemini_key', val);
    this.checkAPIStatus();
    this.showToast('API Key salva!', 'success');
  },

  checkAPIStatus() {
    const dot = document.getElementById('api-status-dot');
    const text = document.getElementById('api-status-text');
    if (!dot || !text) return;
    if (this.apiKey) {
      dot.classList.add('active');
      text.textContent = 'Modo: Gemini API';
    } else {
      dot.classList.remove('active');
      text.textContent = 'Modo: Prompt';
    }
  },

  getMissingFields() {
    const req = {
      1: ['tipo', 'nome_cliente', 'slug'],
      2: ['nicho', 'servico_produto', 'objetivo_conversao', 'cidade', 'apresentacao'],
      3: ['publico_primario', 'dores', 'palavras_busca', 'resultado_desejado', 'objecoes'],
      4: ['tipo_cta', 'texto_botao'],
      5: ['personalidade'],
      6: ['referencias', 'estilo_geral', 'o_que_nao_quero']
    };
    
    let missing = [];
    Object.keys(req).forEach(step => {
      req[step].forEach(field => {
        if (!this.briefing[field]) missing.push(`${step}. ${field.replace('_', ' ')}`);
      });
    });
    return missing;
  },

  autosave() {
    clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => {
      localStorage.setItem('landingai_draft', JSON.stringify({
        savedAt: new Date().toISOString(),
        briefing: this.briefing,
        visitedSteps: Array.from(this.visitedSteps)
      }));
    }, 2000); // 2 segundos de debounce para paz total
  },

  checkDraft() {
    const raw = localStorage.getItem('landingai_draft');
    if (raw) {
      const data = JSON.parse(raw);
      this.briefing = data.briefing;
      this.visitedSteps = new Set(data.visitedSteps);
      this.renderSidebar();
      this.renderStepContent();
      this.showToast('Draft restaurado!', 'default');
    }
  },

  setupEventListeners() {
    document.getElementById('btn-prev').onclick = () => this.goToStep(this.currentStep - 1);
    document.getElementById('btn-next').onclick = () => this.goToStep(this.currentStep + 1);
    document.getElementById('close-modal').onclick = () => document.getElementById('gen-modal').classList.remove('active');

    const content = document.getElementById('step-content');
    
    content.addEventListener('input', (e) => {
      const el = e.target;
      const field = el.dataset.field;
      if (!field) return;

      if (field === 'nome_cliente') {
        this.updateName(el.value);
      } else {
        this.briefing[field] = el.value;
        this.autosave();
      }
    });

    content.addEventListener('change', (e) => {
      const el = e.target;
      const field = el.dataset.field;
      if (field && (el.tagName === 'SELECT' || el.type === 'date')) {
         this.setField(field, el.value);
      }
    });
  },

  showToast(msg, type = 'default') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = `toast toast-${type} visible`;
    setTimeout(() => t.classList.remove('visible'), 3000);
  },

  // --- Generation Logic ---

  async generateDoc3() {
    const modal = document.getElementById('gen-modal');
    const progressBar = document.getElementById('gen-progress-bar');
    modal.classList.add('active');
    
    try {
      this.updateGenProgress(1, 10);
      const prompt = this.buildMasterPrompt();
      
      this.updateGenProgress(2, 30);
      const doc3 = await this.callGemini(this.apiKey, prompt);
      
      this.updateGenProgress(5, 100);
      this.generatedDoc3 = doc3;
      
      this.showToast('Doc 3 gerado com sucesso!', 'success');
      this.downloadFile(doc3, `doc3-${this.briefing.slug}.md`);
      
    } catch (err) {
      this.showToast(err.message, 'error');
      console.error(err);
    }
  },

  updateGenProgress(step, percent) {
    document.getElementById('gen-progress-bar').style.width = `${percent}%`;
    document.querySelectorAll('.gen-step').forEach(s => {
      const sNum = parseInt(s.dataset.genStep);
      if (sNum < step) {
        s.classList.add('done');
        s.querySelector('.gen-step-icon').textContent = '✓';
      } else if (sNum === step) {
        s.classList.add('active');
        s.querySelector('.gen-step-icon').textContent = '⟳';
      }
    });
  },

  async callGemini(apiKey, prompt) {
    const GEMINI_MODEL = 'gemini-1.5-pro';
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 16000, temperature: 0.65 }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Erro na API Gemini');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  },

  buildMasterPrompt() {
    // This is the core interpolation logic
    const b = this.briefing;
    let p = `Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator... [INSTRUCTIONS REMOVED FOR BREVITY IN CHUNK]`;
    
    // Actually build it fully as requested in the MD
    // I'll use the template from the MD file
    return `Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.
Sua missão é ler o briefing abaixo na íntegra e gerar como output o **Documento 3 — Ficha de Implementação**, completo, específico e pronto para ser enviado ao Roo Code implementar a landing page.

REGRAS QUE VOCÊ NUNCA VIOLA:
1. Você toma todas as decisões de design que não estão explicitadas: tipografia, escala, tokens, animações, layout de cada seção.
2. Você preenche TODOS os campos do Doc 3 com valores concretos. Sem placeholders.
3. O output deve poder ser copiado e enviado ao Roo sem nenhuma edição.
4. Padrão de qualidade: design editorial de alto padrão.
5. DNA ADSGATOR — REGRAS INEGOCIÁVEIS DE COPY.
6. STACK TÉCNICA FIXA: Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis.
7. FORMULÁRIO: usar Web3Forms.
8. DEPLOY ALVO: Vercel (output: 'static').
9. REGRAS ABSOLUTAS DE CÓDIGO.

BRIEFING COMPLETO:
- Cliente: ${b.nome_cliente}
- Slug: ${b.slug}
- Tipo: ${b.tipo}
- Domínio: ${b.dominio}
- Nicho: ${b.nicho}
- Serviço/Produto: ${b.servico_produto}
- Objetivo: ${b.objetivo_conversao}
- Cidade: ${b.cidade}
- Modalidade: ${b.modalidade}
- Incluso: ${b.incluso}
- Duração: ${b.duracao}
- Garantia: ${b.garantia}
- Apresentação: ${b.apresentacao}
- Contexto: ${b.contexto_extra}
- Público: ${b.publico_primario} / ${b.publico_secundario}
- Dores: ${b.dores}
- Palavras de busca: ${b.palavras_busca}
- Resultado: ${b.resultado_desejado}
- Objeções: ${b.objecoes}
- CTA: ${b.tipo_cta} (${b.texto_botao})
- WhatsApp: ${b.whatsapp} / ${b.mensagem_whatsapp}
- Email: ${b.email_formulario}
- Personalidade: ${b.personalidade}
- Estilo: ${b.estilo_geral}
- Cores: ${b.cor_principal} / ${b.cor_secundaria}
- Referências: ${b.referencias}
- Integrações: ${b.integracoes.join(', ')}

Gere o Documento 3 seguindo a estrutura exata especificada no manual da Adsgator.`;
  },

  downloadBriefing() {
    const b = this.briefing;
    const content = `# Briefing — ${b.nome_cliente}
**Slug:** ${b.slug}
**Data:** ${b.data}

## Dados do Projeto
- Tipo: ${b.tipo}
- Domínio: ${b.dominio}
- Nicho: ${b.nicho}
- Serviço: ${b.servico_produto}

## Público
- Primário: ${b.publico_primario}
- Dores: ${b.dores}

## Prompt
${this.buildMasterPrompt()}
`;
    this.downloadFile(content, `briefing-${b.slug}.md`);
  },

  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};

window.onload = () => App.init();
