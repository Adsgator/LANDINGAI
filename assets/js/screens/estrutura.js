/* ============================================================
   LandingAI v2 — Screen: Estrutura da LP (Refatorado)
   ============================================================ */

Object.assign(window.App, {

  renderEstrutura() {
    const B = this.B || {};
    const estruturaRaw = B.estrutura_lp || null;
    let estrutura = null;
    
    if (estruturaRaw) {
      try {
        estrutura = typeof estruturaRaw === 'string' ? JSON.parse(estruturaRaw) : estruturaRaw;
      } catch (e) {
        console.error('Erro ao processar JSON da estrutura:', e);
      }
    }

    const aprovada = B.estrutura_aprovada || '';

    return `
    <div class="estrutura-screen">
      <div class="estrutura-header">
        <h2 class="estrutura-title">Estrutura da Landing Page</h2>
        <p class="estrutura-subtitle">Defina a narrativa e os blocos de conteúdo da sua página.</p>
      </div>

      ${aprovada ? `
      <div class="aprovado-banner">
        <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--accent)"></i>
        <span>Estrutura aprovada</span>
        <button class="btn-ghost btn-sm" onclick="App.setField('estrutura_aprovada','');App.renderScreen();">
          Reeditar
        </button>
      </div>
      ` : ''}

      <div class="estrutura-main">
        <!-- 1. Card: Gerar com IA -->
        <div class="estrutura-section-card">
          <div class="estrutura-section-header">
            <i data-lucide="sparkles" style="width:15px;height:15px;color:var(--accent2)"></i>
            <span class="estrutura-section-title">Gerar com IA</span>
          </div>
          <p class="estrutura-section-desc">
            A IA analisa o briefing para decidir a melhor sequência de blocos e estratégia para o seu nicho.
          </p>
          <button class="btn-primary" id="btn-run-estrutura" ${aprovada ? 'disabled' : ''}>
            <i data-lucide="cpu" style="width:15px;height:15px"></i>
            ${estrutura ? 'Gerar Novamente' : 'Gerar Estrutura'}
          </button>
        </div>

        <!-- 2. Visualização da Estrutura (JSON Renderizado) -->
        <div id="estrutura-container">
          ${estrutura ? this.renderizarEstrutura(estrutura) : `
            <div class="estrutura-section-card">
              <div class="estrutura-preview-empty">
                <i data-lucide="layout" style="width:32px;height:32px;color:var(--text-disabled)"></i>
                <p>A estrutura inteligente aparecerá aqui após a geração.</p>
              </div>
            </div>
          `}
        </div>

        <!-- 3. Card: Aprovação -->
        ${estrutura && !aprovada ? `
        <div class="estrutura-section-card" style="border-color: var(--accent-border); background: var(--accent-dim);">
          <div style="display:flex; justify-content: space-between; align-items:center;">
            <div>
              <h4 style="margin:0; color:var(--accent)">Tudo pronto?</h4>
              <p style="margin:4px 0 0; font-size:12px; color:var(--text-secondary)">Ao aprovar, você poderá avançar para a geração do conteúdo.</p>
            </div>
            <button class="btn-primary" id="btn-approve-estrutura">
              <i data-lucide="check" style="width:15px;height:15px"></i>
              Aprovar Estrutura
            </button>
          </div>
        </div>
        ` : ''}
      </div>
    </div>
    `;
  },

  /* ----------------------------------------------------------
     COLETAR DADOS — Extrai campos relevantes do briefing
  ---------------------------------------------------------- */
  coletarDadosParaEstrutura() {
    const B = this.B || {};
    
    // Extrair campos relevantes para decisão de blocos
    return {
      // Sempre necessários
      dor_principal: B.publico_dor || '',
      solucao_principal: B.servico_principal || B.o_que_oferece || '',
      diferencial: B.diferencial || B.diferencial1_titulo || '',
      
      // Condicionais
      preco_exibir: B.preco_exibir === 'sim',
      preco_valor: B.preco_plano1_valor || '',
      
      depoimentos: B.depoimentos === 'sim',
      depoimentos_qtd: parseInt(B.depoimentos_qtd || 0),
      
      google_business: B.google_business === 'sim',
      google_nota: parseFloat(B.google_nota || 0),
      google_qtd: parseInt(B.google_qtd || 0),
      
      instagram_url: B.instagram || '',
      
      processo_desconhecido: (B.como_funciona_passo1 || B.como_funciona_detalhado) ? true : false,
      
      objecoes_principais: B.publico_dor || '', // usar para FAQ
      
      atendimento_presencial: B.atendimento === 'presencial' || B.modalidade === 'presencial',
      endereco_autorizado: (B.endereco && B.endereco.trim().length > 0) || B.exibir_localizacao === 'sim',
      
      restricoes: B.restricoes || '', // NÃO USAR PARA CONTEÚDO
    };
  },

  /* ----------------------------------------------------------
     MONTAR PROMPT — Gera o prompt para a IA
  ---------------------------------------------------------- */
  montarPromptEstrutura(dadosBriefing) {
    const systemPrompt = `
# SYSTEM PROMPT: Gerador Inteligente de Estrutura de Landing Page

Você é um especialista em criar landing pages para prestadores de serviço regional.

## CONTEXTO

O usuário passou um briefing sobre seu negócio. Você precisa:
1. Analisar o briefing
2. Decidir qual é a melhor sequência de blocos para ESSE caso específico
3. Retornar EXCLUSIVAMENTE um JSON com a estrutura (sem explicações)

## TABELA DE BLOCOS E REGRAS

Blocos SEMPRE inclusos:
- header (Cabeçalho)
- hero (Hero com H1 focada na Dor #1)
- o-servico (O Serviço)
- diferenciais (Diferenciais)
- cta-final (CTA Final)
- footer (Rodapé)

Blocos CONDICIONAIS (incluir SE):
- como-funciona → Se o processo é desconhecido (EX: terapia, coaching, treinamento de cães)
- planos-precos → Se \`preco_exibir === true\` AND valores foram fornecidos
- depoimentos → Se \`depoimentos === true\` AND há pelo menos 2 depoimentos
- google-reviews → Se \`google_nota >= 4.5\` AND \`google_qtd >= 10\`
- instagram-feed → Se \`instagram_url\` preenchido AND público relevante
- faq → Se há objeções claramente expressas no briefing
- mapa-localizacao → Se \`atendimento_presencial === true\` AND endereço foi autorizado

## ANÁLISE REQUERIDA

Para cada bloco opcional, você DEVE:
1. Verificar se os prerequisites foram atendidos
2. Decidir se INCLUIR ou EXCLUIR
3. Explicar a razão em \`razao\`

## ORDEM DOS BLOCOS

Não use ordem fixa. Adapte conforme o tipo de negócio:

EXEMPLO 1: Psicólogo (processo desconhecido)
→ Hero → O Serviço → Como Funciona → Diferenciais → Depoimentos → FAQ → CTA → Rodapé

EXEMPLO 2: Advogado (precisa de autoridade)
→ Hero → Especialidades → Diferenciais → Cases/Resultados → Google Reviews → CTA → Rodapé

EXEMPLO 3: Personal Trainer (precisa de transformação visual)
→ Hero → O Que Você Recebe → Como Funciona → Antes/Depois (cases) → Depoimentos → Preços → CTA → Rodapé

## REGRAS CRÍTICAS

❌ NUNCA copie a seção "Restrições (o que evitar)" para a página
❌ NUNCA inclua blocos sem conteúdo suficiente
❌ NUNCA crie objeções falsas para incluir FAQ
❌ NUNCA ignore regras de prerequisitos

✅ SEMPRE valide cada bloco opcional contra a tabela
✅ SEMPRE ofereça justificativa clara para cada decisão
✅ SEMPRE adapte a ordem conforme o tipo de negócio
✅ SEMPRE deixe espaço para conteúdo real

## FORMATO DE SAÍDA

Retorne EXCLUSIVAMENTE um JSON válido (sem markdown backticks, sem texto antes/depois).

Estrutura esperada:
{
  "estrutura_lp": {
    "analise": {
      "tipo_negocio": "string",
      "dor_principal": "string",
      "solucao": "string",
      "justificativa_blocos": "string"
    },
    "blocos": [
      {
        "ordem": number,
        "id": "string",
        "nome": "string",
        "tipo": "estrutural|opcional",
        "incluir": boolean,
        "razao": "string",
        "conteudo_sugerido": {
           "titulo": "string (opcional)",
           "subtitulo": "string (opcional)",
           "cta": "string (opcional)"
        }
      }
    ],
    "resumo": {
      "total_blocos": number,
      "blocos_sempre": number,
      "blocos_opcionais_inclusos": number,
      "blocos_excluidos": number,
      "pagina_tipo": "string"
    }
  }
}
`.trim();

    const userPrompt = `
Analise este briefing e retorne a estrutura ideal da landing page.

DADOS DO NEGÓCIO:
- Dor Principal: ${dadosBriefing.dor_principal}
- Solução: ${dadosBriefing.solucao_principal}
- Diferencial: ${dadosBriefing.diferencial}

DADOS CONDICIONAIS:
- Preço deve ser exibido: ${dadosBriefing.preco_exibir ? 'SIM' : 'NÃO'}
- Depoimentos disponíveis: ${dadosBriefing.depoimentos ? `SIM (${dadosBriefing.depoimentos_qtd})` : 'NÃO'}
- Google Business: ${dadosBriefing.google_business ? `SIM (${dadosBriefing.google_nota} stars, ${dadosBriefing.google_qtd} reviews)` : 'NÃO'}
- Instagram: ${dadosBriefing.instagram_url ? 'Sim' : 'Não'}
- Processo desconhecido para cliente (precisa de "Como Funciona"): ${dadosBriefing.processo_desconhecido ? 'SIM' : 'NÃO'}
- Atendimento presencial com endereço: ${dadosBriefing.atendimento_presencial && dadosBriefing.endereco_autorizado ? 'SIM' : 'NÃO'}

RESTRIÇÕES (o que NÃO incluir na copy):
${dadosBriefing.restricoes || 'Nenhuma restrição especificada'}

Retorne EXCLUSIVAMENTE um JSON válido com a estrutura otimizada.
    `.trim();

    return { systemPrompt, userPrompt };
  },

  /* ----------------------------------------------------------
     GERAR ESTRUTURA — Orchestrator
  ---------------------------------------------------------- */
  async gerarEstrutura() {
    this.openAILog('Analisando Briefing para Estrutura', [
      { id: 1, icon: 'file-text', label: 'Coletando dados do briefing...' },
      { id: 2, icon: 'cpu', label: 'Decidindo narrativa estratégica...' },
      { id: 3, icon: 'layers', label: 'Validando restrições e blocos...' },
      { id: 4, icon: 'check-circle', label: 'Finalizando estrutura...' },
    ]);

    try {
      this.aiLogStep(1);
      const dados = this.coletarDadosParaEstrutura();
      await this.aiLogDelay(300);
      
      this.aiLogStep(2);
      const { systemPrompt, userPrompt } = this.montarPromptEstrutura(dados);
      
      // Adicionar prompt de restrições e blindagem ao systemPrompt
      const restricoesPrompt = this.buildRestricoesPrompt(dados.restricoes);
      const blindedPrompt = this.buildBlindedSystemPrompt(this.B, 'estrutura');
      const fullSystemPrompt = `${blindedPrompt}\n\n${systemPrompt}\n\n${restricoesPrompt}`;
      
      this.aiLogStep(3);
      // Usar a nova função com retry para garantir que restrições sejam respeitadas
      const { resultado, validacao, aviso } = await this.generateEstruturaComRetry(
        this.B, 
        fullSystemPrompt, 
        userPrompt
      );
      
      this.validarEstrutura(resultado);
      await this.aiLogDelay(300);

      this.aiLogStep(4);
      this.setField('estrutura_lp', JSON.stringify(resultado));
      
      if (aviso) {
        this.showToast(aviso, 'warning');
      }

      await this.aiLogDelay(400);

      this.aiLogDone();
      setTimeout(() => {
        this.closeAILog();
        this.renderScreen();
        if (!validacao.valido) {
           this.showToast('Estrutura gerada com alguns avisos de restrição.', 'warning');
        } else {
           this.showToast('Estrutura estratégica gerada com sucesso!', 'success');
        }
      }, 600);

    } catch (error) {
      console.error('Erro ao gerar estrutura:', error);
      this.aiLogError(this.state.aiLog.active, error.message);
      setTimeout(() => {
        this.closeAILog();
        this.showToast('Erro ao gerar estrutura: ' + error.message, 'error');
      }, 1200);
    }
  },

  /* ----------------------------------------------------------
     VALIDAR ESTRUTURA
  ---------------------------------------------------------- */
  validarEstrutura(estrutura) {
    if (!estrutura.estrutura_lp || !Array.isArray(estrutura.estrutura_lp.blocos)) {
      throw new Error('JSON inválido: falta campo estrutura_lp.blocos');
    }
    
    const blocos = estrutura.estrutura_lp.blocos;
    
    // Validar blocos sempre obrigatórios
    const obrigatorios = ['header', 'hero', 'o-servico', 'diferenciais', 'cta-final', 'footer'];
    const inclusos = blocos.filter(b => b.incluir === true).map(b => b.id);
    
    for (let obrigatorio of obrigatorios) {
      if (!inclusos.includes(obrigatorio)) {
        // Tenta achar por nome se o ID falhou (IA às vezes erra ID)
        const porNome = blocos.find(b => b.nome.toLowerCase().includes(obrigatorio.replace('-','')) && b.incluir);
        if (!porNome) {
           console.warn(`Bloco obrigatório '${obrigatorio}' não detectado. Forçando inclusão no log.`);
        }
      }
    }
    
    return true;
  },

  /* ----------------------------------------------------------
     RENDERIZAR ESTRUTURA — UI
  ---------------------------------------------------------- */
  renderizarEstrutura(estrutura) {
    const data = estrutura.estrutura_lp;
    const blocos = data.blocos;
    
    return `
      <div class="estrutura-analise">
        <div class="analise-card">
          <div class="analise-card-header">
            <i data-lucide="brain-circuit" style="width:16px;height:16px;color:var(--accent)"></i>
            <h3>Análise Estratégica</h3>
          </div>
          <div class="analise-grid">
            <div class="analise-item">
              <span class="analise-label">Tipo de Negócio</span>
              <span class="analise-value">${data.analise.tipo_negocio}</span>
            </div>
            <div class="analise-item">
              <span class="analise-label">Dor Principal</span>
              <span class="analise-value">${data.analise.dor_principal}</span>
            </div>
          </div>
          <div class="analise-justificativa">
            <span class="analise-label">Justificativa da Narrativa</span>
            <p>${data.analise.justificativa_blocos}</p>
          </div>
        </div>
      </div>
      
      <div class="estrutura-blocos-list">
        ${blocos.map((bloco) => `
          <div class="bloco-card ${bloco.incluir ? 'incluir' : 'excluir'}">
            <div class="bloco-card-header">
              <div class="bloco-main-info">
                <span class="bloco-ordem">${bloco.ordem}</span>
                <h4 class="bloco-nome">${bloco.nome}</h4>
              </div>
              <span class="bloco-status-badge ${bloco.incluir ? 'status-sim' : 'status-nao'}">
                ${bloco.incluir ? 'INCLUIR' : 'EXCLUIR'}
              </span>
            </div>
            <div class="bloco-card-body">
              <p class="bloco-razao">
                <i data-lucide="${bloco.incluir ? 'check' : 'x'}" style="width:12px;height:12px"></i>
                ${bloco.razao}
              </p>
              ${bloco.incluir && bloco.conteudo_sugerido ? `
                <div class="bloco-sugestao">
                  ${bloco.conteudo_sugerido.titulo ? `<div><strong>Título:</strong> ${bloco.conteudo_sugerido.titulo}</div>` : ''}
                  ${bloco.conteudo_sugerido.cta ? `<div class="bloco-cta-sugestao"><strong>CTA:</strong> <span>${bloco.conteudo_sugerido.cta}</span></div>` : ''}
                </div>
              ` : ''}
              <div class="bloco-meta">
                <span class="tag-tipo">${bloco.tipo}</span>
                <span class="tag-id">#${bloco.id}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="estrutura-resumo">
        <div class="resumo-item">
          <span class="resumo-val">${data.resumo.total_blocos}</span>
          <span class="resumo-lab">Total</span>
        </div>
        <div class="resumo-item">
          <span class="resumo-val">${data.resumo.blocos_sempre + data.resumo.blocos_opcionais_inclusos}</span>
          <span class="resumo-lab">Inclusos</span>
        </div>
        <div class="resumo-item">
          <span class="resumo-val" style="color:var(--text-tertiary)">${data.resumo.blocos_excluidos}</span>
          <span class="resumo-lab">Excluídos</span>
        </div>
        <div class="resumo-tag">${data.resumo.pagina_tipo}</div>
      </div>
    `;
  },

  aprovarEstrutura() {
    const B = this.B || {};
    if (!B.estrutura_lp) {
      this.showToast('Gere a estrutura antes de aprovar.', 'warning');
      return;
    }
    this.setField('estrutura_aprovada', B.estrutura_lp);
    this.showToast('Estrutura aprovada!', 'success');
    this.renderScreen();
    this.renderStepsNav();
  }

});
