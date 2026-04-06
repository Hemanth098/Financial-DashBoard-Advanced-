import React from 'react';
import { useApp } from '../context/AppContext';
import { fmt, fmtDate, CAT_COLORS, cardStyle, getAvatarColor } from '../utils';

export default function ProfilePage() {
  const { state } = useApp();
  const { currentUser, db } = state;
  const isAdmin = currentUser.role === 'admin';
  const ac = getAvatarColor(currentUser.id);

  const myTxns = db.transactions.filter(t => t.userId === currentUser.id);
  const income = myTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = myTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeup">
      {/* Profile header card */}
      <div style={{ ...cardStyle, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: ac.bg, color: ac.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '600', flexShrink: 0, border: `2px solid ${ac.color}40` }}>
          {currentUser.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.5px', marginBottom: '4px' }}>{currentUser.name}</div>
          <div style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '10px' }}>{currentUser.email}</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', background: isAdmin ? 'rgba(249,168,50,0.15)' : 'rgba(79,142,247,0.12)', color: isAdmin ? 'var(--amber)' : 'var(--accent)' }}>
              {isAdmin ? '🔑 Admin' : '👁 Viewer'}
            </span>
            <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border2)' }}>
              Joined {fmtDate(currentUser.joinedAt)}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'Total Income', value: fmt(income), color: 'var(--green)' },
            { label: 'Total Expenses', value: fmt(expenses), color: 'var(--red)' },
            { label: 'Transactions', value: myTxns.length, color: 'var(--text)' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '600', letterSpacing: '-0.5px', fontFamily: 'var(--mono)', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Personal details */}
        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>Personal Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { label: 'Full Name', value: currentUser.name },
              { label: 'Email', value: currentUser.email },
              { label: 'Phone', value: currentUser.phone || '—' },
              { label: 'Location', value: currentUser.location || '—' },
              { label: 'Role', value: currentUser.role },
              { label: 'Member Since', value: fmtDate(currentUser.joinedAt) },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', padding: '12px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: '13px', color: 'var(--text3)', width: '120px', flexShrink: 0 }}>{row.label}</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* My recent transactions */}
        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>My Recent Transactions</div>
          {myTxns.length === 0 ? (
            <div style={{ fontSize: '14px', color: 'var(--text3)', textAlign: 'center', padding: '32px 0' }}>No transactions yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[...myTxns].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6).map((tx, i, arr) => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: tx.type === 'income' ? 'rgba(52,212,138,0.12)' : 'rgba(242,90,90,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{tx.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{fmtDate(tx.date)}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: '500', color: tx.type === 'income' ? 'var(--green)' : 'var(--red)', flexShrink: 0 }}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin note */}
      {isAdmin && (
        <div style={{ background: 'rgba(249,168,50,0.08)', border: '1px solid rgba(249,168,50,0.2)', borderRadius: '12px', padding: '14px 18px', fontSize: '13px', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🔑</span>
          You have Admin access — you can manage all users and transactions across the platform.
        </div>
      )}
    </div>
  );
}
