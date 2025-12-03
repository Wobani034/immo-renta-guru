import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface LeadData {
  firstName: string;
  email: string;
  acceptsMarketing: boolean;
}

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeadData) => void;
  onSkip: () => void;
  actionType: 'save' | 'export';
}

export function LeadCaptureModal({
  open,
  onOpenChange,
  onSubmit,
  onSkip,
  actionType,
}: LeadCaptureModalProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setEmailError('L\'email est obligatoire');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Veuillez entrer un email valide');
      return;
    }
    
    setEmailError('');
    onSubmit({ firstName, email, acceptsMarketing });
    
    // Reset form
    setFirstName('');
    setEmail('');
    setAcceptsMarketing(false);
  };

  const handleSkip = () => {
    setEmailError('');
    setFirstName('');
    setEmail('');
    setAcceptsMarketing(false);
    onSkip();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">
            {actionType === 'save' ? 'Sauvegarder votre simulation' : 'Exporter votre simulation'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Créez un accès pour retrouver vos simulations, les modifier plus tard et recevoir votre rapport par email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className={emailError ? 'border-destructive' : ''}
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="marketing"
              checked={acceptsMarketing}
              onCheckedChange={(checked) => setAcceptsMarketing(checked as boolean)}
            />
            <Label htmlFor="marketing" className="text-sm leading-relaxed cursor-pointer">
              Je souhaite recevoir ce rapport et d'autres conseils sur l'investissement immobilier par email.
            </Label>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full sm:w-auto"
          >
            Continuer sans inscription
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            Valider et continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to save lead data to localStorage
export function saveLeadData(data: LeadData): void {
  try {
    const existingData = localStorage.getItem('alpaca-leads');
    const leads: LeadData[] = existingData ? JSON.parse(existingData) : [];
    leads.push({ ...data, timestamp: new Date().toISOString() } as LeadData & { timestamp: string });
    localStorage.setItem('alpaca-leads', JSON.stringify(leads));
  } catch (error) {
    console.error('Error saving lead data:', error);
  }
}

// Hook to be implemented later for backend integration
export function onRegisterLead(data: LeadData): Promise<void> {
  // Placeholder for future backend integration
  saveLeadData(data);
  return Promise.resolve();
}
