(function(){
  var parts = window.__CLYN_ADMIN_PARTS || [];
  var code = parts.join('');
  try { (0, eval)(code); } catch (e) { console.error('Admin app failed', e); }
})();
