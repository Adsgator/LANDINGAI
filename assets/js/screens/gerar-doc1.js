/* ============================================================
   LandingAI v2 — Gerador do DOC-1 Rico e Completo
   ============================================================ */

Object.assign(window.App, {

  /**
   * REGRAS FIXAS ADSGATOR
   * Bloco de texto imutável embutido em todos os DOC-1
   */
  REGRAS_FIXAS_ADSGATOR: `
---

## PARTE B — REGRAS FIXAS ADSGATOR

> Estas regras aplicam-se a 100% dos projetos. Não resumir. Não ignorar. Não inventar alternativas.

---

### STACK TÉCNICA

\`\`\`
NÚCLEO IMUTÁVEL
───────────────
Astro          → Framework base. output: 'static'. Zero JS desnecessário.
                 astro.config.mjs: output: 'static', site: 'https://[dominio].com.br'
                 @astrojs/sitemap instalado e configurado.
                 Excluir do sitemap: /links, /politica-de-privacidade, /termos-de-uso, /404

Tailwind CSS   → Toda estilização. Tokens em tailwind.config.js.
                 Sem style="" onde Tailwind resolve.
                 Sem HEX hardcoded no código — sempre via token.

Node.js        → Ambiente de build.

Lenis          → Smooth scroll global.
                 npm install @studio-freight/lenis
                 Inicializado em <script is:inline> no Layout.astro.
                 duration: 1.2 | easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                 Integrado ao GSAP: lenis.on('scroll', ScrollTrigger.update)
                 gsap.ticker.add((time) => { lenis.raf(time * 1000) })
                 gsap.ticker.lagSmoothing(0)

ANALYTICS E MONITORAMENTO
──────────────────────────
Vercel Analytics   → npm install @vercel/analytics
                     import { Analytics } from '@vercel/analytics/astro'
                     Inserir <Analytics /> no Layout.astro após o conteúdo.

Vercel Speed Insights → npm install @vercel/speed-insights
                     import { SpeedInsights } from '@vercel/speed-insights/astro'
                     Inserir <SpeedInsights /> no Layout.astro.

EXTENSÕES (apenas onde necessário)
───────────────────────────────────
React          → Somente para componentes com estado dinâmico real:
                 MobileMenu.tsx, InstagramFeed.tsx (se ativo), ContactForm.tsx, CookieBanner.tsx
                 Sempre com client:visible ou client:idle (nunca client:load sem justificativa)

GSAP + ScrollTrigger → Animações de scroll e timelines.
                 Direto em <script> dentro dos .astro — nunca via import em bundle React.
                 gsap.registerPlugin(ScrollTrigger) obrigatório antes de qualquer uso.

Framer Motion  → Dentro de islands React.
                 Menu mobile fullscreen (AnimatePresence), hover em cards, CTA spring.

Web3forms      → Backend do formulário de contato (se formulário ativo).
                 Variável: ACCESS_KEY no .env

DEPLOY E INFRAESTRUTURA
────────────────────────
Target: Vercel — output: 'static' em astro.config.mjs

GIT — OBRIGATÓRIO ANTES DE QUALQUER CÓDIGO
────────────────────────────────────────────
git init                   → inicializar repositório no primeiro passo
.gitignore padrão Astro:   → node_modules/, dist/, .env
Commit inicial:            → "init: projeto Astro base" antes de qualquer código
Repositório remoto:        → conectar ao GitHub ou GitLab antes do primeiro deploy
CI/CD:                     → Vercel conecta ao repositório para deploy automático a cada push
Branches:
  main   → produção (deploy automático na Vercel)
  dev    → desenvolvimento local

ARQUIVOS OBRIGATÓRIOS
──────────────────────
public/robots.txt    → Permite: / | Proíbe: /links | Sitemap: https://[dominio]/sitemap-index.xml
public/manifest.json → name, short_name, start_url "/", display "standalone",
                       background_color e theme_color via tokens do projeto
.env.example         → todas as variáveis documentadas, sem valores reais:
                         GTM_ID=GTM-XXXXXXX
                         WHATSAPP_NUMBER=
                         ACCESS_KEY= (se formulário ativo)
                         INSTAGRAM_TOKEN= (se feed ativo)
                         GOOGLE_MAPS_API_KEY= (se mapa avançado ativo)
\`\`\`

---

### COMPONENTES GLOBAIS

\`\`\`
Componentes Astro obrigatórios:
  Layout.astro          → Shell global. Contém: <head> com SEO, GTM snippet (is:inline),
                          Consent Mode v2, Lenis init, GSAP, Vercel Analytics, Speed Insights,
                          componente de menu, botão WhatsApp flutuante, rodapé.
  Button.astro          → Props: label, href, variant (primary | secondary | ghost), tracking-id.
                          Nunca escrever botão inline nas seções.
  SectionHeader.astro   → Props: label (texto pequeno acima), title, subtitle.
                          Usado em todas as seções com título + subtítulo.
  FeatureCard.astro     → Props: icon, title, description. Diferenciais e Como Funciona.
  TestimonialCard.astro → Props: name, role, text, avatar (opcional). Prova social.
  ReviewCard.astro      → Props: name, rating, text, date. Avaliações Google.

Componentes React (islands):
  MobileMenu.tsx        → Fullscreen overlay com Framer Motion AnimatePresence.
                          Props: links[], ctaLabel, ctaHref.
  InstagramFeed.tsx     → Grid de posts. Props: username, token (env var).
                          Sempre com ErrorBoundary — se API falhar, exibe placeholder neutro.
  ContactForm.tsx       → Multi-step se aplicável. Props: whatsappFallback.
                          ErrorBoundary: se falhar, exibe link direto para WhatsApp.
  CookieBanner.tsx      → Banner LGPD + Google Consent Mode v2.
                          Props: gtmId. client:idle. Estado via localStorage.
\`\`\`

---

### PADRÃO DE ASSETS

\`\`\`
Localização: src/assets/images/[nome-do-arquivo].webp
Convenção de nomes:
  hero-principal.webp       → foto principal do profissional ou serviço
  profissional-retrato.webp → foto para seção de diferenciais
  servico-[numero].webp     → fotos de serviços específicos
  depoimento-[nome].webp    → avatares de depoimentos
  og-image.webp             → 1200x630px — compartilhamento social
  favicon.svg               → SVG nativo, nunca PNG
  avatar-links.webp         → 192x192px — foto para /links

Componente de imagem: sempre <Image /> nativo do Astro
  loading="eager"  → apenas hero-principal.webp
  loading="lazy"   → todo o resto
  width e height   → sempre definidos (evita layout shift)
  format="webp"    → explícito

Placeholders (quando asset não disponível):
  Fundo: token bg-surface
  Label descritivo: ex: "[Foto do profissional — 800x1000px]"
  Nunca cor sólida genérica sem label
\`\`\`

---

### DESIGN DE VIEWPORT — REGRA ADSGATOR

\`\`\`
O site não fica preso em um container central. Containers são ferramentas de legibilidade.

Aplicação por tipo de bloco:
  Hero:                 full-bleed. Fundo vai de borda a borda. Conteúdo no container interno.
  Seções fundo alternado: full-bleed com cor/textura própria — cria ritmo visual.
  Seções de texto:      container centralizado (max-w-prose ou max-w-2xl).
  Seções de grid:       container mais largo (max-w-7xl) com padding lateral.
  CTA Final:            full-bleed com cor de destaque — contraste máximo.
  Footer:               full-bleed — nunca container estreito.
  Imagens heroicas:     podem sangrar para fora do grid em desktop.

Ritmo visual entre seções:
  Alternar backgrounds (claro → levemente diferente → claro) cria profundidade.
  Mínimo 3 variações de fundo: background, surface, tom de destaque.
  Espaçamento vertical: py-24 mínimo mobile, py-32 a py-40 desktop.
\`\`\`

---

### PERFORMANCE E SEO TÉCNICO

\`\`\`
Preload de assets críticos (no <head> via Layout.astro):
  <link rel="preconnect"> para domínio da fonte
  <link rel="preload"> do woff2 da fonte principal com crossorigin="anonymous"
  <link rel="preload"> da hero-principal.webp com fetchpriority="high" as="image"

Font loading:
  font-display: swap obrigatório em toda @font-face.
  Fallback stack explícito no tailwind.config.js:
    fontFamily: { sans: ['NomeDaFonte', 'ui-sans-serif', 'system-ui', 'sans-serif'] }

Canonical URL:
  <link rel="canonical" href="https://[domínio]/[path]" />
  Cada página recebe seu canonical absoluto via prop no Layout.
\`\`\`

---

### SISTEMA DE RASTREAMENTO

\`\`\`
Google Tag Manager:
  Snippet head: dentro do <head>, imediatamente após <meta charset>
  Snippet body: imediatamente após abertura do <body>
  Diretiva Astro: <script is:inline> — obrigatório. Nunca processar com bundler.
  Componente: GTM.astro → recebe ID via prop. Usado dentro do Layout.astro.

Conversões Google Ads — padrão Adsgator:
  contato_wpp   → cliques em links WhatsApp
  view_content  → pageview da landing page principal
  view_links    → pageview da /links

Data attributes obrigatórios em todos os CTAs:
  id="btn-[local]"
  data-tracking="[ação]-[destino]"
  data-section="[nome-da-seção]"
\`\`\`

---

### UX OBRIGATÓRIO

\`\`\`
Header Inteligente:
  Sticky top-0 z-50
  Esconde ao scrollar para baixo (GSAP translateY -100%, 0.3s ease-in-out)
  Reaparece ao scrollar para cima
  Fundo opaco ou backdrop-blur após 80px de scroll (transition 0.2s)
  Sempre contém logo + CTA principal rastreado
  Logo: link para #top, SVG nativo

Menu Mobile — Padrão Alto Padrão Adsgator:
  Acionado por botão hambúrguer com morphing animado (3 linhas → X, Framer Motion)
  Fullscreen overlay com AnimatePresence
  Fundo: cor da marca com opacidade alta ou dark overlay
  Links: stagger 0.05s de delay, slide de baixo para cima
  Tipografia: grande, impactante — não uma lista discreta
  Elemento de destaque: número de telefone OU CTA no fundo do overlay
  Fechar: clique fora, Escape ou botão X
  Scroll do body bloqueado enquanto aberto (overflow-hidden no html)
  Focus trap enquanto aberto

Botão WhatsApp Flutuante:
  Posição: bottom-6 right-6, z-50
  Estilo: círculo 56px, cor WhatsApp (#25D366) ou cor primary do projeto
  Ícone: WhatsApp SVG nativo (não de biblioteca de ícones)
  Comportamento: hidden no hero (IntersectionObserver). Aparece após rolar 100vh.
  Link: wa.me/[número]?text=[mensagem URL-encoded]
  aria-label="Falar pelo WhatsApp"
  data-tracking="click-whatsapp-flutuante"
  data-section="floating"
\`\`\`

---

### ANIMAÇÕES

\`\`\`
Padrão de entrada (ScrollTrigger):
  trigger: elemento | start: "top 85%" | toggleActions: "play none none none"
  Duração base: 0.6s | Ease: power2.out
  Fade + movimento: opacity 0→1 + y: 30→0
  Fade simples: opacity 0→1 (para elementos pequenos)

Stagger em grupos (cards, listas):
  each: 0.1s | from: "start"

Menu mobile (Framer Motion):
  Overlay: opacity 0→1 | duration: 0.3s
  Links: stagger 0.05s, y: 20→0 + opacity: 0→1

Hover em cards: y: -4px, scale: 1.01, 0.2s ease-out
Hover em botões: scale: 1.03, 0.15s spring

prefers-reduced-motion:
  Verificar SEMPRE antes de registrar qualquer animação GSAP.
  Código padrão:
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) { /* animações GSAP */ }
  Framer Motion: usar motion.div com variants que respeitam o hook useReducedMotion()
\`\`\`

---

### ACESSIBILIDADE MÍNIMA OBRIGATÓRIA

\`\`\`
Contraste: WCAG AA mínimo — ratio 4.5:1 texto normal, 3:1 texto grande
Imagens: alt descritivo e específico. alt="" apenas em imagens decorativas.
Botões icon-only: aria-label obrigatório (WhatsApp flutuante, hambúrguer, fechar)
Links externos: rel="noopener noreferrer"
Focus: focus-visible em todos os elementos interativos — nunca outline:none sem substituto
  Classes: focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
Menu mobile: focus trap enquanto aberto. Escape fecha.
Semântica: <h1> única por página (no Hero). Hierarquia h1→h2→h3 sem pular nível.
  <main>, <header>, <footer>, <nav>, <section> com roles corretos.
Formulários: <label> associado via htmlFor/id. Mensagens de erro via aria-describedby.
\`\`\`

---

### COMPORTAMENTO RESPONSIVO POR TIPO DE SEÇÃO

\`\`\`
Hero:
  mobile:   coluna única, texto em cima, imagem embaixo ou background full-bleed
  desktop:  2 colunas — texto (55%) | imagem (45%)

Diferenciais / Features:
  mobile:   1 coluna, cards empilhados
  tablet:   2 colunas
  desktop:  3 ou 4 colunas

Como Funciona:
  mobile:   vertical, numerado, com linha conectora
  desktop:  horizontal com seta entre etapas, ou alternado esquerda/direita

Prova Social:
  mobile:   slider/carousel 1 item (Framer Motion drag)
  desktop:  grid 2 ou 3 colunas

Avaliações Google:
  mobile:   horizontal scroll (overflow-x-auto, snap-mandatory)
  desktop:  grid 3 colunas

Feed Instagram:
  mobile:   grid 2x3
  desktop:  grid 3x2

FAQ:
  accordion, sempre 1 coluna, max-w-2xl centralizado

Mapa:
  mobile:   embed full width, 300px de altura
  desktop:  60% width + info de endereço ao lado, 400px

CTA Final:
  mobile:   coluna única, headline grande, botão full width
  desktop:  centralizado, max-w-3xl, botão não full width
\`\`\`

---

### INTEGRAÇÕES TÉCNICAS

\`\`\`
Google Maps:
  Embed API (iframe) — sem chave para embed básico
  Parâmetros: q=[endereço URL-encoded]&output=embed&z=16&language=pt-BR
  Sempre incluir bloco de endereço textual ao lado ou abaixo

Google Reviews:
  Places API (chave fornecida pelo gestor) ou widget Elfsight
  Exibir: foto, nome, nota em estrelas (SVG), texto, data relativa
  Máximo: 6 desktop, 3 mobile. Nota geral + total acima dos cards.

Instagram Feed:
  Island React (client:visible) — não bloqueia carregamento
  Token: INSTAGRAM_TOKEN no .env — nunca hardcoded
  ErrorBoundary: se falhar, exibe "Ver no Instagram →" linkado ao perfil

Formulário de Contato:
  Simples: Astro nativo com Web3Forms
  Multi-step: island React com Framer Motion AnimatePresence
  Honeypot: campo oculto via CSS (position absolute left -9999px)
  Submit: feedback inline — sem redirecionamento externo
  ErrorBoundary: fallback para WhatsApp se submit falhar

Links WhatsApp — formato canônico:
  https://wa.me/[DDI+DDD+NÚMERO]?text=[MENSAGEM_URL_ENCODED]
  Nunca api.whatsapp.com/send — sempre wa.me
\`\`\`

---

### SCHEMA.ORG — DADOS ESTRUTURADOS

\`\`\`
Obrigatório em 100% dos projetos. Tipo base: LocalBusiness ou subtipo do nicho.

Subtipos por nicho:
  Dentista:       Dentist
  Nutricionista:  Nutritionist
  Fisioterapeuta: MedicalBusiness
  Advogado:       LegalService
  Psicólogo:      MedicalBusiness
  Salão/Estética: HealthAndBeautyBusiness
  Outros:         LocalBusiness

Campos obrigatórios (JSON-LD no <head> via Layout.astro):
  @context, @type, name, description, url, telephone, image, openingHours, sameAs
  address e geo: APENAS se atendimento presencial confirmado com endereço autorizado
  aggregateRating: APENAS se avaliações reais confirmadas — nunca inventar
  priceRange: se valor fornecido no briefing

Nunca inventar dados. Se campo não foi fornecido, omiti-lo.
\`\`\`

---

### PÁGINAS ADICIONAIS DO PROJETO

#### Página /links — Árvore de Links

Objetivo: Concentrar todos os pontos de contato. Bio do Instagram + destino de QR codes.
Disparador Google Ads: view_links (pageview via GTM).

Estrutura:
  1. Logo ou nome (topo, centralizado)
  2. Foto circular do profissional (96px, borda sutil)
  3. Tagline de 1 linha (vem da copy do projeto)
  4. Botões em coluna por prioridade de conversão
  5. Ícones de redes sociais abaixo
  6. Rodapé mínimo com ano dinâmico

Animação: opacity 0→1 + y: 20→0, stagger 0.08s, Framer Motion.
Design: ultra-minimalista. Mesmo DNA visual da landing page.
Mobile First absoluto. Desktop é secundário.

#### Página /404 Personalizada

Objetivo: Reter o visitante perdido. Converter frustração em ação.
Copy: No tom exato do projeto — nunca "Página não encontrada. Erro 404."

Design:
  "404" em tipografia massiva, baixa opacidade, como background typographic
  Animação GSAP: y: 0→-10→0, loop 4s ease-in-out
  Dois botões: Home (primary) + WhatsApp (secondary)
  data-tracking: "click-404-home" e "click-404-whatsapp"

#### Página /politica-de-privacidade e /termos-de-uso

Objetivo: Cumprir LGPD, dar credibilidade, evitar reprovação de anúncios Google.
<meta name="robots" content="noindex, follow">

Design:
  Layout editorial de leitura — mínimo 17px, line-height 1.8
  Header simplificado: logo + "← Voltar ao site"
  Sidebar de âncoras em desktop, accordion no mobile
  Rodapé padrão do projeto

Conteúdo: Gere o texto completo adaptado ao tom do projeto e aos dados fornecidos.

---

### PROIBIÇÕES VISUAIS GLOBAIS

\`\`\`
SEM gradientes coloridos entre duas cores vibrantes
SEM sombras coloridas (box-shadow só em tons neutros, máx opacity 0.15)
SEM backgrounds com ilustrações genéricas ou stock vectors
SEM bordas arredondadas excessivas (máx rounded-sm em botões, rounded em cards)
SEM ícones coloridos (monocromático — cor do texto ou primary)
SEM mistura de estilos de ícone na mesma página (uma biblioteca, consistente em 100%)
SEM copy alterada — o texto do DOC-1 não muda nem uma vírgula
SEM HEX hardcoded no código — sempre via token Tailwind
SEM animação sem prefers-reduced-motion check
SEM credenciais, tokens ou API keys no código — sempre em .env
SEM console.log em produção
SEM imagem sem width e height definidos
SEM <form> HTML nativo em islands React — usar event handlers
SEM <div> clicável no lugar de <button> ou <a>
SEM container central estreito em seções que podem ser full-bleed
SEM footer genérico — sempre com identidade visual conectada à página
\`\`\`

---

### CHECKLIST DE ENTREGA

#### Antes de codificar
[ ] git init + .gitignore + commit inicial
[ ] Repositório remoto criado e conectado
[ ] Assets em src/assets/images/ com nomes corretos
[ ] .env criado com base no .env.example — valores reais inseridos
[ ] Fontes instaladas: npm install @fontsource/[...]
[ ] tailwind.config.js configurado with todos os tokens
[ ] Lenis instalado: npm install @studio-freight/lenis
[ ] Vercel Analytics: npm install @vercel/analytics
[ ] Speed Insights: npm install @vercel/speed-insights

#### Durante a implementação
[ ] Layout.astro com: GTM (is:inline), Consent Mode v2, Lenis, GSAP,
    Vercel Analytics, Speed Insights, SEO tags, Schema.org JSON-LD
[ ] Componentes globais criados antes das seções
[ ] Nenhum HEX hardcoded — sempre via token
[ ] Todos os botões com id e data-tracking
[ ] prefers-reduced-motion check em todas as animações GSAP
[ ] Focus trap no MobileMenu quando aberto
[ ] Scroll do body bloqueado quando MobileMenu aberto
[ ] focus-visible em todos os elementos interativos
[ ] Todas as imagens com width, height e alt descritivo
[ ] Links externos with rel="noopener noreferrer"
[ ] Botão WhatsApp flutuante com IntersectionObserver correto
[ ] ErrorBoundary no ContactForm com fallback WhatsApp
[ ] Honeypot no formulário
[ ] public/robots.txt criado
[ ] public/manifest.json criado
[ ] @astrojs/sitemap configurado

#### Antes de entregar
[ ] Build sem erros: npm run build
[ ] Lighthouse Performance ≥ 90 mobile
[ ] Lighthouse Accessibility ≥ 90
[ ] Mobile testado em 375px — sem overflow horizontal
[ ] Link WhatsApp testado — mensagem pré-preenchida aparece corretamente
[ ] Menu mobile testado em DevTools 375px
[ ] Smooth scroll funcionando — Lenis + GSAP sem travamentos
[ ] GTM snippet no <head> E no <body>
[ ] Conversões mapeadas: contato_wpp, view_content, view_links
[ ] /links funcionando com tracking
[ ] /404 personalizada ativa
[ ] /politica-de-privacidade acessível via rodapé
[ ] og-image testada em opengraph.xyz
[ ] Ano dinâmico no rodapé: {new Date().getFullYear()}
[ ] Nenhum console.log em produção
[ ] CookieBanner funcionando e registrando consent
[ ] Schema.org válido: validator.schema.org
[ ] Vercel Analytics ativo — confirmar no dashboard Vercel
[ ] Speed Insights ativo — confirmar no dashboard Vercel

---

### LOCAIS QUE EXIGEM AÇÃO HUMANA

[ ] Substituir placeholder hero-principal.webp pela foto real
[ ] Substituir profissional-retrato.webp pela foto real
[ ] Inserir GTM ID real no .env (GTM_ID=GTM-XXXXXXX)
[ ] Inserir domínio real em todas as ocorrências de [dominio-do-cliente].com.br
[ ] Confirmar link WhatsApp manualmente no dispositivo
[ ] Configurar conversões no Google Ads com o gestor de tráfego
[ ] Aprovar copy com o cliente antes do go-live
`,

  /**
   * Monta a Parte A do DOC-1 com os dados do projeto
   */
  montarParteADoc1() {
    const P = this.P;
    const B = this.B;
    const intencao = B.intencao || {};
    const seo = B.seo || {};
    const estruturaCopyBlocos = B.estruturaCopyBlocos || [];
    const artDirection = B.artDirection || B.arte_ficha || {}; // Fallback para arte_ficha se artDirection não existir

    const nomeCliente = B.nome_cliente || P.name || 'Não informado';
    const slug = P.slug || 'projeto';

    // Monta link WA com mensagem pré-formatada
    const whatsapp = B.whatsapp?.replace(/\D/g, '') || '';
    const msgWA = encodeURIComponent(B.mensagem_wa || `Olá! Vi o site e quero saber mais.`);
    const linkWA = whatsapp ? `https://wa.me/${whatsapp}?text=${msgWA}` : '[preencher]';

    // Integrações ativas (baseadas no briefing)
    const integracoes = [];
    if (B.google_business && B.google_business_reviews >= 10) {
      integracoes.push(`[x] Google Reviews widget — ${B.google_business_nota || '4.8★'}`);
    } else {
      integracoes.push(`[ ] Google Reviews widget — ${B.google_business ? 'perfil existe, mas sem avaliações suficientes' : 'sem perfil'}`);
    }
    if (B.instagram) {
      integracoes.push(`[x] Instagram Feed — ${B.instagram_handle || B.instagram}`);
    } else {
      integracoes.push(`[ ] Instagram Feed — sem perfil ativo`);
    }
    if (B.modalidade === 'presencial' && B.endereco_autorizado) {
      integracoes.push(`[x] Google Maps embed — ${B.endereco_completo || B.endereco}`);
    } else {
      integracoes.push(`[ ] Google Maps embed — atendimento não presencial ou endereço não autorizado`);
    }
    if (B.formulario_contato) {
      integracoes.push(`[x] Formulário de Contato — além do WhatsApp`);
    } else {
      integracoes.push(`[ ] Formulário de Contato — apenas WhatsApp`);
    }
    integracoes.push(`[x] WhatsApp flutuante — sempre presente (padrão Adsgator)`);

    // Copy por bloco
    const copyBlocos = (estruturaCopyBlocos || []).map((bloco, i) => `
### BLOCO ${i + 1}: ${bloco.nome}

**Objetivo Persuasivo:**
${bloco.objetivo || '—'}

**Copy Completa:**
${bloco.copy || '—'}

${bloco.integracao ? `**Nota de Integração:**\n${bloco.integracao}\n` : ''}
${bloco.visual ? `**Nota Visual:**\n${bloco.visual}` : ''}
`).join('\n---\n');

    return `# DOC-1 — ${nomeCliente}

> Gerado por **LandingAI** · Adsgator · ${new Date().toLocaleDateString('pt-BR')}
> Envie este arquivo completo para a IA implementadora.
> A IA lê, interpreta e gera o Documento de Implementação em 4 partes sem perguntas adicionais.

---

## INSTRUÇÃO PARA A IA IMPLEMENTADORA

Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior, trabalhando para a agência Adsgator.

Sua missão: ler este documento inteiro e gerar o **Documento de Implementação completo**, em 4 partes, pronto para o Roo Code, Claude Code ou outro agente implementador construir a landing page.

O que isso significa na prática:
- Você toma todas as decisões de design não explicitadas — tipografia, escala, tokens, animações, layout de cada seção.
- Você preenche cada campo com valores concretos. Sem placeholders. Sem [definir depois]. Sem [a combinar].
- Você transforma a direção criativa e a copy abaixo em especificações técnicas de implementação.
- O output que você entrega pode ser copiado e enviado para outra IA sem nenhuma edição adicional.

Padrão de qualidade esperado: design editorial de alto padrão — atípico, com personalidade visual forte, fora do visual genérico de IA. Pense Raycast, Linear, Family.co. Layouts com intenção. Tipografia com personalidade. Animações que têm razão de existir.

Formato de entrega: 4 arquivos Markdown separados:
- Parte 1 — Fundação (.clinerules, .gitignore, package.json, astro.config.mjs, tailwind.config.js, .env.example)
- Parte 2 — Layout + Componentes Globais (Layout.astro, Header, Footer, Button, etc)
- Parte 3 — Seções (Hero, About, Services, Diferenciais, FAQ, CTA, etc — conforme fluxo abaixo)
- Parte 4 — Integrações + Páginas Adicionais (GTM, Forms, /links, /404, /politica, deploy)

Cada parte deve ser **completa e independente**. Código real, funcional, sem comentários como "// resto aqui".

---

## PARTE A — DADOS DO PROJETO

---

### 1. RESUMO DO PROJETO

| Campo | Valor |
|-------|-------|
| **Profissional** | ${nomeCliente} |
| **Nicho** | ${B.nicho || B.segmento || '—'} |
| **Serviço Principal** | ${B.servico_principal || '—'} |
| **Proposta de Valor** | ${B.proposta_valor || '—'} |
| **Objetivo da Página** | ${B.objetivo_pagina || 'Conversão para WhatsApp'} |
| **Público-Alvo Principal** | ${B.avatar_principal || B.publico_primario || '—'} |
| **Tom de Voz** | ${B.tom_voz || B.tom_personalidade || '—'} |
| **Objetivo de Conversão** | ${B.objetivo_conversao || 'Mensagem no WhatsApp'} |
| **Cidade / Região** | ${B.cidade || '—'} |
| **Modalidade** | ${B.modalidade || '—'} |
| **Número WhatsApp** | ${B.whatsapp || '—'} |
| **Mensagem Pré-Preenchida** | ${B.mensagem_wa || 'Olá! Vi o site e quero saber mais.'} |
| **Link CTA Principal** | ${linkWA} |
| **GTM ID** | ${B.gtm_id || 'GTM-XXXXXXX (inserir antes do deploy)'} |
| **Domínio Previsto** | ${B.dominio || '[dominio-do-cliente].com.br'} |
| **CNPJ** | ${B.cnpj || 'Não informado'} |

---

### 2. ANÁLISE DE INTENÇÃO

${B.intencao ? `
**Dor #1 (Dor Principal — H1 deve espelhar esta):**
- Dor real: ${intencao.dor1_real || '—'}
- Palavra da busca: ${intencao.dor1_busca || '—'}
- Resultado desejado: ${intencao.dor1_resultado || '—'}

**Dor #2:**
- Dor real: ${intencao.dor2_real || '—'}
- Palavra da busca: ${intencao.dor2_busca || '—'}
- Resultado desejado: ${intencao.dor2_resultado || '—'}

**Dor #3:**
- Dor real: ${intencao.dor3_real || '—'}
- Palavra da busca: ${intencao.dor3_busca || '—'}
- Resultado desejado: ${intencao.dor3_resultado || '—'}
` : '(Análise de intenção não preenchida)'}

---

### 3. METADADOS DE SEO

**Landing Page Principal:**
- \`<title>\`: ${seo.title || '(não gerado)'}
- \`<meta description>\`: ${seo.description || '(não gerado)'}
- \`<meta keywords>\`: ${seo.keywords || '(não gerado)'}
- \`<og:title>\`: ${seo.og_title || '(não gerado)'}
- \`<og:description>\`: ${seo.og_description || '(não gerado)'}

**Página /links:**
- \`<title>\`: ${seo.links_title || '(não gerado)'}
- \`<meta description>\`: ${seo.links_description || '(não gerado)'}

---

### 4. PRESENÇA DIGITAL E ASSETS

**Assets Disponíveis:**
\`\`\`
Foto do profissional:   ${B.foto_profissional ? 'Sim — ' + (B.foto_qualidade || 'boa') : 'Não'}
Logo da marca:          ${B.logo ? 'Sim — ' + (B.logo_formato || 'SVG') : 'Não'}
Depoimentos:            ${B.depoimentos ? 'Sim — ' + (B.depoimentos_qtd || 'vários') + ' depoimentos' : 'Não'}
Google Business:        ${B.google_business ? 'Sim — ' + (B.google_business_nota || B.google_nota || '4.8★') : 'Não'}
Instagram ativo:        ${B.instagram ? 'Sim — ' + (B.instagram_handle || B.instagram) : 'Não'}
Endereço físico:        ${B.endereco_autorizado ? 'Sim — ' + (B.endereco_completo || B.endereco) : 'Não / Não autorizado'}
\`\`\`

**Integrações Ativas:**
\`\`\`
${integracoes.join('\n')}
\`\`\`

---

### 5. FLUXO DA PÁGINA — BLOCOS SELECIONADOS

${(estruturaCopyBlocos || []).map((b, i) => `${i + 1}. ${b.nome} ${b.tipo === 'condicional' ? '*(condicional)*' : ''}`).join('\n') || '(fluxo não definido)'}

---

### 6. COPY COMPLETA — BLOCO A BLOCO

> REGRA CRÍTICA: Não alterar nenhuma palavra da copy abaixo. Transcrevê-la exatamente na implementação.

${copyBlocos || '(copy não gerada)'}

---

### 7. DIREÇÃO DE ARTE

**Cores da Marca:**
\`\`\`
Cor principal:    ${artDirection.corPrincipal || artDirection.cor_primaria || 'Sem identidade definida'}
Cor secundária:   ${artDirection.corSecundaria || artDirection.cor_secundaria || 'Não existe'}
Logo disponível:  ${B.logo ? (B.logo_formato || 'Sim') : 'Não'}
Observações:      ${artDirection.corObservacoes || artDirection.cores_notas || '—'}
\`\`\`

**Direção Geral:**
\`\`\`
Estilo desejado:    ${artDirection.estilo || artDirection.estilo_geral || '—'}
O que não quero:    ${artDirection.naoQuero || artDirection.estilo_nao_quero || '—'}
Tema:               ${artDirection.tema || 'IA decide com base nas referências'}
Intensidade visual: ${artDirection.intensidade || artDirection.intensidade_visual || '—'}
\`\`\`

**Referências Visuais:**
${(artDirection.referenciasVisuais || B.arte_referencias_pessoais || []).map((r, i) => `
Referência ${i + 1}: ${r.link || r.nome || r.url || '—'}
O que me atraiu: ${r.descricao || r.motivo || '—'}
`).join('') || 'Nenhuma referência adicionada'}

**Referências do Nicho:**
${artDirection.referenciasNicho || B.arte_referencias_nicho?.join(', ') || '—'}

**Direção do Footer:**
\`\`\`
Tom visual:        ${artDirection.footer_tom || '—'}
Elemento âncora:   ${artDirection.footer_ancora || '—'}
O que deve conter: logo, redes sociais, política de privacidade, CNPJ${B.cnpj ? ' (' + B.cnpj + ')' : ''}, logo Adsgator
Sensação:          ${artDirection.footer_sensacao || '—'}
\`\`\`

**Menu Mobile:**
\`\`\`
Estilo desejado:   ${artDirection.menu_estilo || 'Fullscreen overlay (padrão Adsgator)'}
Elemento especial: ${artDirection.menu_especial || '—'}
\`\`\`
`;
  },

  /**
   * Monta o DOC-1 completo (Parte A + Parte B)
   */
  gerarDoc1Completo() {
    const parteA = this.montarParteADoc1();
    return parteA + this.REGRAS_FIXAS_ADSGATOR;
  },

  /**
   * Baixa o DOC-1 completo
   */
  baixarDoc1() {
    const P = this.P;
    const B = this.B;
    const nomeCliente = B.nome_cliente || P.name || 'projeto';
    const slug = P.slug || nomeCliente.toLowerCase().replace(/\s+/g, '-');

    const conteudo = this.gerarDoc1Completo();
    const blob = new Blob([conteudo], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doc1-${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('✅ DOC-1 baixado!', 'success');
  },

  /**
   * Copia o DOC-1 completo para o clipboard
   */
  async copiarDoc1() {
    try {
      const conteudo = this.gerarDoc1Completo();
      await navigator.clipboard.writeText(conteudo);
      this.showToast('✅ DOC-1 copiado para o clipboard!', 'success');
    } catch (err) {
      this.showToast('❌ Erro ao copiar. Use o botão de download.', 'error');
    }
  }

});
