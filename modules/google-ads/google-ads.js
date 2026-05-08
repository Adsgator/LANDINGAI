// google-ads.js (controller principal)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Google Ads Module initialized');
    // Inicialização do módulo Google Ads
    if (typeof initGaHandlers === 'function') {
        initGaHandlers();
    }
});
