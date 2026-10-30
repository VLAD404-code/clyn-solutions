(function () {
  function rerun() {
    try {
      if (typeof window.initHome === 'function') window.initHome();
    } catch (e) {}
    document.querySelectorAll('.reveal').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) el.classList.add('visible');
    });
  }
  window.addEventListener('clyn-cloud-ready', function () { setTimeout(rerun, 150); });
  window.addEventListener('clyn-seeded', function () { setTimeout(rerun, 80); });
  setTimeout(rerun, 400);
  setTimeout(rerun, 900);
})();
