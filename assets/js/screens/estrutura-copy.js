/* ============================================================
   LandingAI v2 — Screen: Estrutura e Copy (Reescrita)
   ============================================================ */

Object.assign(window.App, {

  /**
   * Monta a tela de Estrutura e Copy.
   */
  buildStructureScreen() {
    const B = this.B || {};
    const blocos = B.estruturaCopyBlocos || [];
    
    return `
    <div id="tela-estrutura-copy" class="tela-container">
      <div class="tela-inner">

        <header class="tela-header">
          <h2>Estrutura e Copy</h2>
          <p>Defina os blocos da página e a copy completa de cada um</p>
        </header>

        <!-- Botões de ação principais -->
        <div class="acao-grupo">

          <div class="acao-grupo-primario">
            <button class="btn-gerar-main"
              onclick="App.gerarEstruturaCopyInterno()">
              <i data-lucide="zap" style="width:20px;height:20px"></i>
              Gerar Estrutura e Copy
            </button>
          </div>

          <div class="acao-grupo-secundario">
            <button class="btn-secundario-lp"
              onclick="App.baixarArquivoEstruturaCopy()">
              <i data-lucide="download" style="width:16px;height:16px"></i>
              Baixar Briefing (IA Externa)
            </button>

            <button class="btn-secundario-lp"
              onclick="App.abrirModalImportarOutput()">
              <i data-lucide="upload" style="width:16px;height:16px"></i>
              Importar Output da IA
            </button>
          </div>

        </div>

        <!-- Container dos blocos gerados -->
        <div id="estrutura-blocos-container" class="blocos-container">
          ${this.renderizarBlocosHTML(blocos)}
        </div>

      </div>
    </div>
    `;
  },

  // ============================================================
  // GERADOR DO ARQUIVO PARA IA EXTERNA
  // ============================================================

  /**
   * Retorna as regras do DNA Adsgator conforme o tipo de negócio
   */
  obterDNAAdsgatorPorTipo(tipo) {
    const tipoNormalizado = (tipo || 'servico').toLowerCase();

    const dnasPorTipo = {
      'servico': `**Foco em Credibilidade e Proximidade**
O texto reforça especialização, experiência e confiança no profissional. Cada elemento mostra por que escolher VOCÊ, não um concorrente. Destaque autoridade, depoimentos reais e cases específicos.

**Primeira Pessoa Sempre**
A copy fala do profissional para o visitante. Use "eu", "meu", "com você" — nunca terceira pessoa. Se o profissional é Maria, a copy diz "Eu atendo..." — nunca "Maria atende...".

**Foco no Resultado Mensurável**
Para serviços, mostre ANTES/DEPOIS real, transformações comprovadas, tempo de resultado. Evite promessas vagas. "Você sairá da sessão com X" é melhor que "Transformação total".`,

      'mentoria': `**Foco na Transformação Progressiva**
O texto mostra a jornada do aluno: onde está agora → onde quer chegar → como você o leva lá. Cada bloco representa um passo dessa transformação. Use storytelling do resultado.

**Primeira Pessoa Sempre**
A copy fala do mentor para o mentorado. Use "eu guio", "te levo", "meu método" — construa confiança pessoal.

**Linguagem Aspiracional sem Ser Fake**
Descreva o resultado final que o mentorado pode alcançar. Seja realista: "90 dias para..." é melhor que "transformação garantida". Mostre o caminho, não mágica.`,

      'consultoria': `**Foco em Resultado Quantificável e ROI**
O texto prova que a consultoria gera valor mensurável: aumento de receita, redução de custos, otimização de processos. Use números e métricas reais.

**Linguagem B2B Direta**
Fale com decisores: CEO, CFO, diretor de operações. Seja objetivo. Evite buzzwords. "Reduzir 35% de desperdício em 60 dias" é melhor que "otimização operacional".

**Foco em Expertise Comprovada**
Cite industrias atendidas, cases específicos, certificações. O comprador de consultoria busca prova de que você já resolveu problema similar.`,

      'produto': `**Foco na Experiência de Compra**
O texto reduz fricção até o checkout. Cada bloco responde: por que comprar? qual é o benefício? como funciona? quanto custa? por que agora?

**Linguagem de Vantagem Imediata**
"Entrega em 24h", "garantia de 30 dias", "sem risco". Mostre o que o cliente recebe AGORA, não promessas futuras.

**Prova Social Abundante**
Avaliações, número de vendas, fotos de clientes reais usando. Para produtos digitais, acesso imediato. Para físicos, frete e prazo em destaque.`,

      'saas': `**Foco em Problema → Solução → Resultado**
O texto começa no ponto de dor (o que o usuário sofre hoje) e termina com a vida melhor (com o seu SaaS). Cada feature é um benefício, não uma funcionalidade.

**Linguagem de Eficiência**
"Economize 10 horas por semana", "integra com X em 5 minutos", "sem necessidade de programação". Fale no tempo do usuário ocupado.

**Foco em Onboarding Simples**
Destaque facilidade de entrada, trial grátis ou plano inicial barato, suporte. Reduza barreiras mentais.`,

      'curso': `**Foco na Ação**
Cada título, subtítulo e botão guia o usuário para o CTA principal. Não há texto decorativo — cada palavra tem função persuasiva. O objetivo é fazer o aluno clicar em "Comprar Curso".

**Linguagem de Urgência e Escassez Ética**
"Inscrições abertas até X", "apenas 30 vagas", "preço especial hoje". Crie movimento sem enganar.

**Prova Social de Resultado**
Mostre quantos alunos já fizeram, depoimentos específicos do que conseguiram após o curso, menção a nomes reais (com permissão). "João saiu de $0 para $5k/mês" impacta mais que "mudou de vida".`
    };

    return dnasPorTipo[tipoNormalizado] || dnasPorTipo['servico'];
  },

  /**
   * Monta o arquivo .md completo para download e envio à IA externa
   */
  gerarArquivoEstruturaCopy() {
    const briefing = this.B;
    const data = new Date().toLocaleDateString('pt-BR');

    // Presença digital formatada
    const gbStatus = briefing.google_business === 'sim'
      ? `Sim | ${briefing.google_nota || '?'} estrelas (${briefing.google_qtd || '?'} avaliações)`
      : 'Não';
    const igStatus = briefing.instagram
      ? `Sim | ${briefing.instagram || 'handle não informado'}`
      : 'Não';
    const endStatus = (briefing.atendimento === 'presencial' && briefing.endereco)
      ? `Sim — autorizado | ${briefing.endereco || 'endereço não informado'}`
      : 'Não / Não autorizado';
    const depStatus = briefing.depoimentos === 'sim'
      ? `Sim | ${briefing.depoimentos_qtd || '?'} depoimentos — ${briefing.depoimentos_formato || 'formato não informado'}`
      : 'Não';

    return `---
projeto: ${this.P?.name || 'projeto'}
data: ${data}
tipo: estrutura-copy-para-ia-externa
versao: 2.0
---

# ${this.P?.name || 'Projeto'} — Estrutura e Copy da Landing Page

Gerado pelo **LandingAI** · Adsgator · ${data}

---

## INSTRUÇÃO PARA A IA

Você é um Copywriter Sênior especializado em Landing Pages de Alta Conversão
para tráfego direto do Google Ads, trabalhando para a agência Adsgator.

Leia o briefing abaixo na íntegra. Execute os três passos na ordem. Não pule etapas.

---

## DNA ADSGATOR — REGRAS INEGOCIÁVEIS

${this.obterDNAAdsgatorPorTipo(briefing.tipo)}

**Intenção de Busca em Primeiro Lugar**
O texto espelha a dor exata que levou o usuário a pesquisar. A H1 justifica o clique no anúncio nos primeiros 3 segundos. Venda o alívio da dor, não o nome técnico do serviço.

**Zero Institucional**
Proibido: "inovador", "excelência", "missão", "visão", "somos apaixonados por", "comprometidos com", "resultados extraordinários", "transforme sua vida". Se parece site corporativo genérico, está errado.

**Comunicação Direta e Realista**
Sem promessas milagrosas. Sem adjetivar o óbvio. A copy entrega o que o serviço realmente faz — nem mais, nem menos.

**Tom Conversacional com Autoridade**
Especialista conversando olho no olho. Firmeza sem arrogância. Proximidade sem informalidade excessiva.

**Linguagem Natural sem Travessão**
Proibido usar travessão (—) na copy. Escreva de forma natural e conversacional, como se estivesse falando diretamente com o cliente. Use vírgulas, pontos ou "e", nunca travessão.

---

## BRIEFING DO PROJETO

### Identidade

| Campo | Valor |
|-------|-------|
| **Cliente** | ${this.P?.name || '—'} |
| **Nicho** | ${briefing.segmento || '—'} |
| **Serviço principal** | ${briefing.servico_principal || '—'} |
| **Proposta de valor** | ${briefing.proposta_valor || '—'} |
| **Objetivo de conversão** | ${briefing.objetivo_conversao || '—'} |
| **Público primário** | ${briefing.publico_primario || '—'} |
| **Público secundário** | ${briefing.publico_secundario || '—'} |
| **Cidade / Região** | ${briefing.cidade || '—'} |
| **Modalidade** | ${briefing.modalidade || '—'} |
| **WhatsApp** | ${briefing.whatsapp || '—'} |
| **Mensagem pré-preenchida WA** | ${briefing.mensagem_wa || 'Olá! Vi o site e quero saber mais.'} |
| **GTM ID** | ${briefing.gtm_id || 'a confirmar'} |

### Tom de Voz

**Personalidade da marca:** ${briefing.tom_personalidade || '—'}

**Vocabulário que o cliente usa (deve aparecer na copy):**
${briefing.tom_vocabulario_usa || '—'}

**Vocabulário que o cliente NUNCA usaria:**
${briefing.tom_vocabulario_nao || '—'}

**Uma frase que resume o tom:** ${briefing.tom_frase_resumo || '—'}

### Briefing Completo do Cliente

${briefing.briefing_bruto || '(não preenchido)'}

### Informações Adicionais

${briefing.restricoes || '(não preenchido)'}

### Presença Digital

| Ativo Digital | Status e Detalhe |
|---------------|-----------------|
| **Perfil Google Business** | ${gbStatus} |
| **Instagram** | ${igStatus} |
| **Endereço físico** | ${endStatus} |
| **Depoimentos coletados** | ${depStatus} |

---

## PASSOS DE EXECUÇÃO

### PASSO A — Análise de Intenção *(não aparece na página)*

Mapeie as **3 dores principais** do usuário que pesquisa por este serviço.

Para cada dor, entregue:
- **Dor real:** o que ele sente / o problema concreto
- **Palavra da busca:** como digita no Google (não o termo técnico)
- **Resultado desejado:** o que imagina conquistar ao clicar

Antes de passar para o PASSO B, confirme: a H1 que você vai escrever espelha diretamente a Dor #1?

### PASSO B — Metadados de SEO *(não aparece na página — vai no \`<head>\`)*

**Landing Page principal:**
- \`<title>\`: máximo 60 caracteres. Palavra-chave + cidade/região se local.
- \`<meta description>\`: máximo 160 caracteres. Tom conversacional. Dor + benefício + CTA implícito.
- \`<meta keywords>\`: 5 a 8 termos de busca relevantes.
- \`<og:title>\` e \`<og:description>\`: para compartilhamento social.

**Página /links:**
- \`<title>\`: máximo 60 caracteres.
- \`<meta description>\`: máximo 100 caracteres. Foco em conversão direta.

### PASSO C — Construção do Fluxo da Página

Monte a página como uma narrativa contínua. Cada bloco conduz o usuário um passo adiante.

**Regras de seleção de blocos:**
- Localização + Mapa: só se presencial com endereço autorizado
- Avaliações Google: só se ≥ 10 avaliações reais. Nunca invente nota.
- Feed Instagram: só se perfil ativo e relevante
- FAQ: só se há objeções reais no briefing
- Planos e Preços: só se valores fornecidos e autorizados
- Prova Social: só se há depoimentos reais. Nunca invente.
- Nunca repita a mesma dor em blocos diferentes sem evolução narrativa

**Blocos disponíveis:**

| Bloco | Quando usar |
|-------|-------------|
| Cabeçalho | Sempre |
| Hero — Impacto Inicial | Sempre. H1 focada na Dor #1. |
| O Serviço | Sempre. O que é, como funciona, sem jargão. |
| Diferenciais | Sempre. Benefícios reais + credibilidade. |
| Como Funciona | Se o processo reduz objeção de "como é isso?" |
| Planos e Preços | Se valores fornecidos e autorizados |
| Prova Social — Depoimentos | Se há depoimentos reais |
| Avaliações Google | Se Google Business com ≥ 10 avaliações reais |
| Feed Instagram | Se perfil ativo e relevante |
| FAQ | Se há objeções fortes no briefing |
| Logística / Localização + Mapa | Se presencial confirmado com endereço autorizado |
| CTA Final | Sempre |
| Rodapé | Sempre |

---

## ❌ O QUE NÃO FAZER

**Títulos e textos:**
- ❌ H1 que não espelhe uma dor real de busca
- ❌ "Transforme a vida do seu X" / "A solução definitiva" / "Método revolucionário"
- ❌ Qualquer frase com "missão", "visão", "valores", "anos de experiência no mercado"
- ❌ "Cada caso é único" / "Estamos aqui para te ajudar em cada etapa da jornada"
- ❌ Copy na terceira pessoa — nunca "O profissional atende", sempre "Eu atendo"

**CTAs:**
- ❌ "Saiba mais" / "Clique aqui" / "Entre em contato" / "Solicite um orçamento"
- ❌ CTA que não diz o que vai acontecer ao clicar

**Estruturalmente:**
- ❌ Inventar depoimentos, avaliações ou notas do Google
- ❌ Incluir blocos de integração sem confirmar o ativo digital existe
- ❌ Finalizar sem CTA claro antes do footer
- ❌ Metadados genéricos

---

## FORMATO OBRIGATÓRIO DE ENTREGA

**IMPORTANTE:** O output que você gera será importado diretamente por um sistema.
Siga o formato abaixo com precisão. Qualquer desvio impede o parse automático.

Comece com \`===INICIO-OUTPUT===\` e termine com \`===FIM-OUTPUT===\`.
Tudo fora desses delimitadores é ignorado pelo sistema.

\`\`\`
===INICIO-OUTPUT===

## RESUMO DO PROJETO

| Campo | Valor |
|-------|-------|
| **Objetivo da página** | [uma frase] |
| **Público-alvo principal** | [uma frase] |
| **Tom de voz** | [uma frase] |
| **Nicho** | [uma frase] |
| **Objetivo de conversão** | [uma frase] |
| **Número WhatsApp** | [DDI+DDD+número, só dígitos] |
| **Mensagem pré-preenchida** | [texto da mensagem] |
| **Link do CTA principal** | [deixar em branco] |
| **ID do GTM** | [GTM-XXXXXXX ou "a confirmar"] |

---

## 1. ANÁLISE DE INTENÇÃO

### Dor #1
- **Dor real:** [texto]
- **Palavra da busca:** [texto]
- **Resultado desejado:** [texto]
- **Confirmação H1:** Sim — "[trecho da H1]"

### Dor #2
- **Dor real:** [texto]
- **Palavra da busca:** [texto]
- **Resultado desejado:** [texto]

### Dor #3
- **Dor real:** [texto]
- **Palavra da busca:** [texto]
- **Resultado desejado:** [texto]

---

## 2. METADADOS DE SEO

### Landing Page Principal
- **title:** [máx 60 chars]
- **meta description:** [máx 160 chars]
- **meta keywords:** [5-8 termos separados por vírgula]
- **og:title:** [texto]
- **og:description:** [texto]

### Página /links
- **title:** [máx 60 chars]
- **meta description:** [máx 100 chars]

---

## 3. FLUXO SELECIONADO

1. [Nome do Bloco] — [justificativa em 1 linha]
2. [Nome do Bloco] — [justificativa em 1 linha]
...

---

## 4. COPY COMPLETA

### BLOCO: [Nome Exato]

**Objetivo persuasivo:**
[texto]

**Copy completa:**
- LABEL (se aplicável): "[texto]"
- TÍTULO PRINCIPAL: "[texto]"
- SUBTÍTULO / TEXTO DE APOIO: "[texto]"
- ITENS (se aplicável):
  - "[item 1]"
  - "[item 2]"
- CTA / BOTÃO (se aplicável): "[texto]"

**Nota de integração (se aplicável):**
[texto]

**Nota visual:**
[texto]

---

[Repetir para cada bloco]

===FIM-OUTPUT===
\`\`\`

Não resuma a copy. Não invente dados. Não use placeholders.
`;
  },

  // ============================================================
  // DOWNLOAD DO ARQUIVO
  // ============================================================

  baixarArquivoEstruturaCopy() {
    const briefing = this.B;

    if (!this.P?.name) {
      this.showToast('⚠️ Defina o nome do projeto antes de baixar', 'warning');
      return;
    }

    const conteudo = this.gerarArquivoEstruturaCopy();
    const slug = (this.P.name || 'projeto')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const blob = new Blob([conteudo], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estrutura-copy-${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('✅ Arquivo baixado! Leve para a IA e cole o output de volta.', 'success');
  },

  // ============================================================
  // PARSER DO OUTPUT DA IA EXTERNA
  // ============================================================

  parsearOutputIA(textoCompleto) {
    const regexDelimitador = /===INICIO-OUTPUT===([\s\S]*?)===FIM-OUTPUT===/;
    const match = regexDelimitador.exec(textoCompleto);

    if (!match) {
      throw new Error(
        'Formato inválido: não encontrei ===INICIO-OUTPUT=== e ===FIM-OUTPUT===.\n' +
        'Certifique-se de colar o output completo da IA, incluindo os delimitadores.'
      );
    }

    const conteudo = match[1].trim();

    const resumo = this.parsearResumo(conteudo);
    const intencao = this.parsearIntencao(conteudo);
    const seo = this.parsearSEO(conteudo);
    const fluxo = this.parsearFluxo(conteudo);
    const blocos = this.parsearBlocos(conteudo);

    return { resumo, intencao, seo, fluxo, blocos };
  },

  parsearResumo(conteudo) {
    const resumo = {};
    const secao = this.extrairSecao(conteudo, 'RESUMO DO PROJETO', '1. ANÁLISE');
    if (!secao) return resumo;

    const linhas = secao.split('\n');
    linhas.forEach(linha => {
      const match = /\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|/.exec(linha);
      if (match) {
        const chave = match[1].trim().toLowerCase().replace(/\s+/g, '_');
        const valor = match[2].trim();
        if (valor && valor !== '[deixar em branco]') {
          resumo[chave] = valor;
        }
      }
    });

    return resumo;
  },

  parsearIntencao(conteudo) {
    const secao = this.extrairSecao(conteudo, '1. ANÁLISE DE INTENÇÃO', '2. METADADOS');
    if (!secao) return {};

    const dores = {};
    [1, 2, 3].forEach(n => {
      const regexDor = new RegExp(`### Dor #${n}([\\s\\S]*?)(?=### Dor #${n + 1}|---|\$)`);
      const match = regexDor.exec(secao);
      if (match) {
        const bloco = match[1];
        dores[`dor${n}_real`] = this.extrairCampoLista(bloco, 'Dor real');
        dores[`dor${n}_busca`] = this.extrairCampoLista(bloco, 'Palavra da busca');
        dores[`dor${n}_resultado`] = this.extrairCampoLista(bloco, 'Resultado desejado');
      }
    });

    return dores;
  },

  parsearSEO(conteudo) {
    const secao = this.extrairSecao(conteudo, '2. METADADOS DE SEO', '3. FLUXO');
    if (!secao) return {};

    return {
      title: this.extrairCampoLista(secao, 'title'),
      description: this.extrairCampoLista(secao, 'meta description'),
      keywords: this.extrairCampoLista(secao, 'meta keywords'),
      og_title: this.extrairCampoLista(secao, 'og:title'),
      og_description: this.extrairCampoLista(secao, 'og:description'),
      links_title: this.extrairCampoLista(secao, 'title', 1),
      links_description: this.extrairCampoLista(secao, 'meta description', 1)
    };
  },

  parsearFluxo(conteudo) {
    const secao = this.extrairSecao(conteudo, '3. FLUXO SELECIONADO', '4. COPY');
    if (!secao) return [];

    const linhas = secao.split('\n');
    const itens = [];
    linhas.forEach(linha => {
      const match = /^\d+\.\s+(.+?)\s*—\s*(.+)$/.exec(linha.trim());
      if (match) {
        itens.push({
          bloco: match[1].trim(),
          justificativa: match[2].trim()
        });
      }
    });

    return itens;
  },

  parsearBlocos(conteudo) {
    const secao = this.extrairSecao(conteudo, '4. COPY COMPLETA', null);
    if (!secao) return [];

    const regexBloco = /### BLOCO:\s*(.+?)\n([\s\S]*?)(?=### BLOCO:|$)/g;
    const blocos = [];
    let match;

    while ((match = regexBloco.exec(secao)) !== null) {
      const nome = match[1].trim();
      const corpo = match[2].trim();

      blocos.push({
        id: nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-'),
        nome,
        objetivo: this.extrairSubsecao(corpo, 'Objetivo persuasivo'),
        copy: this.extrairSubsecao(corpo, 'Copy completa'),
        integracao: this.extrairSubsecao(corpo, 'Nota de integração'),
        visual: this.extrairSubsecao(corpo, 'Nota visual')
      });
    }

    return blocos;
  },

  // Helpers de parsing
  extrairSecao(texto, inicio, fim) {
    const regexInicio = new RegExp(`##\\s+${inicio.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
    const posInicio = texto.search(regexInicio);
    if (posInicio === -1) return null;

    let posFim = texto.length;
    if (fim) {
      const regexFim = new RegExp(`##\\s+${fim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
      const matchFim = texto.slice(posInicio).search(regexFim);
      if (matchFim !== -1) posFim = posInicio + matchFim;
    }

    return texto.slice(posInicio, posFim);
  },

  extrairSubsecao(texto, titulo) {
    const regex = new RegExp(
      `\\*\\*${titulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^:]*:\\*\\*\\n([\\s\\S]*?)(?=\\n\\*\\*|$)`
    );
    const match = regex.exec(texto);
    return match ? match[1].trim() : '';
  },

  extrairCampoLista(texto, campo, ocorrencia = 0) {
    const regex = new RegExp(
      `\\*\\*${campo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^:]*:\\*\\*\\s*(.+)`,
      'gi'
    );
    let count = 0;
    let match;
    while ((match = regex.exec(texto)) !== null) {
      if (count === ocorrencia) return match[1].trim();
      count++;
    }
    return '';
  },

  // ============================================================
  // PROCESSAR IMPORT — Cola e Parseia
  // ============================================================

  processarOutputColado(textoColado) {
    if (!textoColado || textoColado.trim().length < 100) {
      this.showToast('⚠️ Cole o output completo da IA antes de importar', 'warning');
      return false;
    }

    try {
      const parsed = this.parsearOutputIA(textoColado);

      if (!parsed.blocos || parsed.blocos.length === 0) {
        this.showToast('⚠️ Nenhum bloco encontrado. Verifique o formato do output.', 'warning');
        return false;
      }

      // Salvar no briefing
      this.setField('estruturaCopyBlocos', parsed.blocos);
      this.setField('intencao', { ...(this.B.intencao || {}), ...parsed.intencao });
      this.setField('seo', parsed.seo);
      this.setField('estruturaCopyFluxo', parsed.fluxo);
      this.setField('estruturaCopyResumo', parsed.resumo);
      this.setField('estruturaCopyTimestamp', new Date().toISOString());
      this.setField('estruturaCopyFonte', 'ia-externa');

      this.showToast(`✅ ${parsed.blocos.length} blocos importados com sucesso!`, 'success');
      return true;
    } catch (error) {
      this.showToast(`❌ ${error.message}`, 'error');
      console.error('Erro no parse:', error);
      return false;
    }
  },

  // ============================================================
  // GERAÇÃO INTERNA (IA DO SISTEMA)
  // ============================================================

  async gerarEstruturaCopyInterno() {
    if (!this.P?.name) {
      this.showToast('⚠️ Defina o nome do projeto antes de gerar', 'warning');
      return;
    }

    this.openAILog('Gerando Estrutura e Copy', [
      { id: 1, icon: 'file-text', label: 'Analisando briefing...' },
      { id: 2, icon: 'cpu', label: 'Gerando conteúdo (pode levar 1-2 min)...' },
      { id: 3, icon: 'save', label: 'Processando resultado...' }
    ]);
    this.aiLogStep(1);

    try {
      const conteudoArquivo = this.gerarArquivoEstruturaCopy();
      const prompt = conteudoArquivo + `

---

INSTRUÇÃO ADICIONAL: Gere agora o output completo seguindo exatamente o FORMATO OBRIGATÓRIO DE ENTREGA acima. Inclua os delimitadores ===INICIO-OUTPUT=== e ===FIM-OUTPUT===.
`;

      this.aiLogStep(2);
      const resposta = await this.callAI({
        userPrompt: prompt,
        maxTokens: 4000 // Aumentar para garantir copy completa
      });

      this.aiLogStep(3);
      this.closeAILog();

      const ok = this.processarOutputColado(resposta);
      if (ok) {
        this.renderScreen();
      }
    } catch (error) {
      this.closeAILog();
      this.showToast(`❌ Erro ao gerar: ${error.message}`, 'error');
      console.error(error);
    }
  },

  // ============================================================
  // RENDERIZAÇÃO DOS CARDS
  // ============================================================

  renderizarBlocosHTML(blocos) {
    if (!blocos || blocos.length === 0) {
      return `
        <div class="placeholder-estado">
          <div class="placeholder-icon">
            <i data-lucide="layout" style="width:64px;height:64px"></i>
          </div>
          <div class="placeholder-text">
            <p>Sua página ainda não tem estrutura. Clique em <strong>"Gerar Estrutura e Copy"</strong> para começar ou importe o trabalho de uma IA externa.</p>
          </div>
        </div>
      `;
    }

    return blocos.map((bloco, idx) => `
      <div class="bloco-card" id="bloco-card-${bloco.id}">
        <div class="bloco-card-header">
          <span class="bloco-numero">${idx + 1}</span>
          <h3 class="bloco-nome">${bloco.nome}</h3>
          <div class="bloco-actions">
            <button class="btn-action-minimal" onclick="App.editarBloco('${bloco.id}')" title="Editar">
              <i data-lucide="edit-2" style="width:16px;height:16px"></i>
            </button>
            <button class="btn-action-minimal" onclick="App.copiarBloco('${bloco.id}')" title="Copiar">
              <i data-lucide="copy" style="width:16px;height:16px"></i>
            </button>
          </div>
        </div>

        <div class="bloco-card-body">
          ${bloco.objetivo ? `
            <div class="bloco-secao">
              <span class="bloco-secao-label"><i data-lucide="target" style="width:12px;height:12px"></i> Objetivo Persuasivo</span>
              <p class="bloco-secao-conteudo">${bloco.objetivo}</p>
            </div>
          ` : ''}

          ${bloco.copy ? `
            <div class="bloco-secao">
              <span class="bloco-secao-label"><i data-lucide="file-text" style="width:12px;height:12px"></i> Copy Completa</span>
              <div class="bloco-secao-copy">${bloco.copy}</div>
            </div>
          ` : ''}

          ${bloco.integracao ? `
            <div class="bloco-secao bloco-secao-integracao">
              <span class="bloco-secao-label"><i data-lucide="cpu" style="width:12px;height:12px"></i> Nota de Integração</span>
              <p class="bloco-secao-conteudo">${bloco.integracao}</p>
            </div>
          ` : ''}

          ${bloco.visual ? `
            <div class="bloco-secao bloco-secao-visual">
              <span class="bloco-secao-label"><i data-lucide="image" style="width:12px;height:12px"></i> Nota Visual</span>
              <p class="bloco-secao-conteudo">${bloco.visual}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  },

  editarBloco(blocoId) {
    const blocos = this.B.estruturaCopyBlocos || [];
    const bloco = blocos.find(b => b.id === blocoId);
    if (!bloco) return;

    document.getElementById('edit-bloco-nome-label').textContent = bloco.nome;
    document.getElementById('edit-bloco-objetivo').value = bloco.objetivo || '';
    document.getElementById('edit-bloco-copy').value = bloco.copy || '';
    document.getElementById('edit-bloco-integracao').value = bloco.integracao || '';
    document.getElementById('edit-bloco-visual').value = bloco.visual || '';

    this.state._blocoemEdicao = blocoId;
    this.openModal('modal-editar-bloco');
  },

  salvarEdicaoBloco() {
    const blocoId = this.state._blocoemEdicao;
    const blocos = [...(this.B.estruturaCopyBlocos || [])];
    const idx = blocos.findIndex(b => b.id === blocoId);
    if (idx === -1) return;

    blocos[idx] = {
      ...blocos[idx],
      objetivo: document.getElementById('edit-bloco-objetivo').value,
      copy: document.getElementById('edit-bloco-copy').value,
      integracao: document.getElementById('edit-bloco-integracao').value,
      visual: document.getElementById('edit-bloco-visual').value
    };

    this.setField('estruturaCopyBlocos', blocos);
    this.closeModal('modal-editar-bloco');
    this.renderScreen(true);
    this.showToast('✅ Bloco salvo!', 'success');
  },

  async copiarBloco(blocoId) {
    const blocos = this.B.estruturaCopyBlocos || [];
    const bloco = blocos.find(b => b.id === blocoId);
    if (!bloco) return;

    const texto = `### BLOCO: ${bloco.nome}\n\n**Objetivo persuasivo:**\n${bloco.objetivo}\n\n**Copy completa:**\n${bloco.copy}${bloco.integracao ? '\n\n**Nota de integração:**\n' + bloco.integracao : ''}${bloco.visual ? '\n\n**Nota visual:**\n' + bloco.visual : ''}`;

    await navigator.clipboard.writeText(texto);
    this.showToast('✅ Bloco copiado!', 'success');
  }

});
