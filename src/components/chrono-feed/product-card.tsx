
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type ProductCardProps = {
    product: {
        name: string;
        price: string;
        location: string;
        imageUrl: string;
        imageHint: string;
    }
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-square relative">
                <Image src={product.imageUrl} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.imageHint} />
            </div>
            <CardContent className="p-2">
                <p className="font-semibold">{product.price}</p>
                <p className="text-sm truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.location}</p>
            </CardContent>
        </Card>
    )
}
