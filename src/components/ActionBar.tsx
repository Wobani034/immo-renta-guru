import { SimulationInputs, SimulationResults } from '@/lib/calculations';
import { inputsToQueryParams, saveSimulation } from '@/lib/storage';
import { exportToPdf } from '@/lib/pdf-export';
import { Button } from '@/components/ui/button';
import { Save, Share2, FileDown, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface ActionBarProps {
  inputs: SimulationInputs;
  results: SimulationResults;
  onSave: () => void;
}

export function ActionBar({ inputs, results, onSave }: ActionBarProps) {
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (!inputs.title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez donner un titre à votre simulation pour la sauvegarder.",
        variant: "destructive",
      });
      return;
    }
    
    saveSimulation(inputs);
    onSave();
    toast({
      title: "Simulation sauvegardée",
      description: `"${inputs.title}" a été enregistrée.`,
    });
  };

  const handleShare = async () => {
    const params = inputsToQueryParams(inputs);
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans le presse-papier.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    exportToPdf(inputs, results);
    toast({
      title: "Export PDF",
      description: "La fenêtre d'impression va s'ouvrir.",
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        onClick={handleSave}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        Sauvegarder
      </Button>

      <Button 
        variant="outline" 
        onClick={handleShare}
        className="flex items-center gap-2"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-success" />
            Copié !
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            Partager
          </>
        )}
      </Button>

      <Button 
        variant="outline" 
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Exporter PDF
      </Button>
    </div>
  );
}
