document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) menuBtn.onclick = () => nav.classList.toggle('open');

  if (typeof ClynData === 'undefined') return;
  const products = ClynData.getProducts();
  const categories = ClynData.getCategories();
  const catMap = {};
  categories.forEach(c => { catMap[c.id] = c.name; });

  const filtersEl = document.getElementById('filters');
  const grid = document.getElementById('productsGrid');
  const search = document.getElementById('search');
  if (!grid) return;

  let activeCat = 'all';

  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML = ['all', ...categories.map(c => c.id)].map(id => {
      const label = id === 'all' ? 'All' : (catMap[id] || id);
      return `<button class="filter-btn ${activeCat === id ? 'active' : ''}" data-cat="${id}">${label}</button>`;
    }).join('');
  }

  function render() {
    const q = (search && search.value || '').toLowerCase().trim();
    const list = products.filter(p => {
      if (activeCat !== 'all' && p.category !== activeCat) return false;
      if (!q) return true;
      return (p.name + ' ' + (p.description || '') + ' ' + (p.partNumber || '')).toLowerCase().includes(q);
    });
    grid.innerHTML = list.map(p => {
      const img = p.image
        ? `<img src="${p.image}" alt="">`
        : `<span style="font-size:2rem;opacity:.35">📦</span>`;
      const feat = p.featured ? '<span class="feat">FEATURED</span>' : '';
      const wa = `https://wa.me/260965018323?text=${encodeURIComponent('Hello C-LYN, I want to enquire about: ' + p.name)}`;
      return `<article class="card">
        <div class="card-img">${img}</div>
        <div class="card-body">${feat}<h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description || '')}</p></div>
        <div class="card-foot"><span><strong>${escapeHtml(p.price || 'On request')}</strong><br><small>${escapeHtml(catMap[p.category] || p.category)}</small></span>
        <a href="${wa}" target="_blank" rel="noopener">Enquire →</a></div>
      </article>`;
    }).join('') || '<p>No products match your search.</p>';
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  if (filtersEl) {
    filtersEl.onclick = e => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      activeCat = btn.dataset.cat;
      renderFilters();
      render();
    };
  }
  if (search) search.oninput = render;

  renderFilters();
  render();
});
