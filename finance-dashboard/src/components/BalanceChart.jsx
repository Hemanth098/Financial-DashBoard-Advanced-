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