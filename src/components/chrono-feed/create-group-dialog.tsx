
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

type CreateGroupDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function CreateGroupDialog({ isOpen, onOpenChange }: CreateGroupDialogProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Create Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className='space-y-2'>
                <Label htmlFor='group-name'>Group Name</Label>
                <Input id="group-name" placeholder="Enter group name..." />
            </div>
             <div className='space-y-2'>
                <Label htmlFor='group-description'>Description</Label>
                <Textarea id="group-description" placeholder="Describe your group..." />
            </div>
            <div className='space-y-2'>
                 <Label>Privacy</Label>
                 <RadioGroup defaultValue="public" className="flex gap-4">
                    <div>
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="ml-2">Public</Label>
                    </div>
                    <div>
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="ml-2">Private</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
        <DialogFooter>
            <Button className="w-full">Create Group</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
