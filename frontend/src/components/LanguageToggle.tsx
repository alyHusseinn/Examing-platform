import { useLanguageStore } from '../store/language';
import { Button } from './ui/button';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <Button
      variant="secondary"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="px-3 py-1 text-sm"
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
} 