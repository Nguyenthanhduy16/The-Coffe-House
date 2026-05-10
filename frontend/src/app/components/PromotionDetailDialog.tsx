import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent } from './ui/dialog';
import { Clock } from 'lucide-react';

interface PromotionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  promotion: {
    title: string;
    titleJP: string;
    description: string;
    descriptionJP: string;
    image: string;
    validUntil: string;
  };
}

export function PromotionDetailDialog({ open, onClose, promotion }: PromotionDetailDialogProps) {
  const { language } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden" aria-describedby={undefined}>
        {/* Promotion Image */}
        <div className="w-full h-[40vh]">
          <img
            src={promotion.image}
            alt={language === 'jp' ? promotion.titleJP : promotion.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Promotion Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3">
            {language === 'jp' ? promotion.titleJP : promotion.title}
          </h2>
          
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
            {language === 'jp' ? promotion.descriptionJP : promotion.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="size-4" />
            <span>
              {language === 'jp' ? '有効期限: ' : 'Có hiệu lực đến: '}
              {new Date(promotion.validUntil).toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN')}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}