import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuthStore } from '../../shared/stores/adminAuthStore';
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLoginView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAdminAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'admin@museum.vn' && password === 'admin123') {
      login('mock-jwt-token-xyz-123', 'Quản Trị Viên', 'ADMIN');
      navigate('/admin', { replace: true });
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative">
      {/* Return to Visitor Website Button - Single Clean Navigation */}
      <div className="w-full max-w-md mb-4 flex items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang tham quan bảo tàng</span>
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 text-white">
        <div className="text-center flex flex-col items-center">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Cổng Quản Trị Hệ Thống</h1>
          <p className="text-sm text-slate-400 mt-1">Hệ thống Thuyết minh tự động đa ngôn ngữ</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email / Tên đăng nhập
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 font-semibold py-3 rounded-xl transition shadow-lg shadow-amber-500/20 text-white mt-2"
          >
            Đăng nhập vào Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
