import { Line, Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function FinFlowCharts({ transactions }) {
  // Group transactions by date for trend chart
  const lastNDays = 7
  const today = new Date()
  const dates = []
  for (let i = lastNDays - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }

  const dailyData = dates.map((date) => {
    const dayTx = transactions.filter((t) => t.date === date)
    const income = dayTx
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expenses = dayTx
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return { date, income, expenses }
  })

  // Category spending breakdown
  const categoryMap = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
    })
  const categories = Object.keys(categoryMap)
  const categoryAmounts = Object.values(categoryMap)

  // Monthly comparison (last 3 months)
  const now = new Date()
  const months = []
  const monthlyIncome = []
  const monthlyExpense = []
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
    months.push(monthStr)

    const monthTx = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear()
    })

    const income = monthTx
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = monthTx
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    monthlyIncome.push(income)
    monthlyExpense.push(expense)
  }

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, labels: { usePointStyle: true, color: 'var(--text)' } },
    },
    scales: {
      y: { grid: { color: 'var(--bg3)', drawBorder: false }, ticks: { color: 'var(--text2)' } },
      x: { grid: { display: false }, ticks: { color: 'var(--text2)' } },
    },
  }

  const trendChartData = {
    labels: dates.map((d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Income',
        data: dailyData.map((d) => d.income),
        borderColor: 'var(--green)',
        backgroundColor: 'rgba(52, 212, 138, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'var(--green)',
        pointBorderColor: 'var(--bg2)',
        pointBorderWidth: 2,
      },
      {
        label: 'Expenses',
        data: dailyData.map((d) => d.expenses),
        borderColor: 'var(--red)',
        backgroundColor: 'rgba(242, 90, 90, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'var(--red)',
        pointBorderColor: 'var(--bg2)',
        pointBorderWidth: 2,
      },
    ],
  }

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, labels: { usePointStyle: true, color: 'var(--text)' } },
    },
  }

  const categoryChartData = {
    labels: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [
      {
        label: 'Amount',
        data: categoryAmounts,
        backgroundColor: [
          'rgba(79, 142, 247, 0.8)',
          'rgba(52, 212, 138, 0.8)',
          'rgba(242, 90, 90, 0.8)',
          'rgba(124, 92, 252, 0.8)',
          'rgba(249, 168, 50, 0.8)',
          'rgba(139, 145, 165, 0.2)',
        ],
        borderColor: 'var(--bg2)',
        borderWidth: 2,
      },
    ],
  }

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, labels: { usePointStyle: true, color: 'var(--text)' } },
    },
    scales: {
      y: { grid: { color: 'var(--bg3)', drawBorder: false }, ticks: { color: 'var(--text2)' } },
      x: { grid: { display: false }, ticks: { color: 'var(--text2)' } },
    },
  }

  const monthlyChartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: monthlyIncome,
        backgroundColor: 'rgba(52, 212, 138, 0.7)',
        borderColor: 'var(--green)',
        borderWidth: 1.5,
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: monthlyExpense,
        backgroundColor: 'rgba(242, 90, 90, 0.7)',
        borderColor: 'var(--red)',
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  }

  return (
    <div className="finflow-charts-grid" style={{ marginBottom: '28px' }}>
      {/* Trend Chart */}
      <div className="finflow-card">
        <div className="finflow-card-header">
          <span className="finflow-card-title">7-Day Trend</span>
        </div>
        <div className="finflow-card-body" style={{ height: '280px', display: 'flex', alignItems: 'center' }}>
          <Line data={trendChartData} options={trendChartOptions} />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="finflow-card">
        <div className="finflow-card-header">
          <span className="finflow-card-title">Spending by Category</span>
        </div>
        <div className="finflow-card-body" style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '250px' }}>
            <Doughnut data={categoryChartData} options={categoryChartOptions} />
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div className="finflow-card" style={{ gridColumn: '1 / -1' }}>
        <div className="finflow-card-header">
          <span className="finflow-card-title">Monthly Comparison</span>
        </div>
        <div className="finflow-card-body" style={{ height: '280px', display: 'flex', alignItems: 'center' }}>
          <Bar data={monthlyChartData} options={monthlyChartOptions} />
        </div>
      </div>
    </div>
  )
}
