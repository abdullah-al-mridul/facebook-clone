
'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type ImageCropDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  imageSrc: string | null;
  aspect: number;
  onSave: (croppedImage: string) => void;
};

function getCroppedImg(
    image: HTMLImageElement,
    crop: Crop,
    fileName: string
  ): Promise<string> {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
  
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
            return;
        }
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
}

export default function ImageCropDialog({ isOpen, onOpenChange, imageSrc, aspect, onSave }: ImageCropDialogProps) {
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  const handleSave = async () => {
    if (imgRef.current && crop?.width && crop?.height) {
      const croppedImageUrl = await getCroppedImg(
        imgRef.current,
        crop,
        "newFile.jpeg"
      );
      onSave(croppedImageUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Crop your image</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center p-4 bg-accent/50 rounded-md max-h-[60vh] overflow-hidden">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              aspect={aspect}
            >
              <img ref={imgRef} alt="Crop me" src={imageSrc} onLoad={onImageLoad} style={{ maxHeight: '60vh'}}/>
            </ReactCrop>
          )}
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
