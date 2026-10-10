export interface ProductItem {
  id: string;
  name: string;
  categorySlug: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  unit: string;
  variants?: string[];
  rating: number;
  reviewsCount: number;
  deliveryMinutes: number;
  image: string;
  badge?: string;
  description: string;
  inStock: boolean;
}

export interface CategoryInfo {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  heroTagline: string;
  accentColor: string;
  image: string;
  subcategories: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: "groceries",
    title: "Groceries",
    subtitle: "Artisan staples, organic pantry essentials & bakery",
    badge: "⚡ 8 Mins",
    heroTagline: "Daily essentials & gourmet pantry delivered in minutes",
    accentColor: "from-amber-500/20 to-orange-500/20",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    subcategories: ["All", "Pantry Staples", "Bakery", "Oils & Condiments", "Beverages"],
  },
  {
    slug: "fruits",
    title: "Fruits",
    subtitle: "Farm-fresh seasonal, tropical & organic berries",
    badge: "🍓 Farm Fresh",
    heroTagline: "Handpicked orchard fruits & exotic harvest",
    accentColor: "from-rose-500/20 to-orange-500/20",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=80",
    subcategories: ["All", "Berries", "Tropical", "Citrus", "Everyday Fruits"],
  },
  {
    slug: "vegetables",
    title: "Vegetables",
    subtitle: "Crisp hydroponic greens, organic roots & herbs",
    badge: "🥬 100% Organic",
    heroTagline: "Harvested at dawn, delivered crisp to your kitchen",
    accentColor: "from-emerald-500/20 to-teal-500/20",
    image:
      "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=1000&q=80",
    subcategories: ["All", "Leafy Greens", "Daily Veggies", "Root Veggies", "Exotic"],
  },
  {
    slug: "electronics",
    title: "Electronics",
    subtitle: "Headphones, smartwatches, fast chargers & audio",
    badge: "🎧 Express Tech",
    heroTagline: "Premium gadgets & accessories at lightning speed",
    accentColor: "from-cyan-500/20 to-blue-500/20",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    subcategories: ["All", "Audio", "Wearables", "Power & Cables", "Smart Home"],
  },
  {
    slug: "clothes",
    title: "Clothes",
    subtitle: "Jeans, T-Shirts, Shirts, Hoodies & everyday fashion",
    badge: "👕 Try & Buy",
    heroTagline: "Curated wardrobe essentials: Jeans, T-Shirts, Shirts & more",
    accentColor: "from-violet-500/20 to-fuchsia-500/20",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80",
    subcategories: ["All", "Jeans", "T-Shirts", "Shirts", "Outerwear"],
  },
  {
    slug: "accessories",
    title: "Accessories",
    subtitle: "Watches, sunglasses, leather wallets & backpacks",
    badge: "⌚ Luxe Picks",
    heroTagline: "Statement accessories to elevate every outfit",
    accentColor: "from-indigo-500/20 to-purple-500/20",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    subcategories: ["All", "Watches", "Sunglasses", "Bags", "Wallets & Belts"],
  },
  {
    slug: "dairy-snacks",
    title: "Dairy & Snacks",
    subtitle: "Artisan cheese, Greek yogurt, dark chocolate & crisps",
    badge: "🧀 Chilled",
    heroTagline: "Farmhouse dairy & irresistible midnight munchies",
    accentColor: "from-yellow-500/20 to-amber-500/20",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=80",
    subcategories: ["All", "Milk & Yogurt", "Cheese & Butter", "Chips & Crisps", "Chocolates"],
  },
  {
    slug: "personal-care",
    title: "Personal Care",
    subtitle: "Skincare serums, luxury grooming, bath & wellness",
    badge: "✨ Self-Care",
    heroTagline: "Botanical skincare, fragrances & daily wellness rituals",
    accentColor: "from-pink-500/20 to-rose-500/20",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80",
    subcategories: ["All", "Skincare", "Haircare", "Bath & Body", "Home Spa"],
  },
];

export const PRODUCTS: ProductItem[] = [
  // ==================== 1. CLOTHES (Jeans, T-Shirts, Shirts, Outerwear) ====================
  {
    id: "clothes-1",
    name: "Vintage Indigo Slim-Fit Jeans",
    categorySlug: "clothes",
    subcategory: "Jeans",
    price: 49.99,
    originalPrice: 69.99,
    unit: "1 Pair",
    variants: ["30", "32", "34", "36"],
    rating: 4.9,
    reviewsCount: 342,
    deliveryMinutes: 18,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    description:
      "Selvedge-inspired stretch denim jeans with a tailored slim leg and classic 5-pocket styling.",
    inStock: true,
  },
  {
    id: "clothes-2",
    name: "Relaxed Tapered Light-Wash Jeans",
    categorySlug: "clothes",
    subcategory: "Jeans",
    price: 54.0,
    originalPrice: 72.0,
    unit: "1 Pair",
    variants: ["30", "32", "34", "36"],
    rating: 4.8,
    reviewsCount: 215,
    deliveryMinutes: 18,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    description:
      "100% organic cotton vintage light-wash denim with a relaxed seat and clean tapered ankle.",
    inStock: true,
  },
  {
    id: "clothes-3",
    name: "Heavyweight Supima Cotton Crew T-Shirt",
    categorySlug: "clothes",
    subcategory: "T-Shirts",
    price: 24.99,
    originalPrice: 35.0,
    unit: "1 Piece",
    variants: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewsCount: 518,
    deliveryMinutes: 15,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    badge: "Essential",
    description:
      "280 GSM breathable combed cotton crew neck tee that holds its structured silhouette wash after wash.",
    inStock: true,
  },
  {
    id: "clothes-4",
    name: "Monochrome Graphic Oversized T-Shirt",
    categorySlug: "clothes",
    subcategory: "T-Shirts",
    price: 29.5,
    originalPrice: 39.99,
    unit: "1 Piece",
    variants: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviewsCount: 189,
    deliveryMinutes: 15,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    badge: "Streetwear",
    description:
      "Drop-shoulder boxy fit T-shirt crafted from ultra-soft ringspun jersey in obsidian black.",
    inStock: true,
  },
  {
    id: "clothes-5",
    name: "Crisp Oxford Button-Down Shirt",
    categorySlug: "clothes",
    subcategory: "Shirts",
    price: 44.0,
    originalPrice: 59.0,
    unit: "1 Piece",
    variants: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewsCount: 276,
    deliveryMinutes: 16,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    badge: "Smart Casual",
    description:
      "Classic woven Oxford cloth button-down shirt with mother-of-pearl buttons and tailored cuffs.",
    inStock: true,
  },
  {
    id: "clothes-6",
    name: "Coastal Pure Linen Resort Shirt",
    categorySlug: "clothes",
    subcategory: "Shirts",
    price: 48.0,
    originalPrice: 64.0,
    unit: "1 Piece",
    variants: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewsCount: 164,
    deliveryMinutes: 16,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    badge: "100% Linen",
    description:
      "Breathable European flax linen shirt designed for effortless warm-weather layering.",
    inStock: true,
  },
  {
    id: "clothes-7",
    name: "Checkered Flannel Overshirt",
    categorySlug: "clothes",
    subcategory: "Shirts",
    price: 42.5,
    originalPrice: 58.0,
    unit: "1 Piece",
    variants: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviewsCount: 142,
    deliveryMinutes: 18,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    description:
      "Brushed double-sided twill flannel shirt with dual chest pockets and a cozy mid-weight drape.",
    inStock: true,
  },
  {
    id: "clothes-8",
    name: "Classic Trucker Denim Jacket",
    categorySlug: "clothes",
    subcategory: "Outerwear",
    price: 68.0,
    originalPrice: 89.0,
    unit: "1 Piece",
    variants: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewsCount: 310,
    deliveryMinutes: 20,
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    badge: "Iconic",
    description:
      "Timeless mid-wash denim jacket with antique brass hardware and adjustable waist tabs.",
    inStock: true,
  },

  // ==================== 2. GROCERIES ====================
  {
    id: "groceries-1",
    name: "Artisan Country Sourdough Loaf",
    categorySlug: "groceries",
    subcategory: "Bakery",
    price: 6.49,
    originalPrice: 7.99,
    unit: "600g Loaf",
    variants: ["Whole Loaf", "Thick Sliced"],
    rating: 4.9,
    reviewsCount: 412,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
    badge: "Baked Today",
    description:
      "36-hour slow-fermented crust sourdough baked fresh in stone deck ovens.",
    inStock: true,
  },
  {
    id: "groceries-2",
    name: "Cold-Pressed Extra Virgin Olive Oil",
    categorySlug: "groceries",
    subcategory: "Oils & Condiments",
    price: 16.99,
    originalPrice: 21.5,
    unit: "750 ml",
    variants: ["500 ml", "750 ml"],
    rating: 4.9,
    reviewsCount: 289,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    badge: "Single Origin",
    description:
      "First cold-press Mediterranean olive oil with peppery notes and rich polyphenols.",
    inStock: true,
  },
  {
    id: "groceries-3",
    name: "Single-Origin Arabica Whole Bean Coffee",
    categorySlug: "groceries",
    subcategory: "Beverages",
    price: 14.5,
    originalPrice: 18.0,
    unit: "340g Bag",
    variants: ["Whole Bean", "Espresso Grind", "Pour Over"],
    rating: 4.8,
    reviewsCount: 530,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
    badge: "Roaster Pick",
    description:
      "Medium-roast Ethiopian highland beans with tasting notes of dark cocoa and bergamot.",
    inStock: true,
  },
  {
    id: "groceries-4",
    name: "Raw Wildflower Honeycomb Jar",
    categorySlug: "groceries",
    subcategory: "Oils & Condiments",
    price: 11.99,
    originalPrice: 14.99,
    unit: "450g Jar",
    rating: 4.9,
    reviewsCount: 198,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    badge: "100% Raw",
    description:
      "Unfiltered golden wildflower honey sustainably harvested from meadow apiaries.",
    inStock: true,
  },
  {
    id: "groceries-5",
    name: "Bronze-Die Italian Durum Penne Pasta",
    categorySlug: "groceries",
    subcategory: "Pantry Staples",
    price: 4.29,
    originalPrice: 5.49,
    unit: "500g Pack",
    variants: ["Penne", "Spaghetti", "Fusilli"],
    rating: 4.7,
    reviewsCount: 310,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80",
    description:
      "Slow-dried Gragnano semolina pasta with a rough bronze-cut texture that holds sauce.",
    inStock: true,
  },
  {
    id: "groceries-6",
    name: "Organic Rolled Oats & Chia Superblend",
    categorySlug: "groceries",
    subcategory: "Pantry Staples",
    price: 7.49,
    originalPrice: 9.29,
    unit: "1 kg Pouch",
    rating: 4.8,
    reviewsCount: 245,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80",
    badge: "High Fiber",
    description:
      "Whole grain steel-cut & rolled oats blended with organic black chia and flax seeds.",
    inStock: true,
  },

  // ==================== 3. FRUITS ====================
  {
    id: "fruits-1",
    name: "Organic Driscoll's Sweet Strawberries",
    categorySlug: "fruits",
    subcategory: "Berries",
    price: 5.99,
    originalPrice: 7.49,
    unit: "400g Punnet",
    variants: ["250g", "400g", "800g Family Pack"],
    rating: 4.9,
    reviewsCount: 620,
    deliveryMinutes: 9,
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
    badge: "Sweetest Pick",
    description:
      "Ruby-red, sun-ripened strawberries bursting with natural sweetness and vitamin C.",
    inStock: true,
  },
  {
    id: "fruits-2",
    name: "Creamy Hass Avocados (Ready to Eat)",
    categorySlug: "fruits",
    subcategory: "Tropical",
    price: 6.49,
    originalPrice: 8.5,
    unit: "Pack of 3",
    variants: ["Pack of 2", "Pack of 3", "Pack of 6"],
    rating: 4.8,
    reviewsCount: 480,
    deliveryMinutes: 9,
    image:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
    badge: "Ripe Today",
    description:
      "Rich, buttery Mexican Hass avocados ripened to perfection for toast or guacamole.",
    inStock: true,
  },
  {
    id: "fruits-3",
    name: "Honeycrisp Orchard Apples",
    categorySlug: "fruits",
    subcategory: "Everyday Fruits",
    price: 4.99,
    originalPrice: 6.29,
    unit: "1 kg (4-5 pcs)",
    rating: 4.8,
    reviewsCount: 340,
    deliveryMinutes: 9,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    description:
      "Explosively crisp, juicy orchard apples with a balanced honey-sweet and tart flavor.",
    inStock: true,
  },
  {
    id: "fruits-4",
    name: "Jumbo Highland Blueberries",
    categorySlug: "fruits",
    subcategory: "Berries",
    price: 5.49,
    originalPrice: 6.99,
    unit: "200g Clamshell",
    rating: 4.9,
    reviewsCount: 295,
    deliveryMinutes: 9,
    image:
      "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80",
    badge: "Antioxidant Rich",
    description:
      "Plump, frosty-bloom blueberries with a firm snap and sweet berry finish.",
    inStock: true,
  },
  {
    id: "fruits-5",
    name: "Sun-Kissed Valencia Navel Oranges",
    categorySlug: "fruits",
    subcategory: "Citrus",
    price: 4.49,
    originalPrice: 5.99,
    unit: "1 kg Bag",
    rating: 4.7,
    reviewsCount: 210,
    deliveryMinutes: 9,
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
    description:
      "Seedless, thin-skinned Valencia oranges ideal for fresh-squeezed morning juice.",
    inStock: true,
  },
  {
    id: "fruits-6",
    name: "Organic Cavendish Bananas",
    categorySlug: "fruits",
    subcategory: "Everyday Fruits",
    price: 2.29,
    originalPrice: 2.99,
    unit: "Bunch (6-7 pcs)",
    rating: 4.8,
    reviewsCount: 780,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    badge: "Daily Value",
    description:
      "Naturally sweet, potassium-packed organic bananas picked at peak golden ripeness.",
    inStock: true,
  },

  // ==================== 4. VEGETABLES ====================
  {
    id: "vegetables-1",
    name: "Vine-Ripened Heirloom Cherry Tomatoes",
    categorySlug: "vegetables",
    subcategory: "Daily Veggies",
    price: 3.99,
    originalPrice: 4.99,
    unit: "350g Truss",
    rating: 4.9,
    reviewsCount: 410,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    badge: "Hydroponic",
    description:
      "Sweet, glossy cherry tomatoes still on the aromatic green vine for maximum freshness.",
    inStock: true,
  },
  {
    id: "vegetables-2",
    name: "Triple-Washed Baby Spinach Leaves",
    categorySlug: "vegetables",
    subcategory: "Leafy Greens",
    price: 3.49,
    originalPrice: 4.49,
    unit: "200g Box",
    rating: 4.8,
    reviewsCount: 365,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
    badge: "Ready to Eat",
    description:
      "Tender young spinach leaves, triple-washed and ready for salads, smoothies, or sautéing.",
    inStock: true,
  },
  {
    id: "vegetables-3",
    name: "Rainbow Sweet Bell Peppers Trio",
    categorySlug: "vegetables",
    subcategory: "Exotic",
    price: 4.79,
    originalPrice: 5.99,
    unit: "Pack of 3 (Red, Yellow, Orange)",
    rating: 4.8,
    reviewsCount: 290,
    deliveryMinutes: 9,
    image:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
    description:
      "Crunchy, thick-walled greenhouse bell peppers in vibrant red, yellow, and orange.",
    inStock: true,
  },
  {
    id: "vegetables-4",
    name: "Fresh Organic Broccoli Crowns",
    categorySlug: "vegetables",
    subcategory: "Daily Veggies",
    price: 2.99,
    originalPrice: 3.79,
    unit: "400g Crown",
    rating: 4.7,
    reviewsCount: 230,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80",
    badge: "Farm Direct",
    description:
      "Tightly budded dark-green broccoli florets trimmed with minimal stalk waste.",
    inStock: true,
  },
  {
    id: "vegetables-5",
    name: "Organic Rainbow Heirloom Carrots",
    categorySlug: "vegetables",
    subcategory: "Root Veggies",
    price: 3.69,
    originalPrice: 4.5,
    unit: "500g Bunch",
    rating: 4.9,
    reviewsCount: 175,
    deliveryMinutes: 9,
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
    description:
      "Earth-sweet purple, golden, and orange carrots perfect for roasting with honey and thyme.",
    inStock: true,
  },
  {
    id: "vegetables-6",
    name: "Seedless English Greenhouse Cucumbers",
    categorySlug: "vegetables",
    subcategory: "Daily Veggies",
    price: 2.19,
    originalPrice: 2.89,
    unit: "2 Pieces",
    rating: 4.8,
    reviewsCount: 310,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=80",
    description:
      "Crisp, burpless English cucumbers with thin edible skin and zero bitter seeds.",
    inStock: true,
  },

  // ==================== 5. ELECTRONICS ====================
  {
    id: "electronics-1",
    name: "Studio ANC Wireless Over-Ear Headphones",
    categorySlug: "electronics",
    subcategory: "Audio",
    price: 199.0,
    originalPrice: 249.0,
    unit: "1 Unit",
    variants: ["Matte Black", "Lunar Silver", "Midnight Navy"],
    rating: 4.9,
    reviewsCount: 845,
    deliveryMinutes: 14,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    badge: "40Hr Battery",
    description:
      "Adaptive hybrid active noise cancellation with spatial audio and plush memory-foam earcups.",
    inStock: true,
  },
  {
    id: "electronics-2",
    name: "Titanium Smart Watch Series X",
    categorySlug: "electronics",
    subcategory: "Wearables",
    price: 279.0,
    originalPrice: 329.0,
    unit: "45mm GPS",
    variants: ["41mm", "45mm"],
    rating: 4.9,
    reviewsCount: 612,
    deliveryMinutes: 15,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    badge: "Top Rated",
    description:
      "Always-on sapphire OLED display with ECG, blood oxygen, and 7-day multi-sport tracking.",
    inStock: true,
  },
  {
    id: "electronics-3",
    name: "Pro True Wireless ANC Earbuds",
    categorySlug: "electronics",
    subcategory: "Audio",
    price: 129.0,
    originalPrice: 159.0,
    unit: "With MagSafe Case",
    rating: 4.8,
    reviewsCount: 530,
    deliveryMinutes: 12,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    badge: "Express 12m",
    description:
      "Pocket-sized lossless audio earbuds with transparency mode and wireless charging case.",
    inStock: true,
  },
  {
    id: "electronics-4",
    name: "100W GaN Ultra-Fast 3-Port Charger",
    categorySlug: "electronics",
    subcategory: "Power & Cables",
    price: 45.0,
    originalPrice: 59.0,
    unit: "2x USB-C + 1x USB-A",
    rating: 4.9,
    reviewsCount: 410,
    deliveryMinutes: 12,
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    badge: "Laptop Ready",
    description:
      "Compact Gallium Nitride wall charger capable of fast-charging MacBook, iPad, and phone simultaneously.",
    inStock: true,
  },
  {
    id: "electronics-5",
    name: "360° Waterproof Portable Bluetooth Speaker",
    categorySlug: "electronics",
    subcategory: "Audio",
    price: 89.0,
    originalPrice: 115.0,
    unit: "IP67 Rated",
    variants: ["Obsidian", "Forest Green", "Terracotta"],
    rating: 4.8,
    reviewsCount: 320,
    deliveryMinutes: 15,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    description:
      "Punchy dual-passive radiator bass with 18 hours of playtime and rugged waterproof weave.",
    inStock: true,
  },
  {
    id: "electronics-6",
    name: "Wireless Mechanical Compact Keyboard",
    categorySlug: "electronics",
    subcategory: "Smart Home",
    price: 110.0,
    originalPrice: 139.0,
    unit: "75% Layout",
    variants: ["Tactile Brown", "Linear Red"],
    rating: 4.9,
    reviewsCount: 275,
    deliveryMinutes: 16,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    badge: "Hot-Swappable",
    description:
      "CNC aluminum frame wireless mechanical keyboard with PBT keycaps and tri-mode connectivity.",
    inStock: true,
  },

  // ==================== 6. ACCESSORIES ====================
  {
    id: "accessories-1",
    name: "Minimalist Swiss Chronograph Watch",
    categorySlug: "accessories",
    subcategory: "Watches",
    price: 149.0,
    originalPrice: 195.0,
    unit: "40mm Steel",
    variants: ["Silver / Black Leather", "Gold / Brown Leather"],
    rating: 4.9,
    reviewsCount: 380,
    deliveryMinutes: 16,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    badge: "Sapphire Glass",
    description:
      "Brushed 316L stainless steel dress watch paired with full-grain Italian calfskin strap.",
    inStock: true,
  },
  {
    id: "accessories-2",
    name: "Polarized Tortoiseshell Wayfarer Sunglasses",
    categorySlug: "accessories",
    subcategory: "Sunglasses",
    price: 65.0,
    originalPrice: 85.0,
    unit: "UV400 Protection",
    rating: 4.8,
    reviewsCount: 290,
    deliveryMinutes: 15,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    badge: "Polarized",
    description:
      "Hand-polished Mazzucchelli acetate frames with anti-reflective polarized G-15 lenses.",
    inStock: true,
  },
  {
    id: "accessories-3",
    name: "Weatherproof Commuter Tech Backpack",
    categorySlug: "accessories",
    subcategory: "Bags",
    price: 89.0,
    originalPrice: 119.0,
    unit: "22L Capacity",
    variants: ["Charcoal Black", "Olive Drab"],
    rating: 4.9,
    reviewsCount: 410,
    deliveryMinutes: 18,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    badge: "Fits 16\" Laptop",
    description:
      "Ballistic nylon everyday backpack with waterproof YKK zippers and suspended laptop sleeve.",
    inStock: true,
  },
  {
    id: "accessories-4",
    name: "Full-Grain RFID Bifold Leather Wallet",
    categorySlug: "accessories",
    subcategory: "Wallets & Belts",
    price: 42.0,
    originalPrice: 55.0,
    unit: "Slim Profile",
    variants: ["Cognac Tan", "Espresso", "Jet Black"],
    rating: 4.8,
    reviewsCount: 340,
    deliveryMinutes: 14,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    description:
      "Vegetable-tanned leather bifold wallet with RFID shielding and quick-access pull tab.",
    inStock: true,
  },

  // ==================== 7. DAIRY & SNACKS ====================
  {
    id: "dairy-1",
    name: "Creamy Strained Greek Yogurt (0% Fat)",
    categorySlug: "dairy-snacks",
    subcategory: "Milk & Yogurt",
    price: 4.99,
    originalPrice: 6.29,
    unit: "500g Tub",
    rating: 4.9,
    reviewsCount: 510,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    badge: "20g Protein",
    description:
      "Thick, velvety pasture-raised Greek yogurt packed with live probiotics and high protein.",
    inStock: true,
  },
  {
    id: "dairy-2",
    name: "Vintage 18-Month Aged Farmhouse Cheddar",
    categorySlug: "dairy-snacks",
    subcategory: "Cheese & Butter",
    price: 7.99,
    originalPrice: 9.99,
    unit: "250g Wedge",
    rating: 4.9,
    reviewsCount: 280,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
    badge: "Artisan Cave-Aged",
    description:
      "Sharp, crumbly English-style cheddar with savory calcium crystals and a long nutty finish.",
    inStock: true,
  },
  {
    id: "dairy-3",
    name: "72% Belgian Single-Origin Dark Chocolate",
    categorySlug: "dairy-snacks",
    subcategory: "Chocolates",
    price: 5.49,
    originalPrice: 6.99,
    unit: "100g Bar",
    variants: ["Sea Salt", "Roasted Almond", "Classic 72%"],
    rating: 4.9,
    reviewsCount: 440,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
    badge: "Bean to Bar",
    description:
      "Silky tempered Belgian dark chocolate finished with flaky Maldon sea salt crystals.",
    inStock: true,
  },
  {
    id: "dairy-4",
    name: "Black Truffle & Rosemary Kettle Chips",
    categorySlug: "dairy-snacks",
    subcategory: "Chips & Crisps",
    price: 3.99,
    originalPrice: 4.99,
    unit: "150g Sharing Bag",
    rating: 4.8,
    reviewsCount: 370,
    deliveryMinutes: 8,
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80",
    description:
      "Hand-cooked skin-on potato crisps seasoned with real Italian black summer truffle.",
    inStock: true,
  },

  // ==================== 8. PERSONAL CARE ====================
  {
    id: "care-1",
    name: "15% Vitamin C + Hyaluronic Glow Serum",
    categorySlug: "personal-care",
    subcategory: "Skincare",
    price: 28.0,
    originalPrice: 36.0,
    unit: "30 ml Dropper",
    rating: 4.9,
    reviewsCount: 640,
    deliveryMinutes: 10,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    badge: "Derm Approved",
    description:
      "Brightening antioxidant facial serum with L-ascorbic acid, ferulic acid, and botanical hyaluronic.",
    inStock: true,
  },
  {
    id: "care-2",
    name: "Moroccan Cold-Pressed Argan Hair Elixir",
    categorySlug: "personal-care",
    subcategory: "Haircare",
    price: 22.0,
    originalPrice: 29.0,
    unit: "100 ml Glass Bottle",
    rating: 4.8,
    reviewsCount: 315,
    deliveryMinutes: 10,
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
    description:
      "Weightless smoothing hair oil that tames frizz, protects from heat, and adds mirror shine.",
    inStock: true,
  },
  {
    id: "care-3",
    name: "Eucalyptus & Cedarwood Botanical Body Wash",
    categorySlug: "personal-care",
    subcategory: "Bath & Body",
    price: 16.5,
    originalPrice: 21.0,
    unit: "500 ml Pump",
    rating: 4.9,
    reviewsCount: 290,
    deliveryMinutes: 10,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    badge: "Sulfate-Free",
    description:
      "Spa-grade aromatic body cleanser infused with steam-distilled eucalyptus and aloe vera.",
    inStock: true,
  },
  {
    id: "care-4",
    name: "Santal & Amber Hand-Poured Soy Candle",
    categorySlug: "personal-care",
    subcategory: "Home Spa",
    price: 24.0,
    originalPrice: 32.0,
    unit: "50Hr Burn Time",
    rating: 4.9,
    reviewsCount: 210,
    deliveryMinutes: 12,
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    description:
      "100% natural coconut-soy wax candle with crackling wooden wick and warm sandalwood notes.",
    inStock: true,
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): ProductItem[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}
