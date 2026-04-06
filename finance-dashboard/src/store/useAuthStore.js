import { create } from 'zustand'
import users from '../data/users.json'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('loggedInUser')) || null,

  login: (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser))
      set({ user: foundUser })
      return true
    }

    return false
  },

  logout: () => {
    localStorage.removeItem('loggedInUser')
    set({ user: null })
  },

  setRole: (role) => {
    set((state) => {
      if (state.user) {
        const updatedUser = { ...state.user, role }
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
        return { user: updatedUser }
      }
      return state
    })
  },
}))

export default useAuthStore