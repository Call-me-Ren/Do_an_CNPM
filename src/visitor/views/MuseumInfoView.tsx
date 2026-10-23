import React from 'react';
import { MuseumInfo } from '../../shared/types';
import { useLangStore } from '../../shared/stores/langStore';
import { MapPin, Clock, Phone, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  museum: MuseumInfo;
}

export const MuseumInfoView: React.FC<Props> = ({ museum }) => {
  const { t } = useTranslation();
  const { currentLang } = useLangStore();

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* Web Hero Banner */}
      <div className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-xl relative border border-slate-200">
        <img
          src={museum.banner}
          alt={museum.name[currentLang] || museum.name['vi']}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-6 sm:p-10">
          <div className="text-white max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2 mb-2 bg-slate-900/50 backdrop-blur-md px-3 py-1 rounded-full w-fit">
              <Building2 className="w-4 h-4" />
              {t('historyMuseumTag')}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              {museum.name[currentLang] || museum.name['vi']}
            </h1>
          </div>
        </div>
      </div>

      {/* 3-Column Info Cards on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:shadow-md transition">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('openHours')}</div>
            <div className="font-bold text-sm sm:text-base text-slate-800 mt-1">
              {museum.openHours[currentLang] || museum.openHours['vi']}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:shadow-md transition">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('hotline')}</div>
            <div className="font-bold text-sm sm:text-base text-slate-800 mt-1">{museum.hotline}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:shadow-md transition">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('address')}</div>
            <div className="font-bold text-sm sm:text-base text-slate-800 mt-1">
              {museum.address[currentLang] || museum.address['vi']}
            </div>
          </div>
        </div>
      </div>

      {/* About Description Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
        <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
          {t('aboutMuseum')}
        </h3>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line max-w-4xl">
          {museum.description[currentLang] || museum.description['vi']}
        </p>
      </div>
    </div>
  );
};
