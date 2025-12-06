import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/shared/Toast'
import { Building2, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'

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

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSocialLogin = (provider) => {
    toast.success(`Sign in with ${provider} coming soon!`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Invalid email or password')
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    const result = await login('demo@xperty.com', 'demo123456')

    if (result.success) {
      toast.success('Demo account loaded!')
      navigate('/dashboard')
    } else {
      toast.error('Demo login failed. Please create a demo account first.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="ent-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-900 flex items-center justify-center rounded">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-900">Sign In</h1>
              <p className="text-sm text-brand-600">Welcome back to XPERTY</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="ent-input"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="ent-input pr-10"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 hover:text-brand-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 border-brand-300 text-primary focus:ring-primary" />
                <span className="text-sm text-brand-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="ent-btn-primary w-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>

            {/* <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="ent-btn-secondary w-full"
            >
              Try Demo Account
            </button> */}
          </form>

          <p className="text-xs text-brand-500 text-center mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary hover:underline font-medium"
            >
              Create account
            </button>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-brand-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Login
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Encrypted
          </span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
