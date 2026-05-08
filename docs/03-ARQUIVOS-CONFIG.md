# IMPLEMENTAÇÃO 03 — Arquivos de Configuração na PARTE 1
## Gerar .clinerules + .gitignore + .rooignore

**Arquivo alvo:** `assets/js/04-handlers.js`  
**Risco:** MÉDIO  
**Depende de:** ETAPA 1 (já implementada)

---

## O QUE MUDA

1. `buildImplPromptParte1()` — adiciona instrução para gerar 3 arquivos de config
2. `formatarDocImpl()` — parse dos 4 arquivos de config + PARTE 1 do prompt

---

## PARTE A — Localizar `buildImplPromptParte1()` em `04-handlers.js`

Procure por (linha ~6417):

```javascript
buildImplPromptParte1() {
  return `...`;
},
```

### SUBSTITUIR COMPLETAMENTE por:

```javascript
buildImplPromptParte1() {
  const B = this.B || {};
  const estruturaAprovada = B.estrutura_aprovada || B.estrutura_rascunho || '';

  return `
Você é um Full-Stack Developer Senior especializado em Astro + Tailwind CSS.

## CONTEXTO

Você está recebendo a Estrutura da Landing Page aprovada para implementação.
Esta é a PARTE 1 de 4 — você está gerando arquivos de configuração e estrutura.

---

## ESTRUTURA APROVADA

${estruturaAprovada}

---

## TAREFA — GERAR 4 ARQUIVOS

Você vai gerar exatamente os 4 arquivos abaixo. Responda APENAS com esses 4 arquivos, nada mais.

---

## ARQUIVO 1: \`.clinerules\`

Este arquivo contém as regras de desenvolvimento que devem ser seguidas em toda a implementação.

\`\`\`clinerules
# ============================================================
# .clinerules — LandingAI Project Rules
# ============================================================
# Versão: 1.0
# Última atualização: 2026-05-07
# ============================================================

## 1. ESTRUTURA DE PASTAS — OBRIGATÓRIA

src/
├── layouts/
│   └── Layout.astro           # Layout base (header, footer, scripts globais)
├── components/
│   ├── sections/              # Seções da LP (Hero, Features, Pricing, etc)
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── Pricing.astro
│   │   ├── Testimonials.astro
│   │   ├── FAQ.astro
│   │   ├── CTA.astro
│   │   └── [outros blocos conforme estrutura]
│   └── ui/                    # Componentes reutilizáveis
│       ├── Button.astro
│       ├── Card.astro
│       ├── Modal.astro
│       └── [outros]
├── pages/
│   └── index.astro            # Homepage (importa Layout + sections)
├── styles/
│   ├── globals.css            # Reset + variables CSS
│   ├── animations.css         # GSAP animations
│   └── components.css         # Estilos dos componentes
└── scripts/
    ├── gsap.ts               # GSAP + ScrollTrigger setup
    ├── animations.ts         # Funções de animação
    └── utils.ts              # Helpers

public/
├── fonts/                     # Web fonts
├── images/                    # Imagens estáticas
└── videos/                    # Videos (se houver)

## 2. ARQUIVOS PROTEGIDOS — NÃO ALTERAR

- tsconfig.json               # Não mudar compilação TypeScript
- package.json                # Não adicionar dependências não autorizadas
- astro.config.mjs           # Config do Astro — apenas ajustes de env vars se necessário
- public/               # Apenas adicionar assets, não remover existentes
- .env.example          # Exemplo de variáveis — não alterar nomes

## 3. IMPORTS OBRIGATÓRIOS EM ASTRO

Toda seção deve seguir este padrão:

\`\`\`astro
---
// src/components/sections/Hero.astro
import Layout from '../../layouts/Layout.astro';
import Button from '../ui/Button.astro';

interface Props {
  title: string;
  subtitle: string;
  cta_text: string;
  image?: string;
}

const { title, subtitle, cta_text, image } = Astro.props;
---

<section class="hero">
  <div class="hero-content">
    <h1>{title}</h1>
    <p>{subtitle}</p>
    <Button text={cta_text} href="#contato" />
  </div>
  {image && <img src={image} alt="Hero" />}
</section>

<style>
  .hero {
    /* estilos aqui */
  }
</style>
\`\`\`

## 4. VARIÁVEIS CSS GLOBAIS — OBRIGATÓRIAS

Em \`src/styles/globals.css\`, definir:

\`\`\`css
:root {
  /* Cores */
  --color-primary: #00e5a0;
  --color-secondary: #a78bfa;
  --color-accent: #f59e0b;
  --color-bg: #0f172a;
  --color-bg-light: #1e293b;
  --color-text: #f1f5f9;
  --color-text-dim: #94a3b8;
  --color-border: #334155;

  /* Tipografia */
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', monospace;
  --font-serif: 'Syne', serif;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 4rem;

  /* Breakpoints */
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}
\`\`\`

## 5. GSAP + ANIMAÇÕES

- Importar GSAP em \`src/scripts/gsap.ts\`
- Usar \`gsap.registerPlugin(ScrollTrigger)\`
- NUNCA importar inline — sempre centralizar em \`gsap.ts\`
- ScrollTrigger debe ser usado para scroll-triggered animations

## 6. TAILWIND CSS — OBRIGATÓRIO

- Usar Tailwind core utilities (ex: \`flex, gap-4, text-xl\`)
- NÃO usar \`@apply\` — usar classes direto no HTML
- Breakpoints: \`sm:, md:, lg:, xl:\`
- Dark mode: prefixar com \`dark:\`
- Exemplo: \`<div class="flex gap-4 md:gap-8 dark:bg-slate-800">\`

## 7. PERFORMANCE — OBRIGATÓRIO

- Usar \`<Image />\` do Astro para imagens (lazy loading automático)
- Comprimir imagens antes de commitar (ImageOptim, TinyPNG)
- Remover CSS não utilizado
- Usar code-splitting: componentes dinâmicos com \`client:lazy\`
- PageSpeed Insights alvo: > 90

## 8. ACESSIBILIDADE — OBRIGATÓRIO

- Semântica HTML: \`<header>, <main>, <section>, <footer>\`
- \`alt\` em todas as imagens
- \`aria-labels\` em botões sem texto
- Contraste de cores: mínimo AA (WCAG)
- Teste com screen readers (NVDA, JAWS)

## 9. SEO — OBRIGATÓRIO

- \`<title>\` e \`<meta description>\` em cada página
- \`<meta og:*>\` para redes sociais
- \`<meta robots>\` para indexação
- Estrutura de headings: 1 H1 por página
- Sitemap.xml + robots.txt

## 10. DEPLOYMENT — VERCEL OU NETLIFY

- Arquivo \`.vercelignore\` ou \`.netlify\` configurado
- Variáveis de ambiente carregadas via CI/CD
- Build command: \`npm run build\`
- Output: \`dist/\`

## 11. NOMENCLATURA — OBRIGATÓRIA

- Arquivos Astro: PascalCase (Hero.astro, Features.astro)
- Arquivos CSS/JS: kebab-case (hero-section.css, gsap-setup.js)
- Classes CSS: kebab-case (.hero-section, .cta-button)
- IDs HTML: camelCase (#ctaButton, #heroSection)
- Variáveis JS: camelCase (const heroTitle, let isAnimating)

## 12. GIT — OBRIGATÓRIO

- Commits em PT-BR: "feat: Hero section" "fix: animation timing"
- Branches: feature/nome, bugfix/nome
- Não commitar: node_modules/, dist/, .env, .DS_Store
- Usar .gitignore (abaixo)

## 13. TESTES — SE NECESSÁRIO

- Unit tests: Vitest
- E2E tests: Playwright
- Coverage mínimo: 70%

## 14. DOCUMENTAÇÃO — OBRIGATÓRIA

- README.md: Como rodar, instalar deps
- CHANGELOG.md: Histórico de versões
- Comentários em funções complexas (não em código óbvio)

## 15. FINAL — CHECKLIST

Antes de fazer commit:
- [ ] Código segue todas as regras acima
- [ ] Nenhum erro de console
- [ ] Responsivo em mobile (375px+)
- [ ] Acessibilidade OK (alt em imgs, aria labels)
- [ ] Performance OK (> 90 Lighthouse)
- [ ] Build passa sem warnings: \`npm run build\`
- [ ] Testei em Chrome, Firefox, Safari
\`\`\`

---

## ARQUIVO 2: \`.gitignore\`

\`\`\`gitignore
# ============================================================
# LandingAI — .gitignore
# ============================================================

# ── Dependências ──────────────────────────────────────────
node_modules/
.npm/
yarn.lock
package-lock.json

# ── Ambiente ──────────────────────────────────────────────
.env
.env.*
!.env.example
.env.local
.env.*.local

# ── Build ──────────────────────────────────────────────────
dist/
build/
.astro/
*.generated.*

# ── Cache ──────────────────────────────────────────────────
.cache
*.cache
.next
.turbo
turbo.json

# ── Logs ──────────────────────────────────────────────────
*.log
logs/
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*

# ── IDE ────────────────────────────────────────────────────
.vscode/
!.vscode/settings.json
!.vscode/extensions.json
.idea/
*.sublime-project
*.sublime-workspace
.DS_Store
Thumbs.db

# ── OS ──────────────────────────────────────────────────────
.DS_Store
.AppleDouble
.LSOverride
*.swp
*~
._.DS_Store

# ── Scratch & Debug ────────────────────────────────────────
scratch/
dump_*
debug_*
test_outputs/
*.tmp

# ── Deploy ─────────────────────────────────────────────────
.vercel/
.netlify/
.firebase/

# ── AI Assistants ──────────────────────────────────────────
.cursor/
.aider*
.github/copilot-instructions.md

# ── Node & Package Managers ────────────────────────────────
.pnpm-store/
.yarn/cache/
.yarn/unplugged/
.eslintcache

# ── TypeScript ─────────────────────────────────────────────
dist/
*.tsbuildinfo

# ── Vitest & Testing ──────────────────────────────────────
coverage/
.nyc_output/

# ── Secrets & Sensitive ────────────────────────────────────
*.pem
*.key
*.cert
.htpasswd

# ── Project Specific ──────────────────────────────────────
output/
generated/
\`\`\`

---

## ARQUIVO 3: \`.rooignore\`

\`\`\`
# ============================================================
# .rooignore — Arquivo de Padrões para Roo Code
# ============================================================
# Roo Code deve IGNORAR estes arquivos/pastas
# Não alterar, deletar, ou sobrescrever

# ── Arquivos Críticos de Config ────────────────────────
package.json
package-lock.json
tsconfig.json
astro.config.mjs
.clinerules
.gitignore
.rooignore

# ── Arquivos de Deploy ────────────────────────────────
.vercel/
.netlify/
.env*

# ── Diretórios Críticos ───────────────────────────────
node_modules/
dist/
.astro/
.cache/

# ── Dependências ──────────────────────────────────────
public/fonts/
public/vendor/

# ── IDE & Editor ──────────────────────────────────────
.vscode/
.idea/
.cursor/

# ── Sistema ───────────────────────────────────────────
.DS_Store
.git/
.github/

# ── Layout Base (Não modificar) ───────────────────────
src/layouts/Layout.astro

# ── Página Index (Apenas adicionar components) ────────
src/pages/index.astro

# ── Pasta de Public (Apenas adicionar assets) ────────
public/
\`\`\`

---

## ARQUIVO 4: Estrutura do Projeto (README para Roo)

Responda com o conteúdo dos 4 arquivos acima, separados por:

---ARQUIVO-1-CLINERULES---
[conteúdo completo do .clinerules acima]

---ARQUIVO-2-GITIGNORE---
[conteúdo completo do .gitignore acima]

---ARQUIVO-3-ROOIGNORE---
[conteúdo completo do .rooignore acima]

---

Apenas esses 3 arquivos. Nada mais. Sem explicação.

---

\`.trim();
},
```

---

## PARTE B — Verificar que `formatarDocImpl()` está fazendo parse correto

Procure por `formatarDocImpl()` em `04-handlers.js` (linha ~6380 mais ou menos).

O método deve extrair os 4 arquivos da resposta da PARTE 1. Verifique se o padrão de separação é:

```javascript
const regex = /---ARQUIVO-(\d+)-(CLINERULES|GITIGNORE|ROOIGNORE)---\n([\s\S]*?)(?=---|$)/g;
```

Se não estiver fazendo isso, adicione este método ou atualize o existente:

```javascript
formatarDocImpl(parte1, parte2, parte3, parte4) {
  // Parse PARTE 1 — extrair .clinerules, .gitignore, .rooignore
  const files = {};

  // Regex para extrair cada seção
  const patterns = {
    clinerules: /---ARQUIVO-1-CLINERULES---([\s\S]*?)(?=---ARQUIVO-|---$|$)/i,
    gitignore: /---ARQUIVO-2-GITIGNORE---([\s\S]*?)(?=---ARQUIVO-|---$|$)/i,
    rooignore: /---ARQUIVO-3-ROOIGNORE---([\s\S]*?)(?=---ARQUIVO-|---$|$)/i,
  };

  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = parte1.match(pattern);
    if (match && match[1]) {
      files[key] = match[1].trim();
    }
  });

  // Verificar que os 3 arquivos foram extraídos
  if (!files.clinerules || !files.gitignore || !files.rooignore) {
    console.warn('[AIGator] Aviso: Um ou mais arquivos de config não foram extraídos corretamente');
  }

  return {
    clinerules: files.clinerules || '# .clinerules não foi gerado',
    gitignore: files.gitignore || '# .gitignore não foi gerado',
    rooignore: files.rooignore || '# .rooignore não foi gerado',
    parte1: parte1.replace(/---ARQUIVO-\d-(CLINERULES|GITIGNORE|ROOIGNORE)---[\s\S]*?(?=---|$)/g, '').trim(),
  };
},
```

---

## PARTE C — Atualizar `generateDocImpl()` para coletar os 3 arquivos

Procure por `generateDocImpl()` em `04-handlers.js`. Na parte onde salva os arquivos, adicione:

```javascript
// Após gerar as 4 partes, fazer parse
const { clinerules, gitignore, rooignore, parte1Clean } = this.formatarDocImpl(
  parte1, parte2, parte3, parte4
);

// Salvar cada arquivo separadamente no output
const timestamp = new Date().toISOString().split('T')[0];
const slug = this.B?.nome_projeto?.toLowerCase().replace(/\s+/g, '-') || 'landing-page';

// Arquivo .clinerules
const fileClinerules = {
  name: `.clinerules`,
  content: clinerules,
  type: 'config'
};

// Arquivo .gitignore
const fileGitignore = {
  name: `.gitignore`,
  content: gitignore,
  type: 'config'
};

// Arquivo .rooignore
const fileRooignore = {
  name: `.rooignore`,
  content: rooignore,
  type: 'config'
};

// Guardar em this.B.output_files ou similar
this.B.output_files = this.B.output_files || [];
this.B.output_files.push(fileClinerules, fileGitignore, fileRooignore);
```

---

## CHECKLIST DE VALIDAÇÃO

Após implementar, testar:

- [ ] Ao gerar DOC-IMPL, PARTE 1 gera os 3 arquivos de config
- [ ] `.clinerules` aparece no output (11.8KB aprox)
- [ ] `.gitignore` aparece no output (1.2KB aprox)
- [ ] `.rooignore` aparece no output (1KB aprox)
- [ ] Ao baixar o output, os 3 arquivos estão presentes
- [ ] Conteúdo dos arquivos é válido e legível
- [ ] Estrutura de pastas do .clinerules bate com a estrutura gerada

---

## RESULTADO

✅ Roo recebe `.clinerules` com todas as regras de desenvolvimento  
✅ `.gitignore` protege arquivos sensíveis  
✅ `.rooignore` evita que Roo toque em arquivos críticos  
✅ Implementação muito mais segura e organizada

Próxima etapa: **ETAPA 3 — DOC-1 Otimizado**
