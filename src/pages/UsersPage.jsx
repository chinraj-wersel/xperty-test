import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, User, Shield, Building2, X, Check } from 'lucide-react'
import { useToast } from '../components/shared/Toast'
import { getMockProperties } from '../lib/mockData'
import PropertyOnboarding from '../components/property/PropertyOnboarding'

const UsersPage = () => {
    const toast = useToast()
    const [users, setUsers] = useState([])
    const [properties, setProperties] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)

    // Property Onboarding Modal State
    const [showPropertyModal, setShowPropertyModal] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'Property Manager',
        assignedProperties: [], // Array of property IDs
        status: 'Active'
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = () => {
        // Load Users
        const savedUsers = JSON.parse(localStorage.getItem('xperty_users') || '[]')
        setUsers(savedUsers)

        // Load Properties for assignment
        const mockProps = getMockProperties()
        const savedProps = JSON.parse(localStorage.getItem('properties') || '[]')
        setProperties([...mockProps, ...savedProps])
    }

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user)
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                assignedProperties: user.assignedProperties || [],
                status: user.status
            })
        } else {
            setEditingUser(null)
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                role: 'Property Manager',
                assignedProperties: [],
                status: 'Active'
            })
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingUser(null)
    }

    const handleSave = (e) => {
        e.preventDefault()

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Please fill in all required fields')
            return
        }

        const newUser = {
            ...formData,
            id: editingUser ? editingUser.id : `usr-${Date.now()}`,
            lastActive: editingUser ? editingUser.lastActive : 'Never'
        }

        let updatedUsers
        if (editingUser) {
            updatedUsers = users.map(u => u.id === editingUser.id ? newUser : u)
            toast.success('User updated successfully')
        } else {
            updatedUsers = [...users, newUser]
            toast.success('User added successfully')
        }

        setUsers(updatedUsers)
        localStorage.setItem('managedUsers', JSON.stringify(updatedUsers))
        handleCloseModal()
    }

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const updatedUsers = users.filter(u => u.id !== userId)
            setUsers(updatedUsers)
            localStorage.setItem('xperty_users', JSON.stringify(updatedUsers))
            toast.success('User deleted successfully')
        }
    }

    const togglePropertyAssignment = (propertyId) => {
        setFormData(prev => {
            const current = prev.assignedProperties
            if (propertyId === 'all') {
                if (current.includes('all')) {
                    // Deselect all - remove 'all' and all property IDs
                    return { ...prev, assignedProperties: [] }
                } else {
                    // Select all - add 'all' and all property IDs
                    const allPropertyIds = properties.map(p => p.id)
                    return { ...prev, assignedProperties: ['all', ...allPropertyIds] }
                }
            }

            // If 'all' was selected, deselect it when selecting specific properties
            let newAssignment = current.includes('all') ? current.filter(id => id !== 'all') : [...current]

            if (newAssignment.includes(propertyId)) {
                newAssignment = newAssignment.filter(id => id !== propertyId)
            } else {
                newAssignment.push(propertyId)
            }

            return { ...prev, assignedProperties: newAssignment }
        })
    }

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const roles = [
        { id: 'Property Manager', label: 'Property Manager', desc: 'Full access to assigned properties' },
        { id: 'Maintenance', label: 'Maintenance Manager', desc: 'Can view and update maintenance requests' },
        { id: 'Accountant', label: 'Accountant', desc: 'Access to financial reports and rent tracking' },
        { id: 'Viewer', label: 'Viewer', desc: 'Read-only access to assigned properties' }
    ]

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-900 mb-2">User Management</h1>
                    <p className="text-brand-600">Manage team members and their access permissions</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="ent-btn-primary flex items-center gap-2 justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add User
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
                        placeholder="Search users by name, email or role..."
                        className="ent-input pl-10"
                    />
                </div>
                <button className="ent-btn-secondary flex items-center gap-2 justify-center sm:w-auto">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Users List */}
            {filteredUsers.length === 0 ? (
                <div className="ent-card p-12 text-center">
                    <User className="w-16 h-16 mx-auto mb-4 text-brand-400" />
                    <h3 className="text-xl font-semibold text-brand-900 mb-2">No Users Found</h3>
                    <p className="text-sm text-brand-600 mb-6">
                        {searchQuery
                            ? 'Try adjusting your search or filters'
                            : 'Create your first user to get started'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="ent-btn-primary"
                        >
                            Create Your First User
                        </button>
                    )}
                </div>
            ) : (
                <div className="ent-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="ent-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Assigned Properties</th>
                                    <th>Status</th>
                                    <th>Last Active</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-brand-50 transition-colors">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-medium">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-brand-900">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-brand-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-sm text-brand-600 max-w-xs truncate">
                                                {user.assignedProperties.includes('all')
                                                    ? 'All Properties'
                                                    : `${user.assignedProperties.length} Properties Assigned`}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-success-light text-success' : 'bg-brand-100 text-brand-600'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-sm text-brand-600">{user.lastActive}</div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 text-brand-600 hover:bg-brand-100 transition-colors rounded"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-error hover:bg-error-light transition-colors rounded"
                                                    title="Delete User"
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
                </div>
            )}

            {/* Add/Edit User Modal */}
            {showModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCloseModal()
                        }
                    }}
                >
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-[clamp(320px,95vw,672px)] max-h-[90vh] flex flex-col overflow-hidden min-w-0">
                        <div className="flex items-center justify-between p-6 border-b border-brand-200 flex-shrink-0">
                            <h2 className="text-xl font-bold text-brand-900">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-brand-500 hover:text-brand-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-700 mb-1">First Name <span className="text-error">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="ent-input"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-700 mb-1">Last Name <span className="text-error">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="ent-input"
                                        placeholder="Doe"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-brand-700 mb-1">Email Address <span className="text-error">*</span></label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="ent-input"
                                        placeholder="john.doe@company.com"
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-brand-700 mb-3">Role & Permissions</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {roles.map(role => (
                                        <div
                                            key={role.id}
                                            onClick={() => setFormData({ ...formData, role: role.id })}
                                            className={`cursor-pointer p-3 border rounded-lg transition-all ${formData.role === role.id
                                                ? 'border-primary bg-primary-light ring-1 ring-primary'
                                                : 'border-brand-200 hover:border-brand-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-brand-900">{role.label}</span>
                                                {formData.role === role.id && <Check className="w-4 h-4 text-primary" />}
                                            </div>
                                            <p className="text-xs text-brand-600">{role.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Property Assignment */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-brand-700">Assigned Properties</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPropertyModal(true)}
                                        className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add New Property
                                    </button>
                                </div>
                                <div className="border border-brand-200 rounded-lg overflow-hidden">
                                    <div
                                        onClick={() => togglePropertyAssignment('all')}
                                        className={`p-3 border-b border-brand-200 cursor-pointer flex items-center gap-3 ${formData.assignedProperties.includes('all') ? 'bg-brand-50' : 'hover:bg-brand-50'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.assignedProperties.includes('all') ? 'bg-primary border-primary text-white' : 'border-brand-300'
                                            }`}>
                                            {formData.assignedProperties.includes('all') && <Check className="w-3 h-3" />}
                                        </div>
                                        <span className="font-medium text-brand-900">All Properties</span>
                                    </div>

                                    <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                                        {properties.map(property => (
                                            <div
                                                key={property.id}
                                                onClick={() => togglePropertyAssignment(property.id)}
                                                className={`p-2 rounded cursor-pointer flex items-center gap-3 ${formData.assignedProperties.includes(property.id) ? 'bg-brand-50' : 'hover:bg-brand-50'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.assignedProperties.includes(property.id) ? 'bg-primary border-primary text-white' : 'border-brand-300'
                                                    }`}>
                                                    {formData.assignedProperties.includes(property.id) && <Check className="w-3 h-3" />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-brand-900">{property.address}</div>
                                                    <div className="text-xs text-brand-500">{property.city}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-brand-500 mt-2">
                                    Select which properties this user can access and manage.
                                </p>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-brand-700 mb-2">Account Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="ent-select"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Actions */}
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
                                    {editingUser ? 'Save Changes' : 'Create User'}
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
                                assignedProperties: [...prev.assignedProperties, newProperty.id]
                            }))

                            toast.success('Property added and assigned successfully')
                            setShowPropertyModal(false)
                        }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default UsersPage
