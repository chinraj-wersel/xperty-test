import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem('userData')
      const authToken = localStorage.getItem('authToken')

      if (userData && authToken) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      // In production, this would be an API call
      // For now, we'll simulate authentication
      const userData = localStorage.getItem('userData')
      
      if (userData) {
        const user = JSON.parse(userData)
        
        // Simulate password check (in production, never do this client-side!)
        if (user.email === email) {
          const token = btoa(`${email}:${Date.now()}`) // Simple token generation
          localStorage.setItem('authToken', token)
          setUser(user)
          setIsAuthenticated(true)
          return { success: true, user }
        }
      }
      
      throw new Error('Invalid credentials')
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    try {
      // In production, this would be an API call
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }

      // Generate auth token
      const token = btoa(`${userData.email}:${Date.now()}`)
      
      // Store user data and token
      localStorage.setItem('userData', JSON.stringify(newUser))
      localStorage.setItem('authToken', token)
      
      setUser(newUser)
      setIsAuthenticated(true)
      
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('userData')
    localStorage.removeItem('authToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
