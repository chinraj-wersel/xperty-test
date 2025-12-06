import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Eye, Edit, Trash2, Building2, CheckCircle, LayoutGrid, List, Image as ImageIcon } from 'lucide-react'
import { getMockProperties } from '../lib/mockData'
import Property360View from '../components/property/Property360View'

const PropertiesPage = () => {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [selectedProperty, setSelectedProperty] = useState(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = () => {
    setProperties(getMockProperties())
  }

  const filteredProperties = properties.filter(prop =>
    prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.postcode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleView = (property) => {
    setSelectedProperty(property.id)
  }

  const handleEdit = (property) => {
    navigate('/dashboard/properties/new', { state: { property } })
  }

  const handleDelete = (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      const updatedProperties = properties.filter(p => p.id !== propertyId)
      const userProperties = updatedProperties.filter(p => !p.id.startsWith('prop-'))
      localStorage.setItem('xperty_properties', JSON.stringify(userProperties))
      setProperties(updatedProperties)
    }
  }

  const getPropertyImage = (property) => {
    if (property.documents && property.documents.length > 0) {
      const imageDoc = property.documents.find(doc => doc.type.startsWith('image/') && doc.preview)
      return imageDoc ? imageDoc.preview : null
    }
    return null
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Properties</h1>
          <p className="text-brand-600">Manage your property portfolio</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/properties/new')}
          className="ent-btn-primary flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties..."
            className="ent-input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="hidden md:flex bg-white rounded-lg border border-brand-200 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-brand-100 text-brand-900' : 'text-brand-500 hover:text-brand-700'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded ${viewMode === 'card' ? 'bg-brand-100 text-brand-900' : 'text-brand-500 hover:text-brand-700'}`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button className="ent-btn-secondary flex items-center gap-2 justify-center sm:w-auto">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Properties Table/Grid */}
      {filteredProperties.length === 0 ? (
        <div className="ent-card p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-brand-100 rounded flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="text-xl font-semibold text-brand-900 mb-2">
              {searchQuery ? 'No properties found' : 'No Properties Yet'}
            </h3>
            <p className="text-sm text-brand-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first property'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/dashboard/properties/new')}
                className="ent-btn-primary"
              >
                Add Your First Property
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          {viewMode === 'list' ? (
            <div className="hidden md:block ent-card overflow-x-auto min-w-0">
              <table className="ent-table min-w-full">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Type</th>
                    <th>Beds/Baths</th>
                    <th>Status</th>
                    <th>Tenants</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-brand-50 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-brand-100 flex-shrink-0 overflow-hidden flex items-center justify-center border border-brand-200">
                            {getPropertyImage(property) ? (
                              <img src={getPropertyImage(property)} alt={property.address} className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-6 h-6 text-brand-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-brand-900">{property.address}</div>
                            <div className="text-sm text-brand-600">{property.city} {property.postcode}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-brand-900">{property.propertyType}</div>
                      </td>
                      <td>
                        <div className="text-sm text-brand-900">
                          {property.bedrooms} bed / {property.bathrooms} bath
                        </div>
                      </td>
                      <td>
                        <span className="ent-badge-success">{property.status}</span>
                      </td>
                      <td>
                        <div className="text-sm text-brand-900">{property.tenants || 0}</div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {property.status === 'Draft' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const updatedProperties = properties.map(p =>
                                  p.id === property.id ? { ...p, status: 'Active' } : p
                                )
                                const userProperties = updatedProperties.filter(p => !p.id.startsWith('prop-'))
                                localStorage.setItem('properties', JSON.stringify(userProperties))
                                setProperties(updatedProperties)
                              }}
                              className="p-2 text-success hover:bg-success-light transition-colors rounded"
                              title="Activate Property"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleView(property)}
                            className="p-2 text-brand-600 hover:bg-brand-100 transition-colors rounded"
                            title="View Property"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(property)}
                            className="p-2 text-brand-600 hover:bg-brand-100 transition-colors rounded"
                            title="Edit Property"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-error hover:bg-error-light transition-colors rounded"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card View Grid */
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const image = getPropertyImage(property)
                return (
                  <div key={property.id} className="ent-card hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
                    {/* Card Image Header */}
                    <div className="h-48 bg-brand-100 relative group">
                      {image ? (
                        <img src={image} alt={property.address} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-50">
                          <Building2 className="w-16 h-16 text-brand-200" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="ent-badge-success shadow-sm">{property.status}</span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="font-semibold text-brand-900 text-lg mb-1 truncate" title={property.address}>{property.address}</h3>
                        <p className="text-sm text-brand-600">{property.city} {property.postcode}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm mb-5">
                        <div>
                          <span className="text-brand-500 block text-xs uppercase tracking-wider font-medium mb-1">Type</span>
                          <span className="text-brand-900 font-medium truncate" title={property.propertyType}>{property.propertyType}</span>
                        </div>
                        <div>
                          <span className="text-brand-500 block text-xs uppercase tracking-wider font-medium mb-1">Config</span>
                          <span className="text-brand-900 font-medium">{property.bedrooms} Bed / {property.bathrooms} Bath</span>
                        </div>
                        <div>
                          <span className="text-brand-500 block text-xs uppercase tracking-wider font-medium mb-1">Tenants</span>
                          <span className="text-brand-900 font-medium">{property.tenants || 0}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-brand-100 flex items-center gap-2">
                        <button
                          onClick={() => handleView(property)}
                          className="flex-1 ent-btn-secondary py-2 text-sm justify-center"
                        >
                          View Details
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(property)}
                            className="p-2 text-brand-600 hover:bg-brand-100 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-error hover:bg-error-light rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className="ent-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-900">{property.address}</h3>
                    <p className="text-sm text-brand-600">{property.city} {property.postcode}</p>
                  </div>
                  <span className="ent-badge-success">{property.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-brand-600">Type:</span>
                    <span className="ml-1 text-brand-900">{property.propertyType}</span>
                  </div>
                  <div>
                    <span className="text-brand-600">Beds/Baths:</span>
                    <span className="ml-1 text-brand-900">{property.bedrooms}/{property.bathrooms}</span>
                  </div>
                  <div>
                    <span className="text-brand-600">Tenants:</span>
                    <span className="ml-1 text-brand-900">{property.tenants || 0}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-brand-200">
                  <button
                    onClick={() => handleView(property)}
                    className="flex-1 ent-btn-secondary py-2 text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(property)}
                    className="p-2 text-brand-600 hover:bg-brand-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="p-2 text-error hover:bg-error-light rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )
      }

      {/* Property 360 View */}
      {
        selectedProperty && (
          <Property360View
            propertyId={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )
      }
    </div >
  )
}

export default PropertiesPage