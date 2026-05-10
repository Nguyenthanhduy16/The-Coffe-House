import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TopBar } from '../components/TopBar';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getCafes, getPromotions, type Cafe, type Promotion } from '../utils/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Filter, MapPin, Star, X, Wifi, Wind, Plug, Cigarette, Armchair } from 'lucide-react';
import ProfileDialog from '../components/ProfileDialog';
import NotificationsDialog from '../components/NotificationsDialog';
import MapArea from '../components/MapArea';

export default function HomePage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  
  const [filters, setFilters] = useState({
    hasWifi: false,
    hasAC: false,
    hasOutlet: false,
    noSmoking: false,
    hasSnacks: false,
    isOpen: false,
  });

  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const allCafes = getCafes();
    setCafes(allCafes);
    setFilteredCafes(allCafes);
    setPromotions(getPromotions());
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, cafes]);

  const applyFilters = () => {
    let result = [...cafes];

    // Apply search
    if (searchQuery) {
      result = result.filter(cafe => 
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.nameJP.includes(searchQuery) ||
        cafe.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.hasWifi) result = result.filter(c => c.amenities.hasWifi);
    if (filters.hasAC) result = result.filter(c => c.amenities.hasAC);
    if (filters.hasOutlet) result = result.filter(c => c.amenities.hasOutlet);
    if (filters.noSmoking) result = result.filter(c => c.amenities.noSmoking);
    if (filters.hasSnacks) result = result.filter(c => c.amenities.hasSnacks);
    if (filters.isOpen) result = result.filter(c => c.isOpen);

    setFilteredCafes(result);
  };

  const clearFilters = () => {
    setFilters({
      hasWifi: false,
      hasAC: false,
      hasOutlet: false,
      noSmoking: false,
      hasSnacks: false,
      isOpen: false,
    });
  };

  const nextPromo = () => {
    setCurrentPromoIndex((prev) => (prev + 1) % promotions.length);
  };

  const prevPromo = () => {
    setCurrentPromoIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const handleCafeClick = (cafeId: string) => {
    navigate(`/cafe/${cafeId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar 
        onNotificationClick={() => setShowNotifications(true)}
        onProfileClick={() => setShowProfile(true)}
      />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => {}}>
              <Search className="size-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setShowFilter(true)}>
            <Filter className="size-4 mr-2" />
            {t('filter')}
          </Button>
        </div>

        {/* Promotions Highlight */}
        {promotions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="font-bold mb-4">{t('promotions')}</h2>
              <div className="relative">
                <div 
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedPromotion(promotions[currentPromoIndex]);
                    setShowPromotion(true);
                  }}
                >
                  <img
                    src={promotions[currentPromoIndex].image}
                    alt="Promotion"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold">
                      {language === 'jp' ? promotions[currentPromoIndex].titleJP : promotions[currentPromoIndex].title}
                    </h3>
                    <p className="text-white text-sm">
                      {language === 'jp' ? promotions[currentPromoIndex].descriptionJP : promotions[currentPromoIndex].description}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={prevPromo}>←</Button>
                  <div className="flex items-center gap-1">
                    {promotions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`size-2 rounded-full ${idx === currentPromoIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                  <Button size="sm" variant="outline" onClick={nextPromo}>→</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Area */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="size-5 text-blue-600" />
            <span className="font-medium">Bản đồ quanh đây</span>
          </div>
          <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
            <MapArea
              cafes={filteredCafes.map(cafe => ({
                id: cafe.id,
                name: language === 'jp' ? cafe.nameJP : cafe.name,
                lat: cafe.lat,
                lng: cafe.lng,
                address: cafe.address,
                rating: cafe.rating,
              }))}
              onCafeClick={(cafe) => {
                const cafeData = filteredCafes.find(c => c.id === cafe.id);
                if (cafeData) {
                  handleCafeClick(cafeData.id);
                }
              }}
            />
          </div>
        </div>

        {/* Cafe List */}
        <div>
          <h2 className="font-bold mb-4">{t('cafes')} ({filteredCafes.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCafes.map(cafe => (
              <Card
                key={cafe.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => handleCafeClick(cafe.id)}
              >
                <img
                  src={cafe.images[0]}
                  alt={cafe.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="font-bold">{language === 'jp' ? cafe.nameJP : cafe.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="size-4" />
                    {cafe.address}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{cafe.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({cafe.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {cafe.isOpen && (
                      <Badge variant="default" className="bg-green-600">{t('openNow')}</Badge>
                    )}
                    <Badge variant={cafe.status === 'crowded' ? 'destructive' : 'outline'}>{t(cafe.status)}</Badge>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {cafe.amenities.hasWifi && <Wifi className="size-4 text-gray-600" />}
                    {cafe.amenities.hasAC && <Wind className="size-4 text-gray-600" />}
                    {cafe.amenities.hasOutlet && <Plug className="size-4 text-gray-600" />}
                    {cafe.amenities.hasCoffee && <Armchair className="size-4 text-gray-600" />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={showFilter} onOpenChange={setShowFilter}>
        <DialogContent aria-describedby={undefined}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setShowFilter(false)}
          >
            <X className="size-4" />
          </Button>
          
          <DialogHeader>
            <DialogTitle>{t('filter')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasWifi"
                checked={filters.hasWifi}
                onCheckedChange={(checked) => setFilters({ ...filters, hasWifi: checked as boolean })}
              />
              <Label htmlFor="hasWifi" className="cursor-pointer">{t('hasWifi')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAC"
                checked={filters.hasAC}
                onCheckedChange={(checked) => setFilters({ ...filters, hasAC: checked as boolean })}
              />
              <Label htmlFor="hasAC" className="cursor-pointer">{t('hasAC')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasOutlet"
                checked={filters.hasOutlet}
                onCheckedChange={(checked) => setFilters({ ...filters, hasOutlet: checked as boolean })}
              />
              <Label htmlFor="hasOutlet" className="cursor-pointer">{t('hasOutlet')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="noSmoking"
                checked={filters.noSmoking}
                onCheckedChange={(checked) => setFilters({ ...filters, noSmoking: checked as boolean })}
              />
              <Label htmlFor="noSmoking" className="cursor-pointer">{t('noSmoking')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSnacks"
                checked={filters.hasSnacks}
                onCheckedChange={(checked) => setFilters({ ...filters, hasSnacks: checked as boolean })}
              />
              <Label htmlFor="hasSnacks" className="cursor-pointer">{t('hasSnacks')}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOpen"
                checked={filters.isOpen}
                onCheckedChange={(checked) => setFilters({ ...filters, isOpen: checked as boolean })}
              />
              <Label htmlFor="isOpen" className="cursor-pointer">{t('openNow')}</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowFilter(false)} className="flex-1">
                {t('applyFilter')}
              </Button>
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                {t('clearFilter')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <ProfileDialog open={showProfile} onClose={() => setShowProfile(false)} />

      {/* Notifications Dialog */}
      <NotificationsDialog open={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Promotion Dialog */}
      <Dialog open={showPromotion} onOpenChange={setShowPromotion}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10"
            onClick={() => setShowPromotion(false)}
          >
            <X className="size-4" />
          </Button>
          
          <DialogHeader>
            <DialogTitle>{t('promotion')}</DialogTitle>
          </DialogHeader>

          {selectedPromotion && (
            <div className="space-y-4">
              <img
                src={selectedPromotion.image}
                alt="Promotion"
                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  if (selectedPromotion?.cafeId) {
                    setShowPromotion(false);
                    navigate(`/cafe/${selectedPromotion.cafeId}`);
                  }
                }}
              />
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {language === 'jp' ? selectedPromotion.titleJP : selectedPromotion.title}
                </h3>
                <p className="text-gray-600">
                  {language === 'jp' ? selectedPromotion.descriptionJP : selectedPromotion.description}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {language === 'jp' ? '有効期限: ' : 'Có hiệu lực đến: '}
                  {new Date(selectedPromotion.validUntil).toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}