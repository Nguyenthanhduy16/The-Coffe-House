import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getStaff, getCafes, type Staff, type Cafe } from '../utils/mockData';
import { Button } from '../components/ui/button';
import { Coffee, Clock, LogOut, User } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

export default function StaffHomePage() {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [staffRecord, setStaffRecord] = useState<Staff | null>(null);
  const [assignedCafe, setAssignedCafe] = useState<Cafe | null>(null);

  useEffect(() => {
    if (!user || user.role !== 4) {
      navigate('/login');
      return;
    }

    // Check if user is assigned to any cafe
    const allStaff = getStaff();
    const staffData = allStaff.find(s => s.email === user.email);

    if (staffData) {
      setStaffRecord(staffData);
      
      // Get assigned cafe
      const allCafes = getCafes();
      const cafe = allCafes.find(c => c.id === staffData.cafeId);
      if (cafe) {
        setAssignedCafe(cafe);
      }
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewCafe = () => {
    if (assignedCafe) {
      navigate(`/staff/cafe/${assignedCafe.id}`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-amber-700" />
            <h1 className="font-bold">どこカフェ</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/staff/profile')}
            >
              <Avatar className="size-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="size-4 mr-2" />
              {language === 'jp' ? 'ログアウト' : 'Đăng xuất'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {!staffRecord ? (
            // Waiting Screen
            <Card className="p-12 text-center">
              <Clock className="size-16 mx-auto mb-6 text-amber-700 animate-pulse" />
              <h2 className="text-2xl font-bold mb-3">
                {language === 'jp' ? 'お待ちください' : 'Vui lòng chờ'}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === 'jp' 
                  ? '店長があなたを追加するまでお待ちください。追加されると、ここに店舗情報が表示されます。' 
                  : 'Bạn vui lòng chờ chủ quán sẽ thêm bạn vào hệ thống. Khi được thêm, thông tin quán sẽ hiển thị ở đây.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">
                  {language === 'jp' ? 'アカウント情報:' : 'Thông tin tài khoản:'}
                </p>
                <p>{language === 'jp' ? '名前: ' : 'Tên: '}{user.name}</p>
                <p>{language === 'jp' ? 'メール: ' : 'Email: '}{user.email}</p>
                <p className="mt-2 text-xs">
                  {language === 'jp' 
                    ? '店長にこのメールアドレスを伝えてください' 
                    : 'Vui lòng cung cấp email này cho chủ quán'}
                </p>
              </div>
            </Card>
          ) : (
            // Assigned Cafe Card
            <Card className="overflow-hidden">
              {assignedCafe && (
                <>
                  <div className="h-48 relative">
                    <img
                      src={assignedCafe.images?.[0] || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'}
                      alt={assignedCafe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">
                      {language === 'jp' ? assignedCafe.nameJP : assignedCafe.name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {language === 'jp' ? staffRecord.positionJP : staffRecord.position}
                    </p>
                    <div className="mb-6 space-y-2 text-sm text-gray-700">
                      <p>
                        {language === 'jp' ? '入社日: ' : 'Ngày vào làm: '}
                        {new Date(staffRecord.joinedDate).toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN')}
                      </p>
                      <p className="text-gray-500">
                        {language === 'jp' 
                          ? '下のボタンをクリックして店舗管理画面にアクセスできます' 
                          : 'Click vào nút bên dưới để truy cập trang quản lý quán'}
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-amber-700 hover:bg-amber-800"
                      onClick={handleViewCafe}
                    >
                      <Coffee className="size-4 mr-2" />
                      {language === 'jp' ? '店舗管理画面へ' : 'Vào trang quản lý'}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}