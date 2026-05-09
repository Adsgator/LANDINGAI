# 📋 Ficha de Implementação — LandingAI
## PARTE 1: Refatoração da Tela "Estrutura e Copy"

**Status:** Pronto para Implementação  
**Versão:** 1.0  
**Data:** 09/05/2026

---

## 📌 CONTEXTO

A tela atual de "Estrutura da LP" está gerando informações incompletas nos cards e não está gerando a copy de forma estruturada conforme o padrão Adsgator.

**Objetivo:** Criar tela completa de "Estrutura e Copy" que:
1. Gera estrutura lógica de blocos
2. Gera copy real para cada bloco (não apenas título)
3. Exibe informações completas nos cards
4. Permite download do arquivo para processamento externo
5. Permite upload e parsing de estrutura gerada externamente

---

## 1. ARQUITETURA DA SOLUÇÃO

### 1.1 Novo Arquivo: `assets/js/screens/estrutura-copy.js`

Este arquivo **substitui e melhora** o `estrutura.js` atual com:

- Geração de estrutura lógica (7 blocos obrigatórios)
- Geração de copy completa para CADA bloco
- Cards detalhados com todas as informações
- Download em formato estruturado
- Upload e parsing de estrutura externa
- Validação de completude

### 1.2 Fluxo Esperado

```
STEP 2 (Briefing) Completo
    ↓
STEP 3+ (Análise de Intenção, Dores, etc) Completo
    ↓
TELA: Estrutura e Copy
    ├─ Gerar Estrutura e Copy (botão)
    │   ├─ IA analisa dados acumulados
    │   ├─ IA gera 7 blocos obrigatórios
    │   ├─ IA gera copy COMPLETA por bloco
    │   └─ UI renderiza em cards detalhados
    │
    ├─ Download para IA Externa (botão)
    │   └─ Formato: `estrutura-copy-[slug].md`
    │
    └─ Upload de Estrutura Externa (botão)
        ├─ User cola/seleciona arquivo
        ├─ Sistema parseia formato padrão
        └─ Popula cards com dados importados
```

---

## 2. ESTRUTURA DE DADOS

### 2.1 Formato de Saída (Download)

```markdown
# Estrutura e Copy — [Nome do Cliente]

**Projeto:** [Nome]
**Data:** [Data]
**Status:** [Rascunho / Revisado / Aprovado]

---

## ANÁLISE DE INTENÇÃO (Referência)

**Dor Principal:** [texto]
**Público-Alvo:** [texto]
**Proposta de Valor:** [texto]

---

## BLOCOS DA LANDING PAGE

### BLOCO 1: Cabeçalho (Header)

**Objetivo Persuasivo:**
[Descrição psicológica do objetivo deste bloco]

**Copy Completa:**
- LABEL: "[Adsgator]"
- TÍTULOS DE NAVEGAÇÃO:
  - "[Link 1]"
  - "[Link 2]"
  - "[Link 3]"
- CTA PRINCIPAL: "[ex: Agendar Avaliação]"

**Nota Visual:**
[ex: "Logo à esquerda. Menu hambúrguer em mobile. Fundo branco com logo em cores da marca."]

---

### BLOCO 2: Hero — Impacto Inicial

**Objetivo Persuasivo:**
[Conecta com a dor principal. Oferece alívio. Cria urgência.]

**Copy Completa:**
- TÍTULO PRINCIPAL: "[H1 — espelha Dor #1]"
- SUBTÍTULO: "[Promessa de transformação sem milagre]"
- CTA / BOTÃO: "[Ação clara — ex: 'Agendar Avaliação Gratuita']"

**Nota Visual:**
[ex: "Imagem do profissional à direita. Fundo com gradiente suave. H1 em 48px mobile, 72px desktop."]

---

### BLOCO 3: O Serviço

**Objetivo Persuasivo:**
[Explica o que é o serviço. Remove objeção "O que é isso?"]

**Copy Completa:**
- TÍTULO PRINCIPAL: "[Título do serviço em 1ª pessoa]"
- SUBTÍTULO: "[O que é + benefício principal]"
- DESCRIÇÃO: "[Parágrafo explicativo do serviço]"
- ITENS (se aplicável):
  - "[Item 1 do serviço]"
  - "[Item 2 do serviço]"

**Nota Visual:**
[ex: "Descrição com ícones ao lado. Máximo 3 itens. Fundo cinza claro."]

---

### BLOCO 4: Como Funciona (Condicional)

**Objetivo Persuasivo:**
[Remove objeção sobre o processo. Mostra clareza e estrutura.]

**Copy Completa:**
- TÍTULO PRINCIPAL: "[Como funciona o processo?]"
- SUBTÍTULO: "[Resumo do processo]"
- ETAPAS:
  - Etapa 1: "[Descrição]"
  - Etapa 2: "[Descrição]"
  - Etapa 3: "[Descrição]"
  - Etapa 4: "[Descrição]"

**Nota Visual:**
[ex: "Timeline vertical em mobile, horizontal em desktop. Numeração 1-4. Ícones em cada etapa."]

---

### BLOCO 5: Diferenciais

**Objetivo Persuasivo:**
[Diferencia do concorrência. Constrói valor e credibilidade.]

**Copy Completa:**
- TÍTULO PRINCIPAL: "[Por que escolher este serviço?]"
- SUBTÍTULO: "[Resumo dos diferenciais]"
- DIFERENCIAIS:
  - "[Diferencial 1]"
  - "[Diferencial 2]"
  - "[Diferencial 3]"
  - "[Diferencial 4]"
  - "[Diferencial 5]"

**Nota Visual:**
[ex: "5 cards em grid 3-2. Ícones diferentes para cada. Sombra suave."]

---

### BLOCO 6: Prova Social (Google Reviews OU Depoimentos)

**Objetivo Persuasivo:**
[Valida a autoridade. Reduz objeção "É bom mesmo?"]

**Copy Completa:**
- TÍTULO PRINCIPAL: "[O que meus clientes dizem]"
- SUBTÍTULO: "[Resumo da prova social]"
- INTEGRAÇÃO: "[Google Business API OU Depoimentos manuais]"

**Nota de Integração:**
[ex: "Google Business: API v4, perfil confirmado com 4.8★ e 27 reviews. Mostrar 3 reviews aleatórios."]

**Nota Visual:**
[ex: "Cards com foto/avatar. Nome + profissão. Estrelas (★★★★★). Fundo branco, cards com borda."]

---

### BLOCO 7: CTA Final

**Objetivo Persuasivo:**
[Última oportunidade para converter. Reforça urgência e alívio.]

**Copy Completa:**
- TÍTULO PRINCIPAL: "[Pronto para transformar sua [resultado]?]"
- SUBTÍTULO: "[Reforço final de promessa]"
- CTA PRINCIPAL: "[Ação — ex: 'Agendar Avaliação Agora']"
- CTA SECUNDÁRIO (Opcional): "[ex: 'Tirar dúvidas no WhatsApp']"

**Nota Visual:**
[ex: "Seção em duas cores. Botão primary em cor da marca. Subtítulo em tom conversacional."]

---

## INCLUSÕES CONDICIONAIS

### Bloco: Localização + Mapa
- **Incluído?** [SIM / NÃO]
- **Razão:** [Se SIM, explica; Se NÃO, explica]
- **Endereço:** [Se incluído]
- **Mapa:** [Se incluído — coordenadas]

### Bloco: Instagram Feed
- **Incluído?** [SIM / NÃO]
- **Razão:** [Se SIM, qual perfil; Se NÃO, por quê]
- **@ do Perfil:** [Se incluído]

### Bloco: FAQ
- **Incluído?** [SIM / NÃO]
- **Razão:** [Objeções identificadas]
- **Perguntas:** [Se incluído, lista as 5 principais]

---

## RODAPÉ

**Objetivo Persuasivo:**
[Fecha com autoridade. Oferece opção final de contato.]

**Copy Completa:**
- LOGO: "[Marca]"
- LINKS RÁPIDOS:
  - "[Link 1]"
  - "[Link 2]"
- CONTATO:
  - "WhatsApp: [número]"
  - "Email: [email]"
- REDES SOCIAIS:
  - "Instagram: [@]"
  - "Facebook: [página]"
- LEGAL:
  - "Política de Privacidade"
  - "Termos de Uso"
- CRÉDITO: "Desenvolvido com ❤️ por Adsgator"

---

## STATUS DE ENTREGA

- [ ] Estrutura de 7 blocos definida
- [ ] Copy completa para cada bloco
- [ ] Condicionais mapeadas (Mapa, Instagram, FAQ)
- [ ] Arquivo pronto para download
- [ ] Arquivo pronto para aprovação

```

---

## 3. IMPLEMENTAÇÃO EM JAVASCRIPT

### 3.1 Arquivo Novo: `assets/js/screens/estrutura-copy.js`

```javascript
// assets/js/screens/estrutura-copy.js
// ============================================================
// Tela: Estrutura e Copy da Landing Page
// ============================================================

import { callLLM } from '../02-api.js';
import { appState } from '../01-state.js';
import { showToast } from '../14-toast.js';
import { showLoader, hideLoader } from '../05-loader.js';

// ============================================================
// ESTRUTURA DE BLOCOS PADRÃO
// ============================================================

const BLOCOS_PADRAO = [
  {
    id: 'header',
    nome: 'Cabeçalho (Header)',
    tipo: 'obrigatorio',
    ordem: 1,
    descricao: 'Navegação e identidade visual da marca'
  },
  {
    id: 'hero',
    nome: 'Hero — Impacto Inicial',
    tipo: 'obrigatorio',
    ordem: 2,
    descricao: 'Captura atenção com H1 focada na Dor #1'
  },
  {
    id: 'o-servico',
    nome: 'O Serviço',
    tipo: 'obrigatorio',
    ordem: 3,
    descricao: 'Explica o que é o serviço sem jargão'
  },
  {
    id: 'como-funciona',
    nome: 'Como Funciona',
    tipo: 'condicional',
    ordem: 4,
    descricao: 'Processo em etapas — reduz objeção sobre metodologia',
    condicao: 'sempre' // pode ser "sempre", "se_processo_complexo", etc
  },
  {
    id: 'diferenciais',
    nome: 'Diferenciais',
    tipo: 'obrigatorio',
    ordem: 5,
    descricao: 'O que torna o serviço diferente dos concorrentes'
  },
  {
    id: 'prova-social',
    nome: 'Prova Social',
    tipo: 'condicional',
    ordem: 6,
    descricao: 'Depoimentos ou Google Reviews',
    condicao: 'se_tem_avaliacoes_ou_depoimentos'
  },
  {
    id: 'cta-final',
    nome: 'CTA Final',
    tipo: 'obrigatorio',
    ordem: 7,
    descricao: 'Última chamada para ação com urgência'
  }
];

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * Monta o prompt para IA gerar estrutura e copy
 * Baseado em todos os steps preenchidos
 */
function montarPromptEstruturaCopy() {
  const { briefing, dosPrincipais, intencao } = appState;

  const prompt = `
Você é um Copywriter Sênior especializado em Landing Pages de Alta Conversão.

Sua missão: Gerar a estrutura e copy COMPLETA para uma landing page, seguindo exatamente o padrão Adsgator.

## BRIEFING DO CLIENTE

${JSON.stringify(briefing, null, 2)}

## ANÁLISE DE INTENÇÃO (Já feita)

Dor #1: ${intencao.dor1}
Dor #2: ${intencao.dor2}
Dor #3: ${intencao.dor3}

## DORES E SOLUÇÕES MAPEADAS

${JSON.stringify(dosPrincipais, null, 2)}

## SUAS TAREFAS

### 1. ESTRUTURA DOS BLOCOS

Defina os 7 blocos obrigatórios:
1. Cabeçalho (Header)
2. Hero — H1 focada em Dor #1
3. O Serviço — Explicação clara
4. Como Funciona — Processo em etapas
5. Diferenciais — O que diferencia
6. Prova Social — Reviews ou Depoimentos
7. CTA Final + Rodapé

Adicione blocos condicionais se aplicável:
- Localização + Mapa (se presencial confirmado)
- Instagram Feed (se perfil ativo e relevante)
- FAQ (se há objeções reais mapeadas)

### 2. COPY PARA CADA BLOCO

Para CADA bloco, entregue EXATAMENTE neste formato:

\`\`\`
### BLOCO: [Nome]

**Objetivo Persuasivo:**
[O que este bloco faz psicologicamente. Como conecta com o anterior.]

**Copy Completa:**
- LABEL (se aplicável): "[texto]"
- TÍTULO PRINCIPAL: "[texto]"
- SUBTÍTULO / TEXTO DE APOIO: "[texto]"
- ITENS (se aplicável):
  - "[item 1]"
  - "[item 2]"
  - "[item 3]"
- CTA / BOTÃO (se aplicável): "[texto]"

**Nota de Integração (se aplicável):**
[Instrução técnica — ex: Google Reviews API, Feed Instagram]

**Nota Visual:**
[Para o designer — ex: "Ideal com foto ao lado." / "Fundo gradiente."]
\`\`\`

### 3. DNA ADSGATOR — REGRAS ABSOLUTAS

✅ FAZER:
- H1 espelha exatamente a Dor #1
- Copy em 1ª pessoa: "Eu atendo...", nunca "O profissional..."
- CTAs específicos: "Agendar Avaliação Gratuita", nunca "Saiba mais"
- Comunicação direta e realista
- Sem promessas milagrosas

❌ NÃO FAZER:
- Palavras proibidas: "inovador", "excelência", "missão", "visão"
- Copy genérica ou institucional
- Depoimentos inventados
- Blocos sem justificativa
- Qualquer informação não baseada no briefing

## FORMATO DE ENTREGA

Entregue em Markdown estruturado, começando com:

# Estrutura e Copy — ${briefing.nome_cliente}

**Data:** [data de hoje]
**Status:** Rascunho
**Profissional:** ${briefing.nome_cliente}
**Nicho:** ${briefing.nicho}

---

Depois entregue cada BLOCO conforme especificado acima, na ordem correta.

Certifique-se de que:
1. Cada bloco tem objetivo persuasivo claro
2. Copy é COMPLETA (não resumida)
3. CTAs são específicos e convincentes
4. Tudo segue o DNA Adsgator
5. Nenhuma informação inventada
  `;

  return prompt;
}

/**
 * Chama a IA para gerar estrutura e copy
 */
async function gerarEstruturaCopy() {
  const { briefing, intencao } = appState;

  if (!briefing || !intencao) {
    showToast('⚠️ Complete todos os steps antes de gerar a estrutura', 'warning');
    return;
  }

  showLoader('Gerando estrutura e copy...');

  try {
    const prompt = montarPromptEstruturaCopy();
    const response = await callLLM(prompt, 'gpt-4', 8000);

    // Salvar resposta no state
    appState.estruturaCopy = response;
    appState.estruturaCopyTimestamp = new Date().toISOString();

    hideLoader();
    showToast('✅ Estrutura e Copy gerada com sucesso!', 'success');

    // Renderizar no UI
    renderizarEstruturaCopy(response);
  } catch (error) {
    hideLoader();
    showToast(`❌ Erro ao gerar: ${error.message}`, 'error');
    console.error('Erro na geração:', error);
  }
}

/**
 * Parseia a resposta da IA em blocos estruturados
 */
function parseiarEstruturaCopy(conteudo) {
  // Regex para encontrar cada BLOCO: [Nome]
  const regexBloco = /### BLOCO:\s*(.+?)\n\n([\s\S]*?)(?=### BLOCO:|$)/g;
  const blocos = [];
  let match;

  while ((match = regexBloco.exec(conteudo)) !== null) {
    const nomeBl = match[1].trim();
    const conteudoBl = match[2].trim();

    // Extrair seções
    const regexObjetivo = /\*\*Objetivo Persuasivo:\*\*\n([\s\S]*?)(?=\n\n\*\*)/;
    const regexCopy = /\*\*Copy Completa:\*\*([\s\S]*?)(?=\n\n\*\*)/;
    const regexIntegracao = /\*\*Nota de Integração.*?:\*\*\n([\s\S]*?)(?=\n\n\*\*|$)/;
    const regexVisual = /\*\*Nota Visual:\*\*\n([\s\S]*?)$/;

    blocos.push({
      id: nomeBl.toLowerCase().replace(/\s+/g, '-'),
      nome: nomeBl,
      objetivo: (regexObjetivo.exec(conteudoBl)?.[1] || '').trim(),
      copy: (regexCopy.exec(conteudoBl)?.[1] || '').trim(),
      integracao: (regexIntegracao.exec(conteudoBl)?.[1] || '').trim(),
      visual: (regexVisual.exec(conteudoBl)?.[1] || '').trim()
    });
  }

  return blocos;
}

/**
 * Renderiza os blocos em cards detalhados
 */
function renderizarEstruturaCopy(conteudo) {
  const blocos = parseiarEstruturaCopy(conteudo);
  const container = document.getElementById('estrutura-blocos-container');

  if (!container) return;

  container.innerHTML = '';

  blocos.forEach((bloco, idx) => {
    const card = document.createElement('div');
    card.className = 'estrutura-bloco-card';
    card.innerHTML = `
      <div class="card-header">
        <span class="card-order">${idx + 1}</span>
        <h3 class="card-title">${bloco.nome}</h3>
      </div>

      <div class="card-body">
        <!-- Objetivo -->
        <div class="card-section">
          <h4 class="section-title">Objetivo Persuasivo</h4>
          <p class="section-content">${bloco.objetivo || '—'}</p>
        </div>

        <!-- Copy -->
        <div class="card-section">
          <h4 class="section-title">Copy Completa</h4>
          <pre class="section-content code"><code>${bloco.copy || '—'}</code></pre>
        </div>

        <!-- Integração (se houver) -->
        ${bloco.integracao ? `
          <div class="card-section">
            <h4 class="section-title">Nota de Integração</h4>
            <p class="section-content">${bloco.integracao}</p>
          </div>
        ` : ''}

        <!-- Visual (se houver) -->
        ${bloco.visual ? `
          <div class="card-section">
            <h4 class="section-title">Nota Visual</h4>
            <p class="section-content">${bloco.visual}</p>
          </div>
        ` : ''}
      </div>

      <div class="card-actions">
        <button class="btn btn-small" onclick="editarBlocoEstrutura('${bloco.id}')">
          ✏️ Editar
        </button>
        <button class="btn btn-small" onclick="copiarBlocoEstrutura('${bloco.id}')">
          📋 Copiar
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Salvar parsed blocos no state
  appState.estruturaCopyBlocos = blocos;
}

/**
 * Download da estrutura em formato Markdown
 */
function baixarEstruturaCopy() {
  const { briefing, estruturaCopy } = appState;

  if (!estruturaCopy) {
    showToast('⚠️ Gere a estrutura primeiro', 'warning');
    return;
  }

  // Monta conteúdo final
  const conteudo = `# Estrutura e Copy — ${briefing.nome_cliente}

**Data:** ${new Date().toLocaleDateString('pt-BR')}
**Status:** Rascunho
**Profissional:** ${briefing.nome_cliente}
**Nicho:** ${briefing.nicho}
**Contato:** ${briefing.whatsapp || '—'}

---

${estruturaCopy}

---

*Documento gerado pelo LandingAI — Adsgator*
*Para gerar o DOC-IMPL, copie este arquivo e envie para uma IA externa (Claude, Gemini, Grok)*
`;

  // Criar arquivo
  const blob = new Blob([conteudo], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `estrutura-copy-${briefing.slug || 'projeto'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast('✅ Arquivo baixado com sucesso!', 'success');
}

/**
 * Upload de estrutura gerada externamente
 */
function iniciarUploadEstruturaCopy() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.md';
  input.onchange = (e) => processarUploadEstruturaCopy(e);
  input.click();
}

function processarUploadEstruturaCopy(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const conteudo = e.target.result;
      
      // Parsear o conteúdo
      appState.estruturaCopy = conteudo;
      appState.estruturaCopyTimestamp = new Date().toISOString();

      // Renderizar
      renderizarEstruturaCopy(conteudo);

      showToast('✅ Estrutura importada com sucesso!', 'success');
    } catch (error) {
      showToast(`❌ Erro ao processar arquivo: ${error.message}`, 'error');
    }
  };
  reader.readAsText(file);
}

/**
 * Editar um bloco específico
 */
function editarBlocoEstrutura(blocoId) {
  const bloco = appState.estruturaCopyBlocos.find(b => b.id === blocoId);
  if (!bloco) return;

  // Abrir modal de edição
  const modal = document.getElementById('modal-editar-bloco');
  if (!modal) {
    showToast('❌ Modal de edição não encontrado', 'error');
    return;
  }

  document.getElementById('edit-bloco-nome').textContent = bloco.nome;
  document.getElementById('edit-bloco-objetivo').value = bloco.objetivo;
  document.getElementById('edit-bloco-copy').value = bloco.copy;
  document.getElementById('edit-bloco-integracao').value = bloco.integracao;
  document.getElementById('edit-bloco-visual').value = bloco.visual;

  // Salvar em estado temporário
  appState.blocoemEdicao = blocoId;

  modal.classList.add('visible');
}

function salvarEdicaoBlocoEstrutura() {
  const blocoId = appState.blocoemEdicao;
  const bloco = appState.estruturaCopyBlocos.find(b => b.id === blocoId);

  if (!bloco) return;

  bloco.objetivo = document.getElementById('edit-bloco-objetivo').value;
  bloco.copy = document.getElementById('edit-bloco-copy').value;
  bloco.integracao = document.getElementById('edit-bloco-integracao').value;
  bloco.visual = document.getElementById('edit-bloco-visual').value;

  document.getElementById('modal-editar-bloco').classList.remove('visible');
  renderizarEstruturaCopy(appState.estruturaCopy);
  showToast('✅ Bloco atualizado!', 'success');
}

/**
 * Copiar bloco para clipboard
 */
function copiarBlocoEstrutura(blocoId) {
  const bloco = appState.estruturaCopyBlocos.find(b => b.id === blocoId);
  if (!bloco) return;

  const conteudo = `### BLOCO: ${bloco.nome}

**Objetivo Persuasivo:**
${bloco.objetivo}

**Copy Completa:**
${bloco.copy}

${bloco.integracao ? `
**Nota de Integração:**
${bloco.integracao}
` : ''}

${bloco.visual ? `
**Nota Visual:**
${bloco.visual}
` : ''}`;

  navigator.clipboard.writeText(conteudo).then(() => {
    showToast('✅ Bloco copiado para clipboard!', 'success');
  });
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

export {
  gerarEstruturaCopy,
  baixarEstruturaCopy,
  iniciarUploadEstruturaCopy,
  editarBlocoEstrutura,
  salvarEdicaoBlocoEstrutura
};
```

---

## 4. ESTRUTURA HTML NA PÁGINA

### 4.1 Adicionar em `index.html` (Seção Estrutura)

```html
<!-- ============================================================ -->
<!-- TELA: Estrutura e Copy -->
<!-- ============================================================ -->

<div id="tela-estrutura-copy" class="tela oculta">
  <header class="tela-header">
    <h2>Estrutura e Copy da Landing Page</h2>
    <p>Defina a estrutura e a copy completa de cada bloco</p>
  </header>

  <div class="tela-content">
    <!-- Botões de ação -->
    <div class="acao-buttons">
      <button 
        id="btn-gerar-estrutura-copy"
        class="btn btn-primary btn-lg"
        onclick="window.LandingAI.estruturaCopy.gerarEstruturaCopy()">
        🚀 Gerar Estrutura e Copy
      </button>

      <button 
        class="btn btn-secondary"
        onclick="window.LandingAI.estruturaCopy.baixarEstruturaCopy()">
        ⬇️ Download para IA Externa
      </button>

      <button 
        class="btn btn-secondary"
        onclick="window.LandingAI.estruturaCopy.iniciarUploadEstruturaCopy()">
        ⬆️ Upload de Estrutura Gerada
      </button>
    </div>

    <!-- Cards de blocos -->
    <div id="estrutura-blocos-container" class="blocos-container">
      <div class="placeholder">
        <p>Clique em "Gerar Estrutura e Copy" para começar</p>
      </div>
    </div>
  </div>

  <!-- Navegação -->
  <div class="tela-nav">
    <button class="btn btn-outline" onclick="window.LandingAI.voltar()">
      ← Voltar
    </button>
    <button 
      class="btn btn-primary"
      onclick="window.LandingAI.avancar()">
      Próximo: Direção de Arte →
    </button>
  </div>
</div>

<!-- Modal: Editar Bloco -->
<div id="modal-editar-bloco" class="modal oculto">
  <div class="modal-content">
    <header class="modal-header">
      <h3 id="edit-bloco-nome">Editar Bloco</h3>
      <button class="btn-close" onclick="document.getElementById('modal-editar-bloco').classList.remove('visible')">×</button>
    </header>

    <div class="modal-body">
      <div class="form-group">
        <label>Objetivo Persuasivo</label>
        <textarea 
          id="edit-bloco-objetivo" 
          placeholder="O que este bloco faz psicologicamente?"
          rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>Copy Completa</label>
        <textarea 
          id="edit-bloco-copy" 
          placeholder="Toda a copy desta seção"
          rows="6"></textarea>
      </div>

      <div class="form-group">
        <label>Nota de Integração (opcional)</label>
        <textarea 
          id="edit-bloco-integracao" 
          placeholder="Ex: Google Reviews API, Feed Instagram"
          rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>Nota Visual (opcional)</label>
        <textarea 
          id="edit-bloco-visual" 
          placeholder="Para o designer"
          rows="3"></textarea>
      </div>
    </div>

    <div class="modal-footer">
      <button 
        class="btn btn-primary"
        onclick="window.LandingAI.estruturaCopy.salvarEdicaoBlocoEstrutura()">
        ✅ Salvar
      </button>
      <button 
        class="btn btn-outline"
        onclick="document.getElementById('modal-editar-bloco').classList.remove('visible')">
        Cancelar
      </button>
    </div>
  </div>
</div>
```

---

## 5. ESTILOS CSS

### 5.1 Adicionar em `assets/css/03-screens.css`

```css
/* ============================================================ */
/* TELA: Estrutura e Copy */
/* ============================================================ */

#tela-estrutura-copy .acao-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

#tela-estrutura-copy .acao-buttons .btn {
  flex: 1;
  min-width: 180px;
}

@media (max-width: 768px) {
  #tela-estrutura-copy .acao-buttons {
    flex-direction: column;
  }
  
  #tela-estrutura-copy .acao-buttons .btn {
    width: 100%;
  }
}

/* ============================================================ */
/* CARDS DE BLOCOS */
/* ============================================================ */

.blocos-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.estrutura-bloco-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--r-md);
  overflow: hidden;
  transition: all var(--t-normal);
}

.estrutura-bloco-card:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-default);
  border-bottom: 1px solid var(--border-default);
}

.card-order {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.section-content {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.section-content.code {
  background: var(--bg-default);
  padding: 1rem;
  border-radius: var(--r-sm);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem 0;
  border-top: 1px solid var(--border-default);
  padding-top: 1rem;
}

.card-actions .btn {
  flex: 1;
  font-size: 12px;
  padding: 0.5rem 1rem;
}

/* ============================================================ */
/* MODAL: Editar Bloco */
/* ============================================================ */

#modal-editar-bloco {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all var(--t-normal);
}

#modal-editar-bloco.visible {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  max-width: 600px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-default);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-default);
  border-radius: var(--r-sm);
  font-family: 'Courier New', monospace;
  font-size: 13px;
  resize: vertical;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-default);
}

.modal-footer .btn {
  flex: 1;
}

.blocos-container .placeholder {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}
```

---

## 6. INTEGRAÇÃO NO FLUXO PRINCIPAL

### 6.1 Modificar `assets/js/04-handlers.js`

```javascript
// Adicionar import no início
import * as estruturaCopyModule from './screens/estrutura-copy.js';

// Adicionar ao objeto global
window.LandingAI.estruturaCopy = estruturaCopyModule;
```

### 6.2 Adicionar botão para navegação

No `assets/js/03-ui.js`, adicionar no menu de navegação:

```javascript
// Na função que renderiza abas de navegação:
const abas = [
  { id: 'intake', label: 'Briefing', icon: '📋' },
  { id: 'steps', label: 'Análise', icon: '🔍' },
  { id: 'estrutura-copy', label: 'Estrutura e Copy', icon: '📝' },
  { id: 'arte', label: 'Direção de Arte', icon: '🎨' },
  { id: 'revisao', label: 'Revisão', icon: '✅' }
];
```

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar arquivo `assets/js/screens/estrutura-copy.js` com todo o código acima
- [ ] Adicionar HTML modal e container em `index.html`
- [ ] Adicionar estilos CSS em `03-screens.css`
- [ ] Adicionar import em `04-handlers.js`
- [ ] Adicionar aba no menu de navegação em `03-ui.js`
- [ ] Testar geração de estrutura
- [ ] Testar download de arquivo
- [ ] Testar upload e parsing
- [ ] Testar edição de blocos
- [ ] Testar renderização completa dos cards

---

## 8. TESTES

### Teste 1: Geração Básica
- Preencher todos os steps
- Clicar "Gerar Estrutura e Copy"
- Verificar que aparecem 7 blocos
- Verificar que cada bloco tem as 5 seções

### Teste 2: Download
- Clicar "Download para IA Externa"
- Verificar que arquivo foi baixado
- Verificar formato e conteúdo

### Teste 3: Upload
- Baixar um arquivo gerado
- Clicar "Upload de Estrutura Gerada"
- Selecionar o arquivo
- Verificar que blocos aparecem

### Teste 4: Edição
- Gerar estrutura
- Clicar "Editar" em um bloco
- Modificar conteúdo
- Clicar "Salvar"
- Verificar que mudança apareceu

