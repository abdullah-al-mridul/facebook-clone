
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Check, Pencil, ShieldCheck, X } from "lucide-react";
import Image from "next/image";
import ProfileTabs from "./profile-tabs";
import VerifiedBadge from "./verified-badge";
import { useRef, useState } from "react";
import ImageCropDialog from "./image-crop-dialog";
import EditProfileDialog from "./edit-profile-dialog";
import { useToast } from "@/hooks/use-toast";

type ProfileHeaderProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
};

type CropState = {
    isOpen: boolean;
    imageSrc: string | null;
    aspect: number;
    onSave: (croppedImage: string) => void;
};

export default function ProfileHeader({ activeTab, onTabChange }: ProfileHeaderProps) {
  const [coverImage, setCoverImage] = useState("https://placehold.co/1200x400.png");
  const [profileImage, setProfileImage] = useState("https://placehold.co/160x160.png");
  
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);
  const [newProfilePreview, setNewProfilePreview] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();

  const [cropState, setCropState] = useState<CropState>({
      isOpen: false,
      imageSrc: null,
      aspect: 16/9,
      onSave: () => {}
  });

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = {
    name: 'Current User',
    isVerified: true,
    friendCount: '1.2k',
    work: 'Works at ChronoFeed',
    education: 'Studied at University of Design',
    location: 'Lives in Techville, CA',
    relationship: 'Single'
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, aspect: number, onSave: (croppedImage: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropState({
            isOpen: true,
            imageSrc: reader.result as string,
            aspect,
            onSave,
        })
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSaveCover = () => {
    if (newCoverPreview) {
        setCoverImage(newCoverPreview);
    }
    setNewCoverPreview(null);
  }

  const handleDiscardCover = () => {
    setNewCoverPreview(null);
    if (coverInputRef.current) {
        coverInputRef.current.value = '';
    }
  }

  const handleSaveProfile = () => {
    if (newProfilePreview) {
        setProfileImage(newProfilePreview);
    }
    setNewProfilePreview(null);
  }

  const handleDiscardProfile = () => {
    setNewProfilePreview(null);
    if (profileInputRef.current) {
        profileInputRef.current.value = '';
    }
  }

  const onCoverSave = (croppedImage: string) => {
    setNewCoverPreview(croppedImage);
    setCropState(prev => ({ ...prev, isOpen: false }));
  }

  const onProfileSave = (croppedImage: string) => {
    setNewProfilePreview(croppedImage);
    setCropState(prev => ({ ...prev, isOpen: false }));
  }

  const handleGetVerified = () => {
    toast({
        title: "Verification Request",
        description: "This feature is coming soon! You'll be able to apply for a verification badge from here.",
    });
  }

  return (
    <>
    <ImageCropDialog 
        isOpen={cropState.isOpen}
        onOpenChange={(isOpen) => setCropState(prev => ({ ...prev, isOpen }))}
        imageSrc={cropState.imageSrc}
        aspect={cropState.aspect}
        onSave={cropState.onSave}
    />
     <EditProfileDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={currentUser}
    />
    <div className="bg-card shadow-sm">
      <input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, 16/9, onCoverSave)} accept="image/*" className="hidden" />
      <input type="file" ref={profileInputRef} onChange={(e) => handleFileChange(e, 1, onProfileSave)} accept="image/*" className="hidden" />

      <div className="relative h-64 md:h-96 w-full">
        <Image 
            src={newCoverPreview || coverImage}
            alt="Cover photo"
            fill
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="landscape abstract"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
           {newCoverPreview ? (
                <>
                    <Button variant="secondary" onClick={handleDiscardCover}>
                        <X className="mr-2 h-4 w-4" />
                        Discard
                    </Button>
                    <Button onClick={handleSaveCover}>
                        <Check className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                </>
            ) : (
                <Button onClick={() => coverInputRef.current?.click()}>
                    <Camera className="mr-2 h-4 w-4" />
                    Edit cover photo
                </Button>
            )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-24 ml-0 md:ml-8">
            <div className="relative group">
                 <Avatar className="h-40 w-40 border-4 border-card">
                    <AvatarImage src={newProfilePreview || profileImage} alt="User" data-ai-hint="profile person"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-2 right-2 rounded-full" onClick={() => profileInputRef.current?.click()}>
                    <Camera className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                {newProfilePreview ? (
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <Button size="sm" variant="secondary" onClick={handleDiscardProfile}>
                            <X className="mr-2 h-4 w-4" />
                            Discard
                        </Button>
                        <Button size="sm" onClick={handleSaveProfile}>
                            <Check className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </div>
                ) : (
                    <>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <h1 className="text-3xl font-bold">{currentUser.name}</h1>
                        {currentUser.isVerified && <VerifiedBadge size="lg" />}
                    </div>
                    <p className="text-muted-foreground">{currentUser.friendCount} Friends</p>
                    </>
                )}
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
                <Button variant="secondary" onClick={handleGetVerified}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Get Verified
                </Button>
                <Button onClick={() => setIsEditDialogOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit profile
                </Button>
            </div>
        </div>
      </div>
      <ProfileTabs activeTab={activeTab} onTabChange={onTabChange} />
    </div>
    </>
  );
}
