# Repository Analysis Report

This report provides a file-by-file analysis of all tracked files in the repository.

## High-level architecture
- `backend/`: FastAPI-based fraud detection API and data utilities.
- `frontend/`: Next.js application with dashboard pages and reusable UI components.
- `README.md`: Project setup and overview.

## `backend/requirements.txt`
- Type: Text source/config file (.txt).
- Size: 48 bytes, 5 lines.
- Content starts with: `fastapi`
- Purpose: build/tooling/style configuration or helper module.

## `backend/main.py`
- Type: Text source/config file (.py).
- Size: 4717 bytes, 197 lines.
- Python module analysis: 7 function(s), 0 class(es).
- Key functions: normalize_columns, clean_data, calculate_risk, analyze_dataframe, get_dashboard, get_claims, simulate_attack
- Main dependencies/import roots: fastapi, pandas, os, random

## `backend/data/claims.xlsx`
- Type: Binary/asset file (.xlsx).
- Size: 98580 bytes.
- Purpose: Spreadsheet dataset used by backend fraud analysis pipeline.

## `backend/data/dataset.xlsx`
- Type: Binary/asset file (.xlsx).
- Size: 98580 bytes.
- Purpose: Spreadsheet dataset used by backend fraud analysis pipeline.

## `backend/services/cleaner.py`
- Type: Text source/config file (.py).
- Size: 626 bytes, 31 lines.
- Python module analysis: 1 function(s), 0 class(es).
- Key functions: clean_data
- Main dependencies/import roots: pandas

## `backend/services/analyzer.py`
- Type: Text source/config file (.py).
- Size: 1673 bytes, 61 lines.
- Python module analysis: 3 function(s), 0 class(es).
- Key functions: compute_fraud_score, analyze_dataframe, risk_label
- Main dependencies/import roots: pandas

## `backend/fraud_engine.py`
- Type: Text source/config file (.py).
- Size: 1072 bytes, 49 lines.
- Python module analysis: 3 function(s), 0 class(es).
- Key functions: clean_data, calculate_risk, analyze_dataframe
- Main dependencies/import roots: pandas

## `backend/__pycache__/fraud_engine.cpython-314.pyc`
- Type: Binary/asset file (.pyc).
- Size: 1834 bytes.
- Purpose: Python bytecode cache artifact; build/runtime-generated, not source logic.

## `backend/__pycache__/fraud_detector.cpython-314.pyc`
- Type: Binary/asset file (.pyc).
- Size: 698 bytes.
- Purpose: Python bytecode cache artifact; build/runtime-generated, not source logic.

## `backend/__pycache__/main.cpython-314.pyc`
- Type: Binary/asset file (.pyc).
- Size: 6725 bytes.
- Purpose: Python bytecode cache artifact; build/runtime-generated, not source logic.

## `README.md`
- Type: Text source/config file (.md).
- Size: 0 bytes, 0 lines.
- Documentation analysis: project overview and usage instructions.

## `frontend/tsconfig.json`
- Type: Text source/config file (.json).
- Size: 695 bytes, 42 lines.
- JSON config keys: compilerOptions, include, exclude

## `frontend/hooks/use-mobile.ts`
- Type: Text source/config file (.ts).
- Size: 565 bytes, 20 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: useIsMobile
- Main imports: react

## `frontend/hooks/use-toast.ts`
- Type: Text source/config file (.ts).
- Size: 3945 bytes, 192 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: reducer
- Main imports: react, @/components/ui/toast

## `frontend/package-lock.json`
- Type: Text source/config file (.json).
- Size: 155443 bytes, 4321 lines.
- JSON config keys: name, version, lockfileVersion, requires, packages

## `frontend/package.json`
- Type: Text source/config file (.json).
- Size: 2256 bytes, 73 lines.
- JSON config keys: name, version, private, scripts, dependencies, devDependencies

## `frontend/next-env.d.ts`
- Type: Text source/config file (.ts).
- Size: 249 bytes, 6 lines.
- TypeScript analysis: 0 named export declaration(s) found.

## `frontend/lib/api.ts`
- Type: Text source/config file (.ts).
- Size: 744 bytes, 33 lines.
- TypeScript analysis: 0 named export declaration(s) found.

## `frontend/lib/app-context.tsx`
- Type: Text source/config file (.tsx).
- Size: 10724 bytes, 352 lines.
- TypeScript analysis: 2 named export declaration(s) found.
- Exported symbols: AppProvider, useApp
- Main imports: react

## `frontend/lib/utils.ts`
- Type: Text source/config file (.ts).
- Size: 166 bytes, 7 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: cn
- Main imports: clsx, tailwind-merge

## `frontend/tailwind.config.ts`
- Type: Text source/config file (.ts).
- Size: 365 bytes, 20 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: tailwindcss

## `frontend/app/layout.tsx`
- Type: Text source/config file (.tsx).
- Size: 1183 bytes, 39 lines.
- TypeScript analysis: 3 named export declaration(s) found.
- Exported symbols: metadata, viewport, RootLayout
- Structure hint: Contains a default export page/layout component.
- Main imports: next, next/font/google, @vercel/analytics/next, @/lib/app-context

## `frontend/components/theme-toggle.tsx`
- Type: Text source/config file (.tsx).
- Size: 708 bytes, 27 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: ThemeToggle
- Main imports: react, lucide-react, @/components/ui/button

## `frontend/app/register/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 7149 bytes, 191 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: RegisterPage
- Structure hint: Contains a default export page/layout component.
- Main imports: react, next/navigation, @/lib/app-context, @/components/ui/button, @/components/ui/input, @/components/ui/label, @/components/ui/card, lucide-react, next/link

## `frontend/app/mode-select/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 4981 bytes, 114 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: ModeSelectPage
- Structure hint: Contains a default export page/layout component.
- Main imports: react, next/navigation, @/lib/app-context, @/components/ui/card, lucide-react

## `frontend/app/dashboard/layout.tsx`
- Type: Text source/config file (.tsx).
- Size: 3092 bytes, 80 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: DashboardLayout
- Structure hint: Contains a default export page/layout component.
- Main imports: react, next/navigation, @/lib/app-context, @/components/dashboard-sidebar, @/components/ui/badge, @/components/ui/button, lucide-react

## `frontend/app/dashboard/ledger/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 7230 bytes, 177 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: LedgerExplorerPage
- Structure hint: Contains a default export page/layout component.
- Main imports: @/lib/app-context, @/components/ui/card, @/components/ui/badge, @/lib/utils, lucide-react

## `frontend/app/dashboard/fraud/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 7730 bytes, 201 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: FraudIntelPage
- Structure hint: Contains a default export page/layout component.
- Main imports: react, @/lib/app-context, @/components/ui/card, @/components/ui/badge, @/lib/utils, lucide-react

## `frontend/app/dashboard/upload/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 8455 bytes, 235 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: DatasetUploadPage
- Structure hint: Contains a default export page/layout component.
- Main imports: react, next/navigation, @/lib/app-context, @/components/ui/card, @/components/ui/button, @/components/ui/progress, @/components/ui/badge, lucide-react, @/lib/api, uploaded

## `frontend/app/dashboard/threats/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 9508 bytes, 268 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: ThreatMonitorPage
- Structure hint: Contains a default export page/layout component.
- Main imports: react, @/lib/app-context, @/components/ui/card, @/components/ui/button, @/components/ui/badge, @/lib/utils, @/lib/api, lucide-react

## `frontend/app/dashboard/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 3952 bytes, 129 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: DatasetUploadPage
- Structure hint: Contains a default export page/layout component.
- Main imports: react, next/navigation, @/lib/app-context, @/components/ui/card, @/components/ui/button, @/components/ui/progress, @/components/ui/badge, lucide-react, @/lib/api

## `frontend/app/dashboard/admin/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 8918 bytes, 243 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: AdminPanelPage
- Structure hint: Contains a default export page/layout component.
- Main imports: @/lib/app-context, @/components/ui/card, @/components/ui/button, @/components/ui/badge, @/lib/utils, lucide-react

## `frontend/app/globals.css`
- Type: Text source/config file (.css).
- Size: 5006 bytes, 138 lines.
- Content starts with: `@import 'tailwindcss';`
- Purpose: build/tooling/style configuration or helper module.

## `frontend/app/page.tsx`
- Type: Text source/config file (.tsx).
- Size: 1438 bytes, 52 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: CommandCenterPage
- Structure hint: Contains a default export page/layout component.
- Main imports: react, next/navigation, @/lib/app-context, @/components/dashboard/metric-cards, @/components/dashboard/transaction-chart, @/components/dashboard/fraud-gauge, @/components/dashboard/recent-transactions, @/lib/api

## `frontend/components/ui/sheet.tsx`
- Type: Text source/config file (.tsx).
- Size: 4092 bytes, 140 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-dialog, lucide-react, @/lib/utils

## `frontend/components/ui/toggle-group.tsx`
- Type: Text source/config file (.tsx).
- Size: 1927 bytes, 74 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-toggle-group, class-variance-authority, @/lib/utils, @/components/ui/toggle

## `frontend/components/ui/tabs.tsx`
- Type: Text source/config file (.tsx).
- Size: 1971 bytes, 67 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-tabs, @/lib/utils

## `frontend/components/ui/card.tsx`
- Type: Text source/config file (.tsx).
- Size: 1990 bytes, 93 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @/lib/utils

## `frontend/components/ui/separator.tsx`
- Type: Text source/config file (.tsx).
- Size: 700 bytes, 29 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-separator, @/lib/utils

## `frontend/components/ui/resizable.tsx`
- Type: Text source/config file (.tsx).
- Size: 2030 bytes, 57 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, lucide-react, react-resizable-panels, @/lib/utils

## `frontend/components/ui/pagination.tsx`
- Type: Text source/config file (.tsx).
- Size: 2713 bytes, 128 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, lucide-react, @/lib/utils, @/components/ui/button

## `frontend/components/ui/switch.tsx`
- Type: Text source/config file (.tsx).
- Size: 1174 bytes, 32 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-switch, @/lib/utils

## `frontend/components/ui/skeleton.tsx`
- Type: Text source/config file (.tsx).
- Size: 276 bytes, 14 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: @/lib/utils

## `frontend/components/ui/tooltip.tsx`
- Type: Text source/config file (.tsx).
- Size: 1893 bytes, 62 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-tooltip, @/lib/utils

## `frontend/components/ui/alert-dialog.tsx`
- Type: Text source/config file (.tsx).
- Size: 3867 bytes, 158 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-alert-dialog, @/lib/utils, @/components/ui/button

## `frontend/components/ui/dialog.tsx`
- Type: Text source/config file (.tsx).
- Size: 3985 bytes, 144 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-dialog, lucide-react, @/lib/utils

## `frontend/components/ui/collapsible.tsx`
- Type: Text source/config file (.tsx).
- Size: 800 bytes, 34 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: @radix-ui/react-collapsible

## `frontend/components/ui/menubar.tsx`
- Type: Text source/config file (.tsx).
- Size: 8404 bytes, 277 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-menubar, lucide-react, @/lib/utils

## `frontend/components/ui/accordion.tsx`
- Type: Text source/config file (.tsx).
- Size: 2054 bytes, 67 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-accordion, lucide-react, @/lib/utils

## `frontend/components/ui/radio-group.tsx`
- Type: Text source/config file (.tsx).
- Size: 1467 bytes, 46 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-radio-group, lucide-react, @/lib/utils

## `frontend/components/ui/chart.tsx`
- Type: Text source/config file (.tsx).
- Size: 9786 bytes, 354 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, recharts, @/lib/utils

## `frontend/components/ui/field.tsx`
- Type: Text source/config file (.tsx).
- Size: 6055 bytes, 245 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, class-variance-authority, @/lib/utils, @/components/ui/label, @/components/ui/separator

## `frontend/components/ui/select.tsx`
- Type: Text source/config file (.tsx).
- Size: 6259 bytes, 186 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-select, lucide-react, @/lib/utils

## `frontend/components/ui/slider.tsx`
- Type: Text source/config file (.tsx).
- Size: 1990 bytes, 64 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-slider, @/lib/utils

## `frontend/components/ui/button.tsx`
- Type: Text source/config file (.tsx).
- Size: 2143 bytes, 61 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-slot, class-variance-authority, @/lib/utils

## `frontend/components/ui/toggle.tsx`
- Type: Text source/config file (.tsx).
- Size: 1571 bytes, 48 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-toggle, class-variance-authority, @/lib/utils

## `frontend/components/ui/use-toast.ts`
- Type: Text source/config file (.ts).
- Size: 3945 bytes, 192 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: reducer
- Main imports: react, @/components/ui/toast

## `frontend/components/ui/textarea.tsx`
- Type: Text source/config file (.tsx).
- Size: 760 bytes, 19 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @/lib/utils

## `frontend/components/theme-provider.tsx`
- Type: Text source/config file (.tsx).
- Size: 292 bytes, 12 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: ThemeProvider
- Main imports: react, next-themes

## `frontend/components/dashboard/metric-cards.tsx`
- Type: Text source/config file (.tsx).
- Size: 1725 bytes, 59 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: MetricCards
- Main imports: @/lib/app-context, @/components/ui/card, lucide-react

## `frontend/components/dashboard/transaction-chart.tsx`
- Type: Text source/config file (.tsx).
- Size: 2548 bytes, 79 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: TransactionChart
- Main imports: react, @/lib/app-context, @/components/ui/card, recharts

## `frontend/components/ui/input.tsx`
- Type: Text source/config file (.tsx).
- Size: 963 bytes, 22 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @/lib/utils

## `frontend/components/dashboard/recent-transactions.tsx`
- Type: Text source/config file (.tsx).
- Size: 1123 bytes, 46 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: RecentTransactions
- Main imports: react, @/lib/app-context, @/lib/api, @/components/ui/card, @/components/ui/badge, @/lib/utils

## `frontend/components/dashboard/fraud-gauge.tsx`
- Type: Text source/config file (.tsx).
- Size: 2654 bytes, 80 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: FraudGauge
- Main imports: @/lib/app-context, @/components/ui/card, recharts

## `frontend/components/dashboard-sidebar.tsx`
- Type: Text source/config file (.tsx).
- Size: 4641 bytes, 137 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: DashboardSidebar
- Main imports: next/link, next/navigation, lucide-react, @/lib/utils, @/lib/app-context, @/components/ui/badge, @/components/theme-toggle

## `frontend/next.config.mjs`
- Type: Text source/config file (.mjs).
- Size: 181 bytes, 12 lines.
- Content starts with: `/** @type {import('next').NextConfig} */`
- Purpose: build/tooling/style configuration or helper module.

## `frontend/postcss.config.mjs`
- Type: Text source/config file (.mjs).
- Size: 144 bytes, 9 lines.
- Content starts with: `/** @type {import('postcss-load-config').Config} */`
- Purpose: build/tooling/style configuration or helper module.

## `frontend/components.json`
- Type: Text source/config file (.json).
- Size: 427 bytes, 22 lines.
- JSON config keys: $schema, style, rsc, tsx, tailwind, aliases, iconLibrary

## `frontend/styles/globals.css`
- Type: Text source/config file (.css).
- Size: 4353 bytes, 126 lines.
- Content starts with: `@import 'tailwindcss';`
- Purpose: build/tooling/style configuration or helper module.

## `frontend/pnpm-lock.yaml`
- Type: Text source/config file (.yaml).
- Size: 133118 bytes, 3209 lines.
- Content starts with: `lockfileVersion: '9.0'`
- Purpose: build/tooling/style configuration or helper module.

## `frontend/components/ui/sidebar.tsx`
- Type: Text source/config file (.tsx).
- Size: 21649 bytes, 727 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-slot, class-variance-authority, lucide-react, @/hooks/use-mobile, @/lib/utils, @/components/ui/button, @/components/ui/input, @/components/ui/separator, @/components/ui/sheet, @/components/ui/skeleton, @/components/ui/tooltip

## `frontend/components/ui/popover.tsx`
- Type: Text source/config file (.tsx).
- Size: 1636 bytes, 49 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-popover, @/lib/utils

## `frontend/components/ui/navigation-menu.tsx`
- Type: Text source/config file (.tsx).
- Size: 6649 bytes, 167 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-navigation-menu, class-variance-authority, lucide-react, @/lib/utils

## `frontend/components/ui/carousel.tsx`
- Type: Text source/config file (.tsx).
- Size: 5562 bytes, 242 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, embla-carousel-react, lucide-react, @/lib/utils, @/components/ui/button

## `frontend/components/ui/button-group.tsx`
- Type: Text source/config file (.tsx).
- Size: 2212 bytes, 84 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: @radix-ui/react-slot, class-variance-authority, @/lib/utils, @/components/ui/separator

## `frontend/components/ui/table.tsx`
- Type: Text source/config file (.tsx).
- Size: 2452 bytes, 117 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @/lib/utils

## `frontend/components/ui/item.tsx`
- Type: Text source/config file (.tsx).
- Size: 4503 bytes, 194 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-slot, class-variance-authority, @/lib/utils, @/components/ui/separator

## `frontend/components/ui/checkbox.tsx`
- Type: Text source/config file (.tsx).
- Size: 1227 bytes, 33 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-checkbox, lucide-react, @/lib/utils

## `frontend/components/ui/empty.tsx`
- Type: Text source/config file (.tsx).
- Size: 2401 bytes, 105 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: class-variance-authority, @/lib/utils

## `frontend/components/ui/toaster.tsx`
- Type: Text source/config file (.tsx).
- Size: 786 bytes, 36 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: Toaster
- Main imports: @/hooks/use-toast, @/components/ui/toast

## `frontend/components/ui/use-mobile.tsx`
- Type: Text source/config file (.tsx).
- Size: 565 bytes, 20 lines.
- TypeScript analysis: 1 named export declaration(s) found.
- Exported symbols: useIsMobile
- Main imports: react

## `frontend/components/ui/aspect-ratio.tsx`
- Type: Text source/config file (.tsx).
- Size: 280 bytes, 12 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: @radix-ui/react-aspect-ratio

## `frontend/components/ui/label.tsx`
- Type: Text source/config file (.tsx).
- Size: 612 bytes, 25 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-label, @/lib/utils

## `frontend/components/ui/input-otp.tsx`
- Type: Text source/config file (.tsx).
- Size: 2256 bytes, 78 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, input-otp, lucide-react, @/lib/utils

## `frontend/components/ui/form.tsx`
- Type: Text source/config file (.tsx).
- Size: 3761 bytes, 168 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-label, @radix-ui/react-slot, react-hook-form, @/lib/utils, @/components/ui/label

## `frontend/components/ui/breadcrumb.tsx`
- Type: Text source/config file (.tsx).
- Size: 2358 bytes, 110 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-slot, lucide-react, @/lib/utils

## `frontend/components/ui/badge.tsx`
- Type: Text source/config file (.tsx).
- Size: 1632 bytes, 47 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-slot, class-variance-authority, @/lib/utils

## `frontend/components/ui/toast.tsx`
- Type: Text source/config file (.tsx).
- Size: 4863 bytes, 130 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-toast, class-variance-authority, lucide-react, @/lib/utils

## `frontend/components/ui/avatar.tsx`
- Type: Text source/config file (.tsx).
- Size: 1099 bytes, 54 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-avatar, @/lib/utils

## `frontend/components/ui/command.tsx`
- Type: Text source/config file (.tsx).
- Size: 4824 bytes, 185 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, cmdk, lucide-react, @/lib/utils, @/components/ui/dialog

## `frontend/components/ui/hover-card.tsx`
- Type: Text source/config file (.tsx).
- Size: 1533 bytes, 45 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-hover-card, @/lib/utils

## `frontend/components/ui/drawer.tsx`
- Type: Text source/config file (.tsx).
- Size: 4258 bytes, 136 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, vaul, @/lib/utils

## `frontend/components/ui/spinner.tsx`
- Type: Text source/config file (.tsx).
- Size: 331 bytes, 17 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: lucide-react, @/lib/utils

## `frontend/components/ui/sonner.tsx`
- Type: Text source/config file (.tsx).
- Size: 564 bytes, 26 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: next-themes, sonner

## `frontend/components/ui/progress.tsx`
- Type: Text source/config file (.tsx).
- Size: 741 bytes, 32 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-progress, @/lib/utils

## `frontend/components/ui/alert.tsx`
- Type: Text source/config file (.tsx).
- Size: 1617 bytes, 67 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, class-variance-authority, @/lib/utils

## `frontend/components/ui/context-menu.tsx`
- Type: Text source/config file (.tsx).
- Size: 8282 bytes, 253 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-context-menu, lucide-react, @/lib/utils

## `frontend/components/ui/scroll-area.tsx`
- Type: Text source/config file (.tsx).
- Size: 1646 bytes, 59 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-scroll-area, @/lib/utils

## `frontend/components/ui/dropdown-menu.tsx`
- Type: Text source/config file (.tsx).
- Size: 8432 bytes, 258 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, @radix-ui/react-dropdown-menu, lucide-react, @/lib/utils

## `frontend/components/ui/kbd.tsx`
- Type: Text source/config file (.tsx).
- Size: 863 bytes, 29 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: @/lib/utils

## `frontend/components/ui/input-group.tsx`
- Type: Text source/config file (.tsx).
- Size: 5031 bytes, 170 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: class-variance-authority, @/lib/utils, @/components/ui/button, @/components/ui/input, @/components/ui/textarea

## `frontend/components/ui/calendar.tsx`
- Type: Text source/config file (.tsx).
- Size: 7679 bytes, 214 lines.
- TypeScript analysis: 0 named export declaration(s) found.
- Main imports: react, lucide-react, react-day-picker, @/lib/utils, @/components/ui/button
