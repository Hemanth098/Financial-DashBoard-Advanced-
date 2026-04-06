import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import useFinanceStore from '../store/useFinanceStore'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const { darkMode, toggleDarkMode } = useFinanceStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="container-fluid p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 mt-2">Personalize your experience and account settings.</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-200/70 dark:border-slate-800/70">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <p className="text-slate-500 mb-6">Switch between light and dark themes for a comfortable dashboard experience.</p>
          <button
            onClick={toggleDarkMode}
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-white shadow-lg hover:opacity-95 transition"
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-200/70 dark:border-slate-800/70">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Logged in as</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'Guest'}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>

            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-4">
              <p className="text-sm text-slate-500">Role</p>
              <p className="mt-2 font-semibold text-slate-900 dark:text-slate-100">{user?.role || 'viewer'}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-2xl bg-rose-500 px-5 py-3 text-white hover:bg-rose-400 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
