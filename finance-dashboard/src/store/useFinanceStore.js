import { create } from 'zustand'
import financeData from '../data/financeData.json'

const useFinanceStore = create((set) => ({
  transactions: JSON.parse(localStorage.getItem('transactions')) || financeData,
  search: '',
  filterType: 'all',
  darkMode: JSON.parse(localStorage.getItem('darkMode')) || false,

  setSearch: (search) => set({ search }),
  setFilterType: (filterType) => set({ filterType }),
  toggleDarkMode: () =>
    set((state) => {
      localStorage.setItem('darkMode', JSON.stringify(!state.darkMode))
      return { darkMode: !state.darkMode }
    }),

  addTransaction: (transaction) =>
    set((state) => {
      const updated = [...state.transactions, transaction]
      localStorage.setItem('transactions', JSON.stringify(updated))
      return { transactions: updated }
    }),

  updateTransaction: (updatedTransaction) =>
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )

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