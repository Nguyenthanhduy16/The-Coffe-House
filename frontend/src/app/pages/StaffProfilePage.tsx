import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

export default function StaffProfilePage() {
  const { user, updateUser, deleteAccount, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = () => {
    updateUser({ name, phone, email });
    navigate('/staff');
  };

  const handleDeleteAccount = () => {
    const confirmMessage = language === 'jp' 
      ? 'アカウントを削除してもよろしいですか？この操作は元に戻せません。'
      : 'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.';
    
    if (confirm(confirmMessage)) {
      deleteAccount();
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClose = () => {
    navigate('/staff');
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-6">
          {language === 'jp' ? 'プロフィール' : 'Thông tin cá nhân'}
        </h2>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="size-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{(name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div>
            <Label className="text-gray-600">
              {language === 'jp' ? '役割' : 'Vai trò'}
            </Label>
            <p className="font-medium mt-1">
              {language === 'jp' ? 'スタッフ' : 'Nhân viên'}
            </p>
          </div>

          <div>
            <Label htmlFor="name">
              {language === 'jp' ? '名前' : 'Họ tên'}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">
              {language === 'jp' ? 'メール' : 'Email'}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">
              {language === 'jp' ? '電話番号' : 'Số điện thoại'}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            {language === 'jp' ? '変更を保存' : 'Lưu thay đổi'}
          </Button>

          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            className="w-full"
          >
            {language === 'jp' ? 'アカウント削除' : 'Xóa tài khoản'}
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full"
          >
            {language === 'jp' ? 'ログアウト' : 'Đăng xuất'}
          </Button>
        </div>
      </div>
    </div>
  );
}
