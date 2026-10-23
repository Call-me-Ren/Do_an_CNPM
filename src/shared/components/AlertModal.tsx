import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
}

export const AlertModal: React.FC<Props> = ({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col items-center text-center relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            type === 'error'
              ? 'bg-red-50 text-red-600'
              : type === 'warning'
              ? 'bg-amber-50 text-amber-600'
              : type === 'success'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-blue-50 text-blue-600'
          }`}
        >
          {type === 'error' && <AlertCircle className="w-7 h-7" />}
          {type === 'warning' && <AlertCircle className="w-7 h-7" />}
          {type === 'success' && <CheckCircle className="w-7 h-7" />}
          {type === 'info' && <Info className="w-7 h-7" />}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {title ||
            (type === 'error'
              ? 'Thông Báo Lỗi'
              : type === 'success'
              ? 'Thành Công'
              : 'Thông Báo')}
        </h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed whitespace-pre-line">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-md transition"
        >
          Đồng ý
        </button>
      </div>
    </div>
  );
};
