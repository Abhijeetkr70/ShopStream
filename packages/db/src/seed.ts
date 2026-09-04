import { db } from "./client";
import { categories, products, productImages } from "./schema";

const seedCategories = [
  { slug: "fashion", name: "Fashion", icon: "shirt" },
  { slug: "electronics", name: "Electronics", icon: "zap" },
  { slug: "grocery", name: "Grocery", icon: "shopping-basket" },
  { slug: "beauty", name: "Beauty", icon: "sparkles" },
  { slug: "home", name: "Home", icon: "sofa" },
  { slug: "books", name: "Books", icon: "book-open" },
];

const placeholder = (seed: string, w = 800, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const seedProducts = [
  // Fashion
  { slug: "classic-tee-black", title: "Classic Crew Neck Tee — Jet Black", brand: "Northwind", cat: "fashion", mrp: 149900, sale: 79900, rating: 4.4, stock: 120, desc: "100% combed cotton, pre-shrunk, tailored fit." },
  { slug: "slim-jeans-indigo", title: "Slim Fit Jeans — Indigo Wash", brand: "Northwind", cat: "fashion", mrp: 249900, sale: 129900, rating: 4.5, stock: 80, desc: "Stretch denim, mid-rise, 5-pocket styling." },
  { slug: "linen-shirt-sand", title: "Linen Shirt — Sand", brand: "Verdure", cat: "fashion", mrp: 199900, sale: 119900, rating: 4.2, stock: 60, desc: "Pure French linen, breathable, regular fit." },
  { slug: "oversized-hoodie-grey", title: "Oversized Hoodie — Heather Grey", brand: "Northwind", cat: "fashion", mrp: 219900, sale: 139900, rating: 4.6, stock: 90, desc: "Brushed fleece, kangaroo pocket, ribbed cuffs." },
  { slug: "pleated-skirt-beige", title: "Pleated Midi Skirt — Beige", brand: "Verdure", cat: "fashion", mrp: 179900, sale: 99900, rating: 4.1, stock: 40, desc: "Flowy chiffon, elastic waist, lined." },
  { slug: "running-shoes-coral", title: "Running Shoes — Coral Pop", brand: "Apex", cat: "fashion", mrp: 349900, sale: 199900, rating: 4.5, stock: 70, desc: "Mesh upper, EVA midsole, rubber outsole." },
  { slug: "leather-belt-brown", title: "Leather Belt — Tan Brown", brand: "Atelier", cat: "fashion", mrp: 99900, sale: 59900, rating: 4.3, stock: 110, desc: "Full-grain leather, brushed brass buckle." },
  { slug: "wool-scarf-charcoal", title: "Wool Scarf — Charcoal", brand: "Verdure", cat: "fashion", mrp: 89900, sale: 49900, rating: 4.0, stock: 75, desc: "100% merino wool, brushed finish." },
  { slug: "denim-jacket-mid", title: "Denim Jacket — Mid Wash", brand: "Northwind", cat: "fashion", mrp: 299900, sale: 189900, rating: 4.4, stock: 55, desc: "Heavyweight denim, copper rivets." },
  { slug: "polo-shirt-navy", title: "Pique Polo — Navy", brand: "Northwind", cat: "fashion", mrp: 129900, sale: 74900, rating: 4.5, stock: 100, desc: "Soft cotton pique, ribbed collar." },
  { slug: "ethnic-kurthi-mustard", title: "Embroidered Kurthi — Mustard", brand: "Saheli", cat: "fashion", mrp: 219900, sale: 119900, rating: 4.6, stock: 45, desc: "Hand block print, rayon, regular fit." },
  { slug: "kurti-cotton-print", title: "Cotton Print Kurti — Indigo", brand: "Saheli", cat: "fashion", mrp: 159900, sale: 89900, rating: 4.4, stock: 60, desc: "Pure cotton, hand block print." },

  // Electronics
  { slug: "wireless-earbuds-pro", title: "Wireless Earbuds Pro", brand: "Aural", cat: "electronics", mrp: 999900, sale: 499900, rating: 4.5, stock: 50, desc: "Active noise cancellation, 30 h battery, USB-C." },
  { slug: "smartwatch-aerolite", title: "Smartwatch Aerolite", brand: "Aural", cat: "electronics", mrp: 1499900, sale: 899900, rating: 4.4, stock: 35, desc: "AMOLED, SpO2, GPS, 7-day battery." },
  { slug: "bluetooth-speaker-mini", title: "Bluetooth Speaker Mini", brand: "Boom", cat: "electronics", mrp: 399900, sale: 199900, rating: 4.3, stock: 120, desc: "IPX7, 12 h playback, USB-C." },
  { slug: "mech-keyboard-tkl", title: "Mechanical Keyboard — TKL", brand: "Keyforge", cat: "electronics", mrp: 899900, sale: 549900, rating: 4.7, stock: 40, desc: "Hot-swap switches, PBT keycaps, RGB." },
  { slug: "4k-webcam-stream", title: "4K Webcam — Stream Edition", brand: "Optix", cat: "electronics", mrp: 799900, sale: 499900, rating: 4.4, stock: 55, desc: "Sony sensor, autofocus, dual mics." },
  { slug: "power-bank-20k", title: "Power Bank 20,000 mAh", brand: "Voltcore", cat: "electronics", mrp: 299900, sale: 169900, rating: 4.5, stock: 200, desc: "22.5 W PD, triple port, Type-C in/out." },
  { slug: "noise-cancel-headphones", title: "Over-Ear ANC Headphones", brand: "Aural", cat: "electronics", mrp: 1999900, sale: 1199900, rating: 4.6, stock: 30, desc: "Hybrid ANC, 40 h battery, hi-res audio." },
  { slug: "smart-bulb-rgb", title: "Smart Bulb RGB — 9 W", brand: "Lumify", cat: "electronics", mrp: 79900, sale: 39900, rating: 4.2, stock: 300, desc: "Wi-Fi, Alexa & Google, 16M colors." },
  { slug: "router-ax1800", title: "Wi-Fi 6 Router AX1800", brand: "Netpath", cat: "electronics", mrp: 599900, sale: 349900, rating: 4.4, stock: 60, desc: "Dual-band, MU-MIMO, easy setup." },
  { slug: "gaming-mouse-rgb", title: "Gaming Mouse RGB", brand: "Keyforge", cat: "electronics", mrp: 249900, sale: 129900, rating: 4.5, stock: 110, desc: "26k DPI, 8k polling, optical switches." },
  { slug: "laptop-stand-aluminium", title: "Aluminium Laptop Stand", brand: "Ergo", cat: "electronics", mrp: 299900, sale: 169900, rating: 4.6, stock: 90, desc: "Adjustable height, foldable, ventilated." },
  { slug: "usb-hub-7in1", title: "USB-C Hub 7-in-1", brand: "Voltcore", cat: "electronics", mrp: 199900, sale: 99900, rating: 4.3, stock: 180, desc: "HDMI 4K, SD, microSD, 100 W PD." },

  // Grocery
  { slug: "basmati-rice-5kg", title: "Premium Basmati Rice 5 kg", brand: "Annapurna", cat: "grocery", mrp: 89900, sale: 64900, rating: 4.6, stock: 250, desc: "Aged 24 months, extra-long grain." },
  { slug: "cold-press-oil-1l", title: "Cold-Pressed Groundnut Oil 1 L", brand: "Annapurna", cat: "grocery", mrp: 49900, sale: 34900, rating: 4.4, stock: 200, desc: "Wood-pressed, unrefined." },
  { slug: "green-tea-100bags", title: "Green Tea — 100 Bags", brand: "Verdure", cat: "grocery", mrp: 39900, sale: 22900, rating: 4.3, stock: 320, desc: "Whole-leaf, antioxidant rich." },
  { slug: "honey-raw-500g", title: "Raw Forest Honey 500 g", brand: "Annapurna", cat: "grocery", mrp: 44900, sale: 29900, rating: 4.7, stock: 180, desc: "Single-origin, unprocessed." },
  { slug: "dark-chocolate-70", title: "Dark Chocolate 70 %", brand: "Cacao", cat: "grocery", mrp: 29900, sale: 17900, rating: 4.5, stock: 400, desc: "Single-origin Ecuador, 80 g." },
  { slug: "oats-rolled-1kg", title: "Rolled Oats 1 kg", brand: "Annapurna", cat: "grocery", mrp: 34900, sale: 22900, rating: 4.4, stock: 280, desc: "Whole grain, high fibre." },
  { slug: "almonds-500g", title: "California Almonds 500 g", brand: "Annapurna", cat: "grocery", mrp: 59900, sale: 39900, rating: 4.5, stock: 260, desc: "Whole, premium grade." },
  { slug: "turmeric-powder-200g", title: "Turmeric Powder 200 g", brand: "Annapurna", cat: "grocery", mrp: 14900, sale: 9900, rating: 4.4, stock: 500, desc: "Single-origin, high curcumin." },
  { slug: "coffee-grounds-250g", title: "Filter Coffee Grounds 250 g", brand: "Cacao", cat: "grocery", mrp: 39900, sale: 24900, rating: 4.6, stock: 220, desc: "80:20 chicory blend." },
  { slug: "pasta-penne-500g", title: "Durum Penne 500 g", brand: "Verdure", cat: "grocery", mrp: 19900, sale: 12900, rating: 4.2, stock: 350, desc: "Bronze die, slow-dried." },

  // Beauty
  { slug: "vitamin-c-serum", title: "Vitamin C Brightening Serum 30 ml", brand: "Lumière", cat: "beauty", mrp: 89900, sale: 54900, rating: 4.5, stock: 150, desc: "15 % L-ascorbic acid, ferulic, vitamin E." },
  { slug: "hyaluronic-moisturizer", title: "Hyaluronic Moisturizer 50 g", brand: "Lumière", cat: "beauty", mrp: 69900, sale: 44900, rating: 4.6, stock: 170, desc: "Multi-weight HA, ceramides, fragrance-free." },
  { slug: "sunscreen-spf50", title: "Mineral Sunscreen SPF 50", brand: "Lumière", cat: "beauty", mrp: 79900, sale: 49900, rating: 4.4, stock: 190, desc: "Zinc oxide, reef-safe, non-greasy." },
  { slug: "retinol-night-serum", title: "Retinol 0.3 % Night Serum", brand: "Lumière", cat: "beauty", mrp: 119900, sale: 79900, rating: 4.5, stock: 110, desc: "Encapsulated retinol, bisabolol." },
  { slug: "rose-clay-mask", title: "Rose Clay Mask 100 ml", brand: "Verdure", cat: "beauty", mrp: 59900, sale: 34900, rating: 4.3, stock: 140, desc: "Kaolin, rosehip, gentle exfoliation." },
  { slug: "lip-balm-vanilla", title: "Lip Balm — Vanilla 4.5 g", brand: "Lumière", cat: "beauty", mrp: 19900, sale: 12900, rating: 4.6, stock: 380, desc: "Beeswax, shea butter, vitamin E." },
  { slug: "shampoo-volume", title: "Volumising Shampoo 250 ml", brand: "Verdure", cat: "beauty", mrp: 49900, sale: 29900, rating: 4.2, stock: 220, desc: "Biotin, caffeine, sulphate-free." },
  { slug: "body-lotion-cocoa", title: "Cocoa Body Lotion 250 ml", brand: "Lumière", cat: "beauty", mrp: 44900, sale: 27900, rating: 4.4, stock: 240, desc: "Cocoa butter, glycerin, soft scent." },
  { slug: "perfume-citrus", title: "Citrus Eau de Parfum 50 ml", brand: "Atelier", cat: "beauty", mrp: 199900, sale: 129900, rating: 4.5, stock: 60, desc: "Bergamot, neroli, vetiver base." },
  { slug: "eye-cream-caffeine", title: "Caffeine Eye Cream 15 ml", brand: "Lumière", cat: "beauty", mrp: 89900, sale: 59900, rating: 4.4, stock: 130, desc: "5 % caffeine, peptides, cooling tip." },

  // Home
  { slug: "ceramic-dinner-set", title: "Ceramic Dinner Set — 16 pc", brand: "Habitat", cat: "home", mrp: 299900, sale: 169900, rating: 4.5, stock: 50, desc: "Matte glaze, microwave & dishwasher safe." },
  { slug: "bamboo-cutting-board", title: "Bamboo Cutting Board", brand: "Habitat", cat: "home", mrp: 99900, sale: 59900, rating: 4.6, stock: 130, desc: "Eco-friendly, juice groove." },
  { slug: "cotton-bedsheet-king", title: "Cotton Bedsheet — King", brand: "Verdure", cat: "home", mrp: 199900, sale: 109900, rating: 4.4, stock: 90, desc: "600 TC, 2 pillowcases." },
  { slug: "candle-soy-cedar", title: "Soy Candle — Cedar 200 g", brand: "Habitat", cat: "home", mrp: 79900, sale: 49900, rating: 4.5, stock: 200, desc: "Hand-poured, cotton wick." },
  { slug: "throw-pillow-grey", title: "Throw Pillow — Slate Grey", brand: "Habitat", cat: "home", mrp: 89900, sale: 54900, rating: 4.3, stock: 180, desc: "Linen blend, removable cover." },
  { slug: "cast-iron-skillet-10", title: "Cast Iron Skillet 10″", brand: "Habitat", cat: "home", mrp: 249900, sale: 159900, rating: 4.7, stock: 70, desc: "Pre-seasoned, lifetime warranty." },
  { slug: "kettle-electric-1.7l", title: "Electric Kettle 1.7 L", brand: "Lumify", cat: "home", mrp: 179900, sale: 99900, rating: 4.4, stock: 110, desc: "Borosilicate, auto-off." },
  { slug: "desk-lamp-led", title: "LED Desk Lamp", brand: "Lumify", cat: "home", mrp: 149900, sale: 89900, rating: 4.5, stock: 130, desc: "3 color temps, USB-C charging." },
  { slug: "plant-pot-terracotta", title: "Terracotta Plant Pot — 6″", brand: "Habitat", cat: "home", mrp: 49900, sale: 29900, rating: 4.3, stock: 260, desc: "Drainage hole, saucer included." },
  { slug: "wool-throw-blanket", title: "Wool Throw Blanket", brand: "Verdure", cat: "home", mrp: 299900, sale: 189900, rating: 4.6, stock: 60, desc: "100% wool, herringbone weave." },

  // Books
  { slug: "the-midnight-library", title: "The Midnight Library (Paperback)", brand: "Foliant", cat: "books", mrp: 49900, sale: 29900, rating: 4.5, stock: 220, desc: "By Matt Haig, 304 pp." },
  { slug: "atomic-habits", title: "Atomic Habits (Hardcover)", brand: "Foliant", cat: "books", mrp: 69900, sale: 44900, rating: 4.7, stock: 280, desc: "By James Clear, 320 pp." },
  { slug: "sapiens", title: "Sapiens (Paperback)", brand: "Foliant", cat: "books", mrp: 59900, sale: 39900, rating: 4.6, stock: 240, desc: "By Yuval Noah Harari, 464 pp." },
  { slug: "ikigai", title: "Ikigai (Hardcover)", brand: "Foliant", cat: "books", mrp: 39900, sale: 24900, rating: 4.4, stock: 180, desc: "By Héctor García, 208 pp." },
  { slug: "the-alchemist", title: "The Alchemist (Paperback)", brand: "Foliant", cat: "books", mrp: 39900, sale: 22900, rating: 4.5, stock: 300, desc: "By Paulo Coelho, 208 pp." },
  { slug: "rich-dad-poor-dad", title: "Rich Dad Poor Dad (Paperback)", brand: "Foliant", cat: "books", mrp: 49900, sale: 29900, rating: 4.5, stock: 260, desc: "By Robert Kiyosaki, 336 pp." },
  { slug: "deep-work", title: "Deep Work (Paperback)", brand: "Foliant", cat: "books", mrp: 59900, sale: 39900, rating: 4.4, stock: 160, desc: "By Cal Newport, 304 pp." },
  { slug: "thinking-fast-slow", title: "Thinking, Fast and Slow (Paperback)", brand: "Foliant", cat: "books", mrp: 79900, sale: 54900, rating: 4.5, stock: 150, desc: "By Daniel Kahneman, 512 pp." },
  { slug: "the-psychology-of-money", title: "The Psychology of Money (Paperback)", brand: "Foliant", cat: "books", mrp: 49900, sale: 32900, rating: 4.6, stock: 200, desc: "By Morgan Housel, 256 pp." },
  { slug: "elon-musk-walter-isaacson", title: "Elon Musk (Hardcover)", brand: "Foliant", cat: "books", mrp: 129900, sale: 89900, rating: 4.5, stock: 90, desc: "By Walter Isaacson, 688 pp." },
];

console.log("Seeding…");

await db.delete(products);
await db.delete(categories);

const catRows = await db
  .insert(categories)
  .values(seedCategories.map((c, i) => ({ ...c, position: i })))
  .returning();

const slugToId = new Map(catRows.map((c) => [c.slug, c.id]));

for (const p of seedProducts) {
  const catId = slugToId.get(p.cat);
  if (!catId) throw new Error(`Unknown category ${p.cat}`);
  const inserted = await db
    .insert(products)
    .values({
      slug: p.slug,
      title: p.title,
      brand: p.brand,
      description: p.desc,
      categoryId: catId,
      priceMrp: p.mrp,
      priceSale: p.sale,
      stock: p.stock,
      ratingAvg: p.rating,
      ratingCount: Math.floor(50 + Math.random() * 5000),
      images: [placeholder(p.slug, 1000, 1000), placeholder(`${p.slug}-2`, 1000, 1000)],
      status: "active",
    })
    .returning();
  const row = inserted[0];
  if (!row) throw new Error(`Insert failed for ${p.slug}`);
  await db.insert(productImages).values([
    { productId: row.id, url: placeholder(p.slug, 1000, 1000), alt: p.title, position: 0 },
    { productId: row.id, url: placeholder(`${p.slug}-2`, 1000, 1000), alt: `${p.title} alternate`, position: 1 },
  ]);
}

console.log(`Seeded ${seedCategories.length} categories, ${seedProducts.length} products.`);
process.exit(0);
