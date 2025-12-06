import { Plus, Users, FileCheck, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const QuickActionsWidget = () => {
  const navigate = useNavigate()

  const actions = [
    { label: 'Add Property', icon: Plus, path: '/dashboard/properties/new', color: 'primary' },
    { label: 'Add Tenant', icon: Users, path: '/dashboard/tenants', color: 'success' },
    { label: 'Upload Certificate', icon: FileCheck, path: '/dashboard/compliance', color: 'warning' },
    { label: 'View Reports', icon: TrendingUp, path: '/dashboard/reports', color: 'info' }
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="p-4 border border-brand-200 hover:border-brand-300 hover:bg-brand-50 transition-all text-center group"
          >
            <div className={`w-10 h-10 mx-auto mb-2 bg-${action.color}-light text-${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium text-brand-900">{action.label}</div>
          </button>
        )
      })}
    </div>
  )
}

export default QuickActionsWidget
