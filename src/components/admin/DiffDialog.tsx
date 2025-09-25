/* eslint-disable react/no-unescaped-entities */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Button } from '../ui/button';

interface DiffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  diff: { added: Record<string, any>; removed: Record<string, any>; changed: Record<string, any> };
  onConfirm: () => void;
}

export function DiffDialog({ isOpen, onOpenChange, diff, onConfirm }: DiffDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText.toLowerCase() === 'confirm';

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to make a change that removes or resets data. This might be unintentional.
            The following top-level fields will be removed:
          </AlertDialogDescription>
            <pre className="mt-2 text-xs bg-muted p-2 rounded-md font-mono overflow-x-auto">
                {JSON.stringify(Object.keys(diff.removed), null, 2)}
            </pre>
          <AlertDialogDescription>
            To proceed, type <strong className='text-foreground'>"CONFIRM"</strong> below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input 
            value={confirmText} 
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder='CONFIRM'
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onConfirm} disabled={!isConfirmed} variant="destructive">
            Proceed with destructive save
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
