import { Bell, User, ArrowLeft, Coffee } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getNotifications } from '../utils/mockData';
import { useNavigate, useLocation } from 'react-router';

interface TopBarProps {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  showBackButton?: boolean;
}

export function TopBar({ onNotificationClick, onProfileClick, showBackButton }: TopBarProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const notifications = getNotifications();
      const userNotifications = notifications.filter(n => n.userId === user.id && !n.read);
      setUnreadCount(userNotifications.length);
    }
  }, [user]);

  const handleBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === '/home';

  return (
    <div className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && !isHomePage && (
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-amber-700" />
            <h1 className="font-bold">どこカフェ</h1>
            <span className="text-sm text-gray-500">- {t('customer')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageToggle />
          
          {user?.role === 'customer' && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onNotificationClick}
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          )}
          
          <Button variant="ghost" size="icon" onClick={onProfileClick}>
            <User className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}