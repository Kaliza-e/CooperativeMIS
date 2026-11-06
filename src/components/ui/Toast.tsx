import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

// Global listener store for toasts
type ToastListener = (toasts: ToastItem[]) => void;
let listeners: ToastListener[] = [];
let memoryToasts: ToastItem[] = [];

const notifyListeners = () => {
  listeners.forEach((l) => l([...memoryToasts]));
};

export const notify = {
  show: (message: string, options?: { title?: string; type?: ToastType; duration?: number }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      message,
      title: options?.title,
      type: options?.type || 'info',
      duration: options?.duration || 4000,
    };
    memoryToasts = [newToast, ...memoryToasts].slice(0, 4); // Max 4 toasts
    notifyListeners();
  },
  success: (message: string, title?: string) => {
    notify.show(message, { title: title || 'Success', type: 'success' });
  },
  error: (message: string, title?: string) => {
    notify.show(message, { title: title || 'Error', type: 'error' });
  },
  info: (message: string, title?: string) => {
    notify.show(message, { title: title || 'Notice', type: 'info' });
  },
  dismiss: (id: string) => {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    notifyListeners();
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => notify.dismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50/90',
      borderColor: 'border-emerald-200',
      progressBar: 'bg-emerald-500',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50/90',
      borderColor: 'border-rose-200',
      progressBar: 'bg-rose-500',
    },
    info: {
      icon: Info,
      iconColor: 'text-[#0E8FC9]',
      bgColor: 'bg-[#E8F4FB]/90',
      borderColor: 'border-[#D5ECF8]',
      progressBar: 'bg-[#0E8FC9]',
    },
  }[toast.type || 'info'];

  const Icon = typeConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border ${typeConfig.borderColor} p-4 overflow-hidden relative`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-xl ${typeConfig.bgColor} shrink-0 mt-0.5`}>
          <Icon size={18} className={typeConfig.iconColor} />
        </div>
        <div className="flex-1 pr-2">
          {toast.title && (
            <h5 className="font-extrabold text-xs text-[#1F2A37] tracking-tight mb-0.5">
              {toast.title}
            </h5>
          )}
          <p className="text-xs text-[#6B7280] leading-relaxed font-medium">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 ${typeConfig.progressBar} opacity-80`}
      />
    </motion.div>
  );
}
