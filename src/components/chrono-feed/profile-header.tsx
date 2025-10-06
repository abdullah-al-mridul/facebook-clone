
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Check, Pencil, X } from "lucide-react";
import Image from "next/image";
import ProfileTabs from "./profile-tabs";
import VerifiedBadge from "./verified-badge";
import { useRef, useState, useEffect } from "react";

type ProfileHeaderProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
};

export default function ProfileHeader({ activeTab, onTabChange }: ProfileHeaderProps) {
  const [coverImage, setCoverImage] = useState("https://placehold.co/1200x400.png");
  const [profileImage, setProfileImage] = useState("https://placehold.co/160x160.png");
  
  const [newCoverPreview, setNewCoverPreview] = useState<string | null>(null);
  const [newProfilePreview, setNewProfilePreview] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = {
    name: 'Current User',
    isVerified: true,
    friendCount: '1.2k'
  }

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePreview(reader.result as string);
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

  return (
    <div className="bg-card shadow-sm">
      <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
      <input type="file" ref={profileInputRef} onChange={handleProfileChange} accept="image/*" className="hidden" />

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
            <div className="mt-4 md:mt-0">
                <Button>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit profile
                </Button>
            </div>
        </div>
      </div>
      <ProfileTabs activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
