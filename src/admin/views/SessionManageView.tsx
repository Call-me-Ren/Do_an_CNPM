import React, { useState } from 'react';
import { Calendar, Plus, Users, Headphones, Clock, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';

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

const SESSIONS_STORAGE_KEY = 'museum_tour_sessions';

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

const loadSavedSessions = (): TourSession[] => {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return initialSessions;
};

const saveSessionsToStorage = (list: TourSession[]) => {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save tour sessions to localStorage', err);
  }
};

export const SessionManageView: React.FC = () => {
  const [sessions, setSessions] = useState<TourSession[]>(loadSavedSessions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TourSession | null>(null);
  const [deletingSession, setDeletingSession] = useState<TourSession | null>(null);

  // Form states
  const [sessionName, setSessionName] = useState('');
  const [sessionDate, setSessionDate] = useState(getTodayDateStr(0));
  const [sessionTime, setSessionTime] = useState('08:00 - 11:30');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionStatus, setSessionStatus] = useState<'auto' | 'active' | 'scheduled' | 'closed'>('auto');

  // Open modal for Creating
  const handleOpenCreate = () => {
    setEditingSession(null);
    setSessionName('');
    setSessionDate(getTodayDateStr(0));
    setSessionTime('08:00 - 11:30');
    setSessionNotes('');
    setSessionStatus('auto');
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (session: TourSession) => {
    setEditingSession(session);
    setSessionName(session.name);
    setSessionDate(session.date);
    setSessionTime(session.timeSlot);
    setSessionNotes(session.notes || '');
    setSessionStatus(session.statusOverride || 'auto');
    setIsModalOpen(true);
  };

  // Save session (Create or Update)
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    let updatedList: TourSession[];

    if (editingSession) {
      // Update existing
      updatedList = sessions.map((s) => {
        if (s.id === editingSession.id) {
          return {
            ...s,
            name: sessionName.trim(),
            date: sessionDate,
            timeSlot: sessionTime.trim(),
            notes: sessionNotes.trim() || undefined,
            statusOverride: sessionStatus === 'auto' ? undefined : sessionStatus
          };
        }
        return s;
      });
    } else {
      // Create new
      let nextIdNum = sessions.length + 1;
      const ids = sessions
        .map((s) => parseInt(s.id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      if (ids.length > 0) {
        nextIdNum = Math.max(...ids) + 1;
      }

      const created: TourSession = {
        id: `SES-${nextIdNum.toString().padStart(2, '0')}`,
        name: sessionName.trim(),
        date: sessionDate,
        timeSlot: sessionTime.trim(),
        visitorsCount: 0,
        listenCount: 0,
        notes: sessionNotes.trim() || undefined,
        statusOverride: sessionStatus === 'auto' ? undefined : sessionStatus
      };

      updatedList = [created, ...sessions];
    }

    setSessions(updatedList);
    saveSessionsToStorage(updatedList);
    setIsModalOpen(false);
    setEditingSession(null);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deletingSession) return;
    const updatedList = sessions.filter((s) => s.id !== deletingSession.id);
    setSessions(updatedList);
    saveSessionsToStorage(updatedList);
    setDeletingSession(null);
  };

  // Quick toggle status on card badge
  const toggleStatus = (id: string, currentComputedStatus: 'active' | 'scheduled' | 'closed') => {
    const nextStatus: 'active' | 'scheduled' | 'closed' =
      currentComputedStatus === 'active'
        ? 'closed'
        : currentComputedStatus === 'scheduled'
        ? 'active'
        : 'scheduled';

    const updatedList: TourSession[] = sessions.map((s) => {
      if (s.id === id) {
        return { ...s, statusOverride: nextStatus };
      }
      return s;
    });
    setSessions(updatedList);
    saveSessionsToStorage(updatedList);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            Quản Lý Phiên Tham Quan (Tour Sessions)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tạo mới, chỉnh sửa, xóa và kiểm soát các ca mở cửa, đoàn tham quan chuyên biệt để thống kê lượt nghe chính xác.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Phiên Mới</span>
        </button>
      </div>

      {/* Sessions Grid */}
      {sessions.length === 0 ? (
        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Calendar className="w-12 h-12 text-slate-600" />
          <div className="font-bold text-slate-300 text-base">Chưa có phiên tham quan nào</div>
          <p className="text-xs text-slate-500 max-w-sm">
            Hiện chưa có phiên hoặc ca mở cửa nào được lưu trong hệ thống. Hãy bấm nút bên dưới để tạo phiên mới.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Tạo phiên đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => {
            const currentStatus = computeSessionStatus(s.date, s.timeSlot, s.statusOverride);
            return (
              <div
                key={s.id}
                className="bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      {s.id}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        onClick={() => toggleStatus(s.id, currentStatus)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition flex items-center gap-1 select-none ${
                          currentStatus === 'active'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                            : currentStatus === 'closed'
                            ? 'bg-slate-700 text-slate-400'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}
                        title="Bấm để chuyển nhanh trạng thái (Đang mở / Đã đóng / Sắp diễn ra)"
                      >
                        {currentStatus === 'active' ? 'Đang mở' : currentStatus === 'closed' ? 'Đã đóng' : 'Sắp diễn ra'}
                      </span>

                      {/* Nút Sửa */}
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                        title="Chỉnh sửa phiên này"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Nút Xóa */}
                      <button
                        onClick={() => setDeletingSession(s)}
                        className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-rose-500 hover:text-white text-slate-300 transition cursor-pointer"
                        title="Xóa phiên này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{s.name}</h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                    <Clock className="w-3.5 h-3.5 text-amber-500/80" />
                    <span>{s.date} ({s.timeSlot})</span>
                  </div>

                  {s.notes && (
                    <div className="text-xs text-slate-300/90 italic bg-slate-900/60 p-2.5 rounded-lg mt-3 border border-slate-700/40">
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
      )}

      {/* Modal Tạo / Sửa Phiên */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                {editingSession ? (
                  <>
                    <Pencil className="w-4 h-4 text-amber-500" />
                    <span>Chỉnh Sửa Phiên ({editingSession.id})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-amber-500" />
                    <span>Tạo Phiên Tham Quan Mới</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSession(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên phiên / Đoàn tham quan <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ca sáng 24/10, Đoàn học sinh trường Quốc Tế..."
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ngày diễn ra</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Khung giờ (Từ - Đến)</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00 - 11:30"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Trạng thái hoạt động</label>
                <select
                  value={sessionStatus}
                  onChange={(e) => setSessionStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="auto">Tự động (Tính theo giờ thực tế)</option>
                  <option value="active">Đang mở (Active)</option>
                  <option value="scheduled">Sắp diễn ra (Scheduled)</option>
                  <option value="closed">Đã đóng (Closed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi chú vận hành</label>
                <textarea
                  rows={2}
                  placeholder="Yêu cầu riêng, ưu tiên ngôn ngữ, người dẫn đoàn..."
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-2 pt-2 border-t border-slate-700/80">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSession(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-md cursor-pointer"
                >
                  {editingSession ? 'Cập Nhật Phiên' : 'Lưu & Khởi Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Phiên */}
      {deletingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-500/30">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white leading-tight">Xóa Phiên Tham Quan?</h3>
                <span className="text-xs text-rose-400/90 font-mono">{deletingSession.id}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa phiên <strong className="text-white">&ldquo;{deletingSession.name}&rdquo;</strong> ({deletingSession.date}) không? Thao tác này sẽ gỡ bỏ phiên và không thể hoàn tác.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setDeletingSession(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
