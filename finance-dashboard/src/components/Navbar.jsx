import { motion } from 'framer-motion'
import { Moon, Sun, Wallet } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useFinanceStore from '../store/useFinanceStore'

export default function Navbar() {
  const { user } = useAuthStore()
  const { darkMode, toggleDarkMode } = useFinanceStore()

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky-top top-0 bg-white bg-opacity-90 border-bottom border-secondary border-opacity-15 shadow-sm"
    >
      <div className="container-fluid d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 py-3">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary text-white rounded-4 p-3 shadow-sm d-flex align-items-center justify-content-center">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="h5 fw-bold mb-0">FinTrack</h1>
            <p className="mb-0 text-muted small">{user ? `Hello, ${user.name}` : 'Financial insights for every role'}</p>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
        <div className="rounded-4 bg-secondary bg-opacity-10 px-3 py-2 text-dark">
          <p className="text-uppercase small mb-1 text-muted">Role</p>
          <p className="mb-0 fw-semibold">{user?.role || 'Guest'}</p>
        </div>
        <button
          type="button"
          onClick={toggleDarkMode}
          className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 44, height: 44 }}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </motion.header>
  )
}