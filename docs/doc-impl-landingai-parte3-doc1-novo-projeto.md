# 📋 Ficha de Implementação — LandingAI
## PARTE 3: Simplificação do DOC-1 e Novo Fluxo de Novo Projeto

**Status:** Pronto para Implementação  
**Versão:** 1.0  
**Data:** 09/05/2026

---

## 📌 CONTEXTO

Dois problemas de fluxo e documentação:

1. **DOC-1 muito longo:** Contém instruções redundantes (Claude, Gemini, Grok, Cursor) que ocupam espaço
2. **Novo Projeto:** Não há modal para nomear o projeto antes de iniciar

---

## 1. SIMPLIFICAR DOC-1

### Objetivo
Remover instruções duplicadas e deixar apenas:
- Uma instrução clara para IA
- Briefing estruturado
- Formato de entrega esperado

### Antes (Atual)

O DOC-1 tem ~450+ linhas incluindo:
- Instruções para Claude.ai (manual)
- Instruções para Gemini
- Instruções para Grok
- Instruções para Cursor
- "Como usar para usuários técnicos"
- "Para desenvolvedores"
- Troubleshooting

### Depois (Novo)

DOC-1 com ~200-250 linhas apenas com:
- Uma única instrução clara para IA
- Briefing estruturado
- Indicação de como usar

### Implementação

#### 1.1 Nova função `gerarDoc1Simplificado()` em `assets/js/screens/review.js`

```javascript
/**
 * Gera DOC-1 simplificado
 * Remove instruções redundantes
 */
function gerarDoc1Simplificado() {
  const { briefing, estruturaCopy, artDirection } = appState;

  const conteudo = `# DOC-1 — ${briefing.nome_cliente}

Gerado pelo **LandingAI** · Adsgator · ${new Date().toLocaleDateString('pt-BR')}

---

## 🎯 INSTRUÇÃO PARA IA IMPLEMENTADORA

Você é um **Desenvolvedor Astro** especializado em landing pages de alta conversão.

Sua tarefa: Gerar a **Ficha de Implementação (DOC-3)** completo e pronto para produção.

### O QUE FAZER

1. Leia TODO o briefing abaixo
2. Gere 4 arquivos de implementação (conforme template abaixo)
3. Cada arquivo deve ter entre 30-50KB
4. Nenhum placeholder — use dados REAIS do briefing
5. Código COMPLETO e funcional (sem "// resto aqui")

### STACK OBRIGATÓRIA

\`\`\`
Framework:    Astro 4.x (output: hybrid)
CSS:          Tailwind CSS 3.x
Animações:    GSAP 3.x + ScrollTrigger
Smooth scroll: Lenis (@studio-freight/lenis)
UI:           Framer Motion (React components)
Ícones:       Lucide React
Deploy:       Vercel
\`\`\`

### REGRAS ABSOLUTAS

✅ FAZER:
- H1 espelha a dor de busca
- Copy em 1ª pessoa: "Eu atendo...", nunca "O profissional..."
- CTAs específicos: "Agendar Avaliação Gratuita"
- Comunicação direta e realista
- Sem promessas milagrosas

❌ NÃO FAZER:
- Qualquer palavra proibida (inovador, excelência, missão, visão)
- Copy genérica ou institucional
- Depoimentos inventados
- Blocos sem dados do briefing
- Código incompleto

### FORMATO DE ENTREGA

Gere 4 arquivos Markdown, cada um com um bloco de código que começa com:

\`\`\`
---PARTE-1---
[Fundação: .clinerules, .gitignore, package.json, astro.config.mjs, tailwind.config.js, .env.example]

---PARTE-2---
[Layout: Layout.astro, componentes globais Header, Footer, Button, etc]

---PARTE-3---
[Seções: Hero, About, Services, etc — conforme estrutura aprovada]

---PARTE-4---
[Integrações: GTM, Forms, Analytics, Deploy, sitemap]
\`\`\`

**Importante:** Cada parte deve ser **completa e independente**, sem dependência de código em outra parte.

---

## 📋 BRIEFING ESTRUTURADO

### Identidade

| Campo | Valor |
|-------|-------|
| Nome do Profissional | ${briefing.nome_cliente} |
| Nicho | ${briefing.nicho} |
| Cidade | ${briefing.cidade} |
| Serviço Principal | ${briefing.servico_principal} |
| Proposta de Valor | ${briefing.proposta_valor} |

### Contato e Conversão

| Campo | Valor |
|-------|-------|
| WhatsApp | ${briefing.whatsapp} |
| Email | ${briefing.email || '—'} |
| Objetivo de Conversão | ${briefing.objetivo_conversao} |

### Público-Alvo

| Campo | Valor |
|-------|-------|
| Avatar Principal | ${briefing.avatar_principal || '—'} |
| Faixa Etária | ${briefing.faixa_etaria || '—'} |
| Dor Principal | ${briefing.dor_principal || '—'} |

### Presença Digital

| Ativo | Status | Detalhe |
|-------|--------|---------|
| Google Business | ${briefing.google_business ? 'Sim' : 'Não'} | ${briefing.google_business_nota || '—'} |
| Instagram | ${briefing.instagram ? 'Sim' : 'Não'} | ${briefing.instagram_handle || '—'} |
| Endereço Físico | ${briefing.endereco_autorizado ? 'Sim' : 'Não'} | ${briefing.endereco_completo || '—'} |

---

## 📝 ESTRUTURA E COPY

${estruturaCopy || '(Estrutura não foi gerada)'}

---

## 🎨 DIREÇÃO DE ARTE

${artDirection ? \`
**Cores Principais:**
- Principal: \${artDirection.corPrincipal || '—'}
- Secundária: \${artDirection.corSecundaria || '—'}

**Tom Visual:**
\${artDirection.tomoVisual || '—'}

**Referências:**
\${artDirection.referenciasVisuais?.length || 0} referências adicionadas
\` : 'Não foi preenchida'}

---

## ✅ PRÓXIMOS PASSOS

1. Cole TODO este arquivo em claude.ai
2. Aguarde a resposta com as 4 partes
3. Salve cada parte em arquivo separado:
   - doc-impl-parte1-${briefing.slug || 'projeto'}.md
   - doc-impl-parte2-${briefing.slug || 'projeto'}.md
   - doc-impl-parte3-${briefing.slug || 'projeto'}.md
   - doc-impl-parte4-${briefing.slug || 'projeto'}.md
4. Use com Roo Code: \`roo --add-rules doc-impl-parte1.md\`

---

*Documento gerado pelo LandingAI v2 — Adsgator*
`;

  return conteudo;
}

/**
 * Baixa DOC-1 simplificado
 */
function baixarDoc1Simplificado() {
  const { briefing } = appState;

  const conteudo = gerarDoc1Simplificado();

  const blob = new Blob([conteudo], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `doc1-${briefing.slug || 'projeto'}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showToast('✅ DOC-1 baixado!', 'success');
}

export {
  gerarDoc1Simplificado,
  baixarDoc1Simplificado
};
```

#### 1.2 Modificar botão de download em `index.html`

```html
<!-- Procurar pela seção de Revisão e alterar: -->

<button 
  class="btn btn-primary btn-lg"
  onclick="window.LandingAI.review.baixarDoc1Simplificado()">
  📥 Baixar DOC-1 (para IA Externa)
</button>
```

---

## 2. NOVO FLUXO: Modal para Nomear Projeto

### Objetivo
Quando user clica "Criar Novo Projeto", mostrar modal pedindo o nome antes de ir para INTAKE.

### Implementação

#### 2.1 Novo Modal em `index.html`

```html
<!-- Modal: Nomear Novo Projeto -->
<div id="modal-novo-projeto" class="modal oculto">
  <div class="modal-overlay" onclick="fecharModalNovoProjeto()"></div>
  
  <div class="modal-content">
    <header class="modal-header">
      <h3>Novo Projeto</h3>
      <button 
        class="btn-close"
        onclick="fecharModalNovoProjeto()">
        ×
      </button>
    </header>

    <div class="modal-body">
      <div class="form-group">
        <label>Nome do Cliente / Projeto</label>
        <input 
          type="text"
          id="input-nome-projeto"
          class="input-field"
          placeholder="Ex: Ana Ester Nutricionista"
          onkeypress="if(event.key==='Enter') iniciarNovoProjeto()">
        
        <p class="input-hint">
          Este nome será usado em todos os documentos e arquivos gerados.
        </p>
      </div>

      <div class="form-group">
        <label>Descrição Breve (opcional)</label>
        <textarea 
          id="input-desc-projeto"
          class="input-field"
          placeholder="Ex: Nutricionista especializada em nutrição feminina"
          rows="3"></textarea>
      </div>
    </div>

    <div class="modal-footer">
      <button 
        class="btn btn-primary"
        onclick="iniciarNovoProjeto()">
        ✅ Começar Projeto
      </button>
      <button 
        class="btn btn-outline"
        onclick="fecharModalNovoProjeto()">
        ← Cancelar
      </button>
    </div>
  </div>
</div>
```

#### 2.2 Funções em `assets/js/04-handlers.js`

```javascript
/**
 * Abre modal para novo projeto
 */
function abrirModalNovoProjeto() {
  const modal = document.getElementById('modal-novo-projeto');
  const input = document.getElementById('input-nome-projeto');

  if (modal) {
    modal.classList.add('visible');
    // Focar no input
    setTimeout(() => input?.focus(), 100);
  }
}

/**
 * Fecha modal de novo projeto
 */
function fecharModalNovoProjeto() {
  const modal = document.getElementById('modal-novo-projeto');
  if (modal) {
    modal.classList.remove('visible');
  }
}

/**
 * Inicia novo projeto após confirmar nome
 */
function iniciarNovoProjeto() {
  const nomeProjeto = document.getElementById('input-nome-projeto')?.value || '';
  const descProjeto = document.getElementById('input-desc-projeto')?.value || '';

  if (!nomeProjeto.trim()) {
    showToast('⚠️ Digite um nome para o projeto', 'warning');
    return;
  }

  // Gerar slug do nome
  const slug = nomeProjeto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Limpar state anterior
  Object.keys(appState).forEach(key => {
    if (key !== 'config' && key !== 'projetos') {
      appState[key] = null;
    }
  });

  // Inicializar novo projeto
  appState.projetoAtual = {
    id: Date.now().toString(),
    nome: nomeProjeto,
    descricao: descProjeto,
    slug: slug,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    status: 'em-andamento'
  };

  // Salvar em localStorage
  const projetos = JSON.parse(localStorage.getItem('landingai_projetos') || '[]');
  projetos.push(appState.projetoAtual);
  localStorage.setItem('landingai_projetos', JSON.stringify(projetos));

  // Fechar modal
  fecharModalNovoProjeto();

  // Limpar inputs
  document.getElementById('input-nome-projeto').value = '';
  document.getElementById('input-desc-projeto').value = '';

  // Ir para INTAKE
  window.LandingAI.irParaTela('intake');

  showToast(`✅ Projeto "${nomeProjeto}" criado!`, 'success');
}

export {
  abrirModalNovoProjeto,
  fecharModalNovoProjeto,
  iniciarNovoProjeto
};
```

#### 2.3 Modificar botão "Novo Projeto" em `index.html`

```html
<!-- Procurar pelo botão de novo projeto (Home/Welcome screen) e alterar: -->

<button 
  class="btn btn-primary btn-lg"
  onclick="window.LandingAI.handlers.abrirModalNovoProjeto()">
  ✨ Criar Novo Projeto
</button>
```

#### 2.4 CSS do Modal em `assets/css/06-error-modal.css`

```css
/* Modal novo projeto usa mesmos estilos do resto */
/* Mas adicionar responsivo se necessário: */

@media (max-width: 480px) {
  #modal-novo-projeto .input-hint {
    font-size: 12px;
  }
}
```

---

## 3. SIMPLIFICAR HTML DO DOC-1

### Modificar `renderizarDocumento1()` em `assets/js/screens/review.js`

Ao renderizar o DOC-1, mostrar apenas as seções essenciais:

```javascript
/**
 * Renderiza preview do DOC-1 (versão simplificada)
 */
function renderizarPreviewDoc1() {
  const { briefing, estruturaCopy, artDirection } = appState;

  const html = `
    <div class="doc1-preview">
      <!-- Header -->
      <header class="doc1-header">
        <h2>${briefing.nome_cliente}</h2>
        <p>${briefing.nicho} • ${briefing.cidade}</p>
      </header>

      <!-- Seções principais -->
      <section class="doc1-section">
        <h3>Identidade</h3>
        <table class="doc1-table">
          <tr>
            <td>Nome:</td>
            <td>${briefing.nome_cliente}</td>
          </tr>
          <tr>
            <td>Nicho:</td>
            <td>${briefing.nicho}</td>
          </tr>
          <tr>
            <td>Proposta:</td>
            <td>${briefing.proposta_valor}</td>
          </tr>
        </table>
      </section>

      <!-- Estrutura e Copy -->
      <section class="doc1-section">
        <h3>Estrutura e Copy</h3>
        <div class="doc1-content">
          ${estruturaCopy ? estruturaCopy.substring(0, 500) + '...' : 'Não gerada'}
        </div>
      </section>

      <!-- Direção -->
      <section class="doc1-section">
        <h3>Direção de Arte</h3>
        <div class="doc1-content">
          ${artDirection?.corPrincipal ? \`Cor: \${artDirection.corPrincipal}\` : 'Não definida'}
        </div>
      </section>

      <!-- Botões -->
      <div class="doc1-actions">
        <button class="btn btn-primary" onclick="window.LandingAI.review.baixarDoc1Simplificado()">
          📥 Baixar DOC-1
        </button>
        <button class="btn btn-secondary" onclick="window.LandingAI.review.copiarDoc1Completo()">
          📋 Copiar para Cola
        </button>
      </div>
    </div>
  `;

  document.getElementById('preview-doc1').innerHTML = html;
}
```

---

## 4. ADICIONAR CSS

### Em `assets/css/03-screens.css`

```css
/* ============================================================ */
/* Modal Novo Projeto */
/* ============================================================ */

#modal-novo-projeto {
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

#modal-novo-projeto.visible {
  opacity: 1;
  visibility: visible;
}

#modal-novo-projeto .modal-content {
  background: var(--bg-surface);
  border-radius: var(--r-lg);
  max-width: 400px;
  width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

#modal-novo-projeto .form-group {
  margin-bottom: 1.5rem;
}

.input-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

/* ============================================================ */
/* DOC-1 Preview */
/* ============================================================ */

.doc1-preview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.doc1-header {
  padding: 1.5rem;
  background: var(--bg-default);
  border-radius: var(--r-md);
  border-left: 4px solid var(--accent);
}

.doc1-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 24px;
}

.doc1-header p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.doc1-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.doc1-section h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.doc1-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.doc1-table td {
  padding: 0.5rem;
  border: 1px solid var(--border-default);
}

.doc1-table td:first-child {
  font-weight: 600;
  width: 120px;
  background: var(--bg-default);
}

.doc1-content {
  padding: 1rem;
  background: var(--bg-default);
  border-radius: var(--r-sm);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-height: 200px;
  overflow-y: auto;
}

.doc1-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.doc1-actions .btn {
  flex: 1;
  min-width: 150px;
}

@media (max-width: 768px) {
  .doc1-actions {
    flex-direction: column;
  }

  .doc1-actions .btn {
    width: 100%;
  }
}
```

---

## 5. ATUALIZAR FLUXO DE NAVEGAÇÃO

### Em `assets/js/03-ui.js`

Modificar função que renderiza botão de "Novo Projeto":

```javascript
/**
 * Renderiza tela inicial
 */
function renderizarTelaInicial() {
  const telaInicial = document.getElementById('tela-inicial');

  if (!telaInicial) return;

  const projetos = JSON.parse(localStorage.getItem('landingai_projetos') || '[]');

  telaInicial.innerHTML = `
    <div class="inicial-container">
      <header class="inicial-header">
        <h1>LandingAI</h1>
        <p>Gerador de Landing Pages com IA</p>
      </header>

      <!-- Botão Novo Projeto -->
      <div class="inicial-actions">
        <button 
          class="btn btn-primary btn-lg"
          onclick="window.LandingAI.handlers.abrirModalNovoProjeto()">
          ✨ Criar Novo Projeto
        </button>
      </div>

      <!-- Projetos Recentes -->
      ${projetos.length > 0 ? `
        <section class="projetos-recentes">
          <h2>Projetos Recentes</h2>
          <div class="projetos-grid">
            ${projetos.map(proj => \`
              <div class="projeto-card" onclick="window.LandingAI.abrirProjeto('\${proj.id}')">
                <h3>\${proj.nome}</h3>
                <p>\${proj.descricao || proj.slug}</p>
                <time>\${new Date(proj.dataAtualizacao).toLocaleDateString('pt-BR')}</time>
              </div>
            \`).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;
}
```

---

## 6. CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar função `gerarDoc1Simplificado()` em review.js
- [ ] Criar função `baixarDoc1Simplificado()` em review.js
- [ ] Adicionar modal novo projeto em index.html
- [ ] Criar funções em handlers.js (abrirModal, iniciarProjeto)
- [ ] Adicionar CSS para modal e preview
- [ ] Atualizar botão "Novo Projeto" para abrir modal
- [ ] Testar fluxo de novo projeto
- [ ] Testar download do DOC-1 simplificado
- [ ] Verificar que inputs estão focados corretamente
- [ ] Testar Enter key para criar projeto

---

## 7. TESTES

### Teste 1: Novo Projeto
- Clicar "Criar Novo Projeto"
- Verificar que modal abre
- Digitar nome do projeto
- Clicar "Começar Projeto"
- Verificar que vai para INTAKE

### Teste 2: DOC-1 Simplificado
- Completar todos os steps
- Ir para Revisão
- Clicar "Baixar DOC-1"
- Verificar tamanho do arquivo (deve ser ~150-200 linhas)
- Verificar que não tem instruções de Claude/Gemini/Grok
- Verificar que tem briefing completo

### Teste 3: Armazenamento de Projetos
- Criar 2 projetos
- Voltar para Home
- Verificar que aparecem em "Projetos Recentes"
- Clicar em um projeto anterior
- Verificar que carrega dados salvos

