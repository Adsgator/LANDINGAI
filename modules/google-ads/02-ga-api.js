/**
 * Puxa o contexto do projeto da Landing Page armazenado no localStorage.
 * @returns {Object} Objeto com os dados do projeto
 */
function pullContextFromLP() {
  // 1. Puxa do localStorage
  const briefing = JSON.parse(localStorage.getItem('briefing_bruto')) || {};
  const lpUrl = localStorage.getItem('lp_url') || '';
  
  // 2. Retorna objeto
  return {
    cliente_nome: briefing.client_name || 'Cliente',
    servico_descricao: briefing.service_description || '',
    proposta_valor: briefing.value_proposition || '',
    publico_alvo: briefing.target_audience || '',
    restricoes: briefing.restrictions || '',
    tom_identidade: briefing.tone_identity || '',
    lp_url: lpUrl,
    estrutura_blocos: JSON.parse(localStorage.getItem('generated_structure')) || []
  };
}

// TODO: Implementar chamadas da IA para gerar a estratégia
