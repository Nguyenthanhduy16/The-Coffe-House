import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { AddCafeDialog } from '../components/AddCafeDialog';
import { LanguageToggle } from '../components/LanguageToggle';
import { Plus, Coffee, MapPin, Phone, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

interface Cafe {
  id: string;
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
}

export default function CafeSetupPage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login');
      return;
    }

    // Load cafes for this owner
    loadCafes();
  }, [user, navigate]);

  const loadCafes = () => {
    const cafesJson = localStorage.getItem('cafes');
    const cafeOwnersJson = localStorage.getItem('cafeOwners');
    
    if (!cafesJson || !cafeOwnersJson) {
      setCafes([]);
      return;
    }

    const allCafes = JSON.parse(cafesJson);
    const cafeOwners = JSON.parse(cafeOwnersJson);

    // Filter cafes owned by current user
    const myCafes = allCafes.filter((cafe: any) => cafeOwners[cafe.id] === user?.id);
    setCafes(myCafes);
  };

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
      hasCoffee: boolean;
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

  const handleDeleteCafe = (cafeId: string) => {
    if (!confirm(language === 'jp' ? '本当に削除しますか？' : 'Bạn có chắc muốn xóa quán này?')) {
      return;
    }

    // Remove from cafes
    const cafesJson = localStorage.getItem('cafes');
    if (cafesJson) {
      const allCafes = JSON.parse(cafesJson);
      const filteredCafes = allCafes.filter((c: any) => c.id !== cafeId);
      localStorage.setItem('cafes', JSON.stringify(filteredCafes));
    }

    // Remove from cafeOwners mapping
    const cafeOwnersJson = localStorage.getItem('cafeOwners');
    if (cafeOwnersJson) {
      const cafeOwners = JSON.parse(cafeOwnersJson);
      delete cafeOwners[cafeId];
      localStorage.setItem('cafeOwners', JSON.stringify(cafeOwners));
    }

    loadCafes();
  };

  const handleFinish = () => {
    if (cafes.length === 0) {
      alert(language === 'jp' ? '少なくとも1つのカフェを追加してください' : 'Vui lòng thêm ít nhất một quán');
      return;
    }
    navigate('/owner');
  };

  const getAmenitiesDisplay = (amenities: Cafe['amenities']) => {
    const list = [];
    if (amenities.hasWifi) list.push(language === 'jp' ? 'WiFi' : 'WiFi');
    if (amenities.hasAC) list.push(language === 'jp' ? 'エアコン' : 'Điều hòa');
    if (amenities.hasOutlet) list.push(language === 'jp' ? 'コンセント' : 'Ổ điện');
    if (amenities.noSmoking) list.push(language === 'jp' ? '禁煙' : 'Cấm hút thuốc');
    if (amenities.hasSnacks) list.push(language === 'jp' ? '軽食' : 'Đồ ăn nhẹ');
    if (amenities.hasCoffee) list.push(language === 'jp' ? 'ハイテーブル' : 'Bàn cao');
    return list.join(', ') || '-';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-amber-600" />
            <span className="text-xl font-semibold">どこカフェ</span>
          </div>
          <LanguageToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Title & Add Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {language === 'jp' ? 'カフェ情報を登録' : 'Đăng ký thông tin quán'}
              </h1>
              <p className="text-gray-600">
                {language === 'jp' 
                  ? '管理するカフェを追加してください' 
                  : 'Thêm các quán cafe bạn muốn quản lý'}
              </p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="size-4" />
              {language === 'jp' ? 'カフェを追加' : 'Thêm quán'}
            </Button>
          </div>

          {/* Table */}
          {cafes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Coffee className="size-12 mx-auto mb-4 text-gray-300" />
              <p>{language === 'jp' ? 'カフェがまだ登録されていません' : 'Chưa có quán nào được đăng ký'}</p>
              <p className="text-sm mt-1">
                {language === 'jp' ? '「カフェを追加」ボタンをクリックして開始' : 'Nhấn nút "Thêm quán" để bắt đầu'}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">{language === 'jp' ? '画像' : 'Ảnh'}</TableHead>
                    <TableHead>{language === 'jp' ? 'カフェ名' : 'Tên quán'}</TableHead>
                    <TableHead>{language === 'jp' ? '住所' : 'Địa chỉ'}</TableHead>
                    <TableHead>{language === 'jp' ? '電話番号' : 'Số điện thoại'}</TableHead>
                    <TableHead>{language === 'jp' ? '設備' : 'Tiện ích'}</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cafes.map((cafe) => (
                    <TableRow key={cafe.id}>
                      <TableCell>
                        <img
                          src={cafe.coverImage || cafe.images?.[0]}
                          alt={cafe.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <div>{language === 'jp' ? cafe.nameJP : cafe.name}</div>
                          <div className="text-sm text-gray-500">
                            {language === 'jp' ? cafe.name : cafe.nameJP}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="size-4 text-gray-400" />
                          {cafe.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-4 text-gray-400" />
                          {cafe.phone}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {getAmenitiesDisplay(cafe.amenities)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCafe(cafe.id)}
                        >
                          <Trash2 className="size-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Finish Button */}
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleFinish}
              size="lg"
              disabled={cafes.length === 0}
            >
              {language === 'jp' ? '完了' : 'Hoàn tất'}
            </Button>
          </div>
        </div>
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