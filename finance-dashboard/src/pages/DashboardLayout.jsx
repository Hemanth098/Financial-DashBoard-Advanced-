import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DashboardPage from './DashboardPage';
import TransactionsPage from './TransactionsPage';
import InsightsPage from './InsightsPage';
import ProfilePage from './ProfilePage';
import UsersPage from './UsersPage';

const s = {
  layout: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: '220px', background: 'var(--bg2)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', padding: '24px 0',
    position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100,
    transition: 'transform 0.3s',
  },
  sidebarLogo: { padding: '0 20px 28px', display: 'flex', alignItems: 'center', gap: '10px' },
  logoMark: {
    width: '32px', height: '32px',
    background: 'linear-gradient(135deg, #4f8ef7, #7c5cfc)',
    borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: '17px', fontWeight: '600', letterSpacing: '-0.3px' },
  navSection: { padding: '0 12px', marginBottom: '4px' },
  navLabel: { fontSize: '10px', fontWeight: '600', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: '6px', marginTop: '16px', display: 'block' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px',
    borderRadius: '9px', cursor: 'pointer', fontSize: '14px', color: 'var(--text2)',
    fontWeight: '400', transition: 'all 0.15s', marginBottom: '2px', border: 'none',
    background: 'transparent', width: '100%', textAlign: 'left',
  },
  main: { marginLeft: '220px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  topbar: {
    padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '14px',
    borderBottom: '1px solid var(--border)', background: 'var(--bg2)',
    position: 'sticky', top: 0, zIndex: 50,
  },
  topbarTitle: { fontSize: '16px', fontWeight: '600', flex: 1 },
  themeBtn: {
    width: '36px', height: '36px', borderRadius: '9px', background: 'var(--bg3)',
    border: '1px solid var(--border2)', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', transition: 'all 0.15s',
  },
  userChip: {
    display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg3)',
    border: '1px solid var(--border2)', borderRadius: '24px', padding: '5px 12px 5px 5px',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  userAvatar: {
    width: '26px', height: '26px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: '600',
  },
  roleBadge: {
    fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '20px',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px',
    borderRadius: '9px', cursor: 'pointer', fontSize: '14px', color: 'var(--red)',
    fontWeight: '400', transition: 'all 0.15s', marginBottom: '2px', border: 'none',
    background: 'transparent', width: '100%', textAlign: 'left',
  },
  overlay: {
    display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90,
  },
  mobileBtn: {
    display: 'none', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer',
  },
};

const PAGES = {
  dashboard: { label: 'Dashboard', icon: GridIcon },
  transactions: { label: 'Transactions', icon: DollarIcon },
  insights: { label: 'Insights', icon: TrendIcon },
  profile: { label: 'My Profile', icon: UserIcon },
};

const ADMIN_PAGES = {
  users: { label: 'Manage Users', icon: UsersIcon },
};

const PAGE_TITLES = {
  dashboard: 'Dashboard', transactions: 'Transactions',
  insights: 'Insights', profile: 'My Profile', users: 'Manage Users',
};

export default function DashboardLayout() {
  const { state, dispatch } = useApp();
  const { currentUser, activePage, theme } = state;
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';

  const avatarColors = { admin: { bg: 'rgba(249,168,50,0.2)', color: '#f9a832' }, viewer: { bg: 'rgba(79,142,247,0.2)', color: '#4f8ef7' } };
  const ac = avatarColors[currentUser?.role] || avatarColors.viewer;

  function NavBtn({ pageKey, icon: Icon }) {
    const active = activePage === pageKey;
    return (
      <button
        style={{
          ...s.navItem,
          ...(active ? { background: 'rgba(79,142,247,0.13)', color: 'var(--accent)', fontWeight: '500' } : {}),
        }}
        onClick={() => { dispatch({ type: 'SET_PAGE', page: pageKey }); setMobileOpen(false); }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)'; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; } }}
      >
        <Icon />
        {PAGES[pageKey]?.label || ADMIN_PAGES[pageKey]?.label}
      </button>
    );
  }

  return (
    <div style={s.layout}>
      {/* Overlay */}
      <div
        style={{ ...s.overlay, display: mobileOpen ? 'block' : 'none' }}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside style={{ ...s.sidebar, transform: mobileOpen ? 'translateX(0)' : undefined }}>
        <div style={s.sidebarLogo}>
          <div style={s.logoMark}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span style={s.logoText}>FinFlow</span>
        </div>

        <div style={s.navSection}>
          <span style={s.navLabel}>Overview</span>
          <NavBtn pageKey="dashboard" icon={GridIcon} />
          <NavBtn pageKey="insights" icon={TrendIcon} />
        </div>

        <div style={s.navSection}>
          <span style={s.navLabel}>Activity</span>
          <NavBtn pageKey="transactions" icon={DollarIcon} />
        </div>

        {isAdmin && (
          <div style={s.navSection}>
            <span style={s.navLabel}>Admin</span>
            <NavBtn pageKey="users" icon={UsersIcon} />
          </div>
        )}

        <div style={{ marginTop: 'auto', padding: '0 12px' }}>
          <NavBtn pageKey="profile" icon={UserIcon} />
          <button
            style={s.logoutBtn}
            onClick={() => dispatch({ type: 'LOGOUT' })}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,90,90,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={s.main}>
        <header style={s.topbar}>
          <button style={{ ...s.mobileBtn, display: 'flex' }} onClick={() => setMobileOpen(!mobileOpen)}>
            <MenuIcon />
          </button>
          <span style={s.topbarTitle}>{PAGE_TITLES[activePage]}</span>

          <button
            style={s.themeBtn}
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--card2)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <div
            style={s.userChip}
            onClick={() => dispatch({ type: 'SET_PAGE', page: 'profile' })}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--card2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg3)'}
          >
            <div style={{ ...s.userAvatar, background: ac.bg, color: ac.color }}>{currentUser?.avatar}</div>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{currentUser?.name.split(' ')[0]}</span>
            <span style={{ ...s.roleBadge, background: isAdmin ? 'rgba(249,168,50,0.15)' : 'rgba(79,142,247,0.12)', color: isAdmin ? 'var(--amber)' : 'var(--accent)' }}>
              {currentUser?.role}
            </span>
          </div>
        </header>

        <main style={{ flex: 1, overflow: 'auto' }}>
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'transactions' && <TransactionsPage />}
          {activePage === 'insights' && <InsightsPage />}
          {activePage === 'profile' && <ProfilePage />}
          {activePage === 'users' && isAdmin && <UsersPage />}
        </main>
      </div>
    </div>
  );
}

// Icons
function GridIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function DollarIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function TrendIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
function UserIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function UsersIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function LogoutIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function MenuIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
function SunIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>; }
function MoonIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
