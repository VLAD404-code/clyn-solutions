(function(){
  function apply(){
    if(typeof ClynImages!=='undefined' && ClynImages.logo){
      document.querySelectorAll('#siteLogo,.logo-img,#adminLogo').forEach(function(el){
        if(el){ el.src=ClynImages.logo; el.style.display='block'; }
      });
      document.querySelectorAll('.logo-mark').forEach(function(el){ el.style.display='none'; });
    }
    var heroUrl = (typeof ClynImages!=='undefined' && ClynImages.heroParts) ? ClynImages.heroParts : 'images/hero-parts.jpg';
    document.querySelectorAll('.hero-bg').forEach(function(el){
      var img = new Image();
      img.onload = function(){ el.style.backgroundImage = "url('"+heroUrl+"')"; };
      img.onerror = function(){ /* keep CSS gradient fallback */ };
      img.src = heroUrl;
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
