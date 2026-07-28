/**
 * PumpOps V2 — Centralized Realistic Mock Data
 * Single source of truth for all prototype screens.
 *
 * All Indian currency: ₹1,23,456.78
 * All readings/litres to 2 decimal places.
 */

'use strict';

const MOCK = {

  // ─── Station ──────────────────────────────────────────────
  station: {
    name:    'SPS Bharat Petroleum',
    code:    'SPS-BPC-001',
    city:    'Pune',
    state:   'Maharashtra',
    dealer:  'Suresh P. Sharma',
    licNo:   'MHBP-2018-0042',
  },

  // ─── Current Session ──────────────────────────────────────
  currentDate: '27 Jul 2026',
  currentTime: '14:32',
  currentUser: {
    id:   'U-007',
    name: 'Rajesh Joshi',
    role: 'Shift Manager',
    initials: 'RJ',
  },

  // ─── Shifts ───────────────────────────────────────────────
  shifts: [
    {
      id:      'S1',
      label:   'Morning Shift',
      start:   '06:00',
      end:     '14:00',
      status:  'CLOSED',
      total:   418650,
      litres:  3824,
    },
    {
      id:      'S2',
      label:   'Evening Shift',
      start:   '14:00',
      end:     '22:00',
      status:  'ACTIVE',
      total:   0,        // still accumulating
      litres:  0,
    },
  ],

  // ─── Fuel Grades & Rates ──────────────────────────────────
  grades: [
    { code: 'MS',    name: 'Petrol (MS)',     rate: 104.72, color: '#16a34a' },
    { code: 'HSD',   name: 'Diesel (HSD)',    rate:  92.40, color: '#2563eb' },
    { code: 'Speed', name: 'Speed (Premium)', rate: 113.50, color: '#d97706' },
  ],

  // ─── Tanks ────────────────────────────────────────────────
  tanks: [
    { id: 'T1', label: 'MS T-1',    grade: 'MS',    openDip: 12820, receipts: 5000, meteredSales: 4500, closeDip: null },
    { id: 'T2', label: 'MS T-2',    grade: 'MS',    openDip: 10200, receipts:    0, meteredSales: 3100, closeDip: null },
    { id: 'T3', label: 'HSD T-3',   grade: 'HSD',   openDip: 18450, receipts:    0, meteredSales: 3824, closeDip: null },
    { id: 'T4', label: 'Speed T-4', grade: 'Speed', openDip:  5200, receipts:    0, meteredSales:  320, closeDip: null },
  ],

  // ─── MPDs & Nozzles ───────────────────────────────────────
  mpds: [
    {
      id: 'MPD01', label: 'MPD 01',
      nozzles: [
        { id: 'N01', label: 'N01', grade: 'MS',  tank: 'T1',
          prevClose: 88201.00, opening: 88201.00, closing: 88562.00, testing: 2.00 },
        { id: 'N02', label: 'N02', grade: 'HSD', tank: 'T3',
          prevClose: 128450.00, opening: 128450.00, closing: 129102.00, testing: 2.00 },
      ],
    },
    {
      id: 'MPD02', label: 'MPD 02',
      nozzles: [
        { id: 'N03', label: 'N03', grade: 'HSD', tank: 'T3',
          prevClose: 74210.00, opening: 74210.00, closing: 74862.00, testing: 0.00 },
        { id: 'N04', label: 'N04', grade: 'MS',  tank: 'T2',
          prevClose: 43820.00, opening: 43820.00, closing: 44178.00, testing: 1.00 },
      ],
    },
    {
      id: 'MPD03', label: 'MPD 03',
      nozzles: [
        { id: 'N05', label: 'N05', grade: 'Speed', tank: 'T4',
          prevClose: 22100.00, opening: 22100.00, closing: 22420.00, testing: 0.00 },
        { id: 'N06', label: 'N06', grade: 'MS',    tank: 'T1',
          prevClose: 61840.00, opening: 61840.00, closing: 62052.00, testing: 0.00 },
      ],
    },
  ],

  // ─── DSMs ─────────────────────────────────────────────────
  dsms: [
    {
      id: 'D01', name: 'Amit Kumar',    initials: 'AK',
      mpd: 'MPD01', bays: [1, 2],
      nozzles: ['N01', 'N02'],
      inTime: '06:02', outTime: '14:15',
      status: 'SUBMITTED',  // ACTIVE | SUBMITTED | VERIFIED
      submittedAt: '14:15',
      payDiff: 0,
      attendance: 'Present',
    },
    {
      id: 'D02', name: 'Sachin Patil',  initials: 'SP',
      mpd: 'MPD02', bays: [1, 2],
      nozzles: ['N03', 'N04'],
      inTime: '06:05', outTime: null,
      status: 'ACTIVE',
      payDiff: 0,
      attendance: 'Present',
    },
    {
      id: 'D03', name: 'Omkar Shinde',  initials: 'OS',
      mpd: 'MPD03', bays: [1],
      nozzles: ['N05', 'N06'],
      inTime: '06:01', outTime: '14:10',
      status: 'VERIFIED',
      submittedAt: '14:10',
      payDiff: -250,   // cash shortage
      attendance: 'Present',
    },
    {
      id: 'D04', name: 'Priya Nair',    initials: 'PN',
      mpd: 'MPD01', bays: [1],
      nozzles: ['N01'],
      inTime: '14:02', outTime: null,
      status: 'ACTIVE',
      payDiff: 0,
      attendance: 'Present',
    },
    {
      id: 'D05', name: 'Ravi Kulkarni', initials: 'RK',
      mpd: 'MPD02', bays: [2],
      nozzles: ['N04'],
      inTime: '14:08', outTime: null,
      status: 'ACTIVE',
      payDiff: 0,
      attendance: 'Late',
    },
    {
      id: 'D06', name: 'Deepak More',   initials: 'DM',
      mpd: 'MPD03', bays: [1, 2],
      nozzles: ['N05', 'N06'],
      inTime: '14:00', outTime: null,
      status: 'ACTIVE',
      payDiff: 0,
      attendance: 'Present',
    },
  ],

  // ─── DSM Payment Entries (Morning shift — Amit Kumar) ────
  amitPayments: [
    { id: 'P01', mode: 'Cash',     subType: null,        amount: 40000 },
    { id: 'P02', mode: 'UPI',      subType: 'PhonePe',   amount: 12500 },
    { id: 'P03', mode: 'UPI',      subType: 'Paytm',     amount:  4200 },
    { id: 'P04', mode: 'UPI',      subType: 'Pinelab',   amount:  3400 },
    { id: 'P05', mode: 'Card',     subType: 'Pinelab',   amount:  8200 },
    { id: 'P06', mode: 'Loyalty',  subType: 'BPCL SmartFleet', amount: 2100 },
    { id: 'P07', mode: 'Credit',   subType: 'Shree Logistics', amount: 5000 },
  ],

  // ─── Credit Customers ────────────────────────────────────
  creditCustomers: [
    {
      id: 'C01', name: 'Shree Logistics',   outstanding: 82400, limit: 100000,
      vehicles: ['MH 12 AB 1234', 'MH 12 AB 5678', 'MH 14 CD 2222'],
      oldestAgeDays: 18, overdueAmount: 12400,
    },
    {
      id: 'C02', name: 'City Taxi Union',   outstanding: 45200, limit: 75000,
      vehicles: ['MH 01 TA 0001', 'MH 01 TA 0002'],
      oldestAgeDays: 8,  overdueAmount: 0,
    },
    {
      id: 'C03', name: 'Apex Transport',    outstanding: 18900, limit: 50000,
      vehicles: ['MH 14 EF 9900'],
      oldestAgeDays: 35, overdueAmount: 18900,
    },
    {
      id: 'C04', name: 'Sahyadri Cargo',    outstanding: 6200,  limit: 25000,
      vehicles: ['MH 09 GH 4400'],
      oldestAgeDays: 3,  overdueAmount: 0,
    },
  ],

  // ─── Credit Transactions (today) ─────────────────────────
  creditTransactions: [
    { id: 'CT01', customerId: 'C01', vehicle: 'MH 12 AB 1234',
      product: 'HSD', qty: 45.00, rate: 92.40, amount: 4158, time: '08:42', dsm: 'Amit Kumar' },
    { id: 'CT02', customerId: 'C02', vehicle: 'MH 01 TA 0001',
      product: 'MS',  qty: 30.00, rate: 104.72, amount: 3141.60, time: '09:15', dsm: 'Sachin Patil' },
    { id: 'CT03', customerId: 'C03', vehicle: 'MH 14 EF 9900',
      product: 'HSD', qty: 80.00, rate: 92.40, amount: 7392, time: '10:30', dsm: 'Omkar Shinde' },
  ],

  // ─── Adjustments (today) ────────────────────────────────
  adjustments: [
    { id: 'A01', type: 'expense',  category: 'Tea',             dsm: null,              amount: 120,  note: 'Morning tea' },
    { id: 'A02', type: 'short',    category: 'Cash Shortage',   dsm: 'D03',             amount: 250,  note: 'Cash shortage — morning shift' },
    { id: 'A03', type: 'promo',    category: 'Sales Promo',     dsm: 'D02',             amount: 100,  note: 'Premium fuel incentive' },
    { id: 'A04', type: 'expense',  category: 'Loading Allowance', dsm: null,            amount: 200,  note: 'Tanker unloading' },
  ],

  // ─── Denominations ───────────────────────────────────────
  denominations: [
    { denomination: 500, count: 240 },
    { denomination: 200, count: 100 },
    { denomination: 100, count: 300 },
    { denomination:  50, count:  60 },
    { denomination:  20, count:  40 },
    { denomination:  10, count:  30 },
  ],

  // ─── Payment Gateways ────────────────────────────────────
  gateways: [
    { id: 'GW1', name: 'PhonePe',    systemAmt: 82400,  gatewayAmt: 82400,  bankSettled: 82350, after12Current: 1200, after12Prev: 800 },
    { id: 'GW2', name: 'Paytm',      systemAmt: 42800,  gatewayAmt: 42750,  bankSettled: 42750, after12Current:  400, after12Prev: 200 },
    { id: 'GW3', name: 'Pinelab UPI',systemAmt: 28600,  gatewayAmt: 28600,  bankSettled: 28600, after12Current:  600, after12Prev:   0 },
    { id: 'GW4', name: 'Pinelab Card',systemAmt: 35200, gatewayAmt: 35200,  bankSettled: 35200, after12Current:    0, after12Prev: 100 },
    { id: 'GW5', name: 'ALP',        systemAmt:  8100,  gatewayAmt:  8100,  bankSettled:  8100, after12Current:    0, after12Prev:   0 },
    { id: 'GW6', name: 'SBI Redeem', systemAmt:  4200,  gatewayAmt:  4200,  bankSettled:  4200, after12Current:    0, after12Prev:   0 },
    { id: 'GW7', name: 'AGS',        systemAmt: 18900,  gatewayAmt: 18900,  bankSettled: 18850, after12Current:  200, after12Prev:  50 },
  ],

  // ─── Inventory Products ──────────────────────────────────
  products: [
    { id: 'OL01', name: 'Engine Oil 1L',    category: 'Oil',   unit: 'Bottles', opening: 50, received: 20, sold: 12, physical: 57, reorderLevel: 15 },
    { id: 'OL02', name: 'Engine Oil 5L',    category: 'Oil',   unit: 'Cans',    opening: 18, received:  0, sold:  4, physical: 14, reorderLevel:  5 },
    { id: 'OL03', name: 'Gear Oil 1L',      category: 'Oil',   unit: 'Bottles', opening: 12, received:  0, sold:  3, physical:  9, reorderLevel:  5 },
    { id: 'LB01', name: 'Grease 500g',      category: 'Lube',  unit: 'Units',   opening:  8, received:  0, sold:  2, physical:  6, reorderLevel:  3 },
    { id: 'AC01', name: 'Air Freshener',    category: 'Acc',   unit: 'Pcs',     opening: 24, received: 12, sold: 18, physical: 18, reorderLevel: 10 },
    { id: 'AC02', name: 'Windshield Wiper', category: 'Acc',   unit: 'Pairs',   opening:  6, received:  0, sold:  1, physical:  5, reorderLevel:  2 },
  ],

  // ─── Audit Log ───────────────────────────────────────────
  auditLog: [
    {
      id: 'AL01', timestamp: '27 Jul · 10:42',
      module: 'DSM Payment', dsm: 'Amit Kumar',
      field: 'PhonePe', oldValue: '₹12,300', newValue: '₹12,500',
      changedBy: 'Rajesh Joshi', role: 'Shift Manager',
      reason: 'Wrong PhonePe total — corrected from receipt',
    },
    {
      id: 'AL02', timestamp: '27 Jul · 09:15',
      module: 'Nozzle Reading', dsm: 'Omkar Shinde',
      field: 'N05 Closing', oldValue: '22,415.00', newValue: '22,420.00',
      changedBy: 'Rajesh Joshi', role: 'Shift Manager',
      reason: 'Misread meter — corrected after physical check',
    },
    {
      id: 'AL03', timestamp: '26 Jul · 22:05',
      module: 'Credit Sale', dsm: 'Sachin Patil',
      field: 'Quantity', oldValue: '40.00 L', newValue: '30.00 L',
      changedBy: 'Rajesh Joshi', role: 'Shift Manager',
      reason: 'Vehicle stopped early — partial fill',
    },
  ],

  // ─── DSR Summary (Morning Shift — pre-computed for prototype) ─
  dsrMorning: {
    shiftLabel: 'Morning Shift',
    date: '27 Jul 2026',
    totalSales: 418650,
    gradeBreakdown: [
      { grade: 'MS',    litres: 1573.00, rate: 104.72, amount: 164796.56 },
      { grade: 'HSD',   litres: 1904.00, rate:  92.40, amount: 175929.60 },
      { grade: 'Speed', litres:  320.00, rate: 113.50, amount:  36320.00 },
    ],
    collections: [
      { mode: 'Cash',    amount: 182000 },
      { mode: 'UPI',     amount: 121500 },
      { mode: 'Card',    amount:  68200 },
      { mode: 'Credit',  amount:  38650 },
      { mode: 'Loyalty', amount:   8300 },
    ],
    cashVariance: -50,
    tankVariances: [
      { tank: 'MS T-1', expected: 13320, physical: 13300, variance: -20 },
      { tank: 'MS T-2', expected: 7100,  physical: 7102,  variance:   2 },
      { tank: 'HSD T-3',expected: 14626, physical: 14623, variance:  -3 },
      { tank: 'Speed T-4', expected: 4880, physical: 4880, variance: 0 },
    ],
    adjustments: { expenses: 320, shortages: 250, incentives: 100 },
  },

  // ─── Owner KPIs ──────────────────────────────────────────
  ownerKPIs: {
    todaySales:    862450,
    yesterdaySales:822800,
    fuelSold:       6842,
    cashVariance:    -420,
    tankVariance:     -18,
    settlementDiff:   120,
    creditOutstanding: 152700,
  },

  // ─── Alerts ──────────────────────────────────────────────
  alerts: [
    { id: 'AL1', severity: 'red',   module: 'Inventory',    message: 'HSD T-3 below 15,000 L — order required', time: '13:45' },
    { id: 'AL2', severity: 'red',   module: 'Credit',       message: 'Shree Logistics ₹82,400 — 18 days overdue', time: '10:00' },
    { id: 'AL3', severity: 'amber', module: 'Cash',         message: 'Amit Kumar cash shortage ₹400 — morning shift', time: '14:20' },
    { id: 'AL4', severity: 'amber', module: 'Settlement',   message: 'PhonePe settlement difference ₹50 detected', time: '13:00' },
    { id: 'AL5', severity: 'amber', module: 'Inventory',    message: 'Engine Oil 1L: 57 bottles — below reorder', time: '08:00' },
  ],
};

// Expose globally
window.MOCK = MOCK;

// ─── Additional Mock Data ─────────────────────────────────────
MOCK.expenseCategories = [
  'Tea / Refreshments', 'Cleaning Supplies', 'Stationary',
  'Maintenance', 'Loading Allowance', 'Miscellaneous',
];

MOCK.qualityChecks = [
  {
    id: 'QC01', timestamp: '2026-07-27T06:30:00', dsmId: 'D01', dsmName: 'Amit Kumar',
    checks: [
      { nozzle: 'N01', grade: 'MS',  colour: true, clarity: true, density: '0.728', pass: true },
      { nozzle: 'N02', grade: 'HSD', colour: true, clarity: true, density: '0.835', pass: true },
    ],
    notes: 'All clear — morning opening check',
  },
  {
    id: 'QC02', timestamp: '2026-07-27T08:30:00', dsmId: 'D01', dsmName: 'Amit Kumar',
    checks: [
      { nozzle: 'N01', grade: 'MS',  colour: true, clarity: true, density: '0.729', pass: true },
      { nozzle: 'N02', grade: 'HSD', colour: true, clarity: true, density: '0.836', pass: true },
    ],
    notes: '',
  },
];

MOCK.dipHistory = [
  {
    id: 'DIP01', date: '27 Jul 2026',
    openingStock: { petrolT1: 12820, petrolT2: 10200, speedT4: 5200, dieselT3: 18450 },
    density:      { petrol: 0.728, speed: 0.722, diesel: 0.836 },
    enteredBy: 'Rajesh Joshi', enteredAt: '06:05',
    notes: 'Normal day, all tanks adequate',
  },
  {
    id: 'DIP02', date: '26 Jul 2026',
    openingStock: { petrolT1: 15000, petrolT2: 11400, speedT4: 6100, dieselT3: 20000 },
    density:      { petrol: 0.727, speed: 0.721, diesel: 0.835 },
    enteredBy: 'Rajesh Joshi', enteredAt: '06:02',
    notes: '',
  },
];

MOCK.fuelOrders = [
  {
    id: 'FO01', fuelType: 'HSD', quantity: 12000, unit: 'L',
    supplier: 'BPCL Distributor — Pune', expectedDate: '28 Jul 2026',
    status: 'PENDING', orderedBy: 'Rajesh Joshi', orderedAt: '2026-07-27T10:00:00',
    notes: 'T-3 going low, priority order',
  },
  {
    id: 'FO02', fuelType: 'MS', quantity: 8000, unit: 'L',
    supplier: 'BPCL Distributor — Pune', expectedDate: '27 Jul 2026',
    status: 'DELIVERED', orderedBy: 'Rajesh Joshi', orderedAt: '2026-07-26T09:00:00',
    notes: '',
  },
];

MOCK.bays = [
  { id: 1, label: 'Bay 1' },
  { id: 2, label: 'Bay 2' },
];

MOCK.shifts = [
  { id: 'S1', label: 'Morning', start: '06:00', end: '14:00', status: 'CLOSED' },
  { id: 'S2', label: 'Evening', start: '14:00', end: '22:00', status: 'ACTIVE' },
  { id: 'S3', label: 'Night',   start: '22:00', end: '06:00', status: 'UPCOMING' },
];

// Re-expose
window.MOCK = MOCK;
