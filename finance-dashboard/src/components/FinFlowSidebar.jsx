import { LayoutDashboard, Lightbulb, Receipt, Settings, TrendingUp } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function FinFlowSidebar({ open, onClose }) {
  const { user } = useAuthStore()

  const navItems = [
    { label: 'OVERVIEW', items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Insights', icon: Lightbulb, path: '/dashboard/insights' },
    ]},
    { label: 'ACTIVITY', items: [
      { name: 'Transactions', icon: Receipt, path: '/dashboard/transactions' },
    ]},
  ]

  return (
    <aside className={`finflow-sidebar ${open ? 'open' : ''}`}>
      {/* Logo */}
      <div className="finflow-sidebar-logo">
        <div className="finflow-logo-mark">
          <TrendingUp size={22} />
        </div>
        <span className="finflow-logo-text">FinFlow</span>
      </div>

      {/* Navigation */}
      {navItems.map((section, idx) => (
        <div key={idx} className="finflow-nav-section">
          <div className="finflow-nav-label">{section.label}</div>
          {section.items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `finflow-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </div>
      ))}

      {/* Bottom */}
      <div className="finflow-sidebar-bottom">
        <NavLink
          to="/dashboard/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `finflow-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}
