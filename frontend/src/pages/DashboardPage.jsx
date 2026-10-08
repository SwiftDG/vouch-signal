import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { assess } from '../lib/assessment';
import { csvTemplate, importActivity, parseDate } from '../lib/activityImport';
import MovingWave from '../components/MovingWave';
import './vouch.css';

const currency = value => `₦${value.toLocaleString('en-NG')}`;
const initial = { date: '', direction: 'in', amount: '', sender: '', description: '' };

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [manual, setManual] = useState(initial);
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data, error: authError }) => {
      if (!active) return;
      if (authError || !data.user) navigate('/login', { replace: true });
      else setUser(data.user);
      setChecking(false);
    });
    return () => { active = false; };
  }, [navigate]);
  const result = assess(rows);
  const importFile = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(''); setMessage('');
    if (file.size > 2_000_000) { setError('Choose a CSV smaller than 2 MB.'); return; }
    try {
      const parsed = importActivity(await file.text());
      setRows(parsed);
      setMessage(`${parsed.length} records loaded from ${file.name}. Your file stays in this browser tab and is cleared when you leave or reload.`);
    } catch (parseError) { setError(parseError.message); }
  };
  const addManual = event => {
    event.preventDefault(); setError('');
    try {
      const time = parseDate(manual.date);
      const amount = Number(manual.amount);
      if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter an amount greater than zero.');
      const sender = manual.sender.trim();
      if (!sender) throw new Error('Enter the customer or recipient name.');
      setRows(current => [...current, { id: `manual-${Date.now()}-${current.length}`, time, amount, direction: manual.direction, sender, reliableParty: true, description: manual.description.trim(), manuallyEntered: true }]);
      setManual(initial); setMessage('Transaction added to this session. Manually entered activity is not independently verified.');
    } catch (addError) { setError(addError.message); }
  };
  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csvTemplate], { type: 'text/csv;charset=utf-8' }));
    link.download = 'vouch-csv-template.csv'; link.click(); URL.revokeObjectURL(link.href);
  };
  const logout = async () => { setRows([]); await supabase.auth.signOut(); navigate('/login'); };
  if (checking || !user) return <main className="vouch-site loading-screen">Opening your account…</main>;
  return <main className="vouch-site account-site">
    <header className="site-nav"><Link to="/" className="wordmark">Vouch<span>.</span></Link><nav><span>{user.user_metadata?.full_name || user.email}</span><button className="nav-button" onClick={logout}>Sign out</button></nav></header>
    <section className="account-intro"><div><p className="small-label">Your trading activity</p><h1>See what your payments say about your business.</h1><p>Bring a CSV statement with dates, amounts and customer names, or enter transactions yourself. Vouch will show the pattern it can read and the records it leaves out.</p></div><p className="account-note">Your records are analysed on this device. Nothing is uploaded to Vouch. The score is an activity summary from the information you provide, not a verified credit score or loan decision.</p></section>
    <div className="account-grid">
      <section className="score-panel account-score" aria-live="polite"><MovingWave /><div className="score-content"><p className="eyebrow">Activity score</p><div className="score-number">{result.score}<span> of 620</span></div><p>{rows.length ? `Calculated from ${rows.length} supplied records.` : 'Add activity to see your score.'}</p><div className="measure-grid"><div><strong>{result.days}</strong><span>days with sales</span></div><div><strong>{result.customers}</strong><span>named payers</span></div><div><strong>{result.returning}</strong><span>repeat payers</span></div><div><strong>{result.span}</strong><span>days covered</span></div></div></div></section>
      <section className="import-panel"><h2>Bring your transactions</h2><p>Use a CSV file with <strong>date, direction, amount and counterparty</strong>. Credit and debit columns also work. Dates can be YYYY-MM-DD or DD/MM/YYYY. If the file has no named payer column, customer measures cannot be calculated from it.</p><label className="file-button">Choose CSV file<input type="file" accept=".csv,text/csv" onChange={importFile} /></label><button className="text-button" onClick={downloadTemplate}>Download a template</button><p className="privacy-note">Uploading replaces this session’s records. Close or reload the tab to clear them.</p></section>
    </div>
    <section className="manual-panel"><div><h2>Add a transaction</h2><p>You can enter a payment or outgoing transfer when you do not have a CSV. Entering a transaction does not verify that it happened.</p></div><form onSubmit={addManual}><label>Date<input type="date" required value={manual.date} onChange={event => setManual({ ...manual, date: event.target.value })} /></label><label>Direction<select value={manual.direction} onChange={event => setManual({ ...manual, direction: event.target.value })}><option value="in">Money received</option><option value="out">Money sent</option></select></label><label>Amount (₦)<input type="number" min="0.01" step="0.01" required value={manual.amount} onChange={event => setManual({ ...manual, amount: event.target.value })} /></label><label>Customer or recipient<input required value={manual.sender} onChange={event => setManual({ ...manual, sender: event.target.value })} /></label><button className="action dark">Add transaction</button></form></section>
    {error && <p className="account-feedback error" role="alert">{error}</p>}{message && <p className="account-feedback" role="status">{message}</p>}
    {rows.length > 0 && <section className="ledger account-ledger"><div className="ledger-heading"><div><p className="small-label">Your activity</p><h2>What the score used</h2></div><button className="text-button" onClick={() => { setRows([]); setMessage('Activity cleared from this tab.'); }}>Clear all records</button></div>{result.missingPayer > 0 && <p className="quality-note">{result.missingPayer} incoming records have no named payer. They count toward active days but cannot establish customer diversity or repeat customers.</p>}<div className="breakdown">{[['Days with sales',result.breakdown.tradingDays],['Named payers',result.breakdown.customers],['Repeat payers',result.breakdown.returning],['Length of activity',result.breakdown.history]].map(([label,value]) => <div key={label}><span>{label}</span><strong>+{value}</strong></div>)}</div><div className="ledger-list">{rows.slice().sort((a,b) => b.time-a.time).map(row => { const ignored = result.ignored.find(item => item.id === row.id); return <div key={row.id} className="ledger-row"><span>{new Date(row.time).toLocaleDateString('en-NG',{day:'2-digit',month:'short'})}</span><strong>{row.sender}</strong><span>{row.direction === 'out' ? '−' : '+'}{currency(row.amount)}</span><span className={ignored ? 'excluded' : 'counted'}>{row.direction === 'out' ? 'Outgoing transfer' : ignored?.reason || 'Counted'}</span></div>; })}</div></section>}
    <footer className="site-footer"><Link to="/" className="wordmark">Vouch<span>.</span></Link><span>The lender makes the lending decision.</span></footer>
  </main>;
}
