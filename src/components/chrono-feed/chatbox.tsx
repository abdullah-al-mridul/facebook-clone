
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { Minus, Send, X, Image as ImageIcon, Mic, Square, Trash2, Play } from "lucide-react";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from 'next/image';
import VerifiedBadge from "./verified-badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ChatboxProps = {
  user: User;
  onClose: () => void;
  onMinimize: () => void;
};

type Message = {
    id: number;
    sender: 'me' | 'other';
    text?: string;
    images?: string[];
    audioUrl?: string;
    avatarUrl?: string;
}

const initialMessages: Message[] = [
    { id: 1, sender: 'other', text: "Hey, how's it going?", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 2, sender: 'me', text: "Pretty good! Just working on this project. You?" },
    { id: 3, sender: 'other', text: "Same here. It's coming along nicely!", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 4, sender: 'me', text: "Awesome! Let's catch up later." },
];

export default function Chatbox({ user, onClose, onMinimize }: ChatboxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages.map(m => m.sender === 'other' ? {...m, avatarUrl: user.avatarUrl} : m));
  const [inputValue, setInputValue] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);


  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (text === '' && imagePreviews.length === 0 && !audioPreview) return;

    const newMessage: Message = {
        id: Date.now(),
        sender: 'me',
    };

    if (text) newMessage.text = text;
    if (imagePreviews.length > 0) newMessage.images = imagePreviews;
    if (audioPreview) newMessage.audioUrl = audioPreview;
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setImagePreviews([]);
    setAudioPreview(null);
    if (imageInputRef.current) {
        imageInputRef.current.value = '';
    }
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const filePromises = Array.from(files).map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve(event.target?.result as string);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(urls => {
            setImagePreviews(prev => [...prev, ...urls]);
        })
    }
  }

  const removeImagePreview = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
  }

  const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioPreview(audioUrl);
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (error) {
        console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }
  };

  const discardRecording = () => {
    setAudioPreview(null);
  };

  const toggleRecording = () => {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
  };


  return (
    <Card className="w-full sm:w-80 h-[450px] flex flex-col shadow-2xl rounded-t-lg sm:rounded-lg">
      <CardHeader className="p-2 flex flex-row items-center justify-between border-b bg-card rounded-t-lg">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onMinimize}>
            <Link href="/profile">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/profile">
                <p className="font-semibold hover:underline">{user.name}</p>
              </Link>
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
                            <Link href="/profile">
                              <Avatar className="h-6 w-6">
                                  <AvatarImage src={message.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                            </Link>
                        )}
                        
                        <div className={cn(
                            "rounded-lg max-w-[80%]",
                            (message.images && message.images.length > 0) || message.audioUrl ? "min-w-[150px]" : "",
                            (message.text || message.audioUrl) ? 'p-2' : 'p-0 bg-transparent',
                            message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-accent'
                        )}>
                            {message.images && message.images.length > 0 && (
                                <div className={cn(
                                    "grid gap-1",
                                    message.images.length > 1 ? "grid-cols-2" : "grid-cols-1",
                                    message.text && 'mb-2'
                                )}>
                                    {message.images.map((img, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <Image src={img} alt="sent image" fill className="rounded-md object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {message.audioUrl && (
                                <audio controls src={message.audioUrl} className="w-full" />
                            )}
                            {message.text && <p className="text-sm break-words">{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-2 border-t bg-card rounded-b-lg flex flex-col items-start gap-2">
         {imagePreviews.length > 0 && (
            <div className="w-full grid grid-cols-4 gap-2">
                {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square">
                        <Image src={src} alt="Image preview" fill className="rounded-md object-cover"/>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                            onClick={() => removeImagePreview(index)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
            </div>
         )}
         {audioPreview && (
            <div className="w-full flex items-center gap-2 p-2 bg-accent rounded-lg">
                <audio ref={audioRef} src={audioPreview} className="flex-1 w-full" controls/>
                <Button variant="ghost" size="icon" onClick={discardRecording}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
            </div>
         )}
         <div className="flex items-center w-full gap-2">
            {!isRecording && !inputValue && (
              <>
                <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" multiple/>
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => imageInputRef.current?.click()}>
                    <ImageIcon className="h-5 w-5 text-primary"/>
                </Button>
              </>
            )}
            <div className="relative w-full">
                <Input 
                    placeholder={isRecording ? "Recording..." : "Type a message..."} 
                    className="pr-10 bg-accent rounded-full"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isRecording}
                />
                 {!inputValue && (
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={toggleRecording}>
                        {isRecording ? <Square className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5 text-primary"/>}
                    </Button>
                 )}
            </div>
            { (inputValue || imagePreviews.length > 0 || audioPreview) &&
                <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSendMessage}>
                    <Send className="h-5 w-5 text-primary"/>
                </Button>
            }
        </div>
      </CardFooter>
    </Card>
  );
}
