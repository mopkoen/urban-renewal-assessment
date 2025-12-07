import { InputState, CalculationResult } from '../types';

const P = 0.3025; // 1 m2 = 0.3025 ping

export const calculateResults = (inputs: InputState): CalculationResult => {
  // Helper for safe percentage conversion
  const pct = (val: number) => (val || 0) / 100;
  const num = (val: number) => val || 0;

  // Local caps aligned with common TW practices
  const MECH_CAP = 0.10; // 10% of legal FAR
  const STAIR_CAP = 0.15; // 15% of legal FAR
  const BALCONY_CAP = 0.10; // 10% of legal FAR
  const ROOF_CAP_PER_LAYER = 0.10; // 10% of max build area per roof layer

  const area = num(inputs.area);
  const bcRatio = pct(inputs.bcRatio);
  const far = pct(inputs.far);
  const excavate = pct(inputs.excavate);
  const mech = pct(inputs.mech);
  const stair = pct(inputs.stair);
  const balcony = pct(inputs.balcony);
  const roof = pct(inputs.roof);
  const common = pct(inputs.common);
  
  const floors = Math.max(1, Math.floor(num(inputs.floors)));
  const basement = Math.max(0, Math.floor(num(inputs.basement)));
  const roofLayers = Math.max(0, Math.floor(num(inputs.roofLayers)));
  const newUnits = Math.max(0, Math.floor(num(inputs.newUnits)));

  // --- Areas ---
  const maxBuildArea = area * bcRatio;
  const legalFAR = area * far;
  const bonusFAR = legalFAR * 0.5; // Simplified assumption from original code

  const mechArea = Math.min(legalFAR * mech, legalFAR * MECH_CAP);
  const stairArea = Math.min(legalFAR * stair, legalFAR * STAIR_CAP);
  const balconyArea = Math.min(legalFAR * balcony, legalFAR * BALCONY_CAP);
  
  const roofRaw = maxBuildArea * roof * roofLayers;
  const roofArea = Math.min(roofRaw, maxBuildArea * ROOF_CAP_PER_LAYER * roofLayers);

  const excavateArea = area * excavate;
  const basementArea = excavateArea * basement;

  const totalM2 = legalFAR + bonusFAR + mechArea + stairArea + balconyArea + roofArea + basementArea;
  const totalPing = totalM2 * P;

  // --- Sales ---
  const basementPing = basementArea * P;
  const parkAreaPing = basementPing * 0.65;
  const parkSize = num(inputs.parkSize);
  const parkSizeSafe = parkSize > 0 ? parkSize : 8;
  const totalParks = Math.floor(parkAreaPing / parkSizeSafe);
  const aboveGroundPing = Math.max(0, totalPing - basementPing);

  const firstFloorSale = floors > 1 ? aboveGroundPing * 0.65 : aboveGroundPing; 
  const upperFloorSale = floors > 1 ? Math.max(0, aboveGroundPing - firstFloorSale) : 0;
  const totalSalePing = firstFloorSale + upperFloorSale;

  const landEfficiency = (area * P > 0) ? (totalSalePing / (area * P)) : 0;

  // --- Costs ---
  const legalTotalCost = legalFAR * num(inputs.legalCost);
  const rebuildCost = totalPing * num(inputs.buildCost);
  
  const designFee = legalTotalCost * 0.09;
  const fund = legalTotalCost * 0.004;
  const licenseFee = legalTotalCost * 0.001;
  const reviewFee = legalTotalCost * 0.0001;
  const bonusAppFee = legalTotalCost * 0.002;
  const pipeFee = newUnits * 97500;
  const cadastralFee = newUnits * 20000;

  const loanYears = ((6 + 2 * basement + floors + 0.5 * roofLayers + 18) / 12);
  const loanInterest = rebuildCost * 0.0326 * loanYears;
  
  const stampTax = rebuildCost * 0.001;
  const trustFee = rebuildCost * 0.004 * loanYears;
  
  const hrFee = rebuildCost * 0.05;
  const salesFee = rebuildCost * 0.05;
  const riskFee = rebuildCost * 0.05;
  
  const fullMgmtFee = hrFee + salesFee + riskFee;

  // Sum of small fixed fees from inputs
  const rightsFees = num(inputs.planFee) + num(inputs.evalFee) + num(inputs.boundaryFee) + num(inputs.drillFee) + num(inputs.neighborFee);

  const totalCost = rebuildCost + designFee + fund + licenseFee + reviewFee + bonusAppFee + pipeFee + cadastralFee +
                    rightsFees + loanInterest + stampTax + trustFee + fullMgmtFee;
  
  const otherFees = totalCost - rebuildCost - designFee - loanInterest - fullMgmtFee;

  // --- Revenue ---
  const parkRevenue = totalParks * num(inputs.parkPrice);
  const firstRevenue = firstFloorSale * num(inputs.price1F);
  const upperRevenue = upperFloorSale * num(inputs.price2F);
  const totalRevenue = parkRevenue + firstRevenue + upperRevenue;

  const commonBurdenPct = (totalRevenue > 0) ? (totalCost / totalRevenue * 100) : 0;

  // --- Equity ---
  const sellParks = Math.max(0, totalParks - newUnits);
  const sellPct = pct(inputs.sellPercent);
  const sellUpperPing = upperFloorSale * sellPct;
  const cashBack = sellParks * num(inputs.parkPrice) + sellUpperPing * num(inputs.price2F);
  
  const remainUpper = Math.max(0, upperFloorSale - sellUpperPing);
  const returnIndoor = (firstFloorSale + remainUpper) * (1 - common);
  
  const oldPing = Math.max(0.000001, num(inputs.oldPing));
  const pingExchange = returnIndoor / oldPing;
  const returnRatio = (totalSalePing > 0) ? (returnIndoor / totalSalePing) : 0;

  return {
    areas: {
      maxBuildArea, legalFAR, bonusFAR, mechArea, stairArea, balconyArea, roofArea, excavateArea, basementArea, totalPing, totalM2
    },
    sales: {
      parkAreaPing, totalParks, firstFloorSale, upperFloorSale, remainUpper, totalSalePing, landEfficiency
    },
    costs: {
      rebuildCost, designFee, loanInterest, fullMgmtFee, totalCost, commonBurdenPct, otherFees,
      breakdown: {
        fund, licenseFee, reviewFee, bonusAppFee, pipeFee, cadastralFee, rightsFees, stampTax, trustFee
      }
    },
    revenue: {
      parkRevenue, firstRevenue, upperRevenue, totalRevenue
    },
    equity: {
      sellParks, sellUpperPing, cashBack, returnIndoor, pingExchange, returnRatio, loanYears
    }
  };
};
