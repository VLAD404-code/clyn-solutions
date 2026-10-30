/**
 * C-LYN data layer — products, categories, settings, promotions, users, logs, analytics
 */
const ClynData = {
  STORAGE_PRODUCTS: 'clyn_products',
  STORAGE_CATEGORIES: 'clyn_categories',
  STORAGE_GALLERY: 'clyn_gallery',
  STORAGE_CART: 'clyn_quote_cart',
  STORAGE_SETTINGS: 'clyn_settings',
  STORAGE_PROMOS: 'clyn_promotions',
  STORAGE_USERS: 'clyn_users',
  STORAGE_LOGS: 'clyn_audit_logs',
  STORAGE_ANALYTICS: 'clyn_analytics',
  ADMIN_PASSWORD: 'clyn2026',
  _ready: null, _cats: [], _products: [],

  defaultSettings: {
    phone: '+260 965 018 323',
    phoneRaw: '260965018323',
    email: 'clynsolutions@gmail.com',
    whatsapp: '260965018323',
    address: 'Shop No. 1 Tattrin Building, Opposite Ontario Shopping Complex, Freetown Road, Kitwe',
    location: 'Freetown Road, Kitwe, Zambia',
    hours: 'Mon–Fri: 07:00 – 17:00 · Saturday: 08:00 – 17:00 · Sunday: Closed',
    about: 'When a machine stops, work stops. C-LYN SOLUTIONS keeps mining and truck fleets moving across the Copperbelt — quality parts, fair prices, and people who know the job. Based in Kitwe, we supply what your operations need so you spend less time waiting and more time working.',
    tagline: 'Your solution, is our Resolution.',
    heroImage: '',
    promoEnabled: true
  },

  defaultUsers: [
    { id: 'u1', name: 'Owner', username: 'admin', password: 'clyn2026', role: 'owner' }
  ],

  load() {
    if (this._ready) return this._ready;
    this._ready = fetch('products.json').then(r => r.json()).then(data => {
      this._cats = (data.categories || []).map(c => ({ id: c.id, name: c.name, icon: '', description: '', image: '' }));
      this._products = (data.products || []).map(p => ({
        id: p.id, name: p.n, category: p.c, description: '',
        partNumber: p.s || '', price: p.p, priceNum: null, featured: !!p.f, image: ''
      }));
      return true;
    }).catch(() => false);
    return this._ready;
  },

  getCategories() {
    try { const r = localStorage.getItem(this.STORAGE_CATEGORIES); if (r) return JSON.parse(r); } catch (e) {}
    return JSON.parse(JSON.stringify(this._cats));
  },
  saveCategories(l) { localStorage.setItem(this.STORAGE_CATEGORIES, JSON.stringify(l)); },

  getProducts() {
    try {
      const r = localStorage.getItem(this.STORAGE_PRODUCTS);
      if (r) {
        const s = JSON.parse(r);
        if (s.length < 50 && this._products.length > 50) return JSON.parse(JSON.stringify(this._products));
        return s;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(this._products));
  },
  saveProducts(l) { localStorage.setItem(this.STORAGE_PRODUCTS, JSON.stringify(l)); },

  getGallery() {
    try { const r = localStorage.getItem(this.STORAGE_GALLERY); if (r) return JSON.parse(r); } catch (e) {}
    return [];
  },
  saveGallery(l) { localStorage.setItem(this.STORAGE_GALLERY, JSON.stringify(l)); },

  getCart() {
    try { const r = localStorage.getItem(this.STORAGE_CART); if (r) return JSON.parse(r); } catch (e) {}
    return [];
  },
  saveCart(l) { localStorage.setItem(this.STORAGE_CART, JSON.stringify(l)); },

  getSettings() {
    try {
      const r = localStorage.getItem(this.STORAGE_SETTINGS);
      if (r) return { ...this.defaultSettings, ...JSON.parse(r) };
    } catch (e) {}
    return { ...this.defaultSettings };
  },
  saveSettings(s) { localStorage.setItem(this.STORAGE_SETTINGS, JSON.stringify(s)); },

  getPromotions() {
    try { const r = localStorage.getItem(this.STORAGE_PROMOS); if (r) return JSON.parse(r); } catch (e) {}
    return [];
  },
  savePromotions(l) { localStorage.setItem(this.STORAGE_PROMOS, JSON.stringify(l)); },

  getUsers() {
    try {
      const r = localStorage.getItem(this.STORAGE_USERS);
      if (r) {
        const u = JSON.parse(r);
        if (Array.isArray(u) && u.length) return u;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(this.defaultUsers));
  },
  saveUsers(l) { localStorage.setItem(this.STORAGE_USERS, JSON.stringify(l)); },

  getLogs() {
    try { const r = localStorage.getItem(this.STORAGE_LOGS); if (r) return JSON.parse(r); } catch (e) {}
    return [];
  },
  addLog(entry) {
    const logs = this.getLogs();
    logs.unshift({
      id: 'log' + Date.now(),
      at: new Date().toISOString(),
      user: entry.user || 'System',
      action: entry.action || 'update',
      detail: entry.detail || ''
    });
    localStorage.setItem(this.STORAGE_LOGS, JSON.stringify(logs.slice(0, 200)));
  },
  clearLogs() { localStorage.removeItem(this.STORAGE_LOGS); },

  getAnalytics() {
    try {
      const r = localStorage.getItem(this.STORAGE_ANALYTICS);
      if (r) return JSON.parse(r);
    } catch (e) {}
    return { totalViews: 0, pages: {}, visits: [] };
  },
  trackPageView(path) {
    const a = this.getAnalytics();
    a.totalViews = (a.totalViews || 0) + 1;
    const p = path || (typeof location !== 'undefined' ? location.pathname : '/');
    a.pages = a.pages || {};
    a.pages[p] = (a.pages[p] || 0) + 1;
    a.visits = a.visits || [];
    a.visits.unshift({
      path: p,
      at: new Date().toISOString(),
      ref: (typeof document !== 'undefined' && document.referrer) ? document.referrer.slice(0, 120) : ''
    });
    a.visits = a.visits.slice(0, 100);
    try { localStorage.setItem(this.STORAGE_ANALYTICS, JSON.stringify(a)); } catch (e) {}
  },
  clearAnalytics() {
    localStorage.setItem(this.STORAGE_ANALYTICS, JSON.stringify({ totalViews: 0, pages: {}, visits: [] }));
  },

  checkLogin(username, password) {
    const users = this.getUsers();
    const u = users.find(x =>
      (x.username && x.username.toLowerCase() === String(username || '').toLowerCase()) ||
      (x.name && x.name.toLowerCase() === String(username || '').toLowerCase())
    );
    if (u && u.password === password) return u;
    if ((!username || username === 'admin') && password === this.ADMIN_PASSWORD) {
      return users[0] || { id: 'u1', name: 'Owner', role: 'owner' };
    }
    return null;
  },

  exportAll() {
    return {
      products: this.getProducts(),
      categories: this.getCategories(),
      gallery: this.getGallery(),
      settings: this.getSettings(),
      promotions: this.getPromotions(),
      users: this.getUsers().map(u => ({ ...u, password: '***' })),
      logs: this.getLogs(),
      analytics: this.getAnalytics(),
      exportedAt: new Date().toISOString()
    };
  },
  importAll(d) {
    if (d.products) this.saveProducts(d.products);
    if (d.categories) this.saveCategories(d.categories);
    if (d.gallery) this.saveGallery(d.gallery);
    if (d.settings) this.saveSettings(d.settings);
    if (d.promotions) this.savePromotions(d.promotions);
  },
  resetAll() {
    [this.STORAGE_PRODUCTS, this.STORAGE_CATEGORIES, this.STORAGE_GALLERY,
     this.STORAGE_SETTINGS, this.STORAGE_PROMOS].forEach(k => localStorage.removeItem(k));
  }
};

if (typeof window !== 'undefined') {
  ClynData.load();
}
