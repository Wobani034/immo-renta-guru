import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SimulationInputs, calculateSimulation } from '@/lib/calculations';
import { queryParamsToInputs } from '@/lib/storage';
import { getUserSimulations, SupabaseSimulation } from '@/lib/supabase-storage';
import { SimulationForm } from '@/components/SimulationForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { SavedSimulations } from '@/components/SavedSimulations';
import { ActionBar } from '@/components/ActionBar';
import { useAuth } from '@/hooks/useAuth';
import { History, User, LogOut, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import alpacaLogo from '@/assets/alpaca-logo.png';

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
  maintenanceFees: 0,
  propertyTax: 0,
  cfe: 0,
  condoFees: 0,
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<SimulationInputs>(defaultInputs);
  const [savedSimulations, setSavedSimulations] = useState<SupabaseSimulation[]>([]);
  const { user, loading, signOut } = useAuth();

  // Load from URL params on mount
  useEffect(() => {
    const paramsInputs = queryParamsToInputs(searchParams);
    if (Object.keys(paramsInputs).length > 0) {
      setInputs({ ...defaultInputs, ...paramsInputs });
    }
  }, []);

  // Load saved simulations when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserSimulations();
    } else {
      setSavedSimulations([]);
    }
  }, [user]);

  const loadUserSimulations = async () => {
    if (!user) return;
    const { data } = await getUserSimulations(user.id);
    if (data) {
      setSavedSimulations(data);
    }
  };

  const results = useMemo(() => calculateSimulation(inputs), [inputs]);

  const loadSimulation = (loadedInputs: SimulationInputs) => {
    setInputs(loadedInputs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={alpacaLogo} alt="Alpaca Immobilier" className="h-12 w-auto" />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="https://alpaca.immo/services" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Nos services
              </a>
              <a href="https://alpaca.immo/contact" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <a href="tel:0970703107" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                <Phone className="h-4 w-4" />
                09 70 70 31 07
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <ActionBar inputs={inputs} results={results} onSave={loadUserSimulations} />
              </div>
              {!loading && (
                user ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/dashboard')}
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSignOut}
                      title="Se déconnecter"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/auth')}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Connexion</span>
                  </Button>
                )
              )}
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
                  onRefresh={loadUserSimulations}
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
          <ActionBar inputs={inputs} results={results} onSave={loadUserSimulations} />
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
              onRefresh={loadUserSimulations}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
