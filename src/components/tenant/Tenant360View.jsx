import { useState, useEffect } from 'react'
import { X, User, FileText, DollarSign, MessageSquare, Home, Calendar, Mail, Phone, CreditCard } from 'lucide-react'
import { getMockTenants } from '../../lib/mockData'

const Tenant360View = ({ tenantId, onClose }) => {
  const [activeTab, setActiveTab] = useState('details')
  const [tenant, setTenant] = useState(null)

  useEffect(() => {
    // Load tenant data
    const tenants = getMockTenants()
    const savedTenants = JSON.parse(localStorage.getItem('tenants') || '[]')
    const allTenants = [...tenants, ...savedTenants]

    const found = allTenants.find(t => t.id === tenantId)
    setTenant(found)
  }, [tenantId])

  if (!tenant) {
    return (
      <div className="fixed inset-0 bg-brand-900/50 z-50 flex items-center justify-center">
        <div className="bg-white p-6">
          <div className="spinner w-8 h-8 mx-auto"></div>
          <p className="text-sm text-brand-600 mt-4">Loading tenant information...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'rent', label: 'Rent History', icon: DollarSign },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'lease', label: 'Lease', icon: Calendar },
    { id: 'maintenance', label: 'Maintenance', icon: Home }
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
      <div className="bg-white w-full h-full md:h-screen md:w-[clamp(500px,80vw,800px)] flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-brand-200 flex items-center justify-between bg-brand-900 text-white">
          <div>
            <h2 className="text-xl font-bold">{tenant.name}</h2>
            <p className="text-sm text-white/80">{tenant.unit} • {tenant.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-brand-200 overflow-x-auto min-w-0">
          <div className="flex min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-brand-600 hover:text-brand-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar min-w-0">
          {activeTab === 'details' && <DetailsTab tenant={tenant} />}
          {activeTab === 'documents' && <DocumentsTab tenant={tenant} />}
          {activeTab === 'rent' && <RentHistoryTab tenant={tenant} />}
          {activeTab === 'communications' && <CommunicationsTab tenant={tenant} />}
          {activeTab === 'lease' && <LeaseTab tenant={tenant} />}
          {activeTab === 'maintenance' && <MaintenanceTab tenant={tenant} />}
        </div>
      </div>
    </div>
  )
}

// Tenant Details Tab
const DetailsTab = ({ tenant }) => (
  <div className="space-y-6">
    {/* Personal Information */}
    <div>
      <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
        Personal Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Full Name" value={tenant.name} />
        <InfoItem label="Status" value={tenant.status} badge="success" />
        <InfoItem label="Email" value={tenant.email} />
        <InfoItem label="Phone" value={tenant.phone} />
      </div>
    </div>

    {/* Property Information */}
    <div>
      <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
        Property Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Property" value={tenant.propertyId} />
        <InfoItem label="Unit" value={tenant.unit} />
      </div>
    </div>

    {/* Financial Information */}
    <div>
      <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
        Financial Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="Monthly Rent" value={`£${tenant.rentAmount?.toLocaleString()}`} />
        <InfoItem label="Deposit Held" value={`£${tenant.depositAmount?.toLocaleString()}`} />
      </div>
    </div>

    {/* Lease Dates */}
    <div>
      <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
        Lease Period
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <InfoItem 
          label="Start Date" 
          value={tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString('en-GB') : 'N/A'} 
        />
        <InfoItem 
          label="End Date" 
          value={tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString('en-GB') : 'N/A'} 
        />
      </div>
    </div>

    {/* Contact Preferences */}
    <div className="p-4 bg-brand-50 border border-brand-200">
      <h3 className="text-sm font-semibold text-brand-900 mb-3">Contact Preferences</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-brand-400" />
          <span className="text-brand-700">Email notifications enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-brand-400" />
          <span className="text-brand-700">SMS reminders enabled</span>
        </div>
      </div>
    </div>
  </div>
)

// Documents Tab
const DocumentsTab = ({ tenant }) => {
  const documents = [
    { id: 1, name: 'Assured Shorthold Tenancy Agreement', type: 'AST', date: '2024-01-15', size: '245 KB' },
    { id: 2, name: 'Right to Rent Check', type: 'Compliance', date: '2024-01-10', size: '156 KB' },
    { id: 3, name: 'Inventory Report', type: 'Inventory', date: '2024-01-14', size: '892 KB' },
    { id: 4, name: 'Deposit Protection Certificate', type: 'DPS', date: '2024-01-16', size: '128 KB' }
  ]

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-brand-900 mb-2">Tenant Documents</h3>
        <p className="text-sm text-brand-600">All documents related to this tenancy</p>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4 border border-brand-200 hover:border-brand-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <FileText className="w-5 h-5 text-brand-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-900 truncate">{doc.name}</p>
                  <p className="text-xs text-brand-500">{doc.type} • {doc.size} • {new Date(doc.date).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
              <button className="ent-btn-secondary text-xs py-1 px-3">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="ent-btn-primary w-full mt-6">
        <FileText className="w-4 h-4 mr-2" />
        Upload New Document
      </button>
    </div>
  )
}

// Rent History Tab
const RentHistoryTab = ({ tenant }) => {
  const rentHistory = [
    { id: 1, month: 'December 2024', amount: tenant.rentAmount, status: 'Paid', date: '2024-12-01', method: 'Bank Transfer' },
    { id: 2, month: 'November 2024', amount: tenant.rentAmount, status: 'Paid', date: '2024-11-01', method: 'Bank Transfer' },
    { id: 3, month: 'October 2024', amount: tenant.rentAmount, status: 'Paid', date: '2024-10-01', method: 'Standing Order' },
    { id: 4, month: 'September 2024', amount: tenant.rentAmount, status: 'Paid', date: '2024-09-01', method: 'Standing Order' },
    { id: 5, month: 'August 2024', amount: tenant.rentAmount, status: 'Paid', date: '2024-08-01', method: 'Standing Order' }
  ]

  const totalPaid = rentHistory.reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-success-light border border-success/30">
          <p className="text-sm text-success-dark mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-success-dark">£20,000</p>
        </div>
        <div className="p-4 bg-brand-50 border border-brand-200">
          <p className="text-sm text-brand-600 mb-1">Monthly Rent</p>
          <p className="text-2xl font-bold text-brand-900">£{tenant.rentAmount?.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-info-light border border-info/30">
          <p className="text-sm text-info-dark mb-1">Next Due</p>
          <p className="text-lg font-bold text-info-dark">1 Jan 2025</p>
        </div>
      </div>

      {/* Payment History */}
      <h3 className="text-lg font-semibold text-brand-900 mb-4">Payment History</h3>
      <div className="space-y-3">
        {rentHistory.map((payment) => (
          <div key={payment.id} className="p-4 border border-brand-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-brand-900">{payment.month}</p>
                <p className="text-sm text-brand-600">{new Date(payment.date).toLocaleDateString('en-GB')} • {payment.method}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-success">£{payment.amount.toLocaleString()}</p>
                <span className="ent-badge-success text-xs">{payment.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="mt-6 p-4 bg-brand-50 border border-brand-200">
        <h4 className="text-sm font-semibold text-brand-900 mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payment Method
        </h4>
        <p className="text-sm text-brand-700">Standing Order • Bank Transfer</p>
        <p className="text-xs text-brand-500 mt-1">Payment processed on 1st of each month</p>
      </div>
    </div>
  )
}

// Communications Tab
const CommunicationsTab = ({ tenant }) => {
  const communications = [
    { 
      id: 1, 
      type: 'email', 
      subject: 'Boiler Service Notification', 
      date: '2024-11-28', 
      status: 'sent',
      preview: 'Annual boiler service scheduled for next week...'
    },
    { 
      id: 2, 
      type: 'sms', 
      subject: 'Rent Payment Confirmation', 
      date: '2024-11-01', 
      status: 'delivered',
      preview: 'Thank you for your rent payment of £1,500'
    },
    { 
      id: 3, 
      type: 'email', 
      subject: 'Lease Renewal Reminder', 
      date: '2024-10-15', 
      status: 'opened',
      preview: 'Your lease is due for renewal in 90 days...'
    },
    { 
      id: 4, 
      type: 'email', 
      subject: 'Maintenance Request Update', 
      date: '2024-09-22', 
      status: 'opened',
      preview: 'Your maintenance request has been completed...'
    }
  ]

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-brand-900 mb-2">Communication History</h3>
        <p className="text-sm text-brand-600">All correspondence with this tenant</p>
      </div>

      <div className="space-y-3">
        {communications.map((comm) => (
          <div key={comm.id} className="p-4 border border-brand-200 hover:border-brand-300 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                <MessageSquare className="w-5 h-5 text-brand-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-brand-900">{comm.subject}</p>
                    <span className={`text-xs px-2 py-0.5 ${
                      comm.type === 'email' ? 'bg-primary-light text-primary' : 'bg-success-light text-success'
                    }`}>
                      {comm.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-brand-600">{comm.preview}</p>
                  <p className="text-xs text-brand-500 mt-1">{new Date(comm.date).toLocaleDateString('en-GB')} • {comm.status}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="ent-btn-primary w-full mt-6">
        <MessageSquare className="w-4 h-4 mr-2" />
        Send Message
      </button>
    </div>
  )
}

// Lease Tab
const LeaseTab = ({ tenant }) => (
  <div className="space-y-6">
    {/* Lease Overview */}
    <div className="p-6 bg-gradient-to-br from-primary-light to-primary-light/50 border border-primary/30">
      <h3 className="text-lg font-semibold text-brand-900 mb-4">Current Lease</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-brand-600 mb-1">Start Date</p>
          <p className="text-base font-semibold text-brand-900">
            {tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString('en-GB') : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-brand-600 mb-1">End Date</p>
          <p className="text-base font-semibold text-brand-900">
            {tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString('en-GB') : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-brand-600 mb-1">Monthly Rent</p>
          <p className="text-base font-semibold text-brand-900">£{tenant.rentAmount?.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-brand-600 mb-1">Deposit</p>
          <p className="text-base font-semibold text-brand-900">£{tenant.depositAmount?.toLocaleString()}</p>
        </div>
      </div>
    </div>

    {/* Lease Terms */}
    <div>
      <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
        Lease Terms
      </h3>
      <div className="space-y-3">
        <div className="p-3 border border-brand-200">
          <p className="text-sm font-medium text-brand-900 mb-1">Lease Type</p>
          <p className="text-sm text-brand-700">Assured Shorthold Tenancy (AST)</p>
        </div>
        <div className="p-3 border border-brand-200">
          <p className="text-sm font-medium text-brand-900 mb-1">Notice Period</p>
          <p className="text-sm text-brand-700">2 months (Tenant) / 2 months (Landlord)</p>
        </div>
        <div className="p-3 border border-brand-200">
          <p className="text-sm font-medium text-brand-900 mb-1">Rent Payment</p>
          <p className="text-sm text-brand-700">Monthly in advance on 1st of each month</p>
        </div>
        <div className="p-3 border border-brand-200">
          <p className="text-sm font-medium text-brand-900 mb-1">Deposit Protection</p>
          <p className="text-sm text-brand-700">Protected with DPS (Deposit Protection Service)</p>
        </div>
      </div>
    </div>

    {/* Renewal Information */}
    <div className="p-4 bg-warning-light border border-warning/30">
      <h3 className="text-sm font-semibold text-warning-dark mb-2 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Lease Renewal Due
      </h3>
      <p className="text-sm text-warning-dark mb-3">
        This lease expires in 45 days. Consider initiating renewal discussions.
      </p>
      <button className="ent-btn-primary text-sm">
        Start Renewal Process
      </button>
    </div>

    {/* Lease Documents */}
    <div>
      <h3 className="text-sm font-semibold text-brand-700 uppercase tracking-wide mb-3">
        Lease Documents
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 border border-brand-200">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-brand-900">Tenancy Agreement</p>
              <p className="text-xs text-brand-500">Signed 15 Jan 2024</p>
            </div>
          </div>
          <button className="ent-btn-secondary text-xs py-1 px-3">View</button>
        </div>
        <div className="flex items-center justify-between p-3 border border-brand-200">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-brand-900">Deposit Certificate</p>
              <p className="text-xs text-brand-500">Issued 16 Jan 2024</p>
            </div>
          </div>
          <button className="ent-btn-secondary text-xs py-1 px-3">View</button>
        </div>
      </div>
    </div>
  </div>
)

// Maintenance Tab
const MaintenanceTab = ({ tenant }) => {
  const maintenanceRequests = [
    { 
      id: 1, 
      title: 'Leaking Kitchen Tap', 
      status: 'Completed', 
      priority: 'Medium',
      date: '2024-11-20',
      completedDate: '2024-11-22',
      cost: 85
    },
    { 
      id: 2, 
      title: 'Broken Door Handle', 
      status: 'In Progress', 
      priority: 'Low',
      date: '2024-11-28',
      cost: 45
    },
    { 
      id: 3, 
      title: 'Central Heating Issue', 
      status: 'Completed', 
      priority: 'High',
      date: '2024-10-15',
      completedDate: '2024-10-16',
      cost: 320
    }
  ]

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-brand-900 mb-2">Maintenance Requests</h3>
        <p className="text-sm text-brand-600">All maintenance requests from this tenant</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-brand-50 border border-brand-200">
          <p className="text-sm text-brand-600 mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-brand-900">{maintenanceRequests.length}</p>
        </div>
        <div className="p-4 bg-success-light border border-success/30">
          <p className="text-sm text-success-dark mb-1">Completed</p>
          <p className="text-2xl font-bold text-success-dark">
            {maintenanceRequests.filter(r => r.status === 'Completed').length}
          </p>
        </div>
        <div className="p-4 bg-warning-light border border-warning/30">
          <p className="text-sm text-warning-dark mb-1">In Progress</p>
          <p className="text-2xl font-bold text-warning-dark">
            {maintenanceRequests.filter(r => r.status === 'In Progress').length}
          </p>
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-3">
        {maintenanceRequests.map((request) => (
          <div key={request.id} className="p-4 border border-brand-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-brand-900">{request.title}</h4>
                  <span className={`ent-badge-${
                    request.priority === 'High' ? 'error' :
                    request.priority === 'Medium' ? 'warning' :
                    'info'
                  }`}>
                    {request.priority}
                  </span>
                </div>
                <p className="text-sm text-brand-600">
                  Reported: {new Date(request.date).toLocaleDateString('en-GB')}
                  {request.completedDate && ` • Completed: ${new Date(request.completedDate).toLocaleDateString('en-GB')}`}
                </p>
              </div>
              <div className="text-right">
                <span className={`ent-badge-${request.status === 'Completed' ? 'success' : 'warning'}`}>
                  {request.status}
                </span>
                <p className="text-sm font-medium text-brand-900 mt-1">£{request.cost}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
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

export default Tenant360View