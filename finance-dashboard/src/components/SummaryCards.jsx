import { IndianRupee, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react'

export default function SummaryCards({ summary }) {
  const cards = [
    {
      title: 'Balance',
      value: summary.balance,
      icon: <IndianRupee />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Income',
      value: summary.income,
      icon: <TrendingUp />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Expenses',
      value: summary.expenses,
      icon: <TrendingDown />,
      color: 'from-red-500 to-pink-500',
    },
    {
      title: 'Savings',
      value: summary.savings,
      icon: <PiggyBank />,
      color: 'from-yellow-500 to-orange-500',
    },
  ]

  return (
    <div className="row g-4">
      {cards.map((card) => (
        <div className="col-12 col-md-6 col-xl-3" key={card.title}>
          <div className="card h-100 border-3 border-primary shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="h6 mb-0">{card.title}</h2>
                {card.icon}
              </div>
              <p className="display-6 fw-bold mb-0">₹{card.value.toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}