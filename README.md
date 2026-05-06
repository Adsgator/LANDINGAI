# LandingAI — Adsgator

Sistema interno de geração de briefing e Ficha de Implementação (Doc 3) para projetos Astro da Adsgator.

## Como usar

1. Abra `index.html` no Chrome ou Edge.
2. Obtenha uma API Key do Gemini em: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
3. Preencha as 8 etapas de briefing com as informações coletadas do cliente.
4. Na etapa 9:
   - **Modo Prompt:** Baixe o arquivo `briefing.md` para usar o prompt manualmente em qualquer IA.
   - **Modo Direto:** Insira sua API Key e clique em "Gerar Doc 3" para que o sistema gere o documento completo via Gemini 2.5 Pro.
5. Envie o arquivo `doc3-[slug].md` gerado para o Roo Code iniciar a implementação.

## Modos de Operação

- **Com API Gemini:** Gera o Doc 3 completo, com todas as seções, copy, metadados e configurações técnicas prontas para cópia.
- **Sem API:** Gera um briefing estruturado que inclui o "Prompt Mestre", permitindo que você gere o Doc 3 em interfaces externas de IA.

## Stack dos projetos gerados

As landing pages geradas seguem o padrão Adsgator:
- **Framework:** Astro
- **Estilização:** Tailwind CSS
- **Animações:** GSAP (ScrollTrigger) + Framer Motion
- **Scroll:** Lenis
- **Formulários:** Web3Forms
- **Deploy:** Vercel ou Netlify (output estático)

---
*v2.0 — Desenvolvido para uso interno da Adsgator*
