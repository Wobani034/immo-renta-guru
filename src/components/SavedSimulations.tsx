import { SavedSimulation, deleteSimulation } from '@/lib/storage';
import { SimulationInputs, formatCurrency } from '@/lib/calculations';
import { Trash2, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavedSimulationsProps {
  simulations: SavedSimulation[];
  onLoad: (inputs: SimulationInputs) => void;
  onRefresh: () => void;
}

export function SavedSimulations({ simulations, onLoad, onRefresh }: SavedSimulationsProps) {
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSimulation(id);
    onRefresh();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (simulations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">Aucune simulation sauvegardée</p>
        <p className="text-xs mt-1">Vos simulations apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {simulations.map((sim) => (
        <div
          key={sim.id}
          onClick={() => onLoad(sim.inputs)}
          className="group p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate text-foreground group-hover:text-primary transition-colors">
                {sim.inputs.title || 'Sans titre'}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{formatCurrency(sim.inputs.netSellerPrice)}</span>
                <span>•</span>
                <span>{formatCurrency(sim.inputs.monthlyRent)}/mois</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDate(sim.updatedAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(sim.id, e)}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
