import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

type CreatePostProps = {
  onOpenDialog: () => void;
};

export default function CreatePost({ onOpenDialog }: CreatePostProps) {
  return (
    <Card>
      <CardContent className="p-4">
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
      </CardContent>
    </Card>
  );
}
