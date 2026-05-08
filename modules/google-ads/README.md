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
