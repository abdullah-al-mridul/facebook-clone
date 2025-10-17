
'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, Camera } from 'lucide-react';

type FeedbackDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function FeedbackDialog({ isOpen, onOpenChange }: FeedbackDialogProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      handleTakeScreenshot();
    } else {
      // Reset state when closing
      setScreenshot(null);
      setFeedbackText('');
    }
  }, [isOpen]);

  const handleTakeScreenshot = async () => {
    setIsCapturing(true);
    // Timeout to allow dialog to open and render before screenshot
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(document.body, {
          logging: false,
          useCORS: true,
          // Exclude the dialog itself from the screenshot
          ignoreElements: (element) => element.hasAttribute('data-feedback-dialog'),
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
        setIsCapturing(false);
      }
    }, 500);
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
      toast({
        title: 'Feedback Sent!',
        description: 'Thank you for helping us improve.',
      });
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-feedback-dialog>
        <DialogHeader>
          <DialogTitle>Give feedback</DialogTitle>
          <DialogDescription>
            Help us improve our product. What's working well, what's not?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Screenshot</label>
            <div className="relative aspect-video w-full rounded-md border bg-accent flex items-center justify-center">
              {isCapturing ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span>Capturing screen...</span>
                </div>
              ) : screenshot ? (
                <Image src={screenshot} alt="Screenshot preview" fill className="object-contain rounded-md" />
              ) : (
                 <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Camera className="h-8 w-8" />
                    <span>No screenshot</span>
                 </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
             <label htmlFor="feedback-text" className="text-sm font-medium">Your feedback</label>
            <Textarea
              id="feedback-text"
              placeholder="Describe your issue or share your ideas..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>Cancel</Button>
            <Button onClick={handleSendFeedback} disabled={isSending}>
                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSending ? 'Sending...' : 'Send feedback'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
