/** Replace browser confirm/alert with in-app modals for admin */
(function () {
  function clynConfirm(message) {
    return new Promise(function (resolve) {
      var bg = document.createElement('div');
      bg.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px';
      bg.innerHTML = '<div style="max-width:360px;width:100%;background:#1a1a2e;color:#fff;border-radius:14px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,.4)">' +
        '<p style="margin:0 0 20px;font-size:1rem;line-height:1.5">' + message + '</p>' +
        '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button type="button" id="clynConfirmNo" style="min-width:90px;padding:10px 16px;border-radius:8px;border:1px solid #374151;background:#111827;color:#e5e7eb;cursor:pointer;font:inherit">Cancel</button>' +
        '<button type="button" id="clynConfirmYes" style="min-width:90px;padding:10px 16px;border-radius:8px;border:none;background:#dc2626;color:#fff;cursor:pointer;font:inherit;font-weight:600">Delete</button>' +
        '</div></div>';
      document.body.appendChild(bg);
      function done(v) { bg.remove(); resolve(v); }
      bg.querySelector('#clynConfirmNo').onclick = function () { done(false); };
      bg.querySelector('#clynConfirmYes').onclick = function () { done(true); };
      bg.onclick = function (e) { if (e.target === bg) done(false); };
    });
  }

  // Override native confirm so existing admin-app code uses our modal
  window.confirm = function (msg) {
    // Synchronous confirm cannot show async modal; return true and let us intercept clicks instead
    // We intercept delete buttons below instead.
    return true;
  };

  // Safer: intercept Delete button clicks before admin-app handles them
  function interceptDeletes() {
    function wrap(tableId, attr, label, onYes) {
      var el = document.getElementById(tableId);
      if (!el || el._clynWrapped) return;
      el._clynWrapped = true;
      el.addEventListener('click', function (e) {
        var btn = e.target.closest('[' + attr + ']');
        if (!btn) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        clynConfirm(label).then(function (ok) {
          if (!ok) return;
          // Re-dispatch a synthetic click that confirm will allow (we return true)
          // Better: click the button after temporarily allowing
          btn.click();
        });
      }, true);
    }
    // Actually stopImmediatePropagation prevents the original handler - need different approach
  }

  // Best approach: replace window.confirm with a flag-based sync hack is impossible.
  // Patch by rebinding productRows after admin loads.
  function patch() {
    var productRows = document.getElementById('productRows');
    var catRows = document.getElementById('catRows');
    var promoRows = document.getElementById('promoRows');
    var userRows = document.getElementById('userRows');

    function softConfirm(msg, fn) {
      clynConfirm(msg).then(function (ok) { if (ok) fn(); });
    }

    // Override confirm only for the short window of a programmed delete is hard.
    // Use MutationObserver free approach: replace confirm with one that sets a pending promise
    // and blocks... can't block sync.

    // Final approach: monkey-patch confirm to always return true, and intercept with capture phase
    // that stops the original and runs our flow by cloning the delete action from the button dataset.

    if (productRows && !productRows._clynPatch) {
      productRows._clynPatch = true;
      productRows.addEventListener('click', function (e) {
        var del = e.target.closest('[data-del]');
        if (!del) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        var id = del.getAttribute('data-del');
        softConfirm('Delete this product?', function () {
          // Trigger original by temporarily removing our listener is messy.
          // Dispatch custom event admin can listen - or call ClynData directly
          if (typeof ClynData === 'undefined') return;
          var list = ClynData.getProducts().filter(function (p) { return p.id !== id; });
          ClynData.saveProducts(list);
          ClynData.addLog({ user: 'Admin', action: 'delete_product', detail: id });
          // reload page section
          location.hash = '#products';
          location.reload();
        });
      }, true);
    }

    if (catRows && !catRows._clynPatch) {
      catRows._clynPatch = true;
      catRows.addEventListener('click', function (e) {
        var del = e.target.closest('[data-delcat]');
        if (!del) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        var id = del.getAttribute('data-delcat');
        softConfirm('Delete this category?', function () {
          if (typeof ClynData === 'undefined') return;
          var list = ClynData.getCategories().filter(function (c) { return c.id !== id; });
          ClynData.saveCategories(list);
          ClynData.addLog({ user: 'Admin', action: 'delete_category', detail: id });
          location.reload();
        });
      }, true);
    }

    if (promoRows && !promoRows._clynPatch) {
      promoRows._clynPatch = true;
      promoRows.addEventListener('click', function (e) {
        var del = e.target.closest('[data-delpromo]');
        if (!del) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        var id = del.getAttribute('data-delpromo');
        softConfirm('Delete this promotion?', function () {
          if (typeof ClynData === 'undefined') return;
          var list = ClynData.getPromotions().filter(function (p) { return p.id !== id; });
          ClynData.savePromotions(list);
          ClynData.addLog({ user: 'Admin', action: 'delete_promo', detail: id });
          location.reload();
        });
      }, true);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(patch, 500); });
  } else {
    setTimeout(patch, 500);
  }
  // Re-patch after tab switches / re-renders
  setInterval(patch, 2000);
})();
