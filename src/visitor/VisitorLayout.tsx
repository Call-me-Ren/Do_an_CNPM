import React, { useState, useEffect } from 'react';
import { MuseumData, Artifact } from '../shared/types';
import { museumApi } from '../shared/services/api';
import { ExploreView } from './views/ExploreView';
import { FloorMapView } from './views/FloorMapView';
import { FavoritesView } from './views/FavoritesView';
import { MuseumInfoView } from './views/MuseumInfoView';
import { ArtifactDetailSheet } from './components/ArtifactDetailSheet';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { QRScannerModal } from './views/QRScannerModal';
import { useGeofenceStore } from '../shared/stores/geofenceStore';
import { usePlayerStore } from '../shared/stores/playerStore';
import { useLangStore } from '../shared/stores/langStore';
import { useFavStore } from '../shared/stores/favStore';
import { Compass, Map, Heart, Info, QrCode, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AlertModal } from '../shared/components/AlertModal';
import { Link } from 'react-router-dom';

export const VisitorLayout: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<MuseumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'explore' | 'map' | 'favorites' | 'info'>('explore');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [scanAlert, setScanAlert] = useState<string | null>(null);

  const { setUserLocation, setNearestArtifactId, setIsTracking, setPermissionGranted } = useGeofenceStore();
  const { playArtifact, currentArtifact, stop } = usePlayerStore();
  const { currentLang } = useLangStore();
  const { favorites, cleanInvalidFavorites } = useFavStore();

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setData(res);
      setLoading(false);
      if (res?.artifacts) {
        cleanInvalidFavorites(res.artifacts.map((a) => a.id));
      }
    });
  }, []);

  // Geolocation Geofence Simulation & Tracking Engine
  useEffect(() => {
    if (!navigator.geolocation || !data) return;

    setIsTracking(true);
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPermissionGranted(true);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ latitude, longitude });

        // Calculate nearest artifact
        let minDistance = Infinity;
        let nearest: Artifact | null = null;

        data.artifacts.forEach((art) => {
          if (art.geoCoordinates) {
            const dLat = (art.geoCoordinates.latitude - latitude) * 111000;
            const dLon = (art.geoCoordinates.longitude - longitude) * 111000 * Math.cos(latitude * (Math.PI / 180));
            const dist = Math.sqrt(dLat * dLat + dLon * dLon);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = art;
            }
          }
        });

        // Trigger if within 30m
        if (minDistance <= 30 && nearest) {
          const matched: Artifact = nearest;
          setNearestArtifactId(matched.id);
          if (!currentArtifact) {
            playArtifact(matched);
          }
        } else {
          setNearestArtifactId(null);
        }
      },
      (err) => {
        console.warn('Geolocation error or denied:', err);
        setPermissionGranted(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [data, currentArtifact]);

  const handleSelectArtifact = (art: Artifact) => {
    if (currentArtifact && currentArtifact.id !== art.id) {
      stop();
    }
    setSelectedArtifact(art);
  };

  const handleScanSuccess = (decoded: string) => {
    setIsQRScannerOpen(false);
    if (!data) return;
    const found = data.artifacts.find(
      (a) => a.id === decoded || a.code === decoded || decoded.includes(a.code) || decoded.includes(a.id)
    );
    if (found) {
      handleSelectArtifact(found);
      playArtifact(found);
    } else {
      setScanAlert(`Đã quét mã: "${decoded}".\nKhông tìm thấy hiện vật tương ứng trong danh mục.`);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="font-semibold text-slate-700">{t('loading')}</div>
      </div>
    );
  }

  const museumName = data.museum.name[currentLang] || data.museum.name['vi'];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Top Navigation Bar (Full Desktop Header) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0 flex-1 select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] md:text-xs uppercase font-extrabold tracking-wider text-amber-600 block truncate">
                {t('appName')}
              </span>
              <h1 className="text-xs sm:text-base md:text-lg font-extrabold text-slate-900 truncate tracking-tight">
                {museumName}
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 shadow-inner">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('explore')}</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>{t('map')}</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activeTab === 'favorites'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{t('favorites')}</span>
              {favorites.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-red-500 text-white rounded-full font-bold ml-0.5">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'info'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>{t('museumInfo')}</span>
            </button>
          </nav>

          {/* Right Action Tools: QR, Admin link & Language Dropdown */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Desktop Scan QR Button (Hidden on Mobile because Mobile has floating center scan button) */}
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 md:px-3.5 md:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-semibold text-xs md:text-sm transition border border-amber-500/30"
              title={t('scanQR')}
            >
              <QrCode className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t('scanQR')}</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Website Body Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full min-w-0 overflow-x-hidden">
        {activeTab === 'explore' && (
          <ExploreView
            artifacts={data.artifacts}
            onSelectArtifact={handleSelectArtifact}
          />
        )}

        {activeTab === 'map' && (
          <FloorMapView
            floors={data.floors}
            artifacts={data.artifacts}
            onSelectArtifact={handleSelectArtifact}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            artifacts={data.artifacts}
            onSelectArtifact={handleSelectArtifact}
          />
        )}

        {activeTab === 'info' && <MuseumInfoView museum={data.museum} />}
      </main>

      {/* Footer on Web Desktop */}
      <footer className="hidden md:block bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span className="font-semibold text-slate-700">{museumName}</span>
            <span>&bull;</span>
            <span>{t('appName')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-amber-600 transition">
              {t('adminPortal')}
            </Link>
            <span>&bull;</span>
            <span>&copy; {new Date().getFullYear()} Museum Audio Guide</span>
          </div>
        </div>
      </footer>

      {/* Detail Modal Dialog */}
      <ArtifactDetailSheet
        artifact={selectedArtifact}
        onClose={() => setSelectedArtifact(null)}
      />

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Scan Result In-App Alert Modal */}
      <AlertModal
        isOpen={!!scanAlert}
        title="Quét Mã QR"
        message={scanAlert || ''}
        type="warning"
        onClose={() => setScanAlert(null)}
      />

      {/* Synchronized Audio Player Bar */}
      <AudioPlayerBar isDetailSheetOpen={Boolean(selectedArtifact)} />

      {/* Mobile-Only Bottom Navigation Bar (Hidden on md and larger) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pt-1.5 px-6 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] shadow-2xl select-none">
        <div className="flex items-center justify-between relative max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center py-1 gap-1 text-xs font-semibold transition ${
              activeTab === 'explore' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>{t('explore')}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center py-1 gap-1 text-xs font-semibold transition ${
              activeTab === 'map' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Map className="w-5 h-5" />
            <span>{t('map')}</span>
          </button>

          {/* Center Floating QR Scan Button */}
          <div className="relative -top-5">
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ring-4 ring-white"
              title={t('scanQR')}
            >
              <QrCode className="w-7 h-7" />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center py-1 gap-1 text-xs font-semibold transition ${
              activeTab === 'favorites' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>{t('favorites')}</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex flex-col items-center py-1 gap-1 text-xs font-semibold transition ${
              activeTab === 'info' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Info className="w-5 h-5" />
            <span>{t('museumInfo')}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
