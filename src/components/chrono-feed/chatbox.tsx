
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { Minus, Send, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";
import Image from 'next/image';
import VerifiedBadge from "./verified-badge";

type ChatboxProps = {
  user: User;
  onClose: () => void;
  onMinimize: () => void;
};

type Message = {
    id: number;
    sender: 'me' | 'other';
    type: 'text' | 'image';
    content: string;
    avatarUrl?: string;
}

const initialMessages: Message[] = [
    { id: 1, sender: 'other', type: 'text', content: "Hey, how's it going?", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 2, sender: 'me', type: 'text', content: "Pretty good! Just working on this project. You?" },
    { id: 3, sender: 'other', type: 'text', content: "Same here. It's coming along nicely!", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 4, sender: 'me', type: 'text', content: "Awesome! Let's catch up later." },
];

export default function Chatbox({ user, onClose, onMinimize }: ChatboxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages.map(m => m.sender === 'other' ? {...m, avatarUrl: user.avatarUrl} : m));
  const [inputValue, setInputValue] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
        id: messages.length + 1,
        sender: 'me',
        type: 'text',
        content: inputValue.trim(),
    };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: 'me',
                type: 'image',
                content: event.target?.result as string,
            };
            setMessages(prev => [...prev, newMessage]);
        };
        reader.readAsDataURL(file);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
  }


  return (
    <Card className="w-full sm:w-80 h-[450px] flex flex-col shadow-2xl rounded-t-lg sm:rounded-lg">
      <CardHeader className="p-2 flex flex-row items-center justify-between border-b bg-card rounded-t-lg">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onMinimize}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <p className="font-semibold">{user.name}</p>
              {user.isVerified && <VerifiedBadge />}
            </div>
        </div>
        <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMinimize}><Minus/></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}><X/></Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-2 overflow-y-auto bg-background">
        <ScrollArea className="h-full pr-2">
            <div className="space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'me' ? 'justify-end' : ''}`}>
                         {message.sender === 'other' && (
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={message.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`${message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-accent'} rounded-lg p-2 max-w-[80%]`}>
                            {message.type === 'text' ? (
                                <p className="text-sm">{message.content}</p>
                            ) : (
                                <Image src={message.content} alt="sent image" width={200} height={150} className="rounded-md object-cover" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t bg-card rounded-b-lg">
         <div className="flex items-center w-full gap-2">
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => imageInputRef.current?.click()}>
                <ImageIcon className="h-5 w-5 text-primary"/>
            </Button>
            <div className="relative w-full">
                <Input 
                    placeholder="Type a message..." 
                    className="pr-10 bg-accent rounded-full"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleSendMessage}>
                    <Send className="h-5 w-5 text-primary"/>
                </Button>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
