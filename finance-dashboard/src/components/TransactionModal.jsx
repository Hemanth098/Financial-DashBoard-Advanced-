import { useState } from 'react'
import useAuthStore from '../store/useAuthStore'
import useFinanceStore from '../store/useFinanceStore'

export default function TransactionModal({ onClose }) {
  const { user } = useAuthStore()
  const { addTransaction } = useFinanceStore()

  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().slice(0, 10),
  })

  const handleSubmit = () => {
    if (!user) return

    addTransaction({
      ...form,
      id: Date.now(),
      amount: Number(form.amount),
      userId: user.id,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>

        <div className="space-y-4">
          <input placeholder="Description" className="w-full p-3 rounded-xl border" onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Amount" type="number" className="w-full p-3 rounded-xl border" onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input placeholder="Category" className="w-full p-3 rounded-xl border" onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input type="date" className="w-full p-3 rounded-xl border" onChange={(e) => setForm({ ...form, date: e.target.value })} />

          <select className="w-full p-3 rounded-xl border" onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-300">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}