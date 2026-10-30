(function(){
  window.ClynImages=window.ClynImages||{};
  ClynImages.heroParts='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDACweISchHCwnJCcyLyw1Qm9IQj09QohhZlBvoY2ppp6Nm5ixx//Ysbzxv5ib3v/g8f//////rNX/////////////2wBDAS8yMkI6QoJISIL/t5u3////////////////////////////////////////////////////////////////////wAARCADIAMgDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAECAwQF/8QANBAAAgIBAwMDAQUIAgMAAAAAAAECEQMSITEEQVETImFxIzKBkbEFFEKhwdHh8DNyJFKS/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAABFB/9oADAMBAAIRAxEAPwCsBgaQDAYCGAwEAxgIKGACAYwIgSACIDABCJABEBgBEBgBERIQEQGAEgAYAMBgIYDAQwGAgGAAAwAQDLMONSdydRuvqQRhhlNXaS4V9yEouMmns0b5qChbSajujFKTnJyfLAgAwKIgMAIiJCAQiQgIgMAGMBgAwAAGAwEMk0qTXjcRAhg2ly0gTUlaaa8oAAYAIux7RivLsqNkVFOvEUFQzSXpbdzKaOprVjgmlbJLpY95MDIBc1h1OOqba+B+njfDn+QRnAveFdp/mqIvBJcU/wAQKRE5QlHlNEQEIkIoiAwAYxDACSq93S7vwIdEDcXF01uBDNmlBRtLTe9LcnGSlFSi7TArz5JY4xcW6vdeSyLUoprhiyY1kg4sj03/ABae8W0wDNFSjvd/5JwgoRUUkkvBJqxgUZoLJJRTknvw+Ni2MdMUt3S7jS3bJJW0nsFuI0PXNdmaFFRb9lU6TfcWTLBbL3P4AyT+2l71wW45yx7KUq8N2IAialFy1VHU+XwTU0uYlAJtcOgrVGUJd6FNqMG+yM+vyvxJqdxae6ogeqMuGijIknaKN8WTRLddn8FmaLUdSvSyixR+yciotXvxNd0rRWEIAAoYwGADAZBGUVOLi+GVYYvDPQ7alumXjtJWABSV0VSm4ybvYi86Cr8dte7kk4tfJVizwupM0rfggrW/ADyQa90efHk5uXqcrm05aV4WxR0a82J0lvSRzvUnGTrI38pk3mk0ozerS7A1PPjXFv6KwWeG96o15iT6TqMb9laZfqbOeSDHFqUdUXa8jJZenlji5YFb50N/oVYuo0RUm08bdU+UUSDh2jTohkjqVb90Z8kdEqaFEM8NeLUl7o7oMfUY5YXjnFr5W43k0JumylQWmMorVqb7kF3TpOcUn3INU2vDovwYHFRm6i72SKG7bfltlCAAKhjAZAEcmaGFXKLk3wk6JlfURSxOUlYFPrLLP2wlXdN2aoW03DGpKuLpo58FFL1MjlV1GKfJ0Oizwy2lacez5Iqrq8UoQjk4i+V4M+KSpt1t+bOzkjHJilF8SVHJ6fpNS1Tk67JAaI4oZIbbPyhYskunyaJ/d8f1Rbjhoi4xfbZsr62NYoz/AIoso1zOV1uOMMupp099tjfhnq6ePxsZ+vj9lGXe6IMUVje3qNbXuuWSjcalKFr+TKYRTa+C/BkbjKGW1FXpXyBB3Wzp9vg1dH1+VyUZyU1Vu1TRlvaiWHEpepJLeKbX4oDt4ssM2NTg7izL1mJYsnrKtMvbNPi/JX+zsstVO6l7X4tcM2dTD1enyQ8xdAZuiyOGSWGb43j9DVlh6kGu/Y5UsjebpsqTTkqb8nXTtAc+yvV6Uo1xZbnWnNJfNlM96Cul6sfSTTW0bMaVJFUuUl3aReyoiAAVDQxIZA+2zp+UTydPrxe6cpXT3ogaMUlKGh8r9ArB1HTpY4O3UbTKcUJYnPLGxotO5B9X1Vum//kDo+ntSdvYi6i9MbcvC2/M50ur6qqTd/ER9P1WfHNKak4XutO5BulDRjcpypJcR2Rz5ZJSl7VFJ8Kjp5YepilDjUqOVJTxT0zi7i/wKjb02nLDvCS50tosccqT0zUv+y/qiro1KKetU5cX3NIHOy9RPHh9LSozT3kw6SeSTWzl3W9I25MUMn3lv5CEIwVRQVGEGpOc3cn44RIYghMAYACGJDAZHNBZIaXFSJCla9yfagKMeJYNSbt934QRdz1vaMP8AfxQZZJvVOaUedjNmzetWLFGoLhLuRUdT6nPTW3b4Ro16Yyi1dPt+hGMPRhoi05y2k/Hx8ElilJxS38v+4G/VWPUltXBVKajBShs2+H5LkqVGfJBaK87ooj1OnFpSySlJ8uyfTTc229v0M9Q/jtyNuLGscaXL5ZASncH7Wu25mUEo6dcUvoaM0XNKKurt0U5Xi6dqORuUnu0nVL5Ar0VL2tVxwSgn+8Qi6aW9jqMtOfHbxyVb9qJY4t51JLZXuUaCM9ldEhNWqYFEMsJS3vUuz7Fxmy43GalHlb/UuxzWSNr8V4AkIYghCGIBMAYFCJERkEiOi3ctxjArzYI5Y1silYfRVQXu8s1hs+QrFHZ0t5Pb/Bsw49EVaWoIxhF2kkydgMqlBRd3s2W2AGdKEpq0pRbr+xpKniTbd1e7ZYvqBHNeil35ZW+mx59E8yeuKrbuvkvsVgVYpSjNY1iUIRTrd/6y4VoLAAFYWERyJuNLkrhjcZ6nt5+S2xWgAQ7EAhDEAgACgGRGBIBDICkGhDAA0IaigGAUhaExjAj6cfA9KGAC0oXpxJABH04+B6UMAFSCkAAKkKkMQCpBQAAhDEAgAChDAAGMAIGMAABgAAMAAAAAAAAAAAAQAACEAAAgABCAChAAAf/Z';
  function apply(){
    if(ClynImages.logo){
      document.querySelectorAll('#siteLogo,.logo-img,#adminLogo').forEach(function(el){
        if(el){ el.src=ClynImages.logo; el.style.display='block'; }
      });
      document.querySelectorAll('.logo-mark').forEach(function(el){ el.style.display='none'; });
    }
    if(ClynImages.heroParts){
      document.querySelectorAll('.hero-bg').forEach(function(el){
        el.style.backgroundImage="url('"+ClynImages.heroParts+"')";
      });
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
