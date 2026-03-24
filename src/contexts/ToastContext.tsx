'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'info' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      {/* Toast container */}
      {toasts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="alert"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#fff',
                background:
                  toast.type === 'success'
                    ? '#10B981'
                    : toast.type === 'error'
                      ? '#EF4444'
                      : '#3B82F6',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                animation: 'toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: 'auto',
                maxWidth: '400px',
                textAlign: 'center',
                wordBreak: 'keep-all' as const,
              }}
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
