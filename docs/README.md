# ProRebuild System

A React + TypeScript calculator for urban renewal/rebuild feasibility. Enter site, regulation, cost, and sales assumptions to get areas, revenue, costs, and equity splits in real time. This tool is for educational/learning purposes only and is not financial, legal, or architectural advice.

## What’s inside
- Rapid inputs for land basics, regulations, costs, and sales/return scenarios.
- Real-time charts and a detail modal to explain cost makeup and area splits.
- i18n (zh-TW/zh-CN/en), light/dark themes, and a demo dataset for quick trials.

## Features
- Guided inputs: land basics, FAR/coverage, exemptions (mech/stair/balcony/roof), cost parameters, sales/return settings.
- Live results: area breakdown, sales efficiency, cost distribution, revenue, and equity metrics.
- i18n (zh-TW/zh-CN/en), light/dark themes, and demo data for quick checks.
- Charts plus detail modal for the cost breakdown; mobile-friendly layout.

## Tech Stack
- React 19, TypeScript, Vite 6.
- Tailwind CSS (CDN), Heroicons, Recharts.
- Cloudflare Pages + Wrangler for deployment.

## Project Structure
- index.tsx mounts the app; App.tsx holds tabs and inputs.
- components/ shared UI (InputField, ResultsDashboard).
- utils/ business logic (calculations.ts) and translations (i18n.ts).
- types.ts shared types/enums.
- public/ static assets; dist/ build output (do not edit manually).
- Cloudflare config: worker.js, .wrangler/, wrangler.toml.

## Key Calculations (overview)
- Areas: max build area = site area * coverage; legal FAR = site area * FAR; bonus FAR at 50% of legal; exemptions for mech/stair/balcony (capped to legal FAR) and roof caps; basement from excavation ratio.
- Sales: basement excluded from saleable; parking from 65% of basement ping and parkSize; first floor takes 65% when multiple stories; land efficiency = saleable / site ping.
- Costs: build cost per ping; legal cost per legal m2; design/fund/license/review/bonus/pipes/cadastral/rights/stamp/trust; interest from build cost and loan years; management (HR/sales/risk) at 5% each.
- Revenue: parking + 1F price + upper-floor price.
- Equity: cash back from selling parks/upper floors; return area after public ratio; exchange ratio vs original indoor ping.

## Commands
- npm install  - install dependencies
- npm run dev  - start Vite dev server (http://localhost:5173)
- npm run build  - production build to dist/
- npm run preview  - serve the build locally
- npm run deploy  - build then wrangler pages deploy dist (Cloudflare auth required)

## Environment
- .env.local for local secrets (e.g., GEMINI_API_KEY); file is gitignored.

## Notes
- Extend InputState/TabCategory in types.ts for new fields; keep i18n keys in utils/i18n.ts in sync.
- Do not edit dist/ by hand.
