// Deterministic, synthetic transactions for a product demonstration.
// This activity index is not a credit score or a prediction of repayment.
const base = [
  ["2026-09-10T10:00:00Z", "in", "Ada", 4800],
  ["2026-09-12T11:00:00Z", "in", "Bisi", 6200],
  ["2026-09-17T09:00:00Z", "in", "Chika", 3900],
  ["2026-09-19T14:00:00Z", "in", "Ada", 5200],
  ["2026-09-24T10:00:00Z", "in", "Dayo", 8500],
  ["2026-09-26T11:00:00Z", "in", "Bisi", 6000],
  ["2026-10-01T12:00:00Z", "in", "Ada", 4500],
  ["2026-10-03T10:00:00Z", "in", "Efe", 7200],
];

const extras = {
  repeat: [["2026-10-03T10:08:00Z", "in", "Efe", 1000], ["2026-10-03T10:19:00Z", "in", "Efe", 1000]],
  cycle: [["2026-10-04T09:00:00Z", "in", "Account X", 40000], ["2026-10-04T09:12:00Z", "out", "Account X", 40000]],
  outflow: [["2026-10-05T10:00:00Z", "in", "Account Y", 30000], ["2026-10-05T10:16:00Z", "out", "Other account", 29000]],
};

const toTransactions = (rows, label) => rows.map(([at, direction, party, amount], index) => ({
  id: `${label}-${index}`, at, direction, party, amount,
}));

export function assessTransactions(active = [], includeBase = true) {
  const transactions = [
    ...(includeBase ? toTransactions(base, "base") : []),
    ...active.flatMap((name) => toTransactions(extras[name], name)),
  ].sort((a, b) => a.at.localeCompare(b.at));

  const reviewed = transactions.map((transaction) => {
    if (transaction.direction === "out") return { ...transaction, status: "Outgoing", reason: "Shown for context; outgoing payments do not add points." };

    const time = Date.parse(transaction.at);
    const shortlyAfter = (other) => other.direction === "out" && Date.parse(other.at) > time && Date.parse(other.at) - time <= 24 * 60 * 60 * 1000;
    const cycle = transactions.some((other) => shortlyAfter(other) && other.party === transaction.party && other.amount === transaction.amount);
    if (cycle) return { ...transaction, status: "Excluded", reason: "Same amount sent back to the same account within 24 hours." };

    const rapidOutflow = transactions.some((other) => shortlyAfter(other) && Date.parse(other.at) - time <= 2 * 60 * 60 * 1000 && other.amount >= transaction.amount * 0.9);
    if (rapidOutflow) return { ...transaction, status: "Excluded", reason: "At least 90% moved out within two hours. Needs review, not proof of fraud." };

    const earlier = transactions.some((other) => other.direction === "in" && other.party === transaction.party && other.at.slice(0, 10) === transaction.at.slice(0, 10) && Date.parse(other.at) < time);
    if (earlier) return { ...transaction, status: "Grouped", reason: "This sender already counted today. Amount still appears in the ledger." };

    return { ...transaction, status: "Counted", reason: "One customer payment counted for this day." };
  });

  const counted = reviewed.filter((row) => row.status === "Counted");
  const unique = new Set(counted.map((row) => row.party)).size;
  const weeks = new Set(counted.map((row) => {
    const date = new Date(row.at);
    const start = Date.UTC(2026, 8, 10);
    return Math.floor((date.getTime() - start) / (7 * 86400000));
  })).size;
  const counts = counted.reduce((map, row) => map.set(row.party, (map.get(row.party) || 0) + 1), new Map());
  const returning = [...counts.values()].filter((count) => count > 1).length;
  const breakdown = [
    { label: "Account age", points: includeBase ? 144 : 0, explanation: includeBase ? "12 months in this made-up example" : "No activity loaded" },
    { label: "Active weeks", points: Math.min(weeks * 65, 260), explanation: `${weeks} weeks with counted payments` },
    { label: "Different customers", points: Math.min(unique * 25, 250), explanation: `${unique} different senders` },
    { label: "Returning customers", points: Math.min(returning * 40, 200), explanation: `${returning} senders on more than one day` },
  ];
  return {
    reviewed, breakdown,
    score: breakdown.reduce((sum, item) => sum + item.points, 0),
    counted: counted.length,
    excluded: reviewed.filter((row) => row.status === "Excluded").length,
    grouped: reviewed.filter((row) => row.status === "Grouped").length,
  };
}
