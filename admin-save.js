/* Page-level Save buttons */
(function () {
  function $(id) { return document.getElementById(id); }
  function flash(id) {
    var el = $(id);
    if (!el) return;
    el.textContent = 'Saved \u2713';
    el.style.color = '#00A651';
    setTimeout(function () { el.textContent = ''; }, 2500);
  }
  function bind() {
    if (typeof ClynData === 'undefined') return;
    if ($('saveProductsBtn')) $('saveProductsBtn').onclick = function () {
      try { ClynData.saveProducts(ClynData.getProducts()); if (ClynData.addLog) ClynData.addLog({ user: 'Admin', action: 'save_products', detail: 'Confirmed' }); } catch (e) {}
      flash('saveMsgProducts');
    };
    if ($('saveCatsBtn')) $('saveCatsBtn').onclick = function () {
      try { ClynData.saveCategories(ClynData.getCategories()); if (ClynData.addLog) ClynData.addLog({ user: 'Admin', action: 'save_categories', detail: 'Confirmed' }); } catch (e) {}
      flash('saveMsgCats');
    };
    if ($('savePromosBtn')) $('savePromosBtn').onclick = function () {
      try { ClynData.savePromotions(ClynData.getPromotions()); if (ClynData.addLog) ClynData.addLog({ user: 'Admin', action: 'save_promotions', detail: 'Confirmed' }); } catch (e) {}
      flash('saveMsgPromos');
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(bind, 50); });
  else setTimeout(bind, 50);
})();
