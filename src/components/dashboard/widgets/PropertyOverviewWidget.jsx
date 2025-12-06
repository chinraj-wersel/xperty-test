import { Building2, Home, FileText, AlertTriangle } from 'lucide-react'
import { getMockProperties } from '../../../lib/mockData'

const PropertyOverviewWidget = () => {
  const properties = getMockProperties()
  
  const stats = [
    { label: 'Total Properties', value: properties.length, icon: Building2, color: 'primary' },
    { label: 'Active', value: properties.filter(p => p.status === 'Active').length, icon: Home, color: 'success' },
    { label: 'Draft', value: 0, icon: FileText, color: 'warning' },
    { label: 'Pending', value: 0, icon: AlertTriangle, color: 'info' }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="text-center">
            <div className={`w-12 h-12 mx-auto mb-2 bg-${stat.color}-light text-${stat.color} flex items-center justify-center`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-brand-900">{stat.value}</div>
            <div className="text-xs text-brand-600">{stat.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export default PropertyOverviewWidget
