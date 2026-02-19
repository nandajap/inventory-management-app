import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <>
      <MainLayout>
        <h1 className="text-2xl font-bold text-gray-800">Welcome to the Inventory Management System</h1>
        <p className="mt-4 text-gray-600">Use the sidebar to navigate through different sections of the application.</p>
      </MainLayout>
    </>
  )
}

export default App
