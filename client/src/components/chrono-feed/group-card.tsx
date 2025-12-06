
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GroupCardProps = {
    group: {
        name: string;
        members: string;
        coverUrl: string;
        coverHint: string;
    }
}

export default function GroupCard({ group }: GroupCardProps) {
    return (
        <Card className="overflow-hidden h-full flex flex-col hover:bg-accent transition-colors">
             <div className="relative h-36">
                <Image src={group.coverUrl} alt={`${group.name} cover`} fill objectFit="cover" data-ai-hint={group.coverHint}/>
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg">{group.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{group.members}</p>
                <Button className="w-full mt-auto" onClick={(e) => e.preventDefault()}>Join Group</Button>
            </CardContent>
        </Card>
    )
}
