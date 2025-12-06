
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { VerificationRequest } from './verification-request-table';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import Link from '../ui/link';

type ViewDocumentDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  request: VerificationRequest;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
};

export default function ViewDocumentDialog({ isOpen, onOpenChange, request, onApprove, onDeny }: ViewDocumentDialogProps) {

  const handleApprove = () => {
    onApprove(request.id);
    onOpenChange(false);
  }

  const handleDeny = () => {
    onDeny(request.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Verification Document</DialogTitle>
          <DialogDescription>
            Review the user's submitted document and approve or deny their verification request.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
                <Link href="/profile">
                    <Avatar>
                        <AvatarImage src={request.user.avatarUrl} alt={request.user.name} data-ai-hint="person portrait"/>
                        <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Link>
                <div>
                    <Link href="/profile">
                        <p className="font-semibold hover:underline">{request.user.name}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">{request.date}</p>
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Document: {request.documentType}</h3>
                {request.documentUrl ? (
                    <div className="relative aspect-video border rounded-lg overflow-hidden">
                        <Image src={request.documentUrl} alt="Verification Document" fill className="object-contain" data-ai-hint="document id"/>
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-lg p-12 text-center">
                        <p className="text-muted-foreground">No document was uploaded.</p>
                    </div>
                )}
            </div>
        </div>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
           <div className='flex gap-2'>
            <Button variant="destructive" onClick={handleDeny}>
              <X className="mr-2 h-4 w-4" /> Deny
            </Button>
            <Button className='bg-green-600 hover:bg-green-700' onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" /> Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
