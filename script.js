(function () {
  const PER_PAGE = 12;
  const FEATURED_LIMIT = 6;
  const WA = '260965018323';

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, m =>
      ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[m])
    );
  }

  function initHeader() {
    const menuBtn = $('menuBtn');
    const nav = $('nav');
    if (menuBtn && nav) {
      menuBtn.onclick = () => nav.classList.toggle('open');
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
    }
    const header = $('header');
    if (header) {
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  function getCart() {
    return typeof ClynData !== 'undefined' ? ClynData.getCart() : [];
  }
  function saveCart(list) {
    if (typeof ClynData !== 'undefined') ClynData.saveCart(list);
  }

  function updateCartBadge() {
    const badge = $('cartBadge');
    const cart = getCart();
    if (badge) {
      badge.textContent = cart.length;
      badge.style.display = cart.length ? 'flex' : 'none';
    }
  }

  function addToCart(product) {
    const cart = getCart();
    if (cart.some(x => x.id === product.id)) {
      alert('Already in your quotation list.');
      return;
    }
    cart.push({
      id: product.id,
      name: product.name,
      partNumber: product.partNumber || '',
      price: product.price || 'On request',
      priceNum: product.priceNum,
      qty: 1
    });
    saveCart(cart);
    updateCartBadge();
    openCart();
  }

  function removeFromCart(id) {
    saveCart(getCart().filter(x => x.id !== id));
    updateCartBadge();
    renderCartPanel();
  }

  function renderCartPanel() {
    const body = $('cartBody');
    if (!body) return;
    const cart = getCart();
    if (!cart.length) {
      body.innerHTML = '<p class="cart-empty">Your quotation list is empty. Add parts from the catalogue.</p>';
      return;
    }
    body.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${esc(item.name)}</strong>
          <small>${esc(item.partNumber || '')}</small>
          <span class="cart-price">${esc(item.price)}</span>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-remove="${esc(item.id)}">Remove</button>
      </div>
    `).join('');
  }

  function openCart() {
    const panel = $('cartPanel');
    if (!panel) return;
    renderCartPanel();
    panel.classList.add('open');
    $('cartOverlay')?.classList.add('open');
  }

  function closeCart() {
    $('cartPanel')?.classList.remove('open');
    $('cartOverlay')?.classList.remove('open');
  }

  function quoteWhatsApp() {
    const cart = getCart();
    if (!cart.length) {
      alert('Add at least one part to the quotation list.');
      return;
    }
    let msg = 'Hello C-LYN SOLUTIONS, I would like a quotation for:\n\n';
    cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name}`;
      if (item.partNumber) msg += ` (${item.partNumber})`;
      msg += ` — ${item.price}\n`;
    });
    msg += '\nPlease advise availability and total.';
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function quoteOne(product) {
    let msg = `Hello C-LYN SOLUTIONS, I would like a quotation for:\n\n${product.name}`;
    if (product.partNumber) msg += ` (${product.partNumber})`;
    msg += `\nPrice listed: ${product.price || 'On request'}\n\nPlease advise availability.`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function initCartUI() {
    if ($('cartFab')) return;
    const fab = document.createElement('button');
    fab.id = 'cartFab';
    fab.className = 'cart-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Quotation list');
    fab.innerHTML = `📋 <span id="cartBadge" class="cart-badge">0</span>`;
    fab.onclick = openCart;
    document.body.appendChild(fab);
    const overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    overlay.className = 'cart-overlay';
    overlay.onclick = closeCart;
    document.body.appendChild(overlay);
    const panel = document.createElement('div');
    panel.id = 'cartPanel';
    panel.className = 'cart-panel';
    panel.innerHTML = `
      <div class="cart-head">
        <h3>Quotation list</h3>
        <button type="button" class="btn btn-ghost btn-sm" id="cartClose">Close</button>
      </div>
      <div class="cart-body" id="cartBody"></div>
      <div class="cart-foot">
        <button type="button" class="btn btn-primary btn-block" id="cartQuote">Request quotation on WhatsApp</button>
        <button type="button" class="btn btn-ghost btn-block btn-sm" id="cartClear" style="margin-top:8px">Clear list</button>
      </div>
    `;
    document.body.appendChild(panel);
    $('cartClose').onclick = closeCart;
    $('cartQuote').onclick = quoteWhatsApp;
    $('cartClear').onclick = () => {
      if (confirm('Clear the quotation list?')) {
        saveCart([]);
        updateCartBadge();
        renderCartPanel();
      }
    };
    $('cartBody').onclick = e => {
      const btn = e.target.closest('[data-remove]');
      if (btn) removeFromCart(btn.dataset.remove);
    };
    updateCartBadge();
  }

  function cardHTML(p, catMap, delay) {
    const img = p.image
      ? `<img src="${p.image}" alt="${esc(p.name)}" loading="lazy">`
      : `<span class="placeholder">📦</span>`;
    const feat = p.featured ? '<span class="feat">FEATURED</span>' : '';
    const style = delay != null ? `style="animation-delay:${delay}ms"` : '';
    const price = p.price || 'On request';
    const code = p.partNumber ? `<small class="part-code">${esc(p.partNumber)}</small>` : '';
    return `<article class="card" ${style} data-id="${esc(p.id)}">
      <div class="card-img">${img}</div>
      <div class="card-body">
        ${feat}
        <h3>${esc(p.name)}</h3>
        ${code}
        <p>${esc(p.description || catMap[p.category] || '')}</p>
      </div>
      <div class="card-price-row">
        <strong class="price">${esc(price)}</strong>
        <small>${esc(catMap[p.category] || p.category)}</small>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-ghost btn-sm btn-quote" data-quote="${esc(p.id)}">Get quotation</button>
        <button type="button" class="btn btn-primary btn-sm btn-cart" data-cart="${esc(p.id)}" title="Add to quotation list">+</button>
      </div>
    </article>`;
  }

  function getData() {
    if (typeof ClynData === 'undefined') return { products: [], categories: [], catMap: {} };
    const products = ClynData.getProducts();
    const categories = ClynData.getCategories();
    const catMap = {};
    categories.forEach(c => { catMap[c.id] = c.name; });
    return { products, categories, catMap };
  }

  function bindCardActions(root, products) {
    if (!root) return;
    root.onclick = e => {
      const q = e.target.closest('[data-quote]');
      const c = e.target.closest('[data-cart]');
      if (q) {
        const p = products.find(x => x.id === q.dataset.quote);
        if (p) quoteOne(p);
      }
      if (c) {
        const p = products.find(x => x.id === c.dataset.cart);
        if (p) addToCart(p);
      }
    };
  }

  function initCategories() {
    const grid = $('categoryGrid');
    if (!grid || typeof ClynData === 'undefined') return;
    const categories = ClynData.getCategories();
    grid.innerHTML = categories.map((c, i) => {
      const src = c.image || '';
      const img = src
        ? `<img src="${src}" alt="${esc(c.name)}" loading="lazy">`
        : `<span class="cat-icon">${c.icon || '📦'}</span>`;
      return `<a class="cat-card" href="products.html?cat=${encodeURIComponent(c.id)}" style="animation-delay:${i * 50}ms">
        <div class="cat-img">${img}</div>
        <div class="cat-body">
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.description || '')}</p>
        </div>
      </a>`;
    }).join('');
  }

  function initHome() {
    const grid = $('featuredGrid');
    if (!grid) return;
    const { products, catMap } = getData();
    let list = products.filter(p => p.featured);
    if (list.length < FEATURED_LIMIT) {
      const ids = new Set(list.map(p => p.id));
      for (const p of products) {
        if (list.length >= FEATURED_LIMIT) break;
        if (!ids.has(p.id)) list.push(p);
      }
    }
    list = list.slice(0, FEATURED_LIMIT);
    grid.innerHTML = list.map((p, i) => cardHTML(p, catMap, i * 60)).join('')
      || '<p class="empty-state">No products yet.</p>';
    bindCardActions(grid, products);
  }

  function initProductsPage() {
    const grid = $('productsGrid');
    const filtersEl = $('filters');
    const search = $('search');
    const pagination = $('pagination');
    const meta = $('resultsMeta');
    if (!grid) return;

    const { products, categories, catMap } = getData();
    let activeCat = 'all';
    let query = '';
    let page = 1;

    const params = new URLSearchParams(location.search);
    if (params.get('cat') && catMap[params.get('cat')]) {
      activeCat = params.get('cat');
    }

    function filtered() {
      const q = query.toLowerCase().trim();
      return products.filter(p => {
        if (activeCat !== 'all' && p.category !== activeCat) return false;
        if (!q) return true;
        const hay = (p.name + ' ' + (p.description || '') + ' ' + (p.partNumber || '')).toLowerCase();
        return hay.includes(q);
      });
    }

    function renderFilters() {
      if (!filtersEl) return;
      const ids = ['all', ...categories.map(c => c.id)];
      filtersEl.innerHTML = ids.map(id => {
        const label = id === 'all' ? 'All' : (catMap[id] || id);
        return `<button type="button" class="filter-btn ${activeCat === id ? 'active' : ''}" data-cat="${id}">${esc(label)}</button>`;
      }).join('');
    }

    function renderPagination(total) {
      if (!pagination) return;
      const pages = Math.max(1, Math.ceil(total / PER_PAGE));
      if (page > pages) page = pages;
      if (pages <= 1) { pagination.innerHTML = ''; return; }
      let html = `<button type="button" class="page-btn" data-page="prev" ${page <= 1 ? 'disabled' : ''}>‹</button>`;
      for (let i = 1; i <= pages; i++) {
        if (pages > 7 && Math.abs(i - page) > 2 && i !== 1 && i !== pages) {
          if (i === 2 || i === pages - 1) html += `<span style="padding:0 4px;color:#999">…</span>`;
          continue;
        }
        html += `<button type="button" class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }
      html += `<button type="button" class="page-btn" data-page="next" ${page >= pages ? 'disabled' : ''}>›</button>`;
      pagination.innerHTML = html;
    }

    function render() {
      const list = filtered();
      const total = list.length;
      const start = (page - 1) * PER_PAGE;
      const slice = list.slice(start, start + PER_PAGE);

      if (meta) {
        meta.textContent = total
          ? `Showing ${start + 1}–${Math.min(start + PER_PAGE, total)} of ${total} products`
          : 'No products match your search';
      }

      grid.innerHTML = slice.length
        ? slice.map((p, i) => cardHTML(p, catMap, i * 40)).join('')
        : '<p class="empty-state">No products found. Try another category or search term.</p>';

      renderPagination(total);
      bindCardActions(grid, products);
    }

    if (filtersEl) {
      filtersEl.onclick = e => {
        const btn = e.target.closest('[data-cat]');
        if (!btn) return;
        activeCat = btn.dataset.cat;
        page = 1;
        renderFilters();
        render();
      };
    }

    if (search) {
      let t;
      search.oninput = () => {
        clearTimeout(t);
        t = setTimeout(() => { query = search.value; page = 1; render(); }, 180);
      };
    }

    if (pagination) {
      pagination.onclick = e => {
        const btn = e.target.closest('[data-page]');
        if (!btn || btn.disabled) return;
        const v = btn.dataset.page;
        const total = filtered().length;
        const pages = Math.max(1, Math.ceil(total / PER_PAGE));
        if (v === 'prev') page = Math.max(1, page - 1);
        else if (v === 'next') page = Math.min(pages, page + 1);
        else page = parseInt(v, 10);
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }

    renderFilters();
    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initReveal();
    initCartUI();
    initCategories();
    initHome();
    initProductsPage();
  });
})();
