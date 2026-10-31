(function () {
  var WA = '260965018323';

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function getProducts() {
    if (typeof ClynData !== 'undefined') return ClynData.getProducts() || [];
    return [];
  }

  function getCategories() {
    if (typeof ClynData !== 'undefined') return ClynData.getCategories() || [];
    return [];
  }

  function getGallery() {
    if (typeof ClynData !== 'undefined' && ClynData.getGallery) {
      var g = ClynData.getGallery();
      if (g && g.length) return g;
    }
    return [
      { title: 'Truck Parts', caption: 'Heavy duty components' },
      { title: 'Filters & Consumables', caption: 'Everyday essentials' },
      { title: 'Electrical Spares', caption: 'Reliable supply' },
      { title: 'Mining Equipment', caption: 'Industry focused' },
      { title: 'Our Store', caption: 'Kitwe, Copperbelt' },
      { title: 'Ready to Help', caption: 'Fast local service' }
    ];
  }

  function catName(id, cats) {
    var c = cats.find(function (x) { return x.id === id; });
    return c ? c.name : (id || '');
  }

  function initNav() {
    var toggle = $('menuToggle');
    var nav = $('nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
      nav.querySelectorAll('.nav-link').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open');
        });
      });
    }
    var links = document.querySelectorAll('.nav-link');
    var sections = [];
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#') {
        var el = document.querySelector(href);
        if (el) sections.push({ id: href, link: a, el: el });
      }
    });
    window.addEventListener('scroll', function () {
      var y = window.scrollY + 100;
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.el.offsetTop <= y) current = s;
      });
      if (current) {
        links.forEach(function (l) { l.classList.remove('active'); });
        current.link.classList.add('active');
      }
    }, { passive: true });
  }

  var activeFilter = 'all';
  var searchQuery = '';

  function renderFilters() {
    var el = $('productFilters');
    if (!el) return;
    var cats = getCategories();
    var html = '<button class="filter-btn' + (activeFilter === 'all' ? ' active' : '') + '" data-filter="all">All</button>';
    cats.forEach(function (c) {
      html += '<button class="filter-btn' + (activeFilter === c.id ? ' active' : '') + '" data-filter="' + esc(c.id) + '">' + esc(c.name) + '</button>';
    });
    el.innerHTML = html;
    el.onclick = function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      activeFilter = btn.getAttribute('data-filter');
      renderFilters();
      renderProducts();
    };
  }

  function filteredProducts() {
    var products = getProducts();
    var cats = getCategories();
    var q = searchQuery.toLowerCase().trim();
    return products.filter(function (p) {
      if (activeFilter !== 'all' && p.category !== activeFilter) return false;
      if (!q) return true;
      var hay = (p.name + ' ' + (p.description || '') + ' ' + (p.partNumber || '') + ' ' + catName(p.category, cats)).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function renderProducts() {
    var grid = $('productsGrid');
    var empty = $('productsEmpty');
    if (!grid) return;
    var cats = getCategories();
    var list = filteredProducts();
    if (!list.length) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    grid.innerHTML = list.map(function (p) {
      var img = p.image
        ? '<div class="product-img-wrap"><img class="product-img" src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></div>'
        : '<div class="product-img-wrap product-img-placeholder"><span>📦</span></div>';
      var badge = p.featured ? '<span class="product-badge">Featured</span>' : '';
      var price = p.price || 'On request';
      var cat = catName(p.category, cats);
      var enquire = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
        'Hello C-LYN SOLUTIONS, I would like a quotation for:\n\n' + p.name +
        (p.partNumber ? ' (' + p.partNumber + ')' : '') +
        '\nPrice listed: ' + price
      );
      return '<article class="product-card' + (p.featured ? ' featured' : '') + '">' +
        img + badge +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p class="product-desc">' + esc(p.description || (p.partNumber ? 'Part: ' + p.partNumber : 'Quality spare part')) + '</p>' +
        '<div class="product-meta">' +
          '<span class="product-price">' + esc(price) + '</span>' +
          '<span class="product-cat">' + esc(cat) + '</span>' +
          '<a class="product-enquire" href="' + enquire + '" target="_blank" rel="noopener">Enquire</a>' +
        '</div></article>';
    }).join('');
  }

  function initProducts() {
    renderFilters();
    renderProducts();
    var search = $('productSearch');
    if (search) {
      var t;
      search.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          searchQuery = search.value;
          renderProducts();
        }, 180);
      });
    }
  }

  function renderGallery() {
    var grid = $('galleryGrid');
    if (!grid) return;
    var items = getGallery();
    grid.innerHTML = items.map(function (item) {
      var title = item.title || item.caption || 'Gallery';
      var cap = item.caption || item.description || '';
      var img = item.image
        ? '<img src="' + item.image + '" alt="' + esc(title) + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.55">'
        : '<div class="gallery-item-bg"></div>';
      return '<div class="gallery-item">' + img +
        '<div class="gallery-caption"><h4>' + esc(title) + '</h4><p>' + esc(cap) + '</p></div></div>';
    }).join('');
  }

  function initContact() {
    var form = $('contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('name') && $('name').value) || '';
      var phone = ($('phone') && $('phone').value) || '';
      var email = ($('email') && $('email').value) || '';
      var subject = ($('subject') && $('subject').value) || '';
      var message = ($('message') && $('message').value) || '';
      var text = 'Hello C-LYN SOLUTIONS\n\nName: ' + name +
        '\nPhone: ' + phone +
        (email ? '\nEmail: ' + email : '') +
        '\nSubject: ' + subject +
        '\n\n' + message;
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank');
      var modal = $('successModal');
      if (modal) modal.classList.add('active');
      form.reset();
    });
    var close = $('closeModal');
    if (close) {
      close.addEventListener('click', function () {
        var modal = $('successModal');
        if (modal) modal.classList.remove('active');
      });
    }
  }

  function boot() {
    var y = $('year');
    if (y) y.textContent = new Date().getFullYear();
    initNav();
    initProducts();
    renderGallery();
    initContact();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });
  } else {
    setTimeout(boot, 100);
  }

  window.addEventListener('clyn-cloud-ready', function () {
    setTimeout(function () { initProducts(); renderGallery(); }, 80);
  });
  window.addEventListener('clyn-seeded', function () {
    setTimeout(function () { initProducts(); renderGallery(); }, 80);
  });
})();
