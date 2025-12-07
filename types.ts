export interface InputState {
  // Basic Info
  dihao: string;
  diduan: string;
  zoning: string;
  area: number;
  roadwidth: number;
  height: number;
  bcRatio: number; // Percentage
  far: number; // Percentage
  excavate: number; // Percentage
  floors: number;
  roofLayers: number;
  basement: number;

  // Regulations / Exemptions
  mech: number; // Percentage
  stair: number; // Percentage
  balcony: number; // Percentage
  roof: number; // Percentage

  // Costs
  common: number; // Percentage
  parkSize: number; // Ping
  buildCost: number; // Cost per Ping
  legalCost: number; // Cost per m2
  planFee: number;
  evalFee: number;
  boundaryFee: number;
  drillFee: number;
  neighborFee: number;

  // Sales & Rights
  parkPrice: number;
  price1F: number;
  price2F: number;
  oldPing: number;
  newUnits: number;
  owners: number;
  sellPercent: number; // Percentage
}

export interface CalculationResult {
  areas: {
    maxBuildArea: number;
    legalFAR: number;
    bonusFAR: number;
    mechArea: number;
    stairArea: number;
    balconyArea: number;
    roofArea: number;
    excavateArea: number;
    basementArea: number;
    totalPing: number;
    totalM2: number;
  };
  sales: {
    parkAreaPing: number;
    totalParks: number;
    firstFloorSale: number;
    upperFloorSale: number;
    remainUpper: number;
    totalSalePing: number;
    landEfficiency: number;
  };
  costs: {
    rebuildCost: number;
    designFee: number;
    loanInterest: number;
    fullMgmtFee: number;
    totalCost: number;
    commonBurdenPct: number;
    otherFees: number; // Aggregate for chart
    // Detailed breakdown for modal
    breakdown: {
      fund: number;
      licenseFee: number;
      reviewFee: number;
      bonusAppFee: number;
      pipeFee: number;
      cadastralFee: number;
      rightsFees: number;
      stampTax: number;
      trustFee: number;
    }
  };
  revenue: {
    parkRevenue: number;
    firstRevenue: number;
    upperRevenue: number;
    totalRevenue: number;
  };
  equity: {
    sellParks: number;
    sellUpperPing: number;
    cashBack: number;
    returnIndoor: number;
    pingExchange: number;
    returnRatio: number;
    loanYears: number;
  };
}

export enum TabCategory {
  BASIC = 'BASIC',
  REGULATIONS = 'REGULATIONS',
  COSTS = 'COSTS',
  SALES = 'SALES'
}

export type Language = 'zh-TW' | 'zh-CN' | 'en';
export type Theme = 'light' | 'dark';