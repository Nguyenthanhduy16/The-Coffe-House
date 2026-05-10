import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'jp' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('jp')}
      >
        JP
      </Button>
      <Button
        variant={language === 'vn' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('vn')}
      >
        VN
      </Button>
    </div>
  );
}
