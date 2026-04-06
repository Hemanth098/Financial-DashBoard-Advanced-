import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useApp } from '../context/AppContext';
import { fmt, cardStyle } from '../utils';

Chart.register(...registerables);

export default function InsightsPage() {
  const { state } = useApp();
  const { currentUser, db, theme } = state;
  const isAdmin = currentUser.role === 'admin';
  const myTxns = isAdmin ? db.transactions : db.transactions.filter(t => t.userId === currentUser.id);

  const monthlyRef = useRef(null);
  const monthlyChart = useRef(null);

  const income = myTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = myTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round(savings / income * 100) : 0;

  const cats = {};
  myTxns.filter(t => t.type === 'expense').forEach(t => { cats[t.category] = (cats[t.category] || 0) + t.amount; });
  const catEntries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const topCat = catEntries[0] || ['—', 0];
  const totalExp = catEntries.reduce((s, c) => s + c[1], 0);
  const avgExpense = myTxns.filter(t => t.type === 'expense').length > 0
    ? Math.round(expenses / myTxns.filter(t => t.type === 'expense').length) : 0;
  const maxIncome = Math.max(...myTxns.filter(t => t.type === 'income').map(t => t.amount), 0);

  const months = ['2024-01','2024-02','2024-03'];
  const monthNames = { '2024-01': 'January', '2024-02': 'February', '2024-03': 'March' };
  const monthData = months.map(m => {
    const txs = myTxns.filter(t => t.date.startsWith(m));
    const inc = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { month: monthNames[m], inc, exp, net: inc - exp };
  });

  const isDark = theme === 'dark';
  const textColor = isDark ? '#8b91a5' : '#5a6075';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  useEffect(() => {
    if (!monthlyRef.current) return;
    if (monthlyChart.current) monthlyChart.current.destroy();
    monthlyChart.current = new Chart(monthlyRef.current, {
      type: 'bar',
      data: {
        labels: monthData.map(m => m.month),
        datasets: [
          { label: 'Income', data: monthData.map(m => m.inc), backgroundColor: 'rgba(52,212,138,0.7)', borderRadius: 6, borderSkipped: false },
          { label: 'Expenses', data: monthData.map(m => m.exp), backgroundColor: 'rgba(242,90,90,0.7)', borderRadius: 6, borderSkipped: false },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => '$' + v } }
        }
      }
    });
    return () => { if (monthlyChart.current) monthlyChart.current.destroy(); };
  }, [theme, db]);

  const COLORS = ['#f9a832','#4f8ef7','#7c5cfc','#34d48a','#f25a5a','#2dd4bf','#8b91a5','#f472b6'];

  const insights = [
    { icon: '🔥', label: 'Top Spending Category', value: topCat[0], note: fmt(topCat[1]) + ' total', color: 'rgba(242,90,90,0.15)', tc: 'var(--red)' },
    { icon: '💰', label: 'Savings Rate', value: savingsRate + '%', note: 'of total income', color: 'rgba(52,212,138,0.15)', tc: 'var(--green)' },
    { icon: '📊', label: 'Avg Expense', value: fmt(avgExpense), note: 'per transaction', color: 'rgba(79,142,247,0.15)', tc: 'var(--accent)' },
    { icon: '📈', label: 'Highest Income', value: fmt(maxIncome), note: 'single transaction', color: 'rgba(52,212,138,0.12)', tc: 'var(--green)' },
    { icon: '🧾', label: 'Total Transactions', value: myTxns.length, note: `${myTxns.filter(t=>t.type==='income').length} in · ${myTxns.filter(t=>t.type==='expense').length} out`, color: 'rgba(124,92,252,0.15)', tc: 'var(--accent2)' },
    { icon: '✅', label: 'Net Cash Flow', value: fmt(savings), note: savings >= 0 ? 'Positive — great!' : 'Review spending', color: savings >= 0 ? 'rgba(52,212,138,0.12)' : 'rgba(242,90,90,0.12)', tc: savings >= 0 ? 'var(--green)' : 'var(--red)' },
  ];

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeup">
      {/* Insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: ins.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>{ins.icon}</div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '4px' }}>{ins.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.5px', color: ins.tc }}>{ins.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '4px' }}>{ins.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {/* Monthly chart */}
        <div style={{ ...cardStyle, padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Monthly Income vs Expenses</div>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            {[['rgba(52,212,138,0.7)','Income'],['rgba(242,90,90,0.7)','Expenses']].map(([c,l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text2)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: c, display: 'inline-block' }} />
                {l}
              </span>
            ))}
          </div>
          <div style={{ position: 'relative', height: '220px' }}>
            <canvas ref={monthlyRef} />
          </div>
        </div>

        {/* Category bars */}
        <div style={{ ...cardStyle, padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '18px' }}>Top Spending Categories</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {catEntries.slice(0, 6).map((c, i) => (
              <div key={c[0]}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{c[0]}</span>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--mono)', color: 'var(--text)' }}>{fmt(c[1])}</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg3)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round(c[1]/totalExp*100)}%`, background: COLORS[i], borderRadius: '99px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
            {catEntries.length === 0 && <div style={{ fontSize: '14px', color: 'var(--text3)', textAlign: 'center', padding: '20px 0' }}>No expense data.</div>}
          </div>
        </div>
      </div>

      {/* Monthly comparison table */}
      <div style={cardStyle}>
        <div style={{ padding: '18px 20px 0' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Monthly Summary</span>
        </div>
        <div style={{ padding: '8px 0 4px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Month','Income','Expenses','Net','Savings Rate'].map(h => (
                  <th key={h} style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 20px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthData.map((m, i) => {
                const sp = m.inc > 0 ? Math.round(m.net / m.inc * 100) : 0;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 20px', fontWeight: '500' }}>{m.month} 2024</td>
                    <td style={{ padding: '12px 20px', color: 'var(--green)', fontFamily: 'var(--mono)' }}>+{fmt(m.inc)}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--red)', fontFamily: 'var(--mono)' }}>-{fmt(m.exp)}</td>
                    <td style={{ padding: '12px 20px', fontWeight: '600', fontFamily: 'var(--mono)', color: m.net >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt(m.net)}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: sp >= 30 ? 'var(--green)' : 'var(--text2)' }}>{sp}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
