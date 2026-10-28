(function () {
  const PER_PAGE = 9;
  const FEATURED_LIMIT = 6;

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
    );
  }

  function initHeader() {
    const menuBtn = $('menuBtn');
    const nav = $('nav');
    if (menuBtn && nav) {
      menuBtn.onclick = () => nav.classList.toggle('open');
      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('open'));
      });
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

  function cardHTML(p, catMap, delay) {
    const img = p.image
      ? `<img src="${p.image}" alt="${esc(p.name)}" loading="lazy">`
      : `<span class="placeholder">📦</span>`;
    const feat = p.featured ? '<span class="feat">FEATURED</span>' : '';
    const wa = `https://wa.me/260965018323?text=${encodeURIComponent('Hello C-LYN, I want to enquire about: ' + p.name)}`;
    const style = delay != null ? `style="animation-delay:${delay}ms"` : '';
    return `<article class="card" ${style}>
      <div class="card-img">${img}</div>
      <div class="card-body">${feat}<h3>${esc(p.name)}</h3><p>${esc(p.description || '')}</p></div>
      <div class="card-foot">
        <span><strong>${esc(p.price || 'On request')}</strong><br><small>${esc(catMap[p.category] || p.category)}</small></span>
        <a href="${wa}" target="_blank" rel="noopener">Enquire →</a>
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
      if (pages <= 1) {
        pagination.innerHTML = '';
        return;
      }
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
        ? slice.map((p, i) => cardHTML(p, catMap, i * 50)).join('')
        : '<p class="empty-state">No products found. Try another category or search term.</p>';

      renderPagination(total);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        t = setTimeout(() => {
          query = search.value;
          page = 1;
          render();
        }, 180);
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
      };
    }

    renderFilters();
    render();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initReveal();
    initHome();
    initProductsPage();
  });
})();
