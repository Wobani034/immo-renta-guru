import { SCIInputs } from '@/lib/sci-calculations';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface SCIFormProps {
  inputs: SCIInputs;
  onChange: (inputs: SCIInputs) => void;
}

const TAX_RATES = [
  { value: 0, label: '0%', description: 'Non imposable' },
  { value: 11, label: '11%', description: 'Jusqu\'à 28 797€' },
  { value: 30, label: '30%', description: 'De 28 798€ à 82 341€' },
  { value: 41, label: '41%', description: 'De 82 342€ à 177 106€' },
  { value: 45, label: '45%', description: 'Au-delà de 177 106€' },
];

export function SCIForm({ inputs, onChange }: SCIFormProps) {
  const handleChange = (field: keyof SCIInputs, value: number | string) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Part dans la SCI */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="ownershipPercentage" className="text-sm font-medium">
            Votre part dans la SCI
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Le pourcentage de parts que vous détenez dans la SCI. 
                  Les revenus et charges seront calculés au prorata.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            value={[inputs.ownershipPercentage]}
            onValueChange={([value]) => handleChange('ownershipPercentage', value)}
            min={1}
            max={100}
            step={1}
            className="flex-1"
          />
          <div className="flex items-center gap-1 min-w-[80px]">
            <Input
              type="number"
              value={inputs.ownershipPercentage}
              onChange={(e) => handleChange('ownershipPercentage', Number(e.target.value))}
              min={1}
              max={100}
              className="w-16 text-center"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {/* Taux marginal d'imposition */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            Taux marginal d'imposition (TMI)
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Votre tranche marginale d'imposition. 
                  Utilisé pour calculer l'impôt en régime IR.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {TAX_RATES.map((rate) => (
            <button
              key={rate.value}
              onClick={() => handleChange('marginalTaxRate', rate.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                inputs.marginalTaxRate === rate.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-muted'
              }`}
            >
              {rate.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {TAX_RATES.find(r => r.value === inputs.marginalTaxRate)?.description}
        </p>
      </div>

      {/* Régime fiscal */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Régime fiscal à simuler</Label>
        <RadioGroup
          value={inputs.fiscalRegime}
          onValueChange={(value) => handleChange('fiscalRegime', value as 'IR' | 'IS' | 'both')}
          className="grid grid-cols-3 gap-3"
        >
          <label
            className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-colors ${
              inputs.fiscalRegime === 'IR'
                ? 'bg-primary/10 border-primary'
                : 'bg-background border-border hover:bg-muted'
            }`}
          >
            <RadioGroupItem value="IR" className="sr-only" />
            <span className="text-sm font-medium">SCI à l'IR</span>
            <span className="text-xs text-muted-foreground mt-1">Impôt sur le Revenu</span>
          </label>
          <label
            className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-colors ${
              inputs.fiscalRegime === 'IS'
                ? 'bg-primary/10 border-primary'
                : 'bg-background border-border hover:bg-muted'
            }`}
          >
            <RadioGroupItem value="IS" className="sr-only" />
            <span className="text-sm font-medium">SCI à l'IS</span>
            <span className="text-xs text-muted-foreground mt-1">Impôt sur les Sociétés</span>
          </label>
          <label
            className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-colors ${
              inputs.fiscalRegime === 'both'
                ? 'bg-primary/10 border-primary'
                : 'bg-background border-border hover:bg-muted'
            }`}
          >
            <RadioGroupItem value="both" className="sr-only" />
            <span className="text-sm font-medium">Comparatif</span>
            <span className="text-xs text-muted-foreground mt-1">IR vs IS</span>
          </label>
        </RadioGroup>
      </div>

      {/* Paramètres d'amortissement (IS) */}
      {(inputs.fiscalRegime === 'IS' || inputs.fiscalRegime === 'both') && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium flex items-center gap-2">
            Paramètres d'amortissement (IS)
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    En SCI à l'IS, vous pouvez amortir le bien immobilier, 
                    ce qui réduit la base imposable.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="landPercentage" className="text-xs">
                Part du terrain
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  id="landPercentage"
                  type="number"
                  value={inputs.landPercentage}
                  onChange={(e) => handleChange('landPercentage', Number(e.target.value))}
                  min={0}
                  max={50}
                  className="text-center"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Non amortissable</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buildingDepreciationYears" className="text-xs">
                Amort. construction
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  id="buildingDepreciationYears"
                  type="number"
                  value={inputs.buildingDepreciationYears}
                  onChange={(e) => handleChange('buildingDepreciationYears', Number(e.target.value))}
                  min={10}
                  max={50}
                  className="text-center"
                />
                <span className="text-sm text-muted-foreground">ans</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="renovationDepreciationYears" className="text-xs">
                Amort. travaux
              </Label>
              <div className="flex items-center gap-1">
                <Input
                  id="renovationDepreciationYears"
                  type="number"
                  value={inputs.renovationDepreciationYears}
                  onChange={(e) => handleChange('renovationDepreciationYears', Number(e.target.value))}
                  min={5}
                  max={30}
                  className="text-center"
                />
                <span className="text-sm text-muted-foreground">ans</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
