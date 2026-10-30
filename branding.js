window.ClynImages = window.ClynImages || {};
/* Clean SVG logo — always loads */
if (!ClynImages.logo) {
  ClynImages.logo = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    '<rect width="64" height="64" rx="12" fill="#00A651"/>' +
    '<text x="32" y="42" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="28" fill="#fff">C</text>' +
    '</svg>'
  );
}
(function () {
  function apply() {
    var logoSrc = ClynImages.logo;
    document.querySelectorAll('#siteLogo, .logo-img, #adminLogo, .login-logo-img').forEach(function (el) {
      if (!el) return;
      el.src = logoSrc;
      el.alt = 'C-LYN';
      el.style.display = 'block';
    });
    document.querySelectorAll('.logo-mark').forEach(function (el) {
      if (el) el.style.display = 'none';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
