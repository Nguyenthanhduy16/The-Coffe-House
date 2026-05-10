import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getCafes, type Cafe } from '../utils/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LanguageToggle } from '../components/LanguageToggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Coffee, Users, Store, AlertTriangle, BarChart3, User,
  Search, X, MapPin, Phone, Clock, Star, Wifi, Wind,
  Plug, Cigarette, Cookie, ChevronRight, CheckCircle2,
  XCircle,
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: number;
}

export default function AdminCafeManagementPage() {
  const [allCafes, setAllCafes] = useState<Cafe[]>([]);
  const [owners, setOwners] = useState<Record<string, string>>({}); // cafeId -> ownerName
  const [pendingSearch, setPendingSearch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeReports, setActiveReports] = useState(0);

  const { logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load cafes
    const cafes = getCafes();
    setAllCafes(cafes);

    // Load owner mapping: cafeId -> userId -> userName
    const cafeOwnersJson = localStorage.getItem('cafeOwners');
    const cafeOwners: Record<string, string> = cafeOwnersJson
      ? JSON.parse(cafeOwnersJson)
      : {};

    const usersJson = localStorage.getItem('users');
    const users: UserRecord[] = usersJson ? JSON.parse(usersJson) : [];

    const ownerNames: Record<string, string> = {};
    cafes.forEach((cafe) => {
      const ownerId = cafeOwners[cafe.id];
      if (ownerId) {
        const owner = users.find((u) => u.id === ownerId);
        ownerNames[cafe.id] = owner?.name ?? '—';
      } else {
        ownerNames[cafe.id] = '—';
      }
    });
    setOwners(ownerNames);

    // Reports badge
    const reportsJson = localStorage.getItem('reports');
    const reports = reportsJson ? JSON.parse(reportsJson) : [];
    setActiveReports(reports.filter((r: any) => r.status === 'active').length);
  }, []);

  /* ── helpers ── */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = () => setSearchText(pendingSearch);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };
  const clearSearch = () => {
    setPendingSearch('');
    setSearchText('');
  };

  const isActive = (path: string) => location.pathname === path;
  const navCls = (path: string) =>
    `w-full justify-start ${
      isActive(path)
        ? 'bg-amber-50 text-amber-800 font-semibold'
        : 'text-gray-700'
    }`;

  const filteredCafes = allCafes.filter((c) =>
    searchText
      ? c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.nameJP.includes(searchText)
      : true
  );

  const openDetail = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setDetailOpen(true);
  };

  /* ── amenity row helper ── */
  const AmenityItem = ({
    icon,
    label,
    active,
  }: {
    icon: React.ReactNode;
    label: string;
    active: boolean;
  }) => (
    <div
      className={`flex items-center gap-2 text-sm ${
        active ? 'text-green-700' : 'text-gray-400'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active ? (
        <CheckCircle2 className="size-3.5 ml-auto text-green-500" />
      ) : (
        <XCircle className="size-3.5 ml-auto text-gray-300" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ══ Sidebar ══ */}
      <div className="w-64 bg-white border-r flex flex-col shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-amber-700" />
            <div>
              <h1 className="font-bold">どこカフェ</h1>
              <span className="text-xs text-gray-500">
                {language === 'jp' ? '管理者' : 'Admin'}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Button
            variant="ghost"
            className={navCls('/admin')}
            onClick={() => navigate('/admin')}
          >
            <BarChart3 className="size-4 mr-2" />
            {language === 'jp' ? 'ダッシュボード' : 'Dashboard'}
          </Button>

          <Button
            variant="ghost"
            className={navCls('/admin/users')}
            onClick={() => navigate('/admin/users')}
          >
            <Users className="size-4 mr-2" />
            {language === 'jp' ? 'ユーザー管理' : 'Quản lý người dùng'}
          </Button>

          <Button
            variant="ghost"
            className={navCls('/admin/cafes')}
            onClick={() => navigate('/admin/cafes')}
          >
            <Store className="size-4 mr-2" />
            {language === 'jp' ? 'カフェ管理' : 'Quản lý quán'}
          </Button>

          <Button
            variant="ghost"
            className={navCls('/admin/reports')}
            onClick={() => navigate('/admin/reports')}
          >
            <AlertTriangle className="size-4 mr-2" />
            {language === 'jp' ? 'レポート管理' : 'Quản lý báo cáo'}
            {activeReports > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                {activeReports}
              </span>
            )}
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            {language === 'jp' ? 'ログアウト' : 'Đăng xuất'}
          </Button>
        </div>
      </div>

      {/* ══ Main Content ══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="border-b bg-white px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-gray-800">
            {language === 'jp' ? 'カフェ管理' : 'Quản lý quán cà phê'}
          </h2>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

            {/* ── Search bar ── */}
            <div className="p-5 border-b bg-gray-50/60">
              <div className="flex gap-2 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    className="pl-9 bg-white"
                    placeholder={
                      language === 'jp'
                        ? 'カフェ名で検索...'
                        : 'Tìm theo tên quán...'
                    }
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  {pendingSearch && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={clearSearch}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
                <Button
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                  onClick={handleSearch}
                >
                  <Search className="size-4 mr-1.5" />
                  {language === 'jp' ? '検索' : 'Tìm kiếm'}
                </Button>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 border-b">
                    <th className="text-center py-3 px-4 w-14">
                      {language === 'jp' ? '番号' : 'STT'}
                    </th>
                    <th className="text-left py-3 px-4">
                      {language === 'jp' ? '店名' : 'Tên quán'}
                    </th>
                    <th className="text-left py-3 px-4">
                      {language === 'jp' ? '住所' : 'Địa chỉ'}
                    </th>
                    <th className="text-left py-3 px-4">
                      {language === 'jp' ? '店主名' : 'Tên chủ quán'}
                    </th>
                    <th className="text-center py-3 px-4">
                      {language === 'jp' ? 'アクション' : 'Hành động'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCafes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-14 text-gray-400"
                      >
                        <Store className="size-10 mx-auto mb-2 opacity-30" />
                        <p>
                          {language === 'jp'
                            ? 'カフェが見つかりません'
                            : 'Không tìm thấy quán nào'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCafes.map((cafe, idx) => (
                      <tr
                        key={cafe.id}
                        className="border-b last:border-b-0 hover:bg-amber-50/40 transition-colors"
                      >
                        {/* STT */}
                        <td className="text-center py-3.5 px-4 text-gray-500">
                          {idx + 1}
                        </td>

                        {/* Cafe name + thumbnail */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={cafe.images?.[0]}
                              alt={cafe.name}
                              className="size-10 rounded-lg object-cover shrink-0 border"
                            />
                            <div>
                              <p className="text-gray-800">
                                {language === 'jp' ? cafe.nameJP : cafe.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {language === 'jp' ? cafe.name : cafe.nameJP}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Address */}
                        <td className="py-3.5 px-4 text-gray-600 max-w-xs">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="size-3.5 mt-0.5 text-gray-400 shrink-0" />
                            <span className="line-clamp-2">{cafe.address}</span>
                          </div>
                        </td>

                        {/* Owner name */}
                        <td className="py-3.5 px-4 text-gray-700">
                          {owners[cafe.id] || '—'}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-500"
                            onClick={() => openDetail(cafe)}
                          >
                            <ChevronRight className="size-3.5 mr-1" />
                            {language === 'jp' ? '詳細を見る' : 'Xem chi tiết'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Footer count ── */}
            <div className="px-5 py-3 border-t bg-gray-50/60 text-sm text-gray-500 flex items-center justify-between">
              <span>
                {language === 'jp'
                  ? `総カフェ数：${filteredCafes.length}`
                  : `Tổng số quán: ${filteredCafes.length}`}
                {searchText && (
                  <span className="ml-2 text-gray-400">
                    {language === 'jp'
                      ? `（全${allCafes.length}件中）`
                      : `(trong tổng ${allCafes.length})`}
                  </span>
                )}
              </span>
              {searchText && (
                <button
                  className="text-amber-700 hover:underline text-xs"
                  onClick={clearSearch}
                >
                  {language === 'jp' ? '検索をクリア' : 'Xóa tìm kiếm'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ Cafe Detail Modal ══ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-lg max-h-[90vh] overflow-y-auto p-0"
        >
          {selectedCafe && (
            <>
              {/* Hero image */}
              <div className="relative w-full h-44 shrink-0">
                <img
                  src={selectedCafe.images?.[0]}
                  alt={selectedCafe.name}
                  className="w-full h-full object-cover"
                />
                {/* Status chips over image */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                      selectedCafe.isOpen
                        ? 'bg-green-500/90 text-white'
                        : 'bg-red-500/90 text-white'
                    }`}
                  >
                    {selectedCafe.isOpen
                      ? language === 'jp'
                        ? '営業中'
                        : 'Đang mở'
                      : language === 'jp'
                      ? '閉店'
                      : 'Đã đóng'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                      selectedCafe.status === 'crowded'
                        ? 'bg-orange-500/90 text-white'
                        : 'bg-gray-700/70 text-white'
                    }`}
                  >
                    {selectedCafe.status === 'crowded'
                      ? language === 'jp'
                        ? '混雑'
                        : 'Đông'
                      : language === 'jp'
                      ? '通常'
                      : 'Bình thường'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <DialogHeader className="pb-0">
                  <DialogTitle className="text-xl">
                    {language === 'jp'
                      ? selectedCafe.nameJP
                      : selectedCafe.name}
                  </DialogTitle>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {language === 'jp'
                      ? selectedCafe.name
                      : selectedCafe.nameJP}
                  </p>
                </DialogHeader>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <Star className="size-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{selectedCafe.rating}</span>
                  <span className="text-gray-500 text-sm">
                    ({selectedCafe.reviewCount}{' '}
                    {language === 'jp' ? '件' : 'đánh giá'})
                  </span>
                </div>

                {/* Basic info */}
                <div className="bg-gray-50 rounded-lg divide-y text-sm">
                  <InfoRow
                    icon={<MapPin className="size-4 text-gray-400 shrink-0" />}
                    label={language === 'jp' ? '住所' : 'Địa chỉ'}
                    value={selectedCafe.address}
                  />
                  <InfoRow
                    icon={<Phone className="size-4 text-gray-400 shrink-0" />}
                    label={language === 'jp' ? '電話番号' : 'Số điện thoại'}
                    value={selectedCafe.phone}
                  />
                  <InfoRow
                    icon={<Clock className="size-4 text-gray-400 shrink-0" />}
                    label={language === 'jp' ? '営業時間' : 'Giờ mở cửa'}
                    value={
                      selectedCafe.openingHours?.[0]?.hours || '07:00 - 22:00'
                    }
                  />
                  <InfoRow
                    icon={<User className="size-4 text-gray-400 shrink-0" />}
                    label={language === 'jp' ? '店主' : 'Chủ quán'}
                    value={owners[selectedCafe.id] || '—'}
                  />
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    {language === 'jp' ? '設備・サービス' : 'Tiện nghi'}
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <AmenityItem
                      icon={<Wifi className="size-4" />}
                      label="Wi-Fi"
                      active={selectedCafe.amenities.hasWifi}
                    />
                    <AmenityItem
                      icon={<Wind className="size-4" />}
                      label={language === 'jp' ? 'エアコン' : 'Điều hòa'}
                      active={selectedCafe.amenities.hasAC}
                    />
                    <AmenityItem
                      icon={<Plug className="size-4" />}
                      label={language === 'jp' ? '電源' : 'Ổ cắm điện'}
                      active={selectedCafe.amenities.hasOutlet}
                    />
                    <AmenityItem
                      icon={<Cigarette className="size-4" />}
                      label={language === 'jp' ? '禁煙' : 'Không hút thuốc'}
                      active={selectedCafe.amenities.noSmoking}
                    />
                    <AmenityItem
                      icon={<Cookie className="size-4" />}
                      label={language === 'jp' ? 'スナック' : 'Đồ ăn nhẹ'}
                      active={selectedCafe.amenities.hasSnacks}
                    />
                  </div>
                </div>

                {/* Close */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setDetailOpen(false)}
                >
                  {language === 'jp' ? '閉じる' : 'Đóng'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── shared sub-components ── */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="mt-0.5">{icon}</span>
      <span className="text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function AmenityItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${
        active
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-gray-200 bg-white text-gray-400'
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {active ? (
        <CheckCircle2 className="size-3.5 text-green-500" />
      ) : (
        <XCircle className="size-3.5 text-gray-300" />
      )}
    </div>
  );
}
