import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router';

interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { user, updateUser, deleteAccount, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = () => {
    updateUser({ name: fullName, phone, email });
    onClose();
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

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('profile')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="size-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{(user.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div>
            <Label className="text-gray-600">{t('role')}</Label>
            <p className="font-medium">{t(String(user.role))}</p>
          </div>

          <div>
            <Label htmlFor="fullName">{t('fullName')}</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">{t('phoneNumber')}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            {t('saveChanges')}
          </Button>

          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            className="w-full"
          >
            {t('deleteAccount')}
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full"
          >
            {t('logout')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}