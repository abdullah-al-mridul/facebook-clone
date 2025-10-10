
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { Minus, Send, Image as ImageIcon, Mic, Square, Trash2, Smile, Phone, Video, Loader2 } from "lucide-react";
import { useState, useRef, ChangeEvent, useEffect, useCallback } from "react";
import Image from 'next/image';
import VerifiedBadge from "./verified-badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AudioPlayer from "./audio-player";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToast } from "@/hooks/use-toast";

type FullPageChatProps = {
  user: User;
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
    { id: 5, sender: 'other', text: "Definitely. I have a few ideas to share.", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 6, sender: 'me', text: "Great! I'm free after 5 PM today." },
    { id: 7, sender: 'other', text: "Perfect, talk to you then!", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 8, sender: 'me', text: "Looking forward to it!" },
    { id: 9, sender: 'other', text: "By the way, did you see the latest design mockups?", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 10, sender: 'me', text: "Not yet, I'll check them out now. Thanks for the heads up!" },
    { id: 11, sender: 'other', text: "No problem. They are in the shared folder.", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 12, sender: 'me', text: "Got it. I'll take a look and give you some feedback soon." },
    { id: 13, sender: 'other', text: "Great, thanks!", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
    { id: 14, sender: 'me', text: "Talk to you later!" },
    { id: 15, sender: 'other', text: "Bye!", avatarUrl: 'https://placehold.co/40x40/E5E7EB/4B5563.png' },
];

const olderMessages: Message[] = Array.from({ length: 15 }).map((_, i) => ({
    id: -(i + 1),
    sender: i % 2 === 0 ? 'other' : 'me',
    text: `This is an older message ${i + 1}`,
}));

export default function FullPageChat({ user, onMinimize }: FullPageChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages.map(m => m.sender === 'other' ? {...m, avatarUrl: user.avatarUrl} : m));
  const [inputValue, setInputValue] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const loadMoreMessages = useCallback(() => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      const currentOldestMessageId = Math.min(...messages.filter(m => m.id < 0).map(m => m.id), 0);
      
      const newMessages = olderMessages
        .filter(m => !messages.find(existing => existing.id === m.id))
        .slice(0, 5)
        .map((m, i) => ({
            ...m,
            id: currentOldestMessageId - i -1,
            avatarUrl: m.sender === 'other' ? user.avatarUrl : undefined,
        }));

      if (newMessages.length > 0) {
        setMessages(prev => [...newMessages, ...prev]);
      } else {
        setHasMore(false);
      }
      setIsLoadingMore(false);
    }, 1500);
  }, [isLoadingMore, messages, user.avatarUrl]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const handleScroll = () => {
        if (viewport && viewport.scrollTop === 0 && hasMore && !isLoadingMore) {
            loadMoreMessages();
        }
    }
    if (viewport) {
        viewport.addEventListener('scroll', handleScroll);
    }
    return () => {
        if (viewport) {
            viewport.removeEventListener('scroll', handleScroll);
        }
    }
  }, [hasMore, isLoadingMore, loadMoreMessages]);


  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
        // Scroll to bottom on initial load
        viewport.scrollTop = viewport.scrollHeight;
    }
  }, [user]); // Rerun when user changes

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

    setTimeout(() => {
        const viewport = viewportRef.current;
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }, 100);
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
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
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

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue(prev => prev + emojiData.emoji);
  }

  const handleCallClick = (type: 'audio' | 'video') => {
    toast({
        title: `Start ${type} call?`,
        description: "This feature is coming soon!",
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-background">
      <header className="p-2 flex flex-row items-center justify-between border-b">
        <div className="flex items-center gap-2">
            <Link href="/profile">
              <Avatar className="h-10 w-10">
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
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleCallClick('audio')}><Phone /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleCallClick('video')}><Video /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onMinimize}><Minus/></Button>
        </div>
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef} viewportRef={viewportRef}>
            <div className="space-y-4">
                {isLoadingMore && (
                    <div className="flex justify-center items-center py-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                )}
                {!hasMore && (
                     <div className="text-center text-xs text-muted-foreground py-2">
                        No more messages
                    </div>
                )}
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
                            "rounded-lg max-w-[70%]",
                            (message.images && message.images.length > 0) ? 'min-w-[150px]' : '',
                            (message.audioUrl && !message.text && !message.images) ? 'w-[60%]' : '',
                            (message.images && message.images.length > 0) || message.audioUrl ? "p-1" : "p-2",
                            message.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-accent'
                        )}>
                            {message.images && message.images.length > 0 && (
                                <div className={cn(
                                    "grid gap-1",
                                    message.images.length > 1 ? "grid-cols-2" : "grid-cols-1",
                                    message.text && 'mb-1'
                                )}>
                                    {message.images.map((img, index) => (
                                        <div key={index} className="relative aspect-square">
                                            <Image src={img} alt="sent image" fill className="rounded-md object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                             {message.audioUrl && (
                                <AudioPlayer 
                                    audioUrl={message.audioUrl} 
                                    isSender={message.sender === 'me'}
                                />
                            )}
                            {message.text && 
                                <p className={cn("text-sm break-words", (message.images || message.audioUrl) && "p-2")}>
                                    {message.text}
                                </p>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </div>
      <footer className="p-4 border-t flex flex-col items-start gap-2">
         {imagePreviews.length > 0 && (
            <div className="w-full p-2 bg-accent rounded-lg">
              <div className="grid grid-cols-5 gap-2">
                  {imagePreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                          <Image src={src} alt="Image preview" fill className="rounded-md object-cover"/>
                          <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                              onClick={() => removeImagePreview(index)}
                          >
                              <Minus className="h-3 w-3" />
                          </Button>
                      </div>
                  ))}
              </div>
            </div>
         )}
         {audioPreview && (
            <div className="w-full flex items-center gap-2 p-2 bg-accent rounded-lg">
                <AudioPlayer audioUrl={audioPreview} isSender={true} />
                <Button variant="ghost" size="icon" onClick={discardRecording}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
            </div>
         )}
         <div className="flex items-center w-full gap-2">
            {!isRecording && !inputValue && !audioPreview && (
              <>
                <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" multiple/>
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={() => imageInputRef.current?.click()}>
                    <ImageIcon className="h-5 w-5 text-primary"/>
                </Button>
              </>
            )}
            <div className="relative w-full">
                <Input 
                    placeholder={isRecording ? "Recording..." : "Type a message..."} 
                    className="pr-24 bg-accent rounded-full h-10"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isRecording || !!audioPreview}
                />
                 <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Smile className="h-5 w-5 text-primary"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none mb-2">
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </PopoverContent>
                    </Popover>
                    {!inputValue && !audioPreview && (
                        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleRecording}>
                            {isRecording ? <Square className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5 text-primary"/>}
                        </Button>
                    )}
                 </div>
            </div>
            { (inputValue || imagePreviews.length > 0 || audioPreview) &&
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={handleSendMessage}>
                    <Send className="h-5 w-5 text-primary"/>
                </Button>
            }
        </div>
      </footer>
    </div>
  );
}
