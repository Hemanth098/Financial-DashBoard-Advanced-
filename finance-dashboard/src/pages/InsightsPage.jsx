import { TrendingUp, AlertCircle, Target, PieChart } from 'lucide-react'
import { generateInsights } from '../utils/generateInsights'
import useAuthStore from '../store/useAuthStore'
import useFinanceStore from '../store/useFinanceStore'

export default function InsightsPage() {
  const { user } = useAuthStore()
  const { transactions } = useFinanceStore()
  const userTransactions = transactions.filter((t) => t.userId === user?.id)
  const insights = generateInsights(userTransactions)

  // Group expenses by category for progress bars
  const categoryMap = {}
  userTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
    })

  const categories = Object.entries(categoryMap)
    .map(([cat, amount]) => ({ cat, amount }))
    .sort((a, b) => b.amount - a.amount)

  const totalExpense = categories.reduce((sum, c) => sum + c.amount, 0)

  const insightCards = [
    {
      title: 'Highest Spending',
      value: insights.highestCategory,
      subtitle: `₹${insights.highestAmount.toLocaleString()} spent`,
      icon: <TrendingUp size={20} />,
      color: '#4f8ef7',
    },
    {
      title: 'Total Transactions',
      value: userTransactions.length,
      subtitle: `${userTransactions.filter((t) => t.type === 'expense').length} expenses, ${userTransactions.filter((t) => t.type === 'income').length} income`,
      icon: <PieChart size={20} />,
      color: '#7c5cfc',
    },
    {
      title: 'Average Expense',
      value: `₹${totalExpense ? Math.round(totalExpense / userTransactions.filter((t) => t.type === 'expense').length) : 0}`,
      subtitle: 'Per transaction',
      icon: <Target size={20} />,
      color: '#f9a832',
    },
  ]

  const fmt = (n) => '₹' + n.toLocaleString()

  return (
    <div className="finflow-page active" style={{ padding: '28px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text)', margin: '0 0 8px 0' }}>Insights</h1>
        <p style={{ fontSize: '13px', color: 'var(--text3)', margin: '0' }}>Smart guidance from your spending patterns</p>
      </div>

      {/* Insight Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {insightCards.map((card, idx) => (
          <div
            key={idx}
            className="finflow-card"
            style={{
              borderTop: `3px solid ${card.color}`,
              background: `linear-gradient(135deg, var(--bg2) 0%, rgba(${parseInt(card.color.slice(1, 3), 16)},${parseInt(card.color.slice(3, 5), 16)},${parseInt(card.color.slice(5, 7), 16)},0.05) 100%)`,
            }}
          >
            <div className="finflow-card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {card.title}
                </span>
                <div style={{ color: card.color, opacity: 0.8 }}>{card.icon}</div>
              </div>
              <p style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)', margin: '0 0 8px 0' }}>{card.value}</p>
              <p style={{ fontSize: '12px', color: 'var(--text3)', margin: '0' }}>{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="finflow-card" style={{ marginBottom: '28px' }}>
        <div className="finflow-card-header">
          <span className="finflow-card-title">Spending by Category</span>
        </div>
        <div className="finflow-card-body" style={{ padding: '20px' }}>
          {categories.length === 0 ? (
            <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '24px 0', margin: '0' }}>No expense data available</p>
          ) : (
            <div style={{ space: '16px' }}>
              {categories.map((item) => {
                const percentage = totalExpense ? (item.amount / totalExpense) * 100 : 0
                return (
                  <div key={item.cat} style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)', textTransform: 'capitalize' }}>
                        {item.cat}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
                        {fmt(item.amount)} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        background: 'var(--bg3)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, var(--accent) 0%, var(--accent2) 100%)`,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="finflow-card">
        <div className="finflow-card-header">
          <span className="finflow-card-title">Tips & Recommendations</span>
        </div>
        <div className="finflow-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div
              style={{
                padding: '16px',
                background: 'rgba(52, 212, 138, 0.08)',
                borderLeft: '3px solid var(--green)',
                borderRadius: '6px',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', margin: '0 0 8px 0' }}>💚 Savings Tip</p>
              <p style={{ fontSize: '12px', color: 'var(--text3)', margin: '0' }}>
                Review your {insights.highestCategory} spending and identify areas to cut back.
              </p>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(249, 168, 50, 0.08)',
                borderLeft: '3px solid var(--amber)',
                borderRadius: '6px',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', margin: '0 0 8px 0' }}>⚠️ Budget Alert</p>
              <p style={{ fontSize: '12px', color: 'var(--text3)', margin: '0' }}>
                {totalExpense > 5000 ? 'Your expenses are high this period. Consider reviewing your budget.' : 'Keep tracking to understand your spending habits better.'}
              </p>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(79, 142, 247, 0.08)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: '6px',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', margin: '0 0 8px 0' }}>📊 Insight</p>
              <p style={{ fontSize: '12px', color: 'var(--text3)', margin: '0' }}>
                Check the Transactions page to verify entries and update categories for better insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
