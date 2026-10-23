import React, { useState, useEffect } from 'react';
import {
  Users,
  Headphones,
  FileAudio,
  Activity,
  Server,
  Database,
  Radio,
  TrendingUp,
  Clock
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

export const AdminDashboardView: React.FC = () => {
  // Mock Real-time Live Active Devices state with random fluctuations
  const [activeDevices, setActiveDevices] = useState(42);
  const [systemLatency, setSystemLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDevices((prev) => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));
      setSystemLatency((prev) => Math.max(15, prev + Math.floor(Math.random() * 7) - 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: '08:00', listens: 18 },
    { name: '10:00', listens: 64 },
    { name: '12:00', listens: 95 },
    { name: '14:00', listens: 142 },
    { name: '16:00', listens: 110 },
    { name: '18:00', listens: 45 },
  ];

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
              <span>Hệ thống Hoạt động Ổn định</span>
            </div>
            <p className="text-slate-400 text-xs">
              Giám sát tải thực tế và kết nối các luồng audio đa ngôn ngữ.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-slate-400">Độ trễ API & Media</span>
            <div className="text-sm font-mono font-bold text-emerald-400">{systemLatency} ms</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Thiết bị đang truy cập</span>
            <div className="text-sm font-mono font-bold text-amber-400 flex items-center justify-end gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {activeDevices} thiết bị
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Lượt nghe hôm nay</span>
            <div className="text-2xl font-bold text-white mt-1">1,284</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +14.2% so với hôm qua
            </div>
          </div>
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
            <Headphones className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Khách tham quan</span>
            <div className="text-2xl font-bold text-white mt-1">468</div>
            <div className="text-xs text-slate-400 mt-1">Trong 24 giờ qua</div>
          </div>
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">File Thuyết Minh</span>
            <div className="text-2xl font-bold text-white mt-1">45 / 50</div>
            <div className="text-xs text-amber-400 mt-1">5 ngôn ngữ chuẩn hóa</div>
          </div>
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
            <FileAudio className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Tình trạng Server</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">99.9%</div>
            <div className="text-xs text-slate-400 mt-1">Uptime tháng này</div>
          </div>
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Listen Distribution Chart */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Phân Bổ Lượt Nghe Theo Khung Giờ</h3>
            <span className="text-xs font-medium text-slate-400">Hôm nay</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '12px' }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Bar dataKey="listens" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: System Health & Services */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="font-bold text-white text-base">Trạng Thái Thành Phần</h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Application Server</span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">System DB</span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <FileAudio className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Media Streamer Service</span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                Online
              </span>
            </div>
          </div>

          <div className="border-t border-slate-700/80 pt-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Phiên làm việc gần đây</span>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Ca sáng: 08:00 - 12:00
              </span>
              <span className="text-emerald-400 font-semibold">Hoàn tất</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Ca chiều: 13:00 - 17:00
              </span>
              <span className="text-amber-400 font-semibold animate-pulse">Đang mở</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
