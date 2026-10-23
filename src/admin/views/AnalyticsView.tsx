import React, { useState } from 'react';
import {
  BarChart3,
  Headphones,
  Globe,
  FileSpreadsheet
} from 'lucide-react';
import {
  AreaChart,
  Area,
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

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');

  const trendData = [
    { date: '17/10', vi: 240, en: 120, foreign: 80 },
    { date: '18/10', vi: 310, en: 180, foreign: 110 },
    { date: '19/10', vi: 450, en: 260, foreign: 190 },
    { date: '20/10', vi: 520, en: 300, foreign: 210 },
    { date: '21/10', vi: 400, en: 220, foreign: 150 },
    { date: '22/10', vi: 600, en: 340, foreign: 280 },
    { date: '23/10', vi: 720, en: 410, foreign: 310 },
  ];

  const languageData = [
    { name: 'Tiếng Việt', value: 3240, color: '#f59e0b' },
    { name: 'English', value: 1830, color: '#3b82f6' },
    { name: '中文 (Chinese)', value: 890, color: '#ec4899' },
    { name: '한국어 (Korean)', value: 620, color: '#10b981' },
    { name: '日本語 (Japanese)', value: 430, color: '#8b5cf6' },
  ];

  const topArtifacts = [
    { name: 'Trống đồng Đông Sơn', listens: 1420 },
    { name: 'Ấn rồng triều Nguyễn', listens: 1180 },
    { name: 'Tượng thần Vishnu', listens: 960 },
    { name: 'Bia tiến sĩ Văn Miếu', listens: 840 },
    { name: 'Thạp đồng Đào Thịnh', listens: 690 },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Ngay,Tieng Viet,English,Ngon ngu khac\n' +
      trendData.map((e) => `${e.date},${e.vi},${e.en},${e.foreign}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_Cao_Thong_Ke_Thuyet_Minh_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            Báo Cáo & Thống Kê Lượt Nghe Chi Tiết
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Phân tích mức độ quan tâm của du khách theo hiện vật, ngôn ngữ và các khung thời gian.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time Filter Pills */}
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                timeRange === 'today' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                timeRange === '7days' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                timeRange === '30days' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 ngày qua
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Top Trend Area Chart */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Xu Hướng Lượt Nghe Theo Ngày</h3>
          <span className="text-xs text-slate-400">Đơn vị: lượt nghe</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorVi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px' }}
              />
              <Legend />
              <Area type="monotone" dataKey="vi" name="Tiếng Việt" stroke="#f59e0b" fillOpacity={1} fill="url(#colorVi)" />
              <Area type="monotone" dataKey="en" name="Tiếng Anh" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEn)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2 Columns: Language Share & Top Exhibits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              Phân Bổ Lượt Nghe Theo Ngôn Ngữ
            </h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Exhibits Bar Chart */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-500" />
              Top 5 Hiện Vật Được Nghe Nhiều Nhất
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topArtifacts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" width={130} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px' }}
                />
                <Bar dataKey="listens" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
