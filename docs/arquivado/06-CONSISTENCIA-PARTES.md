# IMPLEMENTAÇÃO 06 — Consistência entre as 4 Partes
## Validar que imports, nomes, estrutura são coesos

**Arquivo alvo:** `assets/js/04-handlers.js`  
**Risco:** MÉDIO  
**Depende de:** ETAPA 2-3

---

## O QUE MUDA

1. `buildImplPromptParte2()` — adiciona regra de consistência
2. `buildImplPromptParte3()` — referencia nomes definidos na PARTE 1
3. `buildImplPromptParte4()` — importa exatamente as estruturas das partes anteriores

---

## PARTE A — Atualizar `buildImplPromptParte2()`

Procure por `buildImplPromptParte2()` em `04-handlers.js` (linha ~6450 aprox):

```javascript
buildImplPromptParte2() {
  return `...`;
},
```

**Substituir completamente por:**

```javascript
buildImplPromptParte2() {
  const B = this.B || {};
  const estruturaAprovada = B.estrutura_aprovada || B.estrutura_rascunho || '';

  return `
Você é um Full-Stack Developer Senior especializado em Astro + Tailwind CSS.

## CONTEXTO

Esta é a PARTE 2 de 4 — você está gerando o Layout Base e componentes de UI reutilizáveis.

VOCÊ JÁ TEM:
- PARTE 1 foi gerada com .clinerules, .gitignore, .rooignore
- Estrutura de pastas definida em PARTE 1

SUA TAREFA AGORA:
Gerar Layout base e componentes UI que serão usados pelas seções (PARTE 3).

---

## ESTRUTURA APROVADA (REFERÊNCIA)

${estruturaAprovada}

---

## REGRA DE CONSISTÊNCIA — CRÍTICA

Você DEVE importar exatamente estas estruturas definidas na PARTE 1:

✓ Pasta \`src/layouts/\` contém \`Layout.astro\`
✓ Pasta \`src/components/ui/\` contém componentes reutilizáveis
✓ Pasta \`src/components/sections/\` será usada na PARTE 3
✓ Pasta \`src/pages/\` contém \`index.astro\` que vai importar sections
✓ Pasta \`src/styles/\` contém globals.css, animations.css, components.css
✓ Pasta \`src/scripts/\` contém gsap.ts, animations.ts, utils.ts

---

## O QUE GERAR

### Arquivo 1: src/layouts/Layout.astro

Layout base que:
- [ ] Importa Layout como componente Astro
- [ ] Contém \`<header>\`, \`<main>\`, \`<footer>\`
- [ ] Define variáveis CSS globais (:root)
- [ ] Importa fontes do Google (DM Sans, DM Mono, Syne)
- [ ] Importa estilos globais
- [ ] Renderiza \`<slot />\` no main
- [ ] Inclui scripts de GSAP e analytics

Exemplo estrutura:

\`\`\`astro
---
// src/layouts/Layout.astro
import Header from '../components/ui/Header.astro';
import Footer from '../components/ui/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content={description}>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:wght@400;500&family=Syne:wght@400..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles/globals.css">
</head>
<body>
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
  <script src="/scripts/gsap.ts"></script>
</body>
</html>

<style>
  /* Estilos globais */
</style>
\`\`\`

### Arquivo 2: src/components/ui/Button.astro

Botão reutilizável que:
- [ ] Aceita props: text, href, variant (primary/secondary), size (sm/md/lg)
- [ ] Usa classes Tailwind CSS
- [ ] Suporta <a> e <button>
- [ ] Acessível (aria-labels, focus states)

\`\`\`astro
---
// src/components/ui/Button.astro
interface Props {
  text: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const { text, href, variant = 'primary', size = 'md', class: className } = Astro.props;

const baseClass = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200';
const variants = {
  primary: 'bg-emerald-500 text-white hover:bg-emerald-600',
  secondary: 'bg-slate-700 text-white hover:bg-slate-800',
  ghost: 'bg-transparent text-white border border-slate-600 hover:border-slate-400',
};
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

const classes = \`\${baseClass} \${variants[variant]} \${sizes[size]} \${className || ''}\`;
---

{href ? (
  <a href={href} class={classes}>{text}</a>
) : (
  <button class={classes}>{text}</button>
)}
\`\`\`

### Arquivo 3: src/components/ui/Card.astro

Card reutilizável:
- [ ] Aceita props: title, description, image, icon, cta
- [ ] Flexível para seções, testimonials, pricing, etc
- [ ] Responsive design

### Arquivo 4: src/components/ui/Header.astro

Header/Nav que:
- [ ] Logo + navegação + CTA
- [ ] Sticky no topo
- [ ] Menu mobile responsivo
- [ ] Links internos para cada seção

### Arquivo 5: src/components/ui/Footer.astro

Footer que:
- [ ] Links de navegação
- [ ] Social links
- [ ] Copyright
- [ ] Newsletter signup (opcional)

### Arquivo 6: src/styles/globals.css

CSS global que:
- [ ] Define \`:root\` com variáveis CSS
- [ ] Reset CSS padrão
- [ ] Tipografia base
- [ ] Dark mode padrão

### Arquivo 7: src/styles/components.css

Estilos dos componentes UI:
- [ ] .button, .card, .header, .footer
- [ ] Estados hover, active, focus
- [ ] Responsive design

### Arquivo 8: src/scripts/gsap.ts

Setup GSAP que:
- [ ] Importa GSAP e ScrollTrigger
- [ ] Registra o plugin
- [ ] Define easing defaults
- [ ] Pronto para ser usado nas seções

---

## CHECKLIST — Antes de responder

Quando gerar estes arquivos:

1. [ ] Cada arquivo tem \`.astro\` ou \`.ts\` ou \`.css\` correto
2. [ ] Imports estão corretos (paths relativos funcionam)
3. [ ] Nomes de componentes são PascalCase (Button, Card, Header)
4. [ ] Classes Tailwind CSS usadas (não inline styles)
5. [ ] Props bem definidas (interfaces TypeScript)
6. [ ] Sem código duplicado
7. [ ] Pronto para PARTE 3 importar estes componentes

---

## RESPONDA COM

Por favor, responda com APENAS os 8 arquivos acima:

- src/layouts/Layout.astro
- src/components/ui/Button.astro
- src/components/ui/Card.astro
- src/components/ui/Header.astro
- src/components/ui/Footer.astro
- src/styles/globals.css
- src/styles/components.css
- src/scripts/gsap.ts

Cada arquivo deve ser completo e pronto para usar.
Nada de placeholders ou TODO.

\`.trim();
},
```

---

## PARTE B — Atualizar `buildImplPromptParte3()`

Procure por `buildImplPromptParte3()`:

```javascript
buildImplPromptParte3() {
  return `...`;
},
```

**Substituir completamente por:**

```javascript
buildImplPromptParte3() {
  const B = this.B || {};
  const estruturaAprovada = B.estrutura_aprovada || B.estrutura_rascunho || '';

  return `
Você é um Frontend Developer Senior especializado em Astro + Tailwind CSS + GSAP.

## CONTEXTO

Esta é a PARTE 3 de 4 — você está gerando as SEÇÕES da landing page.

VOCÊ JÁ TEM:
- PARTE 1: Config + estrutura de pastas + .clinerules
- PARTE 2: Layout base + componentes UI (Button, Card, Header, Footer)

AGORA:
Você vai gerar as seções específicas da landing page baseado na estrutura aprovada.

---

## ESTRUTURA APROVADA

${estruturaAprovada}

---

## REGRA DE CONSISTÊNCIA — CRÍTICA

Você DEVE:

1. [ ] Importar \`Layout\` de \`../../layouts/Layout.astro\`
2. [ ] Importar componentes UI de \`../ui/\` (Button, Card, etc)
3. [ ] Importar \`Layout\` como Layout para componentes
4. [ ] Usar APENAS classes Tailwind CSS (não inline styles)
5. [ ] Importar GSAP animations de \`../../scripts/animations.ts\`
6. [ ] Cada seção é um componente .astro independente
7. [ ] Props bem tipadas (interface Props)
8. [ ] ScrollTrigger para animations ao scroll

---

## LISTA DE SEÇÕES A GERAR

Baseado na estrutura aprovada acima, gere EXATAMENTE:

1. **Hero** — Impacto inicial (SEMPRE primeira seção não-header)
   - Título (H1)
   - Subtítulo
   - CTA primário
   - Background image/video (opcional)

2. **[Seções da Estrutura]** — Conforme blocos 3-N da estrutura aprovada
   - Cada bloco = 1 seção
   - Nome do arquivo: PascalCase (Hero.astro, Features.astro, Pricing.astro, etc)
   - Cada seção é independente e reutilizável

3. **CTA Final** — Chamada à ação antes do footer (SEMPRE antes do footer)
   - Texto
   - Botão principal
   - Fundo com contraste

---

## ESTRUTURA DE CADA SEÇÃO

Todas devem seguir este padrão:

\`\`\`astro
---
// src/components/sections/[Nome].astro
import Button from '../ui/Button.astro';
import { setupScrollAnimation } from '../../scripts/animations';

interface Props {
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_href?: string;
  image?: string;
  variant?: 'light' | 'dark';
}

const { 
  title, 
  subtitle, 
  cta_text, 
  cta_href = '#contato',
  image,
  variant = 'dark'
} = Astro.props;
---

<section class={\`section section--\${variant}\`} id="secao-id">
  <div class="container">
    <div class="section-content">
      <h2>{title}</h2>
      {subtitle && <p class="subtitle">{subtitle}</p>}
      {cta_text && <Button text={cta_text} href={cta_href} />}
    </div>
    {image && <img src={image} alt={title} />}
  </div>
</section>

<style>
  .section {
    padding: var(--spacing-2xl);
    min-height: 500px;
    display: flex;
    align-items: center;
  }
  
  .section--dark {
    background: #0f172a;
    color: #f1f5f9;
  }
  
  .section--light {
    background: #f1f5f9;
    color: #0f172a;
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-2xl);
    align-items: center;
  }

  @media (max-width: 768px) {
    .container {
      grid-template-columns: 1fr;
    }
  }

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--spacing-lg);
    line-height: 1.2;
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
  }
\`\`\`

---

## IMPORTS OBRIGATÓRIOS

Em cada seção, importar:

\`\`\`astro
---
import Button from '../ui/Button.astro';
import Card from '../ui/Card.astro';
// etc
---
\`\`\`

Nunca importar HTML inline — sempre usar componentes.

---

## ANIMAÇÕES OBRIGATÓRIAS

Cada seção deve ter:

1. Fade-in ao scroll (ScrollTrigger)
2. Stagger dos elementos filhos (opcional)
3. Hover effects nos botões e cards

Exemplo:

\`\`\`astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.to('.section-content', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    scrollTrigger: {
      trigger: '.section-content',
      start: 'top 80%',
      end: 'top 20%',
      scrub: false,
    }
  });
</script>
\`\`\`

---

## RESPONSIVIDADE — OBRIGATÓRIA

Cada seção deve:
- [ ] Funcionar em 375px (mobile)
- [ ] Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- [ ] Typography scales: title maior em desktop, menor em mobile
- [ ] Grid/flex muda conforme breakpoint

---

## RESPONDA COM

Gere TODAS as seções baseado na estrutura aprovada:

1. src/components/sections/Hero.astro
2. src/components/sections/[Bloco2].astro
3. src/components/sections/[Bloco3].astro
4. ... (conforme estrutura)
5. src/components/sections/CTA.astro

Cada arquivo completo, sem placeholders.

\`.trim();
},
```

---

## PARTE C — Atualizar `buildImplPromptParte4()`

Procure por `buildImplPromptParte4()`:

```javascript
buildImplPromptParte4() {
  return `...`;
},
```

**Substituir completamente por:**

```javascript
buildImplPromptParte4() {
  const B = this.B || {};
  const stack = B.tech_stack || 'Astro, Tailwind CSS, GSAP, Vercel';

  return `
Você é um Full-Stack Developer Senior especializado em Astro + Deploy.

## CONTEXTO

Esta é a PARTE 4 de 4 — FINAL — você está gerando:
1. Integração da homepage (index.astro)
2. Configurações finais
3. Deploy setup

VOCÊ JÁ TEM:
- PARTE 1: Config + pastas + .clinerules
- PARTE 2: Layout + componentes UI
- PARTE 3: Todas as seções (Hero, Features, Pricing, etc)

AGORA:
Você vai gerar a homepage que importa TUDO e define o setup final.

---

## STACK CONFIRMADO

${stack}

---

## REGRA DE CONSISTÊNCIA — CRÍTICA

Você DEVE:

1. [ ] Importar \`Layout\` de \`../layouts/Layout.astro\`
2. [ ] Importar TODAS as seções de \`../components/sections/\`
3. [ ] Ordem das seções: Header → Hero → [seções] → CTA → Footer
4. [ ] Props passadas para cada seção com dados reais
5. [ ] Nenhuma seção pode quebrar imports
6. [ ] astro.config.mjs bate com PARTE 1

---

## O QUE GERAR

### Arquivo 1: src/pages/index.astro

Homepage principal que:
- [ ] Importa Layout de layouts/
- [ ] Importa TODAS as seções de components/sections/
- [ ] Renderiza em ordem: Header → Hero → seções → CTA → Footer
- [ ] Props são passadas corretamente
- [ ] Sem erros de import

Exemplo estrutura:

\`\`\`astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
import Hero from '../components/sections/Hero.astro';
import Features from '../components/sections/Features.astro';
import Pricing from '../components/sections/Pricing.astro';
import CTA from '../components/sections/CTA.astro';

const pageTitle = 'Landing Page - Astro';
const pageDescription = 'Descrição da página';
---

<Layout title={pageTitle} description={pageDescription}>
  <Hero 
    title="Título principal"
    subtitle="Subtítulo explicativo"
    cta_text="Começar agora"
    cta_href="#contato"
    image="/images/hero.jpg"
  />
  
  <Features 
    title="Nossos diferenciais"
    items={[
      { icon: 'zap', text: 'Diferencial 1' },
      { icon: 'shield', text: 'Diferencial 2' },
      { icon: 'star', text: 'Diferencial 3' },
    ]}
  />
  
  <Pricing 
    title="Nossos planos"
    plans={[
      { name: 'Básico', price: '99', features: [...] },
      { name: 'Pro', price: '199', features: [...] },
      { name: 'Premium', price: '299', features: [...] },
    ]}
  />
  
  <CTA 
    title="Pronto para começar?"
    subtitle="Junte-se a centenas de clientes satisfeitos"
    cta_text="Agendar demo"
    cta_href="#contato"
  />
</Layout>
\`\`\`

### Arquivo 2: astro.config.mjs

Configuração Astro que:
- [ ] Output: 'hybrid' para SSR
- [ ] Integrations: Tailwind, React (se necessário)
- [ ] Deploy target: Vercel
- [ ] compressHTML: true
- [ ] Sem erros de sintaxe

\`\`\`javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'hybrid',
  integrations: [
    tailwind(),
  ],
  vite: {
    ssr: {
      external: ['gsap']
    }
  },
  compressHTML: true,
  image: {
    domains: ['images.unsplash.com'],
  },
});
\`\`\`

### Arquivo 3: package.json

Package.json que:
- [ ] Scripts: dev, build, preview
- [ ] Dependências: astro, @astrojs/tailwind, gsap, etc
- [ ] DevDependencies: typescript, tailwindcss, etc
- [ ] Node version: >=18

\`\`\`json
{
  "name": "landing-page",
  "version": "1.0.0",
  "description": "Landing page gerada com Astro",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/tailwind": "^0.4.0",
    "gsap": "^3.12.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
\`\`\`

### Arquivo 4: tsconfig.json

TypeScript config que:
- [ ] Target: ES2020
- [ ] Strict mode: true
- [ ] Paths configurados

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
\`\`\`

### Arquivo 5: public/.gitkeep

Arquivo vazio para manter a pasta public no git.

### Arquivo 6: README.md

Documentação que:
- [ ] Instruções de instalação
- [ ] Como rodar dev
- [ ] Como fazer build
- [ ] Deploy instructions
- [ ] Estrutura de pastas
- [ ] Stack usado

---

## VERIFICAÇÃO FINAL

Antes de responder, garantir:

1. [ ] Arquivo index.astro importa TODAS as seções de PARTE 3
2. [ ] Nenhum import quebrado
3. [ ] astro.config.mjs está correto
4. [ ] package.json lista todas as dependências
5. [ ] tsconfig.json está configurado
6. [ ] Build passaria sem erros: \`npm run build\`
7. [ ] Dev server rodaria: \`npm run dev\`

---

## RESPONDA COM

Apenas os 6 arquivos:

1. src/pages/index.astro (completo, com todas as seções)
2. astro.config.mjs (configuração final)
3. package.json (com todas as deps)
4. tsconfig.json (config TypeScript)
5. public/.gitkeep
6. README.md (documentação completa)

Sem placeholders, pronto para npm install + npm run dev.

\`.trim();
},
```

---

## CHECKLIST DE CONSISTÊNCIA

Após implementar, testar:

- [ ] PARTE 2 imports funcionam na PARTE 3
- [ ] PARTE 3 sections importam TUDO de PARTE 2
- [ ] PARTE 4 index.astro importa TODAS as seções de PARTE 3
- [ ] Nenhum arquivo referencia paths incorretos
- [ ] Nenhuma seção está duplicada
- [ ] astro.config.mjs bate com package.json
- [ ] tsconfig.json está correto
- [ ] Build completo: \`npm install && npm run build\` sem erros

---

## TESTE PRÁTICO

1. Gere as 4 partes
2. Faça unzip/extraia todos os arquivos em uma pasta
3. Rode \`npm install\`
4. Rode \`npm run build\`
5. Não deve haver erros de import
6. Todos os 3 arquivos de config devem aparecer (.clinerules, .gitignore, .rooignore)

Se passar, consistência está ok! ✅

---

## RESULTADO

✅ 4 partes são coesas e funcionam juntas  
✅ Imports não quebram  
✅ Estrutura é modular e extensível  
✅ Código está pronto para deploy

Próxima etapa: **ETAPA 6 — Validações Mínimas**
