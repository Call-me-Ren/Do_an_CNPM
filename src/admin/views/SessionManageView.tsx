import React, { useState } from 'react';
import { Calendar, Plus, Users, Headphones, Clock } from 'lucide-react';

interface TourSession {
  id: string;
  name: string;
  date: string;
  timeSlot: string;
  statusOverride?: 'active' | 'scheduled' | 'closed';
  visitorsCount: number;
  listenCount: number;
  notes?: string;
}

const getTodayDateStr = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const computeSessionStatus = (
  dateStr: string,
  timeSlot: string,
  override?: 'active' | 'scheduled' | 'closed'
): 'active' | 'scheduled' | 'closed' => {
  if (override) return override;

  try {
    const now = new Date();
    const parts = timeSlot.split('-').map((s) => s.trim());
    if (parts.length < 2) return 'scheduled';

    const [startH, startM] = parts[0].split(':').map((s) => parseInt(s, 10));
    const [endH, endM] = parts[1].split(':').map((s) => parseInt(s, 10));

    const [y, m, d] = dateStr.split('-').map((s) => parseInt(s, 10));
    const startDate = new Date(y, m - 1, d, startH || 0, startM || 0, 0);
    const endDate = new Date(y, m - 1, d, endH || 0, endM || 0, 0);

    const nowTime = now.getTime();
    if (nowTime < startDate.getTime()) {
      return 'scheduled';
    } else if (nowTime > endDate.getTime()) {
      return 'closed';
    } else {
      return 'active';
    }
  } catch {
    return 'scheduled';
  }
};

const initialSessions: TourSession[] = [
  {
    id: 'SES-01',
    name: 'Ca Sáng Thường Nhật',
    date: getTodayDateStr(0),
    timeSlot: '07:30 - 11:30',
    visitorsCount: 326,
    listenCount: 864,
    notes: 'Đón 2 đoàn học sinh'
  },
  {
    id: 'SES-02',
    name: 'Ca Chiều Thường Nhật',
    date: getTodayDateStr(0),
    timeSlot: '13:00 - 17:30',
    visitorsCount: 142,
    listenCount: 420,
    notes: 'Khách quốc tế chiếm 45%'
  },
  {
    id: 'SES-03',
    name: 'Ca Mở Rộng Buổi Tối & Trưng Bày Đêm',
    date: getTodayDateStr(0),
    timeSlot: '18:00 - 22:30',
    visitorsCount: 85,
    listenCount: 210,
    notes: 'Phục vụ khách tham quan chuyên đề đêm'
  },
  {
    id: 'SES-04',
    name: 'Đoàn Khách Ngoại Giao Pháp',
    date: getTodayDateStr(1),
    timeSlot: '09:30 - 11:30',
    visitorsCount: 0,
    listenCount: 0,
    notes: 'Ưu tiên thuyết minh tiếng Pháp'
  }
];

export const SessionManageView: React.FC = () => {
  const [sessions, setSessions] = useState<TourSession[]>(initialSessions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionDate, setNewSessionDate] = useState(getTodayDateStr(0));
  const [newSessionTime, setNewSessionTime] = useState('08:00 - 11:30');
  const [newSessionNotes, setNewSessionNotes] = useState('');

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;

    const created: TourSession = {
      id: `SES-${(sessions.length + 1).toString().padStart(2, '0')}`,
      name: newSessionName,
      date: newSessionDate,
      timeSlot: newSessionTime,
      visitorsCount: 0,
      listenCount: 0,
      notes: newSessionNotes
    };

    setSessions([created, ...sessions]);
    setIsModalOpen(false);
    setNewSessionName('');
    setNewSessionNotes('');
  };

  const toggleStatus = (id: string, currentComputedStatus: 'active' | 'scheduled' | 'closed') => {
    setSessions(
      sessions.map((s) => {
        if (s.id === id) {
          const nextStatus =
            currentComputedStatus === 'active'
              ? 'closed'
              : currentComputedStatus === 'scheduled'
              ? 'active'
              : 'scheduled';
          return { ...s, statusOverride: nextStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Quản Lý Phiên Tham Quan (Tour Sessions)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nhân viên tạo và quản lý các ca mở cửa, đoàn tham quan chuyên biệt để phục vụ thống kê lượt nghe.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Phiên Mới</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessions.map((s) => {
          const currentStatus = computeSessionStatus(s.date, s.timeSlot, s.statusOverride);
          return (
            <div
              key={s.id}
              className="bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-amber-500">{s.id}</span>
                  <span
                    onClick={() => toggleStatus(s.id, currentStatus)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer transition flex items-center gap-1 ${
                      currentStatus === 'active'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                        : currentStatus === 'closed'
                        ? 'bg-slate-700 text-slate-400'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    }`}
                    title="Nhấp để chuyển đổi ghi đè trạng thái"
                  >
                    {currentStatus === 'active' ? 'Đang mở' : currentStatus === 'closed' ? 'Đã đóng' : 'Sắp diễn ra'}
                  </span>
                </div>

              <h3 className="font-bold text-white text-base leading-snug">{s.name}</h3>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{s.date} ({s.timeSlot})</span>
              </div>

              {s.notes && (
                <div className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-lg mt-3 border border-slate-700/40">
                  &ldquo;{s.notes}&rdquo;
                </div>
              )}
            </div>

            <div className="border-t border-slate-700/60 pt-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{s.visitorsCount} khách</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Headphones className="w-4 h-4" />
                <span>{s.listenCount} lượt nghe</span>
              </div>
            </div>
          </div>
        );
      })}
      </div>

      {/* Modal Create Session */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 text-white">
            <h3 className="font-bold text-lg text-white">Tạo Phiên Tham Quan Mới</h3>

            <form onSubmit={handleCreateSession} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tên phiên / Đoàn</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ca sáng 24/10, Đoàn học sinh..."
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Ngày diễn ra</label>
                  <input
                    type="date"
                    required
                    value={newSessionDate}
                    onChange={(e) => setNewSessionDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Khung giờ</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 - 11:30"
                    value={newSessionTime}
                    onChange={(e) => setNewSessionTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Ghi chú vận hành</label>
                <textarea
                  rows={2}
                  placeholder="Yêu cầu riêng, phân bổ ngôn ngữ..."
                  value={newSessionNotes}
                  onChange={(e) => setNewSessionNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
                >
                  Lưu & Khởi Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
