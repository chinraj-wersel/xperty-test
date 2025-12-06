import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../shared/Toast'
import {
  Building2, CheckCircle, ArrowRight, ArrowLeft, Home, FileCheck,
  Users, DollarSign, Loader2, X, Search, ChevronDown, Upload, File,
  AlertCircle, Package, Grid3x3, Plus
} from 'lucide-react'
import { assetLibrary, lookupPostcode } from '../../lib/mockData'

const PropertyOnboarding = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addressResults, setAddressResults] = useState([])
  const [searchingPostcode, setSearchingPostcode] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [uploadedCompliance, setUploadedCompliance] = useState([])

  const editProperty = location.state?.property
  const isEditMode = !!editProperty

  const [formData, setFormData] = useState(editProperty || {
    // Step 0: Options Selection
    selectedOptions: {
      addAssets: false,
      uploadDocuments: false,
      addCompliance: false,
      verifyOwnership: false
    },
    // Step 1: Address (Combined)
    postcode: '',
    address: '',
    city: '',
    // Step 2: Ownership Verification (Optional)
    ownershipVerified: false,
    titleDeedNumber: '',
    landRegistryConfirmed: false,
    // Step 3: Core Details
    propertyType: 'Residential Apartment',
    ownership: 'Freehold',
    bedrooms: 1,
    bathrooms: 1,
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    // Step 4: Building Structure
    isSingleUnit: true,
    units: 1,
    // Step 5: Assets
    selectedAssets: [],
    customAssets: [], // New: Support for inline custom assets
    // Step 6: Documents
    documents: [],
    // Step 7: Compliance
    complianceDocuments: [],
    // Step 8: Tenants (New)
    onboardTenant: 'none', // none, create, select
    tenantDetails: null,
    // Summary
    status: 'Draft',
    assignee: null // New: Delegation support
  })

  // Autosave Effect
  useEffect(() => {
    if (!isEditMode && formData) {
      localStorage.setItem('draft_property', JSON.stringify(formData))
    }
  }, [formData, isEditMode])

  // Load Draft Effect
  useEffect(() => {
    if (!isEditMode) {
      const savedDraft = localStorage.getItem('draft_property')
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft)
          // Ask user if they want to resume? For now, just load it if it exists and is not empty
          if (parsed.postcode || parsed.address) {
            setFormData(prev => ({ ...prev, ...parsed }))
            toast.success('Resumed from draft')
          }
        } catch (e) {
          console.error('Failed to load draft', e)
        }
      }
    }
  }, [isEditMode])

  // Calculate total steps dynamically based on Step 0 selections
  const getTotalSteps = () => {
    let steps = 6 // Step 0 (options) + Postcode + Address + Core + Building Structure + Summary

    if (formData.selectedOptions.verifyOwnership) steps += 1
    if (formData.selectedOptions.addAssets) steps += 1
    if (formData.selectedOptions.uploadDocuments) steps += 1
    if (formData.selectedOptions.addCompliance) steps += 1

    return steps
  }

  const getStepInfo = () => {
    const steps = []
    let stepNum = 0

    // Step 0: Options Selection
    steps.push({ num: stepNum++, id: 'options', title: 'Select Options' })

    // Step 1: Address (Combined)
    steps.push({ num: stepNum++, id: 'address-selection', title: 'Property Address' })

    // Step 2: Ownership (Optional)
    if (formData.selectedOptions.verifyOwnership) {
      steps.push({ num: stepNum++, id: 'ownership', title: 'Ownership Verification' })
    }

    // Step 3: Core Details
    steps.push({ num: stepNum++, id: 'core', title: 'Property Details' })

    // Step 4: Building Structure
    steps.push({ num: stepNum++, id: 'structure', title: 'Building Structure' })

    // Step 5: Assets (Optional)
    if (formData.selectedOptions.addAssets) {
      steps.push({ num: stepNum++, id: 'assets', title: 'Add Assets' })
    }

    // Step 6: Documents (Optional)
    if (formData.selectedOptions.uploadDocuments) {
      steps.push({ num: stepNum++, id: 'documents', title: 'Upload Documents' })
    }

    // Step 7: Compliance (Optional)
    if (formData.selectedOptions.addCompliance) {
      steps.push({ num: stepNum++, id: 'compliance', title: 'Compliance Documents' })
    }

    // Step 8: Tenant Onboarding (New)
    steps.push({ num: stepNum++, id: 'tenant', title: 'Tenant Onboarding' })

    // Step 9: Summary
    steps.push({ num: stepNum++, id: 'summary', title: 'Summary & Activation' })

    return steps
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOptionToggle = (option) => {
    setFormData(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [option]: !prev.selectedOptions[option]
      }
    }))
  }

  const handleAssetToggle = (assetId) => {
    setFormData(prev => ({
      ...prev,
      selectedAssets: prev.selectedAssets.includes(assetId)
        ? prev.selectedAssets.filter(id => id !== assetId)
        : [...prev.selectedAssets, assetId]
    }))
  }

  const handlePostcodeLookup = () => {
    if (!formData.postcode) {
      toast.error('Please enter a postcode')
      return
    }

    setSearchingPostcode(true)

    setTimeout(() => {
      const results = lookupPostcode(formData.postcode)
      setAddressResults(results)
      setSearchingPostcode(false)

      if (results.length === 0) {
        toast.warning('No properties found for this postcode. You can enter the address manually.')
      }
    }, 800)
  }

  const handleAddressSelect = (selectedAddress) => {
    setFormData(prev => ({
      ...prev,
      address: selectedAddress.address,
      city: selectedAddress.city,
      propertyType: selectedAddress.propertyType,
      bedrooms: selectedAddress.bedrooms,
      bathrooms: selectedAddress.bathrooms
    }))
    setAddressResults([])
    toast.success('Address populated successfully')
  }

  const handleFileUpload = (files, type) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 2 * 1024 * 1024 // 2MB

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Please upload PDF, JPG, PNG, or DOC files.`)
        return false
      }

      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large. Maximum size is 2MB.`)
        return false
      }

      return true
    })

    if (validFiles.length > 0) {
      const fileObjects = validFiles.map(file => ({
        id: `${type}-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type,
        uploadedAt: new Date().toISOString()
      }))

      if (type === 'document') {
        setUploadedDocuments(prev => [...prev, ...fileObjects])
        setFormData(prev => ({ ...prev, documents: [...prev.documents, ...fileObjects] }))
      } else if (type === 'compliance') {
        setUploadedCompliance(prev => [...prev, ...fileObjects])
        setFormData(prev => ({ ...prev, complianceDocuments: [...prev.complianceDocuments, ...fileObjects] }))
      }

      toast.success(`${validFiles.length} file(s) uploaded successfully`)
    }
  }

  const removeFile = (fileId, type) => {
    if (type === 'document') {
      setUploadedDocuments(prev => prev.filter(f => f.id !== fileId))
      setFormData(prev => ({ ...prev, documents: prev.documents.filter(f => f.id !== fileId) }))
    } else if (type === 'compliance') {
      setUploadedCompliance(prev => prev.filter(f => f.id !== fileId))
      setFormData(prev => ({ ...prev, complianceDocuments: prev.complianceDocuments.filter(f => f.id !== fileId) }))
    }
    toast.success('File removed')
  }

  const validateStep = () => {
    const steps = getStepInfo()
    const currentStepInfo = steps[currentStep]

    switch (currentStepInfo?.id) {
      case 'address-selection':
        if (!formData.postcode) {
          toast.error('Please enter a postcode')
          return false
        }
        if (!formData.address || !formData.city) {
          toast.error('Please select or enter an address')
          return false
        }
        break
      case 'ownership':
        if (formData.selectedOptions.verifyOwnership && !formData.titleDeedNumber) {
          toast.error('Please enter your Title Deed Number')
          return false
        }
        break
      case 'core':
        if (!formData.bedrooms || formData.bedrooms < 0) {
          toast.error('Please enter a valid number of bedrooms')
          return false
        }
        break
    }

    return true
  }

  const handleNext = () => {
    if (!validateStep()) return

    const totalSteps = getTotalSteps()
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
      // Scroll to top on step change
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      // Scroll to top on step change
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const properties = JSON.parse(localStorage.getItem('properties') || '[]')

    // Determine property status
    const status = formData.selectedOptions.verifyOwnership && !formData.landRegistryConfirmed
      ? 'Draft'
      : 'Active'

    if (isEditMode) {
      const index = properties.findIndex(p => p.id === editProperty.id)
      if (index !== -1) {
        properties[index] = { ...formData, id: editProperty.id, status }
      }
      toast.success('Property updated successfully!')
    } else {
      const newProperty = {
        id: `prop-${Date.now()}`,
        ...formData,
        status,
        createdAt: new Date().toISOString()
      }
      properties.push(newProperty)
      toast.success(`Property ${status === 'Draft' ? 'saved as draft' : 'activated'} successfully!`)
    }

    localStorage.setItem('properties', JSON.stringify(properties))
    // Clear draft
    localStorage.removeItem('draft_property')
    navigate('/dashboard/properties')
  }

  const renderStep = () => {
    const steps = getStepInfo()
    const currentStepInfo = steps[currentStep]

    switch (currentStepInfo?.id) {
      case 'options':
        return <OptionsStep formData={formData} onToggle={handleOptionToggle} getStepInfo={getStepInfo} />
      case 'address-selection':
        return <AddressStep
          formData={formData}
          onChange={handleChange}
          onLookup={handlePostcodeLookup}
          searching={searchingPostcode}
          results={addressResults}
          onSelect={handleAddressSelect}
        />
      case 'ownership':
        return <OwnershipVerificationStep formData={formData} onChange={handleChange} />
      case 'core':
        return <CoreDetailsStep formData={formData} onChange={handleChange} />
      case 'structure':
        return <BuildingStructureStep formData={formData} onChange={handleChange} />
      case 'assets':
        return <AssetSelectionStep formData={formData} onToggle={handleAssetToggle} onChange={handleChange} />
      case 'documents':
        return <DocumentUploadStep documents={uploadedDocuments} onUpload={(files) => handleFileUpload(files, 'document')} onRemove={(id) => removeFile(id, 'document')} />
      case 'compliance':
        return <ComplianceUploadStep documents={uploadedCompliance} onUpload={(files) => handleFileUpload(files, 'compliance')} onRemove={(id) => removeFile(id, 'compliance')} />
      case 'tenant':
        return <TenantOnboardingStep formData={formData} onChange={handleChange} />
      case 'summary':
        return <SummaryStep formData={formData} uploadedDocuments={uploadedDocuments} uploadedCompliance={uploadedCompliance} />
      default:
        return <OptionsStep formData={formData} onToggle={handleOptionToggle} />
    }
  }

  const totalSteps = getTotalSteps()
  const steps = getStepInfo()
  const currentStepInfo = steps[currentStep]

  return (
    <div className="min-h-screen bg-brand-50 p-4 pb-40 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">
              {isEditMode ? 'Edit Property' : 'Add Property'}
            </h1>
            <p className="text-sm text-brand-600">
              Step {currentStep + 1} of {totalSteps}: {currentStepInfo?.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Mock delegation
                const newAssignee = prompt('Enter email to assign this workflow to:')
                if (newAssignee) {
                  handleChange('assignee', newAssignee)
                  toast.success(`Workflow assigned to ${newAssignee}`)
                }
              }}
              className="p-2 text-brand-600 hover:text-primary"
              title="Assign to another user"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/dashboard/properties')}
              className="p-2 text-brand-600 hover:text-brand-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-2 bg-brand-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="ent-card p-8 mb-6">
              {renderStep()}
            </div>

            {/* Navigation - Fixed at bottom on mobile, above mobile bottom nav */}
            <div className="fixed md:static bottom-0 left-0 right-0 bg-white md:bg-transparent border-t md:border-0 border-brand-200 p-4 md:p-0 safe-bottom z-50 shadow-lg md:shadow-none">
              <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="ent-btn-secondary flex items-center gap-2 disabled:opacity-50 flex-1 md:flex-initial justify-center py-3 md:py-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStep === totalSteps - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="ent-btn-primary flex items-center gap-2 flex-1 md:flex-initial justify-center py-3 md:py-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span className="hidden sm:inline">
                          {isEditMode ? 'Update Property' : formData.selectedOptions.verifyOwnership && !formData.ownershipVerified ? 'Save as Draft' : 'Activate Property'}
                        </span>
                        <span className="sm:hidden">
                          {isEditMode ? 'Update' : 'Activate'}
                        </span>
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="ent-btn-primary flex items-center gap-2 flex-1 md:flex-initial justify-center py-3 md:py-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block w-80 sticky top-4">
            <WorkflowSidebar steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Extra spacer for mobile to prevent content overlap with fixed navigation */}
        <div className="md:hidden h-24" />
      </div>
    </div>
  )
}

// Step 0: Options Selection (Enhanced)
const OptionsStep = ({ formData, onToggle }) => {
  const options = [
    {
      key: 'addAssets',
      icon: Package,
      title: 'Assets & Inventory',
      description: 'Track boilers, appliances, and furniture',
      recommended: true
    },
    {
      key: 'uploadDocuments',
      icon: File,
      title: 'Documents',
      description: 'Store leases, floor plans, and photos',
      recommended: true
    },
    {
      key: 'addCompliance',
      icon: FileCheck,
      title: 'Compliance',
      description: 'Manage safety certificates (Gas, EICR)',
      recommended: true
    },
    {
      key: 'verifyOwnership',
      icon: Building2,
      title: 'Ownership',
      description: 'Verify title deeds with Land Registry',
      recommended: false
    }
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-900 mb-2">What would you like to set up?</h2>
      <p className="text-sm text-brand-600 mb-6">
        Customize your onboarding flow. Selected options will add steps to your workflow.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = formData.selectedOptions[option.key]

          return (
            <button
              key={option.key}
              onClick={() => onToggle(option.key)}
              className={`p-4 border-2 rounded-xl text-left transition-all relative overflow-hidden group ${isSelected
                ? 'border-primary bg-primary-light/30'
                : 'border-brand-200 hover:border-brand-300 hover:bg-brand-50'
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-brand-100 text-brand-600 group-hover:bg-brand-200'
                  }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center animate-in zoom-in">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-brand-900 mb-1">{option.title}</h3>
              <p className="text-xs text-brand-600 leading-relaxed">{option.description}</p>
            </button>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-info-light border border-info/30 rounded-lg">
        <p className="text-sm text-info-dark flex gap-2">
          <span className="text-lg">💡</span>
          <span>
            <strong>Tip:</strong> You can skip optional steps now and add this information later from the property dashboard.
          </span>
        </p>
      </div>
    </div>
  )
}

// Persistent Workflow Sidebar
const WorkflowSidebar = ({ steps, currentStep }) => (
  <div className="bg-white rounded-xl p-6 border border-brand-200 shadow-sm">
    <h3 className="font-semibold text-brand-900 mb-4 flex items-center gap-2">
      <Grid3x3 className="w-4 h-4 text-brand-500" />
      Your Workflow
    </h3>

    <div className="space-y-0 relative">
      {/* Connecting Line */}
      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-brand-100" />

      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep
        const isCurrent = idx === currentStep
        const isPending = idx > currentStep

        return (
          <div key={step.id} className="relative flex items-center gap-3 py-2">
            <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all duration-300 ${isCompleted
                ? 'bg-success border-success text-white'
                : isCurrent
                  ? 'bg-primary border-primary text-white scale-110 shadow-md'
                  : 'bg-white border-brand-200 text-brand-400'
              }`}>
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`text-sm font-medium transition-colors duration-300 ${isCompleted
                ? 'text-brand-500 line-through decoration-brand-300'
                : isCurrent
                  ? 'text-primary'
                  : 'text-brand-400'
              }`}>
              {step.title}
            </span>
          </div>
        )
      })}
    </div>

    <div className="mt-6 pt-4 border-t border-brand-100 flex justify-between items-center">
      <span className="text-xs font-medium text-brand-500 uppercase">Progress</span>
      <span className="text-sm font-bold text-brand-900">{Math.round(((currentStep) / steps.length) * 100)}%</span>
    </div>
  </div>
)

// Combined Address Step (Context Aware)
const AddressStep = ({ formData, onChange, onLookup, searching, results, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [manualEntry, setManualEntry] = useState(false)

  const filteredResults = results.filter(result =>
    result.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    if (results.length > 0) {
      setIsOpen(true)
    }
  }, [results])

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-900 mb-2">Property Location</h2>
      <p className="text-sm text-brand-600 mb-6">Search by postcode or enter address manually</p>

      <div className="max-w-2xl space-y-6">
        {/* Postcode Search Section */}
        <div className="p-6 bg-white border border-brand-200 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-brand-700 mb-2">Postcode Search</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => onChange('postcode', e.target.value.toUpperCase())}
              className="ent-input text-lg flex-1"
              placeholder="SW1A 1AA"
              onKeyPress={(e) => e.key === 'Enter' && onLookup()}
            />
            <button
              onClick={onLookup}
              disabled={searching || !formData.postcode}
              className="ent-btn-primary flex items-center gap-2 px-6"
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Lookup
            </button>
          </div>

          {/* Results Dropdown */}
          {results.length > 0 && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-medium text-brand-700 mb-2">Select Address</label>
              <div className="border border-brand-200 rounded-md overflow-hidden">
                {results.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelect(result)
                      setIsOpen(false)
                    }}
                    className="w-full p-3 text-left hover:bg-brand-50 transition-colors border-b border-brand-100 last:border-0 flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-medium text-brand-900 text-sm">{result.address}</div>
                      <div className="text-xs text-brand-500">{result.city}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-300 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-brand-100">
            <button
              onClick={() => setManualEntry(!manualEntry)}
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              {manualEntry ? 'Hide manual entry' : 'Can\'t find your address? Enter manually'}
            </button>
          </div>
        </div>

        {/* Manual Entry Section - Context Aware (Shows if selected or requested) */}
        {(manualEntry || formData.address) && (
          <div className="p-6 bg-brand-50 border border-brand-200 rounded-lg animate-in fade-in slide-in-from-top-4">
            <h3 className="font-medium text-brand-900 mb-4 flex items-center gap-2">
              <Home className="w-4 h-4 text-brand-500" />
              Property Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  className="ent-input"
                  placeholder="45 Oxford Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => onChange('city', e.target.value)}
                  className="ent-input"
                  placeholder="London"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => onChange('propertyType', e.target.value)}
                    className="ent-select"
                  >
                    <option>Residential Apartment</option>
                    <option>Residential House</option>
                    <option>HMO</option>
                    <option>Commercial Office</option>
                    <option>Commercial Retail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Ownership</label>
                  <select
                    value={formData.ownership}
                    onChange={(e) => onChange('ownership', e.target.value)}
                    className="ent-select"
                  >
                    <option>Freehold</option>
                    <option>Leasehold</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Step 2: Ownership Verification (Optional)
const OwnershipVerificationStep = ({ formData, onChange }) => {
  const [additionalUsers, setAdditionalUsers] = useState(formData.additionalUsers || [])
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')

  const handleAddUser = () => {
    if (!newUserEmail) return
    const newUsers = [...additionalUsers, { email: newUserEmail, role: 'Manager' }]
    setAdditionalUsers(newUsers)
    onChange('additionalUsers', newUsers)
    setNewUserEmail('')
    setIsAddingUser(false)
    toast.success('User added')
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-900 mb-2">Ownership Verification</h2>
      <p className="text-sm text-brand-600 mb-6">
        Verify your ownership with Land Registry details (Optional but recommended)
      </p>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">
            Title Deed Number
          </label>
          <input
            type="text"
            value={formData.titleDeedNumber}
            onChange={(e) => onChange('titleDeedNumber', e.target.value)}
            className="ent-input"
            placeholder="e.g., DN123456"
          />
          <p className="text-xs text-brand-500 mt-1">
            Found on your title deeds or Land Registry documents
          </p>
        </div>

        <div className="flex items-start gap-3 p-4 border border-brand-200">
          <input
            type="checkbox"
            checked={formData.landRegistryConfirmed}
            onChange={(e) => onChange('landRegistryConfirmed', e.target.checked)}
            className="w-4 h-4 border-brand-300 text-primary focus:ring-primary mt-0.5"
          />
          <div>
            <label className="text-sm font-medium text-brand-900 cursor-pointer">
              I confirm this property is registered with Land Registry
            </label>
            <p className="text-xs text-brand-600 mt-1">
              We'll verify this information with Land Registry to confirm ownership
            </p>
          </div>
        </div>

        {/* Additional Owners / Managers */}
        <div>
          <h3 className="text-sm font-medium text-brand-900 mb-3">Additional Owners / Managers</h3>
          <div className="space-y-3">
            {additionalUsers.map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white border border-brand-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-900">{user.email}</p>
                    <p className="text-xs text-brand-500">{user.role}</p>
                  </div>
                </div>
              </div>
            ))}

            {isAddingUser ? (
              <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="ent-input flex-1"
                  placeholder="Enter email address"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                />
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsAddingUser(false)}
                  className="px-4 py-2 bg-brand-100 text-brand-700 rounded hover:bg-brand-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingUser(true)}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add another owner or manager
              </button>
            )}
          </div>
        </div>

        <div className="p-4 bg-warning-light border border-warning/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-warning-dark mb-2">
                <strong>Why verify ownership?</strong>
              </p>
              <ul className="text-xs text-warning-dark space-y-1">
                <li>• Enables full compliance tracking and legal requirements</li>
                <li>• Required for automated certificate renewals</li>
                <li>• Provides additional security for your property records</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 4: Core Details (enhanced from existing)
const CoreDetailsStep = ({ formData, onChange }) => (
  <div>
    <h2 className="text-xl font-semibold text-brand-900 mb-2">Property Core Details</h2>
    <p className="text-sm text-brand-600 mb-6">Add essential property information</p>

    <div className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Bedrooms *</label>
          <input
            type="number"
            min="0"
            value={formData.bedrooms}
            onChange={(e) => onChange('bedrooms', parseInt(e.target.value) || 0)}
            className="ent-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Bathrooms *</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={formData.bathrooms}
            onChange={(e) => onChange('bathrooms', parseFloat(e.target.value) || 0)}
            className="ent-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Property Type *</label>
          <select
            value={formData.propertyType}
            onChange={(e) => onChange('propertyType', e.target.value)}
            className="ent-select"
            required
          >
            <option>Residential Apartment</option>
            <option>Residential House</option>
            <option>HMO</option>
            <option>Commercial Office</option>
            <option>Commercial Retail</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-700 mb-1">Purchase Date (Optional)</label>
        <input
          type="date"
          value={formData.purchaseDate}
          onChange={(e) => onChange('purchaseDate', e.target.value)}
          className="ent-input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Purchase Price (Â£)</label>
          <input
            type="number"
            min="0"
            value={formData.purchasePrice}
            onChange={(e) => onChange('purchasePrice', e.target.value)}
            className="ent-input"
            placeholder="450000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Current Value (Â£)</label>
          <input
            type="number"
            min="0"
            value={formData.currentValue}
            onChange={(e) => onChange('currentValue', e.target.value)}
            className="ent-input"
            placeholder="495000"
          />
        </div>
      </div>
    </div>
  </div>
)

// Step 5: Building Structure (NEW)
const BuildingStructureStep = ({ formData, onChange }) => (
  <div>
    <h2 className="text-xl font-semibold text-brand-900 mb-2">Building Structure</h2>
    <p className="text-sm text-brand-600 mb-6">Define the unit configuration for this property</p>

    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-brand-700 mb-3">
          Is this a single-unit property?
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              onChange('isSingleUnit', true)
              onChange('units', 1)
            }}
            className={`p-6 border-2 text-left transition-all ${formData.isSingleUnit
              ? 'border-primary bg-primary-light'
              : 'border-brand-200 hover:border-brand-300'
              }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-brand-900">Single Unit</h3>
            </div>
            <p className="text-sm text-brand-600">
              Entire property rented as one unit
            </p>
          </button>

          <button
            onClick={() => {
              onChange('isSingleUnit', false)
              if (formData.units === 1) onChange('units', 2)
            }}
            className={`p-6 border-2 text-left transition-all ${!formData.isSingleUnit
              ? 'border-primary bg-primary-light'
              : 'border-brand-200 hover:border-brand-300'
              }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Grid3x3 className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-brand-900">Multiple Units</h3>
            </div>
            <p className="text-sm text-brand-600">
              Property divided into separate units (HMO, apartments, etc.)
            </p>
          </button>
        </div>
      </div>

      {!formData.isSingleUnit && (
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">
            Number of Units *
          </label>
          <input
            type="number"
            min="2"
            value={formData.units}
            onChange={(e) => onChange('units', parseInt(e.target.value) || 2)}
            className="ent-input"
            required
          />
          <p className="text-xs text-brand-500 mt-1">
            You can configure individual units later from the Units page
          </p>
        </div>
      )}

      <div className="p-4 bg-info-light border border-info/30">
        <p className="text-sm text-info-dark">
          {formData.isSingleUnit ? (
            <>
              <strong>Single Unit Property:</strong> The entire property will be treated as one rentable unit.
            </>
          ) : (
            <>
              <strong>Multiple Units:</strong> You can add detailed unit information (unit numbers, types, sizes)
              after completing this setup from the Units management page.
            </>
          )}
        </p>
      </div>
    </div>
  </div>
)

// Step 6: Asset Selection (Enhanced with Inline Creation)
const AssetSelectionStep = ({ formData, onToggle, onChange }) => {
  const [activeCategory, setActiveCategory] = useState('heating-cooling')
  const [customAssetName, setCustomAssetName] = useState('')
  const [isAddingCustom, setIsAddingCustom] = useState(false)

  const categories = Object.entries(assetLibrary).map(([key, value]) => ({
    key,
    ...value
  }))

  const handleAddCustomAsset = () => {
    if (!customAssetName.trim()) {
      toast.error('Custom asset name cannot be empty.')
      return
    }

    const newAsset = {
      id: `custom-${Date.now()}`,
      name: customAssetName,
      icon: '📦', // Default icon for custom assets
      compliance: [],
      isCustom: true
    }

    // Update customAssets in formData
    onChange('customAssets', [...(formData.customAssets || []), newAsset])

    // Select the newly added custom asset
    // Use a timeout to ensure customAssets state is updated before toggling selection
    setTimeout(() => {
      onToggle(newAsset.id)
      setCustomAssetName('')
      setIsAddingCustom(false)
      toast.success(`Custom asset "${newAsset.name}" added and selected.`)
    }, 0);
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[600px]">
      {/* Categories Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-1 overflow-y-auto pr-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeCategory === category.key
              ? 'bg-primary text-white shadow-md'
              : 'hover:bg-brand-100 text-brand-600'
              }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}

        {/* Custom Assets Category */}
        <button
          onClick={() => setActiveCategory('custom')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeCategory === 'custom'
            ? 'bg-primary text-white shadow-md'
            : 'hover:bg-brand-100 text-brand-600'
            }`}
        >
          <span className="text-xl">✨</span>
          <span className="font-medium">Custom Assets</span>
        </button>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto p-1">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {activeCategory === 'custom' ? (
            <>
              {formData.customAssets?.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  selected={formData.selectedAssets.includes(asset.id)}
                  onToggle={() => onToggle(asset.id)}
                />
              ))}

              {/* Add Custom Asset Card */}
              <div className="border-2 border-dashed border-brand-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-brand-50/50"
                onClick={() => setIsAddingCustom(true)}
              >
                {!isAddingCustom ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white border border-brand-200 flex items-center justify-center mb-3 text-brand-400">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-brand-600">Add Custom Asset</span>
                  </>
                ) : (
                  <div className="w-full" onClick={(e) => e.stopPropagation()}>
                    <input
                      autoFocus
                      type="text"
                      className="w-full text-sm border-brand-300 rounded mb-2"
                      placeholder="Asset Name"
                      value={customAssetName}
                      onChange={(e) => setCustomAssetName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustomAsset()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddCustomAsset}
                        className="flex-1 bg-primary text-white text-xs py-1 rounded hover:bg-primary-dark"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setIsAddingCustom(false)}
                        className="flex-1 bg-brand-200 text-brand-700 text-xs py-1 rounded hover:bg-brand-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            assetLibrary[activeCategory]?.assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                selected={formData.selectedAssets.includes(asset.id)}
                onToggle={() => onToggle(asset.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const AssetCard = ({ asset, selected, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative p-4 rounded-xl border-2 text-left transition-all group ${selected
      ? 'border-primary bg-primary-light'
      : 'border-brand-200 hover:border-brand-300 bg-white'
      }`}
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-2xl">{asset.icon}</span>
      {selected && (
        <div className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
          <CheckCircle className="w-3 h-3" />
        </div>
      )}
    </div>
    <h3 className={`font-medium text-sm ${selected ? 'text-brand-900' : 'text-brand-700'}`}>
      {asset.name}
    </h3>
    {asset.compliance && asset.compliance.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-1">
        {asset.compliance.map(c => (
          <span key={c} className="text-[10px] px-1.5 py-0.5 bg-white/50 border border-brand-200 rounded text-brand-500">
            {c}
          </span>
        ))}
      </div>
    )}
  </button>
)

// Step 7: Document Upload (NEW)
const DocumentUploadStep = ({ documents, onUpload, onRemove }) => {
  const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onUpload(files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-900 mb-2">Upload Documents</h2>
      <p className="text-sm text-brand-600 mb-6">
        Upload property documents, floor plans, photos, and other files
      </p>

      <div className="space-y-6">
        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-brand-300 p-8 text-center hover:border-brand-400 transition-colors bg-brand-50"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-brand-400" />
          <p className="text-sm text-brand-700 mb-2">
            <strong>Drag and drop files here</strong>
          </p>
          <p className="text-xs text-brand-500 mb-4">
            or click to browse
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => onUpload(e.target.files)}
            className="hidden"
            id="document-upload"
          />
          <label htmlFor="document-upload" className="ent-btn-secondary text-sm cursor-pointer inline-block">
            Choose Files
          </label>
          <p className="text-xs text-brand-500 mt-3">
            Accepted: PDF, JPG, PNG, DOC â€¢ Max size: 2MB per file
          </p>
        </div>

        {/* Uploaded Documents List */}
        {documents.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-brand-700 mb-3">
              Uploaded Documents ({documents.length})
            </h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-brand-200 hover:border-brand-300">
                  <div className="flex items-center gap-3 flex-1">
                    <File className="w-5 h-5 text-brand-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-900 truncate">{doc.name}</p>
                      <p className="text-xs text-brand-500">{doc.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(doc.id)}
                    className="p-1 text-error hover:bg-error-light transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-info-light border border-info/30">
          <p className="text-sm text-info-dark">
            <strong>Recommended documents:</strong> Title deeds, floor plans, EPC certificate,
            property photos, inventory list, insurance documents
          </p>
        </div>
      </div>
    </div>
  )
}

// Step 8: Compliance Upload (NEW)
const ComplianceUploadStep = ({ documents, onUpload, onRemove }) => {
  const handleDrop = (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onUpload(files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const complianceTypes = [
    'Gas Safety Certificate',
    'EICR (Electrical)',
    'EPC (Energy Performance)',
    'Fire Safety Certificate',
    'Legionella Risk Assessment',
    'PAT Testing',
    'Boiler Service',
    'Insurance Certificate'
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-900 mb-2">Compliance Documents</h2>
      <p className="text-sm text-brand-600 mb-6">
        Upload compliance certificates (Optional - can be added later)
      </p>

      <div className="space-y-6">
        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-brand-300 p-8 text-center hover:border-brand-400 transition-colors bg-brand-50"
        >
          <FileCheck className="w-12 h-12 mx-auto mb-4 text-primary" />
          <p className="text-sm text-brand-700 mb-2">
            <strong>Upload Compliance Certificates</strong>
          </p>
          <p className="text-xs text-brand-500 mb-4">
            Drag and drop or click to browse
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => onUpload(e.target.files)}
            className="hidden"
            id="compliance-upload"
          />
          <label htmlFor="compliance-upload" className="ent-btn-secondary text-sm cursor-pointer inline-block">
            Choose Files
          </label>
          <p className="text-xs text-brand-500 mt-3">
            Accepted: PDF, JPG, PNG â€¢ Max size: 2MB per file
          </p>
        </div>

        {/* Uploaded Certificates List */}
        {documents.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-brand-700 mb-3">
              Uploaded Certificates ({documents.length})
            </h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-brand-200 hover:border-brand-300">
                  <div className="flex items-center gap-3 flex-1">
                    <FileCheck className="w-5 h-5 text-success" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-900 truncate">{doc.name}</p>
                      <p className="text-xs text-brand-500">{doc.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(doc.id)}
                    className="p-1 text-error hover:bg-error-light transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Types Reference */}
        <div className="p-4 bg-info-light border border-info/30">
          <p className="text-sm text-info-dark mb-3">
            <strong>Common compliance certificates:</strong>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-info-dark">
            {complianceTypes.map((type, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                {type}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-warning-light border border-warning/30">
          <p className="text-sm text-warning-dark">
            <strong>Note:</strong> You can skip this step and upload certificates later from the
            Compliance page. We'll send automatic reminders before renewal dates.
          </p>
        </div>
      </div>
    </div>
  )
}

// Step 8: Tenant Onboarding (New)
const TenantOnboardingStep = ({ formData, onChange }) => {
  const [mode, setMode] = useState(formData.onboardTenant || 'none')

  // Update parent state when mode changes
  useEffect(() => {
    if (mode !== formData.onboardTenant) {
      onChange('onboardTenant', mode)
    }
  }, [mode])

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-900 mb-2">Tenant Onboarding</h2>
      <p className="text-sm text-brand-600 mb-6">Would you like to add a tenant to this property now?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setMode('none')}
          className={`p-4 border-2 rounded-lg text-left transition-all ${mode === 'none' ? 'border-primary bg-primary-light' : 'border-brand-200 hover:border-brand-300'}`}
        >
          <div className="font-semibold text-brand-900 mb-1">No Tenant</div>
          <p className="text-xs text-brand-600">Property is vacant or I'll add later</p>
        </button>
        <button
          onClick={() => setMode('create')}
          className={`p-4 border-2 rounded-lg text-left transition-all ${mode === 'create' ? 'border-primary bg-primary-light' : 'border-brand-200 hover:border-brand-300'}`}
        >
          <div className="font-semibold text-brand-900 mb-1">Create New Tenant</div>
          <p className="text-xs text-brand-600">Add details for a new tenant</p>
        </button>
        <button
          onClick={() => setMode('select')}
          className={`p-4 border-2 rounded-lg text-left transition-all ${mode === 'select' ? 'border-primary bg-primary-light' : 'border-brand-200 hover:border-brand-300'}`}
        >
          <div className="font-semibold text-brand-900 mb-1">Select Existing</div>
          <p className="text-xs text-brand-600">Choose from your tenant list</p>
        </button>
      </div>

      {mode === 'create' && (
        <div className="animate-in fade-in slide-in-from-top-4 p-6 bg-white border border-brand-200 rounded-lg shadow-sm">
          <h3 className="font-medium text-brand-900 mb-4">New Tenant Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Full Name</label>
              <input
                type="text"
                className="ent-input"
                placeholder="John Doe"
                value={formData.tenantDetails?.name || ''}
                onChange={(e) => onChange('tenantDetails', { ...formData.tenantDetails, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Email</label>
              <input
                type="email"
                className="ent-input"
                placeholder="john@example.com"
                value={formData.tenantDetails?.email || ''}
                onChange={(e) => onChange('tenantDetails', { ...formData.tenantDetails, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Phone</label>
              <input
                type="tel"
                className="ent-input"
                placeholder="07700 900000"
                value={formData.tenantDetails?.phone || ''}
                onChange={(e) => onChange('tenantDetails', { ...formData.tenantDetails, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Rent Amount (£)</label>
              <input
                type="number"
                className="ent-input"
                placeholder="1500"
                value={formData.tenantDetails?.rentAmount || ''}
                onChange={(e) => onChange('tenantDetails', { ...formData.tenantDetails, rentAmount: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {mode === 'select' && (
        <div className="animate-in fade-in slide-in-from-top-4 p-6 bg-white border border-brand-200 rounded-lg shadow-sm">
          <div className="text-center py-8 text-brand-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No existing tenants found to link.</p>
            <button onClick={() => setMode('create')} className="text-primary hover:underline mt-2">Create new instead?</button>
          </div>
        </div>
      )}
    </div>
  )
}

// Step 9: Summary & Activation (enhanced)
const SummaryStep = ({ formData, uploadedDocuments, uploadedCompliance }) => {
  const willBeDraft = formData.selectedOptions.verifyOwnership && !formData.ownershipVerified

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-900 mb-2">Summary & Activation</h2>
      <p className="text-sm text-brand-600 mb-6">Review your property details before completing setup</p>

      <div className="space-y-4">
        {/* Property Details */}
        <div className="p-4 bg-brand-50 border border-brand-200">
          <h3 className="font-semibold text-brand-900 mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Property Address
          </h3>
          <p className="text-sm text-brand-700">
            {formData.address}, {formData.city} {formData.postcode}
          </p>
        </div>

        {/* Core Details */}
        <div className="p-4 bg-brand-50 border border-brand-200">
          <h3 className="font-semibold text-brand-900 mb-3">Property Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-brand-600">Type:</span>
              <span className="ml-2 text-brand-900">{formData.propertyType}</span>
            </div>
            <div>
              <span className="text-brand-600">Ownership:</span>
              <span className="ml-2 text-brand-900">{formData.ownership}</span>
            </div>
            <div>
              <span className="text-brand-600">Bedrooms:</span>
              <span className="ml-2 text-brand-900">{formData.bedrooms}</span>
            </div>
            <div>
              <span className="text-brand-600">Bathrooms:</span>
              <span className="ml-2 text-brand-900">{formData.bathrooms}</span>
            </div>
            <div>
              <span className="text-brand-600">Units:</span>
              <span className="ml-2 text-brand-900">
                {formData.isSingleUnit ? '1 (Single Unit)' : `${formData.units} (Multiple Units)`}
              </span>
            </div>
          </div>
        </div>

        {/* Ownership Status */}
        {formData.selectedOptions.verifyOwnership && (
          <div className={`p-4 border ${willBeDraft ? 'bg-warning-light border-warning/30' : 'bg-success-light border-success/30'}`}>
            <h3 className="font-semibold text-brand-900 mb-2 flex items-center gap-2">
              {willBeDraft ? (
                <>
                  <AlertCircle className="w-5 h-5 text-warning" />
                  Ownership Verification Pending
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-success" />
                  Ownership Verified
                </>
              )}
            </h3>
            <p className="text-sm text-brand-700">
              {willBeDraft ? (
                'Property will be saved as Draft until ownership is verified with Land Registry'
              ) : (
                'Ownership has been verified. Property will be activated immediately.'
              )}
            </p>
          </div>
        )}

        {/* Assets Summary */}
        {formData.selectedAssets?.length > 0 && (
          <div className="p-4 bg-brand-50 border border-brand-200">
            <h3 className="font-semibold text-brand-900 mb-2 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Assets Selected
            </h3>
            <p className="text-sm text-brand-700">{formData.selectedAssets.length} assets added to property</p>
          </div>
        )}

        {/* Tenant Summary */}
        {formData.onboardTenant === 'create' && formData.tenantDetails && (
          <div className="mt-4 pt-4 border-t border-brand-100">
            <h4 className="text-sm font-medium text-brand-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-500" />
              Tenant to Onboard
            </h4>
            <div className="bg-brand-50 p-3 rounded border border-brand-100">
              <p className="font-medium text-brand-900">{formData.tenantDetails.name}</p>
              <p className="text-xs text-brand-600">{formData.tenantDetails.email} • {formData.tenantDetails.phone}</p>
            </div>
          </div>
        )}

        {/* Assignee Summary */}
        {formData.assignee && (
          <div className="mt-4 pt-4 border-t border-brand-100">
            <h4 className="text-sm font-medium text-brand-900 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-500" />
              Assigned To
            </h4>
            <div className="bg-info-light p-3 rounded border border-info/30 text-info-dark">
              <p className="font-medium">{formData.assignee}</p>
              <p className="text-xs">This workflow is delegated to this user.</p>
            </div>
          </div>
        )}
        {/* Documents Summary */}
        {uploadedDocuments.length > 0 && (
          <div className="p-4 bg-brand-50 border border-brand-200">
            <h3 className="font-semibold text-brand-900 mb-2 flex items-center gap-2">
              <File className="w-5 h-5" />
              Documents Uploaded
            </h3>
            <p className="text-sm text-brand-700">{uploadedDocuments.length} document(s) uploaded</p>
          </div>
        )}

        {/* Compliance Summary */}
        {uploadedCompliance.length > 0 && (
          <div className="p-4 bg-brand-50 border border-brand-200">
            <h3 className="font-semibold text-brand-900 mb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Compliance Certificates
            </h3>
            <p className="text-sm text-brand-700">{uploadedCompliance.length} certificate(s) uploaded</p>
          </div>
        )}

        {/* Financial Information */}
        {formData.purchasePrice && (
          <div className="p-4 bg-brand-50 border border-brand-200">
            <h3 className="font-semibold text-brand-900 mb-3">Financial Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-brand-600">Purchase Price:</span>
                <span className="ml-2 text-brand-900">Â£{parseInt(formData.purchasePrice).toLocaleString()}</span>
              </div>
              {formData.currentValue && (
                <div>
                  <span className="text-brand-600">Current Value:</span>
                  <span className="ml-2 text-brand-900">Â£{parseInt(formData.currentValue).toLocaleString()}</span>
                </div>
              )}
              {formData.purchaseDate && (
                <div>
                  <span className="text-brand-600">Purchase Date:</span>
                  <span className="ml-2 text-brand-900">{new Date(formData.purchaseDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Final Status Notice */}
        <div className={`p-4 border ${willBeDraft ? 'bg-info-light border-info/30' : 'bg-success-light border-success/30'}`}>
          <p className="text-sm font-medium text-brand-900 mb-2">
            {willBeDraft ? 'ðŸ“ Property will be saved as Draft' : 'âœ… Property will be activated'}
          </p>
          <p className="text-sm text-brand-700">
            {willBeDraft ? (
              'You can activate this property later from your dashboard once ownership verification is complete.'
            ) : (
              'Your property will be immediately available in your dashboard with all features enabled.'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PropertyOnboarding