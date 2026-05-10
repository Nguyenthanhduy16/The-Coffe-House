export interface Cafe {
  id: string;
  name: string;
  nameJP: string;
  address: string;
  phone: string;
  openingHours: {
    day: string;
    hours: string;
  }[];
  isOpen: boolean;
  status: 'normal' | 'crowded';
  amenities: {
    hasWifi: boolean;
    hasAC: boolean;
    hasOutlet: boolean;
    noSmoking: boolean;
    hasSnacks: boolean;
    hasCoffee: boolean;
  };
  menu: MenuItem[];
  rating: number;
  reviewCount: number;
  images: string[];
  lat: number;
  lng: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nameJP: string;
  price: number;
  category: string;
  image?: string;
}

export interface Promotion {
  id: string;
  cafeId: string;
  title: string;
  titleJP: string;
  description: string;
  descriptionJP: string;
  image: string;
  validUntil: string;
}

export interface Staff {
  id: string;
  cafeId: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  position: string;
  positionJP: string;
  joinedDate: string;
}

export interface Booking {
  id: string;
  userId: string;
  cafeId: string;
  date: string;
  time: string;
  numberOfPeople: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  cafeId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  userName: string;
  userAvatar?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_confirmed' | 'booking_rejected' | 'review_deleted';
  message: string;
  messageJP: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

// Mock Cafes Data
export const mockCafes: Cafe[] = [
  {
    id: '1',
    name: 'The Coffee House Tràng Tiền',
    nameJP: 'ザ・コーヒーハウス チャンティエン店',
    address: '26 Tràng Tiền, Hoàn Kiếm, Hà Nội',
    phone: '024 3825 7711',
    openingHours: [
      { day: 'Mon-Sun', hours: '07:00 - 23:00' }
    ],
    isOpen: true,
    status: 'normal',
    amenities: {
      hasWifi: true,
      hasAC: true,
      hasOutlet: true,
      noSmoking: true,
      hasSnacks: true,
      hasCoffee: true,
    },
    menu: [
      { id: '1', name: 'Espresso', nameJP: 'エスプレッソ', price: 35000, category: 'Coffee' },
      { id: '2', name: 'Cappuccino', nameJP: 'カプチーノ', price: 45000, category: 'Coffee' },
      { id: '3', name: 'Latte', nameJP: 'ラテ', price: 45000, category: 'Coffee' },
      { id: '4', name: 'Vietnamese Coffee', nameJP: 'ベトナムコーヒー', price: 35000, category: 'Coffee' },
      { id: '5', name: 'Matcha Latte', nameJP: '抹茶ラテ', price: 50000, category: 'Tea' },
    ],
    rating: 4.5,
    reviewCount: 128,
    images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24'],
    lat: 21.0245,
    lng: 105.8412,
  },
  {
    id: '2',
    name: 'Highlands Coffee Hai Bà Trưng',
    nameJP: 'ハイランズコーヒー ハイバーチュン店',
    address: '2 Hai Bà Trưng, Hoàn Kiếm, Hà Nội',
    phone: '024 3934 8835',
    openingHours: [
      { day: 'Mon-Sun', hours: '06:30 - 22:30' }
    ],
    isOpen: true,
    status: 'crowded',
    amenities: {
      hasWifi: true,
      hasAC: true,
      hasOutlet: true,
      noSmoking: true,
      hasSnacks: true,
      hasCoffee: false,
    },
    menu: [
      { id: '1', name: 'Phin Coffee', nameJP: 'フィンコーヒー', price: 39000, category: 'Coffee' },
      { id: '2', name: 'Freeze Coffee', nameJP: 'フリーズコーヒー', price: 55000, category: 'Coffee' },
      { id: '3', name: 'Caramel Macchiato', nameJP: 'キャラメルマキアート', price: 59000, category: 'Coffee' },
    ],
    rating: 4.3,
    reviewCount: 256,
    images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb'],
    lat: 21.0232,
    lng: 105.8519,
  },
  {
    id: '3',
    name: 'Cộng Cà Phê Đinh Tiên Hoàng',
    nameJP: 'コンカフェ ディンティエンホアン店',
    address: '50 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội',
    phone: '024 3826 7755',
    openingHours: [
      { day: 'Mon-Sun', hours: '07:00 - 23:00' }
    ],
    isOpen: true,
    status: 'normal',
    amenities: {
      hasWifi: true,
      hasAC: true,
      hasOutlet: true,
      noSmoking: false,
      hasSnacks: true,
      hasCoffee: true,
    },
    menu: [
      { id: '1', name: 'Coconut Coffee', nameJP: 'ココナッツコーヒー', price: 39000, category: 'Coffee' },
      { id: '2', name: 'Yogurt Coffee', nameJP: 'ヨーグルトコーヒー', price: 35000, category: 'Coffee' },
      { id: '3', name: 'Traditional Lemon Tea', nameJP: '伝統的なレモンティー', price: 29000, category: 'Tea' },
    ],
    rating: 4.7,
    reviewCount: 189,
    images: ['https://images.unsplash.com/photo-1511920170033-f8396924c348'],
    lat: 21.0288,
    lng: 105.8516,
  },
];

// Mock Promotions Data
export const mockPromotions: Promotion[] = [
  {
    id: '1',
    cafeId: '1',
    title: 'Buy 1 Get 1 Free - All Drinks',
    titleJP: '全ドリンク1杯購入で1杯無料',
    description: 'Valid until the end of this month',
    descriptionJP: '今月末まで有効',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    validUntil: '2026-04-30',
  },
  {
    id: '2',
    cafeId: '2',
    title: '20% Off for Students',
    titleJP: '学生20%オフ',
    description: 'Show your student ID',
    descriptionJP: '学生証を提示してください',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
    validUntil: '2026-04-15',
  },
  {
    id: '3',
    cafeId: '3',
    title: 'Happy Hour 15:00-17:00',
    titleJP: 'ハッピーアワー 15:00-17:00',
    description: '30% discount on all beverages',
    descriptionJP: '全ドリンク30%オフ',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    validUntil: '2026-05-01',
  },
];

// Mock Staff Data
export function getStaff(): Staff[] {
  const staffJson = localStorage.getItem('staff');
  if (staffJson) {
    return JSON.parse(staffJson);
  }

  // Initialize with mock staff data (2 for each cafe)
  const mockStaff: Staff[] = [
    {
      id: 'staff1',
      cafeId: '1',
      name: 'Trần Văn Bình',
      email: 'binh@cafe1.com',
      phone: '0901234567',
      position: 'Quản lý',
      positionJP: 'マネージャー',
      avatar: 'https://i.pravatar.cc/150?img=12',
      joinedDate: '2024-01-15',
    },
    {
      id: 'staff2',
      cafeId: '1',
      name: 'Nguyễn Thị Lan',
      email: 'lan@cafe1.com',
      phone: '0901234568',
      position: 'Barista',
      positionJP: 'バリスタ',
      avatar: 'https://i.pravatar.cc/150?img=47',
      joinedDate: '2024-02-01',
    },
    {
      id: 'staff3',
      cafeId: '2',
      name: 'Lê Minh Tuấn',
      email: 'tuan@cafe2.com',
      phone: '0901234569',
      position: 'Barista',
      positionJP: 'バリスタ',
      avatar: 'https://i.pravatar.cc/150?img=33',
      joinedDate: '2024-01-20',
    },
    {
      id: 'staff4',
      cafeId: '2',
      name: 'Phạm Thu Hà',
      email: 'ha@cafe2.com',
      phone: '0901234570',
      position: 'Thu ngân',
      positionJP: 'レジ係',
      avatar: 'https://i.pravatar.cc/150?img=45',
      joinedDate: '2024-02-10',
    },
    {
      id: 'staff5',
      cafeId: '3',
      name: 'Hoàng Văn Nam',
      email: 'nam@cafe3.com',
      phone: '0901234571',
      position: 'Quản lý',
      positionJP: 'マネージャー',
      avatar: 'https://i.pravatar.cc/150?img=15',
      joinedDate: '2024-01-05',
    },
    {
      id: 'staff6',
      cafeId: '3',
      name: 'Đỗ Thị Mai',
      email: 'mai@cafe3.com',
      phone: '0901234572',
      position: 'Phục vụ',
      positionJP: 'サーバー',
      avatar: 'https://i.pravatar.cc/150?img=48',
      joinedDate: '2024-02-15',
    },
  ];

  localStorage.setItem('staff', JSON.stringify(mockStaff));
  return mockStaff;
}

// Mock auto-translation (simulating Google Translate API)
// In real app, this would call Google Translate API
export function autoTranslate(text: string, fromLang: 'vn' | 'jp', toLang: 'vn' | 'jp'): string {
  // Mock translations for common promotion phrases
  const mockTranslations: Record<string, Record<string, string>> = {
    // Vietnamese to Japanese
    'vn->jp': {
      'Giảm 20% tất cả đồ uống': '全ドリンク20%オフ',
      'Mua 1 tặng 1': '1つ買うと1つ無料',
      'Giảm giá cuối tuần': '週末特別セール',
      'Khuyến mãi đặc biệt': '特別プロモーション',
      'Chương trình khuyến mãi đặc biệt dành cho khách hàng thân thiết': 'ロイヤルカスタマー向けの特別プロモーションプログラム',
      'Áp dụng cho tất cả đồ uống trong menu': 'メニュー内のすべてのドリンクに適用',
    },
    // Japanese to Vietnamese
    'jp->vn': {
      '全ドリンク20%オフ': 'Giảm 20% tất cả đồ uống',
      '1つ買うと1つ無料': 'Mua 1 tặng 1',
      '週末特別セール': 'Giảm giá cuối tuần',
      '特別プロモーション': 'Khuyến mãi đặc biệt',
      'ロイヤルカスタマー向けの特別プロモーションプログラム': 'Chương trình khuyến mãi đặc biệt dành cho khách hàng thân thiết',
      'メニュー内のすべてのドリンクに適用': 'Áp dụng cho tất cả đồ uống trong menu',
    },
  };

  const key = `${fromLang}->${toLang}`;
  const translation = mockTranslations[key]?.[text];
  
  if (translation) {
    return translation;
  }
  
  // If no exact match, return a generic translated version
  if (fromLang === 'vn' && toLang === 'jp') {
    return `【${text}】`; // Wrapped in Japanese brackets
  } else {
    return `[${text}]`; // Wrapped in regular brackets
  }
}

// Initialize mock data in localStorage
export function initializeMockData() {
  if (!localStorage.getItem('cafes')) {
    localStorage.setItem('cafes', JSON.stringify(mockCafes));
  }
  if (!localStorage.getItem('promotions')) {
    localStorage.setItem('promotions', JSON.stringify(mockPromotions));
  }
  if (!localStorage.getItem('staff')) {
    // Initialize staff using getStaff() which handles the data
    getStaff();
  }
  
  // Initialize bookings
  const existingBookings = localStorage.getItem('bookings');
  if (!existingBookings) {
    const initialBookings: Booking[] = [
      {
        id: '1',
        userId: '1',
        cafeId: '1',
        date: '2026-04-05',
        time: '14:00',
        numberOfPeople: 2,
        status: 'pending',
        createdAt: '2026-04-03T08:30:00Z',
      },
      {
        id: '2',
        userId: '2',
        cafeId: '1',
        date: '2026-04-05',
        time: '16:30',
        numberOfPeople: 4,
        status: 'pending',
        createdAt: '2026-04-03T09:15:00Z',
      },
      {
        id: '3',
        userId: '3',
        cafeId: '1',
        date: '2026-04-04',
        time: '10:00',
        numberOfPeople: 1,
        status: 'pending',
        createdAt: '2026-04-03T10:00:00Z',
      },
      {
        id: '4',
        userId: '1',
        cafeId: '1',
        date: '2026-04-06',
        time: '18:00',
        numberOfPeople: 6,
        status: 'confirmed',
        createdAt: '2026-04-02T14:20:00Z',
      },
      {
        id: '5',
        userId: '2',
        cafeId: '1',
        date: '2026-04-04',
        time: '20:00',
        numberOfPeople: 3,
        status: 'rejected',
        createdAt: '2026-04-02T16:45:00Z',
      },
      {
        id: '6',
        userId: '3',
        cafeId: '2',
        date: '2026-04-05',
        time: '15:00',
        numberOfPeople: 2,
        status: 'pending',
        createdAt: '2026-04-03T11:00:00Z',
      },
    ];
    localStorage.setItem('bookings', JSON.stringify(initialBookings));
  } else {
    // Update existing bookings if they're empty or old format
    const bookings = JSON.parse(existingBookings);
    if (bookings.length === 0) {
      const initialBookings: Booking[] = [
        {
          id: '1',
          userId: '1',
          cafeId: '1',
          date: '2026-04-05',
          time: '14:00',
          numberOfPeople: 2,
          status: 'pending',
          createdAt: '2026-04-03T08:30:00Z',
        },
        {
          id: '2',
          userId: '2',
          cafeId: '1',
          date: '2026-04-05',
          time: '16:30',
          numberOfPeople: 4,
          status: 'pending',
          createdAt: '2026-04-03T09:15:00Z',
        },
        {
          id: '3',
          userId: '3',
          cafeId: '1',
          date: '2026-04-04',
          time: '10:00',
          numberOfPeople: 1,
          status: 'pending',
          createdAt: '2026-04-03T10:00:00Z',
        },
        {
          id: '4',
          userId: '1',
          cafeId: '1',
          date: '2026-04-06',
          time: '18:00',
          numberOfPeople: 6,
          status: 'confirmed',
          createdAt: '2026-04-02T14:20:00Z',
        },
        {
          id: '5',
          userId: '2',
          cafeId: '1',
          date: '2026-04-04',
          time: '20:00',
          numberOfPeople: 3,
          status: 'rejected',
          createdAt: '2026-04-02T16:45:00Z',
        },
        {
          id: '6',
          userId: '3',
          cafeId: '2',
          date: '2026-04-05',
          time: '15:00',
          numberOfPeople: 2,
          status: 'pending',
          createdAt: '2026-04-03T11:00:00Z',
        },
      ];
      localStorage.setItem('bookings', JSON.stringify(initialBookings));
    }
  }
  
  if (!localStorage.getItem('cafeOwners')) {
    // Map cafes to owner (user id '2' is the owner@test.com)
    const cafeOwners: Record<string, string> = {
      '1': '2', // Coffee House Tràng Tiền belongs to owner@test.com
      '2': '2', // Highlands Coffee belongs to owner@test.com
      '3': '2', // Cộng Cà Phê belongs to owner@test.com
    };
    localStorage.setItem('cafeOwners', JSON.stringify(cafeOwners));
  }
  if (!localStorage.getItem('reviews')) {
    // Initialize reviews
    const initialReviews = [
      {
        id: '1',
        userId: '1',
        cafeId: '1',
        rating: 5,
        comment: 'とても落ち着いた雰囲気で、コーヒーも美味しいです！',
        createdAt: '2026-03-28T10:30:00Z',
        userName: '田中太郎',
        userAvatar: 'https://i.pravatar.cc/150?img=12',
      },
      {
        id: '2',
        userId: '2',
        cafeId: '1',
        rating: 4,
        comment: 'スタッフがとても親切でした。また来たいです。',
        createdAt: '2026-03-27T14:20:00Z',
        userName: '佐藤花子',
      },
      {
        id: '3',
        userId: '3',
        cafeId: '1',
        rating: 5,
        comment: 'Wi-Fiが速くて仕事が捗ります。',
        createdAt: '2026-03-26T09:15:00Z',
        userName: '鈴木一郎',
        images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085'],
      },
      {
        id: '4',
        userId: '1',
        cafeId: '1',
        rating: 3,
        comment: '場所は良いが、価格が高めです。味は普通でした。',
        createdAt: '2026-03-25T16:45:00Z',
        userName: '山田次郎',
      },
      {
        id: '5',
        userId: '2',
        cafeId: '1',
        rating: 1,
        comment: 'サービが最悪でした。店員の態度が悪い。二度と行きません。絶対におすすめしません！',
        createdAt: '2026-03-24T11:20:00Z',
        userName: '匿名ユーザー',
      },
      {
        id: '6',
        userId: '3',
        cafeId: '1',
        rating: 5,
        comment: '雰囲気抜群！写真映えするインテリア素敵です。',
        createdAt: '2026-03-23T15:30:00Z',
        userName: '高橋美咲',
        images: ['https://images.unsplash.com/photo-1442512595331-e89e73853f31', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb'],
      },
      {
        id: '7',
        userId: '1',
        cafeId: '1',
        rating: 2,
        comment: 'うるさすぎて集中できない。コーヒーの味も微妙。他の店の方が100倍良いです。',
        createdAt: '2026-03-22T13:10:00Z',
        userName: '競合店オーナー',
      },
      {
        id: '8',
        userId: '1',
        cafeId: '2',
        rating: 4,
        comment: 'スタッフがフレンドリーで、場所も便利です。',
        createdAt: '2026-03-25T14:20:00Z',
        userName: '田中太郎',
      },
      {
        id: '9',
        userId: '2',
        cafeId: '2',
        rating: 5,
        comment: 'チェーン店だけど品質が安定していて良いです。',
        createdAt: '2026-03-27T13:10:00Z',
        userName: '佐藤花子',
      },
      {
        id: '10',
        userId: '3',
        cafeId: '3',
        rating: 5,
        comment: 'ココナッツコーヒーが絶品！ベトナムの雰囲気も楽しめます。',
        createdAt: '2026-03-26T12:30:00Z',
        userName: '鈴木一郎',
        images: ['https://images.unsplash.com/photo-1517487881594-2787fef5ebf7'],
      },
    ];
    localStorage.setItem('reviews', JSON.stringify(initialReviews));
  }
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }
}

// Get data from localStorage
export function getCafes(): Cafe[] {
  const data = localStorage.getItem('cafes');
  return data ? JSON.parse(data) : mockCafes;
}

export function getPromotions(): Promotion[] {
  initializeMockData();
  const promotionsJson = localStorage.getItem('promotions');
  return promotionsJson ? JSON.parse(promotionsJson) : [];
}

export function getBookings(): Booking[] {
  initializeMockData();
  const bookingsJson = localStorage.getItem('bookings');
  return bookingsJson ? JSON.parse(bookingsJson) : [];
}

export function getReviews(): Review[] {
  const data = localStorage.getItem('reviews');
  return data ? JSON.parse(data) : [];
}

export function getNotifications(): Notification[] {
  const data = localStorage.getItem('notifications');
  return data ? JSON.parse(data) : [];
}

export function markNotificationAsRead(notificationId: string) {
  const notifications = getNotifications();
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  localStorage.setItem('notifications', JSON.stringify(updated));
}

export function saveBooking(booking: Booking) {
  const bookings = getBookings();
  localStorage.setItem('bookings', JSON.stringify([...bookings, booking]));
}

export function saveNotification(notification: Notification) {
  const notifications = getNotifications();
  localStorage.setItem('notifications', JSON.stringify([...notifications, notification]));
}

export function saveReview(review: Review) {
  const reviews = getReviews();
  localStorage.setItem('reviews', JSON.stringify([...reviews, review]));
}