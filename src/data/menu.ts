export interface Dish {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  ingredients: string[];
  image: string;
  available: boolean;
  isVegetarian?: boolean;
  isPopular?: boolean;
  gallery?: string[];
}

export const categories = [
  { id: 'all', name: 'Tất cả', icon: '🍽️' },
  { id: 'appetizer', name: 'Khai vị', icon: '🥗' },
  { id: 'main', name: 'Món chính', icon: '🍖' },
  { id: 'seafood', name: 'Hải sản', icon: '🦞' },
  { id: 'vegetarian', name: 'Chay', icon: '🥬' },
  { id: 'dessert', name: 'Tráng miệng', icon: '🍰' },
  { id: 'beverage', name: 'Đồ uống', icon: '🥤' },
];

export const dishes: Dish[] = [
  {
    id: '1',
    name: 'Phở Bò Đặc Biệt',
    price: 85000,
    category: 'main',
    description: 'Phở bò truyền thống với nước dùng hầm xương 12 tiếng, thịt bò tươi ngon',
    ingredients: ['Bánh phở', 'Thịt bò', 'Hành tây', 'Ngò gai', 'Hành lá'],
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
    available: true,
    isPopular: true,
    gallery: [
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80',
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80',
    ]
  },
  {
    id: '2',
    name: 'Bún Chả Hà Nội',
    price: 75000,
    category: 'main',
    description: 'Bún chả truyền thống với thịt nướng than hoa thơm lừng',
    ingredients: ['Bún', 'Thịt nướng', 'Nước mắm pha', 'Rau sống', 'Dưa chua'],
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
    available: true,
    isPopular: true,
    gallery: [
      'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80',
    ]
  },
  {
    id: '3',
    name: 'Gỏi Cuốn Tôm Thịt',
    price: 45000,
    category: 'appetizer',
    description: 'Gỏi cuốn tươi mát với tôm, thịt và rau thơm',
    ingredients: ['Bánh tráng', 'Tôm', 'Thịt', 'Bún', 'Rau sống'],
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80',
    available: true,
    isVegetarian: false,
    gallery: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80',
    ]
  },
  {
    id: '4',
    name: 'Tôm Hùm Nướng Bơ',
    price: 450000,
    category: 'seafood',
    description: 'Tôm hùm tươi sống nướng bơ tỏi thơm ngon',
    ingredients: ['Tôm hùm', 'Bơ', 'Tỏi', 'Phô mai', 'Rau thơm'],
    image: 'https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=800&q=80',
    available: true,
    isPopular: true,
    gallery: [
      'https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=800&q=80',
      'https://images.unsplash.com/photo-1559737558-2f5a5b0e5e0a?w=800&q=80',
    ]
  },
  {
    id: '5',
    name: 'Cơm Chiên Dương Châu',
    price: 65000,
    category: 'main',
    description: 'Cơm chiên Dương Châu đầy đủ hải sản và thịt',
    ingredients: ['Cơm', 'Tôm', 'Xúc xích', 'Trứng', 'Hành tây'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
    available: true,
    gallery: [
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
    ]
  },
  {
    id: '6',
    name: 'Gà Nướng Mật Ong',
    price: 120000,
    category: 'main',
    description: 'Gà ta nướng mật ong thơm lừng, da giòn thịt mềm',
    ingredients: ['Gà ta', 'Mật ong', 'Sả', 'Tỏi', 'Ớt'],
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
    available: true,
    isPopular: true,
    gallery: [
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
    ]
  },
  {
    id: '7',
    name: 'Salad Rau Củ',
    price: 55000,
    category: 'vegetarian',
    description: 'Salad rau củ tươi với nước sốt chanh dây',
    ingredients: ['Xà lách', 'Cà chua', 'Dưa leo', 'Ngô', 'Hành tây'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    available: true,
    isVegetarian: true,
    gallery: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    ]
  },
  {
    id: '8',
    name: 'Bánh Flan Caramel',
    price: 35000,
    category: 'dessert',
    description: 'Bánh flan mềm mịn với caramel đậm đà',
    ingredients: ['Trứng', 'Sữa tươi', 'Đường', 'Vani'],
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
    available: true,
    gallery: [
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
    ]
  },
  {
    id: '9',
    name: 'Trà Đào Cam Sả',
    price: 45000,
    category: 'beverage',
    description: 'Trà trái cây tươi mát với đào, cam và sả',
    ingredients: ['Trà', 'Đào', 'Cam', 'Sả', 'Mật ong'],
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
    available: true,
    isPopular: true,
    gallery: [
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
    ]
  },
  {
    id: '10',
    name: 'Cá Hồi Áp Chảo',
    price: 180000,
    category: 'seafood',
    description: 'Cá hồi Na Uy áp chảo với sốt teriyaki',
    ingredients: ['Cá hồi', 'Sốt teriyaki', 'Măng tây', 'Khoai tây'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    available: true,
    gallery: [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    ]
  },
  {
    id: '11',
    name: 'Mì Ý Sốt Bò',
    price: 95000,
    category: 'main',
    description: 'Mì Ý spaghetti với sốt bò bằm cà chua',
    ingredients: ['Mì Ý', 'Thịt bò bằm', 'Cà chua', 'Phô mai', 'Húng quế'],
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    available: true,
    gallery: [
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    ]
  },
  {
    id: '12',
    name: 'Chè Thái',
    price: 40000,
    category: 'dessert',
    description: 'Chè Thái đầy đủ topping với nước cốt dừa',
    ingredients: ['Thạch', 'Nhãn', 'Vải', 'Nha đam', 'Nước cốt dừa'],
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
    available: true,
    gallery: [
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
    ]
  },
];
