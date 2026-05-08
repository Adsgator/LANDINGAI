# IMPLEMENTAÇÃO 04 — DOC-1 Otimizado para Uso Externo
## Adicionar seção de prompt e template para Claude/Gemini

**Arquivo alvo:** `assets/js/04-handlers.js`  
**Arquivo alvo:** `assets/js/screens/review.js`  
**Risco:** BAIXO  
**Depende de:** ETAPA 1

---

## O QUE MUDA

1. `buildDoc1()` — adiciona seção ao final com instruções de uso externo
2. `downloadDoc1()` — valida se DOC-1 foi gerado antes de fazer download
3. Botão de download DOC-1 fica visível e funcional

---

## PARTE A — Localizar `buildDoc1()` em `04-handlers.js`

Procure por (linha ~6387):

```javascript
buildDoc1() {
  return `...`;
},
```

### ENCONTRAR O FINAL DO MÉTODO e ADICIONAR SEÇÃO

Procure pela última linha do método (deve terminar com \`.trim();\`). 

Antes do `.trim();`, adicione esta seção gigante:

```javascript
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
\`"Quer que eu gere a Ficha de Implementação em 4 partes?"\`

5. Responda com:
\`\`\`
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
\`\`\`

6. Copie as 4 partes geradas e salve em arquivos separados

### Opção 2: Usar com Gemini

1. Copie **TODO** o conteúdo deste arquivo
2. Abra https://gemini.google.com
3. Cole o conteúdo em uma nova conversa
4. Envie a mensagem

Gemini vai ler e responder:
\`"Entendi. Esta é uma ficha estruturada. Quer gerar a implementação?"\`

5. Responda com:
\`\`\`
Gere a Ficha de Implementação em 4 partes modulares, cada uma sendo um arquivo .md independente.

PARTE 1: Config + Estrutura (30-50KB)
PARTE 2: Layout + UI Components (20-30KB)
PARTE 3: Sections da LP + Animações (40-60KB)
PARTE 4: Integrações + Deploy (15-25KB)

Siga rigorosamente a estrutura de pastas proposta.
\`\`\`

6. Copie as 4 partes e salve em arquivos separados

### Opção 3: Usar com Grok (xAI)

1. Copie **TODO** o conteúdo deste arquivo
2. Abra https://x.com/grok (ou acesse via app xAI)
3. Cole o conteúdo
4. Grok vai processar e gerar a implementação em 4 partes

### Opção 4: Copiar para seu IDE com AI Assistant

Se usa VS Code + GitHub Copilot ou Cursor:

1. Copie este arquivo
2. Crie um novo arquivo chamado \`BRIEF.md\` no seu projeto
3. Cole o conteúdo
4. Abra o Chat do Copilot/Cursor
5. Digite: \`@BRIEF Gere a Ficha de Implementação em 4 partes\`

---

## Para Desenvolvedores

### O que fazer depois de receber as 4 partes:

1. **Salve em arquivos separados:**
   - \`doc-impl-parte1-[slug].md\`
   - \`doc-impl-parte2-[slug].md\`
   - \`doc-impl-parte3-[slug].md\`
   - \`doc-impl-parte4-[slug].md\`

2. **Clone o template Astro:**
   \`\`\`bash
   git clone https://github.com/adsgator/astro-landingai-template
   cd landing-page
   npm install
   \`\`\`

3. **Use com Roo Code:**
   \`\`\`bash
   roo --load-instructions BRIEF.md
   # ou
   roo --add-rules doc-impl-parte1-[slug].md
   \`\`\`

4. **Implemente cada parte em sequência:**
   - Parte 1: Setup inicial, pastas, config
   - Parte 2: Layout base, componentes reutilizáveis
   - Parte 3: Seções da LP, estilização
   - Parte 4: Integrações, animations, deploy

5. **Build e teste:**
   \`\`\`bash
   npm run dev      # Desenvolvimento
   npm run build    # Build final
   npm run preview  # Preview produção
   \`\`\`

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
- Padronize os nomes: \`doc-impl-parte[1-4]-[slug].md\`
- Certifique-se que cada parte tem entre 20-60KB

**"Código não roda depois de implementar"**
- Confira o \`.clinerules\` na Parte 1
- Verifique que \`astro.config.mjs\` bate com a config
- Rode \`npm install\` novamente
- Check logs de build: \`npm run build\`

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
| Gerado | ${new Date().toLocaleDateString('pt-BR')} |

`;
}
```

---

## PARTE B — Atualizar `downloadDoc1()` em `04-handlers.js`

Procure por `downloadDoc1()` (linha ~5700 aprox ou busque por `downloadDoc1`):

```javascript
downloadDoc1() {
  ...
},
```

**Substituir completamente por:**

```javascript
downloadDoc1() {
  // Validar que DOC-1 pode ser gerado
  const doc1 = this.buildDoc1();

  if (!doc1 || doc1.length < 100) {
    this.showToast('⚠️ DOC-1 não pode ser gerado. Complete todos os steps primeiro.', 'warning');
    return;
  }

  // Criar slug do projeto
  const slug = (this.B?.nome_projeto || 'landing-page')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

  // Criar blob e download
  const blob = new Blob([doc1], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = \`doc1-\${slug}-\${new Date().toISOString().split('T')[0]}.md\`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Feedback ao usuário
  this.showToast('✓ DOC-1 baixado com sucesso! Copie para Claude ou Gemini.', 'success');
},
```

---

## PARTE C — Atualizar o template HTML da tela Review

Na tela de Review, procure por onde o botão de download DOC-1 é renderizado (busque por `btn-download-doc1` ou similar):

**Encontrar:**

```javascript
<button class="btn-ghost" id="btn-download-doc1">
  <i data-lucide="download" style="width:14px;height:14px;"></i> Baixar DOC-1
</button>
```

**Atualizar para:**

```javascript
<button class="btn-primary" id="btn-download-doc1" title="Baixe este documento e copie para Claude, Gemini ou sua IA preferida">
  <i data-lucide="download" style="width:14px;height:14px;"></i> Baixar DOC-1 (Para IA Externa)
</button>
```

---

## PARTE D — Adicionar título/descrição na tela Review

Procure pela seção donde a review começa. Adicione um card informativo:

```javascript
// Adicionar antes do botão de download
const infoDocCard = \`
  <div class="doc-info-card">
    <div class="info-header">
      <i data-lucide="info" style="width:18px;height:18px;color:var(--accent2);"></i>
      <span>O que é DOC-1?</span>
    </div>
    <p class="info-text">
      DOC-1 é um arquivo Markdown com todo o briefing estruturado. Você pode copiar este documento 
      e passar para Claude, Gemini, Grok ou qualquer IA para gerar a implementação em 4 partes.
    </p>
    <p class="info-text info-subtext">
      Não precisa de API Key. Funciona 100% externamente.
    </p>
  </div>
\`;
```

Adicione ao CSS em `03-screens.css`:

```css
.doc-info-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(167, 139, 250, 0.08);
  border: 1px solid rgba(167, 139, 250, 0.2);
  margin-bottom: 1.5rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent2);
}

.info-text {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.info-subtext {
  font-size: 12px;
  color: var(--text-disabled);
  font-style: italic;
}
```

---

## PARTE E — Garantir que Botão de Download está funcional

No método `renderReviewScreen()` ou similiar, procure por onde os listeners são registrados:

```javascript
// Procure por algo como:
document.getElementById('btn-download-doc1')?.addEventListener('click', ...);

// Se não existir, adicione:
document.getElementById('btn-download-doc1')?.addEventListener('click', () => {
  this.downloadDoc1();
});
```

---

## CHECKLIST DE VALIDAÇÃO

Após implementar, testar:

- [ ] Na tela de Review, há um card "O que é DOC-1?"
- [ ] Botão "Baixar DOC-1" está visível e não desabilitado
- [ ] Clicando no botão, faz download de um arquivo `.md`
- [ ] Arquivo tem nome como \`doc1-[slug]-[data].md\`
- [ ] Arquivo tem todo o conteúdo do briefing + seção de "Como Usar"
- [ ] Seção de "Como Usar" tem instruções para Claude, Gemini, Grok
- [ ] Instruções incluem o template para usar com Roo Code
- [ ] Toast de sucesso aparece após download
- [ ] Tamanho do arquivo é > 50KB (significa que tem conteúdo suficiente)

---

## TESTE PRÁTICO

1. Preencha todos os 8 steps
2. Aprove a direção de arte
3. Aprove a estrutura
4. Vá para Review
5. Clique em "Baixar DOC-1"
6. Abra o arquivo em um editor
7. Selecione tudo (Ctrl+A)
8. Copie (Ctrl+C)
9. Abra Claude.ai
10. Cole o conteúdo (Ctrl+V)
11. Peça: "Gere a Ficha de Implementação em 4 partes"
12. Claude deve responder reconhecendo a estrutura

Se tudo isso funcionar, DOC-1 está perfeito! ✅

---

## RESULTADO

✅ DOC-1 é um prompt completo e funcional  
✅ Usuário consegue usar com qualquer IA externa  
✅ Não depende de API Key interna  
✅ Sistema é flexível — suporta múltiplas IAs  
✅ Modo "offline" agora é 100% viável

Próxima etapa: **ETAPA 4 — Fluxo de Estrutura**
