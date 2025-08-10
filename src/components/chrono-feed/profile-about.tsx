
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, GraduationCap, Heart, Home } from 'lucide-react';

const AboutItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-center gap-4 text-sm">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span>{text}</span>
    </div>
)

export default function ProfileAbout() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <AboutItem icon={Briefcase} text="Works at ChronoFeed" />
                <AboutItem icon={GraduationCap} text="Studied at University of Design" />
                <AboutItem icon={Home} text="Lives in Techville, CA" />
                <AboutItem icon={Heart} text="Single" />
            </CardContent>
        </Card>
    )
}
