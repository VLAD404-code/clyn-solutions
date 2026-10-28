/**
 * C-LYN data layer — loads inventory from split JSON files
 */
const ClynData = {
  STORAGE_PRODUCTS: 'clyn_products',
  STORAGE_CATEGORIES: 'clyn_categories',
  STORAGE_GALLERY: 'clyn_gallery',
  STORAGE_CART: 'clyn_quote_cart',
  ADMIN_PASSWORD: 'clyn2026',

  _ready: null,
  _cats: [],
  _products: [],

  defaultCategories: [],
  defaultProducts: [],
  defaultGallery: [],

  load() {
    if (this._ready) return this._ready;
    this._ready = Promise.all([
      fetch('products-a.json').then(r => r.json()),
      fetch('products-b.json').then(r => r.json())
    ]).then(([a, b]) => {
      this._cats = (a.categories || []).map(c => ({ id: c.id, name: c.name, icon: '', description: '' }));
      const raw = [...(a.products || []), ...(b.products || [])];
      this._products = raw.map(p => ({
        id: p.id,
        name: p.n,
        category: p.c,
        description: p.d || '',
        partNumber: p.s || '',
        price: p.p,
        priceNum: p.pn,
        featured: !!p.f,
        image: ''
      }));
      this.defaultCategories = this._cats;
      this.defaultProducts = this._products;
      return true;
    }).catch(err => {
      console.error('Failed to load inventory', err);
      return false;
    });
    return this._ready;
  },

  getCategories() {
    try {
      const raw = localStorage.getItem(this.STORAGE_CATEGORIES);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return JSON.parse(JSON.stringify(this._cats.length ? this._cats : this.defaultCategories));
  },
  saveCategories(list) { localStorage.setItem(this.STORAGE_CATEGORIES, JSON.stringify(list)); },

  getProducts() {
    try {
      const raw = localStorage.getItem(this.STORAGE_PRODUCTS);
      if (raw) {
        const stored = JSON.parse(raw);
        if (Array.isArray(stored) && stored.length < 50 && this._products.length > 50) {
          return JSON.parse(JSON.stringify(this._products));
        }
        return stored;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(this._products.length ? this._products : this.defaultProducts));
  },
  saveProducts(list) { localStorage.setItem(this.STORAGE_PRODUCTS, JSON.stringify(list)); },

  getGallery() {
    try {
      const raw = localStorage.getItem(this.STORAGE_GALLERY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },
  saveGallery(list) { localStorage.setItem(this.STORAGE_GALLERY, JSON.stringify(list)); },

  getCart() {
    try {
      const raw = localStorage.getItem(this.STORAGE_CART);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },
  saveCart(list) { localStorage.setItem(this.STORAGE_CART, JSON.stringify(list)); },

  exportAll() {
    return { products: this.getProducts(), categories: this.getCategories(), gallery: this.getGallery(), exportedAt: new Date().toISOString() };
  },
  importAll(data) {
    if (data.products) this.saveProducts(data.products);
    if (data.categories) this.saveCategories(data.categories);
    if (data.gallery) this.saveGallery(data.gallery);
  },
  resetAll() {
    localStorage.removeItem(this.STORAGE_PRODUCTS);
    localStorage.removeItem(this.STORAGE_CATEGORIES);
    localStorage.removeItem(this.STORAGE_GALLERY);
  }
};
