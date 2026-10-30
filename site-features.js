/** Site features: promo banner, analytics, settings-driven hero/contact */
(function () {
  function apply() {
    if (typeof ClynData === 'undefined') return;

    try { ClynData.trackPageView(location.pathname || '/'); } catch (e) {}

    var st = ClynData.getSettings();

    var banner = document.getElementById('promoBanner');
    if (banner) {
      if (st.promoEnabled === false) {
        banner.style.display = 'none';
      } else {
        var promos = ClynData.getPromotions().filter(function (p) { return p.active; });
        if (promos.length) {
          var p = promos[0];
          banner.innerHTML = '<strong>' + (p.title || '') + '</strong>' +
            (p.message ? ' — ' + p.message : '');
          banner.style.display = 'block';
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
        el.style.backgroundRepeat = 'no-repeat';
      });
    }

    var about = document.getElementById('aboutText');
    if (about && st.about) about.textContent = st.about;
    var wa = String(st.whatsapp || st.phoneRaw || '260965018323').replace(/\D/g, '');
    var headerWa = document.getElementById('headerWa');
    if (headerWa) headerWa.href = 'https://wa.me/' + wa;
    var phoneEl = document.getElementById('contactPhone');
    if (phoneEl && st.phone) phoneEl.textContent = st.phone;
    var emailEl = document.getElementById('contactEmail');
    if (emailEl && st.email) emailEl.textContent = st.email;
    var addrEl = document.getElementById('contactAddress');
    if (addrEl && st.address) addrEl.textContent = st.address;
    var hoursEl = document.getElementById('contactHours');
    if (hoursEl && st.hours) hoursEl.textContent = st.hours;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
