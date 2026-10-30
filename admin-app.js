(function(){
const AUTH='clyn_admin_session';
let products=[],categories=[],promotions=[],users=[],settings={};
let imageData='',catImageData='',heroImageData='',promoImageData='',currentUser=null;
const $=id=>document.getElementById(id);
const show=(el,on)=>el&&el.classList.toggle('hidden',!on);
const who=()=>(currentUser&&(currentUser.name||currentUser.username))||'Admin';
const log=(a,d)=>ClynData.addLog({user:who(),action:a,detail:d||''});
function load(){products=ClynData.getProducts();categories=ClynData.getCategories();promotions=ClynData.getPromotions();users=ClynData.getUsers();settings=ClynData.getSettings();heroImageData=settings.heroImage||'';}
function persistProducts(){ClynData.saveProducts(products);}
function persistCats(){ClynData.saveCategories(categories);}
function persistPromos(){ClynData.savePromotions(promotions);}
function persistUsers(){ClynData.saveUsers(users);}
function persistSettings(){ClynData.saveSettings(settings);}
function catName(id){const c=categories.find(x=>x.id===id);return c?c.name:id;}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[m]));}
function fmtDate(iso){try{return new Date(iso).toLocaleString();}catch(e){return iso;}}
function renderStats(){
  if($('statProducts'))$('statProducts').textContent=products.length;
  if($('statCats'))$('statCats').textContent=categories.length;
  if($('statFeatured'))$('statFeatured').textContent=products.filter(p=>p.featured).length;
  if($('statPromos'))$('statPromos').textContent=promotions.filter(p=>p.active).length;
  const a=ClynData.getAnalytics();if($('statViews'))$('statViews').textContent=a.totalViews||0;
}
function renderProducts(){
  if(!$('productRows'))return;
  $('productRows').innerHTML=products.map(p=>{
    const img=p.image?`<img class="thumb" src="${p.image}" alt="">`:'—';
    return `<tr><td>${img}</td><td><strong>${esc(p.name)}</strong></td><td>${esc(catName(p.category))}</td><td>${esc(p.price||'On request')}</td><td>${p.featured?'<span class="badge">Yes</span>':'—'}</td><td class="actions-cell"><button class="btn btn-ghost btn-sm" data-edit="${p.id}">Edit</button><button class="btn btn-danger btn-sm" data-del="${p.id}">Delete</button></td></tr>`;
  }).join('')||'<tr><td colspan="6" style="text-align:center;color:#6B7280;padding:24px">No products yet.</td></tr>';
}
function renderCats(){
  if(!$('catRows'))return;
  $('catRows').innerHTML=categories.map(c=>{
    const img=c.image?`<img class="thumb" src="${c.image}" alt="">`:'—';
    return `<tr><td>${img}</td><td><strong>${esc(c.name)}</strong></td><td><code>${esc(c.id)}</code></td><td class="actions-cell"><button class="btn btn-ghost btn-sm" data-editcat="${c.id}">Edit</button><button class="btn btn-danger btn-sm" data-delcat="${c.id}">Delete</button></td></tr>`;
  }).join('')||'<tr><td colspan="4" style="text-align:center;color:#6B7280;padding:24px">No categories yet.</td></tr>';
}
function renderPromos(){
  const el=$('promoRows');if(!el)return;
  if($('promoMasterToggle'))$('promoMasterToggle').checked=settings.promoEnabled!==false;
  el.innerHTML=promotions.map(p=>{
    const pct=p.percent?('<span class="badge-off">'+p.percent+'% OFF</span> '):'';
    const cat=p.category?esc(catName(p.category)):'General';
    const img=p.image?'<img class="thumb" src="'+p.image+'" alt="">':'—';
    return `<tr><td>${img}</td><td><strong>${esc(p.title)}</strong> ${pct}<br><small style="color:#6B7280">${esc(p.message||'')} · ${cat}</small></td><td>${p.active?'<span class="badge">Active</span>':'Off'}</td><td class="actions-cell"><button class="btn btn-ghost btn-sm" data-editpromo="${p.id}">Edit</button><button class="btn btn-danger btn-sm" data-delpromo="${p.id}">Delete</button></td></tr>`;
  }).join('')||'<tr><td colspan="4" style="text-align:center;color:#6B7280;padding:24px">No promotions yet.</td></tr>';
}
function renderUsers(){
  const el=$('userRows');if(!el)return;
  el.innerHTML=users.map(u=>`<tr><td><strong>${esc(u.name)}</strong></td><td>${esc(u.username)}</td><td>${esc(u.role||'admin')}</td><td class="actions-cell"><button class="btn btn-ghost btn-sm" data-edituser="${u.id}">Edit</button><button class="btn btn-danger btn-sm" data-deluser="${u.id}" ${users.length<=1?'disabled':''}>Delete</button></td></tr>`).join('');
}
function renderLogs(){
  const logs=ClynData.getLogs();
  if($('logRows'))$('logRows').innerHTML=logs.map(l=>`<tr><td style="font-size:.8rem;white-space:nowrap">${esc(fmtDate(l.at))}</td><td>${esc(l.user)}</td><td><span class="badge">${esc(l.action)}</span></td><td>${esc(l.detail)}</td></tr>`).join('')||'<tr><td colspan="4" style="text-align:center;color:#6B7280;padding:16px">No admin activity yet.</td></tr>';
  const a=ClynData.getAnalytics();
  if($('analyticsTotal'))$('analyticsTotal').textContent=a.totalViews||0;
  if($('analyticsPages'))$('analyticsPages').textContent=Object.keys(a.pages||{}).length;
  if($('analyticsPageRows')){
    const pages=Object.entries(a.pages||{}).sort((x,y)=>y[1]-x[1]);
    $('analyticsPageRows').innerHTML=pages.map(([p,n])=>`<tr><td>${esc(p)}</td><td>${n}</td></tr>`).join('')||'<tr><td colspan="2" style="text-align:center;color:#6B7280;padding:16px">No views yet.</td></tr>';
  }
  if($('visitRows'))$('visitRows').innerHTML=(a.visits||[]).slice(0,30).map(v=>`<tr><td style="font-size:.8rem">${esc(fmtDate(v.at))}</td><td>${esc(v.path)}</td><td style="font-size:.8rem;color:#6B7280">${esc(v.ref||'—')}</td></tr>`).join('')||'<tr><td colspan="3" style="text-align:center;color:#6B7280;padding:16px">No visits yet.</td></tr>';
}
function fillSettingsForm(){
  if(!$('sPhone'))return;
  $('sPhone').value=settings.phone||'';$('sWhatsapp').value=settings.whatsapp||'';
  $('sEmail').value=settings.email||'';$('sAddress').value=settings.address||'';
  $('sLocation').value=settings.location||'';$('sHours').value=settings.hours||'';
  $('sAbout').value=settings.about||'';$('sTagline').value=settings.tagline||'';
  const prev=$('heroPreview');
  if(prev){prev.src=settings.heroImage||'images/hero-parts.jpg';prev.style.display='block';prev.classList.add('show');}
  heroImageData=settings.heroImage||'';
}
function fillCatSelect(sel){
  if(!$('pCategory'))return;
  $('pCategory').innerHTML=categories.map(c=>`<option value="${esc(c.id)}" ${c.id===sel?'selected':''}>${esc(c.name)}</option>`).join('')||'<option value="">None</option>';
}
function resizeImage(file,maxW,cb){
  const r=new FileReader();
  r.onload=e=>{const img=new Image();img.onload=()=>{const s=Math.min(1,maxW/img.width);const c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',0.72));};img.src=e.target.result;};
  r.readAsDataURL(file);
}
function openProduct(p){
  $('productModalTitle').textContent=p?'Edit product':'Add product';
  $('editProductId').value=p?p.id:'';$('pName').value=p?p.name:'';$('pPrice').value=p?(p.price||''):'';
  $('pPart').value=p?(p.partNumber||''):'';$('pDesc').value=p?(p.description||''):'';$('pFeatured').checked=p?!!p.featured:false;
  imageData=p&&p.image?p.image:'';const prev=$('pPreview');
  if(imageData){prev.src=imageData;prev.classList.add('show');}else{prev.removeAttribute('src');prev.classList.remove('show');}
  fillCatSelect(p?p.category:(categories[0]&&categories[0].id));show($('productModal'),true);
}
function closeProduct(){show($('productModal'),false);}
function saveProduct(){
  const name=$('pName').value.trim();if(!name){alert('Name required');return;}
  const id=$('editProductId').value||('p'+Date.now());
  const item={id,name,category:$('pCategory').value,price:$('pPrice').value.trim(),partNumber:$('pPart').value.trim(),description:$('pDesc').value.trim(),featured:$('pFeatured').checked,image:imageData||''};
  const idx=products.findIndex(x=>x.id===id);
  if(idx>=0){products[idx]=item;log('edit_product',name);}else{products.unshift(item);log('add_product',name);}
  persistProducts();renderAll();closeProduct();
}
function openCategory(c){
  $('categoryModalTitle').textContent=c?'Edit category':'Add category';
  $('editCatId').value=c?c.id:'';$('cName').value=c?c.name:'';
  catImageData=c&&c.image?c.image:'';const prev=$('cPreview');
  if(catImageData){prev.src=catImageData;prev.classList.add('show');}else{prev.removeAttribute('src');prev.classList.remove('show');}
  show($('categoryModal'),true);
}
function closeCategory(){show($('categoryModal'),false);}
function saveCategory(){
  const name=$('cName').value.trim();if(!name){alert('Name required');return;}
  const id=$('editCatId').value||name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const item={id,name,image:catImageData||'',description:'',icon:''};
  const idx=categories.findIndex(x=>x.id===id);
  if(idx>=0){categories[idx]={...categories[idx],...item};log('edit_category',name);}else{categories.push(item);log('add_category',name);}
  persistCats();renderAll();closeCategory();
}
function openPromo(p){
  $('promoModalTitle').textContent=p?'Edit promotion':'Add promotion';
  $('editPromoId').value=p?p.id:'';
  $('prTitle').value=p?p.title:'';
  $('prMessage').value=p?(p.message||''):'';
  if($('prPercent'))$('prPercent').value=p&&p.percent!=null?p.percent:'';
  promoImageData=p&&p.image?p.image:'';
  var prev=$('prPreview');
  if(prev){if(promoImageData){prev.src=promoImageData;prev.classList.add('show');}else{prev.removeAttribute('src');prev.classList.remove('show');}}
  if($('prCategory')){
    $('prCategory').innerHTML='<option value="">All / general</option>'+categories.map(function(c){return '<option value="'+esc(c.id)+'"'+(p&&p.category===c.id?' selected':'')+'>'+esc(c.name)+'</option>';}).join('');
  }
  $('prActive').checked=p?!!p.active:true;
  show($('promoModal'),true);
}
function closePromo(){show($('promoModal'),false);}
function savePromo(){
  const title=$('prTitle').value.trim();if(!title){alert('Title required');return;}
  const pct=parseInt(($('prPercent')&&$('prPercent').value)||'0',10)||0;
  const id=$('editPromoId').value||('pr'+Date.now());
  const item={id,title,message:$('prMessage').value.trim(),percent:pct,category:($('prCategory')&&$('prCategory').value)||'',image:promoImageData||'',active:$('prActive').checked};
  const idx=promotions.findIndex(x=>x.id===id);
  if(idx>=0){promotions[idx]=item;log('edit_promo',title+' '+pct+'%');}else{promotions.unshift(item);log('add_promo',title+' '+pct+'%');}
  persistPromos();renderAll();closePromo();
}
function openUser(u){
  $('userModalTitle').textContent=u?'Edit user':'Add user';
  $('editUserId').value=u?u.id:'';$('uName').value=u?u.name:'';$('uUsername').value=u?u.username:'';$('uPassword').value='';$('uRole').value=u?(u.role||'admin'):'admin';
  show($('userModal'),true);
}
function closeUser(){show($('userModal'),false);}
function saveUser(){
  const name=$('uName').value.trim(),username=$('uUsername').value.trim().toLowerCase(),password=$('uPassword').value;
  if(!name||!username){alert('Name and username required');return;}
  const id=$('editUserId').value||('u'+Date.now());
  const existing=users.find(x=>x.id===id);
  if(!existing&&!password){alert('Password required for new users');return;}
  if(users.some(x=>x.username===username&&x.id!==id)){alert('Username taken');return;}
  const item={id,name,username,password:password||(existing&&existing.password)||'',role:$('uRole').value||'admin'};
  const idx=users.findIndex(x=>x.id===id);
  if(idx>=0){users[idx]=item;log('edit_user',username);}else{users.push(item);log('add_user',username);}
  persistUsers();renderAll();closeUser();
}
function renderAll(){renderStats();renderProducts();renderCats();renderPromos();renderUsers();fillSettingsForm();renderLogs();}
function tryLogin(){
  const username=($('loginUser')&&$('loginUser').value.trim())||'admin';
  const user=ClynData.checkLogin(username,$('pwd').value);
  if(user){currentUser=user;sessionStorage.setItem(AUTH,JSON.stringify({id:user.id,name:user.name}));log('login',user.name||user.username);enterApp();}
  else{$('loginErr').textContent='Incorrect username or password.';$('pwd').focus();}
}
function enterApp(){
  show($('loginScreen'),false);show($('app'),true);
  try{const s=JSON.parse(sessionStorage.getItem(AUTH)||'{}');if($('loggedInAs')&&s.name)$('loggedInAs').textContent='Signed in as '+s.name;}catch(e){}
  load();renderAll();
}
$('loginBtn').onclick=tryLogin;
$('pwd').onkeydown=e=>{if(e.key==='Enter')tryLogin();};
if($('loginUser'))$('loginUser').onkeydown=e=>{if(e.key==='Enter')tryLogin();};
$('logoutBtn').onclick=()=>{log('logout',who());sessionStorage.removeItem(AUTH);location.reload();};
document.querySelectorAll('.tab').forEach(t=>{
  t.onclick=()=>{
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');
    ['products','categories','promotions','settings','users','logs','backup'].forEach(id=>show($('tab-'+id),t.dataset.tab===id));
    if(t.dataset.tab==='logs')renderLogs();
  };
});
$('addProductBtn').onclick=()=>openProduct(null);
$('cancelProduct').onclick=closeProduct;$('saveProduct').onclick=saveProduct;
$('pImage').onchange=e=>{const f=e.target.files[0];if(!f)return;resizeImage(f,800,d=>{imageData=d;const p=$('pPreview');p.src=d;p.classList.add('show');});};
$('productRows').onclick=e=>{
  const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-del]');
  if(edit){const p=products.find(x=>x.id===edit.dataset.edit);if(p)openProduct(p);}
  if(del&&confirm('Delete product?')){const p=products.find(x=>x.id===del.dataset.del);products=products.filter(x=>x.id!==del.dataset.del);log('delete_product',p?p.name:'');persistProducts();renderAll();}
};
$('productModal').onclick=e=>{if(e.target===$('productModal'))closeProduct();};
$('addCatBtn').onclick=()=>openCategory(null);
$('cancelCategory').onclick=closeCategory;$('saveCategory').onclick=saveCategory;
$('cImage').onchange=e=>{const f=e.target.files[0];if(!f)return;resizeImage(f,900,d=>{catImageData=d;const p=$('cPreview');p.src=d;p.classList.add('show');});};
$('catRows').onclick=e=>{
  const edit=e.target.closest('[data-editcat]'),del=e.target.closest('[data-delcat]');
  if(edit){const c=categories.find(x=>x.id===edit.dataset.editcat);if(c)openCategory(c);}
  if(del&&confirm('Delete category?')){const c=categories.find(x=>x.id===del.dataset.delcat);categories=categories.filter(x=>x.id!==del.dataset.delcat);log('delete_category',c?c.name:'');persistCats();renderAll();}
};
$('categoryModal').onclick=e=>{if(e.target===$('categoryModal'))closeCategory();};
if($('prImage'))$('prImage').onchange=e=>{const f=e.target.files[0];if(!f)return;resizeImage(f,900,d=>{promoImageData=d;const p=$('prPreview');if(p){p.src=d;p.classList.add('show');}});};
if($('addPromoBtn')){
  $('addPromoBtn').onclick=()=>openPromo(null);$('cancelPromo').onclick=closePromo;$('savePromo').onclick=savePromo;
  $('promoModal').onclick=e=>{if(e.target===$('promoModal'))closePromo();};
  $('promoRows').onclick=e=>{
    const edit=e.target.closest('[data-editpromo]'),del=e.target.closest('[data-delpromo]');
    if(edit){const p=promotions.find(x=>x.id===edit.dataset.editpromo);if(p)openPromo(p);}
    if(del&&confirm('Delete promotion?')){const p=promotions.find(x=>x.id===del.dataset.delpromo);promotions=promotions.filter(x=>x.id!==del.dataset.delpromo);log('delete_promo',p?p.title:'');persistPromos();renderAll();}
  };
}
if($('promoMasterToggle'))$('promoMasterToggle').onchange=()=>{settings.promoEnabled=$('promoMasterToggle').checked;persistSettings();log(settings.promoEnabled?'promo_on':'promo_off','Master toggle');renderPromos();};
if($('addUserBtn')){
  $('addUserBtn').onclick=()=>openUser(null);$('cancelUser').onclick=closeUser;$('saveUser').onclick=saveUser;
  $('userModal').onclick=e=>{if(e.target===$('userModal'))closeUser();};
  $('userRows').onclick=e=>{
    const edit=e.target.closest('[data-edituser]'),del=e.target.closest('[data-deluser]');
    if(edit){const u=users.find(x=>x.id===edit.dataset.edituser);if(u)openUser(u);}
    if(del){if(users.length<=1){alert('Keep at least one user');return;}if(confirm('Delete user?')){const u=users.find(x=>x.id===del.dataset.deluser);users=users.filter(x=>x.id!==del.dataset.deluser);log('delete_user',u?u.username:'');persistUsers();renderAll();}}
  };
}
if($('heroImageInput'))$('heroImageInput').onchange=e=>{const f=e.target.files[0];if(!f)return;resizeImage(f,1400,d=>{heroImageData=d;const p=$('heroPreview');if(p){p.src=d;p.style.display='block';p.classList.add('show');}});};
if($('clearHeroBtn'))$('clearHeroBtn').onclick=()=>{heroImageData='';const p=$('heroPreview');if(p){p.src='images/hero-parts.jpg';p.style.display='block';}};
if($('saveSettingsBtn'))$('saveSettingsBtn').onclick=()=>{
  settings={...settings,phone:$('sPhone').value.trim(),whatsapp:$('sWhatsapp').value.trim().replace(/\D/g,''),email:$('sEmail').value.trim(),address:$('sAddress').value.trim(),location:$('sLocation').value.trim(),hours:$('sHours').value.trim(),about:$('sAbout').value.trim(),tagline:$('sTagline').value.trim(),heroImage:heroImageData||''};
  persistSettings();log('save_settings',settings.heroImage?'with hero':'contact');
  $('settingsMsg').textContent='Saved. Refresh the website to see changes.';setTimeout(()=>{$('settingsMsg').textContent='';},4000);
};
if($('clearLogsBtn'))$('clearLogsBtn').onclick=()=>{if(confirm('Clear audit log?')){ClynData.clearLogs();renderLogs();}};
if($('clearAnalyticsBtn'))$('clearAnalyticsBtn').onclick=()=>{if(confirm('Reset analytics?')){ClynData.clearAnalytics();renderLogs();renderStats();}};
if($('saveProductsBtn'))$('saveProductsBtn').onclick=()=>{persistProducts();log('save_products','Confirmed');const el=$('saveMsgProducts');if(el){el.textContent='Saved \u2713';el.style.color='#00A651';setTimeout(()=>el.textContent='',2500);}};
if($('saveCatsBtn'))$('saveCatsBtn').onclick=()=>{persistCats();log('save_categories','Confirmed');const el=$('saveMsgCats');if(el){el.textContent='Saved \u2713';el.style.color='#00A651';setTimeout(()=>el.textContent='',2500);}};
if($('savePromosBtn'))$('savePromosBtn').onclick=()=>{persistPromos();persistSettings();log('save_promotions','Confirmed');const el=$('saveMsgPromos');if(el){el.textContent='Saved \u2713';el.style.color='#00A651';setTimeout(()=>el.textContent='',2500);}};
$('exportBtn').onclick=()=>{const data=ClynData.exportAll();const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='clyn-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();log('export_backup','JSON');};
$('importFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{ClynData.importAll(JSON.parse(ev.target.result));load();renderAll();log('import_backup',file.name);alert('Imported.');}catch(err){alert('Invalid file.');}};r.readAsText(file);e.target.value='';};
$('resetBtn').onclick=()=>{if(confirm('Reset products, categories, settings, promotions?')){ClynData.resetAll();log('reset_data','defaults');load();renderAll();}};
try{const sess=sessionStorage.getItem(AUTH);if(sess){const s=JSON.parse(sess);currentUser=ClynData.getUsers().find(u=>u.id===s.id)||s;enterApp();}}catch(e){}
})();
