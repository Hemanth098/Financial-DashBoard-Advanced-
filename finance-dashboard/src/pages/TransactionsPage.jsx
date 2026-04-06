import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fmt, fmtDate, CAT_COLORS, EMOJIS, cardStyle } from '../utils';

const CATS = ['food','transport','shopping','health','entertainment','utilities','salary','freelance'];

export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const { currentUser, db } = state;
  const isAdmin = currentUser.role === 'admin';

  const allTxns = isAdmin ? db.transactions : db.transactions.filter(t => t.userId === currentUser.id);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const [form, setForm] = useState({ name: '', amount: '', type: 'expense', category: 'food', date: new Date().toISOString().split('T')[0], targetUserId: currentUser.id });
  const [formMsg, setFormMsg] = useState(null);

  const filtered = allTxns.filter(tx => {
    if (filter !== 'all' && tx.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const user = db.users.find(u => u.id === tx.userId);
      if (!tx.name.toLowerCase().includes(q) && !tx.category.includes(q) && !(user?.name.toLowerCase().includes(q))) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sort === 'date-desc') return new Date(b.date) - new Date(a.date);
    if (sort === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sort === 'amount-desc') return b.amount - a.amount;
    return a.amount - b.amount;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    dispatch({
      type: 'ADD_TRANSACTION',
      userId: isAdmin ? Number(form.targetUserId) : currentUser.id,
      tx: {
        name: form.name,
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        emoji: EMOJIS[form.category] || '💰',
      }
    });
    setFormMsg('Transaction added!');
    setForm(f => ({ ...f, name: '', amount: '' }));
    setTimeout(() => setFormMsg(null), 2500);
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this transaction?')) return;
    dispatch({ type: 'DELETE_TRANSACTION', id });
  }

  function exportCSV() {
    const rows = [['Name','Date','Category','Type','Amount','User']];
    filtered.forEach(t => {
      const user = db.users.find(u => u.id === t.userId);
      rows.push([t.name, t.date, t.category, t.type, t.amount, user?.name || '']);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'finflow_transactions.csv';
    a.click();
  }

  const FilterBtn = ({ val, label }) => (
    <button
      style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s', borderColor: filter === val ? 'var(--accent)' : 'var(--border2)', background: filter === val ? 'rgba(79,142,247,0.1)' : 'var(--bg3)', color: filter === val ? 'var(--accent)' : 'var(--text2)' }}
      onClick={() => { setFilter(val); setPage(1); }}
    >{label}</button>
  );

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeup">
      {/* Admin: Add Transaction */}
      {isAdmin && (
        <div style={{ ...cardStyle, padding: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Add Transaction</div>
          {formMsg && <div style={{ background: 'rgba(52,212,138,0.1)', border: '1px solid rgba(52,212,138,0.3)', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: 'var(--green)', marginBottom: '12px' }}>{formMsg}</div>}
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 1fr', gap: '12px', marginBottom: '12px' }}>
              {[
                { label: 'Name', el: <input style={inputStyle} placeholder="Transaction name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /> },
                { label: 'Amount ($)', el: <input style={inputStyle} type="number" placeholder="0.00" min="0" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required /> },
                { label: 'Date', el: <input style={inputStyle} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /> },
                { label: 'Type', el: <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option value="expense">Expense</option><option value="income">Income</option></select> },
                { label: 'Category', el: <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>{CATS.map(c => <option key={c} value={c}>{c}</option>)}</select> },
                { label: 'Assign to User', el: <select style={inputStyle} value={form.targetUserId} onChange={e => setForm(f => ({ ...f, targetUserId: e.target.value }))}>{db.users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}</select> },
              ].map(({ label, el }) => (
                <div key={label}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '5px' }}>{label}</label>
                  {el}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ padding: '9px 20px', borderRadius: '9px', background: 'var(--accent)', color: '#fff', border: 'none', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}>Add Transaction</button>
              <button type="button" style={{ padding: '9px 20px', borderRadius: '9px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border2)', fontSize: '13.5px', cursor: 'pointer' }} onClick={exportCSV}>Export CSV</button>
            </div>
          </form>
        </div>
      )}

      {/* Viewer banner */}
      {!isAdmin && (
        <div style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          You are in Viewer mode — showing only your transactions. Contact an admin to modify data.
        </div>
      )}

      {/* Table card */}
      <div style={cardStyle}>
        <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {filtered.length} Transaction{filtered.length !== 1 ? 's' : ''}
          </span>
          {!isAdmin && (
            <button style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '8px', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)', cursor: 'pointer' }} onClick={exportCSV}>Export CSV</button>
          )}
        </div>
        <div style={{ padding: '14px 20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '180px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input style={{ ...inputStyle, paddingLeft: '32px' }} placeholder={isAdmin ? 'Search by name, category, user...' : 'Search by name or category...'} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <FilterBtn val="all" label="All" />
          <FilterBtn val="income" label="Income" />
          <FilterBtn val="expense" label="Expense" />
          <select style={{ ...inputStyle, width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>
        <div style={{ padding: '8px 0 4px', overflowX: 'auto' }}>
          {paged.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text3)', fontSize: '14px' }}>No transactions match your filters.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr>
                  {['Transaction', isAdmin ? 'User' : null, 'Date', 'Category', 'Type', 'Amount', isAdmin ? 'Actions' : null].filter(Boolean).map(h => (
                    <th key={h} style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 20px', textAlign: h === 'Amount' || h === 'Actions' ? 'right' : 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map(tx => {
                  const user = db.users.find(u => u.id === tx.userId);
                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: tx.type === 'income' ? 'rgba(52,212,138,0.12)' : 'rgba(242,90,90,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{tx.emoji}</div>
                          <span style={{ fontSize: '14px', fontWeight: '500' }}>{tx.name}</span>
                        </div>
                      </td>
                      {isAdmin && <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--text2)' }}>{user?.name || '—'}</td>}
                      <td style={{ padding: '12px 20px', fontSize: '13px', color: 'var(--text2)' }}>{fmtDate(tx.date)}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '20px', ...CAT_COLORS[tx.category] }}>{tx.category}</span>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '500', color: tx.type === 'income' ? 'var(--green)' : 'var(--text3)' }}>{tx.type}</td>
                      <td style={{ padding: '12px 20px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: '500', color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                        {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                          <button
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '12px', padding: '4px 8px', borderRadius: '6px', transition: 'all 0.15s' }}
                            onClick={() => handleDelete(tx.id)}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(242,90,90,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.background = 'none'; }}
                          >Delete</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text3)', marginRight: 'auto' }}>
              {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.12s', borderColor: p === page ? 'var(--accent)' : 'var(--border2)', background: p === page ? 'var(--accent)' : 'var(--bg3)', color: p === page ? '#fff' : 'var(--text2)' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
  borderRadius: '9px', padding: '8px 12px', fontSize: '13.5px', color: 'var(--text)',
  outline: 'none',
};
