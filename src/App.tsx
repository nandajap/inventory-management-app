import MainLayout from './components/layout/MainLayout'
import { AuthProvider } from './contexts/AuthContext'
import Inventory from './pages/Inventory'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Login } from './pages/Login';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            {/* Default redirect to inventory */}
            <Route index element={<Navigate to="/inventory" replace />} />

            {/* Protected pages */}
            <Route path="inventory" element={<Inventory />} />
            {/* Future routes - currently redirect to inventory */}
            <Route path="dashboard" element={<Navigate to="/inventory" replace />} />
            <Route path="orders" element={<Navigate to="/inventory" replace />} />
            <Route path="suppliers" element={<Navigate to="/inventory" replace />} />
            <Route path="reports" element={<Navigate to="/inventory" replace />} />

          </Route>
          <Route path="*" element={<Navigate to="/inventory" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
