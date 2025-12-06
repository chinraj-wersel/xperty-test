import { useState, useEffect } from 'react'
import { Plus, Search, Zap, Droplet, Flame, TrendingUp, X, Download } from 'lucide-react'
import { getMockProperties } from '../lib/mockData'
import { useToast } from '../components/shared/Toast'
import PropertyOnboarding from '../components/property/PropertyOnboarding'

const MetersPage = () => {
  const toast = useToast()
  const [readings, setReadings] = useState([])
  const [properties, setProperties] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [meterTypeFilter, setMeterTypeFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [showPropertyModal, setShowPropertyModal] = useState(false)

  useEffect(() => {
    loadReadings()
    setProperties(getMockProperties())
  }, [])

  const loadReadings = () => {
    const savedReadings = JSON.parse(localStorage.getItem('xperty_meters') || '[]')
    setReadings(savedReadings)
  }

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId)
    return property ? `${property.address}, ${property.city}` : 'Unknown'
  }

  const filteredReadings = readings.filter(reading => {
    const matchesSearch = reading.meterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPropertyName(reading.propertyId).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = meterTypeFilter === 'all' || reading.meterType === meterTypeFilter
    return matchesSearch && matchesType
  })

  const getStats = () => {
    const thisMonth = readings.filter(r => {
      const readingMonth = new Date(r.readingDate).getMonth()
      const currentMonth = new Date().getMonth()
      return readingMonth === currentMonth
    })

    return {
      properties: [...new Set(readings.map(r => r.propertyId))].length,
      readingsThisMonth: thisMonth.length,
      avgUsage: thisMonth.length > 0 ? Math.round(thisMonth.reduce((sum, r) => sum + r.usage, 0) / thisMonth.length) : 0,
      alerts: readings.filter(r => r.usage > (r.previousReading * 0.2)).length
    }
  }

  const stats = getStats()

  const getMeterIcon = (type) => {
    const icons = { 'Electric': Zap, 'Gas': Flame, 'Water': Droplet }
    return icons[type] || Zap
  }

  const getMeterColor = (type) => {
    const colors = { 'Electric': 'warning', 'Gas': 'error', 'Water': 'info' }
    return colors[type] || 'neutral'
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const previousReading = parseInt(formData.get('previousReading')) || 0
    const currentReading = parseInt(formData.get('reading'))

    const readingData = {
      id: `meter-${Date.now()}`,
      propertyId: formData.get('propertyId'),
      meterType: formData.get('meterType'),
      meterNumber: formData.get('meterNumber'),
      reading: currentReading,
      unit: formData.get('unit'),
      readingDate: formData.get('readingDate'),
      previousReading: previousReading,
      usage: currentReading - previousReading,
      cost: (currentReading - previousReading) * 0.20,
      readBy: formData.get('readBy')
    }

    const updatedReadings = [...readings, readingData]
    setReadings(updatedReadings)
    const userReadings = updatedReadings.filter(r => !r.id.startsWith('meter-'))
    localStorage.setItem('xperty_meters', JSON.stringify(userReadings))

    setModalOpen(false)
    toast.success('Meter reading added successfully')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Meters</h1>
          <p className="text-brand-600">Track utility meter readings</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="ent-btn-primary flex items-center gap-2 justify-center">
          <Plus className="w-4 h-4" />
          Add Reading
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="ent-card p-4">
          <div className="text-sm text-brand-600 mb-1">Total Properties</div>
          <div className="text-2xl font-bold text-brand-900">{stats.properties}</div>
        </div>
        <div className="ent-card p-4">
          <div className="text-sm text-brand-600 mb-1">Readings This Month</div>
          <div className="text-2xl font-bold text-primary">{stats.readingsThisMonth}</div>
        </div>
        <div className="ent-card p-4">
          <div className="text-sm text-brand-600 mb-1">Average Usage</div>
          <div className="text-2xl font-bold text-success">{stats.avgUsage}</div>
        </div>
        <div className="ent-card p-4">
          <div className="text-sm text-brand-600 mb-1">Usage Alerts</div>
          <div className="text-2xl font-bold text-error">{stats.alerts}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search readings..." className="ent-input pl-10" />
        </div>
        <select value={meterTypeFilter} onChange={(e) => setMeterTypeFilter(e.target.value)} className="ent-select sm:w-48">
          <option value="all">All Meters</option>
          <option value="Electric">Electric</option>
          <option value="Gas">Gas</option>
          <option value="Water">Water</option>
        </select>
      </div>

      {filteredReadings.length === 0 ? (
        <div className="ent-card p-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-brand-400" />
          <h3 className="text-xl font-semibold text-brand-900 mb-2">No Readings Found</h3>
          <p className="text-sm text-brand-600 mb-6">Add your first meter reading to start tracking usage</p>
          <button onClick={() => setModalOpen(true)} className="ent-btn-primary">Add Your First Reading</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReadings.map((reading) => {
            const Icon = getMeterIcon(reading.meterType)
            return (
              <div key={reading.id} className="ent-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 bg-${getMeterColor(reading.meterType)}-light text-${getMeterColor(reading.meterType)} flex items-center justify-center rounded`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-brand-900">{reading.meterType} Meter</h3>
                        <span className={`ent-badge-${getMeterColor(reading.meterType)}`}>{reading.meterNumber}</span>
                      </div>
                      <p className="text-sm text-brand-600 mb-3">{getPropertyName(reading.propertyId)}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-brand-600">Reading:</span> <span className="ml-1 font-medium text-brand-900">{reading.reading} {reading.unit}</span></div>
                        <div><span className="text-brand-600">Usage:</span> <span className="ml-1 font-medium text-success">{reading.usage} {reading.unit}</span></div>
                        <div><span className="text-brand-600">Cost:</span> <span className="ml-1 font-medium text-brand-900">£{reading.cost.toFixed(2)}</span></div>
                        <div><span className="text-brand-600">Date:</span> <span className="ml-1 text-brand-900">{new Date(reading.readingDate).toLocaleDateString()}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <div 
          className="fixed inset-0 bg-brand-900/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false)
            }
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .meter-modal-container {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                position: relative !important;
              }
              .meter-modal-container form {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                max-height: calc(90vh - 80px) !important;
              }
              .meter-modal-container select {
                position: relative !important;
                max-width: 100% !important;
              }
            }
          `}</style>
          <div className="meter-modal-container bg-white w-full max-w-2xl max-h-[90vh] rounded flex flex-col overflow-hidden">
            <div className="p-6 border-b border-brand-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-brand-900">Add Meter Reading</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-brand-600 hover:text-brand-900"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-brand-700">Property <span className="text-error">*</span></label>
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false) // Close the meter reading modal first
                      setShowPropertyModal(true) // Then open property modal
                    }}
                    className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add New Property
                  </button>
                </div>
                <select name="propertyId" className="ent-select" required>
                  <option value="">Select property</option>
                  {properties.map(prop => <option key={prop.id} value={prop.id}>{prop.address}, {prop.city}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Meter Type <span className="text-error">*</span></label>
                  <select name="meterType" className="ent-select" required>
                    <option value="Electric">Electric</option>
                    <option value="Gas">Gas</option>
                    <option value="Water">Water</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Meter Number <span className="text-error">*</span></label>
                  <input type="text" name="meterNumber" className="ent-input" placeholder="E12345" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Previous Reading <span className="text-error">*</span></label>
                  <input type="number" name="previousReading" className="ent-input" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Current Reading <span className="text-error">*</span></label>
                  <input type="number" name="reading" className="ent-input" min="0" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Unit <span className="text-error">*</span></label>
                  <select name="unit" className="ent-select" required>
                    <option value="kWh">kWh</option>
                    <option value="m³">m³</option>
                    <option value="L">L</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Reading Date <span className="text-error">*</span></label>
                  <input type="date" name="readingDate" className="ent-input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Read By <span className="text-error">*</span></label>
                  <input type="text" name="readBy" className="ent-input" placeholder="Your name" required />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 ent-btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 ent-btn-primary">Add Reading</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Screen Property Onboarding Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto">
          <style>{`
            .property-modal-wrapper > div:first-child {
              min-height: auto !important;
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

                // Update localStorage (PropertyOnboarding handles saving, but we update our local list)
                const savedProps = JSON.parse(localStorage.getItem('xperty_properties') || '[]')
                // Check if it's already saved by PropertyOnboarding, if not add it (it should be saved though)
                if (!savedProps.find(p => p.id === newProperty.id)) {
                  localStorage.setItem('xperty_properties', JSON.stringify([...savedProps, newProperty]))
                } else {
                  // Refresh our list from storage to be sure
                  setProperties(savedProps)
                }

                toast.success('Property added successfully')
                setShowPropertyModal(false)
                // Reopen the meter reading modal after property is added
                setModalOpen(true)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MetersPage