import { useState, useEffect } from 'react'
import { User, Lock, Bell, Globe, Moon, Sun, Trash2, Save } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../components/shared/Toast'

const SettingsPage = () => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    profile: {
      name: user?.companyName || '',
      email: user?.email || '',
      company: user?.companyName || '',
      phone: ''
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushAlerts: true,
      complianceReminders: true,
      rentReminders: true,
      maintenanceAlerts: true
    },
    preferences: {
      theme: theme,
      dateFormat: 'DD/MM/YYYY',
      currency: 'GBP',
      language: 'en'
    }
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = (section) => {
    localStorage.setItem('userSettings', JSON.stringify(settings))
    toast.success('Settings saved successfully')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[clamp(100%,95vw,1280px)] mx-auto min-w-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-900 mb-2">Settings</h1>
        <p className="text-brand-600">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64">
          <div className="ent-card p-2 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded ${activeTab === tab.id
                      ? 'bg-brand-900 text-white'
                      : 'text-brand-700 hover:bg-brand-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="ent-card p-6">
              <h2 className="text-xl font-semibold text-brand-900 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, name: e.target.value } })}
                    className="ent-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, email: e.target.value } })}
                    className="ent-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={settings.profile.company}
                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, company: e.target.value } })}
                    className="ent-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, phone: e.target.value } })}
                    className="ent-input"
                    placeholder="+44 7700 900000"
                  />
                </div>
                <div className="pt-4">
                  <button onClick={() => handleSave('profile')} className="ent-btn-primary flex items-center gap-2 justify-center">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="ent-card p-6">
              <h2 className="text-xl font-semibold text-brand-900 mb-6">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-brand-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-1">Current Password</label>
                      <input type="password" className="ent-input" placeholder="Enter current password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-1">New Password</label>
                      <input type="password" className="ent-input" placeholder="Enter new password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-1">Confirm New Password</label>
                      <input type="password" className="ent-input" placeholder="Confirm new password" />
                    </div>
                    <button className="ent-btn-primary">Update Password</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-200">
                  <h3 className="font-medium text-brand-900 mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-brand-600 mb-4">Add an extra layer of security to your account</p>
                  <button className="ent-btn-secondary">Enable 2FA</button>
                </div>

                <div className="pt-6 border-t border-brand-200">
                  <h3 className="font-medium text-error mb-2">Danger Zone</h3>
                  <p className="text-sm text-brand-600 mb-4">Permanently delete your account and all data</p>
                  <button className="ent-btn-danger flex items-center gap-2 justify-center">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="ent-card p-6">
              <h2 className="text-xl font-semibold text-brand-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-brand-900 mb-4">Notification Channels</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive notifications via email' },
                      { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive notifications via text message' },
                      { key: 'pushAlerts', label: 'Push Notifications', desc: 'Receive push notifications in browser' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-brand-200 rounded">
                        <div>
                          <div className="font-medium text-brand-900">{item.label}</div>
                          <div className="text-sm text-brand-600">{item.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications[item.key]}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, [item.key]: e.target.checked }
                          })}
                          className="w-4 h-4 border-brand-300 text-primary focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-200">
                  <h3 className="font-medium text-brand-900 mb-4">Alert Types</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'complianceReminders', label: 'Compliance Reminders', desc: 'Certificate expiry notifications' },
                      { key: 'rentReminders', label: 'Rent Reminders', desc: 'Rent payment due dates' },
                      { key: 'maintenanceAlerts', label: 'Maintenance Alerts', desc: 'New maintenance requests' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-brand-200 rounded">
                        <div>
                          <div className="font-medium text-brand-900">{item.label}</div>
                          <div className="text-sm text-brand-600">{item.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.notifications[item.key]}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, [item.key]: e.target.checked }
                          })}
                          className="w-4 h-4 border-brand-300 text-primary focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={() => handleSave('notifications')} className="ent-btn-primary flex items-center gap-2 justify-center">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="ent-card p-6">
              <h2 className="text-xl font-semibold text-brand-900 mb-6">Application Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-3">Theme</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleTheme}
                      className={`flex items-center gap-2 px-4 py-3 border-2 transition-all rounded ${theme === 'light' ? 'border-primary bg-primary-light' : 'border-brand-200'
                        }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={toggleTheme}
                      className={`flex items-center gap-2 px-4 py-3 border-2 transition-all rounded ${theme === 'dark' ? 'border-primary bg-primary-light' : 'border-brand-200'
                        }`}
                    >
                      <Moon className="w-5 h-5" />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Date Format</label>
                  <select
                    value={settings.preferences.dateFormat}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, dateFormat: e.target.value }
                    })}
                    className="ent-select"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Currency</label>
                  <select
                    value={settings.preferences.currency}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, currency: e.target.value }
                    })}
                    className="ent-select"
                  >
                    <option value="GBP">British Pound (£)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-1">Language</label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, language: e.target.value }
                    })}
                    className="ent-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button onClick={() => handleSave('preferences')} className="ent-btn-primary flex items-center gap-2 justify-center">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage