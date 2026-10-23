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
    <div className="flex flex-col gap-5 pb-28">
      {/* Banner */}
      <div className="w-full h-52 md:h-64 rounded-3xl overflow-hidden shadow-md relative">
        <img
          src={museum.banner}
          alt={museum.name[currentLang] || museum.name['vi']}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-5">
          <div className="text-white">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5 mb-1">
              <Building2 className="w-4 h-4" />
              {t('historyMuseumTag')}
            </span>
            <h1 className="text-xl md:text-2xl font-bold leading-tight">
              {museum.name[currentLang] || museum.name['vi']}
            </h1>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">{t('openHours')}</div>
            <div className="font-semibold text-sm text-slate-800 mt-0.5">
              {museum.openHours[currentLang] || museum.openHours['vi']}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">{t('hotline')}</div>
            <div className="font-semibold text-sm text-slate-800 mt-0.5">{museum.hotline}</div>
          </div>
        </div>

        <div className="col-span-full bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium uppercase">{t('address')}</div>
            <div className="font-semibold text-sm text-slate-800 mt-0.5">
              {museum.address[currentLang] || museum.address['vi']}
            </div>
          </div>
        </div>
      </div>

      {/* About Description */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-2.5">
        <h3 className="font-bold text-slate-900 text-base">{t('aboutMuseum')}</h3>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
          {museum.description[currentLang] || museum.description['vi']}
        </p>
      </div>
    </div>
  );
};
