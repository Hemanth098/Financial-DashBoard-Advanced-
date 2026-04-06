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