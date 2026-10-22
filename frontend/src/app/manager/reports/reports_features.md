# Reports Feature Map

## Module Purpose
Provides the Manager with exportable analytics across Revenue, Attendance, Member Churn, and Expense Breakdown. Uses ApexCharts for visualizations and supports CSV export per tab.

## Directory Structure
| Folder | Responsibility |
|---|---|
| `reports_components/ManagerReportsMain/` | Orchestrator — toolbar, tab switcher, wires KPIs + Charts + Table |
| `reports_components/ManagerReportsKPIs/` | 8-card KPI row (revenue, expenses, members, attendance, churn) |
| `reports_components/ManagerReportsCharts/` | ApexCharts per tab (bar, area, line, donut) |
| `reports_components/ManagerReportsTable/` | Tabular data view for each report tab |
| `reports_context/` | React Context bridging Zustand store with UI state (tab, date range) |
| `reports_store/` | Zustand store — owns async fetch + CSV export |
| `reports_api/` | API calls (mock until backend ready) |
| `reports_types/` | All TypeScript types |
| `reports_utils/` | Mock data, style maps, filter options |

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Status |
|---|---|---|---|---|
| Reports Dashboard | `/manager/reports` | KPIs + Charts + Table | `GET /manager/reports/summary` | ✅ Live (mock) |
| CSV Export | `/manager/reports` | Download per-tab CSV | `GET /manager/reports/export` | ✅ Live (mock) |

## Data and State Architecture
- Zustand store: `useManagerReportsStore` — owns `summary`, `fetchState`, `exporting`
- Context: `ReportsProvider` — owns `tab`, `dateRange`, `handleExportCSV`, `reload`
- Local state: none

## API Contract
- `reportsApi.fetchSummary(params)` → `ReportSummary`
- `reportsApi.exportReportCSV(tab, params)` → `Blob`

## Loading, Empty, Error States
- Loading: `loading.tsx` structural skeleton
- Error: `error.tsx` with retry button
- Empty: inline "no data" handled per chart/table

## Rule Compliance Checklist
- [x] Rule 1: Micro-modularization
- [x] Rule 7: Type isolation
- [x] Rule 8: Server/client boundary
- [x] Rule 9: Loading/error handling
- [x] Rule 14: Backend-driven messages
- [x] Rule 15C: State per decision matrix (Zustand for server state)
- [x] Design §10: ApexCharts only (no Recharts/Chart.js)
