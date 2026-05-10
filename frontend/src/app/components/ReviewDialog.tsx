import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Star, Upload } from 'lucide-react';
import { saveReview } from '../utils/mockData';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  cafeId: string;
  onSuccess: () => void;
}

export default function ReviewDialog({ open, onClose, cafeId, onSuccess }: ReviewDialogProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (!user || !comment.trim()) {
      alert('Please provide a comment');
      return;
    }

    const review = {
      id: Date.now().toString(),
      userId: user.id,
      cafeId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      userName: user.name,
      userAvatar: user.avatar,
    };

    saveReview(review);
    
    // Reset form
    setRating(5);
    setComment('');
    
    alert('Review submitted successfully!');
    onSuccess();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('writeReview')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>{t('yourRating')}</Label>
            <div className="flex gap-2 mt-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setRating(idx + 1)}
                  onMouseEnter={() => setHoveredRating(idx + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`size-8 ${
                      idx < (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">{t('comment')}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="Share your experience..."
              className="mt-2"
            />
          </div>

          <div>
            <Label>{t('uploadPhoto')}</Label>
            <Button variant="outline" className="w-full mt-2">
              <Upload className="size-4 mr-2" />
              {t('uploadPhoto')}
            </Button>
            <p className="text-xs text-gray-500 mt-1">Optional - Photo upload is simulated for demo</p>
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!comment.trim()}>
            {t('submit')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}