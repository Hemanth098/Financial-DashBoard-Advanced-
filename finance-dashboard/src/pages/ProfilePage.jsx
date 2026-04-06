import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Mail, ShieldCheck, UserCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <div className="container-fluid p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-600 to-indigo-700 p-8 shadow-2xl text-white overflow-hidden relative">
        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/80">Profile</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Your account details</h1>
          <p className="mt-4 max-w-2xl text-slate-200/90">This profile page shows your role-based access and the data connected to your JSON-backed user account.</p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-lg">
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">{user.role}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-6">
              <div className="flex items-center gap-3 text-slate-500 mb-3">
                <Mail size={18} />
                <span className="font-semibold">Email</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200">{user.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-950 p-6">
              <div className="flex items-center gap-3 text-slate-500 mb-3">
                <ShieldCheck size={18} />
                <span className="font-semibold">Access Level</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200">{user.role === 'admin' ? 'Full access' : user.role === 'manager' ? 'Manager access' : 'Viewer access'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg border border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center gap-3 text-cyan-500 mb-6">
            <Briefcase size={20} />
            <h2 className="text-2xl font-bold">Account summary</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-300 leading-7">You are logged in with user-specific data sourced from users.json. This ensures the dashboard only shows data assigned to your account.</p>

          <div className="mt-8 space-y-4 rounded-3xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950 p-5">
            <div className="flex items-center gap-3 text-slate-500">
              <UserCircle2 size={18} />
              <span>Role-based dashboard access</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <ShieldCheck size={18} />
              <span>Protected routes and secure login</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
