import { GripVertical, Settings, X } from 'lucide-react'

const DashboardWidget = ({ 
  id, 
  title, 
  children, 
  onRemove, 
  onSettings,
  isDragging 
}) => {
  return (
    <div
      className={`ent-card transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Widget Header */}
      <div className="p-4 border-b border-brand-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab active:cursor-grabbing p-1 text-brand-400 hover:text-brand-600"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-brand-900">{title}</h3>
        </div>

        <div className="flex items-center gap-1">
          {onSettings && (
            <button
              onClick={onSettings}
              className="p-1 text-brand-400 hover:text-brand-600 hover:bg-brand-100 transition-colors"
              title="Widget settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1 text-brand-400 hover:text-error hover:bg-error-light transition-colors"
              title="Remove widget"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4">{children}</div>
    </div>
  )
}

export default DashboardWidget
