import { TopNavbar } from './components/layout/TopNavbar'

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          ✅ TopNavbar is working!
        </h1>
        <p className="text-gray-600 mt-2">
          You should see a white navbar at the top with logo and user info
        </p>
      </div>
    </div>
    </>
  )
}

export default App
