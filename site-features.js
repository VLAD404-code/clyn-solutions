(function () {
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }
  function ensureModal() {
    if (document.getElementById('promoDetailModal')) return;
    var wrap = document.createElement('div');
    wrap.id = 'promoDetailModal';
    wrap.className = 'promo-modal-bg';
    wrap.style.display = 'none';
    wrap.innerHTML =
      '<div class="promo-modal" role="dialog">' +
      '<button type="button" class="promo-modal-close" id="promoModalClose">&times;</button>' +
      '<div id="promoModalBody"></div></div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (e) {
      if (e.target === wrap || e.target.id === 'promoModalClose') wrap.style.display = 'none';
    });
  }
  function openPromoDetail(p) {
    ensureModal();
    var body = document.getElementById('promoModalBody');
    var pct = parseInt(p.percent, 10) || 0;
    var badge = pct > 0
      ? '<span class="promo-pct">' + pct + '% OFF</span>'
      : '<span class="promo-tag">SPECIAL OFFER</span>';
    var img = p.image
      ? '<img class="promo-detail-img" src="' + esc(p.image) + '" alt="' + esc(p.title) + '">' : '';
    var cat = '';
    if (p.category && typeof ClynData !== 'undefined') {
      try {
        var c = ClynData.getCategories().find(function (x) { return x.id === p.category; });
        if (c) cat = c.name;
      } catch (e) {}
    }
    var duration = '';
    if (p.endDate) {
      try {
        var end = new Date(p.endDate);
        var days = Math.ceil((end - new Date()) / 86400000);
        if (days < 0) duration = '<p class="promo-duration">This promotion has ended.</p>';
        else if (days === 0) duration = '<p class="promo-duration"><strong>Ends today</strong></p>';
        else duration = '<p class="promo-duration"><strong>Ends:</strong> ' + end.toLocaleDateString() +
          ' <span>(' + days + ' day' + (days === 1 ? '' : 's') + ' left)</span></p>';
      } catch (e) {
        duration = '<p class="promo-duration"><strong>Valid until:</strong> ' + esc(p.endDate) + '</p>';
      }
    } else if (p.duration) {
      duration = '<p class="promo-duration"><strong>Duration:</strong> ' + esc(p.duration) + '</p>';
    } else {
      duration = '<p class="promo-duration">Limited time offer — contact us for details.</p>';
    }
    body.innerHTML =
      '<div class="promo-detail-head">' + badge + '<h2>' + esc(p.title || 'Special Offer') + '</h2></div>' +
      img +
      '<p class="promo-detail-msg">' + esc(p.message || '') + '</p>' +
      (cat ? '<p class="promo-detail-cat"><strong>Category:</strong> ' + esc(cat) + '</p>' : '') +
      duration +
      '<a class="btn btn-primary" style="margin-top:16px;display:inline-flex" href="https://wa.me/260965018323?text=' +
      encodeURIComponent('Hi C-LYN, I am interested in the promotion: ' + (p.title || '') + (pct ? ' (' + pct + '% OFF)' : '')) +
      '" target="_blank" rel="noopener">Enquire on WhatsApp</a>';
    document.getElementById('promoDetailModal').style.display = 'flex';
  }
  function apply() {
    if (typeof ClynData === 'undefined') return;
    try { ClynData.trackPageView(location.pathname || '/'); } catch (e) {}
    var st = ClynData.getSettings();
    var banner = document.getElementById('promoBanner');
    if (banner) {
      if (st.promoEnabled === false) {
        banner.style.display = 'none';
      } else {
        var promos = ClynData.getPromotions().filter(function (p) {
          if (!p.active) return false;
          if (p.endDate) {
            try { if (new Date(p.endDate) < new Date(new Date().toDateString())) return false; } catch (e) {}
          }
          return true;
        });
        if (promos.length) {
          var p = promos[0];
          var pct = parseInt(p.percent, 10) || 0;
          var badge = pct > 0 ? '<span class="promo-pct">' + pct + '% OFF</span>' : '<span class="promo-tag">SPECIAL OFFER</span>';
          banner.innerHTML =
            '<div class="promo-inner promo-clickable" role="button" tabindex="0">' +
            badge +
            '<span class="promo-text"><strong>' + esc(p.title || 'Special Offer') + '</strong>' +
            (p.message ? ' — ' + esc(p.message) : '') + '</span>' +
            '<span class="promo-tap">Tap for details →</span></div>';
          banner.style.display = 'block';
          banner.style.cursor = 'pointer';
          banner.onclick = function () { openPromoDetail(p); };
        } else {
          banner.style.display = 'none';
        }
      }
    }
    if (st.heroImage) {
      document.querySelectorAll('.hero-bg, .page-hero-bg').forEach(function (el) {
        el.style.backgroundImage =
          "linear-gradient(160deg, rgba(18,18,31,0.88) 0%, rgba(10,26,18,0.82) 55%, rgba(8,20,14,0.9) 100%), url('" +
          st.heroImage + "')";
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center right';
      });
    }
    var about = document.getElementById('aboutText');
    if (about && st.about) about.textContent = st.about;
    var wa = String(st.whatsapp || '260965018323').replace(/\D/g, '');
    var headerWa = document.getElementById('headerWa');
    if (headerWa) headerWa.href = 'https://wa.me/' + wa;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
