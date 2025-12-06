import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  Settings2, TrendingUp, Users, Building2, FileCheck, DollarSign,
  Wrench, Grid3x3, Search, Plus, FileText
} from 'lucide-react'
import DashboardWidget from '../components/dashboard/DashboardWidget'
import PropertyOverviewWidget from '../components/dashboard/widgets/PropertyOverviewWidget'
import ComplianceStatusWidget from '../components/dashboard/widgets/ComplianceStatusWidget'
import QuickActionsWidget from '../components/dashboard/widgets/QuickActionsWidget'
import DashboardSearch from '../components/ai/DashboardSearch'
import WidgetConfig from '../components/dashboard/WidgetConfig'
import DraggableDashboard from '../components/dashboard/DraggableDashboard'
import PropertyOnboarding from '../components/property/PropertyOnboarding'
import { getMockProperties, getMockTenants } from '../lib/mockData'

const DashboardHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showWidgetConfig, setShowWidgetConfig] = useState(false)
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [enabledWidgets, setEnabledWidgets] = useState([])

  useEffect(() => {
    // Load widget configuration
    const savedConfig = localStorage.getItem('xperty_dashboard_widgets')
    if (savedConfig) {
      const widgets = JSON.parse(savedConfig)
      // Filter enabled widgets but keep the saved order
      setEnabledWidgets(widgets.filter(w => w.enabled))
    } else {
      // Default widgets based on persona
      const defaultWidgets = getDefaultWidgets()
      setEnabledWidgets(defaultWidgets)
    }
  }, [user])

  const getDefaultWidgets = () => {
    const isEnterprise = user?.persona === 'enterprise' || user?.propertyCount === '51-100' || user?.propertyCount === '100+'

    if (isEnterprise) {
      // Enterprise: More analytics-focused widgets
      return [
        { id: 'property-overview', enabled: true },
        { id: 'revenue-summary', enabled: true },
        { id: 'occupancy-rate', enabled: true },
        { id: 'portfolio-value', enabled: true },
        { id: 'compliance-status', enabled: true },
        { id: 'maintenance-alerts', enabled: true },
        { id: 'quick-actions', enabled: true },
        { id: 'team-activity', enabled: true },
        { id: 'performance-trends', enabled: true }
      ]
    } else {
      // Landlord: Start with Clean Dashboard (no widgets)
      return []
    }
  }

  const handleWidgetSave = (widgets) => {
    // Save all widgets (enabled and disabled) to local storage
    localStorage.setItem('xperty_dashboard_widgets', JSON.stringify(widgets))
    // Update state with only enabled widgets, preserving the order from the config
    setEnabledWidgets(widgets.filter(w => w.enabled))
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(enabledWidgets)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setEnabledWidgets(items)

    // Update local storage to reflect the new order
    // We need to merge this new order with the disabled widgets which aren't in 'items'
    const savedConfig = localStorage.getItem('xperty_dashboard_widgets')
    let allWidgets = savedConfig ? JSON.parse(savedConfig) : getDefaultWidgets()

    // Create a map of the new order for enabled widgets
    const enabledOrderMap = new Map(items.map((item, index) => [item.id, index]))

    // Sort all widgets: enabled ones by their new order, disabled ones stay at the end
    allWidgets.sort((a, b) => {
      const indexA = enabledOrderMap.has(a.id) ? enabledOrderMap.get(a.id) : 999
      const indexB = enabledOrderMap.has(b.id) ? enabledOrderMap.get(b.id) : 999
      return indexA - indexB
    })

    localStorage.setItem('xperty_dashboard_widgets', JSON.stringify(allWidgets))
  }

  const isEnterprise = user?.persona === 'enterprise' || user?.propertyCount === '51-100' || user?.propertyCount === '100+'
  const properties = getMockProperties()
  const tenants = getMockTenants()

  // Calculate dashboard metrics
  const metrics = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'Active').length,
    totalTenants: tenants.length,
    totalRevenue: tenants.reduce((sum, t) => sum + t.rentAmount, 0),
    occupancyRate: properties.length > 0 ? ((tenants.length / properties.length) * 100).toFixed(1) : 0,
    maintenanceOpen: 0,
    complianceExpiring: 0
  }

  const renderWidget = (widget) => {
    switch (widget.id) {
      case 'property-overview':
        return (
          <DashboardWidget title="Property Overview">
            <PropertyOverviewWidget />
          </DashboardWidget>
        )
      case 'compliance-status':
        return (
          <DashboardWidget title="Compliance Status">
            <ComplianceStatusWidget />
          </DashboardWidget>
        )
      case 'quick-actions':
        return (
          <DashboardWidget title="Quick Actions">
            <QuickActionsWidget />
          </DashboardWidget>
        )
      case 'upcoming-renewals':
        return (
          <DashboardWidget title="Upcoming Renewals">
            <UpcomingRenewalsWidget />
          </DashboardWidget>
        )
      case 'revenue-summary':
        return (
          <DashboardWidget title="Revenue Summary">
            <RevenueSummaryWidget />
          </DashboardWidget>
        )
      case 'occupancy-rate':
        return (
          <DashboardWidget title="Occupancy Rate">
            <OccupancyRateWidget />
          </DashboardWidget>
        )
      case 'portfolio-value':
        return (
          <DashboardWidget title="Portfolio Value">
            <PortfolioValueWidget />
          </DashboardWidget>
        )
      case 'maintenance-alerts':
        return (
          <DashboardWidget title="Maintenance Alerts">
            <MaintenanceAlertsWidget />
          </DashboardWidget>
        )
      case 'team-activity':
        return (
          <DashboardWidget title="Team Activity">
            <TeamActivityWidget />
          </DashboardWidget>
        )
      case 'performance-trends':
        return (
          <DashboardWidget title="Performance Trends">
            <PerformanceTrendsWidget />
          </DashboardWidget>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      {/* Header with Search (Only show if widgets are enabled) */}
      {enabledWidgets.length === 0 ? null : (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-brand-900 mb-2">
                Welcome back{user?.companyName ? `, ${user.companyName}` : ''}
              </h1>
              <p className="text-brand-600">
                {isEnterprise
                  ? 'Enterprise dashboard with advanced analytics and insights'
                  : 'Here\'s what\'s happening with your properties today'}
              </p>
            </div>
            <button
              onClick={() => setShowWidgetConfig(true)}
              className="ent-btn-secondary flex items-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Configure Widgets
            </button>
          </div>

          {/* AI-Powered Search */}
          <div className="mb-6">
            <DashboardSearch />
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <StatCard
              icon={Building2}
              label="Properties"
              value={metrics.totalProperties}
              color="primary"
              onClick={() => navigate('/dashboard/properties')}
            />
            <StatCard
              icon={Users}
              label="Tenants"
              value={metrics.totalTenants}
              color="success"
              onClick={() => navigate('/dashboard/tenants')}
            />
            <StatCard
              icon={DollarSign}
              label="Revenue"
              value={`£${metrics.totalRevenue.toLocaleString()}`}
              color="success"
              onClick={() => navigate('/dashboard/reports')}
            />
            <StatCard
              icon={TrendingUp}
              label="Occupancy"
              value={`${metrics.occupancyRate}%`}
              color="info"
              onClick={() => navigate('/dashboard/reports')}
            />
            <StatCard
              icon={Wrench}
              label="Open Tasks"
              value={metrics.maintenanceOpen}
              color="warning"
              onClick={() => navigate('/dashboard/maintenance')}
            />
            <StatCard
              icon={FileCheck}
              label="Expiring"
              value={metrics.complianceExpiring}
              color="error"
              onClick={() => navigate('/dashboard/compliance')}
            />
          </div>
        </div>
      )}

      {/* Draggable Dashboard Layout */}
      {enabledWidgets.length > 0 ? (
        <DraggableDashboard
          widgets={enabledWidgets}
          onDragEnd={handleDragEnd}
          renderWidget={renderWidget}
        />
      ) : (
        <CleanDashboard
          onCustomize={() => setShowWidgetConfig(true)}
          user={user}
          hasProperties={properties.length > 0}
          navigate={navigate}
          onAddProperty={() => setShowAddPropertyModal(true)}
        />
      )}

      {/* Property Onboarding Modal */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto no-scrollbar">
          <style>{`
            .property-modal-wrapper > div:first-child {
              min-height: auto !important;

            }
              /* Hide scrollbar for Chrome, Safari and Edge */
        .property-modal-wrapper::-webkit-scrollbar {
  display: none;
}

            .property-modal-wrapper .sticky {
              overflow: visible !important;
            }
            .property-modal-wrapper .sticky > div {
              overflow: visible !important;
            }
          `}</style>
          <div className="property-modal-wrapper">
            <PropertyOnboarding
              onClose={() => setShowPropertyModal(false)}
              onComplete={(newProperty) => {
                // Update local state
                const updatedProperties = [...properties, newProperty]
                setProperties(updatedProperties)

                // Update localStorage
                const savedProps = JSON.parse(localStorage.getItem('xperty_properties') || '[]')
                if (!savedProps.find(p => p.id === newProperty.id)) {
                  localStorage.setItem('xperty_properties', JSON.stringify([...savedProps, newProperty]))
                } else {
                  setProperties(savedProps)
                }

                // Auto-select the new property
                setFormData(prev => ({
                  ...prev,
                  propertyId: newProperty.id,
                  unitId: '' // Reset unit as it's a new property
                }))

              toast.success('Property added successfully')
              setShowPropertyModal(false)
            }}
            />
          </div>
        </div>
      )}

      {/* Widget Configuration Modal */}
      {showWidgetConfig && (
        <WidgetConfig
          onClose={() => setShowWidgetConfig(false)}
          onSave={handleWidgetSave}
        />
      )}
    </div>
  )
}

// Clean Dashboard Component (Zero State)
const CleanDashboard = ({ onCustomize, user, hasProperties, navigate, onAddProperty }) => (
  <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center animate-fade-in">
    <div className="mb-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 blur-3xl opacity-30 rounded-full" />
      <h2 className="relative text-4xl sm:text-5xl font-bold text-brand-900 mb-4 tracking-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Xperty</span>
      </h2>
      <p className="relative text-xl text-brand-600 max-w-2xl mx-auto">
        Your complete property management command center
      </p>
    </div>

    <div className="w-full max-w-2xl mb-12 relative z-10 mx-auto">
      <DashboardSearch className="mx-auto" />
    </div>

    {!hasProperties && (
      <div className="mb-12 w-full max-w-[clamp(320px,95vw,672px)] mx-auto px-2 sm:px-0">
        <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-brand-100 relative overflow-hidden flex flex-col items-center text-center min-w-0">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-violet-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-fuchsia-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />

          <div className="relative z-10 flex flex-col items-center space-y-4 sm:space-y-6 w-full min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-violet-600" />
            </div>

            <div className="w-full min-w-0 px-2">
              <h3 className="text-xl sm:text-2xl font-bold text-brand-900 mb-2">Let's get you started</h3>
              <p className="text-sm sm:text-base text-brand-600 leading-relaxed max-w-lg mx-auto">
                Your dashboard is looking a bit empty. Add your first property to unlock powerful insights, automated compliance tracking, and tenant management.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full px-2 min-w-0">
              <button
                onClick={onAddProperty}
                className="ent-btn-primary py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base shadow-lg shadow-violet-200 hover:shadow-violet-300 transform hover:-translate-y-0.5 transition-all flex items-center justify-center w-full sm:w-auto min-w-0"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="truncate">Add Your First Property</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/reports')}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-brand-200 text-brand-700 font-medium rounded-lg hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto min-w-0 text-sm sm:text-base"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">View Demo Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="flex flex-wrap justify-center gap-4 mb-16">
      <QuickAction
        icon={Plus}
        label="Add Property"
        onClick={onAddProperty}
      />
      <QuickAction
        icon={Search}
        label="Search Properties"
        onClick={() => navigate('/dashboard/properties')}
      />
      <QuickAction
        icon={Users}
        label="Manage Tenants"
        onClick={() => navigate('/dashboard/tenants')}
      />
      <QuickAction
        icon={Wrench}
        label="Maintenance"
        onClick={() => navigate('/dashboard/maintenance')}
      />
    </div>

    <button
      onClick={onCustomize}
      className="group flex items-center gap-2 px-6 py-3 bg-white border border-brand-200 text-brand-500 hover:text-violet-600 hover:border-violet-200 rounded-full transition-all hover:shadow-md"
    >
      <Settings2 className="w-4 h-4 group-hover:rotate-45 transition-transform" />
      <span className="font-medium">Customize Dashboard Layout</span>
    </button>
  </div>
)

const QuickAction = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-200 rounded-lg text-sm text-brand-600 hover:bg-brand-50 hover:border-brand-300 transition-all"
  >
    <Icon className="w-4 h-4 text-brand-400" />
    {label}
  </button>
)

// Simple Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
  <div
    onClick={onClick}
    className={`ent-card p-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-all' : ''}`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 bg-${color}-light text-${color} flex items-center justify-center rounded`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-sm text-brand-600">{label}</div>
        <div className="text-lg font-bold text-brand-900">{value}</div>
      </div>
    </div>
  </div>
)

// Additional Widget Components
const UpcomingRenewalsWidget = () => (
  <div className="space-y-3">
    <div className="text-center py-4 text-brand-500 text-sm">
      No upcoming renewals
    </div>
  </div>
)

const RevenueSummaryWidget = () => (
  <div className="space-y-3">
    <div>
      <div className="text-xs text-brand-600 mb-1">Monthly Revenue</div>
      <div className="text-2xl font-bold text-brand-900">£0</div>
      <div className="text-xs text-brand-400 flex items-center gap-1 mt-1">
        <TrendingUp className="w-3 h-3" />
        0% vs last month
      </div>
    </div>
    <div className="pt-3 border-t border-brand-200">
      <div className="flex justify-between text-sm">
        <span className="text-brand-600">Collected</span>
        <span className="font-medium text-success">£0</span>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span className="text-brand-600">Outstanding</span>
        <span className="font-medium text-warning">£0</span>
      </div>
    </div>
  </div>
)

const OccupancyRateWidget = () => (
  <div className="space-y-3">
    <div className="text-center">
      <div className="text-4xl font-bold text-brand-900 mb-2">0%</div>
      <div className="text-xs text-brand-600">Current Occupancy</div>
    </div>
    <div className="h-2 bg-brand-100">
      <div className="h-full bg-brand-300" style={{ width: '0%' }}></div>
    </div>
    <div className="flex justify-between text-xs text-brand-600">
      <span>Target: 90%</span>
      <span className="text-brand-400">No data</span>
    </div>
  </div>
)

const PortfolioValueWidget = () => (
  <div className="space-y-3">
    <div>
      <div className="text-xs text-brand-600 mb-1">Total Value</div>
      <div className="text-2xl font-bold text-brand-900">£0</div>
      <div className="text-xs text-brand-400 flex items-center gap-1 mt-1">
        <TrendingUp className="w-3 h-3" />
        0% YoY
      </div>
    </div>
    <div className="pt-3 border-t border-brand-200">
      <div className="flex justify-between text-sm">
        <span className="text-brand-600">Equity</span>
        <span className="font-medium text-brand-900">£0</span>
      </div>
    </div>
  </div>
)

const MaintenanceAlertsWidget = () => (
  <div className="space-y-2">
    <div className="text-center py-4 text-brand-500 text-sm">
      No active maintenance alerts
    </div>
  </div>
)

const TeamActivityWidget = () => (
  <div className="space-y-3">
    <div className="text-sm text-brand-600 mb-3">Recent Activity</div>
    <div className="text-center py-4 text-brand-500 text-sm">
      No recent activity
    </div>
  </div>
)

const PerformanceTrendsWidget = () => (
  <div className="space-y-4">
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-brand-600">Revenue Trend</span>
        <span className="text-sm font-medium text-brand-400">0%</span>
      </div>
      <div className="h-2 bg-brand-100">
        <div className="h-full bg-brand-300" style={{ width: '0%' }}></div>
      </div>
    </div>
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-brand-600">Occupancy Trend</span>
        <span className="text-sm font-medium text-brand-400">0%</span>
      </div>
      <div className="h-2 bg-brand-100">
        <div className="h-full bg-brand-300" style={{ width: '0%' }}></div>
      </div>
    </div>
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-brand-600">Maintenance Costs</span>
        <span className="text-sm font-medium text-brand-400">0%</span>
      </div>
      <div className="h-2 bg-brand-100">
        <div className="h-full bg-brand-300" style={{ width: '0%' }}></div>
      </div>
    </div>
  </div>
)

export default DashboardHome