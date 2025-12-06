import { useState, useEffect } from 'react'
import { X, Plus, Eye, EyeOff, Check, Settings2 } from 'lucide-react'

const WidgetConfig = ({ onClose, onSave }) => {
  const [availableWidgets] = useState([
    {
      id: 'property-overview',
      name: 'Property Overview',
      description: 'Total, Active, Draft, and Pending properties count',
      category: 'Properties',
      enabled: true,
      size: 'medium'
    },
    {
      id: 'compliance-status',
      name: 'Compliance Status',
      description: 'Certificates expiring soon and up-to-date status',
      category: 'Compliance',
      enabled: true,
      size: 'medium'
    },
    {
      id: 'quick-actions',
      name: 'Quick Actions',
      description: 'Shortcuts to common tasks',
      category: 'Actions',
      enabled: true,
      size: 'medium'
    },
    {
      id: 'revenue-summary',
      name: 'Revenue Summary',
      description: 'Monthly revenue and rent collection metrics',
      category: 'Finance',
      enabled: false,
      size: 'medium'
    },
    {
      id: 'occupancy-rate',
      name: 'Occupancy Rate',
      description: 'Current occupancy percentage and trends',
      category: 'Properties',
      enabled: false,
      size: 'small'
    },
    {
      id: 'maintenance-alerts',
      name: 'Maintenance Alerts',
      description: 'Open and urgent work orders',
      category: 'Maintenance',
      enabled: false,
      size: 'medium'
    },
    {
      id: 'tenant-list',
      name: 'Recent Tenants',
      description: 'Recently added or updated tenants',
      category: 'Tenants',
      enabled: false,
      size: 'large'
    },
    {
      id: 'document-uploads',
      name: 'Recent Documents',
      description: 'Latest uploaded documents and certificates',
      category: 'Documents',
      enabled: false,
      size: 'medium'
    },
    {
      id: 'upcoming-renewals',
      name: 'Upcoming Renewals',
      description: 'Leases and certificates expiring soon',
      category: 'Compliance',
      enabled: false,
      size: 'medium'
    },
    {
      id: 'portfolio-value',
      name: 'Portfolio Value',
      description: 'Total portfolio value and appreciation',
      category: 'Finance',
      enabled: false,
      size: 'small'
    }
  ])

  const [widgets, setWidgets] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    // Load saved configuration or use default
    const savedConfig = localStorage.getItem('dashboardWidgets')
    if (savedConfig) {
      setWidgets(JSON.parse(savedConfig))
    } else {
      setWidgets(availableWidgets)
    }
  }, [])

  const categories = ['all', 'Properties', 'Compliance', 'Finance', 'Tenants', 'Maintenance', 'Documents', 'Actions']

  const toggleWidget = (widgetId) => {
    setWidgets(prev =>
      prev.map(w =>
        w.id === widgetId ? { ...w, enabled: !w.enabled } : w
      )
    )
  }

  const handleSave = () => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets))
    onSave(widgets)
    onClose()
  }

  const handleReset = () => {
    setWidgets(availableWidgets)
    localStorage.removeItem('dashboardWidgets')
  }

  const filteredWidgets = selectedCategory === 'all'
    ? widgets
    : widgets.filter(w => w.category === selectedCategory)

  const enabledCount = widgets.filter(w => w.enabled).length

  return (
    <div 
      className="fixed inset-0 bg-brand-900/50 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white w-full max-w-[clamp(320px,95vw,896px)] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-brand-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-brand-900 mb-1 flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Configure Dashboard Widgets
            </h2>
            <p className="text-sm text-brand-600">
              {enabledCount} widgets enabled • Drag to reorder
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-brand-600 hover:text-brand-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-brand-200">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-brand-900 text-white'
                    : 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                }`}
              >
                {category === 'all' ? 'All Widgets' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Widget List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar min-w-0">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
            {filteredWidgets.map((widget) => (
              <div
                key={widget.id}
                className={`p-4 border-2 transition-all ${
                  widget.enabled
                    ? 'border-primary bg-primary-light'
                    : 'border-brand-200 hover:border-brand-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-brand-900">{widget.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-brand-100 text-brand-600 border border-brand-200">
                        {widget.category}
                      </span>
                    </div>
                    <p className="text-sm text-brand-600">{widget.description}</p>
                  </div>
                  <button
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-2 transition-colors ${
                      widget.enabled
                        ? 'text-primary hover:bg-primary-light'
                        : 'text-brand-400 hover:bg-brand-100'
                    }`}
                  >
                    {widget.enabled ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-brand-500">
                  <span>Size: {widget.size}</span>
                  {widget.enabled && (
                    <span className="flex items-center gap-1 text-success">
                      <Check className="w-3 h-3" />
                      Enabled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredWidgets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-brand-600">No widgets in this category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="ent-btn-ghost text-sm"
          >
            Reset to Default
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="ent-btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="ent-btn-primary flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WidgetConfig
