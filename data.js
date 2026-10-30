/**
 * C-LYN data layer — products, categories, settings, promotions, users, logs, analytics
 */
const ClynData = {
  STORAGE_PRODUCTS: 'clyn_products',
  STORAGE_CATEGORIES: 'clyn_categories',
  STORAGE_SETTINGS: 'clyn_settings',
  STORAGE_PROMOS: 'clyn_promotions',
  STORAGE_USERS: 'clyn_users',
  STORAGE_LOGS: 'clyn_logs',
  STORAGE_ANALYTICS: 'clyn_analytics',
  STORAGE_GALLERY: 'clyn_gallery',
  STORAGE_CART: 'clyn_quote_cart',
  ADMIN_PASSWORD: 'clyn2026',
  _ready: null, _cats: [], _products: [],
  defaultCategories: [],
  defaultProducts: [],
  defaultSettings: {
    phone: '+260 965 018 323',
    whatsapp: '260965018323',
    email: 'clynsolutions@gmail.com',
    address: 'Shop No. 1 Tattrin Building',
    location: 'Freetown Road, Kitwe, Zambia',
    hours: 'Mon–Fri: 07:00 – 17:00 · Sat: 08:00 – 13:00',
    tagline: 'Your solution is our Resolution',
    about: 'When a machine stops, work stops. C-LYN SOLUTIONS keeps mining and truck fleets moving with quality spare parts and fast response in Kitwe.',
    heroImage: '',
    promoEnabled: true
  },
  defaultUsers: [
    { id: 'u1', name: 'Owner', username: 'admin', password: 'clyn2026', role: 'owner' }
  ],
  load() {
    if (this._ready) return this._ready;
    this._ready = fetch('products.json').then(r => r.json()).then(data => {
      this._cats = (data.categories || []).map(c => ({ id: c.id, name: c.name, icon: '', description: '', image: c.image || '' }));
      this._products = (data.products || []).map(p => ({
        id: p.id, name: p.n, category: p.c, description: '',
        partNumber: p.s || '', price: p.p, priceNum: null, featured: !!p.f, image: ''
      }));
      this.defaultCategories = this._cats;
      this.defaultProducts = this._products;
      return true;
    }).catch(e => { console.error(e); return false; });
    return this._ready;
  },
  getCategories() {
    try {
      const r = localStorage.getItem(this.STORAGE_CATEGORIES);
      if (r) {
        const s = JSON.parse(r);
        if (Array.isArray(s) && s.length > 0) return s;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(this._cats.length ? this._cats : this.defaultCategories));
  },
  saveCategories(l) { localStorage.setItem(this.STORAGE_CATEGORIES, JSON.stringify(l)); },
  getProducts() {
    try {
      const r = localStorage.getItem(this.STORAGE_PRODUCTS);
      if (r) {
        const s = JSON.parse(r);
        if (Array.isArray(s) && s.length > 0) {
          if (s.length < 50 && this._products.length > 50) return JSON.parse(JSON.stringify(this._products));
          return s;
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(this._products.length ? this._products : this.defaultProducts));
  },
  saveProducts(l) { localStorage.setItem(this.STORAGE_PRODUCTS, JSON.stringify(l)); },
  getSettings() {
    try { const r = localStorage.getItem(this.STORAGE_SETTINGS); if (r) return { ...this.defaultSettings, ...JSON.parse(r) }; } catch (e) {}
    return { ...this.defaultSettings };
  },
  saveSettings(s) { localStorage.setItem(this.STORAGE_SETTINGS, JSON.stringify(s)); },
  getPromotions() {
    try { const r = localStorage.getItem(this.STORAGE_PROMOS); if (r) return JSON.parse(r); } catch (e) {}
    return [];
  },
  savePromotions(l) { localStorage.setItem(this.STORAGE_PROMOS, JSON.stringify(l)); },
  getUsers() {
    try { const r = localStorage.getItem(this.STORAGE_USERS); if (r) return JSON.parse(r); } catch (e) {}
    return JSON.parse(JSON.stringify(this.defaultUsers));
  },
  saveUsers(l) { localStorage.setItem(this.STORAGE_USERS, JSON.stringify(l)); },
  checkLogin(username, password) {
    const users = this.getUsers();
    const u = users.find(x => x.username === String(username || '').trim().toLowerCase() && x.password === password);
    if (u) return u;
    if (String(username || '').trim().toLowerCase() === 'admin' && password === this.ADMIN_PASSWORD) {
      return { id: 'u1', name: 'Owner', username: 'admin', role: 'owner' };
    }
    return null;
  },
  getLogs() {
    try { const r = localStorage.getItem(this.STORAGE_LOGS); if (r) return JSON.parse(r); } catch (e) {}
    return [];
  },
  addLog(entry) {
    const logs = this.getLogs();
    logs.unshift({ at: new Date().toISOString(), user: entry.user || 'Admin', action: entry.action || '', detail: entry.detail || '' });
    if (logs.length > 200) logs.length = 200;
    localStorage.setItem(this.STORAGE_LOGS, JSON.stringify(logs));
  },
  clearLogs() { localStorage.removeItem(this.STORAGE_LOGS); },
  getAnalytics() {
    try { const r = localStorage.getItem(this.STORAGE_ANALYTICS); if (r) return JSON.parse(r); } catch (e) {}
    return { totalViews: 0, pages: {}, visits: [] };
  },
  trackPageView(path) {
    const a = this.getAnalytics();
    a.totalViews = (a.totalViews || 0) + 1;
    a.pages = a.pages || {};
    a.pages[path] = (a.pages[path] || 0) + 1;
    a.visits = a.visits || [];
    a.visits.unshift({ at: new Date().toISOString(), path: path || '/', ref: (typeof document !== 'undefined' && document.referrer) || '' });
    if (a.visits.length > 50) a.visits.length = 50;
    localStorage.setItem(this.STORAGE_ANALYTICS, JSON.stringify(a));
  },
  clearAnalytics() { localStorage.removeItem(this.STORAGE_ANALYTICS); },
  getGallery() { try { const r = localStorage.getItem(this.STORAGE_GALLERY); if (r) return JSON.parse(r); } catch (e) {} return []; },
  saveGallery(l) { localStorage.setItem(this.STORAGE_GALLERY, JSON.stringify(l)); },
  getCart() { try { const r = localStorage.getItem(this.STORAGE_CART); if (r) return JSON.parse(r); } catch (e) {} return []; },
  saveCart(l) { localStorage.setItem(this.STORAGE_CART, JSON.stringify(l)); },
  exportAll() {
    return {
      products: this.getProducts(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      promotions: this.getPromotions(),
      users: this.getUsers().map(u => ({ ...u, password: '***' })),
      gallery: this.getGallery(),
      exportedAt: new Date().toISOString()
    };
  },
  importAll(d) {
    if (d.products) this.saveProducts(d.products);
    if (d.categories) this.saveCategories(d.categories);
    if (d.settings) this.saveSettings(d.settings);
    if (d.promotions) this.savePromotions(d.promotions);
    if (d.gallery) this.saveGallery(d.gallery);
  },
  resetAll() {
    localStorage.removeItem(this.STORAGE_PRODUCTS);
    localStorage.removeItem(this.STORAGE_CATEGORIES);
    localStorage.removeItem(this.STORAGE_SETTINGS);
    localStorage.removeItem(this.STORAGE_PROMOS);
    localStorage.removeItem(this.STORAGE_GALLERY);
  }
};
