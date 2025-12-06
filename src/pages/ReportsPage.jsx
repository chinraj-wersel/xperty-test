import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, FileCheck, Download, Calendar } from 'lucide-react'
import { getMockProperties, getMockTenants } from '../lib/mockData'

const ReportsPage = () => {
  const [properties, setProperties] = useState([])
  const [tenants, setTenants] = useState([])
  const [dateRange, setDateRange] = useState('thisMonth')

  useEffect(() => {
    setProperties(getMockProperties())
    setTenants(getMockTenants())
  }, [])

  const calculateMetrics = () => {
    const totalProperties = properties.length
    const totalUnits = properties.reduce((sum, p) => sum + (p.units || 1), 0)
    const occupiedUnits = tenants.filter(t => t.status === 'Active').length
    const occupancyRate = totalUnits > 0 ? ((occupiedUnits / totalUnits) * 100).toFixed(1) : 0

    const monthlyRent = tenants.filter(t => t.status === 'Active').reduce((sum, t) => sum + t.rentAmount, 0)
    const annualRevenue = monthlyRent * 12

    const avgMaintenanceCost = properties.length > 0 ? (0 / properties.length).toFixed(0) : 0

    const totalCertificates = properties.reduce((sum, p) => {
      return sum + (p.compliance ? Object.keys(p.compliance).length : 0)
    }, 0)

    const validCertificates = properties.reduce((sum, p) => {
      if (!p.compliance) return sum
      return sum + Object.values(p.compliance).filter(cert => {
        const expiry = new Date(cert.expiryDate)
        return expiry > new Date()
      }).length
    }, 0)

    const compliancePercentage = totalCertificates > 0 ? ((validCertificates / totalCertificates) * 100).toFixed(1) : 0

    return {
      totalProperties,
      occupancyRate,
      monthlyRevenue: monthlyRent,
      annualRevenue,
      avgMaintenanceCost,
      compliancePercentage,
      totalCertificates
    }
  }

  const metrics = calculateMetrics()

  const exportReport = () => {
    alert('Export functionality would generate a PDF/CSV report here')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 mb-2">Reports & Analytics</h1>
          <p className="text-brand-600">Portfolio performance insights</p>
        </div>
        <div className="flex gap-2">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="ent-select">
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
          <button onClick={exportReport} className="ent-btn-primary flex items-center gap-2 justify-center">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="ent-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-primary-light text-primary flex items-center justify-center rounded">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs ent-badge-neutral">0%</span>
          </div>
          <div className="text-2xl font-bold text-brand-900 mb-1">£{metrics.monthlyRevenue.toLocaleString()}</div>
          <div className="text-sm text-brand-600">Monthly Revenue</div>
          <div className="mt-2 text-xs text-brand-500">Annual: £{metrics.annualRevenue.toLocaleString()}</div>
        </div>

        <div className="ent-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-success-light text-success flex items-center justify-center rounded">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs ent-badge-neutral">Target: 95%</span>
          </div>
          <div className="text-2xl font-bold text-brand-900 mb-1">{metrics.occupancyRate}%</div>
          <div className="text-sm text-brand-600">Occupancy Rate</div>
          <div className="mt-2 text-xs text-brand-500">Based on active leases</div>
        </div>

        <div className="ent-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-warning-light text-warning flex items-center justify-center rounded">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs ent-badge-neutral">Avg</span>
          </div>
          <div className="text-2xl font-bold text-brand-900 mb-1">£{metrics.avgMaintenanceCost}</div>
          <div className="text-sm text-brand-600">Avg Maintenance/Property</div>
          <div className="mt-2 text-xs text-brand-500">Per month</div>
        </div>

        <div className="ent-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-info-light text-info flex items-center justify-center rounded">
              <FileCheck className="w-6 h-6" />
            </div>
            {metrics.totalCertificates === 0 ? (
              <span className="text-xs ent-badge-neutral">No Data</span>
            ) : metrics.compliancePercentage >= 90 ? (
              <span className="text-xs ent-badge-success">Good</span>
            ) : metrics.compliancePercentage >= 70 ? (
              <span className="text-xs ent-badge-warning">Check</span>
            ) : (
              <span className="text-xs ent-badge-error">Action</span>
            )}
          </div>
          <div className="text-2xl font-bold text-brand-900 mb-1">
            {metrics.totalCertificates === 0 ? '-' : `${metrics.compliancePercentage}%`}
          </div>
          <div className="text-sm text-brand-600">Compliance Status</div>
          <div className="mt-2 text-xs text-brand-500">
            {metrics.totalCertificates === 0 ? 'No certificates found' : 'Valid certificates'}
          </div>
        </div>

        <div className="ent-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-brand-100 text-brand-700 flex items-center justify-center rounded">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-xs ent-badge-neutral">Total</span>
          </div>
          <div className="text-2xl font-bold text-brand-900 mb-1">{metrics.totalProperties}</div>
          <div className="text-sm text-brand-600">Total Properties</div>
          <div className="mt-2 text-xs text-brand-500">Active portfolio</div>
        </div>

        <div className="ent-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-success-light text-success flex items-center justify-center rounded">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs ent-badge-neutral">0%</span>
          </div>
          <div className="text-2xl font-bold text-brand-900 mb-1">0%</div>
          <div className="text-sm text-brand-600">Portfolio Yield</div>
          <div className="mt-2 text-xs text-brand-500">Annual return</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="ent-card p-6">
          <h3 className="font-semibold text-brand-900 mb-4">Revenue vs Expenses</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-brand-600">Rental Income</span>
                <span className="text-sm font-medium text-brand-900">£{metrics.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-brand-100 rounded-full">
                <div className="h-full bg-success rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-brand-600">Maintenance Costs</span>
                <span className="text-sm font-medium text-brand-900">£0</span>
              </div>
              <div className="h-2 bg-brand-100 rounded-full">
                <div className="h-full bg-warning rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-brand-600">Management Fees</span>
                <span className="text-sm font-medium text-brand-900">£0</span>
              </div>
              <div className="h-2 bg-brand-100 rounded-full">
                <div className="h-full bg-info rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-brand-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-brand-900">Net Profit</span>
                <span className="font-semibold text-success">£{metrics.monthlyRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ent-card p-6">
          <h3 className="font-semibold text-brand-900 mb-4">Maintenance by Category</h3>
          <div className="flex items-center justify-center h-48 text-brand-500 text-sm">
            No maintenance data available
          </div>
        </div>
      </div>

      <div className="ent-card p-6">
        <h3 className="font-semibold text-brand-900 mb-4">Top Performing Properties</h3>
        <div className="overflow-x-auto">
          <table className="ent-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Monthly Rent</th>
                <th>Occupancy</th>
                <th>Maintenance</th>
                <th>Yield</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-brand-500">
                    No properties found. Add properties to see performance data.
                  </td>
                </tr>
              ) : (
                properties.slice(0, 5).map(property => (
                  <tr key={property.id}>
                    <td>{property.address}</td>
                    <td>£0</td>
                    <td><span className="ent-badge-neutral">0%</span></td>
                    <td>£0</td>
                    <td className="font-medium text-brand-600">0%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage