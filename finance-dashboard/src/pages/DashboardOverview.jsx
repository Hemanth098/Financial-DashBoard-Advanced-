import useAuthStore from '../store/useAuthStore'
import useFinanceStore from '../store/useFinanceStore'
import { calculateSummary } from '../utils/calculateSummary'
import FinFlowSummaryCards from '../components/FinFlowSummaryCards'
import FinFlowCharts from '../components/FinFlowCharts'

export default function DashboardOverview() {
  const { user } = useAuthStore()
  const { transactions } = useFinanceStore()

  const userTransactions = transactions.filter((t) => t.userId === user?.id)
  const summary = calculateSummary(userTransactions)

  const fmt = (n) => '₹' + n.toLocaleString()
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  // Get recent 5 transactions
  const recent = [...userTransactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="finflow-page active" style={{ padding: '28px' }}>
      {/* Summary Cards */}
      <FinFlowSummaryCards summary={summary} />

      {/* Charts Row */}
      <FinFlowCharts transactions={userTransactions} />

      {/* Recent Transactions */}
      <div className="finflow-card">
        <div className="finflow-card-header">
          <span className="finflow-card-title">Recent Transactions</span>
        </div>
        <div className="finflow-card-body" style={{ paddingTop: '8px' }}>
          <table className="finflow-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <div className="finflow-tx-cat">
                      <div
                        className="finflow-tx-icon"
                        style={{
                          background:
                            tx.type === 'income'
                              ? 'rgba(52,212,138,0.12)'
                              : 'rgba(242,90,90,0.1)',
                        }}
                      >
                        {tx.emoji || '💰'}
                      </div>
                      <div>
                        <div className="finflow-tx-name">{tx.description}</div>
                        <div className="finflow-tx-date">{fmtDate(tx.date)}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text3)', fontSize: '13px' }}>
                    {fmtDate(tx.date)}
                  </td>
                  <td>
                    <span className={`finflow-cat-pill finflow-cat-${tx.category}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', fontWeight: '600' }}>
                    <span style={{ color: tx.type === 'income' ? 'var(--green)' : 'var(--text3)' }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      className={
                        tx.type === 'income'
                          ? 'finflow-amount-income'
                          : 'finflow-amount-expense'
                      }
                    >
                      {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
