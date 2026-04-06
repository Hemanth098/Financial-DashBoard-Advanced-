import React, { createContext, useContext, useReducer, useEffect } from 'react';
import initialDb from '../db.json';

const AppContext = createContext(null);

function loadDb() {
  try {
    const stored = localStorage.getItem('finflow_db');
    if (stored) return JSON.parse(stored);
  } catch {}
  return initialDb;
}

function saveDb(db) {
  localStorage.setItem('finflow_db', JSON.stringify(db));
}

const initialState = {
  db: loadDb(),
  currentUser: JSON.parse(localStorage.getItem('finflow_user') || 'null'),
  theme: localStorage.getItem('finflow_theme') || 'dark',
  activePage: 'dashboard',
};

function reducer(state, action) {
  switch (action.type) {

    case 'LOGIN': {
      const user = state.db.users.find(
        u => u.email === action.email && u.password === action.password
      );
      if (!user) return { ...state, loginError: 'Invalid email or password.' };
      localStorage.setItem('finflow_user', JSON.stringify(user));
      return { ...state, currentUser: user, loginError: null };
    }

    case 'LOGOUT': {
      localStorage.removeItem('finflow_user');
      return { ...state, currentUser: null, activePage: 'dashboard' };
    }

    case 'CLEAR_ERROR':
      return { ...state, loginError: null };

    case 'SET_PAGE':
      return { ...state, activePage: action.page };

    case 'TOGGLE_THEME': {
      const theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('finflow_theme', theme);
      return { ...state, theme };
    }

    case 'ADD_TRANSACTION': {
      const newTx = {
        ...action.tx,
        id: Date.now(),
        userId: action.userId,
      };
      const db = { ...state.db, transactions: [...state.db.transactions, newTx] };
      saveDb(db);
      return { ...state, db };
    }

    case 'DELETE_TRANSACTION': {
      const db = {
        ...state.db,
        transactions: state.db.transactions.filter(t => t.id !== action.id),
      };
      saveDb(db);
      return { ...state, db };
    }

    case 'ADD_USER': {
      const exists = state.db.users.find(u => u.email === action.user.email);
      if (exists) return { ...state, registerError: 'Email already registered.' };
      const newUser = { ...action.user, id: Date.now(), joinedAt: new Date().toISOString().split('T')[0] };
      const db = { ...state.db, users: [...state.db.users, newUser] };
      saveDb(db);
      return { ...state, db, registerError: null };
    }

    case 'CLEAR_REGISTER_ERROR':
      return { ...state, registerError: null };

    case 'DELETE_USER': {
      const db = {
        ...state.db,
        users: state.db.users.filter(u => u.id !== action.id),
        transactions: state.db.transactions.filter(t => t.userId !== action.id),
      };
      saveDb(db);
      return { ...state, db };
    }

    case 'RESET_DB': {
      saveDb(initialDb);
      return { ...state, db: initialDb };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
