
import { Button } from "@/components/ui/button";
import { Check, UserPlus } from "lucide-react";
import Image from "next/image";

type GroupHeaderProps = {
    group: {
        name: string;
        members: string;
        coverUrl: string;
        coverHint: string;
    }
};

export default function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <div className="bg-card shadow-sm">
      <div className="relative h-64 md:h-80 w-full">
        <Image 
            src={group.coverUrl}
            alt="Cover photo"
            fill
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint={group.coverHint}
        />
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
                 <Button variant="secondary" className="ml-2">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
