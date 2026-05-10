import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'jp' | 'vn';

interface Translations {
  [key: string]: {
    jp: string;
    vn: string;
  };
}

const translations: Translations = {
  // Auth
  login: { jp: 'ログイン', vn: 'Đăng nhập' },
  register: { jp: '登録', vn: 'Đăng ký' },
  logout: { jp: 'ログアウト', vn: 'Đăng xuất' },
  email: { jp: 'メールアドレス', vn: 'Email' },
  emailOrPhone: { jp: 'メールアドレス/電話番号', vn: 'Email/Số điện thoại' },
  emailPlaceholder: { jp: 'abc@gmail.com または 0901234567', vn: 'abc@gmail.com hoặc 0901234567' },
  password: { jp: 'パスワード', vn: 'Mật khẩu' },
  confirmPassword: { jp: 'パスワードを確認', vn: 'Xác nhận mật khẩu' },
  forgotPassword: { jp: 'パスワードをお忘れですか？', vn: 'Quên mật khẩu?' },
  phoneNumber: { jp: '電話番号', vn: 'Số điện thoại' },
  sendOTP: { jp: 'OTPを送信', vn: 'Gửi mã OTP' },
  enterOTP: { jp: 'OTPコードを入力', vn: 'Nhập mã OTP' },
  verifyOTP: { jp: 'OTPを確認', vn: 'Xác nhận OTP' },
  newPassword: { jp: '新しいパスワード', vn: 'Mật khẩu mới' },
  resetPassword: { jp: 'パスワードをリセット', vn: 'Đặt lại mật khẩu' },
  submit: { jp: '送信', vn: 'Gửi' },
  cancel: { jp: 'キャンセル', vn: 'Hủy' },
  
  // Register
  fullName: { jp: '氏名', vn: 'Họ tên' },
  selectRole: { jp: '役割を選択', vn: 'Chọn vai trò' },
  iAmCustomer: { jp: '私は顧客です', vn: 'Tôi là khách' },
  iAmOwner: { jp: '私は店主です', vn: 'Tôi là chủ quán' },
  noAccount: { jp: 'アカウントをお持ちでないですか？', vn: 'Chưa có tài khoản?' },
  haveAccount: { jp: 'アカウントをお持ちですか？', vn: 'Đã có tài khoản?' },
  
  // Home
  search: { jp: '検索', vn: 'Tìm kiếm' },
  filter: { jp: 'フィルター', vn: 'Lọc' },
  promotions: { jp: '本日の特典', vn: 'Ưu đãi hôm nay' },
  cafes: { jp: '周辺のカフェ', vn: 'Quán cafe quanh bạn' },
  
  // Cafe Detail
  cafeDetails: { jp: 'カフェ詳細', vn: 'Chi tiết quán' },
  address: { jp: '住所', vn: 'Địa chỉ' },
  openingHours: { jp: '営業時間', vn: 'Giờ mở cửa' },
  contact: { jp: '連絡先', vn: 'Liên hệ' },
  status: { jp: 'ステータス', vn: 'Trạng thái' },
  openNow: { jp: '営業中', vn: 'Đang mở cửa' },
  closed: { jp: '閉店', vn: 'Đã đóng cửa' },
  crowded: { jp: '混雑', vn: 'Đông' },
  normal: { jp: '通常', vn: 'Bình thường' },
  quiet: { jp: '通常', vn: 'Bình thường' },
  menu: { jp: 'メニュー', vn: 'Menu' },
  bookTable: { jp: '予約する', vn: 'Đặt chỗ' },
  rating: { jp: '評価', vn: 'Đánh giá' },
  reviews: { jp: 'レビュー', vn: 'Đánh giá' },
  writeReview: { jp: 'レビューを書く', vn: 'Viết đánh giá' },
  promotion: { jp: '特典', vn: 'Ưu đãi' },
  
  // Amenities
  hasWifi: { jp: 'WiFiあり', vn: 'Có WiFi' },
  hasAC: { jp: 'エアコンあり', vn: 'Có điều hòa' },
  hasOutlet: { jp: 'コンセントあり', vn: 'Có ổ điện' },
  noSmoking: { jp: '禁煙', vn: 'Cấm thuốc lá' },
  hasSnacks: { jp: '軽食あり', vn: 'Có đồ ăn nhẹ' },
  hasCoffee: { jp: 'ハイテーブルあり', vn: 'Có bàn cao' },
  
  // Booking
  selectDate: { jp: '日付を選択', vn: 'Chọn ngày' },
  selectTime: { jp: '時間を選択', vn: 'Chọn giờ' },
  numberOfPeople: { jp: '人数', vn: 'Số người' },
  bookingSummary: { jp: '予約概要', vn: 'Tóm tắt đặt chỗ' },
  confirm: { jp: '確認', vn: 'Xác nhận' },
  
  // Review
  yourRating: { jp: 'あなたの評価', vn: 'Đánh giá của bạn' },
  comment: { jp: 'コメント', vn: 'Nhận xét' },
  uploadPhoto: { jp: '写真をアップロード', vn: 'Tải ảnh lên' },
  
  // Profile
  profile: { jp: 'プロフィール', vn: 'Hồ sơ' },
  role: { jp: '役割', vn: 'Vai trò' },
  customer: { jp: '顧客', vn: 'Khách hàng' },
  '1': { jp: '顧客', vn: 'Khách hàng' },
  '2': { jp: '店主', vn: 'Chủ quán' },
  '3': { jp: '管理者', vn: 'Quản tr viên' },
  '4': { jp: 'スタッフ', vn: 'Nhân viên' },
  saveChanges: { jp: '変更を保存', vn: 'Lưu thay đổi' },
  deleteAccount: { jp: 'アカウントを削除', vn: 'Xóa tài khoản' },
  
  // Notifications
  notifications: { jp: '通知', vn: 'Thông báo' },
  noNotifications: { jp: '通知はありません', vn: 'Không có thông báo' },
  bookingConfirmed: { jp: '予約が確認されました', vn: 'Đặt chỗ đã được xác nhận' },
  bookingRejected: { jp: '予約が拒否されました', vn: 'Đặt chỗ bị từ chối' },
  reviewDeleted: { jp: 'レビューが削除されました', vn: 'Đánh giá đã bị xóa' },
  
  // Filter
  applyFilter: { jp: 'フィルターを適用', vn: 'Áp dụng lọc' },
  clearFilter: { jp: 'フィルターをクリア', vn: 'Xóa bộ lọc' },
  
  // Common
  back: { jp: '戻る', vn: 'Quay lại' },
  save: { jp: '保存', vn: 'Lưu' },
  delete: { jp: '削除', vn: 'Xóa' },
  viewAll: { jp: 'すべて表示', vn: 'Xem tất cả' },
  all: { jp: 'すべて', vn: 'Tất cả' },
  recent: { jp: '最近', vn: 'Gần đây' },
  popular: { jp: '人気', vn: 'Phổ biến' },
  amenities: { jp: '設備', vn: 'Tiện nghi' },
  otherCafes: { jp: '他のカフェ', vn: 'Quán khác' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('jp'); // Default to JP for customers

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}