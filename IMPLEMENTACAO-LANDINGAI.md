# LANDINGAI — Documento de Implementação v2
> Stack: Astro · Tailwind · GSAP · Framer Motion · Lenis · Web3Forms  
> Output: Doc 3 (.md) pronto para o Roo implementar  
> Leia tudo antes de escrever uma linha de código.

---

## 1. VISÃO GERAL

O LandingAI é um sistema web de uso interno da Adsgator. Substitui e automatiza a etapa de preenchimento dos Documentos 1 e 2, e usa o Gemini 2.5 Pro para gerar o **Documento 3 — Ficha de Implementação** completo e pronto para o Roo.

### Fluxo de trabalho

```
ANTES (manual):
  Doc 1 → IA gera copy → Doc 2 → IA gera Doc 3 → Roo implementa

COM LANDINGAI:
  Briefing no sistema → Gemini gera Doc 3 → Roo implementa
```

### O que o sistema entrega

| Arquivo | Quando | Descrição |
|---|---|---|
| `briefing-[slug].md` | Sempre (sem API) | Briefing estruturado + prompt completo |
| `doc3-[slug].md` | Com API Gemini | Ficha de Implementação completa para o Roo |

> O sistema **não gera código Astro**. Gera o Doc 3 que o Roo usa para implementar o projeto Astro corretamente.

### Dois modos de operação

**Modo Completo (com API Gemini):** Briefing → Gemini gera Doc 3 → download do `.md`

**Modo Prompt (sem API):** Briefing → download do `briefing-[slug].md` com o prompt estruturado para usar manualmente

---

## 2. ESTRUTURA DE ARQUIVOS DO SISTEMA

```
landingai/
├── index.html          ← App principal (arquivo único)
├── assets/
│   ├── app.css         ← Estilos do sistema
│   └── app.js          ← Lógica completa
├── output/
│   └── .gitkeep        ← Pasta onde os .md gerados são salvos
└── README.md
```

> Sistema 100% browser. Zero build, zero npm, zero backend. Abre com duplo clique.

---

## 3. DESIGN SYSTEM DO APP

### Paleta

```css
:root {
  --bg-base:       #0B0D12;
  --bg-surface:    #13151C;
  --bg-raised:     #1A1D26;
  --bg-overlay:    #21242F;

  --border-subtle: rgba(255,255,255,0.06);
  --border-muted:  rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.18);

  --text-primary:  #F2F2F4;
  --text-secondary:#9A9CAA;
  --text-tertiary: #5A5C6A;

  --accent:        #00E5A0;
  --accent-dim:    rgba(0,229,160,0.12);
  --accent-border: rgba(0,229,160,0.30);

  --accent2:       #7B8CFF;
  --accent2-dim:   rgba(123,140,255,0.12);
  --accent2-border:rgba(123,140,255,0.30);

  --danger:        #FF6B6B;
  --danger-dim:    rgba(255,107,107,0.10);
  --warning:       #FFB547;
  --warning-dim:   rgba(255,181,71,0.10);

  --r-xs: 4px;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-pill: 999px;
}
```

### Tipografia do sistema

```
Display/títulos: 'Syne' (700, 800)
Corpo/labels:    'DM Sans' (300, 400, 500)
Código/mono:     'DM Mono' (400, 500)
```

Import CDN:
```
https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap
```

### Componentes base

**Input/Textarea/Select:**
```css
background: var(--bg-raised);
border: 1px solid var(--border-muted);
border-radius: var(--r-sm);
color: var(--text-primary);
font-family: 'DM Sans', sans-serif;
font-size: 14px;
padding: 11px 14px;
outline: none;
transition: border-color 0.2s, box-shadow 0.2s;

:focus {
  border-color: var(--accent2);
  box-shadow: 0 0 0 3px rgba(123,140,255,0.12);
}
```

**Label:**
```css
font-size: 11px;
font-weight: 500;
text-transform: uppercase;
letter-spacing: 0.07em;
color: var(--text-tertiary);
margin-bottom: 6px;
display: block;
```

**Chip seleção múltipla (.chip):**
```css
padding: 7px 14px;
border: 1px solid var(--border-muted);
border-radius: var(--r-pill);
font-size: 13px;
cursor: pointer;
background: transparent;
color: var(--text-secondary);
transition: all 0.15s;

.chip.on {
  background: var(--accent2-dim);
  border-color: var(--accent2-border);
  color: var(--accent2);
}
```

**Card de seleção única (.sel-card):**
```css
border: 1px solid var(--border-muted);
border-radius: var(--r-md);
padding: 16px 18px;
cursor: pointer;
transition: all 0.15s;
background: var(--bg-surface);

.sel-card.on {
  border-color: var(--accent-border);
  background: var(--accent-dim);
}

.sel-card .card-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.sel-card .card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}
```

**Botão primário:**
```css
background: var(--accent);
color: #031a10;
font-weight: 600;
padding: 12px 24px;
border-radius: var(--r-pill);
border: none;
cursor: pointer;
transition: opacity 0.15s, transform 0.15s;

:hover { opacity: 0.88; transform: translateY(-1px); }
:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
```

**Botão ghost:**
```css
background: transparent;
color: var(--text-secondary);
border: 1px solid var(--border-muted);
padding: 11px 20px;
border-radius: var(--r-pill);
cursor: pointer;
transition: all 0.15s;

:hover { color: var(--text-primary); border-color: var(--border-strong); background: var(--bg-raised); }
```

---

## 4. LAYOUT DO APP

```
┌───────────────────────────────────────────────────────────┐
│  SIDEBAR (270px, sticky, altura 100vh)                    │
│  ─────────────────  MAIN (flex:1)                         │
│  Logo                TOPBAR (60px sticky)                 │
│                      ───────────────────────────────────  │
│  ── BRIEFING ──       Título da etapa + subtítulo         │
│  1. Identificação     PROGRESS BAR (2px)                  │
│  2. Negócio           ───────────────────────────────────  │
│  3. Público           CONTEÚDO DA ETAPA (scrollável)      │
│  4. Conversão         max-width: 860px                    │
│  5. Tom de Voz                                            │
│  6. Direção Visual                                        │
│  7. Assets                                                │
│  8. Integrações                                           │
│  ── GERAÇÃO ──                                            │
│  9. Revisar & Gerar                                       │
│                       RODAPÉ DA ETAPA                     │
│  ────────────────     [← Voltar]  [Próximo →]             │
│  Status API                                               │
│  Modo: API / Prompt                                       │
└───────────────────────────────────────────────────────────┘
```

### Estados da sidebar

- **Não visitado:** número cinza, texto cinza
- **Visitado:** check verde (✓), texto branco
- **Ativo:** número accent2 iluminado, fundo levemente claro, texto branco
- **Clicável:** qualquer etapa já visitada pode ser acessada diretamente

---

## 5. ETAPAS DO BRIEFING — ESPECIFICAÇÃO COMPLETA

### ETAPA 1 — Identificação do Projeto

**Objetivo:** Criar a identidade base do projeto que nomeia todos os arquivos gerados.

**Campo: Tipo de projeto** — cards de seleção única, obrigatório

```
[ SERVIÇO ]                         [ PRODUTO ]
Prestação de serviço ou resultado.  Venda de produto físico ou digital.
Ex: clínica, coach, advocacia,      Ex: curso online, suplemento,
    consultoria, adestramento.          software, e-book.
```

**Grid 2 colunas:**

| Campo | Req | Placeholder |
|---|---|---|
| Nome do cliente / projeto | sim | ex: Beatriz Mattos, Clínica Vita |
| Slug do projeto | sim | ex: beatriz-mattos, clinica-vita — auto-gerado do nome, editável |
| Nome da agência responsável | não | ex: Adsgator |
| Data do briefing | sim | auto-preenchido com data atual |

**Campo full-width: Nome do domínio final** (texto)
- Placeholder: `ex: beatrizmattos.com.br, vitaestetica.com.br — só o domínio`
- Usado para gerar sitemap, robots.txt e og:image corretamente

> Ao digitar o nome do cliente, gerar o slug automaticamente (kebab-case, sem acentos). Campo slug editável.

---

### ETAPA 2 — Negócio & Serviço

**Objetivo:** Contextualizar o que é oferecido, como funciona e o posicionamento.

**Grid 2 colunas:**

| Campo | Req | Placeholder |
|---|---|---|
| Nicho / segmento | sim | ex: Adestramento comportamental, Psicologia clínica |
| Serviço ou produto principal | sim | ex: Mentoria online de adestramento individual |
| Objetivo de conversão | sim | ex: Mensagem no WhatsApp, Agendamento, Formulário |
| Cidade / região | sim | ex: São Paulo SP, Online Brasil, Região do ABC |
| Modalidade | sim | chips: Presencial / Online / Híbrido / Domiciliar |

**Se SERVIÇO:**

| Campo | Req | Placeholder |
|---|---|---|
| O que está incluso | sim | ex: 4 sessões online, relatório semanal, grupo de suporte |
| Duração / formato | sim | ex: 8 semanas, sessões de 60min via Zoom |
| Para quem é / pré-requisito | não | ex: Donos com cão acima de 6 meses sem cirurgia recente |
| Garantia oferecida | não | ex: Reembolso integral nos primeiros 7 dias |

**Se PRODUTO:**

| Campo | Req | Placeholder |
|---|---|---|
| O que está incluso | sim | ex: 60 cápsulas, fórmula com 5 ativos patenteados |
| Prazo de entrega | sim | ex: Entrega em até 3 dias úteis para todo Brasil |
| Garantia | sim | ex: 30 dias de garantia incondicional |
| Onde é vendido | sim | ex: Hotmart, loja própria, Amazon |

**Campo full-width: Apresentação do negócio** (textarea, obrigatório)
- Label: `Descreva o negócio com suas próprias palavras — exatamente como explicaria para alguém`
- Placeholder: `O que faz, quem atende, por que existe, qual problema resolve, contexto do mercado...`
- Min-height: 120px

**Campo full-width: Contexto extra / observações** (textarea)
- Label: `O que ficou fora do formulário — nuances da conversa, detalhes do cliente`
- Placeholder: `Informações brutas da reunião, prints de conversa, qualquer contexto adicional`

---

### ETAPA 3 — Público & Intenção de Busca

**Objetivo:** Mapear quem compra e como pensa antes de pesquisar.

**Grid 2 colunas:**

| Campo | Req | Placeholder |
|---|---|---|
| Público primário | sim | ex: Donos de cães com problemas de comportamento |
| Público secundário | não | ex: Adestradores iniciantes buscando mentoria técnica |
| Faixa etária | sim | ex: 28-55 anos, predominantemente 30-45 |
| Perfil socioeconômico | sim | ex: Classe B, renda acima de R$5k/mês |

**Campo: Maturidade do público** — cards seleção única

```
FRIO                  MORNO                 QUENTE              MUITO QUENTE
Não sabe que          Sabe do               Conhece a           Pronto para
tem o problema.       problema, não         solução,            comprar —
Precisa ser           conhece a             compara             precisa do
educado.              solução.              opções.             gatilho.
```

**Campo full-width: Dores principais do público** (textarea, obrigatório)
- Label: `Quais são as dores reais — o que tira o sono, o que já tentou sem sucesso`
- Placeholder: `Liste as principais dores. Ex:\n- Cão late o dia todo e reclamação de vizinhos\n- Já contratou 3 adestradores sem resultado duradouro\n- Medo de que o comportamento piore com o tempo`

**Campo full-width: Palavras de busca** (textarea, obrigatório)
- Label: `Como o público pesquisa no Google — o vocabulário real, não o técnico`
- Placeholder: `ex: "adestrador de cão online", "como parar meu cachorro de latir", "adestramento comportamental preço"`

**Campo full-width: Resultado desejado pelo público** (textarea, obrigatório)
- Label: `O que o cliente imagina conquistar — o sonho concreto`
- Placeholder: `ex: Ter um cão tranquilo que obedece sem precisar gritar, poder levar para lugares públicos sem vergonha`

**Campo full-width: Objeções principais** (textarea, obrigatório)
- Label: `Por que o cliente ideal ainda NÃO contratou / comprou?`
- Placeholder: `Liste as objeções reais. Ex:\n- Acha que o cão é muito velho para aprender\n- Preço parece alto sem saber o que está pagando\n- Já tentou antes e não funcionou\n- Não sabe se funciona online`

---

### ETAPA 4 — Conversão & Rastreamento

**Objetivo:** Definir os dados técnicos de conversão que alimentam o Doc 3.

**Campo: Tipo de CTA principal** — cards seleção única, obrigatório

```
WHATSAPP               FORMULÁRIO             AGENDAMENTO
Link wa.me com         Web3Forms com          Link externo
mensagem               email de destino       Calendly/similar
pré-preenchida.        e notificação.         ou embed.
```

**Se WHATSAPP:**

| Campo | Req | Placeholder |
|---|---|---|
| Número WhatsApp (DDI+DDD+número) | sim | ex: 5511918952921 — só números |
| Mensagem pré-preenchida | sim | ex: Olá! Vi o site e quero saber mais sobre a mentoria. |

> Gerar preview do link: `wa.me/[número]?text=[mensagem codificada em URL]`

**Se FORMULÁRIO (Web3Forms):**

| Campo | Req | Placeholder |
|---|---|---|
| Email de destino (notificações) | sim | ex: contato@empresa.com.br |
| Access Key Web3Forms | não | ex: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx |
| Campos do formulário | não | chips: Nome / Email / Telefone / Mensagem / Serviço de interesse |
| Redirect após envio | não | ex: /obrigado — deixar vazio para mensagem inline |

> Link para obter access key: `https://web3forms.com`

**Se AGENDAMENTO:**

| Campo | Req | Placeholder |
|---|---|---|
| Link de agendamento | sim | ex: https://calendly.com/... |
| Abrir em: | sim | chips: Nova aba / Embed na página |

**Grid 2 colunas — sempre:**

| Campo | Req | Placeholder |
|---|---|---|
| ID do Google Tag Manager | não | ex: GTM-XXXXXXX |
| Telefone para ligação (opcional) | não | ex: (11) 99999-0000 |

**Campo: CTAs de rastreamento** — chips seleção múltipla
```
contato_wpp (padrão)    view_content    view_links    agendamento_iniciado
formulario_enviado      ligacao_mobile  download
```

**Campo full-width: Texto do botão principal** (texto, obrigatório)
- Placeholder: `ex: Quero Iniciar a Mentoria, Agendar Avaliação Gratuita, Falar com Especialista`

**Campo: Micro-garantias do CTA** (texto)
- Placeholder: `ex: ✓ Resposta em até 1h ✓ Sem compromisso ✓ Atendimento personalizado`

---

### ETAPA 5 — Tom de Voz

**Objetivo:** Capturar a voz da marca para que o Doc 3 instrua o copywriting corretamente.

**Campo full-width: Personalidade da marca** (texto, obrigatório)
- Placeholder: `ex: Técnico e direto / Acolhedor e empático / Premium e discreto / Especialista que fala sem rodeios`

**Campo full-width: Vocabulário que DEVE aparecer na copy** (textarea)
- Label: `Palavras e expressões que o cliente usa — vêm da conversa, não do formulário`
- Placeholder: `ex: "manejo", "vínculo", "comportamento", "marcadores", "autonomia do animal"`

**Campo full-width: Vocabulário PROIBIDO** (textarea)
- Label: `O que o cliente jamais diria — palavras que quebram a identidade`
- Placeholder: `ex: "pet", "fofo", "amiguinho", "tutor consciente", "jornada", "transforme"`

**Campo: Frase que resume o tom** (texto)
- Placeholder: `ex: Especialista que já viu tudo e fala sem rodeios / Quem cuida sem enrolar`

**Campo: Proibições de copy — DNA Adsgator** (leitura, não editável)

> Exibir como bloco informativo fixo (não é campo de input):

```
DNA ADSGATOR — SEMPRE APLICADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✗  "inovador", "excelência", "missão", "visão"
✗  "somos apaixonados por", "comprometidos com"
✗  "resultados extraordinários", "transforme sua vida"
✗  "saiba mais", "clique aqui", "entre em contato"
✗  Inventar depoimentos, avaliações ou notas
✗  Blocos sem sustentação no briefing
✗  Promessas sem base real

✓  H1 espelha a dor da busca nos primeiros 3 segundos
✓  Vender o alívio da dor, não o nome técnico
✓  Especialista conversando olho no olho
✓  Cada palavra tem função persuasiva
```

---

### ETAPA 6 — Direção Visual & Design

**Objetivo:** Capturar as decisões visuais que definem a identidade do projeto.

**Campo: Intensidade visual** — cards seleção única, obrigatório

```
CONTIDO                  MÉDIO                    ALTO
Animações sutis.         Presença notável.         Efeito uau total.
Foco na copy.            Personalidade             Scroll experience,
Elegância pela           clara sem                 transições que
ausência.                exagero.                  definem o site.
```

**Campo: Tema** — chips seleção única
```
Claro  |  Escuro  |  IA decide com base nas referências
```

**Campo full-width: Referências visuais** (textarea, obrigatório)
- Label: `Links ou descrições — para cada uma, diga em 1 linha o que te atraiu`
- Placeholder: `Referência 1: functionhealth.com\nO que me atraiu: tipografia com serifa, off-white, blocos limpos\n\nReferência 2: outseta.com\nO que me atraiu: elementos manuais, setas Caveat, toque humano`

**Grid 2 colunas — cores:**

| Campo | Req | Placeholder |
|---|---|---|
| Cor principal da marca | sim | ex: #1A4731 ou "sem identidade definida" |
| Cor secundária | não | ex: #C9A84C ou "não existe" |
| Logo disponível | sim | chips: SVG / PNG / Não tem |
| Observações de cor | não | ex: Cliente usa muito preto, evitar cores vibrantes |

**Campo full-width: Estilo geral** (texto, obrigatório)
- Label: `Descreva como você quer que o site pareça — sem termos técnicos`
- Placeholder: `ex: Sóbrio e técnico, algo próximo de uma marca premium europeia, sem parecer infoproduto`

**Campo full-width: O que NÃO quero** (texto, obrigatório)
- Placeholder: `ex: Nada que pareça clínica genérica / sem visual de pet shop / sem rosa / sem gradiente roxo`

**Campo: Menu mobile** — cards seleção única

```
FULLSCREEN OVERLAY       DRAWER LATERAL         BOTTOM SHEET
Abre em tela cheia       Desliza da lateral.    Sobe do rodapé.
com animação.            Mais familiar.         Moderno, mobile-first.
Impacto máximo.          

IA DECIDE
Com base nas referências e intensidade visual.
```

**Campo: Elemento especial no menu** (texto)
- Placeholder: `ex: Número de telefone em destaque / Foto do profissional / Frase de impacto / Nenhum`

---

### ETAPA 7 — Assets Disponíveis

**Objetivo:** Informar o que existe de material para que o Doc 3 especifique corretamente.

**Grid 2 colunas:**

| Campo | Tipo | Placeholder |
|---|---|---|
| Foto do profissional / produto | select | Sim — alta qualidade / Sim — qualidade média / Não tem |
| Logo da marca | select | Sim — SVG / Sim — PNG / Não tem |
| Depoimentos de clientes | select | Sim — texto / Sim — print / Sim — vídeo / Não tem |
| Perfil Google Business | select | Sim / Não |
| Se sim, nota e nº de avaliações | texto | ex: 4.8 estrelas com 127 avaliações |
| Perfil Instagram | select | Sim — ativo e relevante / Sim — pouco ativo / Não |
| Se sim, @ do perfil | texto | ex: @abeak9 |
| Endereço físico | select | Sim / Não |
| Se sim, endereço completo | texto | ex: Rua das Flores, 123 — Pinheiros, São Paulo SP |
| Outros assets | textarea | ex: Vídeo de apresentação, certificados em PDF, fotos do espaço |

> **Regra de negócio visual:** Se Google Business = Não → bloco Avaliações Google não é incluído no Doc 3. Se Instagram = Não ou pouco ativo → Feed Instagram não incluído. Aplicar esta lógica automaticamente ao gerar o prompt.

---

### ETAPA 8 — Integrações

**Objetivo:** Confirmar quais blocos técnicos entram no projeto.

**Checkboxes — marcar apenas o confirmado:**

```
[ ] Google Maps embed — endereço presencial confirmado (etapa 7)
[ ] Google Reviews widget — perfil Google com ≥ 10 avaliações confirmado (etapa 7)
[ ] Feed Instagram — perfil ativo confirmado (etapa 7)
[ ] Formulário Web3Forms — CTA formulário selecionado (etapa 4)
[ ] Botão WhatsApp flutuante — padrão Adsgator, sempre recomendado
[ ] Botão ligação mobile — se telefone foi informado (etapa 4)
[ ] Planos e preços — se cliente forneceu valores e autorizou exibição
[ ] Seção FAQ — se objeções fortes documentadas (etapa 3)
[ ] Contador regressivo — se há prazo ou oferta com data
[ ] Seção Como Funciona — se o processo reduz objeção de "como é isso?"
```

**Campo: Informações de preço / planos** (textarea — exibir apenas se "Planos e preços" marcado)
- Placeholder: `Descreva os planos com valores. Ex:\nPlano Básico — R$497/mês — 2 sessões\nPlano Completo — R$897/mês — 4 sessões + grupo de suporte`

**Campo: Observações técnicas finais** (textarea)
- Placeholder: `Qualquer detalhe técnico adicional: redirecionamentos, subdomínio, integração específica, restrições de deploy`

---

### ETAPA 9 — Revisar & Gerar

**Objetivo:** Validar, revisar e acionar a geração do Doc 3.

**Layout desta etapa:**

**1. Card de validação** — exibir apenas se há campos obrigatórios vazios
- Fundo danger-dim, border danger, lista dos campos pendentes

**2. Resumo do projeto** — grid 3 colunas com cards de todos os campos preenchidos
- Cada card: label em cima + valor em baixo
- Cards clicáveis que voltam para a etapa correspondente

**3. Blocos confirmados** — lista visual dos blocos que entrarão no Doc 3
- Baseado nas respostas das etapas 7 e 8
- Cada item com ícone de check verde

**4. Preview do prompt** — accordion expansível
- Mostra o prompt completo que será enviado ao Gemini
- Botão de copiar
- Label: "Prompt que será enviado ao Gemini"

**5. Configuração da API:**

```
┌────────────────────────────────────────────────────────┐
│  API KEY — GEMINI                                      │
│  Obter chave: aistudio.google.com/app/apikey           │
│                                                        │
│  [••••••••••••••••••••••••]  [👁]  [Salvar]           │
│                                                        │
│  ● API configurada e pronta        ← se válida         │
│  ○ Sem API — modo prompt apenas    ← se vazia          │
└────────────────────────────────────────────────────────┘
```

**6. Botões de ação:**

```
[⬇ Baixar briefing-[slug].md]     [⚡ Gerar Doc 3 com Gemini]
```

- "Baixar briefing" funciona sempre — sem API
- "Gerar Doc 3" requer API key — abre painel de geração

---

## 6. PAINEL DE GERAÇÃO

Modal fullscreen que aparece ao clicar em "Gerar Doc 3".

```
┌──────────────────────────────────────────────────────────┐
│  ⚡ Gerando Doc 3 — [Nome do Cliente]          [× fechar]│
├──────────────────────────────────────────────────────────┤
│                                                          │
│  PROGRESSO  ████████████████░░░░░░░░  75%               │
│                                                          │
│  ✓  Compilando briefing...                               │
│  ✓  Analisando intenção de busca...                      │
│  ⟳  Gerando metadados SEO e fluxo de blocos...          │
│  ○  Construindo especificação por seção...               │
│  ○  Finalizando checklists e assets...                   │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│  O Gemini 2.5 Pro está gerando a Ficha de               │
│  Implementação completa. Isso leva ~30-60 segundos.      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [⬇ Baixar doc3-[slug].md quando pronto]                 │
└──────────────────────────────────────────────────────────┘
```

### Comportamento

- Uma única chamada à API do Gemini para gerar o Doc 3 completo
- Usar `max_tokens: 16000` — o Doc 3 é longo
- Após receber a resposta, oferecer download imediato do `.md`
- Em caso de erro, mostrar mensagem clara e botão "Tentar novamente"
- Sempre oferecer download do `briefing-[slug].md` como fallback

---

## 7. INTEGRAÇÃO COM GEMINI API

### Endpoint e modelo

```javascript
const GEMINI_MODEL    = 'gemini-2.5-pro';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
```

### Função de chamada

```javascript
async function callGemini(apiKey, prompt) {
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 16000,
        temperature: 0.65,
        topP: 0.95,
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Erro HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Resposta vazia da API');
  return text;
}
```

### Tratamento de erros

```javascript
// Exibir no painel de geração — mensagens amigáveis
const ERROR_MESSAGES = {
  429: 'Limite de requisições atingido. Aguarde alguns segundos e tente novamente.',
  400: 'Problema no prompt. Verifique se todos os campos obrigatórios estão preenchidos.',
  403: 'API Key inválida ou sem permissão. Verifique a chave em aistudio.google.com',
  500: 'Erro interno do Gemini. Tente novamente em instantes.',
};
```

---

## 8. PROMPT MESTRE — GERADOR DO DOC 3

Este é o prompt completo enviado ao Gemini. Todos os `[campos]` são substituídos pelos valores do briefing.

```
Você é um Diretor de Arte, UI Designer de elite e Engenheiro Front-end Sênior,
trabalhando para a agência Adsgator.

Sua missão é ler o briefing abaixo na íntegra e gerar como output o
**Documento 3 — Ficha de Implementação**, completo, específico e pronto para
ser enviado ao Roo Code implementar a landing page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGRAS QUE VOCÊ NUNCA VIOLA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Você toma todas as decisões de design que não estão explicitadas:
   tipografia, escala, tokens, animações, layout de cada seção.

2. Você preenche TODOS os campos do Doc 3 com valores concretos.
   Sem placeholders. Sem "[definir depois]". Sem "[a combinar]".

3. O output deve poder ser copiado e enviado ao Roo sem nenhuma edição.

4. Padrão de qualidade: design editorial de alto padrão.
   Pense Raycast, Linear, Family.co. Layouts com intenção.
   Tipografia com personalidade. Animações com razão de existir.
   O site não pode parecer gerado por IA nem template genérico.

5. DNA ADSGATOR — REGRAS INEGOCIÁVEIS DE COPY:
   ✗ Proibido: "inovador", "excelência", "missão", "visão", "somos apaixonados",
     "comprometidos com", "resultados extraordinários", "transforme sua vida"
   ✗ Proibido: "saiba mais", "clique aqui", "solicite um orçamento", "entre em contato"
   ✗ Proibido: inventar depoimentos, avaliações, notas ou qualquer dado não confirmado
   ✗ Proibido: incluir bloco de integração sem o ativo digital confirmado no briefing
   ✓ H1 espelha a Dor #1 do usuário nos primeiros 3 segundos
   ✓ Vender o alívio da dor, não o nome técnico do serviço
   ✓ Especialista conversando olho no olho — firmeza sem arrogância
   ✓ Cada palavra tem função persuasiva — zero texto decorativo

6. STACK TÉCNICA FIXA (nunca propor alternativas):
   Astro + Tailwind CSS + GSAP + ScrollTrigger + Framer Motion + Lenis

7. FORMULÁRIO: usar Web3Forms (não Resend, não Formspree, não EmailJS).
   Access key via .env. Nunca hardcoded.

8. DEPLOY ALVO: Vercel (output: 'static') ou Netlify.

9. REGRAS ABSOLUTAS DE CÓDIGO:
   - Zero HEX hardcoded — sempre via token Tailwind em tailwind.config.js
   - Zero console.log em produção
   - Zero imagem sem width e height definidos
   - Zero animação sem prefers-reduced-motion check
   - Zero credencial hardcoded — sempre via .env
   - Zero <form> HTML nativo em islands React — usar event handlers
   - Zero <div> clicável — usar <button> ou <a>
   - <h1> única por página — sempre no Hero
   - Hierarquia h1 → h2 → h3 — nunca pular nível

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BRIEFING COMPLETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IDENTIFICAÇÃO:
- Cliente: [nome_cliente]
- Slug: [slug]
- Tipo: [tipo — Serviço / Produto]
- Domínio: [dominio]
- Data: [data]

NEGÓCIO:
- Nicho: [nicho]
- Serviço/Produto principal: [servico_produto]
- Objetivo de conversão: [objetivo_conversao]
- Cidade/Região: [cidade]
- Modalidade: [modalidade]
- O que está incluso: [incluso]
- Duração/Formato: [duracao]
- Garantia: [garantia]
- Apresentação: [apresentacao]
- Contexto extra: [contexto_extra]

PÚBLICO:
- Público primário: [publico_primario]
- Público secundário: [publico_secundario]
- Faixa etária: [faixa_etaria]
- Perfil socioeconômico: [perfil_socioeconomico]
- Maturidade: [maturidade]
- Dores principais: [dores]
- Palavras de busca: [palavras_busca]
- Resultado desejado: [resultado_desejado]
- Objeções: [objecoes]

CONVERSÃO:
- Tipo de CTA: [tipo_cta]
- Número WhatsApp: [whatsapp]
- Mensagem pré-preenchida: [mensagem_whatsapp]
- Email formulário: [email_formulario]
- Access Key Web3Forms: [web3forms_key]
- Campos do formulário: [campos_formulario]
- GTM ID: [gtm_id]
- Telefone: [telefone]
- Texto do botão principal: [texto_botao]
- Micro-garantias: [micro_garantias]
- CTAs de rastreamento: [ctas_rastreamento]

TOM DE VOZ:
- Personalidade: [personalidade]
- Vocabulário que usa: [vocab_usa]
- Vocabulário proibido: [vocab_proibido]
- Frase do tom: [frase_tom]

DIREÇÃO VISUAL:
- Intensidade: [intensidade]
- Tema: [tema]
- Referências: [referencias]
- Cor principal: [cor_principal]
- Cor secundária: [cor_secundaria]
- Logo: [logo]
- Estilo geral: [estilo_geral]
- O que não quero: [o_que_nao_quero]
- Menu mobile: [menu_mobile]
- Elemento especial menu: [elemento_menu]

ASSETS:
- Foto profissional/produto: [foto]
- Logo: [logo_status]
- Depoimentos: [depoimentos]
- Google Business: [google_business]
- Nota/avaliações Google: [nota_google]
- Instagram: [instagram]
- @ Instagram: [instagram_handle]
- Endereço: [endereco]
- Endereço completo: [endereco_completo]

INTEGRAÇÕES CONFIRMADAS:
[lista das integrações marcadas]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMATO DE ENTREGA — DOCUMENTO 3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gere o documento exatamente nesta estrutura. Sem resumir. Sem pular seções.

# [Nome Cliente] — Ficha de Implementação

> Documento 3 de 3 — Adsgator
> Gerado a partir do briefing completo pelo LandingAI.
> Copie, cole no Roo e execute — sem edições adicionais,
> exceto os campos listados na Seção 12.

---

## INSTRUÇÃO MESTRE

[Instrução objetiva para o Roo contextualizando o projeto,
reforçando regras absolutas e definindo padrão de qualidade.
Mencionar: stack, deploy, tracking, acessibilidade, prefers-reduced-motion, asset paths.
Mencionar que formulário usa Web3Forms (se aplicável).]

---

## 1. VISÃO GERAL

| Campo | Valor |
|---|---|
| Cliente | [valor] |
| Domínio | [valor] |
| Nicho | [valor] |
| Serviço principal | [valor] |
| Objetivo de conversão | [valor] |
| CTA principal | [valor] |
| WhatsApp | [valor — formato: wa.me/55XXXXXXXXXX] |
| Mensagem WPP codificada | [valor — URL encoded] |
| Link CTA completo | [valor — wa.me completo ou link formulário] |
| Modalidade | [valor] |
| GTM ID | [valor ou "A inserir — ver Seção 12"] |

---

## 2. ANÁLISE DE INTENÇÃO DE BUSCA

[Mapear as 3 dores principais do usuário que pesquisa por este serviço.
Para cada dor:
- Dor real: o que o usuário sente / problema concreto
- Palavra de busca: como ele digita no Google (não o técnico)
- Resultado desejado: o que imagina conquistar
Confirmar que a H1 gerada espelha diretamente a Dor #1.]

---

## 3. METADADOS DE SEO

Landing page (index.astro):
  <title>: "[máximo 60 caracteres — palavra-chave + cidade se local]"
  <meta name="description" content="[máximo 160 caracteres — dor + benefício + CTA implícito]">
  <meta name="keywords" content="[5-8 termos relevantes]">
  <meta property="og:title" content="[igual ou adaptado do title]">
  <meta property="og:description" content="[igual ou adaptado da description]">
  <meta property="og:image" content="/assets/images/og-image.webp">
  <meta property="og:url" content="https://[domínio]">
  <link rel="canonical" href="https://[domínio]">

/links (links/index.astro):
  <title>: "[máximo 60 caracteres]"
  <meta name="description" content="[máximo 100 caracteres — foco em conversão direta]">
  <meta name="robots" content="noindex">

/politica-de-privacidade:
  <title>: "Política de Privacidade — [Nome Cliente]"
  <meta name="robots" content="noindex">

/404:
  <meta name="robots" content="noindex">

---

## 4. STACK TÉCNICA

[Stack confirmada para este projeto com decisões específicas:
- Confirmar uso de React (sim/não — justificar quais componentes precisam de ilha)
- Confirmar GSAP (quais seções usam)
- Confirmar Framer Motion (quais componentes)
- Confirmar Lenis
- Confirmar Web3Forms se formulário ativo
- Versões dos packages: Astro ^4.x, Tailwind ^3.x, GSAP ^3.x]

### package.json — dependências completas

[JSON completo do package.json com todas as dependências necessárias para este projeto]

### astro.config.mjs — completo

[Código completo do astro.config.mjs com:
- output: 'static'
- site: 'https://[domínio]'
- integrations: tailwind, sitemap (com excludes)
- vite alias ~]

### .env.example — completo

[Todas as variáveis com comentário — sem valores reais:
GTM_ID=GTM-XXXXXXX
WHATSAPP_NUMBER=
WEB3FORMS_ACCESS_KEY= (se formulário)
INSTAGRAM_TOKEN= (se feed)
GOOGLE_MAPS_API_KEY= (se mapa)]

### robots.txt

[Conteúdo completo do public/robots.txt]

---

## 5. SISTEMA DE DESIGN

### tailwind.config.js — completo

[Arquivo completo com:
- colors: tokens com HEX reais decididos pela IA — mínimo: primary, secondary,
  background, surface, text-dark, text-light, text-muted, border
- fontFamily: heading, display, sans, mono (conforme fontes escolhidas)
- fontSize: escala customizada com clamp() reais
- spacing: tokens extras se necessário
- borderRadius: tokens para botões, cards, avatares
- maxWidth, height: tokens customizados se necessário]

### Tipografia — decisão completa

[Fontes escolhidas com justificativa de 1 linha cada.
Instalação via npm @fontsource:
  npm install @fontsource/[fonte-1] @fontsource/[fonte-2]
Importação no Layout.astro:
  import '@fontsource/[fonte]/[peso].css'
Escala de tamanhos com clamp() reais para cada nível]

### Ícones

[Biblioteca: lucide-react (padrão) ou heroicons — definir uma só.
Estilo: outline ou solid — manter em 100% das instâncias.
strokeWidth: [valor concreto — ex: 1.5]
Tamanho padrão: [ex: 20px — h-5 w-5]]

### Sistema de Animação

[Tokens GSAP para este projeto:
- Duração padrão por tipo de elemento
- Easing padrão
- Delay de stagger
- Trigger de ScrollTrigger (start, end)

Tokens Framer Motion:
- Variantes para entrada (hidden → visible)
- Spring config para CTAs
- AnimatePresence config para menu mobile

Confirmação: prefers-reduced-motion check obrigatório em TODAS as animações GSAP:
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) { /* animação */ }]

---

## 6. COMPONENTES GLOBAIS

[Lista definitiva dos componentes a criar ANTES das seções.
Para cada um: nome do arquivo, tipo (Astro / React), props com tipos, responsabilidade.

Componentes obrigatórios:
- Layout.astro — shell global
- GTM.astro — snippets head + body (is:inline)
- Button.astro — props: label, href, variant, tracking-id
- SectionHeader.astro — props: label, title, subtitle
- FeatureCard.astro — props: icon, title, description
- WhatsAppFloat.astro — botão flutuante sempre presente
- MobileMenu.tsx — island React com Framer Motion AnimatePresence
- [outros específicos deste projeto]

Para cada componente: código completo ou especificação suficiente para implementação sem dúvidas.]

---

## 7. INFRAESTRUTURA DE RASTREAMENTO

### GTM.astro — código completo

[Código completo do componente com is:inline:
- Head snippet (antes do </head>)
- Body snippet (depois do <body>)]

### Mapa de eventos

| Evento | Ativação | data-tracking |
|---|---|---|
| contato_wpp | Clique em qualquer link WhatsApp | contato_wpp |
| view_content | Pageview da landing | automático GTM |
| view_links | Pageview da /links | automático GTM |
| [outros definidos no briefing] | ... | ... |

### CTAs — lista completa

[Todos os CTAs da página com id e data-tracking definidos:
  id="cta-hero-primary" data-tracking="contato_wpp"
  id="cta-nav-desktop" data-tracking="contato_wpp"
  etc.]

---

## 8. UX & PERFORMANCE

### Lenis — configuração completa

[Código de inicialização completo no Layout.astro:
- import e setup do Lenis
- integração com GSAP ScrollTrigger (lenis.on('scroll', ScrollTrigger.update))
- RAF loop]

### Menu mobile — especificação detalhada

[Tipo escolhido: [fullscreen / drawer / bottom sheet]
Elemento especial: [definido no briefing]
Código completo do MobileMenu.tsx com:
- Framer Motion AnimatePresence
- Estado open/close
- Itens de navegação
- CTA em destaque
- Fechamento por ESC e clique fora
- aria-expanded, aria-controls para acessibilidade]

### Scroll suave

[Configuração Lenis completa com valores concretos]

### Performance targets

- Lighthouse Performance ≥ 90 mobile
- Zero layout shift em imagens (width e height sempre definidos)
- Fontes via @fontsource (sem flash de texto)
- Imagens em .webp com lazy loading (exceto acima do fold)

---

## 9. PROIBIÇÕES VISUAIS

[Globais Adsgator + proibições específicas deste projeto baseadas nas referências e direção:]

Globais:
- Zero HEX hardcoded no código
- Zero console.log em produção
- Zero imagem sem width e height
- Zero animação sem prefers-reduced-motion
- Zero credencial ou token hardcoded
- Zero <form> nativo em islands React
- Zero <div> clicável no lugar de <button> ou <a>
- H1 única — sempre no Hero

Específicas deste projeto:
[Listar as proibições visuais específicas baseadas no "O que não quero" do briefing]

---

## 10. ASSETS DO PROJETO

[Para cada imagem usada na página:
- nome: seguindo convenção src/assets/images/*.webp
- dimensões exatas em pixels
- proporção (ex: 4:5, 16:9)
- tratamento (ex: cor natural / preto e branco / fundo removido)
- loading: eager (acima fold) ou lazy
- label do placeholder enquanto a imagem real não chega

Instrução de uso da logo:
- Tamanho no header desktop e mobile
- Tamanho no footer
- Tamanho na /links

og-image (public/og-image.webp):
- Dimensões: 1200×630px
- O que deve aparecer: [composição específica baseada no projeto]
- Cor de fundo: [baseado na paleta]

manifest.json:
[Conteúdo completo para PWA básico]]

---

## 11. FLUXO DE BLOCOS

[Lista dos blocos na ordem da página com justificativa de 1 linha para cada:

Blocos disponíveis — incluir apenas os sustentados pelo briefing:
- Cabeçalho — sempre
- Hero — sempre
- O Serviço — sempre
- Diferenciais — sempre
- Como Funciona — se processo reduz objeção
- Planos e Preços — apenas se valores fornecidos e autorizados
- Prova Social — apenas se depoimentos reais confirmados
- Avaliações Google — apenas se Google Business com ≥ 10 avaliações
- Feed Instagram — apenas se perfil ativo confirmado
- FAQ — se objeções fortes documentadas
- Localização + Mapa — apenas se endereço físico confirmado
- CTA Final — sempre
- Rodapé — sempre
- /links — sempre
- /politica-de-privacidade — sempre
- /404 — sempre]

---

## 12. ESPECIFICAÇÃO POR SEÇÃO

> REGRA CRÍTICA: É TERMINANTEMENTE PROIBIDO resumir a copy.
> Transcreva a copy exata, palavra por palavra, e então adicione Layout, Tipografia e Animação.

[Para CADA seção — incluindo /links, /politica-de-privacidade e /404:]

### SEÇÃO: [Nome]

**Copy:**
[Toda a copy desta seção gerada com base no briefing — seguindo DNA Adsgator.
Tom de voz: [personalidade definida no briefing].
Vocabulário obrigatório: [vocab_usa].
Vocabulário proibido: [vocab_proibido].]

**Implementação:**
- Arquivo: [src/pages/index.astro / src/components/[Nome].astro / src/components/[Nome].tsx]
- Layout: [classes Tailwind exatas — mobile e desktop com breakpoints explícitos]
- Fundo: [token Tailwind — ex: bg-background]
- Tipografia: [classes exatas por elemento — H1, H2, body, label, small]
- Espaçamento: [py-X, px-Y, gap-Z, max-w-X — valores concretos]
- Imagem: [especificação completa ou placeholder]
- Componentes usados: [quais componentes globais]
- Animação de entrada: [trigger + valores concretos GSAP ou Framer Motion]
- Integração (se houver): [instrução técnica completa]
- Responsivo: [classes mobile → md → lg explícitas]
- Export: [nome do componente — ex: export default HeroSection]
- Rastreamento: [ids e data-attributes de todos os CTAs desta seção]

---

## 13. CHECKLIST DE ENTREGA

### Antes de codificar
[ ] Todos os assets em src/assets/images/ com nomes corretos
[ ] .env com variáveis: GTM_ID, WHATSAPP_NUMBER, WEB3FORMS_ACCESS_KEY (se aplicável)
[ ] Fontes instaladas via npm @fontsource
[ ] tailwind.config.js configurado com todos os tokens

### Durante a implementação
[ ] Layout.astro com GTM (is:inline), Lenis, SEO tags, WhatsApp flutuante
[ ] Todos os componentes globais criados antes das seções
[ ] Zero HEX hardcoded — sempre via token
[ ] Todos os botões com id e data-tracking
[ ] prefers-reduced-motion check em todas as animações GSAP
[ ] Web3Forms integrado se formulário ativo

### Antes de entregar
[ ] npm run build sem erros
[ ] Lighthouse Performance ≥ 90 mobile
[ ] Todas as imagens com width e height (zero layout shift)
[ ] Links WhatsApp testados (formato wa.me/55XXXXXXXXXXX)
[ ] Menu mobile testado em 375px
[ ] Smooth scroll funcionando (Lenis + GSAP sync)
[ ] GTM verificado no head E no body
[ ] Conversões mapeadas no GTM
[ ] /links funcionando
[ ] /404 ativa
[ ] og-image testada (opengraph.xyz)
[ ] CNPJ e ano dinâmico no rodapé
[ ] Zero console.log em produção
[ ] sitemap.xml gerado
[ ] robots.txt correto

---

## 14. LOCAIS QUE EXIGEM AÇÃO HUMANA

[Lista clara e numerada de TODOS os pontos onde agência ou cliente
precisam inserir informação real antes de publicar:]

[ ] Substituir [nome-do-placeholder].webp pela imagem real em src/assets/images/
[ ] Inserir GTM-XXXXXXX real no .env
[ ] Inserir access key Web3Forms no .env (se formulário)
[ ] Confirmar número WhatsApp: [número informado no briefing]
[ ] Revisar e aprovar copy de cada seção com o cliente
[ ] Inserir depoimentos reais (se bloco ativo)
[ ] Confirmar endereço para embed Maps (se bloco ativo)
[ ] Inserir token Instagram no .env (se feed ativo)
[ ] Publicar og-image.webp real (1200×630)
[ ] Confirmar domínio final em astro.config.mjs e robots.txt
[ ] Testar conversão contato_wpp no painel Google Ads
```

---

## 9. ARQUIVO BRIEFING-[SLUG].MD (modo sem API)

Gerado localmente sem precisar de API. Contém o briefing estruturado + o prompt completo.

### Estrutura

```markdown
# Briefing — [Nome do Cliente]

**Slug:** [slug]
**Data:** [data]
**Tipo:** [Serviço / Produto]
**Domínio:** [domínio]

---

## Dados do Projeto

[tabela com todos os campos preenchidos]

## Público & Intenção

[todos os campos]

## Conversão

[todos os campos]

## Tom de Voz

[todos os campos]

## Direção Visual

[todos os campos]

## Assets & Integrações

[todos os campos]

---

## Prompt Completo para Geração do Doc 3

> Cole o conteúdo abaixo em qualquer IA (Gemini, Claude, GPT) para gerar
> a Ficha de Implementação completa.

[prompt completo com todos os valores preenchidos — pronto para usar]

---
*Gerado pelo LandingAI — Adsgator*
*[data e hora]*
```

### Download

```javascript
function downloadBriefingMD(content, slug) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `briefing-${slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadDoc3MD(content, slug) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `doc3-${slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

---

## 10. ESTADO GLOBAL E PERSISTÊNCIA

### Objeto App

```javascript
const App = {
  currentStep: 1,
  totalSteps: 9,
  apiKey: localStorage.getItem('landingai_gemini_key') || '',
  mode: 'api', // 'api' | 'prompt'
  chips: {},   // group -> [valores selecionados]
  selCards: {},// group -> valor único selecionado
  generatedDoc3: '',

  briefing: {
    // Etapa 1
    tipo: '', nome_cliente: '', slug: '', dominio: '', data: '',

    // Etapa 2
    nicho: '', servico_produto: '', objetivo_conversao: '',
    cidade: '', modalidade: '', incluso: '', duracao: '',
    garantia: '', apresentacao: '', contexto_extra: '',

    // Etapa 3
    publico_primario: '', publico_secundario: '',
    faixa_etaria: '', perfil_socioeconomico: '', maturidade: '',
    dores: '', palavras_busca: '', resultado_desejado: '', objecoes: '',

    // Etapa 4
    tipo_cta: '', whatsapp: '', mensagem_whatsapp: '',
    email_formulario: '', web3forms_key: '', campos_formulario: [],
    gtm_id: '', telefone: '', texto_botao: '',
    micro_garantias: '', ctas_rastreamento: [],

    // Etapa 5
    personalidade: '', vocab_usa: '', vocab_proibido: '', frase_tom: '',

    // Etapa 6
    intensidade: '', tema: '', referencias: '', cor_principal: '',
    cor_secundaria: '', logo_status: '', estilo_geral: '',
    o_que_nao_quero: '', menu_mobile: '', elemento_menu: '',

    // Etapa 7
    foto: '', logo_arquivo: '', depoimentos: '',
    google_business: '', nota_google: '', instagram: '',
    instagram_handle: '', endereco: '', endereco_completo: '',
    outros_assets: '',

    // Etapa 8
    integracoes: [], info_precos: '', obs_tecnicas: '',
  }
};
```

### Autosave

```javascript
// Debounced — 500ms após qualquer mudança de campo
function autosave() {
  localStorage.setItem('landingai_draft', JSON.stringify({
    savedAt: new Date().toISOString(),
    briefing: App.briefing,
    chips: App.chips,
    selCards: App.selCards,
  }));
}

// Banner ao abrir se rascunho existe
function checkDraft() {
  const raw = localStorage.getItem('landingai_draft');
  if (!raw) return;
  const { savedAt } = JSON.parse(raw);
  const hora = new Date(savedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  showDraftBanner(`Rascunho encontrado — salvo às ${hora}`, onRestore, onDiscard);
}
```

---

## 11. VALIDAÇÕES

### Campos obrigatórios por etapa

```javascript
const REQUIRED = {
  1: ['tipo', 'nome_cliente', 'slug'],
  2: ['nicho', 'servico_produto', 'objetivo_conversao', 'cidade', 'apresentacao'],
  3: ['publico_primario', 'dores', 'palavras_busca', 'resultado_desejado', 'objecoes'],
  4: ['tipo_cta', 'texto_botao'],
  5: ['personalidade'],
  6: ['referencias', 'estilo_geral', 'o_que_nao_quero'],
  7: [],
  8: [],
  9: [],
};

// Validação condicional etapa 4
// Se tipo_cta === 'whatsapp' → obrigatório: whatsapp, mensagem_whatsapp
// Se tipo_cta === 'formulario' → obrigatório: email_formulario
// Se tipo_cta === 'agendamento' → obrigatório: link_agendamento
```

### Sanitização do slug

```javascript
function sanitizeSlug(val) {
  return val
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
// Aplicar: onInput no campo nome_cliente → auto-preenche slug
// Slug é editável manualmente
```

---

## 12. TOAST DE NOTIFICAÇÕES

```javascript
function showToast(msg, type = 'default', duration = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast toast-${type} visible`;
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('visible'), duration);
}
```

```css
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  background: var(--bg-overlay); border: 1px solid var(--border-muted);
  color: var(--text-primary); padding: 12px 20px;
  border-radius: var(--r-md); font-size: 13px;
  transform: translateY(20px); opacity: 0;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  pointer-events: none; max-width: 340px;
}
.toast.visible { transform: translateY(0); opacity: 1; }
.toast.toast-success { border-color: var(--accent-border); color: var(--accent); }
.toast.toast-error   { border-color: rgba(255,107,107,0.3); color: var(--danger); }
.toast.toast-warning { border-color: rgba(255,181,71,0.3); color: var(--warning); }
```

---

## 13. README.md

```markdown
# LandingAI — Adsgator

Sistema interno de geração de briefing e Ficha de Implementação (Doc 3)
para projetos Astro da Adsgator.

## Como usar

1. Abra index.html no Chrome ou Edge
2. Obtenha API Key Gemini em: https://aistudio.google.com/app/apikey
3. Preencha as 8 etapas de briefing
4. Na etapa 9: baixe o briefing.md (sem API) ou gere o Doc 3 completo (com API)
5. Envie o doc3-[slug].md ao Roo para implementação

## Modos

**Com API Gemini:** Gera o Doc 3 completo pronto para o Roo
**Sem API:** Gera briefing-[slug].md com o prompt para uso manual

## O que o Doc 3 contém

- Instrução mestre para o Roo
- Metadados SEO prontos para copiar
- Stack técnica com package.json, astro.config.mjs, .env.example, robots.txt
- tailwind.config.js completo com tokens reais
- Sistema de animação (GSAP + Framer Motion)
- Componentes globais especificados
- Copy completa de cada seção
- Rastreamento GTM mapeado
- Checklist de entrega
- Lista de ações humanas necessárias

## Stack dos projetos gerados

Astro · Tailwind CSS · GSAP · Framer Motion · Lenis · Web3Forms
Deploy: Vercel ou Netlify (output: static)
```

---

## 14. CHECKLIST DE IMPLEMENTAÇÃO DO SISTEMA

Implementar nesta ordem:

- [ ] 1. Estrutura de pastas e arquivos base
- [ ] 2. CSS completo: variáveis, reset, componentes base
- [ ] 3. Layout: sidebar + topbar + content — HTML estático
- [ ] 4. Navegação entre etapas com atualização de sidebar e progress bar
- [ ] 5. Etapa 1 — Identificação com auto-geração de slug
- [ ] 6. Etapa 2 — Negócio com campos condicionais (serviço vs produto)
- [ ] 7. Etapa 3 — Público
- [ ] 8. Etapa 4 — Conversão com campos condicionais por tipo de CTA
- [ ] 9. Etapa 5 — Tom de voz com bloco DNA Adsgator fixo
- [ ] 10. Etapa 6 — Direção visual com cards de estética
- [ ] 11. Etapa 7 — Assets
- [ ] 12. Etapa 8 — Integrações com checkboxes condicionais
- [ ] 13. Etapa 9 — Revisão com summary grid + validação
- [ ] 14. Sistema de chips (multi e single)
- [ ] 15. Cards de seleção única (sel-card)
- [ ] 16. Objeto App e autosave com localStorage
- [ ] 17. Restauração de rascunho com banner
- [ ] 18. Gerador do briefing-[slug].md (sem API)
- [ ] 19. Integração API Gemini
- [ ] 20. Montagem do prompt mestre com todos os valores interpolados
- [ ] 21. Painel de geração com progress animado
- [ ] 22. Download do doc3-[slug].md
- [ ] 23. Toast de notificações
- [ ] 24. README.md
- [ ] 25. Teste end-to-end com projeto fictício

---

## 15. NOTAS FINAIS

**Web3Forms** é a solução de formulário. Documentação: `https://web3forms.com/docs`.
A access key fica no `.env` do projeto Astro gerado — nunca no código.

**O prompt mestre é o coração do sistema.** Quanto mais completo o briefing,
mais preciso e menos revisão o Doc 3 vai precisar. Incentivar o operador
a preencher todos os campos, mesmo os opcionais.

**O Doc 3 vai direto ao Roo.** Nenhuma edição manual entre a geração
e o envio ao Roo — esse é o padrão de qualidade que o sistema deve sustentar.

**Regra de negócio crítica:** blocos de Google Reviews, Instagram Feed,
Localização/Mapa e Depoimentos só entram no Doc 3 se os assets
foram confirmados nas etapas 7 e 8. O sistema aplica essa lógica
automaticamente antes de montar o prompt.

---

*IMPLEMENTACAO-LANDINGAI-v2.md*
*LandingAI · Adsgator · Stack: Astro + Tailwind + GSAP + Framer Motion + Lenis + Web3Forms*
