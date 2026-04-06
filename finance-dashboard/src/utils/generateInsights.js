export const generateInsights = (transactions) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense')

  const categoryTotals = {}

  expenseTransactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
  })

  const categories = Object.keys(categoryTotals)
  const highestCategory = categories.length
    ? categories.reduce((a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b), categories[0])
    : 'No expenses yet'

  return {
    highestCategory,
    highestAmount: categoryTotals[highestCategory] || 0,
  }
}