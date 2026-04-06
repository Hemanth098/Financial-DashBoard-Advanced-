import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import FinFlowSidebar from '../components/FinFlowSidebar'
import FinFlowNavbar from '../components/FinFlowNavbar'

export default function FinFlowLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Overlay for mobile */}
      <div
        className="finflow-overlay"
        id="finflow-overlay"
        onClick={closeSidebar}
        style={{ display: sidebarOpen ? 'block' : 'none' }}
      />

      {/* Sidebar */}
      <FinFlowSidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main */}
      <div className="finflow-main">
        {/* Navbar */}
        <FinFlowNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
