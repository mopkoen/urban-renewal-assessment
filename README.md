# ProRebuild System / 都更重建試算工具

> Educational / learning use only. Not financial, legal, or architectural advice.  
> 僅供教學與學習使用，非財務、法律或建築專業建議。

## Overview / 專案概要
- A React + TypeScript calculator for urban renewal/rebuild feasibility with real-time outputs.  
  React + TypeScript 的都更/重建試算器，輸入地籍、容積、成本與銷售假設即可即時得到面積、收入、成本與分配結果。
- Built for quick scenario testing: multi-tab inputs, charts, detail modals, i18n, and light/dark themes.  
  支援多分頁輸入、圖表與明細、國際化、明暗主題，便於快速測試不同情境。

## Key Features / 主要功能
- Guided inputs: land basics, FAR/coverage, exemptions (mech/stair/balcony/roof), cost params, sales/return settings.  
  引導式輸入：基地、容積/建蔽、免計容（機電/樓梯/陽台/屋突）、成本與銷售/分回設定。
- Live results: area breakdown, sales效率、成本分布、收入與權利分配，並有明細對話框。  
  即時計算：面積拆解、銷售效率、成本分布、收入與權利分配，含明細彈窗。
- i18n (zh-TW/zh-CN/en) and light/dark themes; bundled demo data for quick trial.  
  國際化（繁/簡/英）與明暗主題，附示範資料快速體驗。
- Mobile-friendly layout and chart-based summaries.  
  行動裝置友善的版面與圖表摘要。

## Tech Stack / 技術棧
- React 19, TypeScript, Vite 6
- Tailwind CSS (CDN), Heroicons, Recharts
- Cloudflare Pages + Wrangler for deploy / 部署

## Project Structure / 專案結構
- `index.tsx` mounts the app; `App.tsx` hosts tabs and inputs.  
  `index.tsx` 為入口，`App.tsx` 管理分頁與輸入區。
- `components/`: shared UI (`InputField`, `ResultsDashboard`).  
  共用 UI 組件。
- `utils/`: `calculations.ts` 商業邏輯，`i18n.ts` 多語字典。  
- `types.ts`: 共同型別與枚舉。  
- `public/`: 靜態資源；`dist/`: 編譯輸出（請勿手改）。  
- Cloudflare config: `worker.js`, `.wrangler/`, `wrangler.toml`.

## Key Calculations (overview) / 核心計算概要
- Areas 面積：  
  - `maxBuildArea = siteArea * coverage`  
  - `legalFAR = siteArea * FAR`；`bonusFAR = legalFAR * 0.5`  
  - 機電/樓梯/陽台按合法容積計算並套上上限；屋突以建築面積與層數計上限；地下室由開挖比率與層數得出。
- Sales 銷售：  
  - 地下室不列入可售，65% 地下室坪數做車位；`parkSize` 決定車位數。  
  - 多層時一樓占 65%，其餘為上層；`landEfficiency = saleable / sitePing`。
- Costs 成本：  
  - 建築成本以坪計價；法規成本以合法樓地板面積計。  
  - 設計、公基金、執照、審查、獎勵申請、管線、地籍、權利金、印花、信託，另有利息與管理費（人事/銷售/風險各 5%）。
- Revenue & Equity 收入與分配：  
  - 收入 = 車位 + 一樓單價 + 樓上單價。  
  - 權利分回計算：出售車位/樓上部分換現金，公共比率後計回饋坪數與一坪換算。

## Getting Started / 快速開始
**Prerequisites / 需求**: Node.js

1. Install deps / 安裝依賴  
   `npm install`
2. Set `GEMINI_API_KEY` in `.env.local` (gitignored)  
   將 `GEMINI_API_KEY` 放入 `.env.local`。
3. Run dev server / 啟動開發伺服器  
   `npm run dev` (http://localhost:5173)

## Commands / 指令
- `npm run dev` — start dev server / 啟動開發伺服器
- `npm run build` — production build to `dist/` / 產出正式版
- `npm run preview` — serve the build locally / 本地預覽
- `npm run deploy` — build + `wrangler pages deploy dist` (needs Cloudflare auth) / 部署

## Environment / 環境
- `.env.local` for secrets (e.g., `GEMINI_API_KEY`), gitignored.  
  機密環境變數請放 `.env.local`，已加入 gitignore。

## Conventions / 注意事項
- Extend `InputState` / `TabCategory` in `types.ts` when adding fields; add i18n keys in `utils/i18n.ts`.  
  若新增欄位，先擴充 `types.ts`，並補齊 `utils/i18n.ts`。
- Do not edit `dist/` by hand.  
  請勿手動修改 `dist/`。 
