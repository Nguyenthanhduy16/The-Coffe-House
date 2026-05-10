import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { saveBooking, saveNotification, type Cafe } from '../utils/mockData';

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  cafe: Cafe;
  onSuccess: () => void;
}

export default function BookingDialog({ open, onClose, cafe, onSuccess }: BookingDialogProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(2);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const handleConfirm = () => {
    if (!user || !date || !time) {
      alert('Please fill in all fields');
      return;
    }

    const booking = {
      id: Date.now().toString(),
      userId: user.id,
      cafeId: cafe.id,
      date: date.toISOString(),
      time,
      numberOfPeople,
      status: 'confirmed' as const, // Auto-confirm for demo
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);

    // Create notification
    const notification = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'booking_confirmed' as const,
      message: `Your booking at ${cafe.name} has been confirmed for ${date.toLocaleDateString()} at ${time}`,
      messageJP: `${cafe.nameJP}の予約が${date.toLocaleDateString('ja-JP')} ${time}に確認されました`,
      relatedId: booking.id,
      read: false,
      createdAt: new Date().toISOString(),
    };

    saveNotification(notification);

    alert('Booking confirmed!');
    onSuccess();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('bookTable')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>{t('selectDate')}</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border mt-2"
            />
          </div>

          <div>
            <Label htmlFor="time">{t('selectTime')}</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="numberOfPeople">{t('numberOfPeople')}</Label>
            <Input
              id="numberOfPeople"
              type="number"
              min="1"
              max="20"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
              className="mt-2"
            />
          </div>

          {date && time && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{t('bookingSummary')}</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">{t('cafes')}:</span> {language === 'jp' ? cafe.nameJP : cafe.name}</p>
                <p><span className="font-medium">{t('selectDate')}:</span> {date.toLocaleDateString(language === 'jp' ? 'ja-JP' : 'vi-VN')}</p>
                <p><span className="font-medium">{t('selectTime')}:</span> {time}</p>
                <p><span className="font-medium">{t('numberOfPeople')}:</span> {numberOfPeople}</p>
              </div>
            </div>
          )}

          <Button onClick={handleConfirm} className="w-full" disabled={!date || !time}>
            {t('confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}