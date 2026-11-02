(function () {
  var WA = '260965018323';

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' })[m];
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

  function getPromotions() {
    if (typeof ClynData !== 'undefined' && ClynData.getPromotions) {
      return ClynData.getPromotions() || [];
    }
    return [];
  }

  function getGallery() {
    if (typeof ClynData !== 'undefined' && ClynData.getGallery) {
      var g = ClynData.getGallery();
      if (g && g.length) return g;
    }
    return [
      { title: 'Truck Parts', caption: 'Heavy duty components', image: 'https://raw.githubusercontent.com/VLAD404-code/clyn-solutions/main/images/gallery1.jpg' },
      { title: 'Filters & Consumables', caption: 'Everyday essentials', image: 'https://raw.githubusercontent.com/VLAD404-code/clyn-solutions/main/images/gallery2.jpg' },
      { title: 'Engine Parts', caption: 'Reliable supply', image: 'https://raw.githubusercontent.com/VLAD404-code/clyn-solutions/main/images/cummins.jpg' },
      { title: 'Air Filters', caption: 'Clean air, better performance', image: 'https://raw.githubusercontent.com/VLAD404-code/clyn-solutions/main/images/filter.jpg' },
      { title: 'Volvo Engines', caption: 'OEM quality', image: 'https://raw.githubusercontent.com/VLAD404-code/clyn-solutions/main/images/volvo.jpg' },
      { title: 'Accessories', caption: 'Lights and more', image: 'https://raw.githubusercontent.com/VLAD404-code/clyn-solutions/main/images/accessories.jpg' }
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

  var activeCat = null;
  var searchQuery = '';
  var catsShown = 6;

  function cardHtml(p) {
    var img = p.image
      ? '<div class="product-img-wrap"><img class="product-img" src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy"></div>'
      : '<div class="product-img-wrap product-img-placeholder"><span>📦</span></div>';
    var price = p.price || 'On request';
    var enquire = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
      'Hello C-LYN SOLUTIONS, I would like a quotation for:\n\n' + p.name +
      (p.partNumber ? ' (' + p.partNumber + ')' : '') +
      '\nPrice listed: ' + price
    );
    return '<article class="product-card" data-enquire="' + enquire + '" style="cursor:pointer">' +
      img +
      '<div style="padding:16px">' +
      '<h3>' + esc(p.name) + '</h3>' +
      '<p class="product-desc">' + esc(p.partNumber ? 'Part: ' + p.partNumber : (p.description || '')) + '</p>' +
      '<div class="product-meta">' +
        '<span class="product-price">' + esc(price) + '</span>' +
        '<a class="product-enquire btn btn-primary btn-sm" href="' + enquire + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Get a quote</a>' +
      '</div></div></article>';
  }

  function renderCategories() {
    var grid = $('categoryGrid');
    var more = $('showMoreCats');
    var empty = $('productsEmpty');
    if (!grid) return;
    var cats = getCategories();
    var products = getProducts();
    var shown = cats.slice(0, catsShown);
    grid.innerHTML = shown.map(function (c) {
      var count = products.filter(function (p) { return p.category === c.id; }).length;
      var cimg = c.image ? '<div class="product-img-wrap"><img class="product-img" src="' + c.image + '" alt="' + esc(c.name) + '"></div>' : '';
      return '<article class="product-card" data-opencat="' + esc(c.id) + '" style="cursor:pointer">' +
        cimg +
        '<div style="padding:16px;text-align:center">' +
        '<h3 style="margin-bottom:6px">' + esc(c.name) + '</h3>' +
        '<p class="product-desc">' + count + ' items</p>' +
        '<span class="btn btn-primary btn-sm">View items</span>' +
        '</div></article>';
    }).join('');
    if (more) more.style.display = catsShown < cats.length ? 'inline-flex' : 'none';
    if (empty) empty.style.display = 'none';
    grid.onclick = function (e) {
      var card = e.target.closest('[data-opencat]');
      if (!card) return;
      openCategory(card.getAttribute('data-opencat'));
    };
  }

  function openCategory(id) {
    activeCat = id;
    searchQuery = '';
    var s = $('productSearch');
    if (s) s.value = '';
    $('categoryView').style.display = 'none';
    $('itemsView').style.display = 'block';
    var cats = getCategories();
    var c = cats.find(function (x) { return x.id === id; });
    $('activeCatTitle').textContent = c ? c.name : id;
    renderItems();
  }

  function renderItems() {
    var grid = $('productsGrid');
    var empty = $('productsEmpty');
    if (!grid) return;
    var products = getProducts();
    var q = searchQuery.toLowerCase().trim();
    var list = products.filter(function (p) {
      if (activeCat && p.category !== activeCat) return false;
      if (!q) return true;
      var hay = (p.name + ' ' + (p.partNumber || '') + ' ' + (p.description || '')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    if (!list.length) {
      grid.innerHTML = '';
      if (empty) { empty.style.display = 'block'; empty.textContent = 'Not found'; }
      return;
    }
    if (empty) empty.style.display = 'none';
    grid.innerHTML = list.map(cardHtml).join('');
    grid.onclick = function (e) {
      var card = e.target.closest('[data-enquire]');
      if (!card) return;
      if (e.target.closest('a')) return;
      window.open(card.getAttribute('data-enquire'), '_blank');
    };
  }

  function renderSearch() {
    var q = searchQuery.toLowerCase().trim();
    var empty = $('productsEmpty');
    if (!q) {
      if (activeCat) { $('categoryView').style.display = 'none'; $('itemsView').style.display = 'block'; renderItems(); }
      else { $('categoryView').style.display = 'block'; $('itemsView').style.display = 'none'; renderCategories(); }
      if (empty) empty.style.display = 'none';
      return;
    }
    $('categoryView').style.display = 'none';
    $('itemsView').style.display = 'block';
    $('activeCatTitle').textContent = 'Search results';
    var products = getProducts();
    var list = products.filter(function (p) {
      var hay = (p.name + ' ' + (p.partNumber || '') + ' ' + (p.description || '')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    var grid = $('productsGrid');
    if (!list.length) {
      grid.innerHTML = '';
      if (empty) { empty.style.display = 'block'; empty.textContent = 'Not found'; }
      return;
    }
    if (empty) empty.style.display = 'none';
    grid.innerHTML = list.map(cardHtml).join('');
    grid.onclick = function (e) {
      var card = e.target.closest('[data-enquire]');
      if (!card) return;
      if (e.target.closest('a')) return;
      window.open(card.getAttribute('data-enquire'), '_blank');
    };
  }

  function initProducts() {
    renderCategories();
    var search = $('productSearch');
    if (search) {
      var t;
      search.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          searchQuery = search.value;
          renderSearch();
        }, 180);
      });
    }
    var more = $('showMoreCats');
    if (more) more.onclick = function () { catsShown += 6; renderCategories(); };
    var back = $('backToCats');
    if (back) back.onclick = function () {
      activeCat = null;
      searchQuery = '';
      if (search) search.value = '';
      $('itemsView').style.display = 'none';
      $('categoryView').style.display = 'block';
      renderCategories();
    };
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

  function renderPromotions() {
    var promoSection = $('promoSection');
    var formWrap = $('contactFormWrap');
    var grid = $('promoGrid');
    if (!promoSection || !formWrap) return;
    var promos = getPromotions().filter(function (p) {
      return p && (p.active === true || p.active === 'true' || p.active === 1);
    });
    if (promos.length) {
      promoSection.classList.add('visible');
      formWrap.classList.add('hidden');
      var products = getProducts();
      var cats = getCategories();
      grid.innerHTML = promos.map(function (p) {
        var pct = p.percent || p.percentage || p.discount || '';
        var pctHtml = pct ? '<div class="promo-percent">' + esc(String(pct)) + (String(pct).indexOf('%') === -1 ? '%' : '') + ' OFF</div>' : '';
        var product = p.productId ? products.find(function (x) { return x.id === p.productId; }) : null;
        var imgSrc = p.image || (product && product.image) || '';
        var img = imgSrc ? '<img src="' + imgSrc + '" alt="" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:12px;background:#fff">' : '';
        var productLine = product
          ? '<div style="font-size:.85rem;opacity:.9;margin-bottom:6px">On: <strong>' + esc(product.name) + '</strong>' + (product.partNumber ? ' (' + esc(product.partNumber) + ')' : '') + '</div>'
          : '';
        var catLine = p.category ? '<div style="font-size:.8rem;opacity:.75;margin-bottom:8px">' + esc(catName(p.category, cats)) + '</div>' : '';
        var wa = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
          'Hello C-LYN SOLUTIONS, I would like to enquire about the promotion: ' + (p.title || '') + (product ? ' — ' + product.name : '')
        );
        return '<div class="promo-card">' +
          '<span class="promo-badge">PROMOTION</span>' +
          img +
          '<h3>' + esc(p.title || 'Special Offer') + '</h3>' +
          productLine +
          '<p>' + esc(p.message || p.description || '') + '</p>' +
          catLine +
          pctHtml +
          '<a class="btn" href="' + wa + '" target="_blank" rel="noopener">Enquire on WhatsApp</a>' +
          '</div>';
      }).join('');
    } else {
      promoSection.classList.remove('visible');
      formWrap.classList.remove('hidden');
    }
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

  function applyBranding() {
    var st = {};
    try { if (typeof ClynData !== 'undefined') st = ClynData.getSettings() || {}; } catch (e) {}
    var logo = st.logo || '';
    var hero = st.heroImage || '';
    document.querySelectorAll('.logo').forEach(function (logoEl) {
      var icon = logoEl.querySelector('.logo-icon');
      var img = logoEl.querySelector('.logo-img');
      if (logo) {
        if (!img) {
          img = document.createElement('img');
          img.className = 'logo-img';
          img.alt = 'C-LYN';
          img.style.cssText = 'width:40px;height:40px;object-fit:contain;border-radius:8px;background:#fff';
          if (icon) logoEl.insertBefore(img, icon);
          else logoEl.insertBefore(img, logoEl.firstChild);
        }
        img.src = logo;
        img.style.display = 'block';
        if (icon) icon.style.display = 'none';
      } else if (img) {
        img.style.display = 'none';
        if (icon) icon.style.display = '';
      }
    });
    var bg = document.querySelector('.hero-bg');
    if (bg && hero && hero.indexOf('data:') === 0) {
      bg.style.backgroundImage = 'linear-gradient(rgba(26,26,46,0.55), rgba(26,26,46,0.65)), url("' + hero + '")';
      bg.style.backgroundSize = 'cover';
      bg.style.backgroundPosition = 'center';
    }
    if (st.phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
        a.href = 'tel:' + st.phone.replace(/\s/g, '');
        a.textContent = st.phone;
      });
    }
    if (st.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.href = 'mailto:' + st.email;
        a.textContent = st.email;
      });
    }
    if (st.whatsapp) {
      document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
        var base = 'https://wa.me/' + st.whatsapp;
        var href = a.getAttribute('href') || '';
        var q = href.indexOf('?');
        a.href = q > -1 ? base + href.slice(q) : base;
      });
    }
    if (st.address) {
      document.querySelectorAll('.contact-item').forEach(function (item) {
        if ((item.innerText || '').indexOf('Address') !== -1) {
          var p = item.querySelector('p');
          if (p) p.textContent = st.address + (st.location ? ', ' + st.location : '');
        }
      });
    }
    if (st.tagline) {
      var tag = document.querySelector('.footer-tagline');
      if (tag) tag.textContent = st.tagline;
    }
    if (st.about) {
      var about = document.querySelector('#about .about-content');
      if (about) {
        var ps = about.querySelectorAll('p');
        if (ps[0]) ps[0].textContent = st.about;
      }
    }
    if (st.hours) {
      var hours = document.querySelector('.about-card-hours');
      if (hours) {
        var spans = hours.querySelectorAll('span');
        if (spans.length) spans[0].textContent = st.hours;
        if (spans[1]) spans[1].textContent = '';
      }
    }
  }

  function boot() {
    var y = $('year');
    if (y) y.textContent = new Date().getFullYear();
    initNav();
    initProducts();
    renderGallery();
    renderPromotions();
    initContact();
    applyBranding();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });
  } else {
    setTimeout(boot, 100);
  }

  window.addEventListener('clyn-cloud-ready', function () {
    setTimeout(function () { initProducts(); renderGallery(); renderPromotions(); applyBranding(); }, 80);
  });
  window.addEventListener('clyn-seeded', function () {
    setTimeout(function () { initProducts(); renderGallery(); renderPromotions(); }, 80);
  });
})();
