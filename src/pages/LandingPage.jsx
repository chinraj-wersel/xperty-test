import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Users, Shield, BarChart3, FileCheck, Clock, CheckCircle, ArrowRight, Menu, X,
  Zap, TrendingUp, Bell, Database, Lock, Cloud, Smartphone, Globe, Star, ChevronDown,
  FileText, Home, Wrench, DollarSign, Calendar, MessageSquare
} from 'lucide-react'
import heroImage from '../assets/hero-image.png'

const LandingPage = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(null)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-brand-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-900 flex items-center justify-center rounded">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-brand-900 tracking-tight">XPERTY</span>
                <p className="text-xs text-brand-500 uppercase tracking-wide font-medium">Property Management Platform</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-brand-600 hover:text-brand-900 transition-colors">FAQ</a>
              <button onClick={() => navigate('/login')} className="ent-btn-ghost">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="ent-btn-primary">
                Start Free Trial
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-brand-600">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm font-medium text-brand-700 py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="block text-sm font-medium text-brand-700 py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#pricing" className="block text-sm font-medium text-brand-700 py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" className="block text-sm font-medium text-brand-700 py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <div className="pt-3 space-y-2">
                <button onClick={() => navigate('/login')} className="block w-full ent-btn-secondary">Sign In</button>
                <button onClick={() => navigate('/register')} className="block w-full ent-btn-primary">Start Free Trial</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Xperty Dashboard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/80 via-brand-900/70 to-brand-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded text-white text-sm font-medium mb-8 border border-white/20 animate-fade-in-up">
            <Star className="w-4 h-4 text-warning" />
            <span>Trusted by 5,000+ UK Landlords & Property Managers</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight animate-fade-in-up delay-100">
            Property Management<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white">Made Simple</span>
          </h1>

          <p className="text-xl text-brand-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Professional property management software designed for UK landlords and institutions.
            Manage properties, tenants, compliance, and finances—all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in-up delay-300">
            <button onClick={() => navigate('/register')} className="ent-btn-accent text-lg px-8 py-4 h-auto shadow-lg shadow-accent/25 w-full sm:w-auto flex items-center justify-center gap-2">
              Start Your 14-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/register')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-lg px-8 py-4 h-auto rounded font-semibold transition-all w-full sm:w-auto">
              Schedule a Demo
            </button>
          </div>

          <p className="text-sm text-brand-300 mb-16 animate-fade-in-up delay-400">
            No credit card required • Cancel anytime • UK-based support
          </p>

          {/* Trust Badges */}
          <div className="pt-12 border-t border-white/10 animate-fade-in-up delay-500">
            <p className="text-center text-sm text-brand-300 mb-8 uppercase tracking-wider font-medium">Trusted and certified by leading organisations</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-brand-200">
              <div className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
                <span>SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
                <span>ISO 27001</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors">
                <Shield className="w-6 h-6" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors">
                <Lock className="w-6 h-6" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
                <span>UK Data Centers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-brand-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-brand-300">Properties Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-brand-300">Uptime SLA</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-brand-300">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-brand-900 mb-4">Why Choose XPERTY?</h2>
            <p className="text-xl text-brand-600 max-w-3xl mx-auto">
              Save time, reduce costs, and stay compliant with the UK's most comprehensive property management platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <BenefitCard
              icon={<Clock className="w-8 h-8" />}
              title="Save 20+ Hours Per Month"
              description="Automate repetitive tasks like rent collection tracking, compliance reminders, and tenant communications. Focus on growing your portfolio, not paperwork."
              stats="Average time saved: 4.5 hours per week"
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8" />}
              title="Stay 100% Compliant"
              description="Never miss a Gas Safety, EICR, or EPC renewal. Automated reminders and digital certificate storage keep you legally protected at all times."
              stats="Zero compliance violations reported"
            />
            <BenefitCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Increase Revenue by 15%"
              description="Reduce void periods with efficient tenant management. Track rent payments, identify arrears early, and optimise your property portfolio performance."
              stats="Average revenue increase: £3,600/year"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-900 mb-4">Everything You Need in One Platform</h2>
            <p className="text-xl text-brand-600 max-w-3xl mx-auto">
              Comprehensive tools designed specifically for UK property management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Building2 className="w-6 h-6" />}
              title="Property Management"
              features={[
                'Unlimited properties & units',
                'Property 360° view with full history',
                'Digital document vault',
                'Asset & appliance tracking',
                'Postcode lookup integration'
              ]}
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Tenant Management"
              features={[
                'Complete tenant profiles',
                'AST contract management',
                'Right to Rent checks',
                'Deposit protection tracking',
                'Automated communications'
              ]}
            />
            <FeatureCard
              icon={<FileCheck className="w-6 h-6" />}
              title="Compliance Automation"
              features={[
                'Gas Safety certificates',
                'EICR electrical inspections',
                'EPC energy performance',
                'Fire safety documentation',
                'Automated renewal reminders'
              ]}
            />
            <FeatureCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Financial Management"
              features={[
                'Rent collection tracking',
                'Arrears management',
                'Expense tracking',
                'Financial reporting',
                'Integration with Xero & Sage'
              ]}
            />
            <FeatureCard
              icon={<Wrench className="w-6 h-6" />}
              title="Maintenance Management"
              features={[
                'Tenant request portal',
                'Contractor management',
                'Work order tracking',
                'Maintenance history',
                'Cost analysis'
              ]}
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Analytics & Reporting"
              features={[
                'Portfolio performance metrics',
                'Occupancy rate tracking',
                'Custom report builder',
                'Financial dashboards',
                'Export to Excel/PDF'
              ]}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-brand-900 mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-brand-600 max-w-3xl mx-auto">
              Our streamlined onboarding process gets you up and running quickly
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Create Your Account"
              description="Sign up in 60 seconds with just your email. No credit card required for the 14-day free trial."
            />
            <StepCard
              number="2"
              title="Add Your Properties"
              description="Use our UK postcode lookup to quickly add properties. Upload documents and set up compliance tracking."
            />
            <StepCard
              number="3"
              title="Onboard Your Tenants"
              description="Import existing tenants or add new ones. Set up automatic rent tracking and communications."
            />
            <StepCard
              number="4"
              title="Automate & Relax"
              description="Let XPERTY handle reminders, tracking, and reporting while you focus on growing your portfolio."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-900 mb-4">Transparent Pricing for Every Portfolio Size</h2>
            <p className="text-xl text-brand-600 max-w-3xl mx-auto">
              No hidden fees. No surprises. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Landlord Plan */}
            <div className="ent-card p-8 hover:shadow-ent-lg transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-brand-900 mb-2">Landlord</h3>
                <p className="text-sm text-brand-600">Perfect for individual landlords</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-brand-900">£29</span>
                  <span className="text-brand-600">/month</span>
                </div>
                <p className="text-sm text-brand-600 mt-2">Up to 10 properties</p>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature text="Unlimited tenants" />
                <PricingFeature text="Property & tenant management" />
                <PricingFeature text="Compliance automation" />
                <PricingFeature text="Document vault (10GB)" />
                <PricingFeature text="Maintenance tracking" />
                <PricingFeature text="Mobile app access" />
                <PricingFeature text="Email support" />
              </ul>
              <button onClick={() => navigate('/register')} className="ent-btn-primary w-full">
                Start Free Trial
              </button>
            </div>

            {/* Professional Plan */}
            <div className="ent-card p-8 ring-2 ring-primary relative hover:shadow-ent-lg transition-all">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-accent text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">MOST POPULAR</span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-brand-900 mb-2">Professional</h3>
                <p className="text-sm text-brand-600">For growing portfolios</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-brand-900">£79</span>
                  <span className="text-brand-600">/month</span>
                </div>
                <p className="text-sm text-brand-600 mt-2">Up to 50 properties</p>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature text="Everything in Landlord, plus:" />
                <PricingFeature text="Advanced analytics & reporting" />
                <PricingFeature text="Multi-user access (3 users)" />
                <PricingFeature text="Document vault (50GB)" />
                <PricingFeature text="API integrations (Xero, Sage)" />
                <PricingFeature text="Priority email & phone support" />
                <PricingFeature text="Onboarding assistance" />
              </ul>
              <button onClick={() => navigate('/register')} className="ent-btn-primary w-full">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="ent-card p-8 hover:shadow-ent-lg transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-brand-900 mb-2">Enterprise</h3>
                <p className="text-sm text-brand-600">For institutions & agencies</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-brand-900">Custom</span>
                </div>
                <p className="text-sm text-brand-600 mt-2">Unlimited properties</p>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature text="Everything in Professional, plus:" />
                <PricingFeature text="Unlimited users & properties" />
                <PricingFeature text="Custom workflows & automation" />
                <PricingFeature text="Unlimited storage" />
                <PricingFeature text="Dedicated account manager" />
                <PricingFeature text="24/7 priority support with SLA" />
                <PricingFeature text="White-label options" />
                <PricingFeature text="Custom integrations" />
              </ul>
              <button onClick={() => navigate('/register')} className="ent-btn-secondary w-full">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-brand-600">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-brand-600">
              Everything you need to know about XPERTY
            </p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Is my data secure?"
              answer="Absolutely. We use 256-bit encryption, store all data in UK-based data centers, and are SOC 2 Type II and ISO 27001 certified. We're fully GDPR compliant and never share your data with third parties."
              isOpen={faqOpen === 0}
              onClick={() => setFaqOpen(faqOpen === 0 ? null : 0)}
            />
            <FAQItem
              question="Can I try XPERTY before committing?"
              answer="Yes! We offer a 14-day free trial with full access to all features. No credit card required. You can explore the platform risk-free before deciding."
              isOpen={faqOpen === 1}
              onClick={() => setFaqOpen(faqOpen === 1 ? null : 1)}
            />
            <FAQItem
              question="What happens to my data if I cancel?"
              answer="You retain full ownership of your data. Before cancellation, you can export all your information (properties, tenants, documents, reports) in standard formats. We'll keep your data for 30 days after cancellation in case you change your mind."
              isOpen={faqOpen === 2}
              onClick={() => setFaqOpen(faqOpen === 2 ? null : 2)}
            />
            <FAQItem
              question="Do you integrate with accounting software?"
              answer="Yes, we integrate with Xero, Sage, and QuickBooks. Financial data syncs automatically, eliminating double-entry and ensuring your accounts are always up to date."
              isOpen={faqOpen === 3}
              onClick={() => setFaqOpen(faqOpen === 3 ? null : 3)}
            />
            <FAQItem
              question="Is XPERTY suitable for commercial properties?"
              answer="Yes! XPERTY supports both residential and commercial property management. You can manage offices, retail spaces, HMOs, and mixed-use buildings all within the same platform."
              isOpen={faqOpen === 4}
              onClick={() => setFaqOpen(faqOpen === 4 ? null : 4)}
            />
            <FAQItem
              question="What support do you offer?"
              answer="We offer email support for all users, with response times under 24 hours. Professional and Enterprise plans include priority phone support. Enterprise customers get a dedicated account manager and 24/7 support with guaranteed SLAs."
              isOpen={faqOpen === 5}
              onClick={() => setFaqOpen(faqOpen === 5 ? null : 5)}
            />
            <FAQItem
              question="Can I import data from my existing system?"
              answer="Yes, we provide free data migration assistance. Our team will help you import properties, tenants, documents, and other data from spreadsheets or other property management systems."
              isOpen={faqOpen === 6}
              onClick={() => setFaqOpen(faqOpen === 6 ? null : 6)}
            />
            <FAQItem
              question="Is there a mobile app?"
              answer="Yes, XPERTY has mobile apps for iOS and Android. Manage properties, respond to tenant requests, and access documents on the go. All data syncs in real-time across devices."
              isOpen={faqOpen === 7}
              onClick={() => setFaqOpen(faqOpen === 7 ? null : 7)}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Property Management?</h2>
          <p className="text-xl text-brand-300 mb-8">
            Join 5,000+ UK landlords and property managers who trust XPERTY
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/register')} className="bg-white text-brand-900 px-8 py-4 text-lg font-medium hover:bg-brand-50 transition-colors w-full sm:w-auto">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <button onClick={() => navigate('/register')} className="border-2 border-white text-white px-8 py-4 text-lg font-medium hover:bg-white/10 transition-colors w-full sm:w-auto">
              Schedule a Demo
            </button>
          </div>
          <p className="text-sm text-brand-400 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-300 border-t border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-brand-900" />
                </div>
                <span className="text-lg font-bold text-white">XPERTY</span>
              </div>
              <p className="text-sm">
                Professional property management software for UK landlords and institutions.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile Apps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-brand-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © 2026 XPERTY Property Management Ltd. All rights reserved. Registered in England & Wales.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">X (Twitter)</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component Definitions
const BenefitCard = ({ icon, title, description, stats }) => (
  <div className="ent-card p-8 hover:shadow-md transition-all group">
    <div className="w-16 h-16 bg-accent-light text-accent flex items-center justify-center mb-6 rounded group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-brand-900 mb-3">{title}</h3>
    <p className="text-brand-600 mb-4 leading-relaxed">{description}</p>
    <div className="pt-4 border-t border-brand-100">
      <p className="text-sm font-semibold text-accent">{stats}</p>
    </div>
  </div>
)

const FeatureCard = ({ icon, title, features }) => (
  <div className="ent-card p-6 hover:shadow-md transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-brand-100 flex items-center justify-center text-brand-600 rounded">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-brand-900">{title}</h3>
    </div>
    <ul className="space-y-2">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-2 text-sm text-brand-600">
          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
)

const StepCard = ({ number, title, description }) => (
  <div className="text-center group">
    <div className="w-16 h-16 bg-brand-900 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 rounded shadow-lg group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <h3 className="text-lg font-bold text-brand-900 mb-2">{title}</h3>
    <p className="text-brand-600 text-sm leading-relaxed">{description}</p>
  </div>
)

const PricingFeature = ({ text }) => (
  <li className="flex items-start gap-2 text-sm text-brand-700">
    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
    <span>{text}</span>
  </li>
)

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="ent-card overflow-hidden">
    <button
      onClick={onClick}
      className="w-full p-6 text-left flex items-center justify-between hover:bg-brand-50 transition-colors"
    >
      <h3 className="text-lg font-semibold text-brand-900 pr-4">{question}</h3>
      <ChevronDown className={`w-5 h-5 text-brand-600 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="px-6 pb-6">
        <p className="text-brand-700">{answer}</p>
      </div>
    )}
  </div>
)

export default LandingPage