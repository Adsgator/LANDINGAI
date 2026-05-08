## ✅ TESTES GOOGLE ADS

```javascript
describe('Google Ads Strategy', () => {
  // Test 1: Estratégia gerada válida
  test('GA Strategy tem estrutura correta', async () => {
    const strategy = await generateGAStrategy({
      budgetTotal: 1500,
      location: 'São Paulo, SP',
      mainGoal: 'leads',
      lpUrl: 'https://exemplo.com'
    });
    
    expect(strategy.campanhas).toBeDefined();
    expect(strategy.campanhas.length).toBeGreaterThan(0);
  });

  // Test 2: Headlines dentro do limite
  test('Headlines respeitam limite de 30 caracteres', async () => {
    const strategy = await generateGAStrategy(mockInputs);
    
    strategy.campanhas.forEach(camp => {
      camp.ad_groups.forEach(ag => {
        ag.anuncios.forEach(ad => {
          ad.headlines.forEach(h => {
            expect(h.texto.length).toBeLessThanOrEqual(30);
          });
        });
      });
    });
  });

  // Test 3: CSV exporta corretamente
  test('CSV export é válido', async () => {
    const strategy = await generateGAStrategy(mockInputs);
    const csv = exportStrategyToCSV(strategy);
    
    expect(csv).toContain('Campaign');
    expect(csv).toContain('Ad Group');
    expect(csv).toContain('Keyword');
  });

  // Test 4: Otimização gera plano
  test('Optimization plan é válido', async () => {
    const plan = await optimizeGACampaign(mockReportText);
    
    expect(plan.acoes).toBeDefined();
    expect(plan.acoes.length).toBeGreaterThan(0);
    expect(plan.score_saude).toBeGreaterThanOrEqual(0);
    expect(plan.score_saude).toBeLessThanOrEqual(100);
  });
});
```
