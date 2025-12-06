import { useState, useEffect } from 'react'
import { Plus, Search, Wrench, AlertCircle, CheckCircle, Clock, X, Edit, Trash2, DollarSign } from 'lucide-react'
import { getMockProperties, getMockMaintenance } from '../lib/mockData'
import { useToast } from '../components/shared/Toast'
import PropertyOnboarding from '../components/property/PropertyOnboarding'

const MaintenancePage = () => {
  const toast = useToast()
  const [workOrders, setWorkOrders] = useState([])
  const [properties, setProperties] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [showPropertyModal, setShowPropertyModal] = useState(false)

  useEffect(() => {
    loadWorkOrders()
    setProperties(getMockProperties())
  }, [])

  const loadWorkOrders = () => {
    setWorkOrders(getMockMaintenance())
  }

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId)
    return property ? `${property.address}, ${property.city}` : 'Unknown Property'
  }

  const filteredOrders = workOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPropertyName(order.propertyId).toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStats = () => {
    return {
      open: workOrders.filter(o => o.status === 'Open').length,
      inProgress: workOrders.filter(o => o.status === 'In Progress').length,
      completed: workOrders.filter(o => o.status === 'Completed').length,
      totalCost: workOrders.reduce((sum, o) => sum + (o.cost || 0), 0)
    }
  }

  const stats = getStats()

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'info'
    }
    return colors[priority] || 'neutral'
  }

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'error',
      'In Progress': 'warning',
      'Completed': 'success'
    }
    return colors[status] || 'neutral'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'Open': AlertCircle,
      'In Progress': Clock,
      'Completed': CheckCircle
    }
    return icons[status] || Clock
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const orderData = {
      id: editingOrder?.id || `maint-${Date.now()}`,
      propertyId: formData.get('propertyId'),
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      status: formData.get('status'),
      category: formData.get('category'),
      assignedTo: formData.get('assignedTo'),
      cost: parseInt(formData.get('cost')) || 0,
      createdDate: editingOrder?.createdDate || new Date().toISOString().split('T')[0],
      completedDate: formData.get('status') === 'Completed' ? new Date().toISOString().split('T')[0] : null,
      tenantReported: formData.get('tenantReported') === 'on'
    }

    let updatedOrders
    if (editingOrder) {
      updatedOrders = workOrders.map(o => o.id === editingOrder.id ? orderData : o)
      toast.success('Work order updated successfully')
    } else {
      updatedOrders = [...workOrders, orderData]
      toast.success('Work order created successfully')
    }

    setWorkOrders(updatedOrders)
    const userOrders = updatedOrders.filter(o => !o.id.startsWith('maint-'))
    localStorage.setItem('maintenance', JSON.stringify(userOrders))

    setModalOpen(false)
    setEditingOrder(null)
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
    setModalOpen(true)
  }

  const handleDelete = (orderId) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      const updatedOrders = workOrders.filter(o => o.id !== orderId)
      setWorkOrders(updatedOrders)
      const userOrders = updatedOrders.filter(o => !o.id.startsWith('maint-'))
      localStorage.setItem('xperty_maintenance', JSON.stringify(userOrders))
      toast.success('Work order deleted successfully')
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Maintenance</h1>
          <p className="text-brand-600">Track and manage work orders</p>
        </div>
        <button
          onClick={() => {
            setEditingOrder(null)
            setModalOpen(true)
          }}
          className="ent-btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Create Work Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-error-light border border-error/30 rounded">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-error" />
            <span className="text-sm font-medium text-error-dark">Open Orders</span>
          </div>
          <div className="text-2xl font-bold text-error-dark">{stats.open}</div>
        </div>

        <div className="p-4 bg-warning-light border border-warning/30 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-warning-dark">In Progress</span>
          </div>
          <div className="text-2xl font-bold text-warning-dark">{stats.inProgress}</div>
        </div>

        <div className="p-4 bg-success-light border border-success/30 rounded">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success-dark">Completed</span>
          </div>
          <div className="text-2xl font-bold text-success-dark">{stats.completed}</div>
        </div>

        <div className="p-4 bg-brand-100 border border-brand-300 rounded">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-brand-700" />
            <span className="text-sm font-medium text-brand-700">Total Cost</span>
          </div>
          <div className="text-2xl font-bold text-brand-900">£{stats.totalCost.toLocaleString()}</div>
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
            placeholder="Search work orders..."
            className="ent-input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ent-select sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Work Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="ent-card p-12 text-center">
          <Wrench className="w-16 h-16 mx-auto mb-4 text-brand-400" />
          <h3 className="text-xl font-semibold text-brand-900 mb-2">No Work Orders Found</h3>
          <p className="text-sm text-brand-600 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first work order to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => setModalOpen(true)}
              className="ent-btn-primary"
            >
              Create Your First Work Order
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            return (
              <div key={order.id} className="ent-card p-4 hover:border-brand-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusIcon className={`w-5 h-5 text-${getStatusColor(order.status)}`} />
                      <h3 className="font-semibold text-brand-900">{order.title}</h3>
                      <span className={`ent-badge-${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`ent-badge-${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                      <span className="ent-badge-neutral">{order.category}</span>
                    </div>

                    <p className="text-sm text-brand-600 mb-3">
                      {getPropertyName(order.propertyId)}
                    </p>

                    <p className="text-sm text-brand-700 mb-3">{order.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div>
                        <span className="text-brand-600">Assigned:</span>
                        <span className="ml-1 font-medium text-brand-900">{order.assignedTo}</span>
                      </div>
                      <div>
                        <span className="text-brand-600">Cost:</span>
                        <span className="ml-1 font-medium text-brand-900">£{order.cost}</span>
                      </div>
                      <div>
                        <span className="text-brand-600">Created:</span>
                        <span className="ml-1 text-brand-900">{new Date(order.createdDate).toLocaleDateString()}</span>
                      </div>
                      {order.completedDate && (
                        <div>
                          <span className="text-brand-600">Completed:</span>
                          <span className="ml-1 text-brand-900">{new Date(order.completedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {order.tenantReported && (
                        <span className="ent-badge-info">Tenant Reported</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(order)}
                      className="p-2 text-brand-600 hover:bg-brand-100 transition-colors rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 text-error hover:bg-error-light transition-colors rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-brand-900/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false)
              setEditingOrder(null)
            }
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .maintenance-modal-container {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                position: relative !important;
              }
              .maintenance-modal-container form {
                overflow-y: auto !important;
                overflow-x: hidden !important;
                max-height: calc(90vh - 80px) !important;
              }
              .maintenance-modal-container select {
                position: relative !important;
                max-width: 100% !important;
              }
            }
          `}</style>
          <div className="maintenance-modal-container bg-white w-full max-w-2xl max-h-[90vh] rounded flex flex-col overflow-hidden">
            <div className="p-6 border-b border-brand-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-brand-900">
                {editingOrder ? 'Edit Work Order' : 'Create Work Order'}
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false)
                  setEditingOrder(null)
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
                    onClick={() => {
                      setModalOpen(false) // Close the work order modal first
                      setShowPropertyModal(true) // Then open property modal
                    }}
                    className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add New Property
                  </button>
                </div>
                <select
                  name="propertyId"
                  defaultValue={editingOrder?.propertyId}
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

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingOrder?.title}
                  className="ent-input"
                  placeholder="Leaking tap, broken boiler, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  name="description"
                  defaultValue={editingOrder?.description}
                  className="ent-input"
                  rows="3"
                  placeholder="Detailed description of the issue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Priority <span className="text-error">*</span>
                  </label>
                  <select
                    name="priority"
                    defaultValue={editingOrder?.priority || 'Medium'}
                    className="ent-select"
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Status <span className="text-error">*</span>
                  </label>
                  <select
                    name="status"
                    defaultValue={editingOrder?.status || 'Open'}
                    className="ent-select"
                    required
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    name="category"
                    defaultValue={editingOrder?.category || 'General'}
                    className="ent-select"
                    required
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">
                    Cost (£) <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    name="cost"
                    defaultValue={editingOrder?.cost || 0}
                    className="ent-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">
                  Assigned To <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  defaultValue={editingOrder?.assignedTo || ''}
                  className="ent-input"
                  placeholder="Contractor or service provider"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="tenantReported"
                  defaultChecked={editingOrder?.tenantReported}
                  className="w-4 h-4 border-brand-300 text-primary focus:ring-primary"
                />
                <label className="text-sm text-brand-700">
                  Tenant reported issue
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false)
                    setEditingOrder(null)
                  }}
                  className="flex-1 ent-btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 ent-btn-primary">
                  {editingOrder ? 'Update Order' : 'Create Order'}
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

export default MaintenancePage