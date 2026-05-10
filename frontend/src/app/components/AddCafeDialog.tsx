import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useLanguage } from '../contexts/LanguageContext';

interface AddCafeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (cafeData: {
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
  }) => void;
}

export function AddCafeDialog({ open, onClose, onSubmit }: AddCafeDialogProps) {
  const [name, setName] = useState('');
  const [nameJP, setNameJP] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [amenities, setAmenities] = useState({
    hasWifi: false,
    hasAC: false,
    hasOutlet: false,
    noSmoking: false,
    hasSnacks: false,
    hasCoffee: false,
  });
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !nameJP || !address || !phone) {
      setError(language === 'jp' ? '必須項目を入力してください' : 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    onSubmit({
      name,
      nameJP,
      address,
      phone,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      amenities,
    });

    // Reset form
    setName('');
    setNameJP('');
    setAddress('');
    setPhone('');
    setCoverImage('');
    setAmenities({
      hasWifi: false,
      hasAC: false,
      hasOutlet: false,
      noSmoking: false,
      hasSnacks: false,
      hasCoffee: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {language === 'jp' ? 'カフェ情報を入力' : 'Nhập thông tin quán'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nameJP">
              {language === 'jp' ? 'カフェ名（日本語）' : 'Tên quán (Tiếng Nhật)'} *
            </Label>
            <Input
              id="nameJP"
              type="text"
              value={nameJP}
              onChange={(e) => setNameJP(e.target.value)}
              placeholder={language === 'jp' ? 'コーヒーハウス' : 'Coffee House'}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="name">
              {language === 'jp' ? 'カフェ名（ベトナム語）' : 'Tên quán (Tiếng Việt)'} *
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Coffee House"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="address">
              {language === 'jp' ? '住所' : 'Địa chỉ'} *
            </Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={language === 'jp' ? '1 Tràng Tiền, Hoàn Kiếm, Hà Nội' : '1 Tràng Tiền, Hoàn Kiếm, Hà Nội'}
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="phone">
              {language === 'jp' ? '電話番号' : 'Số điện thoại'} *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="024 3825 7959"
              required
              className="mt-2"
            />
          </div>

          <div className="space-y-3">
            <Label>
              {language === 'jp' ? '設備・サービス' : 'Tiện ích'}
            </Label>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasWifi"
                  checked={amenities.hasWifi}
                  onCheckedChange={(checked) => 
                    setAmenities({ ...amenities, hasWifi: checked as boolean })
                  }
                />
                <Label htmlFor="hasWifi" className="cursor-pointer font-normal">
                  {t('hasWifi')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAC"
                  checked={amenities.hasAC}
                  onCheckedChange={(checked) => 
                    setAmenities({ ...amenities, hasAC: checked as boolean })
                  }
                />
                <Label htmlFor="hasAC" className="cursor-pointer font-normal">
                  {t('hasAC')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasOutlet"
                  checked={amenities.hasOutlet}
                  onCheckedChange={(checked) => 
                    setAmenities({ ...amenities, hasOutlet: checked as boolean })
                  }
                />
                <Label htmlFor="hasOutlet" className="cursor-pointer font-normal">
                  {t('hasOutlet')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noSmoking"
                  checked={amenities.noSmoking}
                  onCheckedChange={(checked) => 
                    setAmenities({ ...amenities, noSmoking: checked as boolean })
                  }
                />
                <Label htmlFor="noSmoking" className="cursor-pointer font-normal">
                  {t('noSmoking')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasSnacks"
                  checked={amenities.hasSnacks}
                  onCheckedChange={(checked) => 
                    setAmenities({ ...amenities, hasSnacks: checked as boolean })
                  }
                />
                <Label htmlFor="hasSnacks" className="cursor-pointer font-normal">
                  {t('hasSnacks')}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCoffee"
                  checked={amenities.hasCoffee}
                  onCheckedChange={(checked) => 
                    setAmenities({ ...amenities, hasCoffee: checked as boolean })
                  }
                />
                <Label htmlFor="hasCoffee" className="cursor-pointer font-normal">
                  {t('hasCoffee')}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>
              {language === 'jp' ? 'カバー画像' : 'Ảnh bìa'}
            </Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-40 object-cover mt-2"
              />
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {language === 'jp' ? 'キャンセル' : 'Hủy'}
            </Button>
            <Button type="submit">
              {language === 'jp' ? '登録' : 'Đăng ký'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}