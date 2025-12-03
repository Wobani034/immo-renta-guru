import { SimulationInputs } from '@/lib/calculations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Building2, CreditCard, Target, Home } from 'lucide-react';

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

      {/* Bloc B - Prix et frais */}
      <div className="result-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="section-title !mb-0">Prix et frais d'acquisition</h3>
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
            <Label htmlFor="renovationBudget">Travaux (enveloppe prévue, €)</Label>
            <Input
              id="renovationBudget"
              type="number"
              placeholder="Ex : 20 000"
              value={inputs.renovationBudget || ''}
              onChange={(e) => handleNumberChange('renovationBudget', e.target.value)}
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
              Foncière : frais de notaire normaux (~8%)
            </p>
          </div>
        </div>
      </div>

      {/* Bloc C - Financement */}
      <div className="result-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
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

      {/* Bloc D - Rentabilité cible */}
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
