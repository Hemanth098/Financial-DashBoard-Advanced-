# Finance Dashboard Project Structure

```txt
src/
 ├── components/
 │    ├── Navbar.jsx
 │    ├── SummaryCards.jsx
 │    ├── BalanceChart.jsx
 │    ├── ExpensePieChart.jsx
 │    ├── TransactionsTable.jsx
 │    ├── TransactionModal.jsx
 │    ├── InsightsSection.jsx
 │    ├── RoleSwitcher.jsx
 │    └── EmptyState.jsx
 │
 ├── data/
 │    └── mockTransactions.js
 │
 ├── store/
 │    └── useFinanceStore.js
 │
 ├── utils/
 │    ├── calculateSummary.js
 │    └── generateInsights.js
 │
 ├── pages/
 │    └── Dashboard.jsx
 │
 ├── App.jsx
 ├── main.jsx
 └── index.css
```

---

# Install Dependencies

```bash
npm install react-router-dom zustand recharts lucide-react framer-motion
```

---

# src/main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

# src/App.jsx

```jsx
import Dashboard from './pages/Dashboard'

export default function App() {
  return <Dashboard />
}
```

---

# src/data/mockTransactions.js

```jsx
export const mockTransactions = [
  {
    id: 1,
    date: '2026-04-01',
    description: 'Salary Credit',
    category: 'Salary',
    type: 'income',
    amount: 75000,
  },
  {
    id: 2,
    date: '2026-04-02',
    description: 'Rent Payment',
    category: 'Rent',
    type: 'expense',
    amount: 18000,
  },
  {
    id: 3,
    date: '2026-04-03',
    description: 'Grocery Store',
    category: 'Food',
    type: 'expense',
    amount: 3200,
  },
  {
    id: 4,
    date: '2026-04-03',
    description: 'Freelance Project',
    category: 'Freelance',
    type: 'income',
    amount: 15000,
  },
  {
    id: 5,
    date: '2026-04-04',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    type: 'expense',
    amount: 799,
  },
  {
    id: 6,
    date: '2026-04-05',
    description: 'Petrol',
    category: 'Transport',
    type: 'expense',
    amount: 2500,
  },
]
```

---

# src/store/useFinanceStore.js

```jsx
import { create } from 'zustand'
import { mockTransactions } from '../data/mockTransactions'

const savedTransactions = JSON.parse(localStorage.getItem('transactions'))
const savedRole = localStorage.getItem('role')
const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'))

const useFinanceStore = create((set) => ({
  transactions: savedTransactions || mockTransactions,
  role: savedRole || 'viewer',
  darkMode: savedDarkMode || false,
  search: '',
  filterType: 'all',

  setRole: (role) => {
    localStorage.setItem('role', role)
    set({ role })
  },

  toggleDarkMode: () =>
    set((state) => {
      localStorage.setItem('darkMode', JSON.stringify(!state.darkMode))
      return { darkMode: !state.darkMode }
    }),

  setSearch: (search) => set({ search }),
  setFilterType: (filterType) => set({ filterType }),

  addTransaction: (transaction) =>
    set((state) => {
      const updated = [...state.transactions, transaction]
      localStorage.setItem('transactions', JSON.stringify(updated))
      return { transactions: updated }
    }),

  deleteTransaction: (id) =>
    set((state) => {
      const updated = state.transactions.filter((t) => t.id !== id)
      localStorage.setItem('transactions', JSON.stringify(updated))
      return { transactions: updated }
    }),
}))

export default useFinanceStore
```

---

# src/utils/calculateSummary.js

```jsx
export const calculateSummary = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0)

  return {
    income,
    expenses,
    balance: income - expenses,
    savings: Math.max(income - expenses, 0),
  }
}
```

---

# src/utils/generateInsights.js

```jsx
export const generateInsights = (transactions) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense')

  const categoryTotals = {}

  expenseTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
  })

  const highestCategory = Object.keys(categoryTotals).reduce(
    (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
    Object.keys(categoryTotals)[0]
  )

  return {
    highestCategory,
    highestAmount: categoryTotals[highestCategory] || 0,
  }
}
```

---

# src/components/Navbar.jsx

```jsx
import { Moon, Sun, Wallet } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import RoleSwitcher from './RoleSwitcher'

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useFinanceStore()

  return (
    <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-3 rounded-2xl text-white shadow-lg">
          <Wallet size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Finance Dashboard</h1>
          <p className="text-sm text-slate-500">Track your money smartly</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <RoleSwitcher />

        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-slate-200 dark:bg-slate-800 hover:scale-110 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  )
}
```

---

# src/components/RoleSwitcher.jsx

```jsx
import useFinanceStore from '../store/useFinanceStore'

export default function RoleSwitcher() {
  const { role, setRole } = useFinanceStore()

  return (
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="px-4 py-2 rounded-xl border dark:bg-slate-800"
    >
      <option value="viewer">Viewer</option>
      <option value="admin">Admin</option>
    </select>
  )
}
```

---

# src/components/SummaryCards.jsx

```jsx
import { motion } from 'framer-motion'
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-r ${card.color} text-white rounded-3xl p-6 shadow-xl hover:scale-105 transition duration-300`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{card.title}</h2>
            {card.icon}
          </div>
          <p className="text-3xl font-bold">₹{card.value.toLocaleString()}</p>
        </motion.div>
      ))}
    </div>
  )
}
```

---

# src/components/BalanceChart.jsx

```jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const data = [
  { month: 'Jan', balance: 40000 },
  { month: 'Feb', balance: 52000 },
  { month: 'Mar', balance: 47000 },
  { month: 'Apr', balance: 69000 },
]

export default function BalanceChart() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg h-[350px]">
      <h2 className="text-xl font-bold mb-4">Balance Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="balance" stroke="#4f46e5" strokeWidth={4} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

# src/components/ExpensePieChart.jsx

```jsx
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Food', value: 3200 },
  { name: 'Rent', value: 18000 },
  { name: 'Entertainment', value: 799 },
  { name: 'Transport', value: 2500 },
]

const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444']

export default function ExpensePieChart() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg h-[350px]">
      <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
```

---

# src/components/InsightsSection.jsx

```jsx
import { Lightbulb } from 'lucide-react'

export default function InsightsSection({ insights }) {
  return (
    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb />
        <h2 className="text-2xl font-bold">Insights</h2>
      </div>

      <div className="space-y-3">
        <p>
          Highest spending category: <strong>{insights.highestCategory}</strong>
        </p>
        <p>
          Total spent in this category: <strong>₹{insights.highestAmount}</strong>
        </p>
        <p>
          Your income is helping maintain a positive savings balance this month.
        </p>
      </div>
    </div>
  )
}
```

---

# src/components/TransactionModal.jsx

```jsx
import { useState } from 'react'
import useFinanceStore from '../store/useFinanceStore'

export default function TransactionModal({ onClose }) {
  const { addTransaction } = useFinanceStore()

  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: '',
  })

  const handleSubmit = () => {
    addTransaction({
      ...form,
      id: Date.now(),
      amount: Number(form.amount),
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
```

---

# src/components/TransactionsTable.jsx

```jsx
import { Trash2 } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'

export default function TransactionsTable() {
  const {
    transactions,
    role,
    deleteTransaction,
    search,
    setSearch,
    filterType,
    setFilterType,
  } = useFinanceStore()

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-6 overflow-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search transaction"
          className="p-3 rounded-xl border w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 rounded-xl border"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b dark:border-slate-700">
            <th className="py-3">Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            {role === 'admin' && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {filtered.map((t) => (
            <tr key={t.id} className="border-b dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <td className="py-4">{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>
                <span className={`px-3 py-1 rounded-full text-sm ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type}
                </span>
              </td>
              <td>₹{t.amount.toLocaleString()}</td>
              {role === 'admin' && (
                <td>
                  <button onClick={() => deleteTransaction(t.id)} className="text-red-500 hover:scale-110 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

# src/pages/Dashboard.jsx

```jsx
import { useState } from 'react'
import Navbar from '../components/Navbar'
import SummaryCards from '../components/SummaryCards'
import BalanceChart from '../components/BalanceChart'
import ExpensePieChart from '../components/ExpensePieChart'
import InsightsSection from '../components/InsightsSection'
import TransactionsTable from '../components/TransactionsTable'
import TransactionModal from '../components/TransactionModal'
import useFinanceStore from '../store/useFinanceStore'
import { calculateSummary } from '../utils/calculateSummary'
import { generateInsights } from '../utils/generateInsights'

export default function Dashboard() {
  const { transactions, role, darkMode } = useFinanceStore()
  const [showModal, setShowModal] = useState(false)

  const summary = calculateSummary(transactions)
  const insights = generateInsights(transactions)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 dark:text-white transition-all duration-300">
        <Navbar />

        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          <SummaryCards summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceChart />
            <ExpensePieChart />
          </div>

          <InsightsSection insights={insights} />

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Transactions</h2>

            {role === 'admin' && (
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg hover:scale-105 transition"
              >
                Add Transaction
              </button>
            )}
          </div>

          <TransactionsTable />
        </div>

        {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  )
}
```

---

# src/index.css

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

body {
  background: #f1f5f9;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  border-radius: 20px;
}

table {
  border-collapse: collapse;
}

input,
select,
button {
  outline: none;
}

button {
  transition: all 0.3s ease;
}

.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}
```

---

# Tailwind Config

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

# Extra Features You Can Add Later

```txt
1. CSV Export
2. Editable Transactions
3. Drag and Drop Cards
4. Notifications Panel
5. Monthly Budget Goals
6. Animated Number Counter
7. User Profile Sidebar
8. Real API Integration
9. Multiple Wallet Accounts
10. Calendar View of Transactions
```

