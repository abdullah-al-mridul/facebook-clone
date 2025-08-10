
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { UserPlus, MessageCircle } from "lucide-react";

type FriendCardProps = {
    user: User;
}

export default function FriendCard({ user }: FriendCardProps) {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">15 mutual friends</p>
                <div className="w-full flex flex-col gap-2">
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4"/> Add Friend
                    </Button>
                    <Button variant="secondary">
                         <MessageCircle className="mr-2 h-4 w-4"/> Message
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
