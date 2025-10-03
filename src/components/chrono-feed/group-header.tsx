
'use client';

import { Button } from "@/components/ui/button";
import { Check, UserPlus, Camera, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

type GroupHeaderProps = {
    group: {
        name: string;
        members: string;
        coverUrl: string;
        coverHint: string;
    },
    onInviteClick: () => void;
};

export default function GroupHeader({ group, onInviteClick }: GroupHeaderProps) {
  const [coverImage, setCoverImage] = useState(group.coverUrl);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCoverImage(group.coverUrl);
    setNewImagePreview(null);
  }, [group.coverUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  }

  const handleSave = () => {
    if (newImagePreview) {
        setCoverImage(newImagePreview);
    }
    setNewImagePreview(null);
  }

  const handleDiscard = () => {
    setNewImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="bg-card shadow-sm">
      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
      <div className="relative h-64 md:h-80 w-full group">
        <Image 
            src={newImagePreview || coverImage}
            alt="Cover photo"
            fill
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint={group.coverHint}
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
            {newImagePreview ? (
                <>
                    <Button variant="secondary" onClick={handleDiscard}>
                        <X className="mr-2 h-4 w-4" />
                        Discard
                    </Button>
                    <Button onClick={handleSave}>
                        <Check className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                </>
            ) : (
                <Button onClick={handleEditClick}>
                    <Camera className="mr-2 h-4 w-4" />
                    Edit cover photo
                </Button>
            )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{group.name}</h1>
                <p className="text-muted-foreground">{group.members} • Public Group</p>
            </div>
            <div className="mt-4 md:mt-0">
                <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Joined
                </Button>
                 <Button variant="secondary" className="ml-2" onClick={onInviteClick}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
