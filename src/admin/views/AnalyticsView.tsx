import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Globe,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { analyticsService, ListenEvent } from '../../shared/services/analytics';
import { museumApi } from '../../shared/services/api';
import { Artifact } from '../../shared/types';

export const AnalyticsView: React.FC = () => {
  const [events, setEvents] = useState<ListenEvent[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | '7days' | 'all'>('7days');

  const refreshData = () => {
    setEvents(analyticsService.getListenEvents());
  };

  useEffect(() => {
    museumApi.getMuseumData().then((res) => {
      setArtifacts(res.artifacts);
    });
    refreshData();
  }, []);

  // Filter events by time range
  const now = Date.now();
  const filteredEvents = events.filter((e) => {
    if (timeRange === 'today') {
      const todayStart = new Date().setHours(0, 0, 0, 0);
      return e.timestamp >= todayStart;
    }
    if (timeRange === '7days') {
      return now - e.timestamp <= 7 * 24 * 3600 * 1000;
    }
    return true;
  });

  // Language Breakdown from actual events
  const langCounts: Record<string, number> = { vi: 0, en: 0, zh: 0, ko: 0, ja: 0 };
  filteredEvents.forEach((e) => {
    const l = (e.lang || 'vi').toLowerCase();
    langCounts[l] = (langCounts[l] || 0) + 1;
  });

  const languageData = [
    { code: 'vi', name: 'Tiếng Việt', value: langCounts.vi, color: '#f59e0b' },
    { code: 'en', name: 'English', value: langCounts.en, color: '#3b82f6' },
    { code: 'zh', name: '中文 (Chinese)', value: langCounts.zh, color: '#ec4899' },
    { code: 'ko', name: '한국어 (Korean)', value: langCounts.ko, color: '#10b981' },
    { code: 'ja', name: '日本語 (Japanese)', value: langCounts.ja, color: '#8b5cf6' },
  ];

  const activeLanguageData = languageData.filter((l) => l.value > 0);
  const totalListens = filteredEvents.length;

  // Top Listened War Remnants Museum Artifacts
  const artifactListenMap: Record<string, number> = {};
  filteredEvents.forEach((e) => {
    artifactListenMap[e.artifactId] = (artifactListenMap[e.artifactId] || 0) + 1;
  });

  const topArtifacts = artifacts
    .map((a) => ({
      code: a.code,
      name: a.title['vi'],
      listens: artifactListenMap[a.id] || 0,
    }))
    .sort((a, b) => b.listens - a.listens)
    .slice(0, 6);

  // Daily Trend over last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = `${d.getDate()}/${d.getMonth() + 1}`;
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 3600 * 1000;

    const dayEvents = events.filter((e) => e.timestamp >= dayStart && e.timestamp < dayEnd);
    const vi = dayEvents.filter((e) => e.lang === 'vi').length;
    const en = dayEvents.filter((e) => e.lang === 'en').length;
    const foreign = dayEvents.filter((e) => e.lang !== 'vi' && e.lang !== 'en').length;

    return { date: dayStr, vi, en, foreign, total: dayEvents.length };
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Ngay,Tieng Viet,English,Ngon ngu khac,Tong cong\n' +
      last7Days.map((e) => `${e.date},${e.vi},${e.en},${e.foreign},${e.total}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bao_tang_chung_tich_thong_ke_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            Báo Cáo Thống Kê & Phân Tích Lượt Nghe Thực Tế
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dữ liệu tổng hợp từ các lượt tương tác và phát âm thanh thực tế của khách tham quan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                timeRange === 'today' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                timeRange === '7days' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                timeRange === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Toàn bộ
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase">Tổng lượt nghe ({timeRange})</span>
          <div className="text-2xl font-bold text-white mt-1 font-mono">{filteredEvents.length}</div>
          <div className="text-xs text-slate-400 mt-1">Từ các thiết bị khách tham quan</div>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase">Ngôn ngữ thịnh hành nhất</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {languageData.sort((a, b) => b.value - a.value)[0]?.name || 'Tiếng Việt'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {languageData[0]?.value} lượt nghe
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase">Hiện vật nghe nhiều nhất</span>
          <div className="text-lg font-bold text-slate-100 mt-1 truncate">
            {topArtifacts[0]?.name || 'Chưa có dữ liệu'}
          </div>
          <div className="text-xs text-amber-400 mt-1 font-mono font-bold">
            {topArtifacts[0]?.listens || 0} lượt nghe
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Bar Chart */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div>
              <h3 className="text-base font-bold text-white">Xu Hướng Lượt Nghe 7 Ngày Gần Nhất</h3>
              <p className="text-xs text-slate-400 mt-0.5">Phân bổ theo tiếng Việt, tiếng Anh và ngôn ngữ khác</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="vi" name="Tiếng Việt" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="en" name="English" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="foreign" name="Ngôn ngữ khác" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Language Pie Chart */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="pb-3 border-b border-slate-700">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              Tỷ Lệ Lựa Chọn Ngôn Ngữ Thực Tế
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Tỷ trọng các ngôn ngữ được khách lựa chọn</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {activeLanguageData.length === 0 ? (
              <div className="text-xs text-slate-500 italic text-center p-6 bg-slate-900/60 rounded-xl w-full">
                Chưa có dữ liệu lượt nghe nào trong khoảng thời gian này.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeLanguageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => `${name.split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {activeLanguageData.map((entry) => (
                      <Cell key={entry.code} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                    formatter={(val: any, name: any) => [
                      `${val} lượt (${totalListens > 0 ? ((Number(val) / totalListens) * 100).toFixed(1) : 0}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex flex-col gap-1.5 text-xs">
            {languageData.map((lang) => (
              <div key={lang.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="text-slate-300">{lang.name}</span>
                </div>
                <span className="font-mono text-slate-400 font-bold">{lang.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
