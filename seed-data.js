/** Seed sample catalogue if empty — so UI is never a blank void */
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

  function seed() {
    if (typeof ClynData === 'undefined') return;
    var products = ClynData.getProducts();
    var cats = ClynData.getCategories();
    var changed = false;
    if (!products || !products.length) {
      ClynData.saveProducts(SAMPLE_PRODUCTS);
      changed = true;
    }
    if (!cats || !cats.length) {
      ClynData.saveCategories(SAMPLE_CATS);
      changed = true;
    }
    if (changed && window.ClynCloud && typeof ClynCloud.publish === 'function') {
      ClynCloud.publish().catch(function () {});
    }
    return changed;
  }

  function renderCats() {
    var grid = document.getElementById('categoryGrid');
    if (!grid || typeof ClynData === 'undefined') return;
    var cats = ClynData.getCategories();
    if (!cats.length) cats = SAMPLE_CATS;
    var icons = ['🔧', '⚙️', '🛑', '⚡', '💧', '🔩', '📦', '🛠️'];
    grid.innerHTML = cats.map(function (c, i) {
      return '<a class="cat-tile" href="products.html?cat=' + encodeURIComponent(c.id) + '" style="animation-delay:' + (i * 70) + 'ms">' +
        '<div class="cat-icon">' + (icons[i % icons.length]) + '</div>' +
        '<strong>' + (c.name || c.id) + '</strong></a>';
    }).join('');
  }

  function boot() {
    seed();
    renderCats();
    // Re-run home featured after seed
    setTimeout(function () {
      if (typeof ClynData !== 'undefined') {
        var grid = document.getElementById('featuredGrid');
        if (grid && grid.textContent.indexOf('No products') !== -1) {
          // trigger re-init by dispatching
          window.dispatchEvent(new Event('clyn-seeded'));
        }
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(boot, 150);
    });
  } else {
    setTimeout(boot, 150);
  }

  window.addEventListener('clyn-cloud-ready', function () {
    setTimeout(boot, 50);
  });
})();
