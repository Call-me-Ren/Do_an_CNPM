import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, MapPin, X, Check } from 'lucide-react';

interface GpsMapPickerModalProps {
  isOpen: boolean;
  initialLat: string;
  initialLon: string;
  triggerRadius: number;
  onClose: () => void;
  onConfirm: (lat: string, lon: string) => void;
}

const DEFAULT_MUSEUM_LAT = 10.779601;
const DEFAULT_MUSEUM_LON = 106.691877;

function parseCoord(val: string, fallback: number): number {
  const num = Number.parseFloat(val);
  return Number.isFinite(num) ? num : fallback;
}

/**
 * Modal chọn tọa độ GPS trực quan bằng bản đồ OpenStreetMap (Leaflet):
 * - Click lên bản đồ hoặc kéo ghim để lấy (Lat, Lon) chính xác
 * - Hiển thị vòng tròn bán kính kích hoạt (triggerRadius)
 * - Hỗ trợ nút "Lấy GPS hiện tại" để demo ngay tại vị trí thực tế
 */
export const GpsMapPickerModal: React.FC<GpsMapPickerModalProps> = ({
  isOpen,
  initialLat,
  initialLon,
  triggerRadius,
  onClose,
  onConfirm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  const [lat, setLat] = useState<number>(() => parseCoord(initialLat, DEFAULT_MUSEUM_LAT));
  const [lon, setLon] = useState<number>(() => parseCoord(initialLon, DEFAULT_MUSEUM_LON));
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLat(parseCoord(initialLat, DEFAULT_MUSEUM_LAT));
      setLon(parseCoord(initialLon, DEFAULT_MUSEUM_LON));
      setGeoError(null);
    }
  }, [isOpen, initialLat, initialLon]);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const startLat = parseCoord(initialLat, DEFAULT_MUSEUM_LAT);
    const startLon = parseCoord(initialLon, DEFAULT_MUSEUM_LON);

    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLon],
      zoom: 18,
    });
    mapRef.current = map;

    const googleRoadLayer = L.tileLayer(
      'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        attribution: '&copy; Google Maps',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 21,
      },
    );

    const googleSatelliteLayer = L.tileLayer(
      'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      {
        attribution: '&copy; Google Maps',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 21,
      },
    );

    const esriStreetLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      },
    );

    googleRoadLayer.addTo(map);
    L.control
      .layers(
        {
          'Google Maps (Đường phố)': googleRoadLayer,
          'Google Maps (Vệ tinh)': googleSatelliteLayer,
          'Esri Street': esriStreetLayer,
        },
        undefined,
        { position: 'topright' },
      )
      .addTo(map);

    const pinIcon = L.divIcon({
      className: 'custom-gps-pin',
      html: `<div style="width:28px;height:28px;border-radius:9999px;background:#ca8a04;border:3px solid #ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;border-radius:9999px;background:#0c0a09;"></div></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([startLat, startLon], { icon: pinIcon, draggable: true }).addTo(map);
    markerRef.current = marker;

    const circle = L.circle([startLat, startLon], {
      radius: Math.max(3, triggerRadius || 15),
      color: '#ca8a04',
      fillColor: '#ca8a04',
      fillOpacity: 0.18,
      weight: 2,
    }).addTo(map);
    circleRef.current = circle;

    const updatePoint = (nextLat: number, nextLon: number) => {
      setLat(nextLat);
      setLon(nextLon);
      marker.setLatLng([nextLat, nextLon]);
      circle.setLatLng([nextLat, nextLon]);
    };

    map.on('click', (e: L.LeafletMouseEvent) => {
      updatePoint(e.latlng.lat, e.latlng.lng);
    });

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      updatePoint(pos.lat, pos.lng);
    });

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  }, [isOpen, initialLat, initialLon, triggerRadius]);

  const handleUseCurrentGps = () => {
    if (!navigator.geolocation) {
      setGeoError('Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextLat = pos.coords.latitude;
        const nextLon = pos.coords.longitude;
        setLat(nextLat);
        setLon(nextLon);
        markerRef.current?.setLatLng([nextLat, nextLon]);
        circleRef.current?.setLatLng([nextLat, nextLon]);
        mapRef.current?.setView([nextLat, nextLon], 18);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? 'Bạn chưa cấp quyền vị trí cho trình duyệt.'
            : 'Không lấy được tọa độ GPS hiện tại.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#eab308]" />
              <span>Ghim vị trí GPS trên bản đồ</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chạm lên bản đồ hoặc kéo ghim vàng để chọn tọa độ. Vòng tròn biểu thị bán kính tự bật ({triggerRadius || 15}m).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bản đồ chọn GPS"
            className="p-2 rounded-xl bg-slate-700/80 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/70 border border-slate-700/70 rounded-2xl px-3.5 py-2.5">
          <div className="text-xs font-mono text-slate-200 flex items-center gap-3 flex-wrap">
            <span>
              Lat: <strong className="text-[#eab308]">{lat.toFixed(6)}</strong>
            </span>
            <span>
              Lon: <strong className="text-[#eab308]">{lon.toFixed(6)}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleUseCurrentGps}
            disabled={locating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ca8a04]/15 hover:bg-[#ca8a04]/25 text-[#eab308] border border-white/20 text-xs font-bold transition cursor-pointer disabled:opacity-60"
          >
            <Crosshair className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Đang định vị...' : 'Lấy GPS hiện tại'}</span>
          </button>
        </div>

        {geoError && (
          <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
            {geoError}
          </div>
        )}

        <div
          ref={mapContainerRef}
          className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 z-0"
        />

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(lat.toFixed(6), lon.toFixed(6));
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#ca8a04] hover:bg-[#a16207] text-stone-950 text-xs font-bold transition shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Xác nhận tọa độ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
