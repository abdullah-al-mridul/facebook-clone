import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Video, Image, Smile } from 'lucide-react';

export default function CreatePost() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="profile person"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="w-full text-left bg-accent hover:bg-accent/80 text-muted-foreground rounded-full px-4 py-2.5 cursor-pointer text-base">
              What's on your mind?
            </div>
          </div>
        </div>
      </CardContent>
      <Separator className="mx-4 w-auto" />
      <CardFooter className="p-2">
        <div className="flex justify-around w-full">
          <Button variant="ghost" className="flex-1 gap-2">
            <Video className="h-6 w-6 text-red-500" />
            <span className="text-muted-foreground font-semibold">Live video</span>
          </Button>
          <Button variant="ghost" className="flex-1 gap-2">
            <Image className="h-6 w-6 text-green-500" />
            <span className="text-muted-foreground font-semibold">Photo/video</span>
          </Button>
          <Button variant="ghost" className="flex-1 gap-2">
            <Smile className="h-6 w-6 text-yellow-500" />
            <span className="text-muted-foreground font-semibold">Feeling/activity</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
