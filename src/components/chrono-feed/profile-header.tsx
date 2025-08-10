
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Pencil } from "lucide-react";
import Image from "next/image";
import ProfileTabs from "./profile-tabs";

type ProfileHeaderProps = {
    activeTab: string;
    onTabChange: (tab: string) => void;
};

export default function ProfileHeader({ activeTab, onTabChange }: ProfileHeaderProps) {
  return (
    <div className="bg-card shadow-sm">
      <div className="relative h-64 md:h-96 w-full">
        <Image 
            src="https://placehold.co/1200x400.png"
            alt="Cover photo"
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="landscape abstract"
        />
        <div className="absolute bottom-4 right-4">
            <Button>
                <Camera className="mr-2 h-4 w-4" />
                Edit cover photo
            </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-24 ml-0 md:ml-8">
            <div className="relative">
                 <Avatar className="h-40 w-40 border-4 border-card">
                    <AvatarImage src="https://placehold.co/160x160.png" alt="User" data-ai-hint="profile person"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-2 right-2 rounded-full">
                    <Camera className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex-1 mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <h1 className="text-3xl font-bold">Current User</h1>
                <p className="text-muted-foreground">1.2k Friends</p>
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
