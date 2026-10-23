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
import { Compass, Map, Heart, Info, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const VisitorLayout: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<MuseumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'explore' | 'map' | 'favorites' | 'info'>('explore');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const { setUserLocation, setNearestArtifactId, setIsTracking, setPermissionGranted } = useGeofenceStore();
  const { playArtifact, currentArtifact } = usePlayerStore();
  const { currentLang } = useLangStore();

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setData(res);
      setLoading(false);
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
            // Rough haversine
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
          // If not playing, can auto trigger
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

  const handleScanSuccess = (decoded: string) => {
    setIsQRScannerOpen(false);
    if (!data) return;
    // Find artifact by code or id or full URL
    const found = data.artifacts.find(
      (a) => a.id === decoded || a.code === decoded || decoded.includes(a.code) || decoded.includes(a.id)
    );
    if (found) {
      setSelectedArtifact(found);
      playArtifact(found);
    } else {
      alert(`Đã quét: ${decoded}. Không tìm thấy hiện vật tương ứng.`);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col max-w-md mx-auto shadow-2xl relative border-x border-slate-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {activeTab !== 'explore' && (
            <button
              onClick={() => setActiveTab('explore')}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition shrink-0"
              title={t('backToExplore')}
            >
              <Compass className="w-5 h-5 text-amber-600" />
            </button>
          )}
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 block">
              {t('appName')}
            </span>
            <h1 className="text-sm md:text-base font-extrabold text-slate-900 truncate">
              {data.museum.name[currentLang] || data.museum.name['vi']}
            </h1>
          </div>
        </div>

        <div className="shrink-0">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'explore' && (
          <ExploreView
            artifacts={data.artifacts}
            onSelectArtifact={(art) => setSelectedArtifact(art)}
          />
        )}

        {activeTab === 'map' && (
          <FloorMapView
            floors={data.floors}
            artifacts={data.artifacts}
            onSelectArtifact={(art) => setSelectedArtifact(art)}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            artifacts={data.artifacts}
            onSelectArtifact={(art) => setSelectedArtifact(art)}
          />
        )}

        {activeTab === 'info' && <MuseumInfoView museum={data.museum} />}
      </main>

      {/* Detail Bottom Sheet Modal */}
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

      {/* Synchronized Audio Player Bar */}
      <AudioPlayerBar />

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-6 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-between relative">
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
