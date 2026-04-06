import { LayoutDashboard, Receipt, Lightbulb, User, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Sidebar() {
  const { user } = useAuthStore()

  const links = [
    { name: 'Overview', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'Transactions', icon: <Receipt size={18} />, path: '/dashboard/transactions' },
    { name: 'Insights', icon: <Lightbulb size={18} />, path: '/dashboard/insights' },
    { name: 'Profile', icon: <User size={18} />, path: '/dashboard/profile' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/dashboard/settings' },
  ]

  return (
    <aside className="position-fixed top-0 start-0 vh-100 bg-dark text-white border-end border-secondary border-opacity-25 overflow-auto" style={{ width: '280px' }}>
      <div className="d-flex align-items-center gap-3 p-4 border-bottom border-secondary border-opacity-25">
        <div className="rounded-4 bg-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: 56, height: 56 }}>
          <span className="fs-4 fw-bold">F</span>
        </div>
        <div>
          <p className="text-uppercase small text-info mb-1">FinTrack</p>
          <p className="h6 mb-0">{user?.name || 'Finance User'}</p>
        </div>
      </div>

      <nav className="nav nav-pills flex-column p-3 gap-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-2 rounded-4 px-3 py-2 ${
                isActive ? 'active bg-primary' : 'text-white text-opacity-75'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 mx-3 rounded-4 bg-secondary bg-opacity-10 border border-secondary border-opacity-25 p-3">
        <p className="uppercase tracking-[0.35em] text-xs text-cyan-300 mb-3">Role</p>
        <p className="font-semibold text-white">{user?.role || 'viewer'}</p>
        <p className="mt-3 leading-6 text-slate-400">Your dashboard content and actions are tailored to this access level.</p>
      </div>
    </aside>
  )
}