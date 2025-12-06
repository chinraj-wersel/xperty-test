// Enhanced Mock Data Service - Provides realistic demo data for XPERTY including postcode lookup

// Postcode lookup data - UK addresses by postcode
export const postcodeDatabase = {
  'SW1A 1AA': [
    { address: '10 Downing Street', city: 'London', propertyType: 'Residential House', bedrooms: 4, bathrooms: 3 },
    { address: '11 Downing Street', city: 'London', propertyType: 'Residential House', bedrooms: 4, bathrooms: 3 },
    { address: '12 Downing Street', city: 'London', propertyType: 'Residential House', bedrooms: 3, bathrooms: 2 }
  ],
  'W1D 2DZ': [
    { address: '45 Oxford Street', city: 'London', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 2 },
    { address: '47 Oxford Street', city: 'London', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 },
    { address: '49 Oxford Street', city: 'London', propertyType: 'Commercial Retail', bedrooms: 0, bathrooms: 1 }
  ],
  'NW1 6XE': [
    { address: '221B Baker Street', city: 'London', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 },
    { address: '223 Baker Street', city: 'London', propertyType: 'Residential Apartment', bedrooms: 1, bathrooms: 1 },
    { address: '225 Baker Street', city: 'London', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 2 }
  ],
  'M1 1AE': [
    { address: '12 Downing Street', city: 'Manchester', propertyType: 'HMO', bedrooms: 5, bathrooms: 3 },
    { address: '14 Downing Street', city: 'Manchester', propertyType: 'Residential House', bedrooms: 4, bathrooms: 2 },
    { address: '16 Downing Street', city: 'Manchester', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 }
  ],
  'B1 1BB': [
    { address: '8 Victoria Gardens', city: 'Birmingham', propertyType: 'Residential Apartment', bedrooms: 1, bathrooms: 1 },
    { address: '10 Victoria Gardens', city: 'Birmingham', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 },
    { address: '12 Victoria Gardens', city: 'Birmingham', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 2 }
  ],
  'LS1 5RG': [
    { address: '56 Park Lane', city: 'Leeds', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 2 },
    { address: '58 Park Lane', city: 'Leeds', propertyType: 'Residential House', bedrooms: 3, bathrooms: 2 },
    { address: '60 Park Lane', city: 'Leeds', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 }
  ],
  'EH1 1YZ': [
    { address: '1 Princes Street', city: 'Edinburgh', propertyType: 'Commercial Retail', bedrooms: 0, bathrooms: 1 },
    { address: '3 Princes Street', city: 'Edinburgh', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 },
    { address: '5 Princes Street', city: 'Edinburgh', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 2 }
  ],
  'G1 1RE': [
    { address: '10 George Square', city: 'Glasgow', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 2 },
    { address: '12 George Square', city: 'Glasgow', propertyType: 'Residential Apartment', bedrooms: 1, bathrooms: 1 },
    { address: '14 George Square', city: 'Glasgow', propertyType: 'HMO', bedrooms: 4, bathrooms: 2 }
  ],
  'CF10 1EP': [
    { address: '1 Castle Street', city: 'Cardiff', propertyType: 'Residential House', bedrooms: 3, bathrooms: 2 },
    { address: '3 Castle Street', city: 'Cardiff', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 },
    { address: '5 Castle Street', city: 'Cardiff', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 1 }
  ],
  'BT1 5GS': [
    { address: '1 Donegall Square', city: 'Belfast', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 2 },
    { address: '3 Donegall Square', city: 'Belfast', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 },
    { address: '5 Donegall Square', city: 'Belfast', propertyType: 'Residential House', bedrooms: 3, bathrooms: 2 }
  ],
  'E1 6AN': [
    { address: '10 Brick Lane', city: 'London', propertyType: 'Residential Apartment', bedrooms: 1, bathrooms: 1 },
    { address: '12 Brick Lane', city: 'London', propertyType: 'Commercial Retail', bedrooms: 0, bathrooms: 1 },
    { address: '14 Brick Lane', city: 'London', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 1 }
  ],
  'M4 1HQ': [
    { address: '25 Northern Quarter', city: 'Manchester', propertyType: 'Residential Apartment', bedrooms: 2, bathrooms: 2 },
    { address: '27 Northern Quarter', city: 'Manchester', propertyType: 'Residential Apartment', bedrooms: 1, bathrooms: 1 },
    { address: '29 Northern Quarter', city: 'Manchester', propertyType: 'Commercial Retail', bedrooms: 0, bathrooms: 1 }
  ],
  'B3 3AX': [
    { address: '1 Colmore Row', city: 'Birmingham', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 4 },
    { address: '3 Colmore Row', city: 'Birmingham', propertyType: 'Commercial Office', bedrooms: 0, bathrooms: 3 },
    { address: '5 Colmore Row', city: 'Birmingham', propertyType: 'Commercial Retail', bedrooms: 0, bathrooms: 1 }
  ]
}

// Helper function to lookup addresses by postcode with partial matching
export const lookupPostcode = (query) => {
  if (!query || query.length < 2) return []

  const normalizedQuery = query.toUpperCase().trim()
  const results = []

  // Iterate through all postcodes in the database
  Object.entries(postcodeDatabase).forEach(([postcode, addresses]) => {
    // Check if postcode starts with the query (partial match)
    if (postcode.startsWith(normalizedQuery) || postcode.replace(' ', '').startsWith(normalizedQuery.replace(' ', ''))) {
      // Add all addresses for this postcode to results
      addresses.forEach(addr => {
        results.push({
          ...addr,
          postcode // Include the full postcode in the result
        })
      })
    }
  })

  // Limit results to 10 to prevent UI clutter
  return results.slice(0, 10)
}

// Asset Library with 100+ categorized assets
export const assetLibrary = {
  'heating-cooling': {
    name: 'Heating & Cooling',
    icon: '🔥',
    assets: [
      { id: 'boiler-gas', name: 'Gas Boiler', icon: '🔥', compliance: ['gas-safety', 'boiler-service'] },
      { id: 'boiler-electric', name: 'Electric Boiler', icon: '⚡', compliance: [] },
      { id: 'boiler-combi', name: 'Combi Boiler', icon: '🔥', compliance: ['gas-safety', 'boiler-service'] },
      { id: 'central-heating', name: 'Central Heating System', icon: '🌡️', compliance: ['gas-safety'] },
      { id: 'radiators', name: 'Radiators', icon: '🔧', compliance: [], quantity: true },
      { id: 'thermostat', name: 'Thermostat', icon: '🌡️', compliance: [] },
      { id: 'ac-unit', name: 'Air Conditioning Unit', icon: '❄️', compliance: ['f-gas'] },
      { id: 'heat-pump', name: 'Heat Pump', icon: '♨️', compliance: ['mcs'] }
    ]
  },
  'kitchen': {
    name: 'Kitchen Appliances',
    icon: '🍳',
    assets: [
      { id: 'cooker-gas', name: 'Gas Cooker', icon: '🍳', compliance: ['gas-safety'] },
      { id: 'cooker-electric', name: 'Electric Cooker', icon: '🍳', compliance: [] },
      { id: 'oven-builtin', name: 'Built-in Oven', icon: '🍳', compliance: ['gas-safety'] },
      { id: 'hob-gas', name: 'Gas Hob', icon: '🔥', compliance: ['gas-safety'] },
      { id: 'hob-electric', name: 'Electric Hob', icon: '⚡', compliance: [] },
      { id: 'refrigerator', name: 'Refrigerator', icon: '❄️', compliance: [] },
      { id: 'freezer', name: 'Freezer', icon: '🧊', compliance: [] },
      { id: 'dishwasher', name: 'Dishwasher', icon: '🍽️', compliance: [] },
      { id: 'microwave', name: 'Microwave', icon: '♨️', compliance: [] },
      { id: 'extractor-fan', name: 'Extractor Fan', icon: '🌀', compliance: [] },
      { id: 'waste-disposal', name: 'Waste Disposal Unit', icon: '🗑️', compliance: [] }
    ]
  },
  'bathroom': {
    name: 'Bathroom Fixtures',
    icon: '🚿',
    assets: [
      { id: 'shower-unit', name: 'Shower Unit', icon: '🚿', compliance: [] },
      { id: 'shower-electric', name: 'Electric Shower', icon: '⚡', compliance: ['eicr'] },
      { id: 'bathtub', name: 'Bathtub', icon: '🛁', compliance: [] },
      { id: 'toilet', name: 'Toilet', icon: '🚽', compliance: [] },
      { id: 'bidet', name: 'Bidet', icon: '🚿', compliance: [] },
      { id: 'water-heater', name: 'Water Heater', icon: '🔥', compliance: ['gas-safety'] },
      { id: 'bathroom-fan', name: 'Bathroom Extractor Fan', icon: '🌀', compliance: [] },
      { id: 'heated-towel-rail', name: 'Heated Towel Rail', icon: '🔧', compliance: [] }
    ]
  },
  'electrical': {
    name: 'Electrical',
    icon: '⚡',
    assets: [
      { id: 'electrical-panel', name: 'Main Electrical Panel', icon: '⚡', compliance: ['eicr'] },
      { id: 'consumer-unit', name: 'Consumer Unit/Fuse Box', icon: '🔌', compliance: ['eicr'] },
      { id: 'smoke-detector', name: 'Smoke Detectors', icon: '🚨', compliance: ['fire-safety'], quantity: true },
      { id: 'co-detector', name: 'Carbon Monoxide Detector', icon: '⚠️', compliance: ['fire-safety'], quantity: true },
      { id: 'security-alarm', name: 'Security Alarm System', icon: '🔔', compliance: [] },
      { id: 'cctv', name: 'CCTV System', icon: '📹', compliance: [] },
      { id: 'doorbell', name: 'Doorbell (Wired)', icon: '🔔', compliance: [] },
      { id: 'lighting', name: 'Lighting Fixtures', icon: '💡', compliance: [], quantity: true },
      { id: 'emergency-lighting', name: 'Emergency Lighting', icon: '🚨', compliance: ['fire-safety'] },
      { id: 'ev-charger', name: 'Electric Vehicle Charger', icon: '🔌', compliance: ['eicr'] }
    ]
  },
  'windows-doors': {
    name: 'Windows & Doors',
    icon: '🪟',
    assets: [
      { id: 'windows', name: 'Windows', icon: '🪟', compliance: [], quantity: true },
      { id: 'windows-double', name: 'Double-Glazed Windows', icon: '🪟', compliance: [], quantity: true },
      { id: 'door-front', name: 'Front Door', icon: '🚪', compliance: [] },
      { id: 'door-back', name: 'Back Door', icon: '🚪', compliance: [] },
      { id: 'doors-interior', name: 'Interior Doors', icon: '🚪', compliance: [], quantity: true },
      { id: 'doors-fire', name: 'Fire Doors', icon: '🚪', compliance: ['fire-safety'], quantity: true },
      { id: 'window-locks', name: 'Window Locks', icon: '🔒', compliance: [], quantity: true }
    ]
  },
  'outdoor': {
    name: 'Outdoor',
    icon: '🌳',
    assets: [
      { id: 'garden', name: 'Garden/Landscaping', icon: '🌳', compliance: [] },
      { id: 'garage-door', name: 'Garage Door', icon: '🚗', compliance: [] },
      { id: 'garage-door-electric', name: 'Electric Garage Door', icon: '⚡', compliance: [] },
      { id: 'shed', name: 'Shed/Outbuilding', icon: '🏡', compliance: [] },
      { id: 'outdoor-tap', name: 'Outdoor Tap', icon: '🚰', compliance: [] },
      { id: 'outdoor-lighting', name: 'Outdoor Lighting', icon: '💡', compliance: [] },
      { id: 'solar-panels', name: 'Solar Panels', icon: '☀️', compliance: ['mcs'] }
    ]
  },
  'other': {
    name: 'Other',
    icon: '🔧',
    assets: [
      { id: 'tv-system', name: 'TV/Entertainment System', icon: '📺', compliance: [] },
      { id: 'washing-machine', name: 'Washing Machine', icon: '🧺', compliance: [] },
      { id: 'dryer', name: 'Dryer', icon: '👕', compliance: [] },
      { id: 'water-softener', name: 'Water Softener', icon: '💧', compliance: [] },
      { id: 'lift', name: 'Lift/Elevator', icon: '🛗', compliance: ['loler'] }
    ]
  }
}

// Compliance certificate types
export const complianceTypes = {
  'gas-safety': { name: 'Gas Safety Certificate', renewalMonths: 12, color: 'warning' },
  'eicr': { name: 'EICR (Electrical Safety)', renewalMonths: 60, color: 'info' },
  'epc': { name: 'EPC (Energy Performance)', renewalMonths: 120, color: 'success' },
  'fire-safety': { name: 'Fire Safety Certificate', renewalMonths: 12, color: 'error' },
  'legionella': { name: 'Legionella Risk Assessment', renewalMonths: 24, color: 'info' },
  'pat': { name: 'PAT Testing', renewalMonths: 12, color: 'warning' },
  'boiler-service': { name: 'Boiler Service', renewalMonths: 12, color: 'warning' },
  'mcs': { name: 'MCS Certification', renewalMonths: 0, color: 'success' },
  'f-gas': { name: 'F-Gas Certificate', renewalMonths: 12, color: 'info' },
  'loler': { name: 'LOLER Certificate', renewalMonths: 12, color: 'error' }
}

// Demo properties
export const demoProperties = []

// Demo tenants
export const demoTenants = []

// Demo maintenance records
export const demoMaintenance = []

// Helper functions
export const getMockProperties = () => {
  return JSON.parse(localStorage.getItem('xperty_properties') || '[]')
}

export const getMockTenants = () => {
  return JSON.parse(localStorage.getItem('xperty_tenants') || '[]')
}

export const getMockMaintenance = () => {
  return JSON.parse(localStorage.getItem('xperty_maintenance') || '[]')
}

export const getAssetsByCategory = (categoryId) => {
  return assetLibrary[categoryId]?.assets || []
}

export const getAllAssets = () => {
  return Object.entries(assetLibrary).flatMap(([categoryId, category]) =>
    category.assets.map(asset => ({ ...asset, categoryId, categoryName: category.name }))
  )
}

export const getComplianceStatus = (expiryDate) => {
  if (!expiryDate) return 'unknown'

  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'expired'
  if (daysUntilExpiry <= 30) return 'expiring-soon'
  if (daysUntilExpiry <= 60) return 'expiring-60'
  return 'valid'
}

export const getComplianceColor = (status) => {
  const colors = {
    'expired': 'error',
    'expiring-soon': 'warning',
    'expiring-60': 'info',
    'valid': 'success',
    'unknown': 'neutral'
  }
  return colors[status] || 'neutral'
}

export default {
  assetLibrary,
  complianceTypes,
  demoProperties,
  demoTenants,
  demoMaintenance,
  postcodeDatabase,
  lookupPostcode,
  getMockProperties,
  getMockTenants,
  getMockMaintenance,
  getAssetsByCategory,
  getAllAssets,
  getComplianceStatus,
  getComplianceColor
}