import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Building2, Users, Wrench, FileCheck, MessageCircle } from 'lucide-react'

const MobileBottomNav = ({ onChatToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Home',
      exact: true
    },
    {
      path: '/dashboard/properties',
      icon: Building2,
      label: 'Properties'
    },
    {
      path: 'chat', // Virtual path for identification
      icon: MessageCircle,
      label: 'Chat',
      isAction: true
    },
    {
      path: '/dashboard/tenants',
      icon: Users,
      label: 'Tenants'
    },
    {
      path: '/dashboard/maintenance',
      icon: Wrench,
      label: 'Tasks'
    }
  ]

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 safe-bottom z-40">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)

            if (item.isAction) {
              // Special styling for the "Chat" button
              return (
                <button
                  key={item.label}
                  onClick={onChatToggle}
                  className="flex-1 flex flex-col items-center justify-center py-2 relative"
                >
                  <div className="w-12 h-12 -mt-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-medium text-primary mt-1">
                    {item.label}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 transition-colors ${active
                    ? 'text-primary'
                    : 'text-brand-600 active:text-primary'
                  }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${active ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Spacer for bottom navigation - prevents content from being hidden */}
      <div className="md:hidden h-16" />
    </>
  )
}

export default MobileBottomNav