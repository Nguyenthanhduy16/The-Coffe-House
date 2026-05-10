import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getCafes, getReviews, getBookings, getPromotions, getStaff, type Cafe, type Review, type Booking, type Promotion, type Staff } from '../utils/mockData';
import { Button } from '../components/ui/button';
import { ArrowLeft, MapPin, Phone, Clock, Star, MessageSquare, Calendar, Tag, Users, Info, Wifi, Wind, Plug, Cigarette, Cookie, Coffee, AlertCircle, Flag, Plus, Trash2, Eye, Armchair } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { LanguageToggle } from '../components/LanguageToggle';
import { ReportReviewDialog } from '../components/ReportReviewDialog';
import { PromotionDetailDialog } from '../components/PromotionDetailDialog';
import { AddPromotionDialog } from '../components/AddPromotionDialog';

export default function StaffCafeDetailPage() {
  const { id } = useParams();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showPromotionDetailDialog, setShowPromotionDetailDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showStaffDetailDialog, setShowStaffDetailDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showAddPromotionDialog, setShowAddPromotionDialog] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    // Load cafe
    const allCafes = getCafes();
    const foundCafe = allCafes.find(c => c.id === id);
    
    if (!foundCafe) {
      navigate('/staff');
      return;
    }

    // Check if user is staff of this cafe
    if (user?.role === 4) {
      const allStaff = getStaff();
      const staffRecord = allStaff.find(s => s.email === user.email && s.cafeId === id);
      if (!staffRecord) {
        navigate('/staff');
        return;
      }
    }

    setCafe(foundCafe);

    // Load reviews for this cafe
    const allReviews = getReviews();
    setReviews(allReviews.filter(r => r.cafeId === id));

    // Load bookings for this cafe
    const allBookings = getBookings();
    const cafeBookings = allBookings.filter(b => b.cafeId === id);
    setBookings(cafeBookings);

    // Load promotions for this cafe
    const allPromotions = getPromotions();
    const cafePromotions = allPromotions.filter(p => p.cafeId === id);
    setPromotions(cafePromotions);

    // Load staff for this cafe
    const allStaff = getStaff();
    const cafeStaff = allStaff.filter(s => s.cafeId === id);
    setStaff(cafeStaff);
  }, [id, user, navigate]);

  // Calculate pending bookings count
  const pendingBookingsCount = bookings.filter(b => b.status === 'pending').length;

  if (!cafe) {
    return null;
  }

  const handleClose = () => {
    navigate('/staff');
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
          <TabsList className="grid w-full grid-cols-4">
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
          </TabsList>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4 mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {language === 'jp' ? '基本情報' : 'Thông tin cơ bản'}
                </h3>
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
              </div>

              <div className="space-y-4">
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
                    <div className={`flex items-center gap-2 ${cafe.amenities.noSmoking ? 'text-green-700' : 'text-gray-400'}`}>
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
            {promotions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Tag className="size-12 mx-auto mb-2 text-gray-300" />
                <p>{language === 'jp' ? 'まだプロモーションがありません' : 'Chưa có khuyến mãi nào'}</p>
              </div>
            ) : (
              promotions.map((promotion) => (
                <Card key={promotion.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-48 flex-shrink-0">
                      <img
                        src={promotion.image}
                        alt={language === 'jp' ? promotion.titleJP : promotion.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
                      <div className="flex justify-end mt-4">
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
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => setShowAddPromotionDialog(true)}
              >
                <Plus className="size-4 mr-2" />
                {language === 'jp' ? '新規プロモーション' : 'Khuyến mãi mới'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

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

      {/* Add Promotion Dialog */}
      {showAddPromotionDialog && (
        <AddPromotionDialog
          open={showAddPromotionDialog}
          onClose={() => setShowAddPromotionDialog(false)}
          cafeId={id!}
        />
      )}
    </div>
  );
}