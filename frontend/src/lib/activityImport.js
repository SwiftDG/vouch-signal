const DATE_COLUMNS = ['date', 'transaction date', 'posted date', 'timestamp', 'time'];
const AMOUNT_COLUMNS = ['amount', 'transaction amount'];
const CREDIT_COLUMNS = ['credit', 'credit amount', 'paid in', 'deposit'];
const DEBIT_COLUMNS = ['debit', 'debit amount', 'paid out', 'withdrawal'];
const DIRECTION_COLUMNS = ['direction', 'type', 'transaction type', 'dr cr'];
const PARTY_COLUMNS = ['counterparty', 'payer', 'sender', 'customer', 'name'];
const DESCRIPTION_COLUMNS = ['description', 'narration', 'details', 'remarks'];
const normalize = value => String(value || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
const find = (header, aliases) => aliases.map(alias => header.indexOf(alias)).find(index => index >= 0) ?? -1;

export function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && input[i + 1] === '\n') i++;
      row.push(cell); if (row.some(value => value.trim())) rows.push(row);
      row = []; cell = '';
    } else cell += char;
  }
  if (quoted) throw new Error('The CSV contains an unfinished quoted field.');
  row.push(cell); if (row.some(value => value.trim())) rows.push(row);
  return rows;
}

export function parseDate(value) {
  const clean = String(value || '').trim();
  const dateParts = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  let date;
  if (dateParts) date = new Date(Number(dateParts[3]), Number(dateParts[2]) - 1, Number(dateParts[1]), Number(dateParts[4] || 12), Number(dateParts[5] || 0));
  else if (/^\d{4}-\d{2}-\d{2}/.test(clean)) date = new Date(clean.length === 10 ? `${clean}T12:00:00` : clean);
  else throw new Error(`Unrecognised date: ${clean}. Use YYYY-MM-DD or DD/MM/YYYY.`);
  if (Number.isNaN(date.getTime()) || (dateParts && (date.getDate() !== Number(dateParts[1]) || date.getMonth() !== Number(dateParts[2]) - 1))) throw new Error(`Invalid date: ${clean}`);
  return date.getTime();
}

export function importActivity(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error('Add a header and at least one transaction.');
  if (rows.length > 10001) throw new Error('Import at most 10,000 transactions at a time.');
  const header = rows[0].map(normalize);
  const date = find(header, DATE_COLUMNS), amount = find(header, AMOUNT_COLUMNS), credit = find(header, CREDIT_COLUMNS), debit = find(header, DEBIT_COLUMNS), direction = find(header, DIRECTION_COLUMNS), party = find(header, PARTY_COLUMNS), description = find(header, DESCRIPTION_COLUMNS);
  if (date < 0 || (amount < 0 && credit < 0 && debit < 0) || (direction < 0 && credit < 0 && debit < 0)) throw new Error('We need a date, an amount, and either direction or separate credit and debit columns. Download the CSV template to see the format.');
  const money = value => {
    const cleaned = String(value || '').replace(/[₦,\s]/g, '').trim();
    if (!cleaned) return 0;
    const n = Number(cleaned.replace(/[()]/g, ''));
    if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid amount: ${value}`);
    return n;
  };
  const output = rows.slice(1).map((cells, index) => {
    try {
      const time = parseDate(cells[date]);
      let value = amount >= 0 ? money(cells[amount]) : 0;
      let flow = '';
      if (direction >= 0) {
        const dir = normalize(cells[direction]);
        if (['in', 'incoming', 'credit', 'cr', 'deposit'].includes(dir)) flow = 'in';
        else if (['out', 'outgoing', 'debit', 'dr', 'withdrawal'].includes(dir)) flow = 'out';
      }
      if (!flow && credit >= 0 && money(cells[credit]) > 0) { flow = 'in'; value = money(cells[credit]); }
      if (!flow && debit >= 0 && money(cells[debit]) > 0) { flow = 'out'; value = money(cells[debit]); }
      if (!flow || value <= 0) throw new Error('Expected a positive amount and credit or debit direction.');
      const explicitParty = party >= 0 ? String(cells[party] || '').trim() : '';
      const note = description >= 0 ? String(cells[description] || '').trim() : '';
      return { id: `import-${index}`, time, amount: value, direction: flow, sender: explicitParty || (note ? `Narration: ${note}` : 'Unknown counterparty'), reliableParty: Boolean(explicitParty), description: note };
    } catch (error) { throw new Error(`Row ${index + 2}: ${error.message}`, { cause: error }); }
  });
  return output;
}

export const csvTemplate = 'date,direction,amount,counterparty,description\n2026-09-02,in,3800,Customer 01,Provision sale\n2026-09-03,in,5100,Customer 02,Provision sale\n2026-09-03,out,2200,Supplier,Stock purchase\n';
