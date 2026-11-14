import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Artifact, MuseumData } from '../types';
import { museumMobileApi } from '../services/api';
import { useGeofenceStore } from '../stores/geofenceStore';
import { usePlayerStore } from '../stores/playerStore';
import { useLangStore } from '../stores/langStore';
import { useFavStore } from '../stores/favStore';
import {
  MAX_ACCEPTABLE_ACCURACY,
  findNearbyByGps,
  findNearbyByMap,
  findTriggered,
} from '../utils/geofence';
import { parseQrPayload } from '../utils/qrHelper';

interface MuseumDataContextValue {
  data: MuseumData | null;
  dataSource: 'server' | 'cache' | 'bundled';
  loading: boolean;
  refreshData: () => Promise<void>;
  handleQrDecoded: (decoded: string) => {
    ok: boolean;
    type: 'artifact' | 'museum' | 'unknown';
    artifact?: Artifact;
  };
}

const MuseumDataContext = createContext<MuseumDataContextValue>({
  data: null,
  dataSource: 'bundled',
  loading: true,
  refreshData: async () => {},
  handleQrDecoded: () => ({ ok: false, type: 'unknown' }),
});

export const MuseumDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MuseumData | null>(null);
  const [dataSource, setDataSource] = useState<'server' | 'cache' | 'bundled'>('bundled');
  const [loading, setLoading] = useState(true);

  const {
    trackingEnabled,
    setUserLocation,
    setNearestArtifactId,
    setIsTracking,
    setPermissionGranted,
    setAnchor,
    setGpsStatus,
    setAccuracy,
    setNearby,
    setSuggestion,
    startTracking,
    markHeard,
  } = useGeofenceStore();

  const { playArtifact, currentArtifact } = usePlayerStore();
  const { currentLang } = useLangStore();
  const { cleanInvalidFavorites } = useFavStore();
  const lastTriggeredRef = useRef<string | null>(null);

  const refreshData = useCallback(async () => {
    const res = await museumMobileApi.getMuseumData();
    setData(res.data);
    setDataSource(res.source);
    setLoading(false);
    if (res.data?.artifacts) {
      cleanInvalidFavorites(res.data.artifacts.map((a) => a.id));
    }
  }, [cleanInvalidFavorites]);

  useEffect(() => {
    let cancelled = false;
    museumMobileApi.getMuseumData().then((res) => {
      if (cancelled) return;
      setData(res.data);
      setDataSource(res.source);
      setLoading(false);
      if (res.data?.artifacts) {
        cleanInvalidFavorites(res.data.artifacts.map((a) => a.id));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [cleanInvalidFavorites]);

  // Đánh dấu hiện vật đã nghe trong phiên
  useEffect(() => {
    if (currentArtifact) {
      markHeard(currentArtifact.id);
    }
  }, [currentArtifact, markHeard]);

  // Heartbeat gửi thống kê thiết bị khi online
  useEffect(() => {
    const send = () => {
      const art = usePlayerStore.getState().currentArtifact;
      const lang = useLangStore.getState().currentLang;
      const title = art ? art.title?.[lang] || art.title?.vi || art.code : null;
      museumMobileApi.sendHeartbeat(lang, art?.id ?? null, title);
    };
    send();
    const timer = setInterval(send, 15000);
    return () => clearInterval(timer);
  }, [currentLang]);

  // Theo dõi GPS & Geofence (UC14)
  useEffect(() => {
    if (!data) return;
    if (!data.artifacts || data.artifacts.length === 0) {
      setGpsStatus('nodata');
      return;
    }

    if (!trackingEnabled) {
      setIsTracking(false);
      return;
    }

    let sub: Location.LocationSubscription | null = null;
    let cancelled = false;

    const startWatch = async () => {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          if (!cancelled) {
            setGpsStatus('unavailable');
            setIsTracking(false);
          }
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) {
            setPermissionGranted(false);
            setGpsStatus('denied');
            setIsTracking(false);
          }
          return;
        }

        if (cancelled) return;
        setPermissionGranted(true);
        setIsTracking(true);
        setGpsStatus('searching');

        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 2,
          },
          (pos) => {
            if (cancelled) return;
            const { latitude, longitude, accuracy } = pos.coords;
            const acc = accuracy ?? 999;
            setAccuracy(Math.round(acc));
            setUserLocation({ latitude, longitude });

            if (acc > MAX_ACCEPTABLE_ACCURACY) {
              setGpsStatus('low-accuracy');
              return;
            }

            setGpsStatus('active');
            const nearbyList = findNearbyByGps(data.artifacts, { latitude, longitude });
            setNearby(nearbyList);
            if (nearbyList.length === 0) return;

            setNearestArtifactId(nearbyList[0].artifactId);
            const triggered = findTriggered(data.artifacts, nearbyList);
            if (!triggered) {
              lastTriggeredRef.current = null;
              return;
            }

            setAnchor(triggered.artifactId);
            const state = useGeofenceStore.getState();
            if (!state.hasScannedQr) return;

            const player = usePlayerStore.getState();
            if (triggered.artifactId === lastTriggeredRef.current) return;
            if (player.currentArtifact?.id === triggered.artifactId && player.isPlaying) {
              lastTriggeredRef.current = triggered.artifactId;
              return;
            }

            const target = data.artifacts.find((a) => a.id === triggered.artifactId);
            if (!target) return;

            lastTriggeredRef.current = triggered.artifactId;
            if (player.currentArtifact && player.isPlaying) {
              setSuggestion({ artifactId: target.id, kind: 'switch' });
            } else if (state.heardIds.includes(target.id)) {
              setSuggestion({ artifactId: target.id, kind: 'replay' });
            } else {
              playArtifact(target);
            }
          }
        );
      } catch {
        if (!cancelled) {
          setGpsStatus('unavailable');
          setIsTracking(false);
        }
      }
    };

    startWatch();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [
    data,
    trackingEnabled,
    playArtifact,
    setAccuracy,
    setAnchor,
    setGpsStatus,
    setIsTracking,
    setNearby,
    setNearestArtifactId,
    setPermissionGranted,
    setSuggestion,
    setUserLocation,
  ]);

  const handleQrDecoded = useCallback(
    (decoded: string) => {
      if (!data) return { ok: false, type: 'unknown' as const };
      const parsed = parseQrPayload(decoded, data.artifacts);
      if (parsed.type === 'artifact') {
        const art = parsed.artifact;
        setAnchor(art.id);
        startTracking(art.id);
        const mapNearby = findNearbyByMap(data.artifacts, art);
        if (mapNearby.length > 0 && useGeofenceStore.getState().nearby.length === 0) {
          setNearby(mapNearby);
        }
        playArtifact(art);
        return { ok: true, type: 'artifact' as const, artifact: art };
      }
      if (parsed.type === 'museum') {
        startTracking(null);
        return { ok: true, type: 'museum' as const };
      }
      return { ok: false, type: 'unknown' as const };
    },
    [data, playArtifact, setAnchor, setNearby, startTracking]
  );

  return (
    <MuseumDataContext.Provider value={{ data, dataSource, loading, refreshData, handleQrDecoded }}>
      {children}
    </MuseumDataContext.Provider>
  );
};

export function useMuseumData() {
  return useContext(MuseumDataContext);
}
