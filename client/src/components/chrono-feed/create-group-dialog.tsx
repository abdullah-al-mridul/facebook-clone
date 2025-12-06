
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

type CreateGroupDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function CreateGroupDialog({ isOpen, onOpenChange }: CreateGroupDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  }

  const handleClose = (open: boolean) => {
    if (!open) {
        handleRemoveImage();
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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

            <div className="space-y-2">
                <Label>Cover Photo</Label>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                {imagePreview ? (
                     <div className="relative border rounded-lg overflow-hidden aspect-video">
                        <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                        <Button variant="secondary" size="icon" className="absolute top-2 right-2 rounded-full h-8 w-8" onClick={handleRemoveImage}>
                        <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div 
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
                        onClick={handleImageClick}
                    >
                        <Camera className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">Upload a cover photo</p>
                    </div>
                )}
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
