import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { promptPWAInstall, isRunningAsPWA } from '../../utils/pwaUtils'

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (isRunningAsPWA()) {
      setIsInstalled(true)
      return
    }

    // Listen for PWA installable event
    const handleInstallable = (event) => {
      if (event.detail.canInstall) {
        // Don't show immediately, wait a bit for user to explore
        setTimeout(() => {
          setShowPrompt(true)
        }, 30000) // Show after 30 seconds
      } else {
        setShowPrompt(false)
      }
    }

    window.addEventListener('pwa-installable', handleInstallable)

    // Check localStorage for previous dismissal
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    const dismissedTime = dismissed ? parseInt(dismissed) : 0
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
    
    // Don't show if dismissed within last 7 days
    if (daysSinceDismissed < 7) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable)
    }
  }, [])

  const handleInstall = async () => {
    const installed = await promptPWAInstall()
    
    if (installed) {
      setShowPrompt(false)
      setIsInstalled(true)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-slide-in-up">
      <div className="bg-white border border-brand-200 shadow-ent-lg p-6">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 text-brand-400 hover:text-brand-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-brand-900 mb-1">
              Install XPERTY App
            </h3>
            <p className="text-sm text-brand-600 mb-4">
              Get faster access and work offline with the XPERTY app
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-brand-700">
                <div className="w-1.5 h-1.5 bg-success rounded-full" />
                <span>Instant access from home screen</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-700">
                <div className="w-1.5 h-1.5 bg-success rounded-full" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-700">
                <div className="w-1.5 h-1.5 bg-success rounded-full" />
                <span>Faster loading</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 ent-btn-primary text-sm py-2 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="ent-btn-ghost text-sm py-2 px-4"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt