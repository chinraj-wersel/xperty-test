// Script to generate all remaining React files for XPERTY

const fs = require('fs');
const path = require('path');

// Helper to create directories
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Helper to write file
const writeFile = (filepath, content) => {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, content);
  console.log(`Created: ${filepath}`);
};

// Registration Page
writeFile('src/pages/RegistrationPage.jsx', `import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/shared/Toast'
import { Building2, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'

const RegistrationPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    propertyCount: '1-5',
    persona: localStorage.getItem('selectedPersona') || 'landlord'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const result = await register(formData)
    
    if (result.success) {
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Registration failed')
      setLoading(false)
    }
  }

  const handleDemoData = async () => {
    setLoading(true)
    const demoData = { ...formData, email: 'demo@xperty.com', password: 'demo123', isDemo: true }
    const result = await register(demoData)
    
    if (result.success) {
      toast.success('Demo environment loaded!')
      navigate('/dashboard')
    } else {
      toast.error('Failed to load demo')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-900 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-900">Create Account</h1>
              <p className="text-sm text-brand-600">Start your 14-day free trial</p>
            </div>
          </div>

          {formData.persona && (
            <div className="mb-6 p-3 bg-brand-100 border border-brand-200">
              <div className="text-xs text-brand-600 uppercase tracking-wide mb-1">Account Type</div>
              <div className="font-semibold text-brand-900">{formData.persona === 'landlord' ? 'Landlords' : 'Enterprise'}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required
                className="ent-input" placeholder="you@company.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Company/Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                className="ent-input" placeholder="Your company name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} 
                  onChange={handleChange} required className="ent-input pr-10" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} 
                onChange={handleChange} required className="ent-input" placeholder="Re-enter password" />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Number of Properties</label>
              <select name="propertyCount" value={formData.propertyCount} onChange={handleChange} className="ent-select">
                <option value="1-5">1-5 properties</option>
                <option value="6-10">6-10 properties</option>
                <option value="11-50">11-50 properties</option>
                <option value="51-100">51-100 properties</option>
                <option value="100+">100+ properties</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="ent-btn-primary w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Create Account'}
            </button>

            <button type="button" onClick={handleDemoData} disabled={loading} className="ent-btn-secondary w-full">
              Use Demo Environment
            </button>
          </form>

          <p className="text-xs text-brand-500 text-center mt-6">
            Already have an account? <button onClick={() => navigate('/login')} className="text-primary hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage
`);

console.log('All critical files created successfully!');
