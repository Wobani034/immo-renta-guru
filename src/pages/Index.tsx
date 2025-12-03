import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SimulationInputs, calculateSimulation } from '@/lib/calculations';
import { getSavedSimulations, queryParamsToInputs, SavedSimulation } from '@/lib/storage';
import { SimulationForm } from '@/components/SimulationForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { SavedSimulations } from '@/components/SavedSimulations';
import { ActionBar } from '@/components/ActionBar';
import { Building2, History } from 'lucide-react';

const defaultInputs: SimulationInputs = {
  title: '',
  monthlyRent: 1000,
  netSellerPrice: 200000,
  agencyFees: 10000,
  renovationBudget: 0,
  notaryFeesPercent: 8,
  creditDuration: 15,
  interestRate: 3,
  financingPercent: 100,
  targetProfitability: 10,
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const [inputs, setInputs] = useState<SimulationInputs>(defaultInputs);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);

  // Load from URL params on mount
  useEffect(() => {
    const paramsInputs = queryParamsToInputs(searchParams);
    if (Object.keys(paramsInputs).length > 0) {
      setInputs({ ...defaultInputs, ...paramsInputs });
    }
  }, []);

  // Load saved simulations
  useEffect(() => {
    setSavedSimulations(getSavedSimulations());
  }, []);

  const refreshSaved = () => {
    setSavedSimulations(getSavedSimulations());
  };

  const results = useMemo(() => calculateSimulation(inputs), [inputs]);

  const loadSimulation = (loadedInputs: SimulationInputs) => {
    setInputs(loadedInputs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">
                  Calculateur de Rentabilité
                </h1>
                <p className="text-xs text-muted-foreground">
                  Simulateur pour investisseur professionnel
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <ActionBar inputs={inputs} results={results} onSave={refreshSaved} />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Saved simulations (desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <div className="result-card">
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Simulations récentes
                  </h3>
                </div>
                <SavedSimulations 
                  simulations={savedSimulations}
                  onLoad={loadSimulation}
                  onRefresh={refreshSaved}
                />
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-5">
            <h2 className="text-lg font-semibold font-display text-foreground mb-6">
              Paramètres de la simulation
            </h2>
            <SimulationForm inputs={inputs} onChange={setInputs} />
          </div>

          {/* Results */}
          <div className="lg:col-span-4">
            <h2 className="text-lg font-semibold font-display text-foreground mb-6">
              Résultats
            </h2>
            <ResultsPanel inputs={inputs} results={results} />
          </div>
        </div>

        {/* Mobile action bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-md border-t border-border">
          <ActionBar inputs={inputs} results={results} onSave={refreshSaved} />
        </div>

        {/* Mobile saved simulations */}
        <div className="lg:hidden mt-8 mb-24">
          <div className="result-card">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">
                Simulations récentes
              </h3>
            </div>
            <SavedSimulations 
              simulations={savedSimulations}
              onLoad={loadSimulation}
              onRefresh={refreshSaved}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
