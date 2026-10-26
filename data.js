const ClynData={
STORAGE_PRODUCTS:'clyn_products',
STORAGE_CATEGORIES:'clyn_categories',
ADMIN_PASSWORD:'clyn2026',
defaultCategories:[
{id:'mining',name:'Mining Parts'},
{id:'truck',name:'Truck & Automotive'},
{id:'heavy',name:'Heavy Duty Equipment'},
{id:'electrical',name:'Electrical Spares'},
{id:'filters',name:'Filters & Service Kits'},
{id:'bearings',name:'Bearings & Seals'},
{id:'hydraulics',name:'Hydraulics'},
{id:'general',name:'General Trading'}
],
defaultProducts:[
{id:'p1',name:'Bucket Teeth & Adapters',category:'mining',description:'Ground engaging tools for excavators and loaders.',price:'On request',featured:true},
{id:'p5',name:'Centre Bearings',category:'truck',description:'Propeller shaft centre bearings for various truck models.',price:'On request',featured:true},
{id:'p6',name:'Clutch Kits',category:'truck',description:'Complete clutch kits for heavy trucks.',price:'On request',featured:true},
{id:'p14',name:'Alternators',category:'electrical',description:'Alternators for trucks and heavy equipment.',price:'On request',featured:true},
{id:'p18',name:'Oil Filters',category:'filters',description:'Engine oil filters for trucks and mining equipment.',price:'On request',featured:true},
{id:'p26',name:'Hydraulic Hoses',category:'hydraulics',description:'High pressure hydraulic hoses, made to length.',price:'On request',featured:true}
],
getCategories(){try{const r=localStorage.getItem(this.STORAGE_CATEGORIES);if(r)return JSON.parse(r)}catch(e){}return JSON.parse(JSON.stringify(this.defaultCategories))},
getProducts(){try{const r=localStorage.getItem(this.STORAGE_PRODUCTS);if(r)return JSON.parse(r)}catch(e){}return JSON.parse(JSON.stringify(this.defaultProducts))}
};
