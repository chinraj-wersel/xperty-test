import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/shared/Toast'
import {
  Building2, Home, Building, Shield,
  Eye, EyeOff, Lock, ShieldCheck, Award, Loader2
} from 'lucide-react'

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

const MicrosoftIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 23 23">
    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
    <path fill="#f35325" d="M1 1h10v10H1z" />
    <path fill="#81bc06" d="M12 1h10v10H12z" />
    <path fill="#05a6f0" d="M1 12h10v10H1z" />
    <path fill="#ffba08" d="M12 12h10v10H12z" />
  </svg>
)

const RegistrationPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useAuth()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState(null)
  const [showSelector, setShowSelector] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    propertyCount: '1-3'
  })

  const personaData = {
    landlord: {
      icon: Home,
      name: 'Landlord',
      microcopy: 'Manage your properties, tenants, and compliance in one place.'
    },
    enterprise: {
      icon: Building2,
      name: 'SME/Enterprises',
      microcopy: 'Advanced tools for portfolios, teams, and automated workflows.'
    }
  }

  useEffect(() => {
    const personaFromURL = searchParams.get('persona')
    const personaFromStorage = localStorage.getItem('selectedPersona')

    const initialPersona = personaFromURL || personaFromStorage

    if (initialPersona && personaData[initialPersona]) {
      setSelectedPersona(initialPersona)
      setShowSelector(false)
    } else {
      setShowSelector(true)
    }
  }, [searchParams])

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona)
  }

  const handleSocialLogin = (provider) => {
    toast.success(`Sign up with ${provider} coming soon!`)
  }

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0)
      return
    }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (name === 'password') {
      checkPasswordStrength(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (passwordStrength < 2) {
      toast.error('Please choose a stronger password')
      return
    }

    setLoading(true)

    const registrationData = {
      ...formData,
      persona: selectedPersona || 'landlord',
      companyName: selectedPersona === 'landlord' ? 'Individual Landlord' : '',
      confirmPassword: formData.password
    }

    const result = await register(registrationData)

    if (result.success) {
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Registration failed')
      setLoading(false)
    }
  }



  const getStrengthLabel = () => {
    if (formData.password.length === 0) return 'Min. 8 characters with mixed case, numbers & symbols'
    if (passwordStrength <= 2) return 'Weak password'
    if (passwordStrength === 3) return 'Fair password'
    return 'Strong password'
  }

  const getStrengthColor = () => {
    if (formData.password.length === 0) return 'text-brand-500'
    if (passwordStrength <= 2) return 'text-error'
    if (passwordStrength === 3) return 'text-warning'
    return 'text-success'
  }

  const getMeterColor = () => {
    if (passwordStrength <= 2) return 'bg-error'
    if (passwordStrength === 3) return 'bg-warning'
    return 'bg-success'
  }

  return (
    <div className="min-h-screen bg-brand-50 grid-bg text-brand-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-brand-200">
        <div className="max-w-7xl mx-auto px-4 h-12 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-900 flex items-center justify-center">
              <Building2 className="w-3 h-3 text-white" />
            </div>
            <span className="text-lg font-semibold text-brand-900 tracking-tight">XPERTY</span>
          </button>
          <div className="text-sm text-brand-500">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-accent font-medium hover:underline">
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10 px-4">
        <div className="max-w-sm mx-auto">

          {/* Persona Badge (if selected and not showing selector) */}
          {!showSelector && selectedPersona && (
            <div className="mb-6 p-3 bg-white border border-brand-200 flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-100 flex items-center justify-center text-brand-600">
                {(() => {
                  const Icon = personaData[selectedPersona].icon
                  return <Icon className="w-4 h-4" />
                })()}
              </div>
              <div className="flex-1">
                <div className="text-xs text-brand-500 uppercase tracking-wider font-medium">Account Type</div>
                <div className="text-sm font-semibold text-brand-900">{personaData[selectedPersona].name}</div>
              </div>
              <button
                onClick={() => setShowSelector(true)}
                className="text-xs text-accent hover:underline"
              >
                Change
              </button>
            </div>
          )}

          {/* Persona Selector (if showing selector) */}
          {showSelector && (
            <div className="mb-6">
              <label className="block text-xs font-medium text-brand-600 uppercase tracking-wider mb-2">
                Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(personaData).map(([key, data]) => {
                  const Icon = data.icon
                  const isSelected = selectedPersona === key
                  return (
                    <button
                      key={key}
                      onClick={() => handlePersonaSelect(key)}
                      className={`p-3 border text-left transition-colors group ${isSelected
                        ? 'bg-accent-light border-accent'
                        : 'bg-white border-brand-200 hover:border-brand-400'
                        }`}
                    >
                      <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-accent' : 'text-brand-400 group-hover:text-brand-600'
                        }`} />
                      <div className="text-sm font-medium text-brand-800">{data.name}</div>
                      <div className="text-xs text-brand-500 truncate">
                        {key === 'landlord' ? '1-10 properties' : '10+ properties'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Main Form */}
          <div className="bg-white border border-brand-200 shadow-sm">
            <div className="px-6 py-5">
              <h1 className="text-xl font-semibold text-brand-900">Create your account</h1>
              <p className="text-sm text-brand-500 mt-1">Get started in under 2 minutes</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 pt-0">
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors bg-white"
                >
                  <GoogleIcon />
                  <span className="text-sm font-medium text-brand-700">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors bg-white"
                >
                  <MicrosoftIcon />
                  <span className="text-sm font-medium text-brand-700">Microsoft</span>
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-brand-500">Or continue with email</span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-brand-600 uppercase tracking-wider mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="ent-input w-full px-3 py-2 text-sm border border-brand-200 bg-white placeholder-brand-400"
                  placeholder="you@company.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-brand-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="ent-input w-full px-3 py-2 text-sm border border-brand-200 bg-white placeholder-brand-400 pr-10"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-1.5 bg-brand-100 h-0.5 w-full">
                  <div
                    className={`h-full transition-all duration-300 ${getMeterColor()}`}
                    style={{ width: `${Math.min((passwordStrength / 4) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className={`text-xs mt-1 ${getStrengthColor()}`}>
                  {getStrengthLabel()}
                </p>
              </div>

              {/* Property Count */}
              <div>
                <label className="block text-xs font-medium text-brand-600 uppercase tracking-wider mb-1.5">
                  Portfolio Size
                </label>
                <select
                  name="propertyCount"
                  value={formData.propertyCount}
                  onChange={handleChange}
                  className="ent-input w-full px-3 py-2 text-sm border border-brand-200 bg-white"
                >
                  <option value="1-3">1-3 properties</option>
                  <option value="4-10">4-10 properties</option>
                  <option value="11-50">11-50 properties</option>
                  <option value="51-200">51-200 properties</option>
                  <option value="200+">200+ properties</option>
                </select>
              </div>

              {/* Persona Microcopy */}
              {selectedPersona && (
                <div className="p-3 bg-info-light border-l-2 border-info">
                  <p className="text-sm text-brand-700">
                    {personaData[selectedPersona]?.microcopy}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="ent-btn-primary w-full px-4 py-2.5 text-sm text-white font-medium flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
              </button>


            </form>

            {/* Terms */}
            <div className="px-6 py-4 bg-brand-50">
              <p className="text-xs text-brand-500 text-center">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-accent hover:underline">Terms</a> and{' '}
                <a href="#" className="text-accent hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-brand-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              256-bit SSL
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              GDPR Compliant
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              ISO 27001
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RegistrationPage
