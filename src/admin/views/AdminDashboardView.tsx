import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Users,
  Headphones,
  FileAudio,
  Activity,
  Layers,
  Radio,
  Smartphone,
  Monitor,
  Tablet,
  QrCode,
  Download,
  ExternalLink
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { analyticsService, ActiveSession, ListenEvent } from '../../shared/services/analytics';
import { museumApi } from '../../shared/services/api';
import { Artifact, Floor } from '../../shared/types';

export const AdminDashboardView: React.FC = () => {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [listenEvents, setListenEvents] = useState<ListenEvent[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Load Real Data & Set up Live Presence Polling
  const refreshData = () => {
    analyticsService.removeCurrentSession();
    setActiveSessions(analyticsService.getActiveSessions());
    setListenEvents(analyticsService.getListenEvents());
  };

  useEffect(() => {
    analyticsService.removeCurrentSession();
    museumApi.getMuseumData().then((res) => {
      setArtifacts(res.artifacts);
      setFloors(res.floors);
    });

    // Generate reliable dynamic QR Data-URL
    QRCode.toDataURL('https://call-me-ren.github.io/Test_CNPM/', {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(setQrDataUrl)
      .catch(console.error);

    refreshData();
    const interval = setInterval(() => {
      refreshData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Compute Real Stats from Actual Events
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayEvents = listenEvents.filter((e) => e.timestamp >= startOfDay);

  const totalUniqueVisitors = new Set(listenEvents.map((e) => e.sessionId)).size;
  const todayUniqueVisitors = new Set(todayEvents.map((e) => e.sessionId)).size;

  // Real Top Listened Artifacts from actual click logs
  const artifactListenCounts: Record<string, number> = {};
  listenEvents.forEach((e) => {
    artifactListenCounts[e.artifactId] = (artifactListenCounts[e.artifactId] || 0) + 1;
  });

  const topArtifactsList = artifacts
    .map((art) => ({
      id: art.id,
      code: art.code,
      title: art.title['vi'],
      floorId: art.floorId,
      count: artifactListenCounts[art.id] || 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Hourly Chart Data from Real Events Today (2-hour blocks covering entire day)
  const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  const chartData = hours.map((hourLabel) => {
    const h = parseInt(hourLabel.split(':')[0], 10);
    const count = todayEvents.filter((e) => {
      const eventHour = new Date(e.timestamp).getHours();
      return eventHour >= h && eventHour < h + 2;
    }).length;
    return { name: hourLabel, listens: count };
  });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-amber-500" />
            <span>Dashboard Trực Quan & Giám Sát</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Bảo tàng Chứng tích Chiến tranh &bull; 28 Võ Văn Tần, Q.3, TP. Hồ Chí Minh
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Hệ thống Hoạt động</span>
          </span>
        </div>
      </div>

      {/* 2. Sleek Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Real Active Devices */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khách Trực Tuyến</span>
            <div className="text-3xl font-extrabold text-white mt-1 font-mono">
              {activeSessions.length}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
              <span className={`w-2 h-2 rounded-full ${activeSessions.length > 0 ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              {activeSessions.length > 0 ? 'Thiết bị đang kết nối' : 'Chưa có thiết bị kết nối'}
            </div>
          </div>
          <div className="p-3 bg-amber-500/15 text-amber-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Listens Today */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lượt Nghe Hôm Nay</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">
              {todayEvents.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Khách hôm nay: <span className="text-slate-200 font-bold">{todayUniqueVisitors}</span> (Tổng: {totalUniqueVisitors})
            </div>
          </div>
          <div className="p-3 bg-blue-500/15 text-blue-400 rounded-2xl">
            <Headphones className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Total Exhibits */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hiện Vật Trưng Bày</span>
            <div className="text-3xl font-extrabold text-white mt-1 font-mono">
              {artifacts.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Đầy đủ 5 thứ tiếng & thuyết minh
            </div>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-2xl">
            <FileAudio className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Zones / Floors */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khu Vực / Tầng</span>
            <div className="text-3xl font-extrabold text-white mt-1 font-mono">
              {floors.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Sân ngoài trời & 3 tầng trưng bày
            </div>
          </div>
          <div className="p-3 bg-purple-500/15 text-purple-400 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Chart (2/3) + Museum Access QR (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Chart from Real Events */}
        <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Lượt Nghe Thuyết Minh Thực Tế Theo Khung Giờ (Hôm Nay)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cập nhật trực tiếp mỗi khi khách tham quan bấm nghe bài thuyết minh.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: any) => [`${val} lượt nghe`, 'Lượt nghe']}
                />
                <Bar dataKey="listens" name="Lượt nghe" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dedicated Museum Access QR Code Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Mã QR Truy Cập Website Bảo Tàng</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Duy nhất 1 mã QR chung cho toàn bảo tàng để khách quét vào giao diện tham quan đa ngôn ngữ.
            </p>
          </div>

          {/* QR Code Preview */}
          <div className="bg-white p-3 rounded-2xl self-center shadow-lg border border-slate-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Mã QR Truy Cập Bảo Tàng"
                className="w-36 h-36 object-contain"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs font-mono">
                Đang tạo mã QR...
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/80">
            <a
              href={qrDataUrl || '#'}
              download="Ma_QR_Bao_Tang_Chung_Tich_Chien_Tranh.png"
              className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Mã QR In Ấn (PNG)</span>
            </a>
            <a
              href="https://call-me-ren.github.io/Test_CNPM/"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-750 text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition text-center"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Mở website tham quan</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Top Exhibits (1/2) + Live Devices Table (1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Listened Exhibits */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="pb-3 border-b border-slate-700">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>Top Hiện Vật Được Nghe Nhiều Nhất</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Xếp hạng theo tổng số lượt khách tương tác nghe thuyết minh.</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {topArtifactsList.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-6 text-center">Chưa có dữ liệu lượt nghe.</div>
            ) : (
              topArtifactsList.map((art, idx) => (
                <div
                  key={art.id}
                  className="p-3 bg-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-white truncate">{art.title}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {art.code} &bull; Tầng {art.floorId === 1 ? 'Sân Ngoài Trời' : art.floorId}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-amber-400 font-bold shrink-0 bg-slate-800 px-2.5 py-1 rounded-lg">
                    {art.count} lượt
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Active Devices Table */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Thiết Bị Khách Đang Kết Nối Thời Gian Thực</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Giám sát các thiết bị đang mở trải nghiệm tham quan.</p>
            </div>
            <span className="text-xs bg-slate-900 text-amber-400 border border-slate-700 px-2.5 py-1 rounded-lg font-mono font-bold">
              {activeSessions.length} Online
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700/60">
                  <th className="pb-3 font-semibold uppercase">Thiết bị</th>
                  <th className="pb-3 font-semibold uppercase">Trình duyệt</th>
                  <th className="pb-3 font-semibold uppercase">Ngôn ngữ</th>
                  <th className="pb-3 font-semibold uppercase">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 font-medium">
                {activeSessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                      Hiện tại chưa có khách tham quan nào đang kết nối.
                    </td>
                  </tr>
                ) : (
                  activeSessions.map((session, idx) => (
                    <tr key={session.sessionId || idx} className="hover:bg-slate-750/50 transition">
                      <td className="py-2.5 text-slate-200 flex items-center gap-2 font-mono">
                        {session.deviceType === 'Mobile' ? (
                          <Smartphone className="w-4 h-4 text-amber-400" />
                        ) : session.deviceType === 'Tablet' ? (
                          <Tablet className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Monitor className="w-4 h-4 text-blue-400" />
                        )}
                        <span>{session.deviceType} #{idx + 1}</span>
                      </td>
                      <td className="py-2.5 text-slate-300">{session.browser || 'Web Browser'}</td>
                      <td className="py-2.5 text-amber-400 font-bold uppercase">{session.lang || 'VI'}</td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Đang xem
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
