import { useLanguageStore } from '../store/language';
import { translations } from '../lib/translations';

type TranslationType = typeof translations.en;
type NestedValue = TranslationType | string;

export function useTranslation() {
  const { language } = useLanguageStore();

  const t = (key: string) => {
    const keys = key.split('.');
    let value: NestedValue = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k] as NestedValue;
      } else {
        return key;
      }
    }
    
    return value as string;
  };

  return { t, language };
} 