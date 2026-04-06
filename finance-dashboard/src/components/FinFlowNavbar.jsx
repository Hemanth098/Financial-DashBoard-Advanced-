import { Moon, Sun, Search, Menu } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useFinanceStore from '../store/useFinanceStore'

export default function FinFlowNavbar({ onMenuClick }) {
  const { user, setRole, logout } = useAuthStore()
  const { darkMode, toggleDarkMode } = useFinanceStore()

  const handleRoleChange = (e) => {
    setRole(e.target.value)
  }

  return (
    <header className="finflow-topbar">
      <button
        onClick={onMenuClick}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
          padding: '4px 8px',
          display: 'none',
        }}
        className="d-lg-none"
      >
        <Menu size={20} />
      </button>

      <span className="finflow-topbar-title">Dashboard</span>

      <div className="finflow-topbar-search">
        <span className="finflow-search-icon">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search transactions..."
        />
      </div>

      <div className="finflow-role-badge">
        <div className={`finflow-role-dot ${user?.role === 'admin' ? 'admin' : ''}`} />
        <select
          value={user?.role || 'viewer'}
          onChange={handleRoleChange}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text)',
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            paddingRight: '14px',
          }}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        onClick={() => {
          toggleDarkMode()
        }}
        className="finflow-theme-btn"
        title="Toggle theme"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
