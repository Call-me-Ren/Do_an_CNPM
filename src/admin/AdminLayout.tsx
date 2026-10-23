import React from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '../shared/stores/adminAuthStore';
import {
  LayoutDashboard,
  Package,
  Music,
  Map,
  BarChart3,
  Calendar,
  LogOut,
  ShieldAlert
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { username, logout, isAuthenticated } = useAdminAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard Trực Quan', icon: LayoutDashboard },
    { path: '/admin/artifacts', label: 'Quản Lý Hiện Vật', icon: Package },
    { path: '/admin/audio', label: 'Tệp Âm Thanh & Sub', icon: Music },
    { path: '/admin/maps', label: 'Sơ Đồ Khu Vực', icon: Map },
    { path: '/admin/sessions', label: 'Quản Lý Phiên', icon: Calendar },
    { path: '/admin/analytics', label: 'Báo Cáo Thống Kê', icon: BarChart3 },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop - Strictly fixed, pinned to viewport */}
      <aside className="w-full md:w-64 h-auto md:h-screen bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 z-40 select-none">
        {/* Top Branding & Navigation Items */}
        <div className="p-5 flex flex-col gap-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 rounded-xl text-slate-950 font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base leading-none">ADMIN PORTAL</div>
              <div className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase mt-1">
                Bảo Tàng Thông Minh
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Permanently Pinned Bottom Logout & Account Bar (Never moves, never flickers) */}
        <div className="p-4 border-t border-slate-800/90 bg-slate-950 shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="text-xs min-w-0 flex-1">
              <div className="font-bold text-white truncate">{username || 'Quản Trị Viên'}</div>
              <div className="text-[10px] text-slate-500 truncate">Quản Trị Viên Hệ Thống</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            title="Đăng xuất quản trị viên"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất Quản trị viên</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area - Scrollable Independently */}
      <div className="flex-1 h-screen overflow-y-auto flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-sm text-slate-400">
            Khu vực quản trị / <span className="text-slate-200 font-semibold">{location.pathname}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Bảo tàng Chứng tích Chiến tranh
            </span>
          </div>
        </header>

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
