import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import {
  Coffee, Users, Store, AlertTriangle, BarChart3, User, TrendingUp,
} from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCafes: 0,
    totalReports: 0,
    activeReports: 0,
  });

  const { logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const cafes = JSON.parse(localStorage.getItem('cafes') || '[]');
    const reports = JSON.parse(localStorage.getItem('reports') || '[]');
    const active = reports.filter((r: any) => r.status === 'active');
    setStats({
      totalUsers: users.length,
      totalCafes: cafes.length,
      totalReports: reports.length,
      activeReports: active.length,
    });
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path: string) => location.pathname === path;
  const navCls = (path: string) =>
    `w-full justify-start ${isActive(path) ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-gray-700'}`;

  const statCards = [
    {
      key: 'users',
      label: language === 'jp' ? '総ユーザー数' : 'Tổng người dùng',
      sublabel: language === 'jp' ? '登録済みアカウント' : 'Tài khoản đã đăng ký',
      value: stats.totalUsers,
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      numColor: 'text-blue-700',
      borderColor: 'border-l-blue-500',
      badge: null,
    },
    {
      key: 'cafes',
      label: language === 'jp' ? '総カフェ数' : 'Tổng quán cà phê',
      sublabel: language === 'jp' ? 'システム登録済み' : 'Đã đăng ký trong hệ thống',
      value: stats.totalCafes,
      icon: Store,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      numColor: 'text-green-700',
      borderColor: 'border-l-green-500',
      badge: null,
    },
    {
      key: 'reports',
      label: language === 'jp' ? '総レポート数' : 'Tổng báo cáo',
      sublabel: language === 'jp' ? '全期間の累計' : 'Tổng cộng tất cả thời gian',
      value: stats.totalReports,
      icon: BarChart3,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      numColor: 'text-amber-700',
      borderColor: 'border-l-amber-500',
      badge: null,
    },
    {
      key: 'active',
      label: language === 'jp' ? '未処理レポート' : 'Báo cáo chờ xử lý',
      sublabel: language === 'jp' ? '早急な対応が必要' : 'Cần xử lý sớm',
      value: stats.activeReports,
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      numColor: 'text-red-700',
      borderColor: 'border-l-red-500',
      badge: stats.activeReports > 0
        ? language === 'jp' ? '要対応' : 'Cần xử lý'
        : null,
    },
  ];

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
          <Button variant="ghost" className={navCls('/admin')} onClick={() => navigate('/admin')}>
            <BarChart3 className="size-4 mr-2" />
            {language === 'jp' ? 'ダッシュボード' : 'Dashboard'}
          </Button>
          <Button variant="ghost" className={navCls('/admin/users')} onClick={() => navigate('/admin/users')}>
            <Users className="size-4 mr-2" />
            {language === 'jp' ? 'ユーザー管理' : 'Quản lý người dùng'}
          </Button>
          <Button variant="ghost" className={navCls('/admin/cafes')} onClick={() => navigate('/admin/cafes')}>
            <Store className="size-4 mr-2" />
            {language === 'jp' ? 'カフェ管理' : 'Quản lý quán'}
          </Button>
          <Button variant="ghost" className={navCls('/admin/reports')} onClick={() => navigate('/admin/reports')}>
            <AlertTriangle className="size-4 mr-2" />
            {language === 'jp' ? 'レポート管理' : 'Quản lý báo cáo'}
            {stats.activeReports > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                {stats.activeReports}
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
        {/* Top bar */}
        <div className="border-b bg-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-amber-700" />
            <h2 className="font-bold text-gray-800">
              {language === 'jp' ? 'ダッシュボード' : 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
          </div>
        </div>

        {/* Content — vertically + horizontally centered */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className={`bg-white rounded-2xl shadow-md border border-gray-100 border-l-4 ${card.borderColor} p-6 flex items-center gap-5`}
                >
                  {/* Icon block */}
                  <div className={`${card.iconBg} rounded-2xl p-4 shrink-0`}>
                    <Icon className={`size-8 ${card.iconColor}`} />
                  </div>

                  {/* Text block */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-500 leading-snug">
                        {card.label}
                      </p>
                      {card.badge && (
                        <span className="shrink-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-5xl font-black tracking-tight mt-1 ${card.numColor}`}>
                      {card.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {card.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
