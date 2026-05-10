import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { UserPlus } from 'lucide-react';
import { autoTranslate } from '../utils/mockData';

interface AddStaffDialogProps {
  open: boolean;
  onClose: () => void;
  cafeId: string;
  onSubmit: (data: {
    name: string;
    phone: string;
    email: string;
    position: string;
    positionJP: string;
    avatar: string;
  }) => void;
}

export function AddStaffDialog({ open, onClose, cafeId, onSubmit }: AddStaffDialogProps) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [avatar, setAvatar] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [inputLanguage, setInputLanguage] = useState<'vn' | 'jp'>('vn');

  const positions = [
    { vn: 'Quản lý', jp: 'マネージャー' },
    { vn: 'Barista', jp: 'バリスタ' },
    { vn: 'Thu ngân', jp: 'レジ係' },
    { vn: 'Phục vụ', jp: 'サーバー' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(language === 'jp' ? '画像ファイルを選択してください' : 'Vui lòng chọn file ảnh');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(language === 'jp' ? 'ファイルサイズは5MB以下にしてください' : 'Kích thước file tối đa 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError(language === 'jp' ? '名前を入力してください' : 'Vui lòng nhập tên');
      return;
    }

    if (!phone.trim()) {
      setError(language === 'jp' ? '電話番号を入力してください' : 'Vui lòng nhập số điện thoại');
      return;
    }

    if (!position.trim()) {
      setError(language === 'jp' ? '役職を入力してください' : 'Vui lòng nhập vị trí');
      return;
    }

    // Auto-translate position
    const positionVN = inputLanguage === 'vn' ? position.trim() : autoTranslate(position.trim(), 'jp', 'vn');
    const positionJP = inputLanguage === 'jp' ? position.trim() : autoTranslate(position.trim(), 'vn', 'jp');

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      position: positionVN,
      positionJP: positionJP,
      avatar: avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    });

    // Reset form
    setName('');
    setPhone('');
    setEmail('');
    setPosition('');
    setAvatar('');
    setImageFile(null);
    setError('');
  };

  const handleClose = () => {
    setName('');
    setPhone('');
    setEmail('');
    setPosition('');
    setAvatar('');
    setImageFile(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-amber-700" />
            {language === 'jp' ? 'スタッフ追加' : 'Thêm nhân viên mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">
              {language === 'jp' ? '名前' : 'Họ và tên'} *
            </Label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'jp' ? '例: 山田太郎' : 'Ví dụ: Nguyễn Văn A'}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">
              {language === 'jp' ? '電話番号' : 'Số điện thoại'} *
            </Label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123456789"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">
              {language === 'jp' ? 'メール' : 'Email'} ({language === 'jp' ? '任意' : 'Tùy chọn'})
            </Label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
          </div>

          {/* Position Language Selection */}
          <div>
            <Label>{language === 'jp' ? '役職入力言語' : 'Ngôn ngữ nhập vị trí'}</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                variant={inputLanguage === 'vn' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputLanguage('vn')}
                className={inputLanguage === 'vn' ? 'bg-amber-700 hover:bg-amber-800' : ''}
              >
                Tiếng Việt
              </Button>
              <Button
                type="button"
                variant={inputLanguage === 'jp' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputLanguage('jp')}
                className={inputLanguage === 'jp' ? 'bg-amber-700 hover:bg-amber-800' : ''}
              >
                日本語
              </Button>
            </div>
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="position">
              {language === 'jp' ? '役職' : 'Vị trí'} *
            </Label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            >
              <option value="">{language === 'jp' ? '選択してください' : 'Chọn vị trí'}</option>
              {positions.map((pos, idx) => (
                <option key={idx} value={inputLanguage === 'vn' ? pos.vn : pos.jp}>
                  {inputLanguage === 'vn' ? pos.vn : pos.jp}
                </option>
              ))}
            </select>
          </div>

          {/* Avatar Upload */}
          <div>
            <Label htmlFor="avatarUpload">
              {language === 'jp' ? 'プロフィール写真' : 'Ảnh đại diện'} ({language === 'jp' ? '任意' : 'Tùy chọn'})
            </Label>
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
            {avatar && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={avatar} 
                  alt="Avatar Preview" 
                  className="size-24 rounded-full object-cover"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {language === 'jp' 
                ? '5MB以下の画像ファイルを選択してください。指定しない場合はランダムなアバターが割り当てられます。' 
                : 'Chọn file ảnh dưới 5MB. Nếu không chọn, hệ thống sẽ tự động tạo avatar.'}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {language === 'jp' ? 'キャンセル' : 'Hủy'}
            </Button>
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
              <UserPlus className="size-4 mr-2" />
              {language === 'jp' ? '追加' : 'Thêm nhân viên'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}