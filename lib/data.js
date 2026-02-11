export const categories = [
  {
    slug: "kunafa",
    title: "كنافة",
    description: "كنافة طازجة يوميًا.",
    image: "/Images/knafeh.jpg", // ✅ صورة القسم
  },
  {
    slug: "baklava",
    title: "بقلاوة",
    description: "بقلاوة مشكلة ومميزة.",
    image: "/Images/Bklava.jpg",
  },
  {
    slug: "jato",
    title: "جاتو",
    description: "جاتوه مشكله.",
    image: "/Images/jato.jpg",
  },
];

export const products = [
  {
    id: "k1",
    slug: "kunafa-nabulsiya", // ✅ مهم لصفحة المنتج لاحقًا
    categorySlug: "kunafa",
    name: "كنافة نابلسية",
    description: "جبنة نابلسية أصلية.",
    images: ["Images/knafeh.jpg", "/Images/knafeh.jpg", "/Images/knafeh.jpg"],
    featured: true, // ✅
    options: [
      { label: "نصف كيلو", price: 2.75 },
      { label: "كيلو", price: 5.5 },
    ],
  },
  {
    id: "b1",
    slug: "baklava-mix",
    categorySlug: "baklava",
    name: "بقلاوة مشكلة",
    description: "مزيج فاخر من الأصناف.",
    images: ["/Images/Bklava.jpg", "/Images/Bklava.jpg", "/Images/Bklava.jpg"],
    featured: true, // ✅
    options: [
      { label: "نصف كيلو", price: 8 },
      { label: "كيلو", price: 16 },
    ],
  },
  {
    id: "j1",
    slug: "jato-cake",
    categorySlug: "jato",
    name: "جاتو",
    description: "قوالب قاتو مشكله طازجة.",
    images: ["/Images/jato.jpg", "/Images/knafeh.jpg", "/Images/jato.jpg"],
    featured: true, // ✅
    options: [
      { label: "قالب كبير", price: 9 },
      { label: "قالب وسط", price: 7 },
      { label: "قالب صغير", price: 5 },
    ],
  },
];
