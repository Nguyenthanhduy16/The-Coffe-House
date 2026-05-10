import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { autoTranslate } from '../utils/mockData';

interface AddPromotionDialogProps {
  open: boolean;
  onClose: () => void;
  cafeId: string;
  onSubmit: (data: {
    title: string;
    titleJP: string;
    description: string;
    descriptionJP: string;
    image: string;
    duration: string;
  }) => void;
}

export function AddPromotionDialog({ open, onClose, cafeId, onSubmit }: AddPromotionDialogProps) {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [duration, setDuration] = useState('7');
  const [error, setError] = useState('');
  const [inputLanguage, setInputLanguage] = useState<'vn' | 'jp'>('vn'); // Default to Vietnamese

  const durations = [
    { value: '1', label: language === 'jp' ? '24時間' : '24 giờ' },
    { value: '3', label: language === 'jp' ? '3日間' : '3 ngày' },
    { value: '7', label: language === 'jp' ? '1週間' : '1 tuần' },
    { value: '14', label: language === 'jp' ? '2週間' : '2 tuần' },
    { value: '30', label: language === 'jp' ? '1ヶ月' : '1 tháng' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(language === 'jp' ? '画像ファイルを選択してください' : 'Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(language === 'jp' ? 'ファイルサイズは5MB以下にしてください' : 'Kích thước file tối đa 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError(language === 'jp' ? 'タイトルを入力してください' : 'Vui lòng nhập tiêu đề');
      return;
    }

    if (!description.trim()) {
      setError(language === 'jp' ? '説明を入力してください' : 'Vui lòng nhập mô tả');
      return;
    }

    if (!image.trim()) {
      setError(language === 'jp' ? '画像URLを入力してください' : 'Vui lòng nhập URL hình ảnh');
      return;
    }

    // Auto-translate based on input language
    const titleVN = inputLanguage === 'vn' ? title.trim() : autoTranslate(title.trim(), 'jp', 'vn');
    const titleJP = inputLanguage === 'jp' ? title.trim() : autoTranslate(title.trim(), 'vn', 'jp');
    const descriptionVN = inputLanguage === 'vn' ? description.trim() : autoTranslate(description.trim(), 'jp', 'vn');
    const descriptionJP = inputLanguage === 'jp' ? description.trim() : autoTranslate(description.trim(), 'vn', 'jp');

    onSubmit({
      title: titleVN,
      titleJP: titleJP,
      description: descriptionVN,
      descriptionJP: descriptionJP,
      image: image.trim(),
      duration,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setImage('');
    setDuration('7');
    setError('');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setImage('');
    setDuration('7');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="size-5 text-amber-700" />
            {language === 'jp' ? 'プロモーション追加' : 'Thêm khuyến mãi mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Language Selection */}
          <div>
            <Label>{language === 'jp' ? '入力言語' : 'Ngôn ngữ nhập liệu'}</Label>
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
            <p className="text-xs text-gray-500 mt-1">
              {language === 'jp' 
                ? 'システムが自動的にもう一つの言語に翻訳します' 
                : 'Hệ thống sẽ tự động dịch sang ngôn ngữ còn lại'}
            </p>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">
              {language === 'jp' ? 'タイトル' : 'Tiêu đề'} *
            </Label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                inputLanguage === 'vn' 
                  ? 'Ví dụ: Giảm 20% tất cả đồ uống' 
                  : '例: 全ドリンク20%オフ'
              }
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              {language === 'jp' ? '説明' : 'Mô tả'} *
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                inputLanguage === 'vn'
                  ? 'Mô tả chi tiết về chương trình khuyến mãi...'
                  : 'プロモーションの詳細を入力...'
              }
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent min-h-[80px] resize-y"
            />
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image">
              {language === 'jp' ? '画像URL' : 'URL hình ảnh'} *
            </Label>
            <input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
            {image && (
              <div className="mt-2">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {language === 'jp' 
                ? 'Unsplashなどの画像URLを入力してください' 
                : 'Sử dụng URL từ Unsplash hoặc nguồn ảnh khác'}
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="imageUpload">
              {language === 'jp' ? '画像アップロード' : 'Tải ảnh lên'} *
            </Label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            />
            {imageFile && (
              <div className="mt-2">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {language === 'jp' 
                ? '5MB以下の画像ファイルを選択してください' 
                : 'Chọn file ảnh dưới 5MB'}
            </p>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration">
              {language === 'jp' ? '有効期間' : 'Thời gian hiệu lực'} *
            </Label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
            >
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {language === 'jp' ? 'キャンセル' : 'Hủy'}
            </Button>
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
              <ImagePlus className="size-4 mr-2" />
              {language === 'jp' ? '追加' : 'Thêm khuyến mãi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}