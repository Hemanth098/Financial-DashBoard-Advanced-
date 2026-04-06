import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'stretch',
  },
  leftPanel: {
    flex: '1',
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 64px',
    position: 'relative',
    overflow: 'hidden',
  },
  rightPanel: {
    width: '480px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px 56px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '56px',
  },
  logoMark: {
    width: '42px',
    height: '42px',
    background: 'linear-gradient(135deg, #4f8ef7, #7c5cfc)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: '22px', fontWeight: '600', letterSpacing: '-0.5px' },
  headline: {
    fontSize: '42px',
    fontWeight: '600',
    lineHeight: '1.15',
    letterSpacing: '-1.5px',
    marginBottom: '20px',
  },
  subtext: { fontSize: '16px', color: 'var(--text2)', lineHeight: '1.65', maxWidth: '380px', marginBottom: '48px' },
  demoCard: {
    background: 'var(--bg3)',
    border: '1px solid var(--border2)',
    borderRadius: '14px',
    padding: '20px 24px',
  },
  demoLabel: { fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' },
  demoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '600', flexShrink: '0',
  },
  demoName: { fontSize: '14px', fontWeight: '500' },
  demoEmail: { fontSize: '12px', color: 'var(--text3)' },
  demoBadge: {
    marginLeft: 'auto', fontSize: '11px', fontWeight: '600',
    padding: '3px 10px', borderRadius: '20px',
  },
  formTitle: { fontSize: '28px', fontWeight: '600', letterSpacing: '-0.8px', marginBottom: '6px' },
  formSub: { fontSize: '14px', color: 'var(--text2)', marginBottom: '32px' },
  tabs: {
    display: 'flex', background: 'var(--bg3)', borderRadius: '10px',
    padding: '4px', marginBottom: '28px',
  },
  tab: {
    flex: '1', padding: '9px', borderRadius: '7px', border: 'none',
    background: 'transparent', cursor: 'pointer', fontSize: '14px',
    fontWeight: '500', color: 'var(--text2)', transition: 'all 0.2s',
  },
  tabActive: {
    background: 'var(--bg2)', color: 'var(--text)',
    boxShadow: '0 1px 6px rgba(0,0,0,0.15)',
  },
  formGroup: { marginBottom: '16px' },
  label: { fontSize: '12px', fontWeight: '500', color: 'var(--text2)', display: 'block', marginBottom: '6px', letterSpacing: '0.02em' },
  input: {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
    borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: 'var(--text)',
    outline: 'none', transition: 'border 0.15s',
  },
  btnPrimary: {
    width: '100%', background: 'var(--accent)', color: '#fff',
    border: 'none', borderRadius: '10px', padding: '12px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    transition: 'opacity 0.15s', marginTop: '8px',
  },
  error: {
    background: 'rgba(242,90,90,0.1)', border: '1px solid rgba(242,90,90,0.3)',
    borderRadius: '10px', padding: '10px 14px', fontSize: '13px',
    color: 'var(--red)', marginBottom: '16px',
  },
  success: {
    background: 'rgba(52,212,138,0.1)', border: '1px solid rgba(52,212,138,0.3)',
    borderRadius: '10px', padding: '10px 14px', fontSize: '13px',
    color: 'var(--green)', marginBottom: '16px',
  },
  divider: {
    textAlign: 'center', fontSize: '13px', color: 'var(--text3)', margin: '20px 0',
    position: 'relative',
  },
  roleRow: { display: 'flex', gap: '10px', marginBottom: '16px' },
  roleBtn: {
    flex: '1', padding: '10px', borderRadius: '10px', border: '1px solid var(--border2)',
    background: 'var(--bg3)', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
    color: 'var(--text2)', transition: 'all 0.15s', textAlign: 'center',
  },
  roleBtnActive: { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'rgba(79,142,247,0.1)' },
};

const DEMO_USERS = [
  { avatar: 'HT', color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)', name: 'Hemanth Tirukovalluru', email: 'hemanth@finflow.app', password: 'admin123', role: 'admin' },
  { avatar: 'PS', color: '#34d48a', bg: 'rgba(52,212,138,0.15)', name: 'Priya Sharma', email: 'priya@finflow.app', password: 'viewer123', role: 'viewer' },
  { avatar: 'RM', color: '#7c5cfc', bg: 'rgba(124,92,252,0.15)', name: 'Rajan Mehta', email: 'rajan@finflow.app', password: 'viewer456', role: 'viewer' },
];

export default function AuthPage() {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'viewer', phone: '', location: '' });
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => { dispatch({ type: 'CLEAR_ERROR' }); }, [tab]);

  function handleLogin(e) {
    e.preventDefault();
    dispatch({ type: 'LOGIN', email: loginForm.email, password: loginForm.password });
  }

  function handleRegister(e) {
    e.preventDefault();
    dispatch({
      type: 'ADD_USER',
      user: {
        ...regForm,
        avatar: regForm.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        password: regForm.password,
      }
    });
    if (!state.registerError) {
      setRegSuccess(true);
      setTab('login');
      setLoginForm({ email: regForm.email, password: '' });
    }
  }

  function quickLogin(user) {
    dispatch({ type: 'LOGIN', email: user.email, password: user.password });
  }

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.leftPanel} className="animate-fadein">
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(79,142,247,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(124,92,252,0.05)', pointerEvents: 'none' }} />

        <div style={styles.logo}>
          <div style={styles.logoMark}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span style={styles.logoText}>FinFlow</span>
        </div>

        <div style={styles.headline}>
          Your finances,<br />
          <span style={{ color: 'var(--accent)' }}>beautifully</span> tracked.
        </div>
        <p style={styles.subtext}>
          A personal finance dashboard to track income, expenses, and spending patterns — with role-based access for teams.
        </p>

        <div style={styles.demoCard}>
          <div style={styles.demoLabel}>Demo Accounts — click to login</div>
          {DEMO_USERS.map((u, i) => (
            <div
              key={i}
              style={{ ...styles.demoRow, cursor: 'pointer', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', padding: '12px 0', transition: 'opacity 0.15s' }}
              onClick={() => quickLogin(u)}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <div style={{ ...styles.avatar, background: u.bg, color: u.color }}>{u.avatar}</div>
              <div>
                <div style={styles.demoName}>{u.name}</div>
                <div style={styles.demoEmail}>{u.email} · {u.password}</div>
              </div>
              <span style={{ ...styles.demoBadge, background: u.role === 'admin' ? 'rgba(249,168,50,0.15)' : 'rgba(79,142,247,0.12)', color: u.role === 'admin' ? 'var(--amber)' : 'var(--accent)' }}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.rightPanel} className="animate-fadeup">
        <div style={styles.formTitle}>{tab === 'login' ? 'Welcome back' : 'Create account'}</div>
        <div style={styles.formSub}>{tab === 'login' ? 'Sign in to your FinFlow account' : 'Join FinFlow to track your finances'}</div>

        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(tab === 'login' ? styles.tabActive : {}) }} onClick={() => setTab('login')}>Sign In</button>
          <button style={{ ...styles.tab, ...(tab === 'register' ? styles.tabActive : {}) }} onClick={() => setTab('register')}>Register</button>
        </div>

        {state.loginError && <div style={styles.error}>{state.loginError}</div>}
        {state.registerError && <div style={styles.error}>{state.registerError}</div>}
        {regSuccess && <div style={styles.success}>Account created! Sign in below.</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" placeholder="you@example.com" value={loginForm.email}
                onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="••••••••" value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>
            <button style={styles.btnPrimary} type="submit" onMouseEnter={e => e.target.style.opacity='0.88'} onMouseLeave={e => e.target.style.opacity='1'}>
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} type="text" placeholder="Your name" value={regForm.name}
                onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))} required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" placeholder="you@example.com" value={regForm.email}
                onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} required
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="Min 6 characters" value={regForm.password}
                onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} required minLength={6}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border2)'}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Account type</label>
              <div style={styles.roleRow}>
                {['viewer', 'admin'].map(r => (
                  <button key={r} type="button"
                    style={{ ...styles.roleBtn, ...(regForm.role === r ? styles.roleBtnActive : {}) }}
                    onClick={() => setRegForm(f => ({ ...f, role: r }))}
                  >
                    {r === 'admin' ? '🔑 Admin' : '👁 Viewer'}
                  </button>
                ))}
              </div>
            </div>
            <button style={styles.btnPrimary} type="submit" onMouseEnter={e => e.target.style.opacity='0.88'} onMouseLeave={e => e.target.style.opacity='1'}>
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
