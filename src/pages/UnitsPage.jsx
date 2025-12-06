import { useState, useEffect } from 'react'
import { Plus, Search, Building2, Grid3x3, Users, X, Edit, Trash2 } from 'lucide-react'

import { useToast } from '../components/shared/Toast'
import PropertyOnboarding from '../components/property/PropertyOnboarding'

const UnitsPage = () => {
  const toast = useToast()
  const [units, setUnits] = useState([])
  const [properties, setProperties] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProperty, setSelectedProperty] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [showPropertyModal, setShowPropertyModal] = useState(false)

  // Form state for controlled inputs (needed for auto-selection)
  const [formData, setFormData] = useState({
    propertyId: '',
    unitNumber: '',
    type: 'Studio',
    size: '',
    rent: '',
    floor: 0,
    status: 'Vacant',
    tenantName: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load Units
    const savedUnits = JSON.parse(localStorage.getItem('xperty_units') || '[]')
    setUnits(savedUnits)

    // Load Properties
    const savedProps = JSON.parse(localStorage.getItem('xperty_properties') || '[]')
    setProperties(savedProps)
  }

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId)
    return property ? `${property.address}, ${property.city}` : 'Unknown Property'
  }

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPropertyName(unit.propertyId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.tenantName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProperty = selectedProperty === 'all' || unit.propertyId === selectedProperty
    return matchesSearch && matchesProperty
  })

  const getStats = () => {
    return {
      total: units.length,
      occupied: units.filter(u => u.status === 'Occupied').length,
      vacant: units.filter(u => u.status === 'Vacant').length,
      maintenance: units.filter(u => u.status === 'Maintenance').length
    }
  }

  const stats = getStats()

  const handleOpenModal = (unit = null) => {
    if (unit) {
      setEditingUnit(unit)
      setFormData({
        propertyId: unit.propertyId,
        unitNumber: unit.unitNumber,
        type: unit.type,
        size: unit.size,
        rent: unit.rent,
        floor: unit.floor,
        status: unit.status,
        tenantName: unit.tenantName || ''
      })
    } else {
      setEditingUnit(null)
      setFormData({
        propertyId: '',
        unitNumber: '',
        type: 'Studio',
        size: '',
        rent: '',
        floor: 0,
        status: 'Vacant',
        tenantName: ''
      })
    }
    setModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.propertyId) {
      toast.error('Please select a property')
      return
    }

    const unitData = {
      id: editingUnit?.id || `unit-${Date.now()}`,
      propertyId: formData.propertyId,
      unitNumber: formData.unitNumber,
      type: formData.type,
      size: parseInt(formData.size),
      rent: parseInt(formData.rent),
      status: formData.status,
      floor: parseInt(formData.floor),
      tenantId: null,
      tenantName: formData.tenantName || null
    }

    let updatedUnits
    if (editingUnit) {
      updatedUnits = units.map(u => u.id === editingUnit.id ? unitData : u)
      toast.success('Unit updated successfully')
    } else {
      updatedUnits = [...units, unitData]
      toast.success('Unit added successfully')
    }

    setUnits(updatedUnits)
    const userUnits = updatedUnits.filter(u => !u.id.startsWith('unit-'))
    localStorage.setItem('xperty_units', JSON.stringify(userUnits))

    setModalOpen(false)
    setEditingUnit(null)
  }

  const handleDelete = (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      const updatedUnits = units.filter(u => u.id !== unitId)
      setUnits(updatedUnits)
      const userUnits = updatedUnits.filter(u => !u.id.startsWith('unit-'))
      localStorage.setItem('xperty_units', JSON.stringify(userUnits))
      toast.success('Unit deleted successfully')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Occupied': 'success',
      'Vacant': 'warning',
      'Maintenance': 'error'
    }
    return colors[status] || 'neutral'
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Units</h1>
          <p className="text-brand-600">Manage property units and tenancy</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="ent-btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Unit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="ent-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Grid3x3 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-brand-700">Total Units</span>
          </div>
          <div className="text-2xl font-bold text-brand-900">{stats.total}</div>
        </div>

        <div className="ent-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-brand-700">Occupied</span>
          </div>
          <div className="text-2xl font-bold text-success">{stats.occupied}</div>
        </div>

        <div className="ent-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-brand-700">Vacant</span>
          </div>
          <div className="text-2xl font-bold text-warning">{stats.vacant}</div>
        </div>

        <div className="ent-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-error" />
            <span className="text-sm font-medium text-brand-700">Maintenance</span>
          </div>
          <div className="text-2xl font-bold text-error">{stats.maintenance}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units..."
            className="ent-input pl-10"
          />
        </div>
        <select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className="ent-select sm:w-64"
        >
          <option value="all">All Properties</option>
          {properties.map(prop => (
            <option key={prop.id} value={prop.id}>
              {prop.address}
            </option>
          ))}
        </select>
      </div>

      {/* Units List */}
      {filteredUnits.length === 0 ? (
        <div className="ent-card p-12 text-center">
          <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-brand-400" />
          <h3 className="text-xl font-semibold text-brand-900 mb-2">No Units Found</h3>
          <p className="text-sm text-brand-600 mb-6">
            {searchQuery || selectedProperty !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first unit'}
          </p>
          {!searchQuery && selectedProperty === 'all' && (
            <button
              onClick={() => handleOpenModal()}
              className="ent-btn-primary"
            >
              Add Your First Unit
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="ent-card p-4 hover:border-brand-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-brand-900">{unit.unitNumber}</h3>
                    <span className={`ent-badge-${getStatusColor(unit.status)}`}>
                      {unit.status}
                    </span>
                    <span className="ent-badge-neutral">{unit.type}</span>
                  </div>

                  <p className="text-sm text-brand-600 mb-3">
                    {getPropertyName(unit.propertyId)} • Floor {unit.floor}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-brand-600">Size:</span>
                      <span className="ml-1 font-medium text-brand-900">{unit.size} sq ft</span>
                    </div>
                    <div>
                      <span className="text-brand-600">Rent:</span>
                      <span className="ml-1 font-medium text-brand-900">£{unit.rent}/mo</span>
                    </div>
                    {unit.tenantName && (
                      <div className="col-span-2">
                        <span className="text-brand-600">Tenant:</span>
                        <span className="ml-1 font-medium text-brand-900">{unit.tenantName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleOpenModal(unit)}
                    className="p-2 text-brand-600 hover:bg-brand-100 transition-colors rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(unit.id)}
                    className="p-2 text-error hover:bg-error-light transition-colors rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-brand-900/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false)
              setEditingUnit(null)
            }
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .unit-modal-container {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                position: relative !important;
              }
              .unit-modal-container form {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                max-height: calc(90vh - 80px) !important;
              }
              .unit-modal-container select {
                position: relative !important;
                max-width: 100% !important;
              }
            }
          `}</style>
          <div className="unit-modal-container bg-white w-full max-w-2xl max-h-[90vh] rounded flex flex-col overflow-hidden">
            <div className="p-6 border-b border-brand-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-brand-900">
                {editingUnit ? 'Edit Unit' : 'Add New Unit'}
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false)
                  setEditingUnit(null)
                }}
                className="p-1 text-brand-600 hover:text-brand-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-brand-700">
                    Property <span className="text-error">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPropertyModal(true)}
                    className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add New Property
                  </button>
                </div>
                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="ent-select"
                  required
                >
                  <option value="">Select property</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>
                      {prop.address}, {prop.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Unit Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="ent-input"
                    placeholder="Unit A, Room 1, Flat 12"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Type <span className="text-error">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="ent-select"
                    required
                  >
                    <option value="Studio">Studio</option>
                    <option value="1BR">1 Bedroom</option>
                    <option value="2BR">2 Bedroom</option>
                    <option value="3BR">3 Bedroom</option>
                    <option value="4BR">4 Bedroom</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Size (sq ft) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="ent-input"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Rent (£/mo) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                    className="ent-input"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Floor <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="ent-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Status <span className="text-error">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="ent-select"
                  required
                >
                  <option value="Occupied">Occupied</option>
                  <option value="Vacant">Vacant</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Tenant Name (Optional)
                </label>
                <input
                  type="text"
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  className="ent-input"
                  placeholder="Current tenant name"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false)
                    setEditingUnit(null)
                  }}
                  className="flex-1 ent-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 ent-btn-primary">
                  {editingUnit ? 'Update Unit' : 'Add Unit'}
                </button>
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

                // Auto-select the new property
                setFormData(prev => ({
                  ...prev,
                  propertyId: newProperty.id
                }))

              toast.success('Property added successfully')
              setShowPropertyModal(false)
            }}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default UnitsPage