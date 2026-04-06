import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useFinanceStore from '../store/useFinanceStore'
import FinFlowSummaryCards from '../components/FinFlowSummaryCards'
import { calculateSummary } from '../utils/calculateSummary'

export default function TransactionsPage() {
  const { user } = useAuthStore()
  const { transactions, deleteTransaction, addTransaction, search, setSearch, filterType, setFilterType } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  })

  const userTransactions = transactions.filter((t) => t.userId === user?.id)
  const summary = calculateSummary(userTransactions)

  const filtered = userTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    return matchesSearch && matchesType
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount) {
      alert('Please fill in all fields')
      return
    }
    addTransaction({
      id: Date.now().toString(),
      userId: user.id,
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString().split('T')[0],
      emoji: '💰',
    })
    setFormData({ description: '', amount: '', category: 'food', type: 'expense', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
  }

  const categories = ['food', 'transport', 'shopping', 'health', 'entertainment', 'utilities', 'salary', 'freelance']
  const fmt = (n) => '₹' + n.toLocaleString()
  const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <div className="finflow-page active" style={{ padding: '28px' }}>
      {/* Header Card */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text)', margin: '0 0 8px 0' }}>Transactions</h1>
            <p style={{ fontSize: '13px', color: 'var(--text3)', margin: '0' }}>Manage and track your financial activity</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: showForm ? 'var(--accent)' : 'var(--bg3)',
                color: showForm ? '#fff' : 'var(--text)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} /> {showForm ? 'Cancel' : 'Add'}
            </button>
          </div>
        </div>
        <FinFlowSummaryCards summary={summary} />
      </div>

      {/* Admin Form */}
      {showForm && user?.role === 'admin' && (
        <div className="finflow-card" style={{ marginBottom: '28px' }}>
          <div className="finflow-card-header">
            <span className="finflow-card-title">Add New Transaction</span>
          </div>
          <div className="finflow-card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Grocery shopping"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>Amount</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg2)',
                      color: 'var(--text)',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--text)',
            fontSize: '13px',
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--text)',
            fontSize: '13px',
          }}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="finflow-card">
        <div className="finflow-card-header">
          <span className="finflow-card-title">{filtered.length} Transaction{filtered.length !== 1 ? 's' : ''}</span>
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
                {user?.role === 'admin' && <th style={{ textAlign: 'center' }}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 6 : 5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)' }}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="finflow-tx-cat">
                        <div
                          className="finflow-tx-icon"
                          style={{
                            background: tx.type === 'income' ? 'rgba(52,212,138,0.12)' : 'rgba(242,90,90,0.1)',
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
                    <td style={{ color: 'var(--text3)', fontSize: '13px' }}>{fmtDate(tx.date)}</td>
                    <td>
                      <span className={`finflow-cat-pill finflow-cat-${tx.category}`}>{tx.category}</span>
                    </td>
                    <td style={{ fontSize: '12px', fontWeight: '600' }}>
                      <span style={{ color: tx.type === 'income' ? 'var(--green)' : 'var(--text3)' }}>{tx.type}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={tx.type === 'income' ? 'finflow-amount-income' : 'finflow-amount-expense'}>
                        {tx.type === 'income' ? '+' : '-'}
                        {fmt(tx.amount)}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--red)',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
