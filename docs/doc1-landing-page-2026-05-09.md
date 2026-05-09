# DOC-1 — Novo Projeto
# Gerado pelo LandingAI · Adsgator
# Data: 08/05/2026
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
- Um título `### `caminho/do/arquivo``
- Um bloco de código com a extensão correta
- O código COMPLETO e funcional (nunca use "// ... resto do código" ou similar)
- Todo o conteúdo real do briefing aplicado (nomes reais, copies reais, cores reais, dados reais)
- NUNCA deixe placeholders genéricos como "[SEU NOME]" ou "[COR]" — use os dados do briefing

## STACK OBRIGATÓRIA

```
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
```

## PADRÕES OBRIGATÓRIOS DE CÓDIGO

### package.json — sempre incluir estas dependências exatas:
```json
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
```

### astro.config.mjs — sempre usar:
```js
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
```

### Padrão de seção Astro:
- Props definidos no frontmatter (---)
- Dados inline no componente (sem imports externos de dados)
- Script GSAP no final com ScrollTrigger
- Verificação de prefers-reduced-motion antes das animações
- Acessibilidade: aria-labels, roles, focus-visible
- WhatsApp links com texto pré-preenchido via encoding

### Padrão de animação GSAP:
```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.elemento', {
    opacity: 0, y: 30, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.elemento', start: 'top 85%' }
  });
}
```

### CookieBanner.tsx — sempre incluir Google Consent Mode v2:
```ts
window.gtag('consent', 'update', {
  analytics_storage: aceito ? 'granted' : 'denied',
  ad_storage: aceito ? 'granted' : 'denied',
});
```

### Layout.astro — sempre incluir:
- GTM snippet no <head> e <body>
- Lenis smooth scroll inicializado
- Vercel Analytics e Speed Insights
- Meta tags Open Graph completas
- Schema.org JSON-LD para LocalBusiness or ProfessionalService
- Fonte carregada via @fontsource (não Google Fonts CDN)

## CAMPOS QUE PRECISAM DE AÇÃO HUMANA
Use exatamente estas strings como placeholder (o Roo Code vai saber procurar por elas):
- `[DOMINIO]` — domínio final do projeto
- `[GTM_ID]` — ID do Google Tag Manager
- `[WEB3FORMS_KEY]` — chave do Web3Forms para formulário de contato
- `[GA_ID]` — ID do Google Analytics (opcional)

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

# BRIEFING ESTRUTURADO — Novo Projeto

## Progresso de preenchimento
Step 1 (Identificação): 3/3 campos
Step 2 (Contato e Conversão): 2/2 campos
Step 3 (Presença Digital): 1/1 campos
Step 4 (Atendimento): 1/1 campos
Step 5 (Serviços e Preço): 3/3 campos
Step 6 (Público-Alvo): 3/3 campos
Step 7 (Diferenciais e Prova): 3/3 campos
Step 8 (Tom e Identidade): 2/2 campos

---

## IDENTIDADE E POSICIONAMENTO

- **Nome do Profissional:** ANA ESTER NUTRICIONISTA
- **Nome da Marca:** ANA ESTER NUTRICIONISTA
- **Nicho/Segmento:** Nutrição
- **Cidade/Estado:** Poços de Caldas, MG
- **Proposta de Valor:** Transformação de hábitos e construção de resultados reais e sustentáveis com nutrição humanizada, individualizada e com foco na vida real.
- **Missão:** Transformação de bem-estar e autoestima, ajudando pacientes a perceberem diversos outros benefícios além da estética corporal.
- **Anos de Experiência:** —
- **Formação:** —
- **Certificações:** —

---

## AVATAR E DOR

- **Nome do Avatar:** —
- **Faixa Etária:** —
- **Gênero:** —
- **Profissão:** Nutricionista
- **Renda:** —
- **Dor Principal:** Busca pela estética corporal, insatisfação com o corpo, dietas restritivas e insustentáveis.
- **Dores Secundárias:** Falta de acompanhamento personalizado, dificuldade em mudar hábitos, falta de clareza sobre como alcançar resultados.
- **Desejo Principal:** Alcançar resultados reais e sustentáveis, melhorar o bem-estar, aumentar a autoestima, ter um corpo saudável.
- **Objeção — Preço:** Não destacada no momento.
- **Objeção — Tempo:** Os resultados variam de pessoa para pessoa, de acordo com a consistência de cada um. O acompanhamento adequado, é possível observar melhorias na disposição e bem-estar nas primeiras semanas.
- **Objeção — Confiança:** Sim. Independente da modalidade de atendimento, o acompanhamento continua sendo totalmente personalizado e adaptado à sua realidade para garantir resultados sustentáveis. A avaliação fisica pode ser feita por medidas de circunferências conforme orientação e fotos evolutivas.
- **Objeção — Resultado:** Não. O foco é uma adequação saudável e sustentável, sem restrições extremas.
- **Gatilhos Mentais:** Personalização, exclusividade, humanização, resultados reais e sustentáveis, acolhimento, foco na vida real.

---

## SERVIÇO

- **Serviço Principal:** Acompanhamento nutricional individualizado
- **Descrição:** Desenvolvido para aqueles que buscam o ajuste nutricional adequado com base nas principais necessidades e objetivos, visando sempre a saúde e o bem-estar.
- **Como Funciona — Passo 1:** Avaliação nutricional personalizada considerando rotina, objetivos, histórico de saúde e exames laboratoriais.
- **Como Funciona — Passo 2:** Elaboração de plano alimentar exclusivo, adaptado à realidade do paciente.
- **Como Funciona — Passo 3:** Acompanhamento regular (mínimo a cada 30 dias) com avaliação física (medidas, fotos evolutivas) e ajuste do plano conforme evolução.
- **Como Funciona — Passo 4:** Educação nutricional e guias para apoio ao acompanhamento.
- **Modalidade:** Presencial e Online
- **Duração da Sessão:** —
- **Frequência:** Mínimo a cada 30 dias, duração definida pelo plano escolhido.
- **Formato:** Acompanhamento individualizado
- **Resultado Esperado:** Ajuste nutricional adequado, saúde e bem-estar, clareza sobre o processo de tratamento, resultados reais e sustentáveis, melhora na disposição e bem-estar nas primeiras semanas.
- **Prazo para Resultado:** Resultados variam de pessoa para pessoa, com melhorias na disposição e bem-estar observadas nas primeiras semanas.
- **Serviços Adicionais:** Materiais educativos e guias nutricionais.

---

## PROVA SOCIAL

- **Depoimento 1 — Nome:** —
- **Depoimento 1 — Texto:** Todos os meus pacientes se sentem acolhidos e escutados de uma maneira realmente sincera.
- **Depoimento 1 — Resultado:** —
- **Depoimento 2 — Nome:** —
- **Depoimento 2 — Texto:** —
- **Depoimento 2 — Resultado:** —
- **Depoimento 3 — Nome:** —
- **Depoimento 3 — Texto:** —
- **Depoimento 3 — Resultado:** —
- **Casos de Sucesso:** —
- **Perfil Google:** —
- **Nota Google:** —
- **Qtd. Avaliações:** —
- **Instagram:** @nutri.anaester
- **Seguidores:** —
- **Mídia / Aparições:** —

---

## DIFERENCIAIS

- **Diferencial 1:** Acompanhamento Realmente Personalizado — Dedicação e preocupação com a evolução de cada paciente.
- **Diferencial 2:** Nutrição Humanizada e Foco na Vida Real — Ajudando o paciente a entender que a reeducação alimentar não precisa ser construída com extremos, dietas sofridas e insustentáveis.
- **Diferencial 3:** Acolhimento e Ajuste Adequado — O acolhimento e o ajuste adequado de acordo com a evolução individual são diferenciais.
- **Diferencial 4:** Entendimento do Processo — Todos os pacientes se sentem acolhidos e escutados de uma maneira realmente sincera.
- **Metodologia Própria:** Nutrição humanizada, individualizada e com foco na vida real
- **Garantia:** —
- **Atendimento Diferenciado:** Acolhimento, escuta sincera, personalização e ajuste de acordo com a evolução individual.

---

## PREÇOS E CONTATO

- **WhatsApp:** 35984566323
- **Mensagem padrão WhatsApp:** Olá Ana Ester! Gostaria de saber mais sobre o acompanhamento nutricional.
- **E-mail:** anaesternutricionista@gmail.com
- **Plano 1:** — — — — —
- **Plano 2:** — — — — —
- **Plano 3:** — — — — —
- **Formas de Pagamento:** —
- **Desconto PIX:** —
- **Parcelamento:** —
- **Trial Gratuito:** —
- **Horário de Atendimento:** 09:00 Às 18:00 de seg à sex, 09:30 às 15:30 no sábado

---

## IDENTIDADE VISUAL

- **Cor Primária:** —
- **Cor Secundária:** —
- **Cor de Acento:** —
- **Cor de Fundo:** —
- **Estilo Visual:** Minimalista, Clássico, Elegante, Acolhedor
- **Fonte Título:** —
- **Fonte Corpo:** —
- **Tom de Comunicação:** Profissional, Acolhedor, Empático, Confiante.
- **Referências Visuais:** https://pin.it/3XeDneVtQ (ou parecidos)
- **Logo (descrição):** —
- **Imagens Disponíveis:** Foto da profissional
- **Vídeo Disponível:** —

---

## SEO

- **Título SEO:** Ana Ester Nutricionista - Acompanhamento Nutricional Individualizado em Poços de Caldas
- **Descrição SEO:** Transforme seus hábitos e construa resultados reais e sustentáveis com o acompanhamento nutricional humanizado e individualizado da Ana Ester. Bem-estar e autoestima para você.
- **Palavra-chave Principal:** Nutricionista Poços de Caldas
- **Palavras-chave Secundárias:** Acompanhamento nutricional, plano alimentar personalizado, saúde e bem-estar, reeducação alimentar, nutrição humanizada.
- **Domínio Sugerido:** anaesternutricionista.com.br
- **Schema Tipo:** LocalBusiness
- **OG Título:** Ana Ester Nutricionista
- **OG Descrição:** Acompanhamento nutricional individualizado para sua saúde e bem-estar.

---

## ESTRUTURA DA PÁGINA (Aprovada)

{"estrutura_lp":{"analise":{"tipo_negocio":"Saúde e Bem-estar","dor_principal":"Insatisfação com o corpo, planos alimentares restritivos, falta de resultados sustentáveis.","solucao":"Acompanhamento nutricional individualizado com foco em reeducação alimentar e bem-estar.","justificativa_blocos":"O negócio é focado em saúde e bem-estar, com uma dor principal ligada à insatisfação corporal e métodos insustentáveis. A solução é um acompanhamento nutricional individualizado. O processo é considerado desconhecido para o cliente, o Instagram está disponível e não há preço, depoimentos ou avaliações do Google. A ordem prioriza apresentar a dor, a solução, o diferencial, detalhar o funcionamento, mostrar resultados (via Instagram) e finalizar com um CTA claro, seguido pelo rodapé."},"blocos":[{"ordem":1,"id":"header","nome":"Cabeçalho","tipo":"estrutural","incluir":true,"razao":"Bloco obrigatório para navegação e identidade visual.","conteudo_sugerido":{"titulo":"ANA ESTER MESSIAS LIMA MARTINS"}},{"ordem":2,"id":"hero","nome":"Hero","tipo":"estrutural","incluir":true,"razao":"Bloco obrigatório para apresentar a dor principal e a solução de forma impactante.","conteudo_sugerido":{"titulo":"Cansada de planos alimentares que não funcionam?","subtitulo":"Descubra o acompanhamento nutricional que te entende e te leva a resultados reais e duradouros.","cta":"Quero meu acompanhamento"}},{"ordem":3,"id":"o-servico","nome":"O Serviço","tipo":"estrutural","incluir":true,"razao":"Bloco obrigatório para detalhar a oferta principal.","conteudo_sugerido":{"titulo":"Seu bem-estar em primeiro lugar","subtitulo":"Um plano alimentar personalizado, focado na sua saúde e nos seus objetivos, sem restrições extremas. Acolhimento e ajuste contínuo para você alcançar seu melhor."}},{"ordem":4,"id":"como-funciona","nome":"Como Funciona","tipo":"opcional","incluir":true,"razao":"O processo de acompanhamento nutricional individualizado pode ser desconhecido para o cliente, exigindo detalhamento para gerar confiança.","conteudo_sugerido":{"titulo":"Seu caminho para uma vida mais saudável","subtitulo":"1. Consulta inicial: Entenderemos suas necessidades e objetivos. 2. Plano alimentar: Criado exclusivamente para você. 3. Acompanhamento: Ajustes e suporte contínuo para seu progresso."}},{"ordem":5,"id":"diferenciais","nome":"Diferenciais","tipo":"estrutural","incluir":true,"razao":"Bloco obrigatório para destacar o que torna o serviço único.","conteudo_sugerido":{"titulo":"Reeducação sem extremos","subtitulo":"Acredito em um processo gentil e sustentável. Adeus, planos alimentares sofridos! Olá, acolhimento e resultados que duram."}},{"ordem":6,"id":"instagram-feed","nome":"Instagram Feed","tipo":"opcional","incluir":true,"razao":"O Instagram está disponível e é um ótimo canal para mostrar a rotina, dicas e resultados, complementando a prova social.","conteudo_sugerido":{"titulo":"Inspire-se no dia a dia"}},{"ordem":7,"id":"cta-final","nome":"CTA Final","tipo":"estrutural","incluir":true,"razao":"Bloco obrigatório para direcionar o usuário à ação.","conteudo_sugerido":{"titulo":"Pronta para transformar seu corpo e sua mente?","subtitulo":"Dê o primeiro passo rumo ao bem-estar que você merece. Agende sua consulta e inicie sua jornada.","cta":"Agendar minha consulta"}},{"ordem":8,"id":"footer","nome":"Rodapé","tipo":"estrutural","incluir":true,"razao":"Bloco obrigatório para informações de contato e direitos autorais.","conteudo_sugerido":{"subtitulo":"ANA ESTER MESSIAS LIMA MARTINS | Todos os direitos reservados."}}],"resumo":{"total_blocos":8,"blocos_sempre":5,"blocos_opcionais_inclusos":3,"blocos_excluidos":0,"pagina_tipo":"Saúde e Bem-estar (Foco em Transformação e Processo)"}}}

---

## DIREÇÃO DE ARTE

- **Referências visuais:** —
- **Análise de arte:** —
- **Decisões aprovadas:** —

---

*DOC-1 gerado pelo LandingAI v2 · Adsgator · 08/05/2026, 21:29:19*

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
`"Quer que eu gere a Ficha de Implementação em 4 partes?"`

5. Responda com:
```
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
```

6. Copie as 4 partes geradas e salve em arquivos separados

### Opção 2: Usar com Gemini

1. Copie **TODO** o conteúdo deste arquivo
2. Abra https://gemini.google.com
3. Cole o conteúdo em uma nova conversa
4. Envie a mensagem

Gemini vai ler e responder:
`"Entendi. Esta é uma ficha estruturada. Quer gerar a implementação?"`

5. Responda com:
```
Gere a Ficha de Implementação em 4 partes modulares, cada uma sendo um arquivo .md independente.

PARTE 1: Config + Estrutura (30-50KB)
PARTE 2: Layout + UI Components (20-30KB)
PARTE 3: Sections da LP + Animações (40-60KB)
PARTE 4: Integrações + Deploy (15-25KB)

Siga rigorosamente a estrutura de pastas proposta.
```

6. Copie as 4 partes e salve em arquivos separados

### Opção 3: Usar com Grok (xAI)

1. Copie **TODO** o conteúdo deste arquivo
2. Abra https://x.com/grok (ou acesse via app xAI)
3. Cole o conteúdo
4. Grok vai processar e gerar a implementação em 4 partes

### Opção 4: Copiar para seu IDE com AI Assistant

Se usa VS Code + GitHub Copilot ou Cursor:

1. Copie este arquivo
2. Crie um novo arquivo chamado `BRIEF.md` no seu projeto
3. Cole o conteúdo
4. Abra o Chat do Copilot/Cursor
5. Digite: `@BRIEF Gere a Ficha de Implementação em 4 partes`

---

## Para Desenvolvedores

### O que fazer depois de receber as 4 partes:

1. **Salve em arquivos separados:**
   - `doc-impl-parte1-[slug].md`
   - `doc-impl-parte2-[slug].md`
   - `doc-impl-parte3-[slug].md`
   - `doc-impl-parte4-[slug].md`

2. **Clone o template Astro:**
   ```bash
   git clone https://github.com/adsgator/astro-landingai-template
   cd landing-page
   npm install
   ```

3. **Use com Roo Code:**
   ```bash
   roo --load-instructions BRIEF.md
   # ou
   roo --add-rules doc-impl-parte1-[slug].md
   ```

4. **Implemente cada parte em sequência:**
   - Parte 1: Setup inicial, pastas, config
   - Parte 2: Layout base, componentes reutilizáveis
   - Parte 3: Seções da LP, estilização
   - Parte 4: Integrações, animations, deploy

5. **Build e teste:**
   ```bash
   npm run dev      # Desenvolvimento
   npm run build    # Build final
   npm run preview  # Preview produção
   ```

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
- Padronize os nomes: `doc-impl-parte[1-4]-[slug].md`
- Certifique-se que cada parte tem entre 20-60KB

**"Código não roda depois de implementar"**
- Confira o `.clinerules` na Parte 1
- Verifique que `astro.config.mjs` bate com a config
- Rode `npm install` novamente
- Check logs de build: `npm run build`

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
| Gerado | 08/05/2026 |