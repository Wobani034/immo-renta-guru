import { SimulationInputs } from '@/lib/calculations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Building2, CreditCard, Target, Home, Wrench, Receipt } from 'lucide-react';

interface SimulationFormProps {
  inputs: SimulationInputs;
  onChange: (inputs: SimulationInputs) => void;
}

export function SimulationForm({ inputs, onChange }: SimulationFormProps) {
  const updateField = <K extends keyof SimulationInputs>(
    field: K,
    value: SimulationInputs[K]
  ) => {
    onChange({ ...inputs, [field]: value });
  };

  const handleNumberChange = (field: keyof SimulationInputs, value: string) => {
    const num = parseFloat(value) || 0;
    updateField(field, num);
  };

  return (
    <div className="space-y-8">
      {/* Bloc A - Infos générales */}
      <div className="result-card animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <h3 className="section-title !mb-0">Informations générales</h3>
        </div>

        <div className="space-y-5">
          <div className="input-group">
            <Label htmlFor="title">Titre de la simulation</Label>
            <Input
              id="title"
              placeholder="Ex : T2 Le Crès – 200k € – objectif 10%"
              value={inputs.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="shadow-input"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="monthlyRent">Loyer mensuel attendu (€)</Label>
            <Input
              id="monthlyRent"
              type="number"
              placeholder="Ex : 1 000"
              value={inputs.monthlyRent || ''}
              onChange={(e) => handleNumberChange('monthlyRent', e.target.value)}
              className="shadow-input"
            />
          </div>
        </div>
      </div>

      {/* Bloc B - Coût d'acquisition */}
      <div className="result-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="section-title !mb-0">Coût d'acquisition</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="input-group">
            <Label htmlFor="netSellerPrice">Prix net vendeur (€)</Label>
            <Input
              id="netSellerPrice"
              type="number"
              placeholder="Ex : 200 000"
              value={inputs.netSellerPrice || ''}
              onChange={(e) => handleNumberChange('netSellerPrice', e.target.value)}
              className="shadow-input"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="agencyFees">Frais d'agence (€)</Label>
            <Input
              id="agencyFees"
              type="number"
              placeholder="Ex : 10 000"
              value={inputs.agencyFees || ''}
              onChange={(e) => handleNumberChange('agencyFees', e.target.value)}
              className="shadow-input"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="notaryFeesPercent">Frais de notaire (%)</Label>
            <Input
              id="notaryFeesPercent"
              type="number"
              step="0.1"
              placeholder="8"
              value={inputs.notaryFeesPercent || ''}
              onChange={(e) => handleNumberChange('notaryFeesPercent', e.target.value)}
              className="shadow-input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ancien : ~8% | Neuf : ~3%
            </p>
          </div>
        </div>
      </div>

      {/* Bloc C - Travaux */}
      <div className="result-card animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-warning/10">
            <Wrench className="h-5 w-5 text-warning" />
          </div>
          <h3 className="section-title !mb-0">Travaux</h3>
        </div>

        <div className="input-group">
          <Label htmlFor="renovationBudget">Enveloppe travaux (€)</Label>
          <Input
            id="renovationBudget"
            type="number"
            placeholder="Ex : 20 000"
            value={inputs.renovationBudget || ''}
            onChange={(e) => handleNumberChange('renovationBudget', e.target.value)}
            className="shadow-input"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Cosmétique, rénovation lourde, énergétique ou transformation
          </p>
        </div>
      </div>

      {/* Bloc D - Frais récurrents */}
      <div className="result-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-destructive/10">
            <Receipt className="h-5 w-5 text-destructive" />
          </div>
          <h3 className="section-title !mb-0">Frais récurrents & charges</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="input-group">
            <Label htmlFor="maintenanceFees">Frais d'entretien / réparations (€/an)</Label>
            <Input
              id="maintenanceFees"
              type="number"
              placeholder="Ex : 500"
              value={inputs.maintenanceFees || ''}
              onChange={(e) => handleNumberChange('maintenanceFees', e.target.value)}
              className="shadow-input"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="propertyTax">Taxe foncière (€/an)</Label>
            <Input
              id="propertyTax"
              type="number"
              placeholder="Ex : 1 200"
              value={inputs.propertyTax || ''}
              onChange={(e) => handleNumberChange('propertyTax', e.target.value)}
              className="shadow-input"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="cfe">CFE (€/an)</Label>
            <Input
              id="cfe"
              type="number"
              placeholder="Ex : 300"
              value={inputs.cfe || ''}
              onChange={(e) => handleNumberChange('cfe', e.target.value)}
              className="shadow-input"
            />
          </div>

          <div className="input-group">
            <Label htmlFor="condoFees">Frais de copropriété (€/an)</Label>
            <Input
              id="condoFees"
              type="number"
              placeholder="Ex : 1 800"
              value={inputs.condoFees || ''}
              onChange={(e) => handleNumberChange('condoFees', e.target.value)}
              className="shadow-input"
            />
          </div>
        </div>
      </div>

      {/* Bloc E - Financement */}
      <div className="result-card animate-fade-in" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <h3 className="section-title !mb-0">Financement / Crédit</h3>
        </div>

        <div className="space-y-6">
          <div className="input-group">
            <div className="flex items-center justify-between">
              <Label htmlFor="creditDuration">Durée du crédit</Label>
              <span className="text-sm font-semibold text-primary">{inputs.creditDuration} ans</span>
            </div>
            <Slider
              id="creditDuration"
              value={[inputs.creditDuration]}
              onValueChange={([value]) => updateField('creditDuration', value)}
              min={5}
              max={30}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5 ans</span>
              <span>30 ans</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="input-group">
              <Label htmlFor="interestRate">Taux du crédit (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                placeholder="3"
                value={inputs.interestRate || ''}
                onChange={(e) => handleNumberChange('interestRate', e.target.value)}
                className="shadow-input"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="financingPercent">Part financée par la banque (%)</Label>
              <Input
                id="financingPercent"
                type="number"
                step="5"
                placeholder="100"
                value={inputs.financingPercent || ''}
                onChange={(e) => handleNumberChange('financingPercent', e.target.value)}
                className="shadow-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bloc F - Rentabilité cible */}
      <div className="result-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-accent/10">
            <Target className="h-5 w-5 text-accent" />
          </div>
          <h3 className="section-title !mb-0">Objectif de rentabilité</h3>
        </div>

        <div className="input-group">
          <div className="flex items-center justify-between">
            <Label htmlFor="targetProfitability">Rentabilité brute cible</Label>
            <span className="text-lg font-bold text-accent">{inputs.targetProfitability}%</span>
          </div>
          <Slider
            id="targetProfitability"
            value={[inputs.targetProfitability]}
            onValueChange={([value]) => updateField('targetProfitability', value)}
            min={5}
            max={20}
            step={0.5}
            className="mt-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>5%</span>
            <span>20%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
