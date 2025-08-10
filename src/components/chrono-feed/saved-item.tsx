
import Image from "next/image";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";

type SavedItemProps = {
    item: {
        title: string;
        source: string;
        type: string;
        imageUrl: string;
        imageHint: string;
    }
}

export default function SavedItem({ item }: SavedItemProps) {
    return (
        <li className="p-2 hover:bg-accent cursor-pointer">
            <div className="flex items-center gap-4">
                <Image src={item.imageUrl} alt={item.title} width={80} height={80} className="rounded-lg object-cover" data-ai-hint={item.imageHint}/>
                <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">From {item.source}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                </div>
                 <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                </Button>
            </div>
        </li>
    )
}
