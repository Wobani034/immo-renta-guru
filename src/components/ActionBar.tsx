import { useState } from 'react';
import { SimulationInputs, SimulationResults } from '@/lib/calculations';
import { inputsToQueryParams } from '@/lib/storage';
import { saveSimulationToSupabase } from '@/lib/supabase-storage';
import { exportToPdf } from '@/lib/pdf-export';
import { Button } from '@/components/ui/button';
import { Save, Share2, FileDown, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';

interface ActionBarProps {
  inputs: SimulationInputs;
  results: SimulationResults;
  onSave: () => void;
}

export function ActionBar({ inputs, results, onSave }: ActionBarProps) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | 'export' | null>(null);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!inputs.title.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez donner un titre à votre simulation pour la sauvegarder.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      setPendingAction('save');
      setShowAuthModal(true);
      return;
    }

    setSaving(true);
    try {
      const { error } = await saveSimulationToSupabase(user.id, inputs);
      
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder la simulation.",
          variant: "destructive",
        });
      } else {
        onSave();
        toast({
          title: "Simulation sauvegardée",
          description: `"${inputs.title}" a été enregistrée dans votre espace.`,
        });
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
    if (!user) {
      setPendingAction('export');
      setShowAuthModal(true);
      return;
    }

    exportToPdf(inputs, results);
    toast({
      title: "Export PDF",
      description: "La fenêtre d'impression va s'ouvrir.",
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={handleSave}
          className="flex items-center gap-2"
          disabled={saving}
        >
          <Save className="h-4 w-4" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
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

      <AuthRequiredModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        actionType={pendingAction || 'save'}
      />
    </>
  );
}
