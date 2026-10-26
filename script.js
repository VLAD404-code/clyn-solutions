document.addEventListener('DOMContentLoaded',()=>{
const grid=document.getElementById('productsGrid');
if(!grid||typeof ClynData==='undefined')return;
const products=ClynData.getProducts();
const cats={};ClynData.getCategories().forEach(c=>cats[c.id]=c.name);
grid.innerHTML=products.map(p=>`<div class="card"><h3>${p.name}</h3><p>${p.description||''}</p><p><strong>${p.price||'On request'}</strong> · ${cats[p.category]||p.category}</p><p><a href="https://wa.me/260965018323?text=${encodeURIComponent('Hello C-LYN, enquire about: '+p.name)}" target="_blank">Enquire on WhatsApp →</a></p></div>`).join('');
});
