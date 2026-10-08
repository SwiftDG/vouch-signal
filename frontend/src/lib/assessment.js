// An illustrative rule set for a deterministic, local demo. It is not a credit model.
const at = (day, hour = 10, minute = 0) => new Date(2026, 8, day, hour, minute).getTime();

export const sampleActivity = [
  { id: 'a', day: 2, sender: 'Customer 01', amount: 3800 },
  { id: 'b', day: 3, sender: 'Customer 02', amount: 5100 },
  { id: 'c', day: 5, sender: 'Customer 03', amount: 2700 },
  { id: 'd', day: 8, sender: 'Customer 01', amount: 4200 },
  { id: 'e', day: 10, sender: 'Customer 04', amount: 6000 },
  { id: 'f', day: 12, sender: 'Customer 05', amount: 3200 },
  { id: 'g', day: 16, sender: 'Customer 02', amount: 4800 },
  { id: 'h', day: 18, sender: 'Customer 06', amount: 2100 },
  { id: 'i', day: 22, sender: 'Customer 03', amount: 3900 },
  { id: 'j', day: 24, sender: 'Customer 07', amount: 5200 },
  { id: 'k', day: 27, sender: 'Customer 01', amount: 4400 },
  { id: 'l', day: 29, sender: 'Customer 08', amount: 3100 },
].map(row => ({ ...row, time: at(row.day), direction: 'in' }));

export const attempts = {
  circle: [
    { id: 'circle-in', day: 30, sender: 'Linked account', amount: 90000, time: at(30, 9), direction: 'in' },
    { id: 'circle-out', day: 30, sender: 'Linked account', amount: 90000, time: at(30, 9, 12), direction: 'out' },
  ],
  repeat: Array.from({ length: 5 }, (_, n) => ({ id: `repeat-${n}`, day: 29, sender: 'Customer 08', amount: 100, time: at(29, 10, 5 + n * 5), direction: 'in' })),
  passThrough: [
    { id: 'pass-in', day: 30, sender: 'New payer', amount: 80000, time: at(30, 11), direction: 'in' },
    { id: 'pass-out', day: 30, sender: 'Supplier transfer', amount: 80000, time: at(30, 11, 15), direction: 'out' },
  ],
};

export function assess(rows) {
  const inbound = rows.filter(r => r.direction === 'in').sort((a, b) => a.time - b.time);
  const outbound = rows.filter(r => r.direction === 'out');
  const kept = [];
  const ignored = [];
  for (const row of inbound) {
    const circular = outbound.some(out => out.sender === row.sender && out.amount >= row.amount * .9 && out.time > row.time && out.time - row.time <= 3600000);
    const passed = outbound.some(out => out.sender !== row.sender && out.amount >= row.amount * .9 && out.amount <= row.amount * 1.1 && out.time > row.time && out.time - row.time <= 3600000);
    const repeated = kept.some(prev => prev.sender === row.sender && prev.day === row.day && Math.abs(prev.time - row.time) <= 3600000);
    if (circular || passed || repeated) ignored.push({ ...row, reason: circular ? 'Returned to the same account' : passed ? 'Money moved straight out' : 'Same customer within an hour' });
    else kept.push(row);
  }
  const customers = new Set(kept.map(r => r.sender));
  const days = new Set(kept.map(r => r.day));
  const counts = [...customers].map(sender => kept.filter(r => r.sender === sender).length);
  const returning = counts.filter(n => n > 1).length;
  const span = kept.length ? Math.max(...kept.map(r => r.day)) - Math.min(...kept.map(r => r.day)) + 1 : 0;
  const breakdown = {
    tradingDays: Math.min(days.size * 12, 180),
    customers: Math.min(customers.size * 18, 180),
    returning: Math.min(returning * 28, 140),
    history: Math.min(span * 4, 120),
  };
  return { score: Object.values(breakdown).reduce((a, b) => a + b, 0), breakdown, customers: customers.size, returning, days: days.size, span, kept, ignored };
}
