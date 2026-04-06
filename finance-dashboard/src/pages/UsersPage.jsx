import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fmt, fmtDate, cardStyle, getAvatarColor } from '../utils';

export default function UsersPage() {
  const { state, dispatch } = useApp();
  const { currentUser, db } = state;
  const [expandedUser, setExpandedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (currentUser.role !== 'admin') {
    return (
      <div style={{ padding: '28px', color: 'var(--text3)', fontSize: '14px' }}>
        Access denied. Admin only.
      </div>
    );
  }

  function handleDeleteUser(userId) {
    dispatch({ type: 'DELETE_USER', id: userId });
    setConfirmDelete(null);
    if (expandedUser === userId) setExpandedUser(null);
  }

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeup">
      {/* Confirm dialog */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ ...cardStyle, padding: '28px', maxWidth: '380px', width: '90%', animation: 'fadeUp 0.2s ease' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Delete User?</div>
            <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '20px' }}>
              This will permanently delete the user and all their transactions. This cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '10px', borderRadius: '9px', background: 'var(--red)', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }} onClick={() => handleDeleteUser(confirmDelete)}>Delete</button>
              <button style={{ flex: 1, padding: '10px', borderRadius: '9px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border2)', cursor: 'pointer', fontSize: '14px' }} onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {[
          { label: 'Total Users', value: db.users.length, color: 'var(--accent)' },
          { label: 'Admin Users', value: db.users.filter(u => u.role === 'admin').length, color: 'var(--amber)' },
          { label: 'Viewer Users', value: db.users.filter(u => u.role === 'viewer').length, color: 'var(--green)' },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, padding: '18px 20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: '600', letterSpacing: '-1px', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Users list */}
      <div style={cardStyle}>
        <div style={{ padding: '18px 20px 0' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>All Users</span>
        </div>
        <div style={{ padding: '12px 0 4px' }}>
          {db.users.map(user => {
            const ac = getAvatarColor(user.id);
            const userTxns = db.transactions.filter(t => t.userId === user.id);
            const userIncome = userTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const userExpenses = userTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            const isMe = user.id === currentUser.id;
            const isExpanded = expandedUser === user.id;

            return (
              <div key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                {/* User row */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', cursor: 'pointer', transition: 'background 0.12s' }}
                  onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: ac.bg, color: ac.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600', flexShrink: 0 }}>
                    {user.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '500' }}>{user.name}</span>
                      {isMe && <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 7px', borderRadius: '20px', background: 'rgba(79,142,247,0.12)', color: 'var(--accent)' }}>You</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '1px' }}>{user.email}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', background: user.role === 'admin' ? 'rgba(249,168,50,0.15)' : 'rgba(79,142,247,0.12)', color: user.role === 'admin' ? 'var(--amber)' : 'var(--accent)' }}>
                    {user.role}
                  </span>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{userTxns.length} txns</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Joined {fmtDate(user.joinedAt)}</div>
                  </div>
                  {!isMe && (
                    <button
                      style={{ padding: '6px 12px', borderRadius: '8px', background: 'none', border: '1px solid rgba(242,90,90,0.3)', color: 'var(--red)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
                      onClick={e => { e.stopPropagation(); setConfirmDelete(user.id); }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(242,90,90,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                    >Delete</button>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text3)', flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {/* Expanded user detail */}
                {isExpanded && (
                  <div style={{ background: 'var(--bg3)', borderTop: '1px solid var(--border)', padding: '18px 20px' }} className="animate-fadein">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '18px' }}>
                      {[
                        { label: 'Phone', value: user.phone || '—' },
                        { label: 'Location', value: user.location || '—' },
                        { label: 'Total Income', value: fmt(userIncome) },
                        { label: 'Total Expenses', value: fmt(userExpenses) },
                      ].map(info => (
                        <div key={info.label}>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px' }}>{info.label}</div>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>{info.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Recent Transactions</div>
                    {userTxns.length === 0 ? (
                      <div style={{ fontSize: '13px', color: 'var(--text3)' }}>No transactions for this user.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', background: 'var(--card)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        {[...userTxns].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((tx, i, arr) => (
                          <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ fontSize: '18px' }}>{tx.emoji}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '13px', fontWeight: '500' }}>{tx.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{fmtDate(tx.date)} · {tx.category}</div>
                            </div>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: '500', color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                              {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                            </div>
                            <button
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '12px', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.15s' }}
                              onClick={() => dispatch({ type: 'DELETE_TRANSACTION', id: tx.id })}
                              onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(242,90,90,0.08)'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'none'; }}
                            >✕</button>
                          </div>
                        ))}
                        {userTxns.length > 5 && (
                          <div style={{ padding: '10px 16px', fontSize: '12px', color: 'var(--text3)', textAlign: 'center' }}>+{userTxns.length - 5} more transactions</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
