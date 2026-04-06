import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function DashboardLayout() {
  return (
    <div className="min-vh-100 d-flex bg-light text-dark">
      <Sidebar />

      <div className="flex-grow-1" style={{ minHeight: '100vh', marginLeft: '280px' }}>
        <Navbar />
        <main className="container-fluid py-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
