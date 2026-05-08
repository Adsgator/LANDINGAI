# 📋 LANDINGAI — Auditoria e Melhorias Operacionais

**Versão:** 2.0.1  
**Data:** 2026-05-08  
**Escopo:** Correções de bugs, melhorias visuais, limpeza de arquivos

---

## 🎯 **Resumo Executivo**

O sistema está 95% funcional. Este documento lista 5 melhorias operacionais que deixarão o projeto **redondo** sem alterar nenhuma lógica core.

**Tempo estimado:** 2-3 horas  
**Risco:** Mínimo (mudanças isoladas)

---

## ✅ **MELHORIA 1: Carregar Biblioteca Lucide Icons**

### **Problema**
Os ícones não renderizam porque a biblioteca não está carregada. Aparecem placeholders vazios.

```
Atual: <i data-lucide="zap" class="logo-icon"></i>
Renderizado: [vazio]
```

### **Solução**
Adicionar tag `<script>` que carrega Lucide automaticamente.

### **Implementação**

**Arquivo:** `index.html`  
**Linha:** Após `</head>`, antes de `</body>`

Adicione esta linha:
```html
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    // Renderizar todos os ícones Lucide na página
    lucide.createIcons();
    // Re-renderizar quando conteúdo dinâmico é adicionado
    const observer = new MutationObserver(() => lucide.createIcons());
    observer.observe(document.body, { childList: true, subtree: true });
  </script>
```

**Localização exata:**
```html
  </head>

  <body>
    <!-- Seu conteúdo HTML -->
    
    <script src="https://unpkg.com/lucide@latest"></script>
    <script>
      lucide.createIcons();
      const observer = new MutationObserver(() => lucide.createIcons());
      observer.observe(document.body, { childList: true, subtree: true });
    </script>
  </body>
</html>
```

### **Validação**
- [ ] Abrir `index.html` no Chrome
- [ ] Verificar se os ícones aparecem (zap, folder, menu, etc)
- [ ] Clicar em "Adicionar Referência" na tela de Arte → ícone deve aparecer
- [ ] Verificar no console se não há erros 404

---

## ✅ **MELHORIA 2: Remover Arquivo Vazio `steps.js`**

### **Problema**
`assets/js/screens/steps.js` está vazio e pode causar confusão.

### **Investigação Prévia**
Verificar se `app.js` ou algum arquivo referencia `steps.js`:
```bash
grep -r "steps.js" assets/js/
grep -r "buildStepsScreen\|renderSteps" assets/js/
```

### **Solução**
Se **nenhuma referência** for encontrada → deletar o arquivo.

Se **houver referência** → movimentar o conteúdo para `estrutura.js` e deletar.

### **Implementação**

1. Abrir `assets/js/screens/steps.js`
2. Verificar se está vazio ou se tem conteúdo
3. **Se vazio:**
   - Deletar arquivo
   - Verificar `index.html` (não deve ter `<script src="assets/js/screens/steps.js">`)
   - Verificar `app.js` (não deve ter importação desse arquivo)

4. **Se tiver conteúdo:**
   - Copiar para `estrutura.js`
   - Deletar `steps.js`
   - Atualizar todas as referências

### **Validação**
- [ ] Sistema continua funcionando após deleção
- [ ] Nenhum erro no console sobre "steps.js not found"
- [ ] Todas as screens (Intake, Step, Review, Art, etc) funcionam

---

## ✅ **MELHORIA 3: Documentar `modules/google-ads/` para Fase Futura**

### **Problema**
Pasta existe mas está vazia. Sem documentação do que vai ser implementado.

### **Solução**
Criar `modules/google-ads/README.md` com especificação clara.

### **Implementação**

**Arquivo:** `modules/google-ads/README.md`

```markdown
# Google Ads Project — Módulo de Campanha Automática

**Status:** Planejamento (Fase 2)  
**Versão:** 1.0.0 (draft)

## 📌 Descrição

Este módulo automatiza a criação e otimização de campanhas Google Ads usando contexto das Landing Pages criadas no LandingAI.

## 🎯 Funcionalidades (Roadmap)

### MODO 1: Criação de Estratégia ✅ Planejado
- Puxar contexto da LP criada (briefing + URL)
- Gerar estratégia JSON com:
  - Perfil de Compra
  - Metas de Conversão
  - Divisão de Verba
  - Estrutura de Campanhas/Grupos/Keywords
  - Anúncios com copy otimizado
- Dashboard visual com copy-to-clipboard
- Exportar direto para CSV (Google Ads Editor format)

### MODO 2: Otimização de Campanha ✅ Planejado
- Input: Relatório bruto do Google Ads (texto)
- Output: JSON com ações (pausar, escalar, testar)
- Dashboard verde/vermelho para decisões rápidas

## 📂 Estrutura (Placeholder)

```
modules/google-ads/
├── README.md (este arquivo)
├── structure.md (arquitetura detalhada)
├── prompt-framework.md (system prompts da IA)
├── css/ (estilos do módulo)
├── js/ (lógica JavaScript)
└── templates/ (JSONs de exemplo)
```

## 🔄 Integração com LandingAI

O módulo reutiliza:
- Sistema de API Keys (`00-config.js`)
- Contexto armazenado em localStorage (`briefing_bruto`)
- UI pattern (modals, cards, chips)
- Utilitários de estado (`01-state.js`)

## 📅 Próximas Etapas

1. ✅ Documentação (FEITO)
2. ⏳ Especificação JSON (Fase 2)
3. ⏳ Desenvolvimento de componentes UI (Fase 3)
4. ⏳ Integração com IA (Fase 4)
5. ⏳ Testes e validação (Fase 5)

---

*Este módulo será implementado quando a v2.0 do LandingAI estiver completamente estável.*
```

**Localização:** `modules/google-ads/README.md`

### **Validação**
- [ ] Arquivo criado em local correto
- [ ] Readable em qualquer editor

---

## ✅ **MELHORIA 4: Corrigir Bug de Scroll ao Adicionar Referência**

### **Problema**
Quando clica em "Adicionar Referência" na tela de Arte, a página sobe (scroll para topo).

### **Causa Provável**
Evento de clique está recarregando ou refocando elemento fora da viewport.

### **Investigação**

Abrir `assets/js/04-handlers.js` e procurar por:
```javascript
// Procurar por:
"Adicionar Referência"
"add reference"
"addReference"
"new reference"
"data-action" // se houver botão com action
```

### **Solução**

Quando encontrar o handler do botão "Adicionar Referência":

**Antes (Problema):**
```javascript
document.getElementById('btn-add-reference').onclick = function() {
  // código que causa scroll
  window.scrollTo(0, 0); // ← DELETAR ISSO
  // ou
  location.hash = '#'; // ← DELETAR ISSO
};
```

**Depois (Corrigido):**
```javascript
document.getElementById('btn-add-reference').addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // Detectar posição atual do scroll
  const scrollPos = window.scrollY;
  
  // Sua lógica de adicionar referência
  // ... código aqui ...
  
  // Restaurar scroll depois
  setTimeout(() => {
    window.scrollTo(0, scrollPos);
  }, 0);
});
```

**Se for renderização dinâmica:**
```javascript
// Quando renderizar novas referências, não recarregue todo o DOM
// Use:
element.insertAdjacentHTML('beforeend', htmlString); // ✅
// Em vez de:
element.innerHTML += htmlString; // ❌ causa refluxo
```

### **Validação**
- [ ] Clicar em "Adicionar Referência"
- [ ] Page não sobe para o topo
- [ ] Novo campo aparece abaixo do anterior
- [ ] Scroll position é mantido

---

## ✅ **MELHORIA 5: Validação de API Keys**

### **Problema**
Sistema aceita qualquer string como API Key. Deveria validar formato mínimo.

### **Solução**
Adicionar validação em `assets/js/00-config.js`

### **Implementação**

**Arquivo:** `assets/js/00-config.js`

Adicione esta função (procure por onde keys são salvas):

```javascript
/**
 * Validar formato de API Key conforme modelo
 * @param {string} model - Ex: 'gemini-pro', 'claude-sonnet-4', etc
 * @param {string} apiKey - A chave a validar
 * @returns {object} { valid: boolean, message: string }
 */
function validateApiKey(model, apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    return { valid: false, message: 'API Key não pode estar vazia' };
  }

  const trimmed = apiKey.trim();
  
  // Validações básicas por modelo
  if (model.includes('gemini') || model.includes('google')) {
    // Gemini keys começam com letras/números, min 20 chars
    if (trimmed.length < 20) {
      return { 
        valid: false, 
        message: 'Chave Gemini parece incompleta (mínimo 20 caracteres)' 
      };
    }
  }
  
  if (model.includes('claude') || model.includes('anthropic')) {
    // Claude keys começam com 'sk-' e min 40 chars
    if (!trimmed.startsWith('sk-') || trimmed.length < 40) {
      return { 
        valid: false, 
        message: 'Chave Claude deve começar com "sk-" (obtém em console.anthropic.com)' 
      };
    }
  }
  
  if (model.includes('grok') || model.includes('xai')) {
    // Grok tem formato próprio
    if (trimmed.length < 30) {
      return { 
        valid: false, 
        message: 'Chave Grok parece incompleta' 
      };
    }
  }
  
  if (model.includes('mistral')) {
    // Mistral keys começam com 'sk-'
    if (!trimmed.startsWith('sk-') || trimmed.length < 30) {
      return { 
        valid: false, 
        message: 'Chave Mistral deve começar com "sk-"' 
      };
    }
  }
  
  // Se passou em tudo
  return { valid: true, message: 'API Key validada' };
}

// Usar quando salvar chave:
function saveApiKey(model, apiKey) {
  const validation = validateApiKey(model, apiKey);
  
  if (!validation.valid) {
    showError(validation.message);
    return false;
  }
  
  localStorage.setItem(`api_key_${model}`, apiKey.trim());
  showSuccess('API Key salva com sucesso');
  return true;
}
```

**Onde adicionar o código:**
1. Abrir `assets/js/00-config.js`
2. Procurar por função que salva API Key (algo como `saveApiKey` ou `updateApiKey`)
3. Adicionar validação ANTES de salvar no localStorage

### **Validação**
- [ ] Tentar salvar uma chave vazia → erro
- [ ] Tentar salvar chave muito curta → erro com mensagem útil
- [ ] Salvar chave válida → sucesso
- [ ] Mensagens de erro aparecem na UI

---

## 📋 **CHECKLIST DE VALIDAÇÃO FINAL**

Depois de implementar TODAS as 5 melhorias:

```
✅ Sistema abre normalmente em index.html
✅ Ícones Lucide aparecem em todos os lugares
✅ Nenhum erro no console sobre steps.js
✅ Pasta modules/google-ads tem README.md documentado
✅ Clicar "Adicionar Referência" não causa scroll para topo
✅ Tentar salvar API Key inválida mostra erro
✅ Todas as 5 screens funcionam (Intake, Steps, Art, Review, Generate)
✅ Gerar uma ficha completa end-to-end funciona
✅ localStorage está preservando dados corretamente
```

---

## 🚀 **Próximo Passo**

Depois que estas 5 melhorias forem implementadas, passar para:
- **Documento 2:** Corrigir geração de Estrutura da LP (prompts + lógica)

---

**FIM DO DOCUMENTO 1**
