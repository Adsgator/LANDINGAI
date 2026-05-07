/* ============================================================
   LandingAI v2 — Screen: Estrutura (Delegador)
   ============================================================ */

Object.assign(window.App, {
    /**
     * Monta a tela de Estrutura.
     * Esta função agora delega para a implementação V2 em estrutura.js
     */
    buildStructureScreen() {
        return this.renderEstrutura();
    }
});
