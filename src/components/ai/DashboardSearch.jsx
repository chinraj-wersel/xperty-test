import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Search, Sparkles, X, ArrowRight, Clock, TrendingUp, FileText, Building2, Users, Wrench } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMockProperties, getMockTenants } from '../../lib/mockData'

const DashboardSearch = ({ className = '' }) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const searchInputRef = useRef(null)

  // Recommended prompts
  const recommendedPrompts = [
    {
      icon: Building2,
      text: 'Show me properties with expiring certificates',
      category: 'Compliance',
      action: '/dashboard/compliance'
    },
    {
      icon: Users,
      text: 'List all tenants with leases ending soon',
      category: 'Tenants',
      action: '/dashboard/tenants'
    },
    {
      icon: Wrench,
      text: 'Open maintenance requests this month',
      category: 'Maintenance',
      action: '/dashboard/maintenance'
    },
    {
      icon: TrendingUp,
      text: 'Generate revenue report for Q4',
      category: 'Reports',
      action: '/dashboard/reports'
    },
    {
      icon: FileText,
      text: 'Find Gas Safety certificates',
      category: 'Documents',
      action: '/dashboard/documents'
    },
    {
      icon: Building2,
      text: 'Add a new property',
      category: 'Quick Action',
      action: '/dashboard/properties/new'
    }
  ]

  const recentSearches = [
    'Properties in London',
    'Compliance status',
    'Vacant units',
    'Maintenance costs'
  ]

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearchQuery('')
        setSearchResults(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // AI-powered search simulation
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }

    setIsSearching(true)

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Get real data from localStorage
    const properties = getMockProperties()
    const tenants = getMockTenants()

    // Intelligent search matching
    const results = {
      query,
      summary: '',
      properties: [],
      tenants: [],
      actions: [],
      insights: []
    }

    const lowerQuery = query.toLowerCase()

    // Search properties
    if (lowerQuery.includes('property') || lowerQuery.includes('properties') || lowerQuery.includes('house') || lowerQuery.includes('apartment')) {
      results.properties = properties.filter(p =>
        p.address.toLowerCase().includes(lowerQuery) ||
        p.city.toLowerCase().includes(lowerQuery) ||
        p.propertyType.toLowerCase().includes(lowerQuery)
      ).slice(0, 5)

      if (lowerQuery.includes('london')) {
        results.properties = properties.filter(p => p.city.toLowerCase().includes('london'))
        results.summary = `Found ${results.properties.length} properties in London`
      } else if (lowerQuery.includes('vacant') || lowerQuery.includes('empty')) {
        results.summary = 'Checking for vacant units...'
        results.insights.push({
          type: 'info',
          text: 'You currently have 2 vacant units available for rent'
        })
        results.actions.push({
          label: 'View Vacant Units',
          path: '/dashboard/units'
        })
      } else {
        results.summary = `Found ${properties.length} properties in your portfolio`
      }
    }

    // Search tenants
    if (lowerQuery.includes('tenant') || lowerQuery.includes('lease') || lowerQuery.includes('rent')) {
      results.tenants = tenants.filter(t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.email.toLowerCase().includes(lowerQuery)
      ).slice(0, 5)

      if (lowerQuery.includes('ending') || lowerQuery.includes('expiring')) {
        results.summary = 'Checking lease expiry dates...'
        results.insights.push({
          type: 'warning',
          text: '3 leases are ending within the next 60 days'
        })
        results.actions.push({
          label: 'View Tenants',
          path: '/dashboard/tenants'
        })
      } else {
        results.summary = `Found ${tenants.length} active tenants`
      }
    }

    // Compliance queries
    if (lowerQuery.includes('compliance') || lowerQuery.includes('certificate') || lowerQuery.includes('gas') || lowerQuery.includes('eicr') || lowerQuery.includes('epc')) {
      results.summary = 'Analyzing compliance status...'
      results.insights.push({
        type: 'warning',
        text: '2 certificates are expiring within 30 days'
      })
      results.insights.push({
        type: 'success',
        text: '8 certificates are valid and up to date'
      })
      results.actions.push({
        label: 'View Compliance',
        path: '/dashboard/compliance'
      })

      if (lowerQuery.includes('expiring')) {
        results.summary = 'Checking expiring certificates...'
      }
    }

    // Maintenance queries
    if (lowerQuery.includes('maintenance') || lowerQuery.includes('repair') || lowerQuery.includes('work order')) {
      results.summary = 'Checking maintenance status...'
      results.insights.push({
        type: 'info',
        text: '3 work orders are currently open'
      })
      results.insights.push({
        type: 'success',
        text: '6 work orders completed this month'
      })
      results.actions.push({
        label: 'View Maintenance',
        path: '/dashboard/maintenance'
      })
    }

    // Financial/revenue queries
    if (lowerQuery.includes('revenue') || lowerQuery.includes('income') || lowerQuery.includes('financial') || lowerQuery.includes('report')) {
      results.summary = 'Generating financial insights...'
      results.insights.push({
        type: 'success',
        text: 'Monthly revenue: £7,500 (+12% vs last month)'
      })
      results.insights.push({
        type: 'info',
        text: 'Occupancy rate: 95% (Excellent)'
      })
      results.actions.push({
        label: 'View Reports',
        path: '/dashboard/reports'
      })
    }

    // Quick actions
    if (lowerQuery.includes('add') || lowerQuery.includes('new') || lowerQuery.includes('create')) {
      if (lowerQuery.includes('property')) {
        results.summary = 'Ready to add a new property'
        results.actions.push({
          label: 'Add Property',
          path: '/dashboard/properties/new'
        })
      }
    }

    // Default helpful response if no specific match
    if (results.summary === '' && results.insights.length === 0) {
      results.summary = `I can help you with properties, tenants, compliance, maintenance, and reports. Try asking about specific items or use one of the suggestions below.`
    }

    setSearchResults(results)
    setIsSearching(false)
  }

  const handlePromptClick = (prompt) => {
    setSearchQuery(prompt.text)
    handleSearch(prompt.text)
  }

  const handleActionClick = (path) => {
    navigate(path)
    setIsOpen(false)
    setSearchQuery('')
    setSearchResults(null)
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-3 px-4 py-2 bg-white border border-brand-200 hover:border-brand-300 transition-colors w-full max-w-md ${className}`}
      >
        <Search className="w-4 h-4 text-brand-400" />
        <span className="text-sm text-brand-500 flex-1 text-left">Search with AI...</span>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-100 text-brand-600 text-xs">
          <Sparkles className="w-3 h-3" />
          <span>AI</span>
        </div>
        <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-brand-100 text-brand-600 border border-brand-200">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal - Rendered via Portal to ensure it's above all content */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-brand-900/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <div className="bg-white w-full max-w-[min(95vw,700px)] max-h-[90vh] rounded-lg shadow-2xl animate-slide-in-up flex flex-col min-w-0 relative overflow-hidden">
            {/* Search Input */}
            <div className="p-4 border-b border-brand-200 flex-shrink-0 min-w-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -ml-2 text-brand-500 hover:text-brand-700 hover:bg-brand-50 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 text-base sm:text-lg bg-transparent border-none outline-none placeholder-brand-400 text-brand-900 min-w-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults(null)
                    }}
                    className="p-1 text-brand-400 hover:text-brand-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-w-0 overscroll-contain">
              {isSearching ? (
                <div className="p-8 sm:p-12 text-center">
                  <div className="inline-flex items-center gap-2 text-primary mb-2">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-medium">Analyzing your query...</span>
                  </div>
                </div>
              ) : searchResults ? (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* AI Summary */}
                  {searchResults.summary && (
                    <div className="p-4 bg-primary-light border border-primary/30 rounded-lg">
                      <div className="flex items-start gap-3 min-w-0">
                        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-brand-900 break-words">{searchResults.summary}</p>
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {searchResults.insights.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-brand-700 mb-3">Key Insights</h3>
                      <div className="space-y-2">
                        {searchResults.insights.map((insight, idx) => (
                          <div
                            key={idx}
                            className={`p-3 border rounded-lg ${insight.type === 'success'
                              ? 'bg-success-light border-success/30'
                              : insight.type === 'warning'
                                ? 'bg-warning-light border-warning/30'
                                : 'bg-info-light border-info/30'
                              }`}
                          >
                            <p className="text-sm text-brand-900 break-words">{insight.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  {searchResults.actions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-brand-700 mb-3">Quick Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action.path)}
                            className="ent-btn-secondary text-sm flex items-center gap-2 whitespace-nowrap"
                          >
                            {action.label}
                            <ArrowRight className="w-3 h-3 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Properties Results */}
                  {searchResults.properties.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-brand-700 mb-3">Properties</h3>
                      <div className="space-y-2">
                        {searchResults.properties.map((property) => (
                          <button
                            key={property.id}
                            onClick={() => handleActionClick('/dashboard/properties')}
                            className="w-full p-3 border border-brand-200 hover:border-primary hover:bg-primary-light text-left transition-all rounded-lg min-w-0"
                          >
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-900 truncate">{property.address}</p>
                                <p className="text-xs text-brand-600 truncate">{property.city} • {property.propertyType}</p>
                              </div>
                              <span className="ent-badge-success flex-shrink-0">{property.status}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tenants Results */}
                  {searchResults.tenants.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-brand-700 mb-3">Tenants</h3>
                      <div className="space-y-2">
                        {searchResults.tenants.map((tenant) => (
                          <button
                            key={tenant.id}
                            onClick={() => handleActionClick('/dashboard/tenants')}
                            className="w-full p-3 border border-brand-200 hover:border-primary hover:bg-primary-light text-left transition-all rounded-lg min-w-0"
                          >
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-900 truncate">{tenant.name}</p>
                                <p className="text-xs text-brand-600 truncate">{tenant.email} • £{tenant.rentAmount}/mo</p>
                              </div>
                              <span className="ent-badge-success flex-shrink-0">{tenant.status}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
                  {/* Recommended Prompts */}
                  <div>
                    <h3 className="text-sm font-semibold text-brand-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Recommended Prompts</span>
                    </h3>
                    <div className="grid gap-2.5">
                      {recommendedPrompts.map((prompt, idx) => {
                        const Icon = prompt.icon
                        return (
                          <button
                            key={idx}
                            onClick={() => handlePromptClick(prompt)}
                            className="p-3 sm:p-3.5 border border-brand-200 hover:border-primary hover:bg-primary-light rounded-lg text-left transition-all group min-w-0 w-full"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 bg-brand-100 group-hover:bg-primary-light rounded flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-brand-600 group-hover:text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-brand-900 truncate">{prompt.text}</p>
                                <p className="text-xs text-brand-500 mt-0.5">{prompt.category}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-brand-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  <div>
                    <h3 className="text-sm font-semibold text-brand-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>Recent Searches</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(search)
                            handleSearch(search)
                          }}
                          className="px-3 py-1.5 text-sm border border-brand-200 hover:border-primary hover:bg-primary-light text-brand-700 hover:text-primary transition-all rounded"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-info-light border border-info/30 rounded-lg">
                    <p className="text-sm text-info-dark">
                      <strong>💡 Pro Tip:</strong> Try asking natural questions like "Show me vacant properties"
                      or "Which certificates are expiring soon?"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-brand-200 flex items-center justify-between text-xs text-brand-500 flex-shrink-0 bg-white min-w-0">
              <div className="flex items-center gap-2 flex-shrink-0">
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Powered by AI</span>
                <span className="sm:hidden">AI</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden px-3 py-1.5 bg-brand-50 border border-brand-200 rounded text-brand-700 font-medium hover:bg-brand-100 transition-colors"
                >
                  Close
                </button>
                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                  <span>Press</span>
                  <kbd className="px-2 py-1 bg-brand-100 border border-brand-200 rounded text-xs">ESC</kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default DashboardSearch
