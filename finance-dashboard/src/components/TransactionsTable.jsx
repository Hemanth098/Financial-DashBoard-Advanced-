import { Trash2 } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useFinanceStore from '../store/useFinanceStore'

export default function TransactionsTable() {
  const { user } = useAuthStore()
  const {
    transactions,
    deleteTransaction,
    search,
    setSearch,
    filterType,
    setFilterType,
  } = useFinanceStore()

  const filtered = transactions.filter((t) => {
    const ownerMatch = t.userId === user?.id
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    return ownerMatch && matchesSearch && matchesType
  })

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-8">
            <input
              type="text"
              placeholder="Search transaction"
              className="form-control form-control-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-select form-select-lg"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              {user?.role === 'admin' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                <td>
                  <span className={`badge ${t.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                    {t.type}
                  </span>
                </td>
                <td>₹{t.amount.toLocaleString()}</td>
                {user?.role === 'admin' && (
                  <td>
                    <button type="button" onClick={() => deleteTransaction(t.id)} className="btn btn-sm btn-outline-danger">
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}