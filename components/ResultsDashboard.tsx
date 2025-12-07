import React, { useState } from 'react';
import { CalculationResult, Language, Theme } from '../types';
import { t } from '../utils/i18n';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { XMarkIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ResultsDashboardProps {
  results: CalculationResult;
  lang: Language;
  theme: Theme;
}

const formatNumber = (num: number, digits = 2) => {
  if (!isFinite(num)) return '0';
  return num.toLocaleString('zh-TW', { minimumFractionDigits: digits, maximumFractionDigits: digits });
};

const formatCurrency = (num: number) => {
  if (!isFinite(num)) return '0';
  // Show in Wan (Ten Thousand)
  const val = num / 10000;
  return val.toLocaleString('zh-TW', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
};

const Card: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void;
  clickable?: boolean;
  delay?: number;
}> = ({ title, children, className, onClick, clickable, delay = 0 }) => (
  <div 
    onClick={onClick}
    style={{ animationDelay: `${delay}ms` }}
    className={`
      bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 
      overflow-hidden transition-all duration-300 animate-slide-up opacity-0
      ${clickable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-primary-400 dark:hover:border-primary-600' : ''}
      ${className}
    `}
  >
    <div className="bg-slate-50 dark:bg-slate-700/50 px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
        {title}
        {clickable && <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
      </h3>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

const Row: React.FC<{ label: string; value: string; highlight?: boolean; subValue?: string }> = ({ label, value, highlight, subValue }) => (
  <div className={`flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0 transition-colors ${highlight ? 'bg-primary-50 dark:bg-slate-700/40 -mx-5 px-5' : ''}`}>
    <span className={`text-sm ${highlight ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
    <div className="text-right">
      <div className={`font-mono ${highlight ? 'text-lg font-bold text-primary-700 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>{value}</div>
      {subValue && <div className="text-xs text-slate-400 dark:text-slate-500">{subValue}</div>}
    </div>
  </div>
);

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, lang, theme }) => {
  const [showCostDetail, setShowCostDetail] = useState(false);
  const { areas, sales, costs, revenue, equity } = results;

  // Translation helper
  const txt = (key: string) => t(lang, key);
  const unitWan = lang === 'en' ? 'Wan' : '萬';
  const unitPing = lang === 'en' ? 'Ping' : '坪';
  const unitM2 = lang === 'en' ? 'm²' : '㎡';
  const unitCar = lang === 'en' ? 'Cars' : '車';
  const unitYear = lang === 'en' ? 'Years' : '年';

  const costData = [
    { name: txt('row.rebuildCost'), value: costs.rebuildCost, color: '#3b82f6' },
    { name: txt('row.mgmtFee'), value: costs.fullMgmtFee, color: '#10b981' },
    { name: txt('row.interest'), value: costs.loanInterest, color: '#f59e0b' },
    { name: txt('row.designFee'), value: costs.designFee, color: '#6366f1' },
    { name: txt('row.otherFees'), value: costs.otherFees, color: '#94a3b8' },
  ].filter(d => d.value > 0);

  const isOneForOne = equity.pingExchange >= 1;

  // Tooltip style based on theme
  const tooltipStyle = theme === 'dark' 
    ? { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }
    : { backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  return (
    <div className="space-y-6 relative">
      
      {/* Key Metric Banner - Animated */}
      <div className={`
        rounded-xl p-6 text-center text-white shadow-lg transition-all duration-500 transform hover:scale-[1.01]
        animate-slide-up
        ${isOneForOne 
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20' 
          : 'bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900 border border-transparent dark:border-slate-700 shadow-slate-900/20'}
      `}>
        <div className="text-sm font-medium opacity-80 uppercase tracking-wider mb-2">{txt('result.oneForOne')}</div>
        <div className="text-5xl font-black tracking-tight">{formatNumber(equity.pingExchange, 4)}</div>
        <div className="mt-4 inline-block px-4 py-1 rounded-full bg-white/20 text-sm font-bold backdrop-blur-sm animate-pulse">
          {isOneForOne ? txt('result.congrats') : txt('result.notYet')}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Cost Analysis Chart - Clickable for details */}
        <Card 
          title={txt('card.costDist')} 
          className="xl:col-span-2 group" 
          clickable 
          onClick={() => setShowCostDetail(true)}
          delay={100}
        >
           <div className="flex flex-col md:flex-row items-center relative">
             <div className="absolute top-0 right-0 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
               {txt('action.viewDetails')}
             </div>
             <div className="h-64 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke={theme === 'dark' ? '#1e293b' : '#fff'} // Border of pie slices
                      isAnimationActive={true}
                    >
                      {costData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `$${formatCurrency(value)} ${unitWan}`}
                      contentStyle={tooltipStyle}
                      itemStyle={{ color: theme === 'dark' ? '#cbd5e1' : '#334155' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="w-full md:w-1/2 space-y-2 pl-0 md:pl-8 mt-6 md:mt-0">
                <Row label={txt('row.rebuildCost')} value={`${formatCurrency(costs.rebuildCost)} ${unitWan}`} />
                <Row label={txt('row.mgmtFee')} value={`${formatCurrency(costs.fullMgmtFee)} ${unitWan}`} />
                <Row label={txt('row.interest')} value={`${formatCurrency(costs.loanInterest)} ${unitWan}`} />
                <Row label={txt('row.totalCost')} value={`${formatCurrency(costs.totalCost)} ${unitWan}`} highlight />
             </div>
           </div>
        </Card>

        {/* Areas */}
        <Card title={txt('card.areas')} delay={200}>
          <Row label={txt('row.maxBuildArea')} value={`${formatNumber(areas.maxBuildArea)} ${unitM2}`} />
          <Row label={txt('row.legalFAR')} value={`${formatNumber(areas.legalFAR)} ${unitM2}`} />
          <Row label={txt('row.bonusFAR')} value={`${formatNumber(areas.bonusFAR)} ${unitM2}`} />
          <Row label={txt('row.totalPing')} value={`${formatNumber(areas.totalPing)} ${unitPing}`} highlight />
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-400 dark:text-slate-500 grid grid-cols-2 gap-2 transition-colors">
             <span>{txt('row.mech')}: {formatNumber(areas.mechArea)}{unitM2}</span>
             <span>{txt('row.stair')}: {formatNumber(areas.stairArea)}{unitM2}</span>
             <span>{txt('row.balcony')}: {formatNumber(areas.balconyArea)}{unitM2}</span>
             <span>{txt('row.roof')}: {formatNumber(areas.roofArea)}{unitM2}</span>
          </div>
        </Card>

        {/* Sales */}
        <Card title={txt('card.sales')} delay={300}>
          <Row label={txt('row.parkArea')} value={`${formatNumber(sales.parkAreaPing)} ${unitPing}`} />
          <Row label={txt('row.parkCount')} value={`${sales.totalParks} ${unitCar}`} />
          <Row label={txt('row.totalSale')} value={`${formatNumber(sales.totalSalePing)} ${unitPing}`} highlight />
          <Row label={txt('row.landEff')} value={formatNumber(sales.landEfficiency, 3)} />
          <Row label={txt('row.sale1F')} value={`${formatNumber(sales.firstFloorSale)} ${unitPing}`} />
          <Row label={txt('row.saleUpper')} value={`${formatNumber(sales.upperFloorSale)} ${unitPing}`} />
        </Card>

        {/* Revenue & Burden */}
        <Card title={txt('card.finance')} delay={400}>
          <Row label={txt('row.totalRev')} value={`${formatCurrency(revenue.totalRevenue)} ${unitWan}`} highlight />
          <Row label={txt('row.totalCost')} value={`${formatCurrency(costs.totalCost)} ${unitWan}`} />
          <div className="py-2">
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
              <span>{txt('row.burden')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatNumber(costs.commonBurdenPct)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(100, costs.commonBurdenPct)}%` }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Equity */}
        <Card title={txt('card.equity')} delay={500}>
          <Row label={txt('row.cash')} value={`${formatCurrency(equity.cashBack)} ${unitWan}`} />
          <Row label={txt('row.returnIndoor')} value={`${formatNumber(equity.returnIndoor)} ${unitPing}`} />
          <Row label={txt('row.returnRatio')} value={`${formatNumber(equity.returnRatio * 100)}%`} />
          <Row label={txt('row.loanYears')} value={`${formatNumber(equity.loanYears)} ${unitYear}`} />
          <Row label={txt('result.oneForOne')} value={formatNumber(equity.pingExchange, 4)} highlight />
        </Card>

      </div>

      {/* Cost Detail Modal */}
      {showCostDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCostDetail(false)}></div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg relative animate-scale-in border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/30">
              <h3 className="font-bold text-slate-800 dark:text-white">{txt('card.detailTitle')}</h3>
              <button onClick={() => setShowCostDetail(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors">
                <XMarkIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                <Row label={txt('bd.fund')} value={formatCurrency(costs.breakdown.fund)} subValue={unitWan} />
                <Row label={txt('bd.licenseFee')} value={formatCurrency(costs.breakdown.licenseFee)} subValue={unitWan} />
                <Row label={txt('bd.reviewFee')} value={formatCurrency(costs.breakdown.reviewFee)} subValue={unitWan} />
                <Row label={txt('bd.bonusAppFee')} value={formatCurrency(costs.breakdown.bonusAppFee)} subValue={unitWan} />
                <Row label={txt('bd.pipeFee')} value={formatCurrency(costs.breakdown.pipeFee)} subValue={unitWan} />
                <Row label={txt('bd.cadastralFee')} value={formatCurrency(costs.breakdown.cadastralFee)} subValue={unitWan} />
                <Row label={txt('bd.rightsFees')} value={formatCurrency(costs.breakdown.rightsFees)} subValue={unitWan} />
                <Row label={txt('bd.stampTax')} value={formatCurrency(costs.breakdown.stampTax)} subValue={unitWan} />
                <Row label={txt('bd.trustFee')} value={formatCurrency(costs.breakdown.trustFee)} subValue={unitWan} />
                <div className="mt-4 pt-3 border-t border-dashed border-slate-300 dark:border-slate-600">
                  <Row label={txt('row.otherFees')} value={formatCurrency(costs.otherFees)} subValue={unitWan} highlight />
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 text-center">
              <button 
                onClick={() => setShowCostDetail(false)}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                {txt('action.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};