import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, FileDown, Save } from 'lucide-react';

interface AuthRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: 'save' | 'export';
}

export function AuthRequiredModal({
  open,
  onOpenChange,
  actionType,
}: AuthRequiredModalProps) {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
            {actionType === 'export' ? (
              <FileDown className="h-8 w-8 text-primary" />
            ) : (
              <Save className="h-8 w-8 text-primary" />
            )}
          </div>
          <DialogTitle className="text-xl font-display text-center">
            {actionType === 'export' 
              ? 'Créez un compte pour exporter' 
              : 'Créez un compte pour sauvegarder'}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {actionType === 'export' 
              ? 'Pour télécharger votre rapport PDF, inscrivez-vous gratuitement. Vous pourrez ensuite retrouver toutes vos simulations dans votre espace personnel.'
              : 'Pour sauvegarder vos simulations et les retrouver plus tard, créez un compte gratuit.'}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 my-4">
          <p className="text-sm font-medium text-foreground mb-2">
            Avantages de votre compte gratuit :
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Sauvegardez vos simulations
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Exportez des rapports PDF illimités
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Accédez à votre historique
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              Recevez des conseils personnalisés
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Plus tard
          </Button>
          <Button
            onClick={handleCreateAccount}
            className="w-full sm:w-auto"
          >
            <Lock className="h-4 w-4 mr-2" />
            Créer un compte gratuit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
