import { SCIInputs, SCIResults, SCIRegimeResult, formatDuration } from '@/lib/sci-calculations';
import { formatCurrency } from '@/lib/calculations';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  Building2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SCIResultsPanelProps {
  sciInputs: SCIInputs;
  results: SCIResults;
  creditDuration: number;
}

function ResultCard({ 
  title, 
  regime, 
  result, 
  isBest,
  ownershipPercentage,
  creditDuration
}: { 
  title: string; 
  regime: 'IR' | 'IS';
  result: SCIRegimeResult;
  isBest: boolean;
  ownershipPercentage: number;
  creditDuration: number;
}) {
  const isPositiveCashFlow = result.monthlyCashFlow >= 0;
  
  return (
    <div className={`p-4 rounded-lg border ${isBest ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {title}
        </h4>
        {isBest && (
          <Badge variant="default" className="text-xs">
            Recommandé
          </Badge>
        )}
      </div>
      
      {/* Revenus et charges */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Revenus bruts annuels</span>
          <span>{formatCurrency(result.grossAnnualIncome)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Charges déductibles</span>
          <span className="text-destructive">-{formatCurrency(result.deductibleCharges)}</span>
        </div>
        {regime === 'IS' && result.depreciation > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amortissement</span>
            <span className="text-destructive">-{formatCurrency(result.depreciation)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-2">
          <span className="text-muted-foreground">Base imposable</span>
          <span>{formatCurrency(result.taxableIncome)}</span>
        </div>
      </div>
      
      {/* Impôts */}
      <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
        {regime === 'IR' ? (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Impôt sur le revenu</span>
              <span className="text-destructive">-{formatCurrency(result.incomeTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prélèvements sociaux (17.2%)</span>
              <span className="text-destructive">-{formatCurrency(result.socialCharges)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Impôt société (IS)</span>
              <span className="text-destructive">-{formatCurrency(result.corporateTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Flat tax dividendes (30%)</span>
              <span className="text-destructive">-{formatCurrency(result.flatTax)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between font-medium border-t border-border pt-2">
          <span>Total impôts</span>
          <span className="text-destructive">-{formatCurrency(result.totalTax)}</span>
        </div>
      </div>
      
      {/* Revenus nets */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Revenu net annuel</span>
          <span className="font-medium">{formatCurrency(result.netAnnualIncome)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Revenu net mensuel</span>
          <span className="font-medium">{formatCurrency(result.netMonthlyIncome)}</span>
        </div>
        {ownershipPercentage < 100 && (
          <div className="flex justify-between text-sm border-t border-border pt-2">
            <span className="text-muted-foreground">Votre part ({ownershipPercentage}%)</span>
            <span className="font-semibold text-primary">{formatCurrency(result.personalShare)}/mois</span>
          </div>
        )}
      </div>
      
      {/* Cash-flow */}
      <div className={`mt-4 p-3 rounded-lg ${isPositiveCashFlow ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPositiveCashFlow ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-amber-600" />
            )}
            <span className="text-sm font-medium">Cash-flow mensuel</span>
          </div>
          <span className={`font-bold ${isPositiveCashFlow ? 'text-emerald-600' : 'text-amber-600'}`}>
            {formatCurrency(result.monthlyCashFlow)}
          </span>
        </div>
        
        {!isPositiveCashFlow && (
          <div className="mt-2 flex items-center gap-2 text-sm text-amber-700">
            <PiggyBank className="h-4 w-4" />
            <span>Effort d'épargne : <strong>{formatCurrency(result.savingsEffort)}/mois</strong></span>
          </div>
        )}
      </div>
      
      {/* Point d'équilibre */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Point d'équilibre</span>
        </div>
        
        {result.breakEvenMonths === 0 ? (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">Rentable dès le 1er jour !</span>
          </div>
        ) : result.breakEvenMonths === -1 ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Non rentable avec ces paramètres</span>
          </div>
        ) : (
          <div className="space-y-1 text-sm">
            <p>Rentabilité atteinte en <strong>{formatDuration(result.breakEvenMonths)}</strong></p>
            <p className="text-muted-foreground">
              Apport total requis : {formatCurrency(result.totalSavingsRequired)}
            </p>
          </div>
        )}
        
        <div className="mt-3 pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Après remboursement du crédit ({creditDuration} ans) :
          </p>
          <p className="text-sm font-semibold text-primary">
            {formatCurrency(result.postLoanMonthlyIncome)}/mois
          </p>
        </div>
      </div>
    </div>
  );
}

export function SCIResultsPanel({ sciInputs, results, creditDuration }: SCIResultsPanelProps) {
  const showBoth = sciInputs.fiscalRegime === 'both';
  const showIR = sciInputs.fiscalRegime === 'IR' || showBoth;
  const showIS = sciInputs.fiscalRegime === 'IS' || showBoth;
  
  return (
    <div className="space-y-6">
      {/* Comparaison header */}
      {showBoth && (
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Régime recommandé : SCI à l'{results.comparison.bestRegime}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gain de <strong>{formatCurrency(results.comparison.monthlyDifference)}/mois</strong> par rapport à l'autre régime
              </p>
            </div>
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>
      )}
      
      {/* Résultats par régime */}
      <div className={`grid gap-4 ${showBoth ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {showIR && (
          <ResultCard
            title="SCI à l'IR"
            regime="IR"
            result={results.ir}
            isBest={showBoth && results.comparison.bestRegime === 'IR'}
            ownershipPercentage={sciInputs.ownershipPercentage}
            creditDuration={creditDuration}
          />
        )}
        {showIS && (
          <ResultCard
            title="SCI à l'IS"
            regime="IS"
            result={results.is}
            isBest={showBoth && results.comparison.bestRegime === 'IS'}
            ownershipPercentage={sciInputs.ownershipPercentage}
            creditDuration={creditDuration}
          />
        )}
      </div>
      
      {/* Résumé comparatif */}
      {showBoth && (
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-semibold mb-3">Tableau comparatif</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4">Indicateur</th>
                  <th className="text-right py-2 px-4">SCI à l'IR</th>
                  <th className="text-right py-2 pl-4">SCI à l'IS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Revenus bruts</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(results.ir.grossAnnualIncome)}</td>
                  <td className="py-2 pl-4 text-right">{formatCurrency(results.is.grossAnnualIncome)}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Total impôts</td>
                  <td className="py-2 px-4 text-right text-destructive">{formatCurrency(results.ir.totalTax)}</td>
                  <td className="py-2 pl-4 text-right text-destructive">{formatCurrency(results.is.totalTax)}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Revenu net annuel</td>
                  <td className="py-2 px-4 text-right font-medium">{formatCurrency(results.ir.netAnnualIncome)}</td>
                  <td className="py-2 pl-4 text-right font-medium">{formatCurrency(results.is.netAnnualIncome)}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Cash-flow mensuel</td>
                  <td className={`py-2 px-4 text-right font-medium ${results.ir.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {formatCurrency(results.ir.monthlyCashFlow)}
                  </td>
                  <td className={`py-2 pl-4 text-right font-medium ${results.is.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {formatCurrency(results.is.monthlyCashFlow)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Après crédit</td>
                  <td className="py-2 px-4 text-right font-semibold text-primary">{formatCurrency(results.ir.postLoanMonthlyIncome)}/mois</td>
                  <td className="py-2 pl-4 text-right font-semibold text-primary">{formatCurrency(results.is.postLoanMonthlyIncome)}/mois</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
