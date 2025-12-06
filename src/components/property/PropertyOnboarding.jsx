import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../shared/Toast'
import {
  Building2,
  MapPin,
  Home,
  Package,
  FileCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  X,
  Upload,
  Plus,
  Users,
  Grid3x3,
  File,
  Sparkles,
  Wand2,
  AlertCircle,
  Loader2,
  Link,
  FileText,
  Image as ImageIcon,

  MessageSquare,
  Search,
  UserPlus,
  User
} from 'lucide-react'
import { assetLibrary, lookupPostcode } from '../../lib/mockData'

const PropertyOnboarding = ({ onClose, onComplete, initialData }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [addressResults, setAddressResults] = useState([])
  const [searchingPostcode, setSearchingPostcode] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [uploadedCompliance, setUploadedCompliance] = useState([])

  const editProperty = initialData || location.state?.property
  const [isEditMode, setIsEditMode] = useState(!!editProperty)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [aiAnalyzing, setAiAnalyzing] = useState(false)

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

  // AI Analysis Handler
  const handleAIAnalysis = async (text) => {
    setAiAnalyzing(true)

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const updates = { ...formData }
    const foundAssets = []

    // Mock Keyword Extraction
    const lowerText = text.toLowerCase()

    // 1. Address Extraction (Mock)
    if (lowerText.includes('london')) updates.city = 'London'
    if (lowerText.includes('bristol')) updates.city = 'Bristol'
    if (lowerText.includes('manchester')) updates.city = 'Manchester'

    // 2. Property Details
    const bedroomsMatch = lowerText.match(/(\d+)\s*bed/) || lowerText.match(/(\d+)\s*bhk/)
    if (bedroomsMatch) {
      updates.bedrooms = parseInt(bedroomsMatch[1], 10)
    }
    const bathroomsMatch = lowerText.match(/(\d+)\s*bath/)
    if (bathroomsMatch) {
      updates.bathrooms = parseInt(bathroomsMatch[1], 10)
    }
    if (lowerText.includes('detached')) updates.propertyType = 'Residential House'
    if (lowerText.includes('flat') || lowerText.includes('apartment')) updates.propertyType = 'Residential Apartment'

    // 3. Asset Extraction
    const assetKeywords = {
      'boiler': 'boiler',
      'heater': 'heating',
      'washing machine': 'washing-machine',
      'dishwasher': 'dishwasher',
      'fridge': 'fridge',
      'refrigerator': 'fridge',
      'parking': 'parking',
      'garage': 'parking',
      'sofa': 'custom',
      'led': 'custom',
      'tv': 'custom'
    }

    Object.keys(assetKeywords).forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const type = assetKeywords[keyword]
        if (type === 'custom') {
          // Add to custom assets if not standard
          const match = lowerText.match(new RegExp(`(\\d+)?\\s*${keyword}.*?(,|\\.|$)`))
          const assetName = match ? match[0].replace(/,|\\./g, '').trim() : keyword
          if (!updates.customAssets) updates.customAssets = []
          updates.customAssets.push({ id: Date.now() + Math.random(), name: assetName })
          updates.selectedAssets.push(assetName) // Add name to selected for custom
        } else {
          foundAssets.push(type)
        }
      }
    })

    if (foundAssets.length > 0) {
      updates.selectedAssets = [...new Set([...updates.selectedAssets, ...foundAssets])]
      updates.selectedOptions = { ...updates.selectedOptions, addAssets: true }
    }

    // 4. Tenant Extraction
    if (lowerText.includes('tenant')) {
      updates.onboardTenant = 'create'
      updates.tenantDetails = {
        name: 'John Doe (Extracted)',
        email: 'john.doe@example.com',
        phone: '07700 900000',
        rentAmount: '1200'
      }
    }

    setFormData(updates)
    setAiAnalyzing(false)
    setShowAIModal(false)
    toast.success('AI Analysis Complete: Data auto-filled!', {
      icon: <Sparkles className="w-4 h-4 text-brand-500" />
    })
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Store original overflow value
    const originalOverflow = document.body.style.overflowY
    // Set overflow hidden
    document.body.style.overflowY = 'hidden'
    
    // Cleanup: restore original overflow on unmount
    return () => {
      document.body.style.overflowY = originalOverflow
    }
  }, [])

  // Autosave Effect
  useEffect(() => {
    if (!isEditMode && formData && !onClose) { // Don't autosave in modal mode
      localStorage.setItem('draft_property', JSON.stringify(formData))
    }
  }, [formData, isEditMode, onClose])

  // Load Draft Effect
  useEffect(() => {
    if (!isEditMode && !onClose) { // Don't load draft in modal mode
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
  }, [isEditMode, onClose])

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
    if (!formData.postcode || formData.postcode.length < 2) {
      setAddressResults([])
      return
    }

    setSearchingPostcode(true)

    // Small delay to simulate network but fast enough for typing
    setTimeout(() => {
      const results = lookupPostcode(formData.postcode)
      setAddressResults(results)
      setSearchingPostcode(false)
    }, 100)
  }

  const handleAddressSelect = (selectedAddress) => {
    setFormData(prev => ({
      ...prev,
      address: selectedAddress.address,
      city: selectedAddress.city,
      postcode: selectedAddress.postcode,
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
      const processFile = async (file) => {
        return new Promise((resolve) => {
          const fileObj = {
            id: `${type}-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            type: file.type,
            uploadedAt: new Date().toISOString()
          }

          if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
              fileObj.preview = reader.result
              resolve(fileObj)
            }
            reader.readAsDataURL(file)
          } else {
            resolve(fileObj)
          }
        })
      }

      Promise.all(validFiles.map(processFile)).then(fileObjects => {
        if (type === 'document') {
          setUploadedDocuments(prev => [...prev, ...fileObjects])
          setFormData(prev => ({ ...prev, documents: [...prev.documents, ...fileObjects] }))
        } else if (type === 'compliance') {
          setUploadedCompliance(prev => [...prev, ...fileObjects])
          setFormData(prev => ({ ...prev, complianceDocuments: [...prev.complianceDocuments, ...fileObjects] }))
        }
        toast.success(`${validFiles.length} file(s) uploaded successfully`)
      })
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

    const properties = JSON.parse(localStorage.getItem('xperty_properties') || '[]')

    // Determine property status
    const status = formData.selectedOptions.verifyOwnership && !formData.landRegistryConfirmed
      ? 'Draft'
      : 'Active'

    let finalProperty

    if (isEditMode) {
      const index = properties.findIndex(p => p.id === editProperty.id)
      if (index !== -1) {
        finalProperty = { ...formData, id: editProperty.id, status }
        properties[index] = finalProperty
      }
      toast.success('Property updated successfully!')
    } else {
      finalProperty = {
        id: `prop-${Date.now()}`,
        ...formData,
        status,
        createdAt: new Date().toISOString()
      }
      properties.push(finalProperty)
      toast.success(`Property ${status === 'Draft' ? 'saved as draft' : 'activated'} successfully!`)
    }

    localStorage.setItem('xperty_properties', JSON.stringify(properties))
    // Clear draft
    if (!onClose) {
      localStorage.removeItem('draft_property')
    }

    // Link property to assigned user if applicable
    if (finalProperty.assignee) {
      try {
        const savedUsers = JSON.parse(localStorage.getItem('xperty_users') || '[]')
        const userIndex = savedUsers.findIndex(u => u.id === finalProperty.assignee)

        if (userIndex !== -1) {
          const user = savedUsers[userIndex]
          // Avoid duplicates
          if (!user.assignedProperties.includes(finalProperty.id)) {
            // If 'all' is there, we don't strictly need to add it, but good to be explicit or handle 'all' logic
            if (!user.assignedProperties.includes('all')) {
              user.assignedProperties.push(finalProperty.id)
              savedUsers[userIndex] = user
              localStorage.setItem('xperty_users', JSON.stringify(savedUsers))
            }
          }
        }
      } catch (e) {
        console.error('Failed to link property to user', e)
      }
    }

    if (onComplete) {
      onComplete(finalProperty)
    } else {
      // Check if we have a returnTo path from location state
      const returnTo = location.state?.returnTo || '/dashboard/properties'
      navigate(returnTo, { 
        state: { 
          newPropertyId: finalProperty.id,
          returnContext: location.state?.returnContext 
        } 
      })
    }
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
    <div className="min-h-screen bg-brand-50 p-4 pb-24 md:pb-8 overflow-visible">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-brand-900">
              {isEditMode ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-xs md:text-sm text-brand-600">
              Step {currentStep + 1} of {totalSteps}: {currentStepInfo?.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!showAIModal && currentStep === 0 && (
              <button
                onClick={() => setShowAIModal(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg hover:opacity-90 transition-all shadow-md animate-pulse-subtle"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI Quick Start</span>
              </button>
            )}
            <button
              onClick={() => setShowUserModal(true)}
              className={`p-2 hover:text-violet-600 transition-colors relative ${formData.assignee ? 'text-violet-600' : 'text-brand-600'}`}
              title={formData.assignee ? "Assigned (Click to change)" : "Assign to user"}
            >
              <Users className="w-5 h-5" />
              {formData.assignee && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-violet-600 rounded-full border border-white" />
              )}
            </button>
            <button
              onClick={() => {
                if (onClose) {
                  onClose()
                } else {
                  const returnTo = location.state?.returnTo || '/dashboard/properties'
                  navigate(returnTo)
                }
              }}
              className="p-2 text-brand-600 hover:text-brand-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showAIModal && (
          <AIQuickStart
            onAnalyze={handleAIAnalysis}
            isAnalyzing={aiAnalyzing}
            onCancel={() => setShowAIModal(false)}
          />
        )}

        {showUserModal && (
          <UserAssignmentModal
            currentAssignee={formData.assignee}
            onAssign={(userId) => {
              handleChange('assignee', userId)
              setShowUserModal(false)
              toast.success('User assigned successfully')
            }}
            onClose={() => setShowUserModal(false)}
          />
        )}

        {!showAIModal && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Content */}
            <div className="flex-1 w-full">
              {/* Mobile Workflow Stepper */}
              <div className="md:hidden mb-4">
                <MobileWorkflowStepper steps={steps} currentStep={currentStep} />
              </div>

              {/* Desktop Progress Bar */}
              <div className="hidden md:block mb-6 md:mb-8">
                <div className="h-2 bg-brand-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="ent-card p-4 sm:p-6 md:p-8 mb-4 md:mb-6">
                {renderStep()}
              </div>

              {/* Navigation - Fixed at bottom on mobile, above mobile bottom nav */}
              <div className="fixed md:static bottom-0 left-0 right-0 bg-white md:bg-transparent border-t md:border-0 border-brand-200 p-3 md:p-0 safe-bottom z-50 shadow-lg md:shadow-none">
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
                      className="flex items-center gap-2 flex-1 md:flex-initial justify-center py-3 md:py-2 bg-violet-600 text-white hover:bg-violet-700 rounded-lg transition-colors font-medium px-6"
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
                      className="flex items-center gap-2 flex-1 md:flex-initial justify-center py-3 md:py-2 bg-violet-600 text-white hover:bg-violet-700 rounded-lg transition-colors font-medium px-6"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:block w-80 sticky top-4 self-start overflow-visible">
              <div className="overflow-visible">
                <WorkflowSidebar steps={steps} currentStep={currentStep} aiActive={formData.bedrooms || formData.city} />
              </div>
            </div>
          </div>
        )}

        {/* Extra spacer for mobile to prevent content overlap with fixed navigation */}
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
      <h2 className="text-lg md:text-xl font-semibold text-brand-900 mb-2">What would you like to set up?</h2>
      <p className="text-sm text-brand-600 mb-4 md:mb-6">
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
                ? 'border-violet-500 bg-violet-50'
                : 'border-brand-200 hover:border-brand-300 hover:bg-brand-50'
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-violet-600 text-white' : 'bg-brand-100 text-brand-600 group-hover:bg-brand-200'
                  }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center animate-in zoom-in">
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
const WorkflowSidebar = ({ steps, currentStep, aiActive }) => (
  <div className="bg-white rounded-xl p-6 border border-brand-200 shadow-sm transition-all duration-500 overflow-visible">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-brand-900 flex items-center gap-2">
        <Grid3x3 className="w-4 h-4 text-brand-500" />
        Your Workflow
      </h3>
      {aiActive && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full animate-in fade-in">
          <Sparkles className="w-3 h-3" />
          AI Active
        </span>
      )}
    </div>

    <div className="space-y-0 relative overflow-visible">
      {/* Connecting Line */}
      <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-brand-100" />

      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep
        const isCurrent = idx === currentStep

        return (
          <div key={step.id} className="relative flex items-center gap-3 py-2">
            <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all duration-300 ${isCompleted
              ? 'bg-success border-success text-white'
              : isCurrent
                ? 'bg-violet-600 border-violet-600 text-white scale-110 shadow-md'
                : 'bg-white border-brand-200 text-brand-400'
              }`}>
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`text-sm font-medium transition-colors duration-300 ${isCompleted
              ? 'text-brand-900'
              : isCurrent
                ? 'text-violet-700 font-bold'
                : 'text-brand-400'
              }`}>
              {step.title}
            </span>
            {isCompleted && (
              <div className="absolute left-3.5 top-9 bottom-0 w-0.5 bg-success z-0" />
            )}
          </div>
        )
      })}
    </div>
  </div>
)

const MobileWorkflowStepper = ({ steps, currentStep }) => (
  <div className="overflow-x-auto pt-2 pb-2 -mx-4 px-4 scrollbar-hide">
    <div className="flex items-center gap-4 min-w-max">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep
        const isCurrent = idx === currentStep

        return (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all ${isCompleted
              ? 'bg-success border-success text-white'
              : isCurrent
                ? 'bg-violet-600 border-violet-600 text-white shadow-md scale-110'
                : 'bg-white border-brand-200 text-brand-400'
              }`}>
              {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap ${isCurrent ? 'text-violet-700' : 'text-brand-500'
              }`}>
              {step.title.split(' ')[0]}
            </span>
          </div>
        )
      })}
    </div>
  </div>
)

// User Assignment Modal
const UserAssignmentModal = ({ currentAssignee, onAssign, onClose }) => {
  const [users, setUsers] = useState([])
  const [view, setView] = useState('list') // list, add
  const [searchQuery, setSearchQuery] = useState('')
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Property Manager'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('managedUsers') || '[]')
    if (savedUsers.length === 0) {
      // Initialize mock users if empty (same as UsersPage)
      const mockUsers = [
        {
          id: 'usr-1',
          firstName: 'Sarah',
          lastName: 'Smith',
          email: 'sarah.smith@example.com',
          role: 'Property Manager',
          assignedProperties: ['all'],
          status: 'Active'
        },
        {
          id: 'usr-2',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.j@example.com',
          role: 'Maintenance',
          assignedProperties: [],
          status: 'Active'
        }
      ]
      setUsers(mockUsers)
      localStorage.setItem('managedUsers', JSON.stringify(mockUsers))
    } else {
      setUsers(savedUsers)
    }
  }

  const handleCreateUser = (e) => {
    e.preventDefault()
    const user = {
      id: `usr - ${Date.now()} `,
      ...newUser,
      assignedProperties: [],
      status: 'Active',
      lastActive: 'Never'
    }

    const updatedUsers = [...users, user]
    setUsers(updatedUsers)
    localStorage.setItem('managedUsers', JSON.stringify(updatedUsers))
    onAssign(user.id)
  }

  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[clamp(320px,90vw,448px)] overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-brand-200">
          <h3 className="font-bold text-brand-900">
            {view === 'list' ? 'Assign Workflow' : 'Add New User'}
          </h3>
          <button onClick={onClose} className="text-brand-500 hover:text-brand-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {view === 'list' ? (
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="ent-input pl-9 py-2 text-sm"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => onAssign(user.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${currentAssignee === user.id
                    ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'
                    : 'border-brand-200 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                >
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-medium text-xs">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-brand-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-brand-500">{user.role}</p>
                  </div>
                  {currentAssignee === user.id && <CheckCircle className="w-4 h-4 text-violet-600" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setView('add')}
              className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add New User
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateUser} className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-brand-700 mb-1">First Name <span className="text-error">*</span></label>
                <input
                  required
                  value={newUser.firstName}
                  onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                  className="ent-input py-2 text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-700 mb-1">Last Name <span className="text-error">*</span></label>
                <input
                  required
                  value={newUser.lastName}
                  onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                  className="ent-input py-2 text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-700 mb-1">Email <span className="text-error">*</span></label>
              <input
                required
                type="email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                className="ent-input py-2 text-sm"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-700 mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                className="ent-select py-2 text-sm"
              >
                <option>Property Manager</option>
                <option>Maintenance</option>
                <option>Accountant</option>
                <option>Viewer</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setView('list')}
                className="flex-1 py-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg"
              >
                Create & Assign
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// AI Quick Start Component
const AIQuickStart = ({ onAnalyze, isAnalyzing, onCancel }) => {
  const [inputType, setInputType] = useState('text') // text, url, file
  const [text, setText] = useState('')

  const inputOptions = [
    { id: 'text', label: 'Paste Text', icon: MessageSquare },
    { id: 'url', label: 'Listing URL', icon: Link },
    { id: 'file', label: 'Upload File', icon: Upload },
  ]

  return (
    <div className="ent-card p-8 mb-6 animate-in zoom-in-95 duration-300">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-brand-900 mb-2">AI Quick Start</h2>
        <p className="text-brand-600 max-w-md mx-auto">
          Import property details from any source. We'll extract the data for you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input Type Tabs */}
        <div className="flex p-1.5 bg-brand-100/50 rounded-xl border border-brand-200">
          {inputOptions.map(option => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => setInputType(option.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${inputType === option.id
                  ? 'bg-white text-violet-700 shadow-sm ring-1 ring-black/5'
                  : 'text-brand-600 hover:text-brand-900 hover:bg-white/50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            )
          })}
        </div>

        <div className="relative min-h-[160px]">
          {inputType === 'text' && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste property description, WhatsApp message, or email here...
Example: 3 BHK in London, Sw7 4ub, 56 Gloucester Road, Kensington, 2 Bathrooms. Includes 1 heater, 1 sofa, 1 refrigerator, 1 LED 52 inch."
              className="w-full h-40 p-4 rounded-xl border-2 border-brand-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 resize-none transition-all text-brand-900 placeholder:text-brand-400"
              disabled={isAnalyzing}
            />
          )}

          {inputType === 'url' && (
            <div className="h-40 flex flex-col justify-center">
              <input
                type="url"
                placeholder="https://www.rightmove.co.uk/properties/..."
                className="w-full p-4 rounded-xl border-2 border-brand-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all text-brand-900"
                disabled={isAnalyzing}
                onChange={(e) => setText(e.target.value)} // Mocking URL as text input for now
              />
              <p className="text-xs text-brand-500 mt-2 ml-1">
                Supported: Rightmove, Zoopla, OpenRent
              </p>
            </div>
          )}

          {inputType === 'file' && (
            <div className="h-40 border-2 border-dashed border-brand-300 rounded-xl flex flex-col items-center justify-center bg-brand-50/50 hover:bg-brand-50 transition-colors cursor-pointer" onClick={() => setText("Mock file content loaded")}>
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-violet-500" />
              </div>
              <p className="text-sm font-medium text-brand-700">Click to upload document</p>
              <p className="text-xs text-brand-500 mt-1">PDF, DOCX, or Images</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-violet-600 animate-spin mb-2" />
              <p className="text-sm font-medium text-violet-700 animate-pulse">Analyzing {inputType}...</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onAnalyze(text || "Mock content for file/url")}
            disabled={(!text.trim() && inputType === 'text') || isAnalyzing}
            className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            {isAnalyzing ? 'Processing...' : (
              <>
                <Wand2 className="w-4 h-4" />
                Auto-fill Property Details
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-white border border-brand-200 text-brand-700 rounded-xl font-semibold hover:bg-brand-50 hover:text-brand-900 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-brand-400">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Address
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Assets
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Compliance
          </span>
        </div>
      </div>
    </div>
  )
}

// Combined Address Step (Context Aware - Enhanced with Autocomplete)
const AddressStep = ({ formData, onChange, onLookup, searching, results, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [manualEntry, setManualEntry] = useState(false)

  // Trigger lookup when postcode changes (debounced)
  useEffect(() => {
    if (formData.postcode && formData.postcode.length >= 2) {
      const timer = setTimeout(() => {
        onLookup()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [formData.postcode])

  // Open dropdown when results are available
  useEffect(() => {
    if (results.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [results])

  return (
    <div>
      <h2 className="text-lg md:text-xl font-semibold text-brand-900 mb-2">Property Location</h2>
      <p className="text-sm text-brand-600 mb-4 md:mb-6">Start typing your postcode to find your address</p>

      <div className="max-w-2xl space-y-4 md:space-y-6">
        {/* Postcode Search Section */}
        <div className="p-4 md:p-6 bg-white border border-brand-200 rounded-lg shadow-sm relative">
          <label className="block text-sm font-medium text-brand-700 mb-2">Postcode Search <span className="text-error">*</span></label>
          <div className="relative">
            <div className="flex items-center border border-brand-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all">
              <div className="pl-3 text-brand-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => onChange('postcode', e.target.value.toUpperCase())}
                className="w-full px-3 py-3 text-lg outline-none text-brand-900 placeholder:text-brand-300"
                placeholder="Start typing postcode (e.g. SW1...)"
                autoComplete="off"
              />
              {searching && (
                <div className="pr-3">
                  <Loader2 className="w-5 h-5 text-violet-600 animate-spin" />
                </div>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isOpen && results.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-brand-200 rounded-lg shadow-xl max-h-60 overflow-auto animate-in fade-in slide-in-from-top-1">
                {results.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelect(result)
                      setIsOpen(false)
                    }}
                    className="w-full p-3 text-left hover:bg-brand-50 transition-colors border-b border-brand-50 last:border-0 flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-medium text-brand-900 text-sm">{result.address}</div>
                      <div className="text-xs text-brand-500">{result.city}, {result.postcode}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-300 group-hover:text-violet-600 transition-colors" />
                  </button>
                ))}
                <div className="p-2 bg-brand-50 text-xs text-center text-brand-400 border-t border-brand-100">
                  {results.length} addresses found
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-brand-100">
            <button
              onClick={() => setManualEntry(!manualEntry)}
              className="text-sm text-violet-600 font-medium hover:underline flex items-center gap-1"
            >
              {manualEntry ? 'Hide manual entry' : 'Can\'t find your address? Enter manually'}
            </button>
          </div>
        </div>

        {/* Manual Entry Section - Context Aware (Shows if selected or requested) */}
        {(manualEntry || formData.address) && (
          <div className="p-4 md:p-6 bg-brand-50 border border-brand-200 rounded-lg animate-in fade-in slide-in-from-top-4">
            <h3 className="font-medium text-brand-900 mb-3 md:mb-4 flex items-center gap-2">
              <Home className="w-4 h-4 text-brand-500" />
              Property Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Address Line 1 <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => onChange('address', e.target.value)}
                  className="ent-input"
                  placeholder="45 Oxford Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">City <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => onChange('city', e.target.value)}
                  className="ent-input"
                  placeholder="London"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Postcode <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e) => onChange('postcode', e.target.value.toUpperCase())}
                  className="ent-input"
                  placeholder="SW1A 1AA"
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
    </div >
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

      <div className="space-y-4 md:space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">
            Title Deed Number <span className="text-error">*</span>
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
            className="w-4 h-4 border-brand-300 text-violet-600 focus:ring-violet-500 mt-0.5"
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
                  className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 text-sm"
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
                className="flex items-center gap-2 text-sm text-violet-600 font-medium hover:underline"
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
    <h2 className="text-lg md:text-xl font-semibold text-brand-900 mb-2">Property Core Details</h2>
    <p className="text-sm text-brand-600 mb-4 md:mb-6">Add essential property information</p>

    <div className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">Bedrooms <span className="text-error">*</span></label>
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
          <label className="block text-sm font-medium text-brand-700 mb-1">Bathrooms <span className="text-error">*</span></label>
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
          <label className="block text-sm font-medium text-brand-700 mb-1">Property Type <span className="text-error">*</span></label>
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
    <h2 className="text-lg md:text-xl font-semibold text-brand-900 mb-2">Building Structure</h2>
    <p className="text-sm text-brand-600 mb-4 md:mb-6">Define the unit configuration for this property</p>

    <div className="space-y-4 md:space-y-6 max-w-2xl">
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
              ? 'border-violet-500 bg-violet-50'
              : 'border-brand-200 hover:border-brand-300'
              } `}
          >
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-6 h-6 text-violet-600" />
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
              ? 'border-violet-500 bg-violet-50'
              : 'border-brand-200 hover:border-brand-300'
              } `}
          >
            <div className="flex items-center gap-3 mb-2">
              <Grid3x3 className="w-6 h-6 text-violet-600" />
              <h3 className="font-semibold text-brand-900">Multiple Units</h3>
            </div>
            <p className="text-sm text-brand-600 leading-relaxed">
              Property divided into separate units (HMO, apartments, etc.)
            </p>
          </button>
        </div>
      </div>

      {!formData.isSingleUnit && (
        <div>
          <label className="block text-sm font-medium text-brand-700 mb-1">
            Number of Units <span className="text-error">*</span>
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
      id: `custom - ${Date.now()} `,
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
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[400px] md:h-[600px]">
      {/* Categories Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-1 overflow-y-auto pr-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all border-2 ${activeCategory === category.key
              ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm'
              : 'bg-transparent border-transparent hover:bg-brand-50 text-brand-600'
              }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}

        {/* Custom Assets Category */}
        <button
          onClick={() => setActiveCategory('custom')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all border-2 ${activeCategory === 'custom'
            ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm'
            : 'bg-transparent border-transparent hover:bg-brand-50 text-brand-600'
            }`}
        >
          <span className="text-xl">✨</span>
          <span className="font-medium">Custom Assets</span>
        </button>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto p-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              <div className="border-2 border-dashed border-brand-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-violet-500/50 transition-colors cursor-pointer bg-brand-50/50"
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
                        className="flex-1 bg-violet-600 text-white text-xs py-1 rounded hover:bg-violet-700"
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
      ? 'border-violet-500 bg-violet-50'
      : 'border-brand-200 hover:border-brand-300 bg-white'
      } `}
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-2xl">{asset.icon}</span>
      {selected && (
        <div className="w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center">
          <CheckCircle className="w-3 h-3" />
        </div>
      )}
    </div>
    <h3 className={`font - medium text - sm ${selected ? 'text-brand-900' : 'text-brand-700'} `}>
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
      <h2 className="text-lg md:text-xl font-semibold text-brand-900 mb-2">Upload Documents</h2>
      <p className="text-sm text-brand-600 mb-4 md:mb-6">
        Upload property documents, floor plans, photos, and other files
      </p>

      <div className="space-y-4 md:space-y-6">
        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-brand-300 p-6 md:p-8 text-center hover:border-brand-400 transition-colors bg-brand-50"
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

      <div className="space-y-4 md:space-y-6">
        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-brand-300 p-6 md:p-8 text-center hover:border-brand-400 transition-colors bg-brand-50"
        >
          <FileCheck className="w-12 h-12 mx-auto mb-4 text-violet-600" />
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
      <h2 className="text-lg md:text-xl font-semibold text-brand-900 mb-2">Tenant Onboarding</h2>
      <p className="text-sm text-brand-600 mb-4 md:mb-6">Would you like to add a tenant to this property now?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setMode('none')}
          className={`p-4 border-2 rounded-xl text-left transition-all group ${mode === 'none'
            ? 'border-violet-500 bg-violet-50'
            : 'border-brand-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${mode === 'none' ? 'bg-violet-600 text-white' : 'bg-brand-100 text-brand-600 group-hover:bg-brand-200'}`}>
            <Home className="w-5 h-5" />
          </div>
          <div className="font-semibold text-brand-900 mb-1">No Tenant</div>
          <p className="text-xs text-brand-600">Property is vacant or I'll add later</p>
        </button>

        <button
          onClick={() => setMode('create')}
          className={`p-4 border-2 rounded-xl text-left transition-all group ${mode === 'create'
            ? 'border-violet-500 bg-violet-50'
            : 'border-brand-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${mode === 'create' ? 'bg-violet-600 text-white' : 'bg-brand-100 text-brand-600 group-hover:bg-brand-200'}`}>
            <UserPlus className="w-5 h-5" />
          </div>
          <div className="font-semibold text-brand-900 mb-1">Create New Tenant</div>
          <p className="text-xs text-brand-600">Add details for a new tenant</p>
        </button>

        <button
          onClick={() => setMode('select')}
          className={`p-4 border-2 rounded-xl text-left transition-all group ${mode === 'select'
            ? 'border-violet-500 bg-violet-50'
            : 'border-brand-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${mode === 'select' ? 'bg-violet-600 text-white' : 'bg-brand-100 text-brand-600 group-hover:bg-brand-200'}`}>
            <Users className="w-5 h-5" />
          </div>
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
            <button onClick={() => setMode('create')} className="text-violet-600 hover:underline mt-2">Create new instead?</button>
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
      <h2 className="text-lg md:text-xl font-semibold text-brand-900 mb-2">Summary & Activation</h2>
      <p className="text-sm text-brand-600 mb-4 md:mb-6">Review your property details before completing setup</p>

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
          <div className={`p - 4 border ${willBeDraft ? 'bg-warning-light border-warning/30' : 'bg-success-light border-success/30'} `}>
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
                <span className="ml-2 text-brand-900">£{parseInt(formData.purchasePrice).toLocaleString()}</span>
              </div>
              {formData.currentValue && (
                <div>
                  <span className="text-brand-600">Current Value:</span>
                  <span className="ml-2 text-brand-900">£{parseInt(formData.currentValue).toLocaleString()}</span>
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
        <div className={`p - 4 border ${willBeDraft ? 'bg-info-light border-info/30' : 'bg-success-light border-success/30'} `}>
          <p className="text-sm font-medium text-brand-900 mb-2">
            {willBeDraft ? '📝 Property will be saved as Draft' : '✅ Property will be activated'}
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