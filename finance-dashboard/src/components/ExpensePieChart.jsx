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