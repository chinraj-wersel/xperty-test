import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Auth components
import LandingPage from './pages/LandingPage'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/LoginPage'

// Protected dashboard components
import DashboardLayout from './components/dashboard/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import PropertiesPage from './pages/PropertiesPage'
import Property360View from './components/property/Property360View'
import UnitsPage from './pages/UnitsPage'
import TenantsPage from './pages/TenantsPage'
import MaintenancePage from './pages/MaintenancePage'
import CompliancePage from './pages/CompliancePage'
import DocumentsPage from './pages/DocumentsPage'
import MetersPage from './pages/MetersPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import UsersPage from './pages/UsersPage'

// Property onboarding
import PropertyOnboarding from './components/property/PropertyOnboarding'

// Context providers
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import { ToastProvider } from './components/shared/Toast'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-sm text-brand-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-sm text-brand-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegistrationPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="properties" element={<PropertiesPage />} />
                <Route path="properties/new" element={<PropertyOnboarding />} />
                <Route path="properties/:id" element={<Property360View />} />
                <Route path="units" element={<UnitsPage />} />
                <Route path="tenants" element={<TenantsPage />} />
                <Route path="maintenance" element={<MaintenancePage />} />
                <Route path="compliance" element={<CompliancePage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="meters" element={<MetersPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
