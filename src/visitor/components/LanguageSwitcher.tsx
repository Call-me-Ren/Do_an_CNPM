import React from 'react';
import { useLangStore } from '../../shared/stores/langStore';
import { SupportedLanguage } from '../../shared/types';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export const LanguageSwitcher: React.FC = () => {
  const { currentLang, setLang } = useLangStore();
  const { i18n } = useTranslation();

  const handleSelect = (lang: SupportedLanguage) => {
    setLang(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-slate-200">
      <Globe className="w-4 h-4 text-slate-500 ml-1 shrink-0" />
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => handleSelect(l.code)}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full transition-all shrink-0 ${
            currentLang === l.code
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  );
};
