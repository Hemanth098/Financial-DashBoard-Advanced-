import { Lightbulb } from 'lucide-react'

export default function InsightsSection({ insights }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Lightbulb className="text-primary" />
          <h2 className="h5 mb-0">Insights</h2>
        </div>

        <div className="row g-3">
          <div className="col-12">
            <p className="mb-1 text-muted">Highest spending category</p>
            <p className="mb-0 fs-5 fw-semibold">{insights.highestCategory}</p>
          </div>
          <div className="col-12">
            <p className="mb-1 text-muted">Total spent in this category</p>
            <p className="mb-0 fs-5 fw-semibold">₹{insights.highestAmount}</p>
          </div>
          <div className="col-12">
            <p className="mb-0 text-muted">Your income is helping maintain a positive savings balance this month.</p>
          </div>
        </div>
      </div>
    </div>
  )
}