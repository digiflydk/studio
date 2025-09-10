
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';

interface ConflictDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  serverData: any;
  serverVersion: number;
  onReload: (serverData: any, serverVersion: number) => void;
  onOverwrite: (serverVersion: number) => void;
}

export function ConflictDialog({ 
    isOpen, 
    onOpenChange, 
    onReload, 
    onOverwrite,
    serverData,
    serverVersion,
}: ConflictDialogProps) {

  const handleReload = () => {
    onReload(serverData, serverVersion);
    onOpenChange(false);
  }

  const handleOverwrite = () => {
    onOverwrite(serverVersion);
    onOpenChange(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Version Conflict</AlertDialogTitle>
          <AlertDialogDescription>
            Someone else has saved changes to these settings since you loaded the page.
            You can either reload to get the latest settings (your current changes will be lost) 
            or overwrite their changes with yours.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="secondary" onClick={handleReload}>
            Reload and discard my changes
          </Button>
          <Button variant="destructive" onClick={handleOverwrite}>
            Overwrite with my changes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
