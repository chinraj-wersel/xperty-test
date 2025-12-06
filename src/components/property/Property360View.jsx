import { useState, useEffect } from 'react'
import { X, Building2, Grid3x3, Package, Users, Wrench, FileCheck, DollarSign, AlertCircle, CheckCircle, AlertTriangle, Plus, Trash2, Edit2, Save, FileText, Upload, UserPlus, User } from 'lucide-react'
import { getMockProperties, complianceTypes, getComplianceStatus, getComplianceColor } from '../../lib/mockData'

// Helper to calculate health status for each section
const getPropertyStatus = (property, tabId) => {
  switch (tabId) {
    case 'compliance':
      if (!property.compliance) return { status: 'warning', message: 'Missing' }
      const hasExpired = Object.values(property.compliance).some(c => getComplianceStatus(c.expiryDate) === 'expired')
      const hasExpiring = Object.values(property.compliance).some(c => getComplianceStatus(c.expiryDate) === 'expiring-soon')
      if (hasExpired) return { status: 'error', message: 'Action Required' }
      if (hasExpiring) return { status: 'warning', message: 'Expiring Soon' }
      return { status: 'success', message: 'Compliant' }

    case 'maintenance':
      // Mock logic - check for open tickets
      return { status: 'success', message: 'No Issues' }

    case 'tenants':
      if (!property.tenants || property.tenants === 0) return { status: 'neutral', message: 'Vacant' }
      return { status: 'success', message: 'Occupied' }

    case 'details':
      if (!property.purchaseDate) return { status: 'neutral', message: 'Incomplete' }
      return { status: 'success', message: 'Complete' }

    default:
      return { status: 'neutral', message: '' }
  }
}

const Property360View = ({ propertyId, onClose }) => {
  const [activeTab, setActiveTab] = useState('details')
  const [property, setProperty] = useState(null)

  useEffect(() => {
    // Load property data
    const mockProps = getMockProperties()
    const savedProps = JSON.parse(localStorage.getItem('properties') || '[]')
    const allProperties = [...mockProps, ...savedProps]

    const found = allProperties.find(p => p.id === propertyId)
    setProperty(found)
  }, [propertyId])

  const handleUpdateProperty = (updates) => {
    const updatedProperty = { ...property, ...updates }
    setProperty(updatedProperty)

    // Persist to localStorage
    const savedProps = JSON.parse(localStorage.getItem('xperty_properties') || '[]')
    const index = savedProps.findIndex(p => p.id === property.id)

    if (index !== -1) {
      savedProps[index] = updatedProperty
      localStorage.setItem('xperty_properties', JSON.stringify(savedProps))
    } else {
      // Handle case where it might be a mock property being "edited" for the first time
      // In a real app, we'd probably clone it to user properties
    }
  }

  if (!property) {
    return (
      <div className="fixed inset-0 bg-brand-900/50 z-50 flex items-center justify-center">
        <div className="bg-white p-6">
          <div className="spinner w-8 h-8 mx-auto"></div>
          <p className="text-sm text-brand-600 mt-4">Loading property...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: Building2 },
    { id: 'units', label: 'Units', icon: Grid3x3 },
    { id: 'assets', label: 'Assets', icon: Package },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'compliance', label: 'Compliance', icon: FileCheck },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'finance', label: 'Finance', icon: DollarSign }
  ]

  return (
    <div 
      className="fixed inset-0 bg-brand-900/50 z-50 flex items-end md:items-center md:justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose()
        }
      }}
    >
      <div className="bg-white w-full h-full md:h-screen md:w-[clamp(600px,85vw,800px)] flex flex-col md:flex-row animate-slide-in-right overflow-hidden">

        {/* Sidebar - Visible on Desktop */}
        <div className="hidden md:block w-[clamp(200px,25vw,288px)] bg-brand-50 border-r border-brand-200 overflow-y-auto min-w-0">
          <Property360Sidebar
            property={property}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-brand-200 flex items-center justify-between bg-white">
            <div>
              <h2 className="text-xl font-bold text-brand-900">{property.address}</h2>
              <p className="text-sm text-brand-600">{property.city} {property.postcode}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-100 transition-colors rounded-full"
            >
              <X className="w-5 h-5 text-brand-600" />
            </button>
          </div>

          {/* Mobile Tabs (Horizontal) */}
          <div className="md:hidden border-b border-brand-200 overflow-x-auto bg-white min-w-0">
            <div className="flex min-w-max px-4">
              {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                const { status } = getPropertyStatus(property, tab.id)

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-brand-600 hover:text-brand-900'
                      }`}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {status !== 'neutral' && (
                        <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${status === 'success' ? 'bg-success' :
                            status === 'warning' ? 'bg-warning' :
                              status === 'error' ? 'bg-error' : ''
                          }`} />
                      )}
                    </div>
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-white min-w-0">
            {activeTab === 'details' && <DetailsTab property={property} onUpdate={handleUpdateProperty} />}
            {activeTab === 'units' && <UnitsTab property={property} onUpdate={handleUpdateProperty} />}
            {activeTab === 'assets' && <AssetsTab property={property} onUpdate={handleUpdateProperty} />}
            {activeTab === 'tenants' && <TenantsTab property={property} onUpdate={handleUpdateProperty} />}
            {activeTab === 'maintenance' && <MaintenanceTab property={property} onUpdate={handleUpdateProperty} />}
            {activeTab === 'compliance' && <ComplianceTab property={property} onUpdate={handleUpdateProperty} />}
            {activeTab === 'documents' && <DocumentsTab property={property} onUpdate={handleUpdateProperty} />}
            {activeTab === 'finance' && <FinanceTab property={property} onUpdate={handleUpdateProperty} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Property 360 Sidebar Component
const Property360Sidebar = ({ property, activeTab, onTabChange, tabs }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider mb-1">Property 360</h3>
        <p className="text-xs text-brand-500">Health & Status Overview</p>
      </div>

      <div className="space-y-0 relative">
        {/* Connecting Line */}
        <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-brand-200" />

        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id
          const { status, message } = getPropertyStatus(property, tab.id)
          const Icon = tab.icon

          let statusColor = 'bg-brand-100 text-brand-400 border-brand-200'
          let iconColor = 'text-brand-400'

          if (isActive) {
            statusColor = 'bg-primary text-white border-primary shadow-md scale-110'
            iconColor = 'text-primary'
          } else if (status === 'success') {
            statusColor = 'bg-success text-white border-success'
            iconColor = 'text-success'
          } else if (status === 'warning') {
            statusColor = 'bg-warning text-white border-warning'
            iconColor = 'text-warning'
          } else if (status === 'error') {
            statusColor = 'bg-error text-white border-error'
            iconColor = 'text-error'
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative w-full flex items-center gap-3 py-3 group text-left"
            >
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all duration-300 ${statusColor}`}>
                {status === 'success' && !isActive ? (
                  <CheckCircle className="w-4 h-4" />
                ) : status === 'warning' && !isActive ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : status === 'error' && !isActive ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
              </div>

              <div className="flex-1">
                <div className={`text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-brand-700 group-hover:text-brand-900'}`}>
                  {tab.label}
                </div>
                {message && (
                  <div className={`text-xs ${status === 'error' ? 'text-error font-medium' :
                    status === 'warning' ? 'text-warning-dark' :
                      status === 'success' ? 'text-success' : 'text-brand-400'
                    }`}>
                    {message}
                  </div>
                )}
              </div>

              {isActive && (
                <div className="absolute right-0 w-1 h-8 bg-primary rounded-l-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Overall Health Score (Mock) */}
      <div className="mt-8 p-4 bg-white rounded-xl border border-brand-200 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-brand-500 uppercase">Health Score</span>
          <span className="text-lg font-bold text-success">92%</span>
        </div>
        <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
          <div className="h-full bg-success w-[92%]" />
        </div>
      </div>
    </div>
  )
}

// Tab Components
const DetailsTab = ({ property }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
        Property Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Property Type" value={property.propertyType} />
        <InfoItem label="Ownership" value={property.ownership} />
        <InfoItem label="Bedrooms" value={property.bedrooms} />
        <InfoItem label="Bathrooms" value={property.bathrooms} />
        <InfoItem label="Status" value={property.status} badge="success" />
        <InfoItem label="Units" value={property.units} />
      </div>
    </div>

    {property.purchaseDate && (
      <div>
        <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
          Financial Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="Purchase Date" value={new Date(property.purchaseDate).toLocaleDateString()} />
          <InfoItem label="Purchase Price" value={`£${property.purchasePrice?.toLocaleString()}`} />
          <InfoItem label="Current Value" value={`£${property.currentValue?.toLocaleString()}`} />
          <InfoItem
            label="Appreciation"
            value={`${(((property.currentValue - property.purchasePrice) / property.purchasePrice) * 100).toFixed(1)}%`}
            badge="success"
          />
        </div>
      </div>
    )}

    <div>
      <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
        Address
      </h3>
      <div className="p-4 bg-brand-50 border border-brand-200">
        <p className="text-sm text-brand-900">
          {property.address}<br />
          {property.city} {property.postcode}
        </p>
      </div>
    </div>
  </div>
)

const UnitsTab = ({ property, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newUnitName, setNewUnitName] = useState('')

  const handleAddUnit = () => {
    if (!newUnitName) return
    const currentUnits = property.unitsList || []
    const newUnit = { id: Date.now(), name: newUnitName, status: 'Vacant' }
    onUpdate({
      unitsList: [...currentUnits, newUnit],
      units: (property.units || 0) + 1
    })
    setNewUnitName('')
    setIsAdding(false)
  }

  const handleRemoveUnit = (unitId) => {
    if (!window.confirm('Are you sure?')) return
    const currentUnits = property.unitsList || []
    onUpdate({
      unitsList: currentUnits.filter(u => u.id !== unitId),
      units: Math.max(0, (property.units || 0) - 1)
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-900">
          Property Units ({property.units || 0})
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
        >
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-brand-50 rounded-lg border border-brand-200 animate-in fade-in slide-in-from-top-2">
          <label className="block text-xs font-medium text-brand-700 mb-1">Unit Name/Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
              className="flex-1 ent-input text-sm"
              placeholder="e.g. Flat 1 or Suite 101"
              autoFocus
            />
            <button onClick={handleAddUnit} className="ent-btn-primary py-1 px-3 text-sm">Add</button>
            <button onClick={() => setIsAdding(false)} className="ent-btn-secondary py-1 px-3 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {!property.unitsList && property.units > 0 ? (
        // Fallback for legacy data where units is just a number
        <div className="p-4 bg-brand-50 text-center rounded-lg">
          <p className="text-sm text-brand-600 mb-2">Legacy data: {property.units} units recorded.</p>
          <button
            onClick={() => onUpdate({ unitsList: Array.from({ length: property.units }, (_, i) => ({ id: i, name: `Unit ${i + 1}`, status: 'Occupied' })) })}
            className="text-primary text-sm hover:underline"
          >
            Convert to manageable units
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {property.unitsList?.map((unit) => (
            <div key={unit.id} className="p-4 border border-brand-200 rounded-lg hover:border-brand-300 transition-colors group">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-brand-900">{unit.name}</h4>
                  <p className="text-sm text-brand-600">{unit.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`ent-badge-${unit.status === 'Occupied' ? 'success' : 'neutral'}`}>{unit.status}</span>
                  <button
                    onClick={() => handleRemoveUnit(unit.id)}
                    className="p-1.5 text-brand-400 hover:text-error hover:bg-error-light rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(!property.unitsList || property.unitsList.length === 0) && (
            <div className="text-center py-8 text-brand-400 border-2 border-dashed border-brand-100 rounded-lg">
              <Grid3x3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No units added yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const AssetsTab = ({ property, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newAssetName, setNewAssetName] = useState('')

  const handleAddAsset = () => {
    if (!newAssetName) return
    const currentAssets = property.assets || []
    onUpdate({ assets: [...currentAssets, newAssetName] })
    setNewAssetName('')
    setIsAdding(false)
  }

  const handleRemoveAsset = (asset) => {
    if (!window.confirm(`Remove ${asset}?`)) return
    const currentAssets = property.assets || []
    onUpdate({ assets: currentAssets.filter(a => a !== asset) })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-900">
          Property Assets ({property.assets?.length || 0})
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
        >
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 bg-brand-50 rounded-lg border border-brand-200 animate-in fade-in slide-in-from-top-2">
          <label className="block text-xs font-medium text-brand-700 mb-1">Asset Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              className="flex-1 ent-input text-sm"
              placeholder="e.g. Boiler, Washing Machine"
              autoFocus
            />
            <button onClick={handleAddAsset} className="ent-btn-primary py-1 px-3 text-sm">Add</button>
            <button onClick={() => setIsAdding(false)} className="ent-btn-secondary py-1 px-3 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {property.assets && property.assets.length > 0 ? (
        <div className="space-y-3">
          {property.assets.map((asset, idx) => (
            <div key={idx} className="p-4 border border-brand-200 rounded-lg group">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-brand-900 capitalize">
                    {asset.replace(/-/g, ' ')}
                  </h4>
                  <p className="text-xs text-brand-600">Asset ID: {idx + 1000}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="ent-badge-success">Active</span>
                  <button
                    onClick={() => handleRemoveAsset(asset)}
                    className="p-1.5 text-brand-400 hover:text-error hover:bg-error-light rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-brand-400 border-2 border-dashed border-brand-100 rounded-lg">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No assets registered</p>
        </div>
      )}
    </div>
  )
}

const TenantsTab = ({ property, onUpdate }) => {
  const [mode, setMode] = useState('view') // view, select, create
  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    phone: '',
    rentAmount: ''
  })

  const handleCreateTenant = () => {
    if (!newTenant.name) return
    onUpdate({
      tenants: (property.tenants || 0) + 1,
      tenantDetails: { ...newTenant, status: 'Active' }
    })
    setMode('view')
    setNewTenant({ name: '', email: '', phone: '', rentAmount: '' })
  }

  const handleUnlinkTenant = () => {
    if (window.confirm('Unlink current tenant?')) {
      onUpdate({
        tenants: Math.max(0, (property.tenants || 0) - 1),
        tenantDetails: null
      })
    }
  }

  if (mode === 'select') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setMode('view')} className="p-1 hover:bg-brand-100 rounded-full">
            <X className="w-5 h-5 text-brand-600" />
          </button>
          <h3 className="text-lg font-semibold text-brand-900">Add Tenant</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setMode('create')}
            className="p-4 border-2 border-brand-200 rounded-lg text-left hover:border-primary hover:bg-primary-light/10 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <UserPlus className="w-5 h-5 text-brand-600 group-hover:text-white" />
              </div>
              <div className="font-semibold text-brand-900">Create New Tenant</div>
            </div>
            <p className="text-sm text-brand-600 pl-[52px]">Add details for a new tenant manually</p>
          </button>

          <button
            onClick={() => alert('Select existing tenant flow would open here')}
            className="p-4 border-2 border-brand-200 rounded-lg text-left hover:border-primary hover:bg-primary-light/10 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <User className="w-5 h-5 text-brand-600 group-hover:text-white" />
              </div>
              <div className="font-semibold text-brand-900">Select Existing</div>
            </div>
            <p className="text-sm text-brand-600 pl-[52px]">Choose from your existing tenant database</p>
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'create') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setMode('select')} className="p-1 hover:bg-brand-100 rounded-full">
            <X className="w-5 h-5 text-brand-600" />
          </button>
          <h3 className="text-lg font-semibold text-brand-900">New Tenant Details</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Full Name</label>
            <input
              type="text"
              className="ent-input w-full"
              placeholder="John Doe"
              value={newTenant.name}
              onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Email</label>
            <input
              type="email"
              className="ent-input w-full"
              placeholder="john@example.com"
              value={newTenant.email}
              onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Phone</label>
            <input
              type="tel"
              className="ent-input w-full"
              placeholder="07700 900000"
              value={newTenant.phone}
              onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-700 mb-1">Rent Amount (£)</label>
            <input
              type="number"
              className="ent-input w-full"
              placeholder="1500"
              value={newTenant.rentAmount}
              onChange={(e) => setNewTenant({ ...newTenant, rentAmount: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              onClick={handleCreateTenant}
              disabled={!newTenant.name}
              className="flex-1 ent-btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Tenant
            </button>
            <button
              onClick={() => setMode('view')}
              className="flex-1 ent-btn-secondary justify-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-900">
          Current Tenants ({property.tenants || 0})
        </h3>
        {!property.tenantDetails && (
          <button
            onClick={() => setMode('select')}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
          >
            <Plus className="w-4 h-4" /> Link Tenant
          </button>
        )}
      </div>

      {property.tenants > 0 ? (
        <div className="p-4 border border-brand-200 rounded-lg group bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-lg">
                {property.tenantDetails?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <h4 className="font-semibold text-brand-900">{property.tenantDetails?.name || 'John Doe'}</h4>
                <div className="flex flex-col text-sm text-brand-600">
                  <span>{property.tenantDetails?.email || 'john.doe@example.com'}</span>
                  <span>{property.tenantDetails?.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="ent-badge-success">Active</span>
              <button
                onClick={handleUnlinkTenant}
                className="text-xs text-error hover:underline mt-1"
              >
                Unlink
              </button>
            </div>
          </div>
          {property.tenantDetails?.rentAmount && (
            <div className="mt-4 pt-3 border-t border-brand-100 flex justify-between text-sm">
              <span className="text-brand-600">Monthly Rent</span>
              <span className="font-medium text-brand-900">£{property.tenantDetails.rentAmount}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-brand-200 rounded-lg text-center hover:border-brand-300 transition-colors">
          <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-brand-400" />
          </div>
          <h4 className="text-brand-900 font-medium mb-1">No tenants linked</h4>
          <p className="text-sm text-brand-600 mb-4">Add a tenant to track occupancy and rent.</p>
          <button onClick={() => setMode('select')} className="ent-btn-primary text-sm">
            Add Tenant
          </button>
        </div>
      )}
    </div>
  )
}

const ComplianceTab = ({ property, onUpdate }) => {
  const handleAddCert = () => {
    const type = prompt('Enter Certificate Type (e.g., Gas Safety):')
    if (type) {
      const newCert = {
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        issueDate: new Date().toISOString()
      }
      onUpdate({
        compliance: { ...property.compliance, [type.toLowerCase().replace(/\s/g, '')]: newCert }
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-900">Compliance Certificates</h3>
        <button
          onClick={handleAddCert}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
        >
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      {property.compliance ? (
        <div className="space-y-3">
          {Object.entries(property.compliance).map(([type, cert]) => {
            const certInfo = complianceTypes[type] || { name: type }
            const status = getComplianceStatus(cert.expiryDate)
            const color = getComplianceColor(status)

            return (
              <div key={type} className="p-4 border border-brand-200 rounded-lg group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-brand-900 capitalize">{certInfo.name}</h4>
                    <p className="text-sm text-brand-600">
                      Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`ent-badge-${color}`}>
                      {status === 'valid' ? 'Valid' : status === 'expiring-soon' ? 'Expiring Soon' : 'Expired'}
                    </span>
                    <button
                      onClick={() => {
                        const newDate = prompt('Enter new expiry date (YYYY-MM-DD):', cert.expiryDate.split('T')[0])
                        if (newDate) {
                          onUpdate({
                            compliance: {
                              ...property.compliance,
                              [type]: { ...cert, expiryDate: new Date(newDate).toISOString() }
                            }
                          })
                        }
                      }}
                      className="p-1.5 text-brand-400 hover:text-primary hover:bg-brand-100 rounded opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-brand-500">
                  Issued: {new Date(cert.issueDate).toLocaleDateString()}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="p-6 border border-brand-200 text-center rounded-lg bg-brand-50">
          <FileCheck className="w-8 h-8 mx-auto mb-2 text-brand-400" />
          <p className="text-sm text-brand-600 mb-3">No compliance certificates on file</p>
          <button onClick={handleAddCert} className="ent-btn-primary text-sm">
            Upload Certificate
          </button>
        </div>
      )}
    </div>
  )
}

const DocumentsTab = ({ property, onUpdate }) => {
  const handleUpload = () => {
    alert('File upload would open here')
    // Mock upload
    const newDoc = {
      id: Date.now(),
      name: 'New Document.pdf',
      type: 'application/pdf',
      uploadedAt: new Date().toISOString()
    }
    onUpdate({
      documents: [...(property.documents || []), newDoc]
    })
  }

  const handleDelete = (docId) => {
    if (window.confirm('Delete this document?')) {
      onUpdate({
        documents: (property.documents || []).filter(d => d.id !== docId)
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-900">Property Documents</h3>
        <button
          onClick={handleUpload}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      {property.documents && property.documents.length > 0 ? (
        <div className="space-y-3">
          {property.documents.map((doc) => (
            <div key={doc.id} className="p-3 border border-brand-200 rounded-lg flex items-center justify-between group hover:border-brand-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 rounded flex items-center justify-center text-brand-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-900">{doc.name}</p>
                  <p className="text-xs text-brand-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 text-brand-400 hover:text-error hover:bg-error-light rounded opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 border-2 border-dashed border-brand-200 rounded-lg text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-brand-400" />
          <p className="text-sm text-brand-600">No documents uploaded</p>
          <button onClick={handleUpload} className="mt-2 text-primary text-sm hover:underline">
            Click to upload
          </button>
        </div>
      )}
    </div>
  )
}

const FinanceTab = ({ property, onUpdate }) => {
  const handleAddInvoice = () => {
    const amount = prompt('Enter Invoice Amount:')
    if (amount) {
      alert(`Invoice for £${amount} added (Mock)`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-brand-900 mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-success-light border border-success/30 rounded-lg">
            <p className="text-sm text-success-dark mb-1">Monthly Rent</p>
            <p className="text-2xl font-bold text-success-dark">£1,500</p>
          </div>
          <div className="p-4 bg-info-light border border-info/30 rounded-lg">
            <p className="text-sm text-info-dark mb-1">Annual Revenue</p>
            <p className="text-2xl font-bold text-info-dark">£18,000</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-brand-900">Recent Payments</h3>
          <button
            onClick={handleAddInvoice}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 border border-brand-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-brand-900">Rent Payment - December 2024</h4>
                <p className="text-sm text-brand-600">Received on 01/12/2024</p>
              </div>
              <p className="font-semibold text-success">+£1,500</p>
            </div>
          </div>

          <div className="p-4 border border-brand-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-brand-900">Rent Payment - November 2024</h4>
                <p className="text-sm text-brand-600">Received on 01/11/2024</p>
              </div>
              <p className="font-semibold text-success">+£1,500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MaintenanceTab = ({ property, onUpdate }) => {
  const handleReportIssue = () => {
    const issue = prompt('Describe the maintenance issue:')
    if (issue) {
      const newRequest = {
        id: Date.now(),
        title: issue,
        status: 'Pending',
        date: new Date().toISOString(),
        cost: 0
      }
      onUpdate({
        maintenance: [...(property.maintenance || []), newRequest]
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brand-900">Maintenance History</h3>
        <button
          onClick={handleReportIssue}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"
        >
          <Plus className="w-4 h-4" /> Report Issue
        </button>
      </div>

      {property.maintenance && property.maintenance.length > 0 ? (
        <div className="space-y-3">
          {property.maintenance.map((req) => (
            <div key={req.id} className="p-4 border border-brand-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-brand-900">{req.title}</h4>
                  <p className="text-sm text-brand-600">{req.description || 'Maintenance Request'}</p>
                </div>
                <span className={`ent-badge-${req.status === 'Completed' ? 'success' : 'warning'}`}>
                  {req.status}
                </span>
              </div>
              <p className="text-xs text-brand-500">
                {new Date(req.date || '2024-01-01').toLocaleDateString()} • Cost: £{req.cost || 0}
              </p>
            </div>
          ))}
          {/* Static Mock Data for existing items if not in array */}
          {!property.maintenance.some(m => m.title === 'Boiler Service') && (
            <>
              <div className="p-4 border border-brand-200 rounded-lg opacity-75">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-brand-900">Boiler Service</h4>
                    <p className="text-sm text-brand-600">Annual service completed</p>
                  </div>
                  <span className="ent-badge-success">Completed</span>
                </div>
                <p className="text-xs text-brand-500">2024-10-15 • Cost: £120</p>
              </div>
              <div className="p-4 border border-brand-200 rounded-lg opacity-75">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-brand-900">Smoke Detector Check</h4>
                    <p className="text-sm text-brand-600">Quarterly safety check</p>
                  </div>
                  <span className="ent-badge-success">Completed</span>
                </div>
                <p className="text-xs text-brand-500">2024-09-01 • Cost: £0</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="p-6 border border-brand-200 text-center rounded-lg bg-brand-50">
          <Wrench className="w-8 h-8 mx-auto mb-2 text-brand-400" />
          <p className="text-sm text-brand-600 mb-3">No maintenance requests</p>
          <button onClick={handleReportIssue} className="ent-btn-primary text-sm">
            Report Issue
          </button>
        </div>
      )}
    </div>
  )
}

const InfoItem = ({ label, value, badge }) => (
  <div>
    <p className="text-xs text-brand-600 mb-1">{label}</p>
    {badge ? (
      <span className={`ent-badge-${badge}`}>{value}</span>
    ) : (
      <p className="text-sm font-medium text-brand-900">{value}</p>
    )}
  </div>
)

export default Property360View
