# PumpOps PWA V2 Prototype

Redesigned Progressive Web App prototypes centered around the actual **petrol pump operational workflow and Daily Sales Report (DSR) calculations**.

## Architecture & Implementation Principles

1. **Calculation-First Design**:
   - The application does not contain duplicate calculation logic on individual screens.
   - All formulas and validation rules are centralized in `shared/calculations.js` and exposed via the `window.PO` namespace.
   - Key calculation-chain screens have a "Tap to see calculation" drill-down sheet that shows the step-by-step formula.

2. **Global Field Language**:
   - Manually entered values: Standard editable text/number input fields.
   - Auto-calculated values: Marked with a blue `[AUTO]` badge and styled as readonly/non-editable fields (light blue background).
   - Source/Shift configurations (e.g. daily rates): Marked with a grey `[SHIFT PRICE]` badge (locked value).
   - Inherited values from previous shifts: Marked with a yellow `[PREVIOUS SHIFT]` badge (locked value).
   - Synced values: Marked with a green `[SYNCED]` badge.

3. **No Duplicate Data Entry**:
   - Users never type a value that can be derived from other fields.
   - Opening readings are matched against the previous shift's closing values; any mismatch prompts for validation and a mandatory override reason.

4. **Multi-Role User Experience**:
   - **DSM**: Simple, field-oriented flow (In-time, Opening Readings, Closing Readings, Payments, Out-time).
   - **Shift Manager**: Operations verification (Roster/Setup, verify DSM inputs with audit logging, Credit Sales, Cash Count, Tank DIP reconciliation, Settlement).
   - **Inventory/Supervisor**: Oil/Lube stock counts, deliveries, variance reporting.
   - **Owner**: Read-only reporting (Dashboard, DSR breakdown, Credit Ledger, Payroll with shift deductions, Analytics).

## Directory Structure

```
pwa-prototypes_v2/
├── index.html                # Main Interactive Screen Gallery
├── login.html                # Multi-role Sign-in
├── station-picker.html       # Station selection screen
├── shared/
│   ├── styles.css            # Industrial Design System
│   ├── calculations.js       # Centralized Calculation Engine
│   ├── mock-data.js          # Realistic Mock Data Store
│   └── app.js                # App Utilities (Sync, modals, toasts)
├── dsm/                      # DSM module screens
├── manager/                  # Shift Manager module screens
├── inventory/                # Inventory Supervisor screens
└── owner/                    # Owner Analytics/Reports screens
```
