
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { Minus, Send, X } from "lucide-react";

type ChatboxProps = {
  user: User;
  onClose: () => void;
  onMinimize: () => void;
};

export default function Chatbox({ user, onClose, onMinimize }: ChatboxProps) {
  return (
    <Card className="w-full sm:w-80 h-[450px] flex flex-col shadow-2xl rounded-t-lg sm:rounded-lg">
      <CardHeader className="p-2 flex flex-row items-center justify-between border-b bg-card rounded-t-lg">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onMinimize}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-semibold">{user.name}</p>
        </div>
        <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMinimize}><Minus/></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}><X/></Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-2 overflow-y-auto bg-background">
        <ScrollArea className="h-full pr-2">
            <div className="space-y-4">
                <div className="flex items-end gap-2">
                    <Avatar className="h-6 w-6">
                         <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                         <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-accent rounded-lg p-2 max-w-[80%]">
                        <p className="text-sm">Hey, how's it going?</p>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2 max-w-[80%]">
                        <p className="text-sm">Pretty good! Just working on this project. You?</p>
                    </div>
                </div>
                 <div className="flex items-end gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-accent rounded-lg p-2 max-w-[80%]">
                        <p className="text-sm">Same here. It's coming along nicely! </p>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2 max-w-[80%]">
                        <p className="text-sm">Awesome! Let's catch up later.</p>
                    </div>
                </div>
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t bg-card rounded-b-lg">
        <div className="relative w-full">
            <Input placeholder="Type a message..." className="pr-10 bg-accent rounded-full"/>
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <Send className="h-5 w-5 text-primary"/>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
