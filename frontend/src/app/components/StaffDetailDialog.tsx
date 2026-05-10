import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent } from './ui/dialog';
import { Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { type Staff } from '../utils/mockData';

interface StaffDetailDialogProps {
  open: boolean;
  onClose: () => void;
  staff: Staff;
}

export function StaffDetailDialog({ open, onClose, staff }: StaffDetailDialogProps) {
  const { language } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby={undefined}>
        {/* Staff Profile */}
        <div className="flex flex-col items-center text-center pt-6">
          <img
            src={staff.avatar || 'https://i.pravatar.cc/150?img=1'}
            alt={staff.name}
            className="size-24 rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold mb-1">{staff.name}</h2>
          <p className="text-amber-700 font-medium mb-6">
            {language === 'jp' ? staff.positionJP : staff.position}
          </p>

          {/* Contact Info */}
          <div className="w-full space-y-3 text-left bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 mb-0.5">
                  {language === 'jp' ? '電話番号' : 'Số điện thoại'}
                </div>
                <div className="font-medium">{staff.phone}</div>
              </div>
            </div>

            {staff.email && (
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">
                    {language === 'jp' ? 'メール' : 'Email'}
                  </div>
                  <div className="font-medium">{staff.email}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Briefcase className="size-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 mb-0.5">
                  {language === 'jp' ? '役職' : 'Vị trí'}
                </div>
                <div className="font-medium">
                  {language === 'jp' ? staff.positionJP : staff.position}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-gray-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500 mb-0.5">
                  {language === 'jp' ? '入社日' : 'Ngày vào làm'}
                </div>
                <div className="font-medium">
                  {new Date(staff.joinedDate).toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}