/* Wire end date + duration on promo form */
(function () {
  function $(id) { return document.getElementById(id); }
  function patch() {
    if (typeof savePromo !== 'function' && typeof window.savePromo !== 'function') {
      /* hook after admin-app by rebinding buttons */
    }
    var saveBtn = $('savePromo');
    if (!saveBtn) return;
    var orig = saveBtn.onclick;
    saveBtn.onclick = function () {
      if (typeof ClynData === 'undefined') return;
      var title = ($('prTitle') && $('prTitle').value.trim()) || '';
      if (!title) { alert('Title required'); return; }
      var pct = parseInt(($('prPercent') && $('prPercent').value) || '0', 10) || 0;
      var id = ($('editPromoId') && $('editPromoId').value) || ('pr' + Date.now());
      var list = ClynData.getPromotions();
      var item = {
        id: id,
        title: title,
        message: ($('prMessage') && $('prMessage').value.trim()) || '',
        percent: pct,
        category: ($('prCategory') && $('prCategory').value) || '',
        image: (typeof promoImageData !== 'undefined' && promoImageData) || (list.find(function (x) { return x.id === id; }) || {}).image || '',
        endDate: ($('prEndDate') && $('prEndDate').value) || '',
        duration: ($('prDuration') && $('prDuration').value.trim()) || '',
        active: $('prActive') ? $('prActive').checked : true
      };
      var idx = list.findIndex(function (x) { return x.id === id; });
      if (idx >= 0) list[idx] = item; else list.unshift(item);
      ClynData.savePromotions(list);
      if (ClynData.addLog) ClynData.addLog({ user: 'Admin', action: 'save_promo', detail: title + ' ' + pct + '%' });
      location.reload();
    };
    /* Prefill end date when editing */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-editpromo]');
      if (!btn) return;
      setTimeout(function () {
        try {
          var list = ClynData.getPromotions();
          var p = list.find(function (x) { return x.id === btn.dataset.editpromo; });
          if (!p) return;
          if ($('prEndDate')) $('prEndDate').value = p.endDate || '';
          if ($('prDuration')) $('prDuration').value = p.duration || '';
        } catch (err) {}
      }, 100);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(patch, 100); });
  else setTimeout(patch, 100);
})();
