import MainLayout from './components/layout/MainLayout'
import { AuthProvider } from './contexts/AuthContext'
import Inventory from './pages/Inventory'

function App() {
  return (
    <>
      <AuthProvider>
        <MainLayout>
          <Inventory />
        </MainLayout>
      </AuthProvider>
    </>
  )
}

export default App
