import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Coffee, Search, Plus, User } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { AddCafeDialog } from '../components/AddCafeDialog';
import { Cafe, getCafes } from '../utils/mockData';

export default function OwnerHomePage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    loadCafes();
  }, [user]);

  const loadCafes = () => {
    // Load cafes owned by this user
    const allCafes = getCafes();
    const ownedCafes = allCafes.filter(cafe => {
      // Get owner info from localStorage
      const cafeOwnersJson = localStorage.getItem('cafeOwners');
      if (cafeOwnersJson) {
        const cafeOwners = JSON.parse(cafeOwnersJson);
        return cafeOwners[cafe.id] === user?.id;
      }
      return false;
    });
    setCafes(ownedCafes);
    setFilteredCafes(ownedCafes);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = cafes.filter(cafe =>
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.nameJP.includes(searchQuery) ||
        cafe.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCafes(filtered);
    } else {
      setFilteredCafes(cafes);
    }
  }, [searchQuery, cafes]);

  const handleAddCafe = (cafeData: {
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
    };
  }) => {
    // Create new cafe
    const newCafe = {
      id: Date.now().toString(),
      ...cafeData,
      images: [cafeData.coverImage],
      rating: 0,
      reviewCount: 0,
      priceRange: '50.000đ - 150.000đ',
      isOpen: true,
      status: 'quiet' as const,
      hours: '07:00 - 22:00',
    };

    // Add to cafes
    const cafesJson = localStorage.getItem('cafes');
    const cafes = cafesJson ? JSON.parse(cafesJson) : [];
    cafes.push(newCafe);
    localStorage.setItem('cafes', JSON.stringify(cafes));

    // Map owner to cafe
    const cafeOwnersJson = localStorage.getItem('cafeOwners');
    const cafeOwners = cafeOwnersJson ? JSON.parse(cafeOwnersJson) : {};
    cafeOwners[newCafe.id] = user?.id;
    localStorage.setItem('cafeOwners', JSON.stringify(cafeOwners));

    setShowAddDialog(false);
    loadCafes();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-amber-700" />
            <h1 className="font-bold">どこカフェ</h1>
            <span className="text-sm text-gray-500">- {language === 'jp' ? '店主' : 'Chủ quán'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={() => navigate('/owner/profile')}>
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {language === 'jp' ? '管理しているカフェ' : 'Các quán đang quản lý'}
            </h2>
            <p className="text-gray-600">
              {language === 'jp' 
                ? `${cafes.length}件のカフェを管理しています` 
                : `Đang quản lý ${cafes.length} quán`}
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="size-4 mr-2" />
            {language === 'jp' ? 'カフェを追加' : 'Thêm quán'}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <Input
            type="text"
            placeholder={language === 'jp' ? 'カフェを検索...' : 'Tìm kiếm quán...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Cafe Grid */}
        {filteredCafes.length === 0 ? (
          <div className="text-center py-12">
            <Coffee className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              {language === 'jp' ? 'カフェがありません' : 'Chưa có quán nào'}
            </h3>
            <p className="text-gray-400 mb-4">
              {language === 'jp' 
                ? '最初のカフェを追加してください' 
                : 'Hãy thêm quán đầu tiên của bạn'}
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="size-4 mr-2" />
              {language === 'jp' ? 'カフェを追加' : 'Thêm quán'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCafes.map((cafe) => (
              <div
                key={cafe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/owner/cafe/${cafe.id}`)}
              >
                <img
                  src={cafe.images[0]}
                  alt={cafe.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">
                    {language === 'jp' ? cafe.nameJP : cafe.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{cafe.address}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        cafe.isOpen 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {cafe.isOpen 
                          ? (language === 'jp' ? '営業中' : 'Đang mở') 
                          : (language === 'jp' ? '閉店' : 'Đã đóng')}
                      </span>
                      
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        cafe.status === 'crowded' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {cafe.status === 'crowded' 
                          ? (language === 'jp' ? '混雑' : 'Đông') 
                          : (language === 'jp' ? '通常' : 'Bình thường')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{cafe.rating}</span>
                      <span className="text-xs text-gray-500">({cafe.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Cafe Dialog */}
      <AddCafeDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSubmit={handleAddCafe}
      />
    </div>
  );
}