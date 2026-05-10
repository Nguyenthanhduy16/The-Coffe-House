import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';

interface ReportReviewDialogProps {
  open: boolean;
  onClose: () => void;
  reviewId: string;
  cafeId: string;
  reviewContent: string;
  reviewerName: string;
}

const REPORT_REASONS = {
  jp: [
    '虚偽の内容',
    '攻撃的な言葉',
    'スパム',
    '関係のない内容',
    '競合他社による妨害',
    'その他',
  ],
  vn: [
    'Nội dung sai sự thật',
    'Ngôn từ công kích',
    'Spam',
    'Nội dung không liên quan',
    'Cạnh tranh không lành mạnh',
    'Khác',
  ],
};

export function ReportReviewDialog({
  open,
  onClose,
  reviewId,
  cafeId,
  reviewContent,
  reviewerName,
}: ReportReviewDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { language } = useLanguage();
  const { user } = useAuth();

  const reasons = language === 'jp' ? REPORT_REASONS.jp : REPORT_REASONS.vn;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedReason) {
      setError(language === 'jp' ? '理由を選択してください' : 'Vui lòng chọn lý do');
      return;
    }

    // Create report
    const report = {
      id: `report_${Date.now()}`,
      reviewId,
      cafeId,
      reporterId: user?.id || '',
      reporterName: user?.name || '',
      reviewContent,
      reviewerName,
      reason: selectedReason,
      details,
      status: 'pending', // pending, resolved, rejected
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const reportsJson = localStorage.getItem('reviewReports');
    const reports = reportsJson ? JSON.parse(reportsJson) : [];
    reports.push(report);
    localStorage.setItem('reviewReports', JSON.stringify(reports));

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
      setSelectedReason('');
      setDetails('');
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-orange-500" />
            {language === 'jp' ? 'レューを通報' : 'Khiếu nại đánh giá'}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium">
              {language === 'jp' ? '通報を送信しました' : 'Đã gửi khiếu nại thành công'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'jp' 
                ? '管理者が確認します' 
                : 'Admin sẽ xem xét trong thời gian sớm nhất'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Review Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs font-medium text-gray-700 mb-1">
                {language === 'jp' ? 'レビュー内容' : 'Nội dung đánh giá'}
              </div>
              <div className="text-xs text-gray-600 mb-1">
                {language === 'jp' ? 'レビュアー' : 'Người đánh giá'}: <span className="font-medium">{reviewerName}</span>
              </div>
              <div className="text-sm text-gray-900 italic line-clamp-2">"{reviewContent}"</div>
            </div>

            {/* Reason Selection */}
            <div>
              <Label className="mb-2 block text-sm">
                {language === 'jp' ? '通報理由' : 'Lý do khiếu nại'} *
              </Label>
              <div className="space-y-1.5">
                {reasons.map((reason, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-2 border rounded cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? 'border-amber-700 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <Label htmlFor="details" className="text-sm">
                {language === 'jp' ? '詳細（任意）' : 'Chi tiết (không bắt buộc)'}
              </Label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  language === 'jp'
                    ? '追加情報があれば入力してください...'
                    : 'Mô tả chi tiết về vấn đề...'
                }
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent min-h-[80px] resize-y text-sm"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-white">
              <Button type="button" variant="outline" onClick={onClose} size="sm">
                {language === 'jp' ? 'キャンセル' : 'Hủy'}
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" size="sm">
                <AlertTriangle className="size-4 mr-2" />
                {language === 'jp' ? '通報する' : 'Gửi khiếu nại'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}