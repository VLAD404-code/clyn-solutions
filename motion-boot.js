(function () {
  var FEATURED_LIMIT = 6;
  var WA = '260965018323';

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function cardHTML(p, catMap, delay) {
    var img = p.image
      ? '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<span class="placeholder">📦</span>';
    var feat = p.featured ? '<span class="feat">FEATURED</span>' : '';
    var style = delay != null ? 'style="animation-delay:' + delay + 'ms"' : '';
    var price = p.price || 'On request';
    var code = p.partNumber ? '<small class="part-code">' + esc(p.partNumber) + '</small>' : '';
    return '<article class="card" ' + style + ' data-id="' + esc(p.id) + '">' +
      '<div class="card-img">' + img + '</div>' +
      '<div class="card-body">' + feat + '<h3>' + esc(p.name) + '</h3>' + code +
      '<p>' + esc(p.description || catMap[p.category] || '') + '</p></div>' +
      '<div class="card-price-row"><strong class="price">' + esc(price) + '</strong>' +
      '<small>' + esc(catMap[p.category] || p.category || '') + '</small></div>' +
      '<div class="card-actions">' +
      '<button type="button" class="btn btn-ghost btn-sm" data-quote="' + esc(p.id) + '">Get quotation</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-cart="' + esc(p.id) + '">+</button>' +
      '</div></article>';
  }

  function getData() {
    if (typeof ClynData === 'undefined') return { products: [], catMap: {} };
    var products = ClynData.getProducts() || [];
    var categories = ClynData.getCategories() || [];
    var catMap = {};
    categories.forEach(function (c) { catMap[c.id] = c.name; });
    return { products: products, catMap: catMap };
  }

  function bindActions(root, products) {
    if (!root) return;
    root.onclick = function (e) {
      var q = e.target.closest('[data-quote]');
      var c = e.target.closest('[data-cart]');
      if (q) {
        var p = products.find(function (x) { return x.id === q.dataset.quote; });
        if (p) {
          var msg = 'Hello C-LYN SOLUTIONS, I would like a quotation for:\n\n' + p.name;
          if (p.partNumber) msg += ' (' + p.partNumber + ')';
          msg += '\nPrice listed: ' + (p.price || 'On request') + '\n\nPlease advise availability.';
          window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank');
        }
      }
      if (c) {
        var p2 = products.find(function (x) { return x.id === c.dataset.cart; });
        if (p2 && typeof ClynData !== 'undefined') {
          try {
            var cart = ClynData.getCart();
            if (!cart.some(function (x) { return x.id === p2.id; })) {
              cart.push({ id: p2.id, name: p2.name, partNumber: p2.partNumber || '', price: p2.price || 'On request', qty: 1 });
              ClynData.saveCart(cart);
            }
            alert('Added to quotation list: ' + p2.name);
          } catch (err) {}
        }
      }
    };
  }

  function renderFeatured() {
    var grid = document.getElementById('featuredGrid');
    if (!grid) return;
    var data = getData();
    var products = data.products;
    var catMap = data.catMap;
    var list = products.filter(function (p) { return p.featured; });
    if (list.length < FEATURED_LIMIT) {
      var ids = {};
      list.forEach(function (p) { ids[p.id] = true; });
      products.forEach(function (p) {
        if (list.length >= FEATURED_LIMIT) return;
        if (!ids[p.id]) list.push(p);
      });
    }
    list = list.slice(0, FEATURED_LIMIT);
    grid.innerHTML = list.length
      ? list.map(function (p, i) { return cardHTML(p, catMap, i * 70); }).join('')
      : '<p class="empty-state">No products yet. Add them in Admin.</p>';
    bindActions(grid, products);
  }

  function reveal() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add('visible');
    });
  }

  function boot() {
    try { if (typeof window.initHome === 'function') window.initHome(); else renderFeatured(); } catch (e) { renderFeatured(); }
    try { if (typeof window.initProductsPage === 'function') window.initProductsPage(); } catch (e) {}
    try { if (typeof window.initReveal === 'function') window.initReveal(); else reveal(); } catch (e) { reveal(); }
    reveal();
  }

  window.addEventListener('clyn-cloud-ready', function () { setTimeout(boot, 100); });
  window.addEventListener('clyn-seeded', function () { setTimeout(boot, 60); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(boot, 300);
      setTimeout(boot, 800);
      setTimeout(boot, 1500);
    });
  } else {
    setTimeout(boot, 300);
    setTimeout(boot, 800);
  }
})();
