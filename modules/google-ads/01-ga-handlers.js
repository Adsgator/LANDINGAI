// 01-ga-handlers.js (event listeners)

function initGaHandlers() {
    const btnPullContext = document.getElementById('btn-pull-context');
    const btnGenerateStrategy = document.getElementById('btn-generate-strategy');
    const btnOptimizeReport = document.getElementById('btn-optimize-report');

    if (btnPullContext) {
        btnPullContext.addEventListener('click', () => {
            console.log('Pulling context from Landing Page...');
            if (typeof pullContextFromLP === 'function') {
                const context = pullContextFromLP();
                console.log('Context retrieved:', context);
                
                if (window.Toast) {
                    Toast.success('Contexto puxado com sucesso!');
                } else {
                    alert('Contexto puxado com sucesso!');
                }
                
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
            const urlParams = new URLSearchParams(window.location.search);
            const isManualMode = urlParams.get('mode') === 'manual';

            const budget = document.getElementById('budget-total').value;
            const goal = document.getElementById('main-goal').value;
            const location = document.getElementById('location-value')?.value || document.getElementById('location')?.value || 'Brasil';
            const lpUrl = document.getElementById('lp-url').value;
            
            let manualFileContent = null;
            if (isManualMode) {
              const fileInput = document.getElementById('manual-briefing-file');
              if (fileInput && fileInput.files.length > 0) {
                manualFileContent = await fileInput.files[0].text();
              }
              
              if (!budget || !goal || (!lpUrl && !manualFileContent)) {
                if (window.Toast) Toast.error('Preencha a verba, meta e selecione seu arquivo .md');
                else alert('Preencha a verba, meta e selecione seu arquivo .md');
                return;
              }
            } else {
              if (!budget || !goal || !lpUrl) {
                if (window.Toast) Toast.error('Preencha todos os campos obrigatórios');
                else alert('Preencha todos os campos obrigatórios');
                return;
              }
            }
            
            // 2. Construir parâmetros
            const inputs = {
              budgetTotal: budget,
              mainGoal: goal,
              location: location,
              lpUrl: lpUrl,
              manualBriefing: manualFileContent
            };
            
            // 3. Gerar estratégia (O Loader já é chamado dentro de generateGAStrategy)
            const strategy = await generateGAStrategy(inputs);
            
            // 4. Renderizar resultado
            if (typeof renderGAStrategy === 'function') {
              renderGAStrategy(strategy);
            } else {
              const outputSection = document.getElementById('ga-output-section');
              if (outputSection) {
                  outputSection.innerHTML = `<pre>${JSON.stringify(strategy, null, 2)}</pre>`;
              }
            }
            
            // 5. Feedback
            if (window.Toast) Toast.success('Estratégia gerada com sucesso!');
            
          } catch (error) {
            console.error('Erro:', error);
            if (window.ErrorModal) {
                ErrorModal.show('Erro na Geração', error.message);
            } else {
                alert(`Erro: ${error.message}`);
            }
          }
        });
    }

    if (btnOptimizeReport) {
        btnOptimizeReport.addEventListener('click', async function() {
            const reportText = document.getElementById('raw-report-data')?.value;
            if (!reportText) {
                if (window.Toast) Toast.warning('Insira os dados do relatório para analisar');
                return;
            }

            try {
                const plan = await optimizeGACampaign(reportText);
                if (typeof renderGAOptimization === 'function') {
                    renderGAOptimization(plan);
                } else {
                    const outputSection = document.getElementById('ga-optimization-output');
                    if (outputSection) {
                        outputSection.innerHTML = `<pre>${JSON.stringify(plan, null, 2)}</pre>`;
                    }
                }
                if (window.Toast) Toast.success('Análise concluída!');
            } catch (error) {
                console.error('Erro na otimização:', error);
                if (window.ErrorModal) {
                    ErrorModal.show('Erro na Otimização', error.message);
                }
            }
        });
    }
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initGaHandlers);
