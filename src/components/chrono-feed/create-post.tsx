
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Image, Smile, Video } from 'lucide-react';

type CreatePostProps = {
  onOpenDialog: () => void;
};

export default function CreatePost({ onOpenDialog }: CreatePostProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <button
              onClick={onOpenDialog}
              className="w-full text-left bg-accent hover:bg-accent/80 text-muted-foreground rounded-full px-4 py-2.5 cursor-pointer text-base"
            >
              What's on your mind?
            </button>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-around">
            <Button variant="ghost" className="hidden sm:flex flex-1 gap-2 text-muted-foreground font-semibold" onClick={onOpenDialog}>
                <Video className="h-6 w-6 text-red-500" />
                Live video
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={onOpenDialog}>
                <Image className="h-6 w-6 text-green-500" />
                Photo/video
            </Button>
            <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={onOpenDialog}>
                <Smile className="h-6 w-6 text-yellow-500" />
                Feeling/activity
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
