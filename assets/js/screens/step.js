/* ============================================================
   LandingAI v2 — Screen: Steps
   ============================================================ */

Object.assign(window.App, {
  buildStepScreen(step) {
    const builders = {
      1: () => this.buildStep1(),
      2: () => this.buildStep2(),
      3: () => this.buildStep3(),
      4: () => this.buildStep4(),
      5: () => this.buildStep5(),
      6: () => this.buildStep6(),
      7: () => this.buildStep7(),
      8: () => this.buildStep8(),
    };
    return builders[step] ? `<div class="step-inner">${builders[step]()}</div>` : '';
  },

  fieldLabel(field, text, required = false, optional = false) {
    const req = required ? '<span class="field-required">*</span>' : '';
    const opt = optional ? '<span class="field-optional">(opcional)</span>' : '';
    const tip = FIELD_TOOLTIPS[field] ? `
      <span class="field-tooltip">
        <i data-lucide="help-circle" class="field-tooltip-icon"></i>
        <span class="field-tooltip-bubble">${FIELD_TOOLTIPS[field]}</span>
      </span>` : '';
    return `<label class="field-label">${text}${req}${opt}${tip}</label>`;
  },

  buildStep1() {
    const B = this.B;
    return `
      <p class="form-section-title">Identidade do Projeto</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('nome_cliente', 'Nome do cliente', true)}
          <input type="text" class="field-input" data-field="nome_cliente" placeholder="Ex: Beatriz Mattos" value="${B.nome_cliente || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('nome_marca', 'Nome da marca', false, true)}
          <input type="text" class="field-input" data-field="nome_marca" placeholder="Ex: BM Adestramento" value="${B.nome_marca || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('segmento', 'Segmento / profissão', true)}
        <input type="text" class="field-input" data-field="segmento" placeholder="Ex: Adestramento comportamental canino online" value="${B.segmento || ''}">
        <span class="field-hint">Seja específico — não "pet" mas "adestramento comportamental canino". Impacta toda a copy.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('tipo', 'Tipo de negócio', true)}
        <div class="sel-cards" data-field-group="tipo">
          ${[
        { v: 'servico', icon: 'briefcase', title: 'Serviço', desc: 'Adestramento, fisioterapia, advocacia, consultórios' },
        { v: 'mentoria', icon: 'graduation-cap', title: 'Mentoria', desc: 'Mentoria individual, em grupo, programa online' },
        { v: 'consultoria', icon: 'bar-chart', title: 'Consultoria', desc: 'B2B, consultoria especializada, assessoria' },
        { v: 'produto', icon: 'package', title: 'Produto', desc: 'Venda física, produto digital, ecommerce' },
        { v: 'saas', icon: 'monitor', title: 'SaaS / Digital', desc: 'Software, app, ferramenta, plataforma' },
      ].map(o => `
            <div class="sel-card ${B.tipo === o.v ? 'on' : ''}" data-field="tipo" data-selcard="${o.v}" tabindex="0" role="option" aria-selected="${B.tipo === o.v}">
              <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
              <div>
                <div class="sel-card-title">${o.title}</div>
                <div class="sel-card-desc">${o.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Domínio e Legalização</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('dominio', 'Domínio desejado', true)}
          <input type="text" class="field-input" data-field="dominio" placeholder="Ex: beatrizmattos.com.br" value="${B.dominio || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('cnpj', 'CNPJ', false, true)}
          <input type="text" class="field-input" data-field="cnpj" placeholder="00.000.000/0000-00" value="${B.cnpj || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('aviso_legal', 'Aviso legal / registro profissional', false, true)}
        <input type="text" class="field-input" data-field="aviso_legal" placeholder="Ex: CRM 12345-SP · CRP 06/12345 · OAB/SP 123456" value="${B.aviso_legal || ''}">
      </div>
    `;
  },

  buildStep2() {
    const B = this.B;
    return `
      <p class="form-section-title">Contato e Conversão</p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('whatsapp', 'WhatsApp', true)}
          <input type="text" class="field-input" data-field="whatsapp"
            placeholder="Ex: 5511999999999"
            value="${B.whatsapp || ''}"
            inputmode="numeric"
          >
          <div id="wa-preview" class="field-preview" style="display:${B.whatsapp ? '' : 'none'}">
            ${B.whatsapp ? `wa.me/${B.whatsapp}` : ''}
          </div>
          <span class="field-hint">Somente dígitos: DDI + DDD + número. O link wa.me é gerado automaticamente.</span>
        </div>
        <div class="field-group">
          ${this.fieldLabel('email', 'E-mail de contato', false, true)}
          <input type="email" class="field-input" data-field="email" placeholder="contato@email.com.br" value="${B.email || ''}">
        </div>
      </div>

      <div class="field-group">
        ${this.fieldLabel('horarios', 'Dias e horários de atendimento', false, true)}
        <input type="text" class="field-input" data-field="horarios" placeholder="Ex: Segunda a sexta, 9h às 18h. Sábados mediante agendamento." value="${B.horarios || ''}">
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Rastreamento e Analytics</p>

      <div class="field-group">
        ${this.fieldLabel('gtm_id', 'ID do Google Tag Manager', false, true)}
        <input type="text" class="field-input" data-field="gtm_id" placeholder="Ex: GTM-XXXXXXX" value="${B.gtm_id || ''}">
        <span class="field-hint">Fornecido pelo gestor de tráfego. Formato: GTM- seguido de 7 caracteres.</span>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Objetivo de Conversão</p>

      <div class="field-group">
        ${this.fieldLabel('objetivo_conversao', 'Como o lead entra em contato?', true)}
        <div class="sel-cards" data-field-group="objetivo_conversao">
          ${[
        { v: 'whatsapp', icon: 'message-circle', title: 'WhatsApp', desc: 'Botão direto para conversa no WA. Mais rápido.' },
        { v: 'formulario', icon: 'mail', title: 'Formulário', desc: 'Formulário no site. Bom para triagem inicial.' },
        { v: 'agendamento', icon: 'calendar', title: 'Agendamento Online', desc: 'Link para Calendly, Cal.com ou similar.' },
        { v: 'outro', icon: 'link', title: 'Outro', desc: 'Especifique abaixo.' },
      ].map(o => `
            <div class="sel-card ${B.objetivo_conversao === o.v ? 'on' : ''}" data-field="objetivo_conversao" data-selcard="${o.v}" tabindex="0">
              <i data-lucide="${o.icon}" class="sel-card-icon" style="width:18px;height:18px"></i>
              <div>
                <div class="sel-card-title">${o.title}</div>
                <div class="sel-card-desc">${o.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      ${B.objetivo_conversao === 'outro' ? `
        <div class="field-group">
          ${this.fieldLabel('objetivo_outro', 'Descreva o objetivo de conversão', true)}
          <input type="text" class="field-input" data-field="objetivo_outro" placeholder="Ex: Link para checkout do Hotmart" value="${B.objetivo_outro || ''}">
        </div>
      ` : ''}
    `;
  },

  buildStep3() {
    const B = this.B;
    return `
      <p class="form-section-title">Redes Sociais e Presença Digital</p>
      <p class="form-section-title" style="font-size:12px;font-family:var(--font-body);font-weight:400;color:var(--text-secondary);border:none;padding:0;margin-top:-16px">
        Preencha apenas o que existe e está ativo. Cada rede ativada aqui pode virar um bloco ou integração no site.
      </p>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('instagram', 'Instagram', false, true)}
          <input type="text" class="field-input" data-field="instagram" placeholder="@handle ou URL" value="${B.instagram || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('tiktok', 'TikTok', false, true)}
          <input type="text" class="field-input" data-field="tiktok" placeholder="@handle" value="${B.tiktok || ''}">
        </div>
      </div>

      <div class="form-row">
        <div class="field-group">
          ${this.fieldLabel('youtube', 'YouTube', false, true)}
          <input type="text" class="field-input" data-field="youtube" placeholder="URL do canal" value="${B.youtube || ''}">
        </div>
        <div class="field-group">
          ${this.fieldLabel('outras_redes', 'Outras redes', false, true)}
          <input type="text" class="field-input" data-field="outras_redes" placeholder="LinkedIn, Pinterest, etc" value="${B.outras_redes || ''}">
        </div>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Integrações no Site</p>
      <p class="form-section-title" style="font-size:12px;font-family:var(--font-body);font-weight:400;color:var(--text-secondary);border:none;padding:0;margin-top:-16px">
        Marque somente o que foi confirmado. Ativo não confirmado = não inclui.
      </p>

      <div class="chip-group">
        ${[
        { v: 'maps', label: 'Google Maps Embed' },
        { v: 'reviews', label: 'Google Reviews Widget' },
        { v: 'instagram', label: 'Feed do Instagram' },
        { v: 'formulario', label: 'Formulário de Contato' },
        { v: 'whatsapp', label: 'WhatsApp Flutuante' },
        { v: 'ligacao', label: 'Botão de Ligação' },
      ].map(o => `
          <button class="chip ${(B.integracoes || []).includes(o.v) ? 'on' : ''}"
            data-field="integracoes" data-chip="${o.v}" data-multi="true">
            ${o.label}
          </button>
        `).join('')}
      </div>
    `;
  },

  buildStep4() {
    const B = this.B;
    return `
      <p class="form-section-title">Modalidade de Atendimento</p>

      <div class="field-group">
        ${this.fieldLabel('modalidade', 'Como o cliente atende?', true)}
        <div class="chip-group">
          ${[
        { v: 'presencial', label: 'Presencial' },
        { v: 'online', label: 'Online' },
        { v: 'hibrido', label: 'Híbrido (ambos)' },
      ].map(o => `
            <button class="chip ${B.modalidade === o.v ? 'on' : ''}" data-field="modalidade" data-chip="${o.v}">
              ${o.label}
            </button>
          `).join('')}
        </div>
        <span class="field-hint">Define se o site terá seção de mapa ou foco em plataforma digital.</span>
      </div>

      <div class="form-divider"></div>
      
      ${(B.modalidade === 'presencial' || B.modalidade === 'hibrido') ? `
        <p class="form-section-title">Localização Física</p>
        <div class="field-group">
          ${this.fieldLabel('endereco', 'Endereço completo', true)}
          <textarea class="field-textarea" data-field="endereco" placeholder="Rua, número, bairro, cidade, estado, CEP.">${B.endereco || ''}</textarea>
        </div>

        <div class="form-row">
          <div class="field-group">
            ${this.fieldLabel('maps_link', 'Link do Google Maps', false, true)}
            <input type="text" class="field-input" data-field="maps_link" placeholder="https://goo.gl/maps/..." value="${B.maps_link || ''}">
          </div>
          <div class="field-group">
            ${this.fieldLabel('exibir_localizacao', 'Exibição no site', true)}
            <div class="chip-group">
              ${[
            { v: 'completo', label: 'Completo' },
            { v: 'bairro', label: 'Só Bairro/Cidade' },
            { v: 'nao', label: 'Não exibir' },
          ].map(o => `
                <button class="chip ${B.exibir_localizacao === o.v ? 'on' : ''}" data-field="exibir_localizacao" data-chip="${o.v}">
                  ${o.label}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="field-group">
          ${this.fieldLabel('cidades_atendimento', 'Raio / Cidades de atendimento', false, true)}
          <input type="text" class="field-input" data-field="cidades_atendimento" placeholder="Ex: Atendemos toda a Grande SP e ABC" value="${B.cidades_atendimento || ''}">
        </div>
      ` : ''}

      ${(B.modalidade === 'online' || B.modalidade === 'hibrido') ? `
        <p class="form-section-title">Ambiente Digital</p>
        <div class="field-group">
          ${this.fieldLabel('plataforma_online', 'Plataforma de atendimento', false, true)}
          <input type="text" class="field-input" data-field="plataforma_online" placeholder="Ex: Zoom, Google Meet, WhatsApp Video" value="${B.plataforma_online || ''}">
        </div>
      ` : ''}

      <div class="form-divider"></div>
      <p class="form-section-title">FAQ e Quebra de Objeções</p>

      <div class="field-group">
        ${this.fieldLabel('faq', 'Perguntas Frequentes (FAQ)', false, true)}
        <textarea class="field-textarea tall" data-field="faq" 
          placeholder="Quais as 3 a 5 perguntas que o cliente sempre faz no primeiro contato?&#10;Ex: 'Aceita convênio?', 'Tem estacionamento?', 'Como funciona a primeira sessão?'">${B.faq || ''}</textarea>
        <span class="field-hint">A IA usará isso para criar um bloco de FAQ que economiza tempo do atendimento.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('objecoes_atendimento', 'Principais objeções / medos', false, true)}
        <textarea class="field-textarea" data-field="objecoes_atendimento" 
          placeholder="O que o cliente costuma falar para NÃO fechar? Ex: 'Achei caro', 'Tenho medo de doer', 'Não sei se serve para mim'.">${B.objecoes_atendimento || ''}</textarea>
        <span class="field-hint">Crucial para a IA criar uma copy que antecipa e resolve esses problemas.</span>
      </div>
    `;
  },

  buildStep5() {
    const B = this.B;
    return `
      <p class="form-section-title">Serviços e Preço</p>
      <div class="field-group">
        ${this.fieldLabel('servico_principal', 'Serviço principal — foco da campanha', true)}
        <input type="text" class="field-input" data-field="servico_principal" placeholder="Ex: Mentoria de adestramento canino" value="${B.servico_principal || ''}">
      </div>
      <div class="field-group">
        ${this.fieldLabel('servicos_descricao', 'Descrição detalhada', true)}
        <textarea class="field-textarea tall" data-field="servicos_descricao" placeholder="O que inclui, como funciona...">${B.servicos_descricao || ''}</textarea>
      </div>
      <div class="field-group">
        ${this.fieldLabel('preco_exibir', 'Exibir preço?', true)}
        <div class="chip-group">
          <button class="chip ${B.preco_exibir === 'sim' ? 'on' : ''}" data-field="preco_exibir" data-chip="sim">Sim</button>
          <button class="chip ${B.preco_exibir === 'nao' ? 'on' : ''}" data-field="preco_exibir" data-chip="nao">Não</button>
        </div>
      </div>
      ${B.preco_exibir === 'sim' ? `
        <div class="form-row">
            <div class="field-group">
            ${this.fieldLabel('preco_valor', 'Valor', false)}
            <input type="text" class="field-input" data-field="preco_valor" placeholder="Ex: R$ 350,00" value="${B.preco_valor || ''}">
            </div>
            <div class="field-group">
            ${this.fieldLabel('preco_condicao', 'Condição', false)}
            <input type="text" class="field-input" data-field="preco_condicao" placeholder="Ex: 3x sem juros" value="${B.preco_condicao || ''}">
            </div>
        </div>
      ` : ''}
    `;
  },

  buildStep6() {
    const B = this.B;
    return `
      <p class="form-section-title">Público-Alvo</p>
      <div class="field-group">
        ${this.fieldLabel('publico_primario', 'Perfil do cliente ideal', true)}
        <textarea class="field-textarea" data-field="publico_primario" placeholder="Idade, dores, desejos...">${B.publico_primario || ''}</textarea>
      </div>
      <div class="field-group">
        ${this.fieldLabel('publico_dor', 'Principal dor / problema', true)}
        <textarea class="field-textarea" data-field="publico_dor" placeholder="O problema que ele quer resolver AGORA.">${B.publico_dor || ''}</textarea>
      </div>
      <div class="field-group">
        ${this.fieldLabel('publico_resultado', 'Resultado esperado', true)}
        <textarea class="field-textarea" data-field="publico_resultado" placeholder="Como ele se sente após contratar?">${B.publico_resultado || ''}</textarea>
      </div>
    `;
  },

  buildStep7() {
    const B = this.B;
    return `
      <p class="form-section-title">Diferenciais e Autoridade</p>
      <div class="field-group">
        ${this.fieldLabel('diferencial', 'O que diferencia o profissional?', true)}
        <textarea class="field-textarea tall" data-field="diferencial"
          placeholder="Método, experiência, certificações, resultados concretos. Seja específico — não 'atendimento humanizado', mas o que concretamente faz diferente.">${B.diferencial || ''}</textarea>
        <span class="field-hint">Este campo é a base do bloco de Diferenciais. Quanto mais específico, mais persuasivo.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('frase_impacto', 'Frase de impacto — possível H1 da página', true)}
        <input type="text" class="field-input" data-field="frase_impacto"
          value="${B.frase_impacto || ''}"
          placeholder="Ex: Adestramento que resolve o problema, não esconde.">
        <span class="field-hint">Deve espelhar a dor de busca do público, não o nome técnico do serviço.</span>
      </div>

      <div class="field-group">
        ${this.fieldLabel('historia', 'História ou origem do negócio', false, true)}
        <textarea class="field-textarea" data-field="historia"
          placeholder="Por que esse profissional faz o que faz. Se for genuína e diferente do padrão do nicho, a IA inclui um bloco de história.">${B.historia || ''}</textarea>
      </div>

      <div class="field-group">
        ${this.fieldLabel('casos_resultados', 'Cases e resultados concretos', false, true)}
        <textarea class="field-textarea" data-field="casos_resultados"
          placeholder="Números, comparações antes/depois, projetos específicos.
Ex: 120 cães atendidos nos últimos 2 anos. 97% dos tutores relataram melhora em 30 dias.">${B.casos_resultados || ''}</textarea>
      </div>

      <div class="form-divider"></div>
      <p class="form-section-title">Prova Social</p>

      <div class="field-group">
        ${this.fieldLabel('depoimentos', 'Tem depoimentos reais?', true)}
        <div class="chip-group">
          <button class="chip ${B.depoimentos === 'sim' ? 'on' : ''}" data-field="depoimentos" data-chip="sim">Sim</button>
          <button class="chip ${B.depoimentos === 'nao' ? 'on' : ''}" data-field="depoimentos" data-chip="nao">Não</button>
        </div>
        <span class="field-hint">Nunca inventamos depoimentos. Se \"Não\", o bloco de prova social não é incluído.</span>
      </div>

      ${B.depoimentos === 'sim' ? `
        <div class="form-row">
          <div class="field-group">
            ${this.fieldLabel('depoimentos_qtd', 'Quantidade disponível', false)}
            <input type="number" class="field-input" data-field="depoimentos_qtd"
              placeholder="Ex: 6" value="${B.depoimentos_qtd || ''}">
          </div>
          <div class="field-group">
            ${this.fieldLabel('depoimentos_formato', 'Formato', false)}
            <div class="chip-group">
              ${['Texto', 'Print WhatsApp', 'Print Google', 'Vídeo'].map(f => `
                <button class="chip ${(B.depoimentos_formato || []).includes(f) ? 'on' : ''}"
                  data-field="depoimentos_formato" data-chip="${f}" data-multi="true">${f}</button>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      <div class="form-divider"></div>
      <p class="form-section-title">Google Business</p>

      <div class="field-group">
        ${this.fieldLabel('google_business', 'Tem perfil no Google Meu Negócio?', false)}
        <div class="chip-group">
          <button class="chip ${B.google_business === 'sim' ? 'on' : ''}" data-field="google_business" data-chip="sim">Sim</button>
          <button class="chip ${B.google_business === 'nao' ? 'on' : ''}" data-field="google_business" data-chip="nao">Não</button>
        </div>
      </div>

      ${B.google_business === 'sim' ? `
        <div class="form-row">
          <div class="field-group">
            ${this.fieldLabel('google_nota', 'Nota média', false)}
            <input type="number" step="0.1" min="1" max="5" class="field-input"
              data-field="google_nota" placeholder="Ex: 4.9" value="${B.google_nota || ''}">
            <span class="field-hint">Mínimo 4.5 para incluir o bloco de reviews.</span>
          </div>
          <div class="field-group">
            ${this.fieldLabel('google_qtd', 'Número de avaliações', false)}
            <input type="number" class="field-input"
              data-field="google_qtd" placeholder="Ex: 127" value="${B.google_qtd || ''}">
            <span class="field-hint">Mínimo 10 para incluir o bloco.</span>
          </div>
        </div>
      ` : ''}
    `;
  },

  buildStep8() {
    const B = this.B;
    return `
      <p class="form-section-title">Tom e Identidade</p>
      <div class="field-group">
        ${this.fieldLabel('estilo_desejado', 'Estilo visual desejado', true)}
        <textarea class="field-textarea" data-field="estilo_desejado" placeholder="Clean, moderno, agressivo, acolhedor...">${B.estilo_desejado || ''}</textarea>
      </div>
      <div class="field-group">
        ${this.fieldLabel('sensacao_visitante', 'O que o visitante deve sentir?', true)}
        <textarea class="field-textarea" data-field="sensacao_visitante" placeholder="Confiança, urgência, calma...">${B.sensacao_visitante || ''}</textarea>
      </div>
      <div class="field-group">
        ${this.fieldLabel('restricoes', 'Restrições (o que evitar)', false, true)}
        <textarea class="field-textarea" data-field="restricoes" placeholder="Cores, termos, estilos a evitar...">${B.restricoes || ''}</textarea>
      </div>
    `;
  }
});
