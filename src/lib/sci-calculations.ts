import { SimulationInputs, SimulationResults } from './calculations';

export interface SCIInputs {
  ownershipPercentage: number; // % de détention dans la SCI
  marginalTaxRate: number; // Taux marginal d'imposition (11%, 30%, 41%, 45%)
  fiscalRegime: 'IR' | 'IS' | 'both'; // Régime fiscal
  landPercentage: number; // % du prix correspondant au terrain (non amortissable pour IS)
  buildingDepreciationYears: number; // Durée d'amortissement construction
  renovationDepreciationYears: number; // Durée d'amortissement travaux
}

export interface SCIResults {
  ir: SCIRegimeResult;
  is: SCIRegimeResult;
  comparison: {
    bestRegime: 'IR' | 'IS';
    annualDifference: number;
    monthlyDifference: number;
  };
}

export interface SCIRegimeResult {
  // Revenus et charges
  grossAnnualIncome: number;
  deductibleCharges: number;
  depreciation: number; // Amortissement (IS uniquement)
  taxableIncome: number;
  
  // Impôts
  incomeTax: number;
  socialCharges: number;
  corporateTax: number; // IS uniquement
  flatTax: number; // Flat tax sur dividendes (IS uniquement)
  totalTax: number;
  
  // Résultats nets
  netAnnualIncome: number;
  netMonthlyIncome: number;
  personalShare: number; // Part personnelle mensuelle
  
  // Cash-flow
  monthlyLoanPayment: number;
  monthlyCashFlow: number;
  savingsEffort: number; // Effort d'épargne si cash-flow négatif
  
  // Point d'équilibre
  breakEvenMonths: number; // Nombre de mois avant rentabilité (après crédit)
  totalSavingsRequired: number; // Total des apports nécessaires pendant le crédit
  postLoanMonthlyIncome: number; // Revenu mensuel après remboursement du crédit
}

export const defaultSCIInputs: SCIInputs = {
  ownershipPercentage: 100,
  marginalTaxRate: 30,
  fiscalRegime: 'both',
  landPercentage: 15,
  buildingDepreciationYears: 25,
  renovationDepreciationYears: 10,
};

const SOCIAL_CHARGES_RATE = 0.172; // 17.2% prélèvements sociaux
const IS_RATE_LOW = 0.15; // 15% jusqu'à 42 500€
const IS_THRESHOLD = 42500;
const IS_RATE_HIGH = 0.25; // 25% au-delà
const FLAT_TAX_RATE = 0.30; // 30% flat tax sur dividendes

function calculateCorporateTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= IS_THRESHOLD) {
    return taxableIncome * IS_RATE_LOW;
  }
  return IS_THRESHOLD * IS_RATE_LOW + (taxableIncome - IS_THRESHOLD) * IS_RATE_HIGH;
}

function calculateDepreciation(
  netSellerPrice: number,
  renovationBudget: number,
  landPercentage: number,
  buildingDepreciationYears: number,
  renovationDepreciationYears: number
): number {
  // Le terrain n'est pas amortissable
  const buildingValue = netSellerPrice * (1 - landPercentage / 100);
  const buildingDepreciation = buildingValue / buildingDepreciationYears;
  const renovationDepreciation = renovationBudget / renovationDepreciationYears;
  
  return buildingDepreciation + renovationDepreciation;
}

export function calculateSCIResults(
  inputs: SimulationInputs,
  results: SimulationResults,
  sciInputs: SCIInputs
): SCIResults {
  const irResult = calculateIRRegime(inputs, results, sciInputs);
  const isResult = calculateISRegime(inputs, results, sciInputs);
  
  const annualDifference = isResult.netAnnualIncome - irResult.netAnnualIncome;
  const bestRegime = annualDifference > 0 ? 'IS' : 'IR';
  
  return {
    ir: irResult,
    is: isResult,
    comparison: {
      bestRegime,
      annualDifference: Math.abs(annualDifference),
      monthlyDifference: Math.abs(annualDifference / 12),
    },
  };
}

function calculateIRRegime(
  inputs: SimulationInputs,
  results: SimulationResults,
  sciInputs: SCIInputs
): SCIRegimeResult {
  // Revenus bruts
  const grossAnnualIncome = inputs.monthlyRent * 12;
  
  // Charges déductibles (intérêts + charges récurrentes)
  // Pour l'IR, on déduit les intérêts d'emprunt et les charges
  const annualInterest = results.totalInterestCost / inputs.creditDuration;
  const deductibleCharges = annualInterest + results.totalAnnualFees;
  
  // Revenu imposable
  const taxableIncome = Math.max(0, grossAnnualIncome - deductibleCharges);
  
  // Impôts IR
  const marginalRate = sciInputs.marginalTaxRate / 100;
  const incomeTax = taxableIncome * marginalRate;
  const socialCharges = taxableIncome * SOCIAL_CHARGES_RATE;
  const totalTax = incomeTax + socialCharges;
  
  // Revenus nets
  const netAnnualIncome = grossAnnualIncome - deductibleCharges - totalTax;
  const netMonthlyIncome = netAnnualIncome / 12;
  const personalShare = netMonthlyIncome * (sciInputs.ownershipPercentage / 100);
  
  // Cash-flow
  const monthlyLoanPayment = results.monthlyPayment;
  const monthlyTaxes = totalTax / 12;
  const monthlyCashFlow = inputs.monthlyRent - (results.totalAnnualFees / 12) - monthlyLoanPayment - monthlyTaxes;
  const savingsEffort = monthlyCashFlow < 0 ? Math.abs(monthlyCashFlow) : 0;
  
  // Point d'équilibre
  const creditDurationMonths = inputs.creditDuration * 12;
  const totalSavingsRequired = savingsEffort * creditDurationMonths;
  
  // Revenu après crédit (plus de mensualité)
  const postLoanMonthlyCashFlow = inputs.monthlyRent - (results.totalAnnualFees / 12) - monthlyTaxes;
  const postLoanMonthlyIncome = postLoanMonthlyCashFlow * (sciInputs.ownershipPercentage / 100);
  
  // Calcul du point d'équilibre (quand les revenus cumulés dépassent les apports)
  let breakEvenMonths = 0;
  if (savingsEffort > 0 && postLoanMonthlyIncome > 0) {
    // Après le crédit, on gagne de l'argent, donc on récupère l'investissement
    breakEvenMonths = creditDurationMonths + Math.ceil(totalSavingsRequired / postLoanMonthlyIncome);
  } else if (monthlyCashFlow >= 0) {
    breakEvenMonths = 0; // Rentable dès le départ
  } else {
    breakEvenMonths = -1; // Jamais rentable
  }
  
  return {
    grossAnnualIncome,
    deductibleCharges,
    depreciation: 0,
    taxableIncome,
    incomeTax,
    socialCharges,
    corporateTax: 0,
    flatTax: 0,
    totalTax,
    netAnnualIncome,
    netMonthlyIncome,
    personalShare,
    monthlyLoanPayment,
    monthlyCashFlow,
    savingsEffort,
    breakEvenMonths,
    totalSavingsRequired,
    postLoanMonthlyIncome,
  };
}

function calculateISRegime(
  inputs: SimulationInputs,
  results: SimulationResults,
  sciInputs: SCIInputs
): SCIRegimeResult {
  // Revenus bruts
  const grossAnnualIncome = inputs.monthlyRent * 12;
  
  // Charges déductibles
  const annualInterest = results.totalInterestCost / inputs.creditDuration;
  const deductibleCharges = annualInterest + results.totalAnnualFees;
  
  // Amortissement (avantage IS)
  const depreciation = calculateDepreciation(
    inputs.netSellerPrice,
    inputs.renovationBudget,
    sciInputs.landPercentage,
    sciInputs.buildingDepreciationYears,
    sciInputs.renovationDepreciationYears
  );
  
  // Revenu imposable (avec amortissement)
  const taxableIncome = Math.max(0, grossAnnualIncome - deductibleCharges - depreciation);
  
  // Impôt Société
  const corporateTax = calculateCorporateTax(taxableIncome);
  
  // Bénéfice distribuable
  const distributableProfit = taxableIncome - corporateTax;
  
  // Flat tax sur dividendes (30%)
  const flatTax = distributableProfit * FLAT_TAX_RATE;
  
  const totalTax = corporateTax + flatTax;
  
  // Revenus nets
  const netAnnualIncome = distributableProfit - flatTax;
  const netMonthlyIncome = netAnnualIncome / 12;
  const personalShare = netMonthlyIncome * (sciInputs.ownershipPercentage / 100);
  
  // Cash-flow
  const monthlyLoanPayment = results.monthlyPayment;
  // Pour l'IS, on considère les dividendes distribués mensuellement
  const monthlyCashFlow = personalShare - (monthlyLoanPayment * (sciInputs.ownershipPercentage / 100));
  const savingsEffort = monthlyCashFlow < 0 ? Math.abs(monthlyCashFlow) : 0;
  
  // Point d'équilibre
  const creditDurationMonths = inputs.creditDuration * 12;
  const totalSavingsRequired = savingsEffort * creditDurationMonths;
  
  // Revenu après crédit
  const postLoanMonthlyIncome = personalShare;
  
  let breakEvenMonths = 0;
  if (savingsEffort > 0 && postLoanMonthlyIncome > 0) {
    breakEvenMonths = creditDurationMonths + Math.ceil(totalSavingsRequired / postLoanMonthlyIncome);
  } else if (monthlyCashFlow >= 0) {
    breakEvenMonths = 0;
  } else {
    breakEvenMonths = -1;
  }
  
  return {
    grossAnnualIncome,
    deductibleCharges,
    depreciation,
    taxableIncome,
    incomeTax: 0,
    socialCharges: 0,
    corporateTax,
    flatTax,
    totalTax,
    netAnnualIncome,
    netMonthlyIncome,
    personalShare,
    monthlyLoanPayment,
    monthlyCashFlow,
    savingsEffort,
    breakEvenMonths,
    totalSavingsRequired,
    postLoanMonthlyIncome,
  };
}

export function formatDuration(months: number): string {
  if (months === 0) return 'Immédiat';
  if (months === -1) return 'Non rentable';
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} mois`;
  } else if (remainingMonths === 0) {
    return `${years} an${years > 1 ? 's' : ''}`;
  } else {
    return `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois`;
  }
}
