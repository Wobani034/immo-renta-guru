import { SimulationInputs, SimulationResults, formatCurrency } from '@/lib/calculations';
import { TrendingUp, Calculator, Wallet, Target, ArrowDown, ArrowUp } from 'lucide-react';

interface ResultsPanelProps {
  inputs: SimulationInputs;
  results: SimulationResults;
}

export function ResultsPanel({ inputs, results }: ResultsPanelProps) {
  const isProfitable = results.currentProfitability >= inputs.targetProfitability;
  const profitabilityDiff = results.currentProfitability - inputs.targetProfitability;

  return (
    <div className="space-y-6">
      {/* Coût total du projet */}
      <div className="result-card animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <h3 className="section-title !mb-0">Coût total du projet</h3>
        </div>

        <div className="text-3xl font-bold text-primary mb-4">
          {formatCurrency(results.totalProjectCost)}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Prix net vendeur</span>
            <span className="font-medium">{formatCurrency(inputs.netSellerPrice)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Frais d'agence</span>
            <span className="font-medium">{formatCurrency(inputs.agencyFees)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Travaux</span>
            <span className="font-medium">{formatCurrency(inputs.renovationBudget)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Frais de notaire ({inputs.notaryFeesPercent}%)</span>
            <span className="font-medium">{formatCurrency(results.notaryFees)}</span>
          </div>
        </div>
      </div>

      {/* Rentabilité actuelle */}
      <div 
        className={`result-card animate-slide-up ${
          isProfitable ? 'ring-2 ring-success/30' : 'ring-2 ring-warning/30'
        }`}
        style={{ animationDelay: '0.1s' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-2 rounded-lg ${isProfitable ? 'bg-success/10' : 'bg-warning/10'}`}>
            <TrendingUp className={`h-5 w-5 ${isProfitable ? 'text-success' : 'text-warning'}`} />
          </div>
          <h3 className="section-title !mb-0">Rentabilité brute actuelle</h3>
        </div>

        <div className={`text-4xl font-bold ${isProfitable ? 'text-success' : 'text-warning'}`}>
          {results.currentProfitability.toFixed(2)}%
        </div>

        <div className="mt-3 flex items-center gap-2">
          {isProfitable ? (
            <>
              <ArrowUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">
                +{profitabilityDiff.toFixed(2)}% au-dessus de l'objectif
              </span>
            </>
          ) : (
            <>
              <ArrowDown className="h-4 w-4 text-warning" />
              <span className="text-sm text-warning">
                {Math.abs(profitabilityDiff).toFixed(2)}% en-dessous de l'objectif
              </span>
            </>
          )}
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          Loyer annuel : {formatCurrency(inputs.monthlyRent * 12)}
        </div>
      </div>

      {/* Crédit */}
      <div className="result-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <h3 className="section-title !mb-0">Crédit immobilier</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="stat-label">Montant emprunté</div>
            <div className="text-xl font-bold text-foreground">
              {formatCurrency(results.loanAmount)}
            </div>
          </div>
          <div>
            <div className="stat-label">Mensualité</div>
            <div className="text-xl font-bold text-primary">
              {formatCurrency(results.monthlyPayment)}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Coût total des intérêts</span>
            <span className="font-semibold text-destructive">
              {formatCurrency(results.totalInterestCost)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Sur {inputs.creditDuration} ans à {inputs.interestRate}%
          </div>
        </div>
      </div>

      {/* Objectif rentabilité */}
      <div 
        className="result-card animate-slide-up bg-gradient-to-br from-accent/5 to-accent/10 ring-1 ring-accent/20"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-accent/20">
            <Target className="h-5 w-5 text-accent" />
          </div>
          <h3 className="section-title !mb-0">
            Objectif {inputs.targetProfitability}% de rentabilité
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="stat-label mb-1">Prix net vendeur maximum recommandé</div>
            <div className="text-3xl font-bold text-accent">
              {formatCurrency(results.maxNetSellerPrice)}
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg">
            <div className="stat-label mb-2">Coût total max du projet</div>
            <div className="text-xl font-semibold text-foreground">
              {formatCurrency(results.maxTotalCost)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Pour une rentabilité de {inputs.targetProfitability}%, votre prix net vendeur max 
              recommandé est de {formatCurrency(results.maxNetSellerPrice)}.
            </p>
          </div>

          {results.maxNetSellerPrice < inputs.netSellerPrice && (
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-sm text-warning font-medium">
                ⚠️ Le prix actuel ({formatCurrency(inputs.netSellerPrice)}) est supérieur 
                au prix max recommandé. Négociez une baisse de{' '}
                {formatCurrency(inputs.netSellerPrice - results.maxNetSellerPrice)}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
