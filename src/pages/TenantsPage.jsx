import { useState, useEffect } from 'react'
import { Plus, Search, Mail, Phone, Home, Eye, X, Edit, Trash2 } from 'lucide-react'
import { getMockTenants, getMockProperties } from '../lib/mockData'
import Tenant360View from '../components/tenant/Tenant360View'
import PropertyOnboarding from '../components/property/PropertyOnboarding'
import { useToast } from '../components/shared/Toast'

const TenantsPage = () => {
  const toast = useToast()
  const [tenants, setTenants] = useState([])
  const [properties, setProperties] = useState([])
  const [units, setUnits] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTenant, setSelectedTenant] = useState(null)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [showPropertyModal, setShowPropertyModal] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    unitId: '',
    rentAmount: '',
    leaseStart: '',
    leaseEnd: '',
    status: 'Active'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load Tenants
    setTenants(getMockTenants())

    // Load Properties
    setProperties(getMockProperties())

    // Load Units (for selection)
    const savedUnits = JSON.parse(localStorage.getItem('xperty_units') || '[]')
    setUnits(savedUnits)
  }

  const handleOpenModal = (tenant = null) => {
    if (tenant) {
      setEditingTenant(tenant)
      // Find property ID based on unit or some other link if not directly stored
      // For simplicity, assuming we might not have propertyId directly in tenant object in mock data
      // but in a real app we would.
      setFormData({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        propertyId: tenant.propertyId || '', // Assuming we add this to tenant model
        unitId: tenant.unitId || '', // Assuming we add this
        rentAmount: tenant.rentAmount,
        leaseStart: tenant.leaseStart,
        leaseEnd: tenant.leaseEnd,
        status: tenant.status
      })
    } else {
      setEditingTenant(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        propertyId: '',
        unitId: '',
        rentAmount: '',
        leaseStart: '',
        leaseEnd: '',
        status: 'Active'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTenant(null)
  }

  const handleSave = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.propertyId) {
      toast.error('Please fill in all required fields')
      return
    }

    const newTenant = {
      ...formData,
      id: editingTenant ? editingTenant.id : `tenant-${Date.now()}`,
      unit: units.find(u => u.id === formData.unitId)?.unitNumber || 'Assigned Unit' // Fallback for display
    }

    let updatedTenants
    if (editingTenant) {
      updatedTenants = tenants.map(t => t.id === editingTenant.id ? newTenant : t)
      toast.success('Tenant updated successfully')
    } else {
      updatedTenants = [...tenants, newTenant]
      toast.success('Tenant added successfully')
    }

    setTenants(updatedTenants)
    // Filter out mock tenants before saving to localStorage to avoid duplication if we were merging
    // But here we are just saving new ones usually. For simplicity, let's save only new ones or all if we want persistence
    const userTenants = updatedTenants.filter(t => t.id.startsWith('tenant-'))
    localStorage.setItem('tenants', JSON.stringify(userTenants))

    handleCloseModal()
  }

  const handleDelete = (tenantId) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      const updatedTenants = tenants.filter(t => t.id !== tenantId)
      setTenants(updatedTenants)
      const userTenants = updatedTenants.filter(t => t.id.startsWith('tenant-'))
      localStorage.setItem('xperty_tenants', JSON.stringify(userTenants))
      toast.success('Tenant deleted successfully')
    }
  }

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter units based on selected property
  const availableUnits = units.filter(u => u.propertyId === formData.propertyId)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Tenants</h1>
          <p className="text-brand-600">Manage tenant information and leases</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="ent-btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Tenant
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenants..."
            className="ent-input pl-10"
          />
        </div>
      </div>

      {filteredTenants.length === 0 ? (
        <div className="ent-card p-12 text-center">
          <Home className="w-16 h-16 mx-auto mb-4 text-brand-400" />
          <h3 className="text-xl font-semibold text-brand-900 mb-2">No Tenants Found</h3>
          <p className="text-sm text-brand-600 mb-6">
            {searchQuery ? 'Try adjusting your search' : 'Start by adding your first tenant'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => handleOpenModal()}
              className="ent-btn-primary"
            >
              Add Your First Tenant
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenants.map((tenant) => (
            <div key={tenant.id} className="ent-card p-6 relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-light text-primary flex items-center justify-center font-bold text-lg rounded">
                  {tenant.name.charAt(0)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="ent-badge-success">{tenant.status}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenModal(tenant); }}
                      className="p-1.5 text-brand-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                      title="Edit Tenant"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(tenant.id); }}
                      className="p-1.5 text-error/60 hover:text-error hover:bg-error-light rounded transition-colors"
                      title="Delete Tenant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-brand-900 mb-1">{tenant.name}</h3>
              <p className="text-sm text-brand-600 mb-4">{tenant.unit}</p>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-brand-700">
                  <Mail className="w-4 h-4 text-brand-400" />
                  {tenant.email}
                </div>
                <div className="flex items-center gap-2 text-brand-700">
                  <Phone className="w-4 h-4 text-brand-400" />
                  {tenant.phone}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-200 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-brand-600">Rent:</span>
                    <span className="ml-1 font-semibold text-brand-900">£{tenant.rentAmount}</span>
                  </div>
                  <div>
                    <span className="text-brand-600">Lease:</span>
                    <span className="ml-1 font-semibold text-brand-900">
                      {new Date(tenant.leaseEnd).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTenant(tenant.id)}
                className="ent-btn-primary w-full flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Tenant Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal()
            }
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .tenant-modal-container {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                position: relative !important;
              }
              .tenant-modal-container form {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                max-height: calc(90vh - 80px) !important;
              }
              .tenant-modal-container select {
                position: relative !important;
                max-width: 100% !important;
              }
            }
          `}</style>
          <div className="tenant-modal-container bg-white rounded-lg shadow-xl w-full max-w-[clamp(320px,95vw,672px)] max-h-[90vh] flex flex-col overflow-hidden min-w-0">
            <div className="flex items-center justify-between p-6 border-b border-brand-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-brand-900">
                {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
              </h2>
              <button onClick={handleCloseModal} className="text-brand-500 hover:text-brand-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-semibold text-brand-900 mb-3 uppercase tracking-wider">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-brand-700 mb-1">Full Name <span className="text-error">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="ent-input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Email <span className="text-error">*</span></label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="ent-input"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Phone  <span className="text-error">*</span></label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="ent-input"
                      placeholder="+44 7700 900000"
                    />
                  </div>
                </div>
              </div>

              {/* Lease Info */}
              <div>
                <h3 className="text-sm font-semibold text-brand-900 mb-3 uppercase tracking-wider">Lease Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-brand-700">Property  <span className="text-error">*</span></label>
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
                      value={formData.propertyId}
                      onChange={(e) => setFormData({ ...formData, propertyId: e.target.value, unitId: '' })}
                      className="ent-select"
                      required
                    >
                      <option value="">Select Property</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.address}, {p.city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Unit</label>
                    <select
                      value={formData.unitId}
                      onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                      className="ent-select"
                      disabled={!formData.propertyId}
                    >
                      <option value="">Select Unit (Optional)</option>
                      {availableUnits.map(u => (
                        <option key={u.id} value={u.id}>{u.unitNumber}</option>
                      ))}
                    </select>
                    {formData.propertyId && availableUnits.length === 0 && (
                      <p className="text-xs text-warning mt-1">No units found for this property.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Rent Amount (£)</label>
                    <input
                      type="number"
                      value={formData.rentAmount}
                      onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                      className="ent-input"
                      placeholder="1500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Lease Start</label>
                    <input
                      type="date"
                      value={formData.leaseStart}
                      onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
                      className="ent-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-1">Lease End</label>
                    <input
                      type="date"
                      value={formData.leaseEnd}
                      onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
                      className="ent-input"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="ent-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ent-btn-primary"
                >
                  {editingTenant ? 'Save Changes' : 'Add Tenant'}
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

      {/* Tenant 360 View */}
      {selectedTenant && (
        <Tenant360View
          tenantId={selectedTenant}
          onClose={() => setSelectedTenant(null)}
        />
      )}
    </div>
  )
}

export default TenantsPage