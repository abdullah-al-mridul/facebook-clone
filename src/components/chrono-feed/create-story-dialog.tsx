
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Type } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

type CreateStoryDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function CreateStoryDialog({ isOpen, onOpenChange }: CreateStoryDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [storyType, setStoryType] = useState<'photo' | 'text'>('photo');
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  }

  const handleClose = (open: boolean) => {
    if (!open) {
        setImagePreview(null);
        setStoryType('photo');
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl p-0">
        <DialogHeader className="p-4">
          <DialogTitle className="text-center text-xl font-bold">Create Story</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-4 bg-card p-4 space-y-2">
             <Button variant={storyType === 'photo' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setStoryType('photo')}>
                <Camera className="mr-2 h-5 w-5"/> Photo Story
             </Button>
             <Button variant={storyType === 'text' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setStoryType('text')}>
                <Type className="mr-2 h-5 w-5"/> Text Story
             </Button>
          </div>
          <div className="col-span-8 p-4">
            <h3 className="font-semibold mb-2">Preview</h3>
            <div className="bg-accent rounded-lg aspect-[9/16] flex items-center justify-center relative overflow-hidden">
                {storyType === 'photo' && (
                    <>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Story preview" fill className="object-cover" />
                        ) : (
                             <div 
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/80 w-full h-full"
                                onClick={handleImageClick}
                            >
                                <Camera className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mt-2">Add Photo</p>
                            </div>
                        )}
                    </>
                )}
                {storyType === 'text' && (
                     <Textarea 
                        placeholder="Start typing" 
                        className="bg-gradient-to-br from-purple-400 to-indigo-600 text-white text-2xl font-bold text-center border-none resize-none h-full p-4 placeholder:text-gray-200 focus-visible:ring-0" 
                    />
                )}
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => handleClose(false)}>Discard</Button>
          <Button>Share to Story</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
