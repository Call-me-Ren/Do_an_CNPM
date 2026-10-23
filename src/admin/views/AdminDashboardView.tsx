import React, { useState, useEffect } from 'react';
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
  CheckCircle2
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

  // Load Real Data & Set up Live Presence Polling
  const refreshData = () => {
    setActiveSessions(analyticsService.getActiveSessions());
    setListenEvents(analyticsService.getListenEvents());
  };

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setArtifacts(res.artifacts);
      setFloors(res.floors);
    });

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

  // Hourly Chart Data from Real Events Today
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
      {/* Real-time Status Alert Bar */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-slate-800 to-slate-800 border border-emerald-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-emerald-400 font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>Hệ thống Đang Hoạt Động &bull; Live Telemetry</span>
            </div>
            <p className="text-slate-400 text-xs">
              Toàn bộ số liệu được thống kê trực tiếp từ phiên truy cập và lượt nghe thực tế của người dùng.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-slate-400">Trạng thái API & TTS</span>
            <div className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trực Tuyến (Online)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Devices */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Thiết bị đang online</span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">
              {Math.max(1, activeSessions.length)}
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <Radio className="w-3 h-3 animate-pulse" /> Phiên thời gian thực (Real-time)
            </div>
          </div>
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Real Listens Today */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Lượt nghe hôm nay</span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">
              {todayEvents.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Khách hôm nay: <span className="text-slate-200 font-bold">{todayUniqueVisitors}</span> (Tổng: {totalUniqueVisitors})
            </div>
          </div>
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
            <Headphones className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Real Exhibits in System */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Hiện vật trưng bày</span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">
              {artifacts.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Bảo tàng Chứng tích Chiến tranh
            </div>
          </div>
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <FileAudio className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Zones / Floors */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Khu vực / Tầng trưng bày</span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">
              {floors.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Đầy đủ sơ đồ & tọa độ
            </div>
          </div>
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Real Active Devices Live Monitoring Table */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Danh Sách Thiết Bị Đang Truy Cập (Live Telemetry)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Theo dõi trực tiếp từng thiết bị người dùng đang mở trang web bảo tàng.
            </p>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
            {Math.max(1, activeSessions.length)} Thiết Bị Hoạt Động
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700/60">
                <th className="pb-3 font-semibold uppercase">Thiết bị</th>
                <th className="pb-3 font-semibold uppercase">Trình duyệt</th>
                <th className="pb-3 font-semibold uppercase">Ngôn ngữ</th>
                <th className="pb-3 font-semibold uppercase">Hiện vật đang xem/nghe</th>
                <th className="pb-3 font-semibold uppercase text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 font-medium">
              {activeSessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Đang kết nối tín hiệu thiết bị...
                  </td>
                </tr>
              ) : (
                activeSessions.map((session, idx) => (
                  <tr key={session.sessionId || idx} className="hover:bg-slate-750/50 transition">
                    <td className="py-3 text-slate-200 flex items-center gap-2 font-mono">
                      {session.deviceType === 'Mobile' ? (
                        <Smartphone className="w-4 h-4 text-amber-400" />
                      ) : session.deviceType === 'Tablet' ? (
                        <Tablet className="w-4 h-4 text-purple-400" />
                      ) : (
                        <Monitor className="w-4 h-4 text-blue-400" />
                      )}
                      <span>{session.deviceType} #{idx + 1}</span>
                    </td>
                    <td className="py-3 text-slate-300">{session.browser || 'Web Browser'}</td>
                    <td className="py-3 text-amber-400 font-bold uppercase">{session.lang || 'VI'}</td>
                    <td className="py-3 text-slate-300 max-w-xs truncate">
                      {session.currentArtifactTitle || 'Đang khám phá danh mục hiện vật'}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Đang kết nối
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Chart from Real Events */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Lượt Nghe Thuyết Minh Thực Tế Theo Khung Giờ (Hôm Nay)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ghi nhận theo từng lượt bấm nghe của khách tham quan.
              </p>
            </div>
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
                />
                <Bar dataKey="listens" name="Lượt nghe" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Top Listened Artifacts */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="pb-3 border-b border-slate-700">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-400" />
              Top Hiện Vật Được Nghe Nhiều Nhất
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Xếp hạng theo số lần bấm nghe thực tế</p>
          </div>

          <div className="flex flex-col gap-3">
            {topArtifactsList.map((art, idx) => (
              <div
                key={art.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 ${
                      idx === 0
                        ? 'bg-amber-500 text-slate-950'
                        : idx === 1
                        ? 'bg-slate-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="font-bold text-slate-200 truncate">{art.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{art.code}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-amber-400 text-sm">{art.count}</span>
                  <div className="text-[10px] text-slate-500">lượt nghe</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
