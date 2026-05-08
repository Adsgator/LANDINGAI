// 01-ga-handlers.js (event listeners)

function initGaHandlers() {
    const btnPullContext = document.getElementById('btn-pull-context');
    const btnGenerateStrategy = document.getElementById('btn-generate-strategy');

    if (btnPullContext) {
        btnPullContext.addEventListener('click', () => {
            console.log('Pulling context from Landing Page...');
            if (typeof pullContextFromLP === 'function') {
                const context = pullContextFromLP(); // Name used in 02-ga-api.js
                console.log('Context retrieved:', context);
                alert('Contexto puxado com sucesso! Veja no console.');
                
                // Preencher a URL se existir no contexto
                if (context.lp_url) {
                    const urlInput = document.getElementById('lp-url');
                    if (urlInput) urlInput.value = context.lp_url;
                }
            }
        });
    }

    if (btnGenerateStrategy) {
        btnGenerateStrategy.addEventListener('click', async function() {
          try {
            // 1. Validar inputs
            const budget = parseFloat(document.getElementById('budget-total').value);
            const goal = document.getElementById('main-goal').value;
            const location = document.getElementById('location-value').value || 'Brasil';
            const lpUrl = document.getElementById('lp-url').value;
            
            if (!budget || !goal || !lpUrl) {
              showError('❌ Preencha todos os campos obrigatórios');
              return;
            }
            
            // 2. Mostrar loading
            showLoading('⚙️ Gerando estratégia com IA...');
            
            // 3. Puxar contexto
            // Assuming pullContextFromLP is defined in 02-ga-api.js
            const context = pullContextFromLP();
            
            // 4. Construir parâmetros
            const parameters = {
              budget: budget,
              goal: goal,
              location: location,
              lp_url: lpUrl
            };
            
            // 5. Gerar estratégia
            const strategy = await generateGAStrategy(context, parameters);
            
            // 6. Renderizar resultado
            if (typeof renderGAStrategy === 'function') {
              renderGAStrategy(strategy);
            } else {
              console.warn('renderGAStrategy não encontrada. Implemente a UI de renderização.');
              const outputSection = document.getElementById('ga-output-section');
              if (outputSection) {
                  outputSection.innerHTML = `<pre>${JSON.stringify(strategy, null, 2)}</pre>`;
              }
            }
            
            // 7. Adicionar botão de export
            if (typeof addExportButton === 'function') {
              addExportButton(strategy);
            }
            
            // 8. Feedback
            showSuccess('✅ Estratégia gerada com sucesso!');
            
          } catch (error) {
            console.error('Erro:', error);
            showError(`❌ Erro: ${error.message}`);
          }
        });
    }
}

/**
 * Função auxiliar: mostrar loading
 */
function showLoading(message) {
  const loader = document.createElement('div');
  loader.id = 'ga-loader';
  loader.className = 'ga-loading';
  loader.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(loader);
}

/**
 * Função auxiliar: mostrar erro
 */
function showError(message) {
  console.error(message);
  alert(message);
  const loader = document.getElementById('ga-loader');
  if (loader) loader.remove();
}

/**
 * Função auxiliar: mostrar sucesso
 */
function showSuccess(message) {
  console.log(message);
  const loader = document.getElementById('ga-loader');
  if (loader) {
    loader.innerHTML = `<p>${message}</p>`;
    setTimeout(() => loader.remove(), 2000);
  }
}
