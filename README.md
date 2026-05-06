# LandingAI v3 — Adsgator

Sistema interno de geração de Fichas de Implementação para projetos de landing page.

## Como usar

1. Abra `index.html` no Chrome ou Edge (duplo clique)
2. Configure ao menos uma API Key em **Config. API**
3. Cole o briefing do cliente na tela de Intake
4. Clique em **Analisar e preencher** — a IA preenche os 8 steps automaticamente
5. Percorra os steps, revise e ajuste
6. Vá para **Direção de Arte** — adicione referências, clique em analisar
7. Aprove a ficha de arte
8. Vá para **Revisão e Geração**
9. Clique em **Gerar Ficha de Implementação**
10. Envie o `doc-impl-[slug].md` ao Roo Code para implementação

## Modo sem API

Preencha os steps manualmente e baixe o **DOC-1** na tela de revisão.
O DOC-1 é um prompt completo que pode ser usado em qualquer IA externamente.

## Modelos suportados

| Modelo | Provider | Nível |
|---|---|---|
| Gemini 2.5 Pro | Google | Pago |
| Gemini 2.5 Flash | Google | Gratuito |
| Claude Sonnet 4 | Anthropic | Pago |
| Claude Haiku 4.5 | Anthropic | Gratuito |
| Grok 3 | xAI | Pago |
| Mistral Large | Mistral AI | Pago |

## Onde obter API Keys

- **Gemini:** https://aistudio.google.com/app/apikey
- **Claude:** https://console.anthropic.com
- **Grok:** https://console.x.ai
- **Mistral:** https://console.mistral.ai

## O que o sistema gera

- **DOC-1** (`doc1-[slug].md`) — briefing estruturado + prompt completo. Funciona sem API.
- **DOC-IMPL** (`doc-impl-[slug].md`) — Ficha de Implementação completa para o Roo. Requer API.
- **Preview** — mockup HTML simplificado do hero + 3 seções + footer.

## Stack dos projetos gerados pelo sistema

Astro · Tailwind CSS · GSAP · ScrollTrigger · Framer Motion · Lenis · Web3Forms  
Deploy: Vercel (output: hybrid) ou Netlify  
Analytics: Vercel Analytics + Speed Insights  
LGPD: Cookie Banner + Google Consent Mode v2

## Dados e privacidade

Todos os dados ficam exclusivamente no `localStorage` do seu browser.
Nenhuma informação é enviada a servidores da Adsgator.
As chamadas de API vão diretamente do browser para o provider escolhido.

## Suporte

Sistema interno Adsgator — v3.0.0