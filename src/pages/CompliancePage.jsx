import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Clock, FileCheck, Upload } from 'lucide-react'
import { getMockProperties, complianceTypes, getComplianceStatus, getComplianceColor } from '../lib/mockData'

const CompliancePage = () => {
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    const properties = getMockProperties()
    const allCerts = []

    properties.forEach(property => {
      if (property.compliance) {
        Object.entries(property.compliance).forEach(([type, cert]) => {
          allCerts.push({
            ...cert,
            type,
            propertyAddress: property.address,
            propertyId: property.id
          })
        })
      }
    })

    // Sort by expiry date
    allCerts.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
    setCertificates(allCerts)
  }, [])

  const getStatusCounts = () => {
    let expired = 0
    let expiringSoon = 0
    let expiring60 = 0
    let valid = 0

    certificates.forEach(cert => {
      const status = getComplianceStatus(cert.expiryDate)
      if (status === 'expired') expired++
      else if (status === 'expiring-soon') expiringSoon++
      else if (status === 'expiring-60') expiring60++
      else valid++
    })

    return { expired, expiringSoon, expiring60, valid }
  }

  const stats = getStatusCounts()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Compliance</h1>
          <p className="text-brand-600">Monitor certificates and renewals</p>
        </div>
        <button className="ent-btn-primary flex items-center gap-2 justify-center">
          <Upload className="w-4 h-4" />
          Upload Certificate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-error-light border border-error/30 rounded">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            <span className="text-sm font-medium text-error-dark">Expiring Soon</span>
          </div>
          <div className="text-2xl font-bold text-error-dark">{stats.expiringSoon}</div>
        </div>

        <div className="p-4 bg-warning-light border border-warning/30 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-warning-dark">60 Days</span>
          </div>
          <div className="text-2xl font-bold text-warning-dark">{stats.expiring60}</div>
        </div>

        <div className="p-4 bg-success-light border border-success/30 rounded">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success-dark">Valid</span>
          </div>
          <div className="text-2xl font-bold text-success-dark">{stats.valid}</div>
        </div>

        <div className="p-4 bg-brand-100 border border-brand-300 rounded">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="w-5 h-5 text-brand-700" />
            <span className="text-sm font-medium text-brand-700">Total</span>
          </div>
          <div className="text-2xl font-bold text-brand-900">{certificates.length}</div>
        </div>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <div className="ent-card p-12 text-center">
          <FileCheck className="w-16 h-16 mx-auto mb-4 text-brand-400" />
          <h3 className="text-xl font-semibold text-brand-900 mb-2">No Certificates</h3>
          <p className="text-sm text-brand-600">Upload your first compliance certificate</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert, idx) => {
            const certInfo = complianceTypes[cert.type]
            const status = getComplianceStatus(cert.expiryDate)
            const color = getComplianceColor(status)
            const StatusIcon = status === 'valid' ? CheckCircle : status === 'expiring-soon' ? AlertTriangle : Clock

            return (
              <div key={idx} className="ent-card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusIcon className={`w-5 h-5 text-${color}`} />
                      <h3 className="font-semibold text-brand-900">{certInfo.name}</h3>
                    </div>

                    <p className="text-sm text-brand-600 mb-3">{cert.propertyAddress}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-brand-600">Issue Date:</span>
                        <span className="ml-2 text-brand-900">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-brand-600">Expiry Date:</span>
                        <span className="ml-2 text-brand-900">
                          {new Date(cert.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`ent-badge-${color} ml-4`}>
                    {status === 'valid' ? 'Valid' : status === 'expiring-soon' ? 'Expiring Soon' : 'Check Required'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CompliancePage
