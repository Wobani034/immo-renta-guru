export interface SimulationInputs {
  title: string;
  monthlyRent: number;
  netSellerPrice: number;
  agencyFees: number;
  renovationBudget: number;
  notaryFeesPercent: number;
  creditDuration: number;
  interestRate: number;
  downPayment: number; // Apport en €
  targetProfitability: number;
  // Frais récurrents
  maintenanceFees: number;
  propertyTax: number;
  cfe: number;
  condoFees: number;
}

export interface SimulationResults {
  // Current situation
  notaryFees: number;
  totalProjectCost: number;
  currentProfitability: number;
  
  // Recurring fees
  totalAnnualFees: number;
  netAnnualIncome: number;
  netProfitability: number;
  
  // Credit
  loanAmount: number;
  monthlyPayment: number;
  totalInterestCost: number;
  
  // Target profitability
  maxNetSellerPrice: number;
  maxTotalCost: number;
}

export function calculateNotaryFees(
  netSellerPrice: number,
  agencyFees: number,
  notaryFeesPercent: number
): number {
  return (netSellerPrice + agencyFees) * (notaryFeesPercent / 100);
}

export function calculateTotalProjectCost(
  netSellerPrice: number,
  agencyFees: number,
  renovationBudget: number,
  notaryFees: number
): number {
  return netSellerPrice + agencyFees + renovationBudget + notaryFees;
}

export function calculateGrossProfitability(
  monthlyRent: number,
  totalProjectCost: number
): number {
  if (totalProjectCost === 0) return 0;
  const annualRent = monthlyRent * 12;
  return (annualRent / totalProjectCost) * 100;
}

export function calculateMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  durationYears: number
): number {
  if (loanAmount === 0 || annualInterestRate === 0) {
    return loanAmount / (durationYears * 12);
  }
  
  const monthlyRate = annualInterestRate / 12 / 100;
  const numberOfPayments = durationYears * 12;
  
  const payment = loanAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments)));
  
  return payment;
}

export function calculateTotalInterestCost(
  monthlyPayment: number,
  durationYears: number,
  loanAmount: number
): number {
  const totalPaid = monthlyPayment * durationYears * 12;
  return totalPaid - loanAmount;
}

export function calculateMaxNetSellerPrice(
  monthlyRent: number,
  agencyFees: number,
  renovationBudget: number,
  notaryFeesPercent: number,
  targetProfitability: number
): number {
  const annualRent = monthlyRent * 12;
  const targetRate = targetProfitability / 100;
  const notaryRate = notaryFeesPercent / 100;
  
  if (targetRate === 0) return 0;
  
  // coût_total = (prix_net + agence + travaux) * (1 + notaire)
  // Rentabilité = loyer_annuel / coût_total
  // => prix_net = (loyer_annuel / rentabilité) / (1 + notaire) - agence - travaux
  
  const maxTotalCost = annualRent / targetRate;
  const baseAmount = maxTotalCost / (1 + notaryRate);
  const maxNetPrice = baseAmount - agencyFees - renovationBudget;
  
  return Math.max(0, maxNetPrice);
}

export function calculateSimulation(inputs: SimulationInputs): SimulationResults {
  const notaryFees = calculateNotaryFees(
    inputs.netSellerPrice,
    inputs.agencyFees,
    inputs.notaryFeesPercent
  );
  
  const totalProjectCost = calculateTotalProjectCost(
    inputs.netSellerPrice,
    inputs.agencyFees,
    inputs.renovationBudget,
    notaryFees
  );
  
  const currentProfitability = calculateGrossProfitability(
    inputs.monthlyRent,
    totalProjectCost
  );
  
  // Calculate net profitability with recurring fees
  const totalAnnualFees = (inputs.maintenanceFees || 0) + 
                          (inputs.propertyTax || 0) + 
                          (inputs.cfe || 0) + 
                          (inputs.condoFees || 0);
  const annualRent = inputs.monthlyRent * 12;
  const netAnnualIncome = annualRent - totalAnnualFees;
  const netProfitability = totalProjectCost > 0 ? (netAnnualIncome / totalProjectCost) * 100 : 0;
  
  const loanAmount = Math.max(0, totalProjectCost - (inputs.downPayment || 0));
  
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    inputs.interestRate,
    inputs.creditDuration
  );
  
  const totalInterestCost = calculateTotalInterestCost(
    monthlyPayment,
    inputs.creditDuration,
    loanAmount
  );
  
  const maxNetSellerPrice = calculateMaxNetSellerPrice(
    inputs.monthlyRent,
    inputs.agencyFees,
    inputs.renovationBudget,
    inputs.notaryFeesPercent,
    inputs.targetProfitability
  );
  
  const maxNotaryFees = calculateNotaryFees(
    maxNetSellerPrice,
    inputs.agencyFees,
    inputs.notaryFeesPercent
  );
  
  const maxTotalCost = calculateTotalProjectCost(
    maxNetSellerPrice,
    inputs.agencyFees,
    inputs.renovationBudget,
    maxNotaryFees
  );
  
  return {
    notaryFees,
    totalProjectCost,
    currentProfitability,
    totalAnnualFees,
    netAnnualIncome,
    netProfitability,
    loanAmount,
    monthlyPayment,
    totalInterestCost,
    maxNetSellerPrice,
    maxTotalCost,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
