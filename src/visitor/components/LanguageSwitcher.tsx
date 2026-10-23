import React, { useState, useRef, useEffect } from 'react';
import { useLangStore } from '../../shared/stores/langStore';
import { SupportedLanguage } from '../../shared/types';
import { ChevronDown, Check } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const activeLang = languages.find((l) => l.code === currentLang) || languages[0];

  const handleSelect = (lang: SupportedLanguage) => {
    setLang(lang);
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Active Language Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 py-1.5 px-3 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-sm border border-slate-200 text-xs font-semibold transition"
      >
        <span className="text-sm">{activeLang.flag}</span>
        <span>{activeLang.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu Sổ Dọc Xuống */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-50 flex flex-col gap-0.5 animate-fade-in">
          {languages.map((l) => {
            const isSelected = currentLang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isSelected
                    ? 'bg-amber-50 text-amber-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{l.flag}</span>
                  <span>{l.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
