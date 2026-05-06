
# DOC-1: BRIEFING TÉCNICO E ESTRATÉGICO
**Projeto:** Sem Nome
**Data:** 06/05/2026
**Agência:** Adsgator

---

## PARTE 1 — IDENTIFICAÇÃO E CONTATO

| Parâmetro | Valor |
|---|---|
| **Cliente** | — |
| **Marca** | — |
| **Segmento** | Adestramento Canino |
| **Link WA** | — |
| **E-mail** | — |
| **Horários** | — |
| **GTM ID** | — |
| **Domínio** | — |
| **CNPJ** | — |
| **Aviso legal** | — |
| **Modalidade** | online |
| **Objetivo de conversão** | whatsapp |

---

## PARTE 2 — SERVIÇOS E PRODUTO

### Serviço Principal (foco da campanha)
Mentoria de Adestramento Canino

### Lista de Serviços
Mentoria Individual Online

### Descrição Detalhada
Aulas individuais via Google Meet focadas em ensinar os donos a adestrarem seus cães com técnica e prática, promovendo independência e melhorando o vínculo e a comunicação. Correção de comportamentos como ansiedade por separação e reatividade.

Planos:
- 1x por semana: R$ 697,00
- 2x por semana: R$ 747,00
- 3x por semana: R$ 897,00

### Preço
**Exibir preço:** Sim
**Valor:** A partir de R$ 697,00 (mensal, 1x por semana). Opções de 2x e 3x por semana com valores superiores. Aceita Cartão de Crédito e PIX (com 5% de desconto). Fidelidade mínima de 30 dias, com aviso prévio de 30 dias para cancelamento após o primeiro mês.
**Condição especial:** —
**Oferta especial:** —

---

## PARTE 3 — PÚBLICO-ALVO

### Público Primário — perfil detalhado
Donos de cães que buscam independência no adestramento, desejam melhorar a comunicação e o vínculo com seus pets, e resolver problemas comportamentais específicos (ansiedade por separação, reatividade). Adestradores iniciantes que buscam segurança e efetividade em seus treinos.

### Dor Principal — na voz do cliente
Donos: Dificuldade no manejo, comunicação confusa com o cão, vínculo ruim, ansiedade por separação, reatividade com cães e pessoas.

Adestradores iniciantes: Insegurança técnica sobre como desenvolver treinos efetivos e seguros.

### Resultado Desejado — o "depois"
Donos: Tornarem-se independentes no adestramento, com comunicação clara e vínculo forte com o cão, resolvendo problemas comportamentais.

Adestradores: Desenvolver treinos efetivos e seguros.

### Público Secundário
Não definido

### FAQ — Perguntas Frequentes Reais
Não fornecido

---

## PARTE 4 — COPY E PERSUASÃO

### Diferencial Real
Foco em capacitar o dono a ser o principal professor do cão, mesmo em formato online. Abordagem técnica e prática para independência do tutor. Aulas 100% individuais.

### Frase de Impacto
Leve o adestramento com técnica e prática para que donos se tornem independentes e contatem profissionais apenas para serviços pontuais.

### História / Origem
Não fornecida.

### Casos e Resultados Concretos
Não fornecidos.

---

## PARTE 5 — TOM DE VOZ

| Parâmetro | Valor |
|---|---|
| **Estilo desejado** | Profissional, didático, confiável, empático, focado em resultados e independência. |
| **Sensação do visitante** | Confiança, segurança, esperança de resolver os problemas com seu cão, motivação para aprender e aplicar. |
| **Restrições de conteúdo** | — |

---

## PARTE 6 — DIREÇÃO DE ARTE

### Paleta de Cores Aprovada
| Nome | HEX | Uso |
|---|---|---|
| Azul Profundo | #0A1F3A | Fundo principal, transmitindo seriedade e profissionalismo. |
| Cinza Grafite | #334257 | Textos secundários, ícones e elementos de destaque, mantendo a legibilidade no tema escuro. |
| Azul Elétrico | #007BFF | Chamadas para ação (CTAs), links e elementos de destaque para criar pontos de atenção. |
| Branco Puro | #FFFFFF | Textos principais, títulos e elementos que precisam de alto contraste e clareza. |
| Verde Esperança | #28A745 | Elementos de sucesso, benefícios e validação social, transmitindo otimismo e resultados. |

### Tom Visual
O tom visual será profissional e confiável, utilizando o tema escuro para criar uma atmosfera de expertise e profundidade. A paleta de cores, com tons de azul e contrastes marcantes, reforça a ideia de segurança e clareza. Elementos visuais clean e focados em resultados transmitem a eficácia da mentoria.

### Decisões Criativas
1. Utilizar um gradiente sutil no fundo escuro para adicionar profundidade sem comprometer a legibilidade.
2. Incorporar microinterações sutis em CTAs e elementos clicáveis para aumentar o engajamento.
3. Criar um sistema de ícones clean e minimalista que reforcem os benefícios e características da mentoria.
4. Desenvolver um layout com bom uso de espaço em branco (negativo) para garantir um visual organizado e focado no conteúdo.


---

## PARTE 7 — INTEGRAÇÕES ATIVAS
- [x] whatsapp

---

## PARTE 8 — REGRAS FIXAS ADSGATOR

## STACK TÉCNICA IMUTÁVEL

- Framework: Astro (output: 'hybrid' para suportar endpoint /api/contato)
- CSS: Tailwind CSS — todos os tokens em tailwind.config.js. Zero HEX hardcoded. Zero style="" onde Tailwind resolve.
- Animações de scroll: GSAP + ScrollTrigger em <script> dentro dos .astro — NUNCA em bundle React
- Animações de UI: Framer Motion apenas em islands React (MobileMenu, ContactForm, CookieBanner)
- Scroll suave: Lenis (@studio-freight/lenis) integrado ao GSAP ticker
- Formulários: Web3Forms (FORMS_ACCESS_KEY no .env)
- Analytics: Vercel Analytics (@vercel/analytics) + Vercel Speed Insights (@vercel/speed-insights)
- Deploy: Vercel

## GIT — OBRIGATÓRIO ANTES DE QUALQUER CÓDIGO

git init → git add . → git commit -m "init: projeto Astro base"
.gitignore: node_modules/, dist/, .env
Conectar ao repositório remoto antes do primeiro deploy.

## ARQUIVOS OBRIGATÓRIOS

- public/robots.txt → Allow: / | Disallow: /links, /politica-de-privacidade, /404
- public/manifest.json → name, start_url, display: "standalone", theme_color via token
- .env.example → GTM_ID= | WHATSAPP_NUMBER= | FORMS_ACCESS_KEY= | INSTAGRAM_TOKEN= (se ativo)
- src/pages/404.astro → personalizada com botão voltar + botão WhatsApp
- src/pages/politica-de-privacidade.astro → LGPD completa
- src/pages/links.astro → página de links (excluída do sitemap)

## COMPONENTES GLOBAIS OBRIGATÓRIOS

Layout.astro → SEO, GTM (is:inline), Consent Mode v2, Lenis, GSAP, Analytics, SpeedInsights
Button.astro → props: label, href, variant, trackingId, section | nunca botão inline
SectionHeader.astro → props: label, title, subtitle, align
FeatureCard.astro → props: icon, title, description
TestimonialCard.astro → props: name, role, text, avatar (se depoimentos existirem)

## COMPONENTES REACT (ISLANDS)

MobileMenu.tsx → fullscreen overlay AnimatePresence | focus trap | Escape fecha | overflow:hidden no body
ContactForm.tsx → honeypot | validação inline | ErrorBoundary com fallback WhatsApp | client:visible
CookieBanner.tsx → LGPD + Consent Mode v2 | client:idle | localStorage 'adsgator-consent'

## UX OBRIGATÓRIO

Header → sticky z-50 | esconde ao scroll down (GSAP) | reaparece ao scroll up | backdrop-blur após 80px
WhatsApp flutuante → IntersectionObserver | aparece após Hero sair | some quando footer entra | SVG nativo #25D366 | 56×56px | aria-label="Falar no WhatsApp"
Mobile First → começa em 375px | Hero usa 100svh | texto mínimo 16px | touch targets 44px
Footer → fundo diferente da última seção | logo da marca | logo Adsgator com link adsgator.com.br | ano dinâmico {new Date().getFullYear()}

## COPY — DNA ADSGATOR INEGOCIÁVEL

- H1 espelha a dor real de busca — nunca o nome técnico do serviço
- Copy em primeira pessoa: "Eu atendo...", "Meu método..." — NUNCA "Maria atende..."
- Zero institucional: proibido "inovador", "excelência", "missão", "visão", "comprometidos com", "resultados extraordinários"
- CTAs específicos: nunca "Saiba mais", "Clique aqui", "Entre em contato", "Solicite um orçamento"
- Nunca inventar depoimentos, avaliações ou notas Google

## BLOCOS CONDICIONAIS — REGRAS RÍGIDAS

- Mapa: APENAS se modalidade presencial/híbrida com endereço explicitamente autorizado
- Avaliações Google: APENAS se google_business=sim E nota≥4.5 E avaliações≥10
- Feed Instagram: APENAS se perfil ativo e relevante para o serviço
- Depoimentos: APENAS se depoimentos=sim. Nunca inventar.
- Preços: APENAS se preco_exibir=sim e valores fornecidos

## PERFORMANCE E SEO

- <link rel="preload"> na imagem hero com fetchpriority="high"
- font-display: swap em toda @font-face
- Canonical URL em cada página via prop canonicalUrl
- Schema.org JSON-LD no Layout.astro (LocalBusiness ou Person conforme o nicho)
- Lighthouse Performance ≥ 90 mobile | Accessibility ≥ 90
- og-image 1200×630 presente

## ACESSIBILIDADE MÍNIMA

- WCAG AA em todo texto sobre fundo
- focus-visible em todos os elementos interativos
- Links externos com rel="noopener noreferrer"
- Todas as imagens com alt descritivo, width e height definidos
- prefers-reduced-motion check em todas as animações GSAP
- <h1> único por página


---

## PROMPT DE AUDITORIA

## AUDITORIA PÓS-IMPLEMENTAÇÃO

Faça uma auditoria completa do projeto que você acabou de construir.
Para cada item responda: ✅ implementado | ⚠ parcial (explique) | ❌ não implementado.

### HEADER INTELIGENTE
[ ] Header some suavemente ao scrollar para baixo e reaparece ao scrollar para cima
[ ] Fundo com backdrop-blur ou opacidade após 80px de scroll
[ ] Logo linkada para / (raiz)
[ ] CTA visível no header em desktop
[ ] Versão mobile testada em 375px

### BOTÃO WHATSAPP FLUTUANTE
[ ] Presente em todas as páginas
[ ] Oculto no carregamento — aparece após o Hero sair do viewport (IntersectionObserver)
[ ] Some quando o footer entra no viewport
[ ] Tem aria-label="Falar no WhatsApp"
[ ] Rastreado com data-tracking="click-whatsapp" data-section="floating-button"

### BANNER DE CONSENTIMENTO (LGPD)
[ ] CookieBanner presente e funcional
[ ] Aparece apenas se não houver consentimento registrado
[ ] Botões "Aceitar" e "Recusar" funcionando e registrando escolha
[ ] Google Consent Mode v2 configurado — GTM em modo restrito antes do consentimento
[ ] Não bloqueia o carregamento da página

### ANALYTICS E PERFORMANCE
[ ] Vercel Analytics instalado e ativo
[ ] Vercel Speed Insights instalado e ativo
[ ] Google Tag Manager snippet no <head> E no <body> (via is:inline)
[ ] GTM ID via variável de ambiente — não hardcoded

### GIT E DEPLOY
[ ] Repositório Git inicializado e com pelo menos um commit
[ ] .gitignore cobrindo node_modules, dist, .env
[ ] Variáveis sensíveis em .env — nunca no código
[ ] .env.example entregue com todas as variáveis documentadas
[ ] Deploy configurado na Vercel com CI/CD automático

### DESIGN RESPONSIVO
[ ] Mobile testado em 375px sem overflow horizontal
[ ] Hero ocupa 100svh em mobile
[ ] Touch targets mínimo 44px em todos os elementos clicáveis
[ ] Fonte mínima 16px em mobile
[ ] Backgrounds distintos por seção criam ritmo visual

### FOOTER
[ ] Footer tem identidade visual coerente com a landing page
[ ] Logo da marca presente
[ ] Logo da agência Adsgator com link para adsgator.com.br
[ ] Links: Política de Privacidade + redes sociais confirmadas
[ ] Ano dinâmico: {new Date().getFullYear()}

### ACESSIBILIDADE
[ ] Contraste WCAG AA em todo texto sobre fundo
[ ] focus-visible em todos os elementos interativos
[ ] Links externos com rel="noopener noreferrer"
[ ] Todas as imagens com alt descritivo, width e height
[ ] prefers-reduced-motion check em todas as animações GSAP

### PÁGINAS SECUNDÁRIAS
[ ] /links funcionando
[ ] /politica-de-privacidade acessível via footer
[ ] /404 personalizada com botão voltar e botão WhatsApp
[ ] Sitemap excluindo /links, /politica-de-privacidade, /404
[ ] robots.txt criado

### QUALIDADE TÉCNICA
[ ] Build sem erros (npm run build)
[ ] Zero console.log em produção
[ ] Zero HEX hardcoded — todos via token Tailwind
[ ] Lighthouse Performance ≥ 90 mobile
[ ] Lighthouse Accessibility ≥ 90
[ ] Link do WhatsApp testado com mensagem pré-preenchida
[ ] Schema.org JSON-LD válido
[ ] og-image 1200×630 presente

Para cada ❌ ou ⚠, descreva exatamente o que precisa ser corrigido.

