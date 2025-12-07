import React, { useState, useMemo, useEffect } from 'react';
import { TabCategory, InputState, Language, Theme } from './types';
import { calculateResults } from './utils/calculations';
import { InputField } from './components/InputField';
import { ResultsDashboard } from './components/ResultsDashboard';
import { t } from './utils/i18n';
import {
  CalculatorIcon,
  BuildingOffice2Icon,
  BanknotesIcon,
  ChartPieIcon,
  TableCellsIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const DEFAULT_INPUTS: InputState = {
  dihao: '',
  diduan: '',
  zoning: '',
  area: 0,
  roadwidth: 8,
  height: 0,
  bcRatio: 0,
  far: 0,
  excavate: 0,
  floors: 0,
  roofLayers: 0,
  basement: 0,
  mech: 0,
  stair: 0,
  balcony: 0,
  roof: 0,
  common: 33,
  parkSize: 8,
  buildCost: 250000,
  legalCost: 0,
  planFee: 0,
  evalFee: 0,
  boundaryFee: 0,
  drillFee: 0,
  neighborFee: 0,
  parkPrice: 2500000,
  price1F: 1000000,
  price2F: 800000,
  oldPing: 30,
  newUnits: 10,
  owners: 1,
  sellPercent: 0
};

// Demo Data set for quick testing
const DEMO_INPUTS: InputState = {
  ...DEFAULT_INPUTS,
  area: 500, // m2
  bcRatio: 45, // %
  far: 225, // %
  excavate: 60, // %
  floors: 12,
  basement: 3,
  roofLayers: 2,
  mech: 10,
  stair: 10,
  balcony: 10,
  roof: 10,
  common: 34,
  buildCost: 280000,
  legalCost: 18000,
  parkPrice: 3000000,
  price1F: 1200000,
  price2F: 950000,
  oldPing: 40,
  newUnits: 12,
  sellPercent: 40
};

const TABS = [
  { id: TabCategory.BASIC, icon: BuildingOffice2Icon },
  { id: TabCategory.REGULATIONS, icon: TableCellsIcon },
  { id: TabCategory.COSTS, icon: BanknotesIcon },
  { id: TabCategory.SALES, icon: ChartPieIcon },
];

export default function App() {
  const [inputs, setInputs] = useState<InputState>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<TabCategory>(TabCategory.BASIC);
  
  // Settings State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<Language>('zh-TW');
  const [theme, setTheme] = useState<Theme>('light');

  const results = useMemo(() => calculateResults(inputs), [inputs]);

  // Apply Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Helper for translation
  const txt = (key: string) => t(lang, key);

  const handleInputStringChange = (key: keyof InputState) => (val: string) => {
    const isText = key === 'dihao' || key === 'diduan' || key === 'zoning';
    if (isText) {
      setInputs(prev => ({ ...prev, [key]: val }));
      return;
    }
    const parsed = val === '' ? 0 : parseFloat(val);
    setInputs(prev => ({ ...prev, [key]: Number.isNaN(parsed) ? 0 : parsed }));
  };

  const percentKeys: (keyof InputState)[] = ['bcRatio', 'far', 'excavate', 'mech', 'stair', 'balcony', 'roof', 'common', 'sellPercent'];
  const integerKeys: (keyof InputState)[] = ['floors', 'basement', 'roofLayers', 'newUnits', 'owners'];
  const nonNegativeKeys: (keyof InputState)[] = [
    'area', 'roadwidth', 'height', 'bcRatio', 'far', 'excavate', 'floors', 'roofLayers', 'basement',
    'mech', 'stair', 'balcony', 'roof', 'buildCost', 'legalCost', 'planFee', 'evalFee', 'boundaryFee',
    'drillFee', 'neighborFee', 'common', 'parkSize', 'parkPrice', 'price1F', 'price2F', 'oldPing',
    'newUnits', 'owners', 'sellPercent'
  ];

  const clampOnBlur = (key: keyof InputState) => (raw: string) => {
    const isText = key === 'dihao' || key === 'diduan' || key === 'zoning';
    if (isText) return;

    let val = parseFloat(raw);
    if (Number.isNaN(val)) val = 0;

    if (nonNegativeKeys.includes(key)) {
      val = Math.max(0, val);
    }

    if (percentKeys.includes(key)) {
      val = Math.min(100, val);
    }

    if (integerKeys.includes(key)) {
      val = Math.floor(val);
    }

    if (key === 'parkSize' && val <= 0) {
      val = 8;
    }

    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const loadDemo = () => {
    setInputs(DEMO_INPUTS);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      
      {/* DRAWER / SIDEBAR */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Drawer Content */}
        <div className={`absolute top-0 left-0 h-full w-80 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
             <h2 className="text-xl font-bold text-slate-800 dark:text-white">{txt('settings.title')}</h2>
             <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
               <XMarkIcon className="w-6 h-6 text-slate-500" />
             </button>
          </div>
          
          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
             {/* Language */}
             <div>
               <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                 <GlobeAltIcon className="w-4 h-4"/> {txt('settings.language')}
               </label>
               <div className="grid grid-cols-1 gap-2">
                 {['zh-TW', 'zh-CN', 'en'].map((l) => (
                   <button
                     key={l}
                     onClick={() => setLang(l as Language)}
                     className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${lang === l ? 'bg-primary-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                   >
                     {l === 'zh-TW' && '繁體中文'}
                     {l === 'zh-CN' && '简体中文'}
                     {l === 'en' && 'English'}
                   </button>
                 ))}
               </div>
             </div>

             {/* Theme */}
             <div>
               <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                 {theme === 'light' ? <SunIcon className="w-4 h-4"/> : <MoonIcon className="w-4 h-4"/>} {txt('settings.theme')}
               </label>
               <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                 <button
                   onClick={() => setTheme('light')}
                   className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                 >
                   <SunIcon className="w-4 h-4"/> {txt('settings.light')}
                 </button>
                 <button
                   onClick={() => setTheme('dark')}
                   className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
                 >
                   <MoonIcon className="w-4 h-4"/> {txt('settings.dark')}
                 </button>
               </div>
             </div>
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
             <div className="text-center text-xs text-slate-400 space-y-1">
                <p className="font-medium text-slate-500 dark:text-slate-500">made by mopko</p>
                <p>power by cloudflare · codex · gemini</p>
             </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-slate-900 dark:bg-slate-950 text-white sticky top-0 z-40 shadow-md transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-slate-300 hover:text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-primary-600 p-2 rounded-lg shadow-lg shadow-primary-900/20">
                <CalculatorIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">{txt('app.title')}</h1>
                <p className="hidden sm:block text-[10px] text-slate-400 font-light uppercase tracking-widest">{txt('app.subtitle')}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={loadDemo}
            className="text-xs font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md border border-slate-700 transition-colors hover:text-primary-300"
          >
            {txt('action.loadDemo')}
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Input Section */}
          <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col h-[calc(100vh-8rem)] lg:sticky lg:top-24">
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl mb-4 overflow-x-auto custom-scrollbar transition-colors">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 min-w-[100px]
                      ${isActive 
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500'} transition-colors`} />
                    <span>{txt(tab.id)}</span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable Input Form */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors relative">
              
              {/* Key ensures animation triggers on tab change */}
              <div key={activeTab} className="animate-fade-in"> 
                {activeTab === TabCategory.BASIC && (
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-l-4 border-primary-500 pl-3">{txt('section.land')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <InputField label={txt('label.dihao')} value={inputs.dihao} onChange={handleInputStringChange('dihao')} className="col-span-1" />
                      <InputField label={txt('label.diduan')} value={inputs.diduan} onChange={handleInputStringChange('diduan')} className="col-span-1" />
                    </div>
                    <InputField label={txt('label.zoning')} value={inputs.zoning} onChange={handleInputStringChange('zoning')} />
                    <InputField label={txt('label.area')} suffix={lang === 'en' ? 'm2' : '坪'} type="number" value={inputs.area} onChange={handleInputStringChange('area')} onBlur={clampOnBlur('area')} />
                    <div className="grid grid-cols-2 gap-3">
                       <InputField label={txt('label.bcRatio')} suffix="%" type="number" value={inputs.bcRatio} onChange={handleInputStringChange('bcRatio')} onBlur={clampOnBlur('bcRatio')} />
                       <InputField label={txt('label.far')} suffix="%" type="number" value={inputs.far} onChange={handleInputStringChange('far')} onBlur={clampOnBlur('far')} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InputField label={txt('label.floors')} suffix={lang === 'en' ? '' : '層'} type="number" value={inputs.floors} onChange={handleInputStringChange('floors')} onBlur={clampOnBlur('floors')} />
                      <InputField label={txt('label.basement')} suffix={lang === 'en' ? '' : '層'} type="number" value={inputs.basement} onChange={handleInputStringChange('basement')} onBlur={clampOnBlur('basement')} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <InputField label={txt('label.roofLayers')} suffix={lang === 'en' ? '' : '層'} type="number" value={inputs.roofLayers} onChange={handleInputStringChange('roofLayers')} onBlur={clampOnBlur('roofLayers')} />
                      <InputField label={txt('label.height')} suffix={lang === 'en' ? 'm' : '公尺'} type="number" value={inputs.height} onChange={handleInputStringChange('height')} onBlur={clampOnBlur('height')} />
                    </div>
                    <InputField label={txt('label.excavate')} suffix="%" type="number" value={inputs.excavate} onChange={handleInputStringChange('excavate')} onBlur={clampOnBlur('excavate')} />
                    <InputField label={txt('label.roadwidth')} suffix={lang === 'en' ? 'm' : '公尺'} type="number" value={inputs.roadwidth} onChange={handleInputStringChange('roadwidth')} onBlur={clampOnBlur('roadwidth')} />
                  </div>
                )}

                {activeTab === TabCategory.REGULATIONS && (
                  <div className="space-y-1">
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-l-4 border-primary-500 pl-3">{txt('section.exemptions')}</h3>
                     <InputField label={txt('label.mech')} suffix="%" type="number" value={inputs.mech} onChange={handleInputStringChange('mech')} onBlur={clampOnBlur('mech')} />
                     <InputField label={txt('label.stair')} suffix="%" type="number" value={inputs.stair} onChange={handleInputStringChange('stair')} onBlur={clampOnBlur('stair')} />
                     <InputField label={txt('label.balcony')} suffix="%" type="number" value={inputs.balcony} onChange={handleInputStringChange('balcony')} onBlur={clampOnBlur('balcony')} />
                     <InputField label={txt('label.roof')} suffix="%" type="number" value={inputs.roof} onChange={handleInputStringChange('roof')} onBlur={clampOnBlur('roof')} />
                  </div>
                )}

                {activeTab === TabCategory.COSTS && (
                  <div className="space-y-1">
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-l-4 border-primary-500 pl-3">{txt('section.costs')}</h3>
                     <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-4 text-xs text-slate-500 dark:text-slate-400">
                        {txt('section.note')}
                     </div>
                     <InputField label={txt('label.buildCost')} suffix={lang==='en'?'$/Ping':'元/坪'} type="number" value={inputs.buildCost} onChange={handleInputStringChange('buildCost')} onBlur={clampOnBlur('buildCost')} />
                     <InputField label={txt('label.legalCost')} suffix={lang==='en'?'$/m2':'元/平方公尺'} type="number" value={inputs.legalCost} onChange={handleInputStringChange('legalCost')} onBlur={clampOnBlur('legalCost')} />
                     <hr className="my-4 border-slate-100 dark:border-slate-700" />
                     <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{txt('section.fees')}</h4>
                     <InputField label={txt('label.planFee')} type="number" value={inputs.planFee} onChange={handleInputStringChange('planFee')} onBlur={clampOnBlur('planFee')} />
                     <InputField label={txt('label.evalFee')} type="number" value={inputs.evalFee} onChange={handleInputStringChange('evalFee')} onBlur={clampOnBlur('evalFee')} />
                     <InputField label={txt('label.boundaryFee')} type="number" value={inputs.boundaryFee} onChange={handleInputStringChange('boundaryFee')} onBlur={clampOnBlur('boundaryFee')} />
                     <InputField label={txt('label.drillFee')} type="number" value={inputs.drillFee} onChange={handleInputStringChange('drillFee')} onBlur={clampOnBlur('drillFee')} />
                     <InputField label={txt('label.neighborFee')} type="number" value={inputs.neighborFee} onChange={handleInputStringChange('neighborFee')} onBlur={clampOnBlur('neighborFee')} />
                  </div>
                )}

                {activeTab === TabCategory.SALES && (
                  <div className="space-y-1">
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-l-4 border-primary-500 pl-3">{txt('section.sales')}</h3>
                     <InputField label={txt('label.common')} suffix="%" type="number" value={inputs.common} onChange={handleInputStringChange('common')} onBlur={clampOnBlur('common')} />
                     <div className="grid grid-cols-2 gap-3">
                      <InputField label={txt('label.parkSize')} suffix={lang==='en'?'Ping':'坪'} type="number" value={inputs.parkSize} onChange={handleInputStringChange('parkSize')} onBlur={clampOnBlur('parkSize')} />
                      <InputField label={txt('label.parkPrice')} suffix={lang==='en'?'$':'元'} type="number" value={inputs.parkPrice} onChange={handleInputStringChange('parkPrice')} onBlur={clampOnBlur('parkPrice')} />
                     </div>
                     <hr className="my-4 border-slate-100 dark:border-slate-700" />
                     <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{txt('section.prices')}</h4>
                     <InputField label={txt('label.price1F')} type="number" value={inputs.price1F} onChange={handleInputStringChange('price1F')} onBlur={clampOnBlur('price1F')} />
                     <InputField label={txt('label.price2F')} type="number" value={inputs.price2F} onChange={handleInputStringChange('price2F')} onBlur={clampOnBlur('price2F')} />
                     <hr className="my-4 border-slate-100 dark:border-slate-700" />
                     <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{txt('section.return')}</h4>
                     <InputField label={txt('label.oldPing')} suffix={lang==='en'?'Ping':'坪'} type="number" value={inputs.oldPing} onChange={handleInputStringChange('oldPing')} onBlur={clampOnBlur('oldPing')} />
                     <div className="grid grid-cols-2 gap-3">
                       <InputField label={txt('label.newUnits')} suffix={lang==='en'?'':'戶'} type="number" value={inputs.newUnits} onChange={handleInputStringChange('newUnits')} onBlur={clampOnBlur('newUnits')} />
                       <InputField label={txt('label.owners')} suffix={lang==='en'?'':'人'} type="number" value={inputs.owners} onChange={handleInputStringChange('owners')} onBlur={clampOnBlur('owners')} />
                     </div>
                     <InputField label={txt('label.sellPercent')} suffix="%" type="number" value={inputs.sellPercent} onChange={handleInputStringChange('sellPercent')} onBlur={clampOnBlur('sellPercent')} />
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="w-full lg:w-7/12 xl:w-8/12">
            <ResultsDashboard results={results} lang={lang} theme={theme} />
          </div>

        </div>
      </main>
    </div>
  );
}
