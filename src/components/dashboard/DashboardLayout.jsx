import { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Building2, Home, Users, Wrench, FileCheck, FileText,
  Zap, BarChart3, Settings, LogOut, Menu, X, Bell,
  Search, ChevronDown, User
} from 'lucide-react'
import MobileBottomNav from '../navigation/MobileBottomNav'
import ChatAssistant from '../ai/ChatAssistant'

const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const profileMenuRef = useRef(null)

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Properties', path: '/dashboard/properties', icon: Building2 },
    { name: 'Units', path: '/dashboard/units', icon: Building2 },
    { name: 'Tenants', path: '/dashboard/tenants', icon: Users },
    { name: 'Maintenance', path: '/dashboard/maintenance', icon: Wrench },
    { name: 'Compliance', path: '/dashboard/compliance', icon: FileCheck },
    { name: 'Documents', path: '/dashboard/documents', icon: FileText },
    { name: 'Meters', path: '/dashboard/meters', icon: Zap },
    { name: 'Reports', path: '/dashboard/reports', icon: BarChart3 },
    { name: 'Users', path: '/dashboard/users', icon: Users }
  ]

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setProfileMenuOpen(false)
    logout()
    navigate('/login')
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const getUserDisplayName = () => {
    if (user?.companyName) return user.companyName
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
    if (user?.firstName) return user.firstName
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    }
    if (user?.companyName) {
      return user.companyName.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="min-h-screen bg-brand-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-56 bg-brand-900 border-r border-brand-800 h-screen fixed left-0 top-0">
        <div className="flex items-center gap-2 p-6 border-b border-brand-800 h-14">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
            <Building2 className="w-5 h-5 text-brand-900" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">XPERTY</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded ${active
                  ? 'bg-brand-700 text-white'
                  : 'text-brand-400 hover:bg-brand-800 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Settings Only - No Logout Here */}
        <div className="p-4 border-t border-brand-800">
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-brand-900/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-brand-200 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-brand-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-900 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-brand-900">XPERTY</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-brand-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${active
                      ? 'bg-brand-900 text-white'
                      : 'text-brand-700 hover:bg-brand-100'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </nav>

            {/* Mobile Sidebar Footer - Settings Only */}
            <div className="p-4 border-t border-brand-200">
              <button
                onClick={() => {
                  navigate('/dashboard/settings')
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-56">
        {/* Header */}
        <header className="bg-white border-b border-brand-200 sticky top-0 z-30 h-14">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-brand-600 hover:text-brand-900"
              >
                <Menu className="w-5 h-5" />
              </button>


            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-brand-600 hover:text-brand-900 hover:bg-brand-50 rounded transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-brand-50 transition-colors rounded"
                >
                  <div className="w-7 h-7 bg-brand-900 text-white flex items-center justify-center text-xs font-medium rounded">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-brand-900">
                    {user?.companyName || user?.email || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-brand-600 hidden sm:block transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-brand-200 shadow-lg rounded z-50">
                    {/* User Info */}
                    <div className="p-4 border-b border-brand-100 bg-brand-50/50">
                      <p className="text-sm font-semibold text-brand-900 truncate">{getUserDisplayName()}</p>
                      <p className="text-xs text-brand-500 truncate">{user?.email}</p>
                      {user?.userType && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-primary-light text-primary rounded border border-primary/20">
                          {user.userType === 'enterprise' ? 'Enterprise' : 'Landlord'}
                        </span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false)
                          navigate('/dashboard/settings')
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false)
                          navigate('/dashboard/settings')
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Account Settings</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-brand-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error-light transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav onChatToggle={() => setChatOpen(!chatOpen)} />

        {/* AI Chat Assistant */}
        <ChatAssistant isOpen={chatOpen} onToggle={setChatOpen} />
      </div >
    </div >
  )
}

export default DashboardLayout