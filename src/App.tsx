import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { EntryEditor } from './components/EntryEditor'
import { EntryService } from './services/entryService'
import { RegisterForm } from './components/auth/RegisterForm'
import { LoginForm } from './components/auth/LoginForm'
import { LandingPage } from './components/pages/LandingPage'
import { HomePage } from './components/pages/HomePage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { ProfilePage } from './components/pages/ProfilePage'
import { RequestPasswordReset } from './components/auth/RequestPasswordReset'
import { Header } from './components/layout/Header'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/reset-password" element={<RequestPasswordReset />} />

          {/* Protected routes - with header */}
          <Route path="/home" element={
            <ProtectedRoute>
              <>
                <Header />
                <HomePage />
              </>
            </ProtectedRoute>
          } />
          <Route path="/new-entry" element={
            <ProtectedRoute>
              <>
                <Header />
                <EntryEditor 
                  onSave={async (entry) => {
                    await EntryService.saveEntry(entry)
                  }} 
                />
              </>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <>
                <Header />
                <ProfilePage />
              </>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <>
                <Header />
                <AdminDashboard />
              </>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
