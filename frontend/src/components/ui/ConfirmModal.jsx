/**
 * ConfirmModal — replaces window.confirm() everywhere
 * Usage:
 *   const { confirm, ConfirmModal } = useConfirm();
 *   await confirm({ title, message, confirmLabel, danger })
 *     → returns true if confirmed, false if cancelled
 */
import { useState, useCallback } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const useConfirm = () => {
  const [state, setState] = useState(null);
  // state = { title, message, confirmLabel, danger, resolve }

  const confirm = useCallback(({ title = 'Are you sure?', message = '', confirmLabel = 'Confirm', danger = false }) => {
    return new Promise((resolve) => {
      setState({ title, message, confirmLabel, danger, resolve });
    });
  }, []);

  const handleConfirm = () => {
    state?.resolve(true);
    setState(null);
  };

  const handleCancel = () => {
    state?.resolve(false);
    setState(null);
  };

  const Modal = () => {
    if (!state) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-zinc-700 animate-in">
          <div className="p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${state.danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
              {state.danger
                ? <Trash2 size={22} className="text-red-600 dark:text-red-400" />
                : <AlertTriangle size={22} className="text-yellow-600 dark:text-yellow-400" />
              }
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-100 mb-1">{state.title}</h3>
            {state.message && (
              <p className="text-sm text-slate-500 dark:text-zinc-400">{state.message}</p>
            )}
          </div>
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-600 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
                state.danger
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {state.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmModal: Modal };
};
