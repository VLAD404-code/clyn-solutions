/**
 * Cloud sync — load shared data for all visitors; push on admin save
 */
(function () {
  var API = '/api/data';
  var ADMIN_PASS = 'clyn2026';
  var _cloudReady = null;
  var _lastCloud = null;

  function applyCloud(data) {
    if (!data || data.empty) return false;
    try {
      if (data.products) localStorage.setItem('clyn_products', JSON.stringify(data.products));
      if (data.categories) localStorage.setItem('clyn_categories', JSON.stringify(data.categories));
      if (data.settings) localStorage.setItem('clyn_settings', JSON.stringify(data.settings));
      if (data.promotions) localStorage.setItem('clyn_promotions', JSON.stringify(data.promotions));
      if (data.users) localStorage.setItem('clyn_users', JSON.stringify(data.users));
      if (data.logs) localStorage.setItem('clyn_logs', JSON.stringify(data.logs));
      if (data.analytics) localStorage.setItem('clyn_analytics', JSON.stringify(data.analytics));
      _lastCloud = data;
      return true;
    } catch (e) {
      console.warn('cloud apply failed', e);
      return false;
    }
  }

  function loadCloud() {
    if (_cloudReady) return _cloudReady;
    _cloudReady = fetch(API + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        applyCloud(data);
        window.dispatchEvent(new CustomEvent('clyn-cloud-ready', { detail: data }));
        return data;
      })
      .catch(function (e) {
        console.warn('cloud load failed', e);
        return null;
      });
    return _cloudReady;
  }

  function publishAll() {
    if (typeof ClynData === 'undefined') return Promise.reject(new Error('ClynData missing'));
    var body = {
      password: ADMIN_PASS,
      products: ClynData.getProducts(),
      categories: ClynData.getCategories(),
      settings: ClynData.getSettings(),
      promotions: ClynData.getPromotions(),
      users: ClynData.getUsers(),
      logs: ClynData.getLogs ? ClynData.getLogs() : [],
      analytics: ClynData.getAnalytics ? ClynData.getAnalytics() : {}
    };
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; }); });
  }

  /** Hook saves so every admin save also publishes to cloud */
  function hookSaves() {
    if (typeof ClynData === 'undefined') return;
    ['saveProducts', 'saveCategories', 'saveSettings', 'savePromotions', 'saveUsers'].forEach(function (fn) {
      if (typeof ClynData[fn] !== 'function') return;
      var orig = ClynData[fn].bind(ClynData);
      ClynData[fn] = function (arg) {
        orig(arg);
        publishAll().then(function (res) {
          if (res && res.ok) {
            console.log('Cloud published');
            var el = document.getElementById('cloudStatus');
            if (el) { el.textContent = 'Live ✓ Saved for all visitors'; el.style.color = '#00A651'; }
          } else {
            console.warn('Cloud publish failed', res);
            var el2 = document.getElementById('cloudStatus');
            if (el2) { el2.textContent = 'Saved on this device only — cloud not ready'; el2.style.color = '#b45309'; }
          }
        }).catch(function (e) {
          console.warn(e);
        });
      };
    });
  }

  window.ClynCloud = { load: loadCloud, publish: publishAll, apply: applyCloud };

  // Public site: load cloud first
  loadCloud().then(function () {
    hookSaves();
  });

  // Admin: also hook after a short delay in case ClynData loads later
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(hookSaves, 300); });
  } else {
    setTimeout(hookSaves, 300);
  }
})();
