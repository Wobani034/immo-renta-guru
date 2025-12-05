import { SimulationInputs, SimulationResults, formatCurrency } from '@/lib/calculations';
import { TrendingUp, Calculator, Wallet, Target, ArrowDown, ArrowUp, Receipt } from 'lucide-react';

interface ResultsPanelProps {
  inputs: SimulationInputs;
  results: SimulationResults;
}

export function ResultsPanel({ inputs, results }: ResultsPanelProps) {
  const isProfitable = results.currentProfitability >= inputs.targetProfitability;
  const profitabilityDiff = results.currentProfitability - inputs.targetProfitability;
  const isNetProfitable = results.netProfitability >= inputs.targetProfitability;

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

      {/* Rentabilité nette (si frais récurrents) */}
      {results.totalAnnualFees > 0 && (
        <div 
          className={`result-card animate-slide-up ${
            isNetProfitable ? 'ring-2 ring-success/30' : 'ring-2 ring-destructive/30'
          }`}
          style={{ animationDelay: '0.15s' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-2 rounded-lg ${isNetProfitable ? 'bg-success/10' : 'bg-destructive/10'}`}>
              <Receipt className={`h-5 w-5 ${isNetProfitable ? 'text-success' : 'text-destructive'}`} />
            </div>
            <h3 className="section-title !mb-0">Rentabilité nette (après charges)</h3>
          </div>

          <div className={`text-4xl font-bold ${isNetProfitable ? 'text-success' : 'text-destructive'}`}>
            {results.netProfitability.toFixed(2)}%
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Loyer annuel brut</span>
              <span className="font-medium">{formatCurrency(inputs.monthlyRent * 12)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Charges annuelles totales</span>
              <span className="font-medium text-destructive">- {formatCurrency(results.totalAnnualFees)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground font-semibold">Revenu net annuel</span>
              <span className="font-bold text-foreground">{formatCurrency(results.netAnnualIncome)}</span>
            </div>
          </div>
        </div>
      )}

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

        {/* Cas A: Rentabilité actuelle >= rentabilité cible */}
        {isProfitable ? (
          <div className="space-y-4">
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <p className="text-success font-semibold mb-2">
                ✓ Au prix actuel, vous êtes déjà au-dessus de votre objectif de rentabilité.
              </p>
              <p className="text-sm text-muted-foreground">
                Rentabilité actuelle : <span className="font-medium text-foreground">{results.currentProfitability.toFixed(2)}%</span> — Objectif : <span className="font-medium text-foreground">{inputs.targetProfitability}%</span>
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Théoriquement, pour une rentabilité de {inputs.targetProfitability}%, le prix net vendeur 
                maximum pourrait monter jusqu'à <span className="font-semibold">{formatCurrency(results.maxNetSellerPrice)}</span> (coût total : {formatCurrency(results.maxTotalCost)}).
                Mais aucun ajustement n'est nécessaire au prix actuel.
              </p>
            </div>
          </div>
        ) : (
          /* Cas B: Rentabilité actuelle < rentabilité cible */
          <div className="space-y-4">
            <div>
              <div className="stat-label mb-1">Prix net vendeur maximum pour atteindre votre objectif</div>
              <div className="text-3xl font-bold text-accent">
                {formatCurrency(results.maxNetSellerPrice)}
              </div>
            </div>

            <div className="p-4 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Pour atteindre une rentabilité brute de <span className="font-semibold text-foreground">{inputs.targetProfitability}%</span>, 
                votre prix net vendeur ne doit pas dépasser : <span className="font-semibold text-accent">{formatCurrency(results.maxNetSellerPrice)}</span>.
              </p>
              
              <div className="stat-label mb-2">Coût total max du projet</div>
              <div className="text-xl font-semibold text-foreground">
                {formatCurrency(results.maxTotalCost)}
              </div>
            </div>

            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Prix net vendeur actuel : <span className="font-semibold text-foreground">{formatCurrency(inputs.netSellerPrice)}</span>
                </p>
                <p className="text-sm text-warning font-medium">
                  ⚠️ Écart à négocier : {formatCurrency(inputs.netSellerPrice - results.maxNetSellerPrice)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
