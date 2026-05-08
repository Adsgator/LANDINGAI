// 01-ga-handlers.js (event listeners)

function initGaHandlers() {
    const btnPullContext = document.getElementById('btn-pull-context');
    const btnGenerateStrategy = document.getElementById('btn-generate-strategy');

    if (btnPullContext) {
        btnPullContext.addEventListener('click', () => {
            console.log('Pulling context from Landing Page...');
            if (typeof pullContextFromLP === 'function') {
                const context = pullContextFromLP();
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
        btnGenerateStrategy.addEventListener('click', () => {
            console.log('Generating strategy...');
            alert('Gerar estratégia em desenvolvimento...');
            // Lógica para gerar a estratégia será implementada aqui
        });
    }
}
