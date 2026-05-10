import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Bell } from 'lucide-react';
import { getNotifications, markNotificationAsRead, type Notification } from '../utils/mockData';
import { ScrollArea } from './ui/scroll-area';

interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsDialog({ open, onClose }: NotificationsDialogProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user && open) {
      loadNotifications();
    }
  }, [user, open]);

  const loadNotifications = () => {
    if (!user) return;
    const allNotifications = getNotifications();
    const userNotifications = allNotifications
      .filter(n => n.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotifications(userNotifications);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(language === 'jp' ? 'ja-JP' : 'vi-VN');
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('notifications')}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Bell className="size-12 mb-2 text-gray-300" />
              <p>{t('noNotifications')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <p className="text-sm">
                    {language === 'jp' ? notification.messageJP : notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.createdAt)}
                  </p>
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="link"
                      className="text-xs p-0 h-auto mt-1"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}