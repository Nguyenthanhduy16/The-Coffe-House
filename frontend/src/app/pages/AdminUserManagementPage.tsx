import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import {
  Coffee, Users, Store, AlertTriangle, BarChart3, User,
  Search, X, Phone, Mail, Shield, ChevronRight,
} from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 1 | 2 | 3 | 4;
  phone?: string;
  avatar?: string;
  password?: string;
}

// Extended mock users to make table richer
const EXTRA_MOCK_USERS: UserRecord[] = [
  {
    id: '6',
    name: 'Yamamoto Kenji',
    email: 'kenji.yamamoto@test.com',
    role: 1,
    phone: '0912345678',
  },
  {
    id: '7',
    name: 'Lê Thị Hoa',
    email: 'hoa@cafehanoi.com',
    role: 2,
    phone: '0923456789',
  },
  {
    id: '8',
    name: 'Suzuki Haruto',
    email: 'haruto.suzuki@test.com',
    role: 1,
    phone: '0934567890',
  },
  {
    id: '9',
    name: 'Phạm Văn Đức',
    email: 'duc.pham@cafewest.com',
    role: 4,
    phone: '0945678901',
  },
  {
    id: '10',
    name: 'Nakamura Yuki',
    email: 'yuki.nakamura@test.com',
    role: 1,
    phone: '0956789012',
  },
  {
    id: '11',
    name: 'Hoàng Thị Lan',
    email: 'lan@caffepremium.com',
    role: 2,
    phone: '0967890123',
  },
  {
    id: '12',
    name: 'Itou Ryusei',
    email: 'ryusei.itou@test.com',
    role: 1,
    phone: '0978901234',
  },
  {
    id: '13',
    name: 'Vũ Minh Khoa',
    email: 'khoa@staffcafe.com',
    role: 4,
    phone: '0989012345',
  },
];

const ROLE_CONFIG: Record<
  number,
  { label: string; labelJp: string; color: string }
> = {
  1: {
    label: 'Khách hàng',
    labelJp: '顧客',
    color: 'bg-blue-100 text-blue-700',
  },
  2: {
    label: 'Chủ quán',
    labelJp: '店主',
    color: 'bg-green-100 text-green-700',
  },
  3: {
    label: 'Quản trị viên',
    labelJp: '管理者',
    color: 'bg-purple-100 text-purple-700',
  },
  4: {
    label: 'Nhân viên',
    labelJp: 'スタッフ',
    color: 'bg-orange-100 text-orange-700',
  },
};

type FilterField = 'name' | 'email';

export default function AdminUserManagementPage() {
  const [allUsers, setAllUsers] = useState<UserRecord[]>([]);
  const [searchText, setSearchText] = useState('');
  const [pendingSearch, setPendingSearch] = useState('');
  const [filterField, setFilterField] = useState<FilterField>('name');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [adminStats, setAdminStats] = useState({ activeReports: 0 });

  const { logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load from localStorage (seeded by AuthContext) + extra mock
    const usersJson = localStorage.getItem('users');
    const storedUsers: UserRecord[] = usersJson ? JSON.parse(usersJson) : [];

    // Merge stored with extra mocks (avoid duplicates by id)
    const storedIds = new Set(storedUsers.map((u) => u.id));
    const merged = [
      ...storedUsers,
      ...EXTRA_MOCK_USERS.filter((u) => !storedIds.has(u.id)),
    ];
    setAllUsers(merged);

    // Load report stats for sidebar badge
    const reportsJson = localStorage.getItem('reports');
    const reports = reportsJson ? JSON.parse(reportsJson) : [];
    const activeReports = reports.filter((r: any) => r.status === 'active').length;
    setAdminStats({ activeReports });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = () => {
    setSearchText(pendingSearch);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredUsers = allUsers.filter((u) => {
    if (!searchText) return true;
    const lowerSearch = searchText.toLowerCase();
    if (filterField === 'name') return u.name.toLowerCase().includes(lowerSearch);
    if (filterField === 'email') return u.email.toLowerCase().includes(lowerSearch);
    return true;
  });

  const isActive = (path: string) => location.pathname === path;

  const navItemClass = (path: string) =>
    `w-full justify-start ${
      isActive(path)
        ? 'bg-amber-50 text-amber-800 font-semibold'
        : 'text-gray-700'
    }`;

  const openDetail = (user: UserRecord) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const getRoleLabel = (role: number) => {
    const cfg = ROLE_CONFIG[role];
    if (!cfg) return 'N/A';
    return language === 'jp' ? cfg.labelJp : cfg.label;
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── Sidebar ── */}
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
            className={navItemClass('/admin')}
            onClick={() => navigate('/admin')}
          >
            <BarChart3 className="size-4 mr-2" />
            {language === 'jp' ? 'ダッシュボード' : 'Dashboard'}
          </Button>

          <Button
            variant="ghost"
            className={navItemClass('/admin/users')}
            onClick={() => navigate('/admin/users')}
          >
            <Users className="size-4 mr-2" />
            {language === 'jp' ? 'ユーザー管理' : 'Quản lý người dùng'}
          </Button>

          <Button
            variant="ghost"
            className={navItemClass('/admin/cafes')}
            onClick={() => navigate('/admin/cafes')}
          >
            <Store className="size-4 mr-2" />
            {language === 'jp' ? 'カフェ管理' : 'Quản lý quán'}
          </Button>

          <Button
            variant="ghost"
            className={navItemClass('/admin/reports')}
            onClick={() => navigate('/admin/reports')}
          >
            <AlertTriangle className="size-4 mr-2" />
            {language === 'jp' ? 'レポート管理' : 'Quản lý báo cáo'}
            {adminStats.activeReports > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                {adminStats.activeReports}
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

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="border-b bg-white px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-gray-800">
            {language === 'jp'
              ? 'システムユーザー管理'
              : 'Quản lý người dùng hệ thống'}
          </h2>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* ── Search & Filter Bar ── */}
            <div className="p-5 border-b bg-gray-50/60">
              {/* Filter toggle */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">
                  {language === 'jp' ? 'フィルター：' : 'Lọc theo:'}
                </span>
                <button
                  onClick={() => setFilterField('name')}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filterField === 'name'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400'
                  }`}
                >
                  {language === 'jp' ? '名前' : 'Tên'}
                </button>
                <button
                  onClick={() => setFilterField('email')}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filterField === 'email'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-amber-400'
                  }`}
                >
                  Email
                </button>
              </div>

              {/* Search input + button */}
              <div className="flex gap-2 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    className="pl-9 bg-white"
                    placeholder={
                      filterField === 'name'
                        ? language === 'jp'
                          ? '名前で検索...'
                          : 'Tìm theo tên...'
                        : language === 'jp'
                        ? 'メールで検索...'
                        : 'Tìm theo email...'
                    }
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  {pendingSearch && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setPendingSearch('');
                        setSearchText('');
                      }}
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
                      {language === 'jp' ? 'ユーザー名' : 'Tên người dùng'}
                    </th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-center py-3 px-4">
                      {language === 'jp' ? '役割' : 'Vai trò'}
                    </th>
                    <th className="text-center py-3 px-4">
                      {language === 'jp' ? 'アクション' : 'Hành động'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-14 text-gray-400">
                        <Users className="size-10 mx-auto mb-2 opacity-30" />
                        <p>
                          {language === 'jp'
                            ? 'ユーザーが見つかりません'
                            : 'Không tìm thấy người dùng'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, idx) => {
                      const cfg = ROLE_CONFIG[u.role];
                      return (
                        <tr
                          key={u.id}
                          className="border-b last:border-b-0 hover:bg-amber-50/40 transition-colors"
                        >
                          {/* STT */}
                          <td className="text-center py-3.5 px-4 text-gray-500">
                            {idx + 1}
                          </td>

                          {/* Name + avatar */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="size-8 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="size-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xs font-semibold">
                                  {getInitials(u.name)}
                                </div>
                              )}
                              <span className="text-gray-800">{u.name}</span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-3.5 px-4 text-gray-600">
                            {u.email}
                          </td>

                          {/* Role badge */}
                          <td className="py-3.5 px-4 text-center">
                            {cfg && (
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
                              >
                                {getRoleLabel(u.role)}
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-500"
                              onClick={() => openDetail(u)}
                            >
                              <ChevronRight className="size-3.5 mr-1" />
                              {language === 'jp' ? '詳細を見る' : 'Xem chi tiết'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Footer count ── */}
            <div className="px-5 py-3 border-t bg-gray-50/60 text-sm text-gray-500 flex items-center justify-between">
              <span>
                {language === 'jp'
                  ? `総ユーザー数：${filteredUsers.length}`
                  : `Tổng số người dùng: ${filteredUsers.length}`}
                {searchText && (
                  <span className="ml-2 text-gray-400">
                    {language === 'jp'
                      ? `（全${allUsers.length}件中）`
                      : `(trong tổng ${allUsers.length})`}
                  </span>
                )}
              </span>
              {searchText && (
                <button
                  className="text-amber-700 hover:underline text-xs"
                  onClick={() => {
                    setPendingSearch('');
                    setSearchText('');
                  }}
                >
                  {language === 'jp' ? '検索をクリア' : 'Xóa tìm kiếm'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── User Detail Dialog ── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle>
              {language === 'jp' ? 'ユーザー詳細' : 'Chi tiết người dùng'}
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-5">
              {/* Avatar + name */}
              <div className="flex flex-col items-center gap-3 py-3">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="size-20 rounded-full object-cover border-4 border-amber-100"
                  />
                ) : (
                  <div className="size-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold border-4 border-amber-50">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div className="text-center">
                  <p className="font-semibold text-gray-900 text-lg">
                    {selectedUser.name}
                  </p>
                  {(() => {
                    const cfg = ROLE_CONFIG[selectedUser.role];
                    return cfg ? (
                      <span
                        className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
                      >
                        {getRoleLabel(selectedUser.role)}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Info grid */}
              <div className="bg-gray-50 rounded-lg divide-y text-sm">
                <InfoRow
                  icon={<User className="size-4 text-gray-400" />}
                  label={language === 'jp' ? 'ID' : 'ID'}
                  value={`#${selectedUser.id}`}
                />
                <InfoRow
                  icon={<Mail className="size-4 text-gray-400" />}
                  label="Email"
                  value={selectedUser.email}
                />
                <InfoRow
                  icon={<Phone className="size-4 text-gray-400" />}
                  label={
                    language === 'jp' ? '電話番号' : 'Số điện thoại'
                  }
                  value={selectedUser.phone || '—'}
                />
                <InfoRow
                  icon={<Shield className="size-4 text-gray-400" />}
                  label={language === 'jp' ? '役割' : 'Vai trò'}
                  value={getRoleLabel(selectedUser.role)}
                />
              </div>

              {/* Close button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDetailOpen(false)}
              >
                {language === 'jp' ? '閉じる' : 'Đóng'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
    <div className="flex items-center gap-3 px-4 py-3">
      {icon}
      <span className="text-gray-500 w-28 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium truncate">{value}</span>
    </div>
  );
}
