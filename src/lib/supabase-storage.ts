import { supabase } from '@/integrations/supabase/client';
import { SimulationInputs } from './calculations';

export interface SupabaseSimulation {
  id: string;
  user_id: string;
  title: string;
  monthly_rent: number;
  net_seller_price: number;
  agency_fees: number;
  renovation_budget: number;
  notary_fees_percent: number;
  credit_duration: number;
  interest_rate: number;
  financing_percent: number;
  target_profitability: number;
  created_at: string;
  updated_at: string;
}

export function simulationToInputs(sim: SupabaseSimulation): SimulationInputs {
  return {
    title: sim.title,
    monthlyRent: sim.monthly_rent,
    netSellerPrice: sim.net_seller_price,
    agencyFees: sim.agency_fees,
    renovationBudget: sim.renovation_budget,
    notaryFeesPercent: sim.notary_fees_percent,
    creditDuration: sim.credit_duration,
    interestRate: sim.interest_rate,
    downPayment: 0, // DB has financing_percent, we default to 0 apport for now
    targetProfitability: sim.target_profitability,
    // Frais récurrents (not yet in DB, default to 0)
    maintenanceFees: 0,
    propertyTax: 0,
    cfe: 0,
    condoFees: 0,
  };
}

export async function saveSimulationToSupabase(
  userId: string,
  inputs: SimulationInputs
): Promise<{ data: SupabaseSimulation | null; error: Error | null }> {
  // Check if simulation with same title exists for this user
  const { data: existing } = await supabase
    .from('simulations')
    .select('id')
    .eq('user_id', userId)
    .eq('title', inputs.title)
    .single();

  if (existing) {
    // Update existing simulation
    const { data, error } = await supabase
      .from('simulations')
      .update({
        monthly_rent: inputs.monthlyRent,
        net_seller_price: inputs.netSellerPrice,
        agency_fees: inputs.agencyFees,
        renovation_budget: inputs.renovationBudget,
        notary_fees_percent: inputs.notaryFeesPercent,
        credit_duration: inputs.creditDuration,
        interest_rate: inputs.interestRate,
        financing_percent: 100, // Legacy field - we now use downPayment
        target_profitability: inputs.targetProfitability,
      })
      .eq('id', existing.id)
      .select()
      .single();

    return { data: data as SupabaseSimulation | null, error: error as Error | null };
  } else {
    // Create new simulation
    const { data, error } = await supabase
      .from('simulations')
      .insert({
        user_id: userId,
        title: inputs.title,
        monthly_rent: inputs.monthlyRent,
        net_seller_price: inputs.netSellerPrice,
        agency_fees: inputs.agencyFees,
        renovation_budget: inputs.renovationBudget,
        notary_fees_percent: inputs.notaryFeesPercent,
        credit_duration: inputs.creditDuration,
        interest_rate: inputs.interestRate,
        financing_percent: 100, // Legacy field - we now use downPayment
        target_profitability: inputs.targetProfitability,
      })
      .select()
      .single();

    return { data: data as SupabaseSimulation | null, error: error as Error | null };
  }
}

export async function getUserSimulations(
  userId: string
): Promise<{ data: SupabaseSimulation[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  return { data: data as SupabaseSimulation[] | null, error: error as Error | null };
}

export async function deleteSupabaseSimulation(
  simulationId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('simulations')
    .delete()
    .eq('id', simulationId);

  return { error: error as Error | null };
}
