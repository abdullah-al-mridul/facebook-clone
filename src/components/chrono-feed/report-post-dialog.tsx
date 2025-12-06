
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PostType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Link from '../ui/link';

type ReportPostDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: PostType;
};

const reportReasons = [
  'Spam',
  'Nudity or sexual activity',
  'Hate speech or symbols',
  'False information',
  'Bullying or harassment',
  'Scam or fraud',
  'Violence or dangerous organizations',
  'Intellectual property infringement',
  'Something else',
];

export default function ReportPostDialog({ isOpen, onOpenChange, post }: ReportPostDialogProps) {
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [details, setDetails] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!reason) {
      toast({
        variant: 'destructive',
        title: 'Please select a reason',
        description: 'You must select a reason for reporting this post.',
      });
      return;
    }
    console.log('Report submitted:', { postId: post.id, reason, details });
    toast({
      title: 'Report submitted',
      description: "Thanks for helping keep our community safe. We'll review your report.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
          <DialogDescription>
            Why are you reporting this post? Your report is anonymous.
          </DialogDescription>
        </DialogHeader>
        
        {/* Post Preview */}
        <div className="p-2 border rounded-md">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.user.avatarUrl} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
                <Link href="/profile"><p className="font-semibold">{post.user.name}</p></Link>
                <p className="text-xs text-muted-foreground truncate">{post.content.substring(0, 50)}...</p>
            </div>
            {post.imageUrl && (
              <Image src={post.imageUrl} alt="Post preview" width={40} height={40} className="rounded-md object-cover ml-auto" />
            )}
          </div>
        </div>

        <div className="space-y-4 py-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            {reportReasons.map((r) => (
              <div key={r} className="flex items-center space-x-2">
                <RadioGroupItem value={r} id={r} />
                <Label htmlFor={r} className="font-normal">{r}</Label>
              </div>
            ))}
          </RadioGroup>

          {reason && (
            <div className="space-y-2">
              <Label htmlFor="details">Details (optional)</Label>
              <Textarea
                id="details"
                placeholder="Provide additional details..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
