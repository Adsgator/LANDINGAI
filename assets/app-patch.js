/* ============================================================
   LandingAI v3 — Patch de Compatibilidade
   Resolve inconsistências entre o código original e o complemento.
   Carregado ANTES de app.js para definir constantes faltantes.
   ============================================================ */

'use strict';

/* ── Constantes que o código original espera mas o complemento não define ── */

const GENERIC_CHECKS = [
  { field: 'publico_primario',    minLen: 30, terms: ['pessoas','clientes','qualquer'], msg: 'Defina o público com mais especificidade.' },
  { field: 'publico_dor',         minLen: 30, terms: ['problema','dificuldade'],        msg: 'Use as palavras exatas que o cliente usa para descrever sua dor.' },
  { field: 'diferencial',         minLen: 40, terms: ['qualidade','excelência','melhor','dedicado'], msg: 'Evite termos genéricos — cite fatos concretos.' },
  { field: 'servicos_descricao',  minLen: 60, terms: [],                                msg: 'Adicione mais detalhes sobre os serviços.' },
  { field: 'historia',            minLen: 30, terms: [],                                msg: 'Adicione mais contexto à história.' },
];

const CRITICAL_FIELDS = {
  1: ['nome_cliente', 'segmento', 'tipo'],
  5: ['servico_principal', 'objetivo_conversao'],
  6: ['publico_primario', 'publico_dor', 'publico_resultado'],
  7: ['diferencial'],
};

const TOOLTIPS = {
  nome_cliente:      'Nome completo do cliente ou da empresa.',
  nome_marca:        'Nome da marca (se diferente do cliente).',
  segmento:          'Segmento específico — evite genéricos como "saúde" ou "educação".',
  whatsapp:          'Somente dígitos: DDI + DDD + número. Ex: 5511999999999.',
  servicos_lista:    'Liste todos os serviços, um por linha.',
  servico_principal: 'O produto ou serviço principal que a landing page irá vender.',
  publico_primario:  'Descreva detalhadamente o cliente ideal — idade, gênero, situação, aspirações.',
  publico_dor:       'Qual o principal problema que o cliente quer resolver? Use as palavras dele.',
  publico_resultado: 'Qual a transformação que o cliente busca? Seja específico e concreto.',
  diferencial:       'O que torna este negócio único? Evite qualidade/excelência — cite fatos.',
  frase_impacto:     'Frase curta e poderosa que define o negócio. Será usada no headline.',
  depoimentos:       'Descreva os depoimentos disponíveis: formato, quantidade, qualidade.',
  google_business:   'Nota e quantidade de avaliações no Google Business.',
  estilo_desejado:   'Descreva o estilo visual desejado: cores, tipografia, referências.',
  sensacao_visitante:'Que sensação o visitante deve ter ao entrar no site?',
  vocabulario_usa:   'Palavras e expressões que devem estar presentes na copy.',
  vocabulario_nunca: 'Palavras e expressões que jamais devem aparecer.',
  briefing_bruto:    'Cole aqui qualquer material bruto do cliente para análise automática.',
};

/* ── FIELD_TOOLTIPS: alias de TOOLTIPS usado pelo código complementar ── */
const FIELD_TOOLTIPS = TOOLTIPS;

/* ── API_PROVIDERS: usado em updateSidebar() original ── */
const API_PROVIDERS = [
  { id: 'gemini',  name: 'Google Gemini'   },
  { id: 'claude',  name: 'Anthropic Claude' },
  { id: 'grok',    name: 'xAI Grok'        },
  { id: 'mistral', name: 'Mistral AI'      },
];
