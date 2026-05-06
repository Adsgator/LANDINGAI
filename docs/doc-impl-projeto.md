## Ficha de Implementação Técnica - Adestramento Canino

Este documento detalha a implementação técnica da landing page para o serviço de Adestramento Canino, seguindo as diretrizes da Adsgator.

---

### 1. Estrutura de Arquivos do Projeto Astro

```
meu-projeto-astro/
├── public/
│   ├── robots.txt
│   ├── manifest.json
│   └── favicon.ico (e outros assets estáticos)
├── src/
│   ├── components/
│   │   ├── global/
│   │   │   ├── Layout.astro
│   │   │   ├── Button.astro
│   │   │   ├── SectionHeader.astro
│   │   │   ├── FeatureCard.astro
│   │   │   └── TestimonialCard.astro
│   │   ├── react/
│   │   │   ├── MobileMenu.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   └── CookieBanner.tsx
│   │   └── ... (outros componentes específicos de seção)
│   ├── pages/
│   │   ├── index.astro             (Página inicial)
│   │   ├── links.astro
│   │   ├── politica-de-privacidade.astro
│   │   └── 404.astro
│   ├── layouts/
│   │   └── BaseLayout.astro        (Layout base para páginas)
│   ├── styles/
│   │   └── globals.css             (Estilos globais, se necessário)
│   ├── utils/
│   │   └── ...                     (Funções utilitárias)
│   └── env.d.ts                    (Declarações de tipo para variáveis de ambiente)
├── astro.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .gitignore
├── .env.example
└── README.md
```

---

### 2. Design System Completo

#### 2.1. Tokens Tailwind (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'primary-dark': '#0A1F3A',     // Azul Profundo
        'secondary-gray': '#334257',  // Cinza Grafite
        'accent-blue': '#007BFF',     // Azul Elétrico
        'text-white': '#FFFFFF',      // Branco Puro
        'success-green': '#28A745',   // Verde Esperança
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Exemplo de fonte, ajuste conforme necessário
      },
      screens: {
        'xs': '375px', // Mobile First
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      height: {
        'screen-svh': '100svh', // Para Hero usar 100svh
      },
    },
  },
  plugins: [],
};
```

#### 2.2. Cores (Mapeadas nos tokens acima)

*   **Azul Profundo (`primary-dark`):** `#0A1F3A` - Fundo principal, transmitindo seriedade e profissionalismo.
*   **Cinza Grafite (`secondary-gray`):** `#334257` - Textos secundários, ícones e elementos de destaque.
*   **Azul Elétrico (`accent-blue`):** `#007BFF` - Chamadas para ação (CTAs), links e elementos de destaque.
*   **Branco Puro (`text-white`):** `#FFFFFF` - Textos principais, títulos e elementos que precisam de alto contraste.
*   **Verde Esperança (`success-green`):** `#28A745` - Elementos de sucesso, benefícios e validação social.

#### 2.3. Tipografia

*   **Família de Fontes:** `Inter` (ou outra fonte escolhida que suporte `font-display: swap`).
*   **Tamanho Mínimo:** 16px em mobile.
*   **Hierarquia Visual:** Definida através de classes Tailwind (`text-xl`, `text-2xl`, `font-bold`, etc.) e uso adequado de `<h1>`, `<h2>`, etc.

---

### 3. Componentes Necessários com Props

#### 3.1. Globais (`src/components/global/`)

*   **`Layout.astro`**:
    *   `title`: Título da página (para `<title>` e meta tags).
    *   `description`: Meta descrição da página.
    *   `canonicalUrl`: URL canônica da página.
    *   `ogImageUrl`: URL da imagem Open Graph.
    *   `schema`: Objeto JSON-LD para Schema.org.
    *   `themeColor`: Cor do tema para manifest.json.
    *   `gtmId`: ID do Google Tag Manager.
    *   `analyticsId`: ID do Vercel Analytics.
    *   `speedInsightsId`: ID do Vercel Speed Insights.

*   **`Button.astro`**:
    *   `label`: Texto do botão.
    *   `href`: URL de destino (se for um link).
    *   `variant`: 'primary', 'secondary', 'outline' (para estilização).
    *   `trackingId`: ID para rastreamento de eventos (ex: `cta-hero-whatsapp`).
    *   `section`: Nome da seção onde o botão se encontra (ex: `hero`, `services`).
    *   `type`: 'button', 'submit', 'reset' (para botões de formulário).

*   **`SectionHeader.astro`**:
    *   `label`: Rótulo complementar (opcional, ex: "Nossos Serviços").
    *   `title`: Título principal da seção.
    *   `subtitle`: Subtítulo ou descrição da seção.
    *   `align`: 'left', 'center', 'right' (para alinhamento do texto).

*   **`FeatureCard.astro`**:
    *   `icon`: Componente SVG ou URL do ícone.
    *   `title`: Título da funcionalidade.
    *   `description`: Descrição da funcionalidade.

*   **`TestimonialCard.astro`**:
    *   `name`: Nome do cliente.
    *   `role`: Cargo ou papel do cliente.
    *   `text`: Texto do depoimento.
    *   `avatar`: URL da imagem do avatar do cliente (opcional).

#### 3.2. React Islands (`src/components/react/`)

*   **`MobileMenu.tsx`**:
    *   Sem props diretas esperadas, controla seu estado internamente.

*   **`ContactForm.tsx`**:
    *   `honeypotFieldName`: Nome do campo honeypot.
    *   `submitButtonLabel`: Rótulo do botão de submit.
    *   `successMessage`: Mensagem a ser exibida após o envio bem-sucedido.
    *   `formId`: ID do formulário (para Web3Forms).

*   **`CookieBanner.tsx`**:
    *   Sem props diretas esperadas, gerencia o consentimento.

#### 3.3. Componentes Específicos de Seção (Exemplos)

*   **`HeroSection.astro`**:
    *   `title`: Título principal do hero.
    *   `subtitle`: Subtítulo ou breve descrição.
    *   `imageUrl`: URL da imagem de fundo/principal.
    *   `ctaButton`: Objeto com `label`, `href`, `trackingId`, `section`.

*   **`ServicesSection.astro`**:
    *   `header`: Objeto com `title`, `subtitle`.
    *   `features`: Array de objetos `{ icon, title, description }` para `FeatureCard`.

*   **`PricingSection.astro`**:
    *   `header`: Objeto com `title`, `subtitle`.
    *   `plans`: Array de objetos representando os planos de serviço (ex: `{ name, price, features, ctaLabel }`).

---

### 4. Copy de Cada Seção

**Nota:** O copy será adaptado para a primeira pessoa ("Eu atendo...") e focado na dor do cliente e nos resultados, evitando jargões institucionais.

#### 4.1. Hero Section

*   **H1:** "Cansado de não ser compreendido pelo seu cão? Transforme a comunicação e o vínculo AGORA."
*   **Subtítulo:** "Aprenda técnicas práticas e eficazes para adestrar seu pet com independência e fortalecer a relação de vocês."
*   **CTA:**
    *   **Botão Principal:** "Quero meu cão mais obediente" (`trackingId: 'cta-hero-whatsapp'`, `section: 'hero'`) - Link para WhatsApp.
    *   **Botão Secundário (Opcional):** "Descubra como funciona" (`trackingId: 'cta-hero-learn-more'`, `section: 'hero'`) - Scroll para seção de serviços.

#### 4.2. Sobre Mim / Meu Método (Seção de Apresentação do Profissional)

*   **H2:** "Eu transformo a relação entre você e seu cão."
*   **Texto:** "Meu método é focado em capacitar você, tutor, a ser o principal professor do seu pet. Através de aulas individuais online, te guio passo a passo, ensinando técnicas práticas que criam independência e segurança no manejo. Diga adeus à ansiedade por separação e à reatividade, e olá a um vínculo inquebrável."
*   **CTA:** "Comece a transformação hoje" (`trackingId: 'cta-about-whatsapp'`, `section: 'about'`) - Link para WhatsApp.

#### 4.3. Serviços / Mentoria

*   **Header:**
    *   **Label:** "O que eu ofereço"
    *   **Title:** "Mentoria de Adestramento Canino Individual"
    *   **Subtitle:** "Aulas 100% online e focadas nas suas necessidades e nos desafios do seu pet."
*   **`FeatureCard` (Exemplos):**
    *   **Ícone:** Ícone de comunicação. **Título:** "Comunicação Clara". **Descrição:** "Ensino você a linguagem do seu cão e como se fazer entender, reduzindo frustrações."
    *   **Ícone:** Ícone de casa/segurança. **Título:** "Independência para o Tutor". **Descrição:** "Seja autônomo no adestramento, resolvendo problemas comportamentais sem depender de terceiros."
    *   **Ícone:** Ícone de vínculo/coração. **Título:** "Vínculo Fortalecido". **Descrição:** "Aprofunde a conexão com seu pet através de técnicas positivas e baseadas em ciência."
    *   **Ícone:** Ícone de câmera/online. **Título:** "Flexibilidade Online". **Descrição:** "Aprenda no conforto da sua casa, com horários flexíveis e acompanhamento personalizado."

#### 4.4. Preços

*   **Header:**
    *   **Title:** "Invista no bem-estar e na harmonia do seu lar."
    *   **Subtitle:** "Planos flexíveis para atender à sua necessidade e aos objetivos do seu pet. Pagamento via Cartão de Crédito ou PIX (com desconto)."
*   **`PricingCard` (Exemplo):**
    *   **Nome do Plano:** "Foco Semanal"
    *   **Preço:** "A partir de R$ 697,00/mês"
    *   **Descrição do Preço:** "(1x por semana)"
    *   **Benefícios:**
        *   "Aulas individuais semanais"
        *   "Técnicas de adestramento positivo"
        *   "Correção de comportamentos específicos"
        *   "Suporte via WhatsApp entre as aulas"
    *   **CTA:** "Quero este plano" (`trackingId: 'cta-pricing-plan1-whatsapp'`, `section: 'pricing'`) - Link para WhatsApp.
*   **Nota:** Adaptar para os planos de 2x e 3x por semana com seus respectivos valores e descrições.

#### 4.5. Depoimentos (Se `depoimentos=sim`)

*   **Header:**
    *   **Title:** "Veja quem já transformou a relação com seus pets."
*   **`TestimonialCard`:**
    *   **Nome:** (Ex: Ana Silva)
    *   **Role:** (Ex: Tutora do Max)
    *   **Text:** (Depoimento real focado na dor resolvida e no resultado)
    *   **Avatar:** (URL da foto)

#### 4.6. CTA Final / Contato

*   **H2:** "Pronto para ter um cão mais feliz e um lar mais harmonioso?"
*   **Texto:** "Não espere mais para construir a relação que você sempre sonhou com seu companheiro. Agende sua primeira mentoria e veja a diferença acontecer."
*   **CTA:** "Falar no WhatsApp e agendar minha mentoria" (`trackingId: 'cta-final-whatsapp'`, `section: 'contact'`) - Link para WhatsApp.

#### 4.7. Formulário de Contato (`ContactForm.tsx`)

*   **Título:** "Fale Comigo"
*   **Subtítulo:** "Envie sua mensagem e vamos conversar sobre como posso te ajudar."
*   **Campos:**
    *   Nome (obrigatório)
    *   E-mail (obrigatório)
    *   Telefone (obrigatório, com DDD)
    *   Mensagem (obrigatório)
*   **Honeypot:** Campo oculto para bots.
*   **Botão de Submit:** "Enviar Mensagem"

#### 4.8. Footer

*   **Logo da Marca:** (Logo do Adestramento Canino)
*   **Texto:** "© {new Date().getFullYear()} [Nome da Marca]. Todos os direitos reservados."
*   **Logo Adsgator:** Logo da Adsgator com link para `https://adsgator.com.br`.
*   **Links:**
    *   "Política de Privacidade" (`href="/politica-de-privacidade"`)

---

### 5. Configurações do .env

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# .env
# Variáveis de ambiente para o projeto Astro

# Google Tag Manager ID
GTM_ID=GTM-XXXXXXX

# Número de WhatsApp (com código do país e DDD, sem espaços ou caracteres especiais)
WHATSAPP_NUMBER=5511999999999

# Web3Forms Access Key
FORMS_ACCESS_KEY=SUA_WEB3FORMS_ACCESS_KEY

# Instagram Token (se ativo) - Não aplicável neste briefing
# INSTAGRAM_TOKEN=SEU_INSTAGRAM_TOKEN

# Vercel Analytics ID (opcional, Vercel pode detectar automaticamente)
# VERCEl_ANALYTICS_ID=

# Vercel Speed Insights ID (opcional, Vercel pode detectar automaticamente)
# VERCEl_SPEED_INSIGHTS_ID=
```

Crie também o arquivo `.env.example` com os mesmos campos, mas sem os valores, para documentar as variáveis necessárias.

---

### 6. Integrações Ativas e Como Configurar

*   **Vercel Analytics & Speed Insights:**
    *   **Configuração:** Ao fazer o deploy na Vercel, essas integrações geralmente são detectadas e ativadas automaticamente. Certifique-se de que seu projeto esteja conectado a um repositório Git na Vercel. Se necessário, você pode configurar explicitamente as variáveis de ambiente `VERCEL_ANALYTICS_ID` e `VERCEL_SPEED_INSIGHTS_ID` no dashboard da Vercel.
    *   **Implementação:** O `Layout.astro` incluirá os scripts necessários.

*   **Google Tag Manager (GTM):**
    *   **Configuração:** Insira o `GTM_ID` obtido do Google Tag Manager no arquivo `.env`.
    *   **Implementação:** O `Layout.astro` incluirá os dois snippets do GTM (no `<head>` e no `<body>`) utilizando `is:inline` para garantir a execução. O Consent Mode v2 será configurado para que o GTM opere em modo restrito até o consentimento do usuário.

*   **WhatsApp:**
    *   **Configuração:** Insira o número de WhatsApp no formato `5511999999999` no arquivo `.env` (`WHATSAPP_NUMBER`).
    *   **Implementação:** Os botões de CTA (`Button.astro`) que levam ao WhatsApp usarão este número para construir o link `https://wa.me/${WHATSAPP_NUMBER}?text=Eu%20quero%20saber%20mais%20sobre%20a%20mentoria!`. A mensagem pré-preenchida será adaptada para cada CTA.

*   **Web3Forms:**
    *   **Configuração:** Obtenha sua `FORMS_ACCESS_KEY` no painel do Web3Forms e insira-a no arquivo `.env`.
    *   **Implementação:** O componente `ContactForm.tsx` será configurado para enviar os dados para o Web3Forms usando a `FORMS_ACCESS_KEY` e o `formId` especificado.

*   **Lenis + GSAP:**
    *   **Configuração:** Instale as dependências: `npm install @studio-freight/lenis gsap`.
    *   **Implementação:** O `Layout.astro` inicializará o Lenis e o integrará ao ticker do GSAP. Animações de scroll serão implementadas dentro de scripts em componentes `.astro`.

*   **Framer Motion:**
    *   **Configuração:** Instale a dependência: `npm install framer-motion`.
    *   **Implementação:** Utilizado exclusivamente nos componentes React (`MobileMenu`, `ContactForm`, `CookieBanner`) para animações de UI.

---

### 7. Instruções de Deploy na Vercel

1.  **Crie uma conta na Vercel** ou faça login se já possuir.
2.  **Conecte seu repositório Git** (GitHub, GitLab, Bitbucket) à Vercel.
3.  **Importe o Projeto:** Clique em "Add New..." -> "Project". Selecione o repositório onde o projeto Astro foi hospedado.
4.  **Configure o Projeto:**
    *   **Framework Preset:** Vercel geralmente detectará automaticamente Astro.
    *   **Root Directory:** Deixe como está se o projeto estiver na raiz do repositório, ou especifique o caminho se estiver em um subdiretório.
    *   **Build and Output Settings:**
        *   **Build Command:** `npm run build` (ou `yarn build`)
        *   **Output Directory:** `dist` (padrão do Astro)
    *   **Environment Variables:** Adicione todas as variáveis definidas no arquivo `.env` (GTM\_ID, WHATSAPP\_NUMBER, FORMS\_ACCESS\_KEY, etc.). **Nunca adicione o arquivo `.env` diretamente ao repositório.** Use o `.env.example` como guia.
5.  **Deploy:** Clique em "Deploy". A Vercel criará um ambiente de preview para cada commit e configurará o CI/CD automaticamente.

---

### 8. Auditoria Pós-Implementação

Esta seção será preenchida após a conclusão da implementação para verificar a conformidade com os requisitos.

#### HEADER INTELIGENTE
[ ] Header some suavemente ao scrollar para baixo e reaparece ao scrollar para cima
[ ] Fundo com backdrop-blur ou opacidade após 80px de scroll
[ ] Logo linkada para / (raiz)
[ ] CTA visível no header em desktop
[ ] Versão mobile testada em 375px

#### BOTÃO WHATSAPP FLUTUANTE
[ ] Presente em todas as páginas
[ ] Oculto no carregamento — aparece após o Hero sair do viewport (IntersectionObserver)
[ ] Some quando o footer entra no viewport
[ ] Tem aria-label="Falar no WhatsApp"
[ ] Rastreado com data-tracking="click-whatsapp" data-section="floating-button"

#### BANNER DE CONSENTIMENTO (LGPD)
[ ] CookieBanner presente e funcional
[ ] Aparece apenas se não houver consentimento registrado
[ ] Botões "Aceitar" e "Recusar" funcionando e registrando escolha
[ ] Google Consent Mode v2 configurado — GTM em modo restrito antes do consentimento
[ ] Não bloqueia o carregamento da página

#### ANALYTICS E PERFORMANCE
[ ] Vercel Analytics instalado e ativo
[ ] Vercel Speed Insights instalado e ativo
[ ] Google Tag Manager snippet no <head> E no <body> (via is:inline)
[ ] GTM ID via variável de ambiente — não hardcoded

#### GIT E DEPLOY
[ ] Repositório Git inicializado e com pelo menos um commit
[ ] .gitignore cobrindo node_modules, dist, .env
[ ] Variáveis sensíveis em .env — nunca no código
[ ] .env.example entregue com todas as variáveis documentadas
[ ] Deploy configurado na Vercel com CI/CD automático

#### DESIGN RESPONSIVO
[ ] Mobile testado em 375px sem overflow horizontal
[ ] Hero ocupa 100svh em mobile
[ ] Touch targets mínimo 44px em todos os elementos clicáveis
[ ] Fonte mínima 16px em mobile
[ ] Backgrounds distintos por seção criam ritmo visual

#### FOOTER
[ ] Footer tem identidade visual coerente com a landing page
[ ] Logo da marca presente
[ ] Logo da agência Adsgator com link para adsgator.com.br
[ ] Links: Política de Privacidade + redes sociais confirmadas
[ ] Ano dinâmico: {new Date().getFullYear()}

#### ACESSIBILIDADE
[ ] Contraste WCAG AA em todo texto sobre fundo
[ ] focus-visible em todos os elementos interativos
[ ] Links externos com rel="noopener noreferrer"
[ ] Todas as imagens com alt descritivo, width e height
[ ] prefers-reduced-motion check em todas as animações GSAP

#### PÁGINAS SECUNDÁRIAS
[ ] /links funcionando
[ ] /politica-de-privacidade acessível via footer
[ ] /404 personalizada com botão voltar e botão WhatsApp
[ ] Sitemap excluindo /links, /politica-de-privacidade, /404
[ ] robots.txt criado

#### QUALIDADE TÉCNICA
[ ] Build sem erros (npm run build)
[ ] Zero console.log em produção
[ ] Zero HEX hardcoded — todos via token Tailwind
[ ] Lighthouse Performance ≥ 90 mobile
[ ] Lighthouse Accessibility ≥ 90
[ ] Link do WhatsApp testado com mensagem pré-preenchida
[ ] Schema.org JSON-LD válido
[ ] og-image 1200×630 presente

---