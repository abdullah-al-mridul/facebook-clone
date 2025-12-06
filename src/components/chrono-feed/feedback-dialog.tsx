
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { Loader2, Camera, X } from 'lucide-react';
import { Label } from '../ui/label';

type FeedbackDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function FeedbackDialog({ isOpen, onOpenChange }: FeedbackDialogProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showDialog, setShowDialog] = useState(isOpen);
  const { toast } = useToast();

  React.useEffect(() => {
    setShowDialog(isOpen);
  }, [isOpen]);

  const handleTakeScreenshot = async () => {
    setIsCapturing(true);
    setShowDialog(false);

    // A short delay to allow the DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(document.body, {
        logging: false,
        useCORS: true,
        backgroundColor: null,
      });
      setScreenshot(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Error taking screenshot:', error);
      toast({
        variant: 'destructive',
        title: 'Screenshot Failed',
        description: 'Could not capture the screen. Please try again.',
      });
    } finally {
        setShowDialog(true);
        setIsCapturing(false);
    }
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Feedback is empty',
        description: 'Please write your feedback before sending.',
      });
      return;
    }
    
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Feedback Submitted:', {
        feedback: feedbackText,
        screenshot: screenshot ? 'Screenshot included' : 'No screenshot',
      });
      setIsSending(false);
      onOpenChange(false);
      // Reset state after closing
      setTimeout(() => {
        setScreenshot(null);
        setFeedbackText('');
      }, 300);
      toast({
        title: 'Feedback Sent!',
        description: 'Thank you for helping us improve.',
      });
    }, 1500);
  };
  
  const handleClose = (open: boolean) => {
    if (!open) {
        setScreenshot(null);
        setFeedbackText('');
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={showDialog && isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-feedback-dialog>
        <DialogHeader>
          <DialogTitle>Give feedback</DialogTitle>
          <DialogDescription>
            Help us improve our product. What's working well, what's not?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
             <Label htmlFor="feedback-text">Your feedback</Label>
            <Textarea
              id="feedback-text"
              placeholder="Describe your issue or share your ideas..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label>Screenshot</Label>
             {isCapturing ? (
                 <div className="relative aspect-video w-full rounded-md border bg-accent flex items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Capturing screen...</span>
                </div>
              ) : screenshot ? (
                <div className="relative aspect-video w-full rounded-md border">
                    <Image src={screenshot} alt="Screenshot preview" fill className="object-contain rounded-md" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setScreenshot(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
              ) : (
                 <Button variant="outline" className="w-full" onClick={handleTakeScreenshot}>
                    <Camera className="mr-2 h-4 w-4" />
                    Include screenshot
                 </Button>
              )}
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>Cancel</Button>
            <Button onClick={handleSendFeedback} disabled={isSending || isCapturing}>
                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSending ? 'Sending...' : 'Send feedback'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
