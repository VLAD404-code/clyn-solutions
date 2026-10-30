(function () {
  function rerun() {
    try { if (typeof window.initHome === 'function') window.initHome(); } catch (e) {}
    try { if (typeof window.initProductsPage === 'function') window.initProductsPage(); } catch (e) {}
    try { if (typeof window.initReveal === 'function') window.initReveal(); } catch (e) {}
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add('visible');
    });
  }
  window.addEventListener('clyn-cloud-ready', function () { setTimeout(rerun, 120); });
  window.addEventListener('clyn-seeded', function () { setTimeout(rerun, 80); });
  setTimeout(rerun, 500);
  setTimeout(rerun, 1200);
})();
