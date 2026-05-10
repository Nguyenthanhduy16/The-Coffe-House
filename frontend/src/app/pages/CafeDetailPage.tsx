import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getCafes, getReviews, getPromotions, type Cafe, type Review, type Promotion } from '../utils/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MapPin, Phone, Clock, Star, Wifi, Wind, Plug, Cigarette, Cookie, Armchair } from 'lucide-react';
import ProfileDialog from '../components/ProfileDialog';
import NotificationsDialog from '../components/NotificationsDialog';
import BookingDialog from '../components/BookingDialog';
import ReviewDialog from '../components/ReviewDialog';

export default function CafeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [otherCafes, setOtherCafes] = useState<Cafe[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'recent' | 'popular'>('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!id) return;
    
    const cafes = getCafes();
    const foundCafe = cafes.find(c => c.id === id);
    setCafe(foundCafe || null);
    
    // Get other cafes (exclude current)
    const others = cafes.filter(c => c.id !== id);
    setOtherCafes(others);
    
    // Get all promotions
    setPromotions(getPromotions());
    
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    if (!id) return;
    const allReviews = getReviews();
    const cafeReviews = allReviews.filter(r => r.cafeId === id);
    setReviews(cafeReviews);
  };

  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    if (reviewFilter === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (reviewFilter === 'popular') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    return filtered;
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
  };

  const handleReviewSuccess = () => {
    setShowReview(false);
    loadReviews();
  };

  if (!user) {
    return null;
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar showBackButton />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Cafe not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        showBackButton
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Cafe Images */}
        <div className="grid grid-cols-1 gap-4">
          {cafe.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={cafe.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Cafe Info */}
        <Card className="p-6 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{language === 'jp' ? cafe.nameJP : cafe.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{cafe.rating}</span>
              </div>
              <span className="text-gray-500">({cafe.reviewCount} {t('reviews')})</span>
            </div>
          </div>

          <div className="space-y-2 text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="size-5 mt-0.5 text-blue-600" />
              <span>{cafe.address}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="size-5 text-blue-600" />
              <span>{cafe.phone}</span>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="size-5 mt-0.5 text-blue-600" />
              <div>
                {cafe.openingHours.map((hours, idx) => (
                  <div key={idx}>
                    <span className="font-medium">{hours.day}:</span> {hours.hours}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {cafe.isOpen ? (
              <Badge className="bg-green-600">{t('openNow')}</Badge>
            ) : (
              <Badge variant="destructive">{t('closed')}</Badge>
            )}
            <Badge variant={cafe.status === 'crowded' ? 'destructive' : 'outline'}>
              {t(cafe.status)}
            </Badge>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold mb-2">{t('amenities')}</h3>
            <div className="flex gap-4 flex-wrap">
              {cafe.amenities.hasWifi && (
                <div className="flex items-center gap-2 text-sm">
                  <Wifi className="size-4 text-blue-600" />
                  <span>{t('hasWifi')}</span>
                </div>
              )}
              {cafe.amenities.hasAC && (
                <div className="flex items-center gap-2 text-sm">
                  <Wind className="size-4 text-blue-600" />
                  <span>{t('hasAC')}</span>
                </div>
              )}
              {cafe.amenities.hasOutlet && (
                <div className="flex items-center gap-2 text-sm">
                  <Plug className="size-4 text-blue-600" />
                  <span>{t('hasOutlet')}</span>
                </div>
              )}
              {cafe.amenities.noSmoking && (
                <div className="flex items-center gap-2 text-sm">
                  <Cigarette className="size-4 text-red-600 line-through" />
                  <span>{t('noSmoking')}</span>
                </div>
              )}
              {cafe.amenities.hasSnacks && (
                <div className="flex items-center gap-2 text-sm">
                  <Cookie className="size-4 text-blue-600" />
                  <span>{t('hasSnacks')}</span>
                </div>
              )}
              {cafe.amenities.hasCoffee && (
                <div className="flex items-center gap-2 text-sm">
                  <Armchair className="size-4 text-blue-600" />
                  <span>{language === 'jp' ? 'ハイテーブル' : 'Bàn cao'}</span>
                </div>
              )}
            </div>
          </div>

          <Button onClick={() => setShowBooking(true)} className="w-full" size="lg">
            {t('bookTable')}
          </Button>
        </Card>

        {/* Menu */}
        <Card className="p-6">
          <h2 className="font-bold text-xl mb-4">{t('menu')}</h2>
          <div className="max-h-80 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {cafe.menu.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{language === 'jp' ? item.nameJP : item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <p className="font-medium">{item.price.toLocaleString()}₫</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Reviews */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">{t('reviews')}</h2>
            <Button onClick={() => setShowReview(true)}>
              {t('writeReview')}
            </Button>
          </div>

          <Tabs value={reviewFilter} onValueChange={(v) => setReviewFilter(v as any)}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">{t('all')}</TabsTrigger>
              <TabsTrigger value="recent" className="flex-1">{t('recent')}</TabsTrigger>
              <TabsTrigger value="popular" className="flex-1">{t('popular')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value={reviewFilter} className="mt-4">
              <div className="max-h-96 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {getFilteredReviews().length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No reviews yet</p>
                ) : (
                  getFilteredReviews().map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`size-4 ${
                                  idx < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Review"
                              className="size-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Other Cafes with Promotions */}
        {otherCafes.length > 0 && (
          <Card className="p-6">
            <h2 className="font-bold text-xl mb-4">{t('otherCafes')}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {otherCafes.map(otherCafe => {
                const cafePromotion = promotions.find(p => p.cafeId === otherCafe.id);
                return (
                  <Card
                    key={otherCafe.id}
                    className="min-w-[280px] cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/cafe/${otherCafe.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={otherCafe.images[0]}
                        alt={otherCafe.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      {cafePromotion && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-red-600">
                            {language === 'jp' ? '特典' : 'Ưu đãi'}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold">{language === 'jp' ? otherCafe.nameJP : otherCafe.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="size-4" />
                        {otherCafe.address}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{otherCafe.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({otherCafe.reviewCount})</span>
                      </div>
                      {cafePromotion && (
                        <div className="text-sm text-red-600 font-medium">
                          {language === 'jp' ? cafePromotion.titleJP : cafePromotion.title}
                        </div>
                      )}
                      <Badge variant={otherCafe.status === 'crowded' ? 'destructive' : 'outline'}>
                        {t(otherCafe.status)}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <ProfileDialog open={showProfile} onClose={() => setShowProfile(false)} />
      <NotificationsDialog open={showNotifications} onClose={() => setShowNotifications(false)} />
      <BookingDialog
        open={showBooking}
        onClose={() => setShowBooking(false)}
        cafe={cafe}
        onSuccess={handleBookingSuccess}
      />
      <ReviewDialog
        open={showReview}
        onClose={() => setShowReview(false)}
        cafeId={cafe.id}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
}