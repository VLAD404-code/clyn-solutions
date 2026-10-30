(function () {
  var cfg = window.CLYN_SUPABASE || {};
  var URL = cfg.url;
  var KEY = cfg.key;
  var ready = null;

  function headers(extra) {
    var h = {
      'apikey': KEY,
      'Authorization': 'Bearer ' + KEY,
      'Content-Type': 'application/json'
    };
    if (extra) Object.keys(extra).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }

  function api(path, opts) {
    opts = opts || {};
    return fetch(URL + '/rest/v1/' + path, {
      method: opts.method || 'GET',
      headers: headers(opts.headers),
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.json().then(function (j) {
        if (!r.ok) {
          console.warn('Supabase error', path, j);
          throw new Error((j && j.message) || r.statusText);
        }
        return j;
      });
    });
  }

  function mapProduct(row) {
    return {
      id: row.id,
      name: row.name,
      category: row.category || '',
      partNumber: row.part_number || '',
      price: row.price || 'On request',
      description: row.description || '',
      featured: !!row.featured,
      image: row.image || ''
    };
  }
  function toProductRow(p) {
    return {
      id: p.id,
      name: p.name,
      category: p.category || '',
      part_number: p.partNumber || '',
      price: p.price || 'On request',
      description: p.description || '',
      featured: !!p.featured,
      image: p.image || '',
      updated_at: new Date().toISOString()
    };
  }
  function mapCat(row) {
    return { id: row.id, name: row.name, description: row.description || '', image: row.image || '' };
  }
  function mapPromo(row) {
    return {
      id: row.id,
      title: row.title,
      message: row.message || '',
      percent: row.percent || 0,
      category: row.category || '',
      image: row.image || '',
      active: row.active !== false,
      endDate: row.end_date || ''
    };
  }
  function toPromoRow(p) {
    return {
      id: p.id,
      title: p.title,
      message: p.message || '',
      percent: p.percent || 0,
      category: p.category || '',
      image: p.image || '',
      active: p.active !== false,
      end_date: p.endDate || '',
      updated_at: new Date().toISOString()
    };
  }

  function loadAll() {
    if (ready) return ready;
    ready = Promise.all([
      api('products?select=*&order=name'),
      api('categories?select=*&order=name'),
      api('promotions?select=*'),
      api('settings?id=eq.main&select=data'),
      api('admin_users?select=*'),
      api('activity_logs?select=*&order=at.desc&limit=100'),
      api('analytics?id=eq.main&select=data')
    ]).then(function (res) {
      var products = (res[0] || []).map(mapProduct);
      var categories = (res[1] || []).map(mapCat);
      var promotions = (res[2] || []).map(mapPromo);
      var settingsRow = res[3] && res[3][0];
      var settings = (settingsRow && settingsRow.data) || {};
      var users = (res[4] || []).map(function (u) {
        return { id: u.id, name: u.name, username: u.username, password: u.password, role: u.role || 'admin' };
      });
      var logs = (res[5] || []).map(function (l) {
        return { at: l.at, user: l.username, action: l.action, detail: l.detail };
      });
      var analytics = (res[6] && res[6][0] && res[6][0].data) || { totalViews: 0, pages: {}, visits: [] };

      try {
        if (products.length) localStorage.setItem('clyn_products', JSON.stringify(products));
        if (categories.length) localStorage.setItem('clyn_categories', JSON.stringify(categories));
        localStorage.setItem('clyn_promotions', JSON.stringify(promotions || []));
        if (settings && Object.keys(settings).length) {
          var cur = {};
          try { cur = JSON.parse(localStorage.getItem('clyn_settings') || '{}'); } catch (e) {}
          localStorage.setItem('clyn_settings', JSON.stringify(Object.assign({}, cur, settings)));
        }
        if (users.length) localStorage.setItem('clyn_users', JSON.stringify(users));
        if (logs.length) localStorage.setItem('clyn_logs', JSON.stringify(logs));
        localStorage.setItem('clyn_analytics', JSON.stringify(analytics));
        localStorage.setItem('clyn_seeded_ok', '1');
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('clyn-cloud-ready', { detail: { products: products, categories: categories, promotions: promotions, settings: settings } }));
      return { products: products, categories: categories, promotions: promotions, settings: settings, users: users, logs: logs, analytics: analytics };
    }).catch(function (e) {
      console.warn('Supabase load failed', e);
      ready = null;
      return null;
    });
    return ready;
  }

  function saveProducts(list) {
    return api('products?select=id').then(function (existing) {
      var ids = (list || []).map(function (p) { return p.id; });
      var toDelete = (existing || []).filter(function (r) { return ids.indexOf(r.id) === -1; }).map(function (r) { return r.id; });
      var chain = Promise.resolve();
      if (toDelete.length) {
        chain = chain.then(function () {
          return api('products?id=in.(' + toDelete.map(encodeURIComponent).join(',') + ')', { method: 'DELETE' });
        });
      }
      if (list && list.length) {
        chain = chain.then(function () {
          return api('products', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
            body: list.map(toProductRow)
          });
        });
      }
      return chain;
    });
  }

  function saveCategories(list) {
    return api('categories?select=id').then(function (existing) {
      var ids = (list || []).map(function (c) { return c.id; });
      var toDelete = (existing || []).filter(function (r) { return ids.indexOf(r.id) === -1; }).map(function (r) { return r.id; });
      var chain = Promise.resolve();
      if (toDelete.length) {
        chain = chain.then(function () {
          return api('categories?id=in.(' + toDelete.map(encodeURIComponent).join(',') + ')', { method: 'DELETE' });
        });
      }
      if (list && list.length) {
        chain = chain.then(function () {
          return api('categories', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
            body: list.map(function (c) {
              return { id: c.id, name: c.name, description: c.description || '', image: c.image || '', updated_at: new Date().toISOString() };
            })
          });
        });
      }
      return chain;
    });
  }

  function savePromotions(list) {
    return api('promotions?select=id').then(function (existing) {
      var ids = (list || []).map(function (p) { return p.id; });
      var toDelete = (existing || []).filter(function (r) { return ids.indexOf(r.id) === -1; }).map(function (r) { return r.id; });
      var chain = Promise.resolve();
      if (toDelete.length) {
        chain = chain.then(function () {
          return api('promotions?id=in.(' + toDelete.map(encodeURIComponent).join(',') + ')', { method: 'DELETE' });
        });
      }
      if (list && list.length) {
        chain = chain.then(function () {
          return api('promotions', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
            body: list.map(toPromoRow)
          });
        });
      }
      return chain;
    });
  }

  function saveSettings(s) {
    return api('settings?id=eq.main', {
      method: 'PATCH',
      headers: { 'Prefer': 'return=minimal' },
      body: { data: s, updated_at: new Date().toISOString() }
    }).catch(function () {
      return api('settings', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: { id: 'main', data: s, updated_at: new Date().toISOString() }
      });
    });
  }

  function saveUsers(list) {
    return api('admin_users?select=id').then(function (existing) {
      var ids = (list || []).map(function (u) { return u.id; });
      var toDelete = (existing || []).filter(function (r) { return ids.indexOf(r.id) === -1; }).map(function (r) { return r.id; });
      var chain = Promise.resolve();
      if (toDelete.length) {
        chain = chain.then(function () {
          return api('admin_users?id=in.(' + toDelete.map(encodeURIComponent).join(',') + ')', { method: 'DELETE' });
        });
      }
      if (list && list.length) {
        chain = chain.then(function () {
          return api('admin_users', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates' },
            body: list.map(function (u) {
              return { id: u.id, name: u.name, username: u.username, password: u.password, role: u.role || 'admin' };
            })
          });
        });
      }
      return chain;
    });
  }

  function publishAll() {
    if (typeof ClynData === 'undefined') return Promise.reject(new Error('ClynData missing'));
    var status = document.getElementById('cloudStatus');
    return Promise.all([
      saveProducts(ClynData.getProducts()),
      saveCategories(ClynData.getCategories()),
      savePromotions(ClynData.getPromotions()),
      saveSettings(ClynData.getSettings()),
      saveUsers(ClynData.getUsers())
    ]).then(function () {
      if (status) { status.textContent = 'Live ✓ Saved to database'; status.style.color = '#00A651'; }
      return { ok: true };
    }).catch(function (e) {
      console.warn('Supabase publish failed', e);
      if (status) { status.textContent = 'Saved locally — DB issue'; status.style.color = '#b45309'; }
      return { ok: false, error: e };
    });
  }

  function hookSaves() {
    if (typeof ClynData === 'undefined') return;
    ['saveProducts', 'saveCategories', 'saveSettings', 'savePromotions', 'saveUsers'].forEach(function (fn) {
      if (typeof ClynData[fn] !== 'function' || ClynData[fn]._sbHooked) return;
      var orig = ClynData[fn].bind(ClynData);
      var wrapped = function (arg) {
        orig(arg);
        publishAll();
      };
      wrapped._sbHooked = true;
      ClynData[fn] = wrapped;
    });
  }

  window.ClynSupabase = { load: loadAll, publish: publishAll };
  window.ClynCloud = { load: loadAll, publish: publishAll, apply: function () { return loadAll(); } };

  loadAll().then(function () { hookSaves(); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(hookSaves, 400); });
  } else {
    setTimeout(hookSaves, 400);
  }
})();
