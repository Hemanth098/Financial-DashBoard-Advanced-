import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="position-relative min-vh-100 overflow-hidden bg-dark text-white">
      <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none opacity-50" style={{ background: 'radial-gradient(circle at 15% 20%, rgba(56,189,248,0.18), transparent 24%), radial-gradient(circle at 85% 25%, rgba(168,85,247,0.12), transparent 22%)' }} />
      <div className="container py-5 position-relative">
        <div className="row gx-5 gy-5 align-items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="col-lg-7">
            <div className="mb-4 badge bg-info bg-opacity-10 text-info rounded-pill border border-info border-opacity-25">
              Finance dashboard powered by mock JSON data
            </div>
            <div className="mb-5">
              <h1 className="display-4 fw-bold">Insights that move you toward smarter money decisions.</h1>
              <p className="lead text-white-75">Login to experience a polished, role-driven dashboard with separate pages for overview, transactions, insights, profile, and settings.</p>
            </div>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link to="/login" className="btn btn-primary btn-lg shadow-lg">Log In</Link>
              <Link to="/dashboard" className="btn btn-outline-light btn-lg">View Dashboard</Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="col-lg-5">
            <div className="card bg-secondary bg-opacity-10 border-light border-opacity-10 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">Demo credentials</h2>
                <div className="row g-3 mt-4">
                  {[
                    { role: 'Admin', email: 'admin@finance.com' },
                    { role: 'Viewer', email: 'viewer@finance.com' },
                    { role: 'Manager', email: 'manager@finance.com' },
                  ].map((item) => (
                    <div className="col-12" key={item.role}>
                      <div className="p-4 rounded-4 bg-dark border border-secondary">
                        <p className="text-uppercase text-muted small mb-2">{item.role}</p>
                        <p className="h6 mb-1 text-white">{item.email}</p>
                        <p className="text-muted mb-0">123456</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
