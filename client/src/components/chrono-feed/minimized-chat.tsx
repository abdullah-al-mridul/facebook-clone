
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { X } from "lucide-react";

type MinimizedChatProps = {
    user: User;
    onClose: () => void;
    onExpand: () => void;
};

export default function MinimizedChat({ user, onClose, onExpand }: MinimizedChatProps) {
    return (
        <div className="relative">
             <Avatar className="h-14 w-14 cursor-pointer" onClick={onExpand}>
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-card text-muted-foreground hover:bg-accent"
                onClick={onClose}
            >
                <X className="h-4 w-4"/>
            </Button>
        </div>
    )
}
