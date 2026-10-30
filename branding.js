(function(){
  function apply(){
    if(typeof ClynImages==='undefined'||!ClynImages.logo) return;
    document.querySelectorAll('#siteLogo,.logo-img,#adminLogo').forEach(function(el){
      if(el){ el.src=ClynImages.logo; el.style.display='block'; }
    });
    document.querySelectorAll('.logo-mark').forEach(function(el){ el.style.display='none'; });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
