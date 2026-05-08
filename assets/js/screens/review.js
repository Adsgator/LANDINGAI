/* ============================================================
   LandingAI v2 — Screen: Review and Generation
   ============================================================ */

Object.assign(window.App, {
  // Método auxiliar para renderizar checklist
  buildReadinessChecklist() {
    const B = this.B || {};
    const validation = this.validateStructure();

    const checks = [
      { label: 'Nome do cliente', done: !!B.nome_cliente?.trim(), step: 1 },
      { label: 'Segmento de mercado', done: !!B.segmento?.trim(), step: 1 },
      { label: 'WhatsApp', done: !!B.whatsapp?.trim(), step: 2 },
      { label: 'Objetivo de conversão', done: !!B.objetivo_conversao?.trim(), step: 2 },
      { label: 'Modalidade de atendimento', done: !!B.modalidade?.trim(), step: 4 },
      { label: 'Serviço principal', done: !!B.servico_principal?.trim(), step: 5 },
      { label: 'Público-alvo definido', done: !!B.publico_primario?.trim(), step: 6 },
      { label: 'Estrutura da LP gerada', done: !!B.estrutura_rascunho?.trim(), step: 'Estrutura' },
      { label: 'Estrutura aprovada', done: !!B.estrutura_aprovada?.trim(), step: 'Estrutura' },
      { label: 'Direção de arte aprovada', done: !!B.arte_ficha_aprovada?.trim(), step: 'Direção de Arte' },
      { label: 'API Key configurada', done: Object.values(this.state.apiKeys).some(k => k?.trim()), step: 'Config. API' }
    ];

    const completedCount = checks.filter(c => c.done).length;
    const totalCount = checks.length;
    const percentComplete = Math.round((completedCount / totalCount) * 100);

    return `
      <div class="readiness-card">
        <div class="readiness-header">
          <h3 class="readiness-title">Prontidão para Gerar DOC-IMPL</h3>
          <div class="readiness-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percentComplete}%"></div>
            </div>
            <span class="progress-text">${percentComplete}% pronto</span>
          </div>
        </div>

        <div class="readiness-checks">
          ${checks.map(check => `
            <div class="check-item ${check.done ? 'check-done' : 'check-pending'}" 
                 onclick="${typeof check.step === 'number' ? `App.goToStep(${check.step})` : (check.step === 'Estrutura' ? "App.goToScreen('structure')" : (check.step === 'Direção de Arte' ? "App.goToScreen('art')" : "App.renderApiModal()"))}"
                 style="cursor:pointer">
              <div class="check-icon">
                <i data-lucide="${check.done ? 'check-circle' : 'circle'}" style="width:16px;height:16px;"></i>
              </div>
              <div class="check-content">
                <span class="check-label">${check.label}</span>
                <span class="check-step">${typeof check.step === 'number' ? `Step ${check.step}` : check.step}</span>
              </div>
            </div>
          `).join('')}
        </div>

        ${validation.errors.length > 0 ? `
          <div class="readiness-errors">
            <div class="error-header">
              <i data-lucide="alert-triangle" style="width:16px;height:16px;"></i>
              <span>Impedimentos:</span>
            </div>
            <ul class="error-list">
              ${validation.errors.map(err => `<li>${err}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${validation.warnings.length > 0 ? `
          <div class="readiness-warnings">
            <div class="warning-header">
              <i data-lucide="info" style="width:16px;height:16px;"></i>
              <span>Sugestões:</span>
            </div>
            <ul class="warning-list">
              ${validation.warnings.map(warn => `<li>${warn}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  },

  buildReviewScreen() {
    const B = this.B;
    const isReady = this.checkReady();
    let fichaArte = null;
    if (B.ficha_direcao_arte) {
      try {
        fichaArte = typeof B.ficha_direcao_arte === 'object'
          ? B.ficha_direcao_arte
          : JSON.parse(B.ficha_direcao_arte);
      } catch (e) {
        console.warn('ficha_direcao_arte não é JSON válido:', e.message);
        fichaArte = null;
      }
    }

    const score = this.calcGlobalScore();
    const checklist = this.buildReadinessChecklist();

    // Banner de validação de estrutura
    const estruturaAprovada = this.B?.estrutura_aprovada?.trim();
    const estruturaRascunho = this.B?.estrutura_rascunho?.trim();

    let alertaHTML = '';
    if (!estruturaAprovada || !estruturaRascunho) {
      alertaHTML = `
        <div class="review-alert review-alert--warning">
          <div class="alert-header">
            <i data-lucide="alert-circle" style="width:20px;height:20px;color:var(--warning);"></i>
            <span class="alert-title">Estrutura Pendente</span>
          </div>
          <p class="alert-message">
            Você precisa ${!estruturaRascunho ? 'gerar' : 'aprovar'} a Estrutura da Landing Page antes de gerar o DOC-IMPL.
          </p>
          <div class="alert-actions">
            <button class="btn-primary btn-sm" onclick="App.goToScreen('structure')">
              <i data-lucide="layout" style="width:14px;height:14px;"></i> Ir para Estrutura
            </button>
          </div>
        </div>
      `;
    }

    return `
    ${alertaHTML}
    <div class="review-screen">
      <div class="review-header">
        <h2 class="review-title">Revisão e Geração Final</h2>
        <p class="review-subtitle">Confira os dados coletados e gere a documentação técnica para implementação.</p>
      </div>

      <!-- Barra de Progresso (Termômetro) -->
      <div class="review-score-banner">
        <div class="review-score-circle">${score}%</div>
        <div class="review-score-info">
          <div class="review-score-label">Completude do Briefing</div>
          <div class="review-score-bar-wrap">
            <div class="review-score-bar-fill" style="width:${score}%"></div>
          </div>
          <div class="review-score-sub">${score < 100 ? 'Preencha os campos obrigatórios para atingir 100%.' : 'Briefing completo e pronto para geração!'}</div>
        </div>
      </div>

      ${checklist}

      <!-- Progresso dos Steps (Agora no topo) -->
      <div class="review-steps-preview">
        <div class="review-steps-grid">
          ${STEPS.map(s => {
      const missingCount = (REQUIRED_FIELDS[s.id] || []).filter(f => !B[f]).length;
      const isDone = missingCount === 0;
      return `
              <div class="review-step-card ${isDone ? 'done' : 'incomplete'}" onclick="App.goToStep(${s.id})">
                <div class="step-card-header">
                  <span class="step-card-num">${s.id}</span>
                  <i data-lucide="${isDone ? 'check-circle' : 'circle'}" class="step-card-status"></i>
                </div>
                <div class="step-card-body">
                  <span class="step-card-label">${s.title}</span>
                  <span class="step-card-sub">${isDone ? 'Completo' : `${missingCount} pendente(s)`}</span>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>

      <div class="review-grid">
        <!-- Coluna Esquerda: Status, Sumário e Ações -->
        <div class="review-main">
          ${isReady.ok ? `
            <div class="review-card-status ready">
              <i data-lucide="check-circle" class="status-icon"></i>
              <div class="status-content">
                <h3>Briefing Completo</h3>
                <p>Todos os campos obrigatórios foram preenchidos. Você pode gerar a Ficha de Implementação agora.</p>
              </div>
            </div>
          ` : `
            <div class="review-card-status warning">
              <i data-lucide="alert-circle" class="status-icon"></i>
              <div class="status-content">
                <h3>Briefing Incompleto</h3>
                <p>Alguns campos obrigatórios estão vazios. A IA pode ter alucinações se faltar contexto.</p>
                <div class="review-missing-list">
                  ${isReady.missing.map(m => `
                    <div class="review-missing-item" onclick="App.goToStep(${m.step})" style="cursor:pointer;">
                      <i data-lucide="arrow-right-circle" style="width:14px;height:14px"></i>
                      <span>${m.label}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `}

          <!-- Sumário do Projeto (Movido para cima do botão) -->
          <div class="review-summary-box">
            <div class="summary-header">Sumário do Projeto</div>
            <div class="summary-grid-compact">
              <div class="summary-item">
                <span class="label">Cliente</span>
                <span class="value">${B.nome_cliente || '—'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Segmento</span>
                <span class="value">${B.segmento || '—'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Modelo IA</span>
                <span class="value">${App.config.models[this.state.selectedModel]?.name || '—'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Direção de Arte</span>
                <span class="value">${fichaArte ? `<span class="val-approved">Aprovada (${fichaArte.tema})</span>` : '<span class="val-pending">Pendente</span>'}</span>
              </div>
            </div>
          </div>

                    <!-- ═══ SEÇÃO: Pré-visualização da Estrutura ═══ -->
          <div class="review-estrutura-section">
            <div class="review-section-label">
              <i data-lucide="layout" style="width:14px;height:14px;color:var(--accent2)"></i>
              <span>Estrutura da Landing Page</span>
            </div>

            ${B.estrutura_rascunho ? `
            <div class="review-estrutura-summary-card">
               <div class="estrutura-summary-info">
                  <i data-lucide="layout-template" style="width:24px;height:24px;color:var(--accent2);opacity:0.8"></i>
                  <div>
                    <strong>${this.contarBlocos(B.estrutura_rascunho)} blocos gerados</strong>
                    <p style="font-size:12px;color:var(--text-tertiary)">Narrativa em 1ª pessoa configurada</p>
                  </div>
                  <button class="btn-ghost btn-sm" onclick="App.goToScreen('structure')" style="margin-left:auto;">
                    <i data-lucide="edit-3" style="width:12px;height:12px"></i>
                    Ver Blocos
                  </button>
               </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:10px;align-items:center;">
              <span class="status-badge ${B.estrutura_aprovada ? 'on' : ''}" style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;">
                ${B.estrutura_aprovada ? '✅ Estrutura Aprovada' : '⚠️ Pendente de Aprovação'}
              </span>
            </div>
            ` : `
            <div class="review-pending-alert">
              <i data-lucide="alert-triangle" style="width:15px;height:15px;color:var(--warning)"></i>
              <span>Estrutura ainda não definida.</span>
              <button class="btn-ghost btn-sm" onclick="App.goToScreen('structure')">
                Gerar Estrutura →
              </button>
            </div>
            `}
          </div>

          <div class="review-actions-hero">
            <button id="btn-generate-docimpl" class="btn-primary btn-xl" ${this.state.isGenerating || !estruturaAprovada ? 'disabled' : ''}>
              <i data-lucide="sparkles"></i>
              ${this.state.isGenerating ? 'Gerando Ficha de Implementação...' : 'Gerar Ficha de Implementação (DOC-IMPL)'}
            </button>
            <p class="review-action-hint">A IA vai ler o briefing completo e criar todo o código base, design system e copy.</p>
          </div>

          <div class="doc-info-card">
            <div class="info-header">
              <i data-lucide="info" style="width:18px;height:18px;color:var(--accent2);"></i>
              <span>O que é DOC-1?</span>
            </div>
            <p class="info-text">
              DOC-1 é um arquivo Markdown com todo o briefing estruturado. Você pode copiar este documento 
              e passar para Claude, Gemini, Grok ou qualquer IA para gerar a implementação em 4 partes.
            </p>
            <p class="info-text info-subtext">
              Não precisa de API Key. Funciona 100% externamente.
            </p>
          </div>

          <div class="review-doc1-box">
             <div class="doc1-header">
                <i data-lucide="file-text"></i>
                <span>Documento de Briefing (DOC-1)</span>
             </div>
             <div class="doc1-body">
                <p>O DOC-1 é a versão textual organizada de tudo que foi coletado. Útil para documentação e aprovação do cliente.</p>
                <button id="btn-download-doc1" class="btn-primary btn-sm" title="Baixe este documento e copie para Claude, Gemini ou sua IA preferida">
                  <i data-lucide="download"></i>
                  Baixar DOC-1 (Para IA Externa)
                </button>
             </div>
          </div>

          <!-- Dicas da Adsgator (Movido para o final da lista principal) -->
          <div class="review-tips-box">
            <div class="summary-header">Dicas da Adsgator</div>
            <ul class="tips-list">
              <li>Use <b>Gemini 2.5 Pro</b> ou <b>Claude</b> para projetos mais complexos.</li>
              <li>Aprovar a <b>Direção de Arte</b> ajuda a IA a ser mais precisa no design.</li>
              <li>Revise o <b>DOC-1</b> antes de enviar o link de preview para o cliente.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    `;
  },

  /* ----------------------------------------------------------
     Seção de Protótipo Visual — REMOVIDA
     (gerarPrototipoVisual e showModalPrototipoFallback
      foram descontinuados nesta versão)
  ---------------------------------------------------------- */

  // Mantido apenas para compatibilidade — não faz nada
  gerarPrototipoVisual() {
    this.showToast('Geração de protótipo visual não disponível nesta versão.', 'info');
  },

  checkReady() {
    const missing = [];
    Object.entries(REQUIRED_FIELDS).forEach(([step, fields]) => {
      fields.forEach(f => {
        if (!this.B[f]) {
          const stepObj = STEPS.find(s => s.id == step);
          missing.push({ step, field: f, label: stepObj ? `${stepObj.title} > ${f}` : f });
        }
      });
    });
    return { ok: missing.length === 0, missing };
  },

  buildDoc1() {
    const B = this.B || {};
    const projeto = this.P?.name || 'Projeto';

    // ── Calcula campos preenchidos por step ──────────────────────
    const steps = STEPS || [];
    const required = REQUIRED_FIELDS || {};
    const stepsInfo = steps.map((s) => {
      const fieldKeys = required[s.id] || [];
      return {
        num: s.id,
        titulo: s.title,
        campos: fieldKeys.filter(key => B[key] && String(B[key]).trim()).length,
        total: fieldKeys.length,
      };
    });

    const stepsResumo = stepsInfo
      .map(s => `Step ${s.num} (${s.titulo}): ${s.campos}/${s.total} campos`)
      .join('\n');

    return `
# DOC-1 — ${projeto}
# Gerado pelo LandingAI · Adsgator
# Data: ${new Date().toLocaleDateString('pt-BR')}
#
# ═══════════════════════════════════════════════════════════════
# COMO USAR ESTE ARQUIVO
# ═══════════════════════════════════════════════════════════════
#
# OPÇÃO 1 — Claude Web (claude.ai):
#   1. Abra uma conversa nova
#   2. Cole TODO o conteúdo deste arquivo
#   3. A IA vai gerar o Blueprint de Implementação completo
#
# OPÇÃO 2 — Claude API / sistema externo:
#   Use o bloco entre === INICIO DO PROMPT === e === FIM DO PROMPT ===
#   como system prompt, e o BRIEFING ESTRUTURADO como user message.
#
# ═══════════════════════════════════════════════════════════════

=== INICIO DO PROMPT ===
Você é um desenvolvedor Astro especializado em landing pages de alta conversão.

Sua tarefa é gerar um Blueprint de Implementação completo para o projeto descrito abaixo.

## O QUE VOCÊ DEVE GERAR

Um documento Markdown com o título "# Blueprint de Implementação — [Nome do Projeto]" contendo:

### SEÇÃO 1 — ORDEM DE CRIAÇÃO
Liste todos os arquivos em ordem de criação, agrupados por fase:
- FASE 1: Fundação (package.json, astro.config.mjs, tailwind.config.js, .env.example)
- FASE 2: Assets estáticos (public/robots.txt, public/manifest.json, public/favicon.svg, src/assets/logo.svg)
- FASE 3: Pré-requisito de Assets de Imagem (liste todas as imagens necessárias com dimensões exatas)
- FASE 4: Componentes Globais
- FASE 5: Layout
- FASE 6: Seções (uma por bloco da estrutura aprovada)
- FASE 7: Páginas

### SEÇÃO 2 — INSTALAÇÃO DE DEPENDÊNCIAS
Bloco de código bash with todos os npm install necessários.

### SEÇÃO 3 — BUILD E DEPLOY
Comandos de desenvolvimento, build e deploy.

### SEÇÃO 4 em diante — UM ARQUIVO POR SEÇÃO
Para cada arquivo na ordem acima, gere:
- Um título \`### \`caminho/do/arquivo\`\`
- Um bloco de código com a extensão correta
- O código COMPLETO e funcional (nunca use "// ... resto do código" ou similar)
- Todo o conteúdo real do briefing aplicado (nomes reais, copies reais, cores reais, dados reais)
- NUNCA deixe placeholders genéricos como "[SEU NOME]" ou "[COR]" — use os dados do briefing

## STACK OBRIGATÓRIA

\`\`\`
Framework:    Astro 4.x (output: hybrid)
CSS:          Tailwind CSS 3.x
Animações:    GSAP 3.x + ScrollTrigger
Smooth scroll: Lenis (@studio-freight/lenis)
Animações UI: Framer Motion (apenas em componentes React)
Ícones:       Lucide React
Formulário:   Web3Forms (action URL via env)
Deploy:       Vercel (@astrojs/vercel adapter)
Analytics:    Vercel Analytics + Speed Insights
LGPD:         Cookie Banner + Google Consent Mode v2
\`\`\`

## PADRÕES OBRIGATÓRIOS DE CÓDIGO

### package.json — sempre incluir estas dependências exatas:
\`\`\`json
{
  "dependencies": {
    "@astrojs/react": "^3.6.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/tailwind": "^5.1.0",
    "@astrojs/vercel": "^7.8.0",
    "@studio-freight/lenis": "^1.0.42",
    "astro": "^4.16.0",
    "framer-motion": "^11.11.0",
    "gsap": "^3.12.5",
    "lucide-react": "^0.414.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "resend": "^4.0.0",
    "tailwindcss": "^3.4.14"
  }
}
\`\`\`

### astro.config.mjs — sempre usar:
\`\`\`js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'hybrid',
  site: 'https://[dominio-do-briefing].com.br',
  adapter: vercel(),
  integrations: [tailwind(), react(), sitemap()],
});
\`\`\`

### Padrão de seção Astro:
- Props definidos no frontmatter (---)
- Dados inline no componente (sem imports externos de dados)
- Script GSAP no final com ScrollTrigger
- Verificação de prefers-reduced-motion antes das animações
- Acessibilidade: aria-labels, roles, focus-visible
- WhatsApp links com texto pré-preenchido via encoding

### Padrão de animação GSAP:
\`\`\`js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.elemento', {
    opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.elemento', start: 'top 85%' }
  });
}
\`\`\`

### CookieBanner.tsx — sempre incluir Google Consent Mode v2:
\`\`\`ts
window.gtag('consent', 'update', {
  analytics_storage: aceito ? 'granted' : 'denied',
  ad_storage: aceito ? 'granted' : 'denied',
});
\`\`\`

### Layout.astro — sempre incluir:
- GTM snippet no <head> e <body>
- Lenis smooth scroll inicializado
- Vercel Analytics e Speed Insights
- Meta tags Open Graph completas
- Schema.org JSON-LD para LocalBusiness or ProfessionalService
- Fonte carregada via @fontsource (não Google Fonts CDN)

## CAMPOS QUE PRECISAM DE AÇÃO HUMANA
Use exatamente estas strings como placeholder (o Roo Code vai saber procurar por elas):
- \`[DOMINIO]\` — domínio final do projeto
- \`[GTM_ID]\` — ID do Google Tag Manager
- \`[WEB3FORMS_KEY]\` — chave do Web3Forms para formulário de contato
- \`[GA_ID]\` — ID do Google Analytics (opcional)

## REGRAS ABSOLUTAS
1. Nunca gere código incompleto. Se um arquivo tem 200 linhas, escreva 200 linhas.
2. Nunca use comentários como "// adicionar aqui" ou "// resto igual".
3. Toda copy deve vir do briefing abaixo. Nunca invente copy.
4. Nunca inclua blocos de depoimentos sem depoimentos reais no briefing.
5. Nunca inclua mapa sem endereço no briefing.
6. Nunca inclua feed Instagram sem @ confirmado no briefing.
7. Nunca inclua avaliações Google sem perfil confirmado no briefing.
8. H1 do Hero deve ser a dor de busca do cliente, não o nome do serviço.
9. Copy sempre em 1ª pessoa: "Eu atendo...", nunca "Maria atende...".
10. CTAs específicos. Nunca "Saiba mais" ou "Entre em contato".
=== FIM DO PROMPT ===

---

# BRIEFING ESTRUTURADO — ${projeto}

## Progresso de preenchimento
${stepsResumo}

---

## IDENTIDADE E POSICIONAMENTO

- **Nome do Profissional:** ${B.nome_profissional || '—'}
- **Nome da Marca:** ${B.nome_marca || '—'}
- **Nicho/Segmento:** ${B.nicho || '—'}
- **Cidade/Estado:** ${[B.cidade, B.estado].filter(Boolean).join(', ') || '—'}
- **Proposta de Valor:** ${B.proposta_valor || '—'}
- **Missão:** ${B.missao || '—'}
- **Anos de Experiência:** ${B.anos_experiencia || '—'}
- **Formação:** ${B.formacao || '—'}
- **Certificações:** ${B.certificacoes || '—'}

---

## AVATAR E DOR

- **Nome do Avatar:** ${B.avatar_nome || '—'}
- **Faixa Etária:** ${B.avatar_idade || '—'}
- **Gênero:** ${B.avatar_genero || '—'}
- **Profissão:** ${B.avatar_profissao || '—'}
- **Renda:** ${B.avatar_renda || '—'}
- **Dor Principal:** ${B.dor_principal || '—'}
- **Dores Secundárias:** ${B.dores_secundarias || '—'}
- **Desejo Principal:** ${B.desejo_principal || '—'}
- **Objeção — Preço:** ${B.objecao_preco || '—'}
- **Objeção — Tempo:** ${B.objecao_tempo || '—'}
- **Objeção — Confiança:** ${B.objecao_confianca || '—'}
- **Objeção — Resultado:** ${B.objecao_resultado || '—'}
- **Gatilhos Mentais:** ${B.gatilhos_mentais || '—'}

---

## SERVIÇO

- **Serviço Principal:** ${B.servico_principal || '—'}
- **Descrição:** ${B.servico_descricao || '—'}
- **Como Funciona — Passo 1:** ${B.como_funciona_passo1 || '—'}
- **Como Funciona — Passo 2:** ${B.como_funciona_passo2 || '—'}
- **Como Funciona — Passo 3:** ${B.como_funciona_passo3 || '—'}
- **Como Funciona — Passo 4:** ${B.como_funciona_passo4 || '—'}
- **Modalidade:** ${B.modalidade || '—'}
- **Duração da Sessão:** ${B.duracao_sessao || '—'}
- **Frequência:** ${B.frequencia || '—'}
- **Formato:** ${B.formato || '—'}
- **Resultado Esperado:** ${B.resultado_esperado || '—'}
- **Prazo para Resultado:** ${B.prazo_resultado || '—'}
- **Serviços Adicionais:** ${B.servicos_adicionais || '—'}

---

## PROVA SOCIAL

- **Depoimento 1 — Nome:** ${B.depoimento1_nome || '—'}
- **Depoimento 1 — Texto:** ${B.depoimento1_texto || '—'}
- **Depoimento 1 — Resultado:** ${B.depoimento1_resultado || '—'}
- **Depoimento 2 — Nome:** ${B.depoimento2_nome || '—'}
- **Depoimento 2 — Texto:** ${B.depoimento2_texto || '—'}
- **Depoimento 2 — Resultado:** ${B.depoimento2_resultado || '—'}
- **Depoimento 3 — Nome:** ${B.depoimento3_nome || '—'}
- **Depoimento 3 — Texto:** ${B.depoimento3_texto || '—'}
- **Depoimento 3 — Resultado:** ${B.depoimento3_resultado || '—'}
- **Casos de Sucesso:** ${B.casos_de_sucesso || '—'}
- **Perfil Google:** ${B.perfil_google || '—'}
- **Nota Google:** ${B.nota_google || '—'}
- **Qtd. Avaliações:** ${B.quantidade_avaliacoes || '—'}
- **Instagram:** ${B.instagram || '—'}
- **Seguidores:** ${B.seguidores || '—'}
- **Mídia / Aparições:** ${B.midia_aparicoes || '—'}

---

## DIFERENCIAIS

- **Diferencial 1:** ${B.diferencial1_titulo || '—'} — ${B.diferencial1_descricao || '—'}
- **Diferencial 2:** ${B.diferencial2_titulo || '—'} — ${B.diferencial2_descricao || '—'}
- **Diferencial 3:** ${B.diferencial3_titulo || '—'} — ${B.diferencial3_descricao || '—'}
- **Diferencial 4:** ${B.diferencial4_titulo || '—'} — ${B.diferencial4_descricao || '—'}
- **Metodologia Própria:** ${B.metodologia_propria || '—'}
- **Garantia:** ${B.garantia || '—'}
- **Atendimento Diferenciado:** ${B.atendimento_diferenciado || '—'}

---

## PREÇOS E CONTATO

- **WhatsApp:** ${B.whatsapp || '—'}
- **Mensagem padrão WhatsApp:** ${B.whatsapp_mensagem_padrao || '—'}
- **E-mail:** ${B.email || '—'}
- **Plano 1:** ${B.preco_plano1_nome || '—'} — ${B.preco_plano1_valor || '—'} — ${B.preco_plano1_descricao || '—'}
- **Plano 2:** ${B.preco_plano2_nome || '—'} — ${B.preco_plano2_valor || '—'} — ${B.preco_plano2_descricao || '—'}
- **Plano 3:** ${B.preco_plano3_nome || '—'} — ${B.preco_plano3_valor || '—'} — ${B.preco_plano3_descricao || '—'}
- **Formas de Pagamento:** ${B.forma_pagamento || '—'}
- **Desconto PIX:** ${B.desconto_pix || '—'}
- **Parcelamento:** ${B.parcelas || '—'}
- **Trial Gratuito:** ${B.trial_gratuito || '—'}
- **Horário de Atendimento:** ${B.horario_atendimento || '—'}

---

## IDENTIDADE VISUAL

- **Cor Primária:** ${B.cor_primaria || '—'}
- **Cor Secundária:** ${B.cor_secundaria || '—'}
- **Cor de Acento:** ${B.cor_acento || '—'}
- **Cor de Fundo:** ${B.cor_fundo || '—'}
- **Estilo Visual:** ${B.estilo_visual || '—'}
- **Fonte Título:** ${B.fonte_titulo || '—'}
- **Fonte Corpo:** ${B.fonte_corpo || '—'}
- **Tom de Comunicação:** ${B.tom_comunicacao || '—'}
- **Referências Visuais:** ${B.referencias_visuais || '—'}
- **Logo (descrição):** ${B.logo_descricao || '—'}
- **Imagens Disponíveis:** ${B.imagens_disponiveis || '—'}
- **Vídeo Disponível:** ${B.video_disponivel || '—'}

---

## SEO

- **Título SEO:** ${B.titulo_seo || '—'}
- **Descrição SEO:** ${B.descricao_seo || '—'}
- **Palavra-chave Principal:** ${B.palavra_chave_principal || '—'}
- **Palavras-chave Secundárias:** ${B.palavras_chave_secundarias || '—'}
- **Domínio Sugerido:** ${B.dominio_sugerido || '—'}
- **Schema Tipo:** ${B.schema_tipo || '—'}
- **OG Título:** ${B.og_titulo || '—'}
- **OG Descrição:** ${B.og_descricao || '—'}

---

## ESTRUTURA DA PÁGINA (Aprovada)

${B.estrutura_aprovada || B.estrutura_rascunho || '> Estrutura ainda não definida.'}

---

## DIREÇÃO DE ARTE

- **Referências visuais:** ${B.arte_referencias || '—'}
- **Análise de arte:** ${B.arte_analise || '—'}
- **Decisões aprovadas:** ${B.arte_aprovada || '—'}

---

*DOC-1 gerado pelo LandingAI v2 · Adsgator · ${new Date().toLocaleString('pt-BR')}*

---

# 📖 COMO USAR ESTE DOCUMENTO

## Para Usuários Técnicos

Este é o **DOC-1** — um prompt completo e estruturado contendo:
- Briefing completo do cliente
- Análise de segmento de mercado
- Direção de arte
- Estrutura da landing page
- Stack de tecnologias

### Opção 1: Usar com Claude (Recomendado)

1. Copie **TODO** o conteúdo deste arquivo
2. Abra https://claude.ai
3. Cole o conteúdo em uma nova conversa
4. Envie a mensagem

Claude vai reconhecer a estrutura e perguntar:
\`"Quer que eu gere a Ficha de Implementação em 4 partes?"\`

5. Responda com:
\`\`\`
Sim, gere a Ficha de Implementação seguindo este template:

---PARTE-1---
[Config files + estrutura do projeto]

---PARTE-2---
[Layout + Components Base]

---PARTE-3---
[Sections + Animações]

---PARTE-4---
[Integrações + Deploy]

Cada parte deve ser um arquivo .md completo, pronto para Roo Code.
\`\`\`

6. Copie as 4 partes geradas e salve em arquivos separados

### Opção 2: Usar com Gemini

1. Copie **TODO** o conteúdo deste arquivo
2. Abra https://gemini.google.com
3. Cole o conteúdo em uma nova conversa
4. Envie a mensagem

Gemini vai ler e responder:
\`"Entendi. Esta é uma ficha estruturada. Quer gerar a implementação?"\`

5. Responda com:
\`\`\`
Gere a Ficha de Implementação em 4 partes modulares, cada uma sendo um arquivo .md independente.

PARTE 1: Config + Estrutura (30-50KB)
PARTE 2: Layout + UI Components (20-30KB)
PARTE 3: Sections da LP + Animações (40-60KB)
PARTE 4: Integrações + Deploy (15-25KB)

Siga rigorosamente a estrutura de pastas proposta.
\`\`\`

6. Copie as 4 partes e salve em arquivos separados

### Opção 3: Usar com Grok (xAI)

1. Copie **TODO** o conteúdo deste arquivo
2. Abra https://x.com/grok (ou acesse via app xAI)
3. Cole o conteúdo
4. Grok vai processar e gerar a implementação em 4 partes

### Opção 4: Copiar para seu IDE com AI Assistant

Se usa VS Code + GitHub Copilot ou Cursor:

1. Copie este arquivo
2. Crie um novo arquivo chamado \`BRIEF.md\` no seu projeto
3. Cole o conteúdo
4. Abra o Chat do Copilot/Cursor
5. Digite: \`@BRIEF Gere a Ficha de Implementação em 4 partes\`

---

## Para Desenvolvedores

### O que fazer depois de receber as 4 partes:

1. **Salve em arquivos separados:**
   - \`doc-impl-parte1-[slug].md\`
   - \`doc-impl-parte2-[slug].md\`
   - \`doc-impl-parte3-[slug].md\`
   - \`doc-impl-parte4-[slug].md\`

2. **Clone o template Astro:**
   \`\`\`bash
   git clone https://github.com/adsgator/astro-landingai-template
   cd landing-page
   npm install
   \`\`\`

3. **Use com Roo Code:**
   \`\`\`bash
   roo --load-instructions BRIEF.md
   # ou
   roo --add-rules doc-impl-parte1-[slug].md
   \`\`\`

4. **Implemente cada parte em sequência:**
   - Parte 1: Setup inicial, pastas, config
   - Parte 2: Layout base, componentes reutilizáveis
   - Parte 3: Seções da LP, estilização
   - Parte 4: Integrações, animations, deploy

5. **Build e teste:**
   \`\`\`bash
   npm run dev      # Desenvolvimento
   npm run build    # Build final
   npm run preview  # Preview produção
   \`\`\`

---

## Checklist — Antes de Usar Este Documento

- [ ] Todos os 8 steps foram preenchidos?
- [ ] Direção de arte foi aprovada?
- [ ] Estrutura da LP foi aprovada?
- [ ] Stack de tecnologias faz sentido?
- [ ] Cliente confirmou o briefing?

Se sim para todos, este DOC-1 está 100% pronto para usar!

---

## Problema? Tente Isto

**"Recebo erro ao copiar o documento"**
- Use Ctrl+A (ou Cmd+A) para selecionar tudo
- Copie novamente com Ctrl+C
- Certifique-se de colar tudo em uma única mensagem

**"Claude/Gemini não reconhece a estrutura"**
- No início da conversa, diga: "Este é um briefing estruturado de landing page"
- Peça para confirmar que entendeu os 8 steps

**"As 4 partes têm nomes de arquivos diferentes"**
- Padronize os nomes: \`doc-impl-parte[1-4]-[slug].md\`
- Certifique-se que cada parte tem entre 20-60KB

**"Código não roda depois de implementar"**
- Confira o \`.clinerules\` na Parte 1
- Verifique que \`astro.config.mjs\` bate com a config
- Rode \`npm install\` novamente
- Check logs de build: \`npm run build\`

---

## Suporte

Dúvidas? Documentação completa em:
- https://docs.astro.build — Astro Official Docs
- https://tailwindcss.com/docs — Tailwind Docs
- https://gsap.com/docs — GSAP Animations Docs

---

## Metadados

| Campo | Valor |
|-------|-------|
| Formato | Markdown Estruturado |
| Partes | 4 arquivos .md |
| Tamanho Estimado | 100-150KB total |
| Tempo de Implementação | 8-12 horas com Roo Code |
| Stack | Astro + Tailwind CSS + GSAP + Vercel |
| Gerado | ${new Date().toLocaleDateString('pt-BR')} |
`.trim();
  }
});
