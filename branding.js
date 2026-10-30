window.ClynImages = window.ClynImages || {};
(function () {
  function apply() {
    /* Reliable logo: green C square — no image dependency */
    document.querySelectorAll('#siteLogo, .logo-img, #adminLogo, .login-logo-img').forEach(function (el) {
      if (!el) return;
      el.style.display = 'none';
      el.removeAttribute('src');
    });
    document.querySelectorAll('.logo').forEach(function (logo) {
      if (!logo.querySelector('.logo-mark')) {
        var mark = document.createElement('span');
        mark.className = 'logo-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.textContent = 'C';
        logo.insertBefore(mark, logo.firstChild);
      }
    });
    document.querySelectorAll('.logo-mark').forEach(function (el) {
      el.style.display = 'flex';
    });
    /* Admin login logo */
    var adminLogo = document.getElementById('adminLogo');
    if (adminLogo && adminLogo.parentElement) {
      adminLogo.style.display = 'none';
      if (!adminLogo.parentElement.querySelector('.logo-mark')) {
        var m = document.createElement('div');
        m.className = 'logo-mark';
        m.style.width = '64px';
        m.style.height = '64px';
        m.style.fontSize = '1.6rem';
        m.style.margin = '0 auto';
        m.textContent = 'C';
        adminLogo.parentElement.insertBefore(m, adminLogo);
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
