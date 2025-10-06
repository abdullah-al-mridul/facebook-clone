
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, Smile, User, Video, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

type PostDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function PostDialog({ isOpen, onOpenChange }: PostDialogProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        const newPreviews: string[] = [];
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === files.length) {
                    setImagePreviews(prev => [...prev, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews(previews => previews.filter((_, i) => i !== index));
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  }

  const handleClose = (open: boolean) => {
    if (!open) {
        setImagePreviews([]);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Create Post</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Current User</p>
            <p className="text-xs text-muted-foreground">Public</p>
          </div>
        </div>
        <Textarea
          placeholder="What's on your mind?"
          className="min-h-[120px] text-lg border-none focus-visible:ring-0"
        />
        {imagePreviews.length > 0 && (
          <div className="border rounded-lg p-2 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {imagePreviews.map((src, index) => (
                <div key={index} className="relative aspect-square">
                    <Image src={src} alt={`Image preview ${index + 1}`} fill className="object-cover rounded-md" />
                    <Button variant="secondary" size="icon" className="absolute top-1 right-1 rounded-full h-6 w-6" onClick={() => handleRemoveImage(index)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center p-2 border rounded-lg">
            <span>Add to your post</span>
            <div className="flex gap-1">
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" multiple/>
                <Button variant="ghost" size="icon" onClick={handleImageClick}><ImageIcon className="h-6 w-6 text-green-500" /></Button>
                <Button variant="ghost" size="icon"><User className="h-6 w-6 text-blue-500" /></Button>
                <Button variant="ghost" size="icon"><Smile className="h-6 w-6 text-yellow-500" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-6 w-6 text-red-500" /></Button>
            </div>
        </div>
        <Button className="w-full">Post</Button>
      </DialogContent>
    </Dialog>
  );
}
