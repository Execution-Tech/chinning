export const products = [
  {
    id: 1,
    name: "Samsung 58 Inch 4K UHD Smart LED TV",
    brand: { name: "Samsung" },
    category: { id: 1, name: "التلفزيونات" },
    price: 12000,
    sku: "SAM-TV-58-4K",

    description:
      "استمتع بوضوح 4K مع تلفزيون سامسونج الذكي 58 بوصة. يتضمن HDR وWi-Fi مدمج والوصول إلى تطبيقات البث المفضلة.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Samsung+TV",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Samsung+TV" },
      { url: "https://placehold.co/500x500/e8eeff/1B3A6B?text=Side+View" },
      { url: "https://placehold.co/500x500/dde8ff/1B3A6B?text=Back+View" },
    ],
    product_details: [
      { id: 1, name: "حجم الشاشة", value: "58 بوصة" },
      { id: 2, name: "الدقة", value: "4K UHD (3840 x 2160)" },
      { id: 3, name: "تلفزيون ذكي", value: "نعم" },
      { id: 4, name: "HDR", value: "نعم" },
    ],
    product_review: [
      { username: "أحمد م.", rating: 5, comment: "جودة صورة ممتازة!" },
      { username: "سارة ك.", rating: 4, comment: "قيمة رائعة مقابل السعر." },
    ],
  },
  {
    id: 2,
    name: "Apple iPhone 15 Pro Max 256GB",
    brand: { name: "Apple" },
    category: { id: 2, name: "الهواتف المحمولة" },
    price: 55000,
    sku: "APP-IP15PM-256",
    description:
      "أقوى iPhone على الإطلاق. يتميز بشريحة A17 Pro وتصميم التيتانيوم ونظام كاميرا 48 ميغابكسل.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=iPhone+15+Pro",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=iPhone+15+Pro" },
      { url: "https://placehold.co/500x500/e8eeff/1B3A6B?text=Side+View" },
    ],
    product_details: [
      { id: 1, name: "السعة التخزينية", value: "256GB" },
      { id: 2, name: "المعالج", value: "A17 Pro" },
      { id: 3, name: "الشاشة", value: "6.7 بوصة Super Retina XDR" },
      { id: 4, name: "الكاميرا", value: "48MP Triple Camera" },
    ],
    product_review: [
      {
        username: "عمر ر.",
        rating: 5,
        comment: "أفضل هاتف امتلكته على الإطلاق.",
      },
    ],
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: { name: "Sony" },
    category: { id: 5, name: "الصوتيات" },
    price: 8500,
    sku: "SONY-WH1000XM5",
    description:
      "سماعات رأس لاسلكية رائدة في إلغاء الضوضاء مع عمر بطارية 30 ساعة ومكالمات هاتفية واضحة.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Sony+Headphones",
    images: [
      {
        url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Sony+Headphones",
      },
    ],
    product_details: [
      { id: 1, name: "عمر البطارية", value: "30 ساعة" },
      { id: 2, name: "إلغاء الضوضاء", value: "نعم" },
      { id: 3, name: "الاتصال", value: "Bluetooth 5.2" },
    ],
    product_review: [],
  },
  {
    id: 4,
    name: "LG 65 Inch OLED C3 4K Smart TV",
    brand: { name: "LG" },
    category: { id: 1, name: "التلفزيونات" },
    price: 38000,
    sku: "LG-OLED65C3",
    description:
      "سواد مثالي وتباين لا نهائي مع تلفزيون OLED الرائد من LG. يتميز بمعالج α9 AI 4K Gen6 ودولبي فيجن.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=LG+OLED+TV",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=LG+OLED+TV" },
    ],
    product_details: [
      { id: 1, name: "حجم الشاشة", value: "65 بوصة" },
      { id: 2, name: "نوع اللوحة", value: "OLED" },
      { id: 3, name: "الدقة", value: "4K UHD" },
      { id: 4, name: "معدل التحديث", value: "120Hz" },
    ],
    product_review: [
      { username: "منى س.", rating: 5, comment: "جودة الصورة مذهلة." },
    ],
  },
  {
    id: 5,
    name: "Samsung Galaxy S24 Ultra 512GB",
    brand: { name: "Samsung" },
    category: { id: 2, name: "الهواتف المحمولة" },
    price: 42000,
    sku: "SAM-S24U-512",
    description:
      "تجربة Galaxy المثلى مع قلم S Pen مدمج وكاميرا 200 ميغابكسل ومعالج Snapdragon 8 Gen 3.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Galaxy+S24+Ultra",
    images: [
      {
        url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Galaxy+S24+Ultra",
      },
    ],
    product_details: [
      { id: 1, name: "السعة التخزينية", value: "512GB" },
      { id: 2, name: "الكاميرا", value: "200MP Quad Camera" },
      { id: 3, name: "الشاشة", value: "6.8 بوصة Dynamic AMOLED" },
      { id: 4, name: "S Pen", value: "مدمج" },
    ],
    product_review: [],
  },
  {
    id: 6,
    name: "Apple MacBook Pro 14 M3 Pro",
    brand: { name: "Apple" },
    category: { id: 3, name: "اللابتوبات" },
    price: 65000,
    sku: "APP-MBP14-M3PRO",
    description:
      "مدعوم بشريحة M3 Pro مع عمر بطارية يصل إلى 18 ساعة وشاشة Liquid Retina XDR مذهلة.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=MacBook+Pro+14",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=MacBook+Pro+14" },
    ],
    product_details: [
      { id: 1, name: "المعالج", value: "Apple M3 Pro" },
      { id: 2, name: "الذاكرة", value: "18GB" },
      { id: 3, name: "التخزين", value: "512GB SSD" },
      { id: 4, name: "الشاشة", value: "14.2 بوصة Liquid Retina XDR" },
    ],
    product_review: [],
  },
  {
    id: 7,
    name: "Sony PlayStation 5 Console",
    brand: { name: "Sony" },
    category: { id: 7, name: "الألعاب" },
    price: 18000,
    sku: "SONY-PS5",
    description:
      "استمتع بتحميل فائق السرعة بواسطة SSD عالي السرعة وغمر أعمق مع التغذية الراجعة اللمسية.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=PlayStation+5",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=PlayStation+5" },
    ],
    product_details: [
      { id: 1, name: "التخزين", value: "825GB SSD" },
      { id: 2, name: "الدقة", value: "حتى 8K" },
      { id: 3, name: "معدل الإطارات", value: "حتى 120fps" },
    ],
    product_review: [
      { username: "كريم أ.", rating: 5, comment: "تجربة ألعاب مذهلة!" },
    ],
  },
  {
    id: 8,
    name: "Xiaomi Pad 6 Pro 256GB",
    brand: { name: "Xiaomi" },
    category: { id: 4, name: "الأجهزة اللوحية" },
    price: 12500,
    sku: "XIA-PAD6PRO-256",
    description:
      "جهاز لوحي قوي مع Snapdragon 8+ Gen 1 وشاشة 144Hz وشحن سريع 67W للإنتاجية القصوى.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Xiaomi+Pad+6+Pro",
    images: [
      {
        url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Xiaomi+Pad+6+Pro",
      },
    ],
    product_details: [
      { id: 1, name: "التخزين", value: "256GB" },
      { id: 2, name: "الشاشة", value: "11 بوصة 144Hz" },
      { id: 3, name: "الشحن", value: "67W Fast Charge" },
    ],
    product_review: [],
  },
  {
    id: 9,
    name: "Canon EOS R50 Mirrorless Camera",
    brand: { name: "Canon" },
    category: { id: 6, name: "الكاميرات" },
    price: 28000,
    sku: "CAN-EOS-R50",
    description:
      "كاميرا بدون مرايا خفيفة الوزن مثالية للمبتدئين والمحترفين. تصوير 4K وتتبع الوجوه بالذكاء الاصطناعي.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Canon+EOS+R50",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Canon+EOS+R50" },
    ],
    product_details: [
      { id: 1, name: "المستشعر", value: "24.2 ميغابكسل APS-C" },
      { id: 2, name: "الفيديو", value: "4K 30fps" },
      { id: 3, name: "الاتصال", value: "Wi-Fi + Bluetooth" },
    ],
    product_review: [
      { username: "ليلى ف.", rating: 5, comment: "صور رائعة وسهلة الاستخدام." },
    ],
  },
  {
    id: 10,
    name: "JBL Charge 5 Portable Speaker",
    brand: { name: "JBL" },
    category: { id: 5, name: "الصوتيات" },
    price: 4200,
    sku: "JBL-CHARGE5",
    description:
      "مكبر صوت محمول مقاوم للماء مع بطارية 20 ساعة وإمكانية شحن الأجهزة الأخرى.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=JBL+Charge+5",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=JBL+Charge+5" },
    ],
    product_details: [
      { id: 1, name: "عمر البطارية", value: "20 ساعة" },
      { id: 2, name: "مقاومة الماء", value: "IP67" },
      { id: 3, name: "الاتصال", value: "Bluetooth 5.1" },
    ],
    product_review: [],
  },
  {
    id: 11,
    name: "Huawei MateBook D16 Laptop",
    brand: { name: "Huawei" },
    category: { id: 3, name: "اللابتوبات" },
    price: 22000,
    sku: "HUA-MBOOK-D16",
    description:
      "لابتوب بشاشة 16 بوصة Full HD مع معالج Intel Core i5 وبطارية تدوم 8 ساعات.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Huawei+MateBook",
    images: [
      {
        url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Huawei+MateBook",
      },
    ],
    product_details: [
      { id: 1, name: "المعالج", value: "Intel Core i5-12450H" },
      { id: 2, name: "الذاكرة", value: "16GB RAM" },
      { id: 3, name: "التخزين", value: "512GB SSD" },
      { id: 4, name: "الشاشة", value: "16 بوصة FHD IPS" },
    ],
    product_review: [
      { username: "يوسف ع.", rating: 4, comment: "لابتوب ممتاز للعمل اليومي." },
    ],
  },
  {
    id: 12,
    name: "Samsung Galaxy Tab S9 FE",
    brand: { name: "Samsung" },
    category: { id: 4, name: "الأجهزة اللوحية" },
    price: 9800,
    sku: "SAM-TABS9FE",
    description:
      "جهاز لوحي متعدد الاستخدامات مع شاشة 10.9 بوصة وقلم S Pen مدمج وبطارية 8000 mAh.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Galaxy+Tab+S9+FE",
    images: [
      {
        url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Galaxy+Tab+S9+FE",
      },
    ],
    product_details: [
      { id: 1, name: "الشاشة", value: "10.9 بوصة TFT" },
      { id: 2, name: "البطارية", value: "8000 mAh" },
      { id: 3, name: "S Pen", value: "مدمج" },
    ],
    product_review: [],
  },
  {
    id: 13,
    name: "Xbox Series S 512GB",
    brand: { name: "Microsoft" },
    category: { id: 7, name: "الألعاب" },
    price: 12000,
    sku: "XBX-SERIES-S",
    description:
      "جهاز الألعاب الأصغر والأذكى من Xbox مع دقة تصل إلى 1440p وتحميل فائق السرعة.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Xbox+Series+S",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Xbox+Series+S" },
    ],
    product_details: [
      { id: 1, name: "التخزين", value: "512GB NVMe SSD" },
      { id: 2, name: "الدقة", value: "حتى 1440p" },
      { id: 3, name: "معدل الإطارات", value: "حتى 120fps" },
    ],
    product_review: [
      { username: "طارق م.", rating: 4, comment: "سعر ممتاز لأداء رائع." },
    ],
  },
  {
    id: 14,
    name: "Apple AirPods Pro 2nd Gen",
    brand: { name: "Apple" },
    category: { id: 5, name: "الصوتيات" },
    price: 9500,
    sku: "APP-AIRPODS-PRO2",
    description:
      "سماعات لاسلكية مع إلغاء نشط للضوضاء وشفافية تكيفية وبطارية تدوم 30 ساعة مع الحافظة.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=AirPods+Pro+2",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=AirPods+Pro+2" },
    ],
    product_details: [
      { id: 1, name: "إلغاء الضوضاء", value: "نشط (ANC)" },
      { id: 2, name: "البطارية", value: "30 ساعة (مع الحافظة)" },
      { id: 3, name: "مقاومة الماء", value: "IPX4" },
    ],
    product_review: [
      { username: "نورة ح.", rating: 5, comment: "أفضل سماعات استخدمتها!" },
    ],
  },
  {
    id: 15,
    name: "Xiaomi Redmi Note 13 Pro 256GB",
    brand: { name: "Xiaomi" },
    category: { id: 2, name: "الهواتف المحمولة" },
    price: 7500,
    sku: "XIA-REDMI-N13PRO",
    description:
      "هاتف بكاميرا 200 ميغابكسل وشاشة AMOLED 120Hz وشحن سريع 67W بسعر منافس.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=Redmi+Note+13+Pro",
    images: [
      {
        url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=Redmi+Note+13+Pro",
      },
    ],
    product_details: [
      { id: 1, name: "الكاميرا", value: "200MP OIS" },
      { id: 2, name: "الشاشة", value: "6.67 بوصة AMOLED 120Hz" },
      { id: 3, name: "الشحن", value: "67W Fast Charge" },
      { id: 4, name: "التخزين", value: "256GB" },
    ],
    product_review: [],
  },
  {
    id: 16,
    name: "LG UltraGear 27GP850 Gaming Monitor",
    brand: { name: "LG" },
    category: { id: 8, name: "الإكسسوارات" },
    price: 14500,
    sku: "LG-27GP850",
    description:
      "شاشة ألعاب 27 بوصة بدقة QHD ومعدل تحديث 165Hz مع استجابة 1ms للتجربة التنافسية المثلى.",
    image: "https://placehold.co/300x200/EEF4FF/1B3A6B?text=LG+UltraGear",
    images: [
      { url: "https://placehold.co/500x500/EEF4FF/1B3A6B?text=LG+UltraGear" },
    ],
    product_details: [
      { id: 1, name: "حجم الشاشة", value: "27 بوصة" },
      { id: 2, name: "الدقة", value: "QHD 2560×1440" },
      { id: 3, name: "معدل التحديث", value: "165Hz" },
      { id: 4, name: "وقت الاستجابة", value: "1ms GtG" },
    ],
    product_review: [
      {
        username: "فهد ر.",
        rating: 5,
        comment: "شاشة مذهلة للألعاب التنافسية.",
      },
    ],
  },
];

export const topOffers = products.slice(0, 6);
export const topSelling = products.slice(8, 16);

export function getProductById(id: number | string) {
  return products.find((p) => p.id === Number(id)) ?? products[0];
}
