import { SimulationInputs } from './calculations';

export interface SavedSimulation {
  id: string;
  inputs: SimulationInputs;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'immo-simulations';

export function generateId(): string {
  return `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getSavedSimulations(): SavedSimulation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSimulation(inputs: SimulationInputs): SavedSimulation {
  const simulations = getSavedSimulations();
  const now = new Date().toISOString();
  
  // Check if simulation with same title exists
  const existingIndex = simulations.findIndex(s => s.inputs.title === inputs.title);
  
  let saved: SavedSimulation;
  
  if (existingIndex >= 0) {
    // Update existing
    saved = {
      ...simulations[existingIndex],
      inputs,
      updatedAt: now,
    };
    simulations[existingIndex] = saved;
  } else {
    // Create new
    saved = {
      id: generateId(),
      inputs,
      createdAt: now,
      updatedAt: now,
    };
    simulations.unshift(saved);
  }
  
  // Keep only last 20 simulations
  const toSave = simulations.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  
  return saved;
}

export function deleteSimulation(id: string): void {
  const simulations = getSavedSimulations();
  const filtered = simulations.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function inputsToQueryParams(inputs: SimulationInputs): string {
  const params = new URLSearchParams({
    title: inputs.title,
    loyer: inputs.monthlyRent.toString(),
    prixNet: inputs.netSellerPrice.toString(),
    agence: inputs.agencyFees.toString(),
    travaux: inputs.renovationBudget.toString(),
    tauxNotaire: inputs.notaryFeesPercent.toString(),
    duree: inputs.creditDuration.toString(),
    tauxCredit: inputs.interestRate.toString(),
    apport: inputs.downPayment.toString(),
    rentaCible: inputs.targetProfitability.toString(),
  });
  
  return params.toString();
}

export function queryParamsToInputs(searchParams: URLSearchParams): Partial<SimulationInputs> {
  const result: Partial<SimulationInputs> = {};
  
  const title = searchParams.get('title');
  if (title) result.title = title;
  
  const loyer = searchParams.get('loyer');
  if (loyer) result.monthlyRent = parseFloat(loyer);
  
  const prixNet = searchParams.get('prixNet');
  if (prixNet) result.netSellerPrice = parseFloat(prixNet);
  
  const agence = searchParams.get('agence');
  if (agence) result.agencyFees = parseFloat(agence);
  
  const travaux = searchParams.get('travaux');
  if (travaux) result.renovationBudget = parseFloat(travaux);
  
  const tauxNotaire = searchParams.get('tauxNotaire');
  if (tauxNotaire) result.notaryFeesPercent = parseFloat(tauxNotaire);
  
  const duree = searchParams.get('duree');
  if (duree) result.creditDuration = parseFloat(duree);
  
  const tauxCredit = searchParams.get('tauxCredit');
  if (tauxCredit) result.interestRate = parseFloat(tauxCredit);
  
  const apport = searchParams.get('apport');
  if (apport) result.downPayment = parseFloat(apport);
  
  const rentaCible = searchParams.get('rentaCible');
  if (rentaCible) result.targetProfitability = parseFloat(rentaCible);
  
  return result;
}
