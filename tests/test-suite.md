## ✅ TESTES LP COMPLETA

```javascript
describe('Landing Page Generation', () => {
  // Test 1: Intake preenchimento
  test('Preencher intake com dados válidos', () => {
    document.getElementById('cliente').value = 'Psicóloga Maria';
    document.getElementById('servico').value = 'Psicoterapia';
    
    const validation = FormValidator.validateForm(
      document.getElementById('intake-form'),
      { cliente: { required: true }, servico: { required: true } }
    );
    
    expect(validation.valid).toBe(true);
  });

  // Test 2: Estrutura gerada é válida
  test('Estrutura gerada tem todos os campos', async () => {
    const estrutura = await generateEstrutura(mockBriefing);
    
    expect(estrutura).toBeDefined();
    expect(estrutura.blocos).toBeDefined();
    expect(estrutura.blocos.length).toBeGreaterThan(0);
  });

  // Test 3: Restrições são respeitadas
  test('Copy não contém palavras restritas', async () => {
    const briefing = {
      ...mockBriefing,
      restricoes: 'Evitar palavra "premium"'
    };
    
    const estrutura = await generateEstrutura(briefing);
    const copy = JSON.stringify(estrutura);
    
    expect(copy.toLowerCase()).not.toContain('premium');
  });

  // Test 4: Validação de output
  test('Output passa em validação blindada', async () => {
    const estrutura = await generateEstrutura(mockBriefing);
    const validation = validateBlindedOutput(JSON.stringify(estrutura));
    
    expect(validation.valido).toBe(true);
  });

  // Test 5: Export LP html válido
  test('Export HTML é válido', async () => {
    const html = await exportLPToHTML(mockBriefing);
    
    expect(html).toContain('<h1');
    expect(html).toContain('</html>');
    expect(html.match(/<h1/g).length).toBe(1);
  });
});
```
