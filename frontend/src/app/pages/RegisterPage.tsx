import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { LanguageToggle } from '../components/LanguageToggle';
import { Coffee } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword || !role) {
      setError(language === 'jp' ? 'すべての項目を入力してください' : 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      setError(language === 'jp' ? 'パスワードが一致しません' : 'Mật khẩu xác nhận không khớp');
      return;
    }

    const success = register({
      email,
      name,
      role: parseInt(role) as 1 | 2 | 3 | 4,
      password,
    } as any);

    if (!success) {
      setError(language === 'jp' ? 'このメールは既に登録されています' : 'Email này đã được đăng ký');
      return;
    }

    // Redirect based on role
    if (role === '1') {
      navigate('/');
    } else if (role === '2') {
      navigate('/cafe-setup');
    } else if (role === '4') {
      navigate('/staff');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-amber-700" />
            <h1 className="font-bold">どこカフェ</h1>
          </div>
          <LanguageToggle />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">{t('register')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('fullName')}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>{t('selectRole')}</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCustomer"
                  checked={role === '1'}
                  onCheckedChange={() => setRole('1')}
                />
                <Label htmlFor="isCustomer" className="cursor-pointer font-normal">
                  {t('iAmCustomer')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isOwner"
                  checked={role === '2'}
                  onCheckedChange={() => setRole('2')}
                />
                <Label htmlFor="isOwner" className="cursor-pointer font-normal">
                  {t('iAmOwner')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isStaff"
                  checked={role === '4'}
                  onCheckedChange={() => setRole('4')}
                />
                <Label htmlFor="isStaff" className="cursor-pointer font-normal">
                  {language === 'jp' ? '私はスタッフです' : 'Tôi là nhân viên'}
                </Label>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full">
              {t('register')}
            </Button>

            <div className="text-center text-sm text-gray-600">
              {t('haveAccount')}{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                {t('login')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}