import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration)
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map(({ id, message, type }) => (
          <Toast key={id} message={message} type={type} onClose={() => removeToast(id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  }

  const colors = {
    success: 'bg-success-light border-success text-success-dark',
    error: 'bg-error-light border-error text-error-dark',
    warning: 'bg-warning-light border-warning text-warning-dark',
    info: 'bg-info-light border-info text-info-dark'
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border shadow-ent-lg pointer-events-auto animate-slide-in-right ${colors[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
