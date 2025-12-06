
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

type VideoCardProps = {
    video: {
        title: string;
        uploader: string;
        views: string;
        thumbnailUrl: string;
        thumbnailHint: string;
    }
}

export default function VideoCard({ video }: VideoCardProps) {
    return (
        <Card>
            <CardHeader className="p-4">
                 <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                        <AvatarImage src="https://placehold.co/40x40.png" alt={video.uploader} data-ai-hint="logo abstract" />
                        <AvatarFallback>{video.uploader.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-semibold">{video.uploader}</p>
                        <p className="text-xs text-muted-foreground">{video.views}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="mb-4">{video.title}</p>
                <div className="aspect-video relative">
                     <Image src={video.thumbnailUrl} alt={video.title} layout="fill" objectFit="cover" className="rounded-lg" data-ai-hint={video.thumbnailHint}/>
                </div>
            </CardContent>
        </Card>
    )
}
