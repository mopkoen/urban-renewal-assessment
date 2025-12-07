# ProRebuild System / 都更重建試算工具

> Educational / learning use only. Not financial, legal, or architectural advice.  
> 僅供教學與學習使用，非財務、法律或建築專業建議。

## Overview / 專案概要
- React + TypeScript calculator for urban renewal/rebuild feasibility with real-time outputs.  
- 支援地籍、容積、成本、銷售假設的即時試算。

## Key Features / 主要功能
- Guided inputs for land basics, FAR/coverage, exemptions (mech/stair/balcony/roof), cost and sales/return settings.  
- 引導式輸入：基地、建蔽/容積、免計容（機電/樓梯/陽台/屋突）、成本與銷售/分回。
- Live results: area breakdown, sales efficiency, cost distribution, revenue, equity, with detail modal.  
- 即時計算：面積拆解、銷售效率、成本分布、收入與權利分配，附明細彈窗。
- i18n (zh-TW/zh-CN/en), light/dark themes, mobile-friendly layout, demo dataset.  
- 多語系、明暗主題、行動友善，附示範資料。

## Tech Stack / 技術棧
- React 19, TypeScript, Vite 6
- Tailwind CSS (CDN), Heroicons, Recharts

## Project Structure / 專案結構
- `index.tsx` app entry; `App.tsx` tabs and inputs.  
- `components/` shared UI (`InputField`, `ResultsDashboard`).  
- `utils/` business logic (`calculations.ts`) and i18n dictionary (`i18n.ts`).  
- `types.ts` shared types/enums.  
- `public/` static assets; `dist/` build output (do not edit manually).  

## Key Calculations (overview) / 核心計算概要
- Areas: max build area = site area * coverage; legal FAR = site area * FAR; bonus FAR = 50% legal; exemptions (mech/stair/balcony) capped to legal FAR; roof cap by layer; basement from excavation ratio and layers.
- Sales: basement excluded from saleable; parking from 65% basement ping and `parkSize`; 1F share 65% when multi-story; land efficiency = saleable / site ping.
- Costs: build cost per ping; legal cost per legal m²; design/fund/license/review/bonus/pipes/cadastral/rights/stamp/trust; interest from build cost and loan years; management (HR/sales/risk) 5% each.
- Revenue & Equity: parking + 1F price + upper price; cash back from selling parks/upper floors; return area after public ratio; exchange ratio vs original indoor ping.

## Getting Started / 快速開始
Prerequisites / 需求：Node.js

1) Install deps 安裝依賴：`npm install`  
2) Set `GEMINI_API_KEY` in `.env.local` (gitignored) 設定環境變數。  
3) Run dev server 啟動開發伺服器：`npm run dev` (http://localhost:5173)

## Commands / 指令
- `npm run dev` — start dev server / 開發伺服器
- `npm run build` — production build to `dist/` / 正式版建置
- `npm run preview` — serve the build locally / 本地預覽

## Environment / 環境
- `.env.local` for secrets (e.g., `GEMINI_API_KEY`), gitignored.  
- 機密變數請放 `.env.local`，已加入 gitignore。

## Conventions / 注意事項
- Add new fields by extending `InputState` / `TabCategory` in `types.ts`, and sync keys in `utils/i18n.ts`.  
- 若新增欄位，請更新 `types.ts` 並補齊 `utils/i18n.ts`。  
- Do not edit `dist/` by hand / 請勿手動修改 `dist/`。 
