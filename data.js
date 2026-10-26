/**
 * C-LYN SOLUTIONS LIMITED - Shared Data & Defaults
 * Products are stored in localStorage under key: clyn_products
 * Categories under: clyn_categories
 */

const ClynData = {
  STORAGE_PRODUCTS: 'clyn_products',
  STORAGE_CATEGORIES: 'clyn_categories',
  STORAGE_GALLERY: 'clyn_gallery',
  ADMIN_PASSWORD: 'clyn2026',

  defaultCategories: [
    { id: 'mining', name: 'Mining Parts', icon: '⛏️', description: 'Spare parts for mining equipment and operations' },
    { id: 'truck', name: 'Truck & Automotive', icon: '🚛', description: 'Parts for trucks and commercial vehicles' },
    { id: 'heavy', name: 'Heavy Duty Equipment', icon: '🔧', description: 'Components for heavy machinery' },
    { id: 'electrical', name: 'Electrical Spares', icon: '⚡', description: 'Electrical components for vehicles & equipment' },
    { id: 'filters', name: 'Filters & Service Kits', icon: '🛢️', description: 'Oil, air, fuel filters and service kits' },
    { id: 'bearings', name: 'Bearings & Seals', icon: '⚙️', description: 'Centre bearings, wheel bearings, seals' },
    { id: 'hydraulics', name: 'Hydraulics', icon: '💧', description: 'Hoses, cylinders, pumps and fittings' },
    { id: 'general', name: 'General Trading', icon: '📦', description: 'Other industrial and general supplies' }
  ],

  defaultProducts: [
    { id: 'p1', name: 'Bucket Teeth & Adapters', category: 'mining', description: 'Ground engaging tools for excavators and loaders. Various sizes available.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p2', name: 'Cutting Edges', category: 'mining', description: 'Blade cutting edges for dozers and graders.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p3', name: 'Undercarriage Components', category: 'mining', description: 'Track shoes, rollers, idlers and sprockets for tracked equipment.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p4', name: 'Wear Plates & Liners', category: 'mining', description: 'Abrasion resistant plates and chute liners.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p5', name: 'Centre Bearings', category: 'truck', description: 'Propeller shaft centre bearings for various truck models. Current promotion on selected items.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p6', name: 'Clutch Kits', category: 'truck', description: 'Complete clutch kits for heavy trucks and commercial vehicles.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p7', name: 'Brake Pads & Linings', category: 'truck', description: 'Brake pads and drum linings for trucks.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p8', name: 'Suspension Bushes', category: 'truck', description: 'Rubber and polyurethane bushes for truck suspension systems.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p9', name: 'Engine Mounts', category: 'truck', description: 'Engine and gearbox mounts for commercial vehicles.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p10', name: 'U-Joints / Universal Joints', category: 'truck', description: 'Driveshaft universal joints for trucks.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p11', name: 'Hydraulic Cylinders', category: 'heavy', description: 'Lift and tilt cylinders for loaders and excavators.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p12', name: 'Drive Shafts', category: 'heavy', description: 'Axle and drive shafts for heavy equipment.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p13', name: 'Gearbox Parts', category: 'heavy', description: 'Transmission and gearbox components.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p14', name: 'Alternators', category: 'electrical', description: 'Alternators for trucks and heavy equipment. Various amperages.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p15', name: 'Starter Motors', category: 'electrical', description: 'Starter motors for diesel engines and commercial vehicles.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p16', name: 'Sensors & Switches', category: 'electrical', description: 'Temperature, pressure and level sensors; relays and switches.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p17', name: 'Batteries', category: 'electrical', description: 'Heavy duty batteries for trucks and industrial use.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p18', name: 'Oil Filters', category: 'filters', description: 'Engine oil filters for trucks and mining equipment.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p19', name: 'Air Filters', category: 'filters', description: 'Air intake filters for diesel engines.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p20', name: 'Fuel Filters', category: 'filters', description: 'Fuel filters and water separators.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p21', name: 'Hydraulic Filters', category: 'filters', description: 'Return and suction filters for hydraulic systems.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p22', name: 'Hub Bearings', category: 'bearings', description: 'Hub and wheel bearings for trucks.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p23', name: 'Pillow Block Bearings', category: 'bearings', description: 'Mounted bearings for industrial applications.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p24', name: 'Oil Seals', category: 'bearings', description: 'Various oil seals and grease seals.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p25', name: 'Hose Fittings', category: 'hydraulics', description: 'JIC, ORFS and BSP fittings.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p26', name: 'Hydraulic Hoses', category: 'hydraulics', description: 'High pressure hydraulic hoses, made to length.', partNumber: '', price: 'On request', featured: true, image: '' },
    { id: 'p27', name: 'Pumps & Motors', category: 'hydraulics', description: 'Hydraulic pumps and motors.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p28', name: 'Industrial Tools', category: 'general', description: 'Hand tools and workshop supplies.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p29', name: 'Fasteners & Hardware', category: 'general', description: 'Bolts, nuts, washers and industrial fasteners.', partNumber: '', price: 'On request', featured: false, image: '' },
    { id: 'p30', name: 'Lubricants & Grease', category: 'general', description: 'Engine oils, gear oils and industrial greases.', partNumber: '', price: 'On request', featured: false, image: '' }
  ],

  defaultGallery: [
    { id: 'g1', title: 'Shop Front', caption: 'C-LYN SOLUTIONS LIMITED - Freetown Road, Kitwe' },
    { id: 'g2', title: 'Parts Display', caption: 'Quality truck and mining parts in stock' },
    { id: 'g3', title: 'Workshop', caption: 'Ready to help with the right solution' },
    { id: 'g4', title: 'Stock Room', caption: 'Wide range of components' },
    { id: 'g5', title: 'Counter Service', caption: 'Knowledgeable staff on hand' },
    { id: 'g6', title: 'Delivery Ready', caption: 'Fast local supply on the Copperbelt' }
  ],

  getCategories() {
    try {
      const raw = localStorage.getItem(this.STORAGE_CATEGORIES);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return JSON.parse(JSON.stringify(this.defaultCategories));
  },

  saveCategories(list) {
    localStorage.setItem(this.STORAGE_CATEGORIES, JSON.stringify(list));
  },

  getProducts() {
    try {
      const raw = localStorage.getItem(this.STORAGE_PRODUCTS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return JSON.parse(JSON.stringify(this.defaultProducts));
  },

  saveProducts(list) {
    localStorage.setItem(this.STORAGE_PRODUCTS, JSON.stringify(list));
  },

  getGallery() {
    try {
      const raw = localStorage.getItem(this.STORAGE_GALLERY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return JSON.parse(JSON.stringify(this.defaultGallery));
  },

  saveGallery(list) {
    localStorage.setItem(this.STORAGE_GALLERY, JSON.stringify(list));
  },

  exportAll() {
    return {
      products: this.getProducts(),
      categories: this.getCategories(),
      gallery: this.getGallery(),
      exportedAt: new Date().toISOString()
    };
  },

  importAll(data) {
    if (data.products) this.saveProducts(data.products);
    if (data.categories) this.saveCategories(data.categories);
    if (data.gallery) this.saveGallery(data.gallery);
  },

  resetAll() {
    localStorage.removeItem(this.STORAGE_PRODUCTS);
    localStorage.removeItem(this.STORAGE_CATEGORIES);
    localStorage.removeItem(this.STORAGE_GALLERY);
  }
};
