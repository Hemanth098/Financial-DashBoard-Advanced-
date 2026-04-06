export default function FinFlowSummaryCards({ summary }) {
  const cards = [
    {
      title: 'Total Balance',
      value: summary.balance,
      trend: '+8.2%',
      className: 'balance',
      icon: '💳',
    },
    {
      title: 'Total Income',
      value: summary.income,
      trend: '+4.1%',
      className: 'income',
      icon: '📈',
    },
    {
      title: 'Total Expenses',
      value: summary.expenses,
      trend: '+2.3%',
      className: 'expenses',
      icon: '📊',
    },
    {
      title: 'Net Savings',
      value: summary.savings,
      trend: '+12.4%',
      className: 'savings',
      icon: '💰',
    },
  ]

  const fmt = (n) => '₹' + n.toLocaleString()

  return (
    <div className="finflow-summary-grid">
      {cards.map((card) => (
        <div key={card.className} className={`finflow-summary-card ${card.className}`}>
          <div className="finflow-summary-label">{card.icon} {card.title}</div>
          <div className="finflow-summary-value">{fmt(card.value)}</div>
          <div className="finflow-summary-sub">
            <span className="finflow-trend-up">↑ {card.trend}</span> vs last month
          </div>
        </div>
      ))}
    </div>
  )
}
