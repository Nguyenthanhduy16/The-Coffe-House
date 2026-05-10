import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getCafes, getReviews, getBookings, getPromotions, getStaff, type Cafe, type Review, type Booking, type Promotion, type Staff } from '../utils/mockData';
import { Button } from '../components/ui/button';
import { ArrowLeft, MapPin, Phone, Clock, Star, MessageSquare, Calendar, Tag, Users, Info, Wifi, Wind, Plug, Cigarette, Cookie, Edit, Coffee, AlertCircle, Flag, Plus, Trash2, Eye, Mail, Briefcase, Armchair } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { LanguageToggle } from '../components/LanguageToggle';
import { EditCafeDialog } from '../components/EditCafeDialog';
import { ReportReviewDialog } from '../components/ReportReviewDialog';
import { AddPromotionDialog } from '../components/AddPromotionDialog';
import { PromotionDetailDialog } from '../components/PromotionDetailDialog';
import { StaffDetailDialog } from '../components/StaffDetailDialog';
import { AddStaffDialog } from '../components/AddStaffDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';

export default function OwnerCafeDetailPage() {
  const { id } = useParams();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showAddPromotionDialog, setShowAddPromotionDialog] = useState(false);
  const [showPromotionDetailDialog, setShowPromotionDetailDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showStaffDetailDialog, setShowStaffDetailDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showDeleteRequestDialog, setShowDeleteRequestDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteSubmitted, setDeleteSubmitted] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    // Load cafe
    const allCafes = getCafes();
    const foundCafe = allCafes.find(c => c.id === id);
    
    if (!foundCafe) {
      navigate('/owner');
      return;
    }

    // Check ownership
    const cafeOwnersJson = localStorage.getItem('cafeOwners');
    if (cafeOwnersJson) {
      const cafeOwners = JSON.parse(cafeOwnersJson);
      if (cafeOwners[id] !== user?.id) {
        navigate('/owner');
        return;
      }
    }

    setCafe(foundCafe);

    // Load reviews for this cafe
    const allReviews = getReviews();
    setReviews(allReviews.filter(r => r.cafeId === id));

    // Load bookings for this cafe - force reinitialize if needed
    const allBookings = getBookings();
    const cafeBookings = allBookings.filter(b => b.cafeId === id);
    console.log('All bookings:', allBookings);
    console.log('Cafe bookings for cafe', id, ':', cafeBookings);
    setBookings(cafeBookings);

    // Load promotions for this cafe
    const allPromotions = getPromotions();
    const cafePromotions = allPromotions.filter(p => p.cafeId === id);
    console.log('All promotions:', allPromotions);
    console.log('Cafe promotions for cafe', id, ':', cafePromotions);
    setPromotions(cafePromotions);

    // Load staff for this cafe
    const allStaff = getStaff();
    const cafeStaff = allStaff.filter(s => s.cafeId === id);
    console.log('All staff:', allStaff);
    console.log('Cafe staff for cafe', id, ':', cafeStaff);
    setStaff(cafeStaff);
  }, [id, user, navigate]);

  // Calculate pending bookings count
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  if (!cafe) {
    return null;
  }

  const handleClose = () => {
    navigate('/owner');
  };

  const handleEditCafe = (cafeData: {
    name: string;
    nameJP: string;
    address: string;
    phone: string;
    coverImage: string;
    amenities: {
      hasWifi: boolean;
      hasAC: boolean;
      hasOutlet: boolean;
      noSmoking: boolean;
      hasSnacks: boolean;
      hasCoffee: boolean;
    };
  }) => {
    if (!id) return;

    // Update cafe in localStorage
    const cafesJson = localStorage.getItem('cafes');
    const cafes = cafesJson ? JSON.parse(cafesJson) : [];
    const updatedCafes = cafes.map((c: Cafe) => {
      if (c.id === id) {
        return {
          ...c,
          name: cafeData.name,
          nameJP: cafeData.nameJP,
          address: cafeData.address,
          phone: cafeData.phone,
          images: [cafeData.coverImage, ...c.images.slice(1)],
          amenities: cafeData.amenities,
        };
      }
      return c;
    });

    localStorage.setItem('cafes', JSON.stringify(updatedCafes));
    
    // Update local state
    const updatedCafe = updatedCafes.find((c: Cafe) => c.id === id);
    if (updatedCafe) {
      setCafe(updatedCafe);
    }
    
    setShowEditDialog(false);
  };

  const handleToggleCrowded = () => {
    if (!id) return;

    const newStatus = cafe.status === 'crowded' ? 'normal' : 'crowded';

    // Update cafe status in localStorage
    const cafesJson = localStorage.getItem('cafes');
    const cafes = cafesJson ? JSON.parse(cafesJson) : [];
    const updatedCafes = cafes.map((c: Cafe) => {
      if (c.id === id) {
        return { ...c, status: newStatus };
      }
      return c;
    });

    localStorage.setItem('cafes', JSON.stringify(updatedCafes));
    
    // Update local state
    setCafe({ ...cafe, status: newStatus });
  };

  const handleBookingAction = (bookingId: string, action: 'confirmed' | 'rejected') => {
    // Update booking status in localStorage
    const bookingsJson = localStorage.getItem('bookings');
    const allBookings = bookingsJson ? JSON.parse(bookingsJson) : [];
    const updatedBookings = allBookings.map((b: Booking) => {
      if (b.id === bookingId) {
        return { ...b, status: action };
      }
      return b;
    });

    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    
    // Update local state
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: action } : b));

    // TODO: Create notification for the customer
    // This would be implemented when we add the notification system
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getBookingStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return language === 'jp' ? '確認済み' : 'Đã xác nhận';
      case 'pending':
        return language === 'jp' ? '保留中' : 'Đang chờ';
      case 'rejected':
        return language === 'jp' ? '拒否' : 'Đã từ chối';
      case 'completed':
        return language === 'jp' ? '完了' : 'Hoàn tất';
      default:
        return status;
    }
  };

  const handleSubmitDeleteRequest = () => {
    if (!deleteReason.trim() || !id || !cafe) return;

    const reportsJson = localStorage.getItem('reports');
    const allReports = reportsJson ? JSON.parse(reportsJson) : [];
    const newReport = {
      id: `rep-${Date.now()}`,
      type: 'cafe_delete',
      status: 'active',
      title: `Yêu cầu xóa quán: ${cafe.name}`,
      titleJP: `カフェ削除依頼：${cafe.nameJP}`,
      description: deleteReason,
      descriptionJP: deleteReason,
      cafeName: cafe.name,
      cafeNameJP: cafe.nameJP,
      reporterName: user?.name || user?.email || 'Chủ quán',
      targetInfo: `${cafe.name} — ID #${id}`,
      targetInfoJP: `${cafe.nameJP} — ID #${id}`,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('reports', JSON.stringify([...allReports, newReport]));
    setDeleteSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Coffee className="size-6 text-amber-700" />
              <h1 className="font-bold">どこカフェ</h1>
            </div>
          </div>
          
          <LanguageToggle />
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-80">
        <img
          src={cafe.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'}
          alt={cafe.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6">
        {/* Cafe Info Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {language === 'jp' ? cafe.nameJP : cafe.name}
          </h1>
          <div className="flex items-center gap-1 mb-4">
            <Star className="size-5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{cafe.rating}</span>
            <span className="text-gray-500">({cafe.reviewCount} {language === 'jp' ? '件' : 'đánh giá'})</span>
          </div>

          <div className="space-y-2 text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="size-5 mt-0.5 text-gray-400" />
              <span>{cafe.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-5 text-gray-400" />
              <span>{cafe.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-gray-400" />
              <span>{cafe.openingHours?.[0]?.hours || '07:00 - 22:00'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="info">
              <Info className="size-4 mr-2" />
              {language === 'jp' ? '情報' : 'Thông tin'}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <MessageSquare className="size-4 mr-2" />
              {language === 'jp' ? 'レビュー' : 'Đánh giá'}
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="size-4 mr-2" />
              {language === 'jp' ? '予約' : 'Đặt chỗ'}
              {pendingBookingsCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                  {pendingBookingsCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="promotions">
              <Tag className="size-4 mr-2" />
              {language === 'jp' ? 'プロモ' : 'Khuyến mãi'}
            </TabsTrigger>
            <TabsTrigger value="staff">
              <Users className="size-4 mr-2" />
              {language === 'jp' ? 'スタッフ' : 'Nhân viên'}
            </TabsTrigger>
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {language === 'jp' ? '基本情報' : 'Thông tin cơ bản'}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant={cafe.status === 'crowded' ? 'destructive' : 'outline'}
                    size="sm" 
                    onClick={handleToggleCrowded}
                  >
                    <AlertCircle className="size-4 mr-2" />
                    {cafe.status === 'crowded'
                      ? (language === 'jp' ? '通常に戻す' : 'Trở về bình thường')
                      : (language === 'jp' ? '満席' : 'Đã kín chỗ')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
                    <Edit className="size-4 mr-2" />
                    {language === 'jp' ? '編集' : 'Chỉnh sửa'}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Names */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {language === 'jp' ? '店名（ベトナム語）' : 'Tên quán (Tiếng Việt)'}
                  </div>
                  <div className="text-gray-900">{cafe.name}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {language === 'jp' ? '店名（日本語）' : 'Tên quán (Tiếng Nhật)'}
                  </div>
                  <div className="text-gray-900">{cafe.nameJP}</div>
                </div>

                {/* Address */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {language === 'jp' ? '住所' : 'Địa chỉ'}
                  </div>
                  <div className="flex items-start gap-2 text-gray-900">
                    <MapPin className="size-4 mt-0.5 text-gray-400" />
                    <span>{cafe.address}</span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {language === 'jp' ? '電話番号' : 'Số điện thoại'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Phone className="size-4 text-gray-400" />
                    <span>{cafe.phone}</span>
                  </div>
                </div>

                {/* Opening Hours */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {language === 'jp' ? '営業時間' : 'Giờ mở cửa'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Clock className="size-4 text-gray-400" />
                    <span>{cafe.openingHours?.[0]?.hours || '07:00 - 22:00'}</span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'jp' ? 'ステータス' : 'Trạng thái'}
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      cafe.isOpen 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {cafe.isOpen 
                        ? (language === 'jp' ? '営業中' : 'Đang mở') 
                        : (language === 'jp' ? '閉店' : 'Đã đóng')}
                    </span>
                    
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      cafe.status === 'crowded' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {cafe.status === 'crowded' 
                        ? (language === 'jp' ? '混雑' : 'Đông') 
                        : (language === 'jp' ? '通常' : 'Bình thường')}
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    {language === 'jp' ? '設備' : 'Tiện nghi'}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`flex items-center gap-2 ${cafe.amenities.hasWifi ? 'text-green-700' : 'text-gray-400'}`}>
                      <Wifi className="size-4" />
                      <span className="text-sm">
                        {language === 'jp' ? 'Wi-Fi' : 'Wi-Fi'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${cafe.amenities.hasAC ? 'text-green-700' : 'text-gray-400'}`}>
                      <Wind className="size-4" />
                      <span className="text-sm">
                        {language === 'jp' ? 'エアコン' : 'Điều hòa'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${cafe.amenities.hasOutlet ? 'text-green-700' : 'text-gray-400'}`}>
                      <Plug className="size-4" />
                      <span className="text-sm">
                        {language === 'jp' ? '電源' : 'Ổ cắm'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${cafe.amenities.noSmoking ? 'text-red-600' : 'text-gray-400'}`}>
                      <Cigarette className={`size-4 ${cafe.amenities.noSmoking ? 'line-through' : ''}`} />
                      <span className="text-sm">
                        {language === 'jp' ? '禁煙' : 'Không hút thuốc'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${cafe.amenities.hasSnacks ? 'text-green-700' : 'text-gray-400'}`}>
                      <Cookie className="size-4" />
                      <span className="text-sm">
                        {language === 'jp' ? 'スナック' : 'Đồ ăn nhẹ'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${cafe.amenities.hasCoffee ? 'text-green-700' : 'text-gray-400'}`}>
                      <Armchair className="size-4" />
                      <span className="text-sm">
                        {language === 'jp' ? 'ハイテーブル' : 'Bàn cao'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Request Button — bottom right */}
                <div className="flex justify-end pt-4 border-t mt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => { setShowDeleteRequestDialog(true); setDeleteSubmitted(false); setDeleteReason(''); }}
                  >
                    <Trash2 className="size-4 mr-2" />
                    {language === 'jp' ? 'カフェ削除申請' : 'Yêu cầu xóa quán'}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4 mt-6">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="size-12 mx-auto mb-2 text-gray-300" />
                <p>{language === 'jp' ? 'まだレビューがありません' : 'Chưa có đánh giá nào'}</p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{review.userName}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.createdAt}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt=""
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setShowReportDialog(true);
                      }}
                    >
                      <Flag className="size-4 mr-2" />
                      {language === 'jp' ? '通報' : 'Khiếu nại'}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4 mt-6">
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="size-12 mx-auto mb-2 text-gray-300" />
                <p>{language === 'jp' ? 'まだ予約がありません' : 'Chưa có đặt chỗ nào'}</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium mb-1">
                        {language === 'jp' ? `ユーザー ${booking.userId}` : `Khách hàng #${booking.userId}`}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-gray-400" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="size-4 text-gray-400" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="size-4 text-gray-400" />
                          <span>{booking.numberOfPeople} {language === 'jp' ? '席' : 'người'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.status)}`}>
                        {getBookingStatusText(booking.status)}
                      </span>
                      
                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleBookingAction(booking.id, 'confirmed')}
                          >
                            {language === 'jp' ? '承認' : 'Chấp nhận'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleBookingAction(booking.id, 'rejected')}
                          >
                            {language === 'jp' ? '拒否' : 'Từ chối'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {language === 'jp' ? 'プロモーション一覧' : 'Danh sách khuyến mãi'}
              </h3>
              <Button
                variant="default"
                size="sm"
                className="bg-amber-700 hover:bg-amber-800"
                onClick={() => setShowAddPromotionDialog(true)}
              >
                <Plus className="size-4 mr-2" />
                {language === 'jp' ? 'プロモーションを追加' : 'Thêm khuyến mãi'}
              </Button>
            </div>

            {promotions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Tag className="size-12 mx-auto mb-2 text-gray-300" />
                <p>{language === 'jp' ? 'まだプロモーションがありません' : 'Chưa có khuyến mãi nào'}</p>
              </div>
            ) : (
              promotions.map((promotion) => (
                <Card key={promotion.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Promotion Image */}
                    <div className="w-48 h-48 flex-shrink-0">
                      <img
                        src={promotion.image}
                        alt={language === 'jp' ? promotion.titleJP : promotion.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Promotion Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">
                          {language === 'jp' ? promotion.titleJP : promotion.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {language === 'jp' ? promotion.descriptionJP : promotion.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="size-4" />
                          <span>
                            {language === 'jp' ? '有効期限: ' : 'Có hiệu lực đến: '}
                            {new Date(promotion.validUntil).toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(language === 'jp' ? 'このプロモーションを削除しますか？' : 'Bạn có chắc muốn xóa khuyến mãi này?')) {
                              // Remove promotion from localStorage
                              const promotionsJson = localStorage.getItem('promotions');
                              const allPromotions = promotionsJson ? JSON.parse(promotionsJson) : [];
                              const updatedPromotions = allPromotions.filter((p: Promotion) => p.id !== promotion.id);

                              localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
                              
                              // Update local state
                              setPromotions(updatedPromotions.filter((p: Promotion) => p.cafeId === id));
                            }
                          }}
                        >
                          <Trash2 className="size-4 mr-2" />
                          {language === 'jp' ? '削除' : 'Xóa'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedPromotion(promotion);
                            setShowPromotionDetailDialog(true);
                          }}
                        >
                          <Info className="size-4 mr-2" />
                          {language === 'jp' ? '詳細' : 'Chi tiết'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {language === 'jp' ? 'スタッフ一覧' : 'Danh sách nhân viên'}
              </h3>
              <Button
                variant="default"
                size="sm"
                className="bg-amber-700 hover:bg-amber-800"
                onClick={() => setShowAddStaffDialog(true)}
              >
                <Plus className="size-4 mr-2" />
                {language === 'jp' ? 'スタッフを追加' : 'Thêm nhân viên'}
              </Button>
            </div>

            {staff.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="size-12 mx-auto mb-2 text-gray-300" />
                <p>{language === 'jp' ? 'まだスタッフがありません' : 'Chưa có nhân viên nào'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">{language === 'jp' ? '名前' : 'Họ tên'}</th>
                      <th className="text-left py-3 px-4">{language === 'jp' ? '役職' : 'Vị trí'}</th>
                      <th className="text-left py-3 px-4">{language === 'jp' ? '電話' : 'Số ĐT'}</th>
                      <th className="text-left py-3 px-4">{language === 'jp' ? 'メール' : 'Email'}</th>
                      <th className="text-right py-3 px-4">{language === 'jp' ? '操作' : 'Thao tác'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={s.avatar || 'https://i.pravatar.cc/150?img=1'}
                              alt={s.name}
                              className="size-10 rounded-full object-cover"
                            />
                            <span className="font-medium">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {language === 'jp' ? s.positionJP : s.position}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{s.phone}</td>
                        <td className="py-3 px-4 text-gray-600">{s.email || '-'}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedStaff(s);
                                setShowStaffDetailDialog(true);
                              }}
                            >
                              <Eye className="size-4 mr-1" />
                              {language === 'jp' ? '詳細' : 'Chi tiết'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (confirm(language === 'jp' ? 'このスタッフを削除しますか？' : 'Bạn có chắc muốn xóa nhân viên này?')) {
                                  // Remove staff from localStorage
                                  const staffJson = localStorage.getItem('staff');
                                  const allStaff = staffJson ? JSON.parse(staffJson) : [];
                                  const updatedStaff = allStaff.filter((p: Staff) => p.id !== s.id);

                                  localStorage.setItem('staff', JSON.stringify(updatedStaff));
                                  
                                  // Update local state
                                  setStaff(updatedStaff.filter((p: Staff) => p.cafeId === id));
                                }
                              }}
                            >
                              <Trash2 className="size-4 mr-1" />
                              {language === 'jp' ? '削除' : 'Xóa'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Cafe Dialog */}
      {showEditDialog && (
        <EditCafeDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          cafe={cafe}
          onSubmit={handleEditCafe}
        />
      )}

      {/* Report Review Dialog */}
      {showReportDialog && selectedReview && (
        <ReportReviewDialog
          open={showReportDialog}
          onClose={() => {
            setShowReportDialog(false);
            setSelectedReview(null);
          }}
          reviewId={selectedReview.id}
          cafeId={id!}
          reviewContent={selectedReview.comment}
          reviewerName={selectedReview.userName}
        />
      )}

      {/* Add Promotion Dialog */}
      {showAddPromotionDialog && (
        <AddPromotionDialog
          open={showAddPromotionDialog}
          onClose={() => setShowAddPromotionDialog(false)}
          cafeId={id!}
          onSubmit={(promotionData) => {
            // Calculate validUntil date based on duration (in days)
            const validUntilDate = new Date();
            validUntilDate.setDate(validUntilDate.getDate() + parseInt(promotionData.duration));
            
            // Add promotion to localStorage
            const promotionsJson = localStorage.getItem('promotions');
            const allPromotions = promotionsJson ? JSON.parse(promotionsJson) : [];
            const newPromotion: Promotion = {
              id: Date.now().toString(),
              cafeId: id!,
              title: promotionData.title,
              titleJP: promotionData.titleJP,
              description: promotionData.description,
              descriptionJP: promotionData.descriptionJP,
              image: promotionData.image,
              validUntil: validUntilDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            };

            localStorage.setItem('promotions', JSON.stringify([...allPromotions, newPromotion]));
            
            // Update local state
            setPromotions([...promotions, newPromotion]);
            
            setShowAddPromotionDialog(false);
          }}
        />
      )}

      {/* Promotion Detail Dialog */}
      {showPromotionDetailDialog && selectedPromotion && (
        <PromotionDetailDialog
          open={showPromotionDetailDialog}
          onClose={() => {
            setShowPromotionDetailDialog(false);
            setSelectedPromotion(null);
          }}
          promotion={selectedPromotion}
        />
      )}

      {/* Add Staff Dialog */}
      {showAddStaffDialog && (
        <AddStaffDialog
          open={showAddStaffDialog}
          onClose={() => setShowAddStaffDialog(false)}
          cafeId={id!}
          onSubmit={(staffData) => {
            // Add staff to localStorage
            const staffJson = localStorage.getItem('staff');
            const allStaff = staffJson ? JSON.parse(staffJson) : [];
            const newStaff: Staff = {
              id: Date.now().toString(),
              cafeId: id!,
              name: staffData.name,
              email: staffData.email,
              phone: staffData.phone,
              position: staffData.position,
              positionJP: staffData.positionJP,
              avatar: staffData.avatar,
              joinedDate: new Date().toISOString().split('T')[0], // Today's date as YYYY-MM-DD
            };

            localStorage.setItem('staff', JSON.stringify([...allStaff, newStaff]));
            
            // Update local state
            setStaff([...staff, newStaff]);
            
            setShowAddStaffDialog(false);
          }}
        />
      )}

      {/* Staff Detail Dialog */}
      {showStaffDetailDialog && selectedStaff && (
        <StaffDetailDialog
          open={showStaffDetailDialog}
          onClose={() => {
            setShowStaffDetailDialog(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
        />
      )}

      {/* Delete Request Dialog */}
      <Dialog open={showDeleteRequestDialog} onOpenChange={(open) => { setShowDeleteRequestDialog(open); if (!open) { setDeleteSubmitted(false); setDeleteReason(''); } }}>
        <DialogContent aria-describedby={undefined} className="max-w-md">
          {!deleteSubmitted ? (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Trash2 className="size-5 text-red-600" />
                  </div>
                  <DialogTitle className="text-red-700">
                    {language === 'jp' ? 'カフェ削除申請' : 'Yêu cầu xóa quán'}
                  </DialogTitle>
                </div>
              </DialogHeader>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {language === 'jp'
                  ? '※ この申請はAdmin審査を必要とします。承認後にカフェが削除されます。'
                  : '⚠ Yêu cầu này cần được Admin phê duyệt trước khi quán bị xóa khỏi hệ thống.'}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {language === 'jp' ? '削除理由 *' : 'Lý do xóa quán *'}
                </label>
                <Textarea
                  placeholder={
                    language === 'jp'
                      ? 'カフェを削除したい理由を詳しく記入してください...'
                      : 'Nhập lý do bạn muốn xóa quán khỏi hệ thống...'
                  }
                  className="min-h-[120px] resize-none"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{deleteReason.length}/500</p>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteRequestDialog(false)}
                >
                  {language === 'jp' ? 'キャンセル' : 'Hủy'}
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={!deleteReason.trim()}
                  onClick={handleSubmitDeleteRequest}
                >
                  <Trash2 className="size-4 mr-2" />
                  {language === 'jp' ? '申請を送信' : 'Gửi yêu cầu'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-center py-4">
              <div className="bg-green-100 rounded-full size-16 flex items-center justify-center mx-auto">
                <svg className="size-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {language === 'jp' ? '申請を送信しました' : 'Đã gửi yêu cầu thành công'}
                </h3>
                <p className="text-sm text-gray-500">
                  {language === 'jp'
                    ? 'Adminが確認後、適切に対応いたします。'
                    : 'Admin sẽ xem xét và phản hồi yêu cầu của bạn sớm nhất.'}
                </p>
              </div>
              <Button className="w-full" variant="outline" onClick={() => setShowDeleteRequestDialog(false)}>
                {language === 'jp' ? '閉じる' : 'Đóng'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}