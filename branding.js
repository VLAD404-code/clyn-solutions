(function(){
  function apply(){
    if(typeof ClynImages==='undefined') return;
    if(ClynImages.logo){
      document.querySelectorAll('#siteLogo,.logo-img,#adminLogo').forEach(function(el){
        if(el){ el.src=ClynImages.logo; el.style.display='block'; }
      });
      document.querySelectorAll('.logo-mark').forEach(function(el){ el.style.display='none'; });
    }
    if(ClynImages.heroParts && ClynImages.heroParts.length>100){
      document.querySelectorAll('.hero-bg').forEach(function(el){
        el.style.backgroundImage="url('"+ClynImages.heroParts+"')";
      });
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
