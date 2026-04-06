import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function LoginPage() {
  const { user, login } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    const success = login(email, password)

    if (success) {
      navigate('/dashboard')
    } else {
      setError('Invalid credentials. Try admin@finance.com or viewer@finance.com with password 123456.')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white py-5">
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'radial-gradient(circle at 10% 20%, rgba(56,189,248,0.14), transparent 20%), radial-gradient(circle at 90% 85%, rgba(168,85,247,0.12), transparent 18%)', pointerEvents: 'none' }} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} className="position-relative container rounded-4 bg-body-tertiary bg-opacity-75 border border-light border-opacity-10 shadow-lg p-4 p-lg-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <p className="text-uppercase text-info small mb-3">Secure finance login</p>
            <h1 className="display-6 fw-bold">Welcome back — login to see your personalized dashboard.</h1>
            <p className="text-muted mt-3">Your transactions, role-based access, and insights are filtered for your account only.</p>
            <div className="row row-cols-1 row-cols-md-2 g-3 mt-4">
              {[
                { role: 'Admin', email: 'admin@finance.com' },
                { role: 'Viewer', email: 'viewer@finance.com' },
              ].map((item) => (
                <div className="col" key={item.role}>
                  <div className="card bg-dark border-secondary border-opacity-25 text-white h-100">
                    <div className="card-body">
                      <p className="text-uppercase text-muted small mb-2">{item.role}</p>
                      <p className="h6 mb-1">{item.email}</p>
                      <p className="text-muted mb-0">123456</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h2 className="card-title">Sign in</h2>
                <p className="text-muted mb-4">Enter your email and password to continue.</p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      placeholder="admin@finance.com"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className="form-control form-control-lg bg-dark text-white border-secondary"
                      placeholder="123456"
                      required
                    />
                  </div>

                  {error && <div className="mb-3 text-danger small">{error}</div>}

                  <button className="btn btn-primary btn-lg w-100 mb-3">Sign In</button>
                </form>

                <p className="text-muted mb-0">Don’t have an account? Use one of the demo profiles above or <Link to="/" className="text-decoration-underline text-info">return home</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
