import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { getMockProperties, getComplianceStatus } from '../../../lib/mockData'

const ComplianceStatusWidget = () => {
  const properties = getMockProperties()
  
  let expiringSoon = 0
  let expiring60 = 0
  let upToDate = 0

  properties.forEach(property => {
    if (property.compliance) {
      Object.values(property.compliance).forEach(cert => {
        const status = getComplianceStatus(cert.expiryDate)
        if (status === 'expiring-soon') expiringSoon++
        else if (status === 'expiring-60') expiring60++
        else if (status === 'valid') upToDate++
      })
    }
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-error-light border border-error/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-error" />
          <span className="text-sm font-medium text-brand-900">Expiring in 30 days</span>
        </div>
        <span className="text-lg font-bold text-error">{expiringSoon}</span>
      </div>

      <div className="flex items-center justify-between p-3 bg-warning-light border border-warning/30">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-warning" />
          <span className="text-sm font-medium text-brand-900">Expiring in 60 days</span>
        </div>
        <span className="text-lg font-bold text-warning">{expiring60}</span>
      </div>

      <div className="flex items-center justify-between p-3 bg-success-light border border-success/30">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success" />
          <span className="text-sm font-medium text-brand-900">Up to date</span>
        </div>
        <span className="text-lg font-bold text-success">{upToDate}</span>
      </div>
    </div>
  )
}

export default ComplianceStatusWidget
