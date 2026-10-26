(function(){
  const AUTH='clyn_admin_session';
  let products=[], categories=[], imageData='';
  const $=id=>document.getElementById(id);
  const show=(el,on)=>el.classList.toggle('hidden',!on);

  function load(){ products=ClynData.getProducts(); categories=ClynData.getCategories(); }
  function persist(){ ClynData.saveProducts(products); ClynData.saveCategories(categories); }
  function catName(id){ const c=categories.find(x=>x.id===id); return c?c.name:id; }
  function esc(s){ return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  function renderStats(){
    $('statProducts').textContent=products.length;
    $('statCats').textContent=categories.length;
    $('statFeatured').textContent=products.filter(p=>p.featured).length;
  }

  function renderProducts(){
    $('productRows').innerHTML=products.map(p=>{
      const img=p.image?`<img class="thumb" src="${p.image}" alt="">`:'<span style="color:#ccc">—</span>';
      return `<tr>
        <td>${img}</td>
        <td><strong>${esc(p.name)}</strong></td>
        <td>${esc(catName(p.category))}</td>
        <td>${esc(p.price||'On request')}</td>
        <td>${p.featured?'<span class="badge">Yes</span>':'—'}</td>
        <td class="actions-cell">
          <button class="btn btn-ghost btn-sm" data-edit="${p.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-del="${p.id}">Delete</button>
        </td>
      </tr>`;
    }).join('')||'<tr><td colspan="6" style="text-align:center;color:#6B7280;padding:32px">No products yet. Click “Add product”.</td></tr>';
  }

  function renderCats(){
    $('catRows').innerHTML=categories.map(c=>`<tr>
      <td><strong>${esc(c.name)}</strong></td>
      <td><code style="font-size:.8rem;color:#6B7280">${esc(c.id)}</code></td>
      <td><button class="btn btn-danger btn-sm" data-delcat="${c.id}">Delete</button></td>
    </tr>`).join('');
  }

  function fillCatSelect(selected){
    $('pCat').innerHTML=categories.map(c=>`<option value="${c.id}" ${c.id===selected?'selected':''}>${esc(c.name)}</option>`).join('');
  }

  function openProduct(p){
    $('productModalTitle').textContent=p?'Edit product':'Add product';
    $('editId').value=p?p.id:'';
    $('pName').value=p?p.name:'';
    $('pDesc').value=p?p.description||'':'';
    $('pPrice').value=p?p.price||'On request':'On request';
    $('pPart').value=p?p.partNumber||'':'';
    $('pFeat').checked=p?!!p.featured:false;
    imageData=p&&p.image?p.image:'';
    $('pImageData').value=imageData;
    $('pImage').value='';
    const prev=$('pPreview');
    if(imageData){ prev.src=imageData; prev.classList.add('show'); $('removeImageBtn').style.display='inline-flex'; }
    else{ prev.classList.remove('show'); prev.removeAttribute('src'); $('removeImageBtn').style.display='none'; }
    fillCatSelect(p?p.category:(categories[0]&&categories[0].id));
    show($('productModal'),true);
    $('pName').focus();
  }

  function closeProduct(){ show($('productModal'),false); }

  function resizeImage(file,maxW,cb){
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width,h=img.height;
        if(w>maxW){ h=Math.round(h*maxW/w); w=maxW; }
        const canvas=document.createElement('canvas');
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        cb(canvas.toDataURL('image/jpeg',0.82));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function saveProduct(){
    const name=$('pName').value.trim();
    if(!name){ alert('Product name is required'); return; }
    const id=$('editId').value||('p'+Date.now());
    const item={
      id, name,
      category:$('pCat').value,
      description:$('pDesc').value.trim(),
      price:$('pPrice').value.trim()||'On request',
      partNumber:$('pPart').value.trim(),
      featured:$('pFeat').checked,
      image:$('pImageData').value||''
    };
    const idx=products.findIndex(x=>x.id===id);
    if(idx>=0) products[idx]=item; else products.unshift(item);
    persist(); renderAll(); closeProduct();
  }

  function renderAll(){ renderStats(); renderProducts(); renderCats(); }

  function tryLogin(){
    if($('pwd').value===ClynData.ADMIN_PASSWORD){
      sessionStorage.setItem(AUTH,'1');
      enterApp();
    } else {
      $('loginErr').textContent='Incorrect password. Please try again.';
      $('pwd').focus();
    }
  }

  function enterApp(){
    show($('loginScreen'),false);
    show($('app'),true);
    load(); renderAll();
  }

  $('loginBtn').onclick=tryLogin;
  $('pwd').onkeydown=e=>{ if(e.key==='Enter') tryLogin(); };
  $('logoutBtn').onclick=()=>{ sessionStorage.removeItem(AUTH); location.reload(); };

  document.querySelectorAll('.tab').forEach(t=>{
    t.onclick=()=>{
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      ['products','categories','backup'].forEach(id=>show($('tab-'+id), t.dataset.tab===id));
    };
  });

  $('addProductBtn').onclick=()=>openProduct(null);
  $('cancelProduct').onclick=closeProduct;
  $('saveProduct').onclick=saveProduct;
  $('productModal').onclick=e=>{ if(e.target===$('productModal')) closeProduct(); };

  $('pImage').onchange=e=>{
    const file=e.target.files[0];
    if(!file) return;
    resizeImage(file,600,data=>{
      imageData=data; $('pImageData').value=data;
      const prev=$('pPreview'); prev.src=data; prev.classList.add('show');
      $('removeImageBtn').style.display='inline-flex';
    });
  };
  $('removeImageBtn').onclick=()=>{
    imageData=''; $('pImageData').value=''; $('pImage').value='';
    $('pPreview').classList.remove('show'); $('removeImageBtn').style.display='none';
  };

  $('productRows').onclick=e=>{
    const edit=e.target.closest('[data-edit]');
    const del=e.target.closest('[data-del]');
    if(edit){ const p=products.find(x=>x.id===edit.dataset.edit); if(p) openProduct(p); }
    if(del && confirm('Delete this product? This cannot be undone.')){
      products=products.filter(x=>x.id!==del.dataset.del);
      persist(); renderAll();
    }
  };

  $('addCatBtn').onclick=()=>{
    const name=prompt('Category name');
    if(!name||!name.trim()) return;
    const id=name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||('cat'+Date.now());
    if(categories.some(c=>c.id===id)){ alert('A category with this name already exists'); return; }
    categories.push({id,name:name.trim()});
    persist(); renderAll();
  };
  $('catRows').onclick=e=>{
    const del=e.target.closest('[data-delcat]');
    if(!del) return;
    if(products.some(p=>p.category===del.dataset.delcat)){
      alert('Cannot delete: products still use this category. Move or delete those products first.');
      return;
    }
    if(confirm('Delete this category?')){
      categories=categories.filter(c=>c.id!==del.dataset.delcat);
      persist(); renderAll();
    }
  };

  $('exportBtn').onclick=()=>{
    const data=ClynData.exportAll();
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='clyn-backup-'+new Date().toISOString().slice(0,10)+'.json';
    a.click();
  };
  $('importFile').onchange=e=>{
    const file=e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        ClynData.importAll(JSON.parse(ev.target.result));
        load(); renderAll();
        alert('Backup imported successfully.');
      }catch(err){ alert('Invalid backup file.'); }
    };
    reader.readAsText(file);
    e.target.value='';
  };
  $('resetBtn').onclick=()=>{
    if(confirm('Reset all products and categories to factory defaults? Your current data will be lost unless you have a backup.')){
      ClynData.resetAll(); load(); renderAll();
    }
  };

  if(sessionStorage.getItem(AUTH)==='1') enterApp();
})();
