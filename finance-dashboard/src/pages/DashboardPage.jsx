import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useApp } from '../context/AppContext';
import { fmt, fmtDate, CAT_COLORS, cardStyle } from '../utils';

Chart.register(...registerables);

const CHART_COLORS = ['#f9a832','#4f8ef7','#7c5cfc','#34d48a','#f25a5a','#2dd4bf'];

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const { currentUser, db, theme } = state;
  const isAdmin = currentUser?.role === 'admin';

  const myTxns = isAdmin
    ? db.transactions
    : db.transactions.filter(t => t.userId === currentUser.id);

  const income = myTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = myTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income - expenses;
  const balance = income - expenses;

  const recent = [...myTxns].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const trendRef = useRef(null);
  const donutRef = useRef(null);
  const trendChart = useRef(null);
  const donutChart = useRef(null);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#8b91a5' : '#5a6075';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const borderColor = isDark ? '#161921' : '#fff';

  useEffect(() => {
    // Donut chart
    if (donutRef.current) {
      if (donutChart.current) donutChart.current.destroy();
      const cats = {};
      myTxns.filter(t => t.type === 'expense').forEach(t => { cats[t.category] = (cats[t.category] || 0) + t.amount; });
      const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
      donutChart.current = new Chart(donutRef.current, {
        type: 'doughnut',
        data: {
          labels: entries.map(e => e[0]),
          datasets: [{ data: entries.map(e => e[1]), backgroundColor: CHART_COLORS, borderWidth: 2, borderColor, hoverOffset: 4 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '68%',
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + fmt(ctx.raw) } } }
        }
      });
    }
    // Trend chart
    if (trendRef.current) {
      if (trendChart.current) trendChart.current.destroy();
      trendChart.current = new Chart(trendRef.current, {
        type: 'line',
        data: {
          labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
          datasets: [
            { label: 'Balance', data: [balance*0.74, balance*0.8, balance*0.87, balance*0.9, balance*0.94, balance], borderColor: '#4f8ef7', backgroundColor: 'rgba(79,142,247,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#4f8ef7', pointRadius: 4, pointHoverRadius: 6, borderWidth: 2 },
            { label: 'Expenses', data: [expenses*0.87, expenses*1.03, expenses*1.12, expenses*0.95, expenses*0.93, expenses], borderColor: '#f25a5a', backgroundColor: 'rgba(242,90,90,0.04)', fill: false, tension: 0.4, pointBackgroundColor: '#f25a5a', pointRadius: 4, pointHoverRadius: 6, borderWidth: 2, borderDash: [5, 3] }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 12 } } },
            y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 12 }, callback: v => '$' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v) } }
          }
        }
      });
    }
    return () => {
      if (trendChart.current) trendChart.current.destroy();
      if (donutChart.current) donutChart.current.destroy();
    };
  }, [theme, db]);

  const cats = {};
  myTxns.filter(t => t.type === 'expense').forEach(t => { cats[t.category] = (cats[t.category] || 0) + t.amount; });
  const catEntries = Object.entries(cats).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeup">
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {[
          { label: 'Total Balance', value: fmt(balance), sub: '↑ 8.2% vs last month', subColor: 'var(--green)', accent: 'var(--accent)' },
          { label: 'Total Income', value: fmt(income), sub: `${myTxns.filter(t=>t.type==='income').length} transactions`, subColor: 'var(--text3)', accent: 'var(--green)' },
          { label: 'Total Expenses', value: fmt(expenses), sub: `${myTxns.filter(t=>t.type==='expense').length} transactions`, subColor: 'var(--text3)', accent: 'var(--red)' },
          { label: 'Net Savings', value: fmt(savings), sub: savings >= 0 ? 'Positive cash flow' : 'Review spending', subColor: savings >= 0 ? 'var(--green)' : 'var(--red)', accent: 'var(--accent2)' },
        ].map((card, i) => (
          <div key={i} style={{ ...cardStyle, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: card.accent }} />
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>{card.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '600', letterSpacing: '-1px', fontFamily: 'var(--mono)' }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: card.subColor, marginTop: '6px' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
        <div style={{ ...cardStyle, padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Balance Trend — 6 Months</div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
            {[['#4f8ef7','Balance'],['#f25a5a','Expenses']].map(([c,l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text2)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: c, display: 'inline-block' }} />
                {l}
              </span>
            ))}
          </div>
          <div style={{ position: 'relative', height: '200px' }}>
            <canvas ref={trendRef} />
          </div>
        </div>

        <div style={{ ...cardStyle, padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Spending by Category</div>
          <div style={{ position: 'relative', height: '160px', marginBottom: '14px' }}>
            <canvas ref={donutRef} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {catEntries.slice(0, 5).map((c, i) => (
              <span key={c[0]} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text2)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: CHART_COLORS[i], display: 'inline-block' }} />
                {c[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={cardStyle}>
        <div style={{ padding: '18px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Transactions</span>
          <button
            style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '8px', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)', cursor: 'pointer' }}
            onClick={() => dispatch({ type: 'SET_PAGE', page: 'transactions' })}
          >View all</button>
        </div>
        <div style={{ padding: '8px 0 4px' }}>
          {recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)', fontSize: '14px' }}>No transactions yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Transaction','Date','Category','Type','Amount'].map(h => (
                    <th key={h} style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '8px 20px', textAlign: h === 'Amount' ? 'right' : 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(tx => {
                  const user = db.users.find(u => u.id === tx.userId);
                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: tx.type === 'income' ? 'rgba(52,212,138,0.12)' : 'rgba(242,90,90,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>{tx.emoji}</div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>{tx.name}</div>
                            {isAdmin && user && <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{user.name}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text2)', padding: '12px 20px' }}>{fmtDate(tx.date)}</td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 9px', borderRadius: '20px', ...CAT_COLORS[tx.category] }}>{tx.category}</span>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '500', color: tx.type === 'income' ? 'var(--green)' : 'var(--text3)' }}>{tx.type}</td>
                      <td style={{ padding: '12px 20px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: '500', color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                        {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
