/**
 * C-LYN data — loads products.json
 */
const ClynData = {
  STORAGE_PRODUCTS: 'clyn_products',
  STORAGE_CATEGORIES: 'clyn_categories',
  STORAGE_GALLERY: 'clyn_gallery',
  STORAGE_CART: 'clyn_quote_cart',
  ADMIN_PASSWORD: 'clyn2026',
  _ready: null, _cats: [], _products: [],
  defaultCategories: [], defaultProducts: [], defaultGallery: [],
  load() {
    if (this._ready) return this._ready;
    this._ready = fetch('products.json').then(r => r.json()).then(data => {
      this._cats = (data.categories || []).map(c => ({ id: c.id, name: c.name, icon: '', description: '' }));
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
    try { const r = localStorage.getItem(this.STORAGE_CATEGORIES); if (r) return JSON.parse(r); } catch (e) {}
    return JSON.parse(JSON.stringify(this._cats.length ? this._cats : this.defaultCategories));
  },
  saveCategories(l) { localStorage.setItem(this.STORAGE_CATEGORIES, JSON.stringify(l)); },
  getProducts() {
    try {
      const r = localStorage.getItem(this.STORAGE_PRODUCTS);
      if (r) { const s = JSON.parse(r); if (s.length < 50 && this._products.length > 50) return JSON.parse(JSON.stringify(this._products)); return s; }
    } catch (e) {}
    return JSON.parse(JSON.stringify(this._products.length ? this._products : this.defaultProducts));
  },
  saveProducts(l) { localStorage.setItem(this.STORAGE_PRODUCTS, JSON.stringify(l)); },
  getGallery() { try { const r = localStorage.getItem(this.STORAGE_GALLERY); if (r) return JSON.parse(r); } catch (e) {} return []; },
  saveGallery(l) { localStorage.setItem(this.STORAGE_GALLERY, JSON.stringify(l)); },
  getCart() { try { const r = localStorage.getItem(this.STORAGE_CART); if (r) return JSON.parse(r); } catch (e) {} return []; },
  saveCart(l) { localStorage.setItem(this.STORAGE_CART, JSON.stringify(l)); },
  exportAll() { return { products: this.getProducts(), categories: this.getCategories(), gallery: this.getGallery(), exportedAt: new Date().toISOString() }; },
  importAll(d) { if (d.products) this.saveProducts(d.products); if (d.categories) this.saveCategories(d.categories); if (d.gallery) this.saveGallery(d.gallery); },
  resetAll() { localStorage.removeItem(this.STORAGE_PRODUCTS); localStorage.removeItem(this.STORAGE_CATEGORIES); localStorage.removeItem(this.STORAGE_GALLERY); }
};
