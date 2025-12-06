#!/bin/bash

# This script creates all remaining React component files for the XPERTY application

# Create Landing Page
cat > src/pages/LandingPage.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, Shield, BarChart3, FileCheck, Clock, CheckCircle, ArrowRight, Menu, X } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const [selectedPersona, setSelectedPersona] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const personas = {
    landlord: {
      icon: <Building2 className="w-6 h-6" />,
      name: 'Landlords',
      title: 'Property Management for Landlords',
      subtitle: 'Manage 1-50 properties with ease',
      description: 'Perfect for individual landlords and small portfolio owners who need professional property management tools.',
      features: [
        'Easy property onboarding',
        'Tenant management & AST tracking',
        'Compliance automation (Gas Safety, EICR, EPC)',
        'Rent collection tracking',
        'Maintenance request management',
        'Document vault',
        'Mobile app access'
      ],
      pricing: 'From £29/month',
      cta: 'Start Free Trial'
    },
    enterprise: {
      icon: <Users className="w-6 h-6" />,
      name: 'Enterprise',
      title: 'Enterprise Property Operations',
      subtitle: 'Scale to 50+ properties and beyond',
      description: 'Built for property managers, institutions, and organizations managing large portfolios with advanced needs.',
      features: [
        'Unlimited properties & units',
        'Multi-user access & permissions',
        'Advanced analytics & reporting',
        'API integrations (Xero, Sage, Salesforce)',
        'Custom workflows & automation',
        'Dedicated account manager',
        'Priority support & SLA'
      ],
      pricing: 'Custom pricing',
      cta: 'Schedule Demo'
    }
  }

  const handlePersonaSelect = (personaKey) => {
    setSelectedPersona(personaKey)
    localStorage.setItem('selectedPersona', personaKey)
    setTimeout(() => {
      navigate('/register')
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-brand-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-900 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-900">XPERTY</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-brand-600 hover:text-brand-900 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-brand-600 hover:text-brand-900 transition-colors">Pricing</a>
              <button onClick={() => navigate('/login')} className="text-sm text-brand-600 hover:text-brand-900 transition-colors">
                Sign In
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-brand-600">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm text-brand-600 py-2">Features</a>
              <a href="#pricing" className="block text-sm text-brand-600 py-2">Pricing</a>
              <button onClick={() => navigate('/login')} className="block w-full text-left text-sm text-brand-600 py-2">
                Sign In
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-brand-900 mb-4">Enterprise Property Management</h1>
          <p className="text-lg text-brand-600 max-w-2xl mx-auto mb-12">
            Comprehensive property and asset management platform trusted by landlords and institutions across the UK.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-brand-500 mb-16">
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /><span>SOC 2 Certified</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /><span>GDPR Compliant</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4" /><span>ISO 27001</span></div>
          </div>

          {/* Persona Cards */}
          <div id="pricing" className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {Object.entries(personas).map(([key, persona]) => (
              <div
                key={key}
                className={`ent-card-hover p-8 text-left transition-all duration-300 cursor-pointer ${
                  selectedPersona === key ? 'ring-2 ring-primary scale-105' : ''
                }`}
                onClick={() => handlePersonaSelect(key)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-100 flex items-center justify-center text-brand-900">{persona.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-900">{persona.name}</h3>
                    <p className="text-sm text-brand-600">{persona.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-brand-600 mb-6">{persona.description}</p>

                <ul className="space-y-3 mb-6">
                  {persona.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-brand-700">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-brand-200 pt-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-brand-900">{persona.pricing}</span>
                    <span className="text-sm text-brand-600">14-day free trial</span>
                  </div>
                  <button className="ent-btn-primary w-full group">
                    {persona.cta}
                    <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-brand-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-900 mb-3">Everything You Need</h2>
            <p className="text-lg text-brand-600">Comprehensive property management tools in one platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<FileCheck className="w-6 h-6" />} title="Compliance Automation" 
              description="Automated reminders for Gas Safety, EICR, EPC, and other certificates. Never miss a renewal deadline." />
            <FeatureCard icon={<BarChart3 className="w-6 h-6" />} title="Real-time Analytics"
              description="Portfolio performance insights, rent collection metrics, and customizable reports." />
            <FeatureCard icon={<Clock className="w-6 h-6" />} title="Time Savings"
              description="Turn 4-hour emergency responses into 5-minute tasks with smart automation." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-brand-900 text-brand-400">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-900" />
            </div>
            <span className="text-lg font-bold text-white">XPERTY</span>
          </div>
          <p className="text-sm mb-8">© 2025 XPERTY Property Management. All rights reserved.</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 border border-brand-200 hover:border-brand-300 transition-colors">
    <div className="w-12 h-12 bg-primary-light text-primary flex items-center justify-center mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-brand-900 mb-2">{title}</h3>
    <p className="text-sm text-brand-600">{description}</p>
  </div>
)

export default LandingPage
EOF

echo "Created Landing Page"

# Now create all other essential files...
# Due to space, continuing with command generation for remaining files

