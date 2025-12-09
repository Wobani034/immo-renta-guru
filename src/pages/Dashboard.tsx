import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { SimulationInputs, calculateSimulation, formatCurrency } from '@/lib/calculations';
import { exportToPdf } from '@/lib/pdf-export';
import { Button } from '@/components/ui/button';
import { Building2, FileDown, Trash2, Edit, Plus, LogOut, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DatabaseSimulation {
  id: string;
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

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState<DatabaseSimulation[]>([]);
  const [loadingSimulations, setLoadingSimulations] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSimulations();
    }
  }, [user]);

  const fetchSimulations = async () => {
    try {
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSimulations(data || []);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos simulations.',
        variant: 'destructive',
      });
    } finally {
      setLoadingSimulations(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('simulations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSimulations(simulations.filter(s => s.id !== id));
      toast({
        title: 'Simulation supprimée',
        description: 'La simulation a été supprimée avec succès.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la simulation.',
        variant: 'destructive',
      });
    }
  };

  const dbToInputs = (sim: DatabaseSimulation): SimulationInputs => ({
    title: sim.title,
    monthlyRent: Number(sim.monthly_rent),
    netSellerPrice: Number(sim.net_seller_price),
    agencyFees: Number(sim.agency_fees),
    renovationBudget: Number(sim.renovation_budget),
    notaryFeesPercent: Number(sim.notary_fees_percent),
    creditDuration: Number(sim.credit_duration),
    interestRate: Number(sim.interest_rate),
    downPayment: 0, // DB has financing_percent, we default to 0 apport
    targetProfitability: Number(sim.target_profitability),
    // Frais récurrents (not yet in DB, default to 0)
    maintenanceFees: 0,
    propertyTax: 0,
    cfe: 0,
    condoFees: 0,
  });

  const handleExportPdf = (sim: DatabaseSimulation) => {
    const inputs = dbToInputs(sim);
    const results = calculateSimulation(inputs);
    exportToPdf(inputs, results);
    toast({
      title: 'Export PDF',
      description: 'La fenêtre d\'impression va s\'ouvrir.',
    });
  };

  const handleLoadSimulation = (sim: DatabaseSimulation) => {
    const inputs = dbToInputs(sim);
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
    navigate(`/?${params.toString()}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

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
                  Mes Simulations
                </h1>
                <p className="text-xs text-muted-foreground">
                  Alpaca Immobilier
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Simulateur</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display text-foreground">
              Vos simulations sauvegardées
            </h2>
            <p className="text-muted-foreground mt-1">
              {simulations.length} simulation{simulations.length !== 1 ? 's' : ''} enregistrée{simulations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle simulation
          </Button>
        </div>

        {loadingSimulations ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement de vos simulations...</p>
          </div>
        ) : simulations.length === 0 ? (
          <div className="text-center py-12">
            <div className="result-card max-w-md mx-auto">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Aucune simulation
              </h3>
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore de simulation sauvegardée. Créez votre première simulation pour la retrouver ici.
              </p>
              <Button onClick={() => navigate('/')}>
                Créer une simulation
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {simulations.map((sim) => {
              const inputs = dbToInputs(sim);
              const results = calculateSimulation(inputs);
              
              return (
                <div key={sim.id} className="result-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {sim.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Modifié le {new Date(sim.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      results.currentProfitability >= sim.target_profitability
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {results.currentProfitability.toFixed(1)}%
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix net vendeur</span>
                      <span className="font-medium">{formatCurrency(sim.net_seller_price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loyer mensuel</span>
                      <span className="font-medium">{formatCurrency(sim.monthly_rent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coût total</span>
                      <span className="font-medium">{formatCurrency(results.totalProjectCost)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadSimulation(sim)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPdf(sim)}
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette simulation ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. La simulation "{sim.title}" sera définitivement supprimée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(sim.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
