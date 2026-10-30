window.ClynImages = window.ClynImages || {};
(function () {
  function apply() {
    var logoSrc = '';
    try {
      if (typeof ClynData !== 'undefined') {
        var st = ClynData.getSettings();
        if (st && st.logo) logoSrc = st.logo;
      }
    } catch (e) {}
    if (!logoSrc && ClynImages.logo) logoSrc = ClynImages.logo;

    document.querySelectorAll('#siteLogo, .logo-img, #adminLogo, .login-logo-img').forEach(function (el) {
      if (!el) return;
      if (logoSrc) {
        el.src = logoSrc;
        el.alt = 'C-LYN';
        el.style.display = 'block';
        el.classList.add('has-logo');
      } else {
        el.removeAttribute('src');
        el.style.display = 'none';
        el.classList.remove('has-logo');
      }
    });

    document.querySelectorAll('.logo').forEach(function (logo) {
      var mark = logo.querySelector('.logo-mark');
      var img = logo.querySelector('.logo-img, #siteLogo');
      if (logoSrc) {
        if (mark) mark.style.display = 'none';
        if (img) img.style.display = 'block';
      } else {
        if (!mark) {
          mark = document.createElement('span');
          mark.className = 'logo-mark';
          mark.setAttribute('aria-hidden', 'true');
          mark.textContent = 'C';
          logo.insertBefore(mark, logo.firstChild);
        }
        mark.style.display = 'flex';
        if (img) img.style.display = 'none';
      }
    });

    /* Admin login */
    var adminLogo = document.getElementById('adminLogo');
    if (adminLogo && adminLogo.parentElement) {
      if (logoSrc) {
        adminLogo.src = logoSrc;
        adminLogo.style.display = 'block';
        var m = adminLogo.parentElement.querySelector('.logo-mark');
        if (m) m.style.display = 'none';
      } else {
        adminLogo.style.display = 'none';
        if (!adminLogo.parentElement.querySelector('.logo-mark')) {
          var m2 = document.createElement('div');
          m2.className = 'logo-mark';
          m2.style.width = '64px';
          m2.style.height = '64px';
          m2.style.fontSize = '1.6rem';
          m2.style.margin = '0 auto';
          m2.textContent = 'C';
          adminLogo.parentElement.insertBefore(m2, adminLogo);
        }
      }
    }
  }
  function run() {
    /* Wait for data.js if present */
    if (typeof ClynData === 'undefined') {
      setTimeout(function () {
        apply();
      }, 50);
    }
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
