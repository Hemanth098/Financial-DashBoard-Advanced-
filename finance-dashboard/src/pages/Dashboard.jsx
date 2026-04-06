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