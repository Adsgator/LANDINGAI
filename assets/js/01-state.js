/* ============================================================
   LandingAI v2 — Estado e Persistência
   ============================================================ */

Object.assign(window.App, {
  state: {
    projects: {},
    activeId: null,
    screen: 'intake',
    currentStep: 1,
    selectedModel: 'gemini-2.5-flash',
    apiKeys: {},
    intakeFiles: [],
    isGenerating: false,
    artAnalyzed: false,
    aiLog: {
      title: '',
      steps: [],
      active: null,
      done: [],
      errors: [],
      startedAt: null,
      stepTimes: {},
      liveMsg: '',
    },
  },

  get P() { return this.state.projects[this.state.activeId]; },
  get B() { return this.P ? this.P.briefing : {}; },

  loadStorage() {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const a = localStorage.getItem(STORAGE_KEYS.ACTIVE);
      const k = localStorage.getItem(STORAGE_KEYS.API_KEYS);
      if (p) this.state.projects = JSON.parse(p);
      if (a) this.state.activeId = a;
      if (k) this.state.apiKeys = JSON.parse(k);
    } catch (e) { console.error('Erro ao carregar localStorage:', e); }
  },

  saveStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.state.projects));
      localStorage.setItem(STORAGE_KEYS.ACTIVE, this.state.activeId || '');
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(this.state.apiKeys));
    } catch (e) { console.error('Erro ao salvar localStorage:', e); }
  },

  autosave() { 
    this.saveStorage(); 
    if (this.updateSidebar) this.updateSidebar(); 
  },

  createProject(name = 'Novo Projeto') {
    const id = 'p_' + Date.now();
    this.state.projects[id] = {
      id,
      name,
      slug: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visitedSteps: [],
      briefing: {
        integracoes: ['whatsapp'],
        depoimentos_formato: [],
        arte_referencias_pessoais: [],
        arte_referencias_nicho: [],
      },
    };
    this.state.activeId = id;
    this.state.screen = 'intake';
    this.autosave();
    if (this.renderAll) this.renderAll();
  },

  saveProjectName(name) {
    if (!this.P || !name) return;
    this.P.name = name;
    if (!this.B.slug) {
        this.P.briefing.slug = name
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
    }
    this.P.updatedAt = new Date().toISOString();
    this.autosave();
  },

  loadProject(id) {
    if (!this.state.projects[id]) return;
    this.state.activeId = id;
    this.state.screen = 'intake';
    if (this.renderAll) this.renderAll();
  },

  deleteProject(id) {
    delete this.state.projects[id];
    if (this.state.activeId === id) {
      const remaining = Object.keys(this.state.projects);
      if (remaining.length > 0) this.loadProject(remaining[0]);
      else this.createProject();
    }
    this.autosave();
  },

  setField(field, value) {
    if (!this.P) return;
    this.P.briefing[field] = value;
    this.P.updatedAt = new Date().toISOString();
    this.autosave();
  },

  toggleArray(field, value) {
    if (!this.P) return;
    const arr = this.B[field] || [];
    const idx = arr.indexOf(value);
    if (idx === -1) arr.push(value); else arr.splice(idx, 1);
    this.P.briefing[field] = arr;
    this.autosave();
  },

  saveApiKey(provider, value) {
    this.state.apiKeys[provider] = value.trim();
    this.saveStorage();
  }
});
