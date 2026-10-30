/**
 * Cloud sync — shared data for all visitors; never wipe good local data with empty cloud arrays
 */
(function () {
  var API = '/api/data';
  var ADMIN_PASS = 'clyn2026';
  var _cloudReady = null;

  function hasItems(arr) {
    return Array.isArray(arr) && arr.length > 0;
  }

  function applyCloud(data) {
    if (!data || data.empty) return false;
    try {
      // Only overwrite a store if cloud has real content (avoid wiping catalogue with [])
      if (hasItems(data.products)) {
        localStorage.setItem('clyn_products', JSON.stringify(data.products));
      }
      if (hasItems(data.categories)) {
        localStorage.setItem('clyn_categories', JSON.stringify(data.categories));
      }
      if (data.settings && typeof data.settings === 'object' && Object.keys(data.settings).length) {
        var cur = {};
        try { cur = JSON.parse(localStorage.getItem('clyn_settings') || '{}'); } catch (e) {}
        localStorage.setItem('clyn_settings', JSON.stringify(Object.assign({}, cur, data.settings)));
      }
      if (hasItems(data.promotions) || (data.settings && data.settings.promoEnabled === false)) {
        localStorage.setItem('clyn_promotions', JSON.stringify(data.promotions || []));
      }
      if (hasItems(data.users)) {
        localStorage.setItem('clyn_users', JSON.stringify(data.users));
      }
      if (hasItems(data.logs)) {
        localStorage.setItem('clyn_logs', JSON.stringify(data.logs));
      }
      if (data.analytics && (data.analytics.totalViews || 0) > 0) {
        localStorage.setItem('clyn_analytics', JSON.stringify(data.analytics));
      }
      window.dispatchEvent(new CustomEvent('clyn-cloud-ready', { detail: data }));
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
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, status: r.status, body: j }; });
    });
  }

  function hookSaves() {
    if (typeof ClynData === 'undefined') return;
    ['saveProducts', 'saveCategories', 'saveSettings', 'savePromotions', 'saveUsers'].forEach(function (fn) {
      if (typeof ClynData[fn] !== 'function') return;
      var orig = ClynData[fn].bind(ClynData);
      ClynData[fn] = function (arg) {
        orig(arg);
        publishAll().then(function (res) {
          var el = document.getElementById('cloudStatus');
          if (res && res.ok) {
            console.log('Cloud published');
            if (el) { el.textContent = 'Live ✓ Saved for all visitors'; el.style.color = '#00A651'; }
          } else {
            console.warn('Cloud publish failed', res);
            if (el) { el.textContent = 'Saved on this device — cloud issue'; el.style.color = '#b45309'; }
          }
        }).catch(function (e) { console.warn(e); });
      };
    });
  }

  window.ClynCloud = { load: loadCloud, publish: publishAll, apply: applyCloud };

  loadCloud().then(function () {
    hookSaves();
    // Re-render featured products after cloud merge
    if (typeof window.renderFeatured === 'function') window.renderFeatured();
    else if (typeof initHome === 'function') initHome();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(hookSaves, 300); });
  } else {
    setTimeout(hookSaves, 300);
  }
})();
