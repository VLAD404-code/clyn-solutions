(function () {
  var SAMPLE_CATS = [
    { id: 'filters', name: 'Filters', image: '', description: 'Oil, fuel, air filters' },
    { id: 'engine', name: 'Engine Parts', image: '', description: 'Gaskets, seals, kits' },
    { id: 'brakes', name: 'Brakes', image: '', description: 'Pads, discs, chambers' },
    { id: 'electrical', name: 'Electrical', image: '', description: 'Alternators, starters' },
    { id: 'hydraulics', name: 'Hydraulics', image: '', description: 'Hoses, pumps, valves' },
    { id: 'transmission', name: 'Transmission', image: '', description: 'Clutch, gearbox' }
  ];
  var SAMPLE_PRODUCTS = [
    { id: 'p1', name: 'Oil Filter — Heavy Duty', category: 'filters', partNumber: 'OF-HD-220', price: 'On request', featured: true, description: 'For mining trucks and excavators', image: '' },
    { id: 'p2', name: 'Fuel Filter Element', category: 'filters', partNumber: 'FF-450', price: 'On request', featured: true, description: 'High efficiency fuel filter', image: '' },
    { id: 'p3', name: 'Brake Pad Set (Front)', category: 'brakes', partNumber: 'BP-F90', price: 'On request', featured: true, description: 'Heavy duty truck brake pads', image: '' },
    { id: 'p4', name: 'Alternator 24V', category: 'electrical', partNumber: 'ALT-24-110', price: 'On request', featured: true, description: '24V high output alternator', image: '' },
    { id: 'p5', name: 'Hydraulic Hose Assembly', category: 'hydraulics', partNumber: 'HH-2SN-12', price: 'On request', featured: true, description: '2SN high pressure hose', image: '' },
    { id: 'p6', name: 'Engine Gasket Kit', category: 'engine', partNumber: 'EGK-6CT', price: 'On request', featured: true, description: 'Full upper gasket set', image: '' }
  ];

  function ensureData() {
    if (typeof ClynData === 'undefined') return;
    // Only seed once ever — never restore after admin deletes
    if (localStorage.getItem('clyn_seeded_ok') === '1') return;
    var products = ClynData.getProducts();
    var cats = ClynData.getCategories();
    var need = false;
    if (!products || !products.length) {
      localStorage.setItem('clyn_products', JSON.stringify(SAMPLE_PRODUCTS));
      need = true;
    }
    if (!cats || !cats.length) {
      localStorage.setItem('clyn_categories', JSON.stringify(SAMPLE_CATS));
      need = true;
    }
    localStorage.setItem('clyn_seeded_ok', '1');
    if (need && window.ClynCloud && ClynCloud.publish) {
      try { ClynCloud.publish(); } catch (e) {}
    }
  }

  function renderCats() {
    var grid = document.getElementById('categoryGrid');
    if (!grid) return;
    var cats = (typeof ClynData !== 'undefined') ? ClynData.getCategories() : [];
    if (!cats.length) cats = SAMPLE_CATS;
    var icons = ['🔧', '⚙️', '🛑', '⚡', '💧', '🔩'];
    grid.innerHTML = cats.map(function (c, i) {
      return '<a class="cat-tile" href="products.html?cat=' + encodeURIComponent(c.id) +
        '" style="animation-delay:' + (i * 80) + 'ms">' +
        '<div class="cat-icon">' + icons[i % icons.length] + '</div>' +
        '<strong>' + (c.name || c.id) + '</strong></a>';
    }).join('');
  }

  function boot() {
    ensureData();
    renderCats();
    window.dispatchEvent(new Event('clyn-seeded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 120); });
  } else {
    setTimeout(boot, 120);
  }
  window.addEventListener('clyn-cloud-ready', function () { setTimeout(boot, 80); });
})();
