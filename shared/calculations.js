/**
 * PumpOps V2 — Calculation Engine
 * All DSR calculations live here. No duplicates across screens.
 *
 * RULE: The system calculates. The user provides raw operational facts.
 */

'use strict';

// ─── Formatting ───────────────────────────────────────────────
/**
 * Format a number as Indian Rupees: ₹1,23,456.78
 */
function formatINR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹—';
  const n = Number(amount);
  const abs = Math.abs(n);
  const str = abs.toFixed(2);
  const [intPart, decPart] = str.split('.');
  let result = intPart;
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const rest  = intPart.slice(0, -3);
    const restFormatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = restFormatted + ',' + last3;
  }
  const sign = n < 0 ? '−₹' : '₹';
  return sign + result + '.' + decPart;
}

/**
 * Format litres to 2 decimal places: 652.00 L
 */
function formatLitres(litres) {
  if (litres === null || litres === undefined || isNaN(litres)) return '— L';
  return Number(litres).toFixed(2) + ' L';
}

/**
 * Format a compact amount: ₹4.18L
 */
function formatINRCompact(amount) {
  const n = Number(amount);
  if (isNaN(n)) return '₹—';
  if (n >= 1_00_000) return '₹' + (n / 1_00_000).toFixed(2) + 'L';
  if (n >= 1_000)    return '₹' + (n / 1_000).toFixed(1) + 'k';
  return '₹' + n.toFixed(0);
}

// ─── Nozzle / Fuel Calculations ───────────────────────────────
/**
 * Gross Sale = Closing Reading − Opening Reading
 * @param {number} opening
 * @param {number} closing
 * @returns {number|null} gross litres, or null if invalid
 */
function calculateGrossSale(opening, closing) {
  opening = Number(opening);
  closing = Number(closing);
  if (isNaN(opening) || isNaN(closing)) return null;
  if (closing < opening) return null;           // validation: closing must be >= opening
  return closing - opening;
}

/**
 * Net Sale = Gross Sale − Testing Litres
 * @param {number} gross
 * @param {number} testing
 * @returns {number|null}
 */
function calculateNetSale(gross, testing) {
  gross   = Number(gross);
  testing = Number(testing || 0);
  if (isNaN(gross) || gross < 0) return null;
  if (testing > gross) return null;             // validation: testing cannot exceed gross
  return gross - testing;
}

/**
 * Sale Amount = Net Litres × Fuel Rate per litre
 * @param {number} netLitres
 * @param {number} rate  – rate per litre in ₹
 * @returns {number|null}
 */
function calculateSaleAmount(netLitres, rate) {
  netLitres = Number(netLitres);
  rate      = Number(rate);
  if (isNaN(netLitres) || isNaN(rate)) return null;
  if (netLitres < 0 || rate <= 0) return null;
  return Math.round(netLitres * rate * 100) / 100;
}

// ─── Payment Calculations ─────────────────────────────────────
/**
 * Sum all payment entries.
 * @param {Array<{amount: number}>} entries
 * @returns {number}
 */
function calculatePaymentTotal(entries) {
  if (!Array.isArray(entries)) return 0;
  return entries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

/**
 * Payment Difference = Expected Collection − Total Collected
 * Positive = under-collected; Negative = over-collected
 * @param {number} expected
 * @param {number} collected
 * @returns {number}
 */
function calculatePaymentDifference(expected, collected) {
  return Number(expected) - Number(collected);
}

// ─── Cash Denomination ────────────────────────────────────────
/**
 * Subtotal for one denomination row
 * @param {number} denomination  e.g. 500
 * @param {number} count
 * @returns {number}
 */
function calculateDenominationSubtotal(denomination, count) {
  return Number(denomination) * Math.max(0, Number(count) || 0);
}

/**
 * Total counted cash from all denomination rows
 * @param {Array<{denomination: number, count: number}>} denominations
 * @returns {number}
 */
function calculateCountedCash(denominations) {
  if (!Array.isArray(denominations)) return 0;
  return denominations.reduce(
    (sum, d) => sum + calculateDenominationSubtotal(d.denomination, d.count),
    0
  );
}

/**
 * Cash Variance = Counted − Expected
 * Negative = shortage; Positive = surplus
 * @param {number} counted
 * @param {number} expected
 * @returns {number}
 */
function calculateCashVariance(counted, expected) {
  return Number(counted) - Number(expected);
}

// ─── Tank DIP Calculations ────────────────────────────────────
/**
 * Expected Closing Stock = Opening + Receipts − Metered Sales
 * @param {number} opening    litres
 * @param {number} receipts   litres (tanker deliveries)
 * @param {number} sales      litres (from nozzle readings)
 * @returns {number}
 */
function calculateExpectedTankClosing(opening, receipts, sales) {
  opening  = Number(opening)  || 0;
  receipts = Number(receipts) || 0;
  sales    = Number(sales)    || 0;
  return opening + receipts - sales;
}

/**
 * Tank Variance = Physical Closing − Expected Closing
 * Negative = loss/shortage; Positive = gain (unusual)
 * @param {number} physical
 * @param {number} expected
 * @returns {number}
 */
function calculateTankVariance(physical, expected) {
  return Number(physical) - Number(expected);
}

// ─── Credit Calculations ──────────────────────────────────────
/**
 * Available Credit = Limit − Current Outstanding
 * @param {number} limit
 * @param {number} outstanding
 * @returns {number}
 */
function calculateCreditAvailable(limit, outstanding) {
  return Number(limit) - Number(outstanding);
}

/**
 * Credit Outstanding after a new sale
 * @param {number} outstanding
 * @param {number} sale
 * @returns {number}
 */
function calculateCreditAfterSale(outstanding, sale) {
  return Number(outstanding) + Number(sale);
}

/**
 * Credit utilization percentage
 * @param {number} outstanding
 * @param {number} limit
 * @returns {number} 0–100
 */
function calculateCreditUtilization(outstanding, limit) {
  if (!limit) return 0;
  return Math.round((Number(outstanding) / Number(limit)) * 100);
}

// ─── Adjustments ─────────────────────────────────────────────
/**
 * Total of all adjustments (expenses are negative, incentives positive)
 * @param {number} expenses
 * @param {number} shortages
 * @param {number} incentives
 * @returns {number}  net impact on cash (negative = money out)
 */
function calculateAdjustmentTotal(expenses, shortages, incentives) {
  return -(Number(expenses) || 0) - (Number(shortages) || 0) + (Number(incentives) || 0);
}

// ─── Digital Settlement ───────────────────────────────────────
/**
 * Settlement Difference = Gateway Sale − Bank Settled
 * Negative = bank settled less than gateway reported
 * @param {number} gatewaySale
 * @param {number} bankSettled
 * @returns {number}
 */
function calculateSettlementDifference(gatewaySale, bankSettled) {
  return Number(bankSettled) - Number(gatewaySale);
}

/**
 * Adjusted Receivable = Gateway Sale − After12AmCurrentDay + After12AmPrevDay
 * @param {number} gatewaySale
 * @param {number} after12Current  payments after midnight this day
 * @param {number} after12Prev     payments after midnight previous day
 * @returns {number}
 */
function calculateAdjustedSettlement(gatewaySale, after12Current, after12Prev) {
  return Number(gatewaySale) - Number(after12Current || 0) + Number(after12Prev || 0);
}

// ─── DSR Aggregations ────────────────────────────────────────
/**
 * Sum DSM sale amounts for a specific grade
 * @param {Array} dsmEntries
 * @param {string} grade  'MS' | 'HSD' | 'Speed'
 * @returns {number}
 */
function calculateGradeTotalAmount(dsmEntries, grade) {
  return dsmEntries
    .filter(e => e.grade === grade)
    .reduce((sum, e) => sum + (Number(e.saleAmount) || 0), 0);
}

/**
 * Sum DSM net litres for a specific grade
 */
function calculateGradeTotalLitres(dsmEntries, grade) {
  return dsmEntries
    .filter(e => e.grade === grade)
    .reduce((sum, e) => sum + (Number(e.netLitres) || 0), 0);
}

/**
 * Total shift sales from all DSM entries
 */
function calculateShiftTotal(dsmEntries) {
  return dsmEntries.reduce((sum, e) => sum + (Number(e.saleAmount) || 0), 0);
}

/**
 * Full-day total = Shift 1 + Shift 2 (NEVER manually entered)
 */
function calculateFullDayTotal(shift1Total, shift2Total) {
  return Number(shift1Total) + Number(shift2Total);
}

// ─── Performance ─────────────────────────────────────────────
/**
 * Calculate DSM daily score (0–100)
 * @param {Object} metrics
 * @returns {number}
 */
function calculateDSMScore(metrics) {
  const weights = {
    attendance:      15,
    punctuality:     10,
    litresVsTarget:  30,
    cashVariance:    25,
    complaints:      10,
    upsell:          10
  };
  let score = 0;
  // Attendance: 0 or full
  if (metrics.attendancePresent) score += weights.attendance;
  // Punctuality: based on minutes late
  const lateMin = Number(metrics.minutesLate) || 0;
  score += weights.punctuality * Math.max(0, (30 - lateMin) / 30);
  // Litres vs Target
  const litresAchieved = Math.min(1, (Number(metrics.litresSold) || 0) / (Number(metrics.litresTarget) || 500));
  score += weights.litresVsTarget * litresAchieved;
  // Cash variance: ₹0 is 100%, scale down
  const variance = Math.abs(Number(metrics.cashVariance) || 0);
  score += weights.cashVariance * Math.max(0, (500 - variance) / 500);
  // Complaints
  const complaints = Number(metrics.complaints) || 0;
  score += weights.complaints * Math.max(0, (3 - complaints) / 3);
  // Upsell (lube sales)
  const upsell = Number(metrics.upsellSales) || 0;
  score += weights.upsell * Math.min(1, upsell / 500);

  return Math.round(Math.min(100, Math.max(0, score)));
}

// ─── Validation Helpers ────────────────────────────────────────
function validateClosingReading(opening, closing) {
  if (closing < opening) return 'Closing reading cannot be less than opening.';
  return null;
}
function validateTesting(gross, testing) {
  if (testing > gross) return 'Testing cannot exceed gross sale.';
  if (testing < 0)     return 'Testing cannot be negative.';
  return null;
}
function validatePaymentAmount(amount) {
  if (amount < 0) return 'Amount cannot be negative.';
  return null;
}
function validateCreditSale(customer, vehicle, product, qty) {
  if (!customer) return 'Customer is required.';
  if (!vehicle)  return 'Vehicle number is required.';
  if (!product)  return 'Product is required.';
  if (qty <= 0)  return 'Quantity must be greater than zero.';
  return null;
}

// ─── Expected Cash Derivation ─────────────────────────────────
/**
 * Expected Cash = Total Sales
 *               − Non-cash collections (UPI + Card + Credit + Loyalty)
 *               − Credit sales total
 *               + Shortages (manager recovers from staff)
 *               − Expenses
 * @param {Object} p
 */
function calculateExpectedCash(p) {
  const totalSales   = Number(p.totalSales)   || 0;
  const upi          = Number(p.upi)          || 0;
  const card         = Number(p.card)         || 0;
  const credit       = Number(p.credit)       || 0;
  const loyalty      = Number(p.loyalty)      || 0;
  const expenses     = Number(p.expenses)     || 0;
  const shortages    = Number(p.shortages)    || 0;
  return totalSales - upi - card - credit - loyalty - expenses + shortages;
}

/**
 * Build Daily Sales Report structure from components
 */
function buildDSR({ grades, payments, adjustments, dsmPerformance }) {
  const gradeBreakdown = (grades || []).map(g => {
    const netSale = (Number(g.litres) || 0) - (Number(g.testing) || 0);
    const saleAmount = netSale * (Number(g.rate) || 0);
    return {
      name: g.name,
      rate: Number(g.rate) || 0,
      grossSale: Number(g.litres) || 0,
      testing: Number(g.testing) || 0,
      netSale,
      saleAmount,
    };
  });

  const totalSaleAmount = gradeBreakdown.reduce((sum, g) => sum + g.saleAmount, 0);
  const totalLitres = gradeBreakdown.reduce((sum, g) => sum + g.grossSale, 0);
  const totalCollections = (payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const collectionDiff = totalCollections - totalSaleAmount;

  const adjustmentBreakdown = (adjustments || []).map(a => ({
    label: a.label,
    amount: Number(a.amount) || 0,
    type: a.type,
  }));
  const totalAdjustments = adjustmentBreakdown.reduce((sum, a) => sum + a.amount, 0);

  const parsedDsmPerf = (dsmPerformance || []).map(d => ({
    name: d.name,
    litres: Number(d.litres) || 0,
    shortage: Number(d.short) || 0,
  }));

  return {
    gradeBreakdown,
    totalSaleAmount,
    totalLitres,
    paymentBreakdown: payments || [],
    totalCollections,
    collectionDiff,
    adjustmentBreakdown,
    totalAdjustments,
    dsmPerformance: parsedDsmPerf,
  };
}

/**
 * Calculate DSM monthly/period payroll
 */
function calculateDSMPayroll({ baseSalary, presentDays, totalDays, shortages, advances }) {
  const tDays = Number(totalDays) || 30;
  const pDays = Number(presentDays) || 0;
  const ratePerShift = (Number(baseSalary) || 0) / tDays;
  const gross = ratePerShift * pDays;
  const net = gross - Math.abs(Number(advances) || 0) - Math.abs(Number(shortages) || 0);
  return Math.round(net);
}

/**
 * Calculate DSM Performance Score
 */
function calculatePerformanceScore(litres, shortages, complaints, baseSalary) {
  let score = 85;
  if (litres > 8000) score += 10;
  else if (litres > 7000) score += 5;
  else if (litres < 6000) score -= 10;

  if (shortages < 0) {
    score -= Math.min(20, Math.round(Math.abs(shortages) / 50));
  }
  if (complaints > 0) {
    score -= complaints * 10;
  }
  return Math.round(Math.min(100, Math.max(0, score)));
}

// Expose everything on a global namespace for prototype use
window.PO = {
  formatINR,
  formatLitres,
  formatINRCompact,
  calculateGrossSale,
  calculateNetSale,
  calculateSaleAmount,
  calculatePaymentTotal,
  calculatePaymentDifference,
  calculateDenominationSubtotal,
  calculateCountedCash,
  calculateCashVariance,
  calculateExpectedTankClosing,
  calculateTankVariance,
  calculateCreditAvailable,
  calculateCreditAfterSale,
  calculateCreditUtilization,
  calculateAdjustmentTotal,
  calculateSettlementDifference,
  calculateAdjustedSettlement,
  calculateGradeTotalAmount,
  calculateGradeTotalLitres,
  calculateShiftTotal,
  calculateFullDayTotal,
  calculateDSMScore,
  validateClosingReading,
  validateTesting,
  validatePaymentAmount,
  validateCreditSale,
  calculateExpectedCash,
  buildDSR,
  calculateDSMPayroll,
  calculatePerformanceScore,
};

