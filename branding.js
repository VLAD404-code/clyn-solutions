/**
 * C-LYN branding – logo + subtle hero parts background
 */
(function () {
  window.ClynImages = window.ClynImages || {};

  if (!ClynImages.heroParts) {
    var h = (ClynImages._h0 || '') + (ClynImages._h1 || '') + (ClynImages._h2 || '') +
            (ClynImages._h3 || '') + (ClynImages._h4 || '');
    if (h.length > 100) {
      ClynImages.heroParts = 'data:image/jpeg;base64,' + h;
    }
  }

  function apply() {
    var logoSrc = ClynImages.logo || 'images/logo.png';
    document.querySelectorAll('#siteLogo, .logo-img, #adminLogo, .login-logo-img').forEach(function (el) {
      if (!el) return;
      el.src = logoSrc;
      el.style.display = 'block';
      el.onerror = function () {
        if (ClynImages.logo && el.src !== ClynImages.logo) {
          el.src = ClynImages.logo;
        }
      };
    });
    document.querySelectorAll('.logo-mark').forEach(function (el) {
      if (el) el.style.display = 'none';
    });

    if (ClynImages.heroParts) {
      document.querySelectorAll('.hero-bg, .page-hero-bg').forEach(function (el) {
        if (!el) return;
        el.style.backgroundImage =
          "linear-gradient(160deg, rgba(18,18,31,0.88) 0%, rgba(10,26,18,0.82) 55%, rgba(8,20,14,0.9) 100%), url('" +
          ClynImages.heroParts + "')";
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center right';
        el.style.backgroundRepeat = 'no-repeat';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
