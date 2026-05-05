# LandingAI — Adsgator

Sistema interno de geração de briefing e Ficha de Implementação (Doc 3) para projetos Astro da Adsgator.

## Como usar

1. Abra `index.html` no Chrome ou Edge
2. Obtenha API Key Gemini em: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
3. Preencha as 8 etapas de briefing
4. Na etapa 9: baixe o `briefing.md` (sem API) ou gere o Doc 3 completo (com API)
5. Envie o `doc3-[slug].md` ao Roo para implementação

## Modos

- **Com API Gemini:** Gera o Doc 3 completo pronto para o Roo
- **Sem API:** Gera `briefing-[slug].md` com o prompt para uso manual

## O que o Doc 3 contém

- Instrução mestre para o Roo
- Metadados SEO prontos para copiar
- Stack técnica com `package.json`, `astro.config.mjs`, `.env.example`, `robots.txt`
- `tailwind.config.js` completo com tokens reais
- Sistema de animação (GSAP + Framer Motion)
- Componentes globais especificados
- Copy completa de cada seção
- Rastreamento GTM mapeado
- Checklist de entrega
- Lista de ações humanas necessárias

## Stack dos projetos gerados

Astro · Tailwind CSS · GSAP · Framer Motion · Lenis · Web3Forms
Deploy: Vercel ou Netlify (output: static)
